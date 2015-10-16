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

var users = [];

//Assign function to 'connection' event for the connected socket
io.on('connection', function(socket) {
  /*––––––––––– SOCKET.IO starts here –––––––––––––––*/

  /*
	.on
	.emit
	.broadcast

    */
  // When Browser connects to socket: (whenever connection event fires)
  // EMIT 'start' event to connected socket
  socket.emit('start', { //start event is something we define
    //pass in an object:
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
    // Emit coordinates to every clients (all players)
    io.sockets.emit('coordinates-from-user', {
      //attaching
      x: data.x,
      y: data.y,
      z: data.z
    });
  });
  
  socket.on('disconnect', function() {
      console.log(socket.id + ' just disconnected');
      io.sockets.emit('global message', socket.id + ' just disconnected');
      removeUser(socket.id);
  });
    
});

function addUser(user) {
  if (users.indexOf(user) === -1) {
    users.push(user);
  }
  console.log('current users: ' + users.length);
}

function removeUser(user) {
  users.splice(user, 1);
  console.log('current users: ' + users.length);
}