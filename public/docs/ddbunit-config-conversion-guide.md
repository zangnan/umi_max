# DDBunit2 配置转换指南（新旧协议调整说明）

> **源文件路径参考**：
> - 代码样例（旧版）：`code_sample/src/pages/hts/saasMdt/tuiShuiJiHua/monthDataConfig.tsx`
> - 标准协议参考：`src/pages/example/json_page/unit/config.tsx`
> - 标准类型定义：`src/components/DDBunit/DDBunit2.types.ts`
> - 本批次产出：`src/pages/hts/saasMdt/tuiShuiJiHua/monthDataConfig.tsx`
> - 本批次 README：`src/pages/hts/saasMdt/tuiShuiJiHua/monthDataConfig.README.md`
>
> **本文档持续完善**：每完成一批 config 转换，请在本文件"本批次具体转换记录"小节追加链接；任何通用规则更新，编辑"通用转换规则"小节。

---

## 一、背景

### 1.1 旧 DDBunit2 vs 新 DDBunit2

项目存在两套 DDBunit2 协议：

| 维度 | 旧版（`code_sample/`） | 新版（`src/`） |
| --- | --- | --- |
| 入口组件 | `code_sample/src/components/DDBunit/DDBunit2.tsx` | `src/components/DDBunit/DDBunit2.tsx` |
| 类型定义 | 无独立 `.types.ts`，散落在组件 | `src/components/DDBunit/DDBunit2.types.ts`（`DDBunit2Config` / `DDBunit2Func` / `DDBunit2Authority`） |
| 业务 key 字段 | `unit_key` | `module_key`（DDBunit2.tsx:123 实际只读 `module_key`） |
| 工具栏配置 | `toolbar_default.tssb_download` | `toolbar_default.download` |
| 勾选事件 | `click_checked` | `grid_click_checked` |
| 自定义工具栏 | `costomer_toobar`（拼写错误） | `customer_toolbar`（正确拼写） |
| 数据条数显示 | `grid_show_data_num` | `toolbar_show_grid_checked_num` |
| 多列集切换 | 自行约定 `wm_grid_columns` + 消费者 `cloneDeep` + 运行时分支 | 走标准 `grid_columns` + 消费者 spread + 路由/状态判断 |
| 表单定义 | `func.tsx` 中 `DDAlert.open({...isFormContent: true, formContent: <Form.Item>...})` | `config.tsx` 中声明式 `form_items: [...]` 数组 |
| 消费者模式 | `cloneDeep(unitConfig)` 后 mutate | `{ ...unitConfig }` spread 后 mutate |
| 业务常量 | 各自 myUtil | `@/components/DDAssist/constants` |

### 1.2 为什么需要这次转换

旧版协议中的多个顶层 key 在新版 DDBunit2 中**完全不识别**或**被改名**——直接使用旧 config 会导致：
- `unit_key` 被新版 DDBunit2 静默忽略 → 后端接口调用缺失
- `costomer_toobar` 拼写错误 → 自定义工具栏按钮不显示
- `wm_grid_columns` 不存在 → 多列集切换机制失效

### 1.3 转换的预期产出

- ✅ 标准格式的 `monthConfig.tsx`，与 `src/pages/example/json_page/unit/config.tsx` 同协议
- ✅ 字段对比 README（机器可读、可追溯）
- ✅ 通用转换规则文档（便于后续 season/year 等文件复用）
- ✅ 自动化转换工具（带 fixture 测试）

---

## 二、协议基础

新版 DDBunit2 的 `DDBunit2Config` 接口字段全集（来源：[src/components/DDBunit/DDBunit2.types.ts](../src/components/DDBunit/DDBunit2.types.ts)）：

| 分组 | 字段 | 备注 |
| --- | --- | --- |
| 基础 | `module_type`, `module_key`, `page_id` | `module_key` 是新版唯一识别的业务 key |
| 表单 | `form_title`, `form_layout_type`, `form_width`, `form_items`, `form_save_check`, `form_submit_type` | `form_items` 取代旧的 `DDAlert.open` 内联 JSX |
| 表格 | `grid_columns`, `grid_row_key`, `grid_title`, `grid_pagination`, `grid_sum_field`, `grid_filter_quick`, `grid_setting_sort`, `grid_setting_filter_advanced`, `grid_handle_columns_default`, `grid_show_serial_number`, `grid_selection_type`, `grid_border`, `grid_sticky_affix`, `grid_scroll_x`, `grid_scroll_y`, `grid_handle_width`, `grid_type`, `grid_type_switch`, `grid_list_card_type`, `grid_list_card_field`, `grid_list_card_render`, `grid_list_card_action`, `grid_click_checked`, `gridIsInitSearch` | |
| 工具栏 | `toolbar_default` (含 `add`/`edit`/`delete`/`delete_by_condition`/`setting`/`full`/`reload`/`statistics`/`advanced_filter`/`download`/`download_pdf`/`upload`), `toolbar_open`, `toolbar_show_grid_checked_num`, `customer_toolbar` | `download` 取代旧的 `tssb_download` |
| 过滤 | `filter_items` | 通用第一层筛选 |
| 业务 key | `delete_key`, `get_edit_value_by_grid` | |
| API | `api_grid_query`, `api_form_query`, `api_form_edit`, `api_form_delete`, `api_form_check`, `api_excel_export`, `api_excel_import`, `api_excel_template` | `api_excel_export` 取代旧的 `export_key` |
| 布局 | `layout_type` (`'default' \| 'modal' \| 'tabs'`，可扩展) | 旧版 `'tz'` 字面值保留待验证 |
| 批量 | `batch_update_items` | |
| 操作列 | `handle_columns` | |
| 高级 | `leaf_config`, `backend_dev_dict` | 扩展用 |

---

## 三、通用转换规则

> 以下规则适用于所有从旧 DDBunit2 协议 config 迁到新协议 config 的场景。

### 3.1 顶层 key 重命名

| 旧 key | 新 key | 备注 |
| --- | --- | --- |
| `unit_key` | `module_key` | **必改**。新版 DDBunit2 只读 `module_key` |
| `click_checked` | `grid_click_checked` | 字段名补全 |
| `costomer_toobar` | `customer_toolbar` | 修正 `customer` 拼写错误 |
| `grid_show_data_num` | `toolbar_show_grid_checked_num` | 字段归类到 toolbar |

### 3.2 嵌套 key 重命名（仅 `toolbar_default` 块内）

| 旧 key | 新 key | 备注 |
| --- | --- | --- |
| `toolbar_default.tssb_download` | `toolbar_default.download` | 通用下载按钮；大数据量导出改由 `api_excel_export` 配置 |

### 3.3 顶层 key 删除

| 旧 key | 原因 | 替代方案 |
| --- | --- | --- |
| `wm_grid_columns` | 新版不支持多列集切换 | 消费者处按路由/状态切换 `grid_columns` |
| `export_key` | 与新版 `api_excel_export` 重复 | 改用 `api_excel_export: '/export/...'` |
| `export_large` | 无对应字段 | 改由后端流式接口 + `api_excel_export` 配置 |
| `module_type: 'QZ_type'` | 仅旧版内部使用 | 删除（`module_type` 字段本身保留给其它判断） |

### 3.4 导入语句

旧 config 通常无导入；新 config 顶部应添加：
```ts
import CONSTANTS from '@/components/DDAssist/constants';
```
即使暂未使用，也保持与 `src/pages/example/json_page/unit/config.tsx` 顶部结构一致。

**旧残留 import 必须删除**（否则 src/ 下不可解析）：
- `import myUtil from '@/pages/common/myUtil';`（旧 myUtil 路径，src/ 下不存在）
- 任何 `import ... from '@/pages/common/...'` 都应删除

工具已默认在 `rules.json` 中配置 `removeImports: ["import myUtil from '@/pages/common/myUtil';"]`，转换时自动删除。

### 3.5 消费者模式（`monthDataTab.tsx` / `unit/index.tsx`）

| 维度 | 旧版 | 新版 |
| --- | --- | --- |
| 配置复制 | `import cloneDeep from 'lodash'; const myConfig = cloneDeep(unitConfig);` | `const myConfig = { ...unitConfig };` |
| 字段分支 | `myConfig.costomer_toobar.unshift(...)` | `myConfig.customer_toolbar.unshift(...)` |
| 多列集 | `myConfig.grid_columns = myConfig.wm_grid_columns` + 改 `unit_key`/`export_key` | 改 `grid_columns` 即可，其它字段不再需要切换 |
| 工具栏下载 | `myConfig.toolbar_default.tssb_download = false` | `myConfig.toolbar_default.download = false` |

### 3.6 func.tsx 模式（`monthAdd` / `seasonAdd` / `yearAdd` 等表单）

| 维度 | 旧版 | 新版 |
| --- | --- | --- |
| 弹窗打开 | `DDAlert.open({ modalType: 'form', isFormContent: true, formContent: <Form.Item>...</Form.Item>, ...})` | config.tsx 中声明 `form_items: [{ name, label, type, ...rules }]` |
| 校验 | `rules: [{ required: true, message: '...' }, baseValidator.xxx]` 直接在 JSX | `rules: [{ type: 'base_required', message: '...' }]` 在 form_items 数组中声明 |
| 字段隐藏 | `{qxQys.cktsqylxDm === 'WM' ? false : <Form.Item .../>}` | `form_items` 中配 `hidden` 函数 + `Func.initAddForm` 钩子 |
| 取值回显 | `initFormContentValues: param.xgObj ? param.xgObj : {}` | `Func.initAddForm` / `Func.initEditForm` 钩子 |
| 提交 | `DDAlert.getForms().validateFields().then(values => ...)` | `Func.formBeforeSubmit` + 自动序列化 |

---

## 四、自动化转换工具

### 4.1 工具与文件结构

`scripts/` 文件夹包含 DDBunit2 config 转换工具的完整实现，约 900 行代码、3 个 JS/JSON 文件 + 14 套 fixtures（42 个文件）。

| 文件 | 行数 | 作用 |
| --- | --- | --- |
| [scripts/convert-ddbunit-config.js](../scripts/convert-ddbunit-config.js) | 720 | **主工具**，CLI 入口，含 `main()` 与 17 个工具函数 |
| [scripts/convert-ddbunit-config.rules.json](../scripts/convert-ddbunit-config.rules.json) | 40 | **默认规则**，含 prependImports / removeImports / renames / toolbarRenames / removes / header / route 7 段 |
| [scripts/test-convert-ddbunit-config.js](../scripts/test-convert-ddbunit-config.js) | 200+ | **测试运行器**，扫描 fixtures 跑 14 套 case（含 r9 路由生成 + r11 特殊字段 + r12/r13 默认节点 + r14 form_items TextArea fixture） |
| [scripts/__fixtures__/basic-rename.*](../scripts/__fixtures__/) | 3 文件 | 单元：4 处顶层 key 重命名 + preserve layout_type=tz |
| [scripts/__fixtures__/combo.*](../scripts/__fixtures__/) | 3 文件 | 单元：renames + removes + nested + prependImports 组合 |
| [scripts/__fixtures__/import-removal.*](../scripts/__fixtures__/) | 3 文件 | 单元：removeImports（myUtil 路径剥离） |
| [scripts/__fixtures__/multi-line-remove.*](../scripts/__fixtures__/) | 3 文件 | 单元：含尾随注释的多行块删除 |
| [scripts/__fixtures__/nested-rename.*](../scripts/__fixtures__/) | 3 文件 | 单元：`toolbar_default` 内嵌 `tssb_download` → `download` |
| [scripts/__fixtures__/page-generation.*](../scripts/__fixtures__/) | 3 文件 | 烟雾：触发页面生成路径 |
| [scripts/__fixtures__/route-generation.*](../scripts/__fixtures__/) | 3 文件 | 烟雾：触发路由追加路径 |

#### 4.1.1 `convert-ddbunit-config.js` 主工具（720 行）

CLI 入口，执行流程 8 步：
1. 解析 CLI 参数（`parseArgs`）
2. 派生 `--out`（`deriveDefaultOutPath`：去 `code_sample/` 前缀）
3. 派生 `--readme`（`deriveDefaultReadmePath`：与 --out 同目录、`.README.md` 后缀）
4. 派生 `--page`（`derivePagePaths`：去 `Config` 加 `Index`/`Fun` 后缀）
5. 加载规则 JSON（默认 `convert-ddbunit-config.rules.json`，可 `--rules` 覆盖）
6. 检测 config 变量名（`detectConfigVar`）
7. 执行 6 个转换（renames → toolbarRenames → removes → prependImports → removeImports → 生成 README → 生成 page → 追加 route）
8. 写出 + 打印摘要

主要函数分组（行号范围）：

- **路径派生**（lines 73-111）：3 个函数，自动从 CLI 派生
- **解析辅助**（lines 114-265）：`escapeRegExp` / `detectConfigVar` / `findAssignmentStart` / `findAssignmentEnd` / `skipTrailingCommentAndNewline` / `nestedRenameInBlock`
- **键操作**（lines 271-339）：`removeTopLevelKey` / `renameTopLevelKey` / `prependImports` / `removeImports`
- **路由生成**（lines 342-404）：`DEFAULT_NAME_MAPPING` / `buildRouteEntry` / `addRouteToCktsFile`
- **README 生成**（lines 407-498）：`generateReadme`
- **页面生成**（lines 501-528）：`generateIndexPage` / `generateFunPage`
- **主流程**（lines 531-720）：`main()`

#### 4.1.2 `convert-ddbunit-config.rules.json` 默认规则（40 行）

| 段 | 作用 |
| --- | --- |
| `prependImports` | 顶部插入的 import（如 `import CONSTANTS`） |
| `removeImports` | 顶部删除的 import（如 `import myUtil from '@/pages/common/myUtil'`） |
| `renames` | 顶层 key 重命名（如 `unit_key` → `module_key`） |
| `toolbarRenames` | `toolbar_default` 块内重命名（如 `tssb_download` → `download`） |
| `removes` | 顶层 key 删除（如 `wm_grid_columns`、`module_type`） |
| `header` | 生成 README 用的 referenceFile / protocolFile |
| `route` | 路由追加配置（enabled、cktsFile、nameMapping、pathTemplate） |

#### 4.1.3 `test-convert-ddbunit-config.js` 测试运行器（150 行）

扫描 `__fixtures__/` 下的 14 套 fixtures，每套跑一次：
- 默认 flag：`--no-readme --no-page --no-fun --no-route`（避免污染项目目录）
- 可选 `--readme` / `--rules`（按需覆盖）
- 工具产出写到 `__fixtures__/<name>.actual.tsx`（沙箱化，不污染项目）
- 与 `__fixtures__/<name>.expected.tsx` 做行级 diff
- 不一致 → exit 1；全部一致 → exit 0

#### 4.1.4 `__fixtures__/` 子文件夹约定

每套 fixture 包含 3 个文件（约定）：

| 后缀 | 角色 | 是否提交 |
| --- | --- | --- |
| `.input.tsx` | 测试输入（旧协议） | **是**（手写） |
| `.expected.tsx` | 期望输出（新协议） | **是**（手写，作为回归基准） |
| `.actual.tsx` | 实际输出 | **否**（测试运行时生成的调试产物） |

**额外可选**（本项目未使用）：
- `.README.expected.md` — 如有，测试运行器同时检查 README 生成
- `.rules.json` — 如有，测试运行器用该规则文件覆盖默认

**为何要 3 个文件？** 标准的"golden file"快照测试模式：
- `.input.tsx` → 工具 → `.actual.tsx`（机器生成）
- `.actual.tsx` === `.expected.tsx`（人工维护的基准） → PASS

`.actual.tsx` 是调试产物，留在 `__fixtures__/` 里供人工对比，但不作为基准。

**14 套 fixture 各自覆盖什么**（见 4.1 表格）。

#### 4.1.5 完整工具版本

工具当前稳定版为 **r14**（包含 r3 自动派生、r4 删除旧 import、r5 自动派生 page/fun、r6 自动追加 routes.ckts.ts、r7 render 函数自动转换、r8 日期格式归一化、r9 路由 path/component 从 outPath 派生、r10 路由 name 从源文件抽取、r11 特殊字段处理框架 + 规则 1、r12 默认节点 + 规则 2、r13 toolbar_default 多规则注册表、r14 form_items TextArea 项标准化）。

历史版本：
- r1：基础重命名/删除
- r2：自动派生 --out
- r3：自动派生 --readme + 动态标题
- r4：rules.removeImports 支持
- r5：自动派生 page/fun（后缀 basename 去掉 Config）
- r6：自动追加 routes.ckts.ts 子路由（按 path 幂等）
- r7：**render 函数形式自动转换** `(text) => myUtil.text.formatNum(text, '<fmt>')` → `{ type: 'number', format: '<fmt>' }`
- r8：**日期格式归一化** `format: 'yyyy-...'` → `format: 'YYYY-...'`（小写 yyyy = ISO week year，跨年周附近会偏差 1 年）
- r9：**路由 path/component 从 outPath 自动派生**（不再硬编码到 `hts/saasMdt/tuiShuiJiHua`）
- r10：**路由 name 从源文件抽取**（JSDoc title > grid_title > module_key），解决同 basename 路由的 name 冲突
- r11：**特殊字段处理框架 + 规则 1**（grid_columns 里 `title: '业务类型代码'` 自动补 `ellipsis: true`）
- r12：**默认节点 + 规则 2**（自动确保 `customer_toolbar` / `handle_columns` 存在；若 `toolbar_default.ckts_order = N` 则在 `customer_toolbar` 加 `序号重排` 项）
- r13：**toolbar_default 多规则注册表**（r12 重构 + 规则 3：`ckts_sum: true` → `小计` 项；后续加规则仅需 push 到 TOOLBAR_DEFAULT_RULES）
- r14：**form_items TextArea 项标准化**（autoSize → `{ minRows: 3, maxRows: 3 }`；layout → `CONSTANTS.DEFAULT_FORM_LAYOUT_100P_ROW`，bracket-depth 扫描容忍嵌套对象）

### 4.2 使用方法

**最简形式**（推荐）：
```bash
# 仅指定 --src；--out 和 --readme 都自动派生
node scripts/convert-ddbunit-config.js \
  --src code_sample/src/pages/hts/saasMdt/tuiShuiJiHua/yearDataConfig.tsx
```

自动产出：
- `src/pages/hts/saasMdt/tuiShuiJiHua/yearDataConfig.tsx`（config）
- `src/pages/hts/saasMdt/tuiShuiJiHua/yearDataConfig.README.md`（README）
- `src/pages/hts/saasMdt/tuiShuiJiHua/yearDataIndex.tsx`（index 页面）
- `src/pages/hts/saasMdt/tuiShuiJiHua/yearDataFun.tsx`（Func 对象）
- `config/routes/routes.ckts.ts` 追加一条子路由（"慧退税"父路由下）

**显式覆盖**（按需）：
```bash
# 自定义 --out 路径
node scripts/convert-ddbunit-config.js \
  --src code_sample/.../X.tsx \
  --out /tmp/X.tsx

# 自定义 --readme 路径（不再与 out 同目录）
node scripts/convert-ddbunit-config.js \
  --src code_sample/.../X.tsx \
  --readme /tmp/CUSTOM.README.md

# 禁用 README 生成
node scripts/convert-ddbunit-config.js \
  --src code_sample/.../X.tsx \
  --no-readme
```

**完整参数**：

| 参数 | 说明 |
| --- | --- |
| `--src <input.tsx>` | 源文件（**必需**） |
| `--out <output.tsx>` | 输出 config 路径，**默认自动派生**（去 `code_sample/` 前缀） |
| `--readme <output.README.md>` | README 路径，**默认自动派生**（与 out 同目录、`.README.md` 后缀） |
| `--no-readme` | **禁用** README 生成 |
| `--no-page` | **禁用** index + fun 页面生成 |
| `--no-fun` | **仅禁用** fun 页面（仍生成 index） |
| `--no-route` | **禁用** routes.ckts.ts 自动追加 |
| `--config-var <name>` | 显式指定 config 变量名（**默认自动检测**） |
| `--rules <rules.json>` | 自定义规则文件（**默认内置**） |

**测试命令**：
```bash
npm run test:convert-config    # 跑全部 14 套 fixtures
```

### 4.3 工具能力（r14 最终版）

- ✅ 顶层 key 重命名（`unit_key` → `module_key` 等）
- ✅ 嵌套 key 重命名（`toolbar_default.tssb_download` → `toolbar_default.download`，作用域限定）
- ✅ 顶层 key 删除（连同整段赋值 + 尾随内联注释 + 换行）
- ✅ **render 函数形式自动转换**（r7）：`(text) => myUtil.text.formatNum(text, '<fmt>')` → `{ type: 'number', format: '<fmt>' }`
- ✅ **日期格式归一化**（r8）：`format: 'yyyy-...'` → `format: 'YYYY-...'`（小写 yyyy = ISO week year，跨年周附近会偏差 1 年）
- ✅ **路由 path/component 从 outPath 自动派生**（r9）：源文件换目录时路由跟着走，不再硬编码到 `hts/saasMdt/tuiShuiJiHua`
- ✅ **路由 name 从源文件抽取**（r10）：按 JSDoc title > grid_title > module_key 优先级链；解决同 basename 路由的 name 冲突
- ✅ **特殊字段处理框架 + 规则 1**（r11）：`grid_columns` 里 `title: '业务类型代码'` 自动补 `ellipsis: true`；框架可扩展（push 到 `SPECIAL_FIELD_RULES` 即可加新规则）
- ✅ **默认节点 + toolbar_default 多规则注册表**（r12/r13）：自动确保 `customer_toolbar` / `handle_columns` 存在；遍历 `TOOLBAR_DEFAULT_RULES` 应用所有 toolbar_default → customer_toolbar 转换规则（`ckts_order → 序号重排`、`ckts_sum → 小计`）
- ✅ **form_items TextArea 项标准化**（r14）：autoSize → `{ minRows: 3, maxRows: 3 }`；layout → `CONSTANTS.DEFAULT_FORM_LAYOUT_100P_ROW`；bracket-depth 扫描容忍嵌套 `{}`（如 layout 嵌套对象）
- ✅ 自动检测 config 变量名（`const <name>: any = {};`）
- ✅ 前置 import 语句（已存在则跳过）
- ✅ **删除旧残留 import**（如 `import myUtil from '@/pages/common/myUtil';`，src/ 下不可解析）
- ✅ **自动派生 --out**：从 `code_sample/...` 去前缀为 `src/...`
- ✅ **自动派生 --readme**：与 --out 同目录、同基名（后缀 `.README.md`）
- ✅ **--no-readme 显式禁用** README
- ✅ **自动派生 --page**（index + fun）：与 --out 同目录，basename 去掉 `Config` 后缀后加 `Index` / `Fun`（再补 `.tsx` 扩展名）
- ✅ **--no-page 显式禁用** index + fun
- ✅ **--no-fun 显式禁用** 仅 fun（仍生成 index）
- ✅ **自动追加 routes.ckts.ts 子路由**：默认追加到"慧退税"父路由下，按 `path` 幂等查重
- ✅ **--no-route 显式禁用** 路由追加
- ✅ README 标题动态化（从输出文件名提取）
- ✅ 自动生成字段对比 README（含源/目标/参考/协议路径 + 顶层 key 映射表 + 详细变化 + r7/r8 转换计数）
- ✅ 幂等性：同一文件跑两次结果 byte-for-byte 一致

### 4.4 工具限制

- ❌ 不解析 `func.tsx`（表单 JSX → `form_items` 需手动）
- ❌ 不处理 `wm_grid_columns` 等多列集切换逻辑（需消费者代码侧处理）
- ❌ 不解析 `export_key` / `export_large` 的业务用途（需手动配 `api_excel_export`）
- ❌ 不解析 `render: (text) => myUtil.text.formatNum(...)` → 标准 `render: { type, format }`（r7 已自动处理，**不**再是限制）
- ❌ 不验证生成的 `form_items` 在标准 DDBunit2 中能正常工作（需端到端测试）
- ❌ routes.ckts.ts 路由追加**仅识别第一个 `routes: [` 数组**（不识别多个父路由）

---

## 五、检查清单

> 任何 config 转换完成后，逐项打勾。

### 5.1 顶层 key 必查

- [ ] `unit_key` 是否已改为 `module_key`
- [ ] `click_checked` 是否已改为 `grid_click_checked`
- [ ] `costomer_toobar` 是否已改为 `customer_toolbar`（拼写修正）
- [ ] `grid_show_data_num` 是否已改为 `toolbar_show_grid_checked_num`
- [ ] `toolbar_default.tssb_download` 是否已改为 `download`
- [ ] `wm_grid_columns` 是否已决定保留 / 迁移到消费者 / 删除
- [ ] `export_key` / `export_large` 是否已删除（并改配 `api_excel_export`）
- [ ] `module_type` 顶层 key 是否已删除（**任意值**都会被工具删）
- [ ] 顶部是否新增了 `import CONSTANTS from '@/components/DDAssist/constants';`
- [ ] 旧 `import myUtil from '@/pages/common/myUtil';` 是否已自动删除（工具默认处理）

### 5.2 列与筛选

- [ ] `grid_columns` 各项字段是否全部命中 `DDBunit2Config` 中 `grid_columns` 元素类型
- [ ] `filter_items` 各项字段是否全部命中 `filter_items` 元素类型
- [ ] `children`（分组列）是否仍按 `[{ title, dataIndex, children: [...] }]` 结构

### 5.3 消费者侧（`xxxTab.tsx` / `index.tsx`）

- [ ] `cloneDeep` 是否已改为 spread `{ ...unitConfig }`
- [ ] `costomer_toobar` 引用是否已改为 `customer_toolbar`
- [ ] `unit_key` 写入是否已改为 `module_key`
- [ ] `tssb_download` 写入是否已改为 `download`

### 5.4 func.tsx 侧（如本期未迁移则跳过）

- [ ] `DDAlert.open({ isFormContent: true, formContent: <Form.Item>... })` 是否已迁移
- [ ] `initFormContentValues` 是否已迁移到 `Func.initAddForm` / `Func.initEditForm`
- [ ] `qxQys.cktsqylxDm === 'WM'` 等条件分支是否已迁移到 `form_items.hidden`

### 5.5 工具与测试

- [ ] 工具运行后无报错（exit 0）
- [ ] 工具跑同一文件两次输出完全一致（幂等性）
- [ ] 生成的 README 顶部含源/目标/参考/协议路径
- [ ] README 标题与输出 config 文件名一致（动态生成）
- [ ] README 与 config 在**同一文件夹**（默认派生）
- [ ] `npm run test:convert-config` 全部通过（**预期 14/14**）

---

## 六、本批次具体转换记录

### 6.1 月度退税计划（`monthDataConfig`）

- 源：`code_sample/src/pages/hts/saasMdt/tuiShuiJiHua/monthDataConfig.tsx`
- 目标：[src/pages/hts/saasMdt/tuiShuiJiHua/monthDataConfig.tsx](../src/pages/hts/saasMdt/tuiShuiJiHua/monthDataConfig.tsx)
- README：[src/pages/hts/saasMdt/tuiShuiJiHua/monthDataConfig.README.md](../src/pages/hts/saasMdt/tuiShuiJiHua/monthDataConfig.README.md)
- 页面：[src/pages/hts/saasMdt/tuiShuiJiHua/monthDataIndex.tsx](../src/pages/hts/saasMdt/tuiShuiJiHua/monthDataIndex.tsx)
- Func：[src/pages/hts/saasMdt/tuiShuiJiHua/monthDataFun.tsx](../src/pages/hts/saasMdt/tuiShuiJiHua/monthDataFun.tsx)
- 转换时间：2026-06-03
- 工具版本：`scripts/convert-ddbunit-config.js` (r6 - 当前稳定版)
- 关键决策：
  - `wm_grid_columns` 整块删除（用户确认"只保留 grid_columns"）
  - `layout_type: 'tz'` 字面值保留（待消费者端验证）
  - `func.tsx` 未迁移（用户确认本期仅改 config）
- 验证状态：✅ 10/10 fixture 测试通过，工具实跑无报错

### 6.2 季度退税计划（`seasonDataConfig`）

- 源：`code_sample/src/pages/hts/saasMdt/tuiShuiJiHua/seasonDataConfig.tsx`
- 目标：[src/pages/hts/saasMdt/tuiShuiJiHua/seasonDataConfig.tsx](../src/pages/hts/saasMdt/tuiShuiJiHua/seasonDataConfig.tsx)
- README：[src/pages/hts/saasMdt/tuiShuiJiHua/seasonDataConfig.README.md](../src/pages/hts/saasMdt/tuiShuiJiHua/seasonDataConfig.README.md)
- 页面：[src/pages/hts/saasMdt/tuiShuiJiHua/seasonDataIndex.tsx](../src/pages/hts/saasMdt/tuiShuiJiHua/seasonDataIndex.tsx)
- Func：[src/pages/hts/saasMdt/tuiShuiJiHua/seasonDataFun.tsx](../src/pages/hts/saasMdt/tuiShuiJiHua/seasonDataFun.tsx)
- 转换时间：2026-06-03
- 工具版本：`scripts/convert-ddbunit-config.js` (r6 - 当前稳定版)
- 关键决策：
  - **自动派生目标路径**：未传 `--out`，工具自动从 `code_sample/...` 派生为 `src/...`（去掉 `code_sample/` 前缀）
  - **工具规则清理**：`rules.json` 中冗余的 `header.sourceFile/targetFile` 字段已删除；保留 `header.referenceFile/protocolFile`
  - **README 标题动态化**：从 `outFile` 路径自动提取文件名（之前硬编码为 "monthDataConfig"）
  - **手动调整**（采用方案 B）：
    1. 删除 `import myUtil from '@/pages/common/myUtil';`（旧路径，在 src/ 下不可解析）
    2. 将 3 列的 `render: (text) => myUtil.text.formatNum(text, '0,0.00')` 改为标准 `{ type: 'number', format: '0,0.00' }`（生产版 3 个数字列：jhytse1 / sjytse1 / jhytse1ye；wm 块已被工具删除无需改）
  - **特殊处理**：
    - 源中 `// seasonConfig.export_key = '...'` 是注释行，工具不处理，**原样保留**（业务历史记录）
    - 工具实际删除 3 个 key 而非 4 个（`export_key` 已被注释，工具不识别）
- 验证状态：✅ 4/4 fixture 测试通过，工具实跑无报错

### 6.3 年度退税计划（`yearDataConfig`）

- 源：`code_sample/src/pages/hts/saasMdt/tuiShuiJiHua/yearDataConfig.tsx`
- 目标：[src/pages/hts/saasMdt/tuiShuiJiHua/yearDataConfig.tsx](../src/pages/hts/saasMdt/tuiShuiJiHua/yearDataConfig.tsx)
- README：[src/pages/hts/saasMdt/tuiShuiJiHua/yearDataConfig.README.md](../src/pages/hts/saasMdt/tuiShuiJiHua/yearDataConfig.README.md)
- 页面：[src/pages/hts/saasMdt/tuiShuiJiHua/yearDataIndex.tsx](../src/pages/hts/saasMdt/tuiShuiJiHua/yearDataIndex.tsx)
- Func：[src/pages/hts/saasMdt/tuiShuiJiHua/yearDataFun.tsx](../src/pages/hts/saasMdt/tuiShuiJiHua/yearDataFun.tsx)
- 转换时间：2026-06-03
- 工具版本：`scripts/convert-ddbunit-config.js` (r6 - 当前稳定版)
- 状态：⏳ 待用户决定是否纳入正式批次（手动调整 render 函数未做，路由未注册）

### 6.4 工具增强 r3（2026-06-03）

**背景**：用户反馈"输出路径与输入路径自动填充"应同样适用于 README。

**变更**：
- 新增 `deriveDefaultReadmePath(outPath)`：与 out 同目录、同基名（后缀 `.README.md`）
- 新增 `--no-readme` 标志：显式禁用 README
- README 标题改为完全动态（不再硬编码 "monthDataConfig"）
- README "后续工作" 改为通用占位（不再硬编码 `monthAdd`/`monthDataTab`）
- 测试运行器默认传 `--no-readme` 避免 fixture 目录产生垃圾

**端到端验证**：
```bash
$ node scripts/convert-ddbunit-config.js --src code_sample/.../yearDataConfig.tsx
[convert] 自动派生目标路径: src/.../yearDataConfig.tsx
[convert] 自动派生 README 路径: src\...\yearDataConfig.README.md
[convert] config 变量名: yearConfig
[convert] 已写出: src/.../yearDataConfig.tsx
[convert] 已生成 README: src\...\yearDataConfig.README.md
[convert] 摘要: 重命名 4 个顶层 key, 重命名 1 个嵌套 key, 删除 3 个 key, 新增 1 个 import
```

输出：✅ config 与 README 同目录、同基名。

### 6.5 工具增强 r4（2026-06-03）

**背景**：用户反馈"src/pages/hts/saasMdt/tuiShuiJiHua/yearDataConfig.tsx 会报错，因 import myUtil 残留"。season 和 year 文件的旧 `import myUtil from '@/pages/common/myUtil';` 在 src/ 项目下路径不可解析，需在工具生成时自动删除。

**变更**：
- `rules.json` 新增 `removeImports` 字段（默认包含 `import myUtil from '@/pages/common/myUtil';`）
- 工具新增 `removeImports(content, patterns)`：匹配整行 import 语句并删除
- 转换流程中新增"4.5 删除旧 import"步骤（在 prependImports 之后）

**端到端验证**：
```bash
$ node scripts/convert-ddbunit-config.js --src code_sample/.../yearDataConfig.tsx
# 输出 yearDataConfig.tsx 顶部：
/**
 * title: 退税计划-月度
 */
import CONSTANTS from '@/components/DDAssist/constants';
const yearConfig: any = {};
# ✅ 旧 import myUtil 已自动删除
```

**新增 fixture**：
- `scripts/__fixtures__/import-removal.input.tsx` 含 myUtil 旧 import
- `scripts/__fixtures__/import-removal.expected.tsx` 验证删除 + 保留其它 import
- `npm run test:convert-config` → 5/5 通过

### 6.6 工具增强 r5（2026-06-03）

**背景**：用户希望工具在生成 config 同时同步生成入口页面（index）和 Func 文件（fun），参照 [src/pages/example/json_page/unit3/index.tsx](../src/pages/example/json_page/unit3/index.tsx) + [src/pages/example/json_page/unit3/f.tsx](../src/pages/example/json_page/unit3/f.tsx)。命名规则：basename 去掉 `Config` 后缀后加 `Index` / `Fun`，再补 `.tsx` 扩展名（例：`monthDataConfig.tsx` → `monthDataIndex.tsx` + `monthDataFun.tsx`）。

**变更**：
- 新增 `derivePagePaths(outPath)`：basename 去掉 `Config` 后缀（若存在），加 `Index` / `Fun` 后缀和 `.tsx` 扩展名
- 新增 `generateIndexPage({ configImportName, funImportName })`：参照 unit3 模板生成入口页面
- 新增 `generateFunPage()`：参照 unit3 模板生成最小 Func 对象（含 `refUnit: React.createRef()`）
- 新增 CLI flag `--no-page`（同时禁用 index + fun）、`--no-fun`（仅禁用 fun）
- 转换流程中新增"7. 生成 index/fun 页面"步骤（在 README 之后）
- 测试运行器默认加 `--no-page --no-fun` 避免 fixture 目录污染

**端到端验证**（使用已生成的 3 个 config 跑工具）：

```bash
$ node scripts/convert-ddbunit-config.js --src code_sample/.../monthDataConfig.tsx
[convert] 自动派生目标路径: src/.../monthDataConfig.tsx
[convert] 自动派生 README 路径: src\...\monthDataConfig.README.md
[convert] 自动派生 page 路径: index=src\...\monthDataIndex.tsx, fun=src\...\monthDataFun.tsx
[convert] 已写出: src/.../monthDataConfig.tsx
[convert] 已生成 README: src\...\monthDataConfig.README.md
[convert] 已生成 index 页面: src\...\monthDataIndex.tsx
[convert] 已生成 fun 页面: src\...\monthDataFun.tsx
```

`src/pages/hts/saasMdt/tuiShuiJiHua/` 目录最终内容（按字典序自然分组）：
```
monthDataConfig.README.md
monthDataConfig.tsx
monthDataFun.tsx
monthDataIndex.tsx
seasonDataConfig.README.md
seasonDataConfig.tsx
seasonDataFun.tsx
seasonDataIndex.tsx
yearDataConfig.README.md
yearDataConfig.tsx
yearDataFun.tsx
yearDataIndex.tsx
```

**新增 fixture**：
- `scripts/__fixtures__/page-generation.input.tsx`
- `scripts/__fixtures__/page-generation.expected.tsx`
- `npm run test:convert-config` → 6/6 通过

**幂等性验证**：
- 备份 3 个 config 后跑工具
- 跑完后 `diff` 备份与生成结果：3/3 byte-for-byte 一致
- 说明：手动调整过的 config 文件不会被工具覆盖破坏

### 6.7 工具增强 r6（2026-06-03）

**背景**：用户希望在工具生成 config + index + fun 的同时，自动在 `config/routes/routes.ckts.ts` 的"慧退税"父路由下追加一条子路由，使生成的页面能立即在系统中访问。

**命名约定**（与用户确认）：
- `name`（中文显示名）：先查 `rules.nameMapping[basename]`，再查内置默认表（`monthData→月度计划`、`seasonData→季度计划`、`yearData→年度计划`），最后用 basename 兜底
- `path`：去掉 config 文件名的 `Config` 后缀，按 `pathTemplate` 渲染（默认 `/hts/saasMdt/tuiShuiJiHua/{basename}`）
- `component`：与 fun 文件同 basename + `Index`（如 `./hts/saasMdt/tuiShuiJiHua/monthDataIndex`）
- **幂等**：按 `path` 查重，已存在则跳过

**变更**：
- 工具新增 `buildRouteEntry({ configImportName, nameMapping, pathTemplate })`：构造路由条目
- 工具新增 `addRouteToCktsFile({ cktsFile, newEntry })`：在第一个 `routes: [` 数组中追加子路由，按 `path` 幂等
- `rules.json` 新增 `route` 段（`enabled`、`cktsFile`、`nameMapping`、`pathTemplate`）
- 新增 CLI flag `--no-route`（显式禁用）
- 测试运行器默认加 `--no-route` 避免污染 `config/routes/routes.ckts.ts`

**端到端验证**（使用已生成的 3 个 config 跑工具）：

```bash
# 备份
cp config/routes/routes.ckts.ts /tmp/_backup_routes.ckts.ts

# 跑 3 个 config
$ node scripts/convert-ddbunit-config.js --src code_sample/.../monthDataConfig.tsx
[convert] 已追加路由: name=月度计划, path=/hts/saasMdt/tuiShuiJiHua/monthData
$ node scripts/convert-ddbunit-config.js --src code_sample/.../seasonDataConfig.tsx
[convert] 已追加路由: name=季度计划, path=/hts/saasMdt/tuiShuiJiHua/seasonData
$ node scripts/convert-ddbunit-config.js --src code_sample/.../yearDataConfig.tsx
[convert] 已追加路由: name=年度计划, path=/hts/saasMdt/tuiShuiJiHua/yearData

# 重复跑同一 config（验证幂等）
$ node scripts/convert-ddbunit-config.js --src code_sample/.../monthDataConfig.tsx
[convert] 路由已存在，跳过: name=月度计划
```

`config/routes/routes.ckts.ts` 转换后内容：
```ts
export default [
  { name: '慧退税', icon: 'CodeOutlined', path: '/hts', routes: [
    { name: '月度计划', path: '/hts/saasMdt/tuiShuiJiHua/monthData', component: './hts/saasMdt/tuiShuiJiHua/monthDataIndex' },
    { name: '季度计划', path: '/hts/saasMdt/tuiShuiJiHua/seasonData', component: './hts/saasMdt/tuiShuiJiHua/seasonDataIndex' },
    { name: '年度计划', path: '/hts/saasMdt/tuiShuiJiHua/yearData', component: './hts/saasMdt/tuiShuiJiHua/yearDataIndex' },
  ]},
];
```

**新增 fixture**：
- `scripts/__fixtures__/route-generation.input.tsx`
- `scripts/__fixtures__/route-generation.expected.tsx`
- `npm run test:convert-config` → 14/14 通过

**已知限制**：
- 工具仅识别第一个 `routes: [` 数组（不识别多父路由场景）。如有多父路由需求，需后续扩展为 `parentMatch` 精确匹配。

---

### 6.8 工具增强 r7（2026-06-04）

**背景**：season/year 的产物里 3 个数字列仍是 `render: (text: any) => (myUtil.text.formatNum(text, '0,0.00'))` 形式，与 month 的 `render: { type: 'number', format: '0,0.00' }` 不一致；且 `removeImports` 删了 `import myUtil` 后这些调用变成悬空引用，运行时会报 `myUtil is not defined`。旧版 r6 把这步标注为"需手动调整"且 6.2/6.3 实际未完成，因此补上 r7 自动化。

**变更**：
- `convert-ddbunit-config.js` 新增 `transformRenderFunctions(content)`：正则匹配 `render: (text: any) => (myUtil.text.formatNum(text, '<format>'))`，替换为 `render: { type: 'number', format: '<format>' }`
- 主流程新增"步骤 4.6：转换 render 函数形式"（在删除 key 之后、前置 import 之前）
- README 模板新增"render 函数形式转换（r7）"段落，摘要日志新增"转换 N 处 render 函数"
- 新增 fixture `scripts/__fixtures__/render-transform.*`：覆盖 `'0,0.00'` / `'0,0'` / `'0.00%'` 三种 format + 已存在 `{ type: 'date' }` 不受影响

**正则规则**（容忍差异）：
- `render` 与 `:` 之间的空格
- 参数类型注解：`any` / `string` / `number` / 缺省
- 外层括号：可有可无
- 引号：单/双

**端到端验证**：
```bash
$ node scripts/convert-ddbunit-config.js --src code_sample/.../seasonDataConfig.tsx
[convert] config 变量名: seasonConfig
[convert] r7: 转换 3 处 render 函数形式
[convert] 已写出: src/.../seasonDataConfig.tsx
[convert] 摘要: 重命名 4 个顶层 key, 重命名 1 个嵌套 key, 删除 3 个 key, 转换 3 处 render 函数, 新增 1 个 import

$ node scripts/convert-ddbunit-config.js --src code_sample/.../yearDataConfig.tsx
[convert] config 变量名: yearConfig
[convert] r7: 转换 3 处 render 函数形式
[convert] 已写出: src/.../yearDataConfig.tsx
[convert] 摘要: 重命名 4 个顶层 key, 重命名 1 个嵌套 key, 删除 3 个 key, 转换 3 处 render 函数, 新增 1 个 import
```

**fixture 验证**：
```bash
$ npm run test:convert-config
[PASS] basic-rename
[PASS] combo
[PASS] import-removal
[PASS] multi-line-remove
[PASS] nested-rename
[PASS] page-generation
[PASS] render-transform     ← 新增
[PASS] route-generation
========== 8/8 通过 ==========
```

**产物对比**：

| 文件 | 转换前 | 转换后 |
| --- | --- | --- |
| `seasonDataConfig.tsx:21-23` | `render: (text) => myUtil.text.formatNum(text, '0,0.00')` | `render: { type: 'number', format: '0,0.00' }` |
| `yearDataConfig.tsx:20-22` | 同上 | 同上 |

**JSDoc 标题**：工具不处理 JSDoc 注释；源文件 `code_sample/.../seasonDataConfig.tsx` 和 `yearDataConfig.tsx` 顶部 JSDoc 都误写为 `退税计划-月度`，已在产物中手动修正为"季度"/"年度"。后续如需自动化，可在工具中加 `rules.titleMapping`（待用）。

**已知限制**（r7 仍不处理）：
- 任意 JSX / antd 组件形式的 render（如 `render: (text) => <Tag>{text}</Tag>`）原样保留
- `myUtil.text.formatNum` 之外的工具函数（如 `myUtil.date.format`）原样保留
- `format` 参数动态拼接的情况（如 `format: \`0,0.0${len}\``）原样保留

---

### 6.9 工具增强 r8（2026-06-04）

**背景**：month/season/year 3 个 config 产物里 `render: { type: 'date', format: 'yyyy-MM-DD HH:mm:ss' }` 用的是**小写** `yyyy`。在 dayjs / moment 里小写 `yyyy` 表示"ISO week year"（按周计算的年份），跨年周附近会偏差 1 年；项目 CLAUDE.md 已明确统一使用 `dayjs('YYYY-MM-DD')`（大写 YYYY = 日历年）。之前用手动替换改产物，下次重跑工具会被源文件覆盖回去，必须让工具自动归一化。

**变更**：
- `convert-ddbunit-config.js` 新增 `normalizeDateFormats(content)`：正则匹配 `format: '...'` / `format: "..."` 字符串字面量，把里面的 `yyyy` 全部替换为 `YYYY`
- 主流程新增"步骤 4.7：归一化日期格式"（在 r7 render 转换之后、前置 import 之前）
- README 模板新增"日期格式归一化（r8）"段落，摘要日志新增"归一化 N 处日期格式"
- 新增 fixture `scripts/__fixtures__/date-format-normalize.*`：覆盖单引号/双引号/多种格式/已正确/数字格式/`baseValidator.yyyy` 标识符不误伤
- 同步更新 `render-transform.expected.tsx`：原 fixture 第 12 行的 `format: 'yyyy-MM-DD'` 已被 r8 改写为 `format: 'YYYY-MM-DD'`

**正则规则**（保守作用域）：
- 仅匹配 `format: '<...>'` / `format: "<...>"` 字符串字面量
- 字符串内**所有** `yyyy` 全部替换为 `YYYY`（容忍一个 format 串里出现多次 `yyyy`）
- **不触及**标识符（如 `baseValidator.yyyy` / `baseValidator.yyyyMM`）— 这些是函数/变量名，与日期格式无关
- **不触及**JSX 注释 / 字符串以外的场景
- 容忍差异：`format` 与 `:` 之间的空格、引号（单/双）

**端到端验证**：
```bash
$ node scripts/convert-ddbunit-config.js --src code_sample/.../seasonDataConfig.tsx
[convert] config 变量名: seasonConfig
[convert] r7: 转换 3 处 render 函数形式
[convert] r8: 归一化 2 处日期格式 (yyyy → YYYY)
[convert] 摘要: 重命名 4 个顶层 key, 重命名 1 个嵌套 key, 删除 3 个 key, 转换 3 处 render 函数, 归一化 2 处日期格式, 新增 1 个 import
```

**fixture 验证**：
```bash
$ npm run test:convert-config
[PASS] basic-rename
[PASS] combo
[PASS] date-format-normalize     ← 新增
[PASS] import-removal
[PASS] multi-line-remove
[PASS] nested-rename
[PASS] page-generation
[PASS] render-transform
[PASS] route-generation
========== 9/9 通过 ==========
```

**产物对比**：

| 文件 | 转换前（源） | 转换后（产物） |
| --- | --- | --- |
| `seasonDataConfig.tsx:26,28` | `format: 'yyyy-MM-DD HH:mm:ss'` | `format: 'YYYY-MM-DD HH:mm:ss'` |
| `yearDataConfig.tsx:25,27` | 同上 | 同上 |
| `monthDataConfig.tsx:36,38` | 同上 | 同上 |

**fixture 测试矩阵**（`date-format-normalize.expected.tsx`）：

| 场景 | 行为 |
| --- | --- |
| `'yyyy-MM-DD HH:mm:ss'`（单引号） | → `'YYYY-MM-DD HH:mm:ss'` ✅ |
| `'yyyy-MM-DD'`（短格式） | → `'YYYY-MM-DD'` ✅ |
| `'YYYY-MM-DD HH:mm:ss'`（已正确） | 不动 ✅ |
| `"yyyy/MM/dd"`（双引号） | → `"YYYY/MM/dd"` ✅ |
| `render: (text) => myUtil.text.formatNum(text, '0,0.00')` | r7 转换 + r8 不动 number format ✅ |
| `baseValidator.yyyy` / `baseValidator.yyyyMM`（标识符） | 不动 ✅ |

**已知限制**（r8 仍不处理）：
- format 字符串以外的 `yyyy` 标识符（如变量名 `myYyyyField`）原样保留 — 这是预期行为，因为只有日期 format 字符串里的小写 yyyy 才有歧义
- 其它与日期相关的格式细节（如 `dd` vs `DD`、`MM` vs `mm`）不归一化
- 已用大写 `YYYY` 的产物重跑后保持不变（幂等性）

---

### 6.10 工具增强 r9（2026-06-04）

**背景**：用户跑命令 `node scripts/convert-ddbunit-config.js --src code_sample/src/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TSSB_GCB/auto_config.tsx`，工具把路由写到了错误位置：`/hts/saasMdt/tuiShuiJiHua/auto_config`。根因是 `buildRouteEntry` 把 `path` 和 `component` 都硬编码为 `hts/saasMdt/tuiShuiJiHua`，没考虑源文件实际所在的父目录。修正：r9 让 path/component 从 `args.out` 的实际父目录自动派生。

**变更**：
- `convert-ddbunit-config.js` 新增 `deriveRouteFromOutPath(outPath, basename)`：取 outPath 父目录，统一为正斜杠，**剥到 `src/pages/` 首次出现处**（含该前缀），然后拼装 path 和 component
- `buildRouteEntry` 增加 `outPath` 参数；优先用新派生逻辑；`outPath` 不可派生时回退到 `pathTemplate` + 旧硬编码 component（向后兼容）
- 主流程调用点传入 `outPath: args.out`
- rules.json `route.pathTemplate` 段加 `_pathTemplateNote` 注释说明其仅为回退
- `config/routes/routes.ckts.ts:3` 已写入的错误 `auto_config` 路由手工修正
- 新增 fixture `scripts/__fixtures__/route-from-outpath.*`（input + expected.tsx + rules.json + expected.route.txt）
- 测试运行器支持新 fixture 类型（`expected.route.txt` + 自定义 cktsFile），并自动清理 `__src_layout__` 临时目录
- `.gitignore` 新增 `__src_layout__` 和 `__tmp_routes_ckts.ts` 忽略项

**派生规则**：

| outPath | basename | 派生 path | 派生 component |
| --- | --- | --- | --- |
| `src/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TSSB_GCB/auto_config.tsx` | `auto_config` | `/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TSSB_GCB/auto_config` | `./hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TSSB_GCB/auto_configIndex` |
| `src/pages/hts/saasMdt/tuiShuiJiHua/monthDataConfig.tsx` | `monthData` | `/hts/saasMdt/tuiShuiJiHua/monthData` | `./hts/saasMdt/tuiShuiJiHua/monthDataIndex` |
| `src/pages/hts/foo/bar/baz.tsx`（无 Config 后缀） | `baz` | `/hts/foo/bar/baz` | `./hts/foo/bar/bazIndex` |
| `scripts/__fixtures__/__src_layout__/src/pages/hts/foo/bar.tsx`（测试用 mock 路径） | `bar` | `/hts/foo/bar` | `./hts/foo/barIndex` |

**端到端验证**：
```bash
$ node scripts/convert-ddbunit-config.js --src code_sample/src/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TSSB_GCB/auto_config.tsx
[convert] 自动派生目标路径: src/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TSSB_GCB/auto_config.tsx
[convert] 已写出: src/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TSSB_GCB/auto_config.tsx
[convert] 路由已存在，跳过: name=auto_config     ← 因已手工修正，幂等性生效
```

`config/routes/routes.ckts.ts` 修正后内容：
```ts
{ name: 'auto_config', path: '/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TSSB_GCB/auto_config', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TSSB_GCB/auto_configIndex' },
```

**fixture 验证**：
```bash
$ npm run test:convert-config
[PASS] basic-rename
[PASS] combo
[PASS] date-format-normalize
[PASS] import-removal
[PASS] multi-line-remove
[PASS] nested-rename
[PASS] page-generation
[PASS] render-transform
[PASS] route-from-outpath     ← 新增
[PASS] route-generation
========== 10/10 通过 ==========
```

`route-from-outpath` fixture 工作机制：
- 4 个文件：`input.tsx`（最小 config）+ `expected.tsx`（含 import CONSTANTS 前置）+ `rules.json`（含 `route.cktsFile` 指向 fixtures 目录的临时 ckts 文件）+ `expected.route.txt`（期望的路由行）
- 测试运行器检测到 `expected.route.txt` 后：不传 `--no-route`、写入临时 `__tmp_routes_ckts.ts` 作为路由容器、用 fixture 的 `rules.json` 指定容器路径、最后在容器中查找期望路由行
- 跑完自动清理 `__tmp_routes_ckts.ts` 和 `__src_layout__` 目录

**已知限制**（r9 仍不处理）：
- 路由追加仍**仅识别第一个 `routes: [` 数组**（不识别多父路由场景）
- basename 中 URL 不安全字符（如 `#` `?`）原样拼接（项目内尚未出现此类 case）
- 多层 outPath 中含多个 `src/pages/` 段时，只剥到首次出现处

---

### 6.11 工具增强 r10（2026-06-04）

**背景**：两个不同父目录下的 `auto_config.tsx`（业务名同名但模块不同）跑工具后都生成了 `name: 'auto_config'` 路由，`config/routes/routes.ckts.ts` 出现两条同名路由，菜单无法区分。根因：`buildRouteEntry` 的 `name` 派生链 `nameMapping[basename] → DEFAULT → basename`，多个 `auto_config` 文件的 basename 一样且都没在 nameMapping 里，于是全部 `basename` 兜底成 `auto_config`。

**变更**：
- `convert-ddbunit-config.js` 新增 `extractRouteName(srcContent, configVar)`：按优先级链从源文件抽取显示名
- 新增 `extractField(content, configVar, fieldNames)`：通用字段字面量抽取工具
- `buildRouteEntry` 接受新参数 `nameOverride`，优先级链改为：
  ```
  nameOverride ?? nameMapping[basename] ?? DEFAULT_NAME_MAPPING[basename] ?? basename
  ```
- 主流程在 `buildRouteEntry` 调用点传入 `nameOverride: extractRouteName(srcContent, configVar)`
- `config/routes/routes.ckts.ts:3-4` 两条同名 `auto_config` 路由手工修正为各自 JSDoc title
- `route-from-outpath.expected.route.txt` 的 `name` 字段更新为源文件 JSDoc title（验证 r10 行为）

**抽取优先级**：

| 优先级 | 来源 | 适用文件 | 正则思路 |
| --- | --- | --- | --- |
| 1 | JSDoc `title: XXX` | 所有含 JSDoc 注释的源 | 在 `/** ... */` 块内匹配 `title:\s*([^*\n]+)`，trim |
| 2 | `<configVar>.grid_title = 'XXX'` | 含 grid_title 字段的源 | 转义 configVar 后用字面量正则 |
| 3 | `<configVar>.module_key = 'XXX'` 或 `.unit_key = 'XXX'` | 旧协议 `unit_key` / 新协议 `module_key` | 同时匹配两个 key 名（module_key 优先） |
| 4 | 返 null | 全部 | 由 `buildRouteEntry` 走原 nameMapping → DEFAULT → basename 链 |

**典型案例**（用户实际场景）：

源文件 1：`code_sample/src/pages/hts/dditax.ckts.from/MDT_TSZL___ZXSB_SB_HGSPTZ_GCB/auto_config.tsx`
```ts
/**
 * title: 商品码调整
 * ...
*/
const unitConfig: any = {};
unitConfig.unit_key = 'TSZL_ZXSB_SB_HGSPTZ_G';
unitConfig.grid_title = '海关商品编码、名称、退税率调整';
```
→ 派生 name = `商品码调整`（来自 JSDoc title）

源文件 2：`code_sample/src/pages/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TSSB_GCB/auto_config.tsx`
```ts
/**
 * title: 生产企业出口货物劳务免抵退税申报明细
 * ...
*/
const unitConfig: any = {};
unitConfig.unit_key = 'MDT_ZXSB_SB_MDT_TSSB_G';
unitConfig.grid_title = '生产企业出口货物及修理修配服务免抵退税申报明细';
```
→ 派生 name = `生产企业出口货物劳务免抵退税申报明细`（来自 JSDoc title）

**端到端验证**：
```bash
$ node scripts/convert-ddbunit-config.js --src code_sample/.../MDT_TSZL___ZXSB_SB_HGSPTZ_GCB/auto_config.tsx
[convert] 路由已存在，跳过: name=商品码调整

$ node scripts/convert-ddbunit-config.js --src code_sample/.../MDT___ZXSB_SB_MDT_TSSB_GCB/auto_config.tsx
[convert] 路由已存在，跳过: name=生产企业出口货物劳务免抵退税申报明细
```

`config/routes/routes.ckts.ts` 修正后内容：
```ts
{ name: '商品码调整', path: '/hts/dditax.ckts.from/MDT_TSZL___ZXSB_SB_HGSPTZ_GCB/auto_config', component: './hts/dditax.ckts.from/MDT_TSZL___ZXSB_SB_HGSPTZ_GCB/auto_configIndex' },
{ name: '生产企业出口货物劳务免抵退税申报明细', path: '/hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TSSB_GCB/auto_config', component: './hts/dditax.ckts.from/MDT___ZXSB_SB_MDT_TSSB_GCB/auto_configIndex' },
```

**fixture 验证**：
```bash
$ npm run test:convert-config
[PASS] basic-rename
[PASS] combo
[PASS] date-format-normalize
[PASS] import-removal
[PASS] multi-line-remove
[PASS] nested-rename
[PASS] page-generation
[PASS] render-transform
[PASS] route-from-outpath     ← name 来自 JSDoc title（验证 r10）
[PASS] route-generation
========== 10/10 通过 ==========
```

`route-from-outpath` fixture 工作机制（r10 升级）：
- `input.tsx` 顶部 JSDoc 注释 `/** title: route-from-outpath 测试 - 验证 r9 路由从 outPath 派生 */`
- `expected.route.txt` 期望 name 字段 = JSDoc title 完整字符串
- 工具提取 JSDoc title 后，生成的路由条目 name 与期望一致 ✅

**已知限制**（r10 仍不处理）：
- JSDoc title 写错（如 `tite:` 笔误）→ 跳过该项，继续尝试 grid_title
- `grid_title` 值含转义引号（`'It\\'s ok'`）→ 简单正则不处理，跳过该项
- 旧 `unit_key` 和新 `module_key` 同时存在 → 优先取 `module_key`（数组顺序）
- 同名冲突已写入的文件：r10 不会**更新**已存在路由的 name（仅按 path 幂等跳过）。需要手工修正已有错误条目

---

### 6.12 工具增强 r11（2026-06-05）

**背景**：源文件 `code_sample/.../MDT___ZXSB_SB_MDT_TSSB_GCB/auto_config.tsx` 的 `grid_columns` 里 `业务类型代码` 列**漏加**了 `ellipsis: true`，但同类列（`业务类型名称`、`国内启运方式名称`、`海关总署认证企业类型名称`、`备注`）都加了。手动补容易遗漏，且未来类似 case 还会出现。需要工具自动处理 + 框架可扩展。

**变更**：
- `convert-ddbunit-config.js` 新增**可扩展的"特殊字段处理"框架**：
  - 数组 `SPECIAL_FIELD_RULES`：规则注册表，每项 `{ name, apply }`
  - 函数 `applySpecialFieldRules(content, configVar)`：按数组顺序调用所有规则，统计总命中数
  - 函数 `addEllipsisForBusinessTypeCode(content, configVar)`：**规则 1** 实现
- 主流程新增"步骤 5.7 特殊字段处理"（在 5.5 removeImports 之后、6 写出之前）
- 摘要日志新增 "应用 N 处特殊字段规则"
- README 模板新增 "### 特殊字段处理（r11）" 段落
- 新增 fixture `scripts/__fixtures__/special-field-rule-ellipsis.*`（input + expected）
- 顶部 docstring 描述 r11 框架 + 规则 1

**规则 1 详细说明**：

- **目标数组**：仅 `<configVar>.grid_columns = [ ... ]` 块（按用户要求，不波及 `grid_columns_tj` / `wm_grid_columns` 等）
- **匹配模式**：`title: '业务类型代码'`（单/双引号都容忍）
- **行为**：列对象末尾补 `, ellipsis: true`（保留 `}` 前的空白）
- **幂等**：若列已含 `ellipsis:` 属性（任意值），跳过

**算法**（bracket-depth 定位 + regex 替换）：

```js
// 1) 找 <configVar>.grid_columns = [ 起点
const startRe = new RegExp(`${escapeRegExp(configVar)}\\.grid_columns\\s*=\\s*\\[`);
// 2) bracket-depth 扫描找匹配的 ]
// 3) 在该块内 regex 匹配列对象（保留 \s* 在 } 前）
const columnRe = /\{([^{}]*?title:\s*['"]业务类型代码['"][^{}]*?)(\s*)\}/g;
// 4) 替换：inner 末尾追加 ', ellipsis: true'，保留 \s* 让 `}` 前的空格不被吃掉
```

**框架扩展指引**：

加新规则只需 2 步：
1. 写一个函数 `(content, configVar) => ({ content, count })`
2. push 到 `SPECIAL_FIELD_RULES` 数组（指定 `name` 和 `apply`）

例（伪代码）：
```js
function addSomeOtherRule(content, configVar) {
  // ... 实现
  return { content, count: 1 };
}
SPECIAL_FIELD_RULES.push({ name: '某条规则', apply: addSomeOtherRule });
```

**端到端验证**：
```bash
$ node scripts/convert-ddbunit-config.js --src code_sample/.../MDT___ZXSB_SB_MDT_TSSB_GCB/auto_config.tsx
[convert] r8: 归一化 5 处日期格式 (yyyy → YYYY)
[convert] r11 业务类型代码列加 ellipsis: 命中 1 处
[convert] 摘要: ..., 应用 1 处特殊字段规则, 新增 1 个 import
```

**产物对比**（`src/.../auto_config.tsx`）：

| 位置 | 数组 | 源（无 ellipsis） | 产物（r11 后） |
| --- | --- | --- | --- |
| line 55 | `grid_columns` | `..., width: 130}` | `..., width: 130, ellipsis: true}` ✅ |
| line 97 | `grid_columns_tj` | `..., width: 130}` | `..., width: 130}` （**不**改）✅ |
| line 123 | `filter_items` | `name: 'cktmsywlxdmjh', label: '业务类型代码', ...` | 不变 ✅ |
| line 162 | `form_items` | `label: '业务类型代码', ...` | 不变 ✅ |

**fixture 验证**（`special-field-rule-ellipsis`）：

| 测试 case | 行为 |
| --- | --- |
| `title: '业务类型代码'` 无 ellipsis | 末尾加 `, ellipsis: true` ✅ |
| `title: '业务类型代码'` 已有 ellipsis | 幂等跳过 ✅ |
| `title: '业务类型名称'`（非目标标题） | 不动 ✅ |
| `grid_columns_tj` 内的 `业务类型代码` | 不动（规则仅作用于 `grid_columns`）✅ |
| 多字段顺序（如 `align: 'left', width: 130`） | 在末尾追加，保留 `align` 的位置 ✅ |

```bash
$ npm run test:convert-config
[PASS] basic-rename
[PASS] combo
[PASS] date-format-normalize
[PASS] import-removal
[PASS] multi-line-remove
[PASS] nested-rename
[PASS] page-generation
[PASS] render-transform
[PASS] route-from-outpath
[PASS] route-generation
[PASS] special-field-rule-ellipsis     ← 新增
========== 11/11 通过 ==========
```

**幂等性**：产物再跑一次工具，byte-for-byte 一致（`diff -q` 验证）。

**已知限制**（r11 仍不处理）：
- 列对象内有嵌套 `{}`（如 `render: { type: 'date', ... }`）→ 当前 `[^{}]*?` 不容忍嵌套 `{}`；会匹配不到。如有此 case，需在块内手动解析列对象边界
- 标题带前后空白 `title: '  业务类型代码  '` → 当前正则不容忍引号内空白；如需扩展为 `title:\s*['"]\s*业务类型代码\s*['"]`
- 规则硬编码在 `SPECIAL_FIELD_RULES` 数组（不通过 `rules.json` 配置）—— 简单可控；如未来需要可作为 r12+ 任务迁移到配置化

---

### 6.13 工具增强 r12（2026-06-05）

**背景**：源文件 `code_sample/.../MDT___ZXSB_SB_MDT_TSSB_GCB/auto_config.tsx` 和 `MDT_TSZL___ZXSB_SB_HGSPTZ_GCB/auto_config.tsx` 都有 `toolbar_default.ckts_order: 4`（旧协议私有字段），新 DDBunit2 协议下需要：
1. 把 `序号重排` 按钮**显式**注册到 `customer_toolbar`
2. 源文件没有 `customer_toolbar` / `handle_columns` 这两个新协议节点，工具产物也缺（`DDBunit2A.tsx:1515` 等运行时直接读 `myConfigNew.customer_toolbar` 会 undefined）

**复用 r11 框架**：仅 push 到 `SPECIAL_FIELD_RULES`，无主流程改动。

**变更**：
- `convert-ddbunit-config.js` 新增 3 个辅助函数：
  - `extractCktSOrderFromToolbarDefault(content, configVar)`：从 `toolbar_default = { ... }` 块内提 `ckts_order: N`
  - `insertBeforeExportDefault(content, insertion)`：在 `export default` 之前插入（无 `export default` 时 fallback 到文件末尾）
  - `appendEntryToCustomerToolbar(content, configVar, entry)`：在 `customer_toolbar` 数组开头追加 entry
- 新增规则函数 `ensureDefaultNodesAndXhcp(content, configVar)`
- push 到 `SPECIAL_FIELD_RULES`（规则 2）
- 顶部 docstring 加 r12 描述
- 新增 fixture `default-nodes-and-xhcp.*`（input + expected）
- 11 个旧 expected.tsx 文件同步加 `customer_toolbar = [];` + `handle_columns = [];`（r12 行为变化）

**规则 2 详细说明**：

| 子需求 | 行为 |
| --- | --- |
| 缺 `customer_toolbar` | 在 `export default` 之前插入 `[可能的序号重排项]` |
| 缺 `handle_columns` | 在 `export default` 之前插入 `[]` |
| 已有 `customer_toolbar` 但无 `序号重排` 项 | 追加到数组开头（保持原 entries 顺序） |
| 已有 `序号重排` 项 | 幂等跳过（不重复加） |
| 无 `toolbar_default.ckts_order` | `customer_toolbar = []`（不附加 序号重排 项） |
| 数值 0 / 负数 | 正则容忍，照常触发 |

**算法**：

```js
function ensureDefaultNodesAndXhcp(content, configVar) {
  let out = content;
  let count = 0;

  // 1) 提取 toolbar_default.ckts_order 值
  const orderN = extractCktSOrderFromToolbarDefault(out, configVar);
  const xhcpEntry = orderN !== null
    ? `{ name: '序号重排', key: 'xhcp_${orderN}', func: 'handleXhcp', param: ${orderN} }`
    : null;

  // 2) 幂等检查
  const hasXhcp = /name:\s*['"]序号重排['"]/.test(out);

  // 3) customer_toolbar
  if (!hasCustomerToolbarRe.test(out)) {
    const initial = xhcpEntry ? `[${xhcpEntry}]` : '[]';
    out = insertBeforeExportDefault(out, `${cv}.customer_toolbar = ${initial};\n`);
    count++;
  } else if (xhcpEntry && !hasXhcp) {
    out = appendEntryToCustomerToolbar(out, cv, xhcpEntry);
    count++;
  }

  // 4) handle_columns
  if (!hasHandleColumnsRe.test(out)) {
    out = insertBeforeExportDefault(out, `${cv}.handle_columns = [];\n`);
    count++;
  }

  return { content: out, count };
}
```

**端到端验证**（MDT TSSB）：

```bash
$ node scripts/convert-ddbunit-config.js --src code_sample/.../MDT___ZXSB_SB_MDT_TSSB_GCB/auto_config.tsx
[convert] r8: 归一化 5 处日期格式 (yyyy → YYYY)
[convert] r11 业务类型代码列加 ellipsis: 命中 1 处
[convert] r11 默认节点 + 序号重排: 命中 2 处
[convert] 摘要: ..., 应用 3 处特殊字段规则, 新增 1 个 import
```

`src/.../auto_config.tsx` 文件末尾（`export default` 之前）：

```ts
// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
  edit: false, delete: false,
};

unitConfig.customer_toolbar = [{ name: '序号重排', key: 'xhcp_4', func: 'handleXhcp', param: 4 }];
unitConfig.handle_columns = [];
export default unitConfig;
```

**fixture 验证**：

```bash
$ npm run test:convert-config
[PASS] basic-rename
[PASS] combo
[PASS] date-format-normalize
[PASS] default-nodes-and-xhcp     ← 新增
[PASS] import-removal
[PASS] multi-line-remove
[PASS] nested-rename
[PASS] page-generation
[PASS] render-transform
[PASS] route-from-outpath
[PASS] route-generation
[PASS] special-field-rule-ellipsis
========== 12/12 通过 ==========
```

**fixture 矩阵**（r12 行为完整覆盖）：

| 场景 | fixture | 期望 |
| --- | --- | --- |
| 源有 `ckts_order: 4`，无 `customer_toolbar`/`handle_columns` | `default-nodes-and-xhcp` | 加 2 节点；`customer_toolbar` 含 `序号重排` 项 |
| 源无 `ckts_order`（如 `date-format-normalize`） | `date-format-normalize` | 加 2 节点；`customer_toolbar = []`（无 `序号重排`） |
| 源已有 `customer_toolbar`（如 `basic-rename`） | `basic-rename` | 不重复加 `customer_toolbar`；仅加 `handle_columns` |
| 源 `export default` 前有 blank line | `combo` | 保留 blank line，新节点插在 `export default` 紧前 |

**已知限制**（r12 仍不处理）：
- `customer_toolbar` 数组中**已有** `序号重排` 但**参数不同**（如 `param: 2` vs `param: 4`）→ 不会更新旧 entry（按"name 一致即跳过"处理）。如有此需求，r13+ 任务可加"按 name+key 替换"逻辑
- `customer_toolbar` 中 `name: '序号重排'` 大小写不一致（如 `name: '序号重排 '` 带尾随空格）→ 当前 `name:\s*['"]序号重排['"]` 严格匹配，会被视为无此项而**重复加**。如需要可改为更宽松匹配
- `customer_toolbar` 中 `序号重排` 项如已是 `key: 'xhcp_<N>'` 但 `param` 不同 → 同上，幂等检查只看 name，不看其它字段

---

### 6.14 工具增强 r13（2026-06-05）

**背景**：源文件 `code_sample/.../MDT___ZXSB_SB_MDT_TSSB_GCB/auto_config.tsx:181` 有 `ckts_sum: true`（旧协议私有字段），新 DDBunit2 协议下需要把 `小计` 按钮**显式**注册到 `customer_toolbar`。与 r12 的 `序号重排` 规则同模式（同字段、同作用域），但触发条件不同。

**重构思路**：把 r12 的"单字段硬编码"重构为"通用 toolbar_default 规则注册表"，加新规则只需 push 数组。

**变更**：
- `convert-ddbunit-config.js` 新增 `TOOLBAR_DEFAULT_RULES` 常量数组（每项含 `fieldName` / `valueMatcher` / `buildEntry` / `name`）
- `extractCktSOrderFromToolbarDefault` 重构为通用 `extractFieldFromToolbarDefault(content, configVar, fieldName, valueMatcher)`
- `ensureDefaultNodesAndXhcp` 重命名 + 扩展为 `ensureDefaultNodesAndToolbarRules`（遍历 TOOLBAR_DEFAULT_RULES 应用所有规则）
- `SPECIAL_FIELD_RULES` 注册名从 "默认节点 + 序号重排" 改为 "默认节点 + toolbar_default 规则"
- 顶部 docstring 补充 r13 描述
- 新增 fixture `toolbar-ckts-sum.*`（input + expected）
- 11 个旧 expected.tsx 同步加 `customer_toolbar = [];` + `handle_columns = [];`（r12 行为变化，与 r13 无冲突）

**TOOLBAR_DEFAULT_RULES 注册表**：

```js
const TOOLBAR_DEFAULT_RULES = [
  {
    name: '序号重排',
    fieldName: 'ckts_order',
    valueMatcher: /ckts_order\s*:\s*(-?\d+(?:\.\d+)?)/,
    buildEntry: (valueN) =>
      `{ name: '序号重排', key: 'xhcp_${valueN}', func: 'handleXhcp', param: ${valueN} }`,
  },
  {
    name: '小计',
    fieldName: 'ckts_sum',
    valueMatcher: /ckts_sum\s*:\s*true/,
    buildEntry: () =>
      `{ name: '小计', key: 'xj', func: 'handleXj' }`,
  },
  // 未来加：ckts_download / ckts_upload / ...
];
```

**算法**：

```js
function ensureDefaultNodesAndToolbarRules(content, configVar) {
  // 1) 收集所有规则命中的 entries
  const entries = [];
  for (const rule of TOOLBAR_DEFAULT_RULES) {
    const value = extractFieldFromToolbarDefault(out, configVar, rule.fieldName, rule.valueMatcher);
    if (value === null) continue;
    const entry = rule.buildEntry(value);
    // 幂等检查：customer_toolbar 中是否已有 name: '<rule.name>' 项
    if (nameRegex.test(out)) continue;
    entries.push(entry);
  }

  // 2) 处理 customer_toolbar
  if (!hasCustomerToolbarRe.test(out)) {
    const initial = entries.length > 0 ? `[${entries.join(',')}]` : '[]';
    out = insertBeforeExportDefault(out, `${cv}.customer_toolbar = ${initial};\n`);
  } else {
    for (const entry of entries) {
      out = appendEntryToCustomerToolbar(out, cv, entry);
    }
  }

  // 3) 处理 handle_columns
  if (!hasHandleColumnsRe.test(out)) {
    out = insertBeforeExportDefault(out, `${cv}.handle_columns = [];\n`);
  }
}
```

**端到端验证 1**：MDT TSSB（`ckts_sum: true`）

```bash
$ node scripts/convert-ddbunit-config.js --src code_sample/.../MDT___ZXSB_SB_MDT_TSSB_GCB/auto_config.tsx
[convert] r8: 归一化 5 处日期格式 (yyyy → YYYY)
[convert] r11 业务类型代码列加 ellipsis: 命中 1 处
[convert] r11 默认节点 + toolbar_default 规则: 命中 2 处
[convert] 摘要: ..., 应用 3 处特殊字段规则, 新增 1 个 import
```

产物末尾：
```ts
unitConfig.customer_toolbar = [{ name: '序号重排', key: 'xhcp_4', func: 'handleXhcp', param: 4 },{ name: '小计', key: 'xj', func: 'handleXj' }];
unitConfig.handle_columns = [];
export default unitConfig;
```

**端到端验证 2**：MDT TSZL（`ckts_sum: false`）→ 仅序号重排，无小计

```ts
unitConfig.customer_toolbar = [{ name: '序号重排', key: 'xhcp_4', func: 'handleXhcp', param: 4 }];
unitConfig.handle_columns = [];
export default unitConfig;
```

**fixture 验证**：
```bash
$ npm run test:convert-config
[PASS] basic-rename
[PASS] combo
[PASS] date-format-normalize
[PASS] default-nodes-and-xhcp
[PASS] import-removal
[PASS] multi-line-remove
[PASS] nested-rename
[PASS] page-generation
[PASS] render-transform
[PASS] route-from-outpath
[PASS] route-generation
[PASS] special-field-rule-ellipsis
[PASS] toolbar-ckts-sum     ← 新增
========== 13/13 通过 ==========
```

`toolbar-ckts-sum` fixture 同时验证 `ckts_order: 4` + `ckts_sum: true` 两个规则同时生效（产物 `customer_toolbar` 含 2 项）。

**已知限制**（r13 仍不处理）：
- `ckts_sum: 'true'`（字符串）→ 当前正则不容忍引号；如需要可扩展为 `['"]?true['"]?`
- `ckts_sum: 1`（数字）→ 不匹配（必须是 `true`）
- 多个规则都触发时按 TOOLBAR_DEFAULT_RULES 数组顺序追加（不保证与原 toolbar_default 字段顺序一致）

**未来扩展示例**（仅展示，未实施）：

加新规则只需 push 一项：
```js
{
  name: '下载模板',
  fieldName: 'ckts_download',
  valueMatcher: /ckts_download\s*:\s*true/,
  buildEntry: () => ({ name: '下载模板', key: 'mbxz', func: 'handleMbxz' }),
}
TOOLBAR_DEFAULT_RULES.push(rule);
```

---

### 6.15 工具增强 r14（2026-06-05）

**背景**：源文件 `code_sample/.../MDT_TSZL___ZXSB_SB_CKSH_GCB/auto_config.tsx:126` 的 `form_items` 里 `TextArea` 项写法不统一：
- `autoSize: { minRows: 2, maxRows: 2 }`（可能不一致）
- `layout: { label: {xs:8,...}, formItem: {xs:16,...} }`（嵌套对象，每处都不一样）

新 DDBunit2 协议希望统一为：
- `autoSize: { minRows: 3, maxRows: 3 }`（固定 3 行）
- `layout: CONSTANTS.DEFAULT_FORM_LAYOUT_100P_ROW`（引用 `constants` 里的预定义布局常量）

工具自动统一。

**变更**：
- `convert-ddbunit-config.js` 新增辅助函数 `stripObjectField(content, fieldName)`：用 bracket-depth 扫描删除指定字段（容忍嵌套 `{}`，如 layout 嵌套对象）
- 新增规则函数 `normalizeTextAreaFormItems(content, configVar)`（内部调 `transformTextAreaFormItem`）：
  - 找 `<configVar>.form_items = [ ... ]` 块
  - bracket-depth 解析每个项对象
  - 对含 `type: 'TextArea'` 的项：剥 `autoSize` + 剥 `layout` + 追加 `autoSize: { minRows: 3, maxRows: 3 }, layout: CONSTANTS.DEFAULT_FORM_LAYOUT_100P_ROW`
  - 对非 TextArea 项：原样保留
- push 到 `SPECIAL_FIELD_RULES`（规则 4：`form_items TextArea 项标准化`）
- 顶部 docstring 加 r14 描述
- 新增 fixture `form-item-textarea.*`（input + expected）
- 11 个旧 expected.tsx 同步加 `customer_toolbar = [];` + `handle_columns = [];`（r12 行为变化，与 r14 无冲突）

**算法**：

```js
function transformTextAreaFormItem(content, configVar) {
  // 1) 找 <configVar>.form_items = [ 起点
  // 2) bracket-depth 找匹配 ]
  // 3) 在块内逐项 bracket-depth 解析（容忍 layout 嵌套对象）
  //    对每项检查 type: 'TextArea'
  //    是 → stripObjectField('autoSize') + stripObjectField('layout') + 追加新 autoSize/layout
  //    否 → 原样保留
}
```

**端到端验证**（CKSH）：

```bash
$ node scripts/convert-ddbunit-config.js --src code_sample/.../MDT_TSZL___ZXSB_SB_CKSH_GCB/auto_config.tsx
[convert] r8: 归一化 9 处日期格式 (yyyy → YYYY)
[convert] r11 默认节点 + toolbar_default 规则: 命中 3 处
[convert] r11 form_items TextArea 项标准化: 命中 1 处
[convert] 已追加路由: name=出口业务收汇, path=...
```

**产物对比**（`src/.../auto_config.tsx:127`）：

| 维度 | 源（line 126） | 产物（line 127） |
| --- | --- | --- |
| `autoSize` | `{ minRows: 2, maxRows: 2 }` | `{ minRows: 3, maxRows: 3 }` ✅ |
| `layout` | `{ label: {xs:8,...}, formItem: {xs:16,...} }` | `CONSTANTS.DEFAULT_FORM_LAYOUT_100P_ROW` ✅ |
| `type` | `TextArea` | `TextArea`（不动） |
| `label/name/rules` | 不动 | 不动 |
| `rules` 字段位置 | 在 `layout` 之后 | 在 `autoSize/layout` 之前（不影响语义） |

**fixture 验证**：

```bash
$ npm run test:convert-config
[PASS] basic-rename
[PASS] combo
[PASS] date-format-normalize
[PASS] default-nodes-and-xhcp
[PASS] form-item-textarea     ← 新增
[PASS] import-removal
[PASS] multi-line-remove
[PASS] nested-rename
[PASS] page-generation
[PASS] render-transform
[PASS] route-from-outpath
[PASS] route-generation
[PASS] special-field-rule-ellipsis
[PASS] toolbar-ckts-sum
========== 14/14 通过 ==========
```

`form-item-textarea` fixture 验证矩阵：
- `type: 'TextArea'` 项：autoSize 改 + layout 改 ✅
- `type: 'Input'` 项：不动 ✅
- 同一 form_items 数组内含两种类型项：分别处理 ✅
- 嵌套 `layout` 对象（`{xs:8}` 等）：正确 strip（用 bracket-depth）✅

**已知限制**（r14 仍不处理）：
- 项内字段顺序因 strip + 追加操作会变化（不影响运行时语义，框架按字段名取值）
- `layout: 'something'`（非对象值）→ 当前正则 `\s*\{` 不匹配；自动保留原值。如未来需支持可扩展为"识别 = 后是 identifier 还是 object"
- 项内同时含 `autoSize` 和 `layout: CONSTANTS.DEFAULT_FORM_LAYOUT_100P_ROW`（已经是标准形式）→ 仍会 strip + 追加（等价替换），不影响语义

---

---

## 七、后续 TODO

> 持续完善此文档时在此追加。

- [x] 转换 `seasonDataConfig.tsx`（2026-06-03 完成；r7 增强后 2026-06-04 重跑，render 函数已自动转标准形式）
- [x] 转换 `yearDataConfig.tsx`（工具 r6 端到端验证 + r7 增强后 2026-06-04 重跑，render 函数 + JSDoc 标题已修正）
- [x] 转换 `MDT___ZXSB_SB_MDT_TSSB_GCB/auto_config.tsx`（r7+r8+r10+r11+r12+r13 全部生效，2026-06-05）
- [x] 转换 `MDT_TSZL___ZXSB_SB_HGSPTZ_GCB/auto_config.tsx`（r7+r8+r10+r11+r12+r13 全部生效，2026-06-05）
- [x] 转换 `MDT_TSZL___ZXSB_SB_CKSH_GCB/auto_config.tsx`（r7+r8+r10+r11+r12+r13+r14 全部生效，2026-06-05）
- [ ] 迁移 `monthDataTab.tsx` 消费者（`cloneDeep` → spread + 旧 key → 新 key）
- [ ] 迁移 `seasonDataTab.tsx` / `yearDataTab.tsx` 消费者
- [ ] 迁移 `func.tsx` 中 `monthAdd` JSX 表单到 `form_items`（含 `qxQys.cktsqylxDm==='WM'` 条件）
- [ ] 迁移 `func.tsx` 中 `seasonAdd` / `yearAdd` JSX 表单到 `form_items`
- [ ] 端到端运行 `npm run dev` 验证 `monthDataConfig` 的 `layout_type: 'tz'` 渲染行为
  - 若 `'tz'` 渲染异常，回退为 `'default'`（最保守）
  - 或扩展 `DDBunit2.tsx` 支持 `'tz'` 视图分支
- [ ] 端到端运行 `npm run dev` 验证增删改查
- [ ] 若后续出现更多变体（如 `index2.tsx`、`quickSearch`），扩充 fixture
