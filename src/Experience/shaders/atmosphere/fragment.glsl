uniform vec3 uColor;
uniform vec3 uCameraPosition;

varying vec3 vNormals;
varying float vPositionz;
varying float vIntensity;

float fresnel(vec3 direction, vec3 normal, bool invert) {
    vec3 nDirection = normalize( direction );
    vec3 nNormal = normalize( normal );
    vec3 halfDirection = normalize( nNormal + nDirection );

    float cosine = dot( halfDirection, nDirection );
    float product = max( cosine, 0.0 );
    float factor = invert ? 1.0 - pow( product, 5.0 ) : pow( product, 5.0 );

    return factor;
}

void main()
{
    // float dist = 1.0 - distance(uCameraPosition, vec3(0,0,0)) / 5.0;
    // float opacity = fresnel(uCameraPosition, vNormals, true) - 0.55 + (dist * 0.2);
    // opacity *= (2.0 + dist * 5.0);
    // opacity -= max(0.0, vPositionz);

    float dist = 1.0 - distance(uCameraPosition, vec3(0,0,0)) / 5.0;
    float opacity = fresnel(uCameraPosition, vNormals, true) - 0.1 + (dist * 0.2);
    opacity *= (1.5 + dist * 0.2);
    opacity = pow(opacity, 20.0);
    opacity -= max(0.0, vPositionz);
    opacity *= 9.0;
    // gl_FragColor = vec4(uColor, opacity);


    opacity *= vIntensity;

    vec3 glow = (vec3(uColor) * 0.5 )* vIntensity;
    gl_FragColor = vec4(glow , opacity);
}
