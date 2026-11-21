<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    title?: string;
    children?: Snippet;
  }

  let { title = 'Terminal Window', children }: Props = $props();
</script>

<div class="window terminal-window flex flex-col max-w-full max-h-full">
  <div class="title-bar">
    <div class="title-bar-text">{title}</div>
    <div class="title-bar-controls">
      <button aria-label="Minimize"></button>
      <button aria-label="Maximize"></button>
      <button aria-label="Close"></button>
    </div>
  </div>

  <div
    class="terminal-body flex-1 overflow-auto bg-black p-2.5 text-red-600 m-0 border-none text-base"
  >
    {@render children?.()}
  </div>
</div>

<style>
  .terminal-window {
    width: min(500px, calc(100vw - 2rem));
    max-height: calc(100dvh - 2rem);
    box-sizing: border-box;
    height: fit-content;
  }

  .terminal-body {
    line-height: 1.4;
  }

  .title-bar {
    background: linear-gradient(90deg, #4a0000, #b01414);
    color: #ffffff;
  }

  .title-bar-text {
    font-size: 0.6rem;
  }

  .terminal-body :global(p) {
    display: block;
    width: 100%;
    max-width: 100%;
    margin: 0;
    text-align: justify;
    text-align-last: left;
    hyphens: none;
    overflow-wrap: break-word;
    word-break: normal;
    margin-top: 5px;
    padding-left: 20px;
    padding-right: 20px;
    text-indent: none;
  }

  @media (max-width: 768px) {
    .terminal-body :global(p) {
      hyphens: auto;
    }
  }

  .terminal-body :global(h2) {
    display: block;
    font-size: 1.25rem;
    padding-left: 5px;
    margin: 0;
  }

  .terminal-body :global(h3) {
    display: block;
    font-size: 1.125rem;
    padding-left: 5px;
    margin: 0;
    margin-top: 15px;
  }

  .terminal-body :global(a) {
    color: #8f0000;
    text-decoration: underline;
  }

  .terminal-body :global(ul) {
    list-style: square;
    padding-left: 2em;
    margin: 5px 0 0 0;
  }

  .terminal-body :global(ul li)::marker {
    color: #ff1a1a;
  }

  .terminal-body :global(ul li) {
    padding-left: 0.25em;
  }
</style>