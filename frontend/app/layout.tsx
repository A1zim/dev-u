import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'University Grading Platform',
    description: 'Manage directions, subjects, and grades',
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body>{children}</body>
        </html>
    );
}