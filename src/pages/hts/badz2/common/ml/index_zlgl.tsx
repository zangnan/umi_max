/**
 * title: 备案单证目录
 */
import React, { useState, useEffect } from 'react';
import { Form, message, Tooltip } from 'antd';
import { queryZzbaTjsj, queryBadzMlSjtj, querySjppQtdzMxfs } from '@/pages/hts/services/htsApi';
import '../../style.less';
import myUtil from '@/components/DDAssist/util';

export type DyViewerProps = {
  record: any
}

const DyViewer: React.FC<DyViewerProps> = ({
  record
}) => {
  const [formData, setFormData] = useState<any>({});
  
  const [ckqygxhtfs, setCkqygxhtfs] = useState<any>(0); // 出口企业购销合同份数
  const [ckhwysdj, setCkhwysdj] = useState<any>(0); // 出口货物运输单据
  const [ckqywtqtdwbgdj, setCkqywtqtdwbgdj] = useState<any>(0); // 出口企业委托其他单位报关的单据
  
  const userInfo = myUtil.sessionStore.getItem('userInfo');

  const [dzmlForm] = Form.useForm();
  const [tooltipContentForm,setTooltipContentForm] = useState<any>({});

  useEffect(() => {
    if (record) {
      if (record.zzbaBz === 'Y' || record.bafs === '1') {
        queryZzbaTjsj({ baqkUuid: record.uuid }).then((response) => {
          const { body, code, desc } = response;
          if (code === '200') {
            setFormData(body);
            dzmlForm.setFieldsValue(body);
            titleChange(body);
          } else {
            message.error(desc);
          }
        })
      } else {
        queryBadzMlSjtj({ baqkUuid: record.uuid }).then((response) => {
          const { body, code, desc } = response;
          if (code === '200') {
            setFormData(body);
            dzmlForm.setFieldsValue(body);
            titleChange(body);
          } else {
            message.error(desc);
          }
        })
        // 走调用其他单证类型悬浮的方法
        querySjppQtdzMxfs({ uuid: record.uuid }).then((response) => {
          const { body, code, desc } = response;
          if (code === '200') {
           // qtdzmxChange(body);
            setTooltipContentForm(body);
          } else {
            message.error(desc);
          }
        })
      }
    }
  }, [record]);

  // 目录标题合计计算
  const titleChange = (body: any) => {
    const formValue = body;
    setCkqygxhtfs((formValue.ckxshtfs || 0) + (formValue.wmGhhtfs || 0) + (formValue.scGhhtfs || 0) + (formValue.wmzhfwhtfs || 0));
    setCkhwysdj((formValue.tydHytdfs || 0) + (formValue.tydHkydfs || 0) + (formValue.tydTlydfs || 0) + (formValue.tydGlyszhqdfs || 0) + (formValue.tydYzysdfs || 0) + (formValue.ysfpCfyffs || 0) + (formValue.ysfpCfgjhwysdlfwffs || 0));
    setCkqywtqtdwbgdj((formValue.wtbgxyfs || 0) + (formValue.dlbgfwffpfs || 0));
  }
  const tooltipContent = (
    <div>
      {tooltipContentForm.ccgwbgd?.xybz == 'Y' && (
        <p>出口货物报关单: {tooltipContentForm.ccgwbgd?.dzfs}份</p>
      )}
      {tooltipContentForm.dlccgwzm?.xybz == 'Y' && (
        <p>代理出口货物证明: {tooltipContentForm.dlccgwzm?.dzfs}份</p>
      )}
      {tooltipContentForm.wzhfxgtss?.xybz == 'Y' && (
        <p>无纸化放行通知书: {tooltipContentForm.wzhfxgtss?.dzfs}份</p>
      )}
      {tooltipContentForm.zxd?.xybz == 'Y'&& (
        <p>装箱单: {tooltipContentForm.zxd?.dzfs}份</p>
      )}
      {tooltipContentForm.bshzqd?.xybz == 'Y' && (
        <p>保税核注清单: {tooltipContentForm.bshzqd?.dzfs}份</p>
      )}
      {tooltipContentForm.ccfp?.xybz == 'Y' && (
        <p>出口发票: {tooltipContentForm.ccfp?.dzfs}份</p>
      )}
      {tooltipContentForm.invoicefp?.xybz == 'Y' && (
        <p>INVOICE发票: {tooltipContentForm.invoicefp?.dzfs}份</p>
      )}
      {tooltipContentForm.jxfp?.xybz == 'Y' && (
        <p>进项发票: {tooltipContentForm.jxfp?.dzfs}份</p>
      )}
      {tooltipContentForm.dbtxzyp?.xybz == 'Y' && (
        <p>代办退税专用发票: {tooltipContentForm.dbtxzyp?.dzfs}份</p>
      )}
      {tooltipContentForm.shpz?.xybz == 'Y' && (
        <p>收汇凭证: {tooltipContentForm.shpz?.dzfs}份</p>
      )}
      {tooltipContentForm.zhqdc?.xybz == 'Y' && (
        <p>载货清单（舱单）: {tooltipContentForm.zhqdc?.dzfs}份</p>
      )}
      {tooltipContentForm.hwpksd?.xybz == 'Y' && (
        <p>货物付款水单: {tooltipContentForm.hwpksd?.dzfs}份</p>
      )}
      {tooltipContentForm.fywpksd?.xybz == 'Y' && (
        <p>费用付款水单: {tooltipContentForm.fywpksd?.dzfs}份</p>
      )}
      {tooltipContentForm.ljbajd?.xybz == 'Y' && (
        <p>离境备案清单: {tooltipContentForm.ljbajd?.dzfs}份</p>
      )}
      {tooltipContentForm.qtdz?.xybz == 'Y' && (
        <p>其他单证: {tooltipContentForm.qtdz?.dzfs}份</p>
      )}
    </div>
  );

  return (
    <>
      <div className='badz_ml'>
        <div className="ml_bawcqk">
          <span className='ml_zdccsm'>{formData.zzbaBz === 'Y' || formData.bawcbz === 'Y' ? '已装订' : '未装订'}</span><br />
        </div>
        <div className='ml_title'>出口退（免）税备案单证目录</div>
        <Form form={dzmlForm} name={'mts-znpd-form'} initialValues={{}}>
          {/* 1. 出口企业购销合同份数 */}
          <div className='ml_number'>
            <span>1. 出口企业购销合同份数：</span>
            <span className='content_span'>{ckqygxhtfs}</span>
            <span>份，其中</span>
          </div>
          <div className='ml_number_zj'>
            <span>出口销售合同：</span>
            <span className='content_span'>{formData.ckxshtfs || 0}</span>
            <span>份</span>
          </div>
          <div className='ml_number_zj'>
            <span>外贸企业购货合同：</span>
            <span className='content_span'>{formData.wmGhhtfs || 0}</span>
            <span>份</span>
          </div>
          <div className='ml_number_zj'>
            <span>生产企业收购非自产货物出口的购货合同：</span>
            <span className='content_span'>{formData.scGhhtfs || 0}</span>
            <span>份</span>
          </div>
          <div className='ml_number_zj'>
            <span>外贸综合服务合同：</span>
            <span className='content_span'>{formData.wmzhfwhtfs || 0}</span>
            <span>份</span>
          </div>
          {/* 2. 出口货物运输单据 */}
          <div className='ml_number'>
            <span>2. 出口货物运输单据：</span>
            <span className='content_span'>{ckhwysdj}</span>
            <span>份，其中</span>
          </div>
          <div className='ml_number_zj'>
            <span>海运提单：</span>
            <span className='content_span'>{formData.tydHytdfs || 0}</span>
            <span>份</span>
          </div>
          <div className='ml_number_zj'>
            <span>航空运单：</span>
            <span className='content_span'>{formData.tydHkydfs || 0}</span>
            <span>份</span>
          </div>
          <div className='ml_number_zj'>
            <span>铁路运单：</span>
            <span className='content_span'>{formData.tydTlydfs || 0}</span>
            <span>份</span>
          </div>
          <div className='ml_number_zj'>
            <span>公路运输载货清单：</span>
            <span className='content_span'>{formData.tydGlyszhqdfs || 0}</span>
            <span>份</span>
          </div>
          <div className='ml_number_zj'>
            <span>邮政运输单：</span>
            <span className='content_span'>{formData.tydYzysdfs || 0}</span>
            <span>份</span>
          </div>
          <div className='ml_number_zj'>
            <span>出口企业承付运费的国内运输发票：</span>
            <span className='content_span'>{formData.ysfpCfyffs || 0}</span>
            <span>份</span>
          </div>
          <div className='ml_number_zj'>
            <span>出口企业承付国际货物运输代理服务费发票：</span>
            <span className='content_span'>{formData.ysfpCfgjhwysdlfwffs || 0}</span>
            <span>份</span>
          </div>
          {/* 3. 出口企业委托其他单位报关的单据 */}
          <div className='ml_number'>
            <span>3. 出口企业委托其他单位报关的单据：</span>
            <span className='content_span'>{ckqywtqtdwbgdj}</span>
            <span>份，其中</span>
          </div>
          <div className='ml_number_zj'>
            <span>委托报关协议： </span>
            <span className='content_span'>{formData.wtbgxyfs || 0}</span>
            <span>份</span>
          </div>
          <div className='ml_number_zj'>
            <span>受托报关单位为其开具的代理报关服务费发票：</span>
            <span className='content_span'>{formData.dlbgfwffpfs || 0}</span>
            <span>份</span>
          </div>
          {/* 4. 其他单据 */}
          <div className='ml_number'>
            <span>4. 其他单据：</span>
            <Tooltip 
              title={tooltipContent}
              overlayClassName="custom-tooltip"
            >
              <span className='content_span'>{formData.qtdzfs || 0}</span>
            </Tooltip>
            <span>份</span>
          </div>
          <div className='ml_number_zj'>
            <span>存放方式：</span>
            <span>{formData.dzbaBz !== 'Y' ? '纸质化备案' : '电子化备案'}</span>
          </div>
          {
            formData.dzbaBz !== 'Y' ? 
              <div className='ml_number_zj'>
              <span>存放地点：</span>
                <span className='content_span'>{formData.zzbadzcfdd}</span>
              </div> : <></>
          }
          <div className='ml_number_zj'>
            <span>企业名称：</span>
            <span>{userInfo?.qxQys[0]?.nsrmc}</span>
          </div>
        </Form>
      </div>
    </>
  );
};
export default DyViewer;
