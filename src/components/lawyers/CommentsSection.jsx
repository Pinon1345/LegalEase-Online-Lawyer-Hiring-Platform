"use client";

import React, { useState } from "react";
import {
    Star,
    MessageSquare,
    Send,
    ShieldAlert,
    Lock,
    UserX,
    AlertTriangle,
    ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";

export default function CommentsSection({ lawyer }) {
    const { data: session } = useSession();
    const user = session?.user;

    const [newComment, setNewComment] = useState("");
    const [rating, setRating] = useState(5);
    const [comments, setComments] = useState([
        {
            id: 1,
            author: "Sarah Jenkins",
            date: "August 2, 2026",
            rating: 5,
            text: "Exceptionally thorough and prompt consultation! Handled our property acquisition contracts seamlessly.",
        },
        {
            id: 2,
            author: "Michael Roberts",
            date: "July 28, 2026",
            rating: 5,
            text: "Clear communication, deep specialization, and very professional conduct throughout our legal disputes.",
        },
        {
            id: 3,
            author: "Mubashwir Taher Omar",
            date: "August 02, 2026",
            rating: 5,
            text: "Excellent legal guidance and very professional service. The lawyer explained everything clearly and handled my case with great care and expertise.",
        },
    ]);

    const isClient = user?.role === "client";
    const displayRole = user?.role ? user.role.toUpperCase() : "GUEST";

    const handleSubmitComment = (e) => {
        e.preventDefault();
        if (!newComment.trim()) {
            toast.error("Please enter a comment before submitting.");
            return;
        }

        const added = {
            id: Date.now(),
            author: user?.name ? `${user.name} (Client)` : "You (Client)",
            date: "Just now",
            rating: Number(rating),
            text: newComment,
        };

        setComments([added, ...comments]);
        setNewComment("");
        toast.success("Review posted successfully!");
    };

    return (
        <div className="space-y-8 pt-8 border-t border-border/80">
            {/* Header with Rating Summary */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-secondary/10 text-secondary border border-secondary/20">
                        <MessageSquare size={22} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-text">Client Reviews</h3>
                        <p className="text-xs text-text-secondary">
                            Feedback from verified legal clients
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-surface/80 border border-border/80 shadow-sm">
                    <Star size={18} className="text-amber-400 fill-amber-400" />
                    <span className="font-black text-text text-sm">
                        {lawyer?.averageRating || 5.0}
                    </span>
                    <span className="text-xs text-text-secondary">
                        ({lawyer?.totalReviews || comments.length})
                    </span>
                </div>
            </div>

            {/* CONDITIONAL REVIEW FORM OR RESTRICTED CARD */}
            {isClient ? (
                /* Comment Form for Clients */
                <form
                    onSubmit={handleSubmitComment}
                    className="space-y-4 rounded-3xl border border-border/80 bg-neutral-900/40 p-5 md:p-6 backdrop-blur-xl shadow-xl transition-all duration-300 hover:border-secondary/30"
                >
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-bold uppercase tracking-wider text-text flex items-center gap-2">
                            Write a Review
                        </label>
                        <div className="flex items-center gap-1 bg-surface/60 px-3 py-1.5 rounded-full border border-border/60">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className="p-0.5 cursor-pointer hover:scale-110 transition-transform"
                                >
                                    <Star
                                        size={16}
                                        className={
                                            star <= rating
                                                ? "text-amber-400 fill-amber-400"
                                                : "text-neutral-600"
                                        }
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <textarea
                        rows={3}
                        placeholder="Share your legal consultation experience with this attorney..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl border border-border/80 bg-background/80 text-text text-sm focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary transition resize-none shadow-inner"
                    />

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-3 rounded-xl bg-secondary text-surface-dark font-black text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-secondary-light transition-all shadow-md shadow-secondary/10 hover:-translate-y-0.5 cursor-pointer active:translate-y-0"
                        >
                            <Send size={14} /> Post Feedback
                        </button>
                    </div>
                </form>
            ) : (
                /* Restricted Card for Non-Client Roles */
                <div className="rounded-3xl border border-rose-500/20 bg-surface/80 dark:bg-neutral-900/80 p-6 md:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden space-y-5">
                    {/* Background Decorative Glow */}
                    <div className="absolute -top-12 -right-12 w-28 h-28 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-12 -left-12 w-28 h-28 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                    {/* Restricted Access Badge Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-border/80">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
                                <ShieldAlert size={18} />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider text-text">
                                Review Permissions
                            </span>
                        </div>

                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center gap-1.5">
                            <Lock size={12} /> Restricted
                        </span>
                    </div>

                    {/* Main Content Message */}
                    <div className="flex flex-col sm:flex-row items-center gap-5 py-2">
                        <div className="relative shrink-0">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500/20 to-amber-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500 shadow-xl shadow-rose-500/5">
                                <UserX size={28} />
                            </div>
                            <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-neutral-900 border border-border/80 text-amber-400">
                                <AlertTriangle size={10} />
                            </span>
                        </div>

                        <div className="space-y-1 text-center sm:text-left">
                            <h4 className="text-base font-black text-text tracking-tight">
                                Reviews Restricted for {displayRole}s
                            </h4>
                            <p className="text-xs font-semibold text-rose-400 uppercase tracking-wide">
                                <span className="underline decoration-rose-500/40 underline-offset-4">
                                    {displayRole}
                                </span>{" "}
                                ACCOUNTS CAN&apos;T CONSULT OR REVIEW THIS LAWYER
                            </p>
                            <p className="text-xs text-text-secondary pt-1 leading-relaxed">
                                Feedback submissions are strictly reserved for verified Client
                                accounts who have booked consultations with this attorney.
                            </p>
                        </div>
                    </div>

                    {/* Role Status Switch Banner */}
                    <div className="pt-2">
                        <div className="w-full py-3 px-4 rounded-2xl bg-background/80 border border-border/80 text-text-secondary font-bold text-xs flex items-center justify-between gap-2">
                            <span className="text-[11px]">Logged in as <strong className="ml-2 mt-0.5 text-text">{displayRole}</strong></span>
                            <Link
                                href={"/signup"}
                                className="block"
                            >
                                <span className="text-secondary flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider">
                                    Switch to Client <ArrowRight size={14} />
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Comments List (Visible for everyone) */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-text-secondary">
                        Recent Feedback ({comments.length})
                    </span>
                </div>

                {comments.map((item) => (
                    <div
                        key={item.id}
                        className="p-5 rounded-2xl border border-border/60 bg-surface/40 space-y-2 hover:border-border transition"
                    >
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-text text-sm">
                                {item.author}
                            </span>
                            <span className="text-[11px] text-text-secondary">
                                {item.date}
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: item.rating }).map((_, i) => (
                                <Star
                                    key={i}
                                    size={13}
                                    className="text-amber-400 fill-amber-400"
                                />
                            ))}
                        </div>
                        <p className="text-xs text-text-secondary leading-relaxed pt-1">
                            {item.text}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}