import { weatherCodeToDescription } from '$lib/utils/weather';

export interface WeatherResult {
	code: number;
	description: string;
	temp: number | null;
	resolvedCity: string;
}

/** Thrown by fetchWeather so callers can tell a bad city apart from a transient outage. */
export class WeatherError extends Error {
	constructor(public reason: 'invalid-city' | 'unavailable') {
		super(reason);
	}
}

// Called directly from the browser - no server, so no API key: Open-Meteo is free and CORS-open.
export async function fetchWeather(city: string): Promise<WeatherResult> {
	const geoRes = await fetch(
		`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
	).catch(() => null);
	if (!geoRes || !geoRes.ok) throw new WeatherError('unavailable');

	const geoData = await geoRes.json();
	const place = geoData.results?.[0];
	if (!place) throw new WeatherError('invalid-city');

	const forecastRes = await fetch(
		`https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,weather_code&temperature_unit=fahrenheit&timezone=auto`
	).catch(() => null);
	if (!forecastRes || !forecastRes.ok) throw new WeatherError('unavailable');

	const forecastData = await forecastRes.json();
	const code = forecastData.current?.weather_code ?? null;

	return {
		code,
		description: weatherCodeToDescription(code),
		temp: forecastData.current?.temperature_2m ?? null,
		resolvedCity: [place.name, place.admin1, place.country].filter(Boolean).join(', ')
	};
}
