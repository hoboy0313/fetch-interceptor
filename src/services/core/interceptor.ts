import type {InterceptRule} from '@/stores/rules';

class RequestInterceptor {
  private rules: InterceptRule[] = [];

  updateRules(rules: InterceptRule[]) {
    this.rules = rules;
  }

  shouldInterceptRequest(details: chrome.webRequest.WebRequestDetails): boolean {
    const url = details.url;
    const method = details.method;

    return this.rules.some(rule => {
      if (!rule.enabled)
        return false;

      // 检查 URL 匹配
      const urlMatch = this.matchUrl(url, rule.description);
      if (!urlMatch)
        return false;

      // 检查请求方法匹配
      return rule.methods.includes(method as any);
    });
  }

  private matchUrl(requestUrl: string, pattern: string): boolean {
    try {
      const regex = this.convertUrlPatternToRegex(pattern);
      return regex.test(requestUrl);
    } catch (error) {
      console.error('URL pattern matching error:', error);
      return false;
    }
  }

  private convertUrlPatternToRegex(pattern: string): RegExp {
    // 转换 URL 模式为正则表达式
    const escaped = pattern
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // 转义特殊字符
      .replace(/\\\*/g, '.*'); // 将 * 转换为 .*

    return new RegExp(`^${escaped}$`);
  }
}

export const interceptor = new RequestInterceptor();
