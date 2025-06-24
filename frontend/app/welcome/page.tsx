'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '../../components/AuthProvider';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function WelcomePage() {
    const { logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
                    <h2 className="text-2xl font-bold mb-6">Welcome!</h2>
                    <p className="text-green-500 mb-4">You have successfully logged in!</p>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </ProtectedRoute>
    );
}