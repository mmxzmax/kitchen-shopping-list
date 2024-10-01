<script setup lang="ts">
import { ref } from 'vue'

const data = ref(null)
const error = ref(null)

fetch('/api/hello')
  .then((res) => res.json())
  .then((json) => (data.value = json))
  .catch((err) => (error.value = err))
</script>

<template>
  <main>{{ data }} testing ci {{ error }}</main>
</template>
