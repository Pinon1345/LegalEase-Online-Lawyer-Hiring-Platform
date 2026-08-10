"use client";

import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function DeleteConfirmationModal({ isOpen, onClose, onConfirm }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-surface dark:bg-neutral-900 border border-rose-500/30 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative space-y-6">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-xl text-text-secondary hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
                >
                    <X size={18} />
                </button>

                {/* Warning Icon */}
                <div className="flex items-center justify-center">
                    <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500">
                        <AlertTriangle size={36} />
                    </div>
                </div>

                <div className="text-center space-y-2">
                    <h3 className="text-xl font-black text-text">Reset Profile Information?</h3>
                    <p className="text-xs text-text-secondary leading-relaxed">
                        Are you sure you want to clear your profile details? This action will reset your saved bio, image, and contact details.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="py-3 px-4 rounded-xl border border-neutral-300 dark:border-neutral-700 text-text font-bold text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="py-3 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-1.5"
                    >
                        <Trash2 size={15} /> Yes, Reset
                    </button>
                </div>

            </div>
        </div>
    );
}