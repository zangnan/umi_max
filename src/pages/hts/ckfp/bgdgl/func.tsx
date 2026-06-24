import React, { useRef } from 'react';
import 'moment/locale/zh-cn';
import { Badge, Form, Select } from "antd";
import DDAlert from '@/pages/hts/commonModule/DDAlert';
import { message, Button } from "antd";
import { queryKak, hgsjxz, xzrwjy } from '@/pages/hts/services/htsApi';
import khdgjUtil from '@/pages/hts/ckfp/khdgjUtil';
import { history } from 'umi';
import cktsUtil from '@/pages/hts/cktsUtil';
import myUtil from '@/components/DDAssist/util';

const Func: any = {
  unitRef: React.createRef(),
};

// 打开弹窗
Func.openBgdxzModal = (param: any) => {
  const otherRef = param.unitRef.current?.getOtherRefs();
  if (otherRef && otherRef[0]) {
    otherRef[0].current?.showModal(param);
  } else if (param.otherRef && param.otherRef[0]) {
    param.otherRef[0].current?.showModal(param);
  }
};

// 列表自定义渲染
Func.columnsRender = {
  // 结关状态
  renderCkfpSjxzBgdJgzt: (param: any) => {
    let col: any = <></>;
    if (param.text === '1') {
      col = (
        <span className="dd_grid_icon">
          <Badge status="success" />{'已结关'}
        </span>
      );
    } else {
      col = (
        <span className="dd_grid_icon">
          <Badge status="error" />{'未结关'}
        </span>
      )
    }
    return col;
  },
  // 开票状态
  renderCkfpSjxzBgdKpzt: (param: any) => {
    let col: any = <></>;
    if (param.text === '2') {
      col = (
        <span className="dd_grid_icon">
          <Badge status="default" />{'未开票'}
        </span>
      );
    } else {
      col = (
        <span className="dd_grid_icon">
          <Badge status="success" />{'已开票'}
        </span>
      )
    }
    return col;
  },
  // 获取状态
  renderCkfpSjxzBgdHqzt: (param: any) => {
    let col: any = <></>;
    if (param.text === '2') {
      col = (
        <span className="dd_grid_icon">
          <Badge status="default" />{'未获取'}
        </span>
      );
    } else {
      col = (
        <span className="dd_grid_icon">
          <Badge status="success" />{'已获取'}
        </span>
      )
    }
    return col;
  }
}

Func.sjxz = async (parma: any) => {
  // parma.kakuuid = '';
  await hgsjxz(parma).then(async (res) => {
    const { body, code, msg } = res;
    if ('200' == code) {
      DDAlert.open({
        title: '系统提示',
        info: '创建任务成功，是否跳转任务管理？',
        infoType: 'question',
        modalType: 'confirm',
        okCallbackFn: function (thisObj: any) {
          history.push({ pathname: '/02/0201' });
        },
      });
    } else {
      message.error(msg);
    }
  });
}

Func.handleBgdTbjgzt = async (param: any) => {
  const { unitRef, otherRef } = param;
  const bgdsjly = myUtil.sys.bgdsjlyType();
  let params = {
    sjgjsjDms: ['070000'],
    icCardPsw: '',
    fgcfsjbz: "Y",
    sftstxbz: "N",
    bgdlx: "",
    csz1: "",
    csz2: "",
    czfdm: "04",
    gxckfphbz: "N",
    tjzdmc: "-"
  };
  const kakxx: any = [];
  queryKak({}).then((res: any) => {
    const { code, msg, body } = res;
    if (code === '200') {
      for (let i = 0; i < body.length; i++) {
        if (body[i].sdbz == 'N') {
          const op = { value: '', label: '' };
          op.label = body[i].kakbm;
          op.value = body[i].kakuuid;
          kakxx.push(op);
        }
      }
      DDAlert.open({
        title: '同步结关状态',
        infoType: 'info',
        closeStatus: false,
        isFormContent: true,
        modalType: 'form',
        content: <>
          <Form.Item name="kakuuid" label="海关IC卡" rules={[{ required: true, message: '请选择口岸卡!' }]}>
            <Select
              style={{ width: 120 }}
              options={kakxx}
              notFoundContent="暂无数据"
            >
            </Select>
          </Form.Item>
        </>,
        okCallbackFn: function (thisObj: any) {
          const param = params;
          thisObj.setState({ masker: true });
          DDAlert.getForms().validateFields().then(async (values: any) => {
            await xzrwjy(param).then(async (res) => {
              const { body, code, msg } = res;
              if ('200' == code) {
                await khdgjUtil.checkIsExistTask(values.kakuuid).then(async (res: any) => {
                  if (res == 'Y') {
                    params.kakuuid = values.kakuuid;
                    Func.sjxz(params);
                    DDAlert.close();
                  } else if (res == 'E') {
                    // message.error('客户端工具连接失败。');
                    // return;
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
                        // <Button type="primary" key={'excelmbxz'} onClick={() => Func.downloadKhdgj(thisObj) }>下载IC卡客户端控件</Button>,
                      ],
                      okCallbackFn: async function (thisObj: any) {
                        thisObj.setState({ customerBtnLoading: true });
                        // 工具类下载
                         // 下载驱动（在线）
                          let a=document.createElement('a') ;//创建一个a标签元素
                          a.style.display='none'  ;//设置元素不可见
                          a.href='https://dditpublic.oss-cn-beijing.aliyuncs.com/SAASTOOLS_UPGRADE/SAASTOOLS2023_20230908/%E5%AE%A2%E6%88%B7%E7%AB%AF%E5%B7%A5%E5%85%B7.zip'; //设置下载地址
                          document.body.appendChild(a)  ;//加入
                          a.click(); //触发点击,下载
                          document.body.removeChild(a) ;//释放

                        thisObj.setState({ customerBtnLoading: false });
                      }
                    });
                  }
                  else {

                    const bgdsjly = myUtil.sys.bgdsjlyType();
                    // by --shilei  去掉判断
                    // if(bgdsjly === '4') {
                    //   otherRef[2].current!.showModal({ param }, values.kakuuid);
                    // } else {
                    //   otherRef[1].current!.showModal({ param }, values.kakuuid);
                    // }
                    otherRef[1].current!.showModal({ param }, values.kakuuid);
                    // 打开环境监测页面
                    DDAlert.close();
                  }
                })
              } else {
                message.error(msg);
              }
            });
            thisObj.setState({ masker: false });
          })
        },
      });
    } else {
      message.error(msg);
    }
  });


    // Func.downloadKhdgj= async (thisObj: any) => {
    //   thisObj.setState({ masker: true });
    //   const params = {
    //     accessClientId: 'dditSaas',
    //     staticFilexx:'hgickkj.exe',
    //   }
    //   await cktsUtil.downloadFileCkts('/yw/bszx/wbsj/bgd/khdgjXzGet/', params)
    //   thisObj.setState({ masker: false });
    // }
    // 下载驱动（在线）
    Func.downloadKhdgj = async (thisObj: any) => {
      thisObj.setState({ masker: true });
      let a = document.createElement('a');//创建一个a标签元素
      a.style.display = 'none';//设置元素不可见
      a.href = 'https://dditpublic.oss-cn-beijing.aliyuncs.com/SAASTOOLS_UPGRADE/SAASTOOLS2023_20230908/%E5%AE%A2%E6%88%B7%E7%AB%AF%E5%B7%A5%E5%85%B7.zip'; //设置下载地址
      document.body.appendChild(a);//加入
      a.click(); //触发点击,下载
      document.body.removeChild(a);//释放
      thisObj.setState({ masker: false });
    }


  // DDAlert.open({
  //   title: '系统提示',
  //   info: '确定要同步当前未结关报关单的结关状态？',
  //   infoType: 'info',
  //   closeStatus: false,
  //   isFormContent: true,
  //   modalType: 'confirm',
  //   okCallbackFn: async function (thisObj: any) {
  //     unitRef.current!.setMasker(true);
  //     //口岸卡密码查询
  //     const result = await queryKakPassword({});
  //     const { code, body } = result;
  //       body.icCardPsw = body.kakmm;
  //       if (code === '200') {
  //         DDAlert.close();
  //         //环境监测
  //         let { jcbz, msg } = await khdgjUtil.khdgjJc(body);
  //         params.icCardPsw =  body.kakmm;
  //           if (jcbz === 'Y') {
  //             hgsjxz(params).then(async (response: any) => {
  //               const { code } = response;
  //               if (code === '200') {
  //                 for(var item of response?.body.taskIds){
  //                   const param = {taskId:'',yhjq:''};
  //                   param.taskId = item;
  //                   param.yhjq = body?.yhjq;
  //                   // 下载
  //                   const flag = await khdgjUtil.khdgjGdxz(param);
  //                   if (flag.code != '200') {
  //                     const p = {xzdyuuid:'',csz1:'',csz2:''};
  //                     p.xzdyuuid = item;
  //                     p.csz1 = flag.code;
  //                     p.csz2 = flag.msg;
  //                     await rwycgx(p).then(async (res) => {
  //                     });
  //                   }

  //                 }
  //                 unitRef.current!.setMasker(false);
  //                 const titleMessage = "下载任务";
  //                 const infoMessage = "启动下载任务成功";
  //                 const contMessage = "可在进度查询菜单里查询下载情况";
  //                 DDAlert.open({
  //                   title: titleMessage,
  //                   info: infoMessage,
  //                   infoType: 'success',
  //                   content: [
  //                     contMessage,
  //                   ],
  //                   okText: '转进度查询',
  //                   okCallbackFn: function () {
  //                     history.push('/02/0201');
  //                   }
  //                 });


  //               }else{
  //                 unitRef.current!.setMasker(false);
  //                 message.error({content: response.msg});
  //               }
  //             });
  //           }else{
  //             unitRef.current!.setMasker(false);
  //             message.error({content: msg});
  //           }
  //       } else {
  //         unitRef.current!.setMasker(false);
  //         DDAlert.close();
  //         message.error('口岸卡密码查询失败！');
  //       }

  //   },
  //   content: '确定要同步当前未结关报关单的结关状态？'
  // });



}


export default Func;
