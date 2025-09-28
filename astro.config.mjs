// @ts-check
import { defineConfig } from 'astro/config';

// Environment based configuration so we can build for both:
// 1. GitHub Pages project site: https://lalibi.github.io/rodi-kremastos/
// 2. Custom root domain:      https://rodi-kremastos.gr/
// Usage:
//  pnpm build:gh   -> BUILD_TARGET=gh (project sub-path)
//  pnpm build:prod -> BUILD_TARGET=prod (root deployment)

const target = process.env.BUILD_TARGET || 'prod';
const isGh = target === 'gh';

export default defineConfig({
	site: isGh
		? 'https://lalibi.github.io/rodi-kremastos'
		: 'https://rodi-kremastos.gr',
	// Astro expects a leading slash and no trailing slash; import.meta.env.BASE_URL will include a trailing slash at runtime.
	base: isGh ? '/rodi-kremastos' : '/',
});
