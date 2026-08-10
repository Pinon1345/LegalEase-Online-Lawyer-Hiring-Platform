"use client";

import React from 'react';
import { Search, X } from 'lucide-react';

export const BookingFilter = ({ searchQuery, setSearchQuery, statusFilter, setStatusFilter }) => {
    const tabs = [
        { id: 'all', label: 'All Requests' },
        { id: 'pending', label: 'Pending' },
        { id: 'accepted', label: 'Accepted (Awaiting Payment)' },
        { id: 'paid', label: 'Paid' },
        { id: 'rejected', label: 'Rejected' }
    ];

    return (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-surface/50 dark:bg-neutral-900/40 p-3 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80">
            {/* Search Input */}
            <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by lawyer name, specialization, or ID..."
                    className="w-full pl-10 pr-8 py-2 rounded-xl bg-surface dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all placeholder:text-neutral-400"
                />
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 text-xs"
                    >
                        <X size={14} />
                    </button>
                )}
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setStatusFilter(tab.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${statusFilter === tab.id
                                ? 'bg-secondary text-surface-dark shadow-md'
                                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    );
};