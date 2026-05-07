import json
import os
import time
from datetime import datetime

class CongoboostOrganizer:
    """
    Agent Organisateur - Congoboost Digital
    Cerveau central coordonnant l'Agent Designer et l'Agent Sentinel.
    Garantit que le site fonctionne comme une machine de guerre pro.
    """

    def __init__(self):
        self.logs_file = "organizer_logs.json"
        self.state_file = "system_state.json"

    def run_orchestration(self):
        print(f"[{datetime.now().strftime('%H:%M:%S')}] 🤖 Agent Organisateur : Début du cycle d'orchestration...")
        
        # 1. Vérification de l'état du système
        self.check_system_health()

        # 2. Collecte des insights de l'Agent Sentinel
        insights = self.get_sentinel_insights()
        
        # 3. Transmission des instructions à l'Agent Designer
        if insights:
            self.task_designer(insights)
        
        # 4. Déclenchement du Mentor (Briefing Matinal)
        self.run_mentor_briefing()

        # 5. Vérification de la file d'attente Agenda
        self.check_notifications()

    def run_mentor_briefing(self):
        # Déclenchement précis à 7h00 du matin
        now = datetime.now()
        if now.hour == 7 and now.minute < 10: 
            print(f"[{now.strftime('%H:%M:%S')}] 🧠 Agent Organisateur : C'est l'heure du Briefing Matinal.")
            from agent_mentor import CongoboostMentor
            mentor = CongoboostMentor()
            mentor.generate_morning_report()
        else:
            # En dehors de 7h, on peut faire une vérification silencieuse
            pass

        print("[*] Cycle terminé. Système optimisé.")

    def check_system_health(self):
        # Vérifie si tous les fichiers critiques sont là
        files = ["index.html", "styles.css", "main.js", "agent_designer.py", "agent_sentinel.py"]
        for f in files:
            if os.path.exists(f):
                # print(f"[OK] {f}")
                pass
            else:
                print(f"[!] ALERTE : Fichier {f} manquant.")

    def get_sentinel_insights(self):
        # Lit les tâches produites par agent_sentinel.py
        if os.path.exists("sentinel_task_queue.json"):
            with open("sentinel_task_queue.json", "r") as f:
                return json.load(f)
        return []

    def task_designer(self, insights):
        print(f"[*] Agent Organisateur : Envoi de {len(insights)} directives à l'Agent Designer...")
        # Simulation d'écriture de directives
        with open("designer_instructions.json", "w", encoding="utf-8") as f:
            json.dump({"date": str(datetime.now()), "tasks": insights}, f, indent=4)

    def check_notifications(self):
        # 1. Traitement des tâches Sentinel vers Notifications
        if os.path.exists("sentinel_task_queue.json"):
            with open("sentinel_task_queue.json", "r") as f:
                tasks = json.load(f)
                if tasks:
                    self.push_tasks_to_notifications(tasks)
                    # On vide la file d'attente après traitement
                    os.remove("sentinel_task_queue.json")

        # 2. Vérification des notifications prêtes
        if os.path.exists("notifications_pending.json"):
            with open("notifications_pending.json", "r") as f:
                notifs = json.load(f)
                if notifs:
                    print(f"[*] Agent Organisateur : {len(notifs)} notifications détaillées prêtes pour l'Agenda.")

    def push_tasks_to_notifications(self, tasks):
        new_notifs = []
        for task in tasks:
            new_notifs.append({
                "title": f"🚀 Opportunité {task['priority']} : {task['title']}",
                "message": f"Analyse Sentinel : {task['description']}",
                "timestamp": str(datetime.now()),
                "status": "pending"
            })
        
        existing = []
        if os.path.exists("notifications_pending.json"):
            with open("notifications_pending.json", "r") as f:
                try: existing = json.load(f)
                except: existing = []
        
        with open("notifications_pending.json", "w") as f:
            json.dump(existing + new_notifs, f, indent=4)

if __name__ == "__main__":
    organizer = CongoboostOrganizer()
    while True:
        organizer.run_orchestration()
        time.sleep(600) # Orchestration toutes les 10 minutes
