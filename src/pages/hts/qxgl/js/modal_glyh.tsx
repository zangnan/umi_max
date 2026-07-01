/**
 * title: 用户管理-绑定企业
 * author: wx
 */
import React, { useImperativeHandle, useState } from 'react';
import CONSTANTS from '@/components/DDAssist/constants';
import { Modal, Button } from 'antd';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import Func from './f_glyh'

export interface BdjgProps {
  onRef?: any;
}

const ModalForm: React.FC<BdjgProps> = ({
  onRef,
}) => {
  // 改变默认配置项
  const config: any = {};
  // 配置项
  config.api_grid_query = `/yw/dditSaas/qxjs/queryJsYhList`;
  config.grid_show_serial_number = false; // 是否显示序号，可选
  config.grid_row_key = 'yhuuid1Dqlb'; // 列表主键，默认uuid
  config.show_toolbar = false; // 是否开启工具栏，默认true显示
  config.grid_selection_type = false;                         // 列表首选项类别，默认 checkbox，可选 false radio checkbox
  config.pagination2 = false;

  // 配置项：列表列
  config.grid_columns = [
    { title: '登录账号', dataIndex: 'yddh', width: 170, ellipsis: true },
    { title: '姓名', dataIndex: 'xm', ellipsis: true },
    { title: '证件号', dataIndex: 'sfzjhm', width: 170, ellipsis: true },
    { title: '用户类型', dataIndex: 'yhlxDm', width: 80, codeTable: 'code_dm_gy_yhlx:01' },
    { title: '启用停用', dataIndex: 'yxbz', width: 80, render: { func: 'renderYxbz' } },
  ];
  // 配置项：工具栏
  config.toolbar_default = {
    setting: true,
    full: false,
    reload: false,
  };
  config.layout_type = 'modal';                                                     // 页面类型，默认default 可选 default modal tabs

  // 配置项：自定义工具栏
  config.customer_toolbar = [
  ];

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [myConfig, setConfig] = useState(config);

  // 开启
  const showModal = (param: any) => {
    const { record } = param;
    config.gridParams = {
      initSearchModal: [
        { property: 'jsDm', value: record.jsDm, op: 'dd' },
      ],
    }
    setConfig(config);
    setModalVisible(true);
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  return (
    <Modal
      title="关联用户"
      open={modalVisible}
      width={CONSTANTS.C_MODAL_WIDTH_X3}
      onCancel={() => setModalVisible(false)}
      footer={(<>
        <Button onClick={() => setModalVisible(false)} type="default">关闭</Button>
      </>)}
    >
      <DDBunit2 config={myConfig} func={Func} />
    </Modal>
  );
};

export default ModalForm;
