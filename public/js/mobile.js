var app = app || {};

app.main = (function() {

  var socket;
  var orientation;
  var isCalibrated;

  // Initializing socket and adding listener functions
  var socketSetup = function(callback){
      socket = io.connect();

      // Assigning function to the 'start' event on that socket
      socket.on('welcome', function(data) { //when we get data from socket
        console.log(data.msg);
        console.log(data.users);
        socket.emit('add-me', 'I\'m mobile!');
      });
  };

  var attachEvents = function(){

    $('calibrate-bt').off('click').on('click', function(){
      // socket.emit('calibrate')
    });

    // check if DeviceOrientationEvent is supported
    if (!window.DeviceOrientationEvent) {
      document.getElementById('do-unsupported').classList.remove('hidden');
    } else {
      document.getElementById('do-info').classList.remove('hidden');

      //listen for event and handle DeviceOrientationEvent object
      window.addEventListener('deviceorientation', function(event) {
        orientation = getOrientation(event);
        displayOrientation(event);
        emitOrientation();
      });
    }
  }

  var getOrientation(){
    var tiltFrontToBack = event.beta;
    var direction = event.alpha;
    return {x: direction, y: tiltFrontToBack};
  }

  var emitOrientation(){
    socket.emit('orientation', orientation);    
  }

  var displayOrientation(){
      // rotate image using CSS3 transform
      var cube = document.getElementById('cube');
      cube.style.webkitTransform = 'rotate(' + tiltLeftToRight + 'deg) rotate3d(1,0,0, ' + (tiltFrontToBack * -1) + 'deg)';
      cube.style.MozTransform = 'rotate(' + tiltLeftToRight + 'deg)';
      cube.style.transform = 'rotate(' + tiltLeftToRight + 'deg) rotate3d(1,0,0, ' + (tiltFrontToBack * -1) + 'deg)';

      // set HTML content = tilt OR direction degree (rounded to nearest integer)
      document.getElementById('doTiltFrontToBack').innerHTML = Math.round(tiltFrontToBack);
      document.getElementById('doTiltLeftToRight').innerHTML = Math.round(tiltLeftToRight);
      document.getElementById('doDirection').innerHTML = Math.round(direction);
      document.getElementById('is-absolute').innerHTML = event.absolute ? "true" : "false";
  }

  var init = function(){
    console.log('Initializing app.');
    socketSetup();
    attachEvents();
  };

  return {
    init: init
  };

})();

window.addEventListener('DOMContentLoaded', app.main.init);  