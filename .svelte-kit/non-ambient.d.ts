
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	type MatcherParam<M> = M extends (param : string) => param is (infer U extends string) ? U : string;

	export interface AppTypes {
		RouteId(): "/";
		RouteParams(): {
			
		};
		LayoutParams(): {
			"/": Record<string, never>
		};
		Pathname(): "/";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/audio/click.wav" | "/audio/click2.wav" | "/images/balloon-foot.png" | "/images/balloons-back-mobile.png" | "/images/balloons-back.png" | "/images/banner-end.png" | "/images/bg-calm.jpg" | "/images/cloudy.png" | "/images/final-moodal-v2.png" | "/images/fog.png" | "/images/hail.png" | "/images/happy-balloon.png" | "/images/happy-png.png" | "/images/Live-Screenshot.png" | "/images/Moodal.png" | "/images/neutral-png.png" | "/images/partlycloudy.png" | "/images/pattern-bg.jpg" | "/images/Poodal.png" | "/images/rain.png" | "/images/sad-png.png" | "/images/snow.png" | "/images/sorry.png" | "/images/storm.png" | "/images/stressed-png.png" | "/images/sunny.png" | "/images/tornado.png" | "/images/water-back.png" | "/images/weather-location.png" | "/images/weather-location2.png" | "/images/weather-location3.png" | "/images/weatherback.jpg" | "/images/weeklyMoodal-Logov1.png" | "/images/weeklyMoodal-Logov2.png" | "/images/windy.png" | "/images/wireframe-screenshot.png" | "/images/youtube-test.png" | "/images/youtube.png" | "/robots.txt" | string & {};
	}
}