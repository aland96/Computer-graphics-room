precision mediump float;

varying vec3 fragNormal;
varying vec3 fragPos;

uniform vec3 pointLightPosition;
uniform vec4 meshColor;

void main()
{
	vec3 toLightNormal = normalize(pointLightPosition - fragPos);
	float lightIntensity = 0.2 + 0.4 * max(dot(fragNormal, toLightNormal),0.0);
	
	
	gl_FragColor = vec4(meshColor.rgb * lightIntensity, meshColor.a);
}