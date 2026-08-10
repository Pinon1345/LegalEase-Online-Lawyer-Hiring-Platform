"use client";

import React, { useState } from 'react';
import { Lock, X, CheckCircle2, CreditCard, ShieldCheck, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { baseURL } from '@/lib/api/baseUrl';

export const PaymentModal = ({ booking, isOpen, onClose, onPaymentSuccess }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    if (!isOpen || !booking) return null;

    const bookingId = booking._id || booking.id;
    const formattedFee = (booking.fee || 0).toFixed(2);

    // Helper to close modal and reset state
    const handleCloseModal = () => {
        setIsProcessing(false);
        setIsSuccess(false);
        onClose();
    };

    const handleSubmitPayment = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        try {
            const res = await fetch(`${baseURL}/api/hire-lawyer/${bookingId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "accepted", paymentStatus: "paid" }),
            });

            // Simulate processing delay for UI smoothness
            await new Promise((resolve) => setTimeout(resolve, 1500));

            setIsProcessing(false);
            setIsSuccess(true);
            toast.success("Payment processed successfully!");

            setTimeout(() => {
                if (onPaymentSuccess) {
                    onPaymentSuccess(bookingId);
                }
                handleCloseModal();
            }, 1600);
        } catch (error) {
            console.error("Payment error:", error);
            toast.error("Payment failed. Please try again.");
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
                        onClick={handleCloseModal}
                        disabled={isProcessing}
                        className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg transition disabled:opacity-50 cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                {isSuccess ? (
                    <div className="py-8 text-center space-y-3">
                        <div className="h-16 w-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto animate-bounce">
                            <CheckCircle2 size={36} />
                        </div>
                        <h4 className="text-xl font-black text-neutral-900 dark:text-white">Payment Successful!</h4>
                        <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                            Consultation fee for Attorney <span className="font-semibold text-neutral-200">{booking.lawyerName}</span> has been settled.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmitPayment} className="space-y-4">
                        <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 space-y-2 text-xs">
                            <div className="flex justify-between">
                                <span className="text-neutral-500">Lawyer:</span>
                                <span className="font-bold text-neutral-800 dark:text-neutral-200">{booking.lawyerName || "N/A"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-neutral-500">Specialisation:</span>
                                <span className="font-medium text-secondary">{booking.specialization || "General Legal"}</span>
                            </div>
                            <div className="h-px bg-neutral-200 dark:bg-neutral-700/60 my-1" />
                            <div className="flex justify-between items-center text-sm font-black text-neutral-900 dark:text-white pt-1">
                                <span>Total Fee:</span>
                                <span className="text-emerald-500">${formattedFee}</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-[11px] font-bold text-neutral-400 uppercase mb-1">Cardholder Name</label>
                                <input
                                    type="text"
                                    required
                                    defaultValue="John Doe"
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-medium focus:ring-2 focus:ring-emerald-500/50 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-neutral-400 uppercase mb-1">Card Details</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        required
                                        defaultValue="4242 •••• •••• 4242"
                                        className="w-full px-3.5 py-2.5 pl-10 rounded-xl bg-surface dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-mono focus:ring-2 focus:ring-emerald-500/50 focus:outline-none"
                                    />
                                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                                </div>
                            </div>
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
                                    <RefreshCw size={16} className="animate-spin" /> Processing Payment...
                                </>
                            ) : (
                                <>
                                    Confirm & Pay ${formattedFee}
                                </>
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};