'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';

interface LoginResponse {
    access: string;
    refresh: string;
}

interface User {
    role: string;
}

interface ErrorResponse {
    detail?: string;
}

export default function Login() {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const router = useRouter();

    const handleLogin = async (e: FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setError('');

        try {
            // Get tokens
            const response = await api.post<LoginResponse>('/token/', {
                username,
                password,
            });
            console.log('Login response:', response.data); // Debug
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);

            // Get user role
            const userResponse = await api.get<User>('/me/');
            console.log('User details:', userResponse.data); // Debug
            const role = userResponse.data.role;

            // Redirect based on role
            if (role === 'admin') {
                console.log('Redirecting to /admin/directions'); // Debug
                router.push('/admin/directions');
            } else {
                console.log('Redirecting to /dashboard'); // Debug
                router.push('/dashboard');
            }
        } catch (err: any) {
            console.error('Login error:', err.response?.data); // Debug
            setError(err.response?.data?.detail || 'Invalid credentials. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <div className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your username"
                            aria-required="true"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                            aria-required="true"
                        />
                    </div>
                    <button
                        onClick={handleLogin}
                        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
                        aria-label="Login"
                    >
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
}