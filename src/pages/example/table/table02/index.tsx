import React, { useState, useRef } from 'react';
import DDBaseGrid from '@/components/DDBaseGrid';
import tableUtil from '@/components/DDBaseGrid/tableUtil';
import ProCard from '@ant-design/pro-card';
import { Tooltip, Badge, Space, message } from 'antd';
import tableConfig from './config';
import myUtil from '@/components/DDAssist/util';
import { Typography } from 'antd';

const TableList: React.FC<unknown> = () => {
  const [selectionRowKeys, setSelectionRowKeys] = useState<any>([]);
  const [selectionRows, setSelectionRows] = useState<any>([]);
  const [queryParam, setQueryParam] = useState({}); // 设置列表查询条件
  const refGrid: any = useRef();
  const Func: any = {};

  // 列表自定义渲染
  Func.columnsRender = {
    renderExampleYhzh: (param: any) => {
      return myUtil.grid.formatBankNo(param);
    },
    renderCkbgdh: (param: any) => {
      const { text, record } = param;
      const badgeSuccess = <Badge status="success" key='success' />;
      const badgeError = <Badge status="error" key='error' />;
      const sybz = record.sybz; // N=未使用; Y=已使用
      const html = [];
      html.push(sybz === 'Y' ? badgeSuccess : badgeError);
      html.push(<a key='ckbgdh_ele_link' type="link" >{text}</a>);
      return <Tooltip title='tooltip'><Space>{html}</Space></Tooltip>;
    },
    renderExampleXh4: (param: any) => {
      const { text } = param;
      return <a onClick={(event: any) => {
        event.stopPropagation();
        Func.openDrawer(param);
      }}>{text}
      </a>;
    },
  }

  // 配置项：自定义操作列是否可用
  Func.setCs2Disabled = (record: any) => {
    if (record.jgfsDm === '0139' || record.jgfsDm === '0110') {
      return true;
    }
    return false;
  }

  // 配置项：自定义操作列
  Func.handleColumns1 = (param: any, event: any) => {
    event.stopPropagation();
    const { record } = param;
    message.info(`事项通知书: ${record?.ckbgdh}`);
    refGrid.current!.reload({
      afterReload: () => {
        setTimeout(() => {
          message.info('列表加载后执行');
        }, 1500);
      }
    });
  }

  // 配置项：自定义操作列
  Func.handleColumns2 = (param: any, event: any) => {
    event.stopPropagation();
    const { record } = param;
    message.info(`随附单据: ${record?.ckbgdh}`);
    setQueryParam({a: 112});
  }

  // 列表行单击事件
  Func.gridOnRowClick = (param: any) => {
    console.info(param);
  }

  // 列表行双击击事件
  Func.gridOnRowDoubleClick = (param: any) => {
    console.info(param);
  }

  // 列选择
  const rowSelection = tableUtil.initRowSelection({
    selectionType: 'checkbox',
    selectedRowKeys: selectionRowKeys,
    onChange: (selectedRowKeys: any, selectedRows: any[]) => {
      setSelectionRowKeys(selectedRowKeys);
      console.info(selectedRowKeys, selectedRows);
    },
    onSelect: ( record: any, selected: any, selectedRows: any, nativeEvent: any ) => {
      console.info(record, selected, selectedRows, nativeEvent);
    },
    onSelectAll: (selected: any, selectedRows: any, changeRows: any) => {
      console.info(selected, selectedRows, changeRows);
    },
  });

  // 列表数据加载后执行
  const afterReloadGridData = (param: any) => {
    console.info('列表数据加载后执行', param);
  };

  return (<>
    <Typography.Title level={4}>后端分页 - 复杂示例</Typography.Title>
    <ProCard>
      <DDBaseGrid
        config={tableConfig}
        func={Func}
        actionRef={refGrid}
        queryParam={queryParam}
        onRow={tableUtil.initOnRow({
          refGrid,
          selectionRows,
          selectionRowKeys,
          setSelectionRowKeys,
          setSelectionRows,
          func: Func,
          config: tableConfig,
        })}
        afterReloadGridData={afterReloadGridData}
        {...rowSelection}
      />
    </ProCard>
  </>);
};

export default TableList;
