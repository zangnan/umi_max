/**
 * 4个Sheet数据预览组件（Java 版本）
 * 使用 Java 版本的 SHEET_CONFIG_MODULE, SHEET_CONFIG_FIELD, SHEET_CONFIG_DICT_TABLE, SHEET_MENU
 */

import { Card, Tabs, Button, Empty, Space, message } from 'antd';
import { DownloadOutlined, SaveOutlined, EyeOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import SheetTable from './SheetTable';
import excelUtil from '@/components/DDAssist/util/excelUtil';
import excelConfigConstants from '@/components/DDBunit/excelConfig.v2.constants';
import { TABLE_COLUMNS, MODULE_COLUMNS, FIELD_COLUMNS, MENU_COLUMNS, COMMON_FIELD_COLUMNS, TABLE_CODE_COLUMNS } from '../utils/sheetConverter';
import type { SheetData } from '../types/module';

const {
  SHEET_CONFIG_MODULE,
  SHEET_CONFIG_FIELD,
  SHEET_CONFIG_DICT_TABLE,
  SHEET_MENU,
  SHEET_COMMON_FIELD,
  SHEET_BUSINESS_CODE_TABLE,
} = excelConfigConstants;
const CKEY = excelConfigConstants.CONFIG_KEY;

interface DataPreviewProps {
  data: SheetData | null;
  onSave?: (data: SheetData) => Promise<void>;
}

// 标记 title 行的辅助函数
const markTitleRow = (row: any, title: string): any => {
  return {
    ...row,
    excelRowType: 'title',
    title: title,
  };
};

const DataPreview: React.FC<DataPreviewProps> = ({ data, onSave }) => {
  const [activeKey, setActiveKey] = useState('table');
  const [loading, setLoading] = useState(false);
  const [showJson, setShowJson] = useState(false);

  if (!data) {
    return (
      <Empty
        description="请先在左侧描述您的模块需求"
        style={{ padding: '100px 0' }}
      />
    );
  }

  const handleSave = async () => {
    if (!data) return;
    if (!onSave) {
      message.info('保存功能待后续实现');
      return;
    }
    setLoading(true);
    try {
      await onSave(data);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!data) return;

    // 处理表管理 Sheet - 将 tableName 和 tableDesc 合并为标题行
    const tableData = data.tableSheet.map((row) => {
      // 如果有 tableName 但没有 tableDesc，认为是标题行
      if (row[CKEY.TABLE_NAME] && !row[CKEY.TABLE_DESC]?.trim()) {
        return markTitleRow(row, row[CKEY.TABLE_NAME]);
      }
      return row;
    });

    // 处理模块 Sheet - 保持原样
    const moduleData = data.moduleSheet;

    // 处理字典构建 Sheet - 直接使用已有数据（convertToSheets 已生成带 excelRowType:'title' 标记的标题行）
    const fieldData = data.fieldSheet;

    // 处理菜单 Sheet - 过滤掉非数据字段，并设置列合并
    const menuData = data.menuSheet.map((row: any, index: number) => {
      const newRow: any = {};
      Object.keys(row).forEach((key) => {
        if (key !== 'colSpan' && key !== 'excelRowType' && key !== 'title') {
          newRow[key] = row[key];
        }
      });
      // 设置 colSpan 用于 Excel 合并
      // 第一行数据（序号2行）：合并 B 到 F（5列）
      // 后续数据行：合并 C 到 F（4列）
      if (index === 0) {
        newRow.colSpan = [1, 5];  // B 到 F
      } else {
        newRow.colSpan = [2, 5];  // C 到 F
      }
      return newRow;
    });

    excelUtil.export({
      excelName: '模块配置_Java版本.xlsx',
      sheetData: [
        { gridData: menuData, sheetName: '菜单构建', cols: SHEET_MENU },
        { gridData: moduleData, sheetName: '模块', cols: SHEET_CONFIG_MODULE },
        { gridData: tableData, sheetName: '表管理', cols: SHEET_CONFIG_DICT_TABLE },
        { gridData: fieldData, sheetName: '字典构建', cols: SHEET_CONFIG_FIELD },
        { gridData: data.tablecodeSheet || [], sheetName: '业务码表', cols: SHEET_BUSINESS_CODE_TABLE },
        { gridData: data.commonFieldSheet, sheetName: '业务表共通字段', cols: SHEET_COMMON_FIELD },
      ],
    });
  };

  // 展示 JSON 数据
  const handleShowJson = () => {
    setShowJson(!showJson);
  };

  const items = [
    {
      key: 'menu',
      label: `菜单构建 (${data.menuSheet.length})`,
      children: (
        <SheetTable
          title="菜单构建"
          columns={MENU_COLUMNS}
          cols={SHEET_MENU}
          data={data.menuSheet}
          emptyText="暂无菜单数据"
        />
      ),
    },
    {
      key: 'module',
      label: `模块 (${data.moduleSheet.length})`,
      children: (
        <SheetTable
          title="模块"
          columns={MODULE_COLUMNS}
          cols={SHEET_CONFIG_MODULE}
          data={data.moduleSheet}
          emptyText="暂无模块数据"
        />
      ),
    },
    {
      key: 'table',
      label: `表管理 (${data.tableSheet.length})`,
      children: (
        <SheetTable
          title="表管理"
          columns={TABLE_COLUMNS}
          cols={SHEET_CONFIG_DICT_TABLE}
          data={data.tableSheet}
          emptyText="暂无表数据"
        />
      ),
    },
    {
      key: 'field',
      label: `字典构建 (${data.fieldSheet.length})`,
      children: (
        <SheetTable
          title="字典构建"
          columns={FIELD_COLUMNS}
          cols={SHEET_CONFIG_FIELD}
          data={data.fieldSheet}
          emptyText="暂无字段数据"
        />
      ),
    },
    {
      key: 'tablecode',
      label: `业务码表 (${data.tablecodeSheet?.length || 0})`,
      children: (
        <SheetTable
          title="业务码表"
          columns={TABLE_CODE_COLUMNS}
          cols={SHEET_BUSINESS_CODE_TABLE}
          data={data.tablecodeSheet || []}
          emptyText="暂无码表数据"
        />
      ),
    },
    {
      key: 'commonField',
      label: `业务表共通字段 (${data.commonFieldSheet.length})`,
      children: (
        <SheetTable
          title="业务表共通字段"
          columns={COMMON_FIELD_COLUMNS}
          cols={SHEET_COMMON_FIELD}
          data={data.commonFieldSheet}
          emptyText="暂无数据"
        />
      ),
    },
  ];

  return (
    <Card
      title="模块配置预览 (Java版本)"
      extra={
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={handleShowJson}
          >
            {showJson ? '隐藏JSON' : '展示JSON'}
          </Button>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSave}
            loading={loading}
          >
            保存
          </Button>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleDownload}
          >
            下载 Excel
          </Button>
        </Space>
      }
      styles={{ body: { padding: 0 } }}
    >
      {showJson && (
        <div style={{ padding: 16, background: '#f5f5f5', borderBottom: '1px solid #d9d9d9' }}>
          <pre style={{ fontSize: 12, maxHeight: 300, overflow: 'auto' }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
      <Tabs
        activeKey={activeKey}
        onChange={setActiveKey}
        items={items}
        style={{ padding: '0 16px' }}
      />
    </Card>
  );
};

export default DataPreview;