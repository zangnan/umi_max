import myUtil from '../DDAssist/util';
import { Radio, Input, Space, Tooltip, Button, Tag, Badge, message, Typography } from 'antd';

let tableUtilS2: any = {};

// 列表工具类
tableUtilS2 = {
  // 列表初始化入口
  initColumn(cols: any) {
    // 冻结列
    let colCount = 0; // 冻结列的数量，从左侧开始计数
    let trailingColCount = 0; // 冻结列的数量，从右侧开始计数
    const newCol = cols.map((item: any) => {
      if (item?.fixed === 'left') {
        colCount++;
      }
      if (item?.fixed === 'right') {
        trailingColCount++;
      }
      item.field = item.dataIndex;
      item.name = item.title;
      return item;
    });
    //  渲染列
    cols.forEach((col: any) => {
      tableUtilS2.initRender(col);
    });
    return {
      column: newCol || [],
      colCount,
      trailingColCount,
    };
  },
  // 渲染列入口
  initRender: (col: any) => {
    if (col.render && typeof (col.render) !== 'function' && !col.codeTable) {
      const { type, format, func: RenderFunc, map, tag, circle, icon, mask, copy, poweroff,timeEasyRead } = col.render;
      if (type === 'number') {
        // 格式化数值格式
        col.formatter = (text: any, record: any, meta: any) => {
          if (text && text.toString().indexOf('／') > -1) {
            const arr = text.split('／');
            return myUtil.grid.formatNum(arr[0], format) + '／' + myUtil.grid.formatNum(arr[1], format);
          } else if (text && text.toString().indexOf('/') > -1) {
            const arr = text.split('/');
            return myUtil.grid.formatNum(arr[0], format) + '/' + myUtil.grid.formatNum(arr[1], format);
          } else {
            return myUtil.grid.formatNum(text, format);
          }
        }
      } else if (type === 'date') {
        // 格式化日期格式
        col.formatter = (text: any) => {
          return myUtil.grid.formatDate(text, format);
        }
      }
    }
  },
};

export default tableUtilS2;
