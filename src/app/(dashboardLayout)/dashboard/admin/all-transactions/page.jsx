"use client";

import React, { useState, useMemo } from "react";
import {
    CreditCard,
    Search,
    Filter,
    CheckCircle2,
    Clock,
    XCircle,
    RotateCcw,
    DollarSign,
    TrendingUp,
    Eye,
    User,
    Scale,
    FileSpreadsheet,
} from "lucide-react";
import toast from "react-hot-toast";

// Mock Transaction Data
const INITIAL_TRANSACTIONS = [
    {
        id: "TXN-902418",
        userEmail: "john.doe@example.com",
        lawyerEmail: "sarah.j@legalease.com",
        clientName: "John Doe",
        lawyerName: "Adv. Sarah Jenkins",
        service: "Corporate Legal Consultation",
        amount: 150.0,
        platformFee: 15.0,
        status: "Completed",
        paymentMethod: "Credit Card (Stripe)",
        date: "2026-08-14 14:22",
    },
    {
        id: "TXN-902419",
        userEmail: "m.chang@example.com",
        lawyerEmail: "tariq.r@legalease.com",
        clientName: "Michael Chang",
        lawyerName: "Adv. Tariq Rahman",
        service: "Criminal Defense Review",
        amount: 300.0,
        platformFee: 30.0,
        status: "Completed",
        paymentMethod: "PayPal",
        date: "2026-08-14 11:05",
    },
    {
        id: "TXN-902420",
        userEmail: "sophia.m@example.com",
        lawyerEmail: "elena.r@legalease.com",
        clientName: "Sophia Martinez",
        lawyerName: "Adv. Elena Rostova",
        service: "IP & Trademark Filing",
        amount: 450.0,
        platformFee: 45.0,
        status: "Pending",
        paymentMethod: "Bank Transfer",
        date: "2026-08-13 18:40",
    },
    {
        id: "TXN-902421",
        userEmail: "d.miller@example.com",
        lawyerEmail: "sarah.j@legalease.com",
        clientName: "David Miller",
        lawyerName: "Adv. Sarah Jenkins",
        service: "Contract Drafting",
        amount: 200.0,
        platformFee: 20.0,
        status: "Refunded",
        paymentMethod: "Credit Card (Stripe)",
        date: "2026-08-12 09:15",
    },
    {
        id: "TXN-902422",
        userEmail: "emma.w@example.com",
        lawyerEmail: "tariq.r@legalease.com",
        clientName: "Emma Watson",
        lawyerName: "Adv. Tariq Rahman",
        service: "Bail Hearing Consultation",
        amount: 180.0,
        platformFee: 18.0,
        status: "Failed",
        paymentMethod: "Credit Card (Stripe)",
        date: "2026-08-11 16:50",
    },
];

export default function AdminAllTransaction() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [selectedTxn, setSelectedTxn] = useState(null);

    // Filter Logic
    const filteredTransactions = useMemo(() => {
        return INITIAL_TRANSACTIONS.filter((txn) => {
            const matchesSearch =
                txn.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                txn.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                txn.lawyerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                txn.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                txn.lawyerName.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus =
                statusFilter === "All" || txn.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [searchTerm, statusFilter]);

    // Aggregate Metrics
    const totalVolume = useMemo(() => {
        return INITIAL_TRANSACTIONS.reduce(
            (sum, item) => (item.status === "Completed" ? sum + item.amount : sum),
            0
        );
    }, []);

    const totalPlatformFees = useMemo(() => {
        return INITIAL_TRANSACTIONS.reduce(
            (sum, item) => (item.status === "Completed" ? sum + item.platformFee : sum),
            0
        );
    }, []);

    // CSV Export Handler
    const handleExportCSV = () => {
        const headers = [
            "Transaction ID",
            "User Email",
            "Lawyer Email",
            "Amount ($)",
            "Status",
            "Date",
        ];

        const rows = filteredTransactions.map((t) => [
            t.id,
            `"${t.userEmail}"`,
            `"${t.lawyerEmail}"`,
            t.amount,
            t.status,
            t.date,
        ]);

        const csvContent =
            "data:text/csv;charset=utf-8," +
            [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `LegalEase_Transactions_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success("Transaction log exported to CSV");
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "Completed":
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 size={12} /> Completed
                    </span>
                );
            case "Pending":
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <Clock size={12} /> Pending
                    </span>
                );
            case "Refunded":
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        <RotateCcw size={12} /> Refunded
                    </span>
                );
            case "Failed":
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        <XCircle size={12} /> Failed
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
                            Financial Management
                        </span>
                    </div>
                    <h1 className="text-3xl font-black text-white mt-2">
                        View All Transactions
                    </h1>
                    <p className="text-xs text-neutral-400">
                        Comprehensive history of all payment records processed on LegalEase.
                    </p>
                </div>

                <button
                    onClick={handleExportCSV}
                    className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition duration-300 shadow-lg shadow-amber-500/10 cursor-pointer"
                >
                    <FileSpreadsheet size={16} /> Export Ledger (.CSV)
                </button>
            </div>

            {/* Summary Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-3xl bg-neutral-900/60 border border-white/10 backdrop-blur-xl space-y-2 shadow-xl">
                    <div className="flex items-center justify-between">
                        <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400">
                            <DollarSign size={20} />
                        </div>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                            Settled Volume
                        </span>
                    </div>
                    <p className="text-xs text-neutral-400 font-medium">Gross Processed</p>
                    <h3 className="text-2xl font-black text-white">${totalVolume.toFixed(2)}</h3>
                </div>

                <div className="p-5 rounded-3xl bg-neutral-900/60 border border-white/10 backdrop-blur-xl space-y-2 shadow-xl">
                    <div className="flex items-center justify-between">
                        <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400">
                            <TrendingUp size={20} />
                        </div>
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                            Platform Cut (10%)
                        </span>
                    </div>
                    <p className="text-xs text-neutral-400 font-medium">Net Commission</p>
                    <h3 className="text-2xl font-black text-white">${totalPlatformFees.toFixed(2)}</h3>
                </div>

                <div className="p-5 rounded-3xl bg-neutral-900/60 border border-white/10 backdrop-blur-xl space-y-2 shadow-xl">
                    <div className="flex items-center justify-between">
                        <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-400">
                            <CreditCard size={20} />
                        </div>
                        <span className="text-[10px] font-bold text-neutral-400">Total Records</span>
                    </div>
                    <p className="text-xs text-neutral-400 font-medium">Total Transactions</p>
                    <h3 className="text-2xl font-black text-white">{INITIAL_TRANSACTIONS.length}</h3>
                </div>

                <div className="p-5 rounded-3xl bg-neutral-900/60 border border-white/10 backdrop-blur-xl space-y-2 shadow-xl">
                    <div className="flex items-center justify-between">
                        <div className="p-2.5 rounded-2xl bg-rose-500/10 text-rose-400">
                            <RotateCcw size={20} />
                        </div>
                        <span className="text-[10px] font-bold text-rose-400">Issues</span>
                    </div>
                    <p className="text-xs text-neutral-400 font-medium">Refunded / Failed</p>
                    <h3 className="text-2xl font-black text-white">2</h3>
                </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="p-4 rounded-3xl bg-neutral-900/60 border border-white/10 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
                {/* Search */}
                <div className="relative w-full md:w-96">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                        type="text"
                        placeholder="Search by ID, user email, or lawyer email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-neutral-950/80 border border-white/10 text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-amber-500/50 transition"
                    />
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                    <span className="text-xs text-neutral-500 flex items-center gap-1 mr-1">
                        <Filter size={13} /> Status:
                    </span>
                    {["All", "Completed", "Pending", "Refunded", "Failed"].map((status) => (
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

            {/* Requirements-Compliant Transactions Table */}
            <div className="rounded-3xl border border-white/10 bg-neutral-900/50 backdrop-blur-xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 bg-neutral-950/60 text-[11px] font-black uppercase tracking-wider text-neutral-400">
                                <th className="py-4 px-6">Transaction ID</th>
                                <th className="py-4 px-6">User Email</th>
                                <th className="py-4 px-6">Lawyer Email</th>
                                <th className="py-4 px-6">Amount</th>
                                <th className="py-4 px-6">Date</th>
                                <th className="py-4 px-6 text-right">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-xs">
                            {filteredTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-neutral-500">
                                        No transaction records matched your search parameters.
                                    </td>
                                </tr>
                            ) : (
                                filteredTransactions.map((txn) => (
                                    <tr
                                        key={txn.id}
                                        className="hover:bg-white/[0.02] transition duration-200"
                                    >
                                        {/* Transaction ID */}
                                        <td className="py-4 px-6 font-mono font-bold text-amber-400">
                                            {txn.id}
                                        </td>

                                        {/* User Email */}
                                        <td className="py-4 px-6">
                                            <div className="text-white font-medium">{txn.userEmail}</div>
                                            <div className="text-[10px] text-neutral-500">{txn.clientName}</div>
                                        </td>

                                        {/* Lawyer Email */}
                                        <td className="py-4 px-6">
                                            <div className="text-white font-medium">{txn.lawyerEmail}</div>
                                            <div className="text-[10px] text-neutral-500">{txn.lawyerName}</div>
                                        </td>

                                        {/* Amount */}
                                        <td className="py-4 px-6">
                                            <div className="font-extrabold text-white">${txn.amount.toFixed(2)}</div>
                                            <div className="mt-0.5">{getStatusBadge(txn.status)}</div>
                                        </td>

                                        {/* Date */}
                                        <td className="py-4 px-6 text-neutral-400 font-mono text-[11px]">
                                            {txn.date}
                                        </td>

                                        {/* Action */}
                                        <td className="py-4 px-6 text-right">
                                            <button
                                                onClick={() => setSelectedTxn(txn)}
                                                className="p-2 rounded-xl bg-white/5 hover:bg-amber-500 hover:text-neutral-950 text-neutral-300 transition cursor-pointer"
                                                title="Inspect full transaction"
                                            >
                                                <Eye size={15} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detail Modal */}
            {selectedTxn && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md animate-fade-in">
                    <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl space-y-6 relative">
                        <button
                            onClick={() => setSelectedTxn(null)}
                            className="absolute top-6 right-6 text-neutral-400 hover:text-white cursor-pointer"
                        >
                            ✕
                        </button>

                        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                <CreditCard size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white">Transaction Details</h3>
                                <p className="text-xs text-neutral-400 font-mono">{selectedTxn.id}</p>
                            </div>
                        </div>

                        <div className="space-y-4 text-xs">
                            <div className="flex justify-between items-center p-3 rounded-2xl bg-neutral-950 border border-white/5">
                                <span className="text-neutral-400">Payment Status</span>
                                {getStatusBadge(selectedTxn.status)}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 rounded-2xl bg-neutral-950 border border-white/5 space-y-1">
                                    <span className="text-[10px] uppercase font-bold text-neutral-500 flex items-center gap-1">
                                        <User size={12} /> User / Client
                                    </span>
                                    <p className="font-bold text-white">{selectedTxn.clientName}</p>
                                    <p className="text-[10px] text-neutral-400 truncate">{selectedTxn.userEmail}</p>
                                </div>

                                <div className="p-3 rounded-2xl bg-neutral-950 border border-white/5 space-y-1">
                                    <span className="text-[10px] uppercase font-bold text-neutral-500 flex items-center gap-1">
                                        <Scale size={12} /> Lawyer
                                    </span>
                                    <p className="font-bold text-white">{selectedTxn.lawyerName}</p>
                                    <p className="text-[10px] text-neutral-400 truncate">{selectedTxn.lawyerEmail}</p>
                                </div>
                            </div>

                            <div className="p-3 rounded-2xl bg-neutral-950 border border-white/5 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-neutral-400">Service</span>
                                    <span className="text-white font-medium">{selectedTxn.service}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-400">Payment Gateway</span>
                                    <span className="text-amber-400 font-medium">{selectedTxn.paymentMethod}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-400">Timestamp</span>
                                    <span className="text-neutral-300 font-mono">{selectedTxn.date}</span>
                                </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                                <div className="flex justify-between text-neutral-300">
                                    <span>Gross Amount Paid</span>
                                    <span className="font-bold text-white">${selectedTxn.amount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-emerald-400 font-bold border-t border-amber-500/20 pt-2">
                                    <span>Platform Fee Earned</span>
                                    <span>+${selectedTxn.platformFee.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                onClick={() => setSelectedTxn(null)}
                                className="w-full py-3 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                            >
                                Close Receipt
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
