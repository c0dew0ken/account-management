import { computed, ref } from 'vue'
import { MAX_LABELS_LENGTH, MAX_LOGIN_LENGTH, MAX_PASSWORD_LENGTH } from '@/constants'

export function useValidation() {
  const errors = ref<Record<string, boolean>>({})

  const validateLogin = (login: string): boolean => {
    return login.trim().length > 0 && login.length <= MAX_LOGIN_LENGTH
  }

  const validatePassword = (password: string): boolean => {
    return password.trim().length > 0 && password.length <= MAX_PASSWORD_LENGTH
  }

  const validateLabels = (labels: string[]): boolean => {
    const totalLength = labels.join('; ').length
    return totalLength <= MAX_LABELS_LENGTH
  }

  const validateField = (field: string, value: any, validator: (val: any) => boolean) => {
    const isValid = validator(value)
    errors.value[field] = !isValid
    return isValid
  }

  const hasErrors = computed(() => Object.values(errors.value).some(Boolean))

  const clearErrors = () => {
    errors.value = {}
  }

  return {
    errors,
    validateLogin,
    validatePassword,
    validateLabels,
    validateField,
    hasErrors,
    clearErrors,
  }
}
