import React from 'react';
import { message, Modal } from 'antd';
import cktsUtil from '@/pages/hts/cktsUtil';

const Func: any = {
  unitRef: React.createRef(),
};

// 配置项：疑点管理导出
Func.exportYd = (param: any) => {
  const { unitRef, otherRef } = param;
  if (otherRef && otherRef[0]) {
    console.info('配置项：疑点管理导出')
    console.info(otherRef[0])
  }
  const gridData = unitRef.current?.getGridData();
  if (!gridData || gridData.length === 0) {
    message.info('不存在可打印数据，请确认后操作！');
    return;
  }
  let sjzjuuid = otherRef[0]?.sjzjuuid?.trim() || '';
  let ywkey = otherRef[0]?.ywKey || '';
  const isIgnore = otherRef[0]?.isIgnore;
  Modal.confirm({
    title: '确认导出数据？',
    onOk() {
      const params = {
        sjzjuuid,
        ywkey,
        ktgydbz: isIgnore,
        sys: 'cp'
      };
      let url = '/hx/ty/report/excelExportGet';
      if (ywkey === 'MDT') {
        url += '/EXCEL_REPORT_GGFW_MDT_YDDC/';
      } else if (ywkey === 'MTS') {
        url += '/EXCEL_REPORT_GGFW_MTS_YDDC/';
      } else if (ywkey.substring(0, 5) === 'ZMKJ_') {
        url += '/EXCEL_REPORT_GGFW_ZMKJ_YDDC/';
      } else if (ywkey === 'DBTS') {
        url += '/EXCEL_REPORT_GGFW_DBTS_YDDC/';
      } else if (ywkey.substring(0, 5) === 'ZBYW_') {
        url += '/EXCEL_REPORT_GGFW_ZBYW_YDDC/';
      } else if (ywkey.substring(0, 5) === 'JLJG_') {
        url += '/EXCEL_REPORT_GGFW_JLJG_YDDC/';
      } else if (ywkey === 'QTYW_HWCHS') {
        url += '/EXCEL_REPORT_GGFW_QTYW_HWCHS_YDDC/';
      }
      cktsUtil.downloadFileCkts(url, params);
    }
  });
}

export default Func;