"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import Logo from "./Logo";
import NavLinks from "./NavLinks";
import SearchBar from "./SearchBar";
import MobileMenu from "./MobileMenu";
import ThemeToggle from "../ui/ThemeToggle";

import { Menu } from "lucide-react";

export default function Navbar() {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (

        <header
            className={`glass sticky top-0 z-50 transition-all duration-300 rounded-b-4xl shadow-md shadow-amber-300 dark:shadow-amber-200 ${isScrolled ? "shadow-lg shadow-black/10" : ""}`}>
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