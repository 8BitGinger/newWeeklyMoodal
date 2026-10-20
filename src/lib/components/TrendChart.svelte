<script lang="ts">
	import { Chart, type ChartConfiguration } from 'chart.js/auto';
	import { onMount, onDestroy } from 'svelte';
	import { DAY_IDS, type WeekData } from '$lib/types';

	let { data }: { data: WeekData } = $props();

	let canvasEl: HTMLCanvasElement;
	let chart: Chart | undefined;

	function buildConfig(): ChartConfiguration {
		const labels = DAY_IDS.map((id) => id[0].toUpperCase() + id.slice(1, 3));
		const days = DAY_IDS.map((id) => data.days[id]);
		return {
			type: 'line',
			data: {
				labels,
				datasets: [
					{ label: 'Stress %', data: days.map((d) => d.stress), borderColor: '#ee2513', tension: 0.3 },
					{ label: 'Energy %', data: days.map((d) => d.energy), borderColor: '#3ad59f', tension: 0.3 },
					{
						label: 'Water (glasses)',
						data: days.map((d) => d.water ?? 0),
						borderColor: '#0bc3f6',
						tension: 0.3,
						yAxisID: 'y1'
					},
					{
						label: 'Sleep (hrs)',
						data: days.map((d) => d.sleep ?? 0),
						borderColor: '#41178e',
						tension: 0.3,
						yAxisID: 'y1'
					}
				]
			},
			options: {
				responsive: true,
				scales: {
					y: { min: 0, max: 100, title: { display: true, text: '%' } },
					y1: {
						min: 0,
						max: 20,
						position: 'right',
						title: { display: true, text: 'count / hrs' },
						grid: { drawOnChartArea: false }
					}
				}
			}
		};
	}

	onMount(() => {
		chart = new Chart(canvasEl, buildConfig());
	});

	$effect(() => {
		if (chart) {
			chart.data = buildConfig().data;
			chart.update();
		}
	});

	onDestroy(() => chart?.destroy());
</script>

<canvas bind:this={canvasEl}></canvas>
