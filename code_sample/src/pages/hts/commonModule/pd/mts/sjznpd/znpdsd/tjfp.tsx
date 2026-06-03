/**
 * 免退税：手动配单 ----- 添加发票
 */
import React, { useState, useImperativeHandle } from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import pro from '@/pages/common/proConfig';
import { Drawer, message } from 'antd';
import { intl as intl2 } from '@/pages/common/myUtil';
import myUtil from '@/pages/common/myUtil';
import sdpdStyle from './style.less';
import fpConfig from './tjfpconfig';

export interface ZzsfpSxProps {
  onRef?: any;
  visible?: any;
}

const Tjfp: React.FC<ZzsfpSxProps> = ({ onRef, visible = false }) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [mainRef, setMainRef] = useState<any>('');
  const [searchCkspmc, setSearchCkspmc] = useState<string>('');
  const [fpcodeId, setFpcodeId] = useState<any>([]);
  const [selectRows, setSelectRows] = useState<any>([]); // 当前选中数据
  const [selectKeys, setSelectKeys] = useState<any>([]); // 当前选中数据

  // 开启
  const showModal = (param: any) => {
    setModalVisible(true);
    setMainRef(param?.ref);
    setSearchCkspmc(param?.ckspmc);
    setFpcodeId(param?.fpcodeIds);
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  // 自定义表格头部信息
  const getGridHeaderInfo = (variable: any) => {
    const tempFragment = (
      <span className={sdpdStyle.sdpd_main}>
        <span className={sdpdStyle.sdpd_main_title_ytj}>
          当前已选中
          <span className={sdpdStyle.sdpd_main_title_ytj_num}>{variable}</span>
          条发票明细
        </span>
      </span>
    );
    return tempFragment;
  }

  fpConfig.filter_items[1].defaultValue = searchCkspmc;
  fpConfig.grid_header_info = getGridHeaderInfo(0);
  fpConfig.gridParams = { // 默认查询参数
    initSearchModal: [
      { property: 'fpcodeId', values: fpcodeId, op: 'nin' },
      {property: "fpsbztDms", value: ['1'], op: "al"},
      {property: "notInFpcllxDm", value: ["2", "3", "4", "5"], op: "al"},
    ],
  };

  const Func = {
    unitRef: React.createRef(),
    columnsRender: {
      renderZnpdSddw: (param: any) => {
        const record = param?.record;
        if (record.qnt && record.dw) {
          return myUtil.grid.formatNum(record.qnt, '0,0.00000') + '/' + record.dw;
        } else {
          return '';
        }
      },
      renderZnpdSySddw: (param: any) => {
        const record = param?.record;
        if (record.syQnt && record.dw) {
          return myUtil.grid.formatNum(record.syQnt, '0,0.00000') + '/' + record.dw;
        } else {
          return '';
        }
      }
    },
    // 选中
    onSelect: (param: any) => {
      const { record, selected, unitRef } = param;
      const tmpRows = [...selectRows];
      const tmpRowKeys = [...selectKeys];
      if (selected) {
        tmpRowKeys.push(record.fpcodeId);
        tmpRows.push(record);
      } else {
        const index1 = tmpRowKeys.findIndex((item: any) => record.fpcodeId === item);
        tmpRowKeys.splice(index1, 1);
        const index2 = tmpRows.findIndex((item: any) => record.fpcodeId === item.fpcodeId);
        tmpRows.splice(index2, 1);
      }
      setSelectKeys(tmpRowKeys);
      setSelectRows(tmpRows);
      unitRef.current!.setSelectionRowKeys(tmpRowKeys);
      unitRef.current!.setSelectionRows(tmpRows);
      const addNum = tmpRows.length;
      unitRef?.current?.setGridHeaderInfoCustomer(getGridHeaderInfo(addNum));
    },
    onSelectAll: (param: any) => {
      const { selected, changeRows, unitRef } = param;
      const tmpRowKeys = [...selectKeys];
      const tmpRows = [...selectRows];
      if (selected) {
        changeRows.forEach((item: any) => {
          tmpRowKeys.push(item.fpcodeId);
          tmpRows.push(item);
        })
      } else {
        changeRows.forEach((item: any) => {
          const rowIndex = tmpRows.findIndex((row: any) => row.fpcodeId === item.fpcodeId);
          tmpRows.splice(rowIndex, 1);
          const keyIndex = tmpRowKeys.findIndex((key: any) => key === item.fpcodeId);
          tmpRowKeys.splice(keyIndex, 1);
        });
      }
      setSelectKeys(tmpRowKeys);
      setSelectRows(tmpRows);
      unitRef.current!.setSelectionRowKeys(tmpRowKeys);
      unitRef.current!.setSelectionRows(tmpRows);
      const addNum = tmpRows.length;
      unitRef?.current?.setGridHeaderInfoCustomer(getGridHeaderInfo(addNum));
    },
    afterReload: (param: any) => {
      const { unitRef } = param;
      unitRef.current?.setSelectionRowKeys(selectKeys);
      unitRef.current?.setSelectionRows(selectRows);
    },
    addFpxx: (param: any) => {
      if (selectRows.length === 0) {
        message.info(intl2.formatMessage({ id: 'message_znpd_pmpd_fpxx_unselected' }));
        return;
      }
      setModalVisible(false);
      mainRef.current.addFpSave(selectRows);
      setSelectKeys([]);
      setSelectRows([]);
      // 提示信息
      message.success(intl2.formatMessage({ id: 'message_znpdsd_addfp_save_success_message' }));
    },
  }

  return (
    <Drawer
      title="添加发票"
      destroyOnClose={true}
      className='dd_data_page_modal'
      visible={modalVisible}
      width={pro.c_modal_width_x4}
      onClose={() => setModalVisible(false)}
      maskClosable={false}
    >
      <DDBunit2 config={fpConfig} func={Func} />
    </Drawer>
  );
}

export default Tjfp;
