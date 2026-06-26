// 通用业务功能
import { intl as intl2 } from '@/components/DDAssist/util';
import { message, Modal } from 'antd';
import cktsUtil from '@/pages/hts/cktsUtil';
import { xj } from '@/pages/hts/services/htsApi';
import moment from 'moment';
import UnitUtil from '@/components/DDBunit/unit_util';
import DDAlert from '@/pages/hts/commonModule/DDAlert';

const Func: any = {};

// 原在线申报系统模块：小计
Func.cktsCommonSum = (param: any) => {
  const { refCktsSum, unit_key, unit_lcswsx_dm, gridData, gridParams, setMasker } = param;
  if (gridData.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_no_data_common_sum' }));
    return;
  }
  setMasker(true);
  const paramTmp = {
    lcswsxDm: unit_lcswsx_dm,
    ywCxBz: 'XJ_' + unit_key,
    adQuery: gridParams?.searchModel,
  }
  xj(paramTmp).then((response) => {
    const { code, body } = response;
    setMasker(false);
    if (code === '200') {
      refCktsSum.current!.showModal({
        gridData: body.rows
      });
    } else {
      message.info('获取数据失败');
    }
  })
};

// 原在线申报系统模块：序号重排
Func.cktsCommonOrder = (param: any) => {
  const { refCktsOrder, unit_key, unit_lcswsx_dm, gridData = [], type, unitRef, order_key } = param;
  let ssq: any = gridData[0]?.ssq || '';
  let sbpc: any = gridData[0]?.sbpc || '';
  const params = {
    lcswsxDm: unit_lcswsx_dm,
    ywCxBz: order_key ? order_key : 'XHCP_' + unit_key,
    type,
    unitRef,
    ssq,
    sbpc,
  }
  refCktsOrder.current!.showModal(params);
};

// 原在线申报系统模块：导出
Func.cktsCommonExport = (param: any) => {
  const { unit_key, unit_lcswsx_dm, gridParams, setMasker, gridData = [], searchModel3, export_key, orderModel, flag } = param;
  if (gridData.length === 0) {
    message.info('当前筛选条件下无数据，请确认！');
    return;
  }
  let modalTitle = '将导出当前筛选条件下的所有数据，是否确认';
  DDAlert.open({
    info: modalTitle,
    infoType: 'warning',
    modalType: 'confirm',
    okText: '确定',
    closeStatus: false,
    isFormContent: false,
    okCallbackFn: async function (thisObj: any) {
      let url: any;
      let tmp: any;
      let searchModel: any = [];
      gridParams.searchModel.forEach((item: any, index: number) => {
        searchModel.push(item);
      });
      gridParams.initSearchModal.forEach((item: any, index: number) => {
        searchModel.push(item);
      });
      let adQuery:any = searchModel || [];

      if (flag === 'sjbb'
      || export_key === 'EXCEL_REPORT_SJGLSAAS_HGSJCX_CKBGD'
      || export_key === 'EXCEL_REPORT_SJGLSAAS_HGSJCX_JKBGD'
      || export_key === 'EXCEL_REPORT_CKFPKJSAAS_BGDGL'
      || export_key === 'EXCEL_REPORT_PZGL_KAK_RZ_PRINT_REPORT'
      ) {
        searchModel3.forEach((item: any, index: number) => {
          adQuery.push(item);
        });
        url = `/hx/ty/report/excelPostReport/${export_key}/`;
        tmp = {
          key: export_key,
          relx: 'xls',
          iszip: 'N',
          searchModel: adQuery,
          orderModel: orderModel,
        }
        thisObj.setState({ masker: true });
        await cktsUtil.downloadFilePost(url, tmp);
        thisObj.setState({ masker: false });
        DDAlert.close();
        return;
      }
      // get导出
      if (unit_key === 'EXCEL_REPORT_WBSJ_CKBGD' // 出口报关单管理
        || unit_key === 'EXCEL_REPORT_WBSJ_DZDZFP' // 增值税专用发票管理
        || unit_key === 'WBSJ_SJGLSAAS_STFYKJDLCKHWZM_DC' // 代理货物证明管理 => 受托方已开具代理出口证明查询
        || unit_key === 'MTS_ZXSB_SB_MTS_TSSB_G' // 外贸企业出口退税出口明细 EXCEL_REPORT_MTS_TSSB_TSSBSJ
      ) {
        tmp = UnitUtil.config.exportGetParamSwitch({ searchModel, unit_key });
        url = `/hx/ty/report/excelExportGet/${unit_key}/`;
        if(unit_key === 'MTS_ZXSB_SB_MTS_TSSB_G') {
          url = `/hx/ty/report/excelExportGet/EXCEL_REPORT_MTS_TSSB_TSSBSJ/`;
        }
      } else { // 出口退税在线申报通用导出
        if (unit_lcswsx_dm) {
          adQuery.push({ 'property': 'lcswsxDm', 'value': unit_lcswsx_dm, 'op': 'al' });
        }
        tmp = {
          page: 1,
          pageSize: 10,
          searchModel: {},
          adQuery: JSON.stringify(adQuery),
        }
        url = `/hx/ty/report/excelReportGet/${unit_key}/`;
      }
      thisObj.setState({ masker: true });
      console.log(2)
      await cktsUtil.downloadFileCkts(url, tmp);
      thisObj.setState({ masker: false });
      DDAlert.close();
    },
  });
};

export default Func;