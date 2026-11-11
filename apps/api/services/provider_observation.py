"""Build NOVA Core envelopes from explicitly identified provider records.

This mapper mirrors the NOVA Core observation shape checks. Core remains
authoritative for authentication, grants, ownership, validation and persistence.
"""
from __future__ import annotations

import math
import re
from datetime import datetime, timedelta, timezone
from typing import Any


_IDENTIFIER = re.compile(r"^[a-z][a-z0-9_.-]{0,119}$")
_UNIT = re.compile(r"^[A-Za-z0-9%°µμ/._ -]{1,48}$")
_ALLOWED_METHODS = {"provider_api", "satellite", "model"}
_ALLOWED_FLAGS = {
    "estimated",
    "provider_fill_value",
    "gridded_or_reanalysis",
    "time_alignment_uncertain",
}


class ProviderObservationError(ValueError):
    """Raised when a provider record cannot be represented safely."""


def build_provider_observation(
    *,
    site_id: str,
    source_id: str,
    metric: str,
    value: int | float,
    unit: str,
    observed_at: str,
    provider: str,
    acquisition_method: str,
    idempotency_key: str,
    source_record_ref: str | None = None,
    quality_flags: list[str] | None = None,
    asset_id: str | None = None,
) -> dict[str, Any]:
    """Map one provider record without inventing identities or trust status."""
    required = {
        "site_id": (site_id, 120),
        "source_id": (source_id, 120),
        "provider": (provider, 120),
        "idempotency_key": (idempotency_key, 200),
        "unit": (unit, 48),
    }
    for name, (value_text, max_length) in required.items():
        if (
            not isinstance(value_text, str)
            or not value_text.strip()
            or len(value_text.strip()) > max_length
        ):
            raise ProviderObservationError(f"{name} is missing or invalid")

    if not isinstance(acquisition_method, str) or acquisition_method not in _ALLOWED_METHODS:
        raise ProviderObservationError("unsupported provider acquisition method")
    if not isinstance(metric, str) or not _IDENTIFIER.fullmatch(metric):
        raise ProviderObservationError("metric must be a lowercase identifier")
    if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value):
        raise ProviderObservationError("value must be a finite JSON number")
    if not isinstance(unit, str) or not _UNIT.fullmatch(unit.strip()):
        raise ProviderObservationError("unit contains unsupported characters")
    if source_record_ref is not None and (
        not isinstance(source_record_ref, str)
        or len(source_record_ref) > 240
        or any(ord(ch) < 32 for ch in source_record_ref)
    ):
        raise ProviderObservationError("source record reference is invalid")

    try:
        if not isinstance(observed_at, str):
            raise TypeError("timestamp must be a string")
        timestamp = datetime.fromisoformat(
            observed_at[:-1] + "+00:00" if observed_at.endswith("Z") else observed_at
        )
    except (TypeError, ValueError) as exc:
        raise ProviderObservationError("observed_at must be an ISO timestamp") from exc
    if timestamp.tzinfo is None or timestamp.utcoffset() is None:
        raise ProviderObservationError("observed_at must include a timezone")
    timestamp = timestamp.astimezone(timezone.utc)
    if timestamp > datetime.now(timezone.utc) + timedelta(minutes=5):
        raise ProviderObservationError("observed_at cannot be more than five minutes in the future")

    if quality_flags is not None and (
        not isinstance(quality_flags, list)
        or any(not isinstance(flag, str) for flag in quality_flags)
    ):
        raise ProviderObservationError("quality flags are invalid")
    flags = list(quality_flags or [])
    if len(flags) > 16 or len(flags) != len(set(flags)) or set(flags) - _ALLOWED_FLAGS:
        raise ProviderObservationError("quality flags are invalid")
    if acquisition_method in {"model", "satellite"} and "gridded_or_reanalysis" not in flags:
        flags.append("gridded_or_reanalysis")

    payload: dict[str, Any] = {
        "site_id": site_id.strip(),
        "source_id": source_id.strip(),
        "module": "neoagro",
        "metric": metric,
        "value": value,
        "unit": unit.strip(),
        "observed_at": timestamp.isoformat(),
        "idempotency_key": idempotency_key.strip(),
        "provenance": {
            "provider": provider.strip(),
            "acquisition_method": acquisition_method,
            "source_record_ref": source_record_ref,
        },
        "quality_flags": flags,
    }
    if asset_id is not None:
        if not isinstance(asset_id, str) or not asset_id.strip() or len(asset_id.strip()) > 120:
            raise ProviderObservationError("asset_id must be a valid registered identifier")
        payload["asset_id"] = asset_id.strip()
    return payload
