/**
 * 判断是否在开发环境中
 */
export function isDevlopment(): boolean {
  return import.meta.env.MODE === 'development';
}

/**
 * 判断是否在浏览器扩展环境中
 */
export function isExtensionEnv(): boolean {
  return (
    typeof chrome !== 'undefined'
    && typeof chrome.runtime !== 'undefined'
    && typeof chrome.runtime.id !== 'undefined'
  );
}

/**
 * 判断是否在 iframe 中
 */
export function isIframeEnv(): boolean {
  return !!window.self.frameElement;
}
