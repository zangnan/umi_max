import React from 'react';
import { history } from 'umi';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import config from '../comm/config';
import { cloneDeep } from 'lodash';
import Func from './f';


const Index: React.FC = () => {

  const myConfig = cloneDeep(config);
  // 配置项：表单项
  myConfig.form_items = [
    { label: 'ID', type: 'Hidden', name: 'ddbh' },
    { label: 'ID', type: 'Hidden', name: 'khsbywlxDm' },
    { label: '服务费', type: 'InputNumber', name: 'zfglfwfje', format: '0,0.00', rules: [{ type: 'base_required' },{ type: 'base_number',  length: 14, decimal: 2}]},
    { label: '服务费开票日期', name: 'fwfkprq', type: 'DatePicker', 'allowClear': true, format: 'yyyy-MM-DD', rules: [{ type: 'base_required' }] },
    { label: '收汇日期', name: 'ckshrq', type: 'DatePicker', 'allowClear': true, format: 'yyyy-MM-DD', rules: [{ type: 'base_required' }] },
    { label: '收汇币种', type: 'Select', name: 'ckshhbzmDm', codeTable: ['code_dm_gy_hb','01'],rules: [{ type: 'base_required' }] },
    { label: '收汇金额', type: 'InputNumber', format: '0,0.00', eventOnBlur: 'mxcjBlursbxh',name: 'ckshje', rules: [{ type: 'base_required' },{ type: 'base_number',  length: 14, decimal: 2}]},
    { label: '收汇汇率', type: 'InputNumber', format: '0,0.00000', eventOnBlur: 'mxcjBlursbxh',name: 'ckshhbhl', rules: [{ type: 'base_required' },{ type: 'base_number',  length: 11, decimal: 5}]},
    { label: '结汇金额RMB', type: 'InputNumber', format: '0,0.00', name: 'ckshjermb', rules: [{ type: 'base_required' },{ type: 'base_number',  length: 14, decimal: 2}]},
    { label: '支付结汇额', type: 'InputNumber', format: '0,0.00', name: 'zfjk', rules: [{ type: 'base_required' },{ type: 'base_number',  length: 14, decimal: 2}]},
    { label: '支付日期', name: 'zfkxrq', type: 'DatePicker', 'allowClear': true, format: 'yyyy-MM-DD', rules: [{ type: 'base_required' }] },

  ];

  if (history?.location?.pathname === '/40/4002/400201/40020104') {

    myConfig.gridParams = {
      initSearchModal: [
        { property: 'cxlx', value: "ywc", op: 'zdy' },
        { property: 'khsbywlxDm', value: "1", op: 'zdy' },
      ],
    } 
    
    myConfig.export_key = 'EXPORT_DDZX_DDGL_DBTS_YWCDC';

    let col = cloneDeep(myConfig.grid_columns);

    col = col.filter(
      (item: { dataIndex: string; }) => item.dataIndex !== "kptzbz"
      && item.dataIndex !== "kptzsj"
      && item.dataIndex !== "sl1"
      && item.dataIndex !== "hhcb"
      && item.dataIndex !== "pdzt"
    );
    col.push(  { title: '生成开票时间', dataIndex: 'kptzsj', width: 180, align: 'center', render: { type: 'date', format: 'yyyy-MM-DD  HH:mm:ss' } },    );

    myConfig.grid_columns = col;

    let file = cloneDeep(myConfig.filter_items);
    file.push({ name: 'hdrq', label: '核对日期', type: 'DatePicker', range: true, allowClear: true });
    file.push({ name: 'sbrq1', label: '申报月份', type: 'Input' });
    myConfig.filter_items = file;

    myConfig.form_items.push({ label: '退税日期', name: 'tsrq1', type: 'DatePicker', 'allowClear': true, format: 'yyyy-MM-DD', rules: [{ type: 'base_required' }] },);
    myConfig.form_items.push({ label: '支付给客户日期', name: 'zfrq', type: 'DatePicker', 'allowClear': true, format: 'yyyy-MM-DD', rules: [{ type: 'base_required' }] },);

    

  } else if (history?.location?.pathname === '/40/4002/400203/40020304'){
    myConfig.gridParams = {
      initSearchModal: [
        { property: 'cxlx', value: "ywc", op: 'zdy' },
        { property: 'khsbywlxDm', value: "2", op: 'zdy' },
      ],
    } 
    myConfig.export_key = 'EXPORT_DDZX_DDGL_DLCK_YWCDC';

    let col = cloneDeep(myConfig.grid_columns);

    col = col.filter(
      (item: { dataIndex: string; }) => item.dataIndex !== "kptzbz"
      && item.dataIndex !== "kptzsj"
      && item.dataIndex !== "sl1"
      && item.dataIndex !== "pdzt"

      && item.dataIndex !== "se"
      && item.dataIndex !== "hsje"
      && item.dataIndex !== "hhcb"
      && item.dataIndex !== "sjtse"
      && item.dataIndex !== "sjtse"
      && item.dataIndex !== "kprq"
      && item.dataIndex !== "fpDm"
      && item.dataIndex !== "fphm"
      && item.dataIndex !== "hh"
      && item.dataIndex !== "hdrq"
      && item.dataIndex !== "pdbz"
      && item.dataIndex !== "pdsj1"
      && item.dataIndex !== "ssqpc"
      && item.dataIndex !== "sbrq1"
      && item.dataIndex !== "zbblbz"
      && item.dataIndex !== "tsrq1"
      && item.dataIndex !== "zfrq"
      && item.dataIndex !== "dsbz"
    );

    myConfig.grid_columns = col;


  }else if(history?.location?.pathname === '/40/4002/400204/40020404'){

    myConfig.form_items.push({ label: '退税日期', name: 'tsrq1', type: 'DatePicker', 'allowClear': true, format: 'yyyy-MM-DD', rules: [{ type: 'base_required' }] },);
    myConfig.form_items.push({ label: '支付给客户日期', name: 'zfrq', type: 'DatePicker', 'allowClear': true, format: 'yyyy-MM-DD', rules: [{ type: 'base_required' }] },);

    myConfig.gridParams = {
      initSearchModal: [
        { property: 'cxlx', value: "ywc", op: 'zdy' },
        { property: 'khsbywlxDm', value: "3", op: 'zdy' },
      ],
    } 
    myConfig.export_key = 'EXPORT_DDZX_DDGL_ZYCK_YWCDC';

    let col = cloneDeep(myConfig.grid_columns);

    col = col.filter(
      (item: { dataIndex: string; }) => item.dataIndex !== "kptzbz"
      && item.dataIndex !== "kptzsj"
      && item.dataIndex !== "sl1"
      && item.dataIndex !== "pdzt"

    );
    col.push(  { title: '生成开票时间', dataIndex: 'kptzsj', width: 180, align: 'center', render: { type: 'date', format: 'yyyy-MM-DD  HH:mm:ss' } },    );
    myConfig.grid_columns = col;

    let file = cloneDeep(myConfig.filter_items);
    file.push({ name: 'hdrq', label: '核对日期', type: 'DatePicker', range: true, allowClear: true });
    file.push({ name: 'sbrq1', label: '申报月份', type: 'Input' });
    myConfig.filter_items = file;
  }

   

  myConfig.toolbar_default = {
    setting: true,
    reload: true,
    full: true,
    edit: true,
    tssb_download:true,
  };

  return (
    <>
      <DDBunit2 config={myConfig} func={Func} />
    </>
  )
};

export default Index;
