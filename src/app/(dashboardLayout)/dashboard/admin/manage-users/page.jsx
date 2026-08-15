"use client";

import React, { useState, useMemo } from "react";
import {
    Users,
    Search,
    Filter,
    Trash2,
    ShieldAlert,
    UserCheck,
    UserX,
    Scale,
    ShieldCheck,
    MoreVertical,
} from "lucide-react";
import toast from "react-hot-toast";

// Initial Mock User Data
const INITIAL_USERS = [
    {
        id: "USR-101",
        name: "John Doe",
        email: "john.doe@example.com",
        role: "User",
        joinedDate: "2026-01-15",
        avatar: "https://i.pravatar.cc/150?u=john",
    },
    {
        id: "USR-102",
        name: "Adv. Sarah Jenkins",
        email: "sarah.j@legalease.com",
        role: "Lawyer",
        joinedDate: "2025-11-20",
        avatar: "https://i.pravatar.cc/150?u=sarah",
    },
    {
        id: "USR-103",
        name: "Alexander Pierce",
        email: "admin.alex@legalease.com",
        role: "Admin",
        joinedDate: "2025-08-10",
        avatar: "https://i.pravatar.cc/150?u=alex",
    },
    {
        id: "USR-104",
        name: "Adv. Tariq Rahman",
        email: "tariq.r@legalease.com",
        role: "Lawyer",
        joinedDate: "2026-02-01",
        avatar: "https://i.pravatar.cc/150?u=tariq",
    },
    {
        id: "USR-105",
        name: "Sophia Martinez",
        email: "sophia.m@example.com",
        role: "User",
        joinedDate: "2026-03-05",
        avatar: "https://i.pravatar.cc/150?u=sophia",
    },
];

export default function AdminManageUsers() {
    const [users, setUsers] = useState(INITIAL_USERS);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("All");
    const [userToDelete, setUserToDelete] = useState(null);

    // Filter Logic
    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const matchesSearch =
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesRole = roleFilter === "All" || user.role === roleFilter;

            return matchesSearch && matchesRole;
        });
    }, [users, searchTerm, roleFilter]);

    // Handle Role Change
    const handleRoleChange = (userId, newRole) => {
        setUsers((prevUsers) =>
            prevUsers.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
        toast.success(`User role successfully updated to ${newRole}`);
    };

    // Handle Delete Confirmation
    const confirmDeleteUser = () => {
        if (!userToDelete) return;

        setUsers((prevUsers) => prevUsers.filter((u) => u.id !== userToDelete.id));
        toast.success(`User "${userToDelete.name}" has been removed.`);
        setUserToDelete(null);
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
            case "User":
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
                            User Management
                        </span>
                    </div>
                    <h1 className="text-3xl font-black text-white mt-2">Manage Users</h1>
                    <p className="text-xs text-neutral-400">
                        Control user access, assign system roles, and manage account privileges.
                    </p>
                </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-3xl bg-neutral-900/60 border border-white/10 backdrop-blur-xl space-y-2 shadow-xl">
                    <div className="flex items-center justify-between">
                        <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400">
                            <Users size={20} />
                        </div>
                        <span className="text-[10px] font-bold text-neutral-400">Total Accounts</span>
                    </div>
                    <p className="text-xs text-neutral-400 font-medium">Total Registered</p>
                    <h3 className="text-2xl font-black text-white">{users.length}</h3>
                </div>

                <div className="p-5 rounded-3xl bg-neutral-900/60 border border-white/10 backdrop-blur-xl space-y-2 shadow-xl">
                    <div className="flex items-center justify-between">
                        <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-400">
                            <UserCheck size={20} />
                        </div>
                        <span className="text-[10px] font-bold text-blue-400">Clients</span>
                    </div>
                    <p className="text-xs text-neutral-400 font-medium">Standard Users</p>
                    <h3 className="text-2xl font-black text-white">
                        {users.filter((u) => u.role === "User").length}
                    </h3>
                </div>

                <div className="p-5 rounded-3xl bg-neutral-900/60 border border-white/10 backdrop-blur-xl space-y-2 shadow-xl">
                    <div className="flex items-center justify-between">
                        <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400">
                            <Scale size={20} />
                        </div>
                        <span className="text-[10px] font-bold text-amber-400">Legal Pros</span>
                    </div>
                    <p className="text-xs text-neutral-400 font-medium">Lawyer Accounts</p>
                    <h3 className="text-2xl font-black text-white">
                        {users.filter((u) => u.role === "Lawyer").length}
                    </h3>
                </div>

                <div className="p-5 rounded-3xl bg-neutral-900/60 border border-white/10 backdrop-blur-xl space-y-2 shadow-xl">
                    <div className="flex items-center justify-between">
                        <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-400">
                            <ShieldCheck size={20} />
                        </div>
                        <span className="text-[10px] font-bold text-purple-400">System Admin</span>
                    </div>
                    <p className="text-xs text-neutral-400 font-medium">Administrators</p>
                    <h3 className="text-2xl font-black text-white">
                        {users.filter((u) => u.role === "Admin").length}
                    </h3>
                </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="p-4 rounded-3xl bg-neutral-900/60 border border-white/10 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
                {/* Search Input */}
                <div className="relative w-full md:w-96">
                    <Search
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                    />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-neutral-950/80 border border-white/10 text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-amber-500/50 transition"
                    />
                </div>

                {/* Role Filter Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                    <span className="text-xs text-neutral-500 flex items-center gap-1 mr-1">
                        <Filter size={13} /> Filter Role:
                    </span>
                    {["All", "User", "Lawyer", "Admin"].map((role) => (
                        <button
                            key={role}
                            onClick={() => setRoleFilter(role)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${roleFilter === role
                                    ? "bg-amber-500 text-neutral-950 shadow-md"
                                    : "bg-neutral-950/60 text-neutral-400 hover:text-white hover:bg-neutral-800"
                                }`}
                        >
                            {role}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Users Table */}
            <div className="rounded-3xl border border-white/10 bg-neutral-900/50 backdrop-blur-xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 bg-neutral-950/60 text-[11px] font-black uppercase tracking-wider text-neutral-400">
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
                                        No users matching your search criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="hover:bg-white/[0.02] transition duration-200"
                                    >
                                        {/* User Name & Avatar */}
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={user.avatar}
                                                    alt={user.name}
                                                    className="w-10 h-10 rounded-2xl object-cover border border-white/10"
                                                />
                                                <div>
                                                    <div className="text-white font-bold">{user.name}</div>
                                                    <div className="text-[10px] font-mono text-neutral-500">
                                                        {user.id}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Email */}
                                        <td className="py-4 px-6 font-mono text-neutral-300">
                                            {user.email}
                                        </td>

                                        {/* Role Badge */}
                                        <td className="py-4 px-6">{getRoleBadge(user.role)}</td>

                                        {/* Change Role Selection */}
                                        <td className="py-4 px-6">
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                className="bg-neutral-950 border border-white/10 text-neutral-300 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-amber-500/50 cursor-pointer hover:border-white/20 transition"
                                            >
                                                <option value="User">User</option>
                                                <option value="Lawyer">Lawyer</option>
                                                <option value="Admin">Admin</option>
                                            </select>
                                        </td>

                                        {/* Delete Action */}
                                        <td className="py-4 px-6 text-right">
                                            <button
                                                onClick={() => setUserToDelete(user)}
                                                className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition duration-200 cursor-pointer border border-rose-500/20"
                                                title="Delete User"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {userToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md animate-fade-in">
                    <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-6 relative">
                        <div className="flex items-center gap-3 text-rose-400">
                            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                                <ShieldAlert size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-white">Delete User Account</h3>
                                <p className="text-xs text-neutral-400">This action cannot be undone.</p>
                            </div>
                        </div>

                        <p className="text-xs text-neutral-300 leading-relaxed">
                            Are you sure you want to permanently delete{" "}
                            <span className="font-bold text-white">{userToDelete.name}</span> (
                            <span className="font-mono text-amber-400">{userToDelete.email}</span>
                            )? All associated permissions and data will be removed.
                        </p>

                        <div className="flex items-center gap-3 pt-2">
                            <button
                                onClick={() => setUserToDelete(null)}
                                className="flex-1 py-3 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDeleteUser}
                                className="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-lg shadow-rose-600/20"
                            >
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}