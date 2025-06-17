<template>
  <div>
    <h1>秒传</h1>
    <p>文件秒传功能可以通过比较文件的哈希值来实现。以下是一个简单的实现思路：</p>
    <!-- 文件上传 -->
    <input type="file" @change="handleFileChange" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { calculateFileHash } from "@/utils";
const file = ref<File | null>(null);
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    file.value = target.files[0];
    console.log("选择的文件:", file.value);
    calculateFileHash(file.value).then((hash) => {
      console.log("文件哈希值:", hash);
    });
  }
};
</script>

<style>
</style>