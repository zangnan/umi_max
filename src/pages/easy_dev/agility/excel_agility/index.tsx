import React, { useState, useRef, useEffect } from 'react';
import DDListTable from '@/components/DDVTable/DDListTable';
import { Tabs, Card, Checkbox, FloatButton, Select } from 'antd';
import myUtil from '@/components/DDAssist/util';
import configModule from './configModule';
import configField from './configField';
import func from './func';
import { cloneDeep, filter } from 'lodash';
import { FullscreenOutlined } from '@ant-design/icons';
import CONSTANTS from '@/components/DDAssist/constants';

// 默认选中
let defaultValueModule: any = ['module', 'toolbar', 'grid', 'api', 'form', 'other'];
let defaultValueField: any = ['field', 'db', 'grid', 'filter', 'form', 'other'];

const TableList: React.FC<unknown> = () => {
  const [defaultTabKey] = useState<any>(myUtil.localStore.getItem('defaultTabKeyExcel') || '1');
  const [activeKey, setActiveKey] = useState<any>(myUtil.localStore.getItem('defaultTabKeyExcel') || '1');
  const [myConfigModule, setMyConfigModule] = useState<any>(configModule);
  const [myConfigField, setMyConfigField] = useState<any>(configField);
  const [checkedValueModule, setcheckedValueModule] = useState<any>([...defaultValueModule]);
  const [checkedValueField, setcheckedValueField] = useState<any>([...defaultValueField]);
  const [initSearchModal, setInitSearchModal] = useState<any>([]);

  const refModule: any = useRef();
  const refField: any = useRef();
  const { pathname } = window.location;

  useEffect(() => {
  }, []);

  // 切换
  const onChangeTab = (activeKey: any) => {
    myUtil.localStore.setItem('defaultTabKeyExcel', activeKey);
    setActiveKey(activeKey);
  }

  // api
  let apiUpdateModule: any;
  let apiUpdateDict: any;
  if (ENV_TYPE === 'node') {
    apiUpdateModule = `${myUtil.api.getApiRoot()}/ns/base/edit/app_module`;
    apiUpdateDict = `${myUtil.api.getApiRoot()}/ns/base/edit/app_module_field`;
  } else {
    apiUpdateModule = `${myUtil.api.getApiRoot()}/dict/automatic/exp/updateModule`;
    apiUpdateDict = `${myUtil.api.getApiRoot()}/dict/automatic/exp/updateDict`;
  }

  // optionField
  let optionField: any = [
    {value: 'field', label: '字段' },
    {value: 'db', label: '数据库' },
    {value: 'grid', label: '列表' },
    {value: 'filter', label: '筛选' },
    {value: 'form', label: '表单' },
    {value: 'other', label: '其他' },
  ];

  // optionField
  let optionModule: any = [
    {value: 'module', label: '模块' },
    {value: 'toolbar', label: '工具栏' },
    {value: 'grid', label: '列表' },
    {value: 'api', label: 'Api' },
    {value: 'form', label: '表单' },
    {value: 'other', label: '其他' },
  ];

  const initConfig = ({checkedValue, initSearchModal}: any) => {
    let cc: any = activeKey === '2' ? cloneDeep(configField): cloneDeep(configModule);
    cc.columns = filter(cc.columns, (item: any) => {
      return checkedValue.indexOf(item.flag) > -1;
    });
    if (initSearchModal) {
      cc.gridParams = {
        initSearchModal
      }
    }
    if (activeKey === '2') {
      setMyConfigField(cc);
    } else if (activeKey === '1') {
      setMyConfigModule(cc);
    }
  }

  // 切换选择
  const changeFieldRange = (checkedValue: any) => {
    if (activeKey === '2') {
      setcheckedValueField(checkedValue);
    } else if (activeKey === '1') {
      setcheckedValueModule(checkedValue);
    }
    initConfig({checkedValue, initSearchModal})
  }

  // 字段筛选
  let filterColumnModule = <Checkbox.Group options={optionModule} defaultValue={checkedValueModule} onChange={(checkedValue) => changeFieldRange(checkedValue)} />;
  let filterColumnField = <Checkbox.Group options={optionField} defaultValue={checkedValueField} onChange={(checkedValue) => changeFieldRange(checkedValue)} />;

  // 筛选模块或字典
  const onChangeCondition = (param: any) => {
    let filterValue = param.value;
    let initSearchModalTmp;
    if (activeKey === '2') {
      initSearchModalTmp = [ { property: ENV_TYPE === 'node' ? 'module_key' : 'dictName', value: filterValue, op: CONSTANTS.FILTER_CONDITION.include.condetionCode, type: '1' } ];
      initConfig({checkedValue: checkedValueField, initSearchModal: initSearchModalTmp})
    } else if (activeKey === '1') {
      initSearchModalTmp = [ { property: ENV_TYPE === 'node' ? 'module_key' : 'moduleKey', value: filterValue, op: CONSTANTS.FILTER_CONDITION.include.condetionCode, type: '1' } ];
      initConfig({checkedValue: checkedValueModule, initSearchModal: initSearchModalTmp})
    }
    setInitSearchModal(initSearchModalTmp);
  }

  // bar
  let tabBarExt = {
    right: <>
      {activeKey === '1' && <>
        <Select style={{width: '200px', marginRight: '20px'}} showSearch={true} allowClear={true} placeholder="筛选模块" filterOption={(input, option: any) => {
          return option?.name?.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option?.value?.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }}
          options={myUtil.code.getSelectOption('code_dm_def_module')} onChange={(value: any) => {onChangeCondition({value, flag: 'module'})}} />
        {filterColumnModule}
      </>}
      {activeKey === '2' && <>
        <Select style={{width: '200px', marginRight: '20px'}} showSearch={true} allowClear={true} placeholder="筛选字典" filterOption={(input, option: any) => {
          return option?.name?.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option?.value?.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }}
          options={myUtil.code.getSelectOption(ENV_TYPE === 'node' ? 'code_dm_def_module' : 'code_dm_def_dict')} onChange={(value: any) => {onChangeCondition({value, flag: ENV_TYPE === 'node' ? 'module' : 'dict'})}} />
        {filterColumnField}
      </>}
    </>
  };

  // ListTable
  let listTableModule = <DDListTable config={myConfigModule} func={func} refDDListTable={refModule} apiUpdate={apiUpdateModule} excelType='module'/>;
  let listTableField = <DDListTable config={myConfigField} func={func} refDDListTable={refField} apiUpdate={apiUpdateDict} excelType='field'/>;

  return (<>
    <Card className="dd-grid-wrap" variant="borderless">
      <Tabs defaultActiveKey={defaultTabKey} onChange={onChangeTab} tabBarExtraContent={tabBarExt} items={[
        { key: '1', label: '模块', children: listTableModule, },
        { key: '2', label: '字典构建', children: listTableField, }
      ]}/>
    </Card>
    { pathname.indexOf('/agility/excel_agility_f') < 0 && <FloatButton icon={<FullscreenOutlined />} target='_blank' href={`${window.location.href}_f`} /> }
  </>);
};

export default TableList;
