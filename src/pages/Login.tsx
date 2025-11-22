import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock authentication - just redirect to dashboard
        navigate('/dashboard');
    };

    return (
        <div className="flex h-screen">
            {/* Left Side - Indian Warehouse Image */}
            <div className="hidden lg:flex lg:w-1/2 relative">
                <img
                    src="file:///C:/Users/Anjali/.gemini/antigravity/brain/366367a2-e377-4fbf-89a8-e698dbe37403/indian_warehouse_placeholder_1763804936491.png"
                    alt="Indian Warehouse"
                    className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-black opacity-30"></div>
                <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
                    <h1 className="text-5xl font-bold mb-4">StockMaster</h1>
                    <p className="text-xl text-blue-100 mb-8">Modern Inventory Management System</p>
                    <div className="space-y-4 text-blue-50">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span>Real-time Stock Tracking</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span>AI-Powered Demand Prediction</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span>Intelligent Warehouse Management</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-xl mb-4">
                            <LogIn size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                        <p className="text-gray-600">Sign in to access your dashboard</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="admin@stockmaster.com"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                defaultValue="admin@stockmaster.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                defaultValue="password"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                <span className="ml-2 text-sm text-gray-600">Remember me</span>
                            </label>
                            <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
                                Forgot password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                        >
                            Sign In
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                                Contact Administrator
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
