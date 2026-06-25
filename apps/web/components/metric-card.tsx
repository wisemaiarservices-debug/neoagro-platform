'use client';

import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

type MetricCardProps = {
  label: string;
  value: string;
  unit?: string;
  delta?: string;
  positive?: boolean;
  icon?: LucideIcon;
  tint?: 'primary' | 'solar' | 'water' | 'warning';
  children?: ReactNode;
};

export function MetricCard({ label, value, unit, delta, positive = true, icon: Icon, tint = 'primary', children }: MetricCardProps) {
  return (
    <article className="ag-metric">
      <div className="ag-metric-head">
        <div>
          <div className="ag-micro">{label}</div>
          <div className="ag-metric-value">{value}{unit ? <span>{unit}</span> : null}</div>
          {delta ? (
            <div className={`ag-delta ${positive ? 'good' : 'bad'}`}>
              {positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
              {delta}<span>vs last week</span>
            </div>
          ) : null}
        </div>
        {Icon ? <div className={`ag-icon ${tint}`}><Icon size={20} /></div> : null}
      </div>
      {children ? <div className="ag-metric-body">{children}</div> : null}
    </article>
  );
}
