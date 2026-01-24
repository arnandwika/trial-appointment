import Swal from 'sweetalert2'

export function useAlert() {
  const success = (title, text = '') => {
    return Swal.fire({
      icon: 'success',
      title,
      text
    })
  }

  const error = (title, text = '') => {
    return Swal.fire({
      icon: 'error',
      title,
      text
    })
  }

  const confirm = (title, text = '') => {
    return Swal.fire({
      icon: 'warning',
      title,
      text,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    })
  }

  return { success, error, confirm }
}
