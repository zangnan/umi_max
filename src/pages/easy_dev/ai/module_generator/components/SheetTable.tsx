/**
 * 单个 Sheet 表格展示组件
 * 通过 cols 配置建立 title -> dataIndex 的映射关系
 */

import { Table, Typography } from 'antd';
import type { TableColumnsType } from 'antd';
import React from 'react';

const { Text } = Typography;

interface SheetTableProps {
  title: string;
  columns: string[];  // 中文 title 数组 - 用于表头显示
  cols: { title: string; dataIndex: string }[];  // 完整的列配置，包含 title -> dataIndex 映射
  data: any[];
  emptyText?: string;
}

// 根据 title 查找 dataIndex
const getDataIndex = (title: string, cols: { title: string; dataIndex: string }[]): string | undefined => {
  const col = cols.find((c) => c.title === title);
  return col?.dataIndex;
};

// 获取单元格值：通过 title 找到 dataIndex，再从 record 获取值
const getCellValue = (record: any, title: string, cols: { title: string; dataIndex: string }[]): any => {
  const dataIndex = getDataIndex(title, cols);
  if (dataIndex && record[dataIndex] !== undefined && record[dataIndex] !== null && record[dataIndex] !== '') {
    return record[dataIndex];
  }
  return undefined;
};

// 判断是否为 title 行（用于特殊样式渲染）
const isTitleRow = (record: any, columns: string[], cols: { title: string; dataIndex: string }[]): boolean => {
  // 优先检查 excelRowType
  if (record.excelRowType === 'title') {
    return true;
  }
  // 对于字典构建 Sheet，检查 dict_field_name_main 有值但 dict_field_desc 为空
  const fieldNameIdx = columns.indexOf('字段中文名');
  const mainFieldIdx = columns.indexOf('主表字段');
  if (mainFieldIdx >= 0 && fieldNameIdx >= 0) {
    const mainFieldValue = getCellValue(record, '主表字段', cols);
    const fieldDescValue = getCellValue(record, '字段中文名', cols);
    return !!(mainFieldValue && !fieldDescValue);
  }
  // 对于表管理 Sheet，检查 tableName 有值但 dictDesc 为空
  const tableNameIdx = columns.indexOf('物理表名称');
  const tableDescIdx = columns.indexOf('物理表含义');
  if (tableNameIdx >= 0 && tableDescIdx >= 0) {
    const tableNameValue = getCellValue(record, '物理表名称', cols);
    const tableDescValue = getCellValue(record, '物理表含义', cols);
    return !!(tableNameValue && !tableDescValue);
  }
  return false;
};

const SheetTable: React.FC<SheetTableProps> = ({
  title,
  columns,
  cols,
  data,
  emptyText = '暂无数据',
}) => {

  const tableColumns: TableColumnsType<any> = columns.map((col) => {
    const dataIndex = getDataIndex(col, cols) || col;
    return {
      title: col,
      dataIndex: dataIndex,
      key: col,
      ellipsis: true,
      width: getColumnWidth(col),
      render: (value: any, record: any, index: number) => {
        // 获取单元格值
        const cellValue = getCellValue(record, col, cols);

        // 判断是否为 title 行
        const isTitle = isTitleRow(record, columns, cols);

        if (isTitle) {
          // title 行显示标题文本，加粗样式，但只在有值的列显示
          const titleText = record.title || cellValue;
          if (cellValue === undefined || cellValue === null || cellValue === '') {
            return <Text type="secondary">-</Text>;
          }
          return <Text strong>{titleText}</Text>;
        }

        if (cellValue === undefined || cellValue === null || cellValue === '') {
          return <Text type="secondary">-</Text>;
        }
        return String(cellValue);
      },
    };
  });

  return (
    <Table
      title={() => <Text strong>{title}</Text>}
      columns={tableColumns}
      dataSource={data}
      scroll={{ x: 'max-content', y: 400 }}
      size="small"
      pagination={false}
      locale={{ emptyText }}
      rowKey={(_record, index) => `${title}-${index}`}
    />
  );
};

// 根据列名设置默认宽度
const getColumnWidth = (columnName: string): number => {
  if (columnName === '字段' || columnName === '主表字段' || columnName === '关联表字段') return 120;
  if (columnName === '字段中文名' || columnName === '模块名称') return 100;
  if (columnName === '数据类型' || columnName === '模块key') return 100;
  if (columnName === '菜单名称' || columnName === '菜单路径') return 150;
  if (columnName === '组件') return 200;
  if (columnName === '备注' || columnName === '数据字典含义') return 150;
  if (columnName === '数据字典' || columnName === '物理表名称') return 150;
  return 100;
};

export default SheetTable;