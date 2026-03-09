import React, { useState, useEffect } from 'react';
import { Form, Button, Divider, theme, Typography, Flex, Card, Tag } from 'antd';
import myUtil from '../DDAssist/util';
import CONSTANTS from '../DDAssist/constants';
import { useAntdConfig, useAntdConfigSetter } from 'umi';
const { darkAlgorithm, defaultAlgorithm } = theme;
import theme_config_common from '../DDAssist/constants/theme_config/theme_config_common';
import DDBaseForm from '../DDForm/DDBaseForm';
import { FooterToolbar } from '@ant-design/pro-components';
import { itemType } from '../DDForm/data.d';
import { merge, set, get, cloneDeep } from 'lodash';

const SkinSettingCustomer: React.FC<any> = () => {
  const [tagPlan, setChartPlan] = useState<any>([]);
  const [formType, setFormType] = useState<any>('add');
  const [skinForm] = Form.useForm();
  // themeToken
  const { useToken } = theme;
  const { token }: any = useToken();
  const colorError: any = token?.colorError;
  const colorSuccess: any = token?.colorSuccess;
  const setAntdConfig = useAntdConfigSetter();
  const antdConfig: any = useAntdConfig();
  const skinFormFunc: any = {};

  // 表单配置
  let skinFormConfig = {
    form_layout_type: 4, // 表单整体一列或多列布局: horizontal vertical 2 3 4 6 8 12
    form_label_input_layout: 'vertical', // 标签与录入框排列方式: horizontal vertical
    form_items: [
      { label: 'ID', type: 'Hidden', name: 'tagId' },
      // 布局 - 内容区域
      { label: '布局 - 内容区域', type: 'GroupTitle', name: 'Layout' },
      { label: '暗色模式', type: 'Radio', eventOnChange: 'changeSkinItem', name: 'darkAlgorithm', defaultValue: false, list: [ { name: '是', value: true }, { name: '否', value: false } ] },
      { label: '背景色', type: 'ColorPicker', eventOnChange: 'changeSkinItem', name: ['layoutToken', 'bgLayout'] },
      // 布局 - 页头
      { label: '布局 - 页头', type: 'GroupTitle', name: 'LayoutHeader' },
      { label: '背景色', type: 'ColorPicker', eventOnChange: 'changeSkinItem', name: ['layoutToken', 'header', 'colorBgHeader'] },
      { label: '标题色', type: 'ColorPicker', eventOnChange: 'changeSkinItem', name: ['layoutToken', 'header', 'colorHeaderTitle'] },
      { label: '菜单色', type: 'ColorPicker', eventOnChange: 'changeSkinItem', name: ['layoutToken', 'header', 'colorTextMenu'] },
      { label: '菜单选中背景色', type: 'ColorPicker', eventOnChange: 'changeSkinItem', name: ['layoutToken', 'header', 'colorBgMenuItemSelected'] },
      { label: '菜单悬浮背景色', type: 'ColorPicker', eventOnChange: 'changeSkinItem', name: ['layoutToken', 'header', 'colorBgMenuItemHover'] },
      { label: '一级悬浮选中色', type: 'ColorPicker', eventOnChange: 'changeSkinItem', name: ['components', 'Menu', 'subMenuItemSelectedColor'] , tooltip: '子菜单选中时外层菜单字体色，同时影响左侧布局菜单' },
      { label: '二级菜单悬浮色', type: 'ColorPicker', eventOnChange: 'changeSkinItem', name: ['layoutToken', 'header', 'colorTextMenuActive'] },
      { label: '二级菜单选中色', type: 'ColorPicker', eventOnChange: 'changeSkinItem', name: ['layoutToken', 'header', 'colorTextMenuSelected'] },
      { label: '右侧菜单色', type: 'ColorPicker', eventOnChange: 'changeSkinItem', name: ['components', 'Layout', 'headerColor'] },
      // 布局 - 左侧
      { label: '布局 - 左侧', type: 'GroupTitle', name: 'LayoutSider' },
      { label: '背景色',type: 'ColorPicker', eventOnChange: 'changeSkinItem', name: ['layoutToken', 'sider', 'colorMenuBackground'] },
      { label: '标题色', type: 'ColorPicker', eventOnChange: 'changeSkinItem', name: ['layoutToken', 'sider', 'colorTextMenuTitle'] },
      { label: '菜单色', type: 'ColorPicker', eventOnChange: 'changeSkinItem', name: ['layoutToken', 'sider', 'colorTextMenu'] },
      { label: '菜单选中色', type: 'ColorPicker', eventOnChange: 'changeSkinItem', name: ['layoutToken', 'sider', 'colorTextMenuSelected'] },
      { label: '菜单选中背景色', type: 'ColorPicker', eventOnChange: 'changeSkinItem', name: ['layoutToken', 'sider', 'colorBgMenuItemSelected'] },
      // { label: '一级悬浮选中色', type: 'ColorPicker', eventOnChange: 'changeSkinItem', name: ['layoutToken', 'sider', 'colorTextMenuActive'] , tooltip: '子菜单选中时外层菜单字体色' },
      // { label: '一级悬浮选中色', type: 'ColorPicker', eventOnChange: 'changeSkinItem', name: ['components', 'Menu', 'subMenuItemSelectedColor'] , tooltip: '子菜单选中时外层菜单字体色' },
      { label: '菜单悬浮色', type: 'ColorPicker', eventOnChange: 'changeSkinItem', name: ['layoutToken', 'sider', 'colorTextMenuItemHover'] },
      { label: '菜单点击背景色', type: 'ColorPicker', eventOnChange: 'changeSkinItem', name: ['layoutToken', 'sider', 'colorBgMenuItemActive'] },
      { label: '菜单悬浮背景色', type: 'ColorPicker', eventOnChange: 'changeSkinItem', name: ['layoutToken', 'sider', 'colorBgMenuItemHover'] },
      { label: '分割线色', type: 'ColorPicker', eventOnChange: 'changeSkinItem', name: ['layoutToken', 'sider', 'colorMenuItemDivider'] },
      { label: '展开收起按钮背景颜', type: 'ColorPicker', eventOnChange: 'changeSkinItem', name: ['layoutToken', 'sider', 'colorBgCollapsedButton'] },
      { label: '展开收起按钮字体色', type: 'ColorPicker', eventOnChange: 'changeSkinItem', name: ['layoutToken', 'sider', 'colorTextCollapsedButton'] },
      { label: '展开收起按钮字体悬浮色', type: 'ColorPicker', eventOnChange: 'changeSkinItem', name: ['layoutToken', 'sider', 'colorTextCollapsedButtonHover'] },
      // SeedToken
      { label: '基础变量', type: 'GroupTitle', name: 'SeedToken', tooltip: 'Seed Token 意味着所有设计意图的起源。比如我们可以通过改变 colorPrimary 来改变主题色，antd 内部的算法会自动的根据 Seed Token 计算出对应的一系列颜色并应用。' },
      { label: '品牌色', type: 'ColorPicker', eventOnChange: 'changeSkinItem', name: ['token', 'colorPrimary'], tooltip: '品牌色是体现产品特性和传播理念最直观的视觉元素之一。在你完成品牌主色的选取之后，我们会自动帮你生成一套完整的色板，并赋予它们有效的设计语义。' },
      { label: '链接色', type: 'ColorPicker', eventOnChange: 'changeSkinItem', name: ['token', 'colorLink'], tooltip: '控制超链接的颜色。' },
      { label: '错误色', type: 'ColorPicker', eventOnChange: 'changeSkinItem', name: ['token', 'colorError'], tooltip: '用于表示操作失败的 Token 序列，如失败按钮、错误状态提示（Result）组件等。' },
      { label: '警戒色', type: 'ColorPicker', eventOnChange: 'changeSkinItem', name: ['token', 'colorWarning'], tooltip: '用于表示操作警告的 Token 序列，如 Notification、 Alert等警告类组件或 Input 输入类等组件会使用该组梯度变量。' },
      { label: '成功色', type: 'ColorPicker', eventOnChange: 'changeSkinItem', name: ['token', 'colorSuccess'], tooltip: '用于表示操作成功的 Token 序列，如 Result、Progress 等组件会使用该组梯度变量。' },
      { label: 'colorInfo', type: 'ColorPicker', eventOnChange: 'changeSkinItem', name: ['token', 'colorInfo'], tooltip: '用于表示操作信息的 Token 序列，如 Alert 、Tag、 Progress 等组件都有用到该组梯度变量。' },
      { label: 'colorBgBase', type: 'ColorPicker', eventOnChange: 'changeSkinItem', name: ['token', 'colorBgBase'], tooltip: '用于派生背景色梯度的基础变量，v5 中我们添加了一层背景色的派生算法可以产出梯度明确的背景色的梯度变量。但请不要在代码中直接使用该 Seed Token ！' },
      { label: 'colorLinkActive', type: 'ColorPicker', eventOnChange: 'changeSkinItem', name: ['token', 'colorLinkActive'], tooltip: '控制超链接被点击时的颜色。' },
      { label: 'colorLinkHover', type: 'ColorPicker', eventOnChange: 'changeSkinItem', name: ['token', 'colorLinkHover'], tooltip: '控制超链接悬浮时的颜色。' },
      { label: '梯度变量', type: 'GroupTitle', name: 'token', tooltip:  'Map Token 是基于 Seed 派生的梯度变量。定制 Map Token 推荐通过 theme.algorithm 来实现，这样可以保证 Map Token 之间的梯度关系。也可以通过 theme.token 覆盖，用于单独修改一些 map token 的值。' },
      { label: 'colorInfoText', type: 'ColorPicker', eventOnChange: 'changeSkinItem', name: ['token', 'colorInfoText'], tooltip: '信息色的文本默认态。' },
      { label: 'colorBorder', type: 'ColorPicker', eventOnChange: 'changeSkinItem', name: ['token', 'colorBorder'], tooltip: '默认使用的边框颜色, 用于分割不同的元素，例如：组件边框、表单的分割线、卡片的分割线等。' },
      { label: 'colorBorderSecondary', type: 'ColorPicker', eventOnChange: 'changeSkinItem', name: ['token', 'colorBorderSecondary'], tooltip: '比默认使用的边框色要浅一级，此颜色和 colorSplit 的颜色一致。使用的是实色。eg：列表边框、列表滚动条、阴影、卡片边框...' },
      { label: 'colorFillQuaternary', type: 'ColorPicker', eventOnChange: 'changeSkinItem', name: ['token', 'colorFillQuaternary'], tooltip: '最弱一级的填充色，适用于不易引起注意的色块，例如斑马纹、区分边界的色块等。eg：列表表头背景...' },
      { label: 'colorBgContainer', type: 'ColorPicker', eventOnChange: 'changeSkinItem', name: ['token', 'colorBgContainer'], tooltip: '组件的容器背景色，例如：默认按钮、输入框等。务必不要将其与 `colorBgElevated` 混淆。' },
      { label: 'colorBgElevated', type: 'ColorPicker', eventOnChange: 'changeSkinItem', name: ['token', 'colorBgElevated'], tooltip: '浮层容器背景色，在暗色模式下该 token 的色值会比 `colorBgContainer` 要亮一些。例如：模态框、弹出框、菜单等。' },
      { label: 'colorText', type: 'ColorPicker', eventOnChange: 'changeSkinItem', name: ['token', 'colorText'], tooltip: '最深的文本色。为了符合W3C标准，默认的文本颜色使用了该色，同时这个颜色也是最深的中性色。' },
      { label: 'cusBg1', type: 'ColorPicker', eventOnChange: 'changeSkinItem', name: ['token', 'cusBg1'], tooltip: '' },
      { label: '组件 Tag', type: 'GroupTitle', name: 'componentsTag' },
      { label: 'TagDefaultBg', type: 'ColorPicker', eventOnChange: 'changeSkinItem', name: ['components', 'Tag', 'defaultBg'], tooltip: '' },
      { label: 'TagColorBorder', type: 'ColorPicker', eventOnChange: 'changeSkinItem', name: ['components', 'Tag', 'colorBorder'], tooltip: '' },
      { label: 'TagColorInfoBg', type: 'ColorPicker', eventOnChange: 'changeSkinItem', name: ['components', 'Tag', 'colorInfoBg'], tooltip: '' },
      { label: 'TagColorInfoBorder', type: 'ColorPicker', eventOnChange: 'changeSkinItem', name: ['components', 'Tag', 'colorInfoBorder'], tooltip: '' },
      { label: 'TagColorWarning', type: 'ColorPicker', eventOnChange: 'changeSkinItem', name: ['components', 'Tag', 'colorWarning'], tooltip: '' },
      { label: 'TagColorWarningBorder', type: 'ColorPicker', eventOnChange: 'changeSkinItem', name: ['components', 'Tag', 'colorWarningBorder'], tooltip: '' },
      { label: 'TagColorSuccess', type: 'ColorPicker', eventOnChange: 'changeSkinItem', name: ['components', 'Tag', 'colorSuccess'], tooltip: '' },
      { label: 'TagColorSuccessBorder', type: 'ColorPicker', eventOnChange: 'changeSkinItem', name: ['components', 'Tag', 'colorSuccessBorder'], tooltip: '' },
      { label: 'TagColorError', type: 'ColorPicker', eventOnChange: 'changeSkinItem', name: ['components', 'Tag', 'colorError'], tooltip: '' },
      { label: 'TagColorErrorBorder', type: 'ColorPicker', eventOnChange: 'changeSkinItem', name: ['components', 'Tag', 'colorErrorBorder'], tooltip: '' },
      // 方案设置
      { label: '方案设置', type: 'GroupTitle', name: 'tagInfo' },
      { label: '方案标题', type: 'Input', name: 'tagName', layout: CONSTANTS.DEFAULT_FORM_LAYOUT_100P_ROW, rules: [ { type: 'base_required'} ] },
      { label: '方案备注', type: 'TextArea', name: 'tagRemark', autoSize: { minRows:3, maxRows: 3}, layout: CONSTANTS.DEFAULT_FORM_LAYOUT_100P_ROW, rules: [ { type: 'base_required'} ] },
    ],
  };

  // 页面初始化
  const init = () => {
    // 获取用户配置：皮肤
    let planTmp: any = myUtil.sys.getCustomerConfigByKey({customer_config_key: 'skin_plan'}) || {};
    planTmp = planTmp.all || [];
    setChartPlan([...planTmp]);
  };

  // 保存tag：1、设置Tag state 2、tag保存至用户表&更新sessionStroe
  const saveTag = ({tag}: any) => {
    // 1、设置Tag state
    setChartPlan([...tag]);
    // 2、tag保存至用户表&更新sessionStroe
    myUtil.sys.saveCustomerConfig({
      customer_config_key: 'skin_plan',
      customer_config_value: [...tag],
      showResponseInfo: true
    });
  }

  // 设置临时预览皮肤样式
  const viewSkinTmp = ({values, isOutLayout}: any) => {
    // console.log("🚀 ~ viewSkinTmp ~ values:", values)
    // Antd token
    let tokenCus: any = merge({
      token: {},
      components: {},
    }, values);
    // ColorPicker类型字段值转字符格式
    skinFormConfig.form_items.forEach((item: any) => {
      if (item.type === itemType.ColorPicker) {
        if (get(values, item.name) && typeof(get(values, item.name)) !== 'string') {
          // console.log("🚀 ~ viewSkinTmp ~ get(values, item.name):", item.name, get(values, item.name))
          set(tokenCus, item.name, (get(values, item.name)).toHexString());
        }
      }
    });
    // 补丁字段设置：cusBgLayout
    if (tokenCus?.layoutToken?.bgLayout) {
      set(tokenCus, ['token', 'cusBgLayout'], tokenCus.layoutToken.bgLayout);
    }
    // 补丁字段设置：header.colorHeaderTitle
    // if (tokenCus?.layoutToken?.header?.colorHeaderTitle) {
    //   set(tokenCus, ['components', 'Layout', 'headerColor'], tokenCus?.layoutToken?.header.colorHeaderTitle);
    // }
    // debugger;
    // 通用主题
    const compact = JSON.parse(myUtil.theme.getThemeItem('compact').replace('theme_compact_', ''));
    let fontSize = myUtil.theme.getThemeItem('fontSize');
    let radius = myUtil.theme.getThemeItem('radius');
    let fontSizeNum = Number(fontSize.replace('theme_font_size_', '').replace('px', ''));
    let borderRadius = Number(radius.replace('theme_radius_', '').replace('px', ''));
    let themeToken: any = theme_config_common({
      compact,
      fontSize: fontSizeNum,
      borderRadius: borderRadius,
    });
    // 主题配置设置
    antdConfig.theme.algorithm = values?.darkAlgorithm ? [darkAlgorithm] : [defaultAlgorithm];
    antdConfig.theme.token = myUtil.text.cleanNullObject(merge(themeToken.token, tokenCus.token));
    antdConfig.theme.components = myUtil.text.cleanNullObject(merge(themeToken.components, tokenCus.components));
    // 合并通用主题与自定义主题
    // let tokenAll = merge(themeToken, tokenCus.layoutToken);
    let tokenAll = merge(themeToken, tokenCus);
    // 如果不是外层布局，通过Antd方法setAntdConfig设置主题皮肤并预览
    if (!isOutLayout) {
      setAntdConfig({
        ...antdConfig,
      });
    }
    // 设置外层Layout主题皮肤并预览
    // console.log("🚀 ~ ", tokenAll)
    // debugger;
    myUtil.theme.fixedStyle(tokenAll);
    return tokenAll;
  }

  // 重置表单
  const skinFormReset = () => {
    skinForm.resetFields();
    init();
    const themeToken: any = myUtil.theme.getThemeToken();
    myUtil.theme.init();
    myUtil.theme.fixedStyle(themeToken);
  }

  // 设置临时预览皮肤样式
  const setViewSkin = (param: any) => {
    // 获取表单项
    let tmpItem: any = param?.item;
    // 是否外层布局变更
    let isOutLayout: any = false;
    if (Array.isArray(tmpItem?.name) && tmpItem?.name?.length > 1) {
      if (tmpItem.name[0] === 'layoutToken') {
        isOutLayout = true;
      }
    };
    let values: any = skinForm.getFieldsValue();
    viewSkinTmp({values, isOutLayout});
  }

  // 表单变更及保存
  const skinFormOnSave = (param: any) => {
    // 获取表单项
    let tmpItem: any = param?.item;
    // 是否保存表单
    const isSaveForm = param?.saveForm;
    // 是否外层布局变更
    let isOutLayout: any = false;
    if (Array.isArray(tmpItem?.name) && tmpItem?.name?.length > 1) {
      if (tmpItem.name[0] === 'layoutToken') {
        isOutLayout = true;
      }
    }
    skinForm.validateFields().then(async (values: any) => {
      // 设置临时预览皮肤样式
      let tokenAll: any = viewSkinTmp({values, isOutLayout});
      // 保存表单
      if (isSaveForm) {
        // 存为方案
        let cc: any = myUtil.sessionStore.getItem('customerConfig') || {};
        let skinPlan: any = cc.skin_plan || [];
        let newSkinPlan: any = {...tokenAll};
        newSkinPlan.tagName = values.tagName;
        newSkinPlan.tagRemark = values.tagRemark;
        if (!values.tagId) { // 新建
          newSkinPlan.tagId = myUtil.text.uuid();
          skinPlan.push(newSkinPlan);
          // 表单中补充新建时的主键
          skinForm.setFieldValue('tagId', newSkinPlan.tagId);
        } else { // 更新
          skinPlan?.forEach((eee: any, index: any) => {
            if (eee.tagId === values.tagId) {
              skinPlan[index] = {
                ...eee,
                ...newSkinPlan,
              }
            }
          })
        }
        saveTag({tag: skinPlan});
      }
    });
  };

  // 表单事件：OnChange
  skinFormFunc.eventOnChange = {
    changeSkinItem: (param: any) => {
      // skinFormOnSave(param);
      setViewSkin(param);
    },
  }

  // 绘制标签
  const getTagsShow = () => {
    const tagReactNode: any = [];
    let tagsTmp: any = tagPlan || [];
    const deleteTag = (item: any) => {
      let tmpPlanArr = cloneDeep(tagsTmp);
      tmpPlanArr = tmpPlanArr.filter((item2: any) => {
        return item.tagId !== item2.tagId;
      });
      saveTag({tag: tmpPlanArr});
    };
    tagsTmp?.forEach((item: any) => {
      let { tagName, onEdit } = item;
      let commonTagProp: any = {
        color: onEdit ? colorError : colorSuccess,
        style: { cursor: 'pointer', marginInlineEnd: '4px' },
        closeIcon: true,
        onClick: () => {
          let tmpPlanArr = cloneDeep(tagsTmp);
          tmpPlanArr.forEach((item2: any) => {
            item2.onEdit = false;
            if (item2.tagId === item.tagId) {
              // 标签置为活动态
              item2.onEdit = !item2.onEdit;
              // 设置表单值
              skinForm.setFieldsValue({ ...item2 });
              // 设置临时预览皮肤样式
              viewSkinTmp({values: item});
              // 设置表单类型
              setFormType('edit');
            }
          });
          setChartPlan([...tmpPlanArr]);
        },
        onClose: (e: any) => {
          e.preventDefault();
          deleteTag(item);
        },
      }
      tagReactNode.push(<Tag { ...commonTagProp } key={item.tagId}>{tagName}</Tag>);
    });
    return tagReactNode;
  }

  useEffect(() => {
    init();
  }, []);

  return <>
    <div style={{position:'relative', padding: '0 200px 0 0'}}>
      <Card title={formType === 'add' ? '新建皮肤' : '编辑皮肤'}>
        <div style={{display:'block'}}>
          <DDBaseForm config={skinFormConfig} form={skinForm} initialValues={{}} func={skinFormFunc}/>
        </div>
      </Card>
      <div style={{position:'absolute', right: 0, top: 0, width: '200px', padding: '0 0 0 24px'}}>
        <Divider titlePlacement="left" styles={{ content: { margin: '0 0 0 -24px' } }}>
          <Typography.Title level={4}>我的方案</Typography.Title>
        </Divider>
        <Flex gap="12px 12px" wrap>{ getTagsShow() }</Flex>
      </div>
    </div>
    <FooterToolbar >
      <Button type='default' onClick={() => {skinFormReset()}}>重置新建表单</Button>
      <Button type='primary' onClick={() => {skinFormOnSave({saveForm: true})}}>保存</Button>
    </FooterToolbar>
  </>;
};

export default SkinSettingCustomer;