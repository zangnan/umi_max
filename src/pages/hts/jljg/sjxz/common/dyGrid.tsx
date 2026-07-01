/**
 * title: 报表打印下载
 */
import React, { useState, useImperativeHandle, Fragment } from 'react';
import { Modal, message, Button, Divider, Spin, Table } from 'antd';
import { CloseOutlined, FilePdfOutlined } from '@ant-design/icons';
import CONSTANTS from '@/components/DDAssist/constants';
import myUtil from '@/components/DDAssist/util';
import { useIntl } from 'umi';
import DyViewer from './dyViewer';
import { querySjxzDy, jljghxBbdyCommon, jljghxSjxzPdfPlxz } from '@/pages/hts/services/htsApi';
import type {PaginationProps }  from '@/components/DDBaseGrid/data.d';
import cktsUtil from '@/pages/hts/cktsUtil';
import { intl as intl2 } from '@/components/DDAssist/util';

export type ReportGridProps = {
  visible?: any;
  onRef?: any;
  dyType?: any;
  pagination?: any;
}
const refDyViewer: any = React.createRef();
const ReportGrid: React.FC<ReportGridProps> = ({
  visible = false,
  onRef,
  dyType,
  pagination = {
    current: 1,
    pageSize: 10,
    total: 0,
    size: 'default',
    hideOnSinglePage: false,
    showSizeChanger: true,
    showQuickJumper: false,
    pageSizeOptions: [10, 20, 50, 100],
    showTotal(total: any, range: any[]) {
      return `共${total}条，当前${range[0]}到${range[1]}条`;
    },
  }
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [myType, ] = useState<any>(dyType);
  const [zycs, setZycs] = useState<any>({});
  const [selectionRowKeys, setSelectionRowKeys] = useState<any>([]);
  const [selectionRows, setSelectionRows] = useState<any>([]);
  const [masker, setMasker] = useState<boolean>(false);
  const intl = useIntl();
  const [myPagination, setPagination] = useState<PaginationProps>();
  const [dataSource, setDataSource] = useState([]);
  const [param, setParam] = useState<any>();




  // 开启
  const showModal = (params: any,param :any) => {
    setZycs(params);
    setModalVisible(true);
    setParam(param);
    const searchParam = {
      page: 1,//myPagination.current
      pageSize: 10,
      ...params,
    };
    setGridData(searchParam);
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  // 设置: 表格数据
  const setGridData = (param?: any) => {
    let gridTotalNum: number = 0;
    const { pageSize, page, searchModel, key} = param;
    const data: any = {
      pageSize,
      page,
      searchModel,
      key
    };
    setMasker(true);
    querySjxzDy(data).then((response) => {
      setMasker(false);
      setDataSource(response?.body?.rows || []);
      gridTotalNum = response?.body?.rowCount || 0 ;
      setPagination(Object.assign(pagination, {
        total: gridTotalNum,
        pageSize,
        current: page,
      }));
    })
  };

  // 设置: 分页
  const handleOnChange = (currentPagination: any, filters: any, sorter: any) => {
    if (pagination) {
      setPagination(Object.assign(pagination, currentPagination));
      setGridData({
        page: currentPagination.current,
        pageSize: currentPagination.pageSize,
        key: zycs.key,
        searchModel: zycs.searchModel
      });
    }
  }


  // 配置列表列 操作列
  const myColumns = myType==='qdbh'? [
    { title: '核注清单编号', dataIndex: 'qdbh' },
    { title: '申报日期', dataIndex: 'sbrq1', width: 100, render: (text: any) => { return myUtil.grid.formatDate(text, 'YYYY-MM-DD')} },
    {
      title: '操作', width: 230, fixed: 'right', align: 'center', render: (record: any) => (
        <Fragment>
          <Button onClick={() => downloadPdf(record)} type='link' >下载</Button>
          <Divider type='vertical' />
          <Button onClick={() => previewReport(record)} type='link' >预览</Button>
        </Fragment>
      )
    }
  ] : [
    { title: '报关单号', dataIndex: myType==='bgdhgbh'?'bgdhgbh': 'ckbgdh' },
    { title: '出口日期', dataIndex: 'ckrq1', width: 100, render: (text: any) => { return myUtil.grid.formatDate(text, 'YYYY-MM-DD')} },
    {
      title: '操作', width: 230, fixed: 'right', align: 'center', render: (record: any) => (
        <Fragment>
          <Button onClick={() => downloadPdf(record)} type='link' >下载</Button>
          <Divider type='vertical' />
          <Button onClick={() => previewReport(record)} type='link' >预览</Button>
        </Fragment>
      )
    }
  ];

  // 预览
  const previewReport = (record: any) => {
    let url ='';
    const params: any = {
      relx: 'pdf',
      iszip: 'N'
    }
    if (myType === 'qdbh') {
      params.qdbh = record.qdbh;
      url = '/hx/ty/report/pdfExportGet/EXCEL_REPORT_JLJG_BSHZQD/';
    } else if (myType === 'bgdhgbh') {
      params.bgdhgbh = record.bgdhgbh;
      url = '/hx/ty/report/pdfExportGet/EXCEL_REPORT_JLJG_HXBGD/';
    } else {
    }
    setMasker(true);
    cktsUtil.popupPdfFile(url, params);
    setMasker(false);
    // jljghxBbdyCommon(params).then((response) => {
    //   setMasker(false);
    //   const {code, desc} = response;
    //   if (code === '200') {
    //     const { blob ,fileName} = response.body;
    //     const bstr = atob(blob);
    //     let n = bstr.length;
    //     const u8arr = new Uint8Array(n);
    //     while (n--) {
    //       u8arr[n] = bstr.charCodeAt(n);
    //     }
    //     const fileURL = URL.createObjectURL(new Blob([u8arr], { type: 'application/pdf' }));
    //     //refDyViewer.current?.showModal(`/pdfjs/web/viewer.html?file=${  fileURL  }&name=${fileName}`, fileName);
    //     refDyViewer.current?.showModal(cktsUtil.getPdfLj()+`?file=${  fileURL  }&name=${fileName}`, fileName);

    //   } else {
    //     message.error(desc);
    //   }
    // });
  };

  // PDF下载
  const downloadPdf = async (record: any) => {
    const params: any = {
      relx: 'pdf',
      iszip: 'N'
    }
    let url ='';
    if (myType === 'qdbh') {
      params.qdbh = record.qdbh;
      url = '/hx/ty/report/pdfExportGet/EXCEL_REPORT_JLJG_BSHZQD/';
    } else if (myType === 'bgdhgbh') {
      params.bgdhgbh = record.bgdhgbh;
      url = '/hx/ty/report/pdfExportGet/EXCEL_REPORT_JLJG_HXBGD/';
    } else {
    }
    setMasker(true);
    await cktsUtil.downloadFileCkts(url, params);
    setMasker(false);
    // jljghxBbdyCommon(params).then((response) => {
    //   setMasker(false);
    //   const { code, desc } = response;
    //   if (code === '200') {
    //     const { blob, fileName } = response.body;
    //     myUtil.file.downloadPdf(blob, fileName);
    //   } else {
    //     message.error(desc);
    //   }
    // });
  };

  // 获取下载数据
  const getSelectData = () => {
    const params: any = {
      iszip: 'Y'
    }
    if (myType === 'qdbh') {
      params.key = 'ZXSB_WBSJ_DY_SZCHZQDMX_PRINT_REPORT_ALL';
    } else if (myType === 'bgdhgbh') {
      params.key = 'ZXSB_WBSJ_DY_BGD_PRINT_REPORT_ALL';
    } else {
    }
    delete params.searchModel;
    if (selectionRows && selectionRows.length > 0) {
      const values: any = [];
      selectionRows.forEach((item: any) => {
        values.push(item[myType]);
      });
      params.searchModel = [{property: myType, values, op: 'ain'}];
    }
    return params;
  }

  // 批量PDF下载
  const batchDownloadPdf = async () => {
    // 选择数据条数判断
    if (!selectionRowKeys || selectionRowKeys.length === 0) {
      message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
      return;
    }
    let url = '/hx/ty/report/pdfZipExportGet/EXCEL_REPORT_JLJGSAAS_BSHZQD/';
    let params: any = {};
    if (myType === 'qdbh') {
      params.primaryKey = 'qdbh';
      params.primaryKeyList = selectionRowKeys.join(',');
      params.downloadItems = "EXCEL_REPORT_JLJG_BSHZQD";
      url = '/hx/ty/report/pdfZipExportGet/EXCEL_REPORT_JLJGSAAS_BSHZQD/';
    } else if (myType === 'bgdhgbh') {
      params.primaryKey = 'bgdhgbh';
      params.primaryKeyList = selectionRowKeys.join(',');
      params.downloadItems = "EXCEL_REPORT_JLJG_HXBGD";
      url = '/hx/ty/report/pdfZipExportGet/EXCEL_REPORT_JLJGSAAS_HXBGD/';
    } else {
    }
    // 工具类下载
    setMasker(true);
    await cktsUtil.downloadFileCkts(url, params);
    setMasker(false);
  };

  // 列选择
  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any[]) => {
      setSelectionRowKeys(selectedRowKeys);
      setSelectionRows(selectedRows);
    },
  };
  // 关闭
  const closeModal = () => {
    setModalVisible(false);
    param?.unitRef?.current?.reload2();
  };
  
  return (
    <Modal
      title="打印列表"
      destroyOnHidden
      open={modalVisible}
      wrapClassName='standard-modal-1'
      width={CONSTANTS.C_MODAL_WIDTH_X3}
      okText="生成"
      cancelText="关闭"
      onCancel={() => closeModal()}
      footer={(
        <Fragment>
          <Button onClick={batchDownloadPdf} icon={<FilePdfOutlined />} type="primary">批量PDF下载</Button>
          <Button onClick={() => setModalVisible(false)} icon={<CloseOutlined />} type="default">关闭</Button>
        </Fragment>
      )}
      className={`${masker ? 'dd_modal_show_masker' : ''}`}
      mask={{ closable: false }}
    >
      <Spin tip="Loading..." spinning={masker} delay={100}>
        <Table
          tableLayout='fixed'
          showSorterTooltip={false}
          columns={myColumns}
          rowKey={myType}
          rowSelection={{
            type: 'checkbox',
            ...rowSelection,
          }}
          dataSource={dataSource}
          pagination={myPagination}
          onChange={handleOnChange}
        />
      </Spin>
      <DyViewer onRef={refDyViewer}/>
    </Modal>
  );
};
export default ReportGrid;
