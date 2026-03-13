import { useI18n } from '../i18n';

export function LanguageSwitch() {
  const { lang, setLang } = useI18n();

  return (
    <button
      className="lang-switch"
      onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
    >
      {lang === 'zh' ? 'EN' : '中'}
    </button>
  );
}
