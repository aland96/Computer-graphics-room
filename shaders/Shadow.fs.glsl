precision mediump float;

varying vec3 fragNormal;
varying vec3 fragPos;

uniform vec3 pointLightPosition;
uniform vec4 meshColor;

uniform samplerCube lightShadowMap;
uniform vec2 shadowClipNearFar;

void main()
{
	vec3 toLightNormal = normalize(pointLightPosition - fragPos);
	vec3 fromLightToFrag = (fragPos - pointLightPosition);
	float lightFragDist = (length(fromLightToFrag) - shadowClipNearFar.x)/(shadowClipNearFar.y - shadowClipNearFar.x);
	
	float shadowMapValue = textureCube(lightShadowMap, -toLightNormal).r;
	
	float lightIntensity = 0.2;
	if((shadowMapValue + 0.0025) >= lightFragDist) {
		lightIntensity += 0.4 * max(dot(fragNormal, toLightNormal),0.0);
	}
	
	gl_FragColor = vec4(meshColor.rgb * lightIntensity, meshColor.a);
}