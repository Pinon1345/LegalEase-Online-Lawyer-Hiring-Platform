"use client";

import React, { useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import {
    LayoutDashboard,
    UserCheck,
    MessageSquare,
    Home,
    LogOut,
    Scale,
    ChevronLeft,
    ChevronRight,
    ShieldCheck,
    X,
    Sun,
    Moon,
} from "lucide-react";
import { MdOutlineManageHistory } from "react-icons/md";

// Navigation Items for Client/User Dashboard based on Assignment Spec
const clientNavItems = [
    {
        name: "Profile Overview",
        href: "/dashboard/client",
        icon: LayoutDashboard,
    },
    {
        name: "Hiring History",
        href: "/dashboard/client/hiring-history",
        icon: MdOutlineManageHistory,
    },
    {
        name: "Update Profile",
        href: "/dashboard/client/update-profile",
        icon: UserCheck,
    },
    {
        name: "Comment Management",
        href: "/dashboard/client/comments",
        icon: MessageSquare,
    },
];

// Sidebar Theme Toggle Component
function ThemeToggle({ collapsed = false, isMobile = false }) {
    const isClient = useSyncExternalStore(
        () => () => { },
        () => true,
        () => false
    );

    const { resolvedTheme, setTheme } = useTheme();

    if (!isClient) {
        return (
            <div
                className={`flex items-center gap-3 w-full rounded-xl px-3 py-2 text-sm font-semibold text-text-secondary ${collapsed && !isMobile ? "justify-center px-0" : ""
                    }`}
            >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface border border-border shrink-0" />
                {(!collapsed || isMobile) && <span className="opacity-0">Toggle Theme</span>}
            </div>
        );
    }

    const isDark = resolvedTheme === "dark";

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={`flex items-center gap-3 w-full rounded-xl px-3 py-2 text-sm font-semibold text-text-secondary hover:bg-secondary/10 hover:text-secondary transition-all ${collapsed && !isMobile ? "justify-center px-0" : ""
                }`}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Theme"
        >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface border border-border shrink-0">
                {isDark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-secondary" />}
            </div>
            {(!collapsed || isMobile) && <span>{isDark ? "Light Mode" : "Dark Mode"}</span>}
        </button>
    );
}

// Main Client Dashboard Sidebar Component
export default function ClientDashboardSidebar({
    collapsed = false,
    isMobile = false,
    pathname,
    user,
    userInitial,
    onCloseMobile,
    onToggleCollapse,
    onSignOut,
}) {
    return (
        <div className="flex flex-col h-full justify-between p-4 overflow-y-auto no-scrollbar">
            {/* Top Navigation & Profile Area */}
            <div className="flex flex-col">
                {/* Logo & Toggle Header */}
                <div className="flex items-center justify-between pb-6 border-b border-border/60">
                    <Link
                        href="/"
                        onClick={() => isMobile && onCloseMobile()}
                        className="flex items-center gap-4 overflow-hidden px-1"
                    >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-secondary/30 to-primary/30 text-secondary border border-secondary/40 shadow-lg gold-pulse">
                            <Scale size={22} />
                        </div>
                        {(!collapsed || isMobile) && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex flex-col"
                            >
                                <span className="font-extrabold text-xl text-text tracking-tight leading-none mb-1">
                                    Legal<span className="text-secondary">Ease</span>
                                </span>
                                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mt-0.5">
                                    {user?.role || "User"} Portal
                                </span>
                            </motion.div>
                        )}
                    </Link>

                    {/* Desktop Collapse Toggle */}
                    {!isMobile && (
                        <button
                            onClick={onToggleCollapse}
                            className="hidden md:flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface hover:bg-secondary/10 hover:text-secondary text-text-secondary transition"
                            aria-label="Toggle Sidebar"
                        >
                            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                        </button>
                    )}

                    {/* Mobile Close Button */}
                    {isMobile && (
                        <button
                            onClick={onCloseMobile}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-text-secondary transition hover:bg-surface/80"
                            aria-label="Close Mobile Sidebar"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>

                {/* User Profile Card */}
                <div className="my-5">
                    <div
                        className={`flex items-center gap-3 rounded-2xl border border-secondary/20 bg-neutral-200/90 dark:bg-neutral-900/95 p-3 shadow-md backdrop-blur-xl ${collapsed && !isMobile ? "justify-center p-2" : ""
                            }`}
                    >
                        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-secondary/40 bg-secondary/20 text-secondary font-bold">
                            {user?.image ? (
                                <Image
                                    src={user?.image}
                                    alt={user.name || "User"}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                    referrerPolicy="no-referrer"
                                />
                            ) : (
                                <span className="text-base font-extrabold">{userInitial}</span>
                            )}
                        </div>

                        {(!collapsed || isMobile) && (
                            <div className="flex flex-col truncate">
                                <span className="font-bold text-sm text-text truncate">
                                    {user?.name || "Client User"}
                                </span>
                                <span className="text-[11px] text-text-secondary truncate flex items-center gap-1 mt-1">
                                    <ShieldCheck size={14} className="text-secondary" />
                                    <p className="uppercase text-[12px]">{user?.role || "User"}</p>
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Client Navigation Links */}
                <div className="space-y-1 mt-2 mb-2">
                    {(!collapsed || isMobile) && (
                        <p className="px-3 text-[11px] font-extrabold uppercase tracking-wider text-text-secondary mb-3">
                            Client Menu
                        </p>
                    )}

                    {clientNavItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item?.name}
                                href={item?.href}
                                onClick={() => isMobile && onCloseMobile()}
                                className={`relative flex items-center gap-3.5 rounded-xl px-3.5 py-3 text-sm font-semibold transition-all duration-300 ${isActive
                                    ? "text-surface-dark bg-secondary font-bold shadow-lg shadow-secondary/20"
                                    : "text-text-secondary hover:bg-secondary/10 hover:text-secondary"
                                    } ${collapsed && !isMobile ? "justify-center px-0" : ""}`}
                            >
                                <Icon size={20} className="shrink-0" />

                                {(!collapsed || isMobile) && (
                                    <span className="truncate">{item.name}</span>
                                )}

                                {isActive && (!collapsed || isMobile) && (
                                    <motion.div
                                        layoutId="activeGlowClient"
                                        className="absolute right-2 h-2 w-2 rounded-full bg-surface-dark"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Bottom Controls Area */}
            <div className="mt-auto pt-6 border-t border-border/60 space-y-2">
                <ThemeToggle collapsed={collapsed} isMobile={isMobile} />

                <Link
                    href="/"
                    onClick={() => isMobile && onCloseMobile()}
                    className={`flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-text-secondary hover:bg-surface hover:text-text transition ${collapsed && !isMobile ? "justify-center px-0" : ""
                        }`}
                >
                    <Home size={18} className="shrink-0" />
                    {(!collapsed || isMobile) && <span>Back To Main Site</span>}
                </Link>

                <button
                    onClick={onSignOut}
                    className={`flex w-full items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-sm font-bold text-danger hover:bg-danger/10 transition ${collapsed && !isMobile ? "justify-center px-0" : ""
                        }`}
                >
                    <LogOut size={18} className="shrink-0" />
                    {(!collapsed || isMobile) && <span>Sign Out</span>}
                </button>
            </div>
        </div>
    );
}