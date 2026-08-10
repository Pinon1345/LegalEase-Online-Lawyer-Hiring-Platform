"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, XCircle, CheckCircle2, ShieldCheck, CreditCard, Check, MessageSquare, ExternalLink, Briefcase } from 'lucide-react';

export const BookingTableRow = ({ booking = {}, onInitiatePayment }) => {
    // 1. Safe field extractions
    const lawyerName = booking.lawyerName || "Lawyer";

    const lawyerImage = (booking.lawyerImage && booking.lawyerImage.trim() !== '')
        ? booking.lawyerImage
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(lawyerName)}&background=0D9488&color=fff`;

    // Extract hiring slot
    const slot = booking.scheduledSlot || booking.scheduleSlot || booking.hiringSlot || booking.slot || "Consultation";

    // Extract specialization
    const specialization = booking.specialization || booking.lawyerSpecialization || booking.category || "General Legal";

    // Extract and format fee
    const rawFee = booking.fee ?? booking.amount ?? 0;
    const feeNumber = typeof rawFee === 'number' ? rawFee : (parseFloat(rawFee) || 0);

    // Format ISO Date safely with fallbacks
    const rawDate = booking.bookingDate || booking.hiringDate || booking.createdAt;
    const formattedDate = rawDate && !isNaN(new Date(rawDate).getTime())
        ? new Date(rawDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
        : 'N/A';

    const bookingId = booking._id || booking.id || 'N/A';

    // Status normalization
    const paymentStatus = booking.paymentStatus || 'unpaid';
    const status = booking.status || (paymentStatus === 'paid' ? 'accepted' : 'pending');

    return (
        <tr className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/30 transition-colors group">

            {/* 1. LAWYER NAME & ID */}
            <td className="py-4 px-6">
                <div className="flex items-center gap-3.5">
                    <Image
                        src={lawyerImage}
                        alt={lawyerName}
                        width={44}
                        height={44}
                        unoptimized
                        className="w-11 h-11 rounded-xl object-cover border border-neutral-200 dark:border-neutral-700 shrink-0"
                    />
                    <div>
                        <Link
                            href={`/lawyers/${booking.lawyerId || '#'}`}
                            className="font-bold text-neutral-900 dark:text-neutral-100 hover:text-secondary transition-colors inline-flex items-center gap-1 group-hover:underline text-sm"
                        >
                            {lawyerName}
                        </Link>
                        <p className="text-[10px] text-neutral-400 font-mono mt-0.5 truncate max-w-[140px]">
                            ID: {bookingId}
                        </p>
                    </div>
                </div>
            </td>

            {/* 2. HIRING DATE */}
            <td className="py-4 px-4 text-neutral-600 dark:text-neutral-300 font-medium text-xs">
                <div className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-neutral-400 shrink-0" />
                    <span>{formattedDate}</span>
                </div>
            </td>

            {/* 3. HIRING SLOT */}
            <td className="py-4 px-4 text-neutral-600 dark:text-neutral-300 font-medium text-xs">
                <div className="flex items-center gap-1.5">
                    <Clock size={13} className="text-neutral-400 shrink-0" />
                    <span>{slot}</span>
                </div>
            </td>

            {/* 4. FEE */}
            <td className="py-4 px-4 font-bold text-neutral-900 dark:text-white text-xs sm:text-sm">
                ${feeNumber.toFixed(2)}
            </td>

            {/* 5. SPECIALIZATION */}
            <td className="py-4 px-4 text-neutral-600 dark:text-neutral-300 font-medium text-xs">
                <div className="flex items-center gap-1.5">
                    <Briefcase size={13} className="text-neutral-400 shrink-0" />
                    <span>{specialization}</span>
                </div>
            </td>

            {/* 6. STATUS */}
            <td className="py-4 px-4">
                {status === 'pending' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                        <Clock size={12} /> pending
                    </span>
                )}

                {status === 'rejected' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20">
                        <XCircle size={12} /> rejected
                    </span>
                )}

                {status === 'accepted' && paymentStatus === 'unpaid' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20 animate-pulse">
                        <CheckCircle2 size={12} /> accepted
                    </span>
                )}

                {paymentStatus === 'paid' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        <ShieldCheck size={12} /> paid
                    </span>
                )}
            </td>

            {/* 7. ACTION */}
            <td className="py-4 px-6 text-right">
                <div className="flex items-center justify-end gap-2">
                    {/* Pay Button */}
                    {status === 'accepted' && paymentStatus === 'unpaid' && (
                        <button
                            onClick={() => onInitiatePayment(booking)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs shadow-md transition-all transform active:scale-95 cursor-pointer"
                        >
                            <CreditCard size={14} /> Pay Lawyer
                        </button>
                    )}

                    {/* Paid State */}
                    {paymentStatus === 'paid' && (
                        <>
                            <button
                                disabled
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-400 text-xs font-bold cursor-not-allowed border border-neutral-200 dark:border-neutral-700"
                            >
                                <Check size={14} className="text-emerald-500" /> Paid
                            </button>
                            <Link
                                href={`/dashboard/user/comments`}
                                className="p-2 rounded-xl bg-secondary/10 hover:bg-secondary/20 text-secondary transition-colors"
                                title="Leave a comment"
                            >
                                <MessageSquare size={15} />
                            </Link>
                        </>
                    )}

                    {/* Pending or Rejected state */}
                    {(status === 'pending' || status === 'rejected') && (
                        <Link
                            href={`/lawyers/${booking.lawyerId || '#'}`}
                            className="inline-flex items-center gap-1 text-xs font-bold text-neutral-500 hover:text-secondary py-1 px-2.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        >
                            View Lawyer <ExternalLink size={12} />
                        </Link>
                    )}
                </div>
            </td>
        </tr>
    );
};