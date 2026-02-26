import React, { useState, useEffect } from 'react';
import { List, Card } from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
import { getGridData } from '@/services/hts/api';
import { cloneDeep } from 'lodash';

const PicList: React.FC<any> = ({ }) => {

  const [myPagination, setPagination] = useState<any>({
    ... CONSTANTS.GRID_PAGINATION,
  });

  const [data, setData] = useState<any>([]);

  let setListData = (param?: any) => {
    let pageSize = param?.pageSize || CONSTANTS.GRID_PAGINATION?.pageSize;
    let page = param?.page || CONSTANTS.GRID_PAGINATION?.current;
    let searchModel: any = [];
    let apiParam = { pageSize, page, searchModel };
    getGridData('/dict/automatic/exp/bs/queryPager', apiParam).then((response: any) => {
      setData(response?.body?.rows);
      let tmpPagination = cloneDeep(myPagination);
      tmpPagination.total = response?.body?.rowCount || 0;
      tmpPagination.current = page;
      tmpPagination.pageSize = pageSize;
      tmpPagination.onChange = onChange;
      setPagination(tmpPagination);
    })
  }

  let onChange = (page: any, pageSize: any) => {
    setListData({ page, pageSize });
  };

  useEffect(() => {
    setListData();
  }, []);

  return <div style={{ background: '#ffffff', padding: '24px'}} >
    <List
      grid={{ gutter: 16, column: 4 }}
      dataSource={data}
      pagination={myPagination}
      renderItem={(item: any) => (
        <List.Item>
          <Card hoverable
            // style={{ width: 240 }}
            cover={<img alt="example" src={item.mediaUrl} />} >
            <Card.Meta title={item.mediaTitel} description={item.mediaDescription} />
          </Card>
        </List.Item>
      )}
    />
  </div>
}

export default PicList;