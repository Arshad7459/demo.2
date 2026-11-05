/* Intro: Turn On Lights → Play Music → Let's Decorate → Fly With Balloons → Open Surprise
   After the last button the original Shinchan experience (midnight countdown → passcode → gifts) starts. */
(function () {
  const stage = document.getElementById('intro-stage');
  if (!stage) { if (window.startMainExperience) window.startMainExperience(); return; }

  const $ = id => document.getElementById(id);
  const song = $('intro-song');
  const soundBtn = $('sound-toggle');
  const banner = $('intro-banner');
  const balloons = Array.from(stage.querySelectorAll('.intro-balloon'));
  const bulbs = Array.from(stage.querySelectorAll('.intro-bulb'));
  let driftTimer = null;

  // Show a button (hiding the previous one) after an optional delay
  function showBtn(id, delay) {
    setTimeout(() => $(id).classList.add('show'), delay || 0);
  }
  function hideBtn(id) { $(id).classList.remove('show'); }

  // 1) Lights
  $('btn-lights').addEventListener('click', () => {
    hideBtn('btn-lights');
    stage.classList.add('lit');
    bulbs.forEach((b, i) => { b.style.setProperty('--d', (i * 0.25) + 's'); b.classList.add('on'); });
    showBtn('btn-music', 3200);
  });

  // 2) Music
  $('btn-music').addEventListener('click', () => {
    hideBtn('btn-music');
    stage.classList.add('music');
    if (song) {
      song.volume = 0.7;
      const p = song.play();
      if (p && p.catch) p.catch(() => {});
      soundBtn.classList.add('show');
    }
    showBtn('btn-decorate', 3000);
  });

  // 3) Decorate (banner drops down)
  $('btn-decorate').addEventListener('click', () => {
    hideBtn('btn-decorate');
    banner.classList.add('come');
    showBtn('btn-balloons', 3500);
  });

  // 4) Balloons fly
  function drift(first) {
    const w = window.innerWidth, h = window.innerHeight;
    balloons.forEach(b => {
      const bw = b.offsetWidth || 80, bh = b.offsetHeight || 150;
      const left = Math.random() * (w - bw);
      const bottom = first ? Math.random() * (h * 0.55) + h * 0.12 : Math.random() * (h - bh - 120) + 20;
      b.style.left = left + 'px';
      b.style.bottom = bottom + 'px';
    });
  }
  $('btn-balloons').addEventListener('click', () => {
    hideBtn('btn-balloons');
    balloons.forEach((b, i) => {
      b.style.left = ((i + 0.5) / balloons.length) * window.innerWidth - 40 + 'px';
      b.style.setProperty('--sw', (2.8 + Math.random() * 2) + 's');
      b.style.transitionDuration = (6 + Math.random() * 3) + 's';
    });
    requestAnimationFrame(() => requestAnimationFrame(() => drift(true)));
    driftTimer = setInterval(() => drift(false), 8000);
    showBtn('btn-open', 4500);
  });

  // 5) Hand over to the Shinchan surprise
  $('btn-open').addEventListener('click', () => {
    hideBtn('btn-open');
    stage.classList.add('leaving');
    clearInterval(driftTimer);
    setTimeout(() => {
      stage.style.display = 'none';
      if (window.startMainExperience) window.startMainExperience();
    }, 1300);
  });

  // Mute / unmute (stays visible during the whole experience)
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      song.muted = !song.muted;
      soundBtn.textContent = song.muted ? '🔇' : '🔊';
    });
  }

  showBtn('btn-lights', 600);
})();
