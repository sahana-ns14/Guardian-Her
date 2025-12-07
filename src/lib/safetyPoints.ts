// src/lib/safetyPoints.ts
// Handles fetching nearby police stations and hospitals

export interface SafetyPoint {
    id: string;
    name: string;
    type: 'police' | 'hospital';
    lat: number;
    lng: number;
    distance?: number; // Distance from user in meters
}

/**
 * Fetch nearby police stations and hospitals using Overpass API (OpenStreetMap)
 * Free and no API key required
 */
export async function getNearbyEmergencyServices(
    lat: number,
    lng: number,
    radiusKm: number = 5
): Promise<SafetyPoint[]> {
    const radius = radiusKm * 1000; // Convert to meters

    // Overpass QL query for police and hospitals
    const query = `
        [out:json][timeout:25];
        (
            node["amenity"="police"](around:${radius},${lat},${lng});
            way["amenity"="police"](around:${radius},${lat},${lng});
            node["amenity"="hospital"](around:${radius},${lat},${lng});
            way["amenity"="hospital"](around:${radius},${lat},${lng});
            node["amenity"="clinic"](around:${radius},${lat},${lng});
        );
        out center;
    `;

    try {
        const response = await fetch('https://overpass-api.de/api/interpreter', {
            method: 'POST',
            body: query,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        if (!response.ok) {
            throw new Error('Overpass API failed');
        }

        const data = await response.json();
        const points: SafetyPoint[] = [];

        data.elements.forEach((element: any) => {
            const pointLat = element.lat || element.center?.lat;
            const pointLng = element.lon || element.center?.lon;

            if (!pointLat || !pointLng) return;

            const type = element.tags?.amenity === 'police' ? 'police' : 'hospital';
            const name = element.tags?.name ||
                (type === 'police' ? 'Police Station' : 'Hospital');

            const distance = calculateDistance(
                { lat, lng },
                { lat: pointLat, lng: pointLng }
            );

            points.push({
                id: `${type}-${element.id}`,
                name,
                type,
                lat: pointLat,
                lng: pointLng,
                distance
            });
        });

        // Sort by distance
        return points.sort((a, b) => (a.distance || 0) - (b.distance || 0));

    } catch (error) {
        console.error('Failed to fetch emergency services:', error);

        // Return mock data for Bangalore as fallback
        return getMockEmergencyServices(lat, lng);
    }
}

/**
 * Mock emergency services for offline/fallback
 */
function getMockEmergencyServices(userLat: number, userLng: number): SafetyPoint[] {
    const mockPoints: SafetyPoint[] = [
        // Bangalore Police Stations
        { id: 'p1', name: 'Koramangala Police Station', type: 'police', lat: 12.9352, lng: 77.6245 },
        { id: 'p2', name: 'Indiranagar Police Station', type: 'police', lat: 12.9716, lng: 77.6412 },
        { id: 'p3', name: 'Whitefield Police Station', type: 'police', lat: 12.9698, lng: 77.7499 },
        { id: 'p4', name: 'HSR Layout Police Station', type: 'police', lat: 12.9121, lng: 77.6446 },

        // Bangalore Hospitals
        { id: 'h1', name: 'Manipal Hospital', type: 'hospital', lat: 12.9698, lng: 77.7499 },
        { id: 'h2', name: 'Apollo Hospital', type: 'hospital', lat: 12.9716, lng: 77.5946 },
        { id: 'h3', name: 'Fortis Hospital', type: 'hospital', lat: 12.9141, lng: 77.6101 },
        { id: 'h4', name: 'Columbia Asia Hospital', type: 'hospital', lat: 12.9352, lng: 77.6245 },
    ];

    // Calculate distances
    return mockPoints.map(point => ({
        ...point,
        distance: calculateDistance({ lat: userLat, lng: userLng }, { lat: point.lat, lng: point.lng })
    })).sort((a, b) => (a.distance || 0) - (b.distance || 0));
}

/**
 * Calculate distance between two points (Haversine formula)
 */
function calculateDistance(p1: { lat: number; lng: number }, p2: { lat: number; lng: number }): number {
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
 * Calculate proximity bonus for safety score
 * Closer to police/hospital = higher safety
 */
export function calculateProximityBonus(
    routePoints: { lat: number; lng: number }[],
    safetyPoints: SafetyPoint[]
): number {
    if (safetyPoints.length === 0) return 0;

    let totalBonus = 0;
    const policeStations = safetyPoints.filter(p => p.type === 'police');
    const hospitals = safetyPoints.filter(p => p.type === 'hospital');

    // Check proximity along the route
    routePoints.forEach(point => {
        // Find nearest police station
        const nearestPolice = policeStations[0];
        if (nearestPolice) {
            const dist = calculateDistance(point, nearestPolice);
            if (dist < 500) totalBonus += 15; // Very close
            else if (dist < 1000) totalBonus += 10;
            else if (dist < 2000) totalBonus += 5;
        }

        // Find nearest hospital
        const nearestHospital = hospitals[0];
        if (nearestHospital) {
            const dist = calculateDistance(point, nearestHospital);
            if (dist < 500) totalBonus += 10;
            else if (dist < 1000) totalBonus += 7;
            else if (dist < 2000) totalBonus += 3;
        }
    });

    // Average bonus across route
    return Math.min(20, totalBonus / routePoints.length);
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
