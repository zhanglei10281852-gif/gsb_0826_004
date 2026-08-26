import { readdir, writeFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const componentsDir = resolve(__dirname, "..", "src", "components");
const outputFile = resolve(__dirname, "..", "src", "generated-components.ts");

async function main() {
  const entries = await readdir(componentsDir, { withFileTypes: true });
  const folders = entries
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();

  const components = folders.map((folder) => ({
    folder,
    exportName: `N${folder}`,
  }));

  const lines = [];

  lines.push(`import type { Component } from "vue";`);
  lines.push(``);

  for (const { exportName, folder } of components) {
    lines.push(`export { ${exportName} } from "./components/${folder}";`);
  }

  lines.push(``);

  for (const { exportName, folder } of components) {
    lines.push(`import { ${exportName} } from "./components/${folder}";`);
  }

  lines.push(``);
  lines.push(`export const components: Record<string, Component> = {`);
  for (const { exportName } of components) {
    lines.push(`  ${exportName},`);
  }
  lines.push(`};`);
  lines.push(``);
  lines.push(`export const componentList: Component[] = Object.values(components);`);
  lines.push(``);

  await writeFile(outputFile, lines.join("\n"), "utf-8");
  console.log(
    `[gen-entry] generated ${components.length} components -> src/generated-components.ts`,
  );
}

main().catch((err) => {
  console.error("[gen-entry] failed:", err);
  process.exit(1);
});
