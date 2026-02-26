const theme_config_03: any = {
  darkAlgorithm: false,
  layoutToken: {
    bgLayout: '#eaeaea',                  // ProComponents/ProLayout - Layout Token
    header: {                             // ProComponents/ProLayout - Header Token
      colorBgHeader: '#9AA477',               // header 的背景颜色 1
      colorHeaderTitle: '#F5F5F0',            // header 标题字体颜色 2
      colorTextMenu: '#F5F5F0',               // menuItem 的字体颜色 3
      colorTextMenuActive: '#F5F5F0',         // menuItem hover 的选中字体颜色  2级菜单 4
      colorTextMenuSelected: '#ffffff',       // menuItem 的选中字体颜色  2级菜单 5
      colorBgMenuItemHover: '#828A65',        // menuItem 的 hover 背景颜色 6
      colorBgMenuItemSelected: '#828A65',     // menuItem 的选中背景颜色 7
    },
    sider: {
      colorMenuBackground: '#9AA477',                   // 背景色
      colorTextMenuTitle: '#F5F5F0',                    // 标题色
      colorMenuItemDivider: '#F5F5F0',                  // 分割线的颜色
      colorTextMenu: '#F5F5F0',                         // 字体色
      // colorTextMenuSecondary: '#ff0049',             // menu 的二级字体颜色，比如 footer 和 action 的 icon	colorText
      colorTextMenuSelected: '#F5F5F0',                 // 菜单选中色
      colorTextMenuActive: '#F5F5F0',                   // 一级悬浮选中色 子菜单选中时外层菜单字体色
      colorTextMenuItemHover: '#ffffff',                // 菜单悬浮色
      colorBgMenuItemActive: '#828A65',                 // 菜单点击背景色
      colorBgMenuItemHover: '#828A65',                  // 菜单悬浮背景色
      colorBgMenuItemSelected: '#828A65',               // 菜单选中背景色
      // colorBgMenuItemCollapsedElevated: '#ff0049',   // 收起 menuItem 的弹出菜单背景颜色	transparent
      colorBgCollapsedButton: '#B5BD99',                // 展开收起按钮背景颜
      colorTextCollapsedButton: '#F5F5F0',              // 展开收起按钮字体色
      colorTextCollapsedButtonHover: '#ffffff',         // 展开收起按钮字体悬浮色
    }
  },
  token: {
    // SeedToken
    colorInfo: '#9AA477',               // 用于表示操作信息的 Token 序列，如 Alert 、Tag、 Progress 等组件都有用到该组梯度变量
    colorLink: '#2984cb',               // 控制超链接的颜色
    colorPrimary: '#9AA477',            // 品牌色是体现产品特性和传播理念最直观的视觉元素之一
    colorError: '#ff6666',              // 用于表示操作失败的 Token 序列，如失败按钮、错误状态提示（Result）组件等。
    colorWarning: '#ff8400',            // 用于表示操作警告的 Token 序列，如 Notification、 Alert等警告类组件或 Input 输入类等组件会使用该组梯度变量。
    colorSuccess: '#9AA477',            // 用于表示操作成功的 Token 序列，如 Result、Progress 等组件会使用该组梯度变量。
    colorBgBase: '#F5F5F0',             // 用于派生背景色梯度的基础变量
    // colorLinkActive: '#ff0049'	,     // 控制超链接被点击时的颜色
    // colorLinkHover: '#ff0049'	,     // 控制超链接悬浮时的颜色
    // MapToken
    colorInfoText: '#1d5d00',           // 信息色的文本默认态
    colorBorder: '#909777',             // 默认使用的边框颜色, 用于分割不同的元素，例如：表单的分割线、卡片的分割线等
    colorBorderSecondary: '#b2b6a1',    // 比默认使用的边框色要浅一级，此颜色和 colorSplit 的颜色一致。使用的是实色
    colorFillQuaternary: '#f2f3ee',     // 最弱一级的填充色，适用于不易引起注意的色块，例如斑马纹、区分边界的色块等
    colorBgContainer: '#ffffff',        // 组件的容器背景色，例如：默认按钮、输入框等
    // colorBgElevated: '#ff0049',      // 浮层容器背景色，在暗色模式下该 token 的色值会比 `colorBgContainer` 要亮一些。例如：模态框、弹出框、菜单等
    colorText: 'rgba(0,0,0,0.88)',    // 最深的文本色
    cusBgLayout: '#eaeaea',             // 自定义色彩 useToken中无法获取layoutToken.bgLayout
    // cusBg1: '#ff0049',               // 自定义色彩
  },
  components: {
    Tag: {
      defaultBg: '#1d5d00',
      colorBorder: '#1d5d00',
      colorInfoBg: '#0A6ED1',
      colorInfoBorder: '#0A6ED1',
      colorWarning: '#ff8400',
      colorWarningBorder: '#ff8400',
      colorSuccess: '#1d5d00',
      colorSuccessBorder: '#1d5d00',
      colorError: '#ff6666',
      colorErrorBorder: '#ff6666',
      colorErrorBg: 'transparent',
    },
    Layout: {
      headerColor: '#F5F5F0',
      // headerPadding: '200px 200px', // [ok]
      // fontSize: 20, // [ok]
    },
    Menu: {
      subMenuItemSelectedColor: '#ffffff',
    },
    Table: {
      colorBgContainer: '#ffffff',
    },
  }
}

export default theme_config_03;