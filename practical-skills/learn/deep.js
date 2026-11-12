/* BSOE Release 2 technical layer. All lesson data is local; no client telemetry. */
(function(){
  const originalRender = window.renderModule;
  const originalReview = window.markReviewed;
  const courseOrder=['plumbing','electrical','carpentry','automotive','hvac','solar','building','beauty','gardening'];
  function perm(i){return [[1,2,0],[2,0,1],[0,1,2]][(i+courseOrder.indexOf(COURSE_ID)+3)%3]}
  function shuffled(m, offset){return perm(moduleIndex+offset).map((i)=>({text:m.choices[i],source:i}))}
  function listItems(vals){return vals.map(x=>'<li>'+safe(x)+'</li>').join('')}
  function calculatorMarkup(){
    const calcModule={plumbing:3,electrical:1,carpentry:1,automotive:3,hvac:2,solar:2,building:1,beauty:3,gardening:2};
    if(moduleIndex!==calcModule[COURSE_ID])return '';
    const calc={
      plumbing:{title:'Drainage geometry practice',labels:['Fall (mm)','Horizontal run (mm)'],values:[36,1800],unit:['mm','mm'],explain:'fall ÷ run; shown as fall 1 in N. This does not specify a compliant gradient.'},
      electrical:{title:'Ideal DC Ohm’s-law simulation',labels:['Voltage (V)','Resistance (Ω)'],values:[6,300],unit:['V','Ω'],explain:'Ideal ohmic calculation only. Never connect to mains or use an unknown battery.'},
      carpentry:{title:'Material cut-length estimator',labels:['Piece length (mm)','Number of pieces','Kerf per cut (mm)'],values:[420,4,2.5],unit:['mm','pieces','mm'],explain:'Approximation assumes number of cuts = pieces − 1, and excludes trimming or defects.'},
      automotive:{title:'Speed and distance reasoning',labels:['Vehicle speed (km/h)','Seconds elapsed (s)'],values:[72,1],unit:['km/h','s'],explain:'Distance is from constant speed only, not a stopping-distance estimate.'},
      hvac:{title:'Electrical energy-use calculator',labels:['Electrical input (kW)','Running time (hours)'],values:[1.2,5],unit:['kW','h'],explain:'This is electrical consumption, NOT cooling capacity or refrigerant diagnosis.'},
      solar:{title:'Daily electrical load calculator',labels:['Load 1 (W × hours)','Load 2 (W × hours)','Load 3 (W × hours)'],values:[100,180,240],unit:['Wh','Wh','Wh'],explain:'Enter calculated Wh for three loads. Not enough data to design or wire a real PV system.'},
      building:{title:'Plan area and scale calculator',labels:['Length (m)','Width (m)','Drawing scale denominator'],values:[3,4,50],unit:['m','m','1:N'],explain:'Geometric scale only: structural design and building compliance are separate.'},
      beauty:{title:'Mannequin section planner',labels:['Quadrants','Subsections per quadrant'],values:[4,3],unit:['groups','per group'],explain:'A section count is a planning aid, not a universal technique for every hair type.'},
      gardening:{title:'Seed germination estimator',labels:['Seeds emerged','Seeds sown'],values:[15,20],unit:['seeds','seeds'],explain:'A sample observation only; record the date, species and conditions.'}
    }[COURSE_ID];
    const fields=calc.labels.map((label,i)=>`<div class="calc-field"><label for="techcalc${i}">${safe(label)}</label><input type="number" id="techcalc${i}" step="any" min="0" value="${calc.values[i]}" oninput="deepCalculate()" aria-label="${safe(label)}"></div>`).join('');
    return `<section class="calc-card block" aria-label="Interactive maths lab"><div class="micro" style="color:#b8e1cd">Interactive calculation lab</div><h3>${safe(calc.title)}</h3><div class="calc-form">${fields}</div><div class="calc-result" id="calcResult" aria-live="polite"></div><p class="small" style="color:#d4e9df">${safe(calc.explain)}</p><button class="btn" onclick="saveCalcResult()">Save result into evidence log</button></section>`;
  }
  window.deepCalculate=function(){
    const v=[0,1,2].map(i=>{const e=document.getElementById('techcalc'+i);return e?Number(e.value):null});let res='',valid=v.every(x=>x===null||(Number.isFinite(x)&&x>=0));
    const f=x=>Number(x.toFixed(3)).toLocaleString('en-GB');
    if(!valid)res='Use valid non-negative numeric inputs.';
    else switch(COURSE_ID){
      case 'plumbing': res=v[1]>0&&v[0]>0?`Fall/run = ${f(v[0]/v[1])} or approximately 1:${f(v[1]/v[0])}.`:'Enter a positive fall and run.';break;
      case 'electrical':res=v[1]>0?`I = V/R = ${f(v[0]/v[1])} A (${f(v[0]/v[1]*1000)} mA). P = V × I = ${f(v[0]*v[0]/v[1])} W.`:'Resistance must be greater than zero.';break;
      case 'carpentry':res=v[1]>0&&Number.isInteger(v[1])?`Nominal material length = ${f(v[0]*v[1]+Math.max(0,v[1]-1)*v[2])} mm, before trimming and defects.`:'Number of pieces must be a positive whole number.';break;
      case 'automotive':res=`Speed = ${f(v[0]/3.6)} m/s. Distance at constant speed for ${f(v[1])} s ≈ ${f(v[0]/3.6*v[1])} m (not stopping distance).`;break;
      case 'hvac':res=`Energy = ${f(v[0])} kW × ${f(v[1])} h = ${f(v[0]*v[1])} kWh.`;break;
      case 'solar':res=`Daily energy total = ${f(v[0])} + ${f(v[1])} + ${f(v[2])} = ${f(v[0]+v[1]+v[2])} Wh/day (${f((v[0]+v[1]+v[2])/1000)} kWh/day) before losses.`;break;
      case 'building':res=v[2]>0?`Plan area = ${f(v[0]*v[1])} m²; at 1:${f(v[2])}, drawing dimensions ≈ ${f(v[0]*1000/v[2])} × ${f(v[1]*1000/v[2])} mm.`:'Drawing scale must be positive.';break;
      case 'beauty':res=Number.isInteger(v[0])&&Number.isInteger(v[1])?`Total planned subsections = ${f(v[0]*v[1])}.`:'Use whole numbers of quadrants and subsections.';break;
      case 'gardening':res=v[1]>0&&v[0]<=v[1]?`Observed germination rate = ${f(100*v[0]/v[1])}% (${f(v[0])} of ${f(v[1])} seeds).`:'Seeds sown must be positive and at least seeds emerged.';break;
    }
    const el=document.getElementById('calcResult');if(el)el.textContent=res;return res;
  }
  window.saveCalcResult=function(){const calc=deepCalculate();const saved=get('deepNotes')||{};const row=saved[moduleIndex]||{};row.calc=calc;saved[moduleIndex]=row;put('deepNotes',saved);document.getElementById('calcSaved').textContent='Calculation saved into your workbook for this module.';};
  function markup(){const t=BSOE_DEEP.lessons[COURSE_ID][moduleIndex];const saved=(get('deepNotes')||{})[moduleIndex]||{};
    const checks=(get('rubric')||{})[moduleIndex]||[];
    const caseChoices=shuffled(t,1).map(x=>`<label class="case-choice"><input type="radio" name="deepCase" value="${x.source}"> ${safe(x.text)}</label>`).join('');
    const refs=BSOE_DEEP.references[COURSE_ID].map(x=>`<a target="_blank" rel="noopener noreferrer" href="${safe(x[1])}">${safe(x[0])} ↗</a>`).join('');
    const procedural=t.steps.map((x,i)=>`<div class="practice-step"><span class="step-count">${i+1}</span><span>${safe(x)}</span></div>`).join('');
    const rubric=t.rubric.map((x,i)=>`<label><input type="checkbox" data-rubric="${i}" ${checks.includes(i)?'checked':''} onchange="saveRubric()"><span>${safe(x)}</span></label>`).join('');
    const storyboard=[
      ['0–15 sec','Identify the authentic equipment or accurate training model, and explain the learning goal.'],
      ['15–45 sec',t.steps[0]],
      ['45–75 sec',t.steps[1]],
      ['75–105 sec',t.steps[2]],
      ['105–125 sec','Pause on the common fault: '+t.case],
      ['125–145 sec','Show inspection evidence and recap the safe boundary for this trade.']
    ].map(x=>`<div class="shot"><time>${safe(x[0])}</time><span>${safe(x[1])}</span></div>`).join('');
    const main=`<section class="tech-block" id="deepLearning"><div class="deep-meta"><span class="deep-chip">Deep technical lesson</span><span class="deep-chip">Apply · Diagnose · Verify</span><span class="deep-chip">Original BSOE content</span></div>
      <h3>Why the system works</h3><p class="lead">${safe(t.principle)}</p><h4>Professional judgement</h4><p>${safe(t.judgement)}</p>
      <div class="callout"><strong>Worked technical example</strong><p>${safe(t.example)}</p></div><h4>Guided practical studio</h4><p class="small muted">Follow this safe study sequence. Restricted work is simulated, designed on paper or completed only with a competent supervisor.</p>${procedural}</section>`;
    const instructor=`<section class="tech-block"><div class="micro">Production storyboard · footage not yet filmed</div><h3>Close-up instructor demonstration plan</h3><p>Suggested 2–3 minute verified instructor clip for this specific lesson. Record with an appropriately competent trade demonstrator, high-quality audio, close-up camera, safety callouts and captions.</p><div class="story-rows">${storyboard}</div><p class="small muted">Before publishing, a qualified reviewer must check actual footage, manufacturer-specific procedures and local safety requirements. This storyboard is not itself a video.</p></section>`;
    const caseStudy=`<section class="tech-block" id="deepCaseSection"><div class="micro">Application assessment · case-based</div><h3>Can you diagnose the situation?</h3><p><strong>${safe(t.case)}</strong></p><div class="case-options">${caseChoices}</div><div class="row no-print"><button class="btn primary" onclick="checkDeepCase()">Check professional reasoning</button><button class="btn" onclick="document.querySelectorAll('input[name=deepCase]').forEach(x=>x.checked=false);document.getElementById('deepCaseStatus').textContent=''">Try again</button></div><p id="deepCaseStatus" aria-live="polite"></p></section>`;
    const portfolio=`<section class="tech-block" id="deepWorkbook"><div class="micro">Evidence portfolio</div><h3>Technical workbook and practical evidence</h3><p>Produce the following evidence, or describe exactly how it would be collected under supervision:</p><ul>${listItems(t.evidence)}</ul><h4>Engineering / salon / garden decision log</h4><p class="small muted">Record your reasoning, the checks you used and why alternatives were rejected. This record is saved locally on your device.</p>
      <textarea id="deepNote" placeholder="Explain your observed evidence, safe method, calculations and alternative causes..." oninput="saveDeepNote()">${safe(saved.note||'')}</textarea>
      <h4>Self-check against assessment criteria</h4><div class="study-checklist">${rubric}</div><p class="small muted" id="calcSaved">${saved.calc?'Saved calculation: '+safe(saved.calc):'You can add the calculator result to this module’s evidence log.'}</p><div class="row no-print"><button class="btn primary" onclick="saveDeepNote()">Save evidence log</button><button class="btn" onclick="exportDeepWorkbook()">Download detailed workbook (.html)</button><button class="btn" onclick="printCurrentLesson()">Print current lesson</button></div><p class="small muted">Checkboxes are self-reported, not independent practical assessment. A BSOE certificate must not be issued based on this alone.</p></section>`;
    const source=`<section class="tech-block"><div class="micro">Reference library</div><h3>Read beyond the lesson</h3><p>These independent public sources informed subject selection and safety boundaries. Always verify local standards and manufacturer guidance. BSOE lessons are not official Pearson learning materials.</p><div class="source-list">${refs}</div></section>`;
    return {main,instructor,caseStudy,portfolio,source};
  }
  function shuffleBaseQuiz(){const p=perm(moduleIndex), container=document.getElementById('options');if(!container)return;const nodes=Array.from(container.children);p.forEach(i=>container.appendChild(nodes[i]));}
  window.renderModule=function(){
    originalRender();
    const m=markup(),root=document.getElementById('content');
    const concept=root.querySelector(':scope > .block');if(concept)concept.insertAdjacentHTML('afterend',m.main);
    const visual=root.querySelector('#diagramArea')?.closest('.block');if(visual)visual.insertAdjacentHTML('afterend',calculatorMarkup());
    const videoSection=root.querySelector('.cols.block');if(videoSection)videoSection.insertAdjacentHTML('afterend',m.instructor);
    const quizBlock=root.querySelector('#quizStatus')?.closest('.block');if(quizBlock)quizBlock.insertAdjacentHTML('afterend',m.caseStudy);
    const workbook=root.querySelector('#response')?.closest('.block');if(workbook)workbook.insertAdjacentHTML('afterend',m.portfolio);
    const tutor=root.querySelector('#tutorReply')?.closest('.block');if(tutor)tutor.insertAdjacentHTML('afterend',m.source);
    shuffleBaseQuiz();if(document.getElementById('calcResult'))deepCalculate();
    const q=(get('caseQuiz')||{})[moduleIndex];if(q){const status=document.getElementById('deepCaseStatus');status.textContent=q.correct?'✓ Case assessment previously passed':'Try the case assessment again';status.className=q.correct?'good':'bad'}
  };
  window.checkDeepCase=function(){const chosen=document.querySelector('input[name=deepCase]:checked');const el=document.getElementById('deepCaseStatus');if(!chosen){el.textContent='Select an answer first.';return}const t=BSOE_DEEP.lessons[COURSE_ID][moduleIndex],correct=+chosen.value===t.correct;const state=get('caseQuiz')||{};state[moduleIndex]={correct,attempted:true};put('caseQuiz',state);el.className=correct?'good':'bad';el.textContent=(correct?'✓ Correct — ':'Reconsider — ')+t.rationale;};
  window.saveDeepNote=function(){const val=document.getElementById('deepNote');if(!val)return;const notes=get('deepNotes')||{};notes[moduleIndex]=Object.assign({},notes[moduleIndex]||{},{note:val.value});put('deepNotes',notes);};
  window.saveRubric=function(){const state=get('rubric')||{};state[moduleIndex]=Array.from(document.querySelectorAll('[data-rubric]:checked')).map(el=>Number(el.dataset.rubric));put('rubric',state);};
  window.markReviewed=function(){saveText();saveDeepNote();saveRubric();const q=(get('quiz')||{})[moduleIndex],c=(get('caseQuiz')||{})[moduleIndex],n=(get('deepNotes')||{})[moduleIndex]||{},w=(get('workbook')||{})[moduleIndex]||{},rubric=(get('rubric')||{})[moduleIndex]||[];const t=BSOE_DEEP.lessons[COURSE_ID][moduleIndex];
    const failed=[];if(!q?.correct)failed.push('pass the knowledge question');if(!c?.correct)failed.push('pass the diagnostic case');if((w.response||'').trim().length<50)failed.push('write at least 50 characters for workbook Task A');if((w.reflection||'').trim().length<50)failed.push('write at least 50 characters for workbook Task B');if((n.note||'').trim().length<70)failed.push('write at least 70 characters of technical evidence');if(rubric.length<t.rubric.length)failed.push('self-check every assessment criterion');
    if(failed.length){const el=document.getElementById('saved');el.textContent='To mark reviewed: '+failed.join('; ')+'.';el.className='small bad';el.scrollIntoView({block:'center',behavior:'smooth'});return}
    originalReview();document.getElementById('saved').textContent='Module reviewed after workbook and assessment checks. Not a verified practical competency.';
  };
  window.exportDeepWorkbook=function(){saveText();saveDeepNote();saveRubric();const q=get('quiz')||{},c=get('caseQuiz')||{},w=get('workbook')||{},notes=get('deepNotes')||{},rubric=get('rubric')||{};let content=`<!doctype html><html><head><meta charset="utf-8"><title>BSOE ${safe(course.title)} - Evidence Workbook</title><style>body{font:16px/1.55 Arial,sans-serif;max-width:850px;margin:30px auto;color:#183c32;padding:15px}h1{border-bottom:3px solid #b99436}section{margin:30px 0;border-top:1px solid #ddd;padding:12px}pre{white-space:pre-wrap;overflow-wrap:anywhere;background:#f5f7f5;padding:12px;border-radius:8px}.note{border:1px solid #bb9962;padding:12px}</style></head><body><h1>BSOE · ${safe(course.title)}</h1><p class="note">Personal study evidence export, NOT an official Pearson award, BSOE-issued certificate or independently verified demonstration of practical competence. Saved from this browser only.</p>`;
    course.modules.forEach((m,i)=>{const d=BSOE_DEEP.lessons[COURSE_ID][i],n=notes[i]||{},x=w[i]||{},pass=Boolean(q[i]?.correct),casePass=Boolean(c[i]?.correct);content+=`<section><h2>Module ${i+1}: ${safe(m[0])}</h2><p><b>Outcome:</b> ${safe(m[1])}</p><p><b>Worked example:</b> ${safe(d.example)}</p><p><b>Practical steps:</b></p><ol>${listItems(d.steps)}</ol><p><b>Knowledge check:</b> ${pass?'passed':'not passed'}; <b>case:</b> ${casePass?'passed':'not passed'}</p><p><b>Task A:</b></p><pre>${safe(x.response||'Not entered')}</pre><p><b>Task B:</b></p><pre>${safe(x.reflection||'Not entered')}</pre><p><b>Technical evidence:</b></p><pre>${safe(n.note||'Not entered')}</pre><p><b>Calculation:</b> ${safe(n.calc||'Not saved')}</p><p><b>Self-checked:</b> ${(rubric[i]||[]).length}/${d.rubric.length} criteria</p></section>`});content+='</body></html>';
    const a=document.createElement('a');const blob=new Blob([content],{type:'text/html;charset=utf-8'});a.href=URL.createObjectURL(blob);a.download='BSOE_'+COURSE_ID+'_technical_workbook.html';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),3000);
  };
  window.printCurrentLesson=function(){saveText();saveDeepNote();window.print()};
  // Specific offline teaching responses: not a substitute for an Azure generative tutor.
  window.tutorTip=function(mode){const t=BSOE_DEEP.lessons[COURSE_ID][moduleIndex];const m=course.modules[moduleIndex];let msg='';if(mode==='explain')msg='Core principle: '+t.principle+' Think like a technician: '+t.judgement;else if(mode==='practice')msg='Case to solve: '+t.case+' First state the evidence. Then give a safe hypothesis and a way to check it. Finally compare with the case assessment.';else msg='Safety boundary: '+course.hazard+' For this module, stop when the task requires access to unknown energy sources, controlled materials or trade qualifications. The safe learning activity is: '+t.steps[0];document.getElementById('tutorReply').textContent=msg;};
  // Existing askTutor() remains unchanged: it uses an optional, administrator-configured backend.
})();
