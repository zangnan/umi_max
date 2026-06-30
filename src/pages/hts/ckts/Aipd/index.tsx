import React, { useState, useEffect, } from 'react';
import { Spin, Form, message } from 'antd';
import ProCard from '@ant-design/pro-card';
import './style.less';
import myUtil from '@/components/DDAssist/util';
import { queryPager, cxsxx, ppjsc, downloadTemplate } from '@/pages/hts/services/htsApi';
import moment from 'moment';
import DownGrid from './mxGrid';
import TopQueryMore from './topQueryMore';
import TopQuery from './topQuery';
import Ppjscgz from './ppjsc';
import BgdGrid from './bgdGrid';
import FpGrid from './fpGrid';
import { intl as intl2 } from '@/components/DDAssist/util';
import DDAlert from '@/pages/hts/components/DDAlert';
import { VerticalAlignTopOutlined, VerticalAlignMiddleOutlined } from '@ant-design/icons';



const MtsZnpd: React.FC<unknown> = () => {

  const [keyLeft, setKeyLeft] = useState<any>('SAAS_TSSB_MTS_AIPD_CKBGD_CX');
  const [keyRight, setKeyRight] = useState<any>('SAAS_TSSB_MTS_AIPD_ZZSFP_CX');
  const [bgdxx, setBgdxx] = useState<any>();
  const [zzsfpxx, setZzsfpxx] = useState<any>();
  const [leftSearchForm] = Form.useForm();
  const [rightSearchForm] = Form.useForm();
  const [fpForm] = Form.useForm();
  const [formDown] = Form.useForm();

  // 主列表
  const [disFlag, setDisFlag] = useState<any>(true);
  // 主列表筛选
  const [sxModal, setSxModal] = useState<any>(false);
  // 主列表masker
  const [masker, setMasker] = useState<any>(false);
  // 主列表筛选项
  const [zlbsx, setZlbsx] = useState<any>([]);
  // 主查询formset
  const [searchForm] = Form.useForm();
  const [searchForm2] = Form.useForm();
  // 主列表searchModal
  const [zlbSearchModal, setZlbSearchModal] = useState<any>([]);
  // 左侧分页
  const [leftPagination, setLeftPagination] = useState<any>();

  // 左侧报关单form
  const [bgdForm] = Form.useForm();
  // 左侧报关单勾选
  const [selectBgdRowKeys, setSelectBgdRowKeys] = useState<any>([]);
  // 左侧报关单勾选
  const [selectBgdRows, setSelectBgdRows] = useState<any>([]);
  // 左侧报关单数据     
  const [dataLeft, setDataLeft] = useState<any>([]);
  // 左侧masker
  const [leftMasker, setLeftMasker] = useState<any>(false);
  // 左侧查询条件
  const [leftsx, setLeftsx] = useState<any>([]);


  // 右侧列表数据
  const [dataRight, setDataRight] = useState<any>([]);
  // 匹配及生成
  const [ppscModal, setPpscModal] = useState<any>(false);
  // 匹配规则form
  const [ppgzForm] = Form.useForm();
  // 匹配规则
  const [ppgzZc, setPpgzZc] = useState<any>();
  // 右侧发票勾选
  const [selectFpRowKeys, setSelectFpRowKeys] = useState<any>([]);
  // 右侧发票勾选
  const [selectFpRows, setSelectFpRows] = useState<any>([]);
  // 右侧masker
  const [rightMasker, setRightMasker] = useState<any>(false);
  // 生成规则form
  const [ssgzForm] = Form.useForm();
  // 右侧查询条件
  const [rightsx, setRightsx] = useState<any>([]);
  const [rightPagination, setRightPagination] = useState<any>();


  // 生成规则业务类型
  const [ywlxData, setYwlxData] = useState<any>([]);
  // 匹配规则默认
  const [ppgzMasker, setPpgzMasker] = useState<any>(false);

  // 底部列表用
  // 底部所属期批次
  const [ssqpc, setSsqpc] = useState<any>();
  const [pduuid, setPduuid] = useState<any>();
  const [selectMxRowKeys, setSelectMxRowKeys] = useState<any>([]);
  const [selectMxRows, setSelectMxRows] = useState<any>([]);


  // 底部列表
  const [downGrid, setDownGrid] = useState<any>();
  const [loading, setLoading] = useState<any>(false);

  const [downPagination, setDownPagination] = useState<any>();


  const [percentNum, setPercentNumn] = useState<any>(0);

  const pagination = {
    current: 1,
    pageSize: 5,
    total: 0,
    size: 'default',
    showLessItems: true,
    hideOnSinglePage: false,
    showSizeChanger: true,
    showQuickJumper: false,
    pageSizeOptions: [5, 10, 20],
    showTotal(total: any, range: any[]) {
      return `共${total}条，当前${range[0]}到${range[1]}条`;
    },
  };



  // 初始化执行
  useEffect(() => {
    myUtil.sessionStore.setItem('numTimeBgddy', 1);
    myUtil.localStore.setItem("bgdflag", "1");
    myUtil.localStore.setItem("fpflag", "1");
    myUtil.localStore.setItem('ybChange', []);
    myUtil.localStore.setItem('jgbChange', []);
    myUtil.localStore.setItem('hhcbhlxx', 0);
    myUtil.localStore.setItem('hhcbhlsx', 0);
    myUtil.localStore.setItem('datarightChange', []);


    const promiseArr: any = [myUtil.code.getCodeFromServerT1('code_dm_ckts_cktmsywlx:10')];
    Promise.all(promiseArr).then(() => {
    }).catch(() => {
      message.error('获取码表失败');
    }).finally(() => {
      const tmpCodeTable: any = myUtil.code.getSelectOption('code_dm_ckts_cktmsywlx', '10');
      setYwlxData(tmpCodeTable);
    });

    setDisFlag(true);
    setRightPagination(pagination);
    setLeftPagination(pagination);
    setDownPagination(pagination);
    cxsxx({ "cxlx": "01" }).then((res2: any) => {
      if (res2.code === '200') {
        setZlbsx(res2.body);
      } else {
        message.error(res2.msg);
      }
    });
  }, []);

  useEffect(() => {
    const xsflag = myUtil.localStore.getItem('bgdflag');
    if ("1" == xsflag) {
      if (selectBgdRows?.length == 0) {
        setBgdxx(`合计 共0条数据 可用法定单位数量0 可用第二单位数量0 可用成交数量0`);
      } else {
        setBgdxx(`合计 共${selectBgdRows?.length}条数据 可用法定单位数量${sumByProperty(selectBgdRows, 'kyCksl')} 可用第二单位数量${sumByProperty(selectBgdRows, 'kyDecksl')}  可用成交数量${sumByProperty(selectBgdRows, 'kycjsl')}  `);
      }
    }
    myUtil.localStore.setItem('bgdflag', '1');
  }, [selectBgdRows]);

  useEffect(() => {
    const xsflag = myUtil.localStore.getItem('fpflag');
    if ("1" == xsflag) {
      if (selectFpRows?.length == 0) {
        setZzsfpxx(`合计 共0条数据 剩余发票数量0 剩余金额0.00`);
      } else {
        setZzsfpxx(`合计 共${selectFpRows?.length}条数据 剩余发票数量${sumByProperty(selectFpRows, 'kysl')} 剩余金额${sumByProperty(selectFpRows, 'kyje')}   `);
      }
    }
    myUtil.localStore.setItem('fpflag', '1');
  }, [selectFpRows]);

  useEffect(() => {
    setSelectBgdRowKeys([]);
  }, [keyLeft]);

  useEffect(() => {
    setSelectFpRowKeys([]);
  }, [keyRight]);

  // 求和函数
  const sumByProperty = (arr: any[], prop: string | number) => {
    return arr.reduce((total: any, item: { [x: string]: any; }) => (total * 100000 + item[prop] * 100000) / 100000, 0);
  }


  // 主列表-匹配生成保存
  const ppscSave = async () => {
    await ssgzForm.validateFields();
    const param = {};
    if (keyLeft == 'SAAS_TSSB_MTS_AIPD_CKBGD_CX') {
      param.sjlybgd = "01";
    } else {
      param.sjlybgd = "02"
    }
    if (keyRight == 'SAAS_TSSB_MTS_AIPD_ZZSFP_CX') {
      param.sjlyfp = "01";
    } else {
      param.sjlyfp = "02"
    }
    // 1.左右两个查询必须有值
    if (dataLeft.length == 0 || dataRight.length == 0) {
      message.info('报关单或发票必须有数据才可进行匹配！');
      return;
    }
    // 2.左侧是否有勾选
    const bgdSj = {};
    if (selectBgdRowKeys?.length > 0) {
      bgdSj.uuids = [...selectBgdRowKeys];
    } else {
      const querys = await getSxtj('zlb');
      const querys2 = await getSxtj('bgd');
      bgdSj.searchModel = [...querys, ...querys2];
    }
    param.bgdSj = bgdSj;
    // 3.右侧是否有勾选

    const zzsfpSj = {};
    if (selectFpRowKeys?.length > 0) {
      zzsfpSj.uuids = [...selectFpRowKeys];
    } else {
      const querys = await getSxtj('zlb');
      const querys2 = await getSxtj('fp');
      zzsfpSj.searchModel = [...querys, ...querys2];
    }
    param.zzsfpSj = zzsfpSj;
    let ppgzV = ppgzForm.getFieldsValue();
    // let sybz = ppgzV?.sydwglddzgxpdbz;
    ppgzV.qdgfhppbz = ppgzV?.qdgfhppbz?.length > 0 ? "Y" : "N";;
    ppgzV.zzbgddyzzfpyxppbz = ppgzV?.zzbgddyzzfpyxppbz?.length > 0 ? "Y" : "N";
    ppgzV.bgdggxhbhfpggxhbz = ppgzV?.bgdggxhbhfpggxhbz?.length > 0 ? "Y" : "N";
    if (!ppgzV?.fpppsxDm) {
      ppgzV = ppgzZc;
    }
    if (ppgzV.pdppmsDm == '1' && ppgzV.aipdsxzdDms?.length == 0) {
      message.info('精准匹配时，发票备注包含出口报关单字段必须有勾选！');
      return;
    }
    param.ppgz = ppgzV;
    const ssgzV = ssgzForm.getFieldsValue();
    const cktmsywlxmcjh: any = [];
    for (let i = 0; i < ssgzV?.cktmsywlxdmjh?.length; i++) {
      ywlxData?.map((item: any, index: number) => {
        if (item?.value == ssgzV?.cktmsywlxdmjh[i]) {
          cktmsywlxmcjh.push(item?.name);
        }
      })
    }
    ssgzV.cktmsywlxmcjh = cktmsywlxmcjh?.join(',');
    ssgzV.cktmsywlxdmjh = ssgzV?.cktmsywlxdmjh?.join(',');
    param.scgz = ssgzV;
    let array = myUtil.localStore.getItem('datarightChange');
    param.yxgfpSj = [...array ||[] ];

    // if (keyRight == 'SAAS_TSSB_MTS_AIPD_ZZSFP_CX') {
    //   param.yxgfpSj = [...myUtil.localStore.getItem('ybChange') ||[] ];
    // } else {
    //   param.yxgfpSj = [...myUtil.localStore.getItem('jgbChange')||[] ];

    // }
    ssgzV.hhcbhlxx = myUtil.localStore.getItem('hhcbhlxx');
    ssgzV.hhcbhlsx = myUtil.localStore.getItem('hhcbhlsx');

    // 还差调整后的发票集合
    if (!ssgzV?.hhcbbz) {
      message.info('请选择换汇成本标志！');
      return;
    }
    setPercentNumn(1);
    // 设置间隔为2000毫秒（2秒）
    let doTime = setInterval(function () {
      let timeNum = myUtil.sessionStore.getItem('numTimeBgddy');
      // 进度条
      // 1秒10条
      if (timeNum <= 90) {
        timeNum = timeNum + 3;
        myUtil.sessionStore.setItem('numTimeBgddy', timeNum);
        setPercentNumn(timeNum);
      }
    }, 1000);
    setPpgzMasker(true);
    ppjsc(param).then(async (res: any) => {
      let array = myUtil.localStore.getItem('datarightChange');
      for(let i = 0;i<array?.length;i++){
        array[i].flag = '1';
      }
      myUtil.localStore.setItem('datarightChange',array);
      clearInterval(doTime);
      setPercentNumn(0);
      myUtil.sessionStore.setItem('numTimeBgddy', 1);
      setPpgzMasker(false);
      const { code, body, msg } = res;
      if (code === '200') {
        myUtil.localStore.setItem("bgdflag", "2");
        myUtil.localStore.setItem("fpflag", "2");
        const ssqpc = { ssq: body?.ssq, sbpc: body?.sbpc };
        setSsqpc(ssqpc);
        setPduuid(body?.pduuid);
        // 2、查询
        setPpscModal(false);
        await bgdSx('SAAS_TSSB_MTS_AIPD_CKBGD_PDJG_CX', '1');
        await fpSx('SAAS_TSSB_MTS_AIPD_ZZSFP_PDJG_CX', '1');
        setDisFlag(false);
        mxSx(downPagination, { ssq: body?.ssq, sbpc: body?.sbpc }, body?.pduuid);
        setBgdxx(`合计  共${body?.bgdxx?.bgdts}条数据 匹配成功关单${body?.bgdxx?.bgdcgts}条数据 参与匹配商品码${body?.bgdxx?.spmgs}个`);
        setZzsfpxx(`合计  共${body?.zzsfpxx?.fpts}条数据 匹配成功发票${body?.zzsfpxx?.fpcgts}条数据 参与匹配商品码${body?.zzsfpxx?.spmgs}个`);
        setSelectFpRowKeys([]);
        setSelectFpRows([]);
        setSelectBgdRowKeys([]);
        setSelectBgdRows([]);
        if (body?.bgdxx?.bgdcgts > 0 && body?.zzsfpxx?.fpcgts > 0) {
          message.success('匹配及生成成功！');
        } else {
          message.success('未找到满足匹配条件的数据！');
        }
      } else {
        myUtil.localStore.setItem('datarightChange',array);
        message.error(msg);
      }
    })

  }

  //主列表 -  查询
  const handlerZnpdsearch = async (flag: any) => {
    let bgdkey = 'SAAS_TSSB_MTS_AIPD_CKBGD_CX';
    let fpkey = 'SAAS_TSSB_MTS_AIPD_ZZSFP_CX';
    if (flag == '2') {
      bgdkey = 'SAAS_TSSB_MTS_AIPD_CKBGD_PDJG_CX';
      fpkey = 'SAAS_TSSB_MTS_AIPD_ZZSFP_PDJG_CX';
      // if('SAAS_TSSB_MTS_AIPD_CKBGD_PDJG_CX' != keyLeft){
      //   setSelectBgdRowKeys([]);
      // }
      // if('SAAS_TSSB_MTS_AIPD_ZZSFP_PDJG_CX' != keyRight){
      //   setSelectFpRowKeys([]);
      // }
    }
    if (flag == '1') {
      // if('SAAS_TSSB_MTS_AIPD_CKBGD_CX' != keyLeft){
      //   setSelectBgdRowKeys([]);
      // }
      // if('SAAS_TSSB_MTS_AIPD_ZZSFP_CX' != keyRight){
      //   setSelectFpRowKeys([]);
      // }
    }
    setSelectBgdRows([]);
    setSelectBgdRowKeys([]);
    setSelectFpRows([]);
    setSelectFpRowKeys([]);

    const querys = await getSxtj('zlb');
    const querys2 = await getSxtj('bgd');
    const querys3 = await getSxtj('fp');

    if (querys?.length == 1 && querys2?.length == 0 && querys3?.length == 0) {
      message.info('请输入筛选条件!');
      return;
    } else if (querys?.length == 1 && querys2?.length == 0) {
      message.info('请输入报关单筛选条件!');
      return;
    } else if (querys?.length == 1 && querys3?.length == 0) {
      message.info('请输入发票选条件!');
      return;
    }
    setBgdxx(`合计 共0条数据 可用法定单位数量0 可用第二单位数量0 可用成交数量0`);
    setZzsfpxx(`合计 共0条数据 剩余发票数量0 剩余金额0.00`);
    const param = {
      key: bgdkey,
      searchModel: [...querys, ...querys2],
      page: 1,
      pageSize: leftPagination.pageSize,
      orderModel: [{ field: "ckrq1", order: "asc" }, { field: "ckbgdh", order: "asc" }]
    };
    setLeftMasker(true);
    setKeyRight(fpkey);
    setKeyLeft(bgdkey);
    queryPager(param).then((res) => {
      const { code, body } = res;
      setLeftMasker(false);
      if (code == '200') {
        if (body?.rowCount > 1000) {
          message.info('当前筛选条件下报关单数据超出1000条，请重新设置筛选条件');
          return;
        } else {
          setDataLeft(body?.rows);
          const bgdPagination = { ...leftPagination };
          setLeftPagination(Object.assign(bgdPagination, {
            total: body?.rowCount,
            page: body?.page,
            pageSize: leftPagination.pageSize,
          }));
          setDataLeft(body?.rows);
        }
      }
    });

    const paramfp = {
      key: fpkey,
      searchModel: [...querys, ...querys3],
      page: 1,
      pageSize: rightPagination.pageSize,
    };
    setRightMasker(true);
    queryPager(paramfp).then((res2) => {
      const { code, body } = res2;
      setRightMasker(false);
      if (code == '200') {
        if (body?.rowCount > 2000) {
          message.info('当前筛选条件下发票数据超出2000条，请重新设置筛选条件');
          return;
        } else {
          const resBody = [...body?.rows];
          let array = myUtil.localStore.getItem('datarightChange');
         const hh = [];
          for (let i = 0; i < array?.length; i++) {
            if (array[i].flag == '0') {
              for (let j = 0; j < resBody.length; j++) {
                if (array[i].jhpzh + array[i].hh == resBody[j].jhpzh + resBody[j].hh) {
                  resBody[j].npdsl = array[i]?.npdsl;
                  resBody[j].kysl = array[i]?.kysl;
                  resBody[j].sl3 = array[i]?.sl3;
                  resBody[j].jldwmc = array[i]?.jldwmc;
                  hh.push(resBody[j]);
                }
              }
            } else {
              for (let j = 0; j < resBody.length; j++) {
                if (array[i].jhpzh + array[i].hh == resBody[j].jhpzh + resBody[j].hh && resBody[j].fpfxbz == 'Y') {
                  resBody[j].npdsl = array[i]?.npdsl;
                  resBody[j].kysl = array[i]?.kysl;
                  resBody[j].sl3 = array[i]?.sl3;
                  resBody[j].jldwmc = array[i]?.jldwmc;
                  hh.push(resBody[j]);
                }if (array[i].jhpzh + array[i].hh == resBody[j].jhpzh + resBody[j].hh && resBody[j].fpfxbz != 'Y') {
                  array[i].npdsl = resBody[j]?.npdsl ;
                  array[i].kysl = resBody[j]?.kysl;
                  array[i].sl3 = resBody[j]?.sl3;
                  array[i].jldwmc = resBody[j]?.jldwmc;
                }
              }
            }
          }
          // if (fpkey == 'SAAS_TSSB_MTS_AIPD_ZZSFP_CX') {
          //   myUtil.localStore.setItem('ybChange',hh);
          // } else {
          //   myUtil.localStore.setItem('jgbChange',hh);
          // }
          setDataRight(resBody);
          const fpPagination = { ...rightPagination };
          setRightPagination(Object.assign(fpPagination, {
            total: body?.rowCount,
            page: body?.page,
            pageSize: rightPagination.pageSize,
          }));
          myUtil.localStore.setItem('datarightLocal', resBody);
          myUtil.localStore.setItem('datarightChange',array);

        }
      }
    });
  }

  // 匹配及生成-打开页面
  const handlerZnpd = () => {
    setPpscModal(true);
  }

  // 重置
  const handlerZnpdReset = () => {
    setPercentNumn(0);
    myUtil.localStore.setItem('datarightChange',[]);
    setRightPagination(pagination);
    setLeftPagination(pagination);
    setDownPagination(pagination);
    myUtil.sessionStore.setItem('numTimeBgddy', 1);
    myUtil.localStore.setItem("bgdflag", "1");
    myUtil.localStore.setItem("fpflag", "1");
    setBgdxx(`合计 共0条数据 可用法定单位数量0 可用第二单位数量0  可用成交数量0`);
    setZzsfpxx(`合计 共0条数据 剩余发票数量0 剩余金额0.00`);
    myUtil.localStore.setItem('datarightLocal', []);
    myUtil.localStore.setItem('ybChange', []);
    myUtil.localStore.setItem('jgbChange', []);
    searchForm.resetFields();
    searchForm2.resetFields();
    leftSearchForm.resetFields();
    bgdForm.resetFields();
    rightSearchForm.resetFields();
    fpForm.resetFields();
    formDown.resetFields();
    setDataLeft([]);
    setDataRight([]);
    setDisFlag(true);
    setSsqpc({});
    setPduuid('');
    setDownGrid([]);
    setKeyLeft('SAAS_TSSB_MTS_AIPD_CKBGD_CX');
    setKeyRight('SAAS_TSSB_MTS_AIPD_ZZSFP_CX');
    setZlbSearchModal([]);
    setLeftsx([]);
    setRightsx([]);
  }

  // 左侧报关单筛选
  const bgdSx = async (keys: any, flag: any) => {
    const querys = await getSxtj('bgd');
    const querys2 = await getSxtj('zlb');
    if (querys?.length == 0 && querys2?.length == 1) {
      message.info('请输入筛选条件!');
      return;
    }
    const param = {
      key: keys,
      searchModel: [...querys, ...querys2],
      page: flag == '1' ? 1 : leftPagination.current,
      pageSize: leftPagination.pageSize,
      orderModel: [{ field: "ckrq1", order: "asc" }, { field: "ckbgdh", order: "asc" }]
    };
    setLeftMasker(true);
    queryPager(param).then((res) => {
      setKeyLeft(keys);
      const { code, body } = res;
      setLeftMasker(false);
      if (code == '200') {
        if (body?.rowCount > 1000) {
          message.info('当前筛选条件下数据超出1000条，请重新设置筛选条件');
        } else {
          if ('1' == flag) {
            setSelectBgdRowKeys([]);
            setSelectBgdRows([]);
            const bgdpagination = { ...pagination };
            setLeftPagination(Object.assign(bgdpagination, {
              total: body?.rowCount,
              page: body?.page,
              pageSize: leftPagination.pageSize,
            }));
          } else {
            const bgdPagination = { ...leftPagination };
            setLeftPagination(Object.assign(bgdPagination, {
              total: body?.rowCount,
              page: body?.page,
              pageSize: leftPagination.pageSize,
            }));
          }
          setDataLeft(body?.rows);
        }
      }
    });
  }

  // 右侧发票筛选
  const fpSx = async (key: any, flag: any) => {
    const querys = await getSxtj('fp');
    const querys2 = await getSxtj('zlb');
    if (querys?.length == 0 && querys2?.length == 1) {
      message.info('请输入筛选条件!');
      return;
    }
    if (querys?.length == 0 && querys2?.length == 1) {
      message.info('请输入筛选条件!');
      return;
    }
    const param = {
      key: key,
      searchModel: [...querys, ...querys2],
      page: flag == '1' ? 1 : rightPagination.current,
      pageSize: rightPagination.pageSize,
    };
    setRightMasker(true);
    queryPager(param).then((res) => {
      setKeyRight(key);
      const { code, body } = res;
      setRightMasker(false);
      if (code == '200') {
        if (body?.rowCount > 2000) {
          message.info('当前筛选条件下数据超出2000条，请重新设置筛选条件');
        } else {
          const resBody = [...body?.rows];
          let array = myUtil.localStore.getItem('datarightChange');
          for (let i = 0; i < array?.length; i++) {
            if (array[i].flag == '0') {
              for (let j = 0; j < resBody.length; j++) {
                if (array[i].jhpzh + array[i].hh == resBody[j].jhpzh + resBody[j].hh) {
                  resBody[j].npdsl = array[i].npdsl;
                  resBody[j].kysl = array[i].kysl;
                  resBody[j].sl3 = array[i].sl3;
                  resBody[j].jldwmc = array[i].jldwmc;
                }
              }
            } else {
              for (let j = 0; j < resBody.length; j++) {
                if (array[i].jhpzh + array[i].hh == resBody[j].jhpzh + resBody[j].hh && resBody[j].fpfxbz == 'Y') {
                  resBody[j].npdsl = array[i]?.npdsl;
                  resBody[j].kysl = array[i]?.kysl;
                  resBody[j].sl3 = array[i]?.sl3;
                  resBody[j].jldwmc = array[i]?.jldwmc;
                }
                if (array[i].jhpzh + array[i].hh == resBody[j].jhpzh + resBody[j].hh && resBody[j].fpfxbz != 'Y') {
                  array[i].npdsl = resBody[j]?.npdsl ;
                  array[i].kysl = resBody[j]?.kysl;
                  array[i].sl3 = resBody[j]?.sl3;
                  array[i].jldwmc = resBody[j]?.jldwmc;
                }
              }
            }
          }
          myUtil.localStore.setItem('datarightChange',array);
          myUtil.localStore.setItem('datarightLocal', resBody);
          if ('1' == flag) {
            setSelectFpRowKeys([]);
            setSelectFpRows([]);
            const fpPagination = { ...pagination };
            setRightPagination(Object.assign(fpPagination, {
              total: body?.rowCount,
              page: body?.page,
              pageSize: rightPagination.pageSize,
            }));
          } else {
            const fpPagination = { ...rightPagination };
            setRightPagination(Object.assign(fpPagination, {
              total: body?.rowCount,
              page: body?.page,
              pageSize: rightPagination.pageSize,
            }));
          }
          setDataRight(resBody);
        }
      }
    });
  }
  // 明细筛选
  const mxSx = (p: any, ssqpc: any, pduuid: any) => {
    const querys = [];
    querys.push({ "property": "ssq", "value": ssqpc?.ssq, "op": "zdy" });
    querys.push({ "property": "sbpc", "value": ssqpc?.sbpc, "op": "zdy" });
    querys.push({ "property": "pduuid", "value": pduuid, "op": "zdy" });
    if (formDown.getFieldsValue().glh) {
      querys.push({ "property": "glh", "value": formDown.getFieldsValue().glh, "op": "zdy" });
    }
    if (formDown.getFieldsValue().sbhgspmc) {
      querys.push({ "property": "sbhgspmc", "value": formDown.getFieldsValue().sbhgspmc, "op": "zdy" });
    }
    const param = {
      key: "SAAS_TSSB_MTS_AIPD_CKMX_CX",
      searchModel: querys,
      page: p.current,
      pageSize: downPagination.pageSize,
    };
    setLoading(true);
    queryPager(param).then((res) => {
      const { code, body } = res;
      setLoading(false);
      if (code == '200') {
        // const bgdPagination = { ...downPagination };
        setDownPagination(Object.assign(p, {
          total: body?.rowCount,
          page: body?.page,
          pageSize: downPagination.pageSize,
        }));
        setDownGrid(body?.rows);
      }
    });
  }

  // 获取筛选条件
  const getSxtj = async (flag: any) => {
    const querys = [];
    if (flag == 'zlb') {
      //主列表
      const temp1 = await searchForm.getFieldValue("dyjList") || [];
      const temp2 = await searchForm2.validateFields();
      if (temp2?.ckspmc) {
        querys.push({ "property": "ckspmc", "value": temp2?.ckspmc, "op": "zdy" });
      }
      if (temp2?.ppgz) {
        querys.push({ "property": "ppgz", "value": temp2?.ppgz, "op": "zdy" });
      }
      for (let i = 0; i < temp1?.length && temp1[i]?.k; i++) {
        if (temp1[i]?.v && temp1[i]?.k) {
          querys.push({ "property": temp1[i]?.k, "value": temp1[i]?.v, "op": "zdy" });
        }
      }
    }
    if (flag == 'bgd') {
      //报关单更多
      leftsx?.forEach((element: any) => {
        querys.push(element);
      });
      //报关单
      const tempBgd = await bgdForm.validateFields();
      if (tempBgd.ckrq) {
        const time1 = moment(tempBgd.ckrq[0]).format('yyyy-MM-DD');
        const time2 = moment(tempBgd.ckrq[1]).format('yyyy-MM-DD');
        querys.push({ "property": "bgdCkrqQ", "value": time1, "op": "zdy" });
        querys.push({ "property": "bgdCkrqZ", "value": time2, "op": "zdy" });
      }
    }
    if (flag == 'fp') {
      const tempFp = await fpForm.validateFields();
      if (tempFp.ckrq) {
        const time1 = moment(tempFp.ckrq[0]).format('yyyy-MM-DD');
        const time2 = moment(tempFp.ckrq[1]).format('yyyy-MM-DD');
        querys.push({ "property": "fpKprqQ", "value": time1, "op": "zdy" });
        querys.push({ "property": "fpKprqZ", "value": time2, "op": "zdy" });
      }
      //报关单更多
      rightsx?.forEach((element: any) => {
        querys.push(element);
      });
    }
    return querys;

  }




  // 可选择列表进行导出
  const dcBgd = async (key: any) => {
    const keyDc = key?.replace("_CX", "_DC");
    if (leftPagination.total > 20000) {
      message.info('您导出数据超出20000条，请调整筛选条件，分批导出！');
      return;
    }
    if (!dataLeft || dataLeft.length <= 0) {
      message.info(intl2.formatMessage({ id: 'message_common_nodata_export' }));
      return;
    }
    const model = [...zlbSearchModal, ...leftsx];
    const tempBgd = await bgdForm.validateFields();
    if (tempBgd.ckrq) {
      const time1 = moment(tempBgd.ckrq[0]).format('yyyy-MM-DD');
      const time2 = moment(tempBgd.ckrq[1]).format('yyyy-MM-DD');
      model.push({ "property": "bgdCkrqQ", "value": time1, "op": "zdy" });
      model.push({ "property": "bgdCkrqZ", "value": time2, "op": "zdy" });
    }
    let modalTitle = '将导出当前筛选条件下的所有数据，是否确认';
    if (selectBgdRowKeys && selectBgdRowKeys.length > 0) {
      modalTitle = '将导出选中的数据，是否确认';
      model.push({ property: 'uuids', values: selectBgdRowKeys, op: 'zdy' });
    }
    // //获得key
    DDAlert.open({
      info: modalTitle,
      infoType: 'question',
      modalType: 'confirm',
      okText: '确定',
      closeStatus: false,
      isFormContent: false,
      okCallbackFn: async function (thisObj: any) {
        const data: any = {
          sfBhsj: 'Y',
          sfScsm: 'Y',
          key: keyDc,
          searchModel: model,
          orderModel: [{ field: "ckrq1", order: "asc" }, { field: "ckbgdh", order: "asc" }]
        }
        thisObj.setState({ masker: true });
        downloadTemplate(data).then((response) => {
          thisObj.setState({ masker: false });
          const { code, body, desc } = response;
          DDAlert.close();
          if (code === '200') {
            const { blob, fileName } = body;
            myUtil.file.downloadExcel(blob, fileName);
          } else {
            message.error(desc);
          }
        }).catch(() => {
          DDAlert.close();
          thisObj.setState({ masker: false });
        }).finally(() => {
          DDAlert.close();
          thisObj.setState({ masker: false });
        });
      }
    })
  };

  const dcFp = async (key: any) => {
    const keyDc = key?.replace("_CX", "_DC");
    if (leftPagination.total > 20000) {
      message.info('您导出数据超出20000条，请调整筛选条件，分批导出！');
      return;
    }
    if (!dataRight || dataRight.length <= 0) {
      message.info(intl2.formatMessage({ id: 'message_common_nodata_export' }));
      return;
    }
    const model = [...zlbSearchModal, ...rightsx];
    const tempFp = await fpForm.validateFields();
    if (tempFp.ckrq) {
      const time1 = moment(tempFp.ckrq[0]).format('yyyy-MM-DD');
      const time2 = moment(tempFp.ckrq[1]).format('yyyy-MM-DD');
      model.push({ "property": "fpKprqQ", "value": time1, "op": "zdy" });
      model.push({ "property": "fpKprqZ", "value": time2, "op": "zdy" });
    }
    let modalTitle = '将导出当前筛选条件下的所有数据，是否确认';
    if (selectFpRowKeys && selectFpRowKeys.length > 0) {
      modalTitle = '将导出选中的数据，是否确认';
      model.push({ property: 'uuids', values: selectFpRowKeys, op: 'zdy' });
    }
    // //获得key
    DDAlert.open({
      info: modalTitle,
      infoType: 'question',
      modalType: 'confirm',
      okText: '确定',
      closeStatus: false,
      isFormContent: false,
      okCallbackFn: async function (thisObj: any) {
        const data: any = {
          sfBhsj: 'Y',
          sfScsm: 'Y',
          key: keyDc,
          searchModel: model,
        }
        thisObj.setState({ masker: true });
        downloadTemplate(data).then((response) => {
          thisObj.setState({ masker: false });
          const { code, body, desc } = response;
          DDAlert.close();
          if (code === '200') {
            const { blob, fileName } = body;
            myUtil.file.downloadExcel(blob, fileName);
          } else {
            message.error(desc);
          }
        }).catch(() => {
          DDAlert.close();
          thisObj.setState({ masker: false });
        }).finally(() => {
          DDAlert.close();
          thisObj.setState({ masker: false });
        });
      }
    })
  };
  const mxDc = (ssqpc: any, pduuid: any) => {
    const keyDc = 'SAAS_TSSB_MTS_AIPD_CKMX_CX_DC';
    if (!downGrid || downGrid.length <= 0) {
      message.info(intl2.formatMessage({ id: 'message_common_nodata_export' }));
      return;
    }
    const querys: { property: string; value?: any; op: string; values?: any; }[] = [];
    querys.push({ "property": "ssq", "value": ssqpc?.ssq, "op": "zdy" });
    querys.push({ "property": "sbpc", "value": ssqpc?.sbpc, "op": "zdy" });
    querys.push({ "property": "pduuid", "value": pduuid, "op": "zdy" });
    if (formDown.getFieldsValue().glh) {
      querys.push({ "property": "glh", "value": formDown.getFieldsValue().glh, "op": "zdy" });
    }
    if (formDown.getFieldsValue().ckspmc) {
      querys.push({ "property": "ckspmc", "value": formDown.getFieldsValue().ckspmc, "op": "zdy" });
    }
    let modalTitle = '将导出当前筛选条件下的所有数据，是否确认';
    if (selectMxRowKeys && selectMxRowKeys.length > 0) {
      modalTitle = '将导出选中的数据，是否确认';
      querys.push({ property: 'uuids', values: selectMxRowKeys, op: 'zdy' });
    }
    // //获得key
    DDAlert.open({
      info: modalTitle,
      infoType: 'question',
      modalType: 'confirm',
      okText: '确定',
      closeStatus: false,
      isFormContent: false,
      okCallbackFn: async function (thisObj: any) {
        const data: any = {
          sfBhsj: 'Y',
          sfScsm: 'Y',
          key: keyDc,
          searchModel: querys,
        }
        thisObj.setState({ masker: true });
        downloadTemplate(data).then((response) => {
          thisObj.setState({ masker: false });
          const { code, body, desc } = response;
          DDAlert.close();
          if (code === '200') {
            const { blob, fileName } = body;
            myUtil.file.downloadExcel(blob, fileName);
          } else {
            message.error(desc);
          }
        }).catch(() => {
          DDAlert.close();
          thisObj.setState({ masker: false });
        }).finally(() => {
          DDAlert.close();
          thisObj.setState({ masker: false });
        });
      }
    })
  }
  

  const anchorTop = () => {
    // 滚动到锚点位置
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  const anchormx = () => {
    const anchorID = 'bottomList';
    const anchorElement = document.getElementById(anchorID);
    const additionalPixels = 20; // 这里设置你需要额外加上的像素值
    const anchorPosition = anchorElement.offsetTop + additionalPixels;
    
    // 滚动到锚点位置
    window.scrollTo({
      top: anchorPosition,
      behavior: 'smooth'
    });
  }

  return (
    <>
      <Spin tip="Loading..." spinning={masker} delay={100}>
        <ProCard split="horizontal" className="dd_znpd_wrap" style={{ height: '100%' }}>
          {/* 主列表查询 */}
          <div>
            <TopQuery pduuid={pduuid} handlerZnpdsearch={handlerZnpdsearch} searchForm2={searchForm2} handlerZnpdReset={handlerZnpdReset} handlerZnpd={handlerZnpd} setSxModal={setSxModal}></TopQuery>
          </div>
          <ProCard split="vertical" style={{ borderTop: '1px solid #f07800' }}>
            {/* 左侧列表 */}
            <ProCard colSpan="50%" split="horizontal">
              <Spin tip="Loading..." spinning={leftMasker} delay={100}>
                <BgdGrid
                  pduuid={pduuid}
                  leftSearchForm={leftSearchForm}
                  bgdxx={bgdxx}
                  setBgdxx={setBgdxx}
                  setSelectBgdRows={setSelectBgdRows}
                  bgdForm={bgdForm}
                  leftPagination={leftPagination}
                  setLeftPagination={setLeftPagination}
                  dataLeft={dataLeft}
                  leftsx={leftsx}
                  setLeftsx={setLeftsx}
                  keyLeft={keyLeft}
                  bgdSx={bgdSx}
                  selectBgdRowKeys={selectBgdRowKeys}
                  selectBgdRows={selectBgdRows}
                  setSelectBgdRowKeys={setSelectBgdRowKeys}
                  dcBgd={dcBgd} />
              </Spin>
            </ProCard>
            {/* 右侧列表 */}
            <ProCard colSpan="50%" split="horizontal">
              <Spin tip="Loading..." spinning={rightMasker} delay={100}>
                <FpGrid
                  pduuid={pduuid}
                  fpForm={fpForm}
                  rightSearchForm={rightSearchForm}
                  zzsfpxx={zzsfpxx}
                  rightPagination={rightPagination}
                  setRightPagination={setRightPagination}
                  setDataRight={setDataRight}
                  setRightsx={setRightsx}
                  setSelectFpRows={setSelectFpRows}
                  selectFpRows={selectFpRows}
                  fpSx={fpSx} keyRight={keyRight}
                  dataRight={dataRight}
                  selectFpRowKeys={selectFpRowKeys}
                  setSelectFpRowKeys={setSelectFpRowKeys}
                  dcFp={dcFp} />
              </Spin>
            </ProCard>
          </ProCard>
        </ProCard>
        {/* 底部列表 */}
        <ProCard id='bottomList' split="horizontal" className="dd_znpd_wrap" style={{ height: '100%' }}>
          <DownGrid
            setBgdxx={setBgdxx}
            setZzsfpxx={setZzsfpxx}
            bgdSx={bgdSx}
            fpSx={fpSx}
            keyLeft={keyLeft}
            keyRight={keyRight}
            setSelectMxRowKeys={setSelectMxRowKeys}
            setSelectMxRows={setSelectMxRows}
            mxDc={mxDc} disFlag={disFlag} downPagination={downPagination} setDownPagination={setDownPagination} ssqpc={ssqpc} pduuid={pduuid} setDownGrid={setDownGrid} downGrid={downGrid} formDown={formDown} mxSx={mxSx} loading={loading} setLoading={setLoading} selectMxRowKeys={selectMxRowKeys} selectMxRows={selectMxRows} />
        </ProCard>
        {/* <div className="dd_znpd_wrap">
          <DownGrid
            setBgdxx={setBgdxx}
            setZzsfpxx={setZzsfpxx}
            bgdSx={bgdSx}
            fpSx={fpSx}
            keyLeft={keyLeft}
            keyRight={keyRight}
            setSelectMxRowKeys={setSelectMxRowKeys}
            setSelectMxRows={setSelectMxRows}
            mxDc={mxDc} disFlag={disFlag} downPagination={downPagination} setDownPagination={setDownPagination} ssqpc={ssqpc} pduuid={pduuid} setDownGrid={setDownGrid} downGrid={downGrid} formDown={formDown} mxSx={mxSx} loading={loading} setLoading={setLoading} selectMxRowKeys={selectMxRowKeys} selectMxRows={selectMxRows} />
        </div> */}
        {/* 主列表筛选 */}
        <div>
          <TopQueryMore setSxModal={setSxModal} sxModal={sxModal} zlbsx={zlbsx} searchForm={searchForm} />
        </div>
        {/* 匹配规则 */}
        <div>
          <Ppjscgz percentNum={percentNum} ppgzForm={ppgzForm} ssgzForm={ssgzForm} ppgzZc={ppgzZc} setPpgzZc={setPpgzZc} ppscSave={ppscSave} ywlxData={ywlxData} ppscModal={ppscModal} setPpscModal={setPpscModal} ppgzMasker={ppgzMasker} setPpgzMasker={setPpgzMasker}></Ppjscgz>
        </div>
        <div className='fixed-widgets'>
          <div className='fixed-widgets-avatar hover-button' style={{ marginBottom: '12px' }} onClick={() => anchorTop()}><VerticalAlignTopOutlined /></div>
          <div className='fixed-widgets-avatar hover-button' onClick={() => anchormx()}><VerticalAlignMiddleOutlined /></div>
        </div>
      </Spin>
    </>
  );
}

export default MtsZnpd;
