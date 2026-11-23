<script lang="ts">
	import SkyBackground from '../lib/components/SkyBackground.svelte';
	import './layout.css';
	import favicon from '../lib/assets/favicon.webp';
	import '7.css';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<SkyBackground />

{@render children()}
