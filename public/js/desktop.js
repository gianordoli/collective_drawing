var app = app || {};

app.main = (function() {

  var socket;
  var canvas, ctx;
  var width, height;
  var localUsers = {};

  // Initializing socket and adding listener functions
  var socketSetup = function(callback){

    socket = io.connect();
    socket.on('welcome', function(data){
      console.log('SOCKET: welcome');
      console.log(data.msg);
      socket.emit('dimensions', {
        width: window.innerWidth,
        height: window.innerHeight
      })
    });

    socket.on('render', function(data) {
      console.log(data);
      draw(data);
    });

    // socket.on('debug', function(data) {
    //   console.log(data);
    // });
  };

  var canvasSetup = function(){
    canvas = document.getElementById('maze');
    ctx = canvas.getContext ('2d');
    if (canvas.getContext){
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';      
    }else{
      document.write ("Your browser doesn't support canvas :S");
    }
  };

  function draw(data) {

    // Background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.01)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for(var user in data){      
      var prevX, prevY;
      if(localUsers.hasOwnProperty(user)){
        prevX = localUsers[user]['prevX'];
        prevY = localUsers[user]['prevY'];
      }else{
        prevX = data[user]['pos']['x'];
        prevY = data[user]['pos']['y'];
      }
      // console.log('currX: ' + data[user]['pos']['x']);
      // console.log('prevX: ' + localUsers[user]['prevX']);
      // console.log(data[user]['color']);
      // console.log(localUsers);

      // Circle
			ctx.beginPath();
			ctx.arc(data[user]['pos']['x'], data[user]['pos']['y'], 50, 0, 2*Math.PI);
			ctx.stroke();

      ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(data[user]['pos']['x'], data[user]['pos']['y']);      
        if(data[user]['isDrawing']){
          
          // FIRE!
          ctx.lineWidth = 30;
          ctx.strokeStyle = 'hsla(' + data[user]['color'] + ', 100%, 50%, 0.75)';
        }else{        
          ctx.lineWidth = 3;
          ctx.strokeStyle = 'hsla(' + data[user]['color'] + ', 100%, 50%, 0.2)';
        }
        ctx.stroke();
      ctx.closePath();

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