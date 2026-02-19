import { createContext, useContext, useMemo, useState } from "react";

const PlanContext = createContext();

const defaultPlan = {
  month: "2026-02",
  income: 2200,
  savingPercent: 10,
  fixedBills: [
    { id: "rent", name: "Loyer", amount: 750 },
    { id: "subs", name: "Abonnements", amount: 35 },
    { id: "phone", name: "Téléphone", amount: 15 },
  ],
  allocations: [
    { id: "groceries", name: "Courses", percent: 45, priority: 1 },
    { id: "outings", name: "Sorties", percent: 25, priority: 2 },
    { id: "transport", name: "Transport", percent: 15, priority: 3 },
    { id: "health", name: "Santé", percent: 10, priority: 4 },
    { id: "other", name: "Autres", percent: 5, priority: 5 },
  ],
};

export function PlanProvider({ children }) {
  const [plan, setPlan] = useState(defaultPlan);

  const computed = useMemo(() => {
    const savingAmount = (plan.income * plan.savingPercent) / 100;
    const fixedTotal = plan.fixedBills.reduce((acc, b) => acc + Number(b.amount || 0), 0);
    const afterSaving = plan.income - savingAmount;
    const variableBudget = afterSaving - fixedTotal;

    const allocationSum = plan.allocations.reduce((acc, a) => acc + Number(a.percent || 0), 0);

    return {
      savingAmount,
      fixedTotal,
      afterSaving,
      variableBudget,
      allocationSum,
      budgetStatus: variableBudget < 0 ? "impossible" : "ok",
    };
  }, [plan]);

  return (
    <PlanContext.Provider value={{ plan, setPlan, computed }}>
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  return useContext(PlanContext);
}
