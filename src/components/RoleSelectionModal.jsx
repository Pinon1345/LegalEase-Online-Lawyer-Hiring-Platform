"use client";

import React from "react";
import { Modal, Button } from "@heroui/react";
import { FaGavel, FaUserTie, FaCheck } from "react-icons/fa6";

export default function RoleSelectionModal({
    isOpen,
    onClose,
    selectedRole,
    setSelectedRole,
    isSubmitting,
    onFinalSubmit,
}) {
    return (
        <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
            <Modal.Backdrop>
                <Modal.Container>
                    <Modal.Dialog className="max-w-md rounded-3xl border border-border bg-surface shadow-2xl glass p-6">
                        <Modal.CloseTrigger onClick={onClose} />

                        <Modal.Header className="flex flex-col text-center pb-2">
                            <Modal.Heading className="text-2xl font-black text-text">
                                Choose Your <span className="shine-text">Role</span>
                            </Modal.Heading>
                            <p className="mt-1 text-xs text-text-secondary font-normal">
                                Select how you want to interact with the LegalEase platform.
                            </p>
                        </Modal.Header>

                        <Modal.Body className="py-4 space-y-4">
                            {/* Role Option 1: Client */}
                            <div
                                onClick={() => setSelectedRole("Client")}
                                className={`card-hover group cursor-pointer relative rounded-2xl border p-4 flex items-center gap-4 transition-all ${selectedRole === "Client"
                                        ? "border-secondary bg-secondary/15 ring-2 ring-secondary"
                                        : "border-border bg-background hover:border-secondary/50"
                                    }`}
                            >
                                <div className="p-3.5 rounded-xl bg-surface border border-border text-secondary group-hover:bg-secondary group-hover:text-surface-dark transition-all">
                                    <FaUserTie size={24} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-text text-base">Client</h4>
                                    <p className="text-xs text-text-secondary">
                                        I need legal advice, counsel, or court representation.
                                    </p>
                                </div>
                                {selectedRole === "Client" && (
                                    <div className="p-1.5 rounded-full bg-secondary text-surface-dark">
                                        <FaCheck size={12} />
                                    </div>
                                )}
                            </div>

                            {/* Role Option 2: Lawyer */}
                            <div
                                onClick={() => setSelectedRole("Lawyer")}
                                className={`card-hover group cursor-pointer relative rounded-2xl border p-4 flex items-center gap-4 transition-all ${selectedRole === "Lawyer"
                                        ? "border-secondary bg-secondary/15 ring-2 ring-secondary"
                                        : "border-border bg-background hover:border-secondary/50"
                                    }`}
                            >
                                <div className="p-3.5 rounded-xl bg-surface border border-border text-secondary group-hover:bg-secondary group-hover:text-surface-dark transition-all">
                                    <FaGavel size={24} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-text text-base">Lawyer / Counsel</h4>
                                    <p className="text-xs text-text-secondary">
                                        I am a certified legal practitioner looking to offer services.
                                    </p>
                                </div>
                                {selectedRole === "Lawyer" && (
                                    <div className="p-1.5 rounded-full bg-secondary text-surface-dark">
                                        <FaCheck size={12} />
                                    </div>
                                )}
                            </div>
                        </Modal.Body>

                        <Modal.Footer className="pt-2 flex gap-3">
                            <Button
                                type="button"
                                variant="bordered"
                                onClick={onClose}
                                className="flex-1 rounded-xl border border-border font-bold text-text-secondary hover:bg-background"
                            >
                                Cancel
                            </Button>

                            <Button
                                type="button"
                                onClick={onFinalSubmit}
                                isLoading={isSubmitting}
                                isDisabled={!selectedRole || isSubmitting}
                                className={`flex-1 rounded-xl font-extrabold text-surface-dark transition ${selectedRole
                                        ? "btn-premium bg-secondary hover:bg-accent"
                                        : "bg-muted/40 cursor-not-allowed opacity-60"
                                    }`}
                            >
                                Complete Signup
                            </Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}