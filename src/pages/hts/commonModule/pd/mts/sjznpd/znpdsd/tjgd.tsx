/**
 * 免退税：手动配单 ----- 添加关单
 */
import React, { useState, useImperativeHandle } from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import CONSTANTS from '@/components/DDAssist/constants';
import { Drawer, message } from 'antd';
import { intl as intl2 } from '@/components/DDAssist/util';
import myUtil from '@/components/DDAssist/util';
import sdpdStyle from './style.less';
import gdConfig from './tjgdconfig';

export interface TjgdProps {
  onRef?: any;
  visible?: any;
}

const Tjgd: React.FC<TjgdProps> = ({ onRef, visible = false }) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [mainRef, setMainRef] = useState<any>('');
  const [notInIds, setNotInIds] = useState<any>([]); // 在配单平衡主页面已经进行过配单的uuid
  const [searchCkspmc, setSearchCkspmc] = useState<string>(''); // 查询商品名称
  const [selectRows, setSelectRows] = useState<any>([]); // 当前选中数据
  const [selectKeys, setSelectKeys] = useState<any>([]); // 当前选中数据

  // 开启
  const showModal = (param: any) => {
    setModalVisible(true);
    setMainRef(param?.ref);
    setSearchCkspmc(param?.ckspmc);
    setNotInIds(param?.notInIds);
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
          条关单明细
        </span>
      </span>
    );
    return tempFragment;
  }

  gdConfig.grid_header_info = getGridHeaderInfo(0);
  gdConfig.filter_items[2].defaultValue = searchCkspmc;
  gdConfig.gridParams = { // 默认查询参数
    initSearchModal: [
      { property: 'ckbgdId', values: notInIds, op: 'nin' },
    ],
  };

  const Func = {
    refUnit: React.createRef(),
    columnsRender: {
      renderZnpdSdFd: (param: any) => {
        const record = param?.record;
        if (String(record?.fdQnt)?.trim() && record?.fdUnit?.trim()) {
          return myUtil.grid.formatNum(record.fdQnt, '0,0.00000') + '/' + record.fdUnit;
        } else {
          return '';
        }
      },
      renderZnpdSdKyFd: (param: any) => {
        const record = param?.record;
        if (String(record?.kyfdQnt)?.trim() && record?.fdUnit?.trim()) {
          return myUtil.grid.formatNum(record.kyfdQnt, '0,0.00000') + '/' + record.fdUnit;
        } else {
          return '';
        }
      },
      renderZnpdSdCj: (param: any) => {
        const record = param?.record;
        if (String(record?.cjQnt).trim() && record?.cjUnit?.trim()) {
          return myUtil.grid.formatNum(record.cjQnt, '0,0.00000') + '/' + record.cjUnit;
        } else {
          return '';
        }
      },
      renderZnpdSdKyCj: (param: any) => {
        const record = param?.record;
        if (String(record?.kycjQnt).trim() && record?.cjUnit?.trim()) {
          return myUtil.grid.formatNum(record.kycjQnt, '0,0.00000') + '/' + record.cjUnit;
        } else {
          return '';
        }
      },
      renderZnpdSdDe: (param: any) => {
        const record = param?.record;
        if (String(record?.fd2Qnt).trim() && record?.fd2Unit?.trim()) {
          return myUtil.grid.formatNum(record.fd2Qnt, '0,0.00000') + '/' + record.fd2Unit;
        } else {
          return '';
        }
      },
      renderZnpdSdKyDe: (param: any) => {
        const record = param?.record;
        if (String(record?.kyfd2Qnt).trim() && record?.fd2Unit?.trim()) {
          return myUtil.grid.formatNum(record.kyfd2Qnt, '0,0.00000') + '/' + record.fd2Unit;
        } else {
          return '';
        }
      }
    },
    // 选中
    onSelect: (param: any) => {
      const { record, selected, refUnit } = param;
      const tmpRowKeys = [...selectKeys];
      const tmpRows = [...selectRows];
      if (selected) {
        tmpRowKeys.push(record.ckbgdId);
        tmpRows.push(record);
      } else {
        const index1 = tmpRowKeys.findIndex((item: any) => record.ckbgdId === item);
        tmpRowKeys.splice(index1, 1);
        const index2 = tmpRows.findIndex((item: any) => record.ckbgdId === item.ckbgdId);
        tmpRows.splice(index2, 1);
      }
      setSelectKeys(tmpRowKeys);
      setSelectRows(tmpRows);
      refUnit.current!.setSelectionRowKeys(tmpRowKeys);
      refUnit.current!.setSelectionRows(tmpRows);
      const addNum = tmpRows.length;
      refUnit?.current?.setGridHeaderInfoCustomer(getGridHeaderInfo(addNum));
    },
    onSelectAll: (param: any) => {
      const { selected, changeRows, refUnit } = param;
      const tmpRowKeys = [...selectKeys];
      const tmpRows = [...selectRows];
      if (selected) {
        changeRows.forEach((item: any) => {
          tmpRowKeys.push(item.ckbgdId);
          tmpRows.push(item);
        })
      } else {
        changeRows.forEach((item: any) => {
          const rowIndex = tmpRows.findIndex((row: any) => row.ckbgdId === item.ckbgdId);
          tmpRows.splice(rowIndex, 1);
          const keyIndex = tmpRowKeys.findIndex((key: any) => key === item.ckbgdId);
          tmpRowKeys.splice(keyIndex, 1);
        });
      }
      setSelectKeys(tmpRowKeys);
      setSelectRows(tmpRows);
      // 设置选中数据
      refUnit.current!.setSelectionRowKeys(tmpRowKeys);
      refUnit.current!.setSelectionRows(tmpRows);
      // 修改页头选中数据提示
      const addNum = tmpRows.length;
      refUnit?.current?.setGridHeaderInfoCustomer(getGridHeaderInfo(addNum));
    },
    afterReload: (param: any) => {
      const { refUnit } = param;
      refUnit.current?.setSelectionRowKeys(selectKeys);
      refUnit.current?.setSelectionRows(selectRows);
    },
    addCkbgd: (param: any) => {
      if (selectRows.length === 0) {
        message.info(intl2.formatMessage({ id: 'message_znpd_pmpd_ckbgd_unselected' }));
        return;
      }
      setModalVisible(false);
      // 可用值替换原始值 确保以前的方法不需要调整
      for (let i = 0; i < selectRows.length; i++) {
        selectRows[i].fdQnt = selectRows[i].kyfdQnt;
        selectRows[i].fd2Qnt = selectRows[i].kyfd2Qnt;
        selectRows[i].cjQnt = selectRows[i].kycjQnt;
      }
      // 改页面展示的是未添加数据
      mainRef.current!.addGdSave(selectRows);
      setSelectKeys([]);
      setSelectRows([]);
      message.success(intl2.formatMessage({ id: 'message_znpdsd_addgd_save_success_message' }));
    },
  }

  return (
    <Drawer
      title="添加关单"
      destroyOnHidden={true}
      className='dd_data_page_modal'
      open={modalVisible}
      width={CONSTANTS.C_MODAL_WIDTH_X4}
      onClose={() => setModalVisible(false)}
      mask={{ closable: false }}
    >
      <DDBunit2 config={gdConfig} func={Func} />
    </Drawer >
  );
}

export default Tjgd;
