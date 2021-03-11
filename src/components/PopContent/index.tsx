import React, { Fragment } from 'react';
import { Popover } from 'antd';
import type { PropsWithChildren } from 'react';

interface PopContentProps {
  text?: string | null;
  limit?: number;
  popWidth?: number;
}
const PopContent = ({
  text,
  limit = 15,
  popWidth = 500,
  children,
}: PropsWithChildren<PopContentProps>) => {
  if (!text || text.length < limit) {
    return <Fragment>{text}</Fragment>;
  }

  let sliced = text.slice(0, limit);

  let style;
  if (sliced.length < text.length) {
    sliced += ' ...';
    style = { cursor: 'pointer' };
  }

  return (
    <Popover
      content={children || text}
      overlayStyle={{ maxWidth: popWidth, wordBreak: 'break-word' }}
      overlayInnerStyle={{ maxWidth: popWidth, wordBreak: 'break-word' }}
    >
      <div style={style}>{sliced}</div>
    </Popover>
  );
};

export default PopContent;
