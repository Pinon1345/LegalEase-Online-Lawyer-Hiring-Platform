"use client";

import React, { useState, useEffect } from "react";
import { Star, Edit3, Trash2, Save, X, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";
import { useSession } from "@/lib/auth-client";
import { baseURL } from "@/lib/api/baseUrl";

export default function ClientCommentsPage() {
    const { data: session, isPending: sessionLoading } = useSession();
    const user = session?.user;

    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");
    const [editRating, setEditRating] = useState(5);

    // Fetch user's comments
    useEffect(() => {
        let isMounted = true;

        const fetchMyComments = async () => {
            if (!user?.email) {
                if (!sessionLoading && isMounted) setLoading(false);
                return;
            }

            try {
                const res = await fetch(`${baseURL}/api/comments?clientEmail=${user.email}`);
                if (!res.ok) throw new Error("Failed to fetch comments");

                const data = await res.json();

                if (isMounted) {
                    setComments(data);
                }
            } catch (error) {
                console.error("Error fetching comments:", error);
            } finally {
                if (isMounted) {
                    setLoading(false); // Stop loading indicator
                }
            }
        };

        fetchMyComments();

        return () => {
            isMounted = false;
        };
    }, [user?.email, sessionLoading]);

    // Start Editing
    const handleStartEdit = (comment) => {
        setEditingId(comment._id);
        setEditText(comment.commentText);
        setEditRating(comment.rating);
    };

    // Cancel Editing
    const handleCancelEdit = () => {
        setEditingId(null);
        setEditText("");
        setEditRating(5);
    };

    // PATCH Update Comment
    const handleUpdateComment = async (id) => {
        if (!editText.trim()) {
            toast.error("Comment cannot be empty");
            return;
        }

        try {
            const res = await fetch(`${baseURL}/api/comments/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ commentText: editText, rating: editRating }),
            });

            if (!res.ok) throw new Error("Failed to update");

            toast.success("Comment updated successfully!");

            // Update comments state locally
            setComments((prev) =>
                prev.map((item) =>
                    item._id === id
                        ? { ...item, commentText: editText, rating: editRating }
                        : item
                )
            );

            setEditingId(null);
        } catch (error) {
            toast.error(error.message);
        }
    };

    // DELETE Comment
    const handleDeleteComment = async (id) => {
        if (!confirm("Are you sure you want to delete this comment?")) return;

        try {
            const res = await fetch(`${baseURL}/api/comments/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Failed to delete");

            toast.success("Comment deleted successfully!");
            setComments((prev) => prev.filter((item) => item._id !== id));
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <div className="flex items-center gap-3 border-b border-border/80 pb-4">
                <div className="p-3 rounded-2xl bg-secondary/10 text-secondary border border-secondary/20">
                    <MessageSquare size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-text">My Posted Reviews</h2>
                    <p className="text-xs text-text-secondary">
                        Manage, edit, or delete feedback you submitted to lawyers
                    </p>
                </div>
            </div>

            {loading ? (
                <p className="text-sm text-text-secondary">Loading your feedback...</p>
            ) : comments.length === 0 ? (
                <div className="p-8 text-center rounded-3xl border border-border/80 bg-surface/40">
                    <p className="text-sm text-text-secondary">You haven&apos;t posted any reviews yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {comments.map((item) => (
                        <div
                            key={item._id}
                            className="p-6 rounded-3xl border border-border/80 bg-surface/60 space-y-4 shadow-lg transition"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-bold text-text text-base">
                                        Lawyer: <span className="text-secondary">{item.lawyerName || "Legal Advocate"}</span>
                                    </h4>
                                    <span className="text-[11px] text-text-secondary">
                                        Posted on: {new Date(item.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                                {/* EDIT / DELETE ACTIONS */}
                                {editingId !== item._id && (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleStartEdit(item)}
                                            className="p-2 rounded-xl bg-secondary/10 text-secondary hover:bg-secondary hover:text-surface-dark transition"
                                            title="Edit"
                                        >
                                            <Edit3 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteComment(item._id)}
                                            className="p-2 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* EDIT MODE FORM */}
                            {editingId === item._id ? (
                                <div className="space-y-3 pt-2">
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setEditRating(star)}
                                                className="p-0.5"
                                            >
                                                <Star
                                                    size={16}
                                                    className={
                                                        star <= editRating
                                                            ? "text-amber-400 fill-amber-400"
                                                            : "text-neutral-600"
                                                    }
                                                />
                                            </button>
                                        ))}
                                    </div>

                                    <textarea
                                        rows={3}
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                        className="w-full px-4 py-3 rounded-2xl border border-secondary/50 bg-background text-text text-sm focus:outline-none"
                                    />

                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={handleCancelEdit}
                                            className="px-4 py-2 rounded-xl bg-neutral-800 text-text-secondary text-xs font-bold flex items-center gap-1 hover:bg-neutral-700"
                                        >
                                            <X size={14} /> Cancel
                                        </button>
                                        <button
                                            onClick={() => handleUpdateComment(item._id)}
                                            className="px-4 py-2 rounded-xl bg-secondary text-surface-dark text-xs font-bold flex items-center gap-1 hover:bg-secondary-light"
                                        >
                                            <Save size={14} /> Save Changes
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                /* DISPLAY MODE */
                                <div className="space-y-2">
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: item.rating || 5 }).map((_, i) => (
                                            <Star
                                                key={i}
                                                size={14}
                                                className="text-amber-400 fill-amber-400"
                                            />
                                        ))}
                                    </div>
                                    <div className="flex flex-col md:flex-col lg:flex-row items-center gap-2 mt-4">
                                        <h2 className="font-bold text-purple-600 dark:text-purple-400">The Comment:</h2>
                                        <p className="text-sm text-text-secondary leading-relaxed">
                                            {item.commentText}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}