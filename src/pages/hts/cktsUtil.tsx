import { request } from 'umi';
import { queryList, saveOrUpdate, queryForm } from '@/services/hts/api';
import CONSTANTS from '@/components/DDAssist/constants';

const cktsUtil: any = {};

/**
 * HTS 模块拦截器辅助工具
 *
 * 封装在 src/requestConfig.ts 的 requestInterceptors 中使用的所有 HTS 相关逻辑：
 *   - URL 路径转换（/dict/automatic/exp/bs/queryPager → /hx/ty/crud/queryPager）
 *   - accessToken 选择（HTS → accessTokenCkts；其它 → 主应用 accessToken）
 *   - 构造完整 authHeader（自动跳过 /hx/qx/token/oauth 端点）
 *
 * body 不做任何转换（key/searchModel/headerSearchModel 均保持原样）。
 */
cktsUtil.api = {
  /**
   * 判断当前请求是否需要 HTS URL 转换
   * 条件：URL 同时包含 API_URL_HTS + /dict/automatic/exp/bs/
   */
  shouldTransform(config: any): boolean {
    const url: string = config?.url;
    if (typeof url !== 'string') return false;
    return (
      url.indexOf('http://192.168.0.134:4111/cktsgl/v1') > -1
      && url.indexOf('/dict/automatic/exp/bs/') > -1
    );
  },

  /**
   * 判断当前请求是否需要注入 HTS accessToken
   * 条件：URL 包含 API_URL_HTS（比 shouldTransform 更宽，覆盖所有 HTS 端点）
   */
  shouldInjectAccessToken(config: any): boolean {
    const url: string = config?.url;
    if (typeof url !== 'string') return false;
    return url.indexOf('http://192.168.0.134:4111/cktsgl/v1') > -1;
  },

  /**
   * URL 路径转换：仅 /dict/automatic/exp/bs/queryPager → /hx/ty/crud/queryPager
   */
  transformUrl(url: any): string {
    if (typeof url !== 'string') return url;
    return url.replace(
      '/dict/automatic/exp/bs/queryPager',
      '/hx/ty/crud/queryPager',
    );
  },

  /**
   * 对 config 整体做 HTS URL 路径转换
   * @returns 转换后的 config（不匹配则原样返回）
   */
  transformConfig(config: any): any {
    const result = this.shouldTransform(config)
      ? { ...config, url: this.transformUrl(config?.url) }
      : config;
    return this.transformBody(result);
  },

  /**
   * 请求体转换：若 URL 含 /hx/ty/crud/queryPager，则：
   *   1. 删除 data.searchModel2
   *   2. 注入 data.headerSearchModel = []
   * 其它 URL 不做处理
   * @returns 转换后的 config
   */
  transformBody(config: any): any {
    const url: string = config?.url;
    if (typeof url !== 'string' || url.indexOf('/hx/ty/crud/queryPager') === -1) {
      return config;
    }
    if (typeof config?.data !== 'object' || config.data === null) {
      return config;
    }
    // 删除 searchModel2
    const { searchModel2, ...restData } = config.data;
    return {
      ...config,
      data: {
        ...restData,
        // headerSearchModel: [],
      },
    };
  },

  /**
   * 读取 accessToken
   * HTS 请求 → accessTokenCkts
   * 其它 → 主应用 accessToken（保持原行为）
   * @returns token 字符串或 null
   */
  getAccessToken(config: any): string | null {
    return this.shouldInjectAccessToken(config)
      ? localStorage.getItem('accessTokenCkts')
      : localStorage.getItem(CONSTANTS.LOGIN.ACCESS_TOKEN);
  },

  /**
   * 构造完整 authHeader（含 accessClientId + ftype + 条件注入 accessToken）
   * - ftype: 'fa' 在 HTS 任意请求时都注入（包括 OAuth 端点本身）
   * - accessToken 仅在非 OAuth 端点注入
   * @returns 完整的 authHeader 对象
   */
  getAuthHeader(config: any): any {
    const header: any = { accessClientId: ACCESS_CLIENT_ID };
    const url = config?.url;
    if (typeof url !== 'string') return header;

    // HTS 任意请求都加 ftype: 'fa'（包括 OAuth 端点本身）
    if (url.indexOf('http://192.168.0.134:4111/cktsgl/v1') > -1) {
      header.ftype = 'fa';
    }

    // accessToken 仅在非 OAuth 端点注入
    if (url.indexOf('/hx/qx/token/oauth') === -1) {
      const token = this.getAccessToken(config);
      if (token) {
        header.accessToken = token;
      }
    }

    return header;
  },

  /**
   * 处理 HTS 请求的拦截逻辑（在原 return 之前调用）
   *
   * 在原 return 之前调用此方法，**就地修改**：
   *   - config.url：HTS URL 路径转换（/dict/automatic/exp/bs/queryPager → /hx/ty/crud/queryPager）
   *   - config.data：HTS body 转换（删 searchModel2 + 注入 headerSearchModel: []）
   *   - authHeader.ftype = 'fa'（HTS 任意请求都加，包括 OAuth 端点本身）
   *   - authHeader.accessToken：HTS 请求用 accessTokenCkts 替换主应用 token
   *
   * 非 HTS 请求：完全不动 config 和 authHeader
   *
   * @param config - umi request 配置（会被修改 url 和 data）
   * @param authHeader - 已构造的 authHeader（会被修改 ftype 和 accessToken）
   * @returns 修改后的 config（= 原 config 引用，已就地修改）
   */
  handleHtsRequest(config: any, authHeader: any): any {
    const url = config?.url;
    if (typeof url !== 'string' || url.indexOf('http://192.168.0.134:4111/cktsgl/v1') === -1) {
      return config;  // 非 HTS 请求：完全不动
    }

    // 1. URL 路径转换（仅 /dict/automatic/exp/bs/queryPager → /hx/ty/crud/queryPager）
    if (url.indexOf('/dict/automatic/exp/bs/') > -1) {
      config.url = url.replace(
        '/dict/automatic/exp/bs/queryPager',
        '/hx/ty/crud/queryPager',
      );
    }

    // 2. ftype 注入（HTS 任意请求都加，包括 OAuth 端点本身）
    authHeader.ftype = 'fa';

    // 3. accessToken 替换：HTS 任意请求都应绑 accessTokenCkts
    //    - 非 OAuth 端点：用 accessTokenCkts 覆盖主应用 token（即使 HTS token 没有也清掉主应用 token，避免误用）
    //    - OAuth 端点（获取 token 的步骤）：不带 accessToken
    if (url.indexOf('/hx/qx/token/oauth') !== -1) {
      delete authHeader.accessToken;
    } else {
      const cktsToken = localStorage.getItem('accessTokenCkts');
      if (cktsToken) {
        authHeader.accessToken = cktsToken;
      } else {
        delete authHeader.accessToken;
      }
    }

    // 4. body 转换（仅 /hx/ty/crud/queryPager：删 searchModel2 + 注入 headerSearchModel: []）
    if (url.indexOf('/hx/ty/crud/queryPager') > -1) {
      if (typeof config?.data === 'object' && config.data !== null) {
        const { searchModel2, ...restData } = config.data;
        config.data = {
          ...restData,
          headerSearchModel: [],
        };
      }
    }

    return config;
  },

  /**
   * HTS OAuth 两步登录
   * 1. 调用 OAuth 端点获取企业列表（qxQysSaas）
   * 2. 取第一个 sbqyuuid
   * 3. 再调用 OAuth 端点获取 ACCESS_TOKEN
   * 4. 写入 localStorage（accessTokenCkts + accessTokenUsernameCkts）
   *
   * 错误静默处理：失败仅 console.log，不抛异常
   *
   * @param username - 当前登录用户名
   * @returns 是否成功获取并存储 HTS token
   */
  async loginOauth(username: string): Promise<boolean> {
    try {
      const OAUTH_BASE = 'http://192.168.0.134:4111/cktsgl/v1/hx/qx/token/oauth';
      const baseParams = { clientId: '1', d1zh: 'dGVzdF9zYw==', d1mm: 'MTIzNDU2' };
      const baseHeaders = { 'Content-Type': 'application/json' };

      // 第一步：获取企业列表 qxQysSaas，取第一个 sbqyuuid
      const firstRes: any = await request(OAUTH_BASE, {
        method: 'POST',
        headers: baseHeaders,
        data: baseParams,
      });
      const firstSbqyuuid = firstRes?.body?.qxQysSaas?.[0]?.sbqyuuid;
      if (!firstSbqyuuid) {
        console.log('[oauth] 未获取到 sbqyuuid，跳过第二步');
        return false;
      }

      // 第二步：带上 sbqyuuid 获取 ACCESS_TOKEN
      const tokenRes: any = await request(OAUTH_BASE, {
        method: 'POST',
        headers: baseHeaders,
        data: { ...baseParams, sbqyuuid: firstSbqyuuid },
      });

      if (tokenRes?.body?.ACCESS_TOKEN) {
        localStorage.setItem('accessTokenUsernameCkts', username);
        localStorage.setItem('accessTokenCkts', tokenRes.body.ACCESS_TOKEN);
        window.localStorage.removeItem('jcfs');
        return true;
      }
      return false;
    } catch (oauthErr) {
      console.log('[oauth] 附加调用失败：', oauthErr);
      return false;
    }
  },

  testAAA() {

  },
}

export default cktsUtil;
