<script lang="ts">
	import QuakeSkyBackground from '$lib/components/QuakeSkyBackground.svelte';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import '98.css';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<QuakeSkyBackground />

{@render children()}
