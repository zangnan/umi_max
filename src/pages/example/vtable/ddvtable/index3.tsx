import DDVTable from '@/components/DDBaseGridVtable';
import { transformConfig } from '@/components/DDBunit/automatic_page_vtable';
import assembleConfigUtil from '@/components/DDBunit/assemble_config_util';
import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import { request } from 'umi';

// 测试环境 pageDef 接口（绝对地址，便于切换）
const PAGE_DEF_TEST_URL =
  'http://192.168.21.5:7001/dict/automatic/exp/pageDef/eg_m_mts_tssb';

const DDVTableDemo: React.FC = () => {
  // 由 pageDef 接口动态获取并转换的配置
  const [dynamicConfig, setDynamicConfig] = useState<any>(null);
  const [configLoading, setConfigLoading] = useState(false);

  // 使用新的 searchModel 格式
  const [apiParams] = useState<Record<string, any>>({
    page: 1,
    pageSize: 8000,
    searchModel: [
      //   { property: 'ssq', op: 'alike', value: '201204' },
    ],
    orderModel: [],
  });
  const [refreshKey, setRefreshKey] = useState(0);

  // 拉取 pageDef → assembleAll → transformConfig → DDVTable 渲染
  useEffect(() => {
    let cancelled = false;
    const fetchConfig = async () => {
      setConfigLoading(true);
      try {
        const response: any = await request(PAGE_DEF_TEST_URL, {
          method: 'POST',
          data: {},
        });
        if (cancelled) return;
        if (response?.code === '200') {
          // 1. 装配为 DDBunit2 格式
          const assembled = assembleConfigUtil.module.assembleAll({
            moduleInfo: response.body.moduleInfo,
            appTableDict: response.body.appTableDict,
          });
          // 2. 转换为 DDVTableConfig 格式
          const transformed = transformConfig(assembled);
          // 3. 演示页冻结列 / 高度等 demo 级默认值（接口未提供，按原 testConfigForApi 行为补齐）
          transformed.grid_config = {
            ...transformed.grid_config,
            grid_height: 600,
            grid_allow_frozen_col_count: 3,
            grid_frozen_col_count: 2,
            grid_show_frozen_icon: true,
          };
          if (!cancelled) {
            setDynamicConfig(transformed);
            message.success('配置加载完成');
          }
        } else {
          message.error(`配置加载失败：${response?.msg || '未知错误'}`);
        }
      } catch (err: any) {
        if (!cancelled) {
          message.error(`配置请求异常：${err?.message || err}`);
        }
      } finally {
        if (!cancelled) setConfigLoading(false);
      }
    };
    fetchConfig();
    return () => {
      cancelled = true;
    };
  }, []);

  // 表单保存回调
  const handleFormSave = async (
    values: any,
    formType: 'add' | 'edit',
    record?: any,
  ) => {
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
      <DDVTable
        key={`${refreshKey}-${dynamicConfig?.module_key || 'init'}`}
        apiParams={apiParams}
        config={dynamicConfig || {}}
        autoLoad={!!dynamicConfig}
        // 自定义工具栏按钮（来源：pageDef moduleInfo.customer_btn_toolbar = "开票&doKp&kp_001,合并&doHb&hb_001"）
        onCustomBtn={{
          doKp: (param: any) => {
            message.info(
              `开票：当前选中 ${param.selectionRowKeys.length || 0} 条，模块 ${param.moduleKey}`,
            );
            console.log('doKp param:', param);
          },
          doHb: (param: any) => {
            message.info(`合并：当前选中 ${param.selectionRowKeys.length || 0} 条`);
            console.log('doHb param:', param);
          },
        }}
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
    </div>
  );
};

export default DDVTableDemo;
