import myUtil from '@/components/DDAssist/util';
import { Area, Column, DualAxes, Line, Pie } from '@ant-design/plots';

// ============================================
// 饼图示例配置 - configPie
// ============================================

// 基础饼图
export const dataPie = [
  { type: '分类 A', value: 27 },
  { type: '分类 B', value: 25 },
  { type: '分类 C', value: 18 },
  { type: '分类 D', value: 15 },
  { type: '分类 E', value: 10 },
  { type: '分类 F', value: 5 },
];

// 使用工具类生成饼图配置
export const configPie = {
  ...myUtil.chartsAntD.configPie({
    data: dataPie,
  }),
};

// 带内径的饼图（环形图）
export const dataPie2 = [
  { type: '电子产品', value: 45000 },
  { type: '服装', value: 32000 },
  { type: '食品', value: 28000 },
  { type: '家居', value: 15000 },
];

// 使用工具类生成环形图配置
export const configPie2 = {
  ...myUtil.chartsAntD.configPie({
    data: dataPie2,
    innerRadius: 0.6,
    showTotal: true,
    valueUnit: '元',
  }),
};

// ============================================
// 面积图示例配置 - configArea
// ============================================

// 基础面积图
export const dataArea = [
  { month: '1月', value: 120 },
  { month: '2月', value: 150 },
  { month: '3月', value: 180 },
  { month: '4月', value: 220 },
  { month: '5月', value: 280 },
  { month: '6月', value: 350 },
];

export const configArea = {
  data: dataArea,
  xField: 'month',
  yField: 'value',
  xAxis: {
    title: { text: '月份', style: { fill: '#666' } },
    label: { style: { fill: '#999' } },
  },
  yAxis: {
    title: { text: '销售量', style: { fill: '#666' } },
    label: { style: { fill: '#999' } },
    min: 0,
  },
  smooth: true,
  areaStyle: () => ({
    fill: 'l(270) 0:#ffffff 1:#1890ff',
  }),
  line: {
    size: 2,
    color: '#1890ff',
  },
  tooltip: {
    showTitle: true,
    title: (d: any) => d.month,
    content: (d: any) => [`销售量: ${d.value} 件`],
  },
};

// 带数值的面积图
export const dataArea2 = [
  { date: '2024-01', value: 12500 },
  { date: '2024-02', value: 14800 },
  { date: '2024-03', value: 18200 },
  { date: '2024-04', value: 21000 },
  { date: '2024-05', value: 25600 },
  { date: '2024-06', value: 32000 },
];

export const configArea2 = {
  data: dataArea2,
  xField: 'date',
  yField: 'value',
  xAxis: {
    title: { text: '日期', style: { fill: '#666' } },
    label: { style: { fill: '#999' } },
  },
  yAxis: {
    title: { text: '营收', style: { fill: '#666' } },
    label: {
      style: { fill: '#999' },
      formatter: (v: string) => Number(v).toLocaleString(),
    },
    min: 0,
  },
  smooth: true,
  areaStyle: () => ({
    fill: 'l(270) 0:#ffffff 1:#52c41a',
  }),
  line: {
    size: 2,
    color: '#52c41a',
  },
  tooltip: {
    showTitle: true,
    title: (d: any) => d.date,
    content: (d: any) => [`营收: ${d.value.toLocaleString()} 元`],
  },
};

// ============================================
// 柱状图示例配置 - configColumn
// ============================================

// 基础柱状图
export const dataColumn = [
  { month: '1月', value: 120 },
  { month: '2月', value: 150 },
  { month: '3月', value: 180 },
  { month: '4月', value: 220 },
];

export const configColumn = {
  data: dataColumn,
  xField: 'month',
  yField: 'value',
  xAxis: {
    title: { text: '月份', style: { fill: '#666' } },
    label: { style: { fill: '#999' } },
  },
  yAxis: {
    title: { text: '销量', style: { fill: '#666' } },
    label: { style: { fill: '#999' } },
    min: 0,
  },
  columnStyle: {
    fill: '#1890ff',
    radius: [4, 4, 0, 0],
  },
  tooltip: {
    showTitle: true,
    title: (d: any) => d.month,
    content: (d: any) => [`销量: ${d.value} 件`],
  },
};

// 带标签的柱状图
export const dataColumn2 = [
  { month: 'Q1', value: 450 },
  { month: 'Q2', value: 620 },
  { month: 'Q3', value: 780 },
  { month: 'Q4', value: 950 },
];

export const configColumn2 = {
  data: dataColumn2,
  xField: 'month',
  yField: 'value',
  xAxis: {
    title: { text: '季度', style: { fill: '#666' } },
    label: { style: { fill: '#999' } },
  },
  yAxis: {
    title: { text: '销售额', style: { fill: '#666' } },
    label: {
      style: { fill: '#999' },
      formatter: (v: string) => (Number(v) / 10000).toFixed(0) + '万',
    },
    min: 0,
  },
  columnStyle: {
    fill: '#722ed1',
    radius: [4, 4, 0, 0],
  },
  label: {
    position: 'top',
    content: (d: any) => `${(d.value / 10000).toFixed(0)}万`,
    style: {
      fill: '#722ed1',
      fontSize: 12,
    },
  },
  tooltip: {
    showTitle: true,
    title: (d: any) => d.month,
    content: (d: any) => [`销售额: ${d.value.toLocaleString()} 万元`],
  },
};

// 分组柱状图
export const dataColumn3 = [
  { month: '1月', type: '计划', value: 100 },
  { month: '1月', type: '实际', value: 120 },
  { month: '2月', type: '计划', value: 150 },
  { month: '2月', type: '实际', value: 145 },
  { month: '3月', type: '计划', value: 180 },
  { month: '3月', type: '实际', value: 200 },
];

export const configColumn3 = {
  data: dataColumn3,
  xField: 'month',
  yField: 'value',
  seriesField: 'type',
  isGroup: true,
  xAxis: {
    title: { text: '月份', style: { fill: '#666' } },
    label: { style: { fill: '#999' } },
  },
  yAxis: {
    title: { text: '销量', style: { fill: '#666' } },
    label: { style: { fill: '#999' } },
    min: 0,
  },
  columnStyle: {
    radius: [4, 4, 0, 0],
  },
  tooltip: {
    showTitle: true,
    title: (d: any) => d.month,
    content: (d: any) => [`${d.type}: ${d.value}`],
  },
  legend: {
    position: 'top',
  },
};

// ============================================
// 折线图示例配置 - configLine
// ============================================

// 基础折线图
export const dataLine = [
  { date: '2024-01', value: 120 },
  { date: '2024-02', value: 150 },
  { date: '2024-03', value: 180 },
  { date: '2024-04', value: 220 },
  { date: '2024-05', value: 280 },
  { date: '2024-06', value: 350 },
];

export const configLine = {
  data: dataLine,
  xField: 'date',
  yField: 'value',
  xAxis: {
    title: { text: '日期', style: { fill: '#666' } },
    label: { style: { fill: '#999' } },
  },
  yAxis: {
    title: { text: '访问量', style: { fill: '#666' } },
    label: { style: { fill: '#999' } },
    min: 0,
  },
  smooth: true,
  line: {
    size: 2,
    color: '#1890ff',
  },
  point: {
    size: 4,
    color: '#1890ff',
    style: {
      stroke: '#fff',
      lineWidth: 2,
    },
  },
  tooltip: {
    showTitle: true,
    title: (d: any) => d.date,
    content: (d: any) => [`访问量: ${d.value}`],
  },
};

// 多系列折线图
export const dataLine2 = [
  { month: '1月', type: 'PC端', value: 1200 },
  { month: '1月', type: '移动端', value: 800 },
  { month: '2月', type: 'PC端', value: 1400 },
  { month: '2月', type: '移动端', value: 950 },
  { month: '3月', type: 'PC端', value: 1600 },
  { month: '3月', type: '移动端', value: 1200 },
  { month: '4月', type: 'PC端', value: 1800 },
  { month: '4月', type: '移动端', value: 1500 },
];

export const configLine2 = {
  data: dataLine2,
  xField: 'month',
  yField: 'value',
  seriesField: 'type',
  smooth: true,
  xAxis: {
    title: { text: '月份', style: { fill: '#666' } },
    label: { style: { fill: '#999' } },
  },
  yAxis: {
    title: { text: '用户数', style: { fill: '#666' } },
    label: {
      style: { fill: '#999' },
      formatter: (v: string) => (Number(v) / 10000).toFixed(0) + '万',
    },
    min: 0,
  },
  line: {
    size: 2,
  },
  point: {
    size: 4,
    style: {
      stroke: '#fff',
      lineWidth: 2,
    },
  },
  tooltip: {
    showTitle: true,
    title: (d: any) => d.month,
    content: (d: any) => [`${d.type}: ${d.value.toLocaleString()} 用户`],
  },
  legend: {
    position: 'top',
  },
};

// 带警戒线的折线图
export const dataLine3 = [
  { date: '2024-01', value: 850 },
  { date: '2024-02', value: 920 },
  { date: '2024-03', value: 1100 },
  { date: '2024-04', value: 980 },
  { date: '2024-05', value: 1250 },
  { date: '2024-06', value: 1400 },
];

export const configLine3 = {
  data: dataLine3,
  xField: 'date',
  yField: 'value',
  xAxis: {
    title: { text: '日期', style: { fill: '#666' } },
    label: { style: { fill: '#999' } },
  },
  yAxis: {
    title: { text: '销售额', style: { fill: '#666' } },
    label: {
      style: { fill: '#999' },
      formatter: (v: string) => (Number(v) / 10000).toFixed(0) + '万',
    },
    min: 0,
  },
  smooth: true,
  line: {
    size: 2,
    color: '#1890ff',
  },
  point: {
    size: 4,
    color: '#1890ff',
    style: {
      stroke: '#fff',
      lineWidth: 2,
    },
  },
  annotations: [
    {
      type: 'lineY',
      yField: 1000,
      style: {
        stroke: 'red',
        lineDash: [4, 4],
      },
    },
    {
      type: 'text',
      data: ['2024-01', 1000],
      style: {
        text: '目标线: 1000万',
        fill: 'red',
        fontSize: 12,
      },
    },
  ],
  tooltip: {
    showTitle: true,
    title: (d: any) => d.date,
    content: (d: any) => [`销售额: ${(d.value / 10000).toFixed(2)} 万元`],
  },
};

// ============================================
// 双轴图示例配置 - configDualAxes
// ============================================

// 柱状图+折线图
export const dataDual = [
  { month: '1月', revenue: 120, growth: 0.15 },
  { month: '2月', revenue: 150, growth: 0.25 },
  { month: '3月', revenue: 180, growth: 0.2 },
  { month: '4月', revenue: 220, growth: 0.22 },
  { month: '5月', revenue: 280, growth: 0.27 },
  { month: '6月', revenue: 350, growth: 0.25 },
];

export const configDual = {
  data: dataDual,
  xField: 'month',
  yAxis: [
    {
      title: { text: '营收(万元)', style: { fill: '#666' } },
      label: {
        style: { fill: '#999' },
        formatter: (v: string) => v,
      },
      min: 0,
    },
    {
      title: { text: '增长率', style: { fill: '#666' } },
      label: {
        style: { fill: '#999' },
        formatter: (v: string) => (Number(v) * 100).toFixed(0) + '%',
      },
      min: 0,
      max: 0.5,
    },
  ],
  children: [
    {
      type: 'interval',
      yField: 'revenue',
      axisYIndex: 0,
      columnStyle: {
        fill: '#1890ff',
        radius: [4, 4, 0, 0],
      },
      tooltip: {
        showTitle: true,
        title: (d: any) => d.month,
        content: (d: any) => [`营收: ${d.revenue} 万元`],
      },
    },
    {
      type: 'line',
      yField: 'growth',
      axisYIndex: 1,
      smooth: true,
      line: {
        size: 2,
        color: '#52c41a',
      },
      point: {
        size: 4,
        color: '#52c41a',
        style: {
          stroke: '#fff',
          lineWidth: 2,
        },
      },
      tooltip: {
        showTitle: false,
        content: (d: any) => [`增长率: ${(d.growth * 100).toFixed(1)}%`],
      },
    },
  ],
};

// 多指标双轴图
export const dataDual2 = [
  { time: '2024-Q1', sales: 450, profit: 120, cost: 330 },
  { time: '2024-Q2', sales: 520, profit: 150, cost: 370 },
  { time: '2024-Q3', sales: 610, profit: 180, cost: 430 },
  { time: '2024-Q4', sales: 780, profit: 250, cost: 530 },
];

export const configDual2 = {
  data: dataDual2,
  xField: 'time',
  xAxis: {
    title: { text: '季度', style: { fill: '#666' } },
    label: { style: { fill: '#999' } },
  },
  yAxis: [
    {
      title: { text: '销售额', style: { fill: '#666' } },
      label: {
        style: { fill: '#999' },
        formatter: (v: string) => (Number(v) / 10000).toFixed(0) + '万',
      },
      min: 0,
    },
    {
      title: { text: '利润', style: { fill: '#666' } },
      label: {
        style: { fill: '#999' },
        formatter: (v: string) => (Number(v) / 10000).toFixed(0) + '万',
      },
      min: 0,
      position: 'right',
    },
  ],
  children: [
    {
      type: 'interval',
      yField: 'sales',
      axisYIndex: 0,
      columnStyle: {
        fill: '#5470C6',
        radius: [4, 4, 0, 0],
      },
      tooltip: {
        showTitle: true,
        title: (d: any) => d.time,
        content: (d: any) => [`销售额: ${d.sales} 万元`],
      },
    },
    {
      type: 'line',
      yField: 'profit',
      axisYIndex: 1,
      smooth: true,
      line: {
        size: 2,
        color: '#91CC75',
      },
      point: {
        size: 4,
        color: '#91CC75',
        style: {
          stroke: '#fff',
          lineWidth: 2,
        },
      },
      tooltip: {
        showTitle: false,
        content: (d: any) => [`利润: ${d.profit} 万元`],
      },
    },
  ],
};

// 收支对比双轴图
export const uvBillData = [
  { time: '1月', type: '支出', value: 80 },
  { time: '2月', type: '支出', value: 95 },
  { time: '3月', type: '支出', value: 110 },
  { time: '4月', type: '支出', value: 105 },
];

export const transformData = [
  { time: '1月', type: '收入', value: 120 },
  { time: '2月', type: '收入', value: 145 },
  { time: '3月', type: '收入', value: 180 },
  { time: '4月', type: '收入', value: 195 },
];

export const configDual3 = {
  data: [...uvBillData, ...transformData],
  xField: 'time',
  xAxis: {
    title: { text: '月份', style: { fill: '#666' } },
    label: { style: { fill: '#999' } },
  },
  yAxis: [
    {
      title: { text: '支出', style: { fill: '#666' } },
      label: { style: { fill: '#999' } },
      min: 0,
    },
    {
      title: { text: '收入', style: { fill: '#666' } },
      label: { style: { fill: '#999' } },
      min: 0,
      position: 'right',
    },
  ],
  children: [
    {
      data: uvBillData,
      type: 'interval',
      yField: 'value',
      axisYIndex: 0,
      seriesField: 'type',
      isGroup: true,
      columnStyle: {
        radius: [4, 4, 0, 0],
      },
      tooltip: {
        showTitle: true,
        title: (d: any) => d.time,
        content: (d: any) => [`${d.type}: ${d.value}`],
      },
    },
    {
      data: transformData,
      type: 'line',
      yField: 'value',
      axisYIndex: 1,
      seriesField: 'type',
      smooth: true,
      line: {
        size: 2,
        color: '#FA8C16',
      },
      point: {
        size: 4,
        color: '#FA8C16',
        style: {
          stroke: '#fff',
          lineWidth: 2,
        },
      },
      tooltip: {
        showTitle: false,
        content: (d: any) => [`${d.type}: ${d.value}`],
      },
    },
  ],
  legend: {
    position: 'top',
  },
};

// ============================================
// 图表组件映射
// ============================================

export const chartComponents: Record<string, React.ComponentType<any>> = {
  Pie,
  Column,
  Line,
  Area,
  DualAxes,
};

// 图表类型与组件名的映射
export const chartTypeMap: Record<string, string> = {
  configPie: 'Pie',
  configPie2: 'Pie',
  configPie3: 'Pie',
  configArea: 'Area',
  configArea2: 'Area',
  configColumn: 'Column',
  configColumn2: 'Column',
  configColumn3: 'Column',
  configLine: 'Line',
  configLine2: 'Line',
  configLine3: 'Line',
  configDual: 'DualAxes',
  configDual2: 'DualAxes',
  configDual3: 'DualAxes',
};
