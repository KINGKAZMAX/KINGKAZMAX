'use strict';
(() => {
  const $ = id => document.getElementById(id);
  const read = key => { try { return localStorage.getItem('kinglab:' + key); } catch { return null; } };
  const write = (key, value) => { try { localStorage.setItem('kinglab:' + key, value); return true; } catch { return false; } };
  const queryLang = new URLSearchParams(location.search).get('lang');
  let lang = ['zh', 'en'].includes(queryLang) ? queryLang : (read('lang') || 'zh');
  if (!['zh', 'en'].includes(lang)) lang = 'zh';
  const tr = (zh, en) => lang === 'zh' ? zh : en;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let motion = reduced.matches ? false : read('motion') !== 'off';
  let sound = false;
  let audio;
  let topic = 'ai', ideaIndex = 0, cardIndex = 0, challenge = 'question';
  const topics = {
    ai: [['AI 参与创作时，人的判断在哪里？','Where is human judgment when AI joins the creative process?'],['我在探索人机共创中的过程记录、设计判断与证据：如何让生成不只是给出结果，也让推理和选择变得可讨论。','Exploring process, design judgment, and evidence in human–AI co-creation: making reasoning and choices discussable, alongside generated outcomes.'],['Human–AI Interaction','Creative practice']],
    space: [['空间能否成为一种可以对话的界面？','Can space become an interface we can converse with?'],['计算与空间设计是我的探索方向之一。我关注生成规则、形态变化，以及人如何理解和参与空间决策。','Computational and spatial design is one of my areas of exploration: generative rules, changing forms, and how people understand and participate in spatial decisions.'],['Computational design','Spatial interaction']],
    culture: [['体验离开现场之后，还留下什么？','What stays with us after an experience ends?'],['从数字文化、沉浸体验到个人记忆，我在追问：互动如何帮助我们感知文化，也保留每个人不同的理解。','From digital culture and immersive experiences to personal memory, I ask how interaction helps us encounter culture while making room for individual interpretation.'],['Digital heritage','Immersive experience']],
    play: [['玩心，能否成为研究的入口？','Can play become an entrance to research?'],['PTCG 对局、黑客松与数字宠物，带来关于规则、反馈和陪伴的好奇心。这是我想继续探索的交叉问题。','PTCG matches, hackathons, and digital companions invite questions about rules, feedback, and companionship. These are intersections I want to explore further.'],['Playful interaction','Decision-making']]
  };
  const ideas = [
    ['文化记忆','空间交互','如果记忆能被走进去，会怎样？','Cultural memory','Spatial interaction','What if a memory were a place you could enter?'],
    ['人机共创','选择记录','把每次拒绝 AI 建议的理由也留在作品旁边？','Human–AI co-creation','Decision traces','What if a work kept the reasons for rejecting an AI suggestion?'],
    ['文化遗产','身体手势','用一个动作理解一段文化，而不只读一段介绍？','Cultural heritage','Body gestures','Could a gesture help us encounter culture beyond a written description?'],
    ['生成空间','参与式设计','让每个人都能修改一条空间生成规则？','Generative space','Participatory design','What if everyone could change one rule of a generative space?'],
    ['数字陪伴','研究日常','一个不会催促你的宠物，会改变研究体验吗？','Digital companions','Research routines','Could a companion that never pressures you change the experience of research?'],
    ['游戏规则','可解释性','如果 AI 的建议像一手牌，你需要看见哪些信息？','Game rules','Explainability','If AI advice were a hand of cards, what information would you need?'],
    ['黑客松','长期记忆','冲刺之后，怎样保存那些没来得及实现的理由？','Hackathons','Long-term memory','After a sprint, how could we keep the reasoning behind ideas left unbuilt?'],
    ['沉浸体验','评价方法','先问参与者记住什么，再问他们是否喜欢？','Immersive experiences','Evaluation','What might we learn by asking what people remember before asking what they liked?']
  ];
  const cards = [
    ['RESOURCE / 资源','如果只能保留一个变量，你会选哪个？','RESOURCE','If you could keep just one variable, which would it be?'],
    ['INFORMATION / 信息','还有哪条信息，会让你改变判断？','INFORMATION','What information would change your decision?'],
    ['TEMPO / 节奏','现在应该继续探索，还是做一个小实验？','TEMPO','Is it time to explore more, or run a small experiment?'],
    ['ADAPTATION / 调整','环境改变以后，你最先修改什么？','ADAPTATION','When the context changes, what do you change first?'],
    ['REFLECTION / 复盘','结果之外，哪一步推理最值得留下？','REFLECTION','Beyond the outcome, which step of reasoning is worth keeping?']
  ];
  const challenges = {
    question: ['找出一个具体的人。','写下 TA 在什么情境里，遇到什么障碍。先别写解决方案。','Find one specific person.','Describe the situation and the obstacle they face. Leave the solution for later.'],
    prototype: ['只做一个可以试的动作。','把最关键的交互做出来。纸张、对话或一个按钮，都可以是原型。','Make one action testable.','Build the critical interaction. Paper, a conversation, or one button can be a prototype.'],
    test: ['记录一次意料之外。','让一个人试一试，记下实际发生了什么，以及你原先的假设哪里不成立。','Record one surprise.','Let someone try it. Record what happened and which assumption did not hold.']
  };
  const choose = (array, current) => array.length < 2 ? 0 : (current + 1 + Math.floor(Math.random() * (array.length - 1))) % array.length;
  function renderTopic() {
    const data = topics[topic], index = Object.keys(topics).indexOf(topic) + 1;
    $('topic-kicker').textContent = 'QUESTION / 0' + index;
    $('topic-title').textContent = data[0][lang === 'zh' ? 0 : 1];
    $('topic-description').textContent = data[1][lang === 'zh' ? 0 : 1];
    $('topic-tags').replaceChildren(...data[2].map(t => { const span = document.createElement('span'); span.textContent = t; return span; }));
    $('topic-status').textContent = topic === 'play' ? tr('新的交叉探索 / 不是既有研究成果','A new intersection to explore / not a completed finding') : tr('正在探索的研究问题','A research question in progress');
    document.querySelectorAll('[data-topic]').forEach(b => { b.classList.toggle('active', b.dataset.topic === topic); b.setAttribute('aria-pressed', String(b.dataset.topic === topic)); });
  }
  function renderIdea() {
    const i = ideas[ideaIndex], offset = lang === 'zh' ? 0 : 3;
    const a = document.createElement('span'), cross = document.createElement('i'), b = document.createElement('span');
    a.textContent = i[offset]; cross.textContent = '×'; b.textContent = i[offset + 1];
    $('idea-terms').replaceChildren(a, cross, b); $('idea-prompt').textContent = i[offset + 2];
  }
  function renderCard() { const c = cards[cardIndex], n = lang === 'zh' ? 0 : 2; $('card-title').textContent = c[n]; $('card-text').textContent = c[n + 1]; }
  function renderChallenge() { const c = challenges[challenge], n = lang === 'zh' ? 0 : 2; $('challenge-title').textContent = c[n]; $('challenge-text').textContent = c[n + 1]; document.querySelectorAll('[data-challenge]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.challenge === challenge))); }
  function chime(freq = 520) {
    if (!sound) return;
    try { audio ||= new (window.AudioContext || window.webkitAudioContext)(); audio.resume(); const oscillator = audio.createOscillator(), gain = audio.createGain(); oscillator.type = 'sine'; oscillator.frequency.setValueAtTime(freq, audio.currentTime); gain.gain.setValueAtTime(.045, audio.currentTime); gain.gain.exponentialRampToValueAtTime(.001, audio.currentTime + .25); oscillator.connect(gain); gain.connect(audio.destination); oscillator.start(); oscillator.stop(audio.currentTime + .26); } catch { sound = false; renderControls(); }
  }
  function renderControls() {
    $('lang').textContent = lang === 'zh' ? 'EN' : '中文';
    $('lang').setAttribute('aria-label', tr('Switch to English','切换为中文'));
    $('theme').setAttribute('aria-label', tr('切换明暗主题','Toggle light and dark theme'));
    $('motion').textContent = tr('动态','Motion'); $('motion').setAttribute('aria-pressed', String(motion));
    $('sound').textContent = tr('音效','Sound'); $('sound').setAttribute('aria-pressed', String(sound));
    document.body.dataset.motion = motion ? 'on' : 'off';
  }
  function setLanguage() {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    document.title = tr('KINGKAZMAX — 好奇心实验室','KINGKAZMAX — Curiosity Lab');
    document.querySelectorAll('[data-zh][data-en]').forEach(el => el.textContent = el.dataset[lang]);
    $('note').placeholder = tr('一个问题、一句灵感，或者下一步……','A question, an idea, or the next small step…');
    const labels = { 'pet-touch':['摸摸亚古兽','Pet Agumon'], 'draw-card':['抽取一张思考卡','Draw a thought card'], 'draw-canvas':['可绘制线条画布；拖动，或使用方向键和空格','Drawing canvas. Drag, or use arrow keys and Space'], 'draw-width':['轨迹数量','Number of trails'], timer:['剩余专注时间','Focus time remaining'] };
    Object.entries(labels).forEach(([id, words]) => $(id).setAttribute('aria-label', words[lang === 'zh' ? 0 : 1]));
    renderControls(); renderTopic(); renderIdea(); renderCard(); renderChallenge(); renderTimer(); renderPetMessage();
    $('note-status').textContent = noteStorageOK ? tr('只保存在你的浏览器，不会发送给我。','Saved only in your browser. Never sent to me.') : tr('浏览器存储不可用；便签只在本页暂存。','Browser storage unavailable; this note lasts only in this page.');
  }
  document.body.dataset.theme = read('theme') === 'dark' ? 'dark' : 'light';
  $('lang').addEventListener('click', () => { lang = lang === 'zh' ? 'en' : 'zh'; write('lang', lang); setLanguage(); });
  $('theme').addEventListener('click', () => { document.body.dataset.theme = document.body.dataset.theme === 'dark' ? 'light' : 'dark'; write('theme', document.body.dataset.theme); renderDrawing(); });
  $('motion').addEventListener('click', () => { motion = !motion; write('motion', motion ? 'on' : 'off'); renderControls(); renderPetFrame(0); });
  reduced.addEventListener('change', e => { if (e.matches) { motion = false; renderControls(); renderPetFrame(0); } });
  $('sound').addEventListener('click', () => { sound = !sound; renderControls(); chime(); });
  document.querySelectorAll('[data-topic]').forEach(b => b.addEventListener('click', () => { topic = b.dataset.topic; renderTopic(); chime(420); }));
  $('shuffle').addEventListener('click', () => { ideaIndex = choose(ideas, ideaIndex); renderIdea(); petAction('idea'); chime(660); });
  $('draw-card').addEventListener('click', () => { cardIndex = choose(cards, cardIndex); renderCard(); chime(390); });
  document.querySelectorAll('[data-challenge]').forEach(b => b.addEventListener('click', () => { challenge = b.dataset.challenge; renderChallenge(); }));
  function updateClock() { $('clock').textContent = new Intl.DateTimeFormat(lang === 'zh' ? 'zh-CN' : 'en-GB',{hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date()); }
  updateClock(); setInterval(updateClock, 15000);

  // The original local sprite sheet is rendered using its own frame durations.
  let atlas, manifest, petState = 'idle', actionUntil = 0, actionStarted = 0, resting = false, petVisible = true, petMessage = 'hello', petFrameKey = '';
  const petMessages = {hello:['从我的桌面来到这里。摸摸我？','From my desktop to this little world. Say hello?'],feed:['补充了一点能量，谢谢你！','A little energy boost. Thank you!'],pat:['收到摸头！一起保持好奇。','Head pat received. Stay curious with me.'],play:['出去走两步，灵感也许在路上。','A little walk. Perhaps an idea is waiting.'],rest:['安静陪伴中。休息也算前进。','Quiet company. Rest is part of the journey.'],idea:['这个组合有意思，再追问一步？','An interesting collision. One more question?'],focus:['我陪你。先专注眼前这一个问题。','I am here. One question at a time.'],done:['这一段结束了。伸个懒腰吧。','That session is complete. Time to stretch.'],error:['先用静态形态陪你。','Keeping you company in still form for now.']};
  function renderPetMessage() { $('pet-message').textContent = (petMessages[petMessage] || petMessages.hello)[lang === 'zh' ? 0 : 1]; }
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
    $('timer-toggle').textContent = timerRunning ? tr('暂停','Pause') : remaining < timerDuration && remaining > 0 ? tr('继续','Resume') : tr('开始专注','Start focus');
    $('timer-mode').textContent = timerDuration === 1500 ? tr('换成 5 分钟','Switch to 5 min') : tr('换成 25 分钟','Switch to 25 min');
    const statusText = timerDone ? tr('这一段完成了。休息一下吧。','Session complete. Take a little break.') : timerRunning ? tr('专注中，页面留在后台也会计时。','Focusing. Timing continues while this tab is in the background.') : tr('计时仅在当前页面运行。','Timer runs in this page only.'); if ($('timer-status').textContent !== statusText) $('timer-status').textContent=statusText;
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
  $('note').addEventListener('input', () => { noteStorageOK = write('note',$('note').value); $('note-status').textContent = noteStorageOK ? tr('已保存在你的浏览器，不会发送给我。','Saved in your browser. Never sent to me.') : tr('浏览器存储不可用；便签只在本页暂存。','Browser storage unavailable; this note lasts only in this page.'); });
  $('note-clear').addEventListener('click', () => { $('note').value=''; try { localStorage.removeItem('kinglab:note'); noteStorageOK=true; } catch { noteStorageOK=false; } $('note').focus(); $('note-status').textContent=noteStorageOK ? tr('已清空这张便签。','Note cleared.') : tr('当前便签已清空，但无法删除浏览器里的旧副本。','This page is clear, but the saved browser copy could not be deleted.'); });

  // Small original generative drawing tool. Every exported SVG is local to the visitor.
  const draw = $('draw-canvas'), ctx = draw.getContext('2d');
  let lines=[], activeLine=null, pointerId=null, cursor={x:320,y:150};
  function renderDrawing() {
    ctx.clearRect(0,0,640,300); const color=getComputedStyle(document.body).getPropertyValue('--accent').trim() || '#2e573f';
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
  $('draw-save').addEventListener('click',()=>{const color=getComputedStyle(document.body).getPropertyValue('--accent').trim();const paths=[];for(const line of lines)for(let t=0;t<line.trails;t++)paths.push('<polyline points="'+line.points.map(p=>p.x.toFixed(1)+','+(p.y+t*6).toFixed(1)).join(' ')+'"/>');const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300"><title>A trail from KINGKAZMAX curiosity lab</title><g fill="none" stroke="'+color+'" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round">'+paths.join('')+'</g></svg>';const url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}));const a=document.createElement('a');a.href=url;a.download='my-curiosity-trail.svg';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
  for(let n=0;n<5;n++){const line={trails:1,points:[]};for(let x=35;x<=605;x+=5)line.points.push({x,y:135+Math.sin(x/72+n*.3)*30+n*9});lines.push(line);}
  setLanguage(); renderDrawing();
})();
