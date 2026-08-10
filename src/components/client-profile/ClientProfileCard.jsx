"use client";

import React from 'react';
import { Mail, Phone, FileText, Sparkles, ShieldCheck, Edit3, Trash2 } from 'lucide-react';
import Image from 'next/image';

export default function ClientProfileCard({ profile, onEdit, onDeleteClick }) {
    const fullName = `${profile.firstName} ${profile.middleName ? profile.middleName + ' ' : ''}${profile.lastName}`.trim();

    return (
        <div className="bg-surface/80 dark:bg-neutral-900/80 border border-secondary/30 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6">

            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-bold">
                    <ShieldCheck size={14} /> Active Client Profile
                </span>
                <span className="text-[11px] text-text-secondary font-mono">ID: CLT-8820</span>
            </div>

            {/* Profile Picture & Name */}
            <div className="flex flex-col items-center text-center space-y-3">
                <div className="relative">
                    <Image
                        src={profile.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'}
                        alt={fullName || 'Client'}
                        width={800}
                        height={800}
                        className="w-28 h-28 rounded-3xl object-cover border-2 border-secondary shadow-xl"
                    />
                    <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-xl bg-secondary text-surface-dark flex items-center justify-center shadow-md">
                        <Sparkles size={16} />
                    </div>
                </div>

                <div>
                    <h3 className="text-xl font-black text-text">
                        {fullName || 'Client Name Not Set'}
                    </h3>
                    <p className="text-xs text-secondary font-semibold mt-0.5">Verified Client</p>
                </div>
            </div>

            {/* Info Grid */}
            <div className="p-4 rounded-2xl bg-neutral-100/60 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700/50 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                    <span className="text-text-secondary flex items-center gap-2">
                        <Mail size={14} className="text-secondary" /> Email:
                    </span>
                    <span className="font-bold text-text truncate max-w-[180px]">
                        {profile.email || 'Not provided'}
                    </span>
                </div>

                <div className="h-px bg-neutral-200 dark:bg-neutral-700/50" />

                <div className="flex items-center justify-between">
                    <span className="text-text-secondary flex items-center gap-2">
                        <Phone size={14} className="text-secondary" /> Phone:
                    </span>
                    <span className="font-bold text-text">
                        {profile.phone || 'Not provided'}
                    </span>
                </div>

                <div className="h-px bg-neutral-200 dark:bg-neutral-700/50" />

                <div className="space-y-1 pt-1">
                    <span className="text-text-secondary font-bold flex items-center gap-2">
                        <FileText size={14} className="text-secondary" /> Bio Summary:
                    </span>
                    <p className="text-text-secondary text-xs leading-relaxed italic line-clamp-4 pl-1">
                        &quot;{profile.bio || 'No bio overview provided yet.'}&quot;
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                    type="button"
                    onClick={onEdit}
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/30 text-xs font-bold transition-all cursor-pointer"
                >
                    <Edit3 size={15} /> Update
                </button>

                <button
                    type="button"
                    onClick={onDeleteClick}
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/30 text-xs font-bold transition-all cursor-pointer"
                >
                    <Trash2 size={15} /> Delete
                </button>
            </div>

        </div>
    );
}