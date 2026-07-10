/**
 * title: 用户管理-绑定企业
 * author: wx
 */
import React, { useImperativeHandle, useState } from 'react';
import CONSTANTS from '@/components/DDAssist/constants';
import { Drawer, Spin, message, Button } from 'antd';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import config2 from './config';
import ProCard from '@ant-design/pro-card';
import { cloneDeep } from 'lodash';
import { retrieveQy } from '@/pages/hts/services/htsApi';
import { intl as intl2 } from '@/components/DDAssist/util';



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

  const yhFunc: any = {
    refUnit: React.createRef(),
  };

  // 开启
  const showModal = (param: any, selectionRowKeys: any) => {

    const unitConfig = cloneDeep(config2);
    unitConfig.api_grid_query = `/hx/ty/crud/queryPager`;
    unitConfig.grid_show_serial_number = false; // 是否显示序号，可选
    unitConfig.grid_row_key = 'sbqyuuidDqlb'; // 列表主键，默认uuid
    unitConfig.form_save_check = false; // 表单编辑是否执行后端校验
    unitConfig.click_checked = '1';
    unitConfig.grid_scroll_x = '1020px';
    unitConfig.module_key = 'CX_SAAS_QXGL_YSCQY';



    // 配置项：列表列
    unitConfig.grid_columns = [
      { title: '企业名称', dataIndex: 'nsrmcDqlb', width: 160, ellipsis: true },
      { title: '海关企业代码', dataIndex: 'hgqyDmDqlb', width: 120 },
      { title: '纳税人识别号', dataIndex: 'nsrsbhDqlb', width: 180, ellipsis: true },
      { title: '社会信用代码', dataIndex: 'shxydmDqlb', width: 180, ellipsis: true },
      { title: '企业类型', dataIndex: 'cktsqylxDmDqlb', width: 140, codeTable: 'code_dm_rd_cktsqylx:01' },
      { title: '所属地区', dataIndex: 'swname', width: 120, ellipsis: true },
      { title: '企业来源', dataIndex: 'qyly', width: 120, ellipsis: true },
      { title: '录入人', dataIndex: 'xm', width: 120, ellipsis: true },
    ];
    // 配置项：列表筛选项
    unitConfig.filter_items = [
      { name: 'nsrmcDqlb', label: '企业名称', type: 'Input' },
      { name: 'hgqyDmDqlb', label: '海关企业代码', type: 'Input' },
      { name: 'nsrsbhDqlb', label: '纳税人识别号', type: 'Input' },
      { name: 'shxydmDqlb', label: '社会信用代码', type: 'Input' },
      { name: 'cktsqylxDmDqlb', label: '企业类型', type: 'Select', codeTable: 'code_dm_rd_cktsqylx:01' },
    ];
    // 配置项：工具栏
    unitConfig.toolbar_default = {
      setting: true,
      full: true,
      reload: true,
      delete: false,
    };
    // 配置项：自定义工具栏
    unitConfig.customer_toolbar = [
      { name: '撤销删除', func: 'huif' },
    ];

    setYhConfig(unitConfig);
    setMainSelectionRowKeys(selectionRowKeys);
    setInitParam(param);
    setModalVisible(true);
  };


  const close = async () => {
    initParam?.refUnit.current?.reload();
    setModalVisible(false);
  }

  yhFunc.huif = async (param: any) => {
    const { selectionRowKeys } = param;
    // 选择数据条数判断
    if (!selectionRowKeys || selectionRowKeys.length === 0) {
      message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
      return;
    }
    const data = {
      "sbqyuuidDqlbs": selectionRowKeys,
    };
    setMasker(true);
    await retrieveQy(data).then((response: any) => {
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
      title="撤销删除"
      className='dd_data_page_modal'
      open={modalVisible}
      width={CONSTANTS.C_MODAL_WIDTH_X4}
      destroyOnHidden={true}
      onClose={() => { close() }}
    >

      <Spin tip="Loading..." spinning={masker} delay={100}>
        <ProCard split="vertical">
          <DDBunit2 config={yhConfig} func={yhFunc} />
        </ProCard>
      </Spin>
    </Drawer>
  );
};

export default DrawerForm;
