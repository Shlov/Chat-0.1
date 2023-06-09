const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);

server.listen(4600, function() {
  console.log('Server running in port 4600');
});

app.use(express.static(__dirname + '/public'));

const users = {};

io.sockets.on('connection', (client) => {
  const broadcast = (event, data) => {
    client.emit(event, data);
    client.broadcast.emit(event, data);
  }

  broadcast('user', users);

  client.on('message', message => {
    if (users[client.id] !== message.name) {
      users[client.id] = message.name;
      broadcast('user', users);
    }
    broadcast('message', message);
  });

  client.on('disconnect', () => {
    delete users[client.id];
    client.broadcast.emit('user', users);
  });
  
})