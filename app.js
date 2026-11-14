import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const canvas=document.querySelector('#scene');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.setSize(canvas.clientWidth,canvas.clientHeight,false);
renderer.shadowMap.enabled=true;
renderer.outputColorSpace=THREE.SRGBColorSpace;
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(34,canvas.clientWidth/canvas.clientHeight,.1,100);
camera.position.set(0,2.15,7.6);
const hemi=new THREE.HemisphereLight(0xdce9ff,0x514239,2.0);scene.add(hemi);
const key=new THREE.DirectionalLight(0xffe4ca,3.1);key.position.set(-3,6,5);key.castShadow=true;scene.add(key);
const fill=new THREE.DirectionalLight(0x8eafff,1.4);fill.position.set(4,3,-3);scene.add(fill);
const floor=new THREE.Mesh(new THREE.CircleGeometry(3.2,64),new THREE.MeshStandardMaterial({color:0x303b4b,roughness:.85}));
floor.rotation.x=-Math.PI/2;floor.position.y=-.03;floor.receiveShadow=true;scene.add(floor);
const mat=(color,rough=.72,metal=0)=>new THREE.MeshStandardMaterial({color,roughness:rough,metalness:metal});
const skin=mat(0xc58f70),hair=mat(0x211713),shirt=mat(0xe9dfce),pants=mat(0x786a58),shoe=mat(0xe8e8e5),eye=mat(0x241a16);
const avatar=new THREE.Group();scene.add(avatar);
function sphere(parent,name,pos,scale,material){const m=new THREE.Mesh(new THREE.SphereGeometry(1,32,24),material);m.name=name;m.position.set(...pos);m.scale.set(...scale);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
function capsule(parent,name,pos,radius,length,material){const m=new THREE.Mesh(new THREE.CapsuleGeometry(radius,length,8,16),material);m.name=name;m.position.set(...pos);m.castShadow=true;parent.add(m);return m}
const torso=sphere(avatar,'torso',[0,1.42,0],[.43,.62,.25],shirt);
const neck=capsule(avatar,'neck',[0,2.03,0],.105,.18,skin);
const head=new THREE.Group();head.position.set(0,2.35,0);avatar.add(head);
sphere(head,'face',[0,0,0],[.31,.40,.29],skin);
sphere(head,'hair cap',[0,.18,-.015],[.33,.29,.31],hair);
sphere(head,'left hair',[ -.27,-.06,-.015],[.09,.34,.12],hair);
sphere(head,'right hair',[ .27,-.06,-.015],[.09,.34,.12],hair);
for(const x of [-.115,.115]){sphere(head,'eye',[x,.045,.257],[.035,.025,.018],eye);sphere(head,'iris',[x,.045,.272],[.013,.016,.008],mat(0x5a3828))}
sphere(head,'nose',[0,-.035,.285],[.035,.065,.035],skin);
sphere(head,'mouth',[0,-.16,.267],[.065,.012,.012],mat(0x874f4c));
const arms=[];
for(const x of [-1,1]){
 const pivot=new THREE.Group();pivot.position.set(x*.48,1.78,0);avatar.add(pivot);
 capsule(pivot,'upper arm',[0,-.29,0],.105,.38,shirt);
 sphere(pivot,'hand',[0,-.64,.015],[.095,.12,.09],skin);
 arms.push(pivot);
}
const legs=[];
for(const x of [-1,1]){
 const pivot=new THREE.Group();pivot.position.set(x*.19,.91,0);avatar.add(pivot);
 capsule(pivot,'leg',[0,-.36,0],.14,.48,pants);
 sphere(pivot,'shoe',[0,-.69,.10],[.15,.09,.25],shoe);
 legs.push(pivot);
}
let action='idle',start=performance.now(),baseY=0,turnFrom=0,turnTo=0;
function setAction(a){
 action=a;start=performance.now();baseY=avatar.position.y;turnFrom=avatar.rotation.y;
 if(a==='turn')turnTo=turnFrom+Math.PI;
 if(a==='stand'){avatar.position.y=0;avatar.rotation.y=0;action='idle'}
 document.querySelector('#hint').textContent=({idle:'EVA is standing by.',wave:'EVA is waving hello.',walk:'EVA is walking in place.',turn:'EVA is turning around.',sit:'EVA is sitting (simple demo pose).',stand:'EVA is standing.'})[a]||'Action started.';
 document.querySelector('#response').textContent='EVA: '+document.querySelector('#hint').textContent;
}
function runCommand(raw){
 const s=raw.toLowerCase();
 const pairs=[['wave','wave'],['hello','wave'],['walk','walk'],['turn','turn'],['around','turn'],['sit','sit'],['stand','stand'],['stop','idle'],['idle','idle']];
 const found=pairs.find(([k])=>s.includes(k));
 if(found){setAction(found[1]);return}
 document.querySelector('#response').textContent='EVA: I can do idle, wave, walk, turn, sit and stand in this demo.';
}
document.querySelector('#send').addEventListener('click',()=>{const v=document.querySelector('#command').value.trim();if(v)runCommand(v);document.querySelector('#command').value=''});
document.querySelector('#command').addEventListener('keydown',e=>{if(e.key==='Enter')document.querySelector('#send').click()});
document.querySelectorAll('[data-action]').forEach(b=>b.addEventListener('click',()=>setAction(b.dataset.action)));
function resize(){const w=canvas.clientWidth,h=canvas.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}
new ResizeObserver(resize).observe(canvas);
function animate(now){
 requestAnimationFrame(animate);const t=(now-start)/1000;
 avatar.position.y=0;arms.forEach(a=>a.rotation.set(0,0,0));legs.forEach(l=>l.rotation.set(0,0,0));
 if(action==='wave'){arms[1].rotation.z=-.9+Math.sin(t*10)*.35}
 if(action==='walk'){legs[0].rotation.x=Math.sin(t*8)*.55;legs[1].rotation.x=-Math.sin(t*8)*.55;arms[0].rotation.x=-Math.sin(t*8)*.3;arms[1].rotation.x=Math.sin(t*8)*.3;avatar.position.z=Math.sin(t*8)*.025}
 if(action==='turn'){avatar.rotation.y=THREE.MathUtils.lerp(turnFrom,turnTo,Math.min(t/1.1,1));if(t>1.15)action='idle'}
 if(action==='sit'){avatar.position.y=-.25;torso.rotation.x=-.22;legs[0].rotation.x=-1.0;legs[1].rotation.x=-1.0}
 else torso.rotation.x=0;
 if(action==='idle')avatar.position.y=Math.sin(now*.0015)*.012;
 renderer.render(scene,camera);
}
requestAnimationFrame(animate);
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));