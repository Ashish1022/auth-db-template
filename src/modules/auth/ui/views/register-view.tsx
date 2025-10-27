"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const signupSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

const otpSchema = z.object({
    otp: z.string().min(6, "Please enter the complete OTP code"),
});

type SignupFormData = z.infer<typeof signupSchema>;
type OTPFormData = z.infer<typeof otpSchema>;

export default function RegisterPageView() {
    const [showOTP, setShowOTP] = useState(false);
    const [userData, setUserData] = useState<SignupFormData | null>(null);
    const [canResend, setCanResend] = useState(true);
    const [timer, setTimer] = useState(60);
    const router = useRouter();

    const trpc = useTRPC();

    const registerMutation = useMutation(
        trpc.auth.register.mutationOptions({
            onError: (error) => toast.error(error.message),
            onSuccess: (_, variables) => {
                setUserData(variables);
                setShowOTP(true);
                startResendTimer();
                toast.success("OTP sent to your email!");
            },
        })
    );

    const verifyMutation = useMutation(
        trpc.auth.verify.mutationOptions({
            onError: (error) => toast.error(error.message),
            onSuccess: () => {
                toast.success("Email verified successfully!");
                router.push("/create-trip");
            },
        })
    );

    const signupForm = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    const otpForm = useForm<OTPFormData>({
        resolver: zodResolver(otpSchema),
        defaultValues: {
            otp: "",
        },
    });

    const onSignupSubmit = (data: SignupFormData) => {
        registerMutation.mutate(data);
    };

    const onOTPSubmit = (data: OTPFormData) => {
        if (!userData) return;
        verifyMutation.mutate({
            name: userData.name,
            email: userData.email,
            password: userData.password,
            otp: data.otp,
        });
    };

    const handleResendOTP = () => {
        if (userData?.email) {
            registerMutation.mutate(userData);
            startResendTimer();
        }
    };

    const startResendTimer = () => {
        setCanResend(false);
        setTimer(60);
        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setCanResend(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    return (
       <div></div>
    );
}
