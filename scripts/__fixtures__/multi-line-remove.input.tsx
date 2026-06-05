/**
 * title: multi-line-remove 测试
 */
const myConfig: any = {};

myConfig.keep_me = 1;

//外贸
myConfig.wm_grid_columns = [
  { title: '年月', dataIndex: 'tjqDm', width: 100 },
  { title: '计划退税额（元）', dataIndex: 'jhtse', width: 150 },
];

myConfig.also_keep = true;

myConfig.export_key = 'EXPORT';                  // 业务单元key，对应后端接口
myConfig.export_large = true;                    // tssb_download 配合此导出使用，同步大数据量导出
myConfig.module_type = 'QZ_type';                 // 模块类型
