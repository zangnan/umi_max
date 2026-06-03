
import React, { useState, useImperativeHandle } from 'react';
import { Spin, Button, Modal, message } from 'antd';
import style from './style.less';
import { ExclamationCircleFilled, CheckCircleOutlined, CloseCircleOutlined, LoadingOutlined, CheckCircleFilled, RedoOutlined, CloseCircleFilled, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import pro from '@/pages/common/proConfig';
import { checkKakPassword, saveKakPassword, hgsjxz } from '@/services/hts/api';
import khdgjUtil from '@/pages/hts/ckfp/khdgjUtil';
import { cloneDeep } from 'lodash';
import cktsUtil from '@/pages/common/cktsUtil';
import myUtil from '@/pages/common/myUtil';
import DDAlert from '@/components/DDAlert';

export interface IcList {
  onRef?: any;
  visible?: any;
  saveBtn?: any;
  setDzkaickkh:any;
}

const Index: React.FC<IcList> = ({ onRef, visible = false, saveBtn ,setDzkaickkh}) => {
  const [masker, setMasker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  // 口岸卡内容
  const [kakxx, setKakxx] = useState();
  // 头部内容
  const [contentHeader, setContentHeader] = useState<any>(1);
  // body内容
  const [contentBody, setContentBody] = useState<any>(1);
  const [icCardId, setIcCardId] = useState('');
  const [yqy, setYqy] = useState('');
  const [xqy, setXqy] = useState('');

  const bgdsjly = myUtil.sys.bgdsjlyType();

  // 开启
  const showModal = (data: any) => {
    initFormData(data[0]?.kakuuid, data[0]?.kakmm);
    setIcCardId(data[0]?.dzkaickkh);
  };

  // 下载驱动（在线）
  const downloadDriver = async () => {
    setMasker(true)
    let a = document.createElement('a');//创建一个a标签元素
    a.style.display = 'none';//设置元素不可见
    a.href = 'https://dditpublic.oss-cn-beijing.aliyuncs.com/SAASTOOLS_UPGRADE/SAASTOOLS2023_20230908/%E5%AE%A2%E6%88%B7%E7%AB%AF%E5%B7%A5%E5%85%B7.zip'; //设置下载地址
    document.body.appendChild(a);//加入
    a.click(); //触发点击,下载
    document.body.removeChild(a);//释放
    setMasker(false)
  }

  // 初始化数据
  const initFormData = async (kakuuid: any, kakmm: any) => {
    // 1.根据口岸卡UUID，获取参数。
    setMasker(true);
    await saveKakPassword({ uuid: kakuuid }).then(async (res: any) => {
      setMasker(false);
      if (res?.code === '200') {
        // 打开环境监测页面
        const body = res?.body;
        const userInfo = myUtil.sessionStore.getItem('userInfo');
        body.host = userInfo?.xtCs.host;
        body.port = userInfo?.xtCs.port;
        body.prefix = userInfo?.xtCs.prefix;
        body.enableSsl= userInfo?.xtCs.enableSsl;
        body.kakuuid = kakuuid;
        const check = await khdgjUtil.checkkhdgj(body);
        if (check === "E") {
          DDAlert.open({
            title: '提示信息',
            info: `客户端工具运行异常，建议尝试以下解决方案：`,
            infoType: 'warning',
            okText: '下载工具',
            closeStatus: false,
            content: <>
              <div style={{ height: '105', lineHeight: '35px' }}>
                <div>（1）若已下载最新版本客户端工具，请运行启动客户端工具；</div>
                <div>（2）若未下载最新版本客户端工具，请下载工具；</div>
                {bgdsjly != '4' ? <div>（3）请确保当前电脑可以登录国际贸易单一窗口</div> : <></>}
              </div>
            </>,
            button: [
              <Button key='close' onClick={() => DDAlert.close()}>关闭</Button>,
              // bgdsjly != '4' ? <Button type="primary" key={'excelmbxz'} onClick={() => downloadDriver()}>下载IC卡客户端控件</Button> : <></>,
            ],
            okCallbackFn: async function (thisObj: any) {
              thisObj.setState({ customerBtnLoading: true });
              downloadDriver();
              thisObj.setState({ customerBtnLoading: false });
            }
          });
        } else {
          setKakxx(body);
          //查询口岸卡信息
          setMasker(true);
          await checkKakPassword({ kakuuid: kakuuid }).then(async (res) => {
            const { body, code, } = res;
            setMasker(false);
            if (code === '200') {
              //口岸卡是否锁定
              if (body?.sdbz == 'Y') {
                message.error('口岸卡已锁定，请联系管理员！');
              } else {
                setModalVisible(true);
                // 口岸卡是否密码异常
                if (body.mmycbz == 'Y') {
                  setContentHeader(2);
                  setContentBody(1);
                } else {
                  setContentHeader(1);
                  setContentBody(1);
                }
              }
            } else {
              message.error(body.msg);
            }
          });
        }
      } else {
        message.error(res.msg);
      }
    });
  }



  // 关闭
  const closeModal = () => {
    setModalVisible(false);
  };




  useImperativeHandle(onRef, () => {
    return {
      showModal,
      closeModal,
    };
  });



  // 开始检测
  const start = async (num: any) => {
    // 开始监测客户端工具是否正常运行
    if (num === 2) {
      setContentHeader(3);
      setContentBody(2);
      start(3);
    }
    if (num === 3) {
      let temp2 = cloneDeep(kakxx);
      const userInfo = myUtil.sessionStore.getItem('userInfo');
      const nsrmc = userInfo?.qxQys[0].nsrmc;
      temp2.icCardId = icCardId;
      temp2.nsrmc = nsrmc;
      let re = await khdgjUtil.cxDsxzRw(temp2);
      if(re?.code == "200" ){
        setDzkaickkh(re?.body?.icCardId);
        if(re?.body?.sbqyuuid === re?.body?.ysbqyuuid){
          setContentBody(3);
          start(4);
        }else{
          setYqy(re?.body?.ynsrmc);
          setXqy(re?.body?.nsrmc);
          setContentBody(6);
        }
      } else {
        setContentHeader(4);
        setContentBody(7);
      }

    }
    if (num === 4) {
      setContentHeader(3);
      let temp = cloneDeep(kakxx);
      temp.urls = [
        "https://i.chinaport.gov.cn/",
        "https://www.singlewindow.cn/",
        "https://app.singlewindow.cn/",
        "https://www.chinaport.gov.cn/",
      ]
      let re = await khdgjUtil.wlhjjc(temp);
      if (re.code == "200") {
        setContentBody(4);
        start(5);
      } else {
        setContentHeader(4);
        setContentBody(8);
      }

    }
    if (num === 5) {
      let temp2 = cloneDeep(kakxx);
      let re = await khdgjUtil.gdhjjc(temp2);
      if (re.code == "200") {
        setContentHeader(5);
        setContentBody(5);
      } else {
        setContentHeader(4);
        setContentBody(9);
      }
    }
  }





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
            <Button type="primary" onClick={() => start(2)} style={{ marginTop: '16px' }}>确认</Button>
          </div>
        </>
      )
    }
    else if (num === 2) {
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
    }
    else if (num === 3) {
      html.push(
        <>
          <div style={{ textAlign: 'center' }}>
            <LoadingOutlined style={{ fontSize: '64px', marginTop: '45px', color: '#8FABFF', marginBottom: '15px' }} />
            <div className={style.listTitle}>正在为您进行海关数据下载环境检测...…</div>
          </div>
        </>
      )
    }
    else if (num === 4) {
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
    else if (num === 5) {
      html.push(
        <>
          <div style={{ textAlign: 'center' }}>
            <CheckCircleFilled style={{ fontSize: '64px', marginTop: '45px', color: '#52C41A' }} />
            <div className={style.listTitle}>环境检测通过！</div>
            <div className={style.listSpan}>请点击“确认”按钮提交任务！</div>
            <Button type="primary" onClick={() => jcSuccess()} style={{ marginTop: '16px' }}>确定</Button>
          </div>
        </>
      )
    }
    return html
  }


  const jcSuccess = () => {
    closeModal();
    saveBtn(kakxx);
  }


  const ok = () => {
    setContentBody(3);
    start(4);
  }
  const qx = () => {
    setContentHeader(4);
    setContentBody(10);
  }


  const getContentBody = (num: any) => {
    const html: any = [];
    if (num === 1) {
      html.push(
        <>
          <div className={style.listdiv}><RedoOutlined spin className={style.loadIcon} /><span className={style.listText}>海关IC卡确认，待确认......</span></div>
          <div className={style.listdiv}><RedoOutlined spin className={style.loadIcon} /><span className={style.listText}>海关IC卡是否正常运行，待检测......</span></div>
          <div className={style.listdiv}><RedoOutlined spin className={style.loadIcon} /><span className={style.listText}>网络环境是否正常运行，待检测......</span></div>
          <div className={style.listdiv}><RedoOutlined spin className={style.loadIcon} /><span className={style.listText}>关单环境是否正常运行，待检测......</span></div>
        </>
      )
    }
    if (num === 2) {
      html.push(
        <>
          <div className={style.listdiv}><CheckCircleOutlined className={style.succIcon} /><span className={style.listText}>海关IC卡已确认</span></div>
          <div className={style.listdiv}><RedoOutlined spin className={style.loadIcon} /><span className={style.listText}>海关IC卡是否正常运行，待检测......</span></div>
          <div className={style.listdiv}><RedoOutlined spin className={style.loadIcon} /><span className={style.listText}>网络环境是否正常运行，待检测......</span></div>
          <div className={style.listdiv}><RedoOutlined spin className={style.loadIcon} /><span className={style.listText}>关单环境是否正常运行，待检测......</span></div>
        </>
      )
    }
    if (num === 3) {
      html.push(
        <>
          <div className={style.listdiv}><CheckCircleOutlined className={style.succIcon} /><span className={style.listText}>海关IC卡已确认</span></div>
          <div className={style.listdiv}><CheckCircleOutlined className={style.succIcon} /><span className={style.listText}>海关IC卡运行正常，检测通过</span></div>
          <div className={style.listdiv}><RedoOutlined spin className={style.loadIcon} /><span className={style.listText}>网络环境是否正常运行，待检测......</span></div>
          <div className={style.listdiv}><RedoOutlined spin className={style.loadIcon} /><span className={style.listText}>关单环境是否正常运行，待检测......</span></div>
        </>
      )
    }
    if (num === 4) {
      html.push(
        <>
          <div className={style.listdiv}><CheckCircleOutlined className={style.succIcon} /><span className={style.listText}>海关IC卡已确认</span></div>
          <div className={style.listdiv}><CheckCircleOutlined className={style.succIcon} /><span className={style.listText}>海关IC卡正常运行，检测通过</span></div>
          <div className={style.listdiv}><CheckCircleOutlined className={style.succIcon} /><span className={style.listText}>网络环境是否正常运行，检测通过</span></div>
          <div className={style.listdiv}><RedoOutlined spin className={style.loadIcon} /><span className={style.listText}>关单环境是否正常运行，待检测......</span></div>
        </>
      )
    }
    if (num === 5) {
      html.push(
        <>
          <div className={style.listdiv}><CheckCircleOutlined className={style.succIcon} /><span className={style.listText}>海关IC卡已确认</span></div>
          <div className={style.listdiv}><CheckCircleOutlined className={style.succIcon} /><span className={style.listText}>海关IC卡正常运行，检测通过</span></div>
          <div className={style.listdiv}><CheckCircleOutlined className={style.succIcon} /><span className={style.listText}>网络环境运行正常，检测通过</span></div>
          <div className={style.listdiv}><CheckCircleOutlined className={style.succIcon} /><span className={style.listText}>关单环境运行正常，检测通过</span></div>
        </>
      )
    }

    if (num === 6) {
      html.push(
        <>
          <div className={style.listdiv}><CheckCircleOutlined className={style.succIcon} /><span className={style.listText}>海关IC卡已确认</span></div>
          <div className={style.listdiv}>
            <CloseCircleOutlined className={style.errorIcon} />
            <span className={style.listText}>检测到客户端已绑定{yqy}企业定时任务，确认要更新为{xqy}吗？</span>
            <Button type='link' onClick={ok}>确定</Button>
            <Button type='link' onClick={qx}>取消</Button>
          </div>
          <div className={style.listdiv}><RedoOutlined spin className={style.loadIcon} /><span className={style.listText}>网络环境是否正常运行，待检测......</span></div>
          <div className={style.listdiv}><RedoOutlined spin className={style.loadIcon} /><span className={style.listText}>关单环境是否正常运行，待检测......</span></div>
        </>
      )
    }
    // 客户端工具未连接
    if (num === 7) {
      html.push(
        <>
          <div className={style.listdiv}><CheckCircleOutlined className={style.succIcon} /><span className={style.listText}>海关IC卡已确认</span></div>
          <div className={style.listdiv}>
            <CloseCircleOutlined className={style.errorIcon} />
            <span className={style.listText}>海关IC卡运行异常，检测不通过</span>
          </div>
          <div className={style.listdiv}><RedoOutlined spin className={style.loadIcon} /><span className={style.listText}>网络环境是否正常运行，待检测......</span></div>
          <div className={style.listdiv}><RedoOutlined spin className={style.loadIcon} /><span className={style.listText}>海关IC卡是否正常运行，待检测......</span></div>
        </>
      )
    }
    if (num === 8) {
      html.push(
        <>
          <div className={style.listdiv}><CheckCircleOutlined className={style.succIcon} /><span className={style.listText}>海关IC卡已确认</span></div>
          <div className={style.listdiv}><CheckCircleOutlined spin className={style.succIcon} /><span className={style.listText}>海关IC卡正常运行，检测通过</span></div>
          <div className={style.listdiv}>
            <CloseCircleOutlined className={style.errorIcon} />
            <span className={style.listText}>无法正常登录单一窗口，检测不通过</span>
            <div className={style.errorText}>
              <div>请确保单一窗口可以正常访问，并可以正常登录。（<a href="https://app.singlewindow.cn/cas/login?service=https%3A%2F%2Fi.chinaport.gov.cn%2Fdeskserver%2Fj_spring_cas_security_check" target="_blank">登录单一窗口）</a></div>
              <div>退出平台，更换海关IC卡重新登录。</div>
            </div>
          </div>
          <div className={style.listdiv}><RedoOutlined spin className={style.loadIcon} /><span className={style.listText}>关单环境是否正常运行，待检测......</span></div>
        </>
      )
    }
    if (num === 9) {
      html.push(
        <>
          <div className={style.listdiv}><CheckCircleOutlined className={style.succIcon} /><span className={style.listText}>海关IC卡已确认</span></div>
          <div className={style.listdiv}><CheckCircleOutlined className={style.succIcon} /><span className={style.listText}>客户端工具运行正常，检测通过</span></div>
          <div className={style.listdiv}><CheckCircleOutlined className={style.succIcon} /><span className={style.listText}>网络环境运行正常，检测通过</span></div>
          <div className={style.listdiv}>
            <CloseCircleOutlined className={style.errorIcon} />
            <span className={style.listText}>关单环境运行异常，检测不通过</span>
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
      visible={modalVisible}
      width={pro.c_modal_width_x4}
      wrapClassName='standard-modal-1'
      closable={true}
      onCancel={closeModal}
      footer={false}
    >
      <Spin tip="Loading..." spinning={masker} delay={100}>
        <div>
          {getContentHeader(contentHeader)}
        </div>
        <div className={style.listBox}>
          {getContentBody(contentBody)}
        </div>
      </Spin>
    </Modal>
  </>;
};

export default Index;
