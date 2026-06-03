import React, { Fragment } from 'react';
import myUtil from '@/pages/common/myUtil';
import cjpzUtil from '@/pages/common/cjpzUtil';
import columnsRender from '@/pages/common/field/eventColRender';
import { Radio, Button, Input, Space, Tooltip, Divider, Tag, Badge } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { itemType } from '@/components/DDForm/data.d';
import baseValidator from '@/pages/common/field/baseValidator';
import { useRouteMatch, useModel, useAccess } from 'umi';
import moment from 'moment';
import qxUtil from '@/pages/common/qxUtil';
import { history } from 'umi';
import iconMapping, { iconColor } from '@/pages/common/iconMapping';

const UnitUtil: any = {};

// 列表工具类
UnitUtil.config = {
  modify(tmpConfig: any) {
    const access = useAccess(); // 差异化

    const routeMatch = useRouteMatch();
    const [routePathname] = [...routeMatch.path.split('/')].reverse();
    // 申报明细查看弹窗
    if (routePathname.indexOf('SBMXCX') > -1 || routePathname.indexOf('/27/2705') > -1
      || routePathname.indexOf('/26/2605') > -1 || routePathname.indexOf('/25/2505') > -1) {
      const { DDB2PageData } = useModel('ddb2');
      // 申报明细查看，去掉台账筛选选项
      const filterItems = tmpConfig?.filter_items || [];
      const tmpFilterItems: any = [];
      filterItems.forEach((item: any) => {
        if (item?.name != 'tzsxbz') {
          tmpFilterItems.push(item);
        }
      });
      tmpConfig.filter_items = tmpFilterItems;
      tmpConfig.unit_key = tmpConfig.unit_key.substring(0, tmpConfig.unit_key.length - 2) + '_J';
      const initSearchModal: any = tmpConfig?.gridParams?.initSearchModal || [];
      if (DDB2PageData?.ssq?.trim()) {
        initSearchModal.push({ property: 'ssq', value: DDB2PageData?.ssq, op: 'al' })
      }
      if ((DDB2PageData?.sbpc?.trim())) {
        initSearchModal.push({ property: 'sbpc', value: DDB2PageData?.sbpc, op: 'al' })
      }
      if ((DDB2PageData?.tbrq1?.trim())) {
        initSearchModal.push({ property: 'tbrq1', value: DDB2PageData?.tbrq1, op: 'dd' })
      }
      // bug: 19081 申报明细查看时不需要所属期、申报批次、填报日期作为筛选条件
      if (tmpConfig?.filter_items && tmpConfig?.filter_items?.length > 0) {
        const tmpFilterItems: any = [];
        tmpConfig.filter_items.forEach((item: any) => {
          if (item.name != 'ssq' && item.name != 'sbpc' && item.name != 'tbrq1') {
            tmpFilterItems.push(item);
          }
        })
        tmpConfig.filter_items = tmpFilterItems;
      }
      tmpConfig.gridParams = {
        initSearchModal,
      };
      // 配置项：列表操作列
      tmpConfig.grid_handle_columns_default = {
        edit: false,                       	// 是否显示编辑链接，默认关闭
        delete: false,                     	// 是否显示删除链接，默认关闭
      };
      if (routePathname == 'SBMXCX_JLJG_02') {
        tmpConfig.export_key = 'JLJGHX_HXSBSJGL_YHXSZCHGSJTZB_JGB_DC';
      }
      // else {
        tmpConfig.toolbar_default = {
          add: false, // 是否显示增加按钮，默认关闭
          edit: false, // 是否显示修改按钮，默认关闭
          delete: false, // 是否显示删除按钮，默认关闭
          ckts_download: true, // 是否显示导出按钮，默认关闭
          upload: false,  // 是否显示导入按钮，默认关闭
          ckts_sum: false, // 是否显示小计按钮，默认关闭
          ckts_order: false, // 是否显示序号重排(默认规则：选择排序)按钮，默认关闭
          setting: true, // 是否显示设置按钮，默认关闭
          reload: true, // 是否显示刷新按钮，默认关闭
          full: true, // 是否显示全屏按钮，默认关闭
        };
      // }
      cjpzUtil.bdcj.formatConfig(tmpConfig, 'SBMXCX');
      // 配置项：自定义操作列
      delete tmpConfig.handle_columns;
      delete tmpConfig.costomer_toobar;
      // 页面类型
      tmpConfig.layout_type = 'modal';
      tmpConfig.grid_scroll_y = `${document.documentElement.clientHeight - 315}px`;
    } else if (routePathname.indexOf('CXTJ_') > -1) { // 数据管理， 查询统计
      const filterItems = tmpConfig?.filter_items || [];
      const tmpFilterItems: any = [];
      filterItems.forEach((item: any) => {
        if (item?.name != 'tzsxbz') {
          tmpFilterItems.push(item);
        }
      });
      tmpConfig.filter_items = tmpFilterItems;
      // eg: MTS_ZXSB_SB_MTS_TSSB_G (采集) -> MTS_ZXSB_SB_MTS_TSSB_F (数据管理，查询统计)
      if (tmpConfig.unit_key.substr(tmpConfig.unit_key.length - 2, 2) === '_G') {
        tmpConfig.unit_key = tmpConfig.unit_key.substr(0, tmpConfig.unit_key.length - 2) + '_F';
      }
      // 配置项：配置列表列 统计
      tmpConfig.grid_columns = tmpConfig.grid_columns_tj || tmpConfig.grid_columns;
      // 配置项：工具栏
      cjpzUtil.bdcj.formatConfig(tmpConfig, 'CXTJ');
      if (tmpConfig.unit_key.indexOf('DBTS_ZXSB_SB_DB_DBTSYTSKMX') < 0 && tmpConfig.unit_key.indexOf('QTYW_ZXSB_TY_KJDSHWC_HSTZ_F') < 0
        && ((tmpConfig.unit_key.indexOf('ZGBA_') < 0 && tmpConfig.unit_key.indexOf('ZMKJ_ZXSB_ZM_MSCKJYJH_S') < 0) || tmpConfig.unit_key.indexOf('ZGBA_ZXSB_SB_MDT_XTHHZG_S') > -1)) {
        tmpConfig.toolbar_default.cxtj_report = true; // 是否显示打印报表下载按钮，默认关闭
      } else {
        tmpConfig.toolbar_default.cxtj_report = false; // 是否显示打印报表下载按钮，默认关闭
      }

      // 配置项：列表操作列
      tmpConfig.grid_handle_columns_default = {
        edit: false,                       	// 是否显示编辑链接，默认关闭
        delete: false,                     	// 是否显示删除链接，默认关闭
      };
      // 配置项：自定义操作列
      delete tmpConfig.handle_columns;
      // 20240910 标准版变更：数据管理（查询统计）页面新增自定义按钮
      if (tmpConfig.costomer_toobar_tj) {
        tmpConfig.costomer_toobar = tmpConfig.costomer_toobar_tj;
      } else {
        delete tmpConfig.costomer_toobar;
      }
    }

    // else if (routePathname.indexOf('DLCKZMCX_') > -1) { // 数据管理， 受托方已开具代理出口证明查询
    //   // 单一窗口--------------------
    //   const paramDyck = {
    //     qxCode: 'stf_dyck',
    //     accessObj: access,
    //   }
    //   if(!qxUtil.getQxz(paramDyck)) {
    //     tmpConfig.export_key = 'WBSJ_SJGLSAAS_STFYKJDLCKHWZM_DC';

    //     // 配置项：工具栏
    //     tmpConfig.toolbar_default = {
    //       add: false, // 是否显示增加按钮，默认关闭
    //       edit: false, // 是否显示修改按钮，默认关闭
    //       delete: false, // 是否显示删除按钮，默认关闭
    //       download: true, // 是否显示导出按钮，默认关闭
    //       upload: false,  // 是否显示导入按钮，默认关闭
    //       ckts_sum: false, // 是否显示小计按钮，默认关闭
    //       ckts_order: false, // 是否显示序号重排(默认规则：选择排序)按钮，默认关闭
    //       setting: true, // 是否显示设置按钮，默认关闭
    //       reload: true, // 是否显示刷新按钮，默认关闭
    //       full: true, // 是否显示全屏按钮，默认关闭
    //     };
    //     // 配置项：列表操作列
    //     tmpConfig.grid_handle_columns_default = {
    //       edit: false,                       	// 是否显示编辑链接，默认关闭
    //       delete: false,                     	// 是否显示删除链接，默认关闭
    //     };
    //     // 配置项：自定义操作列
    //     delete tmpConfig.handle_columns;
    //     delete tmpConfig.costomer_toobar;
    //     tmpConfig.costomer_toobar = [
    //       { name: '打印', key: '5B0E0D24C5540BE634F369AC77F43211', func: 'dyFunc' },
    //       { name: '删除', key: 'sc', func: 'btnDelete'},
    //     ];
    //   }
    // }
    else if (routePathname.indexOf('JXFP_') > -1) { // 数据管理， 进项发票数据查询-增值税专用发票数据
      const paramDyck = {
        qxCode: 'jxfp_dyck',
        accessObj: access,
      }
      if (qxUtil.getQxz(paramDyck)) {
        // 配置项：工具栏
        tmpConfig.toolbar_default = {
          add: false, // 是否显示增加按钮，默认关闭
          edit: false, // 是否显示修改按钮，默认关闭
          delete: false, // 是否显示删除按钮，默认关闭
          tssb_download: true, // 是否显示导出按钮，默认关闭
          upload: true,  // 是否显示导入按钮，默认关闭
          ckts_sum: false, // 是否显示小计按钮，默认关闭
          ckts_order: false, // 是否显示序号重排(默认规则：选择排序)按钮，默认关闭
          setting: true, // 是否显示设置按钮，默认关闭
          reload: true, // 是否显示刷新按钮，默认关闭
          full: true, // 是否显示全屏按钮，默认关闭
        };
        tmpConfig.import_key = 'SAAS_SJGL_JXFPSJCX_ZZSFPDZSJ_DR';                // 导入
        tmpConfig.import_mb_key = 'SAAS_SJGL_JXFPSJCX_ZZSFPDZSJ_DC';              // 导入模板下载
      } else {
        // 配置项：工具栏
        tmpConfig.toolbar_default = {
          add: false, // 是否显示增加按钮，默认关闭
          edit: false, // 是否显示修改按钮，默认关闭
          delete: false, // 是否显示删除按钮，默认关闭
          tssb_download: true, // 是否显示导出按钮，默认关闭
          upload: false,  // 是否显示导入按钮，默认关闭
          ckts_sum: false, // 是否显示小计按钮，默认关闭
          ckts_order: false, // 是否显示序号重排(默认规则：选择排序)按钮，默认关闭
          setting: true, // 是否显示设置按钮，默认关闭
          reload: true, // 是否显示刷新按钮，默认关闭
          full: true, // 是否显示全屏按钮，默认关闭
        };
      }
      tmpConfig.grid_columns[3] = {
        title: '发票种类', dataIndex: 'fpzlDm1', width: 160, codeTable: ['CODE_DM_ZXSB_FPZLXQGZ', '02'],
        filter: {
          type: 'Select',
          codeTable: ['CODE_DM_ZXSB_FPZLXQGZ', '02'],
        }
      };

      // 配置项：列表操作列
      tmpConfig.grid_handle_columns_default = {
        edit: false,                       	// 是否显示编辑链接，默认关闭
        delete: false,                     	// 是否显示删除链接，默认关闭
      };


      // 配置项：自定义操作列
      delete tmpConfig.handle_columns;
    } else {
      if (tmpConfig && tmpConfig.toolbar_default) {
        tmpConfig.toolbar_default.cxtj_report = false; // 是否显示打印报表下载按钮，默认关闭
      }
    }


    // else if (routePathname.indexOf('/020301') > -1) {
    //   // 配置项：工具栏
    //   tmpConfig.toolbar_default = {
    //     add: false, // 是否显示增加按钮，默认关闭
    //     edit: false, // 是否显示修改按钮，默认关闭
    //     delete: false, // 是否显示删除按钮，默认关闭
    //     ckts_download: true, // 是否显示导出按钮，默认关闭
    //     upload: false,  // 是否显示导入按钮，默认关闭
    //     setting: true, // 是否显示设置按钮，默认关闭
    //     reload: true, // 是否显示刷新按钮，默认关闭
    //     full: true, // 是否显示全屏按钮，默认关闭
    //   };
    //   // 列表
    //   tmpConfig.grid_columns = tmpConfig.grid_columns2;
    //   // 筛选
    //   tmpConfig.filter_items = tmpConfig.filter_items2;
    //   // 接口
    //   tmpConfig.grid_api_grid_query = `${API_URL_BASE}/yw/saas/sjgl/hgsjcx/saasHgsjcxCkhwbgdPage`;
    //   // 导出key
    //   tmpConfig.unit_key = 'EXCEL_REPORT_SJGLSAAS_HGSJCX_CKBGD'; // 业务单元key，对应后端接口
    //   tmpConfig.export_key = 'SAAS_SJGL_HGSJCX_CKHWBGD_DC'; // 业务单元key，对应后端接口
    //   // 配置项：列表操作列
    //   tmpConfig.grid_handle_columns_default = {
    //     edit: false,                       	// 是否显示编辑链接，默认关闭
    //     delete: false,                     	// 是否显示删除链接，默认关闭
    //   };
    //   // 配置项：自定义操作列
    //   delete tmpConfig.costomer_toobar;
    //   tmpConfig.costomer_toobar = [
    //     { name: '打印', key: '5B0E0D24C5540BE634F369AC77F0E2D1', func: 'dyFunc' },
    //     { name: '删除', key: 'sc', func: 'btnDelete'},
    //   ];

    // }
    // 集成修正：只集成页面的情况下，去掉全屏按钮
    const jcfs = localStorage.getItem('jcfs');
    if (jcfs) {
      if (tmpConfig?.toolbar_default?.full) {
        tmpConfig.toolbar_default.full = false;
      }
    }
    return tmpConfig;
  },
  modifyPageId(page_id :any, unit_key: any) {
    const routeMatch = useRouteMatch();
    const [routePathname] = [...routeMatch.path.split('/')].reverse();
    // 申报明细查看弹窗 
    if (routePathname.indexOf('SBMXCX') > -1 || routePathname.indexOf('/27/2705') > -1
      || routePathname.indexOf('/26/2605') > -1 || routePathname.indexOf('/25/2505') > -1) {
        return unit_key || page_id;
    }
    // 数据管理， 查询统计
    if (routePathname.indexOf('CXTJ_') > -1) { 
      if (unit_key.substr(unit_key.length - 2, 2) === '_F') {
        return unit_key || page_id;
      }
    }
    return page_id || unit_key;
  },
  // 特殊导出接口参数处理 hx/ty/report/excelExportGet
  exportGetParamSwitch(param: any) {
    const { searchModel, unit_key } = param
    let tmp: any = {};
    if (unit_key === 'EXCEL_REPORT_WBSJ_CKBGD') {
      searchModel.forEach((item: any) => {
        if (item.op === 'dydy') {
          tmp[item.property + 'Qs'] = moment(item.value).format('YYYY-MM-DD')
        } else if (item.op === 'xydy') {
          tmp[item.property + 'Jz'] = moment(item.value).format('YYYY-MM-DD')
          tmp['rangeDate' + item.property] = tmp[item.property + 'Qs'] + '-' + tmp[item.property + 'Jz'];
        } else {
          tmp[item.property] = item.value;
        }
      });
      tmp.ywKey = 'WBSJ';
    } else if (unit_key === 'EXCEL_REPORT_WBSJ_DZDZFP') {
      searchModel.forEach((item: any) => {
        if (item.op === 'dydy') {
          tmp[item.property + 'Start'] = moment(item.value).format('YYYY-MM-DD');
        } else if (item.op === 'xydy') {
          tmp[item.property + 'End'] = moment(item.value).format('YYYY-MM-DD');
        } else {
          tmp[item.property] = item.value;
        }
      });
      tmp.ywKey = 'WBSJ';
    } else if (unit_key === 'MTS_ZXSB_SB_MTS_TSSB_G') {
      searchModel.forEach((item: any) => {
        if (item.property === 'glh') {
          tmp['rangeStartglh'] = item.value;
          tmp['rangeEndglh'] = item.value;
        } else {
          tmp[item.property] = item.value;
        }
      });
      tmp.ywKey = 'MTS';
    }
    return tmp;
  }
}

// 列表工具类
UnitUtil.grid = {

  // init
  init(param: any) {
    let { columns } = param;
    const { changeDDB2PageData, otherRef, gridRef, unitRef, handleColumnsDefault, handleColumns, func, popupUpdate, handleDelete, grid_handle_width } = param;
    // 列渲染
    const initRender = (targetColumn: any) => {
      // 渲染图形
      const renderIcon = ({ key, text, map, tag, circle, icon }: any) => {
        // 显示文字
        let showText: any = text;
        if (map && map.length > 0) {
          let targetEle = map?.find((item: any) => { return item.value === (key ? key : text) });
          if (!targetEle) {
            targetEle = map?.find((item: any) => { return item.value === '' });
          }
          showText = targetEle?.text;
        }
        // Tag
        if (tag && tag.length > 0) {
          let targetEle = tag?.find((item: any) => { return item.value === (key ? key : text) });
          if (!targetEle) {
            targetEle = tag?.find((item: any) => { return item.value === '' });
          }
          if (showText) {
            showText = <Tag color={targetEle?.color || 'default'}>{showText}</Tag>;
          }
        }
        // circle
        if (circle && circle.length > 0) {
          let targetEle = circle?.find((item: any) => { return item.value === (key ? key : text) });
          if (!targetEle) {
            targetEle = circle?.find((item: any) => { return item.value === '' });
          }
          showText = <Space size={5}>
            <Badge status={targetEle.color || 'default'} key={targetEle.color || 'default'} />
            {showText}
          </Space>;
        }
        // icon
        if (icon && icon.length > 0) {
          let targetEle: any = icon?.find((item: any) => { return item.value === (key ? key : text) });
          if (!targetEle) {
            targetEle = icon?.find((item: any) => { return item.value === '' });
          }
          showText = <Space size={5}>
            <span style={{ color: iconColor[targetEle.color] }}>{iconMapping[targetEle.icon]}</span>
            {targetEle.isShowText ? showText : ''}
          </Space>;
        }
        return showText;
      }
      // render
      if (targetColumn.render && typeof (targetColumn.render) !== 'function') {
        const { type, format, func: RenderFunc, map, tag, circle, icon } = targetColumn.render;
        if (type === 'number') {
          // 格式化数值格式
          targetColumn.render = (text: any) => {
            if (text && text.toString().indexOf('／') > -1) {
              const arr = text.split('／');
              return myUtil.grid.formatNum(arr[0], format) + '／' + myUtil.grid.formatNum(arr[1], format);
            } else if (text && text.toString().indexOf('/') > -1) {
              const arr = text.split('/');
              return myUtil.grid.formatNum(arr[0], format) + '/' + myUtil.grid.formatNum(arr[1], format);
            } else {
              return myUtil.grid.formatNum(text, format);
            }
          }
          targetColumn.format = format;
        } else if (type === 'date') {
          // 格式化日期格式
          targetColumn.render = (text: any) => {
            return myUtil.grid.formatDate(text, format);
          }
        } else if ((map || tag || circle || icon) && !targetColumn.codeTable) {
          // 格式化map
          targetColumn.render = (text: any) => {
            return renderIcon({ text, map, tag, circle, icon });
          }
        } else {
          // 自定义格式化方法
          targetColumn.format = format;
          targetColumn.render = (text: any, record: any, index: any) => {
            const renderParam = {
              text,
              record,
              otherRef,
              gridRef,
              unitRef,
              index
            }
            if (func.columnsRender && func.columnsRender[RenderFunc]) {
              if (func?.columnsRender[RenderFunc]) {
                return func.columnsRender[RenderFunc](renderParam);
              }
            } else {
              if (columnsRender[RenderFunc]) {
                return columnsRender[RenderFunc](renderParam);
              }
            }
          }
        }
      }
      // ellipsis
      if (!targetColumn.render && targetColumn.ellipsis) {
        // 没有render 并且有elipse
        targetColumn.ellipsis = { showTitle: false, }
        targetColumn.render = (text: any) => {
          return <><Tooltip placement="topLeft" title={text}> {text}</Tooltip></>
        }
      }
      // title
      if (targetColumn.title?.toString().indexOf('{br}') > -1) {
        const titleBrArr: any = targetColumn.title.split('{br}');
        const titleBr: any = [];
        titleBrArr?.forEach((title: any, index: number) => {
          titleBr.push(title);
          if (index !== titleBrArr.length - 1) {
            titleBr.push(<br key={index.toString()} />);
          }
        })
        targetColumn.title = <span>{titleBr}</span>;
      }
      // title tooltip
      if (targetColumn.titleTooltip) {
        const tooltip: any = [];
        const titleTooltipArr: any = targetColumn.titleTooltip.split('{br}');
        titleTooltipArr?.forEach((tip: any, index: number) => {
          tooltip.push(tip);
          if (index !== titleTooltipArr.length) {
            tooltip.push(<br key={index.toString()} />);
          }
        });
        targetColumn.title = <>
          {/* <Tooltip title={tooltip} overlayInnerStyle={{width:'255px'}}> */}
          <Tooltip title={tooltip}>
            <span>{targetColumn.title} <QuestionCircleOutlined /></span>
          </Tooltip>
        </>;
        delete targetColumn.titleTooltip;
      }
    }

    // 列头过滤
    const initFilter = (targetColumn: any) => {
      if (targetColumn.filter) {
        const { type, list, codeTable, showCode, value } = targetColumn.filter;
        if (type === 'Select') {
          if (list?.length > 0) {
            targetColumn.filters = list;
          } else if (codeTable) {
            const tmpList: any = myUtil.code.getHeaderFilterOption(codeTable[0], codeTable[1], showCode);
            targetColumn.filters = tmpList;
          }

          // 如果有赋值
          if (value?.length > 0) {
            targetColumn.defaultFilteredValue = value;
            targetColumn.filtered = true;
          }

          // 筛选项支持筛选
          targetColumn.filterSearch = true;
        } else if (type === 'Tree') {
          targetColumn.filters = list;
          targetColumn.filterMode = 'tree';
          targetColumn.filterSearch = true;
        } else if (type === 'Radio') {
          const arr: any = [];
          let tmpList: any;
          if (list?.length > 0) {
            tmpList = list;
          } else if (codeTable) {
            tmpList = myUtil.code.getHeaderFilterOption(codeTable[0], codeTable[1], showCode);
          }
          if (!(list?.length > 0)) {
            arr.push(<Radio key={tmpList.length.toString()} value={''}>{'全部'}</Radio>);
          }
          tmpList.forEach((item: any, index: number) => {
            arr.push(<Radio key={index.toString()} value={item.value}>{item.text}</Radio>);
          });
          if (value?.length > 0) {
            targetColumn.defaultFilteredValue = value;
            targetColumn.filtered = true;
          }
          const radioValue = value?.length > 0 ? value[0] : 1;
          targetColumn.filterDropdown = (params: any) => (
            // params = { setSelectedKeys, selectedKeys, confirm, clearFilters }
            <div style={{ padding: "10px" }}>
              <Radio.Group defaultValue={radioValue} onChange={(e) => {
                params?.setSelectedKeys(e.target.value ? [e.target.value] : []);
                params?.confirm();
              }}>
                <Space direction="vertical" >
                  {arr}
                </Space>
              </Radio.Group>
            </div>
          );
        } else if (type === 'Input') {
          targetColumn.filterDropdown = (params: any) => (
            <div style={{ padding: 8 }}>
              <Input.Search
                placeholder={`${targetColumn.title}`}
                // value={params?.selectedKeys[0]}
                // size="small"
                allowClear
                enterButton="查询"
                onSearch={(value: any) => {
                  params?.setSelectedKeys(value ? [value] : []);
                  params?.confirm();
                }}
                onPressEnter={(e: any) => {
                  params?.setSelectedKeys(e.target.value ? [e.target.value] : []);
                  params?.confirm();
                }}
              />
            </div>
          );
        } else if (type === 'ZdySelect') {
            if (list?.length > 0) {
              targetColumn.filters = list;
            } else if (codeTable) {
              const tmpList: any = myUtil.code.getZdyHeaderFilterOption(codeTable, showCode);
              targetColumn.filters = tmpList;
            }
            // 如果有赋值
            if (value?.length > 0) {
              targetColumn.defaultFilteredValue = value;
              targetColumn.filtered = true;
            }
            // 筛选项支持筛选
            targetColumn.filterSearch = true;
        }
      }
    }

    // 隐藏列
    columns = columns.filter((col: any) => {
      return (!(col.hidden && col.hidden !== false));
    })

    // 处理render filter
    const changeColumesRoF = (data: any) => {
      if (data.children && data.children.length > 0) {
        data.children.map((colChildren: any) => {
          changeColumesRoF(colChildren)
        })
      } else {
        initRender(data); // render
        initFilter(data); // filter
      }
    }

    // 处理码表
    const changeColumesTooltip = (data: any) => {
      if (data.children && data.children.length > 0) {
        data.children.map((colChildren: any) => {
          changeColumesTooltip(colChildren)
        })
      } else {
        const { codeTable } = data;
        if (codeTable) {
          data.ellipsis = { showTitle: false };
          data.render = (text: any, item: any) => {
            const textContent = codeTable[2] ? item[codeTable[2]] : text;
            return <Tooltip placement="topLeft" title={myUtil.code.getCodeValByKey(textContent, codeTable[0], codeTable[1])}>
              {myUtil.code.getCodeValByKey(textContent, codeTable[0], codeTable[1])}
            </Tooltip>;
          };
        }
      }
    }

    // 绑定render filter 码表渲染
    columns.map((item: any) => {
      changeColumesRoF(item);// 处理render filter
      changeColumesTooltip(item); // 处理码表
    });

    // 操作列
    const handleColumnRedner = (record: any) => {
      const btnEdit = <Button key='btn_edit' type='link' onClick={(event: any) => popupUpdate(record, event)}>编辑</Button>;
      const btnDel = <Button key='btn_del' type='link' onClick={(event: any) => handleDelete(record, event)}>删除</Button>;
      const handleEle: any = [];
      // 默认按钮: 编辑
      if (handleColumnsDefault?.edit) {
        handleEle.push(btnEdit);
      }
      // 默认按钮: 删除
      if (handleColumnsDefault?.delete) {
        if (handleEle.length > 0) {
          handleEle.push(<Divider key='handle_btn_divider1' type='vertical' />);
        }
        handleEle.push(btnDel);
      }
      // 自定义按钮
      if (handleColumns) {
        const tmpHandleColumns: any = [];
        handleColumns.forEach((item: any) => {
          let { display = false } = item;
          if (typeof display === 'string') {
            display = func[item.display](record);
          }
          if (!display) {
            tmpHandleColumns.push(item);
          }
        });
        if (tmpHandleColumns.length > 0 && handleEle.length > 0) {
          handleEle.push(<Divider key='handle_btn_divider2' type='vertical' />);
        }
        tmpHandleColumns.forEach((item: any, index: number) => {
          let hasDivider: any = true;
          if (index === tmpHandleColumns.length - 1) {
            hasDivider = false;
          }
          const param: any = {
            record,
            gridRef,
            unitRef: unitRef,
            changeDDB2PageData,
          };
          const funcName = 'getOtherRef';
          let otherRef: any;
          if (func[funcName]) {
            otherRef = func[funcName]();
            param.otherRef = otherRef;
          }
          // 自定义按钮是否可用
          let { disabled = false } = item;
          if (typeof disabled === 'string') {
            disabled = func[item.disabled](record);
          }
          handleEle.push(<Fragment key={index.toString()}>
            <Button type="link" className={item.key} disabled={disabled} onClick={(event: any) => { func[item.func](param, event) }}>{item.name}</Button>
            {hasDivider && <Divider type="vertical" />}
          </Fragment>);
        });
      }
      return <>{handleEle}</>;
    }

    // 获取操作列宽度
    const getHandleColumnWidth = () => {
      let widMyHandleColumn = 0;
      if (handleColumnsDefault?.edit) {
        widMyHandleColumn += 60;
      }
      if (handleColumnsDefault?.delete) {
        widMyHandleColumn += 60;
      }
      if (handleColumns) {
        handleColumns.forEach((item: any) => {
          const txtLen = item.name.length;
          widMyHandleColumn += 16 * txtLen + 15;
        });
      }
      return widMyHandleColumn;
    }

    // 操作列
    const myHandleColumn = (
      { title: '操作', width: grid_handle_width || getHandleColumnWidth(), fixed: 'right', align: 'center', render: handleColumnRedner }
    );
    const [last] = [...columns].reverse();
    if (last && last.title !== '操作') {
      if (handleColumnsDefault?.edit || handleColumnsDefault?.delete) {
        columns.push(myHandleColumn);
      } else if (handleColumns) {
        columns.push(myHandleColumn);
      }
    }

    return columns;
  },

  // 组装默认的筛选条件(普通筛选、标题行筛选)
  initAssembleSearchModel(param: any) {
    const { unitKey, filterItems, gridFilterQuick, initSearchModal, moduleType } = param;
    const assembleItem: any = [...gridFilterQuick, ...filterItems];
    const searchModel: any[] = [];
    assembleItem.forEach((item: any) => {
      const qypzgl: any = item?.qypzgl;
      if (qypzgl) {
        const userInfo = myUtil.sessionStore.getItem('userInfo');
        const qypzglCs: any = userInfo?.qypz;
        const qypzglVal = qypzglCs[qypzgl];
        if (item.type === itemType.DatePicker) {
          const timeQ = moment(myUtil.date.getDateNumByMouth(qypzglVal));
          const timeZ = moment(new Date());
          item.defaultValue = [timeQ, timeZ];
        }
      }
      let op;
      let value: any = item.defaultValue;
      let dataDdType: any = item.type;
      const searchFlag: any = item.searchFlag;
      let pushSearchModelFalg: any = true;
      if (value && searchFlag !== false) {
        if (item.type === itemType.Input) {
          op = 'al'; // alike
        } else if (item.type === itemType.Select || dataDdType === itemType.AutoComplete) {
          op = 'al';
          if (item.op) {
            op = item.op;
          }

        } else if (item.type === itemType.DatePicker) {
          value = value.valueOf();
          op = 'al';
          if (item.defaultValue instanceof Array) {
            // 数据报表模块：查询参数特殊处理
            if (moduleType === 'sjbb') {
              const tmp: any = UnitUtil.grid.getSjbbDateSearchModel({ item });
              searchModel.push(...tmp);
              pushSearchModelFalg = false;
            } else if (moduleType === 'QZ_type') {
              const tmp: any = UnitUtil.grid.getTssbDateSearchModel({ item });
              searchModel.push(...tmp);
              pushSearchModelFalg = false;
            } else {
              searchModel.push({
                type: dataDdType,
                property: item.name,
                value: (item.defaultValue[0]).valueOf(),
                op: 'dydy',
              });
              op = 'xydy';
              value = (item.defaultValue[1]).valueOf();
              // value = myUtil.date.accurateDate(item.defaultValue[1].format('YYYY/MM/DD'), '2');
            }
          }
        } else if (item.type === itemType.InputTags) {
          op = 'ain';
          pushSearchModelFalg = false;
          searchModel.push({
            type: dataDdType,
            property: item.name,
            values: item.defaultValue,
            op: item.op ? item.op : 'ain',
          });
        }
        if (pushSearchModelFalg) {
          searchModel.push({
            type: dataDdType,
            property: item.name,
            value,
            op,
          });
        }
      }
    });
    // 数据报表模块：查询参数特殊处理
    // 新修改页面：查询参数特殊处理
    if (moduleType === 'sjbb' || moduleType === 'QZ_type') {
      searchModel.forEach((item: any) => {
        item.op = 'zdy';
      });
    }
    return {
      key: unitKey,
      searchModel: [
        ...searchModel
      ],
      orderModel: [],
      initSearchModal,
    }
  },

  // 数据报表查询参数特殊处理
  getSjbbDateSearchModel(param: any) {
    // 例如申报年月（sbny）
    // 本期       sbnyq、sbnyz
    // 前期       sbnyqqq、sbnyqqz
    // 上年同期   sbnysntqq、sbnysntqz
    const { item } = param;
    let property: any = item.name;

    let time: any = '';
    let time1: any = '';
    let timeqq: any = '';
    let timeqq1: any = '';
    let timesntq: any = '';
    let timesntq1: any = '';
    const tmp = [];
    if (item.format === 'yyyy-MM' || item.format === 'YYYY-MM' || item.format === 'yyyyMM' || item.format === 'YYYYMM') { // 年月 特殊处理
      // 本期
      if (item.format.indexOf('-') > -1) {
        time = myUtil.date.getDateNYBeforeCurr(0, item.defaultValue[0]);
        time1 = myUtil.date.getDateNYBeforeCurr(0, item.defaultValue[1]);
      } else {
        time = myUtil.date.getDateNYBeforeCurrFormat(0, item.defaultValue[0]);
        time1 = myUtil.date.getDateNYBeforeCurrFormat(0, item.defaultValue[1]);
      }
      let propertyQ: any = property;
      let propertyZ: any = property + '1';
      let valueQ: any = (time).valueOf();
      let valueZ: any = (time1).valueOf();
      tmp.push({ property: propertyQ, value: valueQ, op: 'zdy' });
      tmp.push({ property: propertyZ, value: valueZ, op: 'zdy' });
      // 前期
      if (item.format.indexOf('-') > -1) {
        timeqq = myUtil.date.getDateNYBeforeCurr(0, new Date(item.defaultValue[0]).getTime() - 2592000000);
        timeqq1 = myUtil.date.getDateNYBeforeCurr(0, new Date(item.defaultValue[1]).getTime() - 2592000000);
      } else {
        timeqq = myUtil.date.getDateNYBeforeCurrFormat(0, new Date(item.defaultValue[0]).getTime() - 2592000000);
        timeqq1 = myUtil.date.getDateNYBeforeCurrFormat(0, new Date(item.defaultValue[1]).getTime() - 2592000000);
      }
      let propertyQqq: any = property + 'qq';
      let propertyQqz: any = property + 'qq1';
      let valueQqq: any = (timeqq).valueOf();
      let valueQqz: any = (timeqq1).valueOf();
      tmp.push({ property: propertyQqq, value: valueQqq, op: 'zdy' });
      tmp.push({ property: propertyQqz, value: valueQqz, op: 'zdy' });
      // 上年同期
      if (item.format.indexOf('-') > -1) {
        timesntq = myUtil.date.getDateNYBeforeCurr(1, item.defaultValue[0]);
        timesntq1 = myUtil.date.getDateNYBeforeCurr(1, item.defaultValue[1]);
      } else {
        timesntq = myUtil.date.getDateNYBeforeCurrFormat(1, item.defaultValue[0]);
        timesntq1 = myUtil.date.getDateNYBeforeCurrFormat(1, item.defaultValue[1]);
      }
      let propertySntqq: any = property + 'sntq';
      let propertySntqz: any = property + 'sntq1';
      let valueSntqq: any = (timesntq).valueOf();
      let valueSntqz: any = (timesntq1).valueOf();
      tmp.push({ property: propertySntqq, value: valueSntqq, op: 'zdy' });
      tmp.push({ property: propertySntqz, value: valueSntqz, op: 'zdy' });
    } else { // 年月日 正常处理
      if (item.defaultValue[1]) {
        time = myUtil.date.getDateNYRBeforeCurr(0, item.defaultValue[0]);
        time1 = myUtil.date.getDateNYRBeforeCurr(0, item.defaultValue[1]);
        let propertyQ: any = property;
        let propertyZ: any = property + '1';
        let valueQ: any = (time).valueOf();
        let valueZ: any = (time1).valueOf();
        tmp.push({ property: propertyQ, value: valueQ, op: 'zdy' });
        tmp.push({ property: propertyZ, value: valueZ, op: 'zdy' });
      } else {
        time = myUtil.date.getDateNYRBeforeCurr(0, item.defaultValue);
        let propertyQ: any = property;
        let valueQ: any = (time).valueOf();
        tmp.push({ property: propertyQ, value: valueQ, op: 'zdy' });
      }
    }
    return tmp;
  },

  getTssbDateSearchModel(param: any) {
    const { item } = param;
    let property: any = item.name;

    let time: any = '';
    let time1: any = '';
    const tmp = [];
    if (item.format === 'yyyy-MM' || item.format === 'YYYY-MM' || item.format === 'yyyyMM' || item.format === 'YYYYMM') { // 年月 特殊处理
      // 本期
      if (item.format.indexOf('-') > -1) {
        time = myUtil.date.getDateNYBeforeCurr(0, item.defaultValue[0]);
        time1 = myUtil.date.getDateNYBeforeCurr(0, item.defaultValue[1]);
      } else {
        time = myUtil.date.getDateNYBeforeCurrFormat(0, item.defaultValue[0]);
        time1 = myUtil.date.getDateNYBeforeCurrFormat(0, item.defaultValue[1]);
      }
      let propertyQ: any = property + 'Q';
      let propertyZ: any = property + 'Z';
      let valueQ: any = (time).valueOf();
      let valueZ: any = (time1).valueOf();
      tmp.push({ property: propertyQ, value: valueQ, op: 'zdy' });
      tmp.push({ property: propertyZ, value: valueZ, op: 'zdy' });
    } else { // 年月日 正常处理
      if (item.defaultValue[1]) {
        time = myUtil.date.getDateNYRBeforeCurr(0, item.defaultValue[0]);
        time1 = myUtil.date.getDateNYRBeforeCurr(0, item.defaultValue[1]);
        let propertyQ: any = property + 'Q';
        let propertyZ: any = property + 'Z';
        let valueQ: any = (time).valueOf();
        let valueZ: any = (time1).valueOf();
        tmp.push({ property: propertyQ, value: valueQ, op: 'zdy' });
        tmp.push({ property: propertyZ, value: valueZ, op: 'zdy' });
      } else {
        time = myUtil.date.getDateNYRBeforeCurr(0, item.defaultValue);
        let propertyQ: any = property;
        let valueQ: any = (time).valueOf();
        tmp.push({ property: propertyQ, value: valueQ, op: 'zdy' });
      }
    }
    return tmp;
  },

  // 组装普通筛选、标题行筛选 searchModel
  assembleSearchModel(form: any, items?: any, moduleType?: any) {
    const values = form.getFieldsValue(true);
    const searchModel: any[] = [];
    if (!items || items.length === 0) {
      return searchModel;
    }
    items.forEach((item: any) => {
      let tmpKey: any = item.name;
      if (tmpKey && (values[tmpKey] || values[tmpKey + '_searchModelQ'] || values[tmpKey + '_searchModelZ'])) {
        let dataDdType: any = item.type;
        let dataDdSearchModelBz: any = item.searchModelBz === false ? false : true;
        if (dataDdSearchModelBz === undefined || dataDdSearchModelBz === null) {
          dataDdSearchModelBz = true;
        }
        let pushSearchModelFalg: any = true;
        // if (tmpKey === 'sjbs') {
        //   dataDdSearchModelBz = false;
        //   dataDdType = 4
        // } else {
        //   if (itemIns?.tagName?.toLocaleLowerCase() === 'div') {
        //     dataDdType = Number(itemIns.getAttribute('data-dd-type'));
        //     dataDdSearchModelBz = itemIns.getAttribute('data-dd-searchmodelbz');
        //   } else {
        //     if (itemIns.props) {
        //       dataDdType = itemIns.props['data-dd-type'];
        //       dataDdSearchModelBz = itemIns.props['data-dd-searchmodelbz'];
        //     } else {
        //       dataDdType = 4;
        //       dataDdSearchModelBz = true;
        //     }
        //   }
        //   // console.info(dataDdType);
        //   if (dataDdSearchModelBz === undefined || dataDdSearchModelBz === null) {
        //     dataDdSearchModelBz = true;
        //   }
        // }
        if (dataDdSearchModelBz) {
          let op;
          let value: any = values[tmpKey];
          if (dataDdType === itemType.Input) {
            if (item.range) {
              searchModel.push({
                type: dataDdType,
                property: tmpKey,
                value: values[tmpKey + '_searchModelQ'] || '',
                op: 'dydy',
              });
              op = 'xydy';
              value = values[tmpKey + '_searchModelZ'] || '';
            } else {
              op = 'al';
              if (item.op) {
                op = item.op;
              }
            }
            // if (tmpKey.indexOf('_searchModelQ') > -1) {
            //   op = 'dydy';
            //   tmpKey = tmpKey.split('_searchModelQ')[0];
            // } else if (tmpKey.indexOf('_searchModelZ') > -1) {
            //   op = 'xydy';
            //   tmpKey = tmpKey.split('_searchModelZ')[0];
            // } else {
            //   op = 'al'; // alike
            // }
          } else if (dataDdType === itemType.InputNumber) {
            if (item.range) {
              searchModel.push({
                type: dataDdType,
                property: tmpKey,
                value: values[tmpKey + '_searchModelQ'] || '',
                op: 'dydy',
              });
              op = 'xydy';
              value = values[tmpKey + '_searchModelZ'] || '';
            } else {
              op = 'al';
              if (item.op) {
                op = item.op;
              }
            }
          } else if (dataDdType === itemType.Select || dataDdType === itemType.AutoComplete) {
            op = 'al';
            if (item.op) {
              op = item.op;
            }
          } else if (dataDdType === itemType.Checkbox) {
            op = 'ain';
          } else if (dataDdType === itemType.DatePicker) {
            value = value.valueOf();
            // 需要根据后端需求调整
            op = 'al';
            if (item.op) {
              op = item.op;
            }
            // 特殊页面 日期结尾带1
            const tsDatePicker1 = ['/hts/ckfp/fpkjgl', '/hts/ckfp/hzfp', '/hts/ckfp/zffp'];
            const pathname = history?.location?.pathname;
            // 数据报表模块：查询参数特殊处理
            if (moduleType === 'sjbb' || tsDatePicker1?.indexOf(pathname) > -1) {
              let itemTmp = {}
              if (values[tmpKey][1]) {
                itemTmp = { ...item, ...{ defaultValue: [(new Date(values[tmpKey][0].format('YYYY/MM/DD'))).getTime(), (new Date(values[tmpKey][1].format('YYYY/MM/DD'))).getTime()] } }
              } else {
                itemTmp = { ...item, ...{ defaultValue: (new Date(values[tmpKey].format('YYYY/MM/DD'))).getTime() } }
              }

              const tmp: any = UnitUtil.grid.getSjbbDateSearchModel({ item: itemTmp });
              searchModel.push(...tmp);
              pushSearchModelFalg = false;
            } else if (moduleType === 'QZ_type') {
              let itemTmp = {}
              if (values[tmpKey][1]) {
                itemTmp = { ...item, ...{ defaultValue: [(new Date(values[tmpKey][0].format('YYYY/MM/DD'))).getTime(), (new Date(values[tmpKey][1].format('YYYY/MM/DD'))).getTime()] } }
              } else {
                itemTmp = { ...item, ...{ defaultValue: (new Date(values[tmpKey].format('YYYY/MM/DD'))).getTime() } }
              }
              const tmp: any = UnitUtil.grid.getTssbDateSearchModel({ item: itemTmp });
              searchModel.push(...tmp);
              pushSearchModelFalg = false;
            } else {
              if (values[tmpKey] instanceof Array) {
                searchModel.push({
                  type: dataDdType,
                  property: tmpKey,
                  value: (new Date(values[tmpKey][0].format('YYYY/MM/DD'))).getTime(),
                  op: 'dydy',
                });
                op = 'xydy';
                // value = (new Date(values[tmpKey][1].format('YYYY/MM/DD'))).getTime();
                value = myUtil.date.accurateDate(values[tmpKey][1].format('YYYY/MM/DD'), '2');
              } else {
                value = (new Date(moment(value).format("YYYY/MM/DD"))).getTime();
              }
            }
          } else if (dataDdType === itemType.TreeSelect) {
            op = 'al';
            if (item.labelInValue) {
              value = value.label;
            }
          } else if (dataDdType === itemType.InputTags) {
            op = 'ain';
            if (item.labelInValue) {
              value = value.label;
            }
          }
          if (pushSearchModelFalg) {
            if (!(op === 'ain' && value?.length === 0)) { // 去除空checkbox
              if (dataDdType === itemType.InputTags) { // 后端接收字段为values
                searchModel.push({
                  type: dataDdType,
                  property: tmpKey,
                  values: value,
                  op
                });
              } else if (dataDdType === itemType.Select && item?.mode === 'multiple') {
                searchModel.push({
                  type: dataDdType,
                  property: tmpKey,
                  values: value,
                  op
                });
              } else {
                searchModel.push({
                  type: dataDdType,
                  property: tmpKey,
                  value,
                  op
                });
              }
            }
          }
        }
      }
    });
    // 数据报表模块：查询参数特殊处理
    if (moduleType === 'sjbb' || moduleType === 'QZ_type') {
      searchModel.forEach((item: any) => {
        item.op = 'zdy';
      });
    }

    if (moduleType === 'znfx') {
      searchModel.forEach((item: any) => {
        if (item.op === 'xydy') {
          item.property = item.property + '1';
        }
        item.op = 'zdy';
      });
    }
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
          if (item.dataIndex == key && item.filter && item.filter?.type === 'Input') {
            searchModel.push({
              // type: dataDdType,
              property: key,
              values: colFilterValue[key],
              op: 'al',
            });
          } else if (item.dataIndex == key && item.filter?.type !== 'Input') {
            searchModel.push({
              // type: dataDdType,
              property: key,
              values: colFilterValue[key],
              op: 'ain',
            });
          } else if (item.dataIndex == key) {
            searchModel.push({
              // type: dataDdType,
              property: key,
              values: colFilterValue[key],
              op: 'ain',
            });
          }
        })
      }
    });
    // 如果是数据报表则把所有op改成zdy
    const isSjbb = document.querySelector(".model_type_sjbb");
    const isQZ = document.querySelector(".model_type_QZ_type");
    if (isSjbb || isQZ) {
      searchModel.map((item: any) => {
        item.op = 'zdy';
      })
    }
    return searchModel;
  },

  // 判断列表里面是否有合计
  isSum(columns: any[]) {
    let flagSum = false;
    columns.map((data: any) => {
      if (data.children && data.children.length > 0) {
        UnitUtil.grid.isSum(data.children)
      } else if (data.sum) {
        flagSum = true;
      }
    });
    return flagSum;
  },
};

// 表单工具类
UnitUtil.form = {
  // init
  // init(items: any = []) {
  init(param: any) {
    const { items, func } = param;
    if (!items) {
      return;
    }
    items.map((item: any) => {
      const { type, rules: configRules, eventOnChange, eventOnBlur, eventOnFocus, children } = item;
      if (typeof (type) === 'string') {
        item.type = itemType[type];
      }
      if (item.format && typeof (item.format) !== 'function') {
        const { format } = item.format;
        if (item.format.type === 'number') {
          item.format = (text: any) => {
            if (text.constructor === String) {
              return myUtil.text.formatNum(Number(text), format);
            } else {
              return myUtil.text.formatNum(text, format);
            }
          }
        }
      }

      // 表单项校验
      const rules: any = [];
      if (configRules && configRules.length > 0) {
        configRules.forEach((itemRule: any) => {
          if (itemRule.type === 'base_required') {
            // 必录项目校验
            rules.push(baseValidator.required());
          } else if (itemRule.type === 'base_string') {
            // 字符串基础校验
            if (itemRule.length) {
              rules.push(baseValidator.len2(itemRule.length));
            } else if (itemRule.range && typeof itemRule.range === 'number') {
              rules.push(baseValidator.range2({ min: 0, max: itemRule.range, item: item }));
            } else if (itemRule.range && Array.isArray(itemRule.range)) {
              rules.push(baseValidator.range2({ min: itemRule.range[0], max: itemRule.range[1], item: item }));
            }
          } else if (itemRule.type === 'base_date') {
            // 日期校验
            if (itemRule.format === 'yyyyMMdd' || itemRule.format === 'yyyy-MM-dd') {
              rules.push(baseValidator.yyyyMMdd());
            } else if (itemRule.format === 'yyyyMM') {
              rules.push(baseValidator.yyyyMM());
            } else if (itemRule.format === 'yyyy') {
              rules.push(baseValidator.yyyy());
            } else if (itemRule.format === 'MM') {
              rules.push(baseValidator.MM());
            }
          } else if (itemRule.type === 'base_number') {
            // 数值校验
            if (itemRule.length && itemRule.decimal) {
              let maxVal = '';
              let decimalVal = '';
              for (let i = 0; i < itemRule.length - itemRule.decimal; i++) {
                maxVal += '9';
              }
              for (let i = 0; i < itemRule.decimal; i++) {
                decimalVal += '9';
              }
              const max = Number(maxVal + '.' + decimalVal);
              const min = Number('-' + max);
              rules.push(...baseValidator.range({ max, min, type: 'number', item: item }));
            } else if (itemRule.length) {
              let maxVal = '';
              for (let i = 0; i < itemRule.length; i++) {
                maxVal += '9';
              }
              const max = Number(maxVal);
              rules.push(...baseValidator.range({ max, min: -max, type: 'number', item: item }));
            } else if (itemRule.range === '+') {
              rules.push(baseValidator.numRange(['+']));
            } else if (itemRule.range === '-') {
              rules.push(baseValidator.numRange(['-']));
            } else if (itemRule.range === '0') {
              rules.push(baseValidator.numRange(['0']));
            } else if (itemRule.range === '+-') {
              rules.push(baseValidator.numRange(['+', '-']));
            } else if (itemRule.range === '+0') {
              rules.push(baseValidator.numRange(['+', '0']));
            } else if (itemRule.range === '-0') {
              rules.push(baseValidator.numRange(['-', '0']));
            }
          } else if (itemRule.type === 'base_type_number') {
            // 类型校验：数字
            rules.push(baseValidator.number());
          } else if (itemRule.type === 'base_type_mail') {
            // 类型校验：数字及字母
            rules.push({ type: 'email' });
          } else if (itemRule.type === 'base_type_number_english') {
            // 类型校验：邮件
            rules.push(baseValidator.english_number());
          } else if (itemRule.type === 'base_type_phone') {
            // 类型校验：电话
            rules.push(baseValidator.phone());
          } else if (itemRule.type === 'base_type_idcard') {
            // 类型校验：身份证
            rules.push(baseValidator.idcard());
          } else if (itemRule.type === 'base_type_chinese') {
            // 类型校验：汉字
            rules.push(baseValidator.chinese());
          } else if (itemRule.type === 'base_type_ESC') {
            // 类型校验：禁止输入转义字符
            rules.push(baseValidator.ESC());
          } else if (itemRule.func && func.validator && func.validator[itemRule.func]) {
            // 自定义校验
            rules.push(func.validator[itemRule.func]);
          }
        });
        if (item.type === 1 || item.type === 15 || item.type === 'TextArea' || item.type === 'Input') {
          // 类型校验：禁止输入&字符,目前所有配置生成的输入框都要加这个校验
          // rules.push(baseValidator.ESC());
        }
        item.validator = rules;
      }
      // 表单项事件
      if (eventOnChange) {
        item.onChange = func.eventOnChange[eventOnChange];
      }
      if (eventOnBlur) {
        item.onBlur = func.eventOnBlur[eventOnBlur];
      }
      if (eventOnFocus) {
        item.onFocus = func.eventOnFocus[eventOnFocus];
      }
      if (children && children.length > 0) {
        UnitUtil.form.init({
          items: children,
          func: func,
        })
      }
    });
    return items;
  },
  getValidatorData(configRules: any = [], item: any = []) {
    // 表单项校验
    const rules: any = [];
    if (configRules && configRules.length > 0) {
      configRules.forEach((itemRule: any) => {
        if (itemRule.type === 'base_required') {
          // 必录项目校验
          rules.push(baseValidator.required());
        } else if (itemRule.type === 'base_string') {
          // 字符串基础校验
          if (itemRule.length) {
            rules.push(baseValidator.len2(itemRule.length));
          } else if (itemRule.range && typeof itemRule.range === 'number') {
            rules.push(baseValidator.range2({ min: 0, max: itemRule.range, item: item }));
          } else if (itemRule.range && Array.isArray(itemRule.range)) {
            rules.push(baseValidator.range2({ min: itemRule.range[0], max: itemRule.range[1], item: item }));
          }
        } else if (itemRule.type === 'base_date') {
          // 日期校验
          if (itemRule.format === 'yyyyMMdd' || itemRule.format === 'yyyy-MM-dd') {
            rules.push(baseValidator.yyyyMMdd());
          } else if (itemRule.format === 'yyyyMM') {
            rules.push(baseValidator.yyyyMM());
          } else if (itemRule.format === 'yyyy') {
            rules.push(baseValidator.yyyy());
          } else if (itemRule.format === 'MM') {
            rules.push(baseValidator.MM());
          }
        } else if (itemRule.type === 'base_number') {
          // 数值校验
          if (itemRule.length && itemRule.decimal) {
            let maxVal = '';
            let decimalVal = '';
            for (let i = 0; i < itemRule.length - itemRule.decimal; i++) {
              maxVal += '9';
            }
            for (let i = 0; i < itemRule.decimal; i++) {
              decimalVal += '9';
            }
            const max = Number(maxVal + '.' + decimalVal);
            const min = Number('-' + max);
            rules.push(...baseValidator.range({ max, min, type: 'number', item: item }));
          } else if (itemRule.length) {
            let maxVal = '';
            for (let i = 0; i < itemRule.length; i++) {
              maxVal += '9';
            }
            const max = Number(maxVal);
            rules.push(...baseValidator.range({ max, min: -max, type: 'number', item: item }));
          } else if (itemRule.range === '+') {
            rules.push(baseValidator.numRange(['+']));
          } else if (itemRule.range === '-') {
            rules.push(baseValidator.numRange(['-']));
          } else if (itemRule.range === '0') {
            rules.push(baseValidator.numRange(['0']));
          } else if (itemRule.range === '+-') {
            rules.push(baseValidator.numRange(['+', '-']));
          } else if (itemRule.range === '+0') {
            rules.push(baseValidator.numRange(['+', '0']));
          } else if (itemRule.range === '-0') {
            rules.push(baseValidator.numRange(['-', '0']));
          }
        } else if (itemRule.type === 'base_type_number') {
          // 类型校验：数字
          rules.push(baseValidator.number());
        } else if (itemRule.type === 'base_type_mail') {
          // 类型校验：数字及字母
          rules.push({ type: 'email' });
        } else if (itemRule.type === 'base_type_number_english') {
          // 类型校验：邮件
          rules.push(baseValidator.english_number());
        } else if (itemRule.type === 'base_type_phone') {
          // 类型校验：电话
          rules.push(baseValidator.phone());
        } else if (itemRule.type === 'base_type_idcard') {
          // 类型校验：身份证
          rules.push(baseValidator.idcard());
        } else if (itemRule.type === 'base_type_chinese') {
          // 类型校验：汉字
          rules.push(baseValidator.chinese());
        } else if (itemRule.type === 'base_type_ESC') {
          // 类型校验：禁止输入转义字符
          rules.push(baseValidator.ESC());
        }
      });
      return rules;
    } else {
      return [];
    }
  }
};


// 筛选工具类：普通筛选、标题行筛选
UnitUtil.filter = {
  // init
  init(items: any = []) {
    items.map((item: any) => {
      const { type } = item;
      if (typeof (type) === 'string') {
        item.type = itemType[type];
      }
    });
    return items;
  },
};

// 高级筛选工具类
UnitUtil.filterAdvanced = {
  // init
  init(items: any = {}) {
    const { range = [] } = items;
    range.map((item: any) => {
      const { type, quickOption } = item;
      if (typeof (type) === 'string') {
        item.type = itemType[type];
      }
      if (quickOption && quickOption.type && typeof (quickOption.type) === 'string') {
        quickOption.type = itemType[quickOption.type];
      }
    });
    return items;
  },
};

UnitUtil.code = {
  // 获取表单参数
  getCodeTableParam(param: any) {
    const { column = [], filterItems = [], formItems = [], grid_filter_quick = [] } = param;
    const codeParam: any[] = [];
    // 列表中需要的码表、查询条件中需要的码表、查询条件中需要的码表
    const tmp = [...column, ...filterItems, ...formItems, ...grid_filter_quick];
    const tmpObj: any = {}
    myUtil.code.getCodeTableParam(tmp, tmpObj);
    for (let key in tmpObj) {
      codeParam.push(tmpObj[key]);
    }
    // tmp.forEach((item: any) => {
    //   if (item.children && item.children.length > 0) {
    //     item.children.forEach((itemChildren: any) => {
    //       const { codeTable, filter } = itemChildren;
    //       // 列表列、普通筛选、表单
    //       if (codeTable) {
    //         codeParam.push({
    //           key: codeTable[0],
    //           codeViewKey: codeTable[1],
    //         });
    //       }
    //       // 列头筛选
    //       if (filter?.codeTable) {
    //         codeParam.push({
    //           key: filter?.codeTable[0],
    //           codeViewKey: filter?.codeTable[1],
    //         });
    //       }
    //     });
    //   } else {
    //     const { codeTable, filter } = item;
    //     if (codeTable) {
    //       codeParam.push({
    //         key: codeTable[0],
    //         codeViewKey: codeTable[1],
    //       });
    //     }
    //     // 列头筛选
    //     if (filter?.codeTable) {
    //       codeParam.push({
    //         key: filter?.codeTable[0],
    //         codeViewKey: filter?.codeTable[1],
    //       });
    //     }
    //   }
    // });
    return codeParam;
  },
  // 获取表单promise
  getCodeTablePromise(apiParam: any, unit_key: any) {
    const promise = [];
    for (let i = 0; i < apiParam.length; i += 1) {
      const { key, codeViewKey } = apiParam[i];
      const tmpCodeTable = myUtil.code.getCodeFromServerT1(key, codeViewKey, unit_key);
      promise.push(tmpCodeTable);
    }
    return promise;
  },
  // 配置表单项目
  initFormItemsCodeTable(formItems: any) {
    const items = formItems?.concat() || [];
    // 码表渲染
    items.map((item: any) => {
      const { codeTable, showCode, treeTable, showType, isSelectLeaf = false } = item;
      if (codeTable) {
        item.list = myUtil.code.getSelectOption(codeTable[0], codeTable[1], showType)
        if (showCode) {
          item.list.forEach((item1: any) => {
            item1.name = `[${item1.value}]   ${item1.name}`
          })
        }
      }
      if (treeTable) {
        item.list = myUtil.treeCode.getTreeCodeData(treeTable[0], treeTable[1])
        if (isSelectLeaf) {
          myUtil.array.traverseTreeLeaf(item.list);
        }
      }
    });
    return items;
  },
}

UnitUtil.treeCode = {
  // 获取表单参数
  getTreeCodeTableParam(param: any) {
    const { filterItems = [], formItems = [] } = param;
    const treeCodeParam: any[] = [];
    // 列表中需要的码表、查询条件中需要的码表、查询条件中需要的码表
    const tmp = [...filterItems, ...formItems];
    tmp.forEach((item: any) => {
      const { treeTable } = item;
      if (treeTable) {
        treeCodeParam.push({
          key: treeTable[0],
          codeViewKey: treeTable[1],
        });
      }
    });
    return treeCodeParam;
  },
  // 获取表单promise
  getTreeCodeTablePromise(apiParam: any) {
    const promise = [];
    for (let i = 0; i < apiParam.length; i += 1) {
      const { key, codeViewKey } = apiParam[i];
      const tmpCodeTable = myUtil.treeCode.getTreeCodeFormServer(key, codeViewKey);
      promise.push(tmpCodeTable);
    }
    return promise;
  },
}

// 获取流转税务事项代码
UnitUtil.getLcswsxDm = (unit_constant: any) => {
  let arr = unit_constant?.split(',') || [];
  for (let i = 0; i < arr.length; i++) {
    let tmp = arr[i].split('=');
    if (tmp[0] === 'lcswsxDm') {
      return tmp[1] || '';
    }
  }
  return '';
}

export default UnitUtil;
