/**
 * title: 退税汇率管理
 */
import React, { useState, useEffect } from 'react';
import { Form, Spin, message, Tabs, Modal } from 'antd';
import { queryDjdlInfo, saveDjdlInfo } from '@/pages/hts/services/htsApi';
import TabSfyz from './tab_sfyz';
import TabKprz from './tab_kprz';
import { history } from 'umi';
import CONSTANTS from '@/components/DDAssist/constants';

const Index: React.FC<{ data: any }> = ({
  data
}) => {
  const [masker, setMasker] = useState(false);
  const [form] = Form.useForm();
  const [activeKey, setActiveKey] = useState<string>('1'); // 当前活动tab
  const [flag, setFlag] = useState(false); // 是否可以来回切
  const [modalVisible, setModalVisible] = useState(false); // 是否可以来回切


  const loadMoreData = () => {
    const { query } = history.location;
    if ("2005" == query?.rtnCode) {
      setFlag(true);
      setActiveKey('2');
    }
    setMasker(true);
    setTimeout(function () {
      const inputEle1: any = document.querySelector("#dzswjdlpz01_mm");
      inputEle1?.removeAttribute('readonly');
    }, 500);
    queryDjdlInfo({}).then((response) => {
      const { code, desc, body } = response;
      setMasker(false);
      if (code === '200') {
        form.setFieldsValue(body);
      } else {
        message.error(desc);
      }
    });
  };

  useEffect(() => {
    loadMoreData();
  }, [data]);

  const tabCallback = (key: any) => {
    if (key === activeKey) {
      return;
    }
    if (key === '1') {
      setActiveKey(key)
    }
    if (key === '2' && flag) {
      setActiveKey(key)
    }
  }

  const gotoActiveKey = () => {
    setFlag(true)
    setActiveKey('2')
  }

  return (
    <Modal
      title='企业'
      open={modalVisible}
      wrapClassName='standard-modal'
      width={CONSTANTS.C_MODAL_WIDTH_X4}
      onCancel={() => setModalVisible(false)}
      mask={{ closable: false }}
    >
      <Spin tip="Loading..." spinning={masker} delay={100}>
        <Tabs activeKey={activeKey} onChange={tabCallback} className="dd_layout_tabs dd_layout_tabs_bzgl">
          <Tabs.TabPane tab="账号登录" key="1">
            <TabSfyz gotoActiveKey={gotoActiveKey} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="身份认证" key="2" disabled={!flag}>
            <TabKprz />
          </Tabs.TabPane>
        </Tabs>
      </Spin>
    </Modal>
  );
};

export default Index;
