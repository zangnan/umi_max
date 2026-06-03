import React, { useState, useEffect } from 'react';
import {
  Switch,
  Form,
  Space,
  Input,
  InputNumber,
  Radio,
  Button,
  message,
  Spin,
  Typography,
  Tooltip,
  Progress
} from 'antd';
import ProCard from '@ant-design/pro-card';
import myUtil from '@/pages/common/myUtil';
import style from './style.less';
import { QuestionCircleOutlined } from "@ant-design/icons/lib";
import { badzszjccx } from '@/services/hts/api';

const Jcsz: React.FC<{ data?: any }> = ({
  data,
}) => {
  const [body, setBody] = useState<any>();
  useEffect(() => {
    badzszjccx({}).then((response) => {
      const { body } = response;
      setBody(body);
      form.setFieldsValue({ smycsDm: body.smycsDm,bdgdlj: body.bdgdlj, slrqmrz: body.slrqmrz ,baqx:body.baqx });
      if(body.baqxqybz =='Y'){
        setCheck(true);
      }else{
        setCheck(false);
      }
    })
  }, []);
  const [form] = Form.useForm();

  //备案期限：申报数据受理后的天
  const [sbsjslr, setSbsjslr] = useState<any>(data?.baqx);
  const [flaggd, setFlaggd] = useState<any>(1);
  const [masker, setMasker] = useState(false);
  //高拍仪设置
  const [gpy, setGpy] = useState(true);
  //onChangeSwitch
  const [check, setCheck] = useState<any>(true);


  //开关值改变
  const onChangeSwitch = (e: any) => {
    setCheck(e);
  }
  //所属期值改变
  const onChangeSsq = (e: any) => {
    setSsqSzr(e);
  }
  //备案期限值改变
  const onChangeSlrq = (e: any) => {
    setSbsjslr(e);
  }

  //归档路径选择
  const radioChange = (e: any) => {
    setFlaggd(e.target.value);
  }

  // 表单布局
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };
  // // 表单布局
  const tailLayout = {
    wrapperCol: { offset: 4, span: 20 },
  };
  //高拍仪设置
  const gpysz = () => {
    if (gpy) {
      setGpy(false);
    } else {
      setGpy(true);
    }
  };

  // ftp测试链接
  const ftpCslj = () => {
    message.success('ftp链接成功');
  };

  // 云存储升级扩容
  const yccSjkr = () => {
    message.success('云存储升级扩容');
  };

  // 云存储文件备份
  const yccWjbf = () => {
    message.success('云存储文件备份');
  };

  // 云存储文件还原
  const yccWjhy = () => {
    message.success('云存储文件还原');
  };

  const calcParam = ['header', 'cardMargin', 'headerTab'];

  return (
    <Spin tip="Loading..." spinning={masker} delay={100}>
      <ProCard split="horizontal" className="dd_layout_form_01 dd_xsfpz_wraf">
        <ProCard style={{ height: myUtil.heightCalc.getCalc(calcParam), overflowY: 'auto' }}>
          <div className={style.groupTit}>
            <Space>
              <span>备案单证云备份</span>
              <Tooltip title="仅保留最后一次云备份文件记录"><QuestionCircleOutlined /></Tooltip>
            </Space>
          </div>
          <Form {...layout} form={form}  >
            <Form {...layout} form={form}  >
              <Form.Item label="云存储空间" name="ycckj">
                <div className={style.inputWidth}>
                  <Progress percent={50} status="active" />
                  <Space>
                    <span>800M/1024</span>
                    <Typography.Link onClick={yccSjkr} >
                      升级扩容
                    </Typography.Link>
                  </Space>
                </div>
              </Form.Item>
              <Form.Item label="最后一次云备份时间" name="yccbfsj">
                <Space>
                  <span>2021-01-25 20:12:59</span>
                  <Typography.Link onClick={yccWjbf} >
                    文件备份
                  </Typography.Link>
                </Space>
              </Form.Item>
              <Form.Item label="最后一次云还原时间" name="ycchysj">
                <Space>
                  <span>2021-01-27 13:30:33</span>
                  <Typography.Link onClick={yccWjhy} >
                    文件还原
                  </Typography.Link>
                </Space>
              </Form.Item>
            </Form>
          </Form>
        </ProCard>
      </ProCard>
    </Spin>
  );
};
export default Jcsz;
