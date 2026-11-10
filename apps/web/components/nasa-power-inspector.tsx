'use client';

import { useState, type FormEvent } from 'react';

type PowerRecord = { date: string; values: Record<string, number | null> };
type PowerResponse = {
  status: string;
  data_source: string;
  data_product: string;
  data_interpretation: string;
  attribution: string;
  attribution_url: string;
  requested_location: { latitude: number; longitude: number };
  requested_period: { start_date: string; end_date: string };
  methodology: { type: string; derived_forecast: boolean };
  units: Record<string, string>;
  source_metadata: { time_standard?: string; sources?: string[] };
  records: PowerRecord[];
};

const API_BASE = process.env.NEXT_PUBLIC_NOVA_CORE_API_URL?.replace(/\/$/, '');

export function NasaPowerInspector() {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [result, setResult] = useState<PowerResponse | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function loadData(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setResult(null);
    if (!API_BASE) {
      setError('NOVA Core API URL is not configured for this deployment. Set NEXT_PUBLIC_NOVA_CORE_API_URL after the NOVA Core Worker is deployed.');
      return;
    }
    const lat = Number(latitude);
    const lon = Number(longitude);
    if (!Number.isFinite(lat) || lat < -90 || lat > 90 || !Number.isFinite(lon) || lon < -180 || lon > 180) {
      setError('Enter a valid latitude (-90 to 90) and longitude (-180 to 180).');
      return;
    }
    if (!startDate || !endDate || endDate < startDate) {
      setError('Choose a valid date range. The end date must be on or after the start date.');
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        latitude: String(lat),
        longitude: String(lon),
        start_date: startDate,
        end_date: endDate,
      });
      const response = await fetch(`${API_BASE}/api/v1/data/weather/nasa-power/daily?${params.toString()}`);
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.detail || `NOVA Core returned HTTP ${response.status}`);
      setResult(payload as PowerResponse);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to retrieve NASA POWER data.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="ag-panel mb-6">
      <div className="ag-panel-head">
        <div>
          <h3>NASA POWER · observed and reanalysis weather data</h3>
          <p>Live provider retrieval through NOVA Core. Enter the intended site coordinates; no demo location is assumed.</p>
        </div>
        <span className="ag-chip">Provider data · not field telemetry</span>
      </div>
      <form onSubmit={loadData} className="grid grid-cols-1 gap-3 md:grid-cols-5">
        <label className="text-xs text-slate-300">Latitude
          <input required type="number" min="-90" max="90" step="any" value={latitude} onChange={(e) => setLatitude(e.target.value)} placeholder="e.g. 36.8" className="mt-1 w-full rounded border border-white/15 bg-slate-950 px-3 py-2 text-sm text-white" />
        </label>
        <label className="text-xs text-slate-300">Longitude
          <input required type="number" min="-180" max="180" step="any" value={longitude} onChange={(e) => setLongitude(e.target.value)} placeholder="e.g. 10.2" className="mt-1 w-full rounded border border-white/15 bg-slate-950 px-3 py-2 text-sm text-white" />
        </label>
        <label className="text-xs text-slate-300">Start date
          <input required type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="mt-1 w-full rounded border border-white/15 bg-slate-950 px-3 py-2 text-sm text-white" />
        </label>
        <label className="text-xs text-slate-300">End date
          <input required type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="mt-1 w-full rounded border border-white/15 bg-slate-950 px-3 py-2 text-sm text-white" />
        </label>
        <div className="flex items-end">
          <button disabled={loading} type="submit" className="w-full rounded bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{loading ? 'Retrieving…' : 'Retrieve daily data'}</button>
        </div>
      </form>
      {error && <p role="alert" className="mt-3 rounded border border-amber-500/30 bg-amber-950/20 p-3 text-sm text-amber-200">{error}</p>}
      {!API_BASE && !error && <p className="mt-3 text-xs text-amber-200">Awaiting NOVA Core deployment and NEXT_PUBLIC_NOVA_CORE_API_URL configuration.</p>}
      {result && (
        <div className="mt-4 space-y-3">
          <div className="ag-chip-row">
            <span>{result.records.length} daily records</span>
            <span>UTC request · provider time standard {result.source_metadata?.time_standard || 'not supplied'}</span>
            <span>{result.requested_period.start_date} → {result.requested_period.end_date}</span>
          </div>
          <p className="text-xs text-slate-300">{result.data_interpretation}. Coordinates: {result.requested_location.latitude}, {result.requested_location.longitude}.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead><tr><th className="p-2">Date</th>{Object.keys(result.units).map((key) => <th key={key} className="p-2">{key} ({result.units[key] || 'unit n/a'})</th>)}</tr></thead>
              <tbody>{result.records.slice(-14).map((record) => <tr key={record.date} className="border-t border-white/10"><td className="p-2">{record.date}</td>{Object.keys(result.units).map((key) => <td key={key} className="p-2">{record.values[key] == null ? '—' : record.values[key]}</td>)}</tr>)}</tbody>
            </table>
          </div>
          <p className="text-xs text-slate-400">Showing the latest 14 rows. Missing provider values remain null; no interpolation or forecast is applied. Source: <a className="underline" href={result.attribution_url} target="_blank" rel="noreferrer">{result.attribution}</a>.</p>
        </div>
      )}
    </section>
  );
}
