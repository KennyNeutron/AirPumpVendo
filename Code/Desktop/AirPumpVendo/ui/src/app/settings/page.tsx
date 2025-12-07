// File: ui/app/settings/page.tsx
// Path: ui/app/settings/page.tsx

"use client";

import Link from "next/link";
import { useState } from "react";
import { useSettings, Settings } from "@/lib/settings-context";

type Tab = "analytics" | "pricing" | "dot" | "tire" | "settings";

export default function AdminPanel() {
  const { settings } = useSettings();
  const [activeTab, setActiveTab] = useState<Tab>("analytics");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === settings.password) {
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="flex h-dvh w-full items-center justify-center bg-slate-50 p-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm border border-slate-100">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white">
              <span className="material-symbols-rounded">lock</span>
            </div>
            <h1 className="text-xl font-bold text-slate-800">Admin Access</h1>
            <p className="text-[13px] text-slate-500">
              Enter password to continue
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setError(false);
                }}
                placeholder="Password"
                className={`w-full rounded-lg border px-4 py-2.5 text-[14px] outline-none transition ${
                  error
                    ? "border-red-300 bg-red-50 text-red-900 placeholder:text-red-300 focus:border-red-500"
                    : "border-slate-200 bg-slate-50 text-slate-900 focus:border-slate-400 focus:bg-white"
                }`}
                autoFocus
              />
              {error && (
                <p className="mt-1.5 text-center text-[12px] font-medium text-red-600">
                  Incorrect password
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-slate-900 py-2.5 text-[14px] font-semibold text-white transition hover:bg-slate-800 active:scale-[0.98]"
            >
              Unlock Settings
            </button>
            <div className="mt-4 text-center">
              <Link
                href="/"
                className="text-[12px] font-medium text-slate-500 hover:text-slate-800"
              >
                Cancel & Return Home
              </Link>
            </div>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="h-dvh overflow-hidden bg-slate-50 p-3">
      <div className="mx-auto flex h-full w-full max-w-[800px] flex-col gap-3">
        {/* Header */}
        <header className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-slate-800">Admin Panel</h1>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[13px] font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <span className="material-symbols-rounded text-[16px]">logout</span>
            Logout
          </button>
        </header>

        {/* Tabs */}
        <nav className="flex rounded-xl bg-white p-1 shadow-sm">
          <TabButton
            active={activeTab === "settings"}
            onClick={() => setActiveTab("settings")}
            icon="settings"
            label="Settings"
          />
          <TabButton
            active={activeTab === "tire"}
            onClick={() => setActiveTab("tire")}
            icon="tire_repair"
            label="Tire Codes"
          />
          <TabButton
            active={activeTab === "dot"}
            onClick={() => setActiveTab("dot")}
            icon="shield"
            label="DOT Codes"
          />
          <TabButton
            active={activeTab === "pricing"}
            onClick={() => setActiveTab("pricing")}
            icon="attach_money"
            label="Pricing"
          />
          <TabButton
            active={activeTab === "analytics"}
            onClick={() => setActiveTab("analytics")}
            icon="analytics"
            label="Analytics"
          />
        </nav>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden rounded-2xl bg-white p-4 shadow-sm">
          <div className="h-full overflow-y-auto pr-1">
            {activeTab === "analytics" && <AnalyticsTab />}
            {activeTab === "pricing" && <PricingTab />}
            {activeTab === "dot" && <DotCodesTab />}
            {activeTab === "tire" && <TireCodesTab />}
            {activeTab === "settings" && <SettingsTab />}
          </div>
        </div>
      </div>
    </main>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-[13px] font-medium transition ${
        active
          ? "bg-white shadow-sm text-slate-900 ring-1 ring-slate-200"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
      }`}
    >
      <span className="material-symbols-rounded text-[18px]">{icon}</span>
      {label}
    </button>
  );
}

/* -------------------- TABS -------------------- */

function AnalyticsTab() {
  const { settings } = useSettings();

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {/* Weekly Revenue */}
        <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
          <h3 className="mb-4 text-[14px] font-medium text-slate-700">
            Weekly Revenue
          </h3>
          <div className="text-center">
            <div className="text-[32px] font-bold text-slate-900">₱0</div>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
              This Week
            </span>
          </div>
          <button className="mt-6 w-full rounded-lg border border-slate-200 py-2 text-[12px] font-medium text-slate-600 hover:bg-slate-50">
            Reset Weekly Total
          </button>
        </div>

        {/* Service Statistics */}
        <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
          <h3 className="mb-4 text-[14px] font-medium text-slate-700">
            Service Statistics
          </h3>
          <ul className="space-y-3 text-[13px]">
            <li className="flex justify-between">
              <span className="text-slate-500">Total Tire Codes:</span>
              <span className="font-semibold rounded bg-slate-900 px-1.5 py-0.5 text-[11px] text-white">
                {settings.tireCodes.length}
              </span>
            </li>
            <li className="flex justify-between">
              <span className="text-slate-500">Total DOT Codes:</span>
              <span className="font-semibold rounded bg-slate-900 px-1.5 py-0.5 text-[11px] text-white">
                {settings.dotCodes.length}
              </span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-slate-500">DOT Check Status:</span>
              <span className="font-semibold rounded bg-slate-900 px-1.5 py-0.5 text-[11px] text-white">
                {settings.services.dotCheckEnabled ? "Enabled" : "Disabled"}
              </span>
            </li>
            <li className="flex justify-between">
              <span className="text-slate-500">Services Available:</span>
              <span className="font-semibold rounded bg-slate-900 px-1.5 py-0.5 text-[11px] text-white">
                {settings.services.dotCheckEnabled ? 3 : 2}
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="mb-3 text-[14px] font-medium text-slate-700">
          Quick Actions
        </h3>
        <div className="grid gap-3 md:grid-cols-3">
          <ActionButton icon="database" label="Export Data" />
          <ActionButton icon="settings" label="System Settings" />
          <ActionButton icon="attach_money" label="Financial Report" />
        </div>
      </div>
    </div>
  );
}

function ActionButton({ icon, label }: { icon: string; label: string }) {
  return (
    <button className="flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white p-4 transition hover:bg-slate-50">
      <span className="material-symbols-rounded text-[20px] text-slate-600">
        {icon}
      </span>
      <span className="text-[12px] font-medium text-slate-700">{label}</span>
    </button>
  );
}

function PricingTab() {
  const { settings, updateSettings } = useSettings();

  const handleChange = (key: keyof Settings["prices"], value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 0) {
      updateSettings({
        prices: {
          ...settings.prices,
          [key]: num,
        },
      });
    }
  };

  return (
    <div>
      <h3 className="mb-4 text-[16px] font-medium text-slate-800">
        Service Pricing (₱)
      </h3>
      <div className="grid gap-4 md:grid-cols-3">
        <InputGroup
          label="Tire Code Info"
          value={settings.prices.tireInfo}
          onChange={(v) => handleChange("tireInfo", v)}
        />
        <InputGroup
          label="DOT Code Check"
          value={settings.prices.dotCheck}
          onChange={(v) => handleChange("dotCheck", v)}
        />
        <InputGroup
          label="Tire Inflation"
          value={settings.prices.inflation}
          onChange={(v) => handleChange("inflation", v)}
        />
      </div>
    </div>
  );
}

function InputGroup({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (val: string) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[12px] font-semibold text-slate-700">
        {label}
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[14px] font-medium text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>
  );
}

function DotCodesTab() {
  const { settings, addDotCode, removeDotCode } = useSettings();
  const [newCode, setNewCode] = useState("");
  const [newYear, setNewYear] = useState("");
  const [newWeek, setNewWeek] = useState("");

  const handleAdd = () => {
    if (!newCode || !newYear || !newWeek) return;
    addDotCode(newCode, parseInt(newWeek), parseInt(newYear));
    setNewCode("");
    setNewYear("");
    setNewWeek("");
  };

  return (
    <div>
      <h3 className="mb-4 text-[16px] font-medium text-slate-800">
        DOT Code Database
      </h3>

      {/* Add Form */}
      <div className="mb-6 grid gap-2 md:grid-cols-[1fr_1fr_1fr_1fr_auto]">
        <div>
          <label className="mb-1 block text-[11px] font-medium text-slate-500">
            DOT Code
          </label>
          <input
            type="text"
            placeholder="e.g. 0718"
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[13px]"
          />
        </div>
        <div>
          <label className="mb-1 block text-[11px] font-medium text-slate-500">
            Year
          </label>
          <input
            type="number"
            placeholder="e.g. 2018"
            value={newYear}
            onChange={(e) => setNewYear(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[13px]"
          />
        </div>
        <div>
          <label className="mb-1 block text-[11px] font-medium text-slate-500">
            Week
          </label>
          <input
            type="number"
            placeholder="e.g. 7"
            value={newWeek}
            onChange={(e) => setNewWeek(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[13px]"
          />
        </div>
        <div>
          <label className="mb-1 block text-[11px] font-medium text-slate-500">
            Status
          </label>
          <select
            disabled
            className="w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-[13px] text-slate-500 cursor-not-allowed"
          >
            <option>Auto-calculated</option>
          </select>
        </div>
        <div className="flex items-end">
          <button
            onClick={handleAdd}
            className="flex h-[38px] items-center gap-1 rounded-lg bg-slate-900 px-4 text-[13px] font-medium text-white hover:bg-slate-800"
          >
            <span className="material-symbols-rounded text-[16px]">add</span>
            Add DOT Code
          </button>
        </div>
      </div>

      <h4 className="mb-3 text-[13px] font-semibold text-slate-700">
        Current DOT Codes
      </h4>
      <div className="grid gap-3 md:grid-cols-3">
        {settings.dotCodes.map((c) => {
          let statusColor = "bg-emerald-100 text-emerald-700";
          let icon = "check_circle";
          let iconColor = "text-emerald-500";

          if (c.status === "CAUTION") {
            statusColor = "bg-amber-100 text-amber-700";
            icon = "warning";
            iconColor = "text-amber-500";
          } else if (c.status === "REPLACE") {
            statusColor = "bg-red-100 text-red-700";
            icon = "error";
            iconColor = "text-red-500";
          }

          return (
            <div
              key={c.code}
              className="relative rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
            >
              <button
                onClick={() => removeDotCode(c.code)}
                className="absolute right-2 top-2 text-red-400 hover:text-red-600"
              >
                <span className="material-symbols-rounded text-[16px]">
                  delete
                </span>
              </button>
              <div className="flex items-center gap-1.5 mb-2">
                <span
                  className={`material-symbols-rounded text-[16px] ${iconColor}`}
                >
                  {icon}
                </span>
                <span className="font-bold text-slate-800">{c.code}</span>
              </div>
              <div className="text-[11px] text-slate-500">
                Week {c.week}, {c.year}
              </div>
              <div className="text-[11px] text-slate-500 mb-2">
                {c.ageYears} years old
              </div>
              <span
                className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${statusColor}`}
              >
                {c.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TireCodesTab() {
  const { settings, addTireCode, removeTireCode } = useSettings();
  const [newCode, setNewCode] = useState("");
  const [newPsi, setNewPsi] = useState("");

  const handleAdd = () => {
    if (!newCode || !newPsi) return;
    addTireCode(newCode, parseInt(newPsi));
    setNewCode("");
    setNewPsi("");
  };

  return (
    <div>
      <h3 className="mb-4 text-[16px] font-medium text-slate-800">
        Tire Code Database
      </h3>

      {/* Add Form */}
      <div className="mb-6 grid gap-2 md:grid-cols-[1fr_1fr_auto]">
        <div>
          <label className="mb-1 block text-[11px] font-medium text-slate-500">
            Tire Code
          </label>
          <input
            type="text"
            placeholder="e.g. 225/60R16"
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[13px]"
          />
        </div>
        <div>
          <label className="mb-1 block text-[11px] font-medium text-slate-500">
            Recommended PSI
          </label>
          <input
            type="number"
            placeholder="e.g. 35"
            value={newPsi}
            onChange={(e) => setNewPsi(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[13px]"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={handleAdd}
            className="flex h-[38px] items-center gap-1 rounded-lg bg-slate-900 px-4 text-[13px] font-medium text-white hover:bg-slate-800"
          >
            <span className="material-symbols-rounded text-[16px]">add</span>
            Add Tire Code
          </button>
        </div>
      </div>

      <h4 className="mb-3 text-[13px] font-semibold text-slate-700">
        Current Tire Codes
      </h4>
      <div className="grid gap-3 md:grid-cols-3">
        {settings.tireCodes.map((c) => (
          <div
            key={c.code}
            className="relative flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <button
              onClick={() => removeTireCode(c.code)}
              className="absolute bottom-2 text-red-400 hover:text-red-600"
            >
              <span className="material-symbols-rounded text-[16px]">
                delete
              </span>
            </button>
            <div className="text-[15px] font-bold text-slate-800">{c.code}</div>
            <div className="text-[12px] text-slate-500">{c.psi} PSI</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsTab() {
  const { settings, updateSettings } = useSettings();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");

  const toggleDotCheck = () => {
    updateSettings({
      services: {
        ...settings.services,
        dotCheckEnabled: !settings.services.dotCheckEnabled,
      },
    });
  };

  const changePassword = () => {
    if (!newPassword || newPassword !== confirmPassword) {
      setMsg("Passwords do not match");
      return;
    }
    updateSettings({ password: newPassword });
    setNewPassword("");
    setConfirmPassword("");
    setMsg("Password updated successfully");
    setTimeout(() => setMsg(""), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Security */}
      <div>
        <h3 className="mb-3 text-[16px] font-medium text-slate-800">
          Security Settings
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-[12px] font-semibold text-slate-700">
              New Password
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[13px] pr-8"
              />
              <span className="material-symbols-rounded absolute right-2.5 top-2 text-[18px] text-slate-400">
                lock
              </span>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-[12px] font-semibold text-slate-700">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[13px]"
            />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <button
            onClick={changePassword}
            className="rounded-lg bg-slate-900 px-4 py-2 text-[13px] font-medium text-white hover:bg-slate-800"
          >
            Change Password
          </button>
          {msg && (
            <span
              className={`text-[12px] font-medium ${
                msg.includes("success") ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {msg}
            </span>
          )}
        </div>
      </div>

      {/* Service */}
      <div>
        <h3 className="mb-3 text-[16px] font-medium text-slate-800">
          Service Settings
        </h3>
        <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
          <div>
            <div className="text-[13px] font-bold text-slate-800">
              DOT Code Check Service
            </div>
            <div className="text-[11px] text-slate-500">
              Enable or disable the DOT code safety check feature
            </div>
          </div>
          <button
            onClick={toggleDotCheck}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
              settings.services.dotCheckEnabled
                ? "bg-slate-900"
                : "bg-slate-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                settings.services.dotCheckEnabled
                  ? "translate-x-6"
                  : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
