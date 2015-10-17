var app = app || {};

app.main = (function() {

  var socket;
  var canvas, context;
  var width, height;
  var users = {};

  // Initializing socket and adding listener functions
  var socketSetup = function(callback){

    socket = io.connect();
    socket.on('welcome', function(data){
      console.log('SOCKET: welcome');
      console.log(data.msg);
    });

    // socket.on('add-user', function(data){
    //   addUser(data);
    // });

    socket.on('render', function(data) {
      // console.log(data);
      draw(data);
    });
  };

  var canvasSetup = function(){
    canvas = document.getElementById('maze');
    context = canvas.getContext ('2d');
    if (canvas.getContext){
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
    }else{
      document.write ("Your browser doesn't support canvas :S");
    }
  };

  // function addUser(newUser) {
  //   console.log('FUNCTION: addUser');
  //   if(!users.hasOwnProperty(newUser['id'])) {
  //     users[id] = newUser;
  //   }
  // }

  // function update(data){
  //   for(var user in data){
  //     if(data[user]['isDrawing']){
  //     }
  //   }
  // }

  function draw(data) {

    // Background
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);

    for(var user in data){
      console.log(data[user]['pos']['x']);
      console.log(data[user]['color']);
      // Circle
      context.beginPath();
      context.arc(data[user]['pos']['x'], data[user]['pos']['y'], 5, 0, 2*Math.PI);
      if(data[user]['isDrawing']){
        context.fillStyle = data[user]['color'];
        context.fill();
      }else{
        context.strokeStyle = data[user]['color'];
        context.stroke();
      }
    }
  };

  var init = function(){
    console.log('Initializing app.');
    socketSetup();
    canvasSetup();
  };

  return {
    init: init
  };

})();

window.addEventListener('DOMContentLoaded', app.main.init);