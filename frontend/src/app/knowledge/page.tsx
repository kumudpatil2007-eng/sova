"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, Search, FileText, Database } from "lucide-react";
import { api } from "@/lib/api";
import { KnowledgeDocument } from "@/types";

export default function KnowledgePage() {
  const [docs, setDocs] = useState<KnowledgeDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("heat exchanger minimum tube thickness SOP-08");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  useEffect(() => {
    loadDocs();
  }, []);

  const loadDocs = async () => {
    try {
      const data = await api.listDocuments();
      setDocs(data);
    } catch (e) {}
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const results = await api.searchKnowledge(searchQuery);
      setSearchResults(results);
    } catch (e) {
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="border-b border-[#3A4149] pb-4">
        <h1 className="text-xl font-bold text-[#E7E4D9] tracking-tight flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-[#3E7C96]" />
          Enterprise Knowledge Base (On-Premise RAG)
        </h1>
        <p className="text-xs text-[#9BA2A9] mt-0.5">
          Local refinery SOPs, equipment manuals, and statutory safety directives indexed into sovereign vector chunks.
        </p>
      </div>

      {/* Semantic Search Bar */}
      <div className="rounded-xl border border-[#3A4149] bg-[#21262B] p-5 shadow-sm space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#E7E4D9] flex items-center gap-2">
          <Search className="h-4 w-4 text-[#3E7C96]" />
          Hybrid Semantic &amp; BM25 Knowledge Retrieval
        </h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search refinery standards (e.g. minimum allowable tube thickness SOP-08)..."
            className="flex-1 rounded-lg border border-[#3A4149] bg-[#14181C] p-2.5 text-xs text-[#E7E4D9] placeholder-[#6D7C86] focus:border-[#3E7C96] focus:outline-none transition font-sans"
          />
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="btn-primary rounded-lg px-5 py-2.5 text-xs font-semibold shadow-sm active:scale-95 disabled:opacity-50"
          >
            {isSearching ? "Searching..." : "Query RAG"}
          </button>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-3 pt-3 border-t border-[#3A4149] animate-fade-in-up">
            <h3 className="text-xs font-semibold text-[#E7E4D9]">Matching Grounded Chunks</h3>
            <div className="grid grid-cols-1 gap-2.5">
              {searchResults.map((res, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-[#3A4149] bg-[#14181C] p-4 text-xs space-y-2 hover:border-[#4A535D] transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#3E7C96]">{res.source_citation}</span>
                    <span className="rounded bg-[#21262B] text-[#9BA2A9] border border-[#3A4149] px-2 py-0.5 text-[10px] font-mono">
                      Score: {res.score}
                    </span>
                  </div>
                  <p className="text-[#9BA2A9] leading-relaxed text-[11px] font-sans">{res.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Indexed Documents Table */}
      <div className="rounded-xl border border-[#3A4149] bg-[#21262B] p-5 shadow-sm space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#E7E4D9] flex items-center gap-2">
          <Database className="h-4 w-4 text-[#3E7C96]" />
          Indexed Sovereign Documents ({docs.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {docs.map((doc, idx) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-3.5 rounded-lg border border-[#3A4149] bg-[#14181C] hover:border-[#4A535D] transition"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-[#21262B] border border-[#3A4149] flex items-center justify-center shrink-0">
                  <FileText className="h-4 w-4 text-[#3E7C96]" />
                </div>
                <div>
                  <div className="font-bold text-xs text-[#E7E4D9]">{doc.title}</div>
                  <div className="text-[10px] text-[#6D7C86] font-mono mt-0.5">
                    Category: {doc.category} • Chunks: {doc.chunk_count}
                  </div>
                </div>
              </div>
              <span className="rounded bg-[#21262B] text-[#6C8B78] border border-[#3A4149] px-2 py-0.5 text-[9px] font-mono font-bold">
                INDEXED
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
