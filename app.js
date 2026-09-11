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
  grid.innerHTML = visible.map(([name,file], i) => {
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

const playerSteps = $$('#playerForm .form-step');
const playerIndicators = $$('#playerSteps .step');
let playerCurrent=0;
function showPlayerStep(i){
  playerCurrent=i;
  playerSteps.forEach((s,n)=>s.classList.toggle('active',n===i));
  playerIndicators.forEach((s,n)=>s.classList.toggle('active',n<=i));
  $('#playerSteps').style.setProperty('--progress',`${(i/(playerSteps.length-1))*100}%`);
  $('#registration').scrollIntoView({behavior:'smooth',block:'start'});
}
function validContainer(container){for(const f of container.querySelectorAll('input,select,textarea')){if(!f.checkValidity()){f.reportValidity();return false;}}return true;}
function b64(file){return new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(String(r.result).split(',')[1]);r.onerror=rej;r.readAsDataURL(file);});}
function fileCheck(el,mb){const f=el.files[0];if(!f)throw new Error('Please upload '+(el.dataset.label||el.name)+'.');if(f.size>mb*1024*1024)throw new Error((el.dataset.label||el.name)+' must be '+mb+' MB or smaller.');}
function setupFiles(){
  $$('input[type=file]').forEach(input=>input.addEventListener('change',()=>{
    const name=input.files[0]?.name||'No file selected'; const box=input.closest('.upload-card');
    if(box) $('.file-name',box).textContent=name;
  }));
}

function resetPlayerForm(){
  $('#playerForm').reset(); playerCurrent=0; showPlayerStep(0);
  $('#playerSuccess').classList.add('hidden'); $('#playerForm').classList.remove('hidden'); $('#playerSteps').classList.remove('hidden'); $('#playerStatus').textContent='';
  $('#playerRegistration').querySelector('.form-intro').classList.remove('hidden');
  $('#utr').value='';
  $$('.file-name','#playerForm').forEach(x=>x.textContent='No file selected');
  $('#playerSubmit').disabled=false;
}


function submitToAppsScript(data){
  return new Promise((resolve,reject)=>{
    if(!APPS_SCRIPT_URL || APPS_SCRIPT_URL.includes('PASTE_YOUR')){
      reject(new Error('Backend URL is not connected yet.'));
      return;
    }

    const frameName='kv-submit-frame-'+Date.now()+'-'+Math.random().toString(36).slice(2);
    const iframe=document.createElement('iframe');
    iframe.name=frameName;
    iframe.title='Registration submission';
    iframe.setAttribute('aria-hidden','true');
    iframe.style.cssText='position:fixed;left:-9999px;top:-9999px;width:1px;height:1px;border:0;opacity:0;pointer-events:none;';
    document.body.appendChild(iframe);

    const form=document.createElement('form');
    form.method='POST';
    form.action=APPS_SCRIPT_URL;
    form.target=frameName;
    form.enctype='application/x-www-form-urlencoded';
    form.encoding='application/x-www-form-urlencoded';
    form.style.display='none';

    Object.entries(data).forEach(([key,value])=>{
      if(value===undefined || value===null) return;
      const input=document.createElement('input');
      input.type='hidden';
      input.name=key;
      input.value=String(value);
      form.appendChild(input);
    });

    let settled=false;
    const cleanup=()=>{
      window.removeEventListener('message',onMessage);
      clearTimeout(timer);
      form.remove();
      iframe.remove();
    };
    const finish=(fn,value)=>{
      if(settled) return;
      settled=true;
      cleanup();
      fn(value);
    };
    const onMessage=(event)=>{
      const msg=event.data;
      if(event.source !== iframe.contentWindow) return;
      if(!msg || msg.__kvRegistrationResponse!==true) return;
      if(msg.ok) finish(resolve,msg);
      else finish(reject,new Error(msg.message||'Registration submission failed.'));
    };
    const timer=setTimeout(()=>{
      finish(reject,new Error('The registration server did not respond in time. Please try again.'));
    },90000);

    window.addEventListener('message',onMessage);
    document.body.appendChild(form);
    form.submit();
  });
}

function setupPlayerForm(){
  $$('#playerForm .next').forEach(b=>b.onclick=()=>{
    if(validContainer(playerSteps[playerCurrent])&&playerCurrent<playerSteps.length-1)showPlayerStep(playerCurrent+1);
  });
  $$('#playerForm .prev').forEach(b=>b.onclick=()=>{
    if(playerCurrent>0)showPlayerStep(playerCurrent-1);
  });

  $('#playerForm').addEventListener('submit',async e=>{
    e.preventDefault();
    if(!validContainer(playerSteps[playerCurrent])) return;

    const button=$('#playerSubmit'), status=$('#playerStatus');
    try{
      const photo=$('#photo'),front=$('#idFront'),back=$('#idBack');
      fileCheck(photo,3); fileCheck(front,5); fileCheck(back,5);

      const utr=String($('#utr').value||'').trim();
      if(!/^[A-Za-z0-9][A-Za-z0-9 ._\/-]{5,49}$/.test(utr)){
        throw new Error('Please enter a valid UTR / transaction ID.');
      }

      if(!APPS_SCRIPT_URL||APPS_SCRIPT_URL.includes('PASTE_YOUR')){
        throw new Error('Backend URL is not connected yet.');
      }

      button.disabled=true;
      status.textContent='Preparing your registration documents…';

      const d=Object.fromEntries(new FormData($('#playerForm')).entries());
      d.formType='player';
      d.utr=utr;

      d.playerPhotoBase64=await b64(photo.files[0]);
      d.playerPhotoName=photo.files[0].name;
      d.playerPhotoMimeType=photo.files[0].type;

      d.idFrontBase64=await b64(front.files[0]);
      d.idFrontName=front.files[0].name;
      d.idFrontMimeType=front.files[0].type;

      d.idBackBase64=await b64(back.files[0]);
      d.idBackName=back.files[0].name;
      d.idBackMimeType=back.files[0].type;

      delete d.playerPhoto;
      delete d.idFront;
      delete d.idBack;
      delete d.declaration1;
      delete d.declaration2;

      status.textContent='Submitting registration securely…';
      const out=await submitToAppsScript(d);

      $('#playerSteps').classList.add('hidden');
      $('#playerRegistration').querySelector('.form-intro').classList.add('hidden');
      $('#playerForm').classList.add('hidden');
      $('#playerSuccess').classList.remove('hidden');
      $('#playerRegId').textContent=out.registrationId;
      status.textContent='';
    }catch(err){
      status.textContent='Could not submit: '+err.message;
      button.disabled=false;
    }
  });

  $('#playerAgain').onclick=resetPlayerForm;

  const qr=$('#qrOpen');
  if(qr) qr.addEventListener('click',()=>$('#qrModal')?.classList.add('open'));
}

function setupFranchiseForm(){
  $('#franchiseForm').addEventListener('submit',async e=>{
    e.preventDefault();
    const form=e.currentTarget;
    if(!validContainer(form))return;

    const button=$('#franchiseSubmit'), status=$('#franchiseStatus');

    try{
      if(!APPS_SCRIPT_URL||APPS_SCRIPT_URL.includes('PASTE_YOUR')){
        throw new Error('Backend URL is not connected yet.');
      }

      const front=$('#franchiseIdFront'),back=$('#franchiseIdBack');
      fileCheck(front,5); fileCheck(back,5);

      button.disabled=true;
      status.textContent='Preparing your documents…';

      const d=Object.fromEntries(new FormData(form).entries());
      d.formType='franchise';
      d.declaration=true;

      d.idFrontBase64=await b64(front.files[0]);
      d.idFrontName=front.files[0].name;
      d.idFrontMimeType=front.files[0].type;

      d.idBackBase64=await b64(back.files[0]);
      d.idBackName=back.files[0].name;
      d.idBackMimeType=back.files[0].type;

      delete d.idFront;
      delete d.idBack;
      delete d.declaration;

      status.textContent='Submitting franchise registration…';
      const out=await submitToAppsScript(d);

      form.classList.add('hidden');
      $('#franchiseSuccess').classList.remove('hidden');
      $('#franchiseRegId').textContent=out.registrationId;
      status.textContent='';
    }catch(err){
      status.textContent='Could not submit: '+err.message;
      button.disabled=false;
    }
  });

  $('#franchiseAgain').onclick=()=>{
    const form=$('#franchiseForm');
    form.reset();
    form.classList.remove('hidden');
    $('#franchiseSuccess').classList.add('hidden');
    $('#franchiseStatus').textContent='';
    $('#franchiseSubmit').disabled=false;
    $$('.file-name','#franchiseForm').forEach(x=>x.textContent='No file selected');
    showRegistration('franchise');
  };
}

function setupSearch(){
  $('#teamSearch').addEventListener('input',e=>renderTeams(e.target.value));
}

renderTeams();
setupNavigation();setupRegistrationTabs();setupFiles();setupPlayerForm();setupFranchiseForm();setupSearch();setupReveal();animateCounters();

const qrClose = $('#qrClose');
if(qrClose) qrClose.addEventListener('click',()=>$('#qrModal')?.classList.remove('open'));
const qrModal = $('#qrModal');
if(qrModal) qrModal.addEventListener('click',e=>{if(e.target===qrModal)qrModal.classList.remove('open')});
document.addEventListener('keydown',e=>{if(e.key==='Escape')$('#qrModal')?.classList.remove('open')});
