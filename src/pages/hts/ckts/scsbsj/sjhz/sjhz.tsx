// 汇总表
import React, { useState, useImperativeHandle } from 'react';
import { message, Modal } from 'antd';
import myUtil from '@/components/DDAssist/util';
import './style.less';
import cktsUtil from '@/pages/hts/cktsUtil';
import CONSTANTS from '@/components/DDAssist/constants';

export type SummaryFormProps = {
  visible?: any;
  onRef?: any;
}

const SummaryForm: React.FC<SummaryFormProps> = ({
  visible = false,
  onRef,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [summaryData, setSummaryData] = useState<any>({});
  const [selectRecord, setSelectRecord] = useState<any>({});

  // 开启
  const showModal = (record: any, data: any) => {
    setSummaryData(data);
    setSelectRecord(record);
    setModalVisible(true);
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  // 导出
  const handleSummaryExport = () => {
    const url = '/hx/ty/report/excelExportGet/EXCEL_REPORT_MTS_HZB/';
    cktsUtil.downloadFileCkts(url, selectRecord);
  };

  return (
    <Modal
      title="生成汇总"
      centered
      destroyOnHidden
      open={modalVisible}
      wrapClassName='standard-modal-1'
      width={CONSTANTS.C_MODAL_WIDTH_X3}
      okText="导出"
      cancelText="关闭"
      onCancel={() => setModalVisible(false)}
      onOk={handleSummaryExport}
    >
      <div className="print-form-warp">
        <div className="print-form">
          <div className="section">
            <h1>外贸企业出口退税申报汇总统计</h1>
            <p className="text-left" style={{position: 'relative'}}>
              <div className="section-label">申报年月：{summaryData.ssq}</div>
              <div className="section-label" style={{marginLeft: '100px'}}>申报批次：{summaryData.sbpc}</div>
              <div className="section-label" style={{float: 'right'}}> 金额单位：元至角分</div>
            </p>
          </div>
          <table className="print-table">
            <tr className="sjhz-tr1">
              <td className="label text-left noborder-r">出口退税出口明细申报表</td>
              <td className="label text-right noborder-l noborder-r">{summaryData.ckmxsbbjlts1}</td>
              <td className="label text-left noborder-l noborder-r">条</td>
              <td className="label noborder-l" colSpan={3}>&nbsp;</td>
            </tr>
            <tr>
              <td className="label noborder-r label-1 text-left">出口货物报关单</td>
              <td className="label noborder-l noborder-r text-right" width="90px">{summaryData.ckhwbgdzs}</td>
              <td className="label noborder-l noborder-r text-left" width="45px">张，</td>
              <td className="label noborder-l noborder-r text-left" width="230px">出口额</td>
              <td className="label noborder-l noborder-r text-right" width="90px">{myUtil.grid.formatNum(summaryData.ckemy, '0,0.00')}</td>
              <td className="label noborder-l text-right" width="45px">美元</td>
            </tr>
            <tr>
              <td className="label noborder-r label-1 text-left">代理出口货物证明</td>
              <td className="label noborder-l noborder-r text-right">{summaryData.dlckhwzmzs}</td>
              <td className="label noborder-l noborder-r text-left">张，</td>
              <td className="label noborder-l noborder-r text-left">收汇额</td>
              <td className="label noborder-l noborder-r text-right">{myUtil.grid.formatNum(summaryData.ckshjemy, '0,0.00')}</td>
              <td className="label noborder-l text-right">美元</td>
            </tr>
            <tr>
              <td className="label" colSpan={6}>&nbsp;</td>
            </tr>
            <tr className="sjhz-tr1">
              <td className="label noborder-r text-left">出口退税进货明细申报表</td>
              <td className="label noborder-l noborder-r text-right noborder-l noborder-r">{summaryData.jhmxsbbjlts}</td>
              <td className="label noborder-l noborder-r text-left noborder-l noborder-r">条</td>
              <td className="label noborder-l" colSpan={3}>&nbsp;</td>
            </tr>
            <tr>
              <td className="label noborder-r label-1 text-left">增值税专用发票</td>
              <td className="label noborder-l noborder-r text-right">{summaryData.zzszyfpzs}</td>
              <td className="label noborder-l noborder-r text-left">张，</td>
              <td className="label noborder-l noborder-r text-left">出口货物消费税专用缴款书</td>
              <td className="label noborder-l noborder-r text-right">{summaryData.ckhwxfszyjkszs}</td>
              <td className="label noborder-l text-right">张</td>
            </tr>
            <tr>
              <td className="label noborder-r label-1 text-left">海关进口增值税专用缴款书</td>
              <td className="label noborder-l noborder-r text-right">{summaryData.hgjkzzszyjkszs}</td>
              <td className="label noborder-l noborder-r text-left">张，</td>
              <td className="label noborder-l noborder-r text-left">海关进口消费税专用缴款书</td>
              <td className="label noborder-l noborder-r text-right">{summaryData.hgjkxfszyjkszs}</td>
              <td className="label noborder-l text-right">张</td>
            </tr>
            <tr>
              <td className="label noborder-r label-1 text-left">税收专用缴款书</td>
              <td className="label noborder-l noborder-r text-right">{summaryData.zzssszyjkszs}</td>
              <td className="label noborder-l noborder-r text-left">张，</td>
              <td className="label noborder-l noborder-r text-left">出口货物消费税专用缴款书分割单</td>
              <td className="label noborder-l noborder-r text-right">{summaryData.ckhwxfszyjksfgdzs}</td>
              <td className="label noborder-l text-right">张</td>
            </tr>
            <tr>
              <td className="label noborder-r label-1 text-left">总进货金额</td>
              <td className="label noborder-l noborder-r text-right">{myUtil.grid.formatNum(summaryData.zjhje, '0,0.00')}</td>
              <td className="label noborder-l noborder-r text-left">元</td>
              <td className="label noborder-l" colSpan={3}>&nbsp;</td>
            </tr>
            <tr>
              <td className="label" colSpan={6}>&nbsp;</td>
            </tr>
            <tr className="sjhz-tr1">
              <td className="label noborder-r text-left">本月申报退税额</td>
              <td className="label noborder-l noborder-r text-right">{myUtil.grid.formatNum(summaryData.bysbtse, '0,0.00')}</td>
              <td className="label noborder-l noborder-r text-left">元</td>
              <td className="label noborder-l noborder-r" colSpan={3}>&nbsp;</td>
            </tr>
            <tr>
              <td className="label noborder-r label-1 text-left">其中：出口货物增值税</td>
              <td className="label noborder-l noborder-r text-right">{myUtil.grid.formatNum(summaryData.bysbzzstse, '0,0.00')}</td>
              <td className="label noborder-l noborder-r text-left">元，</td>
              <td className="label noborder-l noborder-r text-left">消费税</td>
              <td className="label noborder-l noborder-r text-right">{myUtil.grid.formatNum(summaryData.bysbxfstse, '0,0.00')}</td>
              <td className="label noborder-l text-right">元</td>
            </tr>
            <tr>
              <td className="label noborder-r label-1 text-left">应税服务增值税</td>
              <td className="label noborder-l noborder-r text-right">{myUtil.grid.formatNum(summaryData.ckysfwyzzstse, '0,0.00')}</td>
              <td className="label noborder-l noborder-r text-left">元</td>
              <td className="label noborder-l noborder-r" colSpan={3}>&nbsp;</td>
            </tr>
          </table>
        </div>
      </div>
    </Modal>
  );
};
export default SummaryForm;
