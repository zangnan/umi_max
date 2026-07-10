import React from 'react';
import 'moment/locale/zh-cn';
import { Button, message } from "antd";
import { intl as intl2 } from '@/components/DDAssist/util';
import { queryTjfs, updateBawcbz, cxZdcc } from '@/pages/hts/services/htsApi';
import DDAlert from '@/pages/hts/components/DDAlert';

const Func: any = {
  refUnit: React.createRef(),
};

// 查看详情
Func.handleColumnsCkxq = (param: any) => {
  const { otherRef } = param;
  otherRef[0].current?.showModal(param);
};

// 装订成册备案
// Func.costomerToobarZdccba = async (param: any) => {
//   const { refUnit, selectionRowKeys, selectionRows } = param;
//   if (selectionRowKeys.length > 1) {
//     message.info(intl2.formatMessage({ id: 'message_one_selected' }));
//     return;
//   }
//   if (!selectionRowKeys || selectionRowKeys.length === 0) {
//     message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
//     return;
//   }
//   queryTjfs({ baqkUuid: selectionRows[0].uuid }).then((response) => {
//     const { code, desc, body } = response;
//     if (code === '200') {
//       DDAlert.open({
//         title: '装订成册',
//         infoType: 'info',
//         modalType: 'form',
//         closeStatus: false,
//         isFormContent: true,
//         width: '350px',
//         content: <>
//           <div style={{ marginBottom: '20px' }}>是否确认已完成单证备案？</div>
//           <div>{`所属期：${body.ssq || ''}`}</div>
//           <div>{`申报批次：${body.sbpc || ''}`}</div>
//           <div>{`通知流水号：${body.tzlsh || ''}`}</div>
//           <div>{`购销合同：${body.ckxshtfs + body.ghhtfs + body.wmzhfwhtfs}份`}</div>
//           <div>{`运输单据：${body.tydfs + body.ysfpfs}份`}</div>
//           <div>{`委托报关单据：${body.wtbgxyfs + body.dlbgfwffpfs}份`}</div>
//           <div>{`其他单证：${body.qtdzfs}份`}</div>
//         </>,
//         okCallbackFn: function (thisObj: any) {
//           thisObj.setState({ masker: true });
//           updateBawcbz(selectionRows[0]).then((response) => {
//             thisObj.setState({ masker: false });
//             DDAlert.close();
//             const { code, desc } = response;
//             if (code === '200') {
//               message.success('操作成功');
//               refUnit.current!.reload();
//             } else {
//               message.error(desc);
//             }
//           })
//         }
//       })
//     } else {
//       message.error(desc);
//     }
//   })
// }

// 新 装订成册逻辑
Func.costomerToobarZdccba = async (param: any) => {
  const { otherRef, selectionRowKeys, selectionRows } = param;
  if (selectionRowKeys.length > 1) {
    message.info(intl2.formatMessage({ id: 'message_one_selected' }));
    return;
  }
  if (!selectionRowKeys || selectionRowKeys.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  const record = selectionRows[0];
  if ("Y" === record.sfzdcc) {
    message.info("当前数据已装订成册备案，请重新选择！");
    return;
  }
  // 打开页面
  otherRef[1].current?.showModal(param, record, "ZDCC");
}

// 备案撤销
Func.costomerToobarCxba = async (param: any) => {
  const { refUnit, selectionRowKeys, selectionRows } = param;
  if (selectionRowKeys.length > 1) {
    message.info(intl2.formatMessage({ id: 'message_one_selected' }));
    return;
  }
  if (!selectionRowKeys || selectionRowKeys.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  if (selectionRows[0].sfzdcc != 'Y') {
    message.error('该所属期批次尚未装订备案，无需撤销！');
    return;
  }
  if (selectionRows[0].sdbz == 'Y') {
    message.error('当前数据已被税务机关锁定，无法撤销');
    return;
  }
  DDAlert.open({
    title: '消息确认',
    info: '确定撤销备案单证数据？',
    infoType: 'question',
    modalType: 'confirm',
    okCallbackFn: function (thisObj: any) {
      thisObj.setState({ masker: true });
      cxZdcc(selectionRows[0]).then((response) => {
        thisObj.setState({ masker: false });
        DDAlert.close();
        const { code, desc } = response;
        if (code === '200') {
          message.success('撤销备案成功');
          refUnit.current!.reload();
        } else {
          message.error(desc);
        }
      })
    },
  });
}
export default Func;
