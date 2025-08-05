import React from 'react';

// Reusable CloudIcon component for the logo
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

// The main SignUpPage component
const SignUpPage = () => {
    // As with the login page, global styles for the body (background, font)
    // would typically be in a global CSS file.
    return (
        // Main container
        <div className="flex items-center justify-center min-h-screen bg-slate-900 text-slate-100 px-4 font-['Inter',_sans-serif]">
            
            <div className="w-full max-w-md">
                
                {/* Header with Logo and Title */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-2">
                        <CloudIcon />
                        <h1 className="text-2xl font-bold text-slate-200">Create Your Account</h1>
                    </div>
                    <p className="text-slate-400">Get started with your own private cloud.</p>
                </div>

                {/* Sign Up Form Card */}
                <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 sm:p-8">
                    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                        
                        {/* Full Name Input */}
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                            <input 
                                type="text" 
                                name="fullName" 
                                id="fullName"
                                className="w-full bg-slate-900/80 border border-slate-700 text-slate-200 rounded-lg px-4 py-3 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="John Doe" 
                                required 
                            />
                        </div>

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
                            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                            <input 
                                type="password" 
                                name="password" 
                                id="password"
                                className="w-full bg-slate-900/80 border border-slate-700 text-slate-200 rounded-lg px-4 py-3 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                required 
                            />
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button 
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-4 py-3 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500">
                                Create Account
                            </button>
                        </div>
                    </form>

                    {/* Sign In Link */}
                    <p className="mt-8 text-center text-sm text-slate-400">
                        Already have an account?
                        <a href="#" className="font-medium text-blue-400 hover:text-blue-300 hover:underline"> Sign in</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

// Default export for easy integration
export default SignUpPage;
