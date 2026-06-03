// 报送资料
import React, { useState, useImperativeHandle, useEffect } from 'react';
import { Modal, Form, message, Button, Progress } from 'antd';
import pro from '@/pages/common/proConfig';
import { tszlxzjy, tszljydc, tszlxz, fpplxzpdf } from '@/services/hts/api';

export type AttachmentDataProps = {
  visible?: any;
  onRef?: any;
  gridRef?: any;
  ywKey?: any;
}

const Hqsbsj: React.FC<AttachmentDataProps> = ({
  visible = false,
  onRef,
  ywKey,
}) => {
  const [modalVisibleXz, setModalVisibleXz] = useState<boolean>(false);
  const [percentNum, setPercentNum] = useState(0);
  const [showBtn, setShowBtn] = useState<boolean>(true); // 是否显示进度条确认按钮
  const [filePath, setFilePath] = useState<any>(); // 是否显示进度条确认按钮
  const [fileName, setfileName] = useState<any>(); // 是否显示进度条确认按钮
  const [status, setStatus] = useState<any>("active"); // 是否显示进度条确认按钮



  // 开启
  const showModal = (param: any) => {
    setModalVisibleXz(true);
    pdfDownLoad(param);
  };
  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });


 
  useEffect(() => {
    if(percentNum != 0){
      setTimeout(function(){
        myFunction(percentNum+1,status);
       }, 500);
    }
  }, [percentNum,status]);

  const myFunction = (i :any,status2:any) => {
    if (status2 == "success") {
      setPercentNum(100);
    }else{
      if(percentNum < 99){
        setPercentNum(i);
      }
    }
  }
  const onclose = () => {

    setShowBtn(true);
    setFilePath('');
    setfileName('');
    setModalVisibleXz(false);
  }

  const pdfDownLoad = async (params: any) => {
    myFunction(1,status);
    await fpplxzpdf(params).then((res2) => {
      if (res2.code == '200') {
        setFilePath(res2.body.filePath);
        setfileName(res2.body.fileName);
        setShowBtn(false);
        setStatus("success");
      } else {
        setModalVisibleXz(false);
        message.error(res2.msg);
      }
    });
  }

  const handleOk = async () => {
    setModalVisibleXz(false);
    setPercentNum(0);
    onclose();
    setStatus("active");
    let a = document.createElement('a');//创建一个a标签元素
    a.style.display = 'none';//设置元素不可见
    a.href = filePath;
    a.download = fileName;
    document.body.appendChild(a);//加入
    a.click(); //触发点击,下载
    document.body.removeChild(a);//释放 
  }
  return (
    <>
      <Modal
        title="PDF文件准备"
        visible={modalVisibleXz}
        width={pro.c_modal_width_x1}
        closable={false}
        keyboard={false}
        maskClosable={false}
        zIndex={1001}
        style={{ marginTop: '40px' }}
        footer={
          <Button onClick={() => handleOk()} type="primary" key="ok" disabled={showBtn}>下载PDF文件</Button>
        }
      >
        <>
          <div>PDF文件准备中，请耐心等待！</div>
          <Progress percent={percentNum} />
        </>
      </Modal>
    </>
  );
};
export default Hqsbsj;