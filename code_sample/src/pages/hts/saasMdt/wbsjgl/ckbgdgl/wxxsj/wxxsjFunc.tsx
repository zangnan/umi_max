import DDAlert from '@/components/DDAlert';
import { intl } from '@/pages/common/myUtil';
import {getBgdInfoHgck, plxgckfph, plxgckspDm, plxgYfzssl, queryPager, updateBgdCzbz, bgdpdfyl, queryKak, xzrwjy} from '@/services/hts/api';
import { Form, Input, message, Tooltip, InputNumber, Select, Button } from 'antd';
import React from 'react';
import baseValidator from '@/pages/common/field/baseValidator';
import myUtil from '@/pages/common/myUtil';
import { intl as intl2 } from '@/pages/common/myUtil';
import khdgjUtil from "@/pages/hts/ckfp/khdgjUtil";
import ckbgdFunc from "@/pages/hts/commonModule/ckhwbgd/f";
import { history } from 'umi';
import CkbgdFunc from "../../common/CkbgdFunc";

const Func: any = {
  unitRef: React.createRef(),
};

// 更新信息状态
Func.updateInfoState = (param: any) => {
  const { unitRef, selectionRowKeys, gridRef } = param;
  const gridData = unitRef.current?.getGridData();
  if (gridData.length === 0) {
    message.info(intl.formatMessage({ id: 'message_common_type_no_griddata' }));
    return;
  }
  const searchModel = unitRef.current?.getGridParams().searchModel || [];
  const headerSearchModel = gridRef.current?.getHeaderFilter() || [];
  const allSearchModel: any = searchModel.concat(headerSearchModel);
  allSearchModel.push({ property: 'cxlx', value: '5', op: 'zdy' });
  allSearchModel.push({ property: 'sfcxZj', value: "Y", op: 'zdy' });
  let uuids: any = [];
  let modalTitle = '确认对当前筛选条件下所有数据进行更新信息操作？';
  if (selectionRowKeys.length > 0) {
    modalTitle = '确认对选中的数据进行更新信息操作？';
  }
  DDAlert.open({
    title: '系统消息',
    info:
      <span>
        &nbsp;&nbsp;<span style={{ fontWeight: "bold" }}>更新信息<br /></span>
        &nbsp;&nbsp;<span>{modalTitle}</span>
      </span>
    ,
    modalType: 'confirm',
    infoType: 'question',
    okCallbackFn: function () {
      if (selectionRowKeys.length === 0) {
        // 走获取全部uuid的接口
        const obj = {
          page: 1,
          pageSize: 999999,
          key: 'WBSJ_CKBGD_QUERY_PAGE',
          searchModel: allSearchModel,
        }
        queryPager(obj).then((res: any) => {
          const { code, body, msg } = res;
          if (code === '200') {
            uuids = body.rows
            updateBgdCzbzApi(uuids, unitRef);
          } else {
            message.error(msg)
          }
        })
      } else {
        uuids = selectionRowKeys;
        updateBgdCzbzApi(uuids, unitRef);
      }
    }
  });
}

// 批量更新 - 出口发票号
Func.btnPlxgCkfph = (param: any) => {
  const { unitRef, selectionRowKeys, selectionRows } = param;
  if (selectionRowKeys.length === 0) {
    message.info(intl.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  if (selectionRows.some(item => item['cytgbz'] != 'Y')) {
    message.error(intl.formatMessage({ id: 'message_sjsb_czdclbgdsj_info' }));
    return;
  }
  DDAlert.open({
    title: '批量修改',
    closeStatus: false,
    isFormContent: true,
    infoType: 'form',
    modalType: 'form',
    content:
      <>
        <Form.Item label="出口发票号" name="ckfph" rules={[{ required: true, message: '请输入出口发票号' },validatorFlag.ckfph, baseValidator.range2({ min: 0, max: 30 })]} >
          <Input placeholder="请输入出口发票号" style={{ width: 230 }}></Input>
        </Form.Item>
      </>,
    okCallbackFn: function () {
      DDAlert.getForms().validateFields().then((values: any) => {
        if(values) {
          plxgckfph({ uuids: selectionRowKeys, ckfph: values.ckfph, ywlx: "ckbgd" }).then((res: any) => {
            const { code, msg } = res;
            if (code === '200') {
              DDAlert.close();
              message.success("批量更新出口发票成功，共更新" + selectionRowKeys.length + "条数据")
              unitRef.current!.reload2();
              unitRef.current?.setSelectionRowKeys([]);
              unitRef.current?.setSelectionRows([]);
            } else {
              message.error(msg)
            }
          })
        }
      })
    }
  })
}

// 批量更新 - 出口商品代码
Func.btnPlxgCkspdm = (param: any) => {
  const { unitRef, selectionRowKeys, selectionRows } = param;
  if (selectionRowKeys.length === 0) {
    message.info(intl.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  if (selectionRows.some(item => item['cytgbz'] != 'Y')) {
    message.error(intl.formatMessage({ id: 'message_sjsb_czdclbgdsj_info' }));
    return;
  }
  DDAlert.open({
    title: '批量修改',
    closeStatus: false,
    isFormContent: true,
    infoType: 'form',
    modalType: 'form',
    content:
      <>
        <Form.Item label="出口商品代码" name="ckspDm" rules={[{ required: true, message: '请输入出口商品代码' }, baseValidator.number()]} >
          <Input placeholder="请输入出口商品代码" style={{ width: 230 }}></Input>
        </Form.Item>
      </>,
    //#region 回调方法
    okCallbackFn: function () {
      DDAlert.getForms().validateFields().then((values: any) => {
        plxgckspDm({ uuids: selectionRowKeys, ckspDm: values.ckspDm, ywlx: "ckbgd" }).then((res: any) => {
          const { code, msg, body } = res;
          if (code === '200') {
            DDAlert.close();
            message.success(body)
            unitRef.current!.reload2();
            unitRef.current?.setSelectionRowKeys([]);
            unitRef.current?.setSelectionRows([]);
          } else if (code === '0') {
            message.error(msg);
          } else if (code === '900') {
            if (body === '' || body === null) {
              message.error(msg);
            } else {
              //#region  失败展示页面
              const otherRef = param.unitRef.current?.getOtherRefs();
              if (otherRef) {
                otherRef[3].current?.showModal(body, 'ckspDm', '批量修改');
              }
            }
          }
        })
      })
    }
  })
}

// 批量更新 - 汇率
Func.btnPlxgHl = (param: any) => {
  const { unitRef, selectionRowKeys, otherRef, selectionRows } = param;
  if (selectionRowKeys.length === 0) {
    message.info(intl.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  if (selectionRows.some(item => item['cytgbz'] != 'Y')) {
    message.error(intl.formatMessage({ id: 'message_sjsb_czdclbgdsj_info' }));
    return;
  }
  const obj: any = {
    searchModel: [
      { property: 'uuids', values: selectionRowKeys, op: 'zdy' },
      { property: 'xgbz', values: 'wxx', op: 'zdy' },
    ],
    key: 'WBSJ_CKBGD_PLXGHLABZ_QUERY_PAGER'
  }
  otherRef[2].current?.showModal(unitRef, selectionRowKeys, null, obj);
}

// 批量更新 - 运费折算数量
Func.btnPlxgYfzssl = (param: any) => {
  const { unitRef, selectionRowKeys, selectionRows } = param;
  if (selectionRowKeys.length === 0) {
    message.info(intl.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  if (selectionRows.some(item => item['cytgbz'] != 'Y')) {
    message.error(intl.formatMessage({ id: 'message_sjsb_czdclbgdsj_info' }));
    return;
  }
  DDAlert.open({
    title: '批量修改',
    closeStatus: false,
    isFormContent: true,
    infoType: 'form',
    modalType: 'form',
    content:
      <>
        <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="运费折算数量（吨）" name="yfzssl" rules={[{ required: true, message: '请输入运费折算数量（吨）' }]} >
          <InputNumber placeholder="请输入运费折算数量（吨）" min={0.00001} max={9999999999.99999} formatter={(value: any, info: any)=>{return inputNumperFormatter(value, info, '0,0.00000')}}></InputNumber>
        </Form.Item>
      </>,
    okCallbackFn: function (thisObj: any) {
      DDAlert.getForms().validateFields().then((values: any) => {
        thisObj.setState({ masker: true });
        values.yfzssl = Number(myUtil.text.formatNum(values.yfzssl, '0.00000'));
        plxgYfzssl({ uuids: selectionRowKeys, yfzssl: values.yfzssl, ywlx: "ckbgd" }).then((res: any) => {
          thisObj.setState({ masker: false });
          const { code, msg } = res;
          if (code === '200') {
            DDAlert.close();
            message.success(intl.formatMessage({ id: 'message_common_batchedit_success' }));
            unitRef.current!.reload2();
            unitRef.current?.setSelectionRowKeys([]);
            unitRef.current?.setSelectionRows([]);
          } else {
            message.error(msg)
          }
        })
      })
    }
  })
}

// 生成信息查询
Func.produceInfoQuery = (param: any) => {
  const { unitRef } = param;
  const gridData = unitRef.current?.getGridData();
  if (gridData.length === 0) {
    message.info(intl.formatMessage({ id: 'message_common_type_no_griddata' }));
    return;
  }
  const otherRef = param.unitRef.current?.getOtherRefs();
  if (otherRef) {
    otherRef[4].current?.showModal(param);
  }
}

// 生成明细报表
Func.produceDetailsReport = (param: any) => {
  const { unitRef, selectionRows } = param;
  const gridData = unitRef.current?.getGridData();
  if (gridData.length === 0) {
    message.info(intl.formatMessage({ id: 'message_common_type_no_griddata' }));
    return;
  }
  if (selectionRows.some(item => item['cytgbz'] != 'Y')) {
    message.error(intl.formatMessage({ id: 'message_sjsb_wfsc_bgdsj_info' }));
    return;
  }
  const otherRef = param.unitRef.current?.getOtherRefs();
  if (otherRef) {
    otherRef[1].current?.showModal(param, '5');
  }
};

// 关单信息状态标志
Func.columnsRender = {
  renderBgdscmx18bgdh: (param: any) => {
    const ckbgdh = param?.text;
    const html = <a onClick={(e) => { e.stopPropagation(); Func.openCkbgdh2(param, ckbgdh) }}>{ckbgdh}</a>;
    const html2 = <Tooltip title={ckbgdh}>{html}</Tooltip>;
    return html2;
  },
};

Func.openCkbgdh = (param: any, ckbgd: any) => {
  const { otherRef } = param;
  ckbgd = ckbgd.substring(0, 18);
  getBgdInfoHgck({ ckbgdh: ckbgd }).then((res: any) => {
    if (res.code == '200') {
      otherRef[0].current?.showModal(param, ckbgd, res?.body);
    }
  })
}

Func.openCkbgdh2 = (param: any, ckbgd: any) => {
  const { otherRef, record, unitRef} = param;
  unitRef.current!.setMasker(true);
  bgdpdfyl({ uuid: record?.uuid, bgdhgbh: record?.bgdhgbh }).then((res: any) => {
    unitRef.current!.setMasker(false);
    if (res.code == '200') {
      otherRef[0].current?.showModal(res?.body, { uuid: record?.uuid, bgdhgbh: record?.bgdhgbh });
    } else {
      message.error(res.msg);
    }
  })
}

// 更新信息状态接口
const updateBgdCzbzApi = (param: any, unitRef: any) => {
  unitRef.current!.setMasker(true);
  updateBgdCzbz({ uuids: param }).then((res: any) => {
    unitRef.current!.setMasker(false);
    const { code, msg ,body} = res;
    if (code === '200') {
      unitRef.current!.reload2();
      unitRef.current?.setSelectionRowKeys([]);
      unitRef.current?.setSelectionRows([]);
      DDAlert.open({
        title: intl.formatMessage({ id: 'message_jljghx_sjxz_sjxz_title' }),
        info: intl.formatMessage({ id: 'message_jljghx_sjxz_sjxz_info' }),
        infoType: 'success',
        content: [
          intl.formatMessage({ id: 'message_jljghx_sjxz_sjxz_content_xzrw' }),
        ],
        okText: '转任务管理',
        okCallbackFn: function () {
          history.push('/02/0201');
        }
      });


    } else {
      message.error(msg.rtnMsg ? msg.rtnMsg:msg)
    }
  })
}

const inputNumperFormatter = (value: any, info: any, format: any) => {
  if (info.userTyping) {
    if (info.input) {
      return info.input;
    } else {
      if (value) {
        return value;
      }
      return '';
    }
  } else {
    if (value) {
      return myUtil.text.formatNum(value, format);
    }
    return '';
  }
}

const validatorFlag = {
  ckfph: (form: any) => {
    const validator = async (_rule: any, value: any) => {
      if (value && /[\u4E00-\u9FA5]/g.test(value) || value && /\s/.test(value)) {
        return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_english_number_symbol' })));
      } else {
        return Promise.resolve();
      }
    }
    return { validator };
  },
}

// 转不退税
Func.btnZbts = (param: any) => {
  CkbgdFunc.btnZbts(param, null);
  /*const { unitRef, selectionRowKeys } = param;
  if (!selectionRowKeys || selectionRowKeys.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  DDAlert.open({
    title: '转不退税',
    info: '确定对勾选数据进行转不退税操作吗？',
    modalType: 'confirm',
    infoType: 'question',
    okCallbackFn: function (thisObj: any) {
      thisObj.setState({ masker: true });
      const data = { uuids: selectionRowKeys };
      bgdzbts(data).then((response: any) => {
        thisObj.setState({ masker: false });
        const { code, msg } = response;
        if (code === '200') {
          message.success('转不退税成功！');
          close();
          unitRef.current!.reload2();
        } else {
          message.error(msg);
        }
      })
    }
  })*/
}

// 重新发往税务总局（报关单）
Func.sendWxxbgdToSwzj = async (param: any) => {
  const { unitRef, selectionRowKeys, gridRef, otherRef } = param;
  const gridData = unitRef.current?.getGridData();
  // 判断是否勾选数据
  if (gridData.length === 0) {
    message.info(intl.formatMessage({ id: 'message_common_type_no_griddata' }));
    return;
  }
  // 获取筛选条件
  const searchModel = unitRef.current?.getGridParams().searchModel || [];
  const headerSearchModel = gridRef.current?.getHeaderFilter() || [];
  const allSearchModel: any = searchModel.concat(headerSearchModel);
  // 设置固定条件
  allSearchModel.push({ property: 'cxlx', value: '5', op: 'zdy' });
  allSearchModel.push({ property: 'sfcxZj', value: "Y", op: 'zdy' });
  let uuids: any = [];
  let modalTitle = '将发送当前筛选条件下所有数据，是否确认？';
  if (selectionRowKeys.length > 0) {
    modalTitle = '将发送选中的数据，是否确认？';
  }
  if (selectionRowKeys.length === 0) {
    const obj = {
      page: 1,
      pageSize: 999999,
      key: 'WBSJ_CKBGD_QUERY_PAGE',
      searchModel: allSearchModel,
    }
    queryPager(obj).then((res: any) => {
      const { code, body, msg } = res;
      if (code === '200') {
        uuids = body.rows
        // 调用环境检测
        openKhdgjHjjc(uuids, unitRef, otherRef, modalTitle);
      } else {
        message.error(msg);
      }
    })
  } else {
    uuids = selectionRowKeys;
    // 调用环境检测
    openKhdgjHjjc(uuids, unitRef, otherRef, modalTitle);
  }
}

// 重新发往税务总局（报关单）
const openKhdgjHjjc = async (uuids: any, param: any, otherRef: any, tsxx:any) => {
  let params = {
    sjgjsjDms: ['010111'],
    icCardPsw: '',
    fgcfsjbz: "Y",
    sftstxbz: "N",
    bgdlx: "",
    csz1: "",
    csz2: "",
    czfdm: "04",
    gxckfphbz: "N",
    tjzdmc: "-",
    uuids:uuids
  };
  const kakxx: any = [];
  queryKak({}).then((res: any) => {
    const {code, msg, body} = res;
    if (code === '200') {
      for (let i = 0; i < body.length; i++) {
        if (body[i].sdbz == 'N') {
          const op = {value: '', label: ''};
          op.label = body[i].kakbm;
          op.value = body[i].kakuuid;
          kakxx.push(op);
        }
      }
      DDAlert.open({
        title: '重新发往税务总局',
        infoType: 'info',
        closeStatus: false,
        isFormContent: true,
        modalType: 'form',
        content: <>
          <div style={{paddingLeft: 52, color: "red"}}>温馨提示：请先执行更新信息状态再执行重新发往税务总局。</div>
          <Form.Item name="kakuuid" label="海关IC卡" rules={[{required: true, message: '请选择口岸卡!'}]} style={{marginTop: 25}}>
            <Select
              style={{width: 240}}
              options={kakxx}
            >
            </Select>
          </Form.Item>
          <div style={{paddingLeft: 52}}>{tsxx}</div>
        </>,
        okCallbackFn: function (thisObj: any) {
          const param = params;
          DDAlert.getForms().validateFields().then(async (values: any) => {
            thisObj.setState({masker: true});
            await xzrwjy(param).then(async (res) => {
              const {code, msg} = res;
              if ('200' == code) {
                await khdgjUtil.checkIsExistTask(values.kakuuid).then(async (res: any) => {
                  if (res == 'Y') {
                    params['kakuuid'] = values.kakuuid;
                    ckbgdFunc.sjxz(params);
                    DDAlert.close();
                  } else if (res == 'E') {
                    DDAlert.close();
                    DDAlert.open({
                      title: '提示信息',
                      info: `客户端工具运行异常，建议尝试以下解决方案：`,
                      infoType: 'warning',
                      okText: '下载工具',
                      closeStatus: false,
                      content: <>
                        <div style={{height: '105', lineHeight: '35px'}}>
                          <div>（1）若已下载最新版本客户端工具，请运行启动客户端工具；</div>
                          <div>（2）若未下载最新版本客户端工具，请下载工具；</div>
                          <div>（3）请确保当前电脑可以登录国际贸易单一窗口</div>
                        </div>
                      </>,
                      button: [
                        <Button key='close' onClick={() => DDAlert.close()}>关闭</Button>,
                        // <Button type="primary" key={'excelmbxz'} onClick={() => ckbgdFunc.downloadKhdgj(thisObj)}>下载IC卡客户端控件</Button>,
                      ],
                      okCallbackFn: async function (thisObj: any) {
                        thisObj.setState({customerBtnLoading: true});
                        let a = document.createElement('a');//创建一个a标签元素
                        a.style.display = 'none';//设置元素不可见
                        a.href = 'https://dditpublic.oss-cn-beijing.aliyuncs.com/SAASTOOLS_UPGRADE/SAASTOOLS2023_20230908/%E5%AE%A2%E6%88%B7%E7%AB%AF%E5%B7%A5%E5%85%B7.zip'; //设置下载地址
                        document.body.appendChild(a);//加入
                        a.click(); //触发点击,下载
                        document.body.removeChild(a);//释放
                        thisObj.setState({customerBtnLoading: false});
                      }
                    });
                  } else {
                    // 打开环境监测页面
                    otherRef[5].current!.showModal({param}, values.kakuuid);
                    DDAlert.close();
                  }
                })
              } else {
                message.error(msg);
              }
            });
            thisObj.setState({masker: false});
          })
        },
      });
    } else {
      message.error(msg);
    }
  });
}
export default Func;
