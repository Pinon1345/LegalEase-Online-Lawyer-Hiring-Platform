"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar,
    Clock,
    ShieldCheck,
    CheckCircle2,
    X,
    Sparkles,
    UserCheck,
    AlertTriangle,
    ShieldAlert,
    Lock,
    UserX,
    ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";

export default function BookingWidget({ lawyer }) {
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTimeSlot, setSelectedTimeSlot] = useState("10:00 AM");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: session } = useSession();
    const user = session?.user;
    console.log("Booking Widget Data:", user);

    const isAvailable = lawyer?.availabilityStatus?.toLowerCase() === "available";

    // Standard platform service fee

    const serviceFee = 25;
    const totalAmount = (lawyer?.hourlyRate || 0) + serviceFee;

    const timeSlots = ["09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM", "06:00 PM"];

    // Handler triggered on clicking the consultation button

    const handleOpenModal = () => {

        // 1. Availability Check: Don't proceed if lawyer is busy/unavailable

        if (!isAvailable) {
            toast.error(
                "This lawyer is currently unavailable. Please wait until your booking can be confirmed.",
                {
                    duration: 4000,
                    icon: "🚫",
                }
            );
            return;
        }

        // 2. Date Selection Check

        if (!selectedDate) {
            toast.error("Please select a consultation date first.");
            return;
        }

        // Proceed to show confirmation modal

        setIsModalOpen(true);
    };

    const handleConfirmBooking = async () => {
        setIsSubmitting(true);
        try {

            // Simulate backend booking API request

            await new Promise((resolve) => setTimeout(resolve, 1200));

            toast.success(`Hiring request sent to ${lawyer?.lawyerName}!`);
            setIsModalOpen(false);
        } catch (error) {
            toast.error("Failed to send booking request.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Render restricted card if user role is not "client"

    if (user?.role !== "client") {
        const displayRole = user?.role ? user.role.toUpperCase() : "GUEST";

        return (
            <div className="sticky top-24 rounded-3xl border border-rose-500/20 bg-surface/80 dark:bg-neutral-900/80 p-6 md:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden space-y-6">

                {/* Ambient Decorative Glow Behind Card */}

                <div className="absolute -top-16 -right-16 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Restricted Access Badge Header */}

                <div className="flex items-center justify-between pb-4 border-b border-border/80">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
                            <ShieldAlert size={18} />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-text">
                            Access Control
                        </span>
                    </div>

                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center gap-1.5">
                        <Lock size={12} /> Restricted
                    </span>
                </div>

                {/* Hero Restricted Messaging Graphic */}

                <div className="flex flex-col items-center text-center space-y-3 py-2">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500/20 to-amber-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500 shadow-xl shadow-rose-500/5">
                            <UserX size={32} />
                        </div>
                        <span className="absolute -bottom-1 -right-2 p-1 rounded-full bg-neutral-900 border border-border/80 text-amber-400">
                            <AlertTriangle size={12} />
                        </span>
                    </div>

                    <div className="space-y-1">
                        <h3 className="text-lg md:text-xl font-black text-text tracking-tight">
                            Booking Not Allowed
                        </h3>
                        <p className="text-xs font-semibold text-rose-400/90 tracking-wide uppercase">
                            <span className="underline decoration-rose-500/40 underline-offset-4">{displayRole}</span> ACCOUNTS CANNOT CONSULT THIS LAWYER
                        </p>
                    </div>

                    <p className="text-xs text-text-secondary leading-relaxed max-w-xs">
                        Direct legal consultations are strictly reserved for verified Client accounts.
                    </p>
                </div>

                {/* Details Callout Box */}

                <div className="p-4 rounded-2xl bg-background/80 border border-border/80 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between text-text-secondary">
                        <span>Current User Role</span>
                        <span className="font-bold text-text bg-surface px-2 py-0.5 rounded-lg border border-border/60">
                            {displayRole}
                        </span>
                    </div>
                    <div className="flex items-center justify-between text-text-secondary">
                        <span>Consultation Privilege</span>
                        <span className="font-bold text-rose-500">Disabled</span>
                    </div>
                </div>

                {/* Informational Action Footer */}

                <div className="pt-2">
                    <div className="w-full py-3.5 px-4 rounded-2xl bg-surface/60 border border-border/80 text-text-secondary font-bold text-xs flex items-center justify-between gap-2">
                        <span className="text-[11px]">Need to book an attorney?</span>
                        <Link
                            href={"/signup"}
                            className="block"
                        >
                            <span className="text-secondary flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider">
                                Switch to Client <ArrowRight size={14} />
                            </span>
                        </Link>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-[11px] text-text-secondary text-center pt-1">
                    <ShieldCheck size={14} className="text-secondary shrink-0" />
                    <span>Protected by LegalEase Verification Guarantee</span>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="sticky top-24 rounded-3xl border border-secondary/30 bg-surface/80 dark:bg-neutral-900/80 p-6 md:p-8 backdrop-blur-2xl shadow-2xl space-y-6">

                {/* Header Badge & Price */}

                <div className="flex items-center justify-between pb-4 border-b border-border/80">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-text-secondary block">
                            Consultation Fee
                        </span>
                        <div className="flex items-baseline gap-1 mt-1">
                            <span className="text-3xl font-black text-secondary">
                                ${lawyer?.hourlyRate}
                            </span>
                            <span className="text-xs text-text-secondary font-medium">/ hour</span>
                        </div>
                    </div>

                    <span
                        className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${isAvailable
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30"
                            : "bg-rose-500/10 text-rose-500 border border-rose-500/30"
                            }`}
                    >
                        <span
                            className={`w-2 h-2 rounded-full ${isAvailable ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                                }`}
                        />
                        {lawyer?.availabilityStatus || "Busy"}
                    </span>
                </div>

                {/* Date Picker Input */}

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-text flex items-center gap-2">
                        <Calendar size={15} className="text-secondary" /> Select Date
                    </label>
                    <input
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl border border-border/80 bg-neutral-900/40 text-text text-sm focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary transition cursor-pointer"
                    />
                </div>

                {/* Time Slots */}

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-text flex items-center gap-2">
                        <Clock size={15} className="text-secondary" /> Preferred Slot
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {timeSlots.map((slot) => (
                            <button
                                key={slot}
                                type="button"
                                onClick={() => setSelectedTimeSlot(slot)}
                                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${selectedTimeSlot === slot
                                    ? "bg-secondary text-surface-dark shadow-md scale-105"
                                    : "bg-surface/60 border border-border/60 text-text hover:border-secondary/50"
                                    }`}
                            >
                                {slot}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Price Summary Breakdown */}

                <div className="space-y-2.5 pt-4 border-t border-border/80 text-xs text-text-secondary">
                    <div className="flex justify-between">
                        <span>Hourly Legal Rate</span>
                        <span className="font-semibold text-text">${lawyer?.hourlyRate}.00</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Platform Processing Fee</span>
                        <span className="font-semibold text-text">${serviceFee}.00</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-dashed border-border/60 font-bold text-sm text-text">
                        <span>Total Consultation Price</span>
                        <span className="text-secondary">${totalAmount}.00</span>
                    </div>
                </div>

                {/* Status Notice Banner if Busy */}

                {!isAvailable && (
                    <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2.5">
                        <AlertTriangle size={18} className="shrink-0" />
                        <span>This attorney is currently marked as <strong>busy</strong>.</span>
                    </div>
                )}

                {/* Booking Action Button */}

                <button
                    onClick={handleOpenModal}
                    className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider shadow-xl transition-all duration-300 transform active:translate-y-0 cursor-pointer flex items-center justify-center gap-2 ${isAvailable
                        ? "bg-secondary text-surface-dark hover:bg-secondary-light shadow-secondary/20 hover:-translate-y-0.5"
                        : "bg-neutral-800 text-neutral-400 border border-neutral-700/80 hover:bg-neutral-700/60"
                        }`}
                >
                    <Sparkles size={18} />
                    {isAvailable ? "Request Consultation" : "Attempt Booking"}
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-text-secondary text-center pt-1">
                    <ShieldCheck size={14} className="text-secondary shrink-0" />
                    <span>Protected by LegalEase Verification Guarantee</span>
                </div>
            </div>

            {/* Hire Confirmation Modal */}

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="w-full max-w-lg rounded-3xl border border-secondary/30 bg-surface dark:bg-neutral-900 p-6 md:p-8 shadow-2xl space-y-6 relative overflow-hidden"
                        >
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-5 right-5 p-2 rounded-full text-text-secondary hover:bg-neutral-800 transition"
                            >
                                <X size={20} />
                            </button>

                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-2xl bg-secondary/10 border border-secondary/30 text-secondary">
                                    <UserCheck size={28} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-text">Confirm Legal Hire</h3>
                                    <p className="text-xs text-text-secondary">
                                        Review consultation details before dispatching request.
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-2xl bg-background/80 border border-border/80 p-4 space-y-3 text-sm">
                                <div className="flex justify-between items-center border-b border-border/60 pb-2">
                                    <span className="text-text-secondary text-xs">Attorney Name</span>
                                    <span className="font-bold text-text">{lawyer?.lawyerName}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-border/60 pb-2">
                                    <span className="text-text-secondary text-xs">Specialization</span>
                                    <span className="font-semibold text-secondary">{lawyer?.specialization}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-border/60 pb-2">
                                    <span className="text-text-secondary text-xs">Scheduled Date</span>
                                    <span className="font-bold text-text">
                                        {selectedDate} at {selectedTimeSlot}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center pt-1 font-bold">
                                    <span className="text-xs text-text-secondary">Total Due</span>
                                    <span className="text-lg text-secondary">${totalAmount}.00</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="w-1/2 py-3 rounded-xl border border-border text-text-secondary font-bold text-xs uppercase tracking-wider hover:bg-surface transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmBooking}
                                    disabled={isSubmitting}
                                    className="w-1/2 py-3 rounded-xl bg-secondary text-surface-dark font-extrabold text-xs uppercase tracking-wider shadow-lg hover:bg-secondary-light transition disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <span className="animate-pulse">Confirming...</span>
                                    ) : (
                                        <>
                                            <CheckCircle2 size={16} /> Confirm Hire
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}