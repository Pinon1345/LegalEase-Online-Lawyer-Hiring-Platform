"use client";

import React, { useMemo, useState, useEffect, useCallback } from "react";
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
    Loader2,
    AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";
import { baseURL } from "@/lib/api/baseUrl";
import { getTokenServer } from "@/lib/getTokenServer";

export default function AdminAllTransaction() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [selectedTxn, setSelectedTxn] = useState(null);

    // Standard React state for data fetching
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    // Standalone function used for manual retries / refresh
    const fetchTransactions = useCallback(async () => {
        setIsLoading(true);
        setIsError(false);
        try {
            const res = await fetch(`${baseURL}/api/transactions`);
            if (!res.ok) {
                throw new Error("Failed to fetch transactions");
            }
            const data = await res.json();
            setTransactions(data);
        } catch (error) {
            console.error(error);
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Initial mount fetch handled cleanly without synchronous lint triggers
    useEffect(() => {
        let isMounted = true;

        const loadInitialData = async () => {
            try {
                const token = await getTokenServer();
                const res = await fetch(`${baseURL}/api/transactions`, {
                    headers: {
                        authorization: `Bearer ${token}`
                    }
                });
                if (!res.ok) {
                    throw new Error("Failed to fetch transactions");
                }
                const data = await res.json();
                if (isMounted) {
                    setTransactions(data);
                }
            } catch (error) {
                console.error(error);
                if (isMounted) {
                    setIsError(true);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        loadInitialData();

        return () => {
            isMounted = false;
        };
    }, []);

    // Normalized Data Array with Safe Fallbacks
    const normalizedTransactions = useMemo(() => {
        if (!Array.isArray(transactions)) return [];

        return transactions.map((txn) => {
            const dateVal = txn.date || txn.createdAt;
            return {
                id: txn.id || txn._id || "N/A",
                userEmail: txn.userEmail || txn.clientEmail || "N/A",
                lawyerEmail: txn.lawyerEmail || "N/A",
                clientName: txn.clientName || txn.userName || "N/A",
                lawyerName: txn.lawyerName || "N/A",
                service: txn.service || txn.serviceName || "Consultation",
                amount: Number(txn.amount) || 0,
                platformFee: Number(txn.platformFee) || (Number(txn.amount) || 0) * 0.1,
                status: txn.status || "Pending",
                paymentMethod: txn.paymentMethod || "Stripe",
                date: dateVal ? new Date(dateVal).toLocaleString() : "N/A",
            };
        });
    }, [transactions]);

    // Filter Logic
    const filteredTransactions = useMemo(() => {
        return normalizedTransactions.filter((txn) => {
            const matchesSearch =
                txn.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                txn.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                txn.lawyerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                txn.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                txn.lawyerName.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus =
                statusFilter === "All" ||
                txn.status.toLowerCase() === statusFilter.toLowerCase();

            return matchesSearch && matchesStatus;
        });
    }, [normalizedTransactions, searchTerm, statusFilter]);

    // Dynamic Aggregate Metrics
    const totalVolume = useMemo(() => {
        return normalizedTransactions.reduce(
            (sum, item) => (item.status === "Completed" ? sum + item.amount : sum),
            50000
        );
    }, [normalizedTransactions]);

    const totalPlatformFees = useMemo(() => {
        return normalizedTransactions.reduce(
            (sum, item) => (item.status === "Completed" ? sum + item.platformFee : sum),
            0
        );
    }, [normalizedTransactions]);

    const totalIssues = useMemo(() => {
        return normalizedTransactions.filter(
            (t) => t.status === "Refunded" || t.status === "Failed"
        ).length;
    }, [normalizedTransactions]);

    // CSV Export Handler
    const handleExportCSV = () => {
        if (!filteredTransactions.length) {
            toast.error("No transaction records available to export");
            return;
        }

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
            `"${t.date}"`,
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
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-neutral-500/10 text-neutral-400 border border-neutral-500/20">
                        {status}
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
                            Financial Management
                        </span>
                    </div>
                    <h1 className="text-3xl font-black text-gray-800 dark:text-white mt-2">
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

            {/* Dynamic Summary Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-3xl bg-slate-100 dark:bg-neutral-900/60 border border-white/10 backdrop-blur-xl space-y-2 shadow-xl">
                    <div className="flex items-center justify-between">
                        <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400">
                            <DollarSign size={20} />
                        </div>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                            Settled Volume
                        </span>
                    </div>
                    <p className="text-xs text-neutral-400 font-medium">Gross Processed</p>
                    <h3 className="text-2xl font-black text-gray-600 dark:text-white">${totalVolume.toFixed(2)}</h3>
                </div>

                <div className="p-5 rounded-3xl bg-slate-100 dark:bg-neutral-900/60 border border-white/10 backdrop-blur-xl space-y-2 shadow-xl">
                    <div className="flex items-center justify-between">
                        <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400">
                            <TrendingUp size={20} />
                        </div>
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                            Platform Cut
                        </span>
                    </div>
                    <p className="text-xs text-neutral-400 font-medium">Net Commission</p>
                    <h3 className="text-2xl font-black text-gray-600 dark:text-white">${totalPlatformFees.toFixed(2)}</h3>
                </div>

                <div className="p-5 rounded-3xl bg-slate-100 dark:bg-neutral-900/60 border border-white/10 backdrop-blur-xl space-y-2 shadow-xl">
                    <div className="flex items-center justify-between">
                        <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-400">
                            <CreditCard size={20} />
                        </div>
                        <span className="text-[10px] font-bold text-neutral-400">Total Records</span>
                    </div>
                    <p className="text-xs text-neutral-400 font-medium">Total Transactions</p>
                    <h3 className="text-2xl font-black text-gray-600 dark:text-white">{normalizedTransactions.length}</h3>
                </div>

                <div className="p-5 rounded-3xl bg-slate-100 dark:bg-neutral-900/60 border border-white/10 backdrop-blur-xl space-y-2 shadow-xl">
                    <div className="flex items-center justify-between">
                        <div className="p-2.5 rounded-2xl bg-rose-500/10 text-rose-400">
                            <RotateCcw size={20} />
                        </div>
                        <span className="text-[10px] font-bold text-rose-400">Issues</span>
                    </div>
                    <p className="text-xs text-neutral-400 font-medium">Refunded / Failed</p>
                    <h3 className="text-2xl font-black text-gray-600 dark:text-white">{totalIssues}</h3>
                </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="p-4 rounded-3xl bg-slate-100 dark:bg-neutral-900/60 border border-white/10 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
                <div className="relative w-full md:w-96">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                        type="text"
                        placeholder="Search by ID, user email, or lawyer email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-200 dark:bg-neutral-950/80 border border-white/10 text-gray-600 dark:text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-amber-500/50 transition"
                    />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                    <span className="text-xs text-neutral-700 dark:text-neutral-500 flex items-center gap-1 mr-1">
                        <Filter size={13} /> Status:
                    </span>
                    {["All", "Completed", "Pending", "Refunded", "Failed"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${statusFilter === status
                                ? "bg-amber-500 text-neutral-950 shadow-md"
                                : "bg-slate-200 dark:bg-neutral-950/60 text-neutral-600 dark:text-neutral-400 hover:text-white hover:bg-neutral-800"
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Transactions Table Section */}
            <div className="rounded-3xl border border-white/10 bg-slate-100 dark:bg-neutral-900/50 backdrop-blur-xl overflow-hidden shadow-2xl">
                {isLoading ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-3 text-amber-400">
                        <Loader2 className="animate-spin" size={32} />
                        <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">Fetching live transaction logs...</span>
                    </div>
                ) : isError ? (
                    <div className="py-16 flex flex-col items-center justify-center gap-3 text-rose-400">
                        <AlertTriangle size={32} />
                        <span className="text-sm font-semibold">Failed to load transactions from API.</span>
                        <button
                            onClick={fetchTransactions}
                            className="px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-bold text-rose-400 hover:bg-rose-500/20 transition cursor-pointer"
                        >
                            Try Again
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 bg-slate-200 dark:bg-neutral-950/60 border-b-amber-400 dark:border-b-amber-600 text-[12px] font-black uppercase tracking-wider text-neutral-800 dark:text-neutral-400">
                                    <th className="py-4 px-6">Transaction ID</th>
                                    <th className="py-4 px-6">User Email</th>
                                    <th className="py-4 px-6">Lawyer Tnx. ID</th>
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
                                            <td className="py-4 px-6 font-mono font-bold text-amber-400">
                                                {txn.id}
                                            </td>

                                            <td className="py-4 px-6">
                                                <div className="text-gray-800 dark:text-white font-medium">{txn.userEmail}</div>
                                                <div className="text-[10px] text-neutral-500">{txn.clientName}</div>
                                            </td>

                                            <td className="py-4 px-6">
                                                <div className="text-gray-800 dark:text-white font-medium">{txn.lawyerEmail}</div>
                                                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">{txn.lawyerName}</div>
                                            </td>

                                            <td className="py-4 px-6">
                                                <div className="font-extrabold text-gray-800 dark:text-white">${txn.amount.toFixed(2)}</div>
                                                <div className="mt-0.5">{getStatusBadge(txn.status)}</div>
                                            </td>

                                            <td className="py-4 px-6 text-neutral-600 dark:text-neutral-400 font-mono text-[11px]">
                                                {txn.date}
                                            </td>

                                            <td className="py-4 px-6 text-right">
                                                <button
                                                    onClick={() => setSelectedTxn(txn)}
                                                    className="p-2 rounded-xl bg-white/5 hover:bg-amber-500 hover:text-neutral-950 dark:text-neutral-300 text-neutral-500 transition cursor-pointer"
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
                )}
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