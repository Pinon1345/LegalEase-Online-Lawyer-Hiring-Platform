"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useSession } from "@/lib/auth-client";
import { baseURL } from "@/lib/api/baseUrl";
import { Loader2 } from "lucide-react";
import LawyerProfileForm from "@/components/dashboard/LawyerProfileForm";

function LegalProfileContent() {
    const { data: session } = useSession();
    const user = session?.user;
    const searchParams = useSearchParams();

    // Local state representing the profile

    const [profile, setProfile] = useState(null);

    // Derive verification status directly during render (avoids setState in useEffect warning)

    const paymentStatus = searchParams.get("payment");
    const sessionId = searchParams.get("session_id");
    const isVerified = paymentStatus === "success";

    // Side-effects (Toasts & Payment Recording)

    useEffect(() => {
        if (paymentStatus === "success") {
            toast.success("Payment successful! You can now create your legal profile.", {
                id: "stripe-success-toast",
            });

            if (user?.id) {
                fetch(`${baseURL}/api/lawyers/verify-payment`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: user.id, sessionId }),
                })
                    .then(() => {
                        // Dispatch event to instantly update layout sidebar verification status
                        window.dispatchEvent(new Event("lawyer_verified_updated"));
                    })
                    .catch((err) => console.error("Error storing payment record:", err));
            } else {
                window.dispatchEvent(new Event("lawyer_verified_updated"));
            }
        } else if (paymentStatus === "cancelled") {
            toast.error("Payment was cancelled or unsuccessful. Please try again to verify.", {
                id: "stripe-cancel-toast",
            });
        }
    }, [paymentStatus, sessionId, user?.id]);

    // Save or update profile handler

    const handleSaveProfile = async (profileData) => {
        console.log("Submitting backend payload:", profileData);
        setProfile(profileData);
    };

    // Stripe verification payment handler

    const updateToVerified = async () => {
        try {
            const res = await fetch("/api/checkout_sessions", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({ type: "verification" })
            });
            const data = await res.json();

            if (data.url) {

                // Redirect user directly to Stripe Checkout Hosted Page

                window.location.href = data.url;
            } else {
                toast.error(data.error || "Failed to initiate checkout");
            }
        } catch (error) {
            console.error("Stripe error:", error);
            toast.error("Error connecting to payment server");
        }
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
                isVerified={isVerified}
                onSaveProfile={handleSaveProfile}
                onVerifyPayment={updateToVerified}
            />
        </div>
    );
}

export default function ManageLawyerLegalProfile() {
    return (
        <Suspense fallback={<div className="flex flex-col items-center justify-center h-[85vh] gap-3">
            <Loader2 size={56} className="animate-spin text-secondary" />
        </div>}>
            <LegalProfileContent />
        </Suspense>
    );
};