<template>
  <Toast />
  <LoginModal />
  <router-view />
</template>

<script setup>
import Toast from 'primevue/toast'
import LoginModal from '@/components/LoginModal.vue'
</script>
