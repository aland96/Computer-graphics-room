precision mediump float;
attribute vec3 vertPos;
attribute vec3 vertNormal;

varying vec3 fragPos;
varying vec3 fragNormal;

uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj;

void main()
{
	fragPos = (mWorld * vec4(vertPos,1.0)).xyz;
	fragNormal = (mWorld * vec4(vertNormal, 0.0)).xyz;
	
	gl_Position = mProj * mView * vec4(fragPos,1.0);
}