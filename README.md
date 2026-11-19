# NeoAgro Platform

**NOVA Agriculture powered by NeoAgro**

NeoAgro is the agrivoltaic intelligence module of **NOVA OS**, the AI Operating System for Sustainable Infrastructure by NeoHaven AI Urban Labs.

## Purpose

NeoAgro connects field, crop, water, weather, satellite, solar, and infrastructure data into one decision intelligence workflow.

## Parent Platform

NOVA OS — AI Operating System for Sustainable Infrastructure.

## Product Role

NeoAgro is one module in the NeoHaven product ecosystem:

- NOVA Energy, powered by NeoGrid
- NOVA Agriculture, powered by NeoAgro
- NOVA Infrastructure, powered by NeoCell
- NOVA Twin
- NOVA Intelligence

## Core Workflow

Observe → Analyze → Forecast → Recommend → Simulate → Optimize → Measure Impact

## SolarHub Demo Focus

The September SolarHub demo should show one connected agrivoltaic site:

1. A heatwave is forecast.
2. NeoAgro predicts increased irrigation need.
3. NeoGrid coordinates energy and battery timing.
4. NeoCell confirms infrastructure and telemetry readiness.
5. NOVA Twin simulates baseline vs optimized scenarios.
6. NOVA Intelligence recommends an operator-approved action.
7. NOVA measures water, energy, carbon, and resilience impact.

## Active Local App

The current PC active app path is temporarily:

```text
Neohaven/06_DEVELOPMENT/neoagro-platform/neoagro-platform/neoagro-platform
```

Do not move this app until after the July SolarHub submission.


## Web runtime security baseline

The App Router frontend now uses Next.js `16.4.6` with React and React DOM `19.3.1`, Node.js `>=20.9.0`, and a pnpm v10 lockfile. The pnpm override pins `source-map-js` to the patched `1.2.4` line and `react-is` to match React 19. CI installs with `pnpm install --frozen-lockfile`, runs the web regression tests, TypeScript check, production dependency audit, full dependency audit, and production build. On the validated PR head, both dependency audits reported no known vulnerabilities. This is source/CI evidence for the preview branch, not evidence that the production deployment has been updated.
