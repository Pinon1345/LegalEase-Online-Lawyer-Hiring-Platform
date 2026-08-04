"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Scale, Menu } from "lucide-react";

import { authClient, useSession } from "@/lib/auth-client";
import Footer from "@/components/Footer";
import LawyerDashboardSidebar from "@/components/LawyerDashboardSidebar";
import AdminDashboardSidebar from "@/components/AdminDashboardSidebar";
import ClientDashboardSidebar from "@/components/ClientDashboardSidebar";

export default function DashboardLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session } = useSession();

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const user = session?.user;
    const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

    const handleSignOut = async () => {
        setIsMobileOpen(false);
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/signin");
                    router.refresh();
                },
            },
        });
    };

    // Shared props builder for sidebars

    const getSidebarProps = (isMobile = false) => ({
        collapsed: isMobile ? false : isCollapsed,
        isMobile,
        pathname,
        user,
        userInitial,
        onCloseMobile: () => setIsMobileOpen(false),
        onToggleCollapse: () => setIsCollapsed((prev) => !prev),
        onSignOut: handleSignOut,
    });




    // Dynamic Dashboard Sidebar rendering based on ROLE


    const renderSidebar = (isMobile = false) => {
        const props = getSidebarProps(isMobile);
        switch (user?.role) {
            case "admin":
                return <AdminDashboardSidebar {...props} />;
            case "lawyer":
                return <LawyerDashboardSidebar {...props} />;
            default:
                return <ClientDashboardSidebar {...props} />;
        }
    };


    return (
        <div className="min-h-screen flex flex-col bg-background text-text transition-colors duration-300">

            {/* Mobile Header Bar */}

            <header className="md:hidden sticky top-0 z-30 flex items-center justify-between border-b border-border bg-surface/90 px-4 py-3 glass backdrop-blur-xl rounded-b-2xl">
                <Link href="/" className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-secondary/30 to-primary/30 text-secondary border border-secondary/40">
                        <Scale size={18} />
                    </div>
                    <span className="font-extrabold text-base text-text">
                        Legal<span className="text-secondary">Ease</span>
                    </span>
                </Link>

                <button
                    onClick={() => setIsMobileOpen(true)}
                    className="rounded-xl border border-border/80 bg-surface p-2 text-text transition hover:border-secondary hover:bg-secondary/10 hover:text-secondary"
                    aria-label="Open Mobile Menu"
                >
                    <Menu size={22} />
                </button>
            </header>

            {/* Content Body */}

            <div className="flex flex-1 w-full">

                {/* Desktop Sidebar */}

                <aside
                    className={`hidden md:flex flex-col sticky top-0 h-screen glass border-r border-secondary/20 transition-all duration-300 shrink-0 ${isCollapsed ? "w-20" : "w-72"
                        }`}
                >
                    {renderSidebar(false)}

                </aside>

                {/* Mobile Drawer */}

                <AnimatePresence>
                    {isMobileOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsMobileOpen(false)}
                                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
                            />

                            <motion.aside
                                initial={{ x: "-100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "-100%" }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="fixed left-0 top-0 z-50 h-full w-[80%] max-w-72 glass border-r border-secondary/20 bg-background shadow-2xl md:hidden"
                            >
                                {renderSidebar(true)}
                            </motion.aside>
                        </>
                    )}
                </AnimatePresence>

                {/* Main Content */}

                <main className="flex-1 p-4 md:p-10 min-w-0">
                    <div className="mx-auto max-w-7xl fade-up">{children}</div>
                </main>
            </div>

            <Footer />
        </div>
    );
}