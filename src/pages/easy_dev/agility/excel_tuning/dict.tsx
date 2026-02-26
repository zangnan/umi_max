import Spreadsheet from 'react-spreadsheet';
import { useState, useEffect, useImperativeHandle } from 'react';

import myUtil from '@/components/DDAssist/util';
import DDIT_TOOL_CONSTANTS from '@/components/DDBunit/excelConfig.v2.constants';
import { retrieveDictPager } from '@/services/hts/api';

const toCamel = myUtil.text.underscoreToCamel;
const CKEY = DDIT_TOOL_CONSTANTS.CONFIG_KEY;

export interface Props {
  onRef?: any;
}

const Index: React.FC<Props> = ({
  onRef
}) => {
  const [dataItem, setDataItem] = useState([]);

  useEffect(() => {
    let searchModel = [
      { type: 1, property: toCamel(CKEY.DICT_NAME), value: 's_tsjh', op: 'alike'}
    ];
    retrieveDictPager({page: 1, pageSize: 999999, searchModel: searchModel}).then((response) => {
      if (response?.code === '200' && response?.body?.rowCount > 0) {
        const tmpData: any = [];
        const childTableRows = response.body.rows || [];
        childTableRows.forEach((item: any) => {
          tmpData.push(
            [
              { value: item[toCamel(CKEY.DICT_FIELD_NAME)], name: toCamel(CKEY.DICT_FIELD_NAME) },
              { value: item[toCamel(CKEY.DICT_FIELD_DESC)], name: toCamel(CKEY.DICT_FIELD_DESC) },
              { value: item[toCamel(CKEY.DICT_NAME)], name: toCamel(CKEY.DICT_NAME) },
              { value: item[toCamel(CKEY.DICT_NAME_DESC)], name: toCamel(CKEY.DICT_NAME_DESC) },
              { value: item[toCamel(CKEY.DICT_FIELD_REL_TABLE)], name: toCamel(CKEY.DICT_FIELD_REL_TABLE) },
              { value: item[toCamel(CKEY.DICT_FIELD_FLAG)], name: toCamel(CKEY.DICT_FIELD_FLAG) },
              // 列表项
              { value: item[toCamel(CKEY.GRID_USED)], name: toCamel(CKEY.GRID_USED) },
              { value: item[toCamel(CKEY.GRID_KEY)], name: toCamel(CKEY.GRID_KEY) },
              { value: item[toCamel(CKEY.GRID_ALIGN)], name: toCamel(CKEY.GRID_ALIGN) },
              { value: item[toCamel(CKEY.GRID_WIDTH)], name: toCamel(CKEY.GRID_WIDTH) },
              { value: item[toCamel(CKEY.GRID_FIXED)], name: toCamel(CKEY.GRID_FIXED) },
              { value: item[toCamel(CKEY.GRID_HIDDEN)], name: toCamel(CKEY.GRID_HIDDEN) },
              { value: item[toCamel(CKEY.GRID_ELLIPSIS)], name: toCamel(CKEY.GRID_ELLIPSIS) },
              { value: item[toCamel(CKEY.GRID_RENDER)], name: toCamel(CKEY.GRID_RENDER) },
              { value: item[toCamel(CKEY.GRID_SORT)], name: toCamel(CKEY.GRID_SORT) },
              { value: item[toCamel(CKEY.GRID_INDEX)], name: toCamel(CKEY.GRID_INDEX) },
              { value: item[toCamel(CKEY.GRID_STATISTICS)], name: toCamel(CKEY.GRID_STATISTICS) },
              { value: item[toCamel(CKEY.GRID_CHILDREN)], name: toCamel(CKEY.GRID_CHILDREN) },
              // 筛选项
              { value: item[toCamel(CKEY.FILTER_ITEM_TYPE)], name: toCamel(CKEY.FILTER_ITEM_TYPE) },
              { value: item[toCamel(CKEY.FILTER_ITEM_EXTEND)], name: toCamel(CKEY.FILTER_ITEM_EXTEND) },
              { value: item[toCamel(CKEY.FILTER_ITEM_INDEX)], name: toCamel(CKEY.FILTER_ITEM_INDEX) },
              { value: item[toCamel(CKEY.FILTER_ITEM_LABEL)], name: toCamel(CKEY.FILTER_ITEM_LABEL) },
              { value: item[toCamel(CKEY.FILTER_ITEM_POSITION)], name: toCamel(CKEY.FILTER_ITEM_POSITION) },
              { value: item[toCamel(CKEY.FILTER_ITEM_PLACEHOLDER)], name: toCamel(CKEY.FILTER_ITEM_PLACEHOLDER) },
              { value: item[toCamel(CKEY.FILTER_ITEM_LAYOUT)], name: toCamel(CKEY.FILTER_ITEM_LAYOUT) },
              // 表单项
              { value: item[toCamel(CKEY.FORM_ITEM_USED)], name: toCamel(CKEY.FORM_ITEM_USED) },
              { value: item[toCamel(CKEY.FORM_ITEM_TYPE)], name: toCamel(CKEY.FORM_ITEM_TYPE) },
              { value: item[toCamel(CKEY.FORM_ITEM_READONLY)], name: toCamel(CKEY.FORM_ITEM_READONLY) },
              { value: item[toCamel(CKEY.FORM_ITEM_READONLY)], name: toCamel(CKEY.FORM_ITEM_READONLY) },
              { value: item[toCamel(CKEY.FORM_ITEM_EXTEND)], name: toCamel(CKEY.FORM_ITEM_EXTEND) },
              { value: item[toCamel(CKEY.FILTER_ITEM_LAYOUT)], name: toCamel(CKEY.FILTER_ITEM_LAYOUT) },
              { value: item[toCamel(CKEY.FORM_ITEM_EVENT_ONFOCUS)], name: toCamel(CKEY.FORM_ITEM_EVENT_ONFOCUS) },
              { value: item[toCamel(CKEY.FORM_ITEM_EVENT_ONFOCUS)], name: toCamel(CKEY.FORM_ITEM_EVENT_ONFOCUS) },
              { value: item[toCamel(CKEY.FORM_ITEM_EVENT_ONCHANGE)], name: toCamel(CKEY.FORM_ITEM_EVENT_ONCHANGE) },
              { value: item[toCamel(CKEY.FORM_ITEM_EVENT_ONSEARCH)], name: toCamel(CKEY.FORM_ITEM_EVENT_ONSEARCH) },
              { value: item[toCamel(CKEY.FORM_ITEM_RULE)], name: toCamel(CKEY.FORM_ITEM_RULE) },
              { value: item[toCamel(CKEY.FORM_ITEM_INDEX)], name: toCamel(CKEY.FORM_ITEM_INDEX) },
            ]
          );
        });
        setDataItem(tmpData);
      }
    });
  }, []);
  const columnLabels = [
    '字段名称',
    '字段含义',
    '数据字典名',
    '数据字典名详细描述',
    '关联数据表',
    '与原库间的关系',
    // 列表项
    '开启',
    '主键标识',
    '对齐方式',
    '列宽',
    '固定列',
    '隐藏标识',
    '超出隐藏',
    '格式化列',
    '排序开关',
    '序列',
    '统计',
    '合并列头',
    // 筛选项
    '类型',
    '类型扩展参数',
    '序列',
    '名称',
    '位置',
    '占位符',
    '布局',
    // 表单项
    '开启',
    '类型',
    '格式化',
    '只读',
    '类型扩展参数',
    '布局',
    '事件失去焦点',
    '事件得到焦点',
    '事件值改变',
    '验证',
    '序列',
  ];

  const onChange = (data: any) => {
    setDataItem(data);
  }

  const getData = () => {
    const arr: any = []
    dataItem.forEach((item: any) => {
      let obj: any = {}
      item.forEach((itemValue: any) => {
        obj = { ...obj, [itemValue.name]: itemValue.value }
      })
      arr.push(obj);
    });
    return arr;
  }

  useImperativeHandle(onRef, () => {
    return {
      getData,
    };
  });

  return (
    <>
      <div style={{overflowX: 'auto', overflowY: 'auto', height: '500px'}}>
        <Spreadsheet
          data={dataItem}
          columnLabels={columnLabels}
          onChange={onChange}
        />
      </div>
    </>
  );
};

export default Index;