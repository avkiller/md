<script setup lang="ts">
import { useStore } from '@/stores'

import { storeToRefs } from 'pinia'

const store = useStore()

const {
  isDark,
  isEditOnLeft,
} = storeToRefs(store)

const {
  toggleDark,
  toggleEditOnLeft,
  exportEditorContent2HTML,
  exportEditorContent2MD,
  importMarkdownContent,
  resetContent,
  reloadDefaultContent,
  clearLocalStorage,
} = store
</script>

<template>
  <MenubarMenu>
    <MenubarTrigger>
      文件
    </MenubarTrigger>
    <MenubarContent align="start">
      <MenubarItem @click="clearLocalStorage()">
        <el-icon class="mr-2 h-4 w-4">
          <ElIconDeleteFilled />
        </el-icon>
        清空本地缓存
      </MenubarItem> 
      <MenubarItem @click="resetContent()">
        <el-icon class="mr-2 h-4 w-4">
          <ElIconRefresh />
        </el-icon>
        清空编辑区
      </MenubarItem> 
      <MenubarItem @click="reloadDefaultContent()">
        <el-icon class="mr-2 h-4 w-4">
          <ElIconLoading />
        </el-icon>
        重新加载默认MD
      </MenubarItem>  
      <MenubarItem @click="importMarkdownContent()">
        <el-icon class="mr-2 h-4 w-4">
          <ElIconUpload />
        </el-icon>
        导入 .md
      </MenubarItem>
      <MenubarItem @click="exportEditorContent2MD()">
        <el-icon class="mr-2 h-4 w-4">
          <ElIconDownload />
        </el-icon>
        导出 .md
      </MenubarItem>
      <MenubarItem @click="exportEditorContent2HTML()">
        <el-icon class="mr-2 h-4 w-4">
          <ElIconDocument />
        </el-icon>
        导出 .html
      </MenubarItem>
      <MenubarSeparator />
      <MenubarItem @click="toggleDark()">
        <el-icon class="mr-2 h-4 w-4" :class="{ 'opacity-0': !isDark }">
          <ElIconCheck />
        </el-icon>
        深色模式
      </MenubarItem>
      <MenubarSeparator />
      <MenubarItem @click="toggleEditOnLeft()">
        <el-icon class="mr-2 h-4 w-4" :class="{ 'opacity-0': !isEditOnLeft }">
          <ElIconCheck />
        </el-icon>
        左侧编辑
      </MenubarItem>
    </MenubarContent>
  </MenubarMenu>
</template>
