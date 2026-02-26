import React from 'react';
import { Typography, Button, Space, Dropdown, Menu, Input, Select, DatePicker, Row, Col } from 'antd';
import moment from 'moment';
import { SolutionOutlined, FormOutlined, DeleteOutlined, DownOutlined, PlusSquareOutlined, CopyOutlined, LeftOutlined, DoubleLeftOutlined, RightOutlined, DoubleRightOutlined } from '@ant-design/icons';
import './style.less';

// 测试数据 明细数据
let testData1: any = [
  {zy: '缴纳税金', kjkm1: '1012', kjkm2: '其他货币资金', kjkm3: -76, jfje: null, dfje: '870000' },
  {zy: '结转销售成本', kjkm1: '1012', kjkm2: '其他货币资金', kjkm3: -76, jfje: '780000', dfje: null },
  {zy: '计提税金及附加', kjkm1: '1012', kjkm2: '其他货币资金', kjkm3: -76, jfje: '870000', dfje: null },
  {zy: '采购', kjkm1: '122103', kjkm2: '其他应收款-代扣代交个人医疗保险', kjkm3: 89, jfje: '780000', dfje: null },
  {zy: '期间损益结转', kjkm1: '1421', kjkm2: '消耗性生物资产', kjkm3: -89, jfje: null, dfje: '7800' },
  {zy: '结转销售成本', kjkm1: '1012', kjkm2: '其他货币资金', kjkm3: -76, jfje: '7800', dfje: null },
];

// 测试数据 合计数据
let testData2: any = { jfje: '1657800', dfje: '1657800', hj: '壹万陆仟伍佰柒拾捌元整', zdr: '宋小宝' };

const JiPingZhang: React.FC<unknown> = () => {

  // 获取行借方金额、贷方金额数字
  const getNumber: any = (je: any) => {
    let jeNumberArr: any = (je?.split('') || []).reverse();
    let numberNode: any = [];
    for (let i = 0; i < 12; i++ ) {
      numberNode.push(<div className="fi-voucher-entry-cash-grid">{jeNumberArr[11 - i] || ''}</div>);
    }
    return numberNode;
  }

  // 行数据
  const rowData = () => {
    // 行左侧按钮
    let btnLeft: any = <div className="fi-voucher-entry-operator" style={{left: '5px', top: '9%'}}>
      <div><PlusSquareOutlined /></div>
      <div><CopyOutlined/></div>
    </div>;
    // 行右侧按钮
    let btnRight: any = <div className="fi-voucher-entry-operator" style={{right: '12px', top: '32%'}}>
      <div style={{color: '#f63f63'}}><DeleteOutlined/></div>
    </div>;
    // 遍历数据并填充
    let dataTmp: any = [];
    testData1.forEach((item: any, index: any) => {
      let { zy, kjkm1, kjkm2, kjkm3, jfje, dfje} = item;
      dataTmp.push(<>
        <div className="fi-voucher-entry" view-index="4" style={{height: '54px'}}>
          { btnLeft }
          <div className="fi-voucher-entry-cop fi-voucher-entry-cop-index">{ index + 1 }</div>
          <div className="fi-voucher-entry-content">
            <div className="fi-voucher-entry-cop" style={{flex: '3 1 0px'}}>
              <div className="fi-voucher-summary" style={{height: '100%', padding: '8px', lineHeight: '20px', wordBreak: 'break-all', overflowY: 'auto', display: 'block'}}>{zy}</div>
            </div>
            <div className="fi-voucher-entry-cop" style={{flex: '7 1 0px', overflow: 'hidden'}}>
              <div className="fi-vocher-subject" style={{minHeight: '54px', height: '100%', position: 'relative'}}>
                <div className="fi-vocher-showInfo" style={{display: 'block', height: '100%'}}>
                  <div>
                    <p className="fi-pz-sub-row  voucher-subject-name">{kjkm1} {kjkm2}</p>
                    <div style={{display: 'flex', justifyContent: 'space-between', height: '18px', fontSize: '12px'}}>
                      <div className="voucher-subject-amount">
                        <span className="voucher-subject-back-calculate">余额：</span><span className="voucher-subject-amount-number">{kjkm3}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="fi-voucher-entry-cop" style={{width: '215px'}}>
              <div className="fi-voucher-cash-wrapper">
                <div style={{display: 'block', height: '100%'}}>
                  <div style={{display: 'flex', height: '100%'}}>
                    { getNumber(jfje) }
                  </div>
                </div>
              </div>
            </div>
            <div className="fi-voucher-entry-cop" style={{width: '215px'}}>
              <div className="fi-voucher-cash-wrapper">
                <div style={{display: 'block', height: '100%'}}>
                  <div style={{display: 'flex', height: '100%'}}>
                    { getNumber(dfje) }
                  </div>
                </div>
              </div>
            </div>
          </div>
          { btnRight }
        </div>
      </>)
    });
    return dataTmp;
  }

  return <div className='wrap-jz'>
    <div style={{ margin: '12px 30px 12px 25px', textAlign: 'right'}}>
      <Row>
        <Col flex="none">
          <Space size='small'>
            <Typography.Link disabled><DoubleLeftOutlined /></Typography.Link>
            <Typography.Link disabled><LeftOutlined /></Typography.Link>
            <Typography.Link disabled><RightOutlined /></Typography.Link>
            <Typography.Link disabled><DoubleRightOutlined /></Typography.Link>
          </Space>
        </Col>
        <Col flex="auto">
          <div style={{ textAlign: 'right'}}>
              <Space size='small'>
                <Button type="primary">保存</Button>
                <Button type="primary">保存并新增</Button>
                <Button>保存并复制</Button>
                <Button>打印</Button>
                <Button>清空</Button>
                <Button>保存模版</Button>
                <Dropdown overlay={<Menu>
                    <Menu.Item key='1'>新增科目</Menu.Item>
                    <Menu.Item key='2'>新增辅助</Menu.Item>
                    <Menu.Item key='3'>习惯设置</Menu.Item>
                  </Menu>}
                >
                  <Button><Space>更多<DownOutlined /></Space></Button>
                </Dropdown>
              </Space>
            </div>
        </Col>
      </Row>
    </div>
    <div style={{ margin: '12px 30px 12px 25px', textAlign: 'right'}}>
      <Row>
        <Col flex="none">
          <div>
            <Space size='small'>
              记字第<Input defaultValue='001' suffix="号" style={{ width: '80px', marginRight: '12px' }}/>
              记账日期<DatePicker defaultValue={moment('2015-01-01', 'YYYY-MM-DD')} />
              <Typography.Link style={{ marginLeft: '12px' }}><SolutionOutlined /> 凭证查询</Typography.Link>
            </Space>
          </div>
        </Col>
        <Col flex="auto">
          <div style={{ textAlign: 'right'}}>
            <Space size='small'>
              模板调用 <Select placeholder='请选择' style={{ width: '130px', textAlign: 'left', marginRight: '12px' }}>
                <Select.Option value="http://">http://</Select.Option>
                <Select.Option value="https://">https://</Select.Option>
              </Select>
              附单据 <Input suffix="张" style={{ width: '80px' }}/>
            </Space>
          </div>
        </Col>
      </Row>
    </div>
    <div className="new-voucher-main-entry-scroll">
      <div className="rc-virtual-list" style={{position: 'relative'}}>
        <div className="rc-virtual-list-holder" style={{maxHeight: '651px', overflowY: 'hidden', overflowAnchor: 'none'}}>
          <div>
            <div className="rc-virtual-list-holder-inner" style={{display: 'flex', flexDirection: 'column'}}>
              <div className="fi-voucher-entry fi-voucher-entry-head">
                <div className="fi-voucher-entry-cop fi-voucher-entry-cop-head fi-voucher-entry-cop-index">行次</div>
                <div className="fi-voucher-entry-content fi-voucher-entry-content-head">
                  <div className="fi-voucher-entry-content-left">
                    <div className="fi-voucher-entry-cop fi-voucher-entry-cop-head" style={{flex: '3 1 0px'}}>摘要</div>
                    <div className="fi-voucher-entry-cop fi-voucher-entry-cop-head" style={{flex: '7 1 0px', position: 'relative', borderRight: 'none'}}>会计科目</div>
                  </div>
                  <div className="fi-voucher-entry-content-right">
                    <div className="fi-voucher-entry-cop fi-voucher-entry-cop-head-cash" style={{width: '215px'}}>
                      <div className="fi-voucher-vertical-middle" style={{flexGrow: 1, borderBottom: '1px solid rgb(209, 211, 216)'}}>借方金额</div>
                      <div style={{flexGrow: 1, display: 'flex'}}>
                        <div className="fi-voucher-entry-cash-grid fontsize12">十</div>
                        <div className="fi-voucher-entry-cash-grid fontsize12">亿</div>
                        <div className="fi-voucher-entry-cash-grid fontsize12">千</div>
                        <div className="fi-voucher-entry-cash-grid fontsize12">百</div>
                        <div className="fi-voucher-entry-cash-grid fontsize12">十</div>
                        <div className="fi-voucher-entry-cash-grid fontsize12">万</div>
                        <div className="fi-voucher-entry-cash-grid fontsize12">千</div>
                        <div className="fi-voucher-entry-cash-grid fontsize12">百</div>
                        <div className="fi-voucher-entry-cash-grid fontsize12">十</div>
                        <div className="fi-voucher-entry-cash-grid fontsize12">元</div>
                        <div className="fi-voucher-entry-cash-grid fontsize12">角</div>
                        <div className="fi-voucher-entry-cash-grid fontsize12">分</div>
                      </div>
                    </div>
                    <div className="fi-voucher-entry-cop fi-voucher-entry-cop-head-cash" style={{width: '215px'}}>
                      <div className="fi-voucher-vertical-middle" style={{flexGrow: 1, borderBottom: '1px solid rgb(209, 211, 216)'}}>贷方金额</div>
                      <div style={{flexGrow: 1, display: 'flex'}}>
                        <div className="fi-voucher-entry-cash-grid fontsize12">十</div>
                        <div className="fi-voucher-entry-cash-grid fontsize12">亿</div>
                        <div className="fi-voucher-entry-cash-grid fontsize12">千</div>
                        <div className="fi-voucher-entry-cash-grid fontsize12">百</div>
                        <div className="fi-voucher-entry-cash-grid fontsize12">十</div>
                        <div className="fi-voucher-entry-cash-grid fontsize12">万</div>
                        <div className="fi-voucher-entry-cash-grid fontsize12">千</div>
                        <div className="fi-voucher-entry-cash-grid fontsize12">百</div>
                        <div className="fi-voucher-entry-cash-grid fontsize12">十</div>
                        <div className="fi-voucher-entry-cash-grid fontsize12">元</div>
                        <div className="fi-voucher-entry-cash-grid fontsize12">角</div>
                        <div className="fi-voucher-entry-cash-grid fontsize12">分</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              { rowData() }
              <div className="fi-voucher-entry fi-voucher-entry-total">
                <div className="fi-voucher-entry-cop fi-voucher-entry-cop-total"></div>
                <div className="fi-voucher-entry-content">
                  <div className="fi-voucher-entry-title" style={{flex: '1 1 0%'}}><span>合计：{ testData2.hj }</span></div>
                  <div className="fi-voucher-entry-content-right">
                    <div className="fi-voucher-entry-cop" style={{width: '215px'}}>
                      <div className="fi-voucher-cash-wrapper">
                        <div style={{display: 'block', height: '100%'}}>
                          <div style={{display: 'flex', height: '100%'}}>
                            { getNumber(testData2.jfje) }
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="fi-voucher-entry-cop" style={{width: '215px'}}>
                      <div className="fi-voucher-cash-wrapper">
                        <div style={{display: 'block', height: '100%'}}>
                          <div style={{display: 'flex', height: '100%'}}>
                          { getNumber(testData2.dfje) }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style={{ margin: '10px 30px 0 25px', fontSize: '12px', color: '#666666'}}> 制单人：{ testData2.zdr}  <FormOutlined/></div>
  </div>
};

export default JiPingZhang;