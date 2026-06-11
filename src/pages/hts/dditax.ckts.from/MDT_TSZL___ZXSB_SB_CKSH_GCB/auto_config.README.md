# auto_config 转换说明

> 本文件由 `scripts/convert-ddbunit-config.js` 自动生成，描述新旧配置的字段映射关系。

## 路径信息

- **源文件路径**：`D:\work\ddit\code\umi_max.260226_github\code_sample\src\pages\hts\dditax.ckts.from\MDT_TSZL___ZXSB_SB_CKSH_GCB\auto_config.tsx`
- **目标文件路径**：`D:\work\ddit\code\umi_max.260226_github\src\pages\hts\dditax.ckts.from\MDT_TSZL___ZXSB_SB_CKSH_GCB\auto_config.tsx`
- **参考标准**：`src/pages/example/json_page/unit/config.tsx`
- **协议基础**：`src/components/DDBunit/DDBunit2.types.ts`
- **配置变量名**：`unitConfig`

## 顶层 key 映射表

| # | 源 key | 目标 key | 处理 |
| --- | --- | --- | --- |
| 1 | `unit_key` | `module_key` | 重命名 |
| 2 | `costomer_toobar` | `customer_toolbar` | 重命名 |
| 3 | — | `import CONSTANTS from '@/components/DDAssist/constants';` | 新增 import |
| 4 | `format: 'yyyy-...'` | `format: 'YYYY-...'` | 归一化 (r8) |
| 5 | grid_columns 特殊字段补全 | ellipsis: true 等 | 应用规则 (r11) |

## 详细变化

### 重命名的 key
- `unitConfig.unit_key` → `unitConfig.module_key`
- `unitConfig.costomer_toobar` → `unitConfig.customer_toolbar`

### 嵌套重命名的 key
（无）

### 删除的 key
（无）

### 新增的 import
- `import CONSTANTS from '@/components/DDAssist/constants';`

### render 函数形式转换（r7）
（无）

### 日期格式归一化（r8）
- 共归一化 **9** 处 `format: 'yyyy-...'` → `format: 'YYYY-...'`（小写 yyyy = ISO week year，跨年周附近会偏差 1 年；项目统一使用大写 YYYY = 日历年）

### 特殊字段处理（r11）
- 共应用 **8** 处特殊字段规则（如 `grid_columns` 里 `title: '业务类型代码'` 自动补 `ellipsis: true`）

## 保留未改动的部分

- `filter_items` 内容（结构兼容）
- `grid_columns` 内容（结构兼容）
- `customer_toolbar` 数组项（仅 key 重命名，项内容不动）
- `layout_type: 'tz'` 业务语义

## 后续工作

- [ ] 迁移 `func.tsx` 中对应表单到 `form_items`
- [ ] 迁移对应消费者组件
- [ ] 端到端运行 `npm run dev` 验证
