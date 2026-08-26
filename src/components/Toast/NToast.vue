<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { Status, Position } from '@/types'

interface Props {
  message: string
  type?: Status
  position?: Position
  duration?: number
  closable?: boolean
  showProgress?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  position: 'top-right',
  duration: 3000,
  closable: true,
  showProgress: true,
})

const emit = defineEmits<{
  close: []
}>()

const visible = ref(true)
const progress = ref(100)

const typeConfig: Record<Status, { icon: string; bg: string; iconBg: string }> = {
  success: { icon: 'i-mdi-check', bg: 'bg-success-500', iconBg: 'bg-success-100 text-success-600' },
  error: { icon: 'i-mdi-close', bg: 'bg-error-500', iconBg: 'bg-error-100 text-error-600' },
  warning: { icon: 'i-mdi-alert', bg: 'bg-warning-500', iconBg: 'bg-warning-100 text-warning-600' },
  info: { icon: 'i-mdi-information', bg: 'bg-info-500', iconBg: 'bg-info-100 text-info-600' },
}

const positionClasses: Record<Position, string> = {
  'top-left': 'top-4 left-4',
  'top-right': 'top-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'bottom-right': 'bottom-4 right-4',
}

const classes = computed(() => [
  'fixed z-toast min-w-80 max-w-md p-4 rounded-xl shadow-lg',
  'bg-white/80 backdrop-blur-xl ring-1 ring-white/20',
  positionClasses[props.position],
  `nexa-toast-${props.position}`,
])

function close() {
  visible.value = false
  emit('close')
}

onMounted(() => {
  if (props.duration > 0) {
    const interval = setInterval(() => {
      progress.value -= 100 / (props.duration / 100)
      if (progress.value <= 0) {
        clearInterval(interval)
        close()
      }
    }, 100)
  }
})
</script>

<template>
  <Transition name="nexa-toast" appear>
    <div
      v-if="visible"
      :class="classes"
      role="alert"
    >
    <div class="flex items-start gap-3">
      <span :class="['flex items-center justify-center w-6 h-6 rounded-full', typeConfig[type].iconBg]">
        <i :class="[typeConfig[type].icon, 'text-sm']" />
      </span>
      <p class="flex-1 text-sm text-surface-700 pt-0.5">{{ message }}</p>
      <button
        v-if="closable"
        class="text-surface-400 hover:text-surface-600 hover:bg-surface-100 nexa-transition p-1 rounded-md -mr-1"
        aria-label="Close"
        @click="close"
      >
        <i class="i-mdi-close w-4 h-4" />
      </button>
    </div>
    <div
      v-if="showProgress && duration > 0"
      class="absolute bottom-0 left-0 h-0.5 rounded-b-xl nexa-transition"
      :class="typeConfig[type].bg"
      :style="{ width: `${progress}%` }"
    />
    </div>
  </Transition>
</template>

<style scoped>
.nexa-toast-enter-active {
  transition:
    opacity 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.nexa-toast-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.nexa-toast-enter-from,
.nexa-toast-leave-to {
  opacity: 0;
}
.nexa-toast-enter-from.nexa-toast-top-right,
.nexa-toast-leave-to.nexa-toast-top-right,
.nexa-toast-enter-from.nexa-toast-bottom-right,
.nexa-toast-leave-to.nexa-toast-bottom-right {
  transform: translateX(64px) scale(0.9);
}
.nexa-toast-enter-from.nexa-toast-top-left,
.nexa-toast-leave-to.nexa-toast-top-left,
.nexa-toast-enter-from.nexa-toast-bottom-left,
.nexa-toast-leave-to.nexa-toast-bottom-left {
  transform: translateX(-64px) scale(0.9);
}
</style>
