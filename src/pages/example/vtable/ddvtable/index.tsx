import React, { useState } from 'react';
import { Card, Button, Space, message } from 'antd';
import DDVTable from '@/components/DDBaseGridVtable';
import {
  customFormatters,
  testConfig,
  configWithRowNumberCustom,
  configWithCheckbox,
  configWithRadio,
  configWithFilter,
  testData,
  rowNumberData,
  selectionData,
  filterData,
} from './config';

const DDVTableDemo: React.FC = () => {
  const [config, setConfig] = useState(testConfig);
  const [data, setData] = useState(testData);
  const [tableInstance, setTableInstance] = useState<any>(null);
  const [exampleType, setExampleType] = useState<string>('default');

  // 切换示例类型
  const handleSwitchExample = (type: string) => {
    setExampleType(type);
    switch (type) {
      case 'default':
        setConfig(testConfig);
        setData(testData);
        break;
      case 'rowNumberCustom':
        setConfig(configWithRowNumberCustom);
        setData(rowNumberData);
        break;
      case 'checkbox':
        setConfig(configWithCheckbox);
        setData(selectionData);
        break;
      case 'radio':
        setConfig(configWithRadio);
        setData(selectionData);
        break;
      case 'filter':
        setConfig(configWithFilter);
        setData(filterData);
        break;
    }
  };

  // 表格就绪
  const handleReady = (instance: any) => {
    setTableInstance(instance);
    message.success('表格已加载');
  };

  // 点击单元格
  const handleCellClick = (args: any) => {
    console.log('点击单元格:', args);
    const { field, value, row } = args;
    message.info(`点击了: ${field} = ${value}`);
  };

  // 刷新数据（测试局部刷新）
  const handleRefreshData = () => {
    // 模拟数据变化，只修改部分数据
    const newRows = data.rows.map((row, index) => ({
      ...row,
      jsje: row.jsje + (index % 10) * 100,
    }));
    setData({ rows: newRows });
    message.success('数据已刷新（测试局部刷新）');
  };

  // 切换排序
  const handleToggleSort = () => {
    const newSort = config.grid_columns.map((col: any) =>
      col.field === 'jsje' ? { ...col, sort: !col.sort } : col,
    );
    setConfig({
      ...config,
      grid_columns: newSort,
    });
  };

  return (
    <div>
      <Card title="DDVTable 组件演示">
        <Space>
          <Button onClick={handleRefreshData}>刷新数据</Button>
          <Button onClick={handleToggleSort}>
            {config.grid_columns.find((c: any) => c.field === 'jsje')?.sort ? '关闭排序' : '开启排序'}
          </Button>
          <Button
            onClick={() => {
              if (tableInstance) {
                message.info(`当前数据条数: ${tableInstance.recordsCount}`);
              }
            }}
          >
            获取数据条数
          </Button>
        </Space>

        <Space style={{ marginBottom: 12 }}>
          <span>示例切换：</span>
          <Button type={exampleType === 'default' ? 'primary' : 'default'} onClick={() => handleSwitchExample('default')}>
            默认示例
          </Button>
          <Button type={exampleType === 'rowNumberCustom' ? 'primary' : 'default'} onClick={() => handleSwitchExample('rowNumberCustom')}>
            行序号-自定义样式
          </Button>
          <Button type={exampleType === 'checkbox' ? 'primary' : 'default'} onClick={() => handleSwitchExample('checkbox')}>
            复选框
          </Button>
          <Button type={exampleType === 'radio' ? 'primary' : 'default'} onClick={() => handleSwitchExample('radio')}>
            单选框
          </Button>
        </Space>
      </Card>

      <DDVTable
        config={config}
        data={data}
        customFormatters={customFormatters}
        onReady={handleReady}
        onCellClick={handleCellClick}
        onAdd={() => message.info('点击了新增按钮')}
        onEdit={() => message.info('点击了编辑按钮')}
        onDelete={() => message.info('点击了删除按钮')}
        onSetting={() => message.info('点击了设置按钮')}
        onRowEdit={(rowData) => {
          console.log('编辑行数据:', rowData);
          message.info(`编辑: ${rowData.name}, 年龄: ${rowData.age}`);
        }}
        onRowDelete={(rowData) => {
          console.log('删除行数据:', rowData);
          message.info(`删除: ${rowData.name}`);
        }}
        onRowDetail={(rowData) => {
          console.log('详情行数据:', rowData);
          message.info(`详情: ${JSON.stringify(rowData)}`);
        }}
        onSelectionChange={(selectedRows, selectedKeys) => {
          console.log('选中行:', selectedRows);
          console.log('选中键:', selectedKeys);
          message.info(`选中了 ${selectedRows.length} 行`);
        }}
        onFilter={(filterRules) => {
          console.log('过滤规则:', filterRules);
          message.info(`过滤规则: ${filterRules.length} 个`);
        }}
      />
    </div>
  );
};

export default DDVTableDemo;
