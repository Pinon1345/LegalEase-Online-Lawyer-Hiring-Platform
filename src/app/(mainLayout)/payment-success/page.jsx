import Link from 'next/link';
import { redirect } from 'next/navigation';
import { stripe } from '@/lib/stripe';
import {
    CheckCircle2,
    ArrowRight,
    Mail,
    FileText,
    Sparkles,
    Calendar,
    Clock,
    UserCheck,
    ShieldCheck
} from 'lucide-react';
import { baseURL } from '@/lib/api/baseUrl';
import { getUser } from '@/lib/api/session';

export default async function BookingPaymentSuccess({ searchParams }) {
    const { session_id } = await searchParams;

    const user = await getUser();

    if (!session_id) {
        throw new Error('Please provide a valid session_id (`cs_test_...`)');
    }

    // 1. Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id, {
        expand: ['line_items', 'payment_intent']
    });

    const { status, customer_details, amount_total, currency, metadata, payment_status } = session;

    // Extract values matching backend expectation
    const bookingId = metadata?.bookingId || null;
    const clientEmail = metadata?.clientEmail || metadata?.email || customer_details?.email || 'your email';
    const lawyerName = metadata?.lawyerName || 'Your Attorney';
    const lawyerId = metadata?.lawyerId || '';
    const paymentType = metadata?.paymentType || 'booking';
    const transactionId = (typeof session.payment_intent === 'object' ? session.payment_intent?.id : session.payment_intent) || session.id;
    const resolvedPaymentStatus = metadata?.paymentStatus || payment_status || 'paid';
    const amount = metadata?.amount || (amount_total ? amount_total / 100 : 0);

    // 2. Sync payment completion with Express backend endpoint (`/api/lawyers/booking-payment`)
    try {
        const res = await fetch(`${baseURL}/api/lawyers/booking-payment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            cache: 'no-store',
            body: JSON.stringify({
                bookingId: bookingId,
                amount: amount,
                lawyerId: lawyerId,
                lawyerName: lawyerName,
                paymentStatus: resolvedPaymentStatus,
                email: clientEmail,
                paymentType: paymentType,
                transactionId: transactionId
            })
        });

        if (res.ok) {
            const data = await res.json();
            console.log("Lawyer Booking Data created successfully:", data);
        } else {
            console.error("Failed to sync booking payment status with backend");
        }
    } catch (err) {
        console.error("Error calling booking-payment API:", err);
    }

    // Extract display metadata
    const selectedDate = metadata?.selectedDate || 'Upcoming Date';
    const selectedTimeSlot = metadata?.selectedTimeSlot || 'Scheduled Time';

    // Format payment total amount ($125.00)
    const formattedAmount = (Number(amount) || 0).toLocaleString('en-US', {
        style: 'currency',
        currency: currency ? currency.toUpperCase() : 'USD',
    });

    if (status === 'open') {
        return redirect('/');
    }

    if (status === 'complete') {
        return (
            <main className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 bg-background relative overflow-hidden">
                {/* Background Ambient Glows */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-secondary/15 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="max-w-2xl w-full mx-auto relative z-10">
                    <div className="overflow-hidden rounded-3xl border border-secondary/30 bg-surface/80 dark:bg-neutral-900/80 backdrop-blur-2xl shadow-2xl p-8 md:p-12 text-center relative">

                        {/* Glow Accent Circle */}
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />

                        {/* Success Icon Badge */}
                        <div className="flex justify-center mb-6 relative">
                            <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-secondary to-emerald-500 opacity-20 blur-xl"></div>
                            <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-surface dark:bg-neutral-800 border border-secondary/40 text-secondary shadow-2xl">
                                <UserCheck size={52} className="text-secondary" />
                            </div>
                        </div>

                        {/* Consultation Locked Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-bold uppercase tracking-wider mb-4">
                            <Sparkles size={14} /> Consultation Confirmed
                        </div>

                        <h1 className="text-3xl md:text-4xl font-black text-text tracking-tight mb-3">
                            Booking <span className="text-secondary">Confirmed!</span>
                        </h1>

                        <p className="text-text-secondary text-base md:text-lg max-w-md mx-auto leading-relaxed mb-8">
                            Your legal consultation payment of <strong className="text-text font-bold">{formattedAmount}</strong> with <strong className="text-secondary font-bold">{lawyerName}</strong> has been successfully processed.
                        </p>

                        {/* Transaction & Appointment Details Card */}
                        <div className="mb-8 p-5 sm:p-6 rounded-2xl bg-neutral-100/60 dark:bg-neutral-800/40 border border-secondary/15 text-left space-y-3.5 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-text-secondary flex items-center gap-2">
                                    <UserCheck size={16} className="text-secondary" /> Attorney:
                                </span>
                                <span className="font-bold text-text">{lawyerName}</span>
                            </div>

                            <div className="h-px bg-neutral-200 dark:bg-neutral-700/50" />

                            <div className="flex items-center justify-between">
                                <span className="text-text-secondary flex items-center gap-2">
                                    <Calendar size={16} className="text-secondary" /> Scheduled Date:
                                </span>
                                <span className="font-semibold text-text">{selectedDate}</span>
                            </div>

                            <div className="h-px bg-neutral-200 dark:bg-neutral-700/50" />

                            <div className="flex items-center justify-between">
                                <span className="text-text-secondary flex items-center gap-2">
                                    <Clock size={16} className="text-secondary" /> Time Slot:
                                </span>
                                <span className="font-semibold text-text">{selectedTimeSlot}</span>
                            </div>

                            <div className="h-px bg-neutral-200 dark:bg-neutral-700/50" />

                            <div className="flex items-center justify-between">
                                <span className="text-text-secondary flex items-center gap-2">
                                    <Mail size={16} className="text-secondary" /> Receipt Sent To:
                                </span>
                                <span className="font-semibold text-text truncate max-w-[180px] sm:max-w-xs">{clientEmail}</span>
                            </div>

                            <div className="h-px bg-neutral-200 dark:bg-neutral-700/50" />

                            <div className="flex items-center justify-between">
                                <span className="text-text-secondary flex items-center gap-2">
                                    <CheckCircle2 size={16} className="text-emerald-500" /> Booking Status:
                                </span>
                                <span className="font-bold text-emerald-500">Payment Secured</span>
                            </div>

                            <div className="h-px bg-neutral-200 dark:bg-neutral-700/50" />

                            <div className="flex items-center justify-between">
                                <span className="text-text-secondary flex items-center gap-2">
                                    <FileText size={16} className="text-secondary" /> Transaction ID:
                                </span>
                                <span className="font-mono text-xs text-text-secondary truncate max-w-[160px] sm:max-w-[200px]">
                                    {transactionId}
                                </span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link
                                href="/dashboard/client/my-bookings"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-secondary text-surface-dark font-black text-base shadow-xl hover:bg-secondary-light transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                            >
                                View My Bookings
                                <ArrowRight size={20} />
                            </Link>

                            <Link
                                href={`/dashboard/${user?.role || 'client'}`}
                                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-4 rounded-xl border border-neutral-300 dark:border-neutral-700 text-text font-bold text-base hover:bg-surface-dark/5 dark:hover:bg-neutral-800 transition-all duration-300"
                            >
                                Dashboard
                            </Link>
                        </div>

                        {/* Support Note */}
                        <div className="flex items-center justify-center gap-2 mt-8 text-xs text-text-secondary">
                            <ShieldCheck size={14} className="text-secondary shrink-0" />
                            <span>
                                Protected by LegalEase Guarantee. Need help? Contact{' '}
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
}