"use client";

import React from 'react';
import { DollarSign, CreditCard, Clock } from 'lucide-react';

export const BookingStats = ({ bookings }) => {
    const totalSpent = bookings
        .filter(b => b.paymentStatus === 'paid')
        .reduce((sum, b) => sum + b.fee, 0);

    const pendingCount = bookings.filter(b => b.status === 'pending').length;
    const actionRequiredCount = bookings.filter(b => b.status === 'accepted' && b.paymentStatus === 'unpaid').length;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-surface/80 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Total Investment</p>
                    <p className="text-2xl font-black text-neutral-900 dark:text-white mt-0.5">${totalSpent.toFixed(2)}</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
                    <DollarSign size={22} />
                </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-surface/80 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Awaiting Payment</p>
                    <p className="text-2xl font-black text-amber-500 mt-0.5">{actionRequiredCount} <span className="text-xs font-normal text-neutral-400">requests</span></p>
                </div>
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
                    <CreditCard size={22} />
                </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-surface/80 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Pending Acceptance</p>
                    <p className="text-2xl font-black text-blue-500 mt-0.5">{pendingCount} <span className="text-xs font-normal text-neutral-400">in review</span></p>
                </div>
                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
                    <Clock size={22} />
                </div>
            </div>
        </div>
    );
};