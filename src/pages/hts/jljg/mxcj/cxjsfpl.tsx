import React, {useImperativeHandle, useState,useEffect } from 'react';
import { Space, Input, Button, Spin, Form, Checkbox, List, message, Popover, Select, Badge } from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
import { DrawerForm } from '@ant-design/pro-form';
import ProCard from '@ant-design/pro-card';
import Fplmx from './fplmx';
import './style.less';
import {cxjsfpl, gxsjfpldc, gxsjfpl } from '@/pages/hts/services/htsApi';
import myUtil from '@/components/DDAssist/util';
import fplfbconfig from './cxjsfplconfig';
import { useIntl } from 'umi';
import moment from 'moment';
import cktsUtil from '@/pages/hts/cktsUtil';

export interface DDModalGridProps {
  onRef?: any;
  visible?: any;
}

const Cxjsfpl: React.FC<DDModalGridProps> = ({ onRef, visible = false }) => {
  const [formSearch] = Form.useForm();
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [masker, setMasker] = useState(false);
  const [myConfig, setMyConfig] = React.useState<any>(null);
  const [zycs, setZycs] = useState<any>({});
  const [data, setData] = useState<any>([]); // 左侧区域的值
  // const [formVal, setFormVal] = useState<any>({cybz: '', jljgszch: ''}); //查询区域值

  const [checkedList, setCheckedList] = React.useState<any>([]); // 选中值
  const [collapsed, setCollapsed] = useState(false);
  const [indeterminate, setIndeterminate] = React.useState(false); // 全选状态
  const [checkAll, setCheckAll] = useState(false); // 是否全选
  const [queryRef, setQueryRef] = useState<any>();

  const intl = useIntl();

  // 开启
  const showModal = (param: any, unitRef: any) => {
    // 保存主表传递参数
    setZycs(param);
    // 查询左侧列表数据
    initLeftData(param);
    setQueryRef(unitRef);
    setModalVisible(true);
  };

  // 查询左侧区域数据
  const initLeftData = (params: any) => {
    if (masker) {
      return;
    }
    setMasker(true);
    cxjsfpl(params).then((response) => {
      setMasker(false);
      const { code, body, desc } = response;
      if (code === '200') {
        setData(body || []);
        // 默认加载第一条数据
        if (body && body.length > 0) {
          setMyConfig(null);
          getDetail(body[0], 0);
        } else {
          setMyConfig(null);
        }
      } else {
        message.error(desc);
      }
    });
  }

  // 点击查询按钮执行查询
  const handleMdthxFplSearch = (values: any) => {
    const searchModel: any = [];
    zycs.searchModel.forEach((item: any) => {
      searchModel.push(item);
    });
    if (values.cybz && values.cybz != '') {
      searchModel.push({property:'cybz', value: values.cybz, op: 'dd'});
    }
    if (values.jljgszch && values.jljgszch.trim() != '') {
      searchModel.push({property:'jljgszch', value: values.jljgszch, op: 'al'});
    }
    setIndeterminate(false);
    setCheckAll(false);
    setCheckedList([]);
    initLeftData({searchModel: searchModel});
  }

  const onSearch = (value: any, event: any) => {
    if (event.target.tagName != 'INPUT') {
      formSearch.submit();
    }
  }

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  useEffect(() => {
    if(!modalVisible){
      setCheckedList([]);
      setIndeterminate(false);
      setCheckAll(false);
    }
  }, [modalVisible]);


  // 设置全选切换
  const onCheckAllChange = (e: any) => {
    if (e.target.checked) {
      const check: any = [];
      data.forEach((item: any) => {
        check.push(item);
      });
      setCheckedList(check);
    } else {
      setCheckedList([]);
    }
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  }

  // 导出
  const handleMdthxFplSjdc = () => {
    if (data.length === 0) {
      const noDataMessage = intl.formatMessage({ id: 'message_common_nodata_export' });
      message.info(noDataMessage);
      return;
    }

    let listData = [];
    if (checkedList && checkedList.length != 0) {
      listData = checkedList;
    } else {
      listData = data;
    }
    const csArr: any = [];
    listData.forEach((item: any) => {
      csArr.push(item);
    });
    const param = {data: csArr, datatype: 'jsfpldc'};
    // gxsjfpldc(param).then((response) => {
    //   const blob = new Blob([response]);   //注意拿到的是数据流！！
    //   const objectURL = URL.createObjectURL(blob);
    //   let btn = document.createElement('a');
    //   btn.download = '进料加工计划分配率.xls'; //文件类型
    //   btn.href = objectURL;
    //   btn.click();
    //   URL.revokeObjectURL(objectURL);
    // });

    // const  url = '/hx/ty/report/excelPostReport/EXCEL_REPORT_JLJG_MDTHX_SJFPL/';
    // cktsUtil.downloadFileCkts(url, param);

    gxsjfpldc(param).then((response) => {
      const {code, body, desc} = response;
      if (code === '200') {
        const { blob, fileName } = body;
        myUtil.file.downloadExcel(blob, fileName);
      } else {
        message.error(desc);
      }
    });
  }
  // 更新分配率
  const handleMdthxFplGxfpl = () => {
    if (data.length === 0) {
      const noDataMessage = intl.formatMessage({ id: 'message_jljghx_mdthx_cxjsfpl_gxjsfpl_no_data' });
      message.info(noDataMessage);
      return;
    }
    let listData = [];
    if (checkedList && checkedList.length != 0) {
      listData = checkedList;
    } else {
      listData = data;
    }
    const csArr: any = [];
    listData.forEach((item: any) => {
      csArr.push({uuid: item.uuid, cxjljgsjfpl: item.cxjljgsjfpl,jsjkzz:item?.jsjkzz,jsckzz:item?.jsckzz});
    });
    const param = {data: csArr};
    gxsjfpl(param).then((response) => {
      const {code, desc} = response;
      if (code === '200') {
        message.success(intl.formatMessage({ id: 'message_jljghx_mdthx_cxjsfpl_gxjsfpl_success' }));
        setModalVisible(false);
        queryRef.current?.reload();
      } else {
        message.error(desc);
      }
    });
  }

  // Checkbox 选中事件
  const onChange = (list: any) => {
    console.info(list);
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < data.length);
    setCheckAll(list.length === data.length);
  };

  // 左侧列表点击，获取明细
  const getDetail = (param: any, index: number) => {
    const divCards: any = document.querySelectorAll(".fpsqd_item");
    if (divCards) {
      divCards.forEach((card: any) => {
        card.classList.remove('selected');
      });
    }
    const divCardCurrent: any = document.querySelector(".fpsqd_item" + index);
    if (divCardCurrent) {
      divCardCurrent?.classList?.add('selected');
    }
    const c = { ...fplfbconfig};
    const initSearchModal: any = [];
    initSearchModal.push({property: 'jljgszch', value: param.jljgszch, op: 'dd' });
    initSearchModal.push({property: 'ssq', value: param.ssq, op: 'dd' });
    initSearchModal.push({property: 'sbpc', value: param.sbpc, op: 'dd' });
    if (param.jljgszch.startsWith('C')) {
      initSearchModal.push({ property: 'jarq', value: param.jarq, op: 'dd' });
    } else {
      initSearchModal.push({ property: 'hxqsrq', value: param.hxqsrq, op: 'dd' ,type:5});
      initSearchModal.push({ property: 'hxjzrq', value: param.hxjzrq, op: 'dd' ,type:5});
    }
    const gridParams: any = {
      initSearchModal: initSearchModal,
    }
    c.gridParams = gridParams;
    c.grid_scroll_y = `${document.documentElement.clientHeight - 315}px`;
    setMyConfig(c);
  }

  const leftContent = <>
    <div className="left_card_header">
      <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll} /><span className="lch_title">申报核销手（账）册号</span>
      <a className="lch_btn" onClick={toggleCollapsed}>{collapsed ? '展开' : '收起'}</a>
    </div>
    <div
      id="scrollableDivCxjsfpl"
      style={{
        height: 'calc(100vh - 40px - 69px - 40px - 40px)',
        overflow: 'auto',
      }}
    >
      <Checkbox.Group value={checkedList} onChange={onChange}>
        <List
          dataSource={data}
          renderItem={(item: any, index: number) => (
            <List.Item key={index.toString() + 'fpllistItem'} onClick={() => getDetail(item, index)} className={`fpsqd_item fpsqd_item${index} ${index === 0 ? 'selected' : ''}`}>
              <ProCard
                title={(<>
                  <Checkbox value={item} onClick={(e) => { e.stopPropagation(); }} />
                  {collapsed ?
                    <>
                    <span id="dcl_title_sq" className="dcl_title_sq">
                      {item.cybz === 'Y' ? <span className="dd_grid_icon"><Popover placement="top" content={"有差异"}><Badge status="error" /></Popover>{item.jljgszch}</span> :
                          <span className="dd_grid_icon"><Popover placement="top" content={"无差异"}><Badge status="success" /></Popover>{item.jljgszch}</span>
                      }
                      <span className="dcl_title_sq_je">
                        {item.jljgszch.startsWith('C') ?
                          <>
                            {item.jarq ? moment(item.jarq).format('YYYY/MM/DD') : ''}
                          </> :
                          <>
                            {item.hxqsrq ? moment(item.hxqsrq).format('YYYY/MM/DD') : ''}-{item.hxjzrq ? moment(item.hxjzrq).format('YYYY/MM/DD') : ''}
                          </>
                        }
                      </span>
                    </span>
                  </> :
                  <>
                    <span className="dcl_title">
                      {item.jljgszch.startsWith('C') ?
                        <>
                          手册号：{item.jljgszch}
                        </> :
                        <>
                          账册号：{item.jljgszch}
                        </>
                      }
                    </span>
                  </>
                }
                </>)}
                size="small"
                collapsible
                collapsed={collapsed}
              >
                <div className="dd_card_list">
                  <>
                    <div className="dcl_item">
                      <>
                        所属期/申报批次：{item.ssq + '/' + item.sbpc}
                      </>
                    </div>
                    <div className="dcl_item">{item.jljgszch.startsWith('C') ?
                        <>
                          结案日期：{item.jarq ? moment(item.jarq).format('YYYY/MM/DD') : ''}
                        </> :
                        <>
                          核销起止日期：{item.hxqsrq ? moment(item.hxqsrq).format('YYYY/MM/DD') : ''}-{item.hxjzrq ? moment(item.hxjzrq).format('YYYY/MM/DD') : ''}
                        </>
                      }</div>
                    <div className="dcl_item">
                      <>
                        上次计算分配率：{myUtil.text.formatNum(item.scjljgsjfpl, '0,0.00000')}
                      </>
                    </div>
                    <div className="dcl_item">
                      <>
                        重新计算分配率：{myUtil.text.formatNum(item.cxjljgsjfpl, '0,0.00000')}
                      </>
                    </div>
                    <div className="dcl_item">
                      <>
                        差异结果：{item.cybz === 'Y' ? <span className="dd_grid_icon"><Badge status="error" />{"有差异"} </span> :
                                <span className="dd_grid_icon"><Badge status="success" />{"无差异"} </span>
                            }
                      </>
                    </div>
                  </>
                </div>
              </ProCard>
            </List.Item>
          )}
        />
      </Checkbox.Group>
    </div>
  </>;


  const rightContent = <>
  <div className="lay_wrap_right_d">
  {myConfig ? <Fplmx param={myConfig} /> :
    <div style={{
      height: myUtil.heightCalc.getCalc(['header', 'cardMargin', '69px', '40px', '20px']),// header cardMargin 69搜索栏 40工具栏 40工具栏 20padding
    }}>
      <div className='cxjsfpl_no_data_right'><div className='cxjsfpl_no_data_text'>暂无数据</div></div>
    </div>
  }
  </div>
  </>;

  const leftContentEmpty = <div id="scrollableDivCxjsfpl"
  style={{
    height: myUtil.heightCalc.getCalc(['header', 'cardMargin', '69px', '20px']),// header cardMargin 69搜索栏 40工具栏 40工具栏 20padding
  }}>
    <div className='cxjsfpl_no_data_left_wrap'>
      <div className='cxjsfpl_no_data_left'>
        <div className='cxjsfpl_no_data_text'>暂无数据</div>
      </div>
    </div>
  </div>

  return (
    <>
      <DrawerForm
        title="更新计划分配率确认"
        className='dd_data_page_modal'
        open={modalVisible}
        width={CONSTANTS.C_MODAL_WIDTH_X4}
        onVisibleChange={setModalVisible}
        drawerProps={{ className: "dd_mdthxfpl_draw_outer" }}
        submitter={{
          submitButtonProps: {
            style: {
              display: 'none',
            },
          },
          resetButtonProps: {
            style: {
              display: 'none',
            },
          },
        }}
      >
        <Spin tip="Loading..." spinning={masker} delay={100}>
          <ProCard split="horizontal" className="dd_mdthxfpl_draw_wrap">
            <ProCard className="dd_mdthxfpl_top_wrap" title={
              <Form layout="inline" form={formSearch} onFinish={handleMdthxFplSearch}   initialValues={{cybz: '', jljgszch: ''}}>
                <Form.Item name="cybz">
                  <Select style={{ width: '90px' }} options={[
                    { value: "", label: "全部" },
                    { value: "Y", label: "有差异" },
                    { value: "N", label: "无差异" }]}
                  />
                </Form.Item>
                <Form.Item name="jljgszch">
                  <Input.Search placeholder="申报核销手（账）册号" allowClear enterButton="查询" onSearch={onSearch}/>
                </Form.Item>
              </Form>
              } extra={
                <Form layout="inline" >
                  <Form.Item>
                    <Space>
                      <Button type="link" key="mdthxFplSjdc" onClick={handleMdthxFplSjdc}>数据导出</Button>
                      <Button type="link" key="mdthxFplGxfpl" onClick={handleMdthxFplGxfpl}>更新分配率</Button>
                    </Space>
                  </Form.Item>
                </Form>
              }>
            </ProCard>
            <div className="dd_mdthxfpl_bottom_wrap" style={{ position: 'relative', padding: '0 0 0 371px' }}>
              <div className="lay_wrap_left" style={{ position: 'absolute', top: '0', left: '0', paddingTop: '20px', width: '354px' }}>
                {/* {leftContent} */}
                {data.length == 0 ? leftContentEmpty : leftContent}
              </div>
              <div className="lay_wrap_right" style={{ paddingTop: '20px' }}>
                {rightContent}
              </div>
            </div>
          </ProCard>
        </Spin>
      </DrawerForm>
    </>
  );
};

export default Cxjsfpl;
