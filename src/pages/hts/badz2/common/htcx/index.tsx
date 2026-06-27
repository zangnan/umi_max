/**
 * title: 备案单证目录
 */
import { Tabs } from 'antd';
import React, { useRef, useState } from 'react';
import '../../style.less';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import func from './func'
import { cloneDeep } from 'lodash';

import ckxsht_config from '../../common/config/ckxsht_config';        // 出口销售合同
import ghht_config from '../../common/config/ghht_config';            // 购货合同
import wmzhfwht_config from '../../common/config/wmzhfwht_config';    // 外贸综合服务合同
import tyd_config from '../../common/config/tyd_config';              // 提运单
import ysfp_config from '../../common/config/ysfp_config';            // 运输发票
import wtbgxy_config from '../../common/config/wtbgxy_config';        // 委托报关协议
import dlbgfwffp_config from '../../common/config/dlbgfwffp_config';  // 代理报关服务费发票
import qtdz_config from '../../common/config/qtdz_config';            // 其他单证

import DrawerSpxx from '../spxx';
import ModalBadzyl from './modal_xq';
import Preview from '../preview';

export type BadzylModal = {
  onRef?: any;
  mainParams: any;
  type?: any
  tabActive?: any
  ckbgdh?: any
}

const BadzylModal: React.FC<BadzylModal> = ({
  onRef,
  mainParams,
  type,
  tabActive = 'ckxsht',
  ckbgdh
}) => {
  const [activeKey, setActiveKey] = useState<string>(tabActive);

  const tabCallback = (key: any) => {
    setActiveKey(key)
  }

  const drawerSpxxRef: any = useRef();
  const modalBadzylRef: any = useRef();
  const previewRef: any = useRef();

  func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(mainParams);
    otherRef.push(drawerSpxxRef);
    otherRef.push(modalBadzylRef);
    otherRef.push(previewRef);
    return otherRef;
  };

  let ckxshtConfig = cloneDeep(ckxsht_config);        // 出口销售合同
  let ghhtConfig = cloneDeep(ghht_config);            // 购货合同
  let wmzhfwhtConfig = cloneDeep(wmzhfwht_config);    // 外贸综合服务合同
  let tydConfig = cloneDeep(tyd_config);              // 提运单
  let ysfpConfig = cloneDeep(ysfp_config);            // 运输发票
  let wtbgxyConfig = cloneDeep(wtbgxy_config);        // 委托报关协议
  let dlbgfwffpConfig = cloneDeep(dlbgfwffp_config);  // 代理报关服务费发票
  let qtdzConfig = cloneDeep(qtdz_config);            // 其他单证

  let sfpp = 'Y';
  if (type === 'save') {
    sfpp = 'N';
    // 配置项：自定义工具栏
    ckxshtConfig.customer_toolbar = [ { name: '保存', key: 'costomerToobarSave', func: 'costomerToobarSave'} ];
    ghhtConfig.customer_toolbar = [ { name: '保存', key: 'costomerToobarSave', func: 'costomerToobarSave'} ];
    wmzhfwhtConfig.customer_toolbar = [ { name: '保存', key: 'costomerToobarSave', func: 'costomerToobarSave'} ];
    tydConfig.customer_toolbar = [ { name: '保存', key: 'costomerToobarSave', func: 'costomerToobarSave'} ];
    ysfpConfig.customer_toolbar = [ { name: '保存', key: 'costomerToobarSave', func: 'costomerToobarSave'} ];
    wtbgxyConfig.customer_toolbar = [ { name: '保存', key: 'costomerToobarSave', func: 'costomerToobarSave'} ];
    dlbgfwffpConfig.customer_toolbar = [ { name: '保存', key: 'costomerToobarSave', func: 'costomerToobarSave'} ];
    qtdzConfig.customer_toolbar = [ { name: '保存', key: 'costomerToobarSave', func: 'costomerToobarSave'} ];
    ckxshtConfig.layout_type = 'modal';
    ghhtConfig.layout_type = 'modal';
    wmzhfwhtConfig.layout_type = 'modal';
    tydConfig.layout_type = 'modal';
    ysfpConfig.layout_type = 'modal';
    wtbgxyConfig.layout_type = 'modal';
    dlbgfwffpConfig.layout_type = 'modal';
    qtdzConfig.layout_type = 'modal';
  } else if (type === 'matching') {
    sfpp = 'Y';
    // 配置项：自定义工具栏
    ckxshtConfig.customer_toolbar = [ { name: '匹配', key: 'costomerToobarMatching', func: 'costomerToobarMatching'}, { name: '删除', key: 'costomerToobarDelete', func: 'costomerToobarDelete'} ];
    ghhtConfig.customer_toolbar = [ { name: '匹配', key: 'costomerToobarMatching', func: 'costomerToobarMatching'}, { name: '删除', key: 'costomerToobarDelete', func: 'costomerToobarDelete'} ];
    wmzhfwhtConfig.customer_toolbar = [ { name: '匹配', key: 'costomerToobarMatching', func: 'costomerToobarMatching'}, { name: '删除', key: 'costomerToobarDelete', func: 'costomerToobarDelete'} ];
    tydConfig.customer_toolbar = [ { name: '匹配', key: 'costomerToobarMatching', func: 'costomerToobarMatching'}, { name: '删除', key: 'costomerToobarDelete', func: 'costomerToobarDelete'} ];
    ysfpConfig.customer_toolbar = [ { name: '匹配', key: 'costomerToobarMatching', func: 'costomerToobarMatching'}, { name: '删除', key: 'costomerToobarDelete', func: 'costomerToobarDelete'} ];
    wtbgxyConfig.customer_toolbar = [ { name: '匹配', key: 'costomerToobarMatching', func: 'costomerToobarMatching'}, { name: '删除', key: 'costomerToobarDelete', func: 'costomerToobarDelete'} ];
    dlbgfwffpConfig.customer_toolbar = [ { name: '匹配', key: 'costomerToobarMatching', func: 'costomerToobarMatching'}, { name: '删除', key: 'costomerToobarDelete', func: 'costomerToobarDelete'} ];
    qtdzConfig.customer_toolbar = [ { name: '匹配', key: 'costomerToobarMatching', func: 'costomerToobarMatching'}, { name: '删除', key: 'costomerToobarDelete', func: 'costomerToobarDelete'} ];
    ckxshtConfig.layout_type = '';
    ghhtConfig.layout_type = '';
    wmzhfwhtConfig.layout_type = '';
    tydConfig.layout_type = '';
    ysfpConfig.layout_type = '';
    wtbgxyConfig.layout_type = '';
    dlbgfwffpConfig.layout_type = '';
    qtdzConfig.layout_type = '';
  } else if (type === 'search') {
    sfpp = 'Y';
    // 配置项：自定义工具栏
    ckxshtConfig.customer_toolbar = [];
    ghhtConfig.customer_toolbar = [];
    wmzhfwhtConfig.customer_toolbar = [];
    tydConfig.customer_toolbar = [];
    ysfpConfig.customer_toolbar = [];
    wtbgxyConfig.customer_toolbar = [];
    dlbgfwffpConfig.customer_toolbar = [];
    qtdzConfig.customer_toolbar = [];
    ckxshtConfig.layout_type = 'modal';
    ghhtConfig.layout_type = 'modal';
    wmzhfwhtConfig.layout_type = 'modal';
    tydConfig.layout_type = 'modal';
    ysfpConfig.layout_type = 'modal';
    wtbgxyConfig.layout_type = 'modal';
    dlbgfwffpConfig.layout_type = 'modal';
    qtdzConfig.layout_type = 'modal';
  }
  const initSearchModal = [
    { op: 'al', property: 'baqkUuid', value: mainParams?.record?.uuid },
    { op: 'al', property: 'lcswsxDm', value: mainParams?.record?.lcswsxDm },
    { op: 'al', property: 'sfpp', value: sfpp }
    
  ]
  if (ckbgdh) {
    initSearchModal.push({ op: 'al', property: 'ckbgdh', value: ckbgdh })
  }
  ckxshtConfig.gridParams.initSearchModal = ckxshtConfig.gridParams.initSearchModal.concat(initSearchModal);
  ghhtConfig.gridParams.initSearchModal = ghhtConfig.gridParams.initSearchModal.concat(initSearchModal);
  wmzhfwhtConfig.gridParams.initSearchModal = wmzhfwhtConfig.gridParams.initSearchModal.concat(initSearchModal);
  tydConfig.gridParams.initSearchModal = tydConfig.gridParams.initSearchModal.concat(initSearchModal);
  ysfpConfig.gridParams.initSearchModal = ysfpConfig.gridParams.initSearchModal.concat(initSearchModal);
  wtbgxyConfig.gridParams.initSearchModal = wtbgxyConfig.gridParams.initSearchModal.concat(initSearchModal);
  dlbgfwffpConfig.gridParams.initSearchModal = dlbgfwffpConfig.gridParams.initSearchModal.concat(initSearchModal);
  qtdzConfig.gridParams.initSearchModal = qtdzConfig.gridParams.initSearchModal.concat(initSearchModal);

  return (
    <>
      <div className="badz_sjpp_pp_tabs">
        <Tabs activeKey={activeKey} onChange={tabCallback} destroyInactiveTabPane style={{ backgroundColor: 'white' }}>
          <Tabs.TabPane tab="出口销售合同" key="ckxsht" className="ckxsht">
            <DDBunit2 config={ckxshtConfig} func={func} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="购货合同" key="ghht" className="ghht">
            <DDBunit2 config={ghhtConfig} func={func} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="外贸综合服务合同" key="wmzhfwht" className="wmzhfwht">
            <DDBunit2 config={wmzhfwhtConfig} func={func} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="提运单" key="tyd" className="tyd">
            <DDBunit2 config={tydConfig} func={func} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="运输发票" key="ysfp" className="ysfp">
            <DDBunit2 config={ysfpConfig} func={func} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="委托报关协议" key="wtbgxy" className="wtbgxy">
            <DDBunit2 config={wtbgxyConfig} func={func} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="代理报关服务费发票" key="dlbgfwffp" className="dlbgfwffp">
            <DDBunit2 config={dlbgfwffpConfig} func={func} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="其他单证" key="qtdz" className="qtdz">
            <DDBunit2 config={qtdzConfig} func={func} />
          </Tabs.TabPane>
        </Tabs>
      </div>
      <DrawerSpxx onRef={drawerSpxxRef} />
      <ModalBadzyl onRef={modalBadzylRef} mainParams={mainParams} />
      <Preview onRef={previewRef} />
    </>
  )
};

export default BadzylModal;
