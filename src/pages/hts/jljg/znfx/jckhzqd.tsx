/**
 * title: 智能分析-进（出）口核注清单
 * desc: 智能分析-价贸的进（出）口核注清单
 * creator: yxy
 */
import React, { useImperativeHandle, useState, useEffect, useRef } from 'react';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import jckhzqdConfig from '../sjxz/hghxsjcx/jckhzqdconfig';
import ZnfxJckhzqdFunc from '../sjxz/hghxsjcx/func'
import CONSTANTS from '@/components/DDAssist/constants';
import { Drawer } from 'antd';
import DyGrid from '../sjxz/common/dyGrid';

export interface JckhzqdProps {
  onRef?: any;
}

const ModalJckhzqd: React.FC<JckhzqdProps> = ({
  onRef,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [myConfig, setMyconfig] = useState<any>(jckhzqdConfig);
  const [title, setTitle] = useState<any>('');
  const dyGridRef: any = useRef();
  // 开启
  const showModal = (titleKey: any, param: any) => {
    const c = { ...myConfig };
    const gridColumns = [];
    for (let i = 1; i < jckhzqdConfig.grid_columns.length; i++) {
      if (jckhzqdConfig.grid_columns[i].dataIndex != 'jckbzDm' && jckhzqdConfig.grid_columns[i].dataIndex != 'hggqkamc') {
        gridColumns.push(jckhzqdConfig.grid_columns[i]);
      }
      if (jckhzqdConfig.grid_columns[i].dataIndex === 'hggqkamc') {
        const tmp = jckhzqdConfig.grid_columns[i];
        if (titleKey === 'JK') {
          tmp.title = '进境关别';
        } else {
          tmp.title = '出境关别';
        }
        gridColumns.push(tmp);
      }
      if (jckhzqdConfig.grid_columns[i].dataIndex === 'jckbzDm') {
        const tmpJck = jckhzqdConfig.grid_columns[i];
        if (tmpJck.hasOwnProperty('filter')) {
          delete tmpJck.filter;
        }
        if (tmpJck.hasOwnProperty('filterDropdown')) {
          delete tmpJck.filterDropdown;
        }
        gridColumns.push(tmpJck);
      }
    }
    c.grid_columns = gridColumns;
    const model = [
      { property: 'bah', value: param.bah, op: 'dd' },
      { property: 'jckbzDm', value: titleKey === 'JK' ? 'I' : 'E', op: 'dd' },
    ];
    let til = '';
    if (param.bah.startsWith('C')) {
      model.push({ property: 'jarq', value: param.jarq, op: 'dd' , type: 5});
      til = `手册号：${param.bah}  核销周期：${param.hxzqxs}`;
    } else {
      model.push({ property: 'hxqsrq', value: param.hxqsrq, op: 'dd', type: 5 });
      model.push({ property: 'hxjzrq', value: param.hxjzrq, op: 'dd', type: 5 });
      til = `账册号：${param.bah}  核销周期：${param.hxzqxs}`;
    }
    const gridParams: any = {
      initSearchModal: model,
    }
    c.gridParams = gridParams;
    const filterItems = [];
    for (let i = 1; i < jckhzqdConfig.filter_items.length; i++) {
      filterItems.push(jckhzqdConfig.filter_items[i]);
    }
    c.filter_items = filterItems;
    c.layout_type = "modal";
    c.unit_key = 'JLJG_ZXSB_SB_JLJG_ZNFX_SJHQ_BSHZQD';
    c.export_key = 'JLJG_ZXSB_SB_JLJG_ZNFX_SJHQ_BSHZQD';
    c.customer_toolbar=[];
    c.toolbar_default.tssb_download=false;
    c.toolbar_default.download=true;


    setMyconfig(c);

    setTitle(til);
    ZnfxJckhzqdFunc.getOtherRef = () => {
      const otherRef = [];
      // 导入模板数据异常页面
      otherRef.push(dyGridRef);
      return otherRef;
    };
    setModalVisible(true);
  };

  useEffect(() => {
  }, []);

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  return (
    <>
      <Drawer
        title={title}
        visible={modalVisible}
        width={CONSTANTS.C_MODAL_WIDTH_X3}
        onClose={() => { setModalVisible(false) }}
        className="dd_data_page_modal"
        destroyOnHidden={true}
        mask={{ closable: false }}
      >
        <DDBunit2 config={myConfig} func={ZnfxJckhzqdFunc} />
        <DyGrid onRef={dyGridRef} dyType={'qdbh'} />
      </Drawer>
    </>
  );
};

export default ModalJckhzqd;
