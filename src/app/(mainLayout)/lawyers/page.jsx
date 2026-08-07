"use client";

import React, { useState, useMemo, useEffect } from "react";
import LawyerCard from "@/components/LawyerCard";
import { Search, SlidersHorizontal, ArrowUpDown, Filter, Scale, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import { getLawyers } from "@/lib/api/lawyers/data";

// Predefined Legal Specializations

const DEFAULT_CATEGORIES = [
    "Corporate Law",
    "Family Law",
    "Real Estate Law",
    "Civil Litigation",
    "Criminal Defense",
    "Intellectual Property",
    "Tax Law",
    "Labor & Employment",
    "Immigration Law",
    "Environmental Law",
];

export default function BrowseLawyersPage() {
    const [lawyers, setLawyers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filter, Search, & Sort states

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedAvailability, setSelectedAvailability] = useState("All");
    const [sortBy, setSortBy] = useState("default");

    // Fetch Lawyers using data.js utility

    useEffect(() => {
        const loadLawyers = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const data = await getLawyers();

                if (data) {
                    setLawyers(Array.isArray(data) ? data : data.lawyers || []);
                } else {
                    setError("Failed to fetch lawyers from server.");
                }
            } catch (err) {
                console.error("Error loading lawyers:", err);
                setError(err.message || "Something went wrong.");
            } finally {
                setIsLoading(false);
            }
        };

        loadLawyers();
    }, []);

    // Specializations for Category Filter Dropdown

    const categories = useMemo(() => {
        const dbSpecs = lawyers.map((l) => l.specialization).filter(Boolean);
        const combinedSpecs = Array.from(new Set([...DEFAULT_CATEGORIES, ...dbSpecs]));
        return ["All", ...combinedSpecs];
    }, [lawyers]);

    // Computed Filtered & Sorted Lawyers

    const filteredLawyers = useMemo(() => {
        return lawyers
            .filter((lawyer) => {
                const matchesSearch =
                    lawyer.lawyerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    lawyer.specialization?.toLowerCase().includes(searchTerm.toLowerCase());

                const matchesCategory =
                    selectedCategory === "All" || lawyer.specialization === selectedCategory;

                const matchesAvailability =
                    selectedAvailability === "All" ||
                    lawyer.availabilityStatus?.toLowerCase() === selectedAvailability.toLowerCase();

                return matchesSearch && matchesCategory && matchesAvailability;
            })
            .sort((a, b) => {
                if (sortBy === "price-low") return (a.hourlyRate || 0) - (b.hourlyRate || 0);
                if (sortBy === "price-high") return (b.hourlyRate || 0) - (a.hourlyRate || 0);
                if (sortBy === "experience") return (b.yearsExperience || 0) - (a.yearsExperience || 0);
                if (sortBy === "rating") return (b.averageRating || 0) - (a.averageRating || 0);
                return 0;
            });
    }, [lawyers, searchTerm, selectedCategory, selectedAvailability, sortBy]);

    return (
        <div className="min-h-screen bg-background text-text px-4 py-8 md:px-8 lg:px-12 max-w-7xl mx-auto space-y-10">
            {/* Page Header */}
            <div className="text-center space-y-4 max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-bold uppercase tracking-wider">
                    <Scale size={16} /> Legal Ease Directory
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-text tracking-tight">
                    Browse & Hire Expert <span className="text-secondary">Legal Advocates</span>
                </h1>
                <p className="text-text-secondary text-sm md:text-base">
                    Discover verified attorneys across various specializations tailored to your legal requirements.
                </p>
            </div>

            {/* Filter Toolbar */}
            <div className="rounded-3xl border border-secondary/20 bg-surface/60 p-4 sm:p-6 backdrop-blur-xl shadow-xl space-y-4 dark:bg-neutral-900/60">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    {/* Search Input */}
                    <div className="relative md:col-span-5">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
                        <input
                            type="text"
                            placeholder="Search by lawyer name or specialization..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-2xl border border-border/80 bg-neutral-900/40 pl-11 pr-4 py-3 text-sm text-text placeholder:text-text-secondary focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary transition"
                        />
                    </div>

                    {/* Category Filter Dropdown */}
                    <div className="relative md:col-span-3">
                        <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full appearance-none rounded-2xl border border-border/80 bg-neutral-900/40 pl-10 pr-8 py-3 text-sm text-text focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary transition cursor-pointer"
                        >
                            <option value="All" className="bg-neutral-900 text-white">All Specializations</option>
                            {categories.filter((c) => c !== "All").map((cat) => (
                                <option key={cat} value={cat} className="bg-neutral-900 text-white">
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Availability Filter Dropdown */}
                    <div className="relative md:col-span-2">
                        <select
                            value={selectedAvailability}
                            onChange={(e) => setSelectedAvailability(e.target.value)}
                            className="w-full appearance-none rounded-2xl border border-border/80 bg-neutral-900/40 px-4 py-3 text-sm text-text focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary transition cursor-pointer"
                        >
                            <option value="All" className="bg-neutral-900 text-white">All Status</option>
                            <option value="available" className="bg-neutral-900 text-white">Available</option>
                            <option value="busy" className="bg-neutral-900 text-white">Busy</option>
                        </select>
                    </div>

                    {/* Sort Dropdown */}
                    <div className="relative md:col-span-2">
                        <ArrowUpDown size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full appearance-none rounded-2xl border border-border/80 bg-neutral-900/40 pl-10 pr-4 py-3 text-sm text-text focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary transition cursor-pointer"
                        >
                            <option value="default" className="bg-neutral-900 text-white">Sort By</option>
                            <option value="price-low" className="bg-neutral-900 text-white">Price: Low to High</option>
                            <option value="price-high" className="bg-neutral-900 text-white">Price: High to Low</option>
                            <option value="experience" className="bg-neutral-900 text-white">Most Experienced</option>
                            <option value="rating" className="bg-neutral-900 text-white">Top Rated</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Error Message Display */}

            {error && (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-danger/10 border border-danger/30 text-danger text-sm font-semibold">
                    <AlertCircle size={20} className="shrink-0" />
                    <span>Unable to connect to backend server: {error}. Make sure server on port 5000 is running.</span>
                </div>
            )}

            {/* Lawyer Cards Grid */}

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((idx) => (
                        <div key={idx} className="rounded-3xl border border-border/60 bg-surface/40 p-5 space-y-4">
                            <Skeleton className="h-56 w-full rounded-2xl" />
                            <div className="flex justify-between items-center">
                                <Skeleton className="h-5 w-24 rounded-lg" />
                                <Skeleton className="h-4 w-16 rounded-lg" />
                            </div>
                            <Skeleton className="h-7 w-3/4 rounded-lg" />
                            <Skeleton className="h-4 w-1/2 rounded-lg" />
                            <Skeleton className="h-11 w-full rounded-2xl mt-4" />
                        </div>
                    ))}
                </div>
            ) : filteredLawyers.length === 0 ? (
                <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-border/60 bg-surface/30">
                    <SlidersHorizontal size={48} className="mx-auto text-text-secondary mb-4 opacity-50" />
                    <h3 className="text-xl font-bold text-text mb-1">No Lawyers Found</h3>
                    <p className="text-text-secondary text-sm max-w-md mx-auto mb-6">
                        We couldn&apos;t find any legal experts matching your active filters or search terms.
                    </p>
                    <button
                        onClick={() => {
                            setSearchTerm("");
                            setSelectedCategory("All");
                            setSelectedAvailability("All");
                            setSortBy("default");
                        }}
                        className="px-5 py-2.5 rounded-2xl bg-secondary text-surface-dark font-extrabold text-xs uppercase tracking-wider hover:opacity-90 transition"
                    >
                        Reset All Filters
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16 mb-8">
                    {filteredLawyers.map((lawyer) => (

                        // Lawyer Card Component

                        <LawyerCard
                            key={lawyer._id?.$oid || lawyer._id || lawyer.userId}
                            lawyer={lawyer}
                        />


                    ))}
                </div>
            )}
        </div>
    );
}