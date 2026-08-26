import { readdir, mkdir, writeFile, rm } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const componentsDir = resolve(root, "src", "components");
const distDir = resolve(root, "dist");

async function main() {
  const entries = await readdir(componentsDir, { withFileTypes: true });
  const folders = entries
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();

  for (const folder of folders) {
    const exportName = `N${folder}`;
    const targetDir = resolve(distDir, "components", folder);
    await mkdir(targetDir, { recursive: true });

    const jsContent = [
      `export { ${exportName} } from "../../index.js";`,
      `export { ${exportName} as default } from "../../index.js";`,
      "",
    ].join("\n");

    const dtsContent = [
      `export { ${exportName} } from "../../index";`,
      `export { ${exportName} as default } from "../../index";`,
      "",
    ].join("\n");

    await writeFile(resolve(targetDir, "index.js"), jsContent, "utf-8");
    await writeFile(resolve(targetDir, "index.d.ts"), dtsContent, "utf-8");
  }

  const styleJs = resolve(distDir, "style.js");
  try {
    await rm(styleJs, { force: true });
  } catch {
    /* ignore */
  }

  console.log(
    `[gen-subpath] generated ${folders.length} component subpath entries in dist/components`,
  );
}

main().catch((err) => {
  console.error("[gen-subpath] failed:", err);
  process.exit(1);
});
