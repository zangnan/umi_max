import {forwardRef} from 'react';

export const Container = forwardRef<any>((
  {
    children,
    handleProps,
    onRemove,
    label,
    style,
    ...props
  }: any,
  ref
) => {
  return (
    <div
      {...props}
      ref={ref}
      style={style}
    >
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        {label}
        <div>
          <span {...props} onClick={onRemove}>X</span>
          <span {...handleProps} >:::</span>
        </div>
      </div>
      {children}
    </div>
  );
});