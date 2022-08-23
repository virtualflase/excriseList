import zh_CN from './zh_CN';
import en_US from './en_US';
import { createIntl, createIntlCache } from 'react-intl';

const locales: any = {
  en: en_US,
  zh: zh_CN,
};

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'zh',
    messages: zh_CN,
  },
  cache
);

export { locales, intl };
