import React from 'react';

const Func: any = {
  refUnit: React.createRef(),
};

// 页面元素初始化后执行 useEffectEnd -> afterReload
Func.onReady = ({tableInstance, isFirst}: any) => {
  let testData: any = {
    ckbgdh: '11111',
    jgfsDm2: '22222',
    hgcjfsmc: '33333',
    hgjldwmc: '44444',
    cjsl: '55555',
  }
  if (isFirst) {
    tableInstance.on('dropdown_menu_click', (args: any) => {
      if (args.menuKey === '向下插入数据') {
        const recordIndex = tableInstance.getRecordShowIndexByCell(args.col, args.row);
        tableInstance.addRecord(testData, recordIndex + 1);
      } else if (args.menuKey === '向下插入空行') {
        const recordIndex = tableInstance.getRecordShowIndexByCell(args.col, args.row);
        tableInstance.addRecord({}, recordIndex+1);
      } else if (args.menuKey === '删除该行') {
        const recordIndex = tableInstance.getRecordShowIndexByCell(args.col, args.row);
        tableInstance.deleteRecords([recordIndex]);
      } else if (args.menuKey === '修改掉整行值') {
        const recordIndex = tableInstance.getRecordShowIndexByCell(args.col, args.row);
        tableInstance.updateRecords([testData], [recordIndex]);
      } else if (args.menuKey === '修改值'){
        tableInstance.startEditCell(args.col, args.row);
      }
    })
  }
}

export default Func;