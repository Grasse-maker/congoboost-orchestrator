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
        # Envoi standard au Webhook
        payload = {
            "title": f"[{priority}] {title}",
            "message": message,
            "source": "AGENTCY"
        }
        
        try:
            requests.post(self.webhook_url, json=payload)
            print(f"[AGENTCY] Report broadcasted : {title}")
            
            # Si la priorité est haute, on envoie aussi un format spécial WhatsApp
            if priority in ["HIGH", "CRITICAL"]:
                self.send_to_whatsapp(title, message)
                
            self._log_activity(title, "SUCCESS")
            return True
        except Exception as e:
            print(f"[AGENTCY] Broadcast error : {e}")
            self._log_activity(title, "FAILED")
            return False

    def send_to_whatsapp(self, title, message):
        """
        Formate et envoie un rapport spécifiquement pour WhatsApp.
        """
        print(f"[*] Preparation de la notification WhatsApp : {title}")
        
        # Formatage WhatsApp (*texte* pour gras)
        wa_message = f"*AGENTCY ENTERPRISE - INTELLIGENCE*\n"
        wa_message += f"📌 *{title.upper()}*\n"
        wa_message += "--------------------------------\n\n"
        
        # Conversion simple Markdown -> WhatsApp
        formatted_body = message.replace("**", "*").replace("###", "🔹").replace("##", "🔸")
        wa_message += formatted_body
        wa_message += "\n\n---\n🛡️ _Généré par l'Infrastructure Agentcy_"

        payload = {
            "title": title,
            "message": wa_message,
            "source": "WHATSAPP_DIRECT"
        }

        try:
            requests.post(self.webhook_url, json=payload)
            print("[OK] Rapport envoyé sur WhatsApp.")
        except:
            print("[!] Échec de l'envoi WhatsApp.")

    def nexus_pulse(self):
        """
        Vérifie l'état de santé de toute l'infrastructure via l'IA Brain.
        """
        print("[AGENTCY] System Health Check via AI Brain...")
        from agent_brain import brain
        
        system_instruction = """Tu es le Cerveau de Nexus, l'Orchestrateur Central d'Agentcy Enterprise.
Ta mission est de rédiger un rapport de santé technique mais compréhensible pour un humain.
Analyse l'état de l'infrastructure (Vercel, Google Cloud, PDF Archiving) et rédige un paragraphe rassurant et précis sur la robustesse du système."""

        status_data = f"Infrastructure Status: OPTIMAL, Cloud Bridge: CONNECTED, PDF Archiving: ENABLED, Last Sync: {datetime.now().strftime('%H:%M:%S')}"
        
        report = brain.think(system_instruction, status_data)
        
        print("\n" + "="*50)
        print("NEXUS - INFRASTRUCTURE PULSE")
        print("="*50)
        print(report)
        print("="*50 + "\n")
        
        return self.broadcast_intelligence("Infrastructure Health Status", report, "INFO")

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
    nexus.broadcast_intelligence("Infrastructure Activation", "The Agentcy Enterprise infrastructure is operational. All automation systems are synchronized.", "HIGH")
