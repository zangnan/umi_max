import React, { useImperativeHandle, useState, useEffect, useRef} from 'react';
import { message, Spin, Modal, Button} from 'antd';
import './tab_style.less';
import { ExclamationCircleFilled, ReloadOutlined, CheckCircleFilled  } from '@ant-design/icons';
import { cxewm, ecrzjgcx, checkDlt2 } from '@/pages/hts/services/htsApi';
import CONSTANTS from '@/components/DDAssist/constants';
import myUtil from '@/components/DDAssist/util';

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
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [ewmhqzt,setEwmhqzt] = useState(false);
  const [crFlag,setCrFlag] = useState();
  const [rzzt,setRzzt] = useState();
  const [fhbz,setFhbz] = useState<any>(true);
  const [xzbz,setXzbz] = useState<any>(true);

  const timerEwmsxRef: any = useRef(null); // 二维码失效
  const timerSljgRef: any = useRef(null); // 3s一轮询扫脸

  const isTimerEwmsxActive = () => {
    return timerEwmsxRef.current !== null;
  };

  const isTimersljgActive = () => {
    return timerSljgRef.current !== null;
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
      closeModal,
      getMoVis,
      getEwmhqzt,
      getXzbz,
    };
  });
  
  // 关闭
  const closeModal = (zt:any) => {
    if(zt == '2'){
      setFhbz(false);
    }
    setXzbz(false);
    myUtil.sessionStore.clear('gbbz');
    setModalVisible(false);
    setEssIcon(true);
    setErrorIcon(true);
    getdlFlag(crFlag);
    setFlag('1');
    setCountNum(1);
    // 关闭定时器二维码失效
    if (isTimerEwmsxActive()) {
      clearInterval(timerEwmsxRef.current);
    }
    // 扫脸结果
    if (isTimersljgActive()) {
      clearInterval(timerSljgRef.current);
    }
  }

  // 开启
  const showModal = async (flag:any) => {
    setModalVisible(true);
    setFhbz(true);
    setXzbz(true);
    myUtil.sessionStore.setItem('gbbz', '1');
    setMasker(true);
    await checkDlt2({}).then(async (res: any) => {
      setMasker(false);
      const { code, body, msg } = res;
      if (code == '200') {
        const rz = body?.rzbz;
        //已登錄
        setRzzt(rz);
      } else {
        message.error(msg);
      }
    });
    setCrFlag(flag);
  };

  const getMoVis = () => {
    return fhbz;
  };

  const getXzbz = () => {
    return xzbz;
  };
  const getEwmhqzt = () => {
    return ewmhqzt;
  };

  useEffect(() => {
    if(modalVisible){
      loadMoreData();
    }
  }, [modalVisible]);

  const loadMoreData = () => {
    getCodeImg('1'); // 获得二维码接口
    setCountNum(1);
    setImgLink('');
    if (isTimerEwmsxActive()) {
      clearInterval(timerEwmsxRef.current);
    }
    timerEwmsxRef.current = setTimeout(function () {
      if (isTimersljgActive()) {
        clearInterval(timerSljgRef.current);
      }
      setErrorIcon(false);
      setOpacity("0.1");
      setFlag('2'); // 二维码失效
    }, myUtil.fpfw.hqKpewmSxsj() * 1000);
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
    if(myUtil.sessionStore.getItem('gbbz') !='1'){
      return ;
    }
    const rzid = body2.rzid;
    const xfnsrsbh = body2.xfnsrsbh;
    const dzsjdlzh = body2.dzsjdlzh;
    ecrzjgcx({ xfnsrsbh: xfnsrsbh, rzid: rzid, dzsjdlzh: dzsjdlzh }).then((res: any) => {
      const { code, body, msg } = res;
      if (code === '200') {
        if (body?.slzt == '1') {
          if (isTimersljgActive()) {
            clearInterval(timerSljgRef.current);
          }
          //未扫码
          timerSljgRef.current = setTimeout(function () {
              ewmZt(body);
            }, 3000);
        } else if (body?.slzt == '2') {
          //已扫码
          setEssIcon(false);
          setOpacity("0.1");
          if (isTimersljgActive()) {
            clearInterval(timerSljgRef.current);
          }
        } else {
          // 扫码失败
          getCodeImg('1');
          setErrorIcon(true);
          setFlag('2'); // 二维码失效
          setOpacity("0.1");
          if (isTimersljgActive()) {
            clearInterval(timerSljgRef.current);
          }
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
    <Modal
        title='扫脸认证'
        open={modalVisible}
        wrapClassName='standard-modal-1'
        destroyOnHidden
        width={CONSTANTS.C_MODAL_WIDTH_X4}
        onCancel={() => closeModal('1')}
        mask={{ closable: false }}
        footer={null}
      >
      <Spin tip="Loading..." spinning={masker} delay={100}>
        <div className="mndlym_main3">
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
            {
              rzzt== "U"  && !crFlag && essorIcon ? <div className="success-ts" style={{textAlign:'center',marginTop:'100px'}}>
              <Button className="success-ts-btn" type="primary" onClick={() => closeModal('2')} style={{width :'200px'}}> 跳过继续开票 </Button>
             </div>:<></>
            }
            {
              !crFlag && !essorIcon ? <div className="success-ts" style={{textAlign:'center',marginTop:'100px'}}>
              <Button className="success-ts-btn" type="primary" onClick={() => closeModal('2')} style={{width :'200px'}}> 继续开票 </Button>
             </div>:<></>
            }

          </div>
        </div>
      </Spin>
      </Modal>
    </>
  );
};

export default Spmc;
