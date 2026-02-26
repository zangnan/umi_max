import React, { useState, useRef, useEffect, useImperativeHandle } from 'react';
import * as VTable from '@visactor/vtable';
import { ListTable } from '@visactor/react-vtable';
import { DateInputEditor, InputEditor, ListEditor, TextAreaEditor } from '@visactor/vtable-editors';
import { SearchComponent } from '@visactor/vtable-search';
import { getReportGridData, baseEdit, updateDictByWeb } from '@/services/hts/api';
import CONSTANTS from '../DDAssist/constants';
import DDListTableUtil from './DDListTableUtil';
import myUtil from '../DDAssist/util';
import { Button, Form, Input, Space, message } from 'antd';
import { createGroup, createText, createImage, Tag, CheckBox, Radio } from '@visactor/vtable/es/vrender';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import excelV2Validator from '../DDBunit/excelConfig.v2.1.validator';
import { cloneDeep } from 'lodash';

export type DDListTableProps = {
  config?: any;
  func?: any;
  refDDListTable?: any;
  apiUpdate?: any;
  excelType?: any;
};

const DDListTable: React.FC<DDListTableProps> = ({
  config,
  func,
  refDDListTable: onRef,
  apiUpdate,
  excelType,
}) => {
  // const [ myOption, setMyOption ] = useState<any>({...DDListTableUtil.vtableConfigDefault, ...config});
  const [ myOption, setMyOption ] = useState<any>({});
  const [ myRecords, setMyRecords ] = useState<any>([]);
  const [ myRecordsChanged, setMyRecordsChanged ] = useState<any>([]);
  const [ tins, seTins ] = useState<any>(null);
  const api_grid_query = config?.api_grid_query;
  const gridParams = config?.gridParams;
  const initSearchModal = gridParams?.initSearchModal || [];
  const grid_row_key = config?.grid_row_key;
  const grid_selection_type = config?.grid_selection_type;
  const grid_handle_columns_default = config?.grid_handle_columns_default;
  const handle_columns = config?.handle_columns;
  const grid_show_serial_number = config?.grid_show_serial_number;
  const ref: any = useRef();
  const inputEditor = new InputEditor();
  const textAreaEditor = new TextAreaEditor();
  const dateInputEditor = new DateInputEditor();
  const listEditor = new ListEditor({ values: ['1免税', '2征税'] });
  const [ searchObj, setSearchObj ] = useState<any>(null);
  const [ searchResults, setSearchResults ] = useState<any>([]);
  const [ searchResultsIndex, setSearchResultsIndex ] = useState<any>(0);
  const [checkExcelMsg, setCheckExcelMsg] = useState<any>([]);
  const [form] = Form.useForm();

  VTable.register.editor('input-editor', inputEditor);
  VTable.register.editor('list-editor', listEditor);
  VTable.register.editor('date-input-editor', dateInputEditor);
  VTable.register.editor('textArea-editor', textAreaEditor);

  const getColHandle: any = () => {
    let colWidth = 0;
    if (grid_handle_columns_default?.edit) {
      colWidth += 50;
    }
    if (grid_handle_columns_default?.delete) {
      colWidth += 50;
    }
    if (grid_handle_columns_default?.detail) {
      colWidth += 50;
    }
    if (handle_columns?.length > 0) {
      colWidth += 50 * handle_columns.length;
    }
    let tmp: any ={
      field: 'handleCol',
      title: '操作',
      width: colWidth,
      customLayout: (args: any) => {
        const { table, row, col, rect } = args;
        const record = table.getCellOriginRecord(col, row);
        if (!record) {
          return {
            rootContainer: '',
            renderDefault: false
          };
        }
        const { height, width } = rect ?? table.getCellRect(col, row);
        const container = createGroup({ height, width, display: 'flex', flexWrap: 'nowrap', alignItems: 'center', justifyContent: 'space-around', });
        // 默认按钮
        if (grid_handle_columns_default?.edit) {
          container.add(createText({ ...DDListTableUtil.btnDefault.edit }));
        }
        if (grid_handle_columns_default?.delete) {
          container.add(createText({ ...DDListTableUtil.btnDefault.delete }));
        }
        if (grid_handle_columns_default?.detail) {
          container.add(createText({ ...DDListTableUtil.btnDefault.detail }));
        }
        // 自定义按钮
        for (let i = 0; i < handle_columns?.length; i++) {
          container.add(createText({ text: handle_columns[i].name, ...DDListTableUtil.css.link, key: handle_columns[i].key, func: handle_columns[i].func }));
        }
        return {
          rootContainer: container,
          renderDefault: false
        };
      }
    };
    return tmp;
  }

  // 是否显示操作列
  let showColHandle = () => {
    if (grid_handle_columns_default?.edit
        || grid_handle_columns_default?.delete
        || grid_handle_columns_default?.detail) {
      return true;
    }
    return false;
  }

  const getData = (cc: any) => {
    let tmpConfig: any = cloneDeep({ ...cc, ...DDListTableUtil.vtableConfigDefault });
    // 格式化列表列
    tmpConfig?.columns?.forEach((tmp: any) => {
      // columns dataIndex -> field
      if (tmp.field) {
      } else if (tmp.dataIndex) {
        tmp.field = tmp.dataIndex;
      }
      // 默认添加宽度auto
      if (!tmp.width) {
        tmp.width = 'auto';
      }
      // 数值格式化
      if (tmp?.render?.type === 'number') {
        tmp.fieldFormat = (data: any, col: any, row: any, table: any) => {
          return myUtil.text.formatNum(data[tmp.dataIndex], tmp.render.format);
        };
      }
      // 统计列
      if (tmp.sum2 || tmp.min2 || tmp.max2 || tmp.avg2) {
        if (tmp?.aggregation) {
        } else {
          tmp.aggregation = [];
          if (tmp.sum2) {
            tmp.aggregation.push({ aggregationType: 'SUM', showOnTop: true, formatFun(value: any) {
              return '数量合计:' + myUtil.text.formatNum(value, tmp.render.format);
            }});
          }
          if (tmp.min2) {
            tmp.aggregation.push({ aggregationType: 'MIN', showOnTop: false, formatFun(value: any) {
              return '最低数量:' + myUtil.text.formatNum(value, tmp.render.format);
            }});
          }
          if (tmp.max2) {
            tmp.aggregation.push({ aggregationType: 'MAX', showOnTop: false, formatFun(value: any) {
              return '最高数量:' + myUtil.text.formatNum(value, tmp.render.format);
            }});
          }
          if (tmp.avg2) {
            tmp.aggregation.push({ aggregationType: 'AVG', showOnTop: false, formatFun(value: any, col: any, row: any, table: any) {
              return '平均:' + myUtil.text.formatNum(value, tmp.render.format) + '，(共计' + table.recordsCount + '条数据)';
            } });
          }
        }
      }
      if (tmp.columns) {
        tmp?.columns?.forEach((tmp2: any) => {
          // columns dataIndex -> field
          if (tmp2.field) {
          } else if (tmp2.dataIndex) {
            tmp2.field = tmp2.dataIndex;
          }
          // 默认添加宽度auto
          if (!tmp2.width) {
            tmp2.width = 'auto';
          }
          // 数值格式化
          if (tmp2?.render?.type === 'number') {
            tmp2.fieldFormat = (data: any, col: any, row: any, table: any) => {
              return myUtil.text.formatNum(data[tmp2.dataIndex], tmp2.render.format);
            };
          }
          // 统计列
          if (tmp2.sum2 || tmp2.min2 || tmp2.max2 || tmp2.avg2) {
            if (tmp2?.aggregation) {
            } else {
              tmp2.aggregation = [];
              if (tmp2.sum2) {
                tmp2.aggregation.push({ aggregationType: 'SUM', showOnTop: true, formatFun(value: any) {
                  return '数量合计:' + myUtil.text.formatNum(value, tmp2.render.format);
                }});
              }
              if (tmp2.min2) {
                tmp2.aggregation.push({ aggregationType: 'MIN', showOnTop: false, formatFun(value: any) {
                  return '最低数量:' + myUtil.text.formatNum(value, tmp2.render.format);
                }});
              }
              if (tmp2.max2) {
                tmp2.aggregation.push({ aggregationType: 'MAX', showOnTop: false, formatFun(value: any) {
                  return '最高数量:' + myUtil.text.formatNum(value, tmp2.render.format);
                }});
              }
              if (tmp2.avg2) {
                tmp2.aggregation.push({ aggregationType: 'AVG', showOnTop: false, formatFun(value: any, col: any, row: any, table: any) {
                  return '平均:' + myUtil.text.formatNum(value, tmp2.render.format) + '，(共计' + table.recordsCount + '条数据)';
                } });
              }
            }
          }
        })
      }
    })

    if (grid_selection_type === 'checkbox') {
      tmpConfig.columns.unshift({ ...DDListTableUtil.colDefault.checkbox });
    }
    if (tmpConfig.grid_show_serial_number) {
      if (tmpConfig.rowSeriesNumber) {
        tmpConfig.rowSeriesNumber = tmpConfig.rowSeriesNumber;
      } else {
        tmpConfig.rowSeriesNumber = { ...DDListTableUtil.colDefault.index };
      }
    }
    // if (tmpConfig.rowSeriesNumber) {
    //   // 自定义rowSeriesNumber，优先级最高
    // } else if (tmpConfig.grid_show_serial_number) {
    //   tmpConfig.rowSeriesNumber = { ...DDListTableUtil.colDefault.index };
    // }
    if (showColHandle()) {
      tmpConfig.columns.push(getColHandle());
    }
    // 设置样式
    tmpConfig?.columns?.map((tmp: any) => {
      tmp.headerStyle = DDListTableUtil.css.headerStyle;
      tmp.style = {...(tmp.style || {}), ...DDListTableUtil.css.bodyStyle};
      tmp.style.textAlign = tmp?.render?.type === 'number' ? 'right' : 'left';
      if (tmp.columns) {
        tmp?.columns?.map((tmp2: any) => {
          tmp2.headerStyle = DDListTableUtil.css.headerStyle;
          tmp2.style = DDListTableUtil.css.bodyStyle;
          tmp2.style.textAlign = tmp2.render?.type === 'number' ? 'right' : 'left';
        })
      }
    })

    setMyOption(tmpConfig);
    if (api_grid_query) {
      getReportGridData(api_grid_query, {
        // searchModel: {page: 1, pageSize: 100, searchModel: []}
        page: 1, pageSize: 99999, searchModel: [...initSearchModal],
      }).then((response: any) => {
        let tmpData: any = []
        if (response?.body?.rows) {
          tmpData = response?.body?.rows;
        } else if (response?.body) {
          tmpData = response?.body;
        } else {
          tmpData = response;
        }

        // 处理数据 日期
        let columnsTmp: any = tmpConfig.columns || [];
        let colNeedFormat: any = [];
        for (let i = 0; i < columnsTmp.length; i++) {
          if (columnsTmp[i]?.render?.type === 'date'
              || columnsTmp[i]?.render?.type === 'number'
              || columnsTmp[i]?.codeTable) {
            colNeedFormat.push(columnsTmp[i]);
          }

          if (columnsTmp[i].columns) {
            for (let m = 0; m < columnsTmp[i].columns.length; m++) {
              if (columnsTmp[i].columns[m]?.render?.type === 'date'
                  || columnsTmp[i].columns[m]?.render?.type === 'number'
                  || columnsTmp[i].columns[m]?.codeTable) {
                colNeedFormat.push(columnsTmp[i].columns[m]);
              }
            }
          }
        }
        if (colNeedFormat.length > 0) {
          tmpData.map((tmp: any) => {
            Object.keys(tmp).forEach(key => { // 遍历行数据
              for (let n = 0; n < colNeedFormat.length; n++) { // 遍历需要处理的列
                if (key === colNeedFormat[n].field) {
                  if (colNeedFormat[n]?.render?.type === 'date') { // 日期格式化
                    tmp[key] = myUtil.date.formatDate(tmp[key], colNeedFormat[n].render.format);
                  } else if (colNeedFormat[n]?.render?.type === 'number') { // 数值格式化
                    // tmp[key] = myUtil.text.formatNum(tmp[key], colNeedFormat[n].render.format);
                  } else if (colNeedFormat[n]?.codeTable) { // 码表格式化
                    tmp[key] = myUtil.code.getCodeValByKey(tmp[key], colNeedFormat[n].codeTable);
                  }
                }
              }
            });
          })
        }

        setMyRecords(tmpData || []);
      })
    }
  }

  const initSearchRes = (searchResult: any) => {
    let len: any = (searchResult?.results || []).length;
    setSearchResults(searchResult?.results || []);
    setSearchResultsIndex(len !== 0 ? searchResult?.index + 1 : 0);
  }

  // advSearch
  const advSearch = () => {
    let filterKey: any = form.getFieldValue('filterKey');
    const searchResult: any = searchObj.search(filterKey);
    initSearchRes(searchResult);
  }

  // advSearchNext
  const advSearchNext = () => {
    const searchResult: any = searchObj.next(); // 跳转到下一条搜索结果
    initSearchRes(searchResult);
  }

  // advSearchPrev
  const advSearchPrev = () => {
    const searchResult: any = searchObj.prev(); // 跳转到上一条搜索结果
    initSearchRes(searchResult);
  }

  // getRecords
  const getRecordsChanged = () => {
    return myRecordsChanged;
  }

  // onTableReady
  const onTableReady = ({tableInstance, isFirst}: any) => {
    if (isFirst) {
      seTins(tableInstance);
      let search = new SearchComponent({
        table: tableInstance,
        autoJump: true
      });
      setSearchObj(search);
      tableInstance.on('click_cell', (args: any) => {
        const { col, row, targetIcon, cellType, target } = args;
        let txt = target?.attribute?.text;
        if (txt === '编辑') {
          DDListTableUtil.fun.edit({...args, tableInstance});
        } else if (txt === '删除') {
          DDListTableUtil.fun.delete({...args, tableInstance});
        } else if (txt === '详情') {
          DDListTableUtil.fun.detail({...args, tableInstance});
        } else {
          // 非预制按钮
          let key = target.attribute?.key;
          let funcName = target.attribute?.func;
          if (key && funcName && DDListTableUtil.fun[funcName]) {
            DDListTableUtil.fun[funcName]({...args, tableInstance, key, func: funcName});
          }
        }
      });
    }
    if (func?.onReady) {
      func.onReady({
        tableInstance,
        isFirst,
        myRecordsChanged,
        grid_row_key,
      })
    }
  }

  // handleDropdownMenuClick
  const handleDropdownMenuClick = (args: any) => {
    if (func?.onDropdownMenuClick) {
      func.onDropdownMenuClick({
        ...args,
        tableInstance: tins,
        myRecordsChanged,
        grid_row_key,
      })
    }
  }

  // onTanleChangeCellValue
  const onTanleChangeCellValue = (args: any) => {
    let { row, col, currentValue, rawValue, changedValue } = args;
    let changedRecord = tins.getRecordByCell(col, row);
    let changedIndex = myRecordsChanged.findIndex((tmp: any) => {
      return tmp[grid_row_key] === changedRecord[grid_row_key];
    });
    let editType = changedRecord?.editType || 'update';
    if (changedIndex < 0) {
      myRecordsChanged.push({ ...changedRecord, recordRowIndex: row, editType });
    } else {
      myRecordsChanged[changedIndex] = { ...changedRecord, recordRowIndex: row, editType};
    }
    setMyRecordsChanged(myRecordsChanged);
  }

  // useEffect
  useEffect(() => {
    getData(config);
  }, [config]);

  // getRecords
  const getRecords = () => {
    let records = tins?.records;
    return records;
  }

  // 校验
  const checkChangedData = (recordsAll: any) => {
    const checkExcelFront: any = () => {
      let recordsModuleFormat: any = myUtil.text.camelToUnderscoreArray(recordsAll || []);
      let msg = excelV2Validator.run({ excelData: [
        { type: excelType, data: recordsModuleFormat },
      ], pageFrom: 'onlineEdit' });
      return {
        msg
      };
    }
    let aaa: any = [];
    let excelCheckMsg = checkExcelFront();
    if (excelCheckMsg?.msg?.length > 0) {
      aaa.push(excelCheckMsg);
    }
    setCheckExcelMsg(aaa);
    if (aaa?.length > 0) {
      message.info('填报异常');
      return false;
    }
    return true;
  }

  // 保存 前端
  const saveRecordFrontEnd = () => {
    let recordsAll = getRecordsChanged() || [];
    // 校验
    let checkRes: any = checkChangedData(recordsAll);
    if (!checkRes) {
      return;
    }

    let filesTmp: any = [];
    const promiseArr: any = [];
    for (let i = 0; i < recordsAll.length; i += 1) {
      const formData = recordsAll[i];
      let param: any = {
        data: {
          ...formData,
          formType: 'edit',
        },
        url: apiUpdate,
      };
      delete param.data.recordRowIndex;
      delete param.data.editType;
      let tmpCodeTable = baseEdit(param);
      promiseArr.push(tmpCodeTable);
      filesTmp.push(formData);
    }
    // debugger;
    const allSettledPromise = Promise.allSettled(promiseArr);
    allSettledPromise.then(function (results: any) {
      for (let i = 0; i < results.length; i++) {
        const { status, value } = results[i];
        if (status === 'fulfilled') {
          const { code, codeDesc } = value;
          filesTmp[i].promise = code === '200' ? 'success' : 'error';
          filesTmp[i].promiseCode = code;
          filesTmp[i].promiseCodeDesc = codeDesc;
          filesTmp[i].promiseMsg = code === '200' ? value[CONSTANTS.RESPONSE.MESSAGE_KEY_SUCCESS] : JSON.stringify(value[CONSTANTS.RESPONSE.MESSAGE_KEY_ERROR]);
        } else if (status === 'rejected') {
          filesTmp[i].promise = 'error';
          filesTmp[i].promiseCode = '-';
          filesTmp[i].promiseCodeDesc = '请求失败';
          filesTmp[i].promiseMsg = JSON.stringify(value);
        }
      }
      message.info('提交成功');
    });
  }

  // 保存 后端
  const saveRecord = () => {
    let recordsAll = getRecordsChanged() || [];
    // 校验
    let checkRes: any = checkChangedData(recordsAll);
    if (!checkRes) {
      return;
    }
    let apiParam: any = {};
    if (excelType === 'module') {
      apiParam.module = recordsAll;
    } else if (excelType === 'field') {
      apiParam.dict = recordsAll;
    }
    updateDictByWeb(apiParam).then((response: any) => {
      let { code, msg} = response;
      myUtil.modal.responseInfo({code, msg});
    })
  }

  // useImperativeHandle
  useImperativeHandle(onRef, () => {
    return {
      getRecords,
      getRecordsChanged
    };
  });

  return (<>
    {excelV2Validator.singleExcelMsgNodeFront(checkExcelMsg)}
    <div>
    </div>
    <Form layout='inline' name="basic" form={form} autoComplete="off" style={{margin: '0px 6px 6px 6px'}}>
      <Form.Item name="filterKey" >
        <Input />
      </Form.Item>
      <Form.Item label={null}>
        <Space>
          <Button onClick={() => advSearch()}>查询</Button>
          <div>
            <span>{searchResultsIndex} / {searchResults.length}</span>
            <span></span>
            <span></span>
          </div>
          <Button icon={<UpOutlined />} onClick={() => advSearchPrev()}></Button>
          <Button icon={<DownOutlined />} onClick={() => advSearchNext()}></Button>
        </Space>
      </Form.Item>
      <Form.Item>
        <Space>
          <Button type='primary' onClick={saveRecordFrontEnd}>保存【前端】</Button>
          <Button type='primary' onClick={saveRecord}>保存【后端】</Button>
        </Space>
        {/* <Button type="primary" onClick={() => getRecordsChanged()}>getRecordsChanged</Button> */}
        {/* <Button type="primary" onClick={() => getRecords()}>getRecords</Button> */}
      </Form.Item>
    </Form>

    <ListTable
      option={myOption}
      height={config.height || 500}
      ref={ref}
      records={myRecords}
      onReady={(tableInstance: any, isFirst: any) => { onTableReady({tableInstance, isFirst});}}
      onChangeCellValue={(args: any) => { onTanleChangeCellValue(args); }}
      onDropdownMenuClick={(args: any) => { handleDropdownMenuClick(args); }}
      // onMouseMoveCell={args => { console.log('onMouseMoveCell', args); }}
    />
  </>);
};

export default DDListTable;
