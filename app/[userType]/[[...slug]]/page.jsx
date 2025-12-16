'use client';

import { useParams } from 'next/navigation';
import Dashboard from '@/pages/Dashboard';

export default function DashboardPage() {
    const params = useParams();
    const userType = params.userType;

    return <Dashboard userType={userType} />;
}
