'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';

interface User {
    role: string;
    fio: string;
}

export default function Dashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get<User>('/me/');
                setUser(response.data);
                if (response.data.role === 'admin') {
                    router.push('/admin/directions');
                }
            } catch (err) {
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [router]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold">Welcome, {user?.fio || 'User'}!</h1>
                <p className="mt-4">
                    {user?.role === 'teacher' ? 'Teacher Dashboard (WIP)' : 'Student Dashboard (WIP)'}
                </p>
                <button
                    onClick={() => {
                        localStorage.removeItem('access_token');
                        localStorage.removeItem('refresh_token');
                        router.push('/login');
                    }}
                    className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}