"""
Guardian-Her Machine Learning Safety Classifier & Route Risk Analyzer
Author: Sahana N S
Language: Python 3.10+
Description: Machine Learning classifier for calculating route safety scores,
evaluating lighting parameters, foot traffic density, and historical safety reports.
"""

import math
import numpy as np
from typing import List, Dict, Tuple, Any

class RouteSafetyClassifier:
    """
    Machine Learning feature extractor and multi-variable hazard classifier.
    """
    
    def __init__(self):
        # Feature weights derived from urban safety analysis
        self.weights = {
            "street_lighting": 0.35,
            "foot_traffic_density": 0.25,
            "open_businesses": 0.20,
            "cctv_coverage": 0.10,
            "crime_incident_rate": 0.10
        }

    def normalize_features(self, raw_features: Dict[str, float]) -> Dict[str, float]:
        """
        Normalizes raw sensor and geotagged inputs to 0.0 - 1.0 range.
        """
        return {
            "street_lighting": min(1.0, max(0.0, raw_features.get("lighting_lux", 50.0) / 100.0)),
            "foot_traffic_density": min(1.0, max(0.0, raw_features.get("pedestrians_per_min", 10.0) / 50.0)),
            "open_businesses": min(1.0, max(0.0, raw_features.get("open_shops_count", 5.0) / 20.0)),
            "cctv_coverage": 1.0 if raw_features.get("has_cctv", False) else 0.0,
            "crime_incident_rate": max(0.0, 1.0 - (raw_features.get("historical_incidents_30d", 0) / 10.0))
        }

    def compute_safety_score(self, raw_features: Dict[str, float]) -> Dict[str, Any]:
        """
        Computes comprehensive safety index (0 to 100) and risk breakdown.
        """
        norm = self.normalize_features(raw_features)
        
        raw_score = sum(norm[feat] * weight for feat, weight in self.weights.items())
        final_score = round(raw_score * 100.0, 1)

        if final_score >= 80.0:
            risk_level = "LOW_RISK"
            status_text = "Safe Route — High Foot Traffic & Well Lit"
            color_code = "#10B981"
        elif final_score >= 55.0:
            risk_level = "MEDIUM_RISK"
            status_text = "Moderate Caution — Stay Alert"
            color_code = "#F59E0B"
        else:
            risk_level = "HIGH_RISK"
            status_text = "High Hazard — Escort / Alternative Recommended"
            color_code = "#EF4444"

        return {
            "safety_score": final_score,
            "risk_level": risk_level,
            "status_text": status_text,
            "color_code": color_code,
            "feature_breakdown": norm
        }

    def evaluate_route_waypoints(self, waypoints: List[Dict[str, float]]) -> Dict[str, Any]:
        """
        Evaluates an entire route consisting of multiple GPS coordinates.
        """
        waypoint_scores = []
        for wp in waypoints:
            score_data = self.compute_safety_score(wp)
            waypoint_scores.append(score_data["safety_score"])

        avg_safety = round(float(np.mean(waypoint_scores)), 1)
        min_safety = round(float(np.min(waypoint_scores)), 1)

        return {
            "overall_safety_score": avg_safety,
            "minimum_safety_point": min_safety,
            "total_waypoints_evaluated": len(waypoints),
            "route_status": "APPROVED" if min_safety >= 50.0 else "ALTERNATIVE_REQUIRED"
        }

if __name__ == "__main__":
    classifier = RouteSafetyClassifier()
    sample_waypoint = {
        "lighting_lux": 85.0,
        "pedestrians_per_min": 25.0,
        "open_shops_count": 12.0,
        "has_cctv": True,
        "historical_incidents_30d": 1
    }
    result = classifier.compute_safety_score(sample_waypoint)
    print("Safety Classifier Output:", result)
