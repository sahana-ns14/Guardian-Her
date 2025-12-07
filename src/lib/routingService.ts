// src/lib/routingService.ts
// Handles route calculation with safety scoring

export interface RoutePoint {
    lat: number;
    lng: number;
}

export interface SafetyMetrics {
    crimeScore: number; // 0-100 (lower is safer)
    lightingScore: number; // 0-100 (higher is better)
    crowdScore: number; // 0-100 (higher is safer)
    proximityBonus: number; // 0-20 (bonus for nearby police/hospitals)
    overallSafety: number; // 0-100 (higher is safer)
}

export interface RouteOption {
    id: string;
    name: string;
    coordinates: RoutePoint[];
    distance: number; // in meters
    duration: number; // walking time in seconds
    durationVehicle: number; // vehicle time in seconds
    safety: SafetyMetrics;
    riskLevel: 'low' | 'medium' | 'high';
    color: string;
}

/**
 * Calculate mock safety score based on route characteristics
 * In production, this would use real crime data, lighting info, etc.
 */
function calculateSafetyScore(
    _route: RoutePoint[],
    routeType: 'fastest' | 'shortest' | 'safest',
    proximityBonus: number = 0
): SafetyMetrics {
    // Mock scoring - in real app, analyze each segment
    let crimeScore = 0;
    let lightingScore = 0;
    let crowdScore = 0;

    switch (routeType) {
        case 'safest':
            crimeScore = 15 + Math.random() * 10; // Low crime
            lightingScore = 80 + Math.random() * 15; // Well-lit
            crowdScore = 70 + Math.random() * 20; // Good crowd
            break;
        case 'shortest':
            crimeScore = 60 + Math.random() * 20; // Higher crime
            lightingScore = 30 + Math.random() * 20; // Poorly lit
            crowdScore = 30 + Math.random() * 20; // Low crowd
            break;
        case 'fastest':
            crimeScore = 35 + Math.random() * 15;
            lightingScore = 55 + Math.random() * 20;
            crowdScore = 50 + Math.random() * 20;
            break;
    }

    const baseScore = (
        (100 - crimeScore) * 0.4 +
        lightingScore * 0.3 +
        crowdScore * 0.3
    );

    const overallSafety = Math.min(100, baseScore + proximityBonus);

    return {
        crimeScore: Math.round(crimeScore),
        lightingScore: Math.round(lightingScore),
        crowdScore: Math.round(crowdScore),
        proximityBonus: Math.round(proximityBonus),
        overallSafety: Math.round(overallSafety)
    };
}

/**
 * Get route risk level based on safety score
 */
function getRiskLevel(safetyScore: number): 'low' | 'medium' | 'high' {
    if (safetyScore >= 70) return 'low';
    if (safetyScore >= 40) return 'medium';
    return 'high';
}

/**
 * Calculate vehicle duration based on distance
 * Assumes average city driving speed of 30 km/h (8.33 m/s)
 */
function calculateVehicleDuration(distanceMeters: number): number {
    const avgSpeedMps = 8.33; // 30 km/h in m/s
    return Math.round(distanceMeters / avgSpeedMps);
}

/**
 * Calculate walking duration based on distance
 * Average walking speed: 1.4 m/s (5 km/h)
 */
function calculateWalkingDuration(distanceMeters: number, pace: number = 1.4): number {
    return Math.round(distanceMeters / pace);
}

/**
 * Fetch routes from OpenRouteService API
 * Free tier: 2000 requests/day
 */
export async function getRoutes(
    start: RoutePoint,
    end: RoutePoint
): Promise<RouteOption[]> {
    const API_KEY = '5b3ce3597851110001cf6248d8b0e8e8a1f94c7d8b0e8e8a1f94c7d'; // Public demo key

    console.log('Calculating route from:', start, 'to:', end);

    try {
        // Get 3 alternative routes
        const response = await fetch(
            `https://api.openrouteservice.org/v2/directions/foot-walking?api_key=${API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    coordinates: [
                        [start.lng, start.lat],
                        [end.lng, end.lat]
                    ],
                    alternative_routes: {
                        target_count: 2,
                        weight_factor: 1.4
                    },
                    preference: 'recommended',
                    units: 'm' // meters
                })
            }
        );

        console.log('Routing API response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Routing API error:', response.status, errorText);
            throw new Error(`Routing API failed: ${response.status}`);
        }

        const data = await response.json();
        console.log('Routing API data:', data);

        if (!data.routes || data.routes.length === 0) {
            throw new Error('No routes found');
        }

        const routes: RouteOption[] = [];

        // Process each route
        data.routes.forEach((route: any, index: number) => {
            const coords: RoutePoint[] = route.geometry.coordinates.map((c: number[]) => ({
                lng: c[0],
                lat: c[1]
            }));

            const routeType = index === 0 ? 'safest' : index === 1 ? 'fastest' : 'shortest';
            const safety = calculateSafetyScore(coords, routeType);
            const riskLevel = getRiskLevel(safety.overallSafety);

            const routeOption = {
                id: `route-${index}`,
                name: index === 0 ? '🟢 Safest Route' : index === 1 ? '🟡 Faster Route' : '🔴 Shortest Route',
                coordinates: coords,
                distance: route.summary.distance, // Already in meters
                duration: route.summary.duration, // Already in seconds (walking)
                durationVehicle: calculateVehicleDuration(route.summary.distance),
                safety,
                riskLevel,
                color: riskLevel === 'low' ? '#22c55e' : riskLevel === 'medium' ? '#eab308' : '#ef4444'
            };

            console.log(`Route ${index}:`, {
                distance: formatDistance(routeOption.distance),
                duration: formatDuration(routeOption.duration),
                safety: routeOption.safety.overallSafety
            });

            routes.push(routeOption);
        });

        // Sort by safety score (safest first)
        return routes.sort((a, b) => b.safety.overallSafety - a.safety.overallSafety);

    } catch (error) {
        console.error('Routing error:', error);
        console.warn('Using offline fallback routes');

        // Fallback: Generate 3 alternative routes with different characteristics
        const straightLineDistance = calculateDistance(start, end);

        // Create 3 routes with slight variations
        const routes: RouteOption[] = [];

        // Route 1: Safest (longer but safer)
        const safestDistance = straightLineDistance * 1.3; // 30% longer
        routes.push({
            id: 'route-safest-offline',
            name: '🟢 Safest Route (Offline)',
            coordinates: generateIntermediatePoints(start, end, 5),
            distance: safestDistance,
            duration: calculateWalkingDuration(safestDistance, 1.2),
            durationVehicle: calculateVehicleDuration(safestDistance),
            safety: {
                crimeScore: 20,
                lightingScore: 75,
                crowdScore: 70,
                proximityBonus: 0,
                overallSafety: 75
            },
            riskLevel: 'low',
            color: '#22c55e'
        });

        // Route 2: Balanced (medium distance and safety)
        const balancedDistance = straightLineDistance * 1.15; // 15% longer
        routes.push({
            id: 'route-balanced-offline',
            name: '🟡 Balanced Route (Offline)',
            coordinates: generateIntermediatePoints(start, end, 4),
            distance: balancedDistance,
            duration: calculateWalkingDuration(balancedDistance),
            durationVehicle: calculateVehicleDuration(balancedDistance),
            safety: {
                crimeScore: 35,
                lightingScore: 60,
                crowdScore: 55,
                proximityBonus: 0,
                overallSafety: 60
            },
            riskLevel: 'medium',
            color: '#eab308'
        });

        // Route 3: Shortest (direct but potentially riskier)
        routes.push({
            id: 'route-shortest-offline',
            name: '🔴 Shortest Route (Offline)',
            coordinates: [start, end],
            distance: straightLineDistance,
            duration: calculateWalkingDuration(straightLineDistance),
            durationVehicle: calculateVehicleDuration(straightLineDistance),
            safety: {
                crimeScore: 50,
                lightingScore: 45,
                crowdScore: 40,
                proximityBonus: 0,
                overallSafety: 48
            },
            riskLevel: 'medium',
            color: '#eab308'
        });

        console.log('Generated offline routes:', routes.map(r => ({
            name: r.name,
            distance: formatDistance(r.distance),
            duration: formatDuration(r.duration)
        })));

        return routes;
    }
}

/**
 * Generate intermediate points between start and end for more realistic routes
 */
function generateIntermediatePoints(start: RoutePoint, end: RoutePoint, numPoints: number): RoutePoint[] {
    const points: RoutePoint[] = [start];

    for (let i = 1; i < numPoints; i++) {
        const ratio = i / numPoints;
        // Add slight random offset to make routes look different
        const offset = (Math.random() - 0.5) * 0.002;
        points.push({
            lat: start.lat + (end.lat - start.lat) * ratio + offset,
            lng: start.lng + (end.lng - start.lng) * ratio + offset
        });
    }

    points.push(end);
    return points;
}

/**
 * Calculate straight-line distance between two points (Haversine formula)
 */
function calculateDistance(p1: RoutePoint, p2: RoutePoint): number {
    const R = 6371e3; // Earth radius in meters
    const φ1 = p1.lat * Math.PI / 180;
    const φ2 = p2.lat * Math.PI / 180;
    const Δφ = (p2.lat - p1.lat) * Math.PI / 180;
    const Δλ = (p2.lng - p1.lng) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

/**
 * Format distance for display
 */
export function formatDistance(meters: number): string {
    if (meters < 1000) {
        return `${Math.round(meters)} m`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
}

/**
 * Format duration for display
 */
export function formatDuration(seconds: number): string {
    const mins = Math.round(seconds / 60);
    if (mins < 60) {
        return `${mins} min`;
    }
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return `${hours}h ${remainingMins}m`;
}
