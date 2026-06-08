const fs = require('fs');
const os = require('os');
const xlsx = require('xlsx');
const path = require('path');
const chalk = require('chalk');
const inFilePath = path.resolve(__dirname, './config_dev.xlsx');				// 输入路径 config_dev config_dev_local
const projectPath = path.resolve(__dirname, '../../../../');							// 输出路径 工程所在目录

// 配置文件
let config = {
	buss: { sheetIndex: 0, file: '/src/pages/example/excelConfigUnit/' },
	grid: { sheetIndex: 1 },
	form: { sheetIndex: 2 },
	fieldValidator: { sheetIndex: 3 },
	customerContent: { sheetIndex: 4 },
	modifyField: ['title', 'dataIndex', 'fixed', 'width', 'name', 'align', 'render', 'codeTable',
		'sorter', 'filter', 'ellipsis', 'readOnly', 'label', 'type', 'codeTable', 'rules', 'length',
		'decimal', 'range', 'func', 'format', 'validator', 'blur', 'eventOnChange', 'maxLength',
		'showType', 'opt', 'config', 'dateType', 'key', 'codeViewKey', 'autoSize', 'minRows', 'maxRows',
		'required', 'layout', 'bussEnglish', 'gridEnglish', 'eventOnFocus', 'eventOnBlur', 'list',
		'xs', 'sm', 'md', 'lg', 'xl', 'xxl', 'formItem', 'sum', 'placeholder'],
};

// 代码生成工具
let codeCreateTools = {};

// 生成列表项
codeCreateTools.grid = function (data) {
	let gridstr = ``;
  let colsArr = [];
	for (let i = 0; i < data.length; i++) {
		let field = '';
		cols = {};
		let formatArr = data[i]['格式化'] || '';
		if (isNotNull(data[i]['字段中文名'])) {
			cols.title = data[i]['字段中文名'];
		}
		if (isNotNull(data[i]['字段英文名'])) {
			field = formatCamelNaming(data[i]['字段英文名']);
			cols.dataIndex = field;
		}
		if (isNotNull(data[i]['对齐方式'])) {
			let aligns;
			if (data[i]['对齐方式'] === 'R') {
				aligns = 'right';
			} else if (data[i]['对齐方式'] === 'C') {
				aligns = 'left';
			} else if (data[i]['对齐方式'] === 'L') {
				aligns = 'left';
			}
			cols.align = aligns;
		}
		if (isNotNull(data[i]['列宽'])) {
			cols.width = data[i]['列宽'];
		}
		if (isNotNull(data[i]['排序'])) {
			cols.sorter = true;
		}
		if (isNotNull(data[i]['合计'])) {
			cols.sum = true;
		}
		if (isNotNull(data[i]['后端合计'])) {
			cols.sum2 = true;
		}
		if (isNotNull(data[i]['超出隐藏'])) {
			cols.ellipsis = true;
		}
		if (isNotNull(data[i]['固定列'])) {
			if (data[i]['固定列'] == 'L') {
				cols.fixed = 'left';
			}
			if (data[i]['固定列'] == 'R') {
				cols.fixed = 'right';
			}
		}
		if (isNotNull(data[i]['格式化'])) {
			// 数字格式的格式化,例:0,0.0000
			if ((parseInt(formatArr.replace(new RegExp(',"', 'g'), '"'))) == 0) {
				cols.render = `&{type:'number',format:'${formatArr}'}&`;
				// 时间格式的格式化,例:yyyy-MM-dd hh:mm:ss
			} else if (formatArr.indexOf('code_') > -1) {
				let key = formatArr.substring(0, formatArr.length - 3);
				let codeViewKey = formatArr.substring(formatArr.length - 2);
				cols.codeTable = `&['${key}', '${codeViewKey}']&`;
				// 自定义格式化,例:bgdNo
			} else if (formatArr.indexOf('yy') > -1
				|| formatArr.indexOf('MM') > -1
				|| formatArr.indexOf('dd') > -1
				|| formatArr.indexOf('hh') > -1
				|| formatArr.indexOf('mm') > -1
				|| formatArr.indexOf('ss') > -1) {
				formatArr = formatArr.replace('dd', 'DD');
				cols.render = `&{type:'date',format:'${formatArr}'}&`;
				// 码表格式的格式化,例:code_码表索引规则， 码表索引规则：码表索引 + 序号（01、02、03......）
			} else {
				cols.render = `&{func:'${formatArr}'}&`;
			}
		}
		// 处理合并列头1
    if (data[i]['合并列头']) {
      cols.isTopCol = data[i]['合并列头'];
    }
		// 列宽修正
		modifyColWidth(cols, formatArr);
    colsArr.push(cols);
    // colsArr.push(JSON.stringify(cols))
		// let content = JSON.stringify(cols);
		// let tem = `	${content}`;
		// tem = formatConfigCode(tem, config.modifyField);
		// gridstr += `${tem},` + os.EOL;
	}
	// 处理合并列头2
	for (let m = 0; m < colsArr.length; m++) {
		if (colsArr[m].isTopCol) {
			colsArr[m].children = [];
			const max = Number(colsArr[m].isTopCol)
			for (let n = m + 1; n < m + 1 + max; n++) {
				colsArr[m].children.push({ ...colsArr[n] });
				colsArr[n].needDel = 1;
			}
			colsArr[m].align = 'center';
			delete colsArr[m].isTopCol;
			delete colsArr[m].dataIndex;
			delete colsArr[m].width;
		}
	}
	// 处理合并列头2: 原有列中删除存在于children中的
	colsArr = colsArr.filter((tmp) => (tmp.needDel != 1));
	for (let m = 0; m < colsArr.length; m++) {
		// 句尾逗号
		const comma = m === colsArr.length - 1 ? '' : ',';
		const content = JSON.stringify(colsArr[m]);
		let tem = `		${content}`;
		tem = formatConfigCode(tem, config.modifyField);
		gridstr += `${tem}${comma}` + os.EOL;
	}
	return gridstr;
}

// 生成筛选项
codeCreateTools.filter = function (data) {
	let filterstr = ``;
	let filterstr2 = ``;
	for (let i = 0; i < data.length; i++) {
		let name = '';
		let items = {};
		if (isNotNull(data[i]['字段英文名'])) {
			name = formatCamelNaming(data[i]['字段英文名']);
			items.name = name;
		}
		if (isNotNull(data[i]['字段中文名'])) {
			items.label = data[i]['字段中文名'];
		}
		if (isNotNull(data[i]['筛选名称'])) {
			items.label = data[i]['筛选名称'];
		}
		if (isNotNull(data[i]['占位符'])) {
			items.placeholder = data[i]['占位符'];
		}
		if (data[i]['筛选'] == 'input') {
			items.type = `&'Input'&`;
		} else if (data[i]['筛选'] == 'select') {
			items.type = `&'Select'&`;
			items.allowClear = true
		} else if (data[i]['筛选'] == 'select3') {
			items.type = `&'Select'&`;		// 原申报系统为tableSelect控件，即 items.type = `&'tableSelect'&`
			items.showType = '3';
			items.showSearch = true;
			items.allowClear = true
		} else if (data[i]['筛选'] == 'date') {
			items.type = `&'DatePicker'&`;
			items.allowClear = true
		} else if (data[i]['筛选'] == 'hidden') {
			items.type = `&'Hidden'&`;
		} else if (data[i]['筛选'] == 'textarea') {
			items.type = `&'TextArea'&`;
		} else if (data[i]['筛选'] == 'title') {
			items.type = `&'GroupTitle'&`;
		} else if (data[i]['筛选'] == 'autoComplete') {
			items.type = `&'AutoComplete'&`;
			items.showType = '3';
			items.allowClear = true;
		} else {
			items.type = `${data[i]['筛选']}`;
		}
		if (isNotNull(data[i]['筛选顺序'])) {
			// items.order = data[i]['筛选顺序'];
		}
		if (isNotNull(data[i]['筛选扩展参数'])) {
			// 筛选是时间范围时，筛选扩展参数为(range|date)，直接添加range；其他类型则配置码表
			if (data[i]['筛选扩展参数'] === 'range|date' || data[i]['筛选扩展参数'] === 'range|input') {
				items.range = true;
			} else {
				let optionArr = data[i]['筛选扩展参数'];
				let key = optionArr.substring(0, optionArr.length - 3);
				let codeViewKey = optionArr.substring(optionArr.length - 2);
				items.codeTable = `&['${key}', '${codeViewKey}']&`;
			}
		}
		let content = JSON.stringify(items);
		let tem; // 普通筛选
		let tem2; // 工具栏区域筛选
		if (data[i]['筛选位置'] === '工具栏') {
			tem2 = `	${content}`;
			tem2 = formatConfigCode(tem2, config.modifyField);
			filterstr2 += `${tem2},` + os.EOL;
		} else {
			tem = `	${content}`;
			tem = formatConfigCode(tem, config.modifyField);
			filterstr += `${tem},` + os.EOL;
		}
	}
	return { filterstr, filterstr2 }
}

// 生成表单项
codeCreateTools.form = function (data, fieldsValidator) {
	let formstr = ``;
	for (let i = 0; i < data.length; i++) {
		let name = '';
		let items = {};
		if (isNotNull(data[i]['字段中文名'])) {
			items.label = data[i]['字段中文名'];
		}
		if (isNotNull(data[i]['字段英文名'])) {
			name = formatCamelNaming(data[i]['字段英文名']);
			items.name = name;
		}
		if (isNotNull(data[i]['类型'])) {
			if (data[i]['类型'] == 'input') {
				if (data[i]['格式化'] && data[i]['格式化'].indexOf('0.0') > -1) {
					// 如果格式化为数字格式，则类型为InputNumber，可能不全
					// 还可以根据校验条件判断：存在“Number”、“数值范围”则为InputNumber，后续按需整理
					items.type = `&'InputNumber'&`;
				} else {
					items.type = `&'Input'&`;
				}
			} else if (data[i]['类型'] == 'select') {
				items.type = `&'Select'&`;
				items.allowClear = true;
			} else if (data[i]['类型'] == 'date') {
				items.type = `&'DatePicker'&`;
				items.allowClear = true
			} else if (data[i]['类型'] == 'hidden') {
				items.type = `&'Hidden'&`;
			} else if (data[i]['类型'] == 'textarea') {
				items.type = `&'TextArea'&`;
				items.autoSize = { minRows: 2, maxRows: 2 };
			} else if (data[i]['类型'] == 'title') {
				items.type = `&'GroupTitle'&`;
			} else if (data[i]['类型'] == 'autoComplete') {
				if (data[i]['blur'] == 'hbhlDm') {
					items.type = `&'AutoComplete'&`;		// 原申报系统为AutoComplete控件，即 items.type = `&'AutoComplete'&`
					items.showType = '3';
					items.allowClear = true;
				} else {
					items.type = `&'Select'&`;		// 原申报系统为AutoComplete控件，即 items.type = `&'AutoComplete'&`
					items.showType = '3';
					items.showSearch = true;
					items.allowClear = true;
				}
			} else if (data[i]['类型'] == 'select3') {
				items.type = `&'Select'&`;		// 原申报系统为tableSelect控件，即 items.type = `&'tableSelect'&`
				items.showType = '4';
				items.showSearch = true;
				items.mode = 'multiple';
				items.eventOnChange = items.name;
				items.allowClear = true;
			} else if (data[i]['类型'] == 'standing') {
				items.type = `&'Blank'&`;
			} else {
				items.type = data[i]['类型'];
			}
		}
		if (data[i]['只读'] && data[i]['只读'] == 'Y') {
			items.readOnly = true;
			if (items.type === `&'Select'&`) {
				items.disabled = true;
			}
		}
		if (isNotNull(data[i]['格式化'])) {
			let formatArr = data[i]['格式化'];
			// 数字格式的格式化,例:0,0.0000
			if ((parseInt(formatArr.replace(new RegExp(',"', 'g'), '"'))) == 0) {
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
		if (data[i]['类型'] == 'select'
			|| data[i]['类型'] == 'checkbox'
			|| data[i]['类型'] == 'radio'
			|| data[i]['类型'] == 'autoComplete' //  原申报系统AutoComplete控件，新系统采用Select控件，走码表配置
			|| data[i]['类型'] == 'select3' //  原申报系统tableSelect控件，新系统采用Select控件，走码表配置
			&& data[i]['扩展参数']) {
			let formatStr = data[i]['扩展参数'];
			let key = formatStr.substring(0, formatStr.length - 3);
			let codeViewKey = formatStr.substring(formatStr.length - 2);
			items.codeTable = [key, codeViewKey];
		}
		if (isNotNull(data[i]['布局'])) {
			let layout = `${data[i]['布局']}`
			layout = layout.replace(/\s*/g, "");	// 去除空格
			if (layout == '{label:{xs:6,sm:5,md:5,lg:3},input:{xs:16,sm:17,md:17,lg:21}}'
				|| layout == '{label:{xs:6,sm:5,md:5,lg:3},input:{xs:16,sm:17,md:17,lg:19}}') {
				items.layout = {
					label: { xs: 8, sm: 8, md: 8, lg: 5, xl: 3, xxl: 3 },
					formItem: { xs: 16, sm: 16, md: 16, lg: 19, xl: 21, xxl: 21 },
				}
			} else if (layout == '{label:{xs:6,sm:5,md:5,lg:3},input:{xs:5,sm:6,md:6,lg:13}}') {
				// 待整理
			} else if (layout == '{label:{xs:4,sm:4,md:4,lg:3},input:{xs:20,sm:20,md:20,lg:21}}') {
				// 待整理
			} else if (layout == '{label:{xs:3,sm:3,md:3,lg:3},input:{xs:19,sm:19,md:19,lg:19}}') {
				// 待整理
			} else if (layout == '{label:{xs:6,sm:5,md:5,lg:3},input:{xs:5,sm:6,md:6,lg:8}}') {
				// 待整理
			} else if (layout == '{label:{xs:6,sm:5,md:5,lg:3},input:{xs:16,sm:17,md:17,lg:19}}') {
				// 待整理
			}
		}
		if (data[i]['类型'] == 'date' && data[i]['扩展参数']) {
			// items.dateType = data[i]['扩展参数'];
		}
		if (data[i]['类型'] == 'tableSelect' && data[i]['扩展参数']) {
			// items.config = `${formatCamelNaming(data[i]['扩展参数'])}`;
		}
		if (isNotNull(data[i]['验证'])) {
			let tmpItemRules = data[i]['类型'] == 'hidden' ? [] : codeCreateTools.formItemRules(data[i], fieldsValidator);
			if (tmpItemRules && tmpItemRules.length > 0) {
				items.rules = tmpItemRules;
				// 根据校验条件判断：存在“Number”、“数值范围”则为InputNumber
				for (let i = 0; i < tmpItemRules.length; i++) {
					if (items.type === `&'Input'&` && tmpItemRules[i].type === 'base_number') {
						items.type = `&'InputNumber'&`;
						break;
					}
				}
			}
		}
		if (isNotNull(data[i]['blur'])) {
			if (data[i]['类型'] == 'autoComplete') {		// 原申报系统AutoComplete控件的blur事件，改为onchange事件
				if (data[i]['blur'] == 'hbhlDm') { // hbhlDm额外添加focus事件
					items.eventOnBlur = data[i]['blur'];
					items.eventOnFocus = data[i]['blur'];
				} else {
					items.eventOnChange = data[i]['blur'];
				}
			} else {
				items.eventOnBlur = data[i]['blur'];
			}
		}
		if (isNotNull(data[i]['focus'])) {
			items.eventOnFocus = data[i]['focus'];
		}
		if (isNotNull(data[i]['onchange'])) {
			if (data[i]['onchange'] == 'ckspDm' || data[i]['onchange'] == 'tzhckspDm') {		// 原申报系统ckspDm或tzhckspDm的onchange事件，改为blur事件
				items.eventOnBlur = data[i]['onchange'];
			} else {
				items.eventOnChange = data[i]['onchange'];
			}
		}
		let content = JSON.stringify(items);
		let tem = `	${content}`;
		tem = formatConfigCode(tem, config.modifyField);
		formstr += `${tem},` + os.EOL;
	}
	return formstr;
};

codeCreateTools.formItemRules = function (item, fields) {
	// item 当前表单项目
	// fields 字段维度校验规则分组
	// 每一个字段的校验规则
	let itemRules = [];
	for (let i = 0; i < fields.length; i++) {
		let fieldEng = fields[i][0]['字段英文名'];
		if (!fieldEng) {
			continue;
		}
		if (fieldEng != item['字段英文名']) {
			continue;
		}
		// 遍历校验规则
		let rules = fields[i];
		for (let m = 0; m < rules.length; m++) {
			let note = rules[m]['说明'];
			let tableName = rules[m]['使用表单名'];
			let tableNameEngArr = tableName && tableName.split(',') ? tableName.split(',') : [];	// ZXSB_BA_WMZHFWDBTS_GCB=外贸综合服务企业代办退税情况备案过程表
			let tableNameEngStr = '';
			for (let i = 0; i < tableNameEngArr.length; i++) {
				tableNameEngStr += tableNameEngArr[i].split('=')[0] + ', ';
			}
			tableNameEngStr = tableNameEngStr.replace(/(^\s*)|(\s*$)/g, '');
			if (tableNameEngStr && tableNameEngStr.length > 0) {
				tableNameEngStr = tableNameEngStr.substring(0, tableNameEngStr.length - 1);
			}
			tableName = tableName ? tableName : '无任何表单使用';
			if (note == '必录') {
				itemRules.push({ type: 'base_required', });
			} else if (note.indexOf('数值范围') > -1) {
				let plusOrMinus = note.replace('数值范围', '');
				itemRules.push({ type: 'base_number', range: plusOrMinus });
			} else if (note.indexOf('VARCHAR2') > -1) {					// 长度范围	VARCHAR2(30)
				let maxLength = note.substring(9, note.length - 1);
				itemRules.push({ type: 'base_string', range: [0, Number(maxLength)] });
			} else if (note.indexOf('长度范围') > -1) {					// 长度范围
				let scopeStr = note.replace('长度范围', '');
				let min = scopeStr.split('~')[0];
				let max = scopeStr.split('~')[1];
				itemRules.push({ type: 'base_string', range: [min, max] });
			} else if (note.indexOf('长度=') > -1) {					// 长度等于
				let maxLength = note.replace('长度=', '');
				itemRules.push({ type: 'base_string', length: maxLength });
			} else if (note.indexOf('邮件格式') > -1) {					// 邮箱
				itemRules.push({ type: 'base_type_mail' });
			} else if (note.indexOf('身份证格式') > -1) {				// 身份证
				itemRules.push({ type: 'base_type_idcard' });
			} else if (note.indexOf('电话格式') > -1) {					// 手机或座机
				itemRules.push({ type: 'base_type_phone' });
			} else if (note.indexOf('数字字母') > -1) {					// 数字字母
				itemRules.push({ type: 'base_type_number_english' });
			} else if (note.indexOf('数字') > -1) {						// 数字
				itemRules.push({ type: 'base_type_number' });
			} else if (note.indexOf('NUMBER') > -1) {					// NUMBER(16,2)	或 NUMBER(16)
				let maxValTmp = note.substring(7, note.length - 1);		// 16,4	或 16
				let digit;
				let decimal;
				if (note.indexOf(',') > -1) {							// 含小数
					digit = maxValTmp.split(',')[0];					// 16
					decimal = maxValTmp.split(',')[1];					// 4
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
}

// 字段校验
codeCreateTools.fieldValidator = function (fieldEventArr, formArr) {
	// 数据处理
	let tmpLastField = '';
	let fields = [];			// 字段维度分组校验规则
	let oneField = [];			// 单一字段校验规则
	// 筛选当前表单事件中的校验事件
	fieldEventArr = fieldEventArr.filter(rowData => rowData['事件类别'] == '校验');
	// 检查字段是否是日期类型
	// 如果日期类型 && 且没有日期类型校验 => 则在校验中增加日期类型校验	*** 暂时未实现，只给出了提示 ***
	// 	=> 日期格式才用当前字段的格式格式校验
	//  => 如果未填写格式，采用默认格式yyyy-MM-dd
	// 定义需要修复的日期表单项数组
	let needReviewItems = [];
	// 获取表单sheet页中字段，且类型为date
	let dataFormItems = formArr;
	dataFormItems = dataFormItems.filter(rowData => rowData['类型'] == 'date');
	// 遍历类型为date表单项目
	// 字段英文名									格式：CKRQ_1
	// 表英文名										格式：ZXSB_ZM_CKJYMSHXSB_GCB
	// 业务域英文名									格式：ZMKJ
	for (let m = 0; m < dataFormItems.length; m++) {
		// 是否增加了日期格式校验规则
		let dateFormatValidator = false;
		// 遍历校验规则项目
		// 字段英文名	  					格式：CKRQ_1
		// 使用表单名								格式：ZXSB_ZM_CKJYMSHXSB_GCB
		for (let k = 0; k < fieldEventArr.length; k++) {
			// 比较同字段
			if (fieldEventArr[k]['字段英文名'] == dataFormItems[m]['字段英文名'] &&
				fieldEventArr[k]['使用表单名'].indexOf(dataFormItems[m]['表英文名']) > -1) {
				// 判断当前表单字段是否含有日期类型的格式校验
				// 如果含有yyyy-MM-dd、yyyyMM、yyyy
				// 当前校验规则无需修正
				let desc = fieldEventArr[k]['说明'];
				if (desc == 'yyyy-MM-dd' || desc == 'yyyyMM' || desc == 'yyyy') {
					dateFormatValidator = true;
					break;
				}
			}
		}
		// 如果日期格式，且不含有yyyy-MM-dd、yyyyMM、yyyy校验规则
		if (!dateFormatValidator) {
			// 添加待修正列表中
			needReviewItems.push(dataFormItems[m]);
		}
	}
	// 获取字段维度分组数据
	for (let i = 0; i < fieldEventArr.length; i++) {
		if (i == 0) {
			tmpLastField = fieldEventArr[i]['字段英文名'];
		}
		if (tmpLastField == fieldEventArr[i]['字段英文名']) {
			oneField.push(fieldEventArr[i]);
		} else {
			fields.push(oneField);
			oneField = [];
			oneField.push(fieldEventArr[i]);
		}
		tmpLastField = fieldEventArr[i]['字段英文名'];
		if (i == fieldEventArr.length - 1) {
			fields.push(oneField);
		}
	}
	// 过滤无验证事件字段
	fields = fields.filter(rowData => rowData && rowData.length != 0);
	// 配置了校验规则，但form中漏写校验规则
	let uuuuu = [];
	let dataFormItems2 = formArr;
	dataFormItems2 = dataFormItems2.filter(rowData => ((rowData['验证'] == '/' || !rowData['验证']))
		&& rowData['类型'] != 'hidden');		// 未写校验规则的字段
	for (let t = 0; t < dataFormItems2.length; t++) {
		let tmpFlag = true;
		// 排除测试表单
		if (dataFormItems2[t]['业务域英文名'] == 'TESTBUSS_AAA' || dataFormItems2[t]['业务域英文名'] == 'TESTBUSS_CCC') {
			continue;
		}
		for (let y = 0; y < fields.length; y++) {		// 所有待验证的字段
			if (dataFormItems2[t]['字段英文名'] == fields[y][0]['字段英文名']) {
				tmpFlag = false;
				break;
			}
		}
		if (!tmpFlag) {
			uuuuu.push(dataFormItems2[t]);
		}
	}
	// by james
	for (let j = 0; j < fields.length; j++) {
		let a = fields[j];
		for (let k = 0; k < a.length; k++) {
			if (a[k]['说明'] == '/') {
				a.splice(k, 1);
			}
		}
		if (fields[j].length == 0) {
			fields.splice(j, 1);
		}
	}

	return {
		fields: fields,
		checkLog: uuuuu,
	};
};


// 自定义工具栏
codeCreateTools.customerBtn = function (data) {
	let btnstr = ``;
	for (let i = 0; i < data.length; i++) {
		let btn = {};
		if (isNotNull(data[i]['按钮名称'])) {
			btn.name = data[i]['按钮名称'];
		}
		if (isNotNull(data[i]['按钮key'])) {
			btn.key = data[i]['按钮key'];
		}
		if (isNotNull(data[i]['按钮方法名'])) {
			btn.func = data[i]['按钮方法名'];
		}
		let content = JSON.stringify(btn);
		let tem = `	${content}`;
		tem = formatConfigCode(tem, config.modifyField);
		btnstr += `${tem},` + os.EOL;
	}
	return btnstr;
}

// 生成业务代码auto_config
codeCreateTools.buss = function () {
	let workbook = xlsx.readFile(inFilePath); // 获取xlsx文档对象
	let sheetNames = workbook.SheetNames; // 获取表名
	let sheet = workbook.Sheets[sheetNames[config.buss.sheetIndex]]; // 通过表名获取表对象
	let data = xlsx.utils.sheet_to_json(sheet); // 表对象转json
	let minIndex = 0;
	let maxIndex = data.length;
	let checkLogs = [];
	log(`${os.EOL}生成文件：`);
	for (let i = minIndex; i < maxIndex; i++) {
		let xlsxBussEnglish = data[i]['业务域英文名'];
		let xlsxGridEnglish = data[i]['表英文名'];
		let xlsxGridChinese = data[i]['表中文名'];
    let xlsxFilePath = data[i]['文件及目录']
    let xlsxGridShowSerialNumber = data[i]['序号'] === '开启' ? true : false; // 序号是否显示
    let xlsxCreateFlgConfig = data[i]['文件config'] === '开启' ? true : false; // 文件生成开关: config
    let xlsxGreateFlgIndex = data[i]['文件index'] === '开启' ? true : false; // 文件生成开关: index
    let xlsxGreateFlgFunc = data[i]['文件func'] === '开启' ? true : false; // 文件生成开关: func
    let xlsxGridBorder = data[i]['列表边框'] === '开启' ? true : false; // 列表边框
    // let xlsxGridPagination = data[i]['分页'] === '开启' ? true : false; // 列表分页
    let xlsxBtnColEdit = data[i]['列表列编辑'] === '开启' ? true : false; // 列表列链接: 编辑
    let xlsxBtnColDel = data[i]['列表列删除'] === '开启' ? true : false; // 列表列链接: 删除
    let xlsxBtnToolbarAdd = data[i]['工具栏增加'] === '开启' ? true : false; // 工具栏按钮: 增加
    let xlsxBtnToolbarDel = data[i]['工具栏删除'] === '开启' ? true : false; // 工具栏按钮: 删除
    let xlsxBtnToolbarEdit = data[i]['工具栏编辑'] === '开启' ? true : false; // 工具栏按钮: 编辑
    let xlsxBtnToolbarSetting = data[i]['工具栏设置'] === '开启' ? true : false; // 工具栏按钮: 设置
		let xlsxBtnToolbarUpload = data[i]['工具栏导入'] === '开启' ? true : false; // 工具栏按钮: 导入;
		let xlsxBtnToolbarDownload = data[i]['工具栏导出'] === '开启' ? true : false; // 工具栏按钮: 导出;
		let xlsxBtnToolbarFull = data[i]['工具栏全屏'] === '开启' ? true : false; // 工具栏按钮: 导出;
		let xlsxBtnToolbarReload = data[i]['工具栏刷新'] === '开启' ? true : false; // 工具栏按钮: 导出;
		let xlsxCheckboxRadio = data[i]['列表首选项'] === '关闭' ? false : `'${data[i]['列表首选项'].toLowerCase()}'`; // 列表首选项;
		let xlsxServiceFlag = data[i]['业务单元key']; // 业务单元key
    let xlsxFormLayoutType = data[i]['表单布局'] || 'horizontal'; // 表单布局
    let xlsxFormWidth = data[i]['表单宽度'] || 1200; // 表单宽度
		let xlsxConstant = isNotNull(data[i]['常量']) ? data[i]['常量'] : '';
		if (xlsxFormLayoutType === 'horizontal' || xlsxFormLayoutType === 'vertical') {
			xlsxFormLayoutType = `'${xlsxFormLayoutType}'`;
		}
		if (xlsxFormWidth === 'max') {
			xlsxFormWidth = `'${xlsxFormWidth}'`;
		}
		// let xlsxPath = `${xlsxBussEnglis + '___' + xlsxGridEnglish}/`;
		let gridsheet = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNames[config.grid.sheetIndex]]);
		let formsheet = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNames[config.form.sheetIndex]]);
		let fieldEventSheet = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNames[config.fieldValidator.sheetIndex]]);
		let customerContentSheet = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNames[config.customerContent.sheetIndex]]);
		let gridArr = [];
		let costomerToobarArr = [];
		let costomerHandleColumns = [];
		let formArr = [];
		let filterArr = [];
		let fieldEventArr = [];
		let exportKey = isNotNull(data[i]['导出key']) ? data[i]['导出key'] : '';

		// 列表：分页
		let gridPaginationJson = '';
		if (data[i]['分页'] !== '开启') {
			gridPaginationJson += `${os.EOL}unitConfig.grid_pagination = false; // 列表：分页，默认true`
		}
		// api
		let xlsxApiGridQuery = isNotNull(data[i]['查询列表Api']) ? data[i]['查询列表Api'] : '';
		let xlsxApiFormQuery = isNotNull(data[i]['查询表单Api']) ? data[i]['查询表单Api'] : '';
		let xlsxApiFormEdit = isNotNull(data[i]['保存Api']) ? data[i]['保存Api'] : '';
		let xlsxApiFormDelete = isNotNull(data[i]['删除Api']) ? data[i]['删除Api'] : '';
		let api_json = '';
		if (xlsxApiGridQuery) {
			api_json += `unitConfig.api_grid_query = '${xlsxApiGridQuery}'; // api：列表查询${os.EOL}`
		}
		if (xlsxApiFormQuery) {
			api_json += `unitConfig.api_form_query = '${xlsxApiFormQuery}'; // api：表单查询${os.EOL}`
		}
		if (xlsxApiFormEdit) {
			api_json += `unitConfig.api_form_edit = '${xlsxApiFormEdit}'; // api：表单更新${os.EOL}`
		}
		if (xlsxApiFormDelete) {
			api_json += `unitConfig.api_form_delete = '${xlsxApiFormDelete}'; // api：表单删除${os.EOL}`
		}
		// 列表项
		for (let g = 0; g < gridsheet.length; g++) {
			if (gridsheet[g]['业务域英文名'] == xlsxBussEnglish
				&& gridsheet[g]['表英文名'] == xlsxGridEnglish
				&& gridsheet[g]['隐藏列'] != 'Y') {
					gridArr.push(gridsheet[g])
			}
		}
		// 自定义工具栏
		for (let cus = 0; cus < customerContentSheet.length; cus++) {
			if (customerContentSheet[cus]['业务域英文名'] == xlsxBussEnglish
				&& customerContentSheet[cus]['表英文名'] == xlsxGridEnglish
				&& customerContentSheet[cus]['按钮位置'] == '工具栏') {
					costomerToobarArr.push(customerContentSheet[cus])
			}
		}
		// 自定义列表列
		for (let cus = 0; cus < customerContentSheet.length; cus++) {
			if (customerContentSheet[cus]['业务域英文名'] == xlsxBussEnglish
				&& customerContentSheet[cus]['表英文名'] == xlsxGridEnglish
				&& customerContentSheet[cus]['按钮位置'] == '列表列') {
					costomerHandleColumns.push(customerContentSheet[cus])
			}
		}
		// 表单项
		for (let item = 0; item < formsheet.length; item++) {
			if (formsheet[item]['业务域英文名'] == xlsxBussEnglish
				&& formsheet[item]['表英文名'] == xlsxGridEnglish) {
				formArr.push(formsheet[item]);
			}
		}
		// 过滤项
		for (let eld = 0; eld < gridArr.length; eld++) {
			if (isNotNull(gridArr[eld]['筛选'])) {
				filterArr.push(gridArr[eld]);
			}
		}
		// 过滤项排序
		filterArr = filterArr.sort((a, b) => {
			let tmp1 = a['筛选顺序'] || 0;
			let tmp2 = b['筛选顺序'] || 0;
			tmp1 = tmp1 === '/' ? 0 : tmp1;
			tmp2 = tmp2 === '/' ? 0 : tmp2;
			return tmp1 - tmp2;
		})
		// 字段事件
		for (let element = 0; element < fieldEventSheet.length; element++) {
			if (fieldEventSheet[element]['使用表单名']
				&& fieldEventSheet[element]['使用表单名'].indexOf(xlsxGridEnglish) != -1) {
				fieldEventArr.push(fieldEventSheet[element])
			}
		}
		// 字段维度分组校验规则
		let fieldsValidatorReval = codeCreateTools.fieldValidator(fieldEventArr, formArr);
		let fieldsValidator = fieldsValidatorReval.fields;
		checkLogs.push(fieldsValidatorReval.checkLog);
		// 创建业务文件夹
		let targetDir = '';
		// targetDir = (__dirname, projectPath + config.buss.file + xlsxBussEnglis + '___' + xlsxGridEnglish);
    targetDir = (__dirname, path.join(projectPath, config.buss.file, xlsxFilePath)) // 输入路径
		mkdirsSync(targetDir);
		// 生成config.tsx
		let filePathMain = path.resolve(__dirname, `${targetDir}\\auto_config.tsx`);	// auto_config.tsx文件及路径
		let htmlCodeMain =
			`/**
* title: ${xlsxGridChinese}
* serviceKey: ${xlsxServiceFlag}
* unitId: ${xlsxBussEnglish.toLowerCase()}_${xlsxGridEnglish.toLowerCase()}
*/

const unitConfig: any = {};

unitConfig.module_key = '${xlsxServiceFlag}'; // 业务单元key，对应后端接口
unitConfig.page_id = '${xlsxBussEnglish.toLowerCase()}_${xlsxGridEnglish.toLowerCase()}'; // 页面id
unitConfig.grid_title = '${xlsxGridChinese}'; // 列表标题，可选
unitConfig.grid_show_serial_number = ${xlsxGridShowSerialNumber}; // 列表：是否显示序号，默认不显示
unitConfig.grid_border = ${xlsxGridBorder}; // 列表：边框，默认true${gridPaginationJson}
unitConfig.form_title = '${xlsxGridChinese}'; // 表单标题，可选
unitConfig.form_layout_type = ${xlsxFormLayoutType}; // 表单整体一列或多列布局: horizontal vertical 2 3 4 6 8 12
unitConfig.form_width = ${xlsxFormWidth}; // 表单：宽度，默认1200，可选 480 720 960 1200 max
unitConfig.grid_selection_type = ${xlsxCheckboxRadio}; // 列表首选项类别，默认 checkbox，可选 false radio checkbox
${api_json}
// 配置列表列
unitConfig.grid_columns = [
${codeCreateTools.grid(gridArr)}];

// 筛选项
unitConfig.filter_items = [
${codeCreateTools.filter(filterArr).filterstr}];

// 筛选项 工具栏区域
unitConfig.grid_filter_quick = [
${codeCreateTools.filter(filterArr).filterstr2}];

// 表单项
unitConfig.form_items = [
${codeCreateTools.form(formArr, fieldsValidator)}];

// 配置项：工具栏
unitConfig.toolbar_default = {
	add: ${xlsxBtnToolbarAdd}, // 是否显示增加按钮，默认关闭
	edit: ${xlsxBtnToolbarEdit}, // 是否显示修改按钮，默认关闭
	delete: ${xlsxBtnToolbarDel}, // 是否显示删除按钮，默认关闭
	setting: ${xlsxBtnToolbarSetting}, // 是否显示设置按钮，默认关闭
	reload: ${xlsxBtnToolbarReload}, // 是否显示刷新按钮，默认关闭
	full: ${xlsxBtnToolbarFull}, // 是否显示全屏按钮，默认关闭
	download: ${xlsxBtnToolbarDownload}, // 是否显示导出按钮，默认关闭
	upload: ${xlsxBtnToolbarUpload},  // 是否显示导入按钮，默认关闭
	// CKTS 业务字段（与示例代码保持一致：true/4；不需要小计的模块可在 auto_config.tsx 中覆盖为 false/0）
	ckts_sum: true,
	ckts_order: 4,
};

// 配置项：列表操作列
unitConfig.grid_handle_columns_default = {
	edit: ${xlsxBtnColEdit}, // 是否显示编辑链接，默认关闭
	delete: ${xlsxBtnColDel}, // 是否显示删除链接，默认关闭
};

// 配置项：自定义工具栏
unitConfig.customer_toolbar = [
${codeCreateTools.customerBtn(costomerToobarArr)}];

// 配置项：自定义操作列
unitConfig.handle_columns = [
${codeCreateTools.customerBtn(costomerHandleColumns)}];

export default unitConfig;
`

		// 生成index.tsx
		let filePathIndex = path.resolve(__dirname, `${targetDir}\\index.tsx`);	// auto_config.tsx文件及路径
		let htmlCodeIndex =
			`import React, { useContext, useState, useEffect, useRef } from 'react';
import DDBunit2 from '@/pages/hts/commonModule/ddbunit2_ckts/DDBunit2_CKTS';
import unitConfig from './auto_config';
import Func from './f';

const Unit2: React.FC<unknown> = () => {
const myConfig = { ...unitConfig };

return <>
	<DDBunit2 config={myConfig} func={Func} />
</>;
};

export default Unit2;
`

		// f.tsx
		let filePathF = path.resolve(__dirname, `${targetDir}\\f.tsx`);	// auto_config.tsx文件及路径
		let htmlCodeF =
			`import React from 'react';

const Func: any = {
refUnit: React.createRef(),
};

export default Func;
`

		if (xlsxGreateFlgIndex) {
			let writeStreamIndex = fs.createWriteStream(`${filePathIndex}`);
			writeStreamIndex.write(htmlCodeIndex + os.EOL);
			log(`${targetDir + 'index.tsx'}`);
		}
		if (xlsxCreateFlgConfig) {
			let writeStreamMain = fs.createWriteStream(`${filePathMain}`);
			writeStreamMain.write(htmlCodeMain + os.EOL);
			log(`${targetDir + 'auto_config.tsx'}`);
		}
		if (xlsxGreateFlgFunc) {
			let writeStreamF = fs.createWriteStream(`${filePathF}`);
			writeStreamF.write(htmlCodeF + os.EOL);
			log(`${targetDir + 'f.tsx'}`);
		}
	}
	log(`文件生成完毕。` + os.EOL + os.EOL);

	log('下列字段配置了校验规则，但form中未记录。', 'yellowBright');
	for (let y = 0; y < checkLogs.length; y++) {
		if (checkLogs[y] && checkLogs[y].length > 0) {
			for (let i = 0; i < checkLogs[y].length; i++) {
				log(`${checkLogs[y][i]['业务域英文名']}	${checkLogs[y][i]['表英文名']}		${checkLogs[y][i]['字段英文名']}`, 'redBright');
			}
		}
	}
	// 生成日志
	codeCreateTools.writeLog(checkLogs);
};

// 生成日志
codeCreateTools.writeLog = function (checkLogs) {
	let targetFile = path.resolve(__dirname, projectPath + config.buss.file + 'create.log');
	let writeStream = fs.createWriteStream(targetFile);
	let createTime = new Date().toLocaleString('chinese', {
		hour12: false,
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit'
	});
	writeStream.write(`create time: ${createTime}` + os.EOL);
	writeStream.write(os.EOL);
	writeStream.write('下列字段配置了校验规则，但form中未记录。' + os.EOL);
	for (let y = 0; y < checkLogs.length; y++) {
		if (checkLogs[y] && checkLogs[y].length > 0) {
			for (let i = 0; i < checkLogs[y].length; i++) {
				writeStream.write(`${checkLogs[y][i]['业务域英文名']}	${checkLogs[y][i]['表英文名']}		${checkLogs[y][i]['字段英文名']}` + os.EOL);
			}
		}
	}
	log(os.EOL);
	log(`生成日志：${config.buss.file}` + 'create.log');
};

// 转驼峰方法
function formatCamelNaming(str) {
	return str;
	// if (str) {
	// 	let arr = str.split('_');
	// 	for (let i = 1; i < arr.length; i++) {
	// 		arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].substring(1);
	// 	}
	// 	return arr.join('');
	// }
}

// 格式化生成代码
function formatConfigCode(inputStr, templetWords) {
	for (let t = 0; t < templetWords.length; t++) {
		inputStr = inputStr.replace(new RegExp(`"${templetWords[t]}"`, 'g'), templetWords[t]);	// 删除key两边双引号
	}
	inputStr = inputStr.replace(new RegExp('\,', 'g'), '\, ');					// 逗号后加空格
	inputStr = inputStr.replace(new RegExp('\:', 'g'), '\: ');					// 冒号后加空格	会引起时间格式化hh:mm:ss多出不必要空格
	inputStr = inputStr.replace(new RegExp('0, 0', 'g'), '0,0');				// 冒号后加空格	会引起数值格式化多出不必要空格
	inputStr = inputStr.replace(new RegExp('\"', 'g'), '\'');					// 双引号变单引号
	inputStr = inputStr.replace(new RegExp('{', 'g'), '{ ');					// 左大括号号后加空格
	inputStr = inputStr.replace(new RegExp('\'function', 'g'), 'function');		// function 前
	inputStr = inputStr.replace(new RegExp('}\'', 'g'), '}');					// function 后
	inputStr = inputStr.replace(new RegExp('hh: ', 'g'), 'hh:');				// hh: mm: ss	去空格
	inputStr = inputStr.replace(new RegExp('HH: ', 'g'), 'hh:');				// HH: mm: ss	去空格
	inputStr = inputStr.replace(new RegExp('mm: ', 'g'), 'mm:');				// hh: mm: ss	去空格
	inputStr = inputStr.replace(new RegExp('layout: \'{ label: ', 'g'), 'layout: \{ label: ');	// layout: '{ label
	inputStr = inputStr.replace(new RegExp('o: \'{ label: ', 'g'), 'o: \{ label: ');	// layout: '{ label
	inputStr = inputStr.replace(new RegExp('\'customerFormatStart_', 'g'), '');
	inputStr = inputStr.replace(new RegExp('_customerFormatEnd\'', 'g'), '');
	inputStr = inputStr.replace(new RegExp('input:  {', 'g'), 'input: {');
	inputStr = inputStr.replace(new RegExp('}}}', 'g'), ' } }}');
	inputStr = inputStr.replace(new RegExp('};', 'g'), ' };');
	inputStr = inputStr.replace(new RegExp('\'}', 'g'), '\' }');
	inputStr = inputStr.replace(new RegExp('}},', 'g'), ' } },');
	inputStr = inputStr.replace(new RegExp('[)]}', 'g'), ') }');
	inputStr = inputStr.replace(new RegExp('\'&', 'g'), '');
	inputStr = inputStr.replace(new RegExp('&\'', 'g'), '');
	return inputStr;
}

// 递归创建目录 同步方法
function mkdirsSync(dirname) {
	if (fs.existsSync(dirname)) {
		return true;
	} else {
		if (mkdirsSync(path.dirname(dirname))) {
			fs.mkdirSync(dirname);
			return true;
		}
	}
}

// 判断Excel文档单元格中的内容不为空或
function isNotNull(str) {
	if (str && str != '/') {
		return true;
	} else {
		return false;
	}
}

// 提示信息
function log(info, color, bgColor) {
	if (chalk) {
		let chalkColor = color ? color : 'greenBright';
		let chalkBgColor = bgColor ? bgColor : 'bgBlack';
		console.log(chalk[chalkColor][chalkBgColor](info));
	} else {
		console.log(info);
	}
}

// 修正列宽
function modifyColWidth(cols, formatArr) {
	let tmpFormatArr = formatArr.replace(new RegExp(',"', 'g'), '"');
	if (tmpFormatArr === 'yyyy-mm-dd') {
		cols.width = 120;
		if (cols.title == '出口（开具）日期') {
			cols.width = 140;
		} else if (cols.title == '出口发票开具日期') {
			cols.width = 150;
		} else if (cols.title == '清算账单出具日期') {
			cols.width = 150;
		}
		else if (cols.title == '合同约定全部收汇最终日期') {
			cols.width = 220;
		}
		else if (cols.title == '报关单上的申报日期') {
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
		if (cols.title.indexOf('收款凭证总金额（美元）') > -1) {
			cols.width = 170;
		} else if (cols.title.indexOf('营业收入人民币金额') > -1 || cols.title.indexOf('收款凭证美元总金额') > -1) {
			cols.width = 180;
		} else if (cols.title.indexOf('合同总金额折人民币') > -1) {
			cols.width = 150;
		} else if (cols.title.indexOf('本期确认应税服务营业收入人民币金额') > -1) {
			cols.width = 150;
		} else if (cols.title.indexOf('跨境应税行为营业额免抵退税计税金额') > -1) {
			cols.width = 150;
		} else if (cols.title.indexOf('跨境应税行为免抵退税计税金额乘征退税率之差') > -1 ||  cols.title.indexOf('不得免征和抵扣税额') > -1
		|| cols.title.indexOf('出口报关单人民币离岸价') > -1
		) {
			cols.width = 180;
		}else if (cols.title.indexOf('出口销售人民币金额') > -1
		|| cols.title.indexOf('出口收汇人民币金额') > -1
		|| cols.title.indexOf('视同收汇人民币金额') > -1
		|| cols.title.indexOf('出口发票美元离岸价') > -1
		|| cols.title.indexOf('出口发票人民币离岸价') > -1
		|| cols.title.indexOf('出口报关单美元离岸价') > -1
		|| cols.title.indexOf('人民币离岸价差异额') > -1
		) {
			cols.width = 160;
		}else if (cols.title.indexOf('进料加工保税进口料件组成计税价格') > -1 || cols.title.indexOf('国内购进免税原材料价格') > -1
		|| cols.title.indexOf('视同收汇人民币金额') > -1

		) {
			cols.width = 240;
		}

	} else if (tmpFormatArr === '0,0.0000') {
		// 示例：数量、申报数量、法定数量、第二数量、剩余数量、出口数量、成交数量、法定单位数量
		// 第二单位数、成交剩余数量
		cols.width = 140;
		if (cols.title.indexOf('调整前（报关单上的）退税率') > -1) {
			cols.width = 240;
		}
	} else if (tmpFormatArr === '0,0.00000') {
		// 示例：征税率、退税率
		cols.width = 100;
		if (cols.title.indexOf('出口销售币种汇率') > -1
		|| cols.title.indexOf('人民币离岸价差异率') > -1

		) {
			cols.width = 240;
		}
	} else if (tmpFormatArr === '0,0') {
		// 示例：条数
		cols.width = 100;
	} else if (cols.title.indexOf('名称') > -1
		|| cols.title.indexOf('备注') > -1
		|| cols.title.indexOf('用途') > -1
		|| cols.title.indexOf('原因') > -1
		|| cols.title.indexOf('境外单位') > -1
		|| cols.title.indexOf('制度建设情况') > -1
		|| cols.title.indexOf('风险系统情况') > -1
		|| cols.title.indexOf('风评标准及方法') > -1
		|| cols.title.indexOf('机构及人员情况') > -1
		|| cols.title.indexOf('附送材料清单') > -1
		|| cols.title.indexOf('附送材料清单') > -1
		|| cols.title.indexOf('合同协议号') > -1) {
		cols.width = 180;
		cols.ellipsis = true;
		if (cols.title == '调整前（报关单上的）商品名称' || cols.title.indexOf('付款单位所在国家（地区）名称') > -1 ) {
			cols.width = 240;
		}
		if (cols.title == '海关总署认证企业类型名称') {
			cols.width = 240;
		}
	} else if (cols.title.indexOf('发票号码') > -1
		|| cols.title.indexOf('出口发票号') > -1) {
		cols.width = 150;
		cols.ellipsis = true;
	} else if (cols.title.indexOf('收入凭证号') > -1
		|| cols.title.indexOf('进货凭证号') > -1) {
		cols.width = 150;
		cols.ellipsis = true;
	} else if (cols.title.indexOf('发票代码') > -1) {
		cols.width = 130;
	} else if (cols.title.indexOf('报关单号') > -1) {
		cols.width = 180;
	} else if (cols.title.indexOf('专用发票号码') > -1) {
		cols.width = 150;
		cols.ellipsis = true;
	} else if (cols.title.indexOf('纳税人识别号') > -1
		|| cols.title.indexOf('委托企业税号') > -1
		|| cols.title.indexOf('加工企业税号') > -1
		|| cols.title.indexOf('纳税号') > -1) {
		cols.width = 200;
	} else if (cols.title == '序号') {
		cols.width = 80;
	} else if (cols.title == '项号'
		|| cols.title == '行号') {
		cols.width = 60;
	} else if (cols.title == '出口计量单位') {
		cols.width = 100;
	} else if (cols.title == '所属期'
		|| cols.title.indexOf('单位') > -1
		|| cols.title == '申报批次') {
		cols.width = 90;
		if (cols.title.indexOf('付款单位所在国家（地区）代码') > -1) {
			cols.width = 220;
		}
	} else if (cols.title == '计量单位') {
		cols.width = 90;
		cols.ellipsis = true;
	} else if (cols.title == '信息状态'
		|| cols.title == '开具状态'
		|| cols.title == '退税状态'
		|| cols.title == '发票状态'
		|| cols.title == '使用状态') {
		cols.width = 120;
	} else if (cols.title.indexOf('生产场所情况') > -1
		|| cols.title.indexOf('生产设备情况') > -1
		|| cols.title.indexOf('产能情况') > -1
		|| cols.title.indexOf('员工情况') > -1
		|| cols.title.indexOf('资金流情况') > -1
		|| cols.title.indexOf('附送材料及清单') > -1) {
		cols.width = 180;
		cols.ellipsis = true;
	} else if (cols.title.indexOf('合同号') >-1  || cols.title.indexOf('材料种类') >-1 ) {
		cols.ellipsis = true;
	} else if (cols.title == '手（账）册号') {
		cols.ellipsis = true;
	} else if (cols.title == '出口货物销售额币种') {
		cols.width = 150;
	} else if (cols.title == '缴款书号码') {
		cols.ellipsis = true;
	}

}

/**
 * 格式化json
 */
function formatJson(json, options) {
	let reg = null,
		formatted = '',
		pad = 0,
		PADDING = '    '; // one can also use '\t' or a different number of spaces
	// optional settings
	options = options || {};
	// remove newline where '{' or '[' follows ':'
	options.newlineAfterColonIfBeforeBraceOrBracket = (options.newlineAfterColonIfBeforeBraceOrBracket === true);
	// use a space after a colon
	options.spaceAfterColon = options.spaceAfterColon !== false;

	// begin formatting...

	// make sure we start with the JSON as a string
	if (typeof json !== 'string') {
		json = JSON.stringify(json);
	}
	// parse and stringify in order to remove extra whitespace
	json = JSON.parse(json);
	json = JSON.stringify(json);

	// add newline before and after curly braces
	reg = /([\{\}])/g;
	json = json.replace(reg, '\r\n$1\r\n');

	// add newline before and after square brackets
	reg = /([\[\]])/g;
	json = json.replace(reg, '\r\n$1\r\n');

	// add newline after comma
	reg = /(\,)/g;
	json = json.replace(reg, '$1\r\n');

	// remove multiple newlines
	reg = /(\r\n\r\n)/g;
	json = json.replace(reg, '\r\n');

	// remove newlines before commas
	reg = /\r\n\,/g;
	json = json.replace(reg, ',');

	// optional formatting...
	if (!options.newlineAfterColonIfBeforeBraceOrBracket) {
		reg = /\:\r\n\{/g;
		json = json.replace(reg, ':{');
		reg = /\:\r\n\[/g;
		json = json.replace(reg, ':[');
	}
	if (options.spaceAfterColon) {
		reg = /\:/g;
		json = json.replace(reg, ': ');
	}
	let each = function (obj, callback) {
		if ('length' in obj) {
			for (let i = 0; i < obj.length; i++) {
				let item = obj[i];
				let res = callback && callback.call(item, i, item);
				if (res === false) {
					break;
				}
			}
		} else {
			for (let key in obj) {
				if (obj.hasOwnProperty(key)) {
					let value = obj[key];
					let res = callback && callback.call(value, key, value);
					if (res === false) {
						break;
					}
				}
			}
		}
	};
	each(json.split('\r\n'), function (index, node) {
		let i = 0,
			indent = 0,
			padding = '';

		if (node.match(/\{$/) || node.match(/\[$/)) {
			indent = 1;
		} else if (node.match(/\}/) || node.match(/\]/)) {
			if (pad !== 0) {
				pad -= 1;
			}
		} else {
			indent = 0;
		}

		for (i = 0; i < pad; i++) {
			padding += PADDING;
		}
		formatted += padding + node + '\r\n';
		pad += indent;
	});
	return formatted;
}

/**
 * 获取Excel生成用对象
 */
function getSheetData(config) {
	// console.time('a计时器1');
	let workbook = xlsx.readFile(inFilePath); // 获取xlsx文档对象
	// console.timeEnd('a计时器1');
	// console.time('a计时器2');
	let sheetNames = workbook.SheetNames; // 获取表名
	// console.timeEnd('a计时器2');
	// console.time('a计时器3');
	let sheet = workbook.Sheets[sheetNames[config.sheetIndex]]; // 通过表名获取表对象
	// console.timeEnd('a计时器3');

	// console.time('a计时器4');
	let aa = xlsx.utils.sheet_to_json(sheet);
	// console.timeEnd('a计时器4');
	// console.time('a计时器5');
	let bb = fs.createWriteStream((__dirname, projectPath + config.file));
	// console.timeEnd('a计时器5');
	return {
		data: aa, // 表对象转json
		writeStream: bb
	};
}

// 生成文件
codeCreateTools.buss();