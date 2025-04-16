import React from 'react';
import ReactDOM from 'react-dom/client';

import * as env from '@/lib/env';

import '@/styles/globals.css';
import './index.scss';

import App from './App';

const isDev = env.isDevlopment();
const isExtension = env.isExtensionEnv();
const isIframe = env.isIframeEnv();

if (isDev && isExtension && !isIframe) {
  // it's a way with hmr in dev mode.
  const iframe = document.createElement('iframe');
  iframe.id = 'devtools-iframe';
  // port 要从vite配置中获取
  const port = import.meta.env.VITE_APP_DEVTOOLS_PORT;
  iframe.src = `http://localhost:${port}/src/pages/devtools/index.html`;
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  document.body.appendChild(iframe);
  console.info('render iframe');
} else {
  console.info('render app');
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
