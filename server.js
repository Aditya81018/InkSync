const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// In-memory data store for active rooms
// Structure:
// rooms = {
//   [roomId]: {
//     history: [ { type, x, y, color, size, tool, userId } ],
//     users: { [socketId]: { userId, username, color } }
//   }
// }
const rooms = {};

// Max history strokes buffer size per room to prevent unbounded memory growth
const MAX_HISTORY = 4000;

io.on('connection', (socket) => {
  let currentRoom = null;
  let currentUser = null;

  // Handle client joining a collaborative room
  socket.on('join-room', ({ roomId, username, color }) => {
    currentRoom = roomId;
    socket.join(roomId);

    // Initialize room object if not already present
    if (!rooms[roomId]) {
      rooms[roomId] = {
        history: [],
        users: {}
      };
    }

    // Set collaborator details
    currentUser = { userId: socket.id, username, color };
    rooms[roomId].users[socket.id] = currentUser;

    // Send existing stroke history buffer to sync newly joined canvas
    socket.emit('canvas-history', rooms[roomId].history);

    // Send the list of active users to the joining user
    socket.emit('active-users', Object.values(rooms[roomId].users));

    // Notify other peers in the room of the new client
    socket.to(roomId).emit('user-joined', currentUser);
  });

  // Handle real-time drawing actions
  socket.on('draw-start', (data) => {
    if (!currentRoom || !rooms[currentRoom]) return;
    const strokeData = { ...data, type: 'draw-start', userId: socket.id };
    
    if (rooms[currentRoom].history.length < MAX_HISTORY) {
      rooms[currentRoom].history.push(strokeData);
    }
    
    socket.to(currentRoom).emit('draw-start', strokeData);
  });

  socket.on('draw-move', (data) => {
    if (!currentRoom || !rooms[currentRoom]) return;
    const strokeData = { ...data, type: 'draw-move', userId: socket.id };
    
    if (rooms[currentRoom].history.length < MAX_HISTORY) {
      rooms[currentRoom].history.push(strokeData);
    }
    
    socket.to(currentRoom).emit('draw-move', strokeData);
  });

  socket.on('draw-end', () => {
    if (!currentRoom || !rooms[currentRoom]) return;
    const strokeData = { type: 'draw-end', userId: socket.id };
    
    if (rooms[currentRoom].history.length < MAX_HISTORY) {
      rooms[currentRoom].history.push(strokeData);
    }
    
    socket.to(currentRoom).emit('draw-end', strokeData);
  });

  // Handle clear canvas broadcasts
  socket.on('clear-canvas', () => {
    if (!currentRoom || !rooms[currentRoom]) return;
    rooms[currentRoom].history = [];
    io.to(currentRoom).emit('clear-canvas');
  });

  // Handle real-time cursor tracking
  socket.on('cursor-move', (data) => {
    if (!currentRoom) return;
    socket.to(currentRoom).emit('cursor-move', {
      userId: socket.id,
      x: data.x,
      y: data.y,
      username: currentUser ? currentUser.username : 'Collaborator'
    });
  });

  // Handle nickname renames
  socket.on('user-rename', ({ username }) => {
    if (!currentRoom || !rooms[currentRoom] || !rooms[currentRoom].users[socket.id]) return;
    rooms[currentRoom].users[socket.id].username = username;
    if (currentUser) {
      currentUser.username = username;
    }
    io.to(currentRoom).emit('user-renamed', {
      userId: socket.id,
      username: username
    });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    if (currentRoom && rooms[currentRoom]) {
      delete rooms[currentRoom].users[socket.id];
      socket.to(currentRoom).emit('user-left', { userId: socket.id });
      
      // Clean up room state if it becomes completely vacant
      if (Object.keys(rooms[currentRoom].users).length === 0) {
        delete rooms[currentRoom];
      }
    }
  });
});

// Wildcard routing to support SPA frontend navigation
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

server.listen(PORT, () => {
  console.log(`InkSync server running on http://localhost:${PORT}`);
});
