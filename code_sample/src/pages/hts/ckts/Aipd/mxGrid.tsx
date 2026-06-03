import React, { useEffect, useRef, Fragment, useState } from 'react';
import ProCard from '@ant-design/pro-card';
import { Spin, Button, Form, Input, Space, Tooltip, Table, message, Drawer } from 'antd';
import myUtil from '@/pages/common/myUtil';
import { queryPager, scmxMx } from '@/services/hts/api';
import pro from '@/pages/common/proConfig';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import './style.less';



export type ScsbsjProps = {
  ywKey?: any;
  disFlag?: any;
  downPagination:any;
  ssqpc?: any;
  setDownGrid: any;
  downGrid: any;
  formDown:any;
  pduuid:any;
  setLoading:any;
  loading:any;
  mxSx:any;
  setDownPagination:any;
  mxDc:any;
  selectMxRowKeys:any;
  selectMxRows:any;
  setSelectMxRowKeys:any;
  setSelectMxRows:any;
  bgdSx:any;
  fpSx:any;
  keyLeft:any;
  keyRight:any;
  setBgdxx:any;
  setZzsfpxx:any;
}

const Scsbsj: React.FC<ScsbsjProps> = ({
  bgdSx,
  keyLeft,
  fpSx,
  keyRight,
  mxSx,
  formDown,
  disFlag,
  ssqpc,
  mxDc,
  downPagination,
  downGrid,
  pduuid,
  setLoading,
  loading,
  setDownPagination,
  selectMxRowKeys,
  selectMxRows,
  setSelectMxRowKeys,
  setSelectMxRows,
  setBgdxx,
  setZzsfpxx,
}) => {

  const pagination = {
    current: 1,
    pageSize: 10,
    total: 0,
    size: 'default',
    showLessItems: true,
    hideOnSinglePage: false,
    showSizeChanger: true,
    showQuickJumper: false,
    pageSizeOptions: [5, 10, 50, 100],
    showTotal(total: any, range: any[]) {
      return `共${total}条，当前${range[0]}到${range[1]}条`;
    },
  };

  const [modalVisible, setModalVisible] = useState<any>(false);
  const [glh, setGlh] = useState<any>();

  // 初始化执行
  useEffect(() => {
    setGlh('');
  }, []);

  const handlerMock = (param: any) => {
    setGlh(param);
    setModalVisible(true);
  }

  const mxsjColumns: any = [
    { title: '换汇成本', dataIndex: 'hhcb', width: 80, fixed: 'left', align: 'center', },
    {
      title: '关联号', dataIndex: 'glh', width: 150, align: 'left', render: (text: any, record: any) => {
        return <Button type="link" onClick={() => handlerMock(text)}>{text}</Button>
      }
    },
    {
      title: '出口货物报关单号', dataIndex: 'ckbgdh', width: 150, align: 'left', ellipsis: { showTitle: true }, render: (text: any, record: any) => {
        return <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>
      }
    },
    {
      title: '出口商品品名', dataIndex: 'sbhgspmc', width: 150, align: 'left', ellipsis: { showTitle: true }, render: (text: any, record: any) => {
        return <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>
      }
    },
    {
      title: '美元离岸价', dataIndex: 'mylaj', width: 150, align: 'left', ellipsis: { showTitle: true }, render: (text: any, record: any) => {
        return <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>
      }
    },
    {
      title: '美元汇率', dataIndex: 'myhl', width: 150, align: 'left', ellipsis: { showTitle: true }, render: (text: any, record: any) => {
        return <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>
      }
    },
    {
      title: '人民币离岸价', dataIndex: 'rmblaj', width: 150, align: 'left', ellipsis: { showTitle: true }, render: (text: any, record: any) => {
        return <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>
      }
    },
    {
      title: '计税金额合计', dataIndex: 'jsje', width: 150, align: 'left', ellipsis: { showTitle: true }, render: (text: any, record: any) => {
        return <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>
      }
    },
  ];

  const rowBgdSelection = {
    selectedRowKeys: selectMxRowKeys,
    fixed: true,
    onSelect: (record: any, selected: any, selectedRows: any, nativeEvent: any) => {
      const tmpRowKeys = [...selectMxRowKeys];
      const tmpRows = [...selectMxRows];
      if (selected) {
        // 可用值替换原始值 确保以前的方法不需要调整
        tmpRowKeys.push(record.uuid);
        tmpRows.push(record);
      } else {
        const index1 = tmpRowKeys.findIndex((item: any) => record.uuid === item);
        tmpRowKeys.splice(index1, 1);
        const index2 = tmpRows.findIndex((item: any) => record.uuid === item.uuid);
        tmpRows.splice(index2, 1);
      }
      // 更改当前页选中
      setSelectMxRowKeys(tmpRowKeys);
      setSelectMxRows(tmpRows);

    },
    onSelectAll: (selected: any, selectedRows: any, changeRows: any) => {
      const tmpRowKeys = [...selectMxRowKeys];
      const tmpRows = [...selectMxRows];
      if (selected) {
        changeRows.forEach((item: any) => {
          tmpRowKeys.push(item.uuid);
          tmpRows.push(item);
        })
        // 更改当前页选中
        setSelectMxRowKeys(tmpRowKeys);
        setSelectMxRows(tmpRows);
        // 更改全局选中

      } else {
        const lsRows0: any = [];
        const lsRows1: any = [];
        const lsRows2: any = [];
        changeRows.forEach((item: any) => {
          lsRows0.push(item.uuid);
        });
        tmpRowKeys.forEach((item: any) => {
          if (!myUtil.array.isContiner(lsRows0, item)) {
            lsRows1.push(item);
          }
        });
        tmpRows.forEach((item: any) => {
          if (!myUtil.array.isContiner(lsRows0, item.uuid)) {
            lsRows2.push(item);
          }
        });
        // 更改当前页选中
        setSelectMxRowKeys(lsRows1);
        setSelectMxRows(lsRows2);
        // 更改全局选中

      }
    }
  }
  const del = () => {
    if (selectMxRowKeys?.length == 0) {
      message.info('请勾选数据进行删除！');
      return;
    }
    setLoading(true);
    scmxMx({ uuids: [...selectMxRowKeys] ,pduuid:pduuid}).then(async (res) => {
      const { code, body, msg } = res;
      setLoading(false);
      if (code == '200') {
        setSelectMxRowKeys([]);
        setSelectMxRows([]);
        setBgdxx(`合计 共0条数据 可用法定单位数量0 可用第二单位数量0  可用成交数量0`);
        setZzsfpxx(`合计 共0条数据 剩余发票数量0 剩余金额0.00`);
        message.success("删除成功！");
        await mxSx(downPagination,ssqpc,pduuid);
        await bgdSx(keyLeft,'1');
        await fpSx(keyRight,'1');
      } else {
        message.error(msg);
      }
    });
  }



  const handleOnChangeDown = (currentPagination: any, filters: any, sorter: any) => {
    setDownPagination(Object.assign(downPagination, currentPagination));
    mxSx(Object.assign(downPagination, currentPagination),ssqpc,pduuid);

  }

  const unitConfig: any = {};

  // 配置项
  unitConfig.unit_key = 'SAAS_TSSB_MTS_AIPD_JHMX_CX'; // 业务单元key，对应后端接口
  unitConfig.page_id = 'SAAS_TSSB_MTS_AIPD_JHMX_CX'; // 页面id
  unitConfig.grid_title = '外贸企业出口退税进货明细申报表'; // 列表标题，可选
  unitConfig.grid_selection_type = 'checkbox';
  unitConfig.grid_row_key = 'uuid';
  unitConfig.layout_type = 'modal';                                                     // 页面类型，默认default 可选 default modal tabs

  unitConfig.gridParams = {
    initSearchModal: [
      { type: 1, property: "glh", value: glh, op: "zdy" },
    ]
  };

  // 配置项：工具栏
  unitConfig.toolbar_default = {
    // ckts_download: true,              // 是否显示导出，默认关闭
    setting: true,                    // 是否显示设置按钮，默认关闭
    full: true,                       // 是否显示全屏按钮，默认关闭
    reload: false,                     // 是否显示刷新按钮，默认关闭
  };


  unitConfig.filter_items = [
  ];


  // 配置列表列
  unitConfig.grid_columns = [
    { title: '关联号', dataIndex: 'glh', width: 170, fixed: 'left', sorter: true },
    {
      title: '税种', dataIndex: 'sz', width: 90, codeTable: ['CODE_DM_TZ_SZ', '01'],
    },
    { title: '申报年月', dataIndex: 'ssq', width: 100, sorter: true, render: { type: 'date', format: 'yyyyMM' } },
    { title: '申报批次', dataIndex: 'sbpc', width: 100, sorter: true },
    { title: '序号', dataIndex: 'sbxh', width: 90, sorter: true },
    // { title: '发票号码', dataIndex: 'fphm', width: 120 },
    // { title: '发票代码', dataIndex: 'fpDm', width: 120, sorter: true },
    {
      title: '凭证种类', dataIndex: 'cktmspzlxDm', width: 140, ellipsis: true, codeTable: ['CODE_STATIC_TZ_CKTMSPZLX', '01'],
    },
    { title: '进货凭证号', dataIndex: 'jhpzh', width: 180 },
    { title: '供货方税号', dataIndex: 'ghfnsrsbh1', width: 160 },
    { title: '开票日期', dataIndex: 'kprq', width: 90, sorter: true, render: { type: 'date', format: 'YYYY-MM-DD' } },
    { title: '出口商品代码', dataIndex: 'ckspDm', width: 120, ellipsis: true },
    { title: '商品名称', dataIndex: 'sbhgspmc', width: 140, ellipsis: true },
    { title: '计量单位', dataIndex: 'hgjldwmc', width: 80, ellipsis: true },
    { title: '数量', dataIndex: 'sl', width: 180, align: 'right', sum: true, render: { type: 'number', format: '0,0.00000' } },
    { title: '计税金额', dataIndex: 'jsje', width: 180, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
    { title: '征税率', dataIndex: 'zssl', width: 80, align: 'right'},
    { title: '退税率', dataIndex: 'tsl', width: 80, align: 'right'},
    { title: '可退税额', dataIndex: 'tse', width: 180, align: 'right', sum: true, render: { type: 'number', format: '0,0.00' } },
    { title: '备注', dataIndex: 'bz', width: 120, ellipsis: true },
    // {
    //   title: '不予办理标志', dataIndex: 'byblbz', width: 140, align: 'left', render: { func: 'renderTzBz' },
    // },
    // {
    //   title: '不予退税标志', dataIndex: 'bytsbz', width: 140, align: 'left', render: { func: 'renderTzBz' },
    // },
    // {
    //   title: '暂不办理标志', dataIndex: 'zbblbz', width: 140, align: 'left', render: { func: 'renderTzBz' },
    // },
    // {
    //   title: '申报标志', dataIndex: 'sbbz1', width: 100, render: { func: 'renderTzSbbz' },
    // },
    // {
    //   title: '审核标志', dataIndex: 'shbz', width: 100, render: { func: 'renderTzShbz' },
    // },
  ];

  const Func: any = {
    unitRef: React.createRef(),
  };





  return (
    <div>
      <ProCard className="dd_znpd_top_wrap">
        <ProCard className="dd-grid-wrap">
          <div className="grid_header_info_wrap" style={{ lineHeight: 3 }}>
            <Space size={0} align="start">
              <div className="grid_header_info" style={{ fontSize: 16, marginRight: 36, color: '#32363a', fontWeight: 'bold' }}>{'明细数据'}</div>
            </Space>
            <Space size={0} align="start">
              <div className="grid_header_info" style={{ fontSize: 16, marginRight: 20, color: '#32363a' }}>{`所属期：${ssqpc?.ssq ? ssqpc?.ssq : ''}  批次：${ssqpc?.sbpc ? ssqpc?.sbpc : ''}`}</div>
            </Space>
            <Space size={0} align="start">
              <Form form={formDown} style={{ fontSize: 14, marginTop: 8 }} className='grid_filter_margin'>
                <Space>
                  <Form.Item name="glh" label="关联号">
                    <Input placeholder="请输入关联号" />
                  </Form.Item>
                  <Form.Item name="sbhgspmc" label="出口商品品名">
                    <Input placeholder="请输入出口商品品名" />
                  </Form.Item>
                </Space>
              </Form>
              <Button type='primary' style={{ fontSize: 14, margin: '9px 4px 0px 8px' }} disabled={disFlag} onClick={() => mxSx(pagination,ssqpc,pduuid)}>筛选</Button>
              <Button style={{ fontSize: 14, margin: '9px 4px 0px' }} disabled={disFlag} onClick={del}>删除</Button>
              <Button style={{ fontSize: 14, margin: '9px 4px 0px' }} disabled={disFlag} onClick={() => mxDc(ssqpc,pduuid)}>结果导出</Button>
            </Space>
          </div>
          <Table
            tableLayout='fixed'
            showSorterTooltip={false}
            bordered={true}
            columns={mxsjColumns}
            rowKey={'uuid'}
            rowSelection={{ ...rowBgdSelection, selectedRowKeys: selectMxRowKeys }}
            onChange={handleOnChangeDown}
            dataSource={downGrid}
            size="small"
            pagination={downPagination}
            loading={loading}
            scroll={{ x: `${document.documentElement.clientWidth - 645}px` }}
          />
        </ProCard>
      </ProCard>
      <Drawer
        title="明细数据查询"
        visible={modalVisible}
        onClose={() => { setModalVisible(false) }}
        width={pro.c_modal_width_x4}
        destroyOnClose={true}
        className="dd_data_page_modal"
        maskClosable={false}
      >
        <DDBunit2 config={unitConfig} func={Func} />
      </Drawer>
    </div>
  );
};

export default Scsbsj;
