const theme_config_07: any = {
  darkAlgorithm: false,
  layoutToken: {
    bgLayout: '#f0ebe3',
    header: {
      colorBgHeader: '#462944',               // header 的背景颜色 1
      colorHeaderTitle: '#51463B',
      colorTextMenu: '#51463B',
      colorTextMenuActive: '#225555',
      colorTextMenuSelected: '#225555',
      colorBgMenuItemHover: 'rgba(34, 85, 85, 0.1)',
      colorBgMenuItemSelected: 'rgba(34, 85, 85, 0.15)',
    },
    sider: {
      colorMenuBackground: '#462944',
      colorTextMenuTitle: '#ffffff',
      colorMenuItemDivider: 'rgba(34, 85, 85, 0.2)',
      colorTextMenu: '#ffffff',
      colorTextMenuSelected: '#ffffff',
      colorTextMenuActive: '#ffffff',
      colorTextMenuItemHover: '#ffffff',
      colorBgMenuItemActive: 'rgba(34, 85, 85, 0.1)',
      colorBgMenuItemHover: 'rgba(34, 85, 85, 0.1)',
      colorBgMenuItemSelected: 'rgba(87, 41, 77, 0.5)',
      colorBgCollapsedButton: 'rgba(87, 41, 77, 0.5)',
      colorTextCollapsedButton: '#ffffff',
      colorTextCollapsedButtonHover: '#ffffff',
      colorBgMenuItemCollapsedElevated: '#ff0049',   // 收起 menuItem 的弹出菜单背景颜色	transparent
    }
  },
  token: {
    borderRadius: 12,
    borderRadiusLG: 12,
    borderRadiusSM: 12,
    borderRadiusXS: 12,
    motionDurationSlow: '0.2s',
    motionDurationMid: '0.1s',
    motionDurationFast: '0.05s',
  },
  components: {
    Menu: {
      subMenuItemSelectedColor: '#d491c4',
      itemActiveBg: '#1e2a36',
    },
    Button: {
      primaryShadow: 'none',
      dangerShadow: 'none',
      defaultShadow: 'none',
    },
    Modal: {
      boxShadow: 'none',
    },
    Card: {
      colorBgContainer: '#BBAA99',
    },
    Tooltip: {
      borderRadius: 6,
      colorBorder: '#225555',
    },
    Select: {
      optionSelectedBg: '#CBC4AF',
    },
  },
};

export default theme_config_07;