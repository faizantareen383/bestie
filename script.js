// =========================================================
//  Shared helpers (har page par use hote hain)
// =========================================================
const rand = (a, b) => Math.random() * (b - a) + a;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const ss = {
  get: (k) => { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
  set: (k, v) => { try { sessionStorage.setItem(k, v); } catch (e) {} },
};

const isSky = document.body.dataset.sky !== undefined;

// ---------- Floating hearts (ya raat wale page par sitare) ----------
const emojis = isSky
  ? ['✨', '⭐', '🌙', '💫']
  : ['💖', '💕', '🌸', '✨', '🦋', '🍓', '💗', '🌷'];
const heartBox = document.querySelector('.hearts');

function spawnHeart() {
  if (!heartBox) return;
  const s = document.createElement('span');
  s.textContent = pick(emojis);
  s.style.left = rand(0, 100) + 'vw';
  s.style.fontSize = rand(14, 36) + 'px';
  const dur = rand(6, 12);
  s.style.animationDuration = dur + 's';
  heartBox.appendChild(s);
  setTimeout(() => s.remove(), dur * 1000);
}
for (let i = 0; i < 8; i++) setTimeout(spawnHeart, i * 250);
setInterval(spawnHeart, 700);

if (isSky && heartBox) {
  for (let i = 0; i < 45; i++) {
    const t = document.createElement('div');
    t.className = 'twinkle';
    t.style.left = rand(0, 100) + '%';
    t.style.top = rand(0, 100) + '%';
    t.style.animationDelay = rand(0, 2.5) + 's';
    heartBox.appendChild(t);
  }
}

// ---------- Progress dots ----------
const dotsBox = document.querySelector('.dots');
const currentPage = parseInt(document.body.dataset.page, 10);
const totalPages = parseInt(document.body.dataset.total, 10);
if (dotsBox) {
  for (let i = 1; i <= totalPages; i++) {
    const d = document.createElement('i');
    if (i === currentPage) d.classList.add('active');
    dotsBox.appendChild(d);
  }
}

// ---------- Sparkles ----------
function sparkleBurst(x, y, count = 12) {
  const items = ['💖', '✨', '🌸', '💕', '⭐'];
  for (let i = 0; i < count; i++) {
    const s = document.createElement('span');
    s.className = 'sparkle';
    s.textContent = pick(items);
    s.style.left = x + 'px';
    s.style.top = y + 'px';
    const angle = (Math.PI * 2 * i) / count;
    const dist = rand(50, 110);
    s.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
    s.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 800);
  }
}
// Kahin bhi tap karo to chhoti si sparkle
document.addEventListener('pointerdown', (e) => sparkleBurst(e.clientX, e.clientY, 4));

// ---------- Confetti ----------
function confetti(n = 80) {
  const colors = ['#ff5fa2', '#ffd36b', '#7bdcb5', '#8ab4ff', '#c79bff', '#ff9a76'];
  for (let i = 0; i < n; i++) {
    const c = document.createElement('div');
    c.className = 'confetti';
    c.style.left = rand(0, 100) + 'vw';
    c.style.background = pick(colors);
    c.style.borderRadius = Math.random() < 0.4 ? '50%' : '2px';
    c.style.setProperty('--dx', rand(-120, 120) + 'px');
    const d = rand(2.5, 4.5);
    c.style.animationDuration = d + 's';
    c.style.animationDelay = rand(0, 0.6) + 's';
    document.body.appendChild(c);
    setTimeout(() => c.remove(), (d + 0.7) * 1000);
  }
}

// ---------- Typewriter ----------
function typeText(el, text, speed = 45, cb) {
  const chars = Array.from(text);
  el.textContent = '';
  el.classList.remove('done');
  let i = 0;
  const t = setInterval(() => {
    el.textContent += chars[i];
    i++;
    if (i >= chars.length) {
      clearInterval(t);
      el.classList.add('done');
      if (cb) cb();
    }
  }, speed);
}

// ---------- Next button unlock ----------
function unlockNext() {
  const b = document.getElementById('nextBtn');
  if (b) {
    b.classList.remove('hidden');
    b.classList.add('pop');
  }
}

// ---------- Next page navigation ----------
document.querySelectorAll('[data-next]').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    sparkleBurst(e.clientX, e.clientY);
    document.body.classList.add('leaving');
    setTimeout(() => {
      window.location.href = btn.dataset.next;
    }, 450);
  });
});

// ---------- Agar gif / pic file na mile to placeholder ----------
function showPlaceholder(img) {
  const ph = document.createElement('div');
  ph.className = 'love-sticker';
  ph.setAttribute('role', 'img');
  ph.setAttribute('aria-label', 'A little animated heart gift');
  ph.innerHTML = '<span class="sticker-heart">💖</span><span class="sticker-spark">✨</span><span class="sticker-caption">Sending you love</span>';
  img.replaceWith(ph);
}
document.querySelectorAll('img').forEach((img) => {
  img.addEventListener('error', () => showPlaceholder(img));
  if (img.complete && img.naturalWidth === 0) showPlaceholder(img);
});

// ---------- Page 1: open the surprise envelope ----------
const envelope = document.getElementById('envelope');
if (envelope) {
  const openEnvelope = () => {
    if (envelope.classList.contains('open')) return;
    envelope.classList.add('open');
    document.getElementById('envelopeMessage').textContent = 'Tum waqai bohat special ho 💖';
    sparkleBurst(window.innerWidth / 2, window.innerHeight / 2, 24);
    confetti(45);
    unlockNext();
  };
  envelope.addEventListener('click', openEnvelope);
  envelope.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openEnvelope();
    }
  });
}

// ---------- Page 2: catch five hearts ----------
const heartGame = document.getElementById('heartGame');
if (heartGame) {
  let caught = 0;
  let heartTimer;
  const spawnCatch = () => {
    if (caught >= 5) return;
    const heart = document.createElement('button');
    heart.type = 'button';
    heart.className = 'catch';
    heart.textContent = pick(['💖', '💕', '💗', '💝']);
    heart.setAttribute('aria-label', 'Catch heart');
    heart.style.left = rand(4, 84) + '%';
    heart.style.animationDuration = rand(2.2, 3.6) + 's';
    heart.addEventListener('click', () => {
      heart.remove();
      caught++;
      document.getElementById('score').textContent = caught;
      sparkleBurst(window.innerWidth / 2, heartGame.getBoundingClientRect().top + 40, 8);
      if (caught === 5) {
        clearInterval(heartTimer);
        confetti(55);
        unlockNext();
      }
    });
    heart.addEventListener('animationend', () => heart.remove());
    heartGame.appendChild(heart);
  };
  heartTimer = setInterval(spawnCatch, 780);
  spawnCatch();
}

// ---------- Page 3: scratch to reveal the compliment ----------
const scratchCanvas = document.getElementById('scratchCanvas');
if (scratchCanvas) {
  const bounds = scratchCanvas.getBoundingClientRect();
  const ratio = Math.max(1, window.devicePixelRatio || 1);
  const context = scratchCanvas.getContext('2d');
  scratchCanvas.width = bounds.width * ratio;
  scratchCanvas.height = bounds.height * ratio;
  context.scale(ratio, ratio);
  const cover = context.createLinearGradient(0, 0, bounds.width, bounds.height);
  cover.addColorStop(0, '#ff9bc8');
  cover.addColorStop(1, '#ffc8de');
  context.fillStyle = cover;
  context.fillRect(0, 0, bounds.width, bounds.height);
  context.fillStyle = '#8f3561';
  context.font = '600 17px Poppins, sans-serif';
  context.textAlign = 'center';
  context.fillText('Scratch me! ✨', bounds.width / 2, bounds.height / 2);
  let scratching = false;
  let strokes = 0;
  const scratchAt = (event) => {
    const rect = scratchCanvas.getBoundingClientRect();
    context.globalCompositeOperation = 'destination-out';
    context.beginPath();
    context.arc(event.clientX - rect.left, event.clientY - rect.top, 24, 0, Math.PI * 2);
    context.fill();
    strokes++;
    if (strokes % 8 === 0) {
      const pixels = context.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height).data;
      let clear = 0;
      let samples = 0;
      for (let i = 3; i < pixels.length; i += 64) {
        samples++;
        if (pixels[i] < 30) clear++;
      }
      if (clear / samples > 0.35) {
        scratchCanvas.classList.add('done');
        document.getElementById('scratchHint').textContent = 'Tumhari hansi sabko khush kar deti hai 🌷';
        confetti(35);
        unlockNext();
      }
    }
  };
  scratchCanvas.addEventListener('pointerdown', (event) => {
    scratching = true;
    scratchCanvas.setPointerCapture(event.pointerId);
    scratchAt(event);
  });
  scratchCanvas.addEventListener('pointermove', (event) => {
    if (scratching) scratchAt(event);
  });
  scratchCanvas.addEventListener('pointerup', () => { scratching = false; });
  scratchCanvas.addEventListener('pointercancel', () => { scratching = false; });
}

// ---------- Page 4: turn over every compliment card ----------
const flipGrid = document.getElementById('flipGrid');
if (flipGrid) {
  const flipped = new Set();
  flipGrid.querySelectorAll('.flip').forEach((card, index) => {
    card.addEventListener('click', () => {
      if (flipped.has(index)) return;
      flipped.add(index);
      card.classList.add('on');
      document.getElementById('flipHint').textContent = `Baaki cards palto: ${flipped.size} / 4`;
      if (flipped.size === 4) {
        confetti(35);
        unlockNext();
      }
    });
  });
}

// ---------- Page 5: playful best-friend question ----------
const yesButton = document.getElementById('yes');
if (yesButton) {
  const noButton = document.getElementById('no');
  const moveNo = () => {
    const area = noButton.parentElement;
    const maxX = Math.max(0, area.clientWidth - noButton.offsetWidth);
    const maxY = Math.max(0, area.clientHeight - noButton.offsetHeight);
    noButton.style.left = rand(0, maxX) + 'px';
    noButton.style.top = rand(0, maxY) + 'px';
  };
  noButton.addEventListener('pointerenter', moveNo);
  noButton.addEventListener('click', moveNo);
  yesButton.addEventListener('click', () => {
    document.getElementById('answerMessage').classList.remove('hidden');
    yesButton.disabled = true;
    noButton.classList.add('hidden');
    confetti(50);
    unlockNext();
  });
}

// ---------- Page 6: fill the virtual hug meter ----------
const hugButton = document.getElementById('hugButton');
if (hugButton) {
  const fill = document.getElementById('hugFill');
  const meter = fill.parentElement;
  const label = document.getElementById('hugPercent');
  let amount = 0;
  let hugTimer;
  const updateHug = (step) => {
    amount = Math.min(100, amount + step);
    fill.style.width = amount + '%';
    meter.setAttribute('aria-valuenow', amount);
    label.textContent = amount + '% hugs';
    if (amount === 100) {
      clearInterval(hugTimer);
      document.getElementById('hugHint').textContent = 'Hug pohanch gaya! 🤗';
      hugButton.disabled = true;
      confetti(45);
      unlockNext();
    }
  };
  hugButton.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    updateHug(5);
    hugTimer = setInterval(() => updateHug(5), 100);
  });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach((name) => {
    hugButton.addEventListener(name, () => clearInterval(hugTimer));
  });
  hugButton.addEventListener('click', (event) => {
    if (event.detail === 0) updateHug(12);
  });
}

// ---------- Page 7: collect four wishes ----------
const wishSky = document.getElementById('wishSky');
if (wishSky) {
  let wishesFound = 0;
  wishSky.querySelectorAll('.star-btn').forEach((star) => {
    star.addEventListener('click', () => {
      if (star.classList.contains('used')) return;
      star.classList.add('used');
      star.disabled = true;
      const wish = document.createElement('li');
      wish.textContent = star.dataset.wish;
      document.getElementById('wishes').appendChild(wish);
      wishesFound++;
      if (wishesFound === 4) {
        confetti(40);
        unlockNext();
      }
    });
  });
}

// ---------- Page 8: pop five balloons for the final note ----------
const balloonArea = document.getElementById('balloonArea');
if (balloonArea) {
  let popped = 0;
  let balloonTimer;
  const spawnBalloon = () => {
    if (popped >= 5) return;
    const balloon = document.createElement('button');
    balloon.type = 'button';
    balloon.className = 'game-balloon';
    balloon.textContent = pick(['🎈', '💗', '🎁']);
    balloon.setAttribute('aria-label', 'Pop balloon');
    balloon.style.left = rand(5, 84) + '%';
    balloon.style.top = rand(8, 66) + '%';
    balloon.addEventListener('click', () => {
      balloon.remove();
      popped++;
      document.getElementById('balloonScore').textContent = popped;
      sparkleBurst(window.innerWidth / 2, window.innerHeight / 2, 9);
      if (popped === 5) {
        clearInterval(balloonTimer);
        document.getElementById('finalMessage').classList.remove('hidden');
        confetti(65);
        unlockNext();
      }
    });
    balloonArea.appendChild(balloon);
  };
  balloonTimer = setInterval(spawnBalloon, 700);
  spawnBalloon();
}

// ---------- Music: start once, then resume the same track on every page ----------
(function () {
  const audio = new Audio('music.mp3');
  audio.loop = true;
  audio.preload = 'auto';

  const btn = document.createElement('button');
  btn.className = 'music-btn';
  btn.type = 'button';
  btn.textContent = '🔇';
  btn.setAttribute('aria-label', 'Play music');
  btn.title = 'Play music';
  document.body.appendChild(btn);

  let restored = false;
  const started = () => ss.get('musicStarted') === 'yes' || ss.get('music') === 'on';
  const wantsMusic = () => ss.get('music') !== 'off';
  const savePosition = () => {
    if (Number.isFinite(audio.currentTime) && audio.currentTime > 0) {
      ss.set('musicTime', String(audio.currentTime));
    }
  };
  const updateButton = () => {
    const playing = !audio.paused;
    btn.textContent = playing ? '🎵' : '🔇';
    btn.setAttribute('aria-label', playing ? 'Pause music' : 'Play music');
    btn.title = playing ? 'Pause music' : 'Play music';
  };
  const restorePosition = () => {
    if (restored || !Number.isFinite(audio.duration) || audio.duration <= 0) return;
    const savedTime = parseFloat(ss.get('musicTime') || '0');
    if (Number.isFinite(savedTime) && savedTime > 0) {
      try { audio.currentTime = savedTime % audio.duration; } catch (error) {}
    }
    restored = true;
  };
  const playMusic = () => {
    if (!audio.src || audio.error) return;
    restorePosition();
    audio.play().then(updateButton).catch(updateButton);
  };

  audio.addEventListener('loadedmetadata', () => {
    restorePosition();
    if (started() && wantsMusic()) playMusic();
  });
  audio.addEventListener('timeupdate', savePosition);
  audio.addEventListener('play', updateButton);
  audio.addEventListener('pause', updateButton);
  audio.addEventListener('error', () => {
    btn.title = 'Add music.mp3 to this folder to play music';
    btn.setAttribute('aria-label', 'Add music.mp3 to this folder to play music');
  });
  window.addEventListener('pagehide', savePosition);
  window.addEventListener('beforeunload', savePosition);

  document.addEventListener('pointerdown', (event) => {
    if (event.target.closest('.music-btn')) return;
    if (!started() && document.body.dataset.page === '1') {
      ss.set('musicStarted', 'yes');
      ss.set('music', 'on');
      playMusic();
    } else if (started() && wantsMusic() && audio.paused) {
      playMusic();
    }
  });

  btn.addEventListener('click', (event) => {
    event.stopPropagation();
    if (audio.paused) {
      ss.set('musicStarted', 'yes');
      ss.set('music', 'on');
      playMusic();
    } else {
      savePosition();
      audio.pause();
      ss.set('music', 'off');
    }
  });
})();
