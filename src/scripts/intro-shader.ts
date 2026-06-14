const vertexShaderSource = `
  attribute vec4 aVertexPosition;

  void main() {
    gl_Position = aVertexPosition;
  }
`;

const fragmentShaderSource = `
  precision highp float;

  uniform vec2 iResolution;
  uniform float iTime;
  uniform vec3 uPrimary;
  uniform vec3 uSecondary;
  uniform vec3 uAccent;

  const float overallSpeed = 0.18;
  const float scale = 4.8;
  const float lineFrequency = 0.18;
  const float lineAmplitude = 0.9;
  const float minLineWidth = 0.012;
  const float maxLineWidth = 0.11;
  const int linesPerGroup = 12;

  #define drawSmoothLine(pos, halfWidth, t) smoothstep(halfWidth, 0.0, abs(pos - (t)))

  float random(float t) {
    return (cos(t) + cos(t * 1.3 + 1.3) + cos(t * 1.4 + 1.4)) / 3.0;
  }

  float getPlasmaY(float x, float horizontalFade, float offset) {
    return random(x * lineFrequency + iTime * overallSpeed) * horizontalFade * lineAmplitude + offset;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    vec2 space = (gl_FragCoord.xy - iResolution.xy / 2.0) / iResolution.x * 2.0 * scale;

    float horizontalFade = 1.0 - (cos(uv.x * 6.28318) * 0.5 + 0.5);
    float verticalFade = 1.0 - (cos(uv.y * 6.28318) * 0.5 + 0.5);

    space.y += random(space.x * 0.42 + iTime * overallSpeed) * 0.55 * (0.35 + horizontalFade);
    space.x += random(space.y * 0.35 + iTime * overallSpeed + 2.0) * 0.45 * horizontalFade;

    vec3 lineColor = mix(uPrimary, uSecondary, smoothstep(0.22, 0.84, uv.y));
    lineColor = mix(lineColor, uAccent, smoothstep(0.72, 1.0, uv.x) * 0.35);
    vec3 saturatedLineColor = min(lineColor * 1.65, vec3(1.0));

    vec3 lines = vec3(0.0);

    for (int l = 0; l < linesPerGroup; l++) {
      float normalizedLineIndex = float(l) / float(linesPerGroup);
      float offsetPosition = float(l) + space.x * 0.42;
      float rand = random(offsetPosition + iTime * overallSpeed * 1.35) * 0.5 + 0.5;
      float halfWidth = mix(minLineWidth, maxLineWidth, rand * horizontalFade) / 2.0;
      float offset = random(offsetPosition + iTime * overallSpeed * (1.0 + normalizedLineIndex)) * mix(0.42, 1.8, horizontalFade);
      float linePosition = getPlasmaY(space.x, horizontalFade, offset);
      float line = drawSmoothLine(linePosition, halfWidth, space.y);
      lines += line * saturatedLineColor * (0.34 + rand * 0.72);
    }

    float lineAlpha = clamp(length(lines) * 1.15, 0.0, 0.86);
    vec3 washColor = mix(uSecondary, uAccent, smoothstep(0.2, 0.92, uv.x));
    float washAlpha = horizontalFade * verticalFade * 0.08;

    gl_FragColor = vec4(lines + washColor * washAlpha, max(lineAlpha, washAlpha));
  }
`;

function parseCssColor(value: string): [number, number, number] {
  const color = value.trim();
  const hex = color.match(/^#([0-9a-f]{6})$/i);
  if (hex) {
    const numeric = Number.parseInt(hex[1], 16);
    return [
      ((numeric >> 16) & 255) / 255,
      ((numeric >> 8) & 255) / 255,
      (numeric & 255) / 255,
    ];
  }

  const rgb = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (rgb) {
    return [Number(rgb[1]) / 255, Number(rgb[2]) / 255, Number(rgb[3]) / 255];
  }

  return [0.0, 0.23, 0.24];
}

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
) {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function createProgram(gl: WebGLRenderingContext) {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = compileShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource,
  );
  if (!vertexShader || !fragmentShader) return null;

  const program = gl.createProgram();
  if (!program) return null;

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

function initIntroShader(canvas: HTMLCanvasElement) {
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (motionQuery.matches) return;

  const host = canvas.closest<HTMLElement>(".intro__visual");
  if (!host || getComputedStyle(host).display === "none") return;

  const bounds = host.getBoundingClientRect();
  if (bounds.width === 0 || bounds.height === 0) return;

  const gl = canvas.getContext("webgl");
  if (!gl) return;

  const program = createProgram(gl);
  if (!program) return;

  const positionBuffer = gl.createBuffer();
  if (!positionBuffer) return;

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW,
  );

  const vertexPosition = gl.getAttribLocation(program, "aVertexPosition");
  const resolution = gl.getUniformLocation(program, "iResolution");
  const time = gl.getUniformLocation(program, "iTime");
  const primary = gl.getUniformLocation(program, "uPrimary");
  const secondary = gl.getUniformLocation(program, "uSecondary");
  const accent = gl.getUniformLocation(program, "uAccent");
  const rootStyles = getComputedStyle(document.documentElement);
  const primaryColor = parseCssColor(
    rootStyles.getPropertyValue("--ds-color-primary"),
  );
  const secondaryColor = parseCssColor(
    rootStyles.getPropertyValue("--ds-color-secondary"),
  );
  const accentColor = parseCssColor(
    rootStyles.getPropertyValue("--ds-color-accent"),
  );

  let frame = 0;
  const startTime = performance.now();

  const resize = () => {
    const bounds = host.getBoundingClientRect();
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(bounds.width * pixelRatio));
    canvas.height = Math.max(1, Math.round(bounds.height * pixelRatio));
    gl.viewport(0, 0, canvas.width, canvas.height);
  };

  const render = () => {
    const currentTime = (performance.now() - startTime) / 1000;

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.uniform2f(resolution, canvas.width, canvas.height);
    gl.uniform1f(time, currentTime);
    gl.uniform3f(primary, primaryColor[0], primaryColor[1], primaryColor[2]);
    gl.uniform3f(
      secondary,
      secondaryColor[0],
      secondaryColor[1],
      secondaryColor[2],
    );
    gl.uniform3f(accent, accentColor[0], accentColor[1], accentColor[2]);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexPosition);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    frame = requestAnimationFrame(render);
  };

  const stop = () => {
    cancelAnimationFrame(frame);
    resizeObserver.disconnect();
    window.removeEventListener("pagehide", stop);
    motionQuery.removeEventListener("change", handleMotionChange);
    host.removeAttribute("data-shader-ready");
  };

  const handleMotionChange = () => {
    if (motionQuery.matches) stop();
  };

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  window.addEventListener("pagehide", stop);
  motionQuery.addEventListener("change", handleMotionChange);
  resize();
  host.setAttribute("data-shader-ready", "true");
  frame = requestAnimationFrame(render);
}

document
  .querySelectorAll<HTMLCanvasElement>("[data-intro-shader]")
  .forEach(initIntroShader);
