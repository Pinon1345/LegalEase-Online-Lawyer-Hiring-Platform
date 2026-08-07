"use client";
import React from "react";
import { motion } from "framer-motion";
import { ShieldAlert, CreditCard } from "lucide-react";

export default function UnverifiedState({ onVerifyPayment }) {

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto my-8 overflow-hidden rounded-3xl border border-secondary/30 bg-surface/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-2xl p-8 md:p-12 text-center relative"
        >
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />
            <div className="flex justify-center mb-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-secondary/10 border border-secondary/30 text-secondary shadow-lg">
                    <ShieldAlert size={42} />
                </div>
            </div>

            <h2 className="text-3xl font-black text-text tracking-tight mb-3">
                Verification Required
            </h2>
            <p className="text-text-secondary text-base max-w-lg mx-auto leading-relaxed mb-8">
                Please pay the one-time verification publishing fee of{" "}
                <span className="text-secondary font-black">$100.00</span> to activate your
                professional listing on{" "}
                <span className="text-secondary font-bold">LegalEase</span> and start
                receiving client requests.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                    onClick={onVerifyPayment}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-secondary text-surface-dark font-extrabold text-base shadow-xl hover:bg-secondary-light transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                    <CreditCard size={20} />
                    Pay One-Time Verification Fee ($100.00)
                </button>
            </div>
        </motion.div>
    );
}