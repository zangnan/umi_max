import React from 'react';
import {checkSjglRwglBgdbadzqsjcMxckSjxz, hgsjxz, queryKak, xzrwjy} from "@/services/hts/api";
import DDAlert from "@/components/DDAlert";
import khdgjUtil from "@/pages/hts/ckfp/khdgjUtil";
import {Button, Form, message, Select} from 'antd';
import {history} from "@@/core/history";


const Func: any = {
  unitRef: React.createRef(),
};

Func.columnsRender = {
  // 进度查询 -- 执行状态
  renderCzbz: (param: any) => {
    if (!param.text) {
      return '未检查';
    }
    return param.text;
  }
}

Func.bgdbadzqsjcMxckSjxz = async (param: any) => {
  const {unitRef, gridRef} = param;
  const gdfs = gridRef?.current?.getPagination()?.total;
  const zrwuuid = Func.getZrwuuid();
  const badzlxYrw = Func.getBadzlx();
  unitRef.current!.setMasker(true);
  checkSjglRwglBgdbadzqsjcMxckSjxz({zrwuuid: zrwuuid}).then(async (res) => {
    const {code, msg} = res;
    if ('200' == code) {
      /*    { label: '委托报关协议(电子)', value: 'WTBGXY' },
    { label: '出口报关单', value: 'BGDPDF' },
    { label: '无纸化放行通知书', value: 'WZHFXTZS' },
    */
      // #if($xzld == '010301') ## 委托报协议
      // #elseif($xzld == '020101') ## 出口货物报关单
      // #elseif($xzld == '020103') ## 无纸化放行通知书
      const badzlx = [];
      badzlxYrw.forEach((item: any) => {
        if (item == '010301') {
          badzlx.push('WTBGXY');
        } else if (item == '020101') {
          badzlx.push('BGDPDF');
        } else if (item == '020103') {
          badzlx.push('WZHFXTZS');
        }
      });
      const kakxx: any = [];
      queryKak({}).then((res: any) => {
        unitRef.current!.setMasker(false);
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
            title: '备案单证下载',
            infoType: 'info',
            closeStatus: false,
            isFormContent: true,
            modalType: 'form',
            content: <>
              <Form.Item name="kakuuid" label="海关IC卡" rules={[{required: true, message: '请选择口岸卡!'}]}>
                <Select
                  style={{width: 220}}
                  options={kakxx}
                >
                </Select>
              </Form.Item>
              <>
                <div>说明：下载本次比对不存在的报关单号进行备案单证下载。</div>
              </>
            </>,
            okCallbackFn: function (thisObj: any) {
              DDAlert.getForms().validateFields().then(async (values: any) => {
                const kakuuid = values.kakuuid;
                const param = {};
                param['sjgjsjDms'] = ['040000'];
                param['xzld'] = 'bgdbadzqsjcrw';
                param['czfdm'] = '01';
                param['tjzdmc'] = '按报关单号批量下载：涉及报关单' + gdfs + '份';
                param['csz1'] = zrwuuid;
                param['badzlx'] = badzlx;
                const cs: any = {
                  param: param
                }
                thisObj.setState({masker: true});
                khdgjUtil.checkIsExistTask(kakuuid).then(async (res: any) => {
                  if (res == 'N') {
                    await xzrwjy(param).then(async (res) => {
                      thisObj.setState({masker: false});
                      const {code, msg} = res;
                      if ('200' == code) {
                        const otherRef = unitRef.current?.getOtherRefs();
                        if (otherRef) {
                          DDAlert.close();
                          otherRef[0].current?.showModal(cs, kakuuid);
                        }
                      } else {
                        message.error(msg);
                      }
                    });
                  } else if (res == 'E') {
                    thisObj.setState({masker: false});
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
                      ],
                      okCallbackFn: async function (thisObj: any) {
                        thisObj.setState({customerBtnLoading: true});
                        downloadDriver()
                        thisObj.setState({customerBtnLoading: false});
                      }
                    });
                  } else {
                    thisObj.setState({masker: false});
                    //有下载中的任务
                    sjxz(param, kakuuid);
                  }
                });
              })
            },
          });
        } else {
          message.error(msg);
        }
      });
    } else {
      unitRef.current!.setMasker(false);
      message.error(msg);
    }
  });
}

// 下载驱动（在线）
const downloadDriver = async () => {
  let a = document.createElement('a');//创建一个a标签元素
  a.style.display = 'none';//设置元素不可见
  a.href = 'https://dditpublic.oss-cn-beijing.aliyuncs.com/SAASTOOLS_UPGRADE/SAASTOOLS2023_20230908/%E5%AE%A2%E6%88%B7%E7%AB%AF%E5%B7%A5%E5%85%B7.zip'; //设置下载地址
  document.body.appendChild(a);//加入
  a.click(); //触发点击,下载
  document.body.removeChild(a);//释放
}

const sjxz = async (parma: any, kakuuid: any) => {
  parma.kakuuid = kakuuid;
  await hgsjxz(parma).then(async (res) => {
    const {code, msg} = res;
    if ('200' == code) {
      DDAlert.open({
        title: '系统提示',
        info: '创建任务成功，是否跳转任务管理？',
        infoType: 'question',
        modalType: 'confirm',
        okCallbackFn: function (thisObj: any) {
          history.push({pathname: '/02/0201'});
        },
      });
    } else {
      message.error(msg);
    }
  });
}

export default Func;
