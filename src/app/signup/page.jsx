"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Added missing router import
import {
    Form,
    Button,
    TextField,
    Label,
    Input,
    FieldError,
    Separator,
} from "@heroui/react";
import {
    FaUser,
    FaEnvelope,
    FaLock,
    FaImage,
    FaGoogle,
    FaEye,
    FaEyeSlash,
    FaScaleBalanced,
} from "react-icons/fa6";

import RoleSelectionModal from "@/components/RoleSelectionModal";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function SignupPage() {

    const router = useRouter(); // Initialized router instance

    // Form Data State

    const [formData, setFormData] = useState({
        name: "",
        imageUrl: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    // Toggle Visibility States

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Field Validation Errors State

    const [fieldErrors, setFieldErrors] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });

    // Modal & Role States

    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Input Handler

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));


        if (fieldErrors[name]) {
            setFieldErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    // Email Validation Helper

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };


    // Step 1: Form Validation before showing Modal


    const handleInitialSubmit = (e) => {
        e.preventDefault();

        const errors = {
            email: "",
            password: "",
            confirmPassword: "",
        };

        let isValid = true;

        if (!formData.email) {
            errors.email = "Email address is required.";
            isValid = false;
        } else if (!validateEmail(formData.email)) {
            errors.email = "Please enter a valid email address.";
            isValid = false;
        }

        if (!formData.password) {
            errors.password = "Password is required.";
            isValid = false;
        } else if (formData.password.length < 6) {
            errors.password = "Password must be at least 6 characters long.";
            isValid = false;
        }

        if (!formData.confirmPassword) {
            errors.confirmPassword = "Please confirm your password.";
            isValid = false;
        } else if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = "Passwords do not match.";
            isValid = false;
        }

        setFieldErrors(errors);

        if (isValid) {
            setIsRoleModalOpen(true);
        }
    };



    // Step 2: Final Submission with Better Auth


    const handleFinalSignup = async (roleToSubmit) => {
        const role = (typeof roleToSubmit === "string" ? roleToSubmit : selectedRole);
        if (!role) {
            toast.error("Please select a role to continue.");
            return;
        }

        setIsSubmitting(true);

        try {
            const { data, error } = await authClient.signUp.email({
                email: formData?.email,
                password: formData?.password,
                name: formData?.name,
                image: formData.imageUrl || undefined,
                role: role, // or role: selectedRole
            });

            if (error) {

                toast.error(error.message || "Ahh! Failed to Create Account!");
                setIsRoleModalOpen(false);
                return;
            }

            toast.success("Congratulations! Account created successfully!");
            setIsRoleModalOpen(false);
            router.push("/");
        } catch (err) {
            console.error("Auth Exception:", err);
            toast.error("An Unexpected Error Occurred!");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleSignup = async () => {
        try {
            await authClient.signIn.social({
                provider: "google",
                callbackURL: "/",
            });
        } catch (err) {
            console.error("Google Signin Exception:", err);
        }
    };

    return (
        <section className="relative min-h-screen overflow-hidden bg-background py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 flex items-center justify-center">

            {/* Ambient Background Glows */}

            <div className="absolute left-10 top-1/4 h-80 w-80 rounded-full bg-primary/10 blur-[150px] pointer-events-none" />
            <div className="absolute right-10 bottom-1/4 h-80 w-80 rounded-full bg-secondary/15 blur-[150px] pointer-events-none" />

            <div className="relative w-full max-w-2xl fade-up">

                {/* Outer Card */}

                <div className="glass relative overflow-hidden rounded-2xl border border-border bg-surface p-6 sm:p-10 shadow-2xl">

                    {/* Header */}

                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-4 py-1.5 text-xs font-bold text-secondary mb-5 gold-pulse">
                            <FaScaleBalanced size={14} />
                            <span>Join LegalEase Network</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black text-text tracking-tight">
                            Create Your <span className="shine-text">Account</span>
                        </h1>
                        <p className="mt-2 text-sm text-text-secondary">
                            Access top-tier legal consultation and representation seamless & secure.
                        </p>
                    </div>



                    {/* Form */}

                    <Form onSubmit={handleInitialSubmit} className="space-y-5 w-full">

                        {/* Full Name Field */}

                        <TextField className="w-full space-y-1">
                            <Label className="text-xs mb-2 font-bold text-text-secondary uppercase tracking-wider">
                                Full Name <span className="text-danger">*</span>
                            </Label>
                            <div className="relative flex items-center">
                                <FaUser className="absolute left-3.5 text-muted pointer-events-none z-10" size={16} />
                                <Input
                                    required
                                    placeholder="e.g. Eleanor Vance"
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full pl-10 rounded-md border border-border bg-background py-2 text-sm focus:border-secondary focus:outline-none"
                                />
                            </div>
                        </TextField>

                        {/* Profile Image URL Field */}

                        <TextField className="w-full space-y-1">
                            <Label className="text-xs mb-2 font-bold text-text-secondary uppercase tracking-wider">
                                Profile Image URL <span className="text-muted font-normal text-[10px]">(Optional)</span>
                            </Label>
                            <div className="relative flex items-center">
                                <FaImage className="absolute left-3.5 text-muted pointer-events-none z-10" size={16} />
                                <Input
                                    placeholder="https://example.com/avatar.jpg"
                                    type="url"
                                    name="imageUrl"
                                    value={formData.imageUrl}
                                    onChange={handleChange}
                                    className="w-full pl-10 rounded-md border border-border bg-background py-2 text-sm focus:border-secondary focus:outline-none"
                                />
                            </div>
                        </TextField>

                        {/* Email Address Field */}

                        <TextField isInvalid={Boolean(fieldErrors.email)} className="w-full space-y-1">
                            <Label className="text-xs mb-2 font-bold text-text-secondary uppercase tracking-wider">
                                Email Address <span className="text-danger">*</span>
                            </Label>
                            <div className="relative flex items-center">
                                <FaEnvelope className="absolute left-3.5 text-muted pointer-events-none z-10" size={16} />
                                <Input
                                    placeholder="name@company.com"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 rounded-md border border-border bg-background py-2 text-sm focus:border-secondary focus:outline-none"
                                />
                            </div>
                            <FieldError className="text-xs text-danger font-medium mt-1">
                                {fieldErrors.email}
                            </FieldError>
                        </TextField>

                        {/* Password Field */}

                        <TextField isInvalid={Boolean(fieldErrors.password)} className="w-full space-y-1">
                            <Label className="text-xs mb-2 font-bold text-text-secondary uppercase tracking-wider">
                                Password <span className="text-danger">*</span>
                            </Label>
                            <div className="relative flex items-center">
                                <FaLock className="absolute left-3.5 text-muted pointer-events-none z-10" size={16} />
                                <Input
                                    placeholder="••••••••"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-10 rounded-md border border-border bg-background py-2 text-sm focus:border-secondary focus:outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    className="absolute right-3 focus:outline-none text-muted hover:text-text transition z-10"
                                >
                                    {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                                </button>
                            </div>
                            <FieldError className="text-xs text-danger font-medium mt-1">
                                {fieldErrors.password}
                            </FieldError>
                        </TextField>

                        {/* Confirm Password Field */}

                        <TextField isInvalid={Boolean(fieldErrors.confirmPassword)} className="w-full space-y-1">
                            <Label className="text-xs mb-2 font-bold text-text-secondary uppercase tracking-wider">
                                Confirm Password <span className="text-danger">*</span>
                            </Label>
                            <div className="relative flex items-center">
                                <FaLock className="absolute left-3.5 text-muted pointer-events-none z-10" size={16} />
                                <Input
                                    placeholder="••••••••"
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-10 rounded-md border border-border bg-background py-2 text-sm focus:border-secondary focus:outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                    className="absolute right-3 focus:outline-none text-muted hover:text-text transition z-10"
                                >
                                    {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                                </button>
                            </div>
                            <FieldError className="text-xs text-danger font-medium mt-1">
                                {fieldErrors.confirmPassword}
                            </FieldError>
                        </TextField>



                        {/* Submit Button */}

                        <div className="pt-3 w-full">
                            <Button
                                type="submit"
                                className="text-lg btn-premium w-full rounded-md bg-secondary py-6 font-extrabold text-surface-dark shadow-lg transition hover:bg-accent flex items-center justify-center gap-2"
                            >
                                CHOOSE YOUR ROLE
                            </Button>
                        </div>
                    </Form>

                    {/* Separator Section */}

                    <div className="my-6 flex items-center gap-4">
                        <Separator className="flex-1" />
                        <span className="text-xs font-bold uppercase text-muted">OR</span>
                        <Separator className="flex-1" />
                    </div>

                    {/* Google Signup Button */}

                    <Button
                        type="button"
                        onClick={handleGoogleSignup}
                        variant="bordered"
                        className="w-full rounded-md border border-border bg-background py-6 font-bold text-text transition hover:border-secondary hover:bg-surface flex items-center justify-center gap-3 shadow-sm"
                    >
                        <FaGoogle className="text-red-500" size={18} />
                        <span>Sign up with Google</span>
                    </Button>

                    {/* Signin Link */}

                    <p className="mt-6 text-center text-xs sm:text-sm text-text-secondary">
                        Already have an account?{" "}
                        <Link href="/signin" className="font-bold text-secondary hover:underline">
                            Sign In
                        </Link>
                    </p>

                </div>
            </div>

            {/* Role Selection Modal Component */}

            <RoleSelectionModal
                isOpen={isRoleModalOpen}
                onClose={() => setIsRoleModalOpen(false)}
                selectedRole={selectedRole}
                setSelectedRole={setSelectedRole}
                isSubmitting={isSubmitting}
                onFinalSubmit={handleFinalSignup}
            />
        </section>
    );
}