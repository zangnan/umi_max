/**
 * title: 智能配单
 */
import React, { useState, useEffect, useRef } from 'react';
import { Spin, Button, Form, Input, Space, DatePicker, Tooltip, Popconfirm, message, InputNumber } from 'antd';
import ProCard from '@ant-design/pro-card';
import './style.less';
import myUtil from '@/components/DDAssist/util';
import ZnpdGrid from './znpdGrid';
import Zdpp from './zdpp';
import { SearchOutlined } from '@ant-design/icons';
import { history, useModel, useIntl } from 'umi';
import Znpdsd from '@/pages/hts/commonModule/pd/mts/sjznpd/znpdsd';

const MtsZnpd: React.FC<unknown> = () => {
  const [masker, setMasker] = useState<any>(false);
  const [searchForm] = Form.useForm();
  const [bgdForm] = Form.useForm();
  const [fpForm] = Form.useForm();

  const refBgdGrid: any = useRef();
  const refFpGrid: any = useRef();
  const refZdpp: any = useRef();
  const refZnpdsd: any = useRef();

  const [queryBgdParam, setQueryBgdParam] = useState<any>({});
  const [queryFpParam, setQueryFpParam] = useState<any>({});
  const [selectBgdRowKeys, setSelectBgdRowKeys] = useState<any>([]);                  // 选中的行的key
  const [selectBgdRows, setSelectBgdRows] = useState<any>([]);                        // 选中的行的值
  const [selectFpRowKeys, setSelectFpRowKeys] = useState<any>([]);                  // 选中的行的key
  const [selectFpRows, setSelectFpRows] = useState<any>([]);                        // 选中的行的值
  const intl = useIntl();
  const [bgdFpSpmc, setBgdFpSpmc] = useState<any>({}); // 选中名称
  const { searchModel, changeSearchModel, bgdKeys, changeBgdKeys, bgdRows, changeBgdRows, fpKeys, changeFpKeys, fpRows, changeFpRows } = useModel('mtsznpd');

  /******************************************************出口报关单table配置 start***************************************************************/
  const bgdColumns: any = [
    { title: '出口报关单号', dataIndex: 'bgdNo', width: 175, fixed: 'left', align: 'left', sorter: true },
    {
      title: '出口日期', dataIndex: 'ljDate', width: 100, align: 'left', sorter: true, render: (text: any, record: any) => {
        return myUtil.grid.formatDate(text, 'YYYY-MM-DD');
      }
    },
    { title: '海关商品代码', dataIndex: 'hgcmcode', width: 120, align: 'left', sorter: true, },
    {
      title: '海关商品名称', dataIndex: 'hgcmname', width: 180, align: 'left', ellipsis: { showTitle: false }, render: (text: any, record: any) => {
        return <>
          <Tooltip placement="topLeft" title={text}>
            <Button icon={<SearchOutlined />} onClick={()=>searchHgspName(text)} style={{marginRight:'8px'}} />{text}
          </Tooltip>
        </>
      }
    },
    { title: '规格型号', dataIndex: 'ggxh', width: 150, align: 'left', ellipsis: { showTitle: false }, render: (text: any) => {
        return <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>
      }
    },
    {
      title: '法定数量/单位', dataIndex: 'fdsldw', width: 145, align: 'right', render: (text: any, record: any) => {
        if (!(record.fdQnt && record.fdUnit)) {
          return <span />
        } else {
          return myUtil.grid.formatNum(record.fdQnt, '0,0.00000') + '/' + record.fdUnit;
        }
      }
    },
    {
      title: '可用法定数量/单位', dataIndex: 'kyfdsldw', width: 145, align: 'right', render: (text: any, record: any) => {
        if (!(record.kyfdQnt && record.fdUnit)) {
          return <span />
        } else {
          return myUtil.grid.formatNum(record.kyfdQnt, '0,0.00000') + '/' + record.fdUnit;
        }
      }
    },
    {
      title: '成交数量/单位', dataIndex: 'cjsldw', width: 145, align: 'right', render: (text: any, record: any) => {
        if (!(record.cjQnt && record.cjUnit)) {
          return <span />
        } else {
          return myUtil.grid.formatNum(record.cjQnt, '0,0.00000') + '/' + record.cjUnit;
        }
      }
    },
    {
      title: '可用成交数量/单位', dataIndex: 'kycjsldw', width: 145, align: 'right', render: (text: any, record: any) => {
        if (!(record.kycjQnt && record.cjUnit)) {
          return <span />
        } else {
          return myUtil.grid.formatNum(record.kycjQnt, '0,0.00000') + '/' + record.cjUnit;
        }
      }
    },
    {
      title: '第二数量/单位', dataIndex: 'desldw', width: 145, align: 'right', render: (text: any, record: any) => {
        if (!(record.fd2Qnt && record.fd2Unit)) {
          return <span />
        } else {
          return myUtil.grid.formatNum(record.fd2Qnt, '0,0.00000') + '/' + record.fd2Unit;
        }
      }
    },
    {
      title: '可用第二数量/单位', dataIndex: 'desldw', width: 145, align: 'right', render: (text: any, record: any) => {
        if (!(record.kyfd2Qnt && record.fd2Unit)) {
          return <span />
        } else {
          return myUtil.grid.formatNum(record.kyfd2Qnt, '0,0.00000') + '/' + record.fd2Unit;
        }
      }
    },
    { title: '合同号', dataIndex: 'htNo', width: 130, ellipsis: { showTitle: false }, align: 'left', render: (text: any) => {
        return <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>
      }
    },
  ];

  // 点击海关商品名称进行查询
  const searchHgspName = (text: any) => {
    if(text) {
      const bgdFpSpmc: any = {bgdFpSpmc: text};
      const formVals: any = fpForm.getFieldsValue();
      const model: any = { ...searchModel, ...formVals, ...bgdFpSpmc };
      setBgdFpSpmc(bgdFpSpmc)
      // changeSearchModel(model);
      setQueryFpParam(dealFpModel(model))
    }
  }

  const rowBgdSelection = {
    selectedRowKeys: selectBgdRowKeys,
    fixed: true,
    onSelect: (record: any, selected: any, selectedRows: any, nativeEvent: any) => {
      const tmpRowKeys = [...selectBgdRowKeys];
      const tmpRows = [...selectBgdRows];
      if (selected) {
        // 可用值替换原始值 确保以前的方法不需要调整
        record.fdQnt = record.kyfdQnt;
        record.fd2Qnt = record.kyfd2Qnt;
        record.cjQnt = record.kycjQnt;

        tmpRowKeys.push(record.ckbgdId);
        tmpRows.push(record);
      } else {
        const index1 = tmpRowKeys.findIndex((item: any) => record.ckbgdId === item);
        tmpRowKeys.splice(index1, 1);
        const index2 = tmpRows.findIndex((item: any) => record.ckbgdId === item.ckbgdId);
        tmpRows.splice(index2, 1);
      }
      // 更改当前页选中
      setSelectBgdRowKeys(tmpRowKeys);
      setSelectBgdRows(tmpRows);
      // 更改全局选中
      changeBgdKeys(tmpRowKeys);
      changeBgdRows(tmpRows);
    },
    onSelectAll: (selected: any, selectedRows: any, changeRows: any) => {
      const tmpRowKeys = [...selectBgdRowKeys];
      const tmpRows = [...selectBgdRows];
      if (selected) {
        changeRows.forEach((item: any) => {
          // 可用值替换原始值 确保以前的方法不需要调整
          item.fdQnt = item.kyfdQnt;
          item.fd2Qnt = item.kyfd2Qnt;
          item.cjQnt = item.kycjQnt;

          tmpRowKeys.push(item.ckbgdId);
          tmpRows.push(item);
        })
        // 更改当前页选中
        setSelectBgdRowKeys(tmpRowKeys);
        setSelectBgdRows(tmpRows);
        // 更改全局选中
        changeBgdKeys(tmpRowKeys);
        changeBgdRows(tmpRows);
      } else {
        const lsRows0: any = [];
        const lsRows1: any = [];
        const lsRows2: any = [];
        changeRows.forEach((item: any) => {
          lsRows0.push(item.ckbgdId);
        });
        tmpRowKeys.forEach((item: any) => {
          if (!myUtil.array.isContiner(lsRows0, item)) {
            lsRows1.push(item);
          }
        });
        tmpRows.forEach((item: any) => {
          if (!myUtil.array.isContiner(lsRows0, item.ckbgdId)) {
            lsRows2.push(item);
          }
        });
        // 更改当前页选中
        setSelectBgdRowKeys(lsRows1);
        setSelectBgdRows(lsRows2);
        // 更改全局选中
        changeBgdKeys(lsRows1);
        changeBgdRows(lsRows2);
      }
    }
  }

  /******************************************************出口报关单table配置 end***************************************************************/
  /******************************************************增值税发票table配置 start***************************************************************/

  const fpColumns: any = [
    {
      title: '认证稽核', dataIndex: 'jhbz', width: 130, align: 'left', fixed: 'left', sorter: true, render: (text: any, record: any) => {
        if (text === 'Y') {
          return <div><span>{'已认证/已稽核'}</span></div>
        } else {
          return <div><span>{'已认证/未稽核'}</span></div>
        }
      }
    },
    { title: '发票代码', dataIndex: 'fpDm', width: 130, align: 'left', sorter: true, ellipsis: { showTitle: false }, render: (text: any) => {
      return <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>
    } },
    { title: '发票号码', dataIndex: 'fpNo', width: 120, align: 'left', ellipsis: { showTitle: false }, render: (text: any) => {
      return <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>
    } },
    { title: '发票行号', dataIndex: 'fphh', width: 80, align: 'left' },
    {
      title: '开票日期', dataIndex: 'kprq', width: 120, align: 'left', sorter: true, render: (text: any, record: any) => {
        return myUtil.grid.formatDate(text, 'YYYY-MM-DD');
      }
    },
    {
      title: '商品名称', dataIndex: 'bgdFpSpmc', width: 180, align: 'left', ellipsis: { showTitle: false }, render: (text: any) => {
        return <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>
      }
    },
    { title: '规格型号', dataIndex: 'ggxh', width: 150, align: 'left', ellipsis: { showTitle: false }, render: (text: any) => {
        return <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>
      }
    },
    {
      title: '发票数量/单位', dataIndex: 'fpsldw', width: 145, align: 'right', render: (text: any, record: any) => {
        if (!(record.qnt && record.dw)) {
          return <span />
        } else {
          return myUtil.grid.formatNum(record.qnt, '0,0.00000') + '/' + record.dw;
        }
      }
    },
    {
      title: '剩余发票数量/单位', dataIndex: 'fpsldw', width: 145, align: 'right', render: (text: any, record: any) => {
        if (!(record.syQnt && record.dw)) {
          return <span />
        } else {
          return myUtil.grid.formatNum(record.syQnt, '0,0.00000') + '/' + record.dw;
        }
      }
    },
    {
      title: '计税金额', dataIndex: 'je', width: 140, align: 'right', render: (text: any, record: any) => {
        return myUtil.grid.formatNum(text, '0,0.00')
      }
    },
    {
      title: '剩余金额', dataIndex: 'syje', width: 140, align: 'right', render: (text: any, record: any) => {
        return myUtil.grid.formatNum(text, '0,0.00')
      }
    },
  ];

  const rowFpSelection = {
    selectedRowKeys: selectFpRowKeys,
    fixed: true,
    onSelect: (record: any, selected: any, selectedRows: any, nativeEvent: any) => {
      const tmpRowKeys = [...selectFpRowKeys];
      const tmpRows = [...selectFpRows];
      if (selected) {
        tmpRowKeys.push(record.fpcodeId);
        tmpRows.push(record);
      } else {
        const index1 = tmpRowKeys.findIndex((item: any) => record.fpcodeId === item);
        tmpRowKeys.splice(index1, 1);
        const index2 = tmpRows.findIndex((item: any) => record.fpcodeId === item.fpcodeId);
        tmpRows.splice(index2, 1);
      }
      // 更改当前页选中
      setSelectFpRowKeys(tmpRowKeys);
      setSelectFpRows(tmpRows);
      // 更改全局选中
      changeFpKeys(tmpRowKeys);
      changeFpRows(tmpRows);
    },
    onSelectAll: (selected: any, selectedRows: any, changeRows: any) => {
      const tmpRowKeys = [...selectFpRowKeys];
      const tmpRows = [...selectFpRows];
      if (selected) {
        changeRows.forEach((item: any) => {
          tmpRowKeys.push(item.fpcodeId);
          tmpRows.push(item);
        })
        // 更改当前页选中
        setSelectFpRowKeys(tmpRowKeys);
        setSelectFpRows(tmpRows);
        // 更改全局选中
        changeFpKeys(tmpRowKeys);
        changeFpRows(tmpRows);
      } else {
        const lsRows0: any = [];
        const lsRows1: any = [];
        const lsRows2: any = [];
        changeRows.forEach((item: any) => {
          lsRows0.push(item.fpcodeId);
        });
        tmpRowKeys.forEach((item: any) => {
          if (!myUtil.array.isContiner(lsRows0, item)) {
            lsRows1.push(item);
          }
        });
        tmpRows.forEach((item: any) => {
          if (!myUtil.array.isContiner(lsRows0, item.fpcodeId)) {
            lsRows2.push(item);
          }
        });
        // 更改当前页选中
        setSelectFpRowKeys(lsRows1);
        setSelectFpRows(lsRows2);
        // 更改全局选中
        changeFpKeys(lsRows1);
        changeFpRows(lsRows2);
      }
    }
  }
  /******************************************************增值税发票table配置 start***************************************************************/

  const dealBgdModel = (model: any) => {
    const searchModel: any = [];
    for (let key in model) {
      if (model[key] && myUtil.array.isContiner(['bgdFpSpmc', 'ljDate', 'bgdNo', 'hgcmcode', 'bgdggxh', 'htNo'], key)) {
        if (key != 'ljDate' && key != 'bgdggxh') {
          searchModel.push({ property: key, value: model[key], op: 'al' });
        }
        if (key === 'ljDate') {
          if (model[key].length > 0) {
            const start: any = (new Date(model[key][0].format('YYYY/MM/DD'))).getTime();
            const end: any = (new Date(model[key][1].format('YYYY/MM/DD'))).getTime();
            searchModel.push({ property: key, value: start, op: 'dydy' });
            searchModel.push({ property: key, value: end, op: 'xydy' });
          }
        }
        if (key === 'bgdggxh') {
          searchModel.push({ property: 'ggxh', value: model[key], op: 'al' });
        }
        if (key === 'htNo') {
          searchModel.push({ property: 'htNo', value: model[key], op: 'al' });
        }
      }
    }
    return {
      key: 'MTS_ZNPD_QUERY_BGDINFO',
      searchModel: searchModel
    }
  }

  const getBgdSearchModel = () => {
    const tmp1: any = searchForm.getFieldsValue();
    if(tmp1?.bgdFpSpmc) {
      searchModel.bgdFpSpmc = tmp1?.bgdFpSpmc
    } else if(!tmp1?.bgdFpSpmc && bgdFpSpmc?.bgdFpSpmc) {
      searchModel.bgdFpSpmc = ''
    }
    return dealBgdModel(searchModel).searchModel;
  }

  const dealFpModel = (model: any) => {
    const searchModel: any = [];
    for (let key in model) {
      if (model[key] && myUtil.array.isContiner(['bgdFpSpmc', 'kprq', 'xfswsbh', 'fpNo', 'fpzs',  'fpggxh'], key)) {
        // if(key === 'fpzs' && model.fpzs && !model.fpNo){
        //   fpForm.setFieldsValue({fpzs: ''});
        // }
        if (key != 'kprq' && key != 'fpggxh') {
          searchModel.push({ property: key, value: model[key], op: 'al' });
        }
        if (key === 'kprq') {
          if (model[key].length > 0) {
            const start: any = (new Date(model[key][0].format('YYYY/MM/DD'))).getTime();
            const end: any = (new Date(model[key][1].format('YYYY/MM/DD'))).getTime();
            searchModel.push({ property: key+'Q', value: start, op: 'zdy' });
            searchModel.push({ property: key+'Z', value: end, op: 'zdy' });
          }
        }
        if (key === 'fpggxh') {
          searchModel.push({ property: 'ggxh', value: model[key], op: 'al' });
        }
      }
    }
    searchModel.push({property: "fpsbztDms", value: ['1'], op: "al"});
    searchModel.push({property: "notInFpcllxDm", value: ["2", "3", "4", "5"], op: "al"});
    return {
      key: 'MTS_ZNPD_QUERY_DZFPPAGE',
      searchModel: searchModel
    }
  }

  const getFpSearchModel = () => {
    if(bgdFpSpmc?.bgdFpSpmc) {
      searchModel.bgdFpSpmc = bgdFpSpmc?.bgdFpSpmc
    }
    return dealFpModel(searchModel).searchModel;
  }

  // 查询
  const handlerZnpdsearch = () => {
    const tmp1: any = searchForm.getFieldsValue();
    const tmp2: any = bgdForm.getFieldsValue();
    const tmp3: any = fpForm.getFieldsValue();
    if(tmp3.fpzs){
      if(!tmp3?.fpNo.trim()) {
        message.info("如果发票张数有值，发票号码为必录！");
        return;
      }
      if(tmp3?.fpNo.length != 8 && tmp3?.fpNo.length != 20) {
        message.info("发票号码为8位或者20位！");
        return;
      }
    }
    const model: any = { ...tmp1, ...tmp2, ...tmp3 };
    resetSelect();
    // 设置全局变量
    changeSearchModel(model);
    loadMoreData(model);
  }

  // 重置
  const handlerZnpdReset = () => {
    searchForm.resetFields();
    bgdForm.resetFields();
    fpForm.resetFields();
    resetSelect();
    // 设置全局变量
    changeSearchModel({});
    loadMoreData({});
    setBgdFpSpmc({}); // 选中名称
  }

  // 选中项重置
  const resetSelect = () => {
    setSelectBgdRowKeys([]);
    setSelectBgdRows([]);
    setSelectFpRowKeys([]);
    setSelectFpRows([]);
    changeBgdKeys([]);
    changeBgdRows([]);
    changeFpKeys([]);
    changeFpRows([]);
  }

  // 手动匹配
  const handlerZnpdSdpd = () => {
    if (selectBgdRowKeys?.length === 0 || selectFpRowKeys?.length === 0) {
      message.info(intl.formatMessage({ id: 'message_mts_znpd_sdpd_check' }));
    } else {
      const tmpRows = [...selectBgdRows];
      const ckrqNd = myUtil.grid.formatDate(tmpRows[0].ljDate , 'YYYY-MM-DD').substr(0,4);
      let i = 0;
      tmpRows.forEach((item: any) => {
        if (!myUtil.grid.formatDate(item.ljDate , 'YYYY-MM-DD').startsWith(ckrqNd)) {
          i++;
        }
      });
      if (i > 0) {
        message.info(intl.formatMessage({ id: 'message_mts_znpd_sdpd_checkCkrq' }));
      } else {
        refZnpdsd?.current?.showModal({ bz: 'SDPD' });
        // history.push({ pathname: '/hts/mts/sjznpd/znpdsd', query: { bz: 'SDPD' } }); // 原/hts/mts/sjznpd/znpdsd
      }
    }
  }

  // 自动配单
  const handlerZnpdZdpp = () => {
    refZdpp?.current?.showModal();
  }

  const loadMoreData = (model: any) => {
    setQueryBgdParam(dealBgdModel(model))
    setQueryFpParam(dealFpModel(model))
  }


  // 初始化执行
  const CallbackFmFunc = (param?: any) => {
    // 其他页面跳转
    if (param) {
      const ymly: any = param;
      // 设置参数
      const model: any = { ...searchModel };
      if (JSON.stringify(model) != "{}") {
        searchForm.setFieldsValue(model);
        bgdForm.setFieldsValue(model);
        fpForm.setFieldsValue(model);
      }
      setSelectBgdRowKeys(bgdKeys);
      setSelectBgdRows(bgdRows)
      setSelectFpRowKeys(fpKeys);
      setSelectFpRows(fpRows);
      loadMoreData(model);
      if (ymly === 'ZDPP') {
        handlerZnpdZdpp();
      }
    } else {
      // 菜单直接打开
      loadMoreData({});
    }
  }
  // 初始化执行
  useEffect(() => {
    CallbackFmFunc();
  }, []);

  // 表单查询宽度
  const searchWidth = 180;

  // 左面确定
  const confirmLeft = () => {
    const searchFormVals: any = searchForm.getFieldsValue();
    const formVals: any = bgdForm.getFieldsValue();
    const model: any = { ...searchModel, ...formVals, ...searchFormVals };
    changeSearchModel(model);
    setQueryBgdParam(dealBgdModel(model));
  }

  // 右面确定
  const confirmRight = () => {
    const formVals: any = fpForm.getFieldsValue();
    const searchFormVals: any = searchForm.getFieldsValue();
    if(formVals.fpzs){
      if(!formVals?.fpNo.trim()) {
        message.info("如果发票张数有值，发票号码为必录！");
        return;
      }
      if(formVals?.fpNo.length != 8 && formVals?.fpNo.length != 20) {
        message.info("发票号码为8位或者20位！");
        return;
      }
    }
    const mcValue: any = bgdFpSpmc?.bgdFpSpmc ?bgdFpSpmc:'';
    const model: any = { ...searchModel, ...formVals, ...searchFormVals, ...mcValue };
    changeSearchModel(model);
    setQueryFpParam(dealFpModel(model))
  }

  return (
    <>
      <Spin tip="Loading..." spinning={masker} delay={100}>
        <ProCard split="horizontal" className="dd_znpd_wrap">
          <ProCard className="dd_znpd_top_wrap" title={
            <Form layout="inline" form={searchForm} initialValues={{ bgdFpSpmc: '' }}>
              <Form.Item name="bgdFpSpmc">
                <Input placeholder="关单及发票商品品名" style={{ width: searchWidth + 'px', marginRight: 16 }} />
              </Form.Item>
              <Form.Item>
                <Space>
                  <Button type='primary' key={'search'} onClick={handlerZnpdsearch}>查询</Button>
                  <Button key={'reset'} onClick={handlerZnpdReset}>重置</Button>
                </Space>
              </Form.Item>
            </Form>
          } extra={
            <Form layout="inline" >
              <Form.Item >
                <Space>
                  <Button type="link" key={'sdpd'} onClick={handlerZnpdSdpd}>手动配单</Button>
                  {/*<Button type="link" key={'zdpp'} onClick={handlerZnpdZdpp}>自动匹配</Button> update V2.0.17 屏蔽此按钮*/}
                </Space>
              </Form.Item>
            </Form>
          }>
          </ProCard>
          <ProCard split="vertical">
            <ProCard colSpan="50%" split="horizontal">
              {/* <ProCard className='dd_znpd_search_wrap'>
              </ProCard> */}
              <ProCard className="dd-grid-wrap">
                <div className="grid_header_info_wrap" style={{ lineHeight: 3 }}>
                  <Space size={0} align="start">
                    <div className="grid_header_info" style={{ fontSize: 16, marginRight: 20, color: '#32363a' }}>{'出口报关单'}</div>
                    <div className="grid_header_tatal" style={{ fontSize: 14, marginTop: 4, color: '#32363a' }}>
                      已选择
                      <span className="tnum">
                        {<><b className="txt_b txt_h">{selectBgdRowKeys.length}</b></>}
                      </span>
                      项
                    </div>
                  </Space>
                </div>
                <div className="grid_header_search_popconfirm">
                  <Popconfirm
                    placement="bottomRight"
                    icon={false}
                    title={
                      <Form className="popconfirm_form" form={bgdForm} initialValues={{ ljDate: [], bgdNo: '', hgcmcode: '', bgdggxh: '', htNo: '' }} style={{ marginLeft: -18, marginRight: 5 }} >
                        <Form.Item name="hgcmcode">
                          <Input placeholder="商品代码" />
                        </Form.Item>
                        <Form.Item name="ljDate" style={{ marginBottom: '16px' }}>
                          <DatePicker.RangePicker placeholder={['出口日期起', '出口日期止']} format={myUtil.date.formatList()} />
                        </Form.Item>
                        <Form.Item name="bgdNo">
                          <Input placeholder="报关单号" />
                        </Form.Item>
                        <Form.Item name="bgdggxh">
                          <Input placeholder="规格型号" />
                        </Form.Item>
                        <Form.Item name="htNo">
                          <Input placeholder="合同号" />
                        </Form.Item>
                      </Form>
                    }
                    onConfirm={confirmLeft}
                    okText="查询"
                    showCancel={false}
                  >
                    {/* <SearchOutlined /> */}
                    <Button icon={<SearchOutlined />} />
                  </Popconfirm>
                </div>
                <ZnpdGrid
                  columns={bgdColumns}
                  url={`/yw/mts/znpd/bgd/queryBgdPager`}
                  getAssembleSearchModel={getBgdSearchModel}
                  queryParam={queryBgdParam}
                  actionRef={refBgdGrid}
                  rowKey={'ckbgdId'}
                  rowSelection={{ ...rowBgdSelection, selectedRowKeys: selectBgdRowKeys }}
                />
              </ProCard>
            </ProCard>
            <ProCard colSpan="50%" split="horizontal">
              {/* <ProCard className='dd_znpd_search_wrap'>
              </ProCard> */}
              <ProCard className="dd-grid-wrap">
                <div className="grid_header_info_wrap" style={{ lineHeight: 3 }}>
                  <Space size={0} align="start">
                    <div className="grid_header_info" style={{ fontSize: 16, marginRight: 20, color: '#32363a' }}>{'增值税发票'}</div>
                    <div className="grid_header_tatal" style={{ fontSize: 14, marginTop: 4, color: '#32363a' }}>
                      已选择
                      <span className="tnum">
                        {<><b className="txt_b txt_h">{selectFpRowKeys.length}</b></>}
                      </span>
                      项
                    </div>
                  </Space>
                </div>
                <div className="grid_header_search_popconfirm">
                  <Popconfirm
                    placement="bottomRight"
                    icon={false}
                    title={
                      <Form form={fpForm} initialValues={{ kprq: [], xfswsbh: '', fpNo: '', fpggxh: '', fpzs: null }} style={{ marginLeft: -18, marginRight: 5 }}>
                        {/* <Space> */}
                          <Form.Item name="fpNo">
                            <Input placeholder="发票号码" maxLength={20} />
                          </Form.Item>
                          {/* <Form.Item name="fpzs" style={{width: '100px'}}>
                            <InputNumber max={99} min={1} placeholder="发票张数" />
                          </Form.Item> */}
                        {/* </Space> */}
                        <Form.Item name="kprq">
                          <DatePicker.RangePicker placeholder={['开票日期起', '开票日期止']} format={myUtil.date.formatList()} />
                        </Form.Item>
                        <Form.Item name="xfswsbh">
                          <Input placeholder="发票销方税号" />
                        </Form.Item>
                        <Form.Item name="fpggxh">
                          <Input placeholder="规格型号" />
                        </Form.Item>
                      </Form>
                    }
                    onConfirm={confirmRight}
                    okText="查询"
                    showCancel={false}
                  >
                    {/* <SearchOutlined /> */}
                    <Button icon={<SearchOutlined />} />
                  </Popconfirm>
                </div>
                <ZnpdGrid
                  columns={fpColumns}
                  url={`/yw/mts/znpd/fp/dzfpQueryPage`}
                  getAssembleSearchModel={getFpSearchModel}
                  queryParam={queryFpParam}
                  actionRef={refFpGrid}
                  rowKey={'fpcodeId'}
                  rowSelection={{ ...rowFpSelection, selectedRowKeys: selectFpRowKeys }}
                />
              </ProCard>
            </ProCard>
          </ProCard>
        </ProCard>
        <Zdpp onRef={refZdpp} CallbackFmFunc={CallbackFmFunc} />
        <Znpdsd onRefZnpdsd={refZnpdsd} CallbackFmFunc={CallbackFmFunc}/>
      </Spin>
    </>
  );
}

export default MtsZnpd;
