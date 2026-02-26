import React from 'react';
import { DDVTableConfig } from '@/components/DDBaseGridVtable';

/** 自定义格式化函数类型 */
export type CustomFormatters = Record<string, (value: any) => string>;

// ==================== index.tsx 示例配置 ====================

// 自定义格式化函数
export const customFormatters: CustomFormatters = {
  // 状态映射：N -> '未审核', Y -> '已审核'
  statusMap: (value: string) => {
    const map: Record<string, string> = { N: '未审核', Y: '已审核' };
    return map[value] || value;
  },
  // 进度百分比：0-100 -> 'xx%'
  progressPercent: (value: number) => {
    if (typeof value !== 'number') return value;
    return `${value}%`;
  },
};

// 测试配置 - 默认示例
export const testConfig: DDVTableConfig = {
  grid_columns: [
    { title: '所属期', field: 'ssq', width: 120, titleTooltip: '所属期是指业务数据所属的会计期间', filter: true },
    { title: '申报批次', field: 'sbpc', width: 140, titleTooltip: '申报批次是税务申报的批次编号', filter: true },
    { title: '申报序号', field: 'sbxh', width: 120 },
    { title: 'UUID', field: 'uuid', width: 120, hidden: true },
    {
      title: '金额',
      field: 'jsje',
      width: 120,
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
      title: '税率',
      field: 'sl',
      width: 80, align: 'right' as const,
      min: true,
      max: true,
      render: { type: 'number' as const, format: '0,0.00' },
      filter: true,
    },
    // 自定义格式化示例 - 状态映射
    {
      title: '状态',
      field: 'shbz',
      width: 100,
      render: { type: 'custom' as const, format: 'statusMap' },
      filter: true,
    },
    // 数值格式化示例
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
      field: 'lrrq',
      width: 180,
      render: { type: 'date' as const, format: 'YYYY-MM-DD HH:mm:ss' },
    },
    // 自定义格式化示例 - 进度百分比
    {
      title: '进度',
      field: 'progress',
      width: 100,
      align: 'right' as const,
      render: { type: 'custom' as const, format: 'progressPercent' },
    },
    // 复制功能示例 - 点击图标复制单元格内容
    {
      title: '关联号(可复制)',
      field: 'glh',
      width: 140,
      render: { type: 'copy' as const },
    },
  ],
  // 列表配置（使用 grid_config 统一配置）
  grid_config: {
    grid_height: 630,
    grid_allow_frozen_col_count: 3,
    grid_frozen_col_count: 2,
    grid_show_frozen_icon: true,
    grid_row_series_number: true,
  },
  // 工具栏按钮配置
  toolbar_default: {
    add: true,
    edit: true,
    delete: true,
    setting: true,
    full: true,
    download: true,
    upload: true,
    reload: true,
  },
  // 操作列按钮配置
  grid_handle_columns_default: {
    edit: true,
    delete: true,
    detail: true,
  },
};

// 行序号配置示例 - 自定义样式配置
export const configWithRowNumberCustom: DDVTableConfig = {
  grid_columns: [
    { title: '姓名', field: 'name', width: 120 },
    { title: '年龄', field: 'age', width: 80 },
    { title: '城市', field: 'city', width: 120 },
    { title: '分数', field: 'score', width: 100, sort: true },
  ],
  grid_config: {
    grid_height: 400,
    // 开启行序号（自定义样式配置）
    grid_row_series_number: {
      title: '序号',
      width: 'auto',
      headerStyle: {
        color: 'black',
        bgColor: 'pink',
        textAlign: 'center',
      },
      style: {
        color: 'red',
        textAlign: 'center',
      },
    },
  },
  toolbar_default: {
    reload: true,
    full: true,
    download: true,
  },
};

// 复选框示例配置
export const configWithCheckbox: DDVTableConfig = {
  grid_columns: [
    { title: '姓名', field: 'name', width: 120 },
    { title: '年龄', field: 'age', width: 80 },
    { title: '城市', field: 'city', width: 120 },
    { title: '分数', field: 'score', width: 100, sort: true },
  ],
  grid_config: {
    grid_height: 400,
    // 开启复选框
    grid_selection_type: 'checkbox',
  },
  toolbar_default: {
    delete: true,
    reload: true,
    full: true,
    download: true,
  },
};

// 单选框示例配置
export const configWithRadio: DDVTableConfig = {
  grid_columns: [
    { title: '姓名', field: 'name', width: 120 },
    { title: '年龄', field: 'age', width: 80 },
    { title: '城市', field: 'city', width: 120 },
    { title: '分数', field: 'score', width: 100, sort: true },
  ],
  grid_config: {
    grid_height: 400,
    // 开启单选框
    grid_selection_type: 'radio',
  },
  toolbar_default: {
    edit: true,
    reload: true,
    full: true,
    download: true,
  },
};

// 过滤功能示例配置
export const configWithFilter: DDVTableConfig = {
  grid_columns: [
    // 文本类型过滤 - 模糊搜索
    { title: '所属期', field: 'ssq', width: 120, filter: true },
    // 文本类型过滤 - 模糊搜索
    { title: '申报批次', field: 'sbpc', width: 140, filter: true },
    // 数值类型过滤 - 范围过滤
    {
      title: '金额',
      field: 'jsje',
      width: 120,
      sort: true,
      align: 'right' as const,
      render: { type: 'number' as const, format: '0,0.00' },
      filter: true,
    },
    // 数值类型过滤 - 范围过滤
    {
      title: '税率',
      field: 'sl',
      width: 80,
      align: 'right' as const,
      render: { type: 'number' as const, format: '0,0.00' },
      filter: true,
    },
    // 日期类型过滤 - 范围过滤
    {
      title: '开票日期',
      field: 'kprq',
      width: 120,
      render: { type: 'date' as const, format: 'YYYY-MM-DD' },
      filter: true,
    },
    // 文本类型过滤 - 模糊搜索
    { title: '商品名称', field: 'sbhgspmc', width: 200, filter: true },
  ],
  grid_config: {
    grid_height: 500,
    grid_row_series_number: true,
  },
  toolbar_default: {
    reload: true,
    full: true,
    download: true,
  },
};

// 过滤示例数据
export const filterData = {
  rows: [
    { ssq: '202401', sbpc: '001', jsje: 11604.00, sl: 13, kprq: '2024-01-15', sbhgspmc: '以塑料或纺织材料作面' },
    { ssq: '202401', sbpc: '002', jsje: 10602.00, sl: 13, kprq: '2024-01-16', sbhgspmc: '其他未列名静止式变流' },
    { ssq: '202402', sbpc: '001', jsje: 8201.00, sl: 14, kprq: '2024-02-10', sbhgspmc: '以塑料或纺织材料作面' },
    { ssq: '202402', sbpc: '002', jsje: 12012.00, sl: 15, kprq: '2024-02-15', sbhgspmc: '电子元器件' },
    { ssq: '202403', sbpc: '003', jsje: 8871.00, sl: 16, kprq: '2024-03-05', sbhgspmc: '其他未列名静止式变流' },
    { ssq: '202403', sbpc: '001', jsje: 9681.00, sl: 17, kprq: '2024-03-20', sbhgspmc: '机械设备' },
    { ssq: '202404', sbpc: '004', jsje: 4560.00, sl: 18, kprq: '2024-04-01', sbhgspmc: '以塑料或纺织材料作面' },
    { ssq: '202404', sbpc: '002', jsje: 2423.00, sl: 19, kprq: '2024-04-12', sbhgspmc: '电子元器件' },
    { ssq: '202401', sbpc: '003', jsje: 5011.00, sl: 20, kprq: '2024-01-25', sbhgspmc: '化工产品' },
    { ssq: '202402', sbpc: '004', jsje: 5006.00, sl: 21, kprq: '2024-02-28', sbhgspmc: '机械设备' },
  ],
};

// 复选框 + 序号列示例配置
export const configWithCheckboxAndRowNumber: DDVTableConfig = {
  grid_columns: [
    { title: '姓名', field: 'name', width: 120 },
    { title: '年龄', field: 'age', width: 80 },
    { title: '城市', field: 'city', width: 120 },
    { title: '分数', field: 'score', width: 100, sort: true },
  ],
  grid_config: {
    grid_height: 400,
    // 同时开启复选框和行序号
    grid_selection_type: 'checkbox',
    grid_row_series_number: true,
  },
  toolbar_default: {
    delete: true,
    reload: true,
    full: true,
    download: true,
  },
};

// 测试数据
export const testData = {
  rows: [
    { lrruuid: '4c32f183e982a79ba23f0ad246f4d74d', zf1: '', zf3: '', zf2: '', tse: 1508.52, zf5: '', zf4: '', cktmspzlxDm: '08', sbxh: '00010606', tsl: 13, uuid: '00ed13555c214d09804b905dfcf22cd0', sbqyuuid: '4c32f183e982a79ba23f0ad246f4d47', ssq: '201204', kprq: 1728576000000, ghfnsrsbh1: 'GHWNSRSBH0000001', bz: '', shbz: 'N', sl: 42, ywbh: '', lcid: '', glh: '1041', sbhgspmc: '以塑料或纺织材料作面', zysph: '', jhpzh: 'JHPZH-10606', ckspDm: '42021290', sz: 'C', sbztDm: 'N', zssl: 13, byblbz: ' ', cktmsywlxmcjh: '启运港退税,船舶退税', bsrxm: '', xgruuid: '', hgjldwmc: '千克', bytsbz: ' ', jsje: 11604.00, sbpc: '002', lrrq: 1725984000000, cktmsywlxdmjh: 'QYGTS,CBTS', cktmspzlxDmName: '08', progress: 85 },
    { lrruuid: '4c32f183e982a79ba23f0ad246f4d74d', zf1: '', zf3: '', zf2: '', tse: 1378.26, zf5: '', zf4: '', cktmspzlxDm: '10', sbxh: '00009604', tsl: 13, uuid: '00fe5afa009440219d88b90a98f7765f', sbqyuuid: '4c32f183e982a79ba23f0ad246f4d48', ssq: '201204', kprq: 1728662400000, ghfnsrsbh1: 'GHWNSRSBH0000001', bz: '', shbz: 'N', sl: 43, ywbh: '', lcid: '', glh: '1042', sbhgspmc: '以塑料或纺织材料作面', zysph: '', jhpzh: 'JHPZH-9604', ckspDm: '42021290', sz: 'C', sbztDm: 'N', zssl: 13, byblbz: ' ', cktmsywlxmcjh: '启运港退税,船舶退税', bsrxm: '', xgruuid: '', hgjldwmc: '千克', bytsbz: ' ', jsje: 10602.00, sbpc: '002', lrrq: 1725984000000, cktmsywlxdmjh: 'QYGTS,CBTS', cktmspzlxDmName: '10', progress: 92 },
    { lrruuid: '4c32f183e982a79ba23f0ad246f4d74d', zf1: '', zf3: '', zf2: '', tse: 1066.13, zf5: '', zf4: '', cktmspzlxDm: '02', sbxh: '00007203', tsl: 13, uuid: '00fec1aef4d740988e392d0b4e736ba0', sbqyuuid: '4c32f183e982a79ba23f0ad246f4d49', ssq: '201204', kprq: 1728748800000, ghfnsrsbh1: 'GHWNSRSBH0000001', bz: '', shbz: 'N', sl: 44, ywbh: '', lcid: '', glh: '1043', sbhgspmc: '以塑料或纺织材料作面', zysph: '', jhpzh: 'JHPZH-7203', ckspDm: '42021290', sz: 'C', sbztDm: 'N', zssl: 13, byblbz: ' ', cktmsywlxmcjh: '启运港退税,船舶退税', bsrxm: '', xgruuid: '', hgjldwmc: '千克', bytsbz: ' ', jsje: 8201.00, sbpc: '003', lrrq: 1725984000000, cktmsywlxdmjh: 'QYGTS,CBTS', cktmspzlxDmName: '02', progress: 67 },
    { lrruuid: '4c32f183e982a79ba23f0ad246f4d74d', zf1: '', zf3: '', zf2: '', tse: 1561.56, zf5: '', zf4: '', cktmspzlxDm: '04', sbxh: '00011014', tsl: 13, uuid: '010322f36fac4c91afc5ba5a2cfb0ad6', sbqyuuid: '4c32f183e982a79ba23f0ad246f4d50', ssq: '201204', kprq: 1728835200000, ghfnsrsbh1: 'GHWNSRSBH0000001', bz: '', shbz: 'Y', sl: 45, ywbh: '', lcid: '', glh: '1044', sbhgspmc: '以塑料或纺织材料作面', zysph: '', jhpzh: 'JHPZH-11014', ckspDm: '42021290', sz: 'V', sbztDm: 'N', zssl: 13, byblbz: ' ', cktmsywlxmcjh: '启运港退税,船舶退税', bsrxm: '', xgruuid: '', hgjldwmc: '千克', bytsbz: ' ', jsje: 12012.00, sbpc: '003', lrrq: 1725984000000, cktmsywlxdmjh: 'QYGTS,CBTS', cktmspzlxDmName: '04', progress: 45 },
    { lrruuid: '4c32f183e982a79ba23f0ad246f4d74d', zf1: '', zf3: '', zf2: '', tse: 1153.23, zf5: '', zf4: '', cktmspzlxDm: '05', sbxh: '00007873', tsl: 13, uuid: '010618aeb02a4f3ca3d87a159df6226f', sbqyuuid: '4c32f183e982a79ba23f0ad246f4d51', ssq: '201204', kprq: 1728921600000, ghfnsrsbh1: 'GHWNSRSBH0000001', bz: '', shbz: 'Y', sl: 46, ywbh: '', lcid: '', glh: '1045', sbhgspmc: '其他未列名静止式变流', zysph: '', jhpzh: 'JHPZH-7873', ckspDm: '85044099', sz: 'V', sbztDm: 'N', zssl: 13, byblbz: ' ', cktmsywlxmcjh: '启运港退税,船舶退税', bsrxm: '', xgruuid: '', hgjldwmc: '千克', bytsbz: ' ', jsje: 8871.00, sbpc: '003', lrrq: 1725984000000, cktmsywlxdmjh: 'QYGTS,CBTS', cktmspzlxDmName: '05', progress: 100 },
    { lrruuid: '4c32f183e982a79ba23f0ad246f4d74d', zf1: '', zf3: '', zf2: '', tse: 1258.53, zf5: '', zf4: '', cktmspzlxDm: '06', sbxh: '00008683', tsl: 13, uuid: '01097533174946248abb4c3ba31d8811', sbqyuuid: '4c32f183e982a79ba23f0ad246f4d52', ssq: '201204', kprq: 1729008000000, ghfnsrsbh1: 'GHWNSRSBH0000001', bz: '', shbz: 'N', sl: 47, ywbh: '', lcid: '', glh: '1046', sbhgspmc: '其他未列名静止式变流', zysph: '', jhpzh: 'JHPZH-8683', ckspDm: '85044099', sz: 'C', sbztDm: 'N', zssl: 13, byblbz: ' ', cktmsywlxmcjh: '启运港退税,船舶退税', bsrxm: '', xgruuid: '', hgjldwmc: '千克', bytsbz: ' ', jsje: 9681.00, sbpc: '004', lrrq: 1725984000000, cktmsywlxdmjh: 'QYGTS,CBTS', cktmspzlxDmName: '06' },
    { lrruuid: '4c32f183e982a79ba23f0ad246f4d74d', zf1: '', zf3: '', zf2: '', tse: 592.80, zf5: '', zf4: '', cktmspzlxDm: '07', sbxh: '00003562', tsl: 13, uuid: '01136f0e6b1b4c65a0bb6b07de883d65', sbqyuuid: '4c32f183e982a79ba23f0ad246f4d53', ssq: '201204', kprq: 1729094400000, ghfnsrsbh1: 'GHWNSRSBH0000001', bz: '', shbz: 'N', sl: 48, ywbh: '', lcid: '', glh: '1047', sbhgspmc: '其他未列名静止式变流', zysph: '', jhpzh: 'JHPZH-3562', ckspDm: '85044099', sz: 'C', sbztDm: 'N', zssl: 13, byblbz: ' ', cktmsywlxmcjh: '启运港退税,船舶退税', bsrxm: '', xgruuid: '', hgjldwmc: '千克', bytsbz: ' ', jsje: 4560.00, sbpc: '004', lrrq: 1725984000000, cktmsywlxdmjh: 'QYGTS,CBTS', cktmspzlxDmName: '07' },
    { lrruuid: '4c32f183e982a79ba23f0ad246f4d74d', zf1: '', zf3: '', zf2: '', tse: 314.99, zf5: '', zf4: '', cktmspzlxDm: '08', sbxh: '00001425', tsl: 13, uuid: '0115e2b731364e84befea50728ee3546', sbqyuuid: '4c32f183e982a79ba23f0ad246f4d54', ssq: '201204', kprq: 1729180800000, ghfnsrsbh1: 'GHWNSRSBH0000001', bz: '', shbz: 'N', sl: 49, ywbh: '', lcid: '', glh: '1048', sbhgspmc: '以塑料或纺织材料作面', zysph: '', jhpzh: 'JHPZH-1425', ckspDm: '42021290', sz: 'C', sbztDm: 'N', zssl: 13, byblbz: ' ', cktmsywlxmcjh: '启运港退税,船舶退税', bsrxm: '', xgruuid: '', hgjldwmc: '千克', bytsbz: ' ', jsje: 2423.00, sbpc: '004', lrrq: 1725984000000, cktmsywlxdmjh: 'QYGTS,CBTS', cktmspzlxDmName: '08' },
    { lrruuid: '4c32f183e982a79ba23f0ad246f4d74d', zf1: '', zf3: '', zf2: '', tse: 651.43, zf5: '', zf4: '', cktmspzlxDm: '10', sbxh: '00004013', tsl: 13, uuid: '011755d79cf94efb8d448c9b0aa08242', sbqyuuid: '4c32f183e982a79ba23f0ad246f4d55', ssq: '201204', kprq: 1729267200000, ghfnsrsbh1: 'GHWNSRSBH0000001', bz: '', shbz: 'N', sl: 50, ywbh: '', lcid: '', glh: '1049', sbhgspmc: '以塑料或纺织材料作面', zysph: '', jhpzh: 'JHPZH-4013', ckspDm: '42021290', sz: 'V', sbztDm: 'N', zssl: 13, byblbz: ' ', cktmsywlxmcjh: '启运港退税,船舶退税', bsrxm: '', xgruuid: '', hgjldwmc: '千克', bytsbz: ' ', jsje: 5011.00, sbpc: '004', lrrq: 1725984000000, cktmsywlxdmjh: 'QYGTS,CBTS', cktmspzlxDmName: '10' },
    { lrruuid: '4c32f183e982a79ba23f0ad246f4d74d', zf1: '', zf3: '', zf2: '', tse: 650.78, zf5: '', zf4: '', cktmspzlxDm: '02', sbxh: '00004008', tsl: 13, uuid: '011f5ba48a2040a88fafc85253187b5a', sbqyuuid: '4c32f183e982a79ba23f0ad246f4d56', ssq: '201204', kprq: 1729353600000, ghfnsrsbh1: 'GHWNSRSBH0000001', bz: '', shbz: 'N', sl: 51, ywbh: '', lcid: '', glh: '1050', sbhgspmc: '以塑料或纺织材料作面', zysph: '', jhpzh: 'JHPZH-4008', ckspDm: '42021290', sz: 'V', sbztDm: 'N', zssl: 13, byblbz: ' ', cktmsywlxmcjh: '启运港退税,船舶退税', bsrxm: '', xgruuid: '', hgjldwmc: '千克', bytsbz: ' ', jsje: 5006.00, sbpc: '004', lrrq: 1725984000000, cktmsywlxdmjh: 'QYGTS,CBTS', cktmspzlxDmName: '02' },
  ],
};

// 行序号示例数据
export const rowNumberData = {
  rows: [
    { name: '张三', age: 25, city: '北京', score: 85 },
    { name: '李四', age: 30, city: '上海', score: 92 },
    { name: '王五', age: 28, city: '广州', score: 78 },
    { name: '赵六', age: 35, city: '深圳', score: 88 },
    { name: '钱七', age: 32, city: '杭州', score: 95 },
    { name: '孙八', age: 27, city: '南京', score: 82 },
    { name: '周九', age: 29, city: '成都', score: 90 },
    { name: '吴十', age: 31, city: '武汉', score: 87 },
  ],
};

// 选择示例数据
export const selectionData = {
  rows: [
    { id: 1, name: '张三', age: 25, city: '北京', score: 85 },
    { id: 2, name: '李四', age: 30, city: '上海', score: 92 },
    { id: 3, name: '王五', age: 28, city: '广州', score: 78 },
    { id: 4, name: '赵六', age: 35, city: '深圳', score: 88 },
    { id: 5, name: '钱七', age: 32, city: '杭州', score: 95 },
    { id: 6, name: '孙八', age: 27, city: '南京', score: 82 },
    { id: 7, name: '周九', age: 29, city: '成都', score: 90 },
    { id: 8, name: '吴十', age: 31, city: '武汉', score: 87 },
  ],
};

