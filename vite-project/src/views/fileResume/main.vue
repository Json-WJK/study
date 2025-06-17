<template>
  <div>
    <h1>秒传</h1>
    <p>
      文件秒传功能可以通过比较文件的哈希值来实现。以下是一个简单的实现思路：
    </p>
    <!-- 文件上传 -->
    <input type="file" @change="handleFileChange" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { calculateFileHash, createChunks } from "@/utils";
const file = ref<File | null>(null);
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    file.value = target.files[0];
    console.log("选择的文件:", file.value);
    checkFileHash(file.value);
  }
};

// 检查文件哈希值是否存在
const checkFileHash = (file: File) => {
  calculateFileHash(file).then((hash) => {
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
            } else {
              uploadFile(file, hash);
              // createChunks(file).forEach((chunk, index) => {
              //   const chunkHash: string = `${hash}-${index}`;
              //   console.log(`上传分片 ${index + 1} 的哈希值:`, chunkHash);
              //   uploadChunk(new File([chunk], `${chunkHash}`)).then(() => {
              //     console.log(`分片 ${index + 1} 上传成功`);
              //   });
              // });
            }
          });
        }
      }
    );
  });
};

// 检查chunk
const checkChunk = (hash: string) => {
  return fetch(`http://localhost:3000/api/check-chunk?hash=${hash}`).then(
    (response) => response.json()
  );
};

// 上传chunk
const uploadChunk = (chunk: File) => {
  const formData = new FormData();
  formData.append("chunk", chunk);
  return fetch("http://localhost:3000/api/upload-chunk", {
    method: "POST",
    body: formData,
  });
};

// 上传文件
const uploadFile = (file: File, hash: string) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("hash", hash);
  fetch("http://localhost:3000/api/upload", {
    method: "POST",
    body: formData,
  });
};
</script>

<style></style>
