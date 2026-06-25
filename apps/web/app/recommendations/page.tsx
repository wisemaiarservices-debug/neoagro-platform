import { RecommendationsView } from '../../components/neoagro-pages';
import { getNovaCoreInsight } from '../../lib/nova-core';

export default async function RecommendationsPage() {
  const nova = await getNovaCoreInsight();

  return <RecommendationsView nova={nova} />;
}
