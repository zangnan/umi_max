import React from 'react';
import { Timeline } from 'antd';
import ProCard from '@ant-design/pro-card';
import { ClockCircleOutlined } from '@ant-design/icons';
import myUtil from '@/pages/common/myUtil';
import cktsUtil from '@/pages/common/cktsUtil';
import './style.less';

export interface Timeline {
  timeData?: any;
  showBook?: Boolean;
}

const DDTimeline: React.FC<Timeline> = ({ timeData, showBook }) => {
  const qylx = myUtil.sys.enterpriseType();
  console.log(qylx)
  // 下载税务事项通知书 
  const downLoadBook = () => {
    cktsUtil.downloadFile();
  }

  const timeLineHtml = (data: any) => {
    let group = [];
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        const dataTitle = data[i].lchjmc ? data[i].lchjmc : '';
        const state = data[i].state ? data[i].state : '';
        const time = data[i].tssj ? data[i].tssj : '';
        const lcswsxDm = data[i].lcswsxDm;
        if (data[i].lchjDm == '01') {
          group.push(<Timeline.Item>
            <ProCard bordered>
              <div className='header_card_wrap_group'>
                <div className='header_card_title'>
                  {dataTitle}
                  <div className="header-card-zt">{state}</div>
                </div>
                <div className='header_card_time'>
                  <ClockCircleOutlined />&nbsp;{time}
                </div>
                {qylx === 'SC' ?
                  <div className='header_card_content'>
                    <div>受理应退税额：{myUtil.text.formatNum(data[i].slzzstse, '0,0.00')}元</div>
                    <div>受理免抵税额：{myUtil.text.formatNum(data[i].slmdse, '0,0.00')}元 </div>
                      {/* {showBook ? <div className="header-download" onClick={(event: any) => { downLoadBook() }}>下载税务事项通知书</div> : <></>} */}
                  </div> :
                  lcswsxDm === 'LCSXA081040001' ?
                  <div className='header_card_content'>
                    <div>受理退税额：{myUtil.text.formatNum(data[i].slzzstse, '0,0.00')}元</div>
                  </div> :
                  <div className='header_card_content'>
                    <div>受理增值税退税额：{myUtil.text.formatNum(data[i].slzzstse, '0,0.00')}元</div>
                    <div>受理消费税退税额：{myUtil.text.formatNum(data[i].slxfstse, '0,0.00')}元 </div>
                  </div>
                }
              </div>
            </ProCard>
          </Timeline.Item>);
        } else if (data[i].lchjDm == '02' || data[i].lchjDm == '05' || data[i].lchjDm == '07' || data[i].lchjDm == '03') {
          group.push(<Timeline.Item>
            <ProCard bordered>
              <div className="header_card_wrap_group">
                <div className="header_card_title">
                  {dataTitle}
                  <div className="header-card-zt">{state}</div>
                </div>
                <div className="header_card_time">
                  <ClockCircleOutlined />&nbsp;{time}
                </div>
              </div>
            </ProCard>
          </Timeline.Item>)
        } else if (data[i].lchjDm == '04') {
          group.push(<Timeline.Item>
            <ProCard bordered>
              <div className="header_card_wrap_group">
                <div className="header_card_title">
                  {dataTitle}
                  <div className="header-card-zt">{state}</div>
                </div>
                <div className="header_card_time">
                  <ClockCircleOutlined />&nbsp;{time}
                </div>
                {qylx === 'SC' ?
                  <div className="header_card_content">
                    <div>复审应退税额：{myUtil.text.formatNum(data[i].fszzstse, '0,0.00')}元</div>
                    <div>复审免抵税额：{myUtil.text.formatNum(data[i].fsmdse, '0,0.00')}元</div>
                    <div>不予办理应退税额：{myUtil.text.formatNum(data[i].fsbyblzzstse, '0,0.00')}元</div>
                  </div> :
                  lcswsxDm === 'LCSXA081040001' ?
                  <div className="header_card_content">
                    <div>复审退税额：{myUtil.text.formatNum(data[i].fszzstse, '0,0.00')}元</div>
                    <div>不予办理退税额：{myUtil.text.formatNum(data[i].fsbyblzzstse, '0,0.00')}元</div>
                  </div> :
                  <div className="header_card_content">
                    <div>复审增值税退税额：{myUtil.text.formatNum(data[i].fszzstse, '0,0.00')}元</div>
                    <div>复审消费税退税额：{myUtil.text.formatNum(data[i].fsxfstse, '0,0.00')}元</div>
                    <div>不予办理增值税退税额：{myUtil.text.formatNum(data[i].fsbyblzzstse, '0,0.00')}元</div>
                    <div>不予办理消费税退税额：{myUtil.text.formatNum(data[i].fsbyblxfstse, '0,0.00')}元</div>
                  </div>
                }
              </div>
            </ProCard>
          </Timeline.Item>)
        } else if (data[i].lchjDm == '06') {
          group.push(<Timeline.Item>
            <ProCard bordered>
              <div className="header_card_wrap_group">
                <div className="header_card_title">
                  {dataTitle}
                  <div className="header-card-zt">{state}</div>
                </div>
                <div className="header_card_time">
                  <ClockCircleOutlined />&nbsp;{time}
                </div>
                {qylx === 'SC'?
                  <div className="header_card_content">
                    <div>核准应退税额：{myUtil.text.formatNum(data[i].sehzzzstse, '0,0.00')}元</div>
                    <div>核准免抵税额：{myUtil.text.formatNum(data[i].sehzmdse, '0,0.00')}元</div>
                    <div>暂扣应退税额：{myUtil.text.formatNum(data[i].zkzzstse, '0,0.00')}元</div>
                  </div> :
                  lcswsxDm === 'LCSXA081040001' ?
                  <div className="header_card_content">
                    <div>核准退税额：{myUtil.text.formatNum(data[i].sehzzzstse, '0,0.00')}元</div>
                    <div>暂扣退税额：{myUtil.text.formatNum(data[i].zkzzstse, '0,0.00')}元</div>
                  </div> :
                  <div className="header_card_content">
                    <div>核准增值税退税额：{myUtil.text.formatNum(data[i].sehzzzstse, '0,0.00')}元</div>
                    <div>核准消费税退税额：{myUtil.text.formatNum(data[i].sehzxfstse, '0,0.00')}元</div>
                    <div>暂扣值税退税额：{myUtil.text.formatNum(data[i].zkzzstse, '0,0.00')}元</div>
                    <div>暂扣消费税退税额：{myUtil.text.formatNum(data[i].zkxfstse, '0,0.00')}元</div>
                  </div>
                }
              </div>
            </ProCard>
          </Timeline.Item>)
        }
      }
    }
    return group;
  };

  return (<>
    <Timeline className="MyTimeline">
      {timeLineHtml(timeData)}
    </Timeline>
  </>
  )
};

export default DDTimeline;
