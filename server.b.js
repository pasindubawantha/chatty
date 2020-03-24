const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const path = require('path')
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const PORT = process.env.PORT || 8000
const config = require('./config').config;

url = config.database

app.use(express.static(path.join(__dirname, '/app')))

app.get('/', function(req, res){
    res.sendFile(__dirname + '/app/index.html');
});

MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    dbo.createCollection("messages", function(err, res) {
      if (err) throw err;
      console.log("messages Collection created!");
    //   db.close();
    });


    io.on('connection', function(socket){
        console.log('a user connected');
        socket.on('disconnect', function(){
            console.log('user disconnected');
        });
        socket.on('chat message', function(msg){
            // console.log('message: ' + msg);
            var myobj = { time: Date.now().toString() ,user: "user", message: msg };
            dbo.collection("messages").insertOne(myobj, function(err, res) {
                if (err) throw err;
                io.emit('chat message', myobj);
                // console.log("1 document inserted");
                db.close();
            });
            
            
            
            

        });
    });




  });  





http.listen(PORT, function(){
  console.log('listening on *:'+PORT);
});