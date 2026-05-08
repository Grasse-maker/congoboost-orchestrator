/* 
    AGENTCY ENTERPRISE - Logiciel de Simulation de ROI
    Positionnement : Premium Consulting & SaaS Studio
*/

function calculateROI() {
    // --- MODULE 1 : INSCRIPTIONS ---
    const lostStudents = parseFloat(document.getElementById('lost-students').value) || 0;
    const annualFees = parseFloat(document.getElementById('annual-fees').value) || 0;
    const enrollmentLoss = lostStudents * annualFees * 12;

    // --- MODULE 2 : ADMINISTRATION ---
    const staffCount = parseFloat(document.getElementById('staff-count').value) || 0;
    const lostHoursDay = parseFloat(document.getElementById('lost-hours-day').value) || 0;
    const avgSalary = parseFloat(document.getElementById('avg-salary').value) || 0;

    // Calcul du coût horaire approximatif (base 160h/mois)
    const hourlyRate = avgSalary / 160;
    const adminLossMonth = staffCount * lostHoursDay * 22 * hourlyRate; // 22 jours ouvrables
    const adminLossYear = adminLossMonth * 12;

    // --- TOTAL ---
    const totalLossYear = Math.round(enrollmentLoss + adminLossYear);

    // --- MISE À JOUR UI ---
    animateValue('total-loss', totalLossYear, "$");
    document.getElementById('res-enrollment').innerText = `$${Math.round(enrollmentLoss).toLocaleString()}`;
    document.getElementById('res-admin').innerText = `$${Math.round(adminLossYear).toLocaleString()}`;

    // --- RECOMMANDATION DYNAMIQUE ---
    const recText = document.getElementById('rec-text');
    if (totalLossYear > 10000) {
        recText.innerText = "Priorité Critique : Votre établissement subit une hémorragie financière. Un système d'automatisation est indispensable pour stopper ces pertes avant la prochaine rentrée.";
    } else if (totalLossYear > 5000) {
        recText.innerText = "Recommandation : Une optimisation de vos processus administratifs permettrait de réinjecter plus de $5,000 dans vos projets de développement.";
    } else {
        recText.innerText = "Analyse : Même pour une petite structure, l'automatisation sécurise vos revenus et garantit une croissance pérenne.";
    }

    // Sauvegarde silencieuse via l'Organisateur
    if (typeof AgentOrganizer !== 'undefined' && typeof AgentOrganizer.saveAudit === 'function') {
        AgentOrganizer.saveAudit({
            type: "Strategic Audit",
            totalLoss: totalLossYear,
            enrollmentLoss,
            adminLossYear,
            inputs: { lostStudents, annualFees, staffCount, lostHoursDay, avgSalary }
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

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    calculateROI();
});
