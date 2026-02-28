import React, { useImperativeHandle, useState } from 'react';
import { Button, Form, Modal, Space, Divider, Typography, Flex, message } from 'antd';
import DDBaseForm from '../DDForm/DDBaseForm';
import myUtil from '../DDAssist/util';
import CONSTANTS from '../DDAssist/constants';
import DDChartUtil from './DDChartUtil';
import formUtil from '../DDForm/formUtil';
import { Message } from '@icon-park/react';

const DDChartConfigForm: React.FC<any> = ({
  onRef,
  config,
  refGrid,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [chartPlan, setChartPlan] = useState<any>([]);
  const [chartConfigForm] = Form.useForm();
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const Func: any = {};

  // 开启
  const showModal = () => {
    if (!DDChartUtil.haveNumTypeField({config})) {
      message.info('没有用于统计的数值类型字段');
      return;
    }
    let tmpChartPlan = DDChartUtil.getChartPlanByKey({moduleKey: config.module_key});
    setChartPlan(tmpChartPlan);
    setModalVisible(true);
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  let paramShowTags: any = {
    planName: 'chart_plan',
    planKey: config.module_key,
    setTags: setChartPlan,
    tags: chartPlan,
    afterOnclick: (param: any) => {
      chartConfigForm.setFieldsValue({ ...param });
    },
    selectedTags,
    setSelectedTags,
  }

  // 表单事件：OnChange
  Func.eventOnChange = {
    changeChartType: (param: any) => {
      const { value, myItems, setMyItems, field } = param;
      let disabledKeyFlag = `disabledKey${field.key}`
      let modeKeyFlag = `modeKey${field.key}`
      if (value.target.value === 'column') {
        myItems[4].children[2][disabledKeyFlag] = false;    // 控制当前行
        myItems[4].children[3][disabledKeyFlag] = false;
        // myItems[4].children[2].disabled = false;         // 控制所有行
        // myItems[4].children[3].disabled = false;
      } else {
        myItems[4].children[2][disabledKeyFlag] = true;
        myItems[4].children[3][disabledKeyFlag] = true;
        // myItems[4].children[2].disabled = true;
        // myItems[4].children[3].disabled = true;
      }
      if (value.target.value === 'pie') {
        myItems[4].children[1][modeKeyFlag] = '';
        // myItems[4].children[1].mode = '';
      } else {
        myItems[4].children[1][modeKeyFlag] = 'multiple';
        // myItems[4].children[1].mode = 'multiple';
      }
      setMyItems([...formUtil.init({ items: myItems || [] })]);
    },
  }

  return <>
    <Modal
      title={'图表设置'}
      wrapClassName='standard-modal-1'
      width={CONSTANTS.C_MODAL_WIDTH_X4}
      open={modalVisible}
      okText="统计查询"
      cancelText="关闭"
      onCancel={() => setModalVisible(false)}
      mask={{ closable: false }}
      destroyOnHidden={true}
      footer={<Space>
        <Button type="default" onClick={() => DDChartUtil.showChartModal({chartConfigForm, config, refGrid, showJson: true})} >图表配置Json</Button>
        <Button type="primary" onClick={() => DDChartUtil.showChartModal({chartConfigForm, config, refGrid})} >图表绘制</Button>
        <Button type="primary" onClick={() => DDChartUtil.showChartModalFromPlan({chartConfigForm, config, refGrid, selectedTags, chartPlan, setChartPlan})} >图表绘制（方案）</Button>
        <Button type="default" onClick={() => DDChartUtil.saveChartConfig({chartConfigForm, config, refGrid, setChartPlan})} >存为方案</Button>
        <Button type="default" onClick={() => DDChartUtil.clearAllChartConfig({chartConfigForm, config, refGrid, setChartPlan})} >清空方案</Button>
        <Button onClick={() => setModalVisible(false)} type="default">关闭</Button>
      </Space>}
    >
      <div style={{position:'relative', padding: '0 300px 0 0'}}>
        <div>
          <div style={{display:'block'}}>
            <DDBaseForm config={DDChartUtil.getChartFormConfig({config})} form={chartConfigForm} initialValues={{}} func={Func}/>
          </div>
        </div>
        <div style={{position:'absolute', right: 0, top: 0, width: '300px', padding: '0 0 0 24px'}}>
          <Divider titlePlacement="left" styles={{ content: { margin: '0 0 0 -24px' } }}>
            <Typography.Title level={4}>我的方案</Typography.Title>
          </Divider>
          <Flex gap="12px 12px" wrap>
            { myUtil.pageNode.getTagsShow(paramShowTags) }
          </Flex>
        </div>
      </div>
    </Modal>
  </>;
};

export default DDChartConfigForm;