<script lang="ts">
	import confetti from 'canvas-confetti';
	import { base } from '$app/paths';
	import { weekStore } from '$lib/stores/week.svelte';
	import { uiStore } from '$lib/stores/ui.svelte';
	import { computeWeeklyStats } from '$lib/utils/stats';
	import { fetchMoodSong } from '$lib/firebase/songs';
	import { moodImage, moodColor } from '$lib/utils/mood';
	import { playCloseSound, playTadaSound } from '$lib/utils/sound';
	import TrendChart from './TrendChart.svelte';
	import ShareButton from './ShareButton.svelte';

	const stats = $derived(computeWeeklyStats(weekStore.data));
	const glowStyle = $derived.by(() => {
		const color = moodColor(stats.mostCommonMood);
		return color ? `box-shadow: 0 0 40px -4px ${color};` : '';
	});

	let songUrl = $state<string | null>(null);
	let songTitle = $state<string | null>(null);
	let songArtist = $state<string | null>(null);
	let thumbnailUrl = $state<string | null>(null);
	let captureEl: HTMLElement = $state()!;

	$effect(() => {
		if (uiStore.wrapModalOpen && !songUrl) {
			fetchMoodSong('recap').then((song) => {
				songUrl = song?.songUrl ?? null;
				songTitle = song?.title ?? null;
				songArtist = song?.artist ?? null;
				thumbnailUrl = song?.thumbnailUrl ?? null;
			});
		}
	});

	let previousOpen = false;
	$effect(() => {
		if (uiStore.wrapModalOpen && !previousOpen) celebrate();
		previousOpen = uiStore.wrapModalOpen;
	});

	function celebrate() {
		playTadaSound();
		const colors = ['#f8f89e', '#a2dea2', '#79cffa', '#f48787'];
		confetti({ particleCount: 120, spread: 90, origin: { y: 0.3 }, colors });
		setTimeout(() => confetti({ particleCount: 60, spread: 120, origin: { y: 0.4 }, colors }), 300);
	}

	function close() {
		playCloseSound();
		uiStore.closeWrapModal();
	}
</script>

{#if uiStore.wrapModalOpen}
	<div class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4">
		<div
			bind:this={captureEl}
			class="w-full max-w-2xl rounded-2xl bg-sky-700 p-6 text-center text-white shadow-2xl transition-shadow duration-500"
			style={glowStyle}
		>
			<img src="{base}/images/banner-end.png" alt="Your Weekly Moodal" class="mx-auto mb-6 max-h-24" />

			<div class="mb-6 flex flex-wrap items-center justify-center gap-6">
				<div
					class="h-40 w-40 rounded-full bg-gray-400 bg-cover bg-center shadow-lg"
					style={stats.mostCommonMood ? `background-image: url(${moodImage(stats.mostCommonMood)})` : ''}
				></div>

				{#if thumbnailUrl}
					<div class="h-40 w-40 rounded-lg bg-cover bg-center shadow-lg" style="background-image: url({thumbnailUrl})"></div>
				{/if}

				<div
					class="h-40 w-40 rounded-full bg-cover bg-center shadow-lg"
					style="background-image: url({stats.weatherImage})"
				></div>
			</div>

			{#if songUrl}
				<div class="mb-6 rounded-xl bg-white/10 p-4 text-left">
					{#if songTitle}<p class="font-semibold">{songTitle}</p>{/if}
					{#if songArtist}<p class="text-sm text-sky-200">{songArtist}</p>{/if}
					<audio class="mt-2 w-full" controls src={songUrl}></audio>
				</div>
			{/if}

			<div class="mb-6 grid grid-cols-2 gap-4 text-left sm:grid-cols-4">
				<div>
					<p class="text-sm text-sky-200">Weekly Water Intake</p>
					<p class="text-xl font-bold">{stats.totalWater}</p>
				</div>
				<div>
					<p class="text-sm text-sky-200">Weekly Stress Level</p>
					<p class="text-xl font-bold">{stats.avgStress}%</p>
				</div>
				<div>
					<p class="text-sm text-sky-200">Weekly Energy Level</p>
					<p class="text-xl font-bold">{stats.avgEnergy}%</p>
				</div>
				<div>
					<p class="text-sm text-sky-200">Weekly Sleep Rating</p>
					<p class="text-xl font-bold">{stats.avgSleep} hrs</p>
					<p class="text-xs text-sky-200">{stats.sleepMessage}</p>
				</div>
			</div>

			<div class="mb-6 rounded-xl bg-white/10 p-4">
				<TrendChart data={weekStore.data} />
			</div>

			<div class="flex flex-wrap justify-center gap-3">
				<ShareButton target={captureEl} />
				<button
					onclick={close}
					class="rounded-lg bg-white/90 px-6 py-2 font-semibold text-sky-800 shadow"
				>
					Close
				</button>
			</div>
		</div>
	</div>
{/if}
