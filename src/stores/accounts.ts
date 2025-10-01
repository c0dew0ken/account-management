import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { MAX_LABELS_LENGTH, MAX_LOGIN_LENGTH, MAX_PASSWORD_LENGTH, STORAGE_KEY } from '@/constants'
import { storage, parseLabels as parseLabelsUtil } from '@/utils'
import type { Account, LabelTag, AccountType } from '@/types'

export const useAccountsStore = defineStore('accountsStore', () => {
  // State
  const accounts = ref<Account[]>([])

  // Getters
  const getAllAccounts = computed(() => accounts.value)

  const getAccountById = computed(() => (id: string) => {
    return accounts.value.find(account => account.id === id)
  })

  // Actions
  const validateAccount = (account: Account): boolean => {
    if (!account.login || account.login.trim().length === 0 || account.login.length > MAX_LOGIN_LENGTH) {
      return false
    }

    if (account.type === 'LOCAL' && (!account.password || account.password.length === 0 || account.password.length > MAX_PASSWORD_LENGTH)) {
      return false
    }

    const totalLabelsLength = account.labels.reduce((sum, label) => sum + label.text.length, 0)
    if (totalLabelsLength > MAX_LABELS_LENGTH) {
      return false
    }

    return true
  }

  const loadFromStorage = () => {
    accounts.value = storage.get(STORAGE_KEY, [])
  }

  const saveToStorage = () => {
    const validAccounts = accounts.value.filter(account => validateAccount(account))
    storage.set(STORAGE_KEY, validAccounts)
  }

  const parseLabels = (labelsInput: string): LabelTag[] => {
    if (!labelsInput.trim()) {
      return []
    }

    return parseLabelsUtil(labelsInput).map(label => ({ text: label }))
  }

  const addAccount = (account: Account) => {
    accounts.value.push(account)
    saveToStorage()
  }

  const updateAccount = (id: string, updates: Partial<Omit<Account, 'id'>>) => {
    const index = accounts.value.findIndex(acc => acc.id === id)
    if (index !== -1) {
      const current = accounts.value[index]
      if (current) {
        const updatedAccount = {
          ...current,
          ...updates,
          id: current.id,
        }

        accounts.value[index] = updatedAccount

        if (validateAccount(updatedAccount)) {
          saveToStorage()
        }
      }
    }
  }

  const deleteAccount = (id: string) => {
    const index = accounts.value.findIndex(acc => acc.id === id)
    if (index !== -1) {
      accounts.value.splice(index, 1)
      saveToStorage()
    }
  }

  const createEmptyAccount = (): Account => {
    return {
      id: `account_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      labels: [],
      type: 'LOCAL' as AccountType,
      login: '',
      password: '',
    }
  }

  return {
    // state
    accounts,

    // getters
    getAllAccounts,
    getAccountById,

    // actions
    validateAccount,
    loadFromStorage,
    saveToStorage,
    parseLabels,
    addAccount,
    updateAccount,
    deleteAccount,
    createEmptyAccount,
  }
})
