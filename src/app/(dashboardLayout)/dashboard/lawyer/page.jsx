"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    DollarSign,
    Briefcase,
    CalendarCheck,
    Star,
    TrendingUp,
    Clock,
    Users,
    CheckCircle2,
    XCircle,
    ChevronRight,
    Video,
    FileText,
    ArrowUpRight,
    ShieldAlert,
    Sparkles,
} from "lucide-react";
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

import Image from "next/image";

import { useSession } from "@/lib/auth-client";
import { Skeleton } from "@/components/ui/Skeleton";
import { baseURL } from "@/lib/api/baseUrl";

// Mock Analytics Data

const earningsData = [
    { month: "Jan", earnings: 4200, consultations: 12 },
    { month: "Feb", earnings: 5800, consultations: 18 },
    { month: "Mar", earnings: 5100, consultations: 15 },
    { month: "Apr", earnings: 7400, consultations: 22 },
    { month: "May", earnings: 6900, consultations: 19 },
    { month: "Jun", earnings: 8800, consultations: 26 },
    { month: "Jul", earnings: 9500, consultations: 28 },
];

const caseTypeData = [
    { name: "Corporate Law", value: 40, color: "#eab308" }, // Secondary Gold
    { name: "Family Law", value: 25, color: "#3b82f6" },    // Blue
    { name: "Civil Litigation", value: 20, color: "#10b981" }, // Green
    { name: "Property & Real Estate", value: 15, color: "#8b5cf6" }, // Purple
];

const upcomingAppointments = [
    {
        id: "1",
        clientName: "Sarah Jenkins",
        caseType: "Corporate Restructuring",
        time: "Today, 02:30 PM",
        type: "Video Call",
        status: "Confirmed",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    },
    {
        id: "2",
        clientName: "Michael Chang",
        caseType: "IP Patent Filing",
        time: "Tomorrow, 10:00 AM",
        type: "In-Person",
        status: "Pending Prep",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    },
    {
        id: "3",
        clientName: "Elena Rostova",
        caseType: "Contract Review",
        time: "Aug 06, 04:00 PM",
        type: "Video Call",
        status: "Confirmed",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    },
];

const pendingRequests = [
    {
        id: "101",
        clientName: "David Miller",
        issue: "Commercial Breach of Contract dispute with vendor.",
        budget: "$1,500 Retainer",
        requestedDate: "Aug 03, 2026",
    },
    {
        id: "102",
        clientName: "Amanda Croft",
        issue: "Property deed verification & legal title search.",
        budget: "$800 Fixed",
        requestedDate: "Aug 03, 2026",
    },
];

export default function LawyerDashboardOverview() {
    const [isAcceptingClients, setIsAcceptingClients] = useState(true);

    // Dynamic Stats State
    const [totalEarnings, setTotalEarnings] = useState(0);
    const [totalConsultations, setTotalConsultations] = useState(0);
    const [isStatsLoading, setIsStatsLoading] = useState(true);

    // Get user Session
    const { data: session, isPending } = useSession();
    const user = session?.user;

    // Fetch Transaction Data for Dynamic Stats

    useEffect(() => {
        const fetchTransactionStats = async () => {
            if (!user) return;

            try {
                setIsStatsLoading(true);

                // Build query params based on lawyerId or email

                const queryParam = user?.id
                    ? `lawyerId=${encodeURIComponent(user.id)}`
                    : `email=${encodeURIComponent(user.email)}`;

                const res = await fetch(`${baseURL}/api/lawyer/transactions?${queryParam}`);
                if (res.ok) {
                    const data = await res.json();

                    if (Array.isArray(data)) {
                        // Calculate total earnings from payment amounts
                        const earnings = data.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
                        setTotalEarnings(earnings);
                        setTotalConsultations(data.length);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch transaction stats:", error);
            } finally {
                setIsStatsLoading(false);
            }
        };

        if (user) {
            fetchTransactionStats();
        }
    }, [user]);

    return (
        <div className="space-y-8 pb-10">

            {/* Header / Welcome Banner */}

            <div className="relative overflow-hidden rounded-3xl border border-secondary/20 bg-linear-to-r from-surface via-surface/90 to-background p-6 md:p-8 shadow-xl backdrop-blur-xl">
                <div className="absolute top-0 right-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-secondary/20 text-secondary border border-secondary/30">
                                <Sparkles size={14} /> Senior Advocate Profile
                            </span>
                        </div>
                        <div className="text-text tracking-tight mt-3 mb-2">
                            <h1 className="text-xl md:text-3xl font-bold mb-1">Welcome Back,</h1>
                            <h1 className="text-2xl md:text-4xl text-secondary font-extrabold">
                                {isPending ? <Skeleton className="h-9 w-48 rounded-lg inline-block align-middle" /> : `Adv. ${user?.name}`}
                            </h1>
                        </div>
                        <p className="text-text-secondary text-sm md:text-base mt-1 max-w-xl">
                            Here is what is happening with your legal practice today. You have <span className="text-text font-bold">3 pending client requests</span> to review.
                        </p>
                    </div>

                    {/* Quick Action & Status Toggle */}

                    <div className="flex flex-wrap items-center gap-4 shrink-0">
                        <button
                            onClick={() => setIsAcceptingClients(!isAcceptingClients)}
                            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all backdrop-blur-md ${isAcceptingClients
                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                                : "bg-danger/10 border-danger/30 text-danger"
                                }`}
                        >
                            <span className={`h-2.5 w-2.5 rounded-full animate-pulse ${isAcceptingClients ? "bg-emerald-500" : "bg-danger"}`} />
                            {isAcceptingClients ? "Accepting New Clients" : "Unavailable for Hiring"}
                        </button>

                        <Link
                            href="/dashboard/lawyer/manage-legal-profile"
                            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-secondary text-surface-dark font-extrabold text-xs tracking-wider uppercase hover:opacity-90 transition shadow-lg shadow-secondary/20"
                        >
                            Edit Profile
                            <ArrowUpRight size={16} />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Metrics Grid */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Dynamic Stat 1: Total Earnings */}
                <motion.div
                    whileHover={{ y: -3 }}
                    className="rounded-2xl border border-secondary/20 bg-surface/60 p-5 backdrop-blur-xl shadow-md relative overflow-hidden group"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">Total Earnings</span>
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 text-secondary border border-secondary/20">
                            <DollarSign size={20} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-baseline justify-between">
                        <span className="text-2xl md:text-3xl font-extrabold text-text">
                            {isStatsLoading || isPending ? (
                                <Skeleton className="h-8 w-28 rounded-lg" />
                            ) : (
                                `$${totalEarnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                            )}
                        </span>
                        <span className="inline-flex items-center text-xs font-bold text-emerald-400 gap-0.5">
                            <TrendingUp size={14} /> +14.2%
                        </span>
                    </div>
                    <p className="text-[11px] text-text-secondary mt-1">vs last month ($41,600)</p>
                </motion.div>

                {/* Stat 2 */}

                <motion.div
                    whileHover={{ y: -3 }}
                    className="rounded-2xl border border-secondary/20 bg-surface/60 p-5 backdrop-blur-xl shadow-md relative overflow-hidden group"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">Active Cases</span>
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            <Briefcase size={20} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-baseline justify-between">
                        <span className="text-2xl md:text-3xl font-extrabold text-text">18</span>
                        <span className="inline-flex items-center text-xs font-bold text-emerald-400 gap-0.5">
                            <TrendingUp size={14} /> +3 this week
                        </span>
                    </div>
                    <p className="text-[11px] text-text-secondary mt-1">12 in court phase, 6 prep</p>
                </motion.div>

                {/* Dynamic Stat 3: Consultations */}

                <motion.div
                    whileHover={{ y: -3 }}
                    className="rounded-2xl border border-secondary/20 bg-surface/60 p-5 backdrop-blur-xl shadow-md relative overflow-hidden group"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">Consultations</span>
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                            <CalendarCheck size={20} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-baseline justify-between">
                        <span className="text-2xl md:text-3xl font-extrabold text-text">
                            {isStatsLoading || isPending ? (
                                <Skeleton className="h-8 w-16 rounded-lg" />
                            ) : (
                                totalConsultations
                            )}
                        </span>
                        <span className="inline-flex items-center text-xs font-bold text-emerald-400 gap-0.5">
                            <TrendingUp size={14} /> +8.5%
                        </span>
                    </div>
                    <p className="text-[11px] text-text-secondary mt-1">Total completed consultations</p>
                </motion.div>

                {/* Stat 4 */}

                <motion.div
                    whileHover={{ y: -3 }}
                    className="rounded-2xl border border-secondary/20 bg-surface/60 p-5 backdrop-blur-xl shadow-md relative overflow-hidden group"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">Client Rating</span>
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <Star size={20} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-baseline justify-between">
                        <span className="text-2xl md:text-3xl font-extrabold text-text">4.9 / 5.0</span>
                        <span className="text-xs font-bold text-amber-400">(48 Reviews)</span>
                    </div>
                    <p className="text-[11px] text-text-secondary mt-1">Top 5% Legal Advocate</p>
                </motion.div>
            </div>

            {/* Analytics Section */}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Revenue & Growth Chart (Spans 2 cols) */}

                <div className="lg:col-span-2 rounded-3xl border border-border/80 bg-surface/80 p-6 backdrop-blur-xl shadow-lg flex flex-col justify-between">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-lg font-extrabold text-text flex items-center gap-2">
                                Practice Revenue Overview
                            </h2>
                            <p className="text-xs text-text-secondary mt-0.5">
                                Monthly earnings ($) vs Consultation volume
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1 text-xs font-semibold text-secondary">
                                <span className="h-3 w-3 rounded-full bg-secondary inline-block" /> Revenue ($)
                            </span>
                        </div>
                    </div>

                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={earningsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#eab308" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#eab308" stopOpacity={0.0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis dataKey="month" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#18181b",
                                        borderColor: "#eab30840",
                                        borderRadius: "16px",
                                        color: "#fff",
                                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="earnings"
                                    stroke="#eab308"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Case Distribution Donut Chart */}

                <div className="rounded-3xl border border-border/80 bg-surface/80 p-6 backdrop-blur-xl shadow-lg flex flex-col justify-between">
                    <div>
                        <h2 className="text-lg font-extrabold text-text">Case Breakdown</h2>
                        <p className="text-xs text-text-secondary mt-0.5">Active practice domain distribution</p>
                    </div>

                    <div className="h-56 w-full my-2 relative flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={caseTypeData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={85}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {caseTypeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#18181b",
                                        borderRadius: "12px",
                                        borderColor: "#3f3f46",
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-2xl font-black text-text">100%</span>
                            <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">Categorized</span>
                        </div>
                    </div>

                    {/* Legend */}

                    <div className="space-y-2 pt-2 border-t border-border/50">
                        {caseTypeData.map((item) => (
                            <div key={item.name} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                    <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                    <span className="text-text-secondary truncate">{item.name}</span>
                                </div>
                                <span className="font-bold text-text">{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Two-Column Grid: Appointments & Pending Requests */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Upcoming Appointments */}

                <div className="rounded-3xl border border-border/80 bg-surface/80 p-6 backdrop-blur-xl shadow-lg flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-lg font-extrabold text-text">Upcoming Appointments</h2>
                                <p className="text-xs text-text-secondary mt-0.5">Scheduled client consultations</p>
                            </div>
                            <Link
                                href="/dashboard/lawyer/appointments"
                                className="text-xs font-bold text-secondary hover:underline flex items-center gap-1"
                            >
                                View All <ChevronRight size={14} />
                            </Link>
                        </div>

                        <div className="space-y-4">
                            {isPending
                                ? [1, 2, 3].map((item) => (
                                    <div
                                        key={item}
                                        className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-neutral-900/40 border border-border/50"
                                    >
                                        <div className="flex items-center gap-3.5">
                                            <Skeleton className="h-11 w-11 rounded-full shrink-0" />
                                            <div className="space-y-2">
                                                <Skeleton className="h-4 w-32" />
                                                <Skeleton className="h-3 w-24" />
                                                <Skeleton className="h-3 w-40" />
                                            </div>
                                        </div>
                                        <Skeleton className="h-8 w-20 rounded-xl shrink-0" />
                                    </div>
                                ))
                                : upcomingAppointments.map((appointment) => (
                                    <div
                                        key={appointment.id}
                                        className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-100 dark:bg-neutral-900/40 border border-border/50 hover:border-secondary/30 transition"
                                    >
                                        <div className="flex items-center gap-3.5">
                                            <Image
                                                src={appointment.avatar}
                                                alt={appointment.clientName}
                                                width={800}
                                                height={800}
                                                className="h-11 w-11 rounded-full object-cover border border-secondary/30"
                                            />
                                            <div>
                                                <h4 className="font-bold text-sm text-text">{appointment.clientName}</h4>
                                                <p className="text-xs text-text-secondary">{appointment.caseType}</p>
                                                <div className="flex items-center gap-3 mt-1.5 text-[11px] text-text-secondary">
                                                    <span className="flex items-center gap-1 text-secondary font-semibold">
                                                        <Clock size={12} /> {appointment.time}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Video size={12} /> {appointment.type}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <button className="px-3 py-2 rounded-xl bg-secondary/10 hover:bg-secondary text-secondary hover:text-surface-dark border border-secondary/30 text-xs font-bold transition">
                                            Join Call
                                        </button>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>

                {/* Pending Hiring Requests */}

                <div className="rounded-3xl border border-border/80 bg-surface/80 p-6 backdrop-blur-xl shadow-lg flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-lg font-extrabold text-text">Pending Hiring Requests</h2>
                                <p className="text-xs text-text-secondary mt-0.5">New clients requesting your legal representation</p>
                            </div>
                            <span className="px-2.5 py-1 rounded-full bg-secondary/20 text-secondary text-xs font-bold border border-secondary/30">
                                {pendingRequests.length} New
                            </span>
                        </div>

                        <div className="space-y-4">
                            {isPending
                                ? [1, 2].map((item) => (
                                    <div
                                        key={item}
                                        className="p-4 rounded-2xl bg-neutral-900/40 border border-border/50 space-y-3"
                                    >
                                        <div className="flex items-center justify-between">
                                            <Skeleton className="h-4 w-28" />
                                            <Skeleton className="h-6 w-20 rounded-lg" />
                                        </div>
                                        <Skeleton className="h-3 w-full" />
                                        <Skeleton className="h-3 w-4/5" />
                                        <div className="flex items-center justify-between pt-2 border-t border-border/40">
                                            <Skeleton className="h-3 w-24" />
                                            <div className="flex items-center gap-2">
                                                <Skeleton className="h-7 w-16 rounded-xl" />
                                                <Skeleton className="h-7 w-24 rounded-xl" />
                                            </div>
                                        </div>
                                    </div>
                                ))
                                : pendingRequests.map((req) => (
                                    <div
                                        key={req.id}
                                        className="p-4 rounded-2xl bg-slate-100 dark:bg-neutral-900/40 border border-border/50 space-y-3"
                                    >
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-extrabold text-sm text-text">{req.clientName}</h4>
                                            <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                                                {req.budget}
                                            </span>
                                        </div>

                                        <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                                            &quot;{req.issue}&quot;
                                        </p>

                                        <div className="flex items-center justify-between pt-2 border-t border-border/40">
                                            <span className="text-[11px] text-text-secondary">Requested: {req.requestedDate}</span>

                                            <div className="flex items-center gap-2">
                                                <button className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-danger/10 text-danger hover:bg-danger hover:text-white text-xs font-bold transition">
                                                    <XCircle size={14} /> Decline
                                                </button>
                                                <button className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500 text-surface-dark font-bold text-xs hover:bg-emerald-400 transition shadow-md shadow-emerald-500/20">
                                                    <CheckCircle2 size={14} /> Accept Request
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}