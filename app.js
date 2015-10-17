//SERVER SIDE

var express = require('express');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = 3300; //start a connect the app on port 3300

/*
Apon:
Detecting if the connecting user is using mobile or desktop
http://www.hacksparrow.com/detect-browser-user-agent-in-express-js-node-js.html
*/
app.use('/', express.static(__dirname + '/public'));
app.use('*', function(req, res) {
  // console.log(req.headers['user-agent']);
  // Say if req.headers['user-agent'] contains "Mobile", re-route the user to mobile interface
  var ua = req.headers['user-agent'];
  if (ua.indexOf('Mobile') > -1) {
    console.log('User is using mobile device');
    res.redirect('mobile.html');
  } else {
    // Else display a desktop version
    console.log('User is using desktop device');
    res.redirect('desktop.html');
  }
});
//////////



server.listen(port, function() {
  console.log('Server running at port:' + port);
});

var users = {};
var loop;

//Assign function to 'connection' event for the connected socket
io.on('connection', function(socket) {

  /*––––––––––– SOCKET.IO starts here –––––––––––––––*/
  // When Browser connects to socket: (whenever connection event fires)
  // EMIT 'start' event to connected socket
  socket.emit('start', {
    user: socket.id, //user property
    date: new Date() //date property (todays date)
  });
  console.log(socket.id + ' just connected');
  addUser(socket.id);

  //Our event handlers
  // Listening for coordinates
  socket.on('coordinates', function(data) { //when we get data from the socket
    // Coordinates from one user
    //console.log(socket.id + ' has sent: ' + data);
    console.log('has sent: ', socket.id, data);
    updateUser(socket.id, data);
  });
  
  socket.on('disconnect', function() {
      console.log(socket.id + ' just disconnected');
      io.sockets.emit('global message', socket.id + ' just disconnected');
      removeUser(socket.id);
  });

  // 
  if(Object.keys(users).length === 1){
    loop = setInterval(function(){
      renderOnClient(io);
    }, 500);
  }
});

function renderOnClient(io){
  console.log('Called renderOnClient');
  // Emit coordinates to every clients (all players)
  io.sockets.emit('render', users);
}

function updateUser(id, data){

  data.x = map(data.x, 360, 180, -90, 90);

  var speed = {
    x: data.x * 0.1,
    y: data.y * 0.1
  }
  users[id]['pos']['x'] += speed.x;
  users[id]['pos']['y'] += speed.y;
}

function addUser(id) {
    if(!users.hasOwnProperty(id)) {
        users[id] = {
            color: 'hsla(' + Math.round(Math.random()*360) + ', 100%, 50%, 0.75)',
            pos: {
              x: 50,
              y: 50
            }
        }
    }
    console.log('current users: ' + Object.keys(users).length);
}

function removeUser(id) {
    if(users.hasOwnProperty(id)) {
        delete users[id]
    }
    console.log('current users: ' + Object.keys(users).length);
}

var map = function(value, aMin, aMax, bMin, bMax){
    var srcMax = aMax - aMin,
      dstMax = bMax - bMin,
      adjValue = value - aMin;
    return (adjValue * dstMax / srcMax) + bMin;
};