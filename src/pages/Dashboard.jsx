import AppShell from "../components/AppShell";
import BudgetRing from "../components/BudgetRing";
import { mockSummary } from "../lib/mockSummary";

function formatEUR(n) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(n);
}

export default function Dashboard() {
  return (
    <AppShell>
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            {mockSummary.month}
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm md:col-span-2">
          <BudgetRing summary={mockSummary} />
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-sm font-medium">Résumé</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Revenus</span>
              <span>{formatEUR(mockSummary.income)}</span>
            </div>
            <div className="flex justify-between">
              <span>Épargne</span>
              <span>{formatEUR(mockSummary.saving)}</span>
            </div>
            <div className="flex justify-between">
              <span>Factures</span>
              <span>{formatEUR(mockSummary.fixed)}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Budget variable</span>
              <span>{formatEUR(mockSummary.variableBudget)}</span>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
