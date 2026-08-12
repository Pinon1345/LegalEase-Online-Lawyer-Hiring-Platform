'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
    DollarSign,
    Search,
    TrendingUp,
    Calendar,
    User,
    CheckCircle2,
    Filter,
    Copy,
    Check,
    RefreshCw,
    Receipt,
    Wallet
} from 'lucide-react';
import { baseURL } from '@/lib/api/baseUrl';

export default function LawyerInvoicesView({ user }) {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [copiedId, setCopiedId] = useState(null);
    const [refreshIndex, setRefreshIndex] = useState(0);

    // 🟢 1. Extract Lawyer ID (Handles various user object structures)
    const lawyerId = user?._id || user?.id || user?.lawyerId || user?.user?._id || user?.user?.id;
    console.log("Fetching for Lawyer ID:", lawyerId);

    useEffect(() => {
        let isMounted = true;

        async function fetchLawyerTransactions() {
            if (!lawyerId) {
                setLoading(false);
                return;
            }

            setLoading(true);

            try {
                // 🟢 2. Fetch using ?lawyerId= instead of ?email=
                const res = await fetch(`${baseURL}/api/lawyer/transactions?lawyerId=${encodeURIComponent(lawyerId)}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    cache: 'no-store'
                });

                if (res.ok && isMounted) {
                    const data = await res.json();
                    const txList = Array.isArray(data)
                        ? data
                        : (data.transactions || data.data || []);

                    setTransactions(txList);
                } else if (isMounted) {
                    console.error('Failed to fetch lawyer transactions. Status:', res.status);
                }
            } catch (err) {
                if (isMounted) console.error('Error fetching lawyer transactions:', err);
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        fetchLawyerTransactions();

        return () => {
            isMounted = false;
        };
    }, [lawyerId, refreshIndex]); // 🟢 3. Updated dependency array

    const handleRefresh = () => {
        setRefreshIndex(prev => prev + 1);
    };

    const handleCopy = (id) => {
        if (!id) return;
        navigator.clipboard.writeText(id);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    // Calculate revenue stats
    const stats = useMemo(() => {
        const totalEarned = transactions.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
        const completedCount = transactions.filter(t => (t.paymentStatus || 'paid').toLowerCase() === 'paid').length;
        const totalInvoices = transactions.length;

        return {
            totalEarned,
            completedCount,
            totalInvoices
        };
    }, [transactions]);

    // Filter transactions
    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            const matchesSearch =
                (t.clientName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (t.clientEmail || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (t.transactionId || '').toLowerCase().includes(searchTerm.toLowerCase());

            const status = (t.paymentStatus || 'paid').toLowerCase();
            const matchesStatus = statusFilter === 'all' || status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [transactions, searchTerm, statusFilter]);

    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-10 space-y-8 bg-background text-text">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-bold uppercase tracking-wider mb-2">
                        <Wallet size={14} /> Earnings & Invoices
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                        Invoices & <span className="text-secondary">Billing</span>
                    </h1>
                    <p className="text-text-secondary text-sm sm:text-base mt-1">
                        Review consultation earnings, client payments, and verified billing logs.
                    </p>
                </div>

                <button
                    onClick={handleRefresh}
                    disabled={loading}
                    className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-surface dark:bg-neutral-800 text-sm font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-700/50 transition-all cursor-pointer shadow-sm disabled:opacity-50"
                >
                    <RefreshCw size={16} className={loading ? 'animate-spin text-secondary' : ''} />
                    Refresh
                </button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="relative overflow-hidden p-6 rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-surface to-emerald-500/5 dark:from-neutral-900 dark:to-neutral-900/50 shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Total Revenue</span>
                        <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-500">
                            <TrendingUp size={20} />
                        </div>
                    </div>
                    <div className="text-3xl sm:text-4xl font-black text-emerald-500">
                        ${stats.totalEarned.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <p className="text-xs text-text-secondary mt-2">Gross income from client bookings</p>
                </div>

                <div className="relative overflow-hidden p-6 rounded-3xl border border-secondary/20 bg-gradient-to-br from-surface to-secondary/5 dark:from-neutral-900 dark:to-neutral-900/50 shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Cleared Payments</span>
                        <div className="p-2.5 rounded-2xl bg-secondary/10 text-secondary">
                            <CheckCircle2 size={20} />
                        </div>
                    </div>
                    <div className="text-3xl sm:text-4xl font-black">
                        {stats.completedCount}
                    </div>
                    <p className="text-xs text-text-secondary mt-2">Successful payment transactions</p>
                </div>

                <div className="relative overflow-hidden p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-surface dark:bg-neutral-900 shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Total Invoices</span>
                        <div className="p-2.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-text">
                            <Receipt size={20} />
                        </div>
                    </div>
                    <div className="text-3xl sm:text-4xl font-black">
                        {stats.totalInvoices}
                    </div>
                    <p className="text-xs text-text-secondary mt-2">All recorded billing statements</p>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-surface dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
                <div className="relative w-full sm:w-80">
                    <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" />
                    <input
                        type="text"
                        placeholder="Search client or TxID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all"
                    />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                    <Filter size={16} className="text-text-secondary shrink-0" />
                    {['all', 'paid', 'pending'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all shrink-0 cursor-pointer ${statusFilter === status
                                ? 'bg-secondary text-surface-dark shadow-md'
                                : 'bg-background hover:bg-neutral-100 dark:hover:bg-neutral-800 text-text-secondary'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table / List Container */}
            <div className="rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-surface dark:bg-neutral-900 shadow-xl overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center space-y-4">
                        <RefreshCw size={32} className="animate-spin text-secondary mx-auto" />
                        <p className="text-text-secondary text-sm font-medium">Loading invoice records...</p>
                    </div>
                ) : filteredTransactions.length === 0 ? (
                    <div className="p-12 text-center space-y-4">
                        <div className="inline-flex p-4 rounded-full bg-secondary/10 text-secondary mb-2">
                            <Receipt size={36} />
                        </div>
                        <h3 className="text-xl font-bold">No Invoices Found</h3>
                        <p className="text-text-secondary text-sm max-w-sm mx-auto">
                            {searchTerm || statusFilter !== 'all'
                                ? 'No billing records match your search query.'
                                : 'You have not received any client payments yet.'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-neutral-200 dark:border-neutral-800 text-xs font-bold uppercase tracking-wider text-text-secondary bg-neutral-50/50 dark:bg-neutral-800/30">
                                    <th className="p-5">Client</th>
                                    <th className="p-5">Service</th>
                                    <th className="p-5">Date</th>
                                    <th className="p-5">Transaction ID</th>
                                    <th className="p-5">Amount Earned</th>
                                    <th className="p-5 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 text-sm">
                                {filteredTransactions.map((tx) => {
                                    const date = tx.createdAt || tx.paidAt || tx.bookingDate;
                                    const formattedDate = date ? new Date(date).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    }) : 'N/A';

                                    const isPaid = (tx.paymentStatus || 'paid').toLowerCase() === 'paid';

                                    return (
                                        <tr key={tx._id || tx.transactionId} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/40 transition-colors">
                                            <td className="p-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary font-bold shrink-0">
                                                        <User size={18} />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-text">{tx.clientName || 'Client Consultation'}</div>
                                                        <div className="text-xs font-bold text-purple-600">{tx.clientEmail}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold uppercase text-text-secondary">
                                                    {tx.paymentType || 'consultation'}
                                                </span>
                                            </td>
                                            <td className="p-5 text-text-secondary">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={14} className="text-secondary" />
                                                    <span>{formattedDate}</span>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <div className="flex items-center gap-2 font-mono text-xs text-text-secondary">
                                                    <span className="truncate max-w-[130px]">{tx.transactionId}</span>
                                                    <button
                                                        onClick={() => handleCopy(tx.transactionId)}
                                                        className="p-1 hover:text-secondary rounded transition-colors cursor-pointer"
                                                        title="Copy TxID"
                                                    >
                                                        {copiedId === tx.transactionId ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="p-5 font-black text-emerald-500 text-base">
                                                +${(Number(tx.amount) || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="p-5 text-right">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isPaid
                                                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                                    : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                                    }`}>
                                                    <CheckCircle2 size={12} />
                                                    {tx.paymentStatus || 'Paid'}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}