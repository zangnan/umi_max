// 货物冲减
import { Form, Input, message, Select, Table, Button} from 'antd';
import React from 'react';
import DDAlert from '@/pages/hts/components/DDAlert';
import {mtsTzsbHwccj, downloadTemplate } from '@/pages/hts/services/htsApi';
import baseValidator from '@/components/DDAssist/field/baseValidator';
import myUtil from '@/components/DDAssist/util';

const Func: any = {
  unitRef: React.createRef(),
};

// 配置项：自定义工具栏 冲减出口
Func.hwccj = (param: any) => {
  const {selectionRowKeys, unitRef} = param;
  if (!selectionRowKeys || selectionRowKeys.length === 0) {
    message.info('请选择要操作的数据！');
    return;
  } else {
    unitRef.current!.setMasker(true);
    let apiParam = {
      uuids: selectionRowKeys,
      checkFlag: 'Y'
    };
    mtsTzsbHwccj(apiParam).then((response: any) => {
      unitRef.current!.setMasker(false);
      const {code, body, desc} = response;
      if (code === '200') {
        Promise.all([myUtil.code.getCodeFromServerT1('code_dm_ckts_hzcjyy:01')]).then(() => {
        }).catch(() => {
          message.error('获取“红冲原因”码表失败');
        }).finally(() => {
          const hcyy = myUtil.code.getCode('code_dm_ckts_hzcjyy:01');
          DDAlert.open({
            title: '海外仓冲减',
            infoType: 'info',
            closeStatus: false,
            isFormContent: true,
            modalType: 'form',
            content: <>
              <Form.Item label="申报年月" name="ssq" rules={[
                {required: true, message: '该项内容为必填项不能为空！'},
                baseValidator.yyyyMM(),
              ]}>
                <Input placeholder="请输入6位申报年月"></Input>
              </Form.Item>
              <Form.Item label="申报批次" name="sbpc" rules={[{ required: true, message: '申报批次为必录' },
                () => ({
                  validator(_, value) {
                    if (value) {
                      const temp1 = (!value.match(/^\d{0,3}$/));
                      if (temp1) {
                        return Promise.reject(new Error('只能输入0-3位数字'));
                      }
                      if (value && myUtil.text.getNumVal(value) <= 0) {
                        return Promise.reject(new Error('该项只能录入正数'));
                      } else if (!value.match(/^\d+$/)) {
                        return Promise.reject(new Error('该项内容只能输入数字！'));// '该项内容只能输入数字！'
                      } else if (value.length != 3) {
                        return Promise.reject(new Error('该项内容长度必须为3！'));
                      }
                      return Promise.resolve();
                    }
                    return Promise.resolve();
                  },
                })
              ]}>
                <Input placeholder="请输入申报批次" maxLength={3}></Input>
              </Form.Item>
              <Form.Item label="红冲原因：" name='hzcjyyDm' rules={[{required: true, message: '该项内容为必填项不能为空'}]}>
                <Select placeholder="请选择">
                  {hcyy.map((item: any) => (
                    <Select.Option key={item.code} value={item.code}>{item.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </>,
            okCallbackFn: async function (thisObj: any) {
              let contentFormData = await DDAlert.getValidateFormData();
              thisObj.setState({masker: true});
              let apiParam1 = {
                ssq: contentFormData.ssq,
                sbpc: contentFormData.sbpc,
                hzcjyyDm: contentFormData.hzcjyyDm,
                uuids: selectionRowKeys,
                checkFlag: 'N'
              };
              mtsTzsbHwccj(apiParam1).then((response: any) => {
                thisObj.setState({masker: false});
                const {code, body, desc} = response;
                unitRef.current?.setMasker(false);
                if (code === '200') {
                  DDAlert.close();
                  message.info(body);
                  if (Func.handleClick) {
                    Func.handleClick();
                  }
                } else if (code === '901') {
                  DDAlert.close();
                  Func.ycxxts(body);
                } else {
                  message.error(desc);
                }
              })
            },
          });
        });
      } else if (code === '901') {
        DDAlert.close();
        Func.ycxxts(body);
      } else {
        message.error(desc);
      }
    })
  }
}

Func.ycxxts = (body: any) => {
  DDAlert.open({
    title: '系统提示',
    info: '以下预退税申报年月无匹配数据，请下载对应年月的免抵退反馈后重新操作！',
    infoType: 'warning',
    modalType: 'confirm',
    width: '800px',
    okText: '确定',
    button: [
      <Button key={'excelmbxz'} onClick={() => downloadTemplateFun('SAAS_TSSB_MTS_TZSB_HWCCJ_JYYC_DC')}>导出</Button>,
    ],
    content:
      <>
        <Table
          dataSource={body}
          columns={[
            {title: '预退税申报年月', dataIndex: 'ytssbny', width: 100, ellipsis: true,align: 'left'},
          ]}
          pagination={false}
          size='small'
          bordered={true}
        />
      </>,
  });
}

const downloadTemplateFun = (param: any) => {
  const obj = {
    sfBhsj: 'Y',
    sfScsm: 'Y',
    key: param,
    searchModel: []
  }
  downloadTemplate(obj).then((response: any) => {
    // thisObj.setState({masker: false});
    // DDAlert.close();
    if (response.code === '200') {
      const {blob, fileName} = response.body;
      myUtil.file.downloadExcel(blob, fileName);
    } else {
      message.error(response.desc);
    }
  })
}

export default Func;
