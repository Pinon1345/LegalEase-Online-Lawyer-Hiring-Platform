'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    CreditCard,
    Search,
    DollarSign,
    CheckCircle2,
    Calendar,
    User,
    ShieldCheck,
    Filter,
    Copy,
    Check,
    RefreshCw
} from 'lucide-react';
import { baseURL } from '@/lib/api/baseUrl';
import { useSession } from '@/lib/auth-client';

export default function ClientTransactionsPage() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [copiedId, setCopiedId] = useState(null);
    const [refreshIndex, setRefreshIndex] = useState(0);

    // Safely retrieve and normalize client email

    const { data: session } = useSession();
    const userEmail = session?.user?.email;

    // Async data fetching inside effect (No sync setState warning!)

    useEffect(() => {
        let isMounted = true;

        async function getTransactions() {
            if (!userEmail) {
                setLoading(false);
                return;
            }

            setLoading(true);

            try {
                const cleanEmail = userEmail.trim().toLowerCase();
                const res = await fetch(`${baseURL}/api/client/transactions?email=${encodeURIComponent(cleanEmail)}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    cache: 'no-store',
                });

                if (res.ok && isMounted) {
                    const data = await res.json();
                    const txList = Array.isArray(data)
                        ? data
                        : (data.transactions || data.data || []);

                    setTransactions(txList);
                } else if (isMounted) {
                    console.error('Failed to fetch transactions. Status:', res.status);
                }
            } catch (err) {
                if (isMounted) console.error('Error fetching transactions:', err);
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        getTransactions();

        return () => {
            isMounted = false;
        };
    }, [userEmail, refreshIndex]);

    // Manual refresh button handler (increments key to re-trigger effect safely)

    const handleRefresh = () => {
        setRefreshIndex(prev => prev + 1);
    };

    // Copy Transaction ID to Clipboard
    const handleCopy = (id) => {
        if (!id) return;
        navigator.clipboard.writeText(id);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    // Derived Statistics
    const stats = useMemo(() => {
        const totalSpent = transactions.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
        const successfulCount = transactions.filter(t => (t.paymentStatus || 'paid').toLowerCase() === 'paid').length;
        const totalCount = transactions.length;

        return {
            totalSpent,
            successfulCount,
            totalCount
        };
    }, [transactions]);

    // Filtered Transactions
    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            const matchesSearch =
                (t.lawyerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (t.transactionId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (t.paymentType || '').toLowerCase().includes(searchTerm.toLowerCase());

            const status = (t.paymentStatus || 'paid').toLowerCase();
            const matchesStatus = statusFilter === 'all' || status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [transactions, searchTerm, statusFilter]);

    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-10 space-y-8 bg-background text-text">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-bold uppercase tracking-wider mb-2">
                        <ShieldCheck size={14} /> Financial Records
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                        Transaction <span className="text-secondary">History</span>
                    </h1>
                    <p className="text-text-secondary text-sm sm:text-base mt-1">
                        Track, manage, and verify all your legal consultation payments and retainers.
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

            {/* Overview Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {/* Total Investment Card */}
                <div className="relative overflow-hidden p-6 rounded-3xl border border-secondary/20 bg-gradient-to-br from-surface to-secondary/5 dark:from-neutral-900 dark:to-neutral-900/50 shadow-xl">
                    <div className="absolute top-0 right-0 -mr-6 -mt-6 w-28 h-28 rounded-full bg-secondary/10 blur-2xl pointer-events-none" />
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Total Investment</span>
                        <div className="p-2.5 rounded-2xl bg-secondary/10 text-secondary">
                            <DollarSign size={20} />
                        </div>
                    </div>
                    <div className="text-3xl sm:text-4xl font-black">
                        ${stats.totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <p className="text-xs text-text-secondary mt-2">Across all legal consultations</p>
                </div>

                {/* Successful Payments */}
                <div className="relative overflow-hidden p-6 rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-surface to-emerald-500/5 dark:from-neutral-900 dark:to-neutral-900/50 shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Completed Transactions</span>
                        <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-500">
                            <CheckCircle2 size={20} />
                        </div>
                    </div>
                    <div className="text-3xl sm:text-4xl font-black text-emerald-500">
                        {stats.successfulCount}
                    </div>
                    <p className="text-xs text-text-secondary mt-2">Verified on payment gateway</p>
                </div>

                {/* Total Bookings Paid */}
                <div className="relative overflow-hidden p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-surface dark:bg-neutral-900 shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Total Records</span>
                        <div className="p-2.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-text">
                            <CreditCard size={20} />
                        </div>
                    </div>
                    <div className="text-3xl sm:text-4xl font-black">
                        {stats.totalCount}
                    </div>
                    <p className="text-xs text-text-secondary mt-2">Total logs generated</p>
                </div>
            </div>

            {/* Filter and Search Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-surface dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
                <div className="relative w-full sm:w-80">
                    <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" />
                    <input
                        type="text"
                        placeholder="Search attorney or TxID..."
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

            {/* Main Table / List Container */}
            <div className="rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-surface dark:bg-neutral-900 shadow-xl overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center space-y-4">
                        <RefreshCw size={32} className="animate-spin text-secondary mx-auto" />
                        <p className="text-text-secondary text-sm font-medium">Fetching payment records...</p>
                    </div>
                ) : filteredTransactions.length === 0 ? (
                    <div className="p-12 text-center space-y-4">
                        <div className="inline-flex p-4 rounded-full bg-secondary/10 text-secondary mb-2">
                            <CreditCard size={36} />
                        </div>
                        <h3 className="text-xl font-bold">No Transactions Found</h3>
                        <p className="text-text-secondary text-sm max-w-sm mx-auto">
                            {searchTerm || statusFilter !== 'all'
                                ? 'No payment records match your search or filter criteria.'
                                : 'You haven’t completed any attorney booking payments yet.'}
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-neutral-200 dark:border-neutral-800 text-xs font-bold uppercase tracking-wider text-text-secondary bg-neutral-50/50 dark:bg-neutral-800/30">
                                        <th className="p-5">Attorney / Service</th>
                                        <th className="p-5">Type</th>
                                        <th className="p-5">Date & Time</th>
                                        <th className="p-5">Transaction ID</th>
                                        <th className="p-5">Amount</th>
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
                                                            <div className="font-bold text-text">{tx.lawyerName || 'Attorney Consultation'}</div>
                                                            <div className="text-xs text-text-secondary">{tx.clientEmail}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-5">
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold uppercase text-text-secondary">
                                                        {tx.paymentType || 'booking'}
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
                                                            title="Copy Transaction ID"
                                                        >
                                                            {copiedId === tx.transactionId ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="p-5 font-black text-text text-base">
                                                    ${(Number(tx.amount) || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
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

                        {/* Mobile Cards View */}
                        <div className="block md:hidden divide-y divide-neutral-200 dark:divide-neutral-800">
                            {filteredTransactions.map((tx) => {
                                const date = tx.createdAt || tx.paidAt || tx.bookingDate;
                                const formattedDate = date ? new Date(date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                }) : 'N/A';

                                return (
                                    <div key={tx._id || tx.transactionId} className="p-5 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2.5">
                                                <div className="h-9 w-9 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary font-bold">
                                                    <User size={16} />
                                                </div>
                                                <span className="font-bold text-text">{tx.lawyerName || 'Attorney Consultation'}</span>
                                            </div>
                                            <span className="text-lg font-black text-text">
                                                ${(Number(tx.amount) || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between text-xs text-text-secondary">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={13} className="text-secondary" /> {formattedDate}
                                            </span>
                                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold uppercase">
                                                {tx.paymentStatus || 'Paid'}
                                            </span>
                                        </div>

                                        <div className="pt-2 flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800 text-xs font-mono text-text-secondary">
                                            <span className="truncate max-w-[200px]">TxID: {tx.transactionId}</span>
                                            <button onClick={() => handleCopy(tx.transactionId)} className="text-secondary font-sans font-bold cursor-pointer">
                                                {copiedId === tx.transactionId ? 'Copied' : 'Copy'}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}