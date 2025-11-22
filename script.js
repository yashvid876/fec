// ========================================
// StockMaster AI - Main JavaScript Logic
// ========================================

// Warehouse coordinates (lat, lng)
const WAREHOUSE_COORDS = {
    'WH-MUM': { lat: 19.0760, lng: 72.8777, name: 'Mumbai' },
    'WH-DEL': { lat: 28.7041, lng: 77.1025, name: 'Delhi' },
    'WH-BLR': { lat: 12.9716, lng: 77.5946, name: 'Bangalore' },
    'WH-PUN': { lat: 18.5204, lng: 73.8567, name: 'Pune' }
};

// Product mapping for display
const PRODUCT_NAMES = {
    'PROD-001': 'Steel',
    'PROD-002': 'Cement',
    'PROD-003': 'Pipes'
};

// Day of week mapping
const DAY_OF_WEEK = new Date().getDay(); // 0=Sunday, 1=Monday, etc.

// Global variables
let map = null;
let currentMarker = null;
let demandChart = null;

// ========================================
// Initialize Application
// ========================================

document.addEventListener('DOMContentLoaded', function () {
    initializeMap();
    initializeChart();
    attachEventListeners();
    updateTrafficValue();
    
    // Initialize ML integration
    initializeMLIntegration();
});

// ========================================
// ML Integration Initialization
// ========================================

async function initializeMLIntegration() {
    try {
        // Initialize frontend ML model
        await initializeFrontendML();
        
        // Show model info if available
        const modelInfo = frontendMLModel.getModelInfo();
        if (modelInfo) {
            console.log('🤖 Frontend ML Model Info:', modelInfo);
            showNotification('✅ Frontend ML model loaded successfully!', 'success');
        }
        
    } catch (error) {
        console.error('Failed to initialize frontend ML model:', error);
        showNotification('⚠️ ML model initialization failed - using fallback mode', 'info');
    }
}

// ========================================
// Event Listeners
// ========================================

function attachEventListeners() {
    // Predict button
    document.getElementById('predict-btn').addEventListener('click', runPrediction);

    // Traffic slider
    const slider = document.getElementById('traffic-slider');
    slider.addEventListener('input', updateTrafficValue);

    // Warehouse selection - update map
    document.getElementById('warehouse-select').addEventListener('change', function () {
        const warehouseId = this.value;
        flyToWarehouse(warehouseId);
    });
}

function updateTrafficValue() {
    const slider = document.getElementById('traffic-slider');
    const value = parseFloat(slider.value).toFixed(1);
    document.getElementById('traffic-value').textContent = value;
}

// ========================================
// Leaflet Map Initialization
// ========================================

function initializeMap() {
    // Initialize map centered on India
    map = L.map('map').setView([20.5937, 78.9629], 5);

    // Add OpenStreetMap tile layer for better visibility
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);

    // Add initial marker for Mumbai (default)
    addMarker('WH-MUM', 'gray');
}

function flyToWarehouse(warehouseId) {
    const coords = WAREHOUSE_COORDS[warehouseId];
    if (coords) {
        map.flyTo([coords.lat, coords.lng], 11, {
            duration: 1.5,
            easeLinearity: 0.25
        });
    }
}

function addMarker(warehouseId, color) {
    // Remove existing marker
    if (currentMarker) {
        map.removeLayer(currentMarker);
    }

    const coords = WAREHOUSE_COORDS[warehouseId];
    if (!coords) return;

    // Define marker icon based on status
    let iconColor = '#9CA3AF'; // Gray default
    if (color === 'green') iconColor = '#20e3b2';
    if (color === 'red') iconColor = '#f5576c';
    if (color === 'yellow') iconColor = '#fdcb6e';

    // Create custom icon
    const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="
            background-color: ${iconColor};
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border: 4px solid white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            animation: markerPulse 2s infinite;
        "></div>
        <style>
            @keyframes markerPulse {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.2); opacity: 0.8; }
            }
        </style>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });

    // Add marker to map
    currentMarker = L.marker([coords.lat, coords.lng], { icon: customIcon })
        .addTo(map)
        .bindPopup(`
            <div style="font-family: 'Inter', sans-serif; color: #1f2937;">
                <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 700;">
                    📦 ${coords.name} Warehouse
                </h3>
                <p style="margin: 0; font-size: 14px; color: #6b7280;">
                    Status: <strong style="color: ${iconColor};">${color.toUpperCase()}</strong>
                </p>
            </div>
        `);
}

// ========================================
// Chart.js Initialization
// ========================================

function initializeChart() {
    const ctx = document.getElementById('demand-chart').getContext('2d');

    demandChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Predicted Demand',
                data: [420, 380, 450, 500, 480, 520, 490],
                borderColor: 'rgba(102, 126, 234, 1)',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointRadius: 6,
                pointBackgroundColor: 'rgba(102, 126, 234, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: 'rgba(255, 255, 255, 0.8)',
                        font: {
                            size: 14,
                            family: "'Inter', sans-serif",
                            weight: 500
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: 'rgba(102, 126, 234, 1)',
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 12,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.8)',
                        font: {
                            size: 12
                        },
                        callback: function (value) {
                            return value + ' units';
                        }
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.8)',
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });
}

function updateChart(baseValue) {
    // Generate realistic 7-day forecast with some variation
    const forecast = [];
    for (let i = 0; i < 7; i++) {
        const variation = (Math.random() - 0.5) * 100; // ±50 units variation
        forecast.push(Math.round(baseValue + variation));
    }

    demandChart.data.datasets[0].data = forecast;
    demandChart.update('active');
}

// ========================================
// ML Model Integration Functions
// ========================================

// Check if backend is available
async function checkBackendHealth() {
    try {
        const response = await fetch('http://localhost:8001/health');
        return response.ok;
    } catch (error) {
        console.warn('Backend health check failed:', error);
        return false;
    }
}

// Train the ML model
async function trainModel() {
    const button = document.getElementById('train-btn');
    
    try {
        button.disabled = true;
        button.innerHTML = '<span class="btn-icon">⏳</span> Training Model...';
        
        const response = await fetch('http://localhost:8001/train', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            const result = await response.json();
            showNotification('✅ Model training completed successfully!', 'success');
            return result;
        } else {
            throw new Error(`Training failed: ${response.statusText}`);
        }
    } catch (error) {
        showNotification(`❌ Model training failed: ${error.message}`, 'error');
        throw error;
    } finally {
        button.disabled = false;
        button.innerHTML = '<span class="btn-icon">🎯</span> Train Model';
    }
}

// Get model status
async function getModelStatus() {
    try {
        const response = await fetch('http://localhost:8001/model/status');
        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.warn('Failed to get model status:', error);
    }
    return null;
}

// Show notification
function showNotification(message, type = 'info') {
    const alertBanner = document.getElementById('alert-banner');
    const alertText = document.getElementById('alert-text');
    
    alertBanner.classList.remove('hidden', 'danger', 'success', 'info', 'error');
    alertBanner.classList.add(type);
    alertText.textContent = message;
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        alertBanner.classList.add('hidden');
    }, 5000);
}

// Create training button
function createTrainButton() {
    const controlsDiv = document.querySelector('.controls');
    const trainButton = document.createElement('button');
    trainButton.id = 'train-btn';
    trainButton.className = 'train-btn';
    trainButton.innerHTML = '<span class="btn-icon">🎯</span> Train Model';
    
    controlsDiv.appendChild(trainButton);
    trainButton.addEventListener('click', trainModel);
    
    return trainButton;
}

// ========================================
// AI Prediction Logic (Enhanced)
// ========================================

async function runPrediction() {
    const button = document.getElementById('predict-btn');
    button.disabled = true;
    button.innerHTML = '<span class="btn-icon">⏳</span> Processing...';

    // Get input values
    const warehouseId = document.getElementById('warehouse-select').value;
    const productId = document.getElementById('product-select').value;
    const trafficLevel = parseFloat(document.getElementById('traffic-slider').value);

    try {
        // Use frontend ML model for prediction
        const prediction = await predictWithFrontendModel(warehouseId, productId, DAY_OF_WEEK, trafficLevel);
        
        // Update UI with prediction results
        updateUIWithPrediction(prediction.predicted_stock, prediction.status_color, warehouseId);
        
        // Show success notification with confidence
        showNotification(`🤖 AI prediction completed! Confidence: ${Math.round(prediction.confidence * 100)}%`, 'success');
        
        console.log('📊 Prediction Details:', prediction);
        
    } catch (error) {
        console.error('Frontend ML prediction failed:', error);
        
        // Fallback to simple simulation
        const simulatedResult = simulateAIPrediction(trafficLevel);
        updateUIWithPrediction(simulatedResult.predicted_stock, simulatedResult.status_color, warehouseId);
        showNotification('⚠️ Using fallback prediction (ML model unavailable)', 'info');
    } finally {
        button.disabled = false;
        button.innerHTML = '<span class="btn-icon">🤖</span> Run AI Prediction';
    }
}

// Fallback simulation logic
function simulateAIPrediction(trafficLevel) {
    let predictedStock;
    let statusColor;

    // Logic: Higher traffic = higher stock needed (congestion delays)
    // Thresholds: Green (<300), Yellow (300-600), Red (>600)
    if (trafficLevel > 7) {
        // High traffic - need more stock, predict higher levels
        predictedStock = Math.round(500 + Math.random() * 300); // 500-800 (Red/Yellow)
    } else if (trafficLevel > 4) {
        // Medium traffic - moderate levels
        predictedStock = Math.round(300 + Math.random() * 300); // 300-600 (Yellow)
    } else {
        // Low traffic - lower stock needed
        predictedStock = Math.round(100 + Math.random() * 300); // 100-400 (Green/Yellow)
    }

    // Determine color based on predicted stock
    if (predictedStock > 600) {
        statusColor = 'Red';    // High/Full stock
    } else if (predictedStock < 300) {
        statusColor = 'Green';  // Low/Empty stock
    } else {
        statusColor = 'Yellow'; // Moderate stock
    }

    return {
        predicted_stock: predictedStock,
        status_color: statusColor
    };
}

// ========================================
// UI Update Functions
// ========================================

function updateUIWithPrediction(predictedStock, statusColor, warehouseId) {
    // Update KPI cards
    const currentStock = Math.round(predictedStock * (0.8 + Math.random() * 0.4)); // Simulate current stock
    document.getElementById('current-stock').textContent = currentStock.toLocaleString();
    document.getElementById('predicted-demand').textContent = Math.round(predictedStock).toLocaleString();

    // Update status badge
    const statusBadge = document.getElementById('status-badge');
    statusBadge.textContent = statusColor;
    statusBadge.className = 'kpi-value status-badge ' + statusColor.toLowerCase();

    // Update alert banner
    const alertBanner = document.getElementById('alert-banner');
    const alertText = document.getElementById('alert-text');
    alertBanner.classList.remove('hidden', 'danger', 'success');

    if (statusColor === 'Red') {
        alertBanner.classList.add('danger');
        alertText.textContent = '⚠️ Critical Stockout Risk - Immediate Action Required!';
    } else if (statusColor === 'Green') {
        alertBanner.classList.add('success');
        alertText.textContent = '✔️ Optimal Stock Levels - All Systems Operational';
    } else {
        alertBanner.classList.add('success');
        alertText.textContent = '⚡ Moderate Stock Levels - Monitor Closely';
    }

    // Update map marker
    const markerColor = statusColor.toLowerCase();
    addMarker(warehouseId, markerColor);

    // Update chart with new forecast
    updateChart(predictedStock);

    // Add success animation
    animateKPICards();
}

function animateKPICards() {
    const cards = document.querySelectorAll('.kpi-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.animation = 'none';
            setTimeout(() => {
                card.style.animation = 'fadeInUp 0.5s ease-out';
            }, 10);
        }, index * 100);
    });
}

// ========================================
// Utility Functions
// ========================================

// Add smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Log initialization
console.log('🚀 StockMaster AI Dashboard Initialized');
console.log('📍 Warehouses loaded:', Object.keys(WAREHOUSE_COORDS).length);
console.log('🤖 Ready for predictions!');
