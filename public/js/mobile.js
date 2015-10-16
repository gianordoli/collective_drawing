// Socket.io connection
var socket = io.connect(); //socket to listen to app

var xyz = {};

// Assigning function to the 'start' event on that socket
socket.on('start', function(data) { //when we get data from socket
  console.log('User is ' + data.user);
  console.log('Date is ' + data.date);
});


// // check if DeviceOrientationEvent is supported
// if (!window.DeviceOrientationEvent) {
//   document.getElementById('do-unsupported').classList.remove('hidden');
// } else {
//   document.getElementById('do-info').classList.remove('hidden');

//   //listen for event and handle DeviceOrientationEvent object
//   window.addEventListener('deviceorientation', function(event) {

//     // gamma is the left-to-right tilt in degrees, where right is positive
//     var tiltLeftToRight = event.gamma;
//     // beta is the front-to-back tilt in degrees, where front is positive
//     var tiltFrontToBack = event.beta;
//     // alpha is the compass direction the device is facing in degrees
//     var direction = event.alpha;

//     // rotate image using CSS3 transform
//     var cube = document.getElementById('cube');
//     cube.style.webkitTransform = 'rotate(' + tiltLeftToRight + 'deg) rotate3d(1,0,0, ' + (tiltFrontToBack * -1) + 'deg)';
//     cube.style.MozTransform = 'rotate(' + tiltLeftToRight + 'deg)';
//     cube.style.transform = 'rotate(' + tiltLeftToRight + 'deg) rotate3d(1,0,0, ' + (tiltFrontToBack * -1) + 'deg)';

//     // set HTML content = tilt OR direction degree (rounded to nearest integer)
//     document.getElementById('doTiltFrontToBack').innerHTML = Math.round(tiltFrontToBack);
//     document.getElementById('doTiltLeftToRight').innerHTML = Math.round(tiltLeftToRight);
//     document.getElementById('doDirection').innerHTML = Math.round(direction);

//     document.getElementById('is-absolute').innerHTML = event.absolute ? "true" : "false";
 
//     xyz = {
//       x: Math.round(tiltLeftToRight),
//       y: Math.round(tiltFrontToBack),
//       z: Math.round(direction)
//     };
//     socket.emit('coordinates', xyz);

//   });
// }


if (!window.DeviceMotionEvent) {
  document.getElementById('dm-unsupported').classList.remove('hidden');
} else {
  document.getElementById('dm-info').classList.remove('hidden');

  window.addEventListener('devicemotion', function(event) {

    // grab acceleration from the results
    document.getElementById('acceleration-x').innerHTML = Math.round(event.acceleration.x);
    document.getElementById('acceleration-y').innerHTML = Math.round(event.acceleration.y);
    document.getElementById('acceleration-z').innerHTML = Math.round(event.acceleration.z);

    // grab acceleration incl. gravitiy from the results
    document.getElementById('acceleration-including-gravity-x').innerHTML =
      Math.round(event.accelerationIncludingGravity.x);
    document.getElementById('acceleration-including-gravity-y').innerHTML =
      Math.round(event.accelerationIncludingGravity.y);
    document.getElementById('acceleration-including-gravity-z').innerHTML =
      Math.round(event.accelerationIncludingGravity.z);

    // grab rotation rate from the results
    document.getElementById('rotation-rate-beta').innerHTML = Math.round(event.rotationRate.beta);
    document.getElementById('rotation-rate-gamma').innerHTML = Math.round(event.rotationRate.gamma);
    document.getElementById('rotation-rate-alpha').innerHTML = Math.round(event.rotationRate.alpha);

    // grab refresh interval from the results
    document.getElementById('interval').innerHTML = event.interval;

    xyz = {
      // x: Math.round(event.accelerationIncludingGravity.x),
      // y: Math.round(event.accelerationIncludingGravity.y),
      // z: Math.round(event.accelerationIncludingGravity.z)
      x: Math.round(event.tiltLeftToRight),
      y: Math.round(event.tiltFrontToBack)
      // z: Math.round(event.acceleration.z)      
    };
    socket.emit('coordinates', xyz);
    
  });
}

/*
if (!('oncompassneedscalibration' in window)) {
  document.getElementById('cnc-unsupported').classList.remove('hidden');
} else {
  window.addEventListener('compassneedscalibration', function(event) {
    alert('Compass needs calibrating! Wave your device in a figure-eight motion');
  });
}
*/