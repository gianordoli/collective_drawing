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
    

//colorDetection 
function colorDetection(){

  var xn = posX-radius;
  var yn = posY-radius;

  // console.log(xn);

  var pixelData = context.getImageData(xn, yn, 2*radius, 2*radius);
  // console.log('xn:' + xn);
  // console.log('yn:' + xn);
  // console.log('2*radius:' + 2*radius);
  // console.log(pixelData[0]);

  // iterate over all pixels based on x and y coordinates
  for(var y = 0; y < 2*radius; y++) {
    // loop through each column
    for(var x = 0; x < 2*radius; x++) {
      var red = pixelData.data[((2*radius * y) + x) * 4];
      var green = pixelData.data[((2*radius * y) + x) * 4 + 1];
      var blue = pixelData.data[((2*radius * y) + x) * 4 + 2];
      var alpha = pixelData.data[((2*radius * y) + x) * 4 + 3];

      if( red < 255 && blue < 255){
        console.log('DEAD');
        /*
        if(!alert('Alert For your User!')){
          window.location.reload();
        }       
        */
        break
      }

    }
  }  

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
  colorDetection();
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
  var color = 'rgba(250, 146, 146, 1)';
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


