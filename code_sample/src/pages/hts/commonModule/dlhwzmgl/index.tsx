// 代理货物证明管理
import React, { useRef }  from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import config from './config';
import Func from './f';
import Scmx from './modal_scmx';
import Fphq from '../zzszyfp/fphq/fphq';
import Dy from './dy';
import CheckCmcode from './sjjc/dlzm_check_cmcode';
import qxUtil from '@/pages/common/qxUtil';
import { useAccess } from 'umi';

const Index: React.FC = () => {
  const access = useAccess(); // 差异化
  // 单一窗口-------------------- 
  const paramDyck = {
    qxCode: 'stf_dyck',
    accessObj: access,
  }
  let myConfig = {...config};
  if(qxUtil.getQxz(paramDyck)) {
    // 单一窗口
    myConfig.unit_key = 'CX_SAAS_SJGL_STFYKJDLZMCX_DYCK';
    // pageid
    myConfig.page_id = 'stfykjdlckzm_dyck';
    // 导入key
    myConfig.import_key = 'SAAS_SJGL_STFYKJDLZM_DYCK_DR';
    // 导出key
    myConfig.export_key = 'SAAS_SJGL_STFYKJDLCKHWZM_DYCK_DC';
    // 导入模板下载
    myConfig.import_mb_key = 'SAAS_SJGL_STFYKJDLCKHWZM_DYCK_DC';

    // 配置列表列
    myConfig.grid_columns = [
      { title: '代理出口货物证明号码', dataIndex: 'dlckhwzmhm', width: 200, fixed: 'left', sorter: true },
      { title: '所属期', dataIndex: 'ssq', width: 90, sorter: true, hidden: true },
      { title: '申报批次', dataIndex: 'sbpc', width: 90, sorter: true, hidden: true },
      { title: '序号', dataIndex: 'sbxh', width: 80, sorter: true, hidden: true },
      { title: '编号', dataIndex: 'sbbh1', width: 100, sorter: true, hidden: true },
      { title: '项号', dataIndex: 'xh4', width: 60, sorter: true, hidden: true },
      { title: '委托方统一社会信用代码', dataIndex: 'wtfnsrsbh', width: 200, ellipsis: true },
      { title: '委托方纳税人名称', dataIndex: 'wtfnsrmc', width: 160, ellipsis: true },
      { title: '委托（代理）协议合同号', dataIndex: 'wtdlckhth', width: 180, ellipsis: true },
      { title: '出口货物报关单号', dataIndex: 'ckbgdh', width: 180, sorter: true, ellipsis: true },
      { title: '贸易方式', dataIndex: 'jgfsDm', width: 105 },
      { title: '贸易方式名称', dataIndex: 'jgfsmc', width: 120, ellipsis: true },
      { title: '出口日期', dataIndex: 'ckrq1', width: 130, sorter: true, render: { type: 'date', format: 'yyyy-MM-DD' }},
      { title: '出口商品代码', dataIndex: 'ckspDm', width: 120 },
      { title: '出口商品名称', dataIndex: 'ckspmc', align: 'left', width: 180, ellipsis: true},
      { title: '计量单位', dataIndex: 'hgjldwmc', width: 80, ellipsis: true },
      { title: '出口数量', dataIndex: 'cksl', width: 150, align: 'right', render: { type: 'number', format: '0,0.00000' } },
      { title: '成交币制', dataIndex: 'hbzmDm', width: 70 },
      { title: '成交币制名称', dataIndex: 'hbzmmc', width: 120, ellipsis: true },
      { title: '成交总价', dataIndex: 'cjzj', width: 145, align: 'right', render: { type: 'number', format: '0,0.00' } },
      { title: '原币金额', dataIndex: 'ybje', width: 145, align: 'right', render: { type: 'number', format: '0,0.00' }, hidden: false },
      { title: '美元离岸价', dataIndex: 'mylaj', width: 145, align: 'right', render: { type: 'number', format: '0,0.00' }},
      { title: '人民币离岸价', dataIndex: 'rmblaj', width: 145, align: 'right',render: { type: 'number', format: '0,0.00' } },
      { title: '备注', dataIndex: 'bz', width: 160, ellipsis: true },
    ];
    // 列表
    myConfig.grid_columns[1].hidden = false; // 所属期
    myConfig.grid_columns[2].hidden = false; // 申报批次
    myConfig.grid_columns[3].hidden = false; // 序号
    myConfig.grid_columns[4].hidden = false; // 编号
    myConfig.grid_columns[5].hidden = false; // 项号
    myConfig.grid_columns[20].hidden = true; // 原币金额

    // 筛选
    myConfig.filter_items = [
      { name: 'ssq', label: '所属期', type: 'Input'},
      { name: 'sbpc', label: '申报批次', type: 'Input'},
      { name: 'dlckhwzmhm', label: '代理出口货物证明号码', type: 'Input'},
      { name: 'ckbgdh', label: '出口货物报关单号', type: 'Input'},
      { name: 'wtfnsrmc', label: '委托方纳税人名称', type: 'Input'},
      { name: 'wtdlckhth', label: '委托（代理）协议合同号', type: 'Input'},
      { name: 'wtfnsrsbh', label: '委托方统一社会信用代码', type: 'Input'},
    ];

    // 配置项：工具栏
    myConfig.toolbar_default = {
      setting: true,
      full: true,
      reload: true,
      upload: true,                     // 是否显示导入按钮，默认关闭
      tssb_download: true,
    };
  } else {
    // 网报
    myConfig.unit_key = 'CX_SAAS_SJGL_STFYKJDLZMCX_WB';
    // pageid
    myConfig.page_id = 'stfykjdlckzm_wb';
    // 导出key
    myConfig.export_key = 'SAAS_SJGL_STFYKJDLCKHWZM_WB_DC';

    // 列表
    myConfig.grid_columns[1].hidden = true; // 所属期
    myConfig.grid_columns[2].hidden = true; // 申报批次
    myConfig.grid_columns[3].hidden = true; // 序号
    myConfig.grid_columns[4].hidden = true; // 编号
    myConfig.grid_columns[5].hidden = true; // 项号
    myConfig.grid_columns[20].hidden = false; // 原币金额

    // 配置项：筛选_普通筛选 页面最上方 第一层筛选
    myConfig.filter_items = [
      { name: 'dlckhwzmhm', label: '代理出口货物证明号码', type: 'Input'},
      { name: 'ckbgdh', label: '出口货物报关单号', type: 'Input'},
      { name: 'stfmc', label: '受托方纳税人名称', type: 'Input'},
      { name: 'wtdlckhth', label: '委托（代理）协议合同号', type: 'Input'},
      { name: 'stfnsrsbh', label: '受托方统一社会信用代码', type: 'Input'},
    ];

    // 配置项：工具栏
    myConfig.toolbar_default = {
      setting: true,
      full: true,
      reload: true,
      upload: false,                     // 是否显示导入按钮，默认关闭
      tssb_download: true,
    };
  }

  // 隐藏导入按钮
  const paramBtn= {
    btncode:'0204_001',
    accessObj: access,
  }
  if(qxUtil.getBtnQxz(paramBtn)){
    myConfig.toolbar_default = {
      setting: true,
      full: true,
      reload: true,
      upload: false,                     // 是否显示导入按钮，默认关闭
      tssb_download: true,
    };
  }

  const dlzmpdRef: any = useRef();
  const fphqRef: any = useRef();
  const checkCmcodeRef: any = useRef();
  const dy: any = useRef();

  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(dlzmpdRef);
    otherRef.push(fphqRef);
    otherRef.push(checkCmcodeRef);
    otherRef.push(Func);
    otherRef.push(dy);

    return otherRef;
  };

  return (
    <>
      <DDBunit2 config={myConfig} func={Func} />
      <Scmx onRef={dlzmpdRef} />
      <Fphq onRef={fphqRef} />
      <CheckCmcode onRef={checkCmcodeRef} />
      <Dy onRef={dy} />
    </>
  );
}

export default Index;
