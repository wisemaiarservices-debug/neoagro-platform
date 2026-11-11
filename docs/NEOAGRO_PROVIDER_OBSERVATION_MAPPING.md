# NeoAgro provider observation mapping

## Purpose

This is a pure, server-side mapping utility for converting one already-acquired external provider record into the NOVA Core observation envelope. It does not fetch data, create site/source identities, authenticate a producer, write to Core, or verify the observation.

## Required explicit inputs

The caller must supply the actual registered `site_id` and `source_id`, provider name, metric, numeric value, unit, timezone-aware observation timestamp, provider acquisition method and a stable source/idempotency reference. The mapper never supplies default site, asset or source identifiers.

Supported acquisition methods are `provider_api`, `satellite` and `model`. Satellite/model records automatically receive the Core quality flag `gridded_or_reanalysis`. Provider API data remains provider-sourced data; it is not a field sensor reading. The mapper rejects `sensor` as an acquisition method because this utility is specifically for external provider records.

The output deliberately contains no caller-controlled verification status, confidence, actor identity or impact estimate. NOVA Core assigns its own unverified state and remains authoritative for authentication, service grants, ownership, validation, persistence, idempotency and audit.

## NASA POWER interpretation

NASA POWER daily values are gridded/model-derived provider data, not measurements from a NeoAgro field sensor. If a future producer maps those values, it must use the real registered source/site identifiers, preserve the provider's temporal and spatial resolution, use an appropriate `model`/provider provenance classification, and retain the `gridded_or_reanalysis` flag. Do not relabel them as field observations or infer an exact farm measurement from a grid cell.

## Activation gates

- No producer route or scheduled job calls this mapper yet.
- No NASA POWER record is currently posted to NOVA Core by this change.
- No site/source/asset IDs are seeded or assumed.
- The separate authenticated NOVA Core ingestion Worker, Access Service Auth policy, D1 binding and real ownership records must be provisioned and live-tested before a producer is enabled.
- A successful mapping/unit test is not evidence of delivery, persistence, field validity or forecast accuracy.

Keep the mapper behind trusted backend code. Never expose service-token credentials or accept arbitrary browser payloads as verified observations.
