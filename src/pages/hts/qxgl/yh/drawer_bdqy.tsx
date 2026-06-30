/**
 * title: 用户管理-绑定企业
 * author: wx
 */
import React, { useImperativeHandle, useState } from 'react';
import CONSTANTS from '@/components/DDAssist/constants';
import { Drawer, Spin, message } from 'antd';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import qyConfig from '../qy/config';
import Func from './f_bdqy'
import { yhBdQy } from '@/pages/hts/services/htsApi';
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
  const [myConfig, setMyconfig] = useState<any>(qyConfig);

  // 开启
  const showModal = (param: any, selectionRowKeys: any ,flag :any) => {
    const value = flag === '1'?param?.record?.yhuuid1 : param?.selectionRows[0].yhuuid1Dqlb;
    // 改变默认配置项
    const c = cloneDeep(myConfig);
    c.api_grid_query = `/yw/dditSaas/qxqy/queryQyPager`;
    c.grid_show_serial_number = false; // 是否显示序号，可选
    c.grid_row_key = 'sbqyuuidDqlb'; // 列表主键，默认uuid
    c.form_save_check = false; // 表单编辑是否执行后端校验
    c.click_checked = '1';
    c.grid_scroll_x = '1020px';
    c.layout_type = 'modal';                                                     // 页面类型，默认default 可选 default modal tabs
    c.pagination2 = false;

    // 配置项：列表列
    c.grid_columns = [
      { title: '企业名称', dataIndex: 'nsrmcDqlb', width: 140, ellipsis: true },
      { title: '海关企业代码', dataIndex: 'hgqyDmDqlb', width: 120 },
      { title: '纳税人识别号', dataIndex: 'nsrsbhDqlb', width: 160, ellipsis: true },
      { title: '社会信用代码', dataIndex: 'shxydmDqlb', width: 160, ellipsis: true },
      { title: '企业类型', dataIndex: 'cktsqylxDmDqlb', width: 80, codeTable: 'code_dm_rd_cktsqylx:01' },
      { title: '所属地区', dataIndex: 'swname', width: 120, ellipsis: true  },
      { title: '录入人', dataIndex: 'lrrxm', width: 120, ellipsis: true  },
    ];
    // 配置项：列表筛选项
    c.filter_items = [
      { name: 'sfgl', label: '是否关联', type: 'Select', codeTable: 'code_static_yes_no:02' },
      { name: 'nsrmcDqlb', label: '企业名称', type: 'Input' },
      { name: 'hgqyDmDqlb', label: '海关企业代码', type: 'Input' },
      { name: 'nsrsbhDqlb', label: '纳税人识别号', type: 'Input' },
      { name: 'shxydmDqlb', label: '社会信用代码', type: 'Input' },
      { name: 'cktsqylxDmDqlb', label: '企业类型', type: 'Select', codeTable: 'code_dm_rd_cktsqylx:01' },
    ];


    if(flag === '1'){
      c.gridParams = {
        initSearchModal: [
          {type: 1, property: "yhuuid1Dqlb", value: value, op: "al"},
          {type: 1, property: "qxlx", value: '4', op: "zdy" },
          {type: 1, property: "glqysbz", value: 'Y', op: "zdy" },
        ],
      }
    }else{
      c.gridParams = {
        initSearchModal: [
          {type: 1, property: "yhuuid1Dqlb", value: value, op: "al"},
          {type: 1, property: "qxlx", value: '4', op: "zdy" },
          {type: 1, property: "yhglqybz", value: 'Y', op: "zdy" },
        ],
      }
    }


    // 配置项：工具栏
    c.toolbar_default = {
      setting: true,
      full: true,
      reload: true,
    };


    if(flag === '1'){
      c.filter_items[0].defaultValue = 'Y';
      // 配置项：自定义工具栏
    }else{
      c.filter_items[0].defaultValue = 'N';
      c.customer_toolbar = [
        { name: '保存', func: 'save' },
      ];
    }

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

  // 保存
  Func.save = (param: any) => {
    const { selectionRowKeys, unitRef } = param;
    const searchModel = param.unitRef.current.getGridParams().searchModel;
    setMasker(true);
    const params = {
      yhuuid1s: mainSelectionRowKeys,
      sbqyuuids: selectionRowKeys?selectionRowKeys:[],
      bdbz: 'yhqy',
      yhuuid1Dqlb:mainSelectionRowKeys[0]
    }
    for (let i = 0; i < searchModel?.length; i++) {
      const property2 = searchModel[i].property;
      const value = searchModel[i].value;
      params[property2] = value;
    }
    yhBdQy(params).then((res: any) => {
      setMasker(false);
      const { code, msg } = res;
      if (code == '200') {
        unitRef.current?.setSelectionRowKeys([]);
        unitRef.current?.setSelectionRows([]);
        message.success("关联企业成功！");
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
      title="关联企业"
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
