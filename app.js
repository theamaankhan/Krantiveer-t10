const TEAMS = [
  ["Subhas Chandra Bose Super Kings","subhas-chandra-bose-super-kings.jpg"],
  ["Ram Prasad Bismil Sarfarosh","ram-prasad-bismil-sarfarosh.jpg"],
  ["Bhagat Singh Inquelab","bhagat-singh-inquelab.jpg"],
  ["Roshan Singh Daredevils","roshan-singh-daredevils.jpg"],
  ["Sardar Udham Singh Challengers","sardar-udham-singh-challengers.jpg"],
  ["Ahmadullah Shah Rebellion","ahmadullah-shah-rebellion.jpg"],
  ["Sukhdev Blasters","sukhdev-blasters.jpg"],
  ["Khudiram Bose Tigers","khudiram-bose-tigers.jpg"],
  ["Mangal Pandey Firearms","mangal-pandey-firearms.jpg"],
  ["Rajguru Strikers","rajguru-strikers.jpg"],
  ["Ashfaqulla Khan Legends","ashfaqulla-khan-legends.jpg"],
  ["Chandrashekhar Azad Fighters","chandrashekhar-azad-fighters.jpg"]
];

const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

function renderTeams(filter='') {
  const grid = $('#teamGrid');
  const q = filter.trim().toLowerCase();
  const visible = TEAMS.filter(([name]) => name.toLowerCase().includes(q));
  grid.innerHTML = visible.map(([name,file]) => {
    const original = TEAMS.findIndex(t => t[0] === name) + 1;
    return `<article class="team-card reveal" tabindex="0" data-team="${name.toLowerCase()}">
      <div class="team-top"><span>${String(original).padStart(2,'0')}</span><i>OFFICIAL</i></div>
      <div class="team-logo-wrap"><img src="team-logos/${file}" alt="${name} logo" loading="lazy"></div>
      <div class="team-name">${name}</div>
      <div class="team-card-line"><span>BANDA T10</span><b>TEAM ${String(original).padStart(2,'0')}</b></div>
    </article>`;
  }).join('');
  $('#teamVisible').textContent = visible.length;
  $('#emptyTeams').classList.toggle('hidden', visible.length !== 0);
  requestAnimationFrame(() => $$('.team-card', grid).forEach((el,i)=>setTimeout(()=>el.classList.add('is-visible'),i*45)));
}

function setupReveal() {
  const items = $$('.reveal');
  const observer = new IntersectionObserver(entries => entries.forEach(e => {
    if(e.isIntersecting){ e.target.classList.add('is-visible'); observer.unobserve(e.target); }
  }), {threshold:.08, rootMargin:'0px 0px -30px'});
  items.forEach(el=>observer.observe(el));
}

function animateCounters() {
  const counters = $$('[data-count]');
  const observer = new IntersectionObserver(entries => entries.forEach(e => {
    if(!e.isIntersecting) return;
    const el=e.target, target=Number(el.dataset.count), suffix=el.dataset.suffix||'';
    const start=performance.now(), duration=900;
    function tick(now){
      const p=Math.min(1,(now-start)/duration), eased=1-Math.pow(1-p,3);
      el.textContent=Math.round(target*eased).toLocaleString('en-IN')+suffix;
      if(p<1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick); observer.unobserve(el);
  }),{threshold:.7});
  counters.forEach(el=>observer.observe(el));
}

function setupNavigation(){
  const menu=$('#mobileMenu'), nav=$('#mainNav');
  menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});
  $$('nav a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');}));
  window.addEventListener('scroll',()=>$('#siteHeader').classList.toggle('scrolled',scrollY>20),{passive:true});
}

function showRegistration(type){
  const player=$('#playerRegistration'), franchise=$('#franchiseRegistration');
  player.classList.toggle('hidden',type!=='player'); franchise.classList.toggle('hidden',type!=='franchise');
  $$('.registration-tab').forEach(btn=>{const active=btn.dataset.registration===type;btn.classList.toggle('active',active);btn.setAttribute('aria-selected',String(active));});
}

function setupRegistrationTabs(){
  $$('.registration-tab').forEach(btn=>btn.addEventListener('click',()=>showRegistration(btn.dataset.registration)));
}

function setupSearch(){
  $('#teamSearch').addEventListener('input',e=>renderTeams(e.target.value));
}

function setupQrModal(){
  const modal=$('#qrModal'), openBtn=$('#qrOpen'), closeBtn=$('#qrClose');
  if(openBtn) openBtn.addEventListener('click',()=>modal?.classList.add('open'));
  if(closeBtn) closeBtn.addEventListener('click',()=>modal?.classList.remove('open'));
  if(modal) modal.addEventListener('click',e=>{ if(e.target===modal) modal.classList.remove('open'); });
  document.addEventListener('keydown',e=>{ if(e.key==='Escape') modal?.classList.remove('open'); });
}

// Wire the two Google Form redirect buttons and warn (instead of silently failing)
// if someone forgets to paste the real form links from CreateForms.gs.
function setupFormLinks(){
  const links = [
    { el: $('#playerFormLink'), url: typeof PLAYER_FORM_URL !== 'undefined' ? PLAYER_FORM_URL : '' },
    { el: $('#franchiseFormLink'), url: typeof FRANCHISE_FORM_URL !== 'undefined' ? FRANCHISE_FORM_URL : '' }
  ];
  links.forEach(({el,url})=>{
    if(!el) return;
    const notConnected = !url || url.includes('PLAYER_FORM_URL') || url.includes('FRANCHISE_FORM_URL') || url.includes('PASTE_');
    if(notConnected){
      el.addEventListener('click', e=>{
        e.preventDefault();
        alert('This registration form link has not been connected yet. Run google-apps-script/CreateForms.gs and paste the generated form URL into index.html.');
      });
    } else {
      el.setAttribute('href', url);
    }
  });
}

renderTeams();
setupNavigation();
setupRegistrationTabs();
setupSearch();
setupReveal();
animateCounters();
setupQrModal();
setupFormLinks();
