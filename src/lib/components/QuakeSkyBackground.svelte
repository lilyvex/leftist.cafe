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
        // Aspect-corrected UV so clouds stay square on any screen
        float aspect = uResolution.x / uResolution.y;
        vec2 uv = vUv;
        // Larger multiplier = smaller cloud features = more clouds on screen
        vec2 p = vec2(uv.x * aspect, uv.y) * 4.5;

        // Two scrolling layers
        vec2 uv1 = p + vec2(uTime * 0.12, 0.0);
        float cloud1 = fbm(uv1);

        vec2 uv2 = p * 1.6 + vec2(uTime * 0.28, 0.0);
        uv2 = mat2(0.866, -0.5, 0.5, 0.866) * uv2;
        float cloud2 = fbm(uv2);

        float clouds = cloud1 * 0.55 + cloud2 * 0.45;

        // Sharpen and push coverage up so the clouds read as dense/solid
        clouds = smoothstep(0.28, 0.62, clouds);
        clouds = pow(clouds, 0.55);

        // Red sky gradient
        vec3 skyLow  = vec3(0.28, 0.02, 0.01); // deep blood red
        vec3 skyHigh = vec3(0.85, 0.18, 0.06); // bright ember red

        float horizon = smoothstep(0.0, 1.0, uv.y);
        vec3 sky = mix(skyLow, skyHigh, horizon);

        // Clouds are solid black, fully opaque — mask the sky through them
        vec3 color = mix(sky, vec3(0.0), clouds);

        // Faint vignette
        float vignette = 1.0 - length(uv - 0.5) * 0.4;
        color *= vignette;

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

    const clock = new THREE.Clock();
    let animationId = 0;
    let lastTime = 0;

    const renderFrame = (elapsed: number) => {
      material.uniforms.uTime.value = elapsed;
      renderer.render(scene, camera);
    };

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      lastTime = clock.getElapsedTime();
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
  }
</style>