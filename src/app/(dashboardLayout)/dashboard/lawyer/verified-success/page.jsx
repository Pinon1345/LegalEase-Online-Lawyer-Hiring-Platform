import Link from 'next/link'
import { redirect } from 'next/navigation'
import { stripe } from '@/lib/stripe'
import { ShieldCheck, ArrowRight, Mail, FileText, Sparkles, CheckCircle2 } from 'lucide-react'

export default async function VerifiedSuccess({ searchParams }) {
    const { session_id } = await searchParams

    if (!session_id) {
        throw new Error('Please provide a valid session_id (`cs_test_...`)')
    }

    const session = await stripe.checkout.sessions.retrieve(session_id, {
        expand: ['line_items', 'payment_intent']
    })

    const { status, customer_details, amount_total, currency } = session
    const customerEmail = customer_details?.email || 'your email'

    // Format payment amount ($100.00)
    const formattedAmount = ((amount_total || 10000) / 100).toLocaleString('en-US', {
        style: 'currency',
        currency: currency ? currency.toUpperCase() : 'USD',
    })

    if (status === 'open') {
        return redirect('/')
    }

    if (status === 'complete') {
        return (
            <main className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 bg-background relative overflow-hidden">
                {/* Background Ambient Glows */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-secondary/15 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-10 right-10 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="max-w-2xl w-full mx-auto relative z-10">
                    <div className="overflow-hidden rounded-3xl border border-secondary/30 bg-surface/80 dark:bg-neutral-900/80 backdrop-blur-2xl shadow-2xl p-8 md:p-12 text-center relative">

                        {/* Glow Accent Circle */}
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />

                        {/* Success Shield Icon */}
                        <div className="flex justify-center mb-6 relative">
                            <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-secondary to-emerald-500 opacity-20 blur-xl"></div>
                            <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-surface dark:bg-neutral-800 border border-secondary/40 text-secondary shadow-2xl">
                                <ShieldCheck size={52} className="text-secondary" />
                            </div>
                        </div>

                        {/* Verification Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-bold uppercase tracking-wider mb-4">
                            <Sparkles size={14} /> Verification Unlocked
                        </div>

                        <h1 className="text-3xl md:text-4xl font-black text-text tracking-tight mb-3">
                            Welcome to <span className="text-secondary">LegalEase</span> Pro!
                        </h1>

                        <p className="text-text-secondary text-base md:text-lg max-w-md mx-auto leading-relaxed mb-8">
                            Your one-time <strong className="text-text font-bold">{formattedAmount}</strong> lawyer verification publishing fee has been processed successfully.
                        </p>

                        {/* Transaction Receipt Details Card */}
                        <div className="mb-8 p-5 rounded-2xl bg-neutral-100/60 dark:bg-neutral-800/40 border border-secondary/15 text-left space-y-3 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-text-secondary flex items-center gap-2">
                                    <Mail size={16} className="text-secondary" /> Confirmation Receipt:
                                </span>
                                <span className="font-semibold text-text truncate max-w-[180px] sm:max-w-xs">{customerEmail}</span>
                            </div>

                            <div className="h-px bg-neutral-200 dark:bg-neutral-700/50 my-2" />

                            <div className="flex items-center justify-between">
                                <span className="text-text-secondary flex items-center gap-2">
                                    <CheckCircle2 size={16} className="text-emerald-500" /> Account Status:
                                </span>
                                <span className="font-bold text-emerald-500">Verified Partner</span>
                            </div>

                            <div className="h-px bg-neutral-200 dark:bg-neutral-700/50 my-2" />

                            <div className="flex items-center justify-between">
                                <span className="text-text-secondary flex items-center gap-2">
                                    <FileText size={16} className="text-secondary" /> Stripe Session ID:
                                </span>
                                <span className="font-mono text-xs text-text-secondary truncate max-w-[160px] sm:max-w-[200px]">
                                    {session.id}
                                </span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link
                                href="/dashboard/lawyer/manage-legal-profile?payment=success"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-secondary text-surface-dark font-black text-base shadow-xl hover:bg-secondary-light transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                            >
                                Create Profile Now
                                <ArrowRight size={20} />
                            </Link>

                            <Link
                                href="/dashboard"
                                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-4 rounded-xl border border-neutral-300 dark:border-neutral-700 text-text font-bold text-base hover:bg-surface-dark/5 dark:hover:bg-neutral-800 transition-all duration-300"
                            >
                                Go to Dashboard
                            </Link>
                        </div>

                        {/* Support Note */}
                        <p className="text-xs text-text-secondary mt-8">
                            Have questions? Contact our support team at{' '}
                            <a href="mailto:support@legalease.com" className="text-secondary font-medium underline hover:opacity-80">
                                support@legalease.com
                            </a>
                        </p>

                    </div>
                </div>
            </main>
        )
    }
}