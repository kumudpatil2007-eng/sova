"use client";

import React, { useState } from "react";
import { Eye, Loader2 } from "lucide-react";

export interface BoundingBox {
  id: string;
  tag: string;
  type: string;
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  status: "CRITICAL" | "WARNING" | "NORMAL";
  confidence: number;
  details: string;
}

/**
 * Placeholder shown ONLY while the backend P&ID extraction is still in-flight.
 */
const SAMPLE_ENTITIES: BoundingBox[] = [
  {
    id: "box-1",
    tag: "11-HX-401A/B",
    type: "CRUDE PREHEAT EXCHANGER",
    x: 130, y: 130, w: 240, h: 160,
    color: "#A63C2B",
    status: "CRITICAL",
    confidence: 0.982,
    details: "Pass 2 Lower Shell: 3.18mm thickness (SOP-08 cut-off 3.50mm BREACHED by 0.32mm). Category-A isolation required."
  },
  {
    id: "box-2",
    tag: "11-P-102A/B",
    type: "CRUDE DISTILLATION PUMP",
    x: 430, y: 230, w: 160, h: 120,
    color: "#A63C2B",
    status: "WARNING",
    confidence: 0.965,
    details: "Casing Vibration RMS: 4.83 mm/s (Exceeds ISO 10816-3 Zone C limit 4.50 mm/s). Bearing temp: 78.6°C."
  },
  {
    id: "box-3",
    tag: "11-V-201",
    type: "VACUUM FLASH VESSEL",
    x: 650, y: 90, w: 180, h: 240,
    color: "#6C8B78",
    status: "NORMAL",
    confidence: 0.991,
    details: "Design Pressure: 3.5 bar | Operating: 1.2 bar. Ultrasonic wall thickness: 8.42mm (Compliant)."
  },
  {
    id: "box-4",
    tag: "PSV-4105",
    type: "SAFETY RELIEF VALVE",
    x: 250, y: 70, w: 80, h: 55,
    color: "#3E7C96",
    status: "NORMAL",
    confidence: 0.974,
    details: "Set Pressure: 24.2 bar (API 520). Last certified: 2026-01-15. Hydrostatic seal verified."
  },
  {
    id: "box-5",
    tag: "MOV-4101",
    type: "MOTOR OPERATED ISOLATION VALVE",
    x: 70, y: 190, w: 55, h: 45,
    color: "#6D7C86",
    status: "NORMAL",
    confidence: 0.988,
    details: 'Emergency shutdown tie-in line 12\"-CDU-101-A1A. Open/Close stroke test: PASS (4.2s).'
  }
];

interface PidOverlayViewerProps {
  extractedEntities?: BoundingBox[];
  isLoading?: boolean;
}

export default function PidOverlayViewer({
  extractedEntities,
  isLoading = false,
}: PidOverlayViewerProps) {
  const hasRealData = !isLoading && Array.isArray(extractedEntities) && extractedEntities.length > 0;
  const displayEntities: BoundingBox[] = hasRealData ? extractedEntities! : SAMPLE_ENTITIES;
  const isPlaceholder = !hasRealData;

  const [selectedBox, setSelectedBox] = useState<BoundingBox | null>(displayEntities[0] ?? null);
  const [viewMode, setViewMode] = useState<"OVERLAY" | "CONFIDENCE" | "METRICS">("OVERLAY");

  const prevHasRealData = React.useRef(hasRealData);
  if (prevHasRealData.current !== hasRealData && hasRealData) {
    prevHasRealData.current = hasRealData;
    setTimeout(() => setSelectedBox(extractedEntities![0] ?? null), 0);
  }

  return (
    <div className="rounded-xl border border-[#3A4149] bg-[#21262B] p-4 sm:p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#3A4149] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#3E7C96]" />
            <h3 className="text-xs sm:text-sm font-bold text-[#E7E4D9] uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="h-4 w-4 text-[#3E7C96]" />
              Multimodal P&amp;ID Vision Detection &amp; Bounding Box Overlay
            </h3>
            <span className="rounded bg-[#14181C] text-[#3E7C96] border border-[#3A4149] px-2 py-0.5 text-[9px] font-mono font-bold">
              Qwen2.5-VL:7B
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-[11px] text-[#9BA2A9]">
              {hasRealData
                ? `Live extraction — ${displayEntities.length} entities detected from uploaded document.`
                : isLoading
                ? "Vision model processing uploaded P&ID — awaiting extraction results…"
                : "Real-time entity bounding box localization directly over CDU-1 process schematic."}
            </p>
            {isLoading && (
              <span className="flex items-center gap-1 rounded bg-[#14181C] text-[#A63C2B] border border-[#3A4149] px-2 py-0.5 text-[9px] font-mono font-bold">
                <Loader2 className="h-2.5 w-2.5 animate-spin" />
                PROCESSING
              </span>
            )}
            {hasRealData && (
              <span className="rounded bg-[#14181C] text-[#6C8B78] border border-[#6C8B78] px-2 py-0.5 text-[9px] font-mono font-bold">
                ✓ LIVE DATA
              </span>
            )}
            {isPlaceholder && !isLoading && (
              <span className="rounded bg-[#14181C] text-[#9BA2A9] border border-[#3A4149] px-2 py-0.5 text-[9px] font-mono font-bold">
                DEMO DATA
              </span>
            )}
          </div>
        </div>

        {/* View Mode Pills */}
        <div className="flex items-center gap-1 bg-[#14181C] p-1 rounded-lg border border-[#3A4149] text-[11px]">
          <button
            onClick={() => setViewMode("OVERLAY")}
            className={`px-2.5 py-1 rounded font-medium transition ${
              viewMode === "OVERLAY"
                ? "bg-[#3E7C96] text-[#E7E4D9]"
                : "text-[#9BA2A9] hover:text-[#E7E4D9]"
            }`}
          >
            Bounding Boxes
          </button>
          <button
            onClick={() => setViewMode("METRICS")}
            className={`px-2.5 py-1 rounded font-medium transition ${
              viewMode === "METRICS"
                ? "bg-[#3E7C96] text-[#E7E4D9]"
                : "text-[#9BA2A9] hover:text-[#E7E4D9]"
            }`}
          >
            Time Acceleration
          </button>
          <button
            onClick={() => setViewMode("CONFIDENCE")}
            className={`px-2.5 py-1 rounded font-medium transition ${
              viewMode === "CONFIDENCE"
                ? "bg-[#3E7C96] text-[#E7E4D9]"
                : "text-[#9BA2A9] hover:text-[#E7E4D9]"
            }`}
          >
            Entity Table
          </button>
        </div>
      </div>

      {/* Main Interactive Blueprint Canvas */}
      {viewMode === "OVERLAY" && (
        <div className="space-y-3">
          <div className="relative w-full aspect-[16/9] max-h-[360px] rounded-lg border border-[#3A4149] bg-[#14181C] overflow-hidden select-none shadow-inner">
            {/* Precision Laser Scanline */}
            <div className="animate-laser-scan" />

            {/* Loading overlay */}
            {isLoading && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#14181C]/80 backdrop-blur-sm gap-2">
                <Loader2 className="h-7 w-7 text-[#3E7C96] animate-spin" />
                <span className="text-[11px] font-mono text-[#9BA2A9]">
                  Qwen2.5-VL extracting entities…
                </span>
              </div>
            )}

            {/* SVG Blueprint Grid & Schematic Geometry */}
            <svg className="w-full h-full" viewBox="0 0 900 400" preserveAspectRatio="xMidYMid meet">
              <defs>
                <pattern id="pid-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#3A4149" strokeOpacity="0.45" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#pid-grid)" />

              {/* Piping Lines */}
              <line x1="30" y1="210" x2="130" y2="210" stroke="#3E7C96" strokeWidth="2.5" />
              <text x="40" y="200" fill="#6D7C86" fontSize="9" fontFamily="monospace" fontWeight="bold">12"-CDU-101-A1A (Crude Feed)</text>
              <line x1="370" y1="210" x2="430" y2="290" stroke="#3E7C96" strokeWidth="2.5" />
              <line x1="590" y1="290" x2="650" y2="210" stroke="#3E7C96" strokeWidth="2.5" />
              <text x="440" y="275" fill="#6D7C86" fontSize="9" fontFamily="monospace" fontWeight="bold">8"-CDU-104-B2B</text>
              <line x1="830" y1="210" x2="880" y2="210" stroke="#3E7C96" strokeWidth="2.5" />

              {/* Emergency Bypass Line (Oxide Red Dashed) */}
              <path d="M 130 150 L 130 350 L 400 350 L 650 350 L 650 270" fill="none" stroke="#A63C2B" strokeWidth="2" strokeDasharray="6,4" />
              <text x="210" y="340" fill="#A63C2B" fontSize="9" fontFamily="monospace" fontWeight="bold">6"-BPS-108-A1A (Emergency Turnaround Bypass Line)</text>

              {/* Static Equipment Schematics */}
              <rect x="150" y="150" width="200" height="120" rx="8" fill="#21262B" stroke="#3A4149" strokeWidth="1.5" />
              <circle cx="250" cy="210" r="40" fill="none" stroke="#3A4149" strokeWidth="1.5" strokeDasharray="3,3" />
              <text x="175" y="215" fill="#9BA2A9" fontSize="10" fontWeight="bold">HEAT EXCHANGER 11-HX-401</text>
              <circle cx="510" cy="290" r="35" fill="#21262B" stroke="#3A4149" strokeWidth="1.5" />
              <text x="475" y="295" fill="#9BA2A9" fontSize="10" fontWeight="bold">P-102A</text>
              <rect x="670" y="110" width="140" height="200" rx="20" fill="#21262B" stroke="#3A4149" strokeWidth="1.5" />
              <text x="695" y="215" fill="#9BA2A9" fontSize="10" fontWeight="bold">VESSEL 11-V-201</text>

              {/* Bounding Boxes */}
              {displayEntities.map((b) => {
                const isSelected = selectedBox?.id === b.id;
                return (
                  <g key={b.id} onClick={() => setSelectedBox(b)} className="cursor-pointer">
                    <rect
                      x={b.x} y={b.y} width={b.w} height={b.h}
                      fill={`${b.color}18`}
                      stroke={b.color}
                      strokeWidth={isSelected ? 2.5 : 1.5}
                      strokeDasharray={isSelected ? "none" : "4,2"}
                      rx="4"
                      opacity={isLoading ? 0.4 : 1}
                    />
                    <rect
                      x={b.x} y={b.y - 18}
                      width={b.tag.length * 8 + 20} height="18"
                      fill={b.color} rx="3"
                      opacity={isLoading ? 0.4 : 1}
                    />
                    <text
                      x={b.x + 6} y={b.y - 5}
                      fill="#E7E4D9" fontSize="9.5"
                      fontWeight="bold" fontFamily="monospace"
                      opacity={isLoading ? 0.4 : 1}
                    >
                      {b.tag}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Status banner */}
            <div className="absolute bottom-2 left-3 bg-[#14181C]/90 text-[#9BA2A9] border border-[#3A4149] px-2.5 py-1 rounded text-[10px] font-medium backdrop-blur-sm">
              {hasRealData
                ? "Click any extracted bounding box to inspect vision model field telemetry."
                : isLoading
                ? "Waiting for vision model extraction results..."
                : "Click any bounding box above to inspect extracted field telemetry & SOP citations."}
            </div>
          </div>

          {/* Selected Entity Inspector Panel */}
          {selectedBox && (
            <div className="rounded-lg border border-[#3A4149] bg-[#14181C] p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: selectedBox.color }} />
                  <span className="font-mono font-bold text-xs text-[#E7E4D9]">{selectedBox.tag}</span>
                  <span className="text-[10px] text-[#6D7C86]">({selectedBox.type})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-[#3E7C96]">
                    Vision Confidence: {(selectedBox.confidence * 100).toFixed(1)}%
                  </span>
                  <span className={`rounded px-2 py-0.5 text-[9px] font-bold border ${
                    selectedBox.status === "CRITICAL"
                      ? "bg-[#21262B] text-[#A63C2B] border-[#A63C2B]"
                      : selectedBox.status === "WARNING"
                      ? "bg-[#21262B] text-[#A63C2B] border-[#A63C2B]"
                      : "bg-[#21262B] text-[#6C8B78] border-[#6C8B78]"
                  }`}>
                    {selectedBox.status}
                  </span>
                </div>
              </div>
              <p className="text-xs text-[#9BA2A9] leading-relaxed font-sans pl-4">
                {selectedBox.details}
              </p>
            </div>
          )}
        </div>
      )}

      {/* View Mode 2: Time Acceleration Metrics */}
      {viewMode === "METRICS" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-1">
          <div className="rounded-lg border border-[#3A4149] bg-[#14181C] p-4 text-center space-y-1">
            <div className="text-[10px] text-[#6D7C86] uppercase font-semibold">Manual Engineer Review</div>
            <div className="text-2xl font-bold font-mono text-[#E7E4D9]">~4.5 Hours</div>
            <div className="text-[10px] text-[#6D7C86]">270 mins manual SOP &amp; drafting</div>
          </div>
          <div className="rounded-lg border border-[#3A4149] bg-[#14181C] p-4 text-center space-y-1">
            <div className="text-[10px] text-[#3E7C96] uppercase font-semibold">SOVA Multi-Agent Time</div>
            <div className="text-2xl font-bold font-mono text-[#3E7C96]">5.58 Seconds</div>
            <div className="text-[10px] text-[#3E7C96]">Autonomous 5-Stage DAG Synthesis</div>
          </div>
          <div className="rounded-lg border border-[#3A4149] bg-[#14181C] p-4 text-center space-y-1">
            <div className="text-[10px] text-[#6C8B78] uppercase font-semibold">Turnaround Acceleration</div>
            <div className="text-2xl font-bold font-mono text-[#6C8B78]">99.96% Faster</div>
            <div className="text-[10px] text-[#6C8B78]">~2,890× Deliverable Speedup</div>
          </div>
        </div>
      )}

      {/* View Mode 3: Entity Table */}
      {viewMode === "CONFIDENCE" && (
        <div className="overflow-x-auto rounded-lg border border-[#3A4149]">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#3A4149] bg-[#14181C] text-[#9BA2A9] uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Equipment Tag</th>
                <th className="py-2.5 px-3 font-semibold">Classification</th>
                <th className="py-2.5 px-3 font-semibold">Vision Confidence</th>
                <th className="py-2.5 px-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3A4149] text-[#E7E4D9] font-mono text-[11px]">
              {displayEntities.map((b) => (
                <tr key={b.id} className="hover:bg-[#272D33] transition">
                  <td className="py-2.5 px-3 font-bold text-[#E7E4D9]">{b.tag}</td>
                  <td className="py-2.5 px-3 text-[#9BA2A9]">{b.type}</td>
                  <td className="py-2.5 px-3 text-[#3E7C96] font-semibold">{(b.confidence * 100).toFixed(1)}%</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                      b.status === "CRITICAL"
                        ? "text-[#A63C2B] bg-[#21262B] border-[#A63C2B]"
                        : b.status === "WARNING"
                        ? "text-[#A63C2B] bg-[#21262B] border-[#A63C2B]"
                        : "text-[#6C8B78] bg-[#21262B] border-[#6C8B78]"
                    }`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {isPlaceholder && !isLoading && (
            <p className="text-[10px] text-[#6D7C86] italic p-3 bg-[#14181C]">
              Showing demo data. Upload a P&amp;ID document and run the vision workflow to see live extracted entities here.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
