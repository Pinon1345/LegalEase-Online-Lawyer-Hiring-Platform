"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Scale, ArrowLeft, Home, Search, ShieldAlert } from "lucide-react";

export default function NotFound() {
    return (
        <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-background text-text overflow-hidden px-4 select-none">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-secondary/10 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-secondary/5 blur-[90px] pointer-events-none" />

            <div className="relative z-10 max-w-2xl w-full text-center flex flex-col items-center">
                {/* Top Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/30 text-secondary font-bold text-xs uppercase tracking-widest mb-8 shadow-sm"
                >
                    <ShieldAlert size={15} />
                    <span>Case Dismissed • Error 404</span>
                </motion.div>

                {/* Animated Graphic Centerpiece */}
                <div className="relative flex items-center justify-center mb-8">
                    {/* Big 404 Background Text */}
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 0.12, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="text-[180px] sm:text-[210px] md:text-[300px] font-black leading-none tracking-tighter text-secondary select-none"
                    >
                        404
                    </motion.h1>

                    {/* Floating Scale Icon Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="absolute flex items-center justify-center w-24 h-24 md:mt-8 md:ml-2 mt-8 ml-2 sm:ml-3 sm:w-28 sm:h-28 rounded-3xl bg-surface/90 dark:bg-neutral-900/90 border border-secondary/30 text-secondary shadow-2xl backdrop-blur-xl"
                    >
                        <Scale size={48} className="drop-shadow-[0_0_12px_rgba(234,179,8,0.3)]" />
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
                        Evidence Not Found
                    </h2>
                    <p className="text-text-secondary text-sm sm:text-base max-w-md mx-auto leading-relaxed">
                        The legal record or page you are looking for has been moved, deleted, or never existed in our directory.
                    </p>
                </motion.div>

                {/* Quick Search / Suggestion Box */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-8 w-full max-w-md"
                >
                    <div className="relative flex items-center">
                        <Search size={18} className="absolute left-4 text-text-secondary pointer-events-none" />
                        <input
                            type="text"
                            readOnly
                            placeholder="Looking for a lawyer or legal advice?"
                            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-surface/80 dark:bg-neutral-900/80 border border-border text-sm text-text placeholder:text-text-secondary/60 focus:outline-none cursor-pointer shadow-inner"
                            onClick={() => window.location.href = "/lawyers"}
                        />
                    </div>
                </motion.div>

                {/* Call-to-action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 w-full sm:w-auto"
                >
                    <button
                        onClick={() => window.history.back()}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-border bg-surface hover:bg-surface/80 text-text font-bold text-sm transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
                    >
                        <ArrowLeft size={18} />
                        Go Back
                    </button>

                    <Link
                        href="/"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-secondary text-surface-dark font-extrabold text-sm shadow-lg hover:bg-secondary-light transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <Home size={18} />
                        Return to Homepage
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}