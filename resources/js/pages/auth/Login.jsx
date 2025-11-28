import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import route from '@/helpers/route';

export default function Login({ errors }) {
    const { data, setData, post, processing } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <div className="h-screen bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
            <Head title="Login | GAD Score Card Management System" />

            {/* Background Shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 right-20 w-32 h-32 bg-gradient-to-bl from-purple-400 to-purple-600 rounded-full opacity-20"></div>
                <div className="absolute top-16 right-32 w-32 h-32 bg-gradient-to-bl from-purple-500 to-purple-700 rounded-full opacity-20"></div>
                <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-tl from-purple-300 to-purple-500 rounded-full opacity-15 transform rotate-12"></div>
                <div className="absolute bottom-32 right-24 w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full opacity-60"></div>
                <div className="absolute bottom-20 right-16 w-8 h-8 bg-purple-500 rounded-full opacity-40"></div>
                <div className="absolute top-52 right-10 w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full opacity-20"></div>
                <div className="absolute bottom-40 right-16 w-20 h-20 bg-gradient-to-br from-purple-300 to-purple-500 rounded-full opacity-15"></div>
            </div>

            {/* Navbar */}
            <div className="relative z-20 p-6 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <img src="/img/logo.svg" className="w-20 h-20" alt="GAD Logo" />
                    <h1 className="text-base text-black max-w-sm leading-tight">
                        GAD Management Information System
                    </h1>
                </div>

                {/* Navigation Menu */}
                <nav className="hidden lg:block">
                    <ul className="flex items-center space-x-8">
                        <li className="relative group">
                            <span className="text-gray-700 hover:text-purple-600 font-medium transition duration-200 cursor-default">
                                About Us
                            </span>
                            <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                <p className="text-sm text-gray-600 leading-relaxed text-justify">
                                    The GAD Management Information System (MIS) helps organizations monitor and evaluate the gender-responsiveness of Programs, Activities, and Projects (PAPs) to ensure they are inclusive and equitable.
                                </p>
                            </div>
                        </li>

                        <li className="relative group">
                            <span className="text-gray-700 hover:text-purple-600 font-medium transition duration-200 cursor-default">
                                Features
                            </span>
                            <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                <p className="text-sm text-gray-600 leading-relaxed text-justify">
                                    Easily track, assess, and generate reports on the gender sensitivity of various programs and activities. The system provides automated evaluation, scoring, and visualization for decision-making.
                                </p>
                            </div>
                        </li>

                        <li className="relative group">
                            <span className="text-gray-700 hover:text-purple-600 font-medium transition duration-200 cursor-default">
                                Contact Us
                            </span>
                            <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                <p className="text-sm text-gray-600 leading-relaxed text-justify">
                                    Reach out to our support team for assistance, inquiries, or feedback about the GAD MIS and its functionalities.
                                </p>
                            </div>
                        </li>

                        <li className="relative group">
                            <span className="text-gray-700 hover:text-purple-600 font-medium transition duration-200 cursor-default">
                                Privacy Policy
                            </span>
                            <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                <p className="text-sm text-gray-600 leading-relaxed text-justify">
                                    We are committed to protecting your data. Learn how we collect, store, and handle information within the GAD Management Information System.
                                </p>
                            </div>
                        </li>

                        <li className="relative group">
                            <span className="text-gray-700 hover:text-purple-600 font-medium transition duration-200 cursor-default">
                                Help / FAQ
                            </span>
                            <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                <p className="text-sm text-gray-600 leading-relaxed text-justify">
                                    Find answers to frequently asked questions on using the system and understanding evaluation results.
                                </p>
                            </div>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Main Login Container */}
            <div className="relative z-10 flex items-center justify-center h-full px-4 -mt-24">
                <div className="w-full max-w-lg space-y-8">
                    <div className="text-center space-y-6">
                        <h2 className="text-3xl font-bold text-black mb-2">Login</h2>
                        <div className="w-16 h-0.5 bg-purple-600 mx-auto mb-4"></div>
                        <p className="text-gray-600 text-sm leading-relaxed px-2">
                            Monitor and evaluate the gender-responsiveness of your Programs, Activities, and Projects (PAPs) with ease
                        </p>
                    </div>

                    {(errors.email || errors.password) && (
                        <div className="bg-red-100 border border-red-300 rounded-lg p-3 mx-4">
                            <p className="text-red-700 text-sm text-center">
                                {errors.email || errors.password}
                            </p>
                        </div>
                    )}

                    <form className="space-y-5 px-4" onSubmit={submit}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 placeholder-gray-400 bg-white text-base"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 placeholder-gray-400 bg-white text-base"
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className={`w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-4 rounded-lg font-medium text-lg transition duration-200 transform hover:scale-[1.02] hover:shadow-lg ${processing ? 'opacity-50 cursor-not-allowed' : 'hover:from-purple-700 hover:to-purple-800'}`}
                        >
                            {processing ? 'Signing in...' : 'Log in'}
                        </button>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                />
                                <span className="ml-2 text-sm text-gray-600">Remember me</span>
                            </label>
                            <Link
                                href={route('password.request')}
                                className="text-sm text-purple-600 hover:text-purple-800 font-medium transition duration-200"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <div className="text-center pt-4 border-t border-gray-200">
                            <span className="text-gray-600">New here? </span>
                            <Link
                                href={route('register')}
                                className="text-purple-600 hover:text-purple-800 font-medium transition duration-200"
                            >
                                Create an account.
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}