import React, { useRef } from 'react';
import { history } from 'umi';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import config from '../comm/config';
import { cloneDeep } from 'lodash';
import Func from './f';
import Zdpd from './zdpd';



const Index: React.FC = () => {

  const myConfig = cloneDeep(config);

  const modalRef: any = useRef();
  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(modalRef);
    return otherRef;
  };

  // 代办退税
  if (history?.location?.pathname === '/40/4002/400201/40020101') {
    myConfig.form_api_delete = `${API_URL_BASE}/ddzx/ddgl/deleteDkpDd`
    myConfig.batch_delete_key = 'ddbhs';

    myConfig.gridParams = {
      initSearchModal: [
        { property: 'cxlx', value: 'dkp', op: 'zdy' },
        { property: 'khsbywlxDm', value: '1', op: 'zdy' }
      ],
    }
    myConfig.export_key = 'EXPORT_DDZX_DDGL_DBTS_DKPDC';

    
    // 转用途\删除\生成开票通知\自动配单
    // 配置项：自定义工具栏
    myConfig.costomer_toobar = [
      { name: '生成开票通知', func: 'sckptz' },
      { name: '自动配单', func: 'zdpd' },
      { name: '转用途', func: 'zyt' },
    ];

    let col = cloneDeep(myConfig.grid_columns);
    
    col = col.filter(
      (item: { dataIndex: string; }) =>item.dataIndex !== "sl1"
    );

    for(let i = 0;i<col.length;i++){
      if(col[i].dataIndex == 'hhcb'){
        col = col.splice(0, i);
        break;
      }
    }
    myConfig.grid_columns = col;
  }else if(history?.location?.pathname === '/40/4002/400204/40020401'){
    myConfig.gridParams = {
      initSearchModal: [
        { property: 'cxlx', value: 'dkp', op: 'zdy' },
        { property: 'khsbywlxDm', value: '3', op: 'zdy' }
      ],
    }
    // 配置项：自定义工具栏
    myConfig.costomer_toobar = [
      { name: '生成开票通知', func: 'sckptz' },
      { name: '自动配单', func: 'zdpd' },
    ];

    myConfig.export_key = 'EXPORT_DDZX_DDGL_ZYCK_DKPDC';


    let col = cloneDeep(myConfig.grid_columns);
    
    col = col.filter(
      (item: { dataIndex: string; }) =>item.dataIndex !== "sl1"
    );

    
    for(let i = 0;i<col.length;i++){
      if(col[i].dataIndex == 'zfglfwfje'){
        col = col.splice(0, i);
        break;
      }
    }

    myConfig.grid_columns = col;

  }


  return (
    <>
      <DDBunit2 config={myConfig} func={Func} />
      <Zdpd onRef={modalRef} />
    </>
  )
};

export default Index;
