/**
 * 将 AI 返回的 JSON 数据转换为符合 node_module.xlsx 格式的 4 Sheet 结构
 * AI 返回简化数据（仅 tables + modules 含 moduleDesc），前端负责生成完整 4 Sheet
 */

import type { AIResponseData, SheetData, TableSheetRow, ModuleSheetRow, FieldSheetRow, MenuSheetRow, ModuleRelation, TableInfo, ModuleInfo } from '../types/module';
import DDIT_TOOL_CONSTANTS from '@/components/DDBunit/excelConfig.v2.constants';
import DDBunit2ADBUtil from '@/components/DDBunit/DDBunit2ADBUtil';

const CKEY = DDIT_TOOL_CONSTANTS.CONFIG_KEY;

// 使用 SHEET_CONFIG_MODULE_NODE 的 defaultValue 构建默认值对象（只用英文 dataIndex）
const getDefaultModuleConfig = (): Record<string, string> => {
  const defaultConfig: Record<string, string> = {};
  DDIT_TOOL_CONSTANTS.SHEET_CONFIG_MODULE_NODE.forEach((item: any) => {
    defaultConfig[item.dataIndex] = item.defaultValue ?? '';
  });
  return defaultConfig;
};

// 使用 SHEET_TABLE_FIELD 的 defaultValue 构建默认值对象（只用英文 dataIndex）
const getDefaultTableConfig = (): Record<string, string> => {
  const defaultConfig: Record<string, string> = {};
  DDIT_TOOL_CONSTANTS.SHEET_TABLE_FIELD.forEach((item: any) => {
    defaultConfig[item.dataIndex] = item.defaultValue ?? '';
  });
  return defaultConfig;
};

// 使用 SHEET_CONFIG_FIELD_NODE 的 defaultValue 构建默认值对象（只用英文 dataIndex）
const getDefaultFieldConfig = (): Record<string, string> => {
  const defaultConfig: Record<string, string> = {};
  DDIT_TOOL_CONSTANTS.SHEET_CONFIG_FIELD_NODE.forEach((item: any) => {
    defaultConfig[item.dataIndex] = item.defaultValue ?? '';
  });
  return defaultConfig;
};

// 表 Sheet 列定义（7列）
const TABLE_COLUMNS = DDIT_TOOL_CONSTANTS.SHEET_TABLE_FIELD.map((item: any) => item.title);

// 模块 Sheet 列定义（31列）
const MODULE_COLUMNS = DDIT_TOOL_CONSTANTS.SHEET_CONFIG_MODULE_NODE.map((item: any) => item.title);

// 字段 Sheet 列定义（37列）
const FIELD_COLUMNS = DDIT_TOOL_CONSTANTS.SHEET_CONFIG_FIELD_NODE.map((item: any) => item.title);

// 菜单 Sheet 列定义（15列）
const MENU_COLUMNS = DDIT_TOOL_CONSTANTS.SHEET_MENU_NODE.map((item: any) => item.title);

// ============== 工具函数 ==============

/**
 * 解析 moduleDesc 字符串为 ModuleRelation 数组
 * 格式: "sub:eg_m_xxx,rel:eg_m_xxx,rel2:eg_m_xxx|eg_m_xxx"
 */
const parseModuleDesc = (moduleDesc: string): ModuleRelation[] => {
  const relations: ModuleRelation[] = [];
  if (!moduleDesc) return relations;

  const parts = moduleDesc.split(',');
  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.startsWith('sub:')) {
      relations.push({
        type: 'sub',
        moduleKey: trimmed.substring(4),
      });
    } else if (trimmed.startsWith('rel:')) {
      relations.push({
        type: 'rel',
        moduleKey: trimmed.substring(4),
      });
    } else if (trimmed.startsWith('rel2:')) {
      const rest = trimmed.substring(5);
      const rel2Parts = rest.split('|');
      relations.push({
        type: 'rel2',
        moduleKey: rel2Parts[0],
        refModuleKey: rel2Parts[1] || undefined,
      });
    }
  }
  return relations;
};

/**
 * 根据字段类型判断类别
 */
const getFieldTypeCategory = (dataType: string): 'number' | 'date' | 'string' => {
  const dt = dataType.toLowerCase();
  if (dt.includes('decimal') || dt.includes('int') || dt.includes('long')) {
    return 'number';
  }
  if (dt.includes('date')) {
    return 'date';
  }
  return 'string';
};

/**
 * 获取数值格式化字符串
 */
const getNumberFormat = (dataType: string): string => {
  const dt = dataType.toLowerCase().replace('unsigned', '').replace('(', ',').replace(')', '');
  const parts = dt.split(',');
  if (parts.length > 1) {
    const baseType = parts[0].trim();
    if (baseType.includes('decimal')) {
      if (parts.length > 2) {
        const decimalPlaces = parts[2].trim();
        if (decimalPlaces === '0') {
          return '0,0';
        } else {
          return `0,0.${'0'.repeat(parseInt(decimalPlaces))}`;
        }
      }
      return '0,0';
    }
    return '0,0';
  }
  return '0,0';
};

/**
 * 判断是否为树形模块
 */
const isTreeModule = (fields: any[]): boolean => {
  const fieldNames = fields.map(f => f.name?.toLowerCase() || '');
  return fieldNames.some(n => n.includes('tree_id')) &&
         fieldNames.some(n => n.includes('tree_name')) &&
         (fieldNames.some(n => n.includes('tree_parent_id')) || fieldNames.some(n => n.includes('parent_id')));
};

/**
 * 查找显示字段（用于关联展示）
 */
const findDisplayField = (fields: any[]): string => {
  for (const f of fields) {
    const fname = f.name?.toLowerCase() || '';
    if (fname !== 'uuid' && fname !== 'id' && fname.includes('name')) {
      return f.name || '';
    }
  }
  for (const f of fields) {
    if (f.name?.toLowerCase() !== 'uuid' && f.name?.toLowerCase() !== 'id') {
      return f.name || '';
    }
  }
  return fields[0]?.name || '';
};

/**
 * 获取字符长度
 */
const getStringLength = (dataType: string): string => {
  const dt = dataType.toLowerCase().replace('varchar', '').replace('char', '').replace('(', '').replace(')', '').trim();
  return dt;
};

// ============== 字段配置推断 =============

/**
 * 推断单个字段的完整配置（只用英文 dataIndex）
 */
const inferFieldConfig = (field: any): Partial<FieldSheetRow> => {
  const config: any = {};

  const fieldName = field.name || '';
  const fieldType = (field.type || '').toLowerCase();
  const typeCategory = getFieldTypeCategory(fieldType);

  // 主键字段
  if (field.key === 'p_key') {
    config[CKEY.GRID_USED] = '1';      // 列表项开启
    config[CKEY.GRID_KEY] = '1';       // 列表项主键标识
    config[CKEY.GRID_HIDDEN] = '1';    // 列表项隐藏标识
    config[CKEY.GRID_FIXED] = '';
    config[CKEY.FORM_ITEM_USED] = '1'; // 表单项开启
    config[CKEY.FORM_ITEM_TYPE] = 'Hidden'; // 表单项类型
    config[CKEY.GRID_WIDTH] = fieldName === 'uuid' ? '0' : '100';
  }
  // 外键字段（_uuid 结尾但非主键）
  else if (fieldName.endsWith('_uuid')) {
    config[CKEY.GRID_HIDDEN] = '1';
    config[CKEY.GRID_FIXED] = '';
    config[CKEY.FORM_ITEM_USED] = '';
    config[CKEY.FORM_ITEM_TYPE] = 'Hidden';
  }
  else {
    // 日期类型
    if (typeCategory === 'date') {
      config[CKEY.GRID_WIDTH] = '150';
      config[CKEY.GRID_RENDER] = 'YYYY-MM-DD';
      config[CKEY.FORM_ITEM_TYPE] = 'DatePicker';
      config[CKEY.FORM_ITEM_FORMAT] = 'YYYY-MM-DD';
    }
    // 数值类型
    else if (typeCategory === 'number') {
      const numberFormat = getNumberFormat(fieldType);
      config[CKEY.GRID_WIDTH] = '140';
      config[CKEY.GRID_RENDER] = numberFormat;
      config[CKEY.GRID_ALIGN] = 'R';
      config[CKEY.FORM_ITEM_TYPE] = 'InputNumber';
      config[CKEY.FORM_ITEM_FORMAT] = numberFormat;
    }
    // 字符类型
    else if (fieldType.startsWith('varchar') || fieldType.startsWith('char')) {
      const length = getStringLength(fieldType);
      if (length && parseInt(length) > 500) {
        config[CKEY.GRID_WIDTH] = '180';
        config[CKEY.GRID_ELLIPSIS] = '1';
      } else {
        config[CKEY.GRID_WIDTH] = '120';
      }
    }

    // 调用 DDBunit2ADBUtil.getFieldDefaultRules 生成完整校验规则
    const fieldObj = {
      dictFieldNotNull: field.required,
      dictFieldName: field.name,
      dictFieldType: field.type,
    };
    const defaultRules = DDBunit2ADBUtil.getFieldDefaultRules({ fieldObj });
    const formItemRule = defaultRules?.excelStr || '';
    if (formItemRule) {
      config[CKEY.FORM_ITEM_RULE] = formItemRule;
    }

    // 默认列宽
    if (!config[CKEY.GRID_WIDTH]) {
      config[CKEY.GRID_WIDTH] = '100';
    }

    // 默认值
    config[CKEY.GRID_USED] = '1';
    config[CKEY.FORM_ITEM_USED] = '1';
    config[CKEY.FORM_ITEM_TYPE] = 'Input';
  }

  return config;
};

/**
 * 创建 leaf 分隔行（主子表分隔行）
 */
const createLeafField = (childModuleKey: string, displayField: string, label: string): FieldSheetRow => {
  // 使用默认配置
  const row = getDefaultFieldConfig();
  row[CKEY.DICT_NAME] = '';
  row[CKEY.DICT_FIELD_NAME] = '';
  row[CKEY.DICT_FIELD_DESC] = label;
  row[CKEY.GRID_USED] = '1';
  row[CKEY.GRID_WIDTH] = '90';
  row[CKEY.GRID_FIXED] = 'R';
  row[CKEY.GRID_RENDER] = `leaf:${childModuleKey}&${displayField}`;
  return row;
};

/**
 * 创建 rel 一对多关联字段配置
 */
const createRelField = (relModuleKey: string, displayField: string, relFieldName: string): FieldSheetRow => {
  // 使用默认配置
  const row = getDefaultFieldConfig();
  row[CKEY.DICT_NAME] = '';
  row[CKEY.DICT_FIELD_NAME] = relFieldName;
  row[CKEY.DICT_FIELD_DESC] = '';
  row[CKEY.GRID_RENDER] = `rel:${relModuleKey}&${displayField}`;
  row[CKEY.GRID_FIXED] = 'R';
  row[CKEY.GRID_HIDDEN] = '1';
  row[CKEY.FORM_ITEM_USED] = '';
  row[CKEY.FORM_ITEM_TYPE] = 'Hidden';
  return row;
};

/**
 * 创建 rel2 多对多关联虚拟字段
 */
const createRel2Field = (rel2ModuleKey: string, displayField: string, refModuleKey: string): FieldSheetRow => {
  // 使用默认配置
  const row = getDefaultFieldConfig();
  row[CKEY.DICT_NAME] = '';
  row[CKEY.DICT_FIELD_NAME] = '';
  row[CKEY.DICT_FIELD_DESC] = '';
  // 英文 dataIndex
  row[CKEY.DICT_NAME] = '';
  row[CKEY.DICT_FIELD_NAME] = '';
  row[CKEY.DICT_FIELD_DESC] = '';
  row[CKEY.GRID_USED] = '1';
  row[CKEY.GRID_WIDTH] = '120';
  row[CKEY.GRID_FIXED] = 'R';
  row[CKEY.GRID_RENDER] = `rel2:${rel2ModuleKey}&${displayField}&${refModuleKey}`;
  row[CKEY.FORM_ITEM_USED] = '';
  row[CKEY.FORM_ITEM_TYPE] = '';
  return row;
};

// ============== Sheet 生成 =============

/**
 * 构建模块首行（字段 Sheet 第一行）
 */
const createModuleHeaderRow = (moduleName: string, moduleKey: string): FieldSheetRow => {
  // 使用默认配置
  const row = getDefaultFieldConfig();
  // title 行用 dict_name 存储标题
  row[CKEY.DICT_NAME] = `${moduleName} ${moduleKey}`;
  row[CKEY.DICT_FIELD_NAME] = '';
  row[CKEY.DICT_FIELD_DESC] = '';
  // 标记为 title 行
  row['excelRowType'] = 'title';
  row['title'] = `${moduleName} ${moduleKey}`;

  // 清除所有其他字段的默认值，确保 title 行只有 dict_name 有值
  DDIT_TOOL_CONSTANTS.SHEET_CONFIG_FIELD_NODE.forEach((item: any) => {
    if (item.dataIndex !== CKEY.DICT_NAME &&
        item.dataIndex !== 'excelRowType' &&
        item.dataIndex !== 'title') {
      row[item.dataIndex] = '';
    }
  });

  return row;
};

/**
 * 生成模块配置（31列默认值）
 */
const createModuleConfig = (moduleInfo: ModuleInfo, isTree: boolean = false): ModuleSheetRow => {
  const defaultConfig = getDefaultModuleConfig();

  // 根据模块类型设置特定默认值
  if (isTree) {
    defaultConfig[CKEY.FORM_LAYOUT_TYPE] = 'vertical';
    defaultConfig[CKEY.GRID_SELECTION_TYPE] = '';
  } else {
    defaultConfig[CKEY.GRID_SELECTION_TYPE] = 'checkbox';
    defaultConfig[CKEY.FORM_LAYOUT_TYPE] = 'horizontal';
    defaultConfig[CKEY.FORM_WIDTH] = '960';
    defaultConfig[CKEY.GRID_COL_EDIT] = '1';
    defaultConfig[CKEY.GRID_COL_DEL] = '1';
    defaultConfig[CKEY.GRID_COL_DETAIL] = '1';
    defaultConfig[CKEY.TOOLBAR_DEFAULT_DOWNLOAD] = '1';
    defaultConfig[CKEY.TOOLBAR_DEFAULT_SETTING] = '1';
    defaultConfig[CKEY.TOOLBAR_DEFAULT_FULL] = '1';
    defaultConfig[CKEY.TOOLBAR_DEFAULT_RELOAD] = '1';
    defaultConfig[CKEY.TOOLBAR_DEFAULT_ADVANCED_FILTER] = '1';
  }

  const result = {
    ...defaultConfig,
    // 只使用英文 dataIndex
    [CKEY.MODULE_KEY]: moduleInfo.moduleKey,
    [CKEY.MODULE_NAME]: moduleInfo.moduleName,
  };
  return result;
};

/**
 * 生成菜单配置
 */
const createMenuConfig = (moduleInfo: ModuleInfo, isTree: boolean = false): MenuSheetRow => {
  const defaultConfig = getDefaultMenuConfig();

  const result = {
    ...defaultConfig,
    'menu_id': moduleInfo.moduleKey,
    'menu_parent_id': '',
    'web_resource_code': '',
    'menu_name': moduleInfo.moduleName,
    'menu_path': `/aigenerator/cfgp/${moduleInfo.moduleKey}`,
    'menu_light_path': '',
    'menu_icon': '',
    'menu_hide': '0',
    'menu_redirect': '',
    'menu_component': isTree ? './common/automatic_page_tree' : './common/automatic_page',
    'menu_active': '1',
    'menu_full_screen': '0',
    'menu_type': '1',
    'menu_index': '',
    'menu_role': '管理员',
  } as MenuSheetRow;
  return result;
};

// 使用 SHEET_MENU_NODE 的 defaultValue 构建默认值对象（只用英文 dataIndex）
const getDefaultMenuConfig = (): Record<string, string> => {
  const defaultConfig: Record<string, string> = {};
  DDIT_TOOL_CONSTANTS.SHEET_MENU_NODE.forEach((item: any) => {
    defaultConfig[item.dataIndex] = item.defaultValue ?? '';
  });
  return defaultConfig;
};

/**
 * 将 AI 返回的 JSON 数据转换为 4 Sheet 结构
 */
export const convertToSheets = (jsonData: AIResponseData): SheetData => {
  const tableSheet: TableSheetRow[] = [];
  const moduleSheet: ModuleSheetRow[] = [];
  const fieldSheet: FieldSheetRow[] = [];
  const menuSheet: MenuSheetRow[] = [];

  // 建立 tableNameEn -> TableInfo 的映射（支持智能匹配）
  // 例如 moduleKey 为 "eg_m_employee"，tableNameEn 为 "hr_employee" 时也能匹配
  const tableMap = new Map<string, TableInfo>();
  jsonData.tables?.forEach(t => {
    // 直接以 tableNameEn 为 key
    tableMap.set(t.tableNameEn, t);
    // 同时存储去掉常见前缀的版本（如 hr_employee -> employee）
    const shortName = t.tableNameEn.replace(/^(hr_|sys_|ap_|cm_)/i, '');
    if (shortName !== t.tableNameEn) {
      tableMap.set(shortName, t);
    }
  });

  // 建立 moduleKey -> tableNameEn 的映射（支持带 eg_m_ 前缀的模块）
  const moduleKeyToTableNameEn = new Map<string, string>();
  jsonData.modules?.forEach(m => {
    // 去掉 eg_m_ 前缀得到基础名
    const baseName = m.moduleKey.replace(/^eg_m_/, '');
    // 精确匹配：先检查 tableNameEn 是否等于 baseName 或去掉前缀的 tableNameEn
    let foundTableNameEn: string | undefined;
    jsonData.tables?.forEach(t => {
      const tableShortName = t.tableNameEn.replace(/^(hr_|sys_|ap_|cm_)/i, '');
      // 精确匹配条件：tableNameEn == baseName 或 tableNameEn == 去前缀的moduleKey
      if (t.tableNameEn === baseName || tableShortName === baseName || t.tableNameEn === m.moduleKey.replace(/^eg_m_/, '')) {
        foundTableNameEn = t.tableNameEn;
      }
    });
    // 如果没有精确匹配，尝试包含匹配（但只匹配 tableNameEn 包含 baseName 且 baseName 是完整的单词）
    if (!foundTableNameEn) {
      jsonData.tables?.forEach(t => {
        if (t.tableNameEn.includes(baseName) && (t.tableNameEn.endsWith(baseName) || t.tableNameEn.endsWith('_' + baseName))) {
          foundTableNameEn = t.tableNameEn;
        }
      });
    }
    // 如果还是没有找到，使用 baseName 作为默认值
    moduleKeyToTableNameEn.set(m.moduleKey, foundTableNameEn || baseName);
  });

  // 遍历每个模块生成数据
  jsonData.modules?.forEach((moduleInfo) => {
    // 从预建的映射中获取 tableNameEn，优先使用映射，否则 fallback 到直接提取
    const tableNameEn = moduleKeyToTableNameEn.get(moduleInfo.moduleKey) || moduleInfo.moduleKey.replace(/^eg_m_/, '');
    const tableInfo = tableMap.get(tableNameEn);

    if (!tableInfo) return;

    const isTree = isTreeModule(tableInfo.fields);
    const relations = parseModuleDesc(moduleInfo.moduleDesc || '');

    // ===== Sheet 1: 表 =====
    // 表名行
    const tableTitleRow = getDefaultTableConfig();
    tableTitleRow[CKEY.DICT_FIELD_NAME] = `${tableInfo.tableNameCn} ${tableInfo.tableNameEn}`;
    tableSheet.push(tableTitleRow);

    // 普通字段行
    tableInfo.fields?.forEach(field => {
      const fieldRow = getDefaultTableConfig();
      fieldRow[CKEY.DICT_FIELD_NAME] = field.name || '';
      fieldRow[CKEY.DICT_FIELD_DESC] = field.nameCn || '';
      fieldRow[CKEY.DICT_FIELD_TYPE] = field.type || '';
      fieldRow[CKEY.DICT_FIELD_KEY] = field.key || '';
      fieldRow[CKEY.DICT_FIELD_DEFAULT_VALUE] = field.defaultValue || '';
      fieldRow[CKEY.DICT_FIELD_NOT_NULL] = field.required || '';
      fieldRow[CKEY.DICT_FIELD_REMARK] = field.remark || '';
      tableSheet.push(fieldRow);
    });

    // ===== Sheet 2: 模块 =====
    moduleSheet.push(createModuleConfig(moduleInfo, isTree));

    // ===== Sheet 3: 字段 =====
    // 模块首行
    fieldSheet.push(createModuleHeaderRow(tableInfo.tableNameCn, moduleInfo.moduleKey));

    // 普通字段行
    tableInfo.fields?.forEach(field => {
      // 使用 SHEET_CONFIG_FIELD_NODE 的 defaultValue 作为基础配置
      const baseConfig = getDefaultFieldConfig();

      // 设置必要的字段
      baseConfig[CKEY.DICT_NAME] = tableNameEn;
      baseConfig[CKEY.DICT_FIELD_NAME] = field.name || '';
      baseConfig[CKEY.DICT_FIELD_DESC] = field.nameCn || '';

      const inferredConfig = inferFieldConfig(field);
      const finalConfig = { ...baseConfig, ...inferredConfig } as FieldSheetRow;
      fieldSheet.push(finalConfig);
    });

    // 如果是主表，添加关联字段
    if (relations.length > 0) {
      for (const relation of relations) {
        const relTableInfo = tableMap.get(relation.moduleKey.replace(/^eg_m_/, ''));

        if (relation.type === 'sub') {
          // 子表：添加 leaf 分隔行
          if (relTableInfo) {
            const displayField = findDisplayField(relTableInfo.fields);
            const label = inferLeafLabel(relTableInfo.tableNameCn);
            fieldSheet.push(createLeafField(relation.moduleKey, displayField, label));

            // 为子表添加外键字段（如果不存在）
            const mainTableFields = tableInfo.fields || [];
            const mainPkField = mainTableFields.find(f => f.key === 'p_key');
            if (mainPkField) {
              const fkFieldName = mainPkField.name;
              const subTableFields = relTableInfo.fields || [];
              const hasFk = subTableFields.some(f => f.name === fkFieldName);
              if (!hasFk) {
                // 子表需要添加指向主表的外键
                // 这个外键会被添加到子表的字段列表中
              }
            }
          }
        } else if (relation.type === 'rel') {
          // 一对多关联：主表中需要有关联字段
          if (relTableInfo) {
            const relPkField = relTableInfo.fields?.find(f => f.key === 'p_key');
            const relFieldName = relPkField?.name || '';
            const displayField = findDisplayField(relTableInfo.fields);
            if (relFieldName) {
              fieldSheet.push(createRelField(relation.moduleKey, displayField, relFieldName));
            }
          }
        } else if (relation.type === 'rel2') {
          // 多对多关联：添加 rel2 虚拟行
          if (relTableInfo) {
            const displayField = findDisplayField(relTableInfo.fields);
            const refModuleKey = relation.refModuleKey || '';
            fieldSheet.push(createRel2Field(relation.moduleKey, displayField, refModuleKey));
          }
        }
      }
    }

    // ===== Sheet 4: 菜单 =====
    menuSheet.push(createMenuConfig(moduleInfo, isTree));
  });

  return {
    tableSheet,
    moduleSheet,
    fieldSheet,
    menuSheet,
  };
};

/**
 * 推断 leaf 分隔行的显示文本
 */
const inferLeafLabel = (tableNameCn: string): string => {
  const patterns: [string[], string][] = [
    [['教育', '学历', '学习'], '教育经历'],
    [['工作', '履历', '经历'], '工作经历'],
    [['荣誉', '奖励', '称号'], '荣誉'],
    [['明细', '详情', '详细'], '明细'],
    [['附件', '文件', '图片'], '附件'],
  ];

  for (const [keywords, label] of patterns) {
    if (keywords.some(kw => tableNameCn.includes(kw))) {
      return label;
    }
  }

  return tableNameCn.slice(-4) || tableNameCn;
};

export { TABLE_COLUMNS, MODULE_COLUMNS, FIELD_COLUMNS, MENU_COLUMNS };
export default convertToSheets;