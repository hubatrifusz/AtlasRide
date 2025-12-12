<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useBookingForm } from '~/composables/useBookingForm';

const { clearForm } = useBookingForm();
const emit = defineEmits(['selectType']);

const stepForm = ref({
  rideType: '',
});

function selectType(type: string) {
  stepForm.value.rideType = type;
  emit('selectType', type);
}

onMounted(() => {
  clearForm();
});
</script>

<template>
  <div class="w-7/10 flex lg:flex-row flex-col items-center justify-center gap-10 py-12">
    <div class="card_border flex-1 lg:aspect-3/4 w-full aspect-2/1" id="ceges" @click="selectType('céges')">
      <div class="card">Céges</div>
    </div>
    <div class="card_border flex-1 lg:aspect-3/4 w-full aspect-2/1" id="repteri" @click="selectType('reptéri')">
      <div class="card">Reptéri</div>
    </div>
    <div class="card_border flex-1 lg:aspect-3/4 w-full aspect-2/1" id="egyeni" @click="selectType('egyéb')">
      <div class="card">Egyéni</div>
    </div>
  </div>
</template>

<style>
.card {
  background-color: var(--color-main-800);
  border-radius: calc(var(--ui-radius) * 1.5);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: var(--text-xl);
  line-height: var(--tw-leading, var(--text-xl--line-height));
  color: var(--color-text-primary);
  cursor: pointer;
  height: 100%;
  width: 100%;
}

.card_border {
  background: linear-gradient(to bottom, var(--color-main-600), var(--color-main-800));
  border-radius: calc(var(--ui-radius) * 1.5);
  padding: 2px;
  transition: all 0.3s ease-in-out;

  &:hover {
    box-shadow: 0 0 32px var(--color-accent-500);
    background: linear-gradient(to bottom, var(--color-main-400), var(--color-main-700));
    transform: scale(1.05);
  }
}
</style>
