"""
Guardian-Her AI Safety Companion & Route Risk Prediction Service
Author: Sahana N S
Language: Python 3.10+
Description: Machine Learning and NLP model module for safety risk scoring,
route hazard evaluation, and natural language sentiment analysis.
"""

import math
import json
import typing

class SafetyScorerAI:
    def __init__(self, model_version: str = "v1.2"):
        self.model_version = model_version
        self.risk_factors = {
            "low_lighting": 0.35,
            "crime_history": 0.45,
            "isolation_level": 0.20
        }

    def predict_route_safety(self, lighting_score: float, crime_density: float, foot_traffic: float) -> dict:
        """
        Predict safety index (0 to 100%) for a given route segment using ML weighting.
        """
        weighted_risk = (
            (10.0 - lighting_score) * self.risk_factors["low_lighting"] +
            (crime_density * 10.0) * self.risk_factors["crime_history"] +
            (10.0 - foot_traffic) * self.risk_factors["isolation_level"]
        )
        
        # Calculate overall safety percentage (0-100)
        safety_score = max(0.0, min(100.0, 100.0 - (weighted_risk * 8.5)))
        
        rating = "Very Safe" if safety_score >= 80 else ("Moderate" if safety_score >= 55 else "High Caution Required")
        
        return {
            "safety_score": round(safety_score, 1),
            "rating": rating,
            "recommended_escort": safety_score < 60.0,
            "model_version": self.model_version
        }

    def analyze_safety_sentiment(self, user_message: str) -> dict:
        """
        NLP Sentiment & Distress Classifier for Safety Chatbot Companion.
        Detects emergency keywords and distress levels in real-time.
        """
        distress_keywords = ["follow", "scared", "dark", "help", "danger", "stalker", "unsafe", "alone", "emergency"]
        tokens = [word.lower().strip(".,!?") for word in user_message.split()]
        
        matched_distress = [word for word in tokens if word in distress_keywords]
        is_distress = len(matched_distress) > 0
        
        return {
            "is_distress": is_distress,
            "distress_level": "HIGH" if len(matched_distress) >= 2 else ("MEDIUM" if is_distress else "NORMAL"),
            "matched_keywords": matched_distress,
            "suggest_sos": len(matched_distress) >= 2
        }

if __name__ == "__main__":
    ai = SafetyScorerAI()
    print("AI Safety Engine Initialized successfully.")
    sample_route = ai.predict_route_safety(lighting_score=8.5, crime_density=0.1, foot_traffic=7.0)
    print(f"Sample Route Safety: {sample_route}")
