// 运行时配置
import React from 'react';
import { RuntimeConfig, Navigate } from 'umi';
import RightContent from '@/pages/Layout/rightContent';
import myUtil from '@/components/DDAssist/util';
import cktsUtil from '@/pages/hts/cktsUtil';
import nbglxtUtil from '@/pages/nbglxt/common/nbglxtUtil';
import { history } from '@umijs/max';
import { queryCurrentUser, queryAll, getUserAvatarBlob, queryListNs } from '@/services/api';
import { requestConfig } from './requestConfig';
import { ConfigProvider, message } from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
import { ICON_MAPPING } from '@/components/DDAssist/util/appIcons';

// ==================== 图标映射 ====================
// 使用 appIcons.tsx 导出的图标映射表
const iconMapping = ICON_MAPPING;

// ==================== 主题配置 ====================

export const antd: RuntimeConfig = (memo: any) => {
  memo.theme = {
    ...memo.theme,
    ...myUtil.theme.getRuntimeTheme(memo.theme || {}),
  };

  // 配置静态方法支持主题
  ConfigProvider.config({
    holderRender: (children: React.ReactNode) => (
      <ConfigProvider theme={memo.theme}>
        {children}
      </ConfigProvider>
    ),
  });

  return memo;
};

// ==================== 初始化数据 ====================

/**
 * 获取当前用户信息
 */
const fetchUserInfo = async () => {
  try {
    const msg = await queryCurrentUser({
      skipErrorHandler: true,
    });
    if (msg.code !== '200') {
      message.info(msg.codeDesc);
      history.push(CONSTANTS.ROUTE.LOGIN);
    }
    // 处理头像
    if (msg && msg.avatar) {
      const blobObj = await getUserAvatarBlob();
      if (blobObj.size > 0) {
        const avatarUrl = window.URL.createObjectURL(new Blob([blobObj]));
        msg.avatarUrl = avatarUrl;
      }
    }
    myUtil.sessionStore.setItem('currentUser', msg.body);
    return msg;
  } catch (error) {
    const { origin } = window.location;
    window.location.href = `${origin}${CONSTANTS.ROUTE.LOGIN}`;
    // history.push(CONSTANTS.ROUTE.LOGIN);
  }
  return undefined;
};

/**
 * 全局初始化数据配置，用于 Layout 用户信息和权限初始化
 * @see https://umijs.org/docs/api/runtime-config#getinitialstate
 */
export async function getInitialState(): Promise<{
  currentUser?: any;
  fetchUserInfo?: () => Promise<any>;
}> {
  // 初始化主题
  myUtil.theme.init();

  // 如果不是登录页面，执行初始化
  if (!myUtil.authority.isWhiteListUrl()) {
    await nbglxtUtil.app.init();
    const currentUser = await fetchUserInfo();
    await myUtil.sdp.init({ currentUser: currentUser?.body });
    return {
      fetchUserInfo,
      currentUser,
    };
  }
  return {
    fetchUserInfo,
  };
}

// ==================== 布局配置 ====================

export const layout = ({ initialState }: any) => {
  const token: any = myUtil.theme.getLayoutToken();
  const sysConfig = myUtil.sys.getConfig();

  // 基础布局配置
  const cc: any = {
    token,
    rightRender: () => <RightContent />,
    logo: sysConfig.logo,
    title: sysConfig.title,
    menu: { locale: false },
    layout: myUtil.theme.getThemeItem('layout'),
    fixedHeader: myUtil.theme.getThemeItem('fixedHeader'),
    siderWidth: 200,
  };

  // 非本地菜单 - 加载后端菜单
  if (!LOCAL_MENU) {
    cc.menu = {
      params: initialState,
      request: async (params: any, defaultMenuData: any) => {
        let menuInfo: any;

        if (ENV_TYPE === 'node') {
          // Node 环境：处理后端返回的菜单数据
          menuInfo = initialState.currentUser.body.menuInfo || [];
          menuInfo = menuInfo.filter((tmp: any) => tmp.menu_type !== '9') || [];

          menuInfo.forEach((item: any) => {
            item.component = item.menu_component;
            item.path = item.menu_path;
            item.name = item.menu_name;
            item.id = item.menu_id;
            item.menuId = item.menu_id;
            item.icon = item.menu_icon;
            item.hideInMenu = item.menu_hide === 0 ? 'N' : 'Y';
            item.menuFullScreen = item.menu_full_screen === 0 ? 'N' : 'Y';
            item.menuIndex = item.menu_index;
            item.redirect = item.menu_redirect;
          });

          // 转换为树形结构
          menuInfo = myUtil.tree.transformArrToTree(menuInfo, '', {
            idName: 'menu_id',
            parentIdName: 'menu_parent_id',
            childrenName: 'routes',
          });
        } else {
          menuInfo = initialState.currentUser.body.menuInfo || [];
        }

        // 递归处理菜单数据：转换图标和显示属性
        const treeData = (data: any) => {
          data.forEach((item: any) => {
            if (item.icon) {
              item.icon = iconMapping[item.icon];
            }
            item.hideInMenu = item.hideInMenu === 'Y' ? true : false;
            if (item.menuFullScreen === 'Y') {
              item.menuRender = false;
            }
            if (item.parentKeys) {
              item.parentKeys = [item.parentKeys];
            }
            if (item.routes?.length > 0) {
              treeData(item.routes);
            }
          });
        };
        treeData(menuInfo);

        // 排序菜单
        if (ENV_TYPE === 'node') {
          menuInfo = myUtil.tree.sortTree(menuInfo, 'menuIndex', 'asc');
        }

        // 合并示例菜单
        let newMenuInfo = [...menuInfo];
        if (EXAMPLE_MENU_SHOW) {
          const menuExample = defaultMenuData.find((tmp: any) => tmp.name === '示例');
          if (menuExample) {
            newMenuInfo = [...newMenuInfo, menuExample];
          }
          // const menuHts = defaultMenuData.find((tmp: any) => tmp.name.indexOf('慧退税') > -1);
          // if (menuHts) {
          //   newMenuInfo = [...newMenuInfo, menuHts];
          // }
        }
        // hts菜单
        const resHtsMenu = await cktsUtil.menu.getHtsMenu({treeData});
        newMenuInfo = [...newMenuInfo, ...resHtsMenu];

        return newMenuInfo;
      },
    };
  }

  return cc;
};

// ==================== 动态路由 ====================

let extraRoutes: any[] = [];

/**
 * 覆写 render - 应用渲染前初始化
 */
export function render(oldRender: any) {
  if (!LOCAL_MENU) {
    if (!myUtil.authority.isWhiteListRouterUrl()) {
      let queryMenuAllApi1: any;
      let queryMenuAllApi2: any;
      let queryMenuAllApiPars: any = {};

      if (ENV_TYPE === 'node') {
        queryMenuAllApi1 = queryListNs;
        queryMenuAllApi2 = 'sys_menu';
        queryMenuAllApiPars = { page: 1, pageSize: 999999, searchModel: [] };
      } else {
        queryMenuAllApi1 = queryAll;
      }

      queryMenuAllApi1(queryMenuAllApiPars, queryMenuAllApi2).then((res: any) => {
        if (res?.body) {
          const menuBtn: any = [];
          extraRoutes = ENV_TYPE === 'node' ? res.body.rows : res.body;

          extraRoutes?.map((item: any) => {
            item.path = ENV_TYPE === 'node' ? item.menu_path : item.menuPath;
            item.component = ENV_TYPE === 'node' ? item.menu_component : item.menuComponent;
            if (item.menuType === '9' || item.menu_type === '9') {
              menuBtn.push(item);
            }
          });

          // 存储按钮权限
          myUtil.sessionStore.setItem('menuBtn', menuBtn);
        }
        oldRender();
      });
    } else {
      oldRender();
    }
  } else {
    oldRender();
  }
}

/**
 * 客户端路由修补 - 注入动态路由
 */
export async function patchClientRoutes({ routes }: any) {
  const routerIndex = routes.findIndex((item: any) => item.path === '/');
  const parentId = routes[routerIndex].id;
  if (extraRoutes) {
    routes[routerIndex]['routes'].push(...loopMenuItem(extraRoutes, parentId));
  }
}

/**
 * 菜单路由节点格式化
 */
const loopMenuItem = (menus: any[], pId: number | string): any[] => {
  return menus.map((item: any) => {
    const Component = React.lazy(() =>
      new Promise((resolve) => {
        if (item?.component) {
          import(`@/pages${item.component.substring(1)}`).then((module) => resolve(module));
        }
      }),
    );

    if (item.routes) {
      return {
        path: item.path,
        name: item.name,
        icon: iconMapping[item.icon],
        id: item.id,
        parentId: pId,
        children: [
          {
            path: item.path,
            element: <Navigate to={item.routes[0].path} replace />,
          },
          ...loopMenuItem(item.routes, item.id),
        ],
      };
    }

    return {
      path: item.path,
      name: item.name,
      icon: iconMapping[item.icon],
      id: item.id,
      parentId: pId,
      element: (
        <React.Suspense fallback={<div>Loading...</div>}>
          {Component && <Component />}
        </React.Suspense>
      ),
    };
  });
};

// ==================== 请求配置 ====================

/**
 * 请求配置
 * 基于 axios 提供统一的网络请求和错误处理方案
 * @see https://umijs.org/docs/max/request#配置
 */
export const request = {
  ...requestConfig,
};
