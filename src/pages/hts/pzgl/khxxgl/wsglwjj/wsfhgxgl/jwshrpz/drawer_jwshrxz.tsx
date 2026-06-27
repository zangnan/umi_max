/**
 * title: 境外收货人管理-关联境外收货人下钻
 */
import React, { useImperativeHandle, useState } from 'react';
import CONSTANTS from '@/components/DDAssist/constants';
import { Drawer, Spin, message } from 'antd';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import { cloneDeep } from 'lodash';

import qyConfig from './config';
import Func from './f_bdfhr'
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
  const [myConfig, setMyconfig] = useState<any>(qyConfig);

  // 开启
  const showModal = (param: any, selectionRowKeys: any ,flag :any) => {
    // 改变默认配置项
    const c = cloneDeep(myConfig);
    c.grid_show_serial_number = false; // 是否显示序号，可选
    c.grid_row_key = 'ysjwshruuid';  ; // 列表主键，默认uuid
    c.form_save_check = false; // 表单编辑是否执行后端校验
    c.click_checked = '1';
    c.grid_scroll_x = '700px';
    c.layout_type = 'modal';
    c.unit_key = 'PZGL_WSGL_WSFHPZGL_JWSHR_JWSHRXZCX';
    c.export_key = 'PZGL_WSGL_WSFHPZGL_JWSHR_JWSHRXZCX_DC';
    c.export_large = true; // tssb_download 配合此导出使用，同步大数据量导出
    c.grid_selection_type = false; // 列表首选项类别，默认 checkbox，可选 false radio checkbox

    // 配置项：列表列
    c.grid_columns = [
      { title: '报关单境外收货人', dataIndex: 'jwshrmc', width: 30, ellipsis: true },
    ];
    // 配置项：列表筛选项
    c.filter_items = [
      { name: 'jwshrmc', label: '报关单境外收货人', type: 'Input' },
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
      tssb_download: true,
    };

    c.customer_toolbar = [
    ];


    setMyconfig(c);

    setMainSelectionRowKeys(selectionRowKeys);
    setInitParam(param);
    setModalVisible(true);
  };

  Func.afterReload = (param: any) => {
    const { dataSource, unitRef } = param;
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
    unitRef.current?.setSelectionRowKeys(checkRowKey);  // 设置SelectionRows
    unitRef.current?.setSelectionRows(checkRow);  // 设置SelectionRows
  }

  const close = async () => {
    initParam?.unitRef.current?.reload2();
    setModalVisible(false);
  }


  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  return (
    <Drawer
      title="关联境外收货人"
      className='dd_data_page_modal'
      visible={modalVisible}
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
