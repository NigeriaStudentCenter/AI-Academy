(function(){
  function addMediaLink(){
    const root=document.getElementById('content');if(!root||typeof COURSE_ID==='undefined')return;
    const topic=String((course.modules||[])[moduleIndex]?.[0]||'');
    const wrapper=document.createElement('section');wrapper.className='tech-block media-link-card';
    wrapper.innerHTML='<div class="micro">NEW · EQUIPMENT-LEVEL MEDIA</div><h3>Interactive equipment lab + real expert footage</h3><p>Study an original technical cutaway with moving components and diagnostic faults. Then watch a linked demonstration filmed by a real instructor or technical expert. Third-party demonstrations are identified by publisher; BSOE footage must still be independently filmed and reviewed.</p><a class="btn primary" href="media.html?course='+encodeURIComponent(COURSE_ID)+'">Open '+COURSE_ID+' media lab →</a>';
    const visual=root.querySelector('#diagramArea')?.closest('.block');
    if(visual)visual.insertAdjacentElement('beforebegin',wrapper);else root.prepend(wrapper);
  }
  const prior=window.renderModule;
  if(typeof prior==='function') window.renderModule=function(){prior();addMediaLink()};
  const oldCatalogue=window.catalogue;
  if(typeof oldCatalogue==='function')window.catalogue=function(){oldCatalogue();const el=document.getElementById('catalogue');if(el){el.querySelectorAll('a.coursecard').forEach(a=>{const match=a.href.match(/[?&]course=([^&]+)/);if(match){const id=decodeURIComponent(match[1]);const link=document.createElement('a');link.href='media.html?course='+encodeURIComponent(id);link.className='coursecard';link.innerHTML='<strong>⚙ '+id.charAt(0).toUpperCase()+id.slice(1)+' · equipment lab</strong><span>Interactive cutaway and sourced expert footage</span>';a.after(link)}})}};
})();