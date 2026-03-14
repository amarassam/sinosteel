// ============================================
// SINOSTEEL - JavaScript principal
// ============================================

const API_BASE = 'http://localhost:5000/api';

// ── Navbar ──────────────────────────────────
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const links = document.querySelector('.navbar-links');

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.background = 'rgba(0,0,0,0.99)';
    } else {
      navbar.style.background = 'rgba(13,13,13,0.97)';
    }
  });

  // Hamburger menu
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      links.classList.toggle('open');
    });
  }

  // Lien actif
  const path = window.location.pathname;
  document.querySelectorAll('.navbar-links a').forEach(a => {
    if (a.getAttribute('href') === path || 
        (path === '/' && a.getAttribute('href') === '/') ||
        (path !== '/' && a.getAttribute('href') !== '/' && path.startsWith(a.getAttribute('href')))) {
      a.classList.add('active');
    }
  });
}

// ── Animation au scroll ─────────────────────
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.service-card, .projet-card, .equipe-card, .stat-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
}

// ── Charger les statistiques ─────────────────
async function chargerStatistiques() {
  const container = document.getElementById('stats-container');
  if (!container) return;

  try {
    const res = await fetch(`${API_BASE}/statistiques`);
    const json = await res.json();

    if (json.success && json.data.length > 0) {
      container.innerHTML = json.data.map(stat => `
        <div class="stat-item">
          <div class="stat-icone"><i class="${stat.icone || 'fas fa-star'}"></i></div>
          <div>
            <div class="stat-valeur">${stat.valeur}</div>
            <div class="stat-label">${stat.label}</div>
          </div>
        </div>
      `).join('');
    }
  } catch (e) {
    // Données par défaut si API non disponible
    console.log('API non disponible, données par défaut utilisées.');
  }
}

// ── Charger les services ─────────────────────
async function chargerServices() {
  const container = document.getElementById('services-container');
  if (!container) return;

  container.innerHTML = '<div class="loader"><i class="fas fa-circle-notch"></i> Chargement...</div>';

  try {
    const res = await fetch(`${API_BASE}/services`);
    const json = await res.json();

    if (json.success) {
      container.innerHTML = json.data.map(s => `
        <div class="service-card fade-in">

          ${s.image_url
            ? `<div class="service-img">
                 <img src="${s.image_url}" alt="${s.titre}"
                      style="width:100%;height:180px;object-fit:cover;
                             border-radius:4px 4px 0 0;">
               </div>`
            : `<div class="service-icone">
                 <i class="${s.icone}"></i>
               </div>`
          }

          <div style="padding:20px">
            <h3>${s.titre}</h3>
            <p>${s.description}</p>
          </div>

        </div>
      `).join('');
      initScrollAnimations();
    }
  } catch (e) {
    container.innerHTML = '<p style="color:red;text-align:center">Erreur de chargement.</p>';
  }
}

// ── Charger les projets ──────────────────────
async function chargerProjets(filtre = {}) {
  const container = document.getElementById('projets-container');
  if (!container) return;

  container.innerHTML = '<div class="loader"><i class="fas fa-circle-notch"></i> Chargement...</div>';

  try {
    let url = `${API_BASE}/projets`;
    const params = new URLSearchParams(filtre);
    if (params.toString()) url += '?' + params.toString();

    const res = await fetch(url);
    const json = await res.json();

    if (json.success && json.data.length > 0) {
      container.innerHTML = json.data.map(p => `
        <div class="projet-card fade-in">
          <div class="projet-image">
            ${p.image_url
              ? `<img src="${p.image_url}" alt="${p.titre}"
                      style="width:100%;height:100%;object-fit:cover;">`
              : `<div style="width:100%;height:100%;display:flex;
                             align-items:center;justify-content:center;
                             background:linear-gradient(135deg,var(--acier),var(--acier-clair))">
                   <i class="fas fa-industry" 
                      style="font-size:3rem;color:rgba(255,255,255,0.3)"></i>
                 </div>`
            }
          </div>
          <div class="projet-body">
            <span class="projet-categorie">${formatCategorie(p.categorie)}</span>
            <h3>${p.titre}</h3>
            <p>${p.description ? p.description.substring(0, 100) + '...' : ''}</p>
          </div>
          <div class="projet-footer">
            <span>
              <i class="fas fa-map-marker-alt" 
                 style="color:var(--rouge);margin-right:6px"></i>
              ${p.localisation || 'N/A'}
            </span>
            <span class="statut-badge statut-${p.statut}">
              ${formatStatut(p.statut)}
            </span>
          </div>
        </div>
      `).join('');
      initScrollAnimations();
    } else {
      container.innerHTML = '<p style="text-align:center;color:var(--gris);grid-column:1/-1">Aucun projet trouvé.</p>';
    }
  } catch (e) {
    container.innerHTML = '<p style="color:red;text-align:center;grid-column:1/-1">Erreur de chargement.</p>';
  }
}

// ── Charger l'équipe ─────────────────────────
async function chargerEquipe() {
  const container = document.getElementById('equipe-container');
  if (!container) return;

  try {
    const res = await fetch(`${API_BASE}/equipe`);
    const json = await res.json();

    if (json.success) {
      container.innerHTML = json.data.map(m => `
        <div class="equipe-card fade-in">
          <div class="equipe-avatar">${getInitiales(m.nom)}</div>
          <h3>${m.nom}</h3>
          <div class="equipe-poste">${m.poste}</div>
          <p>${m.biographie || ''}</p>
        </div>
      `).join('');
      initScrollAnimations();
    }
  } catch (e) {
    console.log('Erreur chargement équipe');
  }
}

// ── Formulaire contact ───────────────────────
function initFormulaireContact() {
  const form = document.getElementById('form-contact');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const msgEl = document.getElementById('form-message');

    // Récupérer les données
    const data = {
      nom:       form.querySelector('[name="nom"]').value,
      email:     form.querySelector('[name="email"]').value,
      telephone: form.querySelector('[name="telephone"]')?.value || '',
      sujet:     form.querySelector('[name="sujet"]')?.value || '',
      message:   form.querySelector('[name="message"]').value
    };

    // Désactiver le bouton
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Envoi...';

    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await res.json();

      if (json.success) {
        msgEl.className = 'form-msg success';
        msgEl.textContent = '✓ ' + json.message;
        form.reset();
      } else {
        throw new Error(json.error);
      }
    } catch (err) {
      msgEl.className = 'form-msg error';
      msgEl.textContent = '✗ Erreur: ' + (err.message || 'Vérifiez votre connexion.');
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Envoyer le message';
    }
  });
}

// ── Utilitaires ──────────────────────────────
function getInitiales(nom) {
  return nom.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

function formatStatut(statut) {
  const map = { 'termine': 'Terminé', 'en_cours': 'En cours', 'planifie': 'Planifié' };
  return map[statut] || statut;
}

function formatCategorie(cat) {
  const map = { 'concassage': 'Concassage', 'separation': 'Séparation', 'traitement': 'Traitement', 'construction': 'Construction' };
  return map[cat] || cat;
}

// ── Initialisation ───────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollAnimations();
  chargerStatistiques();
  chargerServices();
  chargerProjets();
  chargerEquipe();
  initFormulaireContact();
});
// ── SLIDER ──────────────────────────────────
let slideActuel = 0;
let intervalSlider;

function afficherSlide(n) {
  const slides = document.querySelectorAll('.slide');
  const dots   = document.querySelectorAll('.dot');
  if (slides.length === 0) return;

  slides.forEach(s => s.classList.remove('active'));
  dots.forEach(d => d.classList.remove('active'));

  slideActuel = (n + slides.length) % slides.length;
  slides[slideActuel].classList.add('active');
  if (dots[slideActuel]) dots[slideActuel].classList.add('active');
}

function changerSlide(direction) {
  afficherSlide(slideActuel + direction);
  clearInterval(intervalSlider);
  intervalSlider = setInterval(() => afficherSlide(slideActuel + 1), 5000);
}

function allerSlide(n) {
  afficherSlide(n);
  clearInterval(intervalSlider);
  intervalSlider = setInterval(() => afficherSlide(slideActuel + 1), 5000);
}

// Démarrage automatique
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelectorAll('.slide').length > 0) {
    intervalSlider = setInterval(() => afficherSlide(slideActuel + 1), 5000);
  }
});
// ── TRADUCTIONS ──────────────────────────────
const traductions = {
  fr: {
    // Navbar
    'nav-accueil':  'Accueil',
    'nav-apropos':  'À Propos',
    'nav-services': 'Services',
    'nav-projets':  'Projets',
    'nav-contact':  'Contact',
    // Hero
    'hero-badge':   'Expertise Industrielle — Algérie',
    'hero-titre1':  'Construire',
    'hero-titre2':  "L'Industrie",
    'hero-titre3':  'de Demain',
    'hero-desc':    "Sinosteel conçoit et construit des usines industrielles complètes pour le traitement, le concassage et la séparation à sec des minerais.",
    'hero-btn1':    'Nos Projets',
    'hero-btn2':    'Nous Contacter',
    // Stats
    'stat1-label':  'Projets Réalisés',
    'stat2-label':  "Années d'Expérience",
    'stat3-label':  'Tonnes / Heure',
    'stat4-label':  "Pays d'Intervention",
    // About
    'about-tag':    'Qui Sommes-Nous',
    'about-titre':  'Experts en Traitement Industriel Minier',
    'about-desc':   "Sinosteel est une entreprise spécialisée dans la conception, la construction et la mise en service d'usines industrielles.",
    // Footer
    'footer-desc':  "Spécialiste en construction d'usines industrielles pour le traitement, concassage et séparation à sec.",
    // Contact
    'contact-adresse': 'Gara Djebilet, Tindouf\nAlgérie',
  },
  en: {
    // Navbar
    'nav-accueil':  'Home',
    'nav-apropos':  'About',
    'nav-services': 'Services',
    'nav-projets':  'Projects',
    'nav-contact':  'Contact',
    // Hero
    'hero-badge':   'Industrial Expertise — Algeria',
    'hero-titre1':  'Building',
    'hero-titre2':  "Tomorrow's",
    'hero-titre3':  'Industry',
    'hero-desc':    "Sinosteel designs and builds complete industrial plants for ore processing, crushing and dry separation.",
    'hero-btn1':    'Our Projects',
    'hero-btn2':    'Contact Us',
    // Stats
    'stat1-label':  'Completed Projects',
    'stat2-label':  'Years of Experience',
    'stat3-label':  'Tons / Hour',
    'stat4-label':  'Countries',
    // About
    'about-tag':    'Who We Are',
    'about-titre':  'Industrial Mining Processing Experts',
    'about-desc':   "Sinosteel specializes in the design, construction and commissioning of complete industrial plants for ore processing.",
    // Footer
    'footer-desc':  "Specialist in industrial plant construction for ore processing, crushing and dry separation.",
    // Contact
    'contact-adresse': 'Gara Djebilet, Tindouf\nAlgeria',
  },
  zh: {
    // Navbar
    'nav-accueil':  '首页',
    'nav-apropos':  '关于我们',
    'nav-services': '服务',
    'nav-projets':  '项目',
    'nav-contact':  '联系我们',
    // Hero
    'hero-badge':   '工业专业知识 — 阿尔及利亚',
    'hero-titre1':  '建设',
    'hero-titre2':  '明日',
    'hero-titre3':  '工业',
    'hero-desc':    '中钢集团设计和建造用于矿石处理、破碎和干式分选的完整工业设施。',
    'hero-btn1':    '我们的项目',
    'hero-btn2':    '联系我们',
    // Stats
    'stat1-label':  '完成项目',
    'stat2-label':  '年经验',
    'stat3-label':  '吨/小时',
    'stat4-label':  '国家',
    // About
    'about-tag':    '关于我们',
    'about-titre':  '矿业工业处理专家',
    'about-desc':   '中钢集团专注于矿石处理完整工业设施的设计、建造和调试。',
    // Footer
    'footer-desc':  '专注于矿石处理、破碎和干式分选工业设施建设。',
    // Contact
    'contact-adresse': '加拉·杰比莱特，廷杜夫\n阿尔及利亚',
  }
};

let langueActuelle = localStorage.getItem('langue') || 'fr';

function changerLangue(langue) {
  langueActuelle = langue;
  localStorage.setItem('langue', langue);

  // Mettre à jour le bouton
  const noms = { fr: 'FR', en: 'EN', zh: '中文' };
  document.getElementById('lang-actuel').textContent = noms[langue];

  // Mettre à jour les options actives
  document.querySelectorAll('.lang-option').forEach(el => {
    el.classList.remove('active');
    if (el.getAttribute('onclick').includes(langue)) {
      el.classList.add('active');
    }
  });

  // Appliquer les traductions
  const t = traductions[langue];
  Object.keys(t).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = t[id];
  });

  // Fermer le dropdown
  document.getElementById('lang-dropdown').classList.remove('open');
}

// Appliquer la langue au chargement
document.addEventListener('DOMContentLoaded', () => {
  changerLangue(langueActuelle);
});
