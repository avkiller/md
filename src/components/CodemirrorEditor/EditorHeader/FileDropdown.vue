<script setup lang="ts">
import { useStore } from '@/stores'
import { Download, FileCode, Upload, RefreshCw, Eraser, FileCog, } from 'lucide-vue-next'

const store = useStore()

const {
  isDark,
  isEditOnLeft,
} = storeToRefs(store)

const {
  exportEditorContent2HTML,
  exportEditorContent2MD,
  importMarkdownContent,
  resetContent,
  reloadDefaultContent,
  clearLocalStorage,
  dowloadAsCardImage,
} = store

const editorStateDialogVisible = ref(false)
</script>

<template>
  <MenubarMenu>
    <MenubarTrigger>
      文件
    </MenubarTrigger>
    <MenubarContent align="start">
      <MenubarItem @click="clearLocalStorage()">
        <RefreshCw class="mr-2 size-4" />
        清空本地缓存
      </MenubarItem> 
      <MenubarItem @click="resetContent()">
        <Eraser class="mr-2 size-4" />
        清空编辑区
      </MenubarItem> 
      <MenubarItem @click="reloadDefaultContent()">
        <RefreshCw class="mr-2 size-4" />
        重新加载默认MD
      </MenubarItem>  
      <MenubarItem @click="importMarkdownContent()">
        <Upload class="mr-2 size-4" />
        导入 .md
      </MenubarItem>
      <MenubarItem @click="exportEditorContent2MD()">
        <Download class="mr-2 size-4" />
        导出 .md
      </MenubarItem>
      <MenubarItem @click="exportEditorContent2HTML()">
        <FileCode class="mr-2 size-4" />
        导出 .html
      </MenubarItem>
      <MenubarItem @click="dowloadAsCardImage()">
        <Download class="mr-2 size-4" />
        导出 .png
      </MenubarItem>
      <MenubarSeparator />
      <MenubarItem @click="editorStateDialogVisible = true">
        <FileCog class="mr-2 size-4" />
        导入/导出项目配置
      </MenubarItem>
      <MenubarSeparator />
      <MenubarCheckboxItem v-model:checked="isDark">
        深色模式
      </MenubarCheckboxItem>
      <MenubarSeparator />
      <MenubarCheckboxItem v-model:checked="isEditOnLeft">
        左侧编辑
      </MenubarCheckboxItem>
    </MenubarContent>
  </MenubarMenu>

  <!-- 各弹窗挂载 -->
  <EditorStateDialog :visible="editorStateDialogVisible" @close="editorStateDialogVisible = false" />
</template>
