'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, Bell, Brain, Cpu, LayoutDashboard, Leaf, Search, TrendingUp } from 'lucide-react';
import type { ReactNode } from 'react';

const nav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/forecasting', label: 'Forecasting', icon: TrendingUp },
  { href: '/recommendations', label: 'AI Recommendations', icon: Brain },
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
          <strong>Operator-approved mode</strong>
          <span>14 sites / 248 sensors online</span>
        </div>
      </aside>
      <div className="ag-main">
        <header className="ag-topbar">
          <div>
            <div className="ag-micro">SITE</div>
            <strong>Agrivoltaic Operations Site</strong>
          </div>
          <div className="ag-topbar-actions">
            <span className="ag-search"><Search size={14} /> Search fields, sensors...</span>
            <button aria-label="Notifications"><Bell size={16} /><i /></button>
            <div className="ag-avatar">NA</div>
          </div>
        </header>
        <main className="ag-content">{children}</main>
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
