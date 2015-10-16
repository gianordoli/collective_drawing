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

  var init = function(){
    console.log('Initializing app.');
    socketSetup();
  };

  return {
    init: init
  };

})();

window.addEventListener('DOMContentLoaded', app.main.init);

var canvas = document.getElementById('maze');
var context = canvas.getContext ('2d');
var width = 748;
var height = 500;

//positions
var posX = 20;
var posY = 79;
var radius = 12;
var direction = Math.PI * 2 * Math.random();

 //speed
var speedX = 0;
var speedY = 0;

//setting interval
var counter = 0;
setInterval(draw, 100,60);

function updatePosition(data) {
  speedX = data.x * 0.1;
  speedY = data.y * 0.1;
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
}

function draw() {


if (canvas.getContext) { 

  context.fillStyle = 'rgba(255, 255, 255, .05)';
  context.fillRect(0, 0, canvas.width, canvas.height);

  //colors
  var color = 'rgba(250, 146, 146, 1)';
  var colorCirlce = 'rgba(29, 104, 255, 1)';


  /// cirlce draw
      context.beginPath();
      context.arc(posX, posY, radius, 0, 2*Math.PI);
      context.fillStyle = colorCirlce;
      context.fill();

  //rect
  context.beginPath();
  context.rect(188, 94, 0, 0);
  context.fillStyle = color;
  context.fill();

  //rect
  context.beginPath();
  context.rect(370,73,0, 0);
  context.fillStyle = color;
  context.fill();

  //rect
  context.beginPath();
  context.rect(233, 218, 0, 0);
  context.fillStyle = color;
  context.fill();

  //rect
  context.beginPath();
  context.rect(70, 0, 668, 57);
  context.fillStyle = color;
  context.fill();

  //rect
  context.beginPath();
  context.rect(70, 110, 70, 389);
  context.fillStyle = color;
  context.fill();

  //rect
  context.beginPath();
  context.rect(194, 42, 115, 215);
  context.fillStyle = color;
  context.fill();

  //rect
  context.beginPath();
  context.rect(140, 314, 232, 83);
  context.fillStyle = color;
  context.fill();

  //rect
  context.beginPath();
  context.rect(372, 115, 57, 222);
  context.fillStyle = color;
  context.fill();

  //rect
  context.beginPath();
  context.rect(372, 115, 276, 57);
  context.fillStyle = color;
  context.fill();

  //rect
  context.beginPath();
  context.rect(708, 42, 40, 457);
  context.fillStyle = color;
  context.fill();

  //rect
  context.beginPath();
  context.rect(489, 230, 219, 54);
  context.fillStyle = color;
  context.fill();

  //rect
  context.beginPath();
  context.rect(372, 337, 274, 60);
  context.fillStyle = color;
  context.fill();

  //rect
  context.beginPath();
  context.rect(0, 177, 70, 322);
  context.fillStyle = color;
  context.fill();

  //rect
  context.beginPath();
  context.rect(257, 459, 451, 40);
  context.fillStyle = color;
  context.fill();


  } 

        else {
          document.write ("Update your browser. Sheesh");
        }
      };


