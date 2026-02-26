import React, { useContext, useEffect, useRef, useState, useImperativeHandle } from 'react';
import { Form, Input, Table } from 'antd';
import type { GetRef, InputRef } from 'antd';

import myUtil from '@/components/DDAssist/util';
import DDIT_TOOL_CONSTANTS from '@/components/DDBunit/excelConfig.v2.constants';
import { retrieveDictPager } from '@/services/hts/api';

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
	{ title: '字段名称', dataIndex: toCamel(CKEY.DICT_FIELD_NAME), width: 120, ellipsis: true, editable: true },
	{ title: '字段含义', dataIndex: toCamel(CKEY.DICT_FIELD_DESC), width: 140, ellipsis: true, editable: true },
	{ title: '数据字典名', dataIndex: toCamel(CKEY.DICT_NAME), width: 120, ellipsis: true, editable: true },
	{ title: '数据字典名详细描述', dataIndex: toCamel(CKEY.DICT_NAME_DESC), width: 150, editable: true },
	{ title: '关联数据表', dataIndex: toCamel(CKEY.DICT_FIELD_REL_TABLE), width: 120, editable: true },
	{ title: '与原库间的关系', dataIndex: toCamel(CKEY.DICT_FIELD_FLAG), width: 120, editable: true },
  { title: '列表项开启', dataIndex: toCamel(CKEY.GRID_USED), width: 85, editable: true },
  { title: '列表项主键标识', dataIndex: toCamel(CKEY.GRID_KEY), width: 115, editable: true },
  { title: '列表项对齐方式', dataIndex: toCamel(CKEY.GRID_ALIGN), width: 115, editable: true },
  { title: '列表项列宽', dataIndex: toCamel(CKEY.GRID_WIDTH), width: 85, editable: true },
  { title: '列表项固定列', dataIndex: toCamel(CKEY.GRID_FIXED), width: 100, editable: true },
  { title: '列表项隐藏标识', dataIndex: toCamel(CKEY.GRID_HIDDEN), width: 115, editable: true },
  { title: '列表项超出隐藏', dataIndex: toCamel(CKEY.GRID_ELLIPSIS), width: 115, editable: true },
  { title: '列表项格式化列', dataIndex: toCamel(CKEY.GRID_RENDER), width: 130, ellipsis: true, editable: true },
  { title: '列表项排序开关', dataIndex: toCamel(CKEY.GRID_SORT), width: 115, editable: true },
  { title: '列表项序列', dataIndex: toCamel(CKEY.GRID_INDEX), width: 85, editable: true },
  { title: '列表项统计', dataIndex: toCamel(CKEY.GRID_STATISTICS), width: 100, ellipsis: true, editable: true },
  { title: '列表项合并列头', dataIndex: toCamel(CKEY.GRID_CHILDREN), width: 115, editable: true },
  { title: '筛选项类型', dataIndex: toCamel(CKEY.FILTER_ITEM_TYPE), width: 140, editable: true },
  { title: '筛选项类型扩展参数', dataIndex: toCamel(CKEY.FILTER_ITEM_EXTEND), width: 170, ellipsis: true, editable: true },
  { title: '筛选项序列', dataIndex: toCamel(CKEY.FILTER_ITEM_INDEX), width: 95, editable: true },
  { title: '筛选项名称', dataIndex: toCamel(CKEY.FILTER_ITEM_LABEL), width: 95, editable: true },
  { title: '筛选项位置', dataIndex: toCamel(CKEY.FILTER_ITEM_POSITION), width: 95, editable: true },
  { title: '筛选项占位符', dataIndex: toCamel(CKEY.FILTER_ITEM_PLACEHOLDER), width: 115, editable: true },
  { title: '筛选项布局', dataIndex: toCamel(CKEY.FILTER_ITEM_LAYOUT), width: 95, editable: true },
  { title: '表单项开启', dataIndex: toCamel(CKEY.FORM_ITEM_USED), width: 85, editable: true },
  { title: '表单项类型', dataIndex: toCamel(CKEY.FORM_ITEM_TYPE), width: 140, editable: true },
  { title: '表单项格式化', dataIndex: toCamel(CKEY.FORM_ITEM_READONLY), width: 115, editable: true },
  { title: '表单项只读', dataIndex: toCamel(CKEY.FORM_ITEM_READONLY), width: 95, editable: true },
  { title: '表单项类型扩展参数', dataIndex: toCamel(CKEY.FORM_ITEM_EXTEND), width: 170, ellipsis: true, editable: true },
  { title: '表单项布局', dataIndex: toCamel(CKEY.FILTER_ITEM_LAYOUT), width: 95, editable: true },
  { title: '表单项事件失去焦点', dataIndex: toCamel(CKEY.FORM_ITEM_EVENT_ONFOCUS), width: 145, editable: true },
  { title: '表单项事件得到焦点', dataIndex: toCamel(CKEY.FORM_ITEM_EVENT_ONFOCUS), width: 145, editable: true },
  { title: '表单项事件值改变', dataIndex: toCamel(CKEY.FORM_ITEM_EVENT_ONCHANGE), width: 130, ellipsis: true, editable: true },
  { title: '表单项事件查询', dataIndex: toCamel(CKEY.FORM_ITEM_EVENT_ONSEARCH), width: 130, ellipsis: true, editable: true },
  { title: '表单项验证', dataIndex: toCamel(CKEY.FORM_ITEM_RULE), width: 170, ellipsis: true, editable: true },
  { title: '表单项序列', dataIndex: toCamel(CKEY.FORM_ITEM_INDEX), width: 85, editable: true },
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
    retrieveDictPager({page: 1, pageSize: 999999, searchModel: []}).then((response) => {
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