"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type ServiceType = "TIRE_INFO" | "DOT_CHECK" | "INFLATION";

export interface Transaction {
  id: string;
  type: ServiceType;
  amount: number;
  timestamp: number; // Date.now()
  details?: string; // e.g. "205/55R16" or "DOT 1017"
}

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (type: ServiceType, amount: number, details?: string) => void;
  getWeeklyRevenue: () => number;
  resetTransactions: () => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined
);

export function TransactionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("app-transactions");
    if (saved) {
      try {
        setTransactions(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse transactions", e);
      }
    }
    setLoaded(true);
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (loaded) {
      localStorage.setItem("app-transactions", JSON.stringify(transactions));
    }
  }, [transactions, loaded]);

  const addTransaction = (
    type: ServiceType,
    amount: number,
    details?: string
  ) => {
    const newTx: Transaction = {
      id: crypto.randomUUID(),
      type,
      amount,
      timestamp: Date.now(),
      details,
    };
    setTransactions((prev) => [...prev, newTx]);
  };

  const getWeeklyRevenue = () => {
    const now = new Date();
    // Get beginning of current week (Sunday)
    const sunday = new Date(now);
    sunday.setDate(now.getDate() - now.getDay());
    sunday.setHours(0, 0, 0, 0);

    const cutoff = sunday.getTime();

    return transactions
      .filter((t) => t.timestamp >= cutoff)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const resetTransactions = () => {
    setTransactions([]);
  };

  if (!loaded) return null;

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransaction,
        getWeeklyRevenue,
        resetTransactions,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error(
      "useTransactions must be used within a TransactionProvider"
    );
  }
  return context;
}
