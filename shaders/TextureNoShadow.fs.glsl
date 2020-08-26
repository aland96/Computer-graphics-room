precision mediump float;

varying vec3 fragNormal;
varying vec2 fragTexCoord;
varying vec3 fragPos;

uniform vec3 pointLightPosition;
uniform sampler2D sampler;

void main()
{
	vec3 toLightNormal = normalize(pointLightPosition - fragPos);
	
	vec4 texel = texture2D(sampler, fragTexCoord);
	
	float lightIntensity = 0.2 + 2.5 * max(dot(fragNormal, toLightNormal),0.0);
	
	gl_FragColor = vec4(texel.rgb * lightIntensity, texel.a);
}