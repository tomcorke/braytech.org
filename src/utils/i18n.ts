import { getSettings } from './localStorage';
import i18n from 'i18next';
import { reactI18nextModule } from 'react-i18next';
import backend from 'i18next-xhr-backend';

let _defaultLanguage = 'en';
let _currentLanguage: string | undefined;

export function getCurrentLanguage() {
  if (_currentLanguage) return _currentLanguage;
  const settings = getSettings()
  _currentLanguage = settings && settings.language
  return _currentLanguage || _defaultLanguage;
}

i18n
  .use(backend)
  .use(reactI18nextModule)
  .init({
    lng: getCurrentLanguage(),
    fallbackLng: _defaultLanguage,

    backend: {
      loadPath: '/static/locales/{{lng}}/{{ns}}.json',
    },

    keySeparator: false,

    interpolation: {
      escapeValue: false
    },
    react: {
      wait: true
    }
  });

export default i18n;
