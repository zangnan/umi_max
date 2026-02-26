/**
 * UtilDoc 文档展示配置
 * 用于控制文档各区域的显示/隐藏
 */
export interface UtilDocConfig {
  /** 是否显示依赖提示，默认不显示 */
  showDependencyTip: boolean;
  /** 是否显示安装与导入，默认不显示 */
  showInstallAndImport: boolean;
  /** 是否显示使用示例，默认显示 */
  showExamples: boolean;
  /** 是否显示在线测试，默认显示 */
  showPlayground: boolean;
  /** 是否显示输入参数，默认显示 */
  showParams: boolean;
  /** 是否显示输出参数（返回值），默认显示 */
  showReturns: boolean;
}

/**
 * 默认配置
 */
export const defaultUtilDocConfig: UtilDocConfig = {
  showDependencyTip: false,
  showInstallAndImport: false,
  showExamples: true,
  showPlayground: true,
  showParams: true,
  showReturns: true,
};

/**
 * 当前使用的配置
 * 可以根据需要修改此对象的属性来调整显示行为
 */
export const utilDocConfig: UtilDocConfig = {
  ...defaultUtilDocConfig,
  // 在这里覆盖默认配置
  // 例如：showDependencyTip: true  // 显示依赖提示
};
