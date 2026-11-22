(()=>{
const T=THREE,$=id=>document.getElementById(id),R=(a,b)=>a+Math.random()*(b-a),PI=Math.PI;
let S={snd:1,rose:0,moon:0,lit:[0,0,0,0,0,0],cam:null};
try{Object.assign(S,JSON.parse(localStorage.getItem('bt1')||'{}'))}catch(e){}
const save=()=>{S.cam={th:tth,ph:tph,d:td};try{localStorage.setItem('bt1',JSON.stringify(S))}catch(e){}};
let ren;try{ren=new T.WebGLRenderer({canvas:$('c'),antialias:true})}catch(e){$('err').style.display='block';return}
ren.setPixelRatio(Math.min(devicePixelRatio||1,2));
const sc=new T.Scene();sc.fog=new T.FogExp2(0x14302e,.01);
const cam=new T.PerspectiveCamera(50,1,.1,400),TG=new T.Vector3(0,4,-2);
const M=(c,o)=>new T.MeshStandardMaterial(Object.assign({color:c,roughness:.8,flatShading:true},o||{}));
const mesh=(g,m,x,y,z)=>{const o=new T.Mesh(g,m);o.position.set(x||0,y||0,z||0);return o};
const pk=[],reg=(m,k,i)=>{m.userData.k=k;m.userData.i=i;pk.push(m)},regG=(g,k,i)=>g.traverse(o=>{if(o.isMesh)reg(o,k,i)});
const gc=document.createElement('canvas');gc.width=gc.height=64;
{const x=gc.getContext('2d'),g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.3,'rgba(255,255,255,.35)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,64,64)}
const GT=new T.CanvasTexture(gc);
const glow=(c,s,o)=>{const m=new T.Sprite(new T.SpriteMaterial({map:GT,color:c,blending:T.AdditiveBlending,depthWrite:false,transparent:true,opacity:o==null?1:o}));m.scale.setScalar(s);return m};
function ctex(w,h,base,cols,n,a,b){const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');x.fillStyle=base;x.fillRect(0,0,w,h);for(let i=0;i<n;i++){x.globalAlpha=R(.15,.5);x.fillStyle=cols[i%cols.length];x.beginPath();x.ellipse(R(0,w),R(0,h),R(a,b),R(a,b)*.7,R(0,3),0,6.3);x.fill()}return new T.CanvasTexture(c)}
/* سماء */
const sky=new T.Mesh(new T.SphereGeometry(250,24,16),new T.ShaderMaterial({side:T.BackSide,depthWrite:false,fog:false,uniforms:{u:{value:0}},vertexShader:'varying float h;void main(){h=normalize(position).y;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'varying float h;uniform float u;void main(){vec3 c=mix(vec3(.09,.2,.19),vec3(.03,.07,.13),smoothstep(-.05,.35,h));c=mix(c,vec3(.012,.025,.06),smoothstep(.3,.9,h));c+=u*vec3(.03,.05,.05);gl_FragColor=vec4(c,1.);}'}));
sc.add(sky);
const amb=new T.HemisphereLight(0x8fb0a8,0x2a1d12,.55),moonL=new T.DirectionalLight(0xdfe8ff,.8),warm=new T.PointLight(0xffc977,.9,24);
moonL.position.set(-14,15,-26);warm.position.set(1,3.5,2);sc.add(amb,moonL,warm);
/* جسيمات التفاعل */
const N=500,pp=new Float32Array(N*3),pc=new Float32Array(N*4),ps=new Float32Array(N),pv=new Float32Array(N*3),pl=new Float32Array(N),pm=new Float32Array(N),pg=new Float32Array(N);
const pgeo=new T.BufferGeometry();pgeo.setAttribute('position',new T.BufferAttribute(pp,3));pgeo.setAttribute('col',new T.BufferAttribute(pc,4));pgeo.setAttribute('size',new T.BufferAttribute(ps,1));
const PM=new T.ShaderMaterial({transparent:true,depthWrite:false,blending:T.AdditiveBlending,uniforms:{pr:{value:1}},vertexShader:'attribute vec4 col;attribute float size;varying vec4 c;uniform float pr;void main(){c=col;vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=size*pr*700./-mv.z;gl_Position=projectionMatrix*mv;}',fragmentShader:'varying vec4 c;void main(){float d=length(gl_PointCoord-.5)*2.;float a=smoothstep(1.,0.,d);gl_FragColor=vec4(c.rgb,c.a*a*a);}'});
const pts=new T.Points(pgeo,PM);pts.frustumCulled=false;sc.add(pts);
let pi=0;const tc=new T.Color();
function emit(p,col,n,sp,g,sz,life){tc.set(col);for(let k=0;k<n;k++){const i=pi=(pi+1)%N,a=R(0,6.283),b=R(-1,1),r=Math.sqrt(1-b*b),s=sp*R(.3,1);pp[i*3]=p.x;pp[i*3+1]=p.y;pp[i*3+2]=p.z;pv[i*3]=r*Math.cos(a)*s;pv[i*3+1]=b*s;pv[i*3+2]=r*Math.sin(a)*s;pl[i]=pm[i]=life*R(.6,1);pg[i]=g;ps[i]=sz*R(.6,1.2);pc[i*4]=tc.r;pc[i*4+1]=tc.g;pc[i*4+2]=tc.b;pc[i*4+3]=1}}
function upP(dt){for(let i=0;i<N;i++){if(pl[i]>0){pl[i]-=dt;pv[i*3+1]-=pg[i]*dt;const d=1-dt*1.2;for(let j=0;j<3;j++){pv[i*3+j]*=d;pp[i*3+j]+=pv[i*3+j]*dt}pc[i*4+3]=Math.max(0,pl[i]/pm[i])}else pc[i*4+3]=0}pgeo.attributes.position.needsUpdate=pgeo.attributes.col.needsUpdate=pgeo.attributes.size.needsUpdate=true}
/* نجوم وفراشات ضوء */
const TU={value:0};
function dust(n,fn,sz,col,mv){const g=new T.BufferGeometry(),p=new Float32Array(n*3),s=new Float32Array(n*2);for(let i=0;i<n;i++){p.set(fn(),i*3);s[i*2]=R(.4,1);s[i*2+1]=R(0,6.28)}g.setAttribute('position',new T.BufferAttribute(p,3));g.setAttribute('sd',new T.BufferAttribute(s,2));
const o=new T.Points(g,new T.ShaderMaterial({transparent:true,depthWrite:false,blending:T.AdditiveBlending,uniforms:{t:TU,pr:PM.uniforms.pr,sz:{value:sz},col:{value:new T.Color(col)},mv:{value:mv}},vertexShader:'attribute vec2 sd;uniform float t,pr,sz,mv;varying float a;void main(){vec3 p=position+mv*vec3(sin(t*.3+sd.y),sin(t*.4+sd.y*1.7)*.8,cos(t*.35+sd.y*.6));vec4 v=modelViewMatrix*vec4(p,1.);a=.45+.55*sin(t*(.6+sd.x)+sd.y*3.);gl_PointSize=sz*sd.x*pr*700./-v.z;gl_Position=projectionMatrix*v;}',fragmentShader:'uniform vec3 col;varying float a;void main(){float d=length(gl_PointCoord-.5)*2.;float k=smoothstep(1.,0.,d);gl_FragColor=vec4(col,a*k*k);}'}));
o.frustumCulled=false;sc.add(o);return o}
const bgStars=dust(450,()=>{const a=R(0,6.28),e=R(.02,1.5),r=150;return[Math.cos(a)*Math.cos(e)*r,Math.sin(e)*r,Math.sin(a)*Math.cos(e)*r]},.9,0xdfe9ff,0);
dust(110,()=>[R(-16,16),R(-1,10),R(-16,10)],.13,0xffe3a0,1.2);
dust(70,()=>[R(-22,22),-1.3,R(-22,10)],.1,0x9fe8d8,.25);
/* جزيرة */
const isl=new T.Group(),brown=M(0x5b3d24),
top=mesh(new T.CylinderGeometry(6.5,6.2,1,40),[brown,M(0x3f7040),brown],0,-.5,0),
cone=mesh(new T.ConeGeometry(6.2,6,32,1),brown,0,-4,0);cone.rotation.x=PI;
isl.add(top,cone);sc.add(isl);reg(top,'x');reg(cone,'x');
for(let i=0;i<22;i++){const a=R(0,6.28),r=R(1,6),t=mesh(new T.ConeGeometry(.07,R(.25,.5),4),M(i%3?0x5da25a:0x7fbf6a),Math.cos(a)*r,.15,Math.sin(a)*r);t.rotation.set(R(-.3,.3),0,R(-.3,.3));sc.add(t)}
for(let i=0;i<7;i++){const a=R(0,6.28),r=R(3,6);sc.add(mesh(new T.DodecahedronGeometry(R(.15,.35)),M(0x6b5a4a),Math.cos(a)*r,.08,Math.sin(a)*r))}
/* بحر */
const wg=new T.PlaneGeometry(90,90,52,52),wp=wg.attributes.position,bx=Float32Array.from(wp.array.filter((_,i)=>i%3==0)),by=Float32Array.from(wp.array.filter((_,i)=>i%3==1));
const water=new T.Mesh(wg,new T.MeshPhongMaterial({color:0x123e44,specular:0xa8e6da,shininess:90,transparent:true,opacity:.92}));water.rotation.x=-PI/2;water.position.y=-1.5;sc.add(water);reg(water,'water');
const rips=[];for(let i=0;i<5;i++){const r=mesh(new T.RingGeometry(.9,1,40),new T.MeshBasicMaterial({color:0xa8f0e0,transparent:true,opacity:0,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide}));r.rotation.x=-PI/2;r.a=0;sc.add(r);rips.push(r)}let rpi=0;
/* قمر */
const moon=mesh(new T.SphereGeometry(3.2,32,24),new T.MeshStandardMaterial({map:ctex(256,128,'#cfd3d6',['#9ea4aa','#e7e9ea','#b6bbc0'],70,4,18),emissive:0xdde6f0,emissiveIntensity:.5,roughness:1,fog:false}),-14,15,-26),mg2=glow(0xcfe0ff,24,.5);
moon.add(mg2);sc.add(moon);reg(moon,'moon');
const mref=glow(0xcfe0ff,14,.3);mref.position.set(-14,-1.3,-26);sc.add(mref);
/* الكوكبان والمدار */
const C=new T.Vector3(0,9,-12),RX=9,RZ=4.5,planets=[];
[[1.7,'#3f6b3a',['#6b4a2a','#2e5530','#8a6a3c','#4f8a48'],0x8fe08a],[1.35,'#b89a6a',['#2f7a73','#e9dcc0','#8a5a34','#4f9a8f'],0xf0d79a]].forEach(([r,b,cs,gc2],i)=>{const m=mesh(new T.SphereGeometry(r,32,24),new T.MeshStandardMaterial({map:ctex(512,256,b,cs,130,6,26),roughness:.85}));m.add(glow(gc2,r*4.2,.3));sc.add(m);reg(m,'planet',i);
const rings=[0,1].map(()=>{const q=mesh(new T.RingGeometry(1,1.07,48),new T.MeshBasicMaterial({color:gc2,transparent:true,opacity:0,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide}));sc.add(q);return q});
planets.push({m,rings,a:0,r,col:gc2})});
{const p=[];for(let i=0;i<=160;i++){const a=i/160*6.2832;p.push(new T.Vector3(C.x+RX*Math.cos(a),C.y,C.z+RZ*Math.sin(a)))}
var orb=new T.LineLoop(new T.BufferGeometry().setFromPoints(p),new T.LineBasicMaterial({color:0xcfe8b0,transparent:true,opacity:.25,blending:T.AdditiveBlending,depthWrite:false}));sc.add(orb)}
const op=new Float32Array(180),oph=Array.from({length:60},()=>R(0,6.28)),opg=new T.BufferGeometry();opg.setAttribute('position',new T.BufferAttribute(op,3));
const opm=new T.PointsMaterial({map:GT,color:0xe5f5c8,size:.5,transparent:true,blending:T.AdditiveBlending,depthWrite:false});const opts=new T.Points(opg,opm);opts.frustumCulled=false;sc.add(opts);
function label(txt,col,sx){const c=document.createElement('canvas');c.width=256;c.height=64;const x=c.getContext('2d');x.font='700 40px Segoe UI,Tahoma,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillStyle=col;x.shadowColor=col;x.shadowBlur=12;x.fillText(txt,128,34);const s=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(c),transparent:true,depthWrite:false,depthTest:false}));s.scale.set(sx,sx/4,1);return s}
[['أنا','#cfe8b0'],['بانا','#f0d79a']].forEach(([n,c],i)=>{const q=planets[i],l=label(n,c,3);l.position.y=-q.r-.9;q.m.add(l)});
const sat=mesh(new T.SphereGeometry(.22,12,10),M(0x8a6a3c));planets[0].m.add(sat);
const rg=mesh(new T.TorusGeometry(2.1,.05,6,48),new T.MeshBasicMaterial({color:0xf0d79a,transparent:true,opacity:.6}));rg.rotation.x=1.2;planets[1].m.add(rg);
const lk=new T.Line(new T.BufferGeometry().setFromPoints([new T.Vector3(),new T.Vector3()]),new T.LineBasicMaterial({color:0xff9aaa,transparent:true,opacity:0,blending:T.AdditiveBlending,depthWrite:false}));lk.frustumCulled=false;sc.add(lk);
/* شجرة */
const tree=new T.Group();tree.position.set(-3,0,-1.5);sc.add(tree);
const tk=mesh(new T.CylinderGeometry(.28,.5,3.4,7),M(0x5a3a22),0,1.7,0);tk.rotation.z=.06;tree.add(tk);
[[.5,2.6,-.9,1.3],[-.5,3,.8,1.1],[0,3.4,.2,.9]].forEach(([x,y,rz,l])=>{const b=mesh(new T.CylinderGeometry(.07,.14,l,5),M(0x5a3a22),x,y,0);b.rotation.z=rz;tree.add(b)});
const fol=[[0,4.2,0,1.5],[-1.1,3.6,.4,1.1],[1.1,3.7,-.3,1.2],[.3,5.2,.2,1],[-.6,4.8,-.7,.9],[.8,4.7,.8,.9]].map(([x,y,z,r],i)=>{const f=mesh(new T.IcosahedronGeometry(r,1),M([0x3d7a43,0x4a8a48,0x2f6a3c][i%3],{emissive:0x4a9a40,emissiveIntensity:.12}),x,y,z);f.b=f.position.clone();tree.add(f);return f});
regG(tree,'tree');
/* قلب */
const hs=new T.Shape();hs.moveTo(0,-3);hs.bezierCurveTo(-1,-2,-4,.2,-4,2);hs.bezierCurveTo(-4,4,-1.5,5,0,3);hs.bezierCurveTo(1.5,5,4,4,4,2);hs.bezierCurveTo(4,.2,1,-2,0,-3);
const hg=new T.ExtrudeGeometry(hs,{depth:1.4,bevelEnabled:true,bevelThickness:.5,bevelSize:.5,bevelSegments:5,curveSegments:24});hg.center();
const heart=new T.Mesh(hg,new T.MeshStandardMaterial({color:0xc4465a,emissive:0x5a0c1c,roughness:.3,metalness:.1}));heart.position.set(0,4.6,.5);heart.scale.setScalar(.22);
const hgl=glow(0xff6a7a,30,.35);heart.add(hgl);sc.add(heart);reg(heart,'heart');
/* فوانيس */
const lants=[[-4.8,.9,2.8],[4.6,.9,1.8],[-1.8,3.2,2.4],[5.2,2.6,-2.6],[0,1.4,-4.2],[-6,2.4,-3.6]].map((p,i)=>{const g=new T.Group(),bm=new T.MeshStandardMaterial({color:0xffd89a,emissive:0xffa84a,emissiveIntensity:.9,roughness:.5}),dk=M(0x4a3020);
g.add(mesh(new T.CylinderGeometry(.28,.28,.55,6),bm),mesh(new T.CylinderGeometry(.18,.34,.14,6),dk,0,.34,0),mesh(new T.CylinderGeometry(.3,.2,.1,6),dk,0,-.32,0),mesh(new T.TorusGeometry(.12,.015,6,12),dk,0,.5,0));
const gl=glow(0xffb85a,2.6,.6);g.add(gl);g.position.set(p[0],p[1],p[2]);sc.add(g);regG(g,'lant',i);
return{g,bm,gl,y0:p[1],ph:R(0,6),pulse:0,rise:0,off:0,lit:S.lit[i]?1:0}});
/* ابن بانا: شخصية أصلية - ظل طويل بعباءة ورأس متعدد الأوجه وعينين بنفسجيتين */
let ndH,ndArmL,ndArmR,ndG1,ndG2,ndEye;const ND=new T.Group();ND.position.set(-2.2,0,-4.3);ND.rotation.y=.35;sc.add(ND);
{const dk=new T.MeshStandardMaterial({color:0x17111f,roughness:.5,metalness:.25,flatShading:true});
ND.add(mesh(new T.CylinderGeometry(.16,.5,2.5,8),dk,0,1.25,0));
ndH=new T.Group();ndH.position.set(0,2.95,0);ND.add(ndH);ndH.add(mesh(new T.DodecahedronGeometry(.34,0),dk));
ndEye=new T.MeshBasicMaterial({color:0xb06bff});
[-1,1].forEach(s=>{const e=mesh(new T.BoxGeometry(.15,.05,.02),ndEye,s*.14,.03,.3);e.rotation.z=-s*.25;ndH.add(e)});
ndG1=glow(0xb06bff,.5,.6);ndG2=glow(0xb06bff,.5,.6);ndG1.position.set(-.14,.03,.34);ndG2.position.set(.14,.03,.34);ndH.add(ndG1,ndG2);
ND.add(mesh(new T.TorusGeometry(.09,.015,6,16,4.2),ndEye,0,1.9,.3));
[-1,1].forEach(s=>{const g=new T.Group();g.add(mesh(new T.CylinderGeometry(.04,.03,1.7,5),dk,0,-.8,0));g.position.set(s*.2,2.35,0);g.rotation.z=s*.12;ND.add(g);if(s<0)ndArmL=g;else ndArmR=g});
const au=glow(0x7a3fd0,3.2,.15);au.position.y=1.6;ND.add(au)}
regG(ND,'ender');
const ndl=label('ابن بانا','#e8c987',3.6);ndl.position.set(-2.2,.55,-3.3);sc.add(ndl);
/* قطتان */
function mkCat(col,eye,x,z,ry,i){const g=new T.Group(),m=new T.MeshStandardMaterial({color:col,roughness:.8}),body=mesh(new T.SphereGeometry(.5,16,12),m,0,.45,0);body.scale.set(.9,.9,1.25);
const head=new T.Group();head.position.set(0,.98,.48);head.add(mesh(new T.SphereGeometry(.34,16,12),m));
[-1,1].forEach(s=>{const e=mesh(new T.ConeGeometry(.12,.28,4),m,s*.2,.3,0);e.rotation.z=-s*.3;head.add(e,mesh(new T.SphereGeometry(.055,8,8),new T.MeshBasicMaterial({color:eye}),s*.13,.05,.3));g.add(mesh(new T.SphereGeometry(.11,8,8),m,s*.2,.1,.38))});
head.add(mesh(new T.SphereGeometry(.04,6,6),new T.MeshBasicMaterial({color:0xe9a3a0}),0,-.04,.33));
const tail=new T.Group();tail.position.set(0,.4,-.58);tail.add(mesh(new T.CylinderGeometry(.05,.08,.85,6),m,0,.42,0));tail.rotation.x=-.3;
g.add(body,head,tail);g.position.set(x,0,z);g.rotation.y=ry;sc.add(g);regG(g,'cat',i);return{g,head,tail,body,a:0,ry,ph:i*2}}
const cats=[mkCat(0x7a5230,0xffd24a,-.3,3,.5,0),mkCat(0xe7dcc2,0x6fd0a0,1.3,2.6,-.4,1)];
/* فراشات */
const bfs=[[0xe8c36a,3,3,-1],[0x7fd18a,-3,4.5,-1.5],[0xf2ead6,0,5,1],[0xd98a5a,4,2.5,2],[0x9ad7c8,-5,3,2],[0xe8c36a,1,6,-2],[0xf0b8c0,3.5,3.5,-1.5]].map(([c,x,y,z],i)=>{const g=new T.Group(),mt=new T.MeshBasicMaterial({color:c,side:T.DoubleSide,transparent:true,opacity:.92}),wgm=new T.PlaneGeometry(.55,.42);wgm.translate(.28,0,0);
const p1=new T.Group(),p2=new T.Group(),w1=new T.Mesh(wgm,mt),w2=new T.Mesh(wgm,mt);w1.rotation.x=w2.rotation.x=-PI/2;w2.scale.x=-1;p1.add(w1);p2.add(w2);
g.add(p1,p2,mesh(new T.CylinderGeometry(.03,.03,.3,5),M(0x3a2a1a),0,0,0),glow(c,.9,.45));g.children[2].rotation.x=PI/2;sc.add(g);regG(g,'bf',i);
return{g,p1,p2,c:new T.Vector3(x,y,z),nc:new T.Vector3(x,y,z),ax:R(1.5,3),az:R(1.5,3),sp:R(.4,.8),ph:R(0,6),kick:new T.Vector3(),tr:0,last:new T.Vector3()}});
/* وردة */
const rose=new T.Group();rose.position.set(3.2,0,-1.2);sc.add(rose);
rose.add(mesh(new T.CylinderGeometry(.04,.06,1.7,6),M(0x3f7a3f),0,.85,0));
[-1,1].forEach(s=>{const l=mesh(new T.SphereGeometry(.22,8,6),M(0x4a8a48),s*.2,.6,0);l.scale.set(1,.12,.5);l.rotation.z=s*.5;rose.add(l)});
const bud=new T.Group();bud.position.y=1.75;rose.add(bud);const petals=[];
[[5,.1,.55,.16,0xb83d58],[6,.07,.85,.13,0xd8536e],[7,.04,1.2,.1,0xe97a8c]].forEach(([n,t0,t1,s,c],ri)=>{const mt=new T.MeshStandardMaterial({color:c,roughness:.6,side:T.DoubleSide,emissive:c,emissiveIntensity:.15});for(let k=0;k<n;k++){const py=new T.Group(),px=new T.Group();py.rotation.y=k/n*6.283+ri*.5;px.position.y=ri*.03;const p=mesh(new T.SphereGeometry(1,10,8),mt,0,.17+ri*.02,0);p.scale.set(s*1.1,s*1.6,s*.35);px.add(p);py.add(px);bud.add(py);petals.push({px,t0,t1});}});
const rgl=glow(0xff8aa0,1,0);bud.add(rgl);regG(rose,'rose');let rb=S.rose?1:0;
/* فقاعات */
const btint=[0x9fe8d8,0xffe3a0,0xf0b8c8,0xb8d8ff],bubs=Array.from({length:14},(_,i)=>{const m=new T.Mesh(new T.SphereGeometry(1,16,12),new T.MeshStandardMaterial({color:btint[i%4],transparent:true,opacity:.24,roughness:0,metalness:.6,emissive:btint[i%4],emissiveIntensity:.15}));const b={m,r:R(.2,.5),vy:R(.25,.6),i,off:0,ph:R(0,6),hide:0};b.rs=()=>{m.position.set(R(-9,9),R(-1,9),R(-8,6));m.visible=true};b.rs();sc.add(m);reg(m,'bub',i);return b});
bubs.slice(0,3).forEach((b,i)=>{const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');x.font='bold 64px Segoe UI,Tahoma,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillStyle='#ffe9b0';x.shadowColor='#ffcf70';x.shadowBlur=14;x.fillText(OURS.dates[i]||['♥','∞','✦'][i],64,64);const s=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(c),transparent:true,depthWrite:false}));s.scale.setScalar(1.3);b.m.add(s)});
/* نجوم تفاعلية */
const stars=Array.from({length:28},(_,i)=>{const f=R(-1.9,1.9),e=R(.15,1),r=R(70,100),g=new T.Group(),s=R(1,2);g.position.set(Math.sin(f)*Math.cos(e)*r,Math.sin(e)*r,-Math.cos(f)*Math.cos(e)*r);
const core=new T.Mesh(new T.OctahedronGeometry(.6,0),new T.MeshBasicMaterial({color:i%3==1?0xffe9a8:0xf4f8ff,fog:false}));core.scale.setScalar(s);const gl=glow(0xcfe0ff,7*s,.6);gl.material.fog=false;
const hit=new T.Mesh(new T.SphereGeometry(4.5,6,4),new T.MeshBasicMaterial({visible:false}));g.add(core,gl,hit);sc.add(g);reg(hit,'star',i);
return{g,core,gl,s,base:g.position.clone(),type:i%3,a:0,ph:R(0,6),dir:new T.Vector3(R(-1,1),R(-.6,-.1),0).normalize()}});
/* صوت */
let ac,mg;
function initAudio(){if(ac){if(ac.state==='suspended')ac.resume();return}try{ac=new(window.AudioContext||window.webkitAudioContext)();mg=ac.createGain();mg.gain.value=S.snd?1:0;mg.connect(ac.destination);
[[110,.02],[164.81,.014],[220,.012],[277.18,.006]].forEach(([f,v],i)=>{const o=ac.createOscillator(),g=ac.createGain(),l=ac.createOscillator(),lg=ac.createGain();o.frequency.value=f;g.gain.value=v;l.frequency.value=.05+i*.03;lg.gain.value=v*.7;l.connect(lg);lg.connect(g.gain);o.connect(g);g.connect(mg);o.start();l.start()})}catch(e){ac=null}}
function tone(f,d,ty,v,f2){if(!ac||!S.snd)return;const t=ac.currentTime,o=ac.createOscillator(),g=ac.createGain();o.type=ty||'sine';o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v||.1,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(mg);o.start(t);o.stop(t+d+.05)}
function noise(d,f,v){if(!ac||!S.snd)return;const n=Math.floor(ac.sampleRate*d),b=ac.createBuffer(1,n,ac.sampleRate),a=b.getChannelData(0);for(let i=0;i<n;i++)a[i]=(Math.random()*2-1)*(1-i/n);const s=ac.createBufferSource(),fl=ac.createBiquadFilter(),g=ac.createGain();fl.type='bandpass';fl.frequency.value=f;g.gain.value=v;s.buffer=b;s.connect(fl);fl.connect(g);g.connect(mg);s.start()}
const sbtn=$('snd');const sUI=()=>{sbtn.classList.toggle('off',!S.snd);if(mg)mg.gain.setTargetAtTime(S.snd?1:0,ac.currentTime,.1)};sUI();
sbtn.onclick=()=>{initAudio();S.snd=S.snd?0:1;sUI();save();if(S.snd)tone(660,.6,'sine',.06)};
/* تفاعلات */
let ob=0,mp=0,wb=S.moon?1:0,hb=0,ht=0,tg=0,tl=0,lastP=null,ndT=0,tapN=0,tapT=-9;const P=new T.Vector3();
/* محتوى شخصي: لا يوجد هنا إلا ما ذكرته أنت. املأ الحقول الفارغة بنصوصك وتواريخك فتظهر تلقائيًا */
const OURS={lants:['كنتُ أغني أثناء المكالمة ولم أنتبه أنكِ دخلتِ وسمعتِني.','تتعمدين الزعل… ثم تضحكين.','ضحكاتنا العفوية.','بعض الأضواء لا تُطفأ، يكفيها من يرفعها معك.','بين عالمين مسافةٌ صغيرة، يقطعها الضوء كل ليلة.','ما يُقال بهدوء يصل أبعد.'],tree:'الجذور في الأرض، والأوراق تتجدد، وبينهما وقتٌ يكبر معنا.',moon:'قمرٌ واحد، يراه اثنان من مكانين.',rose:'تتفتح كلما اقتربتَ منها بهدوء.',heart:'ما يتفرق من القلب يعود إليه.',bubs:['فقاعةٌ تحمل قلبًا، ثم تتركه للهواء.','ما لا نهاية له يبدأ بلحظة.','في كل فقاعة نجمةٌ صغيرة تختبئ.'],dates:['','',''],confession:'خلف كل نجمة نجمةٌ أخرى، وخلف كل ضوء من يراه معك.'};
let ctm;const card=$('card'),ct=$('ct');function hideCard(){card.classList.remove('on')}function say(s){if(!s)return;ct.textContent=s;card.classList.add('on');clearTimeout(ctm);ctm=setTimeout(hideCard,9000)}$('cx').onclick=hideCard;
function rippleAt(x,z){const r=rips[rpi=(rpi+1)%5];r.a=1;r.position.set(x,-1.35,z);emit(P.set(x,-1.3,z),0xcfe0ff,8,2,3,.25,1.4)}
function found(a,b){for(let k=0;k<=10;k++)emit(P.lerpVectors(a,b,k/10),0xff8aa0,3,1,0,.5,2);tone(523,2,'sine',.06);tone(659,2,'sine',.05);tone(784,2,'sine',.05)}
function act(k,i,p){({
star(){const s=stars[i];s.a=1;if(i==13)say(OURS.confession);emit(s.g.position,s.type==1?0xffe9a8:0xffffff,s.type==2?10:34,s.type==1?9:6,0,1.6,1.4);tone([880,988,1175,1319,1568][i%5]*(s.type==1?1:.5),1.4,'sine',.07)},
ender(){ndT=1;emit(P.set(ND.position.x,ND.position.y+2.9,ND.position.z),0xb06bff,24,2.5,-.2,.3,1.6);tone(110,.9,'sine',.08,70);tone(220,.7,'triangle',.03,160);tapN=t-tapT<2?tapN+1:1;tapT=t;if(tapN>=3){tapN=0;const cs=[ndEye,ndG1.material,ndG2.material];cs.forEach(m=>m.color.set(0xffd27a));for(let k=0;k<12;k++)setTimeout(()=>emit(P.set(R(-6,6),R(8,11),R(-6,2)),0xffe3a0,8,1.5,.4,.4,2.2),k*160);tone(880,1.5,'sine',.06);setTimeout(()=>cs.forEach(m=>m.color.set(0xb06bff)),5000)}},
planet(){const q=planets[i];q.a=1;ob=1;if(lastP&&lastP.i!==i&&t-lastP.t<4){ob=1.6;hb=1;ht=1.4;found(planets[0].m.position,planets[1].m.position)}lastP={i,t};emit(q.m.position,q.col,26,3,0,.5,1.6);tone(i?261:196,1.8,'sine',.1);tone(i?392:293,2,'triangle',.05)},
moon(){S.moon=S.moon?0:1;mp=1;save();for(let k=0;k<5;k++)setTimeout(()=>rippleAt(-14+R(-4,4),-24+R(-4,4)),k*350);say(OURS.moon);tone(330,2.2,'triangle',.07,392);emit(moon.position,0xdde8ff,40,6,0,2,1.8)},
water(){const r=rips[rpi=(rpi+1)%5];r.a=1;r.position.set(p.x,-1.35,p.z);emit(P.set(p.x,-1.3,p.z),0x9fe8d8,16,2.2,3,.2,1.2);noise(.5,600,.1);tone(520,.5,'sine',.04,260)},
heart(){hb=1;ht=1.4;say(OURS.heart);emit(heart.position,0xff7a8c,50,3.5,0,.35,1.6);tone(261,1.4,'sine',.08);tone(392,1.4,'sine',.06)},
tree(){tg=1;tl=1;say(OURS.tree);fol.forEach(f=>{f.getWorldPosition(P);emit(P,0xcdeb8a,6,.8,1.2,.35,3.2)});noise(.7,3000,.06);tone(660,.6,'sine',.04)},
lant(){const l=lants[i];S.lit[i]=S.lit[i]?0:1;l.pulse=1;l.rise=1.8;l.shake=i==2||i==5?1:0;if(i==3)l.rise=3.2;save();const q=l.g.position;
if(i==0){for(let k=0;k<5;k++)setTimeout(()=>{emit(q,0xffd27a,3,.8,-.7,.4,2.2);tone([523,587,659,784,880][k],.5,'sine',.05)},k*180)}
else if(i==1){l.dim=1.2;setTimeout(()=>{[0xffffff,0xffb0c0,0xb0f0c0].forEach(c=>emit(q,c,20,4,.5,.3,1.4));l.pulse=1.5;tone(784,.5,'triangle',.07,1175)},1200)}
else if(i==2){emit(q,0xffe3a0,24,3,.2,.3,1.4);tone(660,.2,'triangle',.06,880);setTimeout(()=>tone(740,.2,'triangle',.06,990),180)}
else if(i==3){emit(q,0xfff0c0,40,5,0,.25,1.8);tone(392,1.6,'sine',.05);tone(587,1.6,'sine',.04)}
else if(i==4){emit(q,0x9fe8d8,30,2,-.8,.3,2.4);emit(q,0xb8d8ff,16,1.5,-.6,.3,2.4);tone(740,1.2,'sine',.05,555)}
else{emit(q,0xaef0c0,30,3,-.3,.3,2);tone(330,.8,'triangle',.05,415)}
tone(587,1.4,'sine',.06,660);setTimeout(()=>say(OURS.lants[i]),900)},
cat(){const c=cats[i];if(c.a>0)return;c.a=1;cats[1-i].near=3;tone(700,.35,'triangle',.07,i?900:420);tone(i?500:900,.3,'triangle',.04,i?300:600)},
bf(){const b=bfs[i];b.tc=[0xffe3a0,0xaef0c0,0xffc0d8][i%3];if(i%3==2)emit(b.g.position,0xffc0d8,14,1.5,0,.25,1.2);b.nc.set(R(-6,6),R(2,7),R(-4,4));b.kick.set(R(-1,1),R(.5,1.5),R(-1,1)).multiplyScalar(2);b.tr=1.2;b.ph+=R(1,3);tone(1400,.15,'sine',.03,1800)},
rose(){S.rose=S.rose?0:1;save();say(OURS.rose);bud.getWorldPosition(P);emit(P,0xff8aa0,30,2,.3,.3,1.8);tone(440,1.6,'sine',.05);tone(554,1.6,'sine',.04);tone(659,1.6,'sine',.04)},
bub(){const b=bubs[i];if(i<3){b.m.getWorldPosition(P);emit(P,0xffe3a0,20,3,0,.3,1.6);say(OURS.bubs[i])}b.m.getWorldPosition(P);emit(P,btint[i%4],24+i%3*10,2+i%3*1.5,.5,.18,1);b.m.visible=false;b.hide=2.5;tone(400+i*60,.14,'sine',.07,150+i*20)}
})[k]?.()}
/* كاميرا وإدخال */
let th=0,ph=1.3,d=24,tth=0,tph=1.3,td=24,kk=1;
if(S.cam){tth=th=+S.cam.th||0;tph=ph=+S.cam.ph||1.3;td=d=+S.cam.d||24}
const lim=()=>{tth=Math.max(-.95,Math.min(.95,tth));tph=Math.max(1,Math.min(1.62,tph));td=Math.max(12,Math.min(38,td))};lim();
$('rst').onclick=()=>{tth=0;tph=1.3;td=24;save();initAudio()};
const cvs=$('c'),ptr=new Map(),rc=new T.Raycaster(),ring=$('ring');let down=null,pd=0;
const pdist=()=>{const a=[...ptr.values()];return Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y)||1};
function hit(x,y){rc.setFromCamera({x:x/innerWidth*2-1,y:-(y/innerHeight)*2+1},cam);const h=rc.intersectObjects(pk,false)[0];return h&&h.object.userData.k!=='x'?h:null}
cvs.addEventListener('pointerdown',e=>{initAudio();document.body.classList.add('go');cvs.setPointerCapture(e.pointerId);ptr.set(e.pointerId,{x:e.clientX,y:e.clientY});if(ptr.size===1)down={t:performance.now(),mv:0};else{down=null;pd=pdist()}});
let hq=0;
cvs.addEventListener('pointermove',e=>{const p=ptr.get(e.pointerId);if(!p){if(e.pointerType==='mouse'&&!hq){hq=1;requestAnimationFrame(()=>{hq=0;const h=hit(e.clientX,e.clientY);cvs.style.cursor=h?'pointer':'grab';ring.style.opacity=h?1:0;ring.style.transform='translate('+e.clientX+'px,'+e.clientY+'px)'})}return}
const dx=e.clientX-p.x,dy=e.clientY-p.y;p.x=e.clientX;p.y=e.clientY;
if(ptr.size===1){if(down){down.mv+=Math.abs(dx)+Math.abs(dy);if(down.mv>6){tth-=dx*.005;tph-=dy*.005}}lim()}else if(ptr.size===2){const nd=pdist();td*=pd/nd;pd=nd;lim()}});
const up=(e,ok)=>{if(!ptr.has(e.pointerId))return;ptr.delete(e.pointerId);if(ok&&down&&down.mv<8&&performance.now()-down.t<600){const h=hit(e.clientX,e.clientY);if(h)act(h.object.userData.k,h.object.userData.i,h.point)}down=null;save()};
cvs.addEventListener('pointerup',e=>up(e,1));cvs.addEventListener('pointercancel',e=>up(e,0));
cvs.addEventListener('wheel',e=>{e.preventDefault();td+=e.deltaY*.02;lim()},{passive:false});
function rs(){const w=innerWidth,h=innerHeight;ren.setSize(w,h,false);cam.aspect=w/h;kk=Math.min(2.1,Math.max(1,Math.pow(1.25/cam.aspect,.8)));cam.fov=cam.aspect<1?58:50;cam.updateProjectionMatrix();PM.uniforms.pr.value=ren.getPixelRatio()*h/900}
addEventListener('resize',rs);rs();
/* التحديث */
let t=0,fr=0,raf,last=performance.now();
function update(dt){
th+=(tth-th)*Math.min(1,dt*6);ph+=(tph-ph)*Math.min(1,dt*6);d+=(td-d)*Math.min(1,dt*6);
const dd=d*kk;cam.position.set(TG.x+dd*Math.sin(ph)*Math.sin(th),TG.y+dd*Math.cos(ph),TG.z+dd*Math.sin(ph)*Math.cos(th));cam.lookAt(TG);
/* ماء */
const a=wp.array;for(let i=0;i<bx.length;i++){const x=bx[i],y=by[i];a[i*3+2]=.16*Math.sin(x*.35+t*.8)+.12*Math.cos(y*.45+t*1.1)+.06*Math.sin((x+y)*.8+t*1.7)}wp.needsUpdate=true;if(fr++%2==0)wg.computeVertexNormals();
rips.forEach(r=>{if(r.a>0){r.a-=dt*.5;const k=1-r.a;r.scale.setScalar(1+k*9);r.material.opacity=Math.max(0,r.a)*.8}else r.material.opacity=0});
/* ضوء العالم والقمر */
wb+=((S.moon?1:0)-wb)*dt*1.5;mp=Math.max(0,mp-dt*.6);amb.intensity=.55+.45*wb;moonL.intensity=.8+.8*wb;sky.material.uniforms.u.value=wb;mg2.scale.setScalar(24+wb*10+mp*14);mg2.material.opacity=.5+.3*wb;mref.material.opacity=.2+.35*wb+mp*.3;mref.scale.set(10+wb*5,4,1);
moon.position.y=15+Math.sin(t*.2)*.5;moon.rotation.y+=dt*.02;bgStars.rotation.y+=dt*.004;
/* كوكبان */
ob=Math.max(0,ob-dt*.35);const ang=t*(.12+ob*.1);
planets.forEach((q,i)=>{const A=ang+i*PI;q.m.position.set(C.x+RX*Math.cos(A),C.y+Math.sin(t*.5+i*2)*.25,C.z+RZ*Math.sin(A));q.m.rotation.y+=dt*(.25+i*.12);
if(q.a>0){q.a-=dt/2;q.rings.forEach((r,k)=>{const kk2=Math.max(0,1-q.a-k*.2);r.position.copy(q.m.position);r.quaternion.copy(cam.quaternion);r.scale.setScalar(q.r*(1.2+kk2*3));r.material.opacity=q.a>0?Math.max(0,q.a-k*.25)*.8:0})}else q.rings.forEach(r=>r.material.opacity=0)});
orb.material.opacity=.25+ob*.6;sat.position.set(Math.cos(t*1.2)*2.6,Math.sin(t*.7)*.5,Math.sin(t*1.2)*2.6);{const lp=lk.geometry.attributes.position,a0=planets[0].m.position,a1=planets[1].m.position;lp.setXYZ(0,a0.x,a0.y,a0.z);lp.setXYZ(1,a1.x,a1.y,a1.z);lp.needsUpdate=true;lk.material.opacity=Math.min(1,ob*.8)}opm.size=.5+ob*.5;
for(let i=0;i<60;i++){const A=oph[i]+t*.15,j=i*3;op[j]=C.x+RX*Math.cos(A);op[j+1]=C.y+Math.sin(t*2+i)*.12;op[j+2]=C.z+RZ*Math.sin(A)}opg.attributes.position.needsUpdate=true;
/* نجوم */
stars.forEach(s=>{let sc2=1+.12*Math.sin(t*1.3+s.ph),off=0;s.core.rotation.y+=dt*.4;
if(s.a>0){s.a=Math.max(0,s.a-dt/1.6);const k=1-s.a;if(s.type==0)sc2+=Math.sin(PI*k)*1.8;else if(s.type==1){sc2+=.8*Math.sin(k*18)*s.a;s.core.rotation.y+=dt*10*s.a}else{off=Math.sin(PI*k)*20;if(fr%3==0)emit(s.g.position,0xcfe0ff,1,.3,0,1.2,.9)}}
s.g.position.copy(s.base).addScaledVector(s.dir,off);s.g.scale.setScalar(sc2);s.gl.material.opacity=.45+.2*Math.sin(t*1.7+s.ph)+s.a*.4});
/* شجرة */
tg=Math.max(0,tg-dt*.5);tl=Math.max(0,tl-dt*.22);fol.forEach((f,i)=>{f.position.set(f.b.x+Math.sin(t*.8+i)*.06,f.b.y+Math.sin(t*.6+i*2)*.05,f.b.z);f.rotation.z=Math.sin(t*.7+i)*.03;f.material.emissiveIntensity=.12+tg*1.1;f.scale.setScalar(1-.3*tl)});
/* قلب */
hb=Math.max(0,hb-dt*1.2);ht=Math.max(0,ht-dt);const bt=Math.pow(Math.max(0,Math.sin(t*3)),6)*.05;heart.scale.setScalar(.22*(1+bt+hb*.35));heart.position.y=4.6+Math.sin(t*.9)*.25;heart.rotation.y=Math.sin(t*.5)*.5;heart.material.emissiveIntensity=.7+hb*2+bt*6;hgl.material.opacity=.3+hb*.5;
if(ht>0&&fr%2==0){const a=R(0,6.28),q=P.set(heart.position.x+Math.cos(a)*2.6,heart.position.y+R(-1.5,1.5),heart.position.z+Math.sin(a)*2.6);emit(q,0xff9aaa,1,0,0,.3,.7);const j=pi;pv[j*3]=(heart.position.x-q.x)*1.4;pv[j*3+1]=(heart.position.y-q.y)*1.4;pv[j*3+2]=(heart.position.z-q.z)*1.4}
/* فوانيس */
lants.forEach((l,i)=>{l.pulse=Math.max(0,l.pulse-dt*.5);l.dim=Math.max(0,(l.dim||0)-dt);l.shake=Math.max(0,(l.shake||0)-dt*.8);l.rise=Math.max(0,l.rise-dt);const tgt=l.rise>0?1.4:0;l.off+=(tgt-l.off)*dt*2;l.lit+=((S.lit[i]?1:0)-l.lit)*dt*3;
l.g.position.y=l.y0+l.off+Math.sin(t*.8+l.ph)*.15;l.g.rotation.z=Math.sin(t*.6+l.ph)*.06+Math.sin(t*40)*.15*l.shake;const b=(.9+l.lit*.9+l.pulse*1.2)*(l.dim>0?.25:1);l.bm.emissiveIntensity=b;l.gl.material.opacity=.4+b*.2;l.gl.scale.setScalar(2.4+b*.6);
if(l.rise>0&&fr%2==0)emit(l.g.position,0xffc070,1,.4,-.5,.22,1.4)});
/* قطط */
cats.forEach((c,i)=>{const h=c.head,g=c.g,o=cats[1-i].g;if(c.bx==null){c.bx=g.position.x;c.bz=g.position.z}c.near=Math.max(0,(c.near||0)-dt);
const nx=c.near>0?o.position.x+(i?.9:-.9):c.bx,nz=c.near>0?o.position.z-.2:c.bz;g.position.x+=(nx-g.position.x)*dt*1.2;g.position.z+=(nz-g.position.z)*dt*1.2;
let la=Math.atan2(o.position.x-g.position.x,o.position.z-g.position.z)-g.rotation.y;la=Math.max(-1,Math.min(1,Math.atan2(Math.sin(la),Math.cos(la))));const w=Math.max(0,Math.min(1,(Math.sin(t*.2+i*3)-.4)*3));
h.rotation.y=Math.sin(t*.7+c.ph)*.5*(1-w)+la*w;h.rotation.z=Math.sin(t*.4+c.ph)*.06;c.tail.rotation.z=Math.sin(t*1.8+c.ph)*.4;c.body.scale.y=.9+Math.sin(t*1.5+c.ph)*.015;g.position.y=0;
if(c.a>0){c.a=Math.max(0,c.a-dt/(i?1.3:1.1));const k=1-c.a;if(i==0){g.position.y=Math.abs(Math.sin(PI*k*2))*.9;if(fr%3==0)emit(P.copy(g.position).setY(g.position.y+1.2),0xff9aaa,1,.8,-.3,.3,1.2)}else{g.rotation.y=c.ry+k*k*(3-2*k)*6.283;h.rotation.z+=Math.sin(PI*k)*.4;if(fr%3==0)emit(P.copy(g.position).setY(1),0xffe3a0,1,1,0,.25,1)}}else if(i==1)g.rotation.y=c.ry});
/* فراشات */
bfs.forEach((b,i)=>{b.tr=Math.max(0,b.tr-dt);b.c.lerp(b.nc,dt*1.2);b.kick.multiplyScalar(1-dt*1.5);const tt=t*b.sp+b.ph;
b.g.position.set(b.c.x+Math.sin(tt)*b.ax,b.c.y+Math.sin(tt*1.7)*.6,b.c.z+Math.cos(tt*.8)*b.az).add(b.kick);
const v=P.copy(b.g.position).sub(b.last);if(v.lengthSq()>1e-6)b.g.rotation.y=Math.atan2(v.x,v.z);b.last.copy(b.g.position);
const f=.25+Math.sin(t*18+i)*.9;b.p1.rotation.z=f;b.p2.rotation.z=-f;
if(b.tr>0&&fr%2==0)emit(b.g.position,b.tc||0xffe3a0,1,.2,0,.2,1.2)});
/* وردة */
rb+=((S.rose?1:0)-rb)*dt*1.8;petals.forEach((p,k)=>p.px.rotation.x=p.t0+(p.t1-p.t0)*rb+Math.sin(t*1.6+k)*.04*(.3+rb));bud.scale.setScalar(.75+.45*rb);rgl.scale.setScalar(.6+rb*1.8);rgl.material.opacity=rb*.5;rose.rotation.z=Math.sin(t*.8)*.02;
/* فقاعات */
bubs.forEach(b=>{if(b.hide>0){b.hide-=dt;if(b.hide<=0){b.rs();b.m.position.y=-1}return}const p=b.m.position;p.y+=b.vy*dt;p.x+=Math.sin(t*.7+b.ph)*.25*dt;if(p.y>10)b.rs(),p.y=-1.2;const w=1+Math.sin(t*3+b.ph)*.05;b.m.scale.set(b.r*w,b.r/w,b.r*w)});
ndH.rotation.y=Math.sin(t*.5)*.35+(Math.sin(t*.13)>.9?.6:0);ndH.rotation.z=Math.sin(t*.7)*.04+ndT*.2*Math.sin(t*25);ndArmL.rotation.x=Math.sin(t*.9)*.03;ndArmR.rotation.x=-Math.sin(t*.9)*.03;ND.position.x=-2.2+Math.sin(t*30)*.01*ndT;ndT=Math.max(0,ndT-dt*.8);
ndG1.material.opacity=ndG2.material.opacity=Math.min(1,(.7+.3*Math.sin(t*2)+ndT)*.6);ndG1.scale.setScalar(.45+ndT*.5);ndG2.scale.setScalar(.45+ndT*.5);if(fr%25==0)emit(P.set(ND.position.x+R(-.3,.3),R(.6,3),ND.position.z+R(-.3,.3)),0xb06bff,1,.2,-.3,.2,1.8);
warm.intensity=.8+Math.sin(t*2.3)*.08;
upP(dt)}
function loop(now){raf=requestAnimationFrame(loop);const dt=Math.min(.05,(now-last)/1000);last=now;t+=dt;TU.value=t;update(dt);ren.render(sc,cam)}
document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelAnimationFrame(raf);else{last=performance.now();raf=requestAnimationFrame(loop)}});
raf=requestAnimationFrame(loop);
})();
