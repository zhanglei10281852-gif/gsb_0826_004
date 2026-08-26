import { createSSRApp, h } from "vue";
import { renderToString } from "@vue/server-renderer";
import { createRequire } from "node:module";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);

let failures = 0;
function check(name, cond) {
  console.log(`${cond ? "PASS" : "FAIL"}  ${name}`);
  if (!cond) failures++;
}

const pkgJsonPath = require.resolve("nexa-ui/package.json");
const installedDir = dirname(pkgJsonPath);
console.log(`nexa-ui installed at: ${installedDir}`);

const cssPath = join(installedDir, "dist", "style.css");
check("dist/style.css exists", existsSync(cssPath));
const css = existsSync(cssPath) ? readFileSync(cssPath, "utf8") : "";
check("CSS contains design tokens", css.includes("--nexa-primary-600"));
check("CSS contains UnoCSS utilities (bg-primary-600)", css.includes(".bg-primary-600"));
check("CSS contains icon classes (i-mdi-close)", css.includes("i-mdi-close"));
check("CSS contains scoped component styles (skeleton-wave)", css.includes("skeleton-wave"));

const { default: NexaUI, NButton } = await import("nexa-ui");
const NCard = (await import("nexa-ui/components/Card")).default;

check("unified entry exports NButton", typeof NButton === "object");
check("unified entry default plugin install is a function", typeof NexaUI?.install === "function");
check("subpath entry exports NCard", typeof NCard === "object");

const app1 = createSSRApp({
  render() {
    return h(NButton, { onClick() {} }, { default: () => "Smoke Button OK" });
  },
});
const html1 = await renderToString(app1);
check("NButton server-renders <button>", html1.includes("<button"));
check("NButton renders slot content", html1.includes("Smoke Button OK"));

const app2 = createSSRApp({
  render() {
    return h(NCard, null, { default: () => "Smoke Card OK" });
  },
});
const html2 = await renderToString(app2);
check("NCard server-renders slot content", html2.includes("Smoke Card OK"));
check("NCard carries utility class", html2.includes("rounded-xl"));

const app3 = createSSRApp({ render: () => h("div") });
app3.use(NexaUI);
check(
  "plugin registers components globally",
  typeof app3.component("NButton") === "object" && typeof app3.component("NTable") === "object",
);

if (failures) {
  console.error(`\n${failures} smoke check(s) failed`);
  process.exit(1);
}
console.log("\nAll smoke checks passed");
