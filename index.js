const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
app.set('view engine', 'ejs');
app.use(express.static('puplic'))


app.get('/', (req, res) => {
  res.render('chat')
});

const msgs = [
  { msg: 'omar', username: 'sief' },
  { msg: 'omarrrrrrr', username: 'sief' }
];

io.on('connection', (socket) => {
  socket.on('chat message', (msg,username) => {
    io.emit('chat message', msg,username);
    const msgArr = {
      msg: msg,
      username: username,
    }
  // Save message to local storage
  msgs.push(msgArr)
  console.log(msgs)
  });
});

let users = [];

io.on('connection', (socket) => {
  console.log(`user connected ${socket.id}`);
  
  socket.on('join', (username)=>{
  socket.broadcast.emit('join', username);
  socket.emit('msgsArr',msgs)
    socket.username = username;
        const user = {
          username: username.toLowerCase(),
          soketId: socket.id,
        }
      // Save message to local storage
      users.push(user)
      console.log(users)
    })
    socket.on('disconnect', () => {
      console.log(`user disconnected ${socket.id} ${socket.username}`);
      socket.broadcast.emit('disconnected', socket.id, socket.username);
      const userFind = users.find((user) => user.socketId === socket.id)
      const userIndex = users.indexOf(userFind);
      users = users.splice(userIndex, 1);
      console.log(users);
    });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at *${port}/`);
});

http.on('error', (error) => {
  console.error('Server error:', error);
});