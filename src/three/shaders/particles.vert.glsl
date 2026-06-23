uniform float uTime;
uniform float uPixelRatio;
uniform float uSize;

attribute float aScale;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  // Animated float
  modelPosition.y += sin(uTime * 0.5 + modelPosition.x * 2.0) * 0.05;
  modelPosition.x += cos(uTime * 0.3 + modelPosition.z * 2.0) * 0.03;

  vec4 viewPosition      = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position  = projectedPosition;
  gl_PointSize = uSize * aScale * uPixelRatio * (1.0 / -viewPosition.z);
}
