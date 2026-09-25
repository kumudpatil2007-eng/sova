"use client";

import React, { useState, useEffect } from "react";
import { Wrench, FileText, Code2, FileSpreadsheet, CheckCircle } from "lucide-react";
import { api } from "@/lib/api";

export default function ToolsPage() {
  const [tools, setTools] = useState<any[]>([]);

  useEffect(() => {
    loadTools();
  }, []);

  const loadTools = async () => {
    try {
      const data = await api.listTools();
      setTools(data);
    } catch (e) {}
  };

  const getToolIcon = (cat: string) => {
    switch (cat) {
      case "DOCUMENT":
        return FileText;
      case "EXECUTION":
        return Code2;
      case "GENERATOR":
        return FileSpreadsheet;
      default:
        return Wrench;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="border-b border-[#3A4149] pb-4">
        <h1 className="text-xl font-bold text-[#E7E4D9] tracking-tight flex items-center gap-2">
          <Wrench className="h-5 w-5 text-[#3E7C96]" />
          Air-Gapped Tool Registry &amp; Sandboxes
        </h1>
        <p className="text-xs text-[#9BA2A9] mt-0.5">
          Deterministic local tools called autonomously by agents without host filesystem violation or external network access.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tools.map((t, idx) => {
          const Icon = getToolIcon(t.category);
          return (
            <div
              key={idx}
              className="rounded-xl border border-[#3A4149] bg-[#21262B] p-5 shadow-sm space-y-3 hover:border-[#4A535D] transition group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#14181C] border border-[#3A4149] text-[#3E7C96]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#E7E4D9]">{t.name}</h3>
                    <span className="rounded bg-[#14181C] border border-[#3A4149] text-[#9BA2A9] px-1.5 py-0.2 text-[9px] font-mono font-semibold">
                      CATEGORY: {t.category}
                    </span>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-[#6C8B78] bg-[#14181C] px-2 py-0.5 rounded border border-[#3A4149]">
                  <CheckCircle className="h-3.5 w-3.5" />
                  Sandboxed
                </span>
              </div>

              <p className="text-xs text-[#9BA2A9] leading-relaxed font-sans">{t.description}</p>

              <div className="rounded-lg bg-[#14181C] p-3 text-[11px] font-mono space-y-1 border border-[#3A4149]">
                <div className="text-[#6D7C86] font-semibold">Parameters Schema:</div>
                <pre className="text-[#3E7C96] overflow-x-auto text-[10px]">{JSON.stringify(t.parameters, null, 2)}</pre>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
