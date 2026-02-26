import React, { useState, useRef, useImperativeHandle, memo } from 'react';
import { Button, Modal } from 'antd';
import DDColumn from './setting_column';
import CONSTANTS from '../DDAssist/constants';
import excelUtil from '../DDAssist/util/excelUtil';
import { cloneDeep } from 'lodash';
import myUtil from '../DDAssist/util';
import printJS from 'print-js'

export interface DDGridViewSettingProps {
  onRef?: any;
  visible?: any;
  settingDataColumn?: any;
}

const DDGridViewSetting: React.FC<DDGridViewSettingProps> = ({
  onRef,
  visible = false,
  settingDataColumn = [ // 测试数据
    // { title: '报关单号', dataIndex: 'ckbgdh', width: 180, align: 'left', fixed: 'left' },
    // { title: '项号', dataIndex: 'xh4', width: 60, align: 'center', fixed: 'left' },
    // { title: '出口日期', dataIndex: 'ckrq1', width: 120, align: 'center' },
    // { title: '成交单位', dataIndex: 'hgjldwmc', width: 90, align: 'center', ellipsis: true },
    // { title: '成交数量', dataIndex: 'cjsl1', width: 140, align: 'right' },
    // { title: '第二单位数量', dataIndex: 'decksl', width: 140, align: 'right' },
  ],
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [gridData, setGridData] = useState<any>([]);
  const [sheetName, setSheetName] = useState<any>([]);
  const [excelName, setExcelName] = useState<any>([]);
  const [mySettingDataColumn, setMySettingDataColumn] = useState<any>(settingDataColumn || []);
  const [refUnitCurrent, setRefUnitCurrent] = useState<any>([]);
  const refDDGridViewColumn: any = useRef();
  const [actionType, setActionType] = useState<any>(''); // 导出Excel或打印

  // 开启
  const showModal = (param: any) => {
    setGridData(param.gridData || []);
    setSheetName(param.sheetName || '导出数据');
    setExcelName(param.excelName || '导出数据');
    setActionType(param.actionType);
    setRefUnitCurrent(param?.param?.refUnit?.current)
    let aa = cloneDeep(myUtil.grid.formatColToPlain([...settingDataColumn]));
    for (let i = 0; i < aa.length; i++) {
      if (aa[i].codeTable) {
        aa[i].dataIndex = aa[i].dataIndex + '___code_table_val';
      }
    }
    setMySettingDataColumn(aa);
    setModalVisible(true);
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  // 获取视图数据
  const getViewConfig = () => {
    // 列
    const column: any = refDDGridViewColumn?.current?.getSettingColumn();
    return {
      column,
    }
  }

  // 更新视图
  const saveView = () => {
    const viewConfig = getViewConfig();
    const exportData: any = cloneDeep(gridData);
    let colShow = viewConfig?.column?.show || [];
    let cols: any = [];
    for (let i = 0; i < colShow.length; i++) {
      if (colShow[i].children) {
        cols = [ ...cols, ...colShow[i].children];
      } else {
        cols.push(colShow[i]);
      }
    }
    if (actionType === 'print') { // 打印
      cols.forEach((itemTmp: any) => {
        itemTmp.field = itemTmp.dataIndex || '';
        itemTmp.displayName = itemTmp.title || '';
      });
      printJS({
        type: 'json',
        printable: exportData,
        properties: cols,
      })
    } else { // 导出
      excelUtil.export({
        // excelName: `${excelName}_${myUtil.date.formatDate(new Date(), 'YYYYMMDD.hhmmss')}.xlsx`,
        excelName: excelName,
        setMasker: refUnitCurrent?.setMasker,
        sheetData: [
          { gridData: exportData, sheetName, cols: cols },
        ]
      });
    }
    setModalVisible(false);
  };

  return (
    <>
      <Modal
        title="列设置"
        centered
        destroyOnHidden
        open={modalVisible}
        wrapClassName='standard-modal-1'
        width={CONSTANTS.C_MODAL_WIDTH_X2}
        onCancel={() => setModalVisible(false)}
        footer={(
          <Button onClick={() => saveView()} type="primary">确定</Button>
        )}
      >
        <div className="dd_grid_view_setting_wrap">
          <DDColumn onRef={refDDGridViewColumn} data={mySettingDataColumn}/>
        </div>
      </Modal>
    </>
  );
};
export default memo(DDGridViewSetting);
