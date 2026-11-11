import unittest
from datetime import datetime, timedelta, timezone

from services.provider_observation import (
    ProviderObservationError,
    build_provider_observation,
)


class ProviderObservationMapperTests(unittest.TestCase):
    def base(self):
        return {
            "site_id": "registered-site-01",
            "source_id": "registered-weather-source-01",
            "metric": "weather.air_temperature",
            "value": 24.5,
            "unit": "degC",
            "observed_at": "2026-11-10T12:00:00Z",
            "provider": "NASA POWER",
            "acquisition_method": "provider_api",
            "idempotency_key": "nasa-power:record-2026-11-10",
            "source_record_ref": "provider-record-2026-11-10",
        }

    def test_provider_api_record_preserves_explicit_identity_and_provenance(self):
        payload = build_provider_observation(**self.base())
        self.assertEqual(payload["module"], "neoagro")
        self.assertEqual(payload["site_id"], "registered-site-01")
        self.assertEqual(payload["provenance"]["provider"], "NASA POWER")
        self.assertEqual(payload["provenance"]["acquisition_method"], "provider_api")
        self.assertEqual(payload["quality_flags"], [])
        self.assertNotIn("verification_status", payload)
        self.assertNotIn("confidence", payload)

    def test_model_and_satellite_records_are_flagged_as_gridded(self):
        for method in ("model", "satellite"):
            payload = build_provider_observation(**{
                **self.base(), "acquisition_method": method
            })
            self.assertIn("gridded_or_reanalysis", payload["quality_flags"])

    def test_does_not_infer_site_or_source_ids(self):
        for key in ("site_id", "source_id"):
            args = self.base()
            args.pop(key)
            with self.subTest(key=key), self.assertRaises(TypeError):
                build_provider_observation(**args)

    def test_rejects_sensor_claims_in_provider_mapper(self):
        with self.assertRaisesRegex(ProviderObservationError, "acquisition method"):
            build_provider_observation(**{
                **self.base(), "acquisition_method": "sensor"
            })

    def test_rejects_boolean_nan_and_infinite_values(self):
        for value in (True, float("nan"), float("inf"), float("-inf")):
            with self.subTest(value=value), self.assertRaises(ProviderObservationError):
                build_provider_observation(**{**self.base(), "value": value})

    def test_rejects_timezone_free_timestamp(self):
        with self.assertRaisesRegex(ProviderObservationError, "timezone"):
            build_provider_observation(**{
                **self.base(), "observed_at": "2026-11-10T12:00:00"
            })

    def test_rejects_future_timestamp_beyond_core_tolerance(self):
        future = (datetime.now(timezone.utc) + timedelta(minutes=6)).isoformat()
        with self.assertRaisesRegex(ProviderObservationError, "future"):
            build_provider_observation(**{**self.base(), "observed_at": future})

    def test_rejects_units_outside_core_character_contract(self):
        for unit in ("degC<script>", "unit\\n", "x" * 49):
            with self.subTest(unit=unit), self.assertRaises(ProviderObservationError):
                build_provider_observation(**{**self.base(), "unit": unit})

    def test_rejects_oversized_identity_and_idempotency_fields(self):
        for key, value in (
            ("site_id", "s" * 121),
            ("source_id", "s" * 121),
            ("provider", "p" * 121),
            ("idempotency_key", "k" * 201),
        ):
            with self.subTest(key=key), self.assertRaises(ProviderObservationError):
                build_provider_observation(**{**self.base(), key: value})

    def test_rejects_unknown_or_duplicate_quality_flags(self):
        for flags in (["invented_flag"], ["estimated", "estimated"], ["estimated"] * 17):
            with self.subTest(flags=flags), self.assertRaises(ProviderObservationError):
                build_provider_observation(**{**self.base(), "quality_flags": flags})


if __name__ == "__main__":
    unittest.main()
