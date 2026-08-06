"use client";
import React from "react";
import { motion } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import ProfileImageUpload from "./ProfileImageUpload";

export default function ProfileFormView({
    myProfile,
    formData,
    setFormData,
    specializationOptions,
    uploadingImage,
    isSubmitting,
    onImageUpload,
    onSubmit,
    onCancel,
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="rounded-3xl border border-border/80 bg-surface dark:bg-neutral-900/90 p-6 md:p-10 shadow-2xl backdrop-blur-xl"
        >
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-border">
                <div>
                    <h3 className="text-xl font-extrabold text-text">
                        {myProfile ? "Update Legal Profile" : "Create Legal Profile"}
                    </h3>
                    <p className="text-xs text-text-secondary">
                        Fill out your details below to appear on the public directory.
                    </p>
                </div>
                {myProfile && (
                    <button
                        onClick={onCancel}
                        className="p-2 rounded-xl text-text-secondary hover:bg-surface/80 cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                )}
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
                {/* Image Upload Component */}
                <ProfileImageUpload
                    image={formData?.lawyerImage}
                    uploadingImage={uploadingImage}
                    onUpload={onImageUpload}
                />

                {/* Form Fields Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-md font-bold text-text mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.lawyerName}
                            onChange={(e) =>
                                setFormData({ ...formData, lawyerName: e.target.value })
                            }
                            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text text-sm focus:border-secondary focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-md font-bold text-text mb-2">
                            Specialization
                        </label>
                        <select
                            value={formData.specialization}
                            onChange={(e) =>
                                setFormData({ ...formData, specialization: e.target.value })
                            }
                            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text text-sm focus:border-secondary focus:outline-none"
                        >
                            {specializationOptions.map((spec) => (
                                <option key={spec} value={spec}>
                                    {spec}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-md font-bold text-text mb-2">
                            Hourly Rate ($USD)
                        </label>
                        <input
                            type="number"
                            required
                            min="1"
                            value={formData.hourlyRate}
                            onChange={(e) =>
                                setFormData({ ...formData, hourlyRate: e.target.value })
                            }
                            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text text-sm focus:border-secondary focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-md font-bold text-text mb-2">
                            Years of Experience
                        </label>
                        <input
                            type="number"
                            required
                            min="0"
                            value={formData.yearsExperience}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    yearsExperience: e.target.value,
                                })
                            }
                            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text text-sm focus:border-secondary focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-md font-bold text-text mb-2">
                            Location
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Washington D.C, USA"
                            value={formData.location}
                            onChange={(e) =>
                                setFormData({ ...formData, location: e.target.value })
                            }
                            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text text-sm focus:border-secondary focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-md font-bold text-text mb-2">
                            Availability Status
                        </label>
                        <select
                            value={formData.availabilityStatus}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    availabilityStatus: e.target.value,
                                })
                            }
                            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text text-sm focus:border-secondary focus:outline-none"
                        >
                            <option value="available">Available</option>
                            <option value="busy">Busy</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-md font-bold text-text mb-2">
                        Languages (comma separated)
                    </label>
                    <input
                        type="text"
                        placeholder="English, Spanish, French"
                        value={formData.languages}
                        onChange={(e) =>
                            setFormData({ ...formData, languages: e.target.value })
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text text-sm focus:border-secondary focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-md font-bold text-text mb-2">
                        Bio / Overview
                    </label>
                    <textarea
                        rows={4}
                        placeholder="Brief summary of your legal background and expertise..."
                        value={formData.bio}
                        onChange={(e) =>
                            setFormData({ ...formData, bio: e.target.value })
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text text-sm focus:border-secondary focus:outline-none mb-3"
                    />
                </div>

                {/* Submit & Cancel Buttons */}
                <div className="flex justify-end gap-3 pt-8 border-t border-border">
                    {myProfile && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-5 py-2.5 rounded-xl border border-border text-text-secondary cursor-pointer text-sm font-bold hover:bg-surface/80 transition"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={isSubmitting || uploadingImage}
                        className="inline-flex items-center gap-2 cursor-pointer px-6 py-2.5 rounded-xl bg-secondary text-surface-dark font-extrabold text-sm shadow-md hover:bg-secondary-light transition disabled:opacity-50"
                    >
                        {isSubmitting && (
                            <Loader2 size={16} className="animate-spin" />
                        )}
                        {myProfile ? "Save Changes" : "Publish Profile"}
                    </button>
                </div>
            </form>
        </motion.div>
    );
}