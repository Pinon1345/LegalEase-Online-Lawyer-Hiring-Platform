"use client";

import React from "react";
import Image from "next/image";
import { FaUserTie } from "react-icons/fa";
import { FaArrowUpRightFromSquare, FaHandshakeSimple, FaScaleBalanced, FaUsersViewfinder } from "react-icons/fa6";
import { IoShieldCheckmarkSharp } from "react-icons/io5";

const stats = [
    {
        id: "lawyers",
        title: "Total Lawyers",
        value: "1,250+",
        description: "Verified legal counsel across 40+ specialties",
        icon: FaUserTie,
        badge: "Bar Verified",
        avatars: [
            "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
        ],
        extraText: "Active Counsel",
    },
    {
        id: "clients",
        title: "Total Clients",
        value: "48,000+",
        description: "Individuals & businesses protected globally",
        icon: FaUsersViewfinder,
        badge: "99.2% Satisfaction",
        avatars: [
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
        ],
        extraText: "Served Platform-wide",
    },
    {
        id: "cases",
        title: "Cases Resolved",
        value: "95,000+",
        description: "Successful litigation, mediation & agreements",
        icon: FaScaleBalanced,
        badge: "Proven Record",
        avatars: [],
        extraText: "+14% this month",
    },
    {
        id: "consultations",
        title: "Consultations",
        value: "120,000+",
        description: "Private virtual & in-person consultations held",
        icon: FaHandshakeSimple,
        badge: "24/7 Available",
        avatars: [],
        extraText: "Confidential & Secure",
    },
];

const StatsSection = () => {
    return (
        <section className="relative overflow-hidden bg-background py-16 px-6 md:px-16 transition-colors duration-300">

            {/* Background Ambient Glows */}
            <div className="absolute left-1/3 top-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-primary/10 blur-[140px] pointer-events-none" />
            <div className="absolute right-10 top-10 h-72 w-72 rounded-full bg-secondary/15 blur-[130px] pointer-events-none" />

            <div className="relative mx-auto max-w-7xl">

                {/* Section Header */}
                <div className="mb-12 text-center max-w-2xl mx-auto fade-up">
                    <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-secondary font-extrabold bg-secondary/10 px-3.5 py-1 rounded-full border border-secondary/20 mb-3">
                        <IoShieldCheckmarkSharp size={12} />
                        Platform Performance
                    </span>

                    <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-text tracking-tight">
                        Empowering Legal Solutions <span className="shine-text">At Scale</span>
                    </h2>

                    <p className="mt-2 text-sm sm:text-base text-text-secondary">
                        Connecting individuals, startups, and enterprises with world-class legal minds worldwide.
                    </p>
                </div>

                {/* 4 Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((item) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={item.id}
                                className="group card-hover glass relative overflow-hidden rounded-2xl border border-border bg-surface p-6 transition-all duration-500 hover:border-secondary hover:shadow-2xl flex flex-col justify-between"
                            >
                                {/* Glowing Corner Highlight */}
                                <div className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-secondary/10 blur-xl transition-all duration-500 group-hover:scale-150 group-hover:bg-secondary/20" />

                                <div>
                                    {/* Top Row: Icon + Badge */}
                                    <div className="flex items-center justify-between mb-5">

                                        {/* Movable Floating Icon */}
                                        <div className="relative p-3.5 rounded-xl bg-background border border-border text-secondary group-hover:bg-secondary group-hover:text-surface-dark transition-all duration-300 group-hover:-translate-y-1 group-hover:rotate-6 shadow-sm">
                                            <Icon size={24} />
                                        </div>

                                        {/* Status Badge */}
                                        <span className="text-[11px] font-bold tracking-wide px-2.5 py-1 rounded-md bg-secondary/10 text-secondary border border-secondary/20 gold-pulse">
                                            {item.badge}
                                        </span>
                                    </div>

                                    {/* Stat Counter / Value */}
                                    <h3 className="text-3xl sm:text-4xl font-black text-text tracking-tight group-hover:text-secondary transition-colors duration-300">
                                        {item.value}
                                    </h3>

                                    {/* Stat Title */}
                                    <p className="mt-1 text-base font-bold text-text">
                                        {item.title}
                                    </p>

                                    {/* Description */}
                                    <p className="mt-2 text-xs text-text-secondary leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>

                                {/* Bottom Section: Movable Animated Avatars or Meta Info */}
                                <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between">

                                    {/* Animated Overlapping Avatars for Lawyers & Clients */}
                                    {item.avatars.length > 0 ? (
                                        <div className="flex items-center -space-x-2.5 overflow-hidden">
                                            {item.avatars.map((img, i) => (
                                                <div
                                                    key={i}
                                                    className="relative h-8 w-8 rounded-full border-2 border-surface overflow-hidden shadow-sm transition-transform duration-300 group-hover:translate-x-1 hover:scale-110 hover:z-10"
                                                    style={{ transitionDelay: `${i * 75}ms` }}
                                                >
                                                    <Image
                                                        src={img}
                                                        alt="User Avatar"
                                                        fill
                                                        sizes="32px"
                                                        className="object-cover"
                                                    />
                                                </div>
                                            ))}
                                            <span className="ml-3 text-[11px] font-semibold text-text-secondary">
                                                {item.extraText}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-[11px] font-semibold text-secondary flex items-center gap-1.5">
                                            <span>{item.extraText}</span>
                                        </span>
                                    )}

                                    {/* Interactive Arrow Button Icon */}
                                    <div className="text-text-secondary group-hover:text-secondary group-hover:translate-x-1 transition-all duration-300">
                                        <FaArrowUpRightFromSquare size={13} />
                                    </div>

                                </div>

                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
};

export default StatsSection;