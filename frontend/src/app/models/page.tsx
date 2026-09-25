"use client";

import React, { useState, useEffect } from "react";
import { Cpu, CheckCircle, RefreshCw, Plus, X, AlertCircle, Zap } from "lucide-react";
import { api } from "@/lib/api";
import { ModelRegistryItem } from "@/types";

export default function ModelsPage() {
  const [models, setModels] = useState<ModelRegistryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [testPrompt, setTestPrompt] = useState<string>("Extract corrosion pitting from ultrasonic scan");
  const [hasFile, setHasFile] = useState<boolean>(true);
  const [routeResult, setRouteResult] = useState<any>(null);

  // New Model Registration Modal State
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newModel, setNewModel] = useState({
    id: "mistral-nemo:12b",
    name: "Mistral NeMo 12B (Air-Gapped)",
    provider: "Ollama (On-Premise Local)",
    capability: "REASONING",
    quantization: "Q4_K_M",
    vram_required_gb: 7.2,
    context_length: 32768,
    description: "High-parameter reasoning model for multi-department safety cross-checks and turnaround planning.",
  });
  const [registering, setRegistering] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      setLoading(true);
      const data = await api.listModels();
      setModels(data);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const handleTestRoute = async () => {
    try {
      const res = await api.dryRunRoute(testPrompt, hasFile);
      setRouteResult(res);
    } catch (e) {}
  };

  const handleRegisterModel = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      setRegistering(true);
      await api.registerModel(newModel);
      setSuccessMsg(`Model '${newModel.name}' registered successfully into on-premise catalog.`);
      await loadModels();
      setTimeout(() => {
        setShowModal(false);
        setSuccessMsg(null);
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to register model.");
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3A4149] pb-4">
        <div>
          <h1 className="text-xl font-bold text-[#E7E4D9] tracking-tight flex items-center gap-2">
            <Cpu className="h-5 w-5 text-[#3E7C96]" />
            Open-Weight Model Registry
          </h1>
          <p className="text-xs text-[#9BA2A9] mt-0.5">
            Self-hosted local models running via Ollama/vLLM. Extensible architecture — add new weights dynamically without code modifications.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold shadow-sm active:scale-95"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>+ Register New Model</span>
          </button>
          <button
            onClick={loadModels}
            className="btn-secondary flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition active:scale-95"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Model Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {models.map((m) => (
          <div
            key={m.id}
            className="rounded-xl border border-[#3A4149] bg-[#21262B] p-5 shadow-sm space-y-4 hover:border-[#4A535D] transition"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#E7E4D9]">{m.name}</h3>
                  {m.is_default && (
                    <span className="rounded bg-[#14181C] text-[#3E7C96] border border-[#3A4149] px-1.5 py-0.2 text-[9px] font-bold font-mono">
                      DEFAULT
                    </span>
                  )}
                </div>
                <div className="font-mono text-xs text-[#6D7C86] mt-0.5">{m.id}</div>
              </div>
              <span className="flex items-center gap-1 text-[10px] font-semibold text-[#6C8B78] bg-[#14181C] px-2 py-0.5 rounded border border-[#3A4149]">
                <CheckCircle className="h-3.5 w-3.5" />
                Active
              </span>
            </div>

            <p className="text-xs text-[#9BA2A9] leading-relaxed">{m.description}</p>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#3A4149] text-[11px]">
              <div className="rounded bg-[#14181C] p-2 border border-[#3A4149]">
                <div className="text-[#6D7C86]">Capability</div>
                <div className="font-semibold text-[#3E7C96] mt-0.5">{m.capability}</div>
              </div>
              <div className="rounded bg-[#14181C] p-2 border border-[#3A4149]">
                <div className="text-[#6D7C86]">Quantization</div>
                <div className="font-mono font-semibold text-[#E7E4D9] mt-0.5">{m.quantization}</div>
              </div>
              <div className="rounded bg-[#14181C] p-2 border border-[#3A4149]">
                <div className="text-[#6D7C86]">Est. VRAM</div>
                <div className="font-mono font-semibold text-[#9BA2A9] mt-0.5">{m.vram_required_gb} GB</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Model Router Interactive Simulator */}
      <div className="rounded-xl border border-[#3A4149] bg-[#21262B] p-5 shadow-sm space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#E7E4D9] flex items-center gap-2">
          <Zap className="h-4 w-4 text-[#3E7C96]" />
          Autonomous Model Router Simulator
        </h2>
        <p className="text-xs text-[#9BA2A9]">
          Test how the intelligent classifier maps incoming industrial tasks to specialized open-weight models.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-8">
            <label className="text-[11px] font-medium text-[#9BA2A9]">Test Task Query</label>
            <input
              type="text"
              value={testPrompt}
              onChange={(e) => setTestPrompt(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#3A4149] bg-[#14181C] p-2.5 text-xs text-[#E7E4D9] focus:border-[#3E7C96] focus:outline-none transition"
            />
          </div>
          <div className="md:col-span-2">
            <label className="flex items-center gap-2 text-xs text-[#9BA2A9] pb-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasFile}
                onChange={(e) => setHasFile(e.target.checked)}
                className="rounded border-[#3A4149] bg-[#14181C] text-[#3E7C96]"
              />
              Has Attachment
            </label>
          </div>
          <div className="md:col-span-2">
            <button
              onClick={handleTestRoute}
              className="btn-primary w-full rounded-lg py-2.5 text-xs font-semibold shadow-sm active:scale-95"
            >
              Simulate Route
            </button>
          </div>
        </div>

        {routeResult && (
          <div className="mt-3 rounded-lg border border-[#3A4149] bg-[#14181C] p-4 text-xs space-y-2 animate-fade-in-up">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#E7E4D9] text-sm">Routed Model: <span className="text-[#3E7C96]">{routeResult.selected_model}</span></span>
              <span className="rounded bg-[#21262B] text-[#9BA2A9] border border-[#3A4149] px-2 py-0.5 text-[10px] font-mono font-bold">
                {routeResult.task_type}
              </span>
            </div>
            <p className="text-[#9BA2A9] text-xs leading-relaxed">{routeResult.reasoning}</p>
          </div>
        )}
      </div>

      {/* Register New Model Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-xl border border-[#3A4149] bg-[#14181C] p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#3A4149] pb-3">
              <h3 className="text-sm font-bold text-[#E7E4D9] flex items-center gap-2">
                <Plus className="h-4 w-4 text-[#3E7C96]" />
                Register New Open-Weight Model
              </h3>
              <button onClick={() => setShowModal(false)} className="text-[#6D7C86] hover:text-[#E7E4D9] transition">
                <X className="h-4 w-4" />
              </button>
            </div>

            {errorMsg && (
              <div className="rounded bg-[#21262B] border border-[#A63C2B] p-2.5 text-xs text-[#A63C2B] flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="rounded bg-[#21262B] border border-[#6C8B78] p-2.5 text-xs text-[#6C8B78] flex items-center gap-2">
                <CheckCircle className="h-4 w-4 shrink-0" />
                {successMsg}
              </div>
            )}

            <form onSubmit={handleRegisterModel} className="space-y-3 text-xs">
              <div>
                <label className="text-[#9BA2A9] font-medium">Model ID (Ollama tag / local path)</label>
                <input
                  type="text"
                  required
                  value={newModel.id}
                  onChange={(e) => setNewModel({ ...newModel, id: e.target.value })}
                  className="mt-1 w-full rounded border border-[#3A4149] bg-[#21262B] p-2 text-[#E7E4D9] font-mono text-xs focus:border-[#3E7C96] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[#9BA2A9] font-medium">Display Name</label>
                <input
                  type="text"
                  required
                  value={newModel.name}
                  onChange={(e) => setNewModel({ ...newModel, name: e.target.value })}
                  className="mt-1 w-full rounded border border-[#3A4149] bg-[#21262B] p-2 text-[#E7E4D9] text-xs focus:border-[#3E7C96] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#9BA2A9] font-medium">Capability</label>
                  <select
                    value={newModel.capability}
                    onChange={(e) => setNewModel({ ...newModel, capability: e.target.value })}
                    className="mt-1 w-full rounded border border-[#3A4149] bg-[#21262B] p-2 text-[#E7E4D9] text-xs focus:border-[#3E7C96] focus:outline-none"
                  >
                    <option value="REASONING">REASONING</option>
                    <option value="CODE">CODE</option>
                    <option value="VISION">VISION</option>
                    <option value="GENERAL">GENERAL</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#9BA2A9] font-medium">Quantization</label>
                  <select
                    value={newModel.quantization}
                    onChange={(e) => setNewModel({ ...newModel, quantization: e.target.value })}
                    className="mt-1 w-full rounded border border-[#3A4149] bg-[#21262B] p-2 text-[#E7E4D9] font-mono text-xs focus:border-[#3E7C96] focus:outline-none"
                  >
                    <option value="Q4_K_M">Q4_K_M (4-bit)</option>
                    <option value="Q8_0">Q8_0 (8-bit)</option>
                    <option value="FP16">FP16 (Half)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#9BA2A9] font-medium">Est. VRAM (GB)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newModel.vram_required_gb}
                    onChange={(e) => setNewModel({ ...newModel, vram_required_gb: parseFloat(e.target.value) || 0 })}
                    className="mt-1 w-full rounded border border-[#3A4149] bg-[#21262B] p-2 text-[#E7E4D9] font-mono text-xs focus:border-[#3E7C96] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[#9BA2A9] font-medium">Context Window</label>
                  <input
                    type="number"
                    required
                    value={newModel.context_length}
                    onChange={(e) => setNewModel({ ...newModel, context_length: parseInt(e.target.value) || 32768 })}
                    className="mt-1 w-full rounded border border-[#3A4149] bg-[#21262B] p-2 text-[#E7E4D9] font-mono text-xs focus:border-[#3E7C96] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#9BA2A9] font-medium">Description</label>
                <textarea
                  rows={2}
                  value={newModel.description}
                  onChange={(e) => setNewModel({ ...newModel, description: e.target.value })}
                  className="mt-1 w-full rounded border border-[#3A4149] bg-[#21262B] p-2 text-[#E7E4D9] text-xs focus:border-[#3E7C96] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary px-3 py-1.5 rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={registering}
                  className="btn-primary px-4 py-1.5 rounded text-xs font-semibold disabled:opacity-50"
                >
                  {registering ? "Registering..." : "Add to Registry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
