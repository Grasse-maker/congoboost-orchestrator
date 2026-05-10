/* ============================================================
   pwa-main.js – ITI KAMO PWA Core
   Router · Firebase · Pages · Atlas AI Chat
   ============================================================ */

// ── FIREBASE CONFIG ───────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyDpNESCaG7rsfEJgZGX3YksobfrBsx6r0E",
  authDomain: "kincommerce.firebaseapp.com",
  projectId: "kincommerce",
  storageBucket: "kincommerce.firebasestorage.app",
  messagingSenderId: "966041309497",
  appId: "1:966041309497:web:352b7466019c5a122ed8e8"
};

let db;
if (typeof firebase !== 'undefined') {
  if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();
}

// ── ROUTER ────────────────────────────────────────────────────
const PAGES = {
  dashboard:     renderDashboard,
  students:      renderStudents,
  payments:      renderPayments,
  classes:       renderClasses,
  notifications: renderNotifications,
  atlas:         renderAtlas
};

function navigate(page) {
  document.querySelectorAll('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.page === page));
  const root = document.getElementById('mainContent');
  root.innerHTML = '';
  root.className = 'main-content page-enter';
  (PAGES[page] || renderDashboard)(root);
}

// ── TOAST ─────────────────────────────────────────────────────
function toast(msg, type = 'info', dur = 3500) {
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = msg;
  document.getElementById('toastContainer').appendChild(t);
  setTimeout(() => t.remove(), dur);
}

// ── PAGES ─────────────────────────────────────────────────────
async function renderDashboard(root) {
  root.innerHTML = `
    <div class="page-header">
      <div><h2>Dashboard</h2><p>Vue globale de l'établissement</p></div>
      <button class="btn btn-primary" onclick="navigate('payments')">+ Nouveau Paiement</button>
    </div>
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-icon">👩‍🎓</div><div class="stat-value" id="st-students">--</div><div class="stat-label">Élèves inscrits</div><div class="stat-trend">Actifs</div></div>
      <div class="stat-card"><div class="stat-icon">💰</div><div class="stat-value" id="st-paid">--</div><div class="stat-label">Paiements reçus</div><div class="stat-trend">Ce mois</div></div>
      <div class="stat-card"><div class="stat-icon">⚠️</div><div class="stat-value" id="st-late">--</div><div class="stat-label">Retards de paiement</div><div class="stat-trend down">À relancer</div></div>
      <div class="stat-card"><div class="stat-icon">📚</div><div class="stat-value" id="st-classes">--</div><div class="stat-label">Classes actives</div></div>
    </div>
    <div class="content-grid">
      <div>
        <div class="card">
          <div class="card-title">Derniers Paiements <span class="badge badge-primary">Live</span></div>
          <div class="table-wrap"><table>
            <thead><tr><th>Élève</th><th>Montant</th><th>Méthode</th><th>Statut</th></tr></thead>
            <tbody id="recentPayments"><tr><td colspan="4">Chargement...</td></tr></tbody>
          </table></div>
        </div>
      </div>
      <div>
        <div class="card atlas-box">
          <div class="atlas-header">
            <div class="atlas-avatar">🧠</div>
            <div><div class="atlas-name">Atlas</div><div class="atlas-status">En ligne</div></div>
          </div>
          <div id="atlasQuick" style="font-size:0.875rem;color:var(--text-dim);line-height:1.6;">
            Analyse en cours...
          </div>
          <button class="btn btn-secondary btn-sm" style="margin-top:1rem;width:100%;" onclick="navigate('atlas')">Ouvrir la conversation</button>
        </div>
      </div>
    </div>`;

  // Load stats
  if (db) {
    try {
      const [students, payments] = await Promise.all([
        db.collection('students').get(),
        db.collection('payments').orderBy('timestamp','desc').limit(5).get()
      ]);
      document.getElementById('st-students').textContent = students.size;
      document.getElementById('st-paid').textContent = payments.size;
      let late = 0;
      students.forEach(d => { if (d.data().status === 'late_payment') late++; });
      document.getElementById('st-late').textContent = late;
      document.getElementById('st-classes').textContent = '6';

      const tbody = document.getElementById('recentPayments');
      tbody.innerHTML = '';
      if (payments.empty) {
        tbody.innerHTML = '<tr><td colspan="4" class="empty-state" style="padding:2rem;text-align:center;color:var(--text-dim)">Aucun paiement enregistré</td></tr>';
      } else {
        payments.forEach(doc => {
          const d = doc.data();
          tbody.innerHTML += `<tr>
            <td>${d.student_id || 'N/A'}</td>
            <td><strong>${(d.amount||0).toLocaleString()} CDF</strong></td>
            <td>${d.method || 'Cash'}</td>
            <td><span class="badge badge-success">Confirmé</span></td>
          </tr>`;
        });
      }
    } catch(e) { console.error(e); }
  }

  // Atlas quick insight
  try {
    const res = await fetch('/api/chat', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ message: "Donne-moi en 2 phrases un conseil stratégique court pour ITI KAMO aujourd'hui.", history:[] })
    });
    const data = await res.json();
    document.getElementById('atlasQuick').textContent = data.response || data.message || '';
  } catch(e) {
    document.getElementById('atlasQuick').textContent = "Connectez-vous à Internet pour recevoir le briefing Atlas.";
  }
}

async function renderStudents(root) {
  root.innerHTML = `
    <div class="page-header">
      <div><h2>Gestion des Élèves</h2><p>Tous les élèves de l'établissement</p></div>
      <button class="btn btn-primary" onclick="openAddStudent()">+ Ajouter un élève</button>
    </div>
    <div class="card">
      <div class="search-bar">
        <span>🔍</span>
        <input type="text" id="studentSearch" placeholder="Rechercher un élève..." oninput="filterStudents()"/>
      </div>
      <div class="table-wrap"><table>
        <thead><tr><th>Matricule</th><th>Nom Complet</th><th>Classe</th><th>Statut</th><th>Actions</th></tr></thead>
        <tbody id="studentsBody"><tr><td colspan="5">Chargement...</td></tr></tbody>
      </table></div>
    </div>

    <!-- Add Student Modal -->
    <div id="studentModal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:500;display:none;align-items:center;justify-content:center;">
      <div class="card" style="width:480px;max-width:95vw;">
        <div class="card-title">Ajouter un élève <button onclick="document.getElementById('studentModal').style.display='none'" style="background:none;border:none;color:var(--text-dim);cursor:pointer;font-size:1.2rem;">✕</button></div>
        <div class="form-row">
          <div class="form-group"><label>Prénom</label><input class="form-control" id="s-first" placeholder="Jean" /></div>
          <div class="form-group"><label>Nom</label><input class="form-control" id="s-last" placeholder="Mutombo" /></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>Matricule</label><input class="form-control" id="s-mat" placeholder="KAMO-2026-001" /></div>
          <div class="form-group"><label>Classe</label>
            <select class="form-control" id="s-class">
              <option>6ème A</option><option>6ème B</option><option>5ème</option><option>4ème</option><option>3ème</option><option>2ème</option><option>1ère</option>
            </select>
          </div>
        </div>
        <div class="form-group"><label>Téléphone Parent (WhatsApp)</label><input class="form-control" id="s-phone" placeholder="+243812345678" /></div>
        <button class="btn btn-primary" style="width:100%" onclick="saveStudent()">Enregistrer</button>
      </div>
    </div>`;

  loadStudents();
}

let allStudents = [];
async function loadStudents() {
  if (!db) return;
  const snap = await db.collection('students').orderBy('last_name').get();
  allStudents = [];
  snap.forEach(d => allStudents.push({ id: d.id, ...d.data() }));
  displayStudents(allStudents);
}

function displayStudents(list) {
  const tbody = document.getElementById('studentsBody');
  if (!tbody) return;
  if (!list.length) {
    tbody.innerHTML = '<tr><td colspan="5"><div class="empty-state"><div class="empty-icon">👩‍🎓</div><h3>Aucun élève enregistré</h3></div></td></tr>';
    return;
  }
  tbody.innerHTML = list.map(s => `<tr>
    <td><code>${s.matricule || '--'}</code></td>
    <td><strong>${s.first_name || ''} ${s.last_name || ''}</strong></td>
    <td>${s.class_id || '--'}</td>
    <td><span class="badge badge-${s.status==='enrolled'?'success':s.status==='late_payment'?'warning':'danger'}">${s.status||'enrolled'}</span></td>
    <td><button class="btn btn-secondary btn-sm" onclick="payForStudent('${s.id}','${s.first_name} ${s.last_name}')">Payer</button></td>
  </tr>`).join('');
}

window.filterStudents = () => {
  const q = document.getElementById('studentSearch').value.toLowerCase();
  displayStudents(allStudents.filter(s => `${s.first_name} ${s.last_name} ${s.matricule}`.toLowerCase().includes(q)));
};

window.openAddStudent = () => {
  const m = document.getElementById('studentModal');
  m.style.display = 'flex';
};

window.saveStudent = async () => {
  if (!db) return toast('Firebase non connecté', 'error');
  const student = {
    first_name: document.getElementById('s-first').value.trim(),
    last_name:  document.getElementById('s-last').value.trim(),
    matricule:  document.getElementById('s-mat').value.trim(),
    class_id:   document.getElementById('s-class').value,
    parent_phone: document.getElementById('s-phone').value.trim(),
    status: 'enrolled',
    created_at: firebase.firestore.FieldValue.serverTimestamp()
  };
  if (!student.first_name || !student.last_name) return toast('Remplissez le nom complet', 'error');
  await db.collection('students').add(student);
  document.getElementById('studentModal').style.display = 'none';
  toast('Élève ajouté avec succès !', 'success');
  loadStudents();
};

window.payForStudent = (id, name) => {
  navigate('payments');
  setTimeout(() => {
    const el = document.getElementById('p-student');
    if (el) { el.value = name; el.dataset.studentId = id; }
  }, 300);
};

async function renderPayments(root) {
  root.innerHTML = `
    <div class="page-header">
      <div><h2>Paiements Mobile Money</h2><p>M-Pesa · Orange Money · Cash</p></div>
    </div>
    <div class="content-grid">
      <div class="card">
        <div class="card-title">Nouveau Paiement</div>
        <div class="form-group"><label>Élève</label><input class="form-control" id="p-student" placeholder="Nom de l'élève ou matricule" /></div>
        <div class="form-group"><label>Montant (CDF)</label><input class="form-control" type="number" id="p-amount" placeholder="15000" /></div>
        <div class="form-group"><label>Moyen de Paiement</label>
          <div class="provider-grid">
            <button class="provider-btn selected" data-provider="mpesa" onclick="selectProvider(this)">
              <span class="provider-logo">📱</span>M-Pesa
            </button>
            <button class="provider-btn" data-provider="orange" onclick="selectProvider(this)">
              <span class="provider-logo">🟠</span>Orange Money
            </button>
            <button class="provider-btn" data-provider="cash" onclick="selectProvider(this)">
              <span class="provider-logo">💵</span>Cash
            </button>
            <button class="provider-btn" data-provider="airtel" onclick="selectProvider(this)">
              <span class="provider-logo">📶</span>Airtel Money
            </button>
          </div>
        </div>
        <div class="form-group" id="phoneGroup">
          <label>Numéro de Téléphone</label>
          <input class="form-control" id="p-phone" placeholder="+243812345678" />
        </div>
        <div class="form-group"><label>Référence / Motif</label><input class="form-control" id="p-ref" placeholder="Frais scolaires – Trimestre 1" /></div>
        <button class="btn btn-success" style="width:100%;margin-top:0.5rem" onclick="submitPayment()">
          Confirmer le Paiement
        </button>
        <div id="payStatus" style="margin-top:1rem;display:none;" class="card" style="padding:1rem"></div>
      </div>
      <div>
        <div class="card">
          <div class="card-title">Historique récent</div>
          <div id="payHistory">Chargement...</div>
        </div>
      </div>
    </div>`;

  loadPayHistory();
}

window.selectProvider = (btn) => {
  document.querySelectorAll('.provider-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  document.getElementById('phoneGroup').style.display = btn.dataset.provider === 'cash' ? 'none' : '';
};

window.submitPayment = async () => {
  if (!db) return toast('Firebase non connecté', 'error');
  const student  = document.getElementById('p-student').value.trim();
  const amount   = parseInt(document.getElementById('p-amount').value);
  const phone    = document.getElementById('p-phone').value.trim();
  const ref      = document.getElementById('p-ref').value.trim() || 'Frais scolaires';
  const method   = document.querySelector('.provider-btn.selected')?.dataset.provider || 'cash';

  if (!student || !amount) return toast('Renseignez l\'élève et le montant', 'error');

  toast('Enregistrement du paiement...', 'info');
  try {
    await db.collection('payments').add({
      student_id: student,
      amount, method, phone, reference: ref,
      transaction_id: `TXN-${Date.now()}`,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      confirmed: true
    });
    toast(`Paiement de ${amount.toLocaleString()} CDF confirmé !`, 'success');
    document.getElementById('p-amount').value = '';
    loadPayHistory();
  } catch(e) {
    toast('Erreur lors de l\'enregistrement', 'error');
  }
};

async function loadPayHistory() {
  const el = document.getElementById('payHistory');
  if (!el || !db) return;
  const snap = await db.collection('payments').orderBy('timestamp','desc').limit(8).get();
  if (snap.empty) { el.innerHTML = '<div class="empty-state"><div class="empty-icon">💳</div><h3>Aucun paiement</h3></div>'; return; }
  el.innerHTML = snap.docs.map(d => {
    const p = d.data();
    return `<div style="display:flex;justify-content:space-between;align-items:center;padding:0.75rem 0;border-bottom:1px solid var(--border)">
      <div><strong>${p.student_id}</strong><br><small style="color:var(--text-dim)">${p.method || 'cash'} · ${p.reference || ''}</small></div>
      <div style="text-align:right"><strong>${(p.amount||0).toLocaleString()} CDF</strong><br><span class="badge badge-success" style="font-size:0.65rem">OK</span></div>
    </div>`;
  }).join('');
}

function renderClasses(root) {
  const classes = ['6ème A','6ème B','5ème A','4ème','3ème','2ème','1ère'];
  root.innerHTML = `
    <div class="page-header"><div><h2>Classes</h2><p>Gestion des classes et promotions</p></div></div>
    <div class="stats-grid">
      ${classes.map(c => `
        <div class="stat-card" style="cursor:pointer">
          <div class="stat-icon">📚</div>
          <div class="stat-value">--</div>
          <div class="stat-label">${c}</div>
          <div class="progress" style="margin-top:0.75rem"><div class="progress-fill" style="width:${Math.floor(Math.random()*60+30)}%"></div></div>
        </div>`).join('')}
    </div>`;
}

function renderNotifications(root) {
  root.innerHTML = `
    <div class="page-header"><div><h2>Notifications</h2><p>Alertes WhatsApp et communications parents</p></div>
    <button class="btn btn-primary" onclick="sendBulkWhatsApp()">Envoyer une annonce</button></div>
    <div class="card">
      <div class="card-title">Envoyer une notification WhatsApp</div>
      <div class="form-group"><label>Destinataires</label>
        <select class="form-control" id="n-target">
          <option value="all">Tous les parents</option>
          <option value="late">Parents avec retards de paiement</option>
          <option value="class">Une classe spécifique</option>
        </select>
      </div>
      <div class="form-group"><label>Message</label>
        <textarea class="form-control" id="n-msg" rows="4" placeholder="Chers parents, nous vous informons que..."></textarea>
      </div>
      <button class="btn btn-primary" onclick="sendNotification()">Envoyer</button>
    </div>
    <div class="card"><div class="card-title">Historique</div><div id="notifHistory">Chargement...</div></div>`;

  if (db) {
    db.collection('notifications').orderBy('sent_at','desc').limit(10).get().then(snap => {
      const el = document.getElementById('notifHistory');
      if (snap.empty) { el.innerHTML = '<div class="empty-state"><div class="empty-icon">🔔</div><h3>Aucune notification envoyée</h3></div>'; return; }
      el.innerHTML = snap.docs.map(d => {
        const n = d.data();
        return `<div style="padding:0.75rem 0;border-bottom:1px solid var(--border)">
          <strong>${n.type || 'Annonce'}</strong><br>
          <small style="color:var(--text-dim)">${n.message?.substring(0,80) || ''}</small>
        </div>`;
      }).join('');
    });
  }
}

window.sendNotification = async () => {
  const msg = document.getElementById('n-msg').value.trim();
  if (!msg) return toast('Rédigez un message', 'error');
  if (db) await db.collection('notifications').add({
    type: 'general_announcement', message: msg,
    sent_at: firebase.firestore.FieldValue.serverTimestamp(), status: 'delivered'
  });
  toast('Notification envoyée avec succès !', 'success');
  document.getElementById('n-msg').value = '';
};

function renderAtlas(root) {
  root.innerHTML = `
    <div class="page-header"><div><h2>Atlas IA</h2><p>Votre consultant stratégique intelligent</p></div></div>
    <div class="card atlas-box" style="max-width:720px;margin:0 auto">
      <div class="atlas-header">
        <div class="atlas-avatar">🧠</div>
        <div><div class="atlas-name">Atlas – Agentcy Enterprise</div><div class="atlas-status">Prêt à analyser</div></div>
      </div>
      <div class="atlas-messages" id="atlasMessages">
        <div class="msg msg-atlas">Bonjour ! Je suis Atlas, votre IA stratégique. Posez-moi vos questions sur la gestion de l'établissement, les paiements ou la performance globale.</div>
      </div>
      <div class="atlas-input-row">
        <input class="atlas-input" id="atlasInput" placeholder="Ex: Comment améliorer le taux de recouvrement ?" onkeydown="if(event.key==='Enter')sendAtlas()" />
        <button class="btn btn-primary" onclick="sendAtlas()">Envoyer</button>
      </div>
    </div>`;
}

window.sendAtlas = async () => {
  const input = document.getElementById('atlasInput');
  const msg = input.value.trim();
  if (!msg) return;
  input.value = '';

  const messages = document.getElementById('atlasMessages');
  messages.innerHTML += `<div class="msg msg-user">${msg}</div>`;
  messages.innerHTML += `<div class="msg msg-atlas typing"><span></span><span></span><span></span></div>`;
  messages.scrollTop = messages.scrollHeight;

  try {
    const res = await fetch('/api/chat', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ message: msg, history: [] })
    });
    const data = await res.json();
    messages.querySelector('.typing')?.remove();
    messages.innerHTML += `<div class="msg msg-atlas">${data.response || data.message || 'Désolé, une erreur est survenue.'}</div>`;
  } catch(e) {
    messages.querySelector('.typing')?.remove();
    messages.innerHTML += `<div class="msg msg-atlas">Connexion impossible. Vérifiez votre réseau.</div>`;
  }
  messages.scrollTop = messages.scrollHeight;
};

// ── INIT ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // Splash screen
  setTimeout(() => document.getElementById('splash').classList.add('hidden'), 2000);

  // Sidebar navigation
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      navigate(btn.dataset.page);
      if (window.innerWidth < 768) closeSidebar();
    });
  });

  // Mobile menu toggle
  document.getElementById('menuToggle')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
    document.querySelector('.sidebar-overlay')?.classList.toggle('visible');
  });

  // Overlay click
  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  overlay.onclick = closeSidebar;
  document.body.appendChild(overlay);

  function closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    overlay.classList.remove('visible');
  }

  // Theme toggle
  document.getElementById('themeToggle')?.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
    document.getElementById('themeIcon').textContent = isDark ? '☀️' : '🌙';
  });

  // Online/offline indicator
  const dot = document.getElementById('onlineStatus');
  const updateOnline = () => dot?.classList.toggle('offline', !navigator.onLine);
  window.addEventListener('online', updateOnline);
  window.addEventListener('offline', updateOnline);
  updateOnline();

  // Register service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js').catch(() => {});
  }

  // Initial page
  navigate('dashboard');
});
