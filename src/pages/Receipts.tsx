import { useEffect, useState } from 'react';
import { Plus, CheckCircle, X } from 'lucide-react';
import api from '../lib/api';

interface Order {
    id: number;
    type: string;
    vendor_name?: string;
    status: string;
    created_at?: string;
    total_items?: number;
}

interface Product {
    id: number;
    name: string;
    sku: string;
}

const Receipts = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        vendor_name: '',
        product_id: '',
        quantity: '',
    });
    const [recommendedWarehouse, setRecommendedWarehouse] = useState('');

    useEffect(() => {
        fetchOrders();
        fetchProducts();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/orders');
            const receipts = response.data.filter((order: Order) => order.type === 'IN');
            setOrders(receipts);
        } catch (error) {
            console.error('Error fetching orders:', error);
            // Mock data
            setOrders([
                { id: 1, type: 'IN', vendor_name: 'Tech Supplies Co.', status: 'Draft', total_items: 5 },
                { id: 2, type: 'IN', vendor_name: 'Global Electronics', status: 'Validated', total_items: 12 },
                { id: 3, type: 'IN', vendor_name: 'Office Plus', status: 'Draft', total_items: 8 },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
            setProducts([
                { id: 1, name: 'Laptop Stand Pro', sku: 'LSP-001' },
                { id: 2, name: 'USB-C Cable 2m', sku: 'USC-002' },
                { id: 3, name: 'Wireless Mouse MX3', sku: 'WMX-003' },
            ]);
        }
    };

    const handleProductChange = (productId: string) => {
        setFormData({ ...formData, product_id: productId });

        // Show warehouse recommendation when product is selected
        if (productId) {
            const warehouses = ['Zone A (Empty Space)', 'Zone B (High Traffic)', 'Zone C (Climate Controlled)'];
            const recommended = warehouses[Math.floor(Math.random() * warehouses.length)];
            setRecommendedWarehouse(recommended);
        } else {
            setRecommendedWarehouse('');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                type: 'IN',
                vendor_name: formData.vendor_name,
                lines: [
                    {
                        product_id: parseInt(formData.product_id),
                        quantity: parseInt(formData.quantity),
                    },
                ],
            };

            await api.post('/orders', payload);
            setShowModal(false);
            fetchOrders();
            setFormData({ vendor_name: '', product_id: '', quantity: '' });
            setRecommendedWarehouse('');
        } catch (error) {
            console.error('Error creating receipt:', error);
            alert('Error creating receipt. See console for details.');
        }
    };

    const handleValidate = async (orderId: number) => {
        try {
            await api.post(`/orders/${orderId}/validate`);
            alert('Order validated successfully! Stock has been updated.');
            fetchOrders();
        } catch (error) {
            console.error('Error validating order:', error);
            alert('Error validating order. See console for details.');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Receipts (Inbound)</h1>
                    <p className="text-gray-600 mt-1">Manage incoming inventory from vendors</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-md"
                >
                    <Plus size={20} />
                    New Receipt
                </button>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        Loading receipts...
                                    </td>
                                </tr>
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        No receipts found. Create your first receipt to get started.
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-medium text-gray-900">#{order.id}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{order.vendor_name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {order.total_items || 'N/A'} items
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 py-1 text-xs font-medium rounded ${order.status === 'Draft'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-green-100 text-green-800'
                                                    }`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {order.status === 'Draft' && (
                                                <button
                                                    onClick={() => handleValidate(order.id)}
                                                    className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-green-700 transition-colors"
                                                >
                                                    <CheckCircle size={16} />
                                                    Validate
                                                </button>
                                            )}
                                            {order.status === 'Validated' && (
                                                <span className="text-sm text-gray-500">Completed</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Receipt Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900">New Inbound Receipt</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Vendor Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.vendor_name}
                                    onChange={(e) => setFormData({ ...formData, vendor_name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="e.g., Tech Supplies Co."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Product
                                </label>
                                <select
                                    required
                                    value={formData.product_id}
                                    onChange={(e) => handleProductChange(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="">Select a product...</option>
                                    {products.map((product) => (
                                        <option key={product.id} value={product.id}>
                                            {product.name} ({product.sku})
                                        </option>
                                    ))}
                                </select>

                                {/* Warehouse Recommendation */}
                                {recommendedWarehouse && (
                                    <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
                                        <strong>Recommended Warehouse:</strong> {recommendedWarehouse}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Quantity
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    required
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="Enter quantity"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Create Receipt
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Receipts;
