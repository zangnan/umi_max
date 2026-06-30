/**
 * title: 智能分析
 * desc: 智能分析-主页面
 * creator: yxy
 */
import React, { useRef, useState } from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import unitConfig from './config';
import ZnfxFunc from './f';
import ModalBdjg from './bdjg';
import ModalJckgd from './jckgd';
import ModalJckhzqd from './jckhzqd';
import ModalYsbcke from './ysbcke';
import ModalJckze from './jckze';
import ModalBt from './modal_bt';
import myUtil from '@/components/DDAssist/util';
import moment from 'moment';
import { useIntl } from 'umi';
import { useRequest } from 'ahooks';
import { bgdtjmyjjy, queryFxzSjTs } from '@/pages/hts/services/htsApi';
import { message } from 'antd';
import DDAlert from '@/pages/hts/components/DDAlert';
import { intl as intl2 } from '@/components/DDAssist/util';

const Znfx: React.FC<unknown> = () => {
  const [startLx, setStartLx] = useState<any>(false);

  const myConfig = { ...unitConfig };
  myConfig.grid_filter_quick[0].defaultValue = '2';
  const initHxzq = myUtil.localStore.getItem('znfx-hxzq');
  if (initHxzq) {
    myConfig.grid_filter_quick[1].defaultValue=  [moment(new Date(initHxzq[0])) , moment(new Date(initHxzq[1]))];
  } else {
    myConfig.grid_filter_quick[1].defaultValue= [moment(new Date(myUtil.date.getQZDateBeforeCurr(1).firstDay)) , moment(new Date(myUtil.date.getQZDateBeforeCurr(1).lastDay))];
  }

  const bdjgRef: any = useRef();
  const jckgdRef: any = useRef();
  const jckhzqdRef: any = useRef();
  const ysbckeRef: any = useRef();
  const jckzeRef: any = useRef();
  const btRef: any = useRef();


  // 重新计算美元额
  ZnfxFunc.handleZnfxMye = (param: any) => {
    const {selectionRows, unitRef, gridRef} = param;
    if (!selectionRows || selectionRows.length === 0) {
      message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
      return;
    }
    let uuids:any = [];
    let zbuuids:any = [];
    // 勾选的数据中存在“计算中”或“待计算”的数据，无法进行操作。
    if (selectionRows && selectionRows.length > 0) {
      for (let i = 0; i < selectionRows.length; i++ ) {
        if(selectionRows[i].jmfxztDm === '00' || selectionRows[i].jmfxztDm === '10'){
          uuids.push(selectionRows[i].zbuuid);
        } else {
          zbuuids.push(selectionRows[i].zbuuid);
        }
      }
    }

    if(uuids.length > 0) {
      message.info('勾选的数据中存在“计算中”或“待计算”的数据，无法进行操作。');
      return;
    }
    const params = {
      zbuuids,
    };
    bgdtjmyjjy(params).then((res: any) => {
      const { code, body, msg } = res;
      if (code === '900') {
        const otherRef = unitRef.current?.getOtherRefs();
        if (otherRef[5]) {
          otherRef[5].current?.showModal(unitRef, params, body, startLx);
        }
      } else if(code === '200') {
        // 弹窗关闭
        DDAlert.open({
          title: '重新计算美元额',
          info: '重新计算美元额申请成功！',
          content: '可通过点击“查询”按钮更新重新计算的状态。',
          infoType: 'success',
          modalType: 'confirm',
          okText: '确认',
          closeStatus: true,
          isFormContent: false,
          okCallbackFn : function() {
            DDAlert.close();
          },
        });
        if(!startLx){
          run();
        } else {
          unitRef.current!.reload2(); // 刷新页面
        }
      }else if(code === '901'){
        message.info(msg)
      }else {
        message.error(msg)
      }
    })
  };

  // 定时刷新
  const getCxjsDsTime = () => {
    queryFxzSjTs({}).then((res01:any)=> {
      // N-不触发刷新，但是要继续调用；
      // Y-触发刷新，但是还要继续调用；
      // S-触发刷新，后续停止调用
      if(res01.code === '200') {
        if(res01?.body === 'Y') {
          setStartLx(true);
          ZnfxFunc?.unitRef.current?.reload2();
        } else if(res01?.body === 'S') {
          cancel();
          setStartLx(false);
          ZnfxFunc?.unitRef.current?.reload2();
        } else {
          setStartLx(true);
        }
      } else {
        setStartLx(false);
        cancel();
      }
    })
  }

  // 轮询
  const { run, cancel } = useRequest(getCxjsDsTime, {
    pollingInterval: 30000,
    manual: true,
  });

  // useEffect(() => {
  //   run('1')
  // }, []);

  ZnfxFunc.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(bdjgRef);
    otherRef.push(jckgdRef);
    otherRef.push(jckhzqdRef);
    otherRef.push(ysbckeRef);
    otherRef.push(jckzeRef);
    otherRef.push(btRef);
    return otherRef;
  };

  ZnfxFunc.intl = useIntl();

  return (
    <>
      <DDBunit2 config={myConfig} func={ZnfxFunc}/>
      <ModalBdjg onRef={bdjgRef} />
      <ModalJckgd onRef={jckgdRef} />
      <ModalJckhzqd onRef={jckhzqdRef} />
      <ModalYsbcke onRef={ysbckeRef} />
      <ModalJckze onRef={jckzeRef} />
      <ModalBt onRef={btRef} lxRef={run} />
    </>
  );
};

export default Znfx;