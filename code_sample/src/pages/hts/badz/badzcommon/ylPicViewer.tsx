/**
 * title: 图片预览
 */
import React, { useState, useImperativeHandle } from 'react';
import { Image } from 'antd';

export type YlPicViewer = {
  onRef?: any;
}

const YlPic: React.FC<YlPicViewer> = ({
  onRef,
}) => {
  const [visible, setVisible] = useState<any>(false);;
  const [srcList, setSrcList] = useState<any>([]);

  // 开启
  const showModal = (list: any, visible: Boolean) => {
    setSrcList(list);
    setVisible(visible);
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });
 
  return (
    <>
    <Image
        preview={{ visible: false }}
        width={200}
        onClick={() => setVisible(true)}
        style={{ display: 'none' }}
      />
      <div style={{ display: 'none' }}>
        <Image.PreviewGroup preview={{ visible, onVisibleChange: vis => setVisible(vis) }}>
          {srcList.map((temp: any, index: any) => (
            <Image key={index} alt={temp.imgName} src={temp.imglink} />
            ))
          }
        </Image.PreviewGroup>
      </div>
  </>
  );
};
export default YlPic;

