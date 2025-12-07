// src/lib/geocoding.ts
// Geocoding service for address search and autocomplete

export interface SearchResult {
    id: string;
    name: string;
    displayName: string;
    lat: number;
    lng: number;
    type: string;
}

/**
 * Search for locations using Nominatim (OpenStreetMap geocoding)
 * Free and no API key required
 */
export async function searchLocation(query: string, userLat?: number, userLng?: number): Promise<SearchResult[]> {
    if (!query || query.length < 3) return [];

    try {
        const params = new URLSearchParams({
            q: query,
            format: 'json',
            addressdetails: '1',
            limit: '5',
            countrycodes: 'in', // Focus on India
            ...(userLat && userLng ? {
                lat: userLat.toString(),
                lon: userLng.toString()
            } : {})
        });

        console.log('Searching for:', query);

        const response = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
            console.error('Geocoding API error:', response.status);
            throw new Error('Geocoding failed');
        }

        const data = await response.json();
        console.log('Search results:', data);

        if (!data || data.length === 0) {
            // Return mock results for common searches
            return getMockSearchResults(query, userLat, userLng);
        }

        return data.map((item: any, index: number) => ({
            id: `result-${index}`,
            name: item.name || item.display_name.split(',')[0],
            displayName: item.display_name,
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
            type: item.type || 'location'
        }));

    } catch (error) {
        console.error('Geocoding error:', error);
        // Return mock results as fallback
        return getMockSearchResults(query, userLat, userLng);
    }
}

/**
 * Mock search results for common queries (fallback)
 */
function getMockSearchResults(query: string, userLat?: number, userLng?: number): SearchResult[] {
    const q = query.toLowerCase();
    const mockData: SearchResult[] = [];

    // Default to Bangalore if no user location
    const baseLat = userLat || 12.9716;
    const baseLng = userLng || 77.5946;

    // Common locations in Bangalore
    const bangaloreLocations = [
        { name: 'Koramangala', lat: 12.9352, lng: 77.6245 },
        { name: 'Indiranagar', lat: 12.9716, lng: 77.6412 },
        { name: 'Whitefield', lat: 12.9698, lng: 77.7499 },
        { name: 'HSR Layout', lat: 12.9121, lng: 77.6446 },
        { name: 'MG Road', lat: 12.9759, lng: 77.6061 },
        { name: 'Jayanagar', lat: 12.9250, lng: 77.5838 },
        { name: 'Marathahalli', lat: 12.9591, lng: 77.6974 },
        { name: 'Electronic City', lat: 12.8456, lng: 77.6603 },
        { name: 'Yelahanka', lat: 13.1007, lng: 77.5963 },
        { name: 'Banashankari', lat: 12.9250, lng: 77.5481 }
    ];

    // Hospitals
    if (q.includes('hospital') || q.includes('medical') || q.includes('clinic')) {
        mockData.push(
            { id: 'm1', name: 'Manipal Hospital', displayName: 'Manipal Hospital, HAL Airport Road, Bangalore', lat: 12.9698, lng: 77.7499, type: 'hospital' },
            { id: 'm2', name: 'Apollo Hospital', displayName: 'Apollo Hospital, Bannerghatta Road, Bangalore', lat: 12.9141, lng: 77.6101, type: 'hospital' },
            { id: 'm3', name: 'Fortis Hospital', displayName: 'Fortis Hospital, Cunningham Road, Bangalore', lat: 12.9941, lng: 77.5946, type: 'hospital' }
        );
    }

    // Police stations
    if (q.includes('police') || q.includes('station')) {
        mockData.push(
            { id: 'p1', name: 'Koramangala Police Station', displayName: 'Koramangala Police Station, Bangalore', lat: 12.9352, lng: 77.6245, type: 'police' },
            { id: 'p2', name: 'Indiranagar Police Station', displayName: 'Indiranagar Police Station, Bangalore', lat: 12.9716, lng: 77.6412, type: 'police' }
        );
    }

    // Match by name
    bangaloreLocations.forEach((loc, idx) => {
        if (loc.name.toLowerCase().includes(q) || q.includes(loc.name.toLowerCase())) {
            mockData.push({
                id: `loc-${idx}`,
                name: loc.name,
                displayName: `${loc.name}, Bangalore, Karnataka, India`,
                lat: loc.lat,
                lng: loc.lng,
                type: 'locality'
            });
        }
    });

    // If still no results, return nearby generic locations
    if (mockData.length === 0) {
        mockData.push({
            id: 'nearby-1',
            name: query,
            displayName: `${query}, Near You`,
            lat: baseLat + (Math.random() - 0.5) * 0.02,
            lng: baseLng + (Math.random() - 0.5) * 0.02,
            type: 'location'
        });
    }

    return mockData.slice(0, 5);
}

/**
 * Reverse geocode coordinates to address
 */
export async function reverseGeocode(lat: number, lng: number): Promise<string> {
    try {
        const params = new URLSearchParams({
            lat: lat.toString(),
            lon: lng.toString(),
            format: 'json'
        });

        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?${params}`, {
            headers: {
                'User-Agent': 'Guardian-Her Safety App'
            }
        });

        if (!response.ok) {
            throw new Error('Reverse geocoding failed');
        }

        const data = await response.json();
        return data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

    } catch (error) {
        console.error('Reverse geocoding error:', error);
        return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
}
