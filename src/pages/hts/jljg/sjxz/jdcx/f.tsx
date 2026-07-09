import React from 'react';
import { message, Badge, Tooltip } from 'antd';
import { sjxzDelrw, sjxzCxxz } from '@/pages/hts/services/htsApi';
import DDAlert from '@/pages/hts/components/DDAlert';
import khdgjUtil from '@/pages/hts/ckfp/khdgjUtil';

const Func: any = {
  refUnit: React.createRef(),
};

Func.handleBatchDelete = (param: any) => {
  const { gridRef, selectionRows, refUnit } = param;
  if (!selectionRows || selectionRows.length === 0) {
    const unSelectedMessage = Func.intl.formatMessage({ id: 'message_delete_unselected' });
    message.info(unSelectedMessage);
    return;
  } else {
    const xzdyuuids: any = [];
    let num = 0;
    for (let i = 0; i < selectionRows.length; i++) {
      if (selectionRows[i].xzztDm === '0') {
        num = num + 1;
      }
      xzdyuuids.push(selectionRows[i].xzdyuuid);
    }
    if (num > 0) {
      const checkMessage = Func.intl.formatMessage({ id: 'message_jljghx_jdcx_plsc_check' });
      message.info(checkMessage);
      return;
    }
    const titleMessage = Func.intl.formatMessage({ id: 'message_jljghx_jdcx_plsc_title' });
    const infoMessage = Func.intl.formatMessage({ id: 'message_inquiry_delete' });
    DDAlert.open({
      title: titleMessage,
      info: infoMessage,
      infoType: 'question',
      modalType: 'confirm',
      closeStatus: true,
      content: '',
      isFormContent: false,
      okCallbackFn: function () {
        const data = {
          xzdyuuids: xzdyuuids
        };
        refUnit.current!.setMasker(true);
        sjxzDelrw(data).then((response: any) => {
          refUnit.current!.setMasker(false);
          const { code, desc } = response;
          if (code === '200') {
            refUnit.current?.setSelectionRowKeys([]);
            refUnit.current?.setSelectionRows([]);
            gridRef.current?.reload();
            const successMessage = Func.intl.formatMessage({ id: 'message_delete_success' });
            message.success(successMessage);
          } else {
            message.error(desc);
            return;
          }
        })
      }
    });
  }
}

// 下载开票文件
Func.handleDownLoadKpwj = (param: any) => {
  const { gridRef, selectionRows, refUnit } = param;
  if (!selectionRows || selectionRows.length === 0) {
    const unSelectedMessage = Func.intl.formatMessage({ id: 'message_jljghx_jdcx_cxxz_unSelected' });
    message.info(unSelectedMessage);
    return;
  } else {
    const xzdyuuids: any = [];
    let num = 0;
    for (let i = 0; i < selectionRows.length; i++) {
      if (selectionRows[i].xzztDm === '0') {
        num = num + 1;
      }
      xzdyuuids.push(selectionRows[i].xzdyuuid);
    }
    if (num > 0) {
      const checkMessage = Func.intl.formatMessage({ id: 'message_jljghx_jdcx_cxxz_check' });
      message.info(checkMessage);
      return;
    }
    const titleMessage = Func.intl.formatMessage({ id: 'message_jljghx_jdcx_cxxz_title' });
    const infoMessage = Func.intl.formatMessage({ id: 'message_jljghx_jdcx_cxxz_info' });
    DDAlert.open({
      title: titleMessage,
      info: infoMessage,
      infoType: 'question',
      modalType: 'confirm',
      closeStatus: true,
      content: '',
      isFormContent: false,
      okCallbackFn: function () {
        refUnit.current!.setMasker(true);
        sjxzCxxz({ xzdyuuids }).then(async (response: any) => {
          const { code, body, desc } = response;
          refUnit.current!.setMasker(false);
          if (code === '200') {
            const taskIds = body.taskIds;
            const yhjq = body.yhjq;
            // 含有客户端工具的主键集合，调用客户端工具
            if (taskIds) {
              // 客户端工具校验
              const { jcbz, msg } = await khdgjUtil.khdgjJc({ icCardPsw: body.kakmm, yhjq: body.yhjq });
              if (jcbz == 'Y') {
                taskIds.forEach((element: any) => {
                  khdgjUtil.khdgjGdxz({ taskId: element, yhjq: yhjq })
                });
                refUnit.current!.setMasker(false);
              } else {
                message.info(msg);
                refUnit.current!.setMasker(false);
              }
            }
            refUnit.current?.setSelectionRowKeys([]);
            refUnit.current?.setSelectionRows([]);
            gridRef.current?.reload();
            message.success(Func.intl.formatMessage({ id: 'message_jljghx_jdcx_cxxz_success' }));
          } else {
            message.error(desc);
            return;
          }
        })
      }
    });
  }
}

// 列表自定义渲染
Func.columnsRender = {
  // 进度查询 -- 执行状态
  renderJljghxSjxzJdcxZxzt: (param: any) => {
    let col: any = <></>;
    if (param.text === '1') {
      col = (
        <span className="dd_grid_icon">
          <Badge status="success" />{'已完成'}
        </span>
      );
    } else if (param.text === '2') {
      col = (
        <span className="dd_grid_icon">
          <Badge status="error" />{'下载失败'}
        </span>
      );
    } else if (param.text === '0') {
      col = (
        <span className="dd_grid_icon">
          <Badge status="processing" />{'下载中'}
        </span>
      );
    } else if (param.text === '3') {
      col = (
        <span className="dd_grid_icon">
          <Badge status="success" />{'下载成功无数据'}
        </span>
      )
    } else if (param.text === '-1') {
      col = (
        <span className="dd_grid_icon">
          <Badge status="default" />{'待下载'}
        </span>
      )
    } else if (param.text === '4') {
      col = (
        <span className="dd_grid_icon">
          <Badge status="processing" />{'自动关联单证执行中'}
        </span>
      )
    } else if (param.text === '5') {
      col = (
        <span className="dd_grid_icon">
          <Badge status="success" />{'自动关联单证成功'}
        </span>
      )
    }
    return col;
  },
  renderJdcxRwzxqk: (param: any) => {
    let text = param.text;
    if (text != null && text != '') {
      const mh = new RegExp("：", "g");
      const fh = new RegExp("；", "g");
      const dh = new RegExp("、", "g");
      const doh = new RegExp("，", "g");
      text = text.replace(mh, '：{br}');
      text = text.replace(fh, '；{br}');
      text = text.replace(doh, "，{br}");
      text = text.replace(dh, "，{br}");
      const arr: any = text.split('{br}');
      const tooltips: any = [];
      arr?.forEach((tip: any, index1: number) => {
        if (tip != '' || index1 < arr.length - 1) {
          tooltips.push(tip);
          if (index1 !== arr.length) {
            tooltips.push(<br key={index1.toString()} />);
          }
        }
      });
      return <Tooltip placement="topLeft" title={tooltips}>{param.text}</Tooltip>;
    } else {
      return '';
    }
  }
}

export default Func;