"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ShieldCheck, 
  Terminal, 
  Sparkles, 
  BookOpen, 
  Cpu, 
  Wrench, 
  Activity, 
  Lock, 
  UserCheck, 
  LayoutDashboard,
  Menu,
  X,
  Award,
  Flame,
  CheckCircle2,
  ChevronDown,
  ArrowRight
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { api } from "@/lib/api";

export default function Navbar() {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [systemOpen, setSystemOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("sovereign_user");
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {}
    } else {
      const defaultUser = {
        email: "engineer@mrpl.co.in",
        full_name: "Er. Rajesh K. Nayak",
        role: "ENGINEER",
        department: "Plant Integrity"
      };
      localStorage.setItem("sovereign_user", JSON.stringify(defaultUser));
      setCurrentUser(defaultUser);
    }
  }, []);

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setSystemOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSystemOpen(false);
  }, [pathname]);

  // Simplified Primary Navigation
  const primaryNavItems = [
    { label: "Platform", href: "/#platform" },
    { label: "Workbench", href: "/workbench" },
    { label: "Demos", href: "/#demos" },
    { label: "Architecture", href: "/#architecture" },
    { label: "Security", href: "/security" },
  ];

  // Advanced / Subsystems (Accessible under System menu)
  const systemModules = [
    { label: "Operations Dashboard", href: "/dashboard", icon: LayoutDashboard, desc: "System health & telemetry" },
    { label: "Model Registry", href: "/models", icon: Cpu, desc: "Open-weight models & dynamic router" },
    { label: "Knowledge Base", href: "/knowledge", icon: BookOpen, desc: "Refinery SOPs & vector RAG" },
    { label: "Tool Registry", href: "/tools", icon: Wrench, desc: "Air-gapped sandboxed tools" },
    { label: "Audit Logs", href: "/audit", icon: Activity, desc: "Cryptographic event provenance" },
    { label: "Deliverables Gallery", href: "/deliverables", icon: Sparkles, desc: "Generated .docx, .pptx, and .xlsx" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#14181C] border-b border-[#3A4149] shadow-sm">
      {/* Official SIH 2026 Top Ribbon */}
      <div className="bg-[#101316] border-b border-[#2B3138] text-[#9BA2A9] px-3 sm:px-6 py-1 text-[10px] sm:text-[11px] font-medium flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-[#E7E4D9] font-semibold tracking-wide">
            <Award className="h-3.5 w-3.5 text-[#3E7C96] shrink-0" />
            <span>SMART INDIA HACKATHON 2026</span>
          </div>
          <span className="text-[#3A4149] hidden md:inline">•</span>
          <div className="flex items-center gap-1.5 text-[#9BA2A9]">
            <Flame className="h-3 w-3 text-[#3E7C96] shrink-0" />
            <span className="font-bold text-[#E7E4D9]">MRPL</span>
            <span className="text-[#6D7C86] hidden sm:inline">(Mangalore Refinery &amp; Petrochemicals Ltd)</span>
          </div>
          <span className="text-[#3A4149] hidden lg:inline">•</span>
          <span className="rounded bg-[#21262B] text-[#9BA2A9] border border-[#3A4149] px-1.5 py-0.2 font-mono text-[9px] font-bold hidden lg:inline-block">
            PS 26117
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 text-[10px] text-[#9BA2A9]">
          <div className="flex items-center gap-1 text-[#6C8B78] font-semibold">
            <CheckCircle2 className="h-3 w-3 text-[#6C8B78] shrink-0" />
            <span className="hidden sm:inline">CERT-In Compliant</span>
          </div>
          <span className="text-[#3A4149] hidden sm:inline">•</span>
          <span className="font-mono text-[#6C8B78] font-bold flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#6C8B78]"></span>
            100% AIR-GAPPED ON-PREMISE
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="bg-[#14181C]">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6">
          {/* Brand & Organization */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#3A4149] bg-[#21262B] text-[#9BA2A9] hover:text-[#E7E4D9] xl:hidden focus:outline-none transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#3E7C96] text-[#E7E4D9] group-hover:bg-[#4A8FAC] transition shrink-0 shadow-sm">
                <Lock className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold tracking-tight text-[#E7E4D9] group-hover:text-[#3E7C96] transition-colors">
                    SOVA
                  </span>
                  <span className="rounded bg-[#21262B] px-1.5 py-0.2 text-[9px] font-mono font-bold text-[#3E7C96] border border-[#3A4149]">
                    AIR-GAP
                  </span>
                </div>
                <p className="text-[10px] text-[#9BA2A9] truncate max-w-[130px] sm:max-w-none">
                  MRPL Refinery AI Workbench
                </p>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1 ml-4 border-l border-[#3A4149] pl-4">
              {primaryNavItems.map((item) => {
                const isActive = pathname === item.href || (item.href === "/workbench" && pathname.startsWith("/workbench"));
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
                      isActive
                        ? "text-[#E7E4D9] bg-[#21262B] border border-[#3A4149] font-semibold"
                        : "text-[#9BA2A9] hover:text-[#E7E4D9] hover:bg-[#21262B] font-medium"
                    }`}
                  >
                    {isActive && <span className="h-1.5 w-1.5 rounded-full bg-[#3E7C96] shrink-0" />}
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {/* Subsystems Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setSystemOpen(!systemOpen)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    systemOpen
                      ? "text-[#E7E4D9] bg-[#21262B] border border-[#3A4149]"
                      : "text-[#9BA2A9] hover:text-[#E7E4D9] hover:bg-[#21262B]"
                  }`}
                >
                  <span>System</span>
                  <ChevronDown className={`h-3 w-3 transition-transform ${systemOpen ? "rotate-180" : ""}`} />
                </button>

                {systemOpen && (
                  <div className="absolute left-0 mt-2 w-72 rounded-xl border border-[#3A4149] bg-[#21262B] shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-2.5 py-1.5 text-[10px] uppercase font-bold text-[#6D7C86] border-b border-[#3A4149] mb-1 tracking-wider">
                      Refinery Subsystems &amp; Registries
                    </div>
                    <div className="space-y-1">
                      {systemModules.map((mod) => {
                        const Icon = mod.icon;
                        const isCurrent = pathname === mod.href;
                        return (
                          <Link
                            key={mod.href}
                            href={mod.href}
                            onClick={() => setSystemOpen(false)}
                            className={`flex items-start gap-2.5 p-2 rounded-lg text-xs transition ${
                              isCurrent
                                ? "bg-[#272D33] text-[#E7E4D9] border border-[#3A4149]"
                                : "hover:bg-[#272D33] text-[#9BA2A9] hover:text-[#E7E4D9]"
                            }`}
                          >
                            <Icon className="h-4 w-4 text-[#3E7C96] mt-0.5 shrink-0" />
                            <div>
                              <div className="font-medium text-[#E7E4D9] text-xs">{mod.label}</div>
                              <div className="text-[10px] text-[#6D7C86]">{mod.desc}</div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* Right Actions: Zero Egress, Launch CTA, Persona */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Zero Egress Badge */}
            <div className="flex items-center gap-1.5 rounded-lg border border-[#3A4149] bg-[#21262B] px-2.5 py-1.5 text-xs text-[#9BA2A9]">
              <span className="h-2 w-2 rounded-full bg-[#6C8B78] shrink-0" />
              <span className="font-mono font-bold text-[10px] sm:text-[11px] text-[#6C8B78] hidden md:inline">0 EXTERNAL CALLS</span>
              <span className="font-mono font-bold text-[10px] text-[#6C8B78] md:hidden">0 LEAKS</span>
            </div>

            {/* Launch Workbench CTA Button */}
            <Link
              href="/workbench"
              className="btn-primary hidden sm:flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold shadow-sm transition active:scale-95 shrink-0"
            >
              <Terminal className="h-3.5 w-3.5" />
              <span>Launch Workbench</span>
              <ArrowRight className="h-3 w-3" />
            </Link>

            {/* Persona Link */}
            <Link 
              href="/login"
              className="flex items-center gap-1.5 sm:gap-2 rounded-lg border border-[#3A4149] bg-[#21262B] px-2 sm:px-2.5 py-1.5 text-xs text-[#9BA2A9] hover:bg-[#272D33] hover:text-[#E7E4D9] transition"
              title="Switch Persona / Login"
            >
              <UserCheck className="h-3.5 w-3.5 text-[#3E7C96] shrink-0" />
              <div className="text-left leading-none">
                <div className="font-semibold text-[#E7E4D9] text-[10px] sm:text-[11px] truncate max-w-[70px] sm:max-w-none">
                  {currentUser?.full_name?.split(" ")[0] || "Engineer"}
                </div>
                <div className="text-[8px] sm:text-[9px] text-[#6D7C86] hidden xs:block">{currentUser?.role || "ENGINEER"}</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-[#3A4149] bg-[#14181C] px-4 py-4 shadow-xl space-y-4">
            {/* Primary Mobile Links */}
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/workbench"
                onClick={() => setMobileMenuOpen(false)}
                className="col-span-2 flex items-center justify-center gap-2 p-3 rounded-lg btn-primary text-xs font-semibold shadow-sm"
              >
                <Terminal className="h-4 w-4" />
                <span>Launch AI Workbench</span>
              </Link>
              {primaryNavItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 p-2.5 rounded-lg text-xs font-medium bg-[#21262B] text-[#E7E4D9] border border-[#3A4149] hover:border-[#4A535D]"
                >
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Subsystems in Mobile */}
            <div>
              <div className="text-[10px] uppercase font-bold text-[#6D7C86] mb-2 tracking-wider">
                Subsystems &amp; Registries
              </div>
              <div className="grid grid-cols-2 gap-2">
                {systemModules.map((mod) => {
                  const Icon = mod.icon;
                  return (
                    <Link
                      key={mod.href}
                      href={mod.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 p-2 rounded-lg text-xs bg-[#21262B] border border-[#3A4149] text-[#9BA2A9] hover:text-[#E7E4D9]"
                    >
                      <Icon className="h-3.5 w-3.5 text-[#3E7C96] shrink-0" />
                      <span className="truncate">{mod.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 border-t border-[#3A4149] flex items-center justify-between text-[10px] text-[#6D7C86] font-mono">
              <span>Air-Gap Mode: <strong className="text-[#3E7C96]">STRICT</strong></span>
              <span className="text-[#6C8B78] font-bold">100% On-Premise</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
