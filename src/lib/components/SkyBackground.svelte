<script lang="ts">
  import { onMount } from 'svelte';
  import * as THREE from 'three';

  let canvas: HTMLCanvasElement;

  onMount(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      precision highp float;
      varying vec2 vUv;
      uniform float uTime;
      uniform vec2 uResolution;

      float hash(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
      }

      float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 1.0;
        for (int i = 0; i < 5; i++) {
          value += amplitude * noise(p * frequency);
          frequency *= 2.0;
          amplitude *= 0.5;
        }
        return value;
      }

      void main() {
        // Aspect-corrected UV keeps the sky and clouds natural on any screen.
        float aspect = uResolution.x / uResolution.y;
        float cloudAspect = max(aspect, 0.75);
        vec2 uv = vUv;
        vec2 p = vec2(uv.x * cloudAspect, uv.y) * 2.35;

        // Pale near the horizon, deeper blue overhead.
        vec3 horizon = vec3(0.78, 0.88, 0.96);
        vec3 zenith = vec3(0.24, 0.55, 0.82);
        float height = smoothstep(0.05, 0.92, uv.y);
        vec3 sky = mix(horizon, zenith, height);

        // Two slow, soft cloud layers.
        vec2 drift = vec2(uTime * 0.045 * cloudAspect, 0.0);
        float cloudBase = fbm(p * 0.72 + drift);
        float cloudDetail = fbm(p * 1.35 - drift * 1.4);
        float density = cloudBase * 0.78 + cloudDetail * 0.22;

        // Add broad coverage while leaving denser, softer clouds near the horizon.
        float horizonBias = mix(0.12, -0.08, uv.y);
        float clouds = smoothstep(0.36 - horizonBias, 0.52 - horizonBias, density);
        clouds *= 0.98 * smoothstep(0.02, 0.10, uv.y);

        vec3 cloudTop = vec3(0.98, 0.99, 1.00);
        vec3 cloudShade = vec3(0.74, 0.80, 0.86);
        float lighting = smoothstep(0.35, 0.82, cloudDetail);
        vec3 cloudColor = mix(cloudShade, cloudTop, lighting);
        vec3 color = mix(sky, cloudColor, clouds);

        // Broad, understated sunlight near the upper-right of the frame.
        vec2 sunPos = vec2(aspect * 0.78, 0.76);
        vec2 sunVec = vec2(uv.x * aspect, uv.y) - sunPos;
        float sunGlow = exp(-dot(sunVec, sunVec) * 18.0);
        color += vec3(1.0, 0.82, 0.52) * sunGlow * 0.12;

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: {
          value: new THREE.Vector2(canvas.clientWidth, canvas.clientHeight)
        }
      }
    });

    const quad = new THREE.Mesh(geometry, material);
    scene.add(quad);

    const timer = new THREE.Timer();
    let animationId = 0;
    let lastTime = 0;

    const renderFrame = (elapsed: number) => {
      material.uniforms.uTime.value = elapsed;
      renderer.render(scene, camera);
    };

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      timer.update();
      lastTime = timer.getElapsed();
      renderFrame(lastTime);
    };

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const startAnimation = () => {
      if (animationId) return;
      animate();
    };

    const stopAnimation = () => {
      cancelAnimationFrame(animationId);
      animationId = 0;
    };

    const applyMotionPreference = () => {
      if (motionQuery.matches) {
        stopAnimation();
        renderFrame(lastTime);
      } else {
        startAnimation();
      }
    };

    applyMotionPreference();
    motionQuery.addEventListener('change', applyMotionPreference);

    const onResize = () => {
      if (!canvas) return;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (width === 0 || height === 0) return;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height, false);
      material.uniforms.uResolution.value.set(width, height);
      renderFrame(lastTime);
    };
    window.addEventListener('resize', onResize);
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(canvas);
    onResize();

    return () => {
      stopAnimation();
      window.removeEventListener('resize', onResize);
      resizeObserver.disconnect();
      motionQuery.removeEventListener('change', applyMotionPreference);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  });
</script>

<canvas bind:this={canvas} class="quake-sky-canvas"></canvas>

<style>
  .quake-sky-canvas {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    height: 100dvh;
    z-index: -1;
    pointer-events: none;
    display: block;
    animation: sky-fade-in 2s ease-out both;
  }

  @keyframes sky-fade-in {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .quake-sky-canvas {
      animation: none;
    }
  }
</style>