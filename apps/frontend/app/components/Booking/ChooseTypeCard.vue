<script setup lang="ts">
const props = defineProps({
  title: { type: String, required: true },
  description: { type: String, required: true },
  buttonText: { type: String, required: true },
});
</script>

<template>
  <div
    id="container"
    class="relative cursor-pointer aspect-square md:aspect-5/7 w-full md:w-[30%] bg-main-800 rounded-xl border border-second-600 flex flex-col items-center justify-between md:p-2 p-4 overflow-clip"
  >
    <svg viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg" class="absolute -top-25 blur-xl">
      <path
        fill="#1B202D"
        d="M48,-58C53.7,-42.3,44,-21.2,40.7,-3.3C37.3,14.5,40.4,28.9,34.6,44C28.9,59.1,14.5,74.8,0,74.8C-14.5,74.8,-29.1,59.2,-43.4,44.2C-57.8,29.1,-72,14.5,-67.9,4C-63.9,-6.5,-41.6,-12.9,-27.3,-28.6C-12.9,-44.3,-6.5,-69.2,7.4,-76.6C21.2,-83.9,42.3,-73.7,48,-58Z"
        transform="translate(100 100), rotate(240)"
      />
    </svg>

    <svg viewBox="0 0 210 210" xmlns="http://www.w3.org/2000/svg" class="absolute -bottom-30 -left-10 blur-xl">
      <path
        fill="#1B202D"
        d="M26,-31.9C33.9,-18.1,40.7,-9,46.9,6.2C53.1,21.4,58.7,42.8,50.8,51.9C42.8,61,21.4,57.8,3.6,54.2C-14.2,50.6,-28.3,46.5,-32.7,37.4C-37.1,28.3,-31.8,14.2,-34.1,-2.3C-36.5,-18.8,-46.5,-37.7,-42.1,-51.4C-37.7,-65.2,-18.8,-73.9,-4.9,-69C9,-64.1,18.1,-45.6,26,-31.9Z"
        transform="translate(100 100),rotate(120)"
      />
    </svg>

    <div></div>
    <div id="text" class="flex flex-col items-center md:gap-3 gap-4 z-3">
      <h2 class="md:text-2xl text-3xl">{{ props.title }}</h2>
      <p class="text-second-200 md:text-xs text-sm text-center">{{ props.description }}</p>
    </div>
    <div class="w-full z-3">
      <UButton variant="solid" size="lg" class="w-full flex justify-center text-text-inverse">{{ props.buttonText }}</UButton>
    </div>
  </div>
</template>

<style scoped>
#container {
  transition: all 200ms ease-in-out;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 10px 30px -10px var(--color-main-600);
  }
}
</style>
