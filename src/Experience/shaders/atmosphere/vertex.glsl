attribute vec3 aNormals;

uniform vec3 viewVector;

varying vec3 vNormals;
varying float vPositionz;
varying float vIntensity;

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    vec3 actual_normal = vec3(modelMatrix * vec4(normal, 0.0));

    vIntensity = pow( dot(normalize(viewVector), actual_normal), 1.2) * 5.0;

    vNormals = aNormals;
    vPositionz = modelPosition.z;
}
