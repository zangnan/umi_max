import React, { useState } from 'react';
import { Drawer, Form, Radio, Button, Divider, Space, theme } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import myUtil from '../DDAssist/util';
import CONSTANTS from '../DDAssist/constants';
// import { useAntdConfig, useAntdConfigSetter } from 'umi';
const { darkAlgorithm, defaultAlgorithm } = theme;
import theme_config_common, { theme_config } from '../DDAssist/constants/theme_config/theme_config_common';
import { history } from '@umijs/max';
import { merge } from 'lodash';
import { useKeyPress } from 'ahooks';

const DDThemeSetting: React.FC<any> = ({
  config,
}) => {
  // console.info('config~~~~~~~~~~~~~');
  // console.info(config);
  let setAntdConfig = config.setAntdConfig;
  let antdConfig: any = config.antdConfig;
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [theme, setTheme] = useState<any>({
    radius: myUtil.theme.getThemeItem('radius'),
    skin: myUtil.theme.getThemeItem('skin'),
    gridBorder: myUtil.theme.getThemeItem('gridBorder'),
    gridSize: myUtil.theme.getThemeItem('gridSize'),
    gridPaginationPagesize: myUtil.theme.getThemeItem('gridPaginationPagesize'),
    formItemLayout: myUtil.theme.getThemeItem('formItemLayout'),
    formItemLabelShow: myUtil.theme.getThemeItem('formItemLabelShow'),
    layout: myUtil.theme.getThemeItem('layout'),
    fixedHeader: myUtil.theme.getThemeItem('fixedHeader'),
    compact: myUtil.theme.getThemeItem('compact'),
    fontSize: myUtil.theme.getThemeItem('fontSize'),
  });

  // 打开设置弹窗
  const handleSkinSetting = () => {
    form.setFieldsValue(theme);
    setModalVisible(true);
  };

  // 表单布局
  const layout = {
    labelcol: { span: 5 },
    wrappercol: { span: 19 },
  };

  // 表单布局
  const tailLayout = {
    wrappercol: { offset: 5, span: 19 },
  };

  // 变更主题
  const changeTheme = () => {
    form.validateFields().then(values => {
      let { radius, skin, fontSize, compact } = values;
      let bb;
      if (skin.indexOf('customer_config_skin_') > -1) {
        let customerSkin = (myUtil.theme.getAllSkin()).find((tmp: any) => { return tmp.value === skin })
        bb = customerSkin.skin;
      } else {
        let skinIndex = skin.replace('skin', '');
        bb = theme_config[`theme_config_${skinIndex}`];
      }
      let borderRadius = Number(radius.replace('theme_radius_', '').replace('px', ''));
      let fontSizeNum = Number(fontSize.replace('theme_font_size_', '').replace('px', ''));
      let compact2 = JSON.parse(compact.replace('theme_compact_', ''));
      // 通用主题
      const commonTheme = theme_config_common({compact: compact2, borderRadius, fontSize: fontSizeNum});
      // 主题设置
      antdConfig.theme.algorithm = bb?.darkAlgorithm ? [darkAlgorithm] : [defaultAlgorithm];
      // antdConfig.theme.token = myUtil.text.cleanNulObject(merge(commonTheme.token, bb.token));
      // antdConfig.theme.components = { ...commonTheme.components, ...bb.components };
      antdConfig.theme.token = merge(bb.token, commonTheme.token);
      antdConfig.theme.components = merge(bb.components, commonTheme.components);
      setAntdConfig({
        ...antdConfig,
      });
      myUtil.localStore.setItem('theme', values);
      setTheme({
        ...theme,
        ...values
      });
      myUtil.theme.init();

      myUtil.theme.fixedStyle(bb);
    })
  }

  // 恢复初始设置
  const handleReset = () => {
    const defaultTheme: any = myUtil.theme.getDefaultTheme();
    setTheme(defaultTheme);
    form.setFieldsValue(defaultTheme);
    myUtil.localStore.setItem('theme', defaultTheme);
    changeTheme();
  };

  // 刷新
  const handleRefresh = () => {
    location.reload();
  };

  // 自定义皮肤
  const customerSkinSetting = () => {
    setModalVisible(false);
    if (ENV_TYPE === 'node') {
      history.push('/easy_dev_dc/sys/skin_setting');
    } else {
      history.push('/system/admin/cfgp/skin_setting');
    }
  };

  // 刷新码表
  // const codeTableRefresh = () => {
    // myUtil.code.updateCodeTableByKeys(['code_dm_yxbz', 'code_dm_def_yg', 'code_dm_org']);
    // myUtil.code.updateCodeTableAll(['code_dm_yxbz', 'code_dm_def_yg', 'code_dm_org']);
  // };

  // useKeyPress(['ctrl.alt.subtract', 'ctrl.alt.add'], (e, key) => {
  //   const keyCallbackMap: any = {
  //     'ctrl.alt.subtract': () => {},
  //     'ctrl.alt.add': () => {},
  //   };
  //   keyCallbackMap[key]();
  // });

  return (
    <>
      <SettingOutlined onClick={handleSkinSetting} />
      <Drawer
        title="主题设置"
        placement="right"
        onClose={() => setModalVisible(false)}
        open={modalVisible}
        size={CONSTANTS.C_MODAL_WIDTH_X2}
        destroyOnHidden
        mask={false}
      >
        <Form {...layout} form={form} >
          <Form.Item name="radius" label="圆角" >
            <Radio.Group onChange={() => changeTheme()}>
              <Radio value='theme_radius_4px'>4px（默认）</Radio>
              <Radio value='theme_radius_3px'>3px</Radio>
              <Radio value='theme_radius_0px'>无</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="skin" label="皮肤" tooltip="部分菜单效果刷新后生效">
            <Radio.Group onChange={() => changeTheme()} options={myUtil.theme.getAllSkin()}/>
          </Form.Item>
          <Form.Item name="gridBorder" label="列表边框">
            <Radio.Group onChange={() => changeTheme()}>
              <Radio value={true}>有（默认）</Radio>
              <Radio value={false}>无</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="gridSize" label="列表大小">
            <Radio.Group onChange={() => changeTheme()}>
              <Radio value='small'>小（默认）</Radio>
              <Radio value='middle'>中</Radio>
              <Radio value='large'>大</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="gridPaginationPagesize" label="列表默认显示条数" tooltip="刷新后生效">
            <Radio.Group onChange={() => changeTheme()}>
              <Radio value={10}>10</Radio>
              <Radio value={20}>20</Radio>
              <Radio value={50}>50</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="formItemLayout" label="表单单元布局" tooltip="刷新后生效">
            <Radio.Group onChange={() => changeTheme()}>
              <Radio value="vertical">纵向（默认）</Radio>
              <Radio value="horizontal">横向</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="formItemLabelShow" label="筛选标签显示">
            <Radio.Group onChange={() => changeTheme()}>
              <Radio value={true}>显示（默认）</Radio>
              <Radio value={false}>隐藏</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="layout" label="整体布局" tooltip="刷新后生效">
            <Radio.Group onChange={() => changeTheme()}>
              <Radio value="top">顶部菜单（默认）</Radio>
              <Radio value="side">侧边菜单</Radio>
              <Radio value="mix">混合菜单</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="fixedHeader" label="固定 Header" tooltip="刷新后生效">
            <Radio.Group onChange={() => changeTheme()}>
              <Radio value={true}>是（默认）</Radio>
              <Radio value={false}>否</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="compact" label="紧凑模式">
            <Radio.Group onChange={() => changeTheme()}>
              <Radio value='theme_compact_true'>是</Radio>
              <Radio value='theme_compact_false'>否（默认）</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="fontSize" label="字号" >
            <Radio.Group onChange={() => changeTheme()}>
              <Radio value='theme_font_size_16px'>16px</Radio>
              <Radio value='theme_font_size_14px'>14px（默认）</Radio>
              <Radio value='theme_font_size_12px'>12px</Radio>
            </Radio.Group>
          </Form.Item>
          <Divider />
          <Form.Item {...tailLayout}>
            <Space>
              {/* <Button htmlType="button" type="primary" onClick={handleSave}>保存</Button> */}
              <Button onClick={handleReset}>恢复初始设置</Button>
              <Button onClick={handleRefresh}>刷新</Button>
              <Button type='link' onClick={customerSkinSetting}>自定义皮肤</Button>
              {/* <Button onClick={codeTableRefresh}>刷新码表</Button> */}
            </Space>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};
export default DDThemeSetting;
