<script lang="ts">
	import { weekStore } from '$lib/stores/week.svelte';
	import { uiStore } from '$lib/stores/ui.svelte';
	import { fetchWeather, WeatherError } from '$lib/api/client';
	import { fetchMoodSong } from '$lib/firebase/songs';
	import { moodImage, moodColor } from '$lib/utils/mood';
	import { weatherCodeToImage, weatherCodeToDescription } from '$lib/utils/weather';
	import { playClickSound } from '$lib/utils/sound';
	import RangeSlider from './RangeSlider.svelte';
	import MoodRadioGroup from './MoodRadioGroup.svelte';
	import type { DayId, Mood } from '$lib/types';

	let { id, label, dateLabel }: { id: DayId; label: string; dateLabel: string } = $props();

	const entry = $derived(weekStore.data.days[id]);
	const saved = $derived(entry.savedAt !== null);

	let editing = $state(false);
	const showForm = $derived(!saved || editing);

	let waterDraft = $state(entry.water ?? 0);
	let stressDraft = $state(entry.stress);
	let moodDraft = $state<Mood | null>(entry.mood);
	let energyDraft = $state(entry.energy);
	let sleepDraft = $state(entry.sleep ?? 0);
	let saving = $state(false);

	const accentMood = $derived(showForm ? moodDraft : entry.mood);
	const cardStyle = $derived.by(() => {
		const color = moodColor(accentMood);
		return color ? `border-color: ${color}; box-shadow: 0 0 24px -6px ${color};` : '';
	});

	function startEdit() {
		waterDraft = entry.water ?? 0;
		stressDraft = entry.stress;
		moodDraft = entry.mood;
		energyDraft = entry.energy;
		sleepDraft = entry.sleep ?? 0;
		editing = true;
	}

	async function handleSave(e: Event) {
		e.preventDefault();
		if (!moodDraft) return;
		playClickSound();
		saving = true;

		const city = weekStore.data.city;
		let cityInvalid = false;
		const [song, weather] = await Promise.all([
			fetchMoodSong(moodDraft),
			city
				? fetchWeather(city).catch((err) => {
						// Only a confirmed bad city reopens the city modal; a transient
						// outage just leaves this day's weather as it was.
						if (err instanceof WeatherError && err.reason === 'invalid-city') {
							cityInvalid = true;
						}
						return null;
					})
				: Promise.resolve(null)
		]);
		if (cityInvalid) uiStore.markCityInvalid();

		weekStore.saveDay(id, {
			water: waterDraft,
			stress: stressDraft,
			mood: moodDraft,
			energy: energyDraft,
			sleep: sleepDraft,
			songUrl: song?.songUrl ?? null,
			songTitle: song?.title ?? null,
			songArtist: song?.artist ?? null,
			thumbnailUrl: song?.thumbnailUrl ?? null,
			weatherCode: weather?.code ?? entry.weatherCode,
			weatherTemp: weather?.temp ?? entry.weatherTemp
		});

		saving = false;
		editing = false;
	}
</script>

<div
	class="m-2 min-w-57.5 rounded-2xl border-4 border-white bg-linear-to-t from-sky-800 to-sky-500 p-4 text-center text-white shadow-lg transition-shadow duration-300"
	style={cardStyle}
>
	<h2 class="text-lg font-bold">{label}</h2>
	<h3 class="mb-3 text-sm text-sky-200">{dateLabel}</h3>

	{#if showForm}
		<form onsubmit={handleSave} class="flex flex-col gap-4">
			<div>
				<h4 class="mb-1 text-lg font-semibold">Glasses of Water</h4>
				<div class="flex items-center justify-center gap-2">
					<i class="fa-solid fa-bottle-water text-4xl"></i>
					<input
						type="number"
						min="0"
						max="20"
						bind:value={waterDraft}
						class="w-16 border-0 bg-transparent text-center text-3xl text-white outline-none"
					/>
				</div>
			</div>

			<RangeSlider bind:value={stressDraft} min={0} max={100} step={10} label="Stress Level" />

			<div>
				<h4 class="mb-2 text-lg font-semibold">Mood</h4>
				<MoodRadioGroup bind:value={moodDraft} name="mood-{id}" />
			</div>

			<RangeSlider bind:value={energyDraft} min={0} max={100} step={25} label="Energy Level" />

			<div>
				<label for="sleep-{id}" class="mb-1 block text-lg font-semibold">Hours of Sleep</label>
				<select
					id="sleep-{id}"
					bind:value={sleepDraft}
					class="w-full rounded-lg border-2 border-white bg-transparent p-1 text-center text-white"
				>
					{#each Array.from({ length: 10 }, (_, i) => i) as hour (hour)}
						<option value={hour} class="bg-sky-600 text-white">{hour} Hours</option>
					{/each}
				</select>
			</div>

			<button
				type="submit"
				disabled={saving || !moodDraft}
				aria-label="Save {label}"
				class="mx-auto rounded-full bg-white/90 px-6 py-2 text-2xl text-sky-800 shadow disabled:opacity-50"
			>
				<i class="fa-regular fa-floppy-disk"></i>
			</button>
		</form>
	{:else}
		<div class="flex flex-col items-center gap-4">
			<div
				class="h-32 w-32 rounded-full bg-gray-400 bg-cover bg-center shadow-lg"
				style={entry.mood ? `background-image: url(${moodImage(entry.mood)})` : ''}
			></div>

			{#if entry.songUrl}
				<div class="flex w-full items-center gap-3 rounded-lg bg-white/10 p-3 text-left shadow-lg">
					{#if entry.thumbnailUrl}
						<img src={entry.thumbnailUrl} alt="" class="h-14 w-14 shrink-0 rounded object-cover" />
					{/if}
					<div class="min-w-0 flex-1">
						{#if entry.songTitle}<p class="truncate text-sm font-semibold">{entry.songTitle}</p>{/if}
						{#if entry.songArtist}<p class="truncate text-xs text-sky-200">{entry.songArtist}</p>{/if}
						<audio class="mt-1 w-full" controls src={entry.songUrl}></audio>
					</div>
				</div>
			{/if}

			<div
				class="flex h-20 w-full flex-col items-center justify-center rounded-lg bg-cover bg-center text-center text-blue-900 shadow-lg"
				style="background-image: url({weatherCodeToImage(entry.weatherCode)})"
			>
				{#if entry.weatherCode !== null}
					<p class="rounded bg-white/70 px-2 text-sm font-semibold">
						{weatherCodeToDescription(entry.weatherCode)}
						{#if entry.weatherTemp !== null}&middot; {Math.round(entry.weatherTemp)}°F{/if}
					</p>
				{/if}
			</div>

			<p class="w-full rounded-lg bg-linear-to-r from-sky-400 to-white py-2 font-semibold text-black shadow">
				Water: {entry.water} glasses
			</p>
			<p class="w-full rounded-lg bg-linear-to-r from-red-500 to-yellow-400 py-2 font-semibold text-black shadow">
				Stress: {entry.stress}%
			</p>
			<p class="w-full rounded-lg bg-linear-to-r from-yellow-300 to-emerald-400 py-2 font-semibold text-black shadow">
				Energy: {entry.energy}%
			</p>
			<p class="w-full rounded-lg bg-linear-to-r from-yellow-200 to-violet-800 py-2 font-semibold text-black shadow">
				Slept {entry.sleep} hours
			</p>

			<button
				onclick={startEdit}
				aria-label="Edit {label}"
				class="rounded-full bg-white/90 px-6 py-2 text-2xl text-sky-800 shadow"
			>
				<i class="fa-solid fa-pen-to-square"></i>
			</button>
		</div>
	{/if}
</div>
