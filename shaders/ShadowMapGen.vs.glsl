precision mediump float;
attribute vec3 vertPos;

varying vec3 fragPos;

uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj;

void main()
{
	fragPos = (mWorld * vec4(vertPos,1.0)).xyz;
	
	gl_Position = mProj * mView * vec4(fragPos,1.0);
}