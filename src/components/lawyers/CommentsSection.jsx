"use client";

import React, { useState } from "react";
import { Star, MessageSquare, Send } from "lucide-react";
import toast from "react-hot-toast";

export default function CommentsSection({ lawyer }) {
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

    const handleSubmitComment = (e) => {
        e.preventDefault();
        if (!newComment.trim()) {
            toast.error("Please enter a comment before submitting.");
            return;
        }

        const added = {
            id: Date.now(),
            author: "You (Client)",
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
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-secondary/10 text-secondary border border-secondary/20">
                        <MessageSquare size={22} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-text">Client Reviews</h3>
                        <p className="text-xs text-text-secondary">Feedback from verified legal clients</p>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-surface/80 border border-border/80">
                    <Star size={18} className="text-amber-400 fill-amber-400" />
                    <span className="font-black text-text text-sm">{lawyer?.averageRating || 5.0}</span>
                    <span className="text-xs text-text-secondary">({lawyer?.totalReviews || comments.length})</span>
                </div>
            </div>



            {/* Comment Form */}

            <form onSubmit={handleSubmitComment} className="space-y-4 rounded-2xl border border-border/80 bg-neutral-900/30 p-5">
                <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-text">Write a Review</label>
                    <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className="p-0.5 cursor-pointer"
                            >
                                <Star
                                    size={16}
                                    className={star <= rating ? "text-amber-400 fill-amber-400" : "text-neutral-600"}
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
                    className="w-full px-4 py-3 rounded-xl border border-border/80 bg-background text-text text-sm focus:border-secondary focus:outline-none transition resize-none"
                />

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-secondary text-surface-dark font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-secondary-light transition cursor-pointer"
                    >
                        <Send size={14} /> Post Feedback
                    </button>
                </div>
            </form>


            {/* Comments List */}

            <div className="space-y-4">
                {comments.map((item) => (
                    <div key={item.id} className="p-5 rounded-2xl border border-border/60 bg-surface/40 space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-text text-sm">{item.author}</span>
                            <span className="text-[11px] text-text-secondary">{item.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: item.rating }).map((_, i) => (
                                <Star key={i} size={13} className="text-amber-400 fill-amber-400" />
                            ))}
                        </div>
                        <p className="text-xs text-text-secondary leading-relaxed pt-1">{item.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}