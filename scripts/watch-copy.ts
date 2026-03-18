import { spawn } from "node:child_process";
import path from "node:path";
import { watch } from "node:fs";

const debug = process.argv.includes("--debug");
const srcDir = path.join(__dirname, "../src");
const extractScript = path.join(__dirname, "extracty-copy.ts");
const seedScript = path.join(__dirname, "seed-copy.ts");

let timeout: ReturnType<typeof setTimeout> | null = null;
let running = false;

function run(label: string, script: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn("bun", ["run", script], {
      shell: true,
      stdio: debug ? "inherit" : "pipe",
    });
    child.on("close", (code) => {
      if (code !== 0) {
        console.error(`[watch-copy] ${label} exited with code ${code}`);
        reject(new Error(`${label} failed`));
        return;
      }
      console.log(`[watch-copy] ${label} complete`);
      resolve();
    });
  });
}

function runExtractAndSeed() {
  if (timeout) clearTimeout(timeout);
  timeout = setTimeout(async () => {
    if (running) return;
    running = true;
    console.log("[watch-copy] Change detected, extracting & seeding copy...");
    try {
      await run("Extract", extractScript);
      await run("Seed", seedScript);
    } catch {
      // errors already logged
    } finally {
      running = false;
    }
  }, 300);
}

watch(srcDir, { recursive: true }, (_event, filename) => {
  if (!filename) return;
  if (!filename.endsWith(".tsx") && !filename.endsWith(".ts")) return;
  if (filename.includes("generated")) return;
  runExtractAndSeed();
});

console.log("[watch-copy] Watching for <Text> changes...");
