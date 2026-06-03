/**
 * 发票开具配置  外销商品管理
 */
import React, { useRef } from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import unitConfig from './wxspglconfig';
import func from './wxspglFunc'
import FmGrid from './fm/wxspglfm'
import myUtil from '@/pages/common/myUtil';

const Index: React.FC<{ data?: any }> = ({
  data
}) => {
  const fmGrid: any = useRef();
  func.getOtherRef = () => {
    const otherRef = [];
    // 赋码弹窗页面页面
    otherRef.push(fmGrid);
    return otherRef;
  };

  let myConfig = { ...unitConfig };

  const temp = myUtil.code.getCode('CODE_CS_ZXSB_FPKJ_CSPZ', '01');
  if (temp[0].fphwxxxqgzDm === '1') {
    const tempColumns = myConfig.grid_columns.filter((column: any) => {
      return (column.dataIndex != 'ggxhhgsh')
    })
    myConfig.grid_columns = tempColumns;
  }

  return <>
    <div key={data}>
      <DDBunit2 config={myConfig} func={func} />
      <FmGrid onRef={fmGrid} />
    </div>
  </>;
};

export default Index;