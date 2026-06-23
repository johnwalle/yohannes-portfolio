uniform vec3 uColor;

void main() {
  // Circular soft particle
  float dist = length(gl_PointCoord - vec2(0.5));
  if (dist > 0.5) discard;

  float alpha = 1.0 - smoothstep(0.2, 0.5, dist);
  gl_FragColor = vec4(uColor, alpha * 0.8);
}
