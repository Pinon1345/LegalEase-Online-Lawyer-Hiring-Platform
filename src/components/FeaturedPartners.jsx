import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaCircleCheck, FaStar, FaChevronRight } from "react-icons/fa6";

const partners = [
    {
        id: 1,
        name: "Robert Chen",
        tag: "TAX LAW",
        rating: "4.9",
        reviews: 84,
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop",
    },
    {
        id: 2,
        name: "Elena Rodriguez",
        tag: "IMMIGRATION",
        rating: "5.0",
        reviews: 112,
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop",
    },
    {
        id: 3,
        name: "David Miller",
        tag: "ESTATE PLANNING",
        rating: "4.8",
        reviews: 67,
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
    },
    {
        id: 4,
        name: "Marcus King",
        tag: "CRIMINAL DEFENSE",
        rating: "4.9",
        reviews: 95,
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
    },
    {
        id: 5,
        name: "Sarah Jenkins",
        tag: "ENVIRONMENTAL LAW",
        rating: "4.9",
        reviews: 58,
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop",
    },
];

const FeaturedPartners = () => {
    return (
        <section className="bg-surface py-16 px-6 md:px-16 text-text transition-colors duration-300">
            <div className="mx-auto max-w-5xl">

                {/* Header */}
                <div className="mb-10 fade-up text-center">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-text tracking-tight">
                        Featured <span className="shine-text">Partners</span>
                    </h2>
                    <p className="mt-2 text-slate-400 text-sm sm:text-base">
                        Experienced professionals selected for exceptional service metrics.
                    </p>
                </div>

                {/* Partner Cards Stacked List */}
                <div className="space-y-4">
                    {partners.map((partner) => (
                        <div
                            key={partner.id}
                            className="group card-hover flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-gray-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 backdrop-blur-sm p-4 shadow-sm sm:p-5 transition-all duration-300 hover:-translate-y-1 hover:border-secondary hover:shadow-xl dark:hover:shadow-black/30"
                        >
                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                {/* Avatar Image with image-hover Zoom */}
                                <div className="image-hover relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 rounded-2xl overflow-hidden border border-slate-700">
                                    <Image
                                        src={partner.image}
                                        alt={partner.name}
                                        fill
                                        sizes="96px"
                                        className="object-cover"
                                    />
                                    <div className="absolute top-1 right-1 gold-pulse rounded-full bg-secondary p-1 text-surface-dark">
                                        <FaCircleCheck size={10} />
                                    </div>
                                </div>

                                {/* Info */}
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-xl sm:text-2xl font-bold text-gray-600 dark:text-gray-200 dark:group-hover:text-secondary group-hover:text-secondary transition-colors duration-300">
                                            {partner.name}
                                        </h3>
                                    </div>

                                    {/* Specialty Tag */}
                                    <span className="mt-1 inline-block rounded-md bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-xs font-bold text-amber-400 tracking-wide">
                                        {partner.tag}
                                    </span>

                                    {/* Rating */}
                                    <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                                        <FaStar className="text-amber-400" size={12} />
                                        <span className="font-bold text-gray-600 dark:text-gray-200">{partner.rating}</span>
                                        <span>({partner.reviews} consultations)</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Button */}
                            <div className="mt-4 sm:mt-0 w-full sm:w-auto flex justify-end">
                                <Link
                                    href={`/lawyers/${partner.id}`}
                                    className="btn-premium inline-flex items-center gap-2 rounded-xl bg-secondary px-5 py-2.5 text-xs font-bold text-surface-dark transition-all hover:bg-accent"
                                >
                                    <span>View Profile</span>
                                    <FaChevronRight size={10} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default FeaturedPartners;