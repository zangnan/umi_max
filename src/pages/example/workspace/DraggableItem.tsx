import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Draggable } from '../../../pages/example/dnd/components';

const DraggableItem: React.FC<any> = ({
  handle,
}) => {
  const {isDragging, setNodeRef, listeners} = useDraggable({
    id: 'draggable-item',
  });
  return (
    <Draggable
      dragging={isDragging}
      ref={setNodeRef}
      handle={handle}
      listeners={listeners}
      style={{
        opacity: isDragging ? 0 : undefined,
      }}
    />
  );
}
export default DraggableItem;