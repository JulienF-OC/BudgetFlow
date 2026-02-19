import AppShell from "../components/AppShell";
import BudgetRing from "../components/BudgetRing";
import { useTransactions } from "../context/TransactionsContext";
import { usePlan } from "../context/PlanContext";

function formatEUR(n) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(Number.isFinite(n) ? n : 0);
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export default function Dashboard() {
  const { transactions } = useTransactions();
  const { plan, computed } = usePlan();

  const expenses = transactions.filter((t) => t.type === "expense");
  const totalSpent = expenses.reduce((acc, t) => acc + t.amount, 0);

  const variableBudget = computed.variableBudget;
  const remaining = variableBudget - totalSpent;

  const actualMap = {};
  expenses.forEach((t) => {
    actualMap[t.category] = (actualMap[t.category] || 0) + t.amount;
  });

  const ringCategories = Object.entries(actualMap).map(([name, value]) => ({
    name,
    value,
  }));

  const summary = {
    month: plan.month,
    income: plan.income,
    saving: computed.savingAmount,
    fixed: computed.fixedTotal,
    variableBudget,
    totalSpent,
    remaining,
    categories: ringCategories,
  };

  const plannedVsActual = [...plan.allocations]
    .sort((a, b) => a.priority - b.priority)
    .map((a) => {
      const planned = variableBudget > 0 ? (variableBudget * a.percent) / 100 : 0;
      const actual = actualMap[a.name] || 0;
      const delta = planned - actual; 
      const progress = planned > 0 ? actual / planned : 0;

      return {
        name: a.name,
        priority: a.priority,
        percent: a.percent,
        planned,
        actual,
        delta,
        progress,
      };
    });

  return (
    <AppShell>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-gray-500">Mois : {plan.month}</p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm md:col-span-2">
          <BudgetRing summary={summary} />
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="space-y-2 text-sm">
            <Row label="Revenus planifiés" value={formatEUR(plan.income)} />
            <Row label="Épargne" value={formatEUR(computed.savingAmount)} />
            <Row label="Factures" value={formatEUR(computed.fixedTotal)} />
            <div className="border-t border-gray-100 pt-2" />
            <Row label="Budget variable" value={formatEUR(variableBudget)} strong />
            <Row label="Dépenses réelles" value={formatEUR(totalSpent)} />
            <Row label="Restant" value={formatEUR(remaining)} strong />
          </div>

          {computed.budgetStatus === "impossible" && (
            <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
              ⚠️ Budget impossible (factures + épargne &gt; revenus)
            </div>
          )}

          {remaining < 0 && computed.budgetStatus !== "impossible" && (
            <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
              ⚠️ Dépassement du budget variable
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-sm font-semibold">Prévu vs Réel</h2>
            <p className="mt-1 text-xs text-gray-500">
              Basé sur ta répartition du budget variable.
            </p>
          </div>
          <div className="text-xs text-gray-500">
            Total % :{" "}
            <span className="font-medium">
              {Math.round(computed.allocationSum * 100) / 100}%
            </span>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          {plannedVsActual.map((row) => (
            <PlannedRow key={row.name} row={row} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}

function Row({ label, value, strong }) {
  return (
    <div className={`flex justify-between ${strong ? "font-medium" : ""}`}>
      <span className="text-gray-600">{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}

function PlannedRow({ row }) {
  const planned = row.planned;
  const actual = row.actual;

  const progressPct =
    planned > 0 ? clamp(Math.round((actual / planned) * 100), 0, 200) : 0;

  const isOver = planned > 0 && actual > planned;

  return (
    <div className="rounded-xl border border-gray-100 p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium">{row.name}</div>
          <div className="text-xs text-gray-500">
            Prévu {formatEUR(planned)} • Réel {formatEUR(actual)}
          </div>
        </div>

        <div className="text-right">
          <div className={`text-sm font-medium ${isOver ? "text-red-600" : "text-gray-900"}`}>
            {isOver ? `-${formatEUR(Math.abs(row.delta))}` : `${formatEUR(row.delta)}`}
          </div>
          <div className="text-xs text-gray-500">
            {isOver ? "Dépassement" : "Reste"}
          </div>
        </div>
      </div>

      <div className="mt-3 h-2 w-full rounded-full bg-gray-100">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${
            isOver ? "bg-red-500" : "bg-gray-900"
          }`}
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="mt-2 text-xs text-gray-400">
        {planned > 0 ? `${progressPct}%` : "Aucun budget prévu"}
      </div>
    </div>
  );
}
