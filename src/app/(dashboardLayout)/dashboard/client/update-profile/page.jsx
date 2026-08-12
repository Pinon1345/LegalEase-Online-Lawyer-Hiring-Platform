'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { FormSkeleton, ProfileCardSkeleton } from '@/components/ui/Skeleton';
import ClientProfileForm from '@/components/client-profile/ClientProfileForm';
import ClientProfileCard from '@/components/client-profile/ClientProfileCard';
import DeleteConfirmationModal from '@/components/client-profile/DeleteConfirmationModal';
import { baseURL } from '@/lib/api/baseUrl';
import { useSession } from '@/lib/auth-client';

export default function UpdateClientProfile() {
    const { data: session, status } = useSession();
    const user = session?.user;

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [statusMessage, setStatusMessage] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        phone: '',
        bio: '',
        imageUrl: ''
    });

    const [savedProfile, setSavedProfile] = useState({ ...formData });

    const clientEmail = user?.email;

    // 1. GET: Load Client Profile directly from backend
    useEffect(() => {
        let isMounted = true;

        async function fetchProfile() {
            if (status === 'loading') return;

            if (!clientEmail) {
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const res = await fetch(`${baseURL}/api/client/profile?email=${encodeURIComponent(clientEmail)}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    cache: 'no-store'
                });

                if (res.ok && isMounted) {
                    const data = await res.json();
                    const profileData = {
                        firstName: data.firstName || user?.name?.split(' ')[0] || '',
                        middleName: data.middleName || '',
                        lastName: data.lastName || user?.name?.split(' ').slice(1).join(' ') || '',
                        email: data.email || clientEmail,
                        phone: data.phone || '',
                        bio: data.bio || '',
                        imageUrl: data.imageUrl || user?.image || ''
                    };

                    setFormData(profileData);
                    setSavedProfile(profileData);
                } else if (isMounted) {
                    // Default fallback if profile document doesn't exist yet
                    const fallbackData = {
                        firstName: user?.name?.split(' ')[0] || '',
                        middleName: '',
                        lastName: user?.name?.split(' ').slice(1).join(' ') || '',
                        email: clientEmail,
                        phone: '',
                        bio: '',
                        imageUrl: user?.image || ''
                    };
                    setFormData(fallbackData);
                    setSavedProfile(fallbackData);
                }
            } catch (error) {
                console.error("Error loading client profile:", error);
                if (isMounted) setStatusMessage({ type: 'error', text: 'Failed to load profile data.' });
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }

        fetchProfile();

        return () => { isMounted = false; };
    }, [clientEmail, status, user]);

    // 2. PATCH: Update Client Profile API
    const handleSaveProfile = async (e) => {
        e.preventDefault();
        if (!clientEmail) return;

        setIsSaving(true);
        setStatusMessage(null);

        try {
            const res = await fetch(`${baseURL}/api/client/profile?email=${encodeURIComponent(clientEmail)}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setSavedProfile({ ...formData });
                setStatusMessage({ type: 'success', text: 'Client profile updated successfully!' });
            } else {
                const errData = await res.json();
                setStatusMessage({ type: 'error', text: errData.error || 'Failed to update profile.' });
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            setStatusMessage({ type: 'error', text: 'Server error while saving profile.' });
        } finally {
            setIsSaving(false);
        }
    };

    // Load saved data into form for editing
    const handleEditProfile = () => {
        setFormData({ ...savedProfile });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setStatusMessage({ type: 'info', text: 'Loaded current profile into form for editing.' });
    };

    // 3. DELETE: Delete/Reset Client Profile API
    const handleConfirmDelete = async () => {
        if (!clientEmail) return;

        setIsDeleting(true);
        try {
            const res = await fetch(`${baseURL}/api/client/profile?email=${encodeURIComponent(clientEmail)}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });

            if (res.ok) {
                const emptyState = {
                    firstName: '',
                    middleName: '',
                    lastName: '',
                    email: clientEmail,
                    phone: '',
                    bio: '',
                    imageUrl: ''
                };
                setFormData(emptyState);
                setSavedProfile(emptyState);
                setIsDeleteModalOpen(false);
                setStatusMessage({ type: 'error', text: 'Client profile details have been reset.' });
            } else {
                setStatusMessage({ type: 'error', text: 'Failed to delete profile.' });
            }
        } catch (error) {
            console.error("Error deleting profile:", error);
            setStatusMessage({ type: 'error', text: 'Server error while resetting profile.' });
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-text p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-10">

            {/* Header Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-neutral-900/10 via-neutral-800/10 to-neutral-900/10 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 border border-secondary/20 p-6 sm:p-10 shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-bold uppercase tracking-wider">
                        <Sparkles size={14} /> Client Account Settings
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                        Client <span className="text-secondary">Profile Management</span>
                    </h1>
                    <p className="text-neutral-400 text-sm sm:text-base max-w-2xl">
                        Keep your legal contact details updated so verified attorneys and legal partners can assist you efficiently.
                    </p>
                </div>
            </div>

            {/* Notification Toast / Alert */}
            {statusMessage && (
                <div className={`p-4 rounded-2xl border flex items-center justify-between text-xs sm:text-sm font-semibold transition-all ${statusMessage.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' :
                        statusMessage.type === 'error' ? 'bg-rose-500/10 border-rose-500/30 text-rose-500' :
                            'bg-secondary/10 border-secondary/30 text-secondary'
                    }`}>
                    <div className="flex items-center gap-2.5">
                        {statusMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                        <span>{statusMessage.text}</span>
                    </div>
                    <button onClick={() => setStatusMessage(null)} className="text-xs hover:underline opacity-80">Dismiss</button>
                </div>
            )}

            {/* Main Content Layout with Skeleton Wrappers */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Profile Form */}
                <div className="lg:col-span-7">
                    {isLoading ? (
                        <FormSkeleton />
                    ) : (
                        <ClientProfileForm
                            formData={formData}
                            setFormData={setFormData}
                            onSave={handleSaveProfile}
                            isSaving={isSaving}
                        />
                    )}
                </div>

                {/* Profile Card Summary */}
                <div className="lg:col-span-5 lg:sticky lg:top-8">
                    {isLoading ? (
                        <ProfileCardSkeleton />
                    ) : (
                        <ClientProfileCard
                            profile={savedProfile}
                            onEdit={handleEditProfile}
                            onDeleteClick={() => setIsDeleteModalOpen(true)}
                        />
                    )}
                </div>

            </div>

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                isDeleting={isDeleting}
            />

        </div>
    );
}