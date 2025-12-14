<template>
  <div>
    <header>
      <nav class="md:rounded-md md:h-14 h-16 md:w-160 w-full md:p-px fixed left-1/2 -translate-x-1/2 md:top-8 z-100">
        <div class="md:rounded-md flex items-center justify-center gap-6 h-full w-full bg-main-800 p-1">
          <UButton variant="ghost" size="xl" class="text-text-primary text-sm panchang cursor-not-allowed" disabled>Rólunk</UButton>
          <img src="/logo_feher_2.svg" alt="logo" class="h-full cursor-pointer" @click="$router.push('/')" />
          <UButton variant="ghost" size="xl" class="text-text-primary text-sm panchang" to="/#prices">Árak</UButton>
        </div>
      </nav>
    </header>
    <main>
      <slot />
      <!-- <CookieControl/> -->
    </main>
    <Footer></Footer>
  </div>
</template>

<style scoped>
nav {
  box-shadow: 3px 3px 10px var(--color-main-800);

  @media (width >= 48rem) {
    background: linear-gradient(to right, transparent 35%, var(--color-main-200), transparent 65%), linear-gradient(to bottom, var(--color-main-600), var(--color-main-700));
  }
}

.panchang {
  font-family: 'Panchang', serif;
  letter-spacing: 1px;
  font-weight: 500;
}

.cursor-not-allowed {
  cursor: not-allowed !important;
}
</style>
