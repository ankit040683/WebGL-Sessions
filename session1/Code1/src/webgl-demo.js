var canvas;
var gl;
var renderer;

var lastUpdateTime = 0;
var totalTime = 0;
var fps = 0;

//
// start
//
// Called when the canvas is created to get the ball rolling.
//
function start() {
  canvas = document.getElementById("glcanvas");

  initWebGL(canvas);      // Initialize the GL context

  // Only continue if WebGL is available and working

  if (gl) {

    // create the render object and initialize it
    renderer = new Renderer();
    renderer.init();

    // Set up to draw the scene periodically.
    drawScene();
  }
}

//
// initWebGL
//
// Initialize WebGL, returning the GL context or null if
// WebGL isn't available or could not be initialized.
//
function initWebGL() {
  // try creating a webgl context
  gl = canvas.getContext("webgl");

  // if context was not created try experimental context
  if (!gl)
    gl = canvas.getContext("experimental-webgl");

  // If we still don't have a GL context, give up now
  if (!gl) {
    alert("Unable to initialize WebGL. Your browser may not support it.");
  }
}

//
// drawScene
//
// Draw the scene.
//
function drawScene() {

  requestAnimFrame(drawScene);

  // call the draw scene for renderer
  renderer.drawScene();

  var currentTime = (new Date).getTime();
  if (lastUpdateTime) {
    var delta = currentTime - lastUpdateTime;
    totalTime += delta;
    fps++;

    if(totalTime > 1000)
    {
      console.log(fps);
      totalTime = 0;
      fps = 0;
    }
  }

  lastUpdateTime = currentTime;
}

window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         window.oRequestAnimationFrame ||
         window.msRequestAnimationFrame ||
         function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
           window.setTimeout(callback, 1000/60);
         };
})();