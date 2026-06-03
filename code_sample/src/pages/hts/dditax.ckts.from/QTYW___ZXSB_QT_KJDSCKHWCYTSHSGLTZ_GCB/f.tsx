/**
 * title: 跨境电商出口海外仓预退税核算管理台账
 * author: wx
 */
import React from 'react';
import { zrqrb, queryCjSbpc,bydqdqrsj} from '@/services/hts/api';
import DDAlert from '@/components/DDAlert';
import { Form, message, Tooltip, Radio, Input } from 'antd';
import myUtil from '@/pages/common/myUtil';
import { intl as intl2 } from '@/pages/common/myUtil';
import {  Access } from 'umi';
import { QuestionCircleOutlined} from '@ant-design/icons';

const Func: any = {
  unitRef: React.createRef(),
};
Func.setGridTitle = () => {
  const [title, setTitle] = React.useState('');
  const [hasData, setHasData] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function dqdqr() {
      try {
        const response = await bydqdqrsj();
        const { code, body } = response;
        if (code === '200' && body.dqrsjts > 0) {
          setTitle('本月到期待确认数据' + body.dqrsjts + '条');
          setHasData(true);
        } else {
          setTitle('');
          setHasData(false);
        }
      } catch (error) {
        console.error('获取数据失败:', error);
        setHasData(false);
      } finally {
        setLoading(false);
      }
    }
    
    dqdqr();
  }, []);

  if (loading) {
    return null; // 或者返回一个加载中组件
  }

  const tempFragment = (
    <Access accessible={hasData}>
      <div style={{ color: 'red' }}>{title}
      <Tooltip title={'国家税务总局公告 2025 年第 3 号第三条规定，已申报办理出口预退税的纳税人，应当在核算期截止日前的各增值税纳税申报期内，办理出口预退税核算。经主管税务机关同意，外贸企业在核算期截止日前增值税纳税申报期以外的其他时间也可办理出口预退税核算。上述核算期是指，税务机关办结出口预退税的次月1日至次年4月30日。纳税人未在核算期截止日前办理核算的，税务机关应当追回已办理的出口预退税；待货物实现销售后，纳税人再按照现行规定申报办理出口退（免）税。'}>
            <span><QuestionCircleOutlined /></span>
          </Tooltip>
          </div>
    </Access>
  );
  
  return tempFragment;
}

// 转入确认表
Func.zrqrb = (param: any) => {
  const { unitRef, unit_key,selectionRows,selectionRowKeys,form } = param;
  if (!selectionRows || selectionRows.length <= 0) {
    message.info("请选择要操作的数据");
    return;
  }

  queryCjSbpc({ ywkey:unit_key}).then((response) => {
    const { code, body } = response;
    if (code === '200') {
      DDAlert.open({
        title: '数据转入确认表',
        infoType: 'warning',
        modalType: 'form',
        closeStatus: false,
        isFormContent: true,
        initFormContentValues: { ssq: body.ssq, sbpc: body.sbpc, ckhwcytshslxdm: '01' },
        content: <>
          <Form.Item name="ssq" label="申报年月" rules={[{ required: true, message: '请输入6位申报年月' }, () => ({
            validator(_, value) {
              if (value && (!value.match(/^[1-9]\d{3}(0[1-9]|1[0-2])$/))) {
                  return Promise.reject(new Error('请输入正确的格式'));
              }
              return Promise.resolve();
            },
          })
          ]}>
            <Input placeholder="请输入申报年月" onChange={(event: any) => {
              const ssq = event.target.value;
              let apiParam: any = {ssq: ssq, ywkey:unit_key};
              queryCjSbpc(apiParam).then((response) => {
                const {code, body,  desc} = response;
                if (code === '200') {
                  form.setFieldsValue({sbpc:body?.sbpc})
                }else {
                  message.error(desc);
                }
              })
            }
          }></Input>
          </Form.Item>
          <Form.Item name="sbpc" label="申报批次" rules={[{ required: true, message: '请输入3位申报批次' },
          () => ({
            validator(_, value) {
              if (value && !value.match(/^\d+$/)) {
                return Promise.reject(new Error(intl2.formatMessage({ id: 'validator_number' })));
              }
              return Promise.resolve();
            }
          })
          ]}>
            <Input placeholder="请输入申报批次" onBlur={async (event: any) => {
              try {
                await DDAlert.getForms().validateFields(['sbpc'])
                let sbpc = event.target.value;
                if (sbpc && Number(sbpc) === 0) {
                  sbpc = '001';
                } else if (sbpc) {
                  sbpc = myUtil.text.leadingZeroize(sbpc, 3);
                }
                DDAlert.getForms().setFieldsValue({ sbpc: sbpc });
              } catch (error) {
              }
            }} />
          </Form.Item>
          <Form.Item label="" name="ckhwcytshslxdm" wrapperCol={{ offset: 6, span: 18 }} >
            <Radio.Group >
              <Radio value="01">无需调整申报</Radio>
              <Radio value="02">需要调整申报</Radio>
            </Radio.Group>
          </Form.Item>
        </>,
        okCallbackFn: function (thisObj: any) {
          DDAlert.getForms().validateFields().then((values: any) => {
            thisObj.setState({ masker: true });
            values.uuids=selectionRowKeys;
            values.ywkey = unit_key;
            values.tablekey = 'QTYW_ZXSB_TY_KJDSHWC_HSSB_G';
            zrqrb(values).then((response) => {
              const { code, desc } = response;
              thisObj.setState({ masker: false });
              if (code === '200') {
                DDAlert.close();
                message.info('转入确认表成功');
                unitRef.current?.setSelectionRowKeys([]);  // 设置SelectionRows
                unitRef.current?.setSelectionRows([]);     // 设置SelectionRowKeys
                unitRef.current?.reload2();
              } else {
                message.error(desc);
              }
            })
          });
        },
      });
    }
  })
};

export default Func;
