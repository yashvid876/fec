import { useEffect, useState } from 'react';
import { TrendingUp, AlertTriangle, Package, Truck } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import api from '../lib/api';

interface DashboardData {
    total_items: number;
    inventory_value: number;
    low_stock_alert: number;
}

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await api.get('/dashboard');
            setDashboardData(response.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            // Set mock data for demo purposes if API fails
            setDashboardData({
                total_items: 1234,
                inventory_value: 456789,
                low_stock_alert: 8
            });
        } finally {
            setLoading(false);
        }
    };

    // Mock data for sparklines
    const sparklineData = [
        { value: 20 },
        { value: 25 },
        { value: 30 },
        { value: 45 },
        { value: 50 },
        { value: 60 },
        { value: 75 },
    ];

    const aiPredictions = [
        { name: 'Laptop Stand Pro', stock: 12, trend: 'up' },
        { name: 'USB-C Cable 2m', stock: 8, trend: 'up' },
        { name: 'Wireless Mouse MX3', stock: 15, trend: 'up' },
        { name: 'Keyboard Mechanical', stock: 5, trend: 'up' },
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">Overview of your inventory and operations</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Stock */}
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Stock Value</p>
                            <p className="text-2xl font-bold text-gray-900 mt-2">
                                ${loading ? '...' : dashboardData?.inventory_value.toLocaleString()}
                            </p>
                            <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                                <TrendingUp size={14} />
                                +12.5% from last month
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Package className="text-blue-600" size={24} />
                        </div>
                    </div>
                </div>

                {/* Low Stock Alert */}
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Low Stock Alerts</p>
                            <p className="text-2xl font-bold text-red-600 mt-2">
                                {loading ? '...' : dashboardData?.low_stock_alert}
                            </p>
                            <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                                <AlertTriangle size={14} />
                                Requires attention
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                            <AlertTriangle className="text-red-600" size={24} />
                        </div>
                    </div>
                </div>

                {/* Incoming */}
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Incoming Orders</p>
                            <p className="text-2xl font-bold text-gray-900 mt-2">3 Pending</p>
                            <p className="text-xs text-blue-600 mt-2">Expected this week</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <Truck className="text-green-600 transform rotate-180" size={24} />
                        </div>
                    </div>
                </div>

                {/* Outgoing */}
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Outgoing Orders</p>
                            <p className="text-2xl font-bold text-gray-900 mt-2">8 To Ship</p>
                            <p className="text-xs text-orange-600 mt-2">Ready for dispatch</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Truck className="text-orange-600" size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content - Split View */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 65% - Supply Chain Map */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow-md border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Supply Chain Map</h2>
                        <button className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-100">
                            Filter
                        </button>
                    </div>

                    {/* Map Placeholder */}
                    <div className="relative h-96 bg-gradient-to-br from-blue-50 to-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                        <div className="absolute inset-0 flex items-center justify-center">
                            {/* Warehouse dots */}
                            <div className="absolute top-20 left-20 w-4 h-4 bg-green-500 rounded-full shadow-lg animate-pulse"></div>
                            <div className="absolute top-32 right-32 w-4 h-4 bg-green-500 rounded-full shadow-lg"></div>
                            <div className="absolute bottom-24 left-40 w-4 h-4 bg-red-500 rounded-full shadow-lg animate-pulse"></div>
                            <div className="absolute bottom-20 right-20 w-4 h-4 bg-green-500 rounded-full shadow-lg"></div>
                            <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-yellow-500 rounded-full shadow-lg"></div>

                            {/* Connection lines */}
                            <svg className="absolute inset-0 w-full h-full">
                                <line x1="20%" y1="20%" x2="50%" y2="50%" stroke="#e5e7eb" strokeWidth="2" strokeDasharray="5,5" />
                                <line x1="50%" y1="50%" x2="80%" y2="80%" stroke="#e5e7eb" strokeWidth="2" strokeDasharray="5,5" />
                            </svg>
                        </div>

                        <div className="relative z-10 text-center">
                            <p className="text-gray-500 font-medium">Interactive Supply Chain Visualization</p>
                            <p className="text-sm text-gray-400 mt-1">5 Active Warehouses</p>
                        </div>
                    </div>

                    <div className="mt-4 flex gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-gray-600">Operational</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span className="text-gray-600">Low Stock</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <span className="text-gray-600">Warning</span>
                        </div>
                    </div>
                </div>

                {/* Right 35% - AI Intelligence Widget */}
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                    <div className="mb-4">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <TrendingUp className="text-purple-600" size={20} />
                            AI Intelligence
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">Items predicted to stock out</p>
                    </div>

                    <div className="space-y-4">
                        {aiPredictions.map((item, index) => (
                            <div key={index} className="p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900 text-sm">{item.name}</h3>
                                        <p className="text-xs text-gray-600 mt-0.5">Current Stock: {item.stock} units</p>
                                    </div>
                                    <TrendingUp className="text-red-500" size={16} />
                                </div>

                                {/* Sparkline Chart */}
                                <div className="h-12 -mx-1">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={sparklineData}>
                                            <Line
                                                type="monotone"
                                                dataKey="value"
                                                stroke="#ef4444"
                                                strokeWidth={2}
                                                dot={false}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="mt-2 flex items-center justify-between text-xs">
                                    <span className="text-red-600 font-medium">High Demand Trend</span>
                                    <span className="text-gray-500">7-day forecast</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="mt-4 w-full bg-purple-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                        View Full Analysis
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
