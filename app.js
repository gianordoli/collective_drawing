/*---------- BASIC SETUP ----------*/
var express   = require('express'),
  bodyParser  = require('body-parser');     // helper for parsing HTTP requests
var app = express();                        // our Express app
var PORT = 3300;
var server = require('http').Server(app);   // Socket.io setup
var io = require('socket.io')(server);

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));// parse application/x-www-form-urlencoded
app.use(bodyParser.json());                         // parse application/json

// Detecting if the connecting user is using mobile or desktop
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

server.listen(PORT, function(){
    console.log('Express server is running at ' + PORT);
});

var users = {};
var loop;

//Assign function to 'connection' event for the connected socket
io.on('connection', function(socket) {

  /*––––––––––– SOCKET.IO starts here –––––––––––––––*/
  console.log('SOCKET: connection');
  console.log('A new client has connected: ' + socket.id);
  socket.emit('welcome', {
      msg: 'Welcome! your id is ' + socket.id,
      users: users
  });

  //Our event handlers
  // Is this coming from a mobile device?
  socket.on('add-me', function(data) {
    console.log('SOCKET: add-me');
    console.log(data);
    addUser(socket.id);
  });

  socket.on('calibrate', function(data) {
    console.log('SOCKET: calibrate');
    console.log(data);
    calibrateUser(socket.id, data);
  });  

  // Listening for coordinates
  socket.on('orientation', function(data) {
    console.log('SOCKET: orientation');
    // console.log('has sent: ' + socket.id, data);
    updateUser(socket.id, data);
  });
  
  socket.on('disconnect', function() {
    console.log('SOCKET: disconnect');
    console.log(socket.id + ' just disconnected');
    io.sockets.emit('global message', socket.id + ' just disconnected');
    removeUser(socket.id);
  });
});

function renderOnClient(io){
  // console.log('FUNCTION: renderOnClient');
  // Emit coordinates to every clients (all players)
  io.sockets.emit('render', users);
}

function calibrateUser(id, data){
  console.log('FUNCTION: calibrateUser');
  if(users.hasOwnProperty(id)){
    users[id]['offset'] = {
      x: data.x,
      y: data.y
    }
    if(Object.keys(users).length === 1){
      loop = setInterval(function(){
        renderOnClient(io);
      }, 100);
    }    
  }  
}

function updateUser(id, data){
  console.log('FUNCTION: updateUser');
  if(users.hasOwnProperty(id)) {
    console.log('in:' + data.x);

    var offsetX = users[id]['offset']['x'];

    data.x = (data.x + 90 - offsetX >= 360) ? (data.x + 90 - offsetX - 360) : (data.x + 90 - offsetX);
    console.log('out:' + data.x);

    // Constrain
    if(180 < data.x && data.x <= 270){
      data.x = 180;
    }else if(270 < data.x && data.x < 360){
      data.x = 0;
    }
    console.log('constrained:' + data.x);

    
    
    // // Offset
    // data.x += 90;

    // // Trim
    // data.x = (data.x > 360) ? (data.x - 360) : (data.x);
    // // data.x = data.x + (90 - users[id]['offset']['x']);

    // Map
    data.x = map(data.x, 180, 0, -90, 90);
    if(data.x < -90){ data.x = -90 };
    if(data.x >  90){ data.x =  90 };

    var speed = {
      x: data.x * 0.1,
      y: data.y * 0.1
    }
    users[id]['pos']['x'] += speed.x;
    if(users[id]['pos']['x'] < 0){
      users[id]['pos']['x'] = 0;
    }
    users[id]['pos']['y'] += speed.y;
    if(users[id]['pos']['y'] < 0){
      users[id]['pos']['y'] = 0;
    }    
  }
}

function addUser(id) {
  console.log('FUNCTION: addUser');
  if(!users.hasOwnProperty(id)) {
      users[id] = {
          color: 'hsla(' + Math.round(Math.random()*360) + ', 100%, 50%, 0.75)',
          pos: {
            x: 50,
            y: 50
          },
          offset: {
            x: 0,
            y: 0
          }
      }
  }
  console.log('current users: ' + Object.keys(users).length);
}

function removeUser(id) {
  console.log('FUNCTION: removeUser');
  if(users.hasOwnProperty(id)) {
      delete users[id]
  }
  console.log('current users: ' + Object.keys(users).length);
  if(Object.keys(users).length === 0){
    clearInterval(loop);
  }
}

var map = function(value, aMin, aMax, bMin, bMax){
    var srcMax = aMax - aMin,
        dstMax = bMax - bMin,
      adjValue = value - aMin;
    return (adjValue * dstMax / srcMax) + bMin;
};