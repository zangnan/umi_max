/**
 * DDBunit2_CKTS
 *
 * 出口退税业务专用：在 DDBunit2 基础上注入"原在线申报系统模块（CKTS）"业务能力。
 * 当前已实现：CKTS 小计（仅当 config.toolbar_default.ckts_sum === true 时，
 * 工具栏右侧出现"小计"按钮，点击后调用 cktsUtil.cktsCommonSum 弹出统计弹窗）。
 *
 * 后续会扩展更多出口退税业务能力。
 *
 * 实现要点：
 *  - 通过 DDBunit2 已有的 refDDBunit2 prop 拿到内部 imperative handle，
 *    无需修改 DDBunit2。
 *  - 小计按钮通过 enhancedConfig.customer_toolbar 注入到末尾，
 *    DDBunit2 的 getCustomerToobar() 渲染到工具栏 toobar-right 区域
 *    （与新建/编辑/删除同一行）。
 *  - handleXj 通过 enhancedFunc 注入兜底（业务模块可在 auto_configFun.tsx
 *    中自定义；未提供时使用 DDBunit2_CKTS 的 cktsCommonSum）。
 *  - CKTS_Sjxj 弹窗组件在外层挂载（不可见 Modal），由 cktsUtil.cktsCommonSum 触发。
 *  - 自动过滤 config.customer_toolbar 中由 DDBunit2_CKTS 内部接管的项：
 *      - func === 'handleXhcp'  → 序号重排按钮（后续扩展）
 *  - unit_key 直接从 config.module_key 取值（DDBunit2 内部 unitKey 派生规则等价）。
 */
import React, { useRef } from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import CKTS_Sjxj from '@/pages/hts/commonModule/xj/xj';
import CKTS_Xhcp from '@/pages/hts/commonModule/xhcp/xhcp';
import cktsUtil from '@/pages/hts/cktsUtil';
import { DDBunit2Props } from '@/components/DDBunit/DDBunit2.types';
import { DDBunit2CKTSConfig } from './DDBunit2_CKTS.types';

const DDBunit2_CKTS: React.FC<DDBunit2Props> = (props) => {
  // 业务模块的 auto_config.tsx / yearDataConfig.tsx 等运行时实际包含
  // CKTS 业务字段（ckts_sum / ckts_order / unit_constant），通过类型断言访问。
  // 这些字段的类型定义见 ./DDBunit2_CKTS.types.ts（基于 DDBunit2Config 交叉扩展）。
  const { func, authority } = props;
  const config = props.config as DDBunit2CKTSConfig;

  // 用于获取 DDBunit2 内部 imperative handle
  const refDDBunit2 = useRef<any>();

  // CKTS_Sjxj 弹窗组件的 ref（通过 onRef 暴露 showModal）
  const refCktsSum = useRef<any>();

  // CKTS_Xhcp 弹窗组件的 ref（通过 onRef 暴露 showModal）
  const refCktsXhcp = useRef<any>();

  /**
   * 触发小计：组装参数后调用 cktsUtil.cktsCommonSum
   */
  const cktsCommonSum = () => {
    const handle = refDDBunit2?.current;
    const param: any = {
      refCktsSum,
      unit_key: config?.module_key,
      unit_lcswsx_dm: cktsUtil.getLcswsxDm(config?.unit_constant),
      gridData: handle?.getGridData?.(),
      gridParams: handle?.getGridParams?.(),
      selectionRowKeys: handle?.getSelectionRowKeys?.(),
      setMasker: handle?.setMasker,
    };
    cktsUtil.cktsCommonSum(param);
  };

  /**
   * 触发序号重排：组装参数后调用 cktsUtil.cktsCommonXhcp
   */
  const cktsCommonXhcp = () => {
    const handle = refDDBunit2?.current;
    const param: any = {
      refCktsXhcp,
      ckts_order: config?.toolbar_default?.ckts_order,
      unit_key: config?.module_key,
      unit_lcswsx_dm: cktsUtil.getLcswsxDm(config?.unit_constant),
      unitRef: refDDBunit2,
      // 透传 gridData：cktsUtil.cktsCommonXhcp 会从中提取 ssq/sbpc 作为弹窗默认值
      // （与 code_sample f.tsx:42-56 范式一致）。
      gridData: handle?.getGridData?.(),
    };
    cktsUtil.cktsCommonXhcp(param);
  };

  const showCktsSum = !!config?.toolbar_default?.ckts_sum;
  const showCktsXhcp = (config?.toolbar_default?.ckts_order || 0) > 0;

  // DDBunit2_CKTS 内部接管的 func（用于过滤 customer_toolbar 中由 CKTS 接管但还未提供实现的项目）
  // 'handleXj' 和 'handleXhcp' 都已由 DDBunit2_CKTS 通过 enhancedFunc 注入实现，不再过滤
  const CKTS_INTERNAL_FUNCS: string[] = [];

  // 注入 CKTS 业务按钮到 customer_toolbar 末尾
  // DDBunit2 的 getCustomerToobar() 会渲染它们，位置在工具栏 toobar-right Space 内
  const enhancedConfig = {
    ...config,
    customer_toolbar: [
      ...(config?.customer_toolbar || []).filter(
        (item: any) => !CKTS_INTERNAL_FUNCS.includes(item?.func),
      ),
      // 注入"小计"按钮（仅当 toolbar_default.ckts_sum=true 时）
      ...(showCktsSum ? [{ name: '小计', key: 'xj', func: 'handleXj' }] : []),
      // 注入"序号重排"按钮（仅当 toolbar_default.ckts_order > 0 时）
      ...(showCktsXhcp
        ? [{ name: '序号重排', key: `xhcp_${config?.toolbar_default?.ckts_order}`, func: 'handleXhcp' }]
        : []),
    ],
  };

  // 通过 func 注入 handleXj / handleXhcp 兜底：
  //   1) 业务模块在 auto_configFun.tsx 中已提供 → 优先使用
  //   2) 否则使用 DDBunit2_CKTS 提供的 cktsCommonSum / cktsCommonXhcp 兜底
  const enhancedFunc = {
    ...func,
    handleXj: (param: any) => {
      if (func?.handleXj) {
        return func.handleXj(param);
      }
      cktsCommonSum();
    },
    handleXhcp: (param: any) => {
      if (func?.handleXhcp) {
        return func.handleXhcp(param);
      }
      cktsCommonXhcp();
    },
  };

  return (
    <>
      {/* 透传所有 props，并通过 refDDBunit2 拿内部 imperative handle */}
      <DDBunit2
        config={enhancedConfig}
        func={enhancedFunc}
        authority={authority}
        refDDBunit2={refDDBunit2}
      />
      {/* 小计弹窗（CKTS_Sjxj 通过 onRef 暴露 showModal） */}
      {showCktsSum && <CKTS_Sjxj onRef={refCktsSum} />}
      {/* 序号重排弹窗（CKTS_Xhcp 通过 onRef 暴露 showModal） */}
      {showCktsXhcp && <CKTS_Xhcp onRef={refCktsXhcp} />}
    </>
  );
};

export default DDBunit2_CKTS;
