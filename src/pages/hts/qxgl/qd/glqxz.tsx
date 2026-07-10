import React, { useRef, useState,useImperativeHandle } from 'react';
import { Spin, Drawer, message, Switch} from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import config from '../qxz/config';
import func from '../qxz/f';
import { glqxz, setAsTheDefaultPermissionGroup } from '@/pages/hts/services/htsApi';

export interface DDTsort {
  onRef?: any;
  visible?: any;
}


const Glqxz: React.FC<DDTsort> = ({ onRef, visible = false }) => {

  const [rowKeys, setRowKeys] = useState([]);
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [masker, setMasker] = useState<boolean>(false);
  const [flag, setFlag] = useState<any>();
  const [mainRef, setMainRef] = useState<any>({}); //主页面的ref
  const qxzConfig = {...config};
  const qxzFunc = {...func};

  qxzConfig.grid_filter_quick = [];
  qxzConfig.customer_toolbar = [];
  qxzConfig.filter_items = [
    { name: 'qxzDm', label: '权限组代码', type: 'Input' },
    { name: 'qxzmc', label: '权限组名称', type: 'Input' },
    { name: 'sfgl', label: '是否关联', type: 'Select', codeTable: 'code_static_yes_no:01' },
  ];
  qxzConfig.pagination2 = false;
  qxzConfig.module_type = 'sjbb';
  qxzConfig.layout_type = 'modal';
  // 配置项：列表列
  qxzConfig.grid_columns = [
    { title: '权限组代码', dataIndex: 'qxzDm', width: 100, align: 'left', ellipsis: true, },
    { title: '权限组名称', dataIndex: 'qxzmc', width: 120, align: 'left', ellipsis: true, },
    { title: '权限组描述', dataIndex: 'qxzms', width: 200, align: 'left', ellipsis: true, },
    { title: '默认权限组标志', dataIndex: 'mrQxzBz', width: 80, render: { func: 'renderYxbz2' }, align: 'center', fixed: 'right'}
  ];
  // 配置项：自定义工具栏
  qxzConfig.customer_toolbar = [
    { name: '保存', key: 'glqdqxzgl', func: 'save' },
  ];

  qxzConfig.gridParams = {
    initSearchModal: [
      { type: 1, property: "qxlx", value: '2', op: "zdy" },
      { type: 1, property: "gldx", value: flag, op: "zdy" },
      { type: 1, property: "qdDm", value: rowKeys, op: "zdy" },
    ]
  };
  // 开启
  const showModal = (param: any,flag:any) => {
    setModalVisible(true);
    setMainRef(param);
    setRowKeys(param.selectionRowKeys[0]);
    setFlag(flag);
  };


  qxzFunc.columnsRender = {
    // 生成类型
    renderYxbz2: (param: any) => {
      const { record } = param;
      let bq =<></>;
      if(record?.checkbz == "Y"){
        bq = <Switch checked={record.mrQxzBz == 'Y' ? true : false} checkedChildren="停用" unCheckedChildren="启用" onClick={(checked) => onChangeSwitch({ ...param, ...{ checked: checked } })} />
      }
      return bq;
    },
  }


  //开关值改变
const onChangeSwitch = async (param: any) => {
  const { record, refUnit,checked,dataSource } = param;
  const bz = checked? "Y":"N";
  const data = {
    "qdDm":rowKeys,
    "qxzDm":record.qxzDm,
    "gldx":flag,
    "mrQxzBz":bz
  };
  await setAsTheDefaultPermissionGroup(data).then((response: any) => {
    setMasker(false);
    if (response.code === '200') {
      message.success('保存成功！');
      refUnit.current!.reload();
    } else {
      message.error(response.msg);
    }
  });
  param.refUnit.current!.reload();


}

  qxzFunc.afterReload = (param: any) => {
    const { dataSource, refUnit } = param;
    const checkRow: any = [];
    const checkRowKey: any = [];
    if (dataSource && dataSource.length > 0) {
      dataSource.forEach((item: any) => {
        if (item.checkbz == 'Y') {
          checkRow.push(item);
          checkRowKey.push(item.qxzDm);
        }
      });
    }
    refUnit.current?.setSelectionRowKeys(checkRowKey);  // 设置SelectionRows
    refUnit.current?.setSelectionRows(checkRow);  // 设置SelectionRows
  }

  qxzFunc.save = async (param: any) => {
    const { selectionRowKeys, } = param;
    const searchModel = param.refUnit.current.getGridParams().searchModel;
    const data = {
      "qdDm": rowKeys,
      "qxzDms": selectionRowKeys,
      "gldx":flag,
      "qxlx": "2"
    };
    for(let i=0;i<searchModel?.length;i++){
      const property2 = searchModel[i].property;
      const value = searchModel[i].value;
      data[property2] =  value;
    }
    await glqxz(data).then((response: any) => {
      setMasker(false);
      if (response.code === '200') {
        message.success('保存成功！');
        param.refUnit.current!.reload();
      } else {
        message.error(response.msg);
      }
    });
  }

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });


  const close = () => {
    setModalVisible(false);
    mainRef.refUnit.current!.reload();
  }

  return (
    <>
      <Drawer
        title="关联权限组"
        open={modalVisible}
        onClose={() => { close() }}
        width={CONSTANTS.C_MODAL_WIDTH_X3}
        destroyOnHidden={true}
        className="dd_data_page_modal"
        mask={{ closable: false }}
      >
        <Spin tip="Loading..." spinning={masker} delay={100}>
          <DDBunit2 config={qxzConfig} func={qxzFunc} />
        </Spin>
      </Drawer>
    </>

  );
}

export default Glqxz;
