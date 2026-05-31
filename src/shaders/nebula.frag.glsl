// Animated deep-space nebula + parallax starfield with a Milky-Way dust band
// and sporadic shooting stars. Resolution-driven (uses gl_FragCoord /
// uResolution) so it fills the viewport regardless of plane size.
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uReduced;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 345.45));
  p += dot(p, p + 34.345);
  return fract(p.x * p.y);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float s = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 6; i++) {
    s += a * vnoise(p);
    p = m * p;
    a *= 0.5;
  }
  return s;
}

// One layer of stars with per-star size, colour and twinkle variation.
vec3 starLayer(vec2 p, float thresh, float sizeBase) {
  vec2 g = floor(p);
  vec2 f = fract(p);
  float h = hash21(g);
  if (h < thresh) return vec3(0.0);
  vec2 c = vec2(hash21(g + 1.3), hash21(g + 2.7));
  float d = length(f - c);
  // random size, kept to a small range so stars vary but stay starlike
  float sz = sizeBase * (0.7 + 0.6 * hash21(g + 5.1));
  float core = smoothstep(sz, 0.0, d) + smoothstep(sz * 0.4, 0.0, d) * 0.5;
  // per-star twinkle phase + speed
  float ph = hash21(g + 9.7) * 6.2831;
  float spd = 1.4 + hash21(g + 3.3) * 2.6;
  float tw = 0.5 + 0.5 * sin(uTime * spd + ph);
  // per-star colour: warm ↔ white ↔ cool
  float cc = hash21(g + 7.7);
  vec3 warm = vec3(1.0, 0.80, 0.62);
  vec3 white = vec3(1.0, 0.98, 0.96);
  vec3 cool = vec3(0.68, 0.82, 1.0);
  vec3 col = mix(mix(warm, white, step(0.30, cc)), cool, step(0.66, cc));
  return col * core * tw;
}

// A single sporadic shooting star (long cycle → mostly absent, brief streak).
vec3 shootingStar(vec2 p, float aspect, float fi) {
  float seed = fi * 17.0 + 3.0;
  float cycle = 5.5 + fi * 3.3;
  float tt = uTime / cycle + hash21(vec2(seed, 0.7));
  float idx = floor(tt);
  float life = fract(tt);
  float activeFrac = 0.12;
  if (life > activeFrac) return vec3(0.0);
  float prog = life / activeFrac; // 0..1 across the sky
  float r1 = hash21(vec2(idx, seed));
  float r2 = hash21(vec2(idx, seed + 5.0));
  float r3 = hash21(vec2(idx, seed + 9.0));
  vec2 start = vec2((r1 * 2.0 - 1.0) * aspect * 0.85, 0.35 + r2 * 0.2);
  float ang = -0.35 - r2 * 0.6;
  float sx = r3 < 0.5 ? -1.0 : 1.0;
  vec2 dir = normalize(vec2(cos(ang) * sx, sin(ang)));
  vec2 head = start + dir * prog * 1.9;
  vec2 rel = p - head;
  float along = dot(rel, -dir);
  float perp = dot(rel, vec2(-dir.y, dir.x));
  float tail = smoothstep(0.33, 0.0, along) * step(-0.02, along);
  float line = smoothstep(0.006, 0.0, abs(perp));
  float headGlow = smoothstep(0.03, 0.0, length(rel));
  float envelope = smoothstep(0.0, 0.12, prog) * smoothstep(1.0, 0.78, prog);
  return vec3(0.85, 0.93, 1.0) * (tail * line * 1.2 + headGlow) * envelope;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  float aspect = uResolution.x / uResolution.y;
  vec2 p = uv - 0.5;
  p.x *= aspect;
  vec2 mo = uMouse * 0.03;

  // drifting nebula clouds
  vec2 q = p * 1.5 + mo;
  float t = uTime * 0.025;
  float n = fbm(q + vec2(t, t * 0.5));
  float n2 = fbm(q * 2.1 - vec2(t * 0.7, t * 0.2) + n);
  float clouds = n * 0.6 + n2 * 0.4;

  vec3 base = vec3(0.018, 0.027, 0.072);
  vec3 blue = vec3(0.09, 0.20, 0.48);
  vec3 violet = vec3(0.30, 0.17, 0.58);
  vec3 magenta = vec3(0.44, 0.12, 0.40);

  vec3 col = base;
  col = mix(col, blue, smoothstep(0.45, 1.0, clouds) * 0.55);
  col = mix(col, violet, smoothstep(0.55, 1.15, clouds + n2 * 0.25) * 0.7);
  col = mix(col, magenta, smoothstep(0.75, 1.2, n2) * 0.22);
  col += violet * pow(clamp(clouds - 0.25, 0.0, 1.0), 3.0) * 0.45;

  // Milky Way — a diagonal dust band with denser, smaller stars
  vec2 bdir = normalize(vec2(1.0, 0.42));
  vec2 bnorm = vec2(-bdir.y, bdir.x);
  float wob = (fbm(p * 1.6 + 7.0) - 0.5) * 0.35;
  float band = smoothstep(0.42, 0.0, abs(dot(p, bnorm) + wob));
  float dustN = fbm(p * 3.0 + 20.0);
  col += vec3(0.45, 0.50, 0.72) * band * (0.04 + dustN * 0.09);
  col += starLayer((p + mo * 0.4) * 46.0, 0.55, 0.085) * band * 1.1;

  // parallax star layers (closer layers drift more with the pointer)
  col += starLayer((p + mo * 0.6) * 9.0, 0.90, 0.13) * 0.95;
  col += starLayer((p + mo * 1.1) * 17.0, 0.93, 0.10) * 0.8;
  col += starLayer((p + mo * 1.7) * 30.0, 0.95, 0.08) * 0.65;

  // sporadic shooting stars (skip under reduced motion to avoid a frozen streak)
  if (uReduced < 0.5) {
    col += shootingStar(p, aspect, 0.0);
    col += shootingStar(p, aspect, 1.0);
  }

  // vignette
  col *= smoothstep(1.35, 0.25, length(p));

  gl_FragColor = vec4(col, 1.0);
}
