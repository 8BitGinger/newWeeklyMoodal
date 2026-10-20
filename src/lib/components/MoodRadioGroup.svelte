<script lang="ts">
	import { MOOD_OPTIONS } from '$lib/utils/mood';
	import type { Mood } from '$lib/types';

	let { value = $bindable<Mood | null>(null), name }: { value: Mood | null; name: string } =
		$props();
</script>

<div class="flex justify-center gap-3 text-3xl text-white">
	{#each MOOD_OPTIONS as opt (opt.value)}
		<label class="cursor-pointer transition-transform hover:scale-125">
			<input type="radio" {name} value={opt.value} bind:group={value} required class="sr-only" />
			<i
				class="fa {opt.icon}"
				class:scale-125={value === opt.value}
				style={value === opt.value ? `color: var(--color-${opt.value})` : ''}
				aria-label={opt.label}
			></i>
		</label>
	{/each}
</div>
