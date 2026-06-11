import { request } from 'umi';
import { queryList, saveOrUpdate, queryForm } from '@/services/hts/api';
import myUtil from '@/components/DDAssist/util';
import CONSTANTS from '@/components/DDAssist/constants';
import { message } from 'antd';

// [表单通用业务] 小计
export async function xj(param: any) {
  return request(`${API_URL_HTS}/hx/ty/commonextbtn/xj`, { method: 'POST', data: param });
}

// [表单通用业务] 序号重排
export async function xhcp(param: any) {
  return request(`${API_URL_HTS}/hx/ty/commonextbtn/xhcp`, { method: 'POST', data: param });
}

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
   *   - config.url：HTS URL 路径转换
   *       - /dict/automatic/exp/bs/queryPager → /hx/ty/crud/queryPager
   *       - /dict/automatic/exp/bs/getCodeList → /hx/ty/code/getCode
   *   - config.data：HTS body 转换
   *       - queryPager：删 searchModel2 + 注入 headerSearchModel: []
   *       - getCodeList：data.dictCodeId = "X:Y" → { codeStoreKey: "X", codeViewKey: "Y" }
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
    if (url.indexOf('/dict/automatic/exp/bs/queryPager') > -1) {
      config.url = url.replace(
        '/dict/automatic/exp/bs/queryPager',
        '/hx/ty/crud/queryPager',
      );
    } else if (url.indexOf('/dict/automatic/exp/bs/queryForm') > -1) {
      config.url = url.replace(
        '/dict/automatic/exp/bs/queryForm',
        '/hx/ty/crud/queryForm',
      );
    } else if (url.indexOf('/dict/automatic/exp/bs/saveOrUpdate') > -1) {
      // config.url = url.replace(
      //   '/dict/automatic/exp/bs/saveOrUpdate',
      //   '/hx/ty/crud/queryForm',
      // );
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

    // 4. body 转换（仅 /dict/automatic/exp/bs/queryPager：删 searchModel2 + 注入 headerSearchModel: []）
    if (url.indexOf('/dict/automatic/exp/bs/queryPager') > -1) {
      if (typeof config?.data === 'object' && config.data !== null) {
        const { searchModel2, ...restData } = config.data;
        config.data = {
          ...restData,
          // headerSearchModel: [],
        };
        // 部分业务模块 key 需追加 _CX 后缀以路由到查询端点（与 HTS 服务端约定）
        if (
          config.data.key?.indexOf('MDT_ZXSB_SB_MDT_TSSB') > -1 ||
          config.data.key?.indexOf('MDT_ZXSB_SB_MDT_TSJH') > -1 ||
          config.data.key?.indexOf('TSZL_ZXSB_SB_HGSPTZ') > -1 ||
          config.data.key?.indexOf('TSZL_ZXSB_SB_CKSH') > -1 ||
          config.data.key?.indexOf('TSZL_ZXSB_SB_MDT_CYSM') > -1 ||
          config.data.key?.indexOf('MDT_ZXSB_SB_MDT_STZC') > -1 ||
          config.data.key?.indexOf('MDT_ZXSB_SB_MDT_YFSJ') > -1 ||
          config.data.key?.indexOf('MDT_ZXSB_SB_MDT_SYYK') > -1 ||
          config.data.key?.indexOf('MTS_ZXSB_SB_MTS_TSSB') > -1 ||
          config.data.key?.indexOf('MTS_ZXSB_SB_MTS_TSJH') > -1 ||
          config.data.key?.indexOf('MTS_ZXSB_SB_MTS_TZSB') > -1 ||
          config.data.key?.indexOf('DBTS_ZXSB_SB_DB_TSSB') > -1 ||
          config.data.key?.indexOf('QTYW_ZXSB_SB_CKXXCX') > -1 ||
          config.data.key?.indexOf('ZMKJ_ZXSB_ZM_TYYBSWTS') > -1 ||
          config.data.key?.indexOf('ZMKJ_ZXSB_ZM_DLCK') > -1 ||
          config.data.key?.indexOf('MTS_ZXSB_SB_MTS_YSFWCK') > -1 ||
          config.data.key?.indexOf('QTYW_ZXSB_TY_KJDSHWC_HSTZ') > -1 ||
          config.data.key?.indexOf('QTYW_ZXSB_TY_KJDSHWC_HSSB') > -1
        ) {
          config.data.key = config.data.key + '_CX';
        }
      }
    }

    // 5. getCodeList 端点转换
    //    URL:  /dict/automatic/exp/bs/getCodeList → /hx/ty/code/getCode
    //    body: { dictCodeId: 'X:Y' } → { codeStoreKey: 'X', codeViewKey: 'Y' }
    //         （无冒号时：codeStoreKey = 整串, codeViewKey = ''）
    if (url.indexOf('/dict/automatic/exp/bs/getCodeList') > -1) {
      config.url = config.url.replace(
        '/dict/automatic/exp/bs/getCodeList',
        '/hx/ty/code/getCode',
      );
      if (typeof config?.data === 'object' && config.data !== null) {
        const dictCodeId = config.data.dictCodeId;
        if (typeof dictCodeId === 'string') {
          const colonIdx = dictCodeId.indexOf(':');
          const { dictCodeId: _omit, ...restData } = config.data;
          config.data = {
            ...restData,
            codeStoreKey: colonIdx >= 0 ? dictCodeId.slice(0, colonIdx) : dictCodeId,
            codeViewKey: colonIdx >= 0 ? dictCodeId.slice(colonIdx + 1) : '',
          };
        }
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

cktsUtil.menu = {
  // 根据路径取当前节点菜单
  getMenuObjByPath: (path: any) => {
    if (!path) {
      return;
    }
    let targetMenuObj;
    const usermenu = myUtil.sessionStore.getItem('usermenu') || [];
    const foreachData = (menuTreeParam: any) => {
      if (!menuTreeParam || menuTreeParam.lenght === 0) {
        return;
      }
      for (let i = 0; i < menuTreeParam.length; i++) {
        if (menuTreeParam[i].path == path) {
          targetMenuObj = menuTreeParam[i];
          break;
        } else {
          if (menuTreeParam[i].routes && menuTreeParam[i].routes.length > 0) {
            foreachData(menuTreeParam[i].routes);
          }
        }
      }
    }
    foreachData(usermenu);
    return targetMenuObj;
  },
}

// 原在线申报系统模块：小计
cktsUtil.cktsCommonSum = (param: any) => {
  const { refCktsSum, unit_key, unit_lcswsx_dm, gridData, gridParams, setMasker,selectionRowKeys } = param;
    if (gridData.length === 0) {
      // message.info(intl2.formatMessage({ id: 'message_no_data_common_sum' }));
      message.info('message_no_data_common_sum');
      return;
    }
    setMasker(true);
    const obj = [...gridParams?.searchModel];
    if(selectionRowKeys && selectionRowKeys.length>0){
      obj.push({"type": 1,"property": "uuid","values": selectionRowKeys,"op": "ain"});
    }
    const paramTmp = {
      lcswsxDm: unit_lcswsx_dm,
      ywCxBz: 'XJ_' + unit_key,
      adQuery: obj,
    }

    xj(paramTmp).then((response) => {
      const { code, body } = response;
      setMasker(false);
      if (code === '200') {
        refCktsSum.current!.showModal({
          gridData: body.rows
        });
      } else {
        message.info('获取数据失败');
      }
    })
}

// 原在线申报系统模块：序号重排
cktsUtil.cktsCommonXhcp = (param: any) => {
  const { refCktsXhcp, unit_key, unit_lcswsx_dm, unitRef, ssq, sbpc, gridData = [] } = param;
  const cktsOrder = param?.ckts_order ?? 0;
  if (!cktsOrder || cktsOrder <= 0) return;
  // 从 gridData 首行提取 ssq/sbpc 默认值（与 code_sample 范式一致）
  // 业务模块入参 ssq/sbpc 优先（如果有），否则取 gridData[0]
  const defaultSsq = ssq ?? gridData[0]?.ssq ?? '';
  const defaultSbpc = sbpc ?? gridData[0]?.sbpc ?? '';
  refCktsXhcp.current?.showModal?.({
    type: cktsOrder,
    lcswsxDm: unit_lcswsx_dm,
    ssq: defaultSsq,
    sbpc: defaultSbpc,
    ywCxBz: 'XHCP_' + unit_key,
    unitRef,
  });
};

// 获取流转税务事项代码
cktsUtil.getLcswsxDm = (unit_constant: any) => {
  let arr = unit_constant?.split(',') || [];
  for (let i = 0; i < arr.length; i++) {
    let tmp = arr[i].split('=');
    if (tmp[0] === 'lcswsxDm') {
      return tmp[1] || '';
    }
  }
  return '';
}

export default cktsUtil;
