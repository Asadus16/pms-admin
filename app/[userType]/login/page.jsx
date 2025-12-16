'use client';

import { useParams } from 'next/navigation';
import Login from '@/pages/Login';

export default function LoginPage() {
    const params = useParams();
    const userType = params.userType;

    return <Login userType={userType} />;
}
