import { ref } from 'vue'

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const storedValue = ref<T>(defaultValue)

  const load = () => {
    try {
      const item = localStorage.getItem(key)
      if (item) {
        storedValue.value = JSON.parse(item)
      }
    } catch (error) {
      console.error(`Error loading ${key} from storage:`, error)
    }
  }

  const save = (value: T) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      storedValue.value = value
    } catch (error) {
      console.error(`Error saving ${key} to storage:`, error)
    }
  }

  return { storedValue, load, save }
}
