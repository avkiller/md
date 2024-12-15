<script setup lang="ts">
import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from '@/components/ui/menubar'
import { useDisplayStore } from '@/stores'
import { TableIcon } from 'lucide-vue-next'

// toggleShowUploadImgDialog
const { toggleShowInsertFormDialog } = useDisplayStore()
</script>

<template>
  <MenubarMenu>
    <MenubarTrigger>
      编辑
    </MenubarTrigger>
    <MenubarContent align="start">
      <!--      <MenubarItem @click="toggleShowUploadImgDialog()"> -->
      <!--        <UploadCloudIcon class="mr-2 h-4 w-4" /> -->
      <!--        上传图片 -->
      <!--      </MenubarItem> -->
      <MenubarItem @click="toggleShowInsertFormDialog()">
        <TableIcon class="mr-2 h-4 w-4" />
        插入表格
      </MenubarItem>
    </MenubarContent>
  </MenubarMenu>
</template>
