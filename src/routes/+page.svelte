<script lang="ts">
	import dayjs from 'dayjs';
	import { getWeekDates } from '$lib/utils/dates';
	import { weekStore } from '$lib/stores/week.svelte';
	import { uiStore } from '$lib/stores/ui.svelte';
	import { playClickSound } from '$lib/utils/sound';
	import DayCard from '$lib/components/DayCard.svelte';
	import CityModal from '$lib/components/CityModal.svelte';
	import WeeklyWrapModal from '$lib/components/WeeklyWrapModal.svelte';

	const weekDates = getWeekDates(dayjs());

	let previousAllSaved = false;
	$effect(() => {
		const allSaved = weekStore.allDaysSaved;
		if (allSaved && !previousAllSaved) {
			// The wrap modal takes priority over a same-tick "invalid city" reopen
			// (e.g. the last day's weather lookup failing right as the week completes).
			uiStore.closeCityModal();
			uiStore.openWrapModal();
		}
		previousAllSaved = allSaved;
	});

	function handleReset() {
		playClickSound();
		if (confirm('Reset your whole week? This clears all saved days.')) {
			weekStore.reset();
			uiStore.openCityModal();
		}
	}
</script>

<header class="flex h-24 items-center justify-center bg-linear-to-b from-sky-600 to-sky-800 shadow">
	<h1 class="text-4xl font-bold text-white">
		<span class="font-light opacity-70 lowercase">Weekl<span class="font-normal lowercase">y</span></span>
		Moodal
	</h1>
</header>

<div class="flex flex-wrap justify-end gap-2 p-3">
	<button
		onclick={() => uiStore.openCityModal()}
		class="flex items-center gap-2 rounded-lg bg-sky-700 px-3 py-2 text-sm font-semibold text-white shadow"
	>
		<i class="fa-solid fa-location-dot"></i>
		Set Location
	</button>
	{#if weekStore.allDaysSaved}
		<button
			onclick={() => uiStore.openWrapModal()}
			class="rounded-lg bg-sky-700 px-3 py-2 text-sm font-semibold text-white shadow"
		>
			Open Weekly Moodal
		</button>
	{/if}
</div>

<main class="flex flex-wrap justify-center gap-2 p-2">
	{#each weekDates as day (day.id)}
		<DayCard id={day.id} label={day.label} dateLabel={day.date.format('MMMM DD, YYYY')} />
	{/each}
</main>

<div class="flex justify-center py-6">
	<button
		onclick={handleReset}
		class="rounded-xl bg-red-600 px-6 py-2 text-lg font-bold text-white shadow"
	>
		Reset Week
	</button>
</div>

<CityModal />
<WeeklyWrapModal />

<footer class="flex flex-wrap justify-center gap-3 pb-8">
	<a href="https://jameslwilson364.github.io/Challenge-2-Wilson/" target="_blank" rel="noreferrer">
		<button class="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow">
			<i class="fa-solid fa-code"></i> James' Portfolio
		</button>
	</a>
	<a href="https://cazthetraveler.github.io/Luis-Olmos-Portfolio/" target="_blank" rel="noreferrer">
		<button class="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow">
			<i class="fa-solid fa-code"></i> Luis' Portfolio
		</button>
	</a>
	<a href="https://8bitginger.github.io/studentPortfolio/" target="_blank" rel="noreferrer">
		<button class="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow">
			<i class="fa-solid fa-code"></i> Ryan's Portfolio
		</button>
	</a>
</footer>
