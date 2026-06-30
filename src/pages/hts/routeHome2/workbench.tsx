import React from 'react';
import { Empty } from 'antd';
import './style.less';

const Workbench: React.FC<unknown> = () => {

  return (
    <div className="bgPage">
      <div className="bgEmpty"></div>
      <div className="bgPageText">功能建设中...</div>
    </div>

  // <Empty
  //   image="/img/empty2.png"
  //   description={
  //     <span className='empty-description'>
  //       功能建设中...
  //     </span>
  //   }
  //   imageStyle={{ height: 500 }} />
    
  );
};
export default Workbench;