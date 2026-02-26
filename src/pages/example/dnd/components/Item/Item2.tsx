import React from 'react';

export const Item = React.memo(
  React.forwardRef<HTMLLIElement, any>(
    (
      {
        handleProps,
        listeners,
        style,
        value,
      },
      ref
    ) => {
      return <span
        ref={ref}
        style={{position: 'relative', display: 'flex', flexGrow: 1, padding: '18px 20px', ...style}}
      >
        {value}
        <span
            {...handleProps}
            {...listeners}
            style={{ cursor: 'grab', display: 'flex', alignSelf: 'flex-start', marginLeft: 'auto'}}>
          :::
        </span>
      </span>;
    }
  )
);