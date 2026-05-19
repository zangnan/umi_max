/**
 * 4个Sheet数据预览组件
 */

import { Card, Tabs, Button, Empty, Space, message } from 'antd';
import { DownloadOutlined, SaveOutlined, EyeOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import SheetTable from './SheetTable';
import excelUtil from '@/components/DDAssist/util/excelUtil';
import excelConfigConstants from '@/components/DDBunit/excelConfig.v2.constants';
import { TABLE_COLUMNS, MODULE_COLUMNS, FIELD_COLUMNS, MENU_COLUMNS } from '../utils/sheetConverter';
import type { SheetData } from '../types/module';

const { SHEET_TABLE_FIELD, SHEET_CONFIG_MODULE_NODE, SHEET_CONFIG_FIELD_NODE, SHEET_MENU_NODE } = excelConfigConstants;
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
      message.info('保存功能未配置');
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

    // 判断是否为表标题行的辅助函数
    // tableSheet 中 dict_field_desc 为空且 dict_field_name 含中文的行是标题行
    const isTableTitleRow = (row: any): boolean => {
      const fieldName = row[CKEY.DICT_FIELD_NAME] || '';
      const fieldDesc = row[CKEY.DICT_FIELD_DESC] || '';
      // 字段名为空且描述为空且字段名含中文（或空格分隔的表名）
      return !fieldDesc && fieldName.includes(' ') && /[一-龥]/.test(fieldName);
    };

    // 处理 tableSheet - 满足条件的行是 title 行
    const tableData = data.tableSheet.map((row) => {
      if (isTableTitleRow(row)) {
        return markTitleRow(row, row[CKEY.DICT_FIELD_NAME]);
      }
      return row;
    });

    // 处理 moduleSheet
    const moduleData = data.moduleSheet;

    // 处理 fieldSheet - 数据字典有值但字段名称为空的行是 title 行
    const fieldData = data.fieldSheet.map(row => {
      if (row[CKEY.DICT_NAME] && !row[CKEY.DICT_FIELD_NAME]) {
        return markTitleRow(row, row[CKEY.DICT_NAME]);
      }
      return row;
    });

    // 处理 menuSheet
    const menuData = data.menuSheet;

    excelUtil.export({
      excelName: '模块配置.xlsx',
      sheetData: [
        { gridData: tableData, sheetName: '表', cols: SHEET_TABLE_FIELD },
        { gridData: moduleData, sheetName: '模块', cols: SHEET_CONFIG_MODULE_NODE },
        { gridData: fieldData, sheetName: '字段', cols: SHEET_CONFIG_FIELD_NODE },
        { gridData: menuData, sheetName: '菜单', cols: SHEET_MENU_NODE },
      ],
    });
  };

  // 展示 JSON 数据
  const handleShowJson = () => {
    setShowJson(!showJson);
  };

  const items = [
    {
      key: 'table',
      label: `表 (${data.tableSheet.length})`,
      children: (
        <SheetTable
          title="表"
          columns={TABLE_COLUMNS}
          cols={SHEET_TABLE_FIELD}
          data={data.tableSheet}
          emptyText="暂无表数据"
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
          cols={SHEET_CONFIG_MODULE_NODE}
          data={data.moduleSheet}
          emptyText="暂无模块数据"
        />
      ),
    },
    {
      key: 'field',
      label: `字段 (${data.fieldSheet.length})`,
      children: (
        <SheetTable
          title="字段"
          columns={FIELD_COLUMNS}
          cols={SHEET_CONFIG_FIELD_NODE}
          data={data.fieldSheet}
          emptyText="暂无字段数据"
        />
      ),
    },
    {
      key: 'menu',
      label: `菜单 (${data.menuSheet.length})`,
      children: (
        <SheetTable
          title="菜单"
          columns={MENU_COLUMNS}
          cols={SHEET_MENU_NODE}
          data={data.menuSheet}
          emptyText="暂无菜单数据"
        />
      ),
    },
  ];

  return (
    <Card
      title="模块配置预览"
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