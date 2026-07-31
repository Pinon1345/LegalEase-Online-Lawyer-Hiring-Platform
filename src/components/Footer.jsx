import Image from "next/image";
import Link from "next/link";
import {
    FaFacebook,
    FaGithub,
    FaInstagram,
    FaLinkedin,
} from "react-icons/fa";
import { HiPaperAirplane } from "react-icons/hi2";

const Footer = () => {
    return (
        <footer className="relative overflow-hidden border-t border-border bg-background px-6 pt-16 pb-10 text-text-secondary md:px-16 transition-colors duration-300">

            {/* Background Glows matching design tokens */}
            <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-primary/10 blur-[140px]" />
            <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-secondary/15 blur-[140px]" />

            <div className="relative mx-auto max-w-7xl">

                {/* Brand Section */}
                <div className="mb-14 fade-up">

                    <div className="flex items-center flex-col sm:flex-row gap-4 justify-center sm:justify-start">

                        <Image
                            src="/justice-final-logo.png"
                            alt="LegalEase Logo"
                            width={70}
                            height={70}
                            className="logo-premium"
                        />

                        <div className="flex items-center flex-col">

                            <Image
                                src="/justice-text-final-logo.png"
                                alt="LegalEase"
                                width={180}
                                height={180}
                                priority
                                className="sm:block h-20 w-56 shine-text fade-up"
                            />

                            <p className="text-sm font-medium tracking-wide text-muted">
                                Consult • Hire • Resolve
                            </p>

                        </div>

                    </div>

                    <p className="mt-6 max-w-2xl leading-8 text-text-secondary">
                        LegalEase is a trusted online platform connecting individuals and businesses with verified, top-tier legal professionals. Book confidential consultations, get expert legal counsel, and handle all your legal representation needs seamlessly from one secure platform.
                    </p>

                </div>

                {/* Footer Grid */}

                <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">

                    {/* Newsletter */}

                    <div>

                        <h3 className="mb-4 font-semibold uppercase tracking-wider text-text">
                            Stay Informed
                        </h3>

                        <p className="mb-5 text-sm leading-7 text-text-secondary">
                            Subscribe to receive legal insights, statutory updates, expert advice articles, and platform feature announcements.
                        </p>

                        <div className="flex items-center rounded-xl border border-border bg-surface px-4 py-3 transition focus-within:border-secondary">

                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 bg-transparent text-sm text-text placeholder:text-muted outline-none"
                            />

                            <button
                                aria-label="Subscribe"
                                className="ml-3 rounded-lg bg-secondary p-2 text-surface-dark transition hover:bg-accent hover:shadow-md"
                            >
                                <HiPaperAirplane size={18} />
                            </button>

                        </div>

                    </div>

                    {/* For Clients */}

                    <div>

                        <h3 className="mb-4 font-semibold uppercase tracking-wider text-text">
                            For Clients
                        </h3>

                        <ul className="space-y-3">

                            <li>
                                <Link
                                    href="/lawyers"
                                    className="link-premium transition hover:text-secondary"
                                >
                                    Find a Lawyer
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/practice-areas"
                                    className="link-premium transition hover:text-secondary"
                                >
                                    Practice Areas
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/consultations"
                                    className="link-premium transition hover:text-secondary"
                                >
                                    Book Consultation
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/pricing"
                                    className="link-premium transition hover:text-secondary"
                                >
                                    Fee Transparency
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/signup"
                                    className="link-premium transition hover:text-secondary"
                                >
                                    Client Sign Up
                                </Link>
                            </li>

                        </ul>

                    </div>

                    {/* For Attorneys */}

                    <div>

                        <h3 className="mb-4 font-semibold uppercase tracking-wider text-text">
                            For Attorneys
                        </h3>

                        <ul className="space-y-3">

                            <li>
                                <Link
                                    href="/join-attorney"
                                    className="link-premium transition hover:text-secondary"
                                >
                                    Join as a Lawyer
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/attorney-plans"
                                    className="link-premium transition hover:text-secondary"
                                >
                                    Membership Plans
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/verification"
                                    className="link-premium transition hover:text-secondary"
                                >
                                    Bar Verification
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/dashboard"
                                    className="link-premium transition hover:text-secondary"
                                >
                                    Attorney Portal
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/support/lawyers"
                                    className="link-premium transition hover:text-secondary"
                                >
                                    Legal Partner Support
                                </Link>
                            </li>

                        </ul>

                    </div>

                    {/* Company & Legal */}

                    <div>

                        <h3 className="mb-4 font-semibold uppercase tracking-wider text-text">
                            Company & Legal
                        </h3>

                        <ul className="space-y-3">

                            <li>
                                <Link
                                    href="/about"
                                    className="link-premium transition hover:text-secondary"
                                >
                                    About LegalEase
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/blog"
                                    className="link-premium transition hover:text-secondary"
                                >
                                    Legal Advice Blog
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/terms"
                                    className="link-premium transition hover:text-secondary"
                                >
                                    Terms of Service
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/privacy"
                                    className="link-premium transition hover:text-secondary"
                                >
                                    Privacy Policy
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/faq"
                                    className="link-premium transition hover:text-secondary"
                                >
                                    FAQ
                                </Link>
                            </li>

                        </ul>

                    </div>

                    {/* Contact Info */}

                    <div>

                        <h3 className="mb-4 font-semibold uppercase tracking-wider text-text">
                            Contact
                        </h3>

                        <ul className="space-y-4 text-sm text-text-secondary">

                            <li className="flex items-start gap-3">
                                <span>📍</span>
                                <span>Chattogram, Bangladesh</span>
                            </li>

                            <li className="flex items-start gap-3">
                                <span>📧</span>
                                <span>support@legalease.com</span>
                            </li>

                            <li className="flex items-start gap-3">
                                <span>📞</span>
                                <span>+880 1234-567890</span>
                            </li>

                            <li className="flex items-start gap-3">
                                <span>🕒</span>
                                <span>24/7 Client Assistance</span>
                            </li>

                        </ul>

                    </div>

                </div>

                {/* Bottom Footer */}

                <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-border pt-8 md:flex-row">

                    <p className="text-center text-sm text-muted">
                        © {new Date().getFullYear()}{" "}
                        <span className="font-semibold text-text">
                            LegalEase
                        </span>
                        . All rights reserved.
                    </p>

                    <div className="flex items-center gap-4">

                        <a
                            href="https://github.com/yourusername"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub Profile"
                            className="rounded-full border border-border p-3 transition-all duration-300 hover:border-secondary hover:bg-secondary hover:text-surface-dark"
                        >
                            <FaGithub size={18} />
                        </a>

                        <a
                            href="https://linkedin.com/in/yourusername"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn Profile"
                            className="rounded-full border border-border p-3 transition-all duration-300 hover:border-secondary hover:bg-secondary hover:text-surface-dark"
                        >
                            <FaLinkedin size={18} />
                        </a>

                        <a
                            href="https://facebook.com/yourusername"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Facebook Page"
                            className="rounded-full border border-border p-3 transition-all duration-300 hover:border-secondary hover:bg-secondary hover:text-surface-dark"
                        >
                            <FaFacebook size={18} />
                        </a>

                        <a
                            href="https://instagram.com/yourusername"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram Profile"
                            className="rounded-full border border-border p-3 transition-all duration-300 hover:border-secondary hover:bg-secondary hover:text-surface-dark"
                        >
                            <FaInstagram size={18} />
                        </a>

                    </div>

                </div>

            </div>

        </footer>
    );
};

export default Footer;