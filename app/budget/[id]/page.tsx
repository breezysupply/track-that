import BudgetPageClient from '/../components/BudgetPageClient';

export default function BudgetPage({ params }: { params: { id: string } }) {
  return <BudgetPageClient id={params.id} />;
}

export async function generateStaticParams() {
  return [];
}
