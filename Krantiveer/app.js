
const steps=[...document.querySelectorAll(".form-step")], indicators=[...document.querySelectorAll(".step")];
let current=0;
function showStep(i){current=i;steps.forEach((s,n)=>s.classList.toggle("active",n===i));indicators.forEach((s,n)=>s.classList.toggle("active",n<=i));document.querySelector("#registration").scrollIntoView({behavior:"smooth",block:"start"});}
function valid(){for(const f of steps[current].querySelectorAll("input,select,textarea")){if(!f.checkValidity()){f.reportValidity();return false;}}return true}
document.querySelectorAll(".next").forEach(b=>b.onclick=()=>{if(valid()&&current<steps.length-1)showStep(current+1)});
document.querySelectorAll(".prev").forEach(b=>b.onclick=()=>{if(current>0)showStep(current-1)});
document.querySelectorAll(".team-card").forEach(c=>c.onclick=()=>{document.querySelectorAll(".team-card").forEach(x=>x.classList.remove("selected"));c.classList.add("selected");document.querySelector("#teamSelect").value=c.dataset.team;document.querySelector("#registration").scrollIntoView({behavior:"smooth",block:"center"});});
const form=document.querySelector("#playerForm"), statusBox=document.querySelector("#status"), success=document.querySelector("#success"), regId=document.querySelector("#regId");
function b64(file){return new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(String(r.result).split(",")[1]);r.onerror=rej;r.readAsDataURL(file)})}
function fileCheck(el,mb){const f=el.files[0];if(!f)throw new Error("Please upload "+el.name+".");if(f.size>mb*1024*1024)throw new Error(el.name+" must be "+mb+" MB or smaller.");}
form.addEventListener("submit",async e=>{e.preventDefault();if(!valid())return;try{
const photo=document.querySelector("#photo"),front=document.querySelector("#idFront"),back=document.querySelector("#idBack");fileCheck(photo,3);fileCheck(front,5);fileCheck(back,5);
if(!APPS_SCRIPT_URL||APPS_SCRIPT_URL.includes("PASTE_YOUR"))throw new Error("Backend URL is not connected yet.");
const d=Object.fromEntries(new FormData(form).entries());d.declaration1=true;d.declaration2=true;
d.playerPhotoBase64=await b64(photo.files[0]);d.playerPhotoName=photo.files[0].name;d.playerPhotoMimeType=photo.files[0].type;
d.idFrontBase64=await b64(front.files[0]);d.idFrontName=front.files[0].name;d.idFrontMimeType=front.files[0].type;
d.idBackBase64=await b64(back.files[0]);d.idBackName=back.files[0].name;d.idBackMimeType=back.files[0].type;
delete d.photo;delete d.idFront;delete d.idBack;statusBox.textContent="Saving registration and creating payment link…";document.querySelector(".submit").disabled=true;
const r=await fetch(APPS_SCRIPT_URL,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(d)}),out=await r.json();if(!out.ok)throw new Error(out.message||"Submission failed");
document.querySelector(".steps").classList.add("hidden");document.querySelector(".registration-title").classList.add("hidden");form.classList.add("hidden");success.classList.remove("hidden");regId.textContent=out.registrationId;
if(out.paymentUrl){const a=document.createElement("a");a.href=out.paymentUrl;a.target="_blank";a.rel="noopener";a.className="primary";a.textContent="PAY ₹500 NOW →";success.querySelector(".primary").replaceWith(a);}
}catch(err){statusBox.textContent="Could not submit: "+err.message;document.querySelector(".submit").disabled=false;}});
