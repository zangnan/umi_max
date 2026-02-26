import { Conversations } from '@ant-design/x';
import { useState } from 'react';
import { type GetProp } from 'antd';
import myUtil from '../DDAssist/util';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
dayjs.extend(isSameOrBefore);


const defaultActiveKey = myUtil.text.uuid();
const defaultConversationsItems: any = [ { key: defaultActiveKey, label: `新对话 ${defaultActiveKey}`, active: true, list: [] }];
myUtil.sessionStore.setItem('deepseek', defaultConversationsItems);

const [conversationsItems, setConversationsItems] = useState(defaultConversationsItems);
const [activeKey, setActiveKey] = useState(defaultActiveKey);

const clearDeepseek = () => myUtil.sessionStore.clear('deepseek');

// 添加新对话
const onAddConversation = () => {
  let newKey: any = myUtil.text.uuid();
  let conversationsItemNew: any = { key: newKey, label: `新对话 ${newKey}`, active: true, list: [] };
  let conversationsItemOld: any = [ ...conversationsItems ];
  conversationsItemOld.forEach((tmp: any) => { // 原有每条对话置非active状态
    tmp.active = false;
  });
  let allConversationsItems: any = [
    ...conversationsItemOld,
    conversationsItemNew,
  ]
  myUtil.sessionStore.setItem('deepseek', allConversationsItems);
  setConversationsItems(allConversationsItems);
  setActiveKey(newKey);
};

// 切换对话
const onConversationClick: GetProp<typeof Conversations, 'onActiveChange'> = (key) => {
  let storeDeepseek: any =  myUtil.sessionStore.getItem('deepseek') || [];
  storeDeepseek.forEach((tmp: any) => { // 原有每条对话置非active状态
    tmp.active = false;
    if (key === tmp.key) {
      tmp.active = true;
    }
  });
  myUtil.sessionStore.setItem('deepseek', storeDeepseek);
  setActiveKey(key);
};



// 测试数据
const dataSource: any = [
  {date: '2025-03-03 12:00:00', title: '测试标题1', answer: '测试标题1的回答'},
  {date: '2025-03-02 12:00:00', title: '测试标题1', answer: '测试标题1的回答'},
  {date: '2025-03-02 11:00:00', title: '测试标题1', answer: '测试标题1的回答'},
  {date: '2025-02-01 12:00:00', title: '测试标题2', answer: '测试标题2的回答'},
  {date: '2025-02-01 10:00:00', title: '测试标题3', answer: '测试标题3的回答'},
  {date: '2025-01-01 12:00:00', title: '测试标题4', answer: '测试标题4的回答'},
];

// 当前基准时间
const now = dayjs();

// 时间范围分组逻辑
const groupItems = dataSource.reduce((acc: any, item: any) => {
  const date = dayjs(item.date);
  const diffDays = now.diff(date, 'day');

  if (date.isSame(now, 'day')) {
    acc['今天'].push(item);
  } else if (diffDays <= 7 && diffDays > 0) {
    acc['最近7天'].push(item);
  } else if (diffDays <= 30) {
    acc['最近30天'].push(item);
  } else if (diffDays <= 365) {
    acc['最近1年'].push(item);
  } else {
    acc['更早'].push(item);
  }
  return acc;
}, {
  '今天': [],
  '最近7天': [],
  '最近30天': [],
  '最近1年': [],
  '更早': []
});

// 转换排序后的分组数组
const sortedGroups = Object.entries(groupItems)
  .map(([group, items]) => ({
    group,
    items: items.sort((a, b) =>
      dayjs(b.date).isBefore(dayjs(a.date)) ? -1 : 1
    )
  }))
  .filter(group => group.items.length > 0);