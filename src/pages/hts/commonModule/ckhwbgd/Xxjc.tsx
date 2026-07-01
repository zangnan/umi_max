import React, { useEffect, useImperativeHandle, useState } from 'react';
import { Modal, Button, Form, Spin, Progress } from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
import myUtil from '@/components/DDAssist/util';

// import   from 'antd/lib/progress'

import { ExclamationCircleOutlined } from '@ant-design/icons';

export interface DDModalGridProps {
  onRef?: any;
  visible?: any;
}


const Scmx: React.FC<DDModalGridProps> = ({
  visible = false,
  onRef,
}) => {
  const [info, setInfo] = useState<any>();
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [masker, setMasker] = useState<boolean>(false);
  const [num, setNum] = useState<number>(0);
  const [status, setStatus] = useState<any>('');
  const [unitRef, setUnitRef] = useState<any>();
  const [none, setNone] = useState<any>();
  const [flag, setFlag] = useState<any>();

  

  // 开启
  const showModal = (unitRef: any, info: any) => {
    setUnitRef(unitRef);
    setNone('none');
    setInfo(info);
    setModalVisible(true);
  };

  useEffect(() => {
    schedule(num);
  }, [status]);

  useEffect(() => {
    setTimeout(function () {
      schedule(num);
    }, 2000);
  }, [num]);



  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  const onOk = () => {
    setNone('block');
    setMasker(true);
    setFlag(true);
  }


  const schedule = (num2: any) => {
    if (status == "start" && num < 100 && num2 < 100) {
      setNum(num2 + 10);
    }
  }

  const close = () => {
    setInfo('');
    setModalVisible(false);
    setMasker(false);
    setNum(0);
    setStatus('');
    setNone('none');
    unitRef?.current?.reload2();
  }

  return (
    <>
      <Modal
        title='信息检测'
        destroyOnHidden={true}
        open={modalVisible}
        width={CONSTANTS.C_MODAL_WIDTH_X1}
        footer={(<>
          <Button onClick={() => close()} >取消</Button>
          <Button onClick={onOk} type="primary">确定</Button>
        </>)}
        onCancel={() => close()}
      >
        <Spin tip="Loading..." spinning={masker} delay={100}>
          <div className={`dd_modal_content info form`}>
            <div className="icon" style={{ color: '#FAAD15', fontSize: '22px', lineHeight: '22px', display: 'inline-block', position: 'absolute', left: '8px', top: '1px', }}><ExclamationCircleOutlined /></div>
            <div className="info" style={{ fontSize: '16px', display: 'inline-block', color: '#272424', marginLeft: '45px' }}>{info}</div>
          </div>
          <div style ={{width: '80%',marginLeft: '40px',marginTop:'40px',display:none}}>
            <Progress percent={num} status={status} />
          </div>
        </Spin>
      </Modal>
    </>
  );
};

export default Scmx;