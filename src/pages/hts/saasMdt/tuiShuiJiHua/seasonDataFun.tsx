import React from 'react';
import { tuishuijihuaAdd, tuishuijihuaDel, tuishuijihuaAddCheck, exportPager, updateDataTz } from '@/pages/hts/services/htsApi';
import { message, Tooltip, Form, Input, Select, Row, Col } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import baseValidator from '@/components/DDAssist/field/baseValidator';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { intl as intl2 } from '@/components/DDAssist/util';
import myUtil from '@/components/DDAssist/util';
import DDAlert from '@/pages/hts/commonModule/DDAlert';
import { history, useRouteData } from 'umi';

const Func: any = {
  refUnit: React.createRef(),
};

export default Func;
