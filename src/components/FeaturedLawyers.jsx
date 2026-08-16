"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Scale, ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { baseURL } from "@/lib/api/baseUrl";

export default function FeaturedLawyers() {
    const router = useRouter();
    const [lawyers, setLawyers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeaturedLawyers = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${baseURL}/api/lawyers`);
                if (res.ok) {
                    const data = await res.json();
                    const lawyerList = Array.isArray(data) ? data : data.lawyers || [];
                    // Take the latest 6 lawyers from DB
                    setLawyers(lawyerList.slice(0, 6));
                }
            } catch (error) {
                console.error("Failed to fetch featured lawyers:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedLawyers();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
            },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    };

    return (
        <section className="py-20 px-6 max-w-7xl mx-auto transition-colors duration-300">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-3">
                        <Sparkles size={12} /> Elite Professionals
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-neutral-900 dark:text-white tracking-tight">
                        Featured Lawyers
                    </h2>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 max-w-xl">
                        Discover our top-rated legal counsels ready to provide expert guidance and representation for your case.
                    </p>
                </div>

                <button
                    onClick={() => router.push("/lawyers")}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 hover:border-amber-500/40 text-xs font-bold text-neutral-800 dark:text-neutral-200 hover:text-amber-600 dark:hover:text-amber-400 transition cursor-pointer self-start md:self-auto shadow-lg"
                >
                    View All Lawyers <ArrowRight size={14} />
                </button>
            </div>

            {/* Grid Content */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="h-80 rounded-3xl bg-neutral-100 dark:bg-neutral-900/40 border border-neutral-200 dark:border-white/5 animate-pulse" />
                    ))}
                </div>
            ) : lawyers.length === 0 ? (
                <div className="text-center py-16 text-neutral-500 text-sm">
                    No featured lawyers available at the moment.
                </div>
            ) : (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {lawyers.map((lawyer) => {
                        const id = lawyer._id || lawyer.id;
                        const name = lawyer.lawyerName || lawyer.name || "Legal Expert";
                        const image = lawyer.lawyerImage || lawyer.imageUrl || lawyer.avatar || "https://i.pravatar.cc/150";
                        const specialization = lawyer.specialization || "General Counsel";
                        const fee = lawyer.hourlyRate || lawyer.fee || 150;

                        return (
                            <motion.div
                                key={id}
                                variants={cardVariants}
                                whileHover={{ y: -6, scale: 1.01 }}
                                transition={{ duration: 0.2 }}
                                className="p-6 rounded-3xl bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-white/10 backdrop-blur-xl flex flex-col justify-between shadow-xl hover:border-amber-500/30 group transition-colors duration-300"
                            >
                                <div>
                                    <div className="flex items-center gap-4 mb-4">
                                        <Image
                                            src={image}
                                            alt={name}
                                            width={800}
                                            height={800}
                                            className="w-16 h-16 rounded-2xl object-cover border border-neutral-200 dark:border-white/10 group-hover:border-amber-500/40 transition"
                                        />
                                        <div>
                                            <h3 className="text-base font-bold text-neutral-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition">
                                                {name}
                                            </h3>
                                            <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-0.5">
                                                {specialization}
                                            </p>
                                            <div className="flex items-center gap-1 text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
                                                <Scale size={12} /> Verified Legal Expert
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 mb-4 leading-relaxed">
                                        {lawyer.bio || lawyer.description || "Experienced legal professional providing dedicated advocacy, strategic advice, and comprehensive case representation."}
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-neutral-200 dark:border-white/10 flex items-center justify-between">
                                    <div>
                                        <span className="text-[10px] uppercase font-bold text-neutral-400 dark:text-neutral-500 block">Consultation</span>
                                        <span className="text-sm font-black text-neutral-900 dark:text-white">${fee}/hr</span>
                                    </div>
                                    <button
                                        onClick={() => router.push(`/lawyers/${id}`)}
                                        className="px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-600 dark:text-amber-400 hover:text-white dark:hover:text-neutral-950 font-bold text-xs transition cursor-pointer border border-amber-500/20"
                                    >
                                        View Profile
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            )}
        </section>
    );
}