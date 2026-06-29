/**
 * title: 收汇水单-关单份数下钻
 */
import React, { useImperativeHandle, useState } from 'react';
import CONSTANTS from '@/components/DDAssist/constants';
import { Drawer, Spin } from 'antd';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
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
  const [myConfig, setMyconfig] = useState<any>();
  const [myFun, setMyFunc] = useState<any>();


  // 开启
  const showModal = (param: any,) => {
    // 改变默认配置项
    const c = cloneDeep(qyConfig);
    c.grid_show_serial_number = false; // 是否显示序号，可选
    c.grid_row_key = 'uuid'; // 列表主键，默认uuid
    c.form_save_check = false; // 表单编辑是否执行后端校验
    c.click_checked = '1';
    c.grid_scroll_x = '1020px';
    c.layout_type = 'modal';
    c.unit_key = 'CX_SHGL_SHSDSJ_SHSDSJCX_GDXZ';
    c.export_large = true; // tssb_download 配合此导出使用，同步大数据量导出
    c.export_key = 'CX_SHGL_SHSDSJ_SHSDSJCX_GDXZ_DC';
    // 配置项：列表列
    c.grid_columns = [
      { title: '出口报关单号', dataIndex: 'bgdhgbh', width: 170, ellipsis: true },
      { title: '合同协议号', dataIndex: 'htxyh', width: 170, ellipsis: true },
      { title: '境外收货人', dataIndex: 'jwshrmc', width: 170, ellipsis: true },
      { title: '出口日期', dataIndex: 'ckrq1',  width: 150,ellipsis: true,render: { type: 'date', format: 'yyyy-MM-DD' },  },
      { title: '成交币制', dataIndex: 'cjhbzmDm',  align: 'center', width: 150, ellipsis: true, },
      { title: '成交金额', dataIndex: 'cjzj',  align: 'right', width: 150, ellipsis: true,render: { type: 'number', format: '0,0.00' } },

      { title: '原币汇率', dataIndex: 'cjhbhl',  align: 'right', width: 150, ellipsis: true,render: { type: 'number', format: '0,0.00000' } },
      { title: '人民币成交金额', dataIndex: 'rmbcjzj',  align: 'right', width: 150, ellipsis: true,render: { type: 'number', format: '0,0.00' } },
      { title: '匹配币制', dataIndex: 'ppbzDm', width: 100, ellipsis: true, codeTable: 'CODE_DM_ZXSB_PPBZ:01' },

      { title: '匹配成交金额', dataIndex: 'yzje1',  align: 'right', width: 150, ellipsis: true,render: { type: 'number', format: '0,0.00' } },
      { title: '匹配人民币金额', dataIndex: 'yzrmbje',  align: 'right', width: 150, ellipsis: true,render: { type: 'number', format: '0,0.00' } },
      { title: '匹配方式', dataIndex: 'sgppbz', width: 180,  align: 'center',codeTable: 'CODE_STATIC_DM_SHGL_PPFS:01',
        filter: {
        type: 'Select',
        codeTable: 'CODE_STATIC_DM_SHGL_PPFS:01'
      },},
      { title: '收汇申报提取人民币金额', dataIndex: 'sbrmbje',  align: 'right', width: 180, ellipsis: true,render: { type: 'number', format: '0,0.00' } },
    ];
    // 配置项：列表筛选项
    c.filter_items = [
      { name: 'bgdhgbh', label: '出口报关单号', type: 'Input' },
      { name: 'htxyh', label: '合同协议号', type: 'Input' },
      { name: 'jwshrmc', label: '境外收货人', type: 'Input' },
    { name: 'ckrq1', label: '出口日期', type: 'DatePicker' ,range: true },
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

    const f2 = cloneDeep(Func);
    setMyFunc(f2);
    setMyconfig(c);
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
    unitRef?.current?.setSelectionRowKeys(checkRowKey);  // 设置SelectionRows
    unitRef?.current?.setSelectionRows(checkRow);  // 设置SelectionRows
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
      title="关联关系"
      className='dd_data_page_modal'
      visible={modalVisible}
      width={CONSTANTS.C_MODAL_WIDTH_X3}
      destroyOnHidden={true}
      onClose={() => {close()}}
    >
      <Spin tip="Loading..." spinning={masker} delay={100}>
        <DDBunit2 config={myConfig} func={myFun} />
      </Spin>
    </Drawer>
  );
};

export default DrawerForm;
