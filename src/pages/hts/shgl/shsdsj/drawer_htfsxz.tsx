/**
 * title: 收汇水单-合同份数下钻
 */
import React, { useImperativeHandle, useState } from 'react';
import CONSTANTS from '@/components/DDAssist/constants';
import { Drawer, Spin, message } from 'antd';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import { cloneDeep } from 'lodash';

import qyConfig from './config';
import Func from './f'
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
  const [myConfig, setMyconfig] = useState<any>({});
  const [myFunc, setMyFunc] = useState<any>();


  // 开启
  const showModal = (param: any, selectionRowKeys: any ,flag :any) => {
    // 改变默认配置项
    const c = cloneDeep(qyConfig);
    c.grid_show_serial_number = false; // 是否显示序号，可选
    c.grid_row_key = 'uuid';  ; // 列表主键，默认uuid
    c.form_save_check = false; // 表单编辑是否执行后端校验
    c.click_checked = '1';
    c.grid_scroll_x = '700px';
    c.layout_type = 'modal';
    c.unit_key = 'CX_SHGL_SHSDSJ_SHSDSJCX_HTXZ';
    c.export_large = true; // tssb_download 配合此导出使用，同步大数据量导出
    c.export_key = 'CX_SHGL_SHSDSJ_SHSDSJCX_HTXZ_DC';
    // 配置项：列表列
    c.grid_columns = [
      { title: '业务号', dataIndex: 'htxyh', align: 'center',width: 200, ellipsis: true },
      { title: '占用收汇金额', dataIndex: 'ckshje',align: 'right', width: 150, ellipsis: true,render: { type: 'number', format: '0,0.00' } },
      { title: '匹配标志', dataIndex: 'ppbz',align: 'center', width: 80, ellipsis: true, codeTable: 'code_static_yes_no:01', filter: {
        type: 'Select',
        codeTable: 'code_static_yes_no:01'
      } },
      { title: '数据来源', dataIndex: 'ywsjlyDm',align: 'center', width: 120, ellipsis: true, codeTable: 'code_dm_zxsb_ywsjly:01', filter: {
        type: 'Select',
        codeTable: 'code_dm_zxsb_ywsjly:01'
      }},

    ];
    // 配置项：列表筛选项
    c.filter_items = [
      { name: 'htxyh', label: '业务号', type: 'Input' },
    ];


    c.gridParams = {
      initSearchModal: [
        {property: "shpzh", value: param?.record?.shpzh, op: "zdy"},

      ],
    }

    c.grid_handle_columns_default = {
      edit: false,                       	// 是否显示编辑链接，默认关闭
    };


    // 配置项：工具栏
    c.toolbar_default = {
      setting: false,
      full: false,
      reload: false,
      tssb_download: true,
    };

    c.customer_toolbar = [
    ];

    c.handle_columns=null;

    const f1 = cloneDeep(Func);
    setMyFunc(f1);
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
    initParam?.refUnit.current?.reload();
    setModalVisible(false);
  }


  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  return (
    <Drawer
      title="关联关系"
      className='dd_data_page_modal'
      open={modalVisible}
      width={CONSTANTS.C_MODAL_WIDTH_X3}
      destroyOnHidden={true}
      onClose={() => {close()}}
    >
      <Spin tip="Loading..." spinning={masker} delay={100}>
        <DDBunit2 config={myConfig} func={myFunc} />
      </Spin>
    </Drawer>
  );
};

export default DrawerForm;
