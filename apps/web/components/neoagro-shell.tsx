'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, Bell, Brain, Cpu, LayoutDashboard, Leaf, Search, TrendingUp } from 'lucide-react';
import type { ReactNode } from 'react';

const nav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/forecasting', label: 'Forecasting', icon: TrendingUp },
  { href: '/recommendations', label: 'Decision Support Review', icon: Brain },
  { href: '/sustainability', label: 'Sustainability', icon: Leaf },
  { href: '/digital-twin', label: 'Digital Twin', icon: Cpu },
];

export function NeoAgroShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="ag-shell">
      <aside className="ag-sidebar">
        <div className="ag-brand">
          <div className="ag-brand-mark"><Leaf size={18} /></div>
          <div>
            <div className="ag-brand-name">NeoAgro</div>
            <div className="ag-brand-sub">NOVA Agriculture</div>
          </div>
        </div>
        <nav className="ag-nav" aria-label="NeoAgro product routes">
          {nav.map((item) => {
            const active = pathname === item.href || (pathname === '/' && item.href === '/dashboard');
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className={`ag-nav-item ${active ? 'active' : ''}`}>
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="ag-status-card">
          <div className="ag-micro"><Activity size={14} /> System status</div>
          <strong>Read-only demo mode</strong>
          <span>No live site telemetry connected</span>
        </div>
      </aside>
      <div className="ag-main">
        <header className="ag-topbar">
          <div>
            <div className="ag-micro">SITE</div>
            <strong>Mesa Verde 01 / SolarHub Demo</strong>
          </div>
          <div className="ag-topbar-actions">
            <span className="ag-search"><Search size={14} /> Search fields, sensors...</span>
            <button aria-label="Notifications"><Bell size={16} /><i /></button>
            <div className="ag-avatar">NA</div>
          </div>
        </header>
        <main className="ag-content"><div role="status" className="mb-5 rounded-lg border border-amber-500/30 bg-amber-950/20 px-4 py-3 text-xs leading-5 text-amber-200"><b>Illustrative demo workspace.</b> Static charts, crop values, sensor states and asset figures are UI fixtures, not field observations. API reachability does not verify telemetry, calibration or provider data. Forecasts, recommendations and impact claims remain unavailable until validated inputs and methods are connected.</div>{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="ag-page-header">
      <div>
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {actions ? <div className="ag-actions">{actions}</div> : null}
    </div>
  );
}
