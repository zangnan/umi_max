/**
 * title: 备案单证 - 单证备案 - 资料采集 - 单证信息弹窗
 */
const dzxxConfig: any = {};

dzxxConfig.grid_show_serial_number = false;                         // 是否显示序号，默认不显示
dzxxConfig.grid_selection_type = "checkbox";                        // 列表首选项类别，默认 checkbox，可选 false radio checkbox
dzxxConfig.grid_show_data_num = false;                              // 工具栏左侧是否显示数据条数及选中数，默认true显示
dzxxConfig.layout_type = 'modal';                                   // 页面类型，默认default 可选 default modal tabs tz台账
dzxxConfig.pagination2 = false;
dzxxConfig.grid_row_key = 'badzbgduuid';

// 配置项：列表列
dzxxConfig.grid_columns = [
  { title: '单证名称', dataIndex: 'badzlxmc', width: 130, ellipsis: true },
  { title: '单证编号', dataIndex: 'badzbh', width: 130, ellipsis: true },
  { title: '业务编号', dataIndex: 'ywbh', width: 100, ellipsis: true },
  { title: '单证说明', dataIndex: 'badzsm', width: 160, ellipsis: true },
];

// 配置项：筛选_普通筛选 页面最上方 第一层筛选
dzxxConfig.filter_items = [
  { name: 'badzlxDm', label: '单证名称', type: 'TreeSelect', isSelectLeaf: true, showSearch: true, labelInValue: false, treeTable: ['TREE_BADZ_CS_ZXSB_BADZLX_ALL', ''] },
  { name: 'badzbh', label: '单证编号', type: 'Input', searchButton: true },
  { name: 'ywbh', label: '业务编号', type: 'Input' },
];

dzxxConfig.toolbar_default = {
  setting: true,                    // 是否显示设置按钮，默认关闭
  full: true,                       // 是否显示全屏按钮，默认关闭
  reload: true,                     // 是否显示刷新按钮，默认关闭
};

export default dzxxConfig;
