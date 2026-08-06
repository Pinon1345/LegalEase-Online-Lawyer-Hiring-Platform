"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";

export default function NavLinks({ mobile = false, onNavigate }) {
    const pathname = usePathname();
    const { data: session } = useSession();


    const userRole = session?.user?.role || "client"; // Fallback role if loading or undefined

    const navLinks = [
        {
            name: "Home",
            href: "/",
        },
        {
            name: "Browse Lawyers",
            href: "/lawyers",
        },
        {
            name: "Dashboard",
            href: `/dashboard/${userRole}`,
            protected: true, // Marker for protected routes
        },
    ];

    // Filter links based on whether user is logged in

    const visibleLinks = navLinks.filter((link) => {
        if (link.protected && !session?.user) {
            return false;
        }
        return true;
    });

    return (
        <>
            {visibleLinks.map((link) => {
                const active = pathname === link.href;

                return (
                    <Link
                        onClick={onNavigate}
                        key={link.name}
                        href={link.href}
                        className={`relative font-medium transition-all duration-300 link-premium
                        ${active
                                ? "text-primary font-semibold link-active"
                                : "text-text hover:text-primary"
                            }
                        ${mobile
                                ? "block rounded-lg px-4 py-3 text-lg hover:bg-surface"
                                : "px-2 py-1"
                            }
                        `}
                    >
                        {link.name}
                    </Link>
                );
            })}
        </>
    );
}