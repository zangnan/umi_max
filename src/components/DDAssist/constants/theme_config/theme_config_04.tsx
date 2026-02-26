const theme_config_04: any = {
  darkAlgorithm: true,
  layoutToken: {
    bgLayout: '#212830',                  // ProComponents/ProLayout - Layout Token
    header: {                             // ProComponents/ProLayout - Header Token
      colorBgHeader: '#151b23',               // header 的背景颜色 1
      colorHeaderTitle: '#d1d7e0',            // header 标题字体颜色 2
      colorTextMenu: '#ffffffa6',            // menuItem 的字体颜色 3
      colorTextMenuActive: '#ffffff',      // menuItem hover 的选中字体颜色  2级菜单 4
      colorTextMenuSelected: '#ffffff',    // menuItem 的选中字体颜色  2级菜单 5
      colorBgMenuItemHover: '#ffffff08',     // menuItem 的 hover 背景颜色 6
      colorBgMenuItemSelected: '#ffffff08',  // menuItem 的选中背景颜色 7
    },
    sider: {
      colorMenuBackground: 'transparent',                       // 背景色
      colorTextMenuTitle: '#ffffff',                            // 标题色
      // colorMenuItemDivider: '#ff0049',                       // 分割线的颜色
      colorTextMenu: '#ffffffa6',                               // 字体色
      // colorTextMenuSecondary: '#ff0049',                     // menu 的二级字体颜色，比如 footer 和 action 的 icon	colorText
      colorTextMenuSelected: 'rgba(255, 255, 255, 0.95)',     // 菜单选中色
      colorTextMenuActive: 'rgba(0, 0, 0, 0.85)',             // 一级悬浮选中色 子菜单选中时外层菜单字体色
      colorTextMenuItemHover: 'rgba(255, 255, 255, 0.95)',    // 菜单悬浮色
      colorBgMenuItemActive: 'rgba(0, 0, 0, 0.15)',           // 菜单点击背景色
      colorBgMenuItemHover: 'rgba(0, 0, 0, 0.15)',            // 菜单悬浮背景色
      colorBgMenuItemSelected: 'rgba(255, 255, 255, 0.04)',   // 菜单选中背景色
      // colorBgMenuItemCollapsedElevated: 'transparent',       // 收起 menuItem 的弹出菜单背景颜色	transparent
      colorBgCollapsedButton: '#1e2a36',                        // 展开收起按钮背景颜
      colorTextCollapsedButton: '#d1e8ff',                      // 展开收起按钮字体色
      colorTextCollapsedButtonHover: '#ffffff',                 // 展开收起按钮字体悬浮色
    }
  },
  token: {
    // SeedToken
    colorInfo: '#478be6',               // 用于表示操作信息的 Token 序列，如 Alert 、Tag、 Progress 等组件都有用到该组梯度变量
    colorLink: '#478be6',               // 控制超链接的颜色
    colorPrimary: '#347d39',            // 品牌色是体现产品特性和传播理念最直观的视觉元素之一
    colorError: '#ec775c',              // 用于表示操作失败的 Token 序列，如失败按钮、错误状态提示（Result）组件等。
    colorWarning: '#ffd591',            // 用于表示操作警告的 Token 序列，如 Notification、 Alert等警告类组件或 Input 输入类等组件会使用该组梯度变量。
    colorSuccess: '#347d39',            // 用于表示操作成功的 Token 序列，如 Result、Progress 等组件会使用该组梯度变量。
    colorBgBase: '#151b23',             // 用于派生背景色梯度的基础变量
    colorLinkActive: '#69b1ff',         // 控制超链接被点击时的颜色
    colorLinkHover: '#69b1ff',          // 控制超链接悬浮时的颜色
    // MapToken
    colorInfoText: '#478be6',           // 信息色的文本默认态
    colorBorder: '#3d444d',             // 默认使用的边框颜色, 用于分割不同的元素，例如：表单的分割线、卡片的分割线等
    colorBorderSecondary: '#3d444d',    // 比默认使用的边框色要浅一级，此颜色和 colorSplit 的颜色一致。使用的是实色
    colorFillQuaternary: '#262c36',     // 最弱一级的填充色，适用于不易引起注意的色块，例如斑马纹、区分边界的色块等
    colorBgContainer: '#2a313c',        // 组件的容器背景色，例如：默认按钮、输入框等
    colorBgElevated: '#151b23',         // 浮层容器背景色，在暗色模式下该 token 的色值会比 `colorBgContainer` 要亮一些。例如：模态框、弹出框、菜单等
    colorText: '#d1d7e0',               // 最深的文本色
    cusBgLayout: '#212830',             // 自定义色彩 useToken中无法获取layoutToken.bgLayout
    cusBg1: '#202229',                  // 自定义色彩
  },
  components: {
    Tag: {
      defaultBg: '#1e202d',
      colorBorder: '#646987',
      colorInfo: '#478be6',
      colorInfoBorder: '#478be6',
      colorWarning: '#ffd591',
      colorWarningBorder: '#ffd591',
      colorSuccess: '#347d39',
      colorSuccessBorder: '#347d39',
      colorError: '#ec775c',
      colorErrorBorder: '#ec775c',
      colorErrorBg: 'transparent',
    },
    Drawer: {
      colorBgElevated: '#212830',
    },
    // Button: {
    //   colorText: '#00c1de',
    //   colorBorder: '#00c1de',
    // },
    Menu: {
      subMenuItemSelectedColor: '#ffffff',
    },
    Modal: {
      contentBg: '#2a313c',
      headerBg: '#2a313c',
    },
    // Card: {
    //   colorBgContainer: '#ec775c',
    // }
    Table: {
      colorBgContainer: '#212830',
    },
    Tabs: {
      inkBarColor: '#ec775c',
      itemActiveColor: '#ffffff',
      itemSelectedColor: '#d1d7e0',
      itemHoverColor: '#ffffff',
    },
  }
}

export default theme_config_04;