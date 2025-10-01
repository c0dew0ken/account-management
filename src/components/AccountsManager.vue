<template>
  <v-container fluid class="pa-6">
    <v-card>
      <v-card-title class="d-flex align-center justify-space-between pa-6">
        <div class="d-flex align-center">
          <v-icon
            left
            size="32"
            color="primary"
          >
            mdi-account-multiple
          </v-icon>
          <span class="text-h4 ml-3">Учетные записи ({{ accountsStore.accounts.length }})</span>
        </div>
        <v-btn
          color="primary"
          size="large"
          @click="addNewAccount"
        >
          <v-icon left>
            mdi-plus
          </v-icon>
          Добавить
        </v-btn>
      </v-card-title>

      <v-divider />

      <!-- Подсказка для поля метка -->
      <v-card-text class="pa-6">
        <v-alert
          type="info"
          variant="tonal"
          class="mb-6"
          border="start"
        >
          <div class="d-flex align-center">
            Для указания нескольких меток для одной пары логин/пароль используйте разделитель <strong class="ml-1">;</strong>
          </div>
        </v-alert>

        <!-- Список учетных записей -->
        <div v-if="accountsStore.accounts.length > 0" class="accounts-list">
          <!-- Заголовки колонок -->
          <v-card variant="outlined" class="headers-card mb-4">
            <v-card-text class="pa-4">
              <v-row no-gutters class="align-center">
                <v-col cols="4" class="pr-3">
                  <div class="header-label">
                    <v-icon size="16" class="mr-2">
                      mdi-tag-multiple
                    </v-icon>
                    Метки
                  </div>
                </v-col>
                <v-col cols="2" class="px-3">
                  <div class="header-label">
                    <v-icon size="16" class="mr-2">
                      mdi-account-key
                    </v-icon>
                    Тип
                  </div>
                </v-col>
                <v-col cols="3" class="px-3">
                  <div class="header-label">
                    <v-icon size="16" class="mr-2">
                      mdi-account
                    </v-icon>
                    Логин
                  </div>
                </v-col>
                <v-col cols="3" class="pl-3">
                  <div class="header-label">
                    <v-icon size="16" class="mr-2">
                      mdi-lock
                    </v-icon>
                    Пароль
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <div class="accounts-grid">
            <AccountItem
              v-for="account in accountsStore.accounts"
              :key="account.id"
              :account="account"
            />
          </div>
        </div>

        <!-- Пустое состояние -->
        <v-card
          v-else
          variant="outlined"
          class="pa-8 text-center"
        >
          <v-icon size="64" color="grey-lighten-1">
            mdi-account-off
          </v-icon>
          <div class="text-h6 mt-4 text-grey">
            Учетные записи отсутствуют
          </div>
          <div class="text-body-2 text-grey mt-2">
            Нажмите кнопку "Добавить учетную запись" для создания новой записи
          </div>
        </v-card>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useAccountsStore } from '@/stores'
import AccountItem from './AccountItem.vue'
import { useValidation } from '@/composables'

const accountsStore = useAccountsStore()
const { validateLogin, validatePassword, validateLabels } = useValidation()

const hasValidationErrors = computed(() => {
  return accountsStore.accounts.some((account) => {
    const loginError = !validateLogin(account.login)
    const passwordError = account.type === 'LOCAL' && !validatePassword(account.password || '')
    const labelsError = !validateLabels(account.labels.map(label => label.text))

    return loginError || passwordError || labelsError
  })
})

function handleBeforeUnload(event: BeforeUnloadEvent) {
  if (hasValidationErrors.value) {
    event.preventDefault()
    event.returnValue = 'У вас есть аккаунты с ошибками валидации. При перезагрузке страницы эти аккаунты могут быть потеряны. Вы уверены, что хотите покинуть страницу?'
    return event.returnValue
  }
}

onMounted(() => {
  accountsStore.loadFromStorage()
  window.addEventListener('beforeunload', handleBeforeUnload)
})

onUnmounted(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
})

function addNewAccount() {
  const newAccount = accountsStore.createEmptyAccount()
  accountsStore.addAccount(newAccount)
}
</script>

<style lang="scss" scoped>
@use './AccountsManager.scss';
</style>
