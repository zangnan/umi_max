import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',        // dark
  // 拂晓蓝
  primaryColor: '#1890ff',  // 0066cc
  layout: 'mix',           // mix side top
  contentWidth: 'Fluid',
  fixedHeader: true,
  fixSiderbar: true,
  colorWeak: false,
  title: '慧退税平台',
  pwa: false,
  logo: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
  iconfontUrl: '',
  menu:{ locale: false },     // 自定义
  splitMenus: true,
};

export default Settings;
