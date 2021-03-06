// global refernece to shader library
var shaderLibrary;

/**
* This is the rendering class, responsible for running the WebGL code
*
* @class Renderer
* @constructor
*/
var Renderer = function ()
{
	/**
	* a full screen vertex buffer
	* 
	* @property screenVerticesBuffer
	* @type {Object}
	* @default null
	*/
	this.screenVerticesBuffer = null;

	/**
	* a color buffer
	* 
	* @property screenColorBuffer
	* @type {Object}
	* @default null
	*/
	this.screenColorBuffer = null;

	/**
	* index buffer
	* 
	* @property screenIndexBuffer
	* @type {Object}
	* @default null
	*/
	this.screenIndexBuffer = null;

	/**
	* the ortho matrix used to render on screen (preserves the aspect ratio)
	* 
	* @property matMVP
	* @type {Object}
	* @default identity
	*/
	this.matOrtho = mat4.create();

	/**
	* the number of points in polygon
	* 
	* @property nPoints
	* @type {Number}
	* @default 0
	*/
	this.nPoints = 8;

	// handle to the shader library
	shaderLibrary = null;
};

/**
 * Initialize all the data needed for rendering
 * @method init
 */
Renderer.prototype.init = function()
{
	gl.clearColor(0.4, 0.6, 1.0, 1.0);

	// create all the draw buffers
	this.initBuffers();

	// create and initialize the shader library
	shaderLibrary = new ShaderLibrary()
	shaderLibrary.init();

	// create the MVP for full screen quad
	mat4.ortho(this.matOrtho, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0);
};

/**
 * destroy all the allocated data and gl resources
 * @method destroy
 */
Renderer.prototype.destroy = function()
{
	// destroy all the VBOs allocated for rendering
	this.destroyBuffers();

	// destroy all the shaders
	shaderLibrary.destroy();
	shaderLibrary = null;
}

/**
 * Initialize the buffers we'll need. For this demo, we just have
 * one object -- a simple two-dimensional square.
 * @method initBuffers
 */
Renderer.prototype.initBuffers = function()
{
	// Create a buffer for the quad's vertices.
	this.screenVerticesBuffer = gl.createBuffer();

	// Select this buffer as the one to apply vertex operations to from here out.
	gl.bindBuffer(gl.ARRAY_BUFFER, this.screenVerticesBuffer);

	// Now create an array of vertices
	var vertices = new Float32Array(2*(this.nPoints+2));

	// initialize centre vertex
	vertices[0] = 0.0;
	vertices[1] = 0.0;

	// this will be the angular distance between vertices
	var deltaAngle = 2*Math.PI / this.nPoints;

	// add other vertices
	for(var i=0; i<this.nPoints+1; i++)
	{
		var angle = i*deltaAngle;
		vertices[2*(i+1)] = Math.cos(angle);
		vertices[2*(i+1)+1] = Math.sin(angle);
	}

	// Now pass the list of vertices into WebGL to build the shape
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);



	// Create a buffer for the quad's vertices.
	this.screenColorBuffer = gl.createBuffer();

	// Select this buffer as the one to apply vertex operations to from here out.
	gl.bindBuffer(gl.ARRAY_BUFFER, this.screenColorBuffer);

	// Now create an array of vertices
	var colors = new Float32Array(3*(this.nPoints+2));

	for(var i=0; i<3*(this.nPoints+2); i++)
		colors[i] = Math.random();

	// Now pass the list of vertices into WebGL to build the shape
	gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
};

/**
 * destroy the webgl buffers
 * @method destroyBuffers
 */
Renderer.prototype.destroyBuffers = function()
{
	gl.deleteBuffer(this.screenVerticesBuffer);
	gl.deleteBuffer(this.screenColorBuffer);
}

/**
 * Draw the scene (run the redering loop)
 * @method drawScene
 */
Renderer.prototype.drawScene = function()
{
	// Clear the canvas before we start drawing on it.
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.viewport(0, 0, canvas.width, canvas.height);

	this.drawRect();
};

/**
 * Draw the scene (run the redering loop)
 * @method drawRect
 */
Renderer.prototype.drawRect = function()
{
	// use the shader and bind uniforms
	var shader = shaderLibrary.getShader("fragColor");
	gl.useProgram(shader.program);

	gl.uniformMatrix4fv(shader.uniformArr["uMVP"], false, this.matOrtho);

	// Draw the square by binding the array buffer to the quad's vertices
	// array, setting attributes, and pushing it to GL
	gl.bindBuffer(gl.ARRAY_BUFFER, this.screenVerticesBuffer);
	gl.enableVertexAttribArray(0);
	gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.screenColorBuffer);
	gl.enableVertexAttribArray(1);
	gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);

	gl.drawArrays(gl.TRIANGLE_FAN, 0, this.nPoints+2);
}