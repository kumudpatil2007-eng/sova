"use client";

import React, { useState, useEffect } from "react";
import { FileText, Download, Presentation, FileSpreadsheet, Sparkles, Search } from "lucide-react";
import { api } from "@/lib/api";
import { Task, GeneratedFile } from "@/types";

export default function DeliverablesPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<string>("");

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const data = await api.listTasks();
      setTasks(data);
    } catch (e) {}
  };

  const allFiles: { file: GeneratedFile; taskTitle: string; taskDate: string }[] = [];
  tasks.forEach((t) => {
    (t.generated_files || []).forEach((f) => {
      allFiles.push({
        file: f,
        taskTitle: t.title,
        taskDate: t.created_at
      });
    });
  });

  const filtered = allFiles.filter(item => 
    item.file.filename.toLowerCase().includes(filter.toLowerCase()) ||
    item.taskTitle.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#3A4149] pb-4">
        <div>
          <h1 className="text-xl font-bold text-[#E7E4D9] tracking-tight flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#3E7C96]" />
            Generated Sovereign Deliverables Gallery
          </h1>
          <p className="text-xs text-[#9BA2A9] mt-0.5">
            Official enterprise artifacts (.docx Approval Notes, .pptx Slide Decks, .xlsx Workbooks) synthesized by sovereign agents.
          </p>
        </div>
        <span className="rounded-lg bg-[#21262B] border border-[#3A4149] px-3 py-1 text-xs font-mono font-medium text-[#9BA2A9] shadow-sm">
          Total Artifacts: {allFiles.length}
        </span>
      </div>

      <div className="rounded-xl border border-[#3A4149] bg-[#21262B] p-5 shadow-sm space-y-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#6D7C86]" />
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search generated deliverables..."
            className="w-full rounded-lg border border-[#3A4149] bg-[#14181C] pl-9 p-2 text-xs text-[#E7E4D9] placeholder-[#6D7C86] focus:border-[#3E7C96] focus:outline-none transition font-sans"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="py-12 text-center text-[#6D7C86] space-y-2">
            <FileText className="h-8 w-8 mx-auto text-[#6D7C86]" />
            <p className="text-xs">No generated files yet. Launch Demo 1 or Demo 2 on the AI Workbench to produce real deliverables.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item, idx) => {
              const { file, taskTitle, taskDate } = item;
              let Icon = FileText;
              let colorClass = "text-[#3E7C96]";
              if (file.file_type === "DOCX") {
                Icon = FileText;
                colorClass = "text-[#3E7C96]";
              } else if (file.file_type === "PPTX") {
                Icon = Presentation;
                colorClass = "text-[#A63C2B]";
              } else if (file.file_type === "XLSX") {
                Icon = FileSpreadsheet;
                colorClass = "text-[#6C8B78]";
              }

              return (
                <div
                  key={idx}
                  className="rounded-xl border border-[#3A4149] bg-[#14181C] p-4 space-y-3 flex flex-col justify-between hover:border-[#4A535D] transition group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-5 w-5 ${colorClass}`} />
                        <span className="font-semibold text-[#E7E4D9] text-xs">{file.file_type} Deliverable</span>
                      </div>
                      <span className="text-[10px] text-[#6D7C86] font-mono">
                        {(file.file_size_bytes / 1024).toFixed(1)} KB
                      </span>
                    </div>
                    <div className="text-xs font-mono font-bold text-[#E7E4D9] truncate">{file.filename}</div>
                    <p className="text-[11px] text-[#9BA2A9] line-clamp-2">{taskTitle}</p>
                  </div>

                  <div className="pt-3 border-t border-[#3A4149] flex items-center justify-between">
                    <span className="text-[10px] text-[#6D7C86] font-mono">
                      {new Date(taskDate).toLocaleDateString()}
                    </span>
                    <a
                      href={api.getDownloadUrl(file.filename)}
                      download
                      className="btn-primary flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-semibold shadow-sm active:scale-95"
                    >
                      <Download className="h-3 w-3" />
                      <span>Download</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
