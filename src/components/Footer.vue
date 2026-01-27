<template>
  <header class="footer">
    <div class="footer-container container grid">
      <div class="col-4 text-left">© 2026 Morgen Pilates & Yoga Studio. All rights reserved.</div>
      <div class="col-4 text-center">
        <img src="@/assets/logo.png" class="w-1rem h-auto" alt="Morgen Pilates" />
      </div>
      <div class="col-4 text-right">
        <i class="pi pi-instagram cursor-pointer"></i>
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
