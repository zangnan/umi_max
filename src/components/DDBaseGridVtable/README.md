# DDVTable 组件

基于 VTable (`@visactor/react-vtable`) 的轻量级明细表组件，封装了常用配置，提供更简洁的 API。

## 特性

- **简单配置**：仅需 `config.grid_columns` 和 `data.rows` 即可快速使用
- **统计行增强**：支持格式化显示、禁用选择、动态冻结、类型标签
- **动态配置**：支持设置弹窗动态配置紧凑度、序号列、冻结列数、统计行、表格高度、自动换行等
- **首列动态选择**：选择类型（checkbox/radio）支持运行时动态切换
- **码表渲染**：支持 `code_table` 渲染类型，将数值映射为码表显示值
- **自动换行**：支持配置单元格自动换行，可在设置弹窗中动态切换
- **统一 API 配置**：通过 `config.api_config` 统一管理所有接口地址
- **内置表单支持**：支持通过 `config.form_config` 和 `config.form_items` 配置内置表单
- **默认样式**：预置表头背景、单元格背景、悬停高亮、选中样式
- **表格筛选组件**：支持通过 `filter_items` 配置表格顶部筛选表单
- **智能刷新**：刷新按钮支持 API 模式自动重新请求，支持自定义回调和选中行数据传递

## 安装依赖

```bash
npm install @visactor/react-vtable @visactor/vtable
```

## 快速开始

```tsx
import { DDVTable } from '@/components/DDBaseGridVtable';

const config = {
  // 列表列配置
  grid_columns: [
    { title: '姓名', field: 'name', width: 120 },
    { title: '年龄', field: 'age', width: 80, sort: true },
    { title: '城市', field: 'city', width: 150 },
  ],
  // 列表配置
  grid_config: {
    grid_row_series_number: true,    // 显示行序号
    grid_height: 500,                // 表格高度
    grid_allow_frozen_col_count: 2,  // 允许冻结的列数
    grid_frozen_col_count: 1,        // 初始冻结列数
    grid_show_frozen_icon: true,     // 显示冻结图标
    grid_auto_wrap_text: true,       // 自动换行
  },
  // 工具栏配置
  toolbar_default: {
    add: true,
    edit: true,
    delete: true,
    setting: true,
    download: true,
    reload: true,
  },
  // 统一 API 配置
  api_config: {
    api_grid_query: '/api/grid/query',     // 列表查询
    api_form_query: '/api/form/query',      // 表单查询
    api_form_edit: '/api/form/save',        // 表单保存
    api_form_delete: '/api/form/delete',    // 表单删除
  },
  // 业务单元 key
  module_key: 'example_module',
};

const data = {
  rows: [
    { name: '张三', age: 25, city: '北京' },
    { name: '李四', age: 30, city: '上海' },
  ],
};

<DDVTable config={config} data={data} />;
```

## Props

| 属性 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| config | `DDVTableConfig` | 是 | 表格配置对象 |
| data | `DDVTableData` | 否 | 表格数据对象（直接传入数据模式使用） |
| apiParams | `DDVTableApiQueryParams` | 否 | API 查询参数（API 模式使用） |
| autoLoad | `boolean` | 否 | 是否自动加载数据（API 模式有效，默认 true） |
| customFormatters | `Record<string, (value: any) => string>` | 否 | 自定义格式化函数映射 |
| onReady | `(tableInstance: any) => void` | 否 | 表格实例创建完成回调 |
| onCellClick | `(args: any) => void` | 否 | 单元格点击事件回调 |
| onSort | `(args: any) => void` | 否 | 排序变化事件回调 |
| onSelectionChange | `(selectedRows: any[], selectedKeys: any[]) => void` | 否 | 选择变化回调（复选框/单选框） |
| onFilter | `(filterRules: DDVTableFilterRule[]) => void` | 否 | 过滤变化回调 |
| onLoadingChange | `(loading: boolean) => void` | 否 | 加载状态变化回调（API 模式有效） |
| onDataLoad | `(data: DDVTableData, response: DDVTableApiResponse) => void` | 否 | 数据加载完成回调（API 模式有效） |
| onError | `(error: any) => void` | 否 | 数据加载失败回调（API 模式有效） |
| onRefresh | `(selectedRows?: any[]) => void` | 否 | 刷新按钮点击回调（会传入当前选中行数据） |
| onAdd | `() => void` | 否 | 新增按钮点击回调 |
| onEdit | `(rowData?: any) => void` | 否 | 编辑按钮点击回调 |
| onDelete | `(rowData?: any) => void` | 否 | 删除按钮点击回调 |
| onSetting | `(config: DDVTableSettingConfig) => void` | 否 | 设置按钮点击回调 |
| onRowEdit | `(rowData: any, tableInstance: any) => void` | 否 | 操作列编辑按钮回调 |
| onRowDelete | `(rowData: any, tableInstance: any) => void` | 否 | 操作列删除按钮回调 |
| onRowDetail | `(rowData: any, tableInstance: any) => void` | 否 | 操作列详情按钮回调 |
| onFormSave | `(values: any, formType: 'add' \| 'edit', record?: any) => Promise<void> \| void` | 否 | 表单保存回调 |
| onFormDataLoaded | `(form: any, record: any) => void` | 否 | 表单数据加载完成回调（用于编辑时回填） |

## 类型定义

### DDVTableColumn

列配置类型，定义表格的每一列。

```typescript
interface DDVTableColumn {
  title: string; // 列头显示文字
  field: string; // 数据 key
  width?: number | 'auto'; // 列宽度
  sort?: boolean; // 是否开启排序
  sum?: boolean; // 统计合计值
  min?: boolean; // 统计最小值
  max?: boolean; // 统计最大值
  avg?: boolean; // 统计平均值
  align?: 'left' | 'right' | 'center'; // 列对齐方式
  hidden?: boolean; // 是否隐藏该列
  render?: DDVTableColumnRender; // 渲染配置
  titleTooltip?: string; // 列头说明提示
  filter?: boolean; // 是否显示过滤图标
  [key: string]: any; // 其他 VTable 列配置
}

interface DDVTableColumnRender {
  type: 'number' | 'date' | 'custom' | 'copy' | 'code_table';
  format?: string;
  /** 码表 key（code_table 类型使用），如 'code_dm_ckts_cktmspzlx' */
  key?: string;
}
```

### DDVTableGridConfig

列表配置类型，通过 `config.grid_config` 配置。

```typescript
interface DDVTableGridConfig {
  grid_row_series_number?: boolean | DDVTableRowSeriesNumber; // 行序号
  grid_height?: number | string; // 表格高度
  grid_allow_frozen_col_count?: number; // 允许冻结的列数上限
  grid_frozen_col_count?: number; // 初始冻结列数
  grid_show_frozen_icon?: boolean; // 显示冻结图标
  grid_selection_type?: 'checkbox' | 'radio' | false; // 选择类型
  grid_row_key?: string; // 主键字段（用于删除等操作）
  grid_auto_wrap_text?: boolean; // 是否自动换行
  /** 性能模式：启用后跳过所有复杂配置，只保留基础 field/title/width，用于性能测试 */
  grid_performance_mode?: boolean;
}
```

### DDVTableConfig

表格整体配置。

```typescript
interface DDVTableConfig {
  grid_columns: DDVTableColumn[]; // 列表列配置
  grid_config?: DDVTableGridConfig; // 列表配置
  toolbar_default?: DDVTableToolbarConfig; // 工具栏配置
  grid_handle_columns_default?: DDVTableHandleColumnsConfig; // 操作列
  /** API 配置 - 统一管理所有接口地址 */
  api_config?: {
    api_grid_query?: string; // 列表查询 API 地址
    api_form_query?: string; // 表单查询 API 地址（编辑时查询）
    api_form_edit?: string; // 表单保存 API 地址（新增/编辑时保存）
    api_form_delete?: string; // 表单删除 API 地址
  };
  /** 表单配置 */
  form_config?: DDVTableFormConfig;
  /** 表单字段配置 */
  form_items?: DDVTableFormItem[];
  /** 筛选字段配置 - 配置后会在表格上方显示筛选组件 */
  filter_items?: DDVTableFormItem[];
  /** 业务单元 key */
  module_key?: string;
  [key: string]: any; // 其他 VTable 配置
}
```

### DDVTableData

```typescript
interface DDVTableData {
  rows: Record<string, any>[]; // 数据行数组
}
```

### DDVTableToolbarConfig

工具栏按钮配置。

| 属性     | 类型      | 默认值 | 说明         |
| -------- | --------- | ------ | ------------ |
| add      | `boolean` | false  | 显示新增按钮 |
| edit     | `boolean` | false  | 显示编辑按钮 |
| delete   | `boolean` | false  | 显示删除按钮 |
| setting  | `boolean` | false  | 显示设置按钮 |
| full     | `boolean` | false  | 显示全屏按钮 |
| download | `boolean` | false  | 显示导出按钮 |
| upload   | `boolean` | false  | 显示导入按钮 |
| reload   | `boolean` | false  | 显示刷新按钮 |

### DDVTableHandleColumnsConfig

操作列按钮配置。

| 属性   | 类型      | 默认值 | 说明         |
| ------ | --------- | ------ | ------------ |
| edit   | `boolean` | false  | 显示编辑按钮 |
| delete | `boolean` | false  | 显示删除按钮 |
| detail | `boolean` | false  | 显示详情按钮 |

### DDVTableRowSeriesNumber

行序号配置。

```typescript
interface DDVTableRowSeriesNumber {
  title?: string; // 序号列标题
  width?: number | string; // 序号列宽度
  headerStyle?: Record<string, any>; // 表头样式
  style?: Record<string, any>; // 单元格样式
  [key: string]: any; // 其他 VTable 配置
}
```

### DDVTableSettingConfig

设置弹窗配置类型。

```typescript
interface DDVTableSettingConfig {
  size?: 'compact' | 'default' | 'loose'; // 列表紧凑程度
  autoWrapText?: boolean; // 是否自动换行
  showIndex?: boolean; // 是否显示序号
  showHandleColumn?: boolean; // 是否显示操作列
  frozenColCount?: number; // 冻结列数
  allowFrozenColCount?: number; // 可选冻结的最大列数
  showSummary?: boolean; // 是否显示统计行
  selectionType?: 'checkbox' | 'radio' | false; // 首列选择类型
  columnVisibility?: Record<string, boolean>; // 列显示配置
  columnOrder?: string[]; // 列顺序配置
  gridHeight?: number; // 表格高度
}
```

### DDVTableFormConfig

表单配置类型，通过 `config.form_config` 配置。

```typescript
interface DDVTableFormConfig {
  form_title?: string; // 表单标题
  form_width?: number | string; // 表单宽度
  form_layout_type?: 'horizontal' | 'vertical' | number; // 布局类型
  form_label_input_layout?: 'horizontal' | 'vertical'; // 标签与输入框排列方式
  form_submit_type?: 'FormData' | null; // 提交类型
  form_save_check?: boolean; // 是否执行后端校验
  form_get_value_by_grid?: boolean; // 是否从列表获取编辑数据
}
```

### DDVTableFormItem

表单项配置类型（参考 DDBaseForm）。

```typescript
interface DDVTableFormItem {
  name?: string; // 字段名称
  type: string; // 字段类型
  label?: string; // 标签
  tooltip?: string; // 提示信息
  placeholder?: string; // 占位符
  disabled?: boolean; // 是否禁用
  readOnly?: boolean; // 是否只读
  layout?: any; // 布局配置
  rules?: any[]; // 校验规则
  min?: number; // 最小值
  max?: number; // 最大值
  list?: any[]; // 选择列表
  codeTable?: string; // 码表
  treeTable?: string; // 树形选择数据
  isSelectLeaf?: boolean; // 是否选择叶子节点
  defaultValue?: any; // 默认值
  format?: string; // 格式
  showSearch?: boolean; // 显示搜索
  mode?: any; // 多选模式
  allowClear?: boolean; // 允许清除
  maxlength?: number; // 最大长度
  autoSize?: any; // 自动调整高度
  range?: boolean; // 范围选择
  hidden?: boolean; // 隐藏字段
  [key: string]: any; // 其他属性
}
```

### DDVTableFilterRule

过滤规则类型。

```typescript
interface DDVTableFilterRule {
  field: string; // 过滤字段
  filter_type: 'text' | 'number' | 'date'; // 过滤类型
  value: string | number | { min?: number; max?: number }; // 过滤值
}
```

### DDVTableApiQueryParams

API 查询参数类型。

```typescript
interface DDVTableApiQueryParams {
  searchModel?: DDVTableApiSearchItem[]; // 查询条件数组
  orderModel?: DDVTableApiOrderItem[]; // 排序条件数组
  pageSize?: number; // 每页条数
  page?: number; // 当前页码
  pageNum?: number; // 当前页码（兼容格式）
  sortField?: string; // 单个排序字段（兼容旧格式）
  sortOrder?: 'asc' | 'desc'; // 排序方向（兼容旧格式）
  [key: string]: any; // 其他查询参数
}

interface DDVTableApiSearchItem {
  field?: string; // 字段名
  operator?: string; // 操作符
  value?: any; // 值
  logic?: 'and' | 'or'; // 逻辑符
}

interface DDVTableApiOrderItem {
  field?: string; // 字段名
  direction?: 'asc' | 'desc'; // 排序方向
}
```

### DDVTableApiResponse

API 响应数据类型，支持多种响应格式。

```typescript
interface DDVTableApiResponse {
  code?: string | number; // 响应码
  success?: boolean; // 是否成功
  msg?: string; // 响应消息
  body?: {
    rows?: any[]; // 数据列表
    rowCount?: number; // 总记录数
    [key: string]: any;
  };
  data?: {
    list?: any[]; // 数据列表
    total?: number; // 总记录数
    rowCount?: number; // 总记录数（兼容格式）
    rows?: any[]; // 数据列表（兼容格式）
    pageNum?: number; // 当前页码
    pageSize?: number; // 每页条数
    [key: string]: any;
  };
  rows?: any[]; // 直接数组格式
  [key: string]: any;
}
```

## 核心配置

### 渲染格式化

```tsx
const config = {
  grid_columns: [
    // 数值格式化
    {
      title: '金额',
      field: 'amount',
      render: { type: 'number', format: '0,0.00' },
    },
    // 日期格式化
    {
      title: '日期',
      field: 'date',
      render: { type: 'date', format: 'YYYY-MM-DD' },
    },
    // 自定义格式化
    {
      title: '状态',
      field: 'status',
      render: { type: 'custom', format: 'statusMap' },
    },
    // 复制功能
    { title: '订单号', field: 'orderNo', render: { type: 'copy' } },
    // 码表映射
    { title: '凭证类型', field: 'cktmspzlx_dm', render: { type: 'code_table', key: 'code_dm_ckts_cktmspzlx' } },
  ],
};

// 自定义格式化函数
const customFormatters = {
  statusMap: (value: string) => ({ N: '未审核', Y: '已审核' }[value] || value),
};

<DDVTable config={config} data={data} customFormatters={customFormatters} />;
```

**format 格式说明**：

| 类型      | format 示例             | 说明                      |
| --------- | ----------------------- | ------------------------- |
| number    | `'0,0.00'`              | 千分位，保留 2 位小数     |
| date      | `'YYYY-MM-DD'`          | 日期格式                  |
| date      | `'YYYY-MM-DD HH:mm:ss'` | 日期时间格式              |
| custom    | `'statusMap'`           | 自定义函数名              |
| copy      | -                       | 单元格复制功能            |
| code_table | -                       | 码表映射，需配合 `key` 使用 |

**复制功能**：设置 `render: { type: 'copy' }` 可在单元格上显示复制图标，点击即可复制单元格内容：

```tsx
const config = {
  grid_columns: [
    { title: '订单号', field: 'orderNo', render: { type: 'copy' } },
    { title: '手机号', field: 'phone', render: { type: 'copy' } },
  ],
};
```

### 统计行

```tsx
const config = {
  grid_columns: [
    { title: '金额', field: 'amount', sum: true, avg: true },
    { title: '数量', field: 'count', min: true, max: true },
  ],
};
```

**统计行增强功能**：

1. **格式化显示**：统计行根据列的 `render` 配置自动应用格式化规则

   ```tsx
   const config = {
     grid_columns: [
       {
         title: '金额',
         field: 'amount',
         sum: true,
         render: { type: 'number', format: '0,0.00' },
       },
       {
         title: '日期',
         field: 'date',
         max: true,
         render: { type: 'date', format: 'YYYY-MM-DD' },
       },
     ],
   };
   ```

2. **禁用选择**：统计行自动禁用 checkbox/radio 选择功能，避免误操作

3. **标签显示位置**：统计类型标签（如"合计"、"最小"、"最大"、"平均"）按固定顺序（SUM → MIN → MAX → AVG）显示：
   - 开启序号列时，统计标签优先显示在序号列位置
   - 未开启序号列时，显示在第一列数据列
   - 当有选择列（checkbox/radio）时，标签位置会根据序号列配置自动调整

### 过滤功能

列配置支持 `filter: true`，开启后在列头显示过滤图标，点击可设置过滤条件：

```tsx
const config = {
  grid_columns: [
    // 文本类型 - 模糊搜索
    { title: '姓名', field: 'name', filter: true },
    // 数值类型 - 范围过滤
    { title: '年龄', field: 'age', filter: true, render: { type: 'number' } },
    // 日期类型 - 日期范围过滤
    { title: '入职日期', field: 'date', filter: true, render: { type: 'date', format: 'YYYY-MM-DD' } },
  ],
};
```

**过滤类型自动识别**：
- `render.type: 'text'` 或未指定类型 → 文本模糊搜索
- `render.type: 'number'` → 数值范围过滤（最小值-最大值）
- `render.type: 'date'` → 日期范围过滤（开始日期-结束日期）

**过滤回调**：

```tsx
<DDVTable
  config={config}
  data={data}
  onFilter={(filterRules) => {
    console.log('过滤规则:', filterRules);
    // filterRules 结构:
    // [{ field: 'name', filter_type: 'text', value: '张' }]
  }}
/>
```

### 表格筛选组件

除了列头的过滤图标，DDVTable 还支持在表格顶部配置筛选表单组件，通过 `filter_items` 配置：

```tsx
const config = {
  grid_columns: [
    { title: '姓名', field: 'name' },
    { title: '年龄', field: 'age' },
    { title: '城市', field: 'city' },
  ],
  // 筛选字段配置
  filter_items: [
    { name: 'name', label: '姓名', type: 'Input', placeholder: '请输入姓名' },
    { name: 'age', label: '年龄', type: 'InputNumber', range: true },
    { name: 'city', label: '城市', type: 'Select', list: [{ label: '北京', value: 'bj' }, { label: '上海', value: 'sh' }] },
  ],
  // 统一 API 配置
  api_config: {
    api_grid_query: '/api/list',
  },
};

<DDVTable
  config={config}
  apiParams={{ page: 1, pageSize: 20 }}
/>
```

**筛选组件特性**：

- 配置 `filter_items` 后，表格顶部自动显示筛选表单
- 支持多种表单项类型：Input、InputNumber、Select、DatePicker 等
- 支持范围查询（设置 `range: true`）
- 筛选提交后自动触发 API 重新查询，并重置分页到第一页
- 支持重置按钮，清除筛选条件并重新加载数据
- 筛选表单布局可通过 `layout` 属性自定义

**筛选字段配置示例**：

```tsx
filter_items: [
  // 文本输入
  { name: 'name', label: '姓名', type: 'Input' },
  // 数字范围输入
  { name: 'amount', label: '金额', type: 'InputNumber', range: true },
  // 下拉选择
  { name: 'status', label: '状态', type: 'Select', list: [{ label: '启用', value: '1' }, { label: '禁用', value: '0' }] },
  // 码表选择
  { name: 'type', label: '类型', type: 'Select', codeTable: 'code_dm_type' },
  // 日期范围
  { name: 'date', label: '日期', type: 'DatePicker', range: true },
  // 带操作符筛选（默认 alike）
  { name: 'code', label: '编码', type: 'Input', op: 'eq' },
]
```

**操作符说明**：

| 操作符 | 说明 |
| ------ | ---- |
| `alike` | 模糊匹配（默认） |
| `eq` | 精确匹配 |
| `ge` | 大于等于 |
| `le` | 小于等于 |
| `gt` | 大于 |
| `lt` | 小于 |

### 隐藏列

```tsx
const config = {
  grid_columns: [
    { title: '姓名', field: 'name' },
    { title: 'ID', field: 'id', hidden: true }, // 隐藏列
  ],
};
```

### 列头提示

```tsx
const config = {
  grid_columns: [
    { title: '金额', field: 'amount', titleTooltip: '金额单位为元' },
  ],
};
```

### 自动换行

组件支持单元格文本自动换行功能，可通过以下方式配置：

```tsx
const config = {
  grid_columns: [...],
  grid_config: {
    grid_auto_wrap_text: true, // 初始开启自动换行
  },
};

// 或通过设置弹窗动态切换
<DDVTable
  config={config}
  data={data}
  onSetting={(settingConfig) => {
    console.log('当前自动换行状态:', settingConfig.autoWrapText);
  }}
/>
```

**自动换行特性**：
- 默认关闭，需要通过 `grid_config.grid_auto_wrap_text: true` 或设置弹窗开启
- 可在设置弹窗中动态切换开关
- 开启自动换行时，行高会根据内容自动调整
- 关闭自动换行后，用户可手动选择紧凑/中等/宽松模式

## 交互功能

### 工具栏

```tsx
const config = {
  grid_columns: [...],
  toolbar_default: {
    add: true,       // 新增
    edit: true,      // 编辑
    delete: true,    // 删除
    setting: true,   // 设置
    download: true,  // 导出
    upload: true,    // 导入
    reload: true,    // 刷新
    full: true,      // 全屏
  },
};

<DDVTable
  config={config}
  data={data}
  onAdd={() => {}}
  onEdit={() => {}}
  onDelete={() => {}}
  onSetting={() => {}}
/>
```

**工具栏按钮布局**：

- **主按钮组**（左侧）：新增、编辑、删除按钮
- **系统菜单**（右侧）：图表统计、维度表统计、筛选、设置、下拉菜单（导出、导入、刷新、全屏）

**各按钮功能说明**：

| 按钮 | 功能 |
| --- | --- |
| 新增 | 调用 `onAdd` 回调 |
| 编辑 | 调用 `onEdit` 回调 |
| 删除 | 调用 `onDelete` 回调 |
| 设置 | 打开设置弹窗 |
| 导出 | 导出 Excel 文件（依赖 `@visactor/vtable-export`） |
| 导入 | 暂无默认实现（可扩展） |
| 刷新 | 刷新表格数据（API模式自动重新请求，支持 onRefresh 回调） |
| 全屏 | 切换全屏模式 |
| 图表统计 | 暂无默认实现（可扩展） |
| 维度表统计 | 暂无默认实现（可扩展） |
| 筛选 | 显示过滤面板（对应 `filter: true` 的列） |

### 操作列

```tsx
const config = {
  grid_columns: [...],
  grid_handle_columns_default: {
    edit: true,
    delete: true,
    detail: true,
  },
};

<DDVTable
  config={config}
  data={data}
  onRowEdit={(rowData) => console.log('编辑', rowData)}
  onRowDelete={(rowData) => console.log('删除', rowData)}
  onRowDetail={(rowData) => console.log('详情', rowData)}
/>
```

**详情按钮内置功能**：

当配置了 `form_items` 时，点击详情按钮会弹出详情弹窗，展示该行的详细信息：

- 自动调用 API 获取详情数据（使用 `api_form_query` 接口）
- 支持 `form_get_value_by_grid` 配置，直接从列表行数据获取详情
- 使用 `DDDescriptions` 组件以只读形式展示数据
- 弹窗标题格式：`{form_title}详情`

```tsx
const config = {
  grid_columns: [...],
  grid_handle_columns_default: {
    detail: true,
  },
  // 需要配置表单字段才能显示详情
  form_items: [
    { name: 'name', type: 'Input', label: '姓名' },
    { name: 'age', type: 'InputNumber', label: '年龄' },
    { name: 'city', type: 'Input', label: '城市' },
  ],
  api_config: {
    api_form_query: '/api/form/query',  // 详情查询接口
  },
};

// 点击详情按钮会自动弹出详情弹窗
<DDVTable config={config} data={data} />
```

### 行选择（复选框/单选框）

```tsx
const config = {
  grid_columns: [...],
  grid_config: {
    grid_selection_type: 'checkbox',  // 复选框
    // grid_selection_type: 'radio',   // 单选框
    // grid_selection_type: false,     // 不显示
  },
};

<DDVTable
  config={config}
  data={data}
  onSelectionChange={(selectedRows, selectedKeys) => {
    console.log('选中行:', selectedRows);
    console.log('选中键:', selectedKeys);
  }}
/>
```

### 行序号

```tsx
const config = {
  grid_columns: [...],
  grid_config: {
    grid_row_series_number: true,  // 使用默认配置
    // grid_row_series_number: { title: '序号', width: 60 },  // 自定义配置
  },
};
```

### 内置表单功能

DDVTable 支持配置内置表单，通过 `config.form_config` 和 `config.form_items` 配置表单字段和弹窗：

```tsx
const config = {
  grid_columns: [...],
  // 统一 API 配置
  api_config: {
    api_grid_query: '/hx/ty/crud/queryPager',     // 列表查询
    api_form_query: '/hx/ty/crud/queryOne',        // 表单查询（编辑时回填）
    api_form_edit: '/hx/ty/crud/edit',             // 表单保存
  },
  // 表单配置
  form_config: {
    form_title: '用户信息',
    width: 600,
    form_layout_type: 'vertical',
  },
  // 表单字段配置
  form_items: [
    { name: 'name', type: 'Input', label: '姓名', rules: [{ required: true }] },
    { name: 'age', type: 'InputNumber', label: '年龄', min: 0, max: 150 },
    { name: 'city', type: 'Input', label: '城市' },
    { name: 'status', type: 'Select', label: '状态', list: [{ label: '启用', value: '1' }, { label: '禁用', value: '0' }] },
    { name: 'birthday', type: 'DatePicker', label: '生日' },
  ],
};

<DDVTable
  config={config}
  data={data}
  onFormSave={async (values, formType, record) => {
    console.log('表单数据:', values);
    // 自行调用 API 保存
  }}
  onFormDataLoaded={(form, record) => {
    console.log('表单回填数据:', record);
  }}
/>
```

**表单配置说明**：

| 配置项 | 说明 |
| --- | --- |
| form_config.form_title | 表单弹窗标题 |
| form_config.width | 表单宽度 |
| form_config.form_layout_type | 布局类型：'horizontal'、'vertical' 或数字（多列） |
| form_items | 表单字段配置数组 |

**表单字段类型**：

| 类型 | 说明 |
| --- | --- |
| Input | 文本输入 |
| InputNumber | 数字输入 |
| Select | 下拉选择 |
| DatePicker | 日期选择 |
| RangePicker | 日期范围选择 |
| Radio | 单选框 |
| Checkbox | 多选框 |
| Switch | 开关 |
| TextArea | 文本域 |
| TreeSelect | 树形选择 |
| Cascader | 级联选择 |
| Upload | 文件上传 |

**使用回调方式**：

如果不想使用内置表单 API 调用，可以通过回调自行处理：

```tsx
<DDVTable
  config={config}
  onAdd={() => {
    // 打开自定义表单弹窗
  }}
  onEdit={(record) => {
    // 打开编辑表单弹窗，回填数据
  }}
  onRowEdit={(record) => {
    // 操作列编辑按钮点击
  }}
/>
```

### 设置弹窗

组件内置设置弹窗，支持运行时动态配置表格显示：

```tsx
const config = {
  grid_columns: [...],
  toolbar_default: {
    setting: true,  // 显示设置按钮
  },
};

<DDVTable
  config={config}
  data={data}
  onSetting={(settingConfig) => console.log('设置配置:', settingConfig)}
/>
```

**设置弹窗支持以下配置项**：

| 配置项       | 说明                           |
| ------------ | ------------------------------ |
| 列表紧凑程度 | 紧凑 / 中等 / 宽松三种模式切换 |
| 自动换行     | 开启/关闭单元格自动换行        |
| 显示序号列   | 显示/隐藏行序号列              |
| 冻结列数量   | 动态调整冻结列数               |
| 显示统计行   | 显示/隐藏底部统计行            |
| 显示操作列   | 显示/隐藏操作列                |
| 首列选择类型 | 复选框 / 单选框 / 不显示       |
| 列显示/隐藏  | 可单独控制每列的显示状态       |
| 列顺序调整   | 支持拖拽调整列顺序             |
| 表格高度     | 动态调整表格高度               |

**设置弹窗布局**：
- 采用左右布局：左侧为常规设置项，右侧为列设置
- 左侧设置项包括：列表高度、首列选择类型、显示统计行、显示序号、显示操作列、自动换行、列表紧凑程度、冻结列数等
- 右侧列设置支持显示/隐藏控制和拖拽排序

**列设置说明**：
- 支持显示/隐藏每列
- 支持拖拽调整列顺序
- 拖拽操作使用 @dnd-kit 库实现，支持键盘辅助导航
- 调整后的列顺序会实时生效
- **隐藏初始 hidden: true 的列不在列设置中显示**
- 支持相同字段不同标题的列同时存在

### 首列选择类型动态配置

选择列类型（checkbox/radio）支持在设置弹窗中动态切换，无需重新创建表格：

```tsx
const config = {
  grid_columns: [...],
  grid_config: {
    grid_selection_type: 'checkbox',  // 初始类型
  },
  // 可在设置弹窗中动态切换为 'radio' 或 false
};
```

### 刷新按钮

DDVTable 的刷新按钮（工具栏 `reload: true`）支持三种刷新模式：

#### 1. API 模式自动刷新

当使用 `config.api_config.api_grid_query` API 模式时，点击刷新按钮会自动调用 `loadData()` 重新请求数据：

```tsx
<DDVTable
  apiParams={{ page: 1, pageSize: 20 }}
  config={{
    toolbar_default: { reload: true },
    api_config: {
      api_grid_query: '/api/list',
    },
  }}
/>
```

#### 2. 自定义刷新回调

通过 `onRefresh` 回调自定义刷新逻辑，会传入当前选中行数据：

```tsx
<DDVTable
  config={{
    toolbar_default: { reload: true },
    grid_config: { grid_selection_type: 'checkbox' },
    api_config: {
      api_grid_query: '/api/list',
    },
  }}
  onRefresh={(selectedRows) => {
    console.log('选中行:', selectedRows);
    // 自定义刷新逻辑，例如：
    // - 仅刷新选中行的关联数据
    // - 根据选中行条件刷新
    // - 调用其他 API
  }}
/>
```

#### 3. 本地数据模式

当直接传入 `data` 属性时，刷新按钮会使用本地数据重新渲染表格：

```tsx
<DDVTable
  config={{
    toolbar_default: { reload: true },
  }}
  data={{ rows: [...] }}
/>
```

**刷新优先级**：`onRefresh` 回调 > API 模式自动刷新 > 本地数据刷新

## 事件回调

### 表格就绪

```tsx
const handleReady = (tableInstance: any) => {
  // 调用表格方法
  tableInstance.exportData();
};

<DDVTable config={config} data={data} onReady={handleReady} />;
```

### 单元格点击

```tsx
const handleCellClick = (args: any) => {
  const { col, row, field, value } = args;
  console.log('点击位置:', { col, row, field, value });
};

<DDVTable config={config} data={data} onCellClick={handleCellClick} />;
```

### 排序变化

```tsx
const handleSort = (args: any) => {
  const { field, order } = args; // order: 'asc' | 'desc' | 'normal'
  console.log('排序:', field, order);
};

<DDVTable config={config} data={data} onSort={handleSort} />;
```

## 高级用法

### 传递原生 VTable 配置

```tsx
const config = {
  grid_columns: [...],
  grid_config: {
    grid_allow_frozen_col_count: 2,
    grid_frozen_col_count: 2,
  },
  // 其他 VTable 配置
  autoFillWidth: true,
  defaultHeaderBgColor: '#f0f0f0',
};

<DDVTable config={config} data={data} />;
```

### 性能模式

组件提供性能模式配置，启用后跳过所有复杂配置处理，仅保留基础的列定义，适用于大数据量性能测试场景：

```tsx
const config = {
  grid_columns: [
    { title: '姓名', field: 'name', width: 120 },
    { title: '年龄', field: 'age', width: 80 },
    { title: '城市', field: 'city', width: 150 },
  ],
  grid_config: {
    grid_performance_mode: true,  // 启用性能模式
  },
};

<DDVTable config={config} data={data} />;
```

**性能模式特性**：
- 只保留基础的 `field`、`title`、`width` 列配置
- 跳过所有复杂处理逻辑（渲染格式化、过滤、操作列、统计行等）
- 减少内存占用，提升渲染性能
- 适用于需要测试表格基础渲染性能的场景

### 动态更新数据

```tsx
const [data, setData] = useState({ rows: [] });

// 更新数据，组件会自动局部刷新
setData({ rows: newRows });
```

## 默认配置

组件内置以下默认配置，可通过 `config` 覆盖：

```typescript
{
  // 编辑配置
  editCellTrigger: 'click',
  keyboardOptions: {
    copySelected: true,
    pasteValueToCell: true,
    selectAllOnCtrlA: true,
  },
  // 文本配置
  enableLineBreak: true,
  autoWrapText: false,
  // 行高配置
  defaultRowHeight: 'auto',        // 数据行行高设为 auto，根据内容自动调整
  defaultHeaderRowHeight: 'auto',       // 表头行高设为 auto
  // 拖拽表头配置
  dragHeaderMode: 'column',
  // 冻结配置
  showFrozenIcon: true,
  allowFrozenColCount: 0,
  frozenColCount: 0,
  // 高度模式
  heightMode: 'standard',
  // 显示聚合
  showAggregation: true,
  // 默认样式
  defaultHeaderBgColor: '#fafafa',
  defaultCellBgColor: '#fff',
  hover: { highlightMode: 'cross' },
  selection: { fill: '#c6e3ff', stroke: '#007acc', strokeWidth: 1 },
  // 主题配置：默认字体和滚动条样式
  theme: {
    defaultStyle: {
      fontFamily: 'Microsoft YaHeu, 微软雅黑, PingFang SC, sans-serif',
      fontSize: 14,
    },
    headerStyle: {
      fontFamily: 'Microsoft YaHeu, 微软雅黑, PingFang SC, sans-serif',
      fontSize: 14,
    },
    bodyStyle: {
      fontFamily: 'Microsoft YaHeu, 微软雅黑, PingFang SC, sans-serif',
      fontSize: 14,
    },
    // 滚动条样式配置
    scrollStyle: {
      visible: 'always',  // 常驻显示滚动条
      width: 8,
      scrollSliderColor: '#c1c1c1',
      scrollRailColor: '#f0f0f0',
      scrollSliderCornerRadius: 4,
      barToSide: false,
    },
  },
}
```

## 数据源模式

DDVTable 支持两种数据获取方式：

### 方式1：直接传入数据

通过 `data` 属性直接传入列表数据：

```tsx
<DDVTable
  config={{
    grid_columns: [
      { title: '姓名', field: 'name', width: 120 },
      { title: '年龄', field: 'age', width: 80 },
    ],
  }}
  data={{ rows: [{ name: '张三', age: 25 }, { name: '李四', age: 30 }] }}
/>
```

### 方式2：API 查询数据

通过 `config.api_config` 和 `apiParams` 从后端 API 获取数据：

```tsx
// 使用 config.api_config 统一配置 API 地址
const config = {
  grid_columns: [
    { title: '姓名', field: 'name', width: 120 },
    { title: '年龄', field: 'age', width: 80, sort: true },
  ],
  api_config: {
    api_grid_query: '/hx/ty/crud/queryPager',
    api_form_query: '/hx/ty/crud/queryOne',
    api_form_edit: '/hx/ty/crud/edit',
  },
};

<DDVTable
  config={config}
  apiParams={{ page: 1, pageSize: 20 }}
  onDataLoad={(data) => console.log('数据加载完成', data)}
  onLoadingChange={(loading) => console.log('加载状态', loading)}
/>
```

**API 模式特性**：
- 内部通过 API 查询数据，无需外部传入 `data`
- 支持分页查询
- 支持查询参数配置（searchModel、orderModel）
- 自动加载数据（可关闭）
- 支持后端排序联动
- 自动适配多种 API 响应格式

**带查询条件**：

```tsx
const config = {
  grid_columns: [...],
  api_config: {
    api_grid_query: '/hx/ty/crud/queryPager',
  },
};

<DDVTable
  apiParams={{
    page: 1,
    pageSize: 20,
    searchModel: [
      { field: 'name', operator: 'like', value: '%张%', logic: 'and' },
      { field: 'age', operator: '>=', value: 18, logic: 'and' },
    ],
  }}
  config={config}
/>
```

**带排序条件**：

```tsx
const config = {
  grid_columns: [...],
  api_config: {
    api_grid_query: '/hx/ty/crud/queryPager',
  },
};

<DDVTable
  apiParams={{
    page: 1,
    pageSize: 20,
    orderModel: [{ field: 'createTime', direction: 'desc' }],
  }}
  config={config}
/>
```

**禁用自动加载**（用于需要手动触发加载的场景）：

```tsx
const [refreshKey, setRefreshKey] = useState(0);

const config = {
  grid_columns: [...],
  api_config: {
    api_grid_query: '/hx/ty/crud/queryPager',
  },
};

<DDVTable
  autoLoad={false}
  config={config}
  key={refreshKey} // 通过 key 变化强制重新加载
/>

// 刷新数据
// setRefreshKey(prev => prev + 1);
```

**API 响应格式支持**：

```json
// 格式1：body 包装
{ "code": "200", "body": { "rowCount": 100, "rows": [...] } }

// 格式2：data.list 格式
{ "code": 0, "data": { "list": [...], "total": 100 } }

// 格式3：直接数组
[{ "id": 1, "name": "张三" }]

// 格式4：data.rows 格式
{ "data": { "rows": [...] } }

// 格式5：data.result 格式
{ "data": { "result": [...] } }
```

## 注意事项

1. `field` 必须与 `data.rows` 中的字段名一致（或与 API 返回的数据字段一致）
2. 冻结功能需设置 `grid_config.grid_allow_frozen_col_count > 0`
3. 统计功能仅对数值类型有效
4. 导出功能已内置（依赖 `@visactor/vtable-export`）
5. API 模式下，默认分页参数为 `page: 1, pageSize: 5000`
6. API 模式下，排序变化时会自动触发后端查询
7. API 模式下，支持与表单采集功能联动（保存成功后自动刷新列表）
8. 推荐使用 `config.api_config` 统一管理 API 地址
9. 推荐使用 `config.form_config` + `config.form_items` 配置内置表单
10. 更多高级配置请参考 [VTable 官方文档](https://visactor.io/vtable)
