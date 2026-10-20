import { base } from '$app/paths';

export type WeatherKind = 'sunny' | 'cloudy' | 'rain' | 'storm' | 'snow' | 'fog' | 'default';

/** Maps an Open-Meteo WMO weather code to a coarse local-asset bucket. */
export function weatherCodeToKind(code: number | null): WeatherKind {
	if (code === null) return 'default';
	if (code === 0 || code === 1) return 'sunny';
	if (code === 2 || code === 3) return 'cloudy';
	if (code === 45 || code === 48) return 'fog';
	if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return 'rain';
	if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'snow';
	if (code >= 95) return 'storm';
	return 'default';
}

const DESCRIPTIONS: Record<number, string> = {
	0: 'Clear sky',
	1: 'Mainly clear',
	2: 'Partly cloudy',
	3: 'Overcast',
	45: 'Fog',
	48: 'Freezing fog',
	51: 'Light drizzle',
	53: 'Drizzle',
	55: 'Heavy drizzle',
	56: 'Light freezing drizzle',
	57: 'Freezing drizzle',
	61: 'Light rain',
	63: 'Rain',
	65: 'Heavy rain',
	66: 'Light freezing rain',
	67: 'Freezing rain',
	71: 'Light snow',
	73: 'Snow',
	75: 'Heavy snow',
	77: 'Snow grains',
	80: 'Light showers',
	81: 'Showers',
	82: 'Heavy showers',
	85: 'Light snow showers',
	86: 'Snow showers',
	95: 'Thunderstorm',
	96: 'Thunderstorm with hail',
	99: 'Severe thunderstorm with hail'
};

/** Maps an Open-Meteo WMO weather code to a short human-readable description. */
export function weatherCodeToDescription(code: number | null): string {
	if (code === null) return 'Unknown';
	return DESCRIPTIONS[code] ?? 'Unsettled weather';
}

const IMAGES: Record<WeatherKind, string> = {
	sunny: `${base}/images/sunny.png`,
	cloudy: `${base}/images/cloudy.png`,
	rain: `${base}/images/rain.png`,
	storm: `${base}/images/storm.png`,
	snow: `${base}/images/snow.png`,
	fog: `${base}/images/fog.png`,
	default: `${base}/images/weatherback.jpg`
};

export function weatherCodeToImage(code: number | null): string {
	return IMAGES[weatherCodeToKind(code)];
}

/** Returns the most frequent value in `values`, or null if empty. */
export function mostCommon<T>(values: T[]): T | null {
	if (values.length === 0) return null;
	const counts = new Map<T, number>();
	for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
	let best: T | null = null;
	let bestCount = 0;
	for (const [value, count] of counts) {
		if (count > bestCount) {
			best = value;
			bestCount = count;
		}
	}
	return best;
}
