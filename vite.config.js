import { defineConfig } from 'vite';

// Local development stays at /; Pages serves the production build under the repository name.
export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? '/Start-of-Spanish/' : '/',
}));
