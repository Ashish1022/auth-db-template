import LoginPageView from "@/modules/auth/ui/views/login-view";
import { caller } from "@/trpc/server";

import { redirect } from "next/navigation";

export const dynamic = "force-dynamic"

const LoginPage = async () => {

    const session = await caller.auth.session();
    if (session.user) redirect('/');

    return <LoginPageView />
}

export default LoginPage