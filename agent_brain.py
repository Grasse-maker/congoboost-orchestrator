import requests
import os
import json

class AgentBrain:
    """
    Module de Réflexion Centralisé pour AGENTCY ENTERPRISE.
    Permet aux agents d'utiliser l'IA pour générer des rapports stratégiques et humains.
    """
    def __init__(self):
        # On utilise la même clé que pour Vercel (injectée dans l'environnement)
        self.api_key = os.getenv("GEMINI_API_KEY")
        self.model = "gemini-flash-latest"
        self.url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent?key={self.api_key}"

    def think(self, system_instruction, user_input):
        """
        Génère une réponse intelligente basée sur une instruction système et des données.
        """
        if not self.api_key:
            return "ERREUR : Clé GEMINI_API_KEY non configurée. Impossible de générer un rapport intelligent."

        payload = {
            "system_instruction": {
                "parts": [{"text": system_instruction}]
            },
            "contents": [
                {
                    "role": "user",
                    "parts": [{"text": user_input}]
                }
            ],
            "generationConfig": {
                "temperature": 0.8,
                "maxOutputTokens": 1024
            }
        }

        try:
            response = requests.post(self.url, json=payload)
            if response.status_code == 200:
                data = response.json()
                if 'candidates' in data and len(data['candidates']) > 0:
                    return data['candidates'][0]['content']['parts'][0]['text']
            return f"Erreur IA ({response.status_code}): {response.text}"
        except Exception as e:
            return f"Exception Brain : {str(e)}"

# Singleton pour un accès facile
brain = AgentBrain()
