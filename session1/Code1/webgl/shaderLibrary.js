/**
* This is the sample (base) shader class, which holds all the data related to a shader
*
* @class shaderBase
* @constructor
*/
var shaderBase = function()
{
	/**
	* the webgl handle for this shader
	* 
	* @property program
	* @type {Object}
	* @default null
	*/
	this.program = null;

	/**
	* array which holds all the uniforms for this shader
	* 
	* @property uniformArr
	* @type {Array}
	* @default empty
	*/
	this.uniformArr = {};

	/**
	* array which holds all the samplers for this shader
	* 
	* @property samplerArr
	* @type {Array}
	* @default empty
	*/
	this.samplerArr = {};

	/**
	* array which holds all the attributes for this shader
	* 
	* @property attribArr
	* @type {Array}
	* @default empty
	*/
	this.attribArr = null;

	/**
	* this points to the vertex shader source string
	* 
	* @property vertSrc
	* @type {String}
	* @default null
	*/
	this.vertSrc = null;

	/**
	* this points to the fragment shader source string
	* 
	* @property fragSrc
	* @type {String}
	* @default null
	*/
	this.fragSrc = null;
	
}

/**
 * This will initializes all the shader params (does not load it)
 * @method Initialize
 * @param {String} srcVert source string of the vertex shader
 * @param {String} srcFrag source string of the fragment shader
 * @param {Array} attribs array which holds all the attributes names
 * @param {Array} samplers array which holds all the samplers for this shader
 * @param {Array} uniforms array which holds all the uniforms names for this shader
 */
shaderBase.prototype.Initialize = function(srcVert, srcFrag, attribs, samplers, uniforms)
{
	this.vertSrc = srcVert;		// this points to the vertex shader source string
	this.fragSrc = srcFrag;		// this points to the fragment shader source string
	this.attribArr = attribs;	// this is the attribs array

	// add the samplers as key/value pair
	for(var i=0; i<samplers.length; i++)
		this.samplerArr[samplers[i]] = null;

	// add the uniforms as key/value pair
	for(var i=0; i<uniforms.length; i++)
		this.uniformArr[uniforms[i]] = null;
}

// Adding a global function to destroy extra properties of any object
function DESTROYOBJECT(obj)
{
	for (var prop in obj) { if (obj.hasOwnProperty(prop)) { delete obj[prop]; } }
}

// Adding a global function to clear an array
function DESTROYARRAY(arr)
{
	arr.splice(0, arr.length);
}

/**
 * destroy all the allocated data and gl resources
 * @method destroy
 */
shaderBase.prototype.destroy = function()
{
	// completelty destroy all objects and clear arrays
	DESTROYOBJECT(this.uniformArr);
	DESTROYOBJECT(this.samplerArr);
	DESTROYARRAY(this.attribArr);
}

/**
 * Method to get the uniform's locations for a shader
 * @method getUniformLocations
 */
shaderBase.prototype.getUniformLocations = function()
{
	for(var uniform in this.uniformArr)
		this.uniformArr[uniform] = gl.getUniformLocation(this.program, uniform);
}

/**
 * Method to get the sampler's locations and apply default values to them
 * @method applyDefaultSamplerLocations
 */
shaderBase.prototype.applyDefaultSamplerLocations = function()
{
	var i=0;
	for(var sampler in this.samplerArr)
	{
		this.samplerArr[sampler] = gl.getUniformLocation(this.program, sampler);
		gl.uniform1i(this.samplerArr[sampler], i);
		i++;
	}
}

/**
* This is the shader library class, which holds all the shaders
* resposible for creation, loading and destruction of all the shaders
*
* @class ShaderLibrary
* @constructor
*/
var ShaderLibrary = function ()
{
	// this array will hold all the loaded shaders in the form of key value pair
	this.shaders = [];
};

/**
 * Method to Initialize all the shaders (does not loads shaders)
 * @method init
 */
ShaderLibrary.prototype.init = function()
{
	// create the shader for fragment color
	var shaderFragColor = new shaderBase();

	// initialize the shader program and add the program in the list of loaded shaders
	shaderFragColor.Initialize(	srcVertShader,
								srcFragShaderFragColor,
								["aVertexPosition"],
								[],
								[]);
	this.shaders["fragColor"] = shaderFragColor;
}

/**
 * gets the specified shader
 * @method getShader
 * @param {String} shaderKey the shader key/name to fetch the correct shader
 * @return {Object} the shader object that is requested
 */
ShaderLibrary.prototype.getShader = function(shaderKey)
{
	// get shader from array
	var shader = this.shaders[shaderKey];

	// if no shader found return null
	if(!shader)
		return null;

	// if shader program is null, it means we still need to load it
	if(shader.program === null)
	{
		shader.program = this.createShaderProgram(shader.vertSrc, shader.fragSrc, shader.attribArr);
		shader.getUniformLocations();
		shader.applyDefaultSamplerLocations();
	}

	return shader;
}

/**
 * Destroy all the allocated data and shaders
 * @method destroy
 */
ShaderLibrary.prototype.destroy = function()
{
	// delete all the shaders that were loaded in webgl
	for(var shaderKey in this.shaders)
	{
		var shader = this.shaders[shaderKey];

		// delete the shader program
		if(shader.program !== null)
			gl.deleteProgram(this.shaders[i]);

		// clear other objects and arrays
		shader.destroy();
	}
}

/**
 * loads the specified shader
 * @method loadShader
 * @param {String} source shader source string
 * @param {enum} type gl enumerator for the shader type (vertex or fragment)
 * @return {Object} loaded shader object
 */
ShaderLibrary.prototype.loadShader = function(source, type)
{
	// create the shader and add it's source
	var shader = gl.createShader(type);
    gl.shaderSource(shader, source);

    // compile the shader
    gl.compileShader(shader);

	// See if it compiled successfully
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		console.log("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
		return null;
	}

	// if compiled successfully return the shader
	return shader;
}

/**
 * creates the shader program from shaders
 * @method createShaderProgram
 * @param {String} srcVertex vertex shader source string
 * @param {String} srcFragment vertex shader source string
 * @param {Array} attribs Attributes array
 * @return {Object} loaded and compiled shader object
 */
ShaderLibrary.prototype.createShaderProgram = function(srcVertex, srcFragment, attribs)
{
	// load the shaders
	var vertex = this.loadShader(srcVertex, gl.VERTEX_SHADER);
	var fragment = this.loadShader(srcFragment, gl.FRAGMENT_SHADER);

	// Create the program and attach the shaders
	var program = gl.createProgram();
	gl.attachShader(program, vertex);
	gl.attachShader(program, fragment);

	// Bind attributes
	for (var i = 0; i < attribs.length; i++)
	{
		gl.bindAttribLocation(program, i, attribs[i]);
	}

	// Link the program
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS))
	{
		console.log("An error occurred compiling the shaders: " + gl.getProgramInfoLog(program));
		gl.deleteProgram(program);
		return null;
	}

	// once the program is linked there is no need to keep the shader objects
	// they can be safely deleted
	gl.deleteShader(vertex);
	gl.deleteShader(fragment);

	// Make the program active
	gl.useProgram(program);

	return program;
}

