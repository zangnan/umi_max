import React, { useState } from 'react';
import { Card, Button, Space, message, Input } from 'antd';
import { RedoOutlined } from '@ant-design/icons';
import DDVTable from '@/components/DDBaseGridVtable';
import { testConfigForApi } from './config2';

const DDVTableDemo: React.FC = () => {
  // 使用新的 searchModel 格式
  const [apiParams, setApiParams] = useState<Record<string, any>>({
    page: 1,
    pageSize: 8000,
    searchModel: [
    //   { property: 'ssq', op: 'alike', value: '201204' },
    ],
    orderModel: [],
  });
  const [refreshKey, setRefreshKey] = useState(0);
  const [showHelp, setShowHelp] = useState(false);

  // 刷新组件
  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
    message.success('组件已刷新');
  };

  // 更新查询参数
  const handleParamChange = (key: string, value: any) => {
    setApiParams((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // 表单保存回调
  const handleFormSave = async (values: any, formType: 'add' | 'edit', record?: any) => {
    console.log('表单提交数据:', values);
    console.log('表单类型:', formType);
    console.log('编辑时的原始数据:', record);

    // 模拟保存操作
    if (formType === 'add') {
      message.loading('正在保存新数据...', 2).then(() => {
        message.success('保存成功！');
        console.log('新增数据:', values);
      });
    } else {
      message.loading('正在更新数据...', 2).then(() => {
        message.success('更新成功！');
        console.log('更新数据:', { ...record, ...values });
      });
    }
  };

  // 表单数据加载完成回调（用于编辑时回填）
  const handleFormDataLoaded = (form: any, record: any) => {
    console.log('表单数据回填:', record);
    // 回填表单数据
    form.setFieldsValue({
      ssq: record.ssq,
      title: record.title,
      type: record.type,
      priority: record.priority,
      description: record.description,
    });
  };

  return (
    <div>
      <Card title="DDVTable 组件演示（API 模式）" style={{marginBottom: '12px'}}>
        <Space wrap>
          {/* <div>
            <span>所属期：</span>
            <Input
              value={apiParams.ssq}
              onChange={(e) => handleParamChange('ssq', e.target.value)}
              style={{ width: 150 }}
              placeholder="请输入所属期"
            />
          </div>
          <Button
            type="primary"
            onClick={() => {
              // 如果所属期有值则设置 searchModel，没有值则传空数组
              const ssqValue = apiParams.ssq;
              setApiParams((prev) => ({
                ...prev,
                searchModel: ssqValue
                  ? [{ property: 'ssq', op: 'alike', value: ssqValue }]
                  : [],
              }));
              setRefreshKey((prev) => prev + 1);
              message.success(ssqValue ? '查询参数已更新' : '已清除查询条件');
            }}
          >
            应用查询参数
          </Button> */}
          <Button onClick={handleRefresh}>刷新组件</Button>
          <Button
            icon={showHelp ? <RedoOutlined /> : undefined}
            onClick={() => setShowHelp(!showHelp)}
          >
            {showHelp ? '隐藏使用说明' : '显示使用说明'}
          </Button>
        </Space>
      </Card>

      <DDVTable
        key={refreshKey}
        apiParams={apiParams}
        config={testConfigForApi}
        autoLoad={true}
        onLoadingChange={(loading) => {
          console.log('加载状态:', loading);
        }}
        onDataLoad={(data, response) => {
          console.log('数据加载完成:', data);
          console.log('响应数据:', response);
          message.success(`数据加载完成，共 ${data.rows?.length || 0} 条记录`);
        }}
        onError={(error) => {
          console.error('加载失败:', error);
          message.error('数据加载失败');
        }}
        onReady={(instance) => {
          console.log('表格实例:', instance);
        }}
        onAdd={() => {
          // message.info('点击了新增按钮');
        }}
        onEdit={() => {
          // message.info('点击了编辑按钮');
        }}
        onDelete={() => {
          // message.info('点击了删除按钮');
        }}
        onSetting={() => {
          // message.info('点击了设置按钮');
        }}
        onRowEdit={(rowData) => {
          // console.log('编辑行数据:', rowData);
          // message.info(`编辑: ${JSON.stringify(rowData)}`);
        }}
        // 注意：移除 onRowDelete 回调即可测试组件内置的删除功能
        // onRowDelete={(rowData) => {
        //   console.log('删除行数据:', rowData);
        //   message.info(`删除: ${JSON.stringify(rowData)}`);
        // }}
        // onRowDetail={(rowData) => {
        //   console.log('详情行数据:', rowData);
        //   message.info(`详情: ${JSON.stringify(rowData)}`);
        // }}
        onSelectionChange={(selectedRows, selectedKeys) => {
          console.log('选中行:', selectedRows);
          console.log('选中键:', selectedKeys);
          message.info(`选中了 ${selectedRows?.length || 0} 行`);
        }}
        // ==================== 表单采集相关配置 ====================
        onFormSave={handleFormSave}
        onFormDataLoaded={handleFormDataLoaded}
      />

      {showHelp && (
        <Card title="使用说明" style={{ margin: '12px 0 12px 0' }} variant="borderless">
          <div style={{ lineHeight: 1.8 }}>
          <h4>DDVTable 组件特性（API 模式）：</h4>
          <ul>
            <li>基于 DDVTable 的 API 增强版本，内部通过 API 查询数据</li>
            <li>无需外部传入 data 属性</li>
            <li>支持分页查询（page、pageSize）</li>
            <li>支持排序查询（orderModel 数组）</li>
            <li>支持自定义查询条件（searchModel 数组）</li>
            <li>支持相对路径和完整 URL</li>
            <li><strong>支持表单采集功能（新增/编辑）</strong></li>
          </ul>

          <h4>表单采集配置示例：</h4>
          <pre style={{ background: '#f5f5f5', padding: 12, borderRadius: 4 }}>
{`// 1. 配置表单
const formConfig = {
  form_title: '提案建议',
  form_width: 720,
  form_layout_type: 'horizontal',
  form_label_input_layout: 'horizontal',
  items: [
    { label: '所属期', name: 'ssq', type: 'Input', rules: [{ required: true }] },
    { label: '建议标题', name: 'title', type: 'Input' },
    { label: '建议类型', name: 'type', type: 'Select', list: [
      { name: '功能改进', value: '1' },
      { name: 'Bug修复', value: '2' },
    ]},
    { label: '描述', name: 'desc', type: 'TextArea' },
  ],
};

// 2. 添加到 DDVTable 组件（推荐使用 config 属性）
<DDVTable
  config={{
    ...testConfigForApi,
    form_config: formConfig,
    form_items: [...],  // 表单字段配置
  }}
  onFormSave={async (values, formType, record) => {
    // values: 表单数据
    // formType: 'add' | 'edit'
    // record: 编辑时的原始数据
    await saveData(values);
  }}
  onFormDataLoaded={(form, record) => {
    // 回填编辑数据
    form.setFieldsValue(record);
  }}
/>`}
          </pre>

          <h4>API 请求参数格式：</h4>
          <pre style={{ background: '#f5f5f5', padding: 12, borderRadius: 4 }}>
{`{
  "searchModel": [
    { "field": "ssq", "operator": "=", "value": "201204" }
  ],
  "orderModel": [
    { "field": "jsje", "direction": "desc" }
  ],
  "pageSize": 20,
  "page": 1
}`}
          </pre>

          <h4>API 地址格式：</h4>
          <ul>
            <li>推荐使用相对路径：<code>/dict/automatic/exp/bs/queryPager/eg_m_mts_tsjh</code></li>
            <li>也支持完整路径：<code>http://192.168.21.5:7001/dict/automatic/exp/bs/queryPager/eg_m_mts_tsjh</code></li>
            <li>API 配置已统一到 <code>testConfigForApi.api_config</code> 对象中管理</li>
          </ul>

          <h4>统一 API 配置示例：</h4>
          <pre style={{ background: '#f5f5f5', padding: 12, borderRadius: 4 }}>
{`// 1. 统一 API 配置（已在 testConfigForApi.api_config 中配置）
// api_config: {
//   apiGridQuery: '/dict/automatic/exp/bs/queryPager/eg_m_mts_tsjh',
//   apiFormQuery: '/dict/automatic/exp/bs/queryForm/eg_m_mts_tsjh',
//   apiFormEdit: '/dict/automatic/exp/bs/saveOrUpdate/eg_m_mts_tsjh',
// }

// 2. 使用 DDVTable 组件（推荐方式：通过 config 属性统一配置）
<DDVTable
  config={testConfigForApi}
  onFormSave={handleFormSave}
/>`}
          </pre>

          <h4>响应数据结构（支持以下格式）：</h4>
          <ul>
            <li><code>{`{ code: "200", body: { rowCount: 50, rows: [...] } }`}</code> - body 格式</li>
            <li><code>{`{ data: { list: [...], total: 100 } }`}</code> - data.list 格式</li>
            <li><code>{`{ data: [...] }`}</code> - data 数组格式</li>
            <li><code>{`{ rows: [...] }`}</code> - rows 数组格式</li>
          </ul>

          <h4>表单项类型支持：</h4>
          <ul>
            <li><code>Input</code> - 输入框</li>
            <li><code>InputNumber</code> - 数字输入框</li>
            <li><code>Select</code> - 下拉选择</li>
            <li><code>Radio</code> - 单选框</li>
            <li><code>Checkbox</code> - 多选框</li>
            <li><code>DatePicker</code> - 日期选择</li>
            <li><code>TextArea</code> - 文本域</li>
            <li><code>TreeSelect</code> - 树选择</li>
            <li><code>Cascader</code> - 级联选择</li>
            <li><code>Switch</code> - 开关</li>
            <li><code>Upload</code> - 上传</li>
            <li>等...</li>
          </ul>
        </div>
      </Card>)}
    </div>
  );
};

export default DDVTableDemo;
