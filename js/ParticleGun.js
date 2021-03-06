var gl;
var shaderProgram;

var particleTextures = [];

var mvMatrix = mat4.create();
var mvMatrixStack = [];
var pMatrix = mat4.create();
var particleVertexPositionBuffer;
var particleVertexTextureCoordBuffer;
var particles = [];
var lastTime = 0;

//pan, tilt rotation and zoom
var tilt = 0;
var pan = 0;
var zoom = -20;

//gun and particle data
var spin = 0;
var testTime = 0;
var gunAngle = 45;

//data about emitted materials
var materials = ["Water","Oil","Lava"];
var materialVelocities = [16000,12500,5000];
var currentlyEmittingMaterial = 0; //water is preselected

function initGL(canvas) {
	try {
		gl = canvas.getContext("experimental-webgl");
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
	} catch (e) {
	}
	if (!gl) {
		alert("Could not initialise WebGL, sorry :-(");
	}
}

function getShader(gl, id) {
	var shaderScript = document.getElementById(id);
	if (!shaderScript) {
		return null;
	}

	var str = "";
	var k = shaderScript.firstChild;
	while (k) {
		if (k.nodeType == 3) {
			str += k.textContent;
		}
		k = k.nextSibling;
	}

	var shader;
	if (shaderScript.type == "x-shader/x-fragment") {
		shader = gl.createShader(gl.FRAGMENT_SHADER);
	} else if (shaderScript.type == "x-shader/x-vertex") {
		shader = gl.createShader(gl.VERTEX_SHADER);
	} else {
		return null;
	}

	gl.shaderSource(shader, str);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert(gl.getShaderInfoLog(shader));
		return null;
	}

	return shader;
}

function initShaders() {
	var fragmentShader = getShader(gl, "shader-fs");
	var vertexShader = getShader(gl, "shader-vs");

	shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert("Could not initialise shaders");
	}

	gl.useProgram(shaderProgram);

	shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram,
			"aVertexPosition");
	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

	shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram,
			"aTextureCoord");
	gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

	shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram,
			"uPMatrix");
	shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram,
			"uMVMatrix");
	shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram,
			"uSampler");
	shaderProgram.colorUniform = gl.getUniformLocation(shaderProgram, "uColor");
}

function handleLoadedTextures(/*samplerNumber*/) {
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.activeTexture(gl.TEXTURE0 + 0);
	gl.bindTexture(gl.TEXTURE_2D, particleTextures[0]);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,particleTextures[0].image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.uniform1i(shaderProgram.uSampler, 0);

	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.activeTexture(gl.TEXTURE0 + 1);
	gl.bindTexture(gl.TEXTURE_2D, particleTextures[1]);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,particleTextures[1].image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.uniform1i(shaderProgram.uSampler1, 0);

	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.activeTexture(gl.TEXTURE0 + 2);
	gl.bindTexture(gl.TEXTURE_2D, particleTextures[2]);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,particleTextures[2].image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.uniform1i(shaderProgram.uSampler2, 0);
}

/**
 * loads all different images and creates textures in an array
 */
function initTextures() {
	var particleTexture;
	for (var m = 0;m < materials.length;m++){
		particleTexture = gl.createTexture();
		particleTexture.image = new Image();
		particleTexture.image.onload = function() {
			handleLoadedTextures(/*m*/);
		};

		particleTexture.image.src = "img/particle"+materials[m]+".png";
		particleTextures.push(particleTexture);
	}
}

function mvPushMatrix() {
	var copy = mat4.create();
	mat4.set(mvMatrix, copy);
	mvMatrixStack.push(copy);
}

function mvPopMatrix() {
	if (mvMatrixStack.length == 0) {
		throw "Invalid popMatrix!";
	}
	mvMatrix = mvMatrixStack.pop();
}

function setMatrixUniforms() {
	gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
	gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}

function degToRad(degrees) {
	return degrees * Math.PI / 180;
}

function initBuffers() {
	particleVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, particleVertexPositionBuffer);
	vertices = [ -1.0, -1.0, 0.0, 1.0, -1.0, 0.0, -1.0, 1.0, 0.0, 1.0, 1.0, 0.0 ];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	particleVertexPositionBuffer.itemSize = 3;
	particleVertexPositionBuffer.numItems = 4;

	particleVertexTextureCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, particleVertexTextureCoordBuffer);
	var textureCoords = [ 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0 ];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords),
			gl.STATIC_DRAW);
	particleVertexTextureCoordBuffer.itemSize = 2;
	particleVertexTextureCoordBuffer.numItems = 4;
}

/**
 * initialize a single particle
 */
function Particle(textureId) {
	this.textureId = textureId;

        //calculate X and Y components of initial velocity considering gunAngle
	this.xVelocity = materialVelocities[textureId] * Math.cos(degToRad(gunAngle));
        this.yVelocity = materialVelocities[textureId] * Math.sin(degToRad(gunAngle));

	this.xPos = 0; //xPos (Distance from Emitter)
        this.yPos = 0; //yPos (Distance from Emitter)

        this.inittime = new Date().getTime(); //Time Particle was emitted
	this.lifetime = 5000; //in milliseconds
}

/**
 * draws a single particle
 */
function drawParticle(textureId) {
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, particleTextures[textureId]);
	gl.uniform1i(shaderProgram.samplerUniform, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, particleVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute,
			particleVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, particleVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
			particleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	setMatrixUniforms();
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, particleVertexPositionBuffer.numItems);
}

/**
 * prepares to draw a single particle
 */
Particle.prototype.draw = function(pan, tilt, spin, twinkle, time) {
	mvPushMatrix();

	//Move to the particle's position
	mat4.translate(mvMatrix, [ 15, 0.0, -5.0 ]);
	mat4.translate(mvMatrix, [this.xPos,this.yPos,0.0]);
	//Rotate against the main rotation of the view so that the particle is facing the viewer
	mat4.rotate(mvMatrix, degToRad(-tilt), [ 1.0, 0.0, 0.0 ]);
        mat4.rotate(mvMatrix, degToRad(pan), [ 0.0, 1.0, 0.0 ]);
	
	if (twinkle) {
		// Draw a non-rotating particle in the alternate "twinkling" color
		gl.uniform3f(shaderProgram.colorUniform, this.twinkleR, this.twinkleG,
				this.twinkleB);
		drawParticle(this.textureId);
	}

	//particles spin around his Z-axis at the same rate
	mat4.rotate(mvMatrix, degToRad(spin), [ 0.0, 0.0, 1.0 ]);
        
	//Draw the particle in its main color
	gl.uniform3f(shaderProgram.colorUniform, this.r, this.g, this.b);
	drawParticle(this.textureId);

	mvPopMatrix();
};

/**
 * determines current position for a single particle
 * taking into account the initial velocity as well as gravity
 */
Particle.prototype.animate = function() {
        var timeSinceEmitted = new Date().getTime() - this.inittime;
        
        //calculate x- and y- component of current position
        //for a better animation both position components are equally devided by 1.000.000 (no influence on physical correctness)
        this.xPos = -(this.xVelocity*timeSinceEmitted)/1000000;
        this.yPos = (-0.5*9.81*timeSinceEmitted*timeSinceEmitted + this.yVelocity*timeSinceEmitted)/1000000;

	//delete particle if timeSinceEmitted is bigger than the lifetime
	if (timeSinceEmitted > this.lifetime) {
		particles.shift();
	}
};

/**
 * emitts a single particle
 */
function emitParticle() {
	if (currentlyEmittingMaterial != -1){
		particles.push(new Particle(currentlyEmittingMaterial));
	}
}

/**
 * draws the entire scene
 */
function drawScene() {
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0,
			pMatrix);

	gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
	gl.enable(gl.BLEND);

	mat4.identity(mvMatrix);
	mat4.translate(mvMatrix, [ 0.0, 0.0, zoom ]);
	mat4.rotate(mvMatrix, degToRad(tilt), [ 1.0, 0.0, 0.0 ]);
        mat4.rotate(mvMatrix, degToRad(-pan), [ 0.0, 1.0, 0.0 ]);
        
	var twinkle = 0;
	for ( var i in particles) {
		particles[i].draw(pan, tilt, spin, twinkle, testTime);
		testTime += 1;
		spin += 0.1;
	}
}

/**
 * animates all current particles
 */
function animate() {
        for ( var i in particles) {
                particles[i].animate();
        }
}

function tick() {
	requestAnimFrame(tick);
	drawScene();
	animate();
}

function start() {
	var canvas = document.getElementById("glcanvas");
	initGL(canvas);
	initShaders();
	initBuffers();
	initTextures();
	emitParticle();

	gl.clearColor(0.0, 0.0, 0.0, 1.0);

	tick();
}

//set intervall for constant emission of new particles
var emitter = window.setInterval("emitParticle()", 50);