import { useMemo, useState } from "react";
import AppShell from "../components/AppShell";
import { usePlan } from "../context/PlanContext";

function formatEUR(n) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
    Number.isFinite(n) ? n : 0
  );
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export default function Plan() {
  const { plan, setPlan, computed } = usePlan();

  const [billName, setBillName] = useState("");
  const [billAmount, setBillAmount] = useState("");

  const sortedAllocations = useMemo(() => {
    return [...plan.allocations].sort((a, b) => a.priority - b.priority);
  }, [plan.allocations]);

  function updateIncome(v) {
    const income = Number(v);
    setPlan((p) => ({ ...p, income: Number.isFinite(income) ? income : 0 }));
  }

  function updateSavingPercent(v) {
    const sp = clamp(Number(v), 0, 100);
    setPlan((p) => ({ ...p, savingPercent: Number.isFinite(sp) ? sp : 0 }));
  }

  function addBill(e) {
    e.preventDefault();
    const name = billName.trim();
    const amount = Number(billAmount);

    if (!name) return;
    if (!Number.isFinite(amount) || amount < 0) return;

    setPlan((p) => ({
      ...p,
      fixedBills: [
        ...p.fixedBills,
        { id: crypto.randomUUID(), name, amount },
      ],
    }));

    setBillName("");
    setBillAmount("");
  }

  function deleteBill(id) {
    setPlan((p) => ({ ...p, fixedBills: p.fixedBills.filter((b) => b.id !== id) }));
  }

  function updateBillAmount(id, v) {
    const amount = Number(v);
    setPlan((p) => ({
      ...p,
      fixedBills: p.fixedBills.map((b) =>
        b.id === id ? { ...b, amount: Number.isFinite(amount) ? amount : 0 } : b
      ),
    }));
  }

  function updateAllocationPercent(id, v) {
    const percent = clamp(Number(v), 0, 100);
    setPlan((p) => ({
      ...p,
      allocations: p.allocations.map((a) =>
        a.id === id ? { ...a, percent: Number.isFinite(percent) ? percent : 0 } : a
      ),
    }));
  }

  function updateAllocationPriority(id, v) {
    const priority = clamp(Number(v), 1, 10);
    setPlan((p) => ({
      ...p,
      allocations: p.allocations.map((a) =>
        a.id === id ? { ...a, priority: Number.isFinite(priority) ? priority : 1 } : a
      ),
    }));
  }

  const envelopes = useMemo(() => {
    const vb = computed.variableBudget;
    return sortedAllocations.map((a) => ({
      ...a,
      envelope: vb > 0 ? (vb * a.percent) / 100 : 0,
    }));
  }, [sortedAllocations, computed.variableBudget]);

  const canSave = Math.round(computed.allocationSum * 100) / 100 === 100;

  return (
    <AppShell>
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Planification</h1>
          <p className="text-sm text-gray-500">Définis ton plan mensuel</p>
        </div>

        <button
          disabled={!canSave}
          className={[
            "rounded-xl px-4 py-2 text-sm font-medium",
            canSave ? "bg-black text-white" : "bg-gray-200 text-gray-500 cursor-not-allowed",
          ].join(" ")}
          onClick={() => alert("MVP: enregistré en mémoire (plus tard -> API) ✅")}
        >
          Enregistrer
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold">Revenus & épargne</h2>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Revenus du mois (€)</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={plan.income}
                  onChange={(e) => updateIncome(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>

              <div>
                <label className="text-sm font-medium">% épargne</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={plan.savingPercent}
                  onChange={(e) => updateSavingPercent(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Épargne prévue : <span className="font-medium">{formatEUR(computed.savingAmount)}</span>
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Factures fixes</h2>
              <div className="text-sm text-gray-600">
                Total : <span className="font-medium">{formatEUR(computed.fixedTotal)}</span>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {plan.fixedBills.map((b) => (
                <div key={b.id} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="text-sm font-medium">{b.name}</div>
                    <div className="text-xs text-gray-500">Mensuel</div>
                  </div>

                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={b.amount}
                    onChange={(e) => updateBillAmount(b.id, e.target.value)}
                    className="w-28 rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200"
                  />

                  <button
                    onClick={() => deleteBill(b.id)}
                    className="rounded-xl px-3 py-2 text-sm text-gray-500 hover:bg-gray-50"
                  >
                    Supprimer
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={addBill} className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <input
                value={billName}
                onChange={(e) => setBillName(e.target.value)}
                className="rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200 sm:col-span-2"
                placeholder="Nom de la facture (ex: Internet)"
              />
              <input
                value={billAmount}
                onChange={(e) => setBillAmount(e.target.value)}
                type="number"
                min="0"
                step="1"
                className="rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200"
                placeholder="Montant"
              />

              <div className="sm:col-span-3">
                <button className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm hover:bg-gray-50">
                  + Ajouter une facture
                </button>
              </div>
            </form>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Répartition du budget variable</h2>
              <div className="text-sm text-gray-600">
                Total % :{" "}
                <span className={canSave ? "font-medium" : "font-medium text-red-600"}>
                  {Math.round(computed.allocationSum * 100) / 100}%
                </span>
              </div>
            </div>

            {!canSave && (
              <p className="mt-2 text-sm text-red-600">
                La somme des pourcentages doit être égale à 100%.
              </p>
            )}

            <div className="mt-5 space-y-4">
              {envelopes.map((a, idx) => (
                <div key={a.id} className="rounded-xl border border-gray-100 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">{a.name}</div>
                      <div className="text-xs text-gray-500">
                        Enveloppe : <span className="font-medium">{formatEUR(a.envelope)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-xs text-gray-500">Priorité</div>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={a.priority}
                        onChange={(e) => updateAllocationPriority(a.id, e.target.value)}
                        className="w-16 rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200"
                      />
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-3">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={a.percent}
                      onChange={(e) => updateAllocationPercent(a.id, e.target.value)}
                      className="w-full"
                    />
                    <div className="w-16 text-right text-sm font-medium tabular-nums">
                      {a.percent}%
                    </div>
                  </div>

                  <div className="mt-2 h-2 w-full rounded-full bg-gray-100">
                    <div
                      className="h-2 rounded-full bg-gray-900"
                      style={{ width: `${clamp(a.percent, 0, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-4 text-xs text-gray-500">
              Astuce : tu pourras plus tard “Dupliquer le mois précédent”.
            </p>
          </section>
        </div>
        <aside className="md:col-span-1">
          <div className="sticky top-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold">Résumé</h2>

            <div className="mt-4 space-y-2 text-sm">
              <Row label="Revenus" value={formatEUR(plan.income)} />
              <Row label="Épargne" value={formatEUR(computed.savingAmount)} />
              <Row label="Après épargne" value={formatEUR(computed.afterSaving)} />
              <Row label="Factures" value={formatEUR(computed.fixedTotal)} />
              <div className="border-t border-gray-100 pt-2" />
              <Row
                label="Budget variable"
                value={formatEUR(computed.variableBudget)}
                strong
              />
            </div>

            {computed.budgetStatus === "impossible" && (
              <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
                Budget impossible : factures + épargne &gt; revenus.
                <div className="mt-1 text-xs text-red-600">
                  Réduis l’épargne, les factures, ou augmente le revenu.
                </div>
              </div>
            )}

            <div className="mt-4 rounded-xl bg-gray-50 p-3 text-xs text-gray-600">
              MVP : ce plan sert bientôt à calculer les enveloppes et “prévu vs réel”.
            </div>
          </div>
        </aside>
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
