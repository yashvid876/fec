import { useEffect, useState } from 'react';
import { Plus, X, AlertCircle } from 'lucide-react';
import api from '../lib/api';

interface Order {
    id: number;
    type: string;
    customer_name?: string;
    status: string;
    created_at?: string;
    total_items?: number;
}

interface Product {
    id: number;
    name: string;
    sku: string;
    current_stock: number;
}

const Deliveries = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        customer_name: '',
        product_id: '',
        quantity: '',
    });
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [quantityError, setQuantityError] = useState(false);

    useEffect(() => {
        fetchOrders();
        fetchProducts();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/orders');
            const deliveries = response.data.filter((order: Order) => order.type === 'OUT');
            setOrders(deliveries);
        } catch (error) {
            console.error('Error fetching orders:', error);
            // Mock data
            setOrders([
                { id: 4, type: 'OUT', customer_name: 'Acme Corp', status: 'Draft', total_items: 3 },
                { id: 5, type: 'OUT', customer_name: 'Beta Industries', status: 'Validated', total_items: 7 },
                { id: 6, type: 'OUT', customer_name: 'Gamma LLC', status: 'Draft', total_items: 2 },
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
                { id: 1, name: 'Laptop Stand Pro', sku: 'LSP-001', current_stock: 45 },
                { id: 2, name: 'USB-C Cable 2m', sku: 'USC-002', current_stock: 120 },
                { id: 3, name: 'Wireless Mouse MX3', sku: 'WMX-003', current_stock: 8 },
            ]);
        }
    };

    const handleProductChange = (productId: string) => {
        setFormData({ ...formData, product_id: productId, quantity: '' });

        if (productId) {
            const product = products.find((p) => p.id === parseInt(productId));
            setSelectedProduct(product || null);
        } else {
            setSelectedProduct(null);
        }
        setQuantityError(false);
    };

    const handleQuantityChange = (quantity: string) => {
        setFormData({ ...formData, quantity });

        if (selectedProduct && quantity) {
            const qty = parseInt(quantity);
            setQuantityError(qty > selectedProduct.current_stock);
        } else {
            setQuantityError(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (quantityError) {
            alert('Quantity exceeds available stock!');
            return;
        }

        try {
            const payload = {
                type: 'OUT',
                customer_name: formData.customer_name,
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
            setFormData({ customer_name: '', product_id: '', quantity: '' });
            setSelectedProduct(null);
            setQuantityError(false);
        } catch (error) {
            console.error('Error creating delivery:', error);
            alert('Error creating delivery. See console for details.');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Deliveries (Outbound)</h1>
                    <p className="text-gray-600 mt-1">Manage outgoing shipments to customers</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors shadow-md"
                >
                    <Plus size={20} />
                    New Delivery
                </button>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        Loading deliveries...
                                    </td>
                                </tr>
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        No deliveries found. Create your first delivery to get started.
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-medium text-gray-900">#{order.id}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{order.customer_name}</div>
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
                                                <button className="text-sm text-blue-600 hover:text-blue-700">
                                                    Process
                                                </button>
                                            )}
                                            {order.status === 'Validated' && (
                                                <span className="text-sm text-gray-500">Shipped</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Delivery Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900">New Outbound Delivery</h2>
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
                                    Customer Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.customer_name}
                                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="e.g., Acme Corp"
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                >
                                    <option value="">Select a product...</option>
                                    {products.map((product) => (
                                        <option key={product.id} value={product.id}>
                                            {product.name} ({product.sku})
                                        </option>
                                    ))}
                                </select>

                                {/* Available Stock Info */}
                                {selectedProduct && (
                                    <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
                                        <strong>Available:</strong> {selectedProduct.current_stock} units
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
                                    onChange={(e) => handleQuantityChange(e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${quantityError
                                            ? 'border-red-500 focus:ring-red-500'
                                            : 'border-gray-300 focus:ring-orange-500'
                                        }`}
                                    placeholder="Enter quantity"
                                    disabled={!selectedProduct}
                                />

                                {quantityError && (
                                    <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                                        <AlertCircle size={16} />
                                        <span>Quantity exceeds available stock!</span>
                                    </div>
                                )}
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
                                    disabled={quantityError}
                                    className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Create Delivery
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Deliveries;
