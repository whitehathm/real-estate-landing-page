/* Meridian Realty Maroc: JavaScript pur, sans dépendances. */
(function () {
  'use strict';

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const money = (n) => Math.round(n).toLocaleString('fr-MA') + ' DH';

  /* ---------- Stockage ---------- */
  const mem = {};
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return k in mem ? mem[k] : d; } },
    set(k, v) { mem[k] = v; try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* indisponible */ } }
  };

  /* ---------- Icônes ---------- */
  const PATHS = {
    heart: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
    arrow: '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
    menu: '<line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>',
    check: '<polyline points="20 6 9 17 4 12"/>',
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
    mail: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
    pin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>'
  };
  const icon = (n, s) => `<svg class="i" width="${s || 20}" height="${s || 20}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${PATHS[n] || ''}</svg>`;
  const hydrate = (root) => $$('[data-icon]', root).forEach((el) => { if (!el.firstChild) el.innerHTML = icon(el.dataset.icon, Number(el.dataset.size) || 22); });

  /* ---------- Images des biens ---------- */
  const IMGS = {
    riadMarrakech: 'https://images.openai.com/static-rsc-4/pKzIz5VuifefyHp0gNDVSimZLNGnFSwEMwF1_3-Bv7zQV1M0943Mv0S6bIjMyBkjSgmzn4lwqPOoXlfwKr8WAw_uAre37t5MayoSRezQOczKXuGBLJgEZVr1FpClk8VWVYRayC1STAV_WHI6rKd1bS7_mjlsW-em-VLagwiy3NNmN765KA938Uixqx_WurJl?purpose=fullsize',
    aptCasa: 'https://images.openai.com/static-rsc-4/eHVGFiQyq6tM-z9xcBTy3HY2e6kFIMTgv4VdwNRFhYJCUxa3riwne-9i1JOeD_tfcW0NUgNBVSXYrKXrYpLHkNewvik1x3AlcOfFRU0WAKRB6U_r72oEBGEOkdCZxPViBRuQL6KbtU1LX7X-GZenSKX_PzQNM5zxfCKMieP4kKP-PsXd-udkDnf20ydrATe7?purpose=fullsize',
    villaRabat: 'https://images.openai.com/static-rsc-4/ReTvNq-PtlsnT2gZ7tbrCBHm5gHxs5EeBF0FZetuSX85kQ3V5cRytd3UrkrtscLmZeyGKmBnp13LcglsLjN55orKeg_fhxFuIk4BdiKlGjAvQS_JdfuGHlT8CChC4VSEeopkJkUfI1bmrXJxCVOdSAbvzfU9qjjR1R2J84a5txw6rBAat5pPKDbKcK2QO2EO?purpose=fullsize',
    aptTanger: 'https://images.openai.com/static-rsc-4/nSy3lbMeDjyf2K71T6AiNW7h34I-ourMCkzBZd7nx00cgQbfqiAfXzTG8_YGG5vo7ncB4WLjGAoD4i98w9hi3ApshYORM5ztgXoR4blCYcBvGvNrt4S0shEFc8aihpAEHR7UjUKmv2cjwmGJdwjK5gUTVBD1my6C5dyxcwwj2vDue8rx8MmEw1sOQKZGgm9F?purpose=fullsize',
    villaAgadir: 'https://images.openai.com/static-rsc-4/tmVRKBbEYJEG1rblC2phVIiLmyYLvXPKO7cTFrMbZYGaUJ1_68ZQHQFgZ6c8o2FtXc0UvD6lp66mndjyOd2BO9k8vDr1siJUS_aRDEk30YWmKKB5kQSqgqcexPGGccIYdeQppYwQJB0ssJiAzBpLixDnegzug9VfWLBunGOxXlQkDRhfZekOtZlp9incu5iA?purpose=fullsize',
    riadFes: 'https://images.openai.com/static-rsc-4/6ABjmNLyqd0NsuD3J6nW4Ik7y0S4OI7CVBn-eq3nftAojHZsjwd-lRHQkCuEENbHQqnw6BZWtA9kJ3XI0BplWMMwzKcKUkNGIMFbXghad0HMmw5YGqexz6bWz3y9aph0lh3kxDQJXhefLlYjzeUA2EpoWiodNaVkYt7-7mBPfkh4qmbnmtEA4OgpUtasB0MF?purpose=fullsize'
  };

  /* ---------- Villes & Données ---------- */
  const LOCS = [
    { name: 'Marrakech', img: IMGS.riadMarrakech, hue: 25, ppsm: 18500, blurb: 'Riads authentiques en Médina, villas de luxe à la Palmeraie et appartements modernes à Guéliz.', tags: ['Riads', 'Palmeraie', 'Investissement'] },
    { name: 'Casablanca', img: IMGS.aptCasa, hue: 215, ppsm: 21000, blurb: 'Capitale économique : appartements haut standing à Anfa, Racine et villas à Californie.', tags: ['Affaires', 'Bord de mer', 'Moderne'] },
    { name: 'Rabat', img: IMGS.villaRabat, hue: 150, ppsm: 19500, blurb: 'Quartiers résidentiels verdoyants à Souissi, Hay Riad et appartements élégants à Agdal.', tags: ['Résidentiel', 'Calme', 'Prestige'] },
    { name: 'Tanger', img: IMGS.aptTanger, hue: 195, ppsm: 16500, blurb: 'Penthouses avec vue imprenable sur le détroit, Malabata et villas sur la Vieille Montagne.', tags: ['Vue Mer', 'Marina', 'Dynamique'] },
    { name: 'Agadir', img: IMGS.villaAgadir, hue: 35, ppsm: 15000, blurb: 'Villas contemporaines avec piscine, résidences balnéaires à Founty et Taghazout Bay.', tags: ['Soleil', 'Plage', 'Villas'] },
    { name: 'Fès', img: IMGS.riadFes, hue: 15, ppsm: 12500, blurb: 'Demeures historiques restaurées dans la Médina et appartements familiaux à Ville Nouvelle.', tags: ['Patrimoine', 'Artisanat', 'Culture'] },
    { name: 'Essaouira', img: IMGS.riadMarrakech, hue: 185, ppsm: 14000, blurb: 'Maisons de charme face à l’océan Atlantique et domaines arborés aux portes de la ville.', tags: ['Océan', 'Sérénité', 'Charme'] },
    { name: 'Tétouan', img: IMGS.aptTanger, hue: 170, ppsm: 13000, blurb: 'Résidences estivales sur la côte Tamuda Bay, Cabo Negro et appartements au centre-ville.', tags: ['Tamuda Bay', 'Côte', 'Famille'] }
  ];

  const TYPES = ['Appartement', 'Villa', 'Riad', 'Terrain', 'Maison'];

  const P = [
    { id: 1, img: IMGS.riadMarrakech, gallery: [IMGS.riadMarrakech, IMGS.riadFes, IMGS.villaRabat, IMGS.aptCasa], status: 'sale', price: 4850000, title: 'Riad Authentique avec Patio & Bassin', address: 'Derb Dabachi, Médina', loc: 'Marrakech', type: 'Riad', beds: 5, baths: 5, sqm: 310, year: 2019, agent: 1, featured: true },
    { id: 2, img: IMGS.aptCasa, gallery: [IMGS.aptCasa, IMGS.aptTanger, IMGS.villaRabat, IMGS.villaAgadir], status: 'rent', price: 16500, title: 'Appartement Haut Standing à Racine', address: 'Rue Normandie, Quartier Racine', loc: 'Casablanca', type: 'Appartement', beds: 3, baths: 2, sqm: 145, year: 2022, agent: 2, featured: true },
    { id: 3, img: IMGS.villaRabat, gallery: [IMGS.villaRabat, IMGS.villaAgadir, IMGS.aptCasa, IMGS.riadMarrakech], status: 'sale', price: 8900000, title: 'Villa Contemporaine avec Jardin à Souissi', address: 'Avenue Imam Malik, Souissi', loc: 'Rabat', type: 'Villa', beds: 5, baths: 4, sqm: 580, year: 2021, agent: 3, featured: true },
    { id: 4, img: IMGS.aptTanger, gallery: [IMGS.aptTanger, IMGS.aptCasa, IMGS.villaAgadir, IMGS.villaRabat], status: 'sale', price: 3400000, title: 'Penthouse Vue Mer & Piscine à Malabata', address: 'Boulevard Mohamed VI, Malabata', loc: 'Tanger', type: 'Appartement', beds: 3, baths: 3, sqm: 195, year: 2023, agent: 4, featured: true },
    { id: 5, img: IMGS.villaAgadir, gallery: [IMGS.villaAgadir, IMGS.villaRabat, IMGS.aptCasa, IMGS.riadMarrakech], status: 'sale', price: 5200000, title: 'Villa Moderne avec Piscine Chauffée', address: 'Quartier Founty, Haut Founty', loc: 'Agadir', type: 'Villa', beds: 4, baths: 4, sqm: 420, year: 2022, agent: 1, featured: true },
    { id: 6, img: IMGS.riadFes, gallery: [IMGS.riadFes, IMGS.riadMarrakech, IMGS.villaRabat, IMGS.aptCasa], status: 'sale', price: 2950000, title: 'Riad Historique Restauré à Batha', address: 'Quartier Batha, Médina', loc: 'Fès', type: 'Riad', beds: 6, baths: 6, sqm: 340, year: 2018, agent: 3, featured: true },
    { id: 7, img: IMGS.aptCasa, gallery: [IMGS.aptCasa, IMGS.aptTanger, IMGS.villaRabat, IMGS.villaAgadir], status: 'sale', price: 2650000, title: 'Appartement Lumineux à Casa Finance City', address: 'Boulevard de l’Aéropostale, CFC', loc: 'Casablanca', type: 'Appartement', beds: 2, baths: 2, sqm: 120, year: 2024, agent: 2 },
    { id: 8, img: IMGS.aptTanger, gallery: [IMGS.aptTanger, IMGS.aptCasa, IMGS.villaAgadir, IMGS.riadMarrakech], status: 'rent', price: 11000, title: 'Appartement Balnéaire à Cabo Negro', address: 'Route de Ceuta, Cabo Negro', loc: 'Tétouan', type: 'Appartement', beds: 2, baths: 2, sqm: 110, year: 2021, agent: 4 },
    { id: 9, img: IMGS.riadMarrakech, gallery: [IMGS.riadMarrakech, IMGS.riadFes, IMGS.villaAgadir, IMGS.villaRabat], status: 'rent', price: 14000, title: 'Maison de Charme Proche des Remparts', address: 'Quartier Skala, Médina', loc: 'Essaouira', type: 'Maison', beds: 3, baths: 2, sqm: 165, year: 2017, agent: 1 },
    { id: 10, img: IMGS.villaAgadir, gallery: [IMGS.villaAgadir, IMGS.villaRabat, IMGS.riadMarrakech, IMGS.aptCasa], status: 'sale', price: 1850000, title: 'Terrain Constructible Résidentiel Viabilisé', address: 'Route de l’Ourika, Km 9', loc: 'Marrakech', type: 'Terrain', beds: 0, baths: 0, sqm: 1200, year: 2026, agent: 1 },
    { id: 11, img: IMGS.villaRabat, gallery: [IMGS.villaRabat, IMGS.aptCasa, IMGS.villaAgadir, IMGS.aptTanger], status: 'rent', price: 24000, title: 'Maison Familiale avec Jardin à Hay Riad', address: 'Secteur 14, Hay Riad', loc: 'Rabat', type: 'Maison', beds: 4, baths: 3, sqm: 280, year: 2020, agent: 3 },
    { id: 12, img: IMGS.aptTanger, gallery: [IMGS.aptTanger, IMGS.aptCasa, IMGS.villaRabat, IMGS.villaAgadir], status: 'sale', price: 1790000, title: 'Appartement Neuf au Centre-Ville', address: 'Avenue Mohamed V, Centre', loc: 'Tétouan', type: 'Appartement', beds: 3, baths: 2, sqm: 130, year: 2024, agent: 4 }
  ];

  const AGENTS = [
    { id: 1, name: 'Salma Bennani', role: 'Directrice Agence Marrakech & Sud', rating: 5, reviews: 148, hue: 25, phone: '+212 6 61 24 89 10', email: 'salma@meridianrealty.ma', langs: 'Arabe, Français, Anglais', sold: 215, spec: ['Riads & Maisons d’hôtes', 'Marrakech', 'Investissement'], bio: 'Salma accompagne depuis 12 ans les acquéreurs marocains et internationaux dans l’acquisition de riads authentiques, villas et terrains à Marrakech et Essaouira.' },
    { id: 2, name: 'Youssef Alami', role: 'Conseiller Senior Casablanca', rating: 4.9, reviews: 112, hue: 215, phone: '+212 6 61 45 32 19', email: 'youssef@meridianrealty.ma', langs: 'Arabe, Français, Anglais', sold: 184, spec: ['Appartements Haut Standing', 'Anfa & CFC', 'Premier Achat'], bio: 'Spécialiste du marché casablancais, Youssef guide ses clients à chaque étape, de l’estimation précise jusqu’à la signature chez le notaire.' },
    { id: 3, name: 'Nadia Tazi', role: 'Experte Résidentiel Rabat & Fès', rating: 4.9, reviews: 94, hue: 150, phone: '+212 6 62 78 11 04', email: 'nadia@meridianrealty.ma', langs: 'Arabe, Français', sold: 162, spec: ['Villas Familiales', 'Souissi & Hay Riad', 'Locations Longue Durée'], bio: 'Nadia sélectionne rigoureusement des villas et résidences calmes pour les familles, diplomates et cadres s’installant à Rabat et Fès.' },
    { id: 4, name: 'Karim Chaoui', role: 'Conseiller Prestige Nord (Tanger & Tétouan)', rating: 4.8, reviews: 86, hue: 195, phone: '+212 6 61 90 54 77', email: 'karim@meridianrealty.ma', langs: 'Arabe, Français, Espagnol', sold: 129, spec: ['Vue Mer & Penthouses', 'Malabata', 'Tamuda Bay'], bio: 'Karim maîtrise parfaitement le littoral nord du Royaume et propose les meilleures opportunités à Tanger et sur la côte de Tétouan.' }
  ];

  const REVIEWS = [
    ['Mehdi & Leila K.', 'Achat d’un appartement à Casablanca', 'Youssef nous a accompagnés avec un grand professionnalisme du début à la fin. Tout a été clair et rapide chez le notaire.'],
    ['Jean-Luc M.', 'Acquisition d’un Riad à Marrakech', 'Salma connaît chaque ruelle de la Médina et les aspects juridiques (Titrage, VNA). Une expertise précieuse.'],
    ['Houda B.', 'Location d’une maison à Rabat', 'Nadia a trouvé exactement la maison que nous cherchions à Hay Riad en moins d’une semaine.'],
    ['Tariq & Samira E.', 'Investissement à Tanger', 'Karim nous a présenté un penthouse vue mer à Malabata avec une rentabilité locative excellente.'],
    ['Claire D.', 'Installation à Essaouira', 'Équipe réactive, à l’écoute et transparente sur tous les frais. Je recommande Meridian Realty sans hésiter.']
  ];

  const FEATS = ['Climatisation centralisée', 'Sol en marbre & zellige', 'Cuisine équipée', 'Parking sous-sol titré', 'Terrasse / Jardin privatif', 'Domotique & Sécurité 24/7', 'Dressing spacieux', 'Buanderie intégrée', 'Double vitrage isolant', 'Box de rangement', 'Ascenseur moderne', 'Fibre optique haut débit'];

  const FAQ = [
    ['Achat', 'Comment se déroule l’achat d’un bien immobilier au Maroc ?', 'Une fois le bien choisi, nous rédigeons un compromis de vente devant notaire avec un acompte sécurisé, suivi de l’acte définitif et de l’inscription à la Conservation Foncière.'],
    ['Achat', 'Quels sont les frais de notaire et d’enregistrement ?', 'Il faut prévoir environ 6 % à 7 % du prix du bien (droits d’enregistrement, conservation foncière et honoraires du notaire).'],
    ['Crédit', 'Quel apport personnel faut-il pour un crédit immobilier ?', 'Les banques marocaines financent généralement jusqu’à 80 % à 90 % de la valeur du bien, soit un apport de 10 % à 20 %. Utilisez notre simulateur pour estimer vos mensualités.'],
    ['Vente', 'Comment estimez-vous la valeur de mon bien ?', 'Nous analysons les transactions récentes dans votre quartier, l’état du bien, son orientation et la demande actuelle. Demandez une estimation gratuite sur la page Vendre.'],
    ['Location', 'Quels documents sont nécessaires pour louer ?', 'Une pièce d’identité (CIN ou passeport), les justificatifs de revenus récents, un dépôt de garantie (généralement 1 à 2 mois) et la signature d’un contrat de bail légalisé.'],
    ['Visites', 'Puis-je visiter un bien à distance par vidéo ?', 'Oui, nos agents organisent des visites en direct par WhatsApp ou appel vidéo pour nos clients résidant à l’étranger (MRE et investisseurs internationaux).']
  ];

  /* ---------- Utilitaires ---------- */
  const locOf = (p) => LOCS.find((l) => l.name === p.loc) || LOCS[0];
  const agentOf = (p) => AGENTS.find((a) => a.id === p.agent) || AGENTS[0];
  const byId = (id) => P.find((p) => p.id === Number(id));
  const shade = (hue) => `linear-gradient(135deg,hsl(${hue} 45% 28%),hsl(${(hue + 25) % 360} 50% 42%))`;
  const priceHTML = (p) => p.status === 'rent' ? `${money(p.price)}<small>/mois</small>` : money(p.price);
  const initials = (n) => n.split(' ').map((w) => w[0]).slice(0, 2).join('');
  const stars = (r) => `<span class="stars" aria-hidden="true">${'★'.repeat(Math.round(r))}${'☆'.repeat(5 - Math.round(r))}</span>`;
  const featsOf = (p) => [0, 1, 2, 3, 4, 5].map((k) => FEATS[(p.id * 3 + k * 2) % FEATS.length]).filter((v, i, a) => a.indexOf(v) === i);
  const descOf = (p) => p.type === 'Terrain'
    ? `${p.title} situé à ${p.loc} (${p.address}), d’une superficie totale de ${p.sqm.toLocaleString('fr-MA')} m². Terrain titré offrant un fort potentiel résidentiel ou d’investissement avec accès rapide aux grands axes.`
    : `${p.title} situé à ${p.loc} (${p.address}). Ce bien de type ${p.type.toLowerCase()} offre ${p.beds} chambres, ${p.baths} salle${p.baths > 1 ? 's' : ''} de bain et une surface habitable de ${p.sqft ? p.sqft : p.sqm.toLocaleString('fr-MA')} m². Construit ou rénové en ${p.year}, il bénéficie de belles finitions, d’une luminosité optimale et d’un emplacement recherché proche des commodités.`;

  /* ---------- État ---------- */
  const DEF = { q: '', loc: 'Toutes', type: 'Tous', status: 'Any', max: 0, beds: 0, sort: 'featured' };
  const state = { fav: store.get('mer-ma-fav', []), tours: store.get('mer-ma-tours', []), f: { ...DEF } };
  const saveAll = () => { store.set('mer-ma-fav', state.fav); store.set('mer-ma-tours', state.tours); };

  function filtered() {
    const f = state.f, q = f.q.trim().toLowerCase();
    let list = P.filter((p) => (f.loc === 'Toutes' || p.loc === f.loc) && (f.type === 'Tous' || p.type === f.type) && (f.status === 'Any' || p.status === f.status) && (!f.max || p.status === 'rent' || p.price <= f.max) && p.beds >= f.beds && (!q || (p.title + ' ' + p.address + ' ' + p.loc + ' ' + p.type).toLowerCase().includes(q)));
    const sorts = { 'price-asc': (a, b) => a.price - b.price, 'price-desc': (a, b) => b.price - a.price, beds: (a, b) => b.beds - a.beds, sqm: (a, b) => b.sqm - a.sqm, newest: (a, b) => b.year - a.year };
    if (sorts[f.sort]) list = list.slice().sort(sorts[f.sort]);
    return list;
  }

  /* ---------- Composants ---------- */
  function card(p) {
    const on = state.fav.includes(p.id);
    const meta = p.type === 'Terrain'
      ? `<span>📐 ${p.sqm.toLocaleString('fr-MA')} m²</span><span>📄 Titré</span>`
      : `<span>🛏️ ${p.beds} ch.</span><span>🚿 ${p.baths} sdb</span><span>📐 ${p.sqm.toLocaleString('fr-MA')} m²</span>`;
    return `
    <article class="pcard">
      <a class="pimg" href="#/property/${p.id}" aria-label="${esc(p.title)}">
        <img src="${p.img}" alt="${esc(p.title)}" loading="lazy">
        <span class="badge ${p.status === 'rent' ? 'rent' : ''}">${p.status === 'rent' ? 'À Louer' : 'À Vendre'}</span>
      </a>
      <button class="fav ${on ? 'on' : ''}" data-action="fav" data-id="${p.id}" aria-label="Sauvegarder ce bien">${icon('heart', 18)}</button>
      <div class="pinfo">
        <div class="price">${priceHTML(p)}</div>
        <a class="ptitle" href="#/property/${p.id}">${p.title}</a>
        <div class="addr">${p.address}, ${p.loc}</div>
        <div class="meta">${meta}</div>
      </div>
    </article>`;
  }
  const agentCard = (a) => `<a class="acard" href="#/agent/${a.id}"><div class="avatar" style="background:${shade(a.hue)}">${initials(a.name)}</div><h3>${a.name}</h3><p class="muted">${a.role}</p><p>${stars(a.rating)} <small class="muted">${a.rating} (${a.reviews} avis)</small></p></a>`;
  const reviewCard = (r, i) => `<figure class="review">${stars(5)}<blockquote>« ${r[2]} »</blockquote><figcaption><span class="avatar" style="background:${shade(i * 70 + 200)}">${initials(r[0])}</span><span>${r[0]}<small>${r[1]}</small></span></figcaption></figure>`;
  const carBtns = `<div class="car-btns"><button data-action="car" data-d="-1" aria-label="Précédent">${icon('arrow', 18)}</button><button data-action="car" data-d="1" aria-label="Suivant">${icon('arrow', 18)}</button></div>`;
  const head = (title, sub, crumbs) => `<div class="page-head"><div class="container"><nav class="crumbs" aria-label="Fil d'Ariane"><a href="#/">Accueil</a>${(crumbs || []).map((c) => ' / ' + c).join('')}</nav><h1>${title}</h1>${sub ? `<p>${sub}</p>` : ''}</div></div>`;
  const opts = (list, cur, any) => ((any ? [any] : []).concat(list)).map((v) => `<option ${v === cur ? 'selected' : ''}>${v}</option>`).join('');

  /* ---------- Pages ---------- */
  const pages = {};

  pages.home = () => {
    const feats = [['🧑‍💼', 'Conseillers Experts', 'Une connaissance pointue de chaque quartier du Royaume.'], ['✅', 'Biens Vérifiés', 'Titres fonciers contrôlés et visites préalables garanties.'], ['💰', 'Estimation Juste', 'Des prix alignés sur la réalité du marché immobilier marocain.'], ['💬', 'Accompagnement Complet', 'De la première visite jusqu’à la signature chez le notaire.']]
      .map((f) => `<div class="feature"><span class="ico">${f[0]}</span><h3>${f[1]}</h3><p>${f[2]}</p></div>`).join('');
    return `
    <section class="hero"><div class="container hero-inner">
      <span class="pill">L’immobilier de confiance au Maroc</span>
      <h1>Trouvez le bien<br>qui vous ressemble.</h1>
      <p>Découvrez notre sélection de villas, riads, appartements et terrains à travers les plus belles villes du Maroc.</p>
    </div></section>
    <div class="container">
      <form class="search-card" data-form="hero-search">
        <div class="field"><label>Ville</label><select name="loc">${opts(LOCS.map((l) => l.name), 'Toutes', 'Toutes les villes')}</select></div>
        <div class="field"><label>Type de bien</label><select name="type">${opts(TYPES, 'Tous', 'Tous les types')}</select></div>
        <div class="field"><label>Budget Max (DH)</label><select name="max"><option value="0">Sans limite</option><option value="1500000">1 500 000 DH</option><option value="3000000">3 000 000 DH</option><option value="5000000">5 000 000 DH</option><option value="10000000">10 000 000 DH+</option></select></div>
        <button class="btn btn-gold btn-lg">Rechercher</button>
      </form>
      <div class="stats-bar" id="statsBar">
        <div><b data-count="1450" data-suffix="+">0</b><span>Biens Vendus</span></div>
        <div><b data-count="16">0</b><span>Années d’Expérience</span></div>
        <div><b data-count="8200" data-suffix="+">0</b><span>Clients Satisfaits</span></div>
        <div><b data-count="8">0</b><span>Villes Principales</span></div>
      </div>
    </div>
    <section class="section"><div class="container">
      <div class="section-head"><div><span class="eyebrow">Sélection Exclusive</span><h2>Biens à la Une</h2><p>Nos meilleures opportunités immobilières ce mois-ci au Maroc</p></div>${carBtns}</div>
      <div class="carousel">${P.filter((p) => p.featured).map(card).join('')}</div>
      <p class="center" style="margin-top:12px"><a class="btn btn-outline" href="#/properties">Voir tous les biens</a></p>
    </div></section>
    <section class="section alt"><div class="container">
      <div class="section-head center"><div><span class="eyebrow">Pourquoi Meridian Maroc</span><h2>L’excellence immobilière</h2><p>Un accompagnement sur mesure pour acheter, vendre ou louer en toute sérénité</p></div></div>
      <div class="features">${feats}</div>
    </div></section>
    <section class="section"><div class="container">
      <div class="section-head"><div><span class="eyebrow">Explorer</span><h2>Parcourir par ville</h2><p>Choisissez votre destination parmi les villes phares du Royaume</p></div><a class="link-more" href="#/neighborhoods">Toutes les villes ${icon('arrow', 16)}</a></div>
      <div class="hoods">${LOCS.slice(0, 3).map(hood).join('')}</div>
    </div></section>
    <section class="section alt"><div class="container">
      <div class="section-head"><div><span class="eyebrow">Notre Équipe</span><h2>Nos Conseillers Seniors</h2><p>Des experts locaux à votre écoute</p></div>${carBtns}</div>
      <div class="carousel quad">${AGENTS.map(agentCard).join('')}</div>
    </div></section>
    <section class="section"><div class="container">
      <div class="section-head"><div><span class="eyebrow">Témoignages</span><h2>Ce que disent nos clients</h2></div>${carBtns}</div>
      <div class="carousel">${REVIEWS.map(reviewCard).join('')}</div>
    </div></section>
    <section class="section tight"><div class="container"><div class="cta">
      <h2>Prêt à concrétiser votre projet immobilier ?</h2>
      <p>Décrivez-nous votre recherche et un conseiller Meridian Maroc vous recontactera sous 24h.</p>
      <a class="btn btn-gold btn-lg" href="#/contact">Nous contacter</a>
    </div></div></section>`;
  };

  const hood = (l) => `<a class="hood" href="#/properties/${l.name}"><div class="pimg"><img src="${l.img}" alt="${esc(l.name)}" loading="lazy"></div><div class="pinfo"><h3>${l.name}</h3><p>${l.blurb}</p><div class="tags">${l.tags.map((t) => `<span class="tag">${t}</span>`).join('')}</div><p style="margin-top:10px"><b>${P.filter((p) => p.loc === l.name).length}</b> annonce(s)</p></div></a>`;

  function resultsHTML() {
    const list = filtered();
    return `<div class="results-bar"><b>${list.length} bien${list.length > 1 ? 's' : ''} trouvé${list.length > 1 ? 's' : ''}</b><span class="muted">Les loyers sont affichés par mois. Le budget maximum s’applique aux biens à vendre.</span></div>${list.length ? `<div class="grid">${list.map(card).join('')}</div>` : `<div class="empty"><span class="emoji-xl">🔎</span><h3>Aucun bien ne correspond</h3><p>Essayez de modifier vos critères de recherche.</p><button class="btn btn-navy" data-action="clear-filters">Réinitialiser les filtres</button></div>`}`;
  }

  pages.properties = (a, b) => {
    if (a !== undefined) {
      state.f = { ...DEF };
      if (a === 'type' && TYPES.includes(decodeURIComponent(b))) state.f.type = decodeURIComponent(b);
      else if (a === 'status' && (b === 'sale' || b === 'rent')) state.f.status = b;
      else if (LOCS.some((l) => l.name === decodeURIComponent(a))) state.f.loc = decodeURIComponent(a);
    }
    const f = state.f;
    const maxOpts = [[0, 'Sans limite'], [1500000, '1 500 000 DH'], [3000000, '3 000 000 DH'], [5000000, '5 000 000 DH'], [10000000, '10 000 000 DH']].map((o) => `<option value="${o[0]}" ${f.max === o[0] ? 'selected' : ''}>${o[1]}</option>`).join('');
    const bedOpts = [[0, 'Toutes'], [1, '1+'], [2, '2+'], [3, '3+'], [4, '4+']].map((o) => `<option value="${o[0]}" ${f.beds === o[0] ? 'selected' : ''}>${o[1]}</option>`).join('');
    const sortOpts = [['featured', 'En vedette'], ['price-asc', 'Prix : croissant'], ['price-desc', 'Prix : décroissant'], ['beds', 'Plus de chambres'], ['sqm', 'Plus grande surface'], ['newest', 'Plus récent']].map((o) => `<option value="${o[0]}" ${f.sort === o[0] ? 'selected' : ''}>${o[1]}</option>`).join('');
    return `
    ${head('Nos Biens Immobiliers', 'Appartements, villas, riads, maisons et terrains à vendre ou à louer au Maroc.', ['Biens'])}
    <div class="container">
      <div class="filter-bar">
        <div class="field span-all"><label>Recherche</label><input type="search" data-filter="q" value="${esc(f.q)}" placeholder="Quartier, ville, mot-clé..."></div>
        <div class="field"><label>Ville</label><select data-filter="loc">${opts(LOCS.map((l) => l.name), f.loc, 'Toutes')}</select></div>
        <div class="field"><label>Type</label><select data-filter="type">${opts(TYPES, f.type, 'Tous')}</select></div>
        <div class="field"><label>Transaction</label><select data-filter="status"><option value="Any" ${f.status === 'Any' ? 'selected' : ''}>Toutes</option><option value="sale" ${f.status === 'sale' ? 'selected' : ''}>À Vendre</option><option value="rent" ${f.status === 'rent' ? 'selected' : ''}>À Louer</option></select></div>
        <div class="field"><label>Prix Max</label><select data-filter="max">${maxOpts}</select></div>
        <div class="field"><label>Chambres</label><select data-filter="beds">${bedOpts}</select></div>
      </div>
      <div class="results-bar" style="margin-bottom:0"><span></span><label class="field" style="flex-direction:row;align-items:center;gap:10px"><span class="muted">Trier par</span><select data-filter="sort" style="width:auto">${sortOpts}</select></label></div>
      <div id="results">${resultsHTML()}</div>
    </div>
    <div style="height:64px"></div>`;
  };

  pages.property = (id) => {
    const p = byId(id);
    if (!p) return pages.notfound();
    const a = agentOf(p), on = state.fav.includes(p.id);
    const gallery = p.gallery || [p.img];
    const sim = P.filter((x) => x.id !== p.id && (x.loc === p.loc || x.type === p.type)).slice(0, 3);
    const est = p.status === 'sale' ? `<div class="estimate"><small class="muted">Mensualité estimée</small><br><b>${money(payment(p.price, 20, 4.75, 25))}</b><small class="muted"> /mois (20% d'apport sur 25 ans à 4,75%)</small><p style="margin-top:8px"><a class="link-more" href="#/mortgage/${p.id}">Ouvrir le simulateur ${icon('arrow', 16)}</a></p></div>` : '';
    const specsHTML = p.type === 'Terrain'
      ? `<div class="spec"><b>${p.sqm.toLocaleString('fr-MA')} m²</b><span>Surface totale</span></div><div class="spec"><b>Titré</b><span>Statut juridique</span></div><div class="spec"><b>Urbain</b><span>Zonage</span></div><div class="spec"><b>${p.year}</b><span>Disponibilité</span></div>`
      : `<div class="spec"><b>${p.beds}</b><span>Chambres</span></div><div class="spec"><b>${p.baths}</b><span>Salles de bain</span></div><div class="spec"><b>${p.sqm.toLocaleString('fr-MA')} m²</b><span>Surface</span></div><div class="spec"><b>${p.year}</b><span>Année</span></div>`;
    return `
    ${head(p.title, p.address + ', ' + p.loc, ['<a href="#/properties">Biens</a>', p.title])}
    <section class="section tight"><div class="container detail">
      <div>
        <div class="gallery-main">
          <img id="mainPropImg" src="${gallery[0]}" alt="${esc(p.title)}">
          <span class="badge ${p.status === 'rent' ? 'rent' : ''}">${p.status === 'rent' ? 'À Louer' : 'À Vendre'}</span>
        </div>
        <div class="thumbs">${gallery.map((src, n) => `<button type="button" class="thumb ${n === 0 ? 'on' : ''}" data-action="thumb" data-src="${src}" aria-label="Photo ${n + 1}"><img src="${src}" alt="Vue ${n + 1}"></button>`).join('')}</div>
        <div class="d-head"><div><h2 style="font-size:24px">${p.title}</h2><p class="muted">📍 ${p.address}, ${p.loc}, Maroc</p></div><div class="d-price">${priceHTML(p)}</div></div>
        <div class="specs">${specsHTML}</div>
        <div class="box"><h3>Description du bien</h3><p>${descOf(p)}</p></div>
        <div class="box"><h3>Prestations &amp; Équipements</h3><ul class="feat-list">${featsOf(p).map((f) => `<li>${icon('check', 18)} ${f}</li>`).join('')}</ul></div>
        <div class="box"><h3>Localisation — ${p.loc}</h3><div class="map"><span class="pin">📍</span></div><p class="muted" style="margin-top:10px">${p.address}, ${p.loc}, Maroc. Emplacement exact communiqué lors de la confirmation de visite.</p></div>
      </div>
      <aside class="sticky">
        <div class="box">
          <div class="agent-mini"><div class="avatar" style="background:${shade(a.hue)}">${initials(a.name)}</div><div><b><a href="#/agent/${a.id}">${a.name}</a></b><br><small class="muted">${a.role}</small></div></div>
          <a class="btn btn-gold btn-block" href="#/tour/${p.id}">Planifier une visite</a>
          <button class="btn btn-light btn-block ${on ? 'saved' : ''}" data-action="fav" data-id="${p.id}" style="margin-top:10px">${icon('heart', 18)} ${on ? 'Sauvegardé' : 'Ajouter aux favoris'}</button>
          ${est}
        </div>
        <form class="box stack" data-form="inquiry"><h3>Demander des informations</h3>
          <div class="field"><label>Nom complet</label><input required placeholder="Votre nom"></div>
          <div class="field"><label>Téléphone (+212)</label><input type="tel" required placeholder="+212 6 00 00 00 00"></div>
          <div class="field"><label>Email</label><input type="email" required placeholder="vous@exemple.ma"></div>
          <div class="field"><label>Message</label><textarea rows="3" required>Bonjour, je souhaite recevoir plus d’informations concernant : ${esc(p.title)} (${p.loc}).</textarea></div>
          <button class="btn btn-navy btn-block">Envoyer la demande</button></form>
      </aside>
    </div></section>
    ${sim.length ? `<section class="section alt"><div class="container"><div class="section-head"><div><h2>Biens similaires</h2></div></div><div class="grid">${sim.map(card).join('')}</div></div></section>` : ''}`;
  };

  pages.agents = () => `
    ${head('Nos Conseillers', 'Des professionnels de l’immobilier marocain à votre service.', ['Agents'])}
    <section class="section tight"><div class="container"><div class="grid four">${AGENTS.map(agentCard).join('')}</div></div></section>
    <section class="section tight"><div class="container"><div class="cta"><h2>Rejoignez Meridian Realty Maroc</h2><p>Vous êtes passionné par l’immobilier et le conseil client ? Rejoignez nos équipes à Casablanca, Marrakech, Rabat ou Tanger.</p><a class="btn btn-gold btn-lg" href="#/contact">Postuler</a></div></div></section>`;

  pages.agent = (id) => {
    const a = AGENTS.find((x) => x.id === Number(id));
    if (!a) return pages.notfound();
    const list = P.filter((p) => p.agent === a.id);
    return `
    ${head(a.name, a.role, ['<a href="#/agents">Agents</a>', a.name])}
    <section class="section tight"><div class="container two-col">
      <div>
        <div class="box" style="display:flex;gap:24px;align-items:center;flex-wrap:wrap"><div class="avatar lg" style="background:${shade(a.hue)};margin:0">${initials(a.name)}</div>
          <div><h2>${a.name}</h2><p class="muted">${a.role}</p><p>${stars(a.rating)} <small class="muted">${a.rating} · ${a.reviews} avis · ${a.sold} transactions</small></p><div class="tags">${a.spec.map((t) => `<span class="tag">${t}</span>`).join('')}</div></div></div>
        <div class="box"><h3>À propos de ${a.name.split(' ')[0]}</h3><p>${a.bio}</p><p class="muted">Langues parlées : ${a.langs}</p></div>
        <div style="margin-top:28px"><h2 style="margin-bottom:18px">Biens gérés par ${a.name.split(' ')[0]}</h2><div class="grid two">${list.map(card).join('')}</div></div>
      </div>
      <aside class="sticky">
        <form class="box stack" data-form="inquiry"><h3>Contacter ${a.name.split(' ')[0]}</h3>
          <div class="contact-row">${icon('phone', 20)}<div><b>Téléphone</b><small>${a.phone}</small></div></div>
          <div class="contact-row">${icon('mail', 20)}<div><b>Email</b><small>${a.email}</small></div></div>
          <div class="field"><label>Nom</label><input required></div><div class="field"><label>Email</label><input type="email" required></div>
          <div class="field"><label>Message</label><textarea rows="3" required></textarea></div>
          <button class="btn btn-gold btn-block">Envoyer un message</button></form>
      </aside>
    </div></section>`;
  };

  pages.neighborhoods = () => `
    ${head('Villes & Destinations', 'Découvrez le marché immobilier des 8 grandes villes du Maroc.', ['Villes'])}
    <section class="section tight"><div class="container"><div class="hoods">${LOCS.map(hood).join('')}</div></div></section>`;

  /* Simulateur de crédit immobilier au Maroc */
  function payment(price, downPct, rate, years) {
    const loan = price * (1 - downPct / 100), r = rate / 100 / 12, n = years * 12;
    return r === 0 ? loan / n : loan * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
  }
  pages.mortgage = (id) => {
    const p = id ? byId(id) : null;
    const price = p && p.status === 'sale' ? p.price : 2500000;
    return `
    ${head('Simulateur de Crédit Immobilier', 'Calculez vos mensualités en Dirhams (MAD) avant de soumettre votre offre.', ['Crédit'])}
    <section class="section tight"><div class="container two-col">
      <div class="box stack" id="mortForm">
        <h3>Paramètres de financement</h3>
        <div class="range-val"><span>Prix du bien</span><span id="v-price"></span></div><input type="range" id="m-price" min="400000" max="15000000" step="50000" value="${price}">
        <div class="range-val"><span>Apport personnel</span><span id="v-down"></span></div><input type="range" id="m-down" min="0" max="60" step="5" value="20">
        <div class="range-val"><span>Taux d’intérêt annuel</span><span id="v-rate"></span></div><input type="range" id="m-rate" min="3.5" max="7.5" step="0.05" value="4.75">
        <div class="range-val"><span>Durée du prêt</span><span id="v-years"></span></div><input type="range" id="m-years" min="5" max="25" step="5" value="20">
        <p class="muted">Simulation indicative hors assurance décès-invalidité et frais de dossier bancaire (taux moyens constatés au Maroc).</p>
      </div>
      <div class="result-card">
        <h3>Mensualité estimée</h3><div class="big" id="r-pay"></div>
        <div class="bar"><i id="r-bar" style="width:50%"></i></div>
        <div class="legend"><span>Capital emprunté</span><span>Intérêts totaux</span></div>
        <div class="row"><span>Montant du prêt</span><b id="r-loan"></b></div>
        <div class="row"><span>Apport personnel</span><b id="r-dp"></b></div>
        <div class="row"><span>Coût total des intérêts</span><b id="r-int"></b></div>
        <div class="row" style="border:0"><span>Montant total remboursé</span><b id="r-total"></b></div>
        <a class="btn btn-gold btn-block" href="#/contact" style="margin-top:20px">Être mis en relation avec une banque partenaire</a>
      </div>
    </div></section>`;
  };
  function mortgageCalc() {
    const g = (id) => Number($('#' + id).value);
    const price = g('m-price'), down = g('m-down'), rate = g('m-rate'), years = g('m-years');
    const pay = payment(price, down, rate, years), loan = price * (1 - down / 100), total = pay * years * 12, interest = total - loan;
    $('#v-price').textContent = money(price); $('#v-down').textContent = down + '% (' + money(price * down / 100) + ')';
    $('#v-rate').textContent = rate.toFixed(2) + '%'; $('#v-years').textContent = years + ' ans';
    $('#r-pay').textContent = money(pay); $('#r-loan').textContent = money(loan); $('#r-dp').textContent = money(price * down / 100);
    $('#r-int').textContent = money(interest); $('#r-total').textContent = money(total);
    $('#r-bar').style.width = Math.round(loan / total * 100) + '%';
  }

  pages.sell = () => `
    ${head('Vendre votre bien', 'Obtenez une estimation gratuite basée sur les prix au m² au Maroc.', ['Vendre'])}
    <section class="section tight"><div class="container two-col">
      <form class="box stack" data-form="sell"><h3>Caractéristiques de votre bien</h3>
        <div class="field"><label>Quartier / Adresse</label><input name="address" required placeholder="Ex: Quartier Racine, Guéliz, Agdal..."></div>
        <div class="form-grid">
          <div class="field"><label>Ville</label><select name="loc">${opts(LOCS.map((l) => l.name))}</select></div>
          <div class="field"><label>Type de bien</label><select name="type">${opts(TYPES)}</select></div>
          <div class="field"><label>Chambres</label><input name="beds" type="number" min="0" max="15" value="3"></div>
          <div class="field"><label>Surface (m²)</label><input name="sqm" type="number" min="30" max="5000" value="140" required></div>
          <div class="field"><label>Votre nom</label><input name="name" required></div>
          <div class="field"><label>Téléphone (+212)</label><input name="phone" type="tel" required placeholder="+212 6 00 00 00 00"></div>
        </div>
        <button class="btn btn-gold btn-lg btn-block">Obtenir mon estimation gratuite</button></form>
      <div>
        <div class="result-card" id="estimateCard"><h3>Valeur estimée</h3><div class="big" id="estimateVal">- DH</div><p style="color:#cbd5e1" id="estimateNote">Remplissez le formulaire pour obtenir une première fourchette d’estimation selon le prix moyen au m² dans votre ville.</p></div>
        <div class="box" style="margin-top:24px"><h3>Les 4 étapes de la vente</h3><div class="timeline"><div><b>1. Visite &amp; Expertise.</b> Évaluation précise de votre bien et vérification du titre foncier.</div><div><b>2. Mise en valeur.</b> Reportage photo professionnel et diffusion ciblée.</div><div><b>3. Visites qualifiées.</b> Sélection d’acquéreurs solvables et négociation.</div><div><b>4. Signature notariale.</b> Accompagnement jusqu’au déblocage des fonds.</div></div></div>
      </div>
    </div></section>`;

  pages.favorites = () => {
    const list = state.fav.map(byId).filter(Boolean);
    return `${head('Biens Sauvegardés', list.length + ' bien(s) enregistré(s)', ['Favoris'])}<section class="section tight"><div class="container">${list.length ? `<div class="grid">${list.map(card).join('')}</div>` : `<div class="empty"><span class="emoji-xl">💛</span><h3>Aucun bien sauvegardé</h3><p>Cliquez sur le cœur d’une annonce pour la retrouver ici.</p><a class="btn btn-gold btn-lg" href="#/properties">Parcourir les biens</a></div>`}</div></section>`;
  };

  pages.tour = (id) => {
    const sel = id ? byId(id) : null;
    const today = new Date().toISOString().slice(0, 10);
    return `
    ${head('Planifier une visite', 'Choisissez un créneau et notre conseiller vous confirmera le rendez-vous.', ['Visite'])}
    <section class="section tight"><div class="container two-col">
      <form class="box stack" data-form="tour"><h3>Détails de la visite</h3>
        <div class="field"><label>Bien concerné</label><select name="property">${P.map((p) => `<option value="${p.id}" ${sel && sel.id === p.id ? 'selected' : ''}>${esc(p.title)} (${esc(p.loc)})</option>`).join('')}</select></div>
        <div class="form-grid">
          <div class="field"><label>Date souhaitée</label><input name="date" type="date" required min="${today}"></div>
          <div class="field"><label>Heure</label><select name="time"><option>09:30</option><option>11:00</option><option>14:30</option><option>16:00</option><option>17:30</option></select></div>
          <div class="field"><label>Mode de visite</label><select name="kind"><option>Sur place</option><option>Visio WhatsApp / Vidéo</option></select></div>
          <div class="field"><label>Téléphone (+212)</label><input name="phone" type="tel" required placeholder="+212 6 00 00 00 00"></div>
          <div class="field"><label>Nom complet</label><input name="name" required></div>
          <div class="field"><label>Email</label><input name="email" type="email" required></div>
        </div>
        <div class="field"><label>Précisions (optionnel)</label><textarea name="notes" rows="3" placeholder="Ex: Je serai de passage à Casablanca ce week-end..."></textarea></div>
        <button class="btn btn-gold btn-lg btn-block">Confirmer la demande de visite</button></form>
      <aside class="box"><h3>Bon à savoir</h3><div class="timeline"><div><b>Confirmation rapide.</b> Notre conseiller vous rappelle sous quelques heures.</div><div><b>Visite personnalisée.</b> Environ 30 à 45 minutes sur place ou en visio.</div><div><b>Sans engagement.</b> Posez toutes vos questions sur le quartier et les frais.</div></div></aside>
    </div></section>`;
  };
  pages['tour-done'] = () => {
    const t = state.tours[0];
    if (!t) return pages.notfound();
    const p = byId(t.property);
    return `<section class="section"><div class="container narrow center"><div class="success-ico">${icon('check', 36)}</div><h1>Demande de visite enregistrée !</h1><p class="lead" style="margin-top:10px">Merci ${esc(t.name)}. Notre conseiller vous contactera au ${esc(t.phone)} ou par email à ${esc(t.email)}.</p>
      <div class="box summary"><div class="r"><span>Bien</span><b>${p ? esc(p.title) : ''}</b></div><div class="r"><span>Date</span><b>${esc(t.date)}</b></div><div class="r"><span>Heure</span><b>${esc(t.time)}</b></div><div class="r" style="border:0"><span>Mode</span><b>${esc(t.kind)}</b></div></div>
      <a class="btn btn-gold btn-lg" href="#/properties">Continuer la visite du site</a></div></section>`;
  };

  pages.about = () => `
    ${head('À propos de Meridian Realty Maroc', 'Votre partenaire immobilier de confiance depuis 2010.', ['À propos'])}
    <section class="section"><div class="container about-grid">
      <div><span class="eyebrow">Notre Histoire</span><h2>Une agence ancrée dans la réalité du marché marocain</h2><p class="lead">Fondée à Casablanca, Meridian Realty Maroc s’est développée avec une mission claire : apporter transparence, rigueur juridique et conseil personnalisé à chaque projet immobilier.</p><p class="lead">Aujourd’hui présente à Casablanca, Marrakech, Rabat, Tanger, Agadir, Fès, Essaouira et Tétouan, notre équipe accompagne aussi bien les familles résidentes que les Marocains du Monde (MRE) et les investisseurs internationaux.</p><p style="margin-top:20px"><a class="btn btn-navy" href="#/agents">Rencontrer nos conseillers</a></p></div>
      <div class="timeline"><div><b>2010</b> · Ouverture du premier bureau à Casablanca (Anfa).</div><div><b>2015</b> · Lancement du pôle Riads &amp; Prestige à Marrakech et Fès.</div><div><b>2020</b> · Déploiement sur Rabat, Tanger et Agadir.</div><div><b>2026</b> · Plus de 1 450 transactions réalisées à travers le Royaume.</div></div>
    </div></section>
    <section class="section alt"><div class="container"><div class="section-head center"><div><h2>Nos Valeurs</h2></div></div><div class="features" style="grid-template-columns:repeat(3,1fr)"><div class="feature"><span class="ico">🤝</span><h3>Écoute &amp; Proximité</h3><p>Chaque projet est unique et mérite une attention sur mesure.</p></div><div class="feature"><span class="ico">🔍</span><h3>Sécurité Juridique</h3><p>Vérification systématique des titres fonciers et documents.</p></div><div class="feature"><span class="ico">🏘️</span><h3>Expertise Locale</h3><p>Des agents implantés au cœur des 8 villes couvertes.</p></div></div></div></section>`;

  pages.contact = () => `
    ${head('Contactez-nous', 'Nos conseillers à Casablanca, Marrakech, Rabat et Tanger vous répondent sous 24h.', ['Contact'])}
    <section class="section tight"><div class="container two-col">
      <form class="box stack" data-form="inquiry"><h3>Envoyer un message</h3>
        <div class="form-grid"><div class="field"><label>Nom complet</label><input required placeholder="Ahmed Bennani"></div><div class="field"><label>Téléphone (+212)</label><input type="tel" required placeholder="+212 6 00 00 00 00"></div></div>
        <div class="field"><label>Email</label><input type="email" required placeholder="vous@exemple.ma"></div>
        <div class="field"><label>Votre projet</label><select><option>Acheter un bien</option><option>Vendre un bien</option><option>Louer un bien</option><option>Investissement / Conseil</option></select></div>
        <div class="field"><label>Message</label><textarea rows="5" required placeholder="Précisez la ville, le type de bien et votre budget en DH..."></textarea></div>
        <button class="btn btn-gold btn-lg">Envoyer le message</button></form>
      <aside class="box"><h3>Siège Social — Casablanca</h3>
        <div class="contact-row">${icon('pin', 20)}<div><b>Adresse</b><small>45 Boulevard d'Anfa, Quartier Racine, Casablanca 20100, Maroc</small></div></div>
        <div class="contact-row">${icon('phone', 20)}<div><b>Téléphone</b><small>+212 5 22 48 90 12 / +212 6 61 24 89 10</small></div></div>
        <div class="contact-row">${icon('mail', 20)}<div><b>Email</b><small>contact@meridianrealty.ma</small></div></div>
        <div class="map" style="margin-top:12px"><span class="pin">📍</span></div><p class="muted" style="margin-top:10px">Ouvert du lundi au samedi, de 9h00 à 19h00.</p></aside>
    </div></section>`;

  pages.faq = () => {
    const groups = [...new Set(FAQ.map((f) => f[0]))].map((g) => `<h3 class="faq-group">${g}</h3>${FAQ.filter((f) => f[0] === g).map((f) => `<details class="acc"><summary>${f[1]}</summary><p>${f[2]}</p></details>`).join('')}`).join('');
    return `${head('Questions Fréquentes', 'Tout savoir sur l’achat, la vente, la location et le crédit immobilier au Maroc.', ['FAQ'])}<section class="section tight"><div class="container narrow">${groups}<div class="box center" style="margin-top:32px"><h3>Vous avez une autre question ?</h3><a class="btn btn-navy" href="#/contact">Contactez un conseiller</a></div></div></section>`;
  };

  const legal = (title, body) => `${head(title, 'Informations légales — Meridian Realty Maroc.', [title])}<section class="section tight"><div class="container narrow box">${body}</div></section>`;
  pages.privacy = () => legal('Politique de confidentialité', '<h3>Protection de vos données</h3><p>Conformément à la loi marocaine n° 09-08 relative à la protection des personnes physiques à l’égard du traitement des données à caractère personnel, vos informations sont strictement utilisées pour traiter vos demandes immobilières.</p>');
  pages.terms = () => legal('Conditions générales d’utilisation', '<h3>Informations affichées</h3><p>Les annonces, surfaces et estimations en Dirhams (DH) sont communiquées à titre indicatif. Seuls les actes authentiques établis devant notaire font foi.</p>');
  pages.notfound = () => `<section class="section"><div class="container narrow center"><div class="empty"><span class="emoji-xl">🧭</span><h1>Page introuvable</h1><p>La page que vous recherchez n’existe pas ou a été déplacée.</p><a class="btn btn-gold btn-lg" href="#/">Retour à l’accueil</a></div></div></section>`;

  /* ---------- Routeur ---------- */
  const TITLES = { properties: 'Nos Biens', property: 'Détail du bien', agents: 'Nos Conseillers', agent: 'Conseiller', neighborhoods: 'Villes', mortgage: 'Simulateur de crédit', sell: 'Vendre votre bien', favorites: 'Favoris', tour: 'Planifier une visite', 'tour-done': 'Visite confirmée', about: 'À propos', contact: 'Contact', faq: 'FAQ', privacy: 'Confidentialité', terms: 'Conditions' };
  const ROUTE_GROUP = { property: 'properties', agent: 'agents', 'tour-done': 'tour' };
  function render() {
    const parts = (location.hash.replace(/^#\/?/, '') || '').split('/');
    let key = parts[0] || 'home';
    if (!pages[key]) key = 'notfound';
    $('#view').innerHTML = pages[key](parts[1], parts[2]);
    document.title = (TITLES[key] ? TITLES[key] + ' | ' : '') + 'Meridian Realty Maroc';
    const group = ROUTE_GROUP[key] || key;
    $$('.nav a[data-route]').forEach((a) => a.classList.toggle('active', a.dataset.route === group));
    document.body.classList.remove('nav-open');
    hydrate();
    window.scrollTo(0, 0);
    if (key === 'mortgage') mortgageCalc();
    if (key === 'home') startCounters();
  }

  /* ---------- Compteurs animés ---------- */
  function startCounters() {
    const els = $$('[data-count]');
    const run = () => els.forEach((el) => {
      const target = Number(el.dataset.count), suffix = el.dataset.suffix || '', t0 = performance.now();
      const step = (now) => {
        const k = Math.min(1, (now - t0) / 1400);
        el.textContent = Math.round(target * (1 - Math.pow(1 - k, 3))).toLocaleString('fr-MA') + (k === 1 ? suffix : '');
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
    const bar = $('#statsBar');
    if (!bar) return;
    if (!('IntersectionObserver' in window)) { run(); return; }
    const io = new IntersectionObserver((en) => { if (en[0].isIntersecting) { run(); io.disconnect(); } }, { threshold: 0.4 });
    io.observe(bar);
  }

  /* ---------- Utilitaires UI ---------- */
  function badges() {
    $('#favCount').textContent = state.fav.length;
    $('#favCount').hidden = state.fav.length === 0;
  }
  function toast(msg) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    $('#toasts').appendChild(t);
    setTimeout(() => t.remove(), 2600);
  }

  /* ---------- Événements ---------- */
  const actions = {
    'nav-toggle': () => document.body.classList.toggle('nav-open'),
    'ui-close': () => document.body.classList.remove('nav-open'),
    car: (el) => { const c = el.closest('.section').querySelector('.carousel'); c.scrollBy({ left: Number(el.dataset.d) * (c.firstElementChild.offsetWidth + 24) * 2, behavior: 'smooth' }); },
    thumb: (el) => {
      const main = $('#mainPropImg');
      if (main) main.src = el.dataset.src;
      $$('.thumb').forEach((b) => b.classList.remove('on'));
      el.classList.add('on');
    },
    fav: (el) => {
      const id = Number(el.dataset.id), i = state.fav.indexOf(id);
      if (i > -1) state.fav.splice(i, 1); else state.fav.push(id);
      saveAll(); badges();
      toast(i === -1 ? 'Bien ajouté à vos favoris' : 'Bien retiré de vos favoris');
      if (location.hash === '#/favorites' || /^#\/property\//.test(location.hash)) render();
      else $$('.fav[data-id="' + id + '"]').forEach((b) => b.classList.toggle('on', i === -1));
    },
    'clear-filters': () => { state.f = { ...DEF }; if (location.hash === '#/properties') render(); else location.hash = '#/properties'; }
  };
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-action]');
    if (el && actions[el.dataset.action]) { e.preventDefault(); actions[el.dataset.action](el, e); return; }
    if (e.target.closest('.nav a')) document.body.classList.remove('nav-open');
  });

  document.addEventListener('input', (e) => {
    const t = e.target;
    if (t.closest && t.closest('#mortForm')) { mortgageCalc(); return; }
    const k = t.dataset && t.dataset.filter;
    if (!k) return;
    state.f[k] = (k === 'max' || k === 'beds') ? Number(t.value) : t.value;
    $('#results').innerHTML = resultsHTML();
    hydrate($('#results'));
  });

  document.addEventListener('submit', (e) => {
    const form = e.target.closest('[data-form]');
    if (!form) return;
    e.preventDefault();
    const kind = form.dataset.form, d = new FormData(form);
    if (kind === 'hero-search') {
      state.f = { ...DEF, loc: d.get('loc') === 'Toutes les villes' ? 'Toutes' : d.get('loc'), type: d.get('type') === 'Tous les types' ? 'Tous' : d.get('type'), max: Number(d.get('max')) };
      location.hash = '#/properties';
    }
    if (kind === 'inquiry') { toast('Message envoyé. Un conseiller vous répondra sous 24h.'); form.reset(); }
    if (kind === 'sell') {
      const l = LOCS.find((x) => x.name === d.get('loc')), sqm = Number(d.get('sqm')), mult = d.get('type') === 'Terrain' ? 0.35 : d.get('type') === 'Villa' ? 1.2 : 1;
      const base = sqm * l.ppsm * mult * (1 + (Number(d.get('beds')) - 3) * 0.02);
      $('#estimateVal').textContent = money(base * 0.94) + ' - ' + money(base * 1.06);
      $('#estimateNote').textContent = 'Estimation indicative pour un(e) ' + d.get('type') + ' à ' + d.get('address') + ' (' + d.get('loc') + '). Un conseiller vous appellera au ' + d.get('phone') + '.';
      toast('Estimation calculée avec succès.');
    }
    if (kind === 'tour') {
      state.tours.unshift({ property: Number(d.get('property')), date: String(d.get('date')), time: String(d.get('time')), kind: String(d.get('kind')), phone: String(d.get('phone')), name: String(d.get('name')), email: String(d.get('email')) });
      saveAll();
      location.hash = '#/tour-done';
    }
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') document.body.classList.remove('nav-open'); });

  window.addEventListener('hashchange', render);
  badges();
  hydrate();
  render();
})();
