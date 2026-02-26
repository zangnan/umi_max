/** 模块类型 */
export type ModuleType =
  | 'text'
  | 'date'
  | 'localStore'
  | 'sessionStore'
  | 'tree'
  | 'word'
  | 'chartsAntD'
  | 'modal';

/** 参数定义 */
export interface ParamDefinition {
  name: string;
  type: string;
  required: boolean;
  default?: string;
  description: string;
}

/** 返回值定义 */
export interface ReturnDefinition {
  type: string;
  description: string;
}

/** 方法特性标签 */
export type MethodFeature =
  | 'NEW' // 新增
  | 'DEPRECATED' // 已废弃
  | 'STABLE' // 稳定
  | 'ASYNC'; // 异步

/** 示例类型 */
export type ExampleType = 'code' | 'chart' | 'icon';

/** 示例定义 */
export interface MethodExample {
  title: string;
  input: string;
  output: string;
  description?: string;
  /** 示例类型：code-普通代码示例, chart-图表示例, icon-图标示例 */
  exampleType?: ExampleType;
}

/** 方法文档 */
export interface MethodDoc {
  /** 方法名称（唯一标识） */
  name: string;
  /** 方法中文名 */
  cnName: string;
  /** 方法签名 */
  signature: string;
  /** 功能描述 */
  description: string;
  /** 所属模块 */
  module: ModuleType;
  /** 特性标签 */
  features?: MethodFeature[];
  /** 参数列表 */
  params?: ParamDefinition[];
  /** 返回值 */
  returns: ReturnDefinition;
  /** 使用示例 */
  examples: MethodExample[];
  /** 注意事项 */
  notes?: string[];
  /** 依赖外部库 */
  dependencies?: string[];
}

/** 模块文档 */
export interface ModuleDoc {
  type: ModuleType;
  name: string;
  description: string;
  methods: MethodDoc[];
  dependencyTip?: string;
}

/** 文档数据 */
export interface UtilDocData {
  title: string;
  version: string;
  lastUpdated: string;
  description: string;
  modules: ModuleDoc[];
  installTip: {
    npm: string;
    yarn: string;
  };
  changelog: {
    version: string;
    date: string;
    changes: string[];
  }[];
}
