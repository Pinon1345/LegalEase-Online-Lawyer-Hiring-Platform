"use client";

import React, { useState } from 'react';
import { Lock, X, CreditCard, ShieldCheck, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export const PaymentModal = ({ booking, isOpen, onClose }) => {
    const [isProcessing, setIsProcessing] = useState(false);

    if (!isOpen || !booking) return null;

    const formattedFee = (booking.fee || booking.amount || 0).toFixed(2);
    const bookingId = booking._id || booking.id || "";

    const handleCloseModal = () => {
        setIsProcessing(false);
        onClose();
    };

    const handleSubmitPayment = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        try {
            // 1. Send checkout creation payload to Next.js API route
            const res = await fetch('/api/checkout_sessions', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    bookingId: bookingId, // Crucial for updating MongoDB document after payment
                    type: "booking",
                    totalAmount: booking.fee || booking.amount || 0,
                    lawyerId: booking.lawyerId || booking.lawyer_id || "",
                    lawyerName: booking.lawyerName || "Legal Consultation",
                    clientEmail: booking.clientEmail || booking.userEmail || "",
                    selectedDate: booking.scheduledDate || booking.date || booking.bookingDate || "",
                    selectedTimeSlot: booking.scheduledSlot || booking.time || booking.hiringSlot || "",
                    specialization: booking.specialization || "General Legal",
                    paymentStatus: "paid"
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to create checkout session.");
            }

            // 2. Redirect user to Hosted Stripe Checkout Page
            if (data?.url) {
                toast.loading("Redirecting to Stripe Checkout...");
                window.location.href = data.url;
            } else {
                throw new Error("No Stripe checkout URL received.");
            }
        } catch (error) {
            console.error("Payment redirect error:", error);
            toast.error(error.message || "Payment initiation failed. Please try again.");
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
            <div className="relative w-full max-w-md bg-surface dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-2xl space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                            <Lock size={18} />
                        </div>
                        <div>
                            <h3 className="font-bold text-neutral-900 dark:text-white text-base">Stripe Legal Checkout</h3>
                            <p className="text-[11px] text-neutral-400">Escrow Protected Payment</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={handleCloseModal}
                        disabled={isProcessing}
                        className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg transition disabled:opacity-50 cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmitPayment} className="space-y-4">
                    <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 space-y-2 text-xs">
                        <div className="flex justify-between">
                            <span className="text-neutral-500">Booking ID:</span>
                            <span className="font-mono font-bold text-neutral-800 dark:text-neutral-200 truncate max-w-[180px]">
                                {bookingId || "N/A"}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-neutral-500">Lawyer:</span>
                            <span className="font-bold text-neutral-800 dark:text-neutral-200">
                                {booking.lawyerName || "N/A"}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-neutral-500">Specialisation:</span>
                            <span className="font-medium text-secondary">
                                {booking.specialization || "General Legal"}
                            </span>
                        </div>
                        <div className="h-px bg-neutral-200 dark:bg-neutral-700/60 my-1" />
                        <div className="flex justify-between items-center text-sm font-black text-neutral-900 dark:text-white pt-1">
                            <span>Total Fee:</span>
                            <span className="text-emerald-500">${formattedFee}</span>
                        </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2.5">
                        <CreditCard size={18} className="shrink-0" />
                        <span>You will be redirected to Stripe&apos;s secure environment to complete your transaction.</span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-neutral-400 pt-1">
                        <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
                        <span>Secured using 256-Bit SSL Encrypted Stripe integration.</span>
                    </div>

                    <button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                        {isProcessing ? (
                            <>
                                <RefreshCw size={16} className="animate-spin" /> Redirecting to Stripe...
                            </>
                        ) : (
                            <>
                                Pay ${formattedFee} with Stripe
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};