export function isExtensionEnv(): boolean {
  return (
    typeof chrome !== 'undefined'
    && typeof chrome.runtime !== 'undefined'
    && typeof chrome.runtime.id !== 'undefined'
  );
}
