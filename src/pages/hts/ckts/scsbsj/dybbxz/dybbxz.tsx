// 报表打印下载
import React, { useState, useImperativeHandle, Fragment } from 'react';
import DDBaseGrid from '@/components/DDBaseGrid';
import { Modal, message, Button, Divider, Spin } from 'antd';
import { CloseOutlined, FilePdfOutlined, FileExcelOutlined } from '@ant-design/icons';
import cktsUtil from '@/pages/hts/cktsUtil';
import CONSTANTS from '@/components/DDAssist/constants';

export type ReportGridProps = {
  visible?: any;
  onRef?: any;
  ywKey?: any;
}

const ReportGrid: React.FC<ReportGridProps> = ({
  visible = false,
  onRef,
  ywKey,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);

  const [data, setData] = useState<any>([]);
  const [selectRecord, setSelectRecord] = useState<any>({});
  const [, setSelectionRowKeys] = useState<any>([]);
  const [selectionRows, setSelectionRows] = useState<any>([]);
  const [masker, setMasker] = useState(false);

  // 开启
  const showModal = (record: any, rows: any) => {
    setData(rows);
    setSelectRecord(record);
    setModalVisible(true);
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
          <Button type='link' onClick={() => downloadExcel(record)}>EXCEL下载</Button>
          <Divider type='vertical' />
          <Button onClick={() => downloadPdf(record)} type='link'>PDF下载</Button>
          <Divider type='vertical' />
          <Button onClick={() => previewReport(record)} type='link'>预览</Button>
        </Fragment>
      )
    }
  ];

  // 获取下载预览参数
  const getParam = (record?: any) => {
    const params: any = record || {};
    params.ywKey = ywKey;
    // 是否有申报批次
    if (cktsUtil.moduleType(ywKey, 'SBPC') && selectRecord.sbpc?.trim()) { // 是否有申报批次
      params.sbpc = selectRecord.sbpc;
    }
    // 是否有所属期
    if (selectRecord.ssq?.trim()) {
      params.ssq = selectRecord?.ssq?.trim();
    }
    // tbrq1
    if (selectRecord.tbrq1?.trim()) {
      params.tbrq1 = selectRecord?.tbrq1?.trim();
    }
    // isJgbbz
    if (selectRecord.isJgbbz?.trim()) {
      params.isJgbbz = selectRecord?.isJgbbz?.trim();
    }
    return params;
  }

  // 预览
  const previewReport = (record: any) => {
    const params = getParam(record);
    if (cktsUtil.moduleType(ywKey, 'ZIP')) {
      params.ywKey = params.nr; // ?
    }
    let url: any;
    if(ywKey.startsWith('ZMKJ')){
       url = `/hx/ty/report/pdfExportListGet/EXCEL_REPORT_${params.ywKey}/`;
       params.plyl = 'Y';
    } else {
       url = `/hx/ty/report/pdfExportGet/EXCEL_REPORT_${params.ywKey}/`;
    }

    cktsUtil.popupPdfFile(url, params);
  };

  // EXCEL下载
  const downloadExcel = async (record: any) => {
    const params = getParam(record);
    if (cktsUtil.moduleType(ywKey, 'ZIP')) {
      params.ywKey = params.nr; // ?
    }
    let url = `/hx/ty/report/excelExportGet/EXCEL_REPORT_${params.ywKey}/`;
    if (params.ywKey === 'MDT_TSSB') {
      url = '/hx/ty/report/excelZipExportGet/EXCEL_REPORT_MDT/';
      params.downloadItems = 'EXCEL_REPORT_MDT_TSSB,EXCEL_REPORT_MDT_CKHWBZ';
    }
    // 工具类下载
    setMasker(true);
    await cktsUtil.downloadFileCkts(url, params);
    setMasker(false);
  };

  // PDF下载
  const downloadPdf = async (record: any) => {
    const params = getParam(record);
    if (cktsUtil.moduleType(ywKey, 'ZIP')) {
      params.ywKey = params.nr; // ?
    }
    let url = `/hx/ty/report/pdfExportGet/EXCEL_REPORT_${params.ywKey}/`;
    if (params.ywKey === 'MDT_TSSB') {
      url = '/hx/ty/report/pdfZipExportGet/EXCEL_REPORT_MDT/';
      params.downloadItems = 'EXCEL_REPORT_MDT_TSSB,EXCEL_REPORT_MDT_CKHWBZ';
    }
    // 工具类下载
    setMasker(true);
    await cktsUtil.downloadFileCkts(url, params);
    setMasker(false);
  };

  // 获取下载数据
  const getSelectData = () => {
    if (!selectionRows || selectionRows.length === 0) {
      message.info('请选择要操作的数据！');
      return false;
    }
    const params: any = getParam();
    // 如果全选状态，downloadItems传递空值
    if (data.length === selectionRows.length) {
      params.downloadItems = '';
    } else {
      const downloadItemsArr = [];
      let downloadItems = '';
      for (let i = 0; i < selectionRows.length; i += 1) {
        downloadItemsArr.push('EXCEL_REPORT_' + selectionRows[i].nr);
      }
      downloadItems = downloadItemsArr.join(',');
      params.downloadItems = downloadItems;
    }
    return params;
  }

  // 批量EXCEL下载
  const batchDownloadExcel = async () => {
    const params = getSelectData();
    if (!params) {
      return;
    }
    if (!params.downloadItems.indexOf('EXCEL_REPORT_MDT_TSSB')) {
      params.downloadItems += ',EXCEL_REPORT_MDT_CKHWBZ';
    }
    const url = `/hx/ty/report/excelZipExportGet/EXCEL_REPORT_${ywKey}/`;
    // 工具类下载
    setMasker(true);
    await cktsUtil.downloadFileCkts(url, params);
    setMasker(false);
  };

  // 批量PDF下载
  const batchDownloadPdf = async () => {
    const params = getSelectData();
    if (!params) {
      return;
    }
    if (!params.downloadItems.indexOf('EXCEL_REPORT_MDT_TSSB')) {
      params.downloadItems += ',EXCEL_REPORT_MDT_CKHWBZ';
    }
    const url = `/hx/ty/report/pdfZipExportGet/EXCEL_REPORT_${ywKey}/`;
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

  return (
    <Modal
      title="打印报表下载"
      centered
      destroyOnHidden
      open={modalVisible}
      wrapClassName='standard-modal-1'
      width={CONSTANTS.C_MODAL_WIDTH_X3}
      okText="生成"
      cancelText="关闭"
      onCancel={() => setModalVisible(false)}
      mask={{ closable: false }}
      footer={(
        <Fragment>
          {cktsUtil.moduleType(ywKey, 'ZIP') && (
            <Fragment>
              <Button onClick={batchDownloadExcel} icon={<FileExcelOutlined />} type="primary">批量EXCEL下载</Button>
              <Button onClick={batchDownloadPdf} icon={<FilePdfOutlined />} type="primary">批量PDF下载</Button>
            </Fragment>
          )}
          <Button onClick={() => setModalVisible(false)} icon={<CloseOutlined />} type="default">关闭</Button>
        </Fragment>
      )}
    >
      <Spin tip="Loading..." spinning={masker} delay={100}>
        <DDBaseGrid
          userDataSource={data}
          columns={myColumns}
          showSerialNumber
          rowKey='nr'
          pagination={false}
          rowSelection={{
            type: 'checkbox',
            ...rowSelection,
          }}
        />
      </Spin>
    </Modal>
  );
};
export default ReportGrid;
