import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Register({ errors }) {
    const { data, setData, post, processing } = useForm({
        lname: '',
        fname: '',
        mname: '',
        email: '',
        department: '',
        password: '',
        terms: false,
    });

    const [activeDropdown, setActiveDropdown] = useState(null);

    const toggleDropdown = (item) => {
        setActiveDropdown(activeDropdown === item ? null : item);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('register')); // Breeze register route
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
            <Head title="Sign Up | GAD Score Card Management System" />

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

            {/* Main Register Container */}
            <div className="relative z-10 flex items-center justify-center px-4 py-8">
                <div className="w-full max-w-2xl space-y-8">
                    <div className="text-center space-y-6">
                        <h2 className="text-3xl font-bold text-black mb-2">Sign Up</h2>
                        <div className="w-16 h-0.5 bg-purple-600 mx-auto mb-4"></div>
                        <p className="text-gray-600 text-sm leading-relaxed px-2">
                            Create your account to continue with GAD Management Information System
                        </p>
                    </div>

                    {/* Error Messages */}
                    {Object.keys(errors).length > 0 && (
                        <div className="bg-red-100 border border-red-300 rounded-lg p-3 mx-4">
                            <div className="text-red-700 text-sm">
                                {Object.values(errors).map((error, index) => (
                                    <p key={index}>{error}</p>
                                ))}
                            </div>
                        </div>
                    )}

                    <form className="space-y-5 px-4" onSubmit={submit}>
                        {/* Name fields */}
                        <div className="grid grid-cols-12 gap-4">
                            {/* Last Name */}
                            <div className="col-span-5">
                                <label htmlFor="lname" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                <input
                                    id="lname"
                                    type="text"
                                    value={data.lname}
                                    onChange={(e) => setData('lname', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 placeholder-gray-400 bg-white text-base"
                                    placeholder="Last name"
                                    required
                                />
                            </div>

                            {/* First Name */}
                            <div className="col-span-5">
                                <label htmlFor="fname" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                <input
                                    id="fname"
                                    type="text"
                                    value={data.fname}
                                    onChange={(e) => setData('fname', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 placeholder-gray-400 bg-white text-base"
                                    placeholder="First name"
                                    required
                                />
                            </div>

                            {/* M.I */}
                            <div className="col-span-2">
                                <label htmlFor="mname" className="block text-sm font-medium text-gray-700 mb-1">M.I</label>
                                <input
                                    id="mname"
                                    type="text"
                                    value={data.mname}
                                    onChange={(e) => setData('mname', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 placeholder-gray-400 bg-white text-base"
                                    placeholder="M.I"
                                />
                            </div>
                        </div>


                        <div className="flex gap-5">
                            {/* Department */}
                            <div className="w-full">
                                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                <select
                                    id="department"
                                    value={data.department}
                                    onChange={(e) => setData('department', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 bg-white text-base"
                                    required
                                >
                                    <option value="" disabled>Select Department</option>
                                    <option value="CAS">CAS - College of Arts and Sciences</option>
                                    <option value="CED">CED - College of Education</option>
                                    <option value="CoE">CoE - College of Engineering</option>
                                    <option value="CIC">CIC - College of Information and Computing</option>
                                    <option value="CBA">CBA - College of Business Administration</option>
                                    <option value="CAEc">CAEc - College of Applied Economics</option>
                                    <option value="CoT">CoT - College of Technology</option>
                                </select>
                            </div>
                        </div>


                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 placeholder-gray-400 bg-white text-base"
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 placeholder-gray-400 bg-white text-base"
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        {/* Terms */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={data.terms}
                                    onChange={(e) => setData('terms', e.target.checked)}
                                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                    required
                                />
                                <span className="ml-2 text-sm text-gray-600">I agree to the Terms</span>
                            </label>
                            <a href="#" className="text-sm text-purple-600 hover:text-purple-800 font-medium transition duration-200">
                                Terms & Conditions
                            </a>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={processing}
                            className={`w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-4 rounded-lg font-medium text-lg transition duration-200 transform hover:scale-[1.02] hover:shadow-lg ${processing ? 'opacity-50 cursor-not-allowed' : 'hover:from-purple-700 hover:to-purple-800'}`}
                        >
                            {processing ? 'Creating Account...' : 'Create Account'}
                        </button>

                        {/* Already have account */}
                        <div className="text-center pt-4 border-t border-gray-200">
                            <span className="text-gray-600">Already have an account? </span>
                            <Link
                                href="/login"
                                className="text-purple-600 hover:text-purple-800 font-medium transition duration-200"
                            >
                                Sign In
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}