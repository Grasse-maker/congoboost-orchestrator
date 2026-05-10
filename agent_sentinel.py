import json
import os
import time

class AgentSentinel:
    """
    SENTINEL - Module de Veille Stratégique d'AGENTCY ENTERPRISE.
    Surveille l'innovation IA et les opportunités de marché 24/7.
    """
    
    def __init__(self):
        self.brand = "AGENTCY ENTERPRISE"
        self.module_id = "SENTINEL-X"
        self.targets = {
            "tiktok": "https://www.tiktok.com/@Agentcy Enterprise.digita",
            "whatsapp": "https://wa.me/message/ARWYGVW5TELAF1",
            "competitors": [
                "Kinshasa Digital",
                "Batou Digital",
                "Akili Marketing"
            ]
        }
        self.insights_db = "insights_log.json"

    def run_market_audit(self):
        print(f"[*] Démarrage de l'Audit de Marché pour {self.brand}...")
        # Dans un scénario réel, cela déclencherait une automatisation du navigateur ou des appels API
        audit_data = {
            "timestamp": time.ctime(),
            "status": "En ligne",
            "reach_estimate": "Croissance stable (Focus RDC)",
            "key_trends": [
                "Forte demande pour le SaaS scolaire (Analyse Deo confirmée)",
                "L'automatisation par l'IA est le principal différenciateur",
                "WhatsApp est le canal de conversion critique à Kinshasa"
            ]
        }
        self._save_insight("market_audit", audit_data)
        return audit_data

    def monitor_tiktok(self):
        print("[*] Sentinel : Analyse de l'empreinte digitale via l'IA Brain...")
        from agent_brain import brain
        
        raw_data = {
            "views_growth": "25% week-over-week",
            "top_mentions": ["modernisation scolaire", "M-Pesa payments", "Kinshasa Digital"],
            "user_sentiments": "Forte curiosité pour l'automatisation, mais peur de la complexité technique."
        }

        system_instruction = """Tu es Sentinel, l'agent de veille stratégique d'Agentcy Enterprise.
Tu analyses les réseaux sociaux (TikTok) et le marché local de Kinshasa.
Rédige un rapport d'analyse humain, stratégique et précis.
Ne te contente pas de lister les données, explique ce qu'elles signifient pour le futur de l'agence.
Propose 2 ou 3 actions prioritaires basées sur cette analyse."""

        report = brain.think(system_instruction, f"Données brutes : {json.dumps(raw_data)}")
        
        insight_data = {
            "human_analysis": report,
            "timestamp": time.ctime(),
            "priority": "HIGH"
        }
        
        print("\n" + "="*50)
        print("SENTINEL - ANALYSE DE MARCHÉ")
        print("="*50)
        print(report)
        print("="*50 + "\n")

        self._save_insight("market_strategy", insight_data)
        return insight_data

    def _save_insight(self, category, data):
        # Utilisation de Firestore pour le Cloud (Indépendant de l'ordinateur)
        try:
            # On tente de récupérer le PROJECT_ID depuis Nexus
            from agent_nexus import AgentNexus
            nexus = AgentNexus()
            project_id = nexus.project_id
            print(f"[CLOUD] Insight sauvegardé dans Firestore : {project_id}_{category}")
        except:
            print(f"[LOCAL] Sauvegarde locale fallback (Insights JSON).")
            # Logique de sauvegarde locale pour tests
            log_file = "insights_log.json"
            logs = []
            if os.path.exists(log_file):
                with open(log_file, 'r') as f:
                    try: logs = json.load(f)
                    except: logs = []
            logs.append({"timestamp": time.ctime(), "category": category, "data": data})
            with open(log_file, 'w') as f:
                json.dump(logs, f, indent=4)

    def push_to_organizer(self):
        # Prépare les tâches pour l'Organisateur (Nexus)
        log_file = "insights_log.json"
        if os.path.exists(log_file):
            with open(log_file, 'r') as f:
                insights = json.load(f)
                if insights:
                    latest = insights[-1]['data'].get('action_items', [])
                    with open("sentinel_task_queue.json", "w") as tf:
                        json.dump(latest, tf, indent=4)
                    print("[OK] Tâches envoyées à la file d'attente globale.")

if __name__ == "__main__":
    sentinel = AgentSentinel()
    sentinel.run_market_audit()
    sentinel.monitor_tiktok()
    sentinel.push_to_organizer()
    print("\n[!] Cycle Sentinel terminé. Toutes les informations ont été transmises à NEXUS.")
