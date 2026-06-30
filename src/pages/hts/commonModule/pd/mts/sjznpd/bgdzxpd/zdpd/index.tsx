/**
 * title: 按报关单智能配单---自动配单
 */
import React, { useState, useImperativeHandle, useRef } from 'react';
import { Modal, Spin, Button, Form, Input, Space, DatePicker, Popconfirm, message } from 'antd';
import {pdjgYppFp } from '@/pages/hts/services/htsApi';
import CONSTANTS from '@/components/DDAssist/constants';
import ProCard from '@ant-design/pro-card';
import myUtil from '@/components/DDAssist/util';
import { CloseOutlined, SearchOutlined } from '@ant-design/icons';
import DDBaseGrid from '@/components/DDBaseGrid';
import DDAlert from '@/pages/hts/components/DDAlert';
import DrawerSbyyxq from './sbyyxq';
import ModalScmx from './modalScmx';
import moment from 'moment';
import './style.less';


export type BadzylModal = {
  visible?: any;
  onRef?: any;
}

const BadzylModal: React.FC<BadzylModal> = ({
  visible = false,
  onRef,
}) => {
  const drawerSbyyxqRef: any = useRef();
  const modalScmxRef: any = useRef();
  const refDDBaseGrid: any = useRef();

  const [bgdForm] = Form.useForm();
  const [fpForm] = Form.useForm();

  const [masker, setMasker] = useState<boolean>(false); // 蒙板
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [mainParams, setMainParams] = useState<any>({});
  const [currentlySelectedBgd, setCurrentlySelectedBgd] = useState<any>({}); // 当前选中的报关单信息

  const [dataYppFp, setDataYppFp] = useState<any>([]); // 右侧已匹配发票

  const [queryBgdHeaderParam, setQueryBgdHeaderParam] = useState<any>({});
  const [queryBgdParam, setQueryBgdParam] = useState<any>({ searchModel: [] });

  // 报关单信息列表列配置项
  const columnsBgd = [
    { title: '报关单号', dataIndex: 'ckbgdh', width: 180 },
    { title: '出口日期', dataIndex: 'ckrq1', width: 90, render: (text: any) => (myUtil.grid.formatDate(text, 'YYYY-MM-DD')) },
    { title: '商品代码', dataIndex: 'ckspDm', width: 100 },
    { title: '海关商品名称', dataIndex: 'hgspmc', width: 180, ellipsis: true },
    { title: '规格型号', dataIndex: 'ggxh', width: 180, ellipsis: true },
    { title: '成交单位', dataIndex: 'sbjldwmc', width: 90 },
    { title: '成交数量', dataIndex: 'kysl', width: 120, align: 'right', render: (text: any) => (myUtil.text.formatNum(text, '0,0.00000')) },
    { title: '美元离岸价', dataIndex: 'kylaj', width: 120, align: 'right', render: (text: any) => (myUtil.text.formatNum(text, '0,0.00')) },
    { title: '成交金额', dataIndex: 'kyje', width: 120, align: 'right', render: (text: any) => (myUtil.text.formatNum(text, '0,0.00')) },
    { title: '成交币制', dataIndex: 'cjhbzmDm', width: 80 },
  ];
  // 已匹配发票信息列表列配置项
  const columnsYppFp = [
    { title: '发票号码', dataIndex: 'fphm', width: 180, fixed: 'left' },
    { title: '发票代码', dataIndex: 'fpDm', width: 120 },
    { title: '开票日期', dataIndex: 'kprq', width: 100, render: (text: any) => (myUtil.grid.formatDate(text, 'YYYY-MM-DD')) },
    { title: '行号', dataIndex: 'hh', width: 65 },
    { title: '商品名称', dataIndex: 'hwhyslwmc', width: 180, ellipsis: true },
    { title: '规格型号', dataIndex: 'ggxh', width: 180, ellipsis: true },
    { title: '数量', dataIndex: 'bcsl', width: 180, align: 'right', render: (text: any) => (myUtil.text.formatNum(text, '0,0.00000')) },
    { title: '单价', dataIndex: 'dj', width: 180, align: 'right', ellipsis: true, },
    { title: '金额', dataIndex: 'bcje', width: 180, align: 'right', render: (text: any) => (myUtil.text.formatNum(text, '0,0.00')) },
    { title: '备注', dataIndex: 'bz', width: 120, ellipsis: true },
  ];

  // 开启
  const showModal = (param: any) => {
    setDataYppFp([]);
    setMainParams(param);
    setModalVisible(true);
    setQueryBgdParam({
      searchModel: [
        { property: 'pduuid', value: param?.zdpdResult?.pduuid, op: 'zdy' },
        { property: 'tzsxbz', value: param?.zdpdResult?.tzsxbz, op: 'zdy' },
        { property: 'cdDm', value: param?.zdpdResult?.cdDm, op: 'zdy' },
        ...queryBgdParam.searchModel
      ]
    });
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
      closeModalVisible,
    };
  });

  // 关闭弹窗
  const closeModalVisible = () => {
    setCurrentlySelectedBgd({});
    setQueryBgdHeaderParam({});
    setQueryBgdParam({ searchModel: [] });
    setModalVisible(false)
  }

  // 已匹配发票列表刷新
  const yppFpReload = (record: any, param: any) => {
    const { zdpdResult } = param;
    const YppFpParams = {
      searchModel: [
        { property: 'pduuid', value: zdpdResult.pduuid, op: 'zdy' },
        { property: 'ckbgdh', value: record.ckbgdh, op: 'zdy' },
      ]
    }
    setMasker(true);
    pdjgYppFp(YppFpParams).then((response: any) => {
      const { body, msg } = response;
      setMasker(false);
      if (response.code == '200') {
        setDataYppFp(body);
      } else {
        message.error(msg);
      }
    })
  }

  // 左侧报关单列表单击事件
  const bgdRowClick = (record: any) => {
    fpForm.setFieldsValue({
      hwhyslwmc: record.hgspmc
    })
    setCurrentlySelectedBgd(record);
    // 获取报关单列表第一行数据参数加载右上已匹配列表
    yppFpReload(record, mainParams);
  }

  // 列头筛选触发
  const handleTableChange = (currentPagination: any, filters: any, sorter: any, extra: any) => {
    if (extra.action === 'filter') {
      const headerFilters = { hhcbbz: filters.hhcbbz };
      setQueryBgdHeaderParam(headerFilters);
    }
  };

  // 左侧报关单列表加载后触发
  const afterReloadGridData = (param: any) => {
    const { dataSource } = param
    if (dataSource.length > 0) {
      setCurrentlySelectedBgd(dataSource[0]);
      // 获取报关单列表第一行数据参数加载右上已匹配列表
      yppFpReload(dataSource[0], mainParams);
    } else {
      setDataYppFp([]);
    }
  };

  // 左侧报关单列表查询
  const confirmLeft = (filters?: any) => {
    let formVals: any = bgdForm.getFieldsValue();
    const headerFilters = filters || queryBgdHeaderParam;
    formVals = { ...formVals, ...headerFilters }
    const bgdSearchModel = dealBgdModel(formVals);
    setQueryBgdParam({
      searchModel: [
        { property: 'pduuid', value: mainParams?.zdpdResult?.pduuid, op: 'zdy' },
        ...bgdSearchModel
      ]
    });
  }

  // 左侧报关单列表查询参数整合
  const dealBgdModel = (model: any) => {
    const searchModel: any = [];
    for (let key in model) {
      if (model[key] && myUtil.array.isContiner(['ckrq1', 'ckbgdh', 'hgspmc', 'ggxh', 'pdbzArr', 'hhcbbzArr', 'ppbzArr'], key)) {
        if (key === 'ckrq1') {
          if (model[key].length > 0) {
            const start: any = moment(model[key][0]).format('YYYY-MM-DD');
            const end: any = moment(model[key][1]).format('YYYY-MM-DD');
            searchModel.push({ property: `${key}Q`, value: start, op: 'zdy' });
            searchModel.push({ property: `${key}Z`, value: end, op: 'zdy' });
          }
        } else {
          searchModel.push({ property: key, value: model[key], op: 'zdy' });
        }
      }
    }
    return searchModel;
  }

  // 生成明细
  const scmx = () => {
    // if (mainParams?.zdpdResult?.wppxfsts > 0) {
    //   DDAlert.open({
    //     title: '生成明细',
    //     info: '存在消费税票匹配失败的数据，需到进货明细进行补录，是否继续提交？',
    //     infoType: 'question',
    //     modalType: 'confirm',
    //     closeStatus: false,
    //     okCallbackFn: async function (thisObj: any) {
    //       DDAlert.close();
    //       modalScmxRef.current?.showModal({ refDDBaseGrid, ...mainParams });
    //     }
    //   });
    // } else {
      
    // }
    DDAlert.open({
      title: '生成明细',
      info: '确定对当前数据进行生成明细的操作吗？',
      infoType: 'question',
      modalType: 'confirm',
      closeStatus: false,
      okCallbackFn: async function (thisObj: any) {
        DDAlert.close();
        modalScmxRef.current?.showModal({ refDDBaseGrid, ...mainParams });
      }
    });

  }

  // 查看详情
  const viewDetails = () => {
    drawerSbyyxqRef.current?.showModal(queryBgdParam);
  }

  // 点击行高亮
  const getRowClassName = (record: any) => {
    if (currentlySelectedBgd.ckbgdh === record.ckbgdh) {
      return 'rgpdBgdRowClass';
    }
    return '';
  }

  return (
    <>
      <Modal
        title={`配单结果`}
        centered
        destroyOnHidden
        visible={modalVisible}
        width={CONSTANTS.C_MODAL_WIDTH_MAX}
        wrapClassName='standard-modal-1'
        zIndex={999}
        mask={{ closable: false }}
        footer={
          <>
            <Button onClick={closeModalVisible} icon={<CloseOutlined />} type="default">关闭</Button>
          </>
        }
        onCancel={closeModalVisible}
      >
        <Spin tip="Loading..." spinning={masker} delay={100} >
          <ProCard split="horizontal" className="fpmx_znpd_wrap">
            <ProCard className="dd_znpd_top_wrap" title={
              <Space>
                <span>{`本次匹配报关单 ${mainParams?.zdpdResult?.zts} 条，匹配成功 ${mainParams?.zdpdResult?.cgts} 条，匹配失败 ${mainParams?.zdpdResult?.sbts} 条!`}</span>
                <Button key={'ckxq'} onClick={viewDetails}>查看详情</Button>
              </Space>
            }>
            </ProCard>
            <ProCard split="vertical">
              {/* 左侧报关单信息列表 */}
              <ProCard colSpan="30%" split="horizontal">
                <ProCard className="dd-grid-wrap">
                  <div className="grid_header_info_wrap" style={{ lineHeight: 3, display: 'inline-block' }}>
                    <Space size={0} align="start">
                      <div className="grid_header_info" style={{ fontSize: 16, marginRight: 20, color: '#32363a' }}>{'报关单信息'}</div>
                    </Space>
                  </div>
                  <div className='grid_header_search_popconfirm'>
                    <Space>
                      <Button type="link" key={'scmx'} onClick={scmx}>生成明细</Button>
                      <Popconfirm
                        placement="bottomRight"
                        icon={false}
                        title={
                          <Form className="popconfirm_form" form={bgdForm} initialValues={{ ckrq1: [], ckbgdh: '', hgspmc: '', ggxh: '', ywbh: '' }} style={{ marginLeft: -18, marginRight: 5 }} >
                            <Form.Item name="ckbgdh">
                              <Input placeholder="报关单号" />
                            </Form.Item>
                            <Form.Item name="ckrq1" style={{ marginBottom: '16px' }}>
                              <DatePicker.RangePicker placeholder={['出口日期起', '出口日期止']} format={myUtil.date.formatList()} />
                            </Form.Item>
                            <Form.Item name="hgspmc">
                              <Input placeholder="海关商品名称" />
                            </Form.Item>
                            <Form.Item name="ggxh">
                              <Input placeholder="规格型号" />
                            </Form.Item>
                          </Form>
                        }
                        onConfirm={() => confirmLeft()}
                        okText="查询"
                        showCancel={false}
                      >
                        <Button icon={<SearchOutlined />} />
                      </Popconfirm>
                    </Space>
                  </div>
                  <DDBaseGrid
                    actionRef={refDDBaseGrid}
                    url={`/saas/tssb/bgdzxpd/pdjgBgdxx`}
                    getAssembleSearchModel={() => {
                      return queryBgdParam.searchModel;
                    }}
                    queryParam={queryBgdParam}
                    columns={columnsBgd}
                    rowKey='uuid'
                    onRow={(record: any) => {
                      return {
                        onClick: () => {
                          bgdRowClick(record);
                        },
                      };
                    }}
                    rowSelection={false}
                    afterOnChange={handleTableChange}
                    afterReloadGridData={afterReloadGridData}
                    rowClassName={getRowClassName}
                    scroll={{ y: 'calc(100vh - 332px)' }}
                  />
                </ProCard>
              </ProCard>
              <ProCard colSpan="70%" split="horizontal">
                {/* 右上已匹配发票列表 */}
                <ProCard className="dd-grid-wrap">
                  <div className="grid_header_info_wrap" style={{ lineHeight: 3, display: 'inline-block' }}>
                    <Space size={0} align="start">
                      <div className="grid_header_info" style={{ fontSize: 16, marginRight: 20, color: '#32363a' }}>{'已匹配发票'}</div>
                    </Space>
                  </div>
                  <DDBaseGrid
                    userDataSource={dataYppFp?.gridData?.rows || []}
                    columns={columnsYppFp}
                    rowKey='jgbuuid'
                    pagination={{
                      total: dataYppFp.length,
                      current: 1,
                      pageSize: 10,
                    }}
                    rowSelection={false}
                    
                  />
                </ProCard>
              </ProCard>
            </ProCard>
          </ProCard>
          <DrawerSbyyxq onRef={drawerSbyyxqRef} />
          <ModalScmx onRef={modalScmxRef} />
        </Spin>
      </Modal>
    </>
  )
};

export default BadzylModal;
