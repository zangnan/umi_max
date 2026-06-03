import { itemType } from '@/components/DDForm/data.d';


/**
 * title: 商品管理
 * author: zn
*/
const unitConfig: any = {};

// 配置项
unitConfig.grid_api_grid_query = `${API_URL_BASE}/yw/bszx/wbsj/bgd/queryspgl`;   // api 列表查询
unitConfig.grid_show_serial_number = true;                                            // 是否显示序号，可选，默认不显示
unitConfig.grid_row_key = 'uuid';                                                     // 列表主键，默认uuid
unitConfig.form_save_check = false;                                                   // 表单编辑是否执行后端校验
unitConfig.click_checked = '1';
// 配置列表列
unitConfig.grid_columns = [
  { title: '商品代码', dataIndex: 'spdm', align: 'left', ellipsis: true },
  { title: '商品名称', dataIndex: 'spmc', align: 'left', ellipsis: true },
  { title: '税收分类编码', dataIndex: 'ssflbm', align: 'left', ellipsis: true },
  { title: '税收分类名称', dataIndex: 'ssflmc', align: 'left', ellipsis: true },
  { title: '简称', dataIndex: 'ssfljc', align: 'left', ellipsis: true },
  { title: '规格型号', dataIndex: 'ggxh', align: 'left', ellipsis: true },
  { title: '税率', dataIndex: 'sl', align: 'right', ellipsis: true },
  { title: '计量单位', dataIndex: 'jldw', width: 80, align: 'left', ellipsis: true },
  { title: '单价', dataIndex: 'dj', width: 80, align: 'right', ellipsis: true },
  { title: '退税标志', dataIndex: 'tsbz', width: 80, align: 'left', ellipsis: true },
];

// 配置项：列表筛选项
unitConfig.filter_items = [
  { name: 'spdm', label: '商品代码', type: itemType.Input },
  { name: 'spmc', label: '商品名称', type: itemType.Input },
  { name: 'ssflbm', label: '税收分类编码', type: itemType.Input },
];

// 配置项：表单项
unitConfig.form_items = [
  { label: 'ID', type: 'Hidden', name: 'uuid' },
  { label: '基本信息', type: 'GroupTitle', name: 'jbxx' },
  { label: '商品代码', type: 'Input', name: 'khzt' },
  { label: '商品名称', type: 'Input', name: 'gmfmc', },
  { label: '税收分类编码', type: 'Input', name: 'gmfjc' },
  { label: '税收分类名称', type: 'Input', name: 'shxydm' },
  { label: '简称', type: 'Input', name: 'khyh' },
  { label: '规格型号', type: 'Input', name: 'yhzh' },
  { label: '税率', type: 'Input', name: 'jwsfhr', },
  { label: '计量单位', type: 'Input', name: 'gmfdz' },
  { label: '单价', type: 'Input', name: 'gmfdh', },
  { label: '退税标志', type: 'Input', name: 'gmfdh', },
];

export default unitConfig;