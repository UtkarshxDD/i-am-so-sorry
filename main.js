/* ═══════════════════════════════════════════════
   I'M SORRY WEBSITE — main.js
   For Anshula (Bebu) 💕
═══════════════════════════════════════════════ */

// ══════════════════════════════════════════════
//   LOVE SONG PLAYER
// ══════════════════════════════════════════════
const loveSong        = document.getElementById('loveSong');
const playerFloat     = document.getElementById('musicPlayerFloat');
const playPauseBtn    = document.getElementById('musicPlayPause');
const vinylEl         = document.getElementById('vinyl');
let   songStarted     = false;
let   collapseTimer   = null;

loveSong.volume = 0.35; // soft ambient start

// ── Expand / collapse ─────────────────────────
function expandPlayer() {
    playerFloat.classList.add('expanded');
    clearTimeout(collapseTimer);
    collapseTimer = setTimeout(collapsePlayer, 5000); // auto-collapse after 5s
}

function collapsePlayer() {
    playerFloat.classList.remove('expanded');
    clearTimeout(collapseTimer);
}

// Tap collapsed disc → expand; tap elsewhere when expanded → collapse
playerFloat.addEventListener('click', (e) => {
    if (!playerFloat.classList.contains('expanded')) {
        expandPlayer();
    }
});

// Keep expanded if user interacts with it
playerFloat.addEventListener('mouseenter', () => {
    if (playerFloat.classList.contains('expanded')) {
        clearTimeout(collapseTimer);
    }
});
playerFloat.addEventListener('mouseleave', () => {
    if (playerFloat.classList.contains('expanded')) {
        collapseTimer = setTimeout(collapsePlayer, 3000);
    }
});

function startSong() {
    if (songStarted) return;
    songStarted = true;
    loveSong.play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
}

function setPlaying(isPlaying) {
    if (isPlaying) {
        playerFloat.classList.add('playing');
        playPauseBtn.textContent = '⏸';
    } else {
        playerFloat.classList.remove('playing');
        playPauseBtn.textContent = '▶';
    }
}

// Play/Pause toggle — stop propagation so it doesn't trigger expand/collapse
playPauseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (loveSong.paused) {
        loveSong.play().then(() => setPlaying(true));
        songStarted = true;
    } else {
        loveSong.pause();
        setPlaying(false);
    }
    // Reset collapse timer
    clearTimeout(collapseTimer);
    collapseTimer = setTimeout(collapsePlayer, 5000);
});

// Auto-start on first user gesture anywhere
function onFirstTouch() {
    startSong();
    document.removeEventListener('click',      onFirstTouch);
    document.removeEventListener('touchstart', onFirstTouch);
}
document.addEventListener('click',      onFirstTouch);
document.addEventListener('touchstart', onFirstTouch, { passive: true });

// Volume swell: quiet during sorry pages, full on happy ending
function setSongVolume(vol, durationMs) {
    const steps = 30;
    const start = loveSong.volume;
    const diff  = vol - start;
    const stepMs = durationMs / steps;
    let step = 0;
    const iv = setInterval(() => {
        step++;
        loveSong.volume = Math.min(1, Math.max(0, start + diff * (step / steps)));
        if (step >= steps) clearInterval(iv);
    }, stepMs);
}

// ── Page Management ─────────────────────────────
function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById(id);
    if (target) {
        target.classList.add('active');
        window.scrollTo(0, 0);
    }
}

// ── Floating Hearts ──────────────────────────────
const heartsBg = document.getElementById('heartsBg');
const heartEmojis = ['❤️', '💕', '💗', '💖', '💝', '🌸', '✨', '💞', '🩷', '💓', '🫶', '💘'];

function spawnHeart() {
    const el = document.createElement('span');
    el.className = 'f-heart';
    el.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    const dur = 7 + Math.random() * 8;
    const delay = Math.random() * 3;
    el.style.cssText = `
        left: ${Math.random() * 100}%;
        font-size: ${0.8 + Math.random() * 1.3}rem;
        animation-duration: ${dur}s;
        animation-delay: ${delay}s;
    `;
    heartsBg.appendChild(el);
    setTimeout(() => el.remove(), (dur + delay) * 1000);
}

setInterval(spawnHeart, 550);
for (let i = 0; i < 8; i++) setTimeout(spawnHeart, i * 120);

// ── Petal Rain ───────────────────────────────────
const petalsBg = document.getElementById('petalsBg');
const petalColors = [
    'rgba(255,180,200,0.55)', 'rgba(255,150,180,0.5)',
    'rgba(255,130,170,0.45)', 'rgba(255,200,220,0.4)',
    'rgba(200,100,160,0.5)',  'rgba(255,100,150,0.45)'
];

function spawnPetal() {
    const el = document.createElement('div');
    el.className = 'petal';
    const dur = 8 + Math.random() * 10;
    const delay = Math.random() * 4;
    const size = 8 + Math.random() * 10;
    el.style.cssText = `
        left: ${Math.random() * 100}%;
        width: ${size}px; height: ${size * 1.3}px;
        background: ${petalColors[Math.floor(Math.random() * petalColors.length)]};
        animation-duration: ${dur}s;
        animation-delay: ${delay}s;
        transform: rotate(${Math.random() * 360}deg);
    `;
    petalsBg.appendChild(el);
    setTimeout(() => el.remove(), (dur + delay) * 1000);
}

setInterval(spawnPetal, 700);
for (let i = 0; i < 5; i++) setTimeout(spawnPetal, i * 200);

// ── Sparkles on Click / Touch ────────────────────
const sparklePool = ['✨', '💖', '🌸', '⭐', '💫', '🌟'];

function createSparkle(x, y) {
    for (let i = 0; i < 3; i++) {
        const sp = document.createElement('span');
        sp.className = 'sparkle';
        sp.textContent = sparklePool[Math.floor(Math.random() * sparklePool.length)];
        sp.style.cssText = `
            left: ${x + (Math.random() - 0.5) * 44}px;
            top:  ${y + (Math.random() - 0.5) * 44}px;
            animation-delay: ${i * 0.08}s;
        `;
        document.body.appendChild(sp);
        setTimeout(() => sp.remove(), 800);
    }
}

document.addEventListener('click',      e => createSparkle(e.clientX, e.clientY));
document.addEventListener('touchstart', e => {
    const t = e.touches[0];
    createSparkle(t.clientX, t.clientY);
}, { passive: true });

// ── Confetti ─────────────────────────────────────
const confettiColors = [
    '#ff4d85','#ff85b3','#ffb3cc','#ff1f6b',
    '#fff0f5','#ffd6e7','#ffe4f0','#c56bff','#85c8ff'
];

function launchConfetti(count = 80) {
    for (let i = 0; i < count; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        const isCircle = Math.random() > 0.5;
        const w = 6 + Math.random() * 9;
        piece.style.cssText = `
            left: ${Math.random() * 100}vw;
            background: ${confettiColors[Math.floor(Math.random() * confettiColors.length)]};
            width: ${w}px; height: ${isCircle ? w : 4 + Math.random() * 6}px;
            border-radius: ${isCircle ? '50%' : '2px'};
            animation-duration: ${1.5 + Math.random() * 2.5}s;
            animation-delay: ${Math.random() * 0.8}s;
        `;
        document.body.appendChild(piece);
        setTimeout(() => piece.remove(), 5000);
    }
}

// ══════════════════════════════════════════════
//   PAGE 1 — LANDING BUTTONS
// ══════════════════════════════════════════════
const btnListen  = document.getElementById('btnListen');
const btnNotNow  = document.getElementById('btnNotNow');

btnListen.addEventListener('click', () => {
    showPage('page2');
    initCards();
});

let notNowCount = 0;
const notNowTexts = [
    'Please 🥺', 'Ek minute...', 'Bas sun lo 🙏',
    'Pretty please?', 'Main ro dunga 😭'
];
btnNotNow.addEventListener('click', () => {
    notNowCount++;
    if (notNowCount < notNowTexts.length) {
        btnNotNow.textContent = notNowTexts[notNowCount - 1];
        btnNotNow.style.transform = 'scale(0.92)';
        setTimeout(() => btnNotNow.style.transform = '', 200);
    } else {
        showPage('page2');
        initCards();
    }
});

// ══════════════════════════════════════════════
//   PAGE 2 — FLIP CARDS
// ══════════════════════════════════════════════
const totalCards = 4;
let currentCard  = 1;
let cardsInited  = false;

function initCards() {
    if (cardsInited) return;
    cardsInited = true;
    showCardIndex(1);

    // Tap to flip
    for (let i = 1; i <= totalCards; i++) {
        document.getElementById(`card${i}`).addEventListener('click', function () {
            this.classList.toggle('flipped');
        });
    }
}

function showCardIndex(n) {
    for (let i = 1; i <= totalCards; i++) {
        const c = document.getElementById(`card${i}`);
        const d = document.getElementById(`dot${i}`);
        c.classList.toggle('visible', i === n);
        d.classList.toggle('active', i === n);
        if (i !== n) c.classList.remove('flipped');
    }
    document.getElementById('cardCounter').textContent = `${n} / ${totalCards}`;
    currentCard = n;
}

document.getElementById('btnNextCard').addEventListener('click', () => {
    const next = currentCard < totalCards ? currentCard + 1 : 1;
    showCardIndex(next);
});

document.getElementById('btnPrevCard').addEventListener('click', () => {
    const prev = currentCard > 1 ? currentCard - 1 : totalCards;
    showCardIndex(prev);
});

for (let i = 1; i <= totalCards; i++) {
    document.getElementById(`dot${i}`).addEventListener('click', () => showCardIndex(i));
}

document.getElementById('btnAfterCards').addEventListener('click', () => showPage('page3'));

// ══════════════════════════════════════════════
//   PAGE 3 — LETTER
// ══════════════════════════════════════════════
document.getElementById('btnAfterLetter').addEventListener('click', () => showPage('page4'));

// ══════════════════════════════════════════════
//   PAGE 4 — THE QUESTION
// ══════════════════════════════════════════════
document.getElementById('btnYesForgive').addEventListener('click', () => {
    launchConfetti(100);
    showPage('page7');
});

document.getElementById('btnNoForgive').addEventListener('click', () => {
    showPage('page5');
    initShrinkNo();
});

// ══════════════════════════════════════════════
//   PAGE 5 — PLEAD MORE + SHRINKING NO
// ══════════════════════════════════════════════
let shrinkLevel = 0;
function initShrinkNo() {
    shrinkLevel = 0;
    const btn = document.getElementById('btnNo2');
    btn.style.transform = '';
    btn.style.opacity = '';
    btn.style.fontSize = '';
    btn.style.padding = '';
}

document.getElementById('btnYes2').addEventListener('click', () => {
    launchConfetti(100);
    setSongVolume(0.85, 2000);
    showPage('page7');
});

document.getElementById('btnNo2').addEventListener('click', function () {
    shrinkLevel++;
    const scale = Math.max(0.3, 1 - shrinkLevel * 0.18);
    const opacity = Math.max(0.15, 1 - shrinkLevel * 0.22);
    this.style.transform = `scale(${scale})`;
    this.style.opacity = opacity;
    if (shrinkLevel >= 4) {
        showPage('page6');
        setTimeout(initRunaway, 120);
    }
});

// ══════════════════════════════════════════════
//   PAGE 6 — RUNAWAY BUTTON
// ══════════════════════════════════════════════
const runawayState = {};
const activeRunaways = new Set();

function getVP() {
    const sources = [
        { w: document.documentElement.clientWidth, h: document.documentElement.clientHeight },
        { w: window.innerWidth, h: window.innerHeight }
    ];
    if (window.visualViewport) sources.push({ w: window.visualViewport.width, h: window.visualViewport.height });
    return { w: Math.min(...sources.map(s => s.w)), h: Math.min(...sources.map(s => s.h)) };
}

function initRunaway() {
    const btnId = 'btnRunaway';
    const btn   = document.getElementById(btnId);
    if (!btn) return;

    // Reset
    runawayState[btnId + '_fixed']  = false;
    runawayState[btnId + '_wired']  = false;
    runawayState[btnId + '_cd']     = false;
    btn.className = 'btn btn-runaway-base';
    btn.style.cssText = '';

    if (runawayState[btnId + '_wired']) return;
    runawayState[btnId + '_wired'] = true;

    btn.addEventListener('mouseover', () => activateRunaway(btnId));
    btn.addEventListener('touchstart', e => {
        e.preventDefault();
        activateRunaway(btnId);
    }, { passive: false });
    btn.addEventListener('click', e => { e.stopPropagation(); activateRunaway(btnId); });
}

function activateRunaway(btnId) {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    if (!runawayState[btnId + '_fixed']) {
        const r = btn.getBoundingClientRect();
        btn.style.left  = r.left  + 'px';
        btn.style.top   = r.top   + 'px';
        btn.style.width = r.width + 'px';
        btn.classList.add('btn-runaway');
        runawayState[btnId + '_fixed'] = true;
        activeRunaways.add(btnId);
    }
    moveRunaway(btnId);
}

function moveRunaway(btnId) {
    if (runawayState[btnId + '_cd']) return;
    runawayState[btnId + '_cd'] = true;
    const btn  = document.getElementById(btnId);
    if (!btn) return;
    const vp   = getVP();
    const bW   = btn.offsetWidth  || 100;
    const bH   = btn.offsetHeight || 44;
    const mg   = 48;
    const newX = mg + Math.random() * Math.max(0, vp.w - bW - mg * 2);
    const newY = mg + Math.random() * Math.max(0, vp.h - bH - mg * 2);
    btn.style.left = newX + 'px';
    btn.style.top  = newY + 'px';
    setTimeout(() => { runawayState[btnId + '_cd'] = false; }, 200);
}

function clampRunaways() {
    const vp = getVP();
    activeRunaways.forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (!btn || !runawayState[btnId + '_fixed']) return;
        const bW = btn.offsetWidth  || 100;
        const bH = btn.offsetHeight || 44;
        const mg = 48;
        let x = parseInt(btn.style.left) || 0;
        let y = parseInt(btn.style.top)  || 0;
        if (x < mg || x > vp.w - bW - mg || y < mg || y > vp.h - bH - mg) {
            btn.style.left = Math.min(Math.max(x, mg), vp.w - bW - mg) + 'px';
            btn.style.top  = Math.min(Math.max(y, mg), vp.h - bH - mg) + 'px';
        }
    });
}

window.addEventListener('resize', clampRunaways);
window.addEventListener('orientationchange', () => setTimeout(clampRunaways, 300));
if (window.visualViewport) window.visualViewport.addEventListener('resize', clampRunaways);
setInterval(clampRunaways, 500);

document.getElementById('btnYes3').addEventListener('click', () => {
    // De-activate runaway
    const btn = document.getElementById('btnRunaway');
    if (btn) { btn.classList.remove('btn-runaway'); btn.style.cssText = ''; }
    activeRunaways.delete('btnRunaway');
    launchConfetti(120);
    setSongVolume(0.85, 2000);
    showPage('page7');
});

// ══════════════════════════════════════════════
//   PAGE 7 — CELEBRATION extras
// ══════════════════════════════════════════════
// Observe when page7 becomes active — confetti bursts + volume swell
const observer = new MutationObserver(() => {
    if (document.getElementById('page7').classList.contains('active')) {
        // Swell volume to full
        setSongVolume(0.85, 2000);
        // Multiple confetti bursts
        let n = 0;
        const burst = setInterval(() => {
            launchConfetti(40);
            if (++n >= 4) clearInterval(burst);
        }, 800);
    }
});
observer.observe(document.getElementById('page7'), { attributeFilter: ['class'] });

// ══════════════════════════════════════════════
//   PRETTIEST GIRL — SELFIE CAMERA 📸
// ══════════════════════════════════════════════
const btnPrettiest  = document.getElementById('btnPrettiest');
const cameraReveal  = document.getElementById('cameraReveal');
const prettiestTease = document.getElementById('prettiestTease');
const selfieVideo   = document.getElementById('selfieVideo');
const btnCloseCam   = document.getElementById('btnCloseCam');
let   camStream     = null;

btnPrettiest.addEventListener('click', async () => {
    // Hide teaser, show camera section
    prettiestTease.style.display = 'none';
    cameraReveal.style.display = 'flex';

    // Scroll down so camera is visible
    cameraReveal.scrollIntoView({ behavior: 'smooth', block: 'center' });

    try {
        // Request front-facing camera
        camStream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'user',   // front camera
                width:  { ideal: 720 },
                height: { ideal: 1280 }
            },
            audio: false
        });

        selfieVideo.srcObject = camStream;

        // Sprinkle some extra sparkles as a celebration
        setTimeout(() => {
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    const x = Math.random() * window.innerWidth;
                    const y = Math.random() * window.innerHeight * 0.5 + window.innerHeight * 0.25;
                    createSparkle(x, y);
                }, i * 200);
            }
        }, 600);

    } catch (err) {
        // Permission denied or no camera — show a sweet fallback
        selfieVideo.style.display = 'none';
        const fallback = document.createElement('div');
        fallback.style.cssText = `
            width: 100%; height: 100%;
            display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            gap: 12px; padding: 20px; text-align: center;
            background: linear-gradient(145deg, #2a0020, #5a0040);
        `;
        fallback.innerHTML = `
            <div style="font-size:3rem">🪴</div>
            <p style="font-family:'Dancing Script',cursive; font-size:1.5rem; color:#fff; text-shadow:0 0 16px rgba(255,130,170,0.6);">
                Ek kaam karo —<br>Sheeshe mein dekho!
            </p>
            <p style="font-size:0.85rem; color:rgba(255,200,220,0.85); font-weight:600; line-height:1.6;">
                Jo dikhe,<br>
                <strong style="color:#ffb3cc">wahi hai duniya ki<br>sabse khoobsurat ladki!</strong> 🌸❤️
            </p>
        `;
        document.querySelector('.camera-frame').prepend(fallback);
    }
});

// Close camera — stop the stream and reset
btnCloseCam.addEventListener('click', () => {
    if (camStream) {
        camStream.getTracks().forEach(t => t.stop());
        camStream = null;
        selfieVideo.srcObject = null;
    }
    cameraReveal.style.display = 'none';
    prettiestTease.style.display = 'flex';
    // Restore video display in case it was hidden
    selfieVideo.style.display = 'block';
});

