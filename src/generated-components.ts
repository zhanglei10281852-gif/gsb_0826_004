import type { Component } from "vue";

export { NAvatar } from "./components/Avatar";
export { NBadge } from "./components/Badge";
export { NBreadcrumb } from "./components/Breadcrumb";
export { NButton } from "./components/Button";
export { NCard } from "./components/Card";
export { NInput } from "./components/Input";
export { NModal } from "./components/Modal";
export { NSkeleton } from "./components/Skeleton";
export { NTable } from "./components/Table";
export { NTabs } from "./components/Tabs";
export { NToast } from "./components/Toast";

import { NAvatar } from "./components/Avatar";
import { NBadge } from "./components/Badge";
import { NBreadcrumb } from "./components/Breadcrumb";
import { NButton } from "./components/Button";
import { NCard } from "./components/Card";
import { NInput } from "./components/Input";
import { NModal } from "./components/Modal";
import { NSkeleton } from "./components/Skeleton";
import { NTable } from "./components/Table";
import { NTabs } from "./components/Tabs";
import { NToast } from "./components/Toast";

export const components: Record<string, Component> = {
  NAvatar,
  NBadge,
  NBreadcrumb,
  NButton,
  NCard,
  NInput,
  NModal,
  NSkeleton,
  NTable,
  NTabs,
  NToast,
};

export const componentList: Component[] = Object.values(components);
