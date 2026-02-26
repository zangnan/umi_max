import React, {forwardRef} from 'react';
import classNames from 'classnames';
import type {DraggableSyntheticListeners} from '@dnd-kit/core';
import type {Transform} from '@dnd-kit/utilities';
import {Handle} from '../Item/components/Handle';
import { draggable, draggableHorizontal, draggableVertical, } from './draggable-svg';
import styles from './Draggable.module.css';

export enum Axis {
  All,
  Vertical,
  Horizontal,
}

interface Props {
  axis?: Axis;
  dragOverlay?: boolean;
  dragging?: boolean;
  handle?: boolean;
  label?: string;
  listeners?: DraggableSyntheticListeners;
  style?: React.CSSProperties;
  buttonStyle?: React.CSSProperties;
  transform?: Transform | null;
}

const Draggable2: React.FC<any> = ({
  axis,
  dragOverlay,
  dragging,
  handle,
  listeners,
  transform,
  style,
  buttonStyle,
  ref,
  children,
  ...props
}) => {
  return (
    <div
      className={classNames(
        styles.Draggable,
        dragOverlay && styles.dragOverlay,
        dragging && styles.dragging,
        handle && styles.handle
      )}
      style={
        {
          ...style,
          '--translate-x': `${transform?.x ?? 0}px`,
          '--translate-y': `${transform?.y ?? 0}px`,
        } as React.CSSProperties
      }
    >
      <button
        {...props}
        aria-label="Draggable"
        data-cypress="draggable-item"
        {...(handle ? {} : listeners)}
        tabIndex={handle ? -1 : undefined}
        ref={ref}
        style={buttonStyle}
      >
        {axis === Axis.Vertical
          ? draggableVertical
          : axis === Axis.Horizontal
          ? draggableHorizontal
          : draggable}
        {handle ? <Handle {...(handle ? listeners : {})} /> : null}
        {/* {children} */}
      </button>
    </div>
  );
};

export default Draggable2;