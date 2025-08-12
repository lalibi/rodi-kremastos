// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	// GitHub Pages project site configuration
	site: 'https://lalibi.github.io/rodi-kremastos',
	// NOTE: trailing slash required so `${import.meta.env.BASE_URL}file` becomes '/rodi-kremastos/file'
	base: '/rodi-kremastos',
});
