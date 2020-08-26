
var Model = function (gl, vertices, indices, normals, color = [0.0,0.0,0.0,0.0], texCoord =[]) {
	this.vertexBuffer = gl.createBuffer();
	this.indexBuffer = gl.createBuffer();
	this.normalBuffer = gl.createBuffer();
	this.nPoints = indices.length;
	
	this.worldMatrix = m4.identity();
	this.color = color;
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
	
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, null); 
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
	
	if(texCoord != []){
		this.textureBuffer = gl.createBuffer();
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoord), gl.STATIC_DRAW);
	}
};

var CreateShaderProgram = function(gl, vertexShaderText, fragmentShaderText) {
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	
	gl.shaderSource(vertexShader, vertexShaderText);
	gl.shaderSource(fragmentShader,fragmentShaderText);
	
	gl.compileShader(vertexShader);
	gl.compileShader(fragmentShader);
	
	//controllo se compilano shader
	if( !gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
		return{
			error : 'ERROR compiling vertex shader!' + gl.getShaderInfoLog(vertexShader)
		};
	}
	if( !gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
		return{
			error : 'ERROR compiling fragment shader!' + gl.getShaderInfoLog(vertexShader)
		};
	}
	
	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	
	//controllo link error
	if( !gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error('ERROR linking program!', gl.getProgramInfoLog(program));
		return{
			error : 'ERROR linking program!' + gl.getProgramInfoLog(program)
		};
	}
	
	return program;
};

var Camera = function (position, lookAt, up) {
	this.forward = new Float32Array(3);
	this.up = new Float32Array(3);
	this.right = new Float32Array(3);
	
	this.position = position;
	
	this.forward = m4.subtractVectors(lookAt, this.position);
	this.right = m4.cross(this.forward,up);
	this.up = m4.cross(this.right,this.forward);
	
	this.forward = m4.normalize(this.forward);
	this.right = m4.normalize(this.right);
	this.up = m4.normalize(this.up);
};

Camera.prototype.getViewMatrix = function(cameraMatrix) {
	var look = m4.addVectors(this.position,this.forward);
	cameraMatrix = m4.lookAt(this.position,look,this.up);
	viewMatrix = m4.inverse(cameraMatrix);
	return viewMatrix;
};

Camera.prototype.rotateRight = function (rad) {
	var rightMatrix = m4.axisRotation([0, 1, 0], rad);
	this.forward = m4.transformPoint(rightMatrix,this.forward);
	this._realign();
};

Camera.prototype._realign = function() {
	this.right = m4.cross(this.forward, this.up);
	this.up = m4.cross(this.right, this.forward);

	this.forward = m4.normalize(this.forward);
	this.right = m4.normalize(this.right);
	this.up = m4.normalize(this.up);
};

Camera.prototype.moveForward = function (dist) {
	this.position = m4.scaleAndAdd(this.position,this.forward,dist);
};

Camera.prototype.moveRight = function (dist) {
	this.position = m4.scaleAndAdd(this.position,this.right,dist);
};

Camera.prototype.moveUp = function (dist) {
	this.position = m4.scaleAndAdd(this.position,this.up,dist);
};