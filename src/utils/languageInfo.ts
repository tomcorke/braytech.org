const LANGUAGE_NAMES: {
  [code: string]: string | undefined
} = {
  de: 'Deutsch',
  en: 'English',
  es: 'Español',
  'es-mx': 'Español mexicano',
  fr: 'Français',
  it: 'Italiano',
  ja: '日本語',
  ko: '한국어',
  pl: 'Polski',
  'pt-br': 'Português Brasileiro',
  ru: 'Русский',
  'zh-cht': '中文',
  'zh-chs': '简化字'
}

export function getLanguageInfo(code: string) {
  return {
    name: LANGUAGE_NAMES[code],
    code
  }
}
