const theme_config_01: any = {
  darkAlgorithm: false,
  layoutToken: {
    bgLayout: '#eaeaea',                  // ProComponents/ProLayout - Layout Token
    header: {                             // ProComponents/ProLayout - Header Token
      colorBgHeader: '#32465a',               // header 的背景颜色 1
      colorHeaderTitle: '#ffffff',            // header 标题字体颜色 2
      colorTextMenu: '#d1e8ff',               // menuItem 的字体颜色 3
      colorTextMenuActive: '#ffffff',         // menuItem hover 的选中字体颜色  2级菜单 4
      colorTextMenuSelected: '#ffffff',       // menuItem 的选中字体颜色  2级菜单 5
      colorBgMenuItemHover: '#1e2a36',        // menuItem 的 hover 背景颜色 6
      colorBgMenuItemSelected: '#1e2a36',     // menuItem 的选中背景颜色 7
    },
    sider: {
      colorMenuBackground: '#32465a',                   // 背景色
      colorTextMenuTitle: '#ffffff',                    // 标题色
      colorMenuItemDivider: '#d1e8ff',                  // 分割线的颜色
      colorTextMenu: '#d1e8ff',                         // 字体色
      // colorTextMenuSecondary: '#ff0049',             // menu 的二级字体颜色，比如 footer 和 action 的 icon	colorText
      colorTextMenuSelected: '#ffffff',                 // 菜单选中色
      colorTextMenuActive: '#ffffff',                   // 一级悬浮选中色 子菜单选中时外层菜单字体色
      colorTextMenuItemHover: '#ffffff',                // 菜单悬浮色
      colorBgMenuItemActive: '#1e2a36',                 // 菜单点击背景色
      colorBgMenuItemHover: '#1e2a36',                  // 菜单悬浮背景色
      colorBgMenuItemSelected: '#1e2a36',               // 菜单选中背景色
      // colorBgMenuItemCollapsedElevated: '#ff0049',   // 收起 menuItem 的弹出菜单背景颜色	transparent
      colorBgCollapsedButton: '#1e2a36',                // 展开收起按钮背景颜
      colorTextCollapsedButton: '#d1e8ff',              // 展开收起按钮字体色
      colorTextCollapsedButtonHover: '#ffffff',         // 展开收起按钮字体悬浮色
    }
  },
  token: {
    // SeedToken
    colorInfo: '#0A6ED1',               // 用于表示操作信息的 Token 序列，如 Alert 、Tag、 Progress 等组件都有用到该组梯度变量
    colorLink: '#0A6ED1',               // 控制超链接的颜色
    colorPrimary: '#0A6ED1',            // 品牌色是体现产品特性和传播理念最直观的视觉元素之一
    colorError: '#ff0049',              // 用于表示操作失败的 Token 序列，如失败按钮、错误状态提示（Result）组件等。
    colorWarning: '#e38000',            // 用于表示操作警告的 Token 序列，如 Notification、 Alert等警告类组件或 Input 输入类等组件会使用该组梯度变量。
    colorSuccess: '#339c00',            // 用于表示操作成功的 Token 序列，如 Result、Progress 等组件会使用该组梯度变量。
    // colorBgBase: '#ff0049',          // 用于派生背景色梯度的基础变量
    // colorLinkActive: '#ff0049'	,     // 控制超链接被点击时的颜色
    // colorLinkHover: '#ff0049'	,     // 控制超链接悬浮时的颜色
    // MapToken
    // colorInfoText: '#ff0049',        // 信息色的文本默认态
    colorBorder: '#d9d9d9',             // 默认使用的边框颜色, 用于分割不同的元素，例如：表单的分割线、卡片的分割线等
    colorBorderSecondary: '#dbdbdb',    // 比默认使用的边框色要浅一级，此颜色和 colorSplit 的颜色一致。使用的是实色
    colorFillQuaternary: '#ededed',     // 最弱一级的填充色，适用于不易引起注意的色块，例如斑马纹、区分边界的色块等
    // colorBgContainer: '#ff0049',     // 组件的容器背景色，例如：默认按钮、输入框等
    // colorBgElevated: '#ff0049',      // 浮层容器背景色，在暗色模式下该 token 的色值会比 `colorBgContainer` 要亮一些。例如：模态框、弹出框、菜单等
    colorText: 'rgba(0,0,0,0.88)',    // 最深的文本色
    cusBgLayout: '#eaeaea',             // 自定义色彩 useToken中无法获取layoutToken.bgLayout
    cusBg1: '#f6f6f6',                  // 自定义色彩
  },
  components: {
    Tag: {
      defaultBg: '#f0f0f0',
      colorBorder: '#8e8e8e',
      colorInfoBg: '#eef6ff',
      colorInfoBorder: '#0A6ED1',
      colorWarning: '#e38000',
      colorWarningBorder: '#e38000',
      colorSuccess: '#339c00',
      colorSuccessBorder: '#339c00',
      colorError: '#ff6666',
      colorErrorBorder: '#ff6666',
      colorErrorBg: '#fff3f3',
    },
    Layout: {
      headerColor: '#d1e8ff',             // 顶部文字颜色 （页头右侧按钮区域使用）
      // headerPadding: '200px 200px',    //
      // fontSize: 20,                    //
      // headerBg: '#ff0049',             // Header背景色 token.header.colorBgHeader 的优先级高，未生效 -_-||
      // bodyBg: '#ff0049',               // Header背景色 各种覆盖... -_-||
      // siderBg: '#ff0049',              // 菜单背景色 各种覆盖... -_-||
    },
    Menu: {
      subMenuItemSelectedColor: '#ffffff',
      itemActiveBg: '#1e2a36',
      // dropdownWidth: 500, // [ok]
      // darkItemColor: '#ff0096',
      // darkItemSelectedBg: '#ff0049',
      // darkItemHoverBg: '#ff0049',
      // darkItemHoverColor: '#ff0049',
      // darkItemSelectedColor: '#ff0049',
      // darkItemBg: '#ff0049',
      // darkPopupBg: '#ff0049',
      // darkSubMenuItemBg: '#ff0049',
      // darkGroupTitleColor: '#ff0049',
      // darkItemDisabledColor: '#ff0049',
      // darkDangerItemActiveBg: '#ff0049',
      // darkDangerItemColor: '#ff0049',
      // darkDangerItemHoverColor: '#ff0049',
      // darkDangerItemSelectedBg: '#ff0049',
      // darkDangerItemSelectedColor: '#ff0049',
      // dangerItemActiveBg: '#ff0049',
      // dangerItemColor: '#ff0049',
      // dangerItemHoverColor: '#ff0049',
      // dangerItemSelectedBg: '#ff0049',
      // dangerItemSelectedColor: '#ff0049',
      // itemSelectedBg: '#ff0049',
      // colorBgElevated: '#ff0049',
      // horizontalItemSelectedBg: '#ff0049',
      // popupBg: '#ff0049',
      // subMenuItemBg: '#ff0049',
      // itemSelectedColor: '#ff0049',
      // itemHoverColor: '#ff0049',
      // horizontalItemHoverBg: '#ff0049',
      // colorText: '#ff0049',
      // colorTextLightSolid: '#ff0049',
      // itemHoverBg: '#ff0049',
      // itemColor: '#ff0049',
      // itemBg: '#ff0049',
      // horizontalItemSelectedColor: '#ff0049',
      // groupTitleColor: '#ff0049',
      // horizontalItemHoverColor: '#ff0049',
    },
    // Card: {
    //   bodyPadding: 50,
    //   colorBgContainer: '#ff0096',
    //   actionsBg: '#ff0096',
    //   headerBg: '#ff0096',
    // },
  }
}

export default theme_config_01;