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
      // 检查哈希值是否已存在
      fetch(`http://localhost:3000/api/check-hash?hash=${hash}`).then(
        (response) => {
          if (response.ok) {
            console.log("response:", response);
            response.json().then((data) => {
              console.log("data:", data);
              if (data.exists) {
                console.log("文件已存在，秒传成功");
                alert("文件已存在，秒传成功");
              } else {
                const formData = new FormData();
                formData.append("file", file.value);
                formData.append("hash", hash);
                fetch("http://localhost:3000/api/upload", {
                  method: "POST",
                  body: formData,
                });
              }
            });
          }
        }
      );
    });
  }
};
</script>

<style>
</style>