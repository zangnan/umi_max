import React from 'react';
import { message } from 'antd';
import AutomaticPageVTable from '@/components/DDBunit/automatic_page_vtable';

const Unit2: React.FC<unknown> = () => {
  return (
    <AutomaticPageVTable
      onCustomBtn={{
        doKp: (param: any) => {
          message.info(
            `开票：当前选中 ${param.selectionRowKeys?.length || 0} 条，模块 ${param.moduleKey}`,
          );
          console.log('doKp param:', param);
        },
        doHb: (param: any) => {
          message.info(`合并：当前选中 ${param.selectionRowKeys?.length || 0} 条`);
          console.log('doHb param:', param);
        },
      }}
    />
  );
};

export default Unit2;