/* 
  Agent Organisateur - AGENTCY ENTERPRISE
  Role: Gère la logique métier, les interactions et la persistance des données.
  Base : kincommerce (Shared Database)
*/

// CONFIGURATION FIREBASE (Récupérée du projet KinCommerce)
const firebaseConfig = {
    apiKey: "AIzaSyDpNESCaG7rsfEJgZGX3YksobfrBsx6r0E",
    authDomain: "kincommerce.firebaseapp.com",
    projectId: "kincommerce",
    storageBucket: "kincommerce.firebasestorage.app",
    messagingSenderId: "966041309497",
    appId: "1:966041309497:web:352b7466019c5a122ed8e8",
    measurementId: "G-W1HBV0190F"
};

// Initialisation Firebase (Mode Compatibilité v9)
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    var db = firebase.firestore();
}

const PROJECT_ID = "agentcy"; // Préfixe pour éviter les collisions dans KinCommerce

const AgentOrganizer = {
    init() {
        console.log(`🤖 Agent Organisateur [${PROJECT_ID}] : Initialisation sur Firestore...`);
        this.setupFormHandlers();
        this.syncState();
    },

    // Sauvegarde des diagnostics dans Firestore (Collection: agentcy_diagnostics)
    async saveAudit(auditData) {
        if (!db) {
            console.warn("[!] Firestore non initialisé.");
            return;
        }
        try {
            const collectionName = `${PROJECT_ID}_diagnostics`;
            await db.collection(collectionName).add({
                ...auditData,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                source: "Website Diagnostic Tool"
            });
            console.log(`[+] Diagnostic sauvegardé dans ${collectionName}`);
        } catch (error) {
            console.error("Erreur Firestore : ", error);
        }
    },

    // Sauvegarde des messages de contact (Collection: agentcy_leads)
    async logContact(message) {
        if (!db) return;
        try {
            const collectionName = `${PROJECT_ID}_leads`;
            await db.collection(collectionName).add({
                message: message,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                status: "new"
            });
            console.log(`[+] Lead de contact loggé dans ${collectionName}`);
        } catch (error) {
            console.error("Erreur Firestore : ", error);
        }
    },

    setupFormHandlers() {
        // Clics WhatsApp
        const contactBtns = document.querySelectorAll('a[href^="https://wa.me"]');
        contactBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.logContact("Clic sur bouton de contact WhatsApp");
            });
        });
    },

    syncState() {
        console.log("[*] Agent Organisateur : Synchronisation Firestore établie.");
    }
};

document.addEventListener('DOMContentLoaded', () => AgentOrganizer.init());
