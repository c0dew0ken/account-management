<template>
  <v-card
    variant="elevated"
    class="account-card"
  >
    <v-card-text class="pa-4">
      <v-row class="align-center" no-gutters>
        <!-- Метки -->
        <v-col cols="4" class="pr-3">
          <v-combobox
            v-model="labelsInput"
            placeholder="Метки"
            variant="outlined"
            density="compact"
            multiple
            chips
            closable-chips
            :error="labelsExceeded"
            :delimiters="[';']"
            hide-details
            class="custom-combobox"
            @update:model-value="handleLabelsChange"
          >
            <template #append-inner>
              <div class="text-caption" :class="labelsExceeded ? 'text-error' : 'text-medium-emphasis'">
                {{ labelsLength }}/{{ MAX_LABELS_LENGTH }}
              </div>
            </template>
          </v-combobox>
        </v-col>

        <!-- Тип записи -->
        <v-col cols="2" class="px-3">
          <v-select
            v-model="type"
            :items="accountTypes"
            variant="outlined"
            density="compact"
            hide-details
            class="custom-select"
            @update:model-value="handleTypeChange"
          />
        </v-col>

        <v-col cols="6" class="pl-3">
          <v-row no-gutters>
            <!-- Логин -->
            <v-col :cols="showPassword ? 6 : 11" class="pr-2">
              <v-text-field
                v-model="login"
                placeholder="Логин"
                variant="outlined"
                density="compact"
                :error="validationErrors.login || loginExceeded"
                hide-details
                class="custom-textfield"
                @blur="handleBlur('login')"
              >
                <template #append-inner>
                  <div class="text-caption" :class="loginExceeded ? 'text-error' : 'text-medium-emphasis'">
                    {{ loginLength }}/{{ MAX_LOGIN_LENGTH }}
                  </div>
                </template>
              </v-text-field>
            </v-col>

            <!-- Пароль -->
            <v-col
              v-if="showPassword"
              cols="5"
              class="px-2"
            >
              <v-text-field
                v-model="password"
                placeholder="Пароль"
                :type="showPasswordText ? 'text' : 'password'"
                variant="outlined"
                density="compact"
                :error="validationErrors.password || passwordExceeded"
                hide-details
                class="custom-textfield"
                @blur="handleBlur('password')"
              >
                <template #append-inner>
                  <div class="d-flex align-center gap-2">
                    <div class="text-caption" :class="passwordExceeded ? 'text-error' : 'text-medium-emphasis'">
                      {{ passwordLength }}/{{ MAX_PASSWORD_LENGTH }}
                    </div>
                    <v-btn
                      icon
                      size="small"
                      variant="text"
                      @click="showPasswordText = !showPasswordText"
                    >
                      <v-icon size="18">
                        {{ showPasswordText ? 'mdi-eye-off' : 'mdi-eye' }}
                      </v-icon>
                    </v-btn>
                  </div>
                </template>
              </v-text-field>
            </v-col>

            <!-- Кнопка удаления -->
            <v-col cols="auto" class="pl-2">
              <v-btn
                icon
                size="small"
                variant="text"
                color="error"
                class="delete-btn"
                @click="deleteAccount"
              >
                <v-icon size="16">
                  mdi-delete
                </v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useAccountsStore } from '@/stores/accounts'
import type { Account, AccountType, ValidationErrors } from '@/types'
import { MAX_LABELS_LENGTH, MAX_LOGIN_LENGTH, MAX_PASSWORD_LENGTH, ACCOUNT_TYPES } from '@/constants'
import { useValidation } from '@/composables'

interface Props {
  account: Account
}

const props = defineProps<Props>()
const accountsStore = useAccountsStore()
const { validateLogin, validatePassword } = useValidation()

const labelsInput = ref<string[]>(
  props.account.labels.map(label => label.text),
)
const type = ref<AccountType>(props.account.type)
const login = ref<string>(props.account.login)
const password = ref<string>(props.account.password || '')
const showPasswordText = ref<boolean>(false)

const validationErrors = ref<ValidationErrors>({
  login: false,
  password: false,
})

const labelsLength = computed(() => labelsInput.value.join('; ').length)
const labelsExceeded = computed(() => labelsLength.value > MAX_LABELS_LENGTH)

const loginLength = computed(() => login.value.length)
const loginExceeded = computed(() => loginLength.value > MAX_LOGIN_LENGTH)
const passwordLength = computed(() => password.value.length)
const passwordExceeded = computed(() => passwordLength.value > MAX_PASSWORD_LENGTH)

const accountTypes = ACCOUNT_TYPES

const showPassword = computed(() => type.value === 'LOCAL')

function validateField(field: 'login' | 'password'): boolean {
  if (field === 'login') {
    const isValid = validateLogin(login.value)
    validationErrors.value.login = !isValid
    return isValid
  }

  if (field === 'password' && showPassword.value) {
    const isValid = validatePassword(password.value)
    validationErrors.value.password = !isValid
    return isValid
  }

  return true
}

function validateForm(): boolean {
  const loginValid = validateField('login')
  const passwordValid = showPassword.value ? validateField('password') : true
  const labelsValid = !labelsExceeded.value
  return loginValid && passwordValid && labelsValid
}

function handleBlur(field: 'login' | 'password') {
  validateField(field)
  if (validateForm()) {
    saveAccount()
  }
}

function handleLabelsChange() {
  labelsInput.value = labelsInput.value
    .filter(label => label && label.trim().length > 0)
    .map(label => label.trim())

  if (validateForm()) {
    saveAccount()
  }
}

function handleTypeChange() {
  if (type.value === 'LDAP') {
    password.value = ''
    validationErrors.value.password = false
  }

  if (validateForm()) {
    saveAccount()
  }
}

function saveAccount() {
  if (validateForm()) {
    const updates: Partial<Account> = {
      labels: labelsInput.value.map(text => ({ text })),
      type: type.value,
      login: login.value.trim(),
      password: showPassword.value ? password.value.trim() : null,
    }

    accountsStore.updateAccount(props.account.id, updates)
  }
}

function deleteAccount() {
  accountsStore.deleteAccount(props.account.id)
}

watch(type, () => {
  if (!showPassword.value) {
    validationErrors.value.password = false
  }
})
</script>

<style lang="scss" scoped>
@use './AccountItem.scss';
</style>
