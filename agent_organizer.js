/* 
  Agent Organisateur - Congoboost Digital
  Role: Gère la logique métier, les interactions et la persistance des données.
*/

// CONFIGURATION FIREBASE (À remplir avec vos clés)
const firebaseConfig = {
    apiKey: "VOTRE_API_KEY",
    authDomain: "congoboost-digital.firebaseapp.com",
    projectId: "congoboost-digital",
    storageBucket: "congoboost-digital.appspot.com",
    messagingSenderId: "VOTRE_SENDER_ID",
    appId: "VOTRE_APP_ID"
};

// Initialisation Firebase
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    var db = firebase.firestore();
}

const PROJECT_ID = "congoboost"; // ID unique pour ce projet

const AgentOrganizer = {
    init() {
        console.log(`🤖 Agent Organisateur [${PROJECT_ID}] : Initialisation...`);
        this.setupFormHandlers();
        this.setupProductInteractions();
        this.setupDashboardLogic();
        this.syncState();
    },

    // Sauvegarde d'une commande dans Firestore (Collection spécifique au projet)
    async saveOrder(productTitle) {
        if (!db) {
            console.warn("[!] Firebase non initialisé. Mode hors-ligne actif.");
            return;
        }

        try {
            const collectionName = `${PROJECT_ID}_orders`;
            await db.collection(collectionName).add({
                product: productTitle,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                status: "pending",
                source: "Website Organizer"
            });
            this.showNotification(`Commande enregistrée dans [${collectionName}]`);
            this.logActivity("Firestore", `Nouvelle commande : ${productTitle}`);
        } catch (error) {
            console.error("Erreur Firestore : ", error);
        }
    },

    // Sauvegarde des résultats d'audit
    async saveAudit(auditData) {
        if (!db) return;
        try {
            const collectionName = `${PROJECT_ID}_audits`;
            await db.collection(collectionName).add({
                ...auditData,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log(`[+] Audit sauvegardé dans ${collectionName}`);
        } catch (error) {
            console.error("Erreur sauvegarde audit : ", error);
        }
    },

    // 1. Gestion des formulaires de contact et d'achat
    setupFormHandlers() {
        const contactBtns = document.querySelectorAll('a[href^="https://wa.me"]');
        contactBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.logActivity("Interaction Client", "Clic sur bouton de contact WhatsApp");
            });
        });
    },

    // 2. Logique pour les E-books et Formations
    setupProductInteractions() {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const title = card.querySelector('h3').innerText;
                console.log(`[*] Agent Organisateur : Traitement de la commande pour ${title}`);
                
                // Enregistrement réel dans Firebase
                this.saveOrder(title);
            });
        });
    },

    // 3. Logique du Dashboard (Stats réelles)
    setupDashboardLogic() {
        // Ici on pourrait connecter à une API ou Firebase
        // Pour l'instant, on maintient la cohérence visuelle
    },

    // 4. Notification Interne (UI)
    showNotification(message) {
        const notif = document.createElement('div');
        notif.style.cssText = `
            position: fixed; bottom: 20px; right: 20px;
            background: var(--text-primary); color: white;
            padding: 15px 25px; border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            z-index: 10000; font-size: 0.9rem;
            border-left: 4px solid var(--accent-gold);
            animation: slideIn 0.3s ease-out;
        `;
        notif.innerText = message;
        document.body.appendChild(notif);
        setTimeout(() => notif.remove(), 4000);
    },

    // 5. Journalisation (pour l'Agent Sentinel)
    logActivity(type, message) {
        const activity = {
            timestamp: new Date().toISOString(),
            type: type,
            message: message
        };
        // Dans un vrai projet, on enverrait ceci à Firebase ou un log JSON
        console.log(`[LOG] ${type} : ${message}`);
    },

    syncState() {
        // Vérifie les mises à jour de l'Agent Designer
        console.log("[*] Agent Organisateur : Synchronisation avec l'Agent Designer...");
    }
};

document.addEventListener('DOMContentLoaded', () => AgentOrganizer.init());
