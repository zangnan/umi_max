import React from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';

const SortableItem: React.FC<any> = ({
  id,
  children,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, } = useSortable({
    id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const style2= { width: '100px', height: '100px', backgroundColor: '#dddddd', margin: '10px' };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div style={style2}>{children}</div>
    </div>
  );
}
export default SortableItem;