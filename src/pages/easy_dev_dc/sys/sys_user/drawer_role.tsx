import React, { useImperativeHandle, useState } from 'react';
import CONSTANTS from '@/components/DDAssist/constants';
import { message, Drawer, Button, Space, Spin, Transfer } from 'antd';
import { setUserRoleNs, queryListNs } from '@/services/hts/apiNs';
import type { TransferProps } from 'antd';
import myUtil from '@/components/DDAssist/util';

export interface BdjgProps {
  onRef?: any;
}

const DrawerList: React.FC<BdjgProps> = ({
  onRef,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [userRecord, setUserRecord] = useState<any>({});
  const [parentParam, setParentParam] = useState<any>({});
  const [masker, setMasker] = useState<any>(false);
  const [dataSource, setDataSource] = useState<any>([]);
  const [targetKeys, setTargetKeys] = useState<TransferProps['targetKeys']>([]);
  const [selectedKeys, setSelectedKeys] = useState<TransferProps['targetKeys']>([]);

  // 开启
  const showModal = (param: any) => {
    let { role_id } = param?.record;
    setUserRecord(param?.record || {});
    setParentParam(param);
    queryListNs({page: 1, pageSize: 999999, searchModel: []}, 'm_sys_role').then((response: any) => {
      if (response?.code === '200' && response?.body?.rowCount > 0) {
        setDataSource(response?.body.rows);
        setTargetKeys(role_id?.split(',') || []);
      }
    });
    setModalVisible(true);
  };

  // 保存角色
  const saveRole = () => {
    let apiParam: any = {
      userIds: userRecord.user_id,
      roleIds: targetKeys,
    };
    setMasker(true);
    setUserRoleNs(apiParam).then((response: any) => {
      setMasker(false);
      const { code } = response;
      myUtil.modal.responseInfo(response);
      if (code === '200') {
        setModalVisible(false);
        parentParam.refGrid.current?.reload();
      }
    })
  }

  // onChange
  const onChange: TransferProps['onChange'] = (nextTargetKeys, direction, moveKeys) => {
    setTargetKeys(nextTargetKeys);
  };

  // onSelectChange
  const onSelectChange: TransferProps['onSelectChange'] = (
    sourceSelectedKeys,
    targetSelectedKeys,
  ) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  // useImperativeHandle
  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  return (
    <Drawer
      title={`${userRecord?.user_name || ''} 角色列表`}
      open={modalVisible}
      onClose={() => {setModalVisible(false)}}
      size={CONSTANTS.C_MODAL_WIDTH_X2}
      destroyOnHidden={true}
      className="dd_modal_bg"
      extra={<Space>
        <Button type='primary' onClick={saveRole}>保存</Button>
      </Space>}
    >
      <Spin description="Loading..." spinning={masker} delay={100}>
        <Transfer
          rowKey={(record: any) => record.role_id}
          dataSource={dataSource}
          styles={{
            section : {
              width: '50%',
              height: 400,
            },
          }}
          titles={['待选角色', '已选角色']}
          targetKeys={targetKeys}
          selectedKeys={selectedKeys}
          onChange={onChange}
          onSelectChange={onSelectChange}
          render={(item) => item.role_name}
        />
      </Spin>
    </Drawer>
  );
};

export default DrawerList;
