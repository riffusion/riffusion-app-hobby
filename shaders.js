const vertexShader = `
// Uniforms are data that are shared between shaders
// The contain data that are uniform across the entire frame.
// The heightmap and scaling constant for each point are uniforms in this respect.

// A uniform to contain the heightmap image
uniform sampler2D bumpTexture;
// A uniform to contain the scaling constant
uniform float bumpScale;

// Varyings are variables whose values are decided in the vertext shader
// But whose values are then needed in the fragment shader

// A variable to store the height of the point
varying float vAmount;
// The UV mapping coordinates of a vertex
varying vec2 vUV;

void main()
{
    // The "coordinates" in UV mapping representation
    vUV = uv;

    // The heightmap data at those coordinates
    vec4 bumpData = texture2D(bumpTexture, uv);

    // height map is grayscale, so it doesn't matter if you use r, g, or b.
    vAmount = bumpData.r;

    // move the position along the normal
    vec3 newPosition = position + normal * bumpScale * vAmount;

    // Compute the position of the vertex using a standard formula
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
`;

const fragmentShader = `
// A uniform for the terrain texture image
uniform sampler2D terrainTexture;

// Get the varyings from the vertex shader
varying vec2 vUV;
// vAmount isn't really used, but could be if necessary
varying float vAmount;

uniform lowp float shadows;
uniform lowp float highlights;

const mediump vec3 luminanceWeighting = vec3(0.3, 0.3, 0.3);

void main()
{
    // Get the color of the fragment from the texture map
    // at that coordinate in the UV mapping
    vec4 source = texture2D(terrainTexture, vUV);

    float x = vUV.x;
    float y = vUV.y;

    float r = source.r - 0.05 - 0.0 * sin(x * 3.14 * 0.5);

    float g = source.g - 0.05 - 0.05 * sin(y * 10.0);
    float b = source.b + 0.1 - 0.05 * sin(y * 10.0);

    gl_FragColor = vec4(r, g, b, 1.0);
}

`;

module.exports = { vertexShader, fragmentShader };
