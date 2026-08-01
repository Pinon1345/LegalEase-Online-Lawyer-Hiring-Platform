import React from "react";
import Link from "next/link";
import { FaArrowRight, FaBalanceScale, FaBuilding, FaGlobeAmericas, FaLaptopCode, FaUsers } from "react-icons/fa";
import { FaHandcuffs } from "react-icons/fa6";

const categories = [
    {
        title: "Litigation & Dispute",
        count: "120+ Lawyers",
        description: "Courtroom representation, civil disputes, and arbitration assistance.",
        icon: FaBalanceScale,
        href: "/lawyers?category=litigation",
    },
    {
        title: "Corporate & Business",
        count: "95+ Lawyers",
        description: "Mergers, startup legalities, compliance, and corporate contracts.",
        icon: FaBuilding,
        href: "/lawyers?category=corporate",
    },
    {
        title: "Individual & Family",
        count: "80+ Lawyers",
        description: "Estate planning, family disputes, custody, and personal affairs.",
        icon: FaUsers,
        href: "/lawyers?category=family",
    },
    {
        title: "Criminal Defense",
        count: "60+ Lawyers",
        description: "Immediate legal defense, bail procedures, and criminal proceedings.",
        icon: FaHandcuffs,
        href: "/lawyers?category=criminal",
    },
    {
        title: "IP & Tech Law",
        count: "45+ Lawyers",
        description: "Trademarks, patents, software licensing, and data privacy.",
        icon: FaLaptopCode,
        href: "/lawyers?category=tech",
    },
    {
        title: "Immigration & Global",
        count: "50+ Lawyers",
        description: "Visas, citizenship, cross-border trade, and international law.",
        icon: FaGlobeAmericas,
        href: "/lawyers?category=immigration",
    },
];

const LegalCategories = () => {
    return (
        <section className="relative bg-background py-16 px-6 md:px-16 transition-colors duration-300 overflow-hidden">
            <div className="mx-auto max-w-7xl">

                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-12 fade-up">
                    <span className="text-xs uppercase tracking-widest text-secondary font-bold">
                        Tailored Solutions
                    </span>
                    <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-text">
                        Explore <span className="shine-text">Legal Categories</span>
                    </h2>
                    <p className="mt-3 text-text-secondary text-sm sm:text-base">
                        Select a specialized category to connect directly with lawyers equipped to handle your specific legal requirements.
                    </p>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={idx}
                                href={item.href}
                                className="group card-hover glass relative rounded-2xl p-6 border border-border flex flex-col justify-between overflow-hidden shadow-md shadow-amber-200 dark:shadow-amber-400"
                            >
                                {/* Top Glow Accent */}
                                <div className="absolute top-0 right-0 h-24 w-24 bg-secondary/10 rounded-full blur-2xl group-hover:bg-secondary/20 transition-all duration-500" />

                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3.5 rounded-xl bg-surface border border-border text-secondary group-hover:bg-secondary group-hover:text-surface-dark transition-all duration-300 group-hover:scale-110">
                                            <Icon size={24} />
                                        </div>
                                        <span className="text-xs font-semibold px-3 py-1 rounded-full border border-secondary/30 text-secondary bg-secondary/10">
                                            {item.count}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-text group-hover:text-secondary transition-colors duration-300">
                                        {item.title}
                                    </h3>

                                    <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>

                                <div className="mt-6 flex items-center gap-2 text-xs font-bold text-secondary group-hover:translate-x-1.5 transition-transform duration-300">
                                    <span>Explore Lawyers</span>
                                    <FaArrowRight size={12} />
                                </div>
                            </Link>
                        );
                    })}
                </div>

            </div>
        </section>
    );
};

export default LegalCategories;