// 已生成数据/申报明细
import React, { useState, useEffect, useImperativeHandle } from 'react';
import { Modal, Tabs } from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
import myUtil from '@/components/DDAssist/util';
import { history, useRouteData } from 'umi';
// 注：tab 元数据（parent + children）从 sessionStore 的 usermenu 取（动态加载，含 SaaS 节点）

// === 静态 import 13 个 dditax.ckts.from 子模块 ===
// 来源：config/routes/routes.ckts.ts line 930-943（SBMXCX_25* 路由）
// webpack 必须在编译时看到所有可能的模块引用，否则 dynamic import 解析失败
// 维护方式：如果 menu 结构变化（新增/删除/重命名子模块），同步更新这里
// 顺序与 routes.ckts.ts 一致（250501 → 250513）

// 250501: 生产企业出口货物及修理修配服务免抵退税申报明细表
import _250501 from '@/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TSSB_GCB';
// 250502: 海关商品编码、名称、退税率调整对应表
import _250502 from '@/pages/hts/dditax.ckts.from/MDT_TSZL___ZXSB_SB_HGSPTZ_GCB';
// 250503: 出口业务收汇情况表
import _250503 from '@/pages/hts/dditax.ckts.from/MDT_TSZL___ZXSB_SB_CKSH_GCB';
// 250504: 出口货物离岸价差异原因说明表
import _250504 from '@/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_CYSM_GCB';
// 250505: 视同自产进货明细清单
import _250505 from '@/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_STZC_GCB';
// 250514: 外贸企业出口退税进货明细申报表（路由里排在 250506 之前）
import _250514 from '@/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TSJH_GCB';
// 250506: 已注释（先退税后核销），跳过
// 250507: 国际运输、航天运输免抵退税申报明细表
import _250507 from '@/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_GJYS_GCB';
// 250508: 航空国际运输收入清算账单申报明细表
import _250508 from '@/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_HKYS_QS_GCB';
// 250509: 铁路国际客运清算函件明细表
import _250509 from '@/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_KYHJ_GCB';
// 250510: 铁路国际货物运输明细表
import _250510 from '@/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TLHY_GCB';
// 250511: 跨境销售服务及无形资产免抵退税申报明细表
import _250511 from '@/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_YFSJ_GCB';
// 250512: 跨境销售服务及无形资产收讫营业款明细清单
import _250512 from '@/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_SYYK_GCB';
// 250513: 免抵退税申报汇总表
import _250513 from '@/pages/hts/dditax.ckts.from/mdts/sjsb/sjhz/swfk';

// 静态 component map：component 字符串 → 实际组件
// key 必须与 config/routes/routes.ckts.ts 里 component 字段完全一致
const STATIC_COMPONENTS: Record<string, React.ComponentType<any>> = {
  './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TSSB_GCB': _250501,
  './hts/dditax.ckts.from/MDT_TSZL___ZXSB_SB_HGSPTZ_GCB': _250502,
  './hts/dditax.ckts.from/MDT_TSZL___ZXSB_SB_CKSH_GCB': _250503,
  './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_CYSM_GCB': _250504,
  './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_STZC_GCB': _250505,
  './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TSJH_GCB': _250514,
  './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_GJYS_GCB': _250507,
  './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_HKYS_QS_GCB': _250508,
  './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_KYHJ_GCB': _250509,
  './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TLHY_GCB': _250510,
  './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_YFSJ_GCB': _250511,
  './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_SYYK_GCB': _250512,
  './hts/dditax.ckts.from/mdts/sjsb/sjhz/swfk': _250513,
};

export interface GeneratedDataProps {
  visible?: any;
  onRef?: any;
  tabs?: any;
  tabData?: any;          // 保留兼容，已废弃
  ywKey?: string;         // 用于查 routes 配置定位父节点
  activeKeyId?: string;   // 外部强行指定激活 tab
}

// 在 usermenu（sessionStore 动态菜单）中按 ywKey 找 scsbsj 父节点 → 取其 children 元数据
const findTabsByYwKey = (ywKey: string, userMenu: any[]): any[] => {
  const findParent = (nodes: any[]): any => {
    for (const n of nodes) {
      if (n.component === './hts/ckts/scsbsj/scsbsj' && n.ywKey === ywKey) {
        return n;
      }
      if (n.routes?.length) {
        const r = findParent(n.routes);
        if (r) return r;
      }
    }
    return null;
  };
  const parent = findParent(userMenu || []);
  if (!parent?.routes) return [];
  return parent.routes.filter(
    (r: any) => !r.redirect && r.component && r.component !== './404',
  );
};

// 子模块容器：从 static map 取组件；命中失败 → 提示
const SubModuleStatic: React.FC<{ compStr: string }> = ({ compStr }) => {
  const Comp = STATIC_COMPONENTS[compStr];
  if (!Comp) {
    return <div style={{ padding: 24, color: '#999' }}>未注册的子模块：{compStr}</div>;
  }
  return <Comp />;
};

const GeneratedData: React.FC<GeneratedDataProps> = ({
  visible = false,
  onRef,
  tabs = [],
  tabData,        // 保留兼容，不再使用
  ywKey = '',     // 用于查 routes
}) => {
  const [ modalVisible, setModalVisible ] = useState<boolean>(visible);
  const [ activeKey, setActiveKey ] = useState('');
  const [ myTabs, setMyTabs ] = useState(tabs);

  // 开启（兼容两种调用：传入 record 或 { activeKeyId, record }）
  const showModal = (param: any) => {
    const activeKeyId = param?.activeKeyId;
    if (activeKeyId) setActiveKey(activeKeyId);
    setModalVisible(true);
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  // initMyTab：从 usermenu（sessionStore）按 ywKey 反查父节点下的 children
  // usermenu 由 app.tsx 异步加载；若首次调用时为空，modal 打开时会自动重试
  const initMyTab = () => {
    const userMenu = myUtil.sessionStore.getItem('usermenu') || [];
    const nextTabs = ywKey ? findTabsByYwKey(ywKey, userMenu) : [];
    setMyTabs(nextTabs);
    // 默认激活第一个非 redirect 的 tab（若 activeKey 尚未设置）
    if (nextTabs.length > 0 && !activeKey) {
      setActiveKey(nextTabs[0].id);
    }
  };

  useEffect(() => {
    initMyTab();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ywKey]);

  // modal 打开时若 myTabs 仍为空，兜底重试（处理 usermenu 异步加载晚于 mount 的场景）
  useEffect(() => {
    if (modalVisible && myTabs.length === 0 && ywKey) {
      initMyTab();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalVisible]);

  // modal 打开时若 activeKey 为空，兜底用第一个 tab
  useEffect(() => {
    if (modalVisible && myTabs.length > 0 && !activeKey) {
      setActiveKey(myTabs[0].id);
    }
  }, [modalVisible, myTabs, activeKey]);

  // antd v6 items API：每个 item 的 children 是该 tab 的静态子模块
  const tabItems = myTabs.map((item: any, index: number) => ({
    key: item.id,
    label: item.name,
    closable: index === 0 ? false : false,
    children: activeKey === item.id
      ? <SubModuleStatic compStr={item.component} />
      : <div style={{ display: 'none' }} />,
  }));

  // 切换 tab（仅本地 state 切换，不触发 history.push —— modal 是 overlay，不应跳路由）
  const onChange = (key: any) => {
    setActiveKey(key);
  };

  return (
    <Modal
      title='已生成数据查询'
      open={modalVisible}
      wrapClassName='standard-modal'
      footer={null}
      width={CONSTANTS.C_MODAL_WIDTH_X4}
      onCancel={() => setModalVisible(false)}
      destroyOnHidden
      mask={{ closable: false }}
    >
      <div className="template_tab2">
        <Tabs size="small" tabBarGutter={5} type="editable-card" hideAdd={true} activeKey={activeKey}
          onChange={onChange}
          items={tabItems}
          renderTabBar={(props, DefaultTabBar) => {
            if (myTabs.length <= 1) {
              return <></>;
            } else {
              return <DefaultTabBar {...props} />;
            }
          }}
        />
      </div>
    </Modal>
  );
};

export default GeneratedData;