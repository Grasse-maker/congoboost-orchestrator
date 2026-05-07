import json
import os
import requests
import time

# --- CONFIGURATION ---
# Remplacez ceci par votre URL de Webhook (Zapier, Make, ou Google Apps Script)
WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbyuISpIUfYCRElys3ZxvENsFQDsh1O7yP239QSyGm1k9LUSxZQakv8kq-VzAwPO0Ho/exec" 
NOTIF_FILE = "notifications_pending.json"

def sync_with_calendar():
    """
    Lit les notifications en attente et les envoie au calendrier via Webhook.
    """
    if not os.path.exists(NOTIF_FILE):
        print("[*] Aucune notification en attente.")
        return

    with open(NOTIF_FILE, "r", encoding="utf-8") as f:
        try:
            notifications = json.load(f)
        except json.JSONDecodeError:
            print("[!] Erreur de lecture du fichier JSON.")
            return

    if not notifications:
        print("[*] File d'attente vide.")
        return

    print(f"[*] Synchronisation de {len(notifications)} événements avec l'Agenda...")
    
    remaining_notifs = []
    for notif in notifications:
        if notif["status"] == "pending":
            try:
                # Simulation si le Webhook est le placeholder
                if "VOTRE_ID_APP_SCRIPT" in WEBHOOK_URL:
                    print(f"[SIMULATION] Envoi de l'événement : {notif['title']}")
                    time.sleep(1) # Simulation de latence
                    notif["status"] = "synced"
                else:
                    # Envoi au Webhook réel
                    response = requests.post(WEBHOOK_URL, json=notif, timeout=10)
                    if response.status_code == 200:
                        print(f"[+] Succès : {notif['title']}")
                        notif["status"] = "synced"
                    else:
                        print(f"[-] Échec pour {notif['title']} (Code: {response.status_code})")
                        remaining_notifs.append(notif)
            except Exception as e:
                print(f"[!] Erreur de connexion : {e}")
                remaining_notifs.append(notif)
        else:
            # On ignore les déjà synchronisés (ou on les supprime)
            pass

    # Mise à jour du fichier (on ne garde que les échecs ou on vide)
    with open(NOTIF_FILE, "w", encoding="utf-8") as f:
        json.dump(remaining_notifs, f, indent=4)

if __name__ == "__main__":
    while True:
        sync_with_calendar()
        print("[*] Prochaine synchronisation dans 5 minutes...")
        time.sleep(300) # Attente de 5 minutes
