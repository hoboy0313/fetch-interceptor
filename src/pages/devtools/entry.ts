// 创建面板
chrome.devtools.panels.create(
  'Fetch Interceptor',
  '',
  'src/pages/devtools/index.html',
  () => console.info('🏅 面板创建成功'),
);
