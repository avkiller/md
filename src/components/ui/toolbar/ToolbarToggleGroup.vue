<script setup lang="ts">
import { 
  ToolbarToggleGroup, 
  type ToolbarToggleGroupProps,
  type ToolbarToggleGroupEmits,
  useForwardPropsEmits
 } from 'radix-vue'
 import { computed, type HTMLAttributes } from 'vue'

const props = defineProps<ToolbarToggleGroupProps & { class?: HTMLAttributes[`class`], inset?: boolean }>()
const emits = defineEmits<ToolbarToggleGroupEmits>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <ToolbarToggleGroup v-bind="forwarded">
    <slot />
  </ToolbarToggleGroup>
</template>
