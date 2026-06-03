/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser | undefined }) {
  const { currentUser } = initialState || {};
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
      const qxzZyList: any = currentUser?.qxzZyList;
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
      const qxzZyList: any = currentUser?.qxzZyList;
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

  };
}
