import React, {useRef} from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import config from './auto_config';
import Func from './f';
import Jhmx from '@/pages/hts/commonModule/jhmx/jhmx';

const index: React.FC<unknown> = () => {

  const jhmxRef: any = useRef(); // 生成进货明细

  const myConfig = {...config};

  myConfig.form_api_save = `${API_URL_BASE}/yw/bszx/mdt/hwlw/tsjh/updateHwlwTsjh`; // api 表单更新
  myConfig.form_api_save_upload = `${API_URL_BASE}/yw/bszx/mdt/hwlw/tsjh/updateHwlwTsjh`; // api 表单更新
  myConfig.form_api_delete = `${API_URL_BASE}/yw/bszx/mdt/hwlw/tsjh/deleteHwlwTsjh`; // api 表单删除

  // 配置项：自定义工具栏
  myConfig.costomer_toobar = [];

  myConfig.grid_columns_tj.forEach((item: any) => {
    if (item.dataIndex === 'bytsbz') {
      item.filter = {
        type: 'Select',
        codeTable: ['code_static_yes_no', '01'],
      }
    }
    if (item.dataIndex === 'byblbz') {
      item.filter = {
        type: 'Select',
        codeTable: ['code_static_yes_no', '01'],
      }
    }
    if (item.dataIndex === 'zbblbz') {
      item.filter = {
        type: 'Select',
        codeTable: ['code_static_yes_no', '01'],
      }
    }
  })

  // 导入
  myConfig.import_key = 'SAAS_TSSB_MDT_MXCJ_TSJH_DR';

  myConfig.toolbar_default.tssb_download = true;
  myConfig.export_large = true; // tssb_download 配合此导出使用，同步大数据量导出
  myConfig.toolbar_default.ckts_download = false;

  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(jhmxRef);  // 报关单生成明细
    return otherRef;
  };

  return <>
    <DDBunit2 config={myConfig} func={Func}/>
    <Jhmx onRef={jhmxRef}/>
  </>
};
export default index;
