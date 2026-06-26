import React, { useImperativeHandle, useState,  } from 'react';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import { Modal, message, Form, } from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import myUtil from '@/components/DDAssist/util';
import { initScmx } from '@/pages/hts/services/htsApi';


export type PdrwProps = {
  children?: any;
  onRef?: any;
  modalVisible?:any;
  setModalVisible?:any;
}

const Tzpd: React.FC<PdrwProps> = ({
  children,
  onRef,
  setModalVisible,
  modalVisible,
}) => {
  const [myConfig, setMyconfig] = useState<any>();
  const [record,setRecord]= useState<any>();
  const [ywlxData, setYwlxData] = useState<any>([]);
  const [otherRef, setOtherRef] = useState<any>([]);
  const [hhcbhlxx, setHhcbhlxx] = useState<any>();
  const [hhcbhlsx, setHhcbhlsx] = useState<any>();

  //绑定组件
  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });


  // 开启页面，并设置参数
  const showModal = (param: any,otherRef:any,p:any) => {
    setHhcbhlxx(p.hhcbhlxx);
    setHhcbhlsx(p.hhcbhlsx);
    setRecord(param);
    setOtherRef(otherRef);
    const promiseArr: any = [myUtil.code.getCodeFromServerT1('code_dm_ckts_cktmsywlx:06')];
    Promise.all(promiseArr).then(() => {
    }).catch(() => {
      message.error('获取码表失败');
    }).finally(() => {
      const tmpCodeTable: any = myUtil.code.getSelectOption('code_dm_ckts_cktmsywlx', '06');
      setYwlxData(tmpCodeTable);
    });

    setModalVisible(true);
    const aConfig = { ...config };
    const pduuid = param.record?.pduuid;
    // 查看明细页面，只有待生成、生成失败 显示“生成明细”按钮
    if (param.record?.tzpdztDm === '04' || param.record?.tzpdztDm === '14') {
      aConfig.customer_toolbar = [
        { name: '生成明细', key: 'scmx', func: 'scmx' },
      ];
    }
    if (pduuid) {
      const gridParams = {
        initSearchModal: [
          { property: "pduuid", value: pduuid, op: "zdy" }
        ],
      }
      aConfig.gridParams = gridParams;
      setMyconfig(aConfig);
      setModalVisible(true);
    } else {
      message.error('查看明细打开失败')
    }
  };



  const config: any = {};
  config.unit_key = 'MTS_SJPP_CJPD_CKMX_QUERY_PAGE';                  // 业务单元key，对应后端接口
  config.page_id = 'MTS_SJPP_CJPD_CKMX_QUERY_PAGE';                                        // 页面id
  config.grid_row_key = 'uuid';
  config.grid_show_serial_number = false;                      // 工具栏左侧是否显示数据条数及选中数，默认true显示
  config.click_checked = '1';                                 // 是否开启单击或双击勾选事件，1单击勾选，2双击勾选，默认点击不勾选
  config.grid_selection_type = false;
  config.grid_show_data_num = false;
  config.layout_type = 'modal';
  config.export_key = 'MTS_SJPP_CJPD_CKMX_QUERY_PAGE_DC'; // 采集导出key
  config.module_type = 'QZ_type';

  config.filter_items = [
    { name: 'ckbgdh', label: '出口报关单号', type: 'Input' },
    { name: 'sdfphm', label: '数电票号码', type: 'Input' },
    { name: 'fphm', label: '发票号码', type: 'Input' },
    { name: 'ycsm', label: '异常说明', type: 'Input' },
    { name: 'ckfph', label: '出口发票号', type: 'Input' },
    { name: 'ckrq1', label: '出口日期', type: 'DatePicker', range: true, allowClear: true },




  ];
  // 配置项：工具栏
  config.toolbar_default = {
    setting: false,                    // 是否显示设置按钮，默认关闭
    full: false,                       // 是否显示全屏按钮，默认关闭
    reload: false,                     // 是否显示刷新按钮，默认关闭
    tssb_download: true, // 是否显示导出按钮，默认关闭
  };

  config.grid_columns = [
    {
      title: '配单结果', dataIndex: 'pdbz', width: 90, align: 'center', fixed: 'left',
      filter: {
        type: 'Radio',
        codeTable: 'CODE_STATIC_TZPD_PDJG_DM:01',
      }, render: { func: 'renderCkpdrwmxPdjg' }
    },
    {
      title: '换汇成本', dataIndex: 'hhcb', width: 90, align: 'center', render: { func: 'renderHhcb' },
      filter: {
        type: 'Select',
        codeTable: 'CODE_STATIC_TZPD_HHCB_DM:01',
      }
    },
    {
      title: '生成状态', dataIndex: 'scbzdc', width: 90,
      filter: {
        type: 'Select',
        codeTable: 'CODE_STATIC_TZPD_SCZT_DM:02',
      }
    },
    { title: '异常级别', dataIndex: 'pdsblxjbDm', align: 'center', width: 110,codeTable: 'CODE_STATIC_CJPD_YCJBLX_DM:01',
      filter: {
        type: 'Radio',
        codeTable: 'CODE_STATIC_CJPD_YCJBLX_DM:01',
      }
    },
    {
      title: '异常分类', dataIndex: 'pdsblxmc', width: 160, ellipsis: true
    },
    { title: '异常说明', dataIndex: 'ycsm', width: 160, ellipsis: true },
    { title: '是否为同一货源地', dataIndex: 'jnhydyjxfpxfszdyzbz', width: 130, codeTable: 'code_static_yes_no:01', filter: {
      type: 'Radio',
      codeTable: 'code_static_yes_no:01',
    }},
    { title: '出口报关单号', dataIndex: 'ckbgdh', width: 190, ellipsis: true },
    // { title: '项号', dataIndex: 'hwxh', width: 50, ellipsis: true },
    { title: '出口发票号', dataIndex: 'ckfph', width: 170, ellipsis: true },
    { title: '发票代码', dataIndex: 'fpDm', width: 100, ellipsis: true },
    { title: '发票号码', dataIndex: 'fphm', width: 120, ellipsis: true },
    { title: '数电票号码', dataIndex: 'sdfphm', width: 180, ellipsis: true },
    { title: '行号', dataIndex: 'hh', width: 50, ellipsis: true },
    { title: '合同协议号', dataIndex: 'ckhth', width: 160, ellipsis: true },
    { title: '出口日期', dataIndex: 'ckrq1', width: 100, ellipsis: true,  },
    { title: '海关商品代码', dataIndex: 'hgckspDm', width: 120, ellipsis: true },
    { title: '海关商品名称', dataIndex: 'hgspmc', width: 160, ellipsis: true },
    { title: '法定单位', dataIndex: 'hgjldwmc', width: 80, ellipsis: true },
    { title: '可用法定数量', dataIndex: 'kyCksl', width: 110, ellipsis: true, render: { type: 'number', format: '0,0.00000' }, align: 'right' },
    { title: '成交单位', dataIndex: 'sbjldwmc', width: 80, ellipsis: true },
    { title: '可用成交数量', dataIndex: 'kySbsl1', width: 110, ellipsis: true, render: { type: 'number', format: '0,0.00000' }, align: 'right' },
    { title: '可用美元离岸价', dataIndex: 'kyMylaj', width: 140, ellipsis: true, render: { type: 'number', format: '0,0.00' } },

  ];

  const Func: any = {
    unitRef: React.createRef(),
  };


  Func.scmx = async (params: any) => {
    otherRef[4].current?.showModal(record,params);
  }

  Func.columnsRender = {
    renderHhcb: (param: any) => {
      const record = param?.record;
      let hhcbColor: any;
      let hhcbRange: any;
      if(record.hhcb){
        if (record.hhcb > hhcbhlsx) {
          hhcbColor = '#f50'
          hhcbRange = '↑';
        } else if (record.hhcb <hhcbhlxx) {
          hhcbColor = '#87d068'
          hhcbRange = '↓';
        }
      }
      return <><span><div style={{ color: hhcbColor }}>{record.hhcb}{hhcbRange}</div></span></>

    },

    renderCkpdrwmxPdjg: (param: any) => {
      const pdbz = param?.record?.pdbz;
      let col: any = <></>;
      if (pdbz === 'Y') {
        return col = <span className="dd_grid_icon"><CheckOutlined /></span>;
      } else if (pdbz === 'N') {
        return col = <span className="dd_grid_icon"><CloseOutlined style={{ color: 'red' }} /></span>;
      }
      return col;
    }
  }

  const close =()=>{
    setModalVisible(false);
    record?.unitRef?.current?.reload2();

  }

  return (
    <>
      <Modal
        title="查看明细"
        destroyOnHidden={true}
        visible={modalVisible}
        width={CONSTANTS.C_MODAL_WIDTH_X4}
        wrapClassName="standard-modal-1"
        onCancel={() => close()}
        footer={(<>
        </>)}
      >
        <DDBunit2 config={myConfig} func={Func} />
      </Modal>
    </>
  );
};
export default Tzpd;
