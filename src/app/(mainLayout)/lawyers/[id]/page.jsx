import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
    ShieldCheck,
    Star,
    MapPin,
    Briefcase,
    Globe,
    Calendar,
    ChevronLeft,
    CheckCircle2,
    Award,
    Scale,
} from "lucide-react";

import { baseURL } from "@/lib/api/baseUrl";
import BookingWidget from "@/components/lawyers/BookingWidget";
import CommentsSection from "@/components/lawyers/CommentsSection";

// Fetch single lawyer data from backend API
const fetchLawyer = async (id) => {
    try {
        const res = await fetch(`${baseURL}/api/single-lawyers/${id}`, {
            cache: "no-store",
        });
        if (!res.ok) return null;
        return await res.json();
    } catch (error) {
        console.error("Error fetching lawyer details:", error);
        return null;
    }
};

export default async function LawyerDetailsPage({ params }) {
    const { id } = await params;
    const lawyer = await fetchLawyer(id);

    if (!lawyer || lawyer.error) {
        notFound();
    }

    // Format join date string
    const joinedDate = lawyer?.createdAt
        ? new Date(lawyer.createdAt.$date || lawyer.createdAt).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
        })
        : "August 2026";

    return (
        <div className="min-h-screen bg-background text-text px-4 py-8 md:px-8 lg:px-12 max-w-7xl mx-auto space-y-10">
            {/* Back Navigation Bar */}
            <div className="flex items-center justify-between">
                <Link
                    href="/lawyers"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-border/80 bg-surface/50 text-text-secondary text-xs font-bold hover:text-secondary hover:border-secondary/40 transition-all duration-200"
                >
                    <ChevronLeft size={16} /> Back to Directory
                </Link>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-bold uppercase tracking-wider">
                    <ShieldCheck size={14} /> Verified Legal Advocate
                </div>
            </div>

            {/* Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: Lawyer Visuals & Complete Bio Details */}
                <div className="lg:col-span-7 xl:col-span-8 space-y-8">
                    {/* Big Visual Profile Header */}
                    <div className="relative overflow-hidden rounded-3xl border border-secondary/20 bg-surface dark:bg-neutral-900/90 shadow-2xl backdrop-blur-xl p-6 md:p-8">
                        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                            {/* High-Resolution Big Shape Photo */}
                            <div className="relative h-56 w-56 md:h-64 md:w-64 shrink-0 rounded-3xl overflow-hidden border-2 border-secondary/40 shadow-2xl">
                                {lawyer?.lawyerImage ? (
                                    <Image
                                        src={lawyer.lawyerImage}
                                        alt={lawyer.lawyerName || "Lawyer Profile Photo"}
                                        fill
                                        className="object-cover hover:scale-105 transition-transform duration-500"
                                        unoptimized
                                    />
                                ) : (
                                    <div className="h-full w-full bg-secondary/10 flex items-center justify-center text-secondary font-black text-5xl">
                                        {lawyer?.lawyerName?.charAt(0)}
                                    </div>
                                )}
                            </div>

                            {/* Essential Details */}
                            <div className="flex-1 space-y-4 text-center md:text-left">
                                <div>
                                    <div className="flex items-center justify-center md:justify-start gap-2">
                                        <h1 className="text-3xl md:text-4xl font-black text-text tracking-tight">
                                            {lawyer?.lawyerName}
                                        </h1>
                                        <ShieldCheck size={26} className="text-secondary shrink-0" />
                                    </div>
                                    <p className="text-secondary font-bold text-base mt-1">
                                        {lawyer?.specialization}
                                    </p>
                                </div>

                                {/* Quick Highlights Badge Bar */}
                                <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                                    <div className="p-3 rounded-2xl bg-neutral-900/40 border border-border/80 flex items-center gap-2">
                                        <Briefcase size={16} className="text-secondary shrink-0" />
                                        <div>
                                            <span className="text-text-secondary block text-[10px]">Experience</span>
                                            <strong className="text-text">{lawyer?.yearsExperience} Years</strong>
                                        </div>
                                    </div>

                                    <div className="p-3 rounded-2xl bg-neutral-900/40 border border-border/80 flex items-center gap-2">
                                        <Star size={16} className="text-amber-400 fill-amber-400 shrink-0" />
                                        <div>
                                            <span className="text-text-secondary block text-[10px]">Rating</span>
                                            <strong className="text-text">{lawyer?.averageRating || 5.0} ({lawyer?.totalReviews || 0})</strong>
                                        </div>
                                    </div>

                                    <div className="p-3 rounded-2xl bg-neutral-900/40 border border-border/80 flex items-center gap-2">
                                        <MapPin size={16} className="text-secondary shrink-0" />
                                        <div className="truncate">
                                            <span className="text-text-secondary block text-[10px]">Location</span>
                                            <strong className="text-text truncate block">{lawyer?.location || "N/A"}</strong>
                                        </div>
                                    </div>

                                    <div className="p-3 rounded-2xl bg-neutral-900/40 border border-border/80 flex items-center gap-2">
                                        <Calendar size={16} className="text-secondary shrink-0" />
                                        <div>
                                            <span className="text-text-secondary block text-[10px]">Joined</span>
                                            <strong className="text-text">{joinedDate}</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bio / Professional Summary */}
                    <div className="rounded-3xl border border-border/80 bg-surface/60 dark:bg-neutral-900/60 p-6 md:p-8 space-y-4 shadow-xl">
                        <div className="flex items-center gap-2 text-text font-black text-xl">
                            <Scale size={20} className="text-secondary" />
                            <h2>Professional Bio & Background</h2>
                        </div>
                        <p className="text-text-secondary text-sm md:text-base leading-relaxed">
                            {lawyer?.bio ||
                                `${lawyer?.lawyerName} is a highly accomplished ${lawyer?.specialization} specialist with over ${lawyer?.yearsExperience} years of experience representing corporate and individual clients. Dedicated to offering high-caliber legal counsel and courtroom representation.`}
                        </p>
                    </div>

                    {/* Multilingual Expertise & Key Strengths */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="rounded-3xl border border-border/80 bg-surface/60 p-6 space-y-3">
                            <div className="flex items-center gap-2 font-bold text-text text-sm">
                                <Globe size={18} className="text-secondary" /> Spoken Languages
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {(Array.isArray(lawyer?.languages) ? lawyer.languages : ["English"]).map((lang) => (
                                    <span
                                        key={lang}
                                        className="px-3 py-1 rounded-xl bg-secondary/10 border border-secondary/20 text-secondary text-xs font-bold"
                                    >
                                        {lang}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-3xl border border-border/80 bg-surface/60 p-6 space-y-3">
                            <div className="flex items-center gap-2 font-bold text-text text-sm">
                                <Award size={18} className="text-secondary" /> Core Competencies
                            </div>
                            <ul className="text-xs text-text-secondary space-y-1.5">
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 size={14} className="text-emerald-500" /> Contract Negotiations & Drafting
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 size={14} className="text-emerald-500" /> Statutory Dispute Resolution
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Client Feedback / Reviews Section */}
                    <CommentsSection lawyer={lawyer} />
                </div>

                {/* Right Column: Sticky Booking Widget */}
                <div className="lg:col-span-5 xl:col-span-4">
                    <BookingWidget lawyer={lawyer} />
                </div>
            </div>
        </div>
    );
}