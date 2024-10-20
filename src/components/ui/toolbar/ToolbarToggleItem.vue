<script setup lang="ts">
import {
  ToolbarToggleItem,
  type ToolbarToggleItemProps,
  useForwardProps,
} from 'radix-vue'
import { cn } from '@/lib/utils'
import { computed, type HTMLAttributes } from 'vue'

// const props = defineProps<ToolbarToggleItemProps>()
const props = defineProps<ToolbarToggleItemProps & { class?: HTMLAttributes[`class`] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwardedProps = useForwardProps(delegatedProps)

</script>
<template>
  <ToolbarToggleItem
    v-bind="forwardedProps"
    :class="cn(
      'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
    )"
  >
    <slot />
  </ToolbarToggleItem>
</template>