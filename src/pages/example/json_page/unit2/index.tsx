/**
 * title: 数据封装页面：列表
 */
import React from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import unitConfig from './config';
import Func from './f';

const Unit2: React.FC<unknown> = () => {
  let authority = {
    toolbar_default: {
      // add: false,
      // edit: false,
      // delete: false,
      // setting: false,
      // full: false,
      // download: false,
      // upload: false,
      // reload: false,
      // statistics: false,
      // advanced_filter: false,
    },
    grid_handle_columns_defaul: {
      // edit: false,
      // delete: false,
      // detail: false,
    },
    // customer_toolbar: [
    //   { key: 'cs1', auth: true },
    //   { key: 'cs2', auth: true },
    // ],
    // handle_columns: [
    //   {  key: 'cs11', auth: true },
    //   {  key: 'cs12', auth: true },
    // ],
  }

  return <>
    <DDBunit2 config={unitConfig} func={Func}
      authority={authority}
    />
  </>;
};

export default Unit2;