"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Award, Briefcase, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { baseURL } from "@/lib/api/baseUrl";

export default function TopLegalExperts() {
    const router = useRouter();
    const [topExperts, setTopExperts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopExperts = async () => {
            try {
                setLoading(true);
                // Fetch lawyers and hires data concurrently to calculate top hires
                const [lawyersRes, hiresRes] = await Promise.all([
                    fetch(`${baseURL}/api/lawyers`),
                    fetch(`${baseURL}/api/hires`),
                ]);

                if (lawyersRes.ok) {
                    const lawyersData = await lawyersRes.json();
                    const lawyers = Array.isArray(lawyersData) ? lawyersData : lawyersData.lawyers || [];

                    let hires = [];
                    if (hiresRes.ok) {
                        const hiresData = await hiresRes.json();
                        hires = Array.isArray(hiresData) ? hiresData : hiresData.hires || [];
                    }

                    // Count bookings/hires per lawyer ID
                    const hireCounts = {};
                    hires.forEach((hire) => {
                        const lawyerId = hire.lawyerId || hire.lawyer?._id || hire.lawyer?.id;
                        if (lawyerId) {
                            hireCounts[lawyerId] = (hireCounts[lawyerId] || 0) + 1;
                        }
                    });

                    // Sort lawyers by hire count descending (fallback to rating or default order if no hires recorded yet)
                    const sortedLawyers = [...lawyers].sort((a, b) => {
                        const countA = hireCounts[a._id || a.id] || a.hiresCount || 0;
                        const countB = hireCounts[b._id || b.id] || b.hiresCount || 0;
                        return countB - countA;
                    });

                    // Pick top 3
                    setTopExperts(sortedLawyers.slice(0, 3));
                }
            } catch (error) {
                console.error("Failed to load top legal experts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTopExperts();
    }, []);

    if (loading) {
        return null; // Or a subtle skeleton placeholder
    }

    if (topExperts.length === 0) return null;

    return (
        <section className="py-16 px-6 max-w-7xl mx-auto transition-colors duration-300">
            <div className="p-8 md:p-12 rounded-3xl bg-neutral-100 dark:bg-gradient-to-br dark:from-neutral-900 dark:via-neutral-900/90 dark:to-neutral-950 border border-neutral-200 dark:border-amber-500/20 shadow-xl dark:shadow-2xl relative overflow-hidden transition-colors duration-300">
                {/* Background decorative glow */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 relative z-10">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-3">
                            <Award size={12} /> High Performance
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-neutral-900 dark:text-white">
                            Top Legal Experts
                        </h2>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                            Our most trusted attorneys with the highest client engagement and successful case history.
                        </p>
                    </div>

                    <button
                        onClick={() => router.push("/lawyers")}
                        className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition cursor-pointer self-start md:self-auto"
                    >
                        Explore All Experts <ChevronRight size={16} />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                    {topExperts.map((expert, index) => {
                        const id = expert._id || expert.id;
                        const name = expert.lawyerName || expert.name || "Legal Expert";
                        const image = expert.lawyerImage || expert.imageUrl || expert.avatar || "https://i.pravatar.cc/150";
                        const specialization = expert.specialization || "Senior Counsel";

                        return (
                            <motion.div
                                key={id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                onClick={() => router.push(`/lawyers/${id}`)}
                                className="group p-5 rounded-2xl bg-white dark:bg-neutral-950/80 border border-neutral-200 dark:border-white/10 hover:border-amber-500/40 transition duration-300 flex items-center gap-4 cursor-pointer shadow-lg"
                            >
                                <div className="relative">
                                    <Image
                                        src={image}
                                        alt={name}
                                        width={800}
                                        height={800}
                                        className="w-16 h-16 rounded-2xl object-cover border border-neutral-200 dark:border-white/10 group-hover:border-amber-500/50 transition"
                                    />
                                    <span className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-amber-500 text-neutral-950 font-black text-[11px] flex items-center justify-center shadow-md">
                                        #{index + 1}
                                    </span>
                                </div>

                                <div className="overflow-hidden flex-1">
                                    <h4 className="text-sm font-bold text-neutral-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition truncate">
                                        {name}
                                    </h4>
                                    <p className="text-[11px] text-amber-600 dark:text-amber-400/90 font-medium truncate">
                                        {specialization}
                                    </p>
                                    <div className="flex items-center gap-1 text-[10px] text-neutral-500 dark:text-neutral-400 mt-1">
                                        <Briefcase size={11} className="text-amber-500 dark:text-purple-400" /> Top Hired Counsel
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}