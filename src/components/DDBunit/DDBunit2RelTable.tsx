import React, { useImperativeHandle, useState } from 'react';
import CONSTANTS from '../DDAssist/constants';
import { Drawer, Space, Button, Transfer, Spin, message } from 'antd';
import type { TransferProps } from 'antd';
import { queryList, saveOrUpdate, batchDelete } from '@/services/hts/api';

export interface DDBunit2RelTableProps {
  onRef?: any;
}

const DDBunit2RelTable: React.FC<DDBunit2RelTableProps> = ({
  onRef,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [parentRecord, setParentRecord] = useState<any>({});
  const [initParam, setInitParam] = useState<any>();
  const [masker, setMasker] = useState<any>(false);
  const [dataSource, setDataSource] = useState<any>([]);
  const [targetKeys, setTargetKeys] = useState<any>([]);
  const [selectedKeys, setSelectedKeys] = useState<any>([]);
  const [initRelRecord, setInitRelRecord] = useState<any>([]);

  // 开启
  const showModal = (param: any) => {
    console.info(param);
    let sonConfig: any = param?.sonConfig;
    let sonModuleName: any = sonConfig?.module_key;
    let sonGridRowKey: any = sonConfig?.grid_row_key;
    setParentRecord(param?.record || {});
    queryList({page: 1, pageSize: 999999, searchModel: []}, sonModuleName).then((response: any) => {
      if (response?.code === '200' && response?.body?.rowCount > 0) {
        setDataSource(response?.body.rows);
        let tmpTargetKeys = param?.record[sonGridRowKey]?.split(',') || [];
        setTargetKeys(tmpTargetKeys);
        if (param.sonConfig2) {
          let tmpKeyField: any = param?.sonConfig2?.grid_columns?.find((item0: any) => { return item0.dataIndex === param.rowKey });
          let sonModuleName2: any = param?.sonConfig2?.module_key;
          let searchModelObj: any = {
            op: 'eq',
            property: param.rowKey,
            type: 4,
            value: param.record[param.rowKey],
            ...tmpKeyField,
            // ...param?.keyField,
          };
          return queryList({page: 1, pageSize: 999999, searchModel: [
            searchModelObj
          ]}, sonModuleName2);
        }
      }
    }).then((response2: any) => {
      if (response2?.code === '200') {
        let tmpObjs: any = response2?.body?.rows || [];
        setInitRelRecord(tmpObjs);
        let tmpIds: any = [];
        tmpObjs.forEach((item: any) => {
          if (item[sonGridRowKey]) {
            tmpIds.push(item[sonGridRowKey]);
          }
        })
        setTargetKeys(tmpIds);
      }
    });
    setModalVisible(true);
    setInitParam(param);
  };

  // handleChange
  const handleChange: TransferProps['onChange'] = (newTargetKeys) => {
    setTargetKeys(newTargetKeys);
  };

  // handleSelectChange
  const handleSelectChange: TransferProps['onSelectChange'] = (
    sourceSelectedKeys,
    targetSelectedKeys,
  ) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  // 保存角色
  const saveRole = async () => {
    console.info(parentRecord, initParam);
    let formParam: any = {};
    setMasker(true);
    if (initParam?.sonConfig2) {
      // 关联关系在第三张表
      let delParam: any = {};
      delParam.key = initParam?.sonConfig2.module_key;
      let delUuids = [];
      for (let i = 0; i < initRelRecord.length; i++) {
        delUuids.push(initRelRecord[i].uuid);
      }
      formParam.key = initParam?.sonConfig2.module_key;
      let promiseArr: any = [];
      if (delUuids?.length > 0) {
        delParam.uuids = delUuids;
        let promiseDel: any = batchDelete(delParam); // 先删除后增加
        promiseArr.push(promiseDel);
      }
      // add
      // debugger;
      formParam[initParam.rowKey] = parentRecord[initParam.rowKey];
      // formParam[initParam.dataIndex] = (targetKeys || []).join(',');
      // formParam.key = initParam.param.unitKey;
      if (ENV_TYPE === 'node') {
        formParam.formType = 'add';
      }
      for (let i = 0; i < targetKeys.length; i++) {
        formParam[initParam.rowKey] = parentRecord[initParam.rowKey];
        formParam[initParam.sonConfig.grid_row_key] = targetKeys[i];
        let promiseTmp: any = saveOrUpdate(formParam); // 先删除后增加
        promiseArr.push(promiseTmp);
      }
      Promise.all(promiseArr)
        .then(() => {})
        .catch(() => { message.error('失败'); })
        .finally(() => {
          setMasker(false);
          message.info('成功');
          setModalVisible(false);
          initParam?.param?.refGrid?.current?.reload();
        });
    } else {
      // 关联关系在主表
      formParam[initParam.rowKey] = parentRecord[initParam.rowKey];
      formParam[initParam.dataIndex] = (targetKeys || []).join(',');
      formParam.key = initParam.param.unitKey;
      if (ENV_TYPE === 'node') {
        formParam.formType = 'edit';
      }
      saveOrUpdate(formParam).then((response: any) => {
        setMasker(false);
        const { code } = response;
        if (code === '200') {
          message.info('成功');
          setModalVisible(false);
          initParam?.param?.refGrid?.current?.reload();
        }
      })
    }
  }

  return (
    <Drawer
      title={`${initParam?.modalTitle || ''}`}
      open={modalVisible}
      onClose={() => {setModalVisible(false)}}
      size={CONSTANTS.C_MODAL_WIDTH_X2}
      destroyOnHidden={true}
      className="dd_modal_bg"
      extra={<Space>
        <Button type='primary' onClick={saveRole}>保存</Button>
      </Space>}
    >
      <Spin tip="Loading..." spinning={masker} delay={100}>
        <Transfer
          dataSource={dataSource}
          listStyle={{ width: '50%', height: 400 }}
          titles={['待选', '已选']}
          targetKeys={targetKeys}
          selectedKeys={selectedKeys}
          rowKey={(record: any) => record[initParam.sonConfig?.grid_row_key]}
          onChange={handleChange}
          onSelectChange={handleSelectChange}
          render={(item: any) => item[initParam?.titleDataIndex]}
        />
      </Spin>
    </Drawer>
  );
};

export default DDBunit2RelTable;
