<script lang="ts">
  import type { Snippet } from 'svelte';

  type HeaderSize = 1 | 2 | 3 | 4 | 5 | 6;

  interface Props {
    size?: HeaderSize;
    children?: Snippet;
  }

  let { size = 1, children }: Props = $props();

  const headingClasses: Record<HeaderSize, string> = {
    1: 'text-3xl font-bold md:text-4xl',
    2: 'text-2xl font-bold md:text-3xl',
    3: 'text-xl font-bold md:text-2xl',
    4: 'text-lg font-bold md:text-xl',
    5: 'text-base font-bold md:text-lg',
    6: 'text-sm font-bold md:text-base'
  };
</script>

<svelte:element this={`h${size}`} class={headingClasses[size]}>
  {@render children?.()}
</svelte:element>
