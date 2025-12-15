<script setup lang="ts">
import { useAsyncData } from '#app';
import { queryCollection } from '#imports';
import { useRoute } from 'vue-router';

const route = useRoute();

const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('content').path(route.path).first();
});
</script>

<template>
  <main>
    <div v-if="page" class="bg-main-900 md:px-12 px-2 py-32">
      <ContentRenderer :value="page" />
    </div>

    <div v-else>
      <h1>Page not found</h1>
    </div>
  </main>
</template>

<style scoped>
h1 {
  font-family: 'Satoshi', sans-serif;
  font-weight: bold;
}
</style>
