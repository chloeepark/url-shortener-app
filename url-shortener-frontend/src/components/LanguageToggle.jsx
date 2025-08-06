import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import './LanguageToggle.css';

const LanguageToggle = () => {
  const { i18n, t } = useTranslation();

  const toggleLanguage = () => {
    const newLanguage = i18n.language === 'ko' ? 'en' : 'ko';
    i18n.changeLanguage(newLanguage);
  };

  return (
    <button className="language-toggle" onClick={toggleLanguage} title={t('language')}>
      <Globe size={20} />
      <span className="language-text">
        {i18n.language === 'ko' ? 'EN' : '한국어'}
      </span>
    </button>
  );
};

export default LanguageToggle;
