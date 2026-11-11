"""Translate NASA POWER daily records into explicitly gridded observations."""
from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from services.provider_observation import (
    ProviderObservationError,
    build_provider_observation,
)

# Metrics are intentionally semantic labels, not claims of local sensor readings.
NASA_POWER_METRICS = {
    "T2M": "weather.air_temperature_mean",
    "T2M_MAX": "weather.air_temperature_max",
    "T2M_MIN": "weather.air_temperature_min",
    "RH2M": "weather.relative_humidity",
    "PRECTOTCORR": "weather.precipitation_corrected",
    "WS10M": "weather.wind_speed_10m",
    "ALLSKY_SFC_SW_DWN": "solar.surface_shortwave_radiation",
}


def map_nasa_power_daily_record(
    *,
    record: dict[str, Any],
    units: dict[str, str],
    site_id: str,
    source_id: str,
) -> list[dict[str, Any]]:
    """Map available NASA POWER values; missing/fill values are omitted."""
    day = record.get("date")
    values = record.get("values")
    if not isinstance(day, str) or len(day) != 8 or not day.isdigit():
        raise ProviderObservationError("NASA POWER date must use YYYYMMDD")
    try:
        observed_at = datetime.strptime(day, "%Y%m%d").replace(
            tzinfo=timezone.utc
        ).isoformat()
    except ValueError as exc:
        raise ProviderObservationError("NASA POWER date is invalid") from exc
    if not isinstance(values, dict):
        raise ProviderObservationError("NASA POWER values must be an object")

    observations = []
    for parameter, metric in NASA_POWER_METRICS.items():
        value = values.get(parameter)
        if value is None:
            continue
        unit = units.get(parameter)
        if not isinstance(unit, str) or not unit.strip():
            raise ProviderObservationError(
                f"NASA POWER unit metadata missing for {parameter}"
            )
        observations.append(
            build_provider_observation(
                site_id=site_id,
                source_id=source_id,
                metric=metric,
                value=value,
                unit=unit,
                observed_at=observed_at,
                provider="NASA POWER",
                acquisition_method="provider_api",
                idempotency_key=f"nasa-power:{day}:{parameter}",
                source_record_ref=f"{day}:{parameter}",
                quality_flags=["gridded_or_reanalysis"],
            )
        )
    return observations
