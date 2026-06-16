/**
 * title: base-date-format-normalize 测试 - 验证 r19 form_items 块内 base_date 规则的 format 归一化（YYYY/YY → yyyy/yy）
 */
import CONSTANTS from '@/components/DDAssist/constants';
const myConfig: any = {};

myConfig.module_key = 'BASE_DATE_FORMAT_NORMALIZE_TEST';
myConfig.layout_type = 'tz';

myConfig.grid_columns = [
  // 渲染端 format 应保持大写 YYYY（r8 归一化的结果），不被 r19 影响（不在 form_items 块内）
  { title: '本期收款时间', dataIndex: 'skrq', width: 150, align: 'center', render: { type: 'date', format: 'YYYY-MM-DD' } },
];

myConfig.form_items = [
  // 测试 1: 基础场景 - YYYYMM → yyyyMM（核心 case）
  { label: '所属期', name: 'ssq', type: 'Input', rules: [{ type: 'base_date', format: 'yyyyMM' }, { type: 'base_required' }] },
  // 测试 2: YYYYMMdd → yyyyMMdd（无分隔符，能命中 yyyyMMdd 派发）
  { label: '本期收款时间', name: 'skrq', type: 'DatePicker', format: 'YYYY-MM-DD', rules: [{ type: 'base_required' }, { type: 'base_date', format: 'yyyyMMdd' }] },
  // 测试 3: YYYY → yyyy（仅年）
  { label: '年度', name: 'nd', type: 'Input', rules: [{ type: 'base_date', format: 'yyyy' }] },
  // 测试 4: 已小写 - 幂等不变
  { label: '所属期2', name: 'ssq2', type: 'Input', rules: [{ type: 'base_date', format: 'yyyyMM' }] },
  // 测试 5: 非 base_date 规则不受影响
  { label: '金额', name: 'je', type: 'InputNumber', rules: [{ type: 'base_required' }] },
  // 测试 6: base_date 但 format 不含 YY（按用户决策不动 DD → 仅 YYYY/YY 转换；本项 format='MM' 无变化）
  { label: '月份', name: 'yf', type: 'Input', rules: [{ type: 'base_date', format: 'MM' }] },
  // 测试 7: 双引号 + 含 YYYY 与 YY 混合（'YYYY-YY' 形式实测 codebase 无此场景，仅用于 fixture 验证 regex）
  { label: '特殊格式', name: 'tsgs', type: 'Input', rules: [{ type: 'base_date', format: "yyyyMM" }] },
];
myConfig.customer_toolbar = [];
myConfig.handle_columns = [];
