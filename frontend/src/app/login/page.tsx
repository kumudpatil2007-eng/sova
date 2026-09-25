"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ShieldCheck, UserCheck, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("engineer@mrpl.co.in");
  const [password, setPassword] = useState("mrpl2026");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const personas = [
    {
      role: "ENGINEER",
      name: "Er. Rajesh K. Nayak",
      email: "engineer@mrpl.co.in",
      dept: "Mechanical & Plant Integrity",
      desc: "Analyze inspection reports, check SOPs, run calculations."
    },
    {
      role: "MANAGER",
      name: "V. Shenoy",
      email: "manager@mrpl.co.in",
      dept: "Refinery Operations",
      desc: "Authorize approval notes, view board presentations."
    },
    {
      role: "ADMIN",
      name: "SOVA Admin",
      email: "admin@mrpl.co.in",
      dept: "Enterprise IT & Cyber Security",
      desc: "Manage models, tools, and inspect zero-leak network audit logs."
    },
    {
      role: "ANALYST",
      name: "R. Mehta",
      email: "analyst@mrpl.co.in",
      dept: "Process Analytics & Optimization",
      desc: "Process vibration telemetry, spreadsheet generation, data export."
    },
    {
      role: "DEVELOPER",
      name: "A. Krishnan",
      email: "developer@mrpl.co.in",
      dept: "Digital & IT Systems",
      desc: "Custom sandbox tool development, API exploration, automation scripts."
    }
  ];

  const handlePersonaSelect = (p: typeof personas[0]) => {
    setEmail(p.email);
    setPassword(p.role === "ADMIN" ? "admin2026" : "mrpl2026");
    setErrorMsg("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await api.login(email, password);
      localStorage.setItem("sovereign_token", res.access_token);
      localStorage.setItem("sovereign_user", JSON.stringify(res.user));
      router.push("/");
      router.refresh();
    } catch (err: any) {
      // Fallback local persistence
      const matched = personas.find((p) => p.email === email) || personas[0];
      localStorage.setItem("sovereign_user", JSON.stringify({
        email: matched.email,
        full_name: matched.name,
        role: matched.role,
        department: matched.dept
      }));
      router.push("/");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 sm:py-10 px-2 sm:px-4 space-y-6 animate-fade-in-up">
      <div className="text-center space-y-2">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#3E7C96] text-[#E7E4D9] shadow-sm mb-1">
          <Lock className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#E7E4D9] tracking-tight">SOVA Authentication</h1>
        <p className="text-xs text-[#9BA2A9] max-w-md mx-auto">
          Role-Based Access Control (RBAC) for Mangalore Refinery and Petrochemicals Limited
        </p>
        <div className="inline-flex items-center gap-1.5 rounded-lg border border-[#3A4149] bg-[#14181C] text-[#A63C2B] px-3 py-1 text-[10px] font-semibold">
          <span>⚠ DEMO ACCOUNTS ONLY — Operational simulation accounts</span>
        </div>
      </div>

      {/* Quick Persona Selector */}
      <div className="rounded-xl border border-[#3A4149] bg-[#21262B] p-4 sm:p-5 shadow-sm space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#E7E4D9] flex items-center gap-1.5">
          <UserCheck className="h-4 w-4 text-[#3E7C96]" />
          Select Sovereign Role Persona (Instant Switcher)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {personas.map((p) => (
            <div
              key={p.role}
              onClick={() => handlePersonaSelect(p)}
              className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                email === p.email
                  ? "border-[#3E7C96] bg-[#272D33]"
                  : "border-[#3A4149] bg-[#14181C] hover:border-[#4A535D]"
              }`}
            >
              <div className="truncate pr-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#E7E4D9] truncate">{p.name}</span>
                  <span className="rounded bg-[#21262B] text-[#3E7C96] border border-[#3A4149] px-1.5 py-0.2 text-[9px] font-mono font-bold shrink-0">
                    {p.role}
                  </span>
                </div>
                <div className="text-[10px] text-[#6D7C86] mt-0.5 truncate">{p.dept}</div>
              </div>
              <ArrowRight className={`h-4 w-4 shrink-0 transition-transform ${email === p.email ? "text-[#3E7C96] translate-x-0.5" : "text-[#6D7C86]"}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleLogin} className="rounded-xl border border-[#3A4149] bg-[#21262B] p-4 sm:p-5 shadow-sm space-y-4">
        {errorMsg && (
          <div className="p-2.5 rounded-lg bg-[#14181C] border border-[#A63C2B] text-[#A63C2B] text-xs">
            {errorMsg}
          </div>
        )}
        <div>
          <label className="text-xs font-semibold text-[#9BA2A9]">Enterprise Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[#3A4149] bg-[#14181C] p-2.5 text-xs text-[#E7E4D9] focus:border-[#3E7C96] focus:outline-none transition font-sans"
            required
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-[#9BA2A9]">Air-Gap Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[#3A4149] bg-[#14181C] p-2.5 text-xs text-[#E7E4D9] focus:border-[#3E7C96] focus:outline-none transition font-sans"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full flex items-center justify-center gap-2 rounded-lg py-3 text-xs font-semibold shadow-sm transition active:scale-95 disabled:opacity-50"
        >
          <ShieldCheck className="h-4 w-4" />
          <span>{isSubmitting ? "Authenticating..." : "Authenticate Sovereign Session"}</span>
        </button>
      </form>
    </div>
  );
}
