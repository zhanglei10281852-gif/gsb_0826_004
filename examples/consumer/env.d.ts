/// <reference types="vite/client" />

export {};

declare module "vue" {
  export interface GlobalComponents {
    NBadge: (typeof import("nexa-ui"))["NBadge"];
  }
}
