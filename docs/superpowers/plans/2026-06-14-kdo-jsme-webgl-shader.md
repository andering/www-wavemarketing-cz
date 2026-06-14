# Kdo Jsme WebGL Shader Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a panel-scoped WebGL shader enhancement to the desktop `Kdo jsme` visual while preserving a local SVG/CSS fallback.

**Architecture:** Keep the Astro static-site stack. `IntroStatement.astro` owns the decorative panel markup and fallback SVG; a new `src/scripts/intro-shader.ts` module initializes WebGL only for canvases marked with `data-intro-shader`. The shader must be scoped to the panel dimensions, use WAVE colors, skip reduced-motion users, and clean up resize listeners and animation frames.

**Tech Stack:** Astro component markup/styles, TypeScript browser module, WebGL 1, CSS fallback, Vitest textual invariants, Astro build.

---

## File Structure

- Modify `src/tests/site-content.test.ts`: update the existing intro visual invariant to require the shader canvas, fallback SVG, script import, WAVE colors, reduced-motion guard, cleanup, and forbidden dependency patterns.
- Modify `src/components/IntroStatement.astro`: keep the current local SVG fallback, add a panel-scoped canvas above it, add an inline module script import, and adjust CSS layering.
- Create `src/scripts/intro-shader.ts`: initialize the WebGL shader for `data-intro-shader` canvases, compile/link shaders, size to the host panel, animate when allowed, and clean up.
- Do not modify `package.json`, add dependencies, create `/components/ui`, add React, add Tailwind, add shadcn, add Unsplash assets, or alter section content/mobile omission.

### Task 1: Protect The WebGL Contract

**Files:**

- Modify: `src/tests/site-content.test.ts:535-588`

- [ ] **Step 1: Update the intro invariant test**

In `src/tests/site-content.test.ts`, inside `keeps the intro section as a metric-free split wave variant`, keep the existing content and SVG fallback assertions, but add WebGL-specific assertions after `expect(component).toContain("intro__wave");`:

```ts
expect(component).toContain("intro__shader-canvas");
expect(component).toContain("data-intro-shader");
expect(component).toContain("intro__fallback-wave");
expect(component).toContain("../scripts/intro-shader");
```

Replace the current animation-specific assertions after `expect(component).toContain("height: 100%;");` with this WebGL/fallback contract:

```ts
expect(component).toContain("position: absolute;");
expect(component).toContain("inset: 0;");
expect(component).toContain("opacity: 0;");
expect(component).toContain(
  '.intro__visual[data-shader-ready="true"] .intro__shader-canvas',
);
expect(component).toContain(
  '.intro__visual[data-shader-ready="true"] .intro__fallback-wave',
);
expect(component).toContain("@media (prefers-reduced-motion: reduce)");
expect(component).toContain("display: none;");
expect(component).not.toContain("components/ui");
expect(component).not.toContain("from 'react'");
expect(component).not.toContain('from "react"');
expect(component).not.toContain("tailwind");
expect(component).not.toContain("lucide-react");
```

After the `component` read, add a script read:

```ts
const shaderScript = readFileSync(
  join(process.cwd(), "src/scripts/intro-shader.ts"),
  "utf8",
);
```

Then add these script assertions before the existing metric/remote-image assertions:

```ts
expect(shaderScript).toContain("data-intro-shader");
expect(shaderScript).toContain('getContext("webgl")');
expect(shaderScript).toContain(
  'matchMedia("(prefers-reduced-motion: reduce)")',
);
expect(shaderScript).toContain("ResizeObserver");
expect(shaderScript).toContain("requestAnimationFrame");
expect(shaderScript).toContain("cancelAnimationFrame");
expect(shaderScript).toContain("removeEventListener");
expect(shaderScript).toContain("--ds-color-primary");
expect(shaderScript).toContain("--ds-color-secondary");
expect(shaderScript).toContain("--ds-color-accent");
expect(shaderScript).not.toContain("window.innerWidth");
expect(shaderScript).not.toContain("window.innerHeight");
expect(shaderScript).not.toContain("fixed top-0 left-0");
expect(shaderScript).not.toContain("React");
```

- [ ] **Step 2: Run the targeted test to verify it fails**

Run:

```bash
npm run test -- src/tests/site-content.test.ts -t "keeps the intro section as a metric-free split wave variant"
```

Expected: FAIL because `src/scripts/intro-shader.ts` does not exist and `IntroStatement.astro` does not yet contain the shader canvas or script import.

### Task 2: Add The WebGL Shader Module

**Files:**

- Create: `src/scripts/intro-shader.ts`

- [ ] **Step 1: Create the shader initializer module**

Create `src/scripts/intro-shader.ts` with this complete content:

```ts
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

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

    vec3 lines = vec3(0.0);

    for (int l = 0; l < linesPerGroup; l++) {
      float normalizedLineIndex = float(l) / float(linesPerGroup);
      float offsetPosition = float(l) + space.x * 0.42;
      float rand = random(offsetPosition + iTime * overallSpeed * 1.35) * 0.5 + 0.5;
      float halfWidth = mix(minLineWidth, maxLineWidth, rand * horizontalFade) / 2.0;
      float offset = random(offsetPosition + iTime * overallSpeed * (1.0 + normalizedLineIndex)) * mix(0.42, 1.8, horizontalFade);
      float linePosition = getPlasmaY(space.x, horizontalFade, offset);
      float line = drawSmoothLine(linePosition, halfWidth, space.y);
      lines += line * lineColor * (0.18 + rand * 0.38);
    }

    vec3 background = mix(vec3(0.94, 0.91, 0.84), vec3(0.83, 0.90, 0.86), uv.x);
    background *= 0.42 + verticalFade * 0.58;

    gl_FragColor = vec4(background + lines, 1.0);
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
  const motionQuery = window.matchMedia(REDUCED_MOTION_QUERY);
  if (motionQuery.matches) return;

  const gl = canvas.getContext("webgl", { alpha: true, antialias: true });
  if (!gl) return;

  const program = createProgram(gl);
  const host = canvas.closest<HTMLElement>(".intro__visual");
  if (!program || !host) return;

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
  let startTime = performance.now();

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
```

- [ ] **Step 2: Run TypeScript/build check for the new script**

Run:

```bash
npm run build
```

Expected: PASS. This verifies the TypeScript browser module compiles under Astro's check/build pipeline.

### Task 3: Wire The Canvas And Fallback Into IntroStatement

**Files:**

- Modify: `src/components/IntroStatement.astro:7-23`
- Modify: `src/components/IntroStatement.astro:55-144`

- [ ] **Step 1: Add the shader canvas and fallback class**

In `src/components/IntroStatement.astro`, inside `<div class="intro__visual" aria-hidden="true">`, insert the canvas immediately before the existing SVG and add the fallback class to the SVG:

```astro
      <canvas class="intro__shader-canvas" data-intro-shader></canvas>
      <svg class="intro__wave intro__fallback-wave" viewBox="0 80 720 500" role="presentation" focusable="false">
```

Keep the existing SVG paths and gradients unchanged.

- [ ] **Step 2: Add the local script import**

After the closing `</section>` and before `<style>`, add:

```astro
<script>
  import '../scripts/intro-shader';
</script>
```

- [ ] **Step 3: Layer canvas and fallback CSS**

In `src/components/IntroStatement.astro`, add these rules after `.intro__visual`:

```css
.intro__shader-canvas {
  height: 100%;
  inset: 0;
  opacity: 0;
  pointer-events: none;
  position: absolute;
  transition: opacity var(--ds-duration-slow) var(--ds-ease-standard);
  width: 100%;
}

.intro__visual[data-shader-ready="true"] .intro__shader-canvas {
  opacity: 1;
}

.intro__fallback-wave {
  transition: opacity var(--ds-duration-slow) var(--ds-ease-standard);
}

.intro__visual[data-shader-ready="true"] .intro__fallback-wave {
  opacity: 0;
}
```

In the existing `@media (prefers-reduced-motion: reduce)` block, add `.intro__shader-canvas { display: none; }`:

```css
@media (prefers-reduced-motion: reduce) {
  .intro__wave,
  .intro__ribbon {
    animation: none;
  }

  .intro__shader-canvas {
    display: none;
  }
}
```

- [ ] **Step 4: Run the targeted test to verify it passes**

Run:

```bash
npm run test -- src/tests/site-content.test.ts -t "keeps the intro section as a metric-free split wave variant"
```

Expected: PASS.

### Task 4: Full Verification

**Files:**

- Verify: full repository behavior only.

- [ ] **Step 1: Run all tests**

Run:

```bash
npm run test
```

Expected: PASS.

- [ ] **Step 2: Run the production build**

Run:

```bash
npm run build
```

Expected: PASS, including `astro check` and `astro build`.

- [ ] **Step 3: Inspect the final diff**

Run:

```bash
git diff -- docs/design-system/wave-marketing/DESIGN.md docs/website/page-map.md docs/website-production-roadmap.md docs/superpowers/specs/2026-06-14-kdo-jsme-wave-motion-design.md docs/superpowers/plans/2026-06-14-kdo-jsme-webgl-shader.md src/tests/site-content.test.ts src/components/IntroStatement.astro src/scripts/intro-shader.ts
```

Expected: The diff only contains the approved WebGL docs/spec/plan, the intro visual invariant, the `IntroStatement.astro` canvas/fallback wiring, and the local shader script. It must not add dependencies, React files, `/components/ui`, Tailwind config, shadcn setup, Unsplash assets, lucide icons, fake metrics, or remote imagery.

- [ ] **Step 4: Browser review**

Run the dev server and inspect `Kdo jsme` on desktop and mobile:

```bash
npm run dev -- --host 127.0.0.1
```

Expected desktop behavior: the shader appears only inside the `Kdo jsme` visual panel, uses calm WAVE-colored flowing lines, and does not cover the full page.

Expected mobile behavior: the `Kdo jsme` visual remains hidden.

Expected reduced-motion behavior: the shader canvas is hidden and the fallback remains available.

- [ ] **Step 5: Commit only if explicitly requested**

If the user explicitly asks for a commit, run:

```bash
git status --short
git add docs/design-system/wave-marketing/DESIGN.md docs/website/page-map.md docs/website-production-roadmap.md docs/superpowers/specs/2026-06-14-kdo-jsme-wave-motion-design.md docs/superpowers/plans/2026-06-14-kdo-jsme-webgl-shader.md src/tests/site-content.test.ts src/components/IntroStatement.astro src/scripts/intro-shader.ts
git commit -m "feat: add kdo jsme webgl shader"
```

Expected: A commit containing only the approved docs, plan, test, component, and shader script changes.

## Self-Review

- Spec coverage: The plan covers panel-scoped WebGL, local TypeScript initializer, WAVE colors, no full-page viewport sizing, fallback SVG, reduced-motion skip, cleanup of resize/listener/animation resources, unchanged mobile omission, no React/shadcn/Tailwind/new dependencies, tests, build, and browser review.
- Placeholder scan: No placeholder markers or undefined follow-up work remain.
- Type and name consistency: The test assertions match the exact implementation names: `intro__shader-canvas`, `data-intro-shader`, `intro__fallback-wave`, `src/scripts/intro-shader.ts`, `getContext("webgl")`, `ResizeObserver`, `requestAnimationFrame`, `cancelAnimationFrame`, and WAVE token names.
