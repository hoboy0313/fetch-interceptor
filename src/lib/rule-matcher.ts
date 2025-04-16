import type {InterceptRule} from '@/stores/rules';

// 匹配类型枚举
export enum MatchType {
  EXACT = 'exact',
  CONTAINS = 'contains',
  REGEX = 'regex',
  WILDCARD = 'wildcard',
}

// 扩展 InterceptRule 接口
export interface ExtendedRule extends InterceptRule {
  matchType?: MatchType;
}

/**
 * 匹配规则与请求
 * @param url 请求URL
 * @param method 请求方法
 * @param rules 拦截规则列表
 * @returns 匹配的规则或null
 */
export function matchRules(url: string, method: string, rules: InterceptRule[]): InterceptRule | null {
  for (const rule of rules) {
    if (!rule.enabled)
      continue;

    // 检查 HTTP 方法是否匹配
    if (rule.methods.length > 0 && !rule.methods.includes(method as any))
      continue;

    // 匹配 URL (当前仅实现了简单的包含匹配，后续可扩展)
    const matchType = (rule as ExtendedRule).matchType || MatchType.CONTAINS;

    if (isUrlMatched(url, rule.description, matchType)) {
      return rule;
    }
  }

  return null;
}

/**
 * 根据不同的匹配类型检查URL是否匹配
 * @param url 请求URL
 * @param pattern 匹配模式
 * @param matchType 匹配类型
 * @returns 是否匹配
 */
function isUrlMatched(url: string, pattern: string, matchType: MatchType): boolean {
  switch (matchType) {
    case MatchType.EXACT: {
      return url === pattern;
    }

    case MatchType.CONTAINS: {
      return url.includes(pattern);
    }

    case MatchType.REGEX: {
      try {
        const regex = new RegExp(pattern);
        return regex.test(url);
      } catch (error) {
        console.error('Invalid regex pattern:', pattern, error);
        return false;
      }
    }

    case MatchType.WILDCARD: {
      // 将通配符模式转换为正则表达式
      const regexPattern = pattern
        .replace(/\./g, '\\.')
        .replace(/\*/g, '.*')
        .replace(/\?/g, '.');
      return new RegExp(`^${regexPattern}$`).test(url);
    }

    default: {
      return false;
    }
  }
}
