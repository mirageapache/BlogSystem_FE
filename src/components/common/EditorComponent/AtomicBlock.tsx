import React from 'react';

function AtomicBlock(props: any) {
  const { block, contentState } = props;
  const entity = contentState.getEntity(block.getEntityAt(0));
  const { src } = entity.getData();
  const type = entity.getType();

  if (type === 'image') {
    return <img src={src} alt="" />;
  }

  return null;
}

export default AtomicBlock;
