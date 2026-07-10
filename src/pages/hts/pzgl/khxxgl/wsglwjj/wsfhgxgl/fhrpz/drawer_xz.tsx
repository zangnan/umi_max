/**
 * title: 付汇人管理-关联境外收货人下钻
 */
import React, { useImperativeHandle, useState } from 'react';
import CONSTANTS from '@/components/DDAssist/constants';
import { Drawer, Spin, message } from 'antd';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import { cloneDeep } from 'lodash';
import { intl as intl2 } from '@/components/DDAssist/util';
import DDAlert from '@/pages/hts/components/DDAlert';
import { deleteFhr } from '@/pages/hts/services/htsApi';


import qyConfig from './config';
import Func from './f_bdjwshr'
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
    c.grid_row_key = 'jwshruuid';  ; // 列表主键，默认uuid
    c.form_save_check = false; // 表单编辑是否执行后端校验
    c.click_checked = '1';
    c.grid_scroll_x = '700px';
    c.layout_type = 'modal';
    c.unit_key = 'PZGL_WSGL_WSFHPZGL_JWSHRXZCX';
    // 配置项：列表列
    c.grid_columns = [
      { title: '规范化境外收货人', dataIndex: 'gfhjwshrmc', width: 200, ellipsis: true },
      { title: '报关单境外收货人', dataIndex: 'jwshrmcpj', width: 200, ellipsis: true },
      { title: '境外收货人别名', dataIndex: 'jwshrbm', width: 200, ellipsis: true },
    ];
    // 配置项：列表筛选项
    c.filter_items = [
      { name: 'gfhjwshrmc', label: '规范化境外收货人', type: 'Input' },
      { name: 'jwshrmcpj', label: '报关单境外收货人', type: 'Input' },
      { name: 'jwshrbm', label: '境外收货人别名', type: 'Input' },
    ];


    c.gridParams = {
      initSearchModal: [
        {property: "fhruuid", value: param?.record?.fhruuid, op: "zdy"},

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
    };

    c.customer_toolbar = [
      { name: '删除', func: 'delBdjwshr' },
    ];

    c.module_type = 'QZ_type';


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

  
  // 删除已绑定境外收货人
Func.delBdjwshr = (param: any) => {
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
      const jwshruuids: any = [];
      selectionRows.forEach((row: any) => {
        jwshruuids.push(row.jwshruuid)
      });
      const fhruuid = initParam?.record?.fhruuid;
      deleteFhr({ jwshruuids,sctype:'gx',fhruuid:fhruuid }).then((response) => {
        DDAlert.close();
        setMasker(false);
        const { code, msg } = response;
        if (code === '200') {
          message.success(intl2.formatMessage({ id: 'message_delete_success' }));
          close();
          refUnit.current!.reload();
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
      title="关联境外收货人"
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
