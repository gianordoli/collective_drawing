/*---------- BASIC SETUP ----------*/
var express   = require('express'),
  bodyParser  = require('body-parser');     // helper for parsing HTTP requests
var app = express();                        // our Express app
var PORT = 3334;
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
var dimensions;

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

  // Getting dimensions
  socket.on('dimensions', function(data){
    console.log("SOCKET: dimensions");
    console.log(data);
    dimensions = data;
  });

  // socket.on('calibrate', function(data) {
  //   console.log('SOCKET: calibrate');
  //   console.log(data);
  //   calibrateUser(socket.id, data);
  // });

  socket.on("new-calibration", function(data){
    console.log("New calibration.");
    console.log(data);
    calibrateUser(socket.id, data);
  });

  // Listening for coordinates
  socket.on('orientation', function(data) {
    // console.log('SOCKET: orientation');
    // console.log('has sent: ' + socket.id, data);
    updateUserPosition(socket.id, data);
    users[socket.id]['isDrawing'] = data.isDrawing;

    io.sockets.emit('debug', data.orientation.events);
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

// function calibrateUser(id, data){
//   console.log('FUNCTION: calibrateUser');
//   if(data.x > 180){
//     data.x -= 360;
//   }  
//   if(users.hasOwnProperty(id)){
//     users[id]['offset'] = {
//       x: data.x,
//       y: data.y
//     }
//     if(Object.keys(users).length === 1){
//       loop = setInterval(function(){
//         renderOnClient(io);
//       }, 20);
//     }    
//   }  
// }

function calibrateUser(id, data){
  console.log('FUNCTION: calibrateUser');
  if(data.x > 180){
    data.x -= 360;
  }  
  if(users.hasOwnProperty(id)){
      users[id]['offset'] = {
        x: {
          min: data["alpha"]["min"],
          min: data["alpha"]["max"]
        },
        y: data.y
      }    
    // users[id]['offset'] = {
    //   x: data.x,
    //   y: data.y
    // }
    if(Object.keys(users).length === 1){
      loop = setInterval(function(){
        renderOnClient(io);
      }, 20);
    }    
  }  
}

function updateUserPosition(id, data){
  // console.log('FUNCTION: updateUser');
  if(users.hasOwnProperty(id)) {
    // console.log('in:\t' + data.orientation.x);

    if(data.orientation.x > 180){
      data.orientation.x -= 360;
    }

    // NEW!
    data.orientation.x = constrain(data.orientation.x, users[id]['offset']['x']["min"], users[id]['offset']['x']["max"]);
    data.orientation.x = map(data.orientation.x,
                            users[id]['offset']['x']["min"], users[id]['offset']['x']["max"],
                            0, dimensions.width);

    // OLD:
    // data.orientation.x -= users[id]['offset']['x'];
    // console.log('offset:\t' + users[id]['offset']['x']);
    // console.log('relative:\t' + data.orientation.x);
    // console.log('out:\t' + data.orientation.x);
    // data.orientation.x = constrain(data.orientation.x, -90, 90);
    // console.log('trim:\t' + data.orientation.x);
    // data.orientation.x *= -1;
    data.orientation.y -= users[id]['offset']['y'];

    var speed = {
      x: data.orientation.x * 0.2,
      y: data.orientation.y * 0.2
    }
    // users[id]['pos']['x'] = Math.round(users[id]['pos']['x'] + speed.x);
    // if(users[id]['pos']['x'] < 0){
    //   users[id]['pos']['x'] = 0;
    // }
    users[id]['pos']['y'] = Math.round(users[id]['pos']['y'] + speed.y);
    if(users[id]['pos']['y'] < 0){
      users[id]['pos']['y'] = 0;
    }    
  }
}

function addUser(id) {
  console.log('FUNCTION: addUser');
  if(!users.hasOwnProperty(id)) {
      users[id] = {
          color: Math.round(Math.random()*290),
          pos: {
            x: 50,
            y: 50
          },
          offset: {
            x: 0,
            y: 0
          },
          isDrawing: false
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
var map = function (n, start1, stop1, start2, stop2) {
  return (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
};
var constrain = function (n, low, high) {
  return Math.max(Math.min(n, high), low);
};