/**
 * title: 备案单证 - 单证备案 - 资料采集 - 单证信息弹窗
 */
import React, { useImperativeHandle, useState } from 'react';
import CONSTANTS from '@/components/DDAssist/constants';
import { Button, Drawer, message, Spin } from 'antd';
import Func from './dzxxFunc';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import dzxxConfig from './dzxxConfig';
import { badzDzbaZlcjGldzjk, badzDzbaZlcjJcgljk } from '@/pages/hts/services/htsApi';
import { intl as intl2 } from '@/components/DDAssist/util';
import DDAlert from '@/pages/hts/components/DDAlert';

export interface DzxxProps {
  onRef?: any;
}

const DrawerList: React.FC<DzxxProps> = ({
  onRef,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [myConfig, setMyconfig] = useState<any>(dzxxConfig);// 单证页面的config
  const [mainUnitRef, setMainUnitRef] = useState<any>();// 上个页面的列表信息
  const [myTitle, setMyTitle] = useState<any>('关联单证');// 打开的弹窗名称
  const [flag, setFlag] = useState<any>('gldz');// 打开的弹窗类型 gldz-关联单证；jcgl-解除关联
  const [dzxxSelectedRowKeys, setDzxxSelectedRowKeys] = useState<any>();// 单证信息页面选择的数据主键
  const [zlcjSelectedRowKeys, setZlcjSelectedRowKeys] = useState<any>();// 资料采集页面选择的数据主键

  const [masker, setMasker] = useState(false);  // 蒙版

  // 开启
  const showModal = (param: any, zunitRef: any, flag: any) => {
    let gridParams = {}
    setZlcjSelectedRowKeys(param.selectionRowKeys);
    const config = { ...myConfig };
    if (flag === 'jcgl') {
      config.unit_key = 'CX_BADZ_JCGL_ZXSB_BADZ_DZXX';
      config.page_id = 'CX_BADZ_JCGL_ZXSB_BADZ_DZXX';
      config.grid_row_key = 'badzuuid';
      gridParams = {
        initSearchModal: [
          { property: 'badzbgduuid', value: param.selectionRowKeys[0], op: 'dd' },
          { property: 'dlckhwzmbz', value: param.selectionRows[0]?.dlckhwzmbz, op: 'zdy' },
          { property: 'lcswsxDm', value: param.selectionRows[0]?.lcswsxDm, op: 'dd' },
        ],
      }
      setFlag('jcgl');
      setMyTitle('解除关联');
    } else {
      config.unit_key = 'CX_BADZ_GLDZ_ZXSB_BADZ_DZXX';
      config.page_id = 'CX_BADZ_GLDZ_ZXSB_BADZ_DZXX';
      gridParams = {
        initSearchModal: [
          { property: 'badzbgduuid', value: param.selectionRowKeys[0], op: 'dd' },
          { property: 'dlckhwzmbz', value: param.selectionRows[0]?.dlckhwzmbz, op: 'dd' },
          { property: 'lcswsxDm', value: param.selectionRows[0]?.lcswsxDm, op: 'dd' },
        ],
      }
      config.grid_row_key = 'badzuuid';
      setFlag('gldz');
      setMyTitle('关联单证');
    }
    config.gridParams = gridParams;
    setModalVisible(true);
    setMainUnitRef(zunitRef);
    setMyconfig(config);
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  // Func.afterReload = (param: any) => {
  //   const { selectedRowKeys, selectedRows } = param;
  //   setDzxxSelectedRowKeys(selectedRowKeys);
  // }
  // 单证信息页面选择事件
  Func.rowSelection = (param: any) => {
    // 选中的数据主键记录，方便后续进行关联或者取消关联操作
    const { selectedRowKeys } = param;
    setDzxxSelectedRowKeys(selectedRowKeys);
  }

  Func.afterReload = (param: any) => {
    setDzxxSelectedRowKeys('');
  }

  // 关联单证
  const badzDzbaZlcjGldz = () => {
    // 判断关联的单证信息是否为空
    if (!dzxxSelectedRowKeys || dzxxSelectedRowKeys.length === 0) {
      message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
      return;
    }
    // 备案单证 - 单证备案 - 资料采集 - 单证信息 - 关联单证接口
    setMasker(true);
    badzDzbaZlcjGldzjk({ badzbgduuid: zlcjSelectedRowKeys[0], badzuuids: dzxxSelectedRowKeys }).then((response) => {
      setMasker(false);
      if (response.code === '200') {
        message.success(intl2.formatMessage({ id: 'message_badz_dzba_zlcj_gldz_success' }));
        // 关闭右侧弹窗
        setModalVisible(false);
        // 清空选择的key，防止跟解除关联冲突
        setDzxxSelectedRowKeys('');
        mainUnitRef.current?.reload2();  // 刷新主页面列表数据
      } else {
        message.error(response.desc)
      }
    })
  }
  // 解除关联
  const badzDzbaZlcjJcgl = () => {
    // 判断关联的单证信息是否为空
    if (!dzxxSelectedRowKeys || dzxxSelectedRowKeys.length === 0) {
      message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
      return;
    }
    DDAlert.open({
      title: '解除关联',
      info: '确定要解除关联吗？',
      infoType: 'warning',
      modalType: 'confirm',
      closeStatus: false,
      okCallbackFn: function (thisObj: any) {
        thisObj.setState({ masker: true });
        // 备案单证 - 单证备案 - 资料采集 - 单证信息 - 解除关联接口
        badzDzbaZlcjJcgljk({ badzbgduuid: zlcjSelectedRowKeys[0], badzuuids: dzxxSelectedRowKeys }).then((response) => {
          DDAlert.close();
          if (response.code === '200') {
            message.success(intl2.formatMessage({ id: 'message_badz_dzba_zlcj_jcgl_success' }));
            setModalVisible(false);
            // 清空选择的key，防止跟关联单证冲突
            setDzxxSelectedRowKeys('');
            mainUnitRef.current?.reload2();  // 刷新主页面列表数据
          } else {
            message.error(response.desc)
          }
        })
      }
    });
  }

  return (
    <Drawer
      title={myTitle}
      visible={modalVisible}
      onClose={() => { setModalVisible(false) }}
      width={CONSTANTS.C_MODAL_WIDTH_X4}
      destroyOnHidden={true}
      mask={{ closable: false }}
      className="dd_data_page_modal"
      footer={<>
        <Button onClick={() => setModalVisible(false)} style={{ marginRight: '10px' }}>取消</Button>
        {flag === 'gldz' ?
          <Button onClick={() => badzDzbaZlcjGldz()} style={{ marginRight: '10px' }} type="primary">关联单证</Button> :
          <Button onClick={() => badzDzbaZlcjJcgl()} style={{ marginRight: '10px' }} type="primary">解除关联</Button>
        }
      </>}
      footerStyle={{ textAlign: 'right' }}
    >
      <Spin tip="Loading..." spinning={masker} delay={100}>
        <DDBunit2 config={myConfig} func={Func} />
      </Spin>
    </Drawer>
  );
};
export default DrawerList;
