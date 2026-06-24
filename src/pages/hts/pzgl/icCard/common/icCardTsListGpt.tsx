
import React, { useState, useImperativeHandle } from 'react';
import { Spin, Button, Modal, message } from 'antd';
import style from './style.less';
import { ExclamationCircleFilled, CheckCircleOutlined, CloseCircleOutlined, LoadingOutlined, CheckCircleFilled, RedoOutlined, CloseCircleFilled, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import CONSTANTS from '@/components/DDAssist/constants';
import { checkKakPassword, saveKakPassword, sqxz, rwscToZffwForGpt, cxzxForGpt } from '@/pages/hts/services/htsApi';
import khdgjUtil from '@/pages/hts/ckfp/khdgjUtil';
import { history } from 'umi';
import cktsUtil from '@/pages/hts/cktsUtil';
import myUtil from '@/components/DDAssist/util';

export interface IcList {
  onRef?: any;
  visible?: any;
  saveBtn?: any;
}

const Index: React.FC<IcList> = ({ onRef, visible = false, saveBtn }) => {
  const [masker, setMasker] = useState(false);
  const [step, setStep] = useState<any>(1);
  const [successFlag, setSuccessFlag] = useState(false);
  const [jc01, setJc01] = useState<any>('');
  const [jc02, setJc02] = useState<any>('');
  const [jc03, setJc03] = useState<any>('');
  const [jc04, setJc04] = useState<any>('');
  const [modalVisible, setModalVisible] = useState(false);
  const [msg, setMsg] = useState('');
  const [khgjUrls, setKhgjUrls] = useState<any>([]);

  const bgdsjly = myUtil.sys.bgdsjlyType();

  // 下载接口入参
  const [params, setParams] = useState<any>({});
  // 口岸卡uuid
  const [kakuuid, setKakuuid] = useState();
  // 口岸卡内容
  const [kakxx, setKakxx] = useState();
  // 重新监测标志
  const [cxjcbz, setCxjcbz] = useState(false);
  //下载flag
  const [xzDyParam, setXzDyParam] = useState('');
  //刷新用
  const [sxparam, setSxparam] = useState('');
  // 开启
  const showModal = (params: any, kakuuid: any, xzDyParam: any,sxparam :any) => {
    if (xzDyParam) {
      setXzDyParam(xzDyParam);
      setSxparam(sxparam);
    }
    setSuccessFlag(false)
    setKakuuid(kakuuid);
    queryKakXx(kakuuid);
    setParams(params);
    setStep(1)
    setJc01('');
    setJc02('');
    setJc03('');
    setJc04('');
    setMsg('');
    initFormData();
  };

  // 初始化数据
  const initFormData = () => {
    setModalVisible(true);
  }

  // 查询口岸卡信息
  const queryKakXx = (param: any) => {
    //查询口岸卡信息
    checkKakPassword({ kakuuid: param }).then(async (res) => {
      const { body, code, msg } = res;
      setMasker(false);
      if (code === '200') {
        setKakxx(body);
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
    if(history?.location?.pathname === '/02/0201'){
      sxparam?.unitRef?.current?.reload2();
      closeModal();
    }else{
      history.push({ pathname: '/02/0201'});
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
    let bodyParam;
    if (num === 1) {
      // 走密码提示信息
      setStep(3);
      start(4);
    } else if (num === 2 || num === 4) {
      // 开始检测
      // 首先 海关IC卡确认
      setStep(3); // 1、让步骤为3， 海关IC卡确认为正确
      // 走接口-获取信息
      await saveKakPassword({ uuid: kakuuid }).then(async (res) => {
        const { body, code } = res;
        if (code == '200') {
          bodyParam = body;
          if (bodyParam) {
            // 关单下载环境检测接口
            let resGdhjjc = await khdgjUtil.gdhjjc(bodyParam);
            if(resGdhjjc.code === '200') {
              setJc01('Y');
              setJc02('Y');
              bodyParam.urls = [
                // "http://www.safe.gov.cn",
                "https://www.singlewindow.cn",
                "https://swapp.singlewindow.cn",
                "https://app.singlewindow.cn",
                "http://kprj.51guanpiao.com",
              ]
              let resKhgj = await khdgjUtil.wlhjjc(bodyParam);
              if(resKhgj.code === '200') {
                const urls = resKhgj.body;
                let urlsArr = 0;
                urls.forEach((item: any) => {
                  if(item.available === 'Y') {
                    urlsArr ++;
                  }
                });
                if(urlsArr === bodyParam.urls.length) {
                  // 成功
                  setJc04('Y');
                  start(7);
                } else {
                  // 失败
                  setJc04('N');
                  setStep(5);
                  const html:any = [];
                  if(urls && urls.length > 0) {
                    urls.forEach((item:any) => {
                      html.push(<div style={{ marginLeft: '5px' }}>{item.url}{item.available === 'Y'?<CheckOutlined style={{ fontSize: '14px', color: '#52C41A' }} />:<CloseOutlined style={{ fontSize: '14px', color: '#ED5353' }}/>}</div>)
                    });
                  }
                  setKhgjUrls(html)
                }

              } else {
                setJc04('N');
                setStep(5);
              }
            } else if (resGdhjjc.code == '51574') {
              setJc01('N');
              setJc02('N');
              setJc03('N');
              setStep(10); // 单一窗口
              start(5);
              setMsg(msg);
            } else if (resGdhjjc.code == '50040') {
              setJc01('Y');
              setJc02('N');
              setJc03('N');
              setStep(5); // 单一窗口
            } else {
              setJc01('N');
              setStep(5);
            }
          } else {
            //系统异常
            setStep(8);
          }
        } else {
          setStep(8);
        }
      });
    } else if (num === 5) {
      //查询口岸卡信息
      checkKakPassword({ kakuuid: kakuuid }).then(async (res) => {
        const { body, code } = res;
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
      // 创建任务
      if(xzDyParam) {
        // 继续执行
        //监测通过，调用接口。
        const paramGpt = {zrwuuid: xzDyParam}
        cxzxForGpt(paramGpt).then(async (res) => {
          const { body, code } = res;
          if (code === '200') {
            const resDownload = await khdgjUtil.gptDownload(body);
            resDownload.kakuuid = kakuuid;
            resDownload.zrwuuid = body.zrwuuid;
            setMasker(true)
            rwscToZffwForGpt(resDownload).then((res2:any)=>{
              setMasker(false)
              if(res2.code != '200') {
                message.info(msg);
              } else {
                setStep(7); // 成功-显示跳转
              }
            });
          } else {
            message.error(res.msg);
          }
        })
      } else {
        //监测通过，调用接口。
        const paramSqxz = params?.param;
        paramSqxz.bgdsjlyDm = '4';
        paramSqxz.kakuuid = kakuuid;
        sqxz(paramSqxz).then(async (res) => {
          const { body, code } = res;
          if (code === '200') {
            const resDownload = await khdgjUtil.gptDownload(body);
            resDownload.zrwuuid = body.zrwuuid;
            resDownload.kakuuid = kakuuid;
            setMasker(true)
            rwscToZffwForGpt(resDownload).then((res2: any)=>{
              setMasker(false)
              if(res2.code != '200') {
                message.info(msg);
              } else {
                setStep(7); // 成功-显示跳转
              }
            });
          } else {
            message.error(res.msg);
          }
        })
      }
    }
  }

  // 工具下载
  const gjxzBtn = async () => {
    setMasker(true)
    let a=document.createElement('a') ;//创建一个a标签元素
    a.style.display='none'  ;//设置元素不可见
    a.href='https://dditpublic.oss-cn-beijing.aliyuncs.com/SAASTOOLS_UPGRADE/SAASTOOLS2023_20230908/%E5%AE%A2%E6%88%B7%E7%AB%AF%E5%B7%A5%E5%85%B7.zip'; //设置下载地址
    document.body.appendChild(a)  ;//加入
    a.click(); //触发点击,下载
    document.body.removeChild(a) ;//释放
    setMasker(false)
  };

  const getContentHeader = (num: any) => {
    const html: any = [];
    if (num === 1) {
      html.push(
        <>
          <div style={{ textAlign: 'center' }}>
            <ExclamationCircleFilled style={{ fontSize: '64px', marginTop: '45px', color: '#FAAD14' }} />
            <div className={style.listTitle}>待检测</div>
          </div>
          <div style={{ width: '470px', marginLeft: 'auto', marginRight: 'auto' }}>
            <div className={style.listSpan}><ExclamationCircleFilled style={{ fontSize: '16px', color: '#FAAD14', marginRight: '10px' }} />请务必确认本次任务选择的海关IC卡与您连接的设备一致</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Button type="primary" onClick={() => start(num)} style={{ marginTop: '16px' }}>确认</Button>
          </div>
        </>
      )
    } else if (num === 2) {
      html.push(
        <>
          <div style={{ textAlign: 'center' }}>
            <ExclamationCircleFilled style={{ fontSize: '64px', marginTop: '45px', color: '#FAAD14' }} />
            <div className={style.listTitle}>待检测</div>
          </div>
          <div style={{ width: '470px', marginLeft: 'auto', marginRight: 'auto' }}>
            <div className={style.listSpan}><ExclamationCircleFilled style={{ fontSize: '16px', color: '#FAAD14', marginRight: '10px' }} />请务必确认本次任务选择的海关IC卡与您连接的设备一致</div>
            <div className={style.listSpan} style={{ color: 'red' }}><ExclamationCircleFilled style={{ fontSize: '16px', color: '#FAAD14', marginRight: '10px' }} />本次使用的密码与上次的错误密码一致，请确认是否继续操作</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Button type="primary" onClick={() => start(num)} style={{ marginTop: '16px' }}>确认</Button>
          </div>
        </>
      )
    } else if (num === 3) {
      html.push(
        <>
          <div style={{ textAlign: 'center' }}>
            <LoadingOutlined style={{ fontSize: '64px', marginTop: '45px', color: '#8FABFF', marginBottom: '15px' }} />
            <div className={style.listTitle}>正在为您进行海关数据下载环境检测...…</div>
          </div>
        </>
      )
    } else if (num === 4 || num === 5 || num === 6) {
      html.push(
        <>
          <div style={{ textAlign: 'center' }}>
            <CloseCircleFilled style={{ fontSize: '64px', marginTop: '45px', color: '#ED5353' }} />
            <div className={style.listTitle}>检测不通过</div>
            <div className={style.listSpan}>请参考系统提供的解决方案进行相应的处理</div>
            <Button type="primary" onClick={() => start(1)} style={{ marginTop: '16px' }}>重新检测</Button>
          </div>
        </>
      )
    } else if (num === 7) {
      html.push(
        <>
          <div style={{ textAlign: 'center' }}>
            <CheckCircleFilled style={{ fontSize: '64px', marginTop: '45px', color: '#52C41A' }} />
            <div className={style.listTitle}>提交成功</div>
            <div className={style.listSpan}>您申请的海关数据下载任务提交成功，可到下载任务管理界面查询任务进度</div>
            <Button type="primary" onClick={() => jcSuccess()} style={{ marginTop: '16px' }}>跳转</Button>
          </div>
        </>
      )
    } else if (num === 8) {
      html.push(
        <>
          <div style={{ textAlign: 'center' }}>
            <CloseCircleFilled style={{ fontSize: '64px', marginTop: '45px', color: '#ED5353' }} />
            <div className={style.listTitle}>检测不通过</div>
            <div className={style.listSpan}>当前口岸卡已经被锁定，请联系管理员进行解锁。</div>
          </div>
        </>
      )
    } else if (num === 9) {
      html.push(
        <>
          <div style={{ textAlign: 'center' }}>
            <CloseCircleFilled style={{ fontSize: '64px', marginTop: '45px', color: '#ED5353' }} />
            <div className={style.listTitle}>系统异常</div>
          </div>
        </>
      )
    }else if (num === 10) {
      html.push(
        <>
          <div style={{ textAlign: 'center' }}>
            <CloseCircleFilled style={{ fontSize: '64px', marginTop: '45px', color: '#ED5353' }} />
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
          {/*
          <div className={style.listdiv}><RedoOutlined spin className={style.loadIcon} /><span className={style.listText}>单一窗口是否可以正常访问及登录，待检测......</span></div> */}
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
              </div>
            </> : <>
              <RedoOutlined spin className={style.loadIcon}/><span className={style.listText}>海关IC卡是否正常连接，待检测......</span>
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
                {/* <div style={{ marginLeft: '5px' }}>http://www.safe.gov.cn；<CheckOutlined style={{ fontSize: '14px', color: '#08c' }} /></div> */}
                {/* <div style={{ marginLeft: '5px' }}>https://www.singlewindow.cn；</div>}
                <div style={{ marginLeft: '5px' }}>https://swapp.singlewindow.cn；</div>
                <div style={{ marginLeft: '5px' }}>https://app.singlewindow.cn；</div>
                <div style={{ marginLeft: '5px' }}>http://kprj.51guanpiao.com；</div> */}
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
          <div className={style.listdiv}><RedoOutlined spin className={style.succIcon}/><span className={style.listText}>海关IC卡是否正常连接，检测通过</span></div>
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
    }
    return html;
  }

  const xgmm = () => {
    history.push({pathname: '/hts/pzgl/icCard/icCardgl'});
  }

  return <>
    <Modal
      title='环境检测'
      keyboard={false}
      visible={modalVisible}
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
