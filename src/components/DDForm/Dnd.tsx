import { CSSProperties, useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import type { DragSourceMonitor } from 'react-dnd';

function getStyles(
  left: number,
  top: number,
  isDragging: boolean,
  width: number
): CSSProperties {
  const transform = `translate3d(${left}px, ${top}px, 0)`
  return {
    transform,
    WebkitTransform: transform,
    opacity: isDragging ? 0 : 1,
    height: isDragging ? 0 : '',
    position: 'absolute',
    width: `${width}px`
  }
}

const Dnd = ({ children, index, left, top, width }: any) => {
  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: 'box',
      item: { index, left, top },
      collect: (monitor: DragSourceMonitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [index, left, top],
  )

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [])

  return (
    <div
      ref={drag}
      style={getStyles(left, top, isDragging, width)}
      role="DraggableBox"
    >
      {children}
    </div>
  );
};
export default Dnd;