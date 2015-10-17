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
      // console.log(data[user]['pos']['x']);
      // console.log(data[user]['color']);
      var color = 'hsla(' + data[user]['color'] + ', 100%, 50%, 0.75)';

      // Circle
      context.beginPath();
      if(data[user]['isDrawing']){
        context.arc(data[user]['pos']['x'], data[user]['pos']['y'], 5, 0, 2*Math.PI);        
        context.fillStyle = color;
        context.fill();
      }else{
        context.arc(data[user]['pos']['x'], data[user]['pos']['y'], 1, 0, 2*Math.PI);
        context.strokeStyle = color;
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