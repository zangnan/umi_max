# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

应用开发工具 SDP（Software Development Platform），基于 Umi Max 框架的企业级前端应用，支持敏捷开发、多环境部署和微前端架构。

## 开发命令

```bash
# 开发模式启动（默认端口 3000）
npm run dev

# 开发模式启动（端口 3001）
npm run start

# 默认构建
npm run build

# 多环境构建
npm run build_nbglxt_pro    # 内部管理系统正式环境
npm run build_nbglxt        # 内部管理系统联调环境
npm run build_jww           # JWW 环境
npm run build_eggjs         # Node 环境

# 代码格式化
npm run format

# OpenAPI 服务生成
npm run openapi
```

## 技术栈

- **框架**: React 18 + @umijs/max 4.6.4 + TypeScript 5.0
- **UI 组件**: antd 6 + @ant-design/pro-components + @ant-design/x
- **数据可视化**: @antv/x6 (流程图) + @antv/s2 + @visactor/vtable (表格) + @ant-design/charts
- **状态管理**: Umi Model (DVA)
- **工具库**: ahooks, xlsx, jspdf, react-dnd, markdown-it

## 代码架构

### 目录结构

- `src/components/` - 核心组件库（DDXxx 系列），统一通过 `@/components` 导入
- `src/pages/` - 页面组件，按业务模块组织
- `src/services/` - API 服务层，OpenAPI 自动生成
- `src/models/` - DVA 全局状态模型（如 global.ts）
- `src/utils/` - 工具函数（如 format.ts）
- `src/types/` - TypeScript 类型定义
- `config/` - 路由配置和项目配置

### 核心组件

| 组件             | 用途                             |
| ---------------- | -------------------------------- |
| DDForm           | 表单组件（DDBaseForm、DDFilter） |
| DDBaseGrid       | 基础表格组件                     |
| DDBaseGridS2     | S2 分析表格                      |
| DDBaseGridVtable | VTable 高性能表格                |
| DDImport         | 数据导入                         |
| DDXai/DDXai2     | AI 对话组件                      |
| DDFlow           | 流程设计器                       |
| agility/         | 敏捷开发模块                     |

### 组件导出

所有组件在 `src/components/index.ts` 中统一导出，通过 `@/components` 别名导入：

```typescript
import { DDForm, DDBaseGrid } from '@/components';
```

### 全局常量与工具

- `DDAssist/constants` - 全局常量定义（路由、登录、存储键名等）
- `DDAssist/util` - 工具函数（权限验证、白名单检查等）

### 动态页面模式

项目使用 `automatic_page` 组件支持运行时动态配置页面：

- `src/pages/common/automatic_page.tsx` - 列表页面
- `src/pages/common/automatic_page_tree.tsx` - 树形列表页面
- 配置通过后端接口动态加载

## 关键配置

### 路由配置

路由采用模块化配置：

- `config/routes/routes.ts` - 基础路由
- `config/routes/routes.example.ts` - 示例页面路由
- `config/routes/routes.easyDev.ts` - 简易开发路由
- `config/routes/routes.easyDevDc.ts` - DC 简易开发路由

路由在 `config/config.ts` 中通过 `routes` 字段加载，支持动态路由和后端动态菜单加载（`LOCAL_MENU: false`）。

### 请求配置

请求配置位于 `src/requestConfig.ts`，基于 axios 实现统一的请求/响应拦截、Token 管理和错误处理。

**API 服务组织**：

- `src/services/api.ts` - 通用 API
- `src/services/egg_ervices/` - Node 环境 API（authority, common, db, sdp）
- `src/services/hts/` - HTS 环境 API

**API 服务调用规范**：

所有 API 服务调用必须添加 `myUtil.api.getApiRoot()` 作为前缀：

```typescript
import { request } from 'umi';
import myUtil from '@/components/DDAssist/util';

// 正确示例
export async function getOverview(params?: any) {
  return request(`${myUtil.api.getApiRoot()}/api/analysis/overview`, {
    method: 'GET',
    params,
  });
}

// 错误示例（不应使用）
// return request(`/api/analysis/overview`, ...)
// return request(`${API_URL_BASE}/analysis/overview`, ...)
```

获取 API 根地址的方式：
- `myUtil.api.getApiRoot()` - 获取带环境标识的 API 根地址（推荐）
- `API_URL_BASE` - 全局变量定义的 API 地址（部分场景可用）

### 布局系统

- `src/pages/Layout/` - 主布局组件
- `src/pages/Layout/rightContent.tsx` - 顶部右侧内容（用户信息、设置等）

### 多环境配置

通过 `build_env` 环境变量区分不同部署环境：

| 环境变量     | 用途             | 系统标题        |
| ------------ | ---------------- | --------------- |
| 默认         | 开发环境         | 应用开发工具    |
| `nbglxt`     | 内部管理系统联调 | 内部管理系统 T  |
| `nbglxt_pro` | 内部管理系统正式 | 内部管理系统    |
| `jww`        | JWW 联调环境     | 应用开发工具 T  |
| `eggjs`      | Node 环境        | 应用开发工具 DC |

### 运行时配置

全局变量通过 `config/config.ts` 的 `define` 配置：

- `API_URL_BASE` - 后端 API 地址
- `API_URL_BASE_NODE` - Node 环境 API 地址
- `ACCESS_CLIENT_ID` - 接入客户端 ID
- `ENV_TYPE` - 后端环境类型
- `SYS_TITLE` - 系统标题
- `VERSION_DATE` - 构建版本日期

## 代码规范

- 使用 prettier 进行代码格式化（`npm run format`）
- 使用 eslint 进行代码检查
- Git hooks 由 husky + lint-staged 管理
- 日期操作统一使用 `dayjs`，不再使用 `moment`（antd 5+ 默认支持 dayjs）

```typescript
// 正确示例
import dayjs, { Dayjs } from 'dayjs';

// 日期格式化
dayjs().format('YYYY-MM-DD')
dayjs('2024-01-01').format('YYYY-MM-DD HH:mm')

// 日期计算
dayjs().subtract(7, 'days')
dayjs().add(1, 'year')

// 日期范围
const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([
  dayjs().subtract(7, 'days'),
  dayjs(),
])
```

## 微前端

项目支持 qiankun 微前端架构，作为子应用运行。

## 用户偏好

- 提交推送代码前先告知用户，由用户决定是否提交
- 记录变更信息到 CLAUDE.md 而非自动提交

## 待提交变更（2026-06-10）

### r15：codeTable 数组 → 字符串 转换规则

**背景**：`scripts/convert-ddbunit-config.js` 把旧版 DDBunit2 协议 config 转为新协议。
源文件（`code_sample/src/pages/hts/dditax.ckts.from/.../auto_config.tsx` 等）在
`filter_items` / `form_items` / `grid_columns` / `grid_columns_tj` 四个节点的项对象
里大量使用 `codeTable: ['<key>', '<view>']` 数组形式（DDBunit2 旧协议）。新协议
（DDBunit2_CKTS）只接受 `codeTable: '<key>:<view>'` 字符串形式（与运行时
`@/components/DDAssist/util/index.tsx` 中 `getCode(key, viewKey)` 配合）。如不转换，
生成的 `src/pages/hts/.../auto_config.tsx` 在 DDBunit2_CKTS 加载时会因解析失败而抛错
或下拉不出数据。

**实现**：复用现有 r11/r14 SPECIAL_FIELD_RULES 框架（`scripts/convert-ddbunit-config.js`），
新增 `transformCodeTableArrays(content, configVar)` 函数，扫描 4 个目标块内两元素
字符串数组字面量，转换为字符串形式。注册为第 4 条规则。

**改动文件**：
- [scripts/convert-ddbunit-config.js](scripts/convert-ddbunit-config.js) — 加 r15
  头部注释、新增 `transformCodeTableArrays` 函数（[scripts/convert-ddbunit-config.js:899-951](scripts/convert-ddbunit-config.js#L899-L951)）、
  在 [SPECIAL_FIELD_RULES](scripts/convert-ddbunit-config.js#L530-L549) 追加新规则条目
- 新增测试 fixture：
  - [scripts/__fixtures__/codeTable-array-to-string.input.tsx](scripts/__fixtures__/codeTable-array-to-string.input.tsx)
  - [scripts/__fixtures__/codeTable-array-to-string.expected.tsx](scripts/__fixtures__/codeTable-array-to-string.expected.tsx)
  - [scripts/__fixtures__/codeTable-array-to-string.actual.tsx](scripts/__fixtures__/codeTable-array-to-string.actual.tsx)（test runner 自动生成）

**行为细节**：
- 作用域严格限定在 4 个目标块；其它位置的 `codeTable` 不动
- 仅匹配两元素字符串字面量数组（单/双引号均可；元素间空白容忍）
- 不匹配 3+ 元素数组、含变量/表达式的数组、已是字符串形式 —— 全部原样保留
- 输出统一单引号 `codeTable: 'X:Y'`，与项目源码风格一致
- 幂等：已转换的字符串形式不会再次匹配

**端到端验证**：对
`code_sample/src/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TSSB_GCB/auto_config.tsx`
跑 convert，r15 命中 9 处（filter_items 2 + form_items 7），全部正确转为字符串形式：

```
[convert] r11 codeTable 数组 → 字符串 (r15): 命中 9 处
```

**测试验证**：`npm run test:convert-config` → 13 通过 / 2 失败
（失败的 `default-nodes-and-xhcp` 与 `toolbar-ckts-sum` 是**预先存在**的失败：
`TOOLBAR_DEFAULT_RULES` 已被清空，但 fixture 期望未更新。与本次 r15 改动无关）。

**待用户决定**：以下文件改动由端到端验证产生，用户可按需决定是否提交：

- `src/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TSSB_GCB/auto_config.tsx`（9 处 codeTable 转换）
- `src/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TSSB_GCB/auto_config.README.md`（重新生成）
- `src/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TSSB_GCB/auto_configIndex.tsx`（重新生成）
