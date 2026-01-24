import { ref } from 'vue'

const showLogin = ref(false)

export function useLoginModal() {
  const openModal = () => {
    showLogin.value = true
  }

  const closeModal = () => {
    showLogin.value = false
  }

  return {
    showLogin,
    openModal,
    closeModal
  }
}
