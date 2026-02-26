import React, { useState } from 'react';
import { Button, Form, Spin } from 'antd';
import { Document, Paragraph, TextRun, HeadingLevel, TableOfContents, Header, Footer, AlignmentType, PageNumber, ShadingType, LineRuleType } from 'docx';
import myUtil from '@/components/DDAssist/util';
import { retrieveModulePager, retrieveDictPager, queryList, retrieveTablePager } from '@/services/hts/api';
import DDIT_TOOL_CONSTANTS from '@/components/DDBunit/excelConfig.v2.constants';
import { cloneDeep, orderBy } from 'lodash';
import DDBaseForm from '@/components/DDForm/DDBaseForm';
import { FooterToolbar } from '@ant-design/pro-components';
import { ProCard } from '@ant-design/pro-components';
import CONSTANTS from '@/components/DDAssist/constants';
import DDBunit2ADBUtil from '@/components/DDBunit/DDBunit2ADBUtil';

const CreateWord: React.FC<unknown> = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();

    let shading: any = { fill: "F2F2F2", type: ShadingType.CLEAR };
    let spacing: any = { before: 120, after: 120 };
    let indent: any = 180;
    let cols1: any = [
      { title: '参数名称', dataIndex: 'aa' },
      { title: '类型', dataIndex: 'bb' },
      { title: '中文描述', dataIndex: 'cc' },
      { title: '是否必填', dataIndex: 'dd' },
      { title: '补充描述', dataIndex: 'ee' },
    ];
    let cols2: any = [
      { title: '参数名称', dataIndex: 'aa' },
      { title: '类型', dataIndex: 'bb' },
      { title: '中文描述', dataIndex: 'cc' },
      { title: '补充描述', dataIndex: 'dd' },
    ];

  // 测试1
  const generateWordDocument1 = () => {
    // 创建文档对象
    const doc = new Document({
      sections: [{
        children: [
          // 目录（自动生成）
          new TableOfContents("Table of Contents", {
            headingStyleRange: "1-3", // 包含1-3级标题
            hyperlink: true,          // 启用目录跳转
          }),
          // 一级标题
          new Paragraph({
            text: "第一章 引言",
            heading: HeadingLevel.HEADING_1,
            outlineLevel: 1 // 设置大纲级别
          }),
          // 段落
          new Paragraph({
            children: [new TextRun("这是文档的引言部分，主要介绍研究背景和意义。")]
          }),
          // 二级标题
          new Paragraph({
            text: "1.1 研究背景",
            heading: HeadingLevel.HEADING_2,
            outlineLevel: 2
          }),
          // 段落
          new Paragraph({
            children: [new TextRun("详细说明研究领域的现状和发展趋势...")]
          }),
          // 三级标题
          new Paragraph({
            text: "1.1.1 技术背景",
            heading: HeadingLevel.HEADING_3,
            outlineLevel: 3
          }),
          // 段落
          new Paragraph({
            children: [
              new TextRun("具体描述相关技术背景和理论基础。"),
              new TextRun("Hello World!"),
              new TextRun({
                text: "This is a generated Word document",
                bold: true,
              }),
            ]
          })
        ]
      }]
    });
    myUtil.word.saveDocx({doc, name: 'MyDocument.docx'});
  };

  // 生成文档对象children：模块及字典部分
  const wordChildrenModule = ({ children = [], moduleInfo, appTableDict, docxConfig, docHelp }: any) => {
    const moduleCommon = DDIT_TOOL_CONSTANTS.SHEET_CONFIG_MODULE;
    const moduleCommonToolbar: any = [];
    const moduleCommonGridCol: any = [];
    const moduleCommonToolbarCus: any = [];
    const moduleCommonGridColCus: any = [];
    moduleCommon.forEach((tmp: any) => {
      if (tmp?.dataIndex?.indexOf('toolbar_default_') > -1) {
        if (moduleInfo[myUtil.text.underscoreToCamel(tmp.dataIndex)] === '1') {
          moduleCommonToolbar.push(tmp?.title?.replace('工具栏', ''));
        }
      } else if (tmp?.dataIndex?.indexOf('grid_col_') > -1) {
        if (moduleInfo[myUtil.text.underscoreToCamel(tmp.dataIndex)] === '1') {
          moduleCommonGridCol.push(tmp?.title?.replace('列表列', ''));
        }
      }
    })
    // 工具栏按钮 自定义
    if (moduleInfo.customerBtnGridCol) {
      let aaa = moduleInfo.customerBtnGridCol.split(',');
      aaa.forEach((bbb: any) => {
        let ccc = bbb.split('&');
        moduleCommonToolbarCus.push(ccc[0]);
      })
    }
    // 列表操作列 自定义
    if (moduleInfo.customerBtnToolbar) {
      let aaa = moduleInfo.customerBtnToolbar.split(',');
      aaa.forEach((bbb: any) => {
        let ccc = bbb.split('&');
        moduleCommonGridColCus.push(ccc[0]);
      })
    }
    // 帮助文档中内容
    if (docHelp) {
      children.push(myUtil.word.createParagraph({textParam: {text: docHelp}, indent: 1440 }));
    }
    // 工具栏按钮
    if (moduleCommonToolbar.length + moduleCommonToolbarCus.length > 0) {
      children.push(myUtil.word.createParagraph({textParam: {text: '工具栏按钮', bold: true, size: 22}, bullet: true}));
    }
    if (moduleCommonToolbar.length > 0) {
      children.push(myUtil.word.createParagraph({textParam:{text: `${moduleCommonToolbar.join('、')}`}}));
    }
    if (moduleCommonToolbarCus.length > 0) {
      children.push(myUtil.word.createParagraph({textParam:{text: `${moduleCommonToolbarCus.join('、')}`, color: "8c121f"}}));
    }
    // 列表操作列
    if (moduleCommonGridCol.length + moduleCommonGridColCus.length > 0) {
      children.push(myUtil.word.createParagraph({textParam: {text: '列表操作列', bold: true, size: 22}, bullet: true}));
    }
    if (moduleCommonGridCol.length > 0) {
      children.push(myUtil.word.createParagraph({textParam:{text: `${moduleCommonGridCol.join('、')}`}}));
    }
    if (moduleCommonGridColCus.length > 0) {
      children.push(myUtil.word.createParagraph({textParam:{text: `${moduleCommonGridColCus.join('、')}`, color: "8c121f"}}));
    }
    const formatIsUsed = (val: any) => val === '1' ? '√' : '';
    // 数据字典 列表
    let appTableDictGrid = appTableDict.filter((item: any) => { return item.gridUsed });
    if (appTableDictGrid?.length > 0) {
      appTableDictGrid = orderBy(appTableDictGrid, ['gridIndex'], ['asc']);
      children.push(myUtil.word.createParagraph({textParam: {text: '数据字典 - 列表', bold: true, size: 22}, bullet: true}));
      children.push(myUtil.word.createTable({
        cols: [
          { title: '字段中文名', dataIndex: 'dictFieldName' },
          { title: '字段英文名', dataIndex: 'dictFieldDesc' },
          { title: '主键标识', dataIndex: 'gridKey', format: formatIsUsed },
          { title: '对齐方式', dataIndex: 'gridAlign' },
          { title: '固定列', dataIndex: 'gridFixed' },
          { title: '格式化', dataIndex: 'gridRender' },
          { title: '统计', dataIndex: 'gridStat' },
          { title: '排序', dataIndex: 'gridSort', format: formatIsUsed },
          { title: '隐藏', dataIndex: 'gridHidden', format: formatIsUsed },
          { title: '合并列头', dataIndex: 'gridChildren' },
        ],
        gridData: appTableDictGrid,
        showLineNumber: true,
        docxConfig,
      }));
    }
    // 数据字典 筛选项
    let appTableDictFilter = appTableDict.filter((item: any) => { return item.filterItemType });
    if (appTableDictFilter?.length > 0) {
      appTableDictFilter = orderBy(appTableDictFilter, ['filterItemIndex'], ['asc']);
      children.push(myUtil.word.createParagraph({textParam: {text: '数据字典 - 筛选项', bold: true, size: 22}, bullet: true}));
      // debugger;
      children.push(myUtil.word.createTable({
        cols: [
          { title: '字段中文名', dataIndex: 'dictFieldName' },
          { title: '字段英文名', dataIndex: 'dictFieldDesc' },
          { title: '类型', dataIndex: 'filterItemType' },
          // { title: '位置', dataIndex: 'filterItemPosition' },
          // { title: '占位符', dataIndex: 'filterItemPlaceholder' },
        ],
        gridData: appTableDictFilter,
        showLineNumber: true,
        docxConfig,
      }));
    }
    // 数据字典 表单项
    let appTableDictForm = appTableDict.filter((item: any) => { return item.formItemUsed === '1' });
    if (appTableDictForm?.length > 0) {
      appTableDictForm = orderBy(appTableDictForm, ['formItemIndex'], ['asc']);
      children.push(myUtil.word.createParagraph({textParam: {text: '数据字典 - 表单项', bold: true, size: 22}, bullet: true}));
      children.push(myUtil.word.createTable({
        cols: [
          { title: '字段中文名', dataIndex: 'dictFieldName' },
          { title: '字段英文名', dataIndex: 'dictFieldDesc' },
          { title: '类型', dataIndex: 'formItemType' },
          { title: '只读', dataIndex: 'formItemReadonly', format: formatIsUsed },
          { title: '格式化', dataIndex: 'formItemFormat' },
          { title: '验证', dataIndex: 'formItemRule' },
        ],
        gridData: appTableDictForm,
        showLineNumber: true,
        docxConfig,
      }));
    }
  }

  // 生成文档对象children：数据库部分
  const wordChildrenDb = async ({ children = [], startChapter = 1, docxConfig }: any) => {
    // 数据库表及字典所需数据
    const dbTableListResponse: any = await retrieveTablePager({page: 1, pageSize: 999999, searchModel: []});
    const dbTableFieldListResponse: any = await retrieveDictPager({page: 1, pageSize: 999999, searchModel: []});
    let dbTableList: any = dbTableListResponse?.body?.rows || [];
    let dbTableFieldList: any = dbTableFieldListResponse?.body?.rows || [];
    // word层级标题：数据库表一览
    children.push(myUtil.word.createLevelTitle({text: `${startChapter} 数据库`, level: 1}));
    // word层级标题：数据库表一览
    children.push(myUtil.word.createLevelTitle({text: `${startChapter}.1 数据库表一览`, level: 2}));
    // 数据库表汇总
    children.push(myUtil.word.createTable({
      cols: [
        { title: '物理表名称', dataIndex: 'tableName' },
        { title: '物理表含义', dataIndex: 'tableDesc' },
      ],
      gridData: dbTableList,
      showLineNumber: true,
      docxConfig,
    }));
    // word层级标题：数据库表明细
    children.push(myUtil.word.createLevelTitle({text: `${startChapter}.2 数据库表明细`, level: 2}));
    // 数据库表明细
    dbTableList.forEach((item1: any) => {
      let appTableDict = dbTableFieldList.filter((item2: any) => { return item2.dictName === item1.dictName });
      children.push(myUtil.word.createParagraph({textParam: {text: `${item1.dictName} ${item1.dictDesc}`, bold: true, size: 22}, bullet: true}));
      children.push(myUtil.word.createTable({
        cols: [
          { title: '物理表字段英文名', dataIndex: 'dictFieldName' },
          { title: '物理表字段中文名', dataIndex: 'dictFieldDesc' },
          { title: '数据元类型', dataIndex: 'dictFieldType' },
          { title: '键', dataIndex: 'dictFieldKey' },
          // { title: '默认值', dataIndex: 'dictFieldDefaultValue' },
          { title: '非空', dataIndex: 'dictFieldNotNull' },
        ],
        gridData: appTableDict,
        showLineNumber: true,
        docxConfig,
      }));
    })
  }

  // 生成文档对象children：功能菜单
  const wordChildrenMenu = async ({ children = [], menuTree = [], startChapter = 1, docxConfig, }: any) => {
    // word层级标题：数据库表一览
    children.push(myUtil.word.createLevelTitle({text: `${startChapter} 功能菜单`, level: 1, pageBreakBefore: true}));
    // 菜单树
    let menuData: any = [];
    let drawMenu: any;
    drawMenu = (menuArr: any = []) => {
      menuArr.forEach((menuTmp: any) => {
        let menuLevel = Number(menuTmp.menuLevel);
        let prefix = '';
        if (menuLevel === 2) {
          prefix = '  └─';
        } else if (menuLevel === 3) {
          prefix = '      └─';
        } else if (menuLevel === 4) {
          prefix = '          └─';
        }
        menuTmp.menuName = prefix + menuTmp.menuName;
        menuData.push(menuTmp);
        if (menuTmp?.children?.length > 0) {
          drawMenu(menuTmp?.children);
        }
      });
    };
    drawMenu(cloneDeep(menuTree));
    children.push(myUtil.word.createTable({
      cols: [
        { title: '菜单名称', dataIndex: 'menuName' },
        { title: '菜单路径', dataIndex: 'menuPath' },
      ],
      gridData: menuData,
      docxConfig,
    }));
  }
  // 生成文档对象children：接口部分
  const wordChildrenApi = async ({ children = [], startChapter = 1, docxConfig }: any) => {
    // 数据库表及字典所需数据
    const dataModule: any = await retrieveModulePager({page: 1, pageSize: 999999, searchModel: []});
    const dataDict: any = await await retrieveDictPager({page: 1, pageSize: 999999, searchModel: []});
    const dbTableFieldList: any = dataDict?.body?.rows || [];
    // debugger
    // 接口一览
    let apiList: any = [];
    (dataModule?.body?.rows || []).forEach((tmp: any) => {
      // 获取导入目标表名
      let targetTableName;
      let appTableDict: any = dataDict?.body?.rows?.filter((item: any) => { return item.dictName  === tmp.dictName});
      let appTableDictForForm: any = appTableDict.filter((item: any) => { return item.formItemUsed  === '1' });
      for (let i = 0; i < appTableDictForForm.length; i++) {
        if (appTableDictForForm[i].dictFieldRelTable) {
          targetTableName = appTableDictForForm[i].dictFieldRelTable;
          break;
        }
      }
      // 每个模块的接口
      if (tmp?.apiGridQuery?.indexOf('customer:') > -1) {
        // /dict/automatic/exp/bs
        apiList.push({ module_name: tmp.moduleName, api_name: `查列表`, api_url: `.../queryPagerCustomer/${tmp.moduleKey}/${tmp?.apiGridQuery.replace('customer:', '')}` });
      } else {
        apiList.push({ module_name: tmp.moduleName, api_name: `查列表`, api_url: tmp?.apiGridQuery || `/dict/automatic/exp/bs/queryPager/${tmp.moduleKey}` });
      }
      if (tmp.toolbarDefaultDelete || tmp.gridColDel) {
        apiList.push({ module_name: tmp.moduleName, api_name: `删除`, api_url: tmp?.apiFormDelete || `/dict/automatic/exp/bs/delete/${tmp.moduleKey}` });
      }
      if (tmp.toolbarDefaultAdd || tmp.toolbarDefaultEdit || tmp.gridColDetail) {
        apiList.push({ module_name: tmp.moduleName, api_name: `查表单`, api_url: tmp?.apiFormQuery || `/dict/automatic/exp/bs/queryForm/${tmp.moduleKey}` });
      }
      if (tmp.toolbarDefaultAdd || tmp.toolbarDefaultEdit || tmp.gridColEdit) {
        apiList.push({ module_name: tmp.moduleName, api_name: `编辑`, api_url: tmp?.apiFormEdit || `/dict/automatic/exp/bs/saveOrUpdate/${tmp.moduleKey}` });
      }
    });
    // word层级标题：数据库表一览
    children.push(myUtil.word.createLevelTitle({text: `${startChapter} 接口`, level: 1}));
    // word层级标题：数据库表一览
    children.push(myUtil.word.createLevelTitle({text: `${startChapter}.1 接口一览`, level: 2}));
    // 接口一览
    children.push(myUtil.word.createTable({
      cols: [
        { title: '模块', dataIndex: 'module_name' },
        { title: '接口名称', dataIndex: 'api_name' },
        { title: '接口地址', dataIndex: 'api_url' },
      ],
      gridData: apiList,
      showLineNumber: true,
      docxConfig,
    }));

    // word层级标题：接口明细
    children.push(myUtil.word.createLevelTitle({text: `${startChapter}.2 接口明细`, level: 2}));
    // 接口明细
    (dataModule?.body?.rows || []).forEach((moduleInfo: any, index: any) => {
      let grid_key_arr: any = [];
      let appTableDictForGrid: any = dbTableFieldList.filter((item: any) => { return item.gridUsed === '1' && item.dictName  === moduleInfo.dictName });
      let appTableDictForForm: any = dbTableFieldList.filter((item: any) => { return item.formItemUsed  === '1' && item.dictName  === moduleInfo.dictName });
      // 菜单：模块级别标题
      children.push(myUtil.word.createLevelTitle({text: `${startChapter}.2.${index + 1} ${moduleInfo.moduleName}`, level: 3}));

      // api - 1.列表分页查询
      // api - 1.1菜单
      children.push(myUtil.word.createLevelTitle({text: `${startChapter}.2.${index + 1}.1 列表分页查询`, level: 4}));
      // api - 1.2输入报文说明
      children.push(myUtil.word.createParagraph({textParam: {text: '输入报文说明', bold: true, size: 22}, bullet: true, spacing}));
      let tmp11: any = [];
      tmp11.push(
        { aa: 'orderModel', bb: 'array', cc: '排序条件', dd: '', ee: '' },
        { aa: 'page', bb: 'number', cc: '页码', dd: '是', ee: '' },
        { aa: 'pageSize', bb: 'number', cc: '每页条数', dd: '是', ee: '' },
        { aa: 'searchModel', bb: 'array', cc: '查询条件', dd: '', ee: '' },
        { aa: 'searchModel2', bb: 'array', cc: '自定义筛选查询条件', dd: '', ee: '' },
      )
      children.push(myUtil.word.createTable({
        cols: cols1,
        gridData: tmp11,
        showLineNumber: false,
        docxConfig,
      }));
      // api - 1.3输入报文示例
      children.push(myUtil.word.createParagraph({textParam: {text: '输入报文示例', bold: true, size: 22}, bullet: true, spacing}));
      children.push(myUtil.word.createParagraph({textParam: {text: '{'}, indent: indent * 1, shading }));
      children.push(myUtil.word.createParagraph({textParam: {text: '"orderModel": [],'}, indent: indent * 2, shading }));
      children.push(myUtil.word.createParagraph({textParam: {text: '"page": 1,'}, indent: indent * 2, shading }));
      children.push(myUtil.word.createParagraph({textParam: {text: '"pageSize": 10,'}, indent: indent * 2, shading }));
      children.push(myUtil.word.createParagraph({textParam: {text: '"searchModel": [],'}, indent: indent * 2, shading }));
      children.push(myUtil.word.createParagraph({textParam: {text: '"searchModel2": []'}, indent: indent * 2, shading }));
      children.push(myUtil.word.createParagraph({textParam: {text: '}'}, indent: indent * 1, shading }));
      // api - 1.4响应报文说明
      children.push(myUtil.word.createParagraph({textParam: {text: '响应报文说明', bold: true, size: 22}, bullet: true, spacing}));
      let tmp12: any = [];
      tmp12.push({ aa: 'code', bb: 'string', cc: '状态码', dd: '' });
      tmp12.push({ aa: 'body', bb: 'object', cc: '业务数据', dd: '' });
      tmp12.push({ aa: '  rowCount', bb: 'number', cc: '数据条数', dd: '' });
      tmp12.push({ aa: '  rows', bb: 'array', cc: '数据集合', dd: '' });
      appTableDictForGrid.forEach((tmp: any) => {
        let targetField = (dbTableFieldList.find((item: any) => { return item.dictFieldName === tmp.dictFieldName })) || {};
        let mmm = { aa: `    ${myUtil.text.underscoreToCamel(tmp.dictFieldName)}`, bb: DDBunit2ADBUtil.formatApiType({ dictFieldType: targetField.dictFieldType }), cc: tmp.dictFieldDesc, dd: '' };
        if (tmp.gridKey === '1') {
          grid_key_arr.push(tmp);
          mmm.dd = '主键'
        }
        tmp12.push(mmm);
      });
      tmp12.push({ aa: '  statistics', bb: 'object', cc: '统计数据', dd: '' });
      tmp12.push({ aa: '    avg', bb: 'object', cc: '平均值', dd: '' });
      tmp12.push({ aa: '    max', bb: 'object', cc: '最大值', dd: '' });
      tmp12.push({ aa: '    min', bb: 'object', cc: '最小值', dd: '' });
      tmp12.push({ aa: '    sum', bb: 'object', cc: '合计', dd: '' });
      children.push(myUtil.word.createTable({
        cols: cols2,
        gridData: tmp12,
        showLineNumber: false,
        docxConfig,
      }));
      // api - 1.5返回报文示例
      children.push(myUtil.word.createParagraph({textParam: {text: '返回报文示例', bold: true, size: 22}, bullet: true, spacing}));
      children.push(myUtil.word.createParagraph({textParam: {text: '{'}, indent: indent * 1, shading }));
      children.push(myUtil.word.createParagraph({textParam: {text: '"code": "200"'}, indent: indent * 2, shading }));
      children.push(myUtil.word.createParagraph({textParam: {text: '"body": {'}, indent: indent * 2, shading }));
      children.push(myUtil.word.createParagraph({textParam: {text: '"rowCount": 49,'}, indent: indent * 3, shading }));
      children.push(myUtil.word.createParagraph({textParam: {text: '"rows": ['}, indent: indent * 3, shading }));
      children.push(myUtil.word.createParagraph({textParam: {text: '{'}, indent: indent * 4, shading }));
      appTableDictForGrid.forEach((tmp: any, index: any) => {
        children.push(myUtil.word.createParagraph({textParam: {text: `"${myUtil.text.underscoreToCamel(tmp.dictFieldName)}": ""${index === appTableDictForGrid.length - 1 ? '' : ','}`}, indent: indent * 5, shading }));
      })
      children.push(myUtil.word.createParagraph({textParam: {text: '},'}, indent: indent * 4, shading }));
      children.push(myUtil.word.createParagraph({textParam: {text: '...'}, indent: indent * 4, shading }));
      children.push(myUtil.word.createParagraph({textParam: {text: '],'}, indent: indent * 3, shading }));
      children.push(myUtil.word.createParagraph({textParam: {text: '"statistics": {'}, indent: indent * 3, shading }));
      children.push(myUtil.word.createParagraph({textParam: {text: '"avg": {},'}, indent: indent * 4, shading }));
      children.push(myUtil.word.createParagraph({textParam: {text: '"max": {},'}, indent: indent * 4, shading }));
      children.push(myUtil.word.createParagraph({textParam: {text: '"min": {},'}, indent: indent * 4, shading }));
      children.push(myUtil.word.createParagraph({textParam: {text: '"sum": {}'}, indent: indent * 4, shading }));
      children.push(myUtil.word.createParagraph({textParam: {text: '}'}, indent: indent * 3, shading }));
      children.push(myUtil.word.createParagraph({textParam: {text: '}'}, indent: indent * 2, shading }));
      children.push(myUtil.word.createParagraph({textParam: {text: '}'}, indent: indent * 1, shading }));

      // api - 2.数据删除
      if (moduleInfo.toolbarDefaultDelete || moduleInfo.gridColDel) {
        // api - 2.1菜单
        children.push(myUtil.word.createLevelTitle({text: `${startChapter}.2.${index + 1}.2 数据删除`, level: 4}));
        // api - 2.2输入报文说明
        children.push(myUtil.word.createParagraph({textParam: {text: '输入报文说明', bold: true, size: 22}, bullet: true, spacing}));
        tmp11 = [];
        tmp11.push({ aa: 'uuids', bb: 'array', cc: '主键数组', dd: '是', ee: '' })
        children.push(myUtil.word.createTable({
          cols: cols1,
          gridData: tmp11,
          showLineNumber: false,
          docxConfig,
        }));
        // api - 2.3输入报文示例
        children.push(myUtil.word.createParagraph({textParam: {text: '输入报文示例', bold: true, size: 22}, bullet: true, spacing}));
        children.push(myUtil.word.createParagraph({textParam: {text: '{'}, indent: indent * 1, shading }));
        children.push(myUtil.word.createParagraph({textParam: {text: '"uuids": []'}, indent: indent * 2, shading }));
        children.push(myUtil.word.createParagraph({textParam: {text: '}'}, indent: indent * 1, shading }));
        // api - 2.4响应报文说明
        children.push(myUtil.word.createParagraph({textParam: {text: '响应报文说明', bold: true, size: 22}, bullet: true, spacing}));
        tmp12 = [];
        tmp12.push({ aa: 'code', bb: 'string', cc: '状态码', dd: '' });
        tmp12.push({ aa: 'msg', bb: 'string', cc: '业务提示信息', dd: '' });
        children.push(myUtil.word.createTable({
          cols: cols2,
          gridData: tmp12,
          showLineNumber: false,
          docxConfig,
        }));
        // api - 2.5返回报文示例
        children.push(myUtil.word.createParagraph({textParam: {text: '返回报文示例', bold: true, size: 22}, bullet: true, spacing}));
        children.push(myUtil.word.createParagraph({textParam: {text: '{'}, indent: indent * 1, shading }));
        children.push(myUtil.word.createParagraph({textParam: {text: '"code": "200",'}, indent: indent * 2, shading }));
        children.push(myUtil.word.createParagraph({textParam: {text: '"msg": "删除成功"'}, indent: indent * 2, shading }));
        children.push(myUtil.word.createParagraph({textParam: {text: '}'}, indent: indent * 1, shading }));
      }

      // api - 3.表单查询
      if (moduleInfo.toolbarDefaultAdd || moduleInfo.toolbarDefaultEdit || moduleInfo.gridColDetail) {
        // api - 3.1菜单
        children.push(myUtil.word.createLevelTitle({text: `${startChapter}.2.${index + 1}.3 表单查询`, level: 4}));
        // api - 3.2输入报文说明
        children.push(myUtil.word.createParagraph({textParam: {text: '输入报文说明', bold: true, size: 22}, bullet: true, spacing}));
        tmp11 = [];
        for (let i = 0; i < grid_key_arr.length; i++) {
          tmp11.push({ aa: myUtil.text.underscoreToCamel(grid_key_arr[i].dictFieldName), bb: 'string', cc: grid_key_arr[i].dictFieldDesc, dd: '是', ee: '' });
        }
        children.push(myUtil.word.createTable({
          cols: cols1,
          gridData: tmp11,
          showLineNumber: false,
          docxConfig,
        }));
        // api - 3.3输入报文示例
        children.push(myUtil.word.createParagraph({textParam: {text: '输入报文示例', bold: true, size: 22}, bullet: true, spacing}));
        children.push(myUtil.word.createParagraph({textParam: {text: '{'}, indent: indent * 1, shading }));
        for (let i = 0; i < grid_key_arr.length; i++) {
          children.push(myUtil.word.createParagraph({textParam: {text: `"${myUtil.text.underscoreToCamel(grid_key_arr[i].dictFieldName)}": ""`}, indent: indent * 2, shading }));
        }
        children.push(myUtil.word.createParagraph({textParam: {text: '}'}, indent: indent * 1, shading }));
        // api - 3.4响应报文说明
        children.push(myUtil.word.createParagraph({textParam: {text: '响应报文说明', bold: true, size: 22}, bullet: true, spacing}));
        tmp12 = [];
        tmp12.push({ aa: 'code', bb: 'string', cc: '状态码', dd: '' });
        tmp12.push({ aa: 'body', bb: 'object', cc: '业务数据', dd: '' });
        appTableDictForForm.forEach((tmp: any) => {
          let targetField = (dbTableFieldList.find((item: any) => { return item.dictFieldName === tmp.dictFieldName })) || {};
          tmp12.push({ aa: `  ${myUtil.text.underscoreToCamel(tmp.dictFieldName)}`, bb: DDBunit2ADBUtil.formatApiType({ dictFieldType: targetField.dict_field_type }), cc: tmp.dictFieldDesc, dd: '' });
        })
        tmp12.push({ aa: 'msg', bb: 'string', cc: '业务提示信息', dd: '' });
        children.push(myUtil.word.createTable({
          cols: cols2,
          gridData: tmp12,
          showLineNumber: false,
          docxConfig,
        }));
        // api - 3.5返回报文示例
        children.push(myUtil.word.createParagraph({textParam: {text: '返回报文示例', bold: true, size: 22}, bullet: true, spacing}));
        children.push(myUtil.word.createParagraph({textParam: {text: '{'}, indent: indent * 1, shading }));
        children.push(myUtil.word.createParagraph({textParam: {text: '"code": "200",'}, indent: indent * 2, shading }));
        children.push(myUtil.word.createParagraph({textParam: {text: '"body": {'}, indent: indent * 2, shading }));
        appTableDictForForm.forEach((tmp: any, index: any) => {
          children.push(myUtil.word.createParagraph({textParam: {text: `"${myUtil.text.underscoreToCamel(tmp.dictFieldName)}": ""${index === appTableDictForForm.length - 1 ? '' : ','}`}, indent: indent * 3, shading }));
        })
        children.push(myUtil.word.createParagraph({textParam: {text: '},'}, indent: indent * 2, shading }));
        children.push(myUtil.word.createParagraph({textParam: {text: '"msg": "查询成功"'}, indent: indent * 2, shading }));
        children.push(myUtil.word.createParagraph({textParam: {text: '}'}, indent: indent * 1, shading }));
      }

      // api - 4.表单编辑
      if (moduleInfo.toolbarDefaultAdd || moduleInfo.toolbarDefaultEdit || moduleInfo.gridColEdit) {
        // api - 4.1菜单
        children.push(myUtil.word.createLevelTitle({text: `${startChapter}.2.${index + 1}.4 表单编辑`, level: 4}));
        // api - 4.2输入报文说明
        children.push(myUtil.word.createParagraph({textParam: {text: '输入报文说明', bold: true, size: 22}, bullet: true}));
        tmp11 = [];
        tmp11.push({ aa: 'formType', bb: 'string', cc: '采集类别', dd: '是', ee: '表单新建add，表单更新edit' });
        appTableDictForForm.forEach((tmp: any) => {
          let targetField = (dbTableFieldList.find((item: any) => { return item.dictFieldName === tmp.dictFieldName })) || {};
          tmp11.push({ aa: myUtil.text.underscoreToCamel(tmp.dictFieldName), bb: DDBunit2ADBUtil.formatApiType({ dictFieldType: targetField.dict_field_type }), cc: tmp.dictFieldDesc, dd: '', ee: '' });
        });
        children.push(myUtil.word.createTable({
          cols: cols1,
          gridData: tmp11,
          showLineNumber: false,
          docxConfig,
        }));
        // api - 4.3输入报文示例
        children.push(myUtil.word.createParagraph({textParam: {text: '输入报文示例', bold: true, size: 22}, bullet: true, spacing}));
        children.push(myUtil.word.createParagraph({textParam: {text: '{'}, indent: indent * 1, shading }));
        children.push(myUtil.word.createParagraph({textParam: {text: `"formType": "edit",` }, indent: indent * 2, shading }));
        appTableDictForForm.forEach((tmp: any, index: any) => {
          children.push(myUtil.word.createParagraph({textParam: {text: `"${myUtil.text.underscoreToCamel(tmp.dictFieldName)}": ""${index === appTableDictForForm.length - 1 ? '' : ','}`}, indent: indent * 2, shading }));
        });
        children.push(myUtil.word.createParagraph({textParam: {text: '}'}, indent: indent * 1, shading }));
        // api - 4.4响应报文说明
        children.push(myUtil.word.createParagraph({textParam: {text: '响应报文说明', bold: true, size: 22}, bullet: true, spacing}));
        tmp12 = [];
        tmp12.push({ aa: 'code', bb: 'string', cc: '状态码', dd: '' });
        tmp12.push({ aa: 'msg', bb: 'string', cc: '业务提示信息', dd: '' });
        children.push(myUtil.word.createTable({
          cols: cols2,
          gridData: tmp12,
          showLineNumber: false,
          docxConfig,
        }));
        // api - 4.5返回报文示例
        children.push(myUtil.word.createParagraph({textParam: {text: '返回报文示例', bold: true, size: 22}, bullet: true, spacing}));
        children.push(myUtil.word.createParagraph({textParam: {text: '{'}, indent: indent * 1, shading }));
        children.push(myUtil.word.createParagraph({textParam: {text: '"code": "200",'}, indent: indent * 2, shading }));
        children.push(myUtil.word.createParagraph({textParam: {text: '"msg": "编辑成功"'}, indent: indent * 2, shading }));
        children.push(myUtil.word.createParagraph({textParam: {text: '}'}, indent: indent * 1, shading }));
      }
    })
  }

  // generateWordDocument2
  const generateWordDocument2 = async (docxConfig: any) => {
    setLoading(true);
    let { content = ['menu', 'database', 'dictModule'], createToc = true, createHeader = true, createFooter = true } = docxConfig;
    const dataModule: any = await retrieveModulePager({page: 1, pageSize: 999999, searchModel: []});
    const dataDict: any = await retrieveDictPager({page: 1, pageSize: 999999, searchModel: []});
    let dataMenu: any = await queryList({page: 1, pageSize: 999999, searchModel: [
      { op: 'eq', property: 'menuType', type: 1, value: '1' }
    ]}, 'm_sys_menu');
    let dataDocHelp: any = await queryList({page: 1, pageSize: 999999, searchModel: []}, 'm_sys_doc_help');
    let menuExclude = ['敏捷开发', '系统构建', '字典管理', '表管理', '模块管理', '预览页面', 'Excel采集'];
    dataMenu = (dataMenu.body.rows || [])?.filter((item: any) => { return item.menuHide !== 'Y' && menuExclude.indexOf(item.menuName) === -1 });
    let dataMenuTree = myUtil.tree.transformArrToTree(dataMenu, '', {idName: 'menuId', parentIdName: 'menuParentId', childrenName: 'children' });
    dataMenuTree = myUtil.tree.sortTree(dataMenuTree, 'menuOrder', 'asc');
    let startChapter = 0;
    let children: any = [];
    // word 目录
    if (createToc) {
      myUtil.word.createToc({ children });
    }
    // word 功能菜单
    if (content.indexOf('menu') > -1) {
      startChapter = startChapter + 1;
      await wordChildrenMenu({ children, menuTree: dataMenuTree, startChapter, docxConfig, });
    }
    // word 数据库表及字典
    if (content.indexOf('database') > -1) {
      startChapter = startChapter + 1;
      await wordChildrenDb({ children, startChapter, docxConfig });
    }
    // word 模块及字典部分
    if (content.indexOf('dictModule') > -1) {
      startChapter = startChapter + 1;
      children.push(myUtil.word.createLevelTitle({text: `${startChapter} 模块`, level: 1}));
      let drawMenu: any;
      drawMenu = (menuArr: any = [], prefix: any = '') => {
        menuArr.forEach((menuTmp: any, index: any) => {
          let startIndex = index + 1;
          let tmpPrefix = prefix;
          if (tmpPrefix) {
            tmpPrefix = tmpPrefix + '.';
          }
          let tmpTitle: any = `${tmpPrefix}${(startIndex)} ${menuTmp.menuName}`;
          let tmpLevel: any = Number(menuTmp.menuLevel) + 1;
          let levelTitle = myUtil.word.createLevelTitle({text: tmpTitle, level: tmpLevel});
          children.push(levelTitle);
          if (menuTmp?.menuPath?.indexOf('/cfgp/') > -1) {
            const tmp = menuTmp?.menuPath?.split('cfgp/');
            let moduleKey = tmp.length > 1 ? tmp[1] : '';
            let moduleInfo = (dataModule?.body?.rows?.find((item: any) => { return item.moduleKey === moduleKey })) || {};
            if (moduleInfo) {
              let tmpDictName = moduleInfo.dictName || '';
              let appTableDict = dataDict?.body?.rows?.filter((item: any) => { return item.dictName === tmpDictName });
              let docHelpObj = (dataDocHelp?.body?.rows?.find((item: any) => { return item.docMenu === menuTmp.menuId })) || {};
              wordChildrenModule({ children, moduleInfo, appTableDict, docxConfig, docHelp: docHelpObj?.docContent1} );
            }
          }
          if (menuTmp?.children?.length > 0) {
            tmpPrefix = `${tmpPrefix}${(startIndex)}`;
            drawMenu(menuTmp?.children, tmpPrefix);
          }
        });
      };
      drawMenu(dataMenuTree, startChapter);
    }
    // word 接口
    if (content.indexOf('api') > -1) {
      startChapter = startChapter + 1;
      await wordChildrenApi({ children, startChapter, docxConfig });
    }
    let docxTitle = `DDIT_数据字典设计概要_${myUtil.date.formatDate(new Date(), 'YYYYMMDD.hhmmss')}`;
    // 创建文档对象
    let docCc: any = {
      styles: myUtil.word.config(docxConfig).styles,
      sections: [{ children, }],
    }
    if (createHeader) {
      docCc.sections[0].headers = myUtil.word.createHeader({ docxConfig, docxTitle });
    }
    if (createFooter) {
      docCc.sections[0].footers = myUtil.word.createFooter({ docxConfig });
    }
    const doc = new Document(docCc);
    // 下载保存word
    myUtil.word.saveDocx({doc, name: `${docxTitle}.docx`});
    setLoading(false);
  };

  // 表单配置
  let formConfig = {
    form_layout_type: 2,
    form_label_input_layout: 'horizontal',
    form_items: [
      { label: '文档内容', name: 'content', type: 'Checkbox', rules: [{ type: 'base_required' },], list: [
        {value: 'menu', name: '功能菜单'},
        {value: 'database', name: '数据库'},
        {value: 'dictModule', name: '模块'},
        {value: 'api', name: '接口'},
      ] },
      { label: '正文字号', name: 'fontSize', type: 'InputNumber' },
      { label: '生成目录', name: 'createToc', type: 'Switch' },
      { label: '1级标题字号', name: 'fontSizeTitle1', type: 'InputNumber' },
      { label: '正文字体', name: 'fontFamily', type: 'Radio', list: [
        {value: '微软雅黑', name: '微软雅黑'},
        {value: '宋体', name: '宋体'},
      ] },
      { label: '2级标题字号', name: 'fontSizeTitle2', type: 'InputNumber' },
      { label: '正文行距', name: 'fontLine', type: 'Radio', list: [
        {value: 240, name: '1倍'},
        {value: 276, name: '1.15倍'},
        {value: 360, name: '1.5倍'},
        {value: 480, name: '2倍'},
      ] },
      { label: '3级标题字号', name: 'fontSizeTitle3', type: 'InputNumber' },
      { label: '生成页头', name: 'createHeader', type: 'Switch' },
      { label: '生成页脚', name: 'createFooter', type: 'Switch' },
    ],
  };

  // 表单初始值
  let formInitialValues: any = {
    content: ['menu', 'database', 'dictModule', 'api'],
    // content: ['api'],
    createToc: true,
    fontFamily: '微软雅黑',
    fontSize: 18,
    fontLine: 276,
    fontSizeTitle1: 32,
    fontSizeTitle2: 26,
    fontSizeTitle3: 22,
    createHeader: true,
    createFooter: true,
  }

  // 生成文档
  const onSave = () => {
    form.validateFields().then(async (values: any) => {
      generateWordDocument2({
        ...values,
      });
    });
  };

  // 表单重置
  const onReset = () => {
    form.resetFields();
  };

  return (<>
    <Spin spinning={loading} delay={500}>
      <ProCard>
        <div style={{maxWidth: '820px'}}>
          <DDBaseForm config={formConfig} form={form} initialValues={formInitialValues}/>
        </div>
      </ProCard>
      <FooterToolbar >
        <Button type='primary' onClick={onSave}>生成设计文档</Button>
        <Button type='default' onClick={onReset}>重置</Button>
      </FooterToolbar>
    </Spin>
  </>);
};

export default CreateWord;
