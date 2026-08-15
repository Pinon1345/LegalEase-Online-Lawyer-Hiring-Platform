"use client";

import React, { useState, useMemo } from "react";
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
    Mail,
    Phone,
    Award,
    MoreVertical,
    UserCheck,
    UserX,
} from "lucide-react";
import toast from "react-hot-toast";

// Initial Mock Lawyers Data
const INITIAL_LAWYERS = [
    {
        id: "LWY-801",
        name: "Adv. Sarah Jenkins",
        email: "sarah.j@legalease.com",
        phone: "+1 (555) 019-2834",
        specialization: "Corporate & Business Law",
        experience: "12 Years",
        rating: 4.9,
        reviewsCount: 128,
        hourlyRate: 150,
        status: "Verified",
        joinedDate: "2025-11-20",
        avatar: "https://i.pravatar.cc/150?u=sarah",
        barNumber: "BAR-NY-90214",
    },
    {
        id: "LWY-802",
        name: "Adv. Tariq Rahman",
        email: "tariq.r@legalease.com",
        phone: "+1 (555) 014-9982",
        specialization: "Criminal Defense",
        experience: "8 Years",
        rating: 4.7,
        reviewsCount: 94,
        hourlyRate: 180,
        status: "Verified",
        joinedDate: "2026-02-01",
        avatar: "https://i.pravatar.cc/150?u=tariq",
        barNumber: "BAR-CA-33819",
    },
    {
        id: "LWY-803",
        name: "Adv. Elena Rostova",
        email: "elena.r@legalease.com",
        phone: "+1 (555) 018-7711",
        specialization: "Intellectual Property",
        experience: "5 Years",
        rating: 4.5,
        reviewsCount: 42,
        hourlyRate: 200,
        status: "Pending Verification",
        joinedDate: "2026-08-10",
        avatar: "https://i.pravatar.cc/150?u=elena",
        barNumber: "BAR-TX-77412",
    },
    {
        id: "LWY-804",
        name: "Adv. Marcus Vance",
        email: "marcus.v@legalease.com",
        phone: "+1 (555) 012-3344",
        specialization: "Family & Divorce Law",
        experience: "15 Years",
        rating: 4.2,
        reviewsCount: 65,
        hourlyRate: 130,
        status: "Suspended",
        joinedDate: "2025-06-14",
        avatar: "https://i.pravatar.cc/150?u=marcus",
        barNumber: "BAR-FL-10928",
    },
];

export default function AdminLawyersListing() {
    const [lawyers, setLawyers] = useState(INITIAL_LAWYERS);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [selectedLawyer, setSelectedLawyer] = useState(null);

    // Filter Logic
    const filteredLawyers = useMemo(() => {
        return lawyers.filter((lawyer) => {
            const matchesSearch =
                lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lawyer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lawyer.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lawyer.barNumber.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus =
                statusFilter === "All" || lawyer.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [lawyers, searchTerm, statusFilter]);

    // Handle Verification Toggle
    const handleStatusChange = (lawyerId, newStatus) => {
        setLawyers((prev) =>
            prev.map((l) => (l.id === lawyerId ? { ...l, status: newStatus } : l))
        );
        toast.success(`Lawyer status updated to "${newStatus}"`);
        if (selectedLawyer && selectedLawyer.id === lawyerId) {
            setSelectedLawyer((prev) => ({ ...prev, status: newStatus }));
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
                return null;
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
                    <h1 className="text-3xl font-black text-white mt-2">
                        Lawyer Listings & Verification
                    </h1>
                    <p className="text-xs text-neutral-400">
                        Manage legal professionals, review credentials, and approve verification requests.
                    </p>
                </div>
            </div>

            {/* Summary Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-3xl bg-neutral-900/60 border border-white/10 backdrop-blur-xl space-y-2 shadow-xl">
                    <div className="flex items-center justify-between">
                        <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400">
                            <Scale size={20} />
                        </div>
                        <span className="text-[10px] font-bold text-neutral-400">Total Listed</span>
                    </div>
                    <p className="text-xs text-neutral-400 font-medium font-sans">Total Lawyers</p>
                    <h3 className="text-2xl font-black text-white">{lawyers.length}</h3>
                </div>

                <div className="p-5 rounded-3xl bg-neutral-900/60 border border-white/10 backdrop-blur-xl space-y-2 shadow-xl">
                    <div className="flex items-center justify-between">
                        <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400">
                            <CheckCircle2 size={20} />
                        </div>
                        <span className="text-[10px] font-bold text-emerald-400">Approved</span>
                    </div>
                    <p className="text-xs text-neutral-400 font-medium font-sans">Verified Practitioners</p>
                    <h3 className="text-2xl font-black text-white">
                        {lawyers.filter((l) => l.status === "Verified").length}
                    </h3>
                </div>

                <div className="p-5 rounded-3xl bg-neutral-900/60 border border-white/10 backdrop-blur-xl space-y-2 shadow-xl">
                    <div className="flex items-center justify-between">
                        <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400">
                            <Clock size={20} />
                        </div>
                        <span className="text-[10px] font-bold text-amber-400">Requires Action</span>
                    </div>
                    <p className="text-xs text-neutral-400 font-medium font-sans">Pending Approvals</p>
                    <h3 className="text-2xl font-black text-white">
                        {lawyers.filter((l) => l.status === "Pending Verification").length}
                    </h3>
                </div>

                <div className="p-5 rounded-3xl bg-neutral-900/60 border border-white/10 backdrop-blur-xl space-y-2 shadow-xl">
                    <div className="flex items-center justify-between">
                        <div className="p-2.5 rounded-2xl bg-rose-500/10 text-rose-400">
                            <XCircle size={20} />
                        </div>
                        <span className="text-[10px] font-bold text-rose-400">Restricted</span>
                    </div>
                    <p className="text-xs text-neutral-400 font-medium font-sans">Suspended Accounts</p>
                    <h3 className="text-2xl font-black text-white">
                        {lawyers.filter((l) => l.status === "Suspended").length}
                    </h3>
                </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="p-4 rounded-3xl bg-neutral-900/60 border border-white/10 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
                <div className="relative w-full md:w-96">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                        type="text"
                        placeholder="Search by name, specialization, or bar number..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-neutral-950/80 border border-white/10 text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-amber-500/50 transition"
                    />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                    <span className="text-xs text-neutral-500 flex items-center gap-1 mr-1">
                        <Filter size={13} /> Status:
                    </span>
                    {["All", "Verified", "Pending Verification", "Suspended"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${statusFilter === status
                                    ? "bg-amber-500 text-neutral-950 shadow-md"
                                    : "bg-neutral-950/60 text-neutral-400 hover:text-white hover:bg-neutral-800"
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Table */}
            <div className="rounded-3xl border border-white/10 bg-neutral-900/50 backdrop-blur-xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 bg-neutral-950/60 text-[11px] font-black uppercase tracking-wider text-neutral-400">
                                <th className="py-4 px-6">Lawyer Details</th>
                                <th className="py-4 px-6">Specialization & Rate</th>
                                <th className="py-4 px-6">Rating & Stats</th>
                                <th className="py-4 px-6">Status</th>
                                <th className="py-4 px-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-xs">
                            {filteredLawyers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-neutral-500">
                                        No lawyer profiles matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredLawyers.map((lawyer) => (
                                    <tr key={lawyer.id} className="hover:bg-white/[0.02] transition duration-200">
                                        {/* Lawyer Profile */}
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={lawyer.avatar}
                                                    alt={lawyer.name}
                                                    className="w-11 h-11 rounded-2xl object-cover border border-white/10"
                                                />
                                                <div>
                                                    <div className="text-white font-bold flex items-center gap-1.5">
                                                        {lawyer.name}
                                                        {lawyer.status === "Verified" && (
                                                            <ShieldCheck size={14} className="text-amber-400" />
                                                        )}
                                                    </div>
                                                    <div className="text-[10px] text-neutral-400 flex items-center gap-2 mt-0.5">
                                                        <span>{lawyer.email}</span>
                                                        <span>•</span>
                                                        <span className="font-mono text-neutral-500">{lawyer.barNumber}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Specialization & Hourly Rate */}
                                        <td className="py-4 px-6">
                                            <div className="text-white font-medium">{lawyer.specialization}</div>
                                            <div className="text-[11px] text-amber-400 font-bold mt-0.5">
                                                ${lawyer.hourlyRate}/hr
                                            </div>
                                        </td>

                                        {/* Rating & Reviews */}
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-1 text-amber-400 font-bold">
                                                <Star size={13} fill="currentColor" />
                                                <span>{lawyer.rating}</span>
                                                <span className="text-[10px] text-neutral-500 font-normal">
                                                    ({lawyer.reviewsCount} reviews)
                                                </span>
                                            </div>
                                            <div className="text-[10px] text-neutral-400 mt-0.5">
                                                {lawyer.experience} Experience
                                            </div>
                                        </td>

                                        {/* Status Badge */}
                                        <td className="py-4 px-6">{getStatusBadge(lawyer.status)}</td>

                                        {/* Actions */}
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {lawyer.status === "Pending Verification" && (
                                                    <button
                                                        onClick={() => handleStatusChange(lawyer.id, "Verified")}
                                                        className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black text-[10px] uppercase tracking-wider transition cursor-pointer"
                                                    >
                                                        Approve
                                                    </button>
                                                )}

                                                <button
                                                    onClick={() => setSelectedLawyer(lawyer)}
                                                    className="p-2 rounded-xl bg-white/5 hover:bg-amber-500 hover:text-neutral-950 text-neutral-300 transition cursor-pointer"
                                                    title="View Lawyer Details"
                                                >
                                                    <Eye size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
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
                            <img
                                src={selectedLawyer.avatar}
                                alt={selectedLawyer.name}
                                className="w-16 h-16 rounded-2xl object-cover border border-amber-500/30"
                            />
                            <div>
                                <h3 className="text-xl font-black text-white">{selectedLawyer.name}</h3>
                                <p className="text-xs text-amber-400 font-semibold">{selectedLawyer.specialization}</p>
                                <div className="mt-1">{getStatusBadge(selectedLawyer.status)}</div>
                            </div>
                        </div>

                        <div className="space-y-3 text-xs">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 rounded-2xl bg-neutral-950 border border-white/5 space-y-1">
                                    <span className="text-[10px] uppercase font-bold text-neutral-500 flex items-center gap-1">
                                        <Award size={12} /> Bar License ID
                                    </span>
                                    <p className="font-mono font-bold text-white">{selectedLawyer.barNumber}</p>
                                </div>

                                <div className="p-3 rounded-2xl bg-neutral-950 border border-white/5 space-y-1">
                                    <span className="text-[10px] uppercase font-bold text-neutral-500 flex items-center gap-1">
                                        <Briefcase size={12} /> Experience
                                    </span>
                                    <p className="font-bold text-white">{selectedLawyer.experience}</p>
                                </div>
                            </div>

                            <div className="p-3.5 rounded-2xl bg-neutral-950 border border-white/5 space-y-2">
                                <div className="flex items-center gap-2 text-neutral-300">
                                    <Mail size={14} className="text-amber-400" />
                                    <span>{selectedLawyer.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-neutral-300">
                                    <Phone size={14} className="text-amber-400" />
                                    <span>{selectedLawyer.phone}</span>
                                </div>
                            </div>

                            {/* Status Controls */}
                            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                                <label className="text-[10px] uppercase font-bold text-amber-400">
                                    Manage Account Status
                                </label>
                                <div className="flex gap-2 pt-1">
                                    <button
                                        onClick={() => handleStatusChange(selectedLawyer.id, "Verified")}
                                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${selectedLawyer.status === "Verified"
                                                ? "bg-emerald-500 text-neutral-950"
                                                : "bg-neutral-950 text-neutral-300 hover:bg-neutral-800"
                                            }`}
                                    >
                                        Verify
                                    </button>
                                    <button
                                        onClick={() => handleStatusChange(selectedLawyer.id, "Suspended")}
                                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${selectedLawyer.status === "Suspended"
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