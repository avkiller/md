<script setup lang="ts">
import { MenubarSub, type MenubarSubEmits, useForwardPropsEmits } from 'radix-vue'

interface MenubarSubRootProps {
  defaultOpen?: boolean
  open?: boolean
}

const props = defineProps<MenubarSubRootProps>()
const emits = defineEmits<MenubarSubEmits>()

const forwarded = useForwardPropsEmits(props, emits) as MenubarSubRootProps
</script>

<template>
  <MenubarSub v-bind="forwarded">
    <slot />
  </MenubarSub>
</template>
