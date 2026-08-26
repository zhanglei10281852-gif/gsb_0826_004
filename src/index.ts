import type { App, Component } from "vue";
import { MotionPlugin } from "@vueuse/motion";

export * from "./generated-components";
export * from "./types";

import { components } from "./generated-components";

const plugin = {
  install(app: App) {
    app.use(MotionPlugin);
    for (const [name, component] of Object.entries(components)) {
      app.component(name, component as Component);
    }
  },
};

export default plugin;
