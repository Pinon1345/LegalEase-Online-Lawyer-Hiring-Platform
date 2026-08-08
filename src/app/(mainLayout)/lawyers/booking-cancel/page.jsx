import Link from 'next/link';
import {
    XCircle,
    ArrowLeft,
    CalendarX,
    RefreshCw,
    HelpCircle,
    ShieldAlert,
    User,
    Sparkles,
    Search
} from 'lucide-react';

export default function BookingPaymentCancel() {
    return (
        <main className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 bg-background relative overflow-hidden">
            {/* Background Ambient Glows */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-80 h-80 bg-rose-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-2xl w-full mx-auto relative z-10">
                <div className="overflow-hidden rounded-3xl border border-rose-500/20 bg-surface/80 dark:bg-neutral-900/80 backdrop-blur-2xl shadow-2xl p-8 md:p-12 text-center relative">

                    {/* Glow Accent Circle */}
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />

                    {/* Cancel Icon Badge */}
                    <div className="flex justify-center mb-6 relative">
                        <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 opacity-20 blur-xl"></div>
                        <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-surface dark:bg-neutral-800 border border-rose-500/30 text-rose-500 shadow-2xl">
                            <CalendarX size={52} className="text-rose-500" />
                        </div>
                    </div>

                    {/* Badge / Header Notice */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-wider mb-4">
                        <ShieldAlert size={14} /> Consultation Reserved Slot Released
                    </div>

                    <h1 className="text-3xl md:text-4xl font-black text-text tracking-tight mb-3">
                        Booking <span className="text-rose-500">Cancelled</span>
                    </h1>

                    <p className="text-text-secondary text-base md:text-lg max-w-md mx-auto leading-relaxed mb-8">
                        Your checkout session was cancelled. No payment was charged, and your appointment time slot was not reserved.
                    </p>

                    {/* Details Card */}
                    <div className="mb-8 p-5 sm:p-6 rounded-2xl bg-neutral-100/60 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700/50 text-left space-y-3.5 text-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-text-secondary flex items-center gap-2">
                                <User size={16} className="text-secondary" /> Service Type:
                            </span>
                            <span className="font-bold text-text">Legal Consultation Session</span>
                        </div>

                        <div className="h-px bg-neutral-200 dark:bg-neutral-700/50" />

                        <div className="flex items-center justify-between">
                            <span className="text-text-secondary flex items-center gap-2">
                                <XCircle size={16} className="text-rose-500" /> Payment Status:
                            </span>
                            <span className="font-semibold text-rose-500">Cancelled / Unpaid</span>
                        </div>

                        <div className="h-px bg-neutral-200 dark:bg-neutral-700/50" />

                        {/* Informational Note */}
                        <div className="pt-2 text-xs text-text-secondary flex items-start gap-2">
                            <Sparkles size={16} className="text-secondary shrink-0 mt-0.5" />
                            <span>
                                Ready to talk to an attorney? You can restart the booking process at any time or explore other legal specialists in our directory.
                            </span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            href="/lawyers"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-secondary text-surface-dark font-black text-base shadow-xl hover:bg-secondary-light transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                        >
                            <Search size={18} />
                            Browse Lawyers
                        </Link>

                        <Link
                            href="/"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-neutral-300 dark:border-neutral-700 text-text font-bold text-base hover:bg-surface-dark/5 dark:hover:bg-neutral-800 transition-all duration-300"
                        >
                            <ArrowLeft size={18} />
                            Return to Home
                        </Link>
                    </div>

                    {/* Support Footer */}
                    <div className="flex items-center justify-center gap-2 mt-8 text-xs text-text-secondary">
                        <HelpCircle size={14} className="text-secondary shrink-0" />
                        <span>
                            Encountering issues during checkout? Contact{' '}
                            <a href="mailto:support@legalease.com" className="text-secondary font-medium underline hover:opacity-80">
                                support@legalease.com
                            </a>
                        </span>
                    </div>

                </div>
            </div>
        </main>
    );
}