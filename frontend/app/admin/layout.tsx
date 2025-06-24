'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';
import Sidebar from '../../components/Sidebar';

interface User {
    role: string;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('access_token');
            if (!token) {
                console.log('No token found, redirecting to login'); // Debug
                router.push('/login');
                return;
            }

            try {
                const response = await api.get<User>('/me/');
                console.log('Admin layout user:', response.data); // Debug
                if (response.data.role !== 'admin') {
                    console.log('User is not admin, redirecting to dashboard'); // Debug
                    router.push('/dashboard');
                }
            } catch (err: any) {
                console.error('Admin auth error:', err.response?.data); // Debug
                setError('Authentication failed');
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, [router]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (error) {
        return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
    }

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 p-4">{children}</main>
        </div>
    );
}