"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Settings, LogOut } from "lucide-react";

import Logo from "./Logo";
import NavLinks from "./NavLinks";
import SearchBar from "./SearchBar";
import ThemeToggle from "../ui/ThemeToggle";
import { Button } from "@heroui/react";

import { authClient, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function MobileMenu({ isOpen, onClose }) {
    const { data: session } = useSession();
    const router = useRouter();

    const user = session?.user;
    const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

    const handleSignOut = async () => {
        onClose();
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/signin");
                    router.refresh();
                },
            },
        });
        window.location.href = "/signin";
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                    />

                    {/* Drawer */}

                    <motion.aside
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{
                            type: "spring",
                            stiffness: 320,
                            damping: 30,
                        }}
                        className="fixed right-0 top-0 z-50 flex h-full w-[82%] max-w-105 flex-col glass shadow-2xl lg:hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-border p-5">
                            <Logo />

                            <Button
                                onClick={onClose}
                                className="rounded-lg p-2 transition hover:bg-surface"
                            >
                                <X size={22} />
                            </Button>
                        </div>

                        {/* Content */}

                        <div className="flex flex-1 flex-col gap-8 overflow-y-auto p-6">

                            <SearchBar mobile />

                            {/* User Profile Header in Mobile Drawer when Authenticated */}

                            {user && (
                                <div className="flex items-center gap-3 rounded-2xl border border-border bg-neutral-200/90 dark:bg-neutral-900/95 p-4 shadow-md backdrop-blur-2xl text-text">
                                    <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-secondary/40 bg-secondary/20 text-secondary font-bold">
                                        {user.image ? (
                                            <Image
                                                src={user?.image}
                                                alt={user.name || "User"}
                                                fill
                                                className="object-cover"
                                                unoptimized
                                                referrerPolicy="no-referrer"
                                            />
                                        ) : (
                                            <span className="text-xl font-black leading-none">{userInitial}</span>
                                        )}
                                    </div>
                                    <div className="flex flex-col truncate">
                                        <span className="font-bold text-lg text-text truncate">
                                            {user?.name}
                                        </span>
                                        <span className="text-xs text-text-secondary truncate">
                                            {user?.email}
                                        </span>
                                        {user.role && (
                                            <span className="mt-1 inline-flex w-fit items-center rounded-full bg-secondary/20 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-secondary">
                                                {user?.role}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col gap-3">
                                <NavLinks
                                    mobile
                                    onNavigate={onClose}
                                />
                            </div>

                            <div className="flex items-center justify-between rounded-xl border border-border p-3">
                                <span className="font-medium text-text">
                                    Theme
                                </span>

                                <ThemeToggle />
                            </div>

                            {/* Conditional Auth Actions */}

                            <div className="mt-auto flex flex-col gap-3">
                                {user ? (
                                    <div className="flex flex-col gap-2">
                                        <Link
                                            href="/profile"
                                            onClick={onClose}
                                            className="flex items-center gap-3 rounded-xl border border-border px-4 py-3 font-medium text-text-secondary transition hover:bg-surface"
                                        >
                                            <User size={18} />
                                            <span>Profile</span>
                                        </Link>

                                        <Link
                                            href="/settings"
                                            onClick={onClose}
                                            className="flex items-center gap-3 rounded-xl border border-border px-4 py-3 font-medium text-text-secondary transition hover:bg-surface"
                                        >
                                            <Settings size={18} />
                                            <span>Settings</span>
                                        </Link>

                                        <button
                                            onClick={handleSignOut}
                                            className="flex items-center gap-3 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 font-bold text-danger transition hover:bg-danger/20"
                                        >
                                            <LogOut size={18} />
                                            <span>Sign Out</span>
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <Link
                                            href="/signin"
                                            onClick={onClose}
                                            className="rounded-xl border border-border py-3 text-center font-medium transition hover:border-secondary"
                                        >
                                            Sign In
                                        </Link>

                                        <Link
                                            href="/signup"
                                            onClick={onClose}
                                            className="btn-premium rounded-xl bg-primary py-3 text-center font-medium text-white"
                                        >
                                            Sign Up
                                        </Link>
                                    </>
                                )}
                            </div>

                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
}