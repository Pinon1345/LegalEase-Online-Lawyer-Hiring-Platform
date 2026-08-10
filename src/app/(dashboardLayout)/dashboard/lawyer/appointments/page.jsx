"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import {
    Calendar,
    Clock,
    User,
    Mail,
    Search,
    Video,
    Phone,
    MapPin,
    CalendarCheck,
    Briefcase,
    Filter,
    ExternalLink
} from "lucide-react";
import toast from "react-hot-toast";
import { baseURL } from "@/lib/api/baseUrl";
import Image from "next/image";
import { BookingCardSkeleton, Skeleton } from "@/components/ui/Skeleton";

export default function LawyerAppointments() {
    const { data: session } = useSession();
    const user = session?.user;

    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterTab, setFilterTab] = useState("all"); // 'all' | 'upcoming' | 'completed'
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (!user?.email) return;

        let isMounted = true;

        const fetchAppointments = async () => {
            try {
                // Fetch hiring requests filtered by accepted status
                const res = await fetch(`${baseURL}/api/hire-lawyer?lawyerId=${user.userId}&status=accepted`);
                const data = await res.json();

                if (isMounted && data.success) {
                    setAppointments(data.data || []);
                }
            } catch (error) {
                console.error("Error fetching appointments:", error);
                toast.error("Failed to load appointments schedule.");
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchAppointments();

        return () => {
            isMounted = false;
        };
    }, [user?.email]);

    // Filter appointments based on Tab selection & Search input
    const filteredAppointments = appointments.filter((item) => {
        const matchesSearch =
            (item.clientName && item.clientName.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (item.clientEmail && item.clientEmail.toLowerCase().includes(searchQuery.toLowerCase()));

        if (!matchesSearch) return false;

        const appointmentDate = new Date(item.scheduledDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (filterTab === "upcoming") {
            return appointmentDate >= today;
        } else if (filterTab === "completed") {
            return appointmentDate < today;
        }

        return true;
    });

    return (
        <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-6">
                <div>
                    <h2 className="text-2xl md:text-3xl font-black text-text tracking-tight flex items-center gap-2">
                        <CalendarCheck className="text-emerald-500" size={28} />
                        Client Appointments Schedule
                    </h2>
                    <p className="text-xs md:text-sm text-text-secondary mt-1">
                        View and manage your confirmed legal consultations and upcoming sessions.
                    </p>
                </div>

                {/* Quick Counter Card */}
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-surface border border-border/60 shadow-sm self-start md:self-auto">
                    <Briefcase size={18} className="text-emerald-400" />
                    <div className="text-xs">
                        <span className="text-text-secondary block">Confirmed Bookings</span>
                        {loading ? (
                            <Skeleton className="h-4 w-16 mt-0.5" />
                        ) : (
                            <strong className="text-text text-sm font-extrabold">{appointments.length} Sessions</strong>
                        )}
                    </div>
                </div>
            </div>

            {/* Filter and Search Bar Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Search Input */}
                <div className="relative w-full sm:w-80">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" />
                    <input
                        type="text"
                        placeholder="Search client by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-surface border border-border/70 focus:border-emerald-500 focus:outline-none text-text placeholder:text-text-secondary/60 transition-all"
                    />
                </div>

                {/* Filter Tabs */}
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

            {/* Appointments Grid or Loading Skeleton */}
            {loading ? (
                <BookingCardSkeleton count={4} />
            ) : filteredAppointments.length === 0 ? (
                <div className="p-12 rounded-3xl bg-surface/50 border border-border/80 text-center text-text-secondary backdrop-blur-md shadow-inner space-y-3">
                    <div className="w-12 h-12 rounded-full bg-border/40 mx-auto flex items-center justify-center text-text-secondary">
                        <Calendar size={24} />
                    </div>
                    <p className="text-base font-semibold text-text">No appointments found</p>
                    <p className="text-xs text-text-secondary">
                        {searchQuery
                            ? "No schedule matches your search keywords."
                            : "Your accepted client consultations will show up here."}
                    </p>
                </div>
            ) : (
                <div className="grid gap-5">
                    {filteredAppointments.map((item) => {
                        const clientImage = user?.client?.image || "";
                        const clientName = item.clientName || "Client";
                        const clientInitial = clientName.charAt(0).toUpperCase();

                        return (
                            <div
                                key={item._id}
                                className="group relative p-6 rounded-2xl border border-border/80 bg-surface/80 hover:bg-surface backdrop-blur-md shadow-sm hover:shadow-xl hover:border-emerald-500/30 transition-all duration-300 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                            >
                                {/* Left Section: Avatar & Info */}
                                <div className="flex items-start md:items-center gap-4">
                                    {/* Avatar */}
                                    <div className="relative flex-shrink-0">
                                        {clientImage ? (
                                            <Image
                                                src={clientImage}
                                                alt={clientName}
                                                width={800}
                                                height={800}
                                                className="w-14 h-14 md:w-16 md:h-16 rounded-2xl object-cover border-2 border-emerald-500/30 shadow-md group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-extrabold text-xl md:text-2xl flex items-center justify-center border-2 border-emerald-400/30 shadow-md group-hover:scale-105 transition-transform duration-300">
                                                {clientInitial}
                                            </div>
                                        )}
                                        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-surface rounded-full"></span>
                                    </div>

                                    {/* Client Details */}
                                    <div className="space-y-2">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="text-lg md:text-xl font-bold text-text tracking-tight group-hover:text-emerald-400 transition-colors">
                                                {clientName}
                                            </h3>
                                            {item.clientEmail && (
                                                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-border/40 text-text-secondary border border-border/50">
                                                    <Mail size={12} className="text-secondary" />
                                                    {item.clientEmail}
                                                </span>
                                            )}
                                        </div>

                                        {/* Date & Time Badges */}
                                        <div className="flex flex-wrap items-center gap-2 text-xs text-text-secondary pt-1">
                                            {item.scheduledDate && (
                                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-background/60 border border-border/60">
                                                    <Calendar size={14} className="text-amber-400" />
                                                    <span className="font-semibold text-text">{item.scheduledDate}</span>
                                                </div>
                                            )}

                                            {item.scheduledSlot && (
                                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-background/60 border border-border/60">
                                                    <Clock size={14} className="text-cyan-400" />
                                                    <span className="font-semibold text-text">{item.scheduledSlot}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Section: Quick Action Controls */}
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
                                    ) : (
                                        <a
                                            href={`mailto:${item.clientEmail}?subject=Consultation Appointment Details`}
                                            className="px-4 py-2 rounded-xl bg-surface hover:bg-border/40 border border-border/80 text-text font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all"
                                        >
                                            <Mail size={15} className="text-emerald-400" /> Contact Client
                                        </a>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}