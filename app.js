function buildEnquiryMessage(data){
  const name=String(data.get('name')||'').trim(),service=String(data.get('service')||'').trim(),message=String(data.get('message')||'').trim(),time=String(data.get('time')||'').trim();
  return ['Hello SB Fusion, I would like to enquire.','Name: '+name,'Service / subject: '+service,'Message: '+message,...(time?['Preferred contact / visit time: '+time]:[])].join('\n');
}
function initializePage(){
  const menu=document.querySelector('.menu'),nav=document.querySelector('#nav');
  menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');nav.classList.toggle('is-open',open)});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){nav?.classList.remove('is-open');menu?.setAttribute('aria-expanded','false');menu?.setAttribute('aria-label','Open navigation')}});
  const reduced=matchMedia('(prefers-reduced-motion: reduce)'),video=document.querySelector('.hero video'),toggle=document.querySelector('#video-toggle');
  function updateMotion(){if(!video)return;if(reduced.matches){video.pause();video.removeAttribute('autoplay');if(toggle)toggle.hidden=true}else{video.play().catch(()=>{});if(toggle)toggle.hidden=false}}
  updateMotion();reduced.addEventListener?.('change',updateMotion);
  toggle?.addEventListener('click',()=>{if(video.paused){video.play().catch(()=>{});toggle.innerHTML='Ⅱ <span>Pause film</span>';toggle.setAttribute('aria-label','Pause background video')}else{video.pause();toggle.innerHTML='▷ <span>Play film</span>';toggle.setAttribute('aria-label','Play background video')}});
  document.querySelectorAll('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===btn)));let count=0;document.querySelectorAll('.gallery-grid .gallery-item').forEach(f=>{f.hidden=btn.dataset.filter!=='all'&&f.dataset.category!==btn.dataset.filter;if(!f.hidden)count++});const live=document.querySelector('.gallery-count');if(live)live.textContent=count+' photographs'}));
  const enquiry=document.querySelector('#enquiry-form');
  enquiry?.addEventListener('submit',e=>{
    e.preventDefault();
    ['name','message'].forEach(key=>{const field=enquiry.elements.namedItem(key);field.setCustomValidity(field.value.trim()?'':'Please enter '+(key==='name'?'your name':'a message')+'.')});
    if(!enquiry.reportValidity())return;
    const data=new FormData(enquiry),message=buildEnquiryMessage(data);
    const url='https://wa.me/916289578732?text='+encodeURIComponent(message);
    const link=document.querySelector('#enquiry-link');link.href=url;
    document.querySelector('#enquiry-status').hidden=false;
    window.open(url,'_blank','noopener,noreferrer');
  });
  enquiry?.addEventListener('input',e=>{if(typeof e.target.setCustomValidity==='function')e.target.setCustomValidity('')});
  const dialog=document.querySelector('#lightbox');let active=[],index=0,lastPhoto;
  function show(){const p=active[index];dialog.querySelector('img').src=p.dataset.src;dialog.querySelector('img').alt=p.dataset.caption;dialog.querySelector('figcaption').textContent=p.dataset.caption+' · '+(index+1)+' / '+active.length}
  function close(){dialog.close();lastPhoto?.focus()}
  document.querySelectorAll('.photo').forEach(p=>p.addEventListener('click',()=>{active=[...document.querySelectorAll('.photo')].filter(b=>!b.closest('figure').hidden);index=active.indexOf(p);lastPhoto=p;show();dialog.showModal()}));
  dialog?.querySelector('.close').addEventListener('click',close);
  dialog?.querySelector('.photo-prev').addEventListener('click',()=>{index=(index-1+active.length)%active.length;show()});
  dialog?.querySelector('.photo-next').addEventListener('click',()=>{index=(index+1)%active.length;show()});
  dialog?.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();index=(index+(e.key==='ArrowRight'?1:-1)+active.length)%active.length;show()}});
  dialog?.addEventListener('click',e=>{if(e.target===dialog)close()});
  // Content is visible by default. Reveal only when observation is supported.
  if('IntersectionObserver' in window&&!reduced.matches){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.remove('will-reveal');observer.unobserve(e.target)}}),{threshold:.06});document.querySelectorAll('.section-heading,.story,.service-card,.composition,.values>div').forEach(el=>{el.classList.add('reveal');if(el.getBoundingClientRect().top>innerHeight){el.classList.add('will-reveal');observer.observe(el)}});setTimeout(()=>document.querySelectorAll('.will-reveal').forEach(el=>el.classList.remove('will-reveal')),7000)}
}
initializePage();
