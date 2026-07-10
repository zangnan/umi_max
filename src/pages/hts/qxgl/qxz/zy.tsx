import React, { useImperativeHandle, useState } from 'react';
import { message, Spin, Drawer } from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
import '@/pages/hts/commonModule/style.less';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import { intl as intl2 } from '@/components/DDAssist/util';
import config from '../zy/zyconfig';
import Func from '../zy/zyFunc';
import { glzy } from '@/pages/hts/services/htsApi';


export interface DDTsort {
  onRef?: any;
  visible?: any;
}

const pbcd: React.FC<DDTsort> = ({ onRef, visible = false }) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [masker, setMasker] = useState<boolean>(false);
  const [rowKeys, setRowKeys] = useState([]);
  const [mainRef, setMainRef] = useState<any>({}); //主页面的ref


  const zyconfig = { ...config };
  const zyFunc = { ...Func };
  // 配置项：自定义工具栏
  zyconfig.customer_toolbar = [
    { name: '保存', key: 'addqxzgl', func: 'save' },
  ];
  zyconfig.pagination2 = false;

  zyconfig.gridParams = {
    initSearchModal: [
      { type: 1, property: "qxlx", value: '1', op: "zdy" },
      { type: 1, property: "qxzDm", value: rowKeys[0], op: "zdy" },
    ],
  }

  zyconfig.filter_items = [
    { name: 'zyDm2', label: '资源代码', type: 'Input' },
    { name: 'zymc2', label: '资源名称', type: 'Input' },
    { name: 'sfgl', label: '是否关联', type: 'Select',codeTable: 'code_static_yes_no:02'  },
  ];
  // 开启
  const showModal = (param: any, selectionRowKeys: any) => {
    setModalVisible(true);
    setMainRef(param);
    setRowKeys(selectionRowKeys);
    // 表单初始化
    initForm(param);
  };

  zyFunc.afterReload = (param: any) => {
    const { dataSource, refUnit } = param;
    const checkRow: any = [];
    const checkRowKey: any = [];
    if (dataSource && dataSource.length > 0) {
      dataSource.forEach((item: any) => {
        if (item.checkbz == 'Y') {
          checkRow.push(item);
          checkRowKey.push(item.zyDm2);
        }
      });
    }
    refUnit.current?.setSelectionRowKeys(checkRowKey);  // 设置SelectionRows
    refUnit.current?.setSelectionRows(checkRow);  // 设置SelectionRows
  }


  zyFunc.save = async (param: any) => {
    const { selectionRowKeys, } = param;
    const searchModel = param.refUnit.current.getGridParams().searchModel;
    const data = {
      "qxzDm": rowKeys[0],
      "zyDm2s": selectionRowKeys,
      "qxlx": "1"

    };
    for(let i=0;i<searchModel?.length;i++){
      const property2 = searchModel[i].property;
      const value = searchModel[i].value;
      data[property2] =  value;
    }
    await glzy(data).then((response: any) => {
      setMasker(false);
      if (response.code === '200') {
        close();
        message.success('保存成功！');
      } else {
        message.error(response.msg);
      }
    });
  }


  // useImperativeHandle
  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  // 表单初始化
  const initForm = async (param: any) => {

  };



  const close = async () => {
    setModalVisible(false);
    // 配置项：自定义工具栏
    zyconfig.customer_toolbar = [];
    // mainRef.refUnit.current.reload();

  }



  return (
    <>
      <Drawer
        title="关联资源"
        open={modalVisible}
        onClose={() => { close() }}
        width={CONSTANTS.C_MODAL_WIDTH_X4}
        destroyOnHidden={true}
        className="dd_data_page_modal"
        mask={{ closable: false }}
      >
        <Spin tip="Loading..." spinning={masker} delay={100}>
          <DDBunit2 config={zyconfig} func={zyFunc} />
        </Spin>
      </Drawer>
    </>
  );
}

export default pbcd;