<script setup lang="ts">
import { ref } from 'vue'
import { NButton, NCard, NInput, NBadge } from 'nexa-ui'
import NButtonSubpath from 'nexa-ui/Button'
import type { Size, Status } from 'nexa-ui'
import type { Column, NTableProps } from 'nexa-ui/Table'

const name = ref('')
const submitted = ref(false)

const sizes: Size[] = ['xs', 'sm', 'md', 'lg', 'xl']
const statuses: Status[] = ['success', 'warning', 'error', 'info']

interface UserRow {
  id: number
  name: string
  email: string
  role: string
}

const columns: Column<UserRow>[] = [
  { key: 'name', label: '姓名', sortable: true },
  { key: 'email', label: '邮箱' },
  { key: 'role', label: '角色' },
]

const _tablePropsCheck: NTableProps<UserRow> = {
  data: [],
  columns,
}

const data: UserRow[] = [
  { id: 1, name: '张三', email: 'zhangsan@example.com', role: '管理员' },
  { id: 2, name: '李四', email: 'lisi@example.com', role: '开发者' },
  { id: 3, name: '王五', email: 'wangwu@example.com', role: '设计师' },
]

const activeTab = ref('demo')

function handleSubmit() {
  submitted.value = true
  setTimeout(() => (submitted.value = false), 2000)
}
</script>

<template>
  <div style="max-width: 800px; margin: 0 auto; padding: 2rem; font-family: system-ui, sans-serif;">
    <h1 style="font-size: 1.75rem; font-weight: 700; color: #0f172a; margin-bottom: 0.5rem;">
      Nexa UI Playground
    </h1>
    <p style="color: #64748b; margin-bottom: 2rem;">
      外部项目通过 <code>nexa-ui</code> 包消费构建产物 — 验证 ESM/CJS/类型/样式完整链路
    </p>

    <NCard style="margin-bottom: 1.5rem;">
      <template #header>
        <h3 style="font-weight: 600; color: #0f172a;">1. 全量引入 (app.use)</h3>
        <p style="font-size: 0.875rem; color: #64748b; margin-top: 0.25rem;">
          通过插件注册，所有组件全局可用
        </p>
      </template>
      <div style="display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center;">
        <NButton size="lg" @click="handleSubmit">
          {{ submitted ? '✓ 已提交' : '提交' }}
        </NButton>
        <NButton variant="outline" size="lg">描边</NButton>
        <NButton variant="ghost" size="lg">幽灵</NButton>
      </div>
    </NCard>

    <NCard style="margin-bottom: 1.5rem;">
      <template #header>
        <h3 style="font-weight: 600; color: #0f172a;">2. 具名引入 + 子路径引入</h3>
        <p style="font-size: 0.875rem; color: #64748b; margin-top: 0.25rem;">
          支持 tree-shaking 的按需引入
        </p>
      </template>
      <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
          <label style="font-size: 0.875rem; color: #334155;">具名引入 NInput</label>
          <NInput v-model="name" placeholder="输入你的名字" />
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
          <label style="font-size: 0.875rem; color: #334155;">子路径 NButton (nexa-ui/Button)</label>
          <NButtonSubpath variant="outline" @click="handleSubmit">
            子路径按钮 #{{ name || '匿名' }}
          </NButtonSubpath>
        </div>
        <NBadge :value="sizes.length" type="error">
          <NButton variant="ghost">尺寸数量</NButton>
        </NBadge>
      </div>
    </NCard>

    <NCard style="margin-bottom: 1.5rem;">
      <template #header>
        <h3 style="font-weight: 600; color: #0f172a;">3. 尺寸与状态变体</h3>
      </template>
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <div style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;">
          <span style="font-size: 0.8rem; color: #94a3b8; width: 3rem;">Sizes:</span>
          <NButton v-for="s in sizes" :key="s" :size="s">{{ s }}</NButton>
        </div>
        <div style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;">
          <span style="font-size: 0.8rem; color: #94a3b8; width: 3rem;">Status:</span>
          <NBadge v-for="st in statuses" :key="st" :value="st" :type="st" dot>
            <span style="padding: 0.25rem 0.5rem; font-size: 0.8rem;">{{ st }}</span>
          </NBadge>
        </div>
      </div>
    </NCard>

    <NCard>
      <template #header>
        <h3 style="font-weight: 600; color: #0f172a;">4. 类型导入验证</h3>
        <p style="font-size: 0.875rem; color: #64748b; margin-top: 0.25rem;">
          Size / Status / Column / NTableProps 类型从包中正确解析
        </p>
      </template>
      <table style="width: 100%; font-size: 0.875rem; border-collapse: collapse;">
        <thead>
          <tr style="border-bottom: 1px solid #e2e8f0; text-align: left;">
            <th style="padding: 0.5rem;">ID</th>
            <th style="padding: 0.5rem;">姓名 (Column 泛型)</th>
            <th style="padding: 0.5rem;">邮箱</th>
            <th style="padding: 0.5rem;">角色</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in data" :key="row.id" style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 0.5rem;">{{ row.id }}</td>
            <td style="padding: 0.5rem;">{{ row.name }}</td>
            <td style="padding: 0.5rem;">{{ row.email }}</td>
            <td style="padding: 0.5rem;">{{ row.role }}</td>
          </tr>
        </tbody>
      </table>
      <p style="margin-top: 1rem; font-size: 0.8rem; color: #22c55e;">
        ✓ 所有组件、类型、样式均从 nexa-ui 包正确解析
      </p>
    </NCard>
  </div>
</template>
