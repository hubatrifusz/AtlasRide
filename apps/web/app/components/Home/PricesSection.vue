<template>
  <section id="prices" class="bg-main-200">
    <div class="md:mx-8 mx-2 md:py-48 px-4 py-12 rounded-t-2xl bg-gradient-to-tr from-main-700 via-main-800 to-main-900 flex flex-col justify-center items-center gap-6">
      <h2 class="text-4xl title_font mb-12">Árak</h2>
      <div class="grid md:grid-cols-2 grid-cols-1 gap-10">
        <div class="bg-main-500 rounded-xl shadow-md p-6 text-center">
          <h3 class="font-semibold text-lg">Győr - Budapest Nemzetközi repülőtér</h3>
          <p class="text-2xl font-bold mt-2">35 000 Ft-tól</p>
        </div>
        <div class="bg-main-500 rounded-xl shadow-md p-6 text-center">
          <h3 class="font-semibold text-lg">Győr - Schwechat Nemzetközi repülőtér</h3>
          <p class="text-2xl font-bold mt-2">30 000 Ft-tól</p>
        </div>
        <div class="bg-main-500 rounded-xl shadow-md p-6 text-center">
          <h3 class="font-semibold text-lg">Győr - Pozsonyi Nemzetközi repülőtér</h3>
          <p class="text-2xl font-bold mt-2">28 000 Ft-tól</p>
        </div>
        <div class="bg-main-600 rounded-xl shadow-md p-6 text-center">
          <h3 class="font-semibold text-lg">Egyéb fuvar</h3>
          <p class="text-lg mt-2">Kérjen személyre szabott árajánlatot</p>
        </div>
        <div class="md:col-span-2 text-text-secondary text-center">Csak privát transzferek érhetők el; nincs megosztott/járat típusú fuvar.</div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.title_font {
  font-family: 'Panchang', serif;
  letter-spacing: 3px;
}
</style>
