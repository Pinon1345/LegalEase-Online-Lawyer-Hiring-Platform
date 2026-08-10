"use client";

import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { FormSkeleton, ProfileCardSkeleton } from '@/components/ui/Skeleton';
import ClientProfileForm from '@/components/client-profile/ClientProfileForm';
import ClientProfileCard from '@/components/client-profile/ClientProfileCard';
import DeleteConfirmationModal from '@/components/client-profile/DeleteConfirmationModal';

export default function UpdateClientProfile() {
    const [isLoading, setIsLoading] = useState(true);

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
    const [isSaving, setIsSaving] = useState(false);
    const [statusMessage, setStatusMessage] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Simulate fetching profile data on component mount

    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            try {

                // Simulate network latency / DB fetch

                await new Promise((resolve) => setTimeout(resolve, 1000));

                const initialData = {
                    firstName: 'Alex',
                    middleName: '',
                    lastName: 'Morgan',
                    email: 'alex.morgan@example.com',
                    phone: '+1 (555) 234-5678',
                    bio: 'Seeking strategic legal consultation for startup corporate governance and intellectual property licensing agreements.',
                    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
                };

                setFormData(initialData);
                setSavedProfile(initialData);
            } catch (error) {
                console.error("Error loading profile:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleSaveProfile = (e) => {
        e.preventDefault();
        setIsSaving(true);

        setTimeout(() => {
            setSavedProfile({ ...formData });
            setIsSaving(false);
            setStatusMessage({ type: 'success', text: 'Client profile updated successfully!' });
        }, 600);
    };

    const handleEditProfile = () => {
        setFormData({ ...savedProfile });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setStatusMessage({ type: 'info', text: 'Loaded profile into form for editing.' });
    };

    const handleConfirmDelete = () => {
        const emptyState = {
            firstName: '',
            middleName: '',
            lastName: '',
            email: '',
            phone: '',
            bio: '',
            imageUrl: ''
        };
        setFormData(emptyState);
        setSavedProfile(emptyState);
        setIsDeleteModalOpen(false);
        setStatusMessage({ type: 'error', text: 'Client profile details have been reset.' });
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

                {/* Profile Form (Shows FormSkeleton while loading) */}

                <div className="lg:col-span-7">
                    {isLoading ? (
                        <FormSkeleton />
                    ) : (
                        <ClientProfileForm
                            formData={formData}
                            setFormData={setFormData}
                            onSave={handleSaveProfile}
                            isSaving={isSaving}
                            setStatusMessage={setStatusMessage}
                        />
                    )}
                </div>

                {/* Profile Card Summary (Shows ProfileCardSkeleton while loading) */}

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

            {/* Delete Modal */}

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
            />

        </div>
    );
}