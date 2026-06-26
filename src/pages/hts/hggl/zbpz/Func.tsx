import { Radio, Form, Button, Switch, message, Space } from 'antd';
import React from 'react';
import 'moment/locale/zh-cn';
import myUtil from '@/components/DDAssist/util';
import DDAlert from '@/pages/hts/commonModule/DDAlert';
import { gxQybz } from '@/pages/hts/services/htsApi';
import { intl as intl2 } from '@/components/DDAssist/util';
import { ExclamationCircleOutlined, } from '@ant-design/icons';


const Func: any = {
  unitRef: React.createRef(),
};


Func.afterReload = (param: any) => {
  // const gridParams =param?.unitRef?.current?.getGridParams();
  // myUtil.sessionStore.setItem('zbpz-gridParams', gridParams);
  // // 获取表格的 th 元素
  // const thElements = document.querySelectorAll('tr th')[6];
  // const checkboxid = document.querySelectorAll('#header-checkbox');
  // if (thElements && !checkboxid[0]) {
  //   // 创建复选框元素
  //   const checkbox = document.createElement('input');
  //   checkbox.type = 'checkbox';
  //   checkbox.id = 'header-checkbox';
  //   thElements.appendChild(checkbox);
  //   checkbox.checked = true;
  //   checkbox.onclick = function (p:any) {
  //     Func.hh(p);
  //   };
  // }
}

Func.hh = (p: any) => {
  const ck = p.target.checked;
  const obj = { tycs: 'All', qybz: ck ? 'Y' : 'N', };
  const searchModel = Func.unitRef?.current.getGridParams()?.searchModel;
  searchModel?.forEach((element: any) => {
    obj[element.property] = element.value;
  });
  DDAlert.open({
    title: '系统提示',
    info: `确认将筛选条件下的指标设置为${ck ? '启用' : '关闭'}？`,
    infoType: 'warning',
    closeStatus: true,
    okCallbackFn: function () {
      Func.unitRef.current!?.setMasker(true);
      gxQybz(obj).then((res: any) => {
        Func.unitRef.current!?.setMasker(false);
        if (res.code === '200') {
          message.success(ck ? '启用成功！' : '关闭成功！');
          DDAlert.close();
          Func.unitRef?.current!.reload2();
        } else {
          message.error(res?.msg);
        }
      });

    },
  });
}

Func.columnsRender = {
  renderSfkq: (param: any) => {
    const { record } = param;
    return <Switch checked={record.sfkq == 'Y' ? true : false} checkedChildren="启用" unCheckedChildren="停用" onClick={(checked) => onChangeSwitch({ ...param, ...{ checked: checked } })} />
  },
  renderfxms: (param: any) => {
    // 创建一个新的 <div> 元素
    const { record } = param;
    let result = record.ydnr;
    if (record.fxzbDm) {
      const regex = /\{([^}]*)\}/g;
      // 替换大括号中的内容为带有样式的 span 标签
      result = result.replace(regex, (match: any, p1: any) => {
        return `<Sapce><span style="color:#f50">${p1}</span> </Space>`;
      });
      return <Button type="link" style={{ whiteSpace: 'normal', width: 390, textAlign: 'left', }} onClick={() => { Func.fxms(record) }}><span dangerouslySetInnerHTML={{ __html: result }} /></Button>;
    } else {
      return result;
    }
  },

}





//开关值改变
const onChangeSwitch = (_record: any,) => {
  const { record, unitRef, checked } = _record;
  const obj = {
    ydbh: record?.ydbh,
    lcswsxDm: record?.lcswsxDm,
    qybz: checked ? 'Y' : 'N',
  }
  unitRef.current!?.setMasker(true);
  gxQybz(obj).then((res: any) => {
    unitRef.current!?.setMasker(false);
    if (res.code === '200') {
      message.success(checked ? '启用成功！' : '关闭成功！');
      unitRef.current?.reload2();
    } else {
      message.error(res?.msg);
    }
  });

}



Func.qybz = (p: any,) => {
  const { selectionRowKeys, unitRef, selectionRows } = p;
  if (!selectionRowKeys || selectionRowKeys.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  }
  DDAlert.open({
    title: '批量设置',
    infoType: 'warning',
    info: '确认启用或停用勾选数据?',
    modalType: 'form',
    closeStatus: false,
    isFormContent: true,
    // initFormContentValues: { password: dlmm, },
    content: <>
      <Form.Item labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} label="启用标志" rules={[{ required: true, message: '该项为必录' }]}   name="qybz" initialValue="Y">
        <Radio.Group>
          <Radio key="Y" value="Y">启用</Radio>
          <Radio key="N" value="N">停用</Radio>
        </Radio.Group>
      </Form.Item>
    </>,
    okCallbackFn: function (thisObj: any) {
      DDAlert.getForms().validateFields().then((values: any) => {
        thisObj.setState({ masker: true });
        const obj = {
          uuids: selectionRowKeys,
          qybz: values.qybz,
        }
        gxQybz(obj).then((res: any) => {
          thisObj.setState({ masker: false });
          if (res.code === '200') {
            message.success(values.qybz=='Y'? '指标启用成功！':'指标停用成功');
            unitRef.current?.reload2();
            DDAlert.close();
          } else {
            message.error(res?.msg);
          }
        });
      })
    }
  })


}

export default Func;