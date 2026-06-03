/**
 * 发票开具配置  基础开票配置
 */
import React, { useRef, useState, useEffect } from 'react';
import { Form, Input, message, Switch, Button, Tooltip, Spin, Upload } from 'antd';
import './style.less';
import { useAccess, Access } from 'umi';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import DDAlert from "@/components/DDAlert";
import { kpdwwh, kpdwsc, kpdwcheck, downloadTemplate, importData, } from '@/services/hts/api';
import myUtil, { intl as intl2 } from "@/pages/common/myUtil";
import importStyle from './importStyle.less';
import { ClockCircleOutlined, InboxOutlined, WarningOutlined } from '@ant-design/icons';
import baseValidator from "@/pages/common/field/baseValidator";
import ErrorMsgGrid from '@/components/DDImport/importError';


const Index: React.FC<{ data?: any, funcRef?: any }> = ({
  data,
  funcRef
}) => {

  const { Dragger } = Upload;
  const errorMsgGridRef: any = useRef();


  const beforeUpload = (file: any) => {
    if (!file.name.toUpperCase().endsWith(".XLS") && !file.name.toUpperCase().endsWith(".XLSX")) {
      message.info('上传文件必须是Excel文件。');
      return Upload.LIST_IGNORE;
    } else {
      return false;
    }
  }

  const Func: any = {
    unitRef: React.createRef(),
  };
  const dwglConfig: any = {};
  const access = useAccess(); // 权限
  const [form] = Form.useForm();
  const [masker, setMasker] = useState<boolean>(false); // 蒙板

  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(errorMsgGridRef);
    return otherRef;
  };

  // 配置项
  dwglConfig.grid_show_serial_number = false;                      // 是否显示序号，默认不显示
  dwglConfig.grid_selection_type = "checkbox";                         // 列表首选项类别，默认 checkbox，可选 false radio checkbox
  dwglConfig.grid_show_data_num = false;                          // 工具栏左侧是否显示数据条数及选中数，默认true显示
  dwglConfig.click_checked = '1';                                                       // 是否开启单击或双击勾选事件，1单击勾选，2双击勾选，默认点击不勾选
  dwglConfig.grid_row_key = 'uuid';                                                     // 列表主键，默认uuid
  dwglConfig.unit_key = 'CKFPKJ_FPPZ_KPDWGL'; // 业务单元key，对应后端接口
  dwglConfig.export_key = 'CKFPKJ_FPPZ_KPDWGL_DC'; // 业务单元key，对应后端接口
  dwglConfig.module_type = 'QZ_type';
  dwglConfig.form_title = '单位管理'; // 表单标题，可选

  // 配置列表列 
  dwglConfig.grid_columns = [
    { title: '序号', dataIndex: 'xh', width: 90 },
    { title: '报关单单位', dataIndex: 'hgjldwmc', width: 200, ellipsis: true },
    { title: '发票单位', dataIndex: 'jldwmc', ellipsis: true },
    { title: '操作', dataIndex: 'qybz', width: 80, render: { func: 'renderYxbz' } },
  ];

  //开关值改变
  const onChangeSwitch = (_record: any,) => {
    const { record, unitRef, checked } = _record;
    const obj = {
      uuid: record?.uuid,
      czlx: '3',
      qybz: checked ? 'Y' : 'N',
    }
    unitRef.current!?.setMasker(true);
    kpdwwh(obj).then((res2: any) => {
      unitRef.current!?.setMasker(false);
      if (res2.code === '200') {
        message.success('保存成功！');
        unitRef?.current?.reload2();
      } else {
        message.error(res2.msg);
        unitRef?.current?.reload2();
      }
    });
  }

  Func.columnsRender = {
    // 生成类型
    renderYxbz: (param: any) => {
      const { record } = param;
      return <Switch checked={record.qybz == 'Y' ? true : false} checkedChildren="启用" unCheckedChildren="停用" onClick={(checked) => onChangeSwitch({ ...param, ...{ checked: checked } })} />
    },
  }



  // 配置项：自定义工具栏
  dwglConfig.costomer_toobar = [
    // { name: '企业移管', func: 'qyyg' },
    { name: '新建', func: 'add' },
    { name: '修改', func: 'edit' },
    { name: '删除', func: 'del' },
    { name: '导入', func: 'excelImport' },
  ];

  Func.add = (param: any) => {
    const { unitRef, selectionRows } = param;
    DDAlert.open({
      title: '新增',
      infoType: 'warning',
      modalType: 'form',
      closeStatus: false,
      isFormContent: true,
      content: <>
        <Form.Item label="报关单单位" name="hgjldwmc" rules={[{ required: true, message: '报关单单位不允许为空' }, baseValidator.range2({ min: 0, max: 75 })]} >
          <Input placeholder="报关单单位" />
        </Form.Item>
        <Form.Item label="发票单位" name="jldwmc" rules={[{ required: true, message: '发票单位不允许为空' }, baseValidator.range2({ min: 0, max: 75 })]} >
          <Input placeholder="发票单位" />
        </Form.Item>
      </>,
      okCallbackFn: function (thisObj: any) {
        DDAlert.getForms().validateFields().then((values: any) => {
          const obj = {
            czlx: '1',
            hgjldwmc: values?.hgjldwmc,
            jldwmc: values?.jldwmc,
            uuid: selectionRows[0]?.uuid,
          }
          if (values) {
            thisObj.setState({ masker: true });
            kpdwcheck(obj).then((res1: any) => {
              thisObj.setState({ masker: false });
              if (res1.code === '200') {
                kpdwwh(obj).then((res2: any) => {
                  thisObj.setState({ masker: false });
                  if (res2.code === '200') {
                    message.success('保存成功！');
                    DDAlert.close();
                    unitRef.current!.reload2();
                  } else {
                    message.error(res2.msg);
                  }
                });
              } else {
                message.error(res1.msg);
              }
            });
          }
        })
      }
    })

  }

  Func.edit = (param: any) => {
    const { unitRef, selectionRows } = param;
    if (!selectionRows || selectionRows.length === 0) {
      message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
      return;
    }
    if (selectionRows.length > 1) {
      message.info('只能选择一条数据进行操作!');
      return;
    }

    DDAlert.open({
      title: '修改',
      infoType: 'warning',
      modalType: 'form',
      closeStatus: false,
      isFormContent: true,
      content: <>
        <Form.Item label="报关单单位" name="hgjldwmc" rules={[{ required: true, message: '报关单单位不允许为空' }, baseValidator.range2({ min: 0, max: 75 })]} initialValue={selectionRows[0]?.hgjldwmc}>
          <Input placeholder="报关单单位" disabled={true} />
        </Form.Item>
        <Form.Item label="发票单位" name="jldwmc" rules={[{ required: true, message: '发票单位不允许为空' }, baseValidator.range2({ min: 0, max: 75 })]} initialValue={selectionRows[0]?.jldwmc}>
          <Input placeholder="发票单位" />
        </Form.Item>
      </>,
      okCallbackFn: function (thisObj: any) {
        DDAlert.getForms().validateFields().then((values: any) => {
          const obj = {
            czlx: '2',
            hgjldwmc: values?.hgjldwmc,
            jldwmc: values?.jldwmc,
            uuid: selectionRows[0]?.uuid,
          }
          if (values) {
            thisObj.setState({ masker: true });
            kpdwwh(obj).then((res2: any) => {
              thisObj.setState({ masker: false });
              if (res2.code === '200') {
                message.success('保存成功！');
                DDAlert.close();
                unitRef.current!.reload2();
              } else {
                message.error(res2.msg);
              }
            });
          }
        })
      }
    })
  }

  Func.del = (param: any) => {
    const { unitRef, selectionRows, selectionRowKeys } = param;
    if (!selectionRows || selectionRows.length === 0) {
      message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
      return;
    }
    DDAlert.open({
      title: '删除',
      infoType: 'warning',
      modalType: 'confirm',
      info: '确定删除所选项吗?',
      closeStatus: false,
      isFormContent: false,
      okCallbackFn: function (thisObj: any) {
        thisObj.setState({ masker: true });
        kpdwsc({ uuids: [...selectionRowKeys] }).then((res2: any) => {
          thisObj.setState({ masker: false });
          if (res2.code === '200') {
            message.success('删除成功！');
            DDAlert.close();
            unitRef.current!.reload2();
          } else {
            message.error(res2.msg);
          }
        });
      },
    });

  }

  // 导入Excel模板
  Func.excelImport = (param: any) => {
    const { unitRef, otherRef } = param;
    DDAlert.open({
      title: '导入Excel文件',
      infoType: 'warning',
      modalType: 'form',
      closeStatus: false,
      isFormContent: true,
      width: 720,
      initFormContentValues: { drgz: 1 },
      button: [
        <Button key={'excelmbxz'} onClick={() => Func.downloadExcel('CKFPKJ_FPPZ_KPDWGL_DC')}>Excel模板下载</Button>,
      ],
      content: <>
        <Form.Item labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} label="导入Excel文件" name="file" valuePropName="fileList" rules={[{ required: true, message: '请选择上传的文件' }]} getValueFromEvent={(e: any) => { if (Array.isArray(e)) { return e; } return e && e.fileList; }}>
          <Dragger
            maxCount={1}
            showUploadList={true}
            beforeUpload={beforeUpload}
            itemRender={(originNode, file, currFileList, actions: { download: any, preview: any, remove: any }) => (
              <table className={importStyle.importTable}>
                <tr>
                  <th>文件名</th>
                  <th>文件大小</th>
                  <th>状态</th>
                  <th>操作</th>
                </tr>
                <tr>
                  <td width='45%' className={importStyle.textCenter}>
                    <Tooltip title={file.name}>
                      <div className={importStyle.textName}>{file.name}</div>
                    </Tooltip>
                  </td>
                  <td width="20%" className={importStyle.textCenter}>{myUtil.text.formatNum(file.size ? (file.size / 1024) : 0, '0,0')}KB</td>
                  <td width="18%" className={importStyle.textCenter}><ClockCircleOutlined />&nbsp;待上传</td>
                  <td width="17%" className={importStyle.textCenter}><a onClick={() => actions.remove()}>删除</a></td>
                </tr>
              </table>
            )}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或将文件拖拽到此区域</p>
          </Dragger>
        </Form.Item>
        <>提示：相同的数据，仅保留最后一次导入结果</>
      </>,
      okCallbackFn: function (thisObj: any) {
        DDAlert.getForms().validateFields().then((values: any) => {
          thisObj.setState({ masker: true });
          const formData = new FormData();
          formData.append('fileName', values.file[0].name);
          formData.append('file', values.file[0].originFileObj);
          formData.append('key', "IMPORT_PZGL_FPPZ_KPDWGL");
          importData(formData).then((response) => {
            const { code, body, desc, msg } = response;
            DDAlert.close();
            if (code === '200') {
              message.success("导入成功！");
              unitRef.current!.reload2();
            }
            else if (code === '900') {
              otherRef[0].current!.showModal(body);
            }
            else {
              message.error(msg);
            }
          }).catch(() => {
            message.error('导入失败，请重新上传文件。');
          }).finally(() => {
            thisObj.setState({ masker: false });
          });
        });
      },
    });
  }

  // 下载excel模板
  Func.downloadExcel = (param: string) => {
    downloadTemplate({ key: param, sfBhsj: 'N' }).then((response) => {
      const { code, body, desc } = response;
      if (code === '200') {
        const { blob, fileName } = body;
        myUtil.file.downloadExcel(blob, fileName);
      } else {
        message.error(desc);
      }
    })
  }



  //   // 配置项：自定义操作列
  //   dwglConfig.handle_columns = [
  //      { name: '刷新', func: 'handleFpsqdTzreload' },
  //   ];



  // Func.handleFpsqdTzreload= async (param: any) => {

  // }

  // 配置项：工具栏
  dwglConfig.toolbar_default = {
    setting: true,                    // 是否显示设置按钮，默认关闭
    full: true,                       // 是否显示全屏按钮，默认关闭
    reload: true,                     // 是否显示刷新按钮，默认关闭
    delete: false,
    add: false,
    edit: false,
    upload: false,                    // 是否显示导入按钮，默认关闭
    tssb_download: true,                   // 是否显示导出按钮，默认关闭
  };




  return (
    <Spin tip="Loading..." spinning={masker} delay={100}>
      <DDBunit2 config={dwglConfig} func={Func} />
      <ErrorMsgGrid onRef={errorMsgGridRef} />
    </Spin>
  );
};

export default Index;
