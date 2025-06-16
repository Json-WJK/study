<template>
  <div>
    <h1>Todo List</h1>

    <input v-model="newTodo" placeholder="Add a new todo" @keyup.enter="addTodo" />

    <ul>
      <li v-for="todo in todos" :key="todo.id">
        <input type="checkbox" v-model="todo.completed" />
        {{ todo.text }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { type TodoItem } from "@/types/todoList/todoList";
const newTodo = ref<string>("");
const todos = ref<TodoItem[]>([]);
const addTodo = () => {
  if (newTodo.value.trim() === "") return;
  todos.value.push({
    id: Date.now(),
    text: newTodo.value,
    completed: false,
  });
  newTodo.value = "";
};
</script>

<style>
</style>