var app = app || {};

app.main = (function() {

  var socket;
  var orientation = {};
  var isCalibrated = false;
  var isDrawing = false;

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

    $('#calibrate-bt').off('click').on('click', function(){
      console.log('calibrate');
      socket.emit('calibrate', orientation);
      isCalibrated = true;
      $('#calibrate-bt').remove();
    });

    var el = document.getElementsByTagName("body")[0];
    el.addEventListener("touchstart", handleStart, false);
    el.addEventListener("touchend", handleEnd, false);
    el.addEventListener("touchcancel", handleEnd, false);

    // check if DeviceOrientationEvent is supported
    if (!window.DeviceOrientationEvent) {
      document.getElementById('do-unsupported').classList.remove('hidden');
    } else {
      document.getElementById('do-info').classList.remove('hidden');

      //listen for event and handle DeviceOrientationEvent object
      window.addEventListener('deviceorientation', function(event) {
        orientation = getOrientation(event);
        displayOrientation(event);        
        if(isCalibrated && isDrawing){
          emitOrientation();
        }
      });
    }
  }

  function handleStart(evt) {
    evt.preventDefault();
    console.log("touchstart.");
    isDrawing = true;
  };

  function handleEnd(evt) {
    evt.preventDefault();
    console.log("touchend.");
    isDrawing = false;
  };

  var getOrientation = function(){
    var tiltFrontToBack = Math.round(event.beta);
    var direction = Math.round(event.alpha);
    return {x: direction, y: -tiltFrontToBack};
  }

  var emitOrientation = function(){
    socket.emit('orientation', orientation);
  }

  var displayOrientation = function(){
    // rotate image using CSS3 transform
    var cube = document.getElementById('cube');

    // gamma is the left-to-right tilt in degrees, where right is positive
    var tiltLeftToRight = event.gamma;
    // beta is the front-to-back tilt in degrees, where front is positive
    var tiltFrontToBack = event.beta;
    // alpha is the compass direction the device is facing in degrees
    var direction = event.alpha;

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