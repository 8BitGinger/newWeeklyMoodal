import tailwindcss from '@tailwindcss/vite';
import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

// Set by the GitHub Pages workflow to "/<repo-name>" for a project page; empty for a
// custom domain or a <user>.github.io root page.
const base = (process.env.BASE_PATH as `/${string}` | '' | undefined) ?? '';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) => filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			paths: { base },
			// Single client-only route (see +layout.ts) served as a pure SPA shell - no
			// server, so no page needs to be individually prerendered.
			adapter: adapter({ fallback: 'index.html' })
		})
	]
});
