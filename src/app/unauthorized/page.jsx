"use client";

import React from "react";
import Link from "next/link";
import {
    ShieldAlert,
    ArrowLeft,
    Home,
    UserCheck,
    Scale,
    Lock,
    ChevronRight,
    Gavel,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen relative overflow-hidden bg-neutral-950 flex items-center justify-center p-4 md:p-8 font-sans selection:bg-amber-500/30 selection:text-amber-200">
            {/* Dynamic Background Glow FX */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-rose-600/10 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Grid Overlay Pattern */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
                    backgroundSize: "24px 24px",
                }}
            />

            <main className="relative z-10 max-w-2xl w-full">
                {/* Main Card */}
                <div className="rounded-3xl border border-white/10 bg-neutral-900/60 backdrop-blur-2xl p-8 md:p-12 shadow-2xl space-y-8 text-center transition-all duration-500 hover:border-rose-500/20">

                    {/* Top Badge & Lock Graphic */}
                    <div className="relative inline-flex items-center justify-center">
                        {/* Glowing Ring */}
                        <div className="absolute -inset-2 bg-gradient-to-r from-rose-500/30 via-amber-500/20 to-rose-500/30 rounded-3xl blur-md opacity-75 animate-pulse" />

                        <div className="relative w-24 h-24 rounded-2xl bg-neutral-950/80 border border-rose-500/30 flex items-center justify-center text-rose-500 shadow-xl backdrop-blur-md">
                            <ShieldAlert size={48} className="stroke-[1.5]" />
                            <div className="absolute -bottom-2 -right-2 p-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 backdrop-blur-md">
                                <Lock size={16} />
                            </div>
                        </div>
                    </div>

                    {/* Status Badge */}
                    <div>
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-inner">
                            <Scale size={13} /> Error 403 • Restricted Area
                        </span>
                    </div>

                    {/* Heading and Description */}
                    <div className="space-y-3">
                        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                            Access Restricted
                        </h1>
                        <p className="text-sm md:text-base text-neutral-400 max-w-lg mx-auto leading-relaxed">
                            You don&apos;t have the authorized credentials or account permission level to view this page on <span className="text-white font-bold">LegalEase</span>.
                        </p>
                    </div>

                    {/* Legal Notice Callout */}
                    <div className="p-4 rounded-2xl bg-neutral-950/60 border border-white/5 text-left flex items-start gap-3 text-xs text-neutral-400">
                        <Gavel size={18} className="text-amber-400 shrink-0 mt-0.5" />
                        <p className="leading-relaxed">
                            Certain features on LegalEase require a verified <strong className="text-amber-300">Client</strong> or <strong className="text-amber-300 font-semibold">Advocate</strong> session. Please verify your account type or switch profiles.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                            onClick={() => router.back()}
                            className="w-full px-6 py-3.5 rounded-2xl border border-white/10 bg-neutral-950/80 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 hover:border-white/20 active:scale-95 cursor-pointer shadow-lg"
                        >
                            <ArrowLeft size={16} /> Go Previous Page
                        </button>

                        <Link
                            href="/"
                            className="w-full px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-amber-500/10 active:scale-95 cursor-pointer"
                        >
                            <Home size={16} /> Return to LegalEase
                        </Link>
                    </div>

                    {/* Quick Route Shortcuts */}
                    <div className="pt-4 border-t border-white/5 flex flex-wrap items-center justify-between text-xs text-neutral-400 gap-2">
                        <span>Need to switch account roles?</span>
                        <Link
                            href="/signup"
                            className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 transition-colors"
                        >
                            <UserCheck size={14} /> Switch Account <ChevronRight size={14} />
                        </Link>
                    </div>

                </div>

                {/* Footer Notice */}
                <p className="text-center text-[11px] text-neutral-600 pt-6 font-medium">
                    LegalEase Security Protocols • Protected Legal Infrastructure
                </p>
            </main>
        </div>
    );
}