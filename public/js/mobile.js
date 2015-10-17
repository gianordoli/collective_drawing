var app = app || {};

app.main = (function() {

  var socket;

  // Initializing socket and adding listener functions
  var socketSetup = function(callback){
      socket = io.connect();
      // Assigning function to the 'start' event on that socket
      socket.on('start', function(data) { //when we get data from socket
        console.log('User is ' + data.user);
        console.log('Date is ' + data.date);
      });      
  };

  var attachEvents = function(){

    // check if DeviceOrientationEvent is supported
    if (!window.DeviceOrientationEvent) {
      document.getElementById('do-unsupported').classList.remove('hidden');
    } else {
      document.getElementById('do-info').classList.remove('hidden');

      //listen for event and handle DeviceOrientationEvent object
      window.addEventListener('deviceorientation', function(event) {

        // gamma is the left-to-right tilt in degrees, where right is positive
        var tiltLeftToRight = event.gamma;
        // beta is the front-to-back tilt in degrees, where front is positive
        var tiltFrontToBack = event.beta;
        // alpha is the compass direction the device is facing in degrees
        var direction = event.alpha;

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
     

        socket.emit('coordinates', {
          x: Math.round(direction),
          y: -Math.round(tiltFrontToBack)
        });

      });
    }
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