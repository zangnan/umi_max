import { UtilDocData } from '../types';

export const utilDocData: UtilDocData = {
  title: 'DDAssist 工具库',
  version: '1.0.0',
  lastUpdated: '2025-12-26',
  description:
    '基于 UmiJS Max 的常用工具函数集合，提供文字处理、日期处理、本地存储和树形结构操作等功能，帮助开发者快速构建应用。',
  installTip: {
    npm: 'npm install ddit --save',
    yarn: 'yarn add ddit',
  },
  modules: [
    {
      type: 'text',
      name: '文字处理',
      description:
        '提供字符串格式化、数字处理、驼峰下划线转换等文字相关工具函数，依赖 numeral 库进行数字格式化。',
      dependencyTip: '依赖 numeral 库进行数字格式化',
      methods: [
        {
          name: 'formatNum',
          cnName: '数字格式化',
          signature:
            'myUtil.text.formatNum(value: number | string, format?: string): string | number',
          description:
            '使用 Numeral.js 对数字进行格式化，支持千分位、百分比、货币等多种格式，负数会自动处理符号位置。',
          module: 'text',
          features: ['STABLE'],
          params: [
            {
              name: 'value',
              type: 'number | string',
              required: true,
              description: '要格式化的数字值',
            },
            {
              name: 'format',
              type: 'string',
              required: false,
              description: '格式字符串，如 "0,0.00"',
            },
          ],
          returns: {
            type: 'string | number',
            description: '格式化后的字符串，转换失败返回原值',
          },
          examples: [
            {
              title: '千分位格式化',
              input: "myUtil.text.formatNum(1234567, '0,0.00')",
              output: '"1,234,567.00"',
            },
            {
              title: '百分比格式',
              input: "myUtil.text.formatNum(0.875, '0.00%')",
              output: '"87.50%"',
            },
            {
              title: '货币格式',
              input: "myUtil.text.formatNum(1234.5, '$0,0.00')",
              output: '"$1,234.50"',
            },
            {
              title: '负数处理',
              input: "myUtil.text.formatNum(-1234.5, '0,0.00')",
              output: '"-1,234.50"',
            },
          ],
          notes: ['format 为空时返回原值', '负数会自动处理符号位置'],
          dependencies: ['numeral'],
        },
        {
          name: 'getNumVal',
          cnName: '获取数值',
          signature:
            'myUtil.text.getNumVal(value: number | string): number | string',
          description: '使用 Numeral.js 获取数值，转换失败返回空字符串。',
          module: 'text',
          features: ['STABLE'],
          params: [
            {
              name: 'value',
              type: 'number | string',
              required: true,
              description: '要处理的数值',
            },
          ],
          returns: {
            type: 'number | string',
            description: '数值类型的值，转换失败返回空字符串',
          },
          examples: [
            {
              title: '正常转换',
              input: "myUtil.text.getNumVal('123abc')",
              output: '123',
            },
            {
              title: '转换失败',
              input: "myUtil.text.getNumVal('abc')",
              output: '""',
            },
            {
              title: 'null 值',
              input: 'myUtil.text.getNumVal(null)',
              output: '""',
            },
          ],
          notes: ['null 和 undefined 返回空字符串', '非数字字符串返回空字符串'],
        },
        {
          name: 'leadingZeroize',
          cnName: '补零处理',
          signature:
            'myUtil.text.leadingZeroize(value: string | number, digit: number): string',
          description: '将字符串或数字补零到指定长度，超出部分会被截取。',
          module: 'text',
          features: ['STABLE'],
          params: [
            {
              name: 'value',
              type: 'string | number',
              required: true,
              description: '需要转换的值',
            },
            {
              name: 'digit',
              type: 'number',
              required: true,
              description: '补零后的总长度',
            },
          ],
          returns: { type: 'string', description: '转换后的字符串' },
          examples: [
            {
              title: '补零',
              input: 'myUtil.text.leadingZeroize(5, 3)',
              output: '"005"',
            },
            {
              title: '自动截取',
              input: 'myUtil.text.leadingZeroize(12345, 3)',
              output: '"345"',
            },
            {
              title: '字符串补零',
              input: "myUtil.text.leadingZeroize('9', 4)",
              output: '"0009"',
            },
          ],
          notes: ['超出 digit 长度的部分会被截取'],
        },
        {
          name: 'toUpper',
          cnName: '转大写',
          signature: 'myUtil.text.toUpper(value?: string): string | undefined',
          description: '将字符串转换为大写，undefined 时返回 undefined。',
          module: 'text',
          features: ['STABLE'],
          params: [
            {
              name: 'value',
              type: 'string',
              required: false,
              description: '需要转换的字符串',
            },
          ],
          returns: {
            type: 'string | undefined',
            description: '转换后的大写字符串，undefined 输入返回 undefined',
          },
          examples: [
            {
              title: '正常转换',
              input: "myUtil.text.toUpper('hello')",
              output: '"HELLO"',
            },
            {
              title: 'undefined 输入',
              input: 'myUtil.text.toUpper(undefined)',
              output: 'undefined',
            },
          ],
        },
        {
          name: 'toLower',
          cnName: '转小写',
          signature: 'myUtil.text.toLower(value?: string): string | undefined',
          description: '将字符串转换为小写，undefined 时返回 undefined。',
          module: 'text',
          features: ['STABLE'],
          params: [
            {
              name: 'value',
              type: 'string',
              required: false,
              description: '需要转换的字符串',
            },
          ],
          returns: {
            type: 'string | undefined',
            description: '转换后的小写字符串，undefined 输入返回 undefined',
          },
          examples: [
            {
              title: '正常转换',
              input: "myUtil.text.toLower('HELLO')",
              output: '"hello"',
            },
            {
              title: 'undefined 输入',
              input: 'myUtil.text.toLower(undefined)',
              output: 'undefined',
            },
          ],
        },
        {
          name: 'arrayToStr',
          cnName: '数组转字符串',
          signature:
            'myUtil.text.arrayToStr(value: any[] = [], separator?: string): string',
          description: '将数组转换为字符串，默认使用逗号分隔。',
          module: 'text',
          features: ['STABLE'],
          params: [
            {
              name: 'value',
              type: 'any[]',
              required: false,
              default: '[]',
              description: '需要转换的数组',
            },
            {
              name: 'separator',
              type: 'string',
              required: false,
              default: '","',
              description: '分隔符',
            },
          ],
          returns: { type: 'string', description: '转换后的字符串' },
          examples: [
            {
              title: '默认分隔符',
              input: "myUtil.text.arrayToStr(['a', 'b', 'c'])",
              output: '"a,b,c"',
            },
            {
              title: '自定义分隔符',
              input: "myUtil.text.arrayToStr(['a', 'b', 'c'], '-')",
              output: '"a-b-c"',
            },
          ],
        },
        {
          name: 'uuid',
          cnName: '生成唯一标识',
          signature: 'myUtil.text.uuid(len?: number, radix?: number): string',
          description: '生成唯一标识符，支持指定长度或生成标准 UUID 格式。',
          module: 'text',
          features: ['STABLE'],
          params: [
            {
              name: 'len',
              type: 'number',
              required: false,
              description: '生成 uuid 的长度，不传则生成标准格式',
            },
            {
              name: 'radix',
              type: 'number',
              required: false,
              description: '选取基数的位数（0-62），默认使用所有字符',
            },
          ],
          returns: { type: 'string', description: 'uuid 字符串' },
          examples: [
            {
              title: '标准 UUID',
              input: 'myUtil.text.uuid()',
              output: '"e5e9d8c2-b4a3-4f1c-9a8d-7e5f3d2c1b0a"',
            },
            {
              title: '指定长度',
              input: 'myUtil.text.uuid(8)',
              output: '"a1b2c3d4"',
            },
            {
              title: '指定长度',
              input: 'myUtil.text.uuid(10,10)',
              output: '"9596988298"',
            },
          ],
        },
        {
          name: 'formatReplace',
          cnName: '占位符替换',
          signature:
            'myUtil.text.formatReplace(str: string, values: Record<string, any>): string',
          description: '替换字符串中的 {{key}} 占位符，只替换有值的键。',
          module: 'text',
          features: ['STABLE'],
          params: [
            {
              name: 'str',
              type: 'string',
              required: true,
              description: '原字符串',
            },
            {
              name: 'values',
              type: 'Record<string, any>',
              required: true,
              description: '替换的键值对',
            },
          ],
          returns: { type: 'string', description: '替换后的字符串' },
          examples: [
            {
              title: '基本替换',
              input:
                "myUtil.text.formatReplace('Hello {{name}}, your score is {{score}}', { name: 'John', score: 100 })",
              output: '"Hello John, your score is 100"',
            },
            {
              title: '忽略空值',
              input:
                "myUtil.text.formatReplace('Hello {{name}}', { name: '' })",
              output: '"Hello {{name}}"',
            },
          ],
          notes: ['空值、null、undefined 的键不会被替换'],
        },
        {
          name: 'formatNumRound',
          cnName: '四舍五入',
          signature:
            'myUtil.text.formatNumRound(num: number, precision = 0): number | undefined',
          description: '将数值四舍五入并保留指定位数的小数。',
          module: 'text',
          features: ['STABLE'],
          params: [
            {
              name: 'num',
              type: 'number',
              required: true,
              description: '要格式化的数字值',
            },
            {
              name: 'precision',
              type: 'number',
              required: false,
              default: '0',
              description: '保留的小数位数',
            },
          ],
          returns: {
            type: 'number | undefined',
            description: '转换后的数值，null/undefined 输入返回 undefined',
          },
          examples: [
            {
              title: '保留整数',
              input: 'myUtil.text.formatNumRound(3.6)',
              output: '4',
            },
            {
              title: '保留两位小数',
              input: 'myUtil.text.formatNumRound(3.14159, 2)',
              output: '3.14',
            },
          ],
        },
        {
          name: 'lowerFirstLetter',
          cnName: '首字母小写',
          signature: 'myUtil.text.lowerFirstLetter(value: string): string',
          description: '将字符串的首字母转换为小写。',
          module: 'text',
          features: ['STABLE'],
          params: [
            {
              name: 'value',
              type: 'string',
              required: true,
              description: '需要转换的字符串',
            },
          ],
          returns: { type: 'string', description: '转换后的字符串' },
          examples: [
            {
              title: '首字母大写',
              input: "myUtil.text.lowerFirstLetter('Hello')",
              output: '"hello"',
            },
            {
              title: '首字母小写',
              input: "myUtil.text.lowerFirstLetter('hello')",
              output: '"hello"',
            },
          ],
        },
        {
          name: 'camelToUnderscore',
          cnName: '驼峰转下划线',
          signature: 'myUtil.text.camelToUnderscore(str: string): string',
          description: '将驼峰命名法的字符串转换为下划线命名法。',
          module: 'text',
          features: ['STABLE'],
          params: [
            {
              name: 'str',
              type: 'string',
              required: true,
              description: '需要转换的字符串',
            },
          ],
          returns: { type: 'string', description: '转换后的字符串' },
          examples: [
            {
              title: '基本转换',
              input: "myUtil.text.camelToUnderscore('helloWorld')",
              output: '"hello_world"',
            },
            {
              title: '多个大写',
              input: "myUtil.text.camelToUnderscore('XMLHttpRequest')",
              output: '"x_m_l_http_request"',
            },
          ],
        },
        {
          name: 'camelToUnderscoreObj',
          cnName: '对象 Key 驼峰转下划线',
          signature:
            'myUtil.text.camelToUnderscoreObj(param: Record<string, any>): Record<string, any>',
          description: '将对象的所有 key 从驼峰命名法转换为下划线命名法。',
          module: 'text',
          features: ['STABLE'],
          params: [
            {
              name: 'param',
              type: 'Record<string, any>',
              required: true,
              description: '需要转换的对象',
            },
          ],
          returns: { type: 'Record<string, any>', description: '转换后的对象' },
          examples: [
            {
              title: '对象转换',
              input:
                "myUtil.text.camelToUnderscoreObj({ userName: 'John', userAge: 25 })",
              output: '{ user_name: "John", user_age: 25 }',
            },
          ],
        },
        {
          name: 'camelToUnderscoreArray',
          cnName: '数组对象驼峰转下划线',
          signature:
            'myUtil.text.camelToUnderscoreArray(param: Record<string, any>[] = []): Record<string, any>[]',
          description:
            '将数组中所有对象的 key 从驼峰命名法转换为下划线命名法。',
          module: 'text',
          features: ['STABLE'],
          params: [
            {
              name: 'param',
              type: 'Record<string, any>[]',
              required: false,
              default: '[]',
              description: '需要转换的数组',
            },
          ],
          returns: {
            type: 'Record<string, any>[]',
            description: '转换后的数组',
          },
          examples: [
            {
              title: '数组转换',
              input:
                "myUtil.text.camelToUnderscoreArray([{ userName: 'John' }, { userName: 'Jane' }])",
              output: '[{ user_name: "John" }, { user_name: "Jane" }]',
            },
          ],
        },
        {
          name: 'underscoreToCamel',
          cnName: '下划线转驼峰',
          signature: 'myUtil.text.underscoreToCamel(str: string): string',
          description: '将下划线命名法的字符串转换为驼峰命名法。',
          module: 'text',
          features: ['STABLE'],
          params: [
            {
              name: 'str',
              type: 'string',
              required: true,
              description: '需要转换的字符串',
            },
          ],
          returns: { type: 'string', description: '转换后的字符串' },
          examples: [
            {
              title: '基本转换',
              input: "myUtil.text.underscoreToCamel('hello_world')",
              output: '"helloWorld"',
            },
          ],
        },
        {
          name: 'underscoreToCamelObjValue',
          cnName: '对象值下划线转驼峰',
          signature:
            'myUtil.text.underscoreToCamelObjValue(param: Record<string, any>, targetKeys: string[]): Record<string, any>',
          description:
            '将对象指定 key 的属性值从下划线命名法转换为驼峰命名法。',
          module: 'text',
          features: ['STABLE'],
          params: [
            {
              name: 'param',
              type: 'Record<string, any>',
              required: true,
              description: '需要转换的对象',
            },
            {
              name: 'targetKeys',
              type: 'string[]',
              required: true,
              description: '需要转换的 key 数组',
            },
          ],
          returns: { type: 'Record<string, any>', description: '转换后的对象' },
          examples: [
            {
              title: '指定 key 转换',
              input:
                "myUtil.text.underscoreToCamelObjValue({ user_name: 'john_doe', age: 25 }, ['user_name'])",
              output: '{ userName: "john_doe", age: 25 }',
            },
          ],
        },
        {
          name: 'underscoreToCamelObjKey',
          cnName: '对象 Key 下划线转驼峰',
          signature:
            'myUtil.text.underscoreToCamelObjKey(param: Record<string, any>, targetKeys: string[]): Record<string, any>',
          description: '将对象指定的 key 从下划线命名法转换为驼峰命名法。',
          module: 'text',
          features: ['STABLE'],
          params: [
            {
              name: 'param',
              type: 'Record<string, any>',
              required: true,
              description: '需要转换的对象',
            },
            {
              name: 'targetKeys',
              type: 'string[]',
              required: true,
              description: '需要转换的 key 数组',
            },
          ],
          returns: { type: 'Record<string, any>', description: '转换后的对象' },
          examples: [
            {
              title: '指定 key 转换',
              input:
                "myUtil.text.underscoreToCamelObjKey({ user_name: 'John', age: 25 }, ['user_name'])",
              output: '{ userName: "John", age: 25 }',
            },
          ],
        },
        {
          name: 'underscoreToCamelArrayValue',
          cnName: '数组对象值下划线转驼峰',
          signature:
            'myUtil.text.underscoreToCamelArrayValue(param: Record<string, any>[], targetKeys: string[]): Record<string, any>[]',
          description:
            '将数组中对象指定 key 的属性值从下划线命名法转换为驼峰命名法。',
          module: 'text',
          features: ['STABLE'],
          params: [
            {
              name: 'param',
              type: 'Record<string, any>[]',
              required: true,
              description: '需要转换的数组',
            },
            {
              name: 'targetKeys',
              type: 'string[]',
              required: true,
              description: '需要转换的 key 数组',
            },
          ],
          returns: {
            type: 'Record<string, any>[]',
            description: '转换后的数组',
          },
          examples: [
            {
              title: '数组转换',
              input:
                "myUtil.text.underscoreToCamelArrayValue([{ user_name: 'jo_hn' }], ['user_name'])",
              output: '[{ userName: "joHn" }]',
            },
          ],
        },
        {
          name: 'underscoreToCamelArrayKey',
          cnName: '数组对象 Key 下划线转驼峰',
          signature:
            'myUtil.text.underscoreToCamelArrayKey(param: Record<string, any>[], targetKeys: string[]): Record<string, any>[]',
          description:
            '将数组中对象指定的 key 从下划线命名法转换为驼峰命名法。',
          module: 'text',
          features: ['STABLE'],
          params: [
            {
              name: 'param',
              type: 'Record<string, any>[]',
              required: true,
              description: '需要转换的数组',
            },
            {
              name: 'targetKeys',
              type: 'string[]',
              required: true,
              description: '需要转换的 key 数组',
            },
          ],
          returns: {
            type: 'Record<string, any>[]',
            description: '转换后的数组',
          },
          examples: [
            {
              title: '数组转换',
              input:
                "myUtil.text.underscoreToCamelArrayKey([{ user_name: 'John' }], ['user_name'])",
              output: '[{ userName: "John" }]',
            },
          ],
        },
        {
          name: 'parseBraces',
          cnName: '提取花括号内容',
          signature: 'myUtil.text.parseBraces(str: string): string[]',
          description: '提取字符串中所有 {} 花括号内的内容，返回字符串数组。',
          module: 'text',
          features: ['STABLE'],
          params: [
            {
              name: 'str',
              type: 'string',
              required: true,
              description: '需要解析的字符串',
            },
          ],
          returns: { type: 'string[]', description: '花括号内的内容数组' },
          examples: [
            {
              title: '提取内容',
              input: "myUtil.text.parseBraces('Hello {name}, {age} years old')",
              output: '["name", "age"]',
            },
          ],
        },
        {
          name: 'generateRandomNumber',
          cnName: '生成随机数',
          signature: 'myUtil.text.generateRandomNumber(length: number): number',
          description: '生成长度为指定数值的随机数。',
          module: 'text',
          features: ['STABLE'],
          params: [
            {
              name: 'length',
              type: 'number',
              required: true,
              description: '随机数的长度',
            },
          ],
          returns: { type: 'number', description: '随机数' },
          examples: [
            {
              title: '3位随机数',
              input: 'myUtil.text.generateRandomNumber(3)',
              output: '范围 100-999',
            },
            {
              title: '6位随机数',
              input: 'myUtil.text.generateRandomNumber(6)',
              output: '范围 100000-999999',
            },
          ],
        },
        {
          name: 'cleanNullObject',
          cnName: '过滤空值',
          signature: 'myUtil.text.cleanNullObject(obj: any): any',
          description:
            '递归过滤对象中的空值（null、undefined、空字符串、空数组、空对象）。',
          module: 'text',
          features: ['STABLE'],
          params: [
            {
              name: 'obj',
              type: 'any',
              required: true,
              description: '要处理的对象',
            },
          ],
          returns: { type: 'any', description: '清理后的对象' },
          examples: [
            {
              title: '过滤空值',
              input:
                "myUtil.text.cleanNullObject({ a: 1, b: null, c: '', d: [] })",
              output: '{ a: 1 }',
            },
            {
              title: '嵌套对象',
              input:
                'myUtil.text.cleanNullObject({ a: 1, b: { c: 2, d: null } })',
              output: '{ a: 1, b: { c: 2 } }',
            },
          ],
          notes: ['会递归处理嵌套对象和数组'],
        },
      ],
    },
    {
      type: 'date',
      name: '日期处理',
      description:
        '提供日期格式化、日期范围计算、随机日期生成等功能，基于 dayjs 库实现。',
      dependencyTip: '依赖 dayjs 库和 quarterOfYear 插件',
      methods: [
        {
          name: 'formatDate',
          cnName: '日期格式化',
          signature:
            'myUtil.date.formatDate(date: string | number | Date, format?: string): string',
          description: '将日期格式化为指定格式的字符串。',
          module: 'date',
          features: ['STABLE'],
          params: [
            {
              name: 'date',
              type: 'string | number | Date',
              required: true,
              description: '要格式化的日期',
            },
            {
              name: 'format',
              type: 'string',
              required: false,
              description: '格式字符串，如 "YYYY-MM-DD"',
            },
          ],
          returns: {
            type: 'string',
            description: '格式化后的日期字符串，date 为空时返回空字符串',
          },
          examples: [
            {
              title: '默认格式',
              input: 'myUtil.date.formatDate(new Date(2025, 0, 1))',
              output: '"2025-01-01"',
            },
            {
              title: '自定义格式',
              input: "myUtil.date.formatDate(new Date(), 'YYYY年MM月DD日')",
              output: '"2025年12月26日"',
            },
            {
              title: '时间戳',
              input: 'myUtil.date.formatDate(1704067200000)',
              output: '"2025-01-01"',
            },
          ],
        },
        {
          name: 'getLastWeek',
          cnName: '上周日期范围',
          signature: 'myUtil.date.getLastWeek(): DateRangeResult',
          description: '获取上周的起始日期和结束日期。',
          module: 'date',
          features: ['STABLE'],
          params: [],
          returns: {
            type: 'DateRangeResult',
            description: '上周的日期范围对象',
          },
          examples: [
            {
              title: '获取上周',
              input: 'myUtil.date.getLastWeek()',
              output:
                '{ start: "2025-12-16 00:00:00", end: "2025-12-22 23:59:59", dayjsFormat: [...] }',
            },
          ],
        },
        {
          name: 'getCurrentWeek',
          cnName: '本周日期范围',
          signature: 'myUtil.date.getCurrentWeek(): DateRangeResult',
          description: '获取本周的起始日期和结束日期。',
          module: 'date',
          features: ['STABLE'],
          params: [],
          returns: {
            type: 'DateRangeResult',
            description: '本周的日期范围对象',
          },
          examples: [
            {
              title: '获取本周',
              input: 'myUtil.date.getCurrentWeek()',
              output:
                '{ start: "2025-12-23 00:00:00", end: "2025-12-29 23:59:59", dayjsFormat: [...] }',
            },
          ],
        },
        {
          name: 'getNextWeek',
          cnName: '下周日期范围',
          signature: 'myUtil.date.getNextWeek(): DateRangeResult',
          description: '获取下周的起始日期和结束日期。',
          module: 'date',
          features: ['STABLE'],
          params: [],
          returns: {
            type: 'DateRangeResult',
            description: '下周的日期范围对象',
          },
          examples: [
            {
              title: '获取下周',
              input: 'myUtil.date.getNextWeek()',
              output:
                '{ start: "2025-12-30 00:00:00", end: "2026-01-05 23:59:59", dayjsFormat: [...] }',
            },
          ],
        },
        {
          name: 'getLastMonth',
          cnName: '上月日期范围',
          signature: 'myUtil.date.getLastMonth(): DateRangeResult',
          description: '获取上月的起始日期和结束日期。',
          module: 'date',
          features: ['STABLE'],
          params: [],
          returns: {
            type: 'DateRangeResult',
            description: '上月的日期范围对象',
          },
          examples: [
            {
              title: '获取上月',
              input: 'myUtil.date.getLastMonth()',
              output:
                '{ start: "2025-11-01 00:00:00", end: "2025-11-30 23:59:59", dayjsFormat: [...] }',
            },
          ],
        },
        {
          name: 'getCurrentMonth',
          cnName: '本月日期范围',
          signature: 'myUtil.date.getCurrentMonth(): DateRangeResult',
          description: '获取本月的起始日期和结束日期。',
          module: 'date',
          features: ['STABLE'],
          params: [],
          returns: {
            type: 'DateRangeResult',
            description: '本月的日期范围对象',
          },
          examples: [
            {
              title: '获取本月',
              input: 'myUtil.date.getCurrentMonth()',
              output:
                '{ start: "2025-12-01 00:00:00", end: "2025-12-31 23:59:59", dayjsFormat: [...] }',
            },
          ],
        },
        {
          name: 'getNextMonth',
          cnName: '下月日期范围',
          signature: 'myUtil.date.getNextMonth(): DateRangeResult',
          description: '获取下月的起始日期和结束日期。',
          module: 'date',
          features: ['STABLE'],
          params: [],
          returns: {
            type: 'DateRangeResult',
            description: '下月的日期范围对象',
          },
          examples: [
            {
              title: '获取下月',
              input: 'myUtil.date.getNextMonth()',
              output:
                '{ start: "2026-01-01 00:00:00", end: "2026-01-31 23:59:59", dayjsFormat: [...] }',
            },
          ],
        },
        {
          name: 'getLastYear',
          cnName: '去年日期范围',
          signature: 'myUtil.date.getLastYear(): DateRangeResult',
          description: '获取去年的起始日期和结束日期。',
          module: 'date',
          features: ['STABLE'],
          params: [],
          returns: {
            type: 'DateRangeResult',
            description: '去年的日期范围对象',
          },
          examples: [
            {
              title: '获取去年',
              input: 'myUtil.date.getLastYear()',
              output:
                '{ start: "2024-01-01 00:00:00", end: "2024-12-31 23:59:59", dayjsFormat: [...] }',
            },
          ],
        },
        {
          name: 'getCurrentYear',
          cnName: '本年日期范围',
          signature: 'myUtil.date.getCurrentYear(): DateRangeResult',
          description: '获取本年的起始日期和结束日期。',
          module: 'date',
          features: ['STABLE'],
          params: [],
          returns: {
            type: 'DateRangeResult',
            description: '本年的日期范围对象',
          },
          examples: [
            {
              title: '获取本年',
              input: 'myUtil.date.getCurrentYear()',
              output:
                '{ start: "2025-01-01 00:00:00", end: "2025-12-31 23:59:59", dayjsFormat: [...] }',
            },
          ],
        },
        {
          name: 'getNextYear',
          cnName: '来年日期范围',
          signature: 'myUtil.date.getNextYear(): DateRangeResult',
          description: '获取来年的起始日期和结束日期。',
          module: 'date',
          features: ['STABLE'],
          params: [],
          returns: {
            type: 'DateRangeResult',
            description: '来年的日期范围对象',
          },
          examples: [
            {
              title: '获取来年',
              input: 'myUtil.date.getNextYear()',
              output:
                '{ start: "2026-01-01 00:00:00", end: "2026-12-31 23:59:59", dayjsFormat: [...] }',
            },
          ],
        },
        {
          name: 'getLastQuarter',
          cnName: '上季度日期范围',
          signature: 'myUtil.date.getLastQuarter(): DateRangeResult',
          description: '获取上季度的起始日期和结束日期。',
          module: 'date',
          features: ['STABLE'],
          params: [],
          returns: {
            type: 'DateRangeResult',
            description: '上季度的日期范围对象',
          },
          examples: [
            {
              title: '获取上季度',
              input: 'myUtil.date.getLastQuarter()',
              output:
                '{ start: "2025-07-01 00:00:00", end: "2025-09-30 23:59:59", dayjsFormat: [...] }',
            },
          ],
        },
        {
          name: 'getCurrentQuarter',
          cnName: '本季度日期范围',
          signature: 'myUtil.date.getCurrentQuarter(): DateRangeResult',
          description: '获取本季度的起始日期和结束日期。',
          module: 'date',
          features: ['STABLE'],
          params: [],
          returns: {
            type: 'DateRangeResult',
            description: '本季度的日期范围对象',
          },
          examples: [
            {
              title: '获取本季度',
              input: 'myUtil.date.getCurrentQuarter()',
              output:
                '{ start: "2025-10-01 00:00:00", end: "2025-12-31 23:59:59", dayjsFormat: [...] }',
            },
          ],
        },
        {
          name: 'getNextQuarter',
          cnName: '下季度日期范围',
          signature: 'myUtil.date.getNextQuarter(): DateRangeResult',
          description: '获取下季度的起始日期和结束日期。',
          module: 'date',
          features: ['STABLE'],
          params: [],
          returns: {
            type: 'DateRangeResult',
            description: '下季度的日期范围对象',
          },
          examples: [
            {
              title: '获取下季度',
              input: 'myUtil.date.getNextQuarter()',
              output:
                '{ start: "2026-01-01 00:00:00", end: "2026-03-31 23:59:59", dayjsFormat: [...] }',
            },
          ],
        },
        {
          name: 'getRecentNDay',
          cnName: '最近N天日期范围',
          signature: 'myUtil.date.getRecentNDay(days: number): DateRangeResult',
          description: '获取最近 N 天的日期范围（从 N 天前到今天）。',
          module: 'date',
          features: ['STABLE'],
          params: [
            {
              name: 'days',
              type: 'number',
              required: true,
              description: '天数',
            },
          ],
          returns: {
            type: 'DateRangeResult',
            description: '最近 N 天的日期范围对象',
          },
          examples: [
            {
              title: '最近7天',
              input: 'myUtil.date.getRecentNDay(7)',
              output:
                '{ start: "2025-12-20 00:00:00", end: "2025-12-26 23:59:59", dayjsFormat: [...] }',
            },
          ],
        },
        {
          name: 'getQZDateBeforeCurr',
          cnName: 'N年前日期范围',
          signature:
            'myUtil.date.getQZDateBeforeCurr(years: number): { firstDay: string; lastDay: string }',
          description: '获取当前时间 N 年前的第一天和最后一天。',
          module: 'date',
          features: ['STABLE'],
          params: [
            {
              name: 'years',
              type: 'number',
              required: true,
              description: '年份数',
            },
          ],
          returns: {
            type: '{ firstDay: string; lastDay: string }',
            description: 'N 年前的日期范围',
          },
          examples: [
            {
              title: '1年前',
              input: 'myUtil.date.getQZDateBeforeCurr(1)',
              output: '{ firstDay: "2024-01-01", lastDay: "2024-12-31" }',
            },
          ],
        },
        {
          name: 'generateRandomBirthday',
          cnName: '生成随机日期',
          signature: 'myUtil.date.generateRandomBirthday(): string',
          description: '生成随机日期（2020 年至今）。',
          module: 'date',
          features: ['STABLE'],
          params: [],
          returns: {
            type: 'string',
            description: '随机日期字符串（YYYY-MM-DD 格式）',
          },
          examples: [
            {
              title: '随机日期',
              input: 'myUtil.date.generateRandomBirthday()',
              output: '"2023-05-15"',
            },
          ],
        },
        {
          name: 'getRandomTimestamp',
          cnName: '生成随机时间戳',
          signature: 'myUtil.date.getRandomTimestamp(): number',
          description: '生成随机时间戳。',
          module: 'date',
          features: ['STABLE'],
          params: [],
          returns: { type: 'number', description: '随机时间戳' },
          examples: [
            {
              title: '随机时间戳',
              input: 'myUtil.date.getRandomTimestamp()',
              output: '1704067200000',
            },
          ],
        },
        {
          name: 'compareTime',
          cnName: '日期范围比较',
          signature:
            'myUtil.date.compareTime(months: number, startTime, endTime): boolean',
          description: '判断结束日期是否在开始日期的几个月范围内。',
          module: 'date',
          features: ['STABLE'],
          params: [
            {
              name: 'months',
              type: 'number',
              required: true,
              description: '月份数',
            },
            {
              name: 'startTime',
              type: 'string | number | Date',
              required: true,
              description: '开始日期',
            },
            {
              name: 'endTime',
              type: 'string | number | Date',
              required: true,
              description: '结束日期',
            },
          ],
          returns: { type: 'boolean', description: '结束日期是否在范围内' },
          examples: [
            {
              title: '在范围内',
              input: 'myUtil.date.compareTime(3, "2025-01-01", "2025-03-15")',
              output: 'true',
            },
            {
              title: '超出范围',
              input: 'myUtil.date.compareTime(3, "2025-01-01", "2025-04-01")',
              output: 'false',
            },
          ],
        },
        {
          name: 'accurateDate',
          cnName: '日期补全',
          signature:
            'myUtil.date.accurateDate(date: string | number | Date, flag: "1" | "2"): number',
          description:
            '将日期补全到秒级精度，flag=1 时为 00:00:00，flag=2 时为 23:59:59。',
          module: 'date',
          features: ['STABLE'],
          params: [
            {
              name: 'date',
              type: 'string | number | Date',
              required: true,
              description: '需要转换的日期',
            },
            {
              name: 'flag',
              type: '"1" | "2"',
              required: true,
              description: '精确标志（1：00:00:00；2：23:59:59）',
            },
          ],
          returns: { type: 'number', description: '转换后的时间戳' },
          examples: [
            {
              title: '当天开始',
              input: 'myUtil.date.accurateDate("2025-01-15", "1")',
              output: '1736851200000',
            },
            {
              title: '当天结束',
              input: 'myUtil.date.accurateDate("2025-01-15", "2")',
              output: '1736937599999',
            },
          ],
        },
        {
          name: 'formatMillisecondsToHMS',
          cnName: '毫秒转时间格式',
          signature:
            'myUtil.date.formatMillisecondsToHMS(milliseconds = 0): string',
          description: '将毫秒数格式化为 hh:mm:ss 格式。',
          module: 'date',
          features: ['STABLE'],
          params: [
            {
              name: 'milliseconds',
              type: 'number',
              required: false,
              default: '0',
              description: '毫秒数',
            },
          ],
          returns: { type: 'string', description: '格式化后的时间字符串' },
          examples: [
            {
              title: '基本转换',
              input: 'myUtil.date.formatMillisecondsToHMS(3661000)',
              output: '"01:01:01"',
            },
            {
              title: '补零显示',
              input: 'myUtil.date.formatMillisecondsToHMS(90000)',
              output: '"00:01:30"',
            },
          ],
        },
        {
          name: 'formatList',
          cnName: '日期格式列表',
          signature: 'myUtil.date.formatList(format?: string): string[]',
          description: '获取兼容的日期格式化格式列表。',
          module: 'date',
          features: ['STABLE'],
          params: [
            {
              name: 'format',
              type: 'string',
              required: false,
              description: '自定义格式',
            },
          ],
          returns: { type: 'string[]', description: '兼容的日期格式数组' },
          examples: [
            {
              title: '默认格式',
              input: 'myUtil.date.formatList()',
              output: '["YYYY-MM-DD", "YYYY-MMDD", ...]',
            },
            {
              title: '添加自定义',
              input: 'myUtil.date.formatList("YYYY/MM/DD")',
              output: '["YYYY/MM/DD", "YYYY-MM-DD", ...]',
            },
          ],
        },
        {
          name: 'convertMinutes',
          cnName: '分钟转小时分钟',
          signature: 'myUtil.date.convertMinutes(minutes: number): string',
          description: '将分钟数转换为小时:分钟格式。',
          module: 'date',
          features: ['STABLE'],
          params: [
            {
              name: 'minutes',
              type: 'number',
              required: true,
              description: '分钟数',
            },
          ],
          returns: {
            type: 'string',
            description: '小时分钟格式（如 1:30），0 或空时返回空字符串',
          },
          examples: [
            {
              title: '正常转换',
              input: 'myUtil.date.convertMinutes(90)',
              output: '"1:30"',
            },
            {
              title: '补零显示',
              input: 'myUtil.date.convertMinutes(125)',
              output: '"2:05"',
            },
          ],
        },
      ],
    },
    {
      type: 'localStore',
      name: '本地存储',
      description:
        '基于 localStorage 的数据存储操作，使用 `ddit` 前缀避免命名冲突。',
      dependencyTip: '使用 localStorage API，无外部依赖',
      methods: [
        {
          name: 'setItem',
          cnName: '设置存储',
          signature: 'myUtil.localStore.setItem(key: string, value: any): void',
          description:
            '设置 localStorage 中的键值对，数据会序列化为 JSON 存储。',
          module: 'localStore',
          features: ['STABLE'],
          params: [
            {
              name: 'key',
              type: 'string',
              required: true,
              description: '键名',
            },
            {
              name: 'value',
              type: 'any',
              required: true,
              description: '值（任意类型）',
            },
          ],
          returns: { type: 'void', description: '无返回值' },
          examples: [
            {
              title: '存储字符串',
              input: "myUtil.localStore.setItem('username', 'John')",
              output: '',
            },
            {
              title: '存储对象',
              input:
                "myUtil.localStore.setItem('user', { name: 'John', age: 25 })",
              output: '',
            },
          ],
        },
        {
          name: 'getItem',
          cnName: '获取存储',
          signature: 'myUtil.localStore.getItem(key: string): any',
          description: '从 localStorage 获取指定键的值，会自动解析 JSON。',
          module: 'localStore',
          features: ['STABLE'],
          params: [
            {
              name: 'key',
              type: 'string',
              required: true,
              description: '键名',
            },
          ],
          returns: {
            type: 'any',
            description: '存储的值，不存在时返回 undefined',
          },
          examples: [
            {
              title: '获取字符串',
              input: "myUtil.localStore.getItem('username')",
              output: '"John"',
            },
            {
              title: '获取对象',
              input: "myUtil.localStore.getItem('user')",
              output: '{ name: "John", age: 25 }',
            },
          ],
        },
        {
          name: 'getStorage',
          cnName: '获取全部存储',
          signature: 'myUtil.localStore.getStorage(): Record<string, any>',
          description: '获取 localStorage 中所有存储的数据。',
          module: 'localStore',
          features: ['STABLE'],
          params: [],
          returns: {
            type: 'Record<string, any>',
            description: '所有存储数据的对象',
          },
          examples: [
            {
              title: '获取全部',
              input: 'myUtil.localStore.getStorage()',
              output: '{ username: "John", theme: "dark" }',
            },
          ],
        },
        {
          name: 'clear',
          cnName: '删除存储',
          signature: 'myUtil.localStore.clear(key: string): void',
          description: '删除 localStorage 中指定键的数据。',
          module: 'localStore',
          features: ['STABLE'],
          params: [
            {
              name: 'key',
              type: 'string',
              required: true,
              description: '键名',
            },
          ],
          returns: { type: 'void', description: '无返回值' },
          examples: [
            {
              title: '删除',
              input: "myUtil.localStore.clear('username')",
              output: '',
            },
          ],
        },
      ],
    },
    {
      type: 'sessionStore',
      name: '会话存储',
      description:
        '基于 sessionStorage 的数据存储操作，使用 `ddit` 前缀避免命名冲突。',
      dependencyTip: '使用 sessionStorage API，无外部依赖',
      methods: [
        {
          name: 'setItem',
          cnName: '设置存储',
          signature:
            'myUtil.sessionStore.setItem(key: string, value: any): void',
          description:
            '设置 sessionStorage 中的键值对，数据会序列化为 JSON 存储。',
          module: 'sessionStore',
          features: ['STABLE'],
          params: [
            {
              name: 'key',
              type: 'string',
              required: true,
              description: '键名',
            },
            {
              name: 'value',
              type: 'any',
              required: true,
              description: '值（任意类型）',
            },
          ],
          returns: { type: 'void', description: '无返回值' },
          examples: [
            {
              title: '存储',
              input: "myUtil.sessionStore.setItem('token', 'abc123')",
              output: '',
            },
          ],
        },
        {
          name: 'getItem',
          cnName: '获取存储',
          signature: 'myUtil.sessionStore.getItem(key: string): any',
          description: '从 sessionStorage 获取指定键的值，会自动解析 JSON。',
          module: 'sessionStore',
          features: ['STABLE'],
          params: [
            {
              name: 'key',
              type: 'string',
              required: true,
              description: '键名',
            },
          ],
          returns: {
            type: 'any',
            description: '存储的值，不存在时返回 undefined',
          },
          examples: [
            {
              title: '获取',
              input: "myUtil.sessionStore.getItem('token')",
              output: '"abc123"',
            },
          ],
        },
        {
          name: 'getStorage',
          cnName: '获取全部存储',
          signature: 'myUtil.sessionStore.getStorage(): Record<string, any>',
          description: '获取 sessionStorage 中所有存储的数据。',
          module: 'sessionStore',
          features: ['STABLE'],
          params: [],
          returns: {
            type: 'Record<string, any>',
            description: '所有存储数据的对象',
          },
          examples: [
            {
              title: '获取全部',
              input: 'myUtil.sessionStore.getStorage()',
              output: '{ token: "abc123" }',
            },
          ],
        },
        {
          name: 'clear',
          cnName: '删除存储',
          signature: 'myUtil.sessionStore.clear(key: string): void',
          description: '删除 sessionStorage 中指定键的数据。',
          module: 'sessionStore',
          features: ['STABLE'],
          params: [
            {
              name: 'key',
              type: 'string',
              required: true,
              description: '键名',
            },
          ],
          returns: { type: 'void', description: '无返回值' },
          examples: [
            {
              title: '删除',
              input: "myUtil.sessionStore.clear('token')",
              output: '',
            },
          ],
        },
        {
          name: 'clearAll',
          cnName: '清空全部存储',
          signature: 'myUtil.sessionStore.clearAll(): void',
          description: '清空 sessionStorage 中所有存储的数据。',
          module: 'sessionStore',
          features: ['STABLE'],
          params: [],
          returns: { type: 'void', description: '无返回值' },
          examples: [
            {
              title: '清空',
              input: 'myUtil.sessionStore.clearAll()',
              output: '',
            },
          ],
        },
      ],
    },
    {
      type: 'array',
      name: '数组处理',
      description:
        '提供数组常用操作方法，包括去重、分组、树形遍历、Key 设置等功能。',
      dependencyTip: '无外部依赖',
      methods: [
        {
          name: 'dedupeByProperty',
          cnName: '属性去重',
          signature:
            'myUtil.array.dedupeByProperty<T>(arr: T[], prop: keyof T): T[]',
          description:
            '根据对象的指定属性对数组进行去重，保留第一次出现的元素。',
          module: 'array',
          features: ['STABLE'],
          params: [
            {
              name: 'arr',
              type: 'T[]',
              required: true,
              description: '源数组',
            },
            {
              name: 'prop',
              type: 'keyof T',
              required: true,
              description: '用于去重的属性名',
            },
          ],
          returns: { type: 'T[]', description: '去重后的新数组' },
          examples: [
            {
              title: '根据 ID 去重',
              input: `const arr = [
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
  { id: 1, name: '王五' }
];
myUtil.array.dedupeByProperty(arr, 'id');`,
              output: `[
  { "id": 1, "name": "张三" },
  { "id": 2, "name": "李四" }
]`,
            },
          ],
        },
        {
          name: 'groupByFields',
          cnName: '多字段分组',
          signature:
            'myUtil.array.groupByFields<T>(array: T[], ...fields: (keyof T)[]): Record<string, T[]>',
          description:
            '根据多个字段对数组进行分组，返回以字段值组合为键的对象。',
          module: 'array',
          features: ['STABLE'],
          params: [
            {
              name: 'array',
              type: 'T[]',
              required: true,
              description: '源数组',
            },
            {
              name: 'fields',
              type: '(keyof T)[]',
              required: true,
              description: '分组字段数组',
            },
          ],
          returns: {
            type: 'Record<string, T[]>',
            description: '分组后的对象，键为字段值组合（用 | 分隔）',
          },
          examples: [
            {
              title: '单字段分组',
              input: `const arr = [
  { name: '张三', dept: '技术部' },
  { name: '李四', dept: '市场部' },
  { name: '王五', dept: '技术部' }
];
myUtil.array.groupByFields(arr, 'dept');`,
              output: `{
  "技术部": [
    { "name": "张三", "dept": "技术部" },
    { "name": "王五", "dept": "技术部" }
  ],
  "市场部": [
    { "name": "李四", "dept": "市场部" }
  ]
}`,
            },
            {
              title: '多字段分组',
              input: `const arr = [
  { name: '张三', dept: '技术部', level: '高级' },
  { name: '李四', dept: '市场部', level: '中级' },
  { name: '王五', dept: '技术部', level: '中级' }
];
myUtil.array.groupByFields(arr, 'dept', 'level');`,
              output: `{
  "技术部|高级": [{ "name": "张三", "dept": "技术部", "level": "高级" }],
  "市场部|中级": [{ "name": "李四", "dept": "市场部", "level": "中级" }],
  "技术部|中级": [{ "name": "王五", "dept": "技术部", "level": "中级" }]
}`,
            },
          ],
        },
        {
          name: 'traverseTreeLeaf',
          cnName: '遍历树形叶子',
          signature:
            'myUtil.array.traverseTreeLeaf(arr: Array<{ children?: Array<{ disabled?: boolean }> }>): void',
          description: '遍历树形数组，将所有非叶子节点的 disabled 设为 true。',
          module: 'array',
          features: ['STABLE'],
          params: [
            {
              name: 'arr',
              type: 'Array<{ children?: Array<{ disabled?: boolean }> }>',
              required: true,
              description: '树形结构数组',
            },
          ],
          returns: { type: 'void', description: '无返回值，直接修改原数组' },
          examples: [
            {
              title: '遍历树节点',
              input: `const treeData = [
  {
    id: 1,
    title: '根节点',
    children: [
      { id: 2, title: '子节点1' },
      {
        id: 3,
        title: '子节点2',
        children: [
          { id: 4, title: '孙节点' }
        ]
      }
    ]
  }
];
myUtil.array.traverseTreeLeaf(treeData);
console.info(treeData);`,
              output: `[
  {
    "id": 1,
    "title": "根节点",
    "disabled": true,
    "children": [
      { "id": 2, "title": "子节点1" },
      {
        "id": 3,
        "title": "子节点2",
        "disabled": true,
        "children": [
          { "id": 4, "title": "孙节点" }
        ]
      }
    ]
  }
]`,
            },
          ],
          notes: [
            '方法直接修改原数组，不返回新数组',
            '只有包含 children 且 children 不为空的节点才会被设为 disabled',
          ],
        },
        {
          name: 'setKey',
          cnName: '设置唯一键',
          signature:
            'myUtil.array.setKey<T extends Record<string, any>>(arr: T[] = []): T[]',
          description:
            '为数组元素设置唯一的 key（如果没有 key），使用 UUID 作为默认值。',
          module: 'array',
          features: ['STABLE'],
          params: [
            {
              name: 'arr',
              type: 'T[]',
              required: false,
              default: '[]',
              description: '源数组',
            },
          ],
          returns: { type: 'T[]', description: '设置 key 后的数组' },
          examples: [
            {
              title: '为元素设置 key',
              input: `const arr = [
  { name: '张三' },
  { name: '李四', key: 'existing-key' }
];
myUtil.array.setKey(arr);`,
              output: `[
  { "name": "张三", "key": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" },
  { "name": "李四", "key": "existing-key" }
]`,
            },
          ],
          notes: [
            '已有 key 的元素不会被覆盖',
            '使用 myUtil.text.uuid() 生成唯一标识',
          ],
        },
      ],
    },
    {
      type: 'tree',
      name: '树形结构',
      description:
        '提供树形数据结构的常用操作，包括删除、查找、转换、排序等功能。',
      dependencyTip: '无外部依赖',
      methods: [
        {
          name: 'deleteNode',
          cnName: '删除节点',
          signature:
            'myUtil.tree.deleteNode(options: { tree, targetId, parent?, idText = "id" }): boolean',
          description: '根据节点 ID 删除树中的节点。',
          module: 'tree',
          features: ['STABLE'],
          params: [
            {
              name: 'tree',
              type: 'TreeNode',
              required: true,
              description: '树节点数据',
            },
            {
              name: 'targetId',
              type: 'string | number',
              required: true,
              description: '要删除的节点 ID',
            },
            {
              name: 'parent',
              type: 'TreeNode',
              required: false,
              description: '父节点（内部递归使用）',
            },
            {
              name: 'idText',
              type: 'string',
              required: false,
              default: '"id"',
              description: 'ID 字段名',
            },
          ],
          returns: { type: 'boolean', description: '是否删除成功' },
          examples: [
            {
              title: '删除节点',
              input: `let testTree = [
  { id: 1, title: "根节点", children: [
    { id: 2, title: "子节点1", children: [
      { id: 3, title: "子节点1-1" },
      { id: 4, title: "子节点1-2" }
    ]},
    { id: 5, title: "子节点2" }
  ]}
];
myUtil.tree.deleteNode({ tree: testTree, targetId: 3 });
console.info(testTree);`,
              output: `[
  {
    "id": 1,
    "title": "根节点",
    "children": [
      {
        "id": 2,
        "title": "子节点1",
        "children": [
          {
            "id": 4,
            "title": "子节点1-2"
          }
        ]
      },
      {
        "id": 5,
        "title": "子节点2"
      }
    ]
  }
]`,
            },
          ],
        },
        {
          name: 'findNodeInTree',
          cnName: '查找节点',
          signature:
            'myUtil.tree.findNodeInTree(options: { tree, targetId, idText = "id" }): TreeNode | null',
          description: '在树中根据 ID 查找目标节点。',
          module: 'tree',
          features: ['STABLE'],
          params: [
            {
              name: 'tree',
              type: 'TreeNode[]',
              required: true,
              description: '树节点数组',
            },
            {
              name: 'targetId',
              type: 'string | number',
              required: true,
              description: '目标节点 ID',
            },
            {
              name: 'idText',
              type: 'string',
              required: false,
              default: '"id"',
              description: 'ID 字段名',
            },
          ],
          returns: {
            type: 'TreeNode | null',
            description: '找到的节点，未找到返回 null',
          },
          examples: [
            {
              title: '查找节点',
              input: `let testTree = [
  { id: 1, title: "根节点", children: [
    { id: 2, title: "子节点1", children: [
      { id: 3, title: "子节点1-1" },
      { id: 4, title: "子节点1-2" }
    ]},
    { id: 5, title: "子节点2" }
  ]}
];
console.info(myUtil.tree.findNodeInTree({ tree: testTree, targetId: 3 }));`,
              output: `{
  "id": 3,
  "title": "子节点1-1",
  "children": []
}`,
            },
          ],
        },
        {
          name: 'deleteTargetKey',
          cnName: '删除节点属性',
          signature:
            'myUtil.tree.deleteTargetKey(options: { tree, targetKey: string | string[] }): void',
          description: '删除树节点中指定的 key（属性）。',
          module: 'tree',
          features: ['STABLE'],
          params: [
            {
              name: 'tree',
              type: 'TreeNode[]',
              required: true,
              description: '树节点数组',
            },
            {
              name: 'targetKey',
              type: 'string | string[]',
              required: true,
              description: '要删除的 key 或 key 数组',
            },
          ],
          returns: { type: 'void', description: '无返回值' },
          examples: [
            {
              title: '删除属性',
              input: `let testTree = [
  { id: 1, title: "根节点", extra: "数据1", children: [
    { id: 2, title: "子节点", extra: "数据2", children: [] }
  ]}
];
myUtil.tree.deleteTargetKey({ tree: testTree, targetKey: "extra" });
console.info(testTree);`,
              output: `[
  {
    "id": 1,
    "title": "根节点",
    "children": [
      {
        "id": 2,
        "title": "子节点",
        "children": []
      }
    ]
  }
]`,
            },
          ],
        },
        {
          name: 'transformArrToTree',
          cnName: '数组转树',
          signature:
            'myUtil.tree.transformArrToTree(list, rootId, { idName = "id", parentIdName = "parentId", childrenName = "children" }): TreeNode[]',
          description: '将扁平数组转换为树形结构。',
          module: 'tree',
          features: ['STABLE'],
          params: [
            {
              name: 'list',
              type: 'Record<string, any>[]',
              required: true,
              description: '扁平数组数据',
            },
            {
              name: 'rootId',
              type: 'string | number',
              required: true,
              description: '根节点 ID',
            },
            {
              name: 'idName',
              type: 'string',
              required: false,
              default: '"id"',
              description: 'ID 字段名',
            },
            {
              name: 'parentIdName',
              type: 'string',
              required: false,
              default: '"parentId"',
              description: '父 ID 字段名',
            },
            {
              name: 'childrenName',
              type: 'string',
              required: false,
              default: '"children"',
              description: '子节点字段名',
            },
          ],
          returns: { type: 'TreeNode[]', description: '树形结构数据' },
          examples: [
            {
              title: '数组转树',
              input: `const list = [
  { id: 1, parentId: 0, title: "根节点" },
  { id: 2, parentId: 1, title: "子节点1" },
  { id: 3, parentId: 1, title: "子节点2" },
  { id: 4, parentId: 2, title: "孙节点1" },
  { id: 5, parentId: 2, title: "孙节点2" }
];
console.info(myUtil.tree.transformArrToTree(list, 0));`,
              output: `[
  {
    "id": 1,
    "parentId": 0,
    "title": "根节点",
    "children": [
      {
        "id": 2,
        "parentId": 1,
        "title": "子节点1",
        "children": [
          { "id": 4, "parentId": 2, "title": "孙节点1", "children": [] },
          { "id": 5, "parentId": 2, "title": "孙节点2", "children": [] }
        ]
      },
      {
        "id": 3,
        "parentId": 1,
        "title": "子节点2",
        "children": []
      }
    ]
  }
]`,
            },
          ],
          notes: ['如果参数不是数组会抛出错误'],
        },
        {
          name: 'setTreeLevels',
          cnName: '设置树层级',
          signature:
            'myUtil.tree.setTreeLevels(nodes: TreeNode[], level = 0): void',
          description: '为树节点设置 level 层级属性。',
          module: 'tree',
          features: ['STABLE'],
          params: [
            {
              name: 'nodes',
              type: 'TreeNode[]',
              required: true,
              description: '树节点数组',
            },
            {
              name: 'level',
              type: 'number',
              required: false,
              default: '0',
              description: '初始层级',
            },
          ],
          returns: { type: 'void', description: '无返回值，直接修改原对象' },
          examples: [
            {
              title: '设置层级',
              input: `let testTree = [
  { id: 1, title: "根节点", children: [
    { id: 2, title: "子节点1", children: [
      { id: 3, title: "孙节点" }
    ]},
    { id: 4, title: "子节点2" }
  ]}
];
myUtil.tree.setTreeLevels(testTree);
console.info(testTree);`,
              output: `[
  {
    "id": 1,
    "title": "根节点",
    "level": 0,
    "children": [
      {
        "id": 2,
        "title": "子节点1",
        "level": 1,
        "children": [
          {
            "id": 3,
            "title": "孙节点",
            "level": 2,
            "children": []
          }
        ]
      },
      {
        "id": 4,
        "title": "子节点2",
        "level": 1,
        "children": []
      }
    ]
  }
]`,
            },
          ],
          notes: ['会直接修改原树节点对象'],
        },
        {
          name: 'setTreeProps',
          cnName: '设置叶子节点属性',
          signature:
            'myUtil.tree.setTreeProps(nodes: TreeNode[], callback: (node: TreeNode) => void): void',
          description: '对树中所有叶子节点执行回调函数。',
          module: 'tree',
          features: ['STABLE'],
          params: [
            {
              name: 'nodes',
              type: 'TreeNode[]',
              required: true,
              description: '树节点数组',
            },
            {
              name: 'callback',
              type: '(node: TreeNode) => void',
              required: true,
              description: '回调函数',
            },
          ],
          returns: { type: 'void', description: '无返回值' },
          examples: [
            {
              title: '设置叶子节点',
              input: `let testTree = [
  { id: 1, title: "根节点", children: [
    { id: 2, title: "子节点1", children: [
      { id: 3, title: "孙节点" }
    ]},
    { id: 4, title: "子节点2", children: [] }
  ]}
];
myUtil.tree.setTreeProps(testTree, (node) => { node.isLeaf = true; });
console.info(testTree);`,
              output: `[
  {
    "id": 1,
    "title": "根节点",
    "children": [
      {
        "id": 2,
        "title": "子节点1",
        "children": [
          {
            "id": 3,
            "title": "孙节点",
            "isLeaf": true,
            "children": []
          }
        ]
      },
      {
        "id": 4,
        "title": "子节点2",
        "isLeaf": true,
        "children": []
      }
    ]
  }
]`,
            },
          ],
        },
        {
          name: 'findAllAncestorIds',
          cnName: '获取所有上级ID',
          signature:
            'myUtil.tree.findAllAncestorIds(treeData: TreeNode[], targetId: string | number, idName = "id", childName = "children"): (string | number)[]',
          description: '获取从根节点到目标节点的所有上级节点 ID 数组。',
          module: 'tree',
          features: ['STABLE'],
          params: [
            {
              name: 'treeData',
              type: 'TreeNode[]',
              required: true,
              description: '树数据',
            },
            {
              name: 'targetId',
              type: 'string | number',
              required: true,
              description: '起始节点 ID',
            },
            {
              name: 'idName',
              type: 'string',
              required: false,
              default: '"id"',
              description: 'ID 字段名',
            },
            {
              name: 'childName',
              type: 'string',
              required: false,
              default: '"children"',
              description: '子节点字段名',
            },
          ],
          returns: {
            type: '(string | number)[]',
            description: '所有上级节点 ID 数组',
          },
          examples: [
            {
              title: '获取祖先',
              input: `let testTree = [
  { id: 1, title: "根节点", children: [
    { id: 2, title: "子节点1", children: [
      { id: 3, title: "孙节点1", children: [
        { id: 4, title: "曾孙节点" }
      ]}
    ]},
    { id: 5, title: "子节点2" }
  ]}
];
console.info(myUtil.tree.findAllAncestorIds(testTree, 4));`,
              output: '[1, 2, 3]',
            },
          ],
        },
        {
          name: 'findAllDescendantIds',
          cnName: '获取所有下级ID',
          signature:
            'myUtil.tree.findAllDescendantIds(treeData: TreeNode[], targetId: string | number, idName = "id", childName = "children"): (string | number)[]',
          description:
            '获取目标节点的所有下级节点 ID 数组（包含目标节点自身）。',
          module: 'tree',
          features: ['STABLE'],
          params: [
            {
              name: 'treeData',
              type: 'TreeNode[]',
              required: true,
              description: '树数据',
            },
            {
              name: 'targetId',
              type: 'string | number',
              required: true,
              description: '起始节点 ID',
            },
            {
              name: 'idName',
              type: 'string',
              required: false,
              default: '"id"',
              description: 'ID 字段名',
            },
            {
              name: 'childName',
              type: 'string',
              required: false,
              default: '"children"',
              description: '子节点字段名',
            },
          ],
          returns: {
            type: '(string | number)[]',
            description: '所有下级节点 ID 数组',
          },
          examples: [
            {
              title: '获取后代',
              input: `let testTree = [
  { id: 1, title: "根节点", children: [
    { id: 2, title: "子节点1", children: [
      { id: 3, title: "孙节点1" },
      { id: 4, title: "孙节点2" }
    ]},
    { id: 5, title: "子节点2" }
  ]}
];
console.info(myUtil.tree.findAllDescendantIds(testTree, 2));`,
              output: '[2, 3, 4]',
            },
          ],
        },
        {
          name: 'sortTree',
          cnName: '排序树节点',
          signature:
            'myUtil.tree.sortTree(tree: TreeNode[], sortKey: string, sortOrder: "asc" | "desc" = "asc"): TreeNode[]',
          description: '对树节点按指定字段排序（递归排序）。',
          module: 'tree',
          features: ['STABLE'],
          params: [
            {
              name: 'tree',
              type: 'TreeNode[]',
              required: true,
              description: '树数据',
            },
            {
              name: 'sortKey',
              type: 'string',
              required: true,
              description: '排序字段',
            },
            {
              name: 'sortOrder',
              type: '"asc" | "desc"',
              required: false,
              default: '"asc"',
              description: '排序方式',
            },
          ],
          returns: {
            type: 'TreeNode[]',
            description: '排序后的树，直接修改原对象',
          },
          examples: [
            {
              title: '升序排序',
              input: `let testTree = [
  { id: 1, title: "根节点", order: 3, children: [
    { id: 2, title: "子节点1", order: 2, children: [
      { id: 3, title: "孙节点2", order: 2 },
      { id: 4, title: "孙节点1", order: 1 }
    ]},
    { id: 5, title: "子节点2", order: 1 }
  ]}
];
myUtil.tree.sortTree(testTree, "order");
console.info(testTree);`,
              output: `[
  {
    "id": 1,
    "title": "根节点",
    "order": 3,
    "children": [
      {
        "id": 5,
        "title": "子节点2",
        "order": 1,
        "children": []
      },
      {
        "id": 2,
        "title": "子节点1",
        "order": 2,
        "children": [
          {
            "id": 4,
            "title": "孙节点1",
            "order": 1,
            "children": []
          },
          {
            "id": 3,
            "title": "孙节点2",
            "order": 2,
            "children": []
          }
        ]
      }
    ]
  }
]`,
            },
            {
              title: '降序排序',
              input: `let testTree = [
  { id: 1, title: "根节点", order: 1, children: [
    { id: 2, title: "子节点1", order: 2, children: [
      { id: 3, title: "孙节点1", order: 3 },
      { id: 4, title: "孙节点2", order: 1 }
    ]},
    { id: 5, title: "子节点2", order: 3 }
  ]}
];
myUtil.tree.sortTree(testTree, "order", "desc");
console.info(testTree);`,
              output: `[
  {
    "id": 1,
    "title": "根节点",
    "order": 1,
    "children": [
      {
        "id": 5,
        "title": "子节点2",
        "order": 3,
        "children": []
      },
      {
        "id": 2,
        "title": "子节点1",
        "order": 2,
        "children": [
          {
            "id": 3,
            "title": "孙节点1",
            "order": 3,
            "children": []
          },
          {
            "id": 4,
            "title": "孙节点2",
            "order": 1,
            "children": []
          }
        ]
      }
    ]
  }
]`,
            },
          ],
          notes: ['会直接修改原树节点对象'],
        },
      ],
    },
    {
      type: 'word',
      name: 'Word 文档',
      description:
        '基于 docx 库提供 Word 文档生成能力，支持创建标题、段落、表格、目录、页眉页脚等功能。',
      dependencyTip: '依赖 docx 库进行 Word 文档生成',
      methods: [
        {
          name: 'DocxConfig',
          cnName: '默认配置',
          signature: 'myUtil.word.DocxConfig',
          description:
            'Word 文档的默认配置项，包含字体、字号、行距等样式设置。',
          module: 'word',
          features: ['STABLE'],
          params: [],
          returns: {
            type: 'object',
            description: '默认配置对象',
          },
          examples: [
            {
              title: '默认配置',
              input: 'myUtil.word.DocxConfig',
              output:
                '{ fontFamily: "微软雅黑", fontSize: 18, fontLine: 276, fontSizeTitle1: 32, ... }',
            },
          ],
          notes: ['可通过 createDocxConfig 方法进行自定义覆盖'],
        },
        {
          name: 'createDocxConfig',
          cnName: '创建文档配置',
          signature:
            'myUtil.word.createDocxConfig(config?: Partial<typeof myUtil.word.DocxConfig>)',
          description:
            '创建并返回 Word 文档的样式配置对象，支持自定义覆盖默认配置。',
          module: 'word',
          features: ['STABLE'],
          params: [
            {
              name: 'config',
              type: 'Partial<typeof myUtil.word.DocxConfig>',
              required: false,
              description: '自定义配置项',
            },
          ],
          returns: {
            type: 'object',
            description: '文档样式配置对象，包含 tableStyle 和 styles 属性',
          },
          examples: [
            {
              title: '使用默认配置',
              input: 'myUtil.word.createDocxConfig()',
              output: '{ tableStyle: {...}, styles: {...} }',
            },
            {
              title: '自定义配置',
              input:
                'myUtil.word.createDocxConfig({ fontSize: 24, fontFamily: "宋体" })',
              output: '（使用自定义字体和字号的配置对象）',
            },
          ],
        },
        {
          name: 'saveDocx',
          cnName: '保存文档',
          signature: 'myUtil.word.saveDocx(doc: any, filename: string): void',
          description: '将文档对象打包为 Blob 并触发浏览器下载。',
          module: 'word',
          features: ['STABLE'],
          params: [
            {
              name: 'doc',
              type: 'any',
              required: true,
              description: 'Packer 打包后的 Document 对象',
            },
            {
              name: 'filename',
              type: 'string',
              required: true,
              description: '下载的文件名（无需扩展名，自动添加 .docx）',
            },
          ],
          returns: { type: 'void', description: '无返回值' },
          examples: [
            {
              title: '保存文档',
              input: 'myUtil.word.saveDocx(doc, "测试文档")',
              output: '（浏览器将下载"测试文档.docx"文件）',
            },
          ],
        },
        {
          name: 'createTitle',
          cnName: '创建标题',
          signature:
            'myUtil.word.createTitle(text: string, level?: number, pageBreakBefore?: boolean)',
          description: '创建分级标题，自动设置标题样式和段间距。',
          module: 'word',
          features: ['STABLE'],
          params: [
            {
              name: 'text',
              type: 'string',
              required: true,
              description: '标题文本内容',
            },
            {
              name: 'level',
              type: 'number',
              required: false,
              default: '1',
              description: '标题级别（1-5），1 级标题字号最大',
            },
            {
              name: 'pageBreakBefore',
              type: 'boolean',
              required: false,
              default: 'false',
              description: '是否在标题前分页',
            },
          ],
          returns: { type: 'Paragraph', description: '段落对象' },
          examples: [
            {
              title: '一级标题',
              input: 'myUtil.word.createTitle("文档标题", 1)',
              output: '（32号字的一级标题）',
            },
            {
              title: '二级标题',
              input: 'myUtil.word.createTitle("章节标题", 2)',
              output: '（26号字的二级标题）',
            },
            {
              title: '三级标题',
              input: 'myUtil.word.createTitle("小节标题", 3)',
              output: '（22号字的三级标题）',
            },
          ],
        },
        {
          name: 'createTableOfContents',
          cnName: '创建目录',
          signature:
            'myUtil.word.createTableOfContents(children: any[], title?: string): void',
          description:
            '创建自动目录，目录会根据文档中的标题自动生成，支持点击跳转。',
          module: 'word',
          features: ['STABLE'],
          params: [
            {
              name: 'children',
              type: 'any[]',
              required: true,
              description: '文档子元素数组，目录会被添加到此数组中',
            },
            {
              name: 'title',
              type: 'string',
              required: false,
              default: '"目录"',
              description: '目录标题文本',
            },
          ],
          returns: {
            type: 'void',
            description: '无返回值，直接修改 children 数组',
          },
          examples: [
            {
              title: '创建目录',
              input: 'myUtil.word.createTableOfContents(children)',
              output: '（children 数组中将包含目录段落）',
            },
            {
              title: '自定义标题',
              input:
                'myUtil.word.createTableOfContents(children, "Table of Contents")',
              output: '（使用英文标题）',
            },
          ],
          notes: ['需在标题之后、文档内容之前调用'],
        },
        {
          name: 'createHeader',
          cnName: '创建页眉',
          signature: 'myUtil.word.createHeader(title: string)',
          description: '创建文档页眉，显示指定的标题文本。',
          module: 'word',
          features: ['STABLE'],
          params: [
            {
              name: 'title',
              type: 'string',
              required: true,
              description: '页眉显示的文本',
            },
          ],
          returns: {
            type: 'object',
            description: '页眉配置对象，用于 Document 的 header 属性',
          },
          examples: [
            {
              title: '创建页眉',
              input: "myUtil.word.createHeader('我的文档')",
              output: '{ default: Header { ... } }',
            },
          ],
        },
        {
          name: 'createFooter',
          cnName: '创建页脚',
          signature: 'myUtil.word.createFooter()',
          description: '创建文档页脚，包含页码信息（当前页/总页数）。',
          module: 'word',
          features: ['STABLE'],
          params: [],
          returns: {
            type: 'object',
            description: '页脚配置对象，用于 Document 的 footer 属性',
          },
          examples: [
            {
              title: '创建页脚',
              input: 'myUtil.word.createFooter()',
              output: '{ default: Footer { ... } }',
            },
          ],
          notes: ['页码会自动计算'],
        },
        {
          name: 'createTable',
          cnName: '创建表格',
          signature:
            'myUtil.word.createTable(options: { columns, dataSource, showLineNumber?, config? })',
          description: '创建 Word 表格，支持自定义列、数据源、序号和格式化。',
          module: 'word',
          features: ['STABLE'],
          params: [
            {
              name: 'options.columns',
              type: 'Array<{ title, dataIndex, format? }>',
              required: true,
              description: '列配置数组',
            },
            {
              name: 'options.dataSource',
              type: 'Record<string, any>[]',
              required: true,
              description: '表格数据源',
            },
            {
              name: 'options.showLineNumber',
              type: 'boolean',
              required: false,
              default: 'false',
              description: '是否显示序号列',
            },
            {
              name: 'options.config',
              type: 'Partial<typeof myUtil.word.DocxConfig>',
              required: false,
              description: '文档样式配置',
            },
          ],
          returns: { type: 'Table', description: '表格对象' },
          examples: [
            {
              title: '基本表格',
              input:
                'myUtil.word.createTable({ columns: [{ title: "姓名", dataIndex: "name" }], dataSource: [{ name: "张三" }] })',
              output: '（包含一列的表格）',
            },
            {
              title: '带序号和格式化',
              input:
                'myUtil.word.createTable({ columns: [{ title: "金额", dataIndex: "amount", format: v => `¥${v}` }], dataSource: [{ amount: 100 }], showLineNumber: true })',
              output: '（带序号列和格式化金额的表格）',
            },
          ],
        },
        {
          name: 'createParagraph',
          cnName: '创建段落',
          signature:
            'myUtil.word.createParagraph(options: { text, bold?, size?, color?, indent?, spacing?, shading?, bullet? })',
          description:
            '创建文档段落，支持设置粗细、字号、颜色、缩进、段间距、底纹和项目符号。',
          module: 'word',
          features: ['STABLE'],
          params: [
            {
              name: 'options.text',
              type: 'string',
              required: true,
              description: '段落文本内容',
            },
            {
              name: 'options.bold',
              type: 'boolean',
              required: false,
              description: '是否加粗',
            },
            {
              name: 'options.size',
              type: 'number',
              required: false,
              description: '字号（单位：半字）',
            },
            {
              name: 'options.color',
              type: 'string',
              required: false,
              description: '文字颜色（十六进制，如 "FF0000"）',
            },
            {
              name: 'options.indent',
              type: 'number',
              required: false,
              description: '首行缩进（单位：缇）',
            },
            {
              name: 'options.spacing',
              type: 'object',
              required: false,
              description: '段间距配置 { before?, after?, line? }',
            },
            {
              name: 'options.shading',
              type: 'object',
              required: false,
              description: '底纹配置 { fill: "颜色值" }',
            },
            {
              name: 'options.bullet',
              type: 'boolean',
              required: false,
              description: '是否使用项目符号列表',
            },
          ],
          returns: { type: 'Paragraph', description: '段落对象' },
          examples: [
            {
              title: '普通段落',
              input:
                'myUtil.word.createParagraph({ text: "这是一段普通文本" })',
              output: '（普通段落）',
            },
            {
              title: '加粗段落',
              input:
                'myUtil.word.createParagraph({ text: "重要内容", bold: true })',
              output: '（加粗段落）',
            },
            {
              title: '首行缩进',
              input:
                'myUtil.word.createParagraph({ text: "这是正文内容", indent: 360 })',
              output: '（首行缩进 360 缇）',
            },
            {
              title: '带项目符号',
              input:
                'myUtil.word.createParagraph({ text: "列表项", bullet: true })',
              output: '（带项目符号的列表项）',
            },
            {
              title: '带底纹',
              input:
                'myUtil.word.createParagraph({ text: "强调内容", shading: { fill: "FFFF00" } })',
              output: '（黄色背景底纹）',
            },
          ],
        },
        {
          name: 'createEmptyLine',
          cnName: '创建空行',
          signature: 'myUtil.word.createEmptyLine(lineHeight?: number)',
          description: '创建空行用于分隔内容，可设置行高。',
          module: 'word',
          features: ['STABLE'],
          params: [
            {
              name: 'lineHeight',
              type: 'number',
              required: false,
              default: '100',
              description: '行高（单位：缇）',
            },
          ],
          returns: { type: 'Paragraph', description: '空段落对象' },
          examples: [
            {
              title: '默认空行',
              input: 'myUtil.word.createEmptyLine()',
              output: '（100 缇高度的的空行）',
            },
            {
              title: '自定义行高',
              input: 'myUtil.word.createEmptyLine(200)',
              output: '（200 缇高度的的空行）',
            },
          ],
          notes: ['常用于标题与正文之间的分隔'],
        },
      ],
    },
    {
      type: 'chartsAntD',
      name: '图表工具',
      description:
        '基于 Ant Design Charts 提供图表配置工具，支持饼图、柱状图、折线图、面积图、双轴图等多种图表类型，快速生成美观的数据可视化配置。',
      dependencyTip: '依赖 @ant-design/plots 库',
      methods: [
        {
          name: 'configPie',
          cnName: '饼图配置',
          signature: 'myUtil.chartsAntD.configPie(param: object): object',
          description:
            '创建饼图配置，支持设置标签、图例、内径等参数，展示各类别占比情况。',
          module: 'chartsAntD',
          features: ['STABLE'],
          params: [
            {
              name: 'data',
              type: 'any[]',
              required: false,
              default: '[]',
              description: '图表数据数组',
            },
            {
              name: 'angleField',
              type: 'string',
              required: false,
              default: '"value"',
              description: '数值字段名',
            },
            {
              name: 'colorField',
              type: 'string',
              required: false,
              default: '"type"',
              description: '分类字段名',
            },
            {
              name: 'radius',
              type: 'number',
              required: false,
              default: '0.75',
              description: '饼图半径（0-1）',
            },
            {
              name: 'innerRadius',
              type: 'number',
              required: false,
              default: '0',
              description: '内径半径（0-1），设置可创建环形图',
            },
          ],
          returns: { type: 'object', description: '饼图配置对象' },
          examples: [
            {
              title: '基础饼图',
              description: '简单分类占比展示',
              input: `const dataPie = [
  { type: '分类 A', value: 27 },
  { type: '分类 B', value: 25 },
  { type: '分类 C', value: 18 },
  { type: '分类 D', value: 15 },
  { type: '分类 E', value: 10 },
  { type: '分类 F', value: 5 },
];

const configPie = {
  ...myUtil.chartsAntD.configPie({
    data: dataPie,
  }),
};`,
              output: '<Pie {...configPie} />',
              exampleType: 'chart',
            },
            {
              title: '环形图',
              description: '带内径的环形图展示',
              input: `const dataPie2 = [
  { type: '电子产品', value: 45000 },
  { type: '服装', value: 32000 },
  { type: '食品', value: 28000 },
  { type: '家居', value: 15000 },
];

const configPie2 = {
  ...myUtil.chartsAntD.configPie({
    data: dataPie2,
    innerRadius: 0.6,
    showTotal: true,
    valueUnit: '元',
  }),
};`,
              output: '<Pie {...configPie2} />',
              exampleType: 'chart',
            },
          ],
        },
        {
          name: 'configArea',
          cnName: '面积图配置',
          signature: 'myUtil.chartsAntD.configArea(param: object): object',
          description: '创建面积图配置，支持设置坐标轴标题、数值格式和单位。',
          module: 'chartsAntD',
          features: ['STABLE'],
          params: [
            {
              name: 'data',
              type: 'any[]',
              required: false,
              default: '[]',
              description: '图表数据数组',
            },
            {
              name: 'xField',
              type: 'string',
              required: false,
              default: '"xValue"',
              description: 'X 轴字段名',
            },
            {
              name: 'yField',
              type: 'string',
              required: false,
              default: '"yValue"',
              description: 'Y 轴字段名',
            },
            {
              name: 'valueFormat',
              type: 'string',
              required: false,
              default: '"0,0"',
              description: '数值格式化',
            },
            {
              name: 'valueUnit',
              type: 'string',
              required: false,
              default: '""',
              description: '数值单位',
            },
            {
              name: 'axisXTitle',
              type: 'string',
              required: false,
              description: 'X 轴标题',
            },
            {
              name: 'axisYTitle',
              type: 'string',
              required: false,
              description: 'Y 轴标题',
            },
          ],
          returns: { type: 'object', description: '面积图配置对象' },
          examples: [
            {
              title: '基础面积图',
              description: '展示趋势变化',
              input: `const dataArea = [
  { month: '1月', value: 120 },
  { month: '2月', value: 150 },
  { month: '3月', value: 180 },
  { month: '4月', value: 220 },
  { month: '5月', value: 280 },
  { month: '6月', value: 350 },
];

const configArea = myUtil.chartsAntD.configArea({
  data: dataArea,
  xField: 'month',
  yField: 'value',
  axisXTitle: '月份',
  axisYTitle: '销售量',
  valueUnit: '件',
});`,
              output: '<Area {...configArea} />',
              exampleType: 'chart',
            },
            {
              title: '带数值的面积图',
              description: 'Y 轴显示单位',
              input: `const dataArea2 = [
  { date: '2024-01', value: 12500 },
  { date: '2024-02', value: 14800 },
  { date: '2024-03', value: 18200 },
  { date: '2024-04', value: 21000 },
  { date: '2024-05', value: 25600 },
  { date: '2024-06', value: 32000 },
];

const configArea2 = myUtil.chartsAntD.configArea({
  data: dataArea2,
  xField: 'date',
  yField: 'value',
  axisXTitle: '日期',
  axisYTitle: '营收',
  valueFormat: '0,0',
  valueUnit: '元',
});`,
              output: '<Area {...configArea2} />',
              exampleType: 'chart',
            },
          ],
        },
        {
          name: 'configColumn',
          cnName: '柱状图配置',
          signature: 'myUtil.chartsAntD.configColumn(param: object): object',
          description:
            '创建柱状图配置，支持分组、堆叠、标签显示等多种样式，自动配置 Tooltip 和坐标轴。',
          module: 'chartsAntD',
          features: ['STABLE'],
          params: [
            {
              name: 'data',
              type: 'any[]',
              required: false,
              default: '[]',
              description: '图表数据数组',
            },
            {
              name: 'xField',
              type: 'string',
              required: false,
              default: '"xValue"',
              description: 'X 轴字段名',
            },
            {
              name: 'yField',
              type: 'string',
              required: false,
              default: '"yValue"',
              description: 'Y 轴字段名',
            },
            {
              name: 'valueFormat',
              type: 'string',
              required: false,
              default: '"0,0"',
              description: '数值格式化',
            },
            {
              name: 'valueUnit',
              type: 'string',
              required: false,
              default: '""',
              description: '数值单位',
            },
            {
              name: 'showLabel',
              type: 'boolean',
              required: false,
              description: '是否在柱子上显示数值标签',
            },
            {
              name: 'colorField',
              type: 'string',
              required: false,
              description: '分组字段名（用于分组柱状图）',
            },
            {
              name: 'group',
              type: 'boolean',
              required: false,
              description: '是否分组显示',
            },
            {
              name: 'stack',
              type: 'object',
              required: false,
              description: '堆叠配置（用于堆叠柱状图）',
            },
          ],
          returns: { type: 'object', description: '柱状图配置对象' },
          examples: [
            {
              title: '基础柱状图',
              description: '简单数据对比',
              input: `const dataColumn = [
  { month: '1月', value: 120 },
  { month: '2月', value: 150 },
  { month: '3月', value: 180 },
  { month: '4月', value: 220 },
];

const configColumn = myUtil.chartsAntD.configColumn({
  data: dataColumn,
  xField: 'month',
  yField: 'value',
  axisXTitle: '月份',
  axisYTitle: '销量',
  valueUnit: '件',
});`,
              output: '<Column {...configColumn} />',
              exampleType: 'chart',
            },
            {
              title: '带标签的柱状图',
              description: '柱子上显示具体数值',
              input: `const dataColumn2 = [
  { month: 'Q1', value: 450 },
  { month: 'Q2', value: 620 },
  { month: 'Q3', value: 780 },
  { month: 'Q4', value: 950 },
];

const configColumn2 = myUtil.chartsAntD.configColumn({
  data: dataColumn2,
  xField: 'month',
  yField: 'value',
  showLabel: true,
  valueFormat: '0,0',
  valueUnit: '万元',
});`,
              output: '<Column {...configColumn2} />',
              exampleType: 'chart',
            },
            {
              title: '分组柱状图',
              description: '多系列数据对比',
              input: `const dataColumn3 = [
  { month: '1月', type: '计划', value: 100 },
  { month: '1月', type: '实际', value: 120 },
  { month: '2月', type: '计划', value: 150 },
  { month: '2月', type: '实际', value: 145 },
  { month: '3月', type: '计划', value: 180 },
  { month: '3月', type: '实际', value: 200 },
];

const configColumn3 = myUtil.chartsAntD.configColumn({
  data: dataColumn3,
  xField: 'month',
  yField: 'value',
  colorField: 'type',
  group: true,
});`,
              output: '<Column {...configColumn3} />',
              exampleType: 'chart',
            },
          ],
        },
        {
          name: 'configLine',
          cnName: '折线图配置',
          signature: 'myUtil.chartsAntD.configLine(param: object): object',
          description:
            '创建折线图配置，使用平滑曲线展示趋势变化，支持多系列数据、坐标轴配置和标注线。',
          module: 'chartsAntD',
          features: ['STABLE'],
          params: [
            {
              name: 'data',
              type: 'any[]',
              required: false,
              default: '[]',
              description: '图表数据数组',
            },
            {
              name: 'xField',
              type: 'string',
              required: false,
              default: '"xValue"',
              description: 'X 轴字段名',
            },
            {
              name: 'yField',
              type: 'string',
              required: false,
              default: '"yValue"',
              description: 'Y 轴字段名',
            },
            {
              name: 'valueFormat',
              type: 'string',
              required: false,
              default: '"0,0"',
              description: '数值格式化',
            },
            {
              name: 'valueUnit',
              type: 'string',
              required: false,
              default: '""',
              description: '数值单位',
            },
            {
              name: 'colorField',
              type: 'string',
              required: false,
              description: '系列字段名（用于多系列）',
            },
          ],
          returns: { type: 'object', description: '折线图配置对象' },
          examples: [
            {
              title: '基础折线图',
              description: '展示趋势变化',
              input: `const dataLine = [
  { date: '2024-01', value: 120 },
  { date: '2024-02', value: 150 },
  { date: '2024-03', value: 180 },
  { date: '2024-04', value: 220 },
  { date: '2024-05', value: 280 },
  { date: '2024-06', value: 350 },
];

const configLine = myUtil.chartsAntD.configLine({
  data: dataLine,
  xField: 'date',
  yField: 'value',
  axisXTitle: '日期',
  axisYTitle: '访问量',
});`,
              output: '<Line {...configLine} />',
              exampleType: 'chart',
            },
            {
              title: '多系列折线图',
              description: '对比多个指标',
              input: `const dataLine2 = [
  { month: '1月', type: 'PC端', value: 1200 },
  { month: '1月', type: '移动端', value: 800 },
  { month: '2月', type: 'PC端', value: 1400 },
  { month: '2月', type: '移动端', value: 950 },
  { month: '3月', type: 'PC端', value: 1600 },
  { month: '3月', type: '移动端', value: 1200 },
  { month: '4月', type: 'PC端', value: 1800 },
  { month: '4月', type: '移动端', value: 1500 },
];

const configLine2 = myUtil.chartsAntD.configLine({
  data: dataLine2,
  xField: 'month',
  yField: 'value',
  colorField: 'type',
  valueFormat: '0,0',
  valueUnit: '用户',
});`,
              output: '<Line {...configLine2} />',
              exampleType: 'chart',
            },
            {
              title: '带警戒线的折线图',
              description: '标注重要阈值',
              input: `const dataLine3 = [
  { date: '2024-01', value: 850 },
  { date: '2024-02', value: 920 },
  { date: '2024-03', value: 1100 },
  { date: '2024-04', value: 980 },
  { date: '2024-05', value: 1250 },
  { date: '2024-06', value: 1400 },
];

const configLine3 = {
  ...myUtil.chartsAntD.configLine({
    data: dataLine3,
    xField: 'date',
    yField: 'value',
    valueFormat: '0,0',
    valueUnit: '万元',
  }),
  annotations: [
    {
      type: 'lineY',
      yField: 1000,
      style: { stroke: 'red', lineDash: [4, 4] },
    },
    {
      type: 'text',
      data: ['2024-01', 1000],
      style: {
        text: '目标线: 1000万',
        fill: 'red',
      },
    },
  ],
};`,
              output: '<Line {...configLine3} />',
              exampleType: 'chart',
            },
          ],
        },
        {
          name: 'configDualAxes',
          cnName: '双轴图配置',
          signature: 'myUtil.chartsAntD.configDualAxes(param: object): object',
          description:
            '创建双轴图配置，支持在同一图表中展示两种不同量级的数据（柱状图+折线图），左右各有独立的 Y 轴。',
          module: 'chartsAntD',
          features: ['STABLE'],
          params: [
            {
              name: 'data',
              type: 'any[]',
              required: false,
              default: '[]',
              description: '图表数据数组',
            },
            {
              name: 'xField',
              type: 'string',
              required: false,
              default: '"xValue"',
              description: 'X 轴字段名',
            },
            {
              name: 'children',
              type: 'any[]',
              required: true,
              description: '子图表配置数组',
            },
          ],
          returns: { type: 'object', description: '双轴图配置对象' },
          examples: [
            {
              title: '柱状图+折线图',
              description: '同时展示数量和增长率',
              input: `const dataDual = [
  { month: '1月', revenue: 120, growth: 0.15 },
  { month: '2月', revenue: 150, growth: 0.25 },
  { month: '3月', revenue: 180, growth: 0.20 },
  { month: '4月', revenue: 220, growth: 0.22 },
  { month: '5月', revenue: 280, growth: 0.27 },
  { month: '6月', revenue: 350, growth: 0.25 },
];

const configDual = myUtil.chartsAntD.configDualAxes({
  data: dataDual,
  xField: 'month',
  children: [
    {
      type: 'interval',
      yField: 'revenue',
      axisYTitle: '营收(万元)',
      valueFormat: '0,0',
    },
    {
      type: 'line',
      yField: 'growth',
      axisYTitle: '增长率',
      axisYPosition: 'right',
      valueFormat: '0.00%',
    },
  ],
});`,
              output: '<DualAxes {...configDual} />',
              exampleType: 'chart',
            },
            {
              title: '多指标双轴图',
              description: '复杂数据分析',
              input: `const dataDual2 = [
  { time: '2024-Q1', sales: 450, profit: 120, cost: 330 },
  { time: '2024-Q2', sales: 520, profit: 150, cost: 370 },
  { time: '2024-Q3', sales: 610, profit: 180, cost: 430 },
  { time: '2024-Q4', sales: 780, profit: 250, cost: 530 },
];

const configDual2 = myUtil.chartsAntD.configDualAxes({
  data: dataDual2,
  xField: 'time',
  axisXTitle: '季度',
  children: [
    {
      type: 'interval',
      yField: 'sales',
      colorField: '#5470C6',
      axisYTitle: '销售额',
      valueUnit: '万元',
    },
    {
      type: 'line',
      yField: 'profit',
      colorField: '#91CC75',
      axisYTitle: '利润',
      axisYPosition: 'right',
      valueUnit: '万元',
    },
  ],
});`,
              output: '<DualAxes {...configDual2} />',
              exampleType: 'chart',
            },
            {
              title: '收支对比双轴图',
              description: '收入支出对比分析',
              input: `const uvBillData = [
  { time: '1月', type: '支出', value: 80 },
  { time: '2月', type: '支出', value: 95 },
  { time: '3月', type: '支出', value: 110 },
  { time: '4月', type: '支出', value: 105 },
];

const transformData = [
  { time: '1月', type: '收入', value: 120 },
  { time: '2月', type: '收入', value: 145 },
  { time: '3月', type: '收入', value: 180 },
  { time: '4月', type: '收入', value: 195 },
];

const configDual3 = myUtil.chartsAntD.configDualAxes({
  xField: 'time',
  axisXTitle: '月份',
  children: [
    {
      data: uvBillData,
      type: 'interval',
      yField: 'value',
      axisYTitle: '支出',
      colorField: 'type',
      group: true,
    },
    {
      data: transformData,
      type: 'line',
      yField: 'value',
      axisYTitle: '收入',
      axisYPosition: 'right',
      colorField: 'type',
    },
  ],
});`,
              output: '<DualAxes {...configDual3} />',
              exampleType: 'chart',
            },
          ],
        },
      ],
    },
    {
      type: 'modal',
      name: '弹窗工具集',
      description:
        '基于 Ant Design Modal 提供弹窗封装工具，支持消息提示、确认对话框、内容查看等多种弹窗类型，简化弹窗使用流程。',
      dependencyTip: '依赖 antd 的 Modal、notification、message 组件',
      methods: [
        {
          name: 'getIcon',
          cnName: '获取图标',
          signature:
            'myUtil.modal.getIcon(infoType: ModalType): React.ReactNode',
          description: '根据消息类型获取对应的图标组件，支持六种消息类型。',
          module: 'modal',
          features: ['STABLE'],
          params: [
            {
              name: 'infoType',
              type: 'ModalType',
              required: true,
              description:
                '消息类型：info | success | error | warning | question | confirm',
            },
          ],
          returns: {
            type: 'React.ReactNode',
            description: '对应的图标组件，找不到类型时返回 null',
          },
          examples: [
            {
              title: '获取成功图标',
              input: "myUtil.modal.getIcon('success')",
              output: '<CheckCircleFilled />',
              exampleType: 'icon',
            },
            {
              title: '获取警告图标',
              input: "myUtil.modal.getIcon('warning')",
              output: '<ExclamationCircleOutlined />',
              exampleType: 'icon',
            },
            {
              title: '获取错误图标',
              input: "myUtil.modal.getIcon('error')",
              output: '<CloseCircleOutlined />',
              exampleType: 'icon',
            },
            {
              title: '获取信息图标',
              input: "myUtil.modal.getIcon('info')",
              output: '<InfoCircleOutlined />',
              exampleType: 'icon',
            },
          ],
          notes: ['图标会自动根据弹窗类型匹配'],
        },
        {
          name: 'info',
          cnName: '信息提示',
          signature: 'myUtil.modal.info(config?: ModalConfig): Modal',
          description: '显示信息提示弹窗，用于展示普通提示信息。',
          module: 'modal',
          features: ['STABLE'],
          params: [
            {
              name: 'config',
              type: 'ModalConfig',
              required: false,
              description: '弹窗配置对象（title、content、onOK 等）',
            },
          ],
          returns: {
            type: 'Modal',
            description: 'Modal 实例，可用于更新或销毁弹窗',
          },
          examples: [
            {
              title: '基础信息弹窗',
              input: `myUtil.modal.info({
  title: '提示',
  content: '这是一条普通提示信息',
});`,
              output: '(弹出信息提示弹窗)',
            },
            {
              title: '带确定回调',
              input: `myUtil.modal.info({
  title: '操作提示',
  content: '您确定要执行此操作吗？',
  onOK: () => console.log('用户点击了确定'),
});`,
              output: '(弹出带回调的信息弹窗)',
            },
          ],
        },
        {
          name: 'success',
          cnName: '成功提示',
          signature: 'myUtil.modal.success(config?: ModalConfig): Modal',
          description: '显示成功提示弹窗，用于展示操作成功的反馈信息。',
          module: 'modal',
          features: ['STABLE'],
          params: [
            {
              name: 'config',
              type: 'ModalConfig',
              required: false,
              description: '弹窗配置对象',
            },
          ],
          returns: {
            type: 'Modal',
            description: 'Modal 实例',
          },
          examples: [
            {
              title: '成功提示',
              input: `myUtil.modal.success({
  title: '操作成功',
  content: '数据已成功保存！',
});`,
              output: '(弹出成功提示弹窗)',
            },
          ],
        },
        {
          name: 'error',
          cnName: '错误提示',
          signature: 'myUtil.modal.error(config?: ModalConfig): Modal',
          description: '显示错误提示弹窗，用于展示操作失败或错误信息。',
          module: 'modal',
          features: ['STABLE'],
          params: [
            {
              name: 'config',
              type: 'ModalConfig',
              required: false,
              description: '弹窗配置对象',
            },
          ],
          returns: {
            type: 'Modal',
            description: 'Modal 实例',
          },
          examples: [
            {
              title: '错误提示',
              input: `myUtil.modal.error({
  title: '操作失败',
  content: '删除数据失败，请稍后重试。',
});`,
              output: '(弹出错误提示弹窗)',
            },
          ],
        },
        {
          name: 'warning',
          cnName: '警告提示',
          signature: 'myUtil.modal.warning(config?: ModalConfig): Modal',
          description: '显示警告提示弹窗，用于展示需要用户注意的警告信息。',
          module: 'modal',
          features: ['STABLE'],
          params: [
            {
              name: 'config',
              type: 'ModalConfig',
              required: false,
              description: '弹窗配置对象',
            },
          ],
          returns: {
            type: 'Modal',
            description: 'Modal 实例',
          },
          examples: [
            {
              title: '警告提示',
              input: `myUtil.modal.warning({
  title: '注意事项',
  content: '此操作不可撤销，请谨慎操作！',
});`,
              output: '(弹出警告提示弹窗)',
            },
          ],
        },
        {
          name: 'confirm',
          cnName: '确认对话框',
          signature:
            'myUtil.modal.confirm(config?: ModalConfig): ReturnType<typeof Modal.confirm>',
          description: '显示确认对话框，用于需要用户二次确认的场景。',
          module: 'modal',
          features: ['STABLE'],
          params: [
            {
              name: 'config',
              type: 'ModalConfig',
              required: false,
              description: '弹窗配置对象',
            },
          ],
          returns: {
            type: 'Modal',
            description: 'Modal 实例',
          },
          examples: [
            {
              title: '确认删除',
              input: `myUtil.modal.confirm({
  title: '操作提示',
  content: '确定删除吗',
  icon: 'info',
  onOk() {
    console.info('用户点击确定');
  },
  onCancel() {
    console.log('用户取消删除');
  },
});`,
              output: '(弹出确认对话框)',
            },
          ],
        },
        {
          name: 'viewJson',
          cnName: '查看 JSON',
          signature:
            'myUtil.modal.viewJson(config: { data: string | object; onChange?: (value: any) => void }): void',
          description: '以弹窗形式展示 JSON 数据，支持在线编辑功能。',
          module: 'modal',
          features: ['STABLE'],
          params: [
            {
              name: 'config.data',
              type: 'string | object',
              required: true,
              description: 'JSON 数据（字符串或对象）',
            },
            {
              name: 'config.onChange',
              type: '(value: any) => void',
              required: false,
              description: '数据变更回调',
            },
          ],
          returns: { type: 'void', description: '无返回值' },
          examples: [
            {
              title: '查看 JSON 数据',
              input: `myUtil.modal.viewJson({
  data: { name: '张三', age: 25, city: '北京' },
});`,
              output: '(弹出 JSON 数据查看弹窗)',
            },
            {
              title: '查看 JSON 字符串',
              input: `myUtil.modal.viewJson({
  data: '{"name": "李四", "score": 98}',
});`,
              output: '(弹出 JSON 数据查看弹窗)',
            },
          ],
        },
        {
          name: 'viewRichText',
          cnName: '查看富文本',
          signature:
            'myUtil.modal.viewRichText(config: { data: string }): void',
          description: '以弹窗形式展示 HTML 富文本内容。',
          module: 'modal',
          features: ['STABLE'],
          params: [
            {
              name: 'config.data',
              type: 'string',
              required: true,
              description: 'HTML 内容字符串',
            },
          ],
          returns: { type: 'void', description: '无返回值' },
          examples: [
            {
              title: '查看富文本',
              input: `myUtil.modal.viewRichText({
  data: '<h1>标题</h1><p>这是一段<strong>加粗</strong>文字。</p>',
});`,
              output: '(弹出富文本查看弹窗)',
            },
          ],
        },
        {
          name: 'viewMarkdown',
          cnName: '查看 Markdown',
          signature:
            'myUtil.modal.viewMarkdown(config: { data: string }): void',
          description: '以弹窗形式展示 Markdown 内容，自动渲染为 HTML。',
          module: 'modal',
          features: ['STABLE'],
          params: [
            {
              name: 'config.data',
              type: 'string',
              required: true,
              description: 'Markdown 内容字符串',
            },
          ],
          returns: { type: 'void', description: '无返回值' },
          examples: [
            {
              title: '查看 Markdown',
              input: `myUtil.modal.viewMarkdown({
  data: '# 标题\\n\\n这是一段普通文字。',
});`,
              output: '(弹出 Markdown 查看弹窗)',
            },
          ],
        },
        {
          name: 'responseInfo',
          cnName: 'API 响应处理',
          signature:
            'myUtil.modal.responseInfo(config: { code: string | number; msg: string | Record<string, any>; body?: Record<string, any> }): void',
          description: '根据 API 响应状态码自动展示对应的提示信息。',
          module: 'modal',
          features: ['STABLE'],
          params: [
            {
              name: 'config.code',
              type: 'string | number',
              required: true,
              description: '响应状态码',
            },
            {
              name: 'config.msg',
              type: 'string | Record<string, any>',
              required: true,
              description: '响应消息',
            },
            {
              name: 'config.body',
              type: 'Record<string, any>',
              required: false,
              description: '响应体数据',
            },
          ],
          returns: { type: 'void', description: '无返回值' },
          examples: [
            {
              title: '成功响应',
              input: `myUtil.modal.responseInfo({
  code: '200',
  msg: '操作成功',
});`,
              output: '(显示成功提示)',
            },
            {
              title: '失败响应（带详情）',
              input: `myUtil.modal.responseInfo({
  code: '500',
  msg: '请求处理失败',
  body: {
    sdp_msg_error: ['参数验证失败'],
    sdp_msg_warn: ['建议使用默认值'],
  },
});`,
              output: '(显示错误通知，包含详细信息)',
            },
          ],
        },
        {
          name: 'update',
          cnName: '更新弹窗',
          signature:
            'myUtil.modal.update(target: any, config: ModalConfig): void',
          description: '更新已打开的弹窗配置，可动态修改弹窗内容。',
          module: 'modal',
          features: ['STABLE'],
          params: [
            {
              name: 'target',
              type: 'any',
              required: true,
              description: '已打开的 Modal 实例',
            },
            {
              name: 'config',
              type: 'ModalConfig',
              required: true,
              description: '新的配置对象',
            },
          ],
          returns: { type: 'void', description: '无返回值' },
          examples: [
            {
              title: '动态更新弹窗',
              input: `const modal = myUtil.modal.info({
  title: '加载中',
  content: '正在处理...',
});

// 模拟异步操作完成后更新
setTimeout(() => {
  myUtil.modal.update(modal, {
    title: '完成',
    content: '处理已完成！',
  });
}, 2000);`,
              output: '(2秒后弹窗内容自动更新)',
            },
          ],
        },
      ],
    },
    {
      type: 'code',
      name: '码表处理',
      description:
        '提供码表的获取、缓存、转换等操作，支持本地存储和服务器端获取。',
      dependencyTip:
        '依赖 sessionStorage 进行本地缓存，依赖 apiGetCode 服务接口',
      methods: [
        {
          name: 'getHeaderFilterOption',
          cnName: '页头筛选格式',
          signature:
            'myUtil.code.getHeaderFilterOption(key: string, showCode?: boolean): { value: string; text: string }[]',
          description:
            '将码表数据转换为页头筛选格式，支持是否在显示文本中包含 code 值。',
          module: 'code',
          features: ['STABLE'],
          params: [
            {
              name: 'key',
              type: 'string',
              required: true,
              description: '码表标识',
            },
            {
              name: 'showCode',
              type: 'boolean',
              required: false,
              default: 'false',
              description: '是否在显示文本中包含 code 值',
            },
          ],
          returns: {
            type: '{ value: string; text: string }[]',
            description: '页头筛选格式的选项数组',
          },
          examples: [
            {
              title: '基础用法',
              input: `myUtil.code.getHeaderFilterOption('gender');`,
              output: `[
  { "value": "1", "text": "男" },
  { "value": "2", "text": "女" }
]`,
            },
            {
              title: '显示 code',
              input: `myUtil.code.getHeaderFilterOption('gender', true);`,
              output: `[
  { "value": "1", "text": "[1]   男" },
  { "value": "2", "text": "[2]   女" }
]`,
            },
          ],
          notes: ['码表数据从 sessionStorage 缓存获取', '码表为空时返回空数组'],
        },
        {
          name: 'getSelectOption',
          cnName: '下拉选择格式',
          signature:
            'myUtil.code.getSelectOption(key: string): { value: string; name: string; label: string }[]',
          description: '将码表数据转换为下拉选择格式。',
          module: 'code',
          features: ['STABLE'],
          params: [
            {
              name: 'key',
              type: 'string',
              required: true,
              description: '码表标识',
            },
          ],
          returns: {
            type: '{ value: string; name: string; label: string }[]',
            description: '下拉选择格式的选项数组',
          },
          examples: [
            {
              title: '基础用法',
              input: `myUtil.code.getSelectOption('status');`,
              output: `[
  { "value": "0", "name": "禁用", "label": "禁用" },
  { "value": "1", "name": "启用", "label": "启用" }
]`,
            },
          ],
          notes: ['name 和 label 字段值相同', '适用于 Ant Design Select 组件'],
        },
        {
          name: 'getUrlCodeParams',
          cnName: 'URL码表参数',
          signature:
            'myUtil.code.getUrlCodeParams(key: string): { url: string; params: Record<string, any> }',
          description: '获取 URL 类型码表的请求参数配置。',
          module: 'code',
          features: ['STABLE'],
          params: [
            {
              name: 'key',
              type: 'string',
              required: true,
              description: '码表标识（以 "url_" 开头）',
            },
          ],
          returns: {
            type: '{ url: string; params: Record<string, any> }',
            description: '请求配置对象',
          },
          examples: [
            {
              title: '获取 URL 参数',
              input: `myUtil.code.getUrlCodeParams('url_gy_hbhl');`,
              output: `{
  "url": "/yw/bszx/ggfw/sbcs/ywcsxx/queryHlxx",
  "params": {
    "page": 1,
    "pageSize": 999999,
    "searchModel": [{ "property": "hbzmDm", "value": "", "op": "al" }]
  }
}`,
            },
          ],
          notes: ['目前仅支持 url_gy_hbhl 类型', '未知类型返回空配置'],
        },
        {
          name: 'getCodeFromServer',
          cnName: '获取码表数据',
          signature:
            'myUtil.code.getCodeFromServer(key: string): Promise<any[]>',
          description: '从服务器获取码表数据，优先使用本地缓存。',
          module: 'code',
          features: ['STABLE'],
          params: [
            {
              name: 'key',
              type: 'string',
              required: true,
              description: '码表标识',
            },
          ],
          returns: {
            type: 'Promise<any[]>',
            description: '码表数据数组',
          },
          examples: [
            {
              title: '异步获取码表',
              input: `const data = await myUtil.code.getCodeFromServer('gender');
console.log(data);`,
              output: `[
  { "code": "1", "name": "男" },
  { "code": "2", "name": "女" }
]`,
            },
          ],
          notes: [
            '先检查本地缓存，命中则直接返回',
            '未命中则从静态文件或服务器获取',
          ],
        },
        {
          name: 'getCodeFromServerT1',
          cnName: '获取码表数据（增强）',
          signature:
            'myUtil.code.getCodeFromServerT1(key: string, path?: string): Promise<any[]>',
          description: '从服务器获取码表数据，支持 URL 类型和普通类型。',
          module: 'code',
          features: ['STABLE'],
          params: [
            {
              name: 'key',
              type: 'string',
              required: true,
              description: '码表标识',
            },
            {
              name: 'path',
              type: 'string',
              required: false,
              description: '可选的服务器路径',
            },
          ],
          returns: {
            type: 'Promise<any[]>',
            description: '码表数据数组',
          },
          examples: [
            {
              title: '普通码表',
              input: `const data = await myUtil.code.getCodeFromServerT1('gender');`,
              output: `[{ "code": "1", "name": "男" }, { "code": "2", "name": "女" }]`,
            },
            {
              title: '带路径参数',
              input: `const data = await myUtil.code.getCodeFromServerT1('dict', '/api/v1');`,
              output: '请求 /api/v1/dict 接口获取数据',
            },
          ],
          notes: [
            '支持 key 以 "url_" 开头的 URL 类型码表',
            '获取成功后自动保存到本地缓存',
          ],
        },
        {
          name: 'saveCodeToLocalTable',
          cnName: '保存码表到缓存',
          signature:
            'myUtil.code.saveCodeToLocalTable(key: string, codeTableData: any[]): void',
          description: '将码表数据保存到 sessionStorage 本地缓存。',
          module: 'code',
          features: ['STABLE'],
          params: [
            {
              name: 'key',
              type: 'string',
              required: true,
              description: '码表标识',
            },
            {
              name: 'codeTableData',
              type: 'any[]',
              required: true,
              description: '码表数据数组',
            },
          ],
          returns: { type: 'void', description: '无返回值' },
          examples: [
            {
              title: '保存码表',
              input: `myUtil.code.saveCodeToLocalTable('gender', [
  { code: '1', name: '男' },
  { code: '2', name: '女' }
]);`,
            },
          ],
          notes: ['空数组不会保存', '使用 sessionStorage 的 codeTable 键存储'],
        },
        {
          name: 'deleteCodeFromLocalTable',
          cnName: '删除本地码表',
          signature: 'myUtil.code.deleteCodeFromLocalTable(key: string): void',
          description: '从 sessionStorage 本地缓存中删除指定码表。',
          module: 'code',
          features: ['STABLE'],
          params: [
            {
              name: 'key',
              type: 'string',
              required: true,
              description: '码表标识',
            },
          ],
          returns: { type: 'void', description: '无返回值' },
          examples: [
            {
              title: '删除码表',
              input: `myUtil.code.deleteCodeFromLocalTable('gender');`,
            },
          ],
        },
        {
          name: 'getCode',
          cnName: '获取本地码表',
          signature: 'myUtil.code.getCode(key: string): any[]',
          description: '从 sessionStorage 本地缓存中获取码表数据。',
          module: 'code',
          features: ['STABLE'],
          params: [
            {
              name: 'key',
              type: 'string',
              required: true,
              description: '码表标识',
            },
          ],
          returns: {
            type: 'any[]',
            description: '码表数据数组，未找到返回空数组',
          },
          examples: [
            {
              title: '获取码表',
              input: `myUtil.code.getCode('gender');`,
              output: `[{ "code": "1", "name": "男" }, { "code": "2", "name": "女" }]`,
            },
          ],
        },
        {
          name: 'getCodeValByKey',
          cnName: '根据编码获取名称',
          signature:
            'myUtil.code.getCodeValByKey(targetCode: string | number, key: string, match?: { matchKey?, matchValKey? }): string',
          description:
            '根据 code 值获取码表对应的显示值，支持多个 code 值，用中文逗号分隔返回结果。',
          module: 'code',
          features: ['STABLE'],
          params: [
            {
              name: 'targetCode',
              type: 'string | number',
              required: true,
              description: '目标 code 值，支持逗号分隔的多个值',
            },
            {
              name: 'key',
              type: 'string',
              required: true,
              description: '码表标识',
            },
            {
              name: 'match',
              type: '{ matchKey?, matchValKey? }',
              required: false,
              description:
                '匹配配置，默认为 { matchKey: "code", matchValKey: "name" }',
            },
          ],
          returns: {
            type: 'string',
            description: '显示值，多个值用中文逗号分隔，未找到返回空字符串',
          },
          examples: [
            {
              title: '单个编码',
              input: `myUtil.code.getCodeValByKey('1', 'gender');`,
              output: '"男"',
            },
            {
              title: '多个编码',
              input: `myUtil.code.getCodeValByKey('1,2', 'gender');`,
              output: '"男，女"',
            },
            {
              title: '自定义匹配字段',
              input: `myUtil.code.getCodeValByKey('1-1-2', 'gender', { matchKey: 'code', matchValKey: 'pid' });`,
              output: '"1-1-1"',
            },
          ],
          notes: ['支持字符串和数字类型的 code 值', '码表为空时返回空字符串'],
        },
        {
          name: 'extractCodeTableParam',
          cnName: '提取码表参数',
          signature:
            'myUtil.code.extractCodeTableParam(configArray: any[], result: Record<string, { key: string }>): void',
          description: '从配置数组中递归提取所有码表参数。',
          module: 'code',
          features: ['STABLE'],
          params: [
            {
              name: 'configArray',
              type: 'any[]',
              required: true,
              description: '配置数组',
            },
            {
              name: 'result',
              type: 'Record<string, { key: string }>',
              required: true,
              description: '结果对象，用于收集码表参数',
            },
          ],
          returns: {
            type: 'void',
            description: '无返回值，结果通过 result 参数传出',
          },
          examples: [
            {
              title: '提取参数',
              input: `const config = [
  { codeTable: 'gender', label: '性别' },
  {
    children: [
      { codeTable: 'status', label: '状态' },
      { filter: { codeTable: 'type' } }
    ]
  }
];
const result = {};
myUtil.code.extractCodeTableParam(config, result);
console.log(result);`,
              output: `{
  "gender": { "key": "gender" },
  "status": { "key": "status" },
  "type": { "key": "type" }
}`,
            },
          ],
          notes: [
            '支持嵌套的 children 配置',
            '同时识别 codeTable 和 filter.codeTable',
          ],
        },
        {
          name: 'getCodeTableParamFromJson',
          cnName: '从JSON获取码表参数',
          signature:
            'myUtil.code.getCodeTableParamFromJson(param: { items? }): { key: string }[]',
          description: '从 JSON 配置对象中获取码表参数列表。',
          module: 'code',
          features: ['STABLE'],
          params: [
            {
              name: 'param',
              type: '{ items? }',
              required: true,
              description: '配置参数对象',
            },
          ],
          returns: {
            type: '{ key: string }[]',
            description: '码表参数数组',
          },
          examples: [
            {
              title: '获取码表参数',
              input: `const param = {
  items: [
    { codeTable: 'gender', label: '性别' },
    { codeTable: 'status', label: '状态' }
  ]
};
myUtil.code.getCodeTableParamFromJson(param);`,
              output: `[
  { "key": "gender" },
  { "key": "status" }
]`,
            },
          ],
          notes: [
            'items 为空数组时返回空数组',
            '内部调用 extractCodeTableParam 方法',
          ],
        },
        {
          name: 'getCodeTablePromise',
          cnName: '批量获取码表Promise',
          signature:
            'myUtil.code.getCodeTablePromise(apiParam: { key: string; path? }[]): Promise<any>[]',
          description: '将码表参数数组转换为 Promise 数组，用于批量获取码表。',
          module: 'code',
          features: ['STABLE'],
          params: [
            {
              name: 'apiParam',
              type: '{ key: string; path? }[]',
              required: true,
              description: '码表参数数组',
            },
          ],
          returns: {
            type: 'Promise<any>[]',
            description: 'Promise 数组',
          },
          examples: [
            {
              title: '批量获取码表',
              input: `const params = [
  { key: 'gender' },
  { key: 'status' }
];
const promises = myUtil.code.getCodeTablePromise(params);
const results = await Promise.all(promises);`,
            },
          ],
          notes: ['常与 Promise.all 配合使用批量获取码表'],
        },
        {
          name: 'updateCodeTableByKeys',
          cnName: '批量更新码表',
          signature: 'myUtil.code.updateCodeTableByKeys(codes: string[]): void',
          description: '批量更新指定码表，先删除本地缓存再重新获取。',
          module: 'code',
          features: ['STABLE'],
          params: [
            {
              name: 'codes',
              type: 'string[]',
              required: true,
              description: '码表标识数组',
            },
          ],
          returns: { type: 'void', description: '无返回值' },
          examples: [
            {
              title: '批量更新',
              input: `myUtil.code.updateCodeTableByKeys(['gender', 'status']);`,
            },
          ],
          notes: ['更新失败时显示错误提示', '自动处理缓存删除和重新获取'],
        },
        {
          name: 'updateCodeTableAll',
          cnName: '更新所有码表',
          signature: 'myUtil.code.updateCodeTableAll(): void',
          description: '更新本地 sessionStorage 缓存中的所有码表。',
          module: 'code',
          features: ['STABLE'],
          params: [],
          returns: { type: 'void', description: '无返回值' },
          examples: [
            {
              title: '更新所有',
              input: `myUtil.code.updateCodeTableAll();`,
            },
          ],
          notes: ['遍历所有本地缓存的码表进行更新'],
        },
      ],
    },
  ],
  changelog: [
    {
      version: '1.4.0',
      date: '2025-01-05',
      changes: [
        '新增码表处理模块（myUtil.code），提供码表的获取、缓存、转换等操作',
        '重构码表工具类，提高代码可读性和可维护性',
        '优化注释，全部采用中文输出',
      ],
    },
    {
      version: '1.3.0',
      date: '2025-01-05',
      changes: [
        '新增弹窗工具集模块（myUtil.modal），支持消息提示、确认对话框、内容查看、JSON/Markdown 查看等功能',
        '弹窗工具集支持 6 种消息类型（info/success/error/warning/question/confirm）的图标获取',
      ],
    },
    {
      version: '1.2.0',
      date: '2025-01-05',
      changes: [
        '新增图表工具模块（myUtil.chartsAntD），支持饼图、柱状图、折线图、面积图、双轴图配置',
        '重构图表工具类，提高代码可读性和可维护性',
        '图表工具支持智能 Tooltip、自定义标签、坐标轴配置等',
      ],
    },
    {
      version: '1.1.0',
      date: '2025-12-26',
      changes: [
        '新增 Word 文档处理模块（myUtil.word），支持创建标题、段落、表格、目录、页眉页脚',
        '重构 word 模块，提高代码可读性和可维护性',
        '优化注释，全部采用中文输出',
      ],
    },
    {
      version: '1.0.0',
      date: '2025-12-26',
      changes: [
        '初始化工具库',
        '支持 text、date、localStore、sessionStore、tree 五大模块',
      ],
    },
  ],
};
