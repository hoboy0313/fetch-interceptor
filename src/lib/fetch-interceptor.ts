import {matchRules} from './rule-matcher';

import type {InterceptRule} from '@/stores/rules';

// 保存原始的 fetch 函数
const originalFetch = window.fetch;

export function setupFetchInterceptor(getRules: () => InterceptRule[]) {
  // 替换原生的 fetch
  window.fetch = function (input: RequestInfo | URL, init?: RequestInit) {
    // 获取请求信息
    const request = new Request(input, init);
    const url = request.url;
    const method = request.method || 'GET';

    // 检查是否匹配任何规则
    const rules = getRules();
    const matchedRule = matchRules(url, method, rules);

    if (matchedRule) {
      console.info(`[Fetch Interceptor] 拦截请求: ${method} ${url}`);

      // 获取模拟响应
      const mockResponse = matchedRule.response;

      // 创建响应头
      const headers = new Headers();
      Object.entries(mockResponse.headers).forEach(([key, value]) => {
        headers.append(key, value);
      });

      // 构建 Response 对象
      return Promise.resolve(
        new Response(mockResponse.body, {
          status: mockResponse.status,
          statusText: mockResponse.statusText,
          headers,
        }),
      );
    }

    // 如果没有匹配的规则，使用原始的 fetch
    return originalFetch(input, init);
  };
}

// 恢复原始的 fetch
export function restoreFetch() {
  window.fetch = originalFetch;
}
