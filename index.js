const bgMusic = document.getElementById('bgMusic');
  bgMusic.volume = 0.3; // Adjust volume
  
  // Play on any user interaction
  ['click', 'touchstart', 'scroll'].forEach(event => {
    document.addEventListener(event, function playMusic() {
      bgMusic.play();
      // Remove after first play
      ['click', 'touchstart', 'scroll'].forEach(e => {
        document.removeEventListener(e, playMusic);
      });
    }, { once: true });
  });
// Splash Screen Logic
const splashScreen = document.getElementById('splashScreen');
const mainContent = document.getElementById('mainContent');
const heartButton = document.getElementById('heartButton');

function openInvitation() {
  splashScreen.classList.add('fade-out');
  mainContent.classList.add('visible');
  setTimeout(() => { splashScreen.style.display = 'none'; }, 1000);
  setTimeout(() => { startConfetti(3000); }, 500);
}

if (heartButton) {
  heartButton.addEventListener('click', (e) => {
    e.stopPropagation();
    openInvitation();
  });
}

document.querySelector('.envelope')?.addEventListener('click', (e) => {
  e.stopPropagation();
  openInvitation();
});


// Optimized parallax with mobile zoom
(function() {
  let ticking = false;
  let lastScrollY = 0;
  
  function updateVideo() {
    const video = document.querySelector('.hero-video');
    if (!video) return;
    
    const scrolled = window.pageYOffset;
    const width = window.innerWidth;
    
    // Responsive settings
    let rate, zoomScale;
    if (width <= 480) {
      rate = 0.6;
      zoomScale = 1.2;
    } else if (width <= 768) {
      rate = 0.5;
      zoomScale = 1.12;
    } else {
      rate = 0.3;
      zoomScale = 1.05;
    }
    
    // Apply transform with smooth transition
    video.style.transform = `translateY(${scrolled * rate}px) scale(${zoomScale})`;
    lastScrollY = scrolled;
  }
  
  // Throttled scroll listener
  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        updateVideo();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
  
  // Update on resize
  let resizeTimeout;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(updateVideo, 200);
  });
  
  // Initial call
  setTimeout(updateVideo, 100);
})();

// Main Website Logic
(function() {
  const TARGET_DATE = new Date(2026, 10, 16, 19, 0, 0);
  const GOOGLE_SHEETS_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbw9qptv6ArMZgC4vKleasxuG9kiT_8m_bYGylk5joKgNsaBAoKGXqDt2uBa8FBpD_bi/exec";

  // Countdown
  const daysSpan = document.getElementById('days');
  const hoursSpan = document.getElementById('hours');
  const minutesSpan = document.getElementById('minutes');
  const secondsSpan = document.getElementById('seconds');

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = TARGET_DATE.getTime() - now;
    if (distance < 0) {
      daysSpan.innerText = '0'; hoursSpan.innerText = '0'; minutesSpan.innerText = '0'; secondsSpan.innerText = '0';
      if (window.countdownInterval) clearInterval(window.countdownInterval);
      return;
    }
    daysSpan.innerText = Math.floor(distance / (1000 * 60 * 60 * 24));
    hoursSpan.innerText = Math.floor((distance % 86400000) / 3600000);
    minutesSpan.innerText = Math.floor((distance % 3600000) / 60000);
    secondsSpan.innerText = Math.floor((distance % 60000) / 1000);
  }
  updateCountdown();
  window.countdownInterval = setInterval(updateCountdown, 1000);

  // Confetti
  function startConfetti(duration) {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed'; canvas.style.top = '0'; canvas.style.left = '0';
    canvas.style.width = '100%'; canvas.style.height = '100%'; canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    let particles = [];
    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 8 + 4, speedY: Math.random() * 5 + 3, speedX: Math.random() * 2 - 1,
        color: `hsl(${Math.random() * 60 + 20}, 70%, 60%)`
      });
    }
    let startTime = Date.now();
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let allDead = true;
      for (let p of particles) {
        p.y += p.speedY; p.x += p.speedX;
        if (p.y < canvas.height + 50) {
          allDead = false;
          ctx.fillStyle = p.color;
          ctx.fillRect(p.x, p.y, p.size, p.size);
        }
      }
      if (!allDead && Date.now() - startTime < duration) requestAnimationFrame(animate);
      else canvas.remove();
    }
    animate();
  }

  document.getElementById('celebrateBtn')?.addEventListener('click', () => {
    startConfetti(2500);
    alert("🎉 Thank you for celebrating with us! 🎉");
  });

})();