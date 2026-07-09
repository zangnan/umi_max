/**
 * title: 付汇人管理-关联付汇人下钻
 */
import React, { useImperativeHandle, useState } from 'react';
import CONSTANTS from '@/components/DDAssist/constants';
import { Drawer, Spin, message } from 'antd';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import { cloneDeep } from 'lodash';

import qyConfig from './config';
import Func from './f_bdfhr'
import { intl as intl2 } from '@/components/DDAssist/util';
import DDAlert from '@/pages/hts/components/DDAlert';
import { deleteJwshr } from '@/pages/hts/services/htsApi';
export interface BdjgProps {
  onRef?: any;
}

const DrawerForm: React.FC<BdjgProps> = ({
  onRef,
}) => {
  const [masker, setMasker] = useState(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [initParam, setInitParam] = useState<any>({});
  const [mainSelectionRowKeys, setMainSelectionRowKeys] = useState<any>({});
  const [myConfig, setMyconfig] = useState<any>();

  // 开启
  const showModal = (param: any, selectionRowKeys: any ,flag :any) => {
    // 改变默认配置项
    const c = cloneDeep(qyConfig);
    c.grid_show_serial_number = false; // 是否显示序号，可选
    c.grid_row_key = 'fhruuid';  ; // 列表主键，默认uuid
    c.form_save_check = false; // 表单编辑是否执行后端校验
    c.click_checked = '1';
    c.grid_scroll_x = '700px';
    c.layout_type = 'modal';
    c.unit_key = 'PZGL_WSGL_WSFHPZGL_FHRXZCX';

    // 配置项：列表列
    c.grid_columns = [
      { title: '付汇人', dataIndex: 'fhr', width: 200, ellipsis: true },
      { title: '付汇人别名', dataIndex: 'fhrbm', width: 200, ellipsis: true },
      { title: '付汇方式', dataIndex: 'shgzDm', width: 200, ellipsis: true,codeTable: 'CODE_DM_ZXSB_SHGZ:01', },
    ];
    // 配置项：列表筛选项
    c.filter_items = [
      { name: 'fhr', label: '付汇人', type: 'Input' },
      { name: 'fhrbm', label: '付汇人别名', type: 'Input' },
      { name: 'shgzDm', label: '付汇方式', type:'Select',showType: '3', 'showSearch': true,'allowClear': true, codeTable: 'CODE_DM_ZXSB_SHGZ:01', },
    ];


    c.gridParams = {
      initSearchModal: [
        {property: "jwshruuid", value: param?.record?.jwshruuid, op: "zdy"},

      ],
    }

    c.grid_handle_columns_default = {
      edit: false,                       	// 是否显示编辑链接，默认关闭
    };

    c.handle_columns = null;


    // 配置项：工具栏
    c.toolbar_default = {
      setting: false,
      full: false,
      reload: false,
    };

    c.customer_toolbar = [
      { name: '删除', func: 'delBdfhr' },
    ];


    setMyconfig(c);

    setMainSelectionRowKeys(selectionRowKeys);
    setInitParam(param);
    setModalVisible(true);
  };

  Func.afterReload = (param: any) => {
    const { dataSource, refUnit } = param;
    const checkRow: any = [];
    const checkRowKey: any = [];
    if(dataSource && dataSource.length > 0 ) {
      dataSource.forEach((item: any) => {
        if(item.checkedStr == '1'){
          checkRow.push(item);
          checkRowKey.push(item.sbqyuuidDqlb);
        }
      });
    }
    refUnit.current?.setSelectionRowKeys(checkRowKey);  // 设置SelectionRows
    refUnit.current?.setSelectionRows(checkRow);  // 设置SelectionRows
  }

  const close = async () => {
    initParam?.refUnit.current?.reload2();
    setModalVisible(false);
  }

   // 删除已绑定付汇人
Func.delBdfhr = (param: any) => {
  const { selectionRows, refUnit } = param;
  // 选择数据条数判断
  if (!selectionRows || selectionRows.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }

  DDAlert.open({
    title: '系统提示',
    info: '确定要删除选择的数据吗？',
    infoType: 'question',
    modalType: 'confirm',
    okCallbackFn: function (thisObj: any) {
      thisObj.setState({ masker: true });
      const fhruuids: any = [];
      selectionRows.forEach((row: any) => {
        fhruuids.push(row.fhruuid)
      });
      const jwshruuid = initParam?.record?.jwshruuid;
      deleteJwshr({ fhruuids,sctype:'gx',jwshruuid:jwshruuid }).then((response) => {
        DDAlert.close();
        setMasker(false);
        const { code, msg } = response;
        if (code === '200') {
          message.success(intl2.formatMessage({ id: 'message_delete_success' }));
          close();
          refUnit.current!.reload2();
        } else {
          message.error(msg);
        }
      })
    },
  });
}


  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  return (
    <Drawer
      title="关联付汇人"
      className='dd_data_page_modal'
      open={modalVisible}
      width={CONSTANTS.C_MODAL_WIDTH_X3}
      destroyOnHidden={true}
      onClose={() => {close()}}
    >
      <Spin tip="Loading..." spinning={masker} delay={100}>
        <DDBunit2 config={myConfig} func={Func} />
      </Spin>
    </Drawer>
  );
};

export default DrawerForm;
