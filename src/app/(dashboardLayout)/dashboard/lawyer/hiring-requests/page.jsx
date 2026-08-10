"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { CheckCircle, XCircle, Clock, Calendar, User, Mail, DollarSign } from "lucide-react";
import toast from "react-hot-toast";

export default function HiringHistory() {
    const { data: session } = useSession();
    const user = session?.user;

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. If email isn't available yet, wait without triggering synchronous state updates
        if (!user?.email) return;

        let isMounted = true;

        const fetchLawyerRequests = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/hire-lawyer?lawyerEmail=${user.email}`);
                const data = await res.json();

                if (isMounted && data.success) {
                    setBookings(data.data || []);
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

        // Cleanup guard to prevent memory leaks on unmount
        return () => {
            isMounted = false;
        };
    }, [user?.email]);

    // Handle status update (Accept / Reject)
    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const res = await fetch(`http://localhost:5000/api/hire-lawyer/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            const data = await res.json();
            if (res.ok && data.success) {
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

    if (loading && user?.email) {
        return (
            <div className="p-8 text-center text-text-secondary font-medium animate-pulse">
                Loading consultation requests...
            </div>
        );
    }

    return (
        <div className="p-6 md:p-10 space-y-6">
            <div>
                <h2 className="text-2xl font-black text-text">Hiring & Consultation Requests</h2>
                <p className="text-xs md:text-sm text-text-secondary mt-1">
                    Manage and respond to client consultation bookings.
                </p>
            </div>

            {bookings.length === 0 ? (
                <div className="p-8 rounded-2xl bg-surface border border-border text-center text-text-secondary text-sm">
                    No hiring requests found.
                </div>
            ) : (
                <div className="grid gap-4">
                    {bookings.map((item) => (
                        <div
                            key={item._id}
                            className="p-5 rounded-2xl border border-border/80 bg-surface/60 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
                        >
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-text flex items-center gap-1.5">
                                        <User size={16} className="text-secondary" /> {item.clientName}
                                    </span>
                                    <span className="text-xs text-text-secondary flex items-center gap-1">
                                        (<Mail size={12} /> {item.clientEmail})
                                    </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-4 text-xs text-text-secondary">
                                    <span className="flex items-center gap-1">
                                        <Calendar size={14} className="text-secondary" /> {item.scheduledDate}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock size={14} className="text-secondary" /> {item.scheduledSlot}
                                    </span>
                                    <span className="flex items-center gap-1 font-semibold text-text">
                                        <DollarSign size={14} className="text-emerald-500" /> ${item.fee}
                                    </span>
                                </div>
                            </div>

                            {/* Status & Actions */}
                            <div className="flex items-center gap-3">
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${item.status === "accepted"
                                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30"
                                            : item.status === "rejected"
                                                ? "bg-rose-500/10 text-rose-500 border border-rose-500/30"
                                                : "bg-amber-500/10 text-amber-500 border border-amber-500/30"
                                        }`}
                                >
                                    {item.status || "pending"}
                                </span>

                                {item.status === "pending" && (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleStatusUpdate(item._id, "accepted")}
                                            className="px-3 py-1.5 rounded-xl bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 hover:bg-emerald-600 transition cursor-pointer"
                                        >
                                            <CheckCircle size={14} /> Accept
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(item._id, "rejected")}
                                            className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 font-bold text-xs flex items-center gap-1 hover:bg-rose-500/20 transition cursor-pointer"
                                        >
                                            <XCircle size={14} /> Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}