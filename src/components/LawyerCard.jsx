"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Star,
    MapPin,
    Briefcase,
    Globe,
    Clock,
    CheckCircle2,
    ArrowUpRight,
    Sparkles
} from "lucide-react";
import { MdOutlineVerifiedUser } from "react-icons/md";
import { ImArrowUpRight2 } from "react-icons/im";

export default function LawyerCard({ lawyer }) {
    if (!lawyer) return null;

    const {
        _id,
        lawyerName,
        lawyerImage,
        specialization,
        hourlyRate,
        averageRating,
        totalReviews,
        yearsExperience,
        languages,
        location,
        isVerified,
        availabilityStatus,
    } = lawyer;

    // Normalizing MongoDB _id string standard

    const lawyerId = typeof _id === "object" && _id?.$oid ? _id.$oid : _id;

    const isAvailable = availabilityStatus?.toLowerCase() === "available";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.3 }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-secondary/20 bg-surface/80 p-5 shadow-lg backdrop-blur-xl transition-all duration-300 hover:border-secondary hover:shadow-2xl hover:shadow-secondary/10 dark:bg-neutral-900/80 shadow-gray-400"
        >
            {/* Top Glow Accent Effect */}

            <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-secondary/10 blur-3xl transition-all group-hover:bg-secondary/20 pointer-events-none" />

            <div>

                {/* Header Image & Badges */}

                <div className="relative mb-4 h-56 w-full overflow-hidden rounded-2xl">
                    <Image
                        src={lawyerImage}
                        alt={lawyerName || "Lawyer Profile"}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                        onError={() => setImgSrc(FALLBACK_IMAGE)} // Replaces image if DB link breaks (404/403)
                        unoptimized // Prevents Next.js optimization error if domain isn't in next.config.js
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-neutral-950/80 via-transparent to-transparent" />

                    {/* Status Badge */}

                    <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full backdrop-blur-md px-3 py-1 text-xs font-bold shadow-md border border-white/10 bg-neutral-900/60 text-white">
                        <span
                            className={`h-2 w-2 rounded-full ${isAvailable ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                                }`}
                        />
                        <span className="capitalize">{availabilityStatus || "Available"}</span>
                    </div>

                    {/* Verification Badge */}

                    {isVerified && (
                        <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-secondary/90 backdrop-blur-md px-2.5 py-1 text-[11px] font-extrabold text-surface-dark shadow-md">
                            <MdOutlineVerifiedUser size={15} />
                            <span>Verified</span>
                        </div>
                    )}

                    {/* Price tag pinned to bottom right of avatar overlay */}

                    <div className="absolute bottom-3 right-3 rounded-xl bg-neutral-900/20 dark:bg-neutral-950/80 border border-secondary/30 backdrop-blur-md px-3 py-1 text-right text-slate-100">
                        <span className="text-lg font-black text-secondary">${hourlyRate}</span>
                        <span className="text-[10px] dark:text-text-secondary">/hr</span>
                    </div>
                </div>

                {/* Content Body */}
                <div className="space-y-3">
                    {/* Specialization & Experience Tag */}
                    <div className="flex items-center justify-between text-xs">
                        <span className="inline-flex items-center gap-1 rounded-lg bg-secondary/10 px-2.5 py-1 font-bold text-secondary border border-secondary/20">
                            <Briefcase size={12} />
                            {specialization}
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-text-secondary">
                            <Clock size={12} />
                            {yearsExperience} Yrs Exp.
                        </span>
                    </div>

                    {/* Lawyer Name */}
                    <h3 className="text-xl font-extrabold text-text line-clamp-1 group-hover:text-secondary transition-colors">
                        {lawyerName}
                    </h3>

                    {/* Rating & Reviews */}
                    <div className="flex items-center gap-2">
                        <div className="flex items-center text-amber-400">
                            <Star size={16} fill="currentColor" />
                            <span className="ml-1 text-sm font-bold text-text">
                                {averageRating ? Number(averageRating).toFixed(1) : "5.0"}
                            </span>
                        </div>
                        <span className="text-xs text-text-secondary">
                            ({totalReviews || 2} client reviews)
                        </span>
                    </div>

                    {/* Metadata details */}
                    <div className="space-y-1.5 pt-2 border-t border-border/40 text-xs text-text-secondary">
                        {location && (
                            <div className="flex items-center gap-1.5 truncate mt-2">
                                <MapPin size={13} className="text-secondary shrink-0" />
                                <span className="truncate">{location}</span>
                            </div>
                        )}

                        {languages && Array.isArray(languages) && languages.length > 0 && (
                            <div className="flex items-center gap-1.5 truncate">
                                <Globe size={13} className="text-secondary shrink-0" />
                                <span className="truncate">{languages.join(", ")}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Card Action Button */}
            <div className="mt-5 pt-3">
                <Link
                    href={`/lawyers/${lawyerId}`}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-secondary px-4 py-3 text-[14px] font-black uppercase tracking-wider text-surface-dark transition-all duration-200 hover:bg-secondary/90 hover:shadow-lg hover:shadow-secondary/25"
                >
                    View Lawyer Profile
                    <ImArrowUpRight2 size={16} />
                </Link>
            </div>
        </motion.div>
    );
}