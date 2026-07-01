/**
 * title: 打印预览
 */
import React, { useState, useImperativeHandle } from 'react';
import { Modal, Button } from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
import { CloseOutlined, DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons';
import { changeJzfjToPath } from "@/pages/hts/services/htsApi";
import cktsUtil from '@/pages/hts/cktsUtil';

export type DyViewerProps = {
  visible?: any;
  onRef?: any;
}

const DyViewer: React.FC<DyViewerProps> = ({
  visible = false,
  onRef,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [srcList, setSrcList] = useState<any>([]);
  const [src, setSrc] = useState<any>();
  const [title, setTitle] = useState<any>();
  const [srcIndex, setSrcIndex] = useState<any>(0);

  // 开启
  const showModal = (wjljs: any, ref: any) => {
    setSrcList(wjljs);
    getSrcData(0, wjljs);
    setSrcIndex(0);
    setModalVisible(true);
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  // 获得流文件
  const getSrcData = (index: any, list: any) => {
    const listData = srcList.length > 0 ? srcList : list;
    if (listData[index].wjlj) {
      const obj = {
        fzcclj: listData[index].wjlj,
      }
      setTitle(listData[index].wjm);
      changeJzfjToPath(obj).then((response: any) => {
        if (response.code === '200') {
          const { code } = response;
          if (code === '200') {
            const { blob, fileName } = response.body;
            const bstr = atob(blob);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) {
              u8arr[n] = bstr.charCodeAt(n);
            }
            const fileURL = URL.createObjectURL(new Blob([u8arr], { type: 'application/pdf' }));
            // by lincb 修改pdf获取路径
            setSrc(cktsUtil.getPdfLj()+`?file=${fileURL}&name=${fileName}`);
            // if(moduel && moduel === 'badz') {
            //   setSrc(`/front/badz/pdfjs/web/viewer.html?file=${fileURL}&name=${fileName}`);
            // } else {
            //   setSrc(`/pdfjs/web/viewer.html?file=${fileURL}&name=${fileName}`);
            // }
          }
        }
      })
    }
  };

  // 上一页
  const prePage = () => {
    if (srcIndex > 0) {
      setSrcIndex(srcIndex - 1);
      getSrcData(srcIndex - 1, [])
    }
  };

  // 下一页
  const nextPage = () => {
    if (srcIndex < srcList.length - 1) {
      setSrcIndex(srcIndex + 1);
      getSrcData(srcIndex + 1, []);
    }
  }

  const closeModalVisible = () => {
    setSrcList([])
    setModalVisible(false)
  }

  return (
    <Modal
      title={title}
      destroyOnHidden
      open={modalVisible}
      wrapClassName='standard-modal-1'
      width={CONSTANTS.C_MODAL_WIDTH_X4}
      cancelText="关闭"
      footer={
        <>
          <Button onClick={prePage} icon={<DoubleLeftOutlined />} type="default" disabled={srcIndex > 0 ? false : true}>上一页</Button>
          <Button onClick={nextPage} type="default" disabled={srcIndex < srcList.length - 1 ? false : true}>下一页<DoubleRightOutlined /></Button>
          <Button onClick={closeModalVisible} icon={<CloseOutlined />} type="default">关闭</Button>
        </>
      }
      closable={false}
      onCancel={closeModalVisible}
    >
      {/* <div>{src}</div> */}
      <iframe src={src} width='100%' height='99%'></iframe>
    </Modal>
  );
};
export default DyViewer;
