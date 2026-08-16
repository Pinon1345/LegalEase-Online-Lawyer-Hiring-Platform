"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
    Users,
    Search,
    Filter,
    Trash2,
    ShieldAlert,
    UserCheck,
    Scale,
    ShieldCheck,
    Clock,
    CheckCircle2,
    ArrowRight,
    ExternalLink,
    DollarSign,
    Briefcase,
    RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";
import { baseURL } from "@/lib/api/baseUrl";

export default function AdminOverview() {
    const router = useRouter();

    const [users, setUsers] = useState([]);
    const [lawyers, setLawyers] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [hires, setHires] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("All");
    const [userToDelete, setUserToDelete] = useState(null);

    // Helper: Safely derive user display name
    const getUserDisplayName = (user) => {
        if (!user) return "Unnamed Client";
        if (user.lawyerName) return user.lawyerName;
        if (user.clientName) return user.clientName;
        if (user.name) return user.name;
        const constructed = [user.firstName, user.middleName, user.lastName]
            .filter(Boolean)
            .join(" ")
            .trim();
        return constructed || user.email || "Unnamed Client";
    };

    // Helper: Safely derive user avatar URL
    const getUserAvatar = (user) => {
        if (!user) return "https://i.pravatar.cc/150";
        return user.image || user.imageUrl || user.avatar || "https://i.pravatar.cc/150";
    };

    // Helper: Safely resolve role (Client, Lawyer, Admin)
    const getUserRole = (user) => {
        if (!user || !user.role) return "Client";
        const normalized = user.role.toLowerCase();
        if (normalized === "admin") return "Admin";
        if (normalized === "lawyer") return "Lawyer";
        return "Client";
    };

    // Fetch Dynamic Data from Backend APIs
    const fetchData = async () => {
        try {
            setLoading(true);

            // Parallel requests for all admin metrics using baseURL
            const [usersRes, lawyersRes, transRes, hiresRes] = await Promise.allSettled([
                fetch(`${baseURL}/api/users`),
                fetch(`${baseURL}/api/lawyers`),
                fetch(`${baseURL}/api/transactions`),
                fetch(`${baseURL}/api/hires`),
            ]);

            if (usersRes.status === "fulfilled" && usersRes.value.ok) {
                const usersData = await usersRes.value.json();
                setUsers(Array.isArray(usersData) ? usersData : usersData.users || []);
            }

            if (lawyersRes.status === "fulfilled" && lawyersRes.value.ok) {
                const lawyersData = await lawyersRes.value.json();
                setLawyers(Array.isArray(lawyersData) ? lawyersData : lawyersData.lawyers || []);
            }

            if (transRes.status === "fulfilled" && transRes.value.ok) {
                const transData = await transRes.value.json();
                setTransactions(Array.isArray(transData) ? transData : transData.transactions || []);
            }

            if (hiresRes.status === "fulfilled" && hiresRes.value.ok) {
                const hiresData = await hiresRes.value.json();
                setHires(Array.isArray(hiresData) ? hiresData : hiresData.hires || []);
            }
        } catch (error) {
            toast.error("Failed to load dashboard metrics.");
            console.error("Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let isMounted = true;

        Promise.resolve().then(() => {
            if (isMounted) {
                fetchData();
            }
        });

        return () => {
            isMounted = false;
        };
    }, []);

    // Compute Dynamic Stats safely matching exact DB schemas
    const stats = useMemo(() => {
        const totalUsers = users.length;
        const totalClients = users.filter((u) => getUserRole(u) === "Client").length;
        const totalAdmins = users.filter((u) => getUserRole(u) === "Admin").length;
        const totalLawyers = lawyers.length;

        // Pending verifications
        const pendingLawyersCount = lawyers.filter(
            (lawyer) =>
                lawyer.isVerified === false ||
                lawyer.status === "Pending Verification" ||
                lawyer.status === "Pending" ||
                lawyer.isPendingVerification === true
        ).length;

        // Dynamic Revenue Sum from transactions with robust status and field check
        const totalRevenue = transactions.reduce((acc, curr) => {
            const status = (curr.status || "").toLowerCase();

            // If status explicitly marks failure/cancellation, skip it
            if (status === "failed" || status === "cancelled" || status === "rejected") {
                return acc;
            }

            // Extract raw amount from potential keys
            const rawAmount = curr.amount ?? curr.fee ?? curr.total ?? curr.price ?? curr.revenue ?? curr.payment ?? curr.paidAmount ?? 0;

            // Handle string parsing (e.g. "$150.00", "1,200")
            let parsedAmount = 0;
            if (typeof rawAmount === "string") {
                parsedAmount = parseFloat(rawAmount.replace(/[^0-9.-]+/g, ""));
            } else {
                parsedAmount = parseFloat(rawAmount);
            }

            return acc + (isNaN(parsedAmount) ? 0 : parsedAmount);
        }, 50000);

        // Total Hires/Bookings Count
        const totalHiresCount = hires.length || transactions.length;

        return {
            totalUsers,
            totalClients,
            totalAdmins,
            totalLawyers,
            pendingLawyersCount,
            totalRevenue,
            totalHiresCount,
        };
    }, [users, lawyers, transactions, hires]);

    // Compute Pending Lawyers Dynamic List
    const pendingLawyers = useMemo(() => {
        return lawyers.filter(
            (lawyer) =>
                lawyer.isVerified === false ||
                lawyer.status === "Pending Verification" ||
                lawyer.status === "Pending" ||
                lawyer.isPendingVerification === true
        );
    }, [lawyers]);

    // Handle Dynamic Verification Approval
    const handleApproveLawyer = async (lawyerId) => {
        try {
            const res = await fetch(`${baseURL}/api/lawyers/${lawyerId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isVerified: true, status: "Verified" }),
            });

            if (res.ok) {
                toast.success("Lawyer verified successfully!");
                fetchData();
            } else {
                toast.error("Failed to approve lawyer.");
            }
        } catch (error) {
            toast.error("Network error during approval.");
        }
    };

    // Filter Users List dynamically
    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const displayName = getUserDisplayName(user).toLowerCase();
            const userEmail = (user.email || user.clientEmail || "").toLowerCase();
            const search = searchTerm.toLowerCase();

            const matchesSearch = displayName.includes(search) || userEmail.includes(search);
            const userRole = getUserRole(user);
            const matchesRole = roleFilter === "All" || userRole === roleFilter;

            return matchesSearch && matchesRole;
        });
    }, [users, searchTerm, roleFilter]);

    // Handle Role Change
    const handleRoleChange = async (userId, newRole) => {
        try {
            const res = await fetch(`${baseURL}/api/users/${userId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: newRole }),
            });

            if (res.ok) {
                setUsers((prevUsers) =>
                    prevUsers.map((u) =>
                        (u._id === userId || u.id === userId) ? { ...u, role: newRole } : u
                    )
                );
                toast.success(`User role updated to ${newRole}`);
            }
        } catch (error) {
            toast.error("Error updating user role.");
        }
    };

    // Handle Delete User
    const confirmDeleteUser = async () => {
        if (!userToDelete) return;

        try {
            const targetId = userToDelete._id || userToDelete.id;
            const res = await fetch(`${baseURL}/api/users/${targetId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setUsers((prev) => prev.filter((u) => (u._id || u.id) !== targetId));
                toast.success(`User "${getUserDisplayName(userToDelete)}" removed.`);
            }
        } catch (error) {
            toast.error("Could not delete user.");
        } finally {
            setUserToDelete(null);
        }
    };

    const getRoleBadge = (role) => {
        switch (role) {
            case "Admin":
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        <ShieldCheck size={13} /> Admin
                    </span>
                );
            case "Lawyer":
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <Scale size={13} /> Lawyer
                    </span>
                );
            case "Client":
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        <UserCheck size={13} /> Client
                    </span>
                );
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 font-sans selection:bg-amber-500/30">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            System Control & Intelligence
                        </span>
                    </div>
                    <h1 className="text-3xl font-black text-slate-600 dark:text-white mt-2">Admin Overview</h1>
                    <p className="text-xs text-neutral-400">
                        Real-time analytics, user permissions, revenue metrics, and pending lawyer verifications.
                    </p>
                </div>

                <button
                    onClick={fetchData}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-100 dark:bg-neutral-900 border border-white/10 hover:border-amber-500/30 text-xs font-bold text-neutral-800 dark:text-neutral-300 hover:text-amber-400 transition cursor-pointer self-start md:self-auto"
                >
                    <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh Stats
                </button>
            </div>

            {/* Dynamic Metrics Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {/* Total System Users */}
                <div className="p-5 rounded-3xl bg-slate-100 dark:bg-neutral-900/60 border border-white/10 backdrop-blur-xl space-y-2 shadow-xl">
                    <div className="flex items-center justify-between">
                        <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400">
                            <Users size={18} />
                        </div>
                        <span className="text-[10px] font-bold text-neutral-400">Accounts</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 font-medium">Total Users</p>
                    <h3 className="text-2xl font-black text-gray-500 dark:text-white">
                        {loading ? "..." : stats.totalUsers}
                    </h3>
                </div>

                {/* Total Registered Lawyers */}
                <div className="p-5 rounded-3xl bg-slate-100 dark:bg-neutral-900/60 border border-white/10 backdrop-blur-xl space-y-2 shadow-xl">
                    <div className="flex items-center justify-between">
                        <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400">
                            <Scale size={18} />
                        </div>
                        <span className="text-[10px] font-bold text-amber-400">Legal Pros</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 font-medium">Total Lawyers</p>
                    <h3 className="text-2xl font-black text-gray-500 dark:text-white">
                        {loading ? "..." : stats.totalLawyers}
                    </h3>
                </div>

                {/* Total Clients */}
                <div className="p-5 rounded-3xl bg-slate-100 dark:bg-neutral-900/60 border border-white/10 backdrop-blur-xl space-y-2 shadow-xl">
                    <div className="flex items-center justify-between">
                        <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-400">
                            <UserCheck size={18} />
                        </div>
                        <span className="text-[10px] font-bold text-blue-400">Clients</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 font-medium">Total Clients</p>
                    <h3 className="text-2xl font-black text-gray-500 dark:text-white">
                        {loading ? "..." : stats.totalClients}
                    </h3>
                </div>

                {/* Action Needed: Pending Verifications */}
                <div className="p-5 rounded-3xl bg-slate-100 dark:bg-neutral-900/60 border border-amber-500/30 backdrop-blur-xl space-y-2 shadow-xl relative overflow-hidden">
                    <div className="flex items-center justify-between">
                        <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400">
                            <Clock size={18} />
                        </div>
                        <span className="text-[10px] font-bold text-amber-400">Review</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 font-medium">Pending Review</p>
                    <h3 className="text-2xl font-black text-amber-400">
                        {loading ? "..." : stats.pendingLawyersCount}
                    </h3>
                </div>

                {/* Total Consultations / Hires */}
                <div className="p-5 rounded-3xl bg-slate-100 dark:bg-neutral-900/60 border border-white/10 backdrop-blur-xl space-y-2 shadow-xl">
                    <div className="flex items-center justify-between">
                        <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-400">
                            <Briefcase size={18} />
                        </div>
                        <span className="text-[10px] font-bold text-purple-400">Bookings</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 font-medium">Total Hires</p>
                    <h3 className="text-2xl font-black text-gray-500 dark:text-white">
                        {loading ? "..." : stats.totalHiresCount}
                    </h3>
                </div>

                {/* Gross Revenue */}
                <div className="p-5 rounded-3xl bg-slate-100 dark:bg-neutral-900/60 border border-white/10 backdrop-blur-xl space-y-2 shadow-xl">
                    <div className="flex items-center justify-between">
                        <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400">
                            <DollarSign size={18} />
                        </div>
                        <span className="text-[10px] font-bold text-emerald-400">Earnings</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 font-medium">Total Revenue</p>
                    <h3 className="text-2xl font-black text-gray-500 dark:text-white">
                        {loading
                            ? "..."
                            : `$${stats.totalRevenue.toLocaleString("en-US", {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 2,
                            })}`}
                    </h3>
                </div>
            </div>

            {/* Dynamic Pending Verification Requests Section */}
            <div className="p-6 rounded-3xl bg-slate-100 dark:bg-neutral-900/60 border border-amber-500/20 backdrop-blur-xl space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                            <Clock size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-gray-800 dark:text-white">Pending Verification Requests</h2>
                            <p className="text-xs text-neutral-400">
                                Lawyers who have submitted credentials or payment for profile verification.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => router.push("/dashboard/admin/lawyer-listings?status=Pending Verification")}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-neutral-950 font-bold text-xs transition cursor-pointer border border-amber-500/20"
                    >
                        View All Requests <ArrowRight size={14} />
                    </button>
                </div>

                {pendingLawyers.length === 0 ? (
                    <div className="py-8 text-center text-xs text-neutral-600 dark:text-neutral-500">
                        No pending lawyer verification requests at this moment.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                        {pendingLawyers.slice(0, 3).map((lawyer) => (
                            <div
                                key={lawyer._id || lawyer.id}
                                className="p-4 rounded-2xl bg-neutral-950/80 border border-white/10 space-y-3 flex flex-col justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <Image
                                        src={getUserAvatar(lawyer)}
                                        alt={getUserDisplayName(lawyer)}
                                        width={800}
                                        height={800}
                                        className="w-10 h-10 rounded-xl object-cover border border-white/10"
                                    />
                                    <div className="overflow-hidden">
                                        <h4 className="text-sm font-bold text-gray-600 dark:text-white truncate">{getUserDisplayName(lawyer)}</h4>
                                        <p className="text-[11px] text-amber-400 truncate">{lawyer.specialization || "Legal Counsel"}</p>
                                        <p className="text-[10px] text-neutral-500 font-mono truncate">{lawyer.email || lawyer.clientEmail}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                                    <button
                                        onClick={() => handleApproveLawyer(lawyer._id || lawyer.id)}
                                        className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black text-[11px] uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1"
                                    >
                                        <CheckCircle2 size={13} /> Accept
                                    </button>
                                    <button
                                        onClick={() => router.push(`/dashboard/admin/lawyer-listings`)}
                                        className="p-2 rounded-xl bg-white/5 hover:bg-neutral-800 text-neutral-400 hover:text-white transition cursor-pointer"
                                        title="Inspect Profile"
                                    >
                                        <ExternalLink size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Search and Users Filter */}
            <div className="p-4 rounded-3xl bg-slate-100 dark:bg-neutral-900/60 border border-white/10 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
                <div className="relative w-full md:w-96">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-200 dark:bg-neutral-950/80 border border-white/10 text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-amber-500/50 transition"
                    />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                    <span className="text-xs text-neutral-500 flex items-center gap-1 mr-1">
                        <Filter size={13} /> Role:
                    </span>
                    {["All", "Client", "Lawyer", "Admin"].map((role) => (
                        <button
                            key={role}
                            onClick={() => setRoleFilter(role)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${roleFilter === role
                                    ? "bg-amber-500 text-neutral-950 shadow-md"
                                    : "bg-slate-200 dark:bg-neutral-950/60 text-neutral-400 hover:text-white hover:bg-neutral-800"
                                }`}
                        >
                            {role}
                        </button>
                    ))}
                </div>
            </div>

            {/* Users Table */}
            <div className="rounded-3xl border border-white/10 bg-slate-100 dark:bg-neutral-900/50 backdrop-blur-xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 bg-slate-200 border-b-amber-400 dark:border-b-amber-600 dark:bg-neutral-950/60 text-[12px] font-black uppercase tracking-wider text-neutral-800 dark:text-neutral-400">
                                <th className="py-4 px-6">User / Name</th>
                                <th className="py-4 px-6">Email Address</th>
                                <th className="py-4 px-6">Current Role</th>
                                <th className="py-4 px-6">Change Role</th>
                                <th className="py-4 px-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-xs">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-neutral-500">
                                        Ahh! No matching users found!
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => {
                                    const uId = user._id || user.id;
                                    const role = getUserRole(user);
                                    const name = getUserDisplayName(user);
                                    const image = getUserAvatar(user);

                                    return (
                                        <tr key={uId} className="hover:bg-white/[0.02] transition duration-200">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <Image
                                                        src={image}
                                                        alt={name}
                                                        width={800}
                                                        height={800}
                                                        className="w-10 h-10 rounded-2xl object-cover border border-white/10"
                                                    />
                                                    <div>
                                                        <div className="text-gray-700 dark:text-white font-bold">{name}</div>
                                                        <div className="text-[10px] font-mono text-neutral-500">{uId}</div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="py-4 px-6 font-mono text-neutral-800 dark:text-neutral-300">{user.email || user.clientEmail}</td>
                                            <td className="py-4 px-6">{getRoleBadge(role)}</td>

                                            <td className="py-4 px-6">
                                                <select
                                                    value={role}
                                                    onChange={(e) => handleRoleChange(uId, e.target.value)}
                                                    className="bg-slate-200 dark:bg-neutral-950 border border-white/10 text-gray-600 dark:text-neutral-300 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-amber-500/50 cursor-pointer hover:border-white/20 transition"
                                                >
                                                    <option value="Client">Client</option>
                                                    <option value="Lawyer">Lawyer</option>
                                                    <option value="Admin">Admin</option>
                                                </select>
                                            </td>

                                            <td className="py-4 px-6 text-right">
                                                <button
                                                    onClick={() => setUserToDelete(user)}
                                                    className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition duration-200 cursor-pointer border border-rose-500/20"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {userToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md">
                    <div className="bg-slate-100 dark:bg-neutral-900 border border-white/10 rounded-3xl p-6 max-w-md w-full space-y-6">
                        <div className="flex items-center gap-3 text-rose-400">
                            <ShieldAlert size={24} />
                            <h3 className="text-lg font-black text-white">Confirm Account Deletion</h3>
                        </div>
                        <p className="text-xs text-neutral-300">
                            Are you sure you want to delete <span className="font-bold text-white">{getUserDisplayName(userToDelete)}</span>? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setUserToDelete(null)}
                                className="flex-1 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs cursor-pointer transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDeleteUser}
                                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer transition"
                            >
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}