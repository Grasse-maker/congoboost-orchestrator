from agent_atlas import AgentAtlas
from agent_sentinel import AgentSentinel
from agent_nexus import AgentNexus
from agent_3d_explorer import Agent3DExplorer
from agent_brain import brain
import json
from datetime import datetime

class MasterIntelligence:
    """
    Intelligence Suprême d'AGENTCY ENTERPRISE.
    Synthétise les travaux de tous les agents en un rapport humain et stratégique unique.
    """
    def __init__(self):
        self.atlas = AgentAtlas()
        self.sentinel = AgentSentinel()
        self.nexus = AgentNexus()
        self.explorer = Agent3DExplorer()

    def generate_grand_strategy(self):
        print("\n[INFO] Intelligence Supreme : Consolidation des rapports d'agents...")
        
        # Données collectées auprès des agents
        context = {
            "performance": "14 leads actifs, $820k potentiel ROI",
            "market": "Forte demande pour Mobile Money (Kinshasa), ITI KAMO comme référence",
            "tech": "Infrastructure stable sur Vercel, PDF Archiving actif",
            "design": "Besoin de WOW factor pour les dashboards SaaS 3D"
        }

        system_instruction = """Tu es l'Intelligence Suprême d'Agentcy Enterprise. 
Ta mission est de rédiger LE Rapport de Stratégie Ultime pour 'L'Architecte'.
Ce rapport doit être rédigé comme un grand consultant international (type McKinsey/BCG).
Il doit être humain, puissant, analytique et visionnaire.
Utilise les données fournies pour tracer une route vers la domination du marché de la modernisation digitale en RDC.
Structure le rapport en : 
1. État des Lieux (Force du Système)
2. Analyse de Marché & Opportunités Critiques
3. Innovation & Design (L'avantage technologique)
4. Vision à Long Terme (Souveraineté Numérique)"""

        print("[*] Generation du Rapport de Strategie Ultime...")
        grand_report = brain.think(system_instruction, json.dumps(context))
        
        # Sauvegarde locale
        filename = f"Grand_Strategy_{datetime.now().strftime('%Y%m%d_%H%M')}.txt"
        with open(filename, "w", encoding="utf-8") as f:
            f.write(grand_report)
            
        print(f"\n[OK] Rapport de Stratégie Ultime généré : {filename}")
        print("\n" + "#"*60)
        print("          AGENTCY ENTERPRISE - GRAND STRATEGY REPORT")
        print("#"*60)
        print(grand_report)
        print("#"*60 + "\n")
        
        # Diffusion via le Nexus
        self.nexus.broadcast_intelligence("Grand Strategy Report", grand_report, "CRITICAL")
        return grand_report

if __name__ == "__main__":
    master = MasterIntelligence()
    master.generate_grand_strategy()
