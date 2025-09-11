const { vertexShader, fragmentShader } = require('./shaders.js');

describe('Shader exports', () => {
  test('vertexShader should be exported as a string', () => {
    expect(typeof vertexShader).toBe('string');
    expect(vertexShader.length).toBeGreaterThan(0);
  });

  test('fragmentShader should be exported as a string', () => {
    expect(typeof fragmentShader).toBe('string');
    expect(fragmentShader.length).toBeGreaterThan(0);
  });

  test('vertexShader should contain required GLSL components', () => {
    expect(vertexShader).toContain('uniform sampler2D bumpTexture');
    expect(vertexShader).toContain('uniform float bumpScale');
    expect(vertexShader).toContain('varying float vAmount');
    expect(vertexShader).toContain('varying vec2 vUV');
    expect(vertexShader).toContain('void main()');
    expect(vertexShader).toContain('gl_Position');
  });

  test('fragmentShader should contain required GLSL components', () => {
    expect(fragmentShader).toContain('uniform sampler2D terrainTexture');
    expect(fragmentShader).toContain('varying vec2 vUV');
    expect(fragmentShader).toContain('varying float vAmount');
    expect(fragmentShader).toContain('uniform lowp float shadows');
    expect(fragmentShader).toContain('uniform lowp float highlights');
    expect(fragmentShader).toContain('void main()');
    expect(fragmentShader).toContain('gl_FragColor');
  });

  test('vertexShader should have proper GLSL syntax structure', () => {
    // Check for balanced braces
    const openBraces = (vertexShader.match(/\{/g) || []).length;
    const closeBraces = (vertexShader.match(/\}/g) || []).length;
    expect(openBraces).toBe(closeBraces);
    
    // Check for semicolons at end of statements
    expect(vertexShader).toMatch(/;\s*$/m);
  });

  test('fragmentShader should have proper GLSL syntax structure', () => {
    // Check for balanced braces
    const openBraces = (fragmentShader.match(/\{/g) || []).length;
    const closeBraces = (fragmentShader.match(/\}/g) || []).length;
    expect(openBraces).toBe(closeBraces);
    
    // Check for semicolons at end of statements
    expect(fragmentShader).toMatch(/;\s*$/m);
  });

  test('shaders should contain luminance weighting constant', () => {
    expect(fragmentShader).toContain('luminanceWeighting');
    expect(fragmentShader).toContain('vec3(0.3, 0.3, 0.3)');
  });

  test('fragmentShader should contain color manipulation logic', () => {
    expect(fragmentShader).toContain('source.r');
    expect(fragmentShader).toContain('source.g');
    expect(fragmentShader).toContain('source.b');
    expect(fragmentShader).toContain('sin(');
  });
});