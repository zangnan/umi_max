// 通用业务功能
import { message, notification } from 'antd';
import { baseDelete, baseShow, callServiceCheck, baseEdit, baseEditFormData, batchDeleteByModel } from '@/services/hts/api';
import { getOneTimeToken, downloadGet, automaticExport, getGridData } from '@/services/hts/api';
import myUtil, { intl as intl2 } from '../DDAssist/util';
import dayjs from "dayjs";
import { itemType } from '../DDForm/data.d';
import BraftEditor from 'braft-editor';
import CONSTANTS from '../DDAssist/constants';
import printJS from 'print-js'

const Func: any = {};

// 删除
Func.delete = ({deleteType, pageId, selectionRowKeys, selectionRows, record, event, unitKey,
      rowKey, apiFormDelete, refUnit, refGrid, reload, func, getYwKey, deleteKey,
      getGridParams }: any) => {
  let searchModelForDelConditon: any;
  if (deleteType === 'batch') { // 删除: 批量
    if (selectionRowKeys?.length <= 0) {
      message.info(intl2.formatMessage({ id: 'message_delete_unselected' }));
      return;
    }
  } else if (deleteType === 'row') { // 删除: 单条
    event?.stopPropagation(); // 单条删除时，取消联系默认动作
  } else if (deleteType === 'condition') { // 删除: 条件筛选
    let aa = getGridParams() || {};
    let searchModel = aa.searchModel || [];
    let headerSearchModel = aa.headerSearchModel || [];
    searchModelForDelConditon = [...searchModel, ...headerSearchModel];
    if (searchModelForDelConditon?.length <= 0) {
      message.info('请完成筛选查询后执行删除。');
      return;
    }
  }
  // 删除前调用
  if (func?.beforeDelete) {
    let result;
    const beforeResult = func.beforeDelete({
      pageId,
      unitKey,
      refUnit,
      selectionRowKeys,
      selectionRows,
      record
    });
    result = beforeResult !== undefined ? beforeResult : true;
    if (!result) {
      return
    }
  }

  // 获取联合主键数组
  // 格式： [{ key1: 111, key2: 222}, { key1: 333, key2: 444}, ... ]
  const getCompositeKeysObj = (selRows: any) => {
    let compKeys: any = [];
    for (let i = 0; i < selRows.length; i++) {
      let tmp: any = {};
      Object.keys(selRows[i]).forEach((key) => {
        if (rowKey.indexOf(key) > -1) {
          tmp[key] = selRows[i][key];
        }
      });
      compKeys.push(tmp);
    }
    return compKeys;
  }

  myUtil.modal.confirm({
    title: '系统提示',
    content: deleteType === 'condition' ? '确定删除当前筛选条件及筛选结果下的所有数据吗？' : intl2.formatMessage({ id: 'message_inquiry_delete' }),
    onOk() {
      const data: any = {
        key: unitKey || ''
      };
      let apiDelete: any = baseDelete;
      let apiParam: any;
      if (deleteType === 'batch') {
        if (Array.isArray(rowKey)) { // 联合主键
          // data[deleteKey] = selectionRowKeys; // 或根据后端接口调整入参
          // 新
          data[deleteKey] = getCompositeKeysObj(selectionRows); // 或根据后端接口调整入参
          data.selectionRowKeys = selectionRowKeys;
        } else {
          data[deleteKey] = selectionRowKeys;
        }
        apiParam= { data, url: apiFormDelete };
      } else if (deleteType === 'condition') {
        apiDelete = batchDeleteByModel;
        apiParam= {
          key: unitKey,
          searchModel: searchModelForDelConditon,
        };
      } else {
      // } else if (deleteType === 'row') {
        if (Array.isArray(rowKey)) { // 联合主键
          // data[deleteKey] = [getYwKey(record)]; // 或根据后端接口调整入参
          // 新
          data[deleteKey] = getCompositeKeysObj([record]); // 或根据后端接口调整入参
          data.selectionRowKeys = [getYwKey(record, rowKey)];
        } else {
          data[deleteKey] = [record[rowKey]]; // 单一主键
        }
        apiParam= { data, url: apiFormDelete };
      }
      return apiDelete(apiParam).then((response: any) => {
        const { code, body } = response;
        if (code === '200') {
          message.success(intl2.formatMessage({ id: 'message_delete_success' }));
          reload();
          if (func?.afterFormDeleteSuccess) {
            func.afterFormDeleteSuccess({
              unitKey,
            });
          }
        } else {
          // 删除失败回调
          if (func.afterDeletionFailure) {
            func.afterDeletionFailure({
              refUnit,
              refGrid,
              body,
            });
          } else{
            message.error(intl2.formatMessage({ id: 'message_delete_error' }));
          }
        }
      })
    },
  });
};

// 打开详情 行入口
Func.popupDetail = ({record, event, setMasker, setFormType, unitKey, rowKey, getYwKey, apiFormQuery, setDescriptionsConfig,
    formItems, form, func, pageId, refUnit, handleModalVisible, setFormItems, getEditValueByGrid }: any) => {
  setMasker(true);
  setFormType('edit');
  event?.stopPropagation();
  const param: any = { key: unitKey || '' }
  if (Array.isArray(rowKey)) { // 联合主键
    rowKey.forEach((rowKeyItem: any) => {
      param[rowKeyItem] = record[rowKeyItem];
    });
  } else {
    param[rowKey] = record[rowKey]; // 单一主键
  }
  const setFormValue = (val: any) => {
    setDescriptionsConfig({
      form_items: formItems,
      form_value: { ...val },
    });
    handleModalVisible(true);
  }
  if (getEditValueByGrid) { // 直接通过grid获取编辑数据
    setFormValue(record);
    setMasker(false);
  } else {
    baseShow({ data: param, url: apiFormQuery }).then((response: any) => {
      setMasker(false);
      const { code, body } = response;
      if (code === '200') {
        setFormValue(body);
      } else {
        message.error(intl2.formatMessage({ id: 'message_query_error' }));
      }
    })
  }
}

// 打开编辑弹窗 行入口
Func.popupUpdate = ({record, event, setMasker, setFormType, unitKey, rowKey, getYwKey, apiFormQuery,
    formItems, form, func, pageId, refUnit, handleModalVisible, setFormItems, getEditValueByGrid, config }: any) => {
  setMasker(true);
  setFormType('edit');
  event?.stopPropagation();
  const param: any = {
    key: unitKey || '',
  }
  if (Array.isArray(rowKey)) { // 联合主键
    // param.ywKeys = [getYwKey(record)]; // 或根据后端接口调整入参
    rowKey.forEach((rowKeyItem: any) => {
      param[rowKeyItem] = record[rowKeyItem];
    });
  } else {
    param[rowKey] = record[rowKey]; // 单一主键
  }
  const setFormValue = (val: any) => {
    const formValue = { ...val };
    // 表单特殊类型处理
    formItems.forEach((item: any) => {
      if (formValue[item.name]?.constructor === String) {
        formValue[item.name] = formValue[item.name]?.trim() || '';
      }
      if (item.type === itemType.DatePicker && formValue[item.name]) {  // 日期类型
        const reg1 = /^((([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})(((0[13578]|1[02])(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)(0[1-9]|[12][0-9]|30))|(02(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))0229))$/;
        const reg2 = /^((([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29))$/;
        if (new RegExp(reg1).test(formValue[item.name]) || new RegExp(reg2).test(formValue[item.name])) {
          // 后端返回 yyyymmdd
          formValue[item.name] = dayjs(new Date(formValue[item.name]))
        } else {
          // 后端返回时间戳格式
          if (formValue[item.name]?.constructor === String) {
            formValue[item.name] = dayjs(new Date(Number(formValue[item.name])));
          } else {
            formValue[item.name] = dayjs(new Date(formValue[item.name]));
          }
        }
      }
      if (item.type === itemType.InputNumber && formValue[item.name]?.constructor === String) {
        formValue[item.name] = Number(formValue[item.name]);
      }
      if (item.type === itemType.Input && formValue[item.name]?.constructor === String && (formValue[item.name] === null || formValue[item.name]?.trim() === '')) {
        formValue[item.name] = '';
      }
      if (item.type === itemType.Select && item.mode === 'multiple') {
        if (formValue[item.name]) {
          if (!Array.isArray(formValue[item.name])) {
            formValue[item.name] = formValue[item.name]?.split(',') || [];
          } else {
            formValue[item.name] = formValue[item.name] || [];
          }
        } else {
          formValue[item.name] = [];
        }
      }
      if (item.type === itemType.Cascader) {
        if (formValue[item.name]) {
          if (!Array.isArray(formValue[item.name])) {
            formValue[item.name] = formValue[item.name]?.split(',') || [];
          } else {
            formValue[item.name] = formValue[item.name] || [];
          }
        } else {
          formValue[item.name] = [];
        }
      }
      if (item.type === itemType.RichTextEditor && formValue[item.name]) {
        formValue[item.name] = BraftEditor.createEditorState(formValue[item.name]);
      }
      if (item.type === itemType.MarkdownEditor && formValue[item.name]) {
        formValue[item.name] = {
          mdContent: formValue[item.name],
        }
      }
    })
    form.resetFields();
    if (Object.keys(formValue).length !== 0) {
      form.setFieldsValue(formValue);
    } else {
      // form.resetFields();
      message.error(intl2.formatMessage({ id: 'message_query_error' }));
      return
    }
    if (func.initEditForm) {
      func.initEditForm({
        formValue,
        form,
        pageId,
        unitKey,
        refUnit,
        handleModalVisible,
        formItems,
        setFormItems,
        config,
      });
    } else {
      handleModalVisible(true);
    }
  }
  if (getEditValueByGrid) { // 直接通过grid获取编辑数据
    setFormValue(record);
    setMasker(false);
  } else {
    baseShow({ data: param, url: apiFormQuery }).then((response) => {
      setMasker(false);
      const { code, body } = response;
      if (code === '200') {
        setFormValue(body);
      } else {
        message.error(intl2.formatMessage({ id: 'message_query_error' }));
      }
    })
  }
}

// 新建、编辑保存
Func.handleSave = ({masker2, formItems, form, unitKey, formType, myFormSaveCheck, func, pageId,
    refUnit, handleModalVisible, setFormItems, setMasker2, apiFormCheck, afterSaveSuccess,
    apiFormEdit, reload, form_submit_type, leafConfig}: any) => {
  if(masker2) {
    return;
  }
  // 表单特殊类型处理
  formItems.forEach((item: any) => {
    // 去除后端空格
    if (item.type === itemType.Input && typeof form.getFieldValue(item.name) === 'string') {
      let itemValueTmp: any = {};
      itemValueTmp[item.name] = form.getFieldValue(item.name)?.trim() || '';
      form.setFieldsValue(itemValueTmp);
    }
  })
  form.validateFields().then(async (values: any) => {
    // 格式化表单数据
    myUtil.module.formatFormValue({ formItems: formItems, formValues: values });
    const param: any = {
      key: unitKey,
      formType: formType,
      ...values,
      // data: values,
    }
    // 是否为叶子表 一对多表
    if (leafConfig?.dictFieldName && leafConfig?.dictFieldValue) {
      param[leafConfig?.dictFieldName] = leafConfig?.dictFieldValue;
    }
    // 是否执行后端校验
    let Check = [ 'MDT_ZXSB_SB_MDT_TLHY_G', 'MDT_ZXSB_SB_MDT_STZC_G', 'MDT_ZXSB_SB_MDT_SYYK_G' ];
    // 如果未配置
    let needCheck = myFormSaveCheck;
    if (myFormSaveCheck === undefined) {
      if (!(Check.indexOf(unitKey) < 0)) {
        needCheck = true;
      }
    }
    // 表单提交前调用
    if (func.formBeforeSubmit) {
      let result;
      const beforeResult = await func.formBeforeSubmit({
        form,
        pageId,
        unitKey,
        refUnit,
        handleModalVisible,
        formItems,
        setFormItems,
        param,
      });
      result = beforeResult !== undefined ? beforeResult : true;
      if (!result) {
        return
      }
    }
    if (needCheck) {
      setMasker2(true);
      callServiceCheck({ unitKey: unitKey + '_CHECK', data: values, url: apiFormCheck }).then((response1) => {
        const { code, desc } = response1;
        if (code === '200') {
          return baseEdit({ data: param, url: apiFormEdit });
        } else if (code === '901') {
          setMasker2(false);
          myUtil.modal.confirm({
            title: '系统提示',
            content: desc,
            okText: '继续',
            onOk() {
              handleModalVisible(false);
              reload();
              setMasker2(true);
              return baseEdit({ data: param, url: apiFormEdit }).then((response) => {
                Func.handleSave2({response, handleModalVisible, setMasker2, reload, func });
              });
            },
          });
        } else {
          setMasker2(false);
          message.error(desc);
        }
      }).then((response) => {
        if (response) {
          Func.handleSave2({response, handleModalVisible, setMasker2, reload, func });
        } else {
          setMasker2(false);
        }
      }).catch((error) => {
        setMasker2(false);
        message.error(error.message);
      });
    } else {
      setMasker2(true);
      if (form_submit_type === 'FormData') { // 判断是否采用FormData格式
        const formData = new FormData();
        Object.keys(param).forEach(key => {
          // 判断是否为附件
          let tmpItem = formItems?.find((item: any) => { return item.name === key });
          if (tmpItem?.type === itemType.Upload || tmpItem?.type === itemType.UploadPicture
              || tmpItem?.type === itemType.UploadVideo || tmpItem?.type === itemType.UploadAudio) {
            console.info(tmpItem);
            if (Array.isArray(param[key]) && param[key].length === 1) { // 仅一个附件时，直接绑定文件，erhuohouduan
              formData.append(key, param[key][0].originFileObj);
            } else {
              formData.append(key, param[key]);
            }
          } else {
            if (param[key]) {
              formData.append(key, param[key]);
            }
          }
        });
        if (func.formSubmit) { // 自行处理提交事件
          func.formSubmit({
            data: formData,
            url: apiFormEdit,
            handleSave2: Func.handleSave2,
            handleModalVisible,
            setMasker2,
            reload,
            originalData: param,
            setFormItems,
            formItems,
          })
        } else { // 默认提交事件
          baseEditFormData({ data: formData, url: apiFormEdit }).then((response) => {
            Func.handleSave2({response, handleModalVisible, setMasker2, reload, func });
          })
        }
      } else {
        baseEdit({ data: param, url: apiFormEdit }).then((response) => {
          Func.handleSave2({response, handleModalVisible, setMasker2, reload, func, unitKey });
        })
      }
    }
  })
}

// 新建、编辑保存
Func.handleSave2 = ({response, handleModalVisible, setMasker2, reload, func, unitKey}: any) => {
  const { code, desc, msg } = response;
  if (code === '200') {
    message.success(desc || '保存成功');
    handleModalVisible(false);
    setMasker2(false);
    reload();
    if (func?.afterFormSaveSuccess) {
      func.afterFormSaveSuccess({
        unitKey,
      });
    }
  } else {
    setMasker2(false);
    if (msg) {
      notification.error({
        message: '保存失败',
        description: <>{JSON.stringify(msg)}</>,
        placement: 'top',
        duration: null,
      });
    } else {
      message.error(desc || '保存失败');
    }
  }
}

// 前端导出
Func.handleExportFront = (param: any) => {
  const { apiGridQuery, setMasker, refDDExportFront, gridParams, refUnit, sheetName, excelName, selectionRows, columns } = param;
  let plainColumns = myUtil.grid.formatColToPlain([...columns]);
  // 勾选导出
  if (selectionRows?.length > 0) {
    myUtil.modal.confirm({
      title: '导出',
      content: '将导出选中数据，是否确认？',
      onOk() {
        refDDExportFront.current!.showModal({
          gridData: myUtil.grid.formatGridData(selectionRows, plainColumns),
          sheetName,
          excelName,
          param: {
            refUnit,
          },
        });
      },
    });
    return;
  }
  // 筛选条件导出
  setMasker(true);
  myUtil.modal.confirm({
    title: '导出',
    content: '将导出当前筛选条件下的所有数据，是否确认？',
    onOk() {
      getGridData(apiGridQuery, {page: 1, pageSize: 999999, searchModel: gridParams?.searchModel || []}).then((response) => {
        if (response?.code === '200') {
          let gridData: any = [];
          if (response?.body?.rows && response?.body?.rows.length > 0) {
            gridData = response?.body?.rows;
          } else {
            gridData = response?.body;
          }
          gridData = myUtil.grid.formatGridData([
            ...gridData,
          ], plainColumns);
          setMasker(false);
          refDDExportFront.current!.showModal({
            gridData: gridData,
            sheetName,
            excelName,
            param: {
              refUnit,
            },
          });
        } else {
          // setMasker(false);
        }
      });
    },
    onCancel() {
      setMasker(false);
    }
  });
}

// 原在线申报系统模块：导出
Func.handleExport = (param: any) => {
  const { unitKey, gridParams, gridData = [], url } = param;
  if (gridData.length === 0) {
    message.info('当前筛选条件下无数据，请确认！');
    return;
  }
  myUtil.modal.confirm({
    title: '导出',
    content: '将导出当前筛选条件下的所有数据，是否确认',
    // onOk() {
    onOk: async function () {
      // let url: any = `/hx/ty/report/excelReportGet/${unitKey}/`;
      let tmp: any;
      let searchModel: any = [];
      gridParams.searchModel.forEach((item: any) => {
        searchModel.push(item);
      });
      gridParams.initSearchModal.forEach((item: any) => {
        searchModel.push(item);
      });
      let adQuery:any = searchModel || [];
      // get导出
      tmp = {
        page: 1,
        // pageSize: CONSTANTS.GRID_PAGINATION_PAGESIZE,
        pageSize: myUtil.theme.getThemeItem('gridPaginationPagesize'),
        adQuery: JSON.stringify(adQuery),
      }
      // return await Func.download(url, tmp); // 弃用get导出 老申报系统 saas
      return await Func.downloadPost({ url, searchModel, unitKey });
    },
  });
};

// 导出
Func.downloadPost = async (params: any) => {
  const unitKey: any = params?.unitKey;
  const url: any = params.url;
  // params = { test_date: 'aa' }; // 测试下载失败
  const responseType: any = 'blob';
  params.responseType = responseType;
  // automaticExport(unitKey, params, responseType).then((response: any) => {
  automaticExport(url, unitKey, params, responseType).then((response: any) => {
    if (responseType === 'blob') { // 请求返回blob格式
      const { headers = {}, data } = response;
      myUtil.file.readBlobData(data).then((text: any = '') => {
        if (text.indexOf('code') > -1 && text.indexOf('codeDesc') > -1 && text.indexOf('msg') > -1) {
          const jsonObject = JSON.parse(text);
          message.info(jsonObject?.msg || '下载失败');
        } else {
          const contentDisposition = headers['content-disposition'] || '';
          let fileName = contentDisposition ? contentDisposition.split('filename=')[1] : 'downloadFile';
          myUtil.file.downloadFile(data, fileName);
        }
      }).catch((error: any) => {
        console.error(error);
      });
    } else { // 请求返回 { code, body: {blob字符串, fileName}, msg}
      const { code, body, msg } = response;
      if (code === '200') {
        myUtil.file.downloadCommon(body?.blob, body?.fileName, 'application/vnd.ms-excel');
      } else {
        message.info(msg || '下载失败');
      }
    }
    return;
  }).catch(() => {
  }).finally(() => {
  });
}

// 导出
Func.download = async (url: any, params: any) => {
  // 获取一次性token
  await getOneTimeToken({}).then(async(response1: any) => {
    if (response1.code === '200') {
      return await downloadGet(params, url, response1.body);
    }
    message.error(response1.desc);
    throw new Error(response1.desc);
  }).then((response2: any) => {
    const type = response2?.data?.type;
    if('application/octet-stream' === type ){
      const aLink = document.createElement('a');
      document.body.appendChild(aLink);
      aLink.style.display='none';
      const objectUrl = window.URL.createObjectURL(response2.data);
      aLink.href = objectUrl;
      const { headers } = response2.response;
      const contentDisposition = headers.get('Content-Disposition');
      let fileName = contentDisposition ? contentDisposition.split('filename=')[1] : 'downloadFile';
      fileName = decodeURI(fileName);
      aLink.download = fileName;
      aLink.click();
      document.body.removeChild(aLink);
    } else {
      const reader: any = new FileReader();
      reader.readAsText(response2?.data, 'utf8');
      reader.onload = function() {
        const obj: any =  JSON.parse(this.result);
        message.error(obj?.msg);
      }
    }
  })
}

// 前端打印
Func.handlePrintFront = (param: any) => {
  const { apiGridQuery, setMasker, refDDExportFront, gridParams, refUnit, sheetName, excelName, selectionRows, columns } = param;
  let plainColumns = myUtil.grid.formatColToPlain([...columns]);
  plainColumns.forEach((itemTmp: any) => {
    itemTmp.field = itemTmp.dataIndex || '';
    itemTmp.displayName = itemTmp.title || '';
  });
  // 勾选打印
  if (selectionRows?.length > 0) {
    myUtil.modal.confirm({
      title: '打印',
      content: '将打印选中数据，是否确认？',
      onOk() {
        refDDExportFront.current!.showModal({
          gridData: myUtil.grid.formatGridData(selectionRows, plainColumns),
          sheetName,
          excelName,
          param: {
            refUnit,
          },
          actionType: 'print',
        });
      },
    });
    return;
  }
  // 筛选条件打印
  setMasker(true);
  myUtil.modal.confirm({
    title: '打印',
    content: '将打印当前筛选条件下的所有数据，是否确认？',
    onOk() {
      getGridData(apiGridQuery, {page: 1, pageSize: 999999, searchModel: gridParams?.searchModel || []}).then((response: any) => {
        if (response?.code === '200') {
          let gridData: any = [];
          if (response?.body?.rows && response?.body?.rows.length > 0) {
            gridData = response?.body?.rows;
          } else {
            gridData = response?.body;
          }
          gridData = myUtil.grid.formatGridData([
            ...gridData,
          ], plainColumns);
          setMasker(false);
          refDDExportFront.current!.showModal({
            gridData: gridData,
            sheetName,
            excelName,
            param: {
              refUnit,
            },
            actionType: 'print',
          });
        } else {
          // setMasker(false);
        }
      });
    },
    onCancel() {
      setMasker(false);
    }
  });
}
export default Func;