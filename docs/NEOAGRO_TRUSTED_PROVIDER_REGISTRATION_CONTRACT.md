# NeoAgro trusted provider and source-registration contract

## Status

Design contract only. No provider is currently authenticated, no real site/source/asset registration is provisioned by this document, and no producer route is enabled. The NOVA Core ingestion feature flag remains disabled by default.

This contract is a prerequisite for connecting a real provider. It is not evidence that any feed is live or that any observation is verified.

## Authority and ownership

- NOVA Core is authoritative for tenant, site, asset and source ownership, module/source grants, ingestion audit and the initial `unverified` observation state.
- NeoAgro must not create a shadow tenant/site/source registry or accept tenant IDs from provider payloads.
- Provider credentials identify the external integration, not a tenant or site. Resolve the provider account and external resource to an existing Core source registration through an approved server-side administrative process.
- The mapping from provider account/resource to Core `site_id`, `asset_id` (when applicable) and `source_id` must be explicit, reviewed and effective-dated. Unknown, ambiguous, expired or revoked mappings stop ingestion.
- A source ID supplied by a browser, webhook body or untrusted job argument is never sufficient proof of registration.

## Provider authentication profiles

A future integration must select and document one concrete profile before implementation:

1. **Authenticated pull API:** NeoAgro server authenticates to the provider using its supported OAuth/API-key mechanism, validates the provider account identity and retrieves records over TLS.
2. **Authenticated webhook:** verify the provider's documented signature scheme over the exact raw request bytes, enforce timestamp/replay windows and key rotation, then resolve the signed account/resource to a registered source.
3. **Managed device/gateway:** authenticate a device or gateway using a provisioned identity (for example, mutual TLS or a supported signed-token mechanism), verify its active registration and resolve its device identity to one Core source.

Do not treat a public URL, caller-supplied provider name, static unverified header, IP address alone, or browser session as producer authentication. Do not invent a signature algorithm or assume a provider supports one.

## Required source binding

The server-side resolver must return one unambiguous active binding containing:

- provider and authenticated provider-account identity;
- external resource/device identifier;
- Core site, source and optional asset identifiers;
- NeoAgro module grant and allowed metric/parameter set;
- declared acquisition class: `provider_api`, `satellite` or `model` for the current provider mapper;
- allowed units and any explicit provider-to-Core metric mapping;
- effective-from and optional effective-to timestamps;
- registration/review state and the evidence or administrative record supporting the binding.

The binding must be checked for every ingestion batch (or against a bounded, invalidatable cache). Revocation and expiry must take effect without waiting for a long-lived process restart. Exactly one active binding must match; zero or multiple matches fail closed.

Do not add aliases, unit conversions, metric conversions, or asset inference implicitly. Each transformation requires an explicit, versioned and tested mapping with source and target units and method provenance. If no approved mapping exists, quarantine/reject the record rather than guessing.

## Record processing and replay controls

For each provider record:

1. Authenticate the producer using the selected provider-specific profile.
2. Derive provider account and external resource identity from the authenticated response/signature, not from an untrusted payload field.
3. Resolve the exact active source binding and verify the metric/unit allowlist.
4. Validate numeric finiteness, timezone-aware observation time, provider record identity, request size and allowed quality flags.
5. Derive a stable idempotency key from the authenticated provider account, external resource and immutable provider record ID (or a documented canonical record digest where the provider has no record ID). Never use a random key that defeats retries.
6. Preserve provider, acquisition method, original record reference, observed timestamp, unit and transformation version in provenance.
7. Submit only through the server-side NOVA Core transport with Cloudflare Access service credentials. Never send credentials to a browser.
8. Treat only an explicit Core acceptance response as transport acceptance. Core persists the observation as `unverified`; this does not mean the measurement is verified or quality-assessed.

Retries must reuse the same idempotency key. A reused key with different content must be surfaced as a conflict, not silently overwritten. Bound retry count and response size; do not log credentials or full sensitive payloads.

## Scientific and provenance classification

- `provider_api` means a record was obtained from the named provider API; it does not imply a field sensor or ground-truth measurement.
- `satellite` and `model` inputs must retain the `gridded_or_reanalysis` quality flag and identify the product, version, spatial/temporal resolution and processing method where available.
- A provider's weather or remote-sensing estimate must not be represented as an on-site sensor reading.
- Missing fields remain unknown. Do not synthesize a site value, timestamp, asset, unit, crop parameter or confidence score.
- Transport acceptance, source registration, observation verification, sensor calibration and measurement-quality assessment are separate states. Do not collapse them into a single “trusted” flag.

## Required acceptance tests before enabling a producer

- unauthenticated, invalid-signature, expired-signature and replayed webhook requests are rejected (for webhook profile);
- invalid provider credentials and unexpected provider account identities are rejected (for pull API profile);
- unknown, ambiguous, expired and revoked external-resource bindings fail closed;
- cross-tenant, cross-site, wrong-module and wrong-source mappings are rejected by Core;
- metric and unit allowlists reject unknown values and unsupported conversions;
- duplicate record delivery is idempotent; conflicting reuse of an idempotency key is rejected;
- provider timestamps, pagination, backfills, daylight-saving boundaries and late-arriving records are handled deterministically;
- Core acceptance is confirmed and the persisted observation remains `unverified`;
- logs and error responses contain no provider or Cloudflare Access secrets;
- a live end-to-end test proves the authenticated producer, exact source grant, Core persistence and audit trail without using demo fixtures.

## Enablement gate

Keep `NOVA_CORE_INGESTION_ENABLED=false` until all of the following are true:

- a real provider/device and authentication profile have been selected;
- the provider account and external resource are authenticated and mapped to approved Core source records;
- the Core tenant-aware ingestion Worker, D1 migrations, Access Service Auth policy and exact service/module/source grants have been deployed and independently checked;
- the dedicated custom hostname is protected by the intended Cloudflare Access policy and is the only host in the exact allowlist;
- the producer route is server-only, has bounded payloads/retries and passes the acceptance tests above;
- a human reviewer has confirmed the source registration and data classification.

No production environment variables, secrets, source grants or deployments are changed by this contract.
