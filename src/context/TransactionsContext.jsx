import { createContext, useContext, useState } from "react";
import { mockTransactions } from "../lib/mockTransactions";

const TransactionsContext = createContext();

export function TransactionsProvider({ children }) {
  const [transactions, setTransactions] = useState(mockTransactions);

  function addTransaction(tx) {
    setTransactions((prev) =>
      [tx, ...prev].sort((a, b) => b.date.localeCompare(a.date))
    );
  }

  return (
    <TransactionsContext.Provider
      value={{ transactions, addTransaction }}
    >
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions() {
  return useContext(TransactionsContext);
}
