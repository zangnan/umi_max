const unitConfig: any = {};

unitConfig.grid_type_switch = true;
unitConfig.grid_type = 'list';
unitConfig.grid_list_card_type = 1; // 图片
// 如果开启自定义卡片渲染，则优先采用自定义卡片，grid_list_card_field不启用
unitConfig.grid_list_card_field = {
  title: 'mediaTitle',
  description: 'mediaDescription',
  imagepath: 'mediaUrl',
};

// 配置项：列表列
unitConfig.grid_columns = [
  { title: '媒体名称', dataIndex: 'mediaTitle', width: 160, ellipsis: true },
  { title: '媒体描述', dataIndex: 'mediaDescription', width: 160, ellipsis: true },
  { title: '媒体图片地址', dataIndex: 'mediaUrl', width: 160, ellipsis: true },
];

// 配置项：筛选_普通筛选 页面最上方 第一层筛选
unitConfig.filter_items = [
  { name: 'mediaTitle', label: '媒体名称', type: 'Input', },
];

// 配置项：工具栏
unitConfig.toolbar_default = {
  setting: true,                    // 是否显示设置按钮，默认关闭
  full: true,                       // 是否显示全屏按钮，默认关闭
  reload: true,                     // 是否显示刷新按钮，默认关闭
};

export default unitConfig;