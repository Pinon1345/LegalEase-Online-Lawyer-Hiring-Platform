"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import {
    Calendar,
    Clock,
    Mail,
    Search,
    Video,
    Briefcase,
    CalendarCheck,
    DollarSign,
    User
} from "lucide-react";
import toast from "react-hot-toast";
import { baseURL } from "@/lib/api/baseUrl";
import Image from "next/image";

// Skeleton Components
function Skeleton({ className = "" }) {
    return (
        <div
            className={`animate-pulse bg-border/60 dark:bg-border/40 rounded-lg ${className}`}
        />
    );
}

function AppointmentCardSkeleton() {
    return (
        <div className="p-6 rounded-2xl border border-border/80 bg-surface/80 backdrop-blur-md shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start md:items-center gap-4 w-full lg:w-auto">
                <Skeleton className="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex-shrink-0" />
                <div className="space-y-3 w-full max-w-sm">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-36" />
                        <Skeleton className="h-4 w-28 rounded-full" />
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                        <Skeleton className="h-7 w-28 rounded-xl" />
                        <Skeleton className="h-7 w-24 rounded-xl" />
                        <Skeleton className="h-7 w-16 rounded-xl" />
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-end gap-3 border-t lg:border-t-0 border-border/40 pt-4 lg:pt-0">
                <Skeleton className="h-9 w-28 rounded-xl" />
            </div>
        </div>
    );
}

export default function LawyerAppointments() {
    const { data: session, isPending: sessionLoading } = useSession();
    const user = session?.user;

    // Retrieve lawyer ID from session
    const lawyerId = user?.id || user?._id;

    const [appointments, setAppointments] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [filterTab, setFilterTab] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const loading = sessionLoading || isFetching;

    useEffect(() => {
        if (!lawyerId) return;

        let isMounted = true;

        const fetchLawyerAppointments = async () => {
            setIsFetching(true);

            try {
                // Hits the exact same lawyer-specific endpoint as HiringRequest
                const url = `${baseURL}/api/lawyer/hiring-requests/${lawyerId}`;
                const res = await fetch(url);

                if (!res.ok) {
                    throw new Error("Failed to fetch lawyer appointments.");
                }

                const data = await res.json();
                const rawItems = Array.isArray(data)
                    ? data
                    : data?.data || data?.bookings || [];

                if (isMounted) {
                    setAppointments(rawItems);
                }
            } catch (error) {
                console.error("Error fetching appointments:", error);
                toast.error("Failed to load appointments schedule.");
            } finally {
                if (isMounted) {
                    setIsFetching(false);
                }
            }
        };

        fetchLawyerAppointments();

        return () => {
            isMounted = false;
        };
    }, [lawyerId]);

    // Filter appointments: Filter for accepted requests + search query + tab
    const filteredAppointments = appointments.filter((item) => {
        // 1. Status check: Case-insensitive check for accepted status
        const itemStatus = (item.status || "").toLowerCase();

        // If status field exists, only keep accepted ones for the appointment schedule
        if (itemStatus && itemStatus !== "accepted") {
            return false;
        }

        // 2. Client Details extraction
        const clientName = item.clientName || item.name || item.userName || "Client";
        const clientEmail = item.clientEmail || item.email || item.userEmail || "";

        // 3. Search query filter
        const matchesSearch =
            clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            clientEmail.toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;

        // 4. Tab filter (upcoming / completed)
        const dateStr = item.scheduledDate || item.date;
        if (!dateStr || filterTab === "all") return true;

        const appointmentDate = new Date(dateStr);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (!isNaN(appointmentDate.getTime())) {
            if (filterTab === "upcoming") return appointmentDate >= today;
            if (filterTab === "completed") return appointmentDate < today;
        }

        return true;
    });

    return (
        <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-6">
                <div>
                    <h2 className="text-2xl md:text-3xl font-black text-text tracking-tight flex items-center gap-2">
                        <CalendarCheck className="text-emerald-500" size={28} />
                        My Client Appointments
                    </h2>
                    <p className="text-xs md:text-sm text-text-secondary mt-1">
                        View and manage scheduled consultations for your accepted clients.
                    </p>
                </div>

                <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-surface border border-border/60 shadow-sm self-start md:self-auto">
                    <Briefcase size={18} className="text-emerald-400" />
                    <div className="text-xs">
                        <span className="text-text-secondary block">Confirmed Clients</span>
                        {loading ? (
                            <Skeleton className="h-4 w-12 mt-0.5" />
                        ) : (
                            <strong className="text-text text-sm font-extrabold">
                                {filteredAppointments.length}
                            </strong>
                        )}
                    </div>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                    <Search
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary"
                    />
                    <input
                        type="text"
                        placeholder="Search client by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-surface border border-border/70 focus:border-emerald-500 focus:outline-none text-text placeholder:text-text-secondary/60 transition-all"
                    />
                </div>

                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface border border-border/60 w-full sm:w-auto">
                    {["all", "upcoming", "completed"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setFilterTab(tab)}
                            className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${filterTab === tab
                                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                                    : "text-text-secondary hover:text-text hover:bg-border/30"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content List */}
            {loading ? (
                <div className="grid gap-5">
                    {[1, 2, 3].map((i) => (
                        <AppointmentCardSkeleton key={i} />
                    ))}
                </div>
            ) : filteredAppointments.length === 0 ? (
                <div className="p-12 rounded-3xl bg-surface/50 border border-border/80 text-center text-text-secondary backdrop-blur-md shadow-inner space-y-3">
                    <div className="w-12 h-12 rounded-full bg-border/40 mx-auto flex items-center justify-center text-text-secondary">
                        <User size={24} />
                    </div>
                    <p className="text-base font-semibold text-text">No confirmed clients found</p>
                    <p className="text-xs text-text-secondary">
                        {searchQuery
                            ? "No schedule matches your search keywords."
                            : "Accept hiring requests to see your confirmed client appointments here."}
                    </p>
                </div>
            ) : (
                <div className="grid gap-5">
                    {filteredAppointments.map((item) => {
                        const clientName = item.clientName || item.name || item.userName || "Client";
                        const clientEmail = item.clientEmail || item.email || item.userEmail || "";
                        const clientImage = item.clientImage || item.image || item.imageUrl || "";
                        const clientInitial = clientName.charAt(0).toUpperCase();

                        return (
                            <div
                                key={item._id || item.id}
                                className="group relative p-6 rounded-2xl border border-border/80 bg-surface/80 hover:bg-surface backdrop-blur-md shadow-sm hover:shadow-xl hover:border-emerald-500/30 transition-all duration-300 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                            >
                                <div className="flex items-start md:items-center gap-4">
                                    {/* Client Avatar */}
                                    <div className="relative flex-shrink-0">
                                        {clientImage ? (
                                            <Image
                                                src={clientImage}
                                                alt={clientName}
                                                width={64}
                                                height={64}
                                                unoptimized
                                                className="w-14 h-14 md:w-16 md:h-16 rounded-2xl object-cover border-2 border-emerald-500/30 shadow-md group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-extrabold text-xl md:text-2xl flex items-center justify-center border-2 border-emerald-400/30 shadow-md group-hover:scale-105 transition-transform duration-300">
                                                {clientInitial}
                                            </div>
                                        )}
                                        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-surface rounded-full"></span>
                                    </div>

                                    {/* Details */}
                                    <div className="space-y-2">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="text-lg md:text-xl font-bold text-text tracking-tight group-hover:text-emerald-400 transition-colors">
                                                {clientName}
                                            </h3>
                                            {clientEmail && (
                                                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-border/40 text-text-secondary border border-border/50">
                                                    <Mail size={12} className="text-secondary" />
                                                    {clientEmail}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2 text-xs text-text-secondary pt-1">
                                            {item.scheduledDate && (
                                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-background/60 border border-border/60">
                                                    <Calendar size={14} className="text-amber-400" />
                                                    <span className="font-semibold text-text">
                                                        {item.scheduledDate}
                                                    </span>
                                                </div>
                                            )}

                                            {item.scheduledSlot && (
                                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-background/60 border border-border/60">
                                                    <Clock size={14} className="text-cyan-400" />
                                                    <span className="font-semibold text-text">
                                                        {item.scheduledSlot}
                                                    </span>
                                                </div>
                                            )}

                                            {item.fee !== undefined && (
                                                <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                                                    <DollarSign size={14} />
                                                    <span>${item.fee}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 pt-4 lg:pt-0 border-t lg:border-t-0 border-border/40 justify-end">
                                    {item.meetingLink ? (
                                        <a
                                            href={item.meetingLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                                        >
                                            <Video size={15} /> Join Meeting
                                        </a>
                                    ) : clientEmail ? (
                                        <a
                                            href={`mailto:${clientEmail}?subject=Consultation Appointment Details`}
                                            className="px-4 py-2 rounded-xl bg-surface hover:bg-border/40 border border-border/80 text-text font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all"
                                        >
                                            <Mail size={15} className="text-emerald-400" /> Contact Client
                                        </a>
                                    ) : null}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}