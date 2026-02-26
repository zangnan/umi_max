import React from 'react';
import { cloneDeep } from 'lodash';
import myUtil from '@/components/DDAssist/util';

const FuncModule: any = {
  refUnit: React.createRef(),
};

// onDropdownMenuClick
FuncModule.onDropdownMenuClick = ({col, row, menuKey, tableInstance, myRecordsChanged, grid_row_key }: any) => {
  let recordByCell =  cloneDeep(tableInstance.getRecordByCell(col, row));
  if (menuKey === '向下插入数据') {
    const recordIndex = tableInstance.getRecordShowIndexByCell(col, row);
    recordByCell[grid_row_key] = myUtil.text.uuid();
    recordByCell.editType = 'add';
    tableInstance.addRecord(recordByCell, recordIndex + 1);
    myRecordsChanged.push({ ...recordByCell, recordRowIndex: row });
  } else if (menuKey === '向下插入空行') {
    const recordIndex = tableInstance.getRecordShowIndexByCell(col, row);
    recordByCell.editType = 'add';
    tableInstance.addRecord({}, recordIndex+1);
  } else if (menuKey === '删除该行') {
    const recordIndex = tableInstance.getRecordShowIndexByCell(col, row);
    tableInstance.deleteRecords([recordIndex]);
    let changedIndex = myRecordsChanged.findIndex((tmp: any) => {
      return tmp[grid_row_key] === recordByCell[grid_row_key];
    });
    if (changedIndex < 0) {
      myRecordsChanged.push({ ...recordByCell, recordRowIndex: row, editType: 'delete' });
    } else {
      let editType = recordByCell.editType;
      if (editType === 'add') { // 当前行为新建行，则从变更数据列表删除
        myRecordsChanged.splice(changedIndex, 1);
      } else { // 当前行为变更行
        myRecordsChanged[changedIndex] = { ...recordByCell, recordRowIndex: row, editType: 'delete' };
      }
    }
  }
  // else if (menuKey === '修改掉整行值') {
  //   let testData: any = {
  //     ckbgdh: '11111',
  //     jgfsDm2: '22222',
  //   }
  //   const recordIndex = tableInstance.getRecordShowIndexByCell(col, row);
  //   tableInstance.updateRecords([testData], [recordIndex]);
  // }
  // else if (menuKey === '修改值'){
  //   tableInstance.startEditCell(col, row);
  // }
}

// onReady
// FuncModule.onReady = ({tableInstance, isFirst, myRecordsChanged, grid_row_key,}: any) => {
//   if (isFirst) {
//     tableInstance.on('dropdown_menu_click', (args: any) => {})
//   }
// }

export default FuncModule;