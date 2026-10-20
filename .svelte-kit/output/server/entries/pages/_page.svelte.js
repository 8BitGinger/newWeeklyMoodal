import { i as onDestroy } from "../../chunks/internal.js";
import { l as base } from "../../chunks/internal2.js";
import { S as escape_html, a as ensure_array_like, c as stringify, i as derived, n as attr_style, r as bind_props, t as attr_class, x as attr } from "../../chunks/server.js";
import "../../chunks/paths.js";
import dayjs from "dayjs";
import "firebase/storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import "canvas-confetti";
import "chart.js/auto";
import "html-to-image";
//#region src/lib/types.ts
var DAY_IDS = [
	"sunday",
	"monday",
	"tuesday",
	"wednesday",
	"thursday",
	"friday",
	"saturday"
];
function emptyDayEntry() {
	return {
		water: null,
		stress: 50,
		mood: null,
		energy: 50,
		sleep: null,
		songUrl: null,
		songTitle: null,
		songArtist: null,
		thumbnailUrl: null,
		weatherCode: null,
		weatherTemp: null,
		savedAt: null
	};
}
function emptyWeekData() {
	const days = {};
	for (const id of DAY_IDS) days[id] = emptyDayEntry();
	return {
		city: null,
		days
	};
}
//#endregion
//#region src/lib/utils/dates.ts
var LABELS = {
	sunday: "Sunday",
	monday: "Monday",
	tuesday: "Tuesday",
	wednesday: "Wednesday",
	thursday: "Thursday",
	friday: "Friday",
	saturday: "Saturday"
};
/** Returns the Sun-Sat week containing `today`, one entry per day. */
function getWeekDates(today = dayjs()) {
	const todayDow = today.day();
	return DAY_IDS.map((id, index) => ({
		id,
		label: LABELS[id],
		date: today.add(index - todayDow, "day")
	}));
}
function load() {
	return emptyWeekData();
}
var WeekStore = class {
	data = load();
	get allDaysSaved() {
		return DAY_IDS.every((id) => this.data.days[id].savedAt !== null);
	}
	#persist() {}
	setCity(city) {
		this.data.city = city;
		this.#persist();
	}
	saveDay(id, entry) {
		this.data.days[id] = {
			...entry,
			savedAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		this.#persist();
	}
	isDaySaved(id) {
		return this.data.days[id].savedAt !== null;
	}
	reset() {
		this.data = emptyWeekData();
	}
};
var weekStore = new WeekStore();
//#endregion
//#region src/lib/stores/ui.svelte.ts
var UIStore = class {
	cityModalOpen = true;
	cityModalInvalid = false;
	wrapModalOpen = false;
	openCityModal() {
		this.cityModalOpen = true;
		this.cityModalInvalid = false;
	}
	closeCityModal() {
		this.cityModalOpen = false;
	}
	markCityInvalid() {
		this.cityModalInvalid = true;
		this.cityModalOpen = true;
	}
	openWrapModal() {
		this.wrapModalOpen = true;
	}
	closeWrapModal() {
		this.wrapModalOpen = false;
	}
};
var uiStore = new UIStore();
//#endregion
//#region src/lib/utils/weather.ts
/** Maps an Open-Meteo WMO weather code to a coarse local-asset bucket. */
function weatherCodeToKind(code) {
	if (code === null) return "default";
	if (code === 0 || code === 1) return "sunny";
	if (code === 2 || code === 3) return "cloudy";
	if (code === 45 || code === 48) return "fog";
	if (code >= 51 && code <= 67 || code >= 80 && code <= 82) return "rain";
	if (code >= 71 && code <= 77 || code === 85 || code === 86) return "snow";
	if (code >= 95) return "storm";
	return "default";
}
var DESCRIPTIONS = {
	0: "Clear sky",
	1: "Mainly clear",
	2: "Partly cloudy",
	3: "Overcast",
	45: "Fog",
	48: "Freezing fog",
	51: "Light drizzle",
	53: "Drizzle",
	55: "Heavy drizzle",
	56: "Light freezing drizzle",
	57: "Freezing drizzle",
	61: "Light rain",
	63: "Rain",
	65: "Heavy rain",
	66: "Light freezing rain",
	67: "Freezing rain",
	71: "Light snow",
	73: "Snow",
	75: "Heavy snow",
	77: "Snow grains",
	80: "Light showers",
	81: "Showers",
	82: "Heavy showers",
	85: "Light snow showers",
	86: "Snow showers",
	95: "Thunderstorm",
	96: "Thunderstorm with hail",
	99: "Severe thunderstorm with hail"
};
/** Maps an Open-Meteo WMO weather code to a short human-readable description. */
function weatherCodeToDescription(code) {
	if (code === null) return "Unknown";
	return DESCRIPTIONS[code] ?? "Unsettled weather";
}
var IMAGES = {
	sunny: `${base}/images/sunny.png`,
	cloudy: `${base}/images/cloudy.png`,
	rain: `${base}/images/rain.png`,
	storm: `${base}/images/storm.png`,
	snow: `${base}/images/snow.png`,
	fog: `${base}/images/fog.png`,
	default: `${base}/images/weatherback.jpg`
};
function weatherCodeToImage(code) {
	return IMAGES[weatherCodeToKind(code)];
}
/** Returns the most frequent value in `values`, or null if empty. */
function mostCommon(values) {
	if (values.length === 0) return null;
	const counts = /* @__PURE__ */ new Map();
	for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
	let best = null;
	let bestCount = 0;
	for (const [value, count] of counts) if (count > bestCount) {
		best = value;
		bestCount = count;
	}
	return best;
}
//#endregion
//#region src/lib/firebase/config.ts
var firebaseConfig = {
	apiKey: "",
	authDomain: "ryfimusic-b6ccf.firebaseapp.com",
	projectId: "ryfimusic-b6ccf",
	storageBucket: "ryfimusic-b6ccf.firebasestorage.app",
	messagingSenderId: "",
	appId: ""
};
Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
getApps().length ? getApp() : initializeApp(firebaseConfig);
//#endregion
//#region src/lib/utils/mood.ts
var MOOD_IMAGES = {
	happy: `${base}/images/happy-png.png`,
	neutral: `${base}/images/neutral-png.png`,
	sad: `${base}/images/sad-png.png`,
	angry: `${base}/images/stressed-png.png`
};
function moodImage(mood) {
	return mood ? MOOD_IMAGES[mood] : null;
}
/** CSS color value for a mood's accent token (see --color-* in layout.css), for live mood tinting. */
function moodColor(mood) {
	return mood ? `var(--color-${mood})` : null;
}
var MOOD_OPTIONS = [
	{
		value: "happy",
		icon: "fa-face-smile",
		label: "Happy"
	},
	{
		value: "neutral",
		icon: "fa-face-meh",
		label: "Neutral"
	},
	{
		value: "sad",
		icon: "fa-face-sad-tear",
		label: "Sad"
	},
	{
		value: "angry",
		icon: "fa-face-angry",
		label: "Angry"
	}
];
//#endregion
//#region src/lib/components/RangeSlider.svelte
function RangeSlider($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { value = 0, min = 0, max = 100, step = 1, label } = $$props;
		$$renderer.push(`<div><h4 class="mb-2 text-center text-lg font-semibold text-white">${escape_html(label)}</h4> <input type="range"${attr("min", min)}${attr("max", max)}${attr("step", step)}${attr("value", value)} class="w-full"/> <p class="mt-1 text-center font-semibold text-white">${escape_html(value)}%</p></div>`);
		bind_props($$props, { value });
	});
}
//#endregion
//#region src/lib/components/MoodRadioGroup.svelte
function MoodRadioGroup($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { value = null, name } = $$props;
		$$renderer.push(`<div class="flex justify-center gap-3 text-3xl text-white"><!--[-->`);
		const each_array = ensure_array_like(MOOD_OPTIONS);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let opt = each_array[$$index];
			$$renderer.push(`<label class="cursor-pointer transition-transform hover:scale-125"><input type="radio"${attr("name", name)}${attr("value", opt.value)}${attr("checked", value === opt.value, true)} required="" class="sr-only"/> <i${attr_class(`fa ${stringify(opt.icon)}`, void 0, { "scale-125": value === opt.value })}${attr_style(value === opt.value ? `color: var(--color-${opt.value})` : "")}${attr("aria-label", opt.label)}></i></label>`);
		}
		$$renderer.push(`<!--]--></div>`);
		bind_props($$props, { value });
	});
}
//#endregion
//#region src/lib/components/DayCard.svelte
function DayCard($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { id, label, dateLabel } = $$props;
		const entry = derived(() => weekStore.data.days[id]);
		const saved = derived(() => entry().savedAt !== null);
		let editing = false;
		const showForm = derived(() => !saved() || editing);
		let waterDraft = entry().water ?? 0;
		let stressDraft = entry().stress;
		let moodDraft = entry().mood;
		let energyDraft = entry().energy;
		let sleepDraft = entry().sleep ?? 0;
		const accentMood = derived(() => showForm() ? moodDraft : entry().mood);
		const cardStyle = derived(() => {
			const color = moodColor(accentMood());
			return color ? `border-color: ${color}; box-shadow: 0 0 24px -6px ${color};` : "";
		});
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			$$renderer.push(`<div class="m-2 min-w-57.5 rounded-2xl border-4 border-white bg-linear-to-t from-sky-800 to-sky-500 p-4 text-center text-white shadow-lg transition-shadow duration-300"${attr_style(cardStyle())}><h2 class="text-lg font-bold">${escape_html(label)}</h2> <h3 class="mb-3 text-sm text-sky-200">${escape_html(dateLabel)}</h3> `);
			if (showForm()) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<form class="flex flex-col gap-4"><div><h4 class="mb-1 text-lg font-semibold">Glasses of Water</h4> <div class="flex items-center justify-center gap-2"><i class="fa-solid fa-bottle-water text-4xl"></i> <input type="number" min="0" max="20"${attr("value", waterDraft)} class="w-16 border-0 bg-transparent text-center text-3xl text-white outline-none"/></div></div> `);
				RangeSlider($$renderer, {
					min: 0,
					max: 100,
					step: 10,
					label: "Stress Level",
					get value() {
						return stressDraft;
					},
					set value($$value) {
						stressDraft = $$value;
						$$settled = false;
					}
				});
				$$renderer.push(`<!----> <div><h4 class="mb-2 text-lg font-semibold">Mood</h4> `);
				MoodRadioGroup($$renderer, {
					name: `mood-${stringify(id)}`,
					get value() {
						return moodDraft;
					},
					set value($$value) {
						moodDraft = $$value;
						$$settled = false;
					}
				});
				$$renderer.push(`<!----></div> `);
				RangeSlider($$renderer, {
					min: 0,
					max: 100,
					step: 25,
					label: "Energy Level",
					get value() {
						return energyDraft;
					},
					set value($$value) {
						energyDraft = $$value;
						$$settled = false;
					}
				});
				$$renderer.push(`<!----> <div><label${attr("for", `sleep-${stringify(id)}`)} class="mb-1 block text-lg font-semibold">Hours of Sleep</label> `);
				$$renderer.select({
					id: `sleep-${stringify(id)}`,
					value: sleepDraft,
					class: "w-full rounded-lg border-2 border-white bg-transparent p-1 text-center text-white"
				}, ($$renderer) => {
					$$renderer.push(`<!--[-->`);
					const each_array = ensure_array_like(Array.from({ length: 10 }, (_, i) => i));
					for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
						let hour = each_array[$$index];
						$$renderer.option({
							value: hour,
							class: "bg-sky-600 text-white"
						}, ($$renderer) => {
							$$renderer.push(`${escape_html(hour)} Hours`);
						});
					}
					$$renderer.push(`<!--]-->`);
				});
				$$renderer.push(`</div> <button type="submit"${attr("disabled", !moodDraft, true)}${attr("aria-label", `Save ${stringify(label)}`)} class="mx-auto rounded-full bg-white/90 px-6 py-2 text-2xl text-sky-800 shadow disabled:opacity-50"><i class="fa-regular fa-floppy-disk"></i></button></form>`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<div class="flex flex-col items-center gap-4"><div class="h-32 w-32 rounded-full bg-gray-400 bg-cover bg-center shadow-lg"${attr_style(entry().mood ? `background-image: url(${moodImage(entry().mood)})` : "")}></div> `);
				if (entry().songUrl) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="flex w-full items-center gap-3 rounded-lg bg-white/10 p-3 text-left shadow-lg">`);
					if (entry().thumbnailUrl) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<img${attr("src", entry().thumbnailUrl)} alt="" class="h-14 w-14 shrink-0 rounded object-cover"/>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> <div class="min-w-0 flex-1">`);
					if (entry().songTitle) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<p class="truncate text-sm font-semibold">${escape_html(entry().songTitle)}</p>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> `);
					if (entry().songArtist) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<p class="truncate text-xs text-sky-200">${escape_html(entry().songArtist)}</p>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> <audio class="mt-1 w-full" controls=""${attr("src", entry().songUrl)}></audio></div></div>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> <div class="flex h-20 w-full flex-col items-center justify-center rounded-lg bg-cover bg-center text-center text-blue-900 shadow-lg"${attr_style(`background-image: url(${stringify(weatherCodeToImage(entry().weatherCode))})`)}>`);
				if (entry().weatherCode !== null) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<p class="rounded bg-white/70 px-2 text-sm font-semibold">${escape_html(weatherCodeToDescription(entry().weatherCode))} `);
					if (entry().weatherTemp !== null) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`· ${escape_html(Math.round(entry().weatherTemp))}°F`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--></p>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div> <p class="w-full rounded-lg bg-linear-to-r from-sky-400 to-white py-2 font-semibold text-black shadow">Water: ${escape_html(entry().water)} glasses</p> <p class="w-full rounded-lg bg-linear-to-r from-red-500 to-yellow-400 py-2 font-semibold text-black shadow">Stress: ${escape_html(entry().stress)}%</p> <p class="w-full rounded-lg bg-linear-to-r from-yellow-300 to-emerald-400 py-2 font-semibold text-black shadow">Energy: ${escape_html(entry().energy)}%</p> <p class="w-full rounded-lg bg-linear-to-r from-yellow-200 to-violet-800 py-2 font-semibold text-black shadow">Slept ${escape_html(entry().sleep)} hours</p> <button${attr("aria-label", `Edit ${stringify(label)}`)} class="rounded-full bg-white/90 px-6 py-2 text-2xl text-sky-800 shadow"><i class="fa-solid fa-pen-to-square"></i></button></div>`);
			}
			$$renderer.push(`<!--]--></div>`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
	});
}
//#endregion
//#region src/lib/components/CityModal.svelte
function CityModal($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let cityInput = "";
		if (uiStore.cityModalOpen) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"><div class="w-full max-w-md rounded-2xl bg-sky-700 p-6 text-center shadow-2xl"><img${attr("src", `${stringify(base)}/images/weeklyMoodal-Logov2.png`)} alt="weeklyMoodal" class="mx-auto mb-4 max-h-48"/> `);
			if (uiStore.cityModalInvalid) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<img${attr("src", `${stringify(base)}/images/sorry.png`)} alt="" class="mx-auto mb-2 max-h-24"/> <h2 class="mb-2 text-white">Your city or location was invalid.</h2> <p class="mb-3 text-white">Please try your search again:</p>`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<label for="city-input" class="mb-1 block text-white">Enter Your Current City:</label> <p class="mb-3 text-sm text-white/80">For weather info only!</p>`);
			}
			$$renderer.push(`<!--]--> <form><input id="city-input" type="text"${attr("value", cityInput)} placeholder="City Name" class="mx-auto mb-4 block w-3/4 rounded-lg bg-sky-100 p-2 text-center text-black"/> <button type="submit" class="mx-auto block rounded-lg bg-sky-900 px-6 py-2 font-semibold text-white shadow">Continue</button></form> <img${attr("src", `${stringify(base)}/images/happy-balloon.png`)} alt="" class="mx-auto mt-4 max-h-40"/></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
//#region src/lib/utils/stats.ts
function computeWeeklyStats(data) {
	const days = DAY_IDS.map((id) => data.days[id]);
	const totalWater = days.reduce((sum, d) => sum + (d.water ?? 0), 0);
	const avgStress = average(days.map((d) => d.stress));
	const avgEnergy = average(days.map((d) => d.energy));
	const avgSleep = average(days.map((d) => d.sleep ?? 0));
	let sleepMessage;
	if (avgSleep < 6) sleepMessage = "You should sleep more!";
	else if (avgSleep <= 8) sleepMessage = "Great job! You have an excellent sleep pattern!";
	else sleepMessage = "You might be sleeping a bit too much!";
	const mostCommonMood = mostCommon(days.map((d) => d.mood).filter((m) => m !== null));
	const weatherImage = weatherCodeToImage(mostCommon(days.map((d) => d.weatherCode).filter((c) => c !== null)));
	return {
		totalWater,
		avgStress: Math.round(avgStress),
		avgEnergy: Math.round(avgEnergy),
		avgSleep: Math.round(avgSleep * 100) / 100,
		sleepMessage,
		mostCommonMood,
		weatherImage
	};
}
function average(values) {
	if (values.length === 0) return 0;
	return values.reduce((sum, v) => sum + v, 0) / values.length;
}
//#endregion
//#region src/lib/components/TrendChart.svelte
function TrendChart($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		onDestroy(() => void 0);
		$$renderer.push(`<canvas></canvas>`);
	});
}
//#endregion
//#region src/lib/components/ShareButton.svelte
function ShareButton($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { target } = $$props;
		$$renderer.push(`<button${attr("disabled", false, true)} class="rounded-lg bg-sky-900 px-4 py-2 font-semibold text-white shadow disabled:opacity-50"><i class="fa-solid fa-share-nodes"></i> ${escape_html("Share / Download Recap")}</button>`);
	});
}
//#endregion
//#region src/lib/components/WeeklyWrapModal.svelte
function WeeklyWrapModal($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const stats = derived(() => computeWeeklyStats(weekStore.data));
		const glowStyle = derived(() => {
			const color = moodColor(stats().mostCommonMood);
			return color ? `box-shadow: 0 0 40px -4px ${color};` : "";
		});
		let captureEl = void 0;
		if (uiStore.wrapModalOpen) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4"><div class="w-full max-w-2xl rounded-2xl bg-sky-700 p-6 text-center text-white shadow-2xl transition-shadow duration-500"${attr_style(glowStyle())}><img${attr("src", `${stringify(base)}/images/banner-end.png`)} alt="Your Weekly Moodal" class="mx-auto mb-6 max-h-24"/> <div class="mb-6 flex flex-wrap items-center justify-center gap-6"><div class="h-40 w-40 rounded-full bg-gray-400 bg-cover bg-center shadow-lg"${attr_style(stats().mostCommonMood ? `background-image: url(${moodImage(stats().mostCommonMood)})` : "")}></div> `);
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <div class="h-40 w-40 rounded-full bg-cover bg-center shadow-lg"${attr_style(`background-image: url(${stringify(stats().weatherImage)})`)}></div></div> `);
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <div class="mb-6 grid grid-cols-2 gap-4 text-left sm:grid-cols-4"><div><p class="text-sm text-sky-200">Weekly Water Intake</p> <p class="text-xl font-bold">${escape_html(stats().totalWater)}</p></div> <div><p class="text-sm text-sky-200">Weekly Stress Level</p> <p class="text-xl font-bold">${escape_html(stats().avgStress)}%</p></div> <div><p class="text-sm text-sky-200">Weekly Energy Level</p> <p class="text-xl font-bold">${escape_html(stats().avgEnergy)}%</p></div> <div><p class="text-sm text-sky-200">Weekly Sleep Rating</p> <p class="text-xl font-bold">${escape_html(stats().avgSleep)} hrs</p> <p class="text-xs text-sky-200">${escape_html(stats().sleepMessage)}</p></div></div> <div class="mb-6 rounded-xl bg-white/10 p-4">`);
			TrendChart($$renderer, { data: weekStore.data });
			$$renderer.push(`<!----></div> <div class="flex flex-wrap justify-center gap-3">`);
			ShareButton($$renderer, { target: captureEl });
			$$renderer.push(`<!----> <button class="rounded-lg bg-white/90 px-6 py-2 font-semibold text-sky-800 shadow">Close</button></div></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
//#region src/routes/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const weekDates = getWeekDates(dayjs());
		$$renderer.push(`<header class="flex h-24 items-center justify-center bg-linear-to-b from-sky-600 to-sky-800 shadow"><h1 class="text-4xl font-bold text-white"><span class="font-light opacity-70 lowercase">Weekl<span class="font-normal lowercase">y</span></span> Moodal</h1></header> <div class="flex flex-wrap justify-end gap-2 p-3"><button class="flex items-center gap-2 rounded-lg bg-sky-700 px-3 py-2 text-sm font-semibold text-white shadow"><i class="fa-solid fa-location-dot"></i> Set Location</button> `);
		if (weekStore.allDaysSaved) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<button class="rounded-lg bg-sky-700 px-3 py-2 text-sm font-semibold text-white shadow">Open Weekly Moodal</button>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <main class="flex flex-wrap justify-center gap-2 p-2"><!--[-->`);
		const each_array = ensure_array_like(weekDates);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let day = each_array[$$index];
			DayCard($$renderer, {
				id: day.id,
				label: day.label,
				dateLabel: day.date.format("MMMM DD, YYYY")
			});
		}
		$$renderer.push(`<!--]--></main> <div class="flex justify-center py-6"><button class="rounded-xl bg-red-600 px-6 py-2 text-lg font-bold text-white shadow">Reset Week</button></div> `);
		CityModal($$renderer, {});
		$$renderer.push(`<!----> `);
		WeeklyWrapModal($$renderer, {});
		$$renderer.push(`<!----> <footer class="flex flex-wrap justify-center gap-3 pb-8"><a href="https://jameslwilson364.github.io/Challenge-2-Wilson/" target="_blank" rel="noreferrer"><button class="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow"><i class="fa-solid fa-code"></i> James' Portfolio</button></a> <a href="https://cazthetraveler.github.io/Luis-Olmos-Portfolio/" target="_blank" rel="noreferrer"><button class="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow"><i class="fa-solid fa-code"></i> Luis' Portfolio</button></a> <a href="https://8bitginger.github.io/studentPortfolio/" target="_blank" rel="noreferrer"><button class="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow"><i class="fa-solid fa-code"></i> Ryan's Portfolio</button></a></footer>`);
	});
}
//#endregion
export { _page as default };
