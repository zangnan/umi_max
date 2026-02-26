import { TableColCell, TableDataCell } from '@antv/s2';

export const getTheme = (type: any) => {
  const BORDER_COLOR = type === 'dark' ? 'rgb(39, 44, 65)' : '#dbdbdb';
  const BACK_COLOR = type === 'dark' ? 'rgb(67, 72, 91)' : '#ffffff';
  const HEADER_BACK_COLOR = type === 'dark' ? '#353c59' : '#ededed';
  const CELL_ACTIVE_BACK_COLOR = type === 'dark' ? '#434c6c' : '#ededed';
  const FONT_COLOR = type === 'dark' ? '#ffffff' : '#000000e0';
  return {
    background: {
      color: HEADER_BACK_COLOR,
    },
    cornerCell: {
      cell: {
        horizontalBorderColor: BORDER_COLOR,
        verticalBorderColor: BORDER_COLOR,
        padding: {
          top: 6,
          right: 6,
          bottom: 2,
          left: 6,
        },
        backgroundColor: HEADER_BACK_COLOR,
      },
      text: {
        fill: FONT_COLOR,
      },
      bolderText: {
        fill: FONT_COLOR,
        textAlign: 'left',
        // opacity: 0.4,
      },
    },
    splitLine: {
      horizontalBorderColor: BORDER_COLOR,
      horizontalBorderColorOpacity: 1,
      horizontalBorderWidth: 1,
      verticalBorderColor: BORDER_COLOR,
      verticalBorderColorOpacity: 1,
      verticalBorderWidth: 1,
      showShadow: true,
      shadowWidth: 10,
      shadowColors: {
        left: 'rgba(0,0,0,0.1)',
        right: 'rgba(0,0,0,0)',
      },
    },
    colCell: {
      cell: {
        horizontalBorderColor: BORDER_COLOR,
        verticalBorderColor: BORDER_COLOR,
        verticalBorderWidth: 1,
        horizontalBorderWidth: 1,
        padding: {
          top: 6,
          right: 6,
          bottom: 2,
          left: 6,
        },
        backgroundColor: HEADER_BACK_COLOR,
        interactionState: {
          hover: {
            backgroundColor: CELL_ACTIVE_BACK_COLOR,
            backgroundOpacity: 1,
          },
          selected: {
            backgroundColor: 'rgb(63, 69, 97)',
          },
        },
      },
      text: {
        fill: FONT_COLOR,
        textAlign: 'left',
      },
      bolderText: {
        fill: FONT_COLOR,
        textAlign: 'left',
        fontSize: 14,
        // opacity: 0.4,
      },
    },
    dataCell: {
      icon: {
        size: 14,
        margin: {
          left: 10,
        },
      },
      cell: {
        interactionState: {
          hover: {
            backgroundColor: CELL_ACTIVE_BACK_COLOR,
            backgroundOpacity: 1,
          },
          hoverFocus: {
            backgroundColor: CELL_ACTIVE_BACK_COLOR,
            backgroundOpacity: 1,
            borderColor: 'blue',
          },
          selected: {
            backgroundColor: CELL_ACTIVE_BACK_COLOR,
            backgroundOpacity: 1,
          },
          unselected: {
            backgroundOpacity: 1,
            opacity: 1,
          },
          prepareSelect: {
            borderColor: CELL_ACTIVE_BACK_COLOR,
          },
        },
        horizontalBorderColor: BORDER_COLOR,
        verticalBorderColor: BORDER_COLOR,
        verticalBorderWidth: 1,
        horizontalBorderWidth: 1,
        padding: {
          top: 6,
          right: 6,
          bottom: 2,
          left: 6,
        },
        backgroundColorOpacity: 0.9,
        backgroundColor: BACK_COLOR,
        crossBackgroundColor: BACK_COLOR,
      },
      text: {
        fill: FONT_COLOR,
        textAlign: 'left',
        textBaseline: 'middle',
        fontSize: 14,
      },
    },
    scrollBar: {
      size: 8,
      lineCap: 'square',
    }
  }
};

/**
 * 自定义 ColCell, 通过复写基类方法, 给特定单元格设置文字大小, 颜色等...
 * 查看更多方法 https://github.com/antvis/S2/blob/next/packages/s2-core/src/cell/table-col-cell.ts
 */
export class CustomColCell extends TableColCell {
  getTextStyle() {
    const defaultTextStyle = super.getTextStyle();
    if (this?.meta?.extra?.align === 'right') {
      return {
        ...defaultTextStyle,
        textAlign: 'right',
      };
    }
    // 使用默认处理
    return super.getTextStyle();
  }
}

/**
 * 自定义 TableDataCell，通过复写基类方法, 给特定单元格设置背景色, 文字大小, 颜色等...
 * 查看更多方法 https://github.com/antvis/S2/blob/next/packages/s2-core/src/cell/table-data-cell.ts
 */
export class CustomDataCell extends TableDataCell {
  // getBackgroundColor() {
  //   // 特定数据
  //   if (this.meta.fieldValue >= 6000) {
  //     return {
  //       backgroundColor: 'red',
  //       backgroundColorOpacity: 0.2,
  //     };
  //   }
  //   return super.getBackgroundColor();
  // }
  getTextStyle() {
    const defaultTextStyle = super.getTextStyle();
    // if (this.meta.rowIndex % 2 === 0 || this.meta.colIndex > 0 ||  this.meta.fieldValue >= 600
    // if (this.meta.id === '7-root[&]省份') {
    let currentField = this.meta.valueField;
    let currentFieldObj: any = this.meta?.spreadsheet?.dataCfg?.meta.find((tmp: any) => { return tmp.dataIndex === currentField }) || {};
    if (currentFieldObj.align === 'right') {
      return {
        ...defaultTextStyle,
        textAlign: 'right',
        // fontWeight: 600,
        // fontSize: 16,
        // fill: '#396',
        // opacity: 0.9,
      };
    }
    // 使用默认处理
    return super.getTextStyle();
  }
}