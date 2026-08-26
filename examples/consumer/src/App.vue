<script setup lang="ts">
import { ref } from "vue";
import { NButton, NInput, type Size } from "nexa-ui";
import NCard from "nexa-ui/components/Card";

const name = ref("");
const size: Size = "md";
const count = ref(0);
</script>

<template>
  <main style="max-width: 560px; margin: 48px auto; font-family: system-ui, sans-serif">
    <NCard hoverable>
      <template #header>
        <strong>外部示例项目（未安装 UnoCSS）</strong>
      </template>

      <NInput v-model="name" label="你的名字" placeholder="输入后观察下方" />
      <div style="margin-top: 16px">
        <NButton :size="size" @click="count++">
          点击 {{ count }} 次，你好{{ name ? `，${name}` : "" }}
        </NButton>
      </div>

      <div style="margin-top: 16px">
        <NBadge :value="count" type="success">
          <span style="display: inline-block; padding: 4px 12px; border: 1px solid #e2e8f0; border-radius: 8px">
            全局注册组件
          </span>
        </NBadge>
      </div>
    </NCard>
  </main>
</template>
