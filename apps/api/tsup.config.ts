import { defineConfig } from 'tsup';
import { dependencies } from "./package.json";

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs'], // CommonJS format
  outDir: 'dist',
  noExternal: Object.keys(dependencies), // Bundle this workspace package
  dts: true, // Generate declaration files
  minify: true, // Minify output
  clean: true, // Clean output directory before build
  treeshake: true, // Enable tree shaking
  splitting: false, // Disable code splitting, keep it single file
  sourcemap: false, // Disable sourcemaps for production build if not needed
}); 