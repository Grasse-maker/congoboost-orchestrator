# 🏛️ Base de Connaissances - AGENTCY ENTERPRISE
## Guide d'Architecture des Agents & Transfert Technologique

Ce document documente notre parcours et sert de guide pour l'intégration de l'infrastructure "Agentic" dans vos autres projets (ITI KAMO, KinCommerce, CPK Lokoro, etc.).

---

## 🧠 1. Le Cerveau Central (`agent_brain.py`)
C'est le module le plus puissant. Il permet de transformer n'importe quelle donnée brute en un rapport stratégique humain.

**Comment le réutiliser :**
1. Copiez `agent_brain.py` dans votre nouveau projet.
2. Assurez-vous que la variable d'environnement `GEMINI_API_KEY` est définie.
3. Importez-le : `from agent_brain import brain`.
4. Utilisez `brain.think(instruction, donnee)` pour générer du contenu intelligent.

---

## 📡 2. L'Orchestrateur Nexus (`agent_nexus.py`)
Nexus est le centre de communication. Il centralise les logs et diffuse les informations vers l'extérieur (Webhook, WhatsApp).

**Points Clés :**
- **Broadcast** : Envoie des notifications standard.
- **WhatsApp Direct** : Formate automatiquement les messages avec des emojis et du gras pour une lecture mobile parfaite.
- **Pulse** : Vérifie l'état de santé du système et rassure l'utilisateur.

---

## 🤖 3. Spécialisation des Agents
Chaque agent doit avoir une mission claire :
- **Atlas** : Analyse de données business et calcul de ROI.
- **Sentinel** : Veille sur les réseaux sociaux et tendances locales.
- **Explorer** : Innovation technologique et design.
- **Organizer** : Gestion de la persistance (Firestore) et des formulaires.

---

## 🛠️ 4. Guide de Déploiement & Dépannage

### Problème : "Python est introuvable"
Si votre terminal affiche cette erreur, cela signifie que Python n'est pas dans votre "PATH".
**Solution rapide (PowerShell) :**
```powershell
winget install Python.Python.3.12
```
Puis redémarrez votre terminal.

### Sécurité des Clés API
Ne mettez **JAMAIS** vos clés Gemini ou OpenAI directement dans le code source.
- Sur **Vercel** : Utilisez l'onglet "Environment Variables".
- En **Local** : Utilisez un fichier `.env` ou les variables système.

---

## 🔮 5. Vision pour vos futurs projets
Vous pouvez maintenant appliquer ce modèle à **ITI KAMO** (pour automatiser les bulletins scolaires) ou **CPK Lokoro** (pour la diffusion des messages liturgiques via WhatsApp). 

L'infrastructure que nous avons bâtie est **souveraine** : elle travaille pour vous 24h/24 sans dépendre d'une interface tierce.

---
*Document généré par Antigravity pour l'Architecte d'Agentcy Enterprise.*
