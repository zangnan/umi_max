import React from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import unitConfig from './config';
import { Link } from 'umi';
import myUtil from '@/components/DDAssist/util';
import { Image, Card } from 'antd';
import { PlayOne } from '@icon-park/react';

const Unit: React.FC<unknown> = () => {

  // 自定义卡片示例
  unitConfig.grid_list_card_render = (item: any) => {
    return <>
      <Card hoverable variant="borderless"
        style={{ width: '100%', position: 'relative' }}
        cover={ <Image src={item?.mediaUrl} />} >
        <Card.Meta title={item.classTitle} description={item.userName} />
        <div style={{fontSize: '12px', margin: '14px 0 0 0', padding: '12px 0 0 0', borderTop: '1px dashed #ddd'}}>{item.cktmsywlxmcjh}</div>
        <div style={{fontSize: '15px', margin: '4px 0 0 0', color: '#900000'}}>{`¥ ${myUtil.text.formatNum(item.tse, '0,0.00')}`}</div>
        <div style={{fontSize: '13px', margin: '4px 0 0 0', color: '#656565'}}>{`更新 ${myUtil.date.formatDate(item.ckrq1, 'YYYY-MM-DD')}`}</div>
        <span style={{position: 'absolute', right: '0', bottom: '0'}}>
          <Link to={`/player?mediaPath=${item?.mediaVideoUrl}`} target='_blank' style={{display: 'block', textAlign: 'center', padding: '12px 0 0 0 '}}>
            <PlayOne theme="outline" size='18' fill='#0a6ed1' />
          </Link>
        </span>
      </Card>
    </>
  }

  return <DDBunit2 config={unitConfig} />;
};
export default Unit;