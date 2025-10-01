export interface LabelTag {
  text: string
}

export type AccountType = 'LDAP' | 'LOCAL'

export interface Account {
  id: string
  labels: LabelTag[]
  type: AccountType
  login: string
  password: string | null
}

export interface AccountFormData {
  id: string
  labelsInput: string
  type: AccountType
  login: string
  password: string
}

export interface ValidationErrors {
  login: boolean
  password: boolean
}
