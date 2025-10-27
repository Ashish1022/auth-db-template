"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export default function LoginPageView() {

    const router = useRouter();

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const trpc = useTRPC();
    const queryClient = useQueryClient();

    const loginMutation = useMutation(trpc.auth.login.mutationOptions({
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries(trpc.auth.session.queryFilter())
            router.push("/create-trip")
        },
    }))

    const onSubmit = (data: z.infer<typeof loginSchema>) => {
        loginMutation.mutate(data)
    }
    return (
        <div></div>
    );
}
