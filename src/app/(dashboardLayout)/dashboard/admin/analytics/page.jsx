"use client";

import React, { useState } from "react";
import {
    Users,
    Scale,
    Briefcase,
    DollarSign,
    TrendingUp,
    ArrowUpRight,
    BarChart3,
    Calendar,
    Sparkles,
} from "lucide-react";

export default function AdminAnalytics() {
    const [timeRange, setTimeRange] = useState("30d");

    // Metrics Data (Aligned with requirement cards)
    const analyticsData = {
        totalUsers: {
            value: 1248,
            growth: "+14.2%",
            description: "Registered client accounts",
        },
        totalLawyers: {
            value: 186,
            growth: "+8.5%",
            description: "Verified legal professionals",
        },
        totalHires: {
            value: 542,
            growth: "+22.4%",
            description: "Successful client consultations",
        },
        totalRevenue: {
            value: 48290.00,
            growth: "+18.7%",
            description: "Gross platform transactions",
        },
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 font-sans selection:bg-amber-500/30">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            Platform Metrics
                        </span>
                    </div>
                    <h1 className="text-3xl font-black text-white mt-2">
                        Analytics Overview
                    </h1>
                    <p className="text-xs text-neutral-400">
                        Real-time performance summary of platform activity, user growth, and revenue statistics.
                    </p>
                </div>

                {/* Time Filter Toggle */}
                <div className="flex items-center gap-2 bg-neutral-900/80 p-1.5 rounded-2xl border border-white/10 self-start md:self-auto">
                    <Calendar size={14} className="text-neutral-400 ml-2" />
                    {["7d", "30d", "90d", "1y"].map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${timeRange === range
                                    ? "bg-amber-500 text-neutral-950 shadow-md"
                                    : "text-neutral-400 hover:text-white"
                                }`}
                        >
                            {range.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Required Analytics Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Card 1: Total Users */}
                <div className="p-6 rounded-3xl bg-neutral-900/60 border border-white/10 backdrop-blur-xl space-y-4 shadow-xl hover:border-amber-500/30 transition duration-300">
                    <div className="flex items-center justify-between">
                        <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            <Users size={22} />
                        </div>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <ArrowUpRight size={12} /> {analyticsData.totalUsers.growth}
                        </span>
                    </div>
                    <div>
                        <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">
                            Total Users
                        </p>
                        <h3 className="text-3xl font-black text-white mt-1">
                            {analyticsData.totalUsers.value.toLocaleString()}
                        </h3>
                        <p className="text-[11px] text-neutral-500 mt-1">
                            {analyticsData.totalUsers.description}
                        </p>
                    </div>
                </div>

                {/* Card 2: Total Lawyers */}
                <div className="p-6 rounded-3xl bg-neutral-900/60 border border-white/10 backdrop-blur-xl space-y-4 shadow-xl hover:border-amber-500/30 transition duration-300">
                    <div className="flex items-center justify-between">
                        <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <Scale size={22} />
                        </div>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <ArrowUpRight size={12} /> {analyticsData.totalLawyers.growth}
                        </span>
                    </div>
                    <div>
                        <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">
                            Total Lawyers
                        </p>
                        <h3 className="text-3xl font-black text-white mt-1">
                            {analyticsData.totalLawyers.value.toLocaleString()}
                        </h3>
                        <p className="text-[11px] text-neutral-500 mt-1">
                            {analyticsData.totalLawyers.description}
                        </p>
                    </div>
                </div>

                {/* Card 3: Total Hires */}
                <div className="p-6 rounded-3xl bg-neutral-900/60 border border-white/10 backdrop-blur-xl space-y-4 shadow-xl hover:border-amber-500/30 transition duration-300">
                    <div className="flex items-center justify-between">
                        <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                            <Briefcase size={22} />
                        </div>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <ArrowUpRight size={12} /> {analyticsData.totalHires.growth}
                        </span>
                    </div>
                    <div>
                        <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">
                            Total Hires
                        </p>
                        <h3 className="text-3xl font-black text-white mt-1">
                            {analyticsData.totalHires.value.toLocaleString()}
                        </h3>
                        <p className="text-[11px] text-neutral-500 mt-1">
                            {analyticsData.totalHires.description}
                        </p>
                    </div>
                </div>

                {/* Card 4: Total Revenue */}
                <div className="p-6 rounded-3xl bg-neutral-900/60 border border-white/10 backdrop-blur-xl space-y-4 shadow-xl hover:border-amber-500/30 transition duration-300">
                    <div className="flex items-center justify-between">
                        <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <DollarSign size={22} />
                        </div>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <ArrowUpRight size={12} /> {analyticsData.totalRevenue.growth}
                        </span>
                    </div>
                    <div>
                        <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">
                            Total Revenue
                        </p>
                        <h3 className="text-3xl font-black text-white mt-1">
                            ${analyticsData.totalRevenue.value.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </h3>
                        <p className="text-[11px] text-neutral-500 mt-1">
                            {analyticsData.totalRevenue.description}
                        </p>
                    </div>
                </div>
            </div>

            {/* Visual Revenue & Engagement Breakdown Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Growth Visual Indicator */}
                <div className="lg:col-span-2 p-6 rounded-3xl bg-neutral-900/60 border border-white/10 backdrop-blur-xl space-y-6 shadow-2xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-black text-white flex items-center gap-2">
                                <BarChart3 size={18} className="text-amber-400" /> Revenue & Hire Distribution
                            </h3>
                            <p className="text-xs text-neutral-400 mt-0.5">
                                Monthly snapshot comparing case bookings against gross earnings
                            </p>
                        </div>
                        <span className="text-xs text-amber-400 font-bold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                            Live Feed
                        </span>
                    </div>

                    {/* Graphical Mock Bar Display */}
                    <div className="space-y-4 pt-2">
                        {[
                            { month: "May", revenue: 78, hires: 65 },
                            { month: "Jun", revenue: 85, hires: 72 },
                            { month: "Jul", revenue: 92, hires: 84 },
                            { month: "Aug", revenue: 100, hires: 95 },
                        ].map((item) => (
                            <div key={item.month} className="space-y-1.5">
                                <div className="flex justify-between text-xs font-mono">
                                    <span className="text-neutral-300 font-bold">{item.month}</span>
                                    <span className="text-neutral-400">
                                        {item.hires} hires / ${item.revenue * 480}
                                    </span>
                                </div>
                                <div className="w-full bg-neutral-950 rounded-full h-3 overflow-hidden p-0.5 border border-white/5 flex gap-1">
                                    <div
                                        className="bg-amber-500 h-full rounded-full transition-all duration-500"
                                        style={{ width: `${item.revenue}%` }}
                                    />
                                    <div
                                        className="bg-purple-500/70 h-full rounded-full transition-all duration-500"
                                        style={{ width: `${item.hires}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-between text-xs text-neutral-400 pt-2 border-t border-white/5">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Revenue Growth
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Hire Volume
                            </span>
                        </div>
                        <span className="text-[11px] font-mono text-neutral-500">Updated today at 14:00</span>
                    </div>
                </div>

                {/* Quick Insights Box */}
                <div className="p-6 rounded-3xl bg-neutral-900/60 border border-white/10 backdrop-blur-xl space-y-6 shadow-2xl flex flex-col justify-between">
                    <div className="space-y-4">
                        <h3 className="text-lg font-black text-white flex items-center gap-2">
                            <Sparkles size={18} className="text-amber-400" /> Executive Insights
                        </h3>

                        <div className="space-y-3 text-xs">
                            <div className="p-3.5 rounded-2xl bg-neutral-950 border border-white/5 space-y-1">
                                <p className="text-amber-400 font-bold">Top Hire Category</p>
                                <p className="text-neutral-300">Corporate & Business Law accounts for 38% of total client hires.</p>
                            </div>

                            <div className="p-3.5 rounded-2xl bg-neutral-950 border border-white/5 space-y-1">
                                <p className="text-emerald-400 font-bold">Platform Retainers</p>
                                <p className="text-neutral-300">Net platform fee margin currently averages 10% per transaction.</p>
                            </div>

                            <div className="p-3.5 rounded-2xl bg-neutral-950 border border-white/5 space-y-1">
                                <p className="text-blue-400 font-bold">Lawyer Retention</p>
                                <p className="text-neutral-300">92% of active lawyers receive at least 2 consultations monthly.</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-white/5">
                        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 flex items-center justify-between">
                            <span>Next automated report sync:</span>
                            <span className="font-mono font-bold">In 3 days</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}