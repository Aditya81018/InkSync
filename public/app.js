document.addEventListener('DOMContentLoaded', () => {

  // 1. Hamburger Menu Toggle for Mobile
  const hamburger = document.getElementById('hamburger-menu');
  const menuLinks = document.getElementById('menu-links');

  if (hamburger && menuLinks) {
    hamburger.addEventListener('click', () => {
      menuLinks.classList.toggle('mobile-open');
    });

    // Close mobile nav when clicking a link
    menuLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuLinks.classList.remove('mobile-open');
      });
    });
  }

  // 2. Scroll show/hide navbar behavior
  let lastScrollY = window.scrollY;
  const header = document.querySelector('.header');

  if (header) {
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      
      // Do not hide navbar if mobile dropdown menu is open
      if (menuLinks && menuLinks.classList.contains('mobile-open')) {
        lastScrollY = currentScrollY;
        return;
      }

      // Add a tolerance threshold of 5px to prevent micro-jitter
      if (Math.abs(currentScrollY - lastScrollY) < 5) {
        return;
      }

      if (currentScrollY <= 20) {
        header.classList.remove('header--hidden');
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down: hide
        header.classList.add('header--hidden');
      } else {
        // Scrolling up: show
        header.classList.remove('header--hidden');
      }
      lastScrollY = currentScrollY;
    });
  }

  // 3. Scroll Reveal Animation using IntersectionObserver
  const revealElements = document.querySelectorAll('.reveal');
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Reveal only once
      }
    });
  }, observerOptions);

  revealElements.forEach(el => revealObserver.observe(el));

  // 4. Interactive Mock PNG Export
  const downloadBtn = document.getElementById('btn-export-mock');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      // Create offscreen canvas
      const canvas = document.createElement('canvas');
      canvas.width = 500;
      canvas.height = 500;
      const ctx = canvas.getContext('2d');

      // Fill background (matches InkSync cream canvas)
      ctx.fillStyle = '#fffaf0';
      ctx.fillRect(0, 0, 500, 500);

      // Draw standard blueprint grid
      ctx.strokeStyle = '#ebe6d6';
      ctx.lineWidth = 1;
      const gridSize = 25;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw cute claymation style mascot doodle
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Draw body
      ctx.strokeStyle = '#ff4d8b'; // pink
      ctx.beginPath();
      ctx.arc(250, 250, 110, 0, Math.PI * 2);
      ctx.stroke();

      // Draw face eyes
      ctx.fillStyle = '#1a3a3a'; // deep teal
      ctx.beginPath();
      ctx.arc(200, 220, 14, 0, Math.PI * 2);
      ctx.arc(300, 220, 14, 0, Math.PI * 2);
      ctx.fill();

      // Sparkles in eyes
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(195, 215, 4, 0, Math.PI * 2);
      ctx.arc(295, 215, 4, 0, Math.PI * 2);
      ctx.fill();

      // Cheeks
      ctx.fillStyle = 'rgba(255, 107, 90, 0.4)'; // coral transparent
      ctx.beginPath();
      ctx.arc(180, 250, 15, 0, Math.PI * 2);
      ctx.arc(320, 250, 15, 0, Math.PI * 2);
      ctx.fill();

      // Happy mouth
      ctx.strokeStyle = '#1a3a3a';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(250, 260, 40, 0, Math.PI);
      ctx.stroke();

      // Accent marks
      ctx.strokeStyle = '#e8b94a'; // ochre crown
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(230, 110);
      ctx.lineTo(250, 80);
      ctx.lineTo(270, 110);
      ctx.stroke();

      // Branding watermark
      ctx.fillStyle = '#1a3a3a';
      ctx.font = 'bold 24px var(--font-sans), sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('InkSync Collaborative Canvas', 250, 420);

      ctx.fillStyle = '#6a6a6a';
      ctx.font = '14px var(--font-sans), sans-serif';
      ctx.fillText('Created in room: design-sprint', 250, 450);

      // Trigger automatic image download
      const link = document.createElement('a');
      link.download = 'inksync-collaborative-sketch.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  }

  // 5. Interactive Room Submission Handler
  const roomForm = document.getElementById('create-room-form');
  const roomInput = document.getElementById('room-name-input');
  const roomStatus = document.getElementById('room-status-message');

  if (roomForm && roomInput && roomStatus) {
    roomForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const rawRoomName = roomInput.value.trim();
      if (!rawRoomName) return;

      // Clean room name to letters, numbers, hyphens
      const cleanRoomName = rawRoomName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');

      roomStatus.innerText = '';
      roomStatus.className = 'room-response-message';

      // Disable submission button
      const submitBtn = roomForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = 'Creating Room...';
      }

      // Simulate network request
      setTimeout(() => {
        roomStatus.innerText = `Room "${cleanRoomName}" created! Redirecting to canvas session...`;
        roomStatus.classList.add('success');

        // Note: For future Sprint 3, this will navigate to /rooms/:roomId
        setTimeout(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerText = 'Go to Board';
          }
          alert(`Redirecting you to the shared room: ${window.location.origin}/rooms/${cleanRoomName}\n(Note: WebSocket room routing will be fully wired in Sprint 3!)`);
          roomInput.value = '';
          roomStatus.innerText = '';
          roomStatus.className = 'room-response-message';
        }, 1500);
      }, 800);
    });
  }

  // 6. Simulated Real-time Drawing Canvas Animation
  const animCanvas = document.getElementById('canvas-sync-anim');
  if (animCanvas) {
    const ctx = animCanvas.getContext('2d');
    const cursor1 = document.getElementById('cursor-p1');
    const cursor2 = document.getElementById('cursor-p2');

    let canvasWidth = 0;
    let canvasHeight = 0;

    function resizeCanvas() {
      const rect = animCanvas.getBoundingClientRect();
      canvasWidth = rect.width;
      canvasHeight = rect.height;
      animCanvas.width = canvasWidth;
      animCanvas.height = canvasHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Parametric Math curves for drawing
    // Heart shape points generator
    function getHeartPoint(t, cx, cy, scale) {
      const x = cx + scale * 16 * Math.pow(Math.sin(t), 3) / 13;
      const y = cy - scale * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 13;
      return { x, y };
    }

    // Infinity loop points generator
    function getInfinityPoint(t, cx, cy, scale) {
      const denom = 1 + Math.pow(Math.sin(t), 2);
      const x = cx + scale * 2.2 * Math.cos(t) / denom;
      const y = cy + scale * 2.2 * Math.sin(t) * Math.cos(t) / denom;
      return { x, y };
    }

    let t1 = 0;
    let t2 = 0;
    const maxT = Math.PI * 2;
    const speed = 0.02; // Speed of drawing loop

    let drawHistory1 = [];
    let drawHistory2 = [];
    let isFading = false;
    let fadeAlpha = 1;

    function animate() {
      // Clear Canvas
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // 1. Draw dot grid background for realistic canvas look
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      const dotSpacing = 16;
      for (let x = dotSpacing/2; x < canvasWidth; x += dotSpacing) {
        for (let y = dotSpacing/2; y < canvasHeight; y += dotSpacing) {
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Centers and Scales
      const cx1 = canvasWidth * 0.3;
      const cy1 = canvasHeight * 0.45;
      const scale1 = Math.min(canvasWidth, canvasHeight) * 0.32;

      const cx2 = canvasWidth * 0.7;
      const cy2 = canvasHeight * 0.45;
      const scale2 = Math.min(canvasWidth, canvasHeight) * 0.32;

      // Compute Point positions
      const p1 = getHeartPoint(t1, cx1, cy1, scale1);
      const p2 = getInfinityPoint(t2, cx2, cy2, scale2);

      if (!isFading) {
        // Record coordinates
        if (t1 < maxT) {
          drawHistory1.push(p1);
          t1 += speed;
        }
        if (t2 < maxT) {
          drawHistory2.push(p2);
          t2 += speed;
        }

        // Restart drawing cycle when both complete
        if (t1 >= maxT && t2 >= maxT) {
          isFading = true;
        }
      } else {
        // Fade out transition before resetting
        fadeAlpha -= 0.05;
        if (fadeAlpha <= 0) {
          drawHistory1 = [];
          drawHistory2 = [];
          t1 = 0;
          t2 = 0;
          fadeAlpha = 1;
          isFading = false;
        }
      }

      // Draw Sam's path (Pink)
      if (drawHistory1.length > 1) {
        ctx.strokeStyle = `rgba(255, 77, 139, ${fadeAlpha})`;
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(drawHistory1[0].x, drawHistory1[0].y);
        for (let i = 1; i < drawHistory1.length; i++) {
          ctx.lineTo(drawHistory1[i].x, drawHistory1[i].y);
        }
        ctx.stroke();
      }

      // Draw Leo's path (Ochre)
      if (drawHistory2.length > 1) {
        ctx.strokeStyle = `rgba(232, 185, 74, ${fadeAlpha})`;
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(drawHistory2[0].x, drawHistory2[0].y);
        for (let i = 1; i < drawHistory2.length; i++) {
          ctx.lineTo(drawHistory2[i].x, drawHistory2[i].y);
        }
        ctx.stroke();
      }

      // Position absolute remote cursor label nodes
      if (cursor1) {
        // Offset a bit for visual comfort
        cursor1.style.left = `${p1.x + 5}px`;
        cursor1.style.top = `${p1.y - 25}px`;
        cursor1.style.opacity = isFading ? fadeAlpha : 1;
      }

      if (cursor2) {
        cursor2.style.left = `${p2.x + 5}px`;
        cursor2.style.top = `${p2.y - 25}px`;
        cursor2.style.opacity = isFading ? fadeAlpha : 1;
      }

      requestAnimationFrame(animate);
    }

    // Start drawing loop delay to wait for calculations
    setTimeout(animate, 500);
  }
});
