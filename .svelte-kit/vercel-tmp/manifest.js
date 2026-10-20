export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["audio/click.wav","audio/click2.wav","images/balloon-foot.png","images/balloons-back-mobile.png","images/balloons-back.png","images/banner-end.png","images/bg-calm.jpg","images/cloudy.png","images/final-moodal-v2.png","images/fog.png","images/hail.png","images/happy-balloon.png","images/happy-png.png","images/Live-Screenshot.png","images/Moodal.png","images/neutral-png.png","images/partlycloudy.png","images/pattern-bg.jpg","images/Poodal.png","images/rain.png","images/sad-png.png","images/snow.png","images/sorry.png","images/storm.png","images/stressed-png.png","images/sunny.png","images/tornado.png","images/water-back.png","images/weather-location.png","images/weather-location2.png","images/weather-location3.png","images/weatherback.jpg","images/weeklyMoodal-Logov1.png","images/weeklyMoodal-Logov2.png","images/windy.png","images/wireframe-screenshot.png","images/youtube-test.png","images/youtube.png","robots.txt"]),
	mimeTypes: {".wav":"audio/wav",".png":"image/png",".jpg":"image/jpeg",".txt":"text/plain"},
	_: {
		client: {start:"_app/immutable/entry/start.RZcYUbfX.js",app:"_app/immutable/entry/app.D3pySREk.js",imports:["_app/immutable/entry/start.RZcYUbfX.js","_app/immutable/chunks/F3LCvM-3.js","_app/immutable/chunks/D-goOHzM.js","_app/immutable/entry/app.D3pySREk.js","_app/immutable/chunks/D-goOHzM.js","_app/immutable/chunks/DYl5dUZ5.js","_app/immutable/chunks/xihTtKlq.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('../output/server/nodes/0.js')),
			__memo(() => import('../output/server/nodes/1.js')),
			__memo(() => import('../output/server/nodes/2.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/api/weather",
				pattern: /^\/api\/weather\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/weather/_server.ts.js'))
			},
			{
				id: "/api/youtube",
				pattern: /^\/api\/youtube\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/youtube/_server.ts.js'))
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
