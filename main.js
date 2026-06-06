/* ===================================================
   BIRTHDAY WEBSITE - main.js
   🎂 Happy Birthday Celebration! 🎉
=================================================== */

// ── DOM References ──────────────────────────────
const emojisContainer = document.getElementById('emojisContainer');
const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');

// ── Canvas Setup ────────────────────────────────
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// ── Fireworks System ────────────────────────────
class Particle {
    constructor(x, y, color, velocity, decay, gravity) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1;
        this.decay = decay || 0.015;
        this.gravity = gravity || 0.02;
        this.size = Math.random() * 2 + 1;
    }
    
    update() {
        this.velocity.x *= 0.99;
        this.velocity.y *= 0.99;
        this.velocity.y += this.gravity;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= this.decay;
    }
    
    draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(this.alpha, 0);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }
}

let particles = [];
let fireworksActive = false;

function createFirework(x, y) {
    const colors = ['#ff6b6b', '#ffd700', '#6bffa1', '#6bd4ff', '#c56bff', '#ff6b9d',
                    '#ff9800', '#e91e63', '#00e5ff', '#76ff03', '#ffab40'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const particleCount = 60 + Math.floor(Math.random() * 40);
    
    for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount;
        const speed = 2 + Math.random() * 4;
        particles.push(new Particle(
            x, y, color,
            { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed },
            0.01 + Math.random() * 0.015,
            0.015
        ));
    }
}

function animateFireworks() {
    if (!fireworksActive && particles.length === 0) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles = particles.filter(p => p.alpha > 0);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    
    requestAnimationFrame(animateFireworks);
}

function launchFireworksShow(duration) {
    fireworksActive = true;
    animateFireworks();
    
    const interval = setInterval(() => {
        const x = Math.random() * canvas.width * 0.8 + canvas.width * 0.1;
        const y = Math.random() * canvas.height * 0.5 + canvas.height * 0.1;
        createFirework(x, y);
    }, 300);
    
    setTimeout(() => {
        clearInterval(interval);
        fireworksActive = false;
    }, duration);
}

// ── Floating Emojis Setup ───────────────────────
const birthdayEmojis = ['🎂', '🎉', '🎈', '🎁', '🥳', '🎊', '✨', '⭐', '🌟', '🎀', '💫', '🍰', '🧁'];

function createFloatingEmoji() {
    const emoji = document.createElement('span');
    emoji.classList.add('floating-emoji');
    emoji.textContent = birthdayEmojis[Math.floor(Math.random() * birthdayEmojis.length)];

    const left = Math.random() * 100;
    const duration = 6 + Math.random() * 8;
    const size = 0.9 + Math.random() * 1.5;
    const delay = Math.random() * 3;

    emoji.style.cssText = `
        left: ${left}%;
        font-size: ${size}rem;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
    `;

    emojisContainer.appendChild(emoji);
    setTimeout(() => emoji.remove(), (duration + delay) * 1000);
}

// Spawn emojis continuously
setInterval(createFloatingEmoji, 500);
// Initial burst
for (let i = 0; i < 10; i++) {
    setTimeout(createFloatingEmoji, i * 80);
}

// ── Sparkle on Click & Touch ────────────────────
document.addEventListener('click', (e) => {
    createSparkle(e.clientX, e.clientY);
});
document.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    createSparkle(t.clientX, t.clientY);
}, { passive: true });

function createSparkle(x, y) {
    const sparkles = ['✨', '🌟', '⭐', '💫', '🎉'];
    for (let i = 0; i < 3; i++) {
        const sparkle = document.createElement('span');
        sparkle.classList.add('sparkle');
        sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
        sparkle.style.cssText = `
            left: ${x + (Math.random() - 0.5) * 40}px;
            top: ${y + (Math.random() - 0.5) * 40}px;
            animation-delay: ${i * 0.1}s;
        `;
        document.body.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 900);
    }
}

// ── Confetti Burst ──────────────────────────────
function launchConfetti() {
    const colors = ['#ffd700', '#ff6b6b', '#6bffa1', '#6bd4ff', '#c56bff',
                    '#ff9800', '#e91e63', '#ff6b9d', '#00e5ff', '#ffab40'];
    for (let i = 0; i < 100; i++) {
        const piece = document.createElement('div');
        piece.classList.add('confetti-piece');
        
        const isCircle = Math.random() > 0.5;
        const width = 6 + Math.random() * 10;
        const height = isCircle ? width : 4 + Math.random() * 6;
        
        piece.style.cssText = `
            left: ${Math.random() * 100}vw;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            width: ${width}px;
            height: ${height}px;
            border-radius: ${isCircle ? '50%' : '2px'};
            animation-duration: ${1.5 + Math.random() * 2.5}s;
            animation-delay: ${Math.random() * 1}s;
        `;
        document.body.appendChild(piece);
        setTimeout(() => piece.remove(), 5000);
    }
}

// ── Stage Management ────────────────────────────
let currentStage = 0;

function goToStage(n) {
    const allStages = document.querySelectorAll('.stage');
    allStages.forEach(s => s.classList.remove('active'));
    const target = document.getElementById(`stage${n}`);
    if (target) {
        target.classList.add('active');
        // Re-trigger animation
        target.style.animation = 'none';
        target.offsetHeight; // reflow
        target.style.animation = '';
        currentStage = n;
        
        // Scroll the wrapper to top
        const wrapper = document.getElementById('birthdayWrapper');
        wrapper.scrollTop = 0;
    }
}

// ── Button Wiring ───────────────────────────────

// Stage 0: Open the surprise
document.getElementById('btnOpen').addEventListener('click', () => {
    launchConfetti();
    launchFireworksShow(3000);
    goToStage(1);
});

// Stage 1: "Aur sunao!"
document.getElementById('btnNext1').addEventListener('click', () => {
    goToStage(2);
});

// Stage 2: "Aur bhi hai!"
document.getElementById('btnNext2').addEventListener('click', () => {
    launchConfetti();
    goToStage(3);
});

// Stage 3: "Final Wish!"
document.getElementById('btnNext3').addEventListener('click', () => {
    launchConfetti();
    launchFireworksShow(6000);
    goToStage(4);
    playBirthdaySong();

    // Continuous celebration for the grand finale
    let celebrationCount = 0;
    const celebrationInterval = setInterval(() => {
        launchConfetti();
        celebrationCount++;
        if (celebrationCount >= 3) {
            clearInterval(celebrationInterval);
        }
    }, 2000);
});

// ── Birthday Song Control ───────────────────────
const birthdaySong = document.getElementById('birthdaySong');
const musicPlayer  = document.getElementById('musicPlayer');
const musicToggle  = document.getElementById('musicToggle');

function playBirthdaySong() {
    if (!birthdaySong) return;
    birthdaySong.currentTime = 0;
    birthdaySong.volume = 0.85;
    const playPromise = birthdaySong.play();
    if (playPromise !== undefined) {
        playPromise
            .then(() => {
                musicPlayer.classList.remove('paused');
                musicToggle.textContent = '⏸️';
            })
            .catch(() => {
                // Autoplay blocked — wait for user tap
                musicPlayer.classList.add('paused');
                musicToggle.textContent = '▶️';
            });
    }
}

musicToggle.addEventListener('click', () => {
    if (birthdaySong.paused) {
        birthdaySong.play();
        musicPlayer.classList.remove('paused');
        musicToggle.textContent = '⏸️';
    } else {
        birthdaySong.pause();
        musicPlayer.classList.add('paused');
        musicToggle.textContent = '▶️';
    }
});

// ── Birthday Song Text Animation (Grand Finale) ─
// Animate the cake emojis strip
function animateCakeStrip() {
    const cakeEl = document.querySelector('.cake-emojis');
    if (!cakeEl) return;
    
    const cakeEmojis = ['🎂', '🎈', '🎁', '🎊', '🎉', '🧁', '🍰', '🎀', '🥳', '🌟'];
    let index = 0;
    
    setInterval(() => {
        const chars = cakeEl.textContent.split('');
        const pos = index % chars.length;
        chars[pos] = cakeEmojis[Math.floor(Math.random() * cakeEmojis.length)];
        cakeEl.textContent = chars.join('');
        index++;
    }, 400);
}

animateCakeStrip();

// ── Initial Fireworks (subtle, on page load) ────
setTimeout(() => {
    createFirework(canvas.width * 0.3, canvas.height * 0.3);
    animateFireworks();
}, 500);
setTimeout(() => {
    createFirework(canvas.width * 0.7, canvas.height * 0.25);
}, 1200);
setTimeout(() => {
    createFirework(canvas.width * 0.5, canvas.height * 0.4);
}, 1800);
