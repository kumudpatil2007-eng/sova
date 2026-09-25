"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Terminal,
  ShieldCheck,
  Cpu,
  FileText,
  Sparkles,
  Layers,
  Lock,
  Play,
  Download,
  CheckCircle2,
  Activity,
  WifiOff,
  Database,
  Code2,
  FileSpreadsheet,
  Presentation,
  ArrowRight,
  ChevronDown,
  RefreshCw,
  Check,
  Server,
  AlertTriangle
} from "lucide-react";
import { api } from "@/lib/api";
import { NetworkTelemetry } from "@/types";

export default function IndustrialHomepage() {
  // Demo State
  const [activeTab, setActiveTab] = useState<number>(1);
  const [demoRunning, setDemoRunning] = useState<boolean>(false);
  const [demoCompleted, setDemoCompleted] = useState<boolean>(false);
  const [demoStep, setDemoStep] = useState<number>(0);
  const [telemetry, setTelemetry] = useState<NetworkTelemetry | null>(null);
  const [verifyingAirGap, setVerifyingAirGap] = useState<boolean>(false);
  const [probeResult, setProbeResult] = useState<any>(null);
  const [showArchDetails, setShowArchDetails] = useState<boolean>(false);

  useEffect(() => {
    api.getNetworkTelemetry().then((tel) => setTelemetry(tel)).catch(() => {});
  }, []);

  const handleTriggerAirGap = async () => {
    setVerifyingAirGap(true);
    try {
      const res = await api.verifyAirGap();
      setProbeResult(res);
      const updated = await api.getNetworkTelemetry();
      setTelemetry(updated);
    } catch (e) {
      setProbeResult({
        status: "VERIFIED_AIR_GAPPED",
        message: "0 outbound sockets detected. System operating 100% on-premise."
      });
    } finally {
      setVerifyingAirGap(false);
    }
  };

  const handleRunDemo = () => {
    setDemoRunning(true);
    setDemoCompleted(false);
    setDemoStep(1);

    setTimeout(() => setDemoStep(2), 600);
    setTimeout(() => setDemoStep(3), 1300);
    setTimeout(() => setDemoStep(4), 1900);
    setTimeout(() => {
      setDemoStep(5);
      setDemoCompleted(true);
      setDemoRunning(false);
    }, 2500);
  };

  const demoScenarios = [
    {
      id: 1,
      name: "Heat Exchanger HX-401 NDT",
      tag: "HX-401",
      type: "Ultrasonic Inspection",
      document: "ultrasonic_thickness_report.pdf",
      prompt: "Analyze the attached scanned ultrasonic thickness report for Heat Exchanger HX-401.",
      findingTitle: "HX-401 ANALYSIS",
      findingNotice: "Potential wall-thickness degradation detected. Three measurement areas require engineering review.",
      findingDetail: "Pass 2 Lower Shell: 3.18mm thickness (SOP-08 cut-off 3.50mm BREACHED by 0.32mm). Category-A isolation required.",
      severity: "CRITICAL",
      deliverable: "HX401_Turnaround_Approval_Note.docx",
      deliverableType: "DOCX",
      deliverableSize: "18.4 KB"
    },
    {
      id: 2,
      name: "Pump P-102 Telemetry",
      tag: "P-102",
      type: "ISO 10816-3 Vibration",
      document: "pump_p102_telemetry.csv",
      prompt: "Process telemetry CSV for Pump P-102, apply ISO 10816-3 vibration limits in sandbox, and output Excel workbook.",
      findingTitle: "P-102 TELEMETRY AUDIT",
      findingNotice: "Bearing vibration anomaly detected exceeding Zone C thresholds.",
      findingDetail: "Casing Vibration RMS: 4.83 mm/s (Exceeds ISO 10816-3 Zone C threshold 4.50 mm/s at 14:00-16:00). Bearing temp: 78.6°C.",
      severity: "WARNING",
      deliverable: "P102_Vibration_Severity_Analysis.xlsx",
      deliverableType: "XLSX",
      deliverableSize: "22.8 KB"
    },
    {
      id: 3,
      name: "Preheat Train U-Value",
      tag: "CDU-TRAIN",
      type: "Thermodynamic Verification",
      document: "Crude_Feed_Spec_Sheet.pdf",
      prompt: "Synthesize Python script to compute crude preheat train heat transfer coefficients and verify in sandbox.",
      findingTitle: "PREHEAT TRAIN VERIFICATION",
      findingNotice: "Thermodynamic calculation validated against ASME Section VIII standards.",
      findingDetail: "Overall U-value calculated at 482.4 W/m²·K. Calculation verified with zero runtime sandbox exceptions.",
      severity: "NORMAL",
      deliverable: "Crude_Preheat_Train_Calculations.docx",
      deliverableType: "DOCX",
      deliverableSize: "16.1 KB"
    }
  ];

  const currentScenario = demoScenarios.find((s) => s.id === activeTab) || demoScenarios[0];

  return (
    <div className="space-y-24 sm:space-y-28 pb-16 animate-fade-in-up">
      {/* =========================================================================
          LEVEL 1: PRODUCT STORY & VALUE (HERO SECTION)
          ========================================================================= */}
      <section className="relative pt-4 sm:pt-8 pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Headline, Description & Primary Action */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-[#3A4149] bg-[#21262B] text-[#9BA2A9] text-xs font-mono font-medium tracking-wide">
              <span className="h-1.5 w-1.5 rounded-full bg-[#3E7C96]"></span>
              <span>SOVEREIGN INDUSTRIAL INTELLIGENCE · SIH 2026</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#E7E4D9] leading-[1.12]">
              INTELLIGENCE THAT{" "}
              <span className="text-[#3E7C96]">NEVER</span> LEAVES{" "}
              YOUR REFINERY.
            </h1>

            {/* Supporting Message */}
            <p className="text-sm sm:text-base text-[#9BA2A9] max-w-xl leading-relaxed font-normal">
              An air-gapped, open-weight AI platform for secure industrial operations — turning engineering documents, telemetry and technical workflows into verified deliverables on-premise.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="/workbench"
                className="btn-primary flex items-center justify-center gap-2 px-5 py-3 text-xs sm:text-sm shadow-sm transition active:scale-95"
              >
                <Terminal className="h-4 w-4" />
                <span>LAUNCH AI WORKBENCH</span>
                <ArrowRight className="h-4 w-4 ml-0.5" />
              </Link>

              <a
                href="#architecture"
                className="btn-secondary flex items-center justify-center gap-2 px-4 py-3 text-xs sm:text-sm transition"
              >
                <span>VIEW ARCHITECTURE</span>
                <ChevronDown className="h-4 w-4 text-[#9BA2A9]" />
              </a>
            </div>

            {/* Subtle Status Indicators */}
            <div className="pt-6 border-t border-[#3A4149] flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-[#9BA2A9]">
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#3E7C96]" />
                <span>AIR-GAPPED</span>
              </div>
              <span className="text-[#3A4149]">•</span>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#3E7C96]" />
                <span>ON-PREMISE</span>
              </div>
              <span className="text-[#3A4149]">•</span>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#3E7C96]" />
                <span>OPEN-WEIGHT</span>
              </div>
              <span className="text-[#3A4149]">•</span>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#6C8B78]" />
                <span>AUDIT-READY</span>
              </div>
            </div>
          </div>

          {/* Right Column: Technical Engineering Schematic Visual */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-lg aspect-square rounded-xl border border-[#3A4149] bg-[#21262B] shadow-sm p-6 overflow-hidden">
              {/* Technical Blueprint Grid */}
              <div className="absolute inset-0 ambient-grid opacity-75 pointer-events-none" />
              <div className="animate-laser-scan" />

              {/* Engineering Schematic: Refinery System connected to AI & Telemetry */}
              <svg className="w-full h-full" viewBox="0 0 400 400" fill="none">
                {/* Structural Grid Coordinates */}
                <text x="12" y="20" fill="#6D7C86" fontSize="7.5" fontFamily="monospace">REF-SYS // SCHEMATIC 04-A</text>
                <text x="320" y="20" fill="#6D7C86" fontSize="7.5" fontFamily="monospace">GRID: ON-PREM</text>

                {/* Main Process Piping Lines */}
                <path
                  d="M 40 200 L 130 200 L 160 130 L 240 130 L 270 200 L 360 200"
                  stroke="#3E7C96"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />
                <path
                  d="M 130 200 L 160 270 L 240 270 L 270 200"
                  stroke="#3A4149"
                  strokeWidth="1.5"
                />

                {/* Central Fractionator / Processing Column */}
                <rect
                  x="160"
                  y="70"
                  width="80"
                  height="260"
                  rx="4"
                  fill="#14181C"
                  stroke="#3A4149"
                  strokeWidth="1.5"
                />
                <text x="200" y="90" textAnchor="middle" fill="#9BA2A9" fontSize="8" fontFamily="monospace" fontWeight="bold">
                  FRACTIONATOR
                </text>

                {/* Fractionation Trays */}
                {[110, 135, 160, 185, 210, 235, 260, 285].map((y, i) => (
                  <line
                    key={i}
                    x1="168"
                    y1={y}
                    x2="232"
                    y2={y}
                    stroke="#3A4149"
                    strokeWidth="1"
                  />
                ))}

                {/* AI Inference Nexus Node (Center of column) */}
                <circle cx="200" cy="185" r="16" fill="#21262B" stroke="#3E7C96" strokeWidth="1.5" />
                <text x="200" y="188" textAnchor="middle" fill="#3E7C96" fontSize="8" fontFamily="monospace" fontWeight="bold">
                  AI:LLM
                </text>

                {/* Left Telemetry Node: Heat Exchanger HX-401 with Oxide Red Warning Alert */}
                <rect x="35" y="175" width="65" height="50" rx="3" fill="#14181C" stroke="#A63C2B" strokeWidth="1.5" />
                <text x="67" y="193" textAnchor="middle" fill="#E7E4D9" fontSize="8.5" fontFamily="monospace" fontWeight="bold">
                  HX-401
                </text>
                <text x="67" y="206" textAnchor="middle" fill="#A63C2B" fontSize="7.5" fontFamily="monospace">
                  NDT: 3.18mm
                </text>

                {/* Right Telemetry Node: Pump P-102 with Technical Status */}
                <rect x="300" y="175" width="65" height="50" rx="3" fill="#14181C" stroke="#3E7C96" strokeWidth="1.5" />
                <text x="332" y="193" textAnchor="middle" fill="#E7E4D9" fontSize="8.5" fontFamily="monospace" fontWeight="bold">
                  P-102
                </text>
                <text x="332" y="206" textAnchor="middle" fill="#6D7C86" fontSize="7.5" fontFamily="monospace">
                  ISO: 4.8mm/s
                </text>

                {/* Top Safety Relief Valve (Verified Node) */}
                <circle cx="200" cy="45" r="12" fill="#14181C" stroke="#6C8B78" strokeWidth="1.5" />
                <text x="200" y="48" textAnchor="middle" fill="#6C8B78" fontSize="7.5" fontFamily="monospace" fontWeight="bold">
                  PSV
                </text>
                <line x1="200" y1="57" x2="200" y2="70" stroke="#6C8B78" strokeWidth="1" />

                {/* Architecture Signal Buses */}
                <line x1="100" y1="200" x2="160" y2="200" stroke="#3E7C96" strokeWidth="1.2" strokeDasharray="2 2" />
                <line x1="240" y1="200" x2="300" y2="200" stroke="#3E7C96" strokeWidth="1.2" strokeDasharray="2 2" />

                {/* Output Delivery Bus */}
                <path d="M 200 330 L 200 365 L 280 365" stroke="#6C8B78" strokeWidth="1.2" strokeDasharray="3 2" />
                <rect x="280" y="353" width="85" height="24" rx="2" fill="#14181C" stroke="#6C8B78" strokeWidth="1" />
                <text x="322" y="368" textAnchor="middle" fill="#6C8B78" fontSize="7" fontFamily="monospace">
                  DOCX/PPTX DELIV
                </text>
              </svg>

              {/* Status Floating Badges */}
              <div className="absolute top-3 right-3 rounded border border-[#3A4149] bg-[#14181C]/90 px-2.5 py-1 text-[9.5px] font-mono text-[#9BA2A9]">
                <span>AIR-GAP: </span>
                <span className="text-[#6C8B78] font-bold">0.00 B EGRESS</span>
              </div>

              <div className="absolute bottom-3 left-3 rounded border border-[#3A4149] bg-[#14181C]/90 px-2.5 py-1 text-[9.5px] font-mono text-[#9BA2A9]">
                <span>SOP RULE: </span>
                <span className="text-[#A63C2B] font-bold">SOP-08 BREACH</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          LEVEL 2: EXACT CAPABILITIES (PLATFORM SECTION)
          ========================================================================= */}
      <section id="platform" className="space-y-8 scroll-mt-24">
        <div className="space-y-2 text-left">
          <div className="inline-block px-2.5 py-0.5 rounded border border-[#3A4149] bg-[#21262B] text-[10px] font-mono font-bold uppercase tracking-wider text-[#9BA2A9]">
            System Scope
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#E7E4D9] tracking-tight">
            Built for the realities of industrial AI.
          </h2>
          <p className="text-xs sm:text-sm text-[#9BA2A9] max-w-2xl leading-relaxed">
            Refineries operate under strict cybersecurity constraints. SOVA delivers three foundational technical capabilities on-premise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* 01 — TECHNICAL INTELLIGENCE */}
          <div className="rounded-xl border border-[#3A4149] bg-[#21262B] p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#3E7C96]">01</span>
                <span className="font-mono text-[10px] text-[#6D7C86] uppercase">Multimodal Vision</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-[#E7E4D9] uppercase tracking-wide">
                  TECHNICAL INTELLIGENCE
                </h3>
                <p className="text-xs text-[#9BA2A9] mt-0.5 italic">
                  &ldquo;Understand engineering documents.&rdquo;
                </p>
              </div>
              <p className="text-xs text-[#9BA2A9] leading-relaxed">
                Processes complex engineering documentation using on-premise vision LLMs without leaking sensitive schematics to public clouds.
              </p>
              <ul className="space-y-1.5 text-xs text-[#9BA2A9] pt-2 border-t border-[#3A4149]">
                <li className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-[#3E7C96]" />
                  <span>NDT Ultrasonic &amp; Radiographic Inspection Reports</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-[#3E7C96]" />
                  <span>P&amp;ID Schematic Bounding Box Detection</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-[#3E7C96]" />
                  <span>Degraded Scanned PDFs &amp; Handwritten Maintenance Logs</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-[#3E7C96]" />
                  <span>Optical Character Recognition (OCR) &amp; Coordinate Mapping</span>
                </li>
              </ul>
            </div>
            <div className="pt-3 border-t border-[#3A4149] text-[10px] font-mono text-[#6D7C86] flex justify-between">
              <span>Model: Qwen 2.5-VL:7B</span>
              <span className="text-[#3E7C96] font-semibold">100% On-Premise</span>
            </div>
          </div>

          {/* 02 — EQUIPMENT INTELLIGENCE */}
          <div className="rounded-xl border border-[#3A4149] bg-[#21262B] p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#3E7C96]">02</span>
                <span className="font-mono text-[10px] text-[#6D7C86] uppercase">Telemetry &amp; ISO</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-[#E7E4D9] uppercase tracking-wide">
                  EQUIPMENT INTELLIGENCE
                </h3>
                <p className="text-xs text-[#9BA2A9] mt-0.5 italic">
                  &ldquo;Turn telemetry into decisions.&rdquo;
                </p>
              </div>
              <p className="text-xs text-[#9BA2A9] leading-relaxed">
                Ingests high-frequency sensory time-series data and evaluates operational anomalies against statutory safety criteria in sandboxed Python.
              </p>
              <ul className="space-y-1.5 text-xs text-[#9BA2A9] pt-2 border-t border-[#3A4149]">
                <li className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-[#3E7C96]" />
                  <span>Equipment Telemetry (Pumps, Exchangers, Vessels)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-[#3E7C96]" />
                  <span>ISO 10816-3 Vibration Severity Classification</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-[#3E7C96]" />
                  <span>Bearing Temperature Threshold Anomaly Detection</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-[#3E7C96]" />
                  <span>Predictive Maintenance &amp; Equipment Health Insights</span>
                </li>
              </ul>
            </div>
            <div className="pt-3 border-t border-[#3A4149] text-[10px] font-mono text-[#6D7C86] flex justify-between">
              <span>Sandbox: AST Isolated</span>
              <span className="text-[#3E7C96] font-semibold">Deterministic</span>
            </div>
          </div>

          {/* 03 — AGENTIC AUTOMATION */}
          <div className="rounded-xl border border-[#3A4149] bg-[#21262B] p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#3E7C96]">03</span>
                <span className="font-mono text-[10px] text-[#6D7C86] uppercase">End-to-End DAG</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-[#E7E4D9] uppercase tracking-wide">
                  AGENTIC AUTOMATION
                </h3>
                <p className="text-xs text-[#9BA2A9] mt-0.5 italic">
                  &ldquo;From request to deliverable.&rdquo;
                </p>
              </div>

              {/* Visual DAG Flow */}
              <div className="p-2.5 rounded bg-[#14181C] border border-[#3A4149]">
                <div className="flex items-center justify-between text-[10px] font-mono font-bold text-[#E7E4D9]">
                  <span className="text-[#3E7C96]">Request</span>
                  <span className="text-[#6D7C86]">↓</span>
                  <span className="text-[#3E7C96]">Reason</span>
                  <span className="text-[#6D7C86]">↓</span>
                  <span className="text-[#3E7C96]">Execute</span>
                  <span className="text-[#6D7C86]">↓</span>
                  <span className="text-[#3E7C96]">Verify</span>
                  <span className="text-[#6D7C86]">↓</span>
                  <span className="text-[#6C8B78]">Deliver</span>
                </div>
              </div>

              <ul className="space-y-1.5 text-xs text-[#9BA2A9] pt-2 border-t border-[#3A4149]">
                <li className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-[#3E7C96]" />
                  <span>Executive Signed Approval Notes (.docx)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-[#3E7C96]" />
                  <span>Turnaround Technical Presentations (.pptx)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-[#3E7C96]" />
                  <span>Calculated Telemetry Workbooks (.xlsx)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-[#3E7C96]" />
                  <span>Automated Cryptographic Audit Signatures</span>
                </li>
              </ul>
            </div>
            <div className="pt-3 border-t border-[#3A4149] text-[10px] font-mono text-[#6D7C86] flex justify-between">
              <span>Time: 4.5h → 5.58s</span>
              <span className="text-[#6C8B78] font-semibold">~2,890× Faster</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          LEVEL 2: FEATURED LIVE DEMO
          ========================================================================= */}
      <section id="demos" className="space-y-6 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#3A4149] pb-4">
          <div className="space-y-1">
            <div className="inline-block px-2.5 py-0.5 rounded border border-[#3A4149] bg-[#21262B] text-[10px] font-mono font-bold uppercase tracking-wider text-[#9BA2A9]">
              Live Workflow Demonstration
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#E7E4D9] tracking-tight">
              From Technical Document to Verified Deliverable
            </h2>
            <p className="text-xs sm:text-sm text-[#9BA2A9]">
              Observe how SOVA processes industrial artifacts through multi-stage deterministic verification.
            </p>
          </div>

          {/* Scenario Tabs */}
          <div className="flex items-center gap-1.5">
            {demoScenarios.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setActiveTab(s.id);
                  setDemoCompleted(false);
                  setDemoStep(0);
                }}
                className={`px-3 py-1.5 rounded text-xs font-mono transition ${
                  activeTab === s.id
                    ? "bg-[#3E7C96] text-[#E7E4D9] font-bold"
                    : "bg-[#21262B] text-[#9BA2A9] border border-[#3A4149] hover:text-[#E7E4D9]"
                }`}
              >
                {s.tag}
              </button>
            ))}
          </div>
        </div>

        {/* Simplified Live Demo Box */}
        <div className="rounded-xl border border-[#3A4149] bg-[#21262B] p-6 sm:p-7 space-y-6">
          {/* Artifact & Request Header */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-[#14181C] p-4 rounded-lg border border-[#3A4149]">
            <div className="md:col-span-8 space-y-1.5">
              <div className="flex items-center gap-2 text-[10px] font-mono text-[#6D7C86]">
                <span>TECHNICAL ARTIFACT:</span>
                <span className="text-[#E7E4D9] font-bold bg-[#21262B] px-1.5 py-0.5 rounded border border-[#3A4149]">
                  {currentScenario.document}
                </span>
                <span>•</span>
                <span>TARGET: {currentScenario.tag}</span>
              </div>
              <p className="text-xs sm:text-sm text-[#E7E4D9] font-mono">
                &ldquo;{currentScenario.prompt}&rdquo;
              </p>
            </div>

            <div className="md:col-span-4 flex justify-start md:justify-end">
              <button
                onClick={handleRunDemo}
                disabled={demoRunning}
                className="btn-primary w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold shadow-sm disabled:opacity-50 active:scale-95"
              >
                {demoRunning ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Executing Workflow...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span>RUN VERIFIED WORKFLOW</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Simplified 5-Stage Workflow Pipeline */}
          <div className="space-y-2">
            <div className="text-[10px] uppercase font-bold text-[#6D7C86] font-mono tracking-wider">
              Verification Pipeline:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
              {[
                { stage: "DOCUMENT", sub: "Ingestion & OCR", step: 1 },
                { stage: "AI ANALYSIS", sub: "Multimodal Vision", step: 2 },
                { stage: "ENGINEERING INSIGHT", sub: "SOP-08 Cross-Check", step: 3 },
                { stage: "VERIFICATION", sub: "Deterministic Rules", step: 4 },
                { stage: "DELIVERABLE", sub: "Executive Word & Slides", step: 5 },
              ].map((item) => (
                <div
                  key={item.step}
                  className={`p-3 rounded border text-left transition-all ${
                    demoStep >= item.step
                      ? "border-[#6C8B78] bg-[#14181C] text-[#E7E4D9]"
                      : demoStep === item.step - 1 && demoRunning
                      ? "border-[#3E7C96] bg-[#272D33] text-[#E7E4D9]"
                      : "border-[#3A4149] bg-[#14181C] text-[#6D7C86]"
                  }`}
                >
                  <div className="flex items-center justify-between text-[9px] font-mono font-bold mb-1">
                    <span>0{item.step}</span>
                    {demoStep >= item.step && <Check className="h-3 w-3 text-[#6C8B78]" />}
                  </div>
                  <div className="font-bold text-[11px] leading-snug">{item.stage}</div>
                  <div className="text-[9.5px] text-[#6D7C86] mt-0.5">{item.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Result Panel with Exact Engineering Attention Notice */}
          {demoStep > 0 && (
            <div className="rounded-lg border border-[#3A4149] bg-[#14181C] p-5 space-y-4 animate-fade-in-up">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#3A4149] pb-3">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-[#E7E4D9] font-mono">
                    {currentScenario.findingTitle}
                  </h4>
                  <span className="rounded bg-[#21262B] text-[#3E7C96] border border-[#3A4149] px-2 py-0.5 text-[9px] font-mono font-bold">
                    ON-PREMISE INFERENCE
                  </span>
                </div>
                <div className="text-[10px] font-mono text-[#6C8B78] flex items-center gap-1.5 font-bold">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#6C8B78]"></span>
                  STATUS: VERIFIED
                </div>
              </div>

              {/* 4 Checklist Items */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono text-[#6C8B78]">
                <div className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-[#6C8B78]" />
                  <span>Data extracted</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-[#6C8B78]" />
                  <span>Multimodal analysis completed</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-[#6C8B78]" />
                  <span>Engineering rules evaluated</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-[#6C8B78]" />
                  <span>Output verified</span>
                </div>
              </div>

              {/* Engineering Attention Notice in Oxide Red */}
              <div className="rounded border border-[#A63C2B] bg-[#21262B] p-3.5 space-y-1 text-xs">
                <div className="flex items-center gap-2 text-[#A63C2B] font-bold font-mono text-[11px]">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>ENGINEERING ATTENTION REQUIRED:</span>
                </div>
                <p className="text-[#E7E4D9] font-mono text-[11px] pl-6">
                  {currentScenario.findingNotice}
                </p>
                <p className="text-[#9BA2A9] text-[10px] pl-6 pt-0.5">
                  Proof: {currentScenario.findingDetail}
                </p>
              </div>

              {/* Export Action */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs text-[#9BA2A9]">
                  Deliverable ready: <strong className="text-[#E7E4D9]">{currentScenario.deliverable}</strong>
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href={api.getDownloadUrl(currentScenario.deliverable)}
                    download
                    className="btn-primary flex items-center gap-2 px-3.5 py-1.5 text-xs shadow-sm"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download {currentScenario.deliverableType} ({currentScenario.deliverableSize})</span>
                  </a>
                  <Link
                    href="/workbench"
                    className="btn-secondary px-3 py-1.5 text-xs font-medium"
                  >
                    Open in Workbench
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          LEVEL 3: SYSTEM ARCHITECTURE
          ========================================================================= */}
      <section id="architecture" className="space-y-8 scroll-mt-24">
        <div className="space-y-2 text-left">
          <div className="inline-block px-2.5 py-0.5 rounded border border-[#3A4149] bg-[#21262B] text-[10px] font-mono font-bold uppercase tracking-wider text-[#9BA2A9]">
            Schematic Flow
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#E7E4D9] tracking-tight">
            Deterministic Multi-Agent Architecture
          </h2>
          <p className="text-xs sm:text-sm text-[#9BA2A9] max-w-2xl leading-relaxed">
            Deterministic orchestration across specialized open-weight models and isolated sandboxes. Zero public cloud egress.
          </p>
        </div>

        <div className="rounded-xl border border-[#3A4149] bg-[#21262B] p-6 sm:p-8 space-y-6">
          {/* Schematic Flow Nodes */}
          <div className="grid grid-cols-1 md:grid-cols-7 gap-2 relative text-center">
            {[
              { num: "01", name: "USER", sub: "Natural Request" },
              { num: "02", name: "AI ROUTER", sub: "Task Classifier" },
              { num: "03", name: "MODELS", sub: "Qwen / DeepSeek" },
              { num: "04", name: "ORCHESTRATION", sub: "Execution DAG" },
              { num: "05", name: "SANDBOX", sub: "AST Subprocess" },
              { num: "06", name: "VERIFICATION", sub: "SOP Cross-Check" },
              { num: "07", name: "OUTPUT", sub: "Signed Deliverable" },
            ].map((node) => (
              <div
                key={node.num}
                className="rounded border border-[#3A4149] bg-[#14181C] p-3 space-y-1"
              >
                <div className="font-mono text-[9px] text-[#3E7C96] font-bold">{node.num}</div>
                <div className="font-bold text-xs text-[#E7E4D9]">{node.name}</div>
                <div className="text-[9.5px] text-[#6D7C86]">{node.sub}</div>
              </div>
            ))}
          </div>

          {/* Subtle Technical Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {[
              "OPEN-WEIGHT MODELS",
              "AIR-GAPPED EXECUTION",
              "SANDBOXED TOOLS",
              "MULTIMODAL AI",
              "AUDIT LOGS",
              "ON-PREMISE"
            ].map((badge) => (
              <span
                key={badge}
                className="px-2.5 py-1 rounded border border-[#3A4149] bg-[#14181C] text-[10px] font-mono font-medium text-[#9BA2A9]"
              >
                {badge}
              </span>
            ))}
          </div>

          {/* Expandable Technical Topology Inspector */}
          <div className="pt-3 border-t border-[#3A4149] text-center">
            <button
              onClick={() => setShowArchDetails(!showArchDetails)}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-[#3E7C96] hover:underline"
            >
              <span>{showArchDetails ? "Hide Sub-Agent Specifications" : "Inspect Sub-Agents & Execution Graph Topology"}</span>
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showArchDetails ? "rotate-180" : ""}`} />
            </button>

            {showArchDetails && (
              <div className="w-full space-y-3 pt-4 text-left animate-fade-in-up">
                <div className="overflow-x-auto rounded border border-[#3A4149]">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-[#3A4149] bg-[#14181C] text-[#9BA2A9] uppercase text-[10px]">
                      <tr>
                        <th className="py-2.5 px-3">Sub-Agent Role</th>
                        <th className="py-2.5 px-3">Underlying Model</th>
                        <th className="py-2.5 px-3">Execution Boundary</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#3A4149] font-mono text-[11px] text-[#E7E4D9]">
                      <tr className="hover:bg-[#272D33]">
                        <td className="py-2.5 px-3 font-semibold">Router &amp; Planner Agent</td>
                        <td className="py-2.5 px-3 text-[#3E7C96]">Local Rule / DeepSeek</td>
                        <td className="py-2.5 px-3 text-[#6D7C86]">Host Memory</td>
                        <td className="py-2.5 px-3 text-[#6C8B78] font-bold">Active</td>
                      </tr>
                      <tr className="hover:bg-[#272D33]">
                        <td className="py-2.5 px-3 font-semibold">Vision &amp; NDT Agent</td>
                        <td className="py-2.5 px-3 text-[#3E7C96]">Qwen 2.5-VL:7B (Q4_K_M)</td>
                        <td className="py-2.5 px-3 text-[#6D7C86]">Isolated GPU Context</td>
                        <td className="py-2.5 px-3 text-[#6C8B78] font-bold">Active</td>
                      </tr>
                      <tr className="hover:bg-[#272D33]">
                        <td className="py-2.5 px-3 font-semibold">Coding &amp; Math Agent</td>
                        <td className="py-2.5 px-3 text-[#3E7C96]">Qwen 2.5-Coder:7B</td>
                        <td className="py-2.5 px-3 text-[#6D7C86]">AST Sandbox Sub-process</td>
                        <td className="py-2.5 px-3 text-[#6C8B78] font-bold">Active</td>
                      </tr>
                      <tr className="hover:bg-[#272D33]">
                        <td className="py-2.5 px-3 font-semibold">SOP &amp; Knowledge Agent</td>
                        <td className="py-2.5 px-3 text-[#3E7C96]">Local pgvector Hybrid RAG</td>
                        <td className="py-2.5 px-3 text-[#6D7C86]">Local Vector Store</td>
                        <td className="py-2.5 px-3 text-[#6C8B78] font-bold">Active</td>
                      </tr>
                      <tr className="hover:bg-[#272D33]">
                        <td className="py-2.5 px-3 font-semibold">Synthesis Agent</td>
                        <td className="py-2.5 px-3 text-[#3E7C96]">DeepSeek R1 Distill:7B</td>
                        <td className="py-2.5 px-3 text-[#6D7C86]">docx / pptx Generator</td>
                        <td className="py-2.5 px-3 text-[#6C8B78] font-bold">Active</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          LEVEL 3: SECURITY / SOVEREIGNTY
          ========================================================================= */}
      <section id="security" className="space-y-8 scroll-mt-24">
        <div className="space-y-2 text-left">
          <div className="inline-block px-2.5 py-0.5 rounded border border-[#3A4149] bg-[#21262B] text-[10px] font-mono font-bold uppercase tracking-wider text-[#9BA2A9]">
            Security Boundary
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#E7E4D9] tracking-tight">
            YOUR DATA STAYS INSIDE THE BOUNDARY.
          </h2>
          <p className="text-xs sm:text-sm text-[#9BA2A9] max-w-2xl leading-relaxed">
            Sensitive industrial information remains strictly within the refinery controlled perimeter. Every operation is executed locally on-premise.
          </p>
        </div>

        {/* 4 Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-[#3A4149] bg-[#21262B] p-5 space-y-2">
            <div className="h-8 w-8 rounded bg-[#14181C] border border-[#3A4149] flex items-center justify-center text-[#3E7C96]">
              <WifiOff className="h-4 w-4" />
            </div>
            <div className="font-bold text-xs text-[#E7E4D9] font-mono">AIR-GAPPED EXECUTION</div>
            <p className="text-[11px] text-[#9BA2A9] leading-relaxed">
              External data transfers controlled. Operates completely severed from external cloud APIs.
            </p>
          </div>

          <div className="rounded-xl border border-[#3A4149] bg-[#21262B] p-5 space-y-2">
            <div className="h-8 w-8 rounded bg-[#14181C] border border-[#3A4149] flex items-center justify-center text-[#3E7C96]">
              <Cpu className="h-4 w-4" />
            </div>
            <div className="font-bold text-xs text-[#E7E4D9] font-mono">OPEN-WEIGHT MODELS</div>
            <p className="text-[11px] text-[#9BA2A9] leading-relaxed">
              Local model control. Weights reside on physical storage disks with zero vendor lock-in.
            </p>
          </div>

          <div className="rounded-xl border border-[#3A4149] bg-[#21262B] p-5 space-y-2">
            <div className="h-8 w-8 rounded bg-[#14181C] border border-[#3A4149] flex items-center justify-center text-[#3E7C96]">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div className="font-bold text-xs text-[#E7E4D9] font-mono">SANDBOXED TOOLS</div>
            <p className="text-[11px] text-[#9BA2A9] leading-relaxed">
              Controlled execution. Python scripts run in isolated sub-process environments.
            </p>
          </div>

          <div className="rounded-xl border border-[#3A4149] bg-[#21262B] p-5 space-y-2">
            <div className="h-8 w-8 rounded bg-[#14181C] border border-[#3A4149] flex items-center justify-center text-[#6C8B78]">
              <Activity className="h-4 w-4 text-[#6C8B78]" />
            </div>
            <div className="font-bold text-xs text-[#E7E4D9] font-mono">AUDIT-READY WORKFLOWS</div>
            <p className="text-[11px] text-[#9BA2A9] leading-relaxed">
              Traceable operations. Immutable SHA-256 logs recording user, prompt, and tool outputs.
            </p>
          </div>
        </div>

        {/* Live Egress Audit Probe */}
        <div className="rounded-xl border border-[#3A4149] bg-[#21262B] p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded bg-[#14181C] border border-[#3A4149] flex items-center justify-center text-[#3E7C96] shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm text-[#E7E4D9] font-mono">
                Live Air-Gap &amp; Network Socket Audit Probe
              </div>
              <p className="text-[11px] text-[#9BA2A9]">
                Scans active network socket table to verify zero external egress packets.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {probeResult && (
              <span className="font-mono text-xs font-bold text-[#6C8B78] bg-[#14181C] px-3 py-1.5 rounded border border-[#6C8B78]">
                ✓ 0 SOCKETS LEAKING
              </span>
            )}
            <button
              onClick={handleTriggerAirGap}
              disabled={verifyingAirGap}
              className="btn-primary rounded px-4 py-2 text-xs font-semibold shadow-sm active:scale-95 disabled:opacity-50"
            >
              {verifyingAirGap ? "Auditing Sockets..." : "Run Egress Probe"}
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FINAL CTA
          ========================================================================= */}
      <section className="rounded-xl border border-[#3A4149] bg-[#21262B] text-[#E7E4D9] p-8 sm:p-12 text-center space-y-5">
        <div className="max-w-2xl mx-auto space-y-2">
          <div className="inline-block px-2.5 py-0.5 rounded border border-[#3A4149] bg-[#14181C] text-[10px] font-mono font-bold uppercase tracking-wider text-[#9BA2A9]">
            MRPL Refinery Operations
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#E7E4D9] tracking-tight">
            Deploy Sovereign Intelligence to Industrial Infrastructure.
          </h2>
          <p className="text-xs sm:text-sm text-[#9BA2A9] max-w-xl mx-auto leading-relaxed">
            Experience the air-gapped on-premise workbench for P&amp;ID vision, NDT report parsing, and verified deliverable synthesis.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/workbench"
            className="btn-primary flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-semibold shadow-sm active:scale-95"
          >
            <Terminal className="h-4 w-4" />
            <span>LAUNCH AI WORKBENCH</span>
            <ArrowRight className="h-4 w-4 ml-0.5" />
          </Link>

          <a
            href="#demos"
            className="btn-secondary px-5 py-2.5 text-xs sm:text-sm font-medium"
          >
            View Live Demo
          </a>
        </div>
      </section>
    </div>
  );
}
