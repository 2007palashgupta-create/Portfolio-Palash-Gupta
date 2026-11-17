(function(){
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function(s,c){return (c||document).querySelector(s)};
  var $$ = function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};

  // loader
  window.addEventListener('load', function(){ setTimeout(function(){ $('#loader').classList.add('done'); }, 350); });

  // sticky nav shadow
  var nav = $('#nav');
  function onScroll(){ nav.classList.toggle('scrolled', window.scrollY > 10); }
  window.addEventListener('scroll', onScroll, {passive:true}); onScroll();

  // mobile menu
  var burger = $('#burger'), links = $('#links');
  function closeMenu(){ links.classList.remove('open'); burger.setAttribute('aria-expanded','false'); }
  burger.addEventListener('click', function(){
    var open = links.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
  });
  $$('#links a').forEach(function(a){ a.addEventListener('click', closeMenu); });
  document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeMenu(); });

  // typing animation
  var phrases = ['BBA (Honours) Student','Operations Enthusiast','Business Analytics Learner'];
  var el = $('#typed');
  if (reduce) { el.textContent = phrases.join(' | '); }
  else {
    var p=0,c=0,del=false;
    (function tick(){
      var full = phrases[p];
      c += del ? -1 : 1;
      el.textContent = full.slice(0,c);
      var t = del ? 35 : 75;
      if(!del && c===full.length){ del=true; t=1600; }
      else if(del && c===0){ del=false; p=(p+1)%phrases.length; t=350; }
      setTimeout(tick,t);
    })();
  }

  // reveal on scroll + skill bars
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
    });
  },{threshold:.15});
  $$('.reveal').forEach(function(n,i){ n.style.transitionDelay = (i%4)*80+'ms'; io.observe(n); });

  // active section highlight
  var sections = $$('main section[id]');
  var navLinks = $$('#links a');
  var so = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        navLinks.forEach(function(a){ a.classList.toggle('active', a.getAttribute('href')==='#'+e.target.id); });
      }
    });
  },{rootMargin:'-45% 0px -50% 0px'});
  sections.forEach(function(s){ so.observe(s); });

  // project accordion
  $$('.proj-head').forEach(function(btn){
    btn.addEventListener('click', function(){
      var body = document.getElementById(btn.getAttribute('aria-controls'));
      var open = btn.getAttribute('aria-expanded')==='true';
      $$('.proj-head').forEach(function(b){
        b.setAttribute('aria-expanded','false');
        document.getElementById(b.getAttribute('aria-controls')).classList.remove('open');
      });
      if(!open){ btn.setAttribute('aria-expanded','true'); body.classList.add('open'); }
    });
  });

  // portrait tilt (desktop pointer only)
  var portrait = $('.portrait');
  if(!reduce && window.matchMedia('(hover:hover)').matches){
    portrait.addEventListener('mousemove', function(e){
      var r = portrait.getBoundingClientRect();
      var x = (e.clientX-r.left)/r.width-.5, y = (e.clientY-r.top)/r.height-.5;
      portrait.style.transform = 'perspective(900px) rotateY('+(x*6)+'deg) rotateX('+(-y*6)+'deg)';
    });
    portrait.addEventListener('mouseleave', function(){ portrait.style.transform=''; });
  }

  // contact form -> opens visitor's email app (works on static hosting, no backend)
  var form = $('#form'), status = $('#status');
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var ok = true;
    $$('input,textarea', form).forEach(function(f){
      var bad = !f.value.trim() || (f.type==='email' && !/^\S+@\S+\.\S+$/.test(f.value));
      f.classList.toggle('invalid', bad); if(bad) ok=false;
    });
    if(!ok){ status.textContent = 'Please fill in every field with a valid email.'; return; }
    var d = new FormData(form);
    var subject = encodeURIComponent('Portfolio message from ' + d.get('name'));
    var body = encodeURIComponent(d.get('message') + '\n\n' + d.get('name') + '\n' + d.get('email'));
    status.textContent = 'Opening your email app to send the message.';
    window.location.href = 'mailto:2007palashgupta@gmail.com?subject=' + subject + '&body=' + body;
  });
})();
