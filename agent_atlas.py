import json
import datetime
from agent_nexus import AgentNexus

class AgentAtlas:
    """
    ATLAS - Module d'Analyse Business & Stratégie d'AGENTCY ENTERPRISE.
    Synthétise les données complexes en opportunités concrètes.
    """
    def __init__(self):
        self.brand = "AGENTCY ENTERPRISE"
        self.nexus = AgentNexus()

    def generate_executive_briefing(self):
        """
        Génère le briefing stratégique matinal pour l'Architecte via l'IA Brain.
        """
        from agent_brain import brain
        
        # Données réelles simulées
        metrics = {
            "date": datetime.datetime.now().strftime('%d/%m/%Y'),
            "leads_active": 14,
            "audits_performed": 48,
            "avg_loss": 19200,
            "market_roi_potential": 820000,
            "focus_sectors": ["Education (ITI KAMO)", "Logistique", "Santé"]
        }

        system_instruction = """Tu es le Cerveau d'Atlas, le module d'analyse d'Agentcy Enterprise.
Ta mission est de rédiger un briefing stratégique pour 'L'Architecte' (le dirigeant).
Le ton doit être extrêmement professionnel, humain, précis et inspirant. Ne sois pas robotique.
Analyse les chiffres, souligne les opportunités et propose des actions concrètes basées sur les secteurs prioritaires.
Structure ton rapport avec des sections claires et des points stratégiques."""

        user_data = f"Voici les métriques du jour : {json.dumps(metrics)}"
        
        print("[*] Atlas : Réflexion stratégique en cours via Gemini...")
        report = brain.think(system_instruction, user_data)
        
        print("\n" + "="*50)
        print("RAPPORT STRATÉGIQUE ATLAS")
        print("="*50)
        print(report)
        print("="*50 + "\n")
        
        return self.nexus.broadcast_intelligence("Morning Strategic Report", report, "HIGH")

if __name__ == "__main__":
    atlas = AgentAtlas()
    atlas.generate_executive_briefing()
