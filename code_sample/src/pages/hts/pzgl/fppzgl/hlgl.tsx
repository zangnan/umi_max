/**
 * title: 汇率管理
 * author: wxl
 */
import React, { useState, useEffect } from 'react';
import { Form, Button, Select, DatePicker, Spin, message, InputNumber, Input } from 'antd';
import { itemType } from '@/components/DDForm/data.d';
import DDBaseForm from '@/components/DDForm/DDBaseForm';
import { hlglcx, tbtshl, fphlwh } from '@/services/hts/api';
import ProCard from '@ant-design/pro-card';
import '../style.less';
import myUtil from '@/pages/common/myUtil';
import moment from 'moment';
import { useIntl,useAccess} from 'umi';
import qxUtil from '@/pages/common/qxUtil';


const Index: React.FC<{ data: any }> = ({
  data
}) => {
  const access = useAccess(); // 权限 
  const [loading, setLoading] = useState(false);
  const [bzOptions, setbzOptions] = useState<any>([]); // 币种下拉
  const [formDayItem, setformItemDay] = useState([]);
  const [formDay] = Form.useForm(); // 每日汇率的表单
  const [formSearch] = Form.useForm();
  const [masker, setMasker] = useState(false);
  const [yhlDisabled, setYhlDisabled] = useState<boolean>(false); // 月汇率文本框选择出口日期时不可编辑
  const [oldHlData, setOldHlData] = useState<any>([]); // 查询时返回的汇率数据，方便保存时能够比较出修改的数据
  const intl = useIntl(); // 提示信息

  // 单一窗口调整
  const paramDyck = {
    qxCode: 'tssb_dyck',
    accessObj: access,
  }

  const loadMoreData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    Promise.all([myUtil.code.getCodeFromServerT1('code_dm_gy_hb', '02')]).then(() => {
    }).catch(() => {
      message.error('获取码表失败');
    }).finally(() => {
      setbzOptions(myUtil.code.getCode('code_dm_gy_hb', '02'));
    });     // 获取币制列表
    const time = myUtil.date.getMonthFirstDay(new Date(myUtil.date.getDateBeforeCurr(0)).valueOf());
    const initData = { hlny: time, hbzmDm: 'USD' };
    getDayList(initData);  // 打印初始化表单
    formSearch.setFieldsValue({ hlny: moment(), hbzmDm: 'USD' })
    setLoading(false);
  };

  useEffect(() => {
    loadMoreData();
  }, [data]);

  // 同步退税汇率
  const tbtshlv = () => {
    const hlny = formSearch.getFieldValue('hlny');
    if (hlny) {
      setMasker(true);
      tbtshl({}).then((response) => {
        const { code, desc } = response;
        setMasker(false);
        if (code === '200') {
          hlbzChange();
          message.success(intl.formatMessage({ id: 'message_ckfp_fppz_hlgl_tshltb_success' }));
        } else {
          message.error(desc);
        }
      })
    } else {
      message.info(intl.formatMessage({ id: 'message_ckfp_fppz_hlgl_hlny_check' }));
    }
  }

  // 汇率币种修改
  const hlbzChange = () => {
    const hlny = formSearch.getFieldValue('hlny');
    const tmp: any = hlny ? hlny.valueOf() : (new Date()).valueOf();
    const newHlny = myUtil.date.getMonthFirstDay(tmp);
    const hbzmDm = formSearch.getFieldValue('hbzmDm');
    getDayList({ hlny: newHlny, hbzmDm: hbzmDm });
  }

  // 保存表单数据
  const saveForm = () => {
    let formValue = formSearch.getFieldsValue();
    const hlny = formValue.hlny;
    if (hlny ) {
      if(!formValue.yhl && yhlDisabled != true) {
        message.info('月汇率不能为0！');
        return
      }

      const tmp: any = hlny ? hlny.valueOf() : (new Date()).valueOf();
      formValue.hlny = myUtil.date.getMonthFirstDay(tmp);
      // 获取所有表单数据
      const formDayValuse = formDay.getFieldsValue();
      // 获取对象的key值 也就是时间戳
      const keys = Object.keys(formDayValuse);
      const tzrqVoList: any = [];
      keys.map((key: any) => {
        // 比较最新时间戳和查询的是否一致，不一致放入到调整数据中
        if (oldHlData[key] != formDayValuse[key]) {
          tzrqVoList.push({ tzrq: key, rmbhl: formDayValuse[key] });
        }
      });
      if (tzrqVoList.length === 0) {
        message.info(intl.formatMessage({ id: 'message_ckfp_fppz_hlgl_save_check' }));
        return;
      }
      formValue.tzrqVoList = tzrqVoList;
      setMasker(true);
      fphlwh(formValue).then((response) => {
        const { code, desc } = response;
        setMasker(false);
        if (code === '200') {
          getDayList({ hlny: formValue.hlny, hbzmDm: formValue.hbzmDm });
          message.success(desc);
        } else {
          message.error(desc);
        }
      })
    } else {
      message.info(intl.formatMessage({ id: 'message_ckfp_fppz_hlgl_hlny_check' }));
    }

  }

  // 获得汇率form
  const getDayList = (obj: any) => {
    const param = {
      hbzmDm: obj.hbzmDm,
      hlny: obj.hlny,
    }
    //处理保留五位小数
    const limitDecimals = (value: any) => {
      let f = parseFloat(value);
      f = Math.floor(value * 100000) / 100000;
      let s = f.toString();
      let rs = s.indexOf('.');
      // 如果是整数，加小数点
      if (rs < 0) {
        rs = s.length;
        s += '.';
      }
      if (s.length - rs != 6) {
        while (s.length <= rs + 5) {
          s += '0';
        }
      }
      return s;
    };
    let ts = 31;
    const formArry: any = [];
    setMasker(true);
    hlglcx(param).then((res: any) => {
      const { code, body, msg } = res;
      setMasker(false);
      if (code == '200') {
        ts = body.hlglpzVo.length;
        const fphlxqgzDm = body.fphlxqgzDm;
        const hlglpzVoList = body.hlglpzVo;
        if (fphlxqgzDm === '11') {
          //  按出口日期当天汇率 月汇率为空
          formSearch.setFieldsValue({ yhl: ' ' });
          // 月汇率不可编辑
          formSearch.setFieldsValue({ yhlrq: '' });
          setYhlDisabled(true);
        } else if (fphlxqgzDm === "12") {
          // 按出口日期当月第一个工作日 取第一个关注日
          const gzrList = hlglpzVoList.filter((row: any) => row.gzrbz === 'Y');
          formSearch.setFieldsValue({ yhl: gzrList[0]?.rmbhl, yhlrq: gzrList[0]?.hlrq });
          setYhlDisabled(false);
        } else if (fphlxqgzDm === "13") {
          // 按出口日期当月第一天
          formSearch.setFieldsValue({ yhl: hlglpzVoList[0]?.rmbhl, yhlrq: hlglpzVoList[0].hlrq });
          setYhlDisabled(false);
        } else if (fphlxqgzDm === "14") {
          // 按出口日期当月最后一天
          formSearch.setFieldsValue({ yhl: hlglpzVoList[ts - 1]?.rmbhl, yhlrq: hlglpzVoList[ts - 1]?.hlrq });
          setYhlDisabled(false);
        }
        let formData: any = {};
        hlglpzVoList.forEach((hlglpzVo: any) => {
          Object.assign(formData, { [hlglpzVo.hlrq]: hlglpzVo?.rmbhl })
        });
        formDay.setFieldsValue(formData);
        setOldHlData(formData);
      } else if(code == '900') {
        message.info(msg)
      } else {
        formDay.setFieldsValue({});
      }
        //汇率年月
        const hln = formSearch.getFieldValue('hlny').format('YYYY');
        const hly = formSearch.getFieldValue('hlny').format('MM');
        //系统年月
        var myDate = new Date();
        const xtn = myDate.getFullYear(); 
        const xty = myDate.getMonth()+1 <10 ? '0'+(myDate.getMonth()+1) :myDate.getMonth()+1; 
        const xtr = myDate.getDate();  
        //1.当月
        if(xtn == hln && xty == hly){
          for (let i = 1; i <= ts; i++) {
            const hhl = i + '号汇率';
            const hlDayName = body?.hlglpzVo[i - 1].hlrq;
            const boolean = i > parseInt(xtr) ? true:false;
            formArry.push({ name: hlDayName, type: itemType.InputNumber, label: hhl, disabled:boolean,format: '0,0.00000', onChange: hlChange });
          }
        }else{
          for (let i = 1; i <= ts; i++) {
            const hhl = i + '号汇率';
            const hlDayName = body?.hlglpzVo[i - 1].hlrq;
            formArry.push({ name: hlDayName, type: itemType.InputNumber, label: hhl, format: '0,0.00000', onChange: hlChange });

          }
        }
      setformItemDay(formArry);
    })
  };

  // 修改配置汇率时同步修改月汇率
  const hlChange = (param :any) => {
    if (param?.event <= 0) {
      const name = param?.item.name;
      param.form.setFieldsValue({ [name]: '' });
      return;
    }
    const yhlrq = formSearch.getFieldValue('yhlrq');
    const yhl = formDay.getFieldValue(yhlrq);
    formSearch.setFieldsValue({ yhl: yhl });
  }

  // 修改月汇率时同步修改对应汇率
  const yhlChange = (e: any) => {
    const yhlrq = formSearch.getFieldValue('yhlrq');
    formDay.setFieldsValue({ [yhlrq]: e });
  }

  //限制可选日期范围
  const disabledDate = (current: any) => {
    return current < moment(new Date('2017/01/01')) || current > moment().endOf('day')
  }

  return (
    <Spin tip="Loading..." spinning={masker} delay={100}>
      <div className="lay_wrap_hlgl" >
        <ProCard headerBordered title={<>
          <Form layout="inline" form={formSearch} colon={false} >
            <Form.Item label="汇率年月" name="hlny">
              <DatePicker picker="month" className="hlgl-form" allowClear={false} style={{ width: '100px' }} onChange={hlbzChange} disabledDate={disabledDate} />
            </Form.Item>
            <Form.Item name="yhlrq">
              <Input hidden />
            </Form.Item>
            <Form.Item label="币种" name="hbzmDm">
              <Select
                style={{ width: '150px' }}
                showSearch
                className="hlgl-form"
                optionLabelProp="value"
                filterOption={(input, option: any) =>
                  option.children[0].toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.children[2].indexOf(input.toLowerCase()) >= 0
                }
                onChange={hlbzChange}
              >
                {
                  bzOptions.map((item: any) => (
                    <Select.Option key={item.code} label={item.name} value={item.code}>{item.code}-{item.name}</Select.Option>
                  ))
                }
              </Select>
            </Form.Item>
            <Form.Item label="月汇率" name="yhl">
              <InputNumber className="hlgl-yhl" style={{ width: '100px' }} disabled={yhlDisabled} onChange={yhlChange} />
            </Form.Item>
            <Form.Item>
            {qxUtil.getQxz(paramDyck)?<></>:<Button onClick={tbtshlv} className="hlgl-btn">同步退税汇率</Button>}
              <Button onClick={saveForm} className="hlgl-btn" type="primary">保存</Button>
            </Form.Item>
          </Form>
        </>}>
          <div style={{ width: '92%' }}>
            <DDBaseForm items={formDayItem} form={formDay} layoutType='inline' />
          </div>
        </ProCard>
      </div>
    </Spin>
  );
};

export default Index;
