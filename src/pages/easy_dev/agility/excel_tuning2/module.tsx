import React, { useContext, useEffect, useRef, useState, useImperativeHandle } from 'react';
import { Form, Input, Table } from 'antd';
import type { GetRef, InputRef } from 'antd';

import myUtil from '@/components/DDAssist/util';
import DDIT_TOOL_CONSTANTS from '@/components/DDBunit/excelConfig.v2.constants';
import { retrieveModulePager } from '@/services/hts/api';

import './style.css';



type FormInstance<T> = GetRef<typeof Form<T>>;

const EditableContext = React.createContext<FormInstance<any> | null>(null);


const EditableRow: React.FC<any> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  dataIndex: any;
  record: any;
  handleSave: (record: any) => void;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
      >
        <Input size='small' ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingInlineEnd: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};


const toCamel = myUtil.text.underscoreToCamel;
const CKEY = DDIT_TOOL_CONSTANTS.CONFIG_KEY;

const mergedColumns: any = [
	{ title: '模块key', dataIndex: toCamel(CKEY.MODULE_KEY), width: 170, fixed: 'left', ellipsis: true, editable: true },
	{ title: '模块名称', dataIndex: toCamel(CKEY.MODULE_NAME), width: 150, ellipsis: true, editable: true },
	{ title: '数据字典名', dataIndex: toCamel(CKEY.DICT_NAME), width: 130, ellipsis: true, editable: true },
  { title: '列表序号', dataIndex: toCamel(CKEY.GRID_SHOW_SERIAL_NUMBER), width: 80, editable: true },
  { title: '列表边框', dataIndex: toCamel(CKEY.GRID_BORDER), width: 80, editable: true },
  { title: '列表首选项', dataIndex: toCamel(CKEY.GRID_SELECTION_TYPE), width: 90, editable: true },
  { title: '列表扩展', dataIndex: toCamel(CKEY.GRID_EXT), width: 90, editable: true },
  { title: '列表列编辑', dataIndex: toCamel(CKEY.GRID_COL_EDIT), width: 90, editable: true },
  { title: '列表列删除', dataIndex: toCamel(CKEY.GRID_COL_DEL), width: 90, editable: true },
  { title: '列表列详情', dataIndex: toCamel(CKEY.GRID_COL_DETAIL), width: 90, editable: true },
  { title: '工具栏按钮增加', dataIndex: toCamel(CKEY.TOOLBAR_DEFAULT_ADD), width: 115, editable: true },
  { title: '工具栏按钮删除', dataIndex: toCamel(CKEY.TOOLBAR_DEFAULT_DELETE), width: 115, editable: true },
  { title: '工具栏按钮编辑', dataIndex: toCamel(CKEY.TOOLBAR_DEFAULT_EDIT), width: 115, editable: true },
  { title: '工具栏按钮导入', dataIndex: toCamel(CKEY.TOOLBAR_DEFAULT_UPLOAD), width: 115, editable: true },
  { title: '工具栏按钮导出', dataIndex: toCamel(CKEY.TOOLBAR_DEFAULT_DOWNLOAD), width: 115, editable: true },
  { title: '工具栏按钮设置', dataIndex: toCamel(CKEY.TOOLBAR_DEFAULT_SETTING), width: 115, editable: true },
  { title: '工具栏按钮全屏', dataIndex: toCamel(CKEY.TOOLBAR_DEFAULT_FULL), width: 115, editable: true },
  { title: '工具栏按钮刷新', dataIndex: toCamel(CKEY.TOOLBAR_DEFAULT_RELOAD), width: 115, editable: true },
  { title: '工具栏按钮筛选', dataIndex: toCamel(CKEY.TOOLBAR_DEFAULT_ADVANCED_FILTER), width: 115, editable: true },
  { title: '表单布局', dataIndex: toCamel(CKEY.FORM_LAYOUT_TYPE), width: 120, editable: true },
  { title: '表单宽度', dataIndex: toCamel(CKEY.FORM_WIDTH), width: 120, editable: true },
  { title: '自定义按钮工具栏', dataIndex: toCamel(CKEY.CUSTOMER_BTN_TOOLBAR), width: 200, ellipsis: true, editable: true },
  { title: '列表列自定义按钮', dataIndex: toCamel(CKEY.CUSTOMER_BTN_GRID_COL), width: 200, ellipsis: true, editable: true },
  { title: 'Api保存', dataIndex: toCamel(CKEY.API_FORM_EDIT), width: 150, ellipsis: true, editable: true },
  { title: 'Api查询表单', dataIndex: toCamel(CKEY.API_FORM_QUERY), width: 150, ellipsis: true, editable: true },
  { title: 'Api删除', dataIndex: toCamel(CKEY.API_FORM_DELETE), width: 150, ellipsis: true, editable: true },
  { title: 'Api查询列表', dataIndex: toCamel(CKEY.API_GRID_QUERY), width: 150, ellipsis: true, editable: true },
  { title: 'Api导出', dataIndex: toCamel(CKEY.API_EXCEL_EXPORT), width: 150, ellipsis: true, editable: true },
  { title: 'Api导入', dataIndex: toCamel(CKEY.API_EXCEL_IMPORT), width: 150, ellipsis: true, editable: true },
  { title: 'Api模板下载', dataIndex: toCamel(CKEY.API_EXCEL_TEMPLATE), width: 150, ellipsis: true, editable: true },
];


export interface Props {
  onRef?: any;
}

const Index: React.FC<Props> = ({
  onRef
}) => {
  const tblRef: Parameters<typeof Table>[0]['ref'] = React.useRef(null);
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    let searchModel = [
      { type: 1, property: toCamel(CKEY.DICT_NAME), value: 's_tsjh', op: 'alike'}
    ];
    retrieveModulePager({page: 1, pageSize: 999999, searchModel: []}).then((response) => {
      if (response?.code === '200' && response?.body?.rowCount > 0) {
        const tmpData: any = [];
        const childTableRows = response.body.rows || [];

        setDataSource(childTableRows);
      }
    });
  }, []);

  const handleSave = (row: any) => {
    const newData: any = [...dataSource];
    const index: any = newData.findIndex((item: any) => row.dictFieldId === item.dictFieldId);
    const item: any = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = mergedColumns.map((col: any) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: any) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  const getData = () => {
    return dataSource;
  }

  useImperativeHandle(onRef, () => {
    return {
      getData,
    };
  });

  return (
    <>
      <Table
        ref={tblRef}
        bordered
        virtual
        size='small'
        columns={columns}
        scroll={{ x: 2000, y: 600 }}
        rowKey="dictFieldId"
        dataSource={dataSource}
        pagination={false}
        components={components}
      />
    </>
  );
};

export default Index;