/**
 * titel: Tab
 */
import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import { useRouteMatch } from 'umi';
import myUtil from '@/pages/common/myUtil';
import Nav from '@/pages/hts/template/template_icon_nav2';
import menu_ckts from '../../../../config/menu/menu_ckts';
import { cloneDeep } from 'lodash';

let myTabsGlobal:any = [];

export type TemplateTabProps = {
  tabs?: any;
}
const TemplateTab: React.FC<TemplateTabProps> = ({
  tabs = [],
}) => {
  const [ activeKey, setActiveKey ] = useState('');
  let [ myTabs, setMyTabs ] = useState(tabs);
  const routeMatch = useRouteMatch();     // 获取当前路由的匹配信息

  // 切换tab
  const onChange = (key: any) => {
    setActiveKey(key);
  };

  // 新增和删除页签的回调
  const onEdit = (targetKey: any, action: any) => {
    if (action === 'remove') {
      remove(targetKey);
    }
  };

  // 增加tab
  const add = (item: any) => {
    const { id } = item;
    let isExist = false;
    myTabsGlobal.forEach((itemTmp: any) => {
      if (itemTmp.id === item.id) {
        isExist = true;
        return false;
      }
      return true;
    });
    const setFunTab = (pItem: any, pFrm: any, pId: any) => {
      myTabsGlobal.push({ ...pItem, tab: <pFrm.default />, });
      setMyTabs(myTabsGlobal);
      setActiveKey(pId);
    }
    if (!isExist) {
      // function getTreeComponent(list: any, id: any) {
      //   for (let i = 0; i < list.length; i++) {
      //     let item = list[i];
      //     if (item.id === id) {
      //       return item.component;
      //     } else {
      //       if (item.routes && item.routes.length > 0) {
      //         let res: any = getTreeComponent(item.routes, id)
      //         if (res) {
      //           return res;
      //         }
      //       }
      //     }
      //   }
      // }
      // const tmpMenuCkts = cloneDeep(menu_ckts);
      // let tmpComponent = getTreeComponent(tmpMenuCkts, id);
      // if (tmpComponent) {
      //   tmpComponent = tmpComponent.slice(2);
      //   if (process.env.NODE_ENV === 'production') {
      //     const func = require(`@/pages/${tmpComponent}`);
      //     setFunTab(item, func, id);
      //   } else if (process.env.NODE_ENV === 'development') {
      //     require(`@/pages/${tmpComponent}`).then((Frm: any) => { setFunTab(item, Frm, id); });
      //   }
      // }


      // 打包后require结构发生变化，采用不同引用方式
      if (process.env.NODE_ENV === 'production') {
        let tmpFunc: any;
        // MDT 数据采集
        if (id === '03010102') {
          tmpFunc = require('@/pages/hts/commonModule/ckhwbgd');
        } else if (id === '03010103') {
          tmpFunc = require('@/pages/hts/commonModule/dlhwzmgl');
        } else if (id === '03010105') {
          tmpFunc = require('@/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TSSB_GCB');
        } else if (id === '03010106') {
          tmpFunc = require('@/pages/hts/dditax.ckts.from/MDT_TSZL___ZXSB_SB_HGSPTZ_GCB');
        } else if (id === '03010107') {
          tmpFunc = require('@/pages/hts/dditax.ckts.from/MDT_TSZL___ZXSB_SB_CKSH_GCB');
        } else if (id === '03010108') {
          tmpFunc = require('@/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_CYSM_GCB');
        } else if (id === '03010109') {
          tmpFunc = require('@/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_STZC_GCB');
        } else if (id === '03010110') {
          tmpFunc = require('@/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_XTHH_GCB');
        } else if (id === '03010111') {
          tmpFunc = require('@/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_GJYS_GCB');
        } else if (id === '03010112') {
          tmpFunc = require('@/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_HKYS_QS_GCB');
        } else if (id === '03010113') {
          tmpFunc = require('@/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_KYHJ_GCB');
        } else if (id === '03010114') {
          tmpFunc = require('@/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TLHY_GCB');
        } else if (id === '03010115') {
          tmpFunc = require('@/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_YFSJ_GCB');
        } else if (id === '03010116') {
          tmpFunc = require('@/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_SYYK_GCB');
        }
        // 生产 出口已使用过设备退税
        else if (id === '03020102') {
          tmpFunc = require('@/pages/hts/dditax.ckts.from/ZBYW___ZXSB_SB_YS_SBMX_GCB');
        } else if (id === '03020103') {
          tmpFunc = require('@/pages/hts/dditax.ckts.from/YS_TSZL___ZXSB_SB_HGSPTZ_GCB');
        } else if (id === '03020104') {
          tmpFunc = require('@/pages/hts/dditax.ckts.from/YS_TSZL___ZXSB_SB_CKSH_GCB');
        }
        // 出口非自产消费税退税
        else if (id === '03040102') {
          tmpFunc = require('@/pages/hts/dditax.ckts.from/ZBYW___ZXSB_SB_FZC_SBMX_GCB');
        } else if (id === '03040103') {
          tmpFunc = require('@/pages/hts/dditax.ckts.from/FZC_TSZL___ZXSB_SB_HGSPTZ_GCB');
        } else if (id === '03040104') {
          tmpFunc = require('@/pages/hts/dditax.ckts.from/FZC_TSZL___ZXSB_SB_CKSH_GCB');
        }
        // MTS 智能配单
        else if (id === '04010103') {
          tmpFunc = require('@/pages/hts/commonModule/ckhwbgd');
        } else if (id === '04010104') {
          tmpFunc = require('@/pages/hts/commonModule/zzszyfp');
        } else if (id === '04010105') {
          tmpFunc = require('@/pages/hts/commonModule/dlhwzmgl');
        } else if (id === '04010106') {
          tmpFunc = require('@/pages/hts/commonModule/pd/mts/sjznpd/bgdzxpd');
        } else if (id === '04010107') {
          tmpFunc = require('@/pages/hts/commonModule/pd/mts/sjznpd/fpzxpd');
        } else if (id === '04010108') {
          tmpFunc = require('@/pages/hts/commonModule/pd/mts/sjznpd/znpd');
        } else if (id === '04010109') {
          tmpFunc = require('@/pages/hts/commonModule/pd/mts/sjznpd/dlzmznpd');
        }
        // MTS 数据采集
        else if (id === '04010202') {
          tmpFunc = require('@/pages/hts/dditax.ckts.from/MTS___ZXSB_SB_MTS_TSSB_GCB');
        } else if (id === '04010203') {
          tmpFunc = require('@/pages/hts/dditax.ckts.from/MTS___ZXSB_SB_MTS_TSJH_GCB');
        } else if (id === '04010204') {
          tmpFunc = require('@/pages/hts/dditax.ckts.from/MTS_TSZL___ZXSB_SB_HGSPTZ_GCB');
        } else if (id === '04010205') {
          tmpFunc = require('@/pages/hts/dditax.ckts.from/MTS_TSZL___ZXSB_SB_CKSH_GCB');
        } else if (id === '04010206') {
          tmpFunc = require('@/pages/hts/dditax.ckts.from/MTS___ZXSB_SB_MTS_TZSB_GCB');
        } else if (id === '04010207') {
          tmpFunc = require('@/pages/hts/dditax.ckts.from/MTS___ZXSB_SB_MTS_YSFWCK_GCB');
        }
        // MTS 外综服 智能配单
        else if (id === '04030103') {
          tmpFunc = require('@/pages/hts/commonModule/ckhwbgd');
        } else if (id === '04030104') {
          tmpFunc = require('@/pages/hts/commonModule/zzszyfp');
        } else if (id === '04030105') {
          tmpFunc = require('@/pages/hts/commonModule/pd/mts/sjznpd/bgdzxpd');
        }
        // MTS 外综服 数据采集
        else if (id === '04030202') {
          tmpFunc = require('@/pages/hts/dditax.ckts.from/DBTS___ZXSB_SB_DB_TSSB_GCB');
        } else if (id === '04030203') {
          tmpFunc = require('@/pages/hts/dditax.ckts.from/DBTS_TSZL___ZXSB_SB_HGSPTZ_GCB');
        } else if (id === '04030204') {
          tmpFunc = require('@/pages/hts/dditax.ckts.from/DBTS_TSZL___ZXSB_SB_CKSH_GCB');
        }
        // 外贸 出口已使用过设备退税
        else if (id === '04040102') {
          tmpFunc = require('@/pages/hts/dditax.ckts.from/ZBYW___ZXSB_SB_YS_SBMX_GCB');
        } else if (id === '04040103') {
          tmpFunc = require('@/pages/hts/dditax.ckts.from/YS_TSZL___ZXSB_SB_HGSPTZ_GCB');
        } else if (id === '04040104') {
          tmpFunc = require('@/pages/hts/dditax.ckts.from/YS_TSZL___ZXSB_SB_CKSH_GCB');
        }
        // 资格备案
        else if (id === '07050102') {
          tmpFunc = require('@/pages/hts/commonModule/ckhwbgd');
        } else if (id === '07050103') {
          tmpFunc = require('@/pages/hts/dditax.ckts.from/ZGBA___ZXSB_BA_BMDLCKBA_GCB');
        }
        setFunTab(item, tmpFunc, id);
      } else if (process.env.NODE_ENV === 'development') {
        // MDT 数据采集
        if (id === '03010102') {
          require('@/pages/hts/commonModule/ckhwbgd').then((Frm: any) => { setFunTab(item, Frm, id); });
        } else if (id === '03010103') {
          require('@/pages/hts/commonModule/dlhwzmgl').then((Frm: any) => { setFunTab(item, Frm, id); });
        } else if (id === '03010105') {
          require('@/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TSSB_GCB').then((Frm: any) => { setFunTab(item, Frm, id); });
        } else if (id === '03010106') {
          require('@/pages/hts/dditax.ckts.from/MDT_TSZL___ZXSB_SB_HGSPTZ_GCB').then((Frm: any) => { setFunTab(item, Frm, id); });
        } else if (id === '03010107') {
          require('@/pages/hts/dditax.ckts.from/MDT_TSZL___ZXSB_SB_CKSH_GCB').then((Frm: any) => { setFunTab(item, Frm, id); });
        } else if (id === '03010108') {
          require('@/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_CYSM_GCB').then((Frm: any) => { setFunTab(item, Frm, id); });
        } else if (id === '03010109') {
          require('@/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_STZC_GCB').then((Frm: any) => { setFunTab(item, Frm, id); });
        } else if (id === '03010110') {
          require('@/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_XTHH_GCB').then((Frm: any) => { setFunTab(item, Frm, id); });
        } else if (id === '03010111') {
          require('@/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_GJYS_GCB').then((Frm: any) => { setFunTab(item, Frm, id); });
        } else if (id === '03010112') {
          require('@/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_HKYS_QS_GCB').then((Frm: any) => { setFunTab(item, Frm, id); });
        } else if (id === '03010113') {
          require('@/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_KYHJ_GCB').then((Frm: any) => { setFunTab(item, Frm, id); });
        } else if (id === '03010114') {
          require('@/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TLHY_GCB').then((Frm: any) => { setFunTab(item, Frm, id); });
        } else if (id === '03010115') {
          require('@/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_YFSJ_GCB').then((Frm: any) => { setFunTab(item, Frm, id); });
        } else if (id === '03010116') {
          require('@/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_SYYK_GCB').then((Frm: any) => { setFunTab(item, Frm, id); });
        }
        // 生产 出口已使用过设备退税
        else if (id === '03020102') {
          require('@/pages/hts/dditax.ckts.from/ZBYW___ZXSB_SB_YS_SBMX_GCB').then((Frm: any) => { setFunTab(item, Frm, id); });
        } else if (id === '03020103') {
          require('@/pages/hts/dditax.ckts.from/YS_TSZL___ZXSB_SB_HGSPTZ_GCB').then((Frm: any) => { setFunTab(item, Frm, id); });
        } else if (id === '03020104') {
          require('@/pages/hts/dditax.ckts.from/YS_TSZL___ZXSB_SB_CKSH_GCB').then((Frm: any) => { setFunTab(item, Frm, id); });
        }
        // 出口非自产消费税退税
        else if (id === '03040102') {
          require('@/pages/hts/dditax.ckts.from/ZBYW___ZXSB_SB_FZC_SBMX_GCB').then((Frm: any) => { setFunTab(item, Frm, id); });
        } else if (id === '03040103') {
          require('@/pages/hts/dditax.ckts.from/FZC_TSZL___ZXSB_SB_HGSPTZ_GCB').then((Frm: any) => { setFunTab(item, Frm, id); });
        } else if (id === '03040104') {
          require('@/pages/hts/dditax.ckts.from/FZC_TSZL___ZXSB_SB_CKSH_GCB').then((Frm: any) => { setFunTab(item, Frm, id); });
        }
        // MTS 智能配单
        else if (id === '04010103') {
          require('@/pages/hts/commonModule/ckhwbgd').then((Frm: any) => { setFunTab(item, Frm, id); });
        } else if (id === '04010104') {
          require('@/pages/hts/commonModule/zzszyfp').then((Frm: any) => { setFunTab(item, Frm, id); });
        } else if (id === '04010105') {
          require('@/pages/hts/commonModule/dlhwzmgl').then((Frm: any) => { setFunTab(item, Frm, id); });
        } else if (id === '04010106') {
          require('@/pages/hts/commonModule/pd/mts/sjznpd/bgdzxpd').then((Frm: any) => { setFunTab(item, Frm, id); });
        } else if (id === '04010107') {
          require('@/pages/hts/commonModule/pd/mts/sjznpd/fpzxpd').then((Frm: any) => { setFunTab(item, Frm, id); });
        } else if (id === '04010108') {
          require('@/pages/hts/commonModule/pd/mts/sjznpd/znpd').then((Frm: any) => { setFunTab(item, Frm, id); });
        } else if (id === '04010109') {
          require('@/pages/hts/commonModule/pd/mts/sjznpd/dlzmznpd').then((Frm: any) => { setFunTab(item, Frm, id); });
        }
        // MTS 数据采集
        else if (id === '04010202') {
          require('@/pages/hts/dditax.ckts.from/MTS___ZXSB_SB_MTS_TSSB_GCB').then((Frm: any) => { setFunTab(item, Frm, id); });
        } else if (id === '04010203') {
          require('@/pages/hts/dditax.ckts.from/MTS___ZXSB_SB_MTS_TSJH_GCB').then((Frm: any) => { setFunTab(item, Frm, id); });
        } else if (id === '04010204') {
          require('@/pages/hts/dditax.ckts.from/MTS_TSZL___ZXSB_SB_HGSPTZ_GCB').then((Frm: any) => { setFunTab(item, Frm, id); });
        } else if (id === '04010205') {
          require('@/pages/hts/dditax.ckts.from/MTS_TSZL___ZXSB_SB_CKSH_GCB').then((Frm: any) => { setFunTab(item, Frm, id); });
        } else if (id === '04010206') {
          require('@/pages/hts/dditax.ckts.from/MTS___ZXSB_SB_MTS_TZSB_GCB').then((Frm: any) => { setFunTab(item, Frm, id); });
        } else if (id === '04010207') {
          require('@/pages/hts/dditax.ckts.from/MTS___ZXSB_SB_MTS_YSFWCK_GCB').then((Frm: any) => { setFunTab(item, Frm, id); });
        }
        // MTS 外综服 智能配单
        else if (id === '04030103') {
          require('@/pages/hts/commonModule/ckhwbgd').then((Frm: any) => { setFunTab(item, Frm, id); });
        } else if (id === '04030104') {
          require('@/pages/hts/commonModule/zzszyfp').then((Frm: any) => { setFunTab(item, Frm, id); });
        } else if (id === '04030105') {
          require('@/pages/hts/commonModule/pd/mts/sjznpd/bgdzxpd').then((Frm: any) => { setFunTab(item, Frm, id); });
        }
        // MTS 外综服 数据采集
        else if (id === '04030202') {
          require('@/pages/hts/dditax.ckts.from/DBTS___ZXSB_SB_DB_TSSB_GCB').then((Frm: any) => { setFunTab(item, Frm, id); });
        } else if (id === '04030203') {
          require('@/pages/hts/dditax.ckts.from/DBTS_TSZL___ZXSB_SB_HGSPTZ_GCB').then((Frm: any) => { setFunTab(item, Frm, id); });
        } else if (id === '04030204') {
          require('@/pages/hts/dditax.ckts.from/DBTS_TSZL___ZXSB_SB_CKSH_GCB').then((Frm: any) => { setFunTab(item, Frm, id); });
        }
        // 外贸 出口已使用过设备退税
        else if (id === '04040102') {
          require('@/pages/hts/dditax.ckts.from/ZBYW___ZXSB_SB_YS_SBMX_GCB').then((Frm: any) => { setFunTab(item, Frm, id); });
        } else if (id === '04040103') {
          require('@/pages/hts/dditax.ckts.from/YS_TSZL___ZXSB_SB_HGSPTZ_GCB').then((Frm: any) => { setFunTab(item, Frm, id); });
        } else if (id === '04040104') {
          require('@/pages/hts/dditax.ckts.from/YS_TSZL___ZXSB_SB_CKSH_GCB').then((Frm: any) => { setFunTab(item, Frm, id); });
        }
        // 资格备案
        else if (id === '07050102') {
          require('@/pages/hts/commonModule/ckhwbgd').then((Frm: any) => { setFunTab(item, Frm, id); });
        } else if (id === '07050103') {
          require('@/pages/hts/dditax.ckts.from/ZGBA___ZXSB_BA_BMDLCKBA_GCB').then((Frm: any) => { setFunTab(item, Frm, id); });
        }
      }
    } else {
      setActiveKey(id);
    }
  };

  // 删除tab
  const remove = (targetKey: any) => {
    let newActiveKey = activeKey;
    let lastIndex;
    myTabsGlobal.forEach((tab: any, i: number) => {
      if (tab.id === targetKey) {
        lastIndex = i - 1;
      }
    });
    myTabsGlobal = myTabsGlobal.filter((tab: any) => tab.id !== targetKey);
    if (myTabsGlobal.length && newActiveKey === targetKey) {
      if (lastIndex && lastIndex >= 0) {
        newActiveKey = myTabsGlobal[lastIndex].id;
      } else {
        newActiveKey = myTabsGlobal[0].id;
      }
    }
    setMyTabs(myTabsGlobal);
    setActiveKey(newActiveKey);
  };

  // initMyTab
  const initMyTab = () => {
    myTabsGlobal = [];
    let initKey: any; // eg: 03010100
    let navId: any; // eg: 030101
    let name: any; // eg: 数据采集
    // 根据当前组件匹配路由获取Tab菜单信息
    const [routePathname] = [...routeMatch.path.split('/')].reverse();
    const menuObj = myUtil.menu.getMenuObjByName(routePathname) || [];
    if (menuObj?.routes?.length > 0) {
      initKey = menuObj?.routes[0].id;
      navId = menuObj?.id;
      name = menuObj?.routes[0].name;
    }
    let sjcjTab = {
      name: name,
      id: initKey,
      tab: <Nav route={{navId: navId}} onHandleRoute={add}/>
    };
    myTabs.push(sjcjTab);
    myTabsGlobal.push(sjcjTab);
    setMyTabs([...myTabs]);
    setActiveKey(initKey);
  }

  useEffect(() => {
    initMyTab();
  }, []);

  // 初始化
  const getTabs = () => {
    let tabArr: any = [];
    myTabs && myTabs.length > 0 && myTabs.forEach((item: any, index: any) => {
      tabArr.push(
        <Tabs.TabPane tab={item.name} key={item.id} closable={index === 0 ? false : true}>
          { item.tab }
        </Tabs.TabPane>
      );
    })
    return tabArr;
  }

  return (
    <div className="template_tab2">
      <Tabs size="small" tabBarGutter={5} type="editable-card" hideAdd={true} activeKey={activeKey} onChange={onChange} onEdit={onEdit} >
        { getTabs() }
      </Tabs>
    </div>
  )};

export default TemplateTab;
