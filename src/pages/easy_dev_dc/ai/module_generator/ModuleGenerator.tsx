/**
 * 模块生成器主容器组件
 */

import { Flex, message } from 'antd';
import React, { useState } from 'react';
import AIChatPanel from './components/AIChatPanel';
import DataPreview from './components/DataPreview';
import useModuleAI from './hooks/useModuleAI';
import myUtil from '@/components/DDAssist/util';
import { queryListNs } from '@/services/hts/apiNs';
import type { SheetData } from './types/module';
import { cloneDeep } from 'lodash';
import DDIT_TOOL_CONSTANTS from '@/components/DDBunit/excelConfig.v2.constants';

const CKEY = DDIT_TOOL_CONSTANTS.CONFIG_KEY;

const ModuleGenerator: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [sheetData, setSheetData] = useState<SheetData | null>(null);

  const handleSuccess = (data: SheetData) => {
    setSheetData(data);
  };

  const { messages, isRequesting, abort, submitRequirement } = useModuleAI({
    onSuccess: handleSuccess,
  });

  const handleSubmit = (value: string) => {
    setInputValue('');
    submitRequirement(value);
  };

  const handleCancel = () => {
    abort();
  };

  // ============== 保存模块到数据库 ==============

  // 1. 创建物理表
  const createTables = async (tableSheet: any[]) => {
    // formatCreateTableData 期望 tableSheet 使用中文 key（字段、数据类型、默认值等）
    // 需要将英文字段名转换为中文 key
    const tableSheetConverted = tableSheet.map((row: any) => ({
      '字段': row[CKEY.DICT_FIELD_NAME] || '',
      '数据类型': row[CKEY.DICT_FIELD_TYPE] || '',
      '默认值': row[CKEY.DICT_FIELD_DEFAULT_VALUE] || '',
      '字段中文名': row[CKEY.DICT_FIELD_DESC] || '',
      '非空': row[CKEY.DICT_FIELD_NOT_NULL] || '',
      '键': row[CKEY.DICT_FIELD_KEY] || '',
      '备注': row[CKEY.DICT_FIELD_REMARK] || '',
    }));

    const tablesArr = await myUtil.mysql.formatCreateTableData(tableSheetConverted);
    const res: any = await myUtil.mysql.createTable(tableSheetConverted);
    return { tablesArr, createTablesRes: res };
  };

  // 2. 整理 dict、dict_field 数据
  const getTableData1 = (tablesArr: any[]) => {
    const tableDataTmp: any = [];
    const dBDataDict: any = [];
    const dBDataDictField: any = [];

    tablesArr.forEach((item: any) => {
      dBDataDict.push({
        dict_name: item.table_name_eng,
        dict_desc: item.table_name_chi,
        dict_type: '字典生成表',
      });
      const tmpFields = item.table_cols || [];
      tmpFields.forEach((itemField: any) => {
        dBDataDictField.push({
          dict_name: item.table_name_eng,
          dict_field_name: itemField.f_name,
          dict_field_desc: itemField.f_comment,
          dict_field_type: itemField.f_type,
          dict_field_key: itemField.f_key,
          dict_field_value: itemField.f_field_value,
          dict_field_not_null: itemField.f_not_null,
        });
      });
    });

    tableDataTmp.push({ tableName: 'dict', data: dBDataDict, needDelDataKey: 'dict_name' });
    tableDataTmp.push({ tableName: 'dict_field', data: dBDataDictField, needDelDataKey: 'dict_name' });
    return tableDataTmp;
  };

  // 3. 整理 app_module、app_module_field、sys_menu 数据
  const getTableData2 = (moduleSheet: any[], fieldSheet: any[], menuSheet: any[]) => {
    const tableDataTmp: any = [];
    const menuData: any = [];

    // 3.1 处理 app_module 数据 - 构建完整的31字段对象
    const moduleData = moduleSheet.map((row: any) => {
      const moduleRow: any = {};
      // 遍历 SHEET_CONFIG_MODULE_NODE 获取所有字段
      DDIT_TOOL_CONSTANTS.SHEET_CONFIG_MODULE_NODE.forEach((item: any) => {
        // 直接使用英文 dataIndex 取值，没有则用 defaultValue
        moduleRow[item.dataIndex] = row[item.dataIndex] ?? item.defaultValue ?? '';
      });
      // 确保 module_key 和 module_name 有值
      moduleRow[CKEY.MODULE_KEY] = row[CKEY.MODULE_KEY] || '';
      moduleRow[CKEY.MODULE_NAME] = row[CKEY.MODULE_NAME] || '';
      return moduleRow;
    });
    tableDataTmp.push({ tableName: 'app_module', data: moduleData, needDelDataKey: 'module_key' });

    // 3.2 处理 app_module_field 数据
    const fieldData: any = [];
    let currentModuleKey = '';
    fieldSheet.forEach((row: any, index: number) => {
      // 检查是否为 title 行（模块首行）- 通过 excelRowType 标记
      if (row['excelRowType'] === 'title') {
        // 从 title 中提取 module_key，如 "人员管理 eg_m_person"
        const titleParts = (row[CKEY.DICT_NAME] || '').split(' ');
        currentModuleKey = titleParts[titleParts.length - 1] || '';
        return;
      }

      if (!row[CKEY.DICT_FIELD_NAME]) return;

      const fieldName = row[CKEY.DICT_FIELD_NAME] || '';
      if (!fieldName) return;

      // 构建 app_module_field 完整数据
      const fieldRow: any = {};
      // 遍历 SHEET_CONFIG_FIELD_NODE 获取所有字段
      DDIT_TOOL_CONSTANTS.SHEET_CONFIG_FIELD_NODE.forEach((item: any) => {
        // 直接使用英文 dataIndex 取值
        fieldRow[item.dataIndex] = row[item.dataIndex] ?? item.defaultValue ?? '';
      });
      // 设置必要字段
      fieldRow['dict_field_id'] = myUtil.text.uuid();
      fieldRow['module_key'] = currentModuleKey;
      // dict_field_index 使用数组索引（从1开始）
      fieldRow['dict_field_index'] = fieldData.length + 1;
      fieldData.push(fieldRow);
    });
    tableDataTmp.push({ tableName: 'app_module_field', data: fieldData, needDelDataKey: 'module_key' });

    // 3.3 处理 sys_menu 数据
    menuSheet.forEach((row: any) => {
      // 构建 sys_menu 完整数据
      const menuRow: any = {};
      // 遍历 SHEET_MENU_NODE 获取所有字段
      DDIT_TOOL_CONSTANTS.SHEET_MENU_NODE.forEach((item: any) => {
        // 直接使用英文 dataIndex 取值，没有则用 defaultValue
        menuRow[item.dataIndex] = row[item.dataIndex] ?? item.defaultValue ?? '';
      });
      // 保存角色信息用于后续处理
      const menuRole = menuRow.menu_role || '管理员';
      menuData.push({ ...menuRow, menu_role: menuRole });
      delete menuRow.menu_role; // 角色单独处理
      tableDataTmp.push({ tableName: 'sys_menu', data: [menuRow], needDelDataKey: 'menu_id' });
    });

    return { tableData: tableDataTmp, menuData };
  };

  // 4. 整理 sys_menu_role_rel 数据
  const getTableData3 = async (menuData: any[]) => {
    const tableDataTmp: any = [];
    const roleRes: any = await queryListNs({ page: 1, pageSize: 999999, searchModel: [] }, 'sys_role');
    if (roleRes.code !== '200' || roleRes.body.rowCount <= 0) {
      return [];
    }

    const roleArr: any = roleRes?.body?.rows;
    menuData.forEach((data: any) => {
      const menu_id = data.menu_id;
      const roleNameArr: any = (data.menu_role || '管理员').split(',') || [];
      roleNameArr.forEach((role_name: any) => {
        const roleObj: any = roleArr?.find((item: any) => item.role_name === role_name);
        const role_id = roleObj?.role_id;
        if (menu_id && role_id) {
          tableDataTmp.push({
            uuid: myUtil.text.uuid(),
            menu_id,
            role_id,
          });
        }
      });
    });

    return [{
      tableName: 'sys_menu_role_rel',
      data: tableDataTmp,
      needDelDataKey: ['menu_id', 'role_id'],
    }];
  };

  // 保存模块到数据库
  const handleSave = async (data: SheetData) => {
    try {
      // 1. 创建物理表
      const { tablesArr, createTablesRes } = await createTables(data.tableSheet);
      if (createTablesRes?.code !== '200') {
        message.error(createTablesRes?.msg || '创建表失败');
        return;
      }
      message.info('物理表创建完成');

      // 2. 整理 dict、dict_field 数据并插入
      const tableData1 = getTableData1(tablesArr);

      // 3. 整理 app_module、app_module_field、sys_menu 数据并插入
      const { tableData: tableData2, menuData } = getTableData2(
        data.moduleSheet,
        data.fieldSheet,
        data.menuSheet
      );

      // 4. 整理 sys_menu_role_rel 数据
      const tableData3 = await getTableData3(menuData);

      // 5. 批量插入所有数据
      const allTableData = [...tableData1, ...tableData2, ...tableData3];
      const initRes: any = await myUtil.mysql.initTableData(allTableData);
      if (initRes.code === '200') {
        message.success('模块保存成功');
      } else {
        message.error(initRes.msg || '保存失败');
      }
    } catch (error) {
      console.error('保存失败:', error);
      message.error('保存失败');
    }
  };

  return (
    <Flex style={{ height: 'calc(100vh - 48px)' }} gap={16}>
      {/* 左侧：AI对话区域 */}
      <div
        style={{
          width: '40%',
          minWidth: 400,
          display: 'flex',
          flexDirection: 'column',
          background: '#fff',
          borderRadius: 8,
          overflow: 'hidden',
        }}
      >
        <AIChatPanel
          messages={messages}
          isRequesting={isRequesting}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          inputValue={inputValue}
          setInputValue={setInputValue}
        />
      </div>

      {/* 右侧：数据预览区域 */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          background: '#fff',
          borderRadius: 8,
          padding: 16,
          overflow: 'auto',
        }}
      >
        <DataPreview data={sheetData} onSave={handleSave} />
      </div>
    </Flex>
  );
};

export default ModuleGenerator;