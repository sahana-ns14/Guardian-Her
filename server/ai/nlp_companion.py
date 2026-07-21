"""
Guardian-Her NLP Safety Companion Engine
Author: Sahana N S
Language: Python 3.10+
Description: Intelligent Natural Language Processing engine for emergency intent detection,
distress signal parsing, and real-time supportive safety conversations.
"""

import re
import math
import json
from typing import List, Dict, Tuple, Optional

class SafetyNLPEngine:
    """
    Advanced Natural Language Processing engine for real-time safety companion interaction,
    intent classification, and emergency threat detection.
    """
    
    INTENT_PATTERNS = {
        "emergency_sos": [
            r"\b(help|sos|danger|emergency|attacked|threat|save me|scared)\b",
            r"\b(someone is following|being followed|stalker|chasing)\b",
            r"\b(call police|call 112|send help|need help now)\b"
        ],
        "unsafe_location": [
            r"\b(dark|isolated|no lights|creepy|unsafe|suspicious)\b",
            r"\b(fear|afraid|lonely road|deserted|sketchy)\b"
        ],
        "checkin_timer": [
            r"\b(timer|check-in|track me|monitor|alarm|notify mom)\b"
        ],
        "general_guidance": [
            r"\b(safe route|navigation|police station|hospital|shelter)\b"
        ]
    }

    EMERGENCY_RESPONSES = {
        "emergency_sos": (
            "🚨 EMERGENCY DISTRESS DETECTED! Triggering One-Touch SOS Alert right now. "
            "Stay calm, your live location and emergency beacon are being broadcasted to your trusted contacts."
        ),
        "unsafe_location": (
            "⚠️ You reported feeling unsafe in your current location. "
            "We recommend staying on well-lit streets and enabling Live Check-In Monitoring immediately."
        ),
        "checkin_timer": (
            "⏱️ Check-In timer assistance active. Setting up automatic safety check-in countdown."
        ),
        "general_guidance": (
            "🛡️ Guardian-Her Safety Assistant: I can guide you to nearest safe zones, verified police stations, "
            "or generate a well-lit safe route."
        )
    }

    def __init__(self, confidence_threshold: float = 0.65):
        self.confidence_threshold = confidence_threshold
        self.conversation_history: List[Dict[str, str]] = []

    def classify_intent(self, user_text: str) -> Tuple[str, float]:
        """
        Classifies the user's message into specific safety intents with confidence scoring.
        """
        text_clean = user_text.lower().strip()
        matched_scores: Dict[str, float] = {}

        for intent, patterns in self.INTENT_PATTERNS.items():
            score = 0.0
            for pattern in patterns:
                matches = re.findall(pattern, text_clean)
                score += len(matches) * 0.4
            if score > 0:
                matched_scores[intent] = min(1.0, score)

        if not matched_scores:
            return "general_guidance", 0.5

        best_intent = max(matched_scores, key=matched_scores.get)
        return best_intent, matched_scores[best_intent]

    def generate_response(self, user_text: str) -> Dict[str, typing.Any]:
        """
        Processes incoming message and returns structured safety response.
        """
        intent, confidence = self.classify_intent(user_text)
        response_text = self.EMERGENCY_RESPONSES.get(intent, self.EMERGENCY_RESPONSES["general_guidance"])
        
        is_sos_triggered = intent == "emergency_sos" and confidence >= self.confidence_threshold

        self.conversation_history.append({"user": user_text, "assistant": response_text})

        return {
            "intent": intent,
            "confidence": round(confidence, 2),
            "response": response_text,
            "trigger_sos": is_sos_triggered,
            "recommended_actions": self._get_recommended_actions(intent)
        }

    def _get_recommended_actions(self, intent: str) -> List[str]:
        if intent == "emergency_sos":
            return ["Call 112 / Police", "Broadcast Live GPS Location", "Alert Family Contacts"]
        elif intent == "unsafe_location":
            return ["Navigate to Safe Route", "Start 10-Min Check-In Timer", "Share Trip Status"]
        return ["View Crime Heatmap", "Explore Safe Havens", "Configure Trusted Contacts"]


if __name__ == "__main__":
    nlp = SafetyNLPEngine()
    test_msg = "Someone is following me on a dark road, help!"
    result = nlp.generate_response(test_msg)
    print("NLP Test Result:", json.dumps(result, indent=2))
