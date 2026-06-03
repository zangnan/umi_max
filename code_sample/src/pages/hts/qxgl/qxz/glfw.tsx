import React, { useImperativeHandle, useState } from 'react';
import { message, Spin, Drawer } from 'antd';
import pro from '@/pages/common/proConfig';
import '@/pages/hts/commonModule/style.less';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import { gldq,saveQxzGlfw } from '@/services/hts/api';


export interface DDTsort {
  onRef?: any;
  visible?: any;
}

const pbcd: React.FC<DDTsort> = ({ onRef, visible = false }) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [masker, setMasker] = useState<boolean>(false);
  const [rowKeys, setRowKeys] = useState([]);
  const [mainRef, setMainRef] = useState<any>({}); //主页面的ref
  const [qxzdms, setSxzdms] = useState<any>(''); 
  const [myConfig,setMyConfig]= useState<any>({}); 

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  const Func: any = {
    unitRef: React.createRef(),
  };

  // 开启
  const showModal = (param: any,selectionRowKeys:any) => {
    setSxzdms(selectionRowKeys[0]);
    setModalVisible(true);
    setMainRef(param);


    const unitConfig: any = {};

    unitConfig.unit_key = 'CX_SAAS_QXGL_QXZGLHDFW';                                         // 业务单元key，对应后端接口
    // api 列表查询
    unitConfig.grid_show_serial_number = false;                                           // 是否显示序号，可选
    unitConfig.click_checked = '1';                                                       // 是否开启单击或双击勾选事件，1单击勾选，2双击勾选，默认点击不勾选
    unitConfig.grid_scroll_x = '1100px';                                                   // 默认700px
    unitConfig.grid_row_key = 'fffwuuid';
    unitConfig.pagination2 = false;
    unitConfig.layout_type = 'modal';
    unitConfig.module_type = 'sjbb';
    unitConfig.gridParams = {
      initSearchModal: [
        {property: "qxzDm", value:selectionRowKeys[0], op: "zdy","type": 1},
      ],
    }
  
    unitConfig.grid_columns = [
      { title: '服务代码', dataIndex: 'fwDm', width: 140, align: 'left', ellipsis: true, fixed: 'left'},
      { title: '服务名称', dataIndex: 'fwmc', width: 200, align: 'left', ellipsis: true, },
      { title: 'bean名称', dataIndex: 'bm1', width: 200, align: 'left', ellipsis: true, },
      { title: '方法名称', dataIndex: 'ffm', width: 200, ellipsis: true, },
      { title: '备注', dataIndex: 'bz',  width: 200, ellipsis: true, },
    ];

    unitConfig.filter_items = [
      { name: 'fwmc', label: '服务名称', type: 'Input' },
      { name: 'ffm', label: '方法名称', type: 'Input'},
    ];

      // 配置项：自定义工具栏
      unitConfig.costomer_toobar = [
          { name: '保存', key: 'save', func: 'save' },
        ];

    setMyConfig(unitConfig);
  };
  
  const close = () =>{
    setModalVisible(false);
 
  }

  Func.afterReload = (param: any) => {
    const { dataSource, unitRef } = param;
    const checkRow: any = [];
    const checkRowKey: any = [];
    if (dataSource && dataSource.length > 0) {
      dataSource.forEach((item: any) => {
        if (item.glbz == 'Y') {
          checkRow.push(item);
          checkRowKey.push(item.fffwuuid);
        }
      });
    }
    unitRef.current?.setSelectionRowKeys(checkRowKey);  // 设置SelectionRows
    unitRef.current?.setSelectionRows(checkRow);  // 设置SelectionRows
  }


  Func.save= async (param: any) => {
    const { selectionRowKeys, } = param;
    const searchModel = param.unitRef.current.getGridParams().searchModel;
    const data = {
      "qxzDm": qxzdms,
      "fffwuuids": selectionRowKeys,
    };
    for(let i=0;i<searchModel.length;i++){
      const property2 = searchModel[i].property;
      const value = searchModel[i].value;
      data[property2] =  value;
    }
    await saveQxzGlfw(data).then((response: any) => {
      setMasker(false);
      if (response.code === '200') {
        // mainRef?.current?.reload2();
        message.success('保存成功！');
        close();
      } else {
        message.error(response.msg);
      }
    });
  }



  return (
    <>
      <Drawer
        title="关联服务"
        visible={modalVisible}
        onClose={() => { close() }}
        width={pro.c_modal_width_x4}
        destroyOnClose={true}
        className="dd_data_page_modal"
        maskClosable={false}
      >
        <Spin tip="Loading..." spinning={masker} delay={100}>
          <DDBunit2 config={myConfig} func={Func} />
        </Spin>
      </Drawer>
    </>
  );
}

export default pbcd;