import { DDVTableConfig } from '@/components/DDBaseGridVtable';
import CONSTANTS from '@/components/DDAssist/constants';

// ==================== index2.tsx API 表格配置示例 ====================

// 测试配置 - API 示例（匹配 API 返回字段）
// 注意：api_config 用于统一管理 API 接口地址，form_items 用于表单字段配置
export const testConfigForApi: DDVTableConfig = {
  grid_columns: [
    { title: '所属期', field: 'ssq', width: 140, titleTooltip: '所属期是指业务数据所属的会计期间', filter: true },
    { title: '申报批次', field: 'sbpc', width: 140, titleTooltip: '申报批次是税务申报的批次编号', filter: true },
    { title: '申报序号', field: 'sbxh', width: 120, filter: true },
    { title: 'UUID', field: 'uuid', width: 120, hidden: true },
    // 复制功能示例 - 点击图标复制单元格内容
    {
      title: '关联号',
      field: 'glh',
      width: 110,
      render: { type: 'copy' as const },
      filter: true,
    },
    { title: '税种代码', field: 'sz', width: 90, sort: true },
    { title: '税种名称', field: 'sz', width: 100, sort: true, render: { type: 'code_table', key: 'code_dm_ckts_sz' } },
    { title: '出口退(免)税凭证类型代码', field: 'cktmspzlx_dm', width: 200 },
    { title: '出口退(免)税凭证类型名称', field: 'cktmspzlx_dm', width: 200, render: { type: 'code_table', key: 'code_dm_ckts_cktmspzlx' } },
    { title: '进货凭证号', field: 'jhpzh', width: 130 },
    { title: '供货方纳税人识别号', field: 'ghfnsrsbh_1', width: 160 },
    { title: '出口商品代码', field: 'cksp_dm', width: 130 },
    { title: '申报海关商品名称', field: 'sbhgspmc', width: 180 },
    { title: '海关计量单位名称', field: 'hgjldwmc', width: 180 },
    {
      title: '数量',
      field: 'sl',
      align: 'right',
      width: 140,
      sort: true,
      sum: true,
      min: true,
      max: true,
      avg: true,
      render: { type: 'number' as const, format: '0,0.00' },
    },
    {
      title: '计税金额',
      field: 'jsje',
      width: 140,
      sort: true,
      align: 'right' as const,
      sum: true,
      min: true,
      max: true,
      avg: true,
      render: { type: 'number' as const, format: '0,0.00' },
      filter: true,
    },
    {
      title: "征税税率",
      field: "zssl",
      align: 'right' as const,
      width: 140,
      min: true,
      max: true,
      render: { type: 'number' as const, format: '0,0.000000' },
      filter: true,
    },
    {
      title: "退税率",
      field: "tsl",
      align: 'right' as const,
      width: 140,
      min: true,
      avg: true,
      render: { type: 'number' as const, format: '0,0.000000' },
    },
    // 数值格式化示例
    {
      title: "退税额",
      field: "tse",
      align: 'right' as const,
      width: 140,
      sum: true,
      min: true,
      max: true,
      avg: true,
      render: { type: 'number' as const, format: '0,0.000000' },
    },
    { title: '税率(%)', field: 'sl', width: 90 },
    {
      title: '税额',
      field: 'tse',
      width: 120,
      align: 'right' as const,
      render: { type: 'number' as const, format: '0,0.00' },
    },
    // 日期格式化示例
    {
      title: '开票日期',
      field: 'kprq',
      width: 120,
      render: { type: 'date' as const, format: 'YYYY-MM-DD' },
      filter: true,
    },
    {
      title: '录入时间',
      field: 'kprq',
      width: 180,
      render: { type: 'date' as const, format: 'YYYY-MM-DD HH:mm:ss' },
    },
    { title: "备注", field: "bz", width: 180 }
  ],
  // 列表配置
  grid_config: {
    // 表格标题
    grid_title: '进货明细',
    // 开启行序号
    grid_row_series_number: true,
    // 表格高度
    grid_height: 600,
    // 可选做冻结的前几列数量
    grid_allow_frozen_col_count: 3,
    // 初始冻结列数
    grid_frozen_col_count: 2,
    // 是否显示冻结图标
    grid_show_frozen_icon: true,
    // 选择类型：checkbox 复选框 | radio 单选框 | false 不显示
    grid_selection_type: 'checkbox',
    // 主键字段
    grid_row_key: 'uuid',
    // 性能模式 - 启用后只保留 field/title/width
    // performanceMode: true,
  },
  // 操作列按钮配置
  grid_handle_columns_default: {
    edit: true,
    delete: true,
    detail: true,
  },
  filter_items:[
    { name: 'ssq', label: '所属期', type: 'Input', tooltip: '筛选提示' },
    { name: 'sbpc', label: '申报批次', type: 'Input' },
    { name: 'glh', label: '关联号', type: 'Input' },
    { name: 'sz', label: '税种', type: 'Select', showSearch: true, allowClear: true, codeTable: 'code_dm_ckts_sz' },
    { name: 'jhpzh', label: '进货凭证号', type: 'Input' },
    { name: 'ghfnsrsbh_1', label: '供货方纳税人识别号', type: 'Input' },
    { name: 'cksp_dm', label: '出口商品代码', type: 'Input' },
    { name: 'jsje', label: '计税金额', type: 'InputNumber', range: true, layout: CONSTANTS.DEFAULT_FILTER_LAYOUT_66P_ROW },
    { name: 'kprq', label: '开票日期', type: 'DatePicker', allowClear: true, range: true, layout: CONSTANTS.DEFAULT_FILTER_LAYOUT_100P_ROW },
    { name: 'zssl', label: '征税税率', type: 'InputNumber' },
    // type: 'Select', showType: '3', codeTable: 'code_static_bgd_sbyw_dm' },
  ],
  // 工具栏按钮配置
  toolbar_default: {
    add: true,
    edit: false,
    delete: true,
    setting: true,
    full: true,
    download: true,
    reload: true,
  },
  // API 配置（统一管理所有接口）
  api_config: {
    /** 列表查询 API 地址 */
    // apiGridQuery: '/dict/automatic/exp/bs/queryPager/eg_m_mts_tsjh', // 通过模块名查询
    apiGridQuery: '/ns/base/list/eg_mts_tsjh', // 通过表名简单查询
    /** 表单查询 API 地址（编辑时查询） */
    apiFormQuery: '/dict/automatic/exp/bs/queryForm/eg_m_mts_tsjh',
    /** 表单保存 API 地址 */
    apiFormEdit: '/dict/automatic/exp/bs/saveOrUpdate/eg_m_mts_tsjh',
    /** 表单删除 API 地址 */
    apiFormDelete: '/dict/automatic/exp/bs/delete/eg_m_mts_tsjh',
  },
  // 表单配置
  form_config: {
    form_title: '提案建议',
    form_width: 960,
    form_layout_type: 'horizontal',
    form_label_input_layout: 'vertical',
  },
  // 模块key
  module_key: 'eg_m_mts_tsjh',
  // 表单字段配置
  form_items: [
    {
      label: '基本信息',
      type: 'GroupTitle'
    },
    {
      label: '所属期',
      name: 'ssq',
      type: 'Input',
      rules: [
        { type: 'base_required' },
        { type: 'base_string', range: [ 0, 60 ] },
        { type: 'base_date', format: 'yyyyMM' }
      ],
      tooltip: '表单提示'
    },
    {
      label: '申报批次',
      name: 'sbpc',
      type: 'Input',
      rules: [
        { type: 'base_required' },
        { type: 'base_string', range: [ 0, 75 ] }
      ]
    },
    {
      label: '申报序号',
      name: 'sbxh',
      type: 'Input',
      rules: [
        { type: 'base_string', range: [ 0, 50 ] }
      ]
    },
    {
      label: '关联号',
      name: 'glh',
      type: 'Input',
      rules: [
        { type: 'base_required' },
        { type: 'base_string', range: [ 0, 30 ] },
      ]
    },
    {
      label: '发票信息',
      type: 'GroupTitle',
    },
    {
      label: '税种',
      name: 'sz',
      type: 'Select',
      allowClear: true,
      codeTable: 'code_dm_ckts_sz',
      rules: [
        { type: 'base_required' },
        { type: 'base_string', range: [ 0, 1 ] }
      ],
      list: [
        { value: 'C', name: '消费税', label: '消费税' },
        { value: 'V', name: '增值税', label: '增值税' },
      ]
    },
    {
      label: '出口退(免)税凭证类型代码',
      name: 'cktmspzlx_dm',
      type: 'Select',
      allowClear: true,
      codeTable: 'code_dm_ckts_cktmspzlx',
      rules: [
        { type: 'base_required' },
        { type: 'base_string', range: [ 0, 2 ] }
      ],
      list: [
        { value: '02', name: '增值税专用发票', label: '增值税专用发票' },
        { value: '04', name: '海关进口增值税专用缴款书', label: '海关进口增值税专用缴款书' },
        { value: '05', name: '海关进口消费税专用缴款书', label: '海关进口消费税专用缴款书' },
        { value: '06', name: '出口货物消费税专用缴款书', label: '出口货物消费税专用缴款书' },
        { value: '07', name: '出口货物消费税专用缴款书分割单', label: '出口货物消费税专用缴款书分割单' },
        { value: '08', name: '税收专用缴款书', label: '税收专用缴款书' },
        { value: '10', name: '消费税专用缴款书', label: '消费税专用缴款书' }
      ]
    },
    {
      label: '进货凭证号',
      name: 'jhpzh',
      type: 'Input',
      rules: [
        { type: 'base_required' },
        { type: 'base_string', range: [ 0, 75 ] }
      ]
    },
    {
      label: '供货方纳税人识别号',
      name: 'ghfnsrsbh_1',
      type: 'Input',
      rules: [
        { type: 'base_required' },
        { type: 'base_string', range: [ 0, 20 ] },
        { type: 'base_string', range: [ '5', '15' ] },
        { type: 'base_type_number' }
      ]
    },
    {
      label: '出口商品代码',
      name: 'cksp_dm',
      type: 'Input',
      rules: [
        { type: 'base_required' },
        { type: 'base_string', range: [ 0, 20 ] }
      ]
    },
    {
      label: '申报海关商品名称',
      name: 'sbhgspmc',
      type: 'Input',
      rules: [
        { type: 'base_required' },
        { type: 'base_string', range: [ 0, 500 ] }
      ]
    },
    {
      label: '海关计量单位名称',
      name: 'hgjldwmc',
      type: 'Input',
      readOnly: true,
      disabled: true,
      rules: [
        { type: 'base_string', range: [ 0, 75 ] }
      ]
    },
    {
      label: '数量',
      name: 'sl',
      type: 'InputNumber',
      format: '0,0.000000',
      rules: [
        { type: 'base_required' },
        { type: 'base_number', range: '+-' }
      ]
    },
    {
      label: '计税金额',
      name: 'jsje',
      type: 'InputNumber',
      format: '0,0.00',
      rules: [
        { type: 'base_required' },
        { type: 'base_number', range: '+0' }
      ]
    },
    {
      label: '征税税率',
      name: 'zssl',
      type: 'InputNumber',
      format: '0,0.000000',
      rules: [
        { type: 'base_required' },
        { type: 'base_number', range: '+' }
      ]
    },
    {
      label: '退税率',
      name: 'tsl',
      type: 'InputNumber',
      format: '0,0.000000',
      rules: [
        { type: 'base_required' }
      ]
    },
    {
      label: '退税额',
      name: 'tse',
      type: 'InputNumber',
      formula: '{jsje}*{tsl}/100',
      format: '0,0.000000',
      rules: [
        { type: 'base_required' }
      ],
      desLayout: 'filled'
    },
    {
      label: '备注',
      name: 'bz',
      type: 'TextArea',
      autoSize: {
        minRows: 2,
        maxRows: 2
      },
      layout: {
        xs: { span: 24, offset: 0, pull: 0 },
        sm: { span: 24, offset: 0, pull: 0 },
        md: { span: 24, offset: 0, pull: 0 },
        lg: { span: 24, offset: 0, pull: 0 },
        xl: { span: 24, offset: 0, pull: 0 },
        xxl: { span: 24, offset: 0, pull: 0 }
      },
      desLayout: { xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 3 },
      layoutDesc: 100,
      rules: [
        { type: 'base_string', range: [ 0, 3000 ] }
      ]
    },
    {
      label: 'UUID',
      name: 'uuid',
      type: 'Hidden',
      hidden: true,
      rules: [
        { type: 'base_string', range: [ 0, 32 ] }
      ]
    }
  ],
};
