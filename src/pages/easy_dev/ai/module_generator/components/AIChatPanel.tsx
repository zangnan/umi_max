/**
 * AI 对话面板组件（Java 版本）
 */

import { GlobalOutlined } from '@ant-design/icons';
import { Bubble, Prompts, Sender } from '@ant-design/x';
import { Flex, Avatar } from 'antd';
import XMarkdown from '@ant-design/x-markdown';
import React, { useRef, useEffect } from 'react';
import '@ant-design/x-markdown/themes/light.css';
import '@ant-design/x-markdown/themes/dark.css';
import { useMarkdownTheme } from '@/components/DDXai/DDXaiUtil';
import type { BubbleListProps } from '@ant-design/x';
import type { ChatMessage } from '../types/module';

interface AIChatPanelProps {
  messages: ChatMessage[];
  isRequesting: boolean;
  onSubmit: (value: string) => void;
  onCancel: () => void;
  inputValue: string;
  setInputValue: (value: string) => void;
}

// 示例需求
const HOT_TOPICS = {
  key: '1',
  label: '示例需求',
  children: [
    {
      key: '1-1',
      description: '创建一个员工管理模块，包含姓名、工号、部门、职位、入职日期等字段',
      icon: <span style={{ color: '#1890ff', fontWeight: 700 }}>1</span>,
    },
    {
      key: '1-2',
      description: '创建一个订单管理模块，包含订单号、客户信息、商品明细、总金额、订单状态等',
      icon: <span style={{ color: '#52c41a', fontWeight: 700 }}>2</span>,
    },
    {
      key: '1-3',
      description: '创建一个项目管理模块，包含项目名称、项目经理、开始日期、结束日期、项目状态等',
      icon: <span style={{ color: '#faad14', fontWeight: 700 }}>3</span>,
    },
    {
      key: '1-4',
      description: '创建人员管理模块（主表），包含子表：人员学历管理、人员工作经历管理；关联表（rel）：人员性格标签管理；关联表（rel2）：人员权限管理（通过人员与人员权限关系表关联）。创建国别码表、大连区县码表、性别码表、汽油类别码表。',
      icon: <span style={{ color: '#722ed1', fontWeight: 700 }}>4</span>,
    },
    {
      key: '1-5',
      description: '创建一个部门管理模块，包含部门名称、部门编码、上级部门等字段（树形结构）',
      icon: <span style={{ color: '#eb2f96', fontWeight: 700 }}>5</span>,
    },
  ],
};

const getRole = (
  className: string,
): BubbleListProps['role'] => ({
  assistant: {
    placement: 'start',
    header: () => (
      <Avatar icon={<GlobalOutlined />} style={{ background: '#1677ff' }} />
    ),
    contentRender: (content: any, { status }) => {
      const newContent = content?.replace(/\n\n/g, '<br/><br/>');
      return (
        <XMarkdown
          paragraphTag="div"
          components={{}}
          className={className}
          streaming={{
            hasNextChunk: status === 'updating',
            enableAnimation: true,
          }}
        >
          {newContent}
        </XMarkdown>
      );
    },
  },
  user: {
    placement: 'end',
    contentRender: (content: any) => {
      const reg = /<userReq>([\s\S]*?)<\/userReq>/;
      const matchResult = content.match(reg);
      let userReqContent = '';
      if (matchResult && matchResult[1]) {
        userReqContent = matchResult[1].trim();
      } else {
        userReqContent = content;
      }
      return <>{userReqContent}</>;
    },
  },
});

const AIChatPanel: React.FC<AIChatPanelProps> = ({
  messages,
  isRequesting,
  onSubmit,
  onCancel,
  inputValue,
  setInputValue,
}) => {
  const [className] = useMarkdownTheme();
  const chatListRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    if (chatListRef.current) {
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
    }
  }, [messages]);

  const chatList = (
    <div ref={chatListRef} style={{ flex: 1, overflow: 'auto', padding: '0 16px' }}>
      {messages?.length ? (
        <Bubble.List
          items={messages?.map((i: any) => ({
            ...i.message,
            key: i.id,
            status: i.status,
            loading: i.status === 'loading',
          }))}
          styles={{ bubble: { maxWidth: '100%' } }}
          role={getRole(className)}
        />
      ) : (
        <Flex vertical gap={16} align="center" style={{ maxWidth: 600, margin: '0 auto' }}>
          <Bubble.List
            items={[
              {
                key: 'welcome',
                content: '描述你想要创建的模块，系统将为你生成符合 data_dict_template.xlsx 规范的模块配置（Java版本）。',
                role: 'assistant',
                header: () => (
                  <Avatar icon={<GlobalOutlined />} style={{ background: '#1677ff' }} />
                ),
              },
            ]}
            styles={{ bubble: { maxWidth: '100%' } }}
            role={{
              assistant: {
                placement: 'start',
                contentRender: (content: any) => <>{content}</>,
              },
            }}
          />
          <Prompts
            items={[HOT_TOPICS]}
            styles={{
              list: { height: '100%' },
              item: {
                flex: 1,
                backgroundImage: 'linear-gradient(123deg, #e5f4ff 0%, #efe7ff 100%)',
                borderRadius: 12,
                border: 'none',
              },
              subItem: { padding: 0, background: 'transparent' },
            }}
            onItemClick={(info) => {
              onSubmit(info.data.description as string);
            }}
          />
        </Flex>
      )}
    </div>
  );

  const chatSender = (
    <Flex vertical gap={12} align="center" style={{ padding: '0 16px 16px' }}>
      <Sender
        value={inputValue}
        onSubmit={() => {
          onSubmit(inputValue);
        }}
        onChange={setInputValue}
        onCancel={onCancel}
        loading={isRequesting}
        placeholder="描述你想要创建的模块需求（Java版本）..."
        autoSize={{ minRows: 2, maxRows: 6 }}
      />
    </Flex>
  );

  return (
    <Flex vertical style={{ height: '100%' }}>
      {chatList}
      {chatSender}
    </Flex>
  );
};

export default AIChatPanel;