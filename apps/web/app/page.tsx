import { DashboardView } from '../components/neoagro-pages';
import { getDashboardSummary } from '../lib/demo';
import { getNovaCoreInsight } from '../lib/nova-core';

export default async function HomePage() {
  const summary = await getDashboardSummary();
  const nova = await getNovaCoreInsight();

  return <DashboardView summary={summary} nova={nova} />;
}
