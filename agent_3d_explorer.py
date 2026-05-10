import json
import time
from datetime import datetime

class Agent3DExplorer:
    """
    Agent 3D Explorer - Agentcy Enterprise
    Role : Explore les tendances du web 3D et propose des prototypes interactifs.
    """

    def __init__(self):
        self.knowledge_base = "3d_design_trends.json"
        self.suggestions_file = "designer_instructions.json" # Partagé avec l'Agent Designer

    def explore_trends(self):
        print(f"[{datetime.now().strftime('%H:%M:%S')}] [3D] Agent 3D Explorer : Analyse des tendances WebGL via l'IA Brain...")
        from agent_brain import brain
        
        system_instruction = """Tu es l'explorateur 3D d'Agentcy Enterprise. 
Ta mission est d'analyser les tendances du design web (Three.js, WebGL, UI interactive) 
et de proposer des concepts de prototypes qui vont 'impressionner' (WOW factor) les clients de l'agence.
Rédige tes suggestions de manière technique mais inspirante. 
Donne 2 ou 3 concepts précis avec la technologie à utiliser et l'impact visuel attendu."""

        user_input = "Quelles sont les meilleures tendances UI/UX 3D pour un tableau de bord SaaS premium en 2026 ?"
        
        report = brain.think(system_instruction, user_input)
        
        print("\n" + "="*50)
        print("EXPLORATEUR 3D - CONCEPTS INNOVANTS")
        print("="*50)
        print(report)
        print("="*50 + "\n")

        # Extraction simplifiée des tendances pour le Designer (simulation)
        # Dans un cas réel, on pourrait demander à l'IA de formater un JSON précis.
        self.apply_suggestions([{"type": "IA Generated Concept", "tech": "Three.js/GLSL", "impact": "Premium"}])

    def apply_suggestions(self, trends):
        print("[*] Agent 3D Explorer : Génération de prototypes pour le site...")
        
        # Envoi des idées à l'Agent Designer
        with open(self.suggestions_file, "r") as f:
            current_tasks = json.load(f)
        
        for t in trends:
            task = f"Prototype {t['type']} : Utiliser {t['tech']} pour créer un effet {t['impact']}."
            if task not in current_tasks['tasks']:
                current_tasks['tasks'].append(task)
        
        with open(self.suggestions_file, "w") as f:
            json.dump(current_tasks, f, indent=4)
            
        print("[OK] Prototypes envoyés à la file d'attente du Designer.")

if __name__ == "__main__":
    explorer = Agent3DExplorer()
    explorer.explore_trends()
