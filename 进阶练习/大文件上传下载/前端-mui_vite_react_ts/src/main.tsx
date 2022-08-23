import React from 'react';
import ReactDOM from 'react-dom';
import './index.less';
import App from './App';
import { IntlProvider } from 'react-intl'; /* react-intl imports */
import { locales } from './locales/index';

const langStr = localStorage.getItem("lang") || 'zh-CN';
const lang: string = langStr.split('-')[0];

console.log('locales', 'lang', lang, 'locales[lang]', locales[lang]);
ReactDOM.render(
  <React.StrictMode>
    <IntlProvider locale={lang} messages={locales[lang]}>
      <App />
    </IntlProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
