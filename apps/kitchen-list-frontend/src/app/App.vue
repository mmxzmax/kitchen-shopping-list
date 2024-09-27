<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
</script>


<template>
  <header>
    <nav>
      <RouterLink to="/">Home</RouterLink>
    </nav>
  </header>
  <RouterView />
</template>

<style scoped lang="scss">
header {
  line-height: 1.5;
  max-width: 100vw;
}
</style>
