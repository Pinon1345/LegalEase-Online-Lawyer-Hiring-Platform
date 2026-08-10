"use client";

import React from 'react';
import { User, Mail, Phone, FileText, Camera, Save, Loader2 } from 'lucide-react';
import { uploadImage } from '@/lib/uploadImage';
import Image from 'next/image';

export default function ClientProfileForm({ formData, setFormData, onSave, isSaving, setStatusMessage }) {
    const [uploadingImage, setUploadingImage] = React.useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        setStatusMessage(null);

        try {
            const uploadedUrl = await uploadImage(file);
            setFormData((prev) => ({ ...prev, imageUrl: uploadedUrl }));
            setStatusMessage({ type: 'success', text: 'Profile picture uploaded to ImgBB successfully!' });
        } catch (error) {
            console.error('ImgBB Upload Error:', error);
            setStatusMessage({ type: 'error', text: error.message || 'Image upload failed. Please try again.' });
        } finally {
            setUploadingImage(false);
        }
    };

    return (
        <div className="bg-surface/80 dark:bg-neutral-900/80 border border-secondary/20 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="border-b border-neutral-200 dark:border-neutral-800 pb-4">
                <h2 className="text-xl font-bold text-text flex items-center gap-2">
                    <User className="text-secondary" size={22} /> Profile Information Form
                </h2>
                <p className="text-xs text-text-secondary mt-1">Fill out your details and click Save Profile to update.</p>
            </div>

            <form onSubmit={onSave} className="space-y-6">

                {/* ImgBB Upload Field */}
                <div className="space-y-3">
                    <label className="text-xs font-bold text-text uppercase tracking-wider block">
                        Profile Picture
                    </label>
                    <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-neutral-100/60 dark:bg-neutral-800/40 border border-secondary/15">
                        <div className="relative">
                            <Image
                                src={formData.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'}
                                alt="Profile Preview"
                                width={800}
                                height={800}
                                className="w-20 h-20 rounded-2xl object-cover border-2 border-secondary shadow-md"
                            />
                            {uploadingImage && (
                                <div className="absolute inset-0 bg-neutral-900/60 rounded-2xl flex items-center justify-center text-white">
                                    <Loader2 size={20} className="animate-spin text-secondary" />
                                </div>
                            )}
                        </div>

                        <div className="space-y-2 flex-1 text-center sm:text-left">
                            <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary text-surface-dark font-bold text-xs shadow-md hover:bg-secondary-light transition-all cursor-pointer">
                                <Camera size={16} />
                                <span>{uploadingImage ? 'Uploading to ImgBB...' : 'Choose & Upload Image'}</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={uploadingImage}
                                    className="hidden"
                                />
                            </label>
                            <p className="text-[11px] text-text-secondary">
                                JPG, PNG or WEBP up to 5MB. Hosted securely via ImgBB.
                            </p>
                        </div>
                    </div>
                </div>

                {/* First, Middle, Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-text uppercase tracking-wider">
                            First Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                            placeholder="e.g. Alex"
                            className="w-full px-4 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-text text-sm focus:outline-none focus:border-secondary transition-all"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-text uppercase tracking-wider">
                            Middle Name <span className="text-neutral-400 font-normal">(Optional)</span>
                        </label>
                        <input
                            type="text"
                            name="middleName"
                            value={formData.middleName}
                            onChange={handleInputChange}
                            placeholder="e.g. J."
                            className="w-full px-4 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-text text-sm focus:outline-none focus:border-secondary transition-all"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-text uppercase tracking-wider">
                            Last Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                            placeholder="e.g. Morgan"
                            className="w-full px-4 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-text text-sm focus:outline-none focus:border-secondary transition-all"
                        />
                    </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-text uppercase tracking-wider flex items-center gap-1.5">
                            <Mail size={14} className="text-secondary" /> Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            placeholder="client@example.com"
                            className="w-full px-4 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-text text-sm focus:outline-none focus:border-secondary transition-all"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-text uppercase tracking-wider flex items-center gap-1.5">
                            <Phone size={14} className="text-secondary" /> Phone Number
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+1 (555) 000-0000"
                            className="w-full px-4 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-text text-sm focus:outline-none focus:border-secondary transition-all"
                        />
                    </div>
                </div>

                {/* Bio Box */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-text uppercase tracking-wider flex items-center gap-1.5">
                        <FileText size={14} className="text-secondary" /> Bio & Legal Summary
                    </label>
                    <textarea
                        name="bio"
                        rows={4}
                        value={formData.bio}
                        onChange={handleInputChange}
                        placeholder="Describe your background or consultation needs..."
                        className="w-full px-4 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-text text-sm focus:outline-none focus:border-secondary transition-all resize-none"
                    />
                </div>

                {/* Save Profile Button */}
                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={isSaving || uploadingImage}
                        className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-secondary text-surface-dark font-black text-base shadow-xl hover:bg-secondary-light transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer disabled:opacity-50"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 size={18} className="animate-spin" /> Saving Profile...
                            </>
                        ) : (
                            <>
                                <Save size={18} /> Save Profile
                            </>
                        )}
                    </button>
                </div>

            </form>
        </div>
    );
}