"use client";

import React from "react";
import { motion } from "framer-motion";
import { Scale } from "lucide-react";

export default function GlobalLoader({ text = "Loading LegalEase..." }) {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 dark:bg-neutral-950/85 backdrop-blur-md transition-all duration-300">
            {/* Ambient Ambient Glow Backdrop */}
            <div className="absolute w-72 h-72 rounded-full bg-secondary/15 blur-3xl pointer-events-none animate-pulse" />

            <div className="relative flex flex-col items-center justify-center gap-6">
                {/* Spinner Graphic Container */}
                <div className="relative flex items-center justify-center w-28 h-28">

                    {/* Outer Glowing Pulsing Ring */}
                    <motion.div
                        className="absolute inset-0 rounded-full border-2 border-secondary/20"
                        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.8, 0.3] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    />

                    {/* Outer Counter-Clockwise Rotating Arc */}
                    <motion.div
                        className="absolute inset-0 rounded-full border-2 border-transparent border-t-secondary/60 border-l-secondary/60"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Inner Clockwise Glowing Gradient Ring */}
                    <motion.div
                        className="absolute inset-2 rounded-full border-4 border-transparent border-t-secondary border-r-secondary shadow-[0_0_15px_rgba(234,179,8,0.3)]"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Center Icon with Pulse */}
                    <motion.div
                        className="z-10 flex items-center justify-center w-12 h-12 rounded-2xl bg-secondary/10 border border-secondary/30 text-secondary shadow-lg backdrop-blur-sm"
                        animate={{ scale: [0.92, 1.05, 0.92] }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <Scale size={22} className="text-secondary" />
                    </motion.div>
                </div>

                {/* Text & Dynamic Loading Dots */}
                <div className="flex flex-col items-center gap-1.5">
                    <motion.h3
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-base font-extrabold tracking-wide text-text flex items-center gap-1"
                    >
                        {text}
                    </motion.h3>

                    {/* Subtle Animated Bar Indicator */}
                    <div className="w-32 h-1 overflow-hidden rounded-full bg-secondary/10 border border-secondary/20 relative">
                        <motion.div
                            className="h-full bg-gradient-to-r from-transparent via-secondary to-transparent rounded-full"
                            animate={{ x: ["-100%", "100%"] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}