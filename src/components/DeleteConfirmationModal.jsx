"use client";

import React from "react";
import { Modal, Button } from "@heroui/react";
import { AlertTriangle, Trash2, X } from "lucide-react";

export default function DeleteConfirmationModal({ isOpen, onClose, onConfirm, isDeleting }) {
    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onOpenChange={onClose}>
            <Modal.Backdrop className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <Modal.Container className="w-full max-w-md p-4">
                    <Modal.Dialog className="relative rounded-3xl border border-danger/30 bg-neutral-900 p-6 shadow-2xl text-white space-y-4">

                        {/* Close Trigger */}
                        <Modal.CloseTrigger
                            onClick={onClose}
                            className="absolute top-4 right-4 text-text-secondary hover:text-white transition p-1 rounded-full hover:bg-neutral-800 cursor-pointer"
                        >
                            <X size={18} />
                        </Modal.CloseTrigger>

                        {/* Header */}
                        <Modal.Header className="flex items-center gap-3">
                            <Modal.Icon className="p-3 rounded-2xl bg-danger/10 text-danger border border-danger/20">
                                <AlertTriangle size={24} />
                            </Modal.Icon>
                            <div>
                                <Modal.Heading className="text-xl font-bold text-white">
                                    Delete Legal Profile?
                                </Modal.Heading>
                                <p className="text-xs text-text-secondary">This action cannot be undone.</p>
                            </div>
                        </Modal.Header>

                        {/* Body */}
                        <Modal.Body className="text-sm text-text-secondary leading-relaxed">
                            Are you sure you want to permanently delete your attorney profile? All of your specialization details, pricing, and active listings will be removed.
                        </Modal.Body>

                        {/* Footer */}
                        <Modal.Footer className="flex items-center justify-end gap-3 pt-2">
                            <Button
                                onClick={onClose}
                                disabled={isDeleting}
                                className="px-4 py-2.5 rounded-xl border border-border/80 bg-neutral-800 text-xs font-bold text-white hover:bg-neutral-700 transition"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={onConfirm}
                                isLoading={isDeleting}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-danger text-xs font-bold text-white hover:bg-danger/90 transition shadow-lg shadow-danger/20"
                            >
                                {!isDeleting && <Trash2 size={15} />}
                                {isDeleting ? "Deleting..." : "Delete Profile"}
                            </Button>
                        </Modal.Footer>

                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}