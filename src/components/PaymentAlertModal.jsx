// components/modals/PaymentAlertModal.jsx
"use client";

import React from "react";
import { Modal, Button } from "@heroui/react";
import { Lock, CreditCard } from "lucide-react";

export default function PaymentAlertModal({ isOpen, onClose }) {
    return (
        <Modal isOpen={isOpen} onOpenChange={onClose}>
            <Modal.Backdrop className="bg-black/60 backdrop-blur-md">
                <Modal.Container>
                    <Modal.Dialog className="relative w-full max-w-md rounded-3xl border border-rose-500/30 bg-surface dark:bg-neutral-900 p-6 shadow-2xl space-y-6">

                        {/* Built-in Close Trigger */}
                        <Modal.CloseTrigger className="absolute top-4 right-4 text-text-secondary hover:text-text p-1.5 rounded-full hover:bg-neutral-800 transition cursor-pointer" />

                        <Modal.Header className="flex flex-col items-center text-center space-y-3 pt-2">
                            <Modal.Icon className="p-4 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20">
                                <Lock size={36} />
                            </Modal.Icon>

                            <Modal.Heading className="text-xl font-black text-text">
                                Access Restricted
                            </Modal.Heading>
                        </Modal.Header>

                        <Modal.Body className="space-y-3 text-center">
                            <p className="text-sm font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-4 py-2 rounded-2xl w-full">
                                You have to Hire this Lawyer first
                            </p>
                            <p className="text-xs text-text-secondary leading-relaxed">
                                To leave a review or comment for this lawyer, you must first hire or complete a booking payment with them.
                            </p>
                        </Modal.Body>

                        <Modal.Footer className="flex gap-3 pt-2">
                            <Button
                                onClick={onClose}
                                className="flex-1 py-3 rounded-xl bg-secondary text-surface-dark font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-secondary-light transition shadow-md cursor-pointer"
                            >
                                <CreditCard size={14} /> Hire Lawyer
                            </Button>
                        </Modal.Footer>

                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}