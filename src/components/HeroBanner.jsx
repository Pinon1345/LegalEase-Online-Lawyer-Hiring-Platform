"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import {
    FaGavel,
    FaBalanceScale,
    FaUserCheck,
    FaShieldAlt,
    FaChevronLeft,
    FaChevronRight,
    FaArrowRight,
    FaAward,
    FaFileContract,
    FaHandshake
} from "react-icons/fa";

const slides = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1200&auto=format&fit=crop",
        badge: "Scale of Justice",
        badgeIcon: FaBalanceScale,
        title: "Unwavering Legal Protection for Your Rights",
        description: "Connect with elite attorneys specializing in corporate, civil, and constitutional law to defend what matters most."
    },
    {
        id: 2,
        image: "https://plus.unsplash.com/premium_photo-1698084059560-9a53de7b816b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bGVnYWx8ZW58MHx8MHx8fDA%3D",
        badge: "Verified Attorneys",
        badgeIcon: FaUserCheck,
        title: "Hire Top-Tier Counsel with Full Confidence",
        description: "Every lawyer on LegalEase undergoes strict bar verification and background checks for complete peace of mind."
    },
    {
        id: 3,
        image: "https://t3.ftcdn.net/jpg/04/62/41/32/360_F_462413244_34T7lDHP1JsgPRaO3elyN9RTaxC0PbaF.jpg",
        badge: "Strategic Advocacy",
        badgeIcon: FaGavel,
        title: "Expert Representation in Court & Arbitration",
        description: "From courtroom litigation to private mediation, access seasoned litigators with proven track records."
    },
    {
        id: 4,
        image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=1200&auto=format&fit=crop",
        badge: "Confidential Counsel",
        badgeIcon: FaShieldAlt,
        title: "24/7 Secure Legal Advice & Consultations",
        description: "Schedule private virtual appointments and receive confidential legal guidance anytime, anywhere."
    },
    {
        id: 5,
        image: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=1200&auto=format&fit=crop",
        badge: "Corporate Excellence",
        badgeIcon: FaAward,
        title: "Tailored Advisory for Business & Enterprises",
        description: "Navigate complex regulatory frameworks, mergers, and intellectual property with veteran corporate lawyers."
    },
    {
        id: 6,
        image: "https://plus.unsplash.com/premium_photo-1695942301094-472c4dbf9130?q=80&w=834&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        badge: "Contract Drafting",
        badgeIcon: FaFileContract,
        title: "Flawless Documentation & Compliance",
        description: "Safeguard your agreements with meticulous legal drafting and thorough contract review services."
    },
    {
        id: 7,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8WKOP3aRQvqzdMDulvCgGAOiJ8VSvE3MFxXk6m9ISKA&s=10",
        badge: "Family & Estate Law",
        badgeIcon: FaHandshake,
        title: "Compassionate Support for Family Matters",
        description: "Resolve estate planning, custody, and family disputes with empathetic, highly qualified legal specialists."
    },
    {
        id: 8,
        image: "https://images.unsplash.com/photo-1436450412740-6b988f486c6b?q=80&w=1200&auto=format&fit=crop",
        badge: "Global Compliance",
        badgeIcon: FaShieldAlt,
        title: "International Legal Solutions Made Simple",
        description: "Bridging legal boundaries with expert advice on cross-border business and international immigration."
    },
    {
        id: 9,
        image: "https://media.istockphoto.com/id/2248801947/photo/professional-discussion-on-courthouse-steps.jpg?s=612x612&w=0&k=20&c=l-PFtVBw3lZAvwJViGIUGEjnBYG_4pH0RWLosUgj4ZA=",
        badge: "Fast Case Resolution",
        badgeIcon: FaGavel,
        title: "Streamlined Case Management & Direct Hiring",
        description: "Hire trusted legal representatives instantly and track your ongoing case milestones with legal clarity."
    }
];

const HeroBanner = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    // Auto-advance carousel
    useEffect(() => {
        if (!isAutoPlaying) return;
        const timer = setInterval(() => {
            nextSlide();
        }, 5500);
        return () => clearInterval(timer);
    }, [currentSlide, isAutoPlaying]);

    const activeSlide = slides[currentSlide];
    const BadgeIcon = activeSlide.badgeIcon;

    return (
        <section
            className="relative w-full overflow-hidden bg-background py-8 md:py-14 transition-colors duration-300"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
        >
            {/* Ambient Background Glows */}
            <div className="absolute left-1/4 top-10 h-96 w-96 rounded-full bg-primary/10 blur-[150px] pointer-events-none" />
            <div className="absolute right-10 bottom-10 h-80 w-80 rounded-full bg-secondary/20 blur-[130px] pointer-events-none" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Header Status Badge */}
                <div className="mb-6 flex justify-center md:justify-start">
                    <motion.div

                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}

                        className="inline-flex items-center gap-2.5 rounded-full border border-secondary/30 bg-surface/80 px-4 py-1.5 backdrop-blur-md text-xs sm:text-sm font-semibold text-text shadow-sm gold-pulse">
                        <FaGavel className="text-secondary animate-bounce" size={14} />
                        <span className="tracking-wide">Find & Hire Expert Legal Counsel</span>
                    </motion.div>
                </div>

                {/* Carousel Card Container */}
                <div className="glass relative overflow-hidden rounded-2xl md:rounded-3xl border border-border bg-surface p-4 sm:p-6 lg:p-8 shadow-2xl">

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

                        {/* Slide Content Area (Left on Desktop) */}
                        <div className="lg:col-span-6 flex flex-col justify-center order-2 lg:order-1 fade-up key={currentSlide}">

                            {/* Slide-specific Status Badge */}
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onHoverStart={() => console.log('hover started!')}
                                className="mb-4 inline-flex items-center gap-2 rounded-lg bg-secondary/10 px-3 py-1.5 text-xs font-semibold text-secondary w-fit">
                                <BadgeIcon size={14} />
                                <span>{activeSlide.badge}</span>
                            </motion.div>

                            {/* Main Slide Title */}
                            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-text tracking-tight leading-tight">
                                {activeSlide.title.split(" ").map((word, i) => (
                                    <span key={i}>
                                        {i % 3 === 1 ? (
                                            <span className="shine-text"> {word} </span>
                                        ) : (
                                            ` ${word}`
                                        )}
                                    </span>
                                ))}
                            </h1>

                            {/* Slide Relevant Description Text */}
                            <p className="mt-4 text-sm sm:text-base lg:text-lg text-text-secondary leading-relaxed">
                                {activeSlide.description}
                            </p>

                            {/* Main CTA Button & Carousel Controls */}
                            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                                <Link
                                    href="/lawyers"
                                    className="btn-premium inline-flex items-center justify-center gap-3 rounded-xl bg-secondary px-8 py-4 font-bold text-surface-dark shadow-lg transition-all hover:bg-accent"
                                >
                                    <span>Browse Lawyers</span>
                                    <FaArrowRight size={16} />
                                </Link>

                                {/* Navigation Arrows */}
                                <div className="flex items-center justify-center gap-3 mt-2 sm:mt-0">
                                    <button
                                        onClick={prevSlide}
                                        aria-label="Previous Slide"
                                        className="rounded-xl border border-border bg-surface-dark/5 dark:bg-surface p-3.5 text-text transition hover:border-secondary hover:bg-secondary hover:text-surface-dark active:scale-95"
                                    >
                                        <FaChevronLeft size={16} />
                                    </button>
                                    <button
                                        onClick={nextSlide}
                                        aria-label="Next Slide"
                                        className="rounded-xl border border-border bg-surface-dark/5 dark:bg-surface p-3.5 text-text transition hover:border-secondary hover:bg-secondary hover:text-surface-dark active:scale-95"
                                    >
                                        <FaChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Image Showcase Area (Right on Desktop) */}
                        <div className="lg:col-span-6 order-1 lg:order-2">
                            <div className="image-hover relative h-[260px] sm:h-[380px] lg:h-[440px] w-full rounded-xl sm:rounded-2xl overflow-hidden shadow-xl border border-border">
                                <Image
                                    src={activeSlide.image}
                                    alt={activeSlide.title}
                                    fill
                                    priority
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                                    className="object-cover transition-transform duration-700 hover:scale-105"
                                />

                                {/* Image Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                {/* Floating Scale of Justice Icon Badge on Image */}
                                <div className="absolute top-4 right-4 glass rounded-xl p-3 text-secondary shadow-lg">
                                    <FaBalanceScale size={24} />
                                </div>

                                {/* Captioned Text overlay on Image for mobile/desktop */}
                                <div className="absolute bottom-4 left-4 right-4 text-white text-xs sm:text-sm bg-black/40 backdrop-blur-md p-3 rounded-xl border border-white/10">
                                    <p className="font-medium text-amber-300">LegalEase Verified Platform</p>
                                    <p className="truncate text-slate-200">{activeSlide.badge} • Professional Legal Representation</p>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Carousel Dots Indicator */}
                    <div className="mt-6 flex items-center justify-center gap-2 border-t border-border/50 pt-4">
                        {slides.map((slide, index) => (
                            <button
                                key={slide.id}
                                onClick={() => setCurrentSlide(index)}
                                aria-label={`Go to slide ${index + 1}`}
                                className={`h-2.5 rounded-full transition-all duration-300 ${currentSlide === index
                                    ? "w-8 bg-secondary"
                                    : "w-2.5 bg-muted/40 hover:bg-muted"
                                    }`}
                            />
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default HeroBanner;