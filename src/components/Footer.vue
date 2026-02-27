<template>
  <header class="footer bottom-0">
    <div class="footer-container container grid">
      <div class="col-5 text-left md:text-md text-xs">
        <div>© 2026 Morgen Pilates & Yoga Studio. All rights reserved.</div>
        <a href="https://www.instagram.com/morgenstudios.id/" target="_blank">
          <i class="pi pi-instagram" style="font-size: 0.6rem"><u class="text-base ml-1">morgenstudios.id</u></i>
        </a>
      </div>
      <div class="col-2 text-center">
        <img src="@/assets/identity_logo/logo.png" class="w-1rem h-auto" alt="Morgen Pilates" />
      </div>
      <div class="col-5 text-right md:text-md text-xs">
        <div class="mb-1">Jl. Bendungan Jatiluhur No. 28 Central Jakarta</div>
        <div class="mt-1">+62 852 1234 1263</div>
      </div>
    </div>
  </header>
</template>

<script setup>

</script>

<style lang="scss" scoped>

.footer {
  height: 100%;
  z-index: 1000;
  background: $bg-primary;
  border-top: 1px solid rgba(0,0,0,.05);
}

.footer-container {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
}

</style>
