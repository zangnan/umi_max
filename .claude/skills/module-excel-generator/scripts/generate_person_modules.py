#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""生成人员管理模块配置Excel"""

import sys
import json
from pathlib import Path

# 添加项目路径
sys.path.insert(0, str(Path(__file__).parent))

from generate_module_excel import (
    design_module_config, design_field_configs, design_menu_config,
    create_rel2_field, get_rel_field_info, find_display_field, infer_leaf_label,
    validate_list_format_configs, generate_multi_module_excel
)

# 定义4个表结构
person_table = {
    "table_name_cn": "人员管理",
    "table_name_en": "person",
    "fields": [
        {"name": "person_uuid", "name_cn": "人员UUID", "data_type": "varchar(32)", "key": "p_key", "required": "Y", "remark": "主键"},
        {"name": "person_code", "name_cn": "工号", "data_type": "varchar(20)", "key": "", "required": "Y", "remark": ""},
        {"name": "person_name", "name_cn": "姓名", "data_type": "varchar(50)", "key": "", "required": "Y", "remark": ""},
        {"name": "person_gender", "name_cn": "性别", "data_type": "char(1)", "key": "", "required": "", "remark": ""},
        {"name": "person_age", "name_cn": "年龄", "data_type": "int(10)", "key": "", "required": "", "remark": ""},
        {"name": "person_phone", "name_cn": "电话", "data_type": "varchar(20)", "key": "", "required": "", "remark": ""},
        {"name": "person_email", "name_cn": "邮箱", "data_type": "varchar(100)", "key": "", "required": "", "remark": ""},
        {"name": "person_status", "name_cn": "状态", "data_type": "char(1)", "key": "", "required": "Y", "remark": "1在职/0离职"},
        {"name": "tag_ids", "name_cn": "性格标签", "data_type": "varchar(500)", "key": "", "required": "", "remark": "一对多关联"},
        {"name": "create_time", "name_cn": "创建时间", "data_type": "datetime", "key": "", "required": "Y", "remark": ""}
    ]
}

person_tag_table = {
    "table_name_cn": "性格标签管理",
    "table_name_en": "person_tag",
    "fields": [
        {"name": "tag_uuid", "name_cn": "标签UUID", "data_type": "varchar(32)", "key": "p_key", "required": "Y", "remark": "主键"},
        {"name": "tag_name", "name_cn": "标签名称", "data_type": "varchar(50)", "key": "", "required": "Y", "remark": ""},
        {"name": "tag_color", "name_cn": "标签颜色", "data_type": "varchar(20)", "key": "", "required": "", "remark": ""},
        {"name": "tag_desc", "name_cn": "标签描述", "data_type": "varchar(200)", "key": "", "required": "", "remark": ""},
        {"name": "create_time", "name_cn": "创建时间", "data_type": "datetime", "key": "", "required": "Y", "remark": ""}
    ]
}

permission_table = {
    "table_name_cn": "权限管理",
    "table_name_en": "permission",
    "fields": [
        {"name": "perm_uuid", "name_cn": "权限UUID", "data_type": "varchar(32)", "key": "p_key", "required": "Y", "remark": "主键"},
        {"name": "perm_name", "name_cn": "权限名称", "data_type": "varchar(100)", "key": "", "required": "Y", "remark": ""},
        {"name": "perm_code", "name_cn": "权限代码", "data_type": "varchar(50)", "key": "", "required": "Y", "remark": ""},
        {"name": "perm_type", "name_cn": "权限类型", "data_type": "varchar(20)", "key": "", "required": "", "remark": "menu/button/api"},
        {"name": "perm_desc", "name_cn": "权限描述", "data_type": "varchar(200)", "key": "", "required": "", "remark": ""},
        {"name": "create_time", "name_cn": "创建时间", "data_type": "datetime", "key": "", "required": "Y", "remark": ""}
    ]
}

person_perm_ref_table = {
    "table_name_cn": "人员与权限关系表",
    "table_name_en": "person_perm_ref",
    "fields": [
        {"name": "ref_uuid", "name_cn": "关系UUID", "data_type": "varchar(32)", "key": "p_key", "required": "Y", "remark": "主键"},
        {"name": "person_uuid", "name_cn": "人员ID", "data_type": "varchar(32)", "key": "", "required": "Y", "remark": "外键"},
        {"name": "perm_uuid", "name_cn": "权限ID", "data_type": "varchar(32)", "key": "", "required": "Y", "remark": "外键"},
        {"name": "create_time", "name_cn": "创建时间", "data_type": "datetime", "key": "", "required": "Y", "remark": ""}
    ]
}

# 构建表映射（中文名 -> 表信息）
table_map = {
    "人员管理": person_table,
    "性格标签管理": person_tag_table,
    "权限管理": permission_table,
    "人员与权限关系表": person_perm_ref_table
}

# 表英文名映射
table_en_map = {
    "person": person_table,
    "person_tag": person_tag_table,
    "permission": permission_table,
    "person_perm_ref": person_perm_ref_table
}

# 主子表关系配置
# rel: 一对多关联 - 主表中直接存储关联ID（tag_ids），列表中通过rel:展示名称
# rel2: 多对多关联 - 通过中间表关联，列表中通过rel2:展示（如权限管理通过person_perm_ref关联）
# 注意：rel2参数只放被关联的模块（权限管理），不要放中间表（人员与权限关系表）
master_detail_groups = [
    {
        "master": "人员管理",
        "sub": [],       # 没有子表（不是主从表）
        "rel": ["性格标签管理"],    # 一对多关联
        "rel2": ["权限管理"]  # 多对多关联（通过person_perm_ref中间表）
    }
]

# 处理主表的关联表配置
master_table = table_map["人员管理"]
master_fields = master_table["fields"].copy()

# 处理 rel 一对多关联：更新 tag_ids 字段的 list_format
rel_info = get_rel_field_info("性格标签管理", table_map, master_table)
if rel_info:
    rel_field_name = rel_info['field_name']  # person_tag_ids
    rel_format = rel_info['list_format']      # rel:eg_m_person_tag&tag_name

    # 查找主表中的 tag_ids 字段并更新配置
    found = False
    for field in master_fields:
        if field.get('name') == rel_field_name:
            field['list_format'] = rel_format
            field['list_fixed'] = 'R'
            field['form_enable'] = ''
            field['form_type'] = ''
            field['form_format'] = ''
            found = True
            print(f"[OK] 更新 rel 字段: {rel_field_name} -> {rel_format}")
            break

    # 如果找不到 person_tag_ids，尝试 tag_ids
    if not found:
        for field in master_fields:
            if field.get('name') == 'tag_ids':
                field['list_format'] = rel_format
                field['list_fixed'] = 'R'
                field['form_enable'] = ''
                field['form_type'] = ''
                field['form_format'] = ''
                print(f"[OK] 更新 rel 字段: tag_ids -> {rel_format}")
                found = True
                break

# 处理 rel2 多对多关联：添加虚拟行
# rel2 模块是被关联的模块（如"权限管理"），系统会自动查找中间表（如 person_perm_ref）
# 不要把中间表（如"人员与权限关系表"）作为 rel2 模块传入
for rel2_name in ["权限管理"]:
    rel2_field = create_rel2_field(rel2_name, table_map, master_table)
    if rel2_field:
        master_fields.append(rel2_field)
        print(f"[OK] 添加 rel2 字段: {rel2_name}")

master_table['fields'] = master_fields

# 构建模块列表
modules = []

# 需要生成的模块（主表 + 所有关联表）
modules_to_generate = ["人员管理", "性格标签管理", "权限管理", "人员与权限关系表"]

for table_info in [person_table, person_tag_table, permission_table, person_perm_ref_table]:
    table_name_cn = table_info['table_name_cn']
    if table_name_cn not in modules_to_generate:
        continue

    module_info = design_module_config(table_info)
    field_configs = design_field_configs(table_info, module_info)
    menu_configs = design_menu_config(module_info, table_info)

    modules.append({
        'table_info': table_info,
        'module_info': module_info,
        'field_configs': field_configs,
        'menu_configs': menu_configs
    })
    print(f"[OK] 生成模块: {table_name_cn} ({module_info['module_key']})")

# 校验
errors = validate_list_format_configs(modules, table_en_map, master_detail_groups)
if errors:
    print("\n[校验失败] 发现以下问题：")
    for err in errors:
        print(f"  - {err}")
    sys.exit(1)

# 生成 Excel
from datetime import datetime
timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
output_path = Path('d:/work/ddit/code/umi_max.260226_github/exports/module_configs') / f'多模块合并_{timestamp}.xlsx'
output_path.parent.mkdir(parents=True, exist_ok=True)

success = generate_multi_module_excel(modules, str(output_path))
if success:
    print(f"\n[Summary] 多模块合并导出")
    print(f"   - 模块数: {len(modules)}")
    for m in modules:
        print(f"     - {m['module_info'].get('module_name')} ({m['module_info'].get('module_key')})")
    print(f"\n[OK] Excel 文件已生成: {output_path}")