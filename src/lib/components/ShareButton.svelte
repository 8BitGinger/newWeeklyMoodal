<script lang="ts">
	import { toPng } from 'html-to-image';

	let { target }: { target: HTMLElement } = $props();
	let busy = $state(false);

	async function handleClick() {
		busy = true;
		try {
			const dataUrl = await toPng(target, { pixelRatio: 2, backgroundColor: '#ffffff' });

			if (navigator.share && navigator.canShare) {
				const blob = await (await fetch(dataUrl)).blob();
				const file = new File([blob], 'weekly-moodal-recap.png', { type: 'image/png' });
				if (navigator.canShare({ files: [file] })) {
					await navigator.share({ files: [file], title: 'My Weekly Moodal Recap' });
					return;
				}
			}

			const link = document.createElement('a');
			link.download = 'weekly-moodal-recap.png';
			link.href = dataUrl;
			link.click();
		} finally {
			busy = false;
		}
	}
</script>

<button
	onclick={handleClick}
	disabled={busy}
	class="rounded-lg bg-sky-900 px-4 py-2 font-semibold text-white shadow disabled:opacity-50"
>
	<i class="fa-solid fa-share-nodes"></i>
	{busy ? 'Preparing…' : 'Share / Download Recap'}
</button>
