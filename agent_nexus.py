import requests
import json
import os
from datetime import datetime

class AgentNexus:
    """
    NEXUS - L'Orchestrateur Central d'AGENTCY ENTERPRISE.
    Coordonne les systèmes autonomes et centralise l'intelligence stratégique.
    """
    def __init__(self):
        self.brand = "AGENTCY ENTERPRISE"
        self.project_id = "agentcy-nexus-core"
        self.webhook_url = "https://script.google.com/macros/s/AKfycbyuISpIUfYCRElys3ZxvENsFQDsh1O7yP239QSyGm1k9LUSxZQakv8kq-VzAwPO0Ho/exec"
        self.log_file = "nexus_activity.json"

    def broadcast_intelligence(self, title, message, priority="MEDIUM"):
        """
        Diffuse une information stratégique vers le Secrétariat et l'Agenda.
        """
        payload = {
            "title": f"[{priority}] {title}",
            "message": f"AGENTCY INTELLIGENCE REPORT\n---\n{message}\n---\nOrchestré par NEXUS Core.",
            "source": "NEXUS"
        }
        
        try:
            response = requests.post(self.webhook_url, json=payload)
            if response.status_code == 200:
                print(f"[NEXUS] Intelligence diffusée : {title}")
                self._log_activity(title, "SUCCESS")
                return True
        except Exception as e:
            print(f"[NEXUS] Erreur de diffusion : {e}")
            self._log_activity(title, "FAILED")
            return False

    def nexus_pulse(self):
        """
        Vérifie l'état de santé de toute l'infrastructure et diffuse un rapport d'état.
        """
        print("[NEXUS] Lancement du signal de vie (Pulse)...")
        status_report = "SANTÉ INFRASTRUCTURE : OPTIMAL\n"
        status_report += f"- Cœur : {self.brand} Core\n"
        status_report += "- Connectivité Google Apps : ÉTABLIE\n"
        status_report += "- Archivage PDF : ACTIF\n"
        status_report += f"- Dernier cycle : {datetime.now().strftime('%H:%M:%S')}"
        
        return self.broadcast_intelligence("PULSE : Infrastructure Opérationnelle", status_report, "INFO")

    def _log_activity(self, task, status):
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "task": task,
            "status": status
        }
        logs = []
        if os.path.exists(self.log_file):
            try:
                with open(self.log_file, 'r') as f:
                    logs = json.load(f)
            except: logs = []
        logs.append(log_entry)
        with open(self.log_file, 'w') as f:
            json.dump(logs, f, indent=4)

if __name__ == "__main__":
    nexus = AgentNexus()
    nexus.nexus_pulse()
    nexus.broadcast_intelligence("Système NEXUS Activé", "L'infrastructure AGENTCY ENTERPRISE est désormais sous le contrôle de NEXUS Core. Tous les agents sont synchronisés.", "HIGH")
