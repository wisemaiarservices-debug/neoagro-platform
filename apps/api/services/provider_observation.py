"""Build NOVA Core envelopes from explicitly identified provider records.

This mapper performs local shape checks only. NOVA Core remains responsible for
authentication, grants, ownership, validation, persistence and verification.
"""
from __future__ import annotations

import math
import re
from datetime import datetime
from typing import Any


_IDENTIFIER = re.compile(r"^[a-z][a-z0-9_.-]{0,119}$")
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
        "site_id": site_id,
        "source_id": source_id,
        "provider": provider,
        "idempotency_key": idempotency_key,
        "unit": unit,
    }
    if any(not isinstance(v, str) or not v.strip() for v in required.values()):
        raise ProviderObservationError("required provider observation identity is missing")
    if acquisition_method not in _ALLOWED_METHODS:
        raise ProviderObservationError("unsupported provider acquisition method")
    if not isinstance(metric, str) or not _IDENTIFIER.fullmatch(metric):
        raise ProviderObservationError("metric must be a lowercase identifier")
    if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value):
        raise ProviderObservationError("value must be a finite JSON number")
    if len(unit) > 48 or any(ord(ch) < 32 for ch in unit):
        raise ProviderObservationError("unit is invalid")
    if source_record_ref is not None and (
        not isinstance(source_record_ref, str) or len(source_record_ref) > 240
    ):
        raise ProviderObservationError("source record reference is invalid")
    try:
        timestamp = datetime.fromisoformat(observed_at.replace("Z", "+00:00"))
    except (AttributeError, TypeError, ValueError) as exc:
        raise ProviderObservationError("observed_at must be an ISO timestamp") from exc
    if timestamp.tzinfo is None or timestamp.utcoffset() is None:
        raise ProviderObservationError("observed_at must include a timezone")

    flags = list(quality_flags or [])
    if len(flags) != len(set(flags)) or set(flags) - _ALLOWED_FLAGS:
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
        if not isinstance(asset_id, str) or not asset_id.strip():
            raise ProviderObservationError("asset_id must be a non-empty registered identifier")
        payload["asset_id"] = asset_id.strip()
    return payload
