import React, { useEffect, useState, useRef, useCallback } from 'react';
import ProCard from '@ant-design/pro-card';
import { Button, Form, Input, Space, Modal, Table, DatePicker, InputNumber, Tooltip, Dropdown } from 'antd';
import myUtil from '@/components/DDAssist/util';
import CONSTANTS from '@/components/DDAssist/constants';
import locale from 'antd/es/date-picker/locale/zh_CN';
import { DownOutlined, SettingOutlined } from '@ant-design/icons';
import DDGridViewSetting from '@/components/DDGridViewSetting';
import { cloneDeep } from 'lodash';
import './style.less';



export type ScsbsjProps = {
  leftsx?: any;
  pduuid:any;
  bgdForm?: any;
  leftPagination: any;
  setLeftPagination: any;
  setLeftsx?: any;
  keyLeft: any;
  bgdSx: any;
  selectBgdRowKeys: any;
  selectBgdRows: any;
  setSelectBgdRowKeys: any;
  setSelectBgdRows: any;
  dataLeft: any;
  bgdxx: any;
  setBgdxx: any;
  leftSearchForm:any;
  dcBgd:any;
}

const Scsbsj: React.FC<ScsbsjProps> = ({
  leftsx,
  bgdxx,
  bgdForm,
  leftPagination,
  setLeftPagination,
  setLeftsx,
  keyLeft,
  bgdSx,
  selectBgdRowKeys,
  selectBgdRows,
  setSelectBgdRowKeys,
  setSelectBgdRows,
  dataLeft,
  setBgdxx,
  leftSearchForm,
  dcBgd,
  pduuid,
}) => {
  // 表单布局
  const layoutLeftModal = {
    labelCol: { span: 8 },
    wrapperCol: { span: 12 },
  };

  // 左侧报关单
  const bgdColumns: any = [
    { title: '出口货物报关单号', dataIndex: 'ckbgdh', width: 180, fixed: 'left', align: 'left', },
    { title: '出口日期', dataIndex: 'ckrq1', width: 120, align: 'left' },
    {
      title: '出口合同号', dataIndex: 'ckhth', width: 120, align: 'left', ellipsis: { showTitle: true }, render: (text: any, record: any) => {
        return <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>
      }
    },
    {
      title: '出口发票号', dataIndex: 'ckfph', width: 120, align: 'left', ellipsis: { showTitle: true }, render: (text: any, record: any) => {
        return <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>
      }
    },
    {
      title: '海关商品代码', dataIndex: 'hgckspDm', width: 120, align: 'left', ellipsis: { showTitle: true }, render: (text: any, record: any) => {
        return <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>
      }
    },
    {
      title: '海关商品名称', dataIndex: 'hgspmc', width: 180, align: 'left', ellipsis: { showTitle: true }, render: (text: any, record: any) => {
        return <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>
      }
    },
    {
      title: '出口商品代码', dataIndex: 'ckspDm', width: 120, align: 'left', ellipsis: { showTitle: true }, render: (text: any, record: any) => {
        return <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>
      }
    },
    {
      title: '出口商品名称', dataIndex: 'ckspmc', width: 180, align: 'left', ellipsis: { showTitle: true }, render: (text: any, record: any) => {
        return <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>
      }
    },
    {
      title: '规范化商品名称', dataIndex: 'gfhhgspmc', width: 180, align: 'left', ellipsis: { showTitle: true }, render: (text: any, record: any) => {
        return <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>
      }
    },
    {
      title: '监管方式', dataIndex: 'jgfsmc', width: 150, align: 'left', ellipsis: { showTitle: true }, render: (text: any) => {
        return <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>
      }
    },
    {
      title: '法定单位', dataIndex: 'hgjldwmc', width: 150, align: 'left', ellipsis: { showTitle: true }, render: (text: any) => {
        return <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>
      }
    },
    {
      title: '可用法定单位数量', dataIndex: 'kyCksl', width: 150, align: 'right', ellipsis: { showTitle: true }, render: (text: any) => {
        return <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>
      }
    },
    {
      title: '第二单位', dataIndex: 'dejldwmc', width: 150, align: 'left', ellipsis: { showTitle: true }, render: (text: any) => {
        return <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>
      }
    },
    {
      title: '可用第二单位数量', dataIndex: 'kyDecksl', width: 150, align: 'left', ellipsis: { showTitle: true }, render: (text: any) => {
        return <><Tooltip placement="topLeft" title={text}>{text}</Tooltip></>
      }
    },
    {
      title: '成交方式', dataIndex: 'hgcjfsmc', width: 150, align: 'left', ellipsis: { showTitle: true }, render: (text: any) => {
        return <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>
      }
    },
    {
      title: '成交币制', dataIndex: 'hbmc', width: 150, align: 'left', ellipsis: { showTitle: true }, render: (text: any) => {
        return <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>
      }
    },
    {
      title: '可用成交金额', dataIndex: 'kycjzj', width: 150, align: 'right', ellipsis: { showTitle: true }, render: (text: any) => {
        return <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>
      }
    },
    {
      title: '成交单位', dataIndex: 'sbjldwmc', width: 150, align: 'left', ellipsis: { showTitle: true }, render: (text: any) => {
        return <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>
      }
    },
    {
      title: '可用成交数量', dataIndex: 'kycjsl', width: 150, align: 'right', ellipsis: { showTitle: true }, render: (text: any) => {
        return <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>
      }
    },
    {
      title: '可用美元离岸价', dataIndex: 'kymylaj', width: 150, align: 'right', ellipsis: { showTitle: true }, render: (text: any) => {
        return <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>
      }
    },
    {
      title: '备注', dataIndex: 'bz', width: 150, align: 'left', ellipsis: { showTitle: true }, render: (text: any) => {
        return <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>
      }
    },
    {
      title: '匹配失败原因', dataIndex: 'cwxx', width: 150, align: 'left', ellipsis: { showTitle: true }, render: (text: any) => {
        return <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>
      }
    },
  ];


  // 左侧更多modal
  const [leftgdModal, setLeftgdModal] = useState<any>(false);

  const [leftCommt, setLeftCommt] = useState<any>(bgdColumns);
  // 视图设置相关配置
  const refLeftViewSetting: any = useRef();

  // 视图设置后更新（左）
  const updateGridViewTmpLeft = (params: any) => {
    const { column } = params;
    const tmpColViews = cloneDeep([...column?.all]);
    setLeftCommt(tmpColViews);
  }

  const updateGridViewLeft: any = useCallback(updateGridViewTmpLeft, []);

  // 初始化执行
  useEffect(() => {
    // const viewConfig = refLeftViewSetting?.current?.getViewConfigScheme();
    // setLeftCommt(viewConfig?.column || bgdColumns);
  }, []);


  const leftGd = () => {
    setLeftgdModal(true);
  }

  // 左侧更多保存
  const leftgdsave = async () => {
    const form = await leftSearchForm.validateFields();
    const querys = [];
    if (form.bgdCkbgdh) {
      const ckbgdh = form.bgdCkbgdh.replaceAll(" ", ",");
      querys.push({ "property": "bgdCkbgdh", "values": ckbgdh.split(","), "op": "zdy" });
    }
    if (form.bgdCkspdm) {
      querys.push({ "property": "bgdCkspdm", "value": form.bgdCkspdm, "op": "zdy" });
    }
    if (form.bgdGgxh) {
      querys.push({ "property": "bgdGgxh", "value": form.bgdGgxh, "op": "zdy" });
    }
    if (form.bgdHth) {
      querys.push({ "property": "bgdHth", "value": form.bgdHth, "op": "zdy" });
    }
    if (form.bgdDjQ) {
      querys.push({ "property": "bgdDjQ", "value": form.bgdDjQ, "op": "zdy" });
    }
    if (form.bgdDjZ) {
      querys.push({ "property": "bgdDjZ", "value": form.bgdDjZ, "op": "zdy" });
    }
    setLeftsx(querys);
    setLeftgdModal(false);
  }


  // 左侧报关单
  const rowBgdSelection = {
    selectedRowKeys: selectBgdRowKeys,
    fixed: true,
    onSelect: (record: any, selected: any, selectedRows: any, nativeEvent: any) => {
      const tmpRowKeys = [...selectBgdRowKeys];
      const tmpRows = [...selectBgdRows];
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
      setSelectBgdRowKeys(tmpRowKeys);
      setSelectBgdRows(tmpRows);
    },
    onSelectAll: (selected: any, selectedRows: any, changeRows: any) => {
      const tmpRowKeys = [...selectBgdRowKeys];
      const tmpRows = [...selectBgdRows];
      if (selected) {
        changeRows.forEach((item: any) => {
          tmpRowKeys.push(item.uuid);
          tmpRows.push(item);
        })
        // 更改当前页选中
        setSelectBgdRowKeys(tmpRowKeys);
        setSelectBgdRows(tmpRows);
        // 更改全局选中
        // changeBgdKeys(tmpRowKeys);
        // changeBgdRows(tmpRows);
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
        setSelectBgdRowKeys(lsRows1);
        setSelectBgdRows(lsRows2);
      }
    }
  }

  // 列表设置
  const gridSettingLeft = () => {
    refLeftViewSetting.current!.showModal();
  };


  const handleOnChangeLeft = (currentPagination: any, filters: any, sorter: any) => {
    setLeftPagination(Object.assign(leftPagination, currentPagination));
    bgdSx(keyLeft,'2');

  }

  const getFooter=()=>{
    return bgdxx;
  }


  return (
    <div>
      <ProCard className="dd-grid-wrap">
        <div style={{ lineHeight: 3 }}>
          <Space size={0} align="start">
            <div className="grid_header_info" style={{ fontSize: 16, marginRight: 20, color: '#32363a', fontWeight: 'bold' }}>{'出口报关单'}</div>
          </Space>
          <Space size={0} align="start" >
            <Form form={bgdForm} style={{ fontSize: 14, marginTop: 8, }} className='grid_filter_margin'>
              <Form.Item name="ckrq" >
                <DatePicker.RangePicker locale={locale} format={myUtil.date.formatList()} style={{ width: 240 }} />
              </Form.Item>
            </Form>
            <Button type="link" style={{ fontSize: 14, margin: '9px 4px 0px' }} onClick={leftGd}>更多<DownOutlined /></Button>
            {
                pduuid?.length > 10 ?
                <Dropdown menu={{ items: [
        { key: 'szwytz1', label: <a onClick={() => bgdSx('SAAS_TSSB_MTS_AIPD_CKBGD_CX','1')}>原始数据</a> },
        { key: 'szwwtz2', label: <a onClick={() => bgdSx('SAAS_TSSB_MTS_AIPD_CKBGD_PDJG_CX','1')}>配单结果</a> },
      ] }}   >
                  <Button type="primary" style={{ fontSize: 14, margin: '9px 4px 0px' }}>筛选<DownOutlined /></Button>
                </Dropdown>: <Button type='primary' style={{ fontSize: 14, margin: '9px 4px 0px' }} onClick={() => bgdSx('SAAS_TSSB_MTS_AIPD_CKBGD_CX','1')}>筛选</Button>
              }
            <Button style={{ fontSize: 14, margin: '9px 4px 0px' }} onClick={() => dcBgd(keyLeft)} >导出</Button>
            <DDGridViewSetting
              onRef={refLeftViewSetting}
              updateGridView={updateGridViewLeft}
              settingDataColumn={leftCommt}
              originalColumn={bgdColumns}
              cacheId={'aipdbgd'}
            />
          </Space>
        </div>
        {/* <div className="grid_header_search_popconfirm">
          <Button style={{ marginLeft: "10px" }} onClick={gridSettingLeft} icon={<SettingOutlined />} />
        </div> */}
        <Table
          className='grid_content_height'
          tableLayout='fixed'
          showSorterTooltip={false}
          bordered={true}
          // columns={refLeftViewSetting?.current?.getColumns(leftCommt)}
          columns={leftCommt}
          rowKey={'uuid'}
          rowSelection={{ ...rowBgdSelection, selectedRowKeys: selectBgdRowKeys }}
          onChange={handleOnChangeLeft}
          pagination={leftPagination}
          dataSource={dataLeft}
          size="small"
          footer={getFooter}
          scroll={{ x: `${document.documentElement.clientWidth - 645}px` }}
        />
      </ProCard>
      <Modal
        title="筛选项"
        centered
        destroyOnHidden
        visible={leftgdModal}
        width={CONSTANTS.C_MODAL_WIDTH_X2}
        onCancel={() => setLeftgdModal(false)}
        footer={(<>
          <Button onClick={leftgdsave} >确定</Button>
        </>)}
      >
        <Form  {...layoutLeftModal} form={leftSearchForm}>
          <Form.Item name="bgdCkbgdh" label="报关单号" tooltip="批量查询，多条以空格或英文逗号隔开，支持Excel例粘贴查询。">
            <Input style={{ width: 288 }} />
          </Form.Item>
          <Form.Item name="bgdCkspdm" label="商品代码">
            <Input style={{ width: 288 }} />
          </Form.Item>
          <Form.Item name="bgdGgxh" label="规格型号">
            <Input style={{ width: 288 }} />
          </Form.Item>
          <Form.Item name="bgdHth" label="合同号">
            <Input style={{ width: 288 }} />
          </Form.Item>
          <Space style={{ marginLeft: 150 }}>
            <Form.Item name="bgdDjQ" label="单价" >
              <InputNumber />
            </Form.Item>
            <div style={{ marginBottom: 20,marginLeft: -20 }}>~</div>
            <Form.Item name="bgdDjZ" style={{ width: 240 }}>
              <InputNumber />
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </div>
  );
};

export default Scsbsj;
