"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
    Users,
    Scale,
    Briefcase,
    DollarSign,
    ArrowUpRight,
    BarChart3,
    Calendar,
    Sparkles,
    Loader2,
    AlertTriangle,
} from "lucide-react";
import { baseURL } from "@/lib/api/baseUrl";

export default function AdminAnalytics() {
    const [timeRange, setTimeRange] = useState("30d");

    // Live Data State
    const [users, setUsers] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [hires, setHires] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [retryTrigger, setRetryTrigger] = useState(0);

    // Fetch all required data concurrently
    useEffect(() => {
        let isMounted = true;

        async function loadAnalyticsData() {
            setIsLoading(true);
            setIsError(false);
            try {
                const [usersRes, txnRes, hiresRes] = await Promise.all([
                    fetch(`${baseURL}/api/users`),
                    fetch(`${baseURL}/api/transactions`),
                    fetch(`${baseURL}/api/hires`),
                ]);

                if (!usersRes.ok || !txnRes.ok || !hiresRes.ok) {
                    throw new Error("Failed to fetch dashboard metrics");
                }

                const usersData = await usersRes.json();
                const txnData = await txnRes.json();
                const hiresData = await hiresRes.json();

                if (isMounted) {
                    setUsers(Array.isArray(usersData) ? usersData : []);
                    setTransactions(Array.isArray(txnData) ? txnData : []);
                    setHires(Array.isArray(hiresData) ? hiresData : []);
                }
            } catch (error) {
                console.error("Error loading analytics:", error);
                if (isMounted) {
                    setIsError(true);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        loadAnalyticsData();

        return () => {
            isMounted = false;
        };
    }, [retryTrigger]);

    const handleRetry = () => {
        setRetryTrigger((prev) => prev + 1);
    };

    // Computed Dynamic Metrics
    const metrics = useMemo(() => {
        const totalUsersCount = users.length;

        const totalLawyersCount = users.filter(
            (u) => u.role?.toLowerCase() === "lawyer"
        ).length;

        const totalHiresCount = hires.length;

        // Dynamic Revenue Sum from transactions

        const totalRevenueVal = transactions.reduce((acc, curr) => {
            const amount = parseFloat(curr.amount ?? curr.fee ?? curr.total ?? curr.price ?? 0);
            return acc + (isNaN(amount) ? 0 : amount);
        }, 0);

        return {
            totalUsers: totalUsersCount,
            totalLawyers: totalLawyersCount,
            totalHires: totalHiresCount,
            totalRevenue: totalRevenueVal,
        };
    }, [users, transactions, hires]);

    if (isLoading) {
        return (
            <div className="p-20 flex flex-col items-center justify-center gap-3 text-amber-400 min-h-[60vh]">
                <Loader2 className="animate-spin" size={36} />
                <span className="text-xs font-medium text-neutral-400">Crunching real-time platform metrics...</span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-20 flex flex-col items-center justify-center gap-3 text-rose-400 min-h-[60vh]">
                <AlertTriangle size={36} />
                <span className="text-sm font-semibold">Failed to load live platform analytics.</span>
                <button
                    onClick={handleRetry}
                    className="px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-bold text-rose-400 hover:bg-rose-500/20 transition cursor-pointer"
                >
                    Try Again
                </button>
            </div>
        );
    }

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

            {/* Dynamic Analytics Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Card 1: Total Users */}
                <div className="p-6 rounded-3xl bg-neutral-900/60 border border-white/10 backdrop-blur-xl space-y-4 shadow-xl hover:border-amber-500/30 transition duration-300">
                    <div className="flex items-center justify-between">
                        <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            <Users size={22} />
                        </div>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <ArrowUpRight size={12} /> Active
                        </span>
                    </div>
                    <div>
                        <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">
                            Total Users
                        </p>
                        <h3 className="text-3xl font-black text-white mt-1">
                            {metrics.totalUsers.toLocaleString()}
                        </h3>
                        <p className="text-[11px] text-neutral-500 mt-1">
                            Registered platform accounts
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
                            <ArrowUpRight size={12} /> Verified
                        </span>
                    </div>
                    <div>
                        <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">
                            Total Lawyers
                        </p>
                        <h3 className="text-3xl font-black text-white mt-1">
                            {metrics.totalLawyers.toLocaleString()}
                        </h3>
                        <p className="text-[11px] text-neutral-500 mt-1">
                            Verified legal professionals
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
                            <ArrowUpRight size={12} /> Booked
                        </span>
                    </div>
                    <div>
                        <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">
                            Total Hires
                        </p>
                        <h3 className="text-3xl font-black text-white mt-1">
                            {metrics.totalHires.toLocaleString()}
                        </h3>
                        <p className="text-[11px] text-neutral-500 mt-1">
                            Successful client consultations
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
                            <ArrowUpRight size={12} /> Settled
                        </span>
                    </div>
                    <div>
                        <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">
                            Total Revenue
                        </p>
                        <h3 className="text-3xl font-black text-white mt-1">
                            ${metrics.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </h3>
                        <p className="text-[11px] text-neutral-500 mt-1">
                            Gross platform transactions
                        </p>
                    </div>
                </div>
            </div>

            {/* Visual Revenue & Engagement Breakdown Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                        <span className="text-[11px] font-mono text-neutral-500">Updated today</span>
                    </div>
                </div>

                <div className="p-6 rounded-3xl bg-neutral-900/60 border border-white/10 backdrop-blur-xl space-y-6 shadow-2xl flex flex-col justify-between">
                    <div className="space-y-4">
                        <h3 className="text-lg font-black text-white flex items-center gap-2">
                            <Sparkles size={18} className="text-amber-400" /> Executive Insights
                        </h3>

                        <div className="space-y-3 text-xs">
                            <div className="p-3.5 rounded-2xl bg-neutral-950 border border-white/5 space-y-1">
                                <p className="text-amber-400 font-bold">Top Hire Category</p>
                                <p className="text-neutral-300">Corporate & Business Law accounts for active client hires.</p>
                            </div>

                            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                                <p className="text-emerald-400 font-bold">Total Platform Database</p>
                                <p className="text-neutral-300">Currently managing {metrics.totalUsers} total registered user profiles.</p>
                            </div>

                            <div className="p-3.5 rounded-2xl bg-neutral-950 border border-white/5 space-y-1">
                                <p className="text-blue-400 font-bold">Lawyer Retention</p>
                                <p className="text-neutral-300">{metrics.totalLawyers} verified legal professionals active on platform.</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-white/5">
                        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 flex items-center justify-between">
                            <span>Next automated report sync:</span>
                            <span className="font-mono font-bold">Live API</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}