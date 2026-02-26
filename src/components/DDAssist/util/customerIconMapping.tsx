import myUtil from './index';

const customerIconMapping: any = {};

// 接口日志管理 response_code
customerIconMapping.response_code_tag_color = [
  {code: '200', color: myUtil.theme.getColor({type: 'success'})},
  {code: 'ELSE', color: myUtil.theme.getColor({type: 'error'})},
]

// 通用 日志级别
customerIconMapping.code_dm_log_level = {
  tag: [
    { value: 'NONE', color: 'lime' },
    { value: 'DEBUG', color: 'magenta' },
    { value: 'INFO', color: myUtil.theme.getColor({type: 'primary'}) },
    { value: 'WARN', color: myUtil.theme.getColor({type: 'warning'}) },
    { value: 'ERROR', color: myUtil.theme.getColor({type: 'error'}) },
  ]
};

// 劳动合同
customerIconMapping.code_dm_api_type = {
  tag: [
    { value: 'search', color: 'default' },// magenta default volcano lime
    { value: 'login', color: myUtil.theme.getColor({type: 'primary'}) },
    { value: 'import', color: myUtil.theme.getColor({type: 'success'}) },
    { value: 'export', color: 'lime' },
    { value: 'db', color: 'magenta' },
    { value: 'delete', color: myUtil.theme.getColor({type: 'error'}) },
    { value: 'update', color: myUtil.theme.getColor({type: 'warning'}) },
  ]
};

// BPM 审批状态
customerIconMapping.code_dm_task_flag = {
  // icon: [
  //   { value: '1', icon: 'CheckOutlined', color: 'success' }, // 通过
  //   { value: '0', icon: 'CloseOutlined', color: 'error' }, // 不通过
  // ],
  tag: [
    { value: '1', color: myUtil.theme.getColor({type: 'success'}) }, // 通过
    { value: '0', color: myUtil.theme.getColor({type: 'error'}) }, // 不通过
  ]
};

// BPM 流程状态
customerIconMapping.code_dm_process_run_state = {
  tag: [
    { value: '1', color: myUtil.theme.getColor({type: 'primary'}) }, // 运行
    { value: '2', color: myUtil.theme.getColor({type: 'primary'}) }, // 启动
    { value: '3', color: myUtil.theme.getColor({type: 'error'}) }, // 审批未通过
    { value: '4', color: myUtil.theme.getColor({type: 'success'}) }, // 审批通过
    { value: '9', color: 'error' }, // 中止
  ]
};

// 人员信息 性别
customerIconMapping.code_dm_ryxx_xb = {
  icon: [
    { value: '1', icon: 'ManOutlined', color: 'processing' }, // 男
    { value: '2', icon: 'WomanOutlined', color: 'error' }, // 女
  ],
};

// 通用 有效标志
customerIconMapping.code_dm_yxbz = {
  tag: [
    { value: '1', color: myUtil.theme.getThemeToken().token?.colorSuccess },
    { value: 'Y', color: myUtil.theme.getThemeToken().token?.colorSuccess },
    { value: '0', color: myUtil.theme.getThemeToken().token?.colorError },
    { value: '', color: myUtil.theme.getThemeToken().token?.colorError },
  ]
};

// 劳动合同
customerIconMapping.code_dm_rzgl_htzt = {
  tag: [
    { value: '1', color: 'default' },
    { value: '2', color: myUtil.theme.getColor({type: 'primary'}) },
  ]
};

const commonZt: any = {
  tag: [
    { value: '1', color: 'default' },
    { value: '2', color: myUtil.theme.getColor({type: 'primary'}) },
    { value: '3', color: myUtil.theme.getColor({type: 'success'}) },
    { value: '4', color: myUtil.theme.getColor({type: 'error'}) },
  ]
};

// 项目管理 确认标识
customerIconMapping.code_dm_pm_bgqrbj = {
  tag: [
    { value: '1', color: myUtil.theme.getColor({type: 'success'}) },
    { value: '0', color: 'default' },
    { value: '', color: 'default' },
  ]
};

// 项目管理 变更标识
customerIconMapping.code_dm_pm_bgbj = {
  tag: [
    { value: '1', color: myUtil.theme.getColor({type: 'primary'}) },
    { value: '0', color: 'default' },
    { value: '', color: 'default' },
  ]
};

// 合同管理 合同状态
customerIconMapping.code_dm_pm_htzt = {
  tag: [
    { value: '1', color: myUtil.theme.getColor({type: 'success'}) },
    { value: '2', color: myUtil.theme.getColor({type: 'primary'}) },
    { value: '3', color: myUtil.theme.getColor({type: 'error'}) },
    { value: '4', color: 'default' },
  ]
};

// 员工管理
customerIconMapping.code_dm_rzgl_rzzt = commonZt; // 入职状态
customerIconMapping.code_dm_rzgl_lzzt = commonZt; // 离职状态
customerIconMapping.code_dm_rzgl_shzt = commonZt; // 转正状态

export default customerIconMapping;
