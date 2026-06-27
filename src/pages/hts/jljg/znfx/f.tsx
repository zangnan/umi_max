/**
 * title: 智能分析-功能实现
 * author: yxy
 */
import React from 'react';
import DDAlert from '@/pages/hts/commonModule/DDAlert';
import { Badge, Button, Form, Input, message} from 'antd';
import {history} from 'umi';
import './style.less';
import {commonInitJbxx, exportPager, queryFxzSjTs, queryZnfxPager, znfxCyfx, znfxscmx } from '@/pages/hts/services/htsApi';
import myUtil, {intl as intl2 } from '@/components/DDAssist/util';

const ZnfxFunc: any = {
  unitRef: React.createRef(),
};

// 列表数据加载后执行
ZnfxFunc.afterReload = (param: any) => {
  const {formQuickFilter} = param;
  const initHxzq = myUtil.localStore.getItem('znfx-hxzq');
  let hxzqQ = '';
  let hxzqZ = '';
  if (initHxzq) {
    hxzqQ = initHxzq[0];
    hxzqZ = initHxzq[1];
  } else {
    hxzqQ =myUtil.date.formatDate(formQuickFilter.getFieldValue('hxzq')[0], 'YYYY-MM-DD');
    hxzqZ =myUtil.date.formatDate(formQuickFilter.getFieldValue('hxzq')[1], 'YYYY-MM-DD');
  }
  // 获取列表的所有数据而非page1的。需要走后台
  let dlcs = param.dataSource.length;
  if (!dlcs || dlcs <= 0 ) {
    dlcs = 1;
    myUtil.localStore.setItem('znfx-dlcs', dlcs);
    const titleMessage = ZnfxFunc.intl.formatMessage({ id: 'message_jljghx_znfx_scjz_title' });
    const infoMessage = ZnfxFunc.intl.formatMessage({ id: 'message_jljghx_znfx_scjz_info' });
    const tmpMessage = ZnfxFunc.intl.formatMessage({ id: 'message_jljghx_znfx_scjz_content_hxzq' });
    const contentMessage = myUtil.text.formatRepalce(tmpMessage, {hxzqQ: hxzqQ, hxzqZ: hxzqZ});
    const content1Message = ZnfxFunc.intl.formatMessage({ id: 'message_jljghx_znfx_scjz_content_f' });
    const content2Message = ZnfxFunc.intl.formatMessage({ id: 'message_jljghx_znfx_scjz_content_s' });
    DDAlert.open({
      title: titleMessage,
      info: infoMessage,
      infoType: 'warning',
      content: [
        contentMessage,
        content1Message,
        content2Message,
      ],
    });
  } else {
    dlcs = dlcs+ 1;
    myUtil.localStore.setItem('znfx-dlcs', dlcs);
  }

  // jcycxx({}).then((response) => {
  //   let jcycxx = '';
  //   const xfbgdInfo = ZnfxFunc.intl.formatMessage({ id: 'message_jljghx_znfx_sjxz_jcbgd_info' });
  //   const xfhzqdInfo = ZnfxFunc.intl.formatMessage({ id: 'message_jljghx_znfx_sjxz_jchzqd_info' });
  //   if (response.code === '200') {
  //     if (response.body.bgdCnt*1 > 0) {
  //       jcycxx += xfbgdInfo
  //     }
  //     if (response.body.hzqdCnt*1 > 0) {
  //       if (jcycxx != '') {
  //         jcycxx += `\n`;
  //       }
  //       jcycxx += xfhzqdInfo
  //     }
  //     if (jcycxx != '') {
  //       notification['warning']({
  //         message: '美元金额检测提醒',
  //         description: jcycxx,
  //         duration: 60,
  //         placement: 'bottomRight',
  //         style: {
  //           whiteSpace: 'pre-wrap'
  //         }
  //       });
  //     }
  //   }
  // })
}

// 智能分析-差异分析
ZnfxFunc.handleZnfxZnfx = (params: any) => {
  const { selectionRows, unitRef, gridRef, formQuickFilter} = params;
  const uuids: any[] = [];
  let num = 0;
  if (selectionRows && selectionRows.length > 0) {
    for (let i = 0; i < selectionRows.length; i++ ) {
      // 校验是否存在“分析中”'N1'、“计算中”'10'、“待计算”'00'或“计算失败”'20'的数据，若存在，则阻断提示
      if (selectionRows[i].jmfxztDm === 'N1' || selectionRows[i].jmfxztDm === '10' || selectionRows[i].jmfxztDm === '00'
      || selectionRows[i].jmfxztDm === '20'
      ) {
        num = num + 1;
      }
      uuids.push(selectionRows[i].zbuuid);
    }
  }
  if (num > 0) {
    // const gxNoDataMessage = ZnfxFunc.intl.formatMessage({ id: 'message_jljghx_znfx_znfx_gx_no_data' });
    message.info('请选择“待分析”、“分析失败”或“计算成功待分析”的数据进行操作。');
    return;
  }
  const headerFilterValue= gridRef.current?.getHeaderFilter();
  const quickVals= formQuickFilter.getFieldsValue();
  const model = [];
  if (uuids.length > 0) {
    model.push({property: 'zbuuid', values: uuids, op: 'ain'});
    model.push({property: 'hxztDm', value : quickVals.hxztDm, op: 'al'});
    model.push({property: 'hxzq',value: (quickVals.hxzq[0]).valueOf() , op: 'dydy', type: 5});
    model.push({property: 'hxzq',value: (quickVals.hxzq[1]).valueOf() , op: 'xydy', type: 5});
  } else {
    model.push({property: 'hxztDm', value: quickVals.hxztDm, op: 'al'});
    model.push({property: 'hxzq',value: (quickVals.hxzq[0]).valueOf() , op: 'dydy', type: 5});
    model.push({property: 'hxzq',value: (quickVals.hxzq[1]).valueOf() , op: 'xydy', type: 5});
    model.push({property: 'bah',value: quickVals?.bah, op: 'al'});
    if(headerFilterValue.length > 0) {
      headerFilterValue.forEach((item:any) => {
        model.push(item);
      });
    }
    // if (headerFilterValue) {
    //   model.push({property: 'hxztDm', value: quickVals.hxztDm, op: 'al'});
    //   model.push({property: 'hxzq',value: (quickVals.hxzq[0]).valueOf() , op: 'dydy', type: 5});
    //   model.push({property: 'hxzq',value: (quickVals.hxzq[1]).valueOf() , op: 'xydy', type: 5});
    //   model.push({property: 'bah',value: quickVals?.bah, op: 'al'});
    //   if (headerFilterValue.jmfxztDm && headerFilterValue.jmfxztDm.length > 0) {
    //     const ztdm = [];
    //     for (let i = 0; i < headerFilterValue.jmfxztDm.length; i++) {
    //       if (headerFilterValue.jmfxztDm[i] != 'N1') {
    //         ztdm.push(headerFilterValue.jmfxztDm[i]);
    //       }
    //     }
    //     model.push({property: 'jmfxztDm',values: ztdm , op: 'ain'});
    //   } else {
    //     model.push({property: 'jmfxztDm',values: ['N0','N2','N3','N4'] , op: 'ain'});
    //   }
    //   if (headerFilterValue.sbztDm && headerFilterValue.sbztDm.length > 0) {
    //     model.push({property: 'sbztDm',values: headerFilterValue.sbztDm , op: 'ain'});
    //   }
    // } else {
    //   model.push({property: 'hxztDm', value : quickVals.hxztDm, op: 'al'});
    //   model.push({property: 'hxzq',value: (quickVals.hxzq[0]).valueOf() , op: 'dydy', type: 5 });
    //   model.push({property: 'hxzq',value: (quickVals.hxzq[1]).valueOf() , op: 'xydy', type: 5 });
    //   model.push({property: 'jmfxztDm',values: ['N0','N2','N3','N4'] , op: 'ain'});
    // }
  }
  const data = {
    key: 'JLJG_ZXSB_SB_JLJG_ZNFX_GETSZCTS_CYFX',
    searchModel: model,
  };
  queryZnfxPager(data).then((response) => {
    const {code, body} = response;
    if (code === '200') {
      const scTotal = body && body.rows[0].myscts?body.rows[0].myscts:0;
      const zcTotal = body && body.rows[0].myzcts?body.rows[0].myzcts:0;
      if (scTotal === 0 && zcTotal === 0) {
        // 不存在可进行差异分析的数据！
        const noDataMessage = ZnfxFunc.intl.formatMessage({ id: 'message_jljghx_znfx_znfx_no_data' });
        message.info(noDataMessage);
        return ;
      } else {
        // const titleMessage = ZnfxFunc.intl.formatMessage({ id: 'message_jljghx_znfx_znfx_title' });
        let infoMessage = '确认要进行差异分析吗？';
        if(uuids.length === 0) {
          infoMessage = '确定对当前筛选条件下所有分析状态为“待分析”、“分析失败”、“计算成功待分析”的数据进行操作吗？';
        }
        const tmp1Message = ZnfxFunc.intl.formatMessage({ id: 'message_jljghx_znfx_znfx_content_f' });
        const cont1Message = myUtil.text.formatRepalce(tmp1Message, {scTotal: scTotal});
        const tmp2Message = ZnfxFunc.intl.formatMessage({ id: 'message_jljghx_znfx_znfx_content_s' });
        const cont2Message = myUtil.text.formatRepalce(tmp2Message, {zcTotal: zcTotal});
        DDAlert.open({
          title: '差异分析',
          info: infoMessage,
          infoType: 'question',
          closeStatus: false,
          isFormContent:false,
          modalType: 'confirm',
          okCallbackFn : function(thisObj: any) {
            const data1 = {
              key: 'JLJG_ZXSB_SB_JLJG_ZNFX_GETSZCMX',
              searchModel: data.searchModel
            }
            thisObj.setState({masker: true});
            znfxCyfx(data1).then((response1) => {
              thisObj.setState({masker: false});
              DDAlert.close();
              if (response1.code === '200') {
                const successMessage = ZnfxFunc.intl.formatMessage({ id: 'message_jljghx_znfx_znfx_success' });
                message.success(successMessage);
                unitRef.current?.setSelectionRowKeys([]);
                unitRef.current?.setSelectionRows([]);
                gridRef.current?.reload();
                // const timer = setInterval(() => {
                //   const promiseArr = [];
                //   promiseArr.push(queryZnfxFxzZt());
                //   Promise.all(promiseArr).then((res) => {
                //     if (res[0] === '0') {
                //       gridRef.current?.reload();
                //       // 加载数据
                //       clearInterval(timer);
                //     }
                //   }).catch(() => {
                //   }).finally(() =>{
                //   });
                // }, 10000);
              } else if(response1.code === '900'){
                message.info(response1?.msg);
              } else if(response1.code === '900'){
                message.error(response1?.desc);
              }
            })
          },
          content: [
            cont1Message,
            cont2Message,
          ],
        });
      }
    } else {
      message.error(response.desc);
      return;
    }
  })
}

// 获取数据的分析状态
const queryZnfxFxzZt = async () => {
  const result = await queryFxzSjTs({});
  return result;
}

// 生成明细
ZnfxFunc.handleZnfxScmx = (params: any) => {
  const { selectionRows,unitRef,gridRef, formQuickFilter} = params;
  const uuids: any[] = [];
  let num = 0;
  if (selectionRows && selectionRows.length > 0) {
    for (let i = 0; i < selectionRows.length; i++ ) {
      if (selectionRows[i].jmfxztDm === 'N0' ||
        selectionRows[i].jmfxztDm === 'N1' ||
        selectionRows[i].jmfxztDm === 'N4') {
        num = num + 1;
      }
      uuids.push(selectionRows[i].zbuuid);
    }
  }
  if (num > 0) {
    const gxCheckMessage = ZnfxFunc.intl.formatMessage({ id: 'message_jljghx_znfx_scmx_gx_check' });
    message.info(gxCheckMessage);
    return;
  }
  const headerFilterValue= gridRef.current?.getHeaderFilter();
  const quickVals= formQuickFilter.getFieldsValue();
  const model = [];
  if (uuids.length > 0) {
    model.push({property: 'zbuuid', values: uuids, op: 'ain'});
    model.push({property: 'hxztDm', value : quickVals.hxztDm, op: 'al'});
    model.push({property: 'hxzq',value: (quickVals.hxzq[0]).valueOf() , op: 'dydy', type: 5 });
    model.push({property: 'hxzq',value: (quickVals.hxzq[1]).valueOf() , op: 'xydy', type: 5 });
  } else {
    model.push({property: 'hxztDm', value : quickVals.hxztDm, op: 'al'});
    model.push({property: 'hxzq',value: (quickVals.hxzq[0]).valueOf() , op: 'dydy', type: 5 });
    model.push({property: 'hxzq',value: (quickVals.hxzq[1]).valueOf() , op: 'xydy', type: 5 });
    if (headerFilterValue) {
      if (headerFilterValue.bah && headerFilterValue.bah.length > 0) {
        model.push({property: 'bah',value: headerFilterValue.bah[0] , op: 'al'});
      }
      if (headerFilterValue.jmfxztDm && headerFilterValue.jmfxztDm.length > 0) {
        const ztdm = [];
        for (let i = 0; i < headerFilterValue.jmfxztDm.length; i++) {
          if (headerFilterValue.jmfxztDm[i] === 'N2'|| headerFilterValue.jmfxztDm[i] === 'N3') {
            ztdm.push(headerFilterValue.jmfxztDm[i]);
          }
        }
        model.push({property: 'jmfxztDm',values: ztdm , op: 'ain'});
      } else {
        model.push({property: 'jmfxztDm',values: ['N2','N3'] , op: 'ain'});
      }
      if (headerFilterValue.sbztDm && headerFilterValue.sbztDm.length > 0) {
        model.push({property: 'sbztDm',values: headerFilterValue.sbztDm , op: 'ain'});
      }
    } else {
      model.push({property: 'jmfxztDm',values: ['N2','N3'] , op: 'ain'});
    }
  }
  const data = {
    key: 'JLJG_ZXSB_SB_JLJG_ZNFX_GETSZCTS_SCHXMX',
    searchModel: model,
  };
  queryZnfxPager(data).then((response) => {
    const {code, body} = response;
    if (code === '200') {
      const scTotal = body?body.rows[0].myscts:0;
      const zcTotal = body?body.rows[0].myzcts:0;
      if (scTotal === 0 && zcTotal === 0) {
        const noDataMessage = ZnfxFunc.intl.formatMessage({ id: 'message_jljghx_znfx_scmx_no_data' });
        message.info(noDataMessage);
        return ;
      } else {
        // const tmp1Message = ZnfxFunc.intl.formatMessage({ id: 'message_jljghx_znfx_znfx_content_f' });
        // const scxx = myUtil.text.formatRepalce(tmp1Message, {scTotal: scTotal});
        // const tmp2Message = ZnfxFunc.intl.formatMessage({ id: 'message_jljghx_znfx_znfx_content_s' });
        // const zcxx = myUtil.text.formatRepalce(tmp2Message, {zcTotal: zcTotal});
        const vParam = {tableKey : 'JLJG_ZXSB_SB_JLJG_MDTHX_G', cxlx: 'add'};
        commonInitJbxx(vParam).then((response) => {
          const initFormVal: any = {sffg:false};
          if (response.code === '200') {
            initFormVal.ssq = response.body.ssq;
            initFormVal.sbpc = response.body.sbpc;
          } else {
            initFormVal.ssq = '';
            initFormVal.sbpc = '';
          }
          const titleMessage = ZnfxFunc.intl.formatMessage({ id: 'message_jljghx_znfx_scmx_title' });
          DDAlert.open({
            title: titleMessage,
            infoType: 'warning',
            closeStatus: false,
            initFormContentValues : initFormVal,
            isFormContent: true,
            okCallbackFn : function(thisObj: any) {
              DDAlert.getForms().validateFields().then((values: any) => {
                thisObj.setState({ masker: true });
                const qrData = {
                  key : 'JLJG_ZXSB_SB_JLJG_ZNFX_GETSZCMX',
                  zdyModel: {
                    ssq : values.ssq,
                    sbpc: values.sbpc,
                    cxscbz: 'N',
                    fgbz: 'Y'
                  },
                  searchModel: data.searchModel,
                }
                znfxscmx(qrData).then((qrresponse) => {
                  // thisObj.setState({ masker: false });
                  if (qrresponse.code === '200') {
                    DDAlert.close();
                    unitRef.current?.setSelectionRowKeys([]);
                    unitRef.current?.setSelectionRows([]);
                    openResult({
                      mdtTs:qrresponse.body.mdtTs ,
                      hxTs: qrresponse.body.hxTs
                    });
                  } else if (qrresponse.code === '902') {
                    // qrData.zdyModel.cxscbz = 'Y';
                    // znfxScmxFgSsq(qrData, unitRef);
                    thisObj.setState({ masker: false });
                    message.error(qrresponse.desc);
                    return
                  }
                  else if(qrresponse.code === '-999'){
                    DDAlert.close();
                    DDAlert.open({
                      title: '系统提示',
                      info: qrresponse.desc,
                      content: qrresponse.msg,
                      infoType: 'info',
                    });
                    return
                  } else {
                    thisObj.setState({ masker: false });
                    message.error(qrresponse.desc);
                    return
                  }
                });
              })
            },
            modalType: 'form',
            content: <>
              <Form.Item name='ssq' label='所属期' rules={[{required: true,message: '请输入所属期'},{pattern: new RegExp('^(20|19){1}[0-9]{2}(((0){1}[1-9]{1})|((1){1}(0|1|2){1}))$','g'),message:'只允许输入YYYYMM型'}]}>
                <Input placeholder='所属期' size='small' />
              </Form.Item>
              <Form.Item name='sbpc' label='申报批次' rules={[{required: true,message: '请输入申报批次'},() => ({
                validator(_, value) {
                  if (value) {
                    if (!value.match(/^\d+$/)) {
                      return Promise.reject(new Error(intl2.formatMessage({id: 'validator_number'})));
                    }
                    if (value.length != 3) {
                      let message = myUtil.text.formatRepalce(intl2.formatMessage({id: 'validator_v_eq'}), {len: 3});
                      return Promise.reject(new Error(message));
                    }
                  }
                  return Promise.resolve();
                }
              })]}>
                <Input placeholder='申报批次' size='small'/>
              </Form.Item>
              {/* <Form.Item name='sffg' valuePropName="checked" {...myUtil.layout.formX1.tailLayout}>
                <Checkbox>覆盖已生成的明细数据
                  <Tooltip className='znfx-scmx-fgts'
                      title='按照所属期，手（账）册号以及核销周期对已生成的明细数据进行覆盖操作。'
                      overlayInnerStyle={{width:'255px',}}>
                    <QuestionCircleOutlined />
                  </Tooltip>
                </Checkbox>
              </Form.Item> */}
              <Form.Item colon={true} label="手册信息">
                <span className="ant-form-text">{scTotal} 条</span>
              </Form.Item>
              <Form.Item colon={true} label="账册信息">
                <span className="ant-form-text">{zcTotal} 条</span>
              </Form.Item>
            </>,
          });
        });
      }
    } else {
      message.error(response.desc);
      return;
    }
  });
}

// 数据导出
ZnfxFunc.handleZnfxSjdc = (params: any) => {
  const { selectionRows, unitRef, gridRef} = params;
  const gridData = unitRef.current?.getGridData();
  if (!gridData || gridData.length  <= 0 ) {
    message.info(ZnfxFunc.intl.formatMessage({ id: 'message_common_nodata_export' }));
    return ;
  }
  const uuids: any[] = [];
  if (selectionRows && selectionRows.length > 0) {
    for (let i = 0; i < selectionRows.length; i++ ) {
      uuids.push(selectionRows[i].uuid);
    }
  }
  const data: any = {
    key: 'JLJG_ZXSB_SB_JLJG_ZNFX_GETSZCMX',
  };
  const commonValue = unitRef.current?.getGridParams();
  const val = commonValue.searchModel;
  const headerVal = gridRef.current?.getHeaderFilter();
  const model: any = [];
  if (val) {
    val.forEach((item: any) => {
      model.push(item);
    });
  }
  if (headerVal) {
    headerVal.forEach((item: any) => {
      model.push(item);
    });
  }
  data.searchModel = model;
  data.orderModel = commonValue.orderModel;
  unitRef.current?.setMasker(true);
  //{property: "ywKey", values: ["QD513121I0000029611"], op: "ain"}
  exportPager(data).then((response) => {
    unitRef.current?.setMasker(false);
    const { code, body, desc } = response;
    if (code === '200') {
      const { blob, fileName } = body;
      myUtil.file.downloadExcel(blob, fileName);
    } else {
      message.error(desc);
    }
  })
}

// 核销数据状态更改
ZnfxFunc.handleOnChangeHxsj = (params: any) => {
  console.log(params);
}

// 核销周期更改
ZnfxFunc.handleOnChangeHxzq = (params: any) => {
  const {formQuickFilter} = params;
  const val = [
    formQuickFilter.getFieldValue('hxzq')[0].format('YYYY-MM-DD'),
    formQuickFilter.getFieldValue('hxzq')[1].format('YYYY-MM-DD'),
  ];
  myUtil.localStore.setItem('znfx-hxzq', val);
}

// 生成明细覆盖所属期
const znfxScmxFgSsq = (params: any, unitRef: any) => {
  const titleMessage = ZnfxFunc.intl.formatMessage({ id: 'message_jljghx_znfx_scmx_fg_title' });
  const infoMessage = ZnfxFunc.intl.formatMessage({ id: 'message_jljghx_znfx_scmx_fg_info' });
  DDAlert.open({
    title: titleMessage,
    info: infoMessage,
    infoType: 'question',
    modalType: 'confirm',
    closeStatus: false,
    content: '',
    isFormContent: false,
    okCallbackFn:function(thisObj: any) {
      thisObj.setState({ masker: true });
      znfxscmx(params).then((response) => {
        DDAlert.close();
        if (response.code === '200') {
          unitRef.current?.setSelectionRowKeys([]);
          unitRef.current?.setSelectionRows([]);
          openResult({
            mdtTs:response.body.mdtTs ,
            hxTs: response.body.hxTs
          });
        } else {
          message.error(response.desc);
          return
        }
      });
    }
  });
}

// 生成明细完成后-回调
const openResult = (params: any) => {
  const titleMessage = ZnfxFunc.intl.formatMessage({ id: 'message_jljghx_znfx_scmx_title' });
  const infoMessage = ZnfxFunc.intl.formatMessage({ id: 'message_jljghx_znfx_scmx_success' });
  const tmp1Message = ZnfxFunc.intl.formatMessage({ id: 'message_jljghx_znfx_scmx_success_mdt' });
  const cont1Message = myUtil.text.formatRepalce(tmp1Message, {mdtTs: params.mdtTs});
  const tmp2Message = ZnfxFunc.intl.formatMessage({ id: 'message_jljghx_znfx_scmx_success_hx' });
  const cont2Message = myUtil.text.formatRepalce(tmp2Message, {hxTs: params.hxTs});
  DDAlert.open({
    title: titleMessage,
    info: infoMessage,
    infoType: 'success',
    modalType: 'confirm',
    okText: '跳转至明细',
    closeStatus: true,
    isFormContent: false,
    okCallbackFn : function() {
      DDAlert.close();
      history.push('/hts/jljg/mxcj');
    },
    content: <>
      <p className="item">
        {cont1Message}
      </p>
      <p className="item">
        {cont2Message}
      </p>
    </>,
  });
}

// 分析状态为有差异时，打开
ZnfxFunc.openBdjgYcy = (rows: any, param: any) => {
  const {unitRef} = param;
  const otherRef = unitRef.current?.getOtherRefs();
  if (otherRef[0]) {
    otherRef[0].current?.showModal(rows);
  }
};

// 税务数据，打开
ZnfxFunc.openJckgd = (jckbz: any, hgsjbz: any, rows: any, param: any) => {
  const {unitRef} = param;
  const otherRef = unitRef.current?.getOtherRefs();
  if (otherRef[1]) {
    otherRef[1].current?.showModal(jckbz, hgsjbz, rows);
  }
};

// 海关数据，打开
ZnfxFunc.openJckhzqd = (titleKey: any, rows: any, param: any) => {
  const {unitRef} = param;
  const otherRef = unitRef.current?.getOtherRefs();
  if (otherRef[2]) {
    otherRef[2].current?.showModal(titleKey,rows);
  }
};

// 税务数据数据，已申报出口额
ZnfxFunc.openYsbcke = (rows: any, param: any) => {
  const {unitRef} = param;
  const otherRef = unitRef.current?.getOtherRefs();
  if (otherRef[3]) {
    otherRef[3].current?.showModal(rows);
  }
};

// 进（出）口总额
ZnfxFunc.openJckze = (jckbz: any, hgsjbz: any, rows: any, param: any) => {
  const {unitRef} = param;
  const otherRef = unitRef.current?.getOtherRefs();
  if (otherRef[4]) {
    otherRef[4].current?.showModal(jckbz, hgsjbz, rows);
  }
};

ZnfxFunc.columnsRender = {
  renderZnfxHxzq: (param: any) => {
    let col: any = <></>;
    if (param.text && param.text.indexOf("至") != -1) {
      if(param.text === '至') {
        col = (<div></div>);
      } else {
        col = (
          <div style={{ position: 'relative' }}>
            <div><span>{param.text.split('至')[0]}</span></div>
            <span style={{ position: 'absolute', top: '10px', right: '0', color: '#b8b8b8' }}>{'至'}</span>
            <div><span>{param.text.split('至')[1]}</span></div>
          </div>
        );
      }

    } else {
      col = (
        <div><span>{param.text}</span></div>
      );
    }
    return col;
  },

  renderZnfxBdjg: (param: any) => {
    let col: any = <></>;
    if (param.text === '1') {
      // 蓝点
      col = (
        <div><Badge status="processing" /><span>{myUtil.code.getCodeValByKey(param.text, 'CODE_DM_ZXSB_JMFXZT:01')}</span></div>
      );
    } else if (param.text === '3') {
      // 绿色 无差异 "3"
      col = (
        <div><Badge status="success" /><span>{myUtil.code.getCodeValByKey(param.text, 'CODE_DM_ZXSB_JMFXZT:01')}</span></div>
      );
    } else if (param.text === '2') {
      // 蓝点 蓝字 有连接 有差异
      col = (
        <div><Badge status="warning" />
          <Button type="link"
            onClick={
              (event: any) => {
                event.stopPropagation();
                ZnfxFunc.openBdjgYcy(param.record, param);
              }
            }>{myUtil.code.getCodeValByKey(param.text, 'CODE_DM_ZXSB_JMFXZT:01')}</Button></div>
      );
    } else if (param.text === '4') {
       // 红点
       col = (
        <div><Badge status="error" /><span>{myUtil.code.getCodeValByKey(param.text, 'CODE_DM_ZXSB_JMFXZT:01')}</span></div>
      );
    } else if (param.text === '0') {
      // 蓝点 || 待分析 '0'
      col = (
        <div><Badge status="default" /><span>{myUtil.code.getCodeValByKey(param.text, 'CODE_DM_ZXSB_JMFXZT:01')}</span></div>
      );
    }
    return col;
  },
  // 智能分析-海关数据-进口总额
  renderZnfxJkzeHg: (param: any) => {
    if (param.record.jmfxztDm === 'N0' || param.record.jmfxztDm === 'N1' || param.record.jmfxztDm === 'N4') {
      const val = '';
      return (
        <div>
          {val}
        </div>
      );
    } else {
      const val = myUtil.grid.formatNum(param.record.hgjsjkzz, '0,0.00');
      return (
        <div>
          {val}
        </div>
      );
    }
  },

  // 智能分析-海关数据-出口总额
  renderZnfxCkzeHg: (param: any) => {
    if (param.record.jmfxztDm === 'N0' || param.record.jmfxztDm === 'N1' || param.record.jmfxztDm === 'N4') {
      const val = '';
      return (
        <div>
          {val}
        </div>
      );
    } else {
      const val = myUtil.grid.formatNum(param.record.hgjsckzz, '0,0.00');
      return (
        <div>
          {val}
        </div>
      );
    }
  },

  // 智能分析-分配率处理
  renderZnfxFplv: (param: any) => {
    if (param.record.jmfxztDm === 'N0' || param.record.jmfxztDm === 'N1' || param.record.jmfxztDm === 'N4') {
      const val = '';
      return (
        <div>
          {val}
        </div>
      );
    } else {
      const val = myUtil.grid.formatNum(param.text, '0,0.00000');
      return (
        <div>
          {val}
        </div>
      );
    }
  },

  // 智能分析-海关数据-进口关单
  renderZnfxJkgdHg: (param: any) => {
    if (param.record.jmfxztDm === 'N0' || param.record.jmfxztDm === 'N1' || param.record.jmfxztDm === 'N4') {
      const val = '';
      return (
        <div>
          {val}
        </div>
      );
    } else {
      const val = (param.record.hgjkbgdzs ? param.record.hgjkbgdzs : 0) + "/" + (param.record.hgjkbgdts ? param.record.hgjkbgdts : 0);
      return (
        <Button
          type="link"
          onClick={(event: any) => {
            event.stopPropagation();
            ZnfxFunc.openJckgd('JK', 'HG', param.record, param);
          }}
        >
          {val}
        </Button>
      );
    }
  },

  // 智能分析-海关数据-出口关单
  renderZnfxCkgdHg: (param: any) => {
    if (param.record.jmfxztDm === 'N0' || param.record.jmfxztDm === 'N1' || param.record.jmfxztDm === 'N4') {
      const val = '';
      return (
        <div>
          {val}
        </div>
      );
    } else {
      const val = (param.record.hgckbgdzs ? param.record.hgckbgdzs : 0) + "/" + (param.record.hgckbgdts ? param.record.hgckbgdts : 0);
      return (
        <Button
          type="link"
          onClick={(event: any) => {
            event.stopPropagation();
            ZnfxFunc.openJckgd('CK', 'HG', param.record, param);
          }}
        >
          {val}
        </Button>
      );
    }
  },

  // 智能分析-税务数据-进口总额
  renderZnfxJkzeSj: (param: any) => {
    if (param.record.jmfxztDm === 'N0' || param.record.jmfxztDm === 'N1' || param.record.jmfxztDm === 'N4') {
      const val = '';
      return (
        <div>
          {val}
        </div>
      );
    } else {
      const val = myUtil.grid.formatNum(param.record.jsjkzz, '0,0.00');
      return (
        <div>
          {val}
        </div>
      );
    }
  },

  // 智能分析-税务数据-出口总额
  renderZnfxCkzeSj: (param: any) => {
    if (param.record.jmfxztDm === 'N0' || param.record.jmfxztDm === 'N1' || param.record.jmfxztDm === 'N4') {
      const val = '';
      return (
        <div>
          {val}
        </div>
      );
    } else {
      const val = myUtil.grid.formatNum(param.record.jsckzz, '0,0.00');
      return (
        <div>
          {val}
        </div>
      );
    }
  },

  // 智能分析-税局数据-进口关单
  renderZnfxJkgdSj: (param: any) => {
    if (param.record.jmfxztDm === 'N0' || param.record.jmfxztDm === 'N1' || param.record.jmfxztDm === 'N4') {
      const val = '';
      return (
        <div>
          {val}
        </div>
      );
    } else {
      const val = (param.record.jkbgdzs ? param.record.jkbgdzs : 0) + "/" + (param.record.jkbgdts ? param.record.jkbgdts : 0);
      return (
        <Button
          type="link"
          onClick={(event: any) => {
            event.stopPropagation();
            ZnfxFunc.openJckgd('JK', 'SJ', param.record, param);
          }}
        >
          {val}
        </Button>
      );
    }
  },

  // 智能分析-税局数据-出口关单
  renderZnfxCkgdSj: (param: any) => {
    if (param.record.jmfxztDm === 'N0' || param.record.jmfxztDm === 'N1' || param.record.jmfxztDm === 'N4') {
      const val = '';
      return (
        <div>
          {val}
        </div>
      );
    } else {
      const val = (param.record.ckbgdzs ? param.record.ckbgdzs : 0) + "/" + (param.record.ckbgdts ? param.record.ckbgdts : 0);
      return (
        <Button
          type="link"
          onClick={(event: any) => {
            event.stopPropagation();
            ZnfxFunc.openJckgd('CK', 'SJ', param.record, param);
          }}
        >
          {val}
        </Button>
      );
    }
  },

  // 智能分析-税务数据-已申报出口额
  renderZnfxYsbckeSj: (param: any) => {
    if (param.record.jmfxztDm === 'N0' || param.record.jmfxztDm === 'N1' || param.record.jmfxztDm === 'N4') {
      const val = '';
      return (
        <div>
          {val}
        </div>
      );
    } else {
      const val = myUtil.grid.formatNum(param.record.sbrmblaj, '0,0.00');
      return (
        <div>
          {val}
        </div>
      );
    }
  },

  // 智能分析-海关数据-进口核注清单
  renderZnfxJkhzqdHg: (param: any) => {
    if (param.record.jmfxztDm === 'N0' || param.record.jmfxztDm === 'N1' || param.record.jmfxztDm === 'N4') {
      const val = '';
      return (
        <div>
          {val}
        </div>
      );
    } else {
      const val = (param.record.hgjkhzqdzs ? param.record.hgjkhzqdzs : 0) + "/" + (param.record.hgjkhzqdts ? param.record.hgjkhzqdts : 0);
      return (
        <Button
          type="link"
          onClick={(event: any) => {
            event.stopPropagation();
            ZnfxFunc.openJckhzqd('JK', param.record, param);
          }}
        >
          {val}
        </Button>
      );
    }
  },

  // 智能分析-海关数据-出口核注清单
  renderZnfxCkhzqdHg: (param: any) => {
    if (param.record.jmfxztDm === 'N0' || param.record.jmfxztDm === 'N1' || param.record.jmfxztDm === 'N4') {
      const val = '';
      return (
        <div>
          {val}
        </div>
      );
    } else {
      const val = (param.record.hgckhzqdzs ? param.record.hgckhzqdzs : 0) + "/" + (param.record.hgckhzqdts ? param.record.hgckhzqdts : 0);
      return (
        <Button
          type="link"
          onClick={(event: any) => {
            event.stopPropagation();
            ZnfxFunc.openJckhzqd('CK', param.record, param);
          }}
        >
          {val}
        </Button>
      );
    }
  },


}


export default ZnfxFunc;
