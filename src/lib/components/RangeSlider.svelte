<script lang="ts">
	let {
		value = $bindable(0),
		min = 0,
		max = 100,
		step = 1,
		label
	}: { value: number; min?: number; max?: number; step?: number; label: string } = $props();
</script>

<div>
	<h4 class="mb-2 text-center text-lg font-semibold text-white">{label}</h4>
	<input type="range" {min} {max} {step} bind:value class="w-full" />
	<p class="mt-1 text-center font-semibold text-white">{value}%</p>
</div>
