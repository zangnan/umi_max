/**
 * title: 智能配单明细
 * creator: yxy
 */
import React, { useState, useEffect, useRef, useImperativeHandle } from 'react';
import { List, Skeleton, message, Spin, Popover, Form, Input, Space, Button, Modal, Drawer } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import ProCard from '@ant-design/pro-card';
import DDAlert from '@/pages/hts/components/DDAlert';
import { queryZnpdmxSjxqList, mtsZnpdmxFqpd, queryMtsZnpdSbxx, mtsZnpdmxScmx, queryMtsZnpdmxTsxx, exportPager, checkZnpdSbxx } from '@/pages/hts/services/htsApi';
import myUtil, { intl as intl2 } from '@/components/DDAssist/util';
import Znpdmxfb from './znpdmxfb';
import './style.less';
import Ckbgdmx from './ckbgdmx';
import config from './config';
import { history } from 'umi';
import Scmx from './scmx';
import CONSTANTS from '@/components/DDAssist/constants';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import configFail from './fail_config';
import fFail from './fail_f';

export interface ZnpdmxProps {
  onRef?: any;
  CallbackFmFunc?: any
  closeModal?: any
}

const Znpdmx: React.FC<ZnpdmxProps> = ({
  onRef,
  CallbackFmFunc,
  closeModal
}) => {
  const [masker, setMasker] = useState(false);                                    // loading标志
  const [gdPage, setGdPage] = useState<any>(1);                                   // 滚动加载时，记录加载的page
  const [pageSize] = useState<any>(200);                                          // 滚动加载每次加载条数
  const [myConfig, setMyConfig] = React.useState<any>(null);
  const [collapsed, setCollapsed] = useState(false);                              // 左侧列表收起标志
  const [data, setData] = useState<any>([]);                                      // 左侧列表加载数据
  const [maxRowCount, setMaxRowCount] = useState<any>(0);                         // 每次查询时，数据条数
  const [queryModel, setQueryModel] = useState<any>({});                          // 查询条件
  const [searchForm] = Form.useForm();                                            // 查询form

  const [ymly, setYmly] = useState<any>('ZDPP');                                  // 页面来源 ZDPP: 自动匹配 ，SDPD: 手动匹配
  const [tsxx, setTsxx] = useState<any>({});

  const bgdmxRef: any = useRef();
  const scmxRef: any = useRef();
  const [modalVisibleMx, setModalVisibleMx] = useState<boolean>(false);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [initValues, setInitValues] = useState<any>({});
  const [scmxClass, setScmxClass] = useState<any>('');
  const [drawerVisibleFail, setDrawerVisibleFail] = useState<boolean>(false); // 打开失败详情
  const [myConfigFail, setMyConfigFail] = React.useState<any>(configFail); // 失败详情

  const scmxPxArr = [
    { pxzd: '出口日期', field:'ljDate', order: 'asc'},
    { pxzd: '报关单号', field:'bgdNo', order: 'asc'},
    { pxzd: '出口发票号', field:'invNo', order: 'asc'},
    // { pxzd: '出口合同号', field:'htNo', order: 'asc'},
  ]
  // 滚动加载
  const gdloadMoreData = () => {
    const params = dealCxcs(queryModel, gdPage + 1);
    queryZbxx(params);
  }

  // 查询
  const onFinish = (values: any) => {
    setGdPage(1);
    setQueryModel(values);
    loadMoreData(values);
  }

  const handleSearch = (value: any, event: any) => {
    if (event.target.tagName != 'INPUT') {
      searchForm.submit();
    }
  }

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  }

  // 报关单明细
  const bgdMx = (params: any) => {
    bgdmxRef?.current?.showModal(params);
  }

  // 放弃配单
  const fqpd = (params: any) => {
    params.pduuid = searchForm.getFieldValue('pduuid');
    DDAlert.open({
      title: intl2.formatMessage({ id: 'message_mts_znpdmx_fppd_title' }),
      info: intl2.formatMessage({ id: 'message_mts_znpdmx_fppd_info' }),
      infoType: 'question',
      modalType: 'confirm',
      closeStatus: true,
      okCallbackFn: function (thisObj: any) {
        thisObj.setState({ masker: true });
        mtsZnpdmxFqpd(params).then((response) => {
          const { code, desc } = response;
          DDAlert.close();
          if (code === '200') {
            message.success(intl2.formatMessage({ id: 'message_mts_znpdmx_fppd_success' }));
            onFinish(queryModel);
            queryTsxx({pduuid: queryModel.pduuid});
          } else {
            message.error(desc);
          }
        });
      }
    });
  }

  // 返回
  const backZnpd = () => {
    DDAlert.open({
      title: intl2.formatMessage({ id: 'message_mts_znpdmx_back_title' }),
      info: intl2.formatMessage({ id: 'message_mts_znpdmx_back_info' }),
      infoType: 'question',
      modalType: 'confirm',
      okCallbackFn: function () {
        setDrawerVisible(false);
        CallbackFmFunc('ymly');
        // history.push({ pathname: '/hts/mts/sjznpd/znpd', query: { fhbz: ymly } }); // 原/hts/mts/sjznpd/znpd
      }
    });
  }

  // 打开生成明细页面
  const scmx = () => {
    setMasker(true);
    const params: any = {pduuid: queryModel.pduuid};
    queryMtsZnpdSbxx(params).then((response) => {
      setMasker(false);
      const {code, desc} = response;
      if (code != '200') {
        message.error(desc);
      }
      const initVal = response?.body || {};
      initVal.pduuid = queryModel.pduuid;
      setInitValues(initVal);
      setModalVisibleMx(true);
    })
  }

  // 生成明细
  const handlerScmx = () => {
    scmxRef?.current?.handleforms().validateFields().then(async (values: any) => {
      let ldlpNo: any = '';
      // setMasker(true);
      // const result = await checkZnpdSbxx({pduuid: values.pduuid, sbYm: values.sbYm, sbPc:values.sbPc}).then((response) => {
      //   const { code, body, desc } = response;
      //   setMasker(false);
      //   if (code === '200') {
      //     ldlpNo = body.ldlpNo;
      //     scmxRef?.current?.handleforms().setFieldsValue({ldlpNo: body.ldlpNo});
      //     return true;
      //   } else if (code === '900') {
      //     scmxRef?.current?.handleforms().setFieldsValue({ldlpNo: ''});
      //     message.info(desc);
      //     return false;
      //   } else {
      //     scmxRef?.current?.handleforms().setFieldsValue({ldlpNo: ''});
      //     message.error(desc);
      //     return false;
      //   }
      // })
      console.log(values)
        values.pxgz = scmxRef?.current?.handleGetGridData();
        values.pduuid = searchForm.getFieldValue('pduuid');
        scmxRef?.current?.changeMasker(true);
        setScmxClass('dd_modal_show_masker');
        mtsZnpdmxScmx({...values}).then((response) => {
          // scmxRef?.current?.handleforms().setFieldsValue(values);
          scmxRef?.current?.changeMasker(false);
          setScmxClass('');
          const {code, body, desc} = response;
          if (code === '200') {
            setModalVisibleMx(false);
            DDAlert.open({
              title: intl2.formatMessage({ id: 'message_mts_znpdmx_scmx_title' }),
              info: intl2.formatMessage({ id: 'message_mts_znpdmx_scmx_info' }),
              infoType: 'success',
              content: [
                body
              ],
              okCallbackFn: function () {
                setDrawerVisible(false);
                CallbackFmFunc('ymly');
                closeModal();
                // history.push({ pathname: '/hts/mts/sjznpd/znpd', query: { fhbz: ymly}}); // 原/hts/mts/sjznpd/znpd
              }
            });
          } else if (code === '900') {
            message.info(desc);
          } else {
            message.error(desc)
          }
        })
    })
  }

  // 导出
  const znpdmxDc = () => {
    if (!data || data.length <= 0) {
      message.info(intl2.formatMessage({ id: 'message_common_nodata_export' }));
      return;
    }
    const params: any = {
      key: 'MTS_ZNPD_QRPD_DC_REPORT',
      orderModel: [{field:'CKBGDH', order:'asc'}],
    };
    const tmpModel: any = [];
    tmpModel.push({property: 'pduuid',value: searchForm.getFieldValue('pduuid'),op: 'dd'});
    if (queryModel.hasOwnProperty('ckbgdh') && queryModel['ckbgdh']) {
      tmpModel.push({property: 'ckbgdh',value: queryModel['ckbgdh'],op: 'al'});
    }
    params.searchModel = tmpModel;
    setMasker(true);
    exportPager(params).then((response) => {
      setMasker(false);
      const { code, body, desc } = response;
      if (code === '200') {
        const { blob, fileName } = body;
        myUtil.file.downloadExcel(blob, fileName);
      } else {
        message.error(desc);
      }
    })
  }


  // 左侧列表点击，获取明细
  const getDetail = (item: any, index: number) => {
    const divCards: any = document.querySelectorAll(".fpsqd_item");
    divCards.forEach((card: any) => {
      card.classList.remove('selected');
    });
    const divCardCurrent: any = document.querySelector(".fpsqd_item" + index);
    divCardCurrent?.classList?.add('selected');
    setMyConfig(null);
    const c = { ...config };
    const initSearchModal = [];
    initSearchModal.push({ property: 'ckbgdh', value: item.ckbgdh, op: 'zdy' });
    initSearchModal.push({ property: 'pduuid', value: searchForm.getFieldValue('pduuid'), op: 'zdy' });

    const gridParams: any = {
      initSearchModal: initSearchModal,
    }
    c.gridParams = gridParams;
    c.grid_scroll_y = `${document.documentElement.clientHeight - 315}px`;
    setMyConfig(c);
  }

  // 左侧列表查询
  const queryZbxx = (params: any) => {
    setMasker(true);
    queryZnpdmxSjxqList(params).then((response) => {
      setMasker(false);
      const { code, body } = response;
      if (code === '200') {
        const { rows, page, rowCount } = body;
        setGdPage(page);
        setMaxRowCount(rowCount);
        if (page === 1 && rowCount === 0) {
          setData([]);
          setMyConfig(null);
        } else if (page === 1 && rowCount > 0) {
          setData(rows);
          getDetail(rows[0], 0);
        } else {
          setData([...data, ...rows]);
        }
      } else {
        setMyConfig(null);
      }
    })
  }

  // 处理主表查询条件
  const dealCxcs = (params: any, cxPage: any) => {
    const searchModel: any = [];
    if (params.hasOwnProperty('ckbgdh') && params.ckbgdh != '') {
      searchModel.push({ property: 'ckbgdh', value: params.ckbgdh, op: 'zdy' });
    }
    searchModel.push({ property: 'pduuid', value: params.pduuid, op: 'zdy' });
    return {
      searchModel,
      pageSize,
      page: cxPage
    }
  }

  const loadMoreData = (param: any) => {
    if (masker) {
      return;
    }
    const params = dealCxcs(param, 1);
    queryZbxx(params);
  };

  const queryTsxx = (params: any) => {
    queryMtsZnpdmxTsxx(params).then((response) => {
      const { code, desc, body} = response;
      if (code === '200') {
        setTsxx(body);
      } else {
        message.error(desc);
      }
    })
  }

  useEffect(() => {
    // if (history.location.search) {
    //   const search = history.location.search.replace('?', '');
    //   const csArr: any = search.split('&');
    //   const cs: any = {};
    //   csArr.forEach((item: any) => {
    //     const tmp: any = item.split('=');
    //     cs[tmp[0]] = tmp[1];
    //   });
    //   setYmly(cs.bz);
    //   searchForm.setFieldsValue(cs);
    //   loadMoreData({pduuid: cs.pduuid});
    //   queryTsxx({pduuid: cs.pduuid});
    //   setQueryModel({pduuid: cs.pduuid});
    // }
  }, []);

  // 开启
  const showModal = (params: any) => {
      const { bz, pduuid } = params;
      setYmly(bz);
      searchForm.setFieldsValue(params);
      loadMoreData({ pduuid: pduuid });
      queryTsxx({ pduuid: pduuid });
      setQueryModel({ pduuid: pduuid });
      setDrawerVisible(true);
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  const leftContentEmpty = <div id="scrollableDiv"
    style={{
      height: myUtil.heightCalc.getCalc(['header', 'cardMargin', '73px', '20px']),// header cardMargin 73搜索栏 40工具栏 40工具栏 20padding
    }}>
      <div className='lwrd_no_data_left_wrap'>
        <div className='lwrd_no_data_left'>
          <div className='lwrd_no_data_text'>暂无数据</div>
        </div>
      </div>
  </div>

  const leftContent = <>
    <div className="left_card_header">
      <span className="lch_title">数据详情</span>
      <a className="lch_btn" onClick={toggleCollapsed}>{collapsed ? '展开' : '收起'}</a>
    </div>
    <div id="scrollableDiv" className='left_card_content'
      style={{
        height: myUtil.heightCalc.getCalc(['header', 'cardMargin', '73px', '40px', '20px', '20px']),// header cardMargin 73搜索栏 40工具栏 40工具栏 20padding
        overflow: 'auto',
      }}>
        <InfiniteScroll
          dataLength={data.length}
          next={gdloadMoreData}
          hasMore={data.length < maxRowCount}
          loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
          scrollableTarget="scrollableDiv"
        >
          <List
            dataSource={data}
            renderItem={(item: any, index: number) => (
              <List.Item key={index.toString() + 'listItem'} onClick={() => getDetail(item, index)} className={`fpsqd_item fpsqd_item${index} ${index === 0 ? 'selected' : ''}`}>
                <ProCard
                  title={(<>
                    {collapsed ?
                      <>
                        <span className="dcl_title_sq">{item.ckbgdh}<span className="dcl_title_sq_rq">{myUtil.grid.formatDate(item.ckrq1, 'YYYY-MM-DD')}</span></span>
                      </> :
                    <><span className="dcl_title">出口货物报关单号：<a onClick={(event: any) => {event.stopPropagation(); bgdMx(item);}}>{item.ckbgdh}</a></span></>}
                  </>)}
                  size="small"
                  collapsible
                  collapsed={collapsed}
                >
                  <div className="dd_card_list">
                    <>
                      <div className="dcl_item">出口日期：{myUtil.grid.formatDate(item.ckrq1, 'YYYY-MM-DD')}</div>
                      <div className="dcl_item">商品代码：{item.ckspDm}</div>
                      <div className="dcl_item">
                        <Popover placement="right" content={item.hgspmc}>
                          海关商品名称：{(item.hgspmc && item.hgspmc.length > 10) ?
                          <a>{item.hgspmc.substring(0, 10)}...</a> : <span>{item.hgspmc}</span>
                          }
                        </Popover>
                      </div>
                      <div className="dcl_item">关单发票单位：{item.hgjldwmc}</div>
                      <div className="dcl_item_abs" style={{textAlign: 'right'}}><a onClick={(event: any) => {event.stopPropagation(); fqpd(item);}}>{'放弃配单'}</a></div>
                    </>
                  </div>
                </ProCard>
              </List.Item>
            )}
          />
        </InfiniteScroll>
    </div>
  </>;

  const rightContent = <>
    <div className="lay_wrap_right_d">
    {myConfig ? <Znpdmxfb param={myConfig} /> :
      <div style={{
        height: myUtil.heightCalc.getCalc(['header', 'cardMargin', '73px', '40px', '20px']),// header cardMargin 73搜索栏 40工具栏 40工具栏 20padding
      }}>
        <div className='lwrd_no_data_right'><div className='lwrd_no_data_text'>暂无数据</div></div>
      </div>
    }
    </div>
  </>;

  // 查看失败详情
  const showSbxq = () => {
    const pduuid = searchForm.getFieldValue('pduuid');
    if(pduuid){
      const c = { ...configFail }
      c.gridParams = {
        initSearchModal: [
          { property: 'pduuid', value: searchForm.getFieldValue('pduuid'), op: 'zdy' },
        ],
      }
      setMyConfigFail(c)
      setDrawerVisibleFail(true)
    }
  }

  return (
    <>
      <Drawer
        title={'配单明细'}
        open={drawerVisible}
        width={CONSTANTS.C_MODAL_WIDTH_MAX}
        onClose={() => { setDrawerVisible(false) }}
        className="dd_data_page_modal"
        destroyOnHidden={true}
        mask={{ closable: false }}
      >
        <Spin tip="Loading..." spinning={masker} delay={100}>
          <ProCard split="horizontal" className="dd_znpdmx_wrap">
            <ProCard className="dd_znpdmx_top_wrap" title={
              <Form layout="inline" form={searchForm} onFinish={onFinish} initialValues={{ ckbgdNo: '' }}>
                <Form.Item name="pduuid"  style={{display: "none"}}>
                  <Input type={'hidden'} />
                </Form.Item>
                <Form.Item name="ckbgdh">
                  <Input.Search placeholder="出口货物报关单号" allowClear enterButton="查询" onSearch={handleSearch} />
                </Form.Item>
                <div style={{margin: '5px 0 0 0'}}>
                  符合筛选条件并匹配成功的关单<b className="txt_b txt_h">{tsxx?.ppcgckbgdzs? tsxx?.ppcgckbgdzs : '0'}</b>份
                  <b className="txt_b txt_h">{tsxx?.ppcgckbgdts? tsxx?.ppcgckbgdts : '0'}</b>条，
                  发票<b className="txt_b txt_h">{tsxx?.ppcgzzszyfpzs? tsxx?.ppcgzzszyfpzs : '0'}</b>份
                  <b className="txt_b txt_h">{tsxx?.ppcghwmxts ? tsxx?.ppcghwmxts: '0'}</b>条，
                  参与匹配商品码<b className="txt_b txt_h">{tsxx?.cyppckspdmgs?tsxx?.cyppckspdmgs: '0'}</b>个,
                  匹配失败关单{tsxx?.wppcgckbgdzs?<b className="txt_b txt_h_error">{tsxx?.wppcgckbgdzs}</b>:<b className="txt_b txt_h">0</b>}份
                  {tsxx?.wppcgckbgdts?<b className="txt_b txt_h_error">{tsxx?.wppcgckbgdts}</b>:<b className="txt_b txt_h">0</b>}条,
                  发票{tsxx?.wppcgzzszyfpzs?<b className="txt_b txt_h_error">{tsxx?.wppcgzzszyfpzs}</b>:<b className="txt_b txt_h">0</b>}份
                  {tsxx?.wppcghwmxts?<b className="txt_b txt_h_error">{ tsxx?.wppcghwmxts}</b>:<b className="txt_b txt_h">0</b>}条。
                  {tsxx?.wppcgckbgdzs?<Button key={'xq'} onClick={showSbxq}>失败详情</Button>:<></>}
                </div>
              </Form>
            } extra={
              <Form layout="inline" >
                <Form.Item >
                  <Space>
                    <Button type="link" key={'back'} onClick={backZnpd}>返回</Button>
                    <Button type="primary" key={'scmx'} onClick={scmx} disabled={tsxx?.ppcgckbgdzs && tsxx?.ppcgckbgdts ? false:true}>生成明细</Button>
                    <Button type="primary" key={'znpdmxDc'} onClick={znpdmxDc} disabled={tsxx?.ppcgckbgdzs && tsxx?.ppcgckbgdts ? false:true}>导出</Button>
                  </Space>
                </Form.Item>
              </Form>
            }>
            </ProCard>
            <div className="dd_znpdmx_bottom_wrap" style={{ position: 'relative', padding: '0 0 0 371px' }}>
              <div className="lay_wrap_left" style={{ position: 'absolute', top: '0', left: '0', paddingTop: '20px', width: '405px' }}>
                {data.length == 0 ? leftContentEmpty : leftContent}
              </div>
              <div className="lay_wrap_right" style={{ paddingTop: '20px' }}>
                {rightContent}
              </div>
            </div>
          </ProCard>
          <Ckbgdmx onRef={bgdmxRef} />
          <Drawer
            title={'失败详情'}
            visible={drawerVisibleFail}
            width={CONSTANTS.C_MODAL_WIDTH_X4}
            onClose={() => { setDrawerVisibleFail(false) }}
            className="dd_data_page_modal"
            destroyOnHidden={true}
            mask={{ closable: false }}
          >
            <DDBunit2 config={myConfigFail} func={fFail} />
          </Drawer>
          <Modal
            title={'生成明细'}
            visible={modalVisibleMx}
            width={CONSTANTS.C_MODAL_WIDTH_X2}
            className={scmxClass}
            destroyOnHidden={true}
            mask={{ closable: false }}
            onCancel={() => { setModalVisibleMx(false) }}
            onOk={handlerScmx}
          >
            <Scmx onRef={scmxRef} sbxx={initValues} pxArr={scmxPxArr}/>
          </Modal>
        </Spin>
      </Drawer>
    </>
  );
};
export default Znpdmx;