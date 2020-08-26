precision mediump float;
attribute vec3 vertPos;
attribute vec2 vertTexCoord;
attribute vec3 vertNormal;

varying vec2 fragTexCoord;
varying vec3 fragNormal;
varying vec3 fragPos;

uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj;

void main()
{
	fragPos = (mWorld * vec4(vertPos,1.0)).xyz;
	fragTexCoord = vertTexCoord;
	fragNormal = (mWorld * vec4(vertNormal, 0.0)).xyz;
	gl_Position = mProj * mView * mWorld * vec4(vertPos,1.0);
}