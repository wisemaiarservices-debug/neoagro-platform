"""Server-only NeoAgro -> NOVA Core observation transport.

This module deliberately exposes no HTTP route. Call it only from trusted backend
jobs/services after NeoAgro has authenticated the producer and resolved registered
site, source and asset identifiers. Cloudflare Access credentials must remain in
server-side environment variables and must never be sent to a browser.
"""
from __future__ import annotations

import http.client
import json
import os
from typing import Any, Callable
from urllib.parse import urlsplit


class NovaCoreIngestionError(RuntimeError):
    """Safe transport error; never includes credentials or response headers."""

    def __init__(self, code: str, status: int | None = None) -> None:
        self.code = code
        self.status = status
        super().__init__(code if status is None else f"{code} (HTTP {status})")


def _configuration(environ: dict[str, str]) -> tuple[str, str, str, str]:
    endpoint = environ.get("NOVA_CORE_INGESTION_URL", "").strip()
    client_id = environ.get("NOVA_CORE_ACCESS_CLIENT_ID", "")
    client_secret = environ.get("NOVA_CORE_ACCESS_CLIENT_SECRET", "")
    if not endpoint or not client_id or not client_secret:
        raise NovaCoreIngestionError("nova_core_ingestion_not_configured")

    if any(char in client_id + client_secret for char in "\r\n"):
        raise NovaCoreIngestionError("nova_core_ingestion_credentials_invalid")
    parsed = urlsplit(endpoint)
    if (
        parsed.scheme != "https"
        or not parsed.hostname
        or parsed.username is not None
        or parsed.password is not None
        or parsed.query
        or parsed.fragment
        or parsed.path != "/api/v1/observations"
    ):
        raise NovaCoreIngestionError("nova_core_ingestion_endpoint_invalid")
    try:
        port = str(parsed.port or 443)
    except ValueError as exc:
        raise NovaCoreIngestionError("nova_core_ingestion_endpoint_invalid") from exc
    path = parsed.path
    return parsed.hostname, port, path, client_id + "\n" + client_secret


def submit_observation(
    payload: dict[str, Any],
    *,
    environ: dict[str, str] | None = None,
    connection_factory: Callable[..., Any] = http.client.HTTPSConnection,
) -> dict[str, Any]:
    """Submit one already-validated observation from a trusted server process.

    Core remains authoritative for authentication, grants, payload validation,
    ownership, provenance and idempotency. This client never marks data verified.
    """
    config = _configuration(dict(os.environ if environ is None else environ))
    host, port, path, credential_pair = config
    client_id, client_secret = credential_pair.split("\n", 1)
    if not isinstance(payload, dict):
        raise NovaCoreIngestionError("nova_core_payload_invalid")
    try:
        body = json.dumps(payload, allow_nan=False, separators=(",", ":")).encode("utf-8")
    except (TypeError, ValueError, UnicodeEncodeError) as exc:
        raise NovaCoreIngestionError("nova_core_payload_invalid") from exc
    if len(body) > 32_768:
        raise NovaCoreIngestionError("nova_core_payload_too_large")
    connection = connection_factory(host, int(port), timeout=10)
    try:
        connection.request(
            "POST",
            path,
            body=body,
            headers={
                "Content-Type": "application/json",
                "Accept": "application/json",
                "CF-Access-Client-Id": client_id,
                "CF-Access-Client-Secret": client_secret,
            },
        )
        response = connection.getresponse()
        raw = response.read(16_385)
        if len(raw) > 16_384:
            raise NovaCoreIngestionError("nova_core_response_too_large", response.status)
        if response.status not in (200, 201):
            # Do not echo upstream bodies: they may contain implementation details.
            raise NovaCoreIngestionError("nova_core_ingestion_rejected", response.status)
        try:
            result = json.loads(raw.decode("utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError) as exc:
            raise NovaCoreIngestionError("nova_core_response_invalid", response.status) from exc
        if not isinstance(result, dict) or result.get("accepted") is not True:
            raise NovaCoreIngestionError("nova_core_acceptance_unconfirmed", response.status)
        return result
    except NovaCoreIngestionError:
        raise
    except (OSError, TimeoutError, http.client.HTTPException) as exc:
        raise NovaCoreIngestionError("nova_core_ingestion_unavailable") from exc
    finally:
        connection.close()
