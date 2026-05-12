import DDIT_TOOL_CONSTANTS from './excelConfig.v2.constants';
import CONSTANTS from '../DDAssist/constants';
import myUtil from '../DDAssist/util';
import { itemType } from '../DDForm/data.d';
import { DEFAULT_CONFIG } from '../DDBunit/excelConfig.v2.constants';
import { cloneDeep } from 'lodash';

const CONFIG_KEY = DDIT_TOOL_CONSTANTS.CONFIG_KEY;

// 提示信息
const assemble_config_util: any = {};

// Module
assemble_config_util.module = {
  // config 组装全部属性
  assembleAll(param: any) {
    let { moduleInfo, appTableDict } = param;
    let sheet1Info: any = myUtil.text.camelToUnderscoreObj(moduleInfo || {});
    let sheet2Info: any =  myUtil.text.camelToUnderscoreArray(appTableDict || []);
// console.info(sheet2Info);
    // 列表项
    let sheet2ArrGrid: any = sheet2Info.filter((tmp: any) => (tmp[CONFIG_KEY.GRID_USED] === '1'));
    // 表单项
    let sheet2ArrForm: any = sheet2Info.filter((tmp: any) => (tmp[CONFIG_KEY.FORM_ITEM_USED] === '1'));
    // 筛选项
    let filterArr = [];
    for (let eld = 0; eld < sheet2ArrGrid.length; eld++) {
      if (sheet2ArrGrid[eld][CONFIG_KEY.FILTER_ITEM_TYPE]) {
        filterArr.push(sheet2ArrGrid[eld]);
      }
    }
    // 组装视图配置数据
    let excelConfig = {
      ...DEFAULT_CONFIG,
      ...assemble_config_util.module.getModule(sheet1Info), // Module
      ...assemble_config_util.module.getModuleGrid(sheet1Info), // Grid
      ...assemble_config_util.module.getModuleForm(sheet1Info), // Form
      ...assemble_config_util.module.getModuleApi(sheet1Info), // Api
      ...assemble_config_util.module.getModuleBtn(sheet1Info), // 按钮
      ...assemble_config_util.module.getGrid(sheet2ArrGrid, param.leaf, param.rel, param.rel2), // 列表项 行主键
      filter_items: assemble_config_util.module.getFilter(filterArr)?.filter_items,
      grid_filter_quick: assemble_config_util.module.getFilter(filterArr)?.grid_filter_quick,
      form_items: assemble_config_util.module.getForm(sheet2ArrForm),
    };
    return excelConfig;
  },
  // config 模块
  getModule(param: any) {
    let cc: any = {};
    cc[CONFIG_KEY.DICT_NAME] = param[CONFIG_KEY.DICT_NAME];
    cc[CONFIG_KEY.MODULE_KEY] = param[CONFIG_KEY.MODULE_KEY];
    cc[CONFIG_KEY.MODULE_NAME] = param[CONFIG_KEY.MODULE_NAME];
    cc[CONFIG_KEY.GRID_TITLE] = param[CONFIG_KEY.MODULE_NAME];
    cc[CONFIG_KEY.FORM_TITLE] = param[CONFIG_KEY.MODULE_NAME];
    return cc;
  },
  // config 表单
  getModuleForm(param: any) {
    let cc: any = {};
    cc[CONFIG_KEY.FORM_LAYOUT_TYPE] = param[CONFIG_KEY.FORM_LAYOUT_TYPE] || 'horizontal';
    cc[CONFIG_KEY.FORM_WIDTH] = param[CONFIG_KEY.FORM_WIDTH] !== 'max' ? Number(param[CONFIG_KEY.FORM_WIDTH]) : param[CONFIG_KEY.FORM_WIDTH];
    cc[CONFIG_KEY.FORM_SUBMIT_TYPE] = param[CONFIG_KEY.FORM_SUBMIT_TYPE] === '1' ? 'FormData' : '';
    return cc;
  },
  // config 列表
  getModuleGrid(param: any) {
    let cc: any = {};
    cc[CONFIG_KEY.GRID_SHOW_SERIAL_NUMBER] = param[CONFIG_KEY.GRID_SHOW_SERIAL_NUMBER] === '1' ? true : false;
    if (param[CONFIG_KEY.GRID_BORDER] === '1') {
      cc[CONFIG_KEY.GRID_BORDER] = true;
    }
    cc[CONFIG_KEY.GRID_SELECTION_TYPE] = param[CONFIG_KEY.GRID_SELECTION_TYPE] || false;
    cc[CONFIG_KEY.GRID_EXT] = param[CONFIG_KEY.GRID_EXT] || '';
    if (param[CONFIG_KEY.GRID_EXT] === 'card') {
      cc[CONFIG_KEY.GRID_TYPE] = 'list';
      cc[CONFIG_KEY.GRID_TYPE_SWITCH] = true;
      cc.grid_list_card_type = 4;
    }
    return cc;
  },
  // config Api
  getModuleApi(param: any) {
    let cc: any = {};
    // 自定义sql标识
    if (param[CONFIG_KEY.API_GRID_QUERY]?.indexOf('customer:') > -1) {
      // cc[CONFIG_KEY.API_GRID_QUERY] = `${CONSTANTS.DEFAULT_API.GRID_QUERY_CUSTOMER}/${param.module_key}/${param[CONFIG_KEY.API_GRID_QUERY].replace('customer:', '')}`;
      cc[CONFIG_KEY.API_GRID_QUERY] = `${CONSTANTS.DEFAULT_API.GRID_QUERY_CUSTOMER}/${param.module_key}____${param[CONFIG_KEY.API_GRID_QUERY].replace('customer:', '')}`;
    } else {
      cc[CONFIG_KEY.API_GRID_QUERY] = param[CONFIG_KEY.API_GRID_QUERY] ?  param[CONFIG_KEY.API_GRID_QUERY] : `${CONSTANTS.DEFAULT_API.GRID_QUERY}/${param.module_key}`;
    }
    cc[CONFIG_KEY.API_FORM_EDIT] = param[CONFIG_KEY.API_FORM_EDIT] ? param[CONFIG_KEY.API_FORM_EDIT] : `${CONSTANTS.DEFAULT_API.FORM_EDIT}/${param.module_key}`;
    cc[CONFIG_KEY.API_FORM_QUERY] = param[CONFIG_KEY.API_FORM_QUERY] ? param[CONFIG_KEY.API_FORM_QUERY] : `${CONSTANTS.DEFAULT_API.FORM_QUERY}/${param.module_key}`;
    cc[CONFIG_KEY.API_FORM_DELETE] = param[CONFIG_KEY.API_FORM_DELETE] ? param[CONFIG_KEY.API_FORM_DELETE] : `${CONSTANTS.DEFAULT_API.FORM_DELETE}/${param.module_key}`;
    cc[CONFIG_KEY.API_EXCEL_EXPORT] = param[CONFIG_KEY.API_EXCEL_EXPORT] ? param[CONFIG_KEY.API_EXCEL_EXPORT] : `${CONSTANTS.DEFAULT_API.EXCEL_EXPORT}/${param.module_key}`;
    cc[CONFIG_KEY.API_EXCEL_IMPORT] = param[CONFIG_KEY.API_EXCEL_IMPORT] ? param[CONFIG_KEY.API_EXCEL_IMPORT] : `${CONSTANTS.DEFAULT_API.EXCEL_IMPORT}/${param.module_key}`;
    cc[CONFIG_KEY.API_EXCEL_TEMPLATE] = param[CONFIG_KEY.API_EXCEL_TEMPLATE] ? param[CONFIG_KEY.API_EXCEL_TEMPLATE] : `${CONSTANTS.DEFAULT_API.EXCEL_TEMPLATE}/${param.module_key}`;
    return cc;
  },
  // config 按钮
  getModuleBtn(param: any) {
    // 工具栏
    let toolbar_default_download = param[CONFIG_KEY.TOOLBAR_DEFAULT_DOWNLOAD];
    let download_pdf: any = false; // erhuoxuqiu
    if (toolbar_default_download?.indexOf('pdf') > -1) {
      download_pdf = true;
    }
    let tmp_toolbar_default: any = {
      add: param[CONFIG_KEY.TOOLBAR_DEFAULT_ADD] === '1' ? true : false,
      edit:param[CONFIG_KEY.TOOLBAR_DEFAULT_EDIT] === '1' ? true : false,
      delete: param[CONFIG_KEY.TOOLBAR_DEFAULT_DELETE] === '1' ? true : false,
      setting: param[CONFIG_KEY.TOOLBAR_DEFAULT_SETTING] === '1' ? true : false,
      full: param[CONFIG_KEY.TOOLBAR_DEFAULT_FULL] === '1' ? true : false,
      download: toolbar_default_download?.indexOf('1') > -1 || toolbar_default_download?.indexOf('2') > -1? true : false, // 1前端 2后端
      upload: param[CONFIG_KEY.TOOLBAR_DEFAULT_UPLOAD] === '1' ? true : false,
      reload: param[CONFIG_KEY.TOOLBAR_DEFAULT_RELOAD] === '1' ? true : false,
      advanced_filter: param[CONFIG_KEY.TOOLBAR_DEFAULT_ADVANCED_FILTER] === '1' ? true : false,
      statistics: param[CONFIG_KEY.TOOLBAR_DEFAULT_STATISTICS] === '1' ? true : true,
      download_pdf,
    };
    // 工具栏 是否后端导出
    if (param.toolbar_default_download === '2') {
      tmp_toolbar_default.download_config = { type: 'back'};
    }
    // 列表操作列
    let tmp_grid_handle_columns_default: any = {
      edit: param[CONFIG_KEY.GRID_COL_EDIT] === '1' ? true : false,
      delete: param[CONFIG_KEY.GRID_COL_DEL] === '1' ? true : false,
      detail: param[CONFIG_KEY.GRID_COL_DETAIL] === '1' ? true : false,
      editConfig: {
        disabled: 'setEditDisabled_' +  param.module_key,
      },
      deleteConfig: {
        disabled: 'setDeleteDisabled_' +  param.module_key,
      },
    }
    // 如果涉及工作流，需要特殊处理的编辑、删除操作列
    if (param?.customer_btn_grid_col?.indexOf('&C_ACT_BPM&') > -1) {
      tmp_grid_handle_columns_default.editConfig = { disabled: 'setBpmEditDisabled_' + (param?.module_key || '') };
      tmp_grid_handle_columns_default.deleteConfig = { disabled: 'setBpmDeleteDisabled_' + (param?.module_key || '') };
      // debugger // module_key "nbgl_yggl_rzgl"
    }
    // 自定义工具栏及操作列
    let tmp_customer_toolbar = [];
    let tmp_handle_columns = [];
    let customerToobarArr: any = [];
    if (param?.customer_btn_toolbar) {
      customerToobarArr = (param[CONFIG_KEY.CUSTOMER_BTN_TOOLBAR]).split(',') || [];
    }
    let handleColumnsArr: any = [];
    if (param?.customer_btn_grid_col) {
      handleColumnsArr = (param[CONFIG_KEY.CUSTOMER_BTN_GRID_COL]).split(',') || [];
    }
    for (let cus = 0; cus < customerToobarArr.length; cus++) {
      let tmpBtn = customerToobarArr[cus].split('&') || [];
      tmp_customer_toolbar.push({
        name: tmpBtn.length > 0 ? tmpBtn[0] : '',
        key: tmpBtn.length > 2 ? tmpBtn[2] : '',
        func: tmpBtn.length > 1 ? tmpBtn[1] : '',
      });
    }
    for (let cus = 0; cus < handleColumnsArr.length; cus++) {
      let tmpBtn = handleColumnsArr[cus].split('&') || [];
      let tmpHandleColumn: any = {
        name: tmpBtn.length > 0 ? tmpBtn[0] : '',
        key: tmpBtn.length > 2 ? tmpBtn[2] : '',
        func: tmpBtn.length > 1 ? tmpBtn[1] : '',
      }
      // 补充自定义方法
      if (tmpBtn.length > 3) {
        for (let uuu = 3; uuu < tmpBtn.length; uuu++) {
          // disabled=setDoFlowDisabled
          if (tmpBtn[uuu].indexOf('disabled=') > -1) {
            let mmm = tmpBtn[uuu].split('=') || [];
            tmpHandleColumn.disabled = mmm.length > 1 ? mmm[1] : '';
          }
        }
      }
      tmp_handle_columns.push(tmpHandleColumn);
    }
    return {
      toolbar_default: tmp_toolbar_default,
      grid_handle_columns_default: tmp_grid_handle_columns_default,
      customer_toolbar: tmp_customer_toolbar,
      handle_columns: tmp_handle_columns,
    };
  },
  // config 列表项
  getGrid(param: any, leaf: any, rel: any, rel2: any) {
    // sheet2 - 列表项
    let grid_columns = [];
    let grid_row_key = [];
    // cc[CONFIG_KEY.GRID_ROW_KEY] = param[CONFIG_KEY.GRID_ROW_KEY] || false; // grid_row_key
    let mediaConfig: any = {
      grid_list_card_field: {}
    };
    // console.info('5555555555555');
    // console.info(param);
    // debugger;
    for (let i = 0; i < param.length; i++) {
      // 码表关联格式处理，格式: dict_field_expr: "ref:cktmspzlx_dm"
      if (param[i]?.dict_field_expr?.indexOf('ref:') > -1) {
        let tmpTargetFieldName = param[i]?.dict_field_expr?.replace('ref:', '');
        let tmpRefField = param?.find((item: any) => { return item[CONFIG_KEY.DICT_FIELD_NAME] === tmpTargetFieldName });
        param[i] = {
          ...param[i],
          dict_field_alias: tmpRefField?.dict_field_alias,
          dict_field_name: tmpRefField?.dict_field_name,
          dict_field_rel_table: tmpRefField?.dict_field_rel_table,
          dict_field_rel_table_alias: tmpRefField?.dict_field_rel_table_alias,
          dict_field_type: tmpRefField?.dict_field_type,
          dict_field_flag: tmpRefField?.dict_field_flag,
        }
      }
      let cols: any = {};
      myUtil.mysql.addDbFields(cols, param[i]); // 补充数据库字段
      // 列表字段
      if (param[i][CONFIG_KEY.DICT_FIELD_DESC]) {
        cols.title = param[i][CONFIG_KEY.DICT_FIELD_DESC];
      }
      if (param[i][CONFIG_KEY.DICT_FIELD_NAME]) {
        if (ENV_TYPE === 'node') {
          cols.dataIndex =param[i][CONFIG_KEY.DICT_FIELD_NAME];
        } else {
          cols.dataIndex = myUtil.text.underscoreToCamel(param[i][CONFIG_KEY.DICT_FIELD_NAME]);
        }
      } else {
        // 处理关联字段，如ref:cktmspzlx_dm
        if (param[i][CONFIG_KEY.DICT_FIELD_EXPR] && param[i][CONFIG_KEY.DICT_FIELD_EXPR].indexOf('ref:') > -1) {
          let tmpDataIndex = param[i][CONFIG_KEY.DICT_FIELD_EXPR];
          tmpDataIndex = tmpDataIndex.replace('ref:', '');
          if (ENV_TYPE === 'node') {
            cols.dataIndex = tmpDataIndex; // node环境未使用该字段
          } else {
            cols.dataIndex = myUtil.text.underscoreToCamel(tmpDataIndex);
          }
        }
      }
      // 行主键 用于删除及行操作
      if (param[i][CONFIG_KEY.GRID_KEY] === '1') {
        // grid_row_key.push(param[i][CONFIG_KEY.DICT_FIELD_NAME]);
        if (ENV_TYPE === 'node') {
          grid_row_key.push(param[i][CONFIG_KEY.DICT_FIELD_NAME]);
        } else {
          grid_row_key.push(myUtil.text.underscoreToCamel(param[i][CONFIG_KEY.DICT_FIELD_NAME]));
        }
      }
      if (param[i][CONFIG_KEY.GRID_ALIGN]) {
        let align = 'left';
        if (param[i][CONFIG_KEY.GRID_ALIGN] === 'R') {
          align = 'right';
        } else if (param[i][CONFIG_KEY.GRID_ALIGN] === 'C') {
          align = 'center';
        } else if (param[i][CONFIG_KEY.GRID_ALIGN] === 'L') {
          align = 'left';
        }
        cols.align = align;
      }
      if (param[i][CONFIG_KEY.GRID_WIDTH]) {
        cols.width = Number(param[i][CONFIG_KEY.GRID_WIDTH]);
      }
      if (param[i][CONFIG_KEY.GRID_SORT] === '1') {
        cols.sorter = true;
      } else if (param[i][CONFIG_KEY.GRID_SORT] === 'mul') {
        cols.sorter = { multiple: 1 };
      }
      if (param[i][CONFIG_KEY.GRID_INDEX]) {
        cols[CONFIG_KEY.GRID_INDEX] = Number(param[i][CONFIG_KEY.GRID_INDEX]);
      }
      if (param[i][CONFIG_KEY.GRID_STATISTICS]?.indexOf('sum') > -1) {
        cols.sum2 = true;
      }
      if (param[i][CONFIG_KEY.GRID_STATISTICS]?.indexOf('min') > -1) {
        cols.min2 = true;
      }
      if (param[i][CONFIG_KEY.GRID_STATISTICS]?.indexOf('max') > -1) {
        cols.max2 = true;
      }
      if (param[i][CONFIG_KEY.GRID_STATISTICS]?.indexOf('avg') > -1) {
        cols.avg2 = true;
      }
      if (param[i][CONFIG_KEY.GRID_STATISTICS] === '1') {
        cols.sum2 = true;
        cols.min2 = true;
        cols.max2 = true;
        cols.avg2 = true;
      }
      if (param[i][CONFIG_KEY.GRID_STATISTICS] === 'fun') {
        cols.sum2 = 'fun';
        cols.min2 = 'fun';
        cols.max2 = 'fun';
        cols.avg2 = 'fun';
      }
      if (param[i][CONFIG_KEY.GRID_ELLIPSIS] === '1') {
        cols.ellipsis = true;
      }
      if (param[i][CONFIG_KEY.GRID_FIXED]) {
        if (param[i][CONFIG_KEY.GRID_FIXED] == 'L') {
          cols.fixed = 'left';
        }
        if (param[i][CONFIG_KEY.GRID_FIXED] == 'R') {
          cols.fixed = 'right';
        }
      }
      if (param[i][CONFIG_KEY.GRID_HIDDEN] === '1' || param[i][CONFIG_KEY.GRID_HIDDEN] === 'Y') {
        cols.hidden = true;
      }
      let formatArr: any;
      // 媒体类型，自动增加media格式化
      if (param[i][CONFIG_KEY.FORM_ITEM_TYPE]?.toLowerCase() === 'medialibrary') {
        // 列表状态下展示
        cols.render = {
          type: 'media',
        };
      }
      if (param[i][CONFIG_KEY.GRID_RENDER]) {
        formatArr = param[i][CONFIG_KEY.GRID_RENDER] || '';
        // 数字格式的格式化,例:0,0.0000
        if ((parseInt(formatArr.replace(new RegExp(',"', 'g'), '"'))) === 0) {
          cols.render = {
            type: 'number',
            format: formatArr,
          };
          // 时间格式的格式化,例:yyyy-MM-dd hh:mm:ss
        } else if (formatArr.indexOf('code_') > -1) {
          cols.codeTable = formatArr;
          // 自定义格式化,例:bgdNo
        } else if (formatArr.toLowerCase() === 'media:imagepath') {
          mediaConfig.grid_list_card_field.imagepath = cols.dataIndex;
          // 媒体类型，自动增加media格式化
          // if (param[i][CONFIG_KEY.FORM_ITEM_TYPE].toLowerCase() === 'medialibrary') {
          //   // 卡片状态下展示
          // }
        } else if (formatArr.toLowerCase() === 'media:videopath') {
          mediaConfig.grid_list_card_field.videopath = cols.dataIndex;
        } else if (formatArr.toLowerCase() === 'media:title') {
          mediaConfig.grid_list_card_field.title = cols.dataIndex;
        } else if (formatArr.toLowerCase() === 'media:description') {
          mediaConfig.grid_list_card_field.description = cols.dataIndex;
        } else if (formatArr.toLowerCase().indexOf('leaf:') > -1 ||     // 主子表
            formatArr.toLowerCase().indexOf('rel:') > -1 ||             // 关联表 关联关系位于主表中
            formatArr.toLowerCase().indexOf('rel2:') > -1)  {           // 关联表 关联关系位于第三张表
          let typeTxt: any;
          let tmpArr: any;
          if (formatArr.toLowerCase().indexOf('leaf:') > -1) {
            typeTxt = 'leaf';
            tmpArr = cloneDeep(leaf);
          } else if (formatArr.toLowerCase().indexOf('rel:') > -1) {
            typeTxt = 'rel';
            tmpArr = cloneDeep(rel);
          } else if (formatArr.toLowerCase().indexOf('rel2:') > -1) {
            typeTxt = 'rel2';
            tmpArr = cloneDeep(rel2);
          }
          let gridRenderTxt =  ENV_TYPE === 'node' ? 'grid_render' : 'gridRender';
          let tmpTargetLeaf: any = tmpArr?.find((item: any) => { return item.field[gridRenderTxt] === formatArr });
          let leafConfig = tmpTargetLeaf?.config;
          let leafConfig2 = tmpTargetLeaf?.config2;
          let titleDataIndex = formatArr.split('&')[1];
          titleDataIndex = ENV_TYPE === 'node' ? titleDataIndex : myUtil.text.underscoreToCamel(titleDataIndex);
          cols.render = {
            type: typeTxt,
            titleDataIndex: titleDataIndex,
            config: leafConfig,
            config2: leafConfig2,
            func: {},
          }
        } else if (formatArr === 'json') {
          cols.render = {
            type: 'json',
          };
        } else if (formatArr === 'copy') {
          cols.render = {
            copy: true,
          };
        } else if (formatArr === 'color') {
          cols.render = {
            type: 'color',
          };
        } else if (formatArr === 'tagColor') {
          cols.render = {
            type: 'tagColor',
          };
        }  else if (formatArr === 'RichTextEditor') {
          cols.width = Number(param[i][CONFIG_KEY.GRID_WIDTH]) || 70;
          cols.align = 'center';
          cols.render = {
            type: 'RichTextEditor',
          };
        } else if (formatArr === 'MarkdownEditor') {
          cols.width = Number(param[i][CONFIG_KEY.GRID_WIDTH]) || 70;
          cols.align = 'center';
          cols.render = {
            type: 'MarkdownEditor',
          };
        } else if (formatArr === 'timeEasyRead') {
          cols.render = {
            timeEasyRead: true,
          };
        } else if (formatArr.indexOf('switch:') > -1) {
          cols.render = {
            type: 'switch',
            value: formatArr.replace('switch:', '')
          };
        } else if (formatArr.indexOf('yy') > -1
          || formatArr.indexOf('MM') > -1
          || formatArr.indexOf('dd') > -1
          || formatArr.indexOf('hh') > -1
          || formatArr.indexOf('mm') > -1
          || formatArr.indexOf('ss') > -1) {
          formatArr = formatArr.replace('dd', 'DD');
          cols.render = {
            type: 'date',
            format: formatArr,
          };
          // 码表格式的格式化,例:code_码表索引规则， 码表索引规则：码表索引 + 序号（01、02、03......）
        }
        // else if (formatArr === 'media') {
        //   cols.render = {
        //     type: 'media',
        //     // format: formatArr,
        //   };
        // }
        else if (formatArr !== '/') {
          cols.render = {
            func: formatArr
          };
        }
      }
      // 表头筛选
      if (param[i][CONFIG_KEY.FILTER_ITEM_POSITION] === '列表头') {
        let optionArr = param[i][CONFIG_KEY.FILTER_ITEM_EXTEND];
        let girdHeaderFilterType: any = '';
        if (param[i][CONFIG_KEY.FILTER_ITEM_TYPE]?.toLowerCase() === 'select') {
          girdHeaderFilterType = itemType.Select;
        } else if(param[i][CONFIG_KEY.FILTER_ITEM_TYPE]?.toLowerCase() === 'radio') {
          girdHeaderFilterType = itemType.Radio;
        }
        cols.filter = {
          type: girdHeaderFilterType,
          codeTable: optionArr,
          // showCode: true,
        }
      }
      // 列表项扩展信息，如tooltip
      if (param[i][CONFIG_KEY.EXT_INFO]) {
        let extInfoArr: any = (param[i][CONFIG_KEY.EXT_INFO]).split('&&&') || [];
        for (let cus = 0; cus < extInfoArr.length; cus++) {
          if (extInfoArr[cus].indexOf('tooltipGrid') > -1) {
            cols.titleTooltip = extInfoArr[cus]?.replace('tooltipGrid：', 'tooltipGrid:')?.replace('tooltipGrid:', '');
          }
        }
      }
      // 处理合并列头1
      if (param[i][CONFIG_KEY.GRID_CHILDREN]) {
        cols.children = param[i][CONFIG_KEY.GRID_CHILDREN];
      }
      // 列宽修正
      // assemble_config_util.modifyColWidth(cols, formatArr);
      grid_columns.push(cols);
    }
    // 处理合并列头2
    for (let m = 0; m < grid_columns.length; m++) {
      if (grid_columns[m].children) {
        const max = Number(grid_columns[m].children);
        grid_columns[m].children = [];
        for (let n = m + 1; n < m + 1 + max; n++) {
          grid_columns[m].children.push({ ...grid_columns[n] });
          grid_columns[n].needDel = 1;
        }
        grid_columns[m].align = 'center';
        // delete grid_columns[m].children;
        delete grid_columns[m].dataIndex;
        delete grid_columns[m].width;
      }
    }
    // 处理合并列头2: 原有列中删除存在于children中的
    grid_columns = grid_columns.filter((tmp: any) => (tmp.needDel !== 1));
    // 列表排序 fixed:left   ---   其他   ---   fixed:right
    let grid_columns_left = grid_columns.filter((tmp: any) => (tmp.fixed === 'left')) || [];
    let grid_columns_right = grid_columns.filter((tmp: any) => (tmp.fixed === 'right')) || [];
    let grid_columns_other = grid_columns.filter((tmp: any) => (tmp.fixed !== 'left' && tmp.fixed !== 'right')) || [];
    grid_columns_left = grid_columns_left.sort((a: any, b: any) => {
      let tmp1 = a[CONFIG_KEY.GRID_INDEX] || 99999999;
      let tmp2 = b[CONFIG_KEY.GRID_INDEX] || 99999999;
      tmp1 = tmp1 === '' ? 99999999 : Number(tmp1);
      tmp2 = tmp2 === '' ? 99999999 : Number(tmp2);
      return tmp1 - tmp2;
    });
    grid_columns_right = grid_columns_right.sort((a: any, b: any) => {
      let tmp1 = a[CONFIG_KEY.GRID_INDEX] || 99999999;
      let tmp2 = b[CONFIG_KEY.GRID_INDEX] || 99999999;
      tmp1 = tmp1 === '' ? 99999999 : Number(tmp1);
      tmp2 = tmp2 === '' ? 99999999 : Number(tmp2);
      return tmp1 - tmp2;
    });
    grid_columns_other = grid_columns_other.sort((a: any, b: any) => {
      let tmp1 = a[CONFIG_KEY.GRID_INDEX] || 99999999;
      let tmp2 = b[CONFIG_KEY.GRID_INDEX] || 99999999;
      tmp1 = tmp1 === '' ? 99999999 : Number(tmp1);
      tmp2 = tmp2 === '' ? 99999999 : Number(tmp2);
      return tmp1 - tmp2;
    });
    let returnVal: any = {
      grid_columns: [ ...grid_columns_left, ...grid_columns_other, ...grid_columns_right ],
    }
    if (grid_row_key.length === 1) {
      returnVal.grid_row_key = grid_row_key[0];
    } else if (grid_row_key.length > 1) {
      returnVal.grid_row_key = grid_row_key;
    }
    // console.info('66666666666666');
    // console.info({...returnVal, ...mediaConfig});
    // debugger;
    return {...returnVal, ...mediaConfig};
  },
  // config 筛选项
  getFilter(param: any) {
    // 筛选项排序
    let filter_items = [];
    let grid_filter_quick = [];
    for (let i = 0; i < param.length; i++) {
      let items: any = {};
      myUtil.mysql.addDbFields(items, param[i]); // 补充数据库字段
      // 筛选项字段
      if (param[i][CONFIG_KEY.DICT_FIELD_NAME]) {
        // items.name = param[i][CONFIG_KEY.DICT_FIELD_NAME].toLowerCase();
        if (ENV_TYPE === 'node') {
          items.name = param[i][CONFIG_KEY.DICT_FIELD_NAME];
        } else {
          items.name = myUtil.text.underscoreToCamel(param[i][CONFIG_KEY.DICT_FIELD_NAME]);
        }
      }
      if (param[i][CONFIG_KEY.DICT_FIELD_DESC]) {
        items.label = param[i][CONFIG_KEY.DICT_FIELD_DESC];
      }
      if (param[i][CONFIG_KEY.FILTER_ITEM_LABEL]) {
        items.label = param[i][CONFIG_KEY.FILTER_ITEM_LABEL];
      }
      if (param[i][CONFIG_KEY.FILTER_ITEM_PLACEHOLDER]) {
        items.placeholder = param[i][CONFIG_KEY.FILTER_ITEM_PLACEHOLDER];
      }
      if (param[i][CONFIG_KEY.FILTER_ITEM_INDEX]) {
        items[CONFIG_KEY.FILTER_ITEM_INDEX] = Number(param[i][CONFIG_KEY.FILTER_ITEM_INDEX]);
      }
      // if (param[i][CONFIG_KEY.FILTER_ITEM_POSITION]) {
      //   items.tooltip = param[i][CONFIG_KEY.FILTER_ITEM_POSITION];
      // }
      if (param[i].filterOrder !== '/') {
        items.order = param[i].filterOrder;
      }
      if (param[i][CONFIG_KEY.FILTER_ITEM_LAYOUT]) {
        if (Number(param[i][CONFIG_KEY.FILTER_ITEM_LAYOUT]) === 100) {
          items.layout = CONSTANTS.DEFAULT_FILTER_LAYOUT_100P_ROW;
          items.layoutDesc = 100;
        } else if (Number(param[i][CONFIG_KEY.FILTER_ITEM_LAYOUT]) === 66) {
          items.layout = CONSTANTS.DEFAULT_FILTER_LAYOUT_66P_ROW;
          items.layoutDesc = 66;
        }
      }
      if (param[i][CONFIG_KEY.FILTER_ITEM_TYPE]?.toLowerCase() === 'input') {
        items.type = itemType.Input;
      } else if (param[i][CONFIG_KEY.FILTER_ITEM_TYPE]?.toLowerCase() === 'inputnumber') {
        items.type = itemType.InputNumber;
      } else if (param[i][CONFIG_KEY.FILTER_ITEM_TYPE]?.toLowerCase() === 'select') {
        items.type = itemType.Select;
        items.showSearch = true;
        items.allowClear = true
      } else if (param[i][CONFIG_KEY.FILTER_ITEM_TYPE]?.toLowerCase() === 'select3') {
        items.type = itemType.Select;		// 原申报系统为tableSelect控件，即 items.type = `&'tableSelect'&`
        items.showType = '3';
        items.showSearch = true;
        items.allowClear = true
      } else if (param[i][CONFIG_KEY.FILTER_ITEM_TYPE]?.toLowerCase() === 'datepicker') {
        items.type = itemType.DatePicker;
        items.allowClear = true
      } else if (param[i][CONFIG_KEY.FILTER_ITEM_TYPE]?.toLowerCase() === 'hidden') {
        items.type = itemType.Hidden;
      } else if (param[i][CONFIG_KEY.FILTER_ITEM_TYPE]?.toLowerCase() === 'textarea') {
        items.type = itemType.TextArea;
      } else if (param[i][CONFIG_KEY.FILTER_ITEM_TYPE]?.toLowerCase() === 'title') {
        items.type = itemType.GroupTitle;
      } else if (param[i][CONFIG_KEY.FILTER_ITEM_TYPE]?.toLowerCase() === 'autocomplete') {
        items.type = itemType.AutoComplete;
        items.showType = '3';
        items.allowClear = true;
      } else if (param[i][CONFIG_KEY.FILTER_ITEM_TYPE]?.toLowerCase() === 'treeselect') {
        items.type = itemType.TreeSelect;
        items.showSearch = true;
        items.labelInValue = false;
        items.isSelectLeaf = true;
      } else {
        items.type = param[i].filter;
      }
      if (param[i][CONFIG_KEY.FILTER_ITEM_EXTEND]) {
        // 筛选是时间范围时，筛选扩展参数为(range|date)，直接添加range；其他类型则配置码表
        if (param[i][CONFIG_KEY.FILTER_ITEM_EXTEND] === 'range' || param[i][CONFIG_KEY.FILTER_ITEM_EXTEND] === 'range|date' || param[i][CONFIG_KEY.FILTER_ITEM_EXTEND] === 'range|input') {
          items.range = true;
        } else {
          let optionArr = param[i][CONFIG_KEY.FILTER_ITEM_EXTEND];
          if (param[i][CONFIG_KEY.FILTER_ITEM_TYPE]?.toLowerCase() === 'treeselect') {
            items.treeTable = optionArr;
          } else {
            items.codeTable = optionArr;
          }
        }
      }
      // 筛选项扩展信息，如tooltip
      if (param[i][CONFIG_KEY.EXT_INFO]) {
        let extInfoArr: any = (param[i][CONFIG_KEY.EXT_INFO]).split('&&&') || [];
        for (let cus = 0; cus < extInfoArr.length; cus++) {
          if (extInfoArr[cus].indexOf('tooltipFilter') > -1) {
            items.tooltip = extInfoArr[cus]?.replace('tooltipFilter：', 'tooltipFilter:')?.replace('tooltipFilter:', '');
          }
        }
      }
      // 过滤所在位置
      if (param[i][CONFIG_KEY.FILTER_ITEM_POSITION] === '工具栏') {
        grid_filter_quick.push(items);
      } else if (param[i][CONFIG_KEY.FILTER_ITEM_POSITION] === '列表头') {
        // 不处理，放置到列表列中处理
      } else {
        filter_items.push(items);
      }
    }
    filter_items = filter_items.sort((a: any, b: any) => {
      let tmp1 = a[CONFIG_KEY.FILTER_ITEM_INDEX] || 99999999;
      let tmp2 = b[CONFIG_KEY.FILTER_ITEM_INDEX] || 99999999;
      tmp1 = tmp1 === '/' ? 99999999 : Number(tmp1);
      tmp2 = tmp2 === '/' ? 99999999 : Number(tmp2);
      return tmp1 - tmp2;
    });
    return { filter_items, grid_filter_quick };
  },
  // config 表单项
  getForm(param: any) {
    let form_items = [];
    // 表单项排序
    param = param.sort((a: any, b: any) => {
      let tmp1 = a[CONFIG_KEY.FORM_ITEM_INDEX] || 99999999;
      let tmp2 = b[CONFIG_KEY.FORM_ITEM_INDEX] || 99999999;
      tmp1 = tmp1 === '/' ? 99999999 : Number(tmp1);
      tmp2 = tmp2 === '/' ? 99999999 : Number(tmp2);
      return tmp1 - tmp2;
    });
    for (let i = 0; i < param.length; i++) {
      let items: any = {};
      myUtil.mysql.addDbFields(items, param[i]); // 补充数据库字段
      // 表单项字段
      let formItemTypeTmp = param[i][CONFIG_KEY.FORM_ITEM_TYPE]?.toLowerCase();
      if (param[i][CONFIG_KEY.DICT_FIELD_DESC]) {
        items.label = param[i][CONFIG_KEY.DICT_FIELD_DESC];
      }
      if (param[i][CONFIG_KEY.DICT_FIELD_NAME]) {
        // items.name = param[i][CONFIG_KEY.DICT_FIELD_NAME].toLowerCase();
        if (ENV_TYPE === 'node') {
          items.name = param[i][CONFIG_KEY.DICT_FIELD_NAME];
        } else {
          items.name = myUtil.text.underscoreToCamel(param[i][CONFIG_KEY.DICT_FIELD_NAME]);
        }
      }
      if (formItemTypeTmp) {
        if (formItemTypeTmp === 'input') {
          if (param[i][CONFIG_KEY.FORM_ITEM_FORMAT] && param[i][CONFIG_KEY.FORM_ITEM_FORMAT].indexOf('0.0') > -1) {
            // 如果格式化为数字格式，则类型为InputNumber，可能不全
            // 还可以根据校验条件判断：存在“Number”、“数值范围”则为InputNumber，后续按需整理
            items.type = itemType.InputNumber;
          } else {
            items.type = itemType.Input;
          }
        } else if (formItemTypeTmp === 'datepicker' || formItemTypeTmp === 'date') {
          items.type = itemType.DatePicker;
          items.allowClear = true;
        } else if (formItemTypeTmp === 'password') {
          items.type = itemType.Password;
        } else if (formItemTypeTmp === 'inputnumber') {
          items.type = itemType.InputNumber;
          // 公式
          if (param[i][CONFIG_KEY.FORM_ITEM_EXTEND]) {
            let formatStr = param[i][CONFIG_KEY.FORM_ITEM_EXTEND];
            if (formatStr.indexOf('formula:') > -1) {
              let formatStrArr = formatStr?.split('formula:') || [];
                if (formatStrArr.length > 1) {
                  items.formula = formatStrArr[1];
                }
            }
          }
        } else if (formItemTypeTmp === 'select') {
          items.type = itemType.Select;
          items.allowClear = true;
        } else if (formItemTypeTmp === 'radio') {
          items.type = itemType.Radio;
        } else if (formItemTypeTmp === 'switch') {
          items.type = itemType.Switch;
          // items.allowClear = true;
        }  else if (formItemTypeTmp === 'hidden') {
          items.type = itemType.Hidden;
        } else if (formItemTypeTmp === 'textarea') {
          items.type = itemType.TextArea;
          items.autoSize = { minRows: 2, maxRows: 2 };
        } else if (formItemTypeTmp === 'title') {
          items.type = itemType.GroupTitle;
        } else if (formItemTypeTmp === 'autocomplete') {
          if (param[i]['blur'] === 'hbhlDm') {
            items.type = itemType.AutoComplete;		// 原申报系统为AutoComplete控件，即 items.type = 'AutoComplete'
            items.showType = '3';
            items.allowClear = true;
          } else {
            items.type = itemType.Select;		// 原申报系统为AutoComplete控件，即 items.type = 'AutoComplete'
            items.showType = '3';
            items.showSearch = true;
            items.allowClear = true;
          }
        } else if (formItemTypeTmp === 'select3') {
          items.type = itemType.Select;		// 原申报系统为tableSelect控件，即 items.type = 'tableSelect'
          items.showType = '4';
          items.showSearch = true;
          items.mode = 'multiple';
          items.eventOnChange = items.name;
          items.allowClear = true;
        } else if (formItemTypeTmp === 'treeselect') {
          items.type = itemType.TreeSelect;
          items.showSearch = true;
          items.labelInValue = false;
        } else if (formItemTypeTmp === 'upload') {
          items.type = itemType.Upload;
          if (param[i][CONFIG_KEY.FORM_ITEM_EXTEND]) {
            let formatStr = param[i][CONFIG_KEY.FORM_ITEM_EXTEND];
            let formatStrArr = formatStr?.split(',') || []; // maxCount=3
            formatStrArr.forEach((extendItem: any) => {
              if (extendItem.indexOf('maxCount') > -1) {
                items.maxCount = extendItem.split('=')[1];
              }
            });
          }
        } else if (formItemTypeTmp === 'uploadvideo') {
          items.type = itemType.UploadVideo;
          if (param[i][CONFIG_KEY.FORM_ITEM_EXTEND]) {
            let formatStr = param[i][CONFIG_KEY.FORM_ITEM_EXTEND];
            let formatStrArr = formatStr?.split(',') || []; // maxCount=3
            formatStrArr.forEach((extendItem: any) => {
              if (extendItem.indexOf('maxCount') > -1) {
                items.maxCount = extendItem.split('=')[1];
              }
            });
          }
        } else if (formItemTypeTmp === 'uploadaudio') {
          items.type = itemType.UploadAudio;
          if (param[i][CONFIG_KEY.FORM_ITEM_EXTEND]) {
            let formatStr = param[i][CONFIG_KEY.FORM_ITEM_EXTEND];
            let formatStrArr = formatStr?.split(',') || []; // maxCount=3
            formatStrArr.forEach((extendItem: any) => {
              if (extendItem.indexOf('maxCount') > -1) {
                items.maxCount = extendItem.split('=')[1];
              }
            });
          }
        } else if (formItemTypeTmp === 'uploadpicture') {
          items.type = itemType.UploadPicture;
          items.listType = 'picture';
          if (param[i][CONFIG_KEY.FORM_ITEM_EXTEND]) {
            let formatStr = param[i][CONFIG_KEY.FORM_ITEM_EXTEND];
            let formatStrArr = formatStr?.split(',') || []; // maxCount=3
            formatStrArr.forEach((extendItem: any) => {
              if (extendItem.indexOf('maxCount') > -1) {
                items.maxCount = extendItem.split('=')[1];
              }
            });
          }
        } else if (formItemTypeTmp === 'standing') {
          items.type = itemType.Blank;
        } else if (formItemTypeTmp === 'richtexteditor') {
          items.type = itemType.RichTextEditor;
        }  else if (formItemTypeTmp === 'markdowneditor') {
          items.type = itemType.MarkdownEditor;
        } else if (formItemTypeTmp === 'medialibrary') {
          items.type = itemType.MediaLibrary;
        } else if (formItemTypeTmp === 'cascader') {
          items.type = itemType.Cascader;
        } else {
          items.type = formItemTypeTmp;
        }
      }
      if (param[i][CONFIG_KEY.FORM_ITEM_READONLY] === '1') {
        items.readOnly = true;
        items.disabled = true;
      }
      if (param[i][CONFIG_KEY.FORM_ITEM_FORMAT]) {
        let formatArr = param[i][CONFIG_KEY.FORM_ITEM_FORMAT];
        // 数字格式的格式化,例:0,0.0000
        if ((parseInt(formatArr.replace(new RegExp(',"', 'g'), '"'))) === 0) {
          items.format = formatArr;
          // 日期格式化
        } else if (formatArr.indexOf('yy') > -1
          || formatArr.indexOf('MM') > -1
          || formatArr.indexOf('dd') > -1
          || formatArr.indexOf('hh') > -1
          || formatArr.indexOf('mm') > -1
          || formatArr.indexOf('ss') > -1) {
          items.format = formatArr.replace('dd', 'DD');
          // 大小写格式化
        } else if (formatArr.indexOf('lower') > -1
          || formatArr.indexOf('upper') > -1) {
          // items.format = formatArr;
          // 自定义格式化,例:bgdNo
        } else {
          // items[finalName].format = `customerFormatStart_layui.fieldFormatFormItem.${formatArr}_customerFormatEnd`;
          // items.format = `customerFormatStart_layui.fieldFormatFormItem.${formatArr}_customerFormatEnd`;
        }
      }
      if (formItemTypeTmp === 'select'
        || formItemTypeTmp === 'checkbox'
        || formItemTypeTmp === 'radio'
        || formItemTypeTmp === 'autocomplete' //  原申报系统AutoComplete控件，新系统采用Select控件，走码表配置
        || formItemTypeTmp === 'select3' //  原申报系统tableSelect控件，新系统采用Select控件，走码表配置
        && param[i][CONFIG_KEY.FORM_ITEM_EXTEND]) {
        let formatStr = param[i][CONFIG_KEY.FORM_ITEM_EXTEND];
        // items.codeTable = formatStr;
        let formatStrArr = formatStr?.split(',') || []; // maxCount=3
        formatStrArr.forEach((extendItem: any) => { // maxCount=3,multiple,code_dm_xxx
          if (extendItem.indexOf('multiple') > -1) {
            items.mode = 'multiple';
          } else {
            items.codeTable = extendItem;
          }
        });
      }
      if (formItemTypeTmp === 'treeselect' && param[i][CONFIG_KEY.FORM_ITEM_EXTEND]) {
        let formatStr = param[i][CONFIG_KEY.FORM_ITEM_EXTEND];
        items.treeTable = formatStr;
      }
      if (formItemTypeTmp === 'cascader' && param[i][CONFIG_KEY.FORM_ITEM_EXTEND]) {
        let formatStr = param[i][CONFIG_KEY.FORM_ITEM_EXTEND];
        items.treeTable = formatStr;
      }
      if (formItemTypeTmp === 'datepicker' && param[i][CONFIG_KEY.FORM_ITEM_EXTEND]) {
        let  formItemExtendTmp = param[i][CONFIG_KEY.FORM_ITEM_EXTEND] || '';
        if (formItemExtendTmp.toLowerCase() === 'showtime') {
          items.showTime = true;
        }
      }
      // form item layout
      if (param[i][CONFIG_KEY.FORM_ITEM_LAYOUT]) {
        if (Number(param[i][CONFIG_KEY.FORM_ITEM_LAYOUT]) === 100) {
          items.layout = CONSTANTS.DEFAULT_FORM_LAYOUT_100P_ROW;
          items.desLayout = CONSTANTS.DEFAULT_DESCRIPTION_LAYOUT_100P_ROW;
          if (form_items[i-1]) {
            if (form_items[i-1]?.desLayout?.xs) {
            } else {
              form_items[i-1].desLayout = 'filled';
            }
          }
          items.layoutDesc = 100;
        } else if (Number(param[i][CONFIG_KEY.FORM_ITEM_LAYOUT]) === 66) {
          items.layout = CONSTANTS.DEFAULT_FORM_LAYOUT_66P_ROW;
          items.desLayout = CONSTANTS.DEFAULT_DESCRIPTION_LAYOUT_66P_ROW;
          items.layoutDesc = 66;
          if (form_items[i-1]) {
            if (form_items[i-1]?.desLayout?.xs) {
            } else {
              form_items[i-1].desLayout = 'filled';
            }
          }
        }
      }
      if (formItemTypeTmp === 'richtexteditor') {
        items.layout = CONSTANTS.DEFAULT_FORM_LAYOUT_100P_ROW;
        items.desLayout = CONSTANTS.DEFAULT_DESCRIPTION_LAYOUT_100P_ROW;
        items.layoutDesc = 100;
        if (form_items[i-1]) {
          if (form_items[i-1]?.desLayout?.xs) {
          } else {
            form_items[i-1].desLayout = 'filled';
          }
        }
      }
      if (formItemTypeTmp === 'markdowneditor') {
        items.layout = CONSTANTS.DEFAULT_FORM_LAYOUT_100P_ROW;
        items.desLayout = CONSTANTS.DEFAULT_DESCRIPTION_LAYOUT_100P_ROW;
        items.layoutDesc = 100;
        if (form_items[i-1]) {
          if (form_items[i-1]?.desLayout?.xs) {
          } else {
            form_items[i-1].desLayout = 'filled';
          }
        }
      }
      let itemRules = assemble_config_util.setFormItemRules(param[i]) || [];
      if (itemRules.length > 0) {
        items.rules = itemRules;
      }
      // if (param[i].formItemTooltip !== '/') {
      //   items.tooltip = param[i].formItemTooltip;
      // }
      if (param[i][CONFIG_KEY.FORM_ITEM_EVENT_ONBLUR]) {
        if (formItemTypeTmp === 'autocomplete') {		// 原申报系统AutoComplete控件的blur事件，改为onchange事件
          items.eventOnChange = param[i][CONFIG_KEY.FORM_ITEM_EVENT_ONBLUR];
        } else {
          // items[CONFIG_KEY.FORM_ITEM_EVENT_ONBLUR] = param[i][CONFIG_KEY.FORM_ITEM_EVENT_ONBLUR];
          items.eventOnBlur = param[i][CONFIG_KEY.FORM_ITEM_EVENT_ONBLUR];
        }
      }
      if (param[i][CONFIG_KEY.FORM_ITEM_EVENT_ONFOCUS]) {
        // items[CONFIG_KEY.FORM_ITEM_EVENT_ONFOCUS] = param[i][CONFIG_KEY.FORM_ITEM_EVENT_ONFOCUS];
        items.eventOnFocus = param[i][CONFIG_KEY.FORM_ITEM_EVENT_ONFOCUS];
      }
      if (param[i][CONFIG_KEY.FORM_ITEM_EVENT_ONCHANGE]) {
        // items[CONFIG_KEY.FORM_ITEM_EVENT_ONCHANGE] = param[i][CONFIG_KEY.FORM_ITEM_EVENT_ONCHANGE];
        items.eventOnChange = param[i][CONFIG_KEY.FORM_ITEM_EVENT_ONCHANGE];
      }
      // 媒体类型，自动增加onSearchMedia
      if (param[i][CONFIG_KEY.FORM_ITEM_TYPE].toLowerCase() === 'medialibrary') {
        items.eventOnSearch = 'onSearchMedia';
      }
      if (param[i][CONFIG_KEY.FORM_ITEM_EVENT_ONSEARCH]) {
        items.eventOnSearch = param[i][CONFIG_KEY.FORM_ITEM_EVENT_ONSEARCH];
        // items.onSearch = param[i][CONFIG_KEY.FORM_ITEM_EVENT_ONSEARCH];
      }
      if (param[i][CONFIG_KEY.FORM_ITEM_INDEX]) {
        items[CONFIG_KEY.FORM_ITEM_INDEX] = param[i][CONFIG_KEY.FORM_ITEM_INDEX];
      }
      // 分词 格式: dict_field_expr: "fc:2,fc_content1,0"  ->  码表类别,来源Item,命中规则
      if (param[i]?.dict_field_expr?.indexOf('fc:') > -1) {
        let fcStrTmp = param[i]?.dict_field_expr?.replace('fc:', '');
        let fcArr = fcStrTmp.split('|') || [];
        items.enterButton = '分词查询';
        items.fc01 = fcArr[0];
        items.fc02 = myUtil.text.underscoreToCamel(fcArr[1]);
        items.eventOnSearch = 'searchSegmentation';
      }
      // 表单项扩展信息，如tooltip
      if (param[i][CONFIG_KEY.EXT_INFO]) {
        let extInfoArr: any = (param[i][CONFIG_KEY.EXT_INFO]).split('&&&') || [];
        for (let cus = 0; cus < extInfoArr.length; cus++) {
          if (extInfoArr[cus].indexOf('tooltipForm') > -1) {
            items.tooltip = extInfoArr[cus]?.replace('tooltipForm：', 'tooltipForm:')?.replace('tooltipForm:', '');
          } else if (extInfoArr[cus].indexOf('tooltipGrid') > -1) {

          } else if (extInfoArr[cus].indexOf('tooltipFilter') > -1) {

          }
        }
      }
      form_items.push(items);
    }
    // 表单项排序
    // form_items = form_items.sort((a: any, b: any) => {
    //   let tmp1 = a[CONFIG_KEY.FORM_ITEM_INDEX] || 99999999;
    //   let tmp2 = b[CONFIG_KEY.FORM_ITEM_INDEX] || 99999999;
    //   tmp1 = tmp1 === '/' ? 99999999 : Number(tmp1);
    //   tmp2 = tmp2 === '/' ? 99999999 : Number(tmp2);
    //   return tmp1 - tmp2;
    // });
    // 表单项排序序号重排
    form_items.forEach((item: any, index: any) => {
      item[CONFIG_KEY.FORM_ITEM_INDEX] = (index + 1) * 10;
    })
    return form_items;
  }
};
// Module Tree
assemble_config_util.moduleTree = {
  // config 组装全部属性
  assembleAll(param: any) {
    let { moduleInfo, appTableDict } = param;
    let sheet1Info: any = myUtil.text.camelToUnderscoreObj(moduleInfo || {});
    let sheet2Info: any =  myUtil.text.camelToUnderscoreArray(appTableDict || []);
    let sheet2ArrGrid: any = sheet2Info.filter((tmp: any) => (tmp[CONFIG_KEY.GRID_USED] === '1'));       // 列表项
    let sheet2ArrForm: any = sheet2Info.filter((tmp: any) => (tmp[CONFIG_KEY.FORM_ITEM_USED] === '1'));  // 表单项
    let moduleBtn = assemble_config_util.module.getModuleBtn(sheet1Info) || {};                          // 按钮
    let toolbar_default: any = moduleBtn.toolbar_default;                                                // 按钮
    let treeConfig = assemble_config_util.moduleTree.getTree(sheet2ArrGrid, moduleInfo);                 // 树配置
    // 组装视图配置数据
    let excelConfig = {
      unit_title: sheet1Info?.module_name || '',
      ...assemble_config_util.module.getModuleApi(sheet1Info), // Api
      form: {
        form_layout_type: sheet1Info?.form_layout_type || 'vertical',
        form_label_input_layout: 'horizontal',
        form_items: assemble_config_util.module.getForm(sheet2ArrForm),
      },
      toolbar_default: { ...toolbar_default },      // 配置项：工具栏
      tree: treeConfig,                             // 配置项：左侧树
    };
    return excelConfig;
  },
  // config 列表项
  getTree(param: any, param2: any) {
    let treeConfig: any = {
      checkable: param2?.gridSelectionType === 'checkbox' ? true : false,
      field_names: { children: 'children' },
      // root_id: '****',
      root_id: '',
    };
    for (let i = 0; i < param.length; i++) {
      let formatArr: any = param[i][CONFIG_KEY.GRID_RENDER];
      if (formatArr) {
        let dictFieldName: any = param[i][CONFIG_KEY.DICT_FIELD_NAME];
        if (ENV_TYPE !== 'node') {
          dictFieldName = myUtil.text.underscoreToCamel(dictFieldName);
        }
        if (formatArr.indexOf('tree:key') > -1) {
          treeConfig.field_names.key = dictFieldName;
        } else if (formatArr.indexOf('tree:title') > -1) {
          treeConfig.field_names.title = dictFieldName;
        } else if (formatArr.indexOf('tree:parent_key') > -1) {
          treeConfig.field_names.parent_key = dictFieldName;
        }
      }
    }
    return treeConfig;
  },
}

// 表单校验
assemble_config_util.setFormItemRules = (item: any = {}) => {
  let itemRules: any = [];
  if (!item[CONFIG_KEY.FORM_ITEM_RULE]) {
    return;
  }
  let rules = (item[CONFIG_KEY.FORM_ITEM_RULE] || '').split(',') || [];
  for (let m = 0; m < rules.length; m++) {
    let note = rules[m];
    if (note === '必录') {
      itemRules.push({ type: 'base_required', });
    } else if (note.indexOf('数值范围') > -1) {
      let plusOrMinus = note.replace('数值范围', '');
      itemRules.push({ type: 'base_number', range: plusOrMinus });
    } else if ((note.toLowerCase()).indexOf('varchar') > -1) { // 长度范围	VARCHAR2(30) VARCHAR(30)
      note = note.toLowerCase().replace('varchar2', 'varchar');
      let maxLength = note.substring(8, note.length - 1);
      itemRules.push({ type: 'base_string', range: [0, Number(maxLength)] });
    } else if (note.indexOf('长度范围') > -1) {					// 长度范围
      let scopeStr = note.replace('长度范围', '');
      let min = scopeStr.split('~')[0];
      let max = scopeStr.split('~')[1];
      itemRules.push({ type: 'base_string', range: [min, max] });
    } else if (note.indexOf('长度=') > -1) {					// 长度等于
      let maxLength = note.replace('长度=', '');
      itemRules.push({ type: 'base_string', length: maxLength });
    } else if (note.indexOf('邮件') > -1) {					// 邮箱
      itemRules.push({ type: 'base_type_mail' });
    } else if (note.indexOf('身份证') > -1) {				// 身份证
      itemRules.push({ type: 'base_type_idcard' });
    } else if (note.indexOf('电话') > -1) {					// 手机或座机
      itemRules.push({ type: 'base_type_phone' });
    } else if (note.indexOf('数字字母') > -1) {					// 数字字母
      itemRules.push({ type: 'base_type_number_english' });
    } else if (note.indexOf('数字') > -1) {						// 数字
      itemRules.push({ type: 'base_type_number' });
    } else if (note.indexOf('NUMBER') > -1) {					// NUMBER(16|2)	或 NUMBER(16)
      let maxValTmp = note.substring(7, note.length - 1);		// 16|2	或 16
      let digit;
      let decimal;
      if (note.indexOf('|') > -1) {							// 含小数
        digit = maxValTmp.split('|')[0];					// 16
        decimal = maxValTmp.split('|')[1];					// 2
      } else {												// 整数，不含小数
        digit = maxValTmp;									// 16
        decimal = 0;										// 0
      }
      itemRules.push({ type: 'base_number', length: Number(digit), decimal: Number(decimal) });
    } else if (note == 'yyyy-MM-dd') {
      itemRules.push({ type: 'base_date', format: 'yyyyMMdd' });
    } else if (note == 'yyyyMM') {
      itemRules.push({ type: 'base_date', format: 'yyyyMM' });
    } else if (note == 'yyyy') {
      itemRules.push({ type: 'base_date', format: 'yyyy' });
    } else if (note == 'MM') {
      itemRules.push({ type: 'base_date', format: 'MM' });
    } else if (note.indexOf('[') > -1 && note.indexOf(']') > -1) {
      let indexLast = note.indexOf(']');
      let methodName = note.substring(1, indexLast);
      itemRules.push({ func: methodName });
    }
  }
  return itemRules;
}

// 修正列宽
assemble_config_util.modifyColWidth = (cols: any, formatArr: any) => {
  let tmpFormatArr = formatArr?.replace(new RegExp(',"', 'g'), '"').toLowerCase();
  if (tmpFormatArr === 'yyyy-mm-dd') {
    cols.width = 120;
    if (cols.title === '出口（开具）日期') {
      cols.width = 140;
    } else if (cols.title === '出口发票开具日期') {
      cols.width = 150;
    } else if (cols.title === '清算账单出具日期') {
      cols.width = 150;
    }
    else if (cols.title === '合同约定全部收汇最终日期') {
      cols.width = 220;
    }
    else if (cols.title === '报关单上的申报日期') {
      cols.width = 150;
    }
  } else if (tmpFormatArr === 'yyyy-mm-dd hh:mm') {
    cols.width = 140;
  } else if (tmpFormatArr === 'yyyy-mm-dd hh:mm:ss') {
    cols.width = 150;
  } else if (tmpFormatArr === '0,0.00') {
    // 示例：单价、金额、总价、保费、退税到账额、退税额、计税金额、美元离岸价、成交总价
    // 人民币离岸价、成交金额、运费金额、保费金额、杂费金额、申报价格、收款金额(本币)
    // 收款金额(原币)
    cols.width = 140;
    if (cols?.title?.indexOf('收款凭证总金额（美元）') > -1) {
      cols.width = 170;
    } else if (cols?.title?.indexOf('营业收入人民币金额') > -1 || cols?.title?.indexOf('收款凭证美元总金额') > -1) {
      cols.width = 180;
    } else if (cols?.title?.indexOf('合同总金额折人民币') > -1) {
      cols.width = 150;
    } else if (cols?.title?.indexOf('本期确认应税服务营业收入人民币金额') > -1) {
      cols.width = 150;
    } else if (cols?.title?.indexOf('跨境应税行为营业额免抵退税计税金额') > -1) {
      cols.width = 150;
    } else if (cols?.title?.indexOf('跨境应税行为免抵退税计税金额乘征退税率之差') > -1 ||  cols?.title?.indexOf('不得免征和抵扣税额') > -1
    || cols?.title?.indexOf('出口报关单人民币离岸价') > -1
    ) {
      cols.width = 180;
    }else if (cols?.title?.indexOf('出口销售人民币金额') > -1
    || cols?.title?.indexOf('出口收汇人民币金额') > -1
    || cols?.title?.indexOf('视同收汇人民币金额') > -1
    || cols?.title?.indexOf('出口发票美元离岸价') > -1
    || cols?.title?.indexOf('出口发票人民币离岸价') > -1
    || cols?.title?.indexOf('出口报关单美元离岸价') > -1
    || cols?.title?.indexOf('人民币离岸价差异额') > -1
    ) {
      cols.width = 160;
    }else if (cols?.title?.indexOf('进料加工保税进口料件组成计税价格') > -1 || cols?.title?.indexOf('国内购进免税原材料价格') > -1
    || cols?.title?.indexOf('视同收汇人民币金额') > -1

    ) {
      cols.width = 240;
    }

  } else if (tmpFormatArr === '0,0.0000') {
    // 示例：数量、申报数量、法定数量、第二数量、剩余数量、出口数量、成交数量、法定单位数量
    // 第二单位数、成交剩余数量
    cols.width = 140;
    if (cols?.title?.indexOf('调整前（报关单上的）退税率') > -1) {
      cols.width = 240;
    }
  } else if (tmpFormatArr === '0,0.00000') {
    // 示例：征税率、退税率
    cols.width = 100;
    if (cols?.title?.indexOf('出口销售币种汇率') > -1
    || cols?.title?.indexOf('人民币离岸价差异率') > -1

    ) {
      cols.width = 240;
    }
  } else if (tmpFormatArr === '0,0') {
    // 示例：条数
    cols.width = 100;
  } else if (cols?.title?.indexOf('名称') > -1
    || cols?.title?.indexOf('备注') > -1
    || cols?.title?.indexOf('用途') > -1
    || cols?.title?.indexOf('原因') > -1
    || cols?.title?.indexOf('境外单位') > -1
    || cols?.title?.indexOf('制度建设情况') > -1
    || cols?.title?.indexOf('风险系统情况') > -1
    || cols?.title?.indexOf('风评标准及方法') > -1
    || cols?.title?.indexOf('机构及人员情况') > -1
    || cols?.title?.indexOf('附送材料清单') > -1
    || cols?.title?.indexOf('附送材料清单') > -1
    || cols?.title?.indexOf('合同协议号') > -1) {
      cols.width = 180;
      cols.ellipsis = true;
      if (cols?.title === '调整前（报关单上的）商品名称' || cols?.title?.indexOf('付款单位所在国家（地区）名称') > -1 ) {
        cols.width = 240;
      }
      if (cols?.title === '海关总署认证企业类型名称') {
        cols.width = 240;
      }
  } else if (cols?.title?.indexOf('发票号码') > -1
    || cols?.title?.indexOf('出口发票号') > -1) {
    cols.width = 150;
    cols.ellipsis = true;
  } else if (cols?.title?.indexOf('收入凭证号') > -1
    || cols?.title?.indexOf('进货凭证号') > -1) {
    cols.width = 150;
    cols.ellipsis = true;
  } else if (cols?.title?.indexOf('发票代码') > -1) {
    cols.width = 130;
  } else if (cols?.title?.indexOf('报关单号') > -1) {
    cols.width = 180;
  } else if (cols?.title?.indexOf('专用发票号码') > -1) {
    cols.width = 150;
    cols.ellipsis = true;
  } else if (cols?.title?.indexOf('纳税人识别号') > -1
    || cols?.title?.indexOf('委托企业税号') > -1
    || cols?.title?.indexOf('加工企业税号') > -1
    || cols?.title?.indexOf('纳税号') > -1) {
    cols.width = 200;
  } else if (cols?.title === '序号') {
    cols.width = 80;
  } else if (cols?.title === '项号'
    || cols?.title === '行号') {
    cols.width = 60;
  } else if (cols?.title === '出口计量单位') {
    cols.width = 100;
  } else if (cols?.title === '所属期'
    || cols?.title?.indexOf('单位') > -1
    || cols?.title === '申报批次') {
    cols.width = 90;
    if (cols?.title?.indexOf('付款单位所在国家（地区）代码') > -1) {
      cols.width = 220;
    }
  } else if (cols?.title === '计量单位') {
    cols.width = 90;
    cols.ellipsis = true;
  } else if (cols?.title === '信息状态'
    || cols?.title === '开具状态'
    || cols?.title === '退税状态'
    || cols?.title === '发票状态'
    || cols?.title === '使用状态') {
    cols.width = 120;
  } else if (cols?.title?.indexOf('生产场所情况') > -1
    || cols?.title?.indexOf('生产设备情况') > -1
    || cols?.title?.indexOf('产能情况') > -1
    || cols?.title?.indexOf('员工情况') > -1
    || cols?.title?.indexOf('资金流情况') > -1
    || cols?.title?.indexOf('附送材料及清单') > -1) {
    cols.width = 180;
    cols.ellipsis = true;
  } else if (cols?.title?.indexOf('合同号') >-1  || cols?.title?.indexOf('材料种类') >-1 ) {
    cols.ellipsis = true;
  } else if (cols?.title === '手（账）册号') {
    cols.ellipsis = true;
  } else if (cols?.title === '出口货物销售额币种') {
    cols.width = 150;
  } else if (cols?.title === '缴款书号码') {
    cols.ellipsis = true;
  }
}

export default assemble_config_util;
