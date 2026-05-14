# generate_module_excel.py 详细使用说明

## 一、脚本概述

`generate_module_excel.py` 是 module-excel-generator 技能的核心执行工具，负责根据 AI 设计的表结构生成符合 `node_module.xlsx` 模板格式的 Excel 配置文件。

**核心功能**：
- 根据 JSON 格式的表结构信息生成 4 个 Sheet 的 Excel 文件（表、模块、字段、菜单）
- 支持单模块和多模块合并生成
- 支持主子表（Master-Detail）、一对多关联（rel）、多对多关联（rel2）
- 自动推断字段类型、表单类型、筛选项配置等

**模板文件位置**：`public/import_template/v0.2node/node_module.xlsx`

---

## 二、使用场景分类

### 场景1：单模块生成

**触发条件**：用户只需要创建一个独立的增删查改模块，不涉及子表或关联表。

**命令行示例**：
```bash
python generate_module_excel.py --table-info '{
  "table_name_cn": "考勤记录",
  "table_name_en": "att_record",
  "fields": [
    {"name": "uuid", "name_cn": "UUID", "type": "varchar(32)", "key": "p_key", "required": "Y"},
    {"name": "user_id", "name_cn": "员工ID", "type": "varchar(32)"},
    {"name": "work_date", "name_cn": "工作日期", "type": "datetime"},
    {"name": "status", "name_cn": "状态", "type": "char(1)"}
  ]
}'
```

**输出文件**：`考勤记录_eg_m_att_record_{timestamp}.xlsx`

**代码执行流程**（单模块模式）：
```
main()
├── 解析 --table-info JSON
├── 验证必填字段（table_name_cn, table_name_en, fields）
├── design_module_config()        → 生成31列表格模块配置
├── design_field_configs()       → 生成37列表格字段配置
├── design_menu_config()         → 生成15列菜单配置
├── generate_module_excel()      → 生成4个Sheet的Excel
└── 输出文件到 exports/module_configs/
```

---

### 场景2：多模块合并生成

**触发条件**：用户需要创建多个相互关联的模块，如主表+子表+关联表，且要求合并到一个 Excel 文件中。

**命令行示例**：
```bash
python generate_module_excel.py \
  --groups "人员管理|sub:人员学历管理|rel:性格标签管理|rel2:权限管理" \
  --table-info '{"table_name_cn":"人员管理","table_name_en":"person","fields":[...]}' \
  --table-info '{"table_name_cn":"人员学历管理","table_name_en":"person_education","fields":[...]}' \
  --table-info '{"table_name_cn":"性格标签管理","table_name_en":"tag","fields":[...]}' \
  --table-info '{"table_name_cn":"权限管理","table_name_en":"permission","fields":[...]}' \
  --table-info '{"table_name_cn":"人员权限关系表","table_name_en":"person_permission","fields":[...]}'
```

**--groups 参数格式说明**：
| 前缀 | 含义 | 处理方式 |
|------|------|---------|
| 无前缀 | 主表 | 创建模块，为关联的子表创建 leaf 分隔行 |
| `sub:` | 子表（Master-Detail） | 创建 leaf 分隔行 + 外键字段 |
| `rel:` | 一对多关联表 | 在主表中更新关联字段的 rel: 格式化 |
| `rel2:` | 多对多关联表 | 在主表中添加 rel2: 虚拟字段；可指定中间表 `rel2:关联表,中间表` |

**多组主子表格式**（用 `;` 分隔）：
```
"主表1|sub:子表1;主表2|sub:子表2;独立模块"
```

**输出文件**：`多模块合并_{timestamp}.xlsx`

---

### 场景3：主子表模式（Master-Detail）

**触发条件**：用户明确说明需要维护"主数据 + 子数据"的关系，如员工+学历、发票+明细。

**--groups 示例**：
```
"企业员工管理|sub:员工学历管理,员工工作经历管理"
```

**代码执行流程**（主子表处理）：
```
main() [多模块模式]
├── 解析 --groups 参数，提取 master、sub、rel、rel2
├── for group_info in master_detail_groups:
│   ├── master_table = table_map[master_name]
│   ├── master_fields = master_table['fields'].copy()
│   │
│   ├── [处理 sub 子表]
│   │   ├── for detail_name in sub_tables:
│   │   │   ├── leaf_field = create_leaf_field()   # 创建分隔行配置
│   │   │   ├── master_fields.append(leaf_field)    # 添加到主表字段列表
│   │   │   └── [为子表添加外键字段（如不存在）]
│   │   └── master_table['fields'] = master_fields
│   │
│   ├── [处理 rel 关联表 - 一对多]
│   │   ├── for rel_name in rel_tables:
│   │   │   ├── rel_info = get_rel_field_info()     # 获取关联字段信息
│   │   │   └── 更新主表中关联字段的 list_format
│   │
│   └── [处理 rel2 关联表 - 多对多]
│       ├── for rel2_name in rel2_tables:
│       │   ├── create_rel2_field()                 # 创建虚拟关联字段
│       │   └── master_fields.append(rel2_field)
│       └── master_table['fields'] = master_fields
│
├── modules_to_generate 包含：主表 + 所有子表 + 关联表
├── rel2_middle_tables 包含：中间表（创建模块但不生成菜单）
│
├── [生成各模块配置]
│   ├── design_module_config()     → 31列模块配置
│   ├── design_field_configs()     → 37列字段配置（传入 master_table_fields 用于外键检测）
│   └── design_menu_config()       → 15列菜单配置
│
├── validate_list_format_configs() → 校验 rel/rel2/leaf/tree 格式
└── generate_multi_module_excel()  → 生成合并的 Excel
```

---

### 场景4：关联表模式（rel 一对多）

**触发条件**：用户需要在一个模块中展示并选择另一个模块的数据（一对多关系）。

**典型场景**：人员管理模块中需要选择"性格标签"（一个人可以有多个标签）。

**--groups 示例**：
```
"人员管理|rel:性格标签管理"
```

**主表中需要包含的关联字段**：
- `tag_uuid`（字段名必须与关联表主键名完全一致）

**代码处理逻辑**：
```python
# get_rel_field_info() 函数
1. 在 table_map 中查找关联表（tag）
2. 获取关联表的显示字段（find_display_field，通常是有 name 后缀的字段）
3. 获取关联表的主键字段名（tag_uuid）
4. 返回 {'field_name': 'tag_uuid', 'list_format': 'rel:eg_m_tag&tag_name'}

# 主表中关联字段更新
for field in master_fields:
    if field.get('name') == 'tag_uuid':
        field['list_format'] = 'rel:eg_m_tag&tag_name'  # 一对多格式化
        field['list_fixed'] = 'R'                         # 固定在右侧
        field['form_enable'] = ''                         # 不在表单中显示
```

---

### 场景5：多对多关联模式（rel2）

**触发条件**：用户需要通过中间表维护两个模块间的多对多关系。

**典型场景**：人员管理和权限管理之间的多对多关系，通过"人员权限关系表"中间表实现。

**--groups 示例**：
```
"人员管理|rel2:权限管理"  # 自动查找中间表
"人员管理|rel2:权限管理,人员权限关系表"  # 显式指定中间表
```

**中间表结构要求**（强制）：
| 字段 | 说明 | 示例 |
|------|------|------|
| `uuid` | 主键（不带表名前缀） | `uuid` |
| `{主表简称}_uuid` | 指向主表的外键 | `person_uuid` |
| `{关联表简称}_uuid` | 指向关联表的外键 | `permission_uuid` |

**代码处理逻辑**：
```python
# create_rel2_field() 函数
1. 在 table_map 中查找关联表（permission）
2. 获取关联表的显示字段和模块key
3. 查找中间表：
   - 显式指定：直接使用 --groups 中指定的中间表
   - 自动搜索：遍历 table_map 查找同时包含主表外键和关联表外键的表
4. 返回虚拟行配置（data_dict='', field_name=''）
5. list_format = 'rel2:eg_m_permission&perm_name&eg_m_person_permission'
```

---

### 场景6：交互模式（已废弃）

**命令行**：`python generate_module_excel.py --interactive`

**说明**：手动输入表名、字段信息等。已废弃，推荐使用 `--table-info` 传入 AI 设计的结构。

---

## 三、核心函数详解

### 3.1 验证函数

| 函数 | 验证内容 | 规则 |
|------|---------|------|
| `validate_field_name()` | 字段名格式 | `^[a-z][a-z0-9_]*$` |
| `validate_data_type()` | 数据类型 | varchar(n), char(n), decimal(m,n), int(n), datetime, long |
| `validate_module_key()` | 模块key格式 | `^eg_m_[a-z][a-z0-9_]*$` |
| `validate_table_name_en()` | 表英文名格式 | `^[a-z][a-z0-9_]*$` |
| `validate_menu_id()` | 菜单ID唯一性 | 不能重复 |

---

### 3.2 设计函数

#### `design_module_config(table_info)`
生成31列表格模块配置。

**返回值**：
```python
{
    'module_key': 'eg_m_{table_name_en}',
    'module_name': '{table_name_cn}',
    'grid_serial': '', 'grid_border': '', 'grid_selection_type': 'checkbox',
    'grid_columns_edit': '1', 'grid_columns_delete': '1', 'grid_columns_detail': '1',
    'toolbar_add': '1', 'toolbar_delete': '1', 'toolbar_edit': '1',
    'toolbar_download': '1', 'toolbar_setting': '1', 'toolbar_full': '1',
    'toolbar_reload': '1', 'toolbar_filter': '1',
    'form_layout': 'horizontal', 'form_width': '960',
    # ... 其他字段默认空
}
```

**树形模块特殊处理**：检测到 tree_id/tree_name/tree_parent_id 时，使用 `automatic_page_tree` 组件，工具栏按钮简化。

---

#### `design_field_configs(table_info, module_info, master_table_fields=None)`
生成37列表格字段配置。

**处理流程**：
```
1. 添加模块首行：data_dict = '{module_name} {module_key}'，A列到AK列合并
2. 遍历 fields：
   ├── data_dict：根据字段来源设置（表名 / 空 for leaf/rel2）
   ├── field_name：普通字段用字段名，leaf/rel2 为空
   ├── list_format：
   │   ├── tree:key / tree:title / tree:parent_key（树形模块）
   │   ├── 数值类型：0,0.00 / 0,0
   │   ├── 日期类型：YYYY-MM-DD
   │   ├── rel: / rel2: / leaf:（关联表字段）
   │   └── 普通字段：空
   ├── list_width：根据类型设置（数值150，日期150，长文本180，默认100）
   ├── list_hidden：
   │   ├── 主键字段：'1'
   │   └── 外键字段（_uuid结尾）：'1'
   ├── list_fixed：leaf/rel/rel2 字段设置为 'R'
   ├── form_type：
   │   ├── 主键：Hidden
   │   ├── 外键字段：Hidden
   │   ├── 数值类型：InputNumber
   │   ├── 日期类型：DatePicker
   │   └── 普通字段：Input
   ├── form_validation：
   │   ├── 必填字段：'必录'
   │   ├── 字符类型：'varchar2(n)'
   │   └── 数值类型：'number(n)'
   └── 筛选项智能推断：
       ├── 日期类型：DatePicker + range + 布局66
       └── 数值类型：InputNumber + range + 布局66
```

---

#### `design_menu_config(module_info, table_info=None)`
生成15列表格菜单配置。

**返回菜单结构**：
```python
{
    'menu_id': 随机8位数字,
    'parent_id': '',
    'menu_name': module_name,
    'menu_path': f'/aigenerator/cfgp/{module_key}',
    'component': './common/automatic_page' or './common/automatic_page_tree',
    'menu_type': '1',
    'roles': '管理员'
}
```

---

### 3.3 关联处理函数

#### `create_leaf_field(child_module_key, display_field, label)`
创建主子表分隔行配置（leaf）。

**返回**：
```python
{
    'data_dict': '',           # 虚拟行特征
    'name': '',                # 虚拟行特征
    'name_cn': '教育经历',     # 显示文本
    'list_enable': '1',
    'list_width': '90',
    'list_fixed': 'R',
    'list_format': 'leaf:eg_m_staff_education&staff_name',
    'form_enable': '',
    'form_type': ''
}
```

#### `get_rel_field_info(rel_module_name, table_map, master_table)`
获取 rel 一对多关联字段信息。

**返回**：
```python
{
    'field_name': 'tag_uuid',                    # 必须与关联表主键一致
    'list_format': 'rel:eg_m_tag&tag_name'
}
```

#### `create_rel2_field(rel2_module_name, table_map, master_table, explicit_ref_table=None)`
创建 rel2 多对多关联字段配置。

**返回**：
```python
{
    'data_dict': '',
    'field_name': '',
    'name_cn': '权限管理',
    'list_enable': '1',
    'list_width': '120',
    'list_fixed': 'R',
    'list_format': 'rel2:eg_m_permission&perm_name&eg_m_person_permission',
    'form_enable': '',
    'form_type': ''
}
```

---

### 3.4 校验函数

#### `validate_list_format_configs(modules, table_map, master_detail_groups)`
校验所有模块的列表项格式化配置（rel/rel2/leaf/tree）。

#### `validate_rel_format()`
校验 rel 格式，验证：
- 关联模块是否存在
- 显示字段是否存在
- 主表是否包含关联字段（字段名必须与关联表主键一致）

#### `validate_rel2_format()`
校验 rel2 格式，验证：
- 关联模块是否存在
- 中间表主键是否为 `uuid`（不带表名前缀）
- 中间表是否包含指向主表的外键
- 中间表是否包含指向关联表的外键

#### `validate_leaf_format()`
校验 leaf 格式，验证：
- 子模块是否在主子表关系中
- 子表是否存在
- 子表是否包含指向主表的外键

#### `validate_tree_format()`
校验 tree 格式，验证：
- tree:key 需要 tree_id 字段
- tree:title 需要 tree_name 字段
- tree:parent_key 需要 tree_parent_id 字段

---

### 3.5 Excel 生成函数

#### `generate_module_excel(table_info, module_info, field_configs, menu_configs, output_path)`
生成单模块 Excel。

**Sheet 结构**：

| Sheet | 内容 | 样式 |
|-------|------|------|
| 表 | 表头 + 表名行（特殊样式） + 字段行 | 表名行：11pt，浅橙色背景 |
| 模块 | 表头（31列彩色） + 模块配置行 | 1-2淡绿，3-6淡紫，7-18淡黄... |
| 字段 | 表头（37列彩色） + 模块首行（合并A-AK） + 字段行 | 模块首行：浅橙色背景 |
| 菜单 | 表头（15列） + 菜单行 | - |

#### `generate_multi_module_excel(modules, output_path)`
生成多模块合并 Excel。

**写入规则**：
- 表 Sheet：每个模块追加表名行和字段行；跳过分隔行（data_dict为空）和 rel2 虚拟字段
- 模块 Sheet：每个模块追加一行
- 字段 Sheet：每个模块追加模块首行 + 字段配置行
- 菜单 Sheet：每个模块追加一行（rel2 中间表除外）

---

## 四、样式定义

```python
# 表头样式
HEADER_FONT = Font(name='Microsoft YaHei', size=9, bold=True)
HEADER_FILL = PatternFill(fill_type='solid', fgColor='FFD9D9D9')  # 浅灰色

# 模块Sheet表头渐变色
MODULE_HEADER_FILLS = [
    'FFEBF1DE',  # 1-2列：淡绿色
    'FFE4DFEC',  # 3-6列：淡紫色
    'FFDDD9C4',  # 7-18列：淡黄色
    'FFC5D9F1',  # 19-25列：淡蓝色
    'FFFDE9D9',  # 26-28列：淡橙色
    'FFE4DFEC',  # 29-30列：淡紫色
    'FFD9D9D9',  # 31列：浅灰色
]

# 字段Sheet表头渐变色
FIELD_HEADER_FILLS = [
    'FFD9D9D9',  # 1-5列：浅灰色
    'FF92CDDC',  # 6-17列：浅蓝色
    'FFDAEEF3',  # 18-24列：极浅蓝
    'FFB1A0C7',  # 25-36列：淡紫色
    'FFD9D9D9',  # 37列：浅灰色
]

# 表名行 / 模块首行样式
TABLE_NAME_FILL = PatternFill(fill_type='solid', fgColor='FFFCD5B4')  # 浅橙色
TABLE_NAME_FONT = Font(name='Microsoft YaHei', size=11, bold=True)
```

---

## 五、命令行参数汇总

| 参数 | 说明 | 示例 |
|------|------|------|
| `--table-info` | 表结构JSON（可多次指定） | `'{"table_name_cn":"...","fields":[...]}'` |
| `--groups` | 模块组定义 | `"主表|sub:子表\|rel:关联表\|rel2:关联表"` |
| `--output` | 输出目录 | `./exports/module_configs/` |
| `--interactive` | 交互模式（已废弃） | - |
| `--requirement` | 需求描述（旧模式，已废弃） | `"考勤录入管理"` |
| `--multi` | 主子表模式（旧参数，已废弃） | - |

---

## 六、输出文件

**位置**：`./exports/module_configs/`

**命名规则**：
- 单模块：`{模块名称}_{模块key}_{timestamp}.xlsx`
- 多模块：`多模块合并_{timestamp}.xlsx`

---

## 七、完整代码执行流程图

```
┌─────────────────────────────────────────────────────────────────┐
│ main()                                                           │
├─────────────────────────────────────────────────────────────────┤
│ 1. 解析命令行参数                                                 │
│    argparse → args.table_info, args.groups, args.output          │
├─────────────────────────────────────────────────────────────────┤
│ 2. 多模块模式 (len(args.table_info) > 1)                        │
│    │                                                             │
│    ├─ 解析所有 --table-info JSON                                  │
│    ├─ 构建 table_map (中文名→表信息)                              │
│    ├─ 解析 --groups 参数                                          │
│    │   └─ 提取 master, sub, rel, rel2, rel2_ref                  │
│    │                                                             │
│    ├─ 处理主子表关系                                               │
│    │   ├─ 为主表创建 leaf 分隔行（sub子表）                        │
│    │   ├─ 更新主表 rel 字段的 list_format                          │
│    │   ├─ 为主表添加 rel2 虚拟字段                                 │
│    │   └─ 为子表添加外键（如不存在）                               │
│    │                                                             │
│    ├─ 确定 modules_to_generate                                   │
│    │   ├─ 主表                                                    │
│    │   ├─ 所有子表                                                │
│    │   ├─ rel 关联表                                              │
│    │   ├─ rel2 关联表                                             │
│    │   └─ rel2 中间表（不生成菜单）                                │
│    │                                                             │
│    ├─ 生成各模块配置                                               │
│    │   ├─ design_module_config()                                 │
│    │   ├─ design_field_configs()                                 │
│    │   └─ design_menu_config()                                   │
│    │                                                             │
│    ├─ 校验列表项格式                                               │
│    │   └─ validate_list_format_configs()                        │
│    │                                                             │
│    └─ generate_multi_module_excel()                               │
│         ├─ 创建 Workbook                                         │
│         ├─ 写入 表 Sheet（多模块追加）                             │
│         ├─ 写入 模块 Sheet（多模块追加）                           │
│         ├─ 写入 字段 Sheet（多模块追加）                           │
│         └─ 写入 菜单 Sheet（多模块追加）                           │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│ 3. 单模块模式                                                     │
│    │                                                             │
│    ├─ 解析 --table-info 或 --interactive                         │
│    ├─ design_module_config()                                      │
│    ├─ design_field_configs()                                      │
│    ├─ design_menu_config()                                        │
│    └─ generate_module_excel()                                     │
│         ├─ 创建 Workbook                                         │
│         ├─ 写入 表 Sheet                                         │
│         ├─ 写入 模块 Sheet                                       │
│         ├─ 写入 字段 Sheet                                       │
│         └─ 写入 菜单 Sheet                                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 八、关键业务规则

### 8.1 rel2 中间表主键规则（强制）
- 中间表主键**必须**使用 `uuid`（不带任何表名前缀）
- 错误：`person_permission_uuid` ❌
- 正确：`uuid` ✅

### 8.2 子表外键命名规则
- 子表外键**必须采用主表主键的完整名称**
- 主表主键：`person_uuid`
- 子表外键：`person_uuid` ✓

### 8.3 rel 关联字段命名规则
- 主表中存储关联ID的字段名**必须与关联表主键名完全一致**
- 关联表主键：`tag_uuid`
- 主表关联字段：`tag_uuid` ✓

### 8.4 rel/rel2/leaf 行表单项规则
- 这些行的表单项配置（form_enable, form_type 等）**全部为空**
- 它们是虚拟行，不在表单中显示
