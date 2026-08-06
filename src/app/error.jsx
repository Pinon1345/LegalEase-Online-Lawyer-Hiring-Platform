"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Home, ShieldAlert, Bug } from "lucide-react";

export default function Error({ error, reset }) {
    useEffect(() => {
        // Log the error to an error reporting service (e.g., Sentry, LogRocket)
        console.error("Unhandled Application Error:", error);
    }, [error]);

    return (
        <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-background text-text overflow-hidden px-4 select-none">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-rose-500/10 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-secondary/5 blur-[90px] pointer-events-none" />

            <div className="relative z-10 max-w-2xl w-full text-center flex flex-col items-center">
                {/* Top Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-500 font-bold text-xs uppercase tracking-widest mb-6 shadow-sm"
                >
                    <ShieldAlert size={15} />
                    <span>System Error • 500</span>
                </motion.div>

                {/* Animated Graphic Centerpiece with Bug Icon centered */}
                <div className="relative flex items-center justify-center mb-6 w-full">
                    {/* Big 500 Text */}
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 0.12, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="text-[130px] sm:text-[170px] md:text-[210px] font-black leading-none tracking-tight text-rose-500 select-none"
                    >
                        500
                    </motion.h1>

                    {/* Alert Icon Overlay - Centered over middle '0' */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-3 ml-0.5 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-surface/90 dark:bg-neutral-900/90 border border-rose-500/30 text-rose-500 shadow-2xl backdrop-blur-xl z-20"
                    >
                        <AlertTriangle size={42} className="drop-shadow-[0_0_12px_rgba(244,63,94,0.4)] text-rose-500" />
                    </motion.div>
                </div>

                {/* Content Headings */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="space-y-3"
                >
                    <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-text">
                        Objection Overruled!
                    </h2>
                    <p className="text-text-secondary text-sm sm:text-base max-w-md mx-auto leading-relaxed">
                        Something unexpected happened on our legal network. Our technical team has been notified of this issue.
                    </p>
                </motion.div>

                {/* Developer Error Message Box (Visible in Non-Production / Debug) */}
                {error?.message && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="mt-6 w-full max-w-md p-3.5 rounded-2xl bg-surface/80 dark:bg-neutral-900/80 border border-border/80 text-left flex items-start gap-3 backdrop-blur-md"
                    >
                        <Bug size={18} className="text-rose-500 shrink-0 mt-0.5" />
                        <div className="overflow-hidden">
                            <p className="text-xs font-bold text-text uppercase tracking-wider mb-0.5">
                                Error Details:
                            </p>
                            <p className="text-xs text-text-secondary font-mono truncate">
                                {error.message}
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 w-full sm:w-auto"
                >
                    {/* Retry Button - Triggers Next.js route re-render */}
                    <button
                        onClick={() => reset()}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-border bg-surface hover:bg-surface/80 text-text font-bold text-sm transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
                    >
                        <RefreshCw size={18} />
                        Try Again
                    </button>

                    <Link
                        href="/"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-secondary text-surface-dark font-extrabold text-sm shadow-lg hover:bg-secondary-light transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <Home size={18} />
                        Return Home
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}