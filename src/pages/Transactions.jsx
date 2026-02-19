import { useState, useMemo } from "react";
import AppShell from "../components/AppShell";
import Modal from "../components/Modal";
import { useTransactions } from "../context/TransactionsContext";

function formatEUR(n) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(n);
}

function todayISO() {
  const d = new Date();
  return d.toISOString().split("T")[0];
}

export default function Transactions() {
  const { transactions, addTransaction, deleteTransaction } =
    useTransactions();

  const [typeFilter, setTypeFilter] = useState("all");
  const [open, setOpen] = useState(false);

  const [date, setDate] = useState(todayISO());
  const [category, setCategory] = useState("Courses");
  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");

  const filtered = useMemo(() => {
    return transactions.filter((t) =>
      typeFilter === "all" ? true : t.type === typeFilter
    );
  }, [transactions, typeFilter]);

  function onAdd(e) {
    e.preventDefault();

    const parsed = Number(amount);
    if (!parsed || parsed <= 0) return;

    addTransaction({
      id: crypto.randomUUID(),
      date,
      category,
      type,
      amount: parsed,
    });

    setOpen(false);
    setAmount("");
  }

  return (
    <AppShell>
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Transactions
          </h1>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="rounded-xl bg-black px-4 py-2 text-sm text-white"
        >
          + Ajouter
        </button>
      </div>

      <div className="mt-6 flex gap-2">
        {["all", "income", "expense"].map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`rounded-xl px-4 py-2 text-sm ${
              typeFilter === t
                ? "bg-black text-white"
                : "bg-white border border-gray-200 text-gray-700"
            }`}
          >
            {t === "all"
              ? "Tout"
              : t === "income"
              ? "Revenus"
              : "Dépenses"}
          </button>
        ))}
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Catégorie</th>
              <th className="px-6 py-3 text-left">Type</th>
              <th className="px-6 py-3 text-right">Montant</th>
              <th className="px-6 py-3 text-right"></th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((t) => (
              <tr key={t.id} className="border-t border-gray-100">
                <td className="px-6 py-4 text-gray-600">{t.date}</td>
                <td className="px-6 py-4">{t.category}</td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      t.type === "income"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {t.type === "income" ? "Revenu" : "Dépense"}
                  </span>
                </td>
                <td
                  className={`px-6 py-4 text-right font-medium ${
                    t.type === "income"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {t.type === "income" ? "+" : "-"} {formatEUR(t.amount)}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => deleteTransaction(t.id)}
                    className="text-xs text-gray-400 hover:text-red-500"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={open} title="Ajouter une transaction" onClose={() => setOpen(false)}>
        <form onSubmit={onAdd} className="space-y-3">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-3 py-2"
            required
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-3 py-2"
          >
            <option value="expense">Dépense</option>
            <option value="income">Revenu</option>
          </select>

          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-3 py-2"
            placeholder="Catégorie"
            required
          />

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-3 py-2"
            placeholder="Montant"
            required
          />

          <button className="w-full rounded-xl bg-black py-2 text-white">
            Ajouter
          </button>
        </form>
      </Modal>
    </AppShell>
  );
}
