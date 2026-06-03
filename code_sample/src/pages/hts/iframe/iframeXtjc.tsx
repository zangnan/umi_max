/**
 * title: 集成桥页（获取集成方路径并访问）
 * author: wx
 */
import React, { useLayoutEffect, useState } from 'react';
import { history, useRouteMatch } from 'umi';
import { message } from 'antd';
import { getJcurlForXtjc } from '@/services/hts/api';
import myUtil from '@/pages/common/myUtil';
import { fetchMenuData } from '@/services/hts/api';

const iframeIntegration: React.FC<unknown> = () => {

  const routeMatch = useRouteMatch();     // 获取当前路由的匹配信息
  const [src, setSrc] = useState<any>('');

  useLayoutEffect(() => {
    const getXtjcParam = async () => {
      let jcfQdDm;
      let jcfJumpUrl;
      let menuObj;
      if (myUtil.menu.getMenuObjByPath(routeMatch.path)) {
        menuObj = myUtil.menu.getMenuObjByPath(routeMatch.path);
      } else {
        const res = await fetchMenuData({});
        if (res?.body?.length > 0) {
          myUtil.sessionStore.setItem('usermenu', res.body);
        }
        menuObj = myUtil.menu.getMenuObjByPath(routeMatch.path);
      }
      const cdDm = menuObj?.id;
      const param = history?.location?.query; 
      // 通过集成地址访问时从地址中获取参数
      if (param?.jcfs) {
        jcfQdDm = param.jcfQdDm;
        jcfJumpUrl = param.jcfJumpUrl;
      } else { // 正常访问时从菜单配置中获取参数
        jcfQdDm = menuObj?.jcfQdDm;
        jcfJumpUrl = menuObj?.jcfJumpUrl;
      }
      getJcurlForXtjc({
        wlxh: "",
        cdDm,
        jcfQdDm,
        jcfJumpUrl
    }).then((response: any) => {
        const { code, body, desc } = response;
        if (code === '200') {
          setSrc(body?.jcfUrl);
        } else {
          message.error(desc);
        }     
      })
    }
    getXtjcParam();
  }, []);

  return <iframe src={src} width="100%" height="100%" frameBorder="no"></iframe>;
};

export default iframeIntegration;