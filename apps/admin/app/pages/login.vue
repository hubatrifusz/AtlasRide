<script setup lang="ts">
import { vMaska } from 'maska/vue';

const digits = ref<number[]>(new Array(6).fill(null));
</script>

<template>
  <div class="flex justify-center items-center h-screen w-full">
    <UPageCard spotlight spotlight-color="secondary" class="flex flex-col items-center p-8">
      <div class="flex flex-col items-center gap-4">
        <h2 class="text-xl font-semibold">Bejelentkezés</h2>
        <div class="flex gap-2">
          <UInputNumber
            v-for="(_, index) in digits"
            :key="index"
            v-model="digits[index]"
            v-maska="'#'"
            :increment="false"
            :decrement="false"
            class="w-[2rem]"
            size="lg"
          ></UInputNumber>
        </div>
      </div>
    </UPageCard>
  </div>
</template>
