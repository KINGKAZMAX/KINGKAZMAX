'use strict';
(() => {
  const $ = id => document.getElementById(id);
  const read = key => { try { return localStorage.getItem('kinglab:' + key); } catch { return null; } };
  const write = (key, value) => { try { localStorage.setItem('kinglab:' + key, value); return true; } catch { return false; } };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let motion = reduced.matches ? false : read('motion') !== 'off';
  let sound = false;
  let audio;
  let topic = 'ai', ideaIndex = 0, cardIndex = 0, challenge = 'question';
  const topics = {
    ai: ['Where is human judgment when AI joins the creative process?', 'Exploring process, design judgment, and evidence in human–AI co-creation: making reasoning and choices discussable, alongside generated outcomes.', ['Human–AI interaction', 'Creative practice']],
    space: ['Can space become an interface we can converse with?', 'Computational and spatial design is one area of exploration: generative rules, changing forms, and how people understand and participate in spatial decisions.', ['Computational design', 'Spatial interaction']],
    culture: ['What stays with us after an experience ends?', 'From digital culture and immersive experiences to personal memory: how might interaction support cultural understanding and individual interpretation?', ['Digital heritage', 'Immersive experience']],
    play: ['Can play become a method of inquiry?', 'PTCG matches, hackathons, and digital companions raise questions about rules, feedback, and companionship. These are intersections for further exploration.', ['Playful interaction', 'Decision-making']]
  };
  const ideas = [
    ['Cultural memory','Spatial interaction','What if a memory were a place you could enter?'],
    ['Human–AI co-creation','Decision traces','What if a work kept the reasons for rejecting an AI suggestion?'],
    ['Cultural heritage','Body gestures','Could a gesture help us encounter culture beyond a written description?'],
    ['Generative space','Participatory design','What if everyone could change one rule of a generative space?'],
    ['Digital companions','Research routines','Could a companion that never pressures you change the experience of research?'],
    ['Game rules','Explainability','If AI advice were a hand of cards, what information would you need?'],
    ['Hackathons','Long-term memory','After a sprint, how could we keep the reasoning behind ideas left unbuilt?'],
    ['Immersive experiences','Evaluation','What might we learn by asking what people remember before asking what they liked?']
  ];
  const cards = [
    ['RESOURCE','If you could keep just one variable, which would it be?'],
    ['INFORMATION','What information would change your decision?'],
    ['TEMPO','Is it time to explore more, or run a small experiment?'],
    ['ADAPTATION','When the context changes, what do you change first?'],
    ['REFLECTION','Beyond the outcome, which step of reasoning is worth keeping?']
  ];
  const challenges = {
    question: ['Find one specific person.','Describe the situation and the obstacle they face. Leave the solution for later.'],
    prototype: ['Make one action testable.','Build the critical interaction. Paper, a conversation, or one button can be a prototype.'],
    test: ['Record one surprise.','Let someone try it. Record what happened and which assumption did not hold.']
  };
  const choose = (array, current) => array.length < 2 ? 0 : (current + 1 + Math.floor(Math.random() * (array.length - 1))) % array.length;
  function renderTopic() {
    const data = topics[topic], index = Object.keys(topics).indexOf(topic) + 1;
    $('topic-kicker').textContent = 'QUESTION / 0' + index;
    $('topic-title').textContent = data[0];
    $('topic-description').textContent = data[1];
    $('topic-tags').replaceChildren(...data[2].map(t => { const span = document.createElement('span'); span.textContent = t; return span; }));
    $('topic-status').textContent = topic === 'play' ? 'A proposed intersection, not a completed finding' : 'A research question in progress';
    document.querySelectorAll('[data-topic]').forEach(b => { b.classList.toggle('active', b.dataset.topic === topic); b.setAttribute('aria-pressed', String(b.dataset.topic === topic)); });
  }
  function renderIdea() {
    const i = ideas[ideaIndex], offset = 0;
    const a = document.createElement('span'), cross = document.createElement('i'), b = document.createElement('span');
    a.textContent = i[offset]; cross.textContent = '×'; b.textContent = i[offset + 1];
    $('idea-terms').replaceChildren(a, cross, b); $('idea-prompt').textContent = i[offset + 2];
  }
  function renderCard() { const c = cards[cardIndex]; $('card-title').textContent = c[0]; $('card-text').textContent = c[1]; }
  function renderChallenge() { const c = challenges[challenge]; $('challenge-title').textContent = c[0]; $('challenge-text').textContent = c[1]; document.querySelectorAll('[data-challenge]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.challenge === challenge))); }
  function chime(freq = 520) {
    if (!sound) return;
    try { audio ||= new (window.AudioContext || window.webkitAudioContext)(); audio.resume(); const oscillator = audio.createOscillator(), gain = audio.createGain(); oscillator.type = 'sine'; oscillator.frequency.setValueAtTime(freq, audio.currentTime); gain.gain.setValueAtTime(.045, audio.currentTime); gain.gain.exponentialRampToValueAtTime(.001, audio.currentTime + .25); oscillator.connect(gain); gain.connect(audio.destination); oscillator.start(); oscillator.stop(audio.currentTime + .26); } catch { sound = false; renderControls(); }
  }
  function renderControls() {
    const dark = document.body.dataset.theme === 'dark';
    $('theme').setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    $('theme').setAttribute('aria-pressed', String(dark));
    $('motion').textContent = 'Motion'; $('motion').setAttribute('aria-pressed', String(motion));
    $('sound').textContent = 'Sound'; $('sound').setAttribute('aria-pressed', String(sound));
    document.body.dataset.motion = motion ? 'on' : 'off';
  }
  function setLanguage() {
    document.documentElement.lang = 'en';
    document.title = 'ZHIXIN CAI — Research Directions';
    document.querySelectorAll('[data-en]').forEach(el => el.textContent = el.dataset.en);
    $('note').placeholder = 'A research note or observation…';
    const labels = { 'pet-touch':'Pet Agumon', 'draw-card':'Draw a thought card', 'draw-canvas':'Drawing canvas. Drag, or use arrow keys and Space', 'draw-width':'Number of trails', timer:'Focus time remaining' };
    Object.entries(labels).forEach(([id, label]) => $(id).setAttribute('aria-label', label));
    renderControls(); renderTopic(); renderIdea(); renderCard(); renderChallenge(); renderTimer(); renderPetMessage();
    $('note-status').textContent = noteStorageOK ? 'Saved only in your browser. Never sent to this site.' : 'Browser storage is unavailable; this note lasts only on this page.';
  }
  document.body.dataset.theme = read('theme') === 'dark' ? 'dark' : 'light';
  $('theme').addEventListener('click', () => { document.body.dataset.theme = document.body.dataset.theme === 'dark' ? 'light' : 'dark'; write('theme', document.body.dataset.theme); renderControls(); renderDrawing(); });
  $('motion').addEventListener('click', () => { motion = !motion; write('motion', motion ? 'on' : 'off'); renderControls(); renderPetFrame(0); });
  reduced.addEventListener('change', e => { if (e.matches) { motion = false; renderControls(); renderPetFrame(0); } });
  $('sound').addEventListener('click', () => { sound = !sound; renderControls(); chime(); });
  document.querySelectorAll('[data-topic]').forEach(b => b.addEventListener('click', () => { topic = b.dataset.topic; renderTopic(); chime(420); }));
  $('shuffle').addEventListener('click', () => { ideaIndex = choose(ideas, ideaIndex); renderIdea(); petAction('idea'); chime(660); });
  $('draw-card').addEventListener('click', () => { cardIndex = choose(cards, cardIndex); renderCard(); chime(390); });
  document.querySelectorAll('[data-challenge]').forEach(b => b.addEventListener('click', () => { challenge = b.dataset.challenge; renderChallenge(); }));
  function updateClock() { $('clock').textContent = new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date()); }
  updateClock(); setInterval(updateClock, 15000);

  // The original local sprite sheet is rendered using its own frame durations.
  let atlas, manifest, petState = 'idle', actionUntil = 0, actionStarted = 0, resting = false, petVisible = true, petMessage = 'hello', petFrameKey = '';
  const petMessages = {
    hello: 'Agumon is ready. Select an interaction.',
    feed: 'Agumon has been fed.',
    pat: 'Agumon responds.',
    play: 'Agumon is moving.',
    rest: 'Agumon is resting.',
    idea: 'A new research prompt is ready.',
    focus: 'Focus session in progress.',
    done: 'Focus session complete.',
    error: 'Static preview displayed.'
  };
  function renderPetMessage() { $('pet-message').textContent = petMessages[petMessage] || petMessages.hello; }
  function petAction(action) {
    const now = performance.now(); actionStarted = now; actionUntil = now + (action === 'play' ? 4000 : 2200); petFrameKey = '';
    if (action === 'rest') { resting = !resting; petMessage = resting ? 'rest' : 'hello'; petState = 'idle'; }
    else { resting = false; petMessage = petMessages[action] ? action : 'hello'; petState = action === 'play' ? 'running-right' : (action === 'feed' || action === 'done' ? 'jumping' : 'waving'); }
    $('pet-symbol').textContent = resting ? 'z z' : action === 'feed' ? '◒' : action === 'pat' ? '♡' : action === 'idea' ? '✦' : '';
    document.querySelector('[data-pet="rest"]').setAttribute('aria-pressed', String(resting)); renderPetMessage(); renderPetFrame(0); chime(action === 'feed' ? 720 : 560);
  }
  document.querySelectorAll('[data-pet]').forEach(b => b.addEventListener('click', () => petAction(b.dataset.pet)));
  $('pet-touch').addEventListener('click', () => petAction('pat'));
  function renderPetFrame(elapsed) {
    if (!atlas || !manifest) return;
    let state = manifest.animations[petState] || manifest.animations.idle;
    let frame = 0;
    if (motion && !resting) {
      let time = elapsed % state.durationMs;
      for (let i = 0; i < state.frameDurationsMs.length; i++) { if (time < state.frameDurationsMs[i]) { frame = i; break; } time -= state.frameDurationsMs[i]; }
    }
    const key = state.row + ':' + frame;
    if (key === petFrameKey) return;
    petFrameKey = key;
    const ctx = $('pet-canvas').getContext('2d'), w = manifest.atlas.cellWidth, h = manifest.atlas.cellHeight;
    ctx.clearRect(0,0,w,h); ctx.drawImage(atlas,frame*w,state.row*h,w,h,0,0,w,h);
  }
  function petTick(now) {
    if (!document.hidden && petVisible) {
      if (now > actionUntil && petState !== 'idle') { petState = 'idle'; $('pet-touch').style.translate = '0px 0px'; if (!resting) $('pet-symbol').textContent = ''; }
      if (motion && !resting && now < actionUntil && petMessage === 'play') {
        const progress = (now - actionStarted) / 4000, offset = Math.sin(progress * Math.PI * 2) * 55;
        petState = progress < .25 || progress > .75 ? 'running-right' : 'running-left'; $('pet-touch').style.translate = offset + 'px 0px';
      } else { $('pet-touch').style.translate = '0px 0px'; }
      renderPetFrame(now - actionStarted);
    }
    requestAnimationFrame(petTick);
  }
  new IntersectionObserver(entries => { petVisible = entries[0].isIntersecting; },{rootMargin:'80px'}).observe($('pet-world'));
  Promise.all([fetch('assets/pet/pet-manifest.json').then(r => { if (!r.ok) throw Error('manifest'); return r.json(); }),new Promise((resolve,reject) => { const img = new Image(); img.onload = () => resolve(img); img.onerror = reject; img.src = 'assets/pet/atlas.webp'; })]).then(([data,img]) => {
    manifest = data; atlas = img; $('pet-poster').hidden = true; $('pet-canvas').hidden = false; renderPetFrame(0); requestAnimationFrame(petTick);
    const action = new URLSearchParams(location.search).get('action'); if (['feed','pat','play','rest'].includes(action)) petAction(action);
  }).catch(() => { petMessage = 'error'; renderPetMessage(); });

  // Deadline based timing remains accurate after inactive tabs are throttled.
  let timerDuration = 25*60, remaining = timerDuration, deadline = 0, timerRunning = false, timerDone = false;
  function renderTimer() {
    const seconds = Math.max(0,Math.ceil(remaining)); $('timer').textContent = String(Math.floor(seconds/60)).padStart(2,'0') + ':' + String(seconds%60).padStart(2,'0');
    $('timer-toggle').textContent = timerRunning ? 'Pause' : remaining < timerDuration && remaining > 0 ? 'Resume' : 'Start session';
    $('timer-mode').textContent = timerDuration === 1500 ? 'Switch to 5 min' : 'Switch to 25 min';
    const statusText = timerDone ? 'Session complete.' : timerRunning ? 'Session in progress; timing continues in the background.' : 'Timer runs on this page only.'; if ($('timer-status').textContent !== statusText) $('timer-status').textContent=statusText;
  }
  $('timer-toggle').addEventListener('click', () => {
    if (timerRunning) { remaining = Math.max(0,(deadline-Date.now())/1000); timerRunning = false; }
    else { if (remaining <= 0) remaining = timerDuration; deadline = Date.now()+remaining*1000; timerRunning = true; timerDone = false; petMessage = 'focus'; resting = true; petState = 'idle'; $('pet-symbol').textContent = '· · ·'; document.querySelector('[data-pet="rest"]').setAttribute('aria-pressed','true'); renderPetMessage(); }
    renderTimer();
  });
  function resetTimer() { timerRunning=false; timerDone=false; remaining=timerDuration; if (petMessage === 'focus') { resting=false; petMessage='hello'; $('pet-symbol').textContent=''; document.querySelector('[data-pet="rest"]').setAttribute('aria-pressed','false'); renderPetMessage(); } renderTimer(); }
  $('timer-reset').addEventListener('click',resetTimer);
  $('timer-mode').addEventListener('click',() => { timerDuration = timerDuration===1500 ? 300 : 1500; resetTimer(); });
  setInterval(() => { if (!timerRunning) return; remaining=Math.max(0,(deadline-Date.now())/1000); if (remaining===0) { timerRunning=false; timerDone=true; petAction('done'); chime(880); } renderTimer(); },500);

  let noteStorageOK = true;
  $('note').value = read('note') || '';
  $('note').addEventListener('input', () => { noteStorageOK = write('note',$('note').value); $('note-status').textContent = noteStorageOK ? 'Saved in your browser. Never sent to this site.' : 'Browser storage is unavailable; this note lasts only on this page.'; });
  $('note-clear').addEventListener('click', () => { $('note').value=''; try { localStorage.removeItem('kinglab:note'); noteStorageOK=true; } catch { noteStorageOK=false; } $('note').focus(); $('note-status').textContent=noteStorageOK ? 'Note cleared.' : 'This page is clear, but the saved browser copy could not be deleted.'; });

  // Small original generative drawing tool. Every exported SVG is local to the visitor.
  const draw = $('draw-canvas'), ctx = draw.getContext('2d');
  let lines=[], activeLine=null, pointerId=null, cursor={x:320,y:150};
  function renderDrawing() {
    ctx.clearRect(0,0,640,300); const color=getComputedStyle(document.body).getPropertyValue('--accent').trim() || '#0969da';
    ctx.strokeStyle=color; ctx.lineWidth=1.25; ctx.lineJoin='round'; ctx.lineCap='round';
    for(const line of lines) for(let trail=0;trail<line.trails;trail++){ctx.beginPath(); line.points.forEach((p,i)=>{const y=p.y+trail*6; i?ctx.lineTo(p.x,y):ctx.moveTo(p.x,y);}); ctx.stroke();}
    if(document.activeElement===draw){ctx.fillStyle=color;ctx.beginPath();ctx.arc(cursor.x,cursor.y,3,0,Math.PI*2);ctx.fill();}
  }
  function newLine(point){const line={trails:Number($('draw-width').value),points:[point]}; if(lines.length>=80)lines.shift();lines.push(line);return line;}
  function pointAt(event){const r=draw.getBoundingClientRect();return{x:Math.max(0,Math.min(640,(event.clientX-r.left)*640/r.width)),y:Math.max(0,Math.min(270,(event.clientY-r.top)*300/r.height))};}
  draw.addEventListener('pointerdown',event=>{if(!event.isPrimary || event.button!==0)return;pointerId=event.pointerId;draw.setPointerCapture(pointerId);cursor=pointAt(event);activeLine=newLine(cursor);activeLine.points.push({x:cursor.x+.1,y:cursor.y+.1});renderDrawing();});
  draw.addEventListener('pointermove',event=>{if(event.pointerId!==pointerId||!activeLine)return;cursor=pointAt(event);if(activeLine.points.length<2000)activeLine.points.push(cursor);renderDrawing();});
  function endStroke(){activeLine=null;pointerId=null;}
  draw.addEventListener('pointerup',endStroke);draw.addEventListener('pointercancel',endStroke);draw.addEventListener('lostpointercapture',endStroke);
  draw.addEventListener('keydown',event=>{if(event.ctrlKey||event.metaKey||event.altKey)return;const offsets={ArrowUp:[0,-10],ArrowDown:[0,10],ArrowLeft:[-10,0],ArrowRight:[10,0]};if(offsets[event.key]){event.preventDefault();cursor={x:Math.max(0,Math.min(640,cursor.x+offsets[event.key][0])),y:Math.max(0,Math.min(270,cursor.y+offsets[event.key][1]))};renderDrawing();}else if(event.key===' '){event.preventDefault();const line=newLine({...cursor});line.points.push({x:Math.min(640,cursor.x+35),y:Math.min(270,cursor.y+12)});renderDrawing();}});
  draw.addEventListener('focus',renderDrawing);draw.addEventListener('blur',renderDrawing);
  $('draw-clear').addEventListener('click',()=>{lines=[];renderDrawing();});
  $('draw-save').addEventListener('click',()=>{const color=getComputedStyle(document.body).getPropertyValue('--accent').trim();const paths=[];for(const line of lines)for(let t=0;t<line.trails;t++)paths.push('<polyline points="'+line.points.map(p=>p.x.toFixed(1)+','+(p.y+t*6).toFixed(1)).join(' ')+'"/>');const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300"><title>Line study by ZHIXIN CAI</title><g fill="none" stroke="'+color+'" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round">'+paths.join('')+'</g></svg>';const url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}));const a=document.createElement('a');a.href=url;a.download='line-study.svg';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
  for(let n=0;n<5;n++){const line={trails:1,points:[]};for(let x=35;x<=605;x+=5)line.points.push({x,y:135+Math.sin(x/72+n*.3)*30+n*9});lines.push(line);}
  setLanguage(); renderDrawing();
})();
