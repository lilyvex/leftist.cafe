<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    title?: string;
    children?: Snippet;
  }

  let { title = 'Window', children }: Props = $props();
</script>

<div class="window active primary-window flex w-full max-w-3xl max-h-full flex-col">
  <div class="title-bar">
    <div class="title-bar-text">{title}</div>
    <div class="title-bar-controls">
      <button aria-label="Minimize"></button>
      <button aria-label="Maximize"></button>
      <button aria-label="Close"></button>
    </div>
  </div>

  <div class="window-body has-space">
    {@render children?.()}
  </div>
</div>

<style>
  .primary-window {
    animation: window-open 1200ms cubic-bezier(0.16, 1, 0.3, 1) both;
    transform-origin: center;
  }

  @keyframes window-open {
    from {
      opacity: 0.25;
      transform: perspective(1200px) rotateX(28deg) translateZ(-650px) scale(0.65);
      filter: blur(8px);
    }

    to {
      opacity: 1;
      transform: perspective(1200px) rotateX(0) translateZ(0) scale(1);
      filter: blur(0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .primary-window {
      animation: none;
    }
  }
</style>