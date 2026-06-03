import React, { useState } from 'react';
import { Drawer, Form, Radio, Button, Divider } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import myUtil from '@/pages/common/myUtil';
import pro from '@/pages/common/proConfig';
import styles from './style.less';

const DDThemeSetting: React.FC = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [theme, setTheme] = useState<any>({
    radius: myUtil.localStore.getItem('theme')?.radius || 'theme_radius_4px',
    fontSize: myUtil.localStore.getItem('theme')?.fontSize || 'theme_font_size_14px',
    skin: myUtil.localStore.getItem('theme')?.skin || THEME_TYPE || pro.default_theme,
    gridBorder: myUtil.localStore.getItem('theme')?.gridBorder || false,
    formItemLayout: myUtil.localStore.getItem('theme')?.formItemLayout || 'inline',
    layoutScrollType: layoutScrollType ? layoutScrollType : myUtil.localStore.getItem('theme')?.layoutScrollType || 'bodyScroll',
  });

  const handleSkinSetting = () => {
    setModalVisible(true);
  };

  const onChange = (e: any, type: any) => {
    const value = e.target.value;
    const divRoot: any = document.querySelector("body");
    if (type === 'radius') {
      divRoot.classList.remove('theme_radius_4px', 'theme_radius_3px', 'theme_radius_0px');
    } else if (type === 'fontSize') {
      divRoot.classList.remove('theme_font_size_16px', 'theme_font_size_14px', 'theme_font_size_12px');
    } else if (type === 'skin') {
      divRoot.classList.remove('theme01', 'theme02', 'theme03', 'theme04', 'theme05', 'theme06', 'theme07', 'theme11', 'theme12');
    }
    if (value && type !== 'gridBorder') {
      divRoot.classList.add(value);
    }
    theme[type] = value;
    setTheme({...theme});
    myUtil.localStore.setItem('theme', theme);
  };

  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
  };

  const tailLayout = {
    wrapperCol: { offset: 5, span: 19 },
  };

  const handleReset = () => {
    const defaultTheme: any = {
      radius: 'theme_radius_4px',
      fontSize: 'theme_font_size_14px',
      skin: pro.default_theme,
      gridBorder: false,
      formItemLayout: 'inline',
      layoutScrollType: layoutScrollType ? layoutScrollType : 'bodyScroll',
    }
    setTheme(defaultTheme);
    myUtil.localStore.setItem('theme', defaultTheme);
    myUtil.theme.init();
  };

  return (
    <>
      <SettingOutlined onClick={handleSkinSetting} className={styles.icon}/>
      <Drawer
        title="主题设置"
        placement="right"
        onClose={() => setModalVisible(false)}
        visible={modalVisible}
        width={pro.c_modal_width_x2}
        destroyOnClose
      >
        <Form {...layout}>
          <Form.Item name="radius" label="圆角" >
            <Radio.Group onChange={(e) => onChange(e, 'radius')} defaultValue={theme.radius}>
              <Radio value='theme_radius_4px'>4px（默认）</Radio>
              <Radio value='theme_radius_3px'>3px</Radio>
              <Radio value='theme_radius_0px'>无</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="fontSize" label="字号" >
            <Radio.Group onChange={(e) => onChange(e, 'fontSize')} defaultValue={theme.fontSize}>
              <Radio value='theme_font_size_16px'>16px</Radio>
              <Radio value='theme_font_size_14px'>14px（默认）</Radio>
              <Radio value='theme_font_size_12px'>12px</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="skin" label="皮肤" >
            <Radio.Group onChange={(e) => onChange(e, 'skin')} defaultValue={theme.skin}>
              {/* <Radio value='theme01'>白</Radio> */}
              {/* <Radio value='theme02'>深蓝</Radio> */}
              <Radio value='theme03'>高亮</Radio>
              <Radio value='theme04'>墨蓝</Radio>
              <Radio value='theme07'>天蓝1</Radio>
              <Radio value='theme06'>天蓝2</Radio>
              <Radio value='theme11'>红黑</Radio>
              <Radio value='theme12'>白</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="gridBorder" label="列表边框" tooltip="刷新后生效" >
            <Radio.Group onChange={(e) => onChange(e, 'gridBorder')} defaultValue={theme.gridBorder}>
              <Radio value={false}>无（默认）</Radio>
              <Radio value={true}>有</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="formItemLayout" label="表单单元布局" tooltip="刷新后生效" >
            <Radio.Group onChange={(e) => onChange(e, 'formItemLayout')} defaultValue={theme.formItemLayout}>
              <Radio value="inline">横向（默认）</Radio>
              <Radio value="vertical">纵向</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="layoutScrollType" label="滚动条类型" tooltip="刷新后生效" >
            <Radio.Group onChange={(e) => onChange(e, 'layoutScrollType')} defaultValue={theme.layoutScrollType}>
              <Radio value="bodyScroll">浏览器滚动条（默认）</Radio>
              <Radio value="gridScroll">表格内滚动条</Radio>
            </Radio.Group>
          </Form.Item>
          <Divider />
          <Form.Item {...tailLayout}>
            <Button htmlType="button" onClick={handleReset}>恢复初始设置</Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};
export default DDThemeSetting;
