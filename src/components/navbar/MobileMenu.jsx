"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

import Logo from "./Logo";
import NavLinks from "./NavLinks";
import SearchBar from "./SearchBar";
import ThemeToggle from "../ui/ThemeToggle";
import { Button } from "@heroui/react";

export default function MobileMenu({ isOpen, onClose }) {
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
                        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
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
                        className="
                            fixed
                            right-0
                            top-0
                            z-50
                            flex
                            h-full
                            w-[82%]
                            max-w-105
                            flex-col
                            glass
                            shadow-2xl
                        "
                    >
                        {/* Header */}

                        <div className="flex items-center justify-between border-b border-border p-5">
                            <Logo />

                            <Button
                                onClick={onClose}
                                className="
                                    rounded-lg
                                    p-2
                                    transition
                                    hover:bg-surface
                                "
                            >
                                <X size={22} />
                            </Button>

                        </div>

                        {/* Content */}

                        <div className="flex flex-1 flex-col gap-8 overflow-y-auto p-6">

                            <SearchBar mobile />

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

                            <div className="mt-auto flex flex-col gap-3">

                                <Link
                                    href="/signin"
                                    onClick={onClose}
                                    className="
                                        rounded-xl
                                        border
                                        border-border
                                        py-3
                                        text-center
                                        font-medium
                                        transition
                                        hover:border-secondary
                                    "
                                >
                                    Sign In

                                </Link>

                                <Link
                                    href="/signup"
                                    onClick={onClose}
                                    className="
                                        btn-premium
                                        rounded-xl
                                        bg-primary
                                        py-3
                                        text-center
                                        font-medium
                                        text-white
                                    "
                                >
                                    Sign Up

                                </Link>

                            </div>

                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
}