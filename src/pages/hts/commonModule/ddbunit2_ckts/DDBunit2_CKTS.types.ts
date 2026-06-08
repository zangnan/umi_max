/**
 * DDBunit2_CKTS 类型扩展
 *
 * 设计原则：
 *  - `DDBunit2.types.ts` 与 master 主线保持一致（不侵入基线）
 *  - CKTS 业务扩展字段（toolbar_default.ckts_sum、toolbar_default.ckts_order、unit_constant）
 *    通过本文件以 TypeScript 交叉类型（&）方式扩展，避免使用 declaration merging
 *    （因 DDBunit2Config.toolbar_default 是内联对象字面量，声明合并无法注入字段）
 *
 * 运行时安全保证：
 *  - 业务模块的 auto_config.tsx / yearDataConfig.tsx 等实际运行时均已包含这些 CKTS 字段
 *  - DDBunit2_CKTS.tsx 内部用 `as DDBunit2CKTSConfig` 类型断言访问这些字段（无运行时影响）
 */
import { DDBunit2Config } from '@/components/DDBunit/DDBunit2.types';

/**
 * 扩展后的 toolbar_default 字段
 * 在 DDBunit2Config['toolbar_default'] 基础上添加 CKTS 业务字段
 */
export type CKTSToolbarDefault = NonNullable<DDBunit2Config['toolbar_default']> & {
  /** 是否显示小计按钮（默认 false） */
  ckts_sum?: boolean;
  /** 序号重排（默认 0） */
  ckts_order?: number;
};

/**
 * DDBunit2_CKTS 使用的 config 类型
 * 在 DDBunit2Config 基础上扩展：
 *  - toolbar_default: 扩展为 CKTSToolbarDefault
 *  - unit_constant?: 模块配置常量
 */
export type DDBunit2CKTSConfig = Omit<DDBunit2Config, 'toolbar_default'> & {
  toolbar_default?: CKTSToolbarDefault;
  /** 模块配置常量（CKTS 业务），如 'lcswsxDm=LCSXA081038001' */
  unit_constant?: string;
};
