/**
 * title: 用户管理-绑定企业
 * author: wx
 */
import React, { useImperativeHandle, useState } from 'react';
import CONSTANTS from '@/components/DDAssist/constants';
import { Drawer, Form, Table, message } from 'antd';
import DDFilter from '@/components/DDForm/DDFilter';
import { qyyg, queryYhPagerTree } from '@/pages/hts/services/htsApi';
import ProCard from '@ant-design/pro-card';




export interface BdjgProps {
  onRef?: any;
}

const DrawerForm: React.FC<BdjgProps> = ({
  onRef,
}) => {
  const [formCommonFilter] = Form.useForm();
  const [masker, setMasker] = useState(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [initParam, setInitParam] = useState<any>({});
  const [mainSelectionRowKeys, setMainSelectionRowKeys] = useState<any>({});

  const [myFilterItems, setMyFilterItems] = useState([
    { name: 'nsrmcDqlb', label: '企业名称', type: 1 },
    { name: 'hgqyDmDqlb', label: '海关企业代码', type: 1},
  ]);
  const [data, setData] = useState<any>([]);

  // 开启
  const showModal = async (param: any, selectionRowKeys: any, flag: any) => {
    setMainSelectionRowKeys(selectionRowKeys);
    setInitParam(param);
    setModalVisible(true);
    await queryYhPagerTree({"yhuuid1Dqlb": param?.record?.yhuuid1}).then((response: any) => {
      setMasker(false);
      if (response.code === '200') {
        setData(response.body.rows);
      } else {
        message.error(response.msg);
      }
    })
  };


  const close = async () => {
    initParam?.unitRef.current?.reload2();
    setModalVisible(false);
  }

  const columns: any = [
    { title: '登录账号', dataIndex: 'yddh', width: 200, ellipsis: true },
    { title: '姓名', dataIndex: 'xm', width: 200, ellipsis: true },
    { title: '证件号', dataIndex: 'sfzjhm', width: 200, ellipsis: true },
    { title: '用户类型', dataIndex: 'yhlxmc', width: 200, },
    { title: '角色名称', dataIndex: 'jsmc',  width: 200,ellipsis: true },
  ];

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });



  return (
    <Drawer
      title="关联企业"
      className='dd_data_page_modal'
      open={modalVisible}
      width={CONSTANTS.C_MODAL_WIDTH_X4}
      destroyOnHidden={true}
      onClose={() => { close() }}
    >
      <ProCard className="dd-filter-wrap" >
      </ProCard>
      <Table
        pagination ={false}
        rowKey='yddh'
        columns={columns}
        dataSource={data}
      />
    </Drawer>
  );
};

export default DrawerForm;
