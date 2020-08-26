//variabili gestione canvas 
var canvas,gl,textCanvas,ctx,keyboardCanvas,keyCtx;
var movForwardImage,movWheelImage;

//variabili gestione uniform e attrib
var matWorldLocation,matViewLocation,matProjLocation,pointLightPosition;
var _position, _texture,_normals;
var matWorldLocationC,matViewLocationC,matProjLocationC,pointLightPositionC;
var _positionC,_normalsC,meshColor;
var matWorldLocationS,matViewLocationS,matProjLocationS,pointLightPositionS,meshColorS,lightShadowMapS,shadowClipNearFarS;
var _positionS,_normalsS;
var matWorldLocationSM,matViewLocationSM,matProjLocationSM,pointLightPositionSM,shadowClipNearFarSM;
var _positionSM;
var matWorldLocationTS,matViewLocationTS,matProjLocationTS,pointLightPositionTS,lightShadowMapTS,shadowClipNearFarTS;
var _positionTS, _textureTS,_normalsTS;

//variabili gestione program e mesh
var programTexture, programColor, programShadow, programShadowMap,programTextureShadow;
var monkeyMesh,tableMesh,sofaMesh,lightBulbMesh,wallsMesh,rexMesh;
var boxTexture,boxTextureT,shadowMapCube;
var shadowMapFrameBuffer,textureSize;

//variabili gestione animazioni
var MoveForwardSpeed = 3.5, RotateSpeed = 1.5;

//variabili gestione camera
var camera,viewMatrix,lightPosition,projMatrix;
var shadowMapCameras,shadowMapViewMatrices,shadowMapProj,shadowClipNearFar;

//variabili gestione mouse
var drag,old_x;

// costante gestione HUD e interazione
var ui,interact,audioM,oldDinoValue,audioD;
var up=false;
const settings = {
    Spinning_velocity: 2,
    Shadows: false,
	Dinosaur: false,
};

//struttura gestione movimento
PressedKeys = {
	Up: false,
	Down: false,
	Right: false,
	Left: false,
	Forward: false,
	Back: false,
		
	RotLeft: false,
	RotRight: false,
	
	Interact:false,
};

PressedTouch = {
	Up: false,
	Down: false,
	Right: false,
	Left: false,
	Forward: false,
	Back: false,
};

function degToRad(d) {
	return d * Math.PI / 180;
}

function isPowerOf2(value) {
	return (value & (value - 1)) === 0;
}

function initDemo () {	
	var meshes = [];
	loadTextResource("shaders/TextureNoShadow.vs.glsl", function (vsErr,vsTexture) {
		if(vsErr) {
			alert("Fatal error getting vertex shader texture");
			console.error(vsErr);
		} else {
			loadTextResource("shaders/TextureNoShadow.fs.glsl", function (fsErr,fsTexture) {
				if (fsErr) {
					alert("Fatal error getting fragment shader texture");
					console.error(fsErr);
				} else {	
					loadTextResource("shaders/NoShadow.vs.glsl", function (vsErr2,vsColor) {
						if(vsErr2) {
							alert("Fatal error getting vertex shader color");
							console.error(vsErr2);
						} else {
							loadTextResource("shaders/NoShadow.fs.glsl", function (fsErr2,fsColor) {
								if (fsErr2) {
									alert("Fatal error getting fragment shader color");
									console.error(fsErr2);
								} else {
									loadTextResource("shaders/Shadow.vs.glsl",function (vsSErr,vsShadow){
										if(vsSErr){
											alert("Fatal error getting vertex shader shadow");
											console.error(vsSErr);
										}else {
											loadTextResource("shaders/Shadow.fs.glsl",function (fsSErr,fsShadow){
												if(fsSErr){
													alert("Fatal error getting fragment shader shadow");
													console.error(fsSErr);
												}else {
													loadTextResource("shaders/ShadowMapGen.vs.glsl",function (vsSMErr,vsShadowMap){
														if(vsSMErr){
															alert("Fatal error getting vertex shader shadow map");
															console.error(vsSMErr);
														}else {
															loadTextResource("shaders/ShadowMapGen.fs.glsl",function (fsSMErr,fsShadowMap){
																if(fsSMErr){
																	alert("Fatal error getting fragment shader shadow map");
																	console.error(fsSMErr);
																}else {
																	loadImage('images/SusanTexture.png', function (imgErr,img) {
																		if (imgErr) {
																			alert("Fatal error getting texture image for monkey");
																			console.error(imgErr);
																		} else {						
																			loadOBJResource('objFiles/Susan.obj', function (monkeyModelErr,monkeyModel) {
																				if (monkeyModelErr){
																					alert("Fatal error getting Susan model");
																					console.error(monkeyModelErr);
																				} else {
																					var monkeyMesh = ObjLoader.objToMesh(monkeyModel);
																					meshes.push(monkeyMesh);
																					loadOBJResource('objFiles/tavoloTexture.obj', function (tableModelErr,tableModel) {
																						if (tableModelErr){
																							alert("Fatal error getting Table model");
																							console.error(tableModelErr);
																						} else {
																							var tableMesh = ObjLoader.objToMesh(tableModel);
																							meshes.push(tableMesh);
																							loadOBJResource('objFiles/SofaMesh.obj', function (sofaModelErr,sofaModel) {
																								if (sofaModelErr){
																									alert("Fatal error getting Sofa model");
																									console.error(sofaModelErr);
																								} else {
																									var sofaMesh = ObjLoader.objToMesh(sofaModel);
																									meshes.push(sofaMesh);
																									loadOBJResource('objFiles/LightBulbMesh.obj', function (lightModelErr,lightModel) {
																										if (lightModelErr){
																											alert("Fatal error getting Light model");
																											console.error(lightModelErr);
																										} else {
																											var lightMesh = ObjLoader.objToMesh(lightModel);
																											meshes.push(lightMesh);
																											loadOBJResource('objFiles/WallsMesh.obj', function (wallsModelErr,wallsModel) {
																												if (wallsModelErr){
																													alert("Fatal error getting Walls model");
																													console.error(wallsModelErr);
																												} else {
																													var wallsMesh = ObjLoader.objToMesh(wallsModel);
																													meshes.push(wallsMesh);
																													loadImage('images/tavoloTexture.png', function (imgTavErr,imgTav) {
																														if (imgTavErr) {
																															alert("Fatal error getting texture image for table");
																															console.error(imgTavErr);
																														} else {
																															loadTextResource("shaders/TextureShadow.vs.glsl",function (vsTSErr,vsTextShadow){
																																if(vsTSErr){
																																	alert("Fatal error getting vertex shader shadow and texture");
																																	console.error(vsTSErr);
																																}else {
																																	loadTextResource("shaders/TextureShadow.fs.glsl",function (fsTSErr,fsTextShadow){
																																		if(fsTSErr){
																																			alert("Fatal error getting fragment shader shadow and texture");
																																			console.error(fsTSErr);
																																		}else {
																																			loadImage('images/up_down_mov.png', function (imgUPErr,imgUP) {
																																				if (imgUPErr) {
																																					alert("Fatal error getting image for movement");
																																					console.error(imgUPErr);
																																				} else {
																																					loadImage('images/ruota_mov.png', function (imgRMErr,imgRM) {
																																						if (imgRMErr) {
																																							alert("Fatal error getting image for movement wheel");
																																							console.error(imgRMErr);
																																						} else {
																																							loadAudio('audios/gibbon_monkey.mp3', function(audioSErr,audioS){
																																								if(audioSErr){
																																									alert("Fatal error getting audio for monkey");
																																									console.error(audioSErr);
																																								} else {
																																									loadOBJResource('objFiles/T-rex.obj', function (rexModelErr,rexModel) {
																																										if(rexModelErr){
																																											alert("Fatal error getting Rex model");
																																											console.error(rexModelErr);
																																										} else{
																																											var rexMesh = ObjLoader.objToMesh(rexModel);
																																											meshes.push(rexMesh);
																																											loadAudio('audios/T-Rex_sound.mp3', function(audioDErr,audioD){
																																												if(audioDErr){
																																													alert("Fatal error getting audio for rex");
																																													console.error(audioDErr);
																																												} else {
																																													runDemo(vsTexture,fsTexture,vsColor,fsColor,vsShadow,
																																													fsShadow,vsShadowMap,fsShadowMap,vsTextShadow,fsTextShadow,
																																													img,imgTav,imgUP,imgRM,audioS,audioD,meshes);
																																												}
																																											});
																																										}
																																									});
																																								}
																																							});
																																						}
																																					});	
																																				}
																																			});
																																		}
																																	});
																																}
																															});
																														}
																													});
																												}
																											});
																										}
																									});
																								}
																							});
																						}
																					});
																				}
																			});
																		}
																	});	
																}
															});
														}
													});
												}
											});
										}
									});
								}
							});
						}
					});
				}
			});
		}
	});
}

function runDemo(vsTextureText,fsTextureText,vsColorText,fsColorText,vsShadowText,fsShadowText,vsShadowMapText,fsShadowMapText,vsTextureShadowText,fsTextureShadowText,monkeyTexture,tavoloTexture,imageUp,imageRM,monkeyAudio,rexAudio,meshes) {
	//dopo aver caricato tutti i file faccio scomparire il div loader
	var loader = document.querySelector(".loader");
	loader.className += " hidden";
	
	canvas = document.getElementById("mycanvas");
	gl = canvas.getContext("experimental-webgl");
	
	//per gestire il testo sulla canvas con webgl
	textCanvas = document.getElementById("text");
	ctx = textCanvas.getContext("2d");
	
	//per gestire le immagini per il touch screen sulla canvas con webgl
	keyboardCanvas = document.getElementById("keyboard");
	keyCtx = keyboardCanvas.getContext("2d");
	
	ui = document.getElementById("ui");
	
	if(!gl){
		alert("Your browser does not support WebGL!");
	}
	
	//creo i programmi shader
	programTexture = CreateShaderProgram(gl,vsTextureText,fsTextureText);
	if(programTexture.error){
		alert("Error in the creation of shaders program, FAILED!\n" + programTextureShadow.error);
		return;
	}
	
	programColor = CreateShaderProgram(gl,vsColorText,fsColorText);
	if(programColor.error){
		alert("Error in the creation of shaders program, FAILED!\n" + programTextureShadow.error);
		return;
	}
	
	programShadow = CreateShaderProgram(gl,vsShadowText,fsShadowText);
	if(programShadow.error){
		alert("Error in the creation of shaders program, FAILED!\n" + programTextureShadow.error);
		return;
	}
	
	programShadowMap = CreateShaderProgram(gl,vsShadowMapText,fsShadowMapText);
	if(programShadowMap.error){
		alert("Error in the creation of shaders program, FAILED!\n" + programTextureShadow.error);
		return;
	}
	
	programTextureShadow = CreateShaderProgram(gl,vsTextureShadowText,fsTextureShadowText);
	
	if(programTextureShadow.error){
		alert("Error in the creation of shaders program, FAILED!\n" + programTextureShadow.error);
		return;
	}
	
	//creo le Mesh
	for (var i=0; i< meshes.length; i++) {
			var mesh = meshes[i];
			switch(mesh.name){
				case 'Suzanne':
					//color impostato con tutti zeri poichè non è utilizzato, abbiamo una texture
					monkeyMesh = new Model(gl, mesh.vertices, mesh.indices,	mesh.normals, [0.0,0.0,0.0,0.0], mesh.textureCoord);
					monkeyMesh.worldMatrix = m4.identity();
					monkeyMesh.worldMatrix=m4.translate(monkeyMesh.worldMatrix,1.0,1.8,1.0);
					monkeyMesh.worldMatrix=m4.scale(monkeyMesh.worldMatrix,0.4,0.4,0.4);
					break;
				case 'Table_TableMesh':
					//color impostato con tutti zeri poichè non è utilizzato, abbiamo una texture
					tableMesh = new Model(gl, mesh.vertices, mesh.indices, mesh.normals, [0.0,0.0,0.0,0.0], mesh.textureCoord);
					break;
				case 'Sofa_SofaMesh':
					sofaMesh = new Model(gl, mesh.vertices, mesh.indices, mesh.normals, [0.0,1.0,1.0,1.0]);
					break;
				case 'LightBulb_LightBulbMesh':
					lightPosition = [0.0, 2.68971, 0.0];
					lightBulbMesh = new Model(gl, mesh.vertices, mesh.indices, mesh.normals, [4.0,4.0,4.0,1.0]);
					lightBulbMesh.worldMatrix=m4.translate(lightBulbMesh.worldMatrix,lightPosition[0],lightPosition[1],lightPosition[2]);
					break;
				case 'Room_WallsMesh':
					wallsMesh = new Model(gl, mesh.vertices, mesh.indices, mesh.normals, [0.3,0.3,0.3,1.0]);	
					break;
				case 'T-Rex':
					rexMesh = new Model(gl, mesh.vertices, mesh.indices, mesh.normals, [0.3,4.0,0.0,1.0]);	
					rexMesh.worldMatrix = m4.identity();
					rexMesh.worldMatrix=m4.translate(rexMesh.worldMatrix,-2.2,1.6,0.0);
					rexMesh.worldMatrix=m4.scale(rexMesh.worldMatrix,0.1,0.1,0.1);
					break;
			}
		}	
	
	//creo texture
	boxTexture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, boxTexture);
	//per girare i pixel, lo faccio già nel objLoader
	//gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
	
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, monkeyTexture);

	// Check if the image is a power of 2 in both dimensions.
	if (isPowerOf2(monkeyTexture.width) && isPowerOf2(monkeyTexture.height)) {
		// Yes, it's a power of 2. Generate mips.
		gl.generateMipmap(gl.TEXTURE_2D);
		console.log('mipmap');
	} else {
		// No, it's not a power of 2. Turn of mips and set wrapping to clamp to edge
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	}
	
	gl.bindTexture(gl.TEXTURE_2D, null);
	
	//creo texture
	boxTextureT = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, boxTextureT);
	//per girare i pixel, lo faccio già nel objLoader
	// gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
	
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, tavoloTexture);

	// Check if the image is a power of 2 in both dimensions.
	if (isPowerOf2(tavoloTexture.width) && isPowerOf2(tavoloTexture.height)) {
		// Yes, it's a power of 2. Generate mips.
		gl.generateMipmap(gl.TEXTURE_2D);
		console.log('mipmap');
	} else {
		// No, it's not a power of 2. Turn of mips and set wrapping to clamp to edge
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	}
	
	gl.bindTexture(gl.TEXTURE_2D, null);
	
	shadowMapCube = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_CUBE_MAP, shadowMapCube);
	
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	
	//prendo qualità delle texture da parametro del browser
	var tempSize = getParameterByName('texSize') || 1024;
	if (isPowerOf2(tempSize)){
		textureSize = tempSize;
	} else {
		textureSize = 1024;
	}

	//ciclo per bind texture al cubo
	for (var i=0;i<6;i++) {
		//gl.TEXTURE_CUBE_MAP_POSITIVE_X + i perchè i loro codici sono vicini e così passo tutte le facce del cubo
		gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA,
		textureSize,textureSize,0,gl.RGBA,gl.UNSIGNED_BYTE,null);
	}
	
	//creo e bind frame buffer e render buffer per shadowMapCube
	shadowMapFrameBuffer = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, shadowMapFrameBuffer);
	
	shadowMapRenderBuffer = gl.createRenderbuffer();
	gl.bindRenderbuffer(gl.RENDERBUFFER, shadowMapRenderBuffer);
	gl.renderbufferStorage(gl.RENDERBUFFER,gl.DEPTH_COMPONENT16, textureSize, textureSize);
	
	//unbind
	gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	gl.bindRenderbuffer(gl.RENDERBUFFER, null);
	
	//Prendo le location di uniform e attributes
	//texture program
	matWorldLocation = gl.getUniformLocation(programTexture, 'mWorld');
	matViewLocation = gl.getUniformLocation(programTexture, 'mView');
	matProjLocation = gl.getUniformLocation(programTexture, 'mProj');
	
	pointLightPosition = gl.getUniformLocation(programTexture, 'pointLightPosition');
	
	_position = gl.getAttribLocation(programTexture, 'vertPos');
	_texture = gl.getAttribLocation(programTexture, 'vertTexCoord');
	_normals = gl.getAttribLocation(programTexture, 'vertNormal');
	
	//no shadow program
	matWorldLocationC = gl.getUniformLocation(programColor, 'mWorld');
	matViewLocationC = gl.getUniformLocation(programColor, 'mView');
	matProjLocationC = gl.getUniformLocation(programColor, 'mProj');
	
	pointLightPositionC = gl.getUniformLocation(programColor, 'pointLightPosition');
	meshColor = gl.getUniformLocation(programColor, 'meshColor');
	
	_positionC = gl.getAttribLocation(programColor, 'vertPos');
	_normalsC = gl.getAttribLocation(programColor, 'vertNormal');
	
	//shadow program
	matWorldLocationS = gl.getUniformLocation(programShadow, 'mWorld');
	matViewLocationS = gl.getUniformLocation(programShadow, 'mView');
	matProjLocationS = gl.getUniformLocation(programShadow, 'mProj');
	
	pointLightPositionS = gl.getUniformLocation(programShadow, 'pointLightPosition');
	meshColorS = gl.getUniformLocation(programShadow, 'meshColor');
	lightShadowMapS = gl.getUniformLocation(programShadow, 'lightShadowMap');
	shadowClipNearFarS = gl.getUniformLocation(programShadow, 'shadowClipNearFar');
	
	_positionS = gl.getAttribLocation(programShadow, 'vertPos');
	_normalsS = gl.getAttribLocation(programShadow, 'vertNormal');
	
	//shadow map program
	matWorldLocationSM = gl.getUniformLocation(programShadowMap, 'mWorld');
	matViewLocationSM = gl.getUniformLocation(programShadowMap, 'mView');
	matProjLocationSM = gl.getUniformLocation(programShadowMap, 'mProj');
	
	pointLightPositionSM = gl.getUniformLocation(programShadowMap, 'pointLightPosition');
	shadowClipNearFarSM = gl.getUniformLocation(programShadowMap, 'shadowClipNearFar');
	
	_positionSM = gl.getAttribLocation(programShadowMap, 'vertPos');
	
	//texture shadow program
	matWorldLocationTS = gl.getUniformLocation(programTextureShadow, 'mWorld');
	matViewLocationTS = gl.getUniformLocation(programTextureShadow, 'mView');
	matProjLocationTS = gl.getUniformLocation(programTextureShadow, 'mProj');
	
	pointLightPositionTS = gl.getUniformLocation(programTextureShadow, 'pointLightPosition');
	
	_positionTS = gl.getAttribLocation(programTextureShadow, 'vertPos');
	_textureTS = gl.getAttribLocation(programTextureShadow, 'vertTexCoord');
	_normalsTS = gl.getAttribLocation(programTextureShadow, 'vertNormal');
	
	shadowClipNearFarTS = gl.getUniformLocation(programTextureShadow, 'shadowClipNearFar');
	lightShadowMapTS = gl.getUniformLocation(programTextureShadow, 'lightShadowMap');
	
	//creo camere per le facce del cubo: positiveX,negativeX,positiveY,negativeY,positiveZ,negativeZ
	shadowMapCameras = [
		//positiveX
		new Camera(lightPosition,m4.addVectors(lightPosition,[1,0,0]),[0,-1,0]),
		//negativeX
		new Camera(lightPosition,m4.addVectors(lightPosition,[-1,0,0]),[0,-1,0]),
		//positiveY
		new Camera(lightPosition,m4.addVectors(lightPosition,[0,1,0]),[0,0,1]),
		//negativeY
		new Camera(lightPosition,m4.addVectors(lightPosition,[0,-1,0]),[0,0,-1]),
		//positiveZ
		new Camera(lightPosition,m4.addVectors(lightPosition,[0,0,1]),[0,-1,0]),
		//negativeZ
		new Camera(lightPosition,m4.addVectors(lightPosition,[0,0,-1]),[0,-1,0]),
	];
	
	shadowMapViewMatrices = [
		shadowMapCameras[0].getViewMatrix(m4.identity()),
		shadowMapCameras[1].getViewMatrix(m4.identity()),
		shadowMapCameras[2].getViewMatrix(m4.identity()),
		shadowMapCameras[3].getViewMatrix(m4.identity()),
		shadowMapCameras[4].getViewMatrix(m4.identity()),
		shadowMapCameras[5].getViewMatrix(m4.identity())
	];
	
	shadowClipNearFar = [0.05,15.0];
	
	shadowMapProj = m4.perspective(degToRad(90), 1.0, shadowClipNearFar[0], shadowClipNearFar[1]);
	
	//creazione elementi interfaccia utente
	webglLessonsUI.setupUI(document.querySelector('#ui'), settings, [
		{ type: 'slider',   key: 'Spinning_velocity', min: 0, max: 10, precision: 2, step: 0.5, },
		{ type: 'checkbox', key: 'Shadows', },
		{ type: 'checkbox', key: 'Dinosaur', },
	]);
	
	//assegno audio a variabili globali per utilizzarla nel render
	audioM = monkeyAudio;
	audioD = rexAudio;
	interact = false;
	
	//assegno immagini a variabili globali per utilizzarle nel render
	movWheelImage = imageRM;
	movForwardImage = imageUp;
	
	begin();
};

function begin() {
	console.log('Beginning demo scene');
	
	var position =[0,0,-6], target = [0,0,0], up =[0,1,0];
	
	camera = new Camera(position,target,up);
	viewMatrix = m4.identity();
	//posiziono la camera non dove voglio
	camera.moveUp(1.5);
	viewMatrix = camera.getViewMatrix(viewMatrix);
	
	aspect =  canvas.width/canvas.height;
	projMatrix = m4.perspective(degToRad(45), aspect, 0.1, 1000.0);
	
	//gestione eventi 
	window.addEventListener('keydown', doKeyDown, false);
	window.addEventListener('keyup', doKeyUp, false);
	window.addEventListener('resize',onResizeWindow,false);
	canvas.addEventListener('touchstart',mouseDown,false);
	canvas.addEventListener('touchmove',mouseMove,false);
	canvas.addEventListener('touchend',mouseUp,false);
	canvas.onmousedown=mouseDown;
	canvas.onmouseup=mouseUp;
	canvas.mouseout=mouseUp;
	canvas.onmousemove=mouseMove;
	
	textCanvas.addEventListener('touchstart',mouseDown,false);
	textCanvas.addEventListener('touchmove',mouseMove,false);
	textCanvas.addEventListener('touchend',mouseUp,false);
	textCanvas.onmousedown=mouseDown;
	textCanvas.onmouseup=mouseUp;
	textCanvas.mouseout=mouseUp;
	textCanvas.onmousemove=mouseMove;
	
	keyboardCanvas.addEventListener('touchstart',mouseDownTouch,false);
	keyboardCanvas.addEventListener('touchend',mouseUpTouch,false);
	keyboardCanvas.onmousedown=mouseDownTouch;
	keyboardCanvas.onmouseup=mouseUpTouch;
	keyboardCanvas.mouseout=mouseUp;
	keyboardCanvas.onmousemove=mouseMove;
	
	//ciclo di rendering
	var time_old=0;
	var loop = function (currentFrameTime) {
		var dt=currentFrameTime-time_old; 
		time_old=currentFrameTime;
		
		update(dt);
		
		if(settings.Shadows==true){
			generateShadowMap();
		}
		
		render();
		
		requestAnimationFrame(loop);
	};
	requestAnimationFrame(loop);
	
	onResizeWindow();
};

function update(dt) {
	//Faccio ruotate la scimmia
	var angle = dt*0.05;
	monkeyMesh.worldMatrix = m4.yRotate(monkeyMesh.worldMatrix,degToRad(angle*settings.Spinning_velocity));
	
	//Animazione dinosauro
	if(settings.Dinosaur==true){
		if(rexMesh.worldMatrix[13]>0.48621 && up==false){
			rexMesh.worldMatrix = m4.translate(rexMesh.worldMatrix,0,-0.1,0);
			if(rexMesh.worldMatrix[13]<0.48621){
				up=true;
			}
		}
		if(rexMesh.worldMatrix[13]<1.99 && up==true){
			rexMesh.worldMatrix = m4.translate(rexMesh.worldMatrix,0,0.1,0);
			if(rexMesh.worldMatrix[13]>1.99){
				up=false;
			}
		}
	}

	//controllo i tasti premuti da tastiera o dal touch screen
	if ((PressedKeys.Forward && !PressedKeys.Back) || PressedTouch.Forward) {
		camera.moveForward(dt * 0.001 * MoveForwardSpeed);
	}
	
	if ((PressedKeys.Back && !PressedKeys.Forward) || PressedTouch.Back) {
		camera.moveForward(-dt * 0.001 * MoveForwardSpeed);
	}
	
	if ((PressedKeys.Right && !PressedKeys.Left) || PressedTouch.Right) {
		camera.moveRight(dt * 0.001 * MoveForwardSpeed);
	}
	
	if ((PressedKeys.Left && !PressedKeys.Right) || PressedTouch.Left) {
		camera.moveRight(-dt * 0.001 * MoveForwardSpeed);
	}
	
	if ((PressedKeys.Up && !PressedKeys.Down) || PressedTouch.Up) {
		camera.moveUp(dt * 0.001 * MoveForwardSpeed);
	}
	
	if ((PressedKeys.Down && !PressedKeys.Up) || PressedTouch.Down) {
		camera.moveUp(-dt * 0.001 * MoveForwardSpeed);
	}
	
	if (PressedKeys.RotRight && !PressedKeys.RotLeft) {
		camera.rotateRight(-dt * 0.001 * RotateSpeed);
	}
	
	if (PressedKeys.RotLeft && !PressedKeys.RotRight) {
		camera.rotateRight(dt * 0.001 * RotateSpeed);
	}
	
	//possibile interazione con la scimmia 
	if (PressedKeys.Interact && interact) {
		audioM.play();
		PressedKeys.Interact = false;
	}
	
	//prendo la view matrix dalla camera dopo gli spostamenti
	viewMatrix = camera.getViewMatrix(viewMatrix);
};

function generateShadowMap() {
	
	//setto program e buffer
	gl.useProgram(programShadowMap);
	
	gl.bindTexture(gl.TEXTURE_CUBE_MAP, shadowMapCube);
	gl.bindFramebuffer(gl.FRAMEBUFFER, shadowMapFrameBuffer);
	gl.bindRenderbuffer(gl.RENDERBUFFER, shadowMapRenderBuffer);
	
	gl.viewport(0,0,textureSize,textureSize);
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	
	//setto uniform uguali per tutte le camere
	gl.uniform2fv(shadowClipNearFarSM, shadowClipNearFar);
	gl.uniform3fv(pointLightPositionSM, lightPosition);
	gl.uniformMatrix4fv(matProjLocationSM,gl.FALSE, shadowMapProj);
	
	//disegno una visione per ogni camera, molto dispendioso
	for(var i=0; i < shadowMapCameras.length; i++){

		//setto uniform diverse per ogni camera
		gl.uniformMatrix4fv(matViewLocationSM , gl.FALSE, shadowMapViewMatrices[i]);
		
		//setto destinazione del framebuffer 
		gl.framebufferTexture2D(
			gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,
			gl.TEXTURE_CUBE_MAP_POSITIVE_X + i,
			shadowMapCube,0
		);
		
		//setto render buffer per le profondità al mio frame buffer
		gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, shadowMapRenderBuffer);
		
		//pulisco mettendo il valore massimo possibile di 'distanza':1
		gl.clearColor(0,0,0,1);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		
		//disegno tutti gli oggetti
			
		gl.uniformMatrix4fv(matWorldLocationSM, gl.FALSE, monkeyMesh.worldMatrix);		
		gl.bindBuffer(gl.ARRAY_BUFFER, monkeyMesh.vertexBuffer);
		gl.vertexAttribPointer(_positionSM, 3, gl.FLOAT, gl.FALSE,0,0);
		gl.enableVertexAttribArray(_positionSM);
		gl.bindBuffer(gl.ARRAY_BUFFER,null);
		
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, monkeyMesh.indexBuffer);
		gl.drawElements(gl.TRIANGLES,monkeyMesh.nPoints,  gl.UNSIGNED_SHORT, 0);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,null);
			
		gl.uniformMatrix4fv(matWorldLocationSM, gl.FALSE, tableMesh.worldMatrix);
		gl.bindBuffer(gl.ARRAY_BUFFER, tableMesh.vertexBuffer);
		gl.vertexAttribPointer(_positionSM, 3, gl.FLOAT, gl.FALSE,0,0);
		gl.enableVertexAttribArray(_positionSM);
		gl.bindBuffer(gl.ARRAY_BUFFER,null);
		
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, tableMesh.indexBuffer);
		gl.drawElements(gl.TRIANGLES,tableMesh.nPoints,  gl.UNSIGNED_SHORT, 0);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,null);
			
		gl.uniformMatrix4fv(matWorldLocationSM, gl.FALSE, sofaMesh.worldMatrix);
		gl.bindBuffer(gl.ARRAY_BUFFER, sofaMesh.vertexBuffer);
		gl.vertexAttribPointer(_positionSM, 3, gl.FLOAT, gl.FALSE,0,0);
		gl.enableVertexAttribArray(_positionSM);
		gl.bindBuffer(gl.ARRAY_BUFFER,null);
		
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sofaMesh.indexBuffer);
		gl.drawElements(gl.TRIANGLES,sofaMesh.nPoints,  gl.UNSIGNED_SHORT, 0);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,null);
		
		gl.uniformMatrix4fv(matWorldLocationSM, gl.FALSE, wallsMesh.worldMatrix);
		gl.bindBuffer(gl.ARRAY_BUFFER, wallsMesh.vertexBuffer);
		gl.vertexAttribPointer(_positionSM, 3, gl.FLOAT, gl.FALSE,0,0);
		gl.enableVertexAttribArray(_positionSM);
		gl.bindBuffer(gl.ARRAY_BUFFER,null);
		
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, wallsMesh.indexBuffer);
		gl.drawElements(gl.TRIANGLES,wallsMesh.nPoints,  gl.UNSIGNED_SHORT, 0);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,null);
		
		if(settings.Dinosaur==true){
			gl.uniformMatrix4fv(matWorldLocationSM, gl.FALSE, rexMesh.worldMatrix);
			gl.bindBuffer(gl.ARRAY_BUFFER, rexMesh.vertexBuffer);
			gl.vertexAttribPointer(_positionSM, 3, gl.FLOAT, gl.FALSE,0,0);
			gl.enableVertexAttribArray(_positionSM);
			gl.bindBuffer(gl.ARRAY_BUFFER,null);
			
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, rexMesh.indexBuffer);
			gl.drawElements(gl.TRIANGLES,rexMesh.nPoints,  gl.UNSIGNED_SHORT, 0);
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,null);
		}
	}
	
	//unbind
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	gl.bindRenderbuffer(gl.RENDERBUFFER, null);
	gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
	
};


function render() {
	
	//render per canvas che gestisce interazione
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	
	if((camera.position[0]<2.6 && camera.position[0]>-0.5) && (camera.position[1]<2.15 && camera.position[1]>1.3) && (camera.position[2]<2.5 && camera.position[2]>-1.5)){
		interact=true;
		ctx.font = '28pt Calibri';
		ctx.fillStyle = 'white'; 
		ctx.fillText('Press E or left click to interact', 160, 150);
	}else{
		interact=false;
	}
	
	//render per canvas che gestisce immagini movimento mobile
	keyCtx.clearRect(0, 0, keyCtx.canvas.width, keyCtx.canvas.height);
	keyCtx.drawImage(movWheelImage,0,0);
	keyCtx.drawImage(movForwardImage,300,0);
	
	//render per canvas con scena principale
	gl.clearColor(0.7,0.8,0.8,1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.viewport(0.0, 0.0, canvas.width, canvas.height);	
	gl.enable(gl.DEPTH_TEST);
	
	//non renderizzo quello che è dietro
	gl.enable(gl.CULL_FACE);
	gl.frontFace(gl.CCW);
	gl.cullFace(gl.BACK);
		
	
	if(settings.Shadows==true){
		//per render con le ombre
		//mesh con texture
		gl.useProgram(programTextureShadow);
	
		gl.uniform2fv(shadowClipNearFarTS,shadowClipNearFar);
		//nella posizione 0 metterò le texture delle mesh
		gl.uniform1i(lightShadowMapTS,1);
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, shadowMapCube);
		
		gl.uniformMatrix4fv(matViewLocationTS, gl.FALSE, viewMatrix);
		gl.uniformMatrix4fv(matProjLocationTS, gl.FALSE, projMatrix);
		gl.uniform3fv(pointLightPositionTS, lightPosition);
			
		gl.uniformMatrix4fv(matWorldLocationTS, gl.FALSE, monkeyMesh.worldMatrix);
			
		drawMonkeyMesh(_positionTS,_normalsTS,_textureTS);
		
		gl.uniformMatrix4fv(matWorldLocationTS, gl.FALSE, tableMesh.worldMatrix);
			
		drawTableMesh(_positionTS,_normalsTS,_textureTS);
		
		//mesh senza texture
		gl.useProgram(programShadow);
	
		gl.uniform2fv(shadowClipNearFarS,shadowClipNearFar);
		//quì posso usare la posizione 0 dato che le mesh non hanno texture
		gl.uniform1i(lightShadowMapS,0);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, shadowMapCube);
		
		gl.uniformMatrix4fv(matViewLocationS, gl.FALSE, viewMatrix);
		gl.uniformMatrix4fv(matProjLocationS, gl.FALSE, projMatrix);
		gl.uniform3fv(pointLightPositionS, lightPosition);
			
		gl.uniformMatrix4fv(matWorldLocationS, gl.FALSE, sofaMesh.worldMatrix);
		gl.uniform4fv(meshColorS, sofaMesh.color);
		drawSofaMesh(_positionS,_normalsS);
		
		gl.uniformMatrix4fv(matWorldLocationS, gl.FALSE, lightBulbMesh.worldMatrix);	
		gl.uniform4fv(meshColorS, lightBulbMesh.color);
		drawLightMesh(_positionS,_normalsS);
		
		gl.uniformMatrix4fv(matWorldLocationS, gl.FALSE, wallsMesh.worldMatrix);
		gl.uniform4fv(meshColorS, wallsMesh.color);
		drawWallsMesh(_positionS,_normalsS);
		
		if(settings.Dinosaur==true){
			if(settings.Dinosaur!=oldDinoValue){
				audioD.play();
				oldDinoValue=true;
			}
			gl.uniformMatrix4fv(matWorldLocationS, gl.FALSE, rexMesh.worldMatrix);
			gl.uniform4fv(meshColorS, rexMesh.color);
			drawRexMesh(_positionS,_normalsS);
		}else{
			oldDinoValue=false;
		}
		
	}else {
		//per render senza le ombre
		//mesh con texture
		gl.useProgram(programTexture);
	
		gl.uniformMatrix4fv(matViewLocation, gl.FALSE, viewMatrix);
		gl.uniformMatrix4fv(matProjLocation, gl.FALSE, projMatrix);
		gl.uniform3fv(pointLightPosition, lightPosition);
			
		gl.uniformMatrix4fv(matWorldLocation, gl.FALSE, monkeyMesh.worldMatrix);
			
		drawMonkeyMesh(_position,_normals,_texture);
		
		gl.uniformMatrix4fv(matWorldLocation, gl.FALSE, tableMesh.worldMatrix);
			
		drawTableMesh(_position,_normals,_texture);
		
		//mesh senza texture
		gl.useProgram(programColor);
		
		//uniform generali
		gl.uniformMatrix4fv(matViewLocationC, gl.FALSE, viewMatrix);
		gl.uniformMatrix4fv(matProjLocationC, gl.FALSE, projMatrix);
		gl.uniform3fv(pointLightPositionC, lightPosition);
			
		gl.uniformMatrix4fv(matWorldLocationC, gl.FALSE, sofaMesh.worldMatrix);
		gl.uniform4fv(meshColor, sofaMesh.color);
		drawSofaMesh(_positionC,_normalsC);
		
		gl.uniformMatrix4fv(matWorldLocationC, gl.FALSE, lightBulbMesh.worldMatrix);	
		gl.uniform4fv(meshColor, lightBulbMesh.color);
		drawLightMesh(_positionC,_normalsC);
		
		gl.uniformMatrix4fv(matWorldLocationC, gl.FALSE, wallsMesh.worldMatrix);
		gl.uniform4fv(meshColor, wallsMesh.color);
		drawWallsMesh(_positionC,_normalsC);
		
		if(settings.Dinosaur==true){
			if(settings.Dinosaur!=oldDinoValue){
				audioD.play();
				oldDinoValue=true;
			}
			gl.uniformMatrix4fv(matWorldLocationC, gl.FALSE, rexMesh.worldMatrix);
			gl.uniform4fv(meshColor, rexMesh.color);
			drawRexMesh(_positionC,_normalsC);
		}else{
			oldDinoValue=false;
		}
		
	}
		
};

function onResizeWindow() {	
	var targetHeight = window.innerWidth * 9/16;
	if(window.innerHeight > targetHeight) {
		//centro verticalmente la canvas
		canvas.width = window.innerWidth;
		canvas.height = targetHeight; 
		canvas.style.left = '0px';
		canvas.style.top = (window.innerHeight - targetHeight) / 2 + 'px';
		
		ui.style.left = '0px';
		ui.style.top = (window.innerHeight - targetHeight) / 2 + 'px';
		 
		keyboardCanvas.style.left = (window.innerWidth - gl.canvas.width) / 2 + 'px';
		keyboardCanvas.style.top = '67%';
		
	}else {
		//centro orizzontalmente la canvas
		canvas.width = window.innerHeight * 16/9;
		canvas.height = window.innerHeight;
		canvas.style.left = (window.innerWidth - gl.canvas.width) / 2 + 'px';
		canvas.style.top = '0px';
		
		ui.style.left = (window.innerWidth - gl.canvas.width) / 2 + 'px';
		ui.style.top = '0px';
		
		keyboardCanvas.style.left = (window.innerWidth - gl.canvas.width) / 2 + 'px';
		keyboardCanvas.style.top = '67%';
	}
	//setto la viewport con le nuova larghezza e altezza della canvas
	gl.viewport(0.0, 0.0, gl.canvas.width, gl.canvas.height);
};

function drawMonkeyMesh(_pos,_norm,_text) {
	gl.bindBuffer(gl.ARRAY_BUFFER, monkeyMesh.vertexBuffer);
	gl.vertexAttribPointer(_pos, 3, gl.FLOAT, gl.FALSE,0,0);
	gl.enableVertexAttribArray(_pos);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, monkeyMesh.textureBuffer);
	gl.vertexAttribPointer(_text, 2, gl.FLOAT, gl.FALSE,0,0);
	gl.enableVertexAttribArray(_text);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, monkeyMesh.normalBuffer);
	gl.vertexAttribPointer(_norm, 3, gl.FLOAT, gl.FALSE,0,0);
	gl.enableVertexAttribArray(_norm);
	
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, boxTexture);
	
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, monkeyMesh.indexBuffer);
	gl.drawElements(gl.TRIANGLES,monkeyMesh.nPoints,  gl.UNSIGNED_SHORT, 0);
};

function drawTableMesh(_pos,_norm,_text) {
	gl.bindBuffer(gl.ARRAY_BUFFER, tableMesh.vertexBuffer);
	gl.vertexAttribPointer(_pos, 3, gl.FLOAT, gl.FALSE,0,0);
	gl.enableVertexAttribArray(_pos);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, tableMesh.textureBuffer);
	gl.vertexAttribPointer(_text, 2, gl.FLOAT, gl.FALSE,0,0);
	gl.enableVertexAttribArray(_text);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, tableMesh.normalBuffer);
	gl.vertexAttribPointer(_norm, 3, gl.FLOAT, gl.FALSE,0,0);
	gl.enableVertexAttribArray(_norm);
	
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, boxTextureT);
	
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, tableMesh.indexBuffer);
	gl.drawElements(gl.TRIANGLES,tableMesh.nPoints,  gl.UNSIGNED_SHORT, 0);
};

function drawSofaMesh(_pos,_norm) {
	gl.bindBuffer(gl.ARRAY_BUFFER, sofaMesh.vertexBuffer);
	gl.vertexAttribPointer(_pos, 3, gl.FLOAT, gl.FALSE,0,0);
	gl.enableVertexAttribArray(_pos);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, sofaMesh.normalBuffer);
	gl.vertexAttribPointer(_norm, 3, gl.FLOAT, gl.FALSE,0,0);
	gl.enableVertexAttribArray(_norm);
	
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sofaMesh.indexBuffer);
	gl.drawElements(gl.TRIANGLES,sofaMesh.nPoints,  gl.UNSIGNED_SHORT, 0);
};

function drawLightMesh(_pos,_norm) {
	gl.bindBuffer(gl.ARRAY_BUFFER, lightBulbMesh.vertexBuffer);
	gl.vertexAttribPointer(_pos, 3, gl.FLOAT, gl.FALSE,0,0);
	gl.enableVertexAttribArray(_pos);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, lightBulbMesh.normalBuffer);
	gl.vertexAttribPointer(_norm, 3, gl.FLOAT, gl.FALSE,0,0);
	gl.enableVertexAttribArray(_norm);
	
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, lightBulbMesh.indexBuffer);
	gl.drawElements(gl.TRIANGLES,lightBulbMesh.nPoints,  gl.UNSIGNED_SHORT, 0);
};

function drawWallsMesh(_pos,_norm) {
	gl.bindBuffer(gl.ARRAY_BUFFER, wallsMesh.vertexBuffer);
	gl.vertexAttribPointer(_pos, 3, gl.FLOAT, gl.FALSE,0,0);
	gl.enableVertexAttribArray(_pos);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, wallsMesh.normalBuffer);
	gl.vertexAttribPointer(_norm, 3, gl.FLOAT, gl.FALSE,0,0);
	gl.enableVertexAttribArray(_norm);
	
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, wallsMesh.indexBuffer);
	gl.drawElements(gl.TRIANGLES,wallsMesh.nPoints,  gl.UNSIGNED_SHORT, 0);
};

function drawRexMesh(_pos,_norm) {
	gl.bindBuffer(gl.ARRAY_BUFFER, rexMesh.vertexBuffer);
	gl.vertexAttribPointer(_pos, 3, gl.FLOAT, gl.FALSE,0,0);
	gl.enableVertexAttribArray(_pos);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, rexMesh.normalBuffer);
	gl.vertexAttribPointer(_norm, 3, gl.FLOAT, gl.FALSE,0,0);
	gl.enableVertexAttribArray(_norm);
	
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, rexMesh.indexBuffer);
	gl.drawElements(gl.TRIANGLES,rexMesh.nPoints,  gl.UNSIGNED_SHORT, 0);
};

var mouseDown=function(e) {
	if(interact){
		PressedKeys.Interact = true;
	}else{
		drag=true;
		old_x=e.pageX, old_y=e.pageY;
		e.preventDefault();
	}
};

var mouseUp=function(e){
   drag=false;
};

var mouseMove=function(e) {
	if (!drag){
		return false; 
	}
	dX=-(e.pageX-old_x)*2*Math.PI/canvas.width; 
	camera.rotateRight(-dX);
	old_x=e.pageX;
	e.preventDefault();
};


var mouseDownTouch=function(e) {
	var rect = keyboardCanvas.getBoundingClientRect();
	//per prendere x e y indipendenti dalla posizione della canvas
    x = e.pageX - rect.left;
    y = e.pageY - rect.top;
	if((x>6 && x<80) && (y>105 && y<195)){
		PressedTouch.Left = true;
	}
	if((x>225 && x<290) && (y>105 && y<195)){
		PressedTouch.Right = true;
	}
	if((x>105 && x<195) && (y>6 && y<80)){
		PressedTouch.Forward = true;
	}
	if((x>105 && x<195) && (y>225 && y<290)){
		PressedTouch.Back = true;
	}
	if((x>305 && x<440) && (y>6 && y<140)){
		PressedTouch.Up = true;
	}
	if((x>305 && x<440) && (y>150 && y<290)){
		PressedTouch.Down = true;
	}
};

var mouseUpTouch=function(e){
	//se parto con il drag dall canvas vero e arrivo su questa
	drag=false;
	
	//gestione touch, elimino qualsiasi tasto premuto
    PressedTouch.Left = false;
    PressedTouch.Right = false;
    PressedTouch.Forward = false;
    PressedTouch.Back = false;
    PressedTouch.Up = false;
    PressedTouch.Down = false;
};

function doKeyDown (e) {
	switch(e.code) {
		case 'KeyW':
			PressedKeys.Forward = true;
			break;
		case 'KeyA':
			PressedKeys.Left = true;
			break;
		case 'KeyD':
			PressedKeys.Right = true;
			break;
		case 'KeyS':
			PressedKeys.Back = true;
			break;
		case 'ArrowUp':
			PressedKeys.Up = true;
			break;
		case 'ArrowDown':
			PressedKeys.Down = true;
			break;
		case 'ArrowRight':
			PressedKeys.RotRight = true;
			break;
		case 'ArrowLeft':
			PressedKeys.RotLeft = true;
			break;
		case 'KeyE':
			PressedKeys.Interact = true;
			break;
	}
};

function doKeyUp(e) {
	switch(e.code) {
		case 'KeyW':
			PressedKeys.Forward = false;
			break;
		case 'KeyA':
			PressedKeys.Left = false;
			break;
		case 'KeyD':
			PressedKeys.Right = false;
			break;
		case 'KeyS':
			PressedKeys.Back = false;
			break;
		case 'ArrowUp':
			PressedKeys.Up = false;
			break;
		case 'ArrowDown':
			PressedKeys.Down = false;
			break;
		case 'ArrowRight':
			PressedKeys.RotRight = false;
			break;
		case 'ArrowLeft':
			PressedKeys.RotLeft = false;
			break;
		case 'KeyE':
			PressedKeys.Interact = false;
			break;
	}
};