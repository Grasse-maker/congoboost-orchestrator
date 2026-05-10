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

// Global Debugging : Log toutes les erreurs vers Firestore pour aider au déploiement mobile
window.onerror = function(msg, url, lineNo, columnNo, error) {
    if (typeof db !== 'undefined') {
        db.collection('agentcy_traffic').add({
            type: "js_error",
            message: msg,
            url: url,
            line: lineNo,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            device: navigator.userAgent
        });
    }
    return false;
};

// Initialisation Firebase (Mode Compatibilité v9)
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    var db = firebase.firestore();
}

const PROJECT_ID = "agentcy"; // Préfixe pour éviter les collisions dans KinCommerce

const AgentOrganizer = {
    init() {
        if (this.initialized) return;
        console.log(`🤖 Agent Organisateur [${PROJECT_ID}] : Initialisation sur Firestore...`);
        this.logActivity("page_view", { url: window.location.pathname, referrer: document.referrer });
        this.setupFormHandlers();
        this.syncState();
        this.initialized = true;
    },

    // Sauvegarde des activités globales du site (Analytics)
    async logActivity(type, data = {}) {
        if (!db) return;
        try {
            const collectionName = `${PROJECT_ID}_traffic`;
            await db.collection(collectionName).add({
                type: type,
                data: data,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                userAgent: navigator.userAgent
            });
        } catch (error) {
            console.error("Erreur Firestore Traffic : ", error);
        }
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
        
        // Anti-doublon : Éviter de logguer le même lead plusieurs fois en une session
        const leadKey = `lead_${btoa(message).substring(0, 16)}`;
        if (sessionStorage.getItem(leadKey)) {
            console.log("[~] Lead déjà loggué pour cette session.");
            return;
        }

        try {
            const collectionName = `${PROJECT_ID}_leads`;
            await db.collection(collectionName).add({
                message: message,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                status: "new"
            });
            console.log(`[+] Lead de contact loggé dans ${collectionName}`);
            
            sessionStorage.setItem(leadKey, "true");

            // Déclenchement de l'alerte WhatsApp via le Nexus
            this.notifyNexus("Nouveau Lead Détecté", message);
            
        } catch (error) {
            console.error("Erreur Firestore : ", error);
        }
    },

    // Envoi d'une notification push vers le Nexus (Orchestrateur)
    async notifyNexus(title, message) {
        const webhookUrl = "https://script.google.com/macros/s/AKfycbyuISpIUfYCRElys3ZxvENsFQDsh1O7yP239QSyGm1k9LUSxZQakv8kq-VzAwPO0Ho/exec";
        const payload = {
            title: `[AGENTCY ENTERPRISE] ${title}`,
            message: message,
            source: "Agent Organisateur Web"
        };
        
        try {
            // Note: mode 'no-cors' est souvent nécessaire pour les Google Apps Scripts
            await fetch(webhookUrl, {
                method: "POST",
                mode: "no-cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            console.log("[>] Notification envoyée au Nexus.");
        } catch (error) {
            console.error("[!] Erreur notification Nexus :", error);
        }
    },

    setupFormHandlers() {
        // Clics WhatsApp
        const contactBtns = document.querySelectorAll('a[href^="https://wa.me"]');
        contactBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.logContact("Clic sur bouton de contact WhatsApp");
                this.logActivity("click_whatsapp", { button_text: btn.innerText });
            });
        });

        // Tous les autres clics (boutons principaux)
        document.body.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.classList.contains('btn')) {
                const text = e.target.innerText || e.target.id || "Bouton Inconnu";
                this.logActivity("button_click", { button_name: text });
            }
        });
    },

    syncState() {
        console.log("[*] Agent Organisateur : Synchronisation Firestore établie.");
    }
};

document.addEventListener('DOMContentLoaded', () => AgentOrganizer.init());
