import { useState } from 'react';
import { MapPin, Plus } from 'lucide-react';
import MapComponent from '../components/MapComponent';

interface Warehouse {
    id: number;
    name: string;
    location: string;
    latitude: number;
    longitude: number;
}

const Warehouses = () => {
    const [warehouses, setWarehouses] = useState<Warehouse[]>([
        { id: 1, name: 'Mumbai Central Hub', location: 'Bhiwandi', latitude: 19.0760, longitude: 72.8777 },
        { id: 2, name: 'Delhi Distribution Center', location: 'Okhla', latitude: 28.7041, longitude: 77.1025 },
        { id: 3, name: 'Bangalore Tech Park', location: 'Electronic City', latitude: 12.9716, longitude: 77.5946 },
    ]);

    const [formData, setFormData] = useState({
        name: '',
        location: '',
        latitude: '',
        longitude: '',
    });

    const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 180 - 90;
        const y = 90 - ((e.clientY - rect.top) / rect.height) * 180;

        setFormData({
            ...formData,
            latitude: y.toFixed(4),
            longitude: x.toFixed(4),
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newWarehouse: Warehouse = {
            id: warehouses.length + 1,
            name: formData.name,
            location: formData.location,
            latitude: parseFloat(formData.latitude),
            longitude: parseFloat(formData.longitude),
        };

        setWarehouses([...warehouses, newWarehouse]);
        setFormData({ name: '', location: '', latitude: '', longitude: '' });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Warehouse Settings</h1>
                <p className="text-gray-600 mt-1">Manage warehouse locations and configurations</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Warehouse Form */}
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Plus size={20} />
                        Add New Warehouse
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Warehouse Name
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., Chennai Port Hub"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Location
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., T. Nagar"
                            />
                        </div>

                        {/* Interactive Map Picker */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <MapPin size={16} className="inline mr-1" />
                                Map Picker (Click to set coordinates)
                            </label>
                            <MapComponent
                                latitude={parseFloat(formData.latitude) || 20.5937}
                                longitude={parseFloat(formData.longitude) || 78.9629}
                                onLocationChange={(lat, lng) => {
                                    setFormData({
                                        ...formData,
                                        latitude: lat.toFixed(4),
                                        longitude: lng.toFixed(4),
                                    });
                                }}
                                clickable={true}
                                height="192px"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Latitude
                                </label>
                                <input
                                    type="number"
                                    step="0.0001"
                                    required
                                    value={formData.latitude}
                                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="0.0000"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Longitude
                                </label>
                                <input
                                    type="number"
                                    step="0.0001"
                                    required
                                    value={formData.longitude}
                                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="0.0000"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                        >
                            Add Warehouse
                        </button>
                    </form>
                </div>

                {/* Warehouse List */}
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Existing Warehouses</h2>

                    {/* Map showing all warehouses */}
                    <div className="mb-6">
                        <MapComponent
                            latitude={warehouses[0]?.latitude || 20.5937}
                            longitude={warehouses[0]?.longitude || 78.9629}
                            clickable={false}
                            height="200px"
                        />
                        <p className="text-xs text-gray-500 mt-1 text-center">Showing warehouse locations</p>
                    </div>

                    <div className="space-y-3">
                        {warehouses.map((warehouse) => (
                            <div
                                key={warehouse.id}
                                className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">{warehouse.name}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{warehouse.location}</p>
                                        <div className="flex gap-4 mt-2 text-xs text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <MapPin size={12} />
                                                Lat: {warehouse.latitude.toFixed(4)}
                                            </span>
                                            <span>Long: {warehouse.longitude.toFixed(4)}</span>
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                        {warehouse.id}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Warehouses;
