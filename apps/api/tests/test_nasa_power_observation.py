import unittest

from services.nasa_power_observation import map_nasa_power_daily_record
from services.provider_observation import ProviderObservationError


class NasaPowerObservationTests(unittest.TestCase):
    def setUp(self):
        self.record = {
            "date": "20261110",
            "values": {
                "T2M": 21.4,
                "T2M_MAX": 26.2,
                "T2M_MIN": 16.1,
                "RH2M": 63.0,
                "PRECTOTCORR": None,
                "WS10M": 3.2,
                "ALLSKY_SFC_SW_DWN": 5.7,
                "UNSUPPORTED_PARAMETER": 123,
            },
        }
        self.units = {
            "T2M": "C",
            "T2M_MAX": "C",
            "T2M_MIN": "C",
            "RH2M": "%",
            "WS10M": "m/s",
            "ALLSKY_SFC_SW_DWN": "kWh/m2/day",
        }

    def test_maps_only_supported_non_null_parameters_with_provider_provenance(self):
        observations = map_nasa_power_daily_record(
            record=self.record,
            units=self.units,
            site_id="registered-site-01",
            source_id="registered-nasa-power-source",
        )
        self.assertEqual(len(observations), 6)
        temperature = next(x for x in observations if x["metric"] == "weather.air_temperature_mean")
        self.assertEqual(temperature["value"], 21.4)
        self.assertEqual(temperature["observed_at"], "2026-11-10T00:00:00+00:00")
        self.assertEqual(temperature["provenance"]["provider"], "NASA POWER")
        self.assertEqual(temperature["provenance"]["acquisition_method"], "provider_api")
        self.assertIn("gridded_or_reanalysis", temperature["quality_flags"])
        self.assertNotIn("verification_status", temperature)
        self.assertNotIn("confidence", temperature)

    def test_missing_fill_values_are_omitted(self):
        observations = map_nasa_power_daily_record(
            record=self.record,
            units=self.units,
            site_id="registered-site-01",
            source_id="registered-nasa-power-source",
        )
        self.assertNotIn("weather.precipitation_corrected", {x["metric"] for x in observations})

    def test_requires_explicit_registered_identity(self):
        with self.assertRaises(ProviderObservationError):
            map_nasa_power_daily_record(
                record=self.record, units=self.units, site_id="",
                source_id="registered-nasa-power-source"
            )

    def test_requires_provider_units_for_non_null_value(self):
        with self.assertRaisesRegex(ProviderObservationError, "unit metadata"):
            map_nasa_power_daily_record(
                record=self.record, units={}, site_id="site",
                source_id="source"
            )

    def test_rejects_invalid_calendar_date(self):
        with self.assertRaisesRegex(ProviderObservationError, "date is invalid"):
            map_nasa_power_daily_record(
                record={"date": "20260230", "values": {}}, units={},
                site_id="site", source_id="source"
            )


if __name__ == "__main__":
    unittest.main()
