/**
 * AI 对话 + JSON 解析 + Sheet 转换 Hook
 * 参考 AITheme.tsx 的 providerFactory 模式
 */

import { useState, useCallback, useRef } from 'react';
import {
  DeepSeekChatProvider,
  SSEFields,
  useXChat,
  useXConversations,
  XModelMessage,
  XModelParams,
  XModelResponse,
  XRequest,
} from '@ant-design/x-sdk';
import DDXaiUtil from '@/components/DDXai/DDXaiUtil';
import { message } from 'antd';
import type { AIResponseData, SheetData, ChatMessage } from '../types/module';
import { convertToSheets } from '../utils/sheetConverter';

const DEFAULT_CONVERSATION_KEY = 'module-gen-default';

interface UseModuleAIOptions {
  onSuccess?: (sheetData: SheetData) => void;
  onError?: (error: string) => void;
}

interface UseModuleAIReturn {
  messages: any[];
  isRequesting: boolean;
  abort: () => void;
  submitRequirement: (requirement: string) => void;
  sheetData: SheetData | null;
  setSheetData: (data: SheetData | null) => void;
  aiRawContent: string;
}

/**
 * useModuleAI Hook
 */
export const useModuleAI = (options?: UseModuleAIOptions): UseModuleAIReturn => {
  const { onSuccess, onError } = options || {};

  const [sheetData, setSheetData] = useState<SheetData | null>(null);
  const [aiRawContent, setAiRawContent] = useState<string>('');
  const providerCachesRef = useRef(new Map<string, DeepSeekChatProvider>());

  // ==================== Provider Factory ====================
  const providerFactory = useCallback((conversationKey: string) => {
    const callbacks = {
      onSuccess: (chunks: any) => {
        // 从 SSE 流中提取 JSON 内容
        let tmpContent = '';
        for (let i = 0; i < chunks.length; i++) {
          if (chunks[i]) {
            const chunkData = chunks[i]?.data || '{}';
            // 跳过 [DONE] 等非 JSON 字符串
            if (!chunkData || chunkData === '[DONE]') continue;
            let parsed: any;
            try {
              parsed = JSON.parse(chunkData) || {};
            } catch (errInfo) {
              parsed = {};
              console.info(errInfo);
            }
            const delta = parsed?.choices?.length > 0 ? parsed?.choices[0]?.delta?.content : '';
            tmpContent += delta;
          }
        }

        setAiRawContent(tmpContent);

        // 清理 JSON 字符串
        let cleanedContent = tmpContent
          ?.replace(/```json\s*/g, '')
          ?.replace(/```\s*/g, '')
          ?.trim();

        // 解析 JSON
        let jsonData: AIResponseData;
        try {
          jsonData = JSON.parse(cleanedContent || '{}');
        } catch (errInfo) {
          console.error('JSON 解析失败', errInfo);
          onError?.('AI 返回的数据格式错误，无法解析为 JSON');
          return;
        }

        // 验证必需字段
        if (!jsonData.tables || !jsonData.modules) {
          onError?.('AI 返回的 JSON 缺少必需字段 (tables, modules)');
          return;
        }

        // 转换为 4 Sheet 结构
        const sheets = convertToSheets(jsonData);
        setSheetData(sheets);
        onSuccess?.(sheets);
        message.success('模块配置生成成功');
      },
    };

    if (!providerCachesRef.current.get(conversationKey)) {
      const { aiUrl, aiParam } = DDXaiUtil.setReqParam({
        deepThink: false,
        factory: 'deepseek',
        callbacks,
      });

      providerCachesRef.current.set(
        conversationKey,
        new DeepSeekChatProvider({
          request: XRequest<XModelParams, Partial<Record<SSEFields, XModelResponse>>>(
            aiUrl,
            aiParam,
          ),
        }),
      );
    }

    return providerCachesRef.current.get(conversationKey);
  }, [onSuccess, onError]);

  // ==================== Conversations ====================
  const { activeConversationKey, setActiveConversationKey } = useXConversations({
    defaultConversations: [
      { key: DEFAULT_CONVERSATION_KEY, label: '模块生成', group: 'default' },
    ],
    defaultActiveConversationKey: DEFAULT_CONVERSATION_KEY,
  });

  // ==================== XChat ====================
  const { onRequest, messages, isRequesting, abort } = useXChat<ChatMessage>({
    provider: providerFactory(activeConversationKey) as any,
    conversationKey: activeConversationKey,
    defaultMessages: [],
    requestPlaceholder: () => ({
      content: '正在生成模块配置...',
      role: 'assistant',
    }),
  });

  // ==================== Submit ====================
  const submitRequirement = useCallback((requirement: string) => {
    if (!requirement.trim()) {
      message.warning('请输入模块需求');
      return;
    }

    // 动态导入 prompt 模板
    import('../utils/promptTemplate').then(({ getModulePrompt }) => {
      const prompt = getModulePrompt(requirement);
      onRequest({ messages: [{ role: 'user', content: prompt }] });
      setActiveConversationKey(DEFAULT_CONVERSATION_KEY);
    });
  }, [onRequest, setActiveConversationKey]);

  return {
    messages,
    isRequesting,
    abort,
    submitRequirement,
    sheetData,
    setSheetData,
    aiRawContent,
  };
};

export default useModuleAI;