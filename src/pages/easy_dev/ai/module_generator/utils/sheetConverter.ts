/**
 * 将 AI 返回的 JSON 数据转换为符合 data_dict_template.xlsx 格式的 4 Sheet 结构
 * Java 版本：使用 SHEET_CONFIG_MODULE, SHEET_CONFIG_FIELD, SHEET_CONFIG_DICT_TABLE, SHEET_MENU
 */

import type { AIResponseData, SheetData, TableSheetRow, ModuleSheetRow, FieldSheetRow, MenuSheetRow, ModuleRelation, TableInfo, ModuleInfo, CodeTableItem, TableCodeSheetRow } from '../types/module';
import DDIT_TOOL_CONSTANTS from '@/components/DDBunit/excelConfig.v2.constants';
import DDBunit2ADBUtil from '@/components/DDBunit/DDBunit2ADBUtil';

const CKEY = DDIT_TOOL_CONSTANTS.CONFIG_KEY;

const COMMON_FIELDS_DATA = [
  { uuid: '1', dict_field_name: 'add_time', dict_field_desc: '新增时间', dict_field_type: 'datetime', dict_field_expr: 'sysdate' },
  { uuid: '2', dict_field_name: 'add_user_id', dict_field_desc: '新增人uuid', dict_field_type: 'varchar(32)', dict_field_expr: 'token:loginUserId' },
  { uuid: '3', dict_field_name: 'add_org_id', dict_field_desc: '新增人组织机构uuid', dict_field_type: 'varchar(32)', dict_field_expr: 'token:loginOrgId' },
  { uuid: '4', dict_field_name: 'update_time', dict_field_desc: '更新时间', dict_field_type: 'datetime', dict_field_expr: 'sysdate' },
  { uuid: '5', dict_field_name: 'update_user_id', dict_field_desc: '更新人uuid', dict_field_type: 'varchar(32)', dict_field_expr: 'token:loginUserId' },
  { uuid: '6', dict_field_name: 'update_org_id', dict_field_desc: '更新人组织机构uuid', dict_field_type: 'varchar(32)', dict_field_expr: 'token:loginOrgId' },
];

// ============== 默认配置构建 ==============

// 使用 SHEET_CONFIG_MODULE 的 defaultValue 构建默认值对象
const getDefaultModuleConfig = (): Record<string, string> => {
  const defaultConfig: Record<string, string> = {};
  DDIT_TOOL_CONSTANTS.SHEET_CONFIG_MODULE.forEach((item: any) => {
    if (item.dataIndex) {
      defaultConfig[item.dataIndex] = item.defaultValue ?? '';
    }
  });
  return defaultConfig;
};

// 使用 SHEET_CONFIG_DICT_TABLE 的 defaultValue 构建默认值对象
const getDefaultTableConfig = (): Record<string, string> => {
  const defaultConfig: Record<string, string> = {};
  DDIT_TOOL_CONSTANTS.SHEET_CONFIG_DICT_TABLE.forEach((item: any) => {
    if (item.dataIndex) {
      defaultConfig[item.dataIndex] = item.defaultValue ?? '';
    }
  });
  return defaultConfig;
};

// 使用 SHEET_CONFIG_FIELD 的 defaultValue 构建默认值对象
const getDefaultFieldConfig = (): Record<string, string> => {
  const defaultConfig: Record<string, string> = {};
  DDIT_TOOL_CONSTANTS.SHEET_CONFIG_FIELD.forEach((item: any) => {
    if (item.dataIndex) {
      defaultConfig[item.dataIndex] = item.defaultValue ?? '';
    }
  });
  return defaultConfig;
};

// 使用 SHEET_MENU 的 defaultValue 构建默认值对象
const getDefaultMenuConfig = (): Record<string, string> => {
  const defaultConfig: Record<string, string> = {};
  DDIT_TOOL_CONSTANTS.SHEET_MENU.forEach((item: any) => {
    if (item.dataIndex) {
      defaultConfig[item.dataIndex] = item.defaultValue ?? '';
    }
  });
  return defaultConfig;
};

// ============== 工具函数 ==============

/**
 * 解析 moduleDesc 字符串为 ModuleRelation 数组
 * 格式: "sub:xxx,rel:xxx,rel2:xxx|xxx"
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
  // 日期时间类型
  if (dt.includes('date') || dt.includes('time') || dt.includes('year') || dt === 'timestamp' || dt === 'datetime') {
    return 'date';
  }
  // 数值类型
  if (dt.includes('decimal') || dt.includes('numeric') || dt.includes('int') || dt.includes('bigint') ||
      dt.includes('smallint') || dt.includes('tinyint') || dt.includes('float') || dt.includes('double') ||
      dt.includes('real') || dt.includes('bit') || dt.includes('long')) {
    return 'number';
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

/**
 * 从 dictName 生成 tableName（用于表管理 Sheet）
 * 例如 s_employee -> employee
 */
const dictNameToTableName = (dictName: string): string => {
  return dictName.replace(/^s_/, '');
};

// ============== 字段配置推断 ==============

/**
 * 推断单个字段的完整配置（Java 版本）
 */
const inferFieldConfig = (field: any, tableNameEn: string = '', isTreeMod: boolean = false): Partial<FieldSheetRow> => {
  const config: any = {};

  const fieldName = field.name || '';
  const fieldNameLower = fieldName.toLowerCase();
  const fieldType = (field.type || '').toLowerCase();
  const typeCategory = getFieldTypeCategory(fieldType);
  const isKey = field.key === 'p_key';

  // 判断是否为外键字段（_uuid 结尾但非主键）
  const isForeignKey = !isKey && fieldNameLower.endsWith('_uuid');

  // 判断是否为树形模块特殊字段
  const isTreeIdField = fieldNameLower.includes('tree_id') && !fieldNameLower.includes('tree_parent_id');
  const isTreeNameField = fieldNameLower.includes('tree_name') && !fieldNameLower.includes('tree_parent_id');
  const isTreeParentField = fieldNameLower.includes('tree_parent_id') ||
    (fieldNameLower.includes('parent_id') && isTreeMod && !isKey);

  // 树形字段的 grid_render 格式化
  if (isTreeIdField) {
    config[CKEY.GRID_RENDER] = 'tree:key';
  } else if (isTreeNameField) {
    config[CKEY.GRID_RENDER] = 'tree:title';
  } else if (isTreeParentField) {
    config[CKEY.GRID_RENDER] = 'tree:parent_key';
  }

  // 主键字段
  if (isKey) {
    config[CKEY.GRID_USED] = '1';
    config[CKEY.GRID_KEY] = '1';
    config[CKEY.GRID_HIDDEN] = '1';
    config[CKEY.GRID_FIXED] = '';
    config[CKEY.FORM_ITEM_USED] = '1';
    config[CKEY.FORM_ITEM_TYPE] = 'Hidden';
    config[CKEY.GRID_WIDTH] = fieldName === 'uuid' ? '0' : '100';
  }
  // 外键字段（_uuid 结尾但非主键）
  else if (isForeignKey) {
    config[CKEY.GRID_HIDDEN] = '1';
    config[CKEY.GRID_FIXED] = '';
    config[CKEY.FORM_ITEM_USED] = '';
    config[CKEY.FORM_ITEM_TYPE] = 'Hidden';
  }
  // tree_parent_id 字段 - 表单隐藏
  else if (isTreeParentField) {
    config[CKEY.GRID_USED] = '1';
    config[CKEY.FORM_ITEM_USED] = '1';
    config[CKEY.FORM_ITEM_TYPE] = 'Hidden';
  }
  else {
    // 日期类型
    if (typeCategory === 'date') {
      config[CKEY.GRID_WIDTH] = '150';
      config[CKEY.GRID_RENDER] = 'YYYY-MM-DD';
      config[CKEY.FORM_ITEM_TYPE] = 'DatePicker';
      config[CKEY.FORM_ITEM_FORMAT] = 'YYYY-MM-DD';
      config[CKEY.FILTER_ITEM_TYPE] = 'DatePicker';
      config[CKEY.FILTER_ITEM_EXTEND] = 'range';
      config[CKEY.FILTER_ITEM_LAYOUT] = '66';
    }
    // 数值类型
    else if (typeCategory === 'number') {
      const numberFormat = getNumberFormat(fieldType);
      config[CKEY.GRID_WIDTH] = '140';
      config[CKEY.GRID_RENDER] = numberFormat;
      config[CKEY.GRID_ALIGN] = 'R';
      config[CKEY.FORM_ITEM_TYPE] = 'InputNumber';
      config[CKEY.FORM_ITEM_FORMAT] = numberFormat;
      config[CKEY.FILTER_ITEM_TYPE] = 'InputNumber';
      config[CKEY.FILTER_ITEM_EXTEND] = 'range';
      config[CKEY.FILTER_ITEM_LAYOUT] = '66';
    }
    // 字符类型
    else if (fieldType.startsWith('varchar') || fieldType.startsWith('char')) {
      const length = getStringLength(fieldType);
      if (length && parseInt(length) > 500) {
        config[CKEY.GRID_WIDTH] = '180';
        config[CKEY.GRID_ELLIPSIS] = '1';
      } else {
        config[CKEY.GRID_WIDTH] = '100';
      }
      config[CKEY.GRID_USED] = '1';
      config[CKEY.FORM_ITEM_USED] = '1';
      config[CKEY.FORM_ITEM_TYPE] = 'Input';
      config[CKEY.FILTER_ITEM_TYPE] = 'Input';
    }
    // 其他类型默认 Input
    else {
      config[CKEY.GRID_WIDTH] = '100';
      config[CKEY.GRID_USED] = '1';
      config[CKEY.FORM_ITEM_USED] = '1';
      config[CKEY.FORM_ITEM_TYPE] = 'Input';
    }

    // 默认列宽
    if (!config[CKEY.GRID_WIDTH]) {
      config[CKEY.GRID_WIDTH] = '100';
    }

    // 表单验证规则（非日期、非数值类型）
    if (typeCategory !== 'date' && typeCategory !== 'number') {
      const fieldObj = {
        dictFieldNotNull: field.required,
        dictFieldKey: isKey ? '主键' : '',
        dictFieldType: field.type,
      };
      const defaultRules = DDBunit2ADBUtil.getFieldDefaultRules({ fieldObj });
      const formItemRule = defaultRules?.excelStr || '';
      if (formItemRule) {
        config[CKEY.FORM_ITEM_RULE] = formItemRule;
      }
    }
  }

  return config;
};

/**
 * 创建 leaf 分隔行（主子表分隔行）
 */
const createLeafField = (childModuleKey: string, mainPkFieldName: string, label: string): FieldSheetRow => {
  const row = getDefaultFieldConfig() as FieldSheetRow;
  // 清空非关键字段
  DDIT_TOOL_CONSTANTS.SHEET_CONFIG_FIELD.forEach((item: any) => {
    if (item.dataIndex &&
        item.dataIndex !== CKEY.DICT_FIELD_DESC &&
        item.dataIndex !== CKEY.GRID_USED &&
        item.dataIndex !== CKEY.GRID_WIDTH &&
        item.dataIndex !== CKEY.GRID_FIXED &&
        item.dataIndex !== CKEY.GRID_RENDER) {
      (row as any)[item.dataIndex] = '';
    }
  });
  // 只设置这5列
  (row as any)[CKEY.DICT_FIELD_DESC] = label;
  (row as any)[CKEY.GRID_USED] = '1';
  (row as any)[CKEY.GRID_WIDTH] = '90';
  (row as any)[CKEY.GRID_FIXED] = 'R';
  (row as any)[CKEY.GRID_RENDER] = `leaf:${childModuleKey}&${mainPkFieldName}`;
  return row;
};

/**
 * 创建 rel 一对多关联字段配置
 */
const createRelField = (
  relModuleKey: string,
  displayField: string,
  relFieldName: string,
  mainTableName: string,
  mainTableFieldDesc: string
): FieldSheetRow => {
  const row = getDefaultFieldConfig() as FieldSheetRow;
  // 清空非关键字段
  DDIT_TOOL_CONSTANTS.SHEET_CONFIG_FIELD.forEach((item: any) => {
    if (item.dataIndex &&
        item.dataIndex !== CKEY.DICT_FIELD_NAME_MAIN &&
        item.dataIndex !== CKEY.DICT_FIELD_NAME_REL &&
        item.dataIndex !== CKEY.DICT_FIELD_DESC &&
        item.dataIndex !== CKEY.GRID_USED &&
        item.dataIndex !== CKEY.GRID_WIDTH &&
        item.dataIndex !== CKEY.GRID_FIXED &&
        item.dataIndex !== CKEY.GRID_RENDER) {
      (row as any)[item.dataIndex] = '';
    }
  });
  // 只设置这7列
  (row as any)[CKEY.DICT_FIELD_NAME_MAIN] = relFieldName;
  (row as any)[CKEY.DICT_FIELD_NAME_REL] = '';
  (row as any)[CKEY.DICT_FIELD_DESC] = mainTableFieldDesc;
  (row as any)[CKEY.GRID_USED] = '1';
  (row as any)[CKEY.GRID_WIDTH] = '120';
  (row as any)[CKEY.GRID_FIXED] = 'R';
  (row as any)[CKEY.GRID_RENDER] = `rel:${relModuleKey}&${displayField}`;
  return row;
};

/**
 * 创建 rel2 多对多关联虚拟字段
 */
const createRel2Field = (
  rel2ModuleKey: string,
  displayField: string,
  refModuleKey: string,
  relTableNameCn: string
): FieldSheetRow => {
  const row = getDefaultFieldConfig() as FieldSheetRow;
  // 清空非关键字段
  DDIT_TOOL_CONSTANTS.SHEET_CONFIG_FIELD.forEach((item: any) => {
    if (item.dataIndex &&
        item.dataIndex !== CKEY.DICT_FIELD_DESC &&
        item.dataIndex !== CKEY.GRID_USED &&
        item.dataIndex !== CKEY.GRID_WIDTH &&
        item.dataIndex !== CKEY.GRID_FIXED &&
        item.dataIndex !== CKEY.GRID_RENDER) {
      (row as any)[item.dataIndex] = '';
    }
  });
  // 只设置这5列
  (row as any)[CKEY.DICT_FIELD_DESC] = relTableNameCn;
  (row as any)[CKEY.GRID_USED] = '1';
  (row as any)[CKEY.GRID_WIDTH] = '120';
  (row as any)[CKEY.GRID_FIXED] = 'R';
  (row as any)[CKEY.GRID_RENDER] = `rel2:${rel2ModuleKey}&${displayField}&${refModuleKey}`;
  return row;
};

// ============== Sheet 生成 ==============

/**
 * 构建字段 Sheet 组标题行（Java 版本）
 */
const createFieldHeaderRow = (dictDesc: string, dictName: string): FieldSheetRow => {
  const row = getDefaultFieldConfig() as FieldSheetRow;
  // 标题格式："数据字典含义 数据字典"（如"字典_进货明细 s_tsjh"）
  (row as any)[CKEY.DICT_NAME] = `${dictDesc} ${dictName}`;
  (row as any)['excelRowType'] = 'title';
  (row as any)['title'] = `${dictDesc} ${dictName}`;
  // 清除其他字段的默认值
  DDIT_TOOL_CONSTANTS.SHEET_CONFIG_FIELD.forEach((item: any) => {
    if (item.dataIndex && item.dataIndex !== CKEY.DICT_NAME && item.dataIndex !== 'excelRowType' && item.dataIndex !== 'title') {
      (row as any)[item.dataIndex] = '';
    }
  });
  return row;
};

/**
 * 生成模块配置（Java 版本）
 */
const createModuleConfig = (moduleInfo: ModuleInfo, dictName: string, isTree: boolean = false): ModuleSheetRow => {
  const defaultConfig = getDefaultModuleConfig();

  // 根据模块类型设置特定默认值
  if (isTree) {
    defaultConfig[CKEY.FORM_LAYOUT_TYPE] = 'vertical';
    defaultConfig[CKEY.GRID_SELECTION_TYPE] = '';
    defaultConfig[CKEY.GRID_COL_EDIT] = '';
    defaultConfig[CKEY.GRID_COL_DEL] = '';
    defaultConfig[CKEY.GRID_COL_DETAIL] = '';
    defaultConfig[CKEY.TOOLBAR_DEFAULT_DOWNLOAD] = '';
    defaultConfig[CKEY.TOOLBAR_DEFAULT_SETTING] = '';
    defaultConfig[CKEY.TOOLBAR_DEFAULT_FULL] = '';
    defaultConfig[CKEY.TOOLBAR_DEFAULT_RELOAD] = '';
    defaultConfig[CKEY.TOOLBAR_DEFAULT_ADVANCED_FILTER] = '';
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
    [CKEY.MODULE_KEY]: moduleInfo.moduleKey,
    [CKEY.MODULE_NAME]: moduleInfo.moduleName,
    [CKEY.DICT_NAME]: dictName,
  } as ModuleSheetRow;

  return result;
};

/**
 * 生成表管理配置（Java 版本）
 */
const createTableConfig = (tableInfo: TableInfo): TableSheetRow => {
  const defaultConfig = getDefaultTableConfig();

  const result = {
    ...defaultConfig,
    [CKEY.TABLE_NAME]: tableInfo.tableNameEn,
    [CKEY.TABLE_DESC]: tableInfo.tableNameCn,
    [CKEY.TABLE_ALIAS]: tableInfo.tableNameEn,  // 逻辑名与物理表名称相同
    [CKEY.DICT_NAME]: tableInfo.dictName,
    [CKEY.DICT_DESC]: tableInfo.dictDesc || tableInfo.tableNameCn,
    [CKEY.TABLE_TYPE]: '物理表',  // 固定为"物理表"
  } as TableSheetRow;

  return result;
};

/**
 * 生成菜单配置
 */
const createMenuConfig = (
  moduleInfo: ModuleInfo,
  isTree: boolean = false,
  parentMenuId: string = '',
  menuIdSuffix: string = ''
): MenuSheetRow => {
  const defaultConfig = getDefaultMenuConfig();

  const result = {
    ...defaultConfig,
    'menu_id': menuIdSuffix || moduleInfo.moduleKey,
    'menu_parent_id': parentMenuId,
    'menu_name': '',  // 放在C列，不放B列
    'menu_name1': moduleInfo.moduleName,  // 放在C列
    'menu_path': `/aigenerator/cfgp/${moduleInfo.moduleKey}`,
    'menu_light_path': '',
    'menu_icon': '',
    'menu_hide': 'N',
    'menu_redirect': '',
    'menu_component': isTree ? './common/automatic_page_tree' : './common/automatic_page',
    'menu_active': '1',
    'menu_full_screen': 'N',
    'menu_type': '1',
    'menu_index': '',
    'menu_role': '管理员',
  } as MenuSheetRow;

  return result;
};

/**
 * 生成父级菜单（AI模块）
 */
const createParentMenuConfig = (parentMenuId: string): MenuSheetRow => {
  const defaultConfig = getDefaultMenuConfig();

  const result = {
    ...defaultConfig,
    'menu_id': parentMenuId,
    'menu_parent_id': '',
    'menu_name': 'AI模块',
    'menu_path': '/aigenerator/cfgp',
    'menu_light_path': '',
    'menu_icon': 'ProfileOutlined',
    'menu_hide': 'N',
    'menu_redirect': '',
    'menu_component': '',
    'menu_active': '1',
    'menu_full_screen': 'N',
    'menu_type': '1',
    'menu_index': '',
    'menu_role': '管理员',
  } as MenuSheetRow;

  return result;
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

/**
 * 将 AI 返回的 JSON 数据转换为 4 Sheet 结构（Java 版本）
 */
export const convertToSheets = (jsonData: AIResponseData): SheetData => {
  const tableSheet: TableSheetRow[] = [];
  const moduleSheet: ModuleSheetRow[] = [];
  const fieldSheet: FieldSheetRow[] = [];
  const menuSheet: MenuSheetRow[] = [];

  // 建立 moduleKey -> TableInfo 的映射
  const moduleKeyToTableInfo = new Map<string, TableInfo>();
  jsonData.tables?.forEach(t => {
    // 从 dictName 反推 moduleKey（去掉 s_ 前缀）
    const moduleKey = t.dictName.replace(/^s_/, '');
    moduleKeyToTableInfo.set(moduleKey, t);
    // 同时支持直接用 tableNameEn 作为 moduleKey
    moduleKeyToTableInfo.set(t.tableNameEn, t);
  });

  // 生成随机6位父菜单ID
  const parentMenuId = Math.random().toString().slice(2, 8).padEnd(6, '0');
  let menuIndex = 0;

  // ===== 菜单：先插入父级菜单（AI模块） =====
  menuSheet.push(createParentMenuConfig(parentMenuId));

  // 遍历每个模块生成数据
  jsonData.modules?.forEach((moduleInfo) => {
    menuIndex++;
    const menuIdSuffix = `${parentMenuId}${menuIndex.toString().padStart(2, '0')}`;

    // 获取对应的 TableInfo
    const tableInfo = moduleKeyToTableInfo.get(moduleInfo.moduleKey) ||
                      moduleKeyToTableInfo.get(moduleInfo.moduleKey.replace(/^eg_m_/, ''));

    if (!tableInfo) {
      console.warn(`未找到模块 ${moduleInfo.moduleKey} 对应的表信息`);
      return;
    }

    const isTree = isTreeModule(tableInfo.fields);
    const relations = parseModuleDesc(moduleInfo.moduleDesc || '');

    // ===== Sheet 1: 表管理 =====
    tableSheet.push(createTableConfig(tableInfo));

    // ===== Sheet 2: 模块 =====
    moduleSheet.push(createModuleConfig(moduleInfo, tableInfo.dictName, isTree));

    // ===== Sheet 3: 字典构建 =====
    // 添加组标题行
    fieldSheet.push(createFieldHeaderRow(
      tableInfo.dictDesc || tableInfo.tableNameCn,  // 数据字典含义
      tableInfo.dictName                             // 数据字典
    ));

    // 普通字段行
    tableInfo.fields?.forEach(field => {
      const baseConfig = getDefaultFieldConfig();

      // 设置必要的字段（Java 版本使用 dict_field_name_main）
      (baseConfig as any)[CKEY.DICT_FIELD_NAME_MAIN] = field.name || '';
      (baseConfig as any)[CKEY.DICT_FIELD_NAME_REL] = '';
      (baseConfig as any)[CKEY.DICT_FIELD_DESC] = field.nameCn || '';
      (baseConfig as any)[CKEY.DICT_FIELD_TYPE] = field.type || '';
      // 键：p_key 改为中文描述"主键"
      (baseConfig as any)[CKEY.DICT_FIELD_KEY] = field.key === 'p_key' ? '主键' : (field.key || '');
      (baseConfig as any)[CKEY.DICT_FIELD_DEFAULT_VALUE] = field.defaultValue || '';
      // 非空：Y 改为 N，N 改为空
      (baseConfig as any)[CKEY.DICT_FIELD_NOT_NULL] = field.required === 'Y' ? 'N' : (field.required === 'N' ? '' : field.required || '');

      const inferredConfig = inferFieldConfig(field, tableInfo.tableNameEn, isTree);
      const finalConfig = { ...baseConfig, ...inferredConfig } as FieldSheetRow;
      fieldSheet.push(finalConfig);
    });

    // 如果是主表，添加关联字段
    if (relations.length > 0) {
      const mainTableFields = tableInfo.fields || [];
      const mainPkField = mainTableFields.find(f => f.key === 'p_key');
      const mainPkFieldName = mainPkField?.name || 'uuid';

      for (const relation of relations) {
        const relTableInfo = moduleKeyToTableInfo.get(relation.moduleKey);

        if (relation.type === 'sub') {
          // 子表：添加 leaf 分隔行
          if (relTableInfo) {
            const label = inferLeafLabel(relTableInfo.tableNameCn);
            fieldSheet.push(createLeafField(relation.moduleKey, mainPkFieldName, label));
          }
        } else if (relation.type === 'rel') {
          // 一对多关联
          if (relTableInfo) {
            const relPkField = relTableInfo.fields?.find(f => f.key === 'p_key');
            const relFieldName = relPkField?.name || '';
            const displayField = findDisplayField(relTableInfo.fields);
            if (relFieldName) {
              // 删除主表已有的外键字段记录
              const existingIndex = fieldSheet.findIndex(
                (row: any) =>
                  (row as any)[CKEY.DICT_FIELD_NAME_MAIN] === relFieldName ||
                  (row as any)[CKEY.DICT_FIELD_NAME_MAIN]?.endsWith(`_${relFieldName}`) ||
                  (row as any)[CKEY.DICT_FIELD_NAME_MAIN]?.endsWith(relFieldName)
              );
              if (existingIndex >= 0) {
                fieldSheet.splice(existingIndex, 1);
              }
              // 创建新的 rel 关联字段记录
              const relDisplayField = relTableInfo.fields?.find(f => {
                const fname = f.name?.toLowerCase() || '';
                return fname !== 'uuid' && fname !== 'id' && fname.includes('name');
              });
              const mainTableFieldDesc = relDisplayField?.nameCn || relDisplayField?.name || '';
              fieldSheet.push(createRelField(
                relation.moduleKey,
                displayField,
                relFieldName,
                tableInfo.tableNameEn,
                mainTableFieldDesc,
              ));
            }
          }
        } else if (relation.type === 'rel2') {
          // 多对多关联
          if (relTableInfo) {
            const displayField = findDisplayField(relTableInfo.fields);
            const refModuleKey = relation.refModuleKey || '';
            fieldSheet.push(createRel2Field(
              relation.moduleKey,
              displayField,
              refModuleKey,
              relTableInfo.tableNameCn,
            ));
          }
        }
      }
    }

    // ===== Sheet 4: 菜单 =====
    menuSheet.push(createMenuConfig(moduleInfo, isTree, parentMenuId, menuIdSuffix));
  });

  return {
    tableSheet,
    moduleSheet,
    fieldSheet,
    menuSheet,
    commonFieldSheet: COMMON_FIELDS_DATA,
    tablecodeSheet: convertToTableCodeSheet(jsonData.codeTables),
  };
};

// ============== 码表 Sheet 处理 ==============

const getDefaultTableCodeConfig = (): Record<string, string> => {
  const defaultConfig: Record<string, string> = {};
  DDIT_TOOL_CONSTANTS.SHEET_BUSINESS_CODE_TABLE.forEach((item: any) => {
    if (item.dataIndex) {
      defaultConfig[item.dataIndex] = item.defaultValue ?? '';
    }
  });
  return defaultConfig;
};

const convertToTableCodeSheet = (codeTables?: CodeTableItem[]): TableCodeSheetRow[] => {
  if (!codeTables || codeTables.length === 0) {
    return [];
  }
  const defaultConfig = getDefaultTableCodeConfig();
  return codeTables.map((item, index) => ({
    ...defaultConfig,
    'code_id': String(index + 1),
    'code_type': item.code_type,
    'code_name': item.code_type_desc,
    'name': item.name,
    'code': item.code,
    'notes': '',
  } as TableCodeSheetRow));
};

// 导出列定义（用于 SheetTable 组件）
export const TABLE_COLUMNS = DDIT_TOOL_CONSTANTS.SHEET_CONFIG_DICT_TABLE.map((item: any) => item.title);
export const MODULE_COLUMNS = DDIT_TOOL_CONSTANTS.SHEET_CONFIG_MODULE.map((item: any) => item.title);
export const FIELD_COLUMNS = DDIT_TOOL_CONSTANTS.SHEET_CONFIG_FIELD.map((item: any) => item.title);
export const MENU_COLUMNS = DDIT_TOOL_CONSTANTS.SHEET_MENU.map((item: any) => item.title);
export const COMMON_FIELD_COLUMNS = DDIT_TOOL_CONSTANTS.SHEET_COMMON_FIELD.map((item: any) => item.title);
export const TABLE_CODE_COLUMNS = DDIT_TOOL_CONSTANTS.SHEET_BUSINESS_CODE_TABLE.map((item: any) => item.title);

export default convertToSheets;