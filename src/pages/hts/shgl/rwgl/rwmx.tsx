import React, { useImperativeHandle, useState,  } from 'react';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import { Drawer} from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';


export type ShrwMxProps = {
  children?: any;
  onRef?: any;

}

const ShrwMx: React.FC<ShrwMxProps> = ({
  children,
  onRef,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [myConfig, setMyconfig] = useState<any>();
  

  //绑定组件
  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });


  // 开启页面，并设置参数
  const showModal = (param: any) => {
    const rwuuid1 = param.record?.rwuuid1;
    const gridParams = {
      initSearchModal: [
        { property: "rwuuid1", value: rwuuid1, op: "zdy" }
      ],
    }
    config.gridParams = gridParams;
    setMyconfig(config);
    setModalVisible(true);
  };



  const config: any = {};
  config.unit_key = 'CX_SHGL_RWGL_MXLB';                  // 业务单元key，对应后端接口
  config.page_id = 'CX_SHGL_RWGL_MXLB_PAGE';                                        // 页面id
  config.grid_row_key = 'uuid';
  config.grid_show_serial_number = false;                      // 工具栏左侧是否显示数据条数及选中数，默认true显示
  config.click_checked = '1';                                 // 是否开启单击或双击勾选事件，1单击勾选，2双击勾选，默认点击不勾选
  config.grid_selection_type = false;
  config.grid_show_data_num = false;
  config.layout_type = 'modal';
  config.export_key = 'CX_SHGL_RWGL_MXLB_DC'; // 采集导出key
  config.module_type = 'QZ_type';

  config.filter_items = [
    { name: 'shpzh', label: '收汇凭证号', type: 'Input' },
  ];
  // 配置项：工具栏
  config.toolbar_default = {
    setting: false,                    // 是否显示设置按钮，默认关闭
    full: false,                       // 是否显示全屏按钮，默认关闭
    reload: true,                     // 是否显示刷新按钮，默认关闭
  };

  config.grid_columns = [
    {title: '收汇凭证号', dataIndex: 'shpzh', width: 160, ellipsis: true},
    {title: '匹配结果', dataIndex: 'cgbzmc', width: 100, ellipsis: true},
    {title: '任务执行情况', dataIndex: 'xxnr1', width: 180, ellipsis: true },
  ];


  const Func: any = {
    unitRef: React.createRef(),
  };

  return (
    <>
      <Drawer
        title="查看明细"
        visible={modalVisible}
        onClose={() => { setModalVisible(false) }}
        width={CONSTANTS.C_MODAL_WIDTH_X3}
        destroyOnHidden={true}
        className="dd_data_page_modal"
        mask={{ closable: false }}
      >
        <DDBunit2 config={myConfig} func={Func} />
      </Drawer>
    </>
  );
};
export default ShrwMx;
