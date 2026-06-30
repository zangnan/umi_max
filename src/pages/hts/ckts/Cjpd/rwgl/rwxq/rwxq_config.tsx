import CONSTANTS from '@/components/DDAssist/constants';
// 退税申报
const config: any = {};

config.module_key = 'MTS_SJPP_PDRW_CKMX_QUERY_PAGE';                  // 业务单元key，对应后端接口
config.grid_row_key = 'uuid';
config.grid_show_serial_number = false;                      // 工具栏左侧是否显示数据条数及选中数，默认true显示
config.grid_click_checked = '1';                                 // 是否开启单击或双击勾选事件，1单击勾选，2双击勾选，默认点击不勾选   
config.grid_selection_type = false;
config.toolbar_show_grid_checked_num = false;
config.layout_type = 'modal';

config.form_items = [
  {lable:"ID",type:'GroupTitle',name:'jbxx'},
  {lable:"总条数",type:'Input',name:'zts'},
  {lable:"配单成功",type:'Input',name:'zts'},
  {lable:"配单失败",type:'Input',name:'zts'},
  {lable:"生成成功",type:'Input',name:'zts'},
]

config.customer_toolbar = [];
config.handle_columns = [];
export default config;