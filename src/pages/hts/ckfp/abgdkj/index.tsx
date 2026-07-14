import dayjs from 'dayjs';
import React, { useRef, useEffect , } from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import abgdkjConfig from './config';
import abgdkjFunc from './f';
import ModalSsflbm from './modal_setSsflbm';
import ModalGmf from './modal_setGmf';
import ModalHl from './modal_setHl';
import ModalFpsq from './modal_setScfpsq';
import ModalBj from './modal_setBj';
import ModalHqbgd from './modal_hqbgd';

import { history, useAccess } from 'umi';
import { queryParams } from '@/pages/hts/services/htsApi';
import myUtil from '@/components/DDAssist/util';
// 顺络
import slConfig from './slConfig';
import { cloneDeep } from 'lodash';
import moment from 'moment';


const abgdkjIndx: React.FC<unknown> = () => {
  const access = useAccess(); // 权限

  const ssflbmRef: any = useRef();
  const gmfRef: any = useRef();
  const hlRef: any = useRef();
  const fpsqRef: any = useRef();
  const bjRef: any = useRef();
  const hqbgdRef: any = useRef();

  abgdkjFunc.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(ssflbmRef);
    otherRef.push(gmfRef);
    otherRef.push(hlRef);
    otherRef.push(fpsqRef);
    otherRef.push(bjRef);
    otherRef.push(hqbgdRef);

    
    return otherRef;
  };
  useEffect(() => {
    // 获取购买方数据集合
    queryParams({ key: 'GFCX_CS_ZXSB_FPKJ_KHGLPZ', searchModel: [{ property: 'qybz', value: 'Y', op: 'rl' }], }).then((response) => {
      const { code, body } = response;
      if (code === '200') {
        const temp: any = [];
        body.forEach((item: any) => {
          temp.push(Object.assign(item, { code: item.khuuid, name: item.ghfnsrmc }));
        })
        myUtil.code.saveCodeToLocalTable('CODE_CKFP_ABGDKJ_GMFMC',temp,'01');
      }
    });

  }, [])

  // 改变默认配置项
  let myConfig = cloneDeep(abgdkjConfig);

  const temp = myUtil.code.getCode('CODE_CS_ZXSB_FPKJ_CSPZ:01');
  //如果是默认全电票配置，只能显示18位报关单开票
  // if(temp.length>0 && temp[0].fpzlDm1 == '5') {
  //     myConfig.grid_filter_quick = [
  //       {
  //         name: 'bgdlx',
  //         type: 'Select',
  //         defaultValue: '1',
  //         onChange: 'handleOnChangeBgd',
  //         op: 'zdy',
  //         list: [
  //           { label: '按18位报关单开票', value: '1', },
  //         ],
  //       },
  //     ];
  //     myConfig.customer_toolbar = [
  //       { name: '获取报关单', key: 'abgdkjHqbgd', func: 'abgdkjHqbgd' },
  //       { name: '生成开票申请单', func: 'btnScfpspd' },
  //       {
  //         name: '批量设置',
  //         type: 'dropdown',
  //         list: [
  //           { name: '税收分类编码', func: 'btnSetSsflbm' },
  //           { name: '购买方', func: 'btnSetGmf' },
  //           { name: '汇率', func: 'btnSetHl' },
  //           { name: '暂不开票', func: 'zbkp' },
  //         ],
  //       },
  //     ];
  // } else {
  //   abgdkjConfig.customer_toolbar = [
  //     { name: '获取报关单', key: 'abgdkjHqbgd', func: 'abgdkjHqbgd' },
  //     { name: '生成开票申请单', func: 'btnScfpspd' },
  //     { name: '编辑开票', func: 'btnBjkp', key: 'btnBjkpKey' },
  //     {
  //       name: '批量设置',
  //       type: 'dropdown',
  //       list: [
  //         { name: '税收分类编码', func: 'btnSetSsflbm' },
  //         { name: '购买方', func: 'btnSetGmf' },
  //         { name: '汇率', func: 'btnSetHl' },
  //         { name: '暂不开票', func: 'zbkp' },
  //       ],
  //     },
  //   ];
  // }

  if (access.isNsrsbh) {
    myConfig = cloneDeep(slConfig);
    myConfig.gridParams = { // 默认查询参数
      initSearchModal: [
        { property: 'bgdlx', value: '2', op: 'al' },
      ],
    };
  } else {
    if (history?.location?.pathname === '/hts/ckfp/abgdkj21') {
      myConfig.grid_columns = [
        {
          title: '数据状态',
          dataIndex: 'ckfpkjsjztDm',
          width: 150,
          render: { func: 'renderAbgdkjSjzt' },
          fixed: 'left',
          filter: {
            type: 'Select',
            list: [
              { text: '可以开具发票数据', value: '1' },
              { text: '缺少购买方信息数据', value: '2' },
              { text: '缺少税收分类编码数据', value: '3' },
              { text: '暂不开票数据', value: '5' },
            ],
          },
        },
        {
          title: '结关状态',
          dataIndex: 'bgsbztDm',
          width: 100,
          fixed: 'left',
          render: { func: 'renderBgsbztDm' },
          filter: {
            type: 'Radio',
            list: [
              { text: '全部', value: '' },
              { text: '已结关', value: '10' },
              { text: '未结关', value: '11' },
            ],
          },
        },
        {
          title: '报关单号/统一编号',
          dataIndex: 'bgdhgbh',
          width: 170,
          sorter: true,
          fixed: 'left',
          render: { func: 'renderAgdhgbh' },
        },
        {
          title: '21位出口报关单号',
          dataIndex: 'ckbgdh',
          hidden: true
        },
        {
          title: '项号',
          dataIndex: 'hwxh',
          width: 80,
          sorter: true,
          fixed: 'left',
        },
        {
          title: '购买方名称',
          dataIndex: 'khuuid',
          width: 180,
          ellipsis: true,
          editable: true,
          showSearch: true,
          editType: 'Select',
          className: 'dd_editable_column',
          func: 'selectChangeGmfmc',
          codeTable: 'CODE_CKFP_ABGDKJ_GMFMC:01'
        },
        { title: '出口日期', dataIndex: 'ckrq1', width: 120, sorter: true },
        { title: '申报日期', dataIndex: 'hgckhwbgdsbrq', width: 120, sorter: true },
        { title: '商品代码', dataIndex: 'hgckspDm', width: 120 },
        { title: '海关商品名称', dataIndex: 'hgspmc', width: 150, ellipsis: true },
        { title: '规格型号', dataIndex: 'ggxh', width: 150, ellipsis: true },
        { title: '成交单位', dataIndex: 'sbjldwmc', width: 100, ellipsis: true  },
        { title: '成交单位数量', dataIndex: 'sbsl1', width: 130, render: { type: 'number', format: '0,0.00000' } },
        { title: '法定单位', dataIndex: 'hgjldwmc', width: 100, ellipsis: true },
        { title: '法定单位数量', dataIndex: 'cksl', width: 130, render: { type: 'number', format: '0,0.00000' } },
        { title: '成交方式', dataIndex: 'hgcjfsmc', width: 100,
          filter: {
            type: 'Select',
            codeTable: 'code_dm_ckts_hgcjfs_mc:01',
          },
        },
        { title: '成交币制', dataIndex: 'hbzmDm', width: 70 },
        { title: '成交金额', dataIndex: 'cjzj', width: 100, align: 'right', sorter: true, render: { type: 'number', format: '0,0.00' } },
        { title: '原币汇率', dataIndex: 'cjhbhl', width: 90, align: 'right', render: { type: 'number', format: '0,0.00000' } },
        { title: '人民币成交价', dataIndex: 'rmbcjzj', width: 120, align: 'right', sorter: true, render: { type: 'number', format: '0,0.00' } },
        {
          title: '人民币离岸价',
          dataIndex: 'rmblaj',
          width: 120,
          align: 'right',
          sorter: true,
          render: { type: 'number', format: '0,0.00' },
        },
        {
          title: '剩余成交金额',
          dataIndex: 'sycjzj',
          width: 120,
          align: 'right',
          sorter: true,
          render: { type: 'number', format: '0,0.00' },
        },
        {
          title: '美元成交价',
          dataIndex: 'mycjzj',
          width: 120,
          align: 'right',
          sorter: true,
          render: { type: 'number', format: '0,0.00' },
        },
        {
          title: '美元离岸价',
          dataIndex: 'mylaj',
          width: 120,
          align: 'right',
          sorter: true,
          render: { type: 'number', format: '0,0.00' },
        },
        { title: '合同协议号', dataIndex: 'ckhth', ellipsis: true, width: 180 },
        { title: '监管方式', dataIndex: 'jgfsmc', width: 120, ellipsis: true, },
      ];
      myConfig.module_key = 'FPZS_BGDKP_DKP21WBGDCX';
      myConfig.api_grid_query = `/yw/fpzs/bgdkp/dkpbgdfycx`;
      myConfig.grid_row_key = 'ckbgdh';
      // 配置项：列表筛选项
      slConfig.filter_items = [
        { name: 'bgdhgbh', label: '18位或后4位报关单号/统一编号', type: 'InputTags' },
        { name: 'ckhth', label: '合同协议号', type: 'Input' },
        { name: 'ckrq1', label: '出口日期', type: 'DatePicker', range: true },
        { name: 'hgckhwbgdsbrq', label: '申报日期', type: 'DatePicker', range: true },
        { name: 'hgckspDm', label: '商品代码', type: 'Input', op: 'al' },
        { name: 'hgspmc', label: '海关商品名称', type: 'Input', op: 'al' },
        { name: 'hgcjfsDm', label: '成交方式', type: 'Input' },
      ];
      // 默认选中21位关单
      myConfig.grid_filter_quick = [
        {
          name: 'bgdlx',
          type: 'Select',
          defaultValue: '2',
          op: 'zdy',
          onChange: 'handleOnChangeBgd',
          list: [
            { label: '按18位报关单开票', value: '1', },
            { label: '按21位报关单开票', value: '2' },
          ],
        },
      ];
      // 配置项：工具栏
      myConfig.toolbar_default = {
        setting: true,
        full: true,
        reload: true,
        delete: false
      };
    }
  }
 

  if(history.location.query) {
    const query = history.location.query;
    if(query){
      let bgdhgbh = query.bgdhgbh;
      const ckhth = query.ckhth;
      if(bgdhgbh){
        if(typeof(bgdhgbh)=='string'){
          bgdhgbh = [bgdhgbh];
        }
        myConfig.filter_items[0].defaultValue = bgdhgbh;
      }
      if(ckhth){
        myConfig.filter_items[1].defaultValue = ckhth;
      }
      const jgfsDm= query.jgfsDm;
      if(jgfsDm){
        myConfig.filter_items[4].defaultValue = jgfsDm;
      }


      const ckrq1= query.ckrq1;
      let timeQ ;
      let timeZ ;
      if(ckrq1){
        timeQ = dayjs(myUtil.date.formatDate(ckrq1[0]));
        timeZ = dayjs(myUtil.date.formatDate(ckrq1[1]));
        myConfig.filter_items[2].defaultValue = [timeQ,timeZ];
      }
      const hgckhwbgdsbrq= query.hgckhwbgdsbrq;
      if(hgckhwbgdsbrq){
        timeQ = dayjs(myUtil.date.formatDate(hgckhwbgdsbrq[0]));
        timeZ = dayjs(myUtil.date.formatDate(hgckhwbgdsbrq[1]));
        myConfig.filter_items[3].defaultValue = [timeQ,timeZ];
      }
    }
  }

  return (
    <>
      <DDBunit2 config={myConfig} func={abgdkjFunc} />
      <ModalSsflbm onRef={ssflbmRef} />
      <ModalGmf onRef={gmfRef} />
      <ModalHl onRef={hlRef} />
      <ModalFpsq onRef={fpsqRef} />
      <ModalBj onRef={bjRef} />
      <ModalHqbgd onRef={hqbgdRef} />
    </>
  );
};
export default abgdkjIndx;
