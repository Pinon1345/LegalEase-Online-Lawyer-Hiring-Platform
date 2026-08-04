"use client";

import React, { useState } from "react";
import LawyerProfileForm from "@/components/dashboard/LawyerProfileForm";
import { useSession } from "@/lib/auth-client";

export default function ManageLawyerLegalProfile() {
    const { data: session } = useSession();
    const user = session?.user;

    // Local state representing the profile (Replace with your SWR/React Query/API hook)
    const [profile, setProfile] = useState(null);

    // Save or update profile handler
    const handleSaveProfile = async (profileData) => {
        console.log("Submitting backend payload:", profileData);
        // Replace with your API call, e.g.:
        // await fetch('/api/lawyers', { method: 'POST', body: JSON.stringify(profileData) });
        setProfile(profileData);
    };

    // Stripe verification payment handler
    const handleVerifyPayment = () => {
        // Trigger Stripe checkout session or modal
        alert("Redirecting to Stripe payment gateway for 1-time verification fee...");
    };

    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-2xl md:text-3xl font-black text-text mb-1">Manage Legal Profile</h1>
                <p className="text-sm text-text-secondary">
                    Create, update, and manage your public lawyer listing details.
                </p>
            </div>

            <LawyerProfileForm
                profile={profile}
                user={user}
                onSaveProfile={handleSaveProfile}
                onVerifyPayment={handleVerifyPayment}
            />
        </div>
    );
}