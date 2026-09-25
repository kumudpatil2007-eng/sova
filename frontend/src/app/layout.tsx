import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "SOVA Workbench — SIH 2026 (PS 26117 | MRPL)",
  description: "Smart India Hackathon 2026: SOVA on-premise agentic AI workbench using open-weight multimodal LLMs for confidential industrial work (Mangalore Refinery & Petrochemicals Ltd).",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#14181C",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-[#14181C] text-[#E7E4D9] flex flex-col antialiased selection:bg-[#3E7C96] selection:text-[#E7E4D9]">
        <Navbar />
        <main className="flex-1 max-w-7xl 2xl:max-w-[1536px] w-full mx-auto p-2 sm:p-4 md:p-5 flex flex-col">{children}</main>
        <footer className="border-t border-[#3A4149] bg-[#101316] py-5 text-center text-xs text-[#9BA2A9]">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3 text-left">
            <div>
              <div className="text-[#E7E4D9] font-semibold text-[11px] sm:text-xs flex items-center gap-2">
                <span>Smart India Hackathon 2026 (Software Edition)</span>
                <span className="rounded bg-[#21262B] text-[#9BA2A9] border border-[#3A4149] font-mono text-[9px] px-1.5 py-0.5 font-bold">
                  PS ID: 26117
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-[#9BA2A9] mt-0.5">
                Mangalore Refinery and Petrochemicals Limited (MRPL) • Ministry of Petroleum &amp; Natural Gas (MoPNG)
              </p>
            </div>
            <div className="text-right flex flex-col items-start md:items-end">
              <span className="text-[#6C8B78] font-mono text-[10px] sm:text-xs font-bold flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#6C8B78]"></span>
                100% Air-Gapped On-Premise GPU Execution • 0 External Egress
              </span>
              <span className="text-[#6D7C86] text-[10px] mt-0.5">
                Compliant with CERT-In Air-Gap Guidelines &amp; DPDP Act 2023
              </span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
