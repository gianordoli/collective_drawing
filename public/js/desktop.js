var app = app || {};

app.main = (function() {

  var socket;
  var canvas, context;
  var width, height;
  var localUsers = {};

  // Initializing socket and adding listener functions
  var socketSetup = function(callback){

    socket = io.connect();
    socket.on('welcome', function(data){
      console.log('SOCKET: welcome');
      console.log(data.msg);
    });

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

  function draw(data) {

    // Background
    context.fillStyle = 'rgba(0, 0, 0, 0.01)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    for(var user in data){
      console.log('currX: ' + data[user]['pos']['x']);
      console.log('prevX: ' + localUsers[user]['prevX']);
      // console.log(data[user]['color']);
      console.log(localUsers);

      // Circle
      context.beginPath();
      if(data[user]['isDrawing']){
        context.lineWidth = 5;
        context.moveTo(localUsers[user]['prevX'], localUsers[user]['prevY']);
        context.lineTo(data[user]['pos']['x'], data[user]['pos']['y']);
        context.strokeStyle = 'hsla(' + data[user]['color'] + ', 100%, 50%, 0.75)';
        context.stroke();     
        // context.arc(data[user]['pos']['x'], data[user]['pos']['y'], 5, 0, 2*Math.PI);
        // context.fillStyle = 'hsla(' + data[user]['color'] + ', 100%, 50%, 0.75)';
        // context.fill();
      }else{        
        context.arc(data[user]['pos']['x'], data[user]['pos']['y'], 1, 0, 2*Math.PI);
        context.strokeStyle = 'hsla(' + data[user]['color'] + ', 100%, 50%, 0.1)';
        context.stroke();
      }
      context.closePath();

      localUsers[user] = {
        prevX: data[user]['pos']['x'],
        prevY: data[user]['pos']['y']
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