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
  getMonthlyRevenue: () => number;
  getDailyRevenue: (
    range: "week" | "month",
  ) => { label: string; amount: number; date: string }[];
  exportTransactions: () => void;
  resetTransactions: () => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined,
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
    details?: string,
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

  const getMonthlyRevenue = () => {
    const now = new Date();
    // Get beginning of current month (1st day)
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    firstDay.setHours(0, 0, 0, 0);

    const cutoff = firstDay.getTime();

    return transactions
      .filter((t) => t.timestamp >= cutoff)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getDailyRevenue = (range: "week" | "month") => {
    const now = new Date();
    const data: { label: string; amount: number; date: string }[] = [];
    const days = range === "week" ? 7 : 31; // Simplified: last 7 days or last 31 days
    // Alternatively for "Current Week/Month":
    const startDate = new Date(now);
    startDate.setHours(0, 0, 0, 0);

    if (range === "week") {
      // Go back to Sunday
      startDate.setDate(now.getDate() - now.getDay());
    } else {
      // Go back to 1st of month
      startDate.setDate(1);
    }

    // Determine end date (today)
    const endDate = new Date(now);
    endDate.setHours(23, 59, 59, 999);

    // Iterate day by day from startDate to endDate
    const current = new Date(startDate);
    while (current <= endDate) {
      const dayStart = current.getTime();
      const nextDay = new Date(current);
      nextDay.setDate(current.getDate() + 1);
      const dayEnd = nextDay.getTime();

      const dayTotal = transactions
        .filter((t) => t.timestamp >= dayStart && t.timestamp < dayEnd)
        .reduce((sum, t) => sum + t.amount, 0);

      data.push({
        label: current.toLocaleDateString("en-US", {
          weekday: "short",
          day: "numeric",
        }),
        date: current.toISOString().split("T")[0],
        amount: dayTotal,
      });

      current.setDate(current.getDate() + 1);
    }

    return data;
  };

  const exportTransactions = () => {
    if (transactions.length === 0) {
      alert("No data to export.");
      return;
    }

    const headers = ["ID", "Type", "Amount", "Details", "Date", "Time"];
    const rows = transactions.map((t) => {
      const d = new Date(t.timestamp);
      return [
        t.id,
        t.type,
        t.amount.toString(),
        t.details || "",
        d.toLocaleDateString(),
        d.toLocaleTimeString(),
      ];
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `transactions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        getMonthlyRevenue,
        getDailyRevenue,
        exportTransactions,
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
      "useTransactions must be used within a TransactionProvider",
    );
  }
  return context;
}
