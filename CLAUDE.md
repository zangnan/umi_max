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

## 变更记录

### 2026-08-27 — commit `dc27944` `feat(vtable): 增强 DDBaseGridVtable 支持自定义工具栏按钮 并接通 test0001 页面`

- **新增功能**
  - [src/components/DDBaseGridVtable/types.ts](src/components/DDBaseGridVtable/types.ts)：新增 `DDVTableCustomerToolbarItem` 接口；在 `DDVTableConfig` 上加 `customer_toolbar?: DDVTableCustomerToolbarItem[]`；在 `DDVTableProps` 上加 `onCustomBtn?: Record<string, (param) => void>`
  - [src/components/DDBaseGridVtable/index.tsx](src/components/DDBaseGridVtable/index.tsx)：新增 `customerToolbar` state + `invokeCustomBtn`（props → window 兜底 → 未注册提示）+ `renderCustomerToolbar`，渲染到主按钮组左侧；新增 `readVTableSelection` 帮助函数（封装 `getCheckboxState('')` + `stateManager.checkedState` 双路径反查选中行/键）
- **接通页面**
  - [src/components/DDBunit/automatic_page_vtable.tsx](src/components/DDBunit/automatic_page_vtable.tsx)：扩展签名 `React.FC<{ onCustomBtn?: DDVTableProps['onCustomBtn'] }>`，透传到 `<DDVTable>`；为 [src/pages/common/automatic_page_enh.tsx](src/pages/common/automatic_page_enh.tsx) 与 test0001 两个调用方提供可选 prop（向后兼容）
  - [src/pages/example/test0001/index.tsx](src/pages/example/test0001/index.tsx)：注册 `onCustomBtn = { doKp, doHb }`，与 [src/pages/example/vtable/ddvtable/index3.tsx](src/pages/example/vtable/ddvtable/index3.tsx) 演示页行为对齐（`message.info` + `console.log`）
- **修复**
  - `DDBaseGridVtable` 中三处调用不存在的 VTable API `getSelectedRowIds` / `getSelectedRecords`：`renderCustomerToolbar`、`handleReload`、`change_selection` 监听，全部改为 `readVTableSelection()`
  - `param` 计算时机由 render 期改为 click 期（之前选中后 param 仍为初始空数组）
- **附属**
  - [src/pages/common/automatic_page_enh.tsx](src/pages/common/automatic_page_enh.tsx)：新增文件（10 行包装 `<AutomaticPageVTable />`，未挂路由）

### 验证

- URL `http://localhost:3001/example/cfgp/eg_m_mts_tsjh` → 工具栏出现 `开票` / `合并`，勾选 N 条后点击弹 "当前选中 N 条" 并打印完整 `param`

### 2026-08-27 — commit `bbd10bd` `feat(vtable): DDBaseGridVtable 支持自定义操作列按钮 并接通 test0001 页面预览/审批`

- **新增功能**
  - [src/components/DDBaseGridVtable/types.ts](src/components/DDBaseGridVtable/types.ts)：新增 `DDVTableCustomerGridColItem` 接口（`name`/`func`/`key?`/`disabled?: boolean | string`）；`DDVTableConfig` 加 `customer_grid_col?: DDVTableCustomerGridColItem[]`
  - [src/components/DDBaseGridVtable/index.tsx](src/components/DDBaseGridVtable/index.tsx)：
    - 新增 `customerGridCol` state（兼容读取 `config.customer_grid_col || config.handle_columns`，DDBunit2 旧字段不丢）
    - 改造 `getHandleColumn`：列宽度计算追加自定义按钮宽度（字符数 × 14px + 10px 间距）；`buttonConfigs` 追加 `actionType = "custom:<func>:<idx>"`；当仅自定义按钮时也显示操作列
    - 扩展 `handleCellClick`：命中 `custom:` 前缀的 actionType 时提取 `func`，拼装 `{record, tableRef, moduleKey, selectionRowKeys, selectionRows}` 后调用 `invokeCustomBtn`（复用 props → window 兜底 → 未注册提示通道）
- **接通页面**
  - [src/pages/example/test0001/index.tsx](src/pages/example/test0001/index.tsx)：在 `onCustomBtn` 内追加 `doYl` / `doSp` 处理器（弹 `message.info` + 控制台 `console.log`）
- **兼容性**
  - `assemble_config_util.tsx` 未改动，继续产出 `handle_columns`，由 DDVTable 通过 `config.customer_grid_col || config.handle_columns` 兼容读取
  - `DDBunit2.tsx`、内置 `edit/delete/detail` 行为完全不变

### 验证

- URL `http://localhost:3001/example/cfgp/eg_m_mts_tsjh` → 操作列出现 `编辑` / `删除` / `详情` + `预览` / `审批`；点击 `预览` 弹 "预览：当前行 = {...}" 并打印完整 `param`；工具栏 `开票` / `合并` 不受影响

### 2026-08-27 — commit `8671998` `fix(vtable): 修复 /dynamicbs1/enh/cfgp/* 路由切换时数据残留问题`

- **问题**：四个 `/dynamicbs1/enh/cfgp/...` 路由（`eg_m_mts_tsjh` / `eg_m_mts_tssb` / `m_sys_api_log` / `m_sys_app_log`）均绑定到 [src/pages/common/automatic_page_enh.tsx](src/pages/common/automatic_page_enh.tsx)。访问 A 后访问 B，B 表格展示的是 A 的数据；切回 A 又正确。
- **根因**：[src/components/DDBunit/automatic_page_vtable.tsx:195](src/components/DDBunit/automatic_page_vtable.tsx#L195) 的 `<DDVTable>` 未绑定 `key`。父 `init()` 在 URL 变化时会跑、`setMyConfig(newConfig)` 会触发重渲染，但 `<DDVTable>` 是同一实例。DDVTable 内部 [src/components/DDBaseGridVtable/index.tsx:488](src/components/DDBaseGridVtable/index.tsx#L488) `hasInitialLoad = useRef(false)` 仅在**首次挂载**时调用 `loadData()`，切模块时不会重跑。
- **修复**：参考 [src/components/DDBunit/automatic_page.tsx:76](src/components/DDBunit/automatic_page.tsx#L76)（工作版本）与 [src/pages/example/vtable/ddvtable/index3.tsx:116](src/pages/example/vtable/ddvtable/index3.tsx#L116)（演示页）既有做法，加 `key={myConfig?.module_key}`。`module_key` 变化时 React 卸载/重建组件，触发首次加载分支重新拉取数据。
- **附带**：[src/pages/User/Login/index.less](src/pages/User/Login/index.less) 微调（`margin: -8px`）。

### 验证

- 依次访问 `eg_m_mts_tsjh` → `eg_m_mts_tssb` → `m_sys_api_log` → `m_sys_app_log` → `eg_m_mts_tsjh`：每页表格数据正确切换，Network 每次都触发对应模块的 `grid_query`

### 2026-08-27 — commit `80ec0b8` `feat(home): 首页快捷入口增加 BorderBeam 边框流光效果`

- **改动**
  - [src/pages/Home/index.tsx](src/pages/Home/index.tsx)：
    - 从 antd 导入 `BorderBeam`
    - 每个 `quickEntries` 项增加 `borderBeamColor` 三段渐变色配置（按入口风格区分）
    - 渲染处用 `<BorderBeam color={entry.borderBeamColor}>` 包裹快捷入口 `<Card>`，实现边框流光效果

### 验证

- 访问首页 → 6 个快捷入口卡片（系统构建 / 文档生成 / AI主题 / 接口日志 / 系统日志 / 工具文档）均显示动态彩色边框流光，颜色组合与配置一致

### 2026-10-10 — commit `59ad5de` `chore(deps): 升级 @antv/x6 v2 → v3.1.8 并适配 v3 API`

- **依赖**
  - [package.json](package.json)：`@antv/x6` `^2.19.2` → `^3.1.8`
  - [yarn.lock](yarn.lock)：依赖树同步
  - 删除 [pnpm-lock.yaml](pnpm-lock.yaml)（项目以 yarn 为准，pnpm 锁文件作废）
- **v3 API 适配**
  - [src/components/DDFlow/DDFlowUtil.tsx](src/components/DDFlow/DDFlowUtil.tsx)：插件合并到主包后调整 import 形态
  - [src/pages/example/X6/X601.tsx](src/pages/example/X6/X601.tsx) / [src/pages/example/X6/X601 copy.tsx](src/pages/example/X6/X601%20copy.tsx) / [src/pages/example/other/x6er.tsx](src/pages/example/other/x6er.tsx)：演示页 `Color.random().toHex()` → `Color.randomHex()`（v3 中 `Color` 为 namespace，`randomHex` 挂在其上）

### 验证

- `yarn build` / `yarn dev` 通过；3 个 X6 演示页拖拽/连线/撤销重做正常

### 2026-10-10 — commit `7d102da` `feat(flow): flow_edit 保存按 ENV_TYPE 分支 + 兼容 Node(eggjs) 蛇形字段`

- **背景**：原 DDFlowDesigner 保存只调 `editFlow`（`POST /dict/procdef/save`，Java 后端专用）；Node(eggjs) 后端不可用。整条流程编辑链路（打开 / 编辑 / 保存 / readonly）的字段读取也全部硬编码驼峰，Node 后端返回蛇形导致空标题、空选项、流程图不显示等连锁问题。
- **保存分支**
  - [src/components/DDFlow/DDFlowDesigner.tsx:115-147](src/components/DDFlow/DDFlowDesigner.tsx#L115-L147) `saveFlow`：新增 `ENV_TYPE === 'node'` 分支走 `saveOrUpdate`（`POST /dict/automatic/exp/bs/saveOrUpdate/nbgl_process_def`），与母页"新建/编辑流程信息"同一接口；非 Node 保留原 `editFlow` 行为不变
  - 顺手补 `graph.dispose()` 卸载清理（v2/v3 通用，避免事件监听与节点组件累积）
- **读取命名兼容（响应体）**
  - [src/components/DDAssist/util/customerBuss.tsx:119](src/components/DDAssist/util/customerBuss.tsx#L119) `openModalFlow`：读 `record.xtgl_process_data || record.xtglProcessData` —— 修复"编辑流程后再次进入看不到图"（Node 下原代码读到 undefined → `data: []` → 画布全空）
  - [src/components/DDAssist/util/customerBuss.tsx:132](src/components/DDAssist/util/customerBuss.tsx#L132) `openModalFlowReadonly`：读 `record.xtgl_process_run_id || record.xtglProcessRunId`
  - [src/components/DDAssist/util/customerBuss.tsx:136-137](src/components/DDAssist/util/customerBuss.tsx#L136-L137) `openModalFlowReadonly`：读 `processDef.xtgl_process_data || processDef.xtglProcessData`，避免 Node 下 `JSON.parse({})` 抛错
  - [src/components/DDAssist/util/customerBuss.tsx:131-145](src/components/DDAssist/util/customerBuss.tsx#L131-L145) `openModalFlowReadonly` 请求体：按 `ENV_TYPE` ternary 选 `xtgl_process_run_id` 或 `xtglProcessRunId`（请求体只发一个 key，避免后端重复字段处理）
  - [src/components/DDFlow/DDFlowDesigner.tsx:79-89](src/components/DDFlow/DDFlowDesigner.tsx#L79-L89) readonly 任务高亮：读 `xtgl_process_task_flag || xtglProcessTaskFlag`、`xtgl_process_task_id || xtglProcessTaskId`
  - [src/components/DDFlow/DDFlowDesigner.tsx:229-230](src/components/DDFlow/DDFlowDesigner.tsx#L229-L230) 角色下拉：读 `role_name || roleName`、`role_id || roleId`
- **组织架构树（预加载在 App 启动时）**
  - [src/pages/nbglxt/common/nbglxtUtil.tsx:10-32](src/pages/nbglxt/common/nbglxtUtil.tsx#L10-L32) `app.init`：原代码已用 `ENV_TYPE === 'node'` 区分 `idName`，但 `title` / `value` / `name` / `pid` 仍读驼峰。补齐 ternary 到 `idField` / `nameField`（`org_id` / `org_name`），`pid` 用 `??` 兜底兼容 `parent_id`（不确定 Node 实际字段名，宁可保留原值不强行覆盖）
- **约定**：Node(eggjs) 后端 dict/流程相关表统一返回蛇形字段名；Java 后端返回驼峰。前端读取处一律 `||` 兜底，请求体构造处用 `ENV_TYPE === 'node'` ternary

### 验证

- **Java/默认环境**：行为完全不变，`editFlow` 仍调 `/dict/procdef/save`，所有 `||` 兜底走左值（驼峰存在）
- **Node(eggjs) 环境**：
  - 从母页"编辑流程"进入 flow_edit → 画布显示已有图（`openModalFlow` 正确读到 `xtgl_process_data`）
  - 编辑后保存 → Network 走 `/dict/automatic/exp/bs/saveOrUpdate/nbgl_process_def`，toast "保存成功！"
  - 再次"编辑流程" → 画布显示刚保存的图
  - 右侧"角色"下拉列出全部角色（`role_name` / `role_id` 正确读取）
  - 右侧"组织架构"下拉列出组织树（`nbglxtUtil` 启动预加载的新数据；DevTools → Session Storage 删旧 `treeTable` 后重新登录）
  - readonly 流程：API 请求体带 `xtgl_process_run_id`，当前运行节点高亮正确（`xtgl_process_task_flag` / `xtgl_process_task_id` 正确读取）
