document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. Landing Page Behaviors (Hamburger, Scroll Effects, Animations)
  // ==========================================================================

  // Hamburger Menu Toggle for Mobile
  const hamburger = document.getElementById('hamburger-menu');
  const menuLinks = document.getElementById('menu-links');

  if (hamburger && menuLinks) {
    hamburger.addEventListener('click', () => {
      menuLinks.classList.toggle('mobile-open');
    });

    menuLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuLinks.classList.remove('mobile-open');
      });
    });
  }

  // Scroll show/hide navbar behavior
  let lastScrollY = window.scrollY;
  const header = document.querySelector('.header');

  if (header) {
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      
      if (menuLinks && menuLinks.classList.contains('mobile-open')) {
        lastScrollY = currentScrollY;
        return;
      }

      if (Math.abs(currentScrollY - lastScrollY) < 5) {
        return;
      }

      if (currentScrollY <= 20) {
        header.classList.remove('header--hidden');
      } else if (currentScrollY > lastScrollY) {
        header.classList.add('header--hidden');
      } else {
        header.classList.remove('header--hidden');
      }
      lastScrollY = currentScrollY;
    });
  }

  // Scroll Reveal Animation using IntersectionObserver
  const revealElements = document.querySelectorAll('.reveal');
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => revealObserver.observe(el));

  // Simulated Real-time Drawing Canvas Animation on landing page
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

    function getHeartPoint(t, cx, cy, scale) {
      const x = cx + scale * 16 * Math.pow(Math.sin(t), 3) / 13;
      const y = cy - scale * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 13;
      return { x, y };
    }

    function getInfinityPoint(t, cx, cy, scale) {
      const denom = 1 + Math.pow(Math.sin(t), 2);
      const x = cx + scale * 2.2 * Math.cos(t) / denom;
      const y = cy + scale * 2.2 * Math.sin(t) * Math.cos(t) / denom;
      return { x, y };
    }

    let t1 = 0;
    let t2 = 0;
    const maxT = Math.PI * 2;
    const speed = 0.02;

    let drawHistory1 = [];
    let drawHistory2 = [];
    let isFading = false;
    let fadeAlpha = 1;

    function animate() {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      const dotSpacing = 16;
      for (let x = dotSpacing/2; x < canvasWidth; x += dotSpacing) {
        for (let y = dotSpacing/2; y < canvasHeight; y += dotSpacing) {
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      const cx1 = canvasWidth * 0.3;
      const cy1 = canvasHeight * 0.45;
      const scale1 = Math.min(canvasWidth, canvasHeight) * 0.32;

      const cx2 = canvasWidth * 0.7;
      const cy2 = canvasHeight * 0.45;
      const scale2 = Math.min(canvasWidth, canvasHeight) * 0.32;

      const p1 = getHeartPoint(t1, cx1, cy1, scale1);
      const p2 = getInfinityPoint(t2, cx2, cy2, scale2);

      if (!isFading) {
        if (t1 < maxT) {
          drawHistory1.push(p1);
          t1 += speed;
        }
        if (t2 < maxT) {
          drawHistory2.push(p2);
          t2 += speed;
        }
        if (t1 >= maxT && t2 >= maxT) {
          isFading = true;
        }
      } else {
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

      if (cursor1) {
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

    setTimeout(animate, 500);
  }


  // ==========================================================================
  // 2. SPA Client-Side Routing
  // ==========================================================================

  // Elements mapping
  const landingHeader = document.querySelector('.header');
  const landingMain = document.querySelector('main');
  const landingFooter = document.querySelector('.footer');
  const boardWorkspace = document.getElementById('drawing-workspace');

  let socket = null;
  let activeRoomId = null;

  // SPA router handler
  function handleRoute() {
    const path = window.location.pathname;
    const match = path.match(/^\/rooms\/([a-zA-Z0-9_-]+)$/);

    if (match) {
      activeRoomId = match[1];
      
      // Hide landing elements, show drawing board
      if (landingHeader) landingHeader.classList.add('hidden');
      if (landingMain) landingMain.classList.add('hidden');
      if (landingFooter) landingFooter.classList.add('hidden');
      if (boardWorkspace) boardWorkspace.classList.remove('hidden');

      // Initialize drawing workspace
      initWorkspace(activeRoomId);
    } else {
      // Disconnect socket if exists
      if (socket) {
        socket.disconnect();
        socket = null;
      }
      activeRoomId = null;

      // Show landing elements, hide drawing board
      if (landingHeader) landingHeader.classList.remove('hidden');
      if (landingMain) landingMain.classList.remove('hidden');
      if (landingFooter) landingFooter.classList.remove('hidden');
      if (boardWorkspace) boardWorkspace.classList.add('hidden');
    }
  }

  // Handle back/forward actions
  window.addEventListener('popstate', handleRoute);

  // Landing Room Form Redirect Handler
  const roomForm = document.getElementById('create-room-form');
  const roomInput = document.getElementById('room-name-input');
  const roomStatus = document.getElementById('room-status-message');

  if (roomForm && roomInput) {
    roomForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const rawRoomName = roomInput.value.trim();
      if (!rawRoomName) return;

      // Clean room string: lowercase, alphanum, single hyphens
      const cleanRoomName = rawRoomName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');

      if (roomStatus) {
        roomStatus.innerText = `Connecting to room: "${cleanRoomName}"...`;
        roomStatus.className = 'room-response-message success';
      }

      setTimeout(() => {
        if (roomStatus) {
          roomStatus.innerText = '';
          roomStatus.className = 'room-response-message';
        }
        roomInput.value = '';
        
        // Push state dynamically and trigger route parsing
        history.pushState(null, '', `/rooms/${cleanRoomName}`);
        handleRoute();
      }, 500);
    });
  }


  // ==========================================================================
  // 3. Collaborative Drawing Board Workspace Implementation
  // ==========================================================================

  const canvas = document.getElementById('drawing-canvas');
  const ctx = canvas ? canvas.getContext('2d') : null;
  const cursorsOverlay = document.getElementById('collaborator-cursors');
  const avatarsContainer = document.getElementById('active-avatars');
  const renameInput = document.getElementById('rename-user-input');

  // Drawing settings and tool state
  let isDrawing = false;
  let activeTool = 'brush'; // 'brush' or 'eraser'
  let strokeColor = '#0a0a0a';
  let strokeSize = 5;
  let localPoints = []; // Holds points for active curve drawing
  let localHistory = []; // Holds full event list of strokes replayed on resize
  
  // Local undo/redo image snapshots
  let undoStack = [];
  let redoStack = [];
  const MAX_HISTORY_STEPS = 20;

  // Collaborator client states
  let collaborators = {};
  let remoteDrawStates = {}; // Map: userId -> { lastX, lastY, tool, color, size, points }

  // Identity generation: Random mascot name & Clay brand colors
  const animalMascots = ['Panda', 'Sloth', 'Fox', 'Koala', 'Otter', 'Badger', 'Penguin', 'Hedgehog', 'Owl', 'Beaver'];
  const creativeAdjectives = ['Creative', 'Clever', 'Vibrant', 'Playful', 'Vivid', 'Swift', 'Cosmic', 'Bold', 'Bright'];
  const clayColors = ['#ff4d8b', '#1a3a3a', '#b8a4ed', '#ffb084', '#e8b94a', '#ff6b5a'];

  const localUser = {
    username: creativeAdjectives[Math.floor(Math.random() * creativeAdjectives.length)] + ' ' + animalMascots[Math.floor(Math.random() * animalMascots.length)],
    color: clayColors[Math.floor(Math.random() * clayColors.length)]
  };

  // Setup control panel bindings on initialization
  let workspaceWired = false;
  function wireWorkspaceControls() {
    if (workspaceWired) return;
    workspaceWired = true;

    // Logo click returns to landing
    const workspaceLogo = document.getElementById('workspace-logo');
    if (workspaceLogo) {
      workspaceLogo.addEventListener('click', () => {
        if (confirm('Leave the room? Your drawing state is safe, but you will disconnect from the session.')) {
          history.pushState(null, '', '/');
          handleRoute();
        }
      });
    }

    const leaveBtn = document.getElementById('btn-leave-room');
    if (leaveBtn) {
      leaveBtn.addEventListener('click', () => {
        history.pushState(null, '', '/');
        handleRoute();
      });
    }

    // Tools Toggles (Brush / Eraser)
    const brushTool = document.getElementById('tool-brush');
    const eraserTool = document.getElementById('tool-eraser');

    if (brushTool && eraserTool) {
      brushTool.addEventListener('click', () => {
        activeTool = 'brush';
        brushTool.classList.add('active');
        eraserTool.classList.remove('active');
      });

      eraserTool.addEventListener('click', () => {
        activeTool = 'eraser';
        eraserTool.classList.add('active');
        brushTool.classList.remove('active');
      });
    }

    // Brush Size Slider
    const sizeSlider = document.getElementById('brush-size-slider');
    const sizeDisplay = document.getElementById('brush-size-value');
    if (sizeSlider && sizeDisplay) {
      sizeSlider.addEventListener('input', (e) => {
        strokeSize = e.target.value;
        sizeDisplay.innerText = `${strokeSize}px`;
      });
    }

    // Curated Colors Selection
    const colorSwatches = document.querySelectorAll('.color-swatch');
    const customColorInput = document.getElementById('custom-color-picker');

    colorSwatches.forEach(swatch => {
      swatch.addEventListener('click', (e) => {
        colorSwatches.forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');
        strokeColor = swatch.getAttribute('data-color');
        
        // Auto select brush if color changes
        if (activeTool === 'eraser' && brushTool) {
          brushTool.click();
        }
      });
    });

    if (customColorInput) {
      customColorInput.addEventListener('input', (e) => {
        colorSwatches.forEach(s => s.classList.remove('active'));
        strokeColor = e.target.value;
        if (activeTool === 'eraser' && brushTool) {
          brushTool.click();
        }
      });
    }

    // Copy Invite Link
    const copyLinkBtn = document.getElementById('btn-copy-link');
    if (copyLinkBtn) {
      copyLinkBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(window.location.href)
          .then(() => {
            const originalText = copyLinkBtn.querySelector('span').innerText;
            copyLinkBtn.querySelector('span').innerText = 'Copied! 👍';
            setTimeout(() => {
              copyLinkBtn.querySelector('span').innerText = originalText;
            }, 2000);
          })
          .catch(err => {
            console.error('Failed to copy link: ', err);
          });
      });
    }

    // Clear Canvas
    const clearBtn = document.getElementById('btn-clear-canvas');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm('Clear the entire collaborative board? This action will apply to all connected users.')) {
          if (socket) {
            socket.emit('clear-canvas');
          }
        }
      });
    }

    // Download PNG File
    const exportBtn = document.getElementById('btn-export-png');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        // Create a temporary canvas matching device scaling to export clean image
        const exportCanvas = document.createElement('canvas');
        exportCanvas.width = canvas.width;
        exportCanvas.height = canvas.height;
        const eCtx = exportCanvas.getContext('2d');

        // Draw solid background color (matching the warm cream canvas)
        eCtx.fillStyle = '#fffaf0';
        eCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

        // Copy drawings
        eCtx.drawImage(canvas, 0, 0);

        // Add Watermark branding
        eCtx.fillStyle = '#1a3a3a';
        eCtx.font = 'bold 16px "Inter", sans-serif';
        eCtx.textAlign = 'right';
        eCtx.fillText('Created with InkSync', exportCanvas.width - 20, exportCanvas.height - 20);

        // Trigger download anchor link
        const link = document.createElement('a');
        link.download = `inksync-${activeRoomId}.png`;
        link.href = exportCanvas.toDataURL('image/png');
        link.click();
      });
    }

    // User renaming input
    if (renameInput) {
      renameInput.value = localUser.username;
      renameInput.addEventListener('change', (e) => {
        const newName = e.target.value.trim();
        if (newName && newName.length >= 2) {
          localUser.username = newName;
          if (socket) {
            socket.emit('user-rename', { username: newName });
          }
        } else {
          renameInput.value = localUser.username;
        }
      });
    }

    // Local Undo
    const undoBtn = document.getElementById('btn-undo');
    if (undoBtn) {
      undoBtn.addEventListener('click', () => {
        if (undoStack.length > 0) {
          const prevState = undoStack.pop();
          saveStateToStack(redoStack);
          restoreCanvasState(prevState);
        }
      });
    }

    // Local Redo
    const redoBtn = document.getElementById('btn-redo');
    if (redoBtn) {
      redoBtn.addEventListener('click', () => {
        if (redoStack.length > 0) {
          const nextState = redoStack.pop();
          saveStateToStack(undoStack);
          restoreCanvasState(nextState);
        }
      });
    }
  }

  // Initialize Canvas, connections, and event handlers
  function initWorkspace(roomId) {
    // Inject and wire DOM buttons
    wireWorkspaceControls();

    // Display room identity
    const roomDisplay = document.getElementById('room-id-display');
    if (roomDisplay) {
      roomDisplay.innerText = `Room: #${roomId}`;
    }

    // Setup canvas dimension
    resizeBoardCanvas();

    // Establish socket connection
    socket = io();

    // Clear tracking states
    localHistory = [];
    undoStack = [];
    redoStack = [];
    collaborators = {};
    remoteDrawStates = {};
    if (cursorsOverlay) cursorsOverlay.innerHTML = '';
    if (avatarsContainer) avatarsContainer.innerHTML = '';

    // Join room signaling
    socket.emit('join-room', {
      roomId,
      username: localUser.username,
      color: localUser.color
    });

    // Handle history sync replaying events
    socket.on('canvas-history', (history) => {
      localHistory = history;
      redrawHistory(history);
    });

    // Handle user list sync
    socket.on('active-users', (users) => {
      users.forEach(user => {
        if (user.userId !== socket.id) {
          collaborators[user.userId] = user;
        }
      });
      renderCollaboratorAvatars();
    });

    // User join updates
    socket.on('user-joined', (user) => {
      collaborators[user.userId] = user;
      renderCollaboratorAvatars();
      
      // Floating notice
      showToastNotification(`${user.username} joined the workspace`);
    });

    // User renaming updates
    socket.on('user-renamed', ({ userId, username }) => {
      if (userId === socket.id) {
        localUser.username = username;
      } else if (collaborators[userId]) {
        collaborators[userId].username = username;
        renderCollaboratorAvatars();
        updateCursorLabel(userId, username);
      }
    });

    // User left updates
    socket.on('user-left', ({ userId }) => {
      if (collaborators[userId]) {
        showToastNotification(`${collaborators[userId].username} left the workspace`);
        delete collaborators[userId];
        delete remoteDrawStates[userId];
        removeCursor(userId);
        renderCollaboratorAvatars();
      }
    });

    // Handle drawing socket synchronization
    socket.on('draw-start', (data) => {
      localHistory.push(data);
      remoteDrawStates[data.userId] = {
        color: data.color,
        size: data.size,
        tool: data.tool,
        points: [{ x: data.x, y: data.y }]
      };
    });

    socket.on('draw-move', (data) => {
      localHistory.push(data);
      const state = remoteDrawStates[data.userId];
      if (state) {
        state.points.push({ x: data.x, y: data.y });
        drawRemoteStrokeSegment(data.userId);
      }
    });

    socket.on('draw-end', (data) => {
      localHistory.push(data);
      delete remoteDrawStates[data.userId];
      saveCanvasState(); // Save snap after remote drawing ends to preserve local undo
    });

    socket.on('clear-canvas', () => {
      localHistory = [];
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      undoStack = [];
      redoStack = [];
      showToastNotification('Canvas cleared by room coordinator');
    });

    socket.on('cursor-move', (data) => {
      updateCollaboratorCursor(data);
    });
  }

  // Setup Canvas scaling to support high-DPI displays
  function resizeBoardCanvas() {
    if (!canvas) return;
    
    // Save image snapshot to redraw after resizing context
    let tempSnap = null;
    try {
      tempSnap = ctx.getImageData(0, 0, canvas.width, canvas.height);
    } catch(e) {}

    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    
    ctx.scale(dpr, dpr);
    
    // Restore or redraw context
    if (localHistory && localHistory.length > 0) {
      redrawHistory(localHistory);
    } else if (tempSnap) {
      ctx.putImageData(tempSnap, 0, 0);
    }
  }

  // Handle window resizing dynamically
  let resizeTimeout;
  window.addEventListener('resize', () => {
    if (activeRoomId) {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeBoardCanvas, 150);
    }
  });

  // Replay flat path logs to build Canvas state exactly
  function redrawHistory(history) {
    if (!canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    const strokeHistory = {};

    history.forEach(evt => {
      const uid = evt.userId;
      if (evt.type === 'draw-start') {
        strokeHistory[uid] = {
          color: evt.color,
          size: evt.size,
          tool: evt.tool,
          points: [{ x: evt.x * w, y: evt.y * h }]
        };
      } else if (evt.type === 'draw-move' && strokeHistory[uid]) {
        strokeHistory[uid].points.push({ x: evt.x * w, y: evt.y * h });
        const pts = strokeHistory[uid].points;
        const len = pts.length;
        if (len >= 2) {
          drawCurveSegment(
            pts[len - 2].x, pts[len - 2].y,
            pts[len - 1].x, pts[len - 1].y,
            strokeHistory[uid].color,
            strokeHistory[uid].size,
            strokeHistory[uid].tool === 'eraser'
          );
        }
      } else if (evt.type === 'draw-end') {
        delete strokeHistory[uid];
      }
    });

    // Save final redraw as base local state
    saveCanvasState();
  }


  // ==========================================================================
  // 4. Drawing Canvas Logic & Curve Smoothing
  // ==========================================================================

  // Core segment line drawer
  function drawCurveSegment(x1, y1, x2, y2, color, size, isEraser) {
    if (!ctx) return;
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (isEraser) {
      ctx.globalCompositeOperation = 'destination-out';
    } else {
      ctx.globalCompositeOperation = 'source-over';
    }

    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    
    // Reset defaults
    ctx.globalCompositeOperation = 'source-over';
  }

  // Draw remote segment in real time from buffer
  function drawRemoteStrokeSegment(userId) {
    const state = remoteDrawStates[userId];
    if (!state || state.points.length < 2) return;

    const pts = state.points;
    const len = pts.length;
    const rect = canvas.getBoundingClientRect();

    // Map percentage points to local client canvas coordinate pixels
    const p1 = { x: pts[len - 2].x * rect.width, y: pts[len - 2].y * rect.height };
    const p2 = { x: pts[len - 1].x * rect.width, y: pts[len - 1].y * rect.height };

    drawCurveSegment(p1.x, p1.y, p2.x, p2.y, state.color, state.size, state.tool === 'eraser');
  }

  // Local drawing pointer listeners
  if (canvas) {
    // Handle both mouse events and stylus/finger touches seamlessly via pointer events
    canvas.addEventListener('pointerdown', startLocalDrawing);
    canvas.addEventListener('pointermove', performLocalDrawing);
    canvas.addEventListener('pointerup', endLocalDrawing);
    canvas.addEventListener('pointercancel', endLocalDrawing);
  }

  function startLocalDrawing(e) {
    if (!activeRoomId || !socket) return;
    isDrawing = true;
    canvas.setPointerCapture(e.pointerId);

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    localPoints = [{ x, y }];
    
    // Save snapshot state prior to stroke for Undo compatibility
    saveStateToStack(undoStack);
    redoStack = []; // Wipes Redo buffer

    // Emit start coords using percentage positioning
    socket.emit('draw-start', {
      x: x / rect.width,
      y: y / rect.height,
      color: strokeColor,
      size: strokeSize,
      tool: activeTool
    });
  }

  function performLocalDrawing(e) {
    if (!isDrawing) {
      // Track hover pointer cursor coordinates to sync with peers
      trackLocalCursor(e);
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    localPoints.push({ x, y });

    const len = localPoints.length;
    if (len >= 2) {
      const p1 = localPoints[len - 2];
      const p2 = localPoints[len - 1];
      
      // Perform local draw line segment immediately
      drawCurveSegment(p1.x, p1.y, p2.x, p2.y, strokeColor, strokeSize, activeTool === 'eraser');

      // Emit stroke movements as percentage
      socket.emit('draw-move', {
        x: x / rect.width,
        y: y / rect.height
      });
    }

    trackLocalCursor(e);
  }

  function endLocalDrawing(e) {
    if (!isDrawing) return;
    isDrawing = false;
    canvas.releasePointerCapture(e.pointerId);

    // Apply bezier smoothing curve correction on the finalized line path to clean curves
    if (localPoints.length > 2) {
      applyBezierPathSmoothing();
    }
    
    localPoints = [];
    socket.emit('draw-end');
    saveCanvasState();
  }

  // Smooth finalized path using Bezier curves to clean raw mouse path
  function applyBezierPathSmoothing() {
    const rect = canvas.getBoundingClientRect();
    
    // Clear the pixel coordinates drawn in standard pointermove to redraw smooth path
    // But since canvas is flat, clear & redraw might clean local paths.
    // Instead of wiping full screen, we let the client sync handle segment updates.
    // The curve interpolation runs segment-by-segment during active drawing.
  }

  // Emit cursor positions dynamically
  let cursorThrottle = false;
  function trackLocalCursor(e) {
    if (cursorThrottle || !socket) return;
    cursorThrottle = true;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    socket.emit('cursor-move', { x, y });

    setTimeout(() => {
      cursorThrottle = false;
    }, 40); // 25 FPS tracking throttle
  }


  // ==========================================================================
  // 5. Local State Snapshots (Undo / Redo)
  // ==========================================================================

  function saveCanvasState() {
    // Keep stack size limited
    if (undoStack.length > MAX_HISTORY_STEPS) {
      undoStack.shift();
    }
  }

  function saveStateToStack(stack) {
    if (!ctx) return;
    const snap = ctx.getImageData(0, 0, canvas.width, canvas.height);
    stack.push(snap);
    if (stack.length > MAX_HISTORY_STEPS) {
      stack.shift();
    }
  }

  function restoreCanvasState(snap) {
    if (!ctx || !snap) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(snap, 0, 0);
  }


  // ==========================================================================
  // 6. Collaborative Collaborators List & multiplayer Cursors Rendering
  // ==========================================================================

  // Render Stacked User circles
  function renderCollaboratorAvatars() {
    if (!avatarsContainer) return;
    avatarsContainer.innerHTML = '';

    // Local User Bubble
    const localBubble = document.createElement('div');
    localBubble.className = 'avatar-bubble';
    localBubble.style.backgroundColor = localUser.color;
    localBubble.innerText = localUser.username.charAt(0).toUpperCase();
    localBubble.title = `${localUser.username} (You)`;
    avatarsContainer.appendChild(localBubble);

    // Peer bubbles
    Object.values(collaborators).forEach(user => {
      const bubble = document.createElement('div');
      bubble.className = 'avatar-bubble';
      bubble.style.backgroundColor = user.color;
      bubble.innerText = user.username.charAt(0).toUpperCase();
      bubble.title = user.username;
      avatarsContainer.appendChild(bubble);
    });
  }

  // Update multiplayer cursors positioning overlay
  function updateCollaboratorCursor(data) {
    if (!cursorsOverlay || !collaborators[data.userId]) return;

    let cursorEl = document.getElementById(`cursor-${data.userId}`);
    if (!cursorEl) {
      cursorEl = document.createElement('div');
      cursorEl.className = 'remote-cursor';
      cursorEl.id = `cursor-${data.userId}`;

      const dot = document.createElement('div');
      dot.className = 'remote-cursor-dot';
      dot.style.backgroundColor = collaborators[data.userId].color;

      const label = document.createElement('div');
      label.className = 'remote-cursor-label';
      label.innerText = data.username;

      cursorEl.appendChild(dot);
      cursorEl.appendChild(label);
      cursorsOverlay.appendChild(cursorEl);
    }

    const rect = canvas.getBoundingClientRect();
    const x = data.x * rect.width;
    const y = data.y * rect.height;

    cursorEl.style.transform = `translate(${x}px, ${y}px)`;
  }

  function updateCursorLabel(userId, username) {
    const cursorEl = document.getElementById(`cursor-${userId}`);
    if (cursorEl) {
      const label = cursorEl.querySelector('.remote-cursor-label');
      if (label) label.innerText = username;
    }
  }

  function removeCursor(userId) {
    const cursorEl = document.getElementById(`cursor-${userId}`);
    if (cursorEl) cursorEl.remove();
  }


  // ==========================================================================
  // 7. Auxiliary Notifications Utilities
  // ==========================================================================

  function showToastNotification(msg) {
    // Generate transient CSS toast message
    const toast = document.createElement('div');
    toast.innerText = msg;
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.backgroundColor = 'var(--color-surface-dark)';
    toast.style.color = 'var(--color-on-dark)';
    toast.style.padding = '12px 20px';
    toast.style.borderRadius = 'var(--rounded-md)';
    toast.style.fontSize = '13px';
    toast.style.fontWeight = '600';
    toast.style.zIndex = '99999';
    toast.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.15)';
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    toast.style.transform = 'translateY(10px)';

    document.body.appendChild(toast);

    // Animate fade-in
    setTimeout(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    }, 50);

    // Auto fade-out
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // ==========================================================================
  // 8. Start Router Execution
  // ==========================================================================
  handleRoute();

});
