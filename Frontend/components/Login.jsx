import React from 'react';
import { BrowserRouter, Router, Routes, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
// CloudIcon component for the logo
const CloudIcon = () => (
    <svg
        className="h-8 w-8 text-slate-400 mr-2"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-5.78-1.028.75.75 0 0 0-1.087-.225A4.502 4.502 0 0 0 2.25 15Z"
        />
    </svg>
);

// The main Login component
const LoginPage = () => {
    // Note: The body's background color and font would typically be set in a global CSS file (like index.css) 
    // or a layout component in a real React app. For this self-contained component,
    // we assume a dark background is applied to the parent container or body.
    // Example for a global stylesheet (e.g., src/index.css):
    // @tailwind base;
    // @tailwind components;
    // @tailwind utilities;
    // body { 
    //   @apply bg-slate-900 text-slate-100;
    //   font-family: 'Inter', sans-serif;
    // }

    return (
        // Main container
        <div className="flex items-center justify-center min-h-screen bg-slate-900 text-slate-100 px-4 font-['Inter',_sans-serif]">

            <div className="w-full max-w-md">

                {/* Header with Logo and Title */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-2">
                        <CloudIcon />
                        <h1 className="text-2xl font-bold text-slate-200">Private Cloud</h1>
                    </div>
                    <p className="text-slate-400">Welcome back! Please sign in to your account.</p>
                </div>

                {/* Login Form Card */}
                <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 sm:p-8">
                    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">

                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                className="w-full bg-slate-900/80 border border-slate-700 text-slate-200 rounded-lg px-4 py-3 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium text-slate-300">Password</label>
                                <a href="#" className="text-sm text-blue-400 hover:text-blue-300 hover:underline">Forgot password?</a>
                            </div>
                            <div className="mt-2">
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    className="w-full bg-slate-900/80 border border-slate-700 text-slate-200 rounded-lg px-4 py-3 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-4 py-3 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500">
                                Sign In
                            </button>
                        </div>
                    </form>
                    <p>
                        {/* Sign Up Link */}
                        Don't have an account?
                        <Link
                            to="/signup"
                            className="font-medium text-blue-400 hover:text-blue-300 hover:underline"
                        >
                            {" "}Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div >
    );
};

// Default export for easy integration
export default LoginPage;
