/**
 * title: 备案单证目录
 */
import React, { useRef, useState, useImperativeHandle } from 'react';
import { Modal, Button, InputNumber, Input, Form, message } from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
import { queryZzbaTjsj, queryBadzMlSjtj, saveOrUpdateZzbaBaqk } from '@/pages/hts/services/htsApi';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import '../../style.less';
import ModalBadzyl from './modal_xq';
import ModalBgd from './modal_bgdxq';
import cktsUtil from '@/pages/hts/cktsUtil';
import myUtil from '@/components/DDAssist/util';

export type DyViewerProps = {
  visible?: any;
  onRef?: any;
  type: any
}

const DyViewer: React.FC<DyViewerProps> = ({
  visible = false,
  onRef,
  type
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [statementModalVisible, setStatementModalVisible] = useState<boolean>(false);
  const [mainParams, setMainParams] = useState<any>({});
  const [formData, setFormData] = useState<any>({});
  const [formDisabled, setFormDisabled] = useState<any>(false);
  
  const [ckqygxhtfs, setCkqygxhtfs] = useState<any>(0); // 出口企业购销合同份数
  const [ckhwysdj, setCkhwysdj] = useState<any>(0); // 出口货物运输单据
  const [ckqywtqtdwbgdj, setCkqywtqtdwbgdj] = useState<any>(0); // 出口企业委托其他单位报关的单据
  
  const userInfo = myUtil.sessionStore.getItem('userInfo');

  const [btnShow, setBtnShow] = useState<any>({
    edit: false,
    zdcc: false,
    download: false,
    print: false,
    zdccbz: false,
    detail: false
  });

  const [dzmlForm] = Form.useForm();
  const modalBadzylRef: any = useRef();
  const modalBgdRef: any = useRef();
  // 开启
  const showModal = (param: any, bafs: any) => {
    const { record } = param;
    if (type === 'bafs') {
      // 如果是选择纸质备案方式进人，打开装订成册，屏蔽其他按钮
      setFormDisabled(false);
      setBtnShow({
        edit: false,
        zdcc: false,
        download: false,
        print: false,
        zdccba: true,
        detail: false
      })
    } else if (record.zzbaBz == 'Y') {
      // 如果是查看时纸质备案方式进人，需要屏蔽详情,装订成册按钮，打开修改，下载，打印按钮
      setFormDisabled(true);
      setBtnShow({
        edit: true,
        zdcc: false,
        download: true,
        print: true,
        zdccba: false,
        detail: false
      })
    } else if (record.zzbaBz == 'N') {
      // 如果是查看时电子备案方式进人，需要屏蔽详情,装订成册，修改按钮，打开下载，打印按钮
      setFormDisabled(true);
      setBtnShow({
        edit: false,
        zdcc: false,
        download: true,
        print: true,
        zdccba: false,
        detail: false
      })
    } else {
      // 说明是装订成册进入，打开详情按钮，屏蔽其他按钮
      setFormDisabled(true);
      setBtnShow({
        edit: false,
        zdcc: false,
        download: false,
        print: false,
        zdccba: false,
        detail: true
      })
    }

    if (bafs === '1') { // 切换备案方式为纸质时进入，清空所有数据
      const data = {
        ckxshtfs: 0,
        wmGhhtfs: 0,
        scGhhtfs: 0,
        wmzhfwhtfs: 0,
        tydHytdfs: 0,
        tydHkydfs: 0,
        tydTlydfs: 0,
        tydGlyszhqdfs: 0,
        tydYzysdfs: 0,
        ysfpCfyffs: 0,
        ysfpCfgjhwysdlfwffs: 0,
        wtbgxyfs: 0,
        dlbgfwffpfs: 0
      }
      setFormData(data);
      dzmlForm.setFieldsValue(data);
      titleChange(data);
    } else {
      if (record.zzbaBz === 'Y') {
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
      }
    }
    setMainParams(param);
    setModalVisible(true);
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });
  // 修改
  const modifyForm = () => {
    setFormDisabled(false);
    setBtnShow({
      edit: false,
      zdcc: true,
      download: true,
      print: true,
      zdccba: false,
      detail: false
    })
  };
  // 下载
  const download = () => {
    const { record } = mainParams;
    const params = {
      zzbaBz: record.zzbaBz,
      dzbaBz: record.dzbaBz,
      baqkUuid: record.uuid
    }
    const url = '/hx/ty/report/excelExportGet/EXCEL_REPORT_ZXSB_BADZ_BAQKML/';
    cktsUtil.downloadFileCkts(url, params);
  };
  // 打印
  const print = () => {
    const { record } = mainParams;
    const params = {
      zzbaBz: record.zzbaBz,
      dzbaBz: record.dzbaBz,
      baqkUuid: record.uuid
    }
    const url = '/hx/ty/report/pdfExportGet/EXCEL_REPORT_ZXSB_BADZ_BAQKML/';
    cktsUtil.popupPdfFile(url, params);
  };
  // 装订成册备案
  const zdccba = () => {
    const { record, refUnit } = mainParams;
    const formValue = dzmlForm.getFieldsValue();
    if (ckqygxhtfs === 0 && ckhwysdj === 0 && ckqywtqtdwbgdj === 0 && !formValue.qtdzfs) {
      message.warning('至少要有一份任意单证');
      return;
    }
    if ((type === 'bafs' || formData.dzbaBz !== 'Y') && !formValue.zzbadzcfdd?.trim()) {
      message.warning('备案单证存放地址不得为空');
      return;
    }
    const params = { ...record, ...formValue }
    saveOrUpdateZzbaBaqk(params).then((response) => {
      const { code, desc, body } = response;
      if (code === '200') {
        closeModalVisible();
        refUnit.current!.reload2();
        message.success(body.msg);
      } else {
        message.error(desc);
      }
    })
  };
  // 详情
  const viewDetails = () => {
    const { record } = mainParams;
    if (record.ppgzDm === '01') {
      modalBgdRef.current?.showModal(mainParams);
    } else {
      modalBadzylRef.current?.showModal(mainParams);
    }
  };
  // 关闭弹窗
  const closeModalVisible = () => {
    dzmlForm.resetFields();
    setFormData({});
    setModalVisible(false)
  }

  // 目录标题合计计算
  const titleChange = (body: any) => {
    const formValue = body;
    setCkqygxhtfs((formValue.ckxshtfs || 0) + (formValue.wmGhhtfs || 0) + (formValue.scGhhtfs || 0) + (formValue.wmzhfwhtfs || 0));
    setCkhwysdj((formValue.tydHytdfs || 0) + (formValue.tydHkydfs || 0) + (formValue.tydTlydfs || 0) + (formValue.tydGlyszhqdfs || 0) + (formValue.tydYzysdfs || 0) + (formValue.ysfpCfyffs || 0) + (formValue.ysfpCfgjhwysdlfwffs || 0));
    setCkqywtqtdwbgdj((formValue.wtbgxyfs || 0) + (formValue.dlbgfwffpfs || 0));
  }

  // 打开声明弹窗
  const openStatementModal = () => {
    setStatementModalVisible(true);
  }
  return (
    <>
      <Modal
        title={`所属期：${mainParams?.record?.ssq || ''} 批次：${mainParams?.record?.sbpc || ''}`}
        destroyOnHidden
        open={modalVisible}
        width={CONSTANTS.C_MODAL_WIDTH_X1}
        zIndex={998}
        mask={{ closable: false }}
        footer={
          <div style={{ textAlign: 'center' }}>
            { btnShow.edit ? <Button onClick={modifyForm} type="default">修改</Button> : <></> }
            { btnShow.zdcc ? <Button onClick={zdccba} type="default">装订成册</Button> : <></> }
            { btnShow.download ? <Button onClick={download} type="default">下载</Button> : <></> }
            { btnShow.print ? <Button onClick={print} type="default">打印</Button> : <></> }
            { btnShow.zdccba ? <Button onClick={zdccba} type="primary">装订成册备案</Button> : <></> }
            { btnShow.detail ? <Button onClick={viewDetails} type="default">详情</Button> : <></> }
          </div>
        }
        onCancel={closeModalVisible}
      >
        <div className='badz_ml'>
          <div className="ml_bawcqk">
            { formData.xgrq ? <span className='ml_xgrq'>最近装订时间：{formData.xgrq}</span> : <></> }
            <span className='ml_zdccsm'>{formData.zzbaBz === 'Y' || formData.bawcbz === 'Y' ? '已装订' : '未装订'}</span><br />
          </div>
          <div className='ml_title'>
            <span style={{paddingRight: '12px'}}>出口退（免）税备案单证目录</span><ExclamationCircleOutlined onClick={openStatementModal} />
          </div>
          
          <Form form={dzmlForm} name={'mts-znpd-form'} initialValues={{}}>
            {/* 1. 出口企业购销合同份数 */}
            <div className='ml_number'>
              <span>1. 出口企业购销合同份数：</span>
              <span>{ckqygxhtfs}</span>
              <span>份，其中</span>
            </div>
            <div className='ml_number_zj'>
              <span>出口销售合同：</span>
              <Form.Item name="ckxshtfs" noStyle>
                <InputNumber className='auto-grow-inputnumber' controls={false} precision={0} max={999999999999} min={0} disabled={formDisabled} onChange={() =>titleChange(dzmlForm.getFieldsValue())} />
              </Form.Item>
              <span>份</span>
            </div>
            <div className='ml_number_zj'>
              <span>外贸企业购货合同：</span>
              <Form.Item name="wmGhhtfs" noStyle>
                <InputNumber className='auto-grow-inputnumber' controls={false} precision={0} max={999999999999} min={0} disabled={formDisabled} onChange={() =>titleChange(dzmlForm.getFieldsValue())} />
              </Form.Item>
              <span>份</span>
            </div>
            <div className='ml_number_zj'>
              <span>生产企业收购非自产货物出口的购货合同：</span>
              <Form.Item name="scGhhtfs" noStyle>
                <InputNumber className='auto-grow-inputnumber' controls={false} precision={0} max={999999999999} min={0} disabled={formDisabled} onChange={() =>titleChange(dzmlForm.getFieldsValue())} />
              </Form.Item>
              <span>份</span>
            </div>
            <div className='ml_number_zj'>
              <span>外贸综合服务合同：</span>
              <Form.Item name="wmzhfwhtfs" noStyle>
                <InputNumber className='auto-grow-inputnumber' controls={false} precision={0} max={999999999999} min={0} disabled={formDisabled} onChange={() =>titleChange(dzmlForm.getFieldsValue())} />
              </Form.Item>
              <span>份</span>
            </div>
            {/* 2. 出口货物运输单据 */}
            <div className='ml_number'>
              <span>2. 出口货物运输单据：</span>
              <span>{ckhwysdj}</span>
              <span>份，其中</span>
            </div>
            <div className='ml_number_zj'>
              <span>海运提单：</span>
              <Form.Item name="tydHytdfs" noStyle>
                <InputNumber className='auto-grow-inputnumber' controls={false} precision={0} max={999999999999} min={0} disabled={formDisabled} onChange={() =>titleChange(dzmlForm.getFieldsValue())} />
              </Form.Item>
              <span>份</span>
            </div>
            <div className='ml_number_zj'>
              <span>航空运单：</span>
              <Form.Item name="tydHkydfs" noStyle>
                <InputNumber className='auto-grow-inputnumber' controls={false} precision={0} max={999999999999} min={0} disabled={formDisabled} onChange={() =>titleChange(dzmlForm.getFieldsValue())} />
              </Form.Item>
              <span>份</span>
            </div>
            <div className='ml_number_zj'>
              <span>铁路运单：</span>
              <Form.Item name="tydTlydfs" noStyle>
                <InputNumber className='auto-grow-inputnumber' controls={false} precision={0} max={999999999999} min={0} disabled={formDisabled} onChange={() =>titleChange(dzmlForm.getFieldsValue())} />
              </Form.Item>
              <span>份</span>
            </div>
            <div className='ml_number_zj'>
              <span>公路运输载货清单：</span>
              <Form.Item name="tydGlyszhqdfs" noStyle>
                <InputNumber className='auto-grow-inputnumber' controls={false} precision={0} max={999999999999} min={0} disabled={formDisabled} onChange={() =>titleChange(dzmlForm.getFieldsValue())} />
              </Form.Item>
              <span>份</span>
            </div>
            <div className='ml_number_zj'>
              <span>邮政运输单：</span>
              <Form.Item name="tydYzysdfs" noStyle>
                <InputNumber className='auto-grow-inputnumber' controls={false} precision={0} max={999999999999} min={0} disabled={formDisabled} onChange={() =>titleChange(dzmlForm.getFieldsValue())} />
              </Form.Item>
              <span>份</span>
            </div>
            <div className='ml_number_zj'>
              <span>出口企业承付运费的国内运输发票：</span>
              <Form.Item name="ysfpCfyffs" noStyle>
                <InputNumber className='auto-grow-inputnumber' controls={false} precision={0} max={999999999999} min={0} disabled={formDisabled} onChange={() =>titleChange(dzmlForm.getFieldsValue())} />
              </Form.Item>
              <span>份</span>
            </div>
            <div className='ml_number_zj'>
              <span>出口企业承付国际货物运输代理服务费发票：</span>
              <Form.Item name="ysfpCfgjhwysdlfwffs" noStyle>
                <InputNumber className='auto-grow-inputnumber' controls={false} precision={0} max={999999999999} min={0} disabled={formDisabled} onChange={() =>titleChange(dzmlForm.getFieldsValue())} />
              </Form.Item>
              <span>份</span>
            </div>
            {/* 3. 出口企业委托其他单位报关的单据 */}
            <div className='ml_number'>
              <span>3. 出口企业委托其他单位报关的单据：</span>
              <span>{ckqywtqtdwbgdj}</span>
              <span>份，其中</span>
            </div>
            <div className='ml_number_zj'>
              <span>委托报关协议： </span>
              <Form.Item name="wtbgxyfs" noStyle>
                <InputNumber className='auto-grow-inputnumber' controls={false} precision={0} max={999999999999} min={0} disabled={formDisabled} onChange={() =>titleChange(dzmlForm.getFieldsValue())} />
              </Form.Item>
              <span>份</span>
            </div>
            <div className='ml_number_zj'>
              <span>受托报关单位为其开具的代理报关服务费发票：</span>
              <Form.Item name="dlbgfwffpfs" noStyle>
                <InputNumber className='auto-grow-inputnumber' controls={false} precision={0} max={999999999999} min={0} disabled={formDisabled} onChange={() =>titleChange(dzmlForm.getFieldsValue())} />
              </Form.Item>
              <span>份</span>
            </div>
            {/* 4. 其他单据 */}
            <div className='ml_number'>
              <span>4. 其他单据：</span>
              <Form.Item name="qtdzfs" noStyle>
                <InputNumber className='auto-grow-inputnumber' controls={false} precision={0} max={999999999999} min={0} disabled={formDisabled} onChange={() =>titleChange(dzmlForm.getFieldsValue())} />
              </Form.Item>
              <span>份</span>
            </div>
            <div className='ml_number_zj'>
              <span>存放方式：</span>
              <span>{type === 'bafs' || formData.dzbaBz !== 'Y' ? '纸质化备案' : '电子化备案'}</span>
            </div>
            {
              type === 'bafs' || formData.dzbaBz !== 'Y' ? 
                <div className='ml_number_zj'>
                  <Form.Item name="zzbadzcfdd" label="存放地点">
                    <Input className='auto-grow-input' maxLength={50} style={{width: '100% !important'}} disabled={formDisabled} />
                  </Form.Item>
                </div> : <></>
            }
            <div className='ml_number_zj'>
              <span>企业名称：</span>
              <span>{userInfo?.qxQys[0]?.nsrmc}</span>
            </div>
          </Form>
        </div>
      </Modal>
      <Modal
        title="声明"
        destroyOnHidden
        visible={statementModalVisible}
        width={CONSTANTS.C_MODAL_WIDTH_X4}
        zIndex={998}
        mask={{ closable: false }}
        onCancel={() => setStatementModalVisible(false)}
        footer={
          <Button onClick={() => setStatementModalVisible(false)} type="default">关闭</Button>
        }
      >
        <div className="basy_xz_xxqr_content">
            <p>尊敬的纳税人：</p>
            <p className="xxqr-zl"> 如该所属期、批次的出口货物退（免）税单证备案确认方式为纸质备案，
                请按照国家税务总局2022年第9号《国家税务总局关于进一步便利出口退税办理 
                促进外贸平稳发展有关事项的公告》第二条规定内容整理并装订好下列备案所需的纸质凭证：
            </p>
            <ul>
                <li className="xxqr-mx">1.出口企业的购销合同（包括：出口合同、外贸综合服务合同、外贸企业购货合同、生产企业收购非自产货物出口的购货合同等）；</li>
                <li className="xxqr-mx">2.出口货物的运输单据（包括：海运提单、航空运单、铁路运单、货物承运单据、邮政收据等承运人出具的货物单据，出口企业承付运费的国内运输发票，出口企业承付费用的国际货物运输代理服务费发票等）；</li>
                <li className="xxqr-mx">3.出口企业委托其他单位报关的单据（包括：委托报关协议、受托报关单位为其开具的代理报关服务费发票等）</li>
            </ul>
            <p className="xxqr-zl"> 纳税人无法取得上述单证的，可用具有相似内容或作用的其他资料进行单证备案。</p>
        </div>
      </Modal>
      <ModalBadzyl onRef={modalBadzylRef} />
      <ModalBgd onRef={modalBgdRef} />
    </>
  );
};
export default DyViewer;
