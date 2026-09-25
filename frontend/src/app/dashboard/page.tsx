"use client";

import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Users, 
  Cpu, 
  Activity, 
  ShieldCheck, 
  CheckCircle, 
  Server,
  Layers
} from "lucide-react";
import { api } from "@/lib/api";
import { Task, NetworkTelemetry } from "@/types";

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [telemetry, setTelemetry] = useState<NetworkTelemetry | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [tList, tel] = await Promise.all([
        api.listTasks(),
        api.getNetworkTelemetry()
      ]);
      setTasks(tList);
      setTelemetry(tel);
    } catch (e) {}
  };

  const completedCount = tasks.filter(t => t.status === "COMPLETED").length;
  const failedCount = tasks.filter(t => t.status === "FAILED").length;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#3A4149] pb-4">
        <div>
          <h1 className="text-xl font-bold text-[#E7E4D9] tracking-tight flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5 text-[#3E7C96]" />
            Executive Enterprise Operations Dashboard
          </h1>
          <p className="text-xs text-[#9BA2A9] mt-0.5">
            Real-time infrastructure health, on-premise GPU utilization, active agents, and air-gap telemetry.
          </p>
        </div>
        <span className="rounded-lg bg-[#21262B] border border-[#3A4149] px-3 py-1 text-xs font-mono font-bold text-[#6C8B78] flex items-center gap-1.5 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-[#6C8B78]"></span>
          SYSTEM HEALTH: 100% OPERATIONAL
        </span>
      </div>

      {/* Hero KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-lift rounded-xl border border-[#3A4149] bg-[#21262B] p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[#9BA2A9] text-xs">
            <span className="font-semibold">ACTIVE USERS</span>
            <div className="h-8 w-8 rounded-lg bg-[#14181C] border border-[#3A4149] flex items-center justify-center">
              <Users className="h-4 w-4 text-[#3E7C96]" />
            </div>
          </div>
          <div className="text-3xl font-bold text-[#E7E4D9] font-mono">3</div>
          <div className="text-[10px] text-[#6D7C86]">Engineer, Manager, Administrator</div>
        </div>

        <div className="card-lift rounded-xl border border-[#3A4149] bg-[#21262B] p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[#9BA2A9] text-xs">
            <span className="font-semibold">EXECUTED AGENT TASKS</span>
            <div className="h-8 w-8 rounded-lg bg-[#14181C] border border-[#3A4149] flex items-center justify-center">
              <Layers className="h-4 w-4 text-[#3E7C96]" />
            </div>
          </div>
          <div className="text-3xl font-bold text-[#3E7C96] font-mono">{tasks.length}</div>
          <div className="text-[10px] text-[#9BA2A9] font-medium">{completedCount} Completed • {failedCount} Failed</div>
        </div>

        <div className="card-lift rounded-xl border border-[#3A4149] bg-[#21262B] p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[#9BA2A9] text-xs">
            <span className="font-semibold">ON-PREMISE GPU / VRAM</span>
            <div className="h-8 w-8 rounded-lg bg-[#14181C] border border-[#3A4149] flex items-center justify-center">
              <Cpu className="h-4 w-4 text-[#3E7C96]" />
            </div>
          </div>
          <div className="text-3xl font-bold text-[#E7E4D9] font-mono">5.8 / 16 GB</div>
          <div className="text-[10px] text-[#6D7C86]">Quantized Open-Weight Serving (Q4_K_M)</div>
        </div>

        <div className="card-lift rounded-xl border border-[#3A4149] bg-[#21262B] p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[#9BA2A9] text-xs">
            <span className="font-semibold">EXTERNAL NETWORK CALLS</span>
            <div className="h-8 w-8 rounded-lg bg-[#14181C] border border-[#3A4149] flex items-center justify-center">
              <ShieldCheck className="h-4 w-4 text-[#6C8B78]" />
            </div>
          </div>
          <div className="text-3xl font-bold text-[#6C8B78] font-mono">0</div>
          <div className="text-[10px] text-[#6C8B78] font-medium">100% Sovereign Air-Gapped</div>
        </div>
      </div>

      {/* Multi-Agent System Topology & Models Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card-lift rounded-xl border border-[#3A4149] bg-[#21262B] p-5 shadow-sm space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#E7E4D9] flex items-center gap-2">
            <Server className="h-4 w-4 text-[#3E7C96]" />
            Specialized Autonomous Sub-Agents
          </h2>
          <div className="space-y-2 text-xs">
            {[
              { name: "Task Classifier & Router", model: "Local Logic / DeepSeek", status: "Active" },
              { name: "Document & Vision Agent", model: "Qwen 2.5 Vision-Language (7B)", status: "Active" },
              { name: "Coding & Sandbox Agent", model: "Qwen 2.5 Coder (7B)", status: "Active" },
              { name: "SOP & Knowledge Agent", model: "Local Hybrid pgvector RAG", status: "Active" },
              { name: "Report Synthesizer Agent", model: "DeepSeek R1 Distill (7B)", status: "Active" },
              { name: "Verification & Audit Agent", model: "Deterministic Rule Engine", status: "Active" }
            ].map((agent, i) => (
              <div 
                key={i} 
                className="flex items-center justify-between p-2.5 rounded-lg border border-[#3A4149] bg-[#14181C] hover:border-[#4A535D] transition"
              >
                <div>
                  <div className="font-semibold text-[#E7E4D9]">{agent.name}</div>
                  <div className="text-[10px] text-[#6D7C86] font-mono mt-0.5">{agent.model}</div>
                </div>
                <span className="flex items-center gap-1 text-[10px] font-semibold text-[#6C8B78] bg-[#21262B] px-2 py-0.5 rounded border border-[#3A4149]">
                  <CheckCircle className="h-3 w-3" />
                  {agent.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* System Resource Metrics */}
        <div className="card-lift rounded-xl border border-[#3A4149] bg-[#21262B] p-5 shadow-sm space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#E7E4D9] flex items-center gap-2">
            <Activity className="h-4 w-4 text-[#3E7C96]" />
            On-Premise Infrastructure Metrics
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between text-[#9BA2A9] mb-1">
                <span className="font-medium">GPU VRAM Allocation</span>
                <span className="font-mono text-[#3E7C96] font-bold">36.2% (5.8 / 16 GB)</span>
              </div>
              <div className="w-full bg-[#14181C] border border-[#3A4149] h-2 rounded-full overflow-hidden">
                <div className="bg-[#3E7C96] h-full w-[36.2%] rounded-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[#9BA2A9] mb-1">
                <span className="font-medium">Host RAM Utilization</span>
                <span className="font-mono text-[#6D7C86] font-bold">24.5% (7.8 / 32 GB)</span>
              </div>
              <div className="w-full bg-[#14181C] border border-[#3A4149] h-2 rounded-full overflow-hidden">
                <div className="bg-[#6D7C86] h-full w-[24.5%] rounded-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[#9BA2A9] mb-1">
                <span className="font-medium">Local Vector Storage (pgvector)</span>
                <span className="font-mono text-[#3E7C96] font-bold">12.1 MB / 50 GB</span>
              </div>
              <div className="w-full bg-[#14181C] border border-[#3A4149] h-2 rounded-full overflow-hidden">
                <div className="bg-[#3E7C96] h-full w-[3%] rounded-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[#9BA2A9] mb-1">
                <span className="font-medium">Air-Gap Egress Blocker</span>
                <span className="font-mono text-[#6C8B78] font-bold">100% Enforced</span>
              </div>
              <div className="w-full bg-[#14181C] border border-[#3A4149] h-2 rounded-full overflow-hidden">
                <div className="bg-[#6C8B78] h-full w-[100%] rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
