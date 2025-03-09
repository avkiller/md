<script setup lang="ts">
import { ContextMenuTrigger, type ContextMenuTriggerProps, useForwardProps } from 'radix-vue'

const props = defineProps<ContextMenuTriggerProps>()

const forwardedProps = useForwardProps(props) as ContextMenuTriggerProps
</script>

<template>
  <ContextMenuTrigger v-bind="forwardedProps">
    <slot />
  </ContextMenuTrigger>
</template>
