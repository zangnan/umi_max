import { Tag } from "antd";
import { render } from "react-dom";
import { useState } from 'react';
import { arrayMove, sortableContainer, sortableElement } from 'react-sortable-hoc';
import { FallOutlined, RiseOutlined } from "@ant-design/icons";

const SortableContainer = sortableContainer(({ children }) => {
  return <div>{children}</div>;
});
export interface DDTsort {
  data?: any;
}

const DDTzSort: React.FC<DDTsort> = ({ data }) => {
  const SortableItem = sortableElement(({ value, order }) => {
    {
      if (order === 'desc') {
        return <Tag icon={<FallOutlined />} color="#55acee">{value}</Tag>
      } else if (order === 'asc') {
        return <Tag icon={<RiseOutlined />} color="#3b5999">{value}</Tag>
      } else return ''
    }
  });

  const [date, setDate] = useState<any>(data.map((value: any) => value.col));
  const [order, setOrder] = useState<any>(data.map((value: any) => value.order));
  const gitmen = ({ oldIndex, newIndex }) => {
    setDate(arrayMove(date, oldIndex, newIndex))
    setOrder(arrayMove(order, oldIndex, newIndex))
  }
  return (
    <>
      <SortableContainer onSortEnd={gitmen} axis="x" >
        {date.map((value: any, index: any) => (
          <SortableItem key={`${value}`} index={index} value={value} order={order[index]} />
        ))}
      </SortableContainer>
    </>
  );
}

export default DDTzSort;