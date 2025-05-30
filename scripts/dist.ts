import * as fs from "fs";
import * as os from "os";
import * as path from "path";

// Helper to resolve paths relative to the project's dist directory
function resolveDistPath(filePath: string): string {
  return path.resolve(__dirname, "../dist", filePath);
}

// Define the structure for a Vite manifest entry (simplified)
interface ViteManifestEntry {
  file: string; // The actual output file name, e.g., assets/front.abcdef.js
  src?: string; // Original source file name, e.g., front.html or src/front.ts
  isEntry?: boolean;
  // ... other properties like css, assets, etc., if needed
}

// Define the structure for the Vite manifest
interface ViteManifest {
  [key: string]: ViteManifestEntry;
}

const manifestPath = path.resolve(__dirname, "../dist/.vite/manifest.json");

let viteManifest: ViteManifest;
try {
  viteManifest = JSON.parse(fs.readFileSync(manifestPath).toString());
} catch (error) {
  console.error(
    `Error reading or parsing Vite manifest at ${manifestPath}:`,
    error,
  );
  process.exit(1); // Exit if manifest can't be read, as it's crucial for the script
}

const ankiProfilePath = path.join(
  os.homedir(),
  "/Library/Application Support/Anki2/User 1/collection.media", // Standard path for macOS Anki
  // For other OS, this path might need adjustment or user configuration.
  // Example for Windows: process.env.APPDATA + '\\Anki2\\User 1\\collection.media'
  // Example for Linux: os.homedir() + '/.local/share/Anki2/User 1/collection.media'
);

if (!fs.existsSync(ankiProfilePath)) {
  console.warn(`Anki media path not found: ${ankiProfilePath}`);
  console.warn(
    "Skipping file copy to Anki. Please ensure Anki is installed and a profile exists, or adjust the path in the script.",
  );
  console.log(
    "Distribution script finished (no files copied as Anki path was not found).",
  );
  process.exit(0); // Exit gracefully
}

// Proceed with file operations only if ankiProfilePath exists
["front", "back"].forEach(f => {
  const entryKey = `${f}.html`; // Based on vite.config.ts input keys
  const manifestEntry = viteManifest[entryKey];

  if (!manifestEntry || !manifestEntry.file) {
    console.error(
      `Could not find entry for '${entryKey}' or its file property in Vite manifest.`,
    );
    return; // Skip this file, or consider process.exit(1) if critical
  }

  const sourceFileName = manifestEntry.file; // e.g., 'assets/front.abcdef.js'
  const srcPath = resolveDistPath(sourceFileName); // Correctly resolves to /dist/assets/front.abcdef.js
  const dstPath = path.join(ankiProfilePath, `_${f}.js`);

  console.log(`Copying ${srcPath} -> ${dstPath}`);

  try {
    if (fs.existsSync(dstPath)) {
      fs.unlinkSync(dstPath); // Remove old file if it exists
    }
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, dstPath);
    } else {
      console.error(
        `Source file not found: ${srcPath}. Build might be incomplete.`,
      );
    }
  } catch (err) {
    console.error(`Error processing file for ${f}:`, err);
    // Decide if one error should stop the whole script
    // process.exit(1);
  }
});

console.log("Distribution script finished.");
