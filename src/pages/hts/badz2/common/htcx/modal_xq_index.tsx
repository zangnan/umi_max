/**
 * title: 备案单证目录
 */
import { Tabs } from 'antd';
import React, { useRef, useState } from 'react';
import '../../style.less';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import func from './modal_xq_func'
import { cloneDeep } from 'lodash';

import ckxsht_config from '../config/ckxsht_config';        // 出口销售合同
import ghht_config from '../config/ghht_config';            // 购货合同
import wmzhfwht_config from '../config/wmzhfwht_config';    // 外贸综合服务合同
import tyd_config from '../config/tyd_config';              // 提运单
import ysfp_config from '../config/ysfp_config';            // 运输发票
import wtbgxy_config from '../config/wtbgxy_config';        // 委托报关协议
import dlbgfwffp_config from '../config/dlbgfwffp_config';  // 代理报关服务费发票
import qtdz_config from '../config/qtdz_config';            // 其他单证

import DrawerSpxx from '../spxx';
import ModalBadzyl from './modal_xq';
import Preview from '../preview';

export type BadzylModal = {
  onRef?: any;
  mainParams: any;
  type?: any
  tabActive?: any
  ckbgdh?: any
  xqOnRef?: any
}

const BadzylModal: React.FC<BadzylModal> = ({
  onRef,
  mainParams,
  type,
  tabActive = 'ckxsht',
  ckbgdh,
  xqOnRef
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
    otherRef.push(xqOnRef);
    return otherRef;
  };

  let ckxshtConfig = cloneDeep(ckxsht_config);        // 出口销售合同
  ckxshtConfig.grid_columns = ckxshtConfig.grid_columns.filter(
    (    column: { dataIndex: string; }) => column.dataIndex !== 'ppfsDm'
  ); 
  let ghhtConfig = cloneDeep(ghht_config);            // 购货合同
  ghhtConfig.grid_columns = ghhtConfig.grid_columns.filter(
    (    column: { dataIndex: string; }) => column.dataIndex !== 'ppfsDm'
  );
  let wmzhfwhtConfig = cloneDeep(wmzhfwht_config);    // 外贸综合服务合同
  wmzhfwhtConfig.grid_columns = wmzhfwhtConfig.grid_columns.filter(
    (    column: { dataIndex: string; }) => column.dataIndex !== 'ppfsDm'
  );
  let tydConfig = cloneDeep(tyd_config);              // 提运单
  tydConfig.grid_columns = tydConfig.grid_columns.filter(
    (    column: { dataIndex: string; }) => column.dataIndex !== 'ppfsDm'
  );
  let ysfpConfig = cloneDeep(ysfp_config);            // 运输发票
  ysfpConfig.grid_columns = ysfpConfig.grid_columns.filter(
    (    column: { dataIndex: string; }) => column.dataIndex !== 'ppfsDm'
  );
  let wtbgxyConfig = cloneDeep(wtbgxy_config);        // 委托报关协议
  wtbgxyConfig.grid_columns = wtbgxyConfig.grid_columns.filter(
    (    column: { dataIndex: string; }) => column.dataIndex !== 'ppfsDm'
  );
  let dlbgfwffpConfig = cloneDeep(dlbgfwffp_config);  // 代理报关服务费发票
  dlbgfwffpConfig.grid_columns = dlbgfwffpConfig.grid_columns.filter(
    (    column: { dataIndex: string; }) => column.dataIndex !== 'ppfsDm'
  );
  let qtdzConfig = cloneDeep(qtdz_config);            // 其他单证
  qtdzConfig.grid_columns = qtdzConfig.grid_columns.filter(
    (    column: { dataIndex: string; }) => column.dataIndex !== 'ppfsDm'
  );

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
