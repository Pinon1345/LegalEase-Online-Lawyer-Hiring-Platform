import React from 'react';
import Link from 'next/link';
import {
    Calendar,
    Clock,
    UserCheck,
    FileText,
    ArrowUpRight,
    Search,
    ShieldCheck,
    Briefcase,
    MessageSquare,
    AlertCircle,
    ChevronRight,
    Sparkles,
    CheckCircle2
} from 'lucide-react';
import Image from 'next/image';

const ClientDashboardOverviewPage = () => {
    // Mock user & statistics data
    const clientStats = {
        activeConsultations: 2,
        completedSessions: 8,
        pendingReviews: 1,
        totalSpent: '$1,250.00'
    };

    const upcomingBookings = [
        {
            id: 'b1',
            lawyerName: 'Tariq Al-Mansoor',
            specialization: 'Labor & Employment',
            date: 'Sept 02, 2026',
            time: '06:00 PM',
            status: 'Confirmed',
            avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80'
        },
        {
            id: 'b2',
            lawyerName: 'Elena Rostova',
            specialization: 'Corporate & Contract Law',
            date: 'Sept 08, 2026',
            time: '02:30 PM',
            status: 'Confirmed',
            avatar: 'https://plus.unsplash.com/premium_photo-1743020414629-442467fad611?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fGZlbWFsZSUyMGxhd3llcnN8ZW58MHx8MHx8fDA%3D'
        }
    ];

    const recentActivities = [
        {
            id: 1,
            title: 'Payment Secured',
            desc: 'Consultation fee with Tariq Al-Mansoor ($405.00)',
            time: '2 hours ago',
            icon: CheckCircle2,
            iconColor: 'text-emerald-500'
        },
        {
            id: 2,
            title: 'Document Shared',
            desc: 'Uploaded Employment_Contract_Draft.pdf',
            time: 'Yesterday',
            icon: FileText,
            iconColor: 'text-secondary'
        },
        {
            id: 3,
            title: 'Consultation Completed',
            desc: 'Session with Attorney Sarah Jenkins',
            time: '3 days ago',
            icon: UserCheck,
            iconColor: 'text-blue-500'
        }
    ];

    return (
        <div className="min-h-screen bg-background text-text p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">

            {/* Top Welcome Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-neutral-900/10 via-neutral-800/10 to-neutral-900/10 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 border border-secondary/20 p-6 sm:p-10 shadow-2xl">
                {/* Ambient Glow background */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-bold uppercase tracking-wider">
                            <Sparkles size={14} /> Client Portal
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black text-slate-600 dark:text-slate-100 tracking-tight">
                            Welcome Back, <span className="text-secondary">Client</span>
                        </h1>
                        <p className="text-neutral-400 text-sm sm:text-base max-w-xl">
                            Manage your legal consultations, review document updates, and connect with top legal professionals.
                        </p>
                    </div>

                    <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
                        <Link
                            href="/lawyers"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-secondary text-surface-dark font-black text-sm shadow-xl hover:bg-secondary-light transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
                        >
                            <Search size={18} />
                            Find an Attorney
                        </Link>
                    </div>
                </div>
            </div>

            {/* Key Metrics Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">

                {/* Stat 1 */}
                <div className="rounded-2xl p-5 border border-secondary/15 bg-surface/80 dark:bg-neutral-900/60 backdrop-blur-xl shadow-lg flex items-center justify-between group hover:border-secondary/40 transition-all">
                    <div>
                        <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">Upcoming Sessions</p>
                        <p className="text-2xl sm:text-3xl font-black text-text mt-1">{clientStats.activeConsultations}</p>
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                        <Calendar size={24} />
                    </div>
                </div>

                {/* Stat 2 */}
                <div className="rounded-2xl p-5 border border-secondary/15 bg-surface/80 dark:bg-neutral-900/60 backdrop-blur-xl shadow-lg flex items-center justify-between group hover:border-secondary/40 transition-all">
                    <div>
                        <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">Completed Sessions</p>
                        <p className="text-2xl sm:text-3xl font-black text-text mt-1">{clientStats.completedSessions}</p>
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                        <UserCheck size={24} />
                    </div>
                </div>

                {/* Stat 3 */}
                <div className="rounded-2xl p-5 border border-secondary/15 bg-surface/80 dark:bg-neutral-900/60 backdrop-blur-xl shadow-lg flex items-center justify-between group hover:border-secondary/40 transition-all">
                    <div>
                        <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">Total Investment</p>
                        <p className="text-2xl sm:text-3xl font-black text-text mt-1">{clientStats.totalSpent}</p>
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                        <Briefcase size={24} />
                    </div>
                </div>

                {/* Stat 4 */}
                <div className="rounded-2xl p-5 border border-secondary/15 bg-surface/80 dark:bg-neutral-900/60 backdrop-blur-xl shadow-lg flex items-center justify-between group hover:border-secondary/40 transition-all">
                    <div>
                        <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">Security Protection</p>
                        <p className="text-lg font-bold text-emerald-500 mt-2 flex items-center gap-1">
                            <ShieldCheck size={18} /> Active Escrow
                        </p>
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                        <ShieldCheck size={24} />
                    </div>
                </div>

            </div>

            {/* Main Content Sections: Bookings & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column (2 Cols): Upcoming Consultations */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-text flex items-center gap-2">
                                <Calendar className="text-secondary" size={20} /> Scheduled Legal Consultations
                            </h2>
                            <p className="text-xs text-text-secondary mt-0.5">Your confirmed appointments with verified attorneys</p>
                        </div>
                        <Link
                            href="/dashboard/client/my-bookings"
                            className="text-xs font-bold text-secondary hover:underline flex items-center gap-1"
                        >
                            View All <ChevronRight size={14} />
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {upcomingBookings.map((booking) => (
                            <div
                                key={booking.id}
                                className="p-5 sm:p-6 rounded-2xl bg-surface/80 dark:bg-neutral-900/70 border border-secondary/20 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-secondary/40 transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <Image
                                        src={booking.avatar}
                                        alt={booking.lawyerName}
                                        width={800}
                                        height={800}
                                        className="w-14 h-14 rounded-2xl object-cover border border-secondary/30 shrink-0"
                                    />
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-text text-base sm:text-lg">{booking.lawyerName}</h3>
                                            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                                {booking.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-secondary font-medium">{booking.specialization}</p>
                                        <div className="flex flex-wrap items-center gap-3 text-xs text-text-secondary pt-1">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={13} className="text-secondary" /> {booking.date}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock size={13} className="text-secondary" /> {booking.time}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-neutral-200 dark:border-neutral-800">
                                    <Link
                                        href={`/dashboard/client/my-bookings`}
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/30 text-xs font-bold transition-all"
                                    >
                                        <MessageSquare size={14} /> Join Session
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quick Guidance Box */}
                    <div className="p-6 rounded-2xl bg-gradient-to-r from-secondary/10 via-surface to-surface dark:from-secondary/10 dark:via-neutral-900 dark:to-neutral-900 border border-secondary/20 flex items-start gap-4">
                        <div className="p-3 rounded-2xl bg-secondary/20 text-secondary shrink-0">
                            <AlertCircle size={22} />
                        </div>
                        <div className="space-y-1 text-xs sm:text-sm">
                            <h4 className="font-bold text-text">Need to upload documents before your consultation?</h4>
                            <p className="text-text-secondary leading-relaxed">
                                Ensure your attorney has all background information ready. You can attach case files and contract drafts directly in your booking details.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Column (1 Col): Activity Log & Quick Actions */}
                <div className="space-y-6">

                    {/* Recent Activity Card */}
                    <div className="p-6 rounded-2xl bg-surface/80 dark:bg-neutral-900/70 border border-secondary/20 backdrop-blur-xl shadow-xl space-y-6">
                        <h2 className="text-lg font-bold text-text flex items-center gap-2">
                            <Clock className="text-secondary" size={18} /> Recent Activity
                        </h2>

                        <div className="space-y-4">
                            {recentActivities.map((act) => {
                                const IconComp = act.icon;
                                return (
                                    <div key={act.id} className="flex items-start gap-3.5 pb-3 border-b border-neutral-100 dark:border-neutral-800/60 last:border-0 last:pb-0">
                                        <div className={`p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 shrink-0 ${act.iconColor}`}>
                                            <IconComp size={16} />
                                        </div>
                                        <div className="space-y-0.5 text-xs">
                                            <p className="font-bold text-text">{act.title}</p>
                                            <p className="text-text-secondary leading-snug">{act.desc}</p>
                                            <p className="text-[10px] text-neutral-400 font-mono pt-1">{act.time}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Quick Links Card */}
                    <div className="p-6 rounded-2xl bg-surface/80 dark:bg-neutral-900/70 border border-secondary/20 backdrop-blur-xl shadow-xl space-y-4">
                        <h2 className="text-lg font-bold text-text">Quick Actions</h2>
                        <div className="space-y-2 text-xs font-semibold">
                            <Link
                                href="/lawyers"
                                className="flex items-center justify-between p-3 rounded-xl bg-neutral-100/70 dark:bg-neutral-800/50 hover:bg-secondary/10 hover:text-secondary border border-transparent hover:border-secondary/20 transition-all text-text"
                            >
                                <span className="flex items-center gap-2">
                                    <Search size={15} className="text-secondary" /> Search Top Lawyers
                                </span>
                                <ArrowUpRight size={14} />
                            </Link>

                            <Link
                                href="/dashboard/client/my-bookings"
                                className="flex items-center justify-between p-3 rounded-xl bg-neutral-100/70 dark:bg-neutral-800/50 hover:bg-secondary/10 hover:text-secondary border border-transparent hover:border-secondary/20 transition-all text-text"
                            >
                                <span className="flex items-center gap-2">
                                    <Calendar size={15} className="text-secondary" /> View Consultation Schedule
                                </span>
                                <ArrowUpRight size={14} />
                            </Link>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    );
};

export default ClientDashboardOverviewPage;