chrome.runtime.onInstalled.addListener(() => {
  console.info('🔧 【Fetch Interceptor】plugin was be installed, the background.js would be activated.');
});

chrome.webRequest.onBeforeRequest.addListener(
  details => {
    console.info('onBeforeRequest', details);
    return {cancel: true};
  },
  {urls: ['<all_urls>']},
  ['blocking'],
);

// 响应头修改处理
chrome.webRequest.onHeadersReceived.addListener(
  details => {
    console.info('onHeadersReceived', details);
    return {responseHeaders: details.responseHeaders};
  },
  {urls: ['<all_urls>']},
);
