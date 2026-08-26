<script setup lang="ts">
import { ref } from "vue";
// 统一入口引入
import { NButton, NCard } from "nexa-ui";
// 按组件引入（深路径，无需在 nexa-ui 中逐组件登记导出路径）
import { NInput } from "nexa-ui/components/Input";
import { NBadge } from "nexa-ui/components/Badge";

const name = ref("");
const clicks = ref(0);
</script>

<template>
  <main class="page">
    <NCard>
      <template #header>
        <div>
          <h3>nexa-ui 外部消费示例</h3>
          <p>当前项目通过 tarball 安装 nexa-ui，不共享组件库的任何构建配置</p>
        </div>
      </template>
      <div class="row">
        <NButton @click="clicks++">统一入口按钮（点击 {{ clicks }} 次）</NButton>
        <NBadge :value="clicks" type="error">
          <NButton variant="outline">徽标</NButton>
        </NBadge>
      </div>
      <NInput
        v-model="name"
        label="项目名称"
        placeholder="请输入名称"
        help-text="该输入框来自 nexa-ui/components/Input 按需引入"
      />
      <p v-if="name" class="echo">你好，{{ name }}</p>
    </NCard>
  </main>
</template>

<style scoped>
.page {
  max-width: 640px;
  margin: 40px auto;
}
.row {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
}
.echo {
  margin-top: 12px;
}
</style>
