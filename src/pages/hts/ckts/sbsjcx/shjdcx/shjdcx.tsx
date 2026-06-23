import React, { useState, useImperativeHandle } from 'react';
import { Modal, Button, Timeline,Tooltip } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined, EllipsisOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import CONSTANTS from '@/components/DDAssist/constants';
import myUtil from '@/components/DDAssist/util';


const Shjdcx: React.FC<{ onRef?: any }> = ({ onRef }) => {
  const [timelineData, setTimelineData] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  // 开启
  const showModal = (param: any) => {
    setTimelineData(param);
    setModalVisible(true);
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  // 渲染时间线项
  const renderTimelineItems = () => {
    const items = timelineData.map((item: any, index: number) => {
      return (
        <Timeline.Item key={index}>
          <div style={{
            border: '1px solid #ccc',
            borderRadius: 10,
            padding: '5px 10px',
            position: 'relative',
            backgroundColor: '#fff'
          }}>
            <div style={{ display: 'inline-block' }}>
              <h3
                id={item.lchjDm}
                style={{
                  fontSize: 14,
                  marginBottom: 0,
                  display: 'inline-block'
                }}
              >
                {item.lchjmc}
                {item.lchjDm === '04' && (
                  <span className="icon-info" style={{ paddingLeft: 3 }}> <Tooltip title="若存在转调查评估数据，则受理退税额与申报退税额会存在差额。"> <QuestionCircleOutlined /> </Tooltip>
                  </span>
                )}
              </h3>
              <p><ClockCircleOutlined style={{ color: '#A3A3A3', fontSize: 14, marginRight: 10 }} /> {item.blrq || ''} </p>
              {item.lcswsxDm === 'LCSXA081038001' ? (
                <>
                  {item.lchjDm === '01' && (
                    <>
                      <p>受理应退税额：{myUtil.text.formatNum(item.slzzstse, '0, 0.00')}元</p>
                      <p>受理免抵税额：{myUtil.text.formatNum(item.slmdse, '0, 0.00')}元</p>
                    </>
                  )}
                  {item.lchjDm === '04' && (
                    <>
                      <p>复审应退税额：{myUtil.text.formatNum(item.fszzstse, '0, 0.00')}元</p>
                      <p>复审免抵税额：{myUtil.text.formatNum(item.fsmdse, '0, 0.00')}元</p>
                      <p>不予办理应退税额：{myUtil.text.formatNum(item.fsbyblzzstse, '0, 0.00')}元</p>
                    </>
                  )}
                  {item.lchjDm === '06' && (
                    <>
                      <p>核准应退税额：{myUtil.text.formatNum(item.sehzzzstse, '0, 0.00')}元</p>
                      <p>核准免抵税额：{myUtil.text.formatNum(item.sehzmdse, '0, 0.00')}元</p>
                      <p>暂扣应退税额：{myUtil.text.formatNum(item.zkzzstse, '0, 0.00')}元</p>
                    </>
                  )}
                </>
              ) : (
                <>
                  {item.lcswsxDm === 'LCSXA081040001' ? (
                    <>
                      {item.lchjDm === '01' && (
                        <p>受理退税额：{myUtil.text.formatNum(item.slzzstse, '0, 0.00')}元</p>
                      )}
                      {item.lchjDm === '04' && (
                        <>
                          <p>复审退税额：{myUtil.text.formatNum(item.fszzstse, '0, 0.00')}元</p>
                          <p>不予办理退税额：{myUtil.text.formatNum(item.fsbyblzzstse, '0, 0.00')}元</p>
                        </>
                      )}
                      {item.lchjDm === '06' && (
                        <>
                          <p>核准退税额：{myUtil.text.formatNum(item.sehzzzstse, '0, 0.00')}元</p>
                          <p>暂扣退税额：{myUtil.text.formatNum(item.zkzzstse, '0, 0.00')}元</p>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      {item.lchjDm === '01' && (
                        <>
                          <p>受理增值税退税额：{myUtil.text.formatNum(item.slzzstse, '0, 0.00')}元</p>
                          <p>受理消费税退税额：{myUtil.text.formatNum(item.slxfstse, '0, 0.00')}元</p>
                        </>
                      )}
                      {item.lchjDm === '04' && (
                        <>
                          <p>复审增值税退税额：{myUtil.text.formatNum(item.fszzstse, '0, 0.00')}元</p>
                          <p>复审消费税退税额：{myUtil.text.formatNum(item.fsxfstse, '0, 0.00')}元</p>
                          <p>不予办理增值税退税额：{myUtil.text.formatNum(item.fsbyblzzstse, '0, 0.00')}元</p>
                          <p>不予办理消费税退税额：{myUtil.text.formatNum(item.fsbyblxfstse, '0, 0.00')}元</p>
                        </>
                      )}
                      {item.lchjDm === '06' && (
                        <>
                          <p>核准增值税退税额：{myUtil.text.formatNum(item.sehzzzstse, '0, 0.00')}元</p>
                          <p>核准消费税退税额：{myUtil.text.formatNum(item.sehzxfstse, '0, 0.00')}元</p>
                          <p>暂扣增值税退税额：{myUtil.text.formatNum(item.zkzzstse, '0, 0.00')}元</p>
                          <p>暂扣消费税退税额：{myUtil.text.formatNum(item.zkxfstse, '0, 0.00')}元</p>
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </div>

            <div style={{
              position: 'absolute',
              right: 10,
              top: 12
            }}>
              <span style={{
                border: item.state === '已完成' ? 'none' : '#ff6633 solid 1px',
                padding: '5px 10px',
                color: item.state === '已完成' ? 'inherit' : '#ff6633',
                borderRadius: 5,
                fontSize: 12
              }}>
                {item.state === '已完成' ? (
                  <CheckCircleOutlined style={{ marginRight: 5, color: 'inherit' }} />
                ) : (
                  <EllipsisOutlined style={{
                    backgroundColor: '#ff6633',
                    color: '#fff',
                    width: 15,
                    height: 15,
                    textAlign: 'center',
                    borderRadius: '50%',
                    lineHeight: '16px',
                    fontSize: 12,
                    marginRight: 5
                  }} />
                )}
                {item.state}
              </span>
            </div>
          </div>
        </Timeline.Item>
      );
    });
    return items;
  };

  return (
    <Modal
      title="退税审核进度查询"
      visible={modalVisible}
      // wrapClassName='standard-modal-1'
      className={'dd_modal_wrap'}
      width={CONSTANTS.C_MODAL_WIDTH_X2}
      destroyOnHidden={true}
      onCancel={() => setModalVisible(false)}
      closable={true}
      mask={{ closable: false }}
      footer={(<>
        <Button onClick={() => setModalVisible(false)} type="default">关闭</Button>
      </>)}
    >
      <Timeline>
        {renderTimelineItems()}
      </Timeline>
    </Modal>
  );
};

export default Shjdcx;