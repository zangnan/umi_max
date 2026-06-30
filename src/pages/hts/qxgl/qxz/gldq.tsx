import React, { useImperativeHandle, useState } from 'react';
import { message, Spin, Drawer } from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
import '@/pages/hts/commonModule/style.less';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import fqFunc from './dqFunc';
import dqConfig from './dqConfig';
import { gldq } from '@/pages/hts/services/htsApi';


export interface DDTsort {
  onRef?: any;
  visible?: any;
}

const pbcd: React.FC<DDTsort> = ({ onRef, visible = false }) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [masker, setMasker] = useState<boolean>(false);
  const [rowKeys, setRowKeys] = useState([]);
  const [mainRef, setMainRef] = useState<any>({}); //主页面的ref

  // 配置项：自定义工具栏
  dqConfig.customer_toolbar = [
    { name: '保存', key: 'saveQd', func: 'save' },
  ];

  dqConfig.gridParams = {
    initSearchModal: [
      { type: 1, property: "qxlx", value: '1', op: "zdy" },
      { type: 1, property: "qxzDm", value: rowKeys[0], op: "zdy" },

    ]
  };

  // 开启
  const showModal = (param: any, selectionRowKeys: any) => {
    setModalVisible(true);
    setMainRef(param);
    setRowKeys(selectionRowKeys);
    // 表单初始化
    // initForm(param);
  };

  fqFunc.afterReload = (param: any) => {
    const { dataSource, unitRef } = param;
    const checkRow: any = [];
    const checkRowKey: any = [];
    if (dataSource && dataSource.length > 0) {
      dataSource.forEach((item: any) => {
        if (item.checkbz == 'Y') {
          checkRow.push(item);
          checkRowKey.push(item.ssdq);
        }
      });
    }
    unitRef.current?.setSelectionRowKeys(checkRowKey);  // 设置SelectionRows
    unitRef.current?.setSelectionRows(checkRow);  // 设置SelectionRows
  }


  fqFunc.save = async (param: any) => {
    const { selectionRowKeys, } = param;
    const searchModel = param.unitRef.current.getGridParams().searchModel;
    const data = {
      "qxzDm": rowKeys[0],
      "ssdqs": selectionRowKeys,
      "qxlx": "1"
    };
    for (let i = 0; i < searchModel?.length; i++) {
      const property2 = searchModel[i].property;
      const value = searchModel[i].value;
      data[property2] = value;
    }
    await gldq(data).then((response: any) => {
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
    // mainRef.unitRef.current.reload2();
    // 配置项：自定义工具栏
    dqConfig.customer_toolbar = [];

  }


  return (
    <>
      <Drawer
        title="关联地区"
        visible={modalVisible}
        onClose={() => { close() }}
        width={CONSTANTS.C_MODAL_WIDTH_X2}
        destroyOnHidden={true}
        className="dd_data_page_modal"
        mask={{ closable: false }}
      >
        <Spin tip="Loading..." spinning={masker} delay={100}>
          <DDBunit2 config={dqConfig} func={fqFunc} />
        </Spin>
      </Drawer>
    </>
  );
}

export default pbcd;