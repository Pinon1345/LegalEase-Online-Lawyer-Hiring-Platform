"use client";

import React from "react";



/**
 * Base Primitive Skeleton Block
 */

export function Skeleton({ className = "", ...props }) {
    return (
        <div
            className={`animate-pulse rounded-xl bg-text-secondary/15 dark:bg-neutral-800 ${className}`}
            {...props}
        />
    );
}



/**
 * Dashboard Stat Cards Skeleton Grid
 */

export function StatCardSkeleton({ count = 4 }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: count }).map((_, idx) => (
                <div
                    key={idx}
                    className="rounded-2xl p-5 border border-secondary/15 bg-surface/80 dark:bg-neutral-900/60 shadow-lg flex items-center justify-between"
                >
                    <div className="space-y-2.5 w-1/2">
                        <Skeleton className="h-3 w-3/4" />
                        <Skeleton className="h-7 w-1/2" />
                    </div>
                    <Skeleton className="h-12 w-12 rounded-2xl shrink-0" />
                </div>
            ))}
        </div>
    );
}



/**
 * Consultation Booking Card Skeleton List
 */

export function BookingCardSkeleton({ count = 2 }) {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, idx) => (
                <div
                    key={idx}
                    className="p-5 sm:p-6 rounded-2xl bg-surface/80 dark:bg-neutral-900/70 border border-secondary/20 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <Skeleton className="w-14 h-14 rounded-2xl shrink-0" />
                        <div className="space-y-2 w-full">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-4 w-16 rounded-full" />
                            </div>
                            <Skeleton className="h-3.5 w-28" />
                            <div className="flex gap-3 pt-1">
                                <Skeleton className="h-3 w-20" />
                                <Skeleton className="h-3 w-16" />
                            </div>
                        </div>
                    </div>
                    <Skeleton className="h-10 w-full sm:w-28 rounded-xl shrink-0" />
                </div>
            ))}
        </div>
    );
}



/**
 * Activity List Item Skeleton
 */

export function ActivityListSkeleton({ count = 3 }) {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, idx) => (
                <div key={idx} className="flex items-start gap-3.5 pb-3 border-b border-neutral-100 dark:border-neutral-800/60 last:border-0 last:pb-0">
                    <Skeleton className="h-8 w-8 rounded-xl shrink-0" />
                    <div className="space-y-2 w-full">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-3 w-2/3" />
                        <Skeleton className="h-2.5 w-16" />
                    </div>
                </div>
            ))}
        </div>
    );
}



/**
 * Reusable Profile Card Skeleton (matches ClientProfileCard)
 */

export function ProfileCardSkeleton() {
    return (
        <div className="rounded-3xl border border-border/60 bg-surface dark:bg-neutral-900/80 p-6 md:p-8 shadow-xl space-y-6">
            {/* Header Badge & ID */}
            <div className="flex justify-between items-center border-b border-border/40 pb-4">
                <Skeleton className="h-6 w-32 rounded-full" />
                <Skeleton className="h-4 w-20" />
            </div>

            {/* Avatar & Name */}
            <div className="flex flex-col items-center space-y-3">
                <Skeleton className="h-28 w-28 rounded-3xl" />
                <Skeleton className="h-6 w-44" />
                <Skeleton className="h-4 w-24" />
            </div>

            {/* Field Details */}
            <div className="p-4 rounded-2xl border border-border/40 bg-neutral-100/50 dark:bg-neutral-800/30 space-y-3">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-36" />
                </div>
                <div className="h-px bg-border/40" />
                <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-28" />
                </div>
                <div className="h-px bg-border/40" />
                <div className="space-y-2 pt-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3.5 w-full" />
                    <Skeleton className="h-3.5 w-4/5" />
                </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 pt-2">
                <Skeleton className="h-11 w-full rounded-xl" />
                <Skeleton className="h-11 w-full rounded-xl" />
            </div>
        </div>
    );
}



/**
 * Reusable Lawyer Card Skeleton
 */

export function LawyerCardSkeleton() {
    return (
        <div className="rounded-3xl border border-border/60 bg-surface dark:bg-neutral-900/80 p-6 md:p-8 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                <Skeleton className="h-24 w-24 rounded-2xl shrink-0" />
                <div className="flex-1 space-y-3 w-full">
                    <div className="flex justify-between items-center w-full">
                        <Skeleton className="h-6 w-1/3" />
                        <Skeleton className="h-5 w-20 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-1/4" />
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                    </div>
                </div>
            </div>
            <div className="space-y-2 pt-2 border-t border-border/40">
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-4/5" />
            </div>
        </div>
    );
}



/**
 * Reusable Table / List Row Skeleton
 */

export function TableRowSkeleton({ rows = 5 }) {
    return (
        <div className="w-full space-y-3">
            {Array.from({ length: rows }).map((_, idx) => (
                <div
                    key={idx}
                    className="flex items-center justify-between p-4 rounded-2xl border border-border/40 bg-surface/50 dark:bg-neutral-900/50 gap-4"
                >
                    <div className="flex items-center gap-3 flex-1">
                        <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                        <div className="space-y-1.5 w-1/2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                        </div>
                    </div>
                    <Skeleton className="h-6 w-20 rounded-full shrink-0" />
                    <Skeleton className="h-8 w-24 rounded-xl shrink-0" />
                </div>
            ))}
        </div>
    );
}



/**
 * Reusable Form Field Skeleton
 */

export function FormSkeleton() {
    return (
        <div className="space-y-6 rounded-3xl border border-border/60 bg-surface dark:bg-neutral-900/80 p-6 md:p-8">
            <div className="space-y-2">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-4 w-2/4" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-11 w-full rounded-xl" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-11 w-full rounded-xl" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-11 w-full rounded-xl" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-11 w-full rounded-xl" />
                </div>
            </div>

            <div className="space-y-2 pt-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-28 w-full rounded-xl" />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border/40">
                <Skeleton className="h-10 w-24 rounded-xl" />
                <Skeleton className="h-10 w-32 rounded-xl" />
            </div>
        </div>
    );
}