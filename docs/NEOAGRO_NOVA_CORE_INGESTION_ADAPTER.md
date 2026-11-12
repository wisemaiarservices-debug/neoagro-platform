# NeoAgro → NOVA Core server-side ingestion adapter

## Status

This change adds a transport helper and unit tests only. It does **not** connect NeoAgro's browser UI to the ingestion service, create a public write endpoint, provision identities or source records, or claim that observations are being accepted in production.

## Trust boundary

- Call `services.nova_core_ingestion.submit_observation` only from trusted backend code after the producer is authenticated and the site/source/asset identifiers have been resolved from an approved registry.
- Never call it from a browser component or expose the Cloudflare Access service-token credentials through `NEXT_PUBLIC_*`, HTML, local storage, logs or API responses.
- NOVA Core remains authoritative for Access JWT verification, service/module/source grants, payload validation, active site/source/asset ownership, idempotency, audit records and the server-assigned `unverified` status.
- The helper has no FastAPI route and is not invoked by the current synthetic demo endpoints.

## Required server environment

Set these only in the protected runtime that will execute a trusted producer:

- `NOVA_CORE_INGESTION_URL`: exact HTTPS URL ending in `/api/v1/observations`
- `NOVA_CORE_ACCESS_CLIENT_ID`: Cloudflare Access service-token client ID
- `NOVA_CORE_ACCESS_CLIENT_SECRET`: Cloudflare Access service-token secret

No credentials are included in this repository. Missing values fail closed. Redirects are not followed; the client connects directly to the configured HTTPS host and exact path. Timeouts, oversized responses, non-2xx responses and unconfirmed acceptance fail closed without echoing upstream response bodies or credentials.

## Before enabling a producer

1. Deploy the isolated NOVA Core ingestion Worker and protect its hostname with a Cloudflare Access Service Auth policy.
2. Provision a D1 database, apply the reviewed migration and bind it as `DB`.
3. Register the real NeoAgro site, asset and source records. Do not use the illustrative demo site ID as a real site.
4. Configure exact service → module → source grants for the NeoAgro producer.
5. Store the Access service token in the server runtime secret store; do not put it in Vercel client/public variables.
6. Add a producer-specific authenticated server workflow with validation, rate limiting and operational monitoring.
7. Run live acceptance tests for valid acceptance, wrong source/module, unknown site, inactive asset, retry idempotency, changed-payload conflict and D1 outage.

Until those gates pass, this adapter is an unconfigured integration foundation. The existing public NOVA Core API and NeoAgro demo behavior remain unchanged.

## Client-side envelope preflight

The transport helper mirrors NOVA Core's current v1 observation envelope checks before opening a network connection:

- Exact allowlisted top-level and provenance keys; required site, source and idempotency identifiers.
- Module is fixed to this adapter's own module identifier.
- Finite numeric value, bounded metric/unit strings and timezone-qualified RFC 3339 observation timestamp (not more than five minutes in the future).
- Allowlisted acquisition method and quality flags; bounded provenance fields.
- Bounded serialized request body; no credentials in the payload.

This is an early rejection layer, not an authorization or verification mechanism. Core revalidates every request and alone assigns persistence and verification status. Keep this mirror aligned with apps/ingestion-worker/src/observation-contract.mjs in NOVA Core when the contract changes.
