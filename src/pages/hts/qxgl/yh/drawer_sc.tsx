/**
 * title: 用户管理-绑定企业
 * author: wx
 */
import React, { useImperativeHandle, useState } from 'react';
import CONSTANTS from '@/components/DDAssist/constants';
import { Drawer, Form, Table, Button, message } from 'antd';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import { retrieveYh } from '@/pages/hts/services/htsApi';
import { intl as intl2 } from '@/components/DDAssist/util';

export interface BdjgProps {
  onRef?: any;
}

const DrawerForm: React.FC<BdjgProps> = ({
  onRef,
}) => {
  const [formCommonFilter] = Form.useForm();
  const [masker, setMasker] = useState(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [initParam, setInitParam] = useState<any>();

  const [data, setData] = useState<any>([]);

  // 开启
  const showModal = (param: any, selectionRowKeys: any) => {
    setModalVisible(true);
    setInitParam(param);
  };


  const close = async () => {
    setModalVisible(false);
  }


  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  const unitConfig: any = {};

  // 配置项
  unitConfig.unit_key = 'CX_SAAS_QXGL_YSCYH';                                         // 业务单元key，对应后端接口
  unitConfig.grid_show_serial_number = false; // 是否显示序号，可选
  unitConfig.grid_row_key = 'yhuuid1Dqlb'; // 列表主键，默认uuid
  unitConfig.form_save_check = false; // 表单编辑是否执行后端校验
  unitConfig.click_checked = '1';
  // unitConfig.module_type = 'sjbb';      



  // 配置项：列表列
  unitConfig.grid_columns = [
    { title: '用户uuid主键', dataIndex: 'yhuuid1Dqlb', width: 140, ellipsis: true, fixed: 'left' },
    { title: '用户类型代码', dataIndex: 'yhlxDm', width: 140, ellipsis: true, fixed: 'left' },
    { title: '姓名', dataIndex: 'xm', width: 100, ellipsis: true },
    { title: '登录账号', dataIndex: 'yddh', width: 100, ellipsis: true },
    { title: '角色名称', dataIndex: 'jsmc', width: 140, ellipsis: true },
    { title: '用户授权代码', dataIndex: 'sqztDm', width: 100, align: 'left', codeTable: 'code_static_yh_sqdm:02'},
    { title: '身份证件号码', dataIndex: 'sfzjhm', width: 100, align: 'left', ellipsis: true},
  ];

  // 配置项：列表筛选项
  unitConfig.filter_items = [
    { name: 'sqztDm', label: '用户授权', type: 'Input' },
    { name: 'yhfhcx', label: '用户复合查询', type: 'Select' ,codeTable: 'code_static_yh_sqdm:02'},
  ];
  // 配置项：自定义工具栏
  unitConfig.customer_toolbar = [
    { name: '确认还原', func: 'qrhy' },
  ];
  // 配置项：工具栏
  unitConfig.toolbar_default = {
    setting: true,
    full: true,
    reload: true,
    delete: false,
  };

  const f: any = {
    unitRef: React.createRef(),
  };

  //  确认还原
  f.qrhy=(param :any)=>{
    const {selectionRowKeys,otherRef,unitRef} = param;
    if (!selectionRowKeys || selectionRowKeys.length === 0) {
      message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
      return;
    }
    const params = {
      yhuuid1Dqlb:selectionRowKeys
    }
    unitRef.current!.setMasker(true);
    retrieveYh(params).then((res: any) => {
      unitRef.current!.setMasker(false);
      const { code, msg } = res;
      if (code == '200') {
        close();
        message.success("还原成功！");
      } else {
        message.error(msg)
      }
    });
  }

  return (
    <Drawer
      title="撤销删除"
      className='dd_data_page_modal'
      visible={modalVisible}
      width={CONSTANTS.C_MODAL_WIDTH_X4}
      destroyOnHidden={true}
      onClose={() => { close() }}
    >
      <DDBunit2 config={unitConfig} func={f} />
    </Drawer>
  );
};

export default DrawerForm;
