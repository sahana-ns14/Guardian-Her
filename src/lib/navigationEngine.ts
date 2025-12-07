// src/lib/navigationEngine.ts
// Turn-by-turn navigation and danger detection

import type { RoutePoint } from './routingService';

export interface NavigationInstruction {
    id: string;
    type: 'start' | 'turn' | 'continue' | 'arrive';
    direction?: 'left' | 'right' | 'straight';
    distance: number; // meters to this instruction
    text: string;
    position: RoutePoint;
}

export interface DangerAlert {
    id: string;
    type: 'crime' | 'lighting' | 'crowd' | 'reroute';
    severity: 'low' | 'medium' | 'high';
    message: string;
    distance: number; // meters ahead
    position: RoutePoint;
}

/**
 * Generate turn-by-turn instructions from route coordinates
 * In production, use OpenRouteService's instruction API
 */
export function generateInstructions(coordinates: RoutePoint[], totalDistance: number): NavigationInstruction[] {
    const instructions: NavigationInstruction[] = [];

    // Start instruction
    instructions.push({
        id: 'start',
        type: 'start',
        distance: 0,
        text: 'Start your journey',
        position: coordinates[0]
    });

    // Generate intermediate instructions (simplified)
    // In production, parse actual turn points from routing API
    const segmentLength = Math.floor(coordinates.length / 4);
    for (let i = 1; i < 4; i++) {
        const idx = i * segmentLength;
        if (idx < coordinates.length) {
            instructions.push({
                id: `turn-${i}`,
                type: 'continue',
                direction: 'straight',
                distance: (totalDistance / 4) * i,
                text: `Continue for ${Math.round((totalDistance / 4) * (i + 1))} meters`,
                position: coordinates[idx]
            });
        }
    }

    // Arrival instruction
    instructions.push({
        id: 'arrive',
        type: 'arrive',
        distance: totalDistance,
        text: 'You have arrived at your destination',
        position: coordinates[coordinates.length - 1]
    });

    return instructions;
}

/**
 * Check for dangers along the route
 * In production, use real crime/lighting/crowd data
 */
export function detectDangers(
    _currentPosition: RoutePoint,
    upcomingRoute: RoutePoint[],
    safetyData: {
        crimeScore: number;
        lightingScore: number;
        crowdScore: number;
    }
): DangerAlert[] {
    const alerts: DangerAlert[] = [];
    const now = new Date().getHours();
    const isNightTime = now < 6 || now > 20;

    // High crime zone alert
    if (safetyData.crimeScore > 60) {
        alerts.push({
            id: 'crime-alert',
            type: 'crime',
            severity: safetyData.crimeScore > 80 ? 'high' : 'medium',
            message: 'High-risk zone ahead. Stay alert and consider alternate route.',
            distance: 200,
            position: upcomingRoute[0]
        });
    }

    // Poor lighting alert (nighttime only)
    if (isNightTime && safetyData.lightingScore < 40) {
        alerts.push({
            id: 'lighting-alert',
            type: 'lighting',
            severity: safetyData.lightingScore < 20 ? 'high' : 'medium',
            message: 'Dark road detected ahead. Use flashlight and stay vigilant.',
            distance: 150,
            position: upcomingRoute[0]
        });
    }

    // Low crowd density alert
    if (safetyData.crowdScore < 30) {
        alerts.push({
            id: 'crowd-alert',
            type: 'crowd',
            severity: 'low',
            message: 'Low crowd density area. Share your live location with contacts.',
            distance: 100,
            position: upcomingRoute[0]
        });
    }

    return alerts;
}

/**
 * Calculate distance between current position and next instruction
 */
export function getDistanceToNextInstruction(
    currentPosition: RoutePoint,
    nextInstruction: NavigationInstruction
): number {
    const R = 6371e3; // Earth radius in meters
    const φ1 = currentPosition.lat * Math.PI / 180;
    const φ2 = nextInstruction.position.lat * Math.PI / 180;
    const Δφ = (nextInstruction.position.lat - currentPosition.lat) * Math.PI / 180;
    const Δλ = (nextInstruction.position.lng - currentPosition.lng) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

/**
 * Text-to-speech for navigation instructions
 */
export function speakInstruction(text: string) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;
        window.speechSynthesis.speak(utterance);
    }
}

/**
 * Format distance for display
 */
export function formatNavigationDistance(meters: number): string {
    if (meters < 100) {
        return `${Math.round(meters / 10) * 10} m`;
    } else if (meters < 1000) {
        return `${Math.round(meters / 50) * 50} m`;
    } else {
        return `${(meters / 1000).toFixed(1)} km`;
    }
}
