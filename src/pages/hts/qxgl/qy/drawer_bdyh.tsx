/**
 * title: 用户管理-绑定企业
 * author: wx
 */
import React, { useImperativeHandle, useState } from 'react';
import CONSTANTS from '@/components/DDAssist/constants';
import { Drawer, Spin, message } from 'antd';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import yhConfig from '../yh/config';
import Func from './f_bdyh'
import { yhBdQy } from '@/pages/hts/services/htsApi';

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
  const [myConfig, setMyconfig] = useState<any>(yhConfig);

  // 开启
  const showModal = (param: any, selectionRowKeys: any ,flag :any) => {
     // 改变默认配置项
    let c = { ...yhConfig };
    // 配置项：列表列
    c.grid_columns = [
      { title: '登录账号', dataIndex: 'yddh', width: 170, ellipsis: true },
      { title: '姓名', dataIndex: 'xm', width: 180, ellipsis: true  },
      { title: '证件号', dataIndex: 'sfzjhm', width: 170, ellipsis: true },
      { title: '用户类型', dataIndex: 'yhlxDm', width: 120, codeTable: 'code_dm_gy_yhlx:01' },
      { title: '角色名称', dataIndex: 'jsmc', ellipsis: true },
      { title: '用户版本', dataIndex: 'qxzmc', ellipsis: true },
    ];

    // 配置项：列表筛选项
    c.filter_items = [
      { name: 'sfgl', label: '是否关联', type: 'Select', codeTable: 'code_static_yes_no:02' },
      { name: 'yddh', label: '登录账号', type: 'Input' },
      { name: 'xm', label: '姓名', type: 'Input' },
      { name: 'sfzjhm', label: '证件号', type: 'Input' },
    ];
    // 配置项：工具栏
    c.toolbar_default = {
      setting: true,
      full: true,
      reload: true,
    };


    c.layout_type = 'modal';                                                     // 页面类型，默认default 可选 default modal tabs

    if(flag === '1'){
      c.filter_items[0].defaultValue = 'Y';
      c.gridParams = {
        initSearchModal: [
          {type: 1, property: "sbqyuuidDqlb", value: selectionRowKeys[0], op: "al"},
          {type: 1, property: "qxlx", value: '5', op: "zdy" },
          {type: 1, property: "qyglyhbz", value: 'Y', op: "zdy" },
        ],
      }
    }else{
      c.filter_items[0].defaultValue = 'N';
      // 配置项：自定义工具栏
      c.customer_toolbar = [
        { name: '保存', func: 'save' },
      ];
      c.gridParams = {
        initSearchModal: [
          {type: 1, property: "sbqyuuidDqlb", value: selectionRowKeys[0], op: "al"},
          {type: 1, property: "qxlx", value: '5', op: "zdy" },
        ],
      }
    }

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
          checkRowKey.push(item.yhuuid1Dqlb);
        }
      });
    }
    refUnit.current?.setSelectionRowKeys(checkRowKey);  // 设置SelectionRows
    refUnit.current?.setSelectionRows(checkRow);  // 设置SelectionRows
  }

  // 保存
  Func.save = (param: any) => {
    const { selectionRowKeys, refUnit } = param;
    const searchModel = param.refUnit.current.getGridParams().searchModel;
    setMasker(true);
    const params = {
      yhuuid1s: selectionRowKeys,
      sbqyuuids: mainSelectionRowKeys,
      bdbz: 'qyyh',
      sbqyuuidDqlb:mainSelectionRowKeys[0]
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
        initParam?.refUnit.current!.reload2();
        refUnit.current?.setSelectionRowKeys([]);
        refUnit.current?.setSelectionRows([]);
        message.success("绑定用户成功！");
        setModalVisible(false);
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
      title="关联用户"
      className='dd_data_page_modal'
      open={modalVisible}
      width={CONSTANTS.C_MODAL_WIDTH_X3}
      destroyOnHidden={true}
      onClose={() => {setModalVisible(false)}}
    >
      <Spin tip="Loading..." spinning={masker} delay={100}>
        <DDBunit2 config={myConfig} func={Func} />
      </Spin>
    </Drawer>
  );
};

export default DrawerForm;
