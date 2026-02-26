import myUtil from '../DDAssist/util';
import { itemType } from '../DDForm/data.d';
import dayjs from "dayjs";
import CONSTANTS from '../DDAssist/constants';
import tableUtil from '../DDBaseGrid/tableUtil';
import DDBunit2ADBUtil from './DDBunit2ADBUtil';
import DDIT_TOOL_CONSTANTS from './excelConfig.v2.constants';

const CONFIG_KEY = DDIT_TOOL_CONSTANTS.CONFIG_KEY;
// import { getAdfPlan } from '@/services/hts/api';
// import { testDataAdfPlan } from '../DDAdvancedFilter';

const UnitUtil: any = {};

// 列表工具类
UnitUtil.grid = {

  // 组装默认的筛选条件(普通筛选、标题行筛选)
  initAssembleSearchModel(param: any) {
    const { unitKey, filterItems, gridFilterQuick, initSearchModal } = param;
    const assembleItem: any = [...gridFilterQuick, ...filterItems];
    const searchModel: any[] = [];
    assembleItem.forEach((item: any) => {
      let op: any = item.op ? item.op : CONSTANTS.FILTER_CONDITION.include.condetionCode; // 包含
      let value: any = item.defaultValue;
      let dataDdType: any = item.type;
      const searchFlag: any = item.searchFlag;
      if (value && searchFlag !== false) {
        if (item.type === itemType.DatePicker) {
          value = value.valueOf();
          if (item.defaultValue instanceof Array) {
            let searchModelObj1: any = {
              type: dataDdType,
              property: item.name,
              value: (item.defaultValue[0]).valueOf(),
              op: CONSTANTS.FILTER_CONDITION.greaterThanOrEqual.condetionCode, // 大于等于
            };
            myUtil.mysql.addDbFields(searchModelObj1, item); // 补充数据库字段
            searchModel.push(searchModelObj1);
            op = CONSTANTS.FILTER_CONDITION.lessThanOrEqual.condetionCode; // 小于等于
            value = (item.defaultValue[1]).valueOf();
          }
        }
        let searchModelObj: any = {
          type: dataDdType,
          property: item.name,
          value,
          op,
        };
        myUtil.mysql.addDbFields(searchModelObj, item); // 补充数据库字段
        searchModel.push(searchModelObj);
      }
    });
    return {
      key: unitKey,
      searchModel: [
        ...searchModel
      ],
      orderModel: [],
      initSearchModal,
    }
  },

  // 组装普通筛选、标题行筛选 searchModel
  assembleSearchModel(form: any, items?: any) {
    const values = form.getFieldsValue(true);
    const searchModel: any[] = [];
    if (!items || items.length === 0) {
      return searchModel;
    }
    items.forEach((item: any) => {
      let tmpKey: any = item.name;
      if (tmpKey && (values[tmpKey] || values[tmpKey + '_searchModelQ'] || values[tmpKey + '_searchModelZ'])) {
        let dataDdType: any = item.type;
        let op: any = item.op ? item.op : CONSTANTS.FILTER_CONDITION.include.condetionCode; // 包含
        let value: any = values[tmpKey];
        if (dataDdType === itemType.Input) {
          if (item.range) {
            let tmpItem1 = {
              type: dataDdType,
              property: tmpKey,
              value: values[tmpKey + '_searchModelQ'] || '',
              op: CONSTANTS.FILTER_CONDITION.greaterThanOrEqual.condetionCode, // 大于等于
            }
            myUtil.mysql.addDbFields(tmpItem1, item); // 补充数据库字段
            searchModel.push(tmpItem1);
            op = CONSTANTS.FILTER_CONDITION.lessThanOrEqual.condetionCode; // 小于等于
            value = values[tmpKey + '_searchModelZ'] || '';
          }
        } else if (dataDdType === itemType.InputNumber) {
          if (item.range) {
            let tmpItem1 = {
              type: dataDdType,
              property: tmpKey,
              value: values[tmpKey + '_searchModelQ'] || '',
              op: CONSTANTS.FILTER_CONDITION.greaterThanOrEqual.condetionCode, // 大于等于
            }
            myUtil.mysql.addDbFields(tmpItem1, item); // 补充数据库字段
            if (tmpItem1.value) {
              searchModel.push(tmpItem1);
            }
            op = CONSTANTS.FILTER_CONDITION.lessThanOrEqual.condetionCode; // 小于等于
            value = values[tmpKey + '_searchModelZ'] || '';
          } else {
            op = CONSTANTS.FILTER_CONDITION.equal.condetionCode; // 等于
          }
        } else if (dataDdType === itemType.Select) {
          op = CONSTANTS.FILTER_CONDITION.equal.condetionCode;
        } else if (dataDdType === itemType.AutoComplete) {

        } else if (dataDdType === itemType.Checkbox) {
          op = CONSTANTS.FILTER_CONDITION.in.condetionCode;
        } else if (dataDdType === itemType.DatePicker) {
          value = value.valueOf();
          // 需要根据后端需求调整
          op = item.op ? item.op : CONSTANTS.FILTER_CONDITION.greaterThanOrEqual.condetionCode; // 大于等于
          if (values[tmpKey] instanceof Array) {
            let tmpItem1 = {
              type: dataDdType,
              property: tmpKey,
              value: (new Date(values[tmpKey][0].format('YYYY/MM/DD'))).getTime(),
              op: CONSTANTS.FILTER_CONDITION.greaterThanOrEqual.condetionCode,
            }
            myUtil.mysql.addDbFields(tmpItem1, item); // 补充数据库字段
            searchModel.push(tmpItem1);
            op = CONSTANTS.FILTER_CONDITION.lessThanOrEqual.condetionCode;
            value = myUtil.date.accurateDate(values[tmpKey][1].format('YYYY/MM/DD'), '2');
          } else {
            value = (new Date(dayjs(value).format("YYYY/MM/DD"))).getTime();
          }
        } else if (dataDdType === itemType.TreeSelect) {
          if (item.labelInValue) {
            value = value.label;
          }
        } else if (dataDdType === itemType.InputTags) {
          op = CONSTANTS.FILTER_CONDITION.in.condetionCode;
        }
        if (!(op === CONSTANTS.FILTER_CONDITION.in.condetionCode && value?.length === 0)) { // 去除空checkbox
          const tmpItem: any = {
            type: dataDdType,
            property: tmpKey,
            value: value,
            value2: value, // InputTags\Select&&multiple 后端适配字段
            op,
          }
          myUtil.mysql.addDbFields(tmpItem, item); // 补充数据库字段
          if (tmpItem.value) {
            searchModel.push(tmpItem);
          }
        }
      }
    });
    return searchModel;
  },

  // 组装列头筛选 searchModel
  assembleColSearchModel(colFilterValue: any, items?: any) {
    const searchModel: any[] = [];
    if (!colFilterValue || colFilterValue.length === 0) {
      return searchModel;
    }
    Object.keys(colFilterValue).forEach((key) => {
      if (key && colFilterValue[key]) {
        items.forEach((item: any) => {
          if (item.dataIndex === key) {
            let searchModelObj = {
              property: key,
              values: colFilterValue[key],
              op: item.filter?.type === 'Input' ? CONSTANTS.FILTER_CONDITION.include.condetionCode :
                  CONSTANTS.FILTER_CONDITION.in.condetionCode,
            }
            myUtil.mysql.addDbFields(searchModelObj, item); // 补充数据库字段
            searchModel.push(searchModelObj);
          }
        })
      }
    });
    return searchModel;
  },
};

// 高级筛选工具类
UnitUtil.filterAdvanced = {
  // init
  init(items: any = {}) {
    const { range = [] } = items;
    range.forEach((item: any) => {
      const { quickOption } = item;
      if (typeof (item?.type) === 'string') {
        item.type = itemType[item?.type];
      }
      if (quickOption && quickOption.type && typeof (quickOption.type) === 'string') {
        quickOption.type = itemType[quickOption.type];
      }
    });
    return items;
  },
};

// 布局
UnitUtil.layout = {
  // 设置工具栏布局
  getToobarAffix({layoutType, toobarAffix}: any) {
    let affix: any = CONSTANTS.LAYOUT_HEADER_HEIGHT;
    // 首先根据layoutType设置工具栏affix
    if (layoutType === 'tabs') {
      affix = 84;
    } else if (layoutType === 'modal') {
      affix = false;
    } else {
      const layoutGlobal: any = myUtil.theme.getThemeItem('layout');
      const fixedHeader: any = myUtil.theme.getThemeItem('fixedHeader');
      if (layoutGlobal === 'side') {
        affix = 0;
      } else if (layoutGlobal === 'top') {
        affix = fixedHeader ? CONSTANTS.LAYOUT_HEADER_HEIGHT : 0;
      } else if (layoutGlobal === 'mix') {
        affix = CONSTANTS.LAYOUT_HEADER_HEIGHT;
      }
    }
    // 如果配置中另外设置了toobarAffix，则采用配置中toobarAffix
    if (toobarAffix !== undefined) {
      affix = toobarAffix;
    }
    return affix;
  },
  // 设置列表布局
  getGridLayout({filterItems, layoutType, columns, gridScrollX, gridScrollY, gridStickyAffix }: any) {
    const calcParam = ['header', 'cardMargin', 'toolbar', 'pagination', 'gridHeader', '20px', '20px', '1px'];
    if (filterItems?.length > 0) {
      calcParam.push('filter')
    }
    if (layoutType === 'tabs') {
      calcParam.push('headerTab')
    }
    const sumFlag = tableUtil.isSum(columns);
    if (sumFlag) {
      calcParam.push('60px');
    }
    let lay: any = {};
    if (layoutType === 'tabs') { // tabs
      lay.isSticky = '134';
    } else if (layoutType === 'modal') { // modal
      lay = {
        scroll: {
          y: sumFlag ? `${document.documentElement.clientHeight - 363}px` : `${document.documentElement.clientHeight - 270}px`
        },
      }
    } else { // default
      const layoutGlobal: any = myUtil.theme.getThemeItem('layout');
      const fixedHeader: any = myUtil.theme.getThemeItem('fixedHeader');
      const layoutToolbarHeight = JSON.parse(myUtil.theme.getThemeItem('compact').replace('theme_compact_', '')) ? 42 : CONSTANTS.LAYOUT_TOOLBAR_HEIGHT;
      if (layoutGlobal === 'side') {
        lay.isSticky = layoutToolbarHeight;
      } else if (layoutGlobal === 'top') {
        if (fixedHeader) {
          lay.isSticky = CONSTANTS.LAYOUT_HEADER_HEIGHT + layoutToolbarHeight;
        } else {
          lay.isSticky = layoutToolbarHeight;
        }
      } else if (layoutGlobal === 'mix') {
        lay.isSticky = CONSTANTS.LAYOUT_HEADER_HEIGHT + layoutToolbarHeight;
      }
    }
    // lay.scroll = lay.scroll || {};
    // 如果配置中另外设置了gridStickyAffix，则采用配置中gridStickyAffix
    if (gridStickyAffix !== undefined) {
      lay.isSticky = gridStickyAffix;
    }
    if (gridScrollY || gridScrollX) {
      lay.scroll = {};
      if (gridScrollY) {
        lay.scroll.y = gridScrollY;
      }
      if (gridScrollX) {
        lay.scroll.x = gridScrollX;
      }
    }
    // lay.scroll.x = gridScrollX || '700px';
    return lay;
  }
}

// 高级筛选
UnitUtil.adf = {
  getAdfPlanParam({ setAdFPlan, unitKey }: any) {
    if (unitKey) {
      let customerConfig: any = myUtil.sessionStore.getItem('customerConfig') || {};
      let adf_plan: any = customerConfig['adf_plan'] || {};
      let planCurrent: any = adf_plan[unitKey];
      for (let i=0; i<planCurrent?.length; i++) {
        planCurrent[i].adfNameCurrentUsed = false;
        planCurrent[i].adfNameIsShow = false;
      }
      setAdFPlan(planCurrent);
    }
  },
  getAdfFieldParam({config, setAdFField}: any) {
    let colArr = config?.grid_columns || [];
    let tmpFieldArr: any = [];
    for (let i=0; i<colArr.length; i++) {
      let tmpCol: any = colArr[i] || {};
      let parmTmp: any = {};
      parmTmp[CONFIG_KEY.DICT_FIELD_TYPE] = tmpCol[CONFIG_KEY.DICT_FIELD_TYPE];
      parmTmp.haveCodeTable = tmpCol.codeTable ? true: false;
      let tmpField: any = {
        type: DDBunit2ADBUtil.getFieldInputType(parmTmp),
      };
      tmpField[CONFIG_KEY.DICT_FIELD_ID] = tmpCol[CONFIG_KEY.DICT_FIELD_ID]; // 字段主键
      tmpField[CONFIG_KEY.DICT_FIELD_NAME] = tmpCol[CONFIG_KEY.DICT_FIELD_NAME]; // 字段名称
      tmpField[CONFIG_KEY.DICT_FIELD_DESC] = tmpCol[CONFIG_KEY.DICT_FIELD_DESC]; // 字段含义
      tmpField[CONFIG_KEY.DICT_FIELD_TYPE] = tmpCol[CONFIG_KEY.DICT_FIELD_TYPE] // 数据类型
      tmpField[CONFIG_KEY.DICT_FIELD_REL_TABLE] = tmpCol[CONFIG_KEY.DICT_FIELD_REL_TABLE]; // 关联数据表 (字段所处表)
      tmpField[CONFIG_KEY.DICT_FIELD_FLAG] = tmpCol[CONFIG_KEY.DICT_FIELD_FLAG]; // 与原库间的关系 (主表 or 关联表)
      tmpField[CONFIG_KEY.DICT_FIELD_ALIAS] = tmpCol[CONFIG_KEY.DICT_FIELD_ALIAS]; // 其它名称（别名）
      tmpField[CONFIG_KEY.DICT_NAME] = tmpCol[CONFIG_KEY.DICT_NAME];
      if (tmpCol.codeTable) {
        tmpField.codeTable = tmpCol.codeTable;
      }
      tmpFieldArr.push(tmpField);
    }
    setAdFField(tmpFieldArr);
  }
}

// 视图设置
UnitUtil.gridViewSetting = {
  getGridViewPlan({ setGridViewPlan, unitKey }: any) {
    if (unitKey) {
      const viewConfig: any = myUtil.localStore.getItem('view_config') || {};
      const currentViewConfig: any = viewConfig[unitKey] || [];
      setGridViewPlan(currentViewConfig);
    }
  },
  // 设置当前使用方案标识
  setGridViewUsed(pageId: any, schemeData: any, setGridViewPlan: any) {
    const viewConfig: any = myUtil.localStore.getItem('view_config') || {};
    const viewId: string = pageId;
    const currentViewConfig: any = viewConfig[viewId] || [];
    currentViewConfig.forEach((item: any) => {
      if (schemeData) {
        item.isUsed = schemeData.faid === item.faid;
      } else {
        item.isUsed = false;
      }
    });
    viewConfig[viewId] = currentViewConfig;
    myUtil.localStore.setItem('view_config', viewConfig);
    setGridViewPlan(currentViewConfig);
  }
}

export default UnitUtil;
