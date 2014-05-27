    var canvas = document.getElementById("gl_canvas");
    var gl = canvas.getContext("experimental-webgl");
    var checkError = function (message) {
        var error = gl.getError();
        while (error != gl.NO_ERROR) {
            if (message) {
                console.log(message + ": " + error);
            } else {
                console.log(error);
            }
            error = gl.getError();
        }
    };
    
    var createBuffer = function (vertices) 
    {
        var vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        checkError("set buffer data");
        console.log(vertices);
        return vbo;
    };
    
    var createIndexBuffer = function (indices) 
    {
        var indexVBO = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexVBO);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);
        checkError("set index buffer data");
        return indexVBO;
    };
    
    var createShader = function (type, sourceId) 
    {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, document.getElementById(sourceId).textContent);
        gl.compileShader(shader);
        var log = gl.getShaderInfoLog(shader);
        if (log != "") {
            console.log(log);
        }
        console.log("create shader from " + sourceId);
        checkError("create shader from " + sourceId);
        return shader;
    };
    
    var createProgram = function (vertex, fragment) 
    {
        var shader = gl.createProgram();
        gl.attachShader(shader, vertex);
        gl.attachShader(shader, fragment);
        gl.linkProgram(shader);
        gl.validateProgram(shader);
        var log = gl.getProgramInfoLog(shader);
        if (log != "") {
            console.log(log);
        }
        checkError("create Program");
        return shader;
    };
    
    var displayFunc = function () 
    {
        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        var mvMatrix = new J3DIMatrix4();
        mvMatrix.translate(0, 1.5, -10);
        mvMatrix.rotate(45, 1,1,0);
        var mvpMatrix = new J3DIMatrix4();
        mvpMatrix.load(projection);
        mvpMatrix.multiply(mvMatrix);
        gl.useProgram(shader.program);
        mvpMatrix.setUniform(gl, shader.mvp, false);
        gl.uniform1f(shader.time, time);
        gl.enableVertexAttribArray(shader.vertex);
        gl.enableVertexAttribArray(shader.color);
        gl.enableVertexAttribArray(shader.velocity);
        gl.enableVertexAttribArray(shader.startTime);
        gl.enableVertexAttribArray(shader.size);
        gl.bindBuffer(gl.ARRAY_BUFFER, particleSystem.vertices);
        gl.vertexAttribPointer(shader.vertex, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, particleSystem.colors);
        gl.vertexAttribPointer(shader.color, 4, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, particleSystem.velocities);
        gl.vertexAttribPointer(shader.velocity, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, particleSystem.startTimes);
        gl.vertexAttribPointer(shader.startTime, 1, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, particleSystem.sizes);
        gl.vertexAttribPointer(shader.size, 1, gl.FLOAT, false, 0, 0);
        checkError("binding of buffers");
        gl.drawArrays(gl.POINTS, 0, particleSystem.particles.length);

        // render
        checkError("render");
    };
    
    
    var createTexture = function (url) 
    {
        var texture = gl.createTexture();
        var image = new Image();
        image.onload = function () {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.bindTexture(gl.TEXTURE_2D, null);
            checkError("generate texture")
            displayFunc();
        };
        image.src = url;
        return texture;
    };
    
    //gl.viewport(0, 0, canvas.width, canvas.height); TODO: adapt or remove
    
    var createParticleSystemShader = function () 
    {
        var vertex = createShader(gl.VERTEX_SHADER, "vertex_shader");
        var fragment = createShader(gl.FRAGMENT_SHADER, "fragment_shader");
        var shader = {};
        shader.program = createProgram(vertex, fragment);
        shader.mvp = gl.getUniformLocation(shader.program, "modelViewProjection");
        shader.time = gl.getUniformLocation(shader.program, "u_time");
        shader.color = gl.getAttribLocation(shader.program, "initialColor");
        shader.vertex = gl.getAttribLocation(shader.program, "vertex");
        shader.velocity = gl.getAttribLocation(shader.program, "velocity");
        shader.startTime = gl.getAttribLocation(shader.program, "startTime");
        shader.size = gl.getAttribLocation(shader.program, "size");
        checkError("creation of shader");
        return shader;
    };
    
    
    var createParticle = function () 
    {
        var particle = {};
        //particle.position = [Math.random(), Math.random(), Math.random()];
        particle.position = [3, Math.random()*0.5, Math.random()*0.5];
        //particle.velocity = [-Math.random(), -Math.random(), Math.random()];
        particle.velocity = [-7, 0, 0];
        //particle.color = [Math.random(), Math.random(), Math.random(), Math.random()];
        particle.color = [0.37, 0.82, 0.90, Math.random()*0.25+0.75];
        particle.startTime = Math.random() * 30 + 1;
        //particle.size = Math.random()*15 + 1;
        particle.size = 3;
        return particle;
    };


    /**
     * creates particle system with specified number of particles
     * @returns particleSystem
     */
    var createParticleSystem = function () 
    {
        var particles = [];
                        for (var i=0; i<1000000; i++) {
            particles.push(createParticle());
        }
        var vertices = [];
        var velocities = [];
        var colors = [];
        var startTimes = [];
        var sizes = [];

        for (i=0; i<particles.length; i++) {
            var particle = particles[i];
            vertices.push(particle.position[0]);
            vertices.push(particle.position[1]);
            vertices.push(particle.position[2]);
            velocities.push(particle.velocity[0]);
            velocities.push(particle.velocity[1]);
            velocities.push(particle.velocity[2]);
            colors.push(particle.color[0]);
            colors.push(particle.color[1]);
            colors.push(particle.color[2]);
            colors.push(particle.color[3]);
            startTimes.push(particle.startTime);
            sizes.push(particle.size);
        }

        var particleSystem = {};
        particleSystem.particles = particles;
        particleSystem.vertices = createBuffer(vertices);
        particleSystem.velocities = createBuffer(velocities);
        particleSystem.colors = createBuffer(colors);
        particleSystem.startTimes = createBuffer(startTimes);
        particleSystem.sizes = createBuffer(sizes);
        return particleSystem;
    };

    // create shader
    var shader = createParticleSystemShader();
    var particleSystem = createParticleSystem();
    var projection = new J3DIMatrix4();
    //projection.perspective(30, 3.0, 1, 10000);
    projection.perspective(30, 1, 1, 10000);
    var time = 0.0;
    gl.enable(gl.BLEND);
    displayFunc();

    setInterval(function () {
        time += 16/1000;
        displayFunc();
     }, 16);