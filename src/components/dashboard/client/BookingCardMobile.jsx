"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, XCircle, CheckCircle2, ShieldCheck, MessageSquare } from 'lucide-react';

export const BookingCardMobile = ({ booking = {}, onInitiatePayment }) => {
    // 1. Safe fallbacks for Mongo document structure
    const lawyerName = booking.lawyerName || "Lawyer";

    const lawyerImage = (booking.lawyerImage && booking.lawyerImage.trim() !== '')
        ? booking.lawyerImage
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(lawyerName)}&background=0D9488&color=fff`;

    const slot = booking.scheduledSlot || booking.scheduleSlot || booking.specialization || "Consultation Slot";

    const rawFee = booking.fee ?? booking.amount ?? 0;
    const feeNumber = typeof rawFee === 'number' ? rawFee : (parseFloat(rawFee) || 0);

    const hiringDate = booking.hiringDate
        || (booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : 'N/A');

    const bookingId = booking._id || booking.id || 'N/A';

    // Status normalization
    const paymentStatus = booking.paymentStatus || 'unpaid';
    const status = booking.status || (paymentStatus === 'paid' ? 'accepted' : 'pending');

    return (
        <div className="p-5 rounded-2xl bg-surface dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-md space-y-4">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <Image
                        src={lawyerImage}
                        alt={lawyerName}
                        width={44}
                        height={44}
                        unoptimized
                        className="w-11 h-11 rounded-xl object-cover border border-neutral-200 dark:border-neutral-700 shrink-0"
                    />
                    <div>
                        <h3 className="font-bold text-neutral-900 dark:text-neutral-100 text-sm">
                            {lawyerName}
                        </h3>
                        <p className="text-xs text-secondary font-medium">{slot}</p>
                    </div>
                </div>
                <span className="text-xs font-black text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 rounded-lg">
                    ${feeNumber.toFixed(2)}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-neutral-100 dark:border-neutral-800 text-neutral-500">
                <div>
                    <p className="text-[10px] uppercase font-bold text-neutral-400">Hiring Date</p>
                    <p className="font-medium text-neutral-700 dark:text-neutral-300 mt-0.5">{hiringDate}</p>
                </div>
                <div>
                    <p className="text-[10px] uppercase font-bold text-neutral-400">Request Ref</p>
                    <p className="font-mono text-neutral-700 dark:text-neutral-300 mt-0.5 truncate max-w-[120px]">
                        {bookingId}
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
                <div>
                    {status === 'pending' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-500">
                            <Clock size={12} /> pending
                        </span>
                    )}
                    {status === 'rejected' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-500">
                            <XCircle size={12} /> rejected
                        </span>
                    )}
                    {status === 'accepted' && paymentStatus === 'unpaid' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-500">
                            <CheckCircle2 size={12} /> accepted
                        </span>
                    )}
                    {paymentStatus === 'paid' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-500">
                            <ShieldCheck size={12} /> paid
                        </span>
                    )}
                </div>

                <div>
                    {status === 'accepted' && paymentStatus === 'unpaid' && (
                        <button
                            onClick={() => onInitiatePayment(booking)}
                            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition-colors"
                        >
                            Pay Lawyer (${feeNumber.toFixed(2)})
                        </button>
                    )}

                    {paymentStatus === 'paid' && (
                        <Link
                            href={`/dashboard/user/comments`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-secondary/10 text-secondary font-bold text-xs hover:bg-secondary/20 transition-colors"
                        >
                            <MessageSquare size={13} /> Comment
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};