
import dayjs from 'dayjs';
import React, { useRef } from 'react';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import config from './config';
import Func from '../../common/f'
import DrawerList from '../../common/drawer_list';
import { history } from 'umi';
import myUtil from '@/components/DDAssist/util';

const index: React.FC<unknown> = () => {
  let myConfig = { ...config };
  myConfig.grid_filter_quick[0].defaultValue = myUtil.date.getDateYearAgoToNow(1).map((d: string) => dayjs(d));
  if (history?.location?.pathname === '/hts/sjbb/sc/tjbb/ckqk/fyhz') { // 分月汇总
    myConfig.unit_key = 'CX_SJFX_SC_CKQK_FYHZ';                               // 业务单元key，对应后端接口
    myConfig.page_id = 'CX_SJFX_SC_CKQK_FYHZ';                                // 页面id
    myConfig.export_key = 'CX_SJFX_SC_CKQK_FYHZ_PRINT_REPORT';                             // 导出key
    myConfig.grid_columns[0] = { title: '出口年月', dataIndex: 'ckny', width: 100, fixed: 'left', render: { func: 'renderFzxm' } };
  } else if (history?.location?.pathname === '/hts/sjbb/sc/tjbb/ckqk/fgbckqk') { // 分国别出口情况
    myConfig.unit_key = 'CX_SJFX_SC_CKQK_FGBCKQK';
    myConfig.page_id = 'CX_SJFX_SC_CKQK_FGBCKQK';
    myConfig.export_key = 'CX_SJFX_SC_CKQK_FGBCKQK_PRINT_REPORT';
    myConfig.grid_columns[0] = { title: '最终目的国', dataIndex: 'zzmdgdqszDm', width: 140, fixed: 'left', render: { func: 'renderFzxm' },
      filter: {
        type: 'Select',
        codeTable: 'CODE_DM_CKTS_HGGJHDQ:01',
        showCode: true,
      }
    };
  } else if (history?.location?.pathname === '/hts/sjbb/sc/tjbb/ckqk/fkackqk') { // 分口岸出口情况
    myConfig.unit_key = 'CX_SJFX_SC_CKQK_FKACKQK';
    myConfig.page_id = 'CX_SJFX_SC_CKQK_FKACKQK';
    myConfig.export_key = 'CX_SJFX_SC_CKQK_FKACKQK_PRINT_REPORT';
    myConfig.grid_columns[0] = { title: '出口口岸', dataIndex: 'hggqkaDm', width: 150, fixed: 'left', render: { func: 'renderFzxm' },};
    myConfig.grid_filter_quick = [
      { label: '出口年月', name: 'ckny',  isLabel: true, type: 'DatePicker', range: true, format: 'yyyyMM', picker: 'month', allowClear: false },
      { label: '出口口岸', name: 'hggqkaDm', mode: 'multiple',  type: 'Select', showSearch: true, codeTable: 'CODE_DM_GY_HGGQKA:01', width: '5w' },
    ]
    myConfig.grid_filter_quick[0].defaultValue = myUtil.date.getDateYearAgoToNow(1).map((d: string) => dayjs(d));
  } else if (history?.location?.pathname === '/hts/sjbb/sc/tjbb/ckqk/fjgfsckqk') { // 分监管方式出口情况
    myConfig.unit_key = 'CX_SJFX_SC_CKQK_FJGFSCKQK';
    myConfig.page_id = 'CX_SJFX_SC_CKQK_FJGFSCKQK';
    myConfig.export_key = 'CX_SJFX_SC_CKQK_FJGFSCKQK_PRINT_REPORT';
    myConfig.grid_columns[0] = { title: '监管方式', dataIndex: 'jgfsDm', width: 150, fixed: 'left', render: { func: 'renderFzxm' },};
    myConfig.grid_filter_quick = [
      { label: '出口年月', name: 'ckny',  isLabel: true, type: 'DatePicker', range: true, format: 'yyyyMM', picker: 'month', allowClear: false },
      { label: '监管方式', name: 'jgfsDm', isLabel: true, mode: 'multiple',  type: 'Select', showSearch: true, codeTable: 'CODE_DM_CKTS_HGJGFS:01', width: '5w' },
    ]
    myConfig.grid_filter_quick[0].defaultValue = myUtil.date.getDateYearAgoToNow(1).map((d: string) => dayjs(d));
  } else if (history?.location?.pathname === '/hts/sjbb/sc/tjbb/ckqk/fysfsckqk') { // 分运输方式出口情况
    myConfig.unit_key = 'CX_SJFX_SC_CKQK_FYSFSCKQK';
    myConfig.page_id = 'CX_SJFX_SC_CKQK_FYSFSCKQK';
    myConfig.export_key = 'CX_SJFX_SC_CKQK_FYSFSCKQK_PRINT_REPORT';
    myConfig.grid_columns[0] = { title: '运输方式', dataIndex: 'ysfsDm', width: 150, fixed: 'left', render: { func: 'renderFzxm' },
      filter: {
        type: 'Select',
        codeTable: 'CODE_DM_CKTS_HGYSFS:01',
        showCode: true,
      }
    };
  } else if (history?.location?.pathname === '/hts/sjbb/sc/tjbb/ckqk/htckqk') { // 合同出口情况
    myConfig.unit_key = 'CX_SJFX_SC_CKQK_HTCKQK';
    myConfig.page_id = 'CX_SJFX_SC_CKQK_HTCKQK';
    myConfig.export_key = 'CX_SJFX_SC_CKQK_HTCKQK_PRINT_REPORT';
    myConfig.grid_columns[0] = { title: '出口合同号', dataIndex: 'ckhth', width: 190, fixed: 'left', render: { func: 'renderFzxm' } };
    myConfig.grid_filter_quick = [
      { label: '出口年月', name: 'ckny', isLabel: true, type: 'DatePicker', range: true, format: 'yyyyMM', picker: 'month', allowClear: false },
      { label: '出口合同号', name: 'ckhth', type: 'Input', isLabel: true, searchButton: true }
    ];
    myConfig.grid_filter_quick[0].defaultValue = myUtil.date.getDateYearAgoToNow(1).map((d: string) => dayjs(d));
  } else if (history?.location?.pathname === '/hts/sjbb/sc/tjbb/ckqk/fjwshrckqk') { // 分境外收货人出口情况
    myConfig.unit_key = 'CX_SJFX_SC_CKQK_FJWSHRCKQK';
    myConfig.page_id = 'CX_SJFX_SC_CKQK_FJWSHRCKQK';
    myConfig.export_key = 'CX_SJFX_SC_CKQK_FJWSHRCKQK_PRINT_REPORT';
    myConfig.grid_columns[0] = { title: '境外收货人', dataIndex: 'jwshrmc', width: 190, fixed: 'left', ellipsis: true , render: { func: 'renderFzxm' } };
    myConfig.grid_filter_quick = [
      { label: '出口年月', name: 'ckny', isLabel: true, type: 'DatePicker', range: true, format: 'yyyyMM', picker: 'month', allowClear: false },
      { label: '境外收货人', name: 'jwshrmc', type: 'Input', isLabel: true, searchButton: true }
    ];
    myConfig.grid_filter_quick[0].defaultValue = myUtil.date.getDateYearAgoToNow(1).map((d: string) => dayjs(d));
  }

  const drawerRef: any = useRef();
  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(drawerRef);
    return otherRef;
  };

  return <>
    <DDBunit2 config={myConfig} func={Func} />
    <DrawerList onRef={drawerRef} />
  </>
};
export default index;