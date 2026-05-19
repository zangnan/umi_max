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

## 模块识别规则
1. 表名以 _ref、_relation、_mapping 结尾，或只包含3个字段（uuid + 两个外键）的表，通常是 rel2 中间表
2. 子表需要包含指向主表的外键字段（如 person_uuid）
3. rel 关联的字段在主表中（如 tag_uuid）

## 表结构设计要点
1. 每个表必须有主键字段：name=uuid, key=p_key, type=varchar(32)
2. 子表需要包含指向主表的外键：字段名 = 主表主键名（如 person_uuid）
3. rel 关联：关联表主键是什么，主表中就存储什么名字的字段
4. rel2 关联：需要中间表，中间表包含两个外键分别指向主表和关联表

## 关键规则
1. 表名格式：中文名 英文名（如"企业员工 hr_employee"）
2. 模块key格式：eg_m_xxx（全部小写，下划线分隔）
3. 字段名格式：^[a-z][a-z0-9_]*$（小写英文开头，允许字母、数字、下划线）
4. 主键字段名：uuid（不带表名前缀）
5. 外键字段：以 _uuid 结尾
6. 数据类型：varchar(n), char(n), decimal(m,n), int(n), datetime, long

请根据用户需求生成完整的模块配置JSON。
`;
};

export default getModulePrompt;