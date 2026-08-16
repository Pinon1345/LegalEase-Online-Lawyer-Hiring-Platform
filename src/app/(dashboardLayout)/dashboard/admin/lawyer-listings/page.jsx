"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
    Scale,
    Search,
    Filter,
    CheckCircle2,
    Clock,
    XCircle,
    ShieldCheck,
    Star,
    Briefcase,
    Eye,
    Phone,
    Award,
    Loader2,
    AlertCircle,
    RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";
import { baseURL } from "@/lib/api/baseUrl";
import { MdMyLocation } from "react-icons/md";

export default function AdminLawyersListing() {
    const [lawyers, setLawyers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [selectedLawyer, setSelectedLawyer] = useState(null);

    // Helper function to safely extract array from API response
    const extractLawyersData = (data) => {
        if (Array.isArray(data)) return data;
        if (data && Array.isArray(data.lawyers)) return data.lawyers;
        if (data && Array.isArray(data.data)) return data.data;
        return [];
    };

    // Initial Data Fetching safely inside useEffect
    useEffect(() => {
        let isMounted = true;

        const loadLawyers = async () => {
            try {
                setError(null);
                const response = await fetch(`${baseURL}/api/lawyers`);
                if (!response.ok) {
                    throw new Error("Failed to fetch lawyer directory data.");
                }
                const data = await response.json();
                if (isMounted) {
                    setLawyers(extractLawyersData(data));
                }
            } catch (err) {
                if (isMounted) {
                    setError(err.message || "An unexpected error occurred.");
                    toast.error("Could not load lawyers list");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadLawyers();

        return () => {
            isMounted = false;
        };
    }, []);

    // Manual Refresh Handler
    const handleRefresh = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${baseURL}/api/lawyers`);
            if (!response.ok) {
                throw new Error("Failed to fetch lawyer directory data.");
            }
            const data = await response.json();
            setLawyers(extractLawyersData(data));
            toast.success("Directory refreshed");
        } catch (err) {
            setError(err.message || "An unexpected error occurred.");
            toast.error("Could not refresh lawyers list");
        } finally {
            setLoading(false);
        }
    };

    // Filter Logic with Array Safeguard
    const filteredLawyers = useMemo(() => {
        const safeLawyers = Array.isArray(lawyers) ? lawyers : [];
        return safeLawyers.filter((lawyer) => {
            const name = lawyer.lawyerName || "";
            const email = lawyer.email || "";
            const specialization = lawyer.specialization || "";
            const barNumber = lawyer.barNumber || lawyer.userId || "";

            const matchesSearch =
                name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                barNumber.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus =
                statusFilter === "All" || lawyer.availabilityStatus === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [lawyers, searchTerm, statusFilter]);

    const handleStatusChange = async (lawyerId, newStatus) => {
        if (!lawyerId) {
            toast.error("Lawyer ID missing.");
            return;
        }

        try {
            const isVerificationUpdate = typeof newStatus === "boolean";
            const bodyPayload = isVerificationUpdate
                ? { isVerified: newStatus }
                : { availabilityStatus: newStatus };

            // const serverUrl = process.env.NEXT_PUBLIC_API_URL || baseURL || "http://localhost:5000";

            const response = await fetch(`${baseURL}/api/lawyers/${lawyerId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bodyPayload),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Server returned ${response.status}`);
            }

            // Update local state
            setLawyers((prev) => {
                const list = Array.isArray(prev) ? prev : [];
                return list.map((l) =>
                    l._id === lawyerId || l.id === lawyerId || l.userId === lawyerId
                        ? isVerificationUpdate
                            ? { ...l, isVerified: newStatus }
                            : { ...l, availabilityStatus: newStatus }
                        : l
                );
            });

            if (
                selectedLawyer &&
                (selectedLawyer._id === lawyerId || selectedLawyer.id === lawyerId || selectedLawyer.userId === lawyerId)
            ) {
                setSelectedLawyer((prev) =>
                    prev
                        ? isVerificationUpdate
                            ? { ...prev, isVerified: newStatus }
                            : { ...prev, availabilityStatus: newStatus }
                        : null
                );
            }

            toast.success("Updated successfully!");
        } catch (err) {
            console.error("Status Update Error:", err);
            toast.error(err.message || "Update failed. Please try again.");
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "Verified":
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 size={12} /> Verified
                    </span>
                );
            case "Pending Verification":
            case "Pending Review":
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <Clock size={12} /> Pending Review
                    </span>
                );
            case "Suspended":
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        <XCircle size={12} /> Suspended
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-neutral-500/10 text-neutral-400 border border-neutral-500/20">
                        {status || "Unknown"}
                    </span>
                );
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 font-sans selection:bg-amber-500/30">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            Legal Practitioner Directory
                        </span>
                    </div>
                    <h1 className="text-3xl font-black text-gray-800 dark:text-white mt-2">
                        Lawyer Listings & Verification
                    </h1>
                    <p className="text-xs text-neutral-400">
                        Manage legal professionals, review credentials, and approve verification requests.
                    </p>
                </div>

                <button
                    onClick={handleRefresh}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-200 dark:bg-neutral-900 border border-white/10 text-gray-600 dark:text-white text-xs font-bold hover:bg-neutral-200 dark:hover:bg-neutral-800 transition disabled:opacity-50 cursor-pointer self-start md:self-auto"
                >
                    <RefreshCw size={14} className={loading ? "animate-spin text-amber-400" : ""} />
                    <span>Refresh Data</span>
                </button>
            </div>

            {/* Summary Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-3xl bg-slate-100 dark:bg-neutral-900/60 border border-white/10 backdrop-blur-xl space-y-2 shadow-xl">
                    <div className="flex items-center justify-between">
                        <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400">
                            <Scale size={20} />
                        </div>
                        <span className="text-[10px] font-bold text-neutral-400">Total Listed</span>
                    </div>
                    <p className="text-xs text-neutral-400 font-medium">Total Lawyers</p>
                    <h3 className="text-2xl font-black text-gray-700 dark:text-white">{Array.isArray(lawyers) ? lawyers.length : 0}</h3>
                </div>

                <div className="p-5 rounded-3xl bg-slate-100 dark:bg-neutral-900/60 border border-white/10 backdrop-blur-xl space-y-2 shadow-xl">
                    <div className="flex items-center justify-between">
                        <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400">
                            <CheckCircle2 size={20} />
                        </div>
                        <span className="text-[10px] font-bold text-emerald-400">Approved</span>
                    </div>
                    <p className="text-xs text-neutral-400 font-medium">Verified Practitioners</p>
                    <h3 className="text-2xl font-black text-gray-700 dark:text-white">
                        {Array.isArray(lawyers) ? lawyers.filter((l) => l.availabilityStatus === "Verified" || l.isVerified === true).length : 0}
                    </h3>
                </div>

                <div className="p-5 rounded-3xl bg-slate-100 dark:bg-neutral-900/60 border border-white/10 backdrop-blur-xl space-y-2 shadow-xl">
                    <div className="flex items-center justify-between">
                        <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400">
                            <Clock size={20} />
                        </div>
                        <span className="text-[10px] font-bold text-amber-400">Requires Action</span>
                    </div>
                    <p className="text-xs text-neutral-400 font-medium">Pending Approvals</p>
                    <h3 className="text-2xl font-black text-gray-700 dark:text-white">
                        {
                            Array.isArray(lawyers) ? lawyers.filter(
                                (l) => l.availabilityStatus === "Pending Verification" || l.availabilityStatus === "Pending Review"
                            ).length : 0
                        }
                    </h3>
                </div>

                <div className="p-5 rounded-3xl bg-slate-100 dark:bg-neutral-900/60 border border-white/10 backdrop-blur-xl space-y-2 shadow-xl">
                    <div className="flex items-center justify-between">
                        <div className="p-2.5 rounded-2xl bg-rose-500/10 text-rose-400">
                            <XCircle size={20} />
                        </div>
                        <span className="text-[10px] font-bold text-rose-400">Restricted</span>
                    </div>
                    <p className="text-xs text-neutral-400 font-medium">Suspended Accounts</p>
                    <h3 className="text-2xl font-black text-gray-700 dark:text-white">
                        {Array.isArray(lawyers) ? lawyers.filter((l) => l.availabilityStatus === "Suspended").length : 0}
                    </h3>
                </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="p-4 rounded-3xl bg-slate-100 dark:bg-neutral-900/60 border border-white/10 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
                <div className="relative w-full md:w-96">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                        type="text"
                        placeholder="Search by name, specialization, or bar number..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-200 dark:bg-neutral-950/80 border border-white/10 text-gray-600 dark:text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-amber-500/50 transition"
                    />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                    <span className="text-xs text-neutral-700 dark:text-neutral-500 flex items-center gap-1 mr-1">
                        <Filter size={13} /> Status:
                    </span>
                    {["All", "Verified", "Pending Verification", "Suspended"].map((availabilityStatus) => (
                        <button
                            key={availabilityStatus}
                            onClick={() => setStatusFilter(availabilityStatus)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${statusFilter === availabilityStatus
                                ? "bg-amber-500 text-neutral-950 shadow-md"
                                : "bg-slate-200 dark:bg-neutral-950/60 text-neutral-600 dark:text-neutral-400 hover:text-white hover:bg-neutral-800"
                                }`}
                        >
                            {availabilityStatus}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Table */}
            <div className="rounded-3xl border border-white/10 bg-slate-100 dark:bg-neutral-900/50 backdrop-blur-xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 bg-slate-200 dark:bg-neutral-950/60 text-[12px] border-b-amber-400 dark:border-b-amber-600 font-black uppercase tracking-wider text-neutral-400 dark:text-neutral-800">
                                <th className="py-4 px-6">Lawyer Details</th>
                                <th className="py-4 px-6">Specialization & Rate</th>
                                <th className="py-4 px-6">Rating & Stats</th>
                                <th className="py-4 px-6">Status</th>
                                <th className="py-4 px-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-xs">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="py-16 text-center text-neutral-400">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Loader2 size={24} className="animate-spin text-amber-400" />
                                            <span>Fetching legal practitioners...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-rose-400">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <AlertCircle size={24} />
                                            <span>{error}</span>
                                            <button
                                                onClick={handleRefresh}
                                                className="mt-2 px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-600 dark:text-white text-xs font-bold transition cursor-pointer"
                                            >
                                                Try Again
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredLawyers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-neutral-500">
                                        No lawyer profiles matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredLawyers.map((lawyer) => {
                                    const keyId = lawyer.id || lawyer._id;
                                    return (
                                        <tr key={keyId} className="hover:bg-white/[0.02] transition duration-200">
                                            {/* Lawyer Profile */}
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <Image
                                                        src={lawyer.lawyerImage || lawyer.image || "https://i.pravatar.cc/150"}
                                                        alt={lawyer.lawyerName || lawyer.name || "Lawyer Profile"}
                                                        width={44}
                                                        height={44}
                                                        className="w-11 h-11 rounded-2xl object-cover border border-white/10"
                                                    />
                                                    <div>
                                                        <div className="text-gray-800 dark:text-white font-bold flex items-center gap-1.5">
                                                            {lawyer.lawyerName}
                                                            {lawyer.isVerified === true && (
                                                                <ShieldCheck size={14} className="text-amber-400" />
                                                            )}
                                                        </div>
                                                        <div className="text-[10px] text-neutral-400 flex items-center gap-2 mt-0.5">
                                                            <span>{lawyer.userId}</span>
                                                            {lawyer.barNumber && (
                                                                <>
                                                                    <span>•</span>
                                                                    <span className="font-mono text-neutral-500">{lawyer.barNumber}</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Specialization & Hourly Rate */}
                                            <td className="py-4 px-6">
                                                <div className="text-gray-800 dark:text-white font-medium">{lawyer.specialization || "N/A"}</div>
                                                <div className="text-[11px] text-amber-400 font-bold mt-0.5">
                                                    ${lawyer.hourlyRate || lawyer.rate || 0}/hr
                                                </div>
                                            </td>

                                            {/* Rating & Reviews */}
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-1 text-amber-400 font-bold">
                                                    <Star size={13} fill="currentColor" />
                                                    <span>{lawyer.averageRating || "4.5"}</span>
                                                    <span className="text-[10px] text-neutral-500 font-normal">
                                                        ({lawyer.totalReviews || 6} reviews)
                                                    </span>
                                                </div>
                                                <div className="text-[10px] text-neutral-400 mt-0.5">
                                                    {lawyer.yearsExperience || "N/A"} Yrs. Experience
                                                </div>
                                            </td>

                                            {/* Status Badge */}
                                            <td className="py-4 px-6">{getStatusBadge(lawyer.availabilityStatus)}</td>

                                            {/* Actions */}
                                            <td className="py-4 px-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {(lawyer.availabilityStatus === "Pending Verification" || lawyer.availabilityStatus === "Pending Review") && (
                                                        <button
                                                            onClick={() => handleStatusChange(keyId, "Verified")}
                                                            className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black text-[10px] uppercase tracking-wider transition cursor-pointer"
                                                        >
                                                            Approve
                                                        </button>
                                                    )}

                                                    <button
                                                        onClick={() => setSelectedLawyer(lawyer)}
                                                        className="p-2 rounded-xl bg-white/5 hover:bg-amber-500 hover:text-neutral-950 text-neutral-400 dark:text-neutral-300 transition cursor-pointer"
                                                        title="View Lawyer Details"
                                                    >
                                                        <Eye size={15} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Lawyer Profile Modal */}
            {selectedLawyer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md animate-fade-in">
                    <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl space-y-6 relative">
                        <button
                            onClick={() => setSelectedLawyer(null)}
                            className="absolute top-6 right-6 text-neutral-400 hover:text-white cursor-pointer"
                        >
                            ✕
                        </button>

                        <div className="flex items-center gap-4 border-b border-white/10 pb-5">
                            <Image
                                src={selectedLawyer.lawyerImage || selectedLawyer.image || "https://i.pravatar.cc/150"}
                                alt={selectedLawyer.lawyerName || selectedLawyer.name || "Lawyer"}
                                width={64}
                                height={64}
                                className="w-16 h-16 rounded-2xl object-cover border border-amber-500/30"
                            />
                            <div>
                                <h3 className="text-xl font-black text-white">{selectedLawyer.lawyerName}</h3>
                                <p className="text-xs text-amber-400 font-semibold">{selectedLawyer.specialization}</p>
                                <div className="mt-1">{getStatusBadge(selectedLawyer.availabilityStatus)}</div>
                            </div>
                        </div>

                        <div className="space-y-3 text-xs">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 rounded-2xl bg-neutral-950 border border-white/5 space-y-1">
                                    <span className="text-[10px] uppercase font-bold text-neutral-500 flex items-center gap-1">
                                        <Award size={12} /> Bar License ID
                                    </span>
                                    <p className="font-mono font-bold text-white">{selectedLawyer.userId || "N/A"}</p>
                                </div>

                                <div className="p-3 rounded-2xl bg-neutral-950 border border-white/5 space-y-1">
                                    <span className="text-[10px] uppercase font-bold text-neutral-500 flex items-center gap-1">
                                        <Briefcase size={12} /> Experience
                                    </span>
                                    <p className="font-bold text-white">{selectedLawyer.yearsExperience || "N/A"}</p>
                                </div>
                            </div>

                            <div className="p-3.5 rounded-2xl bg-neutral-950 border border-white/5 space-y-2">
                                <div className="flex items-center gap-2 text-neutral-300">
                                    <MdMyLocation size={14} className="text-amber-400" />
                                    <span>{selectedLawyer.location}</span>
                                </div>
                                <div className="flex items-center gap-2 text-neutral-300">
                                    <Phone size={14} className="text-amber-400" />
                                    <span>{selectedLawyer.phone || "Not Provided"}</span>
                                </div>
                            </div>

                            {/* Status Controls */}
                            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                                <label className="text-[10px] uppercase font-bold text-amber-400">
                                    Manage Account Status
                                </label>
                                <div className="flex gap-2 pt-1">
                                    <button
                                        onClick={() => {
                                            const targetId = selectedLawyer._id || selectedLawyer.id || selectedLawyer.userId;
                                            handleStatusChange(targetId, !selectedLawyer.isVerified);
                                        }}
                                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${selectedLawyer.isVerified
                                            ? "bg-emerald-500 text-neutral-950"
                                            : "bg-neutral-950 text-neutral-300 hover:bg-neutral-800"
                                            }`}
                                    >
                                        {selectedLawyer.isVerified ? "Verified" : "Verify"}
                                    </button>
                                    <button
                                        onClick={() => {
                                            const targetId = selectedLawyer._id || selectedLawyer.id || selectedLawyer.userId;
                                            handleStatusChange(targetId, "Suspended");
                                        }}
                                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${selectedLawyer.availabilityStatus === "Suspended"
                                            ? "bg-rose-500 text-white"
                                            : "bg-neutral-950 text-neutral-300 hover:bg-neutral-800"
                                            }`}
                                    >
                                        Suspend
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setSelectedLawyer(null)}
                            className="w-full py-3 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                        >
                            Close Profile
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}