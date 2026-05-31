uniform float uTime;
uniform vec3 uColorA;
uniform vec3 uColorB;
varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
  vec2 uv = vUv;
  float n = noise(uv * 3.0 + vec2(uTime * 0.05, uTime * 0.03));
  float n2 = noise(uv * 6.0 - vec2(uTime * 0.04, 0.0));
  float t = clamp(uv.y * 0.55 + n * 0.4 + n2 * 0.12, 0.0, 1.0);
  vec3 col = mix(uColorA, uColorB, t);

  // soft vignette
  float dd = distance(uv, vec2(0.5));
  col *= smoothstep(1.1, 0.1, dd) * 0.55 + 0.55;

  gl_FragColor = vec4(col, 1.0);
}
