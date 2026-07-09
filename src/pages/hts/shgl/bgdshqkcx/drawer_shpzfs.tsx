/**
 * title: 报关单收汇情况管理-收汇凭证份数
 */
import React, { useImperativeHandle, useState } from 'react';
import CONSTANTS from '@/components/DDAssist/constants';
import { Drawer, Spin, message } from 'antd';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import { cloneDeep } from 'lodash';

import qyConfig from './bgdshqkconfig';
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
  const [myConfig, setMyconfig] = useState<any>(qyConfig);

  // 开启
  const showModal = (param: any, selectionRowKeys: any ,flag :any) => {
    // 改变默认配置项
    const c = cloneDeep(myConfig);
    c.click_checked = '1';
    c.grid_scroll_x = '1020px';
    c.layout_type = 'modal';
    c.grid_show_serial_number = false; // 是否显示序号，可选
    c.grid_row_key = 'uuid'; // 列表主键，默认uuid
    c.export_key = 'SHGL_BGDSHQK_XZ_DC';
    c.unit_key = 'SHGL_BGDSHQK_XZ';
    c.export_large = true; // tssb_download 配合此导出使用，同步大数据量导出
    // 配置项：列表列
    c.grid_columns = [
      {title: '收汇凭证号', dataIndex: 'shpzh', width: 170, ellipsis: true},
      {title: '收汇日期', dataIndex: 'ckshrq', width: 150, ellipsis: true, render: {type: 'date', format: 'yyyy-MM-DD'},},
      {title: '付汇人', dataIndex: 'fhr', width: 170, ellipsis: true},
      {title: '收汇币制', dataIndex: 'shbzDm', align: 'center', width: 150, ellipsis: true,},
      {title: '收汇金额', dataIndex: 'ckshje', align: 'right', width: 150, ellipsis: true, render: {type: 'number', format: '0,0.00'}},

      {title: '收汇汇率', dataIndex: 'shbzhl', align: 'right', width: 150, ellipsis: true, render: {type: 'number', format: '0,0.00000'}},
      {title: '人民币收汇金额', dataIndex: 'rmbcjzj', align: 'right', width: 150, ellipsis: true, render: {type: 'number', format: '0,0.00'}},
      {title: '匹配币制', dataIndex: 'ppbzDm', width: 140, ellipsis: true , codeTable: 'CODE_DM_ZXSB_PPBZ:01',},
      {title: '匹配成交金额', dataIndex: 'yzje1', align: 'right', width: 150, ellipsis: true, render: {type: 'number', format: '0,0.00'}},
      {title: '匹配人民币金额', dataIndex: 'yzrmbje', align: 'right', width: 150, ellipsis: true, render: {type: 'number', format: '0,0.00'}},

      {
        title: '匹配方式', dataIndex: 'sgppbz', width: 180, align: 'center', codeTable: 'CODE_STATIC_DM_SHGL_PPFS:01',
        filter: {
          type: 'Select',
          codeTable: 'CODE_STATIC_DM_SHGL_PPFS:01'
        },
      },
      {title: '收汇申报提取人民币金额', dataIndex: 'sbrmbje', align: 'right', width: 180, ellipsis: true, render: {type: 'number', format: '0,0.00'}},
    ];
    // 配置项：列表筛选项
    c.filter_items = [
      { name: 'ckshrq', label: '收汇日期', type: 'DatePicker' ,range: true },
      { name: 'shpzh', label: '收汇凭证号', type: 'Input' },
      { name: 'fhr', label: '付汇人', type: 'Input' },
    ];
    const { record } = param;

    c.gridParams = {
      initSearchModal: [
        { property: 'bgdhgbh', value: record.bgdhgbh, op: 'dd' },

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


  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  return (
    <Drawer
      title="收汇情况"
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
