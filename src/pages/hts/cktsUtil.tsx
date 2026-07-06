import { request, history } from 'umi';
import myUtil from '@/components/DDAssist/util';
import CONSTANTS from '@/components/DDAssist/constants';
import { message } from 'antd';
import { xj, getOneTimeToken, downloadGet, downloadUrlPost, downloadUrlList, sfczdlzfp, fetchMenuData } from '@/pages/hts/services/htsApi';
import { ICON_MAPPING } from '@/components/DDAssist/util/appIcons';

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
      url.indexOf(API_URL_HTS) > -1
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
    return url.indexOf(API_URL_HTS) > -1;
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
      : localStorage.getItem(CONSTANTS.LOGIN.ACCESS_TOKEN_KEY);
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
    if (url.indexOf(API_URL_HTS) > -1) {
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
    if (typeof url !== 'string' || url.indexOf(API_URL_HTS) === -1) {
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
      config.url = url.replace(
        '/dict/automatic/exp/bs/saveOrUpdate',
        '/hx/ty/crud/saveOrUpdate',
      );
    } else if (url.indexOf('/dict/automatic/exp/bs/delete') > -1) {
      config.url = url.replace(
        '/dict/automatic/exp/bs/delete',
        '/hx/ty/crud/delete',
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
        } else if (config?.data?.key === 'WBSJ_CKBGD_QUERY_PAGE') {
          config.data = {
            ...config.data,
            searchModel: config.data.searchModel.map((item: any) =>
              item?.property === 'ssbz1' ? { ...item, op: 'zdy' } : item,
            ),
          };
        } else if (config?.data?.key === 'JLJG_ZXSB_SB_JLJG_ZNFX_GETSZCMX')  {
          config.data = {
            ...config.data,
            searchModel: config.data.searchModel.map((item: any) =>
              item?.property === 'hxztDm' ? { ...item, op: 'al' } : item,
            ),
          };
        } else if (config?.data?.key === 'CX_SJFX_SC_CKQK_FYHZ') {
          // 出口退税分析模块 - 将 searchModel 中每项：
          //   1. op 统一改为 'zdy'（自定义区间）
          //   2. value 由时间戳（毫秒）格式转换为 yyyyMM 字符串
          // config.data = {
          //   ...config.data,
          //   // searchModel: config.data.searchModel.map((item: any) => {
          //   //   // 时间戳（毫秒）→ yyyyMM 字符串；非数值类型原样保留
          //   //   const value = item?.value;
          //   //   const newValue = typeof value === 'number'
          //   //     ? dayjs(value).format('YYYYMM')
          //   //     : value;
          //   //   return {
          //   //     ...item,
          //   //     op: 'zdy',
          //   //     value: newValue,
          //   //   };
          //   // }),
          //   searchModel:[
          //   {property: "ckny", value: "202507", op: "zdy"}, 
          //   {property: "ckny1", value: "202606", op: "zdy"}, 
          //   {property: "cknyqq", value: "202506", op: "zdy"}, 
          //   {property: "cknyqq1", value: "202605", op: "zdy"}, 
          //   {property: "cknysntq", value: "202407", op: "zdy"}, 
          //   {property: "cknysntq1", value: "202506", op: "zdy"}, 
          //   ]
          // };

          // type:5,"property":"ckny","value":"202507","op":"zdy"}
          // type:5,"property":"ckny","value":"202606","op":"zdy"}
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
      const OAUTH_BASE = `${API_URL_HTS}/hx/qx/token/oauth`;
      const baseParams = { clientId: '1', d1zh: 'dGVzdF9zYw==', d1mm: 'MTIzNDU2' };
      // const baseParams = { clientId: '1', d1zh: 'dGVzdF9rcA==', d1mm: 'MTIzNDU2' };
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

        // 第三步：getLoginUserInfo
        const LoginUserInfo: any = await request(`${API_URL_HTS}/hx/qx/token/getLoginUserInfo`, {
          method: 'POST',
          headers: baseHeaders,
          data: {},
        });
        myUtil.sessionStore.setItem('userInfo', LoginUserInfo?.body || {});

        // 第四步：重新获得菜单
        let body: any = [];
        const res: any = await request(`${API_URL_HTS}/dditSaas/dldj/getMenuJsonByToken`, {
          method: 'POST',
          headers: baseHeaders,
          data: {},
        });
        body = res?.body;
        // 获取树结构数据每个routes第一行的path
        function firstPath (data: any): any {
          let redirectPath;
          if (data[0].routes && data[0].routes.length > 0) {
            redirectPath = firstPath(data[0].routes);
          } else {
            redirectPath = data[0].path
          }
          return redirectPath;
        }
        // 递归树结构
        function treeData (data: any) {
          data.forEach((item: any) => {
            if (item.routes && item.routes.length > 0) {
              treeData(item.routes);
              if (!item.hideInMenu) { // 拼接redirect
                const redirectPath = firstPath(item.routes);
                item.routes.push({ path: item.path, redirect: redirectPath })
              }
            }
          });
        }
        treeData(body);
        myUtil.sessionStore.setItem('usermenu', body);
        
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
  treeDataHts: (data: any) => {
    data.forEach((item: any) => {
      if (item.icon) {
        item.icon = ICON_MAPPING[item.icon];
      }
      if (item.parentKeys) {
        item.parentKeys = [item.parentKeys];
      }
      if (item.routes?.length > 0) {
        cktsUtil.menu.treeDataHts(item.routes);
      }
    });
  },
  // 获取慧退税菜单
  getHtsMenu: async () => {
    const resHts = await fetchMenuData({});
    let resMenu = []
    if (resHts.code === '200' && resHts?.body) {
      resMenu = (resHts.body || []).filter((tmp: any) => (tmp.id === 'A01' || tmp.id === 'A99')) || [];
      if (resMenu?.length > 0) {
        resMenu = resMenu[0].routes || [];
        cktsUtil.menu.treeDataHts(resMenu);
        myUtil.sessionStore.setItem('usermenu', resMenu);
      }
    }
    return resMenu;
  }
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

// 系统及权限
cktsUtil.sys = {
  // 从用户全量信息中获取用户企业类型
  // SC 生产  WM 外贸  QT 其他
  enterpriseType: function () {
    const userInfo = myUtil.sessionStore.getItem('userInfo');
    let type = userInfo?.qxQys[0]?.cktsqylxDm;
    return type;
  },
  // 关票通、单一窗口
  bgdsjlyType: function () {
    const userInfo = myUtil.sessionStore.getItem('userInfo');
    let type = userInfo?.qxQys[0]?.bgdsjlyDm;
    return type;
  }
}

// 原\src\pages\common\cjpzUtil.tsx
//表单采集
cktsUtil.bdcj = {

  formatExkey(export_key3: any, export_key2: any, export_key1: any, export_key: any, unit_key: any) {
    debugger;
    const routePathname = history?.location?.pathname;
    if (routePathname.indexOf('SBMXCX') > -1 || routePathname.indexOf('/27/2705') > -1
      || routePathname.indexOf('/26/2605') > -1 || routePathname.indexOf('/25/2505') > -1) {
      //申报明细查询
      if (export_key3) {
        return export_key3;
      }
    } else if (routePathname.indexOf('CXTJ_') > -1) {
      //统计
      if (export_key2) {
        return export_key2;
      }
    } else {
      //采集
      if (export_key1) {
        return export_key1;
      }
    }
    return export_key || unit_key + '_EXCEL';
  },



  //切分unit_util
  formatConfig(config: any, key: any) {
    if (config.export_key1 || config.export_key2 || config.export_key3) {
      // 配置项：工具栏
      config.toolbar_default = {
        add: false, // 是否显示增加按钮，默认关闭
        edit: false, // 是否显示修改按钮，默认关闭
        delete: false, // 是否显示删除按钮，默认关闭
        setting: true, // 是否显示设置按钮，默认关闭
        reload: true, // 是否显示刷新按钮，默认关闭
        full: true, // 是否显示全屏按钮，默认关闭
        ckts_download: false, // 是否显示导出按钮，默认关闭
        upload: false,  // 是否显示导入按钮，默认关闭
        ckts_sum: false, // 是否显示小计按钮，默认关闭
        tssb_download: true,
      };
    }
    return {
      config
    }
  },




  // 将原格式改变为新格式
  formatApiParam(url: string, options: any) {
    if (url?.indexOf('v1/hx/ty/crud/queryPager') > -1) {
      if (options?.data.key?.indexOf('MDT_ZXSB_SB_MDT_TSSB') > -1 ||
        options?.data.key?.indexOf('MDT_ZXSB_SB_MDT_TSJH') > -1 ||
        options?.data.key?.indexOf('TSZL_ZXSB_SB_HGSPTZ') > -1 ||
        options?.data.key?.indexOf('TSZL_ZXSB_SB_CKSH') > -1 ||
        options?.data.key?.indexOf('TSZL_ZXSB_SB_MDT_CYSM') > -1 ||
        options?.data.key?.indexOf('MDT_ZXSB_SB_MDT_STZC') > -1 ||
        options?.data.key?.indexOf('MDT_ZXSB_SB_MDT_YFSJ') > -1 ||
        options?.data.key?.indexOf('MDT_ZXSB_SB_MDT_SYYK') > -1 ||
        options?.data.key?.indexOf('MTS_ZXSB_SB_MTS_TSSB') > -1 ||
        options?.data.key?.indexOf('MTS_ZXSB_SB_MTS_TSJH') > -1 ||
        options?.data.key?.indexOf('MTS_ZXSB_SB_MTS_TZSB') > -1 ||
        options?.data.key?.indexOf('DBTS_ZXSB_SB_DB_TSSB') > -1 ||
        options?.data.key?.indexOf('QTYW_ZXSB_SB_CKXXCX') > -1 ||
        options?.data.key?.indexOf('ZMKJ_ZXSB_ZM_TYYBSWTS') > -1 ||
        options?.data.key?.indexOf('ZMKJ_ZXSB_ZM_DLCK') > -1 || 
        options?.data.key?.indexOf('MTS_ZXSB_SB_MTS_YSFWCK') > -1 ||
        options?.data.key?.indexOf('QTYW_ZXSB_TY_KJDSHWC_HSTZ') > -1 ||
        options?.data.key?.indexOf('QTYW_ZXSB_TY_KJDSHWC_HSSB') > -1 ) {
        options.data.key = options?.data.key + '_CX';
      }
    }
    return {
      options,
      url
    }
  },

}


/**
 * @desc 判断当前模块属于哪个业务
 * @param key 申报业务Key
 * @param type 校验类型
 *        SJZJ: 判断是否有数据自检功能
 *        SQRQ: 判断是否显示申请日期【若返回true，屏蔽所属期和申报批次】
 *        SBPC: 判断是否显示申报批次
 *        BBDY: 判断是否有报表打印功能
 * @param arr [可选] 模块集合
 * @returns 返回布尔值 true包含，false 不包含
 */
cktsUtil.moduleType = (key: any = '', type: any) => {
  /** 无数据自检流程的业务key前缀
   * 【所有备案业务；证明内:中标证明、补办证明、作废退（免）税有关证明;//20200713委托出口证明ZMKJ_WTCK增加自检
   * 其他业务中：信息查询、非需提供收汇资料、外贸管理类别评定、生产管理类别评定，管理类别复评，企业撤回申报、进货凭证信息回退
   * 进料加工所有业务（：计划分配率备案、计划分配率变更）JLJG_JHFP（BA/BG） 20210407 计划分配率核销增加数据自检】
   * 待确认业务：企业撤回申报
   * */
  const noSjzjArr = ['ZGBA_', 'ZMKJ_BBCKTSZM', 'QTYW_CKXXCX', 'QTYW_BNSHSB', 'QTYW_WMYLQYPD', 'QTYW_CKXXCX', 'QTYW_FLGLFP', 'JLJG_JHFP', 'QTYW_QYCHSB', 'ZMKJ_CKZMZFQD', 'QTYW_SCYLQYPD', 'QTYW_JHPZXXHT'];
  /**
   * 需将所属期、申报批次替换为申请日期的业务key前缀
   */
  const sqrqArr = ['ZGBA_BA', 'ZGBA_BABG', 'ZGBA_BACH', 'ZGBA_JTGSBA', 'ZGBA_CKTSYWTX', 'ZGBA_WMZHFWDBTS', 'ZGBA_SCQYWTDBTS', 'ZGBA_XTHHSQ', 'ZGBA_FQMSQSM', 'ZGBA_FQLSLSM', 'ZGBA_FQTMSSM', 'ZGBA_HFTMSZC', 'ZGBA_ZXSB'];
  /**
   * 需屏蔽申报批次的业务key前缀
   * 免抵退业务，进料加工业务
   */
  const noSbpcArr = ['MDT', 'JLJG_', 'QTYW_SCYLQYPD', 'QTYW_WMYLQYPD', 'QTYW_FLGLFP', 'ZGBA_BMDLCKBA', 'ZBYW_FZCSB', 'ZBYW_GJSB', 'ZBYW_YSSB', 'ZBYW_HTSB', 'TSZL_ZXSB_SB_HGSPTZ_F', 'TSZL_ZXSB_SB_CKSH_F', 'TSZL_ZXSB_SB_BNSH_F', 'ZBYW_ZXSB_SB_GJ_SBMX_F', 'ZBYW_ZXSB_SB_HT_SBMX_F', 'ZBYW_ZXSB_SB_YS_SBMX_F', 'ZBYW_ZXSB_SB_FZC_SBMX_F', 'QTYW_ZXSB_QT_QYGLLBFPPD_F', 'QTYW_ZXSB_QT_QYNBFKTXJS_F', 'ZMKJ_ZXSB_ZM_CKJYMSHXSB_F'];
  /**
   * 生产企业需屏蔽申报批次的业务key前缀
   * 所有其他业务
   */
  const scqyNoSbpcArr = ['QTYW_'];
  /**
   * 没有报表打印功能的业务key前缀
   * 分类管理复评（暂无表样），备案撤回（暂无表样）
   */
  const noBbdyArr: any[] = [];
  /**
   * 导出ZIP格式的
   */
  const excelZipExportPostArr = ['ZGBA_FQTMSSM', 'QTYW_SCYLQYPD','QTYW_WMYLQYPD', 'JLJG_MDTHX', 'ZGBA_BACH', 'ZBYW_FZCSB', 'ZBYW_YSSB', 'MDT', 'DBTS', 'MTS', 'ZMKJ_ZBZM'];
  // 判断是否有数据自检功能
  if (type === 'SJZJ') {
    // 循环noSjzjArr，检查key中是否包含noSjzjArr[i]值，若包含return false，for循环结束return true
    for (let i = 0; i < noSjzjArr.length; i += 1) {
      if (key.indexOf(noSjzjArr[i]) !== -1) { // 不等于-1 是包含
        return false;
      }
    }
    return true;
  }
  // 判断是否显示申请日期
  if (type === 'SQRQ') {
    // 循环sqrqArr，检查key中是否包含sqrqArr[i]值，若包含return true，for循环结束return false
    for (let j = 0; j < sqrqArr.length; j += 1) {
      if (key?.indexOf(sqrqArr[j]) !== -1) { // 不等于-1 key中包含sqrqArr[j]的值
        return true;
      }
    }
    return false;
  }
  // 判断是否显示申报批次
  if (type === 'SBPC') {
    // 进货凭证信息回退申请，企业撤回申报，业务特殊暂时写死
    // 进料加工核销 增加申报批次
    if (key === 'QTYW_JHPZXXHT' || key === 'QTYW_QYCHSB' || key === 'QTYW_CKXXCX' || key === 'JLJG_MDTHX' || key === 'QTYW_HWCHS') {
      return true;
    }
    // 1、循环noSbpcArr，检查key中是否包含noSbpcArr[i]值，若包含return false
    for (let k = 0; k < noSbpcArr.length; k += 1) {
      if (key.indexOf(noSbpcArr[k]) !== -1) { // ！== -1 包含
        return false;
      }
    }
    // 获取企业类型(WM:外贸，SC:生产，QT:其他)
    const qylx = cktsUtil.sys.enterpriseType();
    // 2、取企业类型，若不为SC，ruturn ture；否则走下面代码
    if (qylx !== 'SC') {
      return true;
    }
    // 3、循环scqyNoSbpcArr，检查key中是否包含scqyNoSbpcArr[i]值，若包含return false，for循环结束return true
    for (let m = 0; m < scqyNoSbpcArr.length; m += 1) {
      if (key.indexOf(scqyNoSbpcArr[m]) !== -1) { // 包含
        return false;
      }
    }
    return true;
  }
  // 判断是否显示“报表打印”按钮
  if (type === 'BBDY') {
    // 1、循环noBbdyArr，检查key中是否包含noBbdyArr[i]值，若包含return false,否则返回 true；
    for (let n = 0; n < noBbdyArr.length; n += 1) {
      if (key.indexOf(noBbdyArr[n]) !== -1) { // 包含
        return false;
      }
    }
    return true;
  }
  // 判断是否显示显示出zip格式
  if (type === 'ZIP') {
    for (let n = 0; n < excelZipExportPostArr.length; n += 1) {
      // 由包含改为直等关系，否则会出现ZGBA_SCQYWTDBTS和DBTS冲突的情况 by jiangyg 20200603
      if (key === excelZipExportPostArr[n]) { // 包含
        return true;
      }
    }
    return false;
  }
  // 单一窗口 数据自检按钮  证明申报、购进、核销 隐藏
  if (type === 'dyck_sjzj') {
    if(key.indexOf('ZMKJ_') > -1 || key.indexOf('ZBYW_') > -1 ||key.indexOf('JLJG_') > -1) {
      return true;
    }
    return false;
  }
  // 单一窗口 证明申请(正式申报)按钮 证明申报、购进 隐藏证明申请按钮,  其他业务、资格备案隐藏正式申报按钮
  if(type === 'dyck_zmsq') {
    if(key.indexOf('ZMKJ_') > -1 || key.indexOf('ZBYW_') > -1 || key.indexOf('QTYW_') > -1 || key.indexOf('ZGBA_') > -1) {
      return true;
    }
    return false;
  }

  // 单一窗口 刷新按钮  证明申报、其他业务、资格备案、购进、核销 隐藏,
  if(type === 'dyck_sx') {
    if(key.indexOf('ZMKJ_') > -1 || key.indexOf('QTYW_') > -1 || key.indexOf('ZGBA_') > -1 || key.indexOf('ZBYW_') > -1 || key.indexOf('JLJG_') > -1) {
      return true;
    }
    return false;
  }

  // 单一窗口 下载申报文件按钮  证明申报、其他业务、资格备案、购进、核销 显示,
  if(type === 'dyck_xzsbwj') {
    if(key.indexOf('ZMKJ_') > -1 || key.indexOf('QTYW_') > -1 || key.indexOf('ZGBA_') > -1 || key.indexOf('ZBYW_') > -1 || key.indexOf('JLJG_') > -1) {
      return true;
    }
    return false;
  }

  // 单一窗口 反馈读入按钮  证明申报、其他业务、资格备案、购进、核销 显示,
  if(type === 'dyck_fkdr') {
    if(key.indexOf('ZMKJ_') > -1 || key.indexOf('QTYW_') > -1 || key.indexOf('ZGBA_') > -1 || key.indexOf('ZBYW_') > -1 || key.indexOf('JLJG_') > -1) {
      //补办证明、一类企业评定(SBMXCX_0801010301)、分类管理复评(/SBMXCX_0801020201)、企业撤回(SBMXCX_08040201生产、SBMXCX_08050201外贸)、备案变更(SBMXCX_0701010201)、边贸代码，这结果业务没有反馈，反馈读入按钮屏蔽掉
       if(history.location.pathname.indexOf('/SBMXCX_0801010201')>-1 ||
          history.location.pathname.indexOf('/SBMXCX_0801020201')>-1 ||
          history.location.pathname.indexOf('/SBMXCX_05090201')>-1 ||
          history.location.pathname.indexOf('/SBMXCX_08040201')>-1 ||
          history.location.pathname.indexOf('/SBMXCX_0701010201')>-1 ||
          history.location.pathname.indexOf('/SBMXCX_07050201')>-1 ||
          history.location.pathname.indexOf('/SBMXCX_0801010301')>-1 ||
          history.location.pathname.indexOf('/SBMXCX_08050201')>-1 ||
          history.location.pathname.indexOf('/SBMXCX_08060201')>-1
       ){
        return false;
      }
      return true;
    }
    return false;
  }



}

// pdf预览，支持单个或多个PDF
cktsUtil.popupPdfFile = (urlOrList: any, params?: any) => {
  const openSingle = (url: string, ps: any) => {
    getOneTimeToken({}).then((response1) => {
      if (response1.code === '200') {
        return downloadGet(ps, url, response1.body);
      }
      message.error(response1.desc);
      throw new Error(response1.desc);
    }).then((response2) => {
      const blob = new Blob([response2.data], { type: 'application/pdf' });
      const { headers } = response2.response;
      const contentDisposition = headers.get('Content-Disposition');
      let fileName = contentDisposition ? contentDisposition.split('filename=')[1] : 'downloadFile';
      fileName = decodeURI(fileName);
      const src = cktsUtil.getPdfLj();
      window.open(`${src}?file=${URL.createObjectURL(blob)}&name=${fileName}`);
    })
  };

  const openMulti = (items: any[]) => {
    const key = `pdf_multi_${Date.now()}_${Math.random()}`;
    const list = items.map((it: any) => {
      const u = it?.url || it?.wjlj || it;
      const ps = { ...(it?.params || it?.config || params) };
      const wjlj = it.wjlj;
      ps.wjlj = wjlj
      let fileName = it?.name || it?.wjm || 'downloadFile';
      fileName = decodeURI(fileName);
      return { url: u, params: ps, name: fileName };
    });
    try {
      sessionStorage.setItem(key, JSON.stringify(list));
    } catch (e) {
      message.error('PDF列表数据存储失败');
      return;
    }
    const src = cktsUtil.getStaticLink('/pdfjs/web/multi.html');
    const child = window.open(`${src}?key=${encodeURIComponent(key)}`);
    const handler = (ev: any) => {
      const data = ev?.data || {};
      if (!data || data.type !== 'pdf_multi_request') return;
      if (data.key !== key) return;
      const idx = Number(data.index);
      const it = list[idx];
      if (!it) return;
      getOneTimeToken({}).then((response1) => {
        if (response1.code === '200') {
          return downloadGet(it.params, it.url, response1.body);
        }
        message.error(response1.desc);
        throw new Error(response1.desc);
      }).then((response2) => {
        const blob = new Blob([response2.data], { type: 'application/pdf' });
        const objectUrl = URL.createObjectURL(blob);
        const { headers } = response2.response;
        const contentDisposition = headers.get('Content-Disposition');
        let fileName = it?.name || (contentDisposition ? decodeURI(contentDisposition.split('filename=')[1]) : 'downloadFile');
        const target = ev.source || child;
        if (target) {
          target.postMessage({ type: 'pdf_multi_response', key, index: idx, file: objectUrl, name: fileName }, '*');
        }
      }).catch((err) => {
        const target = ev.source || child;
        if (target) {
          target.postMessage({ type: 'pdf_multi_error', key, index: idx, message: err?.message || '下载失败' }, '*');
        }
      });
    };
    window.addEventListener('message', handler, false);
    const timer = setInterval(() => {
      if (child && child.closed) {
        window.removeEventListener('message', handler, false);
        clearInterval(timer);
      }
    }, 1000);
  };

  if(params?.plyl!='Y'){
    openSingle(urlOrList as string, params);
    return;
  }

  getOneTimeToken({}).then((response1) => {
    if (response1.code === '200') {
        return downloadUrlList(params, urlOrList, response1.body);
      }
      message.error(response1.desc);
      throw new Error(response1.desc);
    }).then((response2) => {
      if(response2.data.code === '200'){
        const item =  response2.data.body || [];
        const wjljs: any = [];
        item.forEach((temp: any) => {
          wjljs.push({ url: `/hx/ty/report/jzPdfToPath/EXCEL_REPORT_${params.ywKey}/`, wjlj: temp })
        })
        if (Array.isArray(wjljs)) {
          if (wjljs.length === 1) {
            const it = wjljs[0];
            const u = it?.url || it?.wjlj || it;
            const ps = it?.params || it?.config || params;
            ps.wjlj = wjljs[0].wjlj;
            openSingle(u, ps);
            return;
          }
          openMulti(wjljs);
          return;
        }
      }
    })

}

// 原在线申报系统模块 导出
cktsUtil.downloadFileCkts = async (url: any, params: any) => {
  // 获取一次性token
  await getOneTimeToken({}).then(async(response1) => {
    myUtil.sessionStore.setItem('ztssDy', false)
    if (response1.code === '200') {
      return await downloadGet(params, url, response1.body);
    }
    message.error(response1.desc);
    throw new Error(response1.desc);
  }).then((response2) => {
    const type = response2?.data?.type;
    myUtil.sessionStore.setItem('ztssDy', true)
    if('application/octet-stream' == type ){
      const aLink = document.createElement('a');
      document.body.appendChild(aLink);
      aLink.style.display='none';
      const objectUrl = window.URL.createObjectURL(response2.data);
      aLink.href = objectUrl;
      const { headers } = response2.response;
      const contentDisposition = headers.get('Content-Disposition');
      let fileName = contentDisposition ? contentDisposition.split('filename=')[1] : 'downloadFile';
      fileName = decodeURI(fileName);
      aLink.download = fileName;
      aLink.click();
      document.body.removeChild(aLink);
    }else{
      var reader = new FileReader();
      reader.readAsText(response2?.data, 'utf8');
      reader.onload = function() {
       const obj =  JSON.parse(this.result);
       message.error(obj?.msg);
      }
    }
  })
}

// post 可选url 导出
cktsUtil.downloadFilePost = async (url: any, params: any) => {
  // 获取一次性token
  await downloadUrlPost(params, url).then(async(response) => {
    const { code, body, desc } = response;
    if (code === '200') {
      const { blob, fileName } = body;
      myUtil.file.downloadExcel(blob, fileName);
    } else {
      message.error(desc);
    }
  });
}

//PDF获得moduel，获取pdfjs路径
cktsUtil.getPdfLj = () => {
  let src = "";
  if(PRO_BASE && PRO_BASE != '') {
    src = `/${PRO_BASE}/pdfjs/web/viewer.html`;
    return src;
  } else {
    src = `/pdfjs/web/viewer.html`;
    return src;
  }
}

//PDF获得moduel，获取本地静态地址
cktsUtil.getStaticLink = (link: any) => {
  let src = "";
  if(PRO_BASE && PRO_BASE != '') {
    src = `/${PRO_BASE}` + link;
    return src;
  } else {
    src = link;
    return src;
  }
}

// getAccess
cktsUtil.getAccess = (currentUser: any) => {
  return {
    canAdmin: currentUser && currentUser.access === 'admin',
    sysAuthority: currentUser && currentUser.authority,       // 自定义 系统权限
    svnAuthority: currentUser && currentUser.svn_authority,   // 自定义 svn权限
    isAdmin: currentUser && currentUser.authority === 'admin', // 自定义
    normalRouteFilter2: () => false,
    normalRouteFilter: false,
    /**
      海关企业代码：4403937669
      纳税人识别号：440301723031556
      纳税人名称：深圳顺络电子股份有限公司
     */
    isNsrsbh: currentUser && currentUser.nsrsbh === '440301723031556', // xt 获取企业信息，税号对比
    // 返回true代表改变
    // 网报
    is01001: () => {
      const qxzDms: any = currentUser?.qxzDms;
      if (qxzDms?.includes('010001')) {
        return true
      }
      return false;
    },
    // 单一窗口
    is01002: () => {
      const qxzDms: any = currentUser?.qxzDms;
      if (qxzDms?.includes('010002')) {
        return true
      }
      return false;
    },
    // 在线开票
    is020003: () => {
      const qxzDms: any = currentUser?.qxzDms;
      if (qxzDms?.includes('020003')) {
        return true
      }
      return false;
    },
    // 附列资料( 集成？)
    is020001: () => {
      const qxzDms: any = currentUser?.qxzDms;
      if (qxzDms?.includes('020001')) {
        return true
      }
      return false;
    },
    // 附列资料
    is010004: () => {
      const qxzDms: any = currentUser?.qxzDms;
      if (qxzDms?.includes('010004')) {
        return true
      }
      return false;
    },
    // 020004
    is020004: () => {
      const qxzDms: any = currentUser?.qxzDms;
      if (qxzDms?.includes('020004')) {
        return true
      }
      return false;
    },
    // 030003
    is030003: () => {
      const qxzDms: any = currentUser?.qxzDms;
      if (qxzDms?.includes('030003')) {
        return true
      }
      return false;
    },
    // 乐企
    is040001: () => {
      const qxzDms: any = currentUser?.qxzDms;
      if (qxzDms?.includes('040001')) {
        return true
      }
      return false;
    },
    // 专业版用户-出口发票定制
    is030006: () => {
      const qxzDms: any = currentUser?.qxzDms;
      if (qxzDms?.includes('030006')) {
        return true
      }
      return false;
    },
    isBtnQx: () => {
      const qxzZyList: any = currentUser?.qxzZyList || [];
      const btnList: any = [];
      for (let i = 0; i < qxzZyList.length; i++) {
        const children = qxzZyList[i].children;
        children.forEach((item: any) => {
          btnList.push(item.zyDm2)
        });
      }
      return btnList;
    },

    isZy: () => {
      const qxzZyList: any = currentUser?.qxzZyList || [];
      const btnList: any = [];
      for (let i = 0; i < qxzZyList.length; i++) {
        const children = qxzZyList[i].children;
        children.forEach((item: any) => {
          btnList.push(item.zyDm2)
        });
      }
      return btnList;
    },

    // 企业管理员
    isQyGly: () => {
      const yhlxDm: any = currentUser?.qxyh?.yhlxDm;
      if ('11' === yhlxDm) {
        return true;
      } else {
        return false;
      }
    },
    // 平台管理员
    isPtGly: () => {
      const yhlxDm: any = currentUser?.qxyh?.yhlxDm;
      if ('09' === yhlxDm) {
        return true;
      } else {
        return false;
      }
    },
    // 一般用户
    isYbyh: () => {
      const yhlxDm: any = currentUser?.qxyh?.yhlxDm;
      if ('09' != yhlxDm && '11' != yhlxDm) {
        return true;
      } else {
        return false;
      }
    },
    // 获得用户类型
    getYhlx: () => {
      const yhlxDm: any = currentUser?.qxyh?.yhlxDm;
      return yhlxDm;
    },
    getYhuuid1:() => {
      return currentUser?.qxyh?.yhuuid1;
    },
    getQyygbz:() => {
      return currentUser?.qxyh?.qyygbz;
    },

    // 是否展示登录页面（用于被集成时去掉登录展示防止客户使用登录页登录）
    isLogin: () => {
      console.log(JC_TYPE)
      try {
        if (JC_TYPE === 'ckts') {
          return false;
        }
      } catch (e) {
        return true;
      }
      return true;
    },
    // UAT环境标识
    is020007: () => {
      const qxzDms: any = currentUser?.qxzDms;
      if (qxzDms?.includes('020007')) {
        return true
      }
      return false;
    }
  }
}


// 老系统迁移
// 数据报表查询参数特殊处理
cktsUtil.grid = {
  getSjbbDateSearchModel: (param: any) => {
    // 例如申报年月（sbny）
    // 本期       sbnyq、sbnyz
    // 前期       sbnyqqq、sbnyqqz
    // 上年同期   sbnysntqq、sbnysntqz
    const { item } = param;
    let property: any = item.name;

    let time: any = '';
    let time1: any = '';
    let timeqq: any = '';
    let timeqq1: any = '';
    let timesntq: any = '';
    let timesntq1: any = '';
    const tmp = [];
    // debugger
    if (item.format === 'yyyy-MM' || item.format === 'YYYY-MM' || item.format === 'yyyyMM' || item.format === 'YYYYMM') { // 年月 特殊处理
      // 本期
      if (item.format.indexOf('-') > -1) {
        time = myUtil.date.getDateNYBeforeCurr(0, item.defaultValue[0]);
        time1 = myUtil.date.getDateNYBeforeCurr(0, item.defaultValue[1]);
      } else {
        time = myUtil.date.getDateNYBeforeCurrFormat(0, item.defaultValue[0]);
        time1 = myUtil.date.getDateNYBeforeCurrFormat(0, item.defaultValue[1]);
      }
      let propertyQ: any = property;
      let propertyZ: any = property + '1';
      let valueQ: any = (time).valueOf();
      let valueZ: any = (time1).valueOf();
      tmp.push({ property: propertyQ, value: valueQ, op: 'zdy' });
      tmp.push({ property: propertyZ, value: valueZ, op: 'zdy' });
      // 前期
      if (item.format.indexOf('-') > -1) {
        timeqq = myUtil.date.getDateNYBeforeCurr(0, new Date(item.defaultValue[0]).getTime() - 2592000000);
        timeqq1 = myUtil.date.getDateNYBeforeCurr(0, new Date(item.defaultValue[1]).getTime() - 2592000000);
      } else {
        timeqq = myUtil.date.getDateNYBeforeCurrFormat(0, new Date(item.defaultValue[0]).getTime() - 2592000000);
        timeqq1 = myUtil.date.getDateNYBeforeCurrFormat(0, new Date(item.defaultValue[1]).getTime() - 2592000000);
      }
      let propertyQqq: any = property + 'qq';
      let propertyQqz: any = property + 'qq1';
      let valueQqq: any = (timeqq).valueOf();
      let valueQqz: any = (timeqq1).valueOf();
      tmp.push({ property: propertyQqq, value: valueQqq, op: 'zdy' });
      tmp.push({ property: propertyQqz, value: valueQqz, op: 'zdy' });
      // 上年同期
      if (item.format.indexOf('-') > -1) {
        timesntq = myUtil.date.getDateNYBeforeCurr(1, item.defaultValue[0]);
        timesntq1 = myUtil.date.getDateNYBeforeCurr(1, item.defaultValue[1]);
      } else {
        timesntq = myUtil.date.getDateNYBeforeCurrFormat(1, item.defaultValue[0]);
        timesntq1 = myUtil.date.getDateNYBeforeCurrFormat(1, item.defaultValue[1]);
      }
      let propertySntqq: any = property + 'sntq';
      let propertySntqz: any = property + 'sntq1';
      let valueSntqq: any = (timesntq).valueOf();
      let valueSntqz: any = (timesntq1).valueOf();
      tmp.push({ property: propertySntqq, value: valueSntqq, op: 'zdy' });
      tmp.push({ property: propertySntqz, value: valueSntqz, op: 'zdy' });
    } else { // 年月日 正常处理
      if (item.defaultValue[1]) {
        time = myUtil.date.getDateNYRBeforeCurr(0, item.defaultValue[0]);
        time1 = myUtil.date.getDateNYRBeforeCurr(0, item.defaultValue[1]);
        let propertyQ: any = property;
        let propertyZ: any = property + '1';
        let valueQ: any = (time).valueOf();
        let valueZ: any = (time1).valueOf();
        tmp.push({ property: propertyQ, value: valueQ, op: 'zdy' });
        tmp.push({ property: propertyZ, value: valueZ, op: 'zdy' });
      } else {
        time = myUtil.date.getDateNYRBeforeCurr(0, item.defaultValue);
        let propertyQ: any = property;
        let valueQ: any = (time).valueOf();
        tmp.push({ property: propertyQ, value: valueQ, op: 'zdy' });
      }
    }
    return tmp;
  }
}

cktsUtil.code = {
  async getTsbz() {
    const result = await sfczdlzfp({});
    return result;
  },
}

cktsUtil.text = {
  
  /**
   * @method replace
   * @desc 字符窜占位符替换
   */
  formatRepalce(ss: any, obj: any) {
    let tmp = ss;
    for (let key in obj) {
      tmp = tmp.replace(new RegExp("\\{\\{" + key + "\\}\\}", "g"), obj[key]);
    }
    return tmp;
  },
}

export default cktsUtil;
