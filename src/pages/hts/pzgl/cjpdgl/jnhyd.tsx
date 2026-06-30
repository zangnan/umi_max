/**
 * 发票开具配置  基础开票配置
 */
import React, { useRef, useState, useEffect } from 'react';
import { Form, Input, message, Switch, Select, DatePicker, Spin, } from 'antd';
import './style.less';
import myUtil from '@/components/DDAssist/util';
import {jnhydSaveOrUpdate, jnhydDel, getJnhydsj } from '@/pages/hts/services/htsApi';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import DDAlert from '@/pages/hts/components/DDAlert';
import { intl as intl2 } from '@/components/DDAssist/util';
import Func from './f';

const Index: React.FC<{ data?: any, funcRef?: any }> = ({
  data,
  funcRef
}) => {
  const myConfig: any = {};

  const [xzqh, setXzqh] = useState<any>([]); // 蒙板
  const [masker, setMasker] = useState<any>(false); // 蒙板


  useEffect(() => {
    Promise.all([myUtil.code.getCodeFromServerT1('code_dm_gy_xzqh:01')]).then(() => {
    }).catch(() => {
      message.error('获取码表失败');
    }).finally(() => {
      setXzqh(myUtil.code.getCode('code_dm_gy_xzqh:01'));
    });
  }, []);



  Func.sjtq = (param: any) => {
    const {unitRef} = param;
    DDAlert.open({
      title: '数据提取',
      infoType: 'info',
      isFormContent: true,
      modalType: 'form',
      closeStatus: false,
      content:
        <Form.Item name="sjtqfw" label="数据提取范围" rules={[{ required: true, message: '该项为必录' }]} >
          <Input placeholder="请输入年度或6位所属期" />
        </Form.Item>,
      okCallbackFn: function (thisObj: any) {
        DDAlert.getForms().validateFields().then((values: any) => {
          const param = {};
          if(values?.sjtqfw?.length == 4){
            param.cknd = values?.sjtqfw;
          }else{
            param.ckny = values?.sjtqfw;
          }
          thisObj.setState({ masker: true });
          getJnhydsj(param).then((res2: any) => {
            thisObj.setState({ masker: false });
            if (res2.code === '200') {
              unitRef?.current?.reload2();
              message.success(res2.body);
              DDAlert.close();
            } else {
              message.error(res2.msg);
            }
          });
        });
      },
    });

  }
  Func.add = (param: any) => {
    const {unitRef} =param;
    DDAlert.open({
      title: '新建',
      infoType: 'info',
      isFormContent: true,
      modalType: 'form',
      closeStatus: false,
      content:
        <>
          <Form.Item name="jnhydsjxzqhszDm" labelCol={{ span: 10 }} wrapperCol={{ span: 12 }} label="境内货源地省份" rules={[{ required: true, message: '该项为必录' }]} >
            <Select placeholder="请选择" showSearch={true} optionFilterProp="label">
              {xzqh.map((item: any) => (
                <Select.Option key={item.code} value={item.code} label={item.name}>{item.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="xhfsjxzqhszDm" labelCol={{ span: 10 }} wrapperCol={{ span: 12 }} label="进项发票销货方地省份" rules={[{ required: true, message: '该项为必录' }]} >
            <Select placeholder="请选择" showSearch={true} optionFilterProp="label">
              {xzqh.map((item: any) => (
                <Select.Option key={item.code} value={item.code} label={item.name} >{item.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </>,
      okCallbackFn: function (thisObj: any) {
        DDAlert.getForms().validateFields().then((values: any) => {
          thisObj.setState({ masker: true });
          jnhydSaveOrUpdate({...values,'bz':'add'}).then((res2: any) => {
            thisObj.setState({ masker: false });
            if (res2.code === '200') {
              message.success('保存成功！');
              DDAlert.close();
              unitRef.current!.reload2();
            } else {
              message.error(res2.msg);
            }
          });
        });
      },
    });

  }

  Func.edit = (param: any) => {
    const {unitRef,selectionRows,selectionRowKeys} =param;
    if (!selectionRowKeys || selectionRowKeys.length === 0) {
      message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
      return;
    }else if (selectionRowKeys.length > 1) {
      message.info(intl2.formatMessage({ id: 'message_one_selected' }));
      return;
    } else{
      DDAlert.open({
        title: '修改',
        infoType: 'info',
        isFormContent: true,
        modalType: 'form',
        closeStatus: false,
        content:
          <>
            <Form.Item name="jnhydsjxzqhszDm" initialValue={selectionRows[0]?.jnhydsjxzqhszDm} labelCol={{ span: 10 }} wrapperCol={{ span: 12 }} label="境内货源地省份" rules={[{ required: true, message: '该项为必录' }]} >
              <Select placeholder="请选择" showSearch={true} optionFilterProp="label">
                {xzqh.map((item: any) => (
                  <Select.Option key={item.code} value={item.code} label={item.name}>{item.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="xhfsjxzqhszDm" initialValue={selectionRows[0]?.xhfsjxzqhszDm} labelCol={{ span: 10 }} wrapperCol={{ span: 12 }} label="进项发票销货方地区省份" rules={[{ required: true, message: '该项为必录' }]} >
              <Select placeholder="请选择" showSearch={true} optionFilterProp="label">
                {xzqh.map((item: any) => (
                  <Select.Option key={item.code} value={item.code} label={item.name}>{item.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </>,
        okCallbackFn: function (thisObj: any) {
          DDAlert.getForms().validateFields().then((values: any) => {
            thisObj.setState({ masker: true });
            jnhydSaveOrUpdate({...values,'bz':'edit','lbm':selectionRowKeys[0]}).then((res2: any) => {
              thisObj.setState({ masker: false });
              if (res2.code === '200') {
                message.success('保存成功！');
                DDAlert.close();
                unitRef.current!.reload2();
              } else {
                message.error(res2.msg);
              }
            });
          });
        },
      });
    }
  }


  Func.del = (param: any) => {
    const {unitRef,selectionRowKeys} =param;
    if (!selectionRowKeys || selectionRowKeys.length === 0) {
      message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
      return;
    }
    setMasker(true);
    jnhydDel({'ywKeys':selectionRowKeys}).then((res2: any) => {
      setMasker(false);
      if (res2.code === '200') {
        message.success('删除成功！');
        unitRef.current!.reload2();
      } else {
        message.error(res2.msg);
      }
    });
  }

  // 配置项
  myConfig.grid_show_serial_number = false;                      // 是否显示序号，默认不显示
  myConfig.grid_selection_type = "checkbox";                         // 列表首选项类别，默认 checkbox，可选 false radio checkbox
  myConfig.grid_show_data_num = false;                          // 工具栏左侧是否显示数据条数及选中数，默认true显示
  myConfig.click_checked = '1';                                                       // 是否开启单击或双击勾选事件，1单击勾选，2双击勾选，默认点击不勾选
  myConfig.grid_row_key = { type: '1', key: ['sbqyuuid', 'jnhydsjxzqhszDm', 'xhfsjxzqhszDm'] };                                                     // 列表主键，默认uuid
  myConfig.unit_key = 'CKFPKJ_FPPZ_JNHYD'; // 业务单元key，对应后端接口
  myConfig.export_key = 'CKFPKJ_FPPZ_JNHYD_DC'; // 业务单元key，对应后端接口
  myConfig.module_type = 'sjbb';
  myConfig.import_key = 'CKFPKJ_FPPZ_JNHYD_DR';
  myConfig.layout_type = 'tabs';
  myConfig.api_form_delete = `/saas/pzgl/cjpdgl/deleteJnhyd`;
  // myConfig.form_api_save_upload = `/saas/pzgl/znpdpzgl/dwglUpdate`;


  // 配置列表列 
  myConfig.grid_columns = [
    { title: '序号', dataIndex: 'xh', width: 90 },
    { title: '境内货源地省份', dataIndex: 'jnhydsjxzqhszDm', width: 180, codeTable: 'code_dm_gy_xzqh:01' },
    { title: '进项发票销货方地区省份', dataIndex: 'xhfsjxzqhszDm', codeTable: 'code_dm_gy_xzqh:01' },
  ];


  // 配置项：自定义工具栏
  myConfig.customer_toolbar = [
    { name: '数据提取', func: 'sjtq' },
    { name: '新建', func: 'add' },
    { name: '修改', func: 'edit' },
    { name: '删除', func: 'del' },

  ];

  // 配置项：工具栏
  myConfig.toolbar_default = {
    setting: true,                    // 是否显示设置按钮，默认关闭
    full: true,                       // 是否显示全屏按钮，默认关闭
    reload: true,                     // 是否显示刷新按钮，默认关闭
    delete: false,
    add: false,
    edit: false,
    upload: true,                    // 是否显示导入按钮，默认关闭
    tssb_download: false,                   // 是否显示导出按钮，默认关闭
  };




  return (
    <Spin tip="Loading..." spinning={masker} delay={100}>
      <DDBunit2 config={myConfig} func={Func} />
    </Spin>
  );
};

export default Index;
