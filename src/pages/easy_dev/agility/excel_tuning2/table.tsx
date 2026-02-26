import React, { useContext, useEffect, useRef, useState, useImperativeHandle } from 'react';
import { Form, Input, Table } from 'antd';
import type { GetRef, InputRef } from 'antd';

import myUtil from '@/components/DDAssist/util';
import DDIT_TOOL_CONSTANTS from '@/components/DDBunit/excelConfig.v2.constants';
import { retrieveTablePager } from '@/services/hts/api';

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
	{ title: '物理表名称', dataIndex: 'tableName', width: 120, fixed: 'left', editable: true },
	{ title: '物理表含义', dataIndex: 'tableDesc', width: 180, ellipsis: true, editable: true },
	{ title: '逻辑表类型', dataIndex: 'tableType', width: 100, editable: true },
	{ title: '别名', dataIndex: 'tableAlias', width: 120, editable: true },
	{ title: '数据字典名', dataIndex: 'dictName', width: 120, editable: true },
	{ title: '数据字典含义', dataIndex: 'dictDesc', width: 180, ellipsis: true, editable: true },
	{ title: '缺省数据查询顺序', dataIndex: 'dbOrder', width: 180, ellipsis: true, editable: true },
	{ title: '清空标志', dataIndex: 'dbCleanFlag', width: 70, editable: true },
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
    retrieveTablePager({page: 1, pageSize: 999999, searchModel: []}).then((response) => {
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