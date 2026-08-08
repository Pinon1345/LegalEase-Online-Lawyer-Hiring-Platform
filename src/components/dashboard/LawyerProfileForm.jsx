"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

import { addLawyer, updateLawyer, deleteLawyer } from "@/lib/api/lawyers/action";
import { lawyerProfile } from "@/lib/api/lawyers/data";
import { LawyerCardSkeleton } from "../ui/Skeleton";

import ProfileCardView from "../lawyer-profile/ProfileCardView";
import ProfileFormView from "../lawyer-profile/ProfileFormView";
import UnverifiedState from "../lawyer-profile/UnverifiedState";

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

const SPECIALIZATION_OPTIONS = [
    "Criminal Law",
    "Corporate Law",
    "Family Law",
    "Intellectual Property",
    "Real Estate Law",
    "Civil Litigation",
    "Tax Law",
    "Immigration Law",
];

export default function LawyerProfileForm({
    profile: initialProfile,
    user,
    isVerified: externalVerified = false,
    onSaveProfile,
    onVerifyPayment,
    onDeleteProfile,
}) {
    const router = useRouter();

    // Loading & state control
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Profile State
    const [myProfile, setMyProfile] = useState(
        initialProfile && initialProfile._id ? initialProfile : null
    );

    // Verification State
    const [isVerified, setIsVerified] = useState(
        initialProfile && (initialProfile._id || initialProfile.lawyerName) ? true : false
    );

    // Derived Verification Status (Avoids setState in useEffect warning)
    const effectiveIsVerified = isVerified || externalVerified;

    // Form state
    const [formData, setFormData] = useState({
        lawyerName: user?.name || "",
        lawyerImage: user?.image || "",
        specialization: SPECIALIZATION_OPTIONS[0],
        hourlyRate: 150,
        averageRating: 5.0,
        totalReviews: 0,
        yearsExperience: 1,
        languages: "English",
        location: "",
        availabilityStatus: "available",
        bio: "",
    });

    // Populate form handler
    const populateForm = useCallback((data) => {
        setFormData({
            lawyerName: data.lawyerName || user?.name || "",
            lawyerImage: data.lawyerImage || user?.image || "",
            specialization: data.specialization || SPECIALIZATION_OPTIONS[0],
            hourlyRate: data.hourlyRate || 150,
            averageRating: data.averageRating || 5.0,
            totalReviews: data.totalReviews || 0,
            yearsExperience: data.yearsExperience || 1,
            languages: Array.isArray(data.languages)
                ? data.languages.join(", ")
                : data.languages || "English",
            location: data.location || "",
            availabilityStatus: data.availabilityStatus || "available",
            bio: data.bio || "",
        });
    }, [user?.name, user?.image]);

    // Fetch lawyer profile on page mount/refresh
    useEffect(() => {
        const fetchProfileData = async () => {
            if (!user?.id) {
                setIsLoading(false);
                return;
            }

            try {
                const response = await lawyerProfile(user.id);

                // Handle both response formats
                const fetchedProfile = response?.profile !== undefined ? response.profile : response;
                const verificationStatus = response?.isVerified || fetchedProfile?.isVerified;

                // Check if the profile exists AND has a valid _id or lawyerName
                const hasValidProfile =
                    fetchedProfile &&
                    !fetchedProfile.error &&
                    (fetchedProfile._id || fetchedProfile.lawyerName);

                if (hasValidProfile) {
                    setMyProfile(fetchedProfile);
                    populateForm(fetchedProfile);
                    setIsVerified(true);
                    setIsEditing(false); // Show Card View
                } else {
                    // If no profile found
                    setMyProfile(null);
                    setIsVerified(Boolean(verificationStatus));
                    setIsEditing(true); // Show Form View for Creation
                }
            } catch (error) {
                console.error("Failed to fetch lawyer profile:", error);
                setMyProfile(null);
                setIsVerified(false);
                setIsEditing(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileData();
    }, [user?.id, populateForm]);

    // ImgBB Upload Handler
    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadingImage(true);
        const body = new FormData();
        body.append("image", file);

        try {
            const res = await fetch(
                `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
                {
                    method: "POST",
                    body,
                }
            );
            const data = await res.json();
            if (data.success) {
                setFormData((prev) => ({ ...prev, lawyerImage: data.data.url }));
                toast.success("Image uploaded successfully!");
            } else {
                toast.error("Image upload failed. Please try again.");
            }
        } catch (err) {
            console.error("ImgBB upload error:", err);
            toast.error("Error uploading image.");
        } finally {
            setUploadingImage(false);
        }
    };

    // Delete Logic
    const confirmDelete = async () => {
        if (!myProfile?._id) return;

        setIsDeleting(true);
        try {
            await onDeleteProfile?.(myProfile._id);
            if (typeof deleteLawyer === "function") {
                await deleteLawyer(myProfile._id);
            }
            setMyProfile(null);
            setIsVerified(true);
            setIsEditing(true);
            setIsDeleteModalOpen(false);
            toast.success("Lawyer Profile Deleted!");
        } catch (error) {
            console.error("Failed to delete legal profile:", error);
            toast.error("Failed to delete profile");
        } finally {
            setIsDeleting(false);
        }
    };

    // Submit Logic
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const addData = {
            userId: user?.id,
            lawyerImage: formData?.lawyerImage,
            lawyerName: formData?.lawyerName,
            specialization: formData?.specialization,
            hourlyRate: Number(formData?.hourlyRate),
            averageRating: Number(formData?.averageRating),
            totalReviews: Number(formData?.totalReviews),
            yearsExperience: Number(formData?.yearsExperience),
            languages: formData?.languages
                .split(",")
                .map((l) => l.trim())
                .filter(Boolean),
            location: formData?.location,
            isVerified: true,
            availabilityStatus: formData.availabilityStatus,
            bio: formData?.bio,
            createdAt: myProfile?.createdAt || new Date(),
        };

        try {
            await onSaveProfile?.(addData);
            if (!myProfile) {
                const resData = await addLawyer(addData);
                if (resData?.insertedId || resData?._id) {
                    const createdProfile = {
                        ...addData,
                        _id: resData.insertedId || resData._id,
                    };
                    setMyProfile(createdProfile);
                    populateForm(createdProfile);
                    toast.success("Lawyer Profile Created!");
                    router.push("/lawyers");
                }
            } else {
                await updateLawyer(addData, myProfile._id);
                const updatedProfile = { ...myProfile, ...addData };
                setMyProfile(updatedProfile);
                populateForm(updatedProfile);
                toast.success("Congratulations! Lawyer Profile Updated!");
            }

            setIsEditing(false);
        } catch (error) {
            console.error("Failed to save legal profile", error);
            toast.error("Ahh! Failed to save profile!");
        } finally {
            setIsSubmitting(false);
        }
    };

    // 1. Loading State
    if (isLoading) {
        return (
            <div className="mt-16 mx-6 mb-8">
                <LawyerCardSkeleton />
            </div>
        );
    }

    // 2. Unverified State (Uses derived effectiveIsVerified status)
    if (!effectiveIsVerified) {
        return <UnverifiedState onVerifyPayment={onVerifyPayment} />;
    }

    return (
        <div className="max-w-4xl mx-auto my-6 space-y-8">
            {/* 3. Card View */}
            {myProfile && !isEditing && (
                <ProfileCardView
                    myProfile={myProfile}
                    onEdit={() => {
                        populateForm(myProfile);
                        setIsEditing(true);
                    }}
                    onOpenDeleteModal={() => setIsDeleteModalOpen(true)}
                    isDeleteModalOpen={isDeleteModalOpen}
                    onCloseDeleteModal={() => setIsDeleteModalOpen(false)}
                    onConfirmDelete={confirmDelete}
                    isDeleting={isDeleting}
                />
            )}

            {/* 4. Form View */}
            <AnimatePresence>
                {(isEditing || !myProfile) && (
                    <ProfileFormView
                        myProfile={myProfile}
                        formData={formData}
                        setFormData={setFormData}
                        specializationOptions={SPECIALIZATION_OPTIONS}
                        uploadingImage={uploadingImage}
                        isSubmitting={isSubmitting}
                        onImageUpload={handleImageUpload}
                        onSubmit={handleSubmit}
                        onCancel={() => setIsEditing(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};