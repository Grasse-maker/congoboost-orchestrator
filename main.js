/* 
    AGENTCY ENTERPRISE - Diagnostic de Modernisation Scolaire v2.0
    Focus : ROI (Retour sur Investissement), Souveraineté Digitale & Prestige
*/

function runDiagnostic() {
    // --- INPUTS ---
    const students = parseFloat(document.getElementById('current-students').value) || 0;
    const lostStudents = parseFloat(document.getElementById('lost-range').value) || 0;
    const fees = parseFloat(document.getElementById('avg-fees').value) || 0;
    const tools = document.getElementById('current-tools').value;
    const communication = document.getElementById('parent-comm').value;

    // --- CALCULS COMPLEXES ---
    
    // 1. Perte de Chiffre d'Affaires (Directe)
    const financialLoss = lostStudents * fees;
    
    // 2. Coût d'Inefficacité Opérationnelle (Friction factor)
    // Papier : 15%, Excel : 7%, Manuel : 10%
    let frictionFactor = 0.02; // Base friction for modern systems
    if (tools === 'paper') frictionFactor = 0.15;
    else if (tools === 'excel') frictionFactor = 0.07;
    else if (tools === 'whatsapp') frictionFactor = 0.10;
    
    const operationalCost = (students * fees) * frictionFactor;
    
    // 3. Score de Satisfaction Parents (0-100)
    let satisfaction = 85; // Base
    if (communication === 'no') satisfaction -= 40;
    if (tools === 'paper') satisfaction -= 15;
    if (tools === 'whatsapp') satisfaction -= 5;
    
    // 4. ROI Potentiel (Estimation de gain sur 12 mois)
    const totalYearlyLoss = Math.round(financialLoss + operationalCost);
    const potentialROI = Math.round(totalYearlyLoss * 0.85); // On estime récupérer 85% des pertes

    // --- MISE À JOUR UI ---
    animateValue('diag-loss', totalYearlyLoss, "$");
    
    // Mise à jour des indicateurs visuels
    const reputationSpan = document.getElementById('reputation-impact');
    const efficiencySpan = document.getElementById('admin-efficiency');
    const recText = document.getElementById('diag-rec');

    // Logique de couleur et texte pour Réputation
    if (satisfaction < 50) {
        reputationSpan.innerText = "Critique";
        reputationSpan.style.color = "#ef4444";
    } else if (satisfaction < 75) {
        reputationSpan.innerText = "Risqué";
        reputationSpan.style.color = "#f59e0b";
    } else {
        reputationSpan.innerText = "Excellent";
        reputationSpan.style.color = "#10b981";
    }

    // Logique pour Efficacité
    const efficiency = (1 - frictionFactor) * 100;
    if (efficiency < 86) {
        efficiencySpan.innerText = "Faible";
        efficiencySpan.style.color = "#ef4444";
    } else if (efficiency < 94) {
        efficiencySpan.innerText = "Moyenne";
        efficiencySpan.style.color = "#f59e0b";
    } else {
        efficiencySpan.innerText = "Optimale";
        efficiencySpan.style.color = "#10b981";
    }

    // --- RECOMMANDATION STRATÉGIQUE ---
    let advice = "";
    if (totalYearlyLoss > 20000) {
        advice = `Urgence Absolue : Votre établissement subit une hémorragie financière de $${totalYearlyLoss.toLocaleString()}/an. La mise en place d'Agentcy Enterprise générera un ROI estimé à $${potentialROI.toLocaleString()} dès la première année.`;
    } else if (satisfaction < 60) {
        advice = "Alerte Fidélisation : Le manque de communication digitale nuit gravement à votre image. Les parents modernes attendent des notifications instantanées et des bulletins sécurisés.";
    } else {
        advice = "Optimisation : Vous disposez d'une base solide. Passer à l'infrastructure Enterprise vous permettra de scaler vos inscriptions et de réduire vos coûts administratifs de 30%.";
    }
    recText.innerText = advice;

    // Update Action Button to point to AI Consultant
    const waButton = document.getElementById('diag-wa-btn');
    if (waButton) {
        // Redirection vers le chatbot IA au lieu de WhatsApp direct
        waButton.href = `ai-consultant.html?loss=${totalYearlyLoss}`;
        waButton.innerText = "Consulter l'IA Stratégique";
    }

    // Sauvegarde Firestore via Agentcy Infrastructure
    // Uniquement si les données sont significatives (pour éviter de polluer avec des audits vides)
    if (window.AgentOrganizer && totalYearlyLoss > 0) {
        window.AgentOrganizer.saveAudit({
            brand: "Agentcy Enterprise",
            type: "Elite Diagnostic",
            totalLoss: totalYearlyLoss,
            satisfaction: satisfaction,
            efficiency: Math.round(efficiency),
            potentialROI: potentialROI,
            inputs: { students, lostStudents, fees, tools, communication }
        });
    }
}

function animateValue(id, value, prefix = "") {
    const obj = document.getElementById(id);
    const start = parseInt(obj.innerText.replace(/[^0-9]/g, '')) || 0;
    const duration = 800;
    let startTimestamp = null;
    
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const current = Math.floor(progress * (value - start) + start);
        obj.innerText = prefix + current.toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    if (themeToggle) {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) htmlElement.setAttribute('data-theme', savedTheme);

        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // Real-time Updates for Diagnostic
    const inputs = ['current-students', 'lost-range', 'avg-fees', 'current-tools', 'parent-comm'];
    inputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', runDiagnostic);
            el.addEventListener('change', runDiagnostic);
        }
    });

    // Mobile Menu
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => navLinks.classList.toggle('active'));
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => navLinks.classList.remove('active'));
        });
    }
    
    // Initial run
    runDiagnostic();
});
