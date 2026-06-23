# 🎨 InkSync

InkSync is a real-time, browser-based collaborative drawing board built for teams, brainstormers, and digital creators. It combines an intuitive MS Paint-like user experience with room-based isolation and live synchronized drawing strokes. 

The application is styled with a premium **Claymation-meets-data** aesthetic, featuring a warm cream canvas floor, high contrast navy typography, and saturated brand-color cards.

---

## ✨ Features

- 👥 **Real-Time Collaboration**: Share a board session instantly with others in the same room.
- 🖌️ **Smooth Drawing Engine**: Built-in interpolation (quadratic curve rendering) for smooth, vector-like paths.
- 🎨 **Creative Toolkit**: Brush and eraser tools, a slider-based size control, and a custom color palette.
- 📂 **Room-Based Sessions**: Join named, isolated canvas rooms for focused group brainstorming.
- ↩️ **Undo/Redo History**: Local canvas action tracking to easily revert mistakes.
- 💾 **Instant PNG Export**: Download high-resolution PNG snapshots of the drawing board directly to your device.
- 📱 **Responsive Design**: Adapts beautifully to mobile, tablet, and desktop viewports.

---

## 🎨 Design System & Aesthetics

InkSync is built on a **warm, claymation-inspired design theme** outlined in the project's [DESIGN.md](file:///home/aditya/Documents/Projects/InkSync/DESIGN.md):

- **Page Floor**: Cream-tinted white canvas (`#fffaf0`) for a warm, welcoming workspace.
- **Typography**: Bold headlines with tight negative letter-spacing for premium voice, paired with clean, accessible Inter sans-serif font for utility text and UI controls.
- **Color Accents**: Punctuated by a distinct 6-color saturated palette:
  - 💗 **Brand Pink** (`#ff4d8b`)
  - 🌲 **Brand Teal** (`#1a3a3a`)
  - 💜 **Brand Lavender** (`#b8a4ed`)
  - 🍑 **Brand Peach** (`#ffb084`)
  - 💛 **Brand Ochre** (`#e8b94a`)
  - 🧽 **Surface Card Cream** (`#f5f0e0`)
- **Shapes**: Generously rounded corners (`12px` for CTAs and inputs, `16px` for content cards, `24px` for feature cards) that mirror the soft, hand-crafted clay aesthetic.
- **No Heavy Shadows**: Clean depth is achieved entirely through solid, high-contrast flat fills and subtle hairline borders.

---

## 🛠️ Tech Stack

- **Frontend**: Vanilla HTML5, CSS3, and JavaScript (Canvas API)
- **Backend**: Node.js & Express.js
- **Real-Time Sync**: Socket.io (WebSockets)
- **Database**: MongoDB (Optional, for persistent canvas state storage)

---

## 📂 Project Structure

```text
InkSync/
├── public/
│   ├── assets/         # Static visual assets (illustrations, logos)
│   ├── app.js          # Core drawing engine, animation loop, and socket event handling
│   ├── index.html      # Structure of the homepage and room interface
│   └── styles.css      # Custom stylesheet based on the design system
├── server.js           # Express web server & Socket.io configuration
├── package.json        # Dependencies and scripts configuration
├── DOCS.md             # Canonical project requirements document
├── DESIGN.md           # Design guidelines & color/typography tokens
└── GEMINI.md           # Developer rules and project instructions
```

---

## 🗺️ Sprint Roadmap

The project is structured as a **4-sprint development plan** (detailed in [DOCS.md](file:///home/aditya/Documents/Projects/InkSync/DOCS.md)):

*   [x] **Sprint 1: Canvas Setup & Basic Drawing**
    *   Initialize single-user canvas.
    *   Set up freehand brush tool, color selection, and line size controls.
*   [x] **Sprint 2: Tools & Canvas Features**
    *   Add eraser tool, clear canvas functionality, and local undo/redo.
    *   Implement quadratic curve smoothing to prevent jagged mouse lines.
*   [ ] **Sprint 3: Real-Time Collaboration** (In Progress)
    *   Integrate Socket.io backend and client signaling.
    *   Broadcast drawing stroke coordinates (draw-start, draw-move, draw-end) within named rooms.
*   [ ] **Sprint 4: Polish & Deployment**
    *   Finalize canvas PNG download utility.
    *   Optimize performance, clean up UI/UX, and deploy to a live server.

---

## 🚀 Getting Started

To run the InkSync server locally:

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd InkSync
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Start the development server**:
   ```bash
   pnpm start
   ```

4. **Access the application**:
   Open [http://localhost:3000](http://localhost:3000) in your web browser.
