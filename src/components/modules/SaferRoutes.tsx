import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ArrowLeft, Navigation, Search, AlertTriangle, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getRoutes, formatDistance, formatDuration, type RouteOption, type RoutePoint } from '../../lib/routingService';
import { getNearbyEmergencyServices, calculateProximityBonus, type SafetyPoint } from '../../lib/safetyPoints';
import { SearchAutocomplete } from '../ui/SearchAutocomplete';
import type { SearchResult } from '../../lib/geocoding';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for emergency services
const policeIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#3b82f6">
            <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z"/>
        </svg>
    `),
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

const hospitalIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#ef4444">
            <path d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z"/>
        </svg>
    `),
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

// Component to recenter map
function MapController({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, 13);
    }, [center, map]);
    return null;
}

export default function SaferRoutes() {
    const navigate = useNavigate();
    const [currentLocation, setCurrentLocation] = useState<RoutePoint | null>(null);
    const [source, setSource] = useState<RoutePoint | null>(null);
    const [destination, setDestination] = useState<RoutePoint | null>(null);
    const [destinationInput, setDestinationInput] = useState('');
    const [routes, setRoutes] = useState<RouteOption[]>([]);
    const [selectedRoute, setSelectedRoute] = useState<RouteOption | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isNavigating, setIsNavigating] = useState(false);
    const [showRoutePanel, setShowRoutePanel] = useState(false);
    const [safetyPoints, setSafetyPoints] = useState<SafetyPoint[]>([]);
    const [showSafetyLayer, _setShowSafetyLayer] = useState(true);

    // Get user's current location
    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const loc = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    setCurrentLocation(loc);
                    // Fetch nearby emergency services
                    fetchEmergencyServices(loc.lat, loc.lng);
                },
                (error) => {
                    console.error('Location error:', error);
                    // Fallback to Bangalore coordinates
                    const fallback = { lat: 12.9716, lng: 77.5946 };
                    setCurrentLocation(fallback);
                    fetchEmergencyServices(fallback.lat, fallback.lng);
                }
            );
        } else {
            const fallback = { lat: 12.9716, lng: 77.5946 };
            setCurrentLocation(fallback);
            fetchEmergencyServices(fallback.lat, fallback.lng);
        }
    }, []);

    const fetchEmergencyServices = async (lat: number, lng: number) => {
        try {
            const services = await getNearbyEmergencyServices(lat, lng, 5);
            setSafetyPoints(services);
        } catch (error) {
            console.error('Failed to fetch emergency services:', error);
        }
    };

    // Get user's current location
    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCurrentLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    console.error('Location error:', error);
                    // Fallback to Bangalore coordinates
                    setCurrentLocation({ lat: 12.9716, lng: 77.5946 });
                }
            );
        } else {
            setCurrentLocation({ lat: 12.9716, lng: 77.5946 });
        }
    }, []);

    // Calculate routes when destination is set
    const handleFindRoutes = async () => {
        const startPoint = source || currentLocation;
        if (!startPoint || !destination) return;

        setIsLoading(true);
        try {
            const calculatedRoutes = await getRoutes(startPoint, destination);

            // Apply proximity bonus to each route
            const routesWithBonus = calculatedRoutes.map(route => {
                const bonus = calculateProximityBonus(route.coordinates, safetyPoints);
                return {
                    ...route,
                    safety: {
                        ...route.safety,
                        proximityBonus: bonus,
                        overallSafety: Math.min(100, route.safety.overallSafety + bonus)
                    }
                };
            });

            setRoutes(routesWithBonus);
            setSelectedRoute(routesWithBonus[0]); // Auto-select safest
            setShowRoutePanel(true);
        } catch (error) {
            console.error('Route calculation failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Simple geocoding fallback (in production, use proper geocoding API)
    const handleSearch = async () => {
        if (!destinationInput.trim()) return;

        // Mock: just offset from current location
        // In production, use Nominatim or Google Geocoding API
        if (currentLocation) {
            setDestination({
                lat: currentLocation.lat + 0.01,
                lng: currentLocation.lng + 0.01
            });
            handleFindRoutes();
        }
    };

    // Handle search autocomplete selection
    const handleSearchSelect = async (result: SearchResult) => {
        setDestination({
            lat: result.lat,
            lng: result.lng
        });
        setDestinationInput(result.name);
        await handleFindRoutes();
    };

    // Handle source autocomplete selection
    const handleSourceSelect = async (result: SearchResult) => {
        setSource({
            lat: result.lat,
            lng: result.lng
        });
        // Auto-calculate if destination is already set
        if (destination) {
            await handleFindRoutes();
        }
    };

    const handleStartNavigation = () => {
        if (selectedRoute) {
            setIsNavigating(true);
            // In production, implement turn-by-turn navigation
        }
    };

    if (!currentLocation) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Getting your location...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen relative">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-[1000] bg-white/95 dark:bg-charcoal-900/95 backdrop-blur-sm p-4 shadow-md">
                <div className="flex items-center gap-2 mb-3">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                        <ArrowLeft size={24} />
                    </Button>
                    <h2 className="text-xl font-bold dark:text-cream-50">Saferoute+ AI</h2>
                </div>

                {/* Search Bars */}
                <div className="space-y-2">
                    {/* Source */}
                    <div className="flex gap-2">
                        <SearchAutocomplete
                            onSelect={handleSourceSelect}
                            placeholder="Starting point (Current Location)"
                            userLocation={currentLocation || undefined}
                        />
                    </div>

                    {/* Destination */}
                    <div className="flex gap-2">
                        <SearchAutocomplete
                            onSelect={handleSearchSelect}
                            placeholder="Where do you want to go?"
                            userLocation={currentLocation || undefined}
                        />
                        <Button size="icon" onClick={handleSearch} disabled={isLoading}>
                            <Search size={20} />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Map */}
            <div className="flex-1 relative mt-32">
                <MapContainer
                    center={[currentLocation.lat, currentLocation.lng]}
                    zoom={13}
                    className="h-full w-full"
                    zoomControl={false}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapController center={[currentLocation.lat, currentLocation.lng]} />

                    {/* Current Location Marker */}
                    <Marker position={[currentLocation.lat, currentLocation.lng]}>
                        <Popup>You are here</Popup>
                    </Marker>

                    {/* Destination Marker */}
                    {destination && (
                        <Marker position={[destination.lat, destination.lng]}>
                            <Popup>Destination</Popup>
                        </Marker>
                    )}

                    {/* Route Lines */}
                    {routes.map((route) => (
                        <Polyline
                            key={route.id}
                            positions={route.coordinates.map(c => [c.lat, c.lng])}
                            color={route.color}
                            weight={selectedRoute?.id === route.id ? 6 : 4}
                            opacity={selectedRoute?.id === route.id ? 1 : 0.5}
                        />
                    ))}

                    {/* Emergency Services Markers */}
                    {showSafetyLayer && safetyPoints.map((point) => (
                        <Marker
                            key={point.id}
                            position={[point.lat, point.lng]}
                            icon={point.type === 'police' ? policeIcon : hospitalIcon}
                        >
                            <Popup>
                                <div className="text-sm">
                                    <div className="font-bold">{point.name}</div>
                                    <div className="text-gray-600 capitalize">{point.type}</div>
                                    {point.distance && (
                                        <div className="text-xs text-gray-500 mt-1">
                                            {formatDistance(point.distance)} away
                                        </div>
                                    )}
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>

                {/* Current Location Button */}
                <button
                    onClick={() => {
                        if ('geolocation' in navigator) {
                            navigator.geolocation.getCurrentPosition((pos) => {
                                setCurrentLocation({
                                    lat: pos.coords.latitude,
                                    lng: pos.coords.longitude
                                });
                            });
                        }
                    }}
                    className="absolute bottom-24 right-4 z-[1000] bg-white dark:bg-charcoal-800 p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow"
                >
                    <Navigation size={24} className="text-rose-500" />
                </button>
            </div>

            {/* Route Options Panel */}
            {showRoutePanel && routes.length > 0 && (
                <div className="absolute bottom-0 left-0 right-0 z-[1000] bg-white dark:bg-charcoal-900 rounded-t-3xl shadow-2xl max-h-[50vh] overflow-y-auto">
                    <div className="p-4 space-y-3">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-lg">Route Options</h3>
                            <button onClick={() => setShowRoutePanel(false)} className="text-gray-400 hover:text-gray-600 text-2xl">
                                ×
                            </button>
                        </div>

                        {routes.map((route) => (
                            <Card
                                key={route.id}
                                className={`p-4 cursor-pointer transition-all ${selectedRoute?.id === route.id
                                    ? 'border-2 border-rose-500 bg-rose-50 dark:bg-rose-900/20'
                                    : 'hover:bg-gray-50 dark:hover:bg-charcoal-800'
                                    }`}
                                onClick={() => setSelectedRoute(route)}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-lg font-bold">{route.name}</span>
                                            {route.riskLevel === 'low' && (
                                                <Shield size={18} className="text-green-600" />
                                            )}
                                            {route.riskLevel === 'high' && (
                                                <AlertTriangle size={18} className="text-red-600" />
                                            )}
                                        </div>

                                        <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                                            <span>{formatDistance(route.distance)}</span>
                                        </div>

                                        {/* Duration - Walking & Vehicle */}
                                        <div className="flex gap-3 text-xs mb-3">
                                            <div className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                                                <span>🚶</span>
                                                <span className="font-medium">{formatDuration(route.duration)}</span>
                                            </div>
                                            <div className="flex items-center gap-1 bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded">
                                                <span>🚗</span>
                                                <span className="font-medium">{formatDuration(route.durationVehicle)}</span>
                                            </div>
                                        </div>

                                        {/* Safety Metrics */}
                                        <div className="grid grid-cols-4 gap-2 text-xs">
                                            <div className="bg-gray-100 dark:bg-charcoal-700 p-2 rounded">
                                                <div className="text-gray-500">Crime</div>
                                                <div className={`font-bold ${route.safety.crimeScore < 30 ? 'text-green-600' : route.safety.crimeScore < 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                                                    {100 - route.safety.crimeScore}%
                                                </div>
                                            </div>
                                            <div className="bg-gray-100 dark:bg-charcoal-700 p-2 rounded">
                                                <div className="text-gray-500">Lighting</div>
                                                <div className={`font-bold ${route.safety.lightingScore > 70 ? 'text-green-600' : route.safety.lightingScore > 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                                                    {route.safety.lightingScore}%
                                                </div>
                                            </div>
                                            <div className="bg-gray-100 dark:bg-charcoal-700 p-2 rounded">
                                                <div className="text-gray-500">Proximity</div>
                                                <div className={`font-bold ${route.safety.proximityBonus > 10 ? 'text-green-600' : route.safety.proximityBonus > 5 ? 'text-yellow-600' : 'text-gray-600'}`}>
                                                    +{route.safety.proximityBonus}
                                                </div>
                                            </div>
                                            <div className="bg-gray-100 dark:bg-charcoal-700 p-2 rounded">
                                                <div className="text-gray-500">Safety</div>
                                                <div className={`font-bold ${route.safety.overallSafety > 70 ? 'text-green-600' : route.safety.overallSafety > 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                                                    {route.safety.overallSafety}%
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}

                        {selectedRoute && (
                            <Button
                                className="w-full h-14 text-lg bg-rose-500 hover:bg-rose-600 text-white"
                                onClick={handleStartNavigation}
                            >
                                <Navigation className="mr-2" size={20} />
                                Start Navigation
                            </Button>
                        )}
                    </div>
                </div>
            )}

            {/* Navigation Mode */}
            {isNavigating && selectedRoute && (
                <div className="absolute top-24 left-4 right-4 z-[1000] bg-white dark:bg-charcoal-900 rounded-2xl shadow-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="font-bold">Navigating</span>
                        </div>
                        <button onClick={() => setIsNavigating(false)} className="text-red-500 font-medium">
                            End
                        </button>
                    </div>
                    <div className="text-2xl font-bold mb-1">{formatDistance(selectedRoute.distance)} remaining</div>
                    <div className="text-sm text-gray-600">ETA: {formatDuration(selectedRoute.duration)}</div>
                </div>
            )}
        </div>
    );
}
