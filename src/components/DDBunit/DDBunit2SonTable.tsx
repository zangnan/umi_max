import React, { useImperativeHandle, useState } from 'react';
import DDBunit2 from './DDBunit2';
import CONSTANTS from '../DDAssist/constants';
import { Drawer } from 'antd';
import { cloneDeep } from 'lodash';

export interface BdjgProps {
  onRef?: any;
}

const DrawerList: React.FC<BdjgProps> = ({
  onRef,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [myConfig, setMyconfig] = useState<any>({});
  const [myFunc, setMyFunc] = useState<any>({});
  const [initParam, setInitParam] = useState<any>();

  // 开启
  const showModal = (param: any) => {
    // const c = { ...param.sonConfig };
    const c = cloneDeep(param.sonConfig);
    const allowEdit = param.allowEdit;
    // console.log("🚀 ~ showModal ~ allowEdit:", allowEdit)

    c.grid_title = param?.sonTableTitle;
    let mainTableDictName: any = c.grid_columns[0]?.dict_name;           // 主表表名
    // let mainTableDictFieldName: any = param?.keyField?.dict_field_name;   // 主表主键字段名
    let mainTableDictFieldName: any = param?.keyField?.dataIndex;   // 主表主键字段名
    let mainTableDictFieldValue: any = param?.rowKeyValue;               // 主表主键字段值
    c.leaf_config = {
      dictName: mainTableDictName,
      dictFieldName: mainTableDictFieldName,
      dictFieldValue: mainTableDictFieldValue,
    }
    const gridParams: any = {
      initSearchModal: [
        { property: param.rowKey,
          value: mainTableDictFieldValue,
          op: CONSTANTS.FILTER_CONDITION.equal.condetionCode,
          dict_name: mainTableDictName,
          dict_field_name: mainTableDictFieldName,
          type: 4,
        },
      ],
    }
    c.gridParams = gridParams;
    let beforeShowSonTableModal = param?.sonFunc?.beforeShowSonTableModal;
    if (beforeShowSonTableModal) {
      beforeShowSonTableModal(c);
    }
    // debugger;
    if (!allowEdit) {
      // 只读状态，删除工具类新建、删除、编辑、上传
      if (param?.sonConfig?.toolbar_default?.add) {
        delete c.toolbar_default.add;
      } else {
        c.toolbar_default.add = param?.sonConfig?.toolbar_default?.add;
      }
      if (param?.sonConfig?.toolbar_default?.delete) {
        delete c.toolbar_default.delete;
      } else {
        c.toolbar_default.delete = param?.sonConfig?.toolbar_default?.delete;
      }
      if (param?.sonConfig?.toolbar_default?.edit) {
        delete c.toolbar_default.edit;
      } else {
        c.toolbar_default.edit = param?.sonConfig?.toolbar_default?.edit;
      }
      if (param?.sonConfig?.toolbar_default?.upload) {
        delete c.toolbar_default.upload;
      } else {
        c.toolbar_default.upload = param?.sonConfig?.toolbar_default?.upload;
      }
      if (param?.sonConfig?.grid_handle_columns_default?.delete) {
        delete c.grid_handle_columns_default.delete;
      } else {
        c.grid_handle_columns_default.delete = param?.sonConfig?.grid_handle_columns_default?.delete;
      }
      if (param?.sonConfig?.grid_handle_columns_default?.edit) {
        delete c.grid_handle_columns_default.edit;
      } else {
        c.grid_handle_columns_default.edit = param?.sonConfig?.grid_handle_columns_default?.edit;
      }
    }
    //  中止筛选布局，由默认3列转为2列
    let filter_items = c.filter_items || [];
    let filter_items_new: any = [];
    filter_items.forEach((item: any) => { // 遍历sheet
      item.layout = CONSTANTS.DEFAULT_FILTER_LAYOUT_50P_ROW;
      filter_items_new.push({...item});
    });
    c.filter_items = filter_items_new;
    setMyconfig(c);
    setMyFunc({...param.sonFunc});
    setModalVisible(true);
    // setRefGrid(param.refGrid);
    setInitParam(param);
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  return (
    <Drawer
      title={`${initParam?.modalTitle || ''}`}
      open={modalVisible}
      onClose={() => {setModalVisible(false)}}
      size={CONSTANTS.C_MODAL_WIDTH_X4}
      destroyOnHidden={true}
      className="dd_modal_bg"
    >
      <DDBunit2 config={myConfig} func={myFunc} />
    </Drawer>
  );
};

export default DrawerList;
