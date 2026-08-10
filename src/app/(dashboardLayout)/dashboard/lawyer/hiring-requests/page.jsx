"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import {
    CheckCircle,
    XCircle,
    Clock,
    Calendar,
    User,
    Mail,
    DollarSign,
    Briefcase,
    Sparkles
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

function RequestCardSkeleton() {
    return (
        <div className="p-6 rounded-2xl border border-border/80 bg-surface/80 backdrop-blur-md shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Left Section: Avatar & Info */}
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

            {/* Right Section: Status Badge & Actions */}
            <div className="flex flex-wrap items-center justify-between lg:justify-end gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-border/40 w-full lg:w-auto">
                <Skeleton className="h-7 w-24 rounded-xl" />
                <div className="flex items-center gap-2">
                    <Skeleton className="h-9 w-20 rounded-xl" />
                    <Skeleton className="h-9 w-20 rounded-xl" />
                </div>
            </div>
        </div>
    );
}

export default function HiringRequest() {
    const { data: session } = useSession();
    const user = session?.user;

    // Support either user.id or user._id from session object
    const lawyerId = user?.id || user?._id;

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!lawyerId) return;

        let isMounted = true;

        const fetchLawyerRequests = async () => {
            setLoading(true);

            try {
                const url = `${baseURL}/api/lawyer/hiring-requests/${lawyerId}`;

                console.log("Fetching:", url);

                const res = await fetch(url);

                if (!res.ok) {
                    throw new Error("Failed to fetch requests");
                }

                const data = await res.json();

                console.log("Hiring requests received:", data);

                if (isMounted) {
                    setBookings(Array.isArray(data) ? data : []);
                }
            } catch (error) {
                console.error("Error fetching hiring history:", error);
                toast.error("Failed to load hiring requests.");
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchLawyerRequests();

        return () => {
            isMounted = false;
        };
    }, [lawyerId]);

    // Handle status update (Accept / Reject)
    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const res = await fetch(`${baseURL}/api/hiring/update-status/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            const data = await res.json();

            if (res.ok && (data.success || data.modifiedCount > 0 || res.status === 200)) {
                toast.success(`Request marked as ${newStatus}`);

                // Optimistically update local state
                setBookings((prev) =>
                    prev.map((item) => (item._id === id ? { ...item, status: newStatus } : item))
                );
            } else {
                toast.error(data.message || "Failed to update status");
            }
        } catch (error) {
            console.error("Status update error:", error);
            toast.error("Server error updating request.");
        }
    };

    return (
        <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-6">
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-2xl md:text-3xl font-black text-text tracking-tight">
                            Hiring & Consultation Requests
                        </h2>
                        <Sparkles size={20} className="text-amber-400 animate-pulse" />
                    </div>
                    <p className="text-xs md:text-sm text-text-secondary mt-1">
                        Manage, review, and respond to client consultation bookings.
                    </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface border border-border/60 text-xs font-semibold text-text-secondary self-start md:self-auto min-w-[130px]">
                    <Briefcase size={15} className="text-emerald-400" />
                    <span>
                        Total Requests:{" "}
                        {loading ? (
                            <Skeleton className="h-4 w-6 inline-block align-middle ml-1" />
                        ) : (
                            <strong className="text-text">{bookings.length}</strong>
                        )}
                    </span>
                </div>
            </div>

            {/* Bookings List / Skeleton Loading */}
            {loading ? (
                <div className="grid gap-5">
                    {[1, 2, 3, 4].map((i) => (
                        <RequestCardSkeleton key={i} />
                    ))}
                </div>
            ) : bookings.length === 0 ? (
                <div className="p-12 rounded-3xl bg-surface/50 border border-border/80 text-center text-text-secondary backdrop-blur-md shadow-inner space-y-3">
                    <div className="w-12 h-12 rounded-full bg-border/40 mx-auto flex items-center justify-center text-text-secondary">
                        <User size={24} />
                    </div>
                    <p className="text-base font-semibold text-text">No hiring requests found</p>
                    <p className="text-xs text-text-secondary">
                        New client bookings and consultation requests will appear here.
                    </p>
                </div>
            ) : (
                <div className="grid gap-5">
                    {bookings.map((item) => {
                        // Extract client photo from possible backend fields
                        const clientImage = user?.client?.image || "";
                        const clientName = item.clientName || "Client";
                        const clientInitial = clientName.charAt(0).toUpperCase();

                        return (
                            <div
                                key={item._id}
                                className="group relative p-6 rounded-2xl border border-border/80 bg-surface/80 hover:bg-surface backdrop-blur-md shadow-sm hover:shadow-xl hover:border-emerald-500/30 transition-all duration-300 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                            >
                                {/* Left Section: Avatar & Details */}
                                <div className="flex items-start md:items-center gap-4">
                                    {/* Avatar Image or Initial Fallback */}
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

                                        {/* Info Pills */}
                                        <div className="flex flex-wrap items-center gap-2 text-xs text-text-secondary pt-1">
                                            {item.scheduledDate && (
                                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-background/60 border border-border/60">
                                                    <Calendar size={14} className="text-amber-400" />
                                                    <span className="font-medium text-text">{item.scheduledDate}</span>
                                                </div>
                                            )}

                                            {item.scheduledSlot && (
                                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-background/60 border border-border/60">
                                                    <Clock size={14} className="text-cyan-400" />
                                                    <span className="font-medium text-text">{item.scheduledSlot}</span>
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

                                {/* Right Section: Status & Actions */}
                                <div className="flex flex-wrap items-center justify-between lg:justify-end gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-border/40">
                                    {/* Status Badge */}
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${item.status === "accepted"
                                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-500/10"
                                                : item.status === "rejected"
                                                    ? "bg-rose-500/10 text-rose-400 border border-rose-500/30 shadow-sm shadow-rose-500/10"
                                                    : "bg-amber-500/10 text-amber-400 border border-amber-500/30 animate-pulse"
                                                }`}
                                        >
                                            <span
                                                className={`w-2 h-2 rounded-full ${item.status === "accepted"
                                                    ? "bg-emerald-400"
                                                    : item.status === "rejected"
                                                        ? "bg-rose-400"
                                                        : "bg-amber-400"
                                                    }`}
                                            ></span>
                                            {item.status || "pending"}
                                        </span>
                                    </div>

                                    {/* Action Buttons */}
                                    {item.status === "pending" && (
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleStatusUpdate(item._id, "accepted")}
                                                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
                                            >
                                                <CheckCircle size={15} /> Accept
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(item._id, "rejected")}
                                                className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                                            >
                                                <XCircle size={15} /> Reject
                                            </button>
                                        </div>
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