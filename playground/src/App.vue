<script setup lang="ts">
import { ref } from "vue";
import { NCard } from "nexa-ui/components/Card";
import type { Size, Status } from "nexa-ui";

const name = ref("");
const modalOpen = ref(false);
const clicked = ref(0);
const status: Status = "success";
const size: Size = "md";
</script>

<template>
  <main class="min-h-screen bg-surface-50 p-8">
    <div class="mx-auto max-w-2xl space-y-6">
      <header class="text-center">
        <h1 class="text-3xl font-bold text-surface-900">Nexa UI Playground</h1>
        <p class="mt-2 text-surface-500">
          验证从产物到外部项目的完整消费链路
        </p>
      </header>

      <NCard>
        <template #header>
          <h2 class="font-semibold text-surface-900">统一入口 + 按组件引入</h2>
        </template>
        <div class="space-y-4">
          <NInput
            v-model="name"
            label="你的名字"
            placeholder="请输入名字"
            :status="status"
          />
          <div class="flex items-center gap-3">
            <NButton @click="clicked++">
              点击计数：{{ clicked }}
            </NButton>
            <NButton variant="outline" @click="modalOpen = true">
              打开模态框
            </NButton>
            <NButton variant="ghost" :size="size" disabled>
              禁用
            </NButton>
          </div>
          <p class="text-sm text-surface-500">
            输入的值：<span class="text-surface-900">{{ name || "（空）" }}</span>
          </p>
        </div>
      </NCard>

      <NModal v-model="modalOpen" title="来自产物的模态框" size="sm">
        <p class="text-sm text-surface-600">
          这个 NModal 组件由 nexa-ui 构建产物提供，动画指令由库的 install 自动注册。
        </p>
        <template #footer>
          <NButton variant="ghost" @click="modalOpen = false">关闭</NButton>
        </template>
      </NModal>
    </div>
  </main>
</template>
