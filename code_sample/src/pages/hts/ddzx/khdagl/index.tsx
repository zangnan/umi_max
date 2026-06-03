import React ,{useEffect}from 'react';
import { history } from 'umi';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import config from './config';
import { cloneDeep } from 'lodash';
import Func from './f';
import { getJsxxByFjyhuuid,  } from '@/services/hts/api';
import myUtil from '@/pages/common/myUtil';


const Index: React.FC =  () => {

  const myConfig = cloneDeep(config);

  useEffect(() => {
    // 获取购买方数据集合
    let body: any[] = [];
    getJsxxByFjyhuuid({}).then( (response: any) => {
    if (response.code == '200') {
      response.body.forEach((element: any) => {
        body.push({code:element.jsDm,name:element.jsMc});
      });
      myUtil.code.saveCodeToLocalTable('CODE_ZDY_JSDM',body,'01');
    }
  });

  }, [])

  if (history?.location?.pathname === '/40/4001/400101') {// 准入客户
    myConfig.gridParams = {
      initSearchModal: [
        { property: 'cxlx', value: "zrkh", op: 'zdy' },
      ],
    }

    myConfig.export_key = 'REPORT_DDZX_KHDAGL_ZRKH'; // 业务单元key，对应后端接口
    myConfig.import_key = 'SAAS_DDZX_KHGL_ZRKH_DR';
    myConfig.exprotMsg = '注意：重复数据自动跳过不导入。';

    // 配置项：自定义工具栏
    myConfig.costomer_toobar = [
      { name: '签约', func: 'qianyue' },
      { name: '移至黑名单', func: 'yzhmd' },
    ];
    // 配置项：工具栏
    myConfig.toolbar_default = {
      setting: true,
      reload: true,
      full: true,
      // download: true,
      tssb_download: true,
      delete: true,
      add: true,
      edit: true,
      upload: true,  // 是否显示导入按钮，默认关闭
    };

    let col = cloneDeep(myConfig.grid_columns);

    col = col.filter(
      (item: { dataIndex: string; }) => item.dataIndex !== "dlzh"
        && item.dataIndex !== "dlmm"
        && item.dataIndex !== "jsmc"
    );

    myConfig.grid_columns = col;
    myConfig.form_items.push(  { label: '备注', name: 'bz', type: 'TextArea', autoSize: { minRows: 2, maxRows: 2}, 
    layout: { label: { xs: 8, sm: 8, md: 8, lg: 5, xl: 3, xxl: 3},
    formItem: { xs: 16, sm: 16, md: 16, lg: 19, xl: 21, xxl: 21 } },
    rules: [{ type: 'base_string', range: [0, 1000]}],});
    
  } else if (history?.location?.pathname === '/40/4001/400102') { // 签约客户


    myConfig.gridParams = {
      initSearchModal: [
        { property: 'cxlx', value: "qykh", op: 'zdy' },
      ],
    };
    myConfig.export_key = 'REPORT_DDZX_KHDAGL_QYKH';

    // 配置项：自定义工具栏
    myConfig.costomer_toobar = [
      { name: '移至黑名单', func: 'yzhmd' },
    ];

    myConfig.form_items.forEach((element: any) => {
      if (element.name == 'hth') {
        element.rules.push({ type: 'base_required' });
      }
    });

    myConfig.form_items.push({ disabled :true,label: '访问账号', type: 'Input', name: 'dlzh', rules: [{type: 'base_required'},{ type: 'base_string', range: [0, 20]}]},);
    myConfig.form_items.push({ label: '访问密码', type: 'Password', name: 'dlmm', rules: [{type: 'base_required'},{ type: 'base_string', range: [0, 20]}]},);
    myConfig.form_items.push({ label: '角色名称', type: 'Select', name: 'jsDm' ,codeTable:['CODE_ZDY_JSDM','01'], rules: [{type: 'base_required'}]});
    myConfig.form_items.push(  { label: '备注', name: 'bz', type: 'TextArea', autoSize: { minRows: 2, maxRows: 2}, 
    layout: { label: { xs: 8, sm: 8, md: 8, lg: 5, xl: 3, xxl: 3},
    formItem: { xs: 16, sm: 16, md: 16, lg: 19, xl: 21, xxl: 21 } },
    rules: [{ type: 'base_string', range: [0, 1000]}],});

    // 配置项：工具栏
    myConfig.toolbar_default = {
      setting: true,
      reload: true,
      edit: true,
      tssb_download: true,
      full: true,
    };

    

  } else if (history?.location?.pathname === '/40/4001/400103') { // 黑名单客户

    myConfig.export_key = 'REPORT_DDZX_KHDAGL_HMDKH';

    myConfig.gridParams = {
      initSearchModal: [
        { property: 'cxlx', value: "hmdkh", op: 'zdy' },
      ],
    }
    // 配置项：自定义工具栏
    myConfig.costomer_toobar = [
      { name: '移出黑名单', func: 'ychmd' },
    ];
    myConfig.toolbar_default = {
      setting: true,
      reload: true,
      full: true,
      tssb_download: true,
    };
    let col = cloneDeep(myConfig.grid_columns);

    col = col.filter(
      (item: { dataIndex: string; }) => item.dataIndex !== "dlzh"
        && item.dataIndex !== "dlmm"
        && item.dataIndex !== "jsmc"
    );

    myConfig.grid_columns = col;
  }

  return (
    <>
      <DDBunit2 config={myConfig} func={Func} />
    </>
  )
};

export default Index;
