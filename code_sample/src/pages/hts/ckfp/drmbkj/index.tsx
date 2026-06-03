/**
 * 导入模板开具 主页面
 */
import React, { useRef, useState } from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import drmbkjConfig from './config';
import drmbkjFunc from './f';
import ErrorMsgGrid from './errormsg_grid';
import DrmbkjInvoice from './drmbkjInvoice';
import { sdpqrkpDrmb, sdpddtjkp, commonDrwtdc } from '@/services/hts/api';
import SfyzModal from '../common/modal_sfyz'
import KprzModal from '../common/modal_kprz'
import { Button, message, Tooltip } from 'antd';
import { intl as intl2 } from '@/pages/common/myUtil';
import DDAlert from '@/components/DDAlert';
import myUtil from '@/pages/common/myUtil';

const refSfyz: any = React.createRef();
const refKprz: any = React.createRef();
const DrmbkjIndex: React.FC<unknown> = () => {
  const [kpUnitRef, setKpUnitRef] = useState<any>();
  const [tjkpParams, setTjkpParams] = useState<any>({}); // 提交开票条件

  const errorMsgRef: any = useRef();
  const drmbkjInvoiceRef: any = useRef();

  drmbkjFunc.getOtherRef = () => {
    const otherRef = [];
    // 导入模板数据异常页面
    otherRef.push(errorMsgRef);
    // 手动开具采集页面
    otherRef.push(drmbkjInvoiceRef);
    return otherRef;
  };

  // 切换
  const sfyzCloseModel = () => {
    if (refSfyz) {
      refSfyz.current!.closeModal(); // 关闭电子税务局身份验证
    }
    if (refKprz) {
      refKprz.current!.closeModal(); // 关闭二维码身份验证
    }
    kpSuccess({}, kpUnitRef, 'tj');
  }

  // 二次二维码
  const openSfyzModal = () => {
    refKprz.current!.closeModal(); // 关闭二维码身份验证
    refSfyz.current!.showModal(); // 打开电子税务局身份验证
  }

  drmbkjFunc.qrkpModal = (params: any) => {
    const { unitRef, kpParams } = params;
    setKpUnitRef(unitRef);
    kpSuccess(kpParams, unitRef, 'qr');
  }


  // 更新入参
  const ddtjkpParamUpdate = (body: any) => {
    const paramsTj = {
      data: body.data,
      flag: body.flag,
    }
    setTjkpParams(paramsTj)
  }

  const kpSuccess = (obj: any, ref: any, flag: any) => {
    const unitRef = ref;
    if (flag === 'tj') {
      unitRef.current!.setMasker(true);
      sdpddtjkp(tjkpParams).then((res2: any) => {
        unitRef.current!.setMasker(false);
        const { code, body, desc, msg } = res2;
        if (code === '200') {
          const rtnCode = body.rtnCode;
          if (rtnCode === '200') {
            unitRef.current!.reload2();
            message.success(intl2.formatMessage({ id: 'message_ckfp_fpsqd_qrkp_success' }));
          } else if (rtnCode === '2004') {
            ddtjkpParamUpdate(body);
            refSfyz.current!.showModal(); // 打开电子税务局身份验证
          } else if (rtnCode === '2005') {
            ddtjkpParamUpdate(body);
            refKprz.current!.showModal(); // 打开二维码身份验证
          }
        } else if (code === '900') {
          const sbyyList = body?.drycxx;
          const ts = body.cgts;
          openYwjyModal(sbyyList, unitRef, ts);
          message.info(msg)
        } else if (code === '0') {
          message.error('系统异常，请联系技术支持。');
        } else {
          message.error(desc)
        }
      })
    } else {
      unitRef.current!.setMasker(true);
      sdpqrkpDrmb(obj).then((res1: any) => {
        unitRef.current!.setMasker(false);
        if (res1.code === '200') {
          const body = res1.body;
          if (body.rtnCode === '2004') {
            const paramsTj = {
              data: body.data,
              flag: body.flag,
            }
            setTjkpParams(paramsTj)
            refSfyz.current!.showModal();
          } else if (body.rtnCode === '2005') {
            // 二次认证
            refKprz.current!.showModal();
          } else if (body.rtnCode === '200') {
            unitRef.current!.reload2();
            message.success(intl2.formatMessage({ id: 'message_ckfp_fpsqd_qrkp_success' }));
          }
        } else if (res1.code === '900') {
          // 业务校验
          const sbyyList = res1?.body?.drycxx || [];
          openYwjyModal(sbyyList, unitRef, '');
        } else if (res1.code === '0') {
          message.error('系统异常，请联系技术支持。');
        } else {
          message.error(res1.desc);
        }
      })
    }
  }

  // 业务校验900
  const openYwjyModal = (data: any, unitRef: any, ts: any) => {
    const textAreaValues: any = []
    data.forEach((item: any, index: any) => {
      textAreaValues.push(
        <tr>
          <td width='20%' className='fpsqd_qrkp_textCenter'>{index + 1}</td>
          <td width='35%' className='fpsqd_qrkp_textCenter'>{item.djbh}</td>
          <td width='45%' className='fpsqd_qrkp_textCenter'>
            <Tooltip title={item.msg}>
              <div className='fpsqd_qrkp_textName'>{item.msg}</div>
            </Tooltip>
          </td>
        </tr>
      )
    })
    const infoText = ts ? `已成功${ts}条数据，以下单据号无法确认开票，请调整数据后重新操作。` : '以下单据号无法确认开票，请调整数据后重新操作。'
    DDAlert.open({
      title: '确认开票',
      infoType: 'warning',
      modalType: 'info',
      info: infoText,
      width: '600px',
      button: [
        <Button key={"dc"} onClick={() => handleDownload('DC_HX_DC_DRWTDC', unitRef)}>导出</Button>,
      ],
      content:
        <table className="fpsqd_qrkp_kpsb">
          <tr style={{ backgroundColor: '#FAFAFA' }}>
            <th>序号</th>
            <th>单据号</th>
            <th>失败原因</th>
          </tr>
          {textAreaValues}
        </table>,
      okCallbackFn: function () {
        DDAlert.close();
      },
    });
  }

  // 导出
  const handleDownload = (id: any, unitRef: any) => {
    const params = { key: id };
    unitRef.current!.setMasker(true);
    commonDrwtdc(params).then((response: any) => {
      unitRef.current!.setMasker(false);
      if (response.code === '200') {
        const { blob, fileName } = response.body;
        myUtil.file.downloadExcel(blob, fileName);
      } else {
        message.error(response.desc);
      }
    });
  }

  return <div key='drmbkj1'>
    <DDBunit2 config={drmbkjConfig} func={drmbkjFunc} key='drmbkj' />
    <ErrorMsgGrid onRef={errorMsgRef} />
    <DrmbkjInvoice onRef={drmbkjInvoiceRef} />
    <SfyzModal onRef={refSfyz} handleColseModal={sfyzCloseModel} />
    <KprzModal onRef={refKprz} handleOtherModal={openSfyzModal} handleColseModal={sfyzCloseModel} />
  </div>;
};
export default DrmbkjIndex;
