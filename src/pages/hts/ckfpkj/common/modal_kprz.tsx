import React, { useImperativeHandle, useState } from 'react';
import { Modal, message, Spin } from 'antd';
import './style.less';
import { ExclamationCircleFilled, SyncOutlined } from '@ant-design/icons';
import { sdpPrCode, getSfrzcode } from '@/pages/hts/services/htsApi';
import DDAlert from '@/pages/hts/components/DDAlert';
import myUtil, { intl as intl2 } from '@/components/DDAssist/util';

export interface DDModalGridProps {
  onRef?: any;
  visible?: any;
  handleOtherModal?: any;
  // sdpParam?: any;
  handleColseModal?: any;
}

let codeTime:any = null; // 二维码倒计时三分钟
let dsqTime:any = null; // 两秒一次认证接口
const Spmc: React.FC<DDModalGridProps> = ({ onRef, visible = false, handleOtherModal, handleColseModal }) => {
  const [kpmodalVisible, setKpModalVisible] = useState<boolean>(visible);
  const [masker, setMasker] = useState(false);
  const [sxFlag, setFlag] = useState<String>('1'); // 二维码有效1 二维码失效2
  const [coutNum, setCountNum] = useState<any>(1); // 二维码刷新次数
  const [imgLink, setImgLink] = useState<any>(''); // 图片地址

  // 关闭
  const closeModal = () => {
    setKpModalVisible(false);
    if(codeTime) {
      clearInterval(codeTime);
      codeTime = null;
    }
    if(dsqTime) {
      clearInterval(dsqTime);
      dsqTime = null;
    }
  }

  // 开启
  const showModal = () => {
    setKpModalVisible(true);
    getCodeImg('1'); // 获得二维码接口
    setCountNum(1);
    setImgLink('');
  };

  // 二维码倒计时三分钟
  const hqyzmBtnDjs = () => {
    codeTime = null;
    let time = 180; // 倒计时时间 180秒
    codeTime = setInterval(function () {
      if (time > 0) {
        time = time - 1;
      } else {
        getCodeImg('2'); // 获得失效二维码图片
        clearInterval(codeTime);
        codeTime = null;
      }
    }, 1000);
  }

  // 两秒一次认证接口
  const getRzTime = (param: any) => {
    dsqTime = setInterval(function () {
      // 判断认证状态
      getRzData(param)
    }, 2000);
  }

  const getCodeImg = (num: any) => {
    // num: 1 获取有效二维码 2 获取失效图片
    if(num === '1') {
      setMasker(true);
      const userInfo = myUtil.sessionStore.getItem('userInfo');
      const nsrsbh = userInfo?.qxQys[0]?.shxydm ? userInfo?.qxQys[0]?.shxydm : userInfo?.qxQys[0]?.nsrsbh;
      getSfrzcode({nsrsbh}).then((res:any)=>{
        setMasker(false);
        const {code, body, msg} = res;
        if(code === '200') {
          const imgLink = body.ewm;
          setImgLink(imgLink)
          console.log('获得有效二维码————————————————————')
          // 走认证循环， 3秒一次
          const obj = {
            nsrsbh: body.nsrsbh,
            rzid: body.rzid,
          }
          getRzTime(obj);
          // 开始倒计时
          hqyzmBtnDjs();
          setFlag('1'); // 二维码有效
        } else if(code === '0'){
          message.error('系统异常，请联系技术支持。');
          setFlag('2'); // 二维码失效
          if(codeTime) {
            clearInterval(codeTime);
            codeTime = null;
          }
          if(dsqTime) {
            clearInterval(dsqTime);
            dsqTime = null;
          }
        } else {
          message.error(msg);
          // 异常 二维码失效，认证接口停止
          setFlag('2'); // 二维码失效
          if(codeTime) {
            clearInterval(codeTime);
            codeTime = null;
          }
          if(dsqTime) {
            clearInterval(dsqTime);
            dsqTime = null;
          }
        }
      })
    } else {
      console.log('获得失效二维码————————————————————')
      // 如果二维码失效，认证接口停止
      if(dsqTime) {
        clearInterval(dsqTime);
        dsqTime = null;
      }
      setMasker(true);
      setTimeout(() => {
        setMasker(false);
        setFlag('2'); // 二维码失效
      }, 500);
    }
  }

  // 认证
  const getRzData = (param: any) => {
    sdpPrCode(param).then((res:any)=> {
      const {code, body, msg} = res;
      if(code === '200') {
        console.log('走认证————————————————————————')
        const flag = body.slzt;
        if(flag === '2') {
          // 认证成功
          console.log('认证成功——————————————————————')
          if(dsqTime) {
            clearInterval(dsqTime);
            dsqTime = null;
          }
          if(codeTime) {
            clearInterval(codeTime);
            codeTime = null;
          }
          // message.success(intl2.formatMessage({ id: 'message_ckfp_fpsqd_qrkp_success' }));
          closeModal(); // 关闭弹窗
          handleColseModal()
        } else if(flag === '3'){
          getCodeImg('2');
        }
      } else if(code === '0'){
        message.error('系统异常，请联系技术支持。');
        if(dsqTime) {
          clearInterval(dsqTime);
          dsqTime = null;
        }
        message.error(msg);
      } else {
        if(dsqTime) {
          clearInterval(dsqTime);
          dsqTime = null;
        }
        message.error(msg);
      }
    })
  }

  const secondTimeout = () => {
    DDAlert.open({
      title: '二维码认证',
      info: '二维码已失效，请重新登录。',
      infoType: 'warning',
      modalType: 'confirm',
      closeStatus: false,
      okText: '重新登录',
      okCallbackFn: async function  () {
        if(handleOtherModal) {
          handleOtherModal('cxdl');
          DDAlert.close();
        }
      }
    })
  }

  useImperativeHandle(onRef, () => {
    return {
      showModal,
      closeModal,
    };
  });

  // 点击刷新
  const changeImage = () => {
    if(coutNum === 1) {
      setCountNum(2)
      getCodeImg('1');
    } else if(coutNum === 2) {
      secondTimeout(); // 二次失效弹窗
    }
  }

  return (
    <>
      <Modal
        title="身份验证"
        centered
        destroyOnHidden
        visible={kpmodalVisible}
        width='700px'
        onCancel={closeModal}
        mask={{ closable: false }}
        footer={(<></>)}
      >
        <Spin tip="Loading..." spinning={masker} delay={100}>
          <div className='mndlym_main'>
            <div className="qr-code-content">
              <div className='qr-code-title'><ExclamationCircleFilled className='qr-title-icon' />为了您开票的安全便捷、稳定可靠，请完成身份认证处理。</div>
              <div className='qr-code-box'>
                {sxFlag === '1' ? <div className='qr-code-text'>请使用税务APP扫描二维码进行身份验证</div> : 
                <div className='qr-code-text-error'>二维码已失效，请刷新后重新使用税务APP扫描二维码进行身份验证</div>}
                <div className='qr-code-img'>
                  <img src={imgLink} />  
                  {sxFlag === '1' ? <></>: 
                    <div className='sx-img-mask' onClick={changeImage}>
                      <SyncOutlined className="sx-icon-img" />
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </Spin>
      </Modal>
    </>
  );
};

export default Spmc;
