import React, { useState, useEffect } from 'react';
import * as VTable from '@visactor/vtable';
import { ListTable } from '@visactor/react-vtable';
import { DateInputEditor, InputEditor, ListEditor, TextAreaEditor } from '@visactor/vtable-editors';
import { PivotTable, register, themes } from "@visactor/vtable";
import { getReportGridData } from '@/services/hts/api';
import { Button, Space, Form, List, Spin, Avatar, Divider, message } from 'antd';

const TableList: React.FC<unknown> = () => {
  const [ myOption, setMyOption ] = useState<any>({});
  const [ myRecords, setMyRecords ] = useState<any>([]);
  const [ tins, seTtins ] = useState<any>(null);
  const inputEditor = new InputEditor();
  const textAreaEditor = new TextAreaEditor();
  const dateInputEditor = new DateInputEditor();
  const listEditor = new ListEditor({ values: ['免税', '征税'] });

  VTable.register.editor('input-editor', inputEditor);
  VTable.register.editor('list-editor', listEditor);
  VTable.register.editor('date-input-editor', dateInputEditor);
  VTable.register.editor('textArea-editor', textAreaEditor);

  useEffect(() => {
    getReportGridData(`${API_URL_EXAMPLE}/dict/automatic/exp/bs/queryPager`, {}).then((response: any) => {
      setMyRecords(response.body.rows || []);
    })
  }, []);

  const option: any = {
    columns: [
      { title: '报关单号', field: 'ckbgdh', width: 'auto', sort: true, editor: 'input-editor' },
      { title: '监管方式\n\n代码', field: 'jgfsDm2', width: 'auto', sort: true, editor: 'input-editor' },
      { title: '成交信息', field: 'cjxxGroup', columns: [
        { title: '成交方式', field: 'hgcjfsmc', width: 120 },
        { title: '成交单位', field: 'hgjldwmc', width: 120 },
        { title: '成交数量', field: 'cjsl1', width: 120 },
        { title: '成交币制', field: 'cjhghbzmDm', width: 'auto' },
        { title: '成交金额', field: 'cjzj', width: 120 },
      ]},
      { title: '出口日期', field: 'ckrq1', width: 120, sorter: true, editor: 'date-input-editor' },
      { title: '出口合同号', field: 'ckhth', width: 120, editor: 'textArea-editor' },
      { title: '征免类型', field: 'zmlx', width: 120, editor: 'list-editor' },
    ],
    // editor: "input-editor",
    editCellTrigger: "click",
    keyboardOptions: {
      copySelected: true,
      pasteValueToCell: true,
      selectAllOnCtrlA: true
    },
    enableLineBreak: true,
    autoWrapText: true,
    dragHeaderMode: 'column', // 可选配置项：'all' | 'none' | 'header' | 'body'，默认为none
    allowFrozenColCount: 3, // 可选做冻结的前几列 默认 0
    frozenColCount: 2, // 初始冻结列数 默认 0
    showFrozenIcon: true, // 是否显示冻结图标 默认 true
    // frozenRowCount: 4, // 冻结行数（包含表头） 默认表头行数
    rowSeriesNumber: {
      title: '序号',
      width: 'auto',
      headerStyle: { color: 'black', bgColor: 'pink' },
      style: { color: 'red' },
    },
    menu:{
      contextMenuItems:['向下插入数据', '向下插入空行', '修改掉整行值', '修改值', '删除该行'],
    },
    pagination: {
      currentPage: 0,
      perPageCount: 3
    }
  };

  // 导出
  const getReconds = () => {
    let records = tins?.records;
    console.info(records)
  }

  // 导出
  const paginationTest = () => {
    let testPageIndex = 4;
    tins.updatePagination({
      currentPage: testPageIndex - 1
    });
  }

    return (<>
    <Space>
      <Button type="primary" onClick={() => getReconds()} size='middle' >导出</Button>
      <Button type="primary" onClick={() => paginationTest()} size='middle' >测试分页</Button>
    </Space>
    <ListTable option={option} height={500} records={myRecords} onReady={(tableInstance: any, isFirst: any) => {
      console.info(tableInstance, isFirst);
      seTtins(tableInstance);
      if (isFirst) {
        tableInstance.on('dropdown_menu_click', (args: any) => {
          if (args.menuKey === '向下插入数据') {
            const recordIndex = tableInstance.getRecordShowIndexByCell(args.col, args.row);
            // tableInstance.addRecords([{
            //   ckbgdh: '111',
            //   jgfsDm2: '222',
            //   hgcjfsmc: '333',
            //   hgjldwmc: '444',
            //   cjsl: '555',
            // }], recordIndex + 1);
            tableInstance.addRecord({
              ckbgdh: '11111',
              jgfsDm2: '22222',
              hgcjfsmc: '33333',
              hgjldwmc: '44444',
              cjsl: '55555',
            }, recordIndex + 1);
          } else if (args.menuKey === '向下插入空行') {
            const recordIndex = tableInstance.getRecordShowIndexByCell(args.col, args.row);
            tableInstance.addRecord({}, recordIndex+1);
          } else if (args.menuKey === '删除该行') {
            const recordIndex = tableInstance.getRecordShowIndexByCell(args.col, args.row);
            tableInstance.deleteRecords([recordIndex]);
          } else if (args.menuKey === '修改掉整行值') {
            const recordIndex = tableInstance.getRecordShowIndexByCell(args.col, args.row);
            tableInstance.updateRecords([{
              ckbgdh: '111',
              jgfsDm2: '222',
              hgcjfsmc: '333',
              hgjldwmc: '444',
              cjsl: '555',
            }], [recordIndex]);
          } else if (args.menuKey === '修改值'){
            tableInstance.startEditCell(args.col, args.row);
          }
        })
      }
    }}/>
  </>);
};

export default TableList;
