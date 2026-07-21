"""
Guardian-Her Safety Analytics & Data Processing Pipeline
Author: Sahana N S
Language: Python 3.10+
Description: Data ETL pipeline for cleaning, ingesting, and modeling urban safety reports,
geofencing coordinates, and emergency alert statistics.
"""

import json
import csv
from typing import List, Dict, Any, Tuple

class SafetyDataPipeline:
    def __init__(self):
        self.processed_records_count = 0

    def clean_coordinates(self, lat: float, lng: float) -> Tuple[float, float]:
        """
        Validates and formats latitude and longitude to standard 6 decimal places.
        """
        valid_lat = round(max(-90.0, min(90.0, lat)), 6)
        valid_lng = round(max(-180.0, min(180.0, lng)), 6)
        return valid_lat, valid_lng

    def process_incident_reports(self, raw_incidents: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        ETL process to clean and filter user-submitted safety incident reports.
        """
        cleaned = []
        for inc in raw_incidents:
            lat, lng = self.clean_coordinates(inc.get("lat", 0.0), inc.get("lng", 0.0))
            category = str(inc.get("category", "General Concern")).strip()
            severity = max(1, min(5, int(inc.get("severity", 1))))
            
            cleaned.append({
                "id": inc.get("id"),
                "latitude": lat,
                "longitude": lng,
                "category": category,
                "severity": severity,
                "timestamp": inc.get("timestamp")
            })
            self.processed_records_count += 1
            
        return cleaned

    def generate_heatmap_geojson(self, incidents: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Converts incident data to standard GeoJSON format for heatmap rendering.
        """
        features = []
        for inc in incidents:
            feature = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [inc["longitude"], inc["latitude"]]
                },
                "properties": {
                    "category": inc["category"],
                    "weight": inc["severity"] / 5.0
                }
            }
            features.append(feature)

        return {
            "type": "FeatureCollection",
            "features": features
        }

if __name__ == "__main__":
    pipeline = SafetyDataPipeline()
    sample_raw = [
        {"id": "inc_01", "lat": 12.9716, "lng": 77.5946, "category": "Low Lighting", "severity": 4},
        {"id": "inc_02", "lat": 12.9352, "lng": 77.6245, "category": "Harassment Zone", "severity": 5}
    ]
    cleaned = pipeline.process_incident_reports(sample_raw)
    heatmap = pipeline.generate_heatmap_geojson(cleaned)
    print("Pipeline Processed Heatmap GeoJSON:", json.dumps(heatmap, indent=2))
