#!/usr/bin/env python3
"""
模块 Excel 配置生成器
根据 AI 设计的表结构生成增删查改模块的 Excel 配置文件

Usage:
    # AI 驱动模式（推荐）：由 Claude Code 分析需求并设计表结构
    python generate_module_excel.py --table-info '{"table_name_cn":"考勤记录","table_name_en":"att_record","fields":[...]}'

    # 交互模式：手动输入表结构
    python generate_module_excel.py --interactive

    # 旧模式（已废弃）：根据需求描述自动推断表结构
    python generate_module_excel.py --requirement "考勤录入管理"
"""

import argparse
import json
import re
import sys
from datetime import datetime
from pathlib import Path
from typing import Optional

try:
    from openpyxl import Workbook
    from openpyxl.styles import Font, PatternFill, Border, Side, Alignment
except ImportError:
    print("Error: openpyxl library required")
    print("Run: pip install openpyxl")
    sys.exit(1)


# ============== 样式定义 ==============

# 表头样式
HEADER_FONT = Font(name='Microsoft YaHei', size=9, bold=True, color='FF000000')
HEADER_BORDER = Border(
    top=Side(style='thin'),
    bottom=Side(style='thin'),
    left=Side(style='thin'),
    right=Side(style='thin')
)
HEADER_ALIGNMENT = Alignment(horizontal='left', vertical='center')

# 各Sheet表头填充色
# 表Sheet: 浅灰色 (theme=9, tint=0.6)
HEADER_FILL_TABLE = PatternFill(fill_type='solid', fgColor='FFD9D9D9')
# 菜单Sheet: 浅灰色 (theme=6, tint=0.8)
HEADER_FILL_MENU = PatternFill(fill_type='solid', fgColor='FFD9D9D9')
# 模块Sheet表头: 1-2列淡绿色, 3-6列淡紫色, 7-18列淡黄色, 19-25列淡蓝色, 26-28列淡橙色, 29-30列淡紫色, 31列浅灰
MODULE_HEADER_FILLS = [
    'FFEBF1DE',  # col 1-2: 淡绿色
    'FFE4DFEC',  # col 3-6: 淡紫色
    'FFDDD9C4',  # col 7-18: 淡黄色
    'FFC5D9F1',  # col 19-25: 淡蓝色
    'FFFDE9D9',  # col 26-28: 淡橙色
    'FFE4DFEC',  # col 29-30: 淡紫色
    'FFD9D9D9',  # col 31: 浅灰色
]
# 字段Sheet表头: 1-5列浅灰, 6-17列浅蓝, 18-24列极浅蓝, 25-36列淡紫, 37列浅灰
FIELD_HEADER_FILLS = [
    'FFD9D9D9',  # col 1-5: 浅灰色
    'FF92CDDC',  # col 6-17: 浅蓝色
    'FFDAEEF3',  # col 18-24: 极浅蓝
    'FFB1A0C7',  # col 25-36: 淡紫色
    'FFD9D9D9',  # col 37: 浅灰色
]

# 数据行样式
DATA_FONT = Font(name='Microsoft YaHei', size=9)
DATA_BORDER = Border(
    top=Side(style='thin'),
    bottom=Side(style='thin'),
    left=Side(style='thin'),
    right=Side(style='thin')
)
DATA_ALIGNMENT = Alignment(horizontal='left', vertical='center')

# 表名行样式（11pt，垂直居中，浅橙色背景）
TABLE_NAME_FILL = PatternFill(fill_type='solid', fgColor='FFFCD5B4')
TABLE_NAME_FONT = Font(name='Microsoft YaHei', size=11, bold=True)
TABLE_NAME_ALIGNMENT = Alignment(horizontal='left', vertical='center')

# 字段 Sheet 模块首行样式（浅橙色背景）
MODULE_ROW_FILL = PatternFill(fill_type='solid', fgColor='FFFCD5B4')
MODULE_ROW_FONT = Font(name='Microsoft YaHei', size=9, bold=True)
MODULE_ROW_ALIGNMENT = Alignment(horizontal='left', vertical='center')


# ============== 验证函数 ==============

def validate_field_name(name: str) -> tuple[bool, str]:
    """验证字段名格式 ^[a-z][a-z0-9_]*$"""
    if not name:
        return False, "Field name cannot be empty"
    if not re.match(r'^[a-z][a-z0-9_]*$', name):
        return False, "Field name must start with lowercase letter, only contain lowercase letters, numbers and underscores"
    return True, ""


def validate_data_type(data_type: str) -> tuple[bool, str]:
    """验证数据类型"""
    valid_types = [
        r'^varchar\(\d+\)$',
        r'^char\(\d+\)$',
        r'^decimal\(\d+,\d+\)$',
        r'^int\(\d+\)$',
        r'^datetime$',
        r'^long$',
    ]
    for pattern in valid_types:
        if re.match(pattern, data_type, re.IGNORECASE):
            return True, ""
    return False, "Data type must be varchar(n), char(n), decimal(m,n), int(n), datetime, or long"


def validate_module_key(key: str) -> tuple[bool, str]:
    """验证模块key格式 ^eg_m_[a-z][a-z0-9_]*$"""
    if not key:
        return False, "Module key cannot be empty"
    if not re.match(r'^eg_m_[a-z][a-z0-9_]*$', key):
        return False, "Module key must start with eg_m_, only contain lowercase letters, numbers and underscores"
    return True, ""


def validate_table_name_en(name_en: str) -> tuple[bool, str]:
    """验证表英文名格式 ^[a-z][a-z0-9_]*$"""
    if not name_en:
        return False, "Table name cannot be empty"
    if not re.match(r'^[a-z][a-z0-9_]*$', name_en):
        return False, "Table name must start with lowercase letter, only contain lowercase letters, numbers and underscores"
    return True, ""


def validate_menu_id(menu_id: int, existing_ids: list) -> tuple[bool, str]:
    """验证菜单ID唯一性"""
    if menu_id in existing_ids:
        return False, f"Menu ID {menu_id} already exists"
    return True, ""


# ============== 设计函数 ==============

def suggest_data_type(field_name_cn: str, field_name_en: str) -> str:
    """根据字段名推断数据类型"""
    field_en_lower = field_name_en.lower()
    field_cn = field_name_cn

    # Primary key
    if 'uuid' in field_en_lower or '_id' in field_en_lower or field_en_lower == 'id':
        return 'varchar(32)'

    # Status
    if 'status' in field_en_lower or '状态' in field_cn:
        return 'char(1)'

    # DateTime
    if any(kw in field_cn for kw in ['日期', '时间', '时间']):
        return 'datetime'

    # Amount/Quantity
    if any(kw in field_cn for kw in ['金额', '数量', '价格', '工资', '总数', '余额']):
        return 'decimal(18,2)'

    # Integer
    if any(kw in field_cn for kw in ['数量', '次数', '序号', '编号']):
        return 'int(10)'

    # Text
    if any(kw in field_cn for kw in ['名称', '姓名', '编码', '代码', '描述', '备注', '说明']):
        return 'varchar(100)'

    # Default
    return 'varchar(200)'


def design_table_structure(business_requirement: str) -> dict:
    """
    [已废弃] 根据业务需求设计表结构。

    此函数已被废弃。推荐由 Claude Code (AI) 分析需求并设计表结构，
    然后通过 --table-info 参数传入。

    此函数仅作为备用，在无法使用 AI 时提供基础表结构。
    """
    print(f"[Deprecated] design_table_structure called with: {business_requirement}")
    print("[Deprecated] Please use --table-info to pass AI-designed table structure.")

    # 简单的关键词匹配作为最基本的备用方案
    req_lower = business_requirement.lower()

    if '考勤' in business_requirement:
        table_name_cn = '考勤记录'
        table_name_en = 'att_record'
        fields = [
            {'name': 'uuid', 'name_cn': 'UUID', 'data_type': 'varchar(32)', 'key': 'p_key', 'required': 'Y', 'remark': '主键'},
            {'name': 'user_id', 'name_cn': '员工ID', 'data_type': 'varchar(32)', 'key': '', 'required': 'Y', 'remark': ''},
            {'name': 'work_date', 'name_cn': '工作日期', 'data_type': 'datetime', 'key': '', 'required': 'Y', 'remark': ''},
            {'name': 'check_in_time', 'name_cn': '签到时间', 'data_type': 'datetime', 'key': '', 'required': '', 'remark': ''},
            {'name': 'check_out_time', 'name_cn': '签退时间', 'data_type': 'datetime', 'key': '', 'required': '', 'remark': ''},
            {'name': 'status', 'name_cn': '状态', 'data_type': 'char(1)', 'key': '', 'required': 'Y', 'remark': '1正常/0异常'},
            {'name': 'remark', 'name_cn': '备注', 'data_type': 'varchar(500)', 'key': '', 'required': '', 'remark': ''},
            {'name': 'create_time', 'name_cn': '创建时间', 'data_type': 'datetime', 'key': '', 'required': 'Y', 'remark': ''},
        ]
    else:
        # 默认返回简单通用表结构
        table_name_cn = '通用记录'
        table_name_en = 'gen_record'
        fields = [
            {'name': 'uuid', 'name_cn': 'UUID', 'data_type': 'varchar(32)', 'key': 'p_key', 'required': 'Y', 'remark': '主键'},
            {'name': 'name', 'name_cn': '名称', 'data_type': 'varchar(100)', 'key': '', 'required': 'Y', 'remark': ''},
            {'name': 'remark', 'name_cn': '备注', 'data_type': 'varchar(500)', 'key': '', 'required': '', 'remark': ''},
            {'name': 'create_time', 'name_cn': '创建时间', 'data_type': 'datetime', 'key': '', 'required': 'Y', 'remark': ''},
        ]

    return {
        'table_name_cn': table_name_cn,
        'table_name_en': table_name_en,
        'fields': fields
    }


def design_module_config(table_info: dict) -> dict:
    """根据表设计模块配置（与 SHEET_CONFIG_MODULE_COMMON 默认值同步）"""
    table_name_en = table_info.get('table_name_en', '')
    table_name_cn = table_info.get('table_name_cn', '')
    fields = table_info.get('fields', [])

    # 判断是否为树形模块
    is_tree = is_tree_module(fields)

    if is_tree:
        # 树形模块配置：严格按模板 eg_m_tree 的配置
        return {
            'module_key': f'eg_m_{table_name_en}',
            'module_name': table_name_cn,
            'grid_serial': '',
            'grid_border': '',
            'grid_selection_type': '',
            'grid_ext': '',
            'grid_columns_edit': '',
            'grid_columns_delete': '',
            'grid_columns_detail': '',
            'toolbar_add': '1',
            'toolbar_delete': '1',
            'toolbar_edit': '1',
            'toolbar_upload': '',
            'toolbar_download': '',
            'toolbar_setting': '',
            'toolbar_full': '',
            'toolbar_reload': '',
            'toolbar_filter': '',
            'api_save': '',
            'api_delete': '',
            'api_grid_query': '',
            'api_form_query': '',
            'api_export': '',
            'api_import': '',
            'api_template': '',
            'form_layout': 'vertical',
            'form_width': '',
            'form_submit_type': '',
            'custom_toolbar_buttons': '',
            'custom_column_buttons': '',
            'extra_info': ''
        }

    # 普通模块配置
    return {
        'module_key': f'eg_m_{table_name_en}',
        'module_name': table_name_cn,
        # 列表
        'grid_serial': '',           # 默认空
        'grid_border': '',           # 默认空
        'grid_selection_type': 'checkbox',  # 默认 checkbox
        'grid_ext': '',              # 默认空
        'grid_columns_edit': '1',    # 默认 1
        'grid_columns_delete': '1',  # 默认 1
        'grid_columns_detail': '1',  # 默认 1
        # 工具栏
        'toolbar_add': '1',          # 默认 1
        'toolbar_delete': '1',       # 默认 1
        'toolbar_edit': '1',         # 默认 1
        'toolbar_upload': '',        # 默认空
        'toolbar_download': '1',     # 默认 1
        'toolbar_setting': '1',      # 默认 1
        'toolbar_full': '1',          # 默认 1
        'toolbar_reload': '1',       # 默认 1
        'toolbar_filter': '1',       # 默认 1
        # API
        'api_save': '',              # 默认空
        'api_delete': '',            # 默认空
        'api_grid_query': '',        # 默认空
        'api_form_query': '',        # 默认空
        'api_export': '',            # 默认空
        'api_import': '',             # 默认空
        'api_template': '',          # 默认空
        # 表单
        'form_layout': 'horizontal', # 默认 horizontal
        'form_width': '960',         # 默认 960
        'form_submit_type': '',      # 默认空
        # 自定义按钮
        'custom_toolbar_buttons': '',   # 默认空
        'custom_column_buttons': '',     # 默认空
        # 扩展
        'extra_info': ''             # 默认空
    }


def get_field_type_category(data_type: str) -> str:
    """判断字段类型类别: number/date/string"""
    dt = data_type.lower()
    if any(t in dt for t in ['decimal', 'int', 'bigint', 'tinyint', 'double']):
        return 'number'
    if 'date' in dt:
        return 'date'
    return 'string'


def get_number_format(data_type: str) -> str:
    """获取数值格式化，如 decimal(18,2) -> 0,0.00, int(10) -> 0,0"""
    dt = data_type.lower().replace('unsigned', '').replace('(', ',').replace(')', '')
    parts = dt.split(',')
    if len(parts) > 1:
        base_type = parts[0].strip()
        # decimal(m,n) - n 是小数位
        if 'decimal' in base_type:
            if len(parts) > 2:
                decimal_places = parts[2].strip()
                if decimal_places == '0':
                    return '0,0'
                else:
                    zeros = ''.join(['0' for _ in range(int(decimal_places))])
                    return f'0,0.{zeros}'
            return '0,0'
        else:
            # int/bigint/tinyint 等整数类型 - 没有小数位
            return '0,0'
    return '0,0'


def get_string_length(data_type: str) -> str:
    """获取字符长度，如 varchar(32) -> 32, char(1) -> 1"""
    dt = data_type.lower().replace('varchar', '').replace('char', '').replace('(', '').replace(')', '').strip()
    return dt


def get_number_length(data_type: str) -> str:
    """获取数值长度，如 decimal(18,2) -> 18,int(10) -> 10"""
    dt = data_type.lower().replace('unsigned', '').replace('decimal', '').replace('bigint', '').replace('tinyint', '').replace('int', '').replace('(', '').replace(')', '').strip()
    return dt


def is_field_val_len_unknown(field_name_cn: str) -> bool:
    """判断字段是否属于长度不确定（名称、备注、用途等）"""
    return any(kw in field_name_cn for kw in ['名称', '备注', '用途'])


def is_tree_module(fields: list) -> bool:
    """判断是否为树形模块（检测 tree_id, tree_name, tree_parent_id 结构）"""
    field_names = [f.get('name', '').lower() for f in fields]
    has_tree_id = any('tree_id' in name for name in field_names)
    has_tree_name = any('tree_name' in name for name in field_names)
    has_tree_parent = any('tree_parent_id' in name or 'parent_id' in name for name in field_names)
    return has_tree_id and has_tree_name and has_tree_parent


def infer_leaf_label(table_name_cn: str) -> str:
    """自动推断分隔行显示文本

    规则：
    - 如果表名包含 "教育"、"学历"、"学习" → "教育经历"
    - 如果表名包含 "工作"、"履历"、"经历" → "工作经历"
    - 如果表名包含 "荣誉"、"奖励"、"称号" → "荣誉"
    - 如果表名包含 "明细"、"详情"、"详细" → "明细"
    - 如果表名包含 "附件"、"文件"、"图片" → "附件"
    - 其他情况：直接使用表中文名的最后4个字
    """
    patterns = [
        (['教育', '学历', '学习'], '教育经历'),
        (['工作', '履历', '经历'], '工作经历'),
        (['荣誉', '奖励', '称号'], '荣誉'),
        (['明细', '详情', '详细'], '明细'),
        (['附件', '文件', '图片'], '附件'),
    ]

    for keywords, label in patterns:
        for kw in keywords:
            if kw in table_name_cn:
                return label

    # 默认：取表中文名的最后4个字
    return table_name_cn[-4:] if len(table_name_cn) >= 4 else table_name_cn


def find_display_field(table_info: dict) -> str:
    """找到主表中用于关联的显示字段

    规则：第一个非主键、非uuid的字段
    """
    fields = table_info.get('fields', [])
    for f in fields:
        fname = f.get('name', '').lower()
        if fname not in ['uuid', 'id'] and 'name' in fname:
            return f.get('name', '')
    # 取第一个非uuid字段
    for f in fields:
        if f.get('name', '').lower() not in ['uuid', 'id']:
            return f.get('name', '')
    # 兜底：返回第一个字段
    return fields[0].get('name', '') if fields else ''


def create_leaf_field(child_module_key: str, display_field: str, label: str) -> dict:
    """创建主子表分隔行配置

    Args:
        child_module_key: 子模块key，如 'eg_m_staff_education'
        display_field: 主表中用于显示的字段，如 'staff_name'
        label: 分隔行显示文本，如 '教育经历'

    注意：分隔行的列结构（根据 node_module.xlsx）：
    - Col 1 (data_dict): 空
    - Col 2 (field_name): 空
    - Col 3 (field_name_cn): 显示文本（如'教育经历'）
    - Col 13 (list_format): 'leaf:...'
    - Col 25 (form_enable): 空（分隔行不需要表单）
    """
    return {
        # 分隔行特征
        'data_dict': '',       # 空
        'name': '',            # 字段名称为空
        'name_cn': label,      # 中文显示文本放在字段中文名
        # 列表项配置
        'list_enable': '1',
        'list_width': '90',
        'list_fixed': 'R',
        'list_format': f'leaf:{child_module_key}&{display_field}',
        # 表单配置（分隔行不需要表单，这些值会覆盖默认值模板）
        'form_enable': '',    # 显式设置为空
        'form_type': '',       # 显式设置为空
    }


def get_default_field_config() -> dict:
    """获取字段Sheet的默认值配置（与 SHEET_CONFIG_FIELD_COMMON 同步）"""
    return {
        # 基础字段
        'data_dict': '',
        'field_name': '',
        'field_name_cn': '',
        'relation_expr': '',
        'field_sort': '',
        # 列表项
        'list_enable': '1',        # 默认开启
        'list_primary_key': '',
        'list_align': '',
        'list_width': '',
        'list_fixed': '',
        'list_hidden': '',
        'list_ellipsis': '',
        'list_format': '',
        'list_sorter': '',
        'list_order': '',
        'list_merge_header': '',
        'list_statistics': '',
        # 筛选项
        'filter_type': '',
        'filter_extra_param': '',
        'filter_order': '',
        'filter_label': '',
        'filter_position': '',
        'filter_placeholder': '',
        'filter_layout': '',
        # 表单项
        'form_enable': '1',        # 默认开启
        'form_type': '',
        'form_format': '',
        'form_readonly': '',
        'form_extra_param': '',
        'form_layout': '',
        'form_event_blur': '',
        'form_event_focus': '',
        'form_event_change': '',
        'form_event_search': '',
        'form_validation': '',
        'form_order': '',
        # 扩展
        'extra_info': ''
    }


def design_field_configs(table_info: dict, module_info: dict) -> list[dict]:
    """为每个字段设计37列配置（与系统 f.tsx getSheetDataField 规则同步）"""
    fields = table_info.get('fields', [])
    table_name_en = table_info.get('table_name_en', '')
    module_key = module_info.get('module_key', '')
    module_name = module_info.get('module_name', '')

    configs = []

    # 校验：每个字段必须有 name_cn
    for field in fields:
        if 'name_cn' not in field or not field.get('name_cn'):
            print(f"  [警告] 字段 '{field.get('name', '?')}' 缺少 name_cn，请检查输入数据")

    # 首行：模块名称 模块key（写到 A 列，即 data_dict 字段）
    first_row = {
        'data_dict': f'{module_name} {module_key}',  # A列
        'field_name': '',  # B列
        'field_name_cn': '',
    }
    configs.append(first_row)

    # 追踪第一个非Hidden的表单类型，用于绑定筛选项
    first_form_type_field_idx = None

    for idx, field in enumerate(fields):
        field_name = field.get('name', '')
        field_name_cn = field.get('name_cn', '')
        data_type = field.get('data_type', field.get('type', ''))
        is_key = field.get('key', '') == 'p_key'
        is_required = field.get('required', '') == 'Y'
        type_category = get_field_type_category(data_type)
        is_val_len_unknown = is_field_val_len_unknown(field_name_cn)

        # 先复制默认值模板
        config = get_default_field_config()

        # 基础字段 - 如果 data_dict 属性存在且为空字符串（leaf 分隔行），则保持为空
        # 否则使用 table_name_en（普通字段）
        if 'data_dict' in field and field.get('data_dict') == '':
            config['data_dict'] = ''  # leaf 分隔行
        else:
            config['data_dict'] = table_name_en  # 普通字段
        config['field_name'] = field_name
        config['field_name_cn'] = field_name_cn
        config['field_sort'] = ''

        # 表单配置 - 如果 field 中有 form_enable（如 leaf 分隔行），则覆盖默认值
        if 'form_enable' in field:
            config['form_enable'] = field.get('form_enable', '')
            config['form_type'] = field.get('form_type', '')

        # 列表项格式化 - 如果字段已有 list_format（如 leaf 分隔行），则保留
        original_list_format = field.get('list_format', '')
        if original_list_format:
            list_format = original_list_format
            config['list_format'] = list_format
        else:
            list_format = ''
            # 树形模块特殊字段格式化
            field_name_lower = field_name.lower()
            if 'tree_id' in field_name_lower:
                list_format = 'tree:key'
            elif 'tree_name' in field_name_lower:
                list_format = 'tree:title'
            elif 'tree_parent_id' in field_name_lower or 'parent_id' in field_name_lower:
                list_format = 'tree:parent_key'
            elif type_category == 'number':
                list_format = get_number_format(data_type)
            elif type_category == 'date':
                list_format = 'YYYY-MM-DD'
            config['list_format'] = list_format

        # 列表项对齐方式
        if type_category == 'number':
            config['list_align'] = 'R'

        # 列表项列宽 - 如果字段已有 list_width（如 leaf 分隔行），则保留
        original_list_width = field.get('list_width', '')
        if original_list_width and original_list_width not in ('100', ''):
            config['list_width'] = str(original_list_width)
            list_width = int(original_list_width) if str(original_list_width).isdigit() else 100
        else:
            list_width = 100
            if type_category == 'number':
                list_width = 140
            elif type_category == 'date':
                list_width = 150
            elif is_val_len_unknown:
                list_width = 180
            config['list_width'] = str(list_width)

        # 列表项固定列 - leaf 分隔行保持 R
        original_list_fixed = field.get('list_fixed', '')
        if original_list_fixed:
            config['list_fixed'] = original_list_fixed

        # 列表项超出隐藏
        if is_val_len_unknown:
            config['list_ellipsis'] = '1'

        # 列表项隐藏/主键标识
        if is_key:
            config['list_hidden'] = '1'
            config['list_primary_key'] = '1'
        # 外键字段（_uuid 结尾但非主键）也需要隐藏
        elif field_name_lower.endswith('_uuid') and not is_key:
            config['list_hidden'] = '1'

        # 列表排序 - f.tsx 中 GRID_SORT 保持为空，不设置
        # 注：f.tsx 中没有显式设置 list_sorter 和 list_order

        # 表单类型 - leaf 分隔行不需要表单，保持为空
        is_leaf_field = original_list_format and original_list_format.startswith('leaf:')
        if not is_leaf_field:
            form_type = 'Input'
            if is_key:
                form_type = 'Hidden'
            elif 'tree_parent_id' in field_name_lower or ('parent_id' in field_name_lower and 'tree' in table_name_en.lower()):
                form_type = 'Hidden'
            elif type_category == 'number':
                form_type = 'InputNumber'
            elif type_category == 'date':
                form_type = 'DatePicker'
            config['form_type'] = form_type
            config['form_format'] = list_format

        # 记录第一个非Hidden的表单类型字段索引
        if first_form_type_field_idx is None and form_type != 'Hidden':
            first_form_type_field_idx = idx

        # 表单校验规则
        form_validation = ''
        if is_required and not is_key:
            form_validation = '必录'
        # 字符类型添加 varchar2 长度校验
        if 'char' in data_type.lower():
            length = get_string_length(data_type)
            if length:
                form_validation = f'{form_validation},varchar2({length})'.strip(',') if form_validation else f'varchar2({length})'
        # 数值类型添加 number 长度校验
        elif type_category == 'number':
            length = get_number_length(data_type)
            if length:
                form_validation = f'{form_validation},number({length})'.strip(',') if form_validation else f'number({length})'
        config['form_validation'] = form_validation

        # 筛选项 - f.tsx 中 FILTER_ITEM_INDEX 保持为空，不设置
        # 注：f.tsx 中没有显式设置 filter_order

        # 表单项 - f.tsx 中 FORM_ITEM_INDEX 保持为空，不设置

        configs.append(config)

    # 绑定第一个非Hidden的表单类型字段的筛选项类型（与 f.tsx 264-277 行规则同步）
    # 注意：f.tsx 中只设置了 FILTER_ITEM_TYPE，没有设置 filter_label 和 filter_placeholder
    if first_form_type_field_idx is not None and first_form_type_field_idx + 1 < len(configs):
        first_config = configs[first_form_type_field_idx + 1]  # +1 因为configs[0]是首行
        if first_config.get('form_type'):
            first_config['filter_type'] = first_config['form_type']

    # ========== AI 增强：智能推断筛选项配置 ==========
    # 遍历所有字段（非首行），根据字段特征设置筛选项
    for i, config in enumerate(configs):
        if i == 0:
            continue  # 跳过首行

        # 从原始字段数据获取类型信息
        orig_field = fields[i - 1] if i - 1 < len(fields) else None
        if not orig_field:
            continue

        orig_data_type = orig_field.get('data_type', '')
        orig_is_key = orig_field.get('key', '') == 'p_key'
        type_category = get_field_type_category(orig_data_type)

        # 1. datetime 类型字段 → 筛选项类型 = 'DatePicker' + 扩展参数 = 'range' + 布局 = '66'
        if type_category == 'date' and not orig_is_key:
            config['filter_type'] = 'DatePicker'
            config['filter_extra_param'] = 'range'
            config['filter_layout'] = '66'

        # 2. 数值字段 → 筛选项类型 = 'InputNumber' + 扩展参数 = 'range' + 布局 = '66'
        if type_category == 'number' and not orig_is_key:
            config['filter_type'] = 'InputNumber'
            config['filter_extra_param'] = 'range'
            config['filter_layout'] = '66'

    return configs


def design_menu_config(module_info: dict, table_info: dict = None) -> list[dict]:
    """设计菜单结构"""
    import random
    module_key = module_info.get('module_key', '')
    module_name = module_info.get('module_name', '')

    # 判断是否为树形模块
    is_tree = False
    if table_info:
        fields = table_info.get('fields', [])
        is_tree = is_tree_module(fields)

    # 使用随机8位数字作为菜单ID起点
    base_menu_id = random.randint(10000000, 99999999)

    # 树形模块使用 automatic_page_tree 组件
    component = './common/automatic_page_tree' if is_tree else './common/automatic_page'

    main_menu = {
        'menu_id': base_menu_id,
        'parent_id': '',
        'resource_code': '',
        'menu_name': module_name,
        'menu_path': f'/aigenerator/cfgp/{module_key}',
        'highlight_path': '',
        'menu_icon': 'AppstoreOutlined',
        'hidden': '0',
        'redirect': '',
        'component': component,
        'enabled': '1',
        'fullscreen': '0',
        'menu_type': '1',
        'menu_order': str(base_menu_id),
        'roles': '管理员'
    }

    return [main_menu]


# ============== 样式应用函数 ==============

def apply_header_style(cell, fill_color: str = 'FFD9D9D9'):
    """应用表头样式"""
    cell.font = HEADER_FONT
    cell.fill = PatternFill(fill_type='solid', fgColor=fill_color)
    cell.border = HEADER_BORDER
    cell.alignment = HEADER_ALIGNMENT


def apply_data_style(cell):
    """应用数据行样式"""
    cell.font = DATA_FONT
    cell.border = DATA_BORDER
    cell.alignment = DATA_ALIGNMENT


def apply_table_name_style(cell):
    """应用表名行样式"""
    cell.font = TABLE_NAME_FONT
    cell.fill = TABLE_NAME_FILL
    cell.border = DATA_BORDER
    cell.alignment = TABLE_NAME_ALIGNMENT


def apply_module_row_style(cell):
    """应用字段 Sheet 模块首行样式"""
    cell.font = MODULE_ROW_FONT
    cell.fill = MODULE_ROW_FILL
    cell.border = DATA_BORDER
    cell.alignment = MODULE_ROW_ALIGNMENT


# ============== Excel 生成函数 ==============

def generate_module_excel(
    table_info: dict,
    module_info: dict,
    field_configs: list[dict],
    menu_configs: list[dict],
    output_path: str
) -> bool:
    """生成完整的 Excel 文件（单模块）"""

    wb = Workbook()

    # ============== 1. 表 Sheet ==============
    ws_table = wb.active
    ws_table.title = '表'

    # 表头行
    table_headers = ['字段', '字段中文名', '数据类型', '键', '默认值', '非空', '备注']
    ws_table.append(table_headers)
    for col in range(1, len(table_headers) + 1):
        apply_header_style(ws_table.cell(1, col), 'FFD9D9D9')

    # 表名行 - 使用特殊样式（11pt，垂直居中）
    table_name_row = [f"{table_info.get('table_name_cn', '')} {table_info.get('table_name_en', '')}", '', '', '', '', '', '']
    ws_table.append(table_name_row)
    for col in range(1, len(table_name_row) + 1):
        apply_table_name_style(ws_table.cell(2, col))
    ws_table.row_dimensions[2].height = 15.0

    # 字段行
    for field in table_info.get('fields', []):
        row = [
            field.get('name', ''),
            field.get('name_cn', ''),
            field.get('data_type', field.get('type', '')),
            field.get('key', ''),
            '',  # 默认值列暂不录入，保持为空
            field.get('required', ''),
            field.get('remark', '')
        ]
        ws_table.append(row)
        for col in range(1, len(row) + 1):
            apply_data_style(ws_table.cell(ws_table.max_row, col))

    # 设置列宽
    ws_table.column_dimensions['A'].width = 29.5
    ws_table.column_dimensions['B'].width = 25.5
    ws_table.column_dimensions['C'].width = 11.5
    ws_table.column_dimensions['D'].width = 5.625
    ws_table.column_dimensions['E'].width = 6.0
    ws_table.column_dimensions['F'].width = 4.5
    ws_table.column_dimensions['G'].width = 13.0

    # ============== 2. 模块 Sheet ==============
    ws_module = wb.create_sheet('模块')

    module_headers = [
        '模块key', '模块名称', '列表序号', '列表边框', '列表首选项',
        '列表扩展', '列表列编辑', '列表列删除', '列表列详情',
        '工具栏增加', '工具栏删除', '工具栏编辑', '工具栏导入', '工具栏导出',
        '工具栏设置', '工具栏全屏', '工具栏刷新', '工具栏筛选',
        'Api保存', 'Api删除', 'Api列表查询', 'Api查询表单', 'Api导出', 'Api导入', 'Api模板下载',
        '表单布局', '表单宽度', '表单提交方式',
        '自定义按钮工具栏', '列表列自定义按钮', '扩展信息'
    ]
    ws_module.append(module_headers)
    # 模块Sheet表头背景色：1-2淡绿色, 3-6淡紫色, 7-18淡黄色, 19-25淡蓝色, 26-28淡橙色, 29-30淡紫色, 31浅灰色
    module_fill_ranges = [(1, 2, 'FFEBF1DE'), (3, 6, 'FFE4DFEC'), (7, 18, 'FFDDD9C4'),
                          (19, 25, 'FFC5D9F1'), (26, 28, 'FFFDE9D9'), (29, 30, 'FFE4DFEC'), (31, 31, 'FFD9D9D9')]
    for col in range(1, len(module_headers) + 1):
        fill_color = 'FFD9D9D9'
        for start, end, color in module_fill_ranges:
            if start <= col <= end:
                fill_color = color
                break
        apply_header_style(ws_module.cell(1, col), fill_color)

    module_row = [
        module_info.get('module_key', ''),
        module_info.get('module_name', ''),
        module_info.get('grid_serial', ''),
        module_info.get('grid_border', ''),
        module_info.get('grid_selection_type', ''),
        module_info.get('grid_ext', ''),
        module_info.get('grid_columns_edit', ''),
        module_info.get('grid_columns_delete', ''),
        module_info.get('grid_columns_detail', ''),
        module_info.get('toolbar_add', ''),
        module_info.get('toolbar_delete', ''),
        module_info.get('toolbar_edit', ''),
        module_info.get('toolbar_upload', ''),
        module_info.get('toolbar_download', ''),
        module_info.get('toolbar_setting', ''),
        module_info.get('toolbar_full', ''),
        module_info.get('toolbar_reload', ''),
        module_info.get('toolbar_filter', ''),
        module_info.get('api_save', ''),
        module_info.get('api_delete', ''),
        module_info.get('api_grid_query', ''),
        module_info.get('api_form_query', ''),
        module_info.get('api_export', ''),
        module_info.get('api_import', ''),
        module_info.get('api_template', ''),
        module_info.get('form_layout', ''),
        module_info.get('form_width', ''),
        module_info.get('form_submit_type', ''),
        module_info.get('custom_toolbar_buttons', ''),
        module_info.get('custom_column_buttons', ''),
        module_info.get('extra_info', '')
    ]
    ws_module.append(module_row)
    for col in range(1, len(module_row) + 1):
        apply_data_style(ws_module.cell(2, col))

    # 设置模块 Sheet 列宽
    ws_module.column_dimensions['A'].width = 24.25
    ws_module.column_dimensions['B'].width = 23.875
    ws_module.column_dimensions['C'].width = 7.5
    ws_module.column_dimensions['D'].width = 13.0
    ws_module.column_dimensions['E'].width = 9.0
    ws_module.column_dimensions['F'].width = 7.5
    ws_module.column_dimensions['G'].width = 9.0
    ws_module.column_dimensions['H'].width = 9.0
    ws_module.column_dimensions['I'].width = 7.5
    ws_module.column_dimensions['J'].width = 9.0
    ws_module.column_dimensions['K'].width = 9.0
    ws_module.column_dimensions['L'].width = 9.0
    ws_module.column_dimensions['M'].width = 9.0
    ws_module.column_dimensions['N'].width = 9.0
    ws_module.column_dimensions['O'].width = 9.0
    ws_module.column_dimensions['P'].width = 9.0
    ws_module.column_dimensions['Q'].width = 9.0
    ws_module.column_dimensions['R'].width = 9.0
    ws_module.column_dimensions['S'].width = 15.0
    ws_module.column_dimensions['T'].width = 15.0
    ws_module.column_dimensions['U'].width = 15.0
    ws_module.column_dimensions['V'].width = 15.0
    ws_module.column_dimensions['W'].width = 15.0
    ws_module.column_dimensions['X'].width = 15.0
    ws_module.column_dimensions['Y'].width = 15.0
    ws_module.column_dimensions['Z'].width = 9.0
    ws_module.column_dimensions['AA'].width = 9.0
    ws_module.column_dimensions['AB'].width = 12.0
    ws_module.column_dimensions['AC'].width = 20.0
    ws_module.column_dimensions['AD'].width = 20.0
    ws_module.column_dimensions['AE'].width = 15.0

    # ============== 3. 字段 Sheet ==============
    ws_field = wb.create_sheet('字段')

    field_headers = [
        '数据字典', '字段名称', '字段中文名', '关联字段表达式', '字段初始排序',
        '列表项开启标识', '列表项主键标识', '列表项对齐方式', '列表项列宽', '列表项固定列',
        '列表项隐藏标识', '列表项超出隐藏', '列表项格式化列', '列表项排序开关', '列表项序列',
        '列表项合并列头', '列表项统计',
        '筛选项类型', '筛选项类型扩展参数', '筛选项序列', '筛选项名称', '筛选项位置', '筛选项占位符', '筛选项布局',
        '表单项开启', '表单项类型', '表单项格式化', '表单项只读', '表单项类型扩展参数', '表单项布局',
        '表单项事件失去焦点', '表单项事件得到焦点', '表单项事件值改变', '表单项事件查询',
        '表单项验证', '表单项序列', '扩展信息'
    ]
    ws_field.append(field_headers)
    # 字段Sheet表头背景色：1-5浅灰色, 6-17浅蓝色, 18-24极浅蓝, 25-36淡紫色, 37浅灰色
    field_fill_ranges = [(1, 5, 'FFD9D9D9'), (6, 17, 'FF92CDDC'), (18, 24, 'FFDAEEF3'), (25, 36, 'FFB1A0C7'), (37, 37, 'FFD9D9D9')]
    for col in range(1, len(field_headers) + 1):
        fill_color = 'FFD9D9D9'
        for start, end, color in field_fill_ranges:
            if start <= col <= end:
                fill_color = color
                break
        apply_header_style(ws_field.cell(1, col), fill_color)

    for idx, config in enumerate(field_configs):
        # 判断是否是模块首行（第一个元素，data_dict 包含 eg_m）
        is_module_header = idx == 0 and 'eg_m' in str(config.get('data_dict', ''))

        row = [
            config.get('data_dict', ''),
            config.get('field_name', ''),
            config.get('field_name_cn', ''),
            config.get('relation_expr', ''),
            config.get('field_sort', ''),
            config.get('list_enable', ''),
            config.get('list_primary_key', ''),
            config.get('list_align', ''),
            config.get('list_width', ''),
            config.get('list_fixed', ''),
            config.get('list_hidden', ''),
            config.get('list_ellipsis', ''),
            config.get('list_format', ''),
            config.get('list_sorter', ''),
            config.get('list_order', ''),
            config.get('list_merge_header', ''),
            config.get('list_statistics', ''),
            config.get('filter_type', ''),
            config.get('filter_extra_param', ''),
            config.get('filter_order', ''),
            config.get('filter_label', ''),
            config.get('filter_position', ''),
            config.get('filter_placeholder', ''),
            config.get('filter_layout', ''),
            config.get('form_enable', ''),
            config.get('form_type', ''),
            config.get('form_format', ''),
            config.get('form_readonly', ''),
            config.get('form_extra_param', ''),
            config.get('form_layout', ''),
            config.get('form_event_blur', ''),
            config.get('form_event_focus', ''),
            config.get('form_event_change', ''),
            config.get('form_event_search', ''),
            config.get('form_validation', ''),
            config.get('form_order', ''),
            config.get('extra_info', '')
        ]
        ws_field.append(row)

        # 模块首行特殊处理：只在 A 列写入值，合并 A 到 AK 列
        if is_module_header:
            ws_field.merge_cells(start_row=ws_field.max_row, start_column=1, end_row=ws_field.max_row, end_column=37)
            cell = ws_field.cell(ws_field.max_row, 1)
            apply_module_row_style(cell)
            ws_field.row_dimensions[ws_field.max_row].height = 15.75
        else:
            for col in range(1, len(row) + 1):
                apply_data_style(ws_field.cell(ws_field.max_row, col))
            ws_field.row_dimensions[ws_field.max_row].height = 16.5

    # 设置字段 Sheet 列宽
    ws_field.column_dimensions['A'].width = 16.75
    ws_field.column_dimensions['B'].width = 15.375
    ws_field.column_dimensions['C'].width = 25.5
    ws_field.column_dimensions['D'].width = 47.625
    ws_field.column_dimensions['E'].width = 12.5
    ws_field.column_dimensions['F'].width = 14.25
    ws_field.column_dimensions['G'].width = 13.0
    ws_field.column_dimensions['H'].width = 12.0
    ws_field.column_dimensions['I'].width = 8.0
    ws_field.column_dimensions['J'].width = 8.0
    ws_field.column_dimensions['K'].width = 12.0
    ws_field.column_dimensions['L'].width = 12.0
    ws_field.column_dimensions['M'].width = 15.0
    ws_field.column_dimensions['N'].width = 10.0
    ws_field.column_dimensions['O'].width = 8.0
    ws_field.column_dimensions['P'].width = 12.0
    ws_field.column_dimensions['Q'].width = 8.0
    ws_field.column_dimensions['R'].width = 10.0
    ws_field.column_dimensions['S'].width = 12.0
    ws_field.column_dimensions['T'].width = 20.0
    ws_field.column_dimensions['U'].width = 8.0
    ws_field.column_dimensions['V'].width = 12.0
    ws_field.column_dimensions['W'].width = 10.0
    ws_field.column_dimensions['X'].width = 15.0
    ws_field.column_dimensions['Y'].width = 8.0
    ws_field.column_dimensions['Z'].width = 10.0
    ws_field.column_dimensions['AA'].width = 12.0
    ws_field.column_dimensions['AB'].width = 12.0
    ws_field.column_dimensions['AC'].width = 15.0
    ws_field.column_dimensions['AD'].width = 10.0
    ws_field.column_dimensions['AE'].width = 20.0
    ws_field.column_dimensions['AF'].width = 10.0
    ws_field.column_dimensions['AG'].width = 10.0
    ws_field.column_dimensions['AH'].width = 10.0
    ws_field.column_dimensions['AI'].width = 10.0
    ws_field.column_dimensions['AJ'].width = 15.0
    ws_field.column_dimensions['AK'].width = 8.0
    ws_field.column_dimensions['AL'].width = 20.0

    # ============== 4. 菜单 Sheet ==============
    ws_menu = wb.create_sheet('菜单')

    menu_headers = [
        '菜单id', '父级菜单id', '前端资源代码', '菜单名称', '菜单路径',
        '高亮节点路径', '菜单图标', '隐藏', '路径重定向', '组件',
        '有效标记', '默认全屏', '菜单类型', '菜单序列', '角色'
    ]
    ws_menu.append(menu_headers)
    for col in range(1, len(menu_headers) + 1):
        apply_header_style(ws_menu.cell(1, col), 'FFD9D9D9')
    ws_menu.row_dimensions[1].height = 14.25

    for menu in menu_configs:
        row = [
            menu.get('menu_id', ''),
            menu.get('parent_id', ''),
            menu.get('resource_code', ''),
            menu.get('menu_name', ''),
            menu.get('menu_path', ''),
            menu.get('highlight_path', ''),
            menu.get('menu_icon', ''),
            menu.get('hidden', ''),
            menu.get('redirect', ''),
            menu.get('component', ''),
            menu.get('enabled', ''),
            menu.get('fullscreen', ''),
            menu.get('menu_type', ''),
            menu.get('menu_order', ''),
            menu.get('roles', '')
        ]
        ws_menu.append(row)
        for col in range(1, len(row) + 1):
            apply_data_style(ws_menu.cell(ws_menu.max_row, col))
        ws_menu.row_dimensions[ws_menu.max_row].height = 14.25

    # 设置菜单 Sheet 列宽
    ws_menu.column_dimensions['A'].width = 9.25
    ws_menu.column_dimensions['B'].width = 9.0
    ws_menu.column_dimensions['C'].width = 15.0
    ws_menu.column_dimensions['D'].width = 10.5
    ws_menu.column_dimensions['E'].width = 45.5
    ws_menu.column_dimensions['F'].width = 10.5
    ws_menu.column_dimensions['G'].width = 14.875
    ws_menu.column_dimensions['H'].width = 6.0
    ws_menu.column_dimensions['I'].width = 15.0
    ws_menu.column_dimensions['J'].width = 30.0
    ws_menu.column_dimensions['K'].width = 8.0
    ws_menu.column_dimensions['L'].width = 8.0
    ws_menu.column_dimensions['M'].width = 8.0
    ws_menu.column_dimensions['N'].width = 10.0
    ws_menu.column_dimensions['O'].width = 15.0

    # 保存文件
    output_dir = Path(output_path).parent
    output_dir.mkdir(parents=True, exist_ok=True)
    wb.save(output_path)

    print(f"[OK] Excel file generated: {output_path}")
    return True


def generate_multi_module_excel(modules: list, output_path: str) -> bool:
    """
    生成多模块合并的 Excel 文件
    modules: list[dict], 每个 dict 包含 table_info, module_info, field_configs, menu_configs
    """

    wb = Workbook()

    # ============== 1. 表 Sheet ==============
    ws_table = wb.active
    ws_table.title = '表'
    table_headers = ['字段', '字段中文名', '数据类型', '键', '默认值', '非空', '备注']
    ws_table.append(table_headers)
    for col in range(1, len(table_headers) + 1):
        apply_header_style(ws_table.cell(1, col), 'FFD9D9D9')
    ws_table.column_dimensions['A'].width = 29.5
    ws_table.column_dimensions['B'].width = 25.5
    ws_table.column_dimensions['C'].width = 11.5
    ws_table.column_dimensions['D'].width = 5.625
    ws_table.column_dimensions['E'].width = 6.0
    ws_table.column_dimensions['F'].width = 4.5
    ws_table.column_dimensions['G'].width = 13.0

    # ============== 2. 模块 Sheet ==============
    ws_module = wb.create_sheet('模块')
    module_headers = [
        '模块key', '模块名称', '列表序号', '列表边框', '列表首选项',
        '列表扩展', '列表列编辑', '列表列删除', '列表列详情',
        '工具栏增加', '工具栏删除', '工具栏编辑', '工具栏导入', '工具栏导出',
        '工具栏设置', '工具栏全屏', '工具栏刷新', '工具栏筛选',
        'Api保存', 'Api删除', 'Api列表查询', 'Api查询表单', 'Api导出', 'Api导入', 'Api模板下载',
        '表单布局', '表单宽度', '表单提交方式',
        '自定义按钮工具栏', '列表列自定义按钮', '扩展信息'
    ]
    ws_module.append(module_headers)
    module_fill_ranges = [(1, 2, 'FFEBF1DE'), (3, 6, 'FFE4DFEC'), (7, 18, 'FFDDD9C4'),
                          (19, 25, 'FFC5D9F1'), (26, 28, 'FFFDE9D9'), (29, 30, 'FFE4DFEC'), (31, 31, 'FFD9D9D9')]
    for col in range(1, len(module_headers) + 1):
        fill_color = 'FFD9D9D9'
        for start, end, color in module_fill_ranges:
            if start <= col <= end:
                fill_color = color
                break
        apply_header_style(ws_module.cell(1, col), fill_color)
    ws_module.column_dimensions['A'].width = 24.25
    ws_module.column_dimensions['B'].width = 23.875
    for col_idx in range(3, 32):
        col_letter = ws_module.cell(1, col_idx).column_letter
        ws_module.column_dimensions[col_letter].width = 9.0
    ws_module.column_dimensions['S'].width = 15.0
    ws_module.column_dimensions['T'].width = 15.0
    ws_module.column_dimensions['U'].width = 15.0
    ws_module.column_dimensions['V'].width = 15.0
    ws_module.column_dimensions['W'].width = 15.0
    ws_module.column_dimensions['X'].width = 15.0
    ws_module.column_dimensions['Y'].width = 15.0
    ws_module.column_dimensions['AC'].width = 20.0
    ws_module.column_dimensions['AD'].width = 20.0
    ws_module.column_dimensions['AE'].width = 15.0

    # ============== 3. 字段 Sheet ==============
    ws_field = wb.create_sheet('字段')
    field_headers = [
        '数据字典', '字段名称', '字段中文名', '关联字段表达式', '字段初始排序',
        '列表项开启标识', '列表项主键标识', '列表项对齐方式', '列表项列宽', '列表项固定列',
        '列表项隐藏标识', '列表项超出隐藏', '列表项格式化列', '列表项排序开关', '列表项序列',
        '列表项合并列头', '列表项统计',
        '筛选项类型', '筛选项类型扩展参数', '筛选项序列', '筛选项名称', '筛选项位置', '筛选项占位符', '筛选项布局',
        '表单项开启', '表单项类型', '表单项格式化', '表单项只读', '表单项类型扩展参数', '表单项布局',
        '表单项事件失去焦点', '表单项事件得到焦点', '表单项事件值改变', '表单项事件查询',
        '表单项验证', '表单项序列', '扩展信息'
    ]
    ws_field.append(field_headers)
    field_fill_ranges = [(1, 5, 'FFD9D9D9'), (6, 17, 'FF92CDDC'), (18, 24, 'FFDAEEF3'), (25, 36, 'FFB1A0C7'), (37, 37, 'FFD9D9D9')]
    for col in range(1, len(field_headers) + 1):
        fill_color = 'FFD9D9D9'
        for start, end, color in field_fill_ranges:
            if start <= col <= end:
                fill_color = color
                break
        apply_header_style(ws_field.cell(1, col), fill_color)
    ws_field.column_dimensions['A'].width = 16.75
    ws_field.column_dimensions['B'].width = 15.375
    ws_field.column_dimensions['C'].width = 25.5
    ws_field.column_dimensions['D'].width = 47.625
    ws_field.column_dimensions['E'].width = 12.5
    for col_idx in range(6, 38):
        col_letter = ws_field.cell(1, col_idx).column_letter
        ws_field.column_dimensions[col_letter].width = 10.0
    ws_field.column_dimensions['M'].width = 15.0
    ws_field.column_dimensions['T'].width = 20.0
    ws_field.column_dimensions['X'].width = 15.0
    ws_field.column_dimensions['AE'].width = 20.0
    ws_field.column_dimensions['AL'].width = 20.0

    # ============== 4. 菜单 Sheet ==============
    ws_menu = wb.create_sheet('菜单')
    menu_headers = [
        '菜单id', '父级菜单id', '前端资源代码', '菜单名称', '菜单路径',
        '高亮节点路径', '菜单图标', '隐藏', '路径重定向', '组件',
        '有效标记', '默认全屏', '菜单类型', '菜单序列', '角色'
    ]
    ws_menu.append(menu_headers)
    for col in range(1, len(menu_headers) + 1):
        apply_header_style(ws_menu.cell(1, col), 'FFD9D9D9')
    ws_menu.row_dimensions[1].height = 14.25
    ws_menu.column_dimensions['A'].width = 9.25
    ws_menu.column_dimensions['B'].width = 9.0
    ws_menu.column_dimensions['C'].width = 15.0
    ws_menu.column_dimensions['D'].width = 10.5
    ws_menu.column_dimensions['E'].width = 45.5
    ws_menu.column_dimensions['F'].width = 10.5
    ws_menu.column_dimensions['G'].width = 14.875
    ws_menu.column_dimensions['H'].width = 6.0
    ws_menu.column_dimensions['I'].width = 15.0
    ws_menu.column_dimensions['J'].width = 30.0
    ws_menu.column_dimensions['K'].width = 8.0
    ws_menu.column_dimensions['L'].width = 8.0
    ws_menu.column_dimensions['M'].width = 8.0
    ws_menu.column_dimensions['N'].width = 10.0
    ws_menu.column_dimensions['O'].width = 15.0

    # 生成随机8位数字作为菜单ID起点
    import random
    base_menu_id = random.randint(10000000, 99999999)
    menu_seq_counter = 0  # 菜单序列计数器

    # ============== 写入各模块数据 ==============
    for module_idx, mod in enumerate(modules):
        table_info = mod.get('table_info', {})
        module_info = mod.get('module_info', {})
        field_configs = mod.get('field_configs', [])
        menu_configs = mod.get('menu_configs', [])

        # ----- 表 Sheet: 追加表名行和字段行 -----
        # 表名行
        table_name_row = [f"{table_info.get('table_name_cn', '')} {table_info.get('table_name_en', '')}", '', '', '', '', '', '']
        ws_table.append(table_name_row)
        for col in range(1, len(table_name_row) + 1):
            apply_table_name_style(ws_table.cell(ws_table.max_row, col))
        ws_table.row_dimensions[ws_table.max_row].height = 15.0

        # 字段行 - 跳过分隔行（data_dict 为空）
        for field in table_info.get('fields', []):
            # 分隔行的 data_dict 为空，跳过（不写入表 Sheet）
            if 'data_dict' in field and field.get('data_dict') == '':
                continue
            row = [
                field.get('name', ''),
                field.get('name_cn', ''),
                field.get('data_type', field.get('type', '')),
                field.get('key', ''),
                '',
                field.get('required', ''),
                field.get('remark', '')
            ]
            ws_table.append(row)
            for col in range(1, len(row) + 1):
                apply_data_style(ws_table.cell(ws_table.max_row, col))
            ws_table.row_dimensions[ws_table.max_row].height = 16.5

        # ----- 模块 Sheet: 追加模块配置行 -----
        module_row = [
            module_info.get('module_key', ''),
            module_info.get('module_name', ''),
            module_info.get('grid_serial', ''),
            module_info.get('grid_border', ''),
            module_info.get('grid_selection_type', ''),
            module_info.get('grid_ext', ''),
            module_info.get('grid_columns_edit', ''),
            module_info.get('grid_columns_delete', ''),
            module_info.get('grid_columns_detail', ''),
            module_info.get('toolbar_add', ''),
            module_info.get('toolbar_delete', ''),
            module_info.get('toolbar_edit', ''),
            module_info.get('toolbar_upload', ''),
            module_info.get('toolbar_download', ''),
            module_info.get('toolbar_setting', ''),
            module_info.get('toolbar_full', ''),
            module_info.get('toolbar_reload', ''),
            module_info.get('toolbar_filter', ''),
            module_info.get('api_save', ''),
            module_info.get('api_delete', ''),
            module_info.get('api_grid_query', ''),
            module_info.get('api_form_query', ''),
            module_info.get('api_export', ''),
            module_info.get('api_import', ''),
            module_info.get('api_template', ''),
            module_info.get('form_layout', ''),
            module_info.get('form_width', ''),
            module_info.get('form_submit_type', ''),
            module_info.get('custom_toolbar_buttons', ''),
            module_info.get('custom_column_buttons', ''),
            module_info.get('extra_info', '')
        ]
        ws_module.append(module_row)
        for col in range(1, len(module_row) + 1):
            apply_data_style(ws_module.cell(ws_module.max_row, col))
        ws_module.row_dimensions[ws_module.max_row].height = 16.5

        # ----- 字段 Sheet: 追加模块首行和字段配置行 -----
        for idx, config in enumerate(field_configs):
            is_module_header = idx == 0 and 'eg_m' in str(config.get('data_dict', ''))
            row = [
                config.get('data_dict', ''),
                config.get('field_name', ''),
                config.get('field_name_cn', ''),
                config.get('relation_expr', ''),
                config.get('field_sort', ''),
                config.get('list_enable', ''),
                config.get('list_primary_key', ''),
                config.get('list_align', ''),
                config.get('list_width', ''),
                config.get('list_fixed', ''),
                config.get('list_hidden', ''),
                config.get('list_ellipsis', ''),
                config.get('list_format', ''),
                config.get('list_sorter', ''),
                config.get('list_order', ''),
                config.get('list_merge_header', ''),
                config.get('list_statistics', ''),
                config.get('filter_type', ''),
                config.get('filter_extra_param', ''),
                config.get('filter_order', ''),
                config.get('filter_label', ''),
                config.get('filter_position', ''),
                config.get('filter_placeholder', ''),
                config.get('filter_layout', ''),
                config.get('form_enable', ''),
                config.get('form_type', ''),
                config.get('form_format', ''),
                config.get('form_readonly', ''),
                config.get('form_extra_param', ''),
                config.get('form_layout', ''),
                config.get('form_event_blur', ''),
                config.get('form_event_focus', ''),
                config.get('form_event_change', ''),
                config.get('form_event_search', ''),
                config.get('form_validation', ''),
                config.get('form_order', ''),
                config.get('extra_info', '')
            ]
            ws_field.append(row)
            if is_module_header:
                ws_field.merge_cells(start_row=ws_field.max_row, start_column=1, end_row=ws_field.max_row, end_column=37)
                cell = ws_field.cell(ws_field.max_row, 1)
                apply_module_row_style(cell)
                ws_field.row_dimensions[ws_field.max_row].height = 15.75
            else:
                for col in range(1, len(row) + 1):
                    apply_data_style(ws_field.cell(ws_field.max_row, col))
                ws_field.row_dimensions[ws_field.max_row].height = 16.5

        # ----- 菜单 Sheet: 追加菜单配置行 -----
        for menu_idx, menu in enumerate(menu_configs):
            menu_seq_counter += 1
            menu_id = base_menu_id + menu_seq_counter - 1
            row = [
                menu_id,  # 随机起点，后续依次加一
                menu.get('parent_id', ''),
                menu.get('resource_code', ''),
                menu.get('menu_name', ''),
                menu.get('menu_path', ''),
                menu.get('highlight_path', ''),
                menu.get('menu_icon', ''),
                menu.get('hidden', ''),
                menu.get('redirect', ''),
                menu.get('component', ''),
                menu.get('enabled', ''),
                menu.get('fullscreen', ''),
                menu.get('menu_type', ''),
                menu_id,  # 菜单序列与菜单ID一致
                menu.get('roles', '')
            ]
            ws_menu.append(row)
            for col in range(1, len(row) + 1):
                apply_data_style(ws_menu.cell(ws_menu.max_row, col))
            ws_menu.row_dimensions[ws_menu.max_row].height = 14.25

    # 保存文件
    output_dir = Path(output_path).parent
    output_dir.mkdir(parents=True, exist_ok=True)
    wb.save(output_path)

    print(f"[OK] Excel file generated: {output_path}")
    return True
    return True


# ============== 主函数 ==============

def main():
    # 默认输出到项目根目录下的 exports/module_configs/
    # 脚本路径: .claude/skills/module-excel-generator/scripts/generate_module_excel.py
    # 项目根目录: .claude 的 parent
    default_output = str(Path(__file__).parent.parent.parent.parent.parent / 'exports/module_configs')

    parser = argparse.ArgumentParser(
        description='Module Excel Config Generator'
    )
    parser.add_argument('--requirement', '-r', help='Business requirement description (legacy, use --table-info instead)')
    parser.add_argument('--table-name-cn', help='Table Chinese name (use with --table-info)')
    parser.add_argument('--table-name-en', help='Table English name (use with --table-info)')
    parser.add_argument('--output', '-o', default=default_output, help='Output directory')
    parser.add_argument('--interactive', '-i', action='store_true', help='Interactive mode')
    parser.add_argument('--table-info', action='append', help='Table structure as JSON string. Can be specified multiple times for multi-module export.')
    parser.add_argument('--multi', action='store_true', help='(Deprecated) Use --groups instead. Master-detail mode: first table is master, rest are details.')
    parser.add_argument('--groups', '-g', help='Module group definition. Format: "MasterA|Detail1,Detail2;MasterB|Detail3;ModuleC;ModuleD". Use | to separate master from details, ; to separate groups.')

    args = parser.parse_args()

    # 多模块模式：支持多组主子表关系
    if args.table_info and len(args.table_info) > 1:
        modules = []
        tables = []

        # 解析所有 table_info
        for table_info_json in args.table_info:
            try:
                table_info = json.loads(table_info_json)
            except json.JSONDecodeError as e:
                print(f"Error: Invalid JSON format for --table-info: {e}")
                sys.exit(1)
            if 'table_name_cn' not in table_info or 'table_name_en' not in table_info or 'fields' not in table_info:
                print("Error: --table-info must contain table_name_cn, table_name_en, and fields")
                sys.exit(1)
            tables.append(table_info)

        # 构建表名到表信息的映射
        table_map = {t['table_name_cn']: t for t in tables}

        # 解析 --groups 参数确定主子表关系
        master_detail_groups = []  # [(master_table_name, [detail_table_names]), ...]
        standalone_modules = []    # [table_name, ...]

        if args.groups:
            # 格式: "MasterA|Detail1,Detail2;MasterB|Detail3;ModuleC;ModuleD"
            groups = args.groups.split(';')
            for group in groups:
                group = group.strip()
                if '|' in group:
                    # 主子表关系
                    parts = group.split('|')
                    master_name = parts[0].strip()
                    detail_names = [d.strip() for d in parts[1].split(',')]
                    master_detail_groups.append((master_name, detail_names))
                else:
                    # 独立模块
                    standalone_modules.append(group.strip())
        elif args.multi:
            # 兼容旧 --multi 参数：第一个为主表，其余为子表
            if tables:
                master_detail_groups.append((tables[0]['table_name_cn'], [t['table_name_cn'] for t in tables[1:]]))
        else:
            # 没有指定关系，所有模块独立
            standalone_modules = [t['table_name_cn'] for t in tables]

        # 处理主子表关系
        for master_name, detail_names in master_detail_groups:
            if master_name not in table_map:
                print(f"Error: Master table '{master_name}' not found in --table-info")
                sys.exit(1)
            master_table = table_map[master_name]

            # 为主表创建 leaf 分隔行
            master_fields = master_table['fields'].copy()
            display_field = find_display_field(master_table)

            for detail_name in detail_names:
                if detail_name not in table_map:
                    print(f"Error: Detail table '{detail_name}' not found in --table-info")
                    sys.exit(1)
                detail_table = table_map[detail_name]
                child_module_key = f"eg_m_{detail_table['table_name_en']}"
                label = infer_leaf_label(detail_table['table_name_cn'])
                leaf_field = create_leaf_field(child_module_key, display_field, label)
                master_fields.append(leaf_field)

                # 为子表添加外键字段（如果不存在）
                master_name_en = master_table['table_name_en']
                master_name_short = master_name_en.split('_')[-1] if '_' in master_name_en else master_name_en.split('_')[0]
                fk_field_name = f"{master_name_short}_uuid"

                has_fk = any(master_name_en in f.get('name', '') or fk_field_name in f.get('name', '')
                            for f in detail_table.get('fields', []))
                if not has_fk:
                    detail_table['fields'].insert(0, {
                        'name': fk_field_name,
                        'name_cn': f'{master_table["table_name_cn"]}ID',
                        'type': 'varchar(32)',
                        'key': '',
                        'required': 'Y'
                    })

            master_table['fields'] = master_fields

        # 确定所有需要生成的模块（主子表的主表 + 独立模块 + 所有子表）
        modules_to_generate = set()

        # 添加主子表的主表
        for master_name, _ in master_detail_groups:
            modules_to_generate.add(master_name)

        # 添加独立模块
        for name in standalone_modules:
            if name in table_map:
                modules_to_generate.add(name)

        # 添加所有子表（它们也是独立模块）
        for _, detail_names in master_detail_groups:
            for detail_name in detail_names:
                modules_to_generate.add(detail_name)

        # 处理所有需要生成的模块
        for table_info in tables:
            if table_info['table_name_cn'] in modules_to_generate:
                module_info = design_module_config(table_info)
                field_configs = design_field_configs(table_info, module_info)
                menu_configs = design_menu_config(module_info, table_info)
                modules.append({
                    'table_info': table_info,
                    'module_info': module_info,
                    'field_configs': field_configs,
                    'menu_configs': menu_configs
                })
                modules_to_generate.remove(table_info['table_name_cn'])

        # 如果还有未处理的模块（独立模块）
        for name in modules_to_generate:
            if name in table_map:
                table_info = table_map[name]
                module_info = design_module_config(table_info)
                field_configs = design_field_configs(table_info, module_info)
                menu_configs = design_menu_config(module_info, table_info)
                modules.append({
                    'table_info': table_info,
                    'module_info': module_info,
                    'field_configs': field_configs,
                    'menu_configs': menu_configs
                })

        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        output_filename = f"多模块合并_{timestamp}.xlsx"
        if args.output.endswith('.xlsx'):
            output_path = args.output
        else:
            output_path = str(Path(args.output) / output_filename)

        success = generate_multi_module_excel(modules, output_path)
        if success:
            print(f"\n[Summary] Multi-module export")
            print(f"   - Modules: {len(modules)}")
            for m in modules:
                print(f"     - {m['module_info'].get('module_name')} ({m['module_info'].get('module_key')})")
        else:
            sys.exit(1)
        return

    # 单模块模式
    if args.table_info:
        # 使用传入的表结构（来自 AI 设计）
        try:
            table_info = json.loads(args.table_info[0] if isinstance(args.table_info, list) else args.table_info)
        except json.JSONDecodeError as e:
            print(f"Error: Invalid JSON format for --table-info: {e}")
            sys.exit(1)
        # 验证必填字段
        if 'table_name_cn' not in table_info or 'table_name_en' not in table_info or 'fields' not in table_info:
            print("Error: --table-info must contain table_name_cn, table_name_en, and fields")
            sys.exit(1)
    elif args.interactive:
        print("=" * 50)
        print("Module Excel Config Generator - Interactive Mode")
        print("=" * 50)

        table_name_cn = input("\nTable Chinese name: ").strip()
        table_name_en = input("Table English name: ").strip()

        valid, msg = validate_table_name_en(table_name_en)
        if not valid:
            print(f"Error: {msg}")
            sys.exit(1)

        fields = []
        print("\nEnter field info (type 'done' to finish):")
        while True:
            field_name = input("\nField name (English): ").strip()
            if field_name.lower() == 'done':
                break

            valid, msg = validate_field_name(field_name)
            if not valid:
                print(f"Error: {msg}")
                continue

            field_name_cn = input("Field Chinese name: ").strip()
            data_type = input("Data type (varchar(32)/char(1)/datetime/decimal(18,2)): ").strip()

            valid, msg = validate_data_type(data_type)
            if not valid:
                print(f"Error: {msg}")
                continue

            is_key = input("Primary key (p_key/empty): ").strip()
            is_required = input("Required (Y/empty): ").strip()

            fields.append({
                'name': field_name,
                'name_cn': field_name_cn,
                'data_type': data_type,
                'key': is_key,
                'default': '',
                'required': is_required,
                'remark': ''
            })

        table_info = {
            'table_name_cn': table_name_cn,
            'table_name_en': table_name_en,
            'fields': fields
        }

    elif args.requirement:
        # 旧模式（已废弃）：由 Python 脚本根据需求描述自动推断表结构
        # 推荐使用 --table-info 直接传入 AI 设计好的表结构
        print("[Warning] 使用旧模式，已废弃。推荐使用 --table-info 传入 AI 设计的表结构。")
        table_info = design_table_structure(args.requirement)
        if args.table_name_cn:
            table_info['table_name_cn'] = args.table_name_cn
        if args.table_name_en:
            table_info['table_name_en'] = args.table_name_en
    else:
        # 既没有 --table-info，也没有 --requirement，打印帮助并退出
        parser.print_help()
        print("\n" + "="*60)
        print("推荐用法（AI 驱动模式）：")
        print("  # 单模块")
        print("  python generate_module_excel.py --table-info '{\"table_name_cn\":\"表名\",\"table_name_en\":\"table_name\",\"fields\":[...]}'")
        print("")
        print("  # 多模块合并（多个 --table-info）")
        print("  python generate_module_excel.py --multi --table-info '{\"table_name_cn\":\"模块1\",\"table_name_en\":\"mod1\",\"fields\":[...]}' --table-info '{\"table_name_cn\":\"模块2\",\"table_name_en\":\"mod2\",\"fields\":[...]}'")
        print("="*60)
        sys.exit(1)

    module_info = design_module_config(table_info)
    field_configs = design_field_configs(table_info, module_info)
    menu_configs = design_menu_config(module_info, table_info)

    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    module_name = module_info.get('module_name', 'module')
    module_key = module_info.get('module_key', 'eg_m_module')
    output_filename = f"{module_name}_{module_key}_{timestamp}.xlsx"

    if args.output.endswith('.xlsx'):
        output_path = args.output
    else:
        output_path = str(Path(args.output) / output_filename)

    success = generate_module_excel(
        table_info,
        module_info,
        field_configs,
        menu_configs,
        output_path
    )

    if success:
        print(f"\n[Summary]")
        print(f"   - Table: {table_info.get('table_name_cn')} ({table_info.get('table_name_en')})")
        print(f"   - Fields: {len(table_info.get('fields', []))}")
        print(f"   - Module: {module_info.get('module_name')} ({module_info.get('module_key')})")
        print(f"   - Menus: {len(menu_configs)}")
    else:
        sys.exit(1)


if __name__ == '__main__':
    main()
