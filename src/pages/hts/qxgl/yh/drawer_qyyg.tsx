/**
 * title: 用户管理-绑定企业
 * author: wx
 */
import React, { useImperativeHandle, useState } from 'react';
import CONSTANTS from '@/components/DDAssist/constants';
import { Drawer, Spin, message, Button } from 'antd';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import config from '../qy/config';
import config2 from '../yh/config';
import { qyyg } from '@/pages/hts/services/htsApi';
import ProCard from '@ant-design/pro-card';
import { cloneDeep } from 'lodash';
import DDAlert from '@/pages/hts/components/DDAlert';
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
  const [qyConfig, setQyConfig] = useState<any>();
  const [yhConfig, setYhConfig] = useState<any>();

  const qyFunc: any = {
    unitRef: React.createRef(),
  };

  const yhFunc: any = {
    unitRef: React.createRef(),
  };

  // 开启
  const showModal = (param: any, selectionRowKeys: any, flag: any) => {

    // 改变默认配置项
    const c = cloneDeep(config);
    c.api_grid_query = `/yw/dditSaas/qxqy/queryQyAdminPager`;
    c.pagination2 = false;
    c.grid_title = '企业列表';
    c.layout_type = 'modal';                                                     // 页面类型，默认default 可选 default modal tabs
    // 配置项：列表列
    c.grid_columns = [
      { title: '企业名称', dataIndex: 'nsrmcDqlb', width: 160, ellipsis: true },
      { title: '海关企业代码', dataIndex: 'hgqyDmDqlb', width: 120 },
      { title: '纳税人识别号', dataIndex: 'nsrsbhDqlb', width: 180, ellipsis: true },
      { title: '社会信用代码', dataIndex: 'shxydmDqlb', width: 180, ellipsis: true },
      { title: '企业类型', dataIndex: 'cktsqylxDmDqlb', width: 140, codeTable: 'code_dm_rd_cktsqylx:01' },
      { title: '所属地区', dataIndex: 'swname', width: 120, ellipsis: true },
      { title: '录入人', dataIndex: 'xm', width: 120, ellipsis: true },
      { title: '关联用户数', dataIndex: 'glyhs', width: 100, align: 'right' },
    ];
    // 配置项：列表筛选项
    c.filter_items = [
      { name: 'nsrmcDqlb', label: '企业名称', type: 'Input' },
      { name: 'hgqyDmDqlb', label: '海关企业代码', type: 'Input' },
      { name: 'nsrsbhDqlb', label: '纳税人识别号', type: 'Input' },
      { name: 'shxydmDqlb', label: '社会信用代码', type: 'Input' },
      { name: 'cktsqylxDmDqlb', label: '企业类型', type: 'Select', codeTable: 'code_dm_rd_cktsqylx:01' },
    ];


    c.gridParams = {
      initSearchModal: [
        { type: 1, property: "yhuuid1Dqlb", value: selectionRowKeys[0], op: "al" },
      ],
    }

    // 配置项：工具栏
    c.toolbar_default = {
      setting: true,
      full: true,
      reload: true,
    };
    // 配置项：自定义工具栏
    c.customer_toolbar = [
    ];
    // 配置项：工具栏
    c.toolbar_default = {

    };

    setQyConfig(c);

    const con = cloneDeep(config2);
    con.grid_title = '用户列表';
    // 配置项：列表列
    con.grid_columns = [
      { title: '登录账号', dataIndex: 'yddh', width: 140, ellipsis: true },
      { title: '姓名', dataIndex: 'xm', width: 140, ellipsis: true },
      { title: '证件号', dataIndex: 'sfzjhm', width: 140, ellipsis: true },
      { title: '用户类型', dataIndex: 'yhlxDm', width: 80, codeTable: 'code_dm_gy_yhlx:01' },
      { title: '角色名称', dataIndex: 'jsmc', ellipsis: true },
      { title: '用户来源', dataIndex: 'qdDm', width: 140, ellipsis: true, hidden: false , codeTable: 'CODE_QX_QD:01'},
      { title: '渠道名称', dataIndex: 'qdmc', width: 140, ellipsis: true, hidden: false },
      { title: '关联企业数', dataIndex: 'glqys', width: 100, align: 'right' },
    ];

    // 配置项：自定义工具栏
    con.customer_toolbar = [
    ];
    con.grid_selection_type = 'radio';
    con.pagination2 = false;
    con.layout_type = 'modal';                                                     // 页面类型，默认default 可选 default modal tabs
    con.toolbar_default = {

    };
    setYhConfig(con);

    setMainSelectionRowKeys(selectionRowKeys);
    setInitParam(param);
    setModalVisible(true);
  };


  const close = async () => {
    initParam?.unitRef.current?.reload2();
    setModalVisible(false);
  }

  const save = async () => {
    const yhuuids = yhFunc.unitRef.current.getSelectionRowKeys();
    const qyuuids = qyFunc.unitRef.current.getSelectionRowKeys();
    if (!yhuuids || yhuuids.length === 0) {
      message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
      return;
    }
    if (!qyuuids || qyuuids.length === 0) {
      message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
      return;
    }

    const textAreaValues: any = []
    qyFunc.unitRef.current.getSelectionRows().forEach((item: any) => {
      textAreaValues.push(<div>{item.nsrmcDqlb}</div>)
    })
    DDAlert.open({
      title: '确认移管',
      infoType: 'warning',
      modalType: 'info',
      info: `确定将以下企业移管至${yhFunc.unitRef.current.getSelectionRows()[0].yddh}用户吗？`,
      closeStatus: false,
      content: <div className="fpsqd_qrkp_bzcheck">
        {textAreaValues}
      </div>,
      okCallbackFn: async function () {
        const param = {
          yhuuid1Dqlb: yhuuids[0],
          sbqyuuids: qyuuids
        }
        setMasker(true);
        await qyyg(param).then((response: any) => {
          setMasker(false);
          if (response.code === '200') {
            close();
          } else {
            message.error(response.msg);
          }
        })
        DDAlert.close();
      },
    });




  }

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
      footer={<>
        <Button onClick={() => save()} type="primary" style={{ marginLeft: 1050 }}>确定移管</Button>
      </>}
    >

      <Spin tip="Loading..." spinning={masker} delay={100}>
        <ProCard split="vertical">
          <ProCard colSpan="580px">
            <DDBunit2 config={qyConfig} func={qyFunc} />
          </ProCard>
          <ProCard colSpan="580px">
            <DDBunit2 config={yhConfig} func={yhFunc} />
          </ProCard>
        </ProCard>
      </Spin>
    </Drawer>
  );
};

export default DrawerForm;
