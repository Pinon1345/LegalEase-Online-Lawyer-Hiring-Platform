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
 * Reusable Lawyer Card Skeleton (for directories or dashboard cards)
 */


export function LawyerCardSkeleton() {
    return (
        <div className="rounded-3xl border border-border/60 bg-surface dark:bg-neutral-900/80 p-6 md:p-8 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                {/* Profile Image Skeleton */}
                <Skeleton className="h-24 w-24 rounded-2xl shrink-0" />

                {/* Details Skeleton */}
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

            {/* Bio Lines */}
            <div className="space-y-2 pt-2 border-t border-border/40">
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-4/5" />
            </div>
        </div>
    );
}



/**
 * Reusable Table / List Row Skeleton (for admin/client dashboards)
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