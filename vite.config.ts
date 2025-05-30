/// <reference types="vitest" />
import legacy from "@vitejs/plugin-legacy"; // Optional, for broader browser support
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    // legacy() // Uncomment if ES5 support is critical
  ],
  test: { // Vitest configuration
    globals: true, // To use jest-like globals (describe, it, expect)
    environment: "jsdom", // Or 'happy-dom' for faster tests if DOM usage is simple
    include: ["test/**/*.{test,spec}.{ts,js}"], // Glob pattern for test files
    coverage: {
      provider: "c8", // or 'istanbul'
      reporter: ["text", "json", "html"],
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        front: resolve(__dirname, "front.html"),
        back: resolve(__dirname, "back.html"),
      },
    },
    outDir: "dist", // Matches current output directory
    emptyOutDir: true, // Clean the output directory before build
    manifest: true, // Generate manifest.json
  },
  resolve: {
    alias: {
      // Replicate webpack's `resolve.modules` if necessary, e.g., for `import 'app'`
      // For now, relative paths or tsconfig paths should work.
      // 'src': resolve(__dirname, 'src') // If there were absolute imports from 'src'
    },
    extensions: [".ts", ".js"], // Matches webpack
  },
  server: {
    // dev server options if needed
  },
});
