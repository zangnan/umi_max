# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 已提交变更（2026-07-16）

### commit 9a0a8f3 — feat(DDBunit2/DDForm): otherParam 透传 + cktsUtil 'in'→'ain' 端点修复 + dkpbgd eventOnChange 修正

**改动 9 文件 / +41 -11**：

1. **DDBunit2 → DDFilter → DDFilterSimple → DDItems 链路新增 `otherParam` 透传**（5 个文件）：
   - [src/components/DDForm/data.d.ts](src/components/DDForm/data.d.ts) — `FilterProps` / `FilterSimpleProps` 加 `otherParam?: any`
   - [src/components/DDForm/DDFilter.tsx](src/components/DDForm/DDFilter.tsx) — 接收 `otherParam` → 传 `<DDItems otherParam={otherParam}/>`
   - [src/components/DDForm/DDFilterSimple.tsx](src/components/DDForm/DDFilterSimple.tsx) — 同上
   - [src/components/DDBunit/DDBunit2.tsx](src/components/DDBunit/DDBunit2.tsx) — 2 处 `<DDFilter>` 实例化都加 `otherParam={{ otherRef: getOtherRefs(), unitKey, refGrid, refUnit }}`；`formUtil.init` 加 `func: func` 透传给 DDItems
   - 目的：表单事件回调 (`eventOnChange` / `eventOnBlur` 等) 中需要访问 `param.refUnit` / `param.refGrid` 引用外部组件实例 —— 旧版 `param.refUnit`（直接根级）已不工作，新版 `param.otherParam.refUnit` 透传链

2. **formUtil 老版本 onChange 兼容**（[src/components/DDForm/formUtil.tsx:158-160](src/components/DDForm/formUtil.tsx#L158)）：
   ```js
   if (eventOnChange && func[eventOnChange]) {// 兼容老版本
     item.onChange = func[eventOnChange];
   }
   ```
   - 之前只匹配 `func?.eventOnChange?.[eventOnChange]`（新版协议：Func.eventOnChange 是个对象字面量）
   - 加一行直接 `func[eventOnChange]` 兼容老版（Func[eventOnChange] 直接是函数）
   - 命中顺序：先新版再老版（新版优先级高）

3. **cktsUtil.handleHtsRequest 3 端点 'in' → 'ain' 转换**（[src/pages/hts/cktsUtil.tsx:273-284](src/pages/hts/cktsUtil.tsx#L273)）：
   ```js
   if (url.indexOf('/yw/bszx/ggfw/scsbsj/sjgl/querySbsjJlCp') > -1 ||
       url.indexOf('/yw/bszx/ggfw/shjgcx/queryPagerSblbCp') > -1 ||
       url.indexOf('/yw/fpzs/bgdkp/dkpbgdfycx') > -1) {
     config.data = {
       ...config.data,
       searchModel: config.data.searchModel.map((item: any) =>
         item?.op === 'in' ? { ...item, op: 'ain' } : item,
       ),
     };
   }
   ```
   - 业务端 searchModel 用 `op: 'in'`，但 HTS 这 3 个端点后端要求 `op: 'ain'`
   - 与 18 业务前缀 `key += '_CX'` 机制平行（不影响该机制）

4. **dkpbgd 页面修复**（3 文件）：
   - [config.tsx:160](src/pages/hts/ckfpkj/abgdkj/dkpbgd/config.tsx#L160) — `onChange: 'handleOnChangeBgd'` → `eventOnChange: 'handleOnChangeBgd'`（新协议字段名）
   - [config.tsx:163-166](src/pages/hts/ckfpkj/abgdkj/dkpbgd/config.tsx#L163) — `list` 项 `{ label, value }` → `{ name, value }`（与运行时 `getCode` 期望的 key 一致）
   - [index.tsx:245-250](src/pages/hts/ckfpkj/abgdkj/dkpbgd/index.tsx#L245) — 同款 `onChange` → `eventOnChange` + `label` → `name`
   - [f.tsx:631](src/pages/hts/ckfpkj/abgdkj/dkpbgd/f.tsx#L631) — `param.refUnit.current.getGridParams()` → `param.otherParam.refUnit.current.getGridParams()`（与新透传链一致）

**端到端验证**：
- 启动 `npm run dev`，进入 `/hts/ckfpkj/abgdkj/dkpbgd`
- 「报关单类型」下拉切换 → `handleOnChangeBgd` 触发 → 取到 `searchModel` 并展开日期范围 ✓
- 调用 `/yw/bszx/ggfw/scsbsj/sjgl/querySbsjJlCp` 端点 → `op: 'in'` 自动转 `'ain'` ✓

**已知限制**（用户决策接受）：
- 字符串/注释里的 `otherParam` 不会被识别 —— 实际数据无此场景
- `func[eventOnChange]` 兼容老版本只在 formUtil 命中；若 `func` 是 `null/undefined` 不会抛错（短路）
- `op` 转换是 'in' → 'ain' 单向；不做 'ain' → 'in'（业务无此反向需求）

## 待提交变更（2026-07-14）

### 修复 antd v6 RangePicker `getUDayjs(...).isValid is not a function` 报错 + 批量迁移

**背景**：浏览器运行时抛 `TypeError: getUDayjs(...).isValid is not a function`，
调用栈定位到 antd v6 `<RangePicker>` 内部 `generateConfig.isValidate`。

**根因**：`@rc-component/picker@1.10.0` 的 `getUDayjs` 逻辑 bug（`dayjs.js:106-111`）：
```js
var getUDayjs = function getUDayjs(value) {
  if (!dayjs.isDayjs(value) || value instanceof dayjs) {
    return value;          // 任何非 dayjs 都直接原样返回！
  }
  return dayjs(value.valueOf());
};
```
对 string / moment / Date 都会直接返回原值，下面的 `.isValid()` 调用炸。

两类调用方把 string 塞进了 RangePicker `defaultValue`：

1. **`myUtil.date.getDateNYRBeforeCurr(...)`** 返回 `"YYYY-MM-DD"` 字符串
   （[src/components/DDAssist/util/index.tsx:859-866](src/components/DDAssist/util/index.tsx#L859) 内 `return date;`）
2. **`myUtil.date.formatData(...)`** —— util 里**根本不存在**该方法（只有 `formatDate`），
   引用方原本会先炸 `formatData is not a function`，但因 bug 链位置靠后表现为 RangePicker 报错

**关键设计点**：

- 新规则匹配精确且互不干扰（`\b` 词边界 / 全字匹配）
- 6 条规则一次性把 30+ 兄弟文件批量改写
- 新增 `cktsUtil.grid.handleSpeSearchModel(param, searchModel)` 给老 `UnitUtil.grid` 接入
  数据报表模块特殊搜索参数处理（`moduleType === 'sjbb' || 'QZ_type'` 时把 `op` 强制设为 `'zdy'`）

**改动文件（32 个）**：

1. **新增 6 条 replace.ts 规则**（[scripts/convert-ddbunit-config.rules.json:321-344](scripts/convert-ddbunit-config.rules.json#L321)）：

   | # | 规则 |
   |---|---|
   | 1 | `myUtil.date.formatData` → `myUtil.date.formatDate` |
   | 2 | `.defaultValue = [timeQ, timeZ];` → `.defaultValue = [dayjs(timeQ), dayjs(timeZ)];` |
   | 3 | `timeQ = moment(` → `timeQ = dayjs(` |
   | 4 | `timeZ = moment(` → `timeZ = dayjs(` |
   | 5 | `moment(param.record.` → `dayjs(param.record.` |
   | 6 | `moment(searchModel[` → `dayjs(searchModel[` |

2. **支持函数改动**：
   - [src/components/DDBunit/unit_util.tsx:66-67](src/components/DDBunit/unit_util.tsx#L66) — `UnitUtil.grid` 末尾调用 `cktsUtil.grid.handleSpeSearchModel(param, searchModel)`
   - [src/pages/hts/cktsUtil.tsx:1229-1238](src/pages/hts/cktsUtil.tsx#L1229) — 新增 `handleSpeSearchModel` 函数
   - [src/pages/hts/jljg/mxcj/drawer_list.tsx:50](src/pages/hts/jljg/mxcj/drawer_list.tsx#L50) — `formatData` → `formatDate`

3. **批量应用规则到 28 个页面文件**（`src/pages/hts/sjbb/{sc,wm}/tjbb/` + `ckfp/` + `ckfpkj/`）：
   - 6 个 `common/bgdtsqk/fptsqk` drawer_list.tsx：formatData→formatDate + dayjs 包裹 defaultValue
   - 16 个 `tsqk/*/index.tsx`：moment→dayjs + dayjs 包裹 defaultValue
   - 8 个 `bgdtsqk/{ckbgdmx,ckbgdtsqk,wsbbgdmx}/index.tsx` + 4 个 `fptsqk/{wsbzzsfpmx,zzszyfpmx}/index.tsx`：同款
   - 2 个 `abgdkj/index.tsx`：formatData→formatDate（ckfp + ckfpkj 各 1）
   - 2 个 `sjbb/{sc,wm}/tjbb/common/drawer_list.tsx`：本次主目标 + 手工同步

**端到端验证**：
- `npm run dev` 启动 dev server
- 浏览器打开 `/hts/sjbb/sc/tjbb/ckqk/fyhz` → 点击行操作按钮 → Drawer 打开
- **期望**：Console 不再抛 `getUDayjs(...).isValid is not a function`；RangePicker 显示当月起止
- 切到 `/hts/sjbb/wm/tjbb/ckqk/fyhz` 重复验证 wm 版本
- TypeScript 检查：`npx tsc --noEmit`

**已知限制**（用户决策接受）：
- **`getDateNYRBeforeCurr` util 本身仍返回 string** —— 影响范围太大（`src/pages/hts/cktsUtil.tsx:1212-1222` 也用），按本方案由 caller 在外层 `dayjs()` 包裹
- **与 `c8cf653` 决策相反** —— 那 4 个 revert 文件（DDItems / znfx / Zdylb3 / wfkMxtsMod）保留 moment 不动；本批改动属于"其余文件统一回 dayjs"
- **`handleSpeSearchModel` 仅覆盖 `sjbb` / `QZ_type`** —— 其它 moduleType 走原 UnitUtil.grid 逻辑
- **`UnitUtil.grid` 中新加的 `handleSpeSearchModel` 调用紧跟现有 `.forEach`**（[unit_util.tsx:67](src/components/DDBunit/unit_util.tsx#L67)），不改变既有调用语义

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

## 待提交变更（2026-06-11）

### r16: form_api_save / form_api_delete 转换规则（重命名 + 剥 ${API_URL_BASE} 前缀）

**背景**：现有 4 条 SPECIAL_FIELD_RULE（r11 / r14 / r15）覆盖 ellipsis / 默认节点
/ TextArea / codeTable 等字段变换，但**键名 + 模板字面量**这种**复合**转换还没
覆盖。code_sample 16 个文件 / 47 处 `form_api_save` / `form_api_delete` 字段
（值形如 `` `${API_URL_BASE}/xxx` ``），按业务新协议应改为：

- 源：`myConfig.form_api_save = \`${API_URL_BASE}/xxx\`;`
- 目标：`myConfig.api_form_edit = \`/xxx\`;`
- 源：`myConfig.form_api_delete = \`${API_URL_BASE}/xxx\`;`
- 目标：`myConfig.api_form_delete = \`/xxx\`;`

**关键设计点**：

- 既有 `rules.renames` 用 `\b` 词边界匹配 → 加 `form_api_save` → `api_form_edit`
  自动不会误改 `form_api_save_upload`（下划线属 `\w`，无 word boundary）✓
- 但 `renames` **只改 key 不改 value**，无法剥离 `${API_URL_BASE}` 前缀
- 因此新增**单一 transform** 同时做 key 重命名 + value 前缀剥离，
  复用两次（SPECIAL_FIELD_RULES + `extractMyConfigAdjustments` 内调用）

**数据扫描**（[code_sample/src/pages/hts/dditax.ckts.from/](code_sample/src/pages/hts/dditax.ckts.from/) 16 个文件）：

| 分布 | 文件数 | 转换机制 |
|---|---|---|
| 顶层 `unitConfig` 已有 `form_api_save` | 6 / 16 | SPECIAL_FIELD_RULE（r16）处理 |
| 仅 `index.tsx` 调整块里有 `form_api_save` | 10 / 16 | `extractMyConfigAdjustments` 内调用同一函数 |

`form_api_save_upload` 在 13/16 文件共存 — 用户决策**保持原样**（\b 词边界
已自动保护，无需额外防护）。

**改动**：

1. **新增 `transformFormApiSaveDelete(content, configVar)`**：
   紧贴 `transformCodeTableArrays`（r15，[line 921-964](scripts/convert-ddbunit-config.js#L921-L964)）下方。
   - 两次 `.replace`，分别处理 `form_api_save` 和 `form_api_delete`
   - regex 模板：
     ```
     (<configVar>\.)\bform_api_(save|delete)\b(\s*=\s*)`\${API_URL_BASE}(/[^`]*)`
     ```
   - 替换：保留 `<configVar>.`，key 改 `api_form_edit` / `api_form_delete`，
     值保留 `/...` 段
   - `\b` 词边界保护 `form_api_save_upload` 变体

2. **注册为 SPECIAL_FIELD_RULE 第 5 条**（[line 535-554](scripts/convert-ddbunit-config.js#L535-L554)）
   ```js
   {
     name: 'form_api_save/delete 重命名 + 剥 ${API_URL_BASE} 前缀 (r16)',
     apply: transformFormApiSaveDelete,
   }
   ```
   主流程 `applySpecialFieldRules` 循环自动调度

3. **在 `extractMyConfigAdjustments` 内调用**（[line 1358-1771](scripts/convert-ddbunit-config.js#L1358-L1771)）：
   插入位置 = `stripGridParamsBlock` 之后、Change 1（`myUtil.menu` 重写）之前
   ```js
   {
     const r16 = transformFormApiSaveDelete(text, 'myConfig');
     if (r16.count > 0) {
       text = r16.content;
     }
   }
   ```
   `configVar` 硬编码 `'myConfig'`（参照文件里固定用法）

4. **新增 fixture `form-api-save-delete-rename`**（4 个文件）：
   - `form-api-save-delete-rename.input.tsx`：顶层 `unitConfig` 场景测试
   - `form-api-save-delete-rename.ref.tsx`：调整块场景测试
   - `form-api-save-delete-rename.expected.tsx` / `.expected.index.tsx`：期望输出

**端到端验证**：

| 目录 | 场景 | 结果 |
|---|---|---|
| `MDT___ZXSB_SB_MDT_SYYK_GCB` | 调整块含 3 字段 | `form_api_save` → `api_form_edit`（剥前缀）；`form_api_save_upload` 剥前缀（r17 覆盖）；`form_api_delete` → `api_form_delete`（剥前缀）✓ |
| `MDT___ZXSB_SB_MDT_YFSJ_GCB` | 顶层 `unitConfig` 含 2 字段（无裸 save）| `form_api_save_upload` 剥前缀（r17 覆盖）；`form_api_delete` → `api_form_delete`（剥前缀）✓ |

**测试**：`npm run test:convert-config` → **20 通过**（含新增 `form-api-save-delete-rename`）
/ 2 失败（预存在的 default-nodes-and-xhcp / toolbar-ckts-sum，与本次无关）

**已知限制**（用户决策接受）：
- 不处理 `form_api_save_upload` 变体（**r17 已覆盖其前缀剥离**；key 保持不变 — 见 r17）
- 不处理 value 不是 `${API_URL_BASE}/X` 字面量前缀的情况（裸路径、函数调用、模板内嵌表达式等）—— 不匹配 → 保持原样
- 不重命名 `form_api_delete_upload`（即便存在）—— 词边界自动保护

### r17: form_api_save_upload 转换规则（仅剥 ${API_URL_BASE} 前缀）

**背景**：r16 实现时用户决策 `form_api_save_upload` 保持原样（key + value 都不动）。
但在端到端验证中发现 `form_api_save_upload` 值里的 `${API_URL_BASE}` 前缀必须剥离
（运行时 axios baseURL 已配 `${API_URL_BASE}`），而 key 需保持不变（与 form 组件字段名一致）。

- 源：`<configVar>.form_api_save_upload = \`${API_URL_BASE}/X\`;`
- 目标：`<configVar>.form_api_save_upload = \`/X\`;`

**关键设计点**：
- 与 r16 完全独立：r16 用 `\bform_api_save\b`（无 upload 词边界），r17 用
  `\bform_api_save_upload\b`，两者正则互不干扰
- 单一 transform 同时做 value 前缀剥离，key 保持不变
- 复用两次（SPECIAL_FIELD_RULES + `extractMyConfigAdjustments` 内调用）

**改动**：

1. **新增 `transformFormApiSaveUpload(content, configVar)`**：
   紧贴 `transformFormApiSaveDelete` 下方（[scripts/convert-ddbunit-config.js:1018-1046](scripts/convert-ddbunit-config.js#L1018-L1046)）。
   - 单次 `.replace`，匹配 `form_api_save_upload` + `${API_URL_BASE}` 前缀
   - regex 模板：
     ```
     (<configVar>\.)\bform_api_save_upload\b(\s*=\s*)`\${API_URL_BASE}(/[^`]*)`
     ```
   - 替换：保留 `<configVar>.form_api_save_upload` + 等号，值保留 `/...` 段

2. **注册为 SPECIAL_FIELD_RULE 第 6 条**（[scripts/convert-ddbunit-config.js:558-562](scripts/convert-ddbunit-config.js#L558-L562)）
   ```js
   {
     name: 'form_api_save_upload 剥 ${API_URL_BASE} 前缀 (r17)',
     apply: transformFormApiSaveUpload,
   }
   ```
   主流程 `applySpecialFieldRules` 循环自动调度

3. **在 `extractMyConfigAdjustments` 内调用**（[scripts/convert-ddbunit-config.js:1809-1815](scripts/convert-ddbunit-config.js#L1809-L1815)）：
   插入位置 = r16 之后、Change 1（`myUtil.menu` 重写）之前
   ```js
   {
     const r17 = transformFormApiSaveUpload(text, 'myConfig');
     if (r17.count > 0) {
       text = r17.content;
     }
   }
   ```
   `configVar` 硬编码 `'myConfig'`（与 r16 同约定）

4. **更新 fixture `form-api-save-delete-rename` 的期望输出**（2 个文件）：
   - `form-api-save-delete-rename.expected.tsx` line 10 + 头注释
   - `form-api-save-delete-rename.expected.index.tsx` line 10
   - 仅改 value：`` `${API_URL_BASE}/...` `` → `` `/...` ``
   - 头注释改为"r16 + r17 互不干扰"

**端到端验证**：

| 目录 | 场景 | 结果 |
|---|---|---|
| `MDT___ZXSB_SB_MDT_SYYK_GCB/auto_configIndex.tsx` | myConfig 调整块 line 10 | `form_api_save_upload` value 剥前缀 ✓ |
| `MDT_TSZL___ZXSB_SB_CKSH_GCB/auto_config.tsx` | 顶层 unitConfig line 21 | `form_api_save_upload` value 剥前缀 ✓ |
| `MDT___ZXSB_SB_MDT_YFSJ_GCB/auto_config.tsx` | 顶层 unitConfig line 19 | `form_api_save_upload` value 剥前缀 ✓ |

**测试**：`npm run test:convert-config` → **20 通过**（含 `form-api-save-delete-rename` 仍通过 —— fixture 已更新，r17 行为已被断言）
/ 2 失败（预存在的 `default-nodes-and-xhcp` / `toolbar-ckts-sum`，与本次改动无关）

**已知限制**（用户决策接受）：
- 不处理 `form_api_save_upload_x` / `xform_api_save_upload` 变体（\b 词边界已保护；实际数据无此场景）
- 不处理 value 不是 `${API_URL_BASE}/X` 字面量前缀的情况（裸路径、函数调用、模板内嵌表达式等）—— 不匹配 → 保持原样
- 不处理嵌套在 `// 注释` / `/* */` / `"字符串字面量"` 里的匹配（与 r16 行为一致；实际数据无此场景）

### r18: form_items readOnly → disabled 转换规则

**背景**：新协议下 [src/components/DDBunit/assemble_config_util.tsx:783-786](src/components/DDBunit/assemble_config_util.tsx#L783-L786) 的
`FORM_ITEM_READONLY` 分支已统一处理 `disabled: true` / `readOnly: true` 两种写法（运行时等价）。
为统一新协议风格（form 组件其它只读控件都用 `disabled`），旧写法 `readOnly: true` 应被规范化。

- 源：`<configVar>.form_items = [ { ..., readOnly: true, ... } ]`
- 目标：`<configVar>.form_items = [ { ..., disabled: true, ... } ]`

**关键设计点**：
- 仅作用于 `<configVar>.form_items = [ ... ]` 块（`readOnly` 实际数据中只在该块出现）
- 精确匹配 `readOnly: true`（`\b...\b` 保护 `readOnly: false` / `readOnly: <expr>` 不误改）
- 运行时等价（`assemble_config_util.tsx` 的 `FORM_ITEM_READONLY` 分支已兼容两者）
- 幂等：`disabled: true` 不再匹配原正则
- 与 r14（TextArea）/ r15（codeTable）作用域相同（form_items），操作字段互补不冲突
- 仅在 `SPECIAL_FIELD_RULES` 注册（不在 `extractMyConfigAdjustments` 内联 —— 实际数据未发现 myConfig 调整块修改 form_items 只读字段）

**改动**：

1. **新增 `transformReadOnlyToDisabled(content, configVar)`**：
   紧贴 `transformFormApiSaveUpload` 下方（[scripts/convert-ddbunit-config.js:1056-1108](scripts/convert-ddbunit-config.js#L1056-L1108)）。
   - 定位 `<configVar>.form_items = [` → bracket-depth 找匹配 `]`
   - 在块内 `.replace(/\breadOnly\s*:\s*true\b/g, 'disabled: true')`
   - 返回 `{ content, count }`

2. **注册为 SPECIAL_FIELD_RULE 第 7 条**（[scripts/convert-ddbunit-config.js:564-569](scripts/convert-ddbunit-config.js#L564-L569)）
   ```js
   {
     name: 'form_items readOnly → disabled (r18)',
     apply: transformReadOnlyToDisabled,
   }
   ```

3. **新增专用 fixture** `form-item-readonly.{input,expected}.tsx`（3 个 `readOnly: true` 测试用例：末尾 key / 中间 key / 含 rules）
   - 测试 runner 自动发现，无需改 test runner

**端到端验证**：

| 目录 | 场景 | 期望结果 |
|---|---|---|
| `MDT___ZXSB_SB_MDT_YFSJ_GCB/auto_config.tsx` | 顶层 unitConfig form_items（9 处）| 全部 `readOnly: true` → `disabled: true` ✓ |
| `MDT___ZXSB_SB_MDT_TSSB_GCB/auto_config.tsx` | 顶层 unitConfig form_items（10 处）| 全部改写 ✓ |
| `MDT_TSZL___ZXSB_SB_CKSH_GCB/auto_config.tsx` | 顶层 unitConfig form_items（3 处）| 全部改写 ✓ |

**测试**：`npm run test:convert-config` → 现有 20 通过 + `form-item-readonly` 新增通过
= **21 通过** / 2 失败（预存在的 `default-nodes-and-xhcp` / `toolbar-ckts-sum`，与本次改动无关）

**已知限制**（用户决策接受）：
- 不处理 `readOnly: false`（codebase 无此 case；精确 `\btrue\b` 匹配保护）
- 不处理 `readOnly: <expression>`（同上；保护）
- 不处理 `readonly` / `ReadOnly` 等大小写变体（JS 区分大小写，codebase 无此 case）
- 不处理嵌套在 `// 注释` / `/* */` / `"字符串字面量"` 里的匹配（与 r15/r16/r17 行为一致）
- 不在 `extractMyConfigAdjustments` 内联（实际数据未发现 myConfig 调整块修改 form_items 只读字段的场景）

### r19: form_items base_date 规则 format YYYY/YY → yyyy/yy 归一化

**背景**：运行时 [src/components/DDForm/formUtil.tsx:84-93](src/components/DDForm/formUtil.tsx#L84) 的 `base_date`
派发是 case-sensitive 严格匹配（`itemRule.format === 'yyyyMMdd'` 等），必须小写才能命中
`baseValidator.yyyyMMdd()` / `baseValidator.yyyyMM()` / `baseValidator.yyyy()`。源文件残留的
`format: 'YYYYMM'` / `'YYYY-MM-DD'` 等大写形式会让校验完全不生效。

r8 增强（`normalizeDateFormats`）会把所有 `format: 'yyyy...'` 转 `YYYY...`。r19 在 r8 之后跑，
**反向**作用于 `<configVar>.form_items` 块内 `type: 'base_date'` 规则的 `format` 字段，把
`YYYY/YY` 转回小写（仅 base_date 规则；grid_columns 的 `render.format` 仍保持 r8 的大写结果）。

**端到端验证**（`MDT___ZXSB_SB_MDT_SYYK_GCB`）：
- 输入 line 74/78 `format: 'YYYYMM' / 'YYYYMMdd'`（code_sample 大写）
- 输出（[auto_config.tsx:74,78](src/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_SYYK_GCB/auto_config.tsx#L74)）
  `format: 'yyyyMM' / 'yyyyMMdd'` ✓（小写，能命中 yyyyMMdd / yyyyMM 派发）
- 输出 line 25/47 `render.format: 'YYYY-MM-DD'` ✓（grid_columns 内不动，保持 r8 大写结果）

**关键设计点**：
- 与 r18（readOnly → disabled）同样模板：bracket-depth 定位 `<configVar>.form_items = [...]` 块边界
- 块内 regex `\{\s*type\s*:\s*['"]base_date['"][^{}]*?format\s*:\s*['"]([^'"]+)['"]` 单条规则单条 format
- 替换顺序 `YYYY → yyyy` 再 `YY → yy`（小写 yyyy 不含大写 YY，顺序无关 / 幂等）
- 仅作用于 `auto_config.tsx`（`auto_configFun.tsx` / `auto_configIndex.tsx` 不含 form_items，不受影响）

**改动**：
1. **新增 `transformBaseDateFormatNormalize(content, configVar)`**（[scripts/convert-ddbunit-config.js:1118-1190](scripts/convert-ddbunit-config.js#L1118-L1190)）
2. **注册为 SPECIAL_FIELD_RULE 第 8 条**（r19，[scripts/convert-ddbunit-config.js:571-579](scripts/convert-ddbunit-config.js#L571-L579)）
3. **新 fixture** [scripts/__fixtures__/base-date-format-normalize.{input,expected}.tsx](scripts/__fixtures__/)：7 个测试用例（YYYYMM / YYYYMMdd / YYYY / 已小写幂等 / 非 base_date 不动 / format='MM' 不动 / 双引号）

**测试**：`npm run test:convert-config` → 24 通过（22 + base-date-format-normalize + cktsUtil-rewrite
受特殊字段规则间接影响）/ 2 失败（预存在的 `default-nodes-and-xhcp` / `toolbar-ckts-sum`，与本次无关）

**已知限制**（用户决策接受）：
- **不处理 DD → dd**：因此 `'YYYY-MM-DD'` 只变 `'yyyy-MM-DD'`（DD 仍大写），运行时仍不匹配
  `=== 'yyyy-MM-dd'` 派发分支。若需完整兼容须另外处理或把 formUtil.tsx:86 派发改大小写不敏感
- 不处理嵌套在 `// 注释` / `/* */` / `"字符串字面量"` 里的匹配（与 r15/r16/r17/r18 行为一致）
- 不在 `extractMyConfigAdjustments` 内联（实际数据未发现 myConfig 调整块出现 base_date 规则的场景）
- 仅作用于 `<configVar>.form_items = [...]` 块（不动 grid_columns / filter_items 等其它块的 base_date）

### Part 1/2/3: f.tsx moment→dayjs 迁移 + `--fun` CLI 参数 + initAddForm 注入

**背景**：三部分组合任务。
- **Part 1**：[src/pages/hts/commonModule/f.tsx](src/pages/hts/commonModule/f.tsx) 已从 `code_sample` 移植但保留 4 处 moment 调用（全部在 `DditCktsFormCommonFunc.initAddForm` 内）。项目全局策略（CLAUDE.md 上文）已要求 dayjs 弃用 moment。
- **Part 2**：`auto_configIndex.tsx` 已有完整的「参照文件 + 抽取 + 注入」链路（`--index` + `extractIndexCustomizationsFromFile` + `generateIndexPage` Branch B），但 `auto_configFun.tsx` 仍是静态 stub 模板。需求：参照 `--index` 模式新增 `--fun <name>` 参数，默认查找 `f.tsx` → `fun.tsx` 兜底。
- **Part 3**：业务模块的 `f.tsx` 通常含 `Func.initAddForm = (param) => { DditCktsFormCommonFunc.initAddForm(param); }`。DDBunit2_CKTS 加载 `auto_configFun.tsx` 时若无 `initAddForm` 委托，运行时 `Func.initAddForm is not a function`。需求：从参照文件 fun 抽取 `initAddForm` 注入到生成文件。

**Part 1 - f.tsx 迁移**：

- 4 处 active 替换（line 44, 45, 67, 71）：`moment(...)` → `dayjs(...)`（全部在 `initAddForm` 内）
- 4 处已注释的 `moment(...)` 同步替换（line 656, 663, 858, 1442）
- Import 段无改动（line 6 dayjs 已导入，line 9 moment 已注释）
- API 兼容：4 处 active 全部为 `moment(new Date(x))` → `dayjs(new Date(x))`，antd 5+ Form 接受两者
- 零回归：现有 7 个 `DditCktsFormCommonFunc.initAddForm` 消费方调用行为不变

**Part 2 - `--fun` CLI 参数**（[scripts/convert-ddbunit-config.js](scripts/convert-ddbunit-config.js)）：

1. `main()` 新增 `--fun` 处理块（`--index` 块之后，fun page 生成之前）：
   - 默认 basename = `'f'`
   - 查找顺序：`<srcDir>/f.tsx` → `<srcDir>/fun.tsx`（用户决策：f 优先）
   - 显式传 `--fun <name>` 时仅查 `<name>.tsx`
   - 找到即停，找不到 / 无 initAddForm → silent fallback 到 static stub
2. `parseArgs()` 无需改动（已支持任意 `--key value` 对）
3. `--no-fun` 已存在，无需改
4. `generateFunPage()` 签名从 `generateFunPage()` 扩展为 `generateFunPage({ initAddForm } = {})`
5. 与 `--index` 互不干扰（独立查找路径）

**Part 3 - `initAddForm` 抽取/注入**：

1. **新增 `extractInitAddFormFromFile(content)`**（[scripts/convert-ddbunit-config.js:1486-1526](scripts/convert-ddbunit-config.js#L1486-L1526)）
   - regex 找 `Func.initAddForm\s*=\s*` 起点
   - 跳过等号后的箭头函数签名，定位到第一个 `{`
   - bracket-depth 扫描 `{}` 配对
   - 返回整段文本（含尾随 `;`），或 `null`
   - 与 `extractInitSearchModalBlock` 同款手法

2. **`generateFunPage({ initAddForm })` 模板扩展**：
   ```tsx
   import { message, Tooltip, Badge, Space, Segmented } from 'antd';
   import React from 'react';
   import DditCktsFormCommonFunc from '@/pages/hts/commonModule/f';  // 仅当 initAddForm 含 DditCktsFormCommonFunc 时添加
   
   const Func: any = {
     refUnit: React.createRef(),
   };
   
   <extracted initAddForm text from ref>  // 原样保留
   
   export default Func;
   ```
   - `initAddForm` 为 `null`/`undefined` → 保持现有 static stub
   - `DditCktsFormCommonFunc` import 仅在抽取文本含该字符串时添加（避免无谓 import）

3. **测试基础设施**（[scripts/test-convert-ddbunit-config.js](scripts/test-convert-ddbunit-config.js)）：
   - `getFixtures()` 新增 `.funRef.tsx` kind → `fx.funRef`
   - CLI args 构造新增：`if (fx.funRef) args.push('--fun', \`${fx.name}.funRef\`);`
   - 测试断言已自动支持 `.expected.fun.tsx`（现有逻辑无需改）

4. **新增 fixture** `fun-injection.{input,expected,funRef,expected.fun}.tsx`（4 个文件）

**端到端验证**：

| 目录 | 场景 | 结果 |
|---|---|---|
| `MDT___ZXSB_SB_MDT_SYYK_GCB/auto_configFun.tsx` | fun 参照文件 f.tsx 含 initAddForm 委托 | 生成文件含 `DditCktsFormCommonFunc` import + `Func.initAddForm` 委托 ✓ |
| `MDT___ZXSB_SB_MDT_TSSB_GCB/auto_configFun.tsx` | 同上 | ✓ |
| `MDT___ZXSB_SB_MDT_TSJH_GCB/auto_configFun.tsx` | 同上 | ✓ |
| `MDT___ZXSB_SB_MDT_YFSJ_GCB/auto_configFun.tsx` | 同上 | ✓ |
| `MDT_TSZL___ZXSB_SB_CKSH_GCB/auto_configFun.tsx` | 同上 | ✓ |
| `MDT_TSZL___ZXSB_SB_HGSPTZ_GCB/auto_configFun.tsx` | 同上 | ✓ |

**测试**：`npm run test:convert-config` → 现有 21 通过 + `fun-injection` 新增通过 = **22 通过** / 2 失败（预存在，与本次无关）

**已知限制**（用户决策接受）：
- **不抽取 `initAddForm` 之外的其它 `Func.*` 方法**（initEditForm / validator / eventOnBlur 等）—— 与用户原话「将 initAddForm 移入」严格一致
- **`f.tsx` 优先级 `fun.tsx`**：code_sample 60+ 文件全部用 `f.tsx`，优先命中
- **bracket-depth 跳过字符串字面量内的 `{}`**：与 r15 等同款手法
- **不在 `--index` 和 `--fun` 之间强制校验**：允许独立查找
- **不重写 `initAddForm` 函数体**：原样保留（仅**搬运**而非**改写**）
- **`DditCktsFormCommonFunc` import 路径硬编码为 `@/pages/hts/commonModule/f`**：与 code_sample 一致

### 新规则：fun 生成时 htsApi import 路径重写

**背景**：上一轮实现的 fun 生成链路（`--fun` + `extractInitAddFormFromFile` + `generateFunPage`）未处理业务侧最常用的 `import ... from '@/services/hts/api'` —— 而该路径在 `src/` 树中实际不存在（参照文件用的是 `code_sample/src/services/hts/api` 的老路径）。[src/pages/hts/services/htsApi.ts](src/pages/hts/services/htsApi.ts) 已存在并 re-export 全部同名服务（`apiFpzs` / `apiBadz` / `apiJljg` / `apiSjbb` / `apiTb` / `apiShgl`），是 drop-in 替代。

**目标**：当 fun 参照文件（`f.tsx` / `fun.tsx`）含 `import ... from '@/services/hts/api'` 时，将路径改写为 `@/pages/hts/services/htsApi` 并置于生成 fun 文件**顶部**（在 antd / react 之前）。

**关键设计点**：
- `[\s\S]*?` 非贪婪匹配 `{ ... }` 块 —— 多行形式下不越界
- `g` 标志 —— ref 中 N 个 import → 输出 N 个 htsApi import（用户决策：**多行拆成多个**，不合并名字）
- 单/双引号 + 尾随分号容错
- 名字列表归一化（split + trim + filter）—— 容错 `import {a, b,}` 尾随逗号
- **输出单行**：即使 ref 是多行 import 块，输出也折叠成单行（TypeScript 允许；输出文件更整洁）
- silent fallback：ref 无 htsApi 导入 → `funHtsApiImports = []` → 模板不变，零回归
- htsApi 位置：项目内 service 在 antd / react 之前；与 `DditCktsFormCommonFunc` 同属项目内 import，逻辑顺序为 service → common → 第三方

**改动**：

1. **新增 `rewriteHtsApiImports(content)` 辅助函数**（[scripts/convert-ddbunit-config.js:1531-1559](scripts/convert-ddbunit-config.js#L1531-L1559)）
   - 多行正则 `import\s*\{([\s\S]*?)\}\s*from\s*['"]@\/services\/hts\/api['"]\s*;?` 匹配每个 import 块
   - 对每个匹配：split + trim + filter 名字列表，输出单行 `import { a, b, c } from '@/pages/hts/services/htsApi';`
   - 返回 `string[]`（每个 ref import 一行）

2. **`generateFunPage` 签名扩展**（[scripts/convert-ddbunit-config.js:2118-2155](scripts/convert-ddbunit-config.js#L2118-L2155)）
   - 接受新参数 `htsApiImports`（默认 `[]`）
   - htsApi 注入位置：`${htsApiLines}` 置于 antd / react 之前（即绝对顶部）
   - 空数组时不插入空行

3. **`main()` --fun 块**（[scripts/convert-ddbunit-config.js:2378-2410](scripts/convert-ddbunit-config.js#L2378-L2410)）
   - 在 `funContent` 已读后立即调用 `rewriteHtsApiImports(funContent)`
   - 抽取成功 log：`[convert] 参照文件已抽取 htsApi 导入: N 处 (<refPath>)`
   - 改写 `generateFunPage` 调用，传入 `htsApiImports: funHtsApiImports`

4. **fixture 更新**：
   - [scripts/__fixtures__/fun-injection.funRef.tsx](scripts/__fixtures__/fun-injection.funRef.tsx) 加 1 行 `import { querySjByHth, queryHlxx } from '@/services/hts/api';`
   - [scripts/__fixtures__/fun-injection.expected.fun.tsx](scripts/__fixtures__/fun-injection.expected.fun.tsx) 顶部（line 1）加 1 行重写后的 htsApi import（antd / react / Ddit 在其后）
   - 用户决策：**更新现有 fixture**（与 initAddForm 决策一致）

**端到端验证**：

| 目录 | ref htsApi 导入数 | 生成 fun 文件 line 1 |
|---|---|---|
| [MDT___ZXSB_SB_MDT_SYYK_GCB](src/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_SYYK_GCB/auto_configFun.tsx) | 1（单行）| `import { querySjByHth, queryHlxx } from '@/pages/hts/services/htsApi';` ✓ |
| [MDT___ZXSB_SB_MDT_TSSB_GCB](src/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TSSB_GCB/auto_configFun.tsx) | 1（多行 → 单行）| 9 个名字合并为单行 ✓ |
| [MDT___ZXSB_SB_MDT_TSJH_GCB](src/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TSJH_GCB/auto_configFun.tsx) | 1（单行）| 单行 htsApi import ✓ |
| [MDT___ZXSB_SB_MDT_YFSJ_GCB](src/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_YFSJ_GCB/auto_configFun.tsx) | 2（多导入）| 2 个 htsApi import 各占一行 ✓ |
| [MDT_TSZL___ZXSB_SB_CKSH_GCB](src/pages/hts/dditax.ckts.from/MDT_TSZL___ZXSB_SB_CKSH_GCB/auto_configFun.tsx) | 1 | ✓ |
| [MDT_TSZL___ZXSB_SB_HGSPTZ_GCB](src/pages/hts/dditax.ckts.from/MDT_TSZL___ZXSB_SB_HGSPTZ_GCB/auto_configFun.tsx) | 1 | ✓ |
| [MDT___ZXSB_SB_MDT_STZC_GCB](src/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_STZC_GCB/auto_configFun.tsx)（regression：ref 无 htsApi）| 0 | 无 htsApi import（silent fallback）✓ |

**测试**：`npm run test:convert-config` → **22 通过**（含 `fun-injection` 仍通过 —— fixture 已更新）/ 2 失败（预存在，与本次无关）

**已知限制**（用户决策接受）：
- **多行 import 折叠为单行**：ref 中 9-10 行的 import 块，输出折叠为单行（TypeScript 允许；输出文件更整洁）
- **多导入不合并**：ref 中 N 个独立 import → 输出 N 个 htsApi import（严格保留 ref 结构）
- **ref 无 htsApi 时 silent fallback**：零回归
- **不处理 `@/services/hts/api` 以外的旧路径**（如 `@/pages/common/myUtil`）—— 本规则仅针对 htsApi 路径
- **不处理 `import type { ... }`**（d.ts 类型导入）—— 当前 codebase 无此场景
- **不处理 `import * as xxx`**（namespace 导入）—— 当前 codebase 无此场景

### 新规则：fun 生成时 top imports 完全镜像 ref（6 路径重写规则）

**背景**：上一轮（htsApi 单规则重写）只处理了 `@/services/hts/api` → `@/pages/hts/services/htsApi` 一条规则；本轮将 fun 生成时**顶部 imports 完全镜像 ref 文件**（参照 code_sample 的 `f.tsx`），并应用 6 条规则。

**6 条规则**：

| # | 规则 | 实现 |
|---|---|---|
| 1 | `import DditCktsFormCommonFunc from '@/pages/hts/commonModule/f';` | **不变**（已是新路径）|
| 2 | `import { ... } from '@/services/hts/api';` | 重写路径为 `@/pages/hts/services/htsApi`（多行折叠为单行）|
| 3 | `import moment from 'moment';` | 重写为 `import dayjs from 'dayjs';` |
| 4 | `import myUtil from '@/pages/common/myUtil';` | 重写路径为 `@/components/DDAssist/util'` |
| 5 | `import DDAlert from '@/components/DDAlert';` | 重写路径为 `@/pages/hts/commonModule/DDAlert'`（10 个 ref 文件命中）|
| 6 | 其它 imports | 原样保留 |

**关键设计点**：
- **删硬编码**：`generateFunPage` 模板内不再含 `antd` / `React` / `DditCktsFormCommonFunc` imports（ref 提供）
- **删条件注入**：基于 `initAddForm` 内容检测的 DditCktsFormCommonFunc 条件注入逻辑（被规则 1 取代）
- **`extractRefImports` 多行处理**：检测首行末尾是否有 `;` / `'` / `"`；若没有则继续吞入后续行直到遇到分号。TSSB 等多行 import 正确捕获
- **顺序与 ref 一致**：ref 文件 imports 段顺序即输出顺序
- **silent fallback**：ref 无 imports → `refImports = []` → 无 importsBlock（实际 ref 都有 imports）

**改动**：

1. **新增 `extractRefImports(content)`**（[scripts/convert-ddbunit-config.js:1561-1610](scripts/convert-ddbunit-config.js#L1561-L1610)）
   - 逐行扫描 + 累积；首个非 import 行终止
   - 跳过空行 / `//` / `/* */` 注释；跳过 `import type`
   - **多行 import 吞入**：首行无 `;`/`'`/`"` 则继续吞入后续行直到遇分号

2. **新增 `applyImportRewrites(importLines)`**（[scripts/convert-ddbunit-config.js:1612-1667](scripts/convert-ddbunit-config.js#L1612-L1667)）
   - 规则 3: moment → dayjs（精确匹配）
   - 规则 4: myUtil 路径（保留 default 名字）
   - 规则 5: DDAlert 路径（保留 default 名字）
   - 规则 2: htsApi 路径（多行折叠为单行）
   - 规则 1/6: DditCktsFormCommonFunc（已是新路径）/ 其它 —— 原样保留

3. **重写 `generateFunPage`**（[scripts/convert-ddbunit-config.js:2128-2151](scripts/convert-ddbunit-config.js#L2128-L2151)）
   - 签名 `generateFunPage({ initAddForm, refImports = [] } = {})`
   - 删硬编码 `antd` / `React` / `DditCktsFormCommonFunc` 注入
   - 删 `hasDditImport` 条件检测

4. **main() --fun 块**（[scripts/convert-ddbunit-config.js:2411-2453](scripts/convert-ddbunit-config.js#L2411-L2453)）
   - 新增 `funRefImports = applyImportRewrites(extractRefImports(funContent))`
   - 改写 `generateFunPage` 调用，传入 `refImports: funRefImports`
   - 保留 `funHtsApiImports` 变量用于 log 输出

5. **fixture 更新**（综合测试 6 规则）：
   - [scripts/__fixtures__/fun-injection.funRef.tsx](scripts/__fixtures__/fun-injection.funRef.tsx) 加 `myUtil` + `moment` + `DDAlert` 3 行
   - [scripts/__fixtures__/fun-injection.expected.fun.tsx](scripts/__fixtures__/fun-injection.expected.fun.tsx) 完全镜像 ref（6 规则重写后）
   - 删原硬编码 `antd` 注入
   - 用户决策：复用现有 fixture（不新增专用 fixture）

**端到端验证**：

| 目录 | ref imports 数 | 关键变化 |
|---|---|---|
| [MDT___ZXSB_SB_MDT_SYYK_GCB](src/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_SYYK_GCB/auto_configFun.tsx) | 6 | myUtil 路径重写 + moment→dayjs + htsApi 路径重写 |
| [MDT___ZXSB_SB_MDT_TSSB_GCB](src/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TSSB_GCB/auto_configFun.tsx) | 11 | 多行 antd + 多行 htsApi 折叠为单行 + DDAlert 路径重写 + myUtil + moment |
| [MDT___ZXSB_SB_MDT_TSJH_GCB](src/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TSJH_GCB/auto_configFun.tsx) | 7 | myUtil + moment + htsApi |
| [MDT___ZXSB_SB_MDT_YFSJ_GCB](src/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_YFSJ_GCB/auto_configFun.tsx) | 9 | 2 个 htsApi import + myUtil + moment + DDAlert + getStaticTableCode（未重写）|
| [MDT_TSZL___ZXSB_SB_CKSH_GCB](src/pages/hts/dditax.ckts.from/MDT_TSZL___ZXSB_SB_CKSH_GCB/auto_configFun.tsx) | 6 | myUtil（无 moment / DDAlert / htsApi 多导入）|
| [MDT_TSZL___ZXSB_SB_HGSPTZ_GCB](src/pages/hts/dditax.ckts.from/MDT_TSZL___ZXSB_SB_HGSPTZ_GCB/auto_configFun.tsx) | 6 | myUtil + moment + htsApi（无 DDAlert）|
| [MDT___ZXSB_SB_MDT_STZC_GCB](src/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_STZC_GCB/auto_configFun.tsx)（regression）| 3 | 无 htsApi / moment / DDAlert；仅 React + myUtil + DditCktsFormCommonFunc |

**测试**：`npm run test:convert-config` → **22 通过**（含 `fun-injection` 仍通过 —— fixture 已更新）/ 2 失败（预存在，与本次无关）

**已知限制**（用户决策接受）：
- **多行 htsApi import 折叠为单行**；其它多行 imports（如 antd）保留多行结构
- **`import moment from 'moment';` 严格匹配**：`import {moment} from 'moment';` 等变体不改写
- **`myUtil` 保留原 default 名字**：仅改路径
- **`DDAlert` 保留原 default 名字**：仅改路径
- **ref 无 imports 时无 fallback**：极端 case；实际 ref 都有 imports
- **ref 缺 React 时 body 编译失败**：body 用 `React.createRef()`，依赖 ref 提供；实际所有 ref 都有
- **DditCktsFormCommonFunc 不再条件注入**：若 ref 缺该 import 而 initAddForm 引用，body 编译失败；实际 ref 都有
- **注释 imports 不抽**：`// import xxx` 不算 imports 段
- **不重写其它旧路径**（`@/pages/common/staticTableCode` / `@/pages/common/cjpzUtil` 等）—— 本规则仅针对 4 路径

### 补充规则：fun 生成 4 条新规则（.less 排除 + 3 路径重写）

**背景**：上一轮（6 规则）已实现 fun 顶部 imports 完全镜像 ref。本轮按用户最新指示，新增 4 条规则：

| # | 规则 | 实现 |
|---|---|---|
| **排除** | `import X from 'X.less';` | **不引入**（`extractRefImports` 过滤）|
| **7** | `import <name> from '@/pages/common/staticTableCode';` | 重写路径为 `@/components/DDAssist/staticTableCode` |
| **8** | `import { intl as intl2 } from '@/pages/common/myUtil';` | 重写路径为 `@/components/DDAssist/util`（命名导入，保留别名）|
| **9** | `import <name> from '@/pages/common/field/baseValidator';` | 重写路径为 `@/components/DDAssist/field/baseValidator` |

**目标文件存在性**（全部已确认）：
- [src/components/DDAssist/staticTableCode.tsx](src/components/DDAssist/staticTableCode.tsx) ✓
- [src/components/DDAssist/util/index.tsx:4594](src/components/DDAssist/util/index.tsx#L4594) 导出 `intl` ✓
- [src/components/DDAssist/field/baseValidator.tsx](src/components/DDAssist/field/baseValidator.tsx) ✓

**关键设计点**：
- **.less 排除**：`extractRefImports` 在多行 import 吞入**前**加 `\.less['"]\s*;?$` 检查，跳过 .less 行
- **规则 4 / 8 互斥**：规则 4 匹配 `import <name> from '@/pages/common/myUtil';`（默认导入），规则 8 匹配 `import { ... } from '@/pages/common/myUtil';`（命名导入）—— 正则互不重叠
- **`intl as intl2` 别名保留**：规则 8 输出 `import { intl as intl2 } from '@/components/DDAssist/util';`（`{ }` 内完整保留）
- **`getStaticTableCode` / `baseValidator` 默认名字保留**：仅改路径

**改动**：

1. **`extractRefImports` 加 .less 排除**（[scripts/convert-ddbunit-config.js:1607](scripts/convert-ddbunit-config.js#L1607)）：1 行 `\.less['"]\s*;?$` 正则
2. **`applyImportRewrites` 加规则 7/8/9**（[scripts/convert-ddbunit-config.js:1683-1708](scripts/convert-ddbunit-config.js#L1683-L1708)）：约 25 行
3. **docstring 更新**：6 → 9 规则计数
4. **fixture 更新**（综合测试 9 + 1 排除规则）：
   - [scripts/__fixtures__/fun-injection.funRef.tsx](scripts/__fixtures__/fun-injection.funRef.tsx) 加 5 行新 imports（2 .less + intl + getStaticTableCode + baseValidator）
   - [scripts/__fixtures__/fun-injection.expected.fun.tsx](scripts/__fixtures__/fun-injection.expected.fun.tsx) 完全镜像 ref（10 - 2 .less = 9 imports）

**端到端验证**：

| 目录 | 之前 imports 数 | 变化 |
|---|---|---|
| SYYK | 6 | 无相关新增 → 无变化 |
| **TSSB** | 11 | **-2 .less 排除**（importStyle + tableStyle）✓ |
| TSJH | 7 | 无相关新增 → 无变化 |
| **YFSJ** | 9 | +规则 7（getStaticTableCode 路径重写）✓ |
| CKSH | 6 | 无相关新增 → 无变化 |
| HGSPTZ | 6 | 无相关新增 → 无变化 |
| STZC（regression）| 3 | 无相关新增 → 无变化 |

**测试**：`npm run test:convert-config` → **22 通过**（fun-injection 仍通过）/ 2 失败（预存在，与本次无关）

**已知限制**（用户决策接受）：
- **不处理复合形式** `import myUtil, { intl as intl2 } from ...` —— codebase 无此场景
- **不处理 `.css` / `.scss` 等其它样式文件**（用户仅要求 `.less`）—— 若未来需要可扩展
- **规则 7/8/9 路径仅匹配指定老路径** —— 其它老路径不被改写
- **.less 排除仅过滤顶级 .less import**（`import X from 'X.less';`）—— 嵌套在其它 import 内的 .less 不影响
- **保持前 9 规则行为不变**：本轮只新增 4 规则（DditCktsFormCommonFunc / htsApi / moment / myUtil / DDAlert / 其它 / staticTableCode / intl / baseValidator）保留

### 补充规则：fun 生成 — `useRouteMatch` → `useRouteData`（umi 4.x 弃用适配）

**背景**：上一轮（9 + 1 排除规则）已实现 fun 顶部 imports 完全镜像 ref。本轮按用户最新指示，新增规则 10：

| # | 规则 | 实现 |
|---|---|---|
| **10** | `import { ..., useRouteMatch, ... } from 'umi';` | 重命名 `useRouteMatch` → `useRouteData`（保留其它命名导入、保留引号、保留多行结构）|

**目标确认**（由 Plan agent 验证）：
- **`useRouteData` 是 umi 4.x 的正确导出**：`node_modules\@umijs\renderer-react\dist\index.d.ts` 仅导出 `useRouteData()`（`(): IRouteContextType`），**不再导出 `useRouteMatch`**
- 当前 codebase 5 处 `useRouteMatch` from `'umi'`：
  - 3 个已生成 fun 文件：[src/pages/hts/saasMdt/tuiShuiJiHua/{month,season,year}DataFun.tsx:10](src/pages/hts/saasMdt/tuiShuiJiHua/monthDataFun.tsx#L10) 等
  - 2 个 ref index.tsx：[code_sample/.../ZMKJ_SC___ZXSB_ZM_TYYBSWTS_GCB/index.tsx:10](code_sample/src/pages/hts/dditax.ckts.from/ZMKJ_SC___ZXSB_ZM_TYYBSWTS_GCB/index.tsx#L10) 和 [code_sample/.../ZMKJ_WM___ZXSB_ZM_TYYBSWTS_GCB/index.tsx:10](code_sample/src/pages/hts/dditax.ckts.from/ZMKJ_WM___ZXSB_ZM_TYYBSWTS_GCB/index.tsx#L10)
  - 1 个 ref func.tsx：[code_sample/.../saasMdt/tuiShuiJiHua/func.tsx:10](code_sample/src/pages/hts/saasMdt/tuiShuiJiHua/func.tsx#L10)

**6 个目标 dditax.ckts.from f.tsx 全部不含 `useRouteMatch`**（无新增应用；规则作为未来场景兜底）

**关键设计点**：
- **`line`（非 trimmed）作为工作串**：多行 import 完整 round-trip
- **`[\s\S]*?` 非贪婪**：最短匹配 `{...}` 块（多行 OK）
- **`(['"])umi\2` 回溯引用**：保证单/双引号配对 + 路径精确为 `'umi'` / `"umi"`
- **`\buseRouteMatch\b` 词边界**：避免误改变体名（如 `useRouteMatchFoo`）
- **正则不冲突**：规则 10 key 在 `'umi'`，与前 9 规则（`'@/pages/common/...'` / `'@/services/hts/api'` / `'@/components/DDAlert'` / `'moment'`）无重叠
- **幂等性**：已用 `useRouteData` 的 import 不匹配 `\buseRouteMatch\b`，输出不变

**改动**：

1. **规则 10 实现**（[scripts/convert-ddbunit-config.js:1720-1735](scripts/convert-ddbunit-config.js#L1720-L1735)）：`applyImportRewrites` fall-through 前插入（约 15 行）
2. **docstring 更新**（[scripts/convert-ddbunit-config.js:1629-1653](scripts/convert-ddbunit-config.js#L1629-L1653)）：规则计数 9 → 10
3. **fixture 更新**：
   - [scripts/__fixtures__/fun-injection.funRef.tsx](scripts/__fixtures__/fun-injection.funRef.tsx) 加 1 行 `import { history, useRouteMatch } from 'umi';`
   - [scripts/__fixtures__/fun-injection.expected.fun.tsx](scripts/__fixtures__/fun-injection.expected.fun.tsx) 加 1 行 `import { history, useRouteData } from 'umi';`

**端到端验证**：

| 目录 | 之前 imports 数 | 变化 |
|---|---|---|
| 6 个 dditax.ckts.from f.tsx | （与上一轮一致）| 0（ref 无 useRouteMatch → 无新增应用）|
| STZC（regression）| 3 | 0 |

**测试**：`npm run test:convert-config` → **22 通过**（fun-injection 仍通过 —— fixture 已更新）/ 2 失败（预存在）

**已知限制**（用户决策接受）：
- **规则 10 仅重命名 import 标识符**，不动调用点（`routeMatch.params` 等）—— 语义差异（umi 4.x `useRouteData()` 返回 `{ route: IRoute }` 而非 RR v5 `{ params, isExact, path, url }`）由后续手动 / 单独工具修复
- **`saasMdt/tuiShuiJiHua/{month,season,year}DataFun.tsx` 3 个已生成的 fun 文件**未在本次重生成范围 —— 用户聚焦 dditax.ckts.from；如需端到端重生成可后续追加
- **多行 import 内嵌的 `useRouteMatch`**：`extractRefImports` 已将多行 import 缓冲为单字符串传入 `applyImportRewrites`；规则 10 用 `line`（非 `trimmed`）作为工作串以保留 newline 字符
- **不重写 `useRouteMatch` 的其它变体**（如 `useRouteMatchWithParams`）—— 严格 `\buseRouteMatch\b` 词边界
- **保持前 9 规则 + 1 排除行为不变**

### 修复：ref `config.X` → 生成 `myConfig.X`（index.tsx 调整块导入别名改写）

**背景**：[src\pages\hts\dditax.ckts.from\MDT___ZXSB_SB_MDT_STZC_GCB\auto_configIndex.tsx:11-12](src/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_STZC_GCB/auto_configIndex.tsx#L11) 当前为：
```tsx
config.toolbar_default.tssb_download = true;
config.toolbar_default.ckts_download = false;
```
应为：
```tsx
myConfig.toolbar_default.tssb_download = true;
myConfig.toolbar_default.ckts_download = false;
```

**根因**：[code_sample\src\pages\hts\dditax.ckts.from\MDT___ZXSB_SB_MDT_STZC_GCB\index.tsx:14-15](code_sample/src/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_STZC_GCB/index.tsx#L14) 的 ref 源文件用了 `config.X`（与 ref 内的 `import config from './auto_config'` 同名），但函数体的调整块本应使用局部 `const myConfig = { ...config }` 克隆。`scripts/convert-ddbunit-config.js` 的 `extractMyConfigAdjustments`（行 1985+）**逐字拷贝** ref 调整块到生成文件，**无任何 `config.` → `myConfig.` 改写**。

**数据扫描**（[code_sample\src\pages\hts\dditax.ckts.from\](code_sample/src/pages/hts/dditax.ckts.from/)）：
- 1 个 ref index.tsx 含错误 `config.`（仅 STZC_GCB）
- 47 个 ref index.tsx 正确使用 `myConfig.`
- 0 个含 `cfg.` / `conf.` 等其它错误别名
- 仅 1 个生成文件 [src\pages\hts\dditax.ckts.from\MDT___ZXSB_SB_MDT_STZC_GCB\auto_configIndex.tsx](src/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_STZC_GCB/auto_configIndex.tsx) 受影响（line 11-12）

**用户决策**：
- **不修改示例文件**（保持 ref 原状）—— 仅在 convert 工具生成时改写
- **动态检测导入别名**（从 ref 的 `import X from './auto_config';` 自动读出 X）—— 适配未来其它别名场景
- **新增专用 fixture** `ref-uses-config-not-myconfig.{input,ref,expected,expected.index}.tsx` 锁定本场景

**关键设计点**：
- **动态检测**：扫描 ref 全文首个 `import X from './auto_config';`（`m` 标志匹配任意行）→ 提取 `X`
- **跳过 `myConfig`**：若 ref 已经用 `myConfig` 作别名，silent return（其它 ref 的 no-op）
- **line-leading anchor** `^(\s+)\b<alias>\b\.`：保证只匹配函数体内的属性访问（`  config.X`）；不命中 `config={...}` JSX prop（已被切片丢弃）；不命中 `import config from '...'` 顶层声明
- **正向词边界 `\b<alias>\b`**：避免误改 `configX` / `myConfig` 之类的部分匹配
- **全局 / 多行标志 `gm`**：调整块内所有匹配行均改写
- **位置选择**：在切片 + trim 之后、stripGridParamsBlock 之前；保证 r16/r17 regex 看到的 `myConfig.X` 已是正确形式

**改动**：

1. **新增 `rewriteImportAliasToMyConfig(text, content)` 辅助函数**（[scripts/convert-ddbunit-config.js:1949-1986](scripts/convert-ddbunit-config.js#L1949-L1986)）：约 30 行
2. **集成调用**（[scripts/convert-ddbunit-config.js:2188-2189](scripts/convert-ddbunit-config.js#L2188-L2189)）：`extractMyConfigAdjustments` 内插入 1 行调用
3. **docstring 更新**（[scripts/convert-ddbunit-config.js:2003-2005](scripts/convert-ddbunit-config.js#L2003-L2005)）："已知限制" → "已知行为"
4. **新 fixture**（[scripts\__fixtures__\ref-uses-config-not-myconfig.*](scripts/__fixtures__/)）：4 个新文件

**端到端验证**：

| 目录 | 变化 |
|---|---|
| [MDT___ZXSB_SB_MDT_STZC_GCB/auto_configIndex.tsx:11-12](src/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_STZC_GCB/auto_configIndex.tsx#L11) | `config.toolbar_default.*` → `myConfig.toolbar_default.*` ✓ |
| 其它 47 个 dditax.ckts.from ref index.tsx | 0 变化（ref 已正确使用 `myConfig`，规则 silent no-op）✓ |

**测试**：`npm run test:convert-config` → **23 通过**（22 + ref-uses-config-not-myconfig）/ 2 失败（预存在）

**已知限制**（用户决策接受）：
- **不动 ref 源文件**（用户决策）—— 仅在 convert 工具生成时改写
- **不动 JSX prop**（如 `config={myConfig}`）—— line-leading anchor 保证不命中；且 JSX prop 在 return 语句后**已不被切片**
- **不动 `import config from '...'`** —— 行首 `import` 不匹配 `^(\s+)\b<alias>\b\.` 模式
- **不动顶层 `const config = ...`** —— `^(\s+)` 要求至少 1 个前导空白
- **不处理函数参数 `config`**（如 `function foo(config: any) { config.X = ... }`）—— DDBunit2/CKTS 上下文无此模式
- **不处理函数体内局部 `const config = ...` shadow** —— codebase 无此模式
- **依赖 `^(\s+)` 缩进匹配** —— 实际 ref 缩进均为 2 空格

### 补充规则：fun 生成 — `cjpzUtil` → `cktsUtil`（带去重）

**背景**：用户最新指示新增 1 条规则 —— 若 ref 含 `import cjpzUtil from '@/pages/common/cjpzUtil';`，改写为 `import cktsUtil from '@/pages/hts/cktsUtil';`，但**若 `cktsUtil` 已存在则不重复引入**（删除 cjpzUtil 那一行）。

| # | 规则 | 实现 |
|---|---|---|
| **11** | `import <name> from '@/pages/common/cjpzUtil';` | 改写为 `import cktsUtil from '@/pages/hts/cktsUtil';`（带去重）|

**目标确认**（由 Plan agent 验证）：
- **`@/pages/hts/cktsUtil` 是新路径的 default export**：[src/pages/hts/cktsUtil.tsx:499](src/pages/hts/cktsUtil.tsx#L499) `export default cktsUtil;`
- **`cjpzUtil` 老文件**仅存在于 `code_sample/src/pages/common/cjpzUtil.tsx`（`src/` 树无此文件 → 不重写则运行时 unresolvable）

**数据扫描**（[code_sample\src\pages\hts\dditax.ckts.from\](code_sample/src/pages/hts/dditax.ckts.from/)）：
- **3 个 ref f.tsx** 含 `import cjpzUtil from '@/pages/common/cjpzUtil';`：
  - [code_sample/.../DBTS_TSZL___ZXSB_SB_CKSH_GCB/f.tsx:8](code_sample/src/pages/hts/dditax.ckts.from/DBTS_TSZL___ZXSB_SB_CKSH_GCB/f.tsx#L8)
  - [code_sample/.../MTS_TSZL___ZXSB_SB_CKSH_GCB/f.tsx:8](code_sample/src/pages/hts/dditax.ckts.from/MTS_TSZL___ZXSB_SB_CKSH_GCB/f.tsx#L8)
  - [code_sample/.../MDT_TSZL___ZXSB_SB_CKSH_GCB/f.tsx:10](code_sample/src/pages/hts/dditax.ckts.from/MDT_TSZL___ZXSB_SB_CKSH_GCB/f.tsx#L10)
- **0 个 ref f.tsx** 同时含 `cjpzUtil` + `cktsUtil`（去重分支防御性即可，实际场景不触发）

**关键设计点**：
- **预扫描 + 闭包变量**：`hasCktsUtilImport` 在 `.map` 之前确定；`return null` 信号删除本行；`.filter(null)` 在外层过滤
- **去重判断覆盖三种形式**：
  - `import cktsUtil from '...';`（默认导入）
  - `import { cktsUtil } from '...';`（命名导入）
  - `import { cktsUtil as xxx } from '...';`（带 as 别名）
- **`\bcktsUtil\b` 词边界**：避免误改 `cktsUtilFoo` / `myCktsUtil` 之类部分匹配
- **default 名字硬编码为 `cktsUtil`**（与规则 4/5/7/9 保留原 default 名字的策略不同 —— 用户原话"cjpzUtil 变为 cktsUtil"要求 default 名字也改为 cktsUtil）
- **仅处理默认导入形式**（与用户示例严格一致）；命名导入 `import { cjpzUtil } from ...` 不被改写（codebase 0 个 ref 用此形式）
- **正则不冲突**：规则 11 key 在 `@/pages/common/cjpzUtil`，与前 10 规则无重叠

**改动**：

1. **规则 11 实现**（[scripts/convert-ddbunit-config.js:1655-1756](scripts/convert-ddbunit-config.js#L1655-L1756)）：`applyImportRewrites` 加预扫描 + 规则 11 + `.filter(null)`（约 30 行）
2. **docstring 更新**（[scripts/convert-ddbunit-config.js:1629-1653](scripts/convert-ddbunit-config.js#L1629-L1653)）：规则计数 10 → 11
3. **新 fixture**（[scripts\__fixtures__\fun-injection.*](scripts/__fixtures__/fun-injection.funRef.tsx)）：加 1 行 `import cjpzUtil from '@/pages/common/cjpzUtil';`（ref）+ `import cktsUtil from '@/pages/hts/cktsUtil';`（expected）

**端到端验证**：

| 目录 | 变化 |
|---|---|
| [MDT_TSZL___ZXSB_SB_CKSH_GCB/auto_configFun.tsx](src/pages/hts/dditax.ckts.from/MDT_TSZL___ZXSB_SB_CKSH_GCB/auto_configFun.tsx) | cjpzUtil → cktsUtil 路径改写 ✓ |
| [DBTS_TSZL___ZXSB_SB_CKSH_GCB/auto_configFun.tsx](src/pages/hts/dditax.ckts.from/DBTS_TSZL___ZXSB_SB_CKSH_GCB/auto_configFun.tsx) | 同上 ✓ |
| [MTS_TSZL___ZXSB_SB_CKSH_GCB/auto_configFun.tsx](src/pages/hts/dditax.ckts.from/MTS_TSZL___ZXSB_SB_CKSH_GCB/auto_configFun.tsx) | 同上 ✓ |
| 其它 5 个 dditax.ckts.from 模块 | 0 变化（ref 无 cjpzUtil）✓ |

**测试**：`npm run test:convert-config` → **23 通过**（22 + fun-injection 综合测试）/ 2 失败（预存在）

**已知限制**（用户决策接受）：
- **仅处理默认导入形式**：`import <name> from ...;` —— 与用户示例严格一致；命名导入 `import { cjpzUtil } from ...` 不被改写（codebase 0 个 ref 用此形式）
- **不处理其它老路径**（如 `@/pages/common/util/cjpzUtil` 等）—— 实际 codebase 0 个
- **去重检查限定于 ref 全文**（不检查生成文件后续步骤可能添加的 `cktsUtil` 导入）—— 但生成流程中只有 `applyImportRewrites` 处理 imports；其上游 `extractRefImports` 不增 `cktsUtil`，所以检查 ref 全文已足够
- **仅基于 ref 自身的 `cktsUtil` 导入去重** —— 不检查跨模块共享
- **default 名字硬编码为 `cktsUtil`**（不保留原 `cjpzUtil` 名字）—— 与用户原话"cjpzUtil 变为 cktsUtil"严格一致
- **保持前 10 规则 + 1 排除行为不变**

### 新规则：fun 生成 — 移植 5 个 Func 方法 + antd 4/umi 3 → antd 6/umi 4 适配

**背景**：用户最新指示 fun 生成时移植 5 个 Func 方法（initEditForm / validator / eventOnBlur / eventOnFocus / eventOnChange）到生成文件，并做 antd 4/umi 3 → antd 6/umi 4 适配。

**5 个方法 + 形式**：

| # | 方法 | ref 形式 | 示例位置 |
|---|---|---|---|
| 1 | `Func.initEditForm` | 箭头函数 `(param) => { ... }` | SYYK f.tsx:22 |
| 2 | `Func.validator` | 对象字面量 `{ key1: fn1, ... }` | SYYK f.tsx:40 |
| 3 | `Func.eventOnBlur` | 对象字面量 `{ key1: fn1, ... }` | SYYK f.tsx:59 |
| 4 | `Func.eventOnFocus` | 对象字面量 `{ key1: fn1, ... }` | SYYK f.tsx:169 |
| 5 | `Func.eventOnChange` | 对象字面量 `{ key1: fn1, ... }` | SYYK f.tsx:176 |

**数据扫描**（[code_sample\src\pages\hts\dditax.ckts.from\](code_sample/src/pages/hts/dditax.ckts.from/)）：
- **54 个 ref f.tsx** 含 5 个方法中至少 1 个

**antd 4 → antd 6 / umi 3 → umi 4 迁移关注**（基于 ref 抽样）：
- **`moment(...)` → `dayjs(...)`**：ref 中常出现在 `eventOnChange` 等时间格式化场景 —— **已实现**
- `Form.create` 装饰器：antd 4 → antd 5+ `Form.useForm()` —— ref 0 处使用
- `Modal.info` / `Modal.confirm` 等静态调用：antd 5+ 改 `App.useApp()` —— ref 0 处使用
- `Input.Search` / `TextArea` / `Button.Group` 等 deprecated API：ref 0 处使用
- `useRouteMatch` → `useRouteData`（umi 3 → umi 4）—— **现有规则 10 已处理**
- `connect` / `withRouter` / `useModel`（umi 3 hooks）：ref 0 处使用

**关键设计点**：
- **新 `extractFuncMethod(content, methodName)` 辅助函数**（[scripts/convert-ddbunit-config.js:1531-1595](scripts/convert-ddbunit-config.js#L1531-L1595)）：双形式支持
  - 箭头函数形式：`Func.X = (param) => { ... };`（如 initEditForm / initAddForm）
  - 对象字面量形式：`Func.X = { key1: fn1, ... };`（如 validator / 4 个 event*）
  - bracket-depth 扫描花括号 {} 配对（与 initAddForm 提取器同款）
  - 失败返回 null（silent fallback）
- **新 `migrateAntdUmiImports(methodCode)` 辅助函数**（[scripts/convert-ddbunit-config.js:1597-1610](scripts/convert-ddbunit-config.js#L1597-L1610)）：antd 4 → antd 6 迁移
  - 当前实现：`moment\(` → `dayjs\(`（基于 ref 抽样分析，5 个方法中**唯一**有 antd 4 / umi 3 特定 API 的就是 `moment`）
  - 预留扩展点：若未来发现 antd 5+ 其它 API 模式需迁移，在此处加规则
- **`generateFunPage` 签名扩展**：加 `extraMethods` 参数（约 25 行模板调整）
  - 拼接顺序：initAddForm 先于 5 个方法（与 ref 中典型声明顺序一致）
  - filter(Boolean) 跳过未抽取的方法（silent fallback）
  - 末尾 `\n\n` 与 `export default Func;` 分隔
- **main() --fun 块**（[scripts/convert-ddbunit-config.js:2428-2440](scripts/convert-ddbunit-config.js#L2428-L2440)）：
  - `funExtraMethods` 对象存 5 个方法代码
  - 统一抽取 + 迁移：每方法 1 行 `extractFuncMethod` + 1 行 `migrateAntdUmiImports`
  - log 格式与现有 initAddForm 一致：`参照文件已抽取 <methodName>: <refPath>`

**改动**：

1. **新 `extractFuncMethod` 辅助函数**（约 65 行）—— [scripts/convert-ddbunit-config.js:1531-1595](scripts/convert-ddbunit-config.js#L1531-L1595)
2. **新 `migrateAntdUmiImports` 辅助函数**（约 13 行）—— [scripts/convert-ddbunit-config.js:1597-1610](scripts/convert-ddbunit-config.js#L1597-L1610)
3. **`generateFunPage` 模板扩展**（约 30 行）—— [scripts/convert-ddbunit-config.js:2128-2165](scripts/convert-ddbunit-config.js#L2128-L2165)
4. **main() --fun 块**（约 10 行）—— [scripts/convert-ddbunit-config.js:2411-2453](scripts/convert-ddbunit-config.js#L2411-L2453)
5. **fixture 更新**（综合测试 5 方法移植 + moment→dayjs 改写）：
   - [scripts/__fixtures__/fun-injection.funRef.tsx](scripts/__fixtures__/fun-injection.funRef.tsx) 加 5 个 Func 方法体
   - [scripts/__fixtures__/fun-injection.expected.fun.tsx](scripts/__fixtures__/fun-injection.expected.fun.tsx) 期望 5 个方法 + moment→dayjs 改写

**端到端验证**：

| 目录 | 5 方法抽取 | 变化 |
|---|---|---|
| [MDT_TSZL___ZXSB_SB_CKSH_GCB/auto_configFun.tsx](src/pages/hts/dditax.ckts.from/MDT_TSZL___ZXSB_SB_CKSH_GCB/auto_configFun.tsx) | 5/5 | 顶部 +5 方法块 ✓ |
| [MDT_TSZL___ZXSB_SB_HGSPTZ_GCB/auto_configFun.tsx](src/pages/hts/dditax.ckts.from/MDT_TSZL___ZXSB_SB_HGSPTZ_GCB/auto_configFun.tsx) | 4/5（无 initEditForm）| 同上 ✓ |
| [MDT___ZXSB_SB_MDT_SYYK_GCB/auto_configFun.tsx](src/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_SYYK_GCB/auto_configFun.tsx) | 5/5 | +moment→dayjs 迁移 ✓ |
| [MDT___ZXSB_SB_MDT_TSJH_GCB/auto_configFun.tsx](src/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TSJH_GCB/auto_configFun.tsx) | 4/5（无 initEditForm）| 同上 ✓ |
| [MDT___ZXSB_SB_MDT_TSSB_GCB/auto_configFun.tsx](src/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TSSB_GCB/auto_configFun.tsx) | 5/5 | +moment→dayjs 迁移 ✓ |
| [MDT___ZXSB_SB_MDT_YFSJ_GCB/auto_configFun.tsx](src/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_YFSJ_GCB/auto_configFun.tsx) | 5/5 | +moment→dayjs 迁移 ✓ |

**测试**：`npm run test:convert-config` → **23 通过**（fun-injection 综合 12 规则 + 1 排除 + 1 修复 + 5 Func 方法移植）/ 2 失败（预存在）

**已知限制**（用户决策接受）：
- **bracket-depth 跳过字符串字面量 / 注释内的 `{}`**（与 initAddForm 提取器同款简化）—— ref 中 5 个方法函数体内嵌字符串罕见
- **当前 `migrateAntdUmiImports` 仅迁移 `moment` → `dayjs`**：基于 ref 抽样分析，5 个方法中**唯一**有 antd 4 / umi 3 特定 API 的就是 `moment`；其它 antd 4 / umi 3 模式（`Form.create` / `Modal.method` / `connect` / `withRouter`）在 ref 中 0 处使用 —— **预留扩展点**以备未来
- **保持前 10 规则 + 1 排除 + 1 修复行为不变**
- **保持现有 initAddForm 提取行为不变**（规则 0）
- **保持 generateFunPage 现有 stub 模板行为不变**（无 initAddForm 无 extraMethods 时仍输出最小 stub）

### 新规则：fun 生成 — initEditForm 变量改名 + 6 方法顶部注释

**背景**：用户最新指示 fun 生成时做两项调整：

1. **initEditForm 变量改名**（仅 initEditForm 方法内）：
   - `unit_key` → `unitKey`（snake_case → camelCase，遵循 commonModule/f.tsx 风格）
   - `myFormItems` → `formItems`（去除 "my" 前缀）
   - `setMyFormItems` → `setFormItems`（去除 "my" 前缀）
   - "后续使用的地方也需要同步调整" —— 工具做全方法体内 rename（regex `\b` 词边界）

2. **6 个 Func 方法顶部添加注释**（按 methodName 查表）：
   - `Func.initAddForm` → `// 新建表单初始化`
   - `Func.initEditForm` → `// 编辑表单初始化`
   - `Func.validator` → `// 表单校验`
   - `Func.eventOnBlur` → `// 表单事件：OnBlur`
   - `Func.eventOnFocus` → `// 表单事件：OnFocus`
   - `Func.eventOnChange` → `// 表单事件：OnChange`

**关键设计点**：

- **新 `FUNC_METHOD_COMMENTS` 映射常量**（[scripts/convert-ddbunit-config.js:1611-1620](scripts/convert-ddbunit-config.js#L1611-L1620)）：6 个方法名 → 注释文本
- **新 `prependFuncMethodComment(methodCode, methodName)` 辅助函数**（[scripts/convert-ddbunit-config.js:1622-1634](scripts/convert-ddbunit-config.js#L1622-L1634)）：查表 + 前置注释
- **新 `migrateFuncMethodVariables(methodCode, methodName)` 辅助函数**（[scripts/convert-ddbunit-config.js:1636-1657](scripts/convert-ddbunit-config.js#L1636-L1657)）：仅 initEditForm 做 3 个变量 rename
  - `\b` 词边界避免误改 `unitKeyXxx` / `formItemsXxx` 等变体
  - 顺序无关（`setMyFormItems` 与 `myFormItems` 词边界互不重叠）
- **`postProcessFuncMethod` 编排三个变换**（[scripts/convert-ddbunit-config.js:1659-1672](scripts/convert-ddbunit-config.js#L1659-L1672)）：antd 迁移 + 变量改名 + 注释添加
- **main() --fun 块**：对 initAddForm 和 5 个抽取方法都应用 `postProcessFuncMethod`

**端到端验证**：

| 目录 | 变化 |
|---|---|
| [MDT___ZXSB_SB_MDT_SYYK_GCB/auto_configFun.tsx](src/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_SYYK_GCB/auto_configFun.tsx) | initEditForm: `unit_key/myFormItems/setMyFormItems` → `unitKey/formItems/setFormItems` ✓ + 6 方法顶部注释 ✓ |
| 其它 5 个 dditax.ckts.from 模块 | 部分含 initEditForm 变量改名（按 ref 实际内容）+ 6 方法注释（按 ref 实际方法存在性）✓ |

**测试**：`npm run test:convert-config` → **23 通过**（fun-injection 升级综合 12 规则 + 1 排除 + 1 修复 + 5 方法移植 + 2 新变换）/ 2 失败（预存在）

**已知限制**（用户决策接受）：
- **变量改名仅作用于 initEditForm 方法**（其它方法无此约定差异）—— 若未来 ref 其它方法也出现 `unit_key` / `myFormItems` / `setMyFormItems`，需扩展 `migrateFuncMethodVariables` 规则范围
- **注释查表固定 6 方法** —— 若未来新方法需注释，加 `FUNC_METHOD_COMMENTS` 字典项即可
- **保持前 12 规则 + 1 排除 + 1 修复行为不变**

### 新规则：fun 生成 — `getCodeValByKey` 3 参 → 2 参合并

**背景**：用户最新指示 fun 生成时把 `myUtil.code.getCodeValByKey(arg1, 'arg2', 'arg3')` 三参形式合并为 `myUtil.code.getCodeValByKey(arg1, 'arg2:arg3')` 两参形式（`code + viewKey` 用 `:` 合并）。原 3 参 API 已废弃；新 API 期望单一 `code:viewKey` 字符串。

**目标确认**（由 Plan agent 验证）：
- 当前 codebase 至少 5+ 处 `myUtil.code.getCodeValByKey(..., '...', '...')` 三参调用：SYYK / YFSJ / TSSB 等多个 ref f.tsx
- SYYK fun 文件当前 line 206 `myUtil.code.getCodeValByKey(gjhdqszDm, 'code_dm_gy_gjhdq', '01')` —— 应改写为 `'code_dm_gy_gjhdq:01'`

**关键设计点**：
- **新 `migrateGetCodeValByKey(methodCode)` 辅助函数**（[scripts/convert-ddbunit-config.js:1689-1706](scripts/convert-ddbunit-config.js#L1689-L1706)）
- **正则 `myUtil\.code\.getCodeValByKey\(\s*([^,]+?)\s*,\s*(['"])([^'"]+)\2\s*,\s*(['"])([^'"]+)\4\s*\)`**：
  - 严格 3 参匹配（2 个逗号 + 2 个反引号对）
  - 反向引用 `\2` / `\4` 保证引号配对（避免 `'a", "b'` 等混合引号误匹配）
  - arg1 非贪婪 `+?` —— 遇到第一个逗号停止（实际 codebase arg1 均为简单标识符 / 字段访问）
  - 引号类型（单/双）保留 —— 输出用 2nd 参同款引号
- **全局标志 `g`**：一次性处理多个调用
- **作用于所有方法**（不限于 initEditForm）—— 在 `postProcessFuncMethod` 中作为通用变换

**改动**：

1. **新 `migrateGetCodeValByKey` 辅助函数**（约 18 行）—— [scripts/convert-ddbunit-config.js:1689-1706](scripts/convert-ddbunit-config.js#L1689-L1706)
2. **`postProcessFuncMethod` 编排链加第 4 步**（[scripts/convert-ddbunit-config.js:1675-1683](scripts/convert-ddbunit-config.js#L1675-L1683)）：antd 迁移 + getCodeValByKey 合并 + 变量改名 + 注释添加
3. **fixture 更新**：[scripts/__fixtures__/fun-injection.funRef.tsx](scripts/__fixtures__/fun-injection.funRef.tsx) eventOnBlur 加 3 参 `getCodeValByKey` 调用；[scripts/__fixtures__/fun-injection.expected.fun.tsx](scripts/__fixtures__/fun-injection.expected.fun.tsx) 期望 2 参合并形式

**端到端验证**：

| 目录 | 变化 |
|---|---|
| [MDT___ZXSB_SB_MDT_SYYK_GCB/auto_configFun.tsx](src/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_SYYK_GCB/auto_configFun.tsx) | 2 处 `getCodeValByKey` 合并 ✓ |
| [MDT___ZXSB_SB_MDT_YFSJ_GCB/auto_configFun.tsx](src/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_YFSJ_GCB/auto_configFun.tsx) | 2 处合并 ✓ |
| [MDT___ZXSB_SB_MDT_TSSB_GCB/auto_configFun.tsx](src/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TSSB_GCB/auto_configFun.tsx) | 1 处合并 ✓ |
| 其它 3 个 dditax.ckts.from 模块 | 0 变化（ref 无 getCodeValByKey 调用）✓ |

**测试**：`npm run test:convert-config` → **23 通过**（fun-injection 升级综合 13 规则）/ 2 失败（预存在）

**已知限制**（用户决策接受）：
- **仅匹配 3 参 → 2 参合并** —— 不处理 1 参 / 2 参 / 4+ 参变体（ref 中 0 处此类变体）
- **arg1 简单表达式假设**（`[^,]+?` 非贪婪）—— 若 arg1 含逗号（罕见；典型为 `foo('a', 'b')` 形式）会误匹配；codebase 实测无此场景
- **混合引号（`"a', 'b"`）不匹配** —— 由反向引用 \2 / \4 保证
- **保持前 12 规则 + 1 排除 + 1 修复 + 5 方法移植 + 2 变量改名 / 注释行为不变**

## 待提交变更（2026-06-11）

### myUtil.menu.getMenuObjByPath 重写 + Func.getOtherRef ref 自动补 useRef

### myUtil.menu.getMenuObjByPath 重写 + Func.getOtherRef ref 自动补 useRef

**背景**：上一轮实现了 `extractMyConfigAdjustments` 抽取 myConfig 调整块与
`generateIndexPage` Branch B 模板。但 5+ 个 `code_sample` 参照文件还有两类
抽取遗漏：

- **场景 1（Change 1）**：
  [code_sample/src/pages/hts/dditax.ckts.from/MDT_TSZL___ZXSB_SB_CKSH_GCB/index.tsx:50](code_sample/src/pages/hts/dditax.ckts.from/MDT_TSZL___ZXSB_SB_CKSH_GCB/index.tsx#L50)
  `if (myUtil.menu.getMenuObjByPath('/hts/shgl/shsdsj')) { ... }` —— 工具原样保留，
  但 `@/components/DDAssist/util` 下没有 `menu` 子模块，TS 编译报
  `Property 'menu' does not exist`
- **场景 2（Change 2）**：
  [code_sample/src/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TSSB_GCB/index.tsx:18-23](code_sample/src/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TSSB_GCB/index.tsx#L18-L23)
  5 个 `useRef` 定义 + [index.tsx:97-105](code_sample/src/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TSSB_GCB/index.tsx#L97-L105)
  `Func.getOtherRef` 引用这 5 个 —— 工具只抽 myConfig 之后到 return 之前的代码，
  myConfig 之前的 useRef 被漏抽，生成文件里 5 个 ref 全部 `is not defined`

**改动**：

1. **Change 1 - 新增 `rewriteGetMenuObjByPathCalls(text)`**：
   字符级括号配对扫描 + 字符串字面量保护，把所有
   `myUtil.menu.getMenuObjByPath(<args>)` 整段替换为
   `cktsUtil.menu.getMenuObjByPath(<args>)`。目标方法在
   [src/pages/hts/cktsUtil.tsx:305-331](src/pages/hts/cktsUtil.tsx#L305-L331)
   已存在（用户决策：保留 `.menu`，与既有实现一致）

2. **Change 1 - 标志位扩展**：
   - `extractMyConfigAdjustments` 返回值新增 `needsCktsUtilImport` 字段
     （重写后含 `cktsUtil.` 时为 true）
   - `main()` 串联 customizations 时把
     `customizations.myConfigAdjustments.needsCktsUtilImport` OR 到既有
     `needsCktsUtilImport` 上
   - `generateIndexPage` 自动按需注入 `import cktsUtil from '@/pages/hts/cktsUtil';`

3. **Change 2 - 新增 3 个辅助函数**：
   - `extractFuncGetOtherRefPushes(content)`：扫描所有
     `Func.getOtherRef = () => { ... }` 块，提取 `otherRef.push(<name>)`
     中的 ref 名字（出现顺序，string[]）
   - `collectUseRefDeclarations(content)`：扫描全 content 中所有
     `const/let/var <name>: any = useRef(...);` 声明，返回
     `Map<name, {line, index}>`，index 用于过滤 adjustments 范围
   - `buildPreRefBlock(pushes, decls, adjStart, adjEnd)`：交叉判定 +
     拼装 preRefBlock 字符串
     - 声明在 adjustments 范围 `[initEnd+1, returnStart)` 内 → **跳过**
       （已在 text 中，重复注入会触发 "Cannot redeclare"）
     - 声明在范围外 → 复用原 declaration
     - 没声明 → 生成默认 `  const <name>: any = useRef();`

4. **Change 2 - `generateIndexPage` Branch B 模板注入**：
   在 `const myConfig = { ...unitConfig };` 之前注入 `${preRefBlock}`。
   用户决策：**hook 必须在最前**（符合 React hooks 规则，参照
   `MDT___ZXSB_SB_MDT_TSSB_GCB` 风格）

5. **`needsUseRefImport` 检测扩展**：
   ```js
   const needsUseRefImport = /\buseRef\s*\(/.test(text) || preRefBlock.length > 0;
   ```
   后者覆盖 preRefBlock 中自动补的 useRef（adjustments text 本身不含 useRef 调用）

**改动文件**：
- [scripts/convert-ddbunit-config.js](scripts/convert-ddbunit-config.js) — 4 个新辅助函数 + extractMyConfigAdjustments 改造 + generateIndexPage 模板 diff + main() 串联
- 新增 fixture（10 个文件，2 组）：
  - `scripts/__fixtures__/myutil-menu-rewrite.{input,ref,expected,expected.index,actual,actualIndex,actualFun}.tsx`
  - `scripts/__fixtures__/func-getotherref-pref.{input,ref,expected,expected.index,actual,actualIndex,actualFun}.tsx`
- 端到端同步修复（重跑工具产生）：
  - `src/pages/hts/dditax.ckts.from/MDT_TSZL___ZXSB_SB_CKSH_GCB/auto_configIndex.tsx`（Change 1 + Change 2）
  - `src/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TSSB_GCB/auto_configIndex.tsx`（Change 2，5 个 useRef 自动补齐）

**端到端验证**：
- `node scripts/convert-ddbunit-config.js --src code_sample\src\pages\hts\dditax.ckts.from\MDT_TSZL___ZXSB_SB_CKSH_GCB\auto_config.tsx`
  → 生成文件 line 1-2 注入 `import React, {useRef} from 'react';` +
  `import cktsUtil from '@/pages/hts/cktsUtil';`；line 34 的
  `if (cktsUtil.menu.getMenuObjByPath('/hts/shgl/shsdsj'))` 已被重写 ✓
- `node scripts/convert-ddbunit-config.js --src code_sample\src\pages\hts\dditax.ckts.from\MDT___ZXSB_SB_MDT_TSSB_GCB\auto_config.tsx`
  → 生成文件 line 7-11 注入 5 个 useRef（带原 `// 注释`：`// 生成明细` /
  `// 货物冲减` / `// 退税指标测算` / `// 海外仓冲减` / `// 导入错误信息页面`）；
  `Func.getOtherRef` 完整保留 ✓

**测试**：`npm run test:convert-config` → 19 通过（含新增 2 个 fixture）/
2 失败（预存在的 default-nodes-and-xhcp / toolbar-ckts-sum，与本次改动无关）

**已知限制**（用户决策接受）：
- 字符串/注释里的 `myUtil.menu.getMenuObjByPath` / ref 名也会被重写/注入
  （实际样本无此场景）
- 不处理 `Func.getOtherRef` 命名变体（如 `getOtherRefs` / 改名等）
- 不处理 useRef 复杂变体（`useRef<T>(null)` / `useImperativeHandle` +
  `forwardRef` 等）；`useRef\s*\([^)]*\)` 已兼容 `useRef<any>()` /
  `useRef(null)` 形式
- 只覆盖 `Func.getOtherRef` push 的 ref —— 仅在 JSX 引用的 ref 不在本期范围
- 不做合法性检查（push 的名字是合法标识符等）—— 用户需保证参照文件正确

## 待提交变更（2026-06-10）

### auto_configIndex.tsx 按需注入 myUtil / useRef import

**背景**：上一轮实现了 initSearchModal + myConfig 调整块的抽取与注入，但生成文件经常漏 import：

- **场景 1**：[src/pages/hts/saasMdt/tuiShuiJiHua/yearDataIndex.tsx:9](src/pages/hts/saasMdt/tuiShuiJiHua/yearDataIndex.tsx#L9)
  `const userInfo = myUtil.sessionStore.getItem('userInfo');` —— 用到 `myUtil.` 但顶部没 import
- **场景 2**：[src/pages/hts/dditax.ckts.from/MDT_TSZL___ZXSB_SB_CKSH_GCB/auto_configIndex.tsx:47-49](src/pages/hts/dditax.ckts.from/MDT_TSZL___ZXSB_SB_CKSH_GCB/auto_configIndex.tsx#L47-L49)
  `const mbxzRef: any = useRef();` —— 用到 `useRef()` 但顶部没 `import {useRef} from 'react';`

数据扫描（code_sample/src/pages/hts/dditax.ckts.from/）：
- 含 `myUtil.` 的参照：**64** 个
- 含 `useRef(` 的参照：**16** 个

**用户决策**：
- `useRef` 合并到现有 `import React from 'react';` 行（项目主流风格，
  参考 [code_sample/src/components/DDBunit/DDBunit2.tsx:1](code_sample/src/components/DDBunit/DDBunit2.tsx#L1) 的
  `import React, {useCallback, useEffect, useImperativeHandle, useRef, useState} from 'react';`）
- `myUtil` 路径用 `@/components/DDAssist/util`（独立成行）

**改动**：

1. **扩 `extractMyConfigAdjustments` 返回结构**
   —— 在末尾加两 regex 检测：
   ```js
   const needsMyUtilImport = /\bmyUtil\./.test(text);
   const needsUseRefImport = /\buseRef\s*\(/.test(text);
   return { text, needsMyUtilImport, needsUseRefImport };
   ```
   与 `extractInitSearchModalBlock` 的 `\bcktsUtil\.` / `\bUnitUtil\.getLcswsxDm\b` 检测同款 `regex.test` 模式

2. **改 `generateIndexPage` 签名 + Branch B 模板**：
   - 新增 `needsMyUtilImport` / `needsUseRefImport` 参数
   - Branch B 注入顺序：`import React${useRefInReactImport}` → cktsUtil → myUtil → DDBunit2 → ...
   - 当 `useRefInReactImport = ', {useRef}'` 时模板字面量渲染为
     `import React, {useRef} from 'react';`
   - 当不需要时 `useRefInReactImport = ''` → 渲染为 `import React from 'react';`（与改造前一致，零回归）
   - Branch A 不动（无 customization 不应含 myUtil. / useRef()）

3. **main() 串联** —— 新增两个 `let needsMyUtilImport = false;` / `let needsUseRefImport = false;`，
   从 `customizations.myConfigAdjustments.needsMyUtilImport` / `needsUseRefImport` 取值，
   传给 `generateIndexPage`

**改动文件**：
- [scripts/convert-ddbunit-config.js](scripts/convert-ddbunit-config.js) — 三处局部修改
- 新增 fixture（4 个文件，组 1 个 fixture）：
  - [scripts/__fixtures__/myutil-and-useref.input.tsx](scripts/__fixtures__/myutil-and-useref.input.tsx)
  - [scripts/__fixtures__/myutil-and-useref.expected.tsx](scripts/__fixtures__/myutil-and-useref.expected.tsx)
  - [scripts/__fixtures__/myutil-and-useref.ref.tsx](scripts/__fixtures__/myutil-and-useref.ref.tsx)
  - [scripts/__fixtures__/myutil-and-useref.expected.index.tsx](scripts/__fixtures__/myutil-and-useref.expected.index.tsx)
  - [scripts/__fixtures__/myutil-and-useref.actualIndex.tsx](scripts/__fixtures__/myutil-and-useref.actualIndex.tsx)（test runner 自动生成）

**端到端验证**：
- `yearDataConfig`（仅 myUtil.）：生成的 `yearDataIndex.tsx` 顶部加
  `import myUtil from '@/components/DDAssist/util';` ✓
- `MDT_TSZL___ZXSB_SB_CKSH_GCB`（含 myUtil. + useRef()）：生成的
  `auto_configIndex.tsx` 顶部
  ```
  import React, {useRef} from 'react';
  import cktsUtil from '@/pages/hts/cktsUtil';
  import myUtil from '@/components/DDAssist/util';
  import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
  ```
  ✓

**测试**：`npm run test:convert-config` → 17 通过（含新增 `myutil-and-useref`）
/ 2 失败（预存在，与本次改动无关）。

**已知限制**（用户决策接受）：
- 字符串/注释里的 `myUtil.` / `useRef(` 也会触发 import —— 实际数据无此场景
- 不做"必须配对"等强校验（与 `cktsUtilImport` 现有行为一致）

### 修复 extractMyConfigAdjustments 误匹配注释里的 const myConfig

**背景**：上一轮新增的 `extractMyConfigAdjustments` 用 `/const\s+myConfig\s*=\s*/` 找 initializer
起点。当参照文件里含**被 `//` 注释掉的** `const myConfig = {...unitConfig};` 时
（参见 [code_sample/src/pages/hts/saasMdt/tuiShuiJiHua/seasonDataTab.tsx:23-25](code_sample/src/pages/hts/saasMdt/tuiShuiJiHua/seasonDataTab.tsx#L23-L25)），
正则匹配到注释里那行：
1. `initEnd` 指向注释行末尾的 `;`
2. 抽取起点变成注释行之后
3. 下一行真正的 `const myConfig = cloneDeep(unitConfig);` 被当作"调整块"第一行
4. 注入到新文件时，与模板里 `const myConfig = { ...unitConfig };` 重复
5. TS 编译报 `Cannot redeclare block-scoped variable 'myConfig'`

**影响范围**：所有参照文件含 `// const myConfig = ` 旧实现痕迹的 index.tsx 全部受影响。
本次 fix 后**手动重新跑了 3 个 saasMdt index 文件**（`seasonDataConfig` /
`monthDataConfig` / `yearDataConfig` 加 `--index seasonDataTab|monthDataTab|yearDataTab`）
确认 `const myConfig = { ...unitConfig };` 单一出现，无重复。

**改动**（[scripts/convert-ddbunit-config.js](scripts/convert-ddbunit-config.js) 局部）：

`extractMyConfigAdjustments` 第一步的简单 `initRe.exec(content)` 替换为带注释跳过的循环查找：

```js
let initMatch = null;
const initRe = /const\s+myConfig\s*=\s*/g;
let m;
while ((m = initRe.exec(content)) !== null) {
  // 回溯到行首，检查是否在 // 注释行内
  let lineStart = m.index;
  while (lineStart > 0 && content[lineStart - 1] !== '\n') lineStart--;
  const linePrefix = content.slice(lineStart, m.index);
  if (!/^\s*\/\//.test(linePrefix)) {
    initMatch = m;
    break;
  }
  // regex.lastIndex 自动推进，继续找下一个
}
if (!initMatch) return null;
```

**已知限制**（用户决策接受）：
- 不处理 `/* */` 块注释里的匹配（code_sample 实际数据无此场景）
- 不处理字符串字面量里的匹配

**验证**：
- `npm run test:convert-config` → 16 通过 / 2 预存在失败（无回归）
- 3 个 saasMdt index 文件重新跑：`const myConfig` 各只出现 1 次，TS 不再报
  "Cannot redeclare block-scoped variable 'myConfig'"

### myConfig 调整块抽取与注入（auto_configIndex 全面 customization 抽取）

**背景**：上一轮实现了 `initSearchModal: [...]` 段从参照文件抽取并注入。
但 `code_sample` 里的 index.tsx 还包含大量「对 `myConfig` 的设置变更」：
- `myConfig.grid_columns.forEach(...)` / `grid_columns_tj.forEach(...)` 调整
  `ellipsis` / `width` / `filter` / `render` / `align` 等列属性
- `myConfig.form_items.forEach(...)` 调整 `eventOnChange` / `rules`
- `myConfig.X = Y` 直接赋值（`form_api_save` / `import_key` / `toolbar_default.xxx` / `costomer_toobar` 等）
- `myConfig.X = [...]` 数组赋值（如 `batch_update_items`）
- `Func.getOtherRef = () => { ... }` 之类函数副作用

这些以前完全没被工具处理。**用户决策：所有对 `myConfig` 的设置变更都需要提取**（原样保留，不重写）。

**改动**：

1. **新增 `extractMyConfigAdjustments(content)`** —— 从参照文件内容中抽取
   `const myConfig = ...;` 之后到同一 brace depth（顶层 `return` 关键字）之前的整段代码。
   - 复用 `findAssignmentEnd` 的深度扫描骨架找初始化表达式结束（顶层 `;` / `\n`）
   - 从结束位置起继续深度扫描 + 注释跳过（`//` / `/* */`）+ 字符串状态跟踪，
     在 `brace depth = 1`（函数体顶层）时找 `return` 关键字
   - 容忍字符串、注释、正则字面量内的 `return` 误匹配
   - 抽取起点 → `return` 前的整段文本，trim 首尾空白

2. **剥除 `myConfig.gridParams = { ... };` 块**（新增 `stripGridParamsBlock`）——
   该块由 `extractInitSearchModalBlock` 单独处理（含 UnitUtil → cktsUtil 重写），
   在 myConfigAdjustments 中保留会重复。剥除后若文本为空，返 `null`。

3. **改 `extractInitSearchModalFromFile` → `extractIndexCustomizationsFromFile`** ——
   拆出 `extractInitSearchModalBlock(content)`（initSearchModal 专用，保持原行为），
   顶层函数返 `{ initSearchModal?, myConfigAdjustments? } | null`，两字段独立。

4. **改 `generateIndexPage` 签名 + 模板**：
   - 新增 `myConfigAdjustments` 参数
   - 模板分为 Branch A（完全无 customization → 标准模板，与改造前一致）
     和 Branch B（至少有一项 → 注入模板）
   - Branch B 注入顺序：myConfig 调整块 → gridParams 块（与源文件出现顺序一致）

5. **main() 串联**：从 `extractIndexCustomizationsFromFile` 解构两个字段，
   分别传给 `generateIndexPage`。日志改为 `[convert] 参照文件已抽取 customization: ...`（更准确）。

**模板选择规则**：

| `initSearchModal` | `myConfigAdjustments` | 模板分支 |
| --- | --- | --- |
| null | null | Branch A：标准模板（无 myConfig） |
| 存在 | null | Branch B：只有 gridParams |
| null | 存在 | Branch B：只有 myConfig 调整块 |
| 存在 | 存在 | Branch B：两者都在（调整块在前，gridParams 在后） |

**改动文件**：
- [scripts/convert-ddbunit-config.js](scripts/convert-ddbunit-config.js) — 新增 `extractMyConfigAdjustments`、
  改 `extractIndexCustomizationsFromFile`、改 `generateIndexPage`、main() 串联
- 新增 fixture（5 个文件，组 1 个 fixture）：
  - [scripts/__fixtures__/grid-columns-adjustment.input.tsx](scripts/__fixtures__/grid-columns-adjustment.input.tsx)
  - [scripts/__fixtures__/grid-columns-adjustment.expected.tsx](scripts/__fixtures__/grid-columns-adjustment.expected.tsx)
  - [scripts/__fixtures__/grid-columns-adjustment.ref.tsx](scripts/__fixtures__/grid-columns-adjustment.ref.tsx)
  - [scripts/__fixtures__/grid-columns-adjustment.expected.index.tsx](scripts/__fixtures__/grid-columns-adjustment.expected.index.tsx)
  - [scripts/__fixtures__/grid-columns-adjustment.actualIndex.tsx](scripts/__fixtures__/grid-columns-adjustment.actualIndex.tsx)（test runner 自动生成）

**算法关键点**：
- **bracket-depth 复用**：与 `findAssignmentEnd`、`transformTextAreaFormItem`、
  `extractFieldFromToolbarDefault` 同款手法
- **brace depth 起点**：从 `initEnd + 1` 位置起，深度 = 1（已在函数体内）
- **return 关键字识别**：要求前一个字符不是字母/数字/下划线/`$`，后一个字符
  是空白/`<`/`(` 之一（避免 `myreturn` / `xreturn` / `returnX` 误判）
- **注释跳过**：单行 `//` 和块 `/* */` 都跳过（避免误把注释里的 `return` 当真）
- **退出条件**：深度降到 0 时（已退出函数体）提前 `break`

**端到端验证**：
1. **TSSB_GCB**（含 myConfig forEach + initSearchModal）：生成的
   `auto_configIndex.tsx` 完整包含直接赋值 + 2 个 forEach + form_items.forEach +
   batch_update_items + gridParams 块
2. **TSJH_GCB**（仅 myConfig 调整，无 initSearchModal）：生成的
   `auto_configIndex.tsx` 包含 grid_columns_tj forEach（filter 设置）+ 直接赋值，
   无 gridParams 块
3. **index-from-reference**（仅 initSearchModal）：myConfigAdjustments 剥除 gridParams
   后为空 → 返 null → 仅 initSearchModal 注入
4. **cktsUtil-rewrite**（含 UnitUtil）：UnitUtil → cktsUtil 重写正常工作

**测试**：`npm run test:convert-config` → 16 通过（含新增 `grid-columns-adjustment`）
/ 2 失败（预存在的 default-nodes-and-xhcp / toolbar-ckts-sum，与本次改动无关）。

**已知限制**（用户决策接受）：
- 假设函数体在模块顶层（`Index = () => { ... }` 形式）；对于 IIFE 等包装情况
  留作后续增强
- 不重写 `config.X` → `myConfig.X`（用户决策：原样保留）；若参照用 `config.X`
  直接 mutate 导入模块，编译期错由用户修
- 不做合法性检查（函数调用 / 外部 import 之类）

### HTS queryPager: data.key 追加 _CX 后缀（18 个业务模块 key 前缀匹配）

**背景**：[src/pages/hts/cktsUtil.tsx](src/pages/hts/cktsUtil.tsx) 的 `handleHtsRequest`
step 4（queryPager body 转换）原本只删 `searchModel2` + 注入 `headerSearchModel: []`。
部分业务模块（如 MDT_ZXSB_SB_MDT_TSSB 等）的 `data.key` 需追加 `_CX` 后缀以路由到
HTS 服务端的查询端点，否则列表查不到数据。

**改动**：在 step 4 的 inner `if (typeof config?.data === 'object' && config.data !== null)`
块尾部，新增 `if (...)` 条件：检测 `config.data.key` 是否含以下 18 个业务前缀之一，
命中则追加 `_CX`：

| 业务前缀 | 业务前缀 | 业务前缀 |
| --- | --- | --- |
| `MDT_ZXSB_SB_MDT_TSSB` | `MDT_ZXSB_SB_MDT_TSJH` | `TSZL_ZXSB_SB_HGSPTZ` |
| `TSZL_ZXSB_SB_CKSH` | `TSZL_ZXSB_SB_MDT_CYSM` | `MDT_ZXSB_SB_MDT_STZC` |
| `MDT_ZXSB_SB_MDT_YFSJ` | `MDT_ZXSB_SB_MDT_SYYK` | `MTS_ZXSB_SB_MTS_TSSB` |
| `MTS_ZXSB_SB_MTS_TSJH` | `MTS_ZXSB_SB_MTS_TZSB` | `DBTS_ZXSB_SB_DB_TSSB` |
| `QTYW_ZXSB_SB_CKXXCX` | `ZMKJ_ZXSB_ZM_TYYBSWTS` | `ZMKJ_ZXSB_ZM_DLCK` |
| `MTS_ZXSB_SB_MTS_YSFWCK` | `QTYW_ZXSB_TY_KJDSHWC_HSTZ` | `QTYW_ZXSB_TY_KJDSHWC_HSSB` |

**文件**：仅修改 [src/pages/hts/cktsUtil.tsx](src/pages/hts/cktsUtil.tsx)，无其它文件改动。

**实现细节**：
- 使用 `config.data.key?.indexOf(...)` 可选链，`key` 为 undefined 时自动短路为 false
  （不需要额外 `typeof` 判断）
- 用户原伪码用 `options?.data.key`，实际变量名为 `config`（与本方法其它步骤保持一致），
  改动时统一替换
- 与 step 4 现有 `searchModel2` 删除、`headerSearchModel: []` 注入共存；
  `headerSearchModel: []` 注入在前，key 后缀追加在后，互不影响
- 18 个 `||` 链式判断按用户原伪码风格保留（每项一行，便于扫读）

### auto_configIndex.tsx 生成：参照文件 + initSearchModal 注入

**背景**：[scripts/convert-ddbunit-config.js](scripts/convert-ddbunit-config.js) 原本用
固定模板生成 `auto_configIndex.tsx`。但 65+ 个 `code_sample/src/pages/hts/dditax.ckts.from/*/index.tsx`
源文件（与 `auto_config.tsx` 同目录）里大量使用
`myConfig.gridParams = { initSearchModal: [...] }` 自定义筛选项默认值。生成的
`auto_configIndex.tsx` 没有这段逻辑，DDBunit2_CKTS 加载后 `initSearchModal` 缺失，
列表页打开时筛选项为空。

**改动**：
1. 新增 CLI 参数 `--index <name>`：值参数（basename，无扩展名），同目录下 `<name>.tsx`
2. 不传 `--index`：默认查找源同目录的 `index.tsx`
3. 新增 `extractInitSearchModalFromFile(refPath)` 辅助函数：正则定位
   `initSearchModal: [` 起点，bracket-depth 扫描 `[...]` 边界，**原样抽取**整段文本
   （不做合法性检查 —— 函数调用 / 外部引用由用户自行修）
4. `generateIndexPage` 新增 `initSearchModal` 参数：命中时用「注入模板」
   （spread `myConfig = { ...unitConfig }` 后覆盖 `myConfig.gridParams = { ${段} }`）；
   未命中时仍用「标准模板」（与改造前完全一致）
5. 找不到参照文件 / 参照文件无 `initSearchModal` → **silent fallback** 到标准模板（不打 log）
6. 扩展 [test-convert-ddbunit-config.js](scripts/test-convert-ddbunit-config.js)：
   `getFixtures` 加 `expectedIndex` / `expectedFun` / `indexRef` 三种 kind 检测；
   fixture 含 `expectedIndex` / `expectedFun` 时不传 `--no-page`；含 `indexRef` 时
   自动传 `--index <fxName>.ref`；diff 失败时打印明确错误并计入 failed
7. **UnitUtil.getLcswsxDm 自动重写**：参照文件含
   `UnitUtil.getLcswsxDm(<any-var>.unit_constant)` 时，工具自动重写为
   `cktsUtil.getLcswsxDm(myConfig.unit_constant)`，并在生成文件顶部追加
   `import cktsUtil from '@/pages/hts/cktsUtil';`。
   标志 `needsCktsUtilImport` 由 `extractInitSearchModalFromFile` 返回，传入
   `generateIndexPage` 后按需加 import 行；literal-only 段不会被加 import

**改动文件**：
- [scripts/convert-ddbunit-config.js](scripts/convert-ddbunit-config.js) — 头部注释、辅助函数、
  `generateIndexPage` 签名、main() 串联
- [scripts/test-convert-ddbunit-config.js](scripts/test-convert-ddbunit-config.js) — 3 种新 fixture kind + CLI 调整 + diff 逻辑
- 新增 fixture：
  - [scripts/__fixtures__/index-from-reference.input.tsx](scripts/__fixtures__/index-from-reference.input.tsx)
  - [scripts/__fixtures__/index-from-reference.expected.tsx](scripts/__fixtures__/index-from-reference.expected.tsx)
  - [scripts/__fixtures__/index-from-reference.ref.tsx](scripts/__fixtures__/index-from-reference.ref.tsx)
  - [scripts/__fixtures__/index-from-reference.expected.index.tsx](scripts/__fixtures__/index-from-reference.expected.index.tsx)
  - [scripts/__fixtures__/index-from-reference.actualIndex.tsx](scripts/__fixtures__/index-from-reference.actualIndex.tsx)（test runner 自动生成）
  - [scripts/__fixtures__/cktsUtil-rewrite.input.tsx](scripts/__fixtures__/cktsUtil-rewrite.input.tsx)
  - [scripts/__fixtures__/cktsUtil-rewrite.expected.tsx](scripts/__fixtures__/cktsUtil-rewrite.expected.tsx)
  - [scripts/__fixtures__/cktsUtil-rewrite.ref.tsx](scripts/__fixtures__/cktsUtil-rewrite.ref.tsx)
  - [scripts/__fixtures__/cktsUtil-rewrite.expected.index.tsx](scripts/__fixtures__/cktsUtil-rewrite.expected.index.tsx)
  - [scripts/__fixtures__/cktsUtil-rewrite.actualIndex.tsx](scripts/__fixtures__/cktsUtil-rewrite.actualIndex.tsx)（test runner 自动生成）

**端到端验证**：
- 默认（源同目录有 `index.tsx`）：
  ```
  node scripts/convert-ddbunit-config.js --src code_sample\src\pages\hts\dditax.ckts.from\MDT___ZXSB_SB_MDT_TSSB_GCB\auto_config.tsx
  → [convert] 参照文件已抽取 initSearchModal: code_sample\...\index.tsx
  → auto_configIndex.tsx 含 myConfig.gridParams = { initSearchModal: [{ property: 'cdDm', value: '25030101', op: 'zdy' }] }
  ```
- 显式 `--index monthDataTab`：
  ```
  node scripts/convert-ddbunit-config.js --src code_sample\src\pages\hts\saasMdt\tuiShuiJiHua\monthDataConfig.tsx --index monthDataTab
  → 命中 monthDataTab.tsx，注入 initSearchModal
  ```
- Silent fallback：`--index nonexistentRef` → 0 行 log，标准模板生成

**测试**：`npm run test:convert-config` → 15 通过（含新增 `index-from-reference` + `cktsUtil-rewrite`）
/ 2 失败（预存在的 default-nodes-and-xhcp / toolbar-ckts-sum，与本次改动无关）。

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

## 待提交变更（2026-06-25）

### 新规则：`getDateYearAgoToNow(1)` 自动追加 `.map(dayjs)` + dayjs import 自动补齐

**背景**：上一轮 6 条字面量规则迁移到 `rules.replace.ts` 后，
`replace.ts` 已有 15 条规则。本次按用户最新指示：

1. **新规则 16**（[scripts/convert-ddbunit-config.rules.json:135-137](scripts/convert-ddbunit-config.rules.json#L135-L137)）：
   - 源：`myConfig.grid_filter_quick[0].defaultValue = myUtil.date.getDateYearAgoToNow(1)`
   - 目标：`myConfig.grid_filter_quick[0].defaultValue = myUtil.date.getDateYearAgoToNow(1).map((d: string) => dayjs(d))`
   - 触发原因：新协议下 DDBunit2_CKTS 期望 `defaultValue` 元素是 `Dayjs` 对象，源文件返回的 `string[]` 需包装

2. **`AUTO_IMPORTS_AFTER_REPLACE` 新增 dayjs 条目**（[scripts/copy-from-code-sample.js:1306-1308](scripts/copy-from-code-sample.js#L1306-L1308)），
   携带 `matchType: 'call'`：
   ```js
   { symbol: 'dayjs', importLine: "import dayjs from 'dayjs';", matchType: 'call' }
   ```
   触发条件：当前文件里不含 `import dayjs from 'dayjs';` 时自动补到顶部
   （import 已存在则跳过，幂等）

3. **`extractSymbolTokens` 扩展支持函数调用符号**（[scripts/copy-from-code-sample.js:1313-1321](scripts/copy-from-code-sample.js#L1313-L1321)）：
   - 之前只匹配 `identifier.`（属性访问，如 `cktsUtil.X`）
   - 现在同时匹配 `identifier(`（函数调用，如 `dayjs(x)`）—— lookahead 不消费 `(`，只标记 identifier
   - 双 regex 合并后去重

4. **`ensureAutoImports` 使用 `matchType` 区分 regex**（[scripts/copy-from-code-sample.js:1324-1328](scripts/copy-from-code-sample.js#L1324-L1328)）：
   - `'property'`（默认）：`\b${symbol}\.(?!/)` —— `cktsUtil.X` 形式
   - `'call'`：`\b${symbol}\(` —— `dayjs(x)` 形式

**关键设计点**：
- **`extractSymbolTokens` 改用 `[...propAccess, ...funcCall]`**：在 `old → new` 字面量差里检出**新引入**的 `dayjs(` 调用 token
- **与 `cktsUtil` 现有逻辑完全平行**：与 `AUTO_IMPORTS_AFTER_REPLACE` 中 `{ symbol: 'cktsUtil' }` 同款流程；唯一区别是 `matchType` 字段
- **自动 import 位置**：`firstImportMatch.index` 之前 —— 与既有 `prependImports` 风格一致（项目内 import 段顶部）
- **去重保护**：`!text.includes(importLine)` —— 文件已有 `import dayjs from 'dayjs';` 时不重复添加（幂等）
- **token 提取负向先行 `(?!['"\`\/])`**：保留原有保护，匹配 `cktsUtil.X` 而不匹配字符串字面量 `cktsUtil/X`
- **funcCall 用 lookahead `(?=\()`**：不消费括号，仅标记 identifier

**改动文件**：
- [scripts/convert-ddbunit-config.rules.json](scripts/convert-ddbunit-config.rules.json) —— `replace.ts` 追加 1 条规则
- [scripts/copy-from-code-sample.js](scripts/copy-from-code-sample.js) —— `AUTO_IMPORTS_AFTER_REPLACE` / `extractSymbolTokens` / `ensureAutoImports` 三处微调

**端到端验证**（`src/pages/hts/sjbb/sc/tjbb/bgdtsqk/ckbgdfyhz/index.tsx`）：

| 检查 | 期望 | 实际 |
|---|---|---|
| 触发替换 | `getDateYearAgoToNow(1).map((d: string) => dayjs(d))` 出现在 line 18 | ✓ |
| dayjs import 自动补齐 | line 1 `import dayjs from 'dayjs';` | ✓ |
| 重复运行幂等 | md5 两次相同 | ✓ `f6222a48a8fc67d88485b955eb7bc253` |
| dayjs import 计数 | 1（不重复）| ✓ |
| cktsUtil import 仍工作 | 1（不被新逻辑误改）| ✓ |
| 现有 `replace.ts` 15 条规则 | 全部正常工作 | ✓ |

**测试**：`npm run test:convert-config` → 22 通过 / 2 失败（预存在，与本次改动无关）。

**已知限制**（用户决策接受）：
- **字符串/注释里的 `dayjs(` 也会触发 import** —— 与 `cktsUtil.` 已有行为一致
- **不同的 dayjs import 形式未处理**：若文件用 `import { dayjs } from 'dayjs';` 而非 default import，重复 import 会触发 TS 错误（与 `cktsUtil` 已有行为一致）
- **仅作用于 `replace.ts` 数组的 `ts` 类**：`less` 类不会触发 auto-import（less 不需要 import；现有行为）

### sjbb/sc 全量业务模块重生成

**背景**：本轮 6 条新规则生效后 + r15 codeTable 数组转字符串 + 13 条 fun 生成规则 + 5 方法移植，端到端重新跑 78 个 sjbb/sc/ 业务模块，确认所有规则覆盖正确。

**范围**：
- `src/pages/hts/sjbb/sc/sjgx/`：4 个文件（`config.tsx` / `f.tsx` / `index.tsx` + `commonModule/sjgx/DDSjgxUpdateData.tsx`）
- `src/pages/hts/sjbb/sc/tjbb/`：73 个文件（`bgdtsqk/` / `ckqk/` / `common/` / `tsqk/`）
- 配套 `config/routes/routes.ckts.ts` / `run-convert-batch.bat` / `src/components/DDAssist/util/index.tsx` / `src/components/DDBunit/DDBunit2.tsx` / `src/components/DDBunit/unit_util.tsx` / `src/pages/hts/cktsUtil.tsx` / `src/pages/hts/saasMdt/wbsjgl/ckbgdgl/btssj/btssjFunc.tsx` 调整

**已知限制**（与本轮一致）：
- 字符串/注释里的 token 检测范围未做（与 `extractSymbolTokens` 同款简化）
- 13 条 fun 生成规则的边界条件已在各自章节详述

## 待提交变更（2026-06-29）

### processTypeE：less 文件新增 2 条行注释规则

**背景**：`scripts/copy-from-code-sample.js` 的 `processTypeE` 已有 4 类 less 行注释规则
（`@/assets/css/config.less` 整行注释 + `@font_color` / `@primary_` 行注释 +
删除 `@import '~antd/lib/style/themes/default.less';`）。本次按用户最新指示新增 2 条
同款规则（保留缩进）：

| # | 规则 | 触发 | 效果 |
|---|---|---|---|
| 1 | `@base_font_` 行注释 | 任意行含 `@base_font_` | 行首加 `// `（保留缩进）|
| 2 | `.png')` 行注释 | 任意行含 `.png')`（如 `url('~@/assets/css/img/bookBg.png')`）| 行首加 `// `（保留缩进）|

**示例**：
```less
font-size: @base_font_12x  !important;
background: url('~@/assets/css/img/bookBg.png') no-repeat top center;
```
↓
```less
// font-size: @base_font_12x  !important;
// background: url('~@/assets/css/img/bookBg.png') no-repeat top center;
```

**关键设计点**（与现有 `@font_color` / `@primary_` 一致）：
- 合并到现有 `if ((@font_color || @primary_ || @base_font_ || .png') ...)` 单个 if 分支
- `&& !line.trim().startsWith('//')` 保护已注释行（避免重复嵌套 `// //`）
- 保留原缩进：`` `${indent}// ${line.trim()}` ``
- 处理顺序在 `applyContentReplaces(less)` 之前，rules.replace.less 仍可继续生效
- 函数顶部 JSDoc 同步更新（`@font_color` / `@primary_` → 加 `@base_font_` / `.png')`）

**改动文件**：[scripts/copy-from-code-sample.js:2301-2337](scripts/copy-from-code-sample.js#L2301)

**已知限制**（用户决策接受，与现有 4 规则一致）：
- 不区分 `//` 单行注释 vs `/* */` 块注释；块注释内的 `@base_font_` / `.png')` 也可能被误注释（codebase 实际数据无此场景）
- `.png')` 严格按 `')` 结尾匹配（与用户示例 `url('~...png')` 一致）；不带 `')` 结尾的 `.png` 引用不受影响
- 不处理 `url("...png")` 双引号形式（与本规则 `')` 触发条件不匹配；如未来需要可扩展）

## 待提交变更（2026-06-30）

### DDAlert / DDImport / DDBunit2 路径重写目标：commonModule → components

**背景**：`src/pages/hts/commonModule/{DDAlert,DDImport,ddbunit2_ckts}` 与
`src/pages/hts/components/{DDAlert,DDImport,DDBunit2_ckts}` 字节完全相同（同一份代码两份目录）。
现有 520+ 个 import 仍使用 `commonModule/` 路径。用户决策：
**不迁移文件（保留两份目录）**，但后续生成的代码改用 `components/` 路径。

本轮只调整 `scripts/copy-from-code-sample.js` + `scripts/convert-ddbunit-config.js`
+ `scripts/convert-ddbunit-config.rules.json` 的"重写目的地"，让工具下次运行时输出
`@/pages/hts/components/...`，现有 520+ 个 import 不动（两份目录都在盘上，运行时无影响）。

**目标路径对应**：
- `@/components/DDAlert` → `@/pages/hts/components/DDAlert`
- `@/components/DDImport/checkErrorProp` → `@/pages/hts/components/DDImport/checkErrorProp`
- `@/components/DDBunit/DDBunit2` → `@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS`
  （注意大小写：`commonModule` 是小写 `ddbunit2_ckts`，`components` 是 PascalCase `DDBunit2_ckts`）

**改动文件**：

1. **[scripts/copy-from-code-sample.js](scripts/copy-from-code-sample.js)** — 6 处重写字符串 + 4 处注释同步：
   - L1249 `applyImportRewrites` 单行匹配 DDAlert → components
   - L1575 `applyImportRewritesToContent` 内 R17 (DDImport/checkErrorProp) → components
   - L1579 同函数内 R5 (DDAlert) → components
   - L1984 `normalizeDDBunit2Import` DDBunit2 模板 → components/DDBunit2_ckts（大小写）
   - L2086/L2089 `applyCopyRewrites` R5 注释 + 替换字符串 → components
   - L2092/L2095 同函数 R13 注释 + 替换字符串 → components/DDBunit2_ckts
   - L2110/L2113 同函数 R17 注释 + 替换字符串 → components

2. **[scripts/convert-ddbunit-config.js](scripts/convert-ddbunit-config.js)** — 5 处平行规则：
   - L2016 规则 5 docstring 注释
   - L2064 `applyImportRewrites` 单行匹配 DDAlert
   - L2178 规则 5 替换字符串
   - L2822 `normalizeDDBunit2Import` docstring 注释
   - L2831 `normalizeDDBunit2Import` 替换字符串 → components/DDBunit2_ckts

3. **[scripts/convert-ddbunit-config.rules.json](scripts/convert-ddbunit-config.rules.json)** — L302 `excludeFiles`：
   - `"src/pages/hts/commonModule/ddbunit2_ckts/**"` → `"src/pages/hts/components/DDBunit2_ckts/**"`
   - 保持规则引擎继续排除 DDBunit2_CKTS 子树

4. **9 个 expected fixture 文件**（规则改动后必须同步）：
   - 8 个 `*.expected.index.tsx`：line 6/7/11 DDBunit2 import 路径
     `commonModule/ddbunit2_ckts` → `components/DDBunit2_ckts`
   - 1 个 `fun-injection.expected.fun.tsx`：line 6 DDAlert import 路径
     `commonModule/DDAlert` → `components/DDAlert`

5. **10 个 actual fixture 文件**（test runner 自动重生成）：
   - 9 个 `*.actualIndex.tsx` 在测试运行时由 `derivePagePaths` 自动写出
   - 1 个 `fun-injection.actualFun.tsx` 手动同步（line 6 路径 + 改 LF 行尾 + 末尾加 `\n`）

**测试验证**：
- `npm run test:convert-config` → **22 通过 / 4 失败**
  - 22 通过包含 8 个新 components 路径 fixture + 14 个其它无关 fixture
  - 4 失败为预存在（combo / default-nodes-and-xhcp / multi-line-remove / toolbar-ckts-sum），与本次改动无关
- `npm run test:special-line` → **8 通过 / 0 失败**（无影响）
- 端到端冒烟：`node scripts/convert-ddbunit-config.js --src code_sample/src/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TSSB_GCB/auto_config.tsx`
  生成 index.tsx / f.tsx 已正确使用新路径：
  - `import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';`
  - `import DDAlert from '@/pages/hts/components/DDAlert';`

**已知限制**（用户决策接受）：
- 现有 520+ 个 `commonModule/` import 不动 —— 保留两份目录是必要的
- `staticTableCode` 路径（`commonModule/staticTableCode`）不在本次范围 —— R7/R12 规则未调整
- `cjpzUtil` → `cktsUtil` 改写（规则 11）已在新路径下仍工作 —— 不影响
- Windows FS 不区分大小写，所以 `ddbunit2_ckts` vs `DDBunit2_ckts` 在 Windows 上无问题；Linux/macOS CI 必须严格匹配 PascalCase

## 待提交变更（2026-06-30）

### R13b 自愈分支：处理 stale code_sample ref 文件已含旧目标路径

**背景**：上一轮 cc3b54f 改完规则后，重新跑 `node scripts/copy-from-code-sample.js --src code_sample\...\MDT___ZXSB_SB_MDT_SYYK_GCB` 时发现生成文件 line 6 仍是 `commonModule/ddbunit2_ckts/DDBunit2_CKTS`。但跑同目录的 `MDT___ZXSB_SB_MDT_STZC_GCB` 正常。

**根因**：脚本 R13 规则（[scripts/copy-from-code-sample.js:2092-2096](scripts/copy-from-code-sample.js#L2092-L2096) + [scripts/convert-ddbunit-config.js:2828-2833](scripts/convert-ddbunit-config.js#L2828-L2833)）**只匹配源端 `@/components/DDBunit/DDBunit2`**，不匹配"已经重写过的旧目标"。

数据扫描（[code_sample/src/pages/hts/dditax.ckts.from/](code_sample/src/pages/hts/dditax.ckts.from/)）：

| ref 内容 | 数量 | 行为 |
|---|---|---|
| `import DDBunit2 from '@/components/DDBunit/DDBunit2';`（源端）| 60+ | R13 匹配 → 重写为 `components/DDBunit2_ckts/DDBunit2_CKTS` ✓ |
| `import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';`（已重写过的旧目标）| **1**（`MDT___ZXSB_SB_MDT_SYYK_GCB/index.tsx`）| R13 不匹配 → 原样拷贝 ✗ |

只有那 1 个 ref 文件 line 6 早就"固化"了旧目标路径（早于 cc3b54f 规则改动），现在重跑时规则不再回溯处理。`MDT___ZXSB_SB_MDT_STZC_GCB` ref 用源端模式 → R13 能匹配 → 正确生成新路径。

**改动**：给 R13 加一条 R13b "自愈"分支（与 R13 平行，输出同一目标）：

- 源端 → 新目标（R13，原有）：
  ```
  import DDBunit2 from '@/components/DDBunit/DDBunit2';
  ```
- 旧目标 → 新目标（R13b，新增）：
  ```
  import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
  ```
- 两者都重写为：
  ```
  import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
  ```

**关键设计点**：
- **不动 DDAlert / DDImport 规则**：扫描全 `code_sample/` 0 处命中旧 `commonModule/DDAlert` / `commonModule/DDImport`，所以 R5 / R17 不需要加自愈分支
- **不动 code_sample ref 文件**：脚本侧修复最稳健；未来若有其他 ref 文件被"提前固化"旧路径也能自愈
- **大小写严格**：R13b 正则用小写 `ddbunit2_ckts`（与 code_sample 文件内容一致），输出目标用 PascalCase `DDBunit2_ckts`（与磁盘 components/ 目录一致）
- **幂等**：R13b 输出已是新目标，不匹配自身；与 R13 串联无冲突
- **两脚本平行改**：保持既有"R13 同时存在于 copy-from-code-sample.js / convert-ddbunit-config.js"的约定

**改动文件**：

1. **[scripts/copy-from-code-sample.js:2092-2100](scripts/copy-from-code-sample.js#L2092-L2100)** —— R13 后追加 R13b
2. **[scripts/convert-ddbunit-config.js:2828-2842](scripts/convert-ddbunit-config.js#L2828-L2842)** —— `normalizeDDBunit2Import` 改为双 `.replace` 链 + JSDoc 同步更新

**端到端验证**：
- 用户命令：`node scripts/copy-from-code-sample.js --src code_sample/src/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_SYYK_GCB`
- 生成文件 line 6 = `import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';` ✓

**测试**：`npm run test:convert-config` → 22 通过 / 4 失败（无回归）；`npm run test:special-line` → 8 通过。

**已知限制**（用户决策接受）：
- 仅处理默认导入 `import DDBunit2 from ...;`（命名导入 / `import *` 不在范围；codebase 无此用法）
- 不动 ref 源文件 —— 若用户后续希望同步，可单独跑一次性脚本

## 待提交变更（2026-07-07）

### DDAlert 不弹窗修复：antd v6 Modal.visible → .open

**问题**：`src/pages/hts/ckts/sbsjcx/sbsjcx.tsx:212` 的 `Func.shfkdr` 内调用 `DDAlert.open({...})` 后 Modal 不出现（"反馈读入"按钮无反应）。`grep "DDAlert.open"` 找到 **50+ 处调用点全部失效**（sbsjcx 只是其中一个）。

**根因（已确认）**：[src/pages/hts/components/DDAlert/index.tsx:207](src/pages/hts/components/DDAlert/index.tsx#L207) 用 antd v4 风格的 `visible={opts.modalVisible}`，但项目实际是 `antd@6.4.3`：
- `node_modules/antd/es/modal/interface.d.ts` 中 `ModalProps` 只声明 `open`，`visible` 已删除
- `node_modules/antd/es/modal/Modal.js:218` 内部强制 `visible: open` 覆盖用户传的 `visible`，导致 `visible=undefined` → 弹窗永远不显示

**改动**（[src/pages/hts/components/DDAlert/index.tsx](src/pages/hts/components/DDAlert/index.tsx) **1 行实质修改**）：

```diff
 <Modal
   title={opts.title}
-  visible={opts.modalVisible}
+  open={opts.modalVisible}
```

**关键设计点**：
- **只改 DDAlert 本身，50+ 调用方零修改**：所有 `DDAlert.open/close/getForms()` 调用点不需改动
- **contentForm.tsx 不动**：`Form.useForm()` 已兼容 v6
- **`destroyOnHidden={true}` 不动**：v5+ 新 prop 与 `open` 配合工作正常
- **不引入 `App.useApp()`**：当前 `ConfigProvider.config({ holderRender })` 已支持静态 message API，与本 bug 无关
- **保留 `ReactDOM.render`**（不升级 `createRoot`）：`ReactDOM.render` 同步返回实例，导出时 `DDAlert` 已挂载 `open/close/getForms`；`createRoot.render` 的 `ref` 回调是异步 commit，**首次点击按钮时 `DDAlert` 仍是 undefined**（用户实际验证：`Cannot read properties of undefined (reading 'open')`）。React 18 下 `ReactDOM.render` 仍可工作（仅触发废弃 warning，与本 bug 无关）

**验证**：
- 启动 `npm run dev`，浏览器打开 sbsjcx 业务页面（如 ZMKJ_DLJK / QTYW_HWCHS 路径）
- 点击"反馈读入"按钮 → Modal 弹窗应出现，含文件上传 Dragger 区域，标题"反馈读入"
- TypeScript 检查：`npx tsc --noEmit`

**已知限制**（用户决策接受）：
- `ReactDOM.render` 仍触发 React 18 废弃 warning —— 不影响功能，未来若需彻底消除 warning 需配合 class component 转 function component（不在本 bug 范围）
- 不引入 `App.useApp()`（涉及大范围重构）
- 不在本次回归范围内但理论应同时恢复的 49+ 处其它 DDAlert.open 调用点（如 `workplace/index.tsx` / `sjgl/xzrwgl/sjxz/index.tsx` / `ckts/scsbsj/scsbsj.tsx` 等），建议用户自然浏览过程中留意验证

## 待提交变更（2026-07-14）

### dayjs → moment 回退：4 个文件（DDItems / znfx / Zdylb3 / wfkMxtsMod）回退到 9fc230b 之前的 moment 写法

**背景**：上一轮提交 `9fc230b fix(DDForm): RangePicker 收到 moment 实例导致 .isValid 报错 — moment 全替换为 dayjs` 将工作区 4 个文件的 `import moment from 'moment'` / `moment(...)` 统一改为 dayjs。但本次工作区又把同一批 4 个文件反向改回 moment（即回退 `9fc230b` 的转换成果），用户决策保留 moment 写法。

**改动文件**（全部将 `import dayjs from 'dayjs'` → `import moment from 'moment'` + `dayjs(...)` → `moment(...)` + 对应 API 差异同步调整）：

| 文件 | 修改要点 | 涉及 API 差异 |
|---|---|---|
| [src/components/DDForm/DDItems.tsx](src/components/DDForm/DDItems.tsx) | line 4 import + line 604-608 / line 746-749 4 处 presets | `subtract(1, 'day')` → `subtract(1, 'days')`；`subtract(N, 'day')` → `subtract('days', N)`（参数顺序反转）|
| [src/pages/hts/jljg/znfx/index.tsx](src/pages/hts/jljg/znfx/index.tsx) | line 17 import + line 31/34 `myConfig.grid_filter_quick[1].defaultValue` | 仅 import + 调用改名 |
| [src/pages/hts/mbcx/slcx/comm/Zdylb3.tsx](src/pages/hts/mbcx/slcx/comm/Zdylb3.tsx) | line 18 import + line 575/578/580、line 1303、line 1326、line 1692 | `dataPickFormat` 解析路径；formatter 链 |
| [src/pages/hts/sjbb/wm/tjbb/tsqk/zbblgyscx/wfkMxtsMod.tsx](src/pages/hts/sjbb/wm/tjbb/tsqk/zbblgyscx/wfkMxtsMod.tsx) | line 9 import + line 36/55 `tempFilterItems[i].defaultValue` | 仅 import + 调用改名 |

**与历史约束的冲突**：
- **CLAUDE.md「代码规范」** 已声明"日期操作统一使用 `dayjs`，**不再使用 `moment`**"，本轮变更与该约束相反
- **HEAD `9fc230b` 提交说明** —— "moment 全替换为 dayjs" 的修复成果被本次反向回退
- **CLAUDE.md 历次「待提交变更」**（2026-05-13、2026-05-22、2026-06-10、2026-06-25、2026-06-29、2026-06-30、2026-07-07）均按 dayjs 路径走，本次是首次反向

**用户决策接受**：
- 既然代码运行需要 moment（如某业务方依赖、antd 6 兼容性、RangePicker isValid 问题根因进一步定位等），回到 moment 是用户明确意愿（用户在 Claude 提示 dayjs → moment 反向风险后回复"推"）
- 后续如再启 dayjs 迁移，需另起新一轮（含 `9fc230b` 二次回退），不应直接覆盖本次提交

**端到端验证**：

| 验证项 | 期望 | 说明 |
|---|---|---|
| `git log --oneline origin/export-tax-refund` 当前最新 | `9fc230b` | 本次提交前本地与远端一致 |
| `git log --oneline origin/export-tax-refund` 提交后最新 | `9fc230b` 之上的新提交 | 推送后远端多 1 commit |
| 工作区已修改 4 文件 + CLAUDE.md | 5 文件 1 commit | `git show --stat HEAD` 自检 |
| 工作区无其它遗留改动 | 0 uncommitted | `git status --porcelain` 应为空 |

**已知限制**（用户决策接受）：
- 与 `9fc230b` 同期声明的 "antd 5+ 默认 dayjs" 假设在本分支**不再成立** —— 工作区运行时实际依赖 moment
- `RangePicker isValid` 报错（`9fc230b` 修复点）理论可能在某些调用栈再次出现 —— 若 CI / 业务方发现，需重新启用 dayjs
- 不在本次范围内的其它 30+ 个 `code_sample` 重生成产物可能仍用 dayjs（如 `auto_config*.tsx`）—— 当前提交只动这 4 个文件，不影响 scripts 产物
- **CLAUDE.md「代码规范」段落未同步** —— 仍写"不再使用 moment"。本次反向回退未更新该规范段，如需更准确应另起一轮修订
- **HEAD 提交说明未改写** —— `9fc230b` 仍描述 "moment 全替换为 dayjs"，本提交是覆盖其成果而非 rebase / revert
