import { useState, useEffect } from 'react';
import { translations } from '../i18n/translations';
import type { Language, TranslationKey } from '../i18n/translations';

export const useTranslation = () => {
    const [language, setLanguage] = useState<Language>('en');

    useEffect(() => {
        const browserLang = navigator.language.split('-')[0];
        setLanguage(browserLang === 'ja' ? 'ja' : 'en');
    }, []);

    const t = (key: TranslationKey) => {
        return translations[language][key] || translations['en'][key];
    };

    return { t, language };
};
