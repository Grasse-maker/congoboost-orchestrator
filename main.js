/* 
    AGENTCY ENTERPRISE - Diagnostic de Modernisation Scolaire
    Focus : Langage Directeur d'École (Argent, Réputation, Organisation)
*/

function runDiagnostic() {
    // --- INPUTS ---
    const students = parseFloat(document.getElementById('current-students').value) || 0;
    const lostStudents = parseFloat(document.getElementById('lost-range').value) || 0;
    const fees = parseFloat(document.getElementById('avg-fees').value) || 0;
    const tools = document.getElementById('current-tools').value;
    const communication = document.getElementById('parent-comm').value;

    // --- CALCULS FINANCIERS ---
    // Perte brute d'inscriptions
    const financialLoss = lostStudents * fees;
    
    // Coût caché de la désorganisation (estimé à 10% des revenus pour le papier, 5% pour Excel)
    let frictionFactor = 0;
    if (tools === 'paper') frictionFactor = 0.12;
    else if (tools === 'excel') frictionFactor = 0.05;
    else if (tools === 'whatsapp') frictionFactor = 0.08;
    
    const operationalLoss = (students * fees) * frictionFactor;
    const totalYearlyLoss = Math.round(financialLoss + operationalLoss);

    // --- MISE À JOUR UI ---
    animateDiagnosticValue('diag-loss', totalYearlyLoss, "$");

    // --- ANALYSE RÉPUTATION & EFFICACITÉ ---
    const reputationSpan = document.getElementById('reputation-impact');
    const efficiencySpan = document.getElementById('admin-efficiency');
    const recText = document.getElementById('diag-rec');

    if (communication === 'no') {
        reputationSpan.innerText = "Critique";
        reputationSpan.style.color = "#ef4444";
    } else {
        reputationSpan.innerText = "Stable";
        reputationSpan.style.color = "#10b981";
    }

    if (tools === 'paper') {
        efficiencySpan.innerText = "Très Faible";
        efficiencySpan.style.color = "#ef4444";
    } else if (tools === 'modern') {
        efficiencySpan.innerText = "Optimale";
        efficiencySpan.style.color = "#10b981";
    } else {
        efficiencySpan.innerText = "Moyenne";
        efficiencySpan.style.color = "#f59e0b";
    }

    // --- RECOMMANDATION ÉMOTIONNELLE & CONCRÈTE ---
    if (totalYearlyLoss > 15000) {
        recText.innerText = `Votre établissement pourrait perdre environ $${totalYearlyLoss.toLocaleString()}/an à cause des processus manuels et des pertes d'inscriptions. Recommandation : Déployer en urgence un système de gestion moderne pour sécuriser votre avenir financier.`;
    } else if (reputationSpan.innerText === "Critique") {
        recText.innerText = "Le retard de communication avec les parents menace la réputation de votre école. Un système de notifications automatiques restaurera la confiance et l'image de votre institution.";
    } else {
        recText.innerText = "La modernisation de vos outils administratifs permettra de libérer vos équipes du papier et de vous concentrer sur l'excellence pédagogique.";
    }

    // Sauvegarde pour le rapport matinal de l'Architecte
    if (typeof AgentOrganizer !== 'undefined' && typeof AgentOrganizer.saveAudit === 'function') {
        AgentOrganizer.saveAudit({
            type: "School Diagnostic",
            totalLoss: totalYearlyLoss,
            reputation: reputationSpan.innerText,
            tools: tools,
            inputs: { students, lostStudents, fees, tools, communication }
        });
    }
}

function animateDiagnosticValue(id, value, prefix = "") {
    const obj = document.getElementById(id);
    const start = parseInt(obj.innerText.replace(/[^0-9]/g, '')) || 0;
    const duration = 1000;
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

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    runDiagnostic();
});
