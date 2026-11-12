'use strict';
// Loads a course for a signed-in, paid learner. No lesson content exists in this site: it is fetched from the API
// per course after the server has checked the learner's payment.
(function () {
 const C = window.COURSE_CONFIG, KEY = 'bsoe_ps_token';
 const id = new URLSearchParams(location.search).get('course') || '';
 const body = document.body, scripts = JSON.parse(body.dataset.scripts || '[]'), page = body.dataset.page;
 const here = location.pathname.split('/').pop() + location.search;
 const say = (html) => { let el = document.getElementById('gate'); if (!el) { el = document.createElement('div'); el.id = 'gate'; el.style.cssText = 'max-width:640px;margin:40px auto;padding:20px;border:1px solid #cdd;border-radius:10px;font:16px/1.5 Arial,sans-serif'; (document.querySelector('main') || body).prepend(el); } el.innerHTML = html; };
 const load = src => new Promise((ok, no) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = () => no(Error('load ' + src)); document.body.appendChild(s); });
 (async function () {
  const token = localStorage.getItem(KEY);
  if (!token || !/^[a-z]+$/.test(id)) { location.replace('index.html?next=' + encodeURIComponent(here)); return; }
  say('Loading your course…');
  let r;
  try { r = await fetch(C.api + '/content/' + encodeURIComponent(id), {headers: {Authorization: 'Bearer ' + token}}); }
  catch { say('We could not reach the course server. Check your connection and refresh.'); return; }
  if (r.status === 401) { localStorage.removeItem(KEY); location.replace('index.html?next=' + encodeURIComponent(here)); return; }
  if (r.status === 403) { const pay = C.pay && C.pay[id]; say('You are not enrolled on this course yet.' + (pay ? ' <a href="' + pay + '">Enrol for ₦35,000</a>.' : '') + ' <a href="index.html">My courses</a>'); return; }
  if (!r.ok) { say('Something went wrong loading the course. Please try again.'); return; }
  const d = await r.json();
  window.COURSES = {[id]: d.course};
  window.BSOE_DEEP = {lessons: {[id]: d.deep.lessons}, references: {[id]: d.deep.references}};
  window.BSOE_MEDIA = {[id]: d.media};
  window.BSOE_AZURE_TUTOR_ENDPOINT = '';
  const g = document.getElementById('gate'); if (g) g.remove();
  for (const s of scripts) await load(s);
  if (page === 'course' && typeof init === 'function') init();
 })().catch(e => say('Could not start the course: ' + e.message));
})();
