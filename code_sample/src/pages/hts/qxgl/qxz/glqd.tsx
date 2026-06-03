import React, { useImperativeHandle, useState } from 'react';
import { message, Spin, Drawer } from 'antd';
import pro from '@/pages/common/proConfig';
import '@/pages/hts/commonModule/style.less';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import FuncQd from '../qd/f';
import unitConfigQd from '../qd/config';
import { glqd } from '@/services/hts/api';


export interface DDTsort {
  onRef?: any;
  visible?: any;
}

const pbcd: React.FC<DDTsort> = ({ onRef, visible = false }) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [masker, setMasker] = useState<boolean>(false);
  const [rowKeys, setRowKeys] = useState([]);
  const [mainRef, setMainRef] = useState<any>({}); //主页面的ref
  const [selectionRowKeys, setSelectionRowKeys] = useState<any>([]); //主页面的ref

  

  const qdConfig = { ...unitConfigQd };
  const qdFunc = { ...FuncQd };
  qdConfig.pagination2 = false;
  // 配置项：自定义工具栏
  qdConfig.costomer_toobar = [
    { name: '保存', key: 'saveQd', func: 'save' },
  ];
  qdConfig.gridParams = {
    initSearchModal: [
      { type: 1, property: "qxlx", value: '1', op: "zdy" },
      { type: 1, property: "qxzDm", value: selectionRowKeys[0], op: "zdy" },
    ]
  };
  qdConfig.filter_items = [
    { name: 'qdDm', label: '渠道代码', type: 'Select', codeTable: ['CODE_QX_QD', '01']  },
    { name: 'qdmc', label: '渠道名称', type: 'Input' },
    { name: 'sfgl', label: '是否关联', type: 'Select', codeTable: ['code_static_yes_no', '01'] },
  ];

  // 开启
  const showModal = (param: any, selectionRowKeys: any) => {
    setSelectionRowKeys(selectionRowKeys);
    setModalVisible(true);
    setMainRef(param);
    setRowKeys(selectionRowKeys);
    // 表单初始化
    initForm(param);
  };

  qdFunc.afterReload = (param: any) => {
    const { dataSource, unitRef } = param;
    const checkRow: any = [];
    const checkRowKey: any = [];
    if (dataSource && dataSource.length > 0) {
      dataSource.forEach((item: any) => {
        if (item.checkbz == 'Y') {
          checkRow.push(item);
          checkRowKey.push(item.qdDm);
        }
      });
    }
    unitRef.current?.setSelectionRowKeys(checkRowKey);  // 设置SelectionRows
    unitRef.current?.setSelectionRows(checkRow);  // 设置SelectionRows
  }


  qdFunc.save = async (param: any) => {
    const { selectionRowKeys, } = param;
    const searchModel = param.unitRef.current.getGridParams().searchModel;
    const data = {
      "qxzDm": rowKeys[0],
      "qdDms": selectionRowKeys,
      "qxlx": "1"
    };
    for(let i=0;i<searchModel.length;i++){
      const property2 = searchModel[i].property;
      const value = searchModel[i].value;
      data[property2] =  value;
    }
    await glqd(data).then((response: any) => {
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
  }



  return (
    <>
      <Drawer
        title="关联渠道"
        visible={modalVisible}
        onClose={() => { close() }}
        width={pro.c_modal_width_x4}
        destroyOnClose={true}
        className="dd_data_page_modal"
        maskClosable={false}
      >
        <Spin tip="Loading..." spinning={masker} delay={100}>
          <DDBunit2 config={qdConfig} func={qdFunc} />
        </Spin>
      </Drawer>
    </>
  );
}

export default pbcd;