var app = app || {};

app.main = (function() {
  console.log('Your code starts here!');

  var socket;

  // Initializing socket and adding listener functions
  var socketSetup = function(callback){
    
    // Connect
      socket = io.connect();

      socket.on('render', function(data) {
        console.log(data);
        // updatePosition(data);
        draw(data);
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
  var balls = {};
  // var posX, posY, speedX, speedY, radius;

  var canvasSetup = function(){
    canvas = document.getElementById('maze');
    context = canvas.getContext ('2d');
    if (canvas.getContext){
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      // posX = 50;
      // posY = 50;
      // speedX = 0;
      // speedY = 0;
      // radius = 5;
    }else{
      document.write ("Your browser doesn't support canvas :S");
    }
  };

  // var addBall = function(data){
  //   console.log('Appending a new ball: ' + data.id);
  //   var ball = $('<div class="ball" id="' + data.id + '"></div>')
  //         .css({
  //           'background-color': data.color,
  //           'top': data.top,
  //           'left': data.left
  //         });
  //   $('body').append(ball);
  // };

  // var removeBall = function(data){
  //   console.log('Called removeBall for ' + data);
  //   $('#' + data.id).remove();
  // };

  // var moveBall = function(data){
  //   $('#' + data.id).css({
  //     'top': data.top,
  //     'left': data.left
  //   });
  // };  

  // function updatePosition(data) {



  //   draw();
  // };

  function draw(data) {

    // Background
    // context.fillStyle = 'rgba(255, 255, 255, .05)';
    // context.fillRect(0, 0, canvas.width, canvas.height);

    // Circle
    context.beginPath();
    // context.arc(posX, posY, radius, 0, 2*Math.PI);
    // context.fillStyle = 'rgba(29, 104, 255, 1)';
    context.arc(data['pos']['x'], data['pos']['y'], 5, 0, 2*Math.PI);
    context.fillStyle = data['color'];
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