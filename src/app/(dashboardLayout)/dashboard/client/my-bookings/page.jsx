"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { baseURL } from '@/lib/api/baseUrl';
import { BookingStats } from '@/components/dashboard/client/BookingStats';
import { BookingFilter } from '@/components/dashboard/client/BookingFilter';
import { BookingTableRow } from '@/components/dashboard/client/BookingTableRow';
import { BookingCardMobile } from '@/components/dashboard/client/BookingCardMobile';
import { PaymentModal } from '@/components/dashboard/client/PaymentModal';
import { TableRowSkeleton } from '@/components/ui/Skeleton';
import { useSession } from '@/lib/auth-client';

const MyBookingsPage = () => {
    const { data: session, status } = useSession();
    const userEmail = session?.user?.email;

    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Modal state for payment settlement
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Controlled refresh state trigger to reload
    const [refreshIndex, setRefreshIndex] = useState(0);

    useEffect(() => {
        let isMounted = true;

        // Wait until session finishes loading
        if (status === 'loading') return;

        const fetchData = async () => {
            try {
                setIsLoading(true);

                // Build request URL with optional user email query parameter
                const url = userEmail
                    ? `${baseURL}/api/hire-lawyer?email=${encodeURIComponent(userEmail)}`
                    : `${baseURL}/api/hire-lawyer`;

                const res = await fetch(url, {
                    cache: 'no-store'
                });

                if (!res.ok) {
                    throw new Error("Failed to fetch hiring history");
                }

                const data = await res.json();

                if (isMounted) {
                    setBookings(Array.isArray(data) ? data : data.bookings || []);
                    setIsError(false);
                }
            } catch (error) {
                console.error("Error fetching bookings:", error);
                if (isMounted) {
                    setIsError(true);
                    toast.error("Failed to load hiring records.");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [userEmail, status, refreshIndex]);

    // Retry handler increments trigger state
    const handleRetry = () => {
        setIsLoading(true);
        setIsError(false);
        setRefreshIndex(prev => prev + 1);
    };

    const handleInitiatePayment = (booking) => {
        setSelectedBooking(booking);
        setIsModalOpen(true);
    };

    // Update state locally upon successful payment confirmation
    const handlePaymentSuccess = (bookingId) => {
        setBookings(prev =>
            prev.map(b => {
                const idMatches = (b._id || b.id) === bookingId;
                return idMatches ? { ...b, paymentStatus: 'paid', status: 'accepted' } : b;
            })
        );
    };


    // Defensive Filtering Logic for dynamic database records
    const filteredBookings = bookings.filter(b => {
        const lawyerName = (b.lawyerName || '').toLowerCase();
        const specialization = (b.specialization || b.lawyerSpecialization || b.category || '').toLowerCase();
        const slot = (b.scheduledSlot || b.scheduleSlot || b.hiringSlot || '').toLowerCase();
        const bookingId = (b._id || b.id || '').toLowerCase();
        const query = searchQuery.toLowerCase();

        const matchesSearch = lawyerName.includes(query) || specialization.includes(query) || slot.includes(query) || bookingId.includes(query);

        const paymentStatus = b.paymentStatus || 'unpaid';
        const status = b.status || (paymentStatus === 'paid' ? 'accepted' : 'pending');

        if (statusFilter === 'all') return matchesSearch;
        if (statusFilter === 'pending') return matchesSearch && status === 'pending';
        if (statusFilter === 'accepted') return matchesSearch && status === 'accepted' && paymentStatus !== 'paid';
        if (statusFilter === 'paid') return matchesSearch && paymentStatus === 'paid';
        if (statusFilter === 'rejected') return matchesSearch && status === 'rejected';

        return matchesSearch;
        
    });

    return (
        <div className="min-h-screen bg-background text-text p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">

            {/* Header Title Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-wider mb-2">
                        <Sparkles size={14} /> Client Dashboard
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 dark:text-neutral-100">
                        Hiring History
                    </h1>
                    <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                        Track your requested lawyers, monitor approval statuses, and pay consultation fees once accepted.
                    </p>
                </div>

                <Link
                    href="/lawyers"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-secondary text-surface-dark font-bold text-xs sm:text-sm shadow-lg hover:bg-secondary/90 transition-all self-start md:self-auto cursor-pointer"
                >
                    <Search size={16} />
                    Browse More Lawyers
                </Link>
            </div>

            {/* Top Metric Cards Component */}
            <BookingStats bookings={bookings} />

            {/* Filter and Search Bar Component */}
            <BookingFilter
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
            />

            {/* Hiring Table / Status Cards Section */}
            {isLoading ? (
                <TableRowSkeleton rows={4} />
            ) : isError ? (
                <div className="text-center py-16 rounded-3xl border border-dashed border-red-300 dark:border-red-900/50 bg-red-500/5 space-y-3">
                    <div className="h-12 w-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
                        <AlertCircle size={24} />
                    </div>
                    <p className="text-base font-bold text-neutral-800 dark:text-neutral-200">Failed to load hiring records</p>
                    <button
                        onClick={handleRetry}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-bold text-xs shadow-md transition hover:opacity-90 cursor-pointer"
                    >
                        <RefreshCw size={14} /> Retry Fetching
                    </button>
                </div>
            ) : filteredBookings.length === 0 ? (
                <div className="text-center py-16 rounded-3xl border border-dashed border-neutral-300 dark:border-neutral-800 bg-surface/30 dark:bg-neutral-900/20 space-y-3">
                    <div className="h-12 w-12 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-400 flex items-center justify-center mx-auto">
                        <AlertCircle size={24} />
                    </div>
                    <p className="text-base font-bold text-neutral-800 dark:text-neutral-200">No hiring records found</p>
                    <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                        No requests match your selected criteria or search term.
                    </p>
                </div>
            ) : (
                <>
                    {/* Desktop View Table */}
                    <div className="hidden md:block overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-surface dark:bg-neutral-900 shadow-xl">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-800/40 text-[11px] font-black uppercase text-neutral-400 tracking-wider">
                                    <th className="py-4 px-6">Lawyer Name</th>
                                    <th className="py-4 px-4">Hiring Date</th>
                                    <th className="py-4 px-4">Hiring Slot</th>
                                    <th className="py-4 px-4">Fee</th>
                                    <th className="py-4 px-4">Specialization</th>
                                    <th className="py-4 px-4">Status</th>
                                    <th className="py-4 px-6 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 text-xs sm:text-sm">
                                {filteredBookings.map((booking) => (
                                    <BookingTableRow
                                        key={booking._id || booking.id}
                                        booking={booking}
                                        onInitiatePayment={handleInitiatePayment}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile View Card Stack */}
                    <div className="md:hidden space-y-4">
                        {filteredBookings.map((booking) => (
                            <BookingCardMobile
                                key={booking._id || booking.id}
                                booking={booking}
                                onInitiatePayment={handleInitiatePayment}
                            />
                        ))}
                    </div>
                </>
            )}

            {/* Payment Modal Component */}
            <PaymentModal
                key={selectedBooking?._id || selectedBooking?.id || 'payment-modal'}
                booking={selectedBooking}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onPaymentSuccess={handlePaymentSuccess}
            />

        </div>
    );
};

export default MyBookingsPage;