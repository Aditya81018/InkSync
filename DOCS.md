# DOCS.md — InkSync

> **Purpose:** This file serves as the canonical project reference for InkSync. It is structured for consumption by LLM models (unambiguous, explicit, structured) while remaining readable by human contributors.

---

## Project Identity

| Field | Value |
|---|---|
| **Name** | InkSync |
| **Type** | Real-time collaborative drawing platform |
| **Scope** | Web application (browser-based) |
| **Development Model** | 4-sprint mentorship plan (4 weeks total) |

**One-line description:** InkSync is a multi-user, browser-based drawing application where participants share a live canvas and see each other's strokes in real time.

**Design philosophy:** Simplicity-first drawing experience (MS Paint-like UX), enhanced with real-time synchronization and room-based session isolation.

---

## Tech Stack

### Frontend
- **Language:** HTML, CSS, JavaScript (vanilla)
- **Rendering:** HTML5 Canvas API
- **Responsibilities:** All drawing logic, tool controls, UI, and socket event emission/handling

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Responsibilities:** HTTP server, static file serving, Socket.io signaling, room management

### Real-Time Layer
- **Library:** Socket.io
- **Transport:** WebSocket (with HTTP long-polling fallback via Socket.io)
- **Pattern:** Event-driven broadcasting — drawing events emitted by one client are broadcast to all other clients in the same room

### Database
- **Engine:** MongoDB
- **Status:** Optional — not required for core functionality; may be used for persistence (e.g., saving canvas state, user sessions)

---

## Core Features

Each feature below includes its functional description and implementation surface area.

### 1. Shared Drawing Canvas
- A single HTML5 `<canvas>` element serves as the drawing surface
- All connected users in a room draw on and receive updates to the same logical canvas
- Canvas state is synchronized via Socket.io events, not server-side storage (unless MongoDB persistence is added)

### 2. Drawing Tools
- **Brush tool:** Freehand drawing with configurable size and color
- **Eraser tool:** Clears pixels along a path; functionally a brush drawing in background color or using `destination-out` compositing

### 3. Color Picker
- UI control allowing the user to select any stroke color
- Selected color is applied to all subsequent brush strokes by that user

### 4. Brush Size Control
- UI control (e.g., slider or input) for adjusting stroke width
- Applies to the local user's brush and eraser

### 5. Real-Time Collaborative Drawing
- Drawing events (path start, path continuation, path end) are emitted via Socket.io
- Server relays events to all other clients in the same room
- Remote strokes are rendered on each client's canvas in real time

### 6. Room-Based Sessions
- Users join named rooms; only users in the same room share a canvas
- Enables isolated collaborative sessions between specific groups
- Room logic is managed server-side via Socket.io room APIs

### 7. Export Drawing as Image
- Users can download the current canvas as an image file (e.g., PNG)
- Implemented using the Canvas API's `toDataURL()` method, triggering a browser download

### 8. Responsive UI
- Interface adapts to different screen sizes
- Achieved through CSS layout techniques (flexbox/grid, media queries)

### Optional / Stretch Features
- **Active user cursors:** Display remote users' cursor positions in real time
- **Undo/Redo:** Local action history stack; may or may not be synchronized across users
- **Canvas zoom/pan:** Client-side canvas transformation (scale/translate)
- **Clear canvas:** Wipe the entire canvas; should broadcast to all room members

---

## Sprint Plan

Sprint duration is 1 week each. Total project duration: 4 weeks.

---

### Sprint 1 — Canvas Setup & Basic Drawing
**Goal:** Establish a working single-user drawing environment.

| Task | Details |
|---|---|
| Project structure setup | Scaffold frontend and backend directories; configure Express to serve static files |
| Canvas initialization | Create and size the `<canvas>` element; set up 2D rendering context |
| Brush tool | Implement `mousedown`, `mousemove`, `mouseup` event listeners for freehand drawing |
| Color picker | Wire color input to the active stroke color |
| Brush size control | Wire size input (slider/number) to the active line width |

**Deliverable:** A local, single-user drawing app with brush, color, and size controls.

---

### Sprint 2 — Tools & Canvas Features
**Goal:** Expand tool set and improve drawing quality/UX.

| Task | Details |
|---|---|
| Eraser tool | Toggle between brush and eraser modes; erase by drawing in background color or composite op |
| Clear canvas | Button that wipes the entire canvas (later to be broadcast in Sprint 3) |
| Undo/Redo | Maintain an array of canvas ImageData snapshots; restore on undo/redo action |
| Drawing smoothness | Use quadratic/bezier curves (`quadraticCurveTo`) instead of straight line segments for smoother strokes |
| Performance improvements | Optimize event loop; throttle mousemove events if needed |

**Deliverable:** A richer single-user drawing app with erase, undo/redo, and smooth strokes.

---

### Sprint 3 — Real-Time Collaboration
**Goal:** Connect multiple users to a shared canvas via Socket.io.

| Task | Details |
|---|---|
| Socket.io integration | Install and configure Socket.io on both server and client |
| Drawing event broadcast | Emit draw-point/path events from client; server broadcasts to room peers |
| Room-based sessions | Implement join-room logic; namespace drawing events per room |
| Active user cursors *(optional)* | Broadcast and render remote cursor positions with user identifiers |

**Key socket events to define:**

| Event Name | Direction | Payload | Purpose |
|---|---|---|---|
| `join-room` | Client → Server | `{ roomId }` | Join a named room |
| `draw-start` | Client → Server → Peers | `{ x, y, color, size }` | Begin a new stroke |
| `draw-move` | Client → Server → Peers | `{ x, y }` | Continue current stroke |
| `draw-end` | Client → Server → Peers | `{}` | End the current stroke |
| `clear-canvas` | Client → Server → Peers | `{}` | Clear the shared canvas |
| `cursor-move` *(optional)* | Client → Server → Peers | `{ x, y, userId }` | Broadcast cursor position |

**Deliverable:** Multiple users can draw on a shared canvas in real time within isolated rooms.

---

### Sprint 4 — Polish, Enhancements & Deployment
**Goal:** Finalize the product, fix bugs, and deploy.

| Task | Details |
|---|---|
| Export as image | Implement "Download" button using `canvas.toDataURL('image/png')` and an anchor tag download trigger |
| Canvas zoom/pan *(optional)* | Apply CSS `transform: scale()` or Canvas API `ctx.scale()`/`ctx.translate()` |
| UI/UX improvements | Refine layout, icons, tool indicators; ensure responsiveness |
| Testing | Manual and automated testing of drawing sync, room isolation, export |
| Bug fixes | Address edge cases from prior sprints |
| Deployment | Host on a platform supporting WebSocket (e.g., Railway, Render, Fly.io, Heroku) |

**Deliverable:** A fully polished, deployed, publicly accessible collaborative drawing app.

---

## Expected Final State

At project completion, InkSync will be a fully functional web application with the following verified capabilities:

- Multiple users can join the same room URL and draw together in real time
- Drawing tools (brush, eraser), color picker, and size control are functional
- Canvas can be cleared, undone/redone, and exported as PNG
- The application is deployed and accessible via a public URL
- Core architecture demonstrates: real-time WebSocket systems, Canvas API rendering, and event-driven web design

---

## Key Concepts for LLM Reference

> This section is written explicitly for LLM consumers of this document to prevent ambiguity.

- **"Canvas" always refers to the HTML5 `<canvas>` DOM element** and its 2D rendering context (`getContext('2d')`), not a metaphorical or design canvas.
- **Socket.io rooms are server-side logical groups**, not separate server instances. `socket.join(roomId)` and `io.to(roomId).emit(...)` are the core APIs.
- **Undo/redo state is local per client** unless explicitly synchronized. Syncing undo across clients is out of scope unless extended.
- **MongoDB is optional** — the base application is stateless. Canvas state is not persisted between sessions unless MongoDB integration is added.
- **"Real-time" means WebSocket-based event propagation**, not polling. Latency target is perceptual real-time (< ~100ms under normal network conditions).
- **Export is client-side only** — `canvas.toDataURL()` runs in the browser; no server-side image rendering is involved.
- **Sprint 1–2 are single-user**; multi-user functionality begins in Sprint 3.