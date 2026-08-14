"use client";

import React from "react";
import Link from "next/link";
import {
    Users,
    Briefcase,
    DollarSign,
    ShieldAlert,
    UserCheck,
    CheckCircle,
    XCircle,
    Clock,
    TrendingUp,
    ArrowUpRight,
    ChevronRight,
    Scale,
    FileText,
    Activity,
} from "lucide-react";

export default function AdminDashboardOverview() {
    // Mock Summary Stats (You can connect these to real API endpoints)
    const stats = [
        {
            title: "Total Clients",
            value: "1,248",
            change: "+12.5%",
            icon: Users,
            color: "from-blue-500/20 to-cyan-500/10",
            textColor: "text-blue-400",
            borderColor: "border-blue-500/20",
        },
        {
            title: "Verified Lawyers",
            value: "342",
            change: "+8.2%",
            icon: Scale,
            color: "from-amber-500/20 to-yellow-500/10",
            textColor: "text-amber-400",
            borderColor: "border-amber-500/20",
        },
        {
            title: "Pending Verifications",
            value: "19",
            change: "Requires Action",
            icon: ShieldAlert,
            color: "from-rose-500/20 to-red-500/10",
            textColor: "text-rose-400",
            borderColor: "border-rose-500/20",
            highlight: true,
        },
        {
            title: "Platform Consultations",
            value: "4,890",
            change: "+18.4%",
            icon: Briefcase,
            color: "from-emerald-500/20 to-teal-500/10",
            textColor: "text-emerald-400",
            borderColor: "border-emerald-500/20",
        },
    ];

    // Mock Recent Lawyer Verification Requests
    const pendingLawyers = [
        {
            id: "1",
            name: "Adv. Sarah Jenkins",
            specialty: "Corporate Law",
            barNumber: "BAR-88219",
            appliedDate: "10 mins ago",
        },
        {
            id: "2",
            name: "Adv. Tariq Rahman",
            specialty: "Criminal Litigation",
            barNumber: "BAR-55410",
            appliedDate: "1 hour ago",
        },
        {
            id: "3",
            name: "Adv. Elena Rostova",
            specialty: "Intellectual Property",
            barNumber: "BAR-99023",
            appliedDate: "3 hours ago",
        },
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 font-sans selection:bg-amber-500/30">

            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            System Administrator
                        </span>
                    </div>
                    <h1 className="text-3xl font-black text-white mt-2">
                        Admin Overview
                    </h1>
                    <p className="text-xs text-neutral-400">
                        Monitor platform health, verify legal practitioners, and manage core system operations.
                    </p>
                </div>

                {/* Quick System Status Indicator */}
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-neutral-900 border border-white/10 text-xs">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    <span className="text-neutral-300 font-bold">API Services Active</span>
                </div>
            </div>

            {/* Top Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={idx}
                            className={`p-5 rounded-3xl bg-neutral-900/60 border ${stat.borderColor} backdrop-blur-xl relative overflow-hidden space-y-3 transition duration-300 hover:scale-[1.02] shadow-xl`}
                        >
                            <div className="flex items-center justify-between">
                                <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.color} ${stat.textColor}`}>
                                    <Icon size={22} />
                                </div>
                                <span className={`text-[11px] font-bold ${stat.highlight ? "text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20" : "text-neutral-400"}`}>
                                    {stat.change}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-white tracking-tight">
                                    {stat.value}
                                </h3>
                                <p className="text-xs text-neutral-400 font-medium">{stat.title}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Main Section Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column (2/3): Pending Lawyer Approvals */}
                <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-neutral-900/50 backdrop-blur-xl p-6 space-y-5 shadow-2xl">
                    <div className="flex items-center justify-between pb-4 border-b border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                <UserCheck size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-white">Pending Verification Requests</h3>
                                <p className="text-xs text-neutral-400">
                                    Advocates awaiting credentials inspection
                                </p>
                            </div>
                        </div>
                        <Link
                            href="/dashboard/admin/verification"
                            className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 transition"
                        >
                            View All <ChevronRight size={14} />
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {pendingLawyers.map((lawyer) => (
                            <div
                                key={lawyer.id}
                                className="p-4 rounded-2xl bg-neutral-950/60 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition hover:border-amber-500/30"
                            >
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-extrabold text-white text-sm">{lawyer.name}</h4>
                                        <span className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-neutral-400 font-mono">
                                            {lawyer.barNumber}
                                        </span>
                                    </div>
                                    <p className="text-xs text-neutral-400">
                                        Specialty: <span className="text-amber-400 font-semibold">{lawyer.specialty}</span> • <span className="text-neutral-500">{lawyer.appliedDate}</span>
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-neutral-950 transition font-bold text-xs flex items-center gap-1 cursor-pointer">
                                        <CheckCircle size={14} /> Approve
                                    </button>
                                    <button className="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition font-bold text-xs flex items-center gap-1 cursor-pointer">
                                        <XCircle size={14} /> Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column (1/3): Quick Actions & System Health */}
                <div className="space-y-6">

                    {/* Quick Management Shortcuts */}
                    <div className="rounded-3xl border border-white/10 bg-neutral-900/50 backdrop-blur-xl p-6 space-y-4 shadow-2xl">
                        <h3 className="text-base font-black text-white flex items-center gap-2">
                            <Activity size={18} className="text-amber-400" /> Admin Shortcuts
                        </h3>

                        <div className="grid grid-cols-1 gap-2.5">
                            <Link
                                href="/dashboard/admin/users"
                                className="p-3.5 rounded-2xl bg-neutral-950/80 border border-white/5 hover:border-white/20 transition flex items-center justify-between text-xs font-bold text-neutral-200 group"
                            >
                                <span className="flex items-center gap-2.5">
                                    <Users size={16} className="text-blue-400" /> Manage All Platform Users
                                </span>
                                <ArrowUpRight size={14} className="text-neutral-500 group-hover:text-white transition" />
                            </Link>

                            <Link
                                href="/dashboard/admin/lawyers"
                                className="p-3.5 rounded-2xl bg-neutral-950/80 border border-white/5 hover:border-white/20 transition flex items-center justify-between text-xs font-bold text-neutral-200 group"
                            >
                                <span className="flex items-center gap-2.5">
                                    <Scale size={16} className="text-amber-400" /> Lawyer Directory & Ratings
                                </span>
                                <ArrowUpRight size={14} className="text-neutral-500 group-hover:text-white transition" />
                            </Link>

                            <Link
                                href="/dashboard/admin/reports"
                                className="p-3.5 rounded-2xl bg-neutral-950/80 border border-white/5 hover:border-white/20 transition flex items-center justify-between text-xs font-bold text-neutral-200 group"
                            >
                                <span className="flex items-center gap-2.5">
                                    <FileText size={16} className="text-rose-400" /> Content & Dispute Logs
                                </span>
                                <ArrowUpRight size={14} className="text-neutral-500 group-hover:text-white transition" />
                            </Link>
                        </div>
                    </div>

                    {/* Platform Performance Banner */}
                    <div className="rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-neutral-900 to-neutral-950 p-6 space-y-3 shadow-xl">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
                                Monthly System Volume
                            </span>
                            <TrendingUp size={18} className="text-amber-400" />
                        </div>
                        <h4 className="text-2xl font-black text-white">$42,850 USD</h4>
                        <p className="text-xs text-neutral-400 leading-relaxed">
                            Total transaction flow processed through LegalEase verified advocate bookings this month.
                        </p>
                    </div>

                </div>

            </div>

        </div>
    );
}