/**
 * title: 用户管理-绑定企业
 * author: wx
 */
import React, { useImperativeHandle, useState } from 'react';
import CONSTANTS from '@/components/DDAssist/constants';
import { Drawer, Spin, message, Button } from 'antd';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import config from '../api/config';
import { qyyg, relateApifwToQy } from '@/pages/hts/services/htsApi';
import ProCard from '@ant-design/pro-card';
import DDAlert from '@/pages/hts/components/DDAlert';
import { intl as intl2 } from '@/components/DDAssist/util';
import { cloneDeep } from 'lodash';



export interface BdjgProps {
  onRef?: any;
}

const DrawerForm: React.FC<BdjgProps> = ({
  onRef,
}) => {
  const [masker, setMasker] = useState(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [initParam, setInitParam] = useState<any>({});
  const [mainSelectionRowKeys, setMainSelectionRowKeys] = useState<any>({});
  const [yhConfig, setYhConfig] = useState<any>();

  const apiFunc: any = {
    unitRef: React.createRef(),
  };

  // 开启
  const showModal = (param: any, selectionRowKeys: any) => {

    const unitConfig = cloneDeep(config);

    // 配置项：自定义工具栏
    unitConfig.customer_toolbar = [
      { name: '保存', func: 'glApiFw' },
    ];
    unitConfig.pagination2 = false;
    unitConfig.gridParams = {
      initSearchModal: [
        { type: 1, property: "sbqyuuidDqlb", value: selectionRowKeys[0], op: "zdy" },
      ],
    }
    unitConfig.layout_type = 'modal';
    unitConfig.filter_items[3].defaultValue = 'Y';
    unitConfig.filter_items.push({label: '是否关联', name: 'glbz', type: 'Select', codeTable: 'code_static_yes_no:01'});
    setYhConfig(unitConfig);
    setMainSelectionRowKeys(selectionRowKeys);
    setInitParam(param);
    setModalVisible(true);
  };


  apiFunc.afterReload = (param: any) => {
    const { dataSource, unitRef } = param;
    const checkRow: any = [];
    const checkRowKey: any = [];
    if (dataSource && dataSource.length > 0) {
      dataSource.forEach((item: any) => {
        if (item.glbz == 'Y') {
          checkRow.push(item);
          checkRowKey.push(item.uuid);
        }
      });
    }
    unitRef.current?.setSelectionRowKeys(checkRowKey);  // 设置SelectionRows
    unitRef.current?.setSelectionRows(checkRow);  // 设置SelectionRows
  }

  const close = async () => {
    initParam?.unitRef.current?.reload2();
    setModalVisible(false);
  }

  apiFunc.glApiFw = async (param: any) => {
    const { selectionRowKeys, unitRef } = param;
    const searchModel = unitRef?.current?.getGridParams().searchModel;
    const data = {
      "apifwDms": selectionRowKeys,
      "sbqyuuidDqlb": mainSelectionRowKeys[0]
    };
    for (let i = 0; i < searchModel?.length; i++) {
      const property2 = searchModel[i].property;
      const value = searchModel[i].value;
      data[property2] = value;
    }
    setMasker(true);
    await relateApifwToQy(data).then((response: any) => {
      setMasker(false);
      if (response.code === '200') {
        message.success("保存成功！");
        close();
      } else {
        message.error(response.msg);
      }
    })
  }

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  return (
    <Drawer
      title="关联API服务"
      className='dd_data_page_modal'
      visible={modalVisible}
      width={CONSTANTS.C_MODAL_WIDTH_X4}
      destroyOnHidden={true}
      onClose={() => { close() }}
    // footer={<>
    //   <Button onClick={() => save()} type="primary" style={{ marginLeft: 1050 }}>关联API服务</Button>
    // </>}
    >

      <Spin tip="Loading..." spinning={masker} delay={100}>
        <ProCard split="vertical">
          <DDBunit2 config={yhConfig} func={apiFunc} />
        </ProCard>
      </Spin>
    </Drawer>
  );
};

export default DrawerForm;
