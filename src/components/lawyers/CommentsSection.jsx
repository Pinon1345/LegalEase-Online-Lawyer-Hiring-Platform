"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
    Star,
    MessageSquare,
    Send,
    ShieldAlert,
    Lock,
    UserX,
    ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import { baseURL } from "@/lib/api/baseUrl";
import PaymentAlertModal from "../PaymentAlertModal";

export default function CommentsSection({ lawyer }) {
    const { data: session } = useSession();
    const user = session?.user;

    const [newComment, setNewComment] = useState("");
    const [rating, setRating] = useState(5);
    const [comments, setComments] = useState([]);
    const [isPaidClient, setIsPaidClient] = useState(false);
    const [showPayModal, setShowPayModal] = useState(false);
    const [loading, setLoading] = useState(true);

    // Safeguard lawyer ID resolution
    const lawyerId = lawyer?._id || lawyer?.id;

    const isClient = user?.role === "client";
    const displayRole = user?.role ? user.role.toUpperCase() : "GUEST";

    // 1. Standalone function to load comments (used on initial load and post-submit)
    const loadComments = useCallback(async () => {
        if (!lawyerId) return;

        try {
            const res = await fetch(`${baseURL}/api/comments?lawyerId=${lawyerId}`, {
                cache: "no-store",
            });
            if (!res.ok) {
                setComments([]);
                return;
            }

            const data = await res.json();
            setComments(Array.isArray(data) ? data : []);
        } catch (error) {
            // Silently handle network/server errors so it doesn't throw
            setComments([]);
        } finally {
            setLoading(false);
        }
    }, [lawyerId]);

    // 2. Standalone function to check payment status
    const checkPaymentStatus = useCallback(async () => {
        if (isClient && user?.email && lawyerId) {
            try {
                const res = await fetch(
                    `${baseURL}/api/check-payment?clientEmail=${user.email}&lawyerId=${lawyerId}`,
                    { cache: "no-store" }
                );
                if (!res.ok) throw new Error("Failed to check payment status");

                const data = await res.json();
                setIsPaidClient(data.hasPaid);
            } catch (error) {
                console.error("Error checking payment status:", error);
            }
        }
    }, [isClient, user, lawyerId]);

    // Initial Load Effect (Async wrapper satisfies React Compiler)
    useEffect(() => {
        let isMounted = true;

        const initData = async () => {
            if (isMounted) {
                await Promise.all([loadComments(), checkPaymentStatus()]);
            }
        };

        initData();

        return () => {
            isMounted = false;
        };
    }, [loadComments, checkPaymentStatus]);

    // 3. Handle Submit Comment
    const handleSubmitComment = async (e) => {
        e.preventDefault();

        if (!isClient) {
            toast.error("Please login as a client to post a review.");
            return;
        }

        if (!isPaidClient) {
            setShowPayModal(true);
            return;
        }

        if (!newComment.trim()) {
            toast.error("Please enter a comment before submitting.");
            return;
        }

        try {
            const res = await fetch(`${baseURL}/api/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    lawyerId: lawyerId,
                    lawyerName: lawyer?.lawyerName || lawyer?.name || "",
                    clientEmail: user.email,
                    clientName: user.name || "Anonymous Client",
                    commentText: newComment,
                    rating: Number(rating),
                }),
            });

            if (!res.ok) {
                const errData = await res.json();
                if (res.status === 403) {
                    setShowPayModal(true);
                    return;
                }
                throw new Error(errData.message || "Failed to post comment");
            }

            toast.success("Review posted successfully!");
            setNewComment("");

            // Immediately reload comments and add a fallback timer to counter any server response delays
            await loadComments();
            setTimeout(() => {
                loadComments();
            }, 500);

        } catch (error) {
            toast.error(error.message || "Something went wrong.");
        }
    };

    return (
        <div className="space-y-8 pt-8 border-t border-border/80">
            {/* Payment Alert Modal */}
            <PaymentAlertModal
                isOpen={showPayModal}
                onClose={() => setShowPayModal(false)}
            />

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
                        ({comments?.length || 0})
                    </span>
                </div>
            </div>

            {/* FORM FOR CLIENTS */}
            {isClient ? (
                <form
                    onSubmit={handleSubmitComment}
                    className="space-y-4 rounded-3xl border border-border/80 bg-linear-to-r from-background via-background/90 to-surface p-5 md:p-6 backdrop-blur-xl shadow-xl transition-all duration-300 hover:border-secondary/30 bg-surface/80"
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
                /* Restricted Card for Non-Clients */
                <div className="rounded-3xl border border-rose-500/20 bg-surface/80 dark:bg-neutral-900/80 p-6 md:p-8 backdrop-blur-2xl shadow-2xl space-y-5">
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

                    <div className="flex flex-col sm:flex-row items-center gap-5 py-2">
                        <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-500 shrink-0">
                            <UserX size={28} />
                        </div>
                        <div className="space-y-1 text-center sm:text-left">
                            <h4 className="text-base font-black text-text">
                                Reviews Restricted for {displayRole}s
                            </h4>
                            <p className="text-xs text-text-secondary">
                                Feedback submissions are strictly reserved for verified Client accounts who have hired this lawyer.
                            </p>
                        </div>
                    </div>

                    <div className="w-full py-3 px-4 rounded-2xl bg-background/80 border border-border/80 text-text-secondary font-bold text-xs flex items-center justify-between">
                        <span>Logged in as <strong className="text-text">{displayRole}</strong></span>
                        <Link href="/signup" className="text-secondary flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider">
                            Switch to Client <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            )}

            {/* Comments List */}
            <div className="space-y-4">
                <span className="text-xs font-extrabold uppercase tracking-wider text-text-secondary block">
                    Recent Feedback ({comments?.length || 0})
                </span>

                {loading ? (
                    <p className="text-xs text-text-secondary">Loading reviews...</p>
                ) : !comments || comments.length === 0 ? (
                    <p className="text-xs text-text-secondary italic">No reviews yet. Be the first to review!</p>
                ) : (
                    comments.map((item) => (
                        <div
                            key={item._id || item.id}
                            className="p-5 rounded-2xl border border-border/60 bg-surface/40 space-y-2 hover:border-border transition"
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-text text-sm">
                                    {item.clientName}
                                </span>
                                <span className="text-[11px] text-text-secondary">
                                    {new Date(item.createdAt).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric"
                                    })}
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: item.rating || 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        size={13}
                                        className="text-amber-400 fill-amber-400"
                                    />
                                ))}
                            </div>
                            <p className="text-xs text-text-secondary leading-relaxed pt-1">
                                {item.commentText}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}