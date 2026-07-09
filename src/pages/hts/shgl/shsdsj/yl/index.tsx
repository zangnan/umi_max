/**
 * title: 图片预览
 */
import React, { useState, useImperativeHandle } from 'react';
import { message, Image } from 'antd';
import { viewBdazFjImage } from '@/pages/hts/services/htsApi';
import cktsUtil from '@/pages/hts/cktsUtil';

export type YlPicViewer = {
  onRef?: any;
}

const YlPic: React.FC<YlPicViewer> = ({
  onRef,
}) => {
  const [visible, setVisible] = useState<any>(false);
  const [src, setSrc] = useState<any>([]);

  // 开启
  const showModal = (uuid: any,dzlx: any,refUnit: any, visible: Boolean) => {
    const obj = {
      uuid: uuid,
      dzlx: dzlx
    }
    refUnit.current?.setMasker(true);
    viewBdazFjImage(obj).then((res) => {
      refUnit.current?.setMasker(false);
      const { body, code, desc } = res;
      if (code === '200') {
        const wjnr = body.wjnr;
        const viewWjm = body.wjm;
        // 判断文件后缀名走不同的预览
        const suffix = viewWjm.substr(viewWjm.lastIndexOf('.') + 1).toLowerCase();
        if (suffix === 'pdf') {
          const byteCharacters = atob(wjnr);
          let n = byteCharacters.length,
          u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = byteCharacters.charCodeAt(n);
          }
          const blob = new Blob([u8arr], { type: 'application/pdf' });
          const src = cktsUtil.getPdfLj();
          window.open(`${src}?file=${URL.createObjectURL(blob)}&name=${viewWjm}`);
        } else {
          setSrc(wjnr);
          setVisible(visible);
        }
      } else {
        message.error(desc);
      }
    })
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  return (
    <>
      <Image
        width={200}
        style={{ display: 'none' }}
        src={src}
        preview={{
          visible,
          src: src,
          onVisibleChange: (value) => {
            setVisible(value);
          },
        }}
      />
  </>
  );
};
export default YlPic;

