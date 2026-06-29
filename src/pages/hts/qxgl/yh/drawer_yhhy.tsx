/**
 * title: 用户管理-绑定企业
 * author: wx
 */
import React, { useImperativeHandle, useState } from 'react';
import CONSTANTS from '@/components/DDAssist/constants';
import { Drawer, Spin, Table, Button, message } from 'antd';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import { yhhy } from '@/pages/hts/services/htsApi';
import { intl as intl2 } from '@/components/DDAssist/util';

export interface BdjgProps {
  onRef?: any;
}

const DrawerForm: React.FC<BdjgProps> = ({
  onRef,
}) => {
  const [masker, setMasker] = useState(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [initParam, setInitParam] = useState<any>();

  // 开启
  const showModal = (param: any, selectionRowKeys: any) => {
    setModalVisible(true);
    setInitParam(param);
  };


  const close = async () => {
    initParam?.unitRef?.current?.reload2();
    setModalVisible(false);
  }


  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  const unitConfig: any = {};

  // 配置项
  unitConfig.unit_key = 'CX_SAAS_QXGL_YHGL_YHHY';                                         // 业务单元key，对应后端接口
  unitConfig.grid_show_serial_number = false; // 是否显示序号，可选
  unitConfig.grid_row_key = 'yhuuid1Dqlb'; // 列表主键，默认uuid
  unitConfig.form_save_check = false; // 表单编辑是否执行后端校验
  unitConfig.click_checked = '1';
  unitConfig.batch_delete_key = 'yhuuid1s';


  // 配置项：列表列
  unitConfig.grid_columns = [
    { title: '登录账号', dataIndex: 'yddh', width: 140, ellipsis: true , fixed: 'left'},
    { title: '姓名', dataIndex: 'xm', width: 140, ellipsis: true , fixed: 'left'},
    { title: '证件号', dataIndex: 'sfzjhm', width: 140, ellipsis: true },
    { title: '用户类型', dataIndex: 'yhlxDm', width: 80, codeTable: 'code_dm_gy_yhlx:01',  filter: {
      type: 'Select',
      codeTable: 'code_dm_gy_yhlx:01',
    } },
    { title: '角色名称', dataIndex: 'jsmc',width: 140, ellipsis: true },
    {
      title: '有效标志', dataIndex: 'yxbz', width: 100, codeTable: 'code_static_yes_no:01', filter: {
        type: 'Select',
        codeTable: 'code_static_yes_no:01'
      },
    },
    { title: '用户来源', dataIndex: 'qdDm', width: 140, ellipsis: true , codeTable: 'CODE_QX_QD:01' },
    { title: '录入人姓名', dataIndex: 'lrrxm', width: 140, ellipsis: true },
  ];

  // 配置项：列表筛选项
  unitConfig.filter_items = [
    { name: 'yddh', label: '登录账号', type: 'Input' },
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
    unitRef.current!.setMasker(true);
    if (!selectionRowKeys || selectionRowKeys.length === 0) {
      message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
      unitRef.current!.setMasker(false);
      return;
    }
    const params = {
      yhuuid1s:selectionRowKeys
    }
    yhhy(params).then((res: any) => {
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
      title="用户还原"
      className='dd_data_page_modal'
      visible={modalVisible}
      width={CONSTANTS.C_MODAL_WIDTH_X4}
      destroyOnHidden={true}
      onClose={() => { close() }}
    >
      <Spin tip="Loading..." spinning={masker} key={'sjdrspin'} delay={100}>
        <DDBunit2 config={unitConfig} func={f} />
      </Spin>
    </Drawer>
  );
};

export default DrawerForm;
