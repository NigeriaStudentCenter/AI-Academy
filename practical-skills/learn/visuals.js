
const shapes={
 plumbing:{labels:['Supply','Valve','Fixture','Drain'],paths:['M80 110 H225','M250 110 H395','M420 110 H565'],symbols:['🚰','🔧','🚿','💧']},
 electrical:{labels:['Battery','Switch','Resistor','LED'],paths:['M80 110 H225','M250 110 H395','M420 110 H565'],symbols:['🔋','⏻','Ω','💡']},
 carpentry:{labels:['Measure','Mark','Cut','Join'],paths:['M80 110 H225','M250 110 H395','M420 110 H565'],symbols:['📏','✏️','🪚','🪵']},
 automotive:{labels:['Intake','Compress','Power','Exhaust'],paths:['M80 110 H225','M250 110 H395','M420 110 H565'],symbols:['↓','↑','⚙️','↑']},
 hvac:{labels:['Evaporator','Compressor','Condenser','Expansion'],paths:['M80 110 H225','M250 110 H395','M420 110 H565'],symbols:['❄️','↗','☀️','↘']},
 solar:{labels:['PV Panel','Controller','Battery','Inverter'],paths:['M80 110 H225','M250 110 H395','M420 110 H565'],symbols:['☀️','⊞','🔋','∿']},
 building:{labels:['Roof','Wall','Footing','Ground'],paths:['M80 110 H225','M250 110 H395','M420 110 H565'],symbols:['⌂','▤','▰','▥']},
 beauty:{labels:['Consult','Prepare','Section','Review'],paths:['M80 110 H225','M250 110 H395','M420 110 H565'],symbols:['☷','✂️','┼','✓']},
 gardening:{labels:['Seed','Root','Seedling','Plant'],paths:['M80 110 H225','M250 110 H395','M420 110 H565'],symbols:['•','↡','🌱','🌿']}
};
function diagram(key,step=0){const c=shapes[key];const nodes=c.labels.map((s,i)=>{const x=80+i*170;const selected=step===i;return `<g><circle cx="${x}" cy="110" r="44" fill="${selected?'#17856d':'#ffffff'}" stroke="#62aca0" stroke-width="3"/><text x="${x}" y="122" text-anchor="middle" font-size="29" fill="${selected?'white':'#23433a'}">${c.symbols[i]}</text><text x="${x}" y="181" text-anchor="middle" font-size="16" font-weight="700" fill="#194d40">${s}</text></g>`}).join('');const paths=c.paths.map(p=>`<path class="pathline" d="${p}" fill="none" stroke="#32a080" stroke-width="5"/>`).join('');return `<svg viewBox="0 0 690 220" role="img" aria-label="Animated concept sequence for ${key}"><title>${key} concept sequence</title>${paths}${nodes}</svg>`}
