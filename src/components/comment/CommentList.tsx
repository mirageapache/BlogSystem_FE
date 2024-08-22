import React from 'react';
import { CommentDataType } from 'types/commentType';
import CommentItem from './CommentItem';

function CommentList(props: { commentListData: CommentDataType[] }) {
  const { commentListData } = props;

  const listData = commentListData.map((item) => {
    return <CommentItem key={item._id} commentData={item} />;
  });

  return (
    <div>
      <div>{listData}</div>
    </div>
  );
}

export default CommentList;
