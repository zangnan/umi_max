/**
 * 查询统计: 打印报表下载
 */
import React, { useState, useImperativeHandle, Fragment } from 'react';
import DDBaseGrid from '@/components/DDBaseGrid';
import { Modal, Button, Divider, Spin } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import pro from '@/pages/common/proConfig';
import cktsUtil from '@/pages/common/cktsUtil';

export type ReportGridProps = {
  visible?: any;
  onRef?: any;
}
const ReportGrid: React.FC<ReportGridProps> = ({
  visible = false,
  onRef,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [selectRecord, setSelectRecord] = useState<any>({}); //主页传递参数
  const [data, setData] = useState<any>([]); // 列表加载数据
  const [masker, setMasker] = useState<boolean>(false);

  // 开启
  const showModal = (params: any, rows: any) => {
    setSelectRecord(params);
    setData(rows);
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
          <Button type='link' onClick={() => downloadExcel(record)} disabled={record.mxts === 0?true:false}>EXCEL下载</Button>
          <Divider type='vertical' />
          <Button onClick={() => downloadPdf(record)} type='link' disabled={record.mxts === 0?true:false}>PDF下载</Button>
          <Divider type='vertical' />
          <Button onClick={() => previewReport(record)} type='link' disabled={record.mxts ===0?true:false}>预览</Button>
        </Fragment>
      )
    }
  ];
  // ywKey转换为行nr
  const getDtKeys = (record: any) => {
    const params = {...record};
    // params.ywKey = record.nr;
    return params;
  }

  // EXCEL下载
  const downloadExcel = async (record: any) => {
    const tep: any = getDtKeys(record);
    const params = Object.assign(selectRecord, tep);
    setMasker(true);
    const url = `/hx/ty/report/excelExportGet/EXCEL_REPORT_${selectRecord.ywKey}/`;
    await cktsUtil.downloadFileCkts(url, params);
    setMasker(false);
  };

  // PDF下载
  const downloadPdf = async (record: any) => {
    const tep: any = getDtKeys(record);
    const params = Object.assign(selectRecord, tep);
    setMasker(true);
    const url = `/hx/ty/report/pdfExportGet/EXCEL_REPORT_${selectRecord.ywKey}/`;
    await cktsUtil.downloadFileCkts(url, params);
    setMasker(false);
  };

  // 预览
  const previewReport = (record: any) => {
    const tep: any = getDtKeys(record);
    const params = Object.assign(selectRecord, tep);
    setMasker(true);
    let url: any;
    let ywKey = params.ywKey;
    if(ywKey.startsWith('ZMKJ')){
       url = `/hx/ty/report/pdfExportListGet/EXCEL_REPORT_${params.ywKey}/`;
       params.plyl = 'Y';
    } else {
       url = `/hx/ty/report/pdfExportGet/EXCEL_REPORT_${selectRecord.ywKey}/`;
    }

    cktsUtil.popupPdfFile(url, params);
    setMasker(false);
  };

  return (
    <Modal
      title="报表打印"
      destroyOnClose
      visible={modalVisible}
      wrapClassName='standard-modal-1'
      width={pro.c_modal_width_x3}
      okText="生成"
      cancelText="关闭"
      onCancel={() => setModalVisible(false)}
      footer={(
        <Fragment>
          <Button onClick={() => setModalVisible(false)} icon={<CloseOutlined />} type="default">关闭</Button>
        </Fragment>
      )}
      className={`${masker ? 'dd_modal_show_masker' : ''}`}
      maskClosable={false}
    >
      <Spin tip="Loading..." spinning={masker} delay={100}>
      <DDBaseGrid
        userDataSource={data}
        columns={myColumns}
        showSerialNumber
        rowKey='ywbd'
        pagination={false}
      />
      </Spin>
    </Modal>
  );
};
export default ReportGrid;
