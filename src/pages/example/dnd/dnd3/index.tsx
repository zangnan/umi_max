// import DroppableStory from './DroppableStory';
import React, {useState} from 'react';
import { DndContext, useDraggable, UniqueIdentifier } from '@dnd-kit/core';
import { Draggable, DraggableOverlay, Droppable, GridContainer, Wrapper, } from '../components';

interface DraggableProps {
  handle?: boolean;
}

function DraggableItem({handle}: DraggableProps) {
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

const Dnd3: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [parent, setParent] = useState<UniqueIdentifier | null>(null);

  const item = <DraggableItem />;
  const containers = ['A', 'B', 'C'];
  return (
    <DndContext
      onDragStart={() => setIsDragging(true)}
      onDragEnd={({over}) => {
        setParent(over ? over.id : null);
        setIsDragging(false);
      }}
      onDragCancel={() => setIsDragging(false)}
    >
      <Wrapper>
        <Wrapper style={{width: 350, flexShrink: 0}}>
          {parent === null ? item : null}
        </Wrapper>
        <GridContainer columns={2}>
          {containers.map((id: any) => (
            <Droppable key={id} id={id} dragging={isDragging}>
              {parent === id ? item : null}
            </Droppable>
          ))}
        </GridContainer>
      </Wrapper>
      <DraggableOverlay />
    </DndContext>
  );
}
export default Dnd3;