#define PI 3.1415926535897932384626433832795

varying vec3 vColor;



void main()
{
    float strength = distance(gl_PointCoord, vec2(0.5));
    strength = 1.0 - strength;
    strength = pow(strength,10.0);

    vec3 color = mix(vec3(0.0),vColor,strength);
    gl_FragColor = vec4(color,1.0);
}