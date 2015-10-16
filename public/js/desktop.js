var app = app || {};

app.main = (function() {
  console.log('Your code starts here!');

  var socket;

  // Initializing socket and adding listener functions
  var socketSetup = function(callback){
    
    // Connect
      socket = io.connect();

      socket.on('coordinates-from-user', function(data) {
        // console.log(data);
        updatePosition(data);
      });

    // Listeners
    // socket.on('welcome', function(data){
    //   // console.log(data.msg);
    //   // console.log(data.users);
    //   for(var id in data.users){
    //     addBall({
    //       id: id,
    //           color: data.users[id]['color'],
    //           top: data.users[id]['top'],
    //           left: data.users[id]['left']          
    //     });
    //   }
    // });

    // socket.on('add-ball', function(data){
    //   addBall(data);
    // });
    
    // socket.on('remove-ball', function(data){
    //   if(ballExists(data.id)){
    //     removeBall(data);
    //   }
    // });

    // // Listen again, this time to render
    // socket.on('render', function(data){
    //   // console.log(data);
    //   // If a ball with this ID hasn't been rendered yet, let's add it
    //   if(!ballExists(data.id)){
    //     addBall(data);
    //   }
    //   moveBall(data);
    // });     
  };

  var canvas, context;
  var width, height;
  var posX, posY, speedX, speedY, radius;

  var canvasSetup = function(){
    canvas = document.getElementById('maze');
    context = canvas.getContext ('2d');
    if (canvas.getContext){
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      posX = 20;
      posY = 79;
      speedX = 0;
      speedY = 0;
      radius = 12;
    }else{
      document.write ("Your browser doesn't support canvas :S");
    }
  };

  function updatePosition(data) {

    speedX = data.x * 0.5;
    speedY = data.y * 0.5;
    posX += speedX;
    posY += speedY;

    if (posX < 0){
      posX = 0;
    }else if(posX > width){
      posX = width;
    }

    if(posY < 0){
      posxY = 0;
    }else if(posY > height) {  
      posY = height;
    }

    draw();
  };

  function draw() {

    // Backgronud
    context.fillStyle = 'rgba(255, 255, 255, .05)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Circle
    context.beginPath();
    context.arc(posX, posY, radius, 0, 2*Math.PI);
    context.fillStyle = 'rgba(29, 104, 255, 1)';
    context.fill();
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