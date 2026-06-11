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

## 待提交变更（2026-06-11）

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
  import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
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
