"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import {
    Clock,
    Calendar,
    User,
    Mail,
    DollarSign,
    Briefcase,
    Sparkles,
    Scale
} from "lucide-react";
import toast from "react-hot-toast";
import { baseURL } from "@/lib/api/baseUrl";
import { BookingCardSkeleton, Skeleton } from "@/components/ui/Skeleton";
import Image from "next/image";

export default function HiringHistory() {
    const { data: session, isPending: sessionLoading } = useSession();
    const user = session?.user;

    const [bookings, setBookings] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [isFetching, setIsFetching] = useState(false);

    // Derived loading state to prevent cascading render warnings
    const loading = sessionLoading || isFetching;

    useEffect(() => {
        if (sessionLoading || !user?.email) return;

        let isMounted = true;

        const fetchData = async () => {
            try {
                setIsFetching(true);

                // Fetch hiring history and user list concurrently
                const [bookingsRes, usersRes] = await Promise.all([
                    fetch(`${baseURL}/api/hire-lawyer?lawyerEmail=${encodeURIComponent(user.email)}`),
                    fetch(`${baseURL}/api/users`).catch(() => null)
                ]);

                const bookingsData = await bookingsRes.json();
                let parsedUsers = [];

                if (usersRes && usersRes.ok) {
                    const rawUsers = await usersRes.json();
                    parsedUsers = Array.isArray(rawUsers)
                        ? rawUsers
                        : rawUsers?.data || rawUsers?.users || [];
                }

                if (isMounted) {
                    // Extract bookings list
                    if (Array.isArray(bookingsData)) {
                        setBookings(bookingsData);
                    } else if (bookingsData?.success && Array.isArray(bookingsData?.data)) {
                        setBookings(bookingsData.data);
                    } else if (bookingsData?.data && Array.isArray(bookingsData.data)) {
                        setBookings(bookingsData.data);
                    } else {
                        setBookings([]);
                    }

                    setUsersList(parsedUsers);
                }
            } catch (error) {
                console.error("Error fetching hiring history data:", error);
                toast.error("Failed to load hiring requests.");
            } finally {
                if (isMounted) {
                    setIsFetching(false);
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [user?.email, sessionLoading]);

    return (
        <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-6">
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-2xl md:text-3xl font-black text-text tracking-tight">
                            Hiring & Consultation History
                        </h2>
                        <Sparkles size={20} className="text-amber-400 animate-pulse" />
                    </div>
                    <p className="text-xs md:text-sm text-text-secondary mt-1">
                        View complete archive of all past and current hiring consultation records.
                    </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface border border-border/60 text-xs font-semibold text-text-secondary self-start md:self-auto">
                    <Briefcase size={15} className="text-emerald-400" />
                    <span>
                        Total Requests:{" "}
                        {loading ? (
                            <Skeleton className="h-4 w-8 inline-block align-middle ml-1" />
                        ) : (
                            <strong className="text-text">{bookings.length}</strong>
                        )}
                    </span>
                </div>
            </div>

            {/* Bookings List or Loading Skeleton */}
            {loading ? (
                <BookingCardSkeleton count={4} />
            ) : bookings.length === 0 ? (
                <div className="p-12 rounded-3xl bg-surface/50 border border-border/80 text-center text-text-secondary backdrop-blur-md shadow-inner space-y-3">
                    <div className="w-12 h-12 rounded-full bg-border/40 mx-auto flex items-center justify-center text-text-secondary">
                        <User size={24} />
                    </div>
                    <p className="text-base font-semibold text-text">No consultation records found.</p>
                    <p className="text-xs text-text-secondary">
                        Once client bookings are processed, full history logs will display here.
                    </p>
                </div>
            ) : (
                <div className="grid gap-5">
                    {bookings.map((item) => {
                        // Extract request identifiers from booking item
                        const senderId =
                            item.clientId ||
                            item.userId ||
                            item.user_id ||
                            item.client?._id ||
                            item.user?._id;

                        const senderEmail =
                            item.clientEmail ||
                            item.email ||
                            item.userEmail ||
                            item.client_email ||
                            item.client?.email;

                        // FIND USER LOGIC: Find sender in users collection by ID or Email
                        const senderUser = usersList.find((u) => {
                            const uId = u._id?.toString() || u.id?.toString();
                            const matchesId = senderId && uId === senderId?.toString();
                            const matchesEmail =
                                senderEmail &&
                                u.email?.toLowerCase() === senderEmail?.toLowerCase();

                            return matchesId || matchesEmail;
                        });

                        // Retrieve profile image from found user (`user.image`)
                        const clientImage =
                            senderUser?.image ||
                            senderUser?.imageUrl ||
                            item.clientImage ||
                            item.image ||
                            "";

                        const clientName =
                            senderUser?.name ||
                            item.clientName ||
                            item.name ||
                            "Client";

                        const clientEmailDisplay =
                            senderUser?.email || senderEmail || "";

                        const clientInitial = clientName.charAt(0).toUpperCase();

                        // Lawyer Name
                        const lawyerName =
                            item.lawyerName || item.lawyer?.name || user?.name || "Lawyer";

                        return (
                            <div
                                key={item._id || item.id}
                                className="group relative p-6 rounded-2xl border border-border/80 bg-surface/80 hover:bg-surface backdrop-blur-md shadow-sm hover:shadow-xl hover:border-emerald-500/30 transition-all duration-300 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                            >
                                {/* Left Side: Profile Photo & Information */}
                                <div className="flex items-start md:items-center gap-4">
                                    {/* Client Avatar Render */}
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

                                    {/* Detailed Information */}
                                    <div className="space-y-2">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="text-lg md:text-xl font-bold text-text tracking-tight group-hover:text-emerald-400 transition-colors">
                                                {clientName}
                                            </h3>
                                            {clientEmailDisplay && (
                                                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-border/40 text-text-secondary border border-border/50">
                                                    <Mail size={12} className="text-secondary" />
                                                    {clientEmailDisplay}
                                                </span>
                                            )}
                                        </div>

                                        {/* Lawyer Badge & Meta Pills */}
                                        <div className="flex flex-wrap items-center gap-2 text-xs text-text-secondary pt-1">
                                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                                                <Scale size={14} />
                                                <span>Advocate: <span className="font-bold text-purple-600">{lawyerName}</span></span>
                                            </div>

                                            {(item.scheduledDate || item.date) && (
                                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-background/60 border border-border/60">
                                                    <Calendar size={14} className="text-amber-400" />
                                                    <span className="font-medium text-text">
                                                        {item.scheduledDate || item.date}
                                                    </span>
                                                </div>
                                            )}

                                            {(item.scheduledSlot || item.slot || item.time) && (
                                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-background/60 border border-border/60">
                                                    <Clock size={14} className="text-cyan-400" />
                                                    <span className="font-medium text-text">
                                                        {item.scheduledSlot || item.slot || item.time}
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

                                {/* Right Side: Status Badge */}
                                <div className="flex items-center justify-between lg:justify-end gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-border/40">
                                    <span
                                        className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${item.status === "accepted"
                                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-500/10"
                                            : item.status === "rejected"
                                                ? "bg-rose-500/10 text-rose-400 border border-rose-500/30 shadow-sm shadow-rose-500/10"
                                                : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
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
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}