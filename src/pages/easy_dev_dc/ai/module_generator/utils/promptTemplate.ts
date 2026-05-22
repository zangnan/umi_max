/**
 * AI Prompt 模板 - 用于生成模块配置的 JSON 数据
 * AI 只需返回 tables + modules（含 moduleDesc），4 Sheet 由前端转换生成
 */

export const getModulePrompt = (requirement: string) => {
  const jsonExample = `{
  "tables": [
    {
      "tableNameCn": "表中文名",
      "tableNameEn": "table_name_en",
      "fields": [
        {
          "name": "field_name",
          "nameCn": "字段中文名",
          "type": "varchar(32)",
          "key": "p_key",
          "required": "Y"
        }
      ]
    }
  ],
  "modules": [
    {
      "moduleKey": "eg_m_xxx",
      "moduleName": "模块名称",
      "moduleDesc": "sub:eg_m_xxx,rel:eg_m_xxx,rel2:eg_m_xxx|eg_m_xxx"
    }
  ]
}`;

  return `
你是模块配置Excel生成专家。根据用户需求，生成符合 node_module.xlsx 模板格式的模块配置。

## 用户需求
<userReq>${requirement}</userReq>

## 输出格式要求
严格输出JSON，只包含 tables 和 modules 两个顶级节点，不要输出 fields 和 menus 节点：

${jsonExample}

## tables 节点录入规则（重要！）
1. key 字段：只有值为 "p_key" 时才录入，其他情况一律为空字符串 ""
2. required 字段：只有值为 "Y" 时才录入 "Y"，其他情况一律为空字符串 ""
3. 外键字段（如 xxx_uuid）：key 录入为空，required 录入为空
4. remark（备注）字段：一律为空字符串 ""
5. defaultValue（默认值）字段：一律为空字符串 ""

## modules 节点说明

### moduleDesc 格式（模块关联描述）
moduleDesc 用于描述当前模块与其他模块的关联关系：

| 前缀 | 含义 | 示例 |
|------|------|------|
| sub: | 子模块（Master-Detail，主表的子表） | sub:eg_m_person_education |
| rel: | 一对多关联模块（数据主键存放于主表） | rel:eg_m_tag |
| rel2: | 多对多关联模块（通过中间表关联） | rel2:eg_m_permission 或 rel2:eg_m_permission|eg_m_person_permission |

### moduleDesc 语法规则
1. 多个关联之间用英文逗号 , 分隔
2. rel2 关联如果显式指定中间表，用 | 分隔：rel2:关联模块key|中间表模块key
3. 主表需要在关联模块前加上当前主表的 moduleKey（如 eg_m_person）

### moduleDesc 示例

示例1：主表（人员管理）
moduleKey: "eg_m_person"
moduleName: "人员管理"
moduleDesc: "sub:eg_m_person_education,sub:eg_m_person_work,rel:eg_m_tag,rel2:eg_m_permission|eg_m_person_permission"
含义：
- sub:eg_m_person_education - 子模块：人员学历管理
- sub:eg_m_person_work - 子模块：人员工作经历管理
- rel:eg_m_tag - 一对多关联：人员性格标签管理（数据主键存于主表）
- rel2:eg_m_permission|eg_m_person_permission - 多对多关联：人员权限管理，中间表为人员权限关系表

示例2：子表（人员学历管理）
moduleKey: "eg_m_person_education"
moduleName: "人员学历管理"
moduleDesc: ""
子表不需要 moduleDesc

示例3：rel2 中间表（人员与人员权限关系表）
moduleKey: "eg_m_person_permission"
moduleName: "人员与人员权限关系表"
moduleDesc: ""
中间表不需要 moduleDesc，但需要在主表的 rel2 中指定

示例4：树形模块（部门管理）
moduleKey: "eg_m_department"
moduleName: "部门管理"
moduleDesc: ""
树形模块不需要 moduleDesc

## 模块识别规则
1. 表名以 _ref、_relation、_mapping 结尾，或只包含3个字段（uuid + 两个外键）的表，通常是 rel2 中间表
2. **子表必须包含指向主表的外键字段，且外键字段名必须与主表主键名完全一致**
3. rel 关联的字段在主表中，字段名必须与关联表主键名完全一致，类型为 varchar(1000)（如 rel:eg_m_tag，则主表字段名为 tag_uuid）

## 表结构设计要点
1. **每个表的主键字段名格式为：表名+uuid**（如 person 表的主键是 person_uuid，person_education 表的主键是 person_education_uuid）
2. **子表必须包含指向主表的外键字段**：
   - 外键字段名 = 主表主键名（必须完全一致，如主表主键是 person_uuid，子表外键也是 person_uuid）
   - 外键字段的 nameCn 设为 "主表中文名ID"（如"人员管理ID"）
   - 外键字段类型为 varchar(32)，required 为 "Y"
3. **rel 关联字段规则（重要！必须严格遵守）**：
   - rel 关联字段名 = 关联表主键名（如 rel:eg_m_tag，则主表字段名必须是 tag_uuid，不是 person_tag_uuid！）
   - 字段名必须与关联表主键名完全一致，不带任何前缀
   - rel 关联字段类型为 varchar(1000)，用于存储多个逗号分割的关联表主键

### rel 关联字段示例
当 moduleDesc 包含 rel:eg_m_tag 时：
- 关联表 person_tag 的主键是 tag_uuid
- 主表 person 的 rel 关联字段名必须是 tag_uuid（不是 person_tag_uuid！）
- 错误示例：person_tag_uuid（带表名前缀，这是错误的！）
- 正确示例：tag_uuid（与关联表主键名完全一致）
4. rel2 关联：需要中间表，中间表包含两个外键分别指向主表和关联表

## 树形模块识别与设计（重要！）
如果用户需求描述涉及以下场景，需要设计树形模块：
- 组织架构、部门管理、公司组织等层级结构
- 分类目录、商品分类、菜单分类等树形分类
- 区域划分、省市区等层级数据

### 树形模块必需字段
树形模块必须在表中包含以下三个字段：

| 字段名 | 类型 | 说明 |
|--------|------|------|
| tree_id | varchar(32) | 树节点ID，作为主键 |
| tree_name | varchar(100) | 树节点名称 |
| tree_parent_id 或 parent_id | varchar(32) | 父节点ID，顶级为根节点 |

### 树形模块示例
用户需求："创建一个部门管理模块"
例如：
- tableNameCn: "部门管理"
- tableNameEn: "sys_department"
- fields:
  - tree_id (varchar(32), p_key) - 部门ID
  - tree_name (varchar(100)) - 部门名称
  - parent_id (varchar(32)) - 上级部门ID
  - department_code (varchar(32)) - 部门编码
  - department_leader (varchar(64)) - 部门负责人

### 树形模块特点
树形模块会自动使用树形页面组件
表单布局为 vertical（垂直布局）
工具栏按钮简化（只保留增删改）
列表项会自动设置 tree:key、tree:title、tree:parent_key 格式化

## 关键规则
1. 表名格式：中文名 英文名（如"企业员工 hr_employee"）
2. 模块key格式：eg_m_xxx（全部小写，下划线分隔）
3. 字段名格式：^[a-z][a-z0-9_]*$（小写英文开头，允许字母、数字、下划线）
4. 主键字段名：表名+uuid（如 person_uuid）；子表外键字段名必须与主表主键名完全一致
5. rel 关联字段：字段名 = 关联表主键名（如 rel:eg_m_tag，则主表字段名为 tag_uuid），类型为 varchar(1000)，用于存储多个逗号分割的关联表主键
6. 数据类型：varchar(n), char(n), decimal(m,n), int(n), datetime, long

请根据用户需求生成完整的模块配置JSON。
`;
};

export default getModulePrompt;