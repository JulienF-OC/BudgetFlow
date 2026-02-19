import { useState } from "react";
import AppShell from "../components/AppShell";
import { mockTransactions } from "../lib/mockTransactions";

function formatEUR(n) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(n);
}

export default function Transactions() {
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = mockTransactions.filter((t) =>
    typeFilter === "all" ? true : t.type === typeFilter
  );

  return (
    <AppShell>
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Transactions
          </h1>
          <p className="text-sm text-gray-500">
            Historique du mois
          </p>
        </div>

        <button className="rounded-xl bg-black px-4 py-2 text-sm text-white">
          + Ajouter
        </button>
      </div>

      {/* FILTRES */}
      <div className="mt-6 flex gap-2">
        {["all", "income", "expense"].map((type) => (
          <button
            key={type}
            onClick={() => setTypeFilter(type)}
            className={`rounded-xl px-4 py-2 text-sm ${
              typeFilter === type
                ? "bg-black text-white"
                : "bg-white border border-gray-200 text-gray-700"
            }`}
          >
            {type === "all"
              ? "Tout"
              : type === "income"
              ? "Revenus"
              : "Dépenses"}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-6 py-3 text-left font-medium">Date</th>
              <th className="px-6 py-3 text-left font-medium">Catégorie</th>
              <th className="px-6 py-3 text-left font-medium">Type</th>
              <th className="px-6 py-3 text-right font-medium">Montant</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((t) => (
              <tr key={t.id} className="border-t border-gray-100">
                <td className="px-6 py-4 text-gray-600">
                  {t.date}
                </td>
                <td className="px-6 py-4">
                  {t.category}
                </td>
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
                  {t.type === "income" ? "+" : "-"}{" "}
                  {formatEUR(t.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
