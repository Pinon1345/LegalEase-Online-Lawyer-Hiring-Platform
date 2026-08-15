"use client";

import React, { useState, useMemo, useEffect, useTransition } from "react";
import LawyerCard from "@/components/LawyerCard";
import { Search, SlidersHorizontal, ArrowUpDown, Filter, Scale, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import { getLawyers } from "@/lib/api/lawyers/data";
import { motion, AnimatePresence } from "motion/react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

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
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [, startTransition] = useTransition();

    // Read initial states from URL query parameters if present

    const initialPage = parseInt(searchParams.get("page")) || 1;
    const initialSearch = searchParams.get("search") || "";
    const initialCategory = searchParams.get("specialization") || "All";
    const initialAvailability = searchParams.get("availability") || "All";
    const initialSort = searchParams.get("sortBy") || "default";

    const [lawyers, setLawyers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filter, Search, Sort & Pagination States

    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [selectedAvailability, setSelectedAvailability] = useState(initialAvailability);
    const [sortBy, setSortBy] = useState(initialSort);

    // Pagination states

    const [currentPage, setCurrentPage] = useState(initialPage);
    const [totalPages, setTotalPages] = useState(1);
    const [totalLawyers, setTotalLawyers] = useState(0);
    const limit = 9;

    // Helper to update URL search params dynamically

    const updateUrlParams = (updates) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([key, value]) => {
            if (value && value !== "All" && value !== "default" && value !== "") {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        });
        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`, { scroll: false });
        });
    };

    // Fetch Lawyers from Server with Params
    useEffect(() => {
        const loadLawyers = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const data = await getLawyers({
                    page: currentPage,
                    limit,
                    search: searchTerm,
                    specialization: selectedCategory,
                    availability: selectedAvailability,
                    sortBy,
                });

                if (data) {
                    setLawyers(data.lawyers || []);
                    setTotalPages(data.totalPages || 1);
                    setTotalLawyers(data.totalLawyers || 0);
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

        const timer = setTimeout(() => {
            loadLawyers();
        }, 300); // Debounce search

        return () => clearTimeout(timer);
    }, [currentPage, searchTerm, selectedCategory, selectedAvailability, sortBy]);

    // Dynamic Specialization Categories for Dropdown
    const categories = useMemo(() => {
        const combinedSpecs = Array.from(new Set([...DEFAULT_CATEGORIES]));
        return ["All", ...combinedSpecs];
    }, []);

    // Generate page number buttons with truncation for a premium look
    
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, "...", totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
            }
        }
        return pages;
    };

    return (
        <div className="min-h-screen bg-background text-text px-4 py-8 md:px-8 lg:px-12 max-w-7xl mx-auto space-y-10">
            {/* Page Header */}
            <div className="text-center space-y-4 max-w-3xl mx-auto">
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-bold uppercase tracking-wider"
                >
                    <Scale size={16} /> Legal Ease Directory
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-3xl sm:text-4xl md:text-5xl font-black text-text tracking-tight"
                >
                    Browse & Hire Expert <span className="text-secondary">Legal Advocates</span>
                </motion.h1>
                <p className="text-text-secondary text-sm md:text-base">
                    Discover verified attorneys across various specializations tailored to your legal requirements.
                </p>
            </div>

            {/* Filter Toolbar (Placed above the counts and grid) */}
            <div className="rounded-3xl border border-secondary/20 bg-surface/60 p-4 sm:p-6 backdrop-blur-xl shadow-xl space-y-4 dark:bg-neutral-900/60">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    {/* Search Input */}
                    <div className="relative md:col-span-5">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
                        <input
                            type="text"
                            placeholder="Search by lawyer name or specialization..."
                            value={searchTerm}
                            onChange={(e) => {
                                const val = e.target.value;
                                setSearchTerm(val);
                                setCurrentPage(1);
                                updateUrlParams({ search: val, page: 1 });
                            }}
                            className="w-full rounded-2xl border border-border/80 bg-neutral-900/40 pl-11 pr-4 py-3 text-sm text-text placeholder:text-text-secondary focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary transition"
                        />
                    </div>

                    {/* Category Filter Dropdown */}
                    <div className="relative md:col-span-3">
                        <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
                        <select
                            value={selectedCategory}
                            onChange={(e) => {
                                const val = e.target.value;
                                setSelectedCategory(val);
                                setCurrentPage(1);
                                updateUrlParams({ specialization: val, page: 1 });
                            }}
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
                            onChange={(e) => {
                                const val = e.target.value;
                                setSelectedAvailability(val);
                                setCurrentPage(1);
                                updateUrlParams({ availability: val, page: 1 });
                            }}
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
                            onChange={(e) => {
                                const val = e.target.value;
                                setSortBy(val);
                                setCurrentPage(1);
                                updateUrlParams({ sortBy: val, page: 1 });
                            }}
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

            {/* Results count indicator moved below the filters */}
            <div className="flex justify-between items-center text-xs text-text-secondary px-2">
                <span>Showing <span className="font-bold text-lg text-emerald-400">{lawyers.length}</span> of <span className="font-bold text-lg text-amber-400">{totalLawyers}</span> Legal Experts</span>
                <span>Page <span className="font-bold text-lg text-emerald-400">{currentPage}</span> of <span className="font-bold text-lg text-amber-400">{totalPages}</span></span>
            </div>

            {/* Error Message Display */}
            {error && (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-danger/10 border border-danger/30 text-danger text-sm font-semibold">
                    <AlertCircle size={20} className="shrink-0" />
                    <span>Unable to connect to backend server: {error}. Make sure server on port 5000 is running.</span>
                </div>
            )}

            {/* Lawyer Cards Grid & Pagination */}
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
            ) : lawyers.length === 0 ? (
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
                            setCurrentPage(1);
                            router.push(pathname, { scroll: false });
                        }}
                        className="px-5 py-2.5 rounded-2xl bg-secondary text-surface-dark font-extrabold text-xs uppercase tracking-wider hover:opacity-90 transition"
                    >
                        Reset All Filters
                    </button>
                </div>
            ) : (
                <div className="space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {lawyers.map((lawyer) => (
                            <LawyerCard
                                key={lawyer._id?.$oid || lawyer._id || lawyer.userId}
                                lawyer={lawyer}
                            />
                        ))}
                    </div>

                    {/* --- PREMIUM PAGINATION BAR --- */}
                    {totalPages > 1 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-secondary/10">
                            {/* Previous Button */}
                            <button
                                onClick={() => {
                                    const nextP = Math.max(currentPage - 1, 1);
                                    setCurrentPage(nextP);
                                    updateUrlParams({ page: nextP });
                                }}
                                disabled={currentPage === 1}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition border ${currentPage === 1
                                    ? "border-border/40 text-text-secondary/40 cursor-not-allowed bg-surface/20"
                                    : "border-secondary/30 text-text hover:bg-secondary/10 hover:border-secondary/60 bg-surface/50 shadow-sm"
                                    }`}
                            >
                                <ChevronLeft size={16} /> Previous
                            </button>

                            {/* Page Numbers with Glassmorphic pill style */}
                            <div className="flex items-center gap-2 overflow-x-auto py-2">
                                {getPageNumbers().map((page, index) => {
                                    if (page === "...") {
                                        return (
                                            <span key={`ellipsis-${index}`} className="px-3 py-2 text-text-secondary text-sm font-semibold">
                                                ...
                                            </span>
                                        );
                                    }

                                    const isActive = currentPage === page;
                                    return (
                                        <motion.button
                                            key={page}
                                            whileHover={{ scale: 1.08 }}
                                            whileTap={{ scale: 0.92 }}
                                            onClick={() => {
                                                setCurrentPage(page);
                                                updateUrlParams({ page });
                                            }}
                                            className={`w-10 h-10 rounded-2xl font-bold text-xs flex items-center justify-center transition-all shadow-md ${isActive
                                                ? "bg-secondary text-neutral-950 shadow-secondary/30 ring-2 ring-secondary/50"
                                                : "bg-neutral-900/60 border border-border/80 text-text hover:bg-secondary/20 hover:border-secondary/40"
                                                }`}
                                        >
                                            {page}
                                        </motion.button>
                                    );
                                })}
                            </div>

                            {/* Next Button */}
                            <button
                                onClick={() => {
                                    const nextP = Math.min(currentPage + 1, totalPages);
                                    setCurrentPage(nextP);
                                    updateUrlParams({ page: nextP });
                                }}
                                disabled={currentPage === totalPages}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition border ${currentPage === totalPages
                                    ? "border-border/40 text-text-secondary/40 cursor-not-allowed bg-surface/20"
                                    : "border-secondary/30 text-text hover:bg-secondary/10 hover:border-secondary/60 bg-surface/50 shadow-sm"
                                    }`}
                            >
                                Next <ChevronRight size={16} />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}