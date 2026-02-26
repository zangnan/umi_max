import React from 'react';
import * as VTable from '@visactor/vtable';

const DDListTableUtil: any = {
  refUnit: React.createRef(),
};

const DEFAULT_FONT_SIZE = 12; // 12 14
const DEFAULT_PADDING = [2, 4, 2, 4]; // [2, 4, 2, 4] [11, 8, 11, 8]

// vtable 默认参数
DDListTableUtil.vtableConfigDefault = {
  editCellTrigger: "click",
  keyboardOptions: {
    copySelected: true,
    pasteValueToCell: true,
    selectAllOnCtrlA: true
  },
  enableLineBreak: true,
  autoWrapText: true,
  dragHeaderMode: 'column', // 可选配置项：'all' | 'none' | 'header' | 'body'，默认为none
  showFrozenIcon: true, // 是否显示冻结图标 默认 true
  // heightMode: 'autoHeight', //  standard 标准模式 默认 | adaptive 自适应容器高度模式 |  autoHeight 自动行高模式
  heightMode: 'standard', //  standard 标准模式 默认 | adaptive 自适应容器高度模式 |  autoHeight 自动行高模式
  theme: VTable.themes.ARCO.extends({
    bottomFrozenStyle: {
      fontFamily: 'PingFang SC',
      fontWeight: 500,
      bgColor: '#f1f1f1',
    },
    scrollStyle: {
      width: 10,
      scrollSliderCornerRadius: 0,
      visible: 'always',
      // hoverOn: false,
      // barToSide: false,
    },
  })
};

// 预制列
DDListTableUtil.css = {
  headerStyle: { bgColor: '#f1f1f1', fontSize: DEFAULT_FONT_SIZE, color: 'black', padding: DEFAULT_PADDING, lineHeight: DEFAULT_FONT_SIZE, borderColor: '#7a7a7a' },
  bodyStyle: { color: 'black', fontSize: DEFAULT_FONT_SIZE, padding: DEFAULT_PADDING, lineHeight: DEFAULT_FONT_SIZE, textAlign: 'left', borderColor: '#7a7a7a' },
  link: { fontSize: DEFAULT_FONT_SIZE, fill: '#0a6ed1' },
};

// 预制按钮
DDListTableUtil.btnDefault = {
  edit: { text: '编辑', fontSize: DEFAULT_FONT_SIZE, fill: '#0a6ed1' },
  delete:{ text: '删除', fontSize: DEFAULT_FONT_SIZE, fill: '#0a6ed1' },
  detail: { text: '详情', fontSize: DEFAULT_FONT_SIZE, fill: '#0a6ed1' },
};

// 预制列
DDListTableUtil.colDefault = {
  checkbox: { field: 'isCheck', title: '', width: 60, headerType: 'checkbox', cellType: 'checkbox',
    // aggregation: {
    //   aggregationType: 'NONE',
    //   showOnTop: true,
    //   formatFun(value: any) {
    //     return '合计';
    //   }
    // }
  },
  index: { title: '序号', width: 'auto', headerStyle: DDListTableUtil.css.headerStyle, style: DDListTableUtil.css.bodyStyle }
};

// 页面元素初始化后执行 useEffectEnd -> afterReload
DDListTableUtil.fun = {
  edit: (param: any) => {
    const { col, row, targetIcon, cellType, target, tableInstance } = param;
    window?.alert?.('111编辑第 ' + (row - tableInstance.columnHeaderLevelCount + 1) + ' 条数据');
  },
  delete: (param: any) => {
    const { row, tableInstance } = param;
    window?.alert?.('444编辑第 ' + (row - tableInstance.columnHeaderLevelCount + 1) + ' 条数据');
    // data.splice(row - tableInstance.columnHeaderLevelCount, 1);
    // tableInstance.setRecords(data);
  },
  detail: (param: any) => {
    const { originData } = param;
    // const value = tableInstance.getCellValue(col, row);
    window?.alert?.('已复制报关单号： ' + originData.ckbgdh);
  },
  handleColumns1: (param: any) => {
    const { originData, key, func } = param;
    window?.alert?.('key： ' + key);
  },
  handleColumns2: (param: any) => {
    const { originData, key, func } = param;
    window?.alert?.('key： ' + key);
  },
  handleColumns3: (param: any) => {
    const { originData, key, func } = param;
    window?.alert?.('key： ' + key);
  },
}

export default DDListTableUtil;