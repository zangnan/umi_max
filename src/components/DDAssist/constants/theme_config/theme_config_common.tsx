import theme_config_01 from './theme_config_01';
import theme_config_02 from './theme_config_02';
import theme_config_03 from './theme_config_03';
import theme_config_04 from './theme_config_04';

const theme_config_common: any = ({compact, borderRadius, fontSize}: any) => {
  return {
    layoutToken: {
      pageContainer: {
        paddingBlockPageContainerContent: compact ? 8 : 16,
        paddingInlinePageContainerContent: compact ? 8 : 16,
      },
      header: {
        heightLayoutHeader: 44,
      },
    },
    token: {
      controlHeight: compact ? 26 : 30, // 按钮和输入框等基础控件的高度
      borderRadius,                     // 基础组件的圆角大小
      padding: compact ? 8 :12,         // 控制元素的内间距 16
      paddingLG: compact ? 8 : 12,      // 控制元素的大内间距	24
      paddingMD: compact ? 8 : 12,      // 控制元素的中等内间距	20
      paddingSM: compact ? 8 : 12,      // 控制元素的小内间距	12
      paddingXL: compact ? 8 : 12,      // 控制元素的特大内间距	32
      paddingXS: compact ? 8 : 8,       // 控制元素的特小内间距	8
      paddingXXS: compact ? 4 : 4,      // 控制元素的极小内间距	4
      fontSize,
    },
    components: {
      Table: {
        padding: compact ? 0 : 16,      // 控制元素的内间距	16
        paddingXS: compact ? 0 : 8,     // 控制元素的特小内间距	8
        paddingXXS: compact ? 0 : 4,    // 控制元素的极小内间距	4
        borderRadiusLG: 0,
        cellPaddingBlock: compact ? 4 : 14,    //	单元格纵向内间距	16
        cellPaddingBlockMD: compact ? 4 : 12,  //	单元格纵向内间距（中等尺寸）	12
        cellPaddingBlockSM: compact ? 4 : 8,   //	单元格纵向内间距（小尺寸）	8
        cellPaddingInline: compact ? 4 : 16,   //	单元格横向内间距（默认大尺寸）	16
        cellPaddingInlineMD: compact ? 4 : 8,  //	单元格横向内间距（中等尺寸）	8
        cellPaddingInlineSM: compact ? 4 : 8,  //	单元格横向内间距（小尺寸）	8
        // lineWidth: 5,
      },
      Card: {
        actionsLiMargin: '0 0',
      },
      Descriptions: {
        titleMarginBottom: 0,
      }
      // Radio: {
      //   buttonSolidCheckedBg: '#dddddd'
      // }
    },
  }
}

export const theme_config: any = {
  theme_config_01,
  theme_config_02,
  theme_config_03,
  theme_config_04,
};

export default theme_config_common;