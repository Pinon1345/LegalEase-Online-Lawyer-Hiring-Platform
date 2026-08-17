"use client";

import React, { useState, useEffect } from "react";
import { Star, Edit3, Trash2, Save, X, MessageSquare, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import { Modal, Button } from "@heroui/react";
import { useSession } from "@/lib/auth-client";
import { baseURL } from "@/lib/api/baseUrl";
import { getTokenServer } from "@/lib/getTokenServer";

export default function ClientCommentsPage() {
    const { data: session, isPending: sessionLoading } = useSession();
    const user = session?.user;

    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");
    const [editRating, setEditRating] = useState(5);

    // Delete Modal States
    const [deletingId, setDeletingId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Fetch user's comments
    useEffect(() => {
        let isMounted = true;

        const fetchMyComments = async () => {

            const token = await getTokenServer();

            if (!user?.email) {
                if (!sessionLoading && isMounted) setLoading(false);
                return;
            }

            try {
                const res = await fetch(`${baseURL}/api/comments?clientEmail=${user.email}`, {
                    headers: {
                        authorization: `Bearer ${token}`
                    }
                });
                if (!res.ok) throw new Error("Failed to fetch comments");

                const data = await res.json();

                if (isMounted) {
                    setComments(data);
                }
            } catch (error) {
                console.error("Error fetching comments:", error);
            } finally {
                if (isMounted) {
                    setLoading(false);
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
        const token = await getTokenServer();
        if (!editText.trim()) {
            toast.error("Comment cannot be empty");
            return;
        }

        try {
            const res = await fetch(`${baseURL}/api/comments/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ commentText: editText, rating: editRating }),
            });

            if (!res.ok) throw new Error("Failed to update");

            toast.success("Comment updated successfully!");

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

    // Open & Close Delete Modal
    const handleOpenDeleteModal = (id) => {
        setDeletingId(id);
    };

    const handleCloseDeleteModal = () => {
        if (isDeleting) return;
        setDeletingId(null);
    };

    // Confirm DELETE Comment
    const handleConfirmDelete = async () => {
        const token = await getTokenServer();
        if (!deletingId) return;

        setIsDeleting(true);
        try {
            const res = await fetch(`${baseURL}/api/comments/${deletingId}`, {
                method: "DELETE",
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error("Failed to delete comment");

            toast.success("Comment deleted successfully!");
            setComments((prev) => prev.filter((item) => item._id !== deletingId));
            setDeletingId(null);
        } catch (error) {
            toast.error(error.message || "Failed to delete comment");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            {/* Header */}
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
                    <p className="text-sm text-text-secondary">
                        You haven&apos;t posted any reviews yet.
                    </p>
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
                                        Lawyer:{" "}
                                        <span className="text-secondary">
                                            {item.lawyerName || "Legal Advocate"}
                                        </span>
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
                                            onClick={() => handleOpenDeleteModal(item._id)}
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
                                        <h2 className="font-bold text-purple-600 dark:text-purple-400">
                                            The Comment:
                                        </h2>
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

            {/* HeroUI DELETE CONFIRMATION MODAL */}
            {Boolean(deletingId) && (
                <Modal isOpen={Boolean(deletingId)} onClose={handleCloseDeleteModal}>
                    <Modal.Backdrop>
                        <Modal.Container>
                            <Modal.Dialog className="bg-surface border border-border/80 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5">
                                <Modal.CloseTrigger
                                    onClick={handleCloseDeleteModal}
                                    className="absolute top-4 right-4 text-text-secondary hover:text-text cursor-pointer p-1"
                                >
                                    <X size={18} />
                                </Modal.CloseTrigger>

                                <Modal.Header className="flex items-center gap-3 pb-2 border-b border-border/60">
                                    <div className="p-2.5 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
                                        <AlertTriangle size={22} />
                                    </div>
                                    <div>
                                        <Modal.Heading className="text-lg font-black text-text">
                                            Confirm Deletion
                                        </Modal.Heading>
                                        <p className="text-xs text-text-secondary">
                                            This action cannot be undone.
                                        </p>
                                    </div>
                                </Modal.Header>

                                <Modal.Body className="py-2">
                                    <p className="text-sm text-text-secondary leading-relaxed">
                                        Are you sure you want to <span className="font-bold text-red-600 ml-1 mr-2 pt-1">DELETE</span>this comment? Once deleted,
                                        it will be permanently removed from the <span className="font-bold">Lawyer&apos;s Profile</span>.
                                    </p>
                                </Modal.Body>

                                <Modal.Footer className="flex items-center justify-end gap-3 pt-4 border-t border-border/60">
                                    <Button
                                        onClick={handleCloseDeleteModal}
                                        disabled={isDeleting}
                                        className="px-4 py-2.5 rounded-xl bg-neutral-800 text-text-secondary text-xs font-bold hover:bg-neutral-700 transition cursor-pointer"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleConfirmDelete}
                                        disabled={isDeleting}
                                        className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
                                    >
                                        <Trash2 size={14} />
                                        {isDeleting ? "Deleting..." : "Confirm Delete"}
                                    </Button>
                                </Modal.Footer>
                            </Modal.Dialog>
                        </Modal.Container>
                    </Modal.Backdrop>
                </Modal>
            )}
        </div>
    );
}