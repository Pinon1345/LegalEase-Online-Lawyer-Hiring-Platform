"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
    ShieldCheck,
    Edit3,
    Star,
    MapPin,
    Briefcase,
    DollarSign,
    Loader2,
    Trash2,
} from "lucide-react";
import DeleteConfirmationModal from "../DeleteConfirmationModal";

export default function ProfileCardView({
    myProfile,
    onEdit,
    onOpenDeleteModal,
    isDeleteModalOpen,
    onCloseDeleteModal,
    onConfirmDelete,
    isDeleting,
}) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative overflow-hidden rounded-3xl border border-secondary/20 bg-surface dark:bg-neutral-900/90 shadow-2xl backdrop-blur-xl"
        >
            <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                    {/* Profile Image */}
                    <div className="relative h-32 w-32 shrink-0 rounded-2xl overflow-hidden border-2 border-secondary/40 shadow-md">
                        {myProfile.lawyerImage ? (
                            <Image
                                src={myProfile.lawyerImage}
                                alt={myProfile.lawyerName || "Lawyer Profile"}
                                fill
                                className="object-cover"
                                unoptimized
                            />
                        ) : (
                            <div className="h-full w-full bg-secondary/10 flex items-center justify-center text-secondary font-bold text-3xl">
                                {myProfile.lawyerName?.charAt(0)}
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-2xl font-extrabold text-text">
                                        {myProfile.lawyerName}
                                    </h2>
                                    <ShieldCheck size={20} className="text-secondary" />
                                </div>
                                <p className="text-secondary font-semibold text-sm">
                                    {myProfile.specialization}
                                </p>
                            </div>

                            <span
                                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${myProfile.availabilityStatus === "available"
                                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30"
                                        : "bg-amber-500/10 text-amber-500 border border-amber-500/30"
                                    }`}
                            >
                                {myProfile.availabilityStatus}
                            </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-text-secondary pt-2">
                            <div className="flex items-center gap-1.5">
                                <DollarSign size={15} className="text-secondary" />
                                <span>
                                    <strong className="text-text">${myProfile.hourlyRate}</strong> / hr
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Briefcase size={15} className="text-secondary" />
                                <span>
                                    <strong className="text-text">{myProfile.yearsExperience}</strong> Yrs Exp.
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Star size={15} className="text-amber-400 fill-amber-400" />
                                <span>
                                    <strong className="text-text">{myProfile.averageRating}</strong> ({myProfile.totalReviews})
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <MapPin size={15} className="text-secondary" />
                                <span className="truncate">
                                    <strong className="text-text">{myProfile.location || "N/A"}</strong>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit & Delete Button Divider */}
            <div className="relative my-4 border-t-2 border-dashed border-secondary/30 flex justify-center items-center gap-3">
                <button
                    onClick={onEdit}
                    className="absolute -top-5 px-6 py-2 rounded-full bg-secondary text-surface-dark font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg hover:bg-secondary-light transition-all transform hover:scale-105 cursor-pointer"
                >
                    <Edit3 size={14} />
                    Edit Legal Profile
                </button>

                <button
                    type="button"
                    onClick={onOpenDeleteModal}
                    disabled={isDeleting}
                    className="absolute -top-5 right-6 px-4 py-2 rounded-full bg-rose-600 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg hover:bg-rose-700 transition-all transform hover:scale-105 cursor-pointer disabled:opacity-50"
                >
                    {isDeleting ? (
                        <Loader2 size={14} className="animate-spin" />
                    ) : (
                        <Trash2 size={14} />
                    )}
                    Delete
                </button>

                {/* Confirmation Modal */}
                <DeleteConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={onCloseDeleteModal}
                    onConfirm={onConfirmDelete}
                    isDeleting={isDeleting}
                />
            </div>
            <div className="h-6" />
        </motion.div>
    );
}