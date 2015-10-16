console.log('hey');

// var x = 0;
// var y = 0;
var canvas = document.getElementById('maze');
var context = canvas.getContext ('2d');
var width = 748;
var height = 500;





// //cirlce
// 	var centerX = 20;
//     var centerY = 79;
   var radius = 12;

//positions
    posX = 20;
    posY = 79;
    direction = Math.PI * 2 * Math.random();
    
//detection variables
var xn = posX-radius
var xp = posX+radius
var yn = posY-radius
var yp = posY+radius

var whatColor = context.getImageData(xn,xp,yn,yp);

//colorDetection 

 for(var i = 0, n = whatColor.data.length; i < n; i += 4) {
      var red = whatColor.data[i];
      var green = whatColor.data[i + 146];
      var blue = whatColor.data[i + 146];
      var alpha = whatColor.data[i + 1];
      if(red==255){ window.alert("You LOST!"); }
 }



 for(var i = 0, n = whatColor.data.length; i < n; i += 4) {
      var red = whatColor.data[i];
      var green = whatColor.data[i + 146];
      var blue = whatColor.data[i + 146];
      var alpha = whatColor.data[i + 1];
      if(red==255){ window.alert("You LOST!"); }
 }



 for(var i = 0, n = whatColor.data.length; i < n; i += 4) {
      var red = whatColor.data[i];
      var green = whatColor.data[i + 146];
      var blue = whatColor.data[i + 146];
      var alpha = whatColor.data[i + 1];
      if(red==255){ window.alert("You LOST!"); }
 }


 for(var i = 0, n = whatColor.data.length; i < n; i += 4) {
      var red = whatColor.data[i];
      var green = whatColor.data[i + 146];
      var blue = whatColor.data[i + 146];
      var alpha = whatColor.data[i + 1];
      if(red==255){ window.alert("You LOST!"); }
 }


 //speed
 	var speedX = 0;
    var speedY = 0;


 //setting interval
  var counter = 0;
  setInterval(draw, 100,60);

// Socket.io connection
var socket = io.connect(); //socket to listen to app
socket.on('coordinates-from-user', function(data) {
  // console.log(data);

  speedX = data.x * 0.1;
  speedY = data.y * 0.1;
  updatePosition();
 });

function updatePosition() {

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
  var color = 'rgba(255, 146, 146, 1)';
  var colorCirlce = 'rgba(29, 104, 255, 1)';


  /// cirlce draw
      context.beginPath();
      context.arc(posX, posY, radius, 0, 2*Math.PI);
      context.fillStyle = colorCirlce;
      context.fill();
    
  // //stop movement
  // if(posX >= canvas.width -width || posX<=0 ) speedX= 0;
  // if(posY >= canvas.width -width || posY<=0 ) speedY= 0;


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


