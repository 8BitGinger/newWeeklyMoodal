<script lang="ts">
	import { base } from '$app/paths';
	import { uiStore } from '$lib/stores/ui.svelte';
	import { weekStore } from '$lib/stores/week.svelte';
	import { playClickSound } from '$lib/utils/sound';

	let cityInput = $state('');

	function handleContinue(e: Event) {
		e.preventDefault();
		const city = cityInput.trim();
		if (!city) return;
		playClickSound();
		// Weather lookups happen lazily per day-save (DayCard); an invalid city
		// surfaces this same modal again at that point instead of blocking entry here.
		weekStore.setCity(city);
		uiStore.closeCityModal();
	}
</script>

{#if uiStore.cityModalOpen}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
		<div class="w-full max-w-md rounded-2xl bg-sky-700 p-6 text-center shadow-2xl">
			<img src="{base}/images/weeklyMoodal-Logov2.png" alt="weeklyMoodal" class="mx-auto mb-4 max-h-48" />

			{#if uiStore.cityModalInvalid}
				<img src="{base}/images/sorry.png" alt="" class="mx-auto mb-2 max-h-24" />
				<h2 class="mb-2 text-white">Your city or location was invalid.</h2>
				<p class="mb-3 text-white">Please try your search again:</p>
			{:else}
				<label for="city-input" class="mb-1 block text-white">Enter Your Current City:</label>
				<p class="mb-3 text-sm text-white/80">For weather info only!</p>
			{/if}

			<form onsubmit={handleContinue}>
				<input
					id="city-input"
					type="text"
					bind:value={cityInput}
					placeholder="City Name"
					class="mx-auto mb-4 block w-3/4 rounded-lg bg-sky-100 p-2 text-center text-black"
				/>
				<button
					type="submit"
					class="mx-auto block rounded-lg bg-sky-900 px-6 py-2 font-semibold text-white shadow"
				>
					Continue
				</button>
			</form>

			<img src="{base}/images/happy-balloon.png" alt="" class="mx-auto mt-4 max-h-40" />
		</div>
	</div>
{/if}
