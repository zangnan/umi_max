import React, { useEffect, useState, memo } from 'react';
import { Descriptions, message, Typography, Space } from 'antd';
import myUtil from '../DDAssist/util';
import formUtil from '../DDForm/formUtil';
import { itemType } from '../DDForm/data.d';
import DDBaseGrid from '../DDBaseGrid';
import CONSTANTS from '../DDAssist/constants';
import { groupBy } from 'lodash';

const DDDescriptions: React.FC<any> = ({
  config,
  func,
}) => {
  const [groupData, setGroupData] = useState<any>({});     // 表单分组数据
  const descColumn = { xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 3 };
  const descBordered = true;
  const descSize = 'small'; // default middle small

  const drawDescription: any = () => {
    // 组为单位绘制
    let aaa: any = [];
    Object.keys(groupData).forEach((groupKey: any, index: any) => {
      let descriptionsItems: any = [];
      let formValue = config.form_value || {};
      let formItems = groupData[groupKey];
      let groupTitle: any = '';
      let childrenGridItems: any = [];
      for (let i = 0; i < formItems.length; i++) {
        let item = formItems[i] || {};
        let tmpLabel = item.name;
        if (formValue[tmpLabel]?.constructor === String) {
          formValue[tmpLabel] = formValue[tmpLabel]?.trim() || '';
        }
        let tmpChildren = formValue[tmpLabel];
        if (item.type === itemType.Hidden) {
          continue;
        }
        if (item.type === itemType.GroupTitle) { // 分组标题
          groupTitle = item.label;
          continue;
        }
        // 表单特殊类型处理
        if (tmpChildren) {
          if (item.type === itemType.DatePicker) {  // 日期类型
            tmpChildren = myUtil.date.formatDate(tmpChildren, item.format || 'YYYY-MM-DD');
          } else if (item.type === itemType.InputNumber) {  // 数值类型
            tmpChildren = myUtil.text.formatNum(tmpChildren, item.format || '0,0');
          } else if (item.type === itemType.Select) {  // 下拉类型
            tmpChildren = myUtil.code.getCodeValByKey(tmpChildren, item.codeTable);
          }
        }
        let span = item.desLayout || CONSTANTS.DEFAULT_DESCRIPTION_LAYOUT_33P_ROW;
        if (item.type === itemType.List && tmpChildren?.length > 0) {
          let grid_columns = item?.grid_columns || [];
          let grid_columns_filter = grid_columns.filter((item3: any) => {
            if (!item3.dataIndex) {
              return false;
            }
            return true;
          });
          let tableConfig = { grid_columns: grid_columns_filter };
          childrenGridItems.push(<DDBaseGrid config={tableConfig} userDataSource={tmpChildren} pagination={false} />);
        } else {
          descriptionsItems.push({
            ...item,
            key: i + '',
            children: tmpChildren,
            span,
          });
        }
      }
      let titleNode = <>
        <Typography.Title level={5}>{groupTitle}</Typography.Title>
      </>
      aaa.push(<div key={index}>
        <Descriptions bordered={descriptionsItems.length > 0 ? descBordered : false} size={descSize} title={titleNode} items={descriptionsItems} column={descColumn} />
        {childrenGridItems.length > 0 && childrenGridItems}
      </div>);
    });
    return <Space orientation="vertical" size={24} style={{ display: 'flex' }}>{aaa}</Space>;
  };

  const initFormItems = () => {
    let tmp = formUtil.init({
      items: config?.form_items || [],
      func,
    })
    let finalItems: any = [...tmp];
    // 码表解析处理：从json类型入参中解析码表查询参数
    const param = myUtil.code.getCodeTableParamFromJson({
      items: [...finalItems || []],
    });
    // 码表解析处理：获取码表接口promise
    const promiseArr = myUtil.code.getCodeTablePromise(param);
    // 码表解析处理：从json类型入参中解析treeSelect参数
    const param1 = myUtil.treeCode.getTreeCodeTableParamFromJson({
      items: [...(finalItems || [])],
    });
    const promiseArr1 = myUtil.treeCode.getTreeCodeTablePromise(param1);
    promiseArr1.forEach((item: any) => {
      promiseArr.push(item);
    });
    // 码表解析处理：获取码表
    Promise.all(promiseArr)
      .then(() => {})
      .catch(() => { message.error('获取码表失败'); })
      .finally(() => {
        let formItems = config.form_items;
        let formItems2 = [];
        // FormItems增加分组字段
        let groupFlagIndex = 0;
        for (let i = 0; i < formItems.length; i++) {
          let item = formItems[i] || {};
          if (item.type === itemType.Hidden) {
            continue;
          }
          if (item.type === itemType.GroupTitle) {
            groupFlagIndex = groupFlagIndex + 1;
          }
          item.groupFlag = 'g' + groupFlagIndex;
          formItems2.push(item);
        }
        // FormItems分组
        const groupData: any = groupBy(formItems2, 'groupFlag') || {};
        setGroupData(groupData);
      });
  }

  useEffect(() => {
    initFormItems();
  }, [config]);

  return (<div style={{marginTop: '12px'}}>
    {drawDescription()}
  </div>);
};
export default memo(DDDescriptions);