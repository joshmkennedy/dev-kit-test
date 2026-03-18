import { spawn, execFileSync } from "node:child_process";
import path from "node:path";

const root = path.join(__dirname, "..");
const debug = process.argv.includes("--debug");
const stdio = debug ? "inherit" : "pipe";

// Run extract + seed before starting
console.log("[dev] Running initial extract & seed...");
execFileSync("bun", ["run", path.join(__dirname, "extracty-copy.ts")], {
  cwd: root,
  stdio,
  shell: true,
});
execFileSync("bun", ["run", path.join(__dirname, "seed-copy.ts")], {
  cwd: root,
  stdio,
  shell: true,
});
console.log("[dev] Initial extract & seed complete");

// Start next dev and copy watcher
const next = spawn("npx", ["next", "dev"], {
  cwd: root,
  stdio: "inherit",
  shell: true,
});

const watchArgs = ["run", path.join(__dirname, "watch-copy.ts")];
if (debug) watchArgs.push("--debug");
const watcher = spawn("bun", watchArgs, {
  cwd: root,
  stdio: "inherit",
  shell: true,
});

function cleanup() {
  next.kill();
  watcher.kill();
  process.exit();
}

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);

// If next dev dies, kill everything
next.on("close", () => {
  watcher.kill();
  process.exit();
});
