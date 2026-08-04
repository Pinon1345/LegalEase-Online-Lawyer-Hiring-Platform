"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    Scale,
    ShieldAlert,
    ShieldCheck,
    CreditCard,
    Edit3,
    UploadCloud,
    X,
    Star,
    MapPin,
    Briefcase,
    Globe,
    CheckCircle2,
    Clock,
    DollarSign,
    Loader2
} from "lucide-react";

// ImgBB API Key handling (Set NEXT_PUBLIC_IMGBB_API_KEY in your .env.local)

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY || "YOUR_IMGBB_API_KEY";

// Specialization options for Lawyer profile form

const SPECIALIZATION_OPTIONS = [
    "Criminal Law",
    "Corporate Law",
    "Family Law",
    "Intellectual Property",
    "Real Estate Law",
    "Civil Litigation",
    "Tax Law",
    "Immigration Law",
];




export default function LawyerProfileForm({
    profile,
    user,
    onSaveProfile,
    onVerifyPayment,
}) {

    const isVerified = user?.isVerified || profile?.isVerified || false;
    const [isEditing, setIsEditing] = useState(!profile && isVerified);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state initialized with exact backend structure

    const [formData, setFormData] = useState({
        lawyerName: profile?.lawyerName || user?.name || "",
        lawyerImage: profile?.lawyerImage || user?.image || "",
        specialization: profile?.specialization || SPECIALIZATION_OPTIONS[0],
        hourlyRate: profile?.hourlyRate || 150,
        averageRating: profile?.averageRating || 5.0,
        totalReviews: profile?.totalReviews || 0,
        yearsExperience: profile?.yearsExperience || 1,
        languages: profile?.languages ? profile.languages.join(", ") : "English",
        location: profile?.location || "",
        availabilityStatus: profile?.availabilityStatus || "available",
        bio: profile?.bio || "",
    });




    // Handle ImgBB Image Upload

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        const body = new FormData();
        body.append("image", file);

        try {
            const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
                method: "POST",
                body,
            });
            const data = await res.json();
            if (data.success) {
                setFormData((prev) => ({ ...prev, lawyerImage: data.data.url }));
            } else {
                alert("Image upload failed. Please try again.");
            }
        } catch (err) {
            console.error("ImgBB upload error:", err);
            alert("Error uploading image to ImgBB.");
        } finally {
            setUploadingImage(false);
        }
    };



    // Form Submission

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const addData = {
            lawyerImage: formData.lawyerImage,
            lawyerName: formData.lawyerName,
            specialization: formData.specialization,
            hourlyRate: Number(formData.hourlyRate),
            averageRating: Number(formData.averageRating),
            totalReviews: Number(formData.totalReviews),
            yearsExperience: Number(formData.yearsExperience),
            languages: formData.languages.split(",").map((l) => l.trim()).filter(Boolean),
            location: formData.location,
            isVerified: true,
            availabilityStatus: formData.availabilityStatus,
            bio: formData.bio,
            createdAt: profile?.createdAt || new Date(),
        };

        try {
            await onSaveProfile?.(addData);
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to save legal profile", error);
        } finally {
            setIsSubmitting(false);
        }
    };


    // 1. UNVERIFIED STATE CARD

    if (isVerified) {
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
                    Please pay the one-time verification publishing fee to activate your professional listing on <span className="text-secondary font-bold">LegalEase</span> and start receiving client requests.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                        onClick={onVerifyPayment}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-secondary text-surface-dark font-extrabold text-base shadow-xl hover:bg-secondary-light transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <CreditCard size={20} />
                        Pay One-Time Verification Fee
                    </button>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto my-6 space-y-8">

            {/* 2. EXISTING PROFILE VIEW CARD */}

            {profile && !isEditing && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative overflow-hidden rounded-3xl border border-secondary/20 bg-surface dark:bg-neutral-900/90 shadow-2xl backdrop-blur-xl"
                >
                    <div className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                            {/* Profile Image */}
                            <div className="relative h-32 w-32 shrink-0 rounded-2xl overflow-hidden border-2 border-secondary/40 shadow-md">
                                {profile.lawyerImage ? (
                                    <Image
                                        src={profile.lawyerImage}
                                        alt={profile.lawyerName}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                ) : (
                                    <div className="h-full w-full bg-secondary/10 flex items-center justify-center text-secondary font-bold text-3xl">
                                        {profile.lawyerName?.charAt(0)}
                                    </div>
                                )}
                            </div>

                            {/* Details */}

                            <div className="flex-1 space-y-3">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h2 className="text-2xl font-extrabold text-text">
                                                {profile.lawyerName}
                                            </h2>
                                            <ShieldCheck size={20} className="text-secondary" />
                                        </div>
                                        <p className="text-secondary font-semibold text-sm">
                                            {profile.specialization}
                                        </p>
                                    </div>

                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${profile.availabilityStatus === "available"
                                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30"
                                            : "bg-amber-500/10 text-amber-500 border border-amber-500/30"
                                            }`}
                                    >
                                        {profile.availabilityStatus}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-text-secondary pt-2">
                                    <div className="flex items-center gap-1.5">
                                        <DollarSign size={15} className="text-secondary" />
                                        <span><strong className="text-text">${profile.hourlyRate}</strong> / hr</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Briefcase size={15} className="text-secondary" />
                                        <span><strong className="text-text">{profile.yearsExperience}</strong> Yrs Exp.</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Star size={15} className="text-amber-400 fill-amber-400" />
                                        <span><strong className="text-text">{profile.averageRating}</strong> ({profile.totalReviews})</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <MapPin size={15} className="text-secondary" />
                                        <span className="truncate"><strong className="text-text">{profile.location || "N/A"}</strong></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hyphen-style separator border with center edit button */}

                    <div className="relative my-4 border-t-2 border-dashed border-secondary/30 flex justify-center items-center">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="absolute -top-5 px-6 py-2 rounded-full bg-secondary text-surface-dark font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg hover:bg-secondary-light transition-all transform hover:scale-105"
                        >
                            <Edit3 size={14} />
                            Edit Legal Profile
                        </button>
                    </div>
                    <div className="h-6" />
                </motion.div>
            )}


            {/* 3. PROFILE CREATION / EDITING MODAL OR FORM */}

            <AnimatePresence>
                {(isEditing || !profile) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="rounded-3xl border border-border/80 bg-surface dark:bg-neutral-900/90 p-6 md:p-10 shadow-2xl backdrop-blur-xl"
                    >
                        <div className="flex items-center justify-between pb-6 mb-6 border-b border-border">
                            <div>
                                <h3 className="text-xl font-extrabold text-text">
                                    {profile ? "Update Legal Profile" : "Create Legal Profile"}
                                </h3>
                                <p className="text-xs text-text-secondary">
                                    Fill out your details below to appear on the public directory.
                                </p>
                            </div>
                            {profile && (
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="p-2 rounded-xl text-text-secondary hover:bg-surface/80"
                                >
                                    <X size={20} />
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Image Upload Area */}

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2 ">
                                    Profile Picture (ImgBB)
                                </label>
                                <div className="flex items-center gap-4 mb-7">
                                    <div className="relative h-20 w-20 rounded-2xl overflow-hidden border border-border bg-surface shrink-0 flex items-center justify-center">
                                        {formData.lawyerImage ? (
                                            <Image
                                                src={formData.lawyerImage}
                                                alt="Preview"
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />
                                        ) : (
                                            <Scale size={28} className="text-text-secondary/40" />
                                        )}
                                        {uploadingImage && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                <Loader2 size={20} className="animate-spin text-white" />
                                            </div>
                                        )}
                                    </div>
                                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-secondary/40 bg-secondary/10 text-secondary font-bold text-xs hover:bg-secondary/20 transition">
                                        <UploadCloud size={16} />
                                        Upload New Photo
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            </div>



                            {/* Form Fields Grid */}


                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <div>
                                    <label className="block text-md font-bold text-text mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.lawyerName}
                                        onChange={(e) => setFormData({ ...formData, lawyerName: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text text-sm focus:border-secondary focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-md font-bold text-text mb-2">Specialization</label>
                                    <select
                                        value={formData.specialization}
                                        onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text text-sm focus:border-secondary focus:outline-none"
                                    >
                                        {SPECIALIZATION_OPTIONS.map((spec) => (
                                            <option key={spec} value={spec}>{spec}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-md font-bold text-text mb-2">Hourly Rate ($USD)</label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        value={formData.hourlyRate}
                                        onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text text-sm focus:border-secondary focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-md font-bold text-text mb-2">Years of Experience</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={formData.yearsExperience}
                                        onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text text-sm focus:border-secondary focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-md font-bold text-text mb-2">Location</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. New York, USA"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text text-sm focus:border-secondary focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-md font-bold text-text mb-2">Availability Status</label>
                                    <select
                                        value={formData.availabilityStatus}
                                        onChange={(e) => setFormData({ ...formData, availabilityStatus: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text text-sm focus:border-secondary focus:outline-none"
                                    >
                                        <option value="available">Available</option>
                                        <option value="busy">Busy</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-md font-bold text-text mb-2">Languages (comma separated)</label>
                                <input
                                    type="text"
                                    placeholder="English, Spanish, French"
                                    value={formData.languages}
                                    onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text text-sm focus:border-secondary focus:outline-none mb-3"
                                />
                            </div>

                            {/* Submit & Cancel Buttons */}

                            <div className="flex justify-end gap-3 pt-8 border-t border-border">
                                {profile && (
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="px-5 py-2.5 rounded-xl border border-border text-text-secondary cursor-pointer text-sm font-bold hover:bg-surface/80 transition"
                                    >
                                        Cancel
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    disabled={isSubmitting || uploadingImage}
                                    className="inline-flex items-center gap-2 cursor-pointer px-6 py-2.5 rounded-xl bg-secondary text-surface-dark font-extrabold text-sm shadow-md hover:bg-secondary-light transition disabled:opacity-50"
                                >
                                    {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                                    {profile ? "Save Changes" : "Publish Profile"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}