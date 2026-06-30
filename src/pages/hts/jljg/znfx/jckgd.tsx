/**
 * title: 智能分析-进（出）口关单
 * desc: 智能分析-海关或价贸的进（出）口关单
 * creator: yxy
 */
import React, { useImperativeHandle, useState, useEffect, useRef } from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import jckgdHgConfig from '../sjxz/hghxsjcx/jckbgdconfig';
import jckgdSjConfig from '../sjxz/jmfksjcx/jckbgdconfig';
import ZnfxJckhzqdHgFunc from '../sjxz/hghxsjcx/func';
import ZnfxJckhzqdSjFunc from '../sjxz/jmfksjcx/func';
import DyGrid from '../sjxz/common/dyGrid';
import CONSTANTS from '@/components/DDAssist/constants';
import { Drawer } from 'antd';

export interface JckgdProps {
  onRef?: any;
}

const ModalJckgd: React.FC<JckgdProps> = ({
  onRef,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [myConfig, setMyconfig] = useState<any>();
  const [myHgConfig] = useState<any>(jckgdHgConfig);
  const [mySjConfig] = useState<any>(jckgdSjConfig);

  const [myFunc, setMyFunc] = useState<any>();
  const [myHgFunc] = useState<any>(ZnfxJckhzqdHgFunc);
  const [mySjFunc] = useState<any>(ZnfxJckhzqdSjFunc);
  const dyGridRef: any = useRef();
  const [myType, setMyType] = useState<any>();

  const [title, setTitle] = useState<any>('');
  // 开启
  const showModal = (jckbz: any, hgsjbz: any, param: any) => {
    let c: any = null;
    let t: any = null;
    let f: any = null;
    if (hgsjbz === 'HG') {
      c = { ...myHgConfig };
      f = { ...myHgFunc };
      t = { ...myHgConfig };
      setMyType('bgdhgbh');
    } else {
      c = { ...mySjConfig };
      f = { ...mySjFunc };
      t = { ...mySjConfig };
      setMyType('ckbgdh');
    }
    const gridColumns = [];
    let unit_key = '';
    let export_key = '';
    for (let i = 1; i < t.grid_columns.length; i++) {
      if (t.grid_columns[i].dataIndex != 'jckbzDm' && t.grid_columns[i].dataIndex != 'sbhggqkajc' && t.grid_columns[i].dataIndex != 'ckrq1') {
        gridColumns.push(t.grid_columns[i]);
      }
      if (t.grid_columns[i].dataIndex === 'jckbzDm') {
        const tmpJck = t.grid_columns[i];
        if (tmpJck.hasOwnProperty('filter')) {
          delete tmpJck.filter;
        }
        if (tmpJck.hasOwnProperty('filterDropdown')) {
          delete tmpJck.filterDropdown;
        }
        gridColumns.push(tmpJck);
      }
      if (hgsjbz === 'HG') {
        unit_key = 'JLJG_ZXSB_SB_JLJG_ZNFX_SJHQ_HGBGD';
        export_key='JLJG_ZXSB_SB_JLJG_ZNFX_SJHQ_HGBGD';
        if (t.grid_columns[i].dataIndex === 'sbhggqkajc') {
          const tmp = t.grid_columns[i];
          if (jckbz === 'JK') {
            tmp.title = '进境口岸';
          } else {
            tmp.title = '出境口岸';
          }
          gridColumns.push(tmp);
        }
        if (t.grid_columns[i].dataIndex === 'ckrq1') {
          const tmp = t.grid_columns[i];
          if (jckbz === 'JK') {
            tmp.title = '进口日期';
          } else {
            tmp.title = '出口日期';
          }
          gridColumns.push(tmp);
        }
      } else {
        unit_key = 'JLJG_ZXSB_SB_JLJG_ZNFX_SJHQ_JM';
        export_key = 'JLJG_ZXSB_SB_JLJG_ZNFX_SJHQ_JM';
        if (t.grid_columns[i].dataIndex === 'ckrq1') {
          const tmp = t.grid_columns[i];
          if (jckbz === 'JK') {
            tmp.title = '进口日期';
          } else {
            tmp.title = '出口日期';
          }
          gridColumns.push(tmp);
        }
      }
    }
    c.grid_columns = gridColumns;
    let til = '';
    c.unit_key = unit_key;
    c.export_key=export_key;
    c.toolbar_default.tssb_download=false;
    c.toolbar_default.download=true;
    const model = [
      { property: 'bah', value: param.bah, op: 'dd', type: 5 },
      { property: 'jckbzDm', value: jckbz === 'JK' ? 'I' : 'E', op: 'dd' },
    ];
    if (param.bah.startsWith('C')) {
      model.push({ property: 'jarq', value: param.jarq, op: 'dd' , type: 5 });
      til = `手册号：${param.bah}  核销周期：${param.hxzqxs}`;
    } else {
      model.push({ property: 'hxqsrq', value: param.hxqsrq, op: 'dd', type: 5 });
      model.push({ property: 'hxjzrq', value: param.hxjzrq, op: 'dd', type: 5 });
      til = `账册号：${param.bah}  核销周期：${param.hxzqxs}`;
    }
    setTitle(til);
    const gridParams: any = {
      initSearchModal: model
    }
    c.customer_toolbar=[];
    c.gridParams = gridParams;
    const filterItems = [];
    for (let i = 1; i < t.filter_items.length; i++) {
      filterItems.push(t.filter_items[i]);
    }
    c.filter_items = filterItems;
    c.layout_type = 'modal';
    setMyconfig(c);
    f.getOtherRef = () => {
      const otherRef = [];
      // 导入模板数据异常页面
      otherRef.push(dyGridRef);
      return otherRef;
    };
    setMyFunc(f);
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
        <DDBunit2 config={myConfig} func={myFunc} />
        <DyGrid onRef={dyGridRef} dyType={myType} />
      </Drawer>
    </>
  );
};

export default ModalJckgd;
