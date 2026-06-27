import React, { useImperativeHandle, useState, useEffect } from 'react';
import { message, Spin, Modal, Button} from 'antd';
import './tab_style.less';
import { ExclamationCircleFilled, ReloadOutlined, CheckCircleFilled  } from '@ant-design/icons';
import { cxewm, ecrzjgcx, checkDlt2 } from '@/pages/hts/services/htsApi';

export interface DDModalGridProps {
  onRef?: any;
  visible?: any;
  handleOtherModal?: any;
  handleColseModal?: any;
  getdlFlag?:any
}


const Spmc: React.FC<DDModalGridProps> = ({ onRef, visible = false, handleOtherModal, handleColseModal,getdlFlag }) => {
  const [masker, setMasker] = useState(false);
  const [sxFlag, setFlag] = useState<String>('1'); // 二维码有效1 二维码失效2
  const [coutNum, setCountNum] = useState<any>(1); // 二维码刷新次数
  const [imgLink, setImgLink] = useState<any>(''); // 图片地址
  const [errorIcon, setErrorIcon] = useState<any>(true); 
  const [essorIcon, setEssIcon] = useState<any>(true); 
  const [opacity, setOpacity] = useState<any>("1.0"); 
  const [ewmhqzt,setEwmhqzt] = useState(false);
  const [crFlag,setCrFlag] = useState();
  const [rzzt,setRzzt] = useState();
  const [fhbz,setFhbz] = useState<any>(true);

  useImperativeHandle(onRef, () => {
    return {
      closeModal,
      getMoVis,
      getEwmhqzt,
    };
  });
  
  // 关闭
  const closeModal = (zt:any) => {
    if(zt == '2'){
      setFhbz(false);
    }
    setEssIcon(true);
    setErrorIcon(true);
    getdlFlag(crFlag);
    setFlag('1');
    setCountNum(1);
  }


  const getMoVis = () => {
    return fhbz;
  };
  const getEwmhqzt = () => {
    return ewmhqzt;
  };

  useEffect(() => {
    loadMoreData();
  }, []);

  const loadMoreData = () => {
    getCodeImg('1'); // 获得二维码接口
    setCountNum(1);
    setImgLink('');
    setTimeout(function () {
      setErrorIcon(false);
      setOpacity("0.1");
      setFlag('2'); // 二维码失效
    }, 300000);
    setOpacity("1.0");
  };

  const getCodeImg = (num: any) => {
    // num: 1 获取有效二维码 2 获取失效图片
    if (num === '1') {
      setMasker(true);
      cxewm().then((res: any) => {
        setMasker(false);
        const { code, body, msg } = res;
        if (code === '200') {
          const imgLink = body.ewm;
          setImgLink(imgLink);
          ewmZt(body);
          console.log('获得有效二维码————————————————————')
          setFlag('1'); // 二维码有效
        } else {
          message.error(msg);
          // 异常 二维码失效，认证接口停止
          setErrorIcon(false);
          setFlag('2'); // 二维码失效
          setOpacity("0.1");
        }
      })
    } else {
      console.log('获得失效二维码————————————————————')
      setMasker(true);
    }
  }


  const ewmZt = (body2: any) => {
    const rzid = body2.rzid;
    const xfnsrsbh = body2.xfnsrsbh;
    const dzsjdlzh = body2.dzsjdlzh;
    ecrzjgcx({ xfnsrsbh: xfnsrsbh, rzid: rzid, dzsjdlzh: dzsjdlzh }).then((res: any) => {
      const { code, body, msg } = res;
      if (code === '200') {
        if (body?.slzt == '1') {
          //未扫码
            setTimeout(function () {
              ewmZt(body);
            }, 3000);
        } else if (body?.slzt == '2') {
          //已扫码
          setEssIcon(false);
          setOpacity("0.1");
        } else {
          // 扫码失败
          getCodeImg('1');
          setErrorIcon(true);
          setFlag('2'); // 二维码失效
          setOpacity("0.1");
        }
      } else {
        message.error(msg);
      }
    })
  }

  const reload = ()=>{
    setErrorIcon(true);
    setEssIcon(true);
    setOpacity("1.0");
    loadMoreData();
  }

  return (
    <>
      <Spin tip="Loading..." spinning={masker} delay={100}>
        <div className="mndlym_main2">
          <div className="qr-code-content">
            <div className='qr-code-title'><ExclamationCircleFilled className='qr-title-icon' />为了您开票的安全便捷、稳定可靠，请完成身份认证处理。</div>
            <div className='qr-code-box'>
              {sxFlag === '1' ? <div className='qr-code-text'>请使用税务APP扫描二维码进行身份认证</div> :
                <div className='qr-code-text-error'>二维码已失效，请刷新后重新使用税务APP扫描二维码进行身份认证</div>}
              <div className='qr-code-img'>
                <img src={imgLink} style={{opacity:opacity}}/>
                <ReloadOutlined className="sessiconIcon" hidden={errorIcon} onClick={reload}/>
                <CheckCircleFilled className="sessiconIcon2" hidden={essorIcon}/>
              </div>
            </div>
          </div>
        </div>
      </Spin>
    </>
  );
};

export default Spmc;
