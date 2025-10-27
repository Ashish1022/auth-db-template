import { redirect } from 'next/navigation';

import { caller } from '@/trpc/server';
import RegisterPageView from '@/modules/auth/ui/views/register-view';

export const dynamic = "force-dynamic"

const page = async () => {

    const session = await caller.auth.session();
    if (session.user) redirect('/');

    return <RegisterPageView />
}

export default page