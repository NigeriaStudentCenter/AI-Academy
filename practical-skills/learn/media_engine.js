(()=>{
'use strict';
const courses=window.BSOE_MEDIA||{};
const id=new URLSearchParams(location.search).get('course')||'plumbing';
const d=courses[id]||courses.plumbing;
let stage=0,fault=false,timer=null;
const $=s=>document.querySelector(s);
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const theme={bg:'#0e2330',muted:'#8ea4aa',ink:'#dceee8',blue:'#3cc6db',gold:'#ffc45e',coral:'#ff786b',green:'#5ee0a7'};
const stages={
 plumbing:[['Inspect parts','Check the tube, fitting body, olive and nut for compatibility and damage.'],['Prepare tube','The tube needs a square, clean and deburred end.'],['Seat tube','Insert it fully into the body, keeping the joint aligned.'],['Compress olive','The nut drives the olive against the tapered seat to make a seal.'],['Inspect joint','Use the exact manufacturer method; test only within a safe controlled system.']],
 electrical:[['Inspect series path','The educational circuit contains a 6 V battery, switch, 330 Ω resistor and red LED.'],['Close switch','Closing the switch completes the low-voltage circuit.'],['Limit current','Approximate current: (6 − 2) / 330 = 0.012 A.'],['Observe LED','The correctly oriented LED illuminates; the resistor limits current.'],['Open switch','An open switch breaks the path and the LED goes off.']],
 carpentry:[['Mark components','Use one reference face and accurate centre lines.'],['Prepare recesses','Remove roughly half the thickness of each matching piece.'],['Align overlap','Bring members together at their notched intersection.'],['Seat joint','The two shoulders meet and the faces are flush.'],['Inspect fit','Check level, square, gaps and fibre damage.']],
 automotive:[['Intake stroke','Piston down, inlet valve open: air-fuel mixture enters a petrol engine.'],['Compression stroke','Piston up with both valves closed: mixture is compressed.'],['Power stroke','Spark ignites mixture near top; gas pressure drives piston down.'],['Exhaust stroke','Piston up, exhaust valve open: combustion gases leave.']],
 hvac:[['Compressor','The compressor raises refrigerant vapour pressure and temperature.'],['Condenser','Outdoor heat exchanger rejects heat; refrigerant condenses.'],['Expansion device','A pressure drop prepares refrigerant for evaporation.'],['Evaporator','Indoor heat exchanger absorbs room heat; refrigerant evaporates.']],
 solar:[['Sunlight on PV','Photovoltaic cells convert incident light into DC electrical output.'],['Charge control','A controller manages supported battery charging and protection.'],['Energy stored','Battery stores chemical energy for later electrical use.'],['Load supplied','A compatible inverter can supply AC loads from DC energy.']],
 building:[['Foundation','Footings transfer design loads to suitable ground conditions.'],['First course','Bricks are set level on a continuous bed joint.'],['Stagger joints','Alternate courses overlap to avoid continuous vertical joints.'],['Load path','Simplified compressive load flows through masonry to foundation.']],
 beauty:[['Centre parting','Establish the centre line from front to nape.'],['Cross parting','Establish a transverse ear-to-ear reference.'],['Secure quadrants','Four working areas help control hair distribution.'],['Check symmetry','Compare each quadrant before continuing the service.']],
 gardening:[['Source and filter','Water is delivered to a filtered supply line.'],['Main tubing','Flow travels along the irrigation lateral.'],['Emitters','Each emitter releases a controlled amount near roots.'],['Root-zone check','Water spreads through soil according to texture and conditions.']]
};
const len=stages[id].length;
const t=(x,y,text,size=17,fill=theme.ink,anchor='middle')=>`<text x="${x}" y="${y}" text-anchor="${anchor}" fill="${fill}" font-size="${size}" font-family="Inter,Arial,sans-serif" font-weight="600">${esc(text)}</text>`;
const r=(x,y,w,h,fill,rx=10,extra='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" ${extra}/>`;
const line=(x1,y1,x2,y2,color=theme.blue,sw=5,more='')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" ${more}/>`;
const circle=(cx,cy,radius,fill,more='')=>`<circle cx="${cx}" cy="${cy}" r="${radius}" fill="${fill}" ${more}/>`;
const faultTag=(x,y,s)=>`<g>${r(x,y-26,250,43,'#632d38',9)}${t(x+125,y,`⚠ ${s}`,15,'#ffd2cc')}</g>`;
const gradientDefs=`<defs><linearGradient id="tube"><stop stop-color="#7bd8e3"/><stop offset="0.35" stop-color="#357e91"/><stop offset="0.6" stop-color="#d2faff"/><stop offset="1" stop-color="#246071"/></linearGradient><linearGradient id="metal"><stop stop-color="#f5d89d"/><stop offset=".5" stop-color="#ae7958"/><stop offset="1" stop-color="#f7dba6"/></linearGradient><linearGradient id="wood"><stop stop-color="#dba979"/><stop offset=".5" stop-color="#b98355"/><stop offset="1" stop-color="#eec69b"/></linearGradient><marker id="arr" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L9,3 L0,6" fill="none" stroke="#ffc45e" stroke-width="1.7"/></marker><pattern id="earth" width="18" height="12" patternUnits="userSpaceOnUse"><path d="M0 3L13 10 M10 0L18 4" stroke="#5e453d" opacity=".45"/></pattern></defs>`;
function plumbing(){
 let fully=stage>=2&&!fault,oliveX=stage>=3?361:(stage>=1?336:255),seatX=fully?518:468;
 let body=`${t(130,56,'COPPER PIPE',18,theme.blue)}${t(525,56,'COMPRESSION BODY',18,theme.gold)}${t(329,349,'OLIVE',17,theme.gold)}${t(243,349,'NUT',17,theme.gold)}
 ${r(422,146,370,120,'url(#metal)',25)}${r(437,178,360,55,'#173540',5)}${r(498,189,185,30,'#112a33',4)}
 ${r(95,167,seatX-95,75,'url(#tube)',10)}${r(95,188,seatX-95,30,'#12343f',0)}
 ${r(202,155,96,100,'url(#metal)',14)}${r(221,182,110,46,'#173540',5)}
 <path d="M${oliveX} 155 L${oliveX+22} 177 L${oliveX+22} 232 L${oliveX} 255 L${oliveX-12} 240 L${oliveX-12} 170Z" fill="${fault?theme.coral:'#edbd72'}" stroke="#fff4d9" stroke-width="2"/>
 ${line(243,285,243,326,theme.muted,2)}${line(347,275,329,326,theme.muted,2)}
 ${t(710,286,'Fitting body taper',17,theme.ink)}${line(686,267,691,236,theme.gold,2)}
 ${stage===0?t(480,385,'1 · Match manufacturer specification and pipe OD',19):stage===1?t(480,385,'2 · Clean, square tube end and correct fit',19):stage===2?t(480,385,'3 · Tube inserted to fitting stop',19):stage===3?t(480,385,'4 · Olive compressed by the nut',19):t(480,385,'5 · Inspect alignment and planned test',19)}
 ${fault?faultTag(690,88,'Incomplete insertion'):''}`;
 if(stage<2)body+=line(467,300,515,300,theme.gold,3,'marker-end="url(#arr)"');
 return body;
}
function electrical(){
 const on=(stage>=1&&stage<=3&&!fault),lit=on&&stage>=3;
 return `${r(44,70,872,275,'#183442',24)}
 ${r(89,146,155,99,'#243d49',16,'stroke="#56717c" stroke-width="3"')}${t(167,179,'6 V BATTERY',21)}${t(148,219,'+',28,theme.coral)}${t(195,219,'−',28,theme.blue)}
 ${line(244,166,315,166,'#66d6db',6)}${line(314,166,350,166,theme.gold,6)}${line(385,166,495,166,'#66d6db',6)}
 ${r(488,140,162,52,'#735344',10,'stroke="#ffd89d" stroke-width="3"')}${t(569,172,'330 Ω',21,'#ffe5c4')}
 ${line(650,166,743,166,theme.blue,6)}
 ${circle(783,166,39,lit?'#fbd25b':'#46666b','stroke="#d4f4ee" stroke-width="4"')}${t(783,174,'LED',20,lit?'#483917':'#e9eded')}
 ${line(823,166,849,166,theme.blue,6)}${line(849,166,849,275,theme.blue,6)}${line(849,275,190,275,theme.blue,6)}${line(190,275,190,243,theme.blue,6)}
 ${circle(334,166,9,theme.gold)}${circle(384,166,9,theme.gold)}${line(335,166,378,on?166:138,on?theme.gold:theme.coral,4)}
 ${t(368,117,on?'SWITCH CLOSED':'SWITCH OPEN',16,on?theme.green:theme.coral)}
 ${t(480,323,on?'COMPLETE SERIES PATH · ≈ 12 mA':'OPEN PATH · 0 mA',19,on?theme.green:theme.coral)}
 ${on?`<path class="electron-flow" d="M245 166H849V275H190V243" fill="none" stroke="${theme.gold}" stroke-width="5" stroke-dasharray="8 23"/>`:''}
 ${fault?faultTag(640,87,'Open connection'):''}
 ${t(482,380,'Instructional low-voltage model only • approximate diode drop 2 V',16,theme.muted)}`;
}
function carpentry(){
 const merge=stage>=2 && !fault,offset=merge?0:stage>=2?31:64;
 return `${t(230,58,'MEMBER A · LONG GRAIN',18,theme.gold)}${t(718,58,'MEMBER B · MATCHING REBATE',18,theme.gold)}
 ${r(90,162,470,95,'url(#wood)',6,'stroke="#f2d0a5" stroke-width="2"')}
 ${r(290,162,135,48,'#17303d',0)}
 ${r(290+offset,96,135,60,'url(#wood)',5,'stroke="#f1d7b3" stroke-width="3"')}
 ${r(290+offset,155,135,117,'url(#wood)',4)}${r(290+offset,155,135,50,'#15313c',0)}
 ${line(290,139,425,139,theme.blue,2,'stroke-dasharray="6 5"')}${t(353,122,'HALF DEPTH',15,theme.blue)}
 ${merge?`<path d="M305 164L400 164L400 255L305 255Z" fill="#d3a06e" opacity=".9"/>`:''}
 ${fault?faultTag(615,92,'Shallow rebate'):''}
 ${t(478,336,stage>=3?'INSPECT: faces should finish flush':'ALIGN: overlap the two complementary cuts',20,theme.ink)}
 ${t(478,383,'Conceptual profile · dimensions depend on design and wood movement',16,theme.muted)}`;
}
function automotive(){
 const pY=[240,130,250,132][stage];
 const inlet=stage===0||(fault&&stage===1);const exhaust=stage===3;
 const pistonY=pY;
 const stroke=['INTAKE','COMPRESSION','POWER','EXHAUST'][stage];
 return `${t(480,56,'4-STROKE SPARK-IGNITION ENGINE',22,theme.gold)}
 ${r(325,88,310,280,'#234652',22,'stroke="#608292" stroke-width="5"')}${r(355,105,250,220,'#102733',12)}
 ${r(368,pistonY,225,61,'url(#metal)',8,'stroke="#d1e7eb" stroke-width="3"')}${line(480,pistonY+61,480,350,'#d3be9b',10)}
 ${circle(480,351,30,'#ad856a','stroke="#e6d6a8" stroke-width="5"')}
 ${r(381,105,30,inlet?65:22,inlet?theme.green:'#af9279',4)}${r(548,105,30,exhaust?65:22,exhaust?theme.coral:'#af9279',4)}
 ${t(392,89,'IN',17,inlet?theme.green:theme.ink)}${t(564,89,'OUT',17,exhaust?theme.coral:theme.ink)}
 ${line(392,71,392,103,theme.muted,2)}${line(563,71,563,103,theme.muted,2)}
 ${stage===2?`<path d="M468 111L479 85L493 111L481 102Z" fill="${theme.gold}"/>`:''}
 ${t(713,157,stroke,29,stage===2?theme.gold:theme.blue)}
 ${t(753,196,stage%2===0?'PISTON DOWN':'PISTON UP',17,theme.ink)}
 ${t(752,242,`Inlet ${inlet?'OPEN':'CLOSED'}`,16,inlet?theme.green:theme.muted)}
 ${t(752,268,`Exhaust ${exhaust?'OPEN':'CLOSED'}`,16,exhaust?theme.coral:theme.muted)}
 ${fault?faultTag(653,339,'Leaking inlet valve'):''}
 ${t(480,404,'Illustrative piston positions • not timed mechanical CAD',16,theme.muted)}`;
}
function hvac(){
 const labels=[['COMPRESSOR','Hot, high-pressure vapour'],['CONDENSER','Rejects heat outdoors'],['EXPANSION','Pressure drops'],['EVAPORATOR','Absorbs heat indoors']];
 const nodes=[[80,130],[605,130],[605,288],[80,288]];
 let s='';
 nodes.forEach(([x,y],i)=>{s+=r(x,y,280,85,i===stage?'#2a5a59':'#213a45',17,`stroke="${i===stage?theme.gold:'#57727b'}" stroke-width="${i===stage?4:2}"`)+t(x+140,y+34,labels[i][0],20,theme.ink)+t(x+140,y+60,labels[i][1],15,theme.muted)});
 s+=`<path d="M360 173H603M745 215V287M606 331H364M220 287V216" fill="none" stroke="${theme.blue}" stroke-width="10" stroke-linecap="round"/><path class="refrigerant-flow" d="M360 173H745V331H220V173" fill="none" stroke="${theme.gold}" stroke-width="4" stroke-dasharray="12 18"/>
 ${t(480,62,'COOLING MODE · SIMPLIFIED VAPOUR-COMPRESSION LOOP',21,theme.gold)}
 ${t(480,105,'Outdoor unit →',15,theme.muted)}${t(480,405,'Indoor heat absorption ↔ outdoor heat rejection',17,theme.ink)}
 ${fault?faultTag(365,80,'Blocked indoor filter'):''}`;
 return s;
}
function solar(){
 const names=['PV MODULE','CONTROLLER','BATTERY','INVERTER','AC LOAD'];
 const xx=[27,225,422,604,786];const ww=[160,160,153,153,148];
 let s=t(480,55,'EDUCATIONAL OFF-GRID ENERGY PATH',20,theme.gold);
 xx.forEach((x,i)=>{
  const active=(stage===0&&i===0)||(stage===1&&i===1)||(stage===2&&i===2)||(stage===3&&i>=3);
  s+=r(x,145,ww[i],120,active?'#2d5f5f':'#233d4c',15,`stroke="${active?theme.gold:'#6b8992'}" stroke-width="3"`)+
   t(x+ww[i]/2,190,names[i],i===1?16:17)+
   t(x+ww[i]/2,222,['SUN → DC','DC REGULATION','STORED ENERGY','DC → AC','POWER USE'][i],13,theme.muted);
 });
 for(let i=0;i<4;i++)s+=line(xx[i]+ww[i]+5,205,xx[i+1]-16,205,theme.gold,3,'marker-end="url(#arr)"');
 s+=`<g transform="translate(105 118)"><path d="M-16 -20L-28 -39M-16 -20L-1 -32" stroke="${theme.gold}" stroke-width="4"/>${circle(0,-35,10,theme.gold)}</g>`;
 if(fault)s+=`<path d="M40 150H100V260H40Z" fill="#162630" opacity=".8"/>${faultTag(558,317,'Panel partly shaded')}`;
 s+=t(482,344,fault?'Shade lowers available PV output':'Available sunlight → usable electrical energy',21,fault?theme.coral:theme.green);
 s+=t(482,388,'Educational conceptual model · actual wiring and protection vary by product',16,theme.muted);
 return s;
}

function building(){
 let s=t(480,56,'BRICK BOND · COMPRESSIVE LOAD PATH',22,theme.gold)+r(73,320,806,61,'#81635b',6)+r(73,381,806,24,'url(#earth)',4);
 for(let row=0;row<4;row++){
  const y=297-row*61;const stagger=(!fault&&row%2===1)?-54:0;
  for(let i=0;i<7;i++){
   const x=115+i*106+stagger;
   if(x<80 || x>825)continue;
   s+=r(x,y,98,55,row===stage?'#e4b582':'#bb805a',3,'stroke="#f2d8ac" stroke-width="2"');
  }
 }
 for(let i=0;i<5;i++)s+=line(207+i*115,74,207+i*115,136,fault?theme.coral:theme.gold,3,'marker-end="url(#arr)"');
 s+=t(480,430,'Illustrative wall only · never use as structural design',15,theme.muted);
 if(fault)s+=faultTag(593,84,'Continuous joints');
 return s;
}
function beauty(){
 const cx=479,cy=232;
 let s=t(480,55,'MANNEQUIN HEAD · PLAN VIEW',21,theme.gold);
 s+=`<ellipse cx="${cx}" cy="${cy}" rx="178" ry="170" fill="#77563e" stroke="#dcb691" stroke-width="7"/>`;
 for(let i=0;i<22;i++){let a=i/22*Math.PI*2;s+=line(cx+Math.cos(a)*32,cy+Math.sin(a)*32,cx+Math.cos(a)*150,cy+Math.sin(a)*141,'#986f4a',1)}
 if(stage>=0){let drift=fault?55:0;s+=line(cx+drift,70,cx+drift,399,theme.gold,5)}
 if(stage>=1)s+=line(299,cy,659,cy,theme.blue,5);
 if(stage>=2){[[389,169],[567,169],[389,309],[567,309]].forEach(([x,y],i)=>s+=circle(x,y,18,i===stage?theme.gold:'#33464d','stroke="#fff" stroke-width="2"')+t(x,y+6,String(i+1),15,theme.ink));}
 s+=t(208,232,'LEFT',17,theme.muted)+t(750,232,'RIGHT',17,theme.muted)+t(480,427,'Partings are a planning aid and vary by style and service',16,theme.muted);
 if(fault)s+=faultTag(672,98,'Off-centre parting');
 return s;
}
function gardening(){
 let s=t(480,48,'DRIP IRRIGATION · SOIL ROOT ZONE',21,theme.gold);
 s+=r(40,103,160,130,'#31596d',15,'stroke="#80cfe6" stroke-width="4"')+r(49,150,142,75,'#2b94b0',9)+t(120,129,'WATER',19)+t(120,253,'SUPPLY TANK',14,theme.muted);
 s+=r(243,149,112,67,'#31645f',9)+t(299,190,'FILTER',18)+line(201,187,244,187,theme.blue,11)+line(356,187,857,187,theme.blue,11);
 s+=r(45,297,870,100,'#685044',10)+r(45,297,870,100,'url(#earth)',10);
 for(let i=0;i<3;i++){
  const x=445+i*185;const blocked=fault&&i===1;
  s+=`<path d="M${x} 177v-45" stroke="#42865e" stroke-width="9"/>`;
  s+=`<path d="M${x} 138q-58 -35 -63 -6q32 35 63 13q35 -36 62 -7q-22 38 -62 12" fill="#54a96f"/>`;
  s+=line(x,187,x,223,blocked?theme.coral:theme.blue,5);
  if(stage>=2&&!blocked){for(let j=0;j<3;j++)s+=circle(x+(j-1)*7,240+j*20,5,theme.blue)}
  s+=`<path d="M${x} 300q-30 42 -52 73M${x} 302q10 47 31 72M${x} 305v68" stroke="#dcb58b" stroke-width="3" fill="none"/>`;
  if(stage>=3&&!blocked)s+=`<ellipse cx="${x}" cy="333" rx="59" ry="45" fill="#3b9bbb" opacity=".25"/>`;
  if(blocked)s+=`<path d="M${x-9} 204l18 18M${x+9} 204l-18 18" stroke="${theme.coral}" stroke-width="6"/>`;
 }
 if(fault)s+=faultTag(585,76,'Emitter blocked');
 s+=t(480,424,'Wetting patterns depend on soil type, flow, time and slope',16,theme.muted);
 return s;
}
const views={plumbing,electrical,carpentry,automotive,hvac,solar,building,beauty,gardening};
function stop(){if(timer){clearInterval(timer);timer=null}$('#play').textContent='▶ Auto-play';$('#play').setAttribute('aria-pressed','false')}
function draw(){const [name,desc]=stages[id][stage];$('#stepCount').textContent=`STAGE ${String(stage+1).padStart(2,'0')} / ${String(len).padStart(2,'0')}`;$('#stageName').textContent=name;$('#stageDesc').textContent=desc;
 $('#viewport').innerHTML=`<svg role="img" aria-label="${esc(d.title)}. ${esc(name)}. ${fault?esc(d.fault):esc(desc)}" viewBox="0 0 960 450" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">${gradientDefs}${r(0,0,960,450,theme.bg,0)}<path d="M0 80H960 M0 225H960 M0 370H960" fill="none" stroke="#213845" stroke-width="1" stroke-dasharray="5 11"/>${views[id]()}</svg>`;
 $('#faultReason').textContent=fault?d.fault:'Select “Inject a fault” to inspect an incorrect operating state.';$('#fault').setAttribute('aria-pressed',String(fault));$('#fault').textContent=fault?'✓ Fault active — reset':'⚠ Inject a fault';
}
function setupVideo(){const v=$('#expertVideo');const link=`<a class="outlink" href="${esc(d.url)}" target="_blank" rel="noopener noreferrer">Open original publisher’s demonstration ↗</a>`;
 const base=`<div class="source-head"><strong>${esc(d.videoTitle)}</strong><span>${esc(d.author)}</span></div><p class="muted small">${esc(d.time)} · Real recorded expertise from a third-party publisher. Study it alongside the original animated cutaway above; these may cover different tasks within the same trade.</p>`;
 if(d.yt){v.innerHTML=base+`<div class="video-trigger" id="videoTrigger"><div class="videographic">▶</div><p>Load the original YouTube player</p><button type="button" id="loadVideo">Watch instructor footage</button></div>`+link;
 $('#loadVideo').addEventListener('click',()=>{$('#videoTrigger').outerHTML=`<div class="embed"><iframe title="${esc(d.videoTitle)}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen referrerpolicy="strict-origin-when-cross-origin" src="https://www.youtube-nocookie.com/embed/${d.yt}?rel=0"></iframe></div>`});
 }else{v.innerHTML=base+`<div class="video-resource"><strong>Expert demonstration library</strong><p>The publisher hosts real video(s) on this page. Open the original source to watch. No copied footage is included.</p>${link}</div>`;}
}
function setup(){document.title=`${d.title} · BSOE equipment lab`;
 $('#clip').src='assets/videos/'+id+'.mp4';$('#clip').poster='assets/frames/'+id+'/0.png';$('#clipDownload').href='assets/videos/'+id+'.mp4';$('#clipDownload').download='BSOE_'+id+'_equipment_animation.mp4';
 $('#labTitle').textContent=d.title;$('#labIntro').textContent=d.subtitle;$('#backCourse').href='course.html?course='+encodeURIComponent(id);
 $('#procedure').innerHTML=d.steps.map(s=>`<li>${esc(s)}</li>`).join('');$('#safety').textContent=d.safety;$('#question').textContent=d.prompt;
 const options=[0,1,2];const shift=id.charCodeAt(0)%3;options.push(...options.splice(0,shift));
 $('#choices').innerHTML=options.map(i=>`<label class="answer"><input type="radio" name="q" value="${i}"/> ${esc(d.choices[i])}</label>`).join('');
 $('#prev').onclick=()=>{stop();stage=(stage+len-1)%len;draw()};$('#next').onclick=()=>{stop();stage=(stage+1)%len;draw()};
 $('#fault').onclick=()=>{fault=!fault;draw()};$('#play').onclick=()=>{if(timer){stop();return}$('#play').textContent='Ⅱ Pause sequence';$('#play').setAttribute('aria-pressed','true');timer=setInterval(()=>{stage=(stage+1)%len;draw()},1700)};
 $('#grade').onclick=()=>{const q=$('input[name=q]:checked');$('#feedback').textContent=q?(Number(q.value)===0?'✓ Correct. '+d.check:'Not quite. Compare the component labels with the correct sequence, then try again.'):'Choose one answer first.';$('#feedback').className=q&&q.value==='0'?'correct':'incorrect'};
 const key='BSOE_MEDIA_NOTE_'+id;
 try{$('#evidence').value=localStorage.getItem(key)||''}catch(e){}
 $('#save').onclick=()=>{try{localStorage.setItem(key,$('#evidence').value);$('#savedStatus').textContent='Saved locally on this browser.'}catch(e){$('#savedStatus').textContent='Local storage unavailable. Export the note instead.'}};
 $('#download').onclick=()=>{const text=`BSOE · ${d.category}\n${d.title}\nEvidence workbook note · media pilot\nThis is formative learning evidence, not practical competence certification.\n\nLearner observations:\n${$('#evidence').value}\n\nSafety boundary:\n${d.safety}\n\nFault case:\n${d.fault}\n`;const a=document.createElement('a');const url=URL.createObjectURL(new Blob([text],{type:'text/plain'}));a.href=url;a.download='BSOE_'+id+'_equipment_lab_notes.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1200)};
 setupVideo();draw();
 const shotTitles=['Establish the outcome','Verify safe setup','Identify parts','Perform the correct process','Show a controlled fault example','Inspect and document'];
 const shotNotes=[`Introduce the ${d.title.toLowerCase()} and show the finished learning objective on camera.`,d.safety,`Show clear macro close-ups of the components. Add real product part names and ratings, not generic placeholders.`,d.steps.join(' · '),`Use a safely prepared demonstration specimen. Discuss the suspected fault and show the relevant physical evidence. ${d.fault}`,`Record tools, measurement data, quality checks and a dated job sheet. The trade assessor signs off filmed accuracy.`];
 $('#shots').innerHTML=shotTitles.map((t,i)=>`<article><span>SHOT ${String(i+1).padStart(2,'0')}</span><h3>${esc(t)}</h3><p>${esc(shotNotes[i])}</p></article>`).join('');
}
setup();
})();
