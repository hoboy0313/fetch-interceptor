import {matchRules} from './rule-matcher';

import type {InterceptRule} from '@/stores/rules';

// 保存原始的 XMLHttpRequest
const OriginalXMLHttpRequest = window.XMLHttpRequest;

export function setupXHRInterceptor(getRules: () => InterceptRule[]) {
  // 替换原生的 XMLHttpRequest
  window.XMLHttpRequest = function () {
    const xhr = new OriginalXMLHttpRequest();
    const originalOpen = xhr.open;
    const originalSend = xhr.send;

    let method = '';
    let url = '';

    // 重写 open 方法
    xhr.open = function (...args: any[]) {
      method = args[0];
      url = args[1];
      return originalOpen.apply(xhr, args as any);
    };

    // 重写 send 方法
    xhr.send = function (...args: any[]) {
      const rules = getRules();
      const matchedRule = matchRules(url, method, rules);

      if (matchedRule) {
        console.info(`[XHR Interceptor] 拦截请求: ${method} ${url}`);

        // 获取模拟响应
        const mockResponse = matchedRule.response;

        // 设置状态和头信息
        Object.defineProperty(xhr, 'status', {value: mockResponse.status});
        Object.defineProperty(xhr, 'statusText', {value: mockResponse.statusText});
        Object.defineProperty(xhr, 'responseText', {value: mockResponse.body});

        // 设置响应头
        const _getAllResponseHeaders = xhr.getAllResponseHeaders;
        xhr.getAllResponseHeaders = function () {
          return Object.entries(mockResponse.headers)
            .map(([key, value]) => `${key}: ${value}`)
            .join('\r\n');
        };

        const _getResponseHeader = xhr.getResponseHeader;
        xhr.getResponseHeader = function (name: string) {
          return mockResponse.headers[name] || null;
        };

        // 触发事件
        setTimeout(() => {
          const loadEvent = new Event('load');
          xhr.dispatchEvent(loadEvent);

          const readyStateChangeEvent = new Event('readystatechange');
          Object.defineProperty(xhr, 'readyState', {value: 4});
          xhr.dispatchEvent(readyStateChangeEvent);
        }, 0);

        return xhr;
      }

      // 如果没有匹配的规则，使用原始的方法
      return originalSend.apply(xhr, args as any);
    };

    return xhr;
  } as any;

  // 保持原型链一致
  window.XMLHttpRequest.prototype = OriginalXMLHttpRequest.prototype;
}

// 恢复原始的 XMLHttpRequest
export function restoreXHR() {
  window.XMLHttpRequest = OriginalXMLHttpRequest;
}
