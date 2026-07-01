/**
 * title: 报表打印下载
 */
import React, { useState, useImperativeHandle, Fragment } from 'react';
import DDBaseGrid from '@/components/DDBaseGrid';
import { Modal, message, Button, Divider, Spin } from 'antd';
import { CloseOutlined, FilePdfOutlined, FileExcelOutlined } from '@ant-design/icons';
import CONSTANTS from '@/components/DDAssist/constants';
import { jljghxBbdyCommon } from '@/pages/hts/services/htsApi';
import myUtil from '@/components/DDAssist/util';
import PdfViewer from './pdfViewer';
import cktsUtil from '@/pages/hts/cktsUtil';

export type ReportGridProps = {
  visible?: any;
  onRef?: any;
}
const refPdfViewer: any = React.createRef();
const ReportGrid: React.FC<ReportGridProps> = ({
  visible = false,
  onRef,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [selectRecord, setSelectRecord] = useState<any>({}); //主页传递参数
  const [data, setData] = useState<any>([]); // 列表加载数据


  const [masker, setMasker] = useState<boolean>(false);
  const [selectedRowKeys, setSelectionRowKeys] = useState<any>([]);
  const [flag, setFlag] = useState("");

  const [selectionRows, setSelectionRows] = useState<any>([]);
  // const intl = useIntl();

  // 开启
  const showModal = (params: any, rows: any, flag:any) => {
    setSelectRecord(params);
    setData(rows);
    setModalVisible(true);
    setFlag(flag);
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  // 配置列表列 操作列
  const myColumns = [
    { title: '业务表单名称', dataIndex: 'bm' },
    { title: '数据条数', dataIndex: 'ts', width: 80, align: 'right' },
    {
      title: '操作', width: 230, fixed: 'right', align: 'center', render: (record: any) => (
        <Fragment>
          <Button type='link' onClick={() => downloadExcel(record)} disabled={record.mxts === 0?true:false}>EXCEL下载</Button>
          <Divider type='vertical' />
          <Button onClick={() => downloadPdf(record)} type='link' disabled={record.mxts === 0?true:false}>PDF下载</Button>
          <Divider type='vertical' />
          <Button onClick={() => previewReport(record)} type='link' disabled={record.mxts ===0?true:false}>预览</Button>
        </Fragment>
      )
    }
  ];

  const getDtKeys = (record: any) => {
    const params = {...record};
    params.ywKey = record.nr;
    return params;
  }

  // EXCEL下载
  const downloadExcel = async (record: any) => {
    const params: any = getDtKeys(record);
    params.ssq = selectRecord.ssq;
    params.sbpc = selectRecord.sbpc;
    params.relx='xls';
    params.iszip= 'N';
    params.baseXH='1';
    params.isJgbbz='Y';
    setMasker(true);
    if(flag == "1"){
      const url = '/hx/ty/report/excelExportGet/EXCEL_REPORT_JLJG_MDTHX_MDTHX/';
      await cktsUtil.downloadFileCkts(url, params);
      setMasker(false);
    }
    if(flag == "2"){
      const url = '/hx/ty/report/excelExportGet/EXCEL_REPORT_JLJG_MDTHX_MDTHX/';
      params.cxtjdybz ='Y';
      await cktsUtil.downloadFileCkts(url, params);
      setMasker(false);
    }
    if(flag == "3"){
      const url = '/hx/ty/report/excelExportGet/EXCEL_REPORT_JLJG_MDTHX_HGSJTZ/';
      await cktsUtil.downloadFileCkts(url, params);
      setMasker(false);
    }
    if(flag == "4"){
      const url = '/hx/ty/report/excelExportGet/EXCEL_REPORT_JLJG_MDTHX_HGSJTZ/';
      params.cxtjdybz ='Y';
      await cktsUtil.downloadFileCkts(url, params);
      setMasker(false);
    }
  };

  // PDF下载
  const downloadPdf = async (record: any) => {
    const params: any = getDtKeys(record);
    params.ssq = selectRecord.ssq;
    params.sbpc = selectRecord.sbpc;
    params.isJgbbz='Y';
    setMasker(true);
    if(flag == "1"){
      const url = '/hx/ty/report/pdfExportGet/EXCEL_REPORT_JLJG_MDTHX_MDTHX/';
      await cktsUtil.downloadFileCkts(url, params);
      setMasker(false);
    }
    if(flag == "2"){
      const url = '/hx/ty/report/pdfExportGet/EXCEL_REPORT_JLJG_MDTHX_MDTHX/';
      params.cxtjdybz ='Y';
      await cktsUtil.downloadFileCkts(url, params);
      setMasker(false);
    }
    if(flag == "3"){
      const url = '/hx/ty/report/pdfExportGet/EXCEL_REPORT_JLJG_MDTHX_HGSJTZ/';
      await cktsUtil.downloadFileCkts(url, params);
      setMasker(false);
    }
    if(flag == "4"){
      const url = '/hx/ty/report/pdfExportGet/EXCEL_REPORT_JLJG_MDTHX_HGSJTZ/';
      params.cxtjdybz ='Y';
      await cktsUtil.downloadFileCkts(url, params);
      setMasker(false);
    }
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

  // 预览
  const previewReport = (record: any) => {
    const params: any = getDtKeys(record);
    params.ssq = selectRecord.ssq;
    params.sbpc = selectRecord.sbpc;
    params.isJgbbz='Y';
    setMasker(true);
    if(flag == "1"){
      const url = '/hx/ty/report/pdfExportGet/EXCEL_REPORT_JLJG_MDTHX_MDTHX/';
      cktsUtil.popupPdfFile(url, params);
      setMasker(false);
    }
    if(flag == "2"){
      const url = '/hx/ty/report/pdfExportGet/EXCEL_REPORT_JLJG_MDTHX_MDTHX/';
      params.cxtjdybz ='Y';
      cktsUtil.popupPdfFile(url, params);
      setMasker(false);
    }
    if(flag == "3"){
      const url = '/hx/ty/report/pdfExportGet/EXCEL_REPORT_JLJG_MDTHX_HGSJTZ/';
      cktsUtil.popupPdfFile(url, params);
      setMasker(false);
    }
    if(flag == "4"){
      const url = '/hx/ty/report/pdfExportGet/EXCEL_REPORT_JLJG_MDTHX_HGSJTZ/';
      params.cxtjdybz ='Y';
      cktsUtil.popupPdfFile(url, params);
      setMasker(false);
    }
  };

  // 获取下载数据
  const getSelectData = () => {
    let dcData: any = [];
    if (!selectionRows || selectionRows.length === 0) {
      dcData = data;
    } else {
      dcData = selectionRows;
    }
    const keys: any = [];
    dcData.forEach((item: any) => {
      const tmpKeys = getDtKeys(item).ywKey;
      // tmpKeys.forEach((item1: any) => {
        keys.push(tmpKeys);
      // })
    })
    const params: any = {
      keys: keys,
      ssq: selectRecord.ssq,
      sbpc:selectRecord.sbpc,
      iszip: 'Y'
    }
    return params;
  }

  // 批量EXCEL下载
  const batchDownloadExcel = () => {
    const params = getSelectData();
    if (!params) {
      return;
    }
    params.relx = 'xls';
    setMasker(true);
    jljghxBbdyCommon(params).then((response) => {
      setMasker(false);
      const { code, desc } = response;
      if (code === '200') {
        const { blob, fileName } = response.body;
        myUtil.file.downloadZip(blob, fileName);
      } else {
         message.error(desc);
      }
    });
  };

  // 批量PDF下载
  const batchDownloadPdf = () => {
    const params = getSelectData();
    if (!params) {
      return;
    }
      params.relx = 'pdf';
      setMasker(true);
      jljghxBbdyCommon(params).then((response) => {
        setMasker(false);
        const { code, desc } = response;
        if (code === '200') {
          const { blob, fileName } = response.body;
          myUtil.file.downloadZip(blob, fileName);
        } else {
          message.error(desc);
        }
      });
  };

  // 列选择
  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any[]) => {
      setSelectionRowKeys(selectedRowKeys);
      setSelectionRows(selectedRows);
    },
  };

  return (
    <Modal
      title="报表打印"
      destroyOnHidden
      open={modalVisible}
      wrapClassName='standard-modal-1'
      width={CONSTANTS.C_MODAL_WIDTH_X3}
      okText="生成"
      cancelText="关闭"
      onCancel={() => setModalVisible(false)}
      footer={(
        <Fragment>
          {/* <Button onClick={batchDownloadExcel} icon={<FileExcelOutlined />} type="primary">批量EXCEL下载</Button>
          <Button onClick={batchDownloadPdf} icon={<FilePdfOutlined />} type="primary">批量PDF下载</Button> */}
          <Button onClick={() => setModalVisible(false)} icon={<CloseOutlined />} type="default">关闭</Button>
        </Fragment>
      )}
      className={`${masker ? 'dd_modal_show_masker' : ''}`}
      mask={{ closable: false }}
    >
      <Spin tip="Loading..." spinning={masker} delay={100}>
      <DDBaseGrid
        userDataSource={data}
        columns={myColumns}
        showSerialNumber
        rowKey='ywbd'
        pagination={false}
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
        }}
      />
      </Spin>
      <PdfViewer onRef={refPdfViewer}/>
    </Modal>
  );
};
export default ReportGrid;
