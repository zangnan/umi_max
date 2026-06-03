/**
 * 发票开具配置  基础开票配置
 */
import React, { useState, useEffect } from 'react';
import { message, Switch,  Spin,  } from 'antd';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import {gxsxpzYxbz, } from '@/services/hts/api';



const Index: React.FC<{ data?: any, funcRef?: any ,setActiveKey:any}> = ({
  data,
  funcRef,
  setActiveKey
}) => {


  const [masker, setMasker] = useState<any>(false); 

  const Func: any = {
    unitRef: React.createRef(),
  };
  const dwglConfig: any = {};


  // 配置项
  dwglConfig.grid_api_grid_query = `${API_URL_BASE}/saas/pzgl/aipdgl/cxsxpz`;   // api 列表查询
  dwglConfig.grid_show_serial_number = false;                      // 是否显示序号，默认不显示
  dwglConfig.grid_selection_type = false;                         // 列表首选项类别，默认 checkbox，可选 false radio checkbox
  dwglConfig.grid_show_data_num = false;                          // 工具栏左侧是否显示数据条数及选中数，默认true显示
  dwglConfig.click_checked = '1';                                                       // 是否开启单击或双击勾选事件，1单击勾选，2双击勾选，默认点击不勾选
  dwglConfig.grid_row_key = 'uuid';                                                     // 列表主键，默认uuid
  dwglConfig.unit_key = 'CKFPKJ_FPPZ_KPDWGL'; // 业务单元key，对应后端接口
  dwglConfig.export_key = 'CKFPKJ_FPPZ_KPDWGL_DC'; // 业务单元key，对应后端接口
  dwglConfig.module_type = 'QZ_type';
  dwglConfig.form_title = '单位管理'; // 表单标题，可选

  // 配置列表列 
  dwglConfig.grid_columns = [
    { title: '序号', dataIndex: 'aipdsxzdxh', width: 90 },
    { title: '筛选字段', dataIndex: 'aipdsxzdzwm', ellipsis: true },
    { title: '启用状态', dataIndex: 'qybz', width: 80, render: { func: 'renderYxbz' } },
  ];

  //开关值改变
  const onChangeSwitch = (param:any ,_record: any,) => {
    const {  checked } = _record;
    const {  record, unitRef, } = param;
    const obj = {
      aipdsxzdDm: record?.aipdsxzdDm,
      xzbz2: checked ? 'Y' : 'N',
    }
    unitRef.current!?.setMasker(true);
    gxsxpzYxbz(obj).then((res2: any) => {
      unitRef.current!?.setMasker(false);
      if (res2.code === '200') {
        message.success('保存成功！');
        unitRef?.current?.reload2();
      } else {
        message.error(res2.msg);
        unitRef?.current?.reload2();
      }
    });
  }

  Func.columnsRender = {
    // 生成类型
    renderYxbz: (param: any) => {
      const { record } = param;
      return <Switch checked={record.xzbz2 == 'Y' ? true : false} checkedChildren="启用" unCheckedChildren="停用" onClick={(checked) => onChangeSwitch( param,{ ...{ checked: checked } })} />
    },
  }



  // 配置项：自定义工具栏
  dwglConfig.costomer_toobar = [

  ];


  // 配置项：工具栏
  dwglConfig.toolbar_default = {
    setting: false,                    // 是否显示设置按钮，默认关闭
    full: false,                       // 是否显示全屏按钮，默认关闭
    reload: false,                     // 是否显示刷新按钮，默认关闭
    delete: false,
    add: false,
    edit: false,
    upload: false,                    // 是否显示导入按钮，默认关闭
  };




  return (
    <Spin tip="Loading..." spinning={masker} delay={100}>
      <DDBunit2 config={dwglConfig} func={Func} />
    </Spin>
  );
};

export default Index;
