/* 
  Congoboost Digital - Minimalist Orchestration Logic
  Aesthetic: Clean, Modern, White, Premium
*/

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Smooth Scroll for Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === "#") return;
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // 2. Animate Impact Numbers on Scroll
    const numObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const originalVal = target.getAttribute('data-val');
                const countTo = parseInt(originalVal.replace(/,/g, '').replace('+', '').replace('%', ''));
                let count = 0;
                const duration = 2000; // 2 seconds
                const stepTime = 20;
                const totalSteps = duration / stepTime;
                const stepValue = countTo / totalSteps;

                const interval = setInterval(() => {
                    count += stepValue;
                    if (count >= countTo) {
                        target.innerText = originalVal;
                        clearInterval(interval);
                    } else {
                        let formatted = Math.floor(count).toLocaleString();
                        if (originalVal.includes('+')) formatted += '+';
                        if (originalVal.includes('%')) formatted += '%';
                        target.innerText = formatted;
                    }
                }, stepTime);
                numObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.impact-num').forEach(num => numObserver.observe(num));

    // 3. Entrance Animations for Sections
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.card, section h2, .badge, .impact-card, .testimonial').forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });

    // 4. Agent Sentinel Visual Interaction
    const visual = document.querySelector('.agent-visual');
    if (visual) {
        visual.addEventListener('mousemove', (e) => {
            const rect = visual.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const pulse = document.querySelector('.pulse');
            if (pulse) {
                pulse.style.left = `${x - 100}px`;
                pulse.style.top = `${y - 100}px`;
            }
        });
    }

    // 5. Dashboard Data Simulation
    const stats = document.querySelectorAll('.card h4');
    if (stats.length >= 3) {
        setInterval(() => {
            const currentStudents = parseInt(stats[0].innerText.replace(',', ''));
            stats[0].innerText = (currentStudents + (Math.random() > 0.5 ? 1 : -1)).toLocaleString();
            
            const currentGPA = parseFloat(stats[1].innerText);
            stats[1].innerText = (currentGPA + (Math.random() > 0.5 ? 0.01 : -0.01)).toFixed(2);
            
            const status = document.getElementById('sentinel-status');
            if (status) {
                status.style.color = '#22c55e';
                setTimeout(() => status.style.color = 'var(--text-secondary)', 500);
            }
        }, 3000);
    }

    console.log("%c✦ Congoboost Digital System Active", "color: #0284C7; font-weight: bold;");
});

// --- LOGIQUE D'AUDIT AUTONOME ---
function startAutonomousAudit() {
    const url = document.getElementById('business-url').value;
    if (!url) {
        alert("Veuillez entrer un lien valide.");
        return;
    }

    // Changement d'état UI
    document.getElementById('audit-initial').style.display = 'none';
    document.getElementById('audit-loading').style.display = 'block';

    const statusText = document.getElementById('loading-status');
    const progressBar = document.getElementById('progress-bar');
    const loadingDetail = document.getElementById('loading-detail');

    const steps = [
        { progress: 20, status: "Recherche de l'empreinte digitale...", detail: "Scan des réseaux sociaux et du web..." },
        { progress: 40, status: "Analyse de la concurrence...", detail: "Comparaison avec les leaders du secteur..." },
        { progress: 60, status: "Identification des failles...", detail: "Audit technique et stratégique..." },
        { progress: 80, status: "Génération des questions stratégiques...", detail: "Calcul de l'impact potentiel..." },
        { progress: 100, status: "Conception de votre site démo...", detail: "Finalisation du rapport premium..." }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
        if (currentStep >= steps.length) {
            clearInterval(interval);
            showAuditResult(url);
        } else {
            progressBar.style.width = `${steps[currentStep].progress}%`;
            statusText.innerText = steps[currentStep].status;
            loadingDetail.innerText = steps[currentStep].detail;
            currentStep++;
        }
    }, 1500);
}

function showAuditResult(url) {
    document.getElementById('audit-loading').style.display = 'none';
    document.getElementById('audit-result').style.display = 'block';
    document.getElementById('audit-date').innerText = `Date : ${new Date().toLocaleDateString()}`;

    // Détection du type de business
    const urlLower = url.toLowerCase();
    const isSchool = urlLower.includes('ecole') || urlLower.includes('school') || urlLower.includes('iti') || urlLower.includes('complexe');
    const isShop = urlLower.includes('shop') || urlLower.includes('boutique') || urlLower.includes('vente') || urlLower.includes('store');
    
    // Génération déterministe basée sur l'URL
    let hash = 0;
    for (let i = 0; i < url.length; i++) hash = url.charCodeAt(i) + ((hash << 5) - hash);
    const seed = Math.abs(hash);

    const score = 12 + (seed % 30); // Score bas entre 12% et 42%
    const annualRevenue = 30000 + (seed % 470000); // Revenu estimé entre 30k et 500k
    const administrativeLoss = Math.floor(annualRevenue * (0.12 + (seed % 15) / 100)); // Perte de 12 à 27%
    const efficiency = 25 + (seed % 25); // Efficacité actuelle de 25 à 50%

    // Données pour le prototype personnalisé
    const auditData = {
        type: isSchool ? 'school' : (isShop ? 'shop' : 'pro'),
        url: url.replace('https://', '').replace('http://', '').split('/')[0],
        score: score,
        revenue: annualRevenue,
        loss: administrativeLoss,
        efficiency: efficiency,
        staff: 3 + (seed % 40),
        customers: 100 + (seed % 2000)
    };
    localStorage.setItem('currentAudit', JSON.stringify(auditData));
    localStorage.setItem('lastAuditType', auditData.type);
    localStorage.setItem('lastAuditURL', url);

    // Sauvegarde persistante via l'Organisateur
    if (typeof AgentOrganizer !== 'undefined') {
        AgentOrganizer.saveAudit(auditData);
    }

    const pos = document.getElementById('points-pos');
    const neg = document.getElementById('points-neg');
    const adviceList = document.getElementById('strategic-questions');

    const sector = isSchool ? "Scolaire" : (isShop ? "Commerce" : "Professionnel");
    
    pos.innerHTML = `<li>✅ Visibilité digitale identifiée (${auditData.url})</li>
                     <li>✅ Secteur détecté : ${sector}</li>
                     <li>✅ Potentiel de croissance élevé</li>`;

    neg.innerHTML = `<li>❌ Perte financière annuelle estimée : <strong>$${auditData.loss.toLocaleString()}</strong></li>
                     <li>❌ Efficacité opérationnelle actuelle : ${auditData.efficiency}%</li>
                     <li>❌ Risque d'erreur administrative critique (${auditData.staff} collaborateurs sans outils SaaS)</li>
                     <li>❌ Absence de tunnel de vente WhatsApp optimisé</li>`;

    const dynamicAdvice = [
        `Mettre en place un orchestrateur SaaS pour sécuriser les $${auditData.loss.toLocaleString()} de pertes annuelles.`,
        `Automatiser les notifications WhatsApp pour vos ${auditData.customers} clients/élèves.`,
        `Intégrer le Mobile Money (M-Pesa/Orange) pour 100% de vos flux financiers.`
    ];

    adviceList.innerHTML = `<ul style="list-style:none; padding:0; display:flex; flex-direction:column; gap:10px;">
        ${dynamicAdvice.map(a => `<li>💡 ${a}</li>`).join('')}
    </ul>`;

    // Lien vers WhatsApp avec données réelles (Le message de l'Architecte)
    const waLink = document.getElementById('audit-wa-link');
    if (waLink) {
        const msg = encodeURIComponent(`Bonjour l'Architecte ! L'audit Congoboost de mon business (${url}) a révélé une perte annuelle de $${auditData.loss.toLocaleString()}. Je souhaite lancer ma phase d'Orchestration.`);
        waLink.href = `https://wa.me/243811111111?text=${msg}`;
    }
}




// --- CALCULATEUR ROI ---
function updateROI() {
    const size = parseInt(document.getElementById('roi-size').value);
    const hours = parseInt(document.getElementById('roi-hours').value);
    
    document.getElementById('roi-size-val').innerText = size;
    const hoursDisplay = document.getElementById('roi-hours-val');
    if (hoursDisplay) hoursDisplay.innerText = hours + 'h';

    // Formule Architecte : 
    // (Heures perdues * Taux horaire de friction * Jours) + (Friction par client * Taille)
    // Taux friction estimé à 12$ en RDC pour inclure les opportunités manquées.
    const hourlyRate = 12; 
    const operationalLoss = hours * hourlyRate * 260; // 260 jours ouvrés
    const scalabilityLoss = size * 15; // 15$ de perte de croissance par client/an
    
    const annualLoss = Math.floor(operationalLoss + scalabilityLoss);

    const totalEl = document.getElementById('roi-total');
    if (totalEl) {
        totalEl.innerText = '$' + annualLoss.toLocaleString();
        totalEl.style.color = annualLoss > 50000 ? '#ef4444' : '#f59e0b';
    }
}

// --- NOTIFICATIONS AGENTS ---
function showAgentNotification(title, message) {
    const toast = document.createElement('div');
    toast.className = 'notification-toast';
    toast.innerHTML = `
        <div class="notif-icon">🤖</div>
        <div>
            <h4 style="font-size: 0.9rem; margin-bottom: 2px;">${title}</h4>
            <p style="font-size: 0.8rem; color: var(--text-secondary);">${message}</p>
        </div>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('active'), 100);
    setTimeout(() => {
        toast.classList.remove('active');
        setTimeout(() => {
            if (toast.parentNode) toast.remove();
        }, 500);
    }, 5000);
}

// Simulation d'activité agent (Notification à la minute d'après)
setTimeout(() => {
    showAgentNotification("Agent Sentinel", "Analyse TikTok terminée : Demande croissante pour les solutions Mobile Money.");
}, 15000); // 15s pour démo

setTimeout(() => {
    showAgentNotification("Agent Designer", "Optimisation Mobile effectuée : Les bords d'écran sont maintenant sécurisés.");
}, 60000); // 1 minute


// ============================================================
// --- AGENT ADGENIUS PRO : STUDIO PUBLICITÉ PREMIUM ---
// ============================================================
function generateVisualAd() {
    const rawUrl  = (document.getElementById('ad-url').value || '').trim();
    const offer   = (document.getElementById('ad-offer').value || '').trim();
    const style   = document.getElementById('ad-style').value;
    const price   = (document.getElementById('ad-price').value || '').trim();

    if (!rawUrl) {
        showAgentNotification("AdGenius ⚠️", "Entrez d'abord le lien de votre business !");
        return;
    }

    // ── Show loading ──
    const loading  = document.getElementById('ad-loading');
    const results  = document.getElementById('ad-results-container');
    const progBar  = document.getElementById('ad-progress-bar');
    const loadText = document.getElementById('ad-loading-text');

    if (loading)  loading.style.display  = 'block';
    if (results)  results.style.display  = 'none';

    const loadSteps = [
        [15,  "Extraction du nom de business..."],
        [35,  "Détection du secteur d'activité..."],
        [55,  "Génération du visuel publicitaire..."],
        [75,  "Création des textes de campagne..."],
        [100, "Finalisation du visuel premium..."]
    ];
    let stepIdx = 0;
    const loadInterval = setInterval(() => {
        if (stepIdx >= loadSteps.length) { clearInterval(loadInterval); return; }
        if (progBar)  progBar.style.width  = loadSteps[stepIdx][0] + '%';
        if (loadText) loadText.textContent = loadSteps[stepIdx][1];
        stepIdx++;
    }, 400);

    setTimeout(() => {
        clearInterval(loadInterval);
        if (loading) loading.style.display = 'none';
        if (results) results.style.display = 'block';

        // ── 1. Extract business name ──
        let name = rawUrl
            .replace(/https?:\/\//i, '').replace(/www\./i, '')
            .split('/')[0].split('?')[0].toUpperCase();
        const fbMatch = rawUrl.match(/facebook\.com\/([^/?&#]+)/i);
        if (fbMatch && fbMatch[1] !== 'pages') name = fbMatch[1].replace(/[-_.]/g, ' ').toUpperCase();
        if (name.length > 22) name = name.substring(0, 20) + '…';

        // ── 2. Detect sector ──
        const u = rawUrl.toLowerCase() + ' ' + offer.toLowerCase();
        const isSchool   = /ecole|school|iti|complexe|acad|univ|cours/.test(u);
        const isCommerce = /boutique|shop|mode|store|vente|market|beaute/.test(u);
        const sector = isSchool ? 'scolaire' : isCommerce ? 'commerce' : 'professionnel';

        const sectorBadges = {
            scolaire:      ['GESTION SCOLAIRE', 'FRAIS SCOLAIRES', 'SUIVI ÉLÈVES', 'NOTIF PARENTS'],
            commerce:      ['E-COMMERCE', 'CATALOGUE DIGITAL', 'PAIEMENTS MOBILE', 'STOCK AUTO'],
            professionnel: ['SITE WEB PRO', 'WHATSAPP BOT', 'MOBILE MONEY', 'CRM DIGITAL']
        };
        const sectorHeadlines = {
            scolaire:      ['GÉREZ VOTRE', 'ÉCOLE AVEC\nPRÉCISION'],
            commerce:      ['VENDEZ PLUS,', 'GÉREZ MIEUX'],
            professionnel: ['MODERNISEZ VOTRE', 'BUSINESS EN RDC']
        };
        const sectorLoss = { scolaire: '$8,400', commerce: '$12,000', professionnel: '$15,600' };

        const headline = sectorHeadlines[sector];
        const badges   = sectorBadges[sector];
        const lossEst  = sectorLoss[sector];
        const offerText = offer || 'Solution Digitale Premium';

        // ── 3. Apply visual theme ──
        const themes = {
            orange: { bg: 'linear-gradient(135deg, #ea580c 0%, #dc2626 50%, #7c2d12 100%)', accent: '#fbbf24', textColor: 'white' },
            dark:   { bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)', accent: '#38bdf8', textColor: 'white' },
            gold:   { bg: 'linear-gradient(135deg, #1a1200 0%, #3d2800 50%, #000 100%)',    accent: '#e2a81d', textColor: '#e2a81d' },
            blue:   { bg: 'linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 60%, #0f172a 100%)', accent: '#93c5fd', textColor: 'white' }
        };
        const t = themes[style] || themes.orange;

        const overlay  = document.getElementById('ad-bg-overlay');
        const headline1 = document.getElementById('ad-headline');
        const brandBadge = document.getElementById('ad-brand-badge');
        const badgesEl   = document.getElementById('ad-badges');
        const phoneName  = document.getElementById('phone-biz-name');
        const priceDisp  = document.getElementById('ad-price-display');
        const priceSub   = document.getElementById('ad-price-sub');
        const brandName  = document.getElementById('ad-brand-name');

        if (overlay)   overlay.style.background = t.bg;
        if (headline1) {
            headline1.style.color = t.textColor;
            headline1.innerHTML = headline[0] + '<br>' + headline[1];
        }
        if (brandBadge) brandBadge.textContent = name;
        if (phoneName)  phoneName.textContent  = name.length > 10 ? name.substring(0,10) : name;
        if (brandName)  brandName.textContent  = name;

        // Update service badges
        if (badgesEl) {
            badgesEl.innerHTML = badges.map(b =>
                `<span style="background:rgba(255,255,255,0.2);color:white;padding:5px 12px;border-radius:6px;font-size:0.7rem;font-weight:700;">${b}</span>`
            ).join('');
        }

        // Price/Offer badge
        if (price) {
            if (priceDisp) priceDisp.innerHTML = price.toUpperCase();
            if (priceSub)  priceSub.innerHTML  = offerText;
        } else {
            if (priceDisp) priceDisp.innerHTML = 'AUDIT<br>GRATUIT';
            if (priceSub)  priceSub.innerHTML  = 'Diagnostic complet<br>de votre business';
        }

        // ── 4. Generate campaign texts ──
        const cta = 'https://wa.me/message/ARWYGVW5TELAF1';
        const textOutput = document.getElementById('ad-text-output');
        if (textOutput) {
            textOutput.innerHTML = `
                <div style="border-bottom:1px solid rgba(255,255,255,0.12);padding-bottom:16px;margin-bottom:16px;">
                    <strong style="color:#25d366;">📱 WHATSAPP STATUS (copiez-collez)</strong>
                    <p style="margin-top:8px;background:rgba(255,255,255,0.05);padding:12px;border-radius:10px;font-style:italic;">
                        "${name} — Votre ${offerText} perd ~${lossEst}/an en gestion manuelle. 🔴<br>
                        ✅ Congoboost Digital règle ça en 60 jours.<br>
                        👉 Audit GRATUIT : ${cta}"
                    </p>
                </div>
                <div style="border-bottom:1px solid rgba(255,255,255,0.12);padding-bottom:16px;margin-bottom:16px;">
                    <strong style="color:#1877f2;">📘 FACEBOOK AD COPY</strong>
                    <p style="margin-top:8px;background:rgba(255,255,255,0.05);padding:12px;border-radius:10px;font-style:italic;">
                        "Vous dirigez ${name} ? 🏆<br>
                        ${lossEst}/an partent en fumée à cause d'une gestion encore manuelle.<br>
                        Congoboost Digital bâtit votre infrastructure digitale en ${sector === 'scolaire' ? '30 jours' : '45 jours'} : Site Pro + WhatsApp Bot + Mobile Money.<br><br>
                        🎯 ${offerText} — Résultats garantis.<br>
                        🔗 Testez l'audit gratuit : congoboost-digital.vercel.app"
                    </p>
                </div>
                <div>
                    <strong style="color:rgba(255,255,255,0.5);">🎵 TIKTOK / REELS SCRIPT</strong>
                    <p style="margin-top:8px;background:rgba(255,255,255,0.05);padding:12px;border-radius:10px;font-style:italic;">
                        <b>Hook 0-3s :</b> "Votre business ${name} perd ${lossEst} par an. Et vous le savez."<br>
                        <b>Corpo 3-15s :</b> Montrez le dashboard Congoboost sur votre téléphone. Texte overlay : "Voici ce que ${lossEst} ressemble sur un tableau de bord automatisé."<br>
                        <b>CTA 15-20s :</b> "Lien en bio → Audit GRATUIT. 60 secondes chrono."
                    </p>
                </div>
            `;
        }

        // ── 5. Notify & scroll ──
        showAgentNotification("AdGenius ✅", `Visuel & textes prêts pour ${name} — Style : ${style}`);
        document.getElementById('ad-results-container').scrollIntoView({ behavior: 'smooth', block: 'start' });

    }, loadSteps.length * 400 + 200);
}

