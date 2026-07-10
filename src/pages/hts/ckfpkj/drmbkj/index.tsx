/**
 * 导入模板开具 主页面
 */
import React, { useRef, useState, useEffect } from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import drmbkjConfig from './config';
import drmbkjFunc from './f';
import ErrorMsgGrid from './errormsg_grid';
import DrmbkjInvoice from './drmbkjInvoice';
import { sdpqrkpDrmb, sdpddtjkp, commonDrwtdc } from '@/pages/hts/services/htsApi';
import SfyzModal from '../common/modal_sfyz'
import KprzModal from '../common/modal_kprz'
import { Button, message, Tooltip } from 'antd';
import { intl as intl2 } from '@/components/DDAssist/util';
import DDAlert from '@/pages/hts/components/DDAlert';
import myUtil from '@/components/DDAssist/util';


const refSfyz: any = React.createRef();
const refKprz: any = React.createRef();
const DrmbkjIndex: React.FC<unknown> = () => {
  const [kpUnitRef, setKpUnitRef] = useState<any>(); 
  const [tjkpParams, setTjkpParams] = useState<any>({}); // 提交开票条件
  // const [tempCode, setTempCode] = useState<any>({}); // 发票配置的码表
  const errorMsgRef: any = useRef();
  const drmbkjInvoiceRef: any = useRef();

  const drMyConfig = {...drmbkjConfig}

  const temp = myUtil.code.getCode('CODE_CS_ZXSB_FPKJ_CSPZ:01')
  const tempCode = temp[0];
  // 在线
  if(tempCode && tempCode?.fpkjfsDm === '2') {
    // 配置项：自定义工具栏
    drMyConfig.customer_toolbar = [
      { name: '导入', func: 'excelImport' },
      { name: '审核', func: 'qrkp_zx' },
      // { name: '录入', func: 'sdcjkj' },
      { name: '修改', func: 'gxDrmbkj' },
      { name: '删除', func: 'deleteFpsqd' },
    ];
    drMyConfig.grid_columns.forEach((item: any) => {
      if(item.dataIndex === 'sjztDm') {
        item.hidden = false;
      }
    })
  } else if(tempCode && tempCode?.fpkjfsDm === '1') {
    // 导出开票
    // 配置项：自定义工具栏
    drMyConfig.customer_toolbar = [
      { name: '导入', func: 'excelImport' },
      { name: '确认开票', func: 'qrkp_dc' },
      // { name: '录入', func: 'sdcjkj' },
      { name: '修改', func: 'gxDrmbkj' },
      { name: '删除', func: 'deleteFpsqd' },
    ];
    drMyConfig.grid_columns.forEach((item: any) => {
      if(item.dataIndex === 'sjztDm') {
        item.hidden = true;
      }
    })
  }

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
    if(refSfyz) {
      refSfyz.current!.closeModal(); // 关闭电子税务局身份验证
    } 
    // if(refKprz) {
    //   refKprz.current!.closeModal(); // 关闭二维码身份验证
    // }
    kpSuccess({}, kpUnitRef, 'tj');
  }

  // 二次二维码
  const openSfyzModal = () => {
    refKprz.current!.closeModal(); // 关闭二维码身份验证
    refSfyz.current!.showModal(); // 打开电子税务局身份验证
  }

  drmbkjFunc.qrkpModal = (params: any) => {
    const { refUnit, kpParams} = params;
    setKpUnitRef(refUnit);
    kpSuccess(kpParams, refUnit, 'qr');
  }

  const kpSuccess = (obj:any, ref: any, flag: any) => {
    const refUnit = ref;
    if(flag === 'tj') {
      refUnit.current!.setMasker(true);
      sdpddtjkp(tjkpParams).then((res2:any) => {
        refUnit.current!.setMasker(false);
        const {code, body, desc, msg} = res2;
        if(code === '200') {
          const rtnCode = body.rtnCode;
          if(rtnCode === '200') {
            refUnit.current!.reload();
            message.success(intl2.formatMessage({ id: 'message_ckfp_fpsqd_qrkp_success' }));
          } else if(rtnCode === '2004'){
            refSfyz.current!.showModal(); // 打开电子税务局身份验证
          } else if(rtnCode === '2005') {
            refKprz.current!.showModal(); // 打开二维码身份验证
          }
        } else if(code === '900') {
          const sbyyList = body?.drycxx;
          const ts = body.cgts;
          openYwjyModal(sbyyList, refUnit, ts);
          message.info(msg)
        } else if(code === '0'){
          message.error('系统异常，请联系技术支持。');
        } else {
          message.error(desc)
        }
      })
    } else {
      refUnit.current!.setMasker(true);
      sdpqrkpDrmb(obj).then((res1:any)=> {
        refUnit.current!.setMasker(false);
        if(res1.code === '200') {
          const body = res1.body;
          if(body.rtnCode === '2004') {
            const paramsTj = {
              data:body.data,
              flag: body.flag,
            }
            setTjkpParams(paramsTj)
            refSfyz.current!.showModal();
          } else if(body.rtnCode === '2005') {
            // 二次认证
            refKprz.current!.showModal();
          } else if(body.rtnCode === '200') {       
            refUnit.current!.reload();
            message.success(intl2.formatMessage({ id: 'message_ckfp_fpsqd_qrkp_success' }));
          }
        } else if(res1.code === '900'){
          // 业务校验
          const sbyyList = res1?.body?.drycxx || [];
          openYwjyModal(sbyyList, refUnit, '');
        } else if(res1.code === '0'){
          message.error('系统异常，请联系技术支持。');
        } else {
          message.error(res1.desc);
        }
      })
    }
  }

  // 业务校验900
  const openYwjyModal = (data:any, refUnit:any, ts: any) => {
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
        <Button key={"dc"} onClick={() => handleDownload('DC_HX_DC_DRWTDC', refUnit)}>导出</Button>,
      ],
      content:
        <table className="fpsqd_qrkp_kpsb">
          <tr style={{backgroundColor: '#FAFAFA'}}>
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
  const handleDownload = (id: any, refUnit: any) => {
    const params = {key: id};
    refUnit.current!.setMasker(true);
    commonDrwtdc(params).then((response: any) => {
      refUnit.current!.setMasker(false);
      if (response.code === '200') {
        const {blob, fileName} = response.body;
        myUtil.file.downloadExcel(blob, fileName);
      } else {
        message.error(response.desc);
      }
    });
  }

  return <div key='drmbkj1'>
    <DDBunit2 config={drMyConfig} func={drmbkjFunc} key='drmbkj' />
    <ErrorMsgGrid onRef={errorMsgRef} />
    <DrmbkjInvoice onRef={drmbkjInvoiceRef} />
    <SfyzModal onRef={refSfyz} handleColseModal={sfyzCloseModel} />
    <KprzModal onRef={refKprz} handleOtherModal={openSfyzModal} handleColseModal={sfyzCloseModel}/>
  </div>;
};
export default DrmbkjIndex;
