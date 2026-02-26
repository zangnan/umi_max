
import { CSSProperties } from 'react';
import { useDragLayer } from 'react-dnd';

const customDragLayer = ({ children, index, left, top, width }: any) => {
  const { isDragging, item, initialOffset, currentOffset, delta }: any = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));
  if (!item) {
    return null;
  }
  if (index !== item.index) {
    return null;
  }
  if (!isDragging) {
    return null;
  }

	function doSnapToGrid(x: number, y: number): [number, number] {
		const snappedX = Math.round(x / 20) * 20;
		const snappedY = Math.round(y / 20) * 20;
		return [snappedX, snappedY];
	}
  
  function getItemStyles(initialOffset: any, currentOffset: any): CSSProperties {
    if ((currentOffset.x - initialOffset.x === 0) || (currentOffset.y - initialOffset.y === 0)) {
      return {
        display: 'none',
      }
    }
     // 移动后坐标 - 移动前坐标 + 初始位置
    let x = currentOffset.x - initialOffset.x + left;
    let y = currentOffset.y - initialOffset.y + top;
    [x, y] = doSnapToGrid(x, y);
    const transform = `translate(${x}px, ${y}px)`;
    return {
      transform,
      WebkitTransform: transform,
      opacity: 0.5,
      position: 'absolute',
      width: `${width}px`
    }
  }

  return (
    <div className='drag-layer' style={getItemStyles(initialOffset, currentOffset)}>{children}</div>
  );
};
export default customDragLayer;