"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import Logo from "./Logo";
import NavLinks from "./NavLinks";
import SearchBar from "./SearchBar";
import MobileMenu from "./MobileMenu";
import ThemeToggle from "../ui/ThemeToggle";

import { Menu, User, Settings, LogOut, LayoutDashboard } from "lucide-react";
import { authClient, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function Navbar() {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const { data: session } = useSession();
    const router = useRouter();

    const user = session?.user;

    // Helper for First Character Fallback

    const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Signout Function

    const handleSignOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/signin");
                    router.refresh(); // Refresh route cache to auto-update auth status
                },
            },
        });

        window.location.href = "/signin";
    };

    console.log("My Session info:", session);

    return (
        <header
            className={`glass sticky top-0 z-50 transition-all duration-300 rounded-b-4xl shadow-md shadow-amber-300 dark:shadow-amber-200 ${isScrolled ? "shadow-lg shadow-black/10" : ""}`}
        >
            <nav className="mx-auto flex h-22 items-center justify-between px-4 lg:px-10">

                {/* Left */}

                <div className="flex items-center">
                    <Logo />
                </div>

                {/* Center Navigation */}

                <div className="hidden lg:flex items-center gap-8">
                    <NavLinks />
                </div>

                {/* Right */}

                <div className="flex items-center gap-4">

                    <SearchBar />

                    <ThemeToggle />

                    <div className="hidden md:flex items-center gap-3">

                        {user ? (

                            /* User Profile Avatar with Hover Dropdown */

                            <div className="relative group py-2">

                                {/* Trigger Avatar */}

                                <button className="relative flex items-center justify-center rounded-full ring-2 ring-primary/30 hover:ring-secondary transition-all duration-300 focus:outline-none">
                                    <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border-2 border-background bg-primary/20 text-primary font-bold shadow-md">
                                        {user.image ? (
                                            <Image
                                                src={user?.image}
                                                alt={user.name || "User Avatar"}
                                                fill
                                                className="object-cover"
                                                unoptimized
                                                referrerPolicy="no-referrer"
                                            />
                                        ) : (
                                            <span className="text-lg font-black leading-none">{userInitial}</span>
                                        )}
                                    </div>

                                    {/* Online Indicator Badge */}

                                    <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-background animate-pulse" />
                                </button>

                                {/* Dropdown Menu (Slightly Deeper Background with Theme Adaptability) */}

                                <div className="absolute right-0 top-full hidden group-hover:block hover:block pt-2 w-68 z-50 fade-up">
                                    <div className="glass overflow-hidden rounded-2xl border border-border bg-neutral-200/90 dark:bg-neutral-900/95 p-4 shadow-2xl backdrop-blur-2xl text-text">

                                        {/* User Summary Header */}

                                        <div className="flex items-center gap-3 pb-3 border-b border-border">
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
                                                    <div className="mt-2 inline-flex w-fit items-center rounded-full bg-secondary/20 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-secondary">
                                                        {user?.role}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Quick Links */}

                                        <div className="py-2 flex flex-col gap-1">
                                            <Link
                                                href="/profile"
                                                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-text-secondary hover:bg-primary/15 hover:text-primary transition-colors"
                                            >
                                                <User size={16} />
                                                <span>Profile</span>
                                            </Link>

                                            <Link
                                                href="/dashboard"
                                                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-text-secondary hover:bg-primary/15 hover:text-primary transition-colors"
                                            >
                                                <LayoutDashboard size={16} />
                                                <span>Dashboard</span>
                                            </Link>

                                            <Link
                                                href="/settings"
                                                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-text-secondary hover:bg-primary/15 hover:text-primary transition-colors"
                                            >
                                                <Settings size={16} />
                                                <span>Settings</span>
                                            </Link>
                                        </div>

                                        {/* Sign Out Action */}

                                        <div className="pt-2 border-t border-border">
                                            <button
                                                onClick={handleSignOut}
                                                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-bold text-danger hover:bg-danger/10 transition-colors"
                                            >
                                                <LogOut size={16} />
                                                <span>Sign Out</span>
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <Link
                                    href="/signin"
                                    className="rounded-full border border-border px-5 py-2 font-medium text-text transition-all duration-300 hover:border-secondary hover:text-primary"
                                >
                                    Sign In
                                </Link>

                                <Link
                                    href="/signup"
                                    className="btn-premium rounded-full bg-primary px-5 py-2 font-medium text-white"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}

                    </div>

                    {/* Mobile Menu Open */}

                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className="rounded-xl border border-border p-2.5 transition-all duration-300 hover:border-secondary hover:bg-surface lg:hidden"
                        aria-label="Open Menu"
                    >
                        <Menu
                            size={22}
                            className="text-text"
                        />
                    </button>

                </div>

            </nav>

            {/* For Mobile Menu */}

            <MobileMenu
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
            />

        </header>
    );
}