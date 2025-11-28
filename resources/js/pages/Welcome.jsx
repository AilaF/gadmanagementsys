import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Welcome" />
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Hello, Laravel + React!</h1>
                    {auth.user ? (
                        <Link href={route('dashboard')} className="text-blue-600 underline">
                            Go to Dashboard
                        </Link>
                    ) : (
                        <Link href={route('login')} className="text-blue-600 underline">
                            Log In
                        </Link>
                    )}
                </div>
            </div>
        </>
    );
}
