import XLSXStyle from 'xlsx-style';
import XLSX_SAVE from 'file-saver';
import { utils } from 'xlsx';
import { cloneDeep } from 'lodash';

const excelUtil: any = {};

// excel 样式 border
const excelStyleBorder: any = {
  top: { style: 'thin', color: { rgb: '000000' } },
  bottom: { style: 'thin', color: { rgb: '000000' } },
  left: { style: 'thin', color: { rgb: '000000' } },
  right: { style: 'thin', color: { rgb: '000000' } }
};

// excel 样式
const excelStyle: any = {
  header: {
    font: { sz: 9, bold: true, name: '微软雅黑', color: { rgb: '632523' } },
    alignment: { horizontal: 'left', vertical: 'center', wrapText: true }, // 设置标题水平竖直方向居中，并自动换行展示
    fill: { fgColor: { rgb: 'FDE9D9' }}, // 设置标题单元格的背景颜色 }
    border: excelStyleBorder,
  },
  groupTitle: {
    font: { sz: 11, bold: true, name: '微软雅黑', color: { rgb: '632523' } },
    alignment: { horizontal: 'left', vertical: 'center', wrapText: true }, // 设置标题水平竖直方向居中，并自动换行展示
    fill: { fgColor: { rgb: 'fcd5b4' }}, // 设置标题单元格的背景颜色 }
    border: excelStyleBorder,
  },
  body: {
    font: { sz: 9, name: '微软雅黑' },
    alignment: { vertical: 'center', wrapText: true },
    border: excelStyleBorder,
  },
  sum: {
    font: { sz: 9, bold: true, name: '微软雅黑', color: { rgb: '632523' } },
    alignment: { horizontal: 'right', vertical: 'center', wrapText: true }, // 设置标题水平竖直方向居中，并自动换行展示
    fill: { fgColor: { rgb: 'FDE9D9' }}, // 设置标题单元格的背景颜色 }
    border: excelStyleBorder,
  },
}

// s2ab
const s2ab = (s: any) => {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  // eslint-disable-next-line no-bitwise
  for (let i = 0; i !== s.length; i += 1) view[i] = s.charCodeAt(i) & 0xFF;
  return buf;
}

// writeExcel
const writeExcel= (param: any) => {
  let { sheetData, excelName, setMasker } = param;
  // 简单理解为在内存中 创建一个xlsx 文件
  const newWorkBook = utils.book_new();
  // 把worksheet添加到workbook中
  if (Array.isArray(sheetData)) {
    sheetData.forEach((item: any) => {
      utils.book_append_sheet(newWorkBook, item.data, item.name);
    });
  } else {
    utils.book_append_sheet(newWorkBook, sheetData.data, sheetData.name);
  }
  // 写入文件, CHROME浏览器会直接下载, 后面的是文件名称和后缀XLSXStyle
  const wopts = {
    bookType: 'xlsx', // 要生成的文件类型
    bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
    type: 'binary',
  };
  const wbout = XLSXStyle.write(newWorkBook, wopts);
  XLSX_SAVE.saveAs(
    new Blob([s2ab(wbout)], {
      type: 'application/octet-stream',
    }),
    excelName,
  )
  if (setMasker) {
    setMasker(false);
  }
}

excelUtil.getOneSheetData = ({gridData, cols, sheetName, showIndex }: any) => {
  // 首行索引
  const colKey: any = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ', 'AK', 'AL', 'AM', 'AN', 'AO', 'AP', 'AQ', 'AR', 'AS', 'AT', 'AU', 'AV', 'AW', 'AX', 'AY', 'AZ'];
  const headerRowKey: any = ['A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1', 'H1', 'I1', 'J1', 'K1', 'L1', 'M1', 'N1', 'O1', 'P1', 'Q1', 'R1', 'S1', 'T1', 'U1', 'V1', 'W1', 'X1', 'Y1', 'Z1', 'AA1', 'AB1', 'AC1', 'AD1', 'AE1', 'AF1', 'AG1', 'AH1', 'AI1', 'AJ1', 'AK1', 'AL1', 'AM1', 'AN1', 'AO1', 'AP1', 'AQ1', 'AR1', 'AS1', 'AT1', 'AU1', 'AV1', 'AW1', 'AX1', 'AY1', 'AZ1'];
  // 处理序列
  if (showIndex) {
    cols.unshift({ title: '序号', dataIndex: 'no', width: 60, align: 'center', type: 'number' });
    gridData.forEach((rowData: any, index: any) => {
      rowData.no = index + 1;
    });
  }
  // 列展现方式
  const numberTypeCol: any = [];     // 数值类型列
  const alignCenterCol: any = []; // 居中列
  const alignRightCol: any = [];  // 居右列 （数值类型默认居右，无需设置）
  const groupTitleRow: any = [];  // 数据组标题行索引
  // debugger;
  cols.forEach((col: any, index: number) => {
    if (col?.type === 'number') {
      // numberTypeCol.push(headerRowKey[index].replace('1', '')); // 存放列头名称
      // numberTypeCol.push(index); // 存放列头序号
      let tmpNumberTypeObj: any = { index };
      if (col?.renderOriginal) {
        tmpNumberTypeObj.format = col.renderOriginal.format;
      }
      numberTypeCol.push(tmpNumberTypeObj); // 存放列头序号 及格式化格式
    }
    if (col?.align === 'center') {
      // debugger
      // numberAlignCenter.push(headerRowKey[index].replace('1', ''));
      alignCenterCol.push(index); // 存放列头序号
    }
    if (col?.align === 'right') {
      // debugger
      // numberAlignRight.push(headerRowKey[index].replace('1', ''));
      alignRightCol.push(index); // 存放列头序号
    }
  });
  // 表头格式转换 ['a', 'b', 'c', 'd'...]
  const colsTmp: any = [];
  cols.forEach((col: any) => {
    colsTmp.push(col.dataIndex);
  });
  // 数据元1: 删除未在col中的数据
  // gridData?.forEach((row: any) => {
  //   if (row.excelRowType === 'title') {
  //     // 处理数据组标题行
  //   } else{
  //     Object.keys(row).forEach(key => {
  //       if (key === 'rowSpan') {
  //         return;
  //       }
  //       if (colsTmp.indexOf(key) === - 1) {
  //         delete row[key];
  //       }
  //     });
  //   }
  // });
  // 数据元2
  const gridHeader: any = {};
  cols.forEach((col: any) => {
    gridHeader[col.dataIndex] = col.title;
  });
  // debugger;
  const sheet = [gridHeader, ...(gridData || [])];
  // 处理合计行
  const sumRow: any = {};
  let sumRowFlag: any = false;
  cols.forEach((col: any) => {
    if (col?.sum) {
      sumRowFlag = true;
      let sumTmp = gridData.reduce((prev: any, curr: any) => prev + parseInt(curr[col.dataIndex]), 0)
      sumRow[col.dataIndex] = sumTmp;
    } else {
      sumRow[col.dataIndex] = '';
    }
  });
  if (sumRowFlag) {
    sheet.push(sumRow);
  }

  // 设置合并单元格
  // s 意为 start ，即开始的单元格
  // r 是 row ，表示行号，从 0 计起
  // c 是 col ，表示列号，从 0 计起
  const merge: any = [];
  // 处理数据组标题行合并
  sheet.forEach((item: any, index: number) => {
    if (item.excelRowType === 'title') {
      item[cols[0].dataIndex] = item.title;
      item[cols[cols.length - 1].dataIndex] = ''; // 设置最后一列数据为 '', 否则边框不显示
      merge.push({s: {r: index, c: 0}, e: {r: index, c: cols.length - 1}});
      delete item.excelRowType;
      delete item.title;
      groupTitleRow.push(index);
    }
  })
  // 处理数据中的合并列，应用开发工具 硬编码，-_-||
  sheet.forEach((item: any, index: number) => {
    const item2: any = { ...item };
    if (item2?.colSpan) {
      if (index === 0) {
        merge.push({
          s: {r: index, c: 1},   // 开始坐标：第1行第1列（注意索引是从0开始）
          e: {r: index, c: 5}    // 结束坐标：第1行第2列
        });
      } else {
        merge.push({
          s: {r: index, c: item2?.colSpan[0]},   // 开始坐标：第1行第1列（注意索引是从0开始）
          e: {r: index, c: item2?.colSpan[1]}    // 结束坐标：第1行第2列
        });
      }
      delete item2.colSpan;
      sheet[index] = item2;
    }
  })
  // 处理数据中的合并行，RPA 硬编码，-_-||
  sheet.forEach((item: any, index: number) => {
    const item2: any = { ...item };
    if (item2?.rowSpan > 1) {
      merge.push({ s: { r: index, c: 2 }, e: { r: index + item2?.rowSpan - 1, c: 2 } });
      merge.push({ s: { r: index, c: 3 }, e: { r: index + item2?.rowSpan - 1, c: 3 } });
      merge.push({ s: { r: index, c: 7 }, e: { r: index + item2?.rowSpan - 1, c: 7 } });
    }
    delete item2.rowSpan;
    sheet[index] = item2;
  });
  // merge.push({ s: { r: sheet.length - 1, c: 0 }, e: { r: sheet.length - 1, c: 5 } }); // 合计行
  // merge.push({ s: { r: sheet.length - 1, c: 6 }, e: { r: sheet.length - 1, c: 7 } }); // 合计行
  // 数据处理：
  // 创建一个sheet表格   使用json_to_sheet, 数据格式比较为  数组包对象, 不然会报错
  const worksheet: any = utils.json_to_sheet(sheet, {
    // 这里可以通过设置header, 来对导出数据 列 顺序的排序
    // 实测可以只写一部分, 也可以整体排序
    // ["id", "name", "age"] 相当于把上面整个表头给限制顺序了
    // header: ["age"],
    // 跳过 Header, 就是把原来表格数据的表头去掉了,gridHeader渲染的数据 "冒充" 表头了
    skipHeader: true,
  });

  // 设置工作表的记录范围，[列号][行号]，A1 则代表 A 列的第1行
  // 列数一般是已知的（未知时可以设置为ZZ）
  // 行数则以 xlsxData 内容的长度结束即可
  // worksheet['!ref'] = `A1:AI${sheet.length + 2}`;

  worksheet['!merges'] = merge;
  Object.keys(worksheet).map((key: any) => {
    // debugger;
    if (key.indexOf('!') !== 0) { // 每个不以！开头的键！映射到单元格（使用A-1表示法）
      if (headerRowKey.indexOf(key) > -1) { // 标题行
        let defaultBgColor = cloneDeep(excelStyle.header);
        let tmpTargetCol = cols?.find((item: any) => { return item.title === worksheet[key].v });
        if (tmpTargetCol?.headerBgColor) {
          defaultBgColor.fill.fgColor.rgb = tmpTargetCol.headerBgColor;
        }
        // header: {
        //   font: { sz: 10, bold: true, name: '微软雅黑', color: { rgb: '632523' } },
        //   alignment: { horizontal: 'center', vertical: 'center', wrapText: true }, // 设置标题水平竖直方向居中，并自动换行展示
        //   fill: { fgColor: { rgb: 'FDE9D9' }}, // 设置标题单元格的背景颜色 }
        //   border: excelStyleBorder,
        // },
        if (tmpTargetCol?.headerColor) {
          defaultBgColor.font.color.rgb = tmpTargetCol?.headerColor;
        }
        worksheet[key].s = defaultBgColor;
      } else {
        const replacedKey = key.replace(/\d+/g, '');
        worksheet[key].s = excelStyle.body;
        // 处理居中显示
        alignCenterCol.forEach((tmp: any) => {
          // 数值类型
          if (replacedKey === colKey[tmp]) {
            let bodyTmp = cloneDeep(excelStyle.body);
            bodyTmp.alignment.horizontal = 'center';
            worksheet[key].s = bodyTmp;
            return;
          }
        });
        // 处理居右显示
        alignRightCol.forEach((tmp: any) => {
          // 数值类型
          if (replacedKey === colKey[tmp]) {
            let bodyTmp = cloneDeep(excelStyle.body);
            bodyTmp.alignment.horizontal = 'right';
            worksheet[key].s = bodyTmp;
            return;
          }
        });
        worksheet[key].z = 'General';
        worksheet[key].t = 's'; // 单元格类型：b布尔值，n数字，e错误，s字符串，d日期
        numberTypeCol.forEach((tmp: any) => {
          // 数值类型
          if (replacedKey === colKey[tmp?.index]) {
            // debugger;
            worksheet[key].t = 'n'; // 单元格类型：b布尔值，n数字，e错误，s字符串，d日期
            // worksheet[key].c = 'hahah'
            // worksheet[key].w = '99,000,111.123';
            if (tmp?.format) {
              worksheet[key].z = tmp?.format; // eg: '0.000'
            }
            return;
          }
        });
      }
      if (sumRowFlag) {
        let aa = gridData.length + 2
        if (key.indexOf(aa + '') > -1) { // 标题行
          worksheet[key].s = excelStyle.sum;
        }
      }
    }
    return worksheet[key];
  });

  // 数据组标题行 样式
  groupTitleRow.forEach((tmp: any) => {
    let defaultBgColor = cloneDeep(excelStyle.groupTitle);
    worksheet[`A${tmp + 1}`].s = defaultBgColor;
  })

  // 3.4 设置单元格的宽度，此时需要每个单元格都进行设置
  const gridHeaderWidth: any = [];
  // debugger;
  cols.forEach((col: any) => {
    gridHeaderWidth.push({wpx: col?.width || 200});
  });
  // debugger;
  worksheet['!cols'] = gridHeaderWidth;


  // const groupHeight: any = [];
  // groupHeight.push({hpx: 50})
  // worksheet["!rows"] = [];
  // worksheet['H:1']= { hpx: 230 };
  // worksheet["!rows"].push({hpt: 200});
  // worksheet["!rows"].push({hpt: 200});
  // worksheet["!rows"].push({hpt: 200});
  // worksheet["!rows"].push({hpt: 200});
  // worksheet["!rows"].1 = {};
  // if(!worksheet["!rows"][1]) worksh.eet["!rows"][1] = {hpx: 200};
  // worksheet["!rows"][1].hpx = 500;.
  // worksheet["!rows"][1] = { hpx: 50 };


  return {data: worksheet, name: sheetName }
}

// export
excelUtil.export = ({excelName, sheetData, setMasker}: any) => {
  if (setMasker) {
    setMasker(true);
  }
  const sheetDataTmp: any = [];
  sheetData.forEach((item: any) => {

    // 清洗数据，删除不不必要字段数据
    const colsTmp: any = [];
    item.cols.forEach((col: any) => {
      colsTmp.push(col.dataIndex);
    });
    let gridData = item.gridData;
    // 数据元1: 删除未在col中的数据
    gridData?.forEach((row: any) => {
      if (row.excelRowType === 'title') {
        // 处理数据组标题行
        Object.keys(row).forEach(key => {
          if (key !== 'excelRowType' && key !== 'title') {
            delete row[key];
          }
        });
      } else{
        Object.keys(row).forEach(key => {
          if (key === 'rowSpan') {
            return;
          }
          if (colsTmp.indexOf(key) === - 1) {
            delete row[key];
          }
        });
      }
    });
    // debugger;
    sheetDataTmp.push(excelUtil.getOneSheetData({
      // gridData: item.gridData,
      gridData,
      cols: item.cols,
      sheetName: item.sheetName,
      showIndex: item.showIndex,
    }))
  });
  writeExcel({
    sheetData: sheetDataTmp,
    excelName,
    setMasker,
  });
}

// readSheet
excelUtil.readSheet = (excelData: any) => {
  let workbook = XLSX.read(excelData, { type: 'binary' })
  let sheetNames = workbook.SheetNames || []; // 工作表名称集合
  let res: any = [];
  sheetNames.forEach((item: any) => {
    let worksheetTmp = workbook.Sheets[item];
    let jsonResTmp = XLSX.utils.sheet_to_json(worksheetTmp, {defval: null});
    res.push({
      sheet: worksheetTmp,
      jsonData: jsonResTmp,
      sheetName: item,
    });
  });
  return res;
}

export default excelUtil;