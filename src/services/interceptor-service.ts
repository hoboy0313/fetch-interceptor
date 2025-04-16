import {restoreFetch, setupFetchInterceptor} from '@/lib/fetch-interceptor';
import {restoreXHR, setupXHRInterceptor} from '@/lib/xhr-interceptor';
import {useRulesStore} from '@/stores/rules';

/**
 * 拦截器服务
 * 管理所有的请求拦截功能
 */
export class InterceptorService {
  private static instance: InterceptorService;
  private isInitialized = false;

  private constructor() {
    // 私有构造函数，防止外部实例化
  }

  /**
   * 获取单例实例
   */
  public static getInstance(): InterceptorService {
    if (!InterceptorService.instance) {
      InterceptorService.instance = new InterceptorService();
    }
    return InterceptorService.instance;
  }

  /**
   * 初始化拦截器
   */
  public initialize(): void {
    if (this.isInitialized) {
      console.info('[Interceptor Service] 拦截器已经初始化，跳过');
      return;
    }

    // 获取规则的函数
    const getRules = () => useRulesStore.getState().rules;

    // 设置 XMLHttpRequest 拦截器
    setupXHRInterceptor(getRules);

    // 设置 Fetch 拦截器
    setupFetchInterceptor(getRules);

    this.isInitialized = true;
    console.info('[Interceptor Service] 拦截器初始化完成');
  }

  /**
   * 清理拦截器
   */
  public cleanup(): void {
    if (!this.isInitialized) {
      console.info('[Interceptor Service] 拦截器未初始化，跳过清理');
      return;
    }

    // 恢复原始的 XMLHttpRequest
    restoreXHR();

    // 恢复原始的 fetch
    restoreFetch();

    this.isInitialized = false;
    console.info('[Interceptor Service] 拦截器已清理');
  }

  /**
   * 重新初始化拦截器
   */
  public reinitialize(): void {
    this.cleanup();
    this.initialize();
    console.info('[Interceptor Service] 拦截器已重新初始化');
  }
}
