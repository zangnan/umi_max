// 出口发票开具-出口发票开具-税控票开具（new）
import React, { useState, useRef } from 'react';
import { Tabs, message } from 'antd';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import unitConfig from './zxkpConfig';
import func from './zxkpFunc';
import unitConfigDc from './dckpConfig';
import funcDc from './dckpFunc';
import myUtil from '@/components/DDAssist/util';
import { djcsjkptj, scjc, ddtjkp2 } from '@/pages/hts/services/htsApi';
import { intl as intl2 } from '@/components/DDAssist/util';
import DDAlert from '@/pages/hts/components/DDAlert';

const Index: React.FC = () => {

  const drmbkjInvoiceRef: any = useRef();
  const myConfig = { ...unitConfig };
  myConfig.layout_type = 'default';
  const temp = myUtil.code.getCode('CODE_CS_ZXSB_FPKJ_CSPZ:01'); // 发票配置的码表
  const tempCode = temp[0];

  // 配置项：自定义工具栏
  myConfig.customer_toolbar = [
    { name: '提交开票', func: 'handleTjkp' },
    { name: '发票撤回', func: 'handleFpch' },
  ];
  myConfig.gridParams = {
    initSearchModal: [
      { property: 'cxlx', value: "2", op: 'zdy' },
    ],
  }
  // 导出
  myConfig.export_key = 'CX_CKFPKJ_FPGL_ZXKP_SKPDKP_EXCEL';


  func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(drmbkjInvoiceRef);
    return otherRef;
  };

  // 提交开票（登录态验证）
  func.handleTjkp = (param: any) => {
    const { selectionRowKeys, refUnit, selectionRows, unit_key, gridRef } = param;
    const fpsqduuids: any = [];
    if (selectionRowKeys && selectionRowKeys.length > 0) {
      selectionRows.forEach((row: any) => {
        fpsqduuids.push(row.fpsqduuid);
      });
    }
    const gridData = refUnit.current?.getGridData()
    const searchModel = refUnit.current.getGridParams().searchModel || [];
    const headerSearchModel = gridRef.current?.getHeaderFilter() || [];
    const allSearchModel: any = searchModel.concat(headerSearchModel);
    if (gridData.length === 0) {
      message.info(intl2.formatMessage({ id: 'message_common_type_no_griddata' }));
      return;
    }
    const obj = {
      cxlx: "2",
      fpsqduuids: fpsqduuids,
    }
    allSearchModel.forEach(element => {
      obj[element.property] = element.value == undefined ? element.values : element.value;
    });

    const kptj = {
      cxtj: allSearchModel,
      fpsqduuids: fpsqduuids,
      cxlx:'2',
    };
    refUnit.current!.setMasker(true);
    djcsjkptj(kptj).then((res1: any) => {
      refUnit.current!.setMasker(false);
      if (res1.code != '200') {
        message.info(res1.msg);
        return;
      }
      DDAlert.open({
        title: '提交开票',
        info: '确定提交开票吗？',
        modalType: 'confirm',
        okText: '确定',
        content: [
          '批次号'+ res1.body.pch,
          '单据号' + res1.body.fpsqdzs + '张',
          '含税金额合计' + myUtil.text.formatNum(res1.body.kpje, '0,0.00') + '元',
          '不含税金额合计' + myUtil.text.formatNum(res1.body.kpjews, '0,0.00') + '元',
          '税额合计' + myUtil.text.formatNum(res1.body.sehj, '0,0.00') + '元'
        ],
        okCallbackFn: function () {
          refUnit.current!.setMasker(true);
          obj.pch = res1.body.pch;
          ddtjkp2(obj).then((res2: any) => {
            refUnit.current!.setMasker(false);
            if (res2.code === '200') {
              message.success(res2.msg);
              refUnit.current!.reload();
            } else {
              message.error(res2.msg);
            }
          });
        }
      });
    });
  }



  // // 上传检查
  // func.handleScjc = (param: any) => {
  //   const { selectionRowKeys, refUnit, selectionRows, unit_key, gridRef } = param;
  //   if (!selectionRowKeys || selectionRowKeys.length === 0) {
  //     message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
  //     return;
  //   }
  //   const fpsqduuids: any = [];
  //   if (selectionRowKeys && selectionRowKeys.length > 0) {
  //     selectionRows.forEach((row: any) => {
  //       fpsqduuids.push(row.fpsqduuid);
  //     });
  //   }
  //   refUnit.current!.setMasker(true);
  //   djcsjkptj({ fpsqduuids }).then((res1: any) => {
  //     refUnit.current!.setMasker(false);
  //     if (res1.code != '200') {
  //       message.info(res1.msg);
  //       return;
  //     }
  //     DDAlert.open({
  //       title: '确认上传检查',
  //       info: '确认继续上传检查吗？',
  //       modalType: 'confirm',
  //       okText: '确认',
  //       content: [
  //         '发票单据号' + res1.body.fpsqdzs + '张',
  //         '金额合计' + myUtil.text.formatNum(res1.body.kpje, '0,0.00') + '元',
  //         '税额合计' + myUtil.text.formatNum(res1.body.sehj, '0,0.00') + '元'
  //       ],
  //       okCallbackFn: function () {
  //         //调用上传检查
  //         scjc({ fpsqduuids, flag: "03" }).then((res: any) => {
  //           if (res.code != '200') {
  //             message.error(res.msg);
  //           } else {
  //             message.info('上传检查申请成功！');
  //           }
  //         });
  //       }
  //     });
  //   });
  // }

  // const tabCallback = (key: any) => {
  //   if (key === activeKey) {
  //     return;
  //   }
  //   if (key === 'dkpsj') {
  //     unitConfig.gridParams = {
  //       initSearchModal: [
  //         { property: 'cxlx', value: "5", op: 'zdy' },
  //       ],
  //     }
  //     // 导出
  //     unitConfig.export_key = 'CX_CKFPKJ_FPGL_ZXKP_SKPDKP_EXCEL';
  //   } else if (key === 'kkpsj') {
  //     // 配置项：自定义工具栏
  //     myConfig.customer_toolbar = [
  //       { name: '提交开票', func: 'handleTjkp' },
  //       { name: '发票撤回', func: 'handleFpch' },
  //     ];
  //     myConfig.gridParams = {
  //       initSearchModal: [
  //         { property: 'cxlx', value: "6", op: 'zdy' },
  //       ],
  //     }
  //     // 导出
  //     myConfig.export_key = 'CX_CKFPKJ_FPGL_ZXKP_SKPKKP_EXCEL';
  //   } else if (key === 'dclsj') {
  //     // 配置项：自定义工具栏
  //     myConfig.customer_toolbar = [
  //       { name: '上传检查', func: 'handleScjc' },
  //       { name: '发票撤回', func: 'handleFpch' },
  //     ];
  //     myConfig.gridParams = {
  //       initSearchModal: [
  //         { property: 'cxlx', value: "7", op: 'zdy' },
  //       ],
  //     }
  //     // 导出
  //     myConfig.export_key = 'CX_CKFPKJ_FPGL_ZXKP_SKPDCL_EXCEL';
  //   } else if (key === 'jczsj') {
  //     myConfig.gridParams = {
  //       initSearchModal: [
  //         { property: 'cxlx', value: "8", op: 'zdy' },
  //       ],
  //     }
  //     // 导出
  //     myConfig.export_key = 'CX_CKFPKJ_FPGL_ZXKP_SKPJCZ_EXCEL';
  //   }
  //   setMyzxConfig(myConfig)
  //   setActiveKey(key)
  // }

  if (tempCode && tempCode?.fpkjfsDm === '2') {
    return (
      <div>
        <DDBunit2 config={myConfig} func={func} />
        {/* <Tabs activeKey={activeKey} onChange={tabCallback} className="dd_layout_tabs dd_layout_tabs_bzgl">
          <Tabs.TabPane tab="待开票数据" key="dkpsj">
            <DDBunit2 config={myzxConfig} func={func} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="可开票数据" key="kkpsj">
            <DDBunit2 config={myzxConfig} func={func} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="待处理数据" key="dclsj">
            <DDBunit2 config={myzxConfig} func={func} />
            <DrmbkjInvoice onRef={drmbkjInvoiceRef} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="检查中数据" key="jczsj">
            <DDBunit2 config={myzxConfig} func={func} />
          </Tabs.TabPane>
        </Tabs> */}
      </div>
    );
  } else {
    return (
      <div>
        <DDBunit2 config={unitConfigDc} func={funcDc} />
      </div>
    )
  }
}

export default Index;