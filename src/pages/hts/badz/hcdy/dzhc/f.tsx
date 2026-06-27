/**
 * title: 备案单证-核查调阅-单证核查
 * author: mfc
 */
import React from 'react';
import DDAlert from '@/pages/hts/commonModule/DDAlert';
import { Button, Form, message, Upload, Badge } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { badzHcdyHcbs, gtTsxx, saveRwxxHcsmbc } from '@/pages/hts/services/htsApi';
import { intl as intl2 } from '@/components/DDAssist/util';
import { history } from 'umi';
import badzUtil from "@/pages/hts/badz/badzcommon/badzUtil";
import TextArea from "antd/lib/input/TextArea";
import myUtil from '@/components/DDAssist/util';

const dzhcFunc: any = {
  // 加载时蒙板使用
  unitRef: React.createRef(),
};

// 根据路由获取业务key
// dzhcFunc.getYwKey = () => {
//   const { location } = history;
//   const { pathname } = location;
//   const arr: any = pathname.split('/');
//   let tmpKey: string = '';
//   if (arr?.length > 0) {
//     tmpKey = arr[arr.length - 1];
//   }
//   return tmpKey;
// };

// 下载资料（下载zip）
dzhcFunc.xzzl = (param: any) => {
  badzUtil.common.xzzl(param, 'rwxq');
};
// 打印成册（预览PDF）
dzhcFunc.dycc = (param: any) => {
  badzUtil.common.dycc(param, 'rwxq');
};
// 核查报送
dzhcFunc.hcbs = (param: any) => {
  const { selectionRows, unitRef } = param;
  if (!selectionRows || selectionRows.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  } else {
    DDAlert.open({
      title: '系统提示',
      info: intl2.formatMessage({ id: 'message_badz_hcdy_dzhcbs_message' }),
      infoType: 'question',
      modalType: 'confirm',
      closeStatus: true,
      okCallbackFn: function (thisObj: any) {
        unitRef.current!.setMasker(true);
        badzHcdyHcbs().then((response) => {
          unitRef.current!.setMasker(false);
          if (response.code === '200') {
            message.success(intl2.formatMessage({ id: 'message_delete_success' }));
            // 清空选中并设置按钮可用状态
            unitRef.current?.setSelectionRowKeys([]);
            unitRef.current?.setSelectionRows([]);
            unitRef.current!.reload2();
          } else {
            message.error(intl2.formatMessage({ id: 'message_delete_error' }));
            return;
          }
        });
      },
    });
  }
};
// 导入核查清单
dzhcFunc.drHcqd = (param: any) => {
  const { unitRef } = param;
  DDAlert.open({
    title: '导入Excel文件',
    infoType: 'warning',
    modalType: 'form',
    button: [
      <Button key={'excelmbxz'} onClick={() => dzhcFunc.downloadExcel()}>Excel模板下载</Button>,
    ],
    closeStatus: false,
    isFormContent: true,
    content: <>
      <Form.Item label="导入Excel文件"
        name="importFileName"
        valuePropName="fileList"
        getValueFromEvent={(e: any) => {
          if (Array.isArray(e)) {
            return e;
          }
          return e && e.fileList;
        }}
        rules={[{ required: true, message: '请选择上传的文件' }]}>
        <Upload maxCount={1} showUploadList={true} accept=".xlsx,.xls">
          <Button key={'drhcqd_wj'} icon={<UploadOutlined />}>请选择上传的文件</Button>
        </Upload>
      </Form.Item>
      <Form.Item name="drhcqd_wxts" wrapperCol={{ offset: 5, span: 14 }}>
        温馨提示：仅保留最后一次导入的数据
      </Form.Item>
    </>,
    okCallbackFn: function (thisObj: any) {
      console.log(DDAlert.getContentFormData());
      let contentFormData = DDAlert.getContentFormData();
      if (contentFormData.importFileName == undefined) {
        message.info(`请上传Excel文件`);
        return;
      }
      let fileName = contentFormData.importFileName[0].name;
      // 上传文件校验
      if (!fileName.toUpperCase().endsWith(".XLS") && !fileName.toUpperCase().endsWith(".XLSX")) {
        message.info(`请上传Excel文件`);
        return;
      }
      thisObj.setState({ masker: true });
      gtTsxx({ id: 2 }).then((response) => {
        DDAlert.close();
        const { code } = response;
        if (code === '200') {
          unitRef.current!.reload2();
          // DDAlert.open({
          //   title: '导入Excel模板',
          //   info: '成功导入Excel模板文件',
          //   infoType: 'success',
          //   modalType: 'info',
          //   closeStatus: true,
          //   isFormContent: false,
          //   button: [],
          //   content: [
          //     '发票单据号' + body.bgdts + '张',
          //     '金额总计' + myUtil.text.formatNum(body.je, '0,0.00') + '元'
          //   ],
          // });
          message.success(`导入核查清单成功`);
        } else {
          message.info(`导入核查清单失败`);
        }
      })
    },
  });
};
// 填写核查说明
dzhcFunc.txhcsm = (param: any, event: any) => {
  const { selectionRows, unitRef } = param;
  if (!selectionRows || selectionRows.length === 0) {
    message.info(intl2.formatMessage({ id: 'message_handle_unselected' }));
    return;
  } else {
    DDAlert.open({
      title: '填写核查说明',
      infoType: 'info',
      closeStatus: false,
      isFormContent: true,
      modalType: 'form',
      width: 600,
      content: <>
        <Form.Item label="核查说明" labelCol={{ span: 4 }} name='yysm' rules={[{ required: true, message: '核查说明为必填项' }, businessValidator.hcsm() ]}>
          <TextArea placeholder="请对勾选数据填写核查说明" rows={6} style={{ width: 397 }} />
        </Form.Item>
      </>,
      okCallbackFn: async function (thisObj: any) {
        let contentFormData = await DDAlert.getValidateFormData();
        thisObj.setState({ masker: true });
        let uuid: any = [];
        selectionRows.forEach((item: any) => {
          uuid.push({ rwbh: item.rwbh, bgdhgbh: item.bgdhgbh });
        });
        const obj = {
          uuids: uuid,
          yysm: contentFormData.yysm,
        }
        saveRwxxHcsmbc(obj).then((response) => {
          thisObj.setState({ masker: false });
          DDAlert.close();
          const { code } = response;
          if (code === '200') {
            unitRef.current!.reload2();
            message.success('填写核查说明成功！');
          } else {
            message.error(response.desc);
          }
        });
      },
    });
  }
};
// 操作列
// 备案
dzhcFunc.handleBadzDzhcBa = (param: any, event: any) => {
  event.stopPropagation();
  // 跳转至采集界面
  history.push({ pathname: '/hts/badz/dzba/zlcj', query: { ssq: param.record.ssq, sbpc: param.record.sbpc, bgdhgbh: param.record.bgdhgbh,lcswsxDm: param.record.lcswsxDm} });
  return;
};

// 归档
dzhcFunc.handleBadzDzhcCj = (param: any, event: any) => {
  event.stopPropagation();
  // 跳转至归档界面
  history.push({ pathname: '/hts/badz/zlgd', query: { ssq: param.record.ssq, sbpc: param.record.sbpc, bgdhgbh: param.record.bgdhgbh ,lcswsxDm: param.record.lcswsxDm} });
  return;
};


dzhcFunc.gridBadzDzhc23Cz = (record: any) => {
  if (record.dzbaztDm === '2' || record.dzbaztDm === '1') {
    return false;
  }
  return true;
};

dzhcFunc.gridBadzDzhc23Cz2 = (record: any) => {
  if (record.fpkjztDm === '3' && record.fpzlDm1 === '4' || record.fpkjztDm === '3' && record.fpzlDm1 === '5') {
    return false;
  }
  return true;
};

dzhcFunc.gridBadzDzhc4Cz = (record: any) => {
  if (record.dzbaztDm === '3') {
    return false;
  }
  return true;
};

// 列表自定义渲染
dzhcFunc.columnsRender = {
  // 备案单证-备案状态
  renderBadzBazt: (param: any) => {
    let col: any = <></>;
    if (param.text === '1') {
      // 待备案
      col = (
        <span className="dd_grid_icon">
          <Badge status="default" />{myUtil.code.getCodeValByKey(param.text, 'CODE_DM_ZXSB_DZBAZT:01')}
        </span>
      );
    } else if (param.text === '2') {
      // 备案中
      col = (
        <span className="dd_grid_icon">
          <Badge status="processing" />{myUtil.code.getCodeValByKey(param.text, 'CODE_DM_ZXSB_DZBAZT:01')}
        </span>
      );
    } else if (param.text === '3') {
      // 已备案
      col = (
        <span className="dd_grid_icon">
          <Badge status="success" />{myUtil.code.getCodeValByKey(param.text, 'CODE_DM_ZXSB_DZBAZT:01')}
        </span>
      );
    } else if (param.text === '4') {
      // 已归档
      col = (
        <span className="dd_grid_icon">
          <Badge color="#722ed1" />{myUtil.code.getCodeValByKey(param.text, 'CODE_DM_ZXSB_DZBAZT:01')}
        </span>
      );
    } else {
      col = (
        <span className="dd_grid_icon">
          <Badge status="error" />不存在
        </span>
      );
    }
    return col;
  },
}

const businessValidator = {
  hcsm:() => {
    const validator = (_rule: any, value: any) => {
      if (value != undefined && value != '') {
        if (value.length > 500) {
          return Promise.reject(new Error("输入长度超出限制,最大为500字符！"));//
        }
      }
      return Promise.resolve();
    };
    return { validator };
  },
};

export default dzhcFunc;
