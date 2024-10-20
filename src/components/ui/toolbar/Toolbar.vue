<script setup lang="ts">
import type {ToolbarRootProps } from 'radix-vue'
import { ToolbarRoot, useForwardPropsEmits } from 'radix-vue'

const props = defineProps<ToolbarRootProps>()
const forwarded = useForwardPropsEmits(props)

</script>

<template>
    <ToolbarRoot v-bind="forwarded">
      <slot />
    </ToolbarRoot>
  </template>