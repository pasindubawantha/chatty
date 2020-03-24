
const http = require('http');
const express = require('express');
const socket_io = require('socket.io');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors')
const config = require('./config/database');
const app = express();
const path = require('path')

// Parameters
const port = process.env.PORT || 8000;

// Database connection
mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('connected', () => {
  console.log('Connected to database '+config.database);
});
mongoose.connection.on('error', (err) => {
  console.log('Database error '+err);
});

// Body Parser Middleware
app.use(bodyParser.json());
app.use(cors())

// Http server
console.log("Configureing Http server")
const server = http.Server(app);
const io = socket_io(server);

// ########## Done server constants ##########


// const users = require('./routes/users');
// const trackers = require('./routes/trackers');
const login = require('./routes/login');

const webapp_io = io.of('/');


// app.use('/login', login);
// app.use('/users', users);

// app.use('/trackers', trackers(webapp_io))




// When client connects to websocket
// webapp_io.on('connection', function (socket) {

//   // Join a room or create one
//   // const username = socket.handshake.query.username
//   const username = "main"
//   const room = username
//   socket.join(room);
//   socket.emit('message', { message: 'Connected to room ' + username });
//   console.log(username + ' joined room ' + room)

//   // When client update settings 
//   // socket.on('settings update', function (data) {
//   //   console.log(data);
//   //   socket.emit('message', { msg: 'settings updated' });
//   // });
// });
/////////////////////////////////


const Message = require('./models/message');






webapp_io.on('connection', function(socket){
  console.log('a user connected');


  Message.getMessages({}, (err, messages) => {
    if(err) {
      
      console.log(err);
    } else {
      webapp_io.emit('refresh', messages);
    }
  });





  socket.on('delete all', function() {
    console.log("deleteing all messagse !")
    Message.deleteAllMessages( (err) => {
      if(err) {
        console.log(err);
      } else {
        Message.getMessages({}, (err, messages) => {
          if(err) {
            
            console.log(err);
          } else {
            console.log("refreshed !")  
            webapp_io.emit('refresh', messages);
          }
        });
      }
    })
    
  })


  socket.on('chat message', function(msg){
    newMessageObj = {
      time: new Date(),
      message: msg.message,
      user: msg.user
    }
    let newMessage = new Message (newMessageObj);
  
    Message.addMessage(newMessage, (err, member) => {
      if(err) {
        console.log(err)

      } else {
        webapp_io.emit('chat message', newMessageObj);
        // console.log(newMessageObj)
      }
    });
  
  });


  
})

// webapp_io

app.use(express.static(path.join(__dirname, '/app')))

app.get('/', function(req, res){
    res.sendFile(__dirname + '/app/index.html');
});

server.listen(port, () => {
    console.log('Server started on port '+port);
  });