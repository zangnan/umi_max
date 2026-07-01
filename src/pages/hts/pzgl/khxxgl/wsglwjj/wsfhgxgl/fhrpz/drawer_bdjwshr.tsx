/**
 * title: 付汇人管理-关联境外收汇人
 */
import React, { useImperativeHandle, useState } from 'react';
import CONSTANTS from '@/components/DDAssist/constants';
import { Drawer, Spin, message } from 'antd';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import qyConfig from './config';
import Func from './f_bdjwshr'
import { fhrBdJwshr } from '@/pages/hts/services/htsApi';
import { cloneDeep } from 'lodash';

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

  let fhruuid:any = [];
  // 开启
  const showModal = (param: any, selectionRowKeys: any ,flag :any) => {
     fhruuid = param?.selectionRows[0]?.fhruuid ;
    // 改变默认配置项
    const c = cloneDeep(qyConfig);
    // c.api_grid_query = `/yw/pzgl/wsgl/wsfhgxgl/gljwshrQuery`;        // api 列表查询
    c.grid_show_serial_number = false; // 是否显示序号，可选
    c.grid_row_key = 'jwshruuid';  ; // 列表主键，默认uuid
    c.form_save_check = false; // 表单编辑是否执行后端校验
    c.click_checked = '1';
    c.grid_scroll_x = '700px';
    c.layout_type = 'modal';
    c.unit_key = 'PZGL_WSGL_WSFHPZGL_FHR_WGLJWSHRCX';
    // c.pagination2 = false;

    // 配置项：列表列
    c.grid_columns = [
      { title: '规范化境外收货人', dataIndex: 'gfhjwshrmc', width: 200, ellipsis: true },
      { title: '报关单境外收货人', dataIndex: 'jwshrmc', width: 200, ellipsis: true },
      { title: '境外收货人别名', dataIndex: 'jwshrbm', width: 200, ellipsis: true },

    ];
    // 配置项：列表筛选项
    c.filter_items = [
      { name: 'sfgl', label: '是否关联', type: 'Select', codeTable: 'code_static_yes_no:02' },
      { name: 'gfhjwshrmc', label: '规范化境外收货人', type: 'Input' },
      { name: 'jwshrmc', label: '报关单境外收货人', type: 'Input' },
      { name: 'jwshrbm', label: '境外收货人别名', type: 'Input' },
    ];

    c.gridParams = {
      initSearchModal: [
        {property: "fhruuid", value: fhruuid, op: "zdy"},
      ],
    }


    // 配置项：工具栏
    c.toolbar_default = {
      setting: false,
      full: false,
      reload: false,
    };



    // 配置项：自定义工具栏
    c.customer_toolbar = [
      { name: '保存', func: 'save' },
    ];
    c.module_type = 'QZ_type';
    c.filter_items[0].defaultValue = 'N';

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
          checkRowKey.push(item.jwshruuid);
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

  // 保存
  Func.save = (param: any) => {
    const { selectionRowKeys, unitRef,selectionRows } = param;
    // if (!selectionRows || selectionRows.length === 0) {
    //         message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    //         return;
    //     }
    const searchModel = param.unitRef.current.getGridParams().searchModel;
    setMasker(true);
    const params = {
      bdbz:'fhrpz',
      fhruuid: mainSelectionRowKeys[0],
      jwshruuids: selectionRowKeys,
      sfgl:''
    }
    for (let i = 0; i < searchModel?.length; i++) {
      const property2 = searchModel[i].property;
      const value = searchModel[i].value;
      if("sfgl"===property2){
        params.sfgl = value;
      }
    }
    fhrBdJwshr(params).then((res: any) => {
      setMasker(false);
      const { code, msg } = res;
      if (code == '200') {
        unitRef.current?.setSelectionRowKeys([]);
        unitRef.current?.setSelectionRows([]);
        message.success("关联境外收货人成功！");
        close();
      } else {
        message.error(msg)
      }
    })
  };

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
