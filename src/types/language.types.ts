export interface Language {
  id: string
  code: string
  name: string
  native_name: string
  flag_icon?: string
  direction: 'ltr' | 'rtl'
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface LanguageOption {
  code: string
  name: string
  nativeName: string
  flagIcon: string  // URL to flag image in storage
  direction: 'ltr' | 'rtl'
}