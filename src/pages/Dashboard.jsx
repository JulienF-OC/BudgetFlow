import AppShell from "../components/AppShell";
import BudgetRing from "../components/BudgetRing";
import { useTransactions } from "../context/TransactionsContext";

function formatEUR(n) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(n);
}

export default function Dashboard() {
  const { transactions } = useTransactions();

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const expenses = transactions.filter((t) => t.type === "expense");

  const totalSpent = expenses.reduce((acc, t) => acc + t.amount, 0);

  const variableBudget = income;
  const remaining = variableBudget - totalSpent;

  const categoriesMap = {};
  expenses.forEach((t) => {
    if (!categoriesMap[t.category]) categoriesMap[t.category] = 0;
    categoriesMap[t.category] += t.amount;
  });

  const categories = Object.entries(categoriesMap).map(([name, value]) => ({
    name,
    value,
  }));

  const summary = {
    month: "Mois en cours",
    income,
    saving: 0,
    fixed: 0,
    variableBudget,
    totalSpent,
    remaining,
    categories,
  };

  return (
    <AppShell>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Dashboard
        </h1>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm md:col-span-2">
          <BudgetRing summary={summary} />
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Revenus</span>
              <span>{formatEUR(income)}</span>
            </div>
            <div className="flex justify-between">
              <span>Dépenses</span>
              <span>{formatEUR(totalSpent)}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Restant</span>
              <span>{formatEUR(remaining)}</span>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
