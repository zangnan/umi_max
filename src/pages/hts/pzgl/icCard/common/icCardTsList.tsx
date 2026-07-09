import React, {useImperativeHandle, useState} from 'react';
import { Button, message, Modal, Spin} from 'antd';
import style from './style.less';
import {CheckCircleFilled, CheckCircleOutlined, CheckOutlined, CloseCircleFilled, CloseCircleOutlined, CloseOutlined, ExclamationCircleFilled, LoadingOutlined, RedoOutlined} from '@ant-design/icons';
import CONSTANTS from '@/components/DDAssist/constants';
import {
  checkKakPassword, createBaseDataTask, cxzxForLtkhdgj, hgsjxz, rwqdToZffwForLtkhdgj, rwycgx, saveKakPassword, sqxz, xhsjzrKakCheckData } from '@/pages/hts/services/htsApi';
import khdgjUtil from '@/pages/hts/ckfp/khdgjUtil';
import {history} from 'umi';
import cktsUtil from '@/pages/hts/cktsUtil';
import myUtil from '@/components/DDAssist/util';

export interface IcList {
  onRef?: any;
  visible?: any;
  saveBtn?: any;
}

const Index: React.FC<IcList> = ({onRef, visible = false, saveBtn}) => {
  const [masker, setMasker] = useState(false);
  const [step, setStep] = useState<any>(1);
  const [jc01, setJc01] = useState<any>('');
  const [jc02, setJc02] = useState<any>('');
  const [jc03, setJc03] = useState<any>('');
  const [jc04, setJc04] = useState<any>('');
  const [modalVisible, setModalVisible] = useState(false);
  const [msg, setMsg] = useState('');
  const [khgjUrls, setKhgjUrls] = useState<any>([]);

  const [sjgjsjDm, setSjgjsjDm] = useState<any>('');

  const bgdsjly = cktsUtil.sys.bgdsjlyType();

  // 下载接口入参
  const [params, setParams] = useState();
  // 口岸卡uuid
  const [kakuuid, setKakuuid] = useState();
  // 重新监测标志
  const [cxjcbz, setCxjcbz] = useState(false);
  //下载flag
  const [xzDyParam, setXzDyParam] = useState('');
  //刷新用
  const [sxparam, setSxparam] = useState('');
  // 开启
  const showModal = (params: any, kakuuid: any, xzDyParam: any, sxparam: any) => {
    if (xzDyParam) {
      setXzDyParam(xzDyParam);
      setSxparam(sxparam);
    }
    setKakuuid(kakuuid);
    queryKakXx(kakuuid);
    setParams(params);
    setStep(1);
    setJc01('');
    setJc02('');
    setJc03('');
    setJc04('');
    setMsg('');
    initFormData();
    const sjgjsjDmVal = params?.param?.sjgjsjDms[0];
    setSjgjsjDm(sjgjsjDmVal ? sjgjsjDmVal : sxparam?.record?.sjgjsjDm);
  };

  // 初始化数据
  const initFormData = () => {
    setModalVisible(true);
  }

  // 查询口岸卡信息
  const queryKakXx = (param: any) => {
    //查询口岸卡信息
    checkKakPassword({kakuuid: param}).then(async (res) => {
      const {body, code, msg} = res;
      setMasker(false);
      if (code === '200') {
        //口岸卡是否锁定
        if (body?.sdbz == 'Y') {
          start(8);
        } else {
          // 口岸卡是否密码异常
          if (body.kakmm == 'Y') {
            setStep(2);
          } else {
            setStep(1);
          }
        }
      } else {
        message.error(msg);
        closeModal();
      }
    });
  }
  // 关闭
  const closeModal = () => {
    setModalVisible(false);
  };


  // 确认判断是否成功
  const jcSuccess = () => {
    if (history?.location?.pathname === '/02/0201') {
      sxparam?.refUnit?.current?.reload2();
      closeModal();
    } else {
      history.push({pathname: '/02/0201'});
    }
  }

  useImperativeHandle(onRef, () => {
    return {
      showModal,
      closeModal,
    };
  });


  // 开始检测
  const start = async (num: any) => {
    // num = 3为加载中状态
    let bodyParam: any;
    if (num === 1) {
      // 走密码提示信息
      setStep(3);
      start(4);
    } else if (num === 2 || num === 4) {
      // 开始检测
      // 首先 海关IC卡确认
      setStep(3); // 1、让步骤为3， 海关IC卡确认为正确
      // 走接口-获取信息
      await saveKakPassword({uuid: kakuuid}).then(async (res: any) => {
        const {body, code} = res;
        if (code == '200') {
          bodyParam = body;
          let resGdhjjc = await khdgjUtil.khdgjJc(bodyParam);
          if (resGdhjjc.code === '200') {
            setJc01('Y');
            setTimeout(() => {
              setJc02('Y'); // 海关IC卡连接正常 Y成功 N失败
            }, 2000)
            setTimeout(() => {
              setJc03('Y'); // 海关IC卡连接正常 Y成功 N失败
            }, 3000)
            if (bodyParam) {
              bodyParam.urls = [
                "https://i.chinaport.gov.cn/",
                "https://www.singlewindow.cn/",
                "https://app.singlewindow.cn/",
                "https://www.chinaport.gov.cn/",
              ]
              let re = await khdgjUtil.wlhjjc(bodyParam);
              let code = re.code;
              let urls = re.body;
              //环境监测成功
              if (code == '200') {
                let urlsArr = 0;
                urls.forEach((item: any) => {
                  if (item.available === 'Y') {
                    urlsArr++;
                  }
                });
                if (urlsArr === bodyParam.urls.length) {
                  setTimeout(() => {
                    setJc04('Y');
                    // setStep(7); // 单一窗口
                    start(7);
                  }, 4000)
                } else {
                  const html: any = [];
                  if (urls && urls.length > 0) {
                    urls.forEach((item: any) => {
                      html.push(<div style={{marginLeft: '5px'}}>{item.url}{item.available === 'Y' ? <CheckOutlined style={{fontSize: '14px', color: '#52C41A'}}/> :
                        <CloseOutlined style={{fontSize: '14px', color: '#ED5353'}}/>}</div>)
                    });
                  }
                  setKhgjUrls(html)
                  setTimeout(() => {
                    setJc04('N');
                    setStep(5); // 单一窗口
                    start(5);
                  }, 4000)
                }
              }
            } else {
              //系统异常
              setJc04('N');
              setStep(8);
            }
          } else if (resGdhjjc.code == '900') {
            setJc01('N');
            setJc02('N'); // 海关IC卡连接正常 Y成功 N失败
            setJc03('N');
            setStep(5); // 单一窗口
            start(5);
          } else if (resGdhjjc.code == '991') {
            setJc01('Y');
            setJc02('N');
            setJc03('N');
            setStep(11); // 单一窗口
            start(5);
            setMsg(resGdhjjc.msg);
          } else if (resGdhjjc.code == '51574') {
            setJc01('N');
            setJc02('N');
            setJc03('N');
            setStep(10); // 单一窗口
            start(5);
            setMsg(resGdhjjc.msg);
          } else if (resGdhjjc.code == '50040') {
            setJc01('Y');
            setJc02('N');
            setJc03('N');
            setStep(5); // 单一窗口
          } else {
            setJc01('N');
            setJc02('N');
            setJc03('N');
            if (resGdhjjc.msg.indexOf('输入口令错误') > -1) {
              setStep(10); // 单一窗口
              start(5);
              setMsg(msg);
            } else {
              setStep(5); // 单一窗口
              start(5);
            }
          }
        } else {
          setStep(8);
        }
      });
    } else if (num === 5) {
      //查询口岸卡信息
      checkKakPassword({kakuuid: kakuuid}).then(async (res) => {
        const {body, code} = res;
        setMasker(false);
        if (code === '200') {
          //口岸卡是否锁定
          if (body.sdbz == 'Y') {
            setCxjcbz(false);
          } else {
            setCxjcbz(true);
          }
        } else {
          message.error(body.msg);
          closeModal();
        }
      });
    } else if (num === 6) {
      setStep(3); // 1、让步骤为3 走接口
    } else if (num === 8) {
      setStep(8); // 口岸卡锁定
    } else if (num === 7) {
      //监测通过，调用接口。
      if (xzDyParam) {
        if (xzDyParam['sjgjsjDm'] == '010106') { // 出口报关单缺失检查
          await khdgjUtil.khdgjGdxzxml(xzDyParam).then(async (res1: any) => {
            const {code, msg} = res1;
            if (code != '200') {
              const p = {uuids: xzDyParam['taskIds'], csz1: '', csz2: ''};
              p.csz1 = 'E';
              p.csz2 = msg;
              await rwycgx(p);
            } else {
              setStep(7); // 成功-显示跳转
            }
          });
        } else if (xzDyParam['sjgjsjDm'] == '010101' || xzDyParam['sjgjsjDm'] == '010201' || sjgjsjDm == '010101' || sjgjsjDm == '010201') {
          // 重新执行
          const paramGpt = {zrwuuid: xzDyParam['taskId']};
          await cxzxForLtkhdgj(paramGpt).then(async (res) => {
            const {body, code, msg} = res;
            if ('200' == code) {
              await khdgjUtil.khdgjGdxz(body['body']).then(async (gdxzRes: any) => { // 单一窗口报关单下载
                if (gdxzRes.code != '200') {
                  const p = {xzdyuuid: paramGpt.zrwuuid, csz1: '', csz2: ''};
                  p.xzdyuuid = paramGpt.zrwuuid;
                  p.csz1 = 'E';
                  p.csz2 = '调用客户端工具启动任务失败';
                  await rwycgx(p);
                  message.error(gdxzRes.msg);
                } else {
                  gdxzRes.zrwuuid = paramGpt.zrwuuid;
                  gdxzRes.kakuuid = kakuuid;
                  setMasker(true)
                  await rwqdToZffwForLtkhdgj(gdxzRes).then((res2: any) => {
                    setMasker(false)
                    if (res2.code != '200') {
                      message.info(msg);
                    } else {
                      setStep(7); // 成功-显示跳转
                    }
                  });
                }
              }).catch(async () => {
                const p = {xzdyuuid: body.zrwuuid, csz1: '', csz2: ''};
                p.xzdyuuid = body.zrwuuid;
                p.csz1 = 'E';
                p.csz2 = '调用客户端工具启动任务失败';
                await rwycgx(p);
                message.error('调用客户端工具失败');
              });
            } else {
              message.error(msg);
            }
          });
        } else {
          const gdxz = await khdgjUtil.khdgjGdxz(xzDyParam);
          if ('200' == gdxz['code']) {
            setStep(7); // 成功-显示跳转
          } else {
            message.error(gdxz['msg']);
          }
        }
      } else {
        // @ts-ignore
        const params1 = params['param'];
        params1.kakuuid = kakuuid;
        if (sjgjsjDm == '010101' || sjgjsjDm == '010201') {
          params1.bgdsjlyDm = '3';
          await sqxz(params1).then(async (res) => {
            const {body, code, msg} = res;
            if ('200' == code) {

              if (params1.sjzruuid) {
                // TODO 新户数据准入-调用基础数据报关单数据下载
                const bgdbBaseData = {zrwuuid: body.taskId, sjzruuid: params1.sjzruuid, xzlx: 'bgd', xzzqDm: params1.xzzqDm};
                const bgdJcsjxz = await createBaseDataTask(bgdbBaseData);
                if (bgdJcsjxz.code !== '200') {
                  message.error(bgdJcsjxz.msg);
                  return;
                }
              }

              await khdgjUtil.khdgjGdxz(body['body']).then(async (res1: any) => { // 单一窗口报关单下载
                if (res1.code != '200') {
                  const p = {xzdyuuid: body.zrwuuid, csz1: '', csz2: ''};
                  p.xzdyuuid = body.zrwuuid;
                  p.csz1 = 'E';
                  p.csz2 = '调用客户端工具启动任务失败';
                  await rwycgx(p);
                  message.error(res1.msg);
                } else {
                  res1.zrwuuid = body.zrwuuid;
                  res1.kakuuid = kakuuid;
                  setMasker(true)
                  await rwqdToZffwForLtkhdgj(res1).then((res2: any) => {
                    setMasker(false)
                    if (res2.code != '200') {
                      message.info(msg);
                    } else {
                      setStep(7); // 成功-显示跳转
                    }
                  });
                }
              }).catch(async () => {
                const p = {xzdyuuid: body.zrwuuid, csz1: '', csz2: ''};
                p.xzdyuuid = body.zrwuuid;
                p.csz1 = 'E';
                p.csz2 = '调用客户端工具启动任务失败';
                await rwycgx(p);
                message.error('调用客户端工具失败');
              });
            } else {
              message.error(msg);
            }
          });
        } else {
          await hgsjxz(params1).then(async (res) => {
            const {body, code, msg} = res;
            const param = {};
            if ('200' == code) {
              if (sjgjsjDm == '010106') { // 口岸关单XML下载
                param['taskIds'] = body.taskIds;
                param['yhjq'] = body?.yhjq;
                await khdgjUtil.khdgjGdxzxml(param).then(async (res1: any) => {
                  const {code, msg} = res1;
                  if (code != '200') {
                    const p = {uuids: body.taskIds, csz1: '', csz2: ''};
                    p.csz1 = 'E';
                    p.csz2 = msg;
                    await rwycgx(p);
                  }
                  setStep(7); // 成功-显示跳转
                });
              } else {
                for (var item of body.taskIds) {
                  param['taskId'] = item;
                  param['yhjq'] = body?.yhjq;
                  if (sjgjsjDm == '010111') { // 关单重新发往总局下载
                    await khdgjUtil.khdgjGdcd(param).then(async (res1: any) => {
                      const {code, msg} = res1;
                      if (code != '200') {
                        const p = {xzdyuuid: item, csz1: '', csz2: ''};
                        p.xzdyuuid = item;
                        p.csz1 = 'E';
                        p.csz2 = msg;
                        await rwycgx(p);
                      }
                      setStep(7); // 成功-显示跳转
                    });
                  } else {
                    await khdgjUtil.khdgjGdxz(param).then(async (res1: any) => { // 单一窗口报关单下载
                      const {code, msg} = res1;
                      if (code != '200') {
                        const p = {xzdyuuid: item, csz1: '', csz2: ''};
                        p.xzdyuuid = item;
                        p.csz1 = 'E';
                        p.csz2 = msg;
                        await rwycgx(p);
                      }
                      setStep(7); // 成功-显示跳转
                    });
                  }
                }
              }
            } else {
              message.error(msg);
            }
          });
        }
      }
    }
  }
  // 工具下载
  const gjxzBtn = async () => {
    setMasker(true)
    let a = document.createElement('a');//创建一个a标签元素
    a.style.display = 'none';//设置元素不可见
    a.href = 'https://dditpublic.oss-cn-beijing.aliyuncs.com/SAASTOOLS_UPGRADE/SAASTOOLS2023_20230908/%E5%AE%A2%E6%88%B7%E7%AB%AF%E5%B7%A5%E5%85%B7.zip'; //设置下载地址
    document.body.appendChild(a);//加入
    a.click(); //触发点击,下载
    document.body.removeChild(a);//释放
    setMasker(false)
  };
  //下载海关IC卡客户端控件
  const gjxzBtn2 = async () => {
    const params = {
      accessClientId: 'dditSaas',
      staticFilexx: 'hgickkj.exe',
    }
    // 工具类下载
    setMasker(true);
    await cktsUtil.downloadFileCkts('/yw/bszx/wbsj/bgd/khdgjXzGet/', params);
    setMasker(false);
  };


  const xgmm = () => {
    history.push({pathname: '/hts/pzgl/icCard/icCardgl'});
  }


  const getContentHeader = (num: any) => {
    const html: any = [];
    if (num === 1) {
      html.push(
        <>
          <div style={{textAlign: 'center'}}>
            <ExclamationCircleFilled style={{fontSize: '64px', marginTop: '45px', color: '#FAAD14'}}/>
            <div className={style.listTitle}>待检测</div>
          </div>
          <div style={{width: '470px', marginLeft: 'auto', marginRight: 'auto'}}>
            <div className={style.listSpan}><ExclamationCircleFilled style={{fontSize: '16px', color: '#FAAD14', marginRight: '10px'}}/>请务必确认本次任务选择的海关IC卡与您连接的设备一致
            </div>
          </div>
          <div style={{textAlign: 'center'}}>
            <Button type="primary" onClick={() => start(num)} style={{marginTop: '16px'}}>确认</Button>
          </div>
        </>
      )
    } else if (num === 2) {
      html.push(
        <>
          <div style={{textAlign: 'center'}}>
            <ExclamationCircleFilled style={{fontSize: '64px', marginTop: '45px', color: '#FAAD14'}}/>
            <div className={style.listTitle}>待检测</div>
          </div>
          <div style={{width: '470px', marginLeft: 'auto', marginRight: 'auto'}}>
            <div className={style.listSpan}><ExclamationCircleFilled style={{fontSize: '16px', color: '#FAAD14', marginRight: '10px'}}/>请务必确认本次任务选择的海关IC卡与您连接的设备一致
            </div>
            <div className={style.listSpan} style={{color: 'red'}}><ExclamationCircleFilled style={{fontSize: '16px', color: '#FAAD14', marginRight: '10px'}}/>本次使用的密码与上次的错误密码一致，请确认是否继续操作
            </div>
          </div>
          <div style={{textAlign: 'center'}}>
            <Button type="primary" onClick={() => start(num)} style={{marginTop: '16px'}}>确认</Button>
          </div>
        </>
      )
    } else if (num === 3) {
      html.push(
        <>
          <div style={{textAlign: 'center'}}>
            <LoadingOutlined style={{fontSize: '64px', marginTop: '45px', color: '#8FABFF', marginBottom: '15px'}}/>
            <div className={style.listTitle}>正在为您进行海关数据下载环境检测...…</div>
          </div>
        </>
      )
    } else if (num === 4 || num === 5 || num === 6) {
      html.push(
        <>
          <div style={{textAlign: 'center'}}>
            <CloseCircleFilled style={{fontSize: '64px', marginTop: '45px', color: '#ED5353'}}/>
            <div className={style.listTitle}>检测不通过</div>
            <div className={style.listSpan}>请参考系统提供的解决方案进行相应的处理</div>
            {cxjcbz ? <Button type="primary" onClick={() => start(1)} style={{marginTop: '16px'}}>重新检测</Button> : <></>}
          </div>
        </>
      )
    } else if (num === 7) {
      html.push(
        <>
          <div style={{textAlign: 'center'}}>
            <CheckCircleFilled style={{fontSize: '64px', marginTop: '45px', color: '#52C41A'}}/>
            <div className={style.listTitle}>提交成功</div>
            <div className={style.listSpan}>您申请的海关数据下载任务提交成功，可到下载任务管理界面查询任务进度</div>
            <Button type="primary" onClick={() => jcSuccess()} style={{marginTop: '16px'}}>跳转</Button>
          </div>
        </>
      )
    } else if (num === 8) {
      html.push(
        <>
          <div style={{textAlign: 'center'}}>
            <CloseCircleFilled style={{fontSize: '64px', marginTop: '45px', color: '#ED5353'}}/>
            <div className={style.listTitle}>检测不通过</div>
            <div className={style.listSpan}>当前口岸卡已经被锁定，请联系管理员进行解锁。</div>
          </div>
        </>
      )
    } else if (num === 9) {
      html.push(
        <>
          <div style={{textAlign: 'center'}}>
            <CloseCircleFilled style={{fontSize: '64px', marginTop: '45px', color: '#ED5353'}}/>
            <div className={style.listTitle}>系统异常</div>
          </div>
        </>
      )
    } else if (num === 10) {
      html.push(
        <>
          <div style={{textAlign: 'center'}}>
            <CloseCircleFilled style={{fontSize: '64px', marginTop: '45px', color: '#ED5353'}}/>
            <div className={style.listTitle}>检测不通过</div>
            <div className={style.listSpan}>请参考系统提供的解决方案进行相应的处理</div>
          </div>
        </>
      )
    }
    return html
  }

  const getContentList = (num: any) => {
    const html: any = [];
    if (num === 1 || num === 2) {
      html.push(
        <>
          <div className={style.listdiv}><RedoOutlined spin className={style.loadIcon}/><span className={style.listText}>海关IC卡确认，待确认......</span></div>
          <div className={style.listdiv}><RedoOutlined spin className={style.loadIcon}/><span className={style.listText}>慧退税客户端工具是否正常运行，待检测......</span></div>
          <div className={style.listdiv}><RedoOutlined spin className={style.loadIcon}/><span className={style.listText}>海关IC卡是否正常连接，待检测......</span></div>
          <div className={style.listdiv}><RedoOutlined spin className={style.loadIcon}/><span className={style.listText}>单一窗口是否可以正常访问及登录，待检测......</span></div>
          <div className={style.listdiv}><RedoOutlined spin className={style.loadIcon}/><span className={style.listText}>本地所需端口是否正常开放，待检测......</span></div>
        </>
      )
    } else if (num === 3 || num === 4 || num === 5 || num === 6) {
      html.push(
        <>
          <div className={style.listdiv}><CheckCircleOutlined className={style.succIcon}/><span className={style.listText}>海关IC卡已确认</span></div>
          <div className={style.listdiv}>
            {jc01 === 'Y' ? <>
              <CheckCircleOutlined className={style.succIcon}/><span className={style.listText}>慧退税客户端工具运行正常，检测通过</span>
            </> : jc01 === 'N' ? <>
              <CloseCircleOutlined className={style.errorIcon}/>
              <span className={style.listText}>慧退税客户端工具运行异常，检测不通过</span>
              <div className={style.errorText}>
                <div>客户端工具运行异常，建议尝试以下解决方案：</div>
                <div style={{marginLeft: '5px'}}>（1）若已下载最新版本客户端工具，请运行启动客户端工具；</div>
                <div style={{marginLeft: '5px'}}>（2）若未下载最新版本客户端工具，请<a onClick={gjxzBtn}>下载工具</a>；</div>
                {bgdsjly != '4' ?
                  <div style={{marginLeft: '5px'}}>（3）请确保当前电脑可以登录国际贸易单一窗口</div> : <></>}
              </div>
            </> : <><RedoOutlined spin className={style.loadIcon}/><span className={style.listText}>慧退税客户端工具是否正常运行，待检测......</span> </>}
          </div>
          <div className={style.listdiv}>
            {jc02 === 'Y' ? <>
              <CheckCircleOutlined className={style.succIcon}/><span className={style.listText}>海关IC卡是否正常连接，待检测......</span>
            </> : jc02 === 'N' ? <>
              <CloseCircleOutlined className={style.errorIcon}/>
              <span className={style.listText}>海关IC卡客户端控件运行异常，检测不通过</span>
              <div className={style.errorText}>
                <div>打开读卡器失败，建议尝试以下解决方案：</div>
                <div style={{marginLeft: '5px'}}>（1）海关IC卡连接失败，请检查IC卡是否正确连接到电脑，可以反复插拔再检测；</div>
                <div style={{marginLeft: '5px'}}>（2）请确保单一窗口可以正常访问，并可以正常登录（<a
                  href="https://app.singlewindow.cn/cas/login?service=https%3A%2F%2Fi.chinaport.gov.cn%2Fdeskserver%2Fj_spring_cas_security_check" target="_blank">登录单一窗口）</a>；
                </div>
                {bgdsjly != '4' ?
                  <div style={{marginLeft: '5px'}}>（3）请确保当前电脑可以登录国际贸易单一窗口</div> : <></>}
              </div>
            </> : <>
              <RedoOutlined spin className={style.loadIcon}/><span className={style.listText}>海关IC卡是否正常连接，待检测......</span>
            </>
            }
          </div>
          <div className={style.listdiv}>
            {jc03 === 'Y' ? <>
              <CheckCircleOutlined className={style.succIcon}/><span className={style.listText}>单一窗口可以正常访问及登录，检测通过</span>
            </> : jc03 === 'N' ? <>
              <CloseCircleOutlined className={style.errorIcon}/>
              <span className={style.listText}>无法正常登录单一窗口，检测不通过</span>
              <div className={style.errorText}>
                <div>请确保单一窗口可以正常访问，并可以正常登录。（<a
                  href="https://app.singlewindow.cn/cas/login?service=https%3A%2F%2Fi.chinaport.gov.cn%2Fdeskserver%2Fj_spring_cas_security_check" target="_blank">登录单一窗口）</a>
                </div>
                <div>退出平台，更换海关IC卡重新登录。</div>
              </div>
            </> : <>
              <RedoOutlined spin className={style.loadIcon}/><span className={style.listText}>单一窗口是否可以正常访问及登录，待检测......</span>
            </>
            }
          </div>
          <div className={style.listdiv}>
            {jc04 === 'Y' ? <>
              <CheckCircleOutlined className={style.succIcon}/><span className={style.listText}>本地所需端口正常开放，检测通过</span>
            </> : jc04 === 'N' ? <>
              <CloseCircleOutlined className={style.errorIcon}/>
              <span className={style.listText}>本地所需端口是否正常开放，检测不通过</span>
              <div className={style.errorText}>
                <div>请确保以下本地端口正常开放：</div>
                {khgjUrls}
              </div>
            </> : <>
              <RedoOutlined spin className={style.loadIcon}/><span className={style.listText}>本地所需端口是否正常开放，待检测......</span>
            </>
            }
          </div>
        </>
      )
    } else if (num === 7) {
      html.push(
        <>
          <div className={style.listdiv}><CheckCircleOutlined className={style.succIcon}/><span className={style.listText}>海关IC卡已确认</span></div>
          <div className={style.listdiv}><CheckCircleOutlined className={style.succIcon}/><span className={style.listText}>慧退税客户端工具运行正常，检测通过</span></div>
          <div className={style.listdiv}><CheckCircleOutlined className={style.succIcon}/><span className={style.listText}>海关IC卡连接正常，检测通过</span></div>
          <div className={style.listdiv}><CheckCircleOutlined className={style.succIcon}/><span className={style.listText}>单一窗口可以正常访问及登录，检测通过</span></div>
          <div className={style.listdiv}><CheckCircleOutlined className={style.succIcon}/><span className={style.listText}>本地所需端口正常开放，检测通过</span></div>
        </>
      )
    } else if (num === 10) {
      html.push(
        <>
          <div className={style.errorText}>
            <div style={{marginLeft: '5px'}}>检测不通过原因：{msg}</div>
            <div style={{marginLeft: '5px', marginTop: '5px'}}>（1）<a onClick={xgmm}>修改海关IC卡密码</a></div>
            <div style={{marginLeft: '5px'}}>（2）温馨提示：密码如果连续输入错误，系统将锁定海关IC卡。</div>
          </div>
        </>
      )
    } else if (num === 11) {
      html.push(
        <>
          <div className={style.errorText}>
            <div style={{marginLeft: '5px'}}>检测不通过原因：{msg}</div>
          </div>
        </>
      )
    }
    return html;
  }

  return <>
    <Modal
      title='环境检测'
      keyboard={false}
      open={modalVisible}
      width={CONSTANTS.C_MODAL_WIDTH_X4}
      wrapClassName='standard-modal-1'
      closable={true}
      onCancel={closeModal}
      footer={false}
    >
      <Spin tip="Loading..." spinning={masker} delay={100}>
        <div>
          {getContentHeader(step)}
        </div>
        <div className={style.listBox}>
          {getContentList(step)}
        </div>
      </Spin>
    </Modal>
  </>;
};

export default Index;
