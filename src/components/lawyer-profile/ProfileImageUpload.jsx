"use client";
import React from "react";
import Image from "next/image";
import { Scale, UploadCloud, Loader2 } from "lucide-react";

export default function ProfileImageUpload({ image, uploadingImage, onUpload }) {
    return (
        <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">
                Profile Picture (ImgBB)
            </label>
            <div className="flex items-center gap-4 mb-7">
                <div className="relative h-20 w-20 rounded-2xl overflow-hidden border border-border bg-surface shrink-0 flex items-center justify-center">
                    {image ? (
                        <Image
                            src={image}
                            alt="Preview"
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    ) : (
                        <Scale size={28} className="text-text-secondary/40" />
                    )}
                    {uploadingImage && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Loader2 size={20} className="animate-spin text-white" />
                        </div>
                    )}
                </div>
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-secondary/40 bg-secondary/10 text-secondary font-bold text-xs hover:bg-secondary/20 transition">
                    <UploadCloud size={16} />
                    Upload New Photo
                    <input
                        type="file"
                        accept="image/*"
                        onChange={onUpload}
                        className="hidden"
                    />
                </label>
            </div>
        </div>
    );
}