# 应用日志分析监控大屏实现计划

## 需求概述

基于 `app-log-analysis.md` 中的 8 个接口，创建一个应用日志分析监控大屏页面，展示系统级日志（sys_app_log）的统计分析数据。

## 核心设计

采用**监控大屏**布局，使用网格化卡片展示所有图表数据，每个图表区域提供"查看数据"按钮展开/收起原始数据表格。

## 页面布局

```
┌─────────────────────────────────────────────────────────────────┐
│  标题: 应用日志分析监控大屏                    [日期范围选择器]   │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐┌────────┐│
│  │今日日志量 │ │  ERROR  │ │  WARN   │ │  INFO   │ │日志总量││ 错误率││
│  │   406    │ │    56   │ │   123   │ │  12401  │ │ 12580  ││ 0.45% ││
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └────────┘└────────┘│
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    近7天趋势 (迷你折线图)                    ││
│  └─────────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────┐ ┌──────────────────────────────┐  │
│  │     日志级别分布         │ │     日志趋势分析              │  │
│  │        (饼图)           │ │      (折线图)                │  │
│  │ [查看数据]              │ │ [查看数据]                   │  │
│  └──────────────────────────┘ └──────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                  ERROR 错误码 TOP10 (柱状图)                ││
│  │                       [查看数据]                            ││
│  └─────────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────┐ ┌──────────────────────────────┐  │
│  │     TOP IP 来源分布       │ │    TOP 请求 URL 分布          │  │
│  │       (柱状图)           │ │       (柱状图)               │  │
│  │ [查看数据]              │ │ [查看数据]                   │  │
│  └──────────────────────────┘ └──────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────┐ ┌──────────────────────────────┐  │
│  │     24小时分布           │ │     星期分布                  │  │
│  │       (柱状图)           │ │       (柱状图)               │  │
│  │ [查看数据]              │ │ [查看数据]                   │  │
│  └──────────────────────────┘ └──────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## API 接口对应

| 接口地址 | 接口描述 | 页面板块 |
|----------|----------|----------|
| POST /api/appLog/overview | 概览仪表盘 | 顶部指标卡片 + 近7天趋势 |
| POST /api/appLog/levelDistribution | 级别分布 | 日志级别分布饼图 |
| POST /api/appLog/trend | 趋势分析 | 日志趋势折线图 |
| POST /api/appLog/errorCodes | 错误码统计 | ERROR 错误码 TOP10 |
| POST /api/appLog/byIp | 来源分布(IP) | TOP IP 来源分布 |
| POST /api/appLog/byUrl | 来源分布(URL) | TOP 请求 URL 分布 |
| POST /api/appLog/hourlyDistribution | 24小时分布 | 24小时分布 |
| POST /api/appLog/weeklyDistribution | 星期分布 | 星期分布 |

## 实现细节

### 1. API 服务文件

**文件**: `src/services/apiAppLog.ts`

创建 8 个接口调用函数：

```typescript
// 概览仪表盘
export async function getOverview(params)       // POST /api/appLog/overview
// 级别分布
export async function getLevelDistribution(params) // POST /api/appLog/levelDistribution
// 趋势分析
export async function getTrend(params)          // POST /api/appLog/trend
// 错误码统计
export async function getErrorCodes(params)    // POST /api/appLog/errorCodes
// 来源分布 - IP
export async function getByIp(params)          // POST /api/appLog/byIp
// 来源分布 - URL
export async function getByUrl(params)         // POST /api/appLog/byUrl
// 24小时分布
export async function getHourlyDistribution(params) // POST /api/appLog/hourlyDistribution
// 星期分布
export async function getWeeklyDistribution(params) // POST /api/appLog/weeklyDistribution
```

### 2. 页面组件

**文件**: `src/pages/easy_dev_dc/analysis/AppAnalysis/index.tsx`

使用 `@ant-design/pro-components` 的 `ProCard` 实现网格布局：

- **顶部指标卡**: 6 个统计卡片 (StatisticCard)
  - 今日日志量、ERROR、WARN、INFO、日志总量、错误率
- **近7天趋势**: 迷你折线图
- **日志级别分布**: 饼图 + 展开数据表格
- **日志趋势分析**: 折线图 + 展开数据表格
- **ERROR 错误码 TOP10**: 柱状图 + 展开数据表格
- **TOP IP 来源分布**: 柱状图 + 展开数据表格
- **TOP 请求 URL 分布**: 柱状图 + 展开数据表格
- **24小时分布**: 柱状图 + 高峰时段标注 + 展开数据表格
- **星期分布**: 柱状图 + 展开数据表格

**交互设计**:
- 日期范围选择器：支持今天/最近7天/14天/30天/90天快捷选项
- 每个图表区域提供"查看数据"按钮，点击展开/收起显示原始数据表格
- 24小时分布显示高峰时段信息

### 3. 路由配置

**文件**: `config/routes.ts`

```typescript
{ path: '/appAnalysis', component: './easy_dev_dc/analysis/AppAnalysis', name: '应用日志分析', icon: 'FundProjectionScreenOutlined' }
```

## 关键文件

| 文件 | 说明 |
|------|------|
| `src/services/apiAppLog.ts` | API 服务 |
| `src/pages/easy_dev_dc/analysis/AppAnalysis/index.tsx` | 监控大屏主组件 |
| `config/routes.ts` | 路由配置 |

## 数据字段对应

### 概览数据 (overview)

| 字段 | 说明 | 页面用途 |
|------|------|----------|
| totalCount | 日志总量 | 统计卡片 |
| todayCount | 今日日志量 | 统计卡片 |
| errorCount | ERROR 总数 | 统计卡片 |
| warnCount | WARN 总数 | 统计卡片 |
| infoCount | INFO 总数 | 统计卡片 |
| errorRate | 错误率(%) | 统计卡片 |
| trendData | 近7天趋势 | 迷你折线图 |

### 级别分布 (levelDistribution)

| 字段 | 说明 | 页面用途 |
|------|------|----------|
| level | 级别名称 | 饼图标签 |
| count | 数量 | 饼图数值 |
| percentage | 占比 | 数据表格 |

### 趋势数据 (trend)

| 字段 | 说明 | 页面用途 |
|------|------|----------|
| time | 时间点 | 折线图X轴 |
| total | 总量 | 折线图数据 |
| info | INFO数量 | 折线图数据 |
| warn | WARN数量 | 折线图数据 |
| error | ERROR数量 | 折线图数据 |

### 错误码数据 (errorCodes)

| 字段 | 说明 | 页面用途 |
|------|------|----------|
| errorCode | 错误码 | 柱状图标签/表格 |
| count | 出现次数 | 柱状图数值/表格 |
| firstTime | 首次出现 | 表格 |
| lastTime | 最后出现 | 表格 |

### IP分布 (byIp)

| 字段 | 说明 | 页面用途 |
|------|------|----------|
| ip | IP地址 | 柱状图标签/表格 |
| totalCount | 日志总量 | 柱状图数值/表格 |
| errorCount | ERROR数 | 表格 |
| warnCount | WARN数 | 表格 |
| firstTime | 首次日志 | 表格 |

### URL分布 (byUrl)

| 字段 | 说明 | 页面用途 |
|------|------|----------|
| url | 请求URL | 柱状图标签/表格 |
| totalCount | 日志总量 | 柱状图数值/表格 |
| errorCount | ERROR数 | 表格 |
| warnCount | WARN数 | 表格 |

### 24小时分布 (hourlyDistribution)

| 字段 | 说明 | 页面用途 |
|------|------|----------|
| hourlyDistribution | 每小时列表 | 柱状图/表格 |
| hour | 小时(0-23) | X轴/表格 |
| total | 总量 | Y轴/表格 |
| error | ERROR数 | 表格 |
| warn | WARN数 | 表格 |
| peakHour | 高峰时段 | 页面显示 |

### 星期分布 (weeklyDistribution)

| 字段 | 说明 | 页面用途 |
|------|------|----------|
| distribution | 星期列表 | 柱状图/表格 |
| dayOfWeek | 星期(1-7) | 表格 |
| dayName | 星期名称 | X轴/表格 |
| total | 总量 | Y轴/表格 |
| error | ERROR数 | 表格 |
| warn | WARN数 | 表格 |
