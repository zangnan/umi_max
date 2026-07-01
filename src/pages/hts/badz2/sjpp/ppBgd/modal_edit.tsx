/**
 * title: 备案单证目录
 */
import { Modal, Button, Tabs } from 'antd';
import React, { useRef, useState, useImperativeHandle } from 'react';
import CONSTANTS from '@/components/DDAssist/constants';
import { CloseOutlined } from '@ant-design/icons';
import '../../style.less';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import func from './modalEditFunc'
import { cloneDeep } from 'lodash';

import ckxsht_config from '../../common/config/ckxsht_config';        // 出口销售合同
import ghht_config from '../../common/config/ghht_config';            // 购货合同
import wmzhfwht_config from '../../common/config/wmzhfwht_config';    // 外贸综合服务合同
import tyd_config from '../../common/config/tyd_config';              // 提运单
import ysfp_config from '../../common/config/ysfp_config';            // 运输发票
import wtbgxy_config from '../../common/config/wtbgxy_config';        // 委托报关协议
import dlbgfwffp_config from '../../common/config/dlbgfwffp_config';  // 代理报关服务费发票
import qtdz_config from '../../common/config/qtdz_config';            // 其他单证

import DrawerSpxx from '../../common/spxx';
import Preview from '../../common/preview';


export type BadzylModal = {
  visible?: any;
  onRef?: any;
  mainParams: any
}

const BadzylModal: React.FC<BadzylModal> = ({
  visible = false,
  onRef,
  mainParams
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [bgdParam, setBgdParam] = useState<any>({});

  const topRef: any = useRef();
  const bottomRef: any = useRef();
  
  const drawerSpxxRef: any = useRef();
  const previewRef: any = useRef();

  let ckxshtConfigTop = cloneDeep(ckxsht_config);           // 出口销售合同（已匹配）
  let ghhtConfigTop = cloneDeep(ghht_config);               // 购货合同（已匹配）
  let wmzhfwhtConfigTop = cloneDeep(wmzhfwht_config);       // 外贸综合服务合同（已匹配）
  let tydConfigTop = cloneDeep(tyd_config);                 // 提运单（已匹配）
  let ysfpConfigTop = cloneDeep(ysfp_config);               // 运输发票（已匹配）
  let wtbgxyConfigTop = cloneDeep(wtbgxy_config);           // 委托报关协议（已匹配）
  let dlbgfwffpConfigTop = cloneDeep(dlbgfwffp_config);     // 代理报关服务费发票（已匹配）
  let qtdzConfigTop = cloneDeep(qtdz_config);               // 其他单证（已匹配）
  // 配置项：表单标题
  ckxshtConfigTop.grid_title = `已匹配单证（${bgdParam?.record?.ckbgdh}）`;
  ghhtConfigTop.grid_title = `已匹配单证（${bgdParam?.record?.ckbgdh}）`;
  wmzhfwhtConfigTop.grid_title = `已匹配单证（${bgdParam?.record?.ckbgdh}）`;
  tydConfigTop.grid_title = `已匹配单证（${bgdParam?.record?.ckbgdh}）`;
  ysfpConfigTop.grid_title = `已匹配单证（${bgdParam?.record?.ckbgdh}）`;
  wtbgxyConfigTop.grid_title = `已匹配单证（${bgdParam?.record?.ckbgdh}）`;
  dlbgfwffpConfigTop.grid_title = `已匹配单证（${bgdParam?.record?.ckbgdh}）`;
  qtdzConfigTop.grid_title = `已匹配单证（${bgdParam?.record?.ckbgdh}）`;
  // 配置项：自定义工具栏
  ckxshtConfigTop.customer_toolbar = [ { name: '删除', key: 'costomerToobarDelete', func: 'costomerToobarDelete'} ];
  ghhtConfigTop.customer_toolbar = [ { name: '删除', key: 'costomerToobarDelete', func: 'costomerToobarDelete'} ];
  wmzhfwhtConfigTop.customer_toolbar = [ { name: '删除', key: 'costomerToobarDelete', func: 'costomerToobarDelete'} ];
  tydConfigTop.customer_toolbar = [ { name: '删除', key: 'costomerToobarDelete', func: 'costomerToobarDelete'} ];
  ysfpConfigTop.customer_toolbar = [ { name: '删除', key: 'costomerToobarDelete', func: 'costomerToobarDelete'} ];
  wtbgxyConfigTop.customer_toolbar = [ { name: '删除', key: 'costomerToobarDelete', func: 'costomerToobarDelete'} ];
  dlbgfwffpConfigTop.customer_toolbar = [ { name: '删除', key: 'costomerToobarDelete', func: 'costomerToobarDelete'} ];
  qtdzConfigTop.customer_toolbar = [ { name: '删除', key: 'costomerToobarDelete', func: 'costomerToobarDelete'} ];
  // 配置项：默认筛选条件
  const initSearchModalTop = [
    { op: 'al', property: 'baqkUuid', value: mainParams?.record?.uuid },
    { op: 'al', property: 'lcswsxDm', value: mainParams?.record?.lcswsxDm },
    { op: 'al', property: 'ckbgdh', value: bgdParam?.record?.ckbgdh },
    { op: 'al', property: 'sfpp', value: 'Y' },
  ]
  ckxshtConfigTop.gridParams.initSearchModal = ckxshtConfigTop.gridParams.initSearchModal.concat(initSearchModalTop);
  ghhtConfigTop.gridParams.initSearchModal = ghhtConfigTop.gridParams.initSearchModal.concat(initSearchModalTop);
  wmzhfwhtConfigTop.gridParams.initSearchModal = wmzhfwhtConfigTop.gridParams.initSearchModal.concat(initSearchModalTop);
  tydConfigTop.gridParams.initSearchModal = tydConfigTop.gridParams.initSearchModal.concat(initSearchModalTop);
  ysfpConfigTop.gridParams.initSearchModal = ysfpConfigTop.gridParams.initSearchModal.concat(initSearchModalTop);
  wtbgxyConfigTop.gridParams.initSearchModal = wtbgxyConfigTop.gridParams.initSearchModal.concat(initSearchModalTop);
  dlbgfwffpConfigTop.gridParams.initSearchModal = dlbgfwffpConfigTop.gridParams.initSearchModal.concat(initSearchModalTop);
  qtdzConfigTop.gridParams.initSearchModal = qtdzConfigTop.gridParams.initSearchModal.concat(initSearchModalTop);

  let ckxshtConfigBottom = cloneDeep(ckxsht_config);        // 出口销售合同（未匹配）
  ckxshtConfigBottom.grid_columns = ckxshtConfigBottom.grid_columns.filter(
    (    column: { dataIndex: string; }) => column.dataIndex !== 'ppfsDm'
  );      
  let ghhtConfigBottom = cloneDeep(ghht_config);            // 购货合同（未匹配）
  ghhtConfigBottom.grid_columns = ghhtConfigBottom.grid_columns.filter(
    (    column: { dataIndex: string; }) => column.dataIndex !== 'ppfsDm'
  );
  let wmzhfwhtConfigBottom = cloneDeep(wmzhfwht_config);    // 外贸综合服务合同（未匹配）
  wmzhfwhtConfigBottom.grid_columns = wmzhfwhtConfigBottom.grid_columns.filter(
    (    column: { dataIndex: string; }) => column.dataIndex !== 'ppfsDm'
  );
  let tydConfigBottom = cloneDeep(tyd_config);              // 提运单（未匹配）
  tydConfigBottom.grid_columns = tydConfigBottom.grid_columns.filter(
    (    column: { dataIndex: string; }) => column.dataIndex !== 'ppfsDm'
  );
  let ysfpConfigBottom = cloneDeep(ysfp_config);            // 运输发票（未匹配）
  ysfpConfigBottom.grid_columns = ysfpConfigBottom.grid_columns.filter(
    (    column: { dataIndex: string; }) => column.dataIndex !== 'ppfsDm'
  );
  let wtbgxyConfigBottom = cloneDeep(wtbgxy_config);        // 委托报关协议（未匹配）
  wtbgxyConfigBottom.grid_columns = wtbgxyConfigBottom.grid_columns.filter(
    (    column: { dataIndex: string; }) => column.dataIndex !== 'ppfsDm'
  );
  let dlbgfwffpConfigBottom = cloneDeep(dlbgfwffp_config);  // 代理报关服务费发票（未匹配）
  dlbgfwffpConfigBottom.grid_columns = dlbgfwffpConfigBottom.grid_columns.filter(
    (    column: { dataIndex: string; }) => column.dataIndex !== 'ppfsDm'
  );
  let qtdzConfigBottom = cloneDeep(qtdz_config);            // 其他单证（未匹配）
  qtdzConfigBottom.grid_columns = qtdzConfigBottom.grid_columns.filter(
    (    column: { dataIndex: string; }) => column.dataIndex !== 'ppfsDm'
  );
  // 配置项：表单标题
  ckxshtConfigBottom.grid_title = `未匹配单证`;
  ghhtConfigBottom.grid_title = `未匹配单证`;
  wmzhfwhtConfigBottom.grid_title = `未匹配单证`;
  tydConfigBottom.grid_title = `未匹配单证`;
  ysfpConfigBottom.grid_title = `未匹配单证`;
  wtbgxyConfigBottom.grid_title = `未匹配单证`;
  dlbgfwffpConfigBottom.grid_title = `未匹配单证`;
  qtdzConfigBottom.grid_title = `未匹配单证`;
  // 配置项：自定义工具栏
  ckxshtConfigBottom.customer_toolbar = [ { name: '保存', key: 'costomerToobarSave', func: 'costomerToobarSave'} ];
  ghhtConfigBottom.customer_toolbar = [ { name: '保存', key: 'costomerToobarSave', func: 'costomerToobarSave'} ];
  wmzhfwhtConfigBottom.customer_toolbar = [ { name: '保存', key: 'costomerToobarSave', func: 'costomerToobarSave'} ];
  tydConfigBottom.customer_toolbar = [ { name: '保存', key: 'costomerToobarSave', func: 'costomerToobarSave'} ];
  ysfpConfigBottom.customer_toolbar = [ { name: '保存', key: 'costomerToobarSave', func: 'costomerToobarSave'} ];
  wtbgxyConfigBottom.customer_toolbar = [ { name: '保存', key: 'costomerToobarSave', func: 'costomerToobarSave'} ];
  dlbgfwffpConfigBottom.customer_toolbar = [ { name: '保存', key: 'costomerToobarSave', func: 'costomerToobarSave'} ];
  qtdzConfigBottom.customer_toolbar = [ { name: '保存', key: 'costomerToobarSave', func: 'costomerToobarSave'} ];
  // 配置项：默认筛选条件
  const initSearchModalBottom = [
    { op: 'al', property: 'baqkUuid', value: mainParams?.record?.uuid },
    { op: 'al', property: 'lcswsxDm', value: mainParams?.record?.lcswsxDm },
    { op: 'al', property: 'ckbgdh', value: bgdParam?.record?.ckbgdh },
    { op: 'al', property: 'sfpp', value: 'N' },
  ]
  ckxshtConfigBottom.gridParams.initSearchModal = ckxshtConfigBottom.gridParams.initSearchModal.concat(initSearchModalBottom);
  ghhtConfigBottom.gridParams.initSearchModal = ghhtConfigBottom.gridParams.initSearchModal.concat(initSearchModalBottom);
  wmzhfwhtConfigBottom.gridParams.initSearchModal = wmzhfwhtConfigBottom.gridParams.initSearchModal.concat(initSearchModalBottom);
  tydConfigBottom.gridParams.initSearchModal = tydConfigBottom.gridParams.initSearchModal.concat(initSearchModalBottom);
  ysfpConfigBottom.gridParams.initSearchModal = ysfpConfigBottom.gridParams.initSearchModal.concat(initSearchModalBottom);
  wtbgxyConfigBottom.gridParams.initSearchModal = wtbgxyConfigBottom.gridParams.initSearchModal.concat(initSearchModalBottom);
  dlbgfwffpConfigBottom.gridParams.initSearchModal = dlbgfwffpConfigBottom.gridParams.initSearchModal.concat(initSearchModalBottom);
  qtdzConfigBottom.gridParams.initSearchModal = qtdzConfigBottom.gridParams.initSearchModal.concat(initSearchModalBottom);
  

  func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(mainParams);
    otherRef.push(bgdParam);
    otherRef.push({ topRef, bottomRef });
    otherRef.push(drawerSpxxRef);
    otherRef.push(previewRef);

    return otherRef;
  };

  // 开启
  const showModal = (param: any) => {
    setBgdParam(param);
    setModalVisible(true);
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  const closeModalVisible = () => {
    setModalVisible(false)
  }

  return (
    <>
      <Modal
        title={`匹配备案单证`}
        centered
        destroyOnHidden
        open={modalVisible}
        width={CONSTANTS.C_MODAL_WIDTH_X4}
        wrapClassName='standard-modal-1'
        zIndex={999}
        mask={{ closable: false }}
        footer={
          <>
            <Button onClick={closeModalVisible} icon={<CloseOutlined />} type="default">关闭</Button>
          </>
        }
        onCancel={closeModalVisible}
      >
        <div className="dd_grid_view_setting_wrap">
          <Tabs defaultActiveKey="ckxsht" destroyInactiveTabPane>
            <Tabs.TabPane tab="出口销售合同" key="ckxsht" className="ckxsht">
              <DDBunit2 config={ckxshtConfigTop} func={func} onRef={topRef} />
              <DDBunit2 config={ckxshtConfigBottom} func={func} onRef={bottomRef} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="购货合同" key="ghht" className="ghht">
              <DDBunit2 config={ghhtConfigTop} func={func} onRef={topRef} />
              <DDBunit2 config={ghhtConfigBottom} func={func} onRef={bottomRef} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="外贸综合服务合同" key="wmzhfwht" className="wmzhfwht">
              <DDBunit2 config={wmzhfwhtConfigTop} func={func} onRef={topRef} />
              <DDBunit2 config={wmzhfwhtConfigBottom} func={func} onRef={bottomRef} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="提运单" key="tyd" className="tyd">
              <DDBunit2 config={tydConfigTop} func={func} onRef={topRef} />
              <DDBunit2 config={tydConfigBottom} func={func} onRef={bottomRef} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="运输发票" key="ysfp" className="ysfp">
              <DDBunit2 config={ysfpConfigTop} func={func} onRef={topRef} />
              <DDBunit2 config={ysfpConfigBottom} func={func} onRef={bottomRef} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="委托报关协议" key="wtbgxy" className="wtbgxy">
              <DDBunit2 config={wtbgxyConfigTop} func={func} onRef={topRef} />
              <DDBunit2 config={wtbgxyConfigBottom} func={func} onRef={bottomRef} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="代理报关服务费发票" key="dlbgfwffp" className="dlbgfwffp">
              <DDBunit2 config={dlbgfwffpConfigTop} func={func} onRef={topRef} />
              <DDBunit2 config={dlbgfwffpConfigBottom} func={func} onRef={bottomRef} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="其他单证" key="qtdz" className="qtdz">
              <DDBunit2 config={qtdzConfigTop} func={func} onRef={topRef} />
              <DDBunit2 config={qtdzConfigBottom} func={func} onRef={bottomRef} />
            </Tabs.TabPane>
          </Tabs>
        </div>
        <DrawerSpxx onRef={drawerSpxxRef} />
        <Preview onRef={previewRef} />
      </Modal>
    </>
  )
};

export default BadzylModal;
